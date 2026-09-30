using System.Globalization;
using System.Security.Claims;
using System.Text.Json;
using MediFlow.Api.Controllers;
using MediFlow.Api.Data;
using MediFlow.Api.Models;
using MediFlow.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace MediFlow.Tests;

public class PaymentSandboxAndRefundWorkflowTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly PayHereService _payhere;
    private readonly PaymentController _controller;
    private readonly Mock<ILogger<PaymentController>> _mockLogger;
    private readonly Mock<ILogger<PayHereService>> _mockPayHereLogger;
    private readonly Mock<IHttpClientFactory> _mockHttpClientFactory;

    public PaymentSandboxAndRefundWorkflowTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;
        _db = new AppDbContext(options);

        var configValues = new Dictionary<string, string?>
        {
            { "PayHere:MerchantId", "1227208" },
            { "PayHere:MerchantSecret", "MzYwNDcyMzIyMzIwOTg5MTMxNDIzNTU5MTY1MzExMzQ4NTk0" }
        };
        var config = new ConfigurationBuilder().AddInMemoryCollection(configValues).Build();

        _mockLogger = new Mock<ILogger<PaymentController>>();
        _mockPayHereLogger = new Mock<ILogger<PayHereService>>();
        _mockHttpClientFactory = new Mock<IHttpClientFactory>();
        _mockHttpClientFactory.Setup(f => f.CreateClient(It.IsAny<string>())).Returns(new HttpClient());

        _payhere = new PayHereService(config, _mockPayHereLogger.Object, _mockHttpClientFactory.Object);
        _controller = new PaymentController(_db, _payhere, _mockLogger.Object);
    }

    public void Dispose()
    {
        _db.Dispose();
        GC.SuppressFinalize(this);
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

    private static JsonElement ParseResult(IActionResult result)
    {
        var ok = Assert.IsType<OkObjectResult>(result);
        var json = JsonSerializer.Serialize(ok.Value);
        return JsonDocument.Parse(json).RootElement.Clone();
    }

    private async Task<(User patientUser, Patient patient, Doctor doctor, Appointment appt)> SeedAppointmentAsync(
        AppointmentStatus status = AppointmentStatus.Pending,
        decimal fee = 2500m)
    {
        var docUser = new User
        {
            FullName = "Dr. Test Specialist",
            Email = $"doctor_{Guid.NewGuid()}@mediflow.test",
            PasswordHash = "hash",
            Role = UserRole.Doctor
        };
        _db.Users.Add(docUser);
        await _db.SaveChangesAsync();

        var doctor = new Doctor
        {
            UserId = docUser.Id,
            FullName = "Dr. Test Specialist",
            ConsultationFee = fee
        };
        _db.Doctors.Add(doctor);
        await _db.SaveChangesAsync();

        var patUser = new User
        {
            FullName = "Test Patient",
            Email = $"patient_{Guid.NewGuid()}@mediflow.test",
            PasswordHash = "hash",
            Role = UserRole.Patient
        };
        _db.Users.Add(patUser);
        await _db.SaveChangesAsync();

        var patient = new Patient
        {
            UserId = patUser.Id,
            FullName = "Test Patient",
            DateOfBirth = new DateOnly(1990, 1, 1),
            Gender = "Male",
            PhoneNumber = "0771234567"
        };
        _db.Patients.Add(patient);
        await _db.SaveChangesAsync();

        var appt = new Appointment
        {
            DoctorId = doctor.Id,
            PatientId = patient.Id,
            AppointmentDateTime = DateTime.UtcNow.AddDays(2),
            Status = status,
            Fee = fee,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Appointments.Add(appt);
        await _db.SaveChangesAsync();

        return (patUser, patient, doctor, appt);
    }

    [Fact]
    public void PayHereService_GenerateCheckoutHash_ProducesValidHexHash()
    {
        var orderId = "MF-101-20260930";
        var amount = 2500.00m;
        var hash = _payhere.GenerateCheckoutHash(orderId, amount);

        Assert.NotNull(hash);
        Assert.Equal(32, hash.Length);
        Assert.Equal(hash.ToUpperInvariant(), hash); // Must be uppercase MD5
    }

    [Fact]
    public void PayHereService_ValidateNotifyHash_DetectsTamperedSignature()
    {
        var merchantId = "1227208";
        var orderId = "MF-101-20260930";
        var payhereAmount = "2500.00";
        var payhereCurrency = "LKR";
        var statusCode = "2"; // 2 = success in PayHere

        // Tampered signature should fail verification
        var isTamperedValid = _payhere.ValidateNotifyHash(merchantId, orderId, payhereAmount, payhereCurrency, statusCode, "INVALID_SIG_123");
        Assert.False(isTamperedValid);
    }

    [Fact]
    public async Task InitiatePayment_PendingAppointment_ReturnsCheckoutParams()
    {
        var (patUser, patient, _, appt) = await SeedAppointmentAsync(AppointmentStatus.Pending);
        SetUserContext(patUser.Id, "Patient");

        var result = await _controller.InitiatePayment(appt.Id, CancellationToken.None);
        var root = ParseResult(result);

        Assert.Equal(appt.Id, root.GetProperty("appointmentId").GetInt32());
        Assert.Equal("2500.00", root.GetProperty("amount").GetString());
        Assert.Equal("LKR", root.GetProperty("currency").GetString());
        Assert.False(string.IsNullOrEmpty(root.GetProperty("hash").GetString()));
        Assert.False(string.IsNullOrEmpty(root.GetProperty("orderId").GetString()));

        // Verify DB record created
        var updatedAppt = await _db.Appointments.Include(a => a.Payment).FirstAsync(a => a.Id == appt.Id);
        Assert.Equal(AppointmentStatus.PaymentPending, updatedAppt.Status);
        Assert.NotNull(updatedAppt.Payment);
        Assert.Equal(PaymentStatus.Pending, updatedAppt.Payment.Status);
    }

    [Fact]
    public async Task InitiatePayment_AlreadyPaidAppointment_ReturnsBadRequest()
    {
        var (patUser, _, _, appt) = await SeedAppointmentAsync(AppointmentStatus.PaymentVerified);
        appt.Payment = new AppointmentPayment
        {
            AppointmentId = appt.Id,
            PatientId = appt.PatientId,
            Amount = 2500m,
            Currency = "LKR",
            Status = PaymentStatus.Paid,
            ProviderOrderId = "MF-PAID-001"
        };
        await _db.SaveChangesAsync();

        SetUserContext(patUser.Id, "Patient");
        var result = await _controller.InitiatePayment(appt.Id, CancellationToken.None);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("not eligible for payment", badRequest.Value!.ToString(), StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task PatientCancel_BeforeReceptionistApproval_SucceedsAndAllowsRefund()
    {
        var (patUser, _, _, appt) = await SeedAppointmentAsync(AppointmentStatus.PaymentVerified);
        appt.Payment = new AppointmentPayment
        {
            AppointmentId = appt.Id,
            PatientId = appt.PatientId,
            Amount = 2500m,
            Currency = "LKR",
            Status = PaymentStatus.Paid,
            ProviderOrderId = "MF-TEST-002",
            ProviderPaymentId = "PAY-002"
        };
        await _db.SaveChangesAsync();

        SetUserContext(patUser.Id, "Patient");
        var cancelReq = new PatientCancelRequest("Schedule change");
        var result = await _controller.PatientCancelAppointment(appt.Id, cancelReq, CancellationToken.None);

        var root = ParseResult(result);
        Assert.True(root.GetProperty("hasPaidPayment").GetBoolean());

        var updated = await _db.Appointments.FindAsync(appt.Id);
        Assert.Equal(AppointmentStatus.PatientCancelled, updated!.Status);
    }

    [Fact]
    public async Task Rule4And10_PatientCancelOrRefund_AfterReceptionistApproved_RejectedByBackend()
    {
        // Rule 4 & 10: Once receptionist approves appointment, patient CANNOT apply for refund or cancel
        var (patUser, _, _, appt) = await SeedAppointmentAsync(AppointmentStatus.Confirmed);
        appt.Payment = new AppointmentPayment
        {
            AppointmentId = appt.Id,
            PatientId = appt.PatientId,
            Amount = 2500m,
            Currency = "LKR",
            Status = PaymentStatus.Paid,
            ProviderOrderId = "MF-CONF-003",
            ProviderPaymentId = "PAY-003"
        };
        await _db.SaveChangesAsync();

        SetUserContext(patUser.Id, "Patient");

        // Attempt cancel
        var cancelResult = await _controller.PatientCancelAppointment(appt.Id, new PatientCancelRequest("Cannot attend"), CancellationToken.None);
        var badCancel = Assert.IsType<BadRequestObjectResult>(cancelResult);
        Assert.Contains("already been approved by the receptionist", badCancel.Value!.ToString(), StringComparison.OrdinalIgnoreCase);

        // Attempt refund request directly
        var refundResult = await _controller.RequestRefund(appt.Id, new RefundRequestDto("Want refund"), CancellationToken.None);
        var badRefund = Assert.IsType<BadRequestObjectResult>(refundResult);
        Assert.Contains("already been approved by the receptionist", badRefund.Value!.ToString(), StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task ReceptionistRejectAppointment_PaidAppointment_TriggersAutomaticRefund()
    {
        // Rule 2 & 7: Receptionist rejecting paid appointment automatically initiates refund
        var (_, _, _, appt) = await SeedAppointmentAsync(AppointmentStatus.PaymentVerified);
        appt.Payment = new AppointmentPayment
        {
            AppointmentId = appt.Id,
            PatientId = appt.PatientId,
            Amount = 2500m,
            Currency = "LKR",
            Status = PaymentStatus.Paid,
            ProviderOrderId = "MF-REJECT-004",
            ProviderPaymentId = "PAY-004"
        };
        await _db.SaveChangesAsync();

        // Receptionist context
        var recepUser = new User { FullName = "Receptionist Jane", Email = "recep@mediflow.test", PasswordHash = "hash", Role = UserRole.Receptionist };
        _db.Users.Add(recepUser);
        await _db.SaveChangesAsync();
        SetUserContext(recepUser.Id, "Receptionist");

        var rejectReq = new ReceptionistRejectRequest("Doctor unavailable on that date.");
        var result = await _controller.ReceptionistRejectAppointment(appt.Id, rejectReq, CancellationToken.None);

        var root = ParseResult(result);
        Assert.True(root.GetProperty("autoRefundInitiated").GetBoolean());

        var updated = await _db.Appointments
            .Include(a => a.Payment)
                .ThenInclude(p => p!.Refund)
            .FirstAsync(a => a.Id == appt.Id);

        Assert.Equal(AppointmentStatus.ReceptionistRejected, updated.Status);
        Assert.NotNull(updated.Payment!.Refund);
        Assert.Equal(2500m, updated.Payment.Refund.Amount);
        Assert.Equal(PaymentStatus.RefundPending, updated.Payment.Status);
    }

    [Fact]
    public async Task GetRefundStatus_ContainsMandated2To3WorkingDaysNotice()
    {
        var (patUser, _, _, appt) = await SeedAppointmentAsync(AppointmentStatus.PatientCancelled);
        var payment = new AppointmentPayment
        {
            AppointmentId = appt.Id,
            PatientId = appt.PatientId,
            Amount = 2500m,
            Currency = "LKR",
            Status = PaymentStatus.Paid,
            ProviderOrderId = "MF-REFUND-005",
            ProviderPaymentId = "PAY-005"
        };
        _db.AppointmentPayments.Add(payment);
        await _db.SaveChangesAsync();

        var refund = new AppointmentRefund
        {
            AppointmentId = appt.Id,
            PaymentId = payment.Id,
            PatientId = appt.PatientId,
            Amount = 2500m,
            Currency = "LKR",
            Status = RefundStatus.RefundProcessing,
            RefundReference = "RF-10023",
            Reason = "Patient cancellation",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.AppointmentRefunds.Add(refund);
        await _db.SaveChangesAsync();

        SetUserContext(patUser.Id, "Patient");
        var result = await _controller.GetRefundStatus(appt.Id, CancellationToken.None);
        var root = ParseResult(result);

        var refundObj = root.GetProperty("refund");
        Assert.Equal("RF-10023", refundObj.GetProperty("refundReference").GetString());
        Assert.Contains("2–3 working days", refundObj.GetProperty("expectedProcessingInfo").GetString());
    }

    [Fact]
    public async Task GetPaymentStatus_UnpaidAppointment_ReturnsDoctorDetailsAndExactConsultationFee()
    {
        var (patUser, _, doctor, appt) = await SeedAppointmentAsync(AppointmentStatus.Pending, fee: 3500m);
        SetUserContext(patUser.Id, "Patient");

        var result = await _controller.GetPaymentStatus(appt.Id, CancellationToken.None);
        var root = ParseResult(result);

        Assert.Equal(appt.Id, root.GetProperty("appointmentId").GetInt32());
        Assert.Equal(3500m, root.GetProperty("amount").GetDecimal());
        Assert.Equal(3500m, root.GetProperty("doctorFee").GetDecimal());
        Assert.Equal("LKR", root.GetProperty("currency").GetString());
        Assert.Contains("Test Specialist", root.GetProperty("doctorName").GetString());
    }

    [Fact]
    public async Task ProcessGatewayPayment_PendingAppointment_SetsPaymentVerifiedAndPaidWithDoctorFee()
    {
        var (patUser, _, doctor, appt) = await SeedAppointmentAsync(AppointmentStatus.Pending, fee: 3500m);
        SetUserContext(patUser.Id, "Patient");

        var cardReq = new ProcessPaymentGatewayDto(
            CardNumber: "4111 1111 1111 1111",
            CardHolder: "Test Patient",
            Expiry: "12/28",
            Cvv: "123",
            PaymentMethod: "Credit / Debit Card"
        );

        var result = await _controller.ProcessGatewayPayment(appt.Id, cardReq, CancellationToken.None);
        var root = ParseResult(result);

        Assert.True(root.GetProperty("success").GetBoolean());
        Assert.Equal(AppointmentStatus.PaymentVerified.ToString(), root.GetProperty("appointmentStatus").GetString());

        var paymentObj = root.GetProperty("payment");
        Assert.Equal(PaymentStatus.Paid.ToString(), paymentObj.GetProperty("status").GetString());
        Assert.Equal(3500m, paymentObj.GetProperty("amount").GetDecimal());
        Assert.StartsWith("PAY-", paymentObj.GetProperty("providerPaymentId").GetString());

        // Verify in database
        var updated = await _db.Appointments.Include(a => a.Payment).FirstAsync(a => a.Id == appt.Id);
        Assert.Equal(AppointmentStatus.PaymentVerified, updated.Status);
        Assert.NotNull(updated.Payment);
        Assert.Equal(PaymentStatus.Paid, updated.Payment.Status);
        Assert.Equal(3500m, updated.Payment.Amount);
    }

    [Fact]
    public async Task ProcessGatewayPayment_AlreadyPaidAppointment_ReturnsBadRequest()
    {
        var (patUser, _, _, appt) = await SeedAppointmentAsync(AppointmentStatus.PaymentVerified, fee: 3500m);
        appt.Payment = new AppointmentPayment
        {
            AppointmentId = appt.Id,
            PatientId = appt.PatientId,
            Amount = 3500m,
            Currency = "LKR",
            Status = PaymentStatus.Paid,
            ProviderOrderId = "MF-ALREADY-PAID"
        };
        await _db.SaveChangesAsync();

        SetUserContext(patUser.Id, "Patient");
        var cardReq = new ProcessPaymentGatewayDto("4111111111111111", "Test Patient", "12/28", "123");
        var result = await _controller.ProcessGatewayPayment(appt.Id, cardReq, CancellationToken.None);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("already been paid", badRequest.Value!.ToString(), StringComparison.OrdinalIgnoreCase);
    }
}
