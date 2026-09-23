using MediFlow.Api.Controllers;
using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Xunit;

namespace MediFlow.Tests;

public class PatientValidationTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly PatientController _controller;

    public PatientValidationTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);

        _controller = new PatientController(_db);
        SetUser(200);
    }

    private void SetUser(int userId)
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim("userId", userId.ToString()),
            new Claim(ClaimTypes.Role, "Patient")
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
    public async Task UpdateProfile_WhenFullNameEmpty_ReturnsBadRequest()
    {
        _db.Patients.Add(new Patient { Id = 1, UserId = 200, FullName = "Valid Name" });
        await _db.SaveChangesAsync();

        var request = new UpdatePatientRequest(FullName: "   ");
        var result = await _controller.UpdateProfile(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("between 2 and 100 characters", badRequest.Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task UpdateProfile_WhenPhoneFormatInvalid_ReturnsBadRequest()
    {
        _db.Patients.Add(new Patient { Id = 1, UserId = 200, FullName = "Valid Name" });
        await _db.SaveChangesAsync();

        var request = new UpdatePatientRequest(PhoneNumber: "abc-invalid-phone");
        var result = await _controller.UpdateProfile(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("Invalid phone number format", badRequest.Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task UpdateProfile_WhenDateOfBirthInFuture_ReturnsBadRequest()
    {
        _db.Patients.Add(new Patient { Id = 1, UserId = 200, FullName = "Valid Name" });
        await _db.SaveChangesAsync();

        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var request = new UpdatePatientRequest(DateOfBirth: tomorrow);
        var result = await _controller.UpdateProfile(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("future", badRequest.Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task UpdateProfile_WhenBloodGroupInvalid_ReturnsBadRequest()
    {
        _db.Patients.Add(new Patient { Id = 1, UserId = 200, FullName = "Valid Name" });
        await _db.SaveChangesAsync();

        var request = new UpdatePatientRequest(BloodGroup: "Z_POSITIVE");
        var result = await _controller.UpdateProfile(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("Invalid blood group", badRequest.Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task UpdateProfile_WhenValidData_UpdatesSuccessfully()
    {
        var patient = new Patient { Id = 1, UserId = 200, FullName = "Initial Name", PhoneNumber = "+94771234567" };
        _db.Patients.Add(patient);
        await _db.SaveChangesAsync();

        var request = new UpdatePatientRequest(
            FullName: "Updated Patient Name",
            PhoneNumber: "+94779876543",
            DateOfBirth: new DateOnly(1995, 5, 20),
            Gender: "Female",
            BloodGroup: "O+",
            Address: "123 Galle Road, Colombo",
            Allergies: "Penicillin"
        );

        var result = await _controller.UpdateProfile(request);
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var updated = await _db.Patients.FirstAsync(p => p.Id == patient.Id);
        Assert.Equal("Updated Patient Name", updated.FullName);
        Assert.Equal("+94779876543", updated.PhoneNumber);
        Assert.Equal("O+", updated.BloodGroup);
        Assert.Equal("Female", updated.Gender);
    }

    [Fact]
    public async Task CancelAppointment_WhenAppointmentAlreadyCompleted_ReturnsBadRequest()
    {
        var patient = new Patient { Id = 1, UserId = 200, FullName = "Valid Name" };
        var doctor = new Doctor { Id = 1, UserId = 10, FullName = "Dr. Test" };
        _db.Patients.Add(patient);
        _db.Doctors.Add(doctor);
        _db.Appointments.Add(new Appointment
        {
            Id = 50,
            PatientId = patient.Id,
            DoctorId = doctor.Id,
            AppointmentDateTime = DateTime.UtcNow.AddDays(2),
            Status = AppointmentStatus.Completed
        });
        await _db.SaveChangesAsync();

        var result = await _controller.CancelAppointment(50, new CancelAppointmentRequest("No longer needed"));
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("Cannot cancel", badRequest.Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task CancelAppointment_WhenAppointmentInPast_ReturnsBadRequest()
    {
        var patient = new Patient { Id = 1, UserId = 200, FullName = "Valid Name" };
        var doctor = new Doctor { Id = 1, UserId = 10, FullName = "Dr. Test" };
        _db.Patients.Add(patient);
        _db.Doctors.Add(doctor);
        _db.Appointments.Add(new Appointment
        {
            Id = 51,
            PatientId = patient.Id,
            DoctorId = doctor.Id,
            AppointmentDateTime = DateTime.UtcNow.AddDays(-1),
            Status = AppointmentStatus.Pending
        });
        await _db.SaveChangesAsync();

        var result = await _controller.CancelAppointment(51, new CancelAppointmentRequest("Past cancellation"));
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("already passed", badRequest.Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task SubmitSymptoms_WhenTooShort_ReturnsBadRequest()
    {
        _db.Patients.Add(new Patient { Id = 1, UserId = 200, FullName = "Valid Name" });
        await _db.SaveChangesAsync();

        var request = new SubmitSymptomsRequest("Pain");
        var result = await _controller.SubmitSymptoms(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("at least 5 characters", badRequest.Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task SubmitSymptoms_WhenValid_ReturnsRecommendation()
    {
        _db.Patients.Add(new Patient { Id = 1, UserId = 200, FullName = "Valid Name" });
        await _db.SaveChangesAsync();

        var request = new SubmitSymptomsRequest("I have severe recurring chest pain and heart palpitations", "2 days", "Severe");
        var result = await _controller.SubmitSymptoms(request);
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }
}
