using System;
using System.Linq;
using System.Threading.Tasks;
using MediFlow.Api.Data;
using MediFlow.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediFlow.Api.Controllers;

[ApiController]
[Route("api/doctors/{doctorId}/leaves")]
public class DoctorLeaveController : ControllerBase
{
    private readonly AppDbContext _context;

    public DoctorLeaveController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetLeaves(int doctorId)
    {
        var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.Id == doctorId || d.UserId == doctorId);
        if (doctor == null) return NotFound(new { message = "Doctor profile not found." });

        var leaves = await _context.DoctorLeaves
            .Where(l => l.DoctorId == doctor.Id)
            .OrderBy(l => l.StartDate)
            .ToListAsync();
        
        return Ok(leaves);
    }

    [HttpPost]
    public async Task<IActionResult> CreateLeave(int doctorId, [FromBody] DoctorLeave request)
    {
        // 1. Verify doctor exists (by DoctorId or UserId)
        var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.Id == doctorId || d.UserId == doctorId);
        if (doctor == null) return NotFound(new { message = "Doctor profile not found." });

        request.DoctorId = doctor.Id;
        request.CreatedAt = DateTime.UtcNow;

        // Ensure UTC DateTime kinds
        request.StartDate = DateTime.SpecifyKind(request.StartDate, DateTimeKind.Utc);
        request.EndDate = DateTime.SpecifyKind(request.EndDate, DateTimeKind.Utc);

        // 2. Validate dates/times
        if (request.StartDate >= request.EndDate)
        {
            return BadRequest(new { message = "Start date and time must be before end date and time." });
        }

        // 3. Add the leave to the database
        _context.DoctorLeaves.Add(request);
        await _context.SaveChangesAsync();

        // 4. Find appointments that overlap with this leave
        var overlappingAppointments = await _context.Appointments
            .Include(a => a.Patient)
            .Where(a => a.DoctorId == doctor.Id 
                        && a.AppointmentDateTime >= request.StartDate 
                        && a.AppointmentDateTime <= request.EndDate
                        && a.Status != AppointmentStatus.Cancelled)
            .ToListAsync();

        // 5. Cancel overlapping appointments
        foreach (var appointment in overlappingAppointments)
        {
            appointment.Status = AppointmentStatus.Cancelled;
            appointment.UpdatedAt = DateTime.UtcNow;
        }

        if (overlappingAppointments.Any())
        {
            await _context.SaveChangesAsync();
        }

        return Ok(new 
        { 
            Leave = request, 
            CancelledAppointmentsCount = overlappingAppointments.Count,
            Message = overlappingAppointments.Any() 
                        ? $"Leave added successfully. {overlappingAppointments.Count} overlapping appointment(s) were cancelled and patients notified." 
                        : "Leave added successfully."
        });
    }

    [HttpDelete("{leaveId}")]
    public async Task<IActionResult> DeleteLeave(int doctorId, int leaveId)
    {
        var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.Id == doctorId || d.UserId == doctorId);
        if (doctor == null) return NotFound(new { message = "Doctor profile not found." });

        var leave = await _context.DoctorLeaves
            .FirstOrDefaultAsync(l => l.Id == leaveId && l.DoctorId == doctor.Id);

        if (leave == null) return NotFound(new { message = "Leave not found." });

        _context.DoctorLeaves.Remove(leave);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
