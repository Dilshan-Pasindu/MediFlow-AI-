using System.Globalization;
using System.Security.Claims;
using MediFlow.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace MediFlow.Api.Extensions;

/// <summary>
/// Safe claims extraction extension methods to prevent FormatException
/// when dealing with string/UUID Supabase subjects and provide reliable User.Id lookup.
/// </summary>
public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal principal, AppDbContext? db = null)
    {
        // 1. Check direct internal numeric "userId" claim
        var claim = principal.FindFirst("userId");
        if (claim != null && int.TryParse(claim.Value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var id))
            return id;

        // 2. Check NameIdentifier if it's a numeric internal ID
        claim = principal.FindFirst(ClaimTypes.NameIdentifier);
        if (claim != null && int.TryParse(claim.Value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var subId))
            return subId;

        // 3. Check for Supabase string UUID ("sub", "supabaseId", NameIdentifier)
        var sub = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? principal.FindFirst("sub")?.Value
            ?? principal.FindFirst("supabaseId")?.Value;

        if (!string.IsNullOrWhiteSpace(sub) && db != null)
        {
            var user = db.Users.AsNoTracking().FirstOrDefault(u => u.SupabaseId == sub);
            if (user != null) return user.Id;
        }

        return 0;
    }

    public static int GetRequiredUserId(this ClaimsPrincipal principal, AppDbContext? db = null)
    {
        var id = principal.GetUserId(db);
        if (id <= 0)
        {
            throw new UnauthorizedAccessException("User identity could not be verified from token claims.");
        }
        return id;
    }
}
