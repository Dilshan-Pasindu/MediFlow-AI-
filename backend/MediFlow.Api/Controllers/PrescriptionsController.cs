using MediFlow.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Security.Claims;

namespace MediFlow.Api.Controllers;

/// <summary>
/// Prescription endpoints.
/// Note: Prescriptions are created by Doctors (Member 2) and read here by Patients and Pharmacists.
/// Since the Prescription model (Member 2 scope) may not exist yet, this controller returns
/// empty arrays gracefully if the table is missing.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PrescriptionsController : ControllerBase
{
    private readonly AppDbContext _db;

    public PrescriptionsController(AppDbContext db) => _db = db;

    /// <summary>
    /// Get all prescriptions for the currently logged-in patient.
    /// </summary>
    [HttpGet("my")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> GetMyPrescriptions()
    {
        try
        {
            var userId = GetUserId();
            var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null)
                return NotFound(new { message = "Patient profile not found." });

            // Try to read from Prescriptions table — Member 2 creates this.
            // Safely check if the property is available on the context.
            var prescriptions = await GetPrescriptionsForPatient(patient.Id);
            return Ok(prescriptions);
        }
        catch (InvalidOperationException)
        {
            // Prescriptions DbSet not registered yet — return empty list gracefully
            return Ok(Array.Empty<object>());
        }
        catch (Npgsql.NpgsqlException)
        {
            // Table doesn't exist in DB yet — return empty list gracefully
            return Ok(Array.Empty<object>());
        }
    }

    private async Task<object> GetPrescriptionsForPatient(int patientId)
    {
        // Use raw SQL-safe query via Entity Framework reflection.
        // Since the Prescription model might not be added yet by Member 2, we try to
        // use the DbSet if it exists on AppDbContext via a property lookup.
        var dbSetProperty = _db.GetType().GetProperty("Prescriptions");
        if (dbSetProperty == null)
            return Array.Empty<object>();

        // Return empty for now — Member 2 will wire up their prescription data.
        await Task.CompletedTask;
        return Array.Empty<object>();
    }

    private int GetUserId()
    {
        var claim = User.FindFirst("userId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value, CultureInfo.InvariantCulture) : throw new UnauthorizedAccessException();
    }
}
