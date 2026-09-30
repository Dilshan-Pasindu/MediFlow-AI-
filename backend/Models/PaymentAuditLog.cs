namespace MediFlow.Api.Models;

/// <summary>
/// Audit trail for all financial operations — payment, refund, approval, rejection events.
/// </summary>
public class PaymentAuditLog
{
    public int Id { get; set; }
    public int? AppointmentId { get; set; }
    public int? PaymentId { get; set; }
    public int? RefundId { get; set; }
    public int? UserId { get; set; }           // Who performed the action
    public string? UserRole { get; set; }      // Patient / Receptionist / System
    public string Action { get; set; } = string.Empty;  // e.g. "PaymentCreated", "RefundApproved"
    public string? Result { get; set; }        // "Success" / "Failure" / "Pending"
    public string? Details { get; set; }       // Free-text details
    public string? ProviderReference { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
