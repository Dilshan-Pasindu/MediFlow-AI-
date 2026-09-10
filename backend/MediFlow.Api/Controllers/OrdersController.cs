using MediFlow.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Security.Claims;

namespace MediFlow.Api.Controllers;

/// <summary>
/// Orders endpoints.
/// Orders are created by Pharmacists (Member 4) and read here by Patients.
/// Since the Order model (Member 4 scope) may not be registered yet on AppDbContext,
/// this controller returns empty arrays gracefully if the table is missing.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrdersController(AppDbContext db) => _db = db;

    /// <summary>
    /// Get all medicine orders for the currently logged-in patient.
    /// </summary>
    [HttpGet("my")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> GetMyOrders()
    {
        try
        {
            var userId = GetUserId();
            var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null)
                return NotFound(new { message = "Patient profile not found." });

            // Check if the Orders DbSet exists (added by Member 4 or Pharmacist team)
            var dbSetProperty = _db.GetType().GetProperty("Orders");
            if (dbSetProperty == null)
                return Ok(Array.Empty<object>());

            // Return empty for now — Member 4 will wire up their order data.
            await Task.CompletedTask;
            return Ok(Array.Empty<object>());
        }
        catch (InvalidOperationException)
        {
            return Ok(Array.Empty<object>());
        }
        catch (Npgsql.NpgsqlException)
        {
            return Ok(Array.Empty<object>());
        }
    }

    private int GetUserId()
    {
        var claim = User.FindFirst("userId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value, CultureInfo.InvariantCulture) : throw new UnauthorizedAccessException();
    }
}
