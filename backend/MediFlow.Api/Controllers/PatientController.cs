using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
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
            patient.Allergies,
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
        if (request.Allergies != null) patient.Allergies = request.Allergies;
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
            .Include(a => a.Doctor).ThenInclude(d => d.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
            .Include(a => a.Payment)
            .OrderByDescending(a => a.AppointmentDateTime)
            .Select(a => new
            {
                a.Id,
                a.AppointmentNumber,
                DoctorName = a.Doctor.FullName,
                DoctorQualifications = a.Doctor.Qualifications,
                SpecialtyName = a.Doctor.DoctorSpecialties
                    .Select(ds => ds.Specialty.Name).FirstOrDefault() ?? "General Medicine",
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

    /// <summary>
    /// Cancel a patient's own appointment (only if Pending or PaymentSubmitted).
    /// </summary>
    [HttpDelete("appointments/{id:int}")]
    public async Task<IActionResult> CancelAppointment(int id, [FromBody] CancelAppointmentRequest? request)
    {
        var userId = GetUserId();
        var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        var appointment = await _db.Appointments
            .FirstOrDefaultAsync(a => a.Id == id && a.PatientId == patient.Id);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        if (appointment.Status == AppointmentStatus.Completed || appointment.Status == AppointmentStatus.Cancelled)
            return BadRequest(new { message = $"Cannot cancel an appointment that is already {appointment.Status}." });

        appointment.Status = AppointmentStatus.Cancelled;
        appointment.Notes = string.IsNullOrWhiteSpace(request?.Reason)
            ? appointment.Notes
            : $"{appointment.Notes} [Cancelled: {request.Reason}]";
        appointment.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new { message = "Appointment cancelled successfully.", Status = "Cancelled" });
    }

    /// <summary>
    /// Submit symptoms for AI specialist recommendation (saves submission + returns keyword-based recommendation).
    /// </summary>
    [HttpPost("symptoms")]
    public async Task<IActionResult> SubmitSymptoms([FromBody] SubmitSymptomsRequest request)
    {
        var userId = GetUserId();
        var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        // Simple keyword-based specialty recommendation engine
        var (specialty, confidence, altSpecialty, altConfidence, reason) = AnalyzeSymptoms(request.Symptoms);

        // Persist the submission
        var submission = new SymptomSubmission
        {
            PatientId = patient.Id,
            SymptomsText = request.Symptoms,
            Duration = request.Duration,
            Severity = request.Severity,
            RecommendedSpecialty = specialty,
            RecommendationConfidence = (decimal)confidence / 100m,
            AgentExplanation = reason,
            CreatedAt = DateTime.UtcNow
        };
        _db.SymptomSubmissions.Add(submission);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            submissionId = submission.Id,
            specialty,
            confidence,
            altSpecialty,
            altConfidence,
            reason,
        });
    }

    // ── Symptom Analysis Engine ───────────────────────────────────────────────

    private static (string specialty, int confidence, string alt, int altConf, string reason) AnalyzeSymptoms(string symptoms)
    {
        var lower = (symptoms ?? string.Empty).ToLowerInvariant();

        if (ContainsAny(lower, "chest pain", "heart", "palpitation", "shortness of breath", "breathless"))
            return ("Cardiology", 88, "General Medicine", 72,
                "Chest pain and palpitations warrant cardiac evaluation. A cardiologist can perform an ECG and relevant tests to rule out heart conditions.");

        if (ContainsAny(lower, "stomach", "gastric", "acid reflux", "bloat", "heartburn", "nausea", "vomit", "diarrhea", "constipat"))
            return ("Gastroenterology", 91, "General Medicine", 64,
                "Gastrointestinal symptoms such as stomach pain, bloating, and nausea are best evaluated by a gastroenterologist for targeted diagnostic tests.");

        if (ContainsAny(lower, "skin", "rash", "itch", "acne", "eczema", "psoriasis", "hives", "dermat"))
            return ("Dermatology", 94, "General Medicine", 45,
                "Skin symptoms are best assessed by a dermatologist who specializes in skin, hair, and nail conditions.");

        if (ContainsAny(lower, "headache", "migrain", "dizzy", "vertigo", "seizure", "numbness", "neuro", "tremor"))
            return ("Neurology", 86, "General Medicine", 68,
                "Neurological symptoms require specialist evaluation. A neurologist can investigate causes of headaches, dizziness, and other neurological issues.");

        if (ContainsAny(lower, "bone", "joint", "arthritis", "back pain", "spine", "fracture", "knee", "hip", "orthop"))
            return ("Orthopedics", 89, "General Medicine", 55,
                "Musculoskeletal symptoms such as joint pain, back pain, and bone issues are best managed by an orthopedic specialist.");

        if (ContainsAny(lower, "eye", "vision", "blur", "cataract", "glaucoma", "ophth"))
            return ("Ophthalmology", 92, "General Medicine", 40,
                "Eye-related symptoms including vision changes require evaluation by an ophthalmologist for accurate diagnosis and treatment.");

        if (ContainsAny(lower, "ear", "hearing", "throat", "nose", "sinus", "tonsil", "ent", "nasal"))
            return ("ENT (Ear, Nose & Throat)", 90, "General Medicine", 55,
                "Ear, nose, and throat symptoms are best evaluated by an ENT specialist who can perform a thorough examination of these interconnected systems.");

        if (ContainsAny(lower, "mental", "anxiety", "depress", "stress", "mood", "panic", "insomnia", "psychiatr", "psycholog"))
            return ("Psychiatry", 87, "General Medicine", 60,
                "Mental health symptoms such as anxiety, depression, and mood disorders require evaluation by a psychiatrist or psychologist for appropriate treatment.");

        if (ContainsAny(lower, "urin", "kidney", "bladder", "prostate", "renal", "urolog"))
            return ("Urology", 88, "General Medicine", 50,
                "Urinary symptoms and kidney-related issues are best evaluated by a urologist who specializes in the urinary tract and reproductive health.");

        if (ContainsAny(lower, "pregnan", "gynaecolog", "gynecolog", "period", "menstrual", "uterus", "ovary", "obstet"))
            return ("Obstetrics & Gynecology", 93, "General Medicine", 48,
                "Women's health concerns including pregnancy, menstrual issues, and reproductive health are best managed by an OB/GYN specialist.");

        if (ContainsAny(lower, "diabet", "thyroid", "hormone", "endocrin", "insulin"))
            return ("Endocrinology", 85, "General Medicine", 65,
                "Hormonal and metabolic conditions such as diabetes and thyroid disorders require evaluation by an endocrinologist.");

        if (ContainsAny(lower, "lung", "cough", "asthma", "bronch", "pneumon", "pulmon", "wheez"))
            return ("Pulmonology", 88, "General Medicine", 62,
                "Respiratory symptoms including persistent cough, asthma, and breathing difficulties are best evaluated by a pulmonologist.");

        // Default
        return ("General Medicine", 85, "Internal Medicine", 60,
            "Based on your described symptoms, a general medicine consultation is recommended as a comprehensive starting point for evaluation and diagnosis.");
    }

    private static bool ContainsAny(string text, params string[] keywords)
    {
        foreach (var kw in keywords)
            if (text.Contains(kw, StringComparison.OrdinalIgnoreCase)) return true;
        return false;
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private int GetUserId()
    {
        var claim = User.FindFirst("userId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value, CultureInfo.InvariantCulture) : throw new UnauthorizedAccessException();
    }
}

// ── Request DTOs ──────────────────────────────────────────────────────────────

public record SubmitSymptomsRequest(
    string Symptoms,
    string? Duration = null,
    string? Severity = null
);

public record CancelAppointmentRequest(
    string? Reason = null
);
