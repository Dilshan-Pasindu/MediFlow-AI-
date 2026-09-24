using System;
using System.Linq;
using System.Threading.Tasks;
using MediFlow.Api.Data;
using MediFlow.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediFlow.Api.Controllers;

public record CreateDoctorLeaveRequest(
    DateTime StartDate,
    DateTime EndDate,
    string? Reason
);

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
            .Select(l => new { l.Id, l.DoctorId, l.StartDate, l.EndDate, l.Reason, l.CreatedAt })
            .ToListAsync();
        
        return Ok(leaves);
    }

    [HttpPost]
    public async Task<IActionResult> CreateLeave(int doctorId, [FromBody] CreateDoctorLeaveRequest dto)
    {
        // 1. Verify doctor exists (by DoctorId or UserId)
        var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.Id == doctorId || d.UserId == doctorId);
        if (doctor == null) return NotFound(new { message = "Doctor profile not found." });

        var startDateUtc = DateTime.SpecifyKind(dto.StartDate, DateTimeKind.Utc);
        var endDateUtc = DateTime.SpecifyKind(dto.EndDate, DateTimeKind.Utc);

        // 2. Validate dates/times
        if (startDateUtc >= endDateUtc)
        {
            return BadRequest(new { message = "Start date and time must be before end date and time." });
        }

        // 3. Prevent scheduling leave in the past
        if (startDateUtc < DateTime.UtcNow)
        {
            return BadRequest(new { message = "Start date and time cannot be in the past." });
        }

        // 4. Minimum duration: 30 minutes
        var duration = endDateUtc - startDateUtc;
        if (duration.TotalMinutes < 30)
        {
            return BadRequest(new { message = "Leave duration must be at least 30 minutes." });
        }

        // 5. Maximum duration: 90 days
        if (duration.TotalDays > 90)
        {
            return BadRequest(new { message = "Leave duration cannot exceed 90 days. For extended leave, please contact administration." });
        }

        // 6. Check overlap with existing leaves for this doctor
        var overlappingLeave = await _context.DoctorLeaves
            .Where(l => l.DoctorId == doctor.Id
                && l.StartDate < endDateUtc
                && l.EndDate > startDateUtc)
            .FirstOrDefaultAsync();

        if (overlappingLeave != null)
        {
            return BadRequest(new { message = $"This leave overlaps with an existing leave ({overlappingLeave.StartDate:yyyy-MM-dd HH:mm} — {overlappingLeave.EndDate:yyyy-MM-dd HH:mm}). Please choose a non-overlapping time range." });
        }

        // 7. Validate reason length
        if (!string.IsNullOrEmpty(dto.Reason) && dto.Reason.Length > 200)
        {
            return BadRequest(new { message = "Reason must be 200 characters or less." });
        }

        var leave = new DoctorLeave
        {
            DoctorId = doctor.Id,
            StartDate = startDateUtc,
            EndDate = endDateUtc,
            Reason = dto.Reason,
            CreatedAt = DateTime.UtcNow
        };

        // 8. Add the leave to the database
        _context.DoctorLeaves.Add(leave);
        await _context.SaveChangesAsync();

        // 4. Find appointments that overlap with this leave
        var overlappingAppointments = await _context.Appointments
            .Include(a => a.Patient)
            .Where(a => a.DoctorId == doctor.Id 
                        && a.AppointmentDateTime >= leave.StartDate 
                        && a.AppointmentDateTime <= leave.EndDate
                        && a.Status != AppointmentStatus.Cancelled)
            .ToListAsync();

        // 5. Cancel overlapping appointments & notify patients
        foreach (var appointment in overlappingAppointments)
        {
            appointment.Status = AppointmentStatus.Cancelled;
            appointment.UpdatedAt = DateTime.UtcNow;

            // Notify the patient kindly
            var patient = appointment.Patient;
            if (patient != null)
            {
                var apptTime = appointment.AppointmentDateTime.ToString("dddd, MMMM d 'at' h:mm tt", System.Globalization.CultureInfo.InvariantCulture);
                _context.Notifications.Add(new MediFlow.Api.Models.Notification
                {
                    UserId = patient.UserId,
                    Title = "Appointment Rescheduling Notice",
                    Message = $"We're sorry for the inconvenience. Your appointment scheduled for {apptTime} has been cancelled because your doctor has taken an approved leave during that time. Please book a new appointment at your earliest convenience. We apologise for any disruption to your healthcare plans.",
                    Type = "warning",
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        if (overlappingAppointments.Any())
        {
            await _context.SaveChangesAsync();
        }

        return Ok(new 
        { 
            Leave = new { leave.Id, leave.DoctorId, leave.StartDate, leave.EndDate, leave.Reason, leave.CreatedAt }, 
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
