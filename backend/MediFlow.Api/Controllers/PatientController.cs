using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MediFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Patient")]          // ← Only patients can access these endpoints
public class PatientController : ControllerBase
{
    private readonly AppDbContext _db;

    public PatientController(AppDbContext db) => _db = db;

    /// <summary>
    /// Get the logged-in patient's profile.
    /// </summary>
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();
        var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId);

        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        return Ok(new
        {
            patient.Id,
            patient.UserId,
            patient.FullName,
            patient.Email,
            patient.PhoneNumber,
            patient.DateOfBirth,
            patient.Gender,
            patient.Address,
            patient.BloodGroup,
            patient.CreatedAt
        });
    }

    /// <summary>
    /// Update the logged-in patient's profile.
    /// </summary>
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdatePatientRequest request)
    {
        var userId = GetUserId();
        var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId);

        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        if (request.FullName != null) patient.FullName = request.FullName;
        if (request.PhoneNumber != null) patient.PhoneNumber = request.PhoneNumber;
        if (request.DateOfBirth != null) patient.DateOfBirth = request.DateOfBirth;
        if (request.Gender != null) patient.Gender = request.Gender;
        if (request.Address != null) patient.Address = request.Address;
        if (request.BloodGroup != null) patient.BloodGroup = request.BloodGroup;
        patient.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new { message = "Profile updated successfully." });
    }

    /// <summary>
    /// Get all appointments for the logged-in patient.
    /// </summary>
    [HttpGet("appointments")]
    public async Task<IActionResult> GetAppointments()
    {
        var userId = GetUserId();
        var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        var appointments = await _db.Appointments
            .Where(a => a.PatientId == patient.Id)
            .Include(a => a.Doctor)
            .Include(a => a.Payment)
            .OrderByDescending(a => a.AppointmentDateTime)
            .Select(a => new
            {
                a.Id,
                a.AppointmentNumber,
                DoctorName = a.Doctor.FullName,
                a.AppointmentDateTime,
                Status = a.Status.ToString(),
                a.Fee,
                PaymentStatus = a.Payment != null ? a.Payment.Status.ToString() : null,
                a.Notes,
                a.CreatedAt
            })
            .ToListAsync();

        return Ok(appointments);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private int GetUserId()
    {
        var claim = User.FindFirst("userId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value) : throw new UnauthorizedAccessException();
    }
}
