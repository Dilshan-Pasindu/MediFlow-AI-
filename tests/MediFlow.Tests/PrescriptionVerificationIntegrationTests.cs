using System.Globalization;
using System.Security.Claims;
using MediFlow.Api.Controllers;
using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using MediFlow.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace MediFlow.Tests;

public class PrescriptionVerificationIntegrationTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly Mock<IAiServiceClient> _mockAiClient;
    private readonly PrescriptionsController _controller;

    public PrescriptionVerificationIntegrationTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);
        _mockAiClient = new Mock<IAiServiceClient>();
        _controller = new PrescriptionsController(_db, _mockAiClient.Object);
        SeedData();
    }

    private void SeedData()
    {
        var docUser = new User { Id = 101, FullName = "Dr. Emily Watson", Email = "emily@mediflow.ai", Role = UserRole.Doctor };
        var patUser = new User { Id = 102, FullName = "Sam Wilson", Email = "sam@mediflow.ai", Role = UserRole.Patient };
        var pharmUser = new User { Id = 103, FullName = "Peter Parker", Email = "peter@mediflow.ai", Role = UserRole.Pharmacist };

        _db.Users.AddRange(docUser, patUser, pharmUser);

        var doctor = new Doctor
        {
            Id = 11,
            UserId = 101,
            FullName = "Dr. Emily Watson",
            SubSpecialty = "General Medicine",
            RegistrationNumber = "MED-998822",
            IsActive = true
        };
        var patient = new Patient
        {
            Id = 22,
            UserId = 102,
            FullName = "Sam Wilson",
            Email = "sam@mediflow.ai",
            PhoneNumber = "+1999888777"
        };
        var medicine = new Medicine
        {
            Id = 1,
            MedicineName = "Amoxicillin 500mg",
            GenericName = "Amoxicillin",
            Category = "Antibiotic",
            UnitOfMeasure = "Capsule"
        };

        _db.Doctors.Add(doctor);
        _db.Patients.Add(patient);
        _db.Medicines.Add(medicine);
        _db.SaveChanges();
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
    public async Task CreatePrescription_ValidDoctor_CreatesActivePrescriptionWithItems()
    {
        // Arrange
        SetUserContext(101, "Doctor");
        var request = new CreatePrescriptionRequestDto(
            AppointmentId: null,
            PatientId: 22,
            IsWalkIn: false,
            WalkInPatientDetails: null,
            PatientName: "Sam Wilson",
            Diagnosis: "Upper respiratory tract bacterial infection.",
            FulfillmentSource: "InHouse",
            Recipients: "Both",
            Instructions: "Take after meals with plenty of water",
            Items: new List<CreatePrescriptionItemDto>
            {
                new(
                    MedicineId: 1,
                    MedicineName: "Amoxicillin 500mg",
                    Dosage: "500mg",
                    Frequency: "Three times daily",
                    Duration: "7 days",
                    Quantity: 21,
                    Instructions: "Complete full antibiotic course"
                )
            }
        );

        // Act
        var result = await _controller.CreatePrescription(request);

        // Assert
        var createdResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(createdResult.Value);

        var prescription = await _db.Prescriptions.Include(p => p.Items).OrderByDescending(p => p.Id).FirstAsync();
        Assert.Equal(PrescriptionStatus.Active, prescription.Status);
        Assert.Equal(11, prescription.DoctorId);
        Assert.Single(prescription.Items);
        Assert.Equal("Amoxicillin 500mg", prescription.Items.First().MedicineName);
        Assert.Equal(21, prescription.Items.First().Quantity);
    }

    [Fact]
    public async Task GetPrescriptionById_PatientAccessOwnPrescription_ReturnsSuccess()
    {
        // Arrange - Doctor issues prescription
        SetUserContext(101, "Doctor");
        var prescription = new Prescription
        {
            DoctorId = 11,
            PatientId = 22,
            Status = PrescriptionStatus.Active,
            Diagnosis = "Standard fever and malaise",
            Instructions = "Rest and hydration",
            CreatedAt = DateTime.UtcNow,
            Items = new List<PrescriptionItem>
            {
                new() { MedicineName = "Paracetamol 500mg", Dosage = "500mg", Frequency = "TDS", Duration = "3 days", Quantity = 9 }
            }
        };
        _db.Prescriptions.Add(prescription);
        await _db.SaveChangesAsync();

        // Act - Patient queries prescription
        SetUserContext(102, "Patient");
        var result = await _controller.GetPrescriptionById(prescription.Id);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var dto = Assert.IsType<PrescriptionDto>(okResult.Value);
        Assert.Equal(prescription.Id, dto.Id);
        Assert.Equal("Sam Wilson", dto.PatientName);
        Assert.Equal("Paracetamol 500mg", dto.Items[0].MedicineName);
    }

    public void Dispose()
    {
        _db.Database.EnsureDeleted();
        _db.Dispose();
    }
}
