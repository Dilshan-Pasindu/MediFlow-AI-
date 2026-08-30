using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    // ── Register ──────────────────────────────────────────────────────────────

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, UserRole role = UserRole.Patient)
    {
        // Check for duplicate email
        if (await _db.Users.AnyAsync(u => u.Email == request.Email))
            throw new InvalidOperationException("A user with this email already exists.");

        // Create User
        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email.ToLower().Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            PhoneNumber = request.PhoneNumber,
            Role = role,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);

        // If role is Patient, also create a Patient profile row
        if (role == UserRole.Patient)
        {
            // SaveChanges first to get the User Id
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
        }

        await _db.SaveChangesAsync();

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
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email.ToLower().Trim());

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

    // ── JWT Token Generation ──────────────────────────────────────────────────

    private (string Token, DateTime ExpiresAt) GenerateJwtToken(User user)
    {
        var key = _config["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT Key is not configured.");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("userId", user.Id.ToString()),
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
