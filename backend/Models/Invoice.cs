namespace MediFlow.Api.Models;

/// <summary>
/// Billing invoice generated for a MedicineOrder during dispensing.
/// Owned by Member 3 — E-Prescription &amp; Medicine Ordering.
/// </summary>
public class Invoice
{
    public int Id { get; set; }

    public int MedicineOrderId { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;

    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;

    public decimal TotalAmount { get; set; }

    public bool IsPaid { get; set; }

    public DateTime? PaidAt { get; set; }

    public string? PaymentMethod { get; set; }

    public int? GeneratedByPharmacistId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public MedicineOrder MedicineOrder { get; set; } = null!;
}
