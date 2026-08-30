namespace MediFlow.Api.DTOs;

// ─── Auth DTOs ────────────────────────────────────────────────────────────────

public record RegisterRequest(
    string FullName,
    string Email,
    string Password,
    string PhoneNumber
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
