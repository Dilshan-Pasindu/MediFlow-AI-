namespace MediFlow.Api.Models;

/// <summary>
/// A single line item on a MedicineOrder.
/// MedicineId is nullable — item may reference a medicine not yet in the catalogue.
/// Owned by Member 3 — E-Prescription &amp; Medicine Ordering.
/// </summary>
public class OrderItem
{
    public int Id { get; set; }
    public int MedicineOrderId { get; set; }

    // Optional FK into the shared Medicine catalogue (Member 4)
    public int? MedicineId { get; set; }

    // Always stored for audit / display even if the catalogue entry is removed
    public string MedicineName { get; set; } = string.Empty;
    public string? Dosage { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Subtotal { get; set; }

    // Navigation
    public MedicineOrder MedicineOrder { get; set; } = null!;
    public Medicine? Medicine { get; set; }
}
