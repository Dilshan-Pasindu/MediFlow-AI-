using System.Globalization;
using System.Security.Claims;
using MediFlow.Api.Controllers;
using MediFlow.Api.Data;
using MediFlow.Api.Hubs;
using MediFlow.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace MediFlow.Tests;

public class AppointmentLifecycleIntegrationTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly Mock<IHubContext<ConsultationHub, IConsultationClient>> _mockHubContext;
    private readonly Mock<IHubClients<IConsultationClient>> _mockClients;
    private readonly Mock<IConsultationClient> _mockClientProxy;
    private readonly AppointmentsController _controller;

    public AppointmentLifecycleIntegrationTests()
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
    }

    private void SetUserContext(int userId, string role)
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim("userId", userId.ToString(CultureInfo.InvariantCulture)),
            new Claim(ClaimTypes.Role, role)
        }, "TestAuth"));

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = user }
        };
    }

    [Fact]
    public async Task CompleteAppointmentLifecycle_BookingToCompletion_Succeeds()
    {
        // 1. Seed Doctor and Patient
        var docUser = new User
        {
            Id = 10,
            FullName = "Dr. Alice Morgan",
            Email = "alice@example.com",
            PasswordHash = "hash",
            Role = UserRole.Doctor
        };
        var patUser = new User
        {
            Id = 20,
            FullName = "John Doe",
            Email = "john@example.com",
            PasswordHash = "hash",
            Role = UserRole.Patient
        };
        var doctor = new Doctor
        {
            Id = 1,
            UserId = 10,
            FullName = "Dr. Alice Morgan",
            SubSpecialty = "Cardiology",
            IsActive = true,
            ConsultationFee = 50.0m
        };
        var patient = new Patient
        {
            Id = 1,
            UserId = 20,
            FullName = "John Doe",
            Email = "john@example.com",
            PhoneNumber = "+1234567890"
        };

        _db.Users.AddRange(docUser, patUser);
        _db.Doctors.Add(doctor);
        _db.Patients.Add(patient);
        await _db.SaveChangesAsync();

        // 2. Patient Books Appointment
        SetUserContext(20, "Patient");
        var bookingRequest = new BookAppointmentRequest(
            DoctorId: 1,
            DateTime: DateTime.UtcNow.AddDays(2),
            Notes: "Routine checkup and BP review"
        );

        var bookResult = await _controller.BookAppointment(bookingRequest);
        var okBook = Assert.IsType<OkObjectResult>(bookResult);
        Assert.NotNull(okBook.Value);

        var bookedAppointment = await _db.Appointments.OrderByDescending(a => a.Id).FirstAsync();
        Assert.Equal(AppointmentStatus.Pending, bookedAppointment.Status);
        Assert.Equal(50.0m, bookedAppointment.Fee);

        // 3. Receptionist confirms payment and assigns appointment number
        bookedAppointment.Status = AppointmentStatus.Confirmed;
        bookedAppointment.AppointmentNumber = "APP-2026-0001";
        await _db.SaveChangesAsync();

        // 4. Doctor starts consultation
        SetUserContext(10, "Doctor");
        var startResult = await _controller.StartConsultation(bookedAppointment.Id);
        Assert.IsType<OkObjectResult>(startResult);

        var startedAppointment = await _db.Appointments.FindAsync(bookedAppointment.Id);
        Assert.NotNull(startedAppointment);
        Assert.Equal(AppointmentStatus.InConsultation, startedAppointment.Status);
        Assert.NotNull(startedAppointment.ConsultationStartedAt);

        // 5. Doctor completes consultation
        var completeResult = await _controller.CompleteConsultation(bookedAppointment.Id);
        Assert.IsType<OkObjectResult>(completeResult);

        var finishedAppointment = await _db.Appointments.FindAsync(bookedAppointment.Id);
        Assert.NotNull(finishedAppointment);
        Assert.Equal(AppointmentStatus.Completed, finishedAppointment.Status);
        Assert.NotNull(finishedAppointment.ConsultationEndedAt);
    }

    [Fact]
    public async Task BookAppointment_WhenDoctorInactive_ReturnsBadRequest()
    {
        // Arrange
        var docUser = new User { Id = 11, FullName = "Dr. Bob", Email = "bob@example.com", PasswordHash = "hash", Role = UserRole.Doctor };
        var patUser = new User { Id = 21, FullName = "Jane Doe", Email = "jane@example.com", PasswordHash = "hash", Role = UserRole.Patient };
        var doctor = new Doctor { Id = 2, UserId = 11, FullName = "Dr. Bob", SubSpecialty = "Dermatology", IsActive = false };
        var patient = new Patient { Id = 2, UserId = 21, FullName = "Jane Doe", Email = "jane@example.com" };

        _db.Users.AddRange(docUser, patUser);
        _db.Doctors.Add(doctor);
        _db.Patients.Add(patient);
        await _db.SaveChangesAsync();

        SetUserContext(21, "Patient");
        var bookingRequest = new BookAppointmentRequest(
            DoctorId: 2,
            DateTime: DateTime.UtcNow.AddDays(1),
            Notes: "Skin rash"
        );

        // Act
        var result = await _controller.BookAppointment(bookingRequest);

        // Assert
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("not accepting new appointments", badRequest.Value?.ToString());
    }

    [Fact]
    public async Task BookAppointment_InPast_ReturnsBadRequest()
    {
        // Arrange
        var docUser = new User { Id = 12, FullName = "Dr. Charlie", Email = "charlie@example.com", PasswordHash = "hash", Role = UserRole.Doctor };
        var patUser = new User { Id = 22, FullName = "Mark", Email = "mark@example.com", PasswordHash = "hash", Role = UserRole.Patient };
        var doctor = new Doctor { Id = 3, UserId = 12, FullName = "Dr. Charlie", SubSpecialty = "General", IsActive = true };
        var patient = new Patient { Id = 3, UserId = 22, FullName = "Mark", Email = "mark@example.com" };

        _db.Users.AddRange(docUser, patUser);
        _db.Doctors.Add(doctor);
        _db.Patients.Add(patient);
        await _db.SaveChangesAsync();

        SetUserContext(22, "Patient");
        var bookingRequest = new BookAppointmentRequest(
            DoctorId: 3,
            DateTime: DateTime.UtcNow.AddDays(-2),
            Notes: "Checkup"
        );

        // Act
        var result = await _controller.BookAppointment(bookingRequest);

        // Assert
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("Cannot book an appointment in the past", badRequest.Value?.ToString());
    }

    public void Dispose()
    {
        _db.Database.EnsureDeleted();
        _db.Dispose();
    }
}
