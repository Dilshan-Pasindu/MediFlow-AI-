using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MediFlow.Api.Data;
using MediFlow.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MediFlow.Api.Services;

/// <summary>
/// Implements Supabase user identity resolution, linking, and claim enrichment.
/// Maps the Supabase "sub" claim to internal User.Id and sets role claims so that
/// all controllers and RBAC policies function seamlessly.
/// </summary>
public class SupabaseUserResolver : ISupabaseUserResolver
{
    private readonly AppDbContext _db;
    private readonly ILogger<SupabaseUserResolver> _logger;

    public SupabaseUserResolver(AppDbContext db, ILogger<SupabaseUserResolver> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<User?> ResolveAndPopulateClaimsAsync(ClaimsPrincipal? principal, AppDbContext db)
    {
        if (principal?.Identity?.IsAuthenticated != true)
            return null;

        var sub = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
            ?? principal.FindFirst("sub")?.Value;

        if (string.IsNullOrWhiteSpace(sub))
            return null;

        // 1. Try finding by SupabaseId
        var user = await db.Users.FirstOrDefaultAsync(u => u.SupabaseId == sub);

        // 2. Try finding by numeric Id (for legacy / unit test tokens)
        if (user == null && int.TryParse(sub, NumberStyles.Integer, CultureInfo.InvariantCulture, out var intId))
        {
            user = await db.Users.FirstOrDefaultAsync(u => u.Id == intId);
        }

        // 3. Try finding by Email claim if present and link SupabaseId
        var email = principal.FindFirst(ClaimTypes.Email)?.Value
            ?? principal.FindFirst(JwtRegisteredClaimNames.Email)?.Value
            ?? principal.FindFirst("email")?.Value;

        if (user == null && !string.IsNullOrWhiteSpace(email))
        {
            var normalizedEmail = email.Trim().ToLower(CultureInfo.InvariantCulture);
            user = await db.Users.FirstOrDefaultAsync(u => u.Email == normalizedEmail);
            if (user != null)
            {
                user.SupabaseId = sub;
                user.UpdatedAt = DateTime.UtcNow;
                await db.SaveChangesAsync();
                _logger.LogInformation("Linked existing User Id {UserId} to SupabaseId {Sub}", user.Id, sub);
            }
        }

        // 4. If user not yet in database (e.g. freshly registered on Supabase Auth), provision them JIT
        if (user == null)
        {
            var fullName = principal.FindFirst(ClaimTypes.Name)?.Value
                ?? principal.FindFirst("full_name")?.Value
                ?? principal.FindFirst("name")?.Value
                ?? (email?.Split('@')[0] ?? "Patient");

            var phone = principal.FindFirst("phone")?.Value
                ?? principal.FindFirst("phone_number")?.Value
                ?? string.Empty;

            var roleClaim = principal.FindFirst(ClaimTypes.Role)?.Value
                ?? principal.FindFirst("role")?.Value;

            var role = UserRole.Patient;
            if (!string.IsNullOrWhiteSpace(roleClaim) && Enum.TryParse<UserRole>(roleClaim, true, out var parsedRole))
            {
                role = parsedRole;
            }

            var safeEmail = !string.IsNullOrWhiteSpace(email)
                ? email.Trim().ToLower(CultureInfo.InvariantCulture)
                : $"{sub}@supabase.local";

            user = new User
            {
                SupabaseId = sub,
                Email = safeEmail,
                FullName = fullName.Trim(),
                PhoneNumber = phone.Trim(),
                Role = role,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            db.Users.Add(user);
            await db.SaveChangesAsync();

            _logger.LogInformation("Provisioned new application user {UserId} from Supabase {Sub}", user.Id, sub);
        }

        // 5. Ensure Patient entity exists if role is Patient
        if (user.Role == UserRole.Patient)
        {
            var patient = await db.Patients.FirstOrDefaultAsync(p => p.UserId == user.Id || (p.SupabaseId != null && p.SupabaseId == sub));
            if (patient == null)
            {
                patient = new Patient
                {
                    UserId = user.Id,
                    SupabaseId = sub,
                    FullName = user.FullName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                db.Patients.Add(patient);
                await db.SaveChangesAsync();
            }
            else if (patient.SupabaseId == null)
            {
                patient.SupabaseId = sub;
                await db.SaveChangesAsync();
            }
        }

        // 6. Enrich ClaimsPrincipal with application context claims
        if (principal.Identity is ClaimsIdentity identity)
        {
            if (!identity.HasClaim(c => c.Type == "userId"))
            {
                identity.AddClaim(new Claim("userId", user.Id.ToString(CultureInfo.InvariantCulture)));
            }

            if (!identity.HasClaim(c => c.Type == ClaimTypes.Role))
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, user.Role.ToString()));
            }

            if (!identity.HasClaim(c => c.Type == "supabaseId"))
            {
                identity.AddClaim(new Claim("supabaseId", sub));
            }

            if (!identity.HasClaim(c => c.Type == ClaimTypes.Name) && !string.IsNullOrEmpty(user.FullName))
            {
                identity.AddClaim(new Claim(ClaimTypes.Name, user.FullName));
            }
        }

        return user;
    }

    public async Task<User> SyncSupabaseUserAsync(string supabaseId, string email, string? fullName, string? phone, UserRole role)
    {
        var normalizedEmail = email.Trim().ToLower(CultureInfo.InvariantCulture);
        var user = await _db.Users.FirstOrDefaultAsync(u => u.SupabaseId == supabaseId || u.Email == normalizedEmail);

        if (user == null)
        {
            user = new User
            {
                SupabaseId = supabaseId,
                Email = normalizedEmail,
                FullName = !string.IsNullOrWhiteSpace(fullName) ? fullName.Trim() : normalizedEmail.Split('@')[0],
                PhoneNumber = phone?.Trim() ?? string.Empty,
                Role = role,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
        }
        else
        {
            user.SupabaseId = supabaseId;
            if (!string.IsNullOrWhiteSpace(fullName)) user.FullName = fullName.Trim();
            if (!string.IsNullOrWhiteSpace(phone)) user.PhoneNumber = phone.Trim();
            user.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }

        if (user.Role == UserRole.Patient)
        {
            var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == user.Id || (p.SupabaseId != null && p.SupabaseId == supabaseId));
            if (patient == null)
            {
                patient = new Patient
                {
                    UserId = user.Id,
                    SupabaseId = supabaseId,
                    FullName = user.FullName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _db.Patients.Add(patient);
                await _db.SaveChangesAsync();
            }
            else
            {
                patient.SupabaseId = supabaseId;
                if (!string.IsNullOrWhiteSpace(fullName)) patient.FullName = user.FullName;
                if (!string.IsNullOrWhiteSpace(phone)) patient.PhoneNumber = user.PhoneNumber;
                patient.UpdatedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();
            }
        }
        else if (user.Role == UserRole.Doctor)
        {
            var doctor = await _db.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
            if (doctor == null)
            {
                doctor = new Doctor
                {
                    UserId = user.Id,
                    FullName = user.FullName,
                    Bio = "Medical specialist registered on MediFlow AI",
                    Qualifications = "MBBS",
                    ExperienceYears = 1,
                    ConsultationFee = 2500,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _db.Doctors.Add(doctor);
                await _db.SaveChangesAsync();
            }
        }

        return user;
    }
}
