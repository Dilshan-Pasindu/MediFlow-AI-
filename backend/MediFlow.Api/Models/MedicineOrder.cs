namespace MediFlow.Api.Models;

/// <summary>
/// A medicine dispensing order placed against a Prescription.
/// Can be linked to a registered Patient or a walk-in (via the Prescription).
/// PharmacistId is a User.Id (no nav property — pharmacist user looked up separately).
/// Owned by Member 3 — E-Prescription &amp; Medicine Ordering.
/// </summary>
public class MedicineOrder
{
    public int Id { get; set; }

    // Nullable — an order may be created without a prescription (OTC counter orders)
    public int? PrescriptionId { get; set; }

    // Nullable — walk-in patients have no registered Patient record
    public int? PatientId { get; set; }

    // Fulfilling pharmacy (Member 4 entity)
    public int? PharmacyId { get; set; }

    // User.Id of the pharmacist who processes the order — no nav needed
    public int? PharmacistId { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public decimal TotalAmount { get; set; }
    public bool IsPaid { get; set; } = false;
    public string? DeliveryAddress { get; set; }
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DispensedAt { get; set; }

    // Navigation
    public Prescription? Prescription { get; set; }
    public Patient? Patient { get; set; }
    public Pharmacy? Pharmacy { get; set; }
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

public enum OrderStatus
{
    Pending,    // Order created, awaiting pharmacy confirmation
    Confirmed,  // Pharmacy accepted the order
    Preparing,  // Medicines being assembled
    Ready,      // Ready for collection / dispatch
    Dispensed,  // Handed to patient
    Cancelled   // Order voided
}
