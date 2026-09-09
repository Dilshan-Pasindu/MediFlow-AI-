using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Security.Claims;

namespace MediFlow.Api.Controllers;

/// <summary>
/// Supplier profile lookup and management.
/// </summary>
[ApiController]
[Route("api/suppliers")]
[Authorize]
public class SuppliersController : ControllerBase
{
    private readonly AppDbContext _db;
    public SuppliersController(AppDbContext db) => _db = db;

    /// <summary>GET /api/suppliers — List all active suppliers (for PharmacyOwner when creating restock).</summary>
    [HttpGet]
    [Authorize(Roles = "PharmacyOwner,Administrator")]
    public async Task<IActionResult> GetAll()
    {
        var suppliers = await _db.SupplierProfiles
            .Where(s => s.IsActive)
            .Select(s => new SupplierProfileDto(
                s.Id, s.UserId, s.CompanyName, s.ContactEmail, s.ContactPhone, s.Address, s.IsActive))
            .ToListAsync();
        return Ok(suppliers);
    }

    /// <summary>GET /api/suppliers/me — Supplier views their own profile.</summary>
    [HttpGet("me")]
    [Authorize(Roles = "Supplier")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = GetUserId();
        var profile = await _db.SupplierProfiles.FirstOrDefaultAsync(s => s.UserId == userId);
        if (profile == null) return NotFound(new { message = "Supplier profile not found." });
        return Ok(new SupplierProfileDto(
            profile.Id, profile.UserId, profile.CompanyName,
            profile.ContactEmail, profile.ContactPhone, profile.Address, profile.IsActive));
    }

    private int GetUserId()
    {
        var claim = User.FindFirst("userId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value, CultureInfo.InvariantCulture)
            : throw new UnauthorizedAccessException();
    }
}
