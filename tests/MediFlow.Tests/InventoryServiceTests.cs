using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using MediFlow.Api.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MediFlow.Tests;

public class InventoryServiceTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly InventoryService _inventoryService;

    public InventoryServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);
        _inventoryService = new InventoryService(_db);
    }

    public void Dispose()
    {
        _db.Database.EnsureDeleted();
        _db.Dispose();
    }

    [Fact]
    public async Task GetInventoryAsync_ReturnsCorrectStatusAndPagination()
    {
        // Arrange
        var pharmacy = new Pharmacy { Id = 1, Name = "Test Pharmacy", OwnerId = 1 };
        var med1 = new Medicine { Id = 1, MedicineName = "Med A", Category = "Pain" };
        var med2 = new Medicine { Id = 2, MedicineName = "Med B", Category = "Pain" };
        
        _db.Pharmacies.Add(pharmacy);
        _db.Medicines.AddRange(med1, med2);

        _db.InventoryItems.Add(new InventoryItem { Id = 1, PharmacyId = 1, MedicineId = 1, CurrentStock = 100, MinStockLevel = 50 }); // OK
        _db.InventoryItems.Add(new InventoryItem { Id = 2, PharmacyId = 1, MedicineId = 2, CurrentStock = 5, MinStockLevel = 50 });  // Critical
        
        await _db.SaveChangesAsync();

        // Act
        var resultAll = await _inventoryService.GetInventoryAsync(1);
        var resultCritical = await _inventoryService.GetInventoryAsync(1, stockFilter: "Critical");

        // Assert
        Assert.Equal(2, resultAll.TotalCount);
        Assert.Equal(1, resultAll.CriticalCount);
        Assert.Single(resultCritical.Items);
        Assert.Equal("Critical", resultCritical.Items.First().StockStatus);
    }

    [Fact]
    public async Task RestockStateMachine_ValidTransitions_WorkCorrectly()
    {
        // Arrange
        var pharmacy = new Pharmacy { Id = 1, Name = "Test Pharmacy", OwnerId = 1 };
        var supplier = new SupplierProfile { Id = 1, UserId = 2, CompanyName = "Test Supplier" };
        var med = new Medicine { Id = 1, MedicineName = "Med A" };
        
        _db.Pharmacies.Add(pharmacy);
        _db.SupplierProfiles.Add(supplier);
        _db.Medicines.Add(med);
        
        var invItem = new InventoryItem { Id = 1, PharmacyId = 1, MedicineId = 1, CurrentStock = 10, MinStockLevel = 50 };
        _db.InventoryItems.Add(invItem);
        await _db.SaveChangesAsync();

        // 1. Create Request
        var createDto = new CreateRestockRequestDto(1, "Test request", new List<CreateRestockRequestItemDto>
        {
            new CreateRestockRequestItemDto(1, 100, 10m)
        });
        
        var request = await _inventoryService.CreateRestockRequestAsync(1, createDto);
        Assert.Equal(RestockRequestStatus.Pending, request.Status);

        // 2. Approve
        var updateDto = new UpdateRestockStatusDto("Approved", null, null);
        var approvedReq = await _inventoryService.UpdateRestockStatusAsync(request.Id, updateDto, 2);
        Assert.Equal(RestockRequestStatus.Approved, approvedReq.Status);

        // 3. Dispatch
        var dispatchDto = new UpdateRestockStatusDto("Dispatched", null, new List<UpdateRestockItemBatchDto>
        {
            new UpdateRestockItemBatchDto(approvedReq.Items.First().Id, "BATCH-123", DateTime.UtcNow.AddMonths(12))
        });
        var dispatchedReq = await _inventoryService.UpdateRestockStatusAsync(request.Id, dispatchDto, 2);
        Assert.Equal(RestockRequestStatus.Dispatched, dispatchedReq.Status);
        
        // Ensure dispatch doesn't update inventory
        var currentInv = await _db.InventoryItems.FirstAsync(i => i.Id == 1);
        Assert.Equal(10, currentInv.CurrentStock);

        // Fast-forward status to Delivered (simulated physical delivery, normally done by courier integration or supplier)
        dispatchedReq.Status = RestockRequestStatus.Delivered;
        await _db.SaveChangesAsync();

        // 4. Confirm Receipt (updates inventory)
        var receiveDto = new ReceiveRestockDto("Arrived in good condition");
        var completedReq = await _inventoryService.ConfirmReceiptAsync(request.Id, receiveDto);
        
        Assert.Equal(RestockRequestStatus.Completed, completedReq.Status);
        
        // 5. Verify Inventory Update
        var updatedInv = await _db.InventoryItems
            .Include(i => i.Batches)
            .Include(i => i.Transactions)
            .FirstAsync(i => i.Id == 1);
            
        Assert.Equal(110, updatedInv.CurrentStock); // 10 + 100
        Assert.Single(updatedInv.Batches);
        Assert.Equal("BATCH-123", updatedInv.Batches.First().BatchNumber);
        Assert.Contains(updatedInv.Transactions, t => t.TransactionType == TransactionType.Restock && t.QuantityChanged == 100);
    }
    
    [Fact]
    public async Task ConfirmReceipt_FailsIfNotDelivered()
    {
        // Arrange
        var request = new RestockRequest { Id = 99, PharmacyId = 1, SupplierProfileId = 1, Status = RestockRequestStatus.Dispatched };
        _db.RestockRequests.Add(request);
        await _db.SaveChangesAsync();

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => 
            _inventoryService.ConfirmReceiptAsync(99, new ReceiveRestockDto(null)));
        Assert.Contains("can only be received when status is 'Delivered'", ex.Message);
    }
}
