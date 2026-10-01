namespace MediFlow.Api.DTOs;

// ─── Auth DTOs ────────────────────────────────────────────────────────────────

public record RegisterRequest(
    string FullName,
    string Email,
    string Password,
    string PhoneNumber,
    string? Role = "Patient"
);

public record StaffRegisterRequest(
    string FullName,
    string Email,
    string Password,
    string PhoneNumber,
    string Role,
    string? RegistrationNumber = null
);

public record LoginRequest(
    string Email,
    string Password,
    string? LoginType = null
);

public record AuthResponse(
    int UserId,
    string FullName,
    string Email,
    string Role,
    string Token,
    DateTime ExpiresAt,
    string VerificationStatus = "Approved"
);

public record StaffRegistrationResponse(
    int UserId,
    string FullName,
    string Email,
    string Role,
    string VerificationStatus,
    string Message
);

public record ForgotPasswordRequest(
    string Email
);

public record ResetPasswordRequest(
    string Email,
    string OtpCode,
    string NewPassword
);

public record GoogleAuthRequest(
    string? IdToken,
    string? Email,
    string? FullName,
    string? PhotoUrl,
    string? Role = "Patient"
);

public record SupabaseSyncRequest(
    string? FullName = null,
    string? PhoneNumber = null,
    string? Role = null
);

public record UserProfileDto(
    int UserId,
    string? SupabaseId,
    string FullName,
    string Email,
    string Role,
    string PhoneNumber,
    int? PatientId = null,
    int? DoctorId = null,
    string VerificationStatus = "Approved",
    string? RegistrationNumber = null
);

public record ApproveRegistrationRequest(
    string? Notes = null
);

public record RejectRegistrationRequest(
    string? Reason = null
);

public record PendingRegistrationDto(
    int Id,
    string FullName,
    string Email,
    string PhoneNumber,
    string Role,
    string VerificationStatus,
    string? RegistrationNumber,
    string? RejectionReason,
    DateTime CreatedAt,
    DateTime? ReviewedAt,
    int? ReviewedByAdminId,
    bool IsActive
);
