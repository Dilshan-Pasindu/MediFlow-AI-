namespace MediFlow.Api.Models;

/// <summary>
/// Audit log row created when the AI Medication Intelligence Agent detects
/// a Drug-Drug Interaction, Allergy Contraindication, or Dosage Warning
/// against a prescription.
///
/// High-severity rows must be acknowledged by a Pharmacist (with a written
/// override note) before the linked MedicineOrder may advance past Pending.
///
/// Owned by Member 3 — E-Prescription &amp; Medicine Ordering.
/// </summary>
public class DrugInteractionLog
{
    public int Id { get; set; }

    // The prescription this log belongs to
    public int PrescriptionId { get; set; }
    public Prescription Prescription { get; set; } = null!;

    // Primary drug involved in the warning (always populated)
    public string DrugA { get; set; } = string.Empty;

    // Secondary drug — populated for DDI pairs; null for allergy/dosage-only warnings
    public string? DrugB { get; set; }

    public WarningType WarningType { get; set; }

    // "High", "Moderate", or "Low" — sourced directly from the AI response
    public string SeverityLevel { get; set; } = string.Empty;

    // Full clinical description from the AI response
    public string Description { get; set; } = string.Empty;

    // ─── Pharmacist HITL Acknowledgment ───────────────────────────────────────
    // User.Id of the pharmacist who acknowledged this warning
    public int? PharmacistId { get; set; }

    // Required when SeverityLevel == "High"; explains why dispensing proceeds despite the warning
    public string? PharmacistOverrideNote { get; set; }

    // Null until the pharmacist explicitly acknowledges this warning
    public DateTime? AcknowledgedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Categorises the type of clinical safety warning surfaced by the AI agent.
/// </summary>
public enum WarningType
{
    /// <summary>Drug-Drug Interaction detected between two co-prescribed medicines.</summary>
    DrugInteraction,

    /// <summary>A prescribed medicine conflicts with a documented patient allergy.</summary>
    AllergyContraindication,

    /// <summary>Age-related dosage concern (paediatric or geriatric).</summary>
    DosageWarning
}
