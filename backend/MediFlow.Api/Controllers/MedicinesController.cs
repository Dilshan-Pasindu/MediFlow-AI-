using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediFlow.Api.Controllers;

/// <summary>
/// Medicine catalog management. Shared entity (used by Member 3 prescriptions too).
/// </summary>
[ApiController]
[Route("api/medicines")]
[Authorize]
public class MedicinesController : ControllerBase
{
    private readonly AppDbContext _db;
    public MedicinesController(AppDbContext db) => _db = db;

    /// <summary>GET /api/medicines — Search medicine catalog.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search = null, [FromQuery] string? category = null)
    {
        var query = _db.Medicines.Where(m => m.IsActive);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(m =>
                m.MedicineName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                m.GenericName.Contains(search, StringComparison.OrdinalIgnoreCase));

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(m => m.Category == category);

        var medicines = await query
            .OrderBy(m => m.MedicineName)
            .Select(m => new MedicineDto(m.Id, m.MedicineName, m.GenericName, m.Category, m.UnitOfMeasure, m.IsActive))
            .ToListAsync();

        return Ok(medicines);
    }

    /// <summary>GET /api/medicines/{id}</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var m = await _db.Medicines.FindAsync(id);
        if (m == null) return NotFound(new { message = "Medicine not found." });
        return Ok(new MedicineDto(m.Id, m.MedicineName, m.GenericName, m.Category, m.UnitOfMeasure, m.IsActive));
    }
}
