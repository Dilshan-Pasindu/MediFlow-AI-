using MediFlow.Api.Controllers;
using MediFlow.Api.Data;
using MediFlow.Api.Hubs;
using MediFlow.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Security.Claims;
using Xunit;

namespace MediFlow.Tests;

public class ConsultationLifecycleTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly Mock<IHubContext<ConsultationHub, IConsultationClient>> _mockHubContext;
    private readonly Mock<IHubClients<IConsultationClient>> _mockClients;
    private readonly Mock<IConsultationClient> _mockClientProxy;
    private readonly AppointmentsController _controller;

    public ConsultationLifecycleTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);

        _mockHubContext = new Mock<IHubContext<ConsultationHub, IConsultationClient>>();
        _mockClients = new Mock<IHubClients<IConsultationClient>>();
        _mockClientProxy = new Mock<IConsultationClient>();

        _mockClients.Setup(c => c.All).Returns(_mockClientProxy.Object);
        _mockClients.Setup(c => c.Group(It.IsAny<string>())).Returns(_mockClientProxy.Object);
        _mockHubContext.Setup(h => h.Clients).Returns(_mockClients.Object);

        _controller = new AppointmentsController(_db, _mockHubContext.Object);
        SetUserRole(1, "Doctor");
    }

    private void SetUserRole(int userId, string role)
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim("userId", userId.ToString()),
            new Claim(ClaimTypes.Role, role)
        }, "mock"));

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = user }
        };
    }

    public void Dispose()
    {
        _db.Database.EnsureDeleted();
        _db.Dispose();
    }

    [Fact]
    public async Task StartConsultation_WithConfirmedAppointment_TransitionsToInConsultation()
    {
        // Arrange
        var doctor = new Doctor { Id = 1, FullName = "Dr. Robert Smith", ConsultationFee = 3000, UserId = 1 };
        var patient = new Patient { Id = 1, FullName = "Alice Walker", UserId = 10 };
        var appt = new Appointment
        {
            Id = 101,
            DoctorId = 1,
            PatientId = 1,
            AppointmentNumber = "APT-20260923-0001",
            AppointmentDateTime = DateTime.UtcNow,
            Status = AppointmentStatus.Confirmed
        };

        _db.Doctors.Add(doctor);
        _db.Patients.Add(patient);
        _db.Appointments.Add(appt);
        await _db.SaveChangesAsync();

        // Act
        var result = await _controller.StartConsultation(101) as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        var updated = await _db.Appointments.FindAsync(101);
        Assert.NotNull(updated);
        Assert.Equal(AppointmentStatus.InConsultation, updated.Status);
        Assert.NotNull(updated.ConsultationStartedAt);

        // Verify SignalR event broadcast
        _mockClientProxy.Verify(c => c.ConsultationStarted(It.Is<ConsultationEventPayload>(p =>
            p.AppointmentId == 101 &&
            p.AppointmentNumber == "APT-20260923-0001" &&
            p.Status == "InConsultation"
        )), Times.AtLeastOnce);
    }

    [Fact]
    public async Task StartConsultation_WhenAnotherConsultationActiveForDoctor_ReturnsBadRequest()
    {
        // Arrange: Doctor already has an appointment in InConsultation
        var doctor = new Doctor { Id = 2, FullName = "Dr. John Doe", ConsultationFee = 3000, UserId = 1 };
        var patient = new Patient { Id = 2, FullName = "Bob Martin", UserId = 11 };
        var activeAppt = new Appointment
        {
            Id = 201,
            DoctorId = 2,
            PatientId = 2,
            AppointmentNumber = "APT-20260923-0002",
            AppointmentDateTime = DateTime.UtcNow,
            Status = AppointmentStatus.InConsultation,
            ConsultationStartedAt = DateTime.UtcNow.AddMinutes(-10)
        };
        var secondAppt = new Appointment
        {
            Id = 202,
            DoctorId = 2,
            PatientId = 2,
            AppointmentNumber = "APT-20260923-0003",
            AppointmentDateTime = DateTime.UtcNow,
            Status = AppointmentStatus.Confirmed
        };

        _db.Doctors.Add(doctor);
        _db.Patients.Add(patient);
        _db.Appointments.AddRange(activeAppt, secondAppt);
        await _db.SaveChangesAsync();

        // Act: Try starting second consultation
        var result = await _controller.StartConsultation(202) as BadRequestObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal(400, result.StatusCode);

        // Verify second appointment remains Confirmed
        var checkSecond = await _db.Appointments.FindAsync(202);
        Assert.Equal(AppointmentStatus.Confirmed, checkSecond?.Status);
    }

    [Fact]
    public async Task StartConsultation_WithInvalidStatus_RejectsStart()
    {
        // Arrange
        var doctor = new Doctor { Id = 10, FullName = "Dr. Tester", ConsultationFee = 3000, UserId = 1 };
        var patient = new Patient { Id = 10, FullName = "Test Patient", UserId = 20 };
        var apptCompleted = new Appointment { Id = 301, DoctorId = 10, PatientId = 10, Status = AppointmentStatus.Completed };
        var apptCancelled = new Appointment { Id = 302, DoctorId = 10, PatientId = 10, Status = AppointmentStatus.Cancelled };
        var apptPending = new Appointment { Id = 303, DoctorId = 10, PatientId = 10, Status = AppointmentStatus.Pending };

        _db.Doctors.Add(doctor);
        _db.Patients.Add(patient);
        _db.Appointments.AddRange(apptCompleted, apptCancelled, apptPending);
        await _db.SaveChangesAsync();

        // Act & Assert
        var res1 = await _controller.StartConsultation(301) as BadRequestObjectResult;
        var res2 = await _controller.StartConsultation(302) as BadRequestObjectResult;
        var res3 = await _controller.StartConsultation(303) as BadRequestObjectResult;

        Assert.NotNull(res1);
        Assert.NotNull(res2);
        Assert.NotNull(res3);
        Assert.Equal(400, res1.StatusCode);
        Assert.Equal(400, res2.StatusCode);
        Assert.Equal(400, res3.StatusCode);
    }

    [Fact]
    public async Task CompleteConsultation_WithActiveConsultation_TransitionsToCompleted()
    {
        // Arrange
        var doctor = new Doctor { Id = 3, FullName = "Dr. Jane Smith", ConsultationFee = 3000, UserId = 1 };
        var patient = new Patient { Id = 3, FullName = "Charlie Brown", UserId = 12 };
        var appt = new Appointment
        {
            Id = 401,
            DoctorId = 3,
            PatientId = 3,
            AppointmentNumber = "APT-20260923-0004",
            AppointmentDateTime = DateTime.UtcNow,
            Status = AppointmentStatus.InConsultation,
            ConsultationStartedAt = DateTime.UtcNow.AddMinutes(-20)
        };

        _db.Doctors.Add(doctor);
        _db.Patients.Add(patient);
        _db.Appointments.Add(appt);
        await _db.SaveChangesAsync();

        // Act
        var result = await _controller.CompleteConsultation(401) as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        var updated = await _db.Appointments.FindAsync(401);
        Assert.NotNull(updated);
        Assert.Equal(AppointmentStatus.Completed, updated.Status);
        Assert.NotNull(updated.ConsultationEndedAt);

        // Verify patient notification created
        var notification = await _db.Notifications.FirstOrDefaultAsync(n => n.UserId == 12);
        Assert.NotNull(notification);
        Assert.Equal("Consultation Completed", notification.Title);

        // Verify SignalR event broadcast
        _mockClientProxy.Verify(c => c.ConsultationEnded(It.Is<ConsultationEventPayload>(p =>
            p.AppointmentId == 401 &&
            p.Status == "Completed"
        )), Times.AtLeastOnce);
    }

    [Fact]
    public async Task CompleteConsultation_WhenAlreadyCompleted_ReturnsBadRequest()
    {
        // Arrange
        var doctor = new Doctor { Id = 11, FullName = "Dr. Complete", ConsultationFee = 3000, UserId = 1 };
        var patient = new Patient { Id = 11, FullName = "Patient Complete", UserId = 21 };
        var appt = new Appointment
        {
            Id = 501,
            DoctorId = 11,
            PatientId = 11,
            Status = AppointmentStatus.Completed
        };
        _db.Doctors.Add(doctor);
        _db.Patients.Add(patient);
        _db.Appointments.Add(appt);
        await _db.SaveChangesAsync();

        // Act
        var result = await _controller.CompleteConsultation(501) as BadRequestObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal(400, result.StatusCode);
    }

    [Fact]
    public async Task GetCurrentConsultation_WhenActive_ReturnsActiveConsultationDetails()
    {
        // Arrange
        var doctor = new Doctor { Id = 4, FullName = "Dr. Gregory House", ConsultationFee = 5000, UserId = 1 };
        var patient = new Patient { Id = 4, FullName = "David Lee", UserId = 13 };
        var appt = new Appointment
        {
            Id = 601,
            DoctorId = 4,
            PatientId = 4,
            AppointmentNumber = "APT-20260923-0006",
            AppointmentDateTime = DateTime.UtcNow,
            Status = AppointmentStatus.InConsultation,
            ConsultationStartedAt = DateTime.UtcNow.AddMinutes(-5)
        };

        _db.Doctors.Add(doctor);
        _db.Patients.Add(patient);
        _db.Appointments.Add(appt);
        await _db.SaveChangesAsync();

        // Act
        var result = await _controller.GetCurrentConsultation(4) as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        var json = System.Text.Json.JsonSerializer.Serialize(result.Value);
        using var doc = System.Text.Json.JsonDocument.Parse(json);
        Assert.True(doc.RootElement.GetProperty("hasActiveConsultation").GetBoolean());
        Assert.Equal(601, doc.RootElement.GetProperty("appointmentId").GetInt32());
        Assert.Equal("APT-20260923-0006", doc.RootElement.GetProperty("appointmentNumber").GetString());
        Assert.Equal("InConsultation", doc.RootElement.GetProperty("status").GetString());
    }

    [Fact]
    public async Task GetCurrentConsultation_WhenNoneActive_ReturnsFalse()
    {
        // Act
        var result = await _controller.GetCurrentConsultation(99) as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        var json = System.Text.Json.JsonSerializer.Serialize(result.Value);
        using var doc = System.Text.Json.JsonDocument.Parse(json);
        Assert.False(doc.RootElement.GetProperty("hasActiveConsultation").GetBoolean());
    }
}
