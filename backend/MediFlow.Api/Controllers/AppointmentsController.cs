using MediFlow.Api.Data;
using MediFlow.Api.Hubs;
using MediFlow.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
    private readonly IHubContext<ConsultationHub, IConsultationClient> _hubContext;

    public AppointmentsController(AppDbContext db, IHubContext<ConsultationHub, IConsultationClient> hubContext)
    {
        _db = db;
        _hubContext = hubContext;
    }

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

        if (request.DoctorId <= 0)
            return BadRequest(new { message = "A valid doctor ID is required." });

        var doctor = await _db.Doctors.FindAsync(request.DoctorId);
        if (doctor == null)
            return NotFound(new { message = "Doctor not found." });

        if (!doctor.IsActive)
            return BadRequest(new { message = "This doctor is currently not accepting new appointments." });

        if (request.DateTime == default)
            return BadRequest(new { message = "A valid appointment date and time is required." });

        // Normalize to UTC
        var appointmentDateUtc = request.DateTime.Kind == DateTimeKind.Utc
            ? request.DateTime
            : DateTime.SpecifyKind(request.DateTime, DateTimeKind.Utc);

        // Prevent booking appointments in the past
        if (appointmentDateUtc < DateTime.UtcNow)
            return BadRequest(new { message = "Cannot book an appointment in the past. Please select a future date and time." });

        // Prevent booking appointments too far in advance (max 90 days)
        if (appointmentDateUtc > DateTime.UtcNow.AddDays(90))
            return BadRequest(new { message = "Appointments cannot be booked more than 90 days in advance." });

        // Validate notes length
        if (request.Notes != null && request.Notes.Length > 500)
            return BadRequest(new { message = "Notes cannot exceed 500 characters." });

        // Prevent duplicate booking: same patient, same doctor, same date
        var existingAppointment = await _db.Appointments
            .FirstOrDefaultAsync(a => a.PatientId == patient.Id
                && a.DoctorId == request.DoctorId
                && a.AppointmentDateTime.Date == appointmentDateUtc.Date
                && a.Status != AppointmentStatus.Cancelled);

        if (existingAppointment != null)
            return BadRequest(new { message = $"You already have an appointment with this doctor on {appointmentDateUtc:yyyy-MM-dd}. Please choose a different date or cancel the existing appointment." });

        // Prevent overlapping bookings for the same patient across all doctors within a 30-minute window
        var windowStart = appointmentDateUtc.AddMinutes(-29);
        var windowEnd = appointmentDateUtc.AddMinutes(29);
        var conflictingPatientAppt = await _db.Appointments
            .Include(a => a.Doctor)
            .FirstOrDefaultAsync(a => a.PatientId == patient.Id
                && a.AppointmentDateTime >= windowStart
                && a.AppointmentDateTime <= windowEnd
                && a.Status != AppointmentStatus.Cancelled);

        if (conflictingPatientAppt != null)
        {
            var conflictDoctorName = conflictingPatientAppt.Doctor?.FullName ?? "another doctor";
            return BadRequest(new { message = $"You already have an appointment scheduled around this time with {conflictDoctorName}." });
        }

        // Check if the doctor is on leave
        var overlappingLeave = await _db.DoctorLeaves
            .Where(l => l.DoctorId == request.DoctorId
                && l.StartDate.Date <= appointmentDateUtc.Date
                && l.EndDate.Date >= appointmentDateUtc.Date)
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
                a.DoctorId,
                a.AppointmentNumber,
                DoctorName = a.Doctor.FullName,
                DoctorProfilePhoto = a.Doctor.ProfilePhoto,
                DoctorBio = a.Doctor.Bio,
                DoctorQualifications = a.Doctor.Qualifications,
                SpecialtyName = a.Doctor.DoctorSpecialties
                    .Select(ds => ds.Specialty.Name).FirstOrDefault() ?? "General Medicine",
                a.AppointmentDateTime,
                Status = a.Status.ToString(),
                a.Fee,
                a.Notes,
                a.ConsultationStartedAt,
                a.ConsultationEndedAt,
                HasRated = _db.DoctorRatings.Any(r => r.AppointmentId == a.Id),
                Rating = _db.DoctorRatings
                    .Where(r => r.AppointmentId == a.Id)
                    .Select(r => new { r.Stars, r.Comment })
                    .FirstOrDefault(),
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

    /// <summary>
    /// Start consultation for a confirmed appointment (Doctor only).
    /// Updates status to InConsultation, records start time, and broadcasts ConsultationStarted via SignalR.
    /// </summary>
    [HttpPost("{id}/start-consultation")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> StartConsultation(int id)
    {
        var appointment = await _db.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        if (appointment.Status == AppointmentStatus.Completed)
            return BadRequest(new { message = "A completed appointment cannot be started again." });

        if (appointment.Status == AppointmentStatus.Cancelled)
            return BadRequest(new { message = "A cancelled appointment cannot enter consultation." });

        if (appointment.Status == AppointmentStatus.Pending || appointment.Status == AppointmentStatus.PaymentSubmitted)
            return BadRequest(new { message = $"Only confirmed appointments can enter consultation. Current status: {appointment.Status}." });

        // If already in consultation, return current state
        if (appointment.Status == AppointmentStatus.InConsultation)
        {
            return Ok(new
            {
                appointment.Id,
                appointment.AppointmentNumber,
                Status = appointment.Status.ToString(),
                appointment.DoctorId,
                DoctorName = appointment.Doctor?.FullName,
                PatientName = appointment.Patient?.FullName,
                StartedAt = appointment.ConsultationStartedAt,
                message = "Appointment is already in consultation."
            });
        }

        // Concurrency guard: verify the doctor doesn't already have another active consultation
        var activeConsultation = await _db.Appointments
            .FirstOrDefaultAsync(a => a.DoctorId == appointment.DoctorId 
                                   && a.Status == AppointmentStatus.InConsultation 
                                   && a.Id != appointment.Id);

        if (activeConsultation != null)
        {
            return BadRequest(new
            {
                message = $"Doctor already has an active consultation in progress (Appointment #{activeConsultation.AppointmentNumber ?? activeConsultation.Id.ToString()}). Please complete the current consultation before starting a new one."
            });
        }

        appointment.Status = AppointmentStatus.InConsultation;
        appointment.ConsultationStartedAt = DateTime.UtcNow;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var payload = new ConsultationEventPayload
        {
            AppointmentId = appointment.Id,
            AppointmentNumber = appointment.AppointmentNumber,
            DoctorId = appointment.DoctorId,
            DoctorName = appointment.Doctor?.FullName,
            PatientName = appointment.Patient?.FullName,
            Status = appointment.Status.ToString(),
            StartedAt = appointment.ConsultationStartedAt
        };

        // Broadcast to doctor-specific channel and general channel
        await _hubContext.Clients.Group($"doctor-{appointment.DoctorId}").ConsultationStarted(payload);
        await _hubContext.Clients.All.ConsultationStarted(payload);

        return Ok(new
        {
            appointment.Id,
            appointment.AppointmentNumber,
            Status = appointment.Status.ToString(),
            appointment.DoctorId,
            DoctorName = appointment.Doctor?.FullName,
            PatientName = appointment.Patient?.FullName,
            StartedAt = appointment.ConsultationStartedAt,
            message = "Consultation started successfully."
        });
    }

    /// <summary>
    /// Mark an appointment as Completed after the doctor finishes the consultation.
    /// Supports both POST /complete-consultation and PUT /complete.
    /// Updates status to Completed, records end time, and broadcasts ConsultationEnded via SignalR.
    /// </summary>
    [HttpPost("{id}/complete-consultation")]
    [HttpPut("{id}/complete")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> CompleteConsultation(int id)
    {
        var appointment = await _db.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        if (appointment.Status == AppointmentStatus.Completed)
            return BadRequest(new { message = "This appointment has already been completed." });

        if (appointment.Status != AppointmentStatus.InConsultation && appointment.Status != AppointmentStatus.Confirmed)
            return BadRequest(new { message = $"Appointment cannot be completed. Current status: {appointment.Status}." });

        appointment.Status = AppointmentStatus.Completed;
        appointment.ConsultationEndedAt = DateTime.UtcNow;
        appointment.UpdatedAt = DateTime.UtcNow;

        // Notify the patient that the consultation is complete
        if (appointment.Patient != null && appointment.Patient.UserId > 0)
        {
            var doctorName = appointment.Doctor?.FullName ?? "Your doctor";
            _db.Notifications.Add(new MediFlow.Api.Models.Notification
            {
                UserId = appointment.Patient.UserId,
                Title = "Consultation Completed",
                Message = $"Your consultation with {doctorName} has been completed successfully. Please check your prescriptions and follow-up instructions.",
                Type = "success",
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            });
        }

        await _db.SaveChangesAsync();

        var payload = new ConsultationEventPayload
        {
            AppointmentId = appointment.Id,
            AppointmentNumber = appointment.AppointmentNumber,
            DoctorId = appointment.DoctorId,
            DoctorName = appointment.Doctor?.FullName,
            PatientName = appointment.Patient?.FullName,
            Status = appointment.Status.ToString(),
            StartedAt = appointment.ConsultationStartedAt,
            EndedAt = appointment.ConsultationEndedAt
        };

        // Broadcast to doctor-specific channel and general channel
        await _hubContext.Clients.Group($"doctor-{appointment.DoctorId}").ConsultationEnded(payload);
        await _hubContext.Clients.All.ConsultationEnded(payload);

        return Ok(new
        {
            appointment.Id,
            appointment.AppointmentNumber,
            Status = appointment.Status.ToString(),
            EndedAt = appointment.ConsultationEndedAt,
            message = "Consultation completed successfully."
        });
    }

    /// <summary>
    /// Get the currently consulting appointment for a doctor or patient queue.
    /// Can query by doctorId query parameter, or defaults to the caller's context.
    /// </summary>
    [HttpGet("current-consultation")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCurrentConsultation([FromQuery] int? doctorId)
    {
        IQueryable<Appointment> query = _db.Appointments
            .Include(a => a.Doctor)
            .Include(a => a.Patient)
            .Where(a => a.Status == AppointmentStatus.InConsultation);

        if (User.Identity?.IsAuthenticated == true)
        {
            try
            {
                var userId = GetUserId();
                var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
                if (patient != null)
                {
                    // If a patient queries a specific doctor, verify the patient has a booked appointment with that doctor
                    if (doctorId.HasValue)
                    {
                        var hasBooking = await _db.Appointments.AnyAsync(a => a.PatientId == patient.Id 
                                                                           && a.DoctorId == doctorId.Value 
                                                                           && a.Status != AppointmentStatus.Cancelled);
                        if (!hasBooking)
                        {
                            return Ok(new
                            {
                                hasActiveConsultation = false,
                                doctorId = doctorId,
                                message = "You can only view consultation status for doctors you have booked an appointment with."
                            });
                        }
                    }
                    else
                    {
                        // Find active consultation among doctors the patient has appointments with
                        var patientDoctorIds = await _db.Appointments
                            .Where(a => a.PatientId == patient.Id && a.Status != AppointmentStatus.Cancelled)
                            .Select(a => a.DoctorId)
                            .Distinct()
                            .ToListAsync();

                        if (patientDoctorIds.Count > 0)
                        {
                            query = query.Where(a => patientDoctorIds.Contains(a.DoctorId));
                        }
                        else
                        {
                            return Ok(new
                            {
                                hasActiveConsultation = false,
                                message = "You do not have any booked appointments with our doctors."
                            });
                        }
                    }
                }
                else
                {
                    var doctor = await _db.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
                    if (doctor != null && !doctorId.HasValue)
                    {
                        query = query.Where(a => a.DoctorId == doctor.Id);
                    }
                }
            }
            catch
            {
                // Fall back to general active consultation
            }
        }

        if (doctorId.HasValue)
        {
            query = query.Where(a => a.DoctorId == doctorId.Value);
        }

        var activeAppt = await query
            .OrderByDescending(a => a.ConsultationStartedAt ?? a.UpdatedAt)
            .FirstOrDefaultAsync();

        if (activeAppt == null)
        {
            return Ok(new
            {
                hasActiveConsultation = false,
                doctorId = doctorId,
                message = "No appointment is currently being consulted."
            });
        }

        return Ok(new
        {
            hasActiveConsultation = true,
            appointmentId = activeAppt.Id,
            appointmentNumber = activeAppt.AppointmentNumber,
            doctorId = activeAppt.DoctorId,
            doctorName = activeAppt.Doctor?.FullName,
            patientName = activeAppt.Patient?.FullName,
            status = activeAppt.Status.ToString(),
            startedAt = activeAppt.ConsultationStartedAt
        });
    }

    /// <summary>
    /// Patient submits rating and review for a completed appointment.
    /// </summary>
    [HttpPost("{id:int}/rate")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> RateAppointment(int id, [FromBody] RateAppointmentRequest request)
    {
        var userId = GetUserId();
        var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        var appointment = await _db.Appointments
            .Include(a => a.Doctor)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        if (appointment.PatientId != patient.Id)
            return Forbid();

        if (appointment.Status != AppointmentStatus.Completed)
            return BadRequest(new { message = "Ratings and feedback can only be submitted after consultation is completed." });

        var effectiveStars = request.Stars > 0 ? request.Stars : request.Rating;
        var effectiveComment = !string.IsNullOrWhiteSpace(request.Comment) ? request.Comment : request.Review;

        if (effectiveStars < 1 || effectiveStars > 5)
            return BadRequest(new { message = "Rating must be between 1 and 5 stars." });

        var existingRating = await _db.DoctorRatings.FirstOrDefaultAsync(r => r.AppointmentId == id);
        DoctorRating rating;
        string successMessage;

        if (existingRating != null)
        {
            existingRating.Stars = effectiveStars;
            existingRating.Comment = effectiveComment?.Trim();
            existingRating.CreatedAt = DateTime.UtcNow;
            rating = existingRating;
            successMessage = "Thank you! Your feedback has been updated successfully.";
        }
        else
        {
            rating = new DoctorRating
            {
                DoctorId = appointment.DoctorId,
                PatientId = patient.Id,
                AppointmentId = appointment.Id,
                Stars = effectiveStars,
                Comment = effectiveComment?.Trim(),
                CreatedAt = DateTime.UtcNow
            };
            _db.DoctorRatings.Add(rating);
            successMessage = "Thank you! Your feedback has been submitted successfully.";
        }

        await _db.SaveChangesAsync();

        var ratings = await _db.DoctorRatings.Where(r => r.DoctorId == appointment.DoctorId).ToListAsync();
        var newAvg = ratings.Count > 0 ? Math.Round(ratings.Average(r => r.Stars), 1) : 0;

        return Ok(new
        {
            rating.Id,
            rating.Stars,
            rating.Comment,
            AverageRating = newAvg,
            ReviewCount = ratings.Count,
            message = successMessage
        });
    }

    /// <summary>
    /// Check if appointment already has a rating submitted by the patient.
    /// </summary>
    [HttpGet("{id:int}/rating")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> GetAppointmentRating(int id)
    {
        var userId = GetUserId();
        var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        var rating = await _db.DoctorRatings
            .FirstOrDefaultAsync(r => r.AppointmentId == id && r.PatientId == patient.Id);

        if (rating == null)
            return Ok(new { hasRated = false });

        return Ok(new
        {
            hasRated = true,
            rating.Id,
            rating.Stars,
            rating.Comment,
            rating.CreatedAt
        });
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

public class RateAppointmentRequest
{
    public int Stars { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public string? Review { get; set; }
}
