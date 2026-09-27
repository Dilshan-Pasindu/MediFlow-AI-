using System.Security.Claims;
using MediFlow.Api.Controllers;
using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace MediFlow.Tests;

public class PharmacistValidationAuditTests : IDisposable
{
    private readonly AppDbContext _db;

    public PharmacistValidationAuditTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);
        SeedTestData();
    }

    public void Dispose()
    {
        _db.Database.EnsureDeleted();
        _db.Dispose();
    }

    private static ControllerContext BuildContext(int userId, string role)
    {
        var claims = new[]
        {
            new Claim("userId", userId.ToString()),
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Role, role)
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);
        return new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };
    }

    private void SeedTestData()
    {
        var pharmacistUser = new User { Id = 3, FullName = "Pharmacist Bob", Email = "bob@pharmacy.com", Role = UserRole.Pharmacist };
        var doctorUser = new User { Id = 4, FullName = "Dr. John", Email = "john@hospital.com", Role = UserRole.Doctor };
        var patientUser = new User { Id = 2, FullName = "Alice Patient", Email = "alice@patient.com", Role = UserRole.Patient };
        _db.Users.AddRange(pharmacistUser, doctorUser, patientUser);

        var patient = new Patient { Id = 1, UserId = 2, FullName = "Alice Patient", Email = "alice@patient.com", Allergies = "Penicillin, Sulfa" };
        _db.Patients.Add(patient);

        var doctor = new Doctor { Id = 1, UserId = 4, FullName = "Dr. John" };
        _db.Doctors.Add(doctor);

        var pharmacy = new Pharmacy { Id = 1, Name = "MediFlow Central Pharmacy", OwnerId = 3 };
        _db.Pharmacies.Add(pharmacy);

        var medicine = new Medicine { Id = 10, MedicineName = "Amoxicillin 500mg", GenericName = "Amoxicillin", Category = "Antibiotic" };
        _db.Medicines.Add(medicine);

        var inventoryItem = new InventoryItem
        {
            Id = 100,
            PharmacyId = 1,
            MedicineId = 10,
            CurrentStock = 50,
            MinStockLevel = 5,
            UnitPrice = 25.00m
        };
        _db.InventoryItems.Add(inventoryItem);

        _db.SaveChanges();
    }

    // ─── SECTION A ────────────────────────────────────────────────────────────

    [Fact]
    public async Task SectionA_GetIncomingPrescriptions_OnlyReturnsActiveInHouseWithoutOrders()
    {
        var ctrl = new PharmacistController(_db) { ControllerContext = BuildContext(3, "Pharmacist") };

        // Active + InHouse -> Should be returned
        var rx1 = new Prescription { Id = 101, DoctorId = 1, PatientId = 1, Status = PrescriptionStatus.Active, FulfillmentSource = FulfillmentSource.InHouse };
        // Active + External -> Should NOT be returned
        var rx2 = new Prescription { Id = 102, DoctorId = 1, PatientId = 1, Status = PrescriptionStatus.Active, FulfillmentSource = FulfillmentSource.External };
        // Fulfilled + InHouse -> Should NOT be returned
        var rx3 = new Prescription { Id = 103, DoctorId = 1, PatientId = 1, Status = PrescriptionStatus.Fulfilled, FulfillmentSource = FulfillmentSource.InHouse };
        
        _db.Prescriptions.AddRange(rx1, rx2, rx3);
        await _db.SaveChangesAsync();

        var result = await ctrl.GetIncomingPrescriptions();
        var ok = Assert.IsType<OkObjectResult>(result);
        var dtos = Assert.IsType<List<PrescriptionDto>>(ok.Value);

        Assert.Single(dtos);
        Assert.Equal(101, dtos[0].Id);
    }

    // ─── SECTION B ────────────────────────────────────────────────────────────

    [Fact]
    public async Task SectionB_AcknowledgeWarning_RejectsIfLogIdMismatchedOrMissingOverrideNoteForHighSeverity()
    {
        var aiMock = new Moq.Mock<MediFlow.Api.Services.IAiServiceClient>();
        var ctrl = new PrescriptionsController(_db, aiMock.Object) { ControllerContext = BuildContext(3, "Pharmacist") };

        var log1 = new DrugInteractionLog { Id = 10, PrescriptionId = 200, SeverityLevel = "High", WarningType = WarningType.DrugInteraction, DrugA = "A", AcknowledgedAt = null };
        var log2 = new DrugInteractionLog { Id = 11, PrescriptionId = 201, SeverityLevel = "High", WarningType = WarningType.DrugInteraction, DrugA = "B", AcknowledgedAt = null };
        _db.DrugInteractionLogs.AddRange(log1, log2);
        await _db.SaveChangesAsync();

        // Rejects log mismatch (log 11 belongs to rx 201, not 200)
        var resultMismatch = await ctrl.AcknowledgeWarning(200, new AcknowledgeWarningRequestDto(11, "Note"));
        var bad1 = Assert.IsType<BadRequestObjectResult>(resultMismatch);
        Assert.Contains("does not belong to prescription", bad1.Value?.ToString());

        // Rejects missing override note for High severity
        var resultNoNote = await ctrl.AcknowledgeWarning(200, new AcknowledgeWarningRequestDto(10, "   "));
        var bad2 = Assert.IsType<BadRequestObjectResult>(resultNoNote);
        Assert.Contains("OverrideNote is required", bad2.Value?.ToString());

        // Succeeds with valid note
        var resultOk = await ctrl.AcknowledgeWarning(200, new AcknowledgeWarningRequestDto(10, "Verified with patient doctor"));
        Assert.IsType<OkObjectResult>(resultOk);
    }

    // ─── SECTION C ────────────────────────────────────────────────────────────

    [Fact]
    public async Task SectionC_CreateOrder_RejectsDuplicateOrder_ExpiredPrescription_ExternalFulfillment()
    {
        var ctrl = new OrdersController(_db) { ControllerContext = BuildContext(3, "Pharmacist") };

        var rxActive = new Prescription { Id = 301, Status = PrescriptionStatus.Active, FulfillmentSource = FulfillmentSource.InHouse, SafetyCheckedAt = DateTime.UtcNow };
        var rxExpired = new Prescription { Id = 302, Status = PrescriptionStatus.Expired, FulfillmentSource = FulfillmentSource.InHouse, SafetyCheckedAt = DateTime.UtcNow };
        var rxExternal = new Prescription { Id = 303, Status = PrescriptionStatus.Active, FulfillmentSource = FulfillmentSource.External, SafetyCheckedAt = DateTime.UtcNow };
        _db.Prescriptions.AddRange(rxActive, rxExpired, rxExternal);

        // Pre-existing order for rx 301
        var existingOrder = new MedicineOrder { Id = 501, PrescriptionId = 301, PharmacyId = 1, Status = OrderStatus.Pending };
        _db.Orders.Add(existingOrder);
        await _db.SaveChangesAsync();

        // Duplicate order attempt -> 409
        var resDup = await ctrl.CreateOrder(new CreateOrderRequestDto(301, 1, 1, null, null, null));
        Assert.IsType<ConflictObjectResult>(resDup);

        // Expired prescription attempt -> 400
        var resExp = await ctrl.CreateOrder(new CreateOrderRequestDto(302, 1, 1, null, null, null));
        Assert.IsType<BadRequestObjectResult>(resExp);

        // External fulfillment prescription attempt -> 400
        var resExt = await ctrl.CreateOrder(new CreateOrderRequestDto(303, 1, 1, null, null, null));
        Assert.IsType<BadRequestObjectResult>(resExt);
    }

    [Fact]
    public async Task SectionC_MandatoryAISafetyCheck_BlocksConversionUntilSafetyCheckedAtIsSet()
    {
        var aiMock = new Moq.Mock<MediFlow.Api.Services.IAiServiceClient>();
        aiMock.Setup(a => a.CheckMedicationSafetyAsync(
            Moq.It.IsAny<List<string>>(),
            Moq.It.IsAny<string>(),
            Moq.It.IsAny<int?>(),
            Moq.It.IsAny<int?>(),
            Moq.It.IsAny<List<string>>()))
            .ReturnsAsync(new MedicationCheckResultDto(
                SafeToDispense: true,
                SafetyScore: 100,
                Interactions: new List<DrugInteractionDto>(),
                AllergyWarnings: new List<string>(),
                DosageWarnings: new List<string>(),
                Alternatives: new List<AlternativeDrugDto>(),
                Summary: "Safe"
            ));

        var ordersCtrl = new OrdersController(_db) { ControllerContext = BuildContext(3, "Pharmacist") };
        var rxCtrl = new PrescriptionsController(_db, aiMock.Object) { ControllerContext = BuildContext(3, "Pharmacist") };

        var rx = new Prescription
        {
            Id = 350,
            PatientId = 1,
            DoctorId = 1,
            Status = PrescriptionStatus.Active,
            FulfillmentSource = FulfillmentSource.InHouse,
            SafetyCheckedAt = null, // Safety check NOT run yet
            Items = new List<PrescriptionItem>
            {
                new PrescriptionItem { MedicineId = 10, MedicineName = "Amoxicillin 500mg", Dosage = "500mg", Quantity = 1 }
            }
        };
        _db.Prescriptions.Add(rx);
        await _db.SaveChangesAsync();

        // Attempt CreateOrder before safety check -> 409 Conflict
        var resBefore = await ordersCtrl.CreateOrder(new CreateOrderRequestDto(350, 1, 1, null, null, null));
        var conflict = Assert.IsType<ConflictObjectResult>(resBefore);
        Assert.Contains("must pass the AI safety check", conflict.Value?.ToString());

        // Run AI Safety Check via PrescriptionsController screen-interactions
        var resScreen = await rxCtrl.ScreenInteractions(350, 1);
        Assert.IsType<OkObjectResult>(resScreen);

        // Verify SafetyCheckedAt was populated
        var updatedRx = await _db.Prescriptions.FindAsync(350);
        Assert.NotNull(updatedRx!.SafetyCheckedAt);

        // Retry CreateOrder after safety check -> 200 OK success
        var resAfter = await ordersCtrl.CreateOrder(new CreateOrderRequestDto(350, 1, 1, null, null, null));
        var ok = Assert.IsType<OkObjectResult>(resAfter);
        var orderDto = Assert.IsType<OrderDto>(ok.Value);
        Assert.Equal(350, orderDto.PrescriptionId);
    }

    [Fact]
    public async Task SectionC_Bug13Fix_PrescriptionCopyPathResolvesUnitPriceFromInventoryByName()
    {
        var ctrl = new OrdersController(_db) { ControllerContext = BuildContext(3, "Pharmacist") };

        var rx = new Prescription
        {
            Id = 310,
            Status = PrescriptionStatus.Active,
            FulfillmentSource = FulfillmentSource.InHouse,
            SafetyCheckedAt = DateTime.UtcNow,
            Items = new List<PrescriptionItem>
            {
                new PrescriptionItem { MedicineId = null, MedicineName = "Amoxicillin 500mg", Dosage = "500mg", Quantity = 2 }
            }
        };
        _db.Prescriptions.Add(rx);
        await _db.SaveChangesAsync();

        // Convert prescription to order without passing explicit items
        var res = await ctrl.CreateOrder(new CreateOrderRequestDto(310, 1, 1, null, null, null));
        var ok = Assert.IsType<OkObjectResult>(res);
        var orderDto = Assert.IsType<OrderDto>(ok.Value);

        Assert.Single(orderDto.Items);
        var item = orderDto.Items[0];
        Assert.Equal(25.00m, item.UnitPrice); // Resolved from InventoryItem (25.00)
        Assert.Equal(50.00m, item.Subtotal); // 2 * 25.00
        Assert.Equal(50.00m, orderDto.TotalAmount);
    }

    // ─── SECTION E ────────────────────────────────────────────────────────────

    [Fact]
    public async Task SectionE_Bug18Fix_GenerateBill_RejectsOrderWithUnpricedOrZeroItems()
    {
        var ctrl = new OrdersController(_db) { ControllerContext = BuildContext(3, "Pharmacist") };

        var orderUnpriced = new MedicineOrder
        {
            Id = 401,
            PharmacyId = 1,
            Status = OrderStatus.Pending,
            TotalAmount = 0m,
            Items = new List<OrderItem>
            {
                new OrderItem { MedicineName = "Amoxicillin 500mg", Quantity = 2, UnitPrice = 0m, Subtotal = 0m }
            }
        };
        _db.Orders.Add(orderUnpriced);
        await _db.SaveChangesAsync();

        var res = await ctrl.GenerateBill(401);
        var badRequest = Assert.IsType<BadRequestObjectResult>(res);
        Assert.Contains("invalid/unset prices", badRequest.Value?.ToString());
        Assert.Contains("Amoxicillin 500mg", badRequest.Value?.ToString());

        // Confirm no invoice was generated
        Assert.Null(await _db.Invoices.FirstOrDefaultAsync(i => i.MedicineOrderId == 401));
    }

    // ─── SECTION H ────────────────────────────────────────────────────────────

    [Fact]
    public async Task SectionH_DeleteOrder_VoidsUnpaidInvoice_BlocksIfPaidInvoiceExists()
    {
        var ctrl = new OrdersController(_db) { ControllerContext = BuildContext(3, "Pharmacist") };

        // Order 501: Unpaid invoice
        var order1 = new MedicineOrder { Id = 501, PharmacyId = 1, Status = OrderStatus.Pending, TotalAmount = 25m };
        var inv1 = new Invoice { Id = 501, MedicineOrderId = 501, InvoiceNumber = "INV-000501", TotalAmount = 25m, IsPaid = false };
        _db.Orders.Add(order1);
        _db.Invoices.Add(inv1);

        // Order 502: Paid invoice
        var order2 = new MedicineOrder { Id = 502, PharmacyId = 1, Status = OrderStatus.Pending, TotalAmount = 25m };
        var inv2 = new Invoice { Id = 502, MedicineOrderId = 502, InvoiceNumber = "INV-000502", TotalAmount = 25m, IsPaid = true };
        _db.Orders.Add(order2);
        _db.Invoices.Add(inv2);

        await _db.SaveChangesAsync();

        // Cancelling order with paid invoice -> 409 Conflict
        var resPaid = await ctrl.DeleteOrder(502);
        Assert.IsType<ConflictObjectResult>(resPaid);

        // Cancelling order with unpaid invoice -> succeeds and voids invoice
        var resUnpaid = await ctrl.DeleteOrder(501);
        Assert.IsType<OkObjectResult>(resUnpaid);

        var cancelledOrder = await _db.Orders.FindAsync(501);
        Assert.Equal(OrderStatus.Cancelled, cancelledOrder!.Status);
        Assert.Null(await _db.Invoices.FindAsync(501)); // Invoice removed/voided
    }
}
