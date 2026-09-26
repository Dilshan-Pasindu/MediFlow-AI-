using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using MediFlow.Api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace MediFlow.Tests;

public class TokenAuthenticationIntegrationTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly AuthService _authService;

    public TokenAuthenticationIntegrationTests()
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
            { "Jwt:ExpiryMinutes", "60" }
        };

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemoryConfig)
            .Build();

        var mockHttpClientFactory = new Mock<IHttpClientFactory>();
        var mockLogger = new Mock<ILogger<AuthService>>();

        _authService = new AuthService(_db, configuration, mockHttpClientFactory.Object, mockLogger.Object);
    }

    [Theory]
    [InlineData("Patient")]
    [InlineData("Doctor")]
    [InlineData("Receptionist")]
    [InlineData("Pharmacist")]
    [InlineData("PharmacyOwner")]
    [InlineData("Supplier")]
    [InlineData("Administrator")]
    public async Task RegisterAndLogin_GeneratesValidJwtTokenWithCorrectRoleClaim(string role)
    {
        // Arrange
        var email = $"user_{role.ToLowerInvariant()}@mediflow.ai";
        var password = "StrongPassword@123";
        var registerRequest = new RegisterRequest(
            FullName: $"Test {role}",
            Email: email,
            Password: password,
            PhoneNumber: "+1555123456",
            Role: role
        );

        // Act - Register
        var registerResponse = await _authService.RegisterAsync(registerRequest);
        Assert.NotNull(registerResponse);
        Assert.NotEmpty(registerResponse.Token);
        Assert.Equal(role, registerResponse.Role);

        // Act - Login
        var loginRequest = new LoginRequest(email, password);
        var loginResponse = await _authService.LoginAsync(loginRequest);
        Assert.NotNull(loginResponse);
        Assert.NotEmpty(loginResponse.Token);
        Assert.Equal(role, loginResponse.Role);

        // Verify Token Claims
        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtToken = tokenHandler.ReadJwtToken(loginResponse.Token);

        Assert.Equal("MediFlowApi", jwtToken.Issuer);
        Assert.Contains("MediFlowClients", jwtToken.Audiences);

        var roleClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role || c.Type == "role");
        Assert.NotNull(roleClaim);
        Assert.Equal(role, roleClaim.Value);

        var emailClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email || c.Type == "email");
        Assert.NotNull(emailClaim);
        Assert.Equal(email, emailClaim.Value);

        var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "userId");
        Assert.NotNull(userIdClaim);
        Assert.True(int.TryParse(userIdClaim.Value, out _));
    }

    [Fact]
    public async Task Register_DuplicateEmail_ThrowsInvalidOperationException()
    {
        // Arrange
        var registerRequest = new RegisterRequest(
            FullName: "Existing User",
            Email: "duplicate@mediflow.ai",
            Password: "Password123!",
            PhoneNumber: "+1555987654",
            Role: "Patient"
        );

        await _authService.RegisterAsync(registerRequest);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _authService.RegisterAsync(registerRequest));
    }

    [Fact]
    public async Task Login_InvalidPassword_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var registerRequest = new RegisterRequest(
            FullName: "Secure User",
            Email: "secure@mediflow.ai",
            Password: "CorrectPassword123!",
            PhoneNumber: "+1555000111",
            Role: "Doctor"
        );
        await _authService.RegisterAsync(registerRequest);

        // Act & Assert
        var loginRequest = new LoginRequest("secure@mediflow.ai", "WrongPassword!");
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _authService.LoginAsync(loginRequest));
    }

    public void Dispose()
    {
        _db.Database.EnsureDeleted();
        _db.Dispose();
    }
}
