using MediFlow.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            query = query.Where(d => d.FullName.ToLower().Contains(search.ToLower()));

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
            AverageRating = d.Ratings.Any() ? Math.Round(d.Ratings.Average(r => r.Stars), 1) : 0,
            ReviewCount = d.Ratings.Count,
            Availability = d.Availabilities.Select(a => new { a.DayOfWeek, a.StartTime, a.EndTime })
        }).ToListAsync();

        return Ok(doctors);
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
                AverageRating = d.Ratings.Any() ? Math.Round(d.Ratings.Average(r => r.Stars), 1) : 0,
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
}
