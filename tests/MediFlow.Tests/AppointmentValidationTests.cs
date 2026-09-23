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

public class AppointmentValidationTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly Mock<IHubContext<ConsultationHub, IConsultationClient>> _mockHubContext;
    private readonly AppointmentsController _controller;

    public AppointmentValidationTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);

        _mockHubContext = new Mock<IHubContext<ConsultationHub, IConsultationClient>>();
        var mockClients = new Mock<IHubClients<IConsultationClient>>();
        var mockClientProxy = new Mock<IConsultationClient>();

        mockClients.Setup(c => c.All).Returns(mockClientProxy.Object);
        mockClients.Setup(c => c.Group(It.IsAny<string>())).Returns(mockClientProxy.Object);
        _mockHubContext.Setup(h => h.Clients).Returns(mockClients.Object);

        _controller = new AppointmentsController(_db, _mockHubContext.Object);
        SetUser(100, "Patient");
    }

    private void SetUser(int userId, string role)
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
    public async Task BookAppointment_WhenPatientNotFound_ReturnsNotFound()
    {
        var request = new BookAppointmentRequest(1, DateTime.UtcNow.AddDays(2), "Regular checkup");
        var result = await _controller.BookAppointment(request);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task BookAppointment_WhenDoctorIdInvalid_ReturnsBadRequest()
    {
        _db.Patients.Add(new Patient { Id = 1, UserId = 100, FullName = "Test Patient" });
        await _db.SaveChangesAsync();

        var request = new BookAppointmentRequest(0, DateTime.UtcNow.AddDays(2), "Regular checkup");
        var result = await _controller.BookAppointment(request);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task BookAppointment_WhenDoctorInactive_ReturnsBadRequest()
    {
        _db.Patients.Add(new Patient { Id = 1, UserId = 100, FullName = "Test Patient" });
        _db.Doctors.Add(new Doctor { Id = 1, UserId = 10, FullName = "Dr. Inactive", IsActive = false, ConsultationFee = 2500 });
        await _db.SaveChangesAsync();

        var request = new BookAppointmentRequest(1, DateTime.UtcNow.AddDays(2), "Regular checkup");
        var result = await _controller.BookAppointment(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("not accepting", badRequest.Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task BookAppointment_WhenDateInPast_ReturnsBadRequest()
    {
        _db.Patients.Add(new Patient { Id = 1, UserId = 100, FullName = "Test Patient" });
        _db.Doctors.Add(new Doctor { Id = 1, UserId = 10, FullName = "Dr. Active", IsActive = true, ConsultationFee = 2500 });
        await _db.SaveChangesAsync();

        var request = new BookAppointmentRequest(1, DateTime.UtcNow.AddHours(-2), "Regular checkup");
        var result = await _controller.BookAppointment(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("past", badRequest.Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task BookAppointment_WhenMoreThan90DaysInAdvance_ReturnsBadRequest()
    {
        _db.Patients.Add(new Patient { Id = 1, UserId = 100, FullName = "Test Patient" });
        _db.Doctors.Add(new Doctor { Id = 1, UserId = 10, FullName = "Dr. Active", IsActive = true, ConsultationFee = 2500 });
        await _db.SaveChangesAsync();

        var request = new BookAppointmentRequest(1, DateTime.UtcNow.AddDays(95), "Far future");
        var result = await _controller.BookAppointment(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("90 days", badRequest.Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task BookAppointment_WhenNotesExceed500Characters_ReturnsBadRequest()
    {
        _db.Patients.Add(new Patient { Id = 1, UserId = 100, FullName = "Test Patient" });
        _db.Doctors.Add(new Doctor { Id = 1, UserId = 10, FullName = "Dr. Active", IsActive = true, ConsultationFee = 2500 });
        await _db.SaveChangesAsync();

        var longNotes = new string('A', 501);
        var request = new BookAppointmentRequest(1, DateTime.UtcNow.AddDays(2), longNotes);
        var result = await _controller.BookAppointment(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("500 characters", badRequest.Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task BookAppointment_WhenDuplicateBookingOnSameDate_ReturnsBadRequest()
    {
        var patient = new Patient { Id = 1, UserId = 100, FullName = "Test Patient" };
        var doctor = new Doctor { Id = 1, UserId = 10, FullName = "Dr. Active", IsActive = true, ConsultationFee = 2500 };
        var bookingDate = DateTime.UtcNow.Date.AddDays(3).AddHours(10);

        _db.Patients.Add(patient);
        _db.Doctors.Add(doctor);
        _db.Appointments.Add(new Appointment
        {
            PatientId = patient.Id,
            DoctorId = doctor.Id,
            AppointmentDateTime = bookingDate,
            Status = AppointmentStatus.Confirmed
        });
        await _db.SaveChangesAsync();

        // Attempt second booking for same doctor on same date at 14:00
        var request = new BookAppointmentRequest(doctor.Id, bookingDate.Date.AddHours(14), "Second checkup");
        var result = await _controller.BookAppointment(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("already have an appointment with this doctor", badRequest.Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task BookAppointment_WhenPatientHasConflictingAppointmentWithAnotherDoctor_ReturnsBadRequest()
    {
        var patient = new Patient { Id = 1, UserId = 100, FullName = "Test Patient" };
        var doctorA = new Doctor { Id = 1, UserId = 10, FullName = "Dr. Alan", IsActive = true, ConsultationFee = 2500 };
        var doctorB = new Doctor { Id = 2, UserId = 11, FullName = "Dr. Betty", IsActive = true, ConsultationFee = 3000 };
        var appointmentTime = DateTime.UtcNow.Date.AddDays(4).AddHours(11);

        _db.Patients.Add(patient);
        _db.Doctors.AddRange(doctorA, doctorB);
        _db.Appointments.Add(new Appointment
        {
            PatientId = patient.Id,
            DoctorId = doctorA.Id,
            AppointmentDateTime = appointmentTime,
            Status = AppointmentStatus.Pending
        });
        await _db.SaveChangesAsync();

        // Attempt booking with Doctor B within 15 minutes of Doctor A's appointment
        var request = new BookAppointmentRequest(doctorB.Id, appointmentTime.AddMinutes(15), "Overlap checkup");
        var result = await _controller.BookAppointment(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("already have an appointment scheduled around this time", badRequest.Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task BookAppointment_WhenDoctorOnLeave_ReturnsBadRequest()
    {
        var patient = new Patient { Id = 1, UserId = 100, FullName = "Test Patient" };
        var doctor = new Doctor { Id = 1, UserId = 10, FullName = "Dr. Leave", IsActive = true, ConsultationFee = 2500 };
        var leaveDay = DateTime.UtcNow.Date.AddDays(5);

        _db.Patients.Add(patient);
        _db.Doctors.Add(doctor);
        _db.DoctorLeaves.Add(new DoctorLeave
        {
            DoctorId = doctor.Id,
            StartDate = leaveDay,
            EndDate = leaveDay.AddDays(2),
            Reason = "Medical conference"
        });
        await _db.SaveChangesAsync();

        var request = new BookAppointmentRequest(doctor.Id, leaveDay.AddHours(10), "Conference conflict");
        var result = await _controller.BookAppointment(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("on leave", badRequest.Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task BookAppointment_ValidRequest_SucceedsAndCreatesAppointment()
    {
        var patient = new Patient { Id = 1, UserId = 100, FullName = "Test Patient" };
        var doctor = new Doctor { Id = 1, UserId = 10, FullName = "Dr. Available", IsActive = true, ConsultationFee = 2500 };
        var futureDate = DateTime.UtcNow.Date.AddDays(3).AddHours(10);

        _db.Patients.Add(patient);
        _db.Doctors.Add(doctor);
        await _db.SaveChangesAsync();

        var request = new BookAppointmentRequest(doctor.Id, futureDate, "Valid consultation note");
        var result = await _controller.BookAppointment(request);
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var created = await _db.Appointments.FirstOrDefaultAsync(a => a.PatientId == patient.Id && a.DoctorId == doctor.Id);
        Assert.NotNull(created);
        Assert.Equal(AppointmentStatus.Pending, created.Status);
        Assert.Equal(2500, created.Fee);
        Assert.StartsWith("APT-", created.AppointmentNumber ?? "");
    }
}
