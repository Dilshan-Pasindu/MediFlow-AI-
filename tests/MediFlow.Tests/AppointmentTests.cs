using MediFlow.Api.Data;
using MediFlow.Api.Extensions;
using MediFlow.Api.Models;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MediFlow.Tests;

public class AppointmentTests
{
    [Fact]
    public void NewAppointment_DefaultStatus_IsPending()
    {
        // Arrange & Act
        var appointment = new Appointment();

        // Assert
        Assert.Equal(AppointmentStatus.Pending, appointment.Status);
        Assert.Null(appointment.AppointmentNumber);
        Assert.True(appointment.CreatedAt <= DateTime.UtcNow);
    }

    [Fact]
    public void AppointmentStatus_SupportsFullLifecycle()
    {
        // Arrange
        var appointment = new Appointment
        {
            Id = 1,
            PatientId = 10,
            DoctorId = 20,
            AppointmentDateTime = DateTime.UtcNow.AddDays(2),
            Fee = 2500.00m
        };

        // Act & Assert - Status progression
        appointment.Status = AppointmentStatus.PaymentSubmitted;
        Assert.Equal(AppointmentStatus.PaymentSubmitted, appointment.Status);

        appointment.Status = AppointmentStatus.Confirmed;
        appointment.AppointmentNumber = "APP-2026-0001";
        Assert.Equal(AppointmentStatus.Confirmed, appointment.Status);
        Assert.Equal("APP-2026-0001", appointment.AppointmentNumber);

        appointment.Status = AppointmentStatus.InConsultation;
        appointment.ConsultationStartedAt = DateTime.UtcNow;
        Assert.Equal(AppointmentStatus.InConsultation, appointment.Status);
        Assert.NotNull(appointment.ConsultationStartedAt);

        appointment.Status = AppointmentStatus.Completed;
        appointment.ConsultationEndedAt = DateTime.UtcNow;
        Assert.Equal(AppointmentStatus.Completed, appointment.Status);
        Assert.NotNull(appointment.ConsultationEndedAt);
    }

    [Theory]
    [InlineData(AppointmentStatus.Pending)]
    [InlineData(AppointmentStatus.PaymentSubmitted)]
    [InlineData(AppointmentStatus.Confirmed)]
    [InlineData(AppointmentStatus.InConsultation)]
    [InlineData(AppointmentStatus.Completed)]
    [InlineData(AppointmentStatus.Cancelled)]
    [InlineData(AppointmentStatus.NoShow)]
    public void AppointmentStatus_AllEnumValues_AreValid(AppointmentStatus status)
    {
        Assert.True(Enum.IsDefined(typeof(AppointmentStatus), status));
    }

    [Fact]
    public async Task CancelExpiredPendingAppointmentsAsync_CancelsOnlyPastPendingAppointments()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        using var db = new AppDbContext(options);

        var yesterday = DateTime.UtcNow.Date.AddDays(-1).AddHours(9);
        var tomorrow = DateTime.UtcNow.Date.AddDays(1).AddHours(9);

        // 1. Past Pending -> should be cancelled
        var pastPending = new Appointment
        {
            PatientId = 1,
            DoctorId = 1,
            AppointmentDateTime = yesterday,
            Status = AppointmentStatus.Pending
        };

        // 2. Past PaymentSubmitted -> should be cancelled
        var pastPaymentSubmitted = new Appointment
        {
            PatientId = 1,
            DoctorId = 1,
            AppointmentDateTime = yesterday,
            Status = AppointmentStatus.PaymentSubmitted
        };

        // 3. Past Confirmed -> should be cancelled (past unconsulted confirmed appointments cannot remain active)
        var pastConfirmed = new Appointment
        {
            PatientId = 1,
            DoctorId = 1,
            AppointmentDateTime = yesterday,
            Status = AppointmentStatus.Confirmed
        };

        // 4. Past Completed -> should NOT be cancelled
        var pastCompleted = new Appointment
        {
            PatientId = 1,
            DoctorId = 1,
            AppointmentDateTime = yesterday,
            Status = AppointmentStatus.Completed
        };

        // 5. Future Pending -> should NOT be cancelled
        var futurePending = new Appointment
        {
            PatientId = 1,
            DoctorId = 1,
            AppointmentDateTime = tomorrow,
            Status = AppointmentStatus.Pending
        };

        // 6. Future Confirmed -> should NOT be cancelled
        var futureConfirmed = new Appointment
        {
            PatientId = 1,
            DoctorId = 1,
            AppointmentDateTime = tomorrow,
            Status = AppointmentStatus.Confirmed
        };

        db.Appointments.AddRange(pastPending, pastPaymentSubmitted, pastConfirmed, pastCompleted, futurePending, futureConfirmed);
        await db.SaveChangesAsync();

        var count = await db.CancelExpiredPendingAppointmentsAsync(patientId: 1);
        Assert.Equal(3, count);

        var refreshedPastPending = await db.Appointments.FindAsync(pastPending.Id);
        var refreshedPastPaymentSubmitted = await db.Appointments.FindAsync(pastPaymentSubmitted.Id);
        var refreshedPastConfirmed = await db.Appointments.FindAsync(pastConfirmed.Id);
        var refreshedPastCompleted = await db.Appointments.FindAsync(pastCompleted.Id);
        var refreshedFuturePending = await db.Appointments.FindAsync(futurePending.Id);
        var refreshedFutureConfirmed = await db.Appointments.FindAsync(futureConfirmed.Id);

        Assert.Equal(AppointmentStatus.Cancelled, refreshedPastPending!.Status);
        Assert.Equal(AppointmentStatus.Cancelled, refreshedPastPaymentSubmitted!.Status);
        Assert.Equal(AppointmentStatus.Cancelled, refreshedPastConfirmed!.Status);
        Assert.Equal(AppointmentStatus.Completed, refreshedPastCompleted!.Status);
        Assert.Equal(AppointmentStatus.Pending, refreshedFuturePending!.Status);
        Assert.Equal(AppointmentStatus.Confirmed, refreshedFutureConfirmed!.Status);
    }
}
