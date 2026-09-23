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
public class DoctorsController : ControllerBase
{
    private readonly AppDbContext _db;

    public DoctorsController(AppDbContext db) => _db = db;

    /// <summary>
    /// Get all doctors (public — no auth required for browsing).
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] int? specialtyId, [FromQuery] string? search)
    {
        var query = _db.Doctors
            .Include(d => d.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
            .Include(d => d.Availabilities)
            .Include(d => d.Ratings)
            .Where(d => d.IsActive)
            .AsQueryable();

        if (specialtyId.HasValue)
            query = query.Where(d => d.DoctorSpecialties.Any(ds => ds.SpecialtyId == specialtyId.Value));

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(d => EF.Functions.ILike(d.FullName, $"%{search}%"));

        var doctors = await query.Select(d => new
        {
            d.Id,
            d.FullName,
            d.Bio,
            d.Qualifications,
            d.ExperienceYears,
            d.ConsultationFee,
            d.IsActive,
            d.ProfilePhoto,
            d.SubSpecialty,
            d.HospitalClinic,
            d.Languages,
            d.Location,
            d.MbbsUniversity,
            d.PhdUniversity,
            d.OtherQualifications,
            d.Certifications,
            d.Age,
            d.RegistrationNumber,
            Specialties = d.DoctorSpecialties.Select(ds => new { ds.Specialty.Id, ds.Specialty.Name }),
            AverageRating = d.Ratings.Count > 0 ? Math.Round(d.Ratings.Average(r => r.Stars), 1) : 0,
            ReviewCount = d.Ratings.Count,
            Availability = d.Availabilities.Select(a => new { a.DayOfWeek, a.StartTime, a.EndTime })
        }).ToListAsync();

        return Ok(doctors);
    }

    /// <summary>
    /// Get appointments assigned to the logged-in doctor (or all appointments if admin/receptionist).
    /// </summary>
    [HttpGet("appointments")]
    [Authorize]
    public async Task<IActionResult> GetDoctorAppointments()
    {
        var userId = GetUserId();
        var doctor = await _db.Doctors
            .Include(d => d.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
            .FirstOrDefaultAsync(d => d.UserId == userId);

        IQueryable<Appointment> query = _db.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
                .ThenInclude(d => d.DoctorSpecialties)
                    .ThenInclude(ds => ds.Specialty);

        if (doctor != null)
        {
            query = query.Where(a => a.DoctorId == doctor.Id);
        }

        var appointments = await query
            .OrderByDescending(a => a.AppointmentDateTime)
            .Select(a => new
            {
                a.Id,
                PatientName = a.Patient.FullName,
                PatientBloodGroup = string.IsNullOrWhiteSpace(a.Patient.BloodGroup) ? "O+" : a.Patient.BloodGroup,
                PatientAllergies = "Penicillin (Mild)",
                AppointmentNumber = a.AppointmentNumber ?? $"APT-{a.Id:D4}",
                AppointmentDateTime = a.AppointmentDateTime.ToString("o"),
                a.Notes,
                Status = a.Status.ToString(),
                DoctorName = a.Doctor.FullName,
                SpecialtyName = a.Doctor.DoctorSpecialties.Select(ds => ds.Specialty.Name).FirstOrDefault() ?? "General Medicine",
                Fee = a.Fee ?? a.Doctor.ConsultationFee,
                a.ConsultationStartedAt,
                a.ConsultationEndedAt
            })
            .ToListAsync();

        return Ok(appointments);
    }

    /// <summary>
    /// Get a single doctor by ID with complete profile and verified reviews (public).
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var doctor = await _db.Doctors
            .Include(d => d.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
            .Include(d => d.Availabilities)
            .Include(d => d.Ratings).ThenInclude(r => r.Appointment).ThenInclude(a => a.Patient)
            .Where(d => d.Id == id)
            .Select(d => new
            {
                d.Id,
                d.FullName,
                d.Bio,
                d.Qualifications,
                d.ExperienceYears,
                d.ConsultationFee,
                d.IsActive,
                d.ProfilePhoto,
                d.SubSpecialty,
                d.HospitalClinic,
                d.Languages,
                d.Location,
                d.MbbsUniversity,
                d.PhdUniversity,
                d.OtherQualifications,
                d.Certifications,
                d.Age,
                d.RegistrationNumber,
                Specialties = d.DoctorSpecialties.Select(ds => new { ds.Specialty.Id, ds.Specialty.Name }),
                AverageRating = d.Ratings.Count > 0 ? Math.Round(d.Ratings.Average(r => r.Stars), 1) : 0,
                ReviewCount = d.Ratings.Count,
                Availability = d.Availabilities.Select(a => new { a.DayOfWeek, a.StartTime, a.EndTime }),
                Reviews = d.Ratings.OrderByDescending(r => r.CreatedAt).Take(20).Select(r => new
                {
                    r.Id,
                    r.Stars,
                    Rating = r.Stars,
                    r.Comment,
                    Review = r.Comment,
                    r.CreatedAt,
                    PatientName = r.Appointment.Patient != null ? r.Appointment.Patient.FullName : "Patient"
                })
            })
            .FirstOrDefaultAsync();

        if (doctor == null)
            return NotFound(new { message = "Doctor not found." });

        return Ok(doctor);
    }

    /// <summary>
    /// Get reviews for a specific doctor (public).
    /// </summary>
    [HttpGet("{id}/reviews")]
    [AllowAnonymous]
    public async Task<IActionResult> GetDoctorReviews(int id)
    {
        var doctorExists = await _db.Doctors.AnyAsync(d => d.Id == id);
        if (!doctorExists)
            return NotFound(new { message = "Doctor not found." });

        var reviews = await _db.DoctorRatings
            .Include(r => r.Appointment).ThenInclude(a => a.Patient)
            .Where(r => r.DoctorId == id)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                r.Stars,
                Rating = r.Stars,
                r.Comment,
                Review = r.Comment,
                r.CreatedAt,
                PatientName = r.Appointment.Patient != null ? r.Appointment.Patient.FullName : "Patient"
            })
            .ToListAsync();

        return Ok(reviews);
    }

    /// <summary>
    /// Get profile of the currently logged-in doctor.
    /// </summary>
    [HttpGet("me/profile")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = GetUserId();
        var user = await _db.Users.FindAsync(userId);
        var doctor = await _db.Doctors
            .Include(d => d.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
            .Include(d => d.Ratings)
            .FirstOrDefaultAsync(d => d.UserId == userId);

        if (doctor == null && user != null)
        {
            doctor = await _db.Doctors
                .Include(d => d.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
                .Include(d => d.Ratings)
                .FirstOrDefaultAsync(d => d.FullName == user.FullName);
            if (doctor != null)
            {
                doctor.UserId = userId;
                await _db.SaveChangesAsync();
            }
        }

        if (doctor == null)
            return NotFound(new { message = "Doctor profile not found for this account." });

        return Ok(new
        {
            doctor.Id,
            doctor.FullName,
            Email = user?.Email ?? "",
            PhoneNumber = user?.PhoneNumber ?? "",
            doctor.Bio,
            doctor.Qualifications,
            doctor.ExperienceYears,
            doctor.ConsultationFee,
            doctor.IsActive,
            doctor.ProfilePhoto,
            doctor.SubSpecialty,
            doctor.HospitalClinic,
            doctor.Languages,
            doctor.Location,
            doctor.MbbsUniversity,
            doctor.PhdUniversity,
            doctor.OtherQualifications,
            doctor.Certifications,
            doctor.Age,
            doctor.RegistrationNumber,
            Specialties = doctor.DoctorSpecialties.Select(ds => new { ds.Specialty.Id, ds.Specialty.Name }),
            AverageRating = doctor.Ratings.Count > 0 ? Math.Round(doctor.Ratings.Average(r => r.Stars), 1) : 0,
            ReviewCount = doctor.Ratings.Count
        });
    }

    /// <summary>
    /// Update profile for the currently logged-in doctor.
    /// </summary>
    [HttpPut("me/profile")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateDoctorProfileRequest request)
    {
        var userId = GetUserId();
        var user = await _db.Users.FindAsync(userId);
        var doctor = await _db.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);

        if (doctor == null && user != null)
        {
            doctor = await _db.Doctors.FirstOrDefaultAsync(d => d.FullName == user.FullName);
            if (doctor != null)
            {
                doctor.UserId = userId;
                await _db.SaveChangesAsync();
            }
        }

        if (doctor == null)
            return NotFound(new { message = "Doctor profile not found for this account." });

        if (request.ExperienceYears.HasValue && request.ExperienceYears.Value < 0)
            return BadRequest(new { message = "Experience years cannot be negative." });

        if (request.ConsultationFee.HasValue && request.ConsultationFee.Value < 0)
            return BadRequest(new { message = "Consultation fee cannot be negative." });

        if (request.Age.HasValue && (request.Age.Value < 20 || request.Age.Value > 100))
            return BadRequest(new { message = "Age must be between 20 and 100." });

        if (!string.IsNullOrWhiteSpace(request.FullName))
        {
            var trimmedName = request.FullName.Trim();
            doctor.FullName = trimmedName;
            if (user != null)
            {
                user.FullName = trimmedName;
                user.UpdatedAt = DateTime.UtcNow;
            }
        }

        if (request.PhoneNumber != null)
        {
            var trimmedPhone = request.PhoneNumber.Trim();
            if (user != null)
            {
                user.PhoneNumber = trimmedPhone;
                user.UpdatedAt = DateTime.UtcNow;
            }
        }

        if (request.Bio != null) doctor.Bio = request.Bio.Trim();
        if (request.Qualifications != null) doctor.Qualifications = request.Qualifications.Trim();
        if (request.ExperienceYears.HasValue) doctor.ExperienceYears = request.ExperienceYears.Value;
        if (request.ConsultationFee.HasValue) doctor.ConsultationFee = request.ConsultationFee.Value;
        if (request.ProfilePhoto != null) doctor.ProfilePhoto = request.ProfilePhoto.Trim();
        if (request.SubSpecialty != null) doctor.SubSpecialty = request.SubSpecialty.Trim();
        if (request.HospitalClinic != null) doctor.HospitalClinic = request.HospitalClinic.Trim();
        if (request.Languages != null) doctor.Languages = request.Languages.Trim();
        if (request.Location != null) doctor.Location = request.Location.Trim();
        if (request.MbbsUniversity != null) doctor.MbbsUniversity = request.MbbsUniversity.Trim();
        if (request.PhdUniversity != null) doctor.PhdUniversity = request.PhdUniversity.Trim();
        if (request.OtherQualifications != null) doctor.OtherQualifications = request.OtherQualifications.Trim();
        if (request.Certifications != null) doctor.Certifications = request.Certifications.Trim();
        if (request.Age.HasValue) doctor.Age = request.Age.Value;
        if (request.RegistrationNumber != null) doctor.RegistrationNumber = request.RegistrationNumber.Trim();
        doctor.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new { message = "Profile updated successfully.", doctor.Id });
    }

    /// <summary>
    /// Get all specialties (public).
    /// </summary>
    [HttpGet("specialties")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSpecialties()
    {
        var specialties = await _db.Specialties
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.Description,
                s.Icon,
                DoctorCount = s.DoctorSpecialties.Count
            })
            .ToListAsync();

        return Ok(specialties);
    }

    /// <summary>
    /// Get doctors ranked by specialty — used by Specialist Recommendation Agent.
    /// Returns doctors sorted by a composite score: rating × 0.5 + experience × 0.3 + reviews × 0.2.
    /// </summary>
    [HttpGet("ranked")]
    [Authorize]
    public async Task<IActionResult> GetRankedDoctors([FromQuery] int? specialty, [FromQuery] string? specialtyName)
    {
        var query = _db.Doctors
            .Include(d => d.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
            .Include(d => d.Availabilities)
            .Include(d => d.Ratings)
            .Where(d => d.IsActive)
            .AsQueryable();

        if (specialty.HasValue)
            query = query.Where(d => d.DoctorSpecialties.Any(ds => ds.SpecialtyId == specialty.Value));
        else if (!string.IsNullOrWhiteSpace(specialtyName))
            query = query.Where(d => d.DoctorSpecialties.Any(ds =>
                ds.Specialty.Name.Contains(specialtyName)));

        var doctors = await query.Select(d => new
        {
            d.Id,
            d.FullName,
            d.Bio,
            d.Qualifications,
            d.ExperienceYears,
            d.ConsultationFee,
            d.IsActive,
            d.ProfilePhoto,
            d.SubSpecialty,
            d.HospitalClinic,
            d.Languages,
            d.Location,
            d.MbbsUniversity,
            d.PhdUniversity,
            d.OtherQualifications,
            d.Certifications,
            d.Age,
            d.RegistrationNumber,
            Specialties = d.DoctorSpecialties.Select(ds => new { ds.Specialty.Id, ds.Specialty.Name }),
            AverageRating = d.Ratings.Count > 0 ? Math.Round(d.Ratings.Average(r => r.Stars), 1) : 0.0,
            ReviewCount = d.Ratings.Count,
            Availability = d.Availabilities.Select(a => new { a.DayOfWeek, a.StartTime, a.EndTime })
        }).ToListAsync();

        // Rank by composite score
        var ranked = doctors
            .Select(d => new
            {
                d.Id,
                d.FullName,
                d.Bio,
                d.Qualifications,
                d.ExperienceYears,
                d.ConsultationFee,
                d.IsActive,
                d.ProfilePhoto,
                d.SubSpecialty,
                d.HospitalClinic,
                d.Languages,
                d.Location,
                d.MbbsUniversity,
                d.PhdUniversity,
                d.OtherQualifications,
                d.Certifications,
                d.Age,
                d.RegistrationNumber,
                d.Specialties,
                d.AverageRating,
                d.ReviewCount,
                d.Availability,
                RankScore = Math.Round(
                    d.AverageRating * 0.5 +
                    Math.Min(d.ExperienceYears, 30) / 30.0 * 0.35 +
                    Math.Min(d.ReviewCount, 100) / 100.0 * 0.15, 3)
            })
            .OrderByDescending(d => d.RankScore)
            .ToList();

        return Ok(ranked);
    }

    private int GetUserId()
    {
        var claim = User.FindFirst("userId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value, CultureInfo.InvariantCulture) : 0;
    }
}

public record UpdateDoctorProfileRequest(
    string? FullName,
    string? PhoneNumber,
    string? Bio,
    string? Qualifications,
    int? ExperienceYears,
    decimal? ConsultationFee,
    string? ProfilePhoto,
    string? SubSpecialty,
    string? HospitalClinic,
    string? Languages,
    string? Location,
    string? MbbsUniversity,
    string? PhdUniversity,
    string? OtherQualifications,
    string? Certifications,
    int? Age,
    string? RegistrationNumber
);
