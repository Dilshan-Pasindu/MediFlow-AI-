namespace MediFlow.Api.Models;

/// <summary>
/// Payment record for an appointment booking.
/// Owned by Member 1.
/// </summary>
public class AppointmentPayment
{
    public int Id { get; set; }
    public int AppointmentId { get; set; }
    public decimal Amount { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public string? PaymentMethod { get; set; }      // e.g. "Card", "Cash", "Online"
    public string? TransactionReference { get; set; }
    public DateTime? PaidAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Appointment Appointment { get; set; } = null!;
}

public enum PaymentStatus
{
    Pending,
    Submitted,    // Patient submitted — awaiting receptionist verification
    Verified,     // Receptionist confirmed payment received
    Refunded,
    Failed
}
