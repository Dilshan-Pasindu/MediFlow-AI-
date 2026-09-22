using System.Security.Claims;
using MediFlow.Api.Controllers;
using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using MediFlow.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace MediFlow.Tests;

/// <summary>
/// Tests for Phase B: Medication Intelligence Backend Integration.
/// Covers:
///  - DrugInteractionLog persistence per warning type
///  - Pharmacist acknowledgment flow (High severity note enforcement)
///  - OrdersController HITL gate (Pending → Confirmed blocked by unacknowledged High warnings)
/// </summary>
public class PrescriptionSafetyTests : IDisposable
{
    private readonly AppDbContext _db;

    // A mock IAiServiceClient that returns a configurable result
    private readonly Mock<IAiServiceClient> _aiMock;

    public PrescriptionSafetyTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);

        _aiMock = new Mock<IAiServiceClient>();

        SeedMinimalData();
    }

    public void Dispose()
    {
        _db.Database.EnsureDeleted();
        _db.Dispose();
    }

    // ─── Shared seed data ─────────────────────────────────────────────────

    private void SeedMinimalData()
    {
        _db.Users.Add(new User { Id = 1, FullName = "Dr. Smith", Email = "dr@test.com", Role = UserRole.Doctor });
        _db.Users.Add(new User { Id = 2, FullName = "Bob Pharmacist", Email = "pharm@test.com", Role = UserRole.Pharmacist });
        _db.Doctors.Add(new Doctor
        {
            Id = 1, UserId = 1, FullName = "Dr. Smith",
            Bio = "Test", Qualifications = "MBBS", ExperienceYears = 5,
            ConsultationFee = 1000m, IsActive = true
        });
        _db.Pharmacies.Add(new Pharmacy { Id = 1, Name = "City Pharmacy", OwnerId = 2 });

        var prescription = new Prescription
        {
            Id = 10, DoctorId = 1, IsWalkIn = false,
            Status = PrescriptionStatus.Active
        };
        prescription.Items.Add(new PrescriptionItem
        {
            MedicineName = "Warfarin", Dosage = "5mg", Quantity = 30
        });
        prescription.Items.Add(new PrescriptionItem
        {
            MedicineName = "Aspirin", Dosage = "100mg", Quantity = 30
        });
        _db.Prescriptions.Add(prescription);
        _db.SaveChanges();

        // An order linked to the prescription
        _db.Orders.Add(new MedicineOrder
        {
            Id = 1, PrescriptionId = 10,
            PharmacyId = 1, PharmacistId = 2,
            Status = OrderStatus.Pending, TotalAmount = 500m
        });
        _db.SaveChanges();
    }

    // ─── Helper: build a controller with a Pharmacist identity ────────────

    private static PrescriptionsController BuildPrescriptionsController(
        AppDbContext db, IAiServiceClient ai)
    {
        var ctrl = new PrescriptionsController(db, ai);
        ctrl.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new System.Security.Claims.ClaimsPrincipal(
                    new ClaimsIdentity(new[]
                    {
                        new Claim("userId", "2"),
                        new Claim(ClaimTypes.Role, "Pharmacist")
                    }, "Test"))
            }
        };
        return ctrl;
    }

    private static OrdersController BuildOrdersController(AppDbContext db)
    {
        var ctrl = new OrdersController(db);
        ctrl.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new System.Security.Claims.ClaimsPrincipal(
                    new ClaimsIdentity(new[]
                    {
                        new Claim("userId", "2"),
                        new Claim(ClaimTypes.Role, "Pharmacist")
                    }, "Test"))
            }
        };
        return ctrl;
    }

    // ─── Build a standard AI result with known warning types ─────────────

    private static MedicationCheckResultDto BuildAiResult(
        bool hasInteraction = false,
        bool hasAllergy = false,
        bool hasDosage = false)
    {
        var interactions = hasInteraction
            ? new List<DrugInteractionDto>
            {
                new(DrugPair: new List<string> { "Warfarin", "Aspirin" },
                    Severity: "High",
                    Description: "Increased bleeding risk",
                    Recommendation: "Avoid combination")
            }
            : new List<DrugInteractionDto>();

        var allergyWarnings = hasAllergy
            ? new List<string> { "Patient is allergic to Aspirin (NSAID class)" }
            : new List<string>();

        var dosageWarnings = hasDosage
            ? new List<string> { "Warfarin 5mg may be high for geriatric patient" }
            : new List<string>();

        return new MedicationCheckResultDto(
            SafeToDispense: interactions.Count == 0 && allergyWarnings.Count == 0,
            SafetyScore: 65,
            Interactions: interactions,
            AllergyWarnings: allergyWarnings,
            DosageWarnings: dosageWarnings,
            Alternatives: new List<AlternativeDrugDto>(),
            Summary: "Test summary");
    }

    // ─── TEST 1 ───────────────────────────────────────────────────────────

    [Fact]
    public async Task ScreenInteractions_PersistsLogsForEachWarningType()
    {
        // Arrange
        var aiResult = BuildAiResult(hasInteraction: true, hasAllergy: true, hasDosage: true);
        _aiMock.Setup(a => a.CheckMedicationSafetyAsync(
                It.IsAny<List<string>>(), It.IsAny<string?>(),
                It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<List<string>?>()))
            .ReturnsAsync(aiResult);

        var ctrl = BuildPrescriptionsController(_db, _aiMock.Object);

        // Act
        var result = await ctrl.ScreenInteractions(10, pharmacyId: null);

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<ScreenInteractionsResponseDto>(ok.Value);

        // 1 DDI + 1 allergy + 1 dosage = 3 logs
        Assert.Equal(3, response.WarningLogIds.Count);

        var logs = _db.DrugInteractionLogs.Where(l => l.PrescriptionId == 10).ToList();
        Assert.Equal(3, logs.Count);
        Assert.Contains(logs, l => l.WarningType == WarningType.DrugInteraction);
        Assert.Contains(logs, l => l.WarningType == WarningType.AllergyContraindication);
        Assert.Contains(logs, l => l.WarningType == WarningType.DosageWarning);
    }

    // ─── TEST 2 ───────────────────────────────────────────────────────────

    [Fact]
    public async Task AcknowledgeWarning_HighSeverity_RequiresOverrideNote()
    {
        // Arrange: seed a High-severity log directly
        _db.DrugInteractionLogs.Add(new DrugInteractionLog
        {
            Id = 100, PrescriptionId = 10,
            DrugA = "Warfarin", DrugB = "Aspirin",
            WarningType = WarningType.DrugInteraction,
            SeverityLevel = "High",
            Description = "Bleeding risk"
        });
        await _db.SaveChangesAsync();

        var ctrl = BuildPrescriptionsController(_db, _aiMock.Object);
        var request = new AcknowledgeWarningRequestDto(LogId: 100, OverrideNote: null);

        // Act
        var result = await ctrl.AcknowledgeWarning(10, request);

        // Assert — 400 because OverrideNote is missing
        Assert.IsType<BadRequestObjectResult>(result);
    }

    // ─── TEST 3 ───────────────────────────────────────────────────────────

    [Fact]
    public async Task AcknowledgeWarning_HighSeverity_SucceedsWithNote()
    {
        // Arrange
        _db.DrugInteractionLogs.Add(new DrugInteractionLog
        {
            Id = 101, PrescriptionId = 10,
            DrugA = "Warfarin", DrugB = "Aspirin",
            WarningType = WarningType.DrugInteraction,
            SeverityLevel = "High",
            Description = "Bleeding risk"
        });
        await _db.SaveChangesAsync();

        var ctrl = BuildPrescriptionsController(_db, _aiMock.Object);
        var request = new AcknowledgeWarningRequestDto(
            LogId: 101,
            OverrideNote: "Prescribing doctor confirmed benefit outweighs risk for this patient.");

        // Act
        var result = await ctrl.AcknowledgeWarning(10, request);

        // Assert — 200 and log is stamped
        Assert.IsType<OkObjectResult>(result);

        var log = await _db.DrugInteractionLogs.FindAsync(101);
        Assert.NotNull(log);
        Assert.NotNull(log!.AcknowledgedAt);
        Assert.Equal(2, log.PharmacistId);
        Assert.NotNull(log.PharmacistOverrideNote);
    }

    // ─── TEST 4 ───────────────────────────────────────────────────────────

    [Fact]
    public async Task AdvanceOrderStatus_BlockedByUnacknowledgedHighWarning()
    {
        // Arrange: seed an unacknowledged High log for prescription 10
        _db.DrugInteractionLogs.Add(new DrugInteractionLog
        {
            Id = 200, PrescriptionId = 10,
            DrugA = "Warfarin", DrugB = "Aspirin",
            WarningType = WarningType.DrugInteraction,
            SeverityLevel = "High",
            Description = "Bleeding risk",
            AcknowledgedAt = null  // not yet acknowledged
        });
        await _db.SaveChangesAsync();

        var ctrl = BuildOrdersController(_db);
        var dto = new UpdateOrderStatusDto("Confirmed");

        // Act
        var result = await ctrl.UpdateOrderStatus(1, dto);

        // Assert — must be 409 Conflict
        var conflict = Assert.IsType<ConflictObjectResult>(result);
        Assert.NotNull(conflict.Value);
    }

    // ─── TEST 5 ───────────────────────────────────────────────────────────

    [Fact]
    public async Task AdvanceOrderStatus_AllowedAfterHighWarningAcknowledged()
    {
        // Arrange: seed an acknowledged High log
        _db.DrugInteractionLogs.Add(new DrugInteractionLog
        {
            Id = 201, PrescriptionId = 10,
            DrugA = "Warfarin", DrugB = "Aspirin",
            WarningType = WarningType.DrugInteraction,
            SeverityLevel = "High",
            Description = "Bleeding risk",
            PharmacistId = 2,
            PharmacistOverrideNote = "Doctor confirmed it is safe for this patient.",
            AcknowledgedAt = DateTime.UtcNow.AddMinutes(-5)
        });
        await _db.SaveChangesAsync();

        var ctrl = BuildOrdersController(_db);
        var dto = new UpdateOrderStatusDto("Confirmed");

        // Act
        var result = await ctrl.UpdateOrderStatus(1, dto);

        // Assert — 200 OK, order advanced
        var ok = Assert.IsType<OkObjectResult>(result);
        var updated = Assert.IsType<OrderDto>(ok.Value);
        Assert.Equal("Confirmed", updated.Status);
    }

    // ─── TEST 6 ───────────────────────────────────────────────────────────

    [Fact]
    public async Task AdvanceOrderStatus_ModerateWarningDoesNotBlock()
    {
        // Arrange: seed an unacknowledged Moderate log (should not block)
        _db.DrugInteractionLogs.Add(new DrugInteractionLog
        {
            Id = 202, PrescriptionId = 10,
            DrugA = "Warfarin 5mg",
            WarningType = WarningType.DosageWarning,
            SeverityLevel = "Moderate",
            Description = "Dosage may need review for elderly patient",
            AcknowledgedAt = null   // unacknowledged — but Moderate, not High
        });
        await _db.SaveChangesAsync();

        var ctrl = BuildOrdersController(_db);
        var dto = new UpdateOrderStatusDto("Confirmed");

        // Act
        var result = await ctrl.UpdateOrderStatus(1, dto);

        // Assert — 200, Moderate warning does NOT block
        var ok = Assert.IsType<OkObjectResult>(result);
        var updated = Assert.IsType<OrderDto>(ok.Value);
        Assert.Equal("Confirmed", updated.Status);
    }
}
