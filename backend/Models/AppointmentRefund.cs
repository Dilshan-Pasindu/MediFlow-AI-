namespace MediFlow.Api.Models;

/// <summary>
/// Refund record for an appointment payment.
/// Supports patient-requested refunds (need receptionist approval) and automatic refunds (receptionist rejection).
/// </summary>
public class AppointmentRefund
{
    public int Id { get; set; }
    public int PaymentId { get; set; }
    public int AppointmentId { get; set; }
    public int PatientId { get; set; }

    public decimal Amount { get; set; }
    public string Currency { get; set; } = "LKR";

    /// <summary>PatientCancellation | ReceptionistRejection</summary>
    public string Reason { get; set; } = string.Empty;
    public string? AdditionalNotes { get; set; }

    public RefundStatus Status { get; set; } = RefundStatus.NotRequested;

    // Timestamps
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ApprovedAt { get; set; }
    public DateTime? RejectedAt { get; set; }
    public DateTime? ProcessingAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? FailedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Approval metadata
    public int? ApprovedByUserId { get; set; }
    public string? AdminNotes { get; set; }
    public string? RejectionReason { get; set; }

    // Provider integration
    public string? ProviderRefundId { get; set; }
    public string? RefundReference { get; set; }
    public string? FailureReason { get; set; }

    // Navigation
    public AppointmentPayment Payment { get; set; } = null!;
    public Appointment Appointment { get; set; } = null!;
    public Patient Patient { get; set; } = null!;
}

public enum RefundStatus
{
    NotRequested,
    RefundRequested,
    RefundApproved,
    RefundProcessing,
    RefundCompleted,
    RefundRejected,
    RefundFailed,
}
