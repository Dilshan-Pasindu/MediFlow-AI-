using System.Security.Claims;
using MediFlow.Api.Controllers;
using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MediFlow.Tests;

public class DispensingAndBillingTests : IDisposable
{
    private readonly AppDbContext _db;

    public DispensingAndBillingTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);
        SeedTestData();
    }

    public void Dispose()
    {
        _db.Database.EnsureDeleted();
        _db.Dispose();
    }

    private static ControllerContext BuildContext(int userId, string role)
    {
        var claims = new[]
        {
            new Claim("userId", userId.ToString()),
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Role, role)
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);
        return new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };
    }

    private void SeedTestData()
    {
        var pharmacistUser = new User { Id = 3, FullName = "Bob Smith", Email = "bob@example.com", Role = UserRole.Pharmacist };
        var patientUser = new User { Id = 2, FullName = "Alice Brown", Email = "alice@example.com", Role = UserRole.Patient };
        _db.Users.AddRange(pharmacistUser, patientUser);

        var patient = new Patient { Id = 1, UserId = 2, FullName = "Alice Brown", Email = "alice@example.com" };
        _db.Patients.Add(patient);

        var pharmacy = new Pharmacy { Id = 1, Name = "MediFlow Central Pharmacy", OwnerId = 3 };
        _db.Pharmacies.Add(pharmacy);

        var medicine = new Medicine { Id = 10, MedicineName = "Amoxicillin 500mg", GenericName = "Amoxicillin", Category = "Antibiotic" };
        _db.Medicines.Add(medicine);

        var inventoryItem = new InventoryItem
        {
            Id = 100,
            PharmacyId = 1,
            MedicineId = 10,
            CurrentStock = 20,
            MinStockLevel = 5,
            UnitPrice = 15.50m
        };
        _db.InventoryItems.Add(inventoryItem);

        _db.SaveChanges();
    }

    [Fact]
    public async Task GenerateBill_IsIdempotent_DoesNotDuplicateInvoice()
    {
        var ctrl = new OrdersController(_db) { ControllerContext = BuildContext(3, "Pharmacist") };

        var order = new MedicineOrder
        {
            Id = 1,
            PharmacyId = 1,
            PatientId = 1,
            PharmacistId = 3,
            Status = OrderStatus.Pending,
            TotalAmount = 31.00m,
            Items = new List<OrderItem>
            {
                new OrderItem { MedicineId = 10, MedicineName = "Amoxicillin 500mg", Quantity = 2, UnitPrice = 15.50m, Subtotal = 31.00m }
            }
        };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        // First call
        var result1 = await ctrl.GenerateBill(1);
        var ok1 = Assert.IsType<OkObjectResult>(result1);
        var invoice1 = Assert.IsType<InvoiceDto>(ok1.Value);
        Assert.Equal("INV-000001", invoice1.InvoiceNumber);

        // Second call (idempotent)
        var result2 = await ctrl.GenerateBill(1);
        var ok2 = Assert.IsType<OkObjectResult>(result2);
        var invoice2 = Assert.IsType<InvoiceDto>(ok2.Value);
        Assert.Equal("INV-000001", invoice2.InvoiceNumber);

        Assert.Equal(1, await _db.Invoices.CountAsync(i => i.MedicineOrderId == 1));
    }

    [Fact]
    public async Task RecordPayment_RequiresBillToExistFirst_Returns400IfNoBill()
    {
        var ctrl = new OrdersController(_db) { ControllerContext = BuildContext(3, "Pharmacist") };

        var order = new MedicineOrder
        {
            Id = 2,
            PharmacyId = 1,
            PatientId = 1,
            Status = OrderStatus.Pending,
            TotalAmount = 15.50m
        };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        var result = await ctrl.RecordPayment(2, new RecordPaymentDto("Cash"));
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("No invoice exists", badRequest.Value?.ToString());
    }

    [Fact]
    public async Task ReadyToDispensed_BlockedWithoutPaidInvoice_Returns409()
    {
        var ctrl = new OrdersController(_db) { ControllerContext = BuildContext(3, "Pharmacist") };

        var order = new MedicineOrder
        {
            Id = 3,
            PharmacyId = 1,
            PatientId = 1,
            Status = OrderStatus.Ready,
            TotalAmount = 15.50m,
            Items = new List<OrderItem>
            {
                new OrderItem { MedicineId = 10, MedicineName = "Amoxicillin 500mg", Quantity = 1, UnitPrice = 15.50m, Subtotal = 15.50m }
            }
        };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        // Attempt dispensing without any invoice
        var resultNoBill = await ctrl.UpdateOrderStatus(3, new UpdateOrderStatusDto("Dispensed"));
        var conflict1 = Assert.IsType<ConflictObjectResult>(resultNoBill);
        Assert.Contains("Payment must be recorded", conflict1.Value?.ToString());

        // Generate bill (unpaid)
        await ctrl.GenerateBill(3);

        // Attempt dispensing with unpaid invoice
        var resultUnpaid = await ctrl.UpdateOrderStatus(3, new UpdateOrderStatusDto("Dispensed"));
        var conflict2 = Assert.IsType<ConflictObjectResult>(resultUnpaid);
        Assert.Contains("Payment must be recorded", conflict2.Value?.ToString());
    }

    [Fact]
    public async Task ReadyToDispensed_BlockedByUnacknowledgedHighSeverityWarning_OnPendingToConfirmed()
    {
        var ctrl = new OrdersController(_db) { ControllerContext = BuildContext(3, "Pharmacist") };

        var rx = new Prescription
        {
            Id = 50,
            DoctorId = 1,
            PatientId = 1,
            Status = PrescriptionStatus.Active,
            SafetyCheckedAt = DateTime.UtcNow
        };
        _db.Prescriptions.Add(rx);

        var log = new DrugInteractionLog
        {
            PrescriptionId = 50,
            DrugA = "DrugA",
            DrugB = "DrugB",
            SeverityLevel = "High",
            Description = "Severe interaction",
            WarningType = WarningType.DrugInteraction,
            AcknowledgedAt = null
        };
        _db.DrugInteractionLogs.Add(log);

        var order = new MedicineOrder
        {
            Id = 4,
            PrescriptionId = 50,
            PharmacyId = 1,
            PatientId = 1,
            Status = OrderStatus.Pending,
            TotalAmount = 15.50m
        };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        var result = await ctrl.UpdateOrderStatus(4, new UpdateOrderStatusDto("Confirmed"));
        var conflict = Assert.IsType<ConflictObjectResult>(result);
        Assert.Contains("unacknowledged High-severity drug interaction warning", conflict.Value?.ToString());
    }

    [Fact]
    public async Task ReadyToDispensed_BlockedByInsufficientStock_Returns400()
    {
        var ctrl = new OrdersController(_db) { ControllerContext = BuildContext(3, "Pharmacist") };

        var order = new MedicineOrder
        {
            Id = 5,
            PharmacyId = 1,
            PatientId = 1,
            Status = OrderStatus.Ready,
            TotalAmount = 465.00m,
            Items = new List<OrderItem>
            {
                new OrderItem { MedicineId = 10, MedicineName = "Amoxicillin 500mg", Quantity = 30, UnitPrice = 15.50m, Subtotal = 465.00m }
            }
        };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        // CurrentStock is 20, requested is 30 -> GenerateBill should fail with BadRequest
        var billResult = await ctrl.GenerateBill(5);
        var badRequestBill = Assert.IsType<BadRequestObjectResult>(billResult);
        Assert.Contains("Not enough stock available", badRequestBill.Value?.ToString());

        // Manually attach a paid invoice to test UpdateOrderStatus stock guard as well
        _db.Invoices.Add(new Invoice
        {
            MedicineOrderId = 5,
            InvoiceNumber = "INV-000005",
            IssuedAt = DateTime.UtcNow,
            TotalAmount = 465.00m,
            IsPaid = true,
            PaymentMethod = "Credit Card"
        });
        await _db.SaveChangesAsync();

        var result = await ctrl.UpdateOrderStatus(5, new UpdateOrderStatusDto("Dispensed"));
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("insufficient inventory stock", badRequest.Value?.ToString());

        var invItem = await _db.InventoryItems.FindAsync(100);
        Assert.Equal(20, invItem!.CurrentStock); // Stock untouched
    }

    [Fact]
    public async Task ReadyToDispensed_Success_DecrementsStock_CreatesTransaction_AndLocksOrder()
    {
        var ctrl = new OrdersController(_db) { ControllerContext = BuildContext(3, "Pharmacist") };

        var order = new MedicineOrder
        {
            Id = 6,
            PharmacyId = 1,
            PatientId = 1,
            Status = OrderStatus.Ready,
            TotalAmount = 77.50m,
            Items = new List<OrderItem>
            {
                new OrderItem { MedicineId = 10, MedicineName = "Amoxicillin 500mg", Quantity = 5, UnitPrice = 15.50m, Subtotal = 77.50m }
            }
        };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        await ctrl.GenerateBill(6);
        await ctrl.RecordPayment(6, new RecordPaymentDto("Cash"));

        // Execute Dispense
        var result = await ctrl.UpdateOrderStatus(6, new UpdateOrderStatusDto("Dispensed"));
        var ok = Assert.IsType<OkObjectResult>(result);
        var orderDto = Assert.IsType<OrderDto>(ok.Value);
        Assert.Equal("Dispensed", orderDto.Status);

        // Verify stock decremented from 20 to 15
        var invItem = await _db.InventoryItems.FindAsync(100);
        Assert.Equal(15, invItem!.CurrentStock);

        // Verify InventoryTransaction created
        var tx = await _db.InventoryTransactions.FirstOrDefaultAsync(t => t.InventoryItemId == 100);
        Assert.NotNull(tx);
        Assert.Equal(TransactionType.Dispense, tx.TransactionType);
        Assert.Equal(-5, tx.QuantityChanged);
        Assert.Equal(15, tx.StockAfter);

        // Verify order is locked against further item/bill/payment changes
        var addResult = await ctrl.AddOrderItem(6, new AddOrderItemRequestDto(10, 1));
        Assert.IsType<ConflictObjectResult>(addResult);

        var updateItemResult = await ctrl.UpdateOrderItem(6, 1, new UpdateOrderItemQuantityDto(2));
        Assert.IsType<ConflictObjectResult>(updateItemResult);

        var deleteItemResult = await ctrl.DeleteOrderItem(6, 1);
        Assert.IsType<ConflictObjectResult>(deleteItemResult);

        var billResult = await ctrl.GenerateBill(6);
        Assert.IsType<ConflictObjectResult>(billResult);

        var paymentResult = await ctrl.RecordPayment(6, new RecordPaymentDto("Cash"));
        Assert.IsType<ConflictObjectResult>(paymentResult);
    }
}
