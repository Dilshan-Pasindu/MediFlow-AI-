namespace MediFlow.Api.Models;

/// <summary>
/// Payment record for an appointment booking.
/// Extended with PayHere sandbox integration fields.
/// Owned by Member 1.
/// </summary>
public class AppointmentPayment
{
    public int Id { get; set; }
    public int AppointmentId { get; set; }
    public int? PatientId { get; set; }           // Denormalized for ownership checks

    public decimal Amount { get; set; }
    public string Currency { get; set; } = "LKR";

    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public string? PaymentMethod { get; set; }       // e.g. "Card", "Online"

    // Transaction references
    public string? TransactionReference { get; set; }  // Our internal reference
    public string? ProviderPaymentId { get; set; }     // PayHere payment_id
    public string? ProviderOrderId { get; set; }       // PayHere order_id we send
    public string? Provider { get; set; } = "PayHere"; // Payment provider name

    // Timestamps
    public DateTime? PaidAt { get; set; }
    public DateTime? FailedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public DateTime? RefundedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Extra metadata (e.g. raw provider response snippet, card type)
    public string? Metadata { get; set; }

    // Navigation
    public Appointment Appointment { get; set; } = null!;
    public AppointmentRefund? Refund { get; set; }
}

public enum PaymentStatus
{
    Pending,
    Processing,
    Paid,
    Failed,
    Cancelled,
    Expired,
    // Legacy aliases for backward compat
    Submitted,    // Patient submitted — awaiting receptionist verification
    Verified,     // Receptionist confirmed payment received
    RefundPending,
    PartiallyRefunded,
    Refunded,
}
