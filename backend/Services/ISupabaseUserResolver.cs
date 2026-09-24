using System.Security.Claims;
using MediFlow.Api.Data;
using MediFlow.Api.Models;

namespace MediFlow.Api.Services;

/// <summary>
/// Authoritative resolver and synchronization service that maps Supabase Auth users
/// (identified by their UUID "sub" claim) to internal application User and Patient entities.
/// </summary>
public interface ISupabaseUserResolver
{
    /// <summary>
    /// Resolves an incoming ClaimsPrincipal from a validated Supabase JWT, maps it to the
    /// internal User record in PostgreSQL, creates/syncs records if needed, and injects
    /// the resolved application claims (e.g. userId, Role, supabaseId).
    /// </summary>
    Task<User?> ResolveAndPopulateClaimsAsync(ClaimsPrincipal? principal, AppDbContext db);

    /// <summary>
    /// Explicitly syncs or provisions an authenticated Supabase user profile into the PostgreSQL database.
    /// </summary>
    Task<User> SyncSupabaseUserAsync(string supabaseId, string email, string? fullName, string? phone, UserRole role);
}
