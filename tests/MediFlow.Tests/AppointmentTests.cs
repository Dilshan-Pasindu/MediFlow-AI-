using MediFlow.Api.Models;
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

        appointment.Status = AppointmentStatus.Completed;
        Assert.Equal(AppointmentStatus.Completed, appointment.Status);
    }

    [Theory]
    [InlineData(AppointmentStatus.Pending)]
    [InlineData(AppointmentStatus.PaymentSubmitted)]
    [InlineData(AppointmentStatus.Confirmed)]
    [InlineData(AppointmentStatus.Completed)]
    [InlineData(AppointmentStatus.Cancelled)]
    [InlineData(AppointmentStatus.NoShow)]
    public void AppointmentStatus_AllEnumValues_AreValid(AppointmentStatus status)
    {
        Assert.True(Enum.IsDefined(typeof(AppointmentStatus), status));
    }
}
