namespace MediFlow.Api.Models;

/// <summary>
/// A prescription issued by a Doctor after a consultation.
/// Supports both appointment-linked and walk-in patients.
/// Owned by Member 3 — E-Prescription &amp; Medicine Ordering.
/// </summary>
public class Prescription
{
    public int Id { get; set; }

    // Soft link to an Appointment — null for walk-in prescriptions
    public int? AppointmentId { get; set; }

    // Null for walk-in patients who have no registered Patient record
    public int? PatientId { get; set; }

    // Required — the issuing doctor
    public int DoctorId { get; set; }

    public bool IsWalkIn { get; set; }

    // Walk-in patient details (populated only when IsWalkIn = true)
    public string? WalkInPatientName { get; set; }
    public string? WalkInPatientAge { get; set; }
    public string? WalkInPatientGender { get; set; }
    public string? WalkInPatientPhone { get; set; }

    public string? Diagnosis { get; set; }
    public string? Instructions { get; set; }

    public FulfillmentSource FulfillmentSource { get; set; } = FulfillmentSource.InHouse;
    public PrescriptionRecipients Recipients { get; set; } = PrescriptionRecipients.Both;
    public PrescriptionStatus Status { get; set; } = PrescriptionStatus.Active;

    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiryDate { get; set; }
    public DateTime? SafetyCheckedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Clinical Integrity & Approval Traceability ─────────────────────────
    /// <summary>
    /// SHA-256 hex digest of the canonicalized, ordered list of prescription items
    /// (MedicineName|Dosage|Frequency|Duration|Quantity, sorted and joined).
    /// Recomputed on every item update. Allows the system to detect silent payload
    /// mutations after clinical safety review.
    /// </summary>
    public string? ContentHash { get; set; }

    /// <summary>
    /// Snapshot of ContentHash captured at the exact moment the doctor approved
    /// the AI safety recommendation (SafetyCheckedAt is set).
    /// If ContentHash != ApprovalHash the prescription is flagged as
    /// "items modified after safety approval" and dispensing must be blocked
    /// pending re-evaluation.
    /// </summary>
    public string? ApprovalHash { get; set; }

    // Navigation
    public Doctor Doctor { get; set; } = null!;
    public Patient? Patient { get; set; }
    public Appointment? Appointment { get; set; }
    public ICollection<PrescriptionItem> Items { get; set; } = new List<PrescriptionItem>();
    public ICollection<MedicineOrder> Orders { get; set; } = new List<MedicineOrder>();
}


public enum FulfillmentSource
{
    InHouse,    // Dispensed from a linked in-house pharmacy
    External    // Patient obtains medicines from an external pharmacy
}

public enum PrescriptionRecipients
{
    Both,           // Prescription sent to both patient and pharmacy
    PatientOnly     // Prescription sent to patient only
}

public enum PrescriptionStatus
{
    Active,     // Issued and valid
    Fulfilled,  // All medicines dispensed
    Expired,    // Past expiry date without being fulfilled
    Cancelled   // Voided by doctor or admin
}
