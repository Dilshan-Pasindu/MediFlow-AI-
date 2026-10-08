using MediFlow.Api.Data;
using MediFlow.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MediFlow.Api.Extensions;

public static class AppointmentExtensions
{
    public static readonly AppointmentStatus[] ActiveBookingStatuses = new[]
    {
        AppointmentStatus.Pending,
        AppointmentStatus.PaymentPending,
        AppointmentStatus.PaymentSubmitted,
        AppointmentStatus.PaymentVerified,
        AppointmentStatus.WaitingForReceptionist,
        AppointmentStatus.Confirmed,
        AppointmentStatus.ReceptionistApproved,
        AppointmentStatus.InConsultation
    };

    public static readonly AppointmentStatus[] ExpiredActiveStatuses = ActiveBookingStatuses;

    public static readonly AppointmentStatus[] PendingStatuses = ExpiredActiveStatuses;

    /// <summary>
    /// Cancels past pending and confirmed appointments whose scheduled day is over.
    /// Can be filtered by patientId, doctorId, or system-wide.
    /// </summary>
    public static async Task<int> CancelExpiredPendingAppointmentsAsync(
        this AppDbContext db,
        int? patientId = null,
        int? doctorId = null,
        CancellationToken cancellationToken = default)
    {
        var todayUtc = DateTime.UtcNow.Date;
        var query = db.Appointments
            .Where(a => a.AppointmentDateTime.Date < todayUtc
                && ExpiredActiveStatuses.Contains(a.Status));

        if (patientId.HasValue)
        {
            query = query.Where(a => a.PatientId == patientId.Value);
        }

        if (doctorId.HasValue)
        {
            query = query.Where(a => a.DoctorId == doctorId.Value);
        }

        var expiredAppointments = await query.ToListAsync(cancellationToken);
        if (expiredAppointments.Count == 0)
        {
            return 0;
        }

        var now = DateTime.UtcNow;
        foreach (var appt in expiredAppointments)
        {
            appt.Status = AppointmentStatus.Cancelled;
            appt.UpdatedAt = now;
            const string cancelReason = "[Auto-cancelled: Appointment date has passed]";
            if (string.IsNullOrWhiteSpace(appt.Notes))
            {
                appt.Notes = cancelReason;
            }
            else if (!appt.Notes.Contains("[Auto-cancelled"))
            {
                appt.Notes = $"{appt.Notes.Trim()} {cancelReason}";
            }
        }

        await db.SaveChangesAsync(cancellationToken);
        return expiredAppointments.Count;
    }
}
