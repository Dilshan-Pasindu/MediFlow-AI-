using System.Security.Claims;
using MediFlow.Api.Controllers;
using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MediFlow.Tests;

public class PrescriptionAndOrderTests : IDisposable
{
    private readonly AppDbContext _db;

    public PrescriptionAndOrderTests()
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

    private void SeedTestData()
    {
        var doctorUser = new User { Id = 1, FullName = "Dr. Jane Doe", Email = "doctor@example.com", Role = UserRole.Doctor };
        var patientUser1 = new User { Id = 2, FullName = "Alice Brown", Email = "alice@example.com", Role = UserRole.Patient };
        var pharmacistUser = new User { Id = 3, FullName = "Bob Smith", Email = "bob@example.com", Role = UserRole.Pharmacist };
        var patientUser2 = new User { Id = 4, FullName = "Charlie Davis", Email = "charlie@example.com", Role = UserRole.Patient };

        _db.Users.AddRange(doctorUser, patientUser1, pharmacistUser, patientUser2);

        var specialty = new Specialty { Id = 1, Name = "Cardiology" };
        _db.Specialties.Add(specialty);

        var doctor = new Doctor
        {
            Id = 1,
            UserId = 1,
            FullName = "Dr. Jane Doe",
            Bio = "Experienced Cardiologist",
            Qualifications = "MBBS, MD",
            ExperienceYears = 10,
            ConsultationFee = 3000m,
            IsActive = true
        };
        _db.Doctors.Add(doctor);

        _db.DoctorSpecialties.Add(new DoctorSpecialty { DoctorId = 1, SpecialtyId = 1 });

        var patient1 = new Patient
        {
            Id = 1,
            UserId = 2,
            FullName = "Alice Brown",
            Email = "alice@example.com",
            PhoneNumber = "0779998877",
            DateOfBirth = new DateOnly(1990, 5, 10),
            Gender = "Female"
        };
        var patient2 = new Patient
        {
            Id = 2,
            UserId = 4,
            FullName = "Charlie Davis",
            Email = "charlie@example.com",
            PhoneNumber = "0775554433",
            DateOfBirth = new DateOnly(1985, 8, 20),
            Gender = "Male"
        };
        _db.Patients.AddRange(patient1, patient2);

        var pharmacy = new Pharmacy
        {
            Id = 1,
            Name = "MediFlow Central Pharmacy",
            Location = "Colombo 03",
            ContactNumber = "0112345678",
            OwnerId = 3
        };
        _db.Pharmacies.Add(pharmacy);

        var med1 = new Medicine
        {
            Id = 1,
            MedicineName = "Amoxicillin 500mg",
            Category = "Antibiotics",
            UnitOfMeasure = "Capsule",
            IsActive = true
        };
        var med2 = new Medicine
        {
            Id = 2,
            MedicineName = "Paracetamol 500mg",
            Category = "Analgesic",
            UnitOfMeasure = "Tablet",
            IsActive = true
        };
        _db.Medicines.AddRange(med1, med2);

        _db.InventoryItems.Add(new InventoryItem
        {
            Id = 1,
            PharmacyId = 1,
            MedicineId = 1,
            CurrentStock = 200,
            MinStockLevel = 20,
            UnitPrice = 25.00m
        });
        _db.InventoryItems.Add(new InventoryItem
        {
            Id = 2,
            PharmacyId = 1,
            MedicineId = 2,
            CurrentStock = 500,
            MinStockLevel = 50,
            UnitPrice = 5.00m
        });

        _db.SaveChanges();
    }

    private static ControllerContext CreateContext(int userId, string role)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim("userId", userId.ToString()),
            new Claim(ClaimTypes.Role, role)
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        return new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) }
        };
    }

    // ─── PrescriptionsController Tests ─────────────────────────────────────

    [Fact]
    public async Task CreatePrescription_ValidRegisteredPatient_SucceedsAndCreatesNotification()
    {
        // Arrange
        var controller = new PrescriptionsController(_db)
        {
            ControllerContext = CreateContext(1, "Doctor")
        };

        var request = new CreatePrescriptionRequestDto(
            AppointmentId: null,
            PatientId: 1,
            IsWalkIn: false,
            PatientName: null,
            WalkInPatientDetails: null,
            Diagnosis: "Bacterial Infection",
            FulfillmentSource: "InHouse",
            Recipients: "Both",
            Instructions: "Take after meals",
            Items: new List<CreatePrescriptionItemDto>
            {
                new(1, "Amoxicillin 500mg", "500mg", "TDS", "5 days", 15, "Complete the course")
            }
        );

        // Act
        var result = await controller.CreatePrescription(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var saved = await _db.Prescriptions.Include(p => p.Items).FirstOrDefaultAsync();
        Assert.NotNull(saved);
        Assert.Equal("Bacterial Infection", saved.Diagnosis);
        Assert.Equal(PrescriptionStatus.Active, saved.Status);
        Assert.Single(saved.Items);
        Assert.Equal(15, saved.Items.First().Quantity);

        // Verify patient notification was created
        var notification = await _db.Notifications.FirstOrDefaultAsync(n => n.UserId == 2);
        Assert.NotNull(notification);
        Assert.Contains("Dr. Jane Doe has issued a prescription", notification.Message);
    }

    [Fact]
    public async Task CreatePrescription_WalkInPatient_SucceedsWithWalkInDetails()
    {
        // Arrange
        var controller = new PrescriptionsController(_db)
        {
            ControllerContext = CreateContext(1, "Doctor")
        };

        var request = new CreatePrescriptionRequestDto(
            AppointmentId: null,
            PatientId: null,
            IsWalkIn: true,
            PatientName: "John Walk-in",
            WalkInPatientDetails: new WalkInPatientDetailsDto("John Walk-in", "45", "Male", "0771122334"),
            Diagnosis: "Mild Fever",
            FulfillmentSource: "External",
            Recipients: "PatientOnly",
            Instructions: "Rest and fluids",
            Items: new List<CreatePrescriptionItemDto>
            {
                new(2, "Paracetamol 500mg", "500mg", "PRN", "3 days", 10, null)
            }
        );

        // Act
        var result = await controller.CreatePrescription(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var saved = await _db.Prescriptions.FirstOrDefaultAsync(p => p.IsWalkIn);
        Assert.NotNull(saved);
        Assert.Equal("John Walk-in", saved.WalkInPatientName);
        Assert.Equal("45", saved.WalkInPatientAge);
        Assert.Equal(FulfillmentSource.External, saved.FulfillmentSource);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-3)]
    public async Task CreatePrescription_NonPositiveQuantity_ReturnsBadRequest(int invalidQty)
    {
        // Arrange
        var controller = new PrescriptionsController(_db)
        {
            ControllerContext = CreateContext(1, "Doctor")
        };

        var request = new CreatePrescriptionRequestDto(
            AppointmentId: null,
            PatientId: 1,
            IsWalkIn: false,
            PatientName: null,
            WalkInPatientDetails: null,
            Diagnosis: "Fever",
            FulfillmentSource: "InHouse",
            Recipients: "Both",
            Instructions: null,
            Items: new List<CreatePrescriptionItemDto>
            {
                new(2, "Paracetamol 500mg", "500mg", "TDS", "3 days", invalidQty, null)
            }
        );

        // Act
        var result = await controller.CreatePrescription(request);

        // Assert
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.NotNull(badRequest.Value);
    }

    [Fact]
    public async Task CreatePrescription_EmptyItems_ReturnsBadRequest()
    {
        // Arrange
        var controller = new PrescriptionsController(_db)
        {
            ControllerContext = CreateContext(1, "Doctor")
        };

        var request = new CreatePrescriptionRequestDto(
            AppointmentId: null,
            PatientId: 1,
            IsWalkIn: false,
            PatientName: null,
            WalkInPatientDetails: null,
            Diagnosis: "Fever",
            FulfillmentSource: "InHouse",
            Recipients: "Both",
            Instructions: null,
            Items: new List<CreatePrescriptionItemDto>()
        );

        // Act
        var result = await controller.CreatePrescription(request);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task GetMyPrescriptions_ReturnsOnlyPrescriptionsForCallingPatient()
    {
        // Arrange: Add 1 prescription for Alice (PatientId=1) and 1 for Charlie (PatientId=2)
        _db.Prescriptions.AddRange(
            new Prescription
            {
                Id = 10,
                PatientId = 1,
                DoctorId = 1,
                Diagnosis = "Patient 1 Diagnosis",
                Status = PrescriptionStatus.Active
            },
            new Prescription
            {
                Id = 20,
                PatientId = 2,
                DoctorId = 1,
                Diagnosis = "Patient 2 Diagnosis",
                Status = PrescriptionStatus.Active
            }
        );
        await _db.SaveChangesAsync();

        var controller = new PrescriptionsController(_db)
        {
            ControllerContext = CreateContext(2, "Patient") // Alice Brown (UserId = 2, PatientId = 1)
        };

        // Act
        var result = await controller.GetMyPrescriptions();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var list = Assert.IsAssignableFrom<IEnumerable<PrescriptionDto>>(okResult.Value);
        var dtos = list.ToList();
        Assert.Single(dtos);
        Assert.Equal(10, dtos[0].Id);
        Assert.Equal("Patient 1 Diagnosis", dtos[0].Diagnosis);
    }

    [Fact]
    public async Task GetPrescriptionById_PatientAccessingOtherPatientRecord_ReturnsForbid()
    {
        // Arrange
        _db.Prescriptions.Add(new Prescription
        {
            Id = 50,
            PatientId = 2, // Belongs to Charlie
            DoctorId = 1,
            Diagnosis = "Charlie's Record"
        });
        await _db.SaveChangesAsync();

        var controller = new PrescriptionsController(_db)
        {
            ControllerContext = CreateContext(2, "Patient") // Alice (PatientId = 1)
        };

        // Act
        var result = await controller.GetPrescriptionById(50);

        // Assert
        Assert.IsType<ForbidResult>(result);
    }

    // ─── PharmacistController Tests ────────────────────────────────────────

    [Fact]
    public async Task GetIncomingPrescriptions_ReturnsOnlyActiveUnorderedPrescriptions()
    {
        // Arrange
        var p1 = new Prescription { Id = 101, PatientId = 1, DoctorId = 1, Status = PrescriptionStatus.Active };
        var p2 = new Prescription { Id = 102, PatientId = 1, DoctorId = 1, Status = PrescriptionStatus.Active };
        var p3 = new Prescription { Id = 103, PatientId = 1, DoctorId = 1, Status = PrescriptionStatus.Fulfilled };
        _db.Prescriptions.AddRange(p1, p2, p3);

        // Order already created for p2
        _db.Orders.Add(new MedicineOrder
        {
            Id = 1,
            PrescriptionId = 102,
            PharmacyId = 1,
            Status = OrderStatus.Pending
        });
        await _db.SaveChangesAsync();

        var controller = new PharmacistController(_db)
        {
            ControllerContext = CreateContext(3, "Pharmacist")
        };

        // Act
        var result = await controller.GetIncomingPrescriptions();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var list = Assert.IsAssignableFrom<IEnumerable<PrescriptionDto>>(okResult.Value).ToList();
        Assert.Single(list);
        Assert.Equal(101, list[0].Id);
    }

    // ─── OrdersController Tests ────────────────────────────────────────────

    [Fact]
    public async Task CreateOrder_FromPrescription_AutoCopiesItemsAndCalculatesPricing()
    {
        // Arrange
        var rx = new Prescription
        {
            Id = 201,
            PatientId = 1,
            DoctorId = 1,
            Status = PrescriptionStatus.Active,
            Items = new List<PrescriptionItem>
            {
                new() { MedicineId = 1, MedicineName = "Amoxicillin 500mg", Quantity = 10 } // UnitPrice is 25.00
            }
        };
        _db.Prescriptions.Add(rx);
        await _db.SaveChangesAsync();

        var controller = new OrdersController(_db)
        {
            ControllerContext = CreateContext(3, "Pharmacist")
        };

        var request = new CreateOrderRequestDto(
            PrescriptionId: 201,
            PatientId: null,
            PharmacyId: 1,
            DeliveryAddress: null,
            Notes: "Priority",
            Items: null // Trigger auto-copy
        );

        // Act
        var result = await controller.CreateOrder(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var orderDto = Assert.IsType<OrderDto>(okResult.Value);

        Assert.Equal(250.00m, orderDto.TotalAmount); // 10 * 25.00
        Assert.Single(orderDto.Items);
        Assert.Equal(25.00m, orderDto.Items[0].UnitPrice);
        Assert.Equal(250.00m, orderDto.Items[0].Subtotal);

        // Verify source prescription is now Fulfilled
        var updatedRx = await _db.Prescriptions.FindAsync(201);
        Assert.Equal(PrescriptionStatus.Fulfilled, updatedRx!.Status);
    }

    [Fact]
    public async Task CreateOrder_NonExistentPharmacy_ReturnsBadRequest()
    {
        // Arrange
        var controller = new OrdersController(_db)
        {
            ControllerContext = CreateContext(3, "Pharmacist")
        };

        var request = new CreateOrderRequestDto(
            PrescriptionId: null,
            PatientId: 1,
            PharmacyId: 9999, // Does not exist
            DeliveryAddress: null,
            Notes: null,
            Items: new List<CreateOrderItemDto>
            {
                new(1, "Amoxicillin 500mg", "500mg", 5, 20.00m)
            }
        );

        // Act
        var result = await controller.CreateOrder(request);

        // Assert
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.NotNull(badRequest.Value);
    }

    [Fact]
    public async Task CreateOrder_NonPositiveQuantity_ReturnsBadRequest()
    {
        // Arrange
        var controller = new OrdersController(_db)
        {
            ControllerContext = CreateContext(3, "Pharmacist")
        };

        var request = new CreateOrderRequestDto(
            PrescriptionId: null,
            PatientId: 1,
            PharmacyId: 1,
            DeliveryAddress: null,
            Notes: null,
            Items: new List<CreateOrderItemDto>
            {
                new(1, "Amoxicillin 500mg", "500mg", 0, 20.00m)
            }
        );

        // Act
        var result = await controller.CreateOrder(request);

        // Assert
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.NotNull(badRequest.Value);
    }

    [Fact]
    public async Task UpdateOrderStatus_FullLifecycle_ProgressionWorksAndSetsDispensedAt()
    {
        // Arrange
        var order = new MedicineOrder
        {
            Id = 301,
            PharmacyId = 1,
            PatientId = 1,
            Status = OrderStatus.Pending,
            TotalAmount = 100m
        };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        var controller = new OrdersController(_db)
        {
            ControllerContext = CreateContext(3, "Pharmacist")
        };

        // Pending -> Confirmed
        var r1 = await controller.UpdateOrderStatus(301, new UpdateOrderStatusDto("Confirmed"));
        Assert.IsType<OkObjectResult>(r1);
        Assert.Equal(OrderStatus.Confirmed, (await _db.Orders.FindAsync(301))!.Status);

        // Confirmed -> Preparing
        var r2 = await controller.UpdateOrderStatus(301, new UpdateOrderStatusDto("Preparing"));
        Assert.IsType<OkObjectResult>(r2);
        Assert.Equal(OrderStatus.Preparing, (await _db.Orders.FindAsync(301))!.Status);

        // Preparing -> Ready
        var r3 = await controller.UpdateOrderStatus(301, new UpdateOrderStatusDto("Ready"));
        Assert.IsType<OkObjectResult>(r3);
        Assert.Equal(OrderStatus.Ready, (await _db.Orders.FindAsync(301))!.Status);

        // Ready -> Dispensed
        var r4 = await controller.UpdateOrderStatus(301, new UpdateOrderStatusDto("Dispensed"));
        Assert.IsType<OkObjectResult>(r4);
        var dispensedOrder = await _db.Orders.FindAsync(301);
        Assert.Equal(OrderStatus.Dispensed, dispensedOrder!.Status);
        Assert.NotNull(dispensedOrder.DispensedAt);

        // Dispensed -> any transition should fail (terminal state)
        var r5 = await controller.UpdateOrderStatus(301, new UpdateOrderStatusDto("Ready"));
        Assert.IsType<BadRequestObjectResult>(r5);
    }

    [Fact]
    public async Task UpdateOrderStatus_IllegalTransition_ReturnsBadRequest()
    {
        // Arrange: Pending order attempting to jump to Ready directly
        var order = new MedicineOrder
        {
            Id = 302,
            PharmacyId = 1,
            PatientId = 1,
            Status = OrderStatus.Pending
        };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        var controller = new OrdersController(_db)
        {
            ControllerContext = CreateContext(3, "Pharmacist")
        };

        // Act
        var result = await controller.UpdateOrderStatus(302, new UpdateOrderStatusDto("Ready"));

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task MarkAsPaid_PatientOwnOrder_MarksPaidSuccessfully()
    {
        // Arrange
        var order = new MedicineOrder
        {
            Id = 401,
            PharmacyId = 1,
            PatientId = 1, // Belongs to Alice
            Status = OrderStatus.Confirmed,
            IsPaid = false
        };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        var controller = new OrdersController(_db)
        {
            ControllerContext = CreateContext(2, "Patient") // Alice (UserId = 2, PatientId = 1)
        };

        // Act
        var result = await controller.MarkAsPaid(401);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var updated = await _db.Orders.FindAsync(401);
        Assert.True(updated!.IsPaid);
    }

    [Fact]
    public async Task MarkAsPaid_PatientOtherPatientOrder_ReturnsForbid()
    {
        // Arrange
        var order = new MedicineOrder
        {
            Id = 402,
            PharmacyId = 1,
            PatientId = 2, // Belongs to Charlie
            Status = OrderStatus.Confirmed,
            IsPaid = false
        };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        var controller = new OrdersController(_db)
        {
            ControllerContext = CreateContext(2, "Patient") // Alice (UserId = 2, PatientId = 1)
        };

        // Act
        var result = await controller.MarkAsPaid(402);

        // Assert
        Assert.IsType<ForbidResult>(result);
        var unchanged = await _db.Orders.FindAsync(402);
        Assert.False(unchanged!.IsPaid);
    }

    [Fact]
    public async Task CalculatePrice_RecomputesSubtotalsAndTotalFromInventory()
    {
        // Arrange
        var order = new MedicineOrder
        {
            Id = 501,
            PharmacyId = 1,
            PatientId = 1,
            Status = OrderStatus.Pending,
            TotalAmount = 0m,
            Items = new List<OrderItem>
            {
                new() { MedicineId = 1, MedicineName = "Amoxicillin 500mg", Quantity = 4, UnitPrice = 0m, Subtotal = 0m },
                new() { MedicineId = 2, MedicineName = "Paracetamol 500mg", Quantity = 10, UnitPrice = 0m, Subtotal = 0m }
            }
        };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        var controller = new OrdersController(_db)
        {
            ControllerContext = CreateContext(3, "Pharmacist")
        };

        // Act (Pharmacy 1: Med 1 = 25.00, Med 2 = 5.00; total = 4*25 + 10*5 = 100 + 50 = 150)
        var result = await controller.CalculatePrice(501, new CalculateOrderPriceDto(PharmacyId: 1));

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var dto = Assert.IsType<OrderDto>(okResult.Value);
        Assert.Equal(150.00m, dto.TotalAmount);
    }
}
