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
        var leaves = await _context.DoctorLeaves
            .Where(l => l.DoctorId == doctorId)
            .OrderBy(l => l.StartDate)
            .ToListAsync();
        
        return Ok(leaves);
    }

    [HttpPost]
    public async Task<IActionResult> CreateLeave(int doctorId, [FromBody] DoctorLeave request)
    {
        // 1. Verify doctor exists
        var doctor = await _context.Doctors.FindAsync(doctorId);
        if (doctor == null) return NotFound("Doctor not found.");

        request.DoctorId = doctorId;
        request.CreatedAt = DateTime.UtcNow;

        // 2. Validate dates
        if (request.StartDate >= request.EndDate)
        {
            return BadRequest("Start date must be before end date.");
        }

        // 3. Add the leave to the database
        _context.DoctorLeaves.Add(request);
        await _context.SaveChangesAsync();

        // 4. Find appointments that overlap with this leave
        var overlappingAppointments = await _context.Appointments
            .Include(a => a.Patient)
            .Where(a => a.DoctorId == doctorId 
                        && a.AppointmentDateTime >= request.StartDate 
                        && a.AppointmentDateTime <= request.EndDate
                        && a.Status != AppointmentStatus.Cancelled)
            .ToListAsync();

        // 5. Cancel overlapping appointments (or notify)
        foreach (var appointment in overlappingAppointments)
        {
            appointment.Status = AppointmentStatus.Cancelled;
            // A Notification could be created here if a Notification system exists
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
                        ? $"Leave added successfully. {overlappingAppointments.Count} overlapping appointments were cancelled and patients notified." 
                        : "Leave added successfully."
        });
    }

    [HttpDelete("{leaveId}")]
    public async Task<IActionResult> DeleteLeave(int doctorId, int leaveId)
    {
        var leave = await _context.DoctorLeaves
            .FirstOrDefaultAsync(l => l.Id == leaveId && l.DoctorId == doctorId);

        if (leave == null) return NotFound("Leave not found.");

        _context.DoctorLeaves.Remove(leave);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
