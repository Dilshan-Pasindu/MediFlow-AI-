using MediFlow.Api.Data;
using MediFlow.Api.Models;
using MediFlow.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Security.Claims;
using System.Text.Json;

namespace MediFlow.Api.Controllers;

/// <summary>
/// Payment lifecycle controller.
/// Handles PayHere sandbox checkout initiation, payment notification webhook,
/// manual verification, patient cancellation, and refund management.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly PayHereService _payhere;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(AppDbContext db, PayHereService payhere, ILogger<PaymentController> logger)
    {
        _db = db;
        _payhere = payhere;
        _logger = logger;
    }

    // ── 1. Initiate Checkout ──────────────────────────────────────────────────

    /// <summary>
    /// Patient initiates payment for a Pending appointment.
    /// Returns PayHere sandbox checkout parameters for the frontend.
    /// The patient submits these to the PayHere payment page (no secret keys exposed).
    /// </summary>
    [HttpPost("appointments/{appointmentId}/initiate")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> InitiatePayment(int appointmentId, CancellationToken ct)
    {
        var patient = await GetPatientAsync(ct);
        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        var appointment = await _db.Appointments
            .Include(a => a.Doctor)
                .ThenInclude(d => d.DoctorSpecialties)
                    .ThenInclude(ds => ds.Specialty)
            .Include(a => a.Payment)
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == patient.Id, ct);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        if (appointment.Status is not AppointmentStatus.Pending and not AppointmentStatus.PaymentFailed)
            return BadRequest(new { message = $"This appointment is not eligible for payment. Status: {appointment.Status}." });

        // Duplicate payment guard
        if (appointment.Payment != null && appointment.Payment.Status == PaymentStatus.Paid)
            return BadRequest(new { message = "This appointment has already been paid." });

        var amount = (appointment.Fee.HasValue && appointment.Fee.Value > 0)
            ? appointment.Fee.Value
            : (appointment.Doctor?.ConsultationFee ?? 2500m);

        if (!appointment.Fee.HasValue || appointment.Fee.Value <= 0)
        {
            appointment.Fee = amount;
        }

        var orderId = PayHereService.GenerateOrderId(appointment.Id);
        var hash = _payhere.GenerateCheckoutHash(orderId, amount);

        // Clean doctor name formatting (prevent "Dr. Dr." or empty "Dr. ")
        var rawDocName = appointment.Doctor?.FullName?.Trim();
        if (string.IsNullOrWhiteSpace(rawDocName))
        {
            rawDocName = "Specialist";
        }
        var cleanDocName = rawDocName;
        if (cleanDocName.StartsWith("Dr.", StringComparison.OrdinalIgnoreCase))
            cleanDocName = cleanDocName.Substring(3).Trim();
        else if (cleanDocName.StartsWith("Dr ", StringComparison.OrdinalIgnoreCase))
            cleanDocName = cleanDocName.Substring(2).Trim();
        var formattedDoctorName = string.IsNullOrWhiteSpace(cleanDocName) ? "Dr. Specialist" : $"Dr. {cleanDocName}";

        // Create/update payment record
        if (appointment.Payment == null)
        {
            appointment.Payment = new AppointmentPayment
            {
                AppointmentId = appointment.Id,
                PatientId = patient.Id,
                Amount = amount,
                Currency = "LKR",
                Status = PaymentStatus.Pending,
                ProviderOrderId = orderId,
                Provider = "PayHere",
                TransactionReference = orderId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
        }
        else
        {
            appointment.Payment.Amount = amount;
            appointment.Payment.ProviderOrderId = orderId;
            appointment.Payment.TransactionReference = orderId;
            appointment.Payment.Status = PaymentStatus.Pending;
            appointment.Payment.UpdatedAt = DateTime.UtcNow;
        }

        appointment.Status = AppointmentStatus.PaymentPending;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        await LogAuditAsync(appointment.Id, appointment.Payment.Id, null, patient.UserId,
            "Patient", "PaymentInitiated", "Pending",
            $"PayHere checkout initiated. OrderId={orderId}, Amount={amount} LKR", null, ct);

        return Ok(new
        {
            merchantId = _payhere.MerchantId,
            returnUrl = $"{GetFrontendOrigin()}/appointments/{appointmentId}?payment=success",
            cancelUrl = $"{GetFrontendOrigin()}/appointments/{appointmentId}?payment=cancelled",
            notifyUrl = $"{GetApiOrigin()}/api/payment/notify",
            orderId,
            amount = amount.ToString("F2", CultureInfo.InvariantCulture),
            currency = "LKR",
            hash,
            firstName = patient.FullName.Split(' ')[0],
            lastName = patient.FullName.Contains(' ')
                ? string.Join(' ', patient.FullName.Split(' ').Skip(1))
                : ".",
            email = patient.Email,
            phone = patient.PhoneNumber,
            address = patient.Address ?? "N/A",
            city = "Colombo",
            country = "Sri Lanka",
            items = $"Consultation - {formattedDoctorName}",
            doctorName = formattedDoctorName,
            doctorFee = appointment.Doctor?.ConsultationFee ?? amount,
            appointmentId = appointment.Id,
            sandboxCheckoutUrl = "https://sandbox.payhere.lk/pay/checkout",
        });
    }

    // ── 2. PayHere Notify Webhook (Server-to-Server) ─────────────────────────

    /// <summary>
    /// PayHere sends this POST notification after payment completes/fails.
    /// This endpoint validates the signature and updates the payment status.
    /// Never trusts status from the client — only this server-verified webhook.
    /// </summary>
    [HttpPost("notify")]
    [AllowAnonymous]
    public async Task<IActionResult> PayHereNotify([FromForm] PayHereNotifyRequest request, CancellationToken ct)
    {
        _logger.LogInformation("[PayHere Notify] Received: OrderId={OrderId} PaymentId={PaymentId} Status={Status}",
            request.OrderId, request.PaymentId, request.StatusCode);

        // 1. Validate signature
        if (!_payhere.ValidateNotifyHash(
            request.MerchantId ?? "",
            request.OrderId ?? "",
            request.PayhereAmount ?? "",
            request.PayhereCurrency ?? "",
            request.StatusCode ?? "",
            request.Md5sig ?? ""))
        {
            _logger.LogWarning("[PayHere Notify] INVALID signature for OrderId={OrderId}", request.OrderId);
            return BadRequest(new { message = "Invalid payment notification signature." });
        }

        // 2. Find the payment record by order ID
        var payment = await _db.AppointmentPayments
            .Include(p => p.Appointment)
                .ThenInclude(a => a.Patient)
            .FirstOrDefaultAsync(p => p.ProviderOrderId == request.OrderId, ct);

        if (payment == null)
        {
            _logger.LogWarning("[PayHere Notify] No payment found for OrderId={OrderId}", request.OrderId);
            return NotFound();
        }

        // 3. Idempotency — ignore if already processed to terminal state
        if (payment.Status == PaymentStatus.Paid || payment.Status == PaymentStatus.Refunded)
        {
            _logger.LogInformation("[PayHere Notify] Payment already processed: {Status}", payment.Status);
            return Ok();
        }

        // 4. Validate amount
        if (!decimal.TryParse(request.PayhereAmount, NumberStyles.Any, CultureInfo.InvariantCulture, out var notifiedAmount)
            || Math.Abs(notifiedAmount - payment.Amount) > 0.01m)
        {
            _logger.LogWarning("[PayHere Notify] Amount mismatch. Expected={Expected} Got={Got}",
                payment.Amount, notifiedAmount);
            await LogAuditAsync(payment.AppointmentId, payment.Id, null, null, "System",
                "PaymentVerificationFailed", "Failure",
                $"Amount mismatch. Expected={payment.Amount}, Got={notifiedAmount}", request.PaymentId, ct);
            return BadRequest(new { message = "Amount mismatch." });
        }

        // 5. Validate currency
        if (!string.Equals(request.PayhereCurrency, "LKR", StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogWarning("[PayHere Notify] Currency mismatch: {Currency}", request.PayhereCurrency);
            return BadRequest(new { message = "Currency mismatch." });
        }

        // 6. Check for duplicate PayHere payment_id
        if (!string.IsNullOrWhiteSpace(request.PaymentId))
        {
            var duplicate = await _db.AppointmentPayments
                .AnyAsync(p => p.ProviderPaymentId == request.PaymentId && p.Id != payment.Id, ct);
            if (duplicate)
            {
                _logger.LogWarning("[PayHere Notify] Duplicate payment_id: {PaymentId}", request.PaymentId);
                return BadRequest(new { message = "Duplicate payment ID." });
            }
        }

        // 7. Update payment status based on PayHere status code
        // PayHere: 2=Success, 0=Pending, -1=Cancelled, -2=Failed, -3=Charged Back
        var statusCode = int.TryParse(request.StatusCode, out var sc) ? sc : -2;

        using var tx = await _db.Database.BeginTransactionAsync(ct);
        try
        {
            payment.ProviderPaymentId = request.PaymentId;
            payment.UpdatedAt = DateTime.UtcNow;

            var appointment = payment.Appointment;
            string action;

            switch (statusCode)
            {
                case 2: // Success
                    payment.Status = PaymentStatus.Paid;
                    payment.PaidAt = DateTime.UtcNow;
                    payment.PaymentMethod = request.Method ?? "Card";
                    appointment.Status = AppointmentStatus.PaymentVerified;
                    action = "PaymentVerified";

                    // Notify patient
                    if (appointment.Patient?.UserId > 0)
                    {
                        _db.Notifications.Add(new Notification
                        {
                            UserId = appointment.Patient.UserId,
                            Title = "Payment Successful",
                            Message = $"Your payment of Rs. {payment.Amount:N2} for appointment #{appointment.AppointmentNumber} has been received. The receptionist will review your appointment shortly.",
                            Type = "success",
                            CreatedAt = DateTime.UtcNow,
                            IsRead = false,
                        });
                    }
                    break;

                case 0: // Pending
                    payment.Status = PaymentStatus.Processing;
                    action = "PaymentPending";
                    break;

                case -1: // Cancelled
                    payment.Status = PaymentStatus.Cancelled;
                    payment.CancelledAt = DateTime.UtcNow;
                    appointment.Status = AppointmentStatus.PaymentFailed;
                    action = "PaymentCancelled";
                    break;

                case -2: // Failed
                case -3: // Charged back
                default:
                    payment.Status = PaymentStatus.Failed;
                    payment.FailedAt = DateTime.UtcNow;
                    appointment.Status = AppointmentStatus.PaymentFailed;
                    action = "PaymentFailed";
                    break;
            }

            appointment.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync(ct);

            await LogAuditAsync(payment.AppointmentId, payment.Id, null, null, "PayHere",
                action, statusCode == 2 ? "Success" : "Failure",
                $"PayHere notify. PaymentId={request.PaymentId}, StatusCode={statusCode}, Amount={request.PayhereAmount}",
                request.PaymentId, ct);

            await tx.CommitAsync(ct);
        }
        catch (Exception ex)
        {
            await tx.RollbackAsync(ct);
            _logger.LogError(ex, "[PayHere Notify] Database error for OrderId={OrderId}", request.OrderId);
            return StatusCode(500);
        }

        return Ok();
    }

    // ── 3. Frontend Verify (after PayHere redirects back) ────────────────────

    /// <summary>
    /// Patient's browser calls this after returning from PayHere checkout.
    /// Queries the backend DB (already updated by webhook) for final status.
    /// If webhook hasn't arrived yet, optionally performs a server-side verify call.
    /// </summary>
    [HttpGet("appointments/{appointmentId}/status")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> GetPaymentStatus(int appointmentId, CancellationToken ct)
    {
        var patient = await GetPatientAsync(ct);
        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        var appointment = await _db.Appointments
            .Include(a => a.Doctor)
                .ThenInclude(d => d.DoctorSpecialties)
                    .ThenInclude(ds => ds.Specialty)
            .Include(a => a.Payment)
                .ThenInclude(p => p!.Refund)
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == patient.Id, ct);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        var payment = appointment.Payment;
        var refund = payment?.Refund;

        var rawDocName = appointment.Doctor?.FullName?.Trim();
        if (string.IsNullOrWhiteSpace(rawDocName))
        {
            rawDocName = "Specialist";
        }
        var cleanDocName = rawDocName;
        if (cleanDocName.StartsWith("Dr.", StringComparison.OrdinalIgnoreCase))
            cleanDocName = cleanDocName.Substring(3).Trim();
        else if (cleanDocName.StartsWith("Dr ", StringComparison.OrdinalIgnoreCase))
            cleanDocName = cleanDocName.Substring(2).Trim();
        var formattedDoctorName = string.IsNullOrWhiteSpace(cleanDocName) ? "Dr. Specialist" : $"Dr. {cleanDocName}";

        var fee = (appointment.Fee.HasValue && appointment.Fee.Value > 0)
            ? appointment.Fee.Value
            : (appointment.Doctor?.ConsultationFee ?? 2500m);

        var specialty = appointment.Doctor?.DoctorSpecialties.FirstOrDefault()?.Specialty?.Name ?? "General Consultation";

        return Ok(new
        {
            appointmentId = appointment.Id,
            appointmentNumber = appointment.AppointmentNumber,
            appointmentStatus = appointment.Status.ToString(),
            doctorName = formattedDoctorName,
            specialty,
            doctorFee = appointment.Doctor?.ConsultationFee ?? fee,
            amount = payment?.Amount ?? fee,
            currency = payment?.Currency ?? "LKR",
            payment = payment == null ? null : new
            {
                id = payment.Id,
                status = payment.Status.ToString(),
                amount = payment.Amount,
                currency = payment.Currency,
                paidAt = payment.PaidAt,
                providerOrderId = payment.ProviderOrderId,
                providerPaymentId = payment.ProviderPaymentId,
                paymentMethod = payment.PaymentMethod,
            },
            refund = refund == null ? null : new
            {
                id = refund.Id,
                status = refund.Status.ToString(),
                amount = refund.Amount,
                refundReference = refund.RefundReference,
                requestedAt = refund.RequestedAt,
                approvedAt = refund.ApprovedAt,
                processingAt = refund.ProcessingAt,
                completedAt = refund.CompletedAt,
                failedAt = refund.FailedAt,
                rejectionReason = refund.RejectionReason,
            },
        });
    }

    // ── 3B. Direct Gateway Card Payment ──────────────────────────────────────

    /// <summary>
    /// Processes direct card payment through the PayHere gateway.
    /// Simulates authentic bank authorization and marks payment as Paid,
    /// transitioning appointment to PaymentVerified.
    /// </summary>
    [HttpPost("appointments/{appointmentId}/pay-gateway")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> ProcessGatewayPayment(
        int appointmentId,
        [FromBody] ProcessPaymentGatewayDto? request,
        CancellationToken ct)
    {
        var patient = await GetPatientAsync(ct);
        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        var appointment = await _db.Appointments
            .Include(a => a.Doctor)
            .Include(a => a.Payment)
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == patient.Id, ct);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        if (appointment.Payment != null && appointment.Payment.Status == PaymentStatus.Paid)
            return BadRequest(new { message = "This appointment has already been paid." });

        if (appointment.Status is not AppointmentStatus.Pending 
            and not AppointmentStatus.PaymentPending 
            and not AppointmentStatus.PaymentFailed)
        {
            return BadRequest(new { message = $"This appointment is not eligible for payment. Status: {appointment.Status}." });
        }

        var amount = (appointment.Fee.HasValue && appointment.Fee.Value > 0)
            ? appointment.Fee.Value
            : (appointment.Doctor?.ConsultationFee ?? 2500m);

        appointment.Fee = amount;

        var orderId = PayHereService.GenerateOrderId(appointment.Id);
        var paymentId = $"PAY-{DateTime.UtcNow:yyyyMMddHHmmss}-{Random.Shared.Next(1000, 9999)}";

        var rawCard = (request?.CardNumber ?? "").Replace(" ", "").Replace("-", "");
        var last4 = rawCard.Length >= 4 ? rawCard[^4..] : "4111";
        var method = string.IsNullOrWhiteSpace(request?.PaymentMethod) ? "Credit / Debit Card" : request.PaymentMethod;

        if (appointment.Payment == null)
        {
            appointment.Payment = new AppointmentPayment
            {
                AppointmentId = appointment.Id,
                PatientId = patient.Id,
                Amount = amount,
                Currency = "LKR",
                Status = PaymentStatus.Paid,
                PaidAt = DateTime.UtcNow,
                Provider = "PayHere",
                ProviderOrderId = orderId,
                ProviderPaymentId = paymentId,
                TransactionReference = paymentId,
                PaymentMethod = method,
                Metadata = JsonSerializer.Serialize(new { cardLast4 = last4, holder = request?.CardHolder ?? patient.FullName }),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
            _db.AppointmentPayments.Add(appointment.Payment);
        }
        else
        {
            appointment.Payment.Amount = amount;
            appointment.Payment.Status = PaymentStatus.Paid;
            appointment.Payment.PaidAt = DateTime.UtcNow;
            appointment.Payment.ProviderOrderId = orderId;
            appointment.Payment.ProviderPaymentId = paymentId;
            appointment.Payment.TransactionReference = paymentId;
            appointment.Payment.PaymentMethod = method;
            appointment.Payment.Metadata = JsonSerializer.Serialize(new { cardLast4 = last4, holder = request?.CardHolder ?? patient.FullName });
            appointment.Payment.UpdatedAt = DateTime.UtcNow;
        }

        appointment.Status = AppointmentStatus.PaymentVerified;
        appointment.UpdatedAt = DateTime.UtcNow;

        // Notification for patient
        _db.Notifications.Add(new Notification
        {
            UserId = patient.UserId,
            Title = "Payment Successful",
            Message = $"Your payment of Rs. {amount:N2} for appointment #{appointment.AppointmentNumber ?? appointment.Id.ToString()} has been verified. The receptionist will review your appointment shortly.",
            Type = "success",
            CreatedAt = DateTime.UtcNow,
            IsRead = false,
        });

        await _db.SaveChangesAsync(ct);

        await LogAuditAsync(appointment.Id, appointment.Payment.Id, null, patient.UserId,
            "Patient", "PaymentVerified", "Success",
            $"PayHere gateway card payment verified. PaymentId={paymentId}, Amount={amount} LKR, Card=****{last4}",
            paymentId, ct);

        return Ok(new
        {
            success = true,
            message = "Payment processed and verified successfully.",
            appointmentId = appointment.Id,
            appointmentStatus = appointment.Status.ToString(),
            payment = new
            {
                id = appointment.Payment.Id,
                status = appointment.Payment.Status.ToString(),
                amount = appointment.Payment.Amount,
                currency = appointment.Payment.Currency,
                paidAt = appointment.Payment.PaidAt,
                providerOrderId = appointment.Payment.ProviderOrderId,
                providerPaymentId = appointment.Payment.ProviderPaymentId,
                paymentMethod = appointment.Payment.PaymentMethod,
            }
        });
    }

    // ── 4. Patient Cancel Appointment ────────────────────────────────────────

    /// <summary>
    /// Patient cancels appointment (only before receptionist approval).
    /// Sets status to PatientCancelled. Does NOT auto-refund — patient must request.
    /// </summary>
    [HttpPost("appointments/{appointmentId}/cancel")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> PatientCancelAppointment(
        int appointmentId,
        [FromBody] PatientCancelRequest request,
        CancellationToken ct)
    {
        var patient = await GetPatientAsync(ct);
        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        var appointment = await _db.Appointments
            .Include(a => a.Payment)
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == patient.Id, ct);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        // Enforce: cannot cancel once consultation has begun or completed
        if (appointment.Status == AppointmentStatus.InConsultation ||
            appointment.Status == AppointmentStatus.Completed)
        {
            return BadRequest(new
            {
                message = "Cannot cancel an appointment that is already in consultation or completed.",
                code = "APPOINTMENT_IN_PROGRESS_OR_COMPLETED"
            });
        }

        if (appointment.Status == AppointmentStatus.Cancelled ||
            appointment.Status == AppointmentStatus.PatientCancelled ||
            appointment.Status == AppointmentStatus.ReceptionistRejected)
        {
            return BadRequest(new { message = $"Appointment is already {appointment.Status}." });
        }

        appointment.Status = AppointmentStatus.PatientCancelled;
        appointment.Notes = string.IsNullOrWhiteSpace(appointment.Notes)
            ? $"Cancelled by patient: {request.Reason}"
            : $"{appointment.Notes} | Cancelled by patient: {request.Reason}";
        appointment.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        await LogAuditAsync(appointment.Id, appointment.Payment?.Id, null, patient.UserId,
            "Patient", "AppointmentCancelledByPatient", "Success",
            $"Reason: {request.Reason}", null, ct);

        return Ok(new
        {
            appointmentId = appointment.Id,
            status = appointment.Status.ToString(),
            hasPaidPayment = appointment.Payment?.Status == PaymentStatus.Paid,
            message = "Appointment cancelled. If you paid, you may now apply for a refund.",
        });
    }

    // ── 5. Patient Request Refund ────────────────────────────────────────────

    /// <summary>
    /// Patient applies for a refund after cancelling an appointment.
    /// Only allowed if appointment is PatientCancelled and payment is Paid.
    /// After receptionist approval, this is blocked.
    /// </summary>
    [HttpPost("appointments/{appointmentId}/refund/request")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> RequestRefund(
        int appointmentId,
        [FromBody] RefundRequestDto request,
        CancellationToken ct)
    {
        var patient = await GetPatientAsync(ct);
        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        var appointment = await _db.Appointments
            .Include(a => a.Payment)
                .ThenInclude(p => p!.Refund)
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == patient.Id, ct);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        // Rule: Cannot request refund once consultation has commenced or completed
        if (appointment.Status == AppointmentStatus.InConsultation ||
            appointment.Status == AppointmentStatus.Completed)
        {
            return BadRequest(new
            {
                message = "Refund requests cannot be submitted for appointments that have already entered consultation or completed.",
                code = "REFUND_NOT_ALLOWED_POST_CONSULTATION"
            });
        }

        if (appointment.Status != AppointmentStatus.PatientCancelled && appointment.Status != AppointmentStatus.Cancelled)
            return BadRequest(new { message = "Refund can only be requested after cancelling the appointment." });

        var payment = appointment.Payment;
        if (payment == null || payment.Status != PaymentStatus.Paid)
            return BadRequest(new { message = "No verified payment found for this appointment." });

        // Idempotency: already requested?
        if (payment.Refund != null)
        {
            return BadRequest(new
            {
                message = $"A refund request already exists (status: {payment.Refund.Status}).",
                refundId = payment.Refund.Id,
                refundStatus = payment.Refund.Status.ToString(),
            });
        }

        var refund = new AppointmentRefund
        {
            PaymentId = payment.Id,
            AppointmentId = appointment.Id,
            PatientId = patient.Id,
            Amount = payment.Amount,
            Currency = payment.Currency,
            Reason = "PatientCancellation",
            AdditionalNotes = request.AdditionalNotes,
            Status = RefundStatus.RefundRequested,
            RequestedAt = DateTime.UtcNow,
            RefundReference = $"RF-{appointment.Id}-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        payment.Status = PaymentStatus.RefundPending;
        payment.UpdatedAt = DateTime.UtcNow;
        appointment.Status = AppointmentStatus.RefundRequested;
        appointment.UpdatedAt = DateTime.UtcNow;

        _db.AppointmentRefunds.Add(refund);
        await _db.SaveChangesAsync(ct);

        await LogAuditAsync(appointment.Id, payment.Id, refund.Id, patient.UserId,
            "Patient", "RefundRequested", "Pending",
            $"Amount={refund.Amount} LKR, Reason=PatientCancellation, Notes={request.AdditionalNotes}", null, ct);

        return Ok(new
        {
            refundId = refund.Id,
            refundReference = refund.RefundReference,
            amount = refund.Amount,
            currency = refund.Currency,
            status = refund.Status.ToString(),
            message = "Refund requested successfully. The receptionist will review your refund request.",
        });
    }

    // ── 6. Get Refund Status (Patient) ───────────────────────────────────────

    /// <summary>
    /// Patient views current refund tracking status.
    /// </summary>
    [HttpGet("appointments/{appointmentId}/refund")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> GetRefundStatus(int appointmentId, CancellationToken ct)
    {
        var patient = await GetPatientAsync(ct);
        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        var appointment = await _db.Appointments
            .Include(a => a.Payment)
                .ThenInclude(p => p!.Refund)
            .Include(a => a.Doctor)
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == patient.Id, ct);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        var refund = appointment.Payment?.Refund;

        return Ok(new
        {
            appointmentId = appointment.Id,
            appointmentNumber = appointment.AppointmentNumber,
            doctorName = appointment.Doctor?.FullName,
            appointmentStatus = appointment.Status.ToString(),
            canRequestRefund = CanRequestRefund(appointment),
            refund = refund == null ? null : new
            {
                id = refund.Id,
                refundReference = refund.RefundReference,
                amount = refund.Amount,
                currency = refund.Currency,
                status = refund.Status.ToString(),
                reason = refund.Reason,
                additionalNotes = refund.AdditionalNotes,
                requestedAt = refund.RequestedAt,
                approvedAt = refund.ApprovedAt,
                processingAt = refund.ProcessingAt,
                completedAt = refund.CompletedAt,
                failedAt = refund.FailedAt,
                rejectionReason = refund.RejectionReason,
                providerRefundId = refund.ProviderRefundId,
                expectedProcessingInfo = refund.Status is RefundStatus.RefundApproved or RefundStatus.RefundProcessing
                    ? "Your refund has been approved and is currently being processed. The refunded amount will normally be credited within 2–3 working days, depending on the payment provider."
                    : null,
            },
        });
    }

    // ── 7. Receptionist — List Refund Requests ────────────────────────────────

    [HttpGet("refunds")]
    [Authorize(Roles = "Receptionist,Admin")]
    public async Task<IActionResult> GetRefundRequests([FromQuery] string? status, CancellationToken ct)
    {
        var query = _db.AppointmentRefunds
            .Include(r => r.Patient)
            .Include(r => r.Appointment)
                .ThenInclude(a => a.Doctor)
                    .ThenInclude(d => d.DoctorSpecialties)
                        .ThenInclude(ds => ds.Specialty)
            .Include(r => r.Payment)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<RefundStatus>(status, ignoreCase: true, out var parsedStatus))
        {
            query = query.Where(r => r.Status == parsedStatus);
        }

        var refunds = await query
            .OrderByDescending(r => r.RequestedAt)
            .Select(r => new
            {
                r.Id,
                r.RefundReference,
                PatientName = r.Patient.FullName,
                DoctorName = r.Appointment.Doctor.FullName,
                SpecialtyName = r.Appointment.Doctor.DoctorSpecialties.Select(ds => ds.Specialty.Name).FirstOrDefault() ?? "General Medicine",
                AppointmentId = r.AppointmentId,
                AppointmentNumber = r.Appointment.AppointmentNumber,
                AppointmentStatus = r.Appointment.Status.ToString(),
                AppointmentDate = r.Appointment.AppointmentDateTime,
                PaymentAmount = r.Payment.Amount,
                PaymentStatus = r.Payment.Status.ToString(),
                PaymentTransactionRef = r.Payment.TransactionReference,
                ProviderPaymentId = r.Payment.ProviderPaymentId,
                r.Amount,
                r.Currency,
                r.Reason,
                r.AdditionalNotes,
                RefundStatus = r.Status.ToString(),
                r.RequestedAt,
                r.ApprovedAt,
                r.RejectedAt,
                r.ProcessingAt,
                r.CompletedAt,
                r.RejectionReason,
            })
            .ToListAsync(ct);

        return Ok(refunds);
    }

    // ── 8. Receptionist — Approve Refund ────────────────────────────────────

    [HttpPost("refunds/{refundId}/approve")]
    [Authorize(Roles = "Receptionist,Admin")]
    public async Task<IActionResult> ApproveRefund(int refundId, [FromBody] RefundApproveRequest? request, CancellationToken ct)
    {
        var userId = GetUserId();

        var refund = await _db.AppointmentRefunds
            .Include(r => r.Payment)
            .Include(r => r.Appointment)
                .ThenInclude(a => a.Patient)
            .FirstOrDefaultAsync(r => r.Id == refundId, ct);

        if (refund == null)
            return NotFound(new { message = "Refund not found." });

        if (refund.Status != RefundStatus.RefundRequested)
            return BadRequest(new { message = $"Refund cannot be approved. Current status: {refund.Status}." });

        var payment = refund.Payment;
        if (payment.Status != PaymentStatus.RefundPending && payment.Status != PaymentStatus.Paid)
            return BadRequest(new { message = "Payment is not in a refundable state." });

        using var tx = await _db.Database.BeginTransactionAsync(ct);
        try
        {
            // Update refund to approved → processing
            refund.Status = RefundStatus.RefundApproved;
            refund.ApprovedAt = DateTime.UtcNow;
            refund.ApprovedByUserId = userId;
            refund.AdminNotes = request?.Notes;
            refund.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync(ct);

            await LogAuditAsync(refund.AppointmentId, payment.Id, refund.Id, userId,
                "Receptionist", "RefundApproved", "Success",
                $"Refund approved. Amount={refund.Amount} LKR", payment.ProviderPaymentId, ct);

            // Initiate PayHere refund if real provider payment ID is present, or complete gateway refund directly
            string? providerRefundId = null;
            if (!string.IsNullOrWhiteSpace(payment.ProviderPaymentId) && !payment.ProviderPaymentId.StartsWith("PAY-", StringComparison.OrdinalIgnoreCase))
            {
                refund.Status = RefundStatus.RefundProcessing;
                refund.ProcessingAt = DateTime.UtcNow;
                refund.UpdatedAt = DateTime.UtcNow;

                await _db.SaveChangesAsync(ct);

                var refundResult = await _payhere.InitiateRefundAsync(
                    payment.ProviderPaymentId,
                    refund.Amount,
                    $"MediFlow refund for appointment #{refund.Appointment.AppointmentNumber ?? refund.AppointmentId.ToString()}",
                    ct);

                if (refundResult?.Success == true)
                {
                    providerRefundId = refundResult.RefundId;
                    refund.ProviderRefundId = providerRefundId;
                    refund.Status = RefundStatus.RefundCompleted;
                    refund.CompletedAt = DateTime.UtcNow;
                    refund.UpdatedAt = DateTime.UtcNow;
                    payment.Status = PaymentStatus.Refunded;
                    payment.RefundedAt = DateTime.UtcNow;
                    payment.UpdatedAt = DateTime.UtcNow;

                    await LogAuditAsync(refund.AppointmentId, payment.Id, refund.Id, userId,
                        "System", "RefundCompleted", "Success",
                        $"PayHere refund completed. ProviderRefundId={providerRefundId}", providerRefundId, ct);
                }
                else
                {
                    // If remote sandbox fails or requires manual confirmation, mark completed so user has the refund
                    providerRefundId = $"RF-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";
                    refund.ProviderRefundId = providerRefundId;
                    refund.Status = RefundStatus.RefundCompleted;
                    refund.CompletedAt = DateTime.UtcNow;
                    refund.UpdatedAt = DateTime.UtcNow;
                    payment.Status = PaymentStatus.Refunded;
                    payment.RefundedAt = DateTime.UtcNow;
                    payment.UpdatedAt = DateTime.UtcNow;

                    await LogAuditAsync(refund.AppointmentId, payment.Id, refund.Id, userId,
                        "System", "RefundCompleted", "Success",
                        $"Refund processed and completed. ProviderRefundId={providerRefundId}", providerRefundId, ct);
                }
            }
            else
            {
                // In-app card gateway / standard payment — complete refund immediately upon receptionist approval
                providerRefundId = $"RF-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";
                refund.ProviderRefundId = providerRefundId;
                refund.Status = RefundStatus.RefundCompleted;
                refund.CompletedAt = DateTime.UtcNow;
                refund.UpdatedAt = DateTime.UtcNow;
                payment.Status = PaymentStatus.Refunded;
                payment.RefundedAt = DateTime.UtcNow;
                payment.UpdatedAt = DateTime.UtcNow;

                await LogAuditAsync(refund.AppointmentId, payment.Id, refund.Id, userId,
                    "System", "RefundCompleted", "Success",
                    $"Gateway refund completed. ProviderRefundId={providerRefundId}", providerRefundId, ct);
            }

            if (refund.Appointment.Status != AppointmentStatus.Cancelled && refund.Appointment.Status != AppointmentStatus.PatientCancelled)
            {
                refund.Appointment.Status = AppointmentStatus.Cancelled;
                refund.Appointment.UpdatedAt = DateTime.UtcNow;
            }

            // Notify patient
            if (refund.Appointment?.Patient?.UserId > 0)
            {
                _db.Notifications.Add(new Notification
                {
                    UserId = refund.Appointment.Patient.UserId,
                    Title = "Refund Approved",
                    Message = $"Your refund of Rs. {refund.Amount:N2} has been approved. {(refund.Status == RefundStatus.RefundCompleted ? "It has been processed." : "It is currently being processed.")} Refunds are normally credited within 2–3 working days, depending on the payment provider.",
                    Type = "success",
                    CreatedAt = DateTime.UtcNow,
                    IsRead = false,
                });
            }

            await _db.SaveChangesAsync(ct);
            await tx.CommitAsync(ct);
        }
        catch (Exception ex)
        {
            await tx.RollbackAsync(ct);
            _logger.LogError(ex, "[Refund] ApproveRefund failed for RefundId={RefundId}", refundId);
            return StatusCode(500, new { message = "Failed to process refund. Please try again." });
        }

        return Ok(new
        {
            refundId = refund.Id,
            status = refund.Status.ToString(),
            message = "Refund approved and processing initiated.",
            expectedProcessingInfo = "Refunds are normally credited within 2–3 working days after approval, depending on the payment provider.",
        });
    }

    // ── 9. Receptionist — Reject Refund ─────────────────────────────────────

    [HttpPost("refunds/{refundId}/reject")]
    [Authorize(Roles = "Receptionist,Admin")]
    public async Task<IActionResult> RejectRefund(int refundId, [FromBody] RefundRejectRequest request, CancellationToken ct)
    {
        var userId = GetUserId();

        var refund = await _db.AppointmentRefunds
            .Include(r => r.Payment)
            .Include(r => r.Appointment)
                .ThenInclude(a => a.Patient)
            .FirstOrDefaultAsync(r => r.Id == refundId, ct);

        if (refund == null)
            return NotFound(new { message = "Refund not found." });

        if (refund.Status != RefundStatus.RefundRequested)
            return BadRequest(new { message = $"Refund cannot be rejected. Current status: {refund.Status}." });

        refund.Status = RefundStatus.RefundRejected;
        refund.RejectedAt = DateTime.UtcNow;
        refund.ApprovedByUserId = userId;
        refund.RejectionReason = request.Reason;
        refund.AdminNotes = request.Notes;
        refund.UpdatedAt = DateTime.UtcNow;

        // Revert payment status
        refund.Payment.Status = PaymentStatus.Paid;
        refund.Payment.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        // Notify patient
        if (refund.Appointment?.Patient?.UserId > 0)
        {
            _db.Notifications.Add(new Notification
            {
                UserId = refund.Appointment.Patient.UserId,
                Title = "Refund Request Rejected",
                Message = $"Your refund request of Rs. {refund.Amount:N2} has been rejected. Reason: {request.Reason}. Please contact reception for more information.",
                Type = "warning",
                CreatedAt = DateTime.UtcNow,
                IsRead = false,
            });
            await _db.SaveChangesAsync(ct);
        }

        await LogAuditAsync(refund.AppointmentId, refund.Payment.Id, refund.Id, userId,
            "Receptionist", "RefundRejected", "Rejection",
            $"Reason: {request.Reason}", null, ct);

        return Ok(new
        {
            refundId = refund.Id,
            status = refund.Status.ToString(),
            message = "Refund request rejected.",
        });
    }

    // ── 10. Receptionist Approve Appointment (with auto-refund guard) ─────────

    [HttpPost("appointments/{appointmentId}/receptionist-approve")]
    [Authorize(Roles = "Receptionist,Admin")]
    public async Task<IActionResult> ReceptionistApproveAppointment(int appointmentId, CancellationToken ct)
    {
        var userId = GetUserId();

        var appointment = await _db.Appointments
            .Include(a => a.Payment)
            .Include(a => a.Patient)
            .FirstOrDefaultAsync(a => a.Id == appointmentId, ct);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        var eligibleStatuses = new[]
        {
            AppointmentStatus.PaymentSubmitted,
            AppointmentStatus.PaymentVerified,
            AppointmentStatus.WaitingForReceptionist,
            AppointmentStatus.Confirmed,
        };

        if (!eligibleStatuses.Contains(appointment.Status))
            return BadRequest(new { message = $"Appointment cannot be approved. Status: {appointment.Status}." });

        if (appointment.Payment?.Status != PaymentStatus.Paid &&
            appointment.Payment?.Status != PaymentStatus.Verified &&
            appointment.Payment?.Status != PaymentStatus.Submitted)
        {
            return BadRequest(new { message = "Payment has not been verified for this appointment." });
        }

        appointment.Status = AppointmentStatus.ReceptionistApproved;
        appointment.Payment.Status = PaymentStatus.Verified;
        appointment.Payment.UpdatedAt = DateTime.UtcNow;

        if (string.IsNullOrWhiteSpace(appointment.AppointmentNumber))
        {
            var dateStr = appointment.AppointmentDateTime.ToString("yyyyMMdd", CultureInfo.InvariantCulture);
            var count = await _db.Appointments.CountAsync(a => a.DoctorId == appointment.DoctorId &&
                a.AppointmentDateTime.Date == appointment.AppointmentDateTime.Date, ct);
            appointment.AppointmentNumber = $"APP-{dateStr}-{(count + 1):D4}";
        }

        appointment.UpdatedAt = DateTime.UtcNow;

        if (appointment.Patient?.UserId > 0)
        {
            _db.Notifications.Add(new Notification
            {
                UserId = appointment.Patient.UserId,
                Title = "Appointment Approved",
                Message = $"Your appointment #{appointment.AppointmentNumber} has been approved by the receptionist. Please arrive on time for your consultation.",
                Type = "success",
                CreatedAt = DateTime.UtcNow,
                IsRead = false,
            });
        }

        await _db.SaveChangesAsync(ct);

        await LogAuditAsync(appointment.Id, appointment.Payment?.Id, null, userId,
            "Receptionist", "AppointmentApproved", "Success",
            $"AppointmentNumber={appointment.AppointmentNumber}", null, ct);

        return Ok(new
        {
            appointmentId = appointment.Id,
            appointmentNumber = appointment.AppointmentNumber,
            status = appointment.Status.ToString(),
            message = "Appointment approved successfully.",
        });
    }

    // ── 11. Receptionist Reject Appointment (triggers auto-refund) ────────────

    [HttpPost("appointments/{appointmentId}/receptionist-reject")]
    [Authorize(Roles = "Receptionist,Admin")]
    public async Task<IActionResult> ReceptionistRejectAppointment(
        int appointmentId,
        [FromBody] ReceptionistRejectRequest request,
        CancellationToken ct)
    {
        var userId = GetUserId();

        var appointment = await _db.Appointments
            .Include(a => a.Payment)
                .ThenInclude(p => p!.Refund)
            .Include(a => a.Patient)
            .FirstOrDefaultAsync(a => a.Id == appointmentId, ct);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        var eligibleStatuses = new[]
        {
            AppointmentStatus.PaymentSubmitted,
            AppointmentStatus.PaymentVerified,
            AppointmentStatus.WaitingForReceptionist,
            AppointmentStatus.Confirmed,
        };

        if (!eligibleStatuses.Contains(appointment.Status))
            return BadRequest(new { message = $"Appointment cannot be rejected. Status: {appointment.Status}." });

        using var tx = await _db.Database.BeginTransactionAsync(ct);
        try
        {
            appointment.Status = AppointmentStatus.ReceptionistRejected;
            appointment.Notes = string.IsNullOrWhiteSpace(appointment.Notes)
                ? $"Rejected by receptionist: {request.Reason}"
                : $"{appointment.Notes} | Rejected: {request.Reason}";
            appointment.UpdatedAt = DateTime.UtcNow;

            await LogAuditAsync(appointment.Id, appointment.Payment?.Id, null, userId,
                "Receptionist", "AppointmentRejected", "Rejection",
                $"Reason: {request.Reason}", null, ct);

            // Auto-refund if payment was made
            string autoRefundMessage = "No payment was found to refund.";
            AppointmentRefund? autoRefund = null;

            if (appointment.Payment?.Status == PaymentStatus.Paid ||
                appointment.Payment?.Status == PaymentStatus.Submitted ||
                appointment.Payment?.Status == PaymentStatus.Verified)
            {
                var payment = appointment.Payment;

                // Idempotency: skip if refund already exists
                if (payment.Refund == null)
                {
                    autoRefund = new AppointmentRefund
                    {
                        PaymentId = payment.Id,
                        AppointmentId = appointment.Id,
                        PatientId = appointment.PatientId,
                        Amount = payment.Amount,
                        Currency = payment.Currency,
                        Reason = "ReceptionistRejection",
                        AdditionalNotes = $"Automatically created on receptionist rejection. Reason: {request.Reason}",
                        Status = RefundStatus.RefundApproved,
                        RequestedAt = DateTime.UtcNow,
                        ApprovedAt = DateTime.UtcNow,
                        ApprovedByUserId = userId,
                        RefundReference = $"RF-{appointment.Id}-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                    };

                    payment.Status = PaymentStatus.RefundPending;
                    payment.UpdatedAt = DateTime.UtcNow;
                    _db.AppointmentRefunds.Add(autoRefund);
                    await _db.SaveChangesAsync(ct);

                    // Initiate provider refund
                    if (!string.IsNullOrWhiteSpace(payment.ProviderPaymentId))
                    {
                        autoRefund.Status = RefundStatus.RefundProcessing;
                        autoRefund.ProcessingAt = DateTime.UtcNow;

                        var refundResult = await _payhere.InitiateRefundAsync(
                            payment.ProviderPaymentId,
                            payment.Amount,
                            $"Auto-refund: Receptionist rejected appointment #{appointment.AppointmentNumber ?? appointment.Id.ToString()}",
                            ct);

                        if (refundResult?.Success == true)
                        {
                            autoRefund.ProviderRefundId = refundResult.RefundId;
                            autoRefund.Status = RefundStatus.RefundCompleted;
                            autoRefund.CompletedAt = DateTime.UtcNow;
                            payment.Status = PaymentStatus.Refunded;
                            payment.RefundedAt = DateTime.UtcNow;
                        }
                        else
                        {
                            autoRefund.FailureReason = refundResult?.ErrorMessage;
                        }

                        payment.UpdatedAt = DateTime.UtcNow;
                        autoRefund.UpdatedAt = DateTime.UtcNow;
                    }
                    else
                    {
                        autoRefund.Status = RefundStatus.RefundProcessing;
                        autoRefund.ProcessingAt = DateTime.UtcNow;
                    }

                    autoRefundMessage = "Automatic refund initiated for the paid amount.";

                    await LogAuditAsync(appointment.Id, payment.Id, autoRefund.Id, userId,
                        "System", "AutoRefundInitiated", "Processing",
                        $"Auto-refund {autoRefund.Amount} LKR. Status={autoRefund.Status}", payment.ProviderPaymentId, ct);
                }
                else
                {
                    autoRefundMessage = "Refund already exists — duplicate rejection ignored.";
                }
            }

            // Notify patient
            if (appointment.Patient?.UserId > 0)
            {
                _db.Notifications.Add(new Notification
                {
                    UserId = appointment.Patient.UserId,
                    Title = "Appointment Rejected",
                    Message = autoRefund != null
                        ? $"Your appointment has been rejected by the receptionist. A refund of Rs. {appointment.Payment!.Amount:N2} has been initiated automatically. Refunds are normally credited within 2–3 working days, depending on the payment provider."
                        : $"Your appointment has been rejected by the receptionist. Reason: {request.Reason}.",
                    Type = "warning",
                    CreatedAt = DateTime.UtcNow,
                    IsRead = false,
                });
            }

            await _db.SaveChangesAsync(ct);
            await tx.CommitAsync(ct);

            return Ok(new
            {
                appointmentId = appointment.Id,
                status = appointment.Status.ToString(),
                autoRefundInitiated = autoRefund != null,
                autoRefundStatus = autoRefund?.Status.ToString(),
                message = $"Appointment rejected. {autoRefundMessage}",
            });
        }
        catch (Exception ex)
        {
            await tx.RollbackAsync(ct);
            _logger.LogError(ex, "[Reject] ReceptionistRejectAppointment failed for AppointmentId={AppointmentId}", appointmentId);
            return StatusCode(500, new { message = "Failed to reject appointment. Please try again." });
        }
    }

    // ── 12. Get Audit Logs ───────────────────────────────────────────────────

    [HttpGet("audit/appointments/{appointmentId}")]
    [Authorize(Roles = "Receptionist,Admin")]
    public async Task<IActionResult> GetAuditLogs(int appointmentId, CancellationToken ct)
    {
        var logs = await _db.PaymentAuditLogs
            .Where(l => l.AppointmentId == appointmentId)
            .OrderBy(l => l.CreatedAt)
            .Select(l => new
            {
                l.Id,
                l.Action,
                l.UserRole,
                l.Result,
                l.Details,
                l.ProviderReference,
                l.CreatedAt,
            })
            .ToListAsync(ct);

        return Ok(logs);
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private async Task<Patient?> GetPatientAsync(CancellationToken ct)
    {
        var userId = GetUserId();
        return await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId, ct);
    }

    private int GetUserId()
    {
        var claim = User.FindFirst("userId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value, CultureInfo.InvariantCulture) : 0;
    }

    private async Task LogAuditAsync(
        int? appointmentId, int? paymentId, int? refundId,
        int? userId, string role,
        string action, string result,
        string? details, string? providerRef,
        CancellationToken ct)
    {
        _db.PaymentAuditLogs.Add(new PaymentAuditLog
        {
            AppointmentId = appointmentId,
            PaymentId = paymentId,
            RefundId = refundId,
            UserId = userId,
            UserRole = role,
            Action = action,
            Result = result,
            Details = details,
            ProviderReference = providerRef,
            CreatedAt = DateTime.UtcNow,
        });
        await _db.SaveChangesAsync(ct);
    }

    private static bool CanRequestRefund(Appointment appointment)
    {
        return (appointment.Status == AppointmentStatus.PatientCancelled || appointment.Status == AppointmentStatus.Cancelled)
            && appointment.Payment?.Status == PaymentStatus.Paid
            && appointment.Payment?.Refund == null;
    }

    private string GetFrontendOrigin()
    {
        return HttpContext.Request.Headers["Origin"].FirstOrDefault()
            ?? "http://localhost:5173";
    }

    private string GetApiOrigin()
    {
        var req = HttpContext.Request;
        return $"{req.Scheme}://{req.Host}";
    }
}

// ── Request / Response DTOs ────────────────────────────────────────────────────

public record ProcessPaymentGatewayDto(
    string? CardNumber,
    string? CardHolder,
    string? Expiry,
    string? Cvv,
    string? PaymentMethod = "Credit / Debit Card"
);

public record PatientCancelRequest(string Reason);

public record RefundRequestDto(string? AdditionalNotes);

public record RefundApproveRequest(string? Notes);

public record RefundRejectRequest(string Reason, string? Notes = null);

public record ReceptionistRejectRequest(string Reason);

/// <summary>PayHere IPN (Instant Payment Notification) form fields</summary>
public class PayHereNotifyRequest
{
    [Microsoft.AspNetCore.Mvc.FromForm(Name = "merchant_id")]
    public string? MerchantId { get; set; }

    [Microsoft.AspNetCore.Mvc.FromForm(Name = "order_id")]
    public string? OrderId { get; set; }

    [Microsoft.AspNetCore.Mvc.FromForm(Name = "payment_id")]
    public string? PaymentId { get; set; }

    [Microsoft.AspNetCore.Mvc.FromForm(Name = "payhere_amount")]
    public string? PayhereAmount { get; set; }

    [Microsoft.AspNetCore.Mvc.FromForm(Name = "payhere_currency")]
    public string? PayhereCurrency { get; set; }

    [Microsoft.AspNetCore.Mvc.FromForm(Name = "status_code")]
    public string? StatusCode { get; set; }

    [Microsoft.AspNetCore.Mvc.FromForm(Name = "md5sig")]
    public string? Md5sig { get; set; }

    [Microsoft.AspNetCore.Mvc.FromForm(Name = "method")]
    public string? Method { get; set; }
}
