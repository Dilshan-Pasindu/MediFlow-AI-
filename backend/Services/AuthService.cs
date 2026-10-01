using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace MediFlow.Api.Services;

/// <summary>
/// Handles user registration (patient and staff), login, verification status enforcement, and JWT token generation.
/// </summary>
public class AuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        AppDbContext db,
        IConfiguration config,
        IHttpClientFactory httpClientFactory,
        ILogger<AuthService> logger)
    {
        _db = db;
        _config = config;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    // ── Patient Registration ──────────────────────────────────────────────────

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLower(CultureInfo.InvariantCulture);
        if (await _db.Users.AnyAsync(u => u.Email == normalizedEmail))
            throw new InvalidOperationException("A user with this email already exists.");

        var parsedRole = UserRole.Patient;
        if (!string.IsNullOrWhiteSpace(request.Role) && Enum.TryParse<UserRole>(request.Role, true, out var roleEnum))
        {
            parsedRole = roleEnum;
        }

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = normalizedEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            PhoneNumber = request.PhoneNumber.Trim(),
            Role = parsedRole,
            VerificationStatus = VerificationStatus.Approved,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        if (parsedRole == UserRole.Patient)
        {
            var patient = new Patient
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.Patients.Add(patient);
            await _db.SaveChangesAsync();
        }
        else if (parsedRole == UserRole.Doctor)
        {
            var doctor = new Doctor
            {
                UserId = user.Id,
                FullName = user.FullName,
                Bio = "Medical specialist registered on MediFlow AI",
                Qualifications = "MBBS",
                ExperienceYears = 1,
                ConsultationFee = 2500,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.Doctors.Add(doctor);
            await _db.SaveChangesAsync();
        }

        var token = GenerateJwtToken(user);
        return new AuthResponse(
            user.Id,
            user.FullName,
            user.Email,
            user.Role.ToString(),
            token.Token,
            token.ExpiresAt,
            user.VerificationStatus.ToString()
        );
    }

    // ── Staff Registration (Pending Verification) ─────────────────────────────

    public async Task<StaffRegistrationResponse> RegisterStaffAsync(StaffRegisterRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLower(CultureInfo.InvariantCulture);
        if (await _db.Users.AnyAsync(u => u.Email == normalizedEmail))
            throw new InvalidOperationException("A user with this email already exists.");

        // Validate allowed staff roles: Doctor, Pharmacist, Supplier, Receptionist, PharmacyOwner
        // Strictly exclude Administrator and Patient from staff self-registration
        if (!Enum.TryParse<UserRole>(request.Role?.Trim(), true, out var roleEnum) ||
            roleEnum == UserRole.Administrator ||
            roleEnum == UserRole.Patient)
        {
            throw new ArgumentException("Invalid staff role requested. Only Doctor, Pharmacist, Supplier, Receptionist, or Pharmacy Owner may register through staff signup.");
        }

        string? regNo = null;
        if (roleEnum == UserRole.Doctor)
        {
            if (string.IsNullOrWhiteSpace(request.RegistrationNumber))
            {
                throw new ArgumentException("Doctor professional registration number (Reg No.) is mandatory.");
            }
            regNo = request.RegistrationNumber.Trim();

            // Validate against duplicate doctor registration numbers
            if (await _db.Users.AnyAsync(u => u.RegistrationNumber == regNo) ||
                await _db.Doctors.AnyAsync(d => d.RegistrationNumber == regNo))
            {
                throw new InvalidOperationException("A medical practitioner with this professional registration number already exists.");
            }
        }

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = normalizedEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            PhoneNumber = request.PhoneNumber.Trim(),
            Role = roleEnum,
            VerificationStatus = VerificationStatus.Pending,
            RegistrationNumber = regNo,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        // If registering as a Doctor, pre-create the doctor profile record in inactive state
        if (roleEnum == UserRole.Doctor)
        {
            var doctor = new Doctor
            {
                UserId = user.Id,
                FullName = user.FullName,
                RegistrationNumber = regNo,
                Bio = "Medical specialist registered on MediFlow AI",
                Qualifications = "MBBS",
                ExperienceYears = 1,
                ConsultationFee = 2500,
                IsActive = false, // Inactive until approved by administrator
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.Doctors.Add(doctor);
            await _db.SaveChangesAsync();
        }

        var confirmationMessage = roleEnum == UserRole.Doctor
            ? "Your registration has been submitted successfully. Your account is pending administrator verification. Your professional registration number will be reviewed. You will be able to log in after your registration has been reviewed and approved."
            : "Your registration has been submitted successfully. Your account is pending administrator verification. You will be able to log in after your registration has been reviewed and approved.";

        return new StaffRegistrationResponse(
            user.Id,
            user.FullName,
            user.Email,
            user.Role.ToString(),
            user.VerificationStatus.ToString(),
            confirmationMessage
        );
    }

    // ── Login with Portal Separation & Verification Checks ────────────────────

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLower(CultureInfo.InvariantCulture);
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("This account has been deactivated.");

        // Enforce strict portal separation between Patient and Staff login
        if (!string.IsNullOrWhiteSpace(request.LoginType))
        {
            if (request.LoginType.Equals("Patient", StringComparison.OrdinalIgnoreCase) && user.Role != UserRole.Patient)
            {
                throw new UnauthorizedAccessException("Staff members must use the Staff Login portal.");
            }

            if (request.LoginType.Equals("Staff", StringComparison.OrdinalIgnoreCase) && user.Role == UserRole.Patient)
            {
                throw new UnauthorizedAccessException("Patients must use the Patient Login portal.");
            }
        }

        // Enforce verification status for all staff roles (Doctor, Pharmacist, Supplier, Receptionist, PharmacyOwner)
        if (user.Role != UserRole.Patient && user.Role != UserRole.Administrator)
        {
            if (user.VerificationStatus == VerificationStatus.Pending)
            {
                throw new UnauthorizedAccessException("Your account is awaiting administrator verification. You will be able to log in once your registration has been approved. For assistance, please contact the MediFlow Help Center.");
            }

            if (user.VerificationStatus == VerificationStatus.Rejected)
            {
                var reasonSuffix = !string.IsNullOrWhiteSpace(user.RejectionReason)
                    ? $" Reason: {user.RejectionReason}"
                    : "";
                throw new UnauthorizedAccessException($"Your registration was rejected by the administrator.{reasonSuffix}");
            }
        }

        var token = GenerateJwtToken(user);
        return new AuthResponse(
            user.Id,
            user.FullName,
            user.Email,
            user.Role.ToString(),
            token.Token,
            token.ExpiresAt,
            user.VerificationStatus.ToString()
        );
    }

    // ── Google Auth (Sign Up / Sign In) ───────────────────────────────────────

    public async Task<AuthResponse> GoogleAuthAsync(GoogleAuthRequest request)
    {
        string? email = request.Email?.Trim().ToLower(CultureInfo.InvariantCulture);
        string? name = request.FullName?.Trim();

        // If IdToken is provided, attempt verification with Google tokeninfo
        if (!string.IsNullOrWhiteSpace(request.IdToken))
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var response = await client.GetAsync($"https://oauth2.googleapis.com/tokeninfo?id_token={Uri.EscapeDataString(request.IdToken)}");
                if (response.IsSuccessStatusCode)
                {
                    using var stream = await response.Content.ReadAsStreamAsync();
                    using var jsonDoc = await JsonDocument.ParseAsync(stream);
                    var root = jsonDoc.RootElement;
                    if (root.TryGetProperty("email", out var emailProp))
                    {
                        var verifiedEmail = emailProp.GetString()?.Trim().ToLower(CultureInfo.InvariantCulture);
                        if (!string.IsNullOrWhiteSpace(verifiedEmail))
                        {
                            email = verifiedEmail;
                        }
                    }
                    if (root.TryGetProperty("name", out var nameProp))
                    {
                        var verifiedName = nameProp.GetString()?.Trim();
                        if (!string.IsNullOrWhiteSpace(verifiedName))
                        {
                            name = verifiedName;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Google token verification call failed, falling back to request payload");
            }
        }

        if (string.IsNullOrWhiteSpace(email))
        {
            throw new ArgumentException("A valid Google account email is required.");
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            name = email.Split('@')[0];
        }

        // Check if user already exists
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            // Public Google signup is exclusively for Patient accounts
            var parsedRole = UserRole.Patient;

            user = new User
            {
                FullName = name,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString("N")),
                PhoneNumber = string.Empty,
                Role = parsedRole,
                VerificationStatus = VerificationStatus.Approved,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var patient = new Patient
            {
                UserId = user.Id,
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
            if (!user.IsActive)
                throw new UnauthorizedAccessException("This account has been deactivated.");

            // Check verification status if existing staff user tries Google Auth
            if (user.Role != UserRole.Patient && user.Role != UserRole.Administrator)
            {
                if (user.VerificationStatus == VerificationStatus.Pending)
                {
                    throw new UnauthorizedAccessException("Your account is awaiting administrator verification. You will be able to log in once your registration has been approved. For assistance, please contact the MediFlow Help Center.");
                }

                if (user.VerificationStatus == VerificationStatus.Rejected)
                {
                    var reasonSuffix = !string.IsNullOrWhiteSpace(user.RejectionReason)
                        ? $" Reason: {user.RejectionReason}"
                        : "";
                    throw new UnauthorizedAccessException($"Your registration was rejected by the administrator.{reasonSuffix}");
                }
            }
        }

        var token = GenerateJwtToken(user);
        return new AuthResponse(
            user.Id,
            user.FullName,
            user.Email,
            user.Role.ToString(),
            token.Token,
            token.ExpiresAt,
            user.VerificationStatus.ToString()
        );
    }

    // ── JWT Token Generation ──────────────────────────────────────────────────

    private (string Token, DateTime ExpiresAt) GenerateJwtToken(User user)
    {
        var key = _config["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT Key is not configured.");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString(CultureInfo.InvariantCulture)),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("userId", user.Id.ToString(CultureInfo.InvariantCulture)),
            new Claim("verificationStatus", user.VerificationStatus.ToString()),
            new Claim("registrationNumber", user.RegistrationNumber ?? string.Empty),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var expiresAt = DateTime.UtcNow.AddHours(24);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials
        );

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }
}
