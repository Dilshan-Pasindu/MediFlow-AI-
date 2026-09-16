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
    List<CreatePrescriptionItemDto> Items
);
