namespace MediFlow.Api.DTOs;

// ─── Auth DTOs ────────────────────────────────────────────────────────────────

public record RegisterRequest(
    string FullName,
    string Email,
    string Password,
    string PhoneNumber,
    string? Role = "Patient"
);

public record LoginRequest(
    string Email,
    string Password
);

public record AuthResponse(
    int UserId,
    string FullName,
    string Email,
    string Role,
    string Token,
    DateTime ExpiresAt
);

public record ForgotPasswordRequest(
    string Email
);

public record ResetPasswordRequest(
    string Email,
    string OtpCode,
    string NewPassword
);
