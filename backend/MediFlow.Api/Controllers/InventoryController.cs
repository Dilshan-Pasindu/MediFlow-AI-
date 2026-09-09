using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using MediFlow.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Security.Claims;

namespace MediFlow.Api.Controllers;

/// <summary>
/// Handles pharmacy inventory queries, low-stock detection, and restock recommendations.
/// </summary>
[ApiController]
[Route("api")]
[Authorize]
public class InventoryController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly InventoryService _inventoryService;

    public InventoryController(AppDbContext db, InventoryService inventoryService)
    {
        _db = db;
        _inventoryService = inventoryService;
    }

    /// <summary>
    /// GET /api/pharmacies/{pharmacyId}/inventory
    /// Get paginated inventory with search, category filter, and stock status filter.
    /// Accessible by: PharmacyOwner (own pharmacy), Pharmacist, Administrator.
    /// </summary>
    [HttpGet("pharmacies/{pharmacyId:int}/inventory")]
    [Authorize(Roles = "PharmacyOwner,Pharmacist,Administrator")]
    public async Task<IActionResult> GetInventory(
        int pharmacyId,
        [FromQuery] string? search = null,
        [FromQuery] string? category = null,
        [FromQuery] string? stockFilter = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        // PharmacyOwner can only access their own pharmacy
        if (User.IsInRole("PharmacyOwner"))
        {
            var ownerId = GetUserId();
            var pharmacy = await _db.Pharmacies.FindAsync(pharmacyId);
            if (pharmacy == null || pharmacy.OwnerId != ownerId)
                return Forbid();
        }

        var result = await _inventoryService.GetInventoryAsync(pharmacyId, search, category, stockFilter, page, pageSize);
        return Ok(result);
    }

    /// <summary>
    /// GET /api/inventory/low-stock
    /// Returns all inventory items below their minimum stock level.
    /// Accessible by: PharmacyOwner, Pharmacist, Administrator.
    /// </summary>
    [HttpGet("inventory/low-stock")]
    [Authorize(Roles = "PharmacyOwner,Pharmacist,Administrator")]
    public async Task<IActionResult> GetLowStock([FromQuery] int? pharmacyId = null)
    {
        // PharmacyOwner must be restricted to their own pharmacy
        if (User.IsInRole("PharmacyOwner"))
        {
            var ownerId = GetUserId();
            var ownedPharmacy = await _db.Pharmacies.FirstOrDefaultAsync(p => p.OwnerId == ownerId);
            if (ownedPharmacy == null) return Ok(new List<InventoryItemDto>());
            pharmacyId = ownedPharmacy.Id;
        }

        var items = await _inventoryService.GetLowStockAsync(pharmacyId);
        return Ok(items);
    }

    /// <summary>
    /// POST /api/pharmacies/{pharmacyId}/generate-restock-recommendations
    /// Non-CRUD: Calculates demand-based restock recommendations and returns
    /// structured agent context for the Inventory Intelligence Agent.
    /// Accessible by: PharmacyOwner (own pharmacy only), Administrator.
    /// </summary>
    [HttpPost("pharmacies/{pharmacyId:int}/generate-restock-recommendations")]
    [Authorize(Roles = "PharmacyOwner,Administrator")]
    public async Task<IActionResult> GenerateRestockRecommendations(int pharmacyId)
    {
        if (User.IsInRole("PharmacyOwner"))
        {
            var ownerId = GetUserId();
            var pharmacy = await _db.Pharmacies.FindAsync(pharmacyId);
            if (pharmacy == null || pharmacy.OwnerId != ownerId)
                return Forbid();
        }

        try
        {
            var result = await _inventoryService.GenerateRestockRecommendationsAsync(pharmacyId);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// GET /api/pharmacies/{pharmacyId}/inventory/{itemId}/batches
    /// Get all batches for a specific inventory item (expiry tracking).
    /// </summary>
    [HttpGet("pharmacies/{pharmacyId:int}/inventory/{itemId:int}/batches")]
    [Authorize(Roles = "PharmacyOwner,Pharmacist,Administrator")]
    public async Task<IActionResult> GetBatches(int pharmacyId, int itemId)
    {
        var item = await _db.InventoryItems
            .Include(i => i.Batches)
            .Include(i => i.Medicine)
            .FirstOrDefaultAsync(i => i.Id == itemId && i.PharmacyId == pharmacyId);

        if (item == null) return NotFound(new { message = "Inventory item not found." });

        return Ok(InventoryService.MapToDto(item));
    }

    /// <summary>
    /// GET /api/inventory/transactions
    /// Get transaction history for agent demand analysis.
    /// </summary>
    [HttpGet("inventory/transactions")]
    [Authorize(Roles = "PharmacyOwner,Administrator")]
    public async Task<IActionResult> GetTransactions(
        [FromQuery] int? pharmacyId = null,
        [FromQuery] int? medicineId = null,
        [FromQuery] int days = 30)
    {
        if (User.IsInRole("PharmacyOwner"))
        {
            var ownerId = GetUserId();
            var ownedPharmacy = await _db.Pharmacies.FirstOrDefaultAsync(p => p.OwnerId == ownerId);
            if (ownedPharmacy == null) return Ok(new List<object>());
            pharmacyId = ownedPharmacy.Id;
        }

        var cutoff = DateTime.UtcNow.AddDays(-days);

        var query = _db.InventoryTransactions
            .Include(t => t.InventoryItem)
                .ThenInclude(i => i!.Medicine)
            .Where(t => t.TransactionDate >= cutoff);

        if (pharmacyId.HasValue)
            query = query.Where(t => t.InventoryItem!.PharmacyId == pharmacyId.Value);

        if (medicineId.HasValue)
            query = query.Where(t => t.InventoryItem!.MedicineId == medicineId.Value);

        var transactions = await query
            .OrderByDescending(t => t.TransactionDate)
            .Select(t => new
            {
                t.Id,
                MedicineName = t.InventoryItem!.Medicine!.MedicineName,
                t.TransactionType,
                t.QuantityChanged,
                t.StockAfter,
                t.TransactionDate,
                t.Notes
            })
            .ToListAsync();

        return Ok(transactions);
    }

    /// <summary>
    /// GET /api/pharmacies (basic pharmacy lookup)
    /// </summary>
    [HttpGet("pharmacies")]
    [Authorize(Roles = "PharmacyOwner,Pharmacist,Administrator,Supplier")]
    public async Task<IActionResult> GetPharmacies()
    {
        var pharmacies = await _db.Pharmacies
            .Select(p => new PharmacyDto(p.Id, p.Name, p.Location, p.ContactNumber, p.OwnerId))
            .ToListAsync();
        return Ok(pharmacies);
    }

    /// <summary>
    /// GET /api/pharmacies/my
    /// Returns the pharmacy owned by the authenticated PharmacyOwner.
    /// </summary>
    [HttpGet("pharmacies/my")]
    [Authorize(Roles = "PharmacyOwner")]
    public async Task<IActionResult> GetMyPharmacy()
    {
        var ownerId = GetUserId();
        var pharmacy = await _db.Pharmacies.FirstOrDefaultAsync(p => p.OwnerId == ownerId);
        if (pharmacy == null) return NotFound(new { message = "No pharmacy found for this owner." });
        return Ok(new PharmacyDto(pharmacy.Id, pharmacy.Name, pharmacy.Location, pharmacy.ContactNumber, pharmacy.OwnerId));
    }

    private int GetUserId()
    {
        var claim = User.FindFirst("userId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value, CultureInfo.InvariantCulture)
            : throw new UnauthorizedAccessException();
    }
}
