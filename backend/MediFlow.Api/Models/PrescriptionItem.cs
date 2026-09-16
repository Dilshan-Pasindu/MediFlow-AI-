namespace MediFlow.Api.Models;

/// <summary>
/// A single line item on a Prescription (one row per prescribed medicine).
/// MedicineId is nullable — a doctor may prescribe something not yet in the catalogue.
/// Owned by Member 3 — E-Prescription &amp; Medicine Ordering.
/// </summary>
public class PrescriptionItem
{
    public int Id { get; set; }
    public int PrescriptionId { get; set; }

    // Optional FK into the shared Medicine catalogue (Member 4)
    public int? MedicineId { get; set; }

    // Always stored even if MedicineId is null, in case the medicine isn't catalogued
    public string MedicineName { get; set; } = string.Empty;
    public string Dosage { get; set; } = string.Empty;       // e.g. "500 mg"
    public string Frequency { get; set; } = string.Empty;    // e.g. "Twice daily"
    public string Duration { get; set; } = string.Empty;     // e.g. "7 days"
    public int Quantity { get; set; }
    public string? Instructions { get; set; }                 // e.g. "Take with food"

    // Navigation
    public Prescription Prescription { get; set; } = null!;
    public Medicine? Medicine { get; set; }
}
