namespace MediFlow.Api.DTOs;

// ─── Prescription Response DTOs ────────────────────────────────────────────────

public record PrescriptionItemDto(
    int? MedicineId,
    string MedicineName,
    string Dosage,
    string Frequency,
    string Duration,
    int Quantity,
    string? Instructions
);

public record PrescriptionDto(
    int Id,
    int? AppointmentId,
    string? AppointmentNumber,
    int? PatientId,
    string PatientName,
    string? PatientAge,
    string? PatientGender,
    string? PatientPhone,
    bool IsWalkIn,
    int DoctorId,
    string DoctorName,
    string? DoctorSpecialty,
    string DoctorLicenseNo,
    string? Diagnosis,
    string Status,              // Active | Fulfilled | Expired | Cancelled
    string FulfillmentSource,   // InHouse | External
    string Recipients,          // Both | PatientOnly
    string? Instructions,
    List<PrescriptionItemDto> Items,
    int ItemCount,
    string DateIssued,
    string CreatedAt
);

// ─── Prescription Request DTOs ─────────────────────────────────────────────────

public record WalkInPatientDetailsDto(
    string FullName,
    string? Age,
    string? Gender,
    string? Phone,
    string? Address = null
);

public record CreatePrescriptionItemDto(
    int? MedicineId,
    string MedicineName,
    string Dosage,
    string Frequency,
    string Duration,
    int Quantity,
    string? Instructions = null
);

public record PrescriptionLabOrderDto(
    string TestName,
    string Indication,
    string Urgency
);

public record CreatePrescriptionRequestDto(
    int? AppointmentId,
    int? PatientId,
    bool IsWalkIn,
    WalkInPatientDetailsDto? WalkInPatientDetails,
    string? PatientName,
    string? Diagnosis,
    string FulfillmentSource,   // "InHouse" | "External"
    string Recipients,          // "Both" | "PatientOnly"
    string? Instructions,
    List<CreatePrescriptionItemDto> Items,
    List<PrescriptionLabOrderDto>? LabOrders = null
);

public class CreatePrescriptionDto
{
    public int PatientId { get; set; }
    public int PharmacyId { get; set; }
    public string? Notes { get; set; }
    public List<CreatePrescriptionItemDto> Items { get; set; } = new();
}

// ─── Prescription Update DTO ───────────────────────────────────────────────────

/// <summary>
/// All fields are optional — only non-null fields will be applied.
/// Items: if provided and non-empty, replaces all existing prescription items.
/// </summary>
public record UpdatePrescriptionRequestDto(
    string? PatientName,
    bool? IsWalkIn,
    WalkInPatientDetailsDto? WalkInPatientDetails,
    string? Diagnosis,
    string? FulfillmentSource,
    string? Instructions,
    List<CreatePrescriptionItemDto>? Items
);

