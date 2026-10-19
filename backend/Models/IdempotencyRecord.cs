namespace MediFlow.Api.Models;

/// <summary>
/// Persists prescription idempotency records to prevent duplicate authorizations
/// on dropped-connection retries or concurrent requests.
///
/// Implements the pattern recommended during expert clinical review:
///   - IdempotencyKey  : client-generated UUID (sent in Idempotency-Key header)
///   - PayloadHash     : SHA-256 of the normalized request body; detects mutated retries
///   - PrescriptionId  : the committed prescription row; returned on replay without re-executing
///   - ExpiresAt       : 24-hour TTL; expired records are safe to prune
/// </summary>
public class IdempotencyRecord
{
    /// <summary>Client-generated UUID passed in the Idempotency-Key request header.</summary>
    public string Key { get; set; } = string.Empty;

    /// <summary>
    /// SHA-256 hex digest of the canonicalized JSON request payload.
    /// If a retry arrives with the same Key but a different PayloadHash the request
    /// is rejected with HTTP 409 — Conflict (mutated payload on existing key).
    /// </summary>
    public string PayloadHash { get; set; } = string.Empty;

    /// <summary>The prescription row that was committed on the first successful request.</summary>
    public int PrescriptionId { get; set; }

    /// <summary>UTC timestamp when the record was first created.</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Records expire after 24 hours and may be safely pruned.</summary>
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddHours(24);
}
