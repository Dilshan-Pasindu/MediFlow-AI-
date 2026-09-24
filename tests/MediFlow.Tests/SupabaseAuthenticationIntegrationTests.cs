using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MediFlow.Api.Controllers;
using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using MediFlow.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace MediFlow.Tests;

public class SupabaseAuthenticationIntegrationTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly SupabaseUserResolver _resolver;
    private readonly AuthService _authService;

    public SupabaseAuthenticationIntegrationTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);

        var inMemoryConfig = new Dictionary<string, string?>
        {
            { "Jwt:Key", "SuperSecretKeyForTestingMediFlowApiWith32CharsLong!" },
            { "Jwt:Issuer", "MediFlowApi" },
            { "Jwt:Audience", "MediFlowClients" },
            { "SUPABASE_JWT_SECRET", "SupabaseSecretKeyForTestingJWTValidation32Chars!" },
            { "SUPABASE_URL", "https://xyztestproject.supabase.co" }
        };

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemoryConfig)
            .Build();

        var mockLogger = new Mock<ILogger<SupabaseUserResolver>>();
        _resolver = new SupabaseUserResolver(_db, mockLogger.Object);

        var mockAuthLogger = new Mock<ILogger<AuthService>>();
        var mockHttpClientFactory = new Mock<IHttpClientFactory>();
        _authService = new AuthService(_db, configuration, mockHttpClientFactory.Object, mockAuthLogger.Object);
    }

    [Fact]
    public async Task SupabaseUserResolver_MapsSupabaseSubToInternalUserAndEnrichesClaims()
    {
        // Arrange: Existing user in database with SupabaseId
        var supabaseUuid = "a1b2c3d4-e5f6-47a8-b9c0-123456789abc";
        var user = new User
        {
            SupabaseId = supabaseUuid,
            FullName = "John Supabase",
            Email = "john.supabase@example.com",
            Role = UserRole.Patient,
            IsActive = true
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, supabaseUuid),
            new(JwtRegisteredClaimNames.Sub, supabaseUuid),
            new(ClaimTypes.Email, "john.supabase@example.com")
        };
        var identity = new ClaimsIdentity(claims, "Bearer");
        var principal = new ClaimsPrincipal(identity);

        // Act
        var resolvedUser = await _resolver.ResolveAndPopulateClaimsAsync(principal, _db);

        // Assert
        Assert.NotNull(resolvedUser);
        Assert.Equal(user.Id, resolvedUser.Id);
        Assert.Equal(supabaseUuid, resolvedUser.SupabaseId);

        // Check enriched claims
        Assert.True(principal.HasClaim("userId", user.Id.ToString()));
        Assert.True(principal.HasClaim(ClaimTypes.Role, "Patient"));
        Assert.True(principal.HasClaim("supabaseId", supabaseUuid));
    }

    [Fact]
    public async Task SupabaseUserResolver_ProvisionsNewPatientRecordForSupabasePatient()
    {
        // Arrange: A new Supabase user that does not exist in PostgreSQL yet
        var newSub = Guid.NewGuid().ToString();
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, newSub),
            new(ClaimTypes.Email, "new.patient@example.com"),
            new(ClaimTypes.Name, "Alice Cooper"),
            new("role", "Patient"),
            new("phone", "+94770001122")
        };
        var identity = new ClaimsIdentity(claims, "Bearer");
        var principal = new ClaimsPrincipal(identity);

        // Act
        var user = await _resolver.ResolveAndPopulateClaimsAsync(principal, _db);

        // Assert
        Assert.NotNull(user);
        Assert.Equal(newSub, user.SupabaseId);
        Assert.Equal("new.patient@example.com", user.Email);
        Assert.Equal("Alice Cooper", user.FullName);
        Assert.Equal(UserRole.Patient, user.Role);

        // Verify Patient profile record was created in PostgreSQL
        var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == user.Id);
        Assert.NotNull(patient);
        Assert.Equal(newSub, patient.SupabaseId);
        Assert.Equal("Alice Cooper", patient.FullName);
    }

    [Fact]
    public async Task SupabaseUserResolver_LinksExistingUserAccountByEmail()
    {
        // Arrange: Pre-seeded staff user with no SupabaseId
        var staff = new User
        {
            FullName = "Pre-seeded Doctor",
            Email = "doctor.seeded@mediflow.lk",
            Role = UserRole.Doctor,
            IsActive = true
        };
        _db.Users.Add(staff);
        await _db.SaveChangesAsync();

        var newSupabaseSub = Guid.NewGuid().ToString();
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, newSupabaseSub),
            new(ClaimTypes.Email, "doctor.seeded@mediflow.lk")
        };
        var identity = new ClaimsIdentity(claims, "Bearer");
        var principal = new ClaimsPrincipal(identity);

        // Act
        var resolved = await _resolver.ResolveAndPopulateClaimsAsync(principal, _db);

        // Assert
        Assert.NotNull(resolved);
        Assert.Equal(staff.Id, resolved.Id);
        Assert.Equal(newSupabaseSub, resolved.SupabaseId);

        var dbUser = await _db.Users.FindAsync(staff.Id);
        Assert.Equal(newSupabaseSub, dbUser!.SupabaseId);
    }

    [Fact]
    public async Task AuthController_SyncEndpoint_ReturnsAuthResponse()
    {
        // Arrange
        var controller = new AuthController(_authService, _db, _resolver);
        var sub = Guid.NewGuid().ToString();

        var httpContext = new DefaultHttpContext();
        httpContext.Request.Headers.Authorization = "Bearer test-supabase-access-token";
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, sub),
            new(ClaimTypes.Email, "sync.test@example.com"),
            new(ClaimTypes.Name, "Sync User")
        };
        httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(claims, "Bearer"));
        controller.ControllerContext = new ControllerContext { HttpContext = httpContext };

        var request = new SupabaseSyncRequest(
            FullName: "Sync User Updated",
            PhoneNumber: "+94779998877",
            Role: "Patient"
        );

        // Act
        var result = await controller.SyncUser(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var authResponse = Assert.IsType<AuthResponse>(okResult.Value);
        Assert.Equal("sync.test@example.com", authResponse.Email);
        Assert.Equal("Sync User Updated", authResponse.FullName);
        Assert.Equal("Patient", authResponse.Role);
        Assert.Equal("test-supabase-access-token", authResponse.Token);
    }

    [Fact]
    public async Task AuthController_MeEndpoint_ReturnsUserProfileDto()
    {
        // Arrange
        var sub = Guid.NewGuid().ToString();
        var user = new User
        {
            SupabaseId = sub,
            FullName = "Jane Profile",
            Email = "jane.profile@example.com",
            Role = UserRole.Patient,
            PhoneNumber = "+94771122334"
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var patient = new Patient
        {
            UserId = user.Id,
            SupabaseId = sub,
            FullName = user.FullName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber
        };
        _db.Patients.Add(patient);
        await _db.SaveChangesAsync();

        var controller = new AuthController(_authService, _db, _resolver);
        var httpContext = new DefaultHttpContext();
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, sub),
            new("userId", user.Id.ToString()),
            new(ClaimTypes.Role, "Patient")
        };
        httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(claims, "Bearer"));
        controller.ControllerContext = new ControllerContext { HttpContext = httpContext };

        // Act
        var result = await controller.GetCurrentUser();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var profile = Assert.IsType<UserProfileDto>(okResult.Value);
        Assert.Equal(user.Id, profile.UserId);
        Assert.Equal(sub, profile.SupabaseId);
        Assert.Equal(patient.Id, profile.PatientId);
        Assert.Equal("Patient", profile.Role);
    }

    public void Dispose()
    {
        _db.Dispose();
        GC.SuppressFinalize(this);
    }
}
