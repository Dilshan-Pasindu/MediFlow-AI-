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
[Authorize(Roles = "Patient,Doctor,Receptionist,Pharmacist,Admin")]
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public AppointmentsController(AppDbContext db) => _db = db;

    /// <summary>
    /// Book a new appointment (Patient only).
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> BookAppointment([FromBody] BookAppointmentRequest request)
    {
        var userId = GetUserId();
        var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        var doctor = await _db.Doctors.FindAsync(request.DoctorId);
        if (doctor == null)
            return NotFound(new { message = "Doctor not found." });

        // Check if the doctor is on leave
        var overlappingLeave = await _db.DoctorLeaves
            .Where(l => l.DoctorId == request.DoctorId
                && l.StartDate <= request.DateTime
                && l.EndDate >= request.DateTime)
            .FirstOrDefaultAsync();

        if (overlappingLeave != null)
        {
            return BadRequest(new { message = $"Doctor is on leave from {overlappingLeave.StartDate:yyyy-MM-dd} to {overlappingLeave.EndDate:yyyy-MM-dd}." });
        }

        // Generate appointment number: APT-YYYYMMDD-XXXX
        var dateStr = request.DateTime.ToString("yyyyMMdd", CultureInfo.InvariantCulture);
        var todayCount = await _db.Appointments
            .CountAsync(a => a.DoctorId == request.DoctorId 
                && a.AppointmentDateTime.Date == request.DateTime.Date);
        var appointmentNumber = $"APT-{dateStr}-{(todayCount + 1):D4}";

        var appointment = new Appointment
        {
            PatientId = patient.Id,
            DoctorId = request.DoctorId,
            AppointmentDateTime = DateTime.SpecifyKind(request.DateTime, DateTimeKind.Utc),
            AppointmentNumber = appointmentNumber,
            Status = AppointmentStatus.Pending,
            Fee = doctor.ConsultationFee,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Appointments.Add(appointment);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            appointment.Id,
            appointment.AppointmentNumber,
            appointment.AppointmentDateTime,
            Status = appointment.Status.ToString(),
            appointment.Fee,
            DoctorName = doctor.FullName,
            message = "Appointment booked successfully."
        });
    }

    /// <summary>
    /// Patient submits payment for an appointment.
    /// </summary>
    [HttpPost("{id}/pay")]
    public async Task<IActionResult> PayAppointment(int id)
    {
        var userId = GetUserId();
        var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        var appointment = await _db.Appointments
            .Include(a => a.Payment)
            .FirstOrDefaultAsync(a => a.Id == id && a.PatientId == patient.Id);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        if (appointment.Payment == null)
        {
            appointment.Payment = new AppointmentPayment
            {
                AppointmentId = appointment.Id,
                Amount = appointment.Fee ?? 2500,
                Status = PaymentStatus.Submitted,
                PaymentMethod = "Card",
                PaidAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }
        else
        {
            appointment.Payment.Status = PaymentStatus.Submitted;
            appointment.Payment.PaidAt = DateTime.UtcNow;
            appointment.Payment.UpdatedAt = DateTime.UtcNow;
        }

        appointment.Status = AppointmentStatus.PaymentSubmitted;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new
        {
            appointment.Id,
            Status = appointment.Status.ToString(),
            PaymentStatus = appointment.Payment.Status.ToString(),
            message = "Payment submitted successfully. Awaiting receptionist verification."
        });
    }

    /// <summary>
    /// Get a specific appointment by ID (Patient only).
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var appointment = await _db.Appointments
            .Include(a => a.Doctor).ThenInclude(d => d.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
            .Include(a => a.Payment)
            .Where(a => a.Id == id)
            .Select(a => new
            {
                a.Id,
                a.AppointmentNumber,
                DoctorName = a.Doctor.FullName,
                DoctorBio = a.Doctor.Bio,
                DoctorQualifications = a.Doctor.Qualifications,
                SpecialtyName = a.Doctor.DoctorSpecialties
                    .Select(ds => ds.Specialty.Name).FirstOrDefault() ?? "General Medicine",
                a.AppointmentDateTime,
                Status = a.Status.ToString(),
                a.Fee,
                a.Notes,
                Payment = a.Payment != null ? new
                {
                    a.Payment.Amount,
                    Status = a.Payment.Status.ToString(),
                    a.Payment.PaymentMethod,
                    a.Payment.PaidAt
                } : null,
                a.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        return Ok(appointment);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private int GetUserId()
    {
        var claim = User.FindFirst("userId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value, CultureInfo.InvariantCulture) : throw new UnauthorizedAccessException();
    }
}

// ── Request DTO ────────────────────────────────────────────────────────────────

public record BookAppointmentRequest(
    int DoctorId,
    DateTime DateTime,
    string? Notes = null
);
