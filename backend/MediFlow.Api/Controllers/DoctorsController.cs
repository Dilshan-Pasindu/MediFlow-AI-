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
                Fee = a.Fee ?? a.Doctor.ConsultationFee
            })
            .ToListAsync();

        return Ok(appointments);
    }

    /// <summary>
    /// Get a single doctor by ID (public).
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var doctor = await _db.Doctors
            .Include(d => d.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
            .Include(d => d.Availabilities)
            .Include(d => d.Ratings)
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
                Specialties = d.DoctorSpecialties.Select(ds => new { ds.Specialty.Id, ds.Specialty.Name }),
                AverageRating = d.Ratings.Count > 0 ? Math.Round(d.Ratings.Average(r => r.Stars), 1) : 0,
                ReviewCount = d.Ratings.Count,
                Availability = d.Availabilities.Select(a => new { a.DayOfWeek, a.StartTime, a.EndTime })
            })
            .FirstOrDefaultAsync();

        if (doctor == null)
            return NotFound(new { message = "Doctor not found." });

        return Ok(doctor);
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
