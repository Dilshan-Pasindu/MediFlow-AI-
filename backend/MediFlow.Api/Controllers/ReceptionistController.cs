using MediFlow.Api.Data;
using MediFlow.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Security.Claims;

namespace MediFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReceptionistController : ControllerBase
{
    private readonly AppDbContext _db;

    public ReceptionistController(AppDbContext db) => _db = db;

    /// <summary>
    /// Get all pending or submitted appointments awaiting receptionist verification.
    /// Accessible by Receptionist or Admin.
    /// </summary>
    [HttpGet("appointments")]
    [Authorize]
    public async Task<IActionResult> GetPendingAppointments()
    {
        var appointments = await _db.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
                .ThenInclude(d => d.DoctorSpecialties)
                    .ThenInclude(ds => ds.Specialty)
            .Include(a => a.Payment)
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new
            {
                a.Id,
                PatientName = a.Patient.FullName,
                PatientBloodGroup = a.Patient.BloodGroup ?? "O+",
                PatientAllergies = "None Reported",
                AppointmentNumber = a.AppointmentNumber ?? $"APT-{a.Id:D4}",
                AppointmentDateTime = a.AppointmentDateTime.ToString("o"),
                a.Notes,
                Status = a.Status.ToString(),
                DoctorName = a.Doctor.FullName,
                SpecialtyName = a.Doctor.DoctorSpecialties.Select(ds => ds.Specialty.Name).FirstOrDefault() ?? "General Medicine",
                Fee = a.Fee ?? a.Doctor.ConsultationFee,
                PaymentStatus = a.Payment != null ? a.Payment.Status.ToString() : "Pending",
                PaymentMethod = a.Payment != null ? a.Payment.PaymentMethod : "Card"
            })
            .ToListAsync();

        return Ok(appointments);
    }

    /// <summary>
    /// Verify patient payment and update status (Receptionist only).
    /// </summary>
    [HttpPost("appointments/{id}/verify")]
    [Authorize]
    public async Task<IActionResult> VerifyPayment(int id)
    {
        var appointment = await _db.Appointments
            .Include(a => a.Payment)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        if (appointment.Payment == null)
        {
            appointment.Payment = new AppointmentPayment
            {
                AppointmentId = appointment.Id,
                Amount = appointment.Fee ?? 2500,
                Status = PaymentStatus.Verified,
                PaymentMethod = "Card",
                PaidAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }
        else
        {
            appointment.Payment.Status = PaymentStatus.Verified;
            appointment.Payment.PaidAt = DateTime.UtcNow;
            appointment.Payment.UpdatedAt = DateTime.UtcNow;
        }

        appointment.Status = AppointmentStatus.Confirmed;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new
        {
            appointment.Id,
            Status = appointment.Status.ToString(),
            PaymentStatus = appointment.Payment.Status.ToString(),
            message = "Payment verified successfully and appointment confirmed."
        });
    }

    /// <summary>
    /// Generate formal appointment number (APP-YYYY-XXXX).
    /// </summary>
    [HttpPost("appointments/{id}/generate-number")]
    [Authorize]
    public async Task<IActionResult> GenerateAppointmentNumber(int id)
    {
        var appointment = await _db.Appointments.FindAsync(id);
        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        var dateStr = appointment.AppointmentDateTime.ToString("yyyyMMdd", CultureInfo.InvariantCulture);
        appointment.AppointmentNumber = $"APP-2026-{1000 + appointment.Id}";
        appointment.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new
        {
            appointment.Id,
            appointment.AppointmentNumber,
            message = "Appointment number generated successfully."
        });
    }

    /// <summary>
    /// Cancel an appointment with a reason.
    /// </summary>
    [HttpPut("appointments/{id}/cancel")]
    [Authorize]
    public async Task<IActionResult> CancelAppointment(int id, [FromBody] CancelRequest request)
    {
        var appointment = await _db.Appointments.FindAsync(id);
        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        appointment.Status = AppointmentStatus.Cancelled;
        appointment.Notes = string.IsNullOrWhiteSpace(appointment.Notes) 
            ? $"Cancelled: {request.Reason}" 
            : $"{appointment.Notes} | Cancelled: {request.Reason}";
        appointment.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new
        {
            appointment.Id,
            Status = appointment.Status.ToString(),
            message = "Appointment cancelled successfully."
        });
    }
}

public record CancelRequest(string Reason);
