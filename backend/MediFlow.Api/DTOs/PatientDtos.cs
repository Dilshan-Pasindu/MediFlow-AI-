namespace MediFlow.Api.DTOs;

// ─── Patient DTOs ─────────────────────────────────────────────────────────────

public record UpdatePatientRequest(
    string? FullName = null,
    string? PhoneNumber = null,
    DateOnly? DateOfBirth = null,
    string? Gender = null,
    string? Address = null,
    string? BloodGroup = null
);
