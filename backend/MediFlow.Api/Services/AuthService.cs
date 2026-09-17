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
/// Handles user registration, login, and JWT token generation.
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

    // ── Register ──────────────────────────────────────────────────────────────

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // Check for duplicate email
        var normalizedEmail = request.Email.Trim().ToLower(CultureInfo.InvariantCulture);
        if (await _db.Users.AnyAsync(u => u.Email == normalizedEmail))
            throw new InvalidOperationException("A user with this email already exists.");

        // Parse role or default to Patient
        var parsedRole = UserRole.Patient;
        if (!string.IsNullOrWhiteSpace(request.Role) && Enum.TryParse<UserRole>(request.Role, true, out var roleEnum))
        {
            parsedRole = roleEnum;
        }

        // Create User
        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = normalizedEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            PhoneNumber = request.PhoneNumber.Trim(),
            Role = parsedRole,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        // If role is Patient, also create a Patient profile row
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
            token.ExpiresAt
        );
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLower(CultureInfo.InvariantCulture);
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("This account has been deactivated.");

        var token = GenerateJwtToken(user);
        return new AuthResponse(
            user.Id,
            user.FullName,
            user.Email,
            user.Role.ToString(),
            token.Token,
            token.ExpiresAt
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
            // Register new account via Google
            var parsedRole = UserRole.Patient;
            if (!string.IsNullOrWhiteSpace(request.Role) && Enum.TryParse<UserRole>(request.Role, true, out var roleEnum))
            {
                parsedRole = roleEnum;
            }

            user = new User
            {
                FullName = name,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString("N")),
                PhoneNumber = string.Empty,
                Role = parsedRole,
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
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _db.Doctors.Add(doctor);
                await _db.SaveChangesAsync();
            }
        }
        else
        {
            if (!user.IsActive)
                throw new UnauthorizedAccessException("This account has been deactivated.");
        }

        var token = GenerateJwtToken(user);
        return new AuthResponse(
            user.Id,
            user.FullName,
            user.Email,
            user.Role.ToString(),
            token.Token,
            token.ExpiresAt
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
