using System.Security.Claims;
using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using MediFlow.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly AppDbContext _db;
    private readonly ISupabaseUserResolver _supabaseResolver;

    public AuthController(
        AuthService authService,
        AppDbContext db,
        ISupabaseUserResolver supabaseResolver)
    {
        _authService = authService;
        _db = db;
        _supabaseResolver = supabaseResolver;
    }

    /// <summary>
    /// Register a new patient account.
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Login with email and password. Returns a JWT token.
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Login or Register with Google account. Returns a JWT token.
    /// </summary>
    [HttpPost("google")]
    public async Task<ActionResult<AuthResponse>> Google([FromBody] GoogleAuthRequest request)
    {
        try
        {
            var result = await _authService.GoogleAuthAsync(request);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Synchronize or provision the authenticated Supabase user profile into PostgreSQL.
    /// Expects a valid Supabase JWT in the Authorization header.
    /// </summary>
    [Authorize]
    [HttpPost("sync")]
    public async Task<ActionResult<AuthResponse>> SyncUser([FromBody] SupabaseSyncRequest? request)
    {
        var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value
            ?? User.FindFirst("supabaseId")?.Value;

        if (string.IsNullOrWhiteSpace(sub))
            return Unauthorized(new { message = "Supabase user ID ('sub') not found in token." });

        var email = User.FindFirst(ClaimTypes.Email)?.Value
            ?? User.FindFirst("email")?.Value
            ?? $"{sub}@supabase.local";

        var fullName = request?.FullName
            ?? User.FindFirst(ClaimTypes.Name)?.Value
            ?? User.FindFirst("name")?.Value
            ?? User.FindFirst("full_name")?.Value
            ?? email.Split('@')[0];

        var phone = request?.PhoneNumber
            ?? User.FindFirst("phone")?.Value
            ?? User.FindFirst("phone_number")?.Value
            ?? string.Empty;

        var roleStr = request?.Role
            ?? User.FindFirst(ClaimTypes.Role)?.Value
            ?? User.FindFirst("role")?.Value;

        var role = UserRole.Patient;
        if (!string.IsNullOrWhiteSpace(roleStr) && Enum.TryParse<UserRole>(roleStr, true, out var parsedRole))
        {
            role = parsedRole;
        }

        var user = await _supabaseResolver.SyncSupabaseUserAsync(sub, email, fullName, phone, role);

        // Get active raw JWT token from header
        var authHeader = Request.Headers.Authorization.ToString();
        var rawToken = authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
            ? authHeader["Bearer ".Length..].Trim()
            : string.Empty;

        return Ok(new AuthResponse(
            user.Id,
            user.FullName,
            user.Email,
            user.Role.ToString(),
            rawToken,
            DateTime.UtcNow.AddHours(24)
        ));
    }

    /// <summary>
    /// Retrieve current authenticated user profile, mapped patient/doctor ID, and roles.
    /// </summary>
    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserProfileDto>> GetCurrentUser()
    {
        var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value
            ?? User.FindFirst("supabaseId")?.Value;

        var userIdClaim = User.FindFirst("userId")?.Value;
        User? user = null;

        if (int.TryParse(userIdClaim, out var uid))
        {
            user = await _db.Users.FirstOrDefaultAsync(u => u.Id == uid);
        }

        if (user == null && !string.IsNullOrWhiteSpace(sub))
        {
            user = await _db.Users.FirstOrDefaultAsync(u => u.SupabaseId == sub);
        }

        if (user == null)
            return Unauthorized(new { message = "User not found or not mapped in database." });

        int? patientId = null;
        if (user.Role == UserRole.Patient)
        {
            var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == user.Id || (p.SupabaseId != null && p.SupabaseId == user.SupabaseId));
            patientId = patient?.Id;
        }

        int? doctorId = null;
        if (user.Role == UserRole.Doctor)
        {
            var doctor = await _db.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
            doctorId = doctor?.Id;
        }

        return Ok(new UserProfileDto(
            user.Id,
            user.SupabaseId,
            user.FullName,
            user.Email,
            user.Role.ToString(),
            user.PhoneNumber,
            patientId,
            doctorId
        ));
    }
}

