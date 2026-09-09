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
/// Manages restock request lifecycle.
/// State machine: Pending → Approved/Rejected → Dispatched → Delivered → Completed
/// </summary>
[ApiController]
[Route("api/restock-requests")]
[Authorize]
public class RestockRequestsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly InventoryService _inventoryService;

    public RestockRequestsController(AppDbContext db, InventoryService inventoryService)
    {
        _db = db;
        _inventoryService = inventoryService;
    }

    /// <summary>
    /// GET /api/restock-requests
    /// PharmacyOwner: sees requests for their pharmacy.
    /// Supplier: sees requests assigned to their supplier profile.
    /// Pharmacist: sees Delivered requests for their pharmacy (to confirm receipt).
    /// Administrator: sees all.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status = null)
    {
        var userId = GetUserId();
        var role = GetRole();

        IQueryable<RestockRequest> query = _db.RestockRequests
            .Include(r => r.Pharmacy)
            .Include(r => r.SupplierProfile)
            .Include(r => r.Items)
                .ThenInclude(i => i.Medicine);

        switch (role)
        {
            case "PharmacyOwner":
                var ownerPharmacy = await _db.Pharmacies.FirstOrDefaultAsync(p => p.OwnerId == userId);
                if (ownerPharmacy == null) return Ok(new List<RestockRequestDto>());
                query = query.Where(r => r.PharmacyId == ownerPharmacy.Id);
                break;

            case "Supplier":
                var supplierProfile = await _db.SupplierProfiles.FirstOrDefaultAsync(s => s.UserId == userId);
                if (supplierProfile == null) return Ok(new List<RestockRequestDto>());
                query = query.Where(r => r.SupplierProfileId == supplierProfile.Id);
                break;

            case "Pharmacist":
                // Pharmacist sees Delivered requests — ready for them to confirm receipt
                query = query.Where(r => r.Status == RestockRequestStatus.Delivered);
                break;

            case "Administrator":
                break; // sees all

            default:
                return Forbid();
        }

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<RestockRequestStatus>(status, out var statusFilter))
        {
            query = query.Where(r => r.Status == statusFilter);
        }

        var requests = await query
            .OrderByDescending(r => r.RequestedAt)
            .ToListAsync();

        return Ok(requests.Select(InventoryService.MapRequestToDto));
    }

    /// <summary>
    /// GET /api/restock-requests/{id}
    /// </summary>
    [HttpGet("{id:int}")]
    [Authorize(Roles = "PharmacyOwner,Pharmacist,Supplier,Administrator")]
    public async Task<IActionResult> GetById(int id)
    {
        var request = await _db.RestockRequests
            .Include(r => r.Pharmacy)
            .Include(r => r.SupplierProfile)
            .Include(r => r.Items)
                .ThenInclude(i => i.Medicine)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (request == null) return NotFound(new { message = "Restock request not found." });

        if (!CanAccessRequest(request)) return Forbid();

        return Ok(InventoryService.MapRequestToDto(request));
    }

    /// <summary>
    /// POST /api/restock-requests
    /// PharmacyOwner creates a restock request for their pharmacy.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "PharmacyOwner,Administrator")]
    public async Task<IActionResult> Create(
        [FromBody] CreateRestockRequestDto dto,
        [FromQuery] int? pharmacyId = null)
    {
        var userId = GetUserId();

        // Resolve pharmacy for owner or admin
        int targetPharmacyId;
        if (User.IsInRole("PharmacyOwner"))
        {
            var pharmacy = await _db.Pharmacies.FirstOrDefaultAsync(p => p.OwnerId == userId);
            if (pharmacy == null)
                return BadRequest(new { message = "No pharmacy found for this owner." });
            targetPharmacyId = pharmacy.Id;
        }
        else if (User.IsInRole("Administrator"))
        {
            var requestedPharmacyId = pharmacyId ?? dto.PharmacyId;
            if (!requestedPharmacyId.HasValue)
                return BadRequest(new { message = "Administrator must specify a pharmacyId via query parameter or request body." });

            var pharmacyExists = await _db.Pharmacies.AnyAsync(p => p.Id == requestedPharmacyId.Value);
            if (!pharmacyExists)
                return NotFound(new { message = $"Pharmacy with ID {requestedPharmacyId.Value} not found." });

            targetPharmacyId = requestedPharmacyId.Value;
        }
        else
        {
            return Forbid();
        }

        try
        {
            var request = await _inventoryService.CreateRestockRequestAsync(targetPharmacyId, dto);
            return CreatedAtAction(nameof(GetById), new { id = request.Id }, new { request.Id, message = "Restock request created." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// PUT /api/restock-requests/{id}/status
    /// Supplier workflow: Pending → Approved/Rejected, Approved → Dispatched.
    /// </summary>
    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "Supplier,Administrator")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateRestockStatusDto dto)
    {
        var userId = GetUserId();

        // Supplier can only act on their own requests
        if (User.IsInRole("Supplier"))
        {
            var supplierProfile = await _db.SupplierProfiles.FirstOrDefaultAsync(s => s.UserId == userId);
            if (supplierProfile == null) return Forbid();

            var request = await _db.RestockRequests.FindAsync(id);
            if (request == null) return NotFound(new { message = "Request not found." });
            if (request.SupplierProfileId != supplierProfile.Id) return Forbid();
        }

        try
        {
            var updated = await _inventoryService.UpdateRestockStatusAsync(id, dto, userId);
            return Ok(new { updated.Id, Status = updated.Status.ToString(), message = "Status updated." });
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
    }

    /// <summary>
    /// POST /api/restock-requests/{id}/receive
    /// Pharmacist or PharmacyOwner confirms physical receipt of stock.
    /// This is the ONLY action that updates inventory levels.
    /// State: Delivered → Completed.
    /// </summary>
    [HttpPost("{id:int}/receive")]
    [Authorize(Roles = "Pharmacist,PharmacyOwner,Administrator")]
    public async Task<IActionResult> ConfirmReceipt(int id, [FromBody] ReceiveRestockDto dto)
    {
        try
        {
            var updated = await _inventoryService.ConfirmReceiptAsync(id, dto);
            return Ok(new
            {
                updated.Id,
                Status = updated.Status.ToString(),
                updated.ReceivedAt,
                message = "Stock received and inventory updated successfully."
            });
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private bool CanAccessRequest(RestockRequest request)
    {
        var role = GetRole();
        var userId = GetUserId();
        return role switch
        {
            "Administrator" => true,
            "PharmacyOwner" => _db.Pharmacies.Any(p => p.Id == request.PharmacyId && p.OwnerId == userId),
            "Supplier"      => _db.SupplierProfiles.Any(s => s.Id == request.SupplierProfileId && s.UserId == userId),
            "Pharmacist"    => true, // Pharmacists can see Delivered requests
            _ => false
        };
    }

    private int GetUserId()
    {
        var claim = User.FindFirst("userId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value, CultureInfo.InvariantCulture)
            : throw new UnauthorizedAccessException();
    }

    private string GetRole() =>
        User.FindFirst(ClaimTypes.Role)?.Value ?? User.FindFirst("role")?.Value ?? "";
}
