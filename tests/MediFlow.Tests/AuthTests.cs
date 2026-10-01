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

public class AuthTests
{
    private (AppDbContext db, AuthService authService) CreateAuthService()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        var db = new AppDbContext(options);

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

        var authService = new AuthService(db, configuration, mockHttpClientFactory.Object, mockLogger.Object);
        return (db, authService);
    }

    [Fact]
    public void NewUser_DefaultValues_AreCorrect()
    {
        var user = new User
        {
            FullName = "Dr. John Doe",
            Email = "john.doe@mediflow.ai",
            Role = UserRole.Doctor
        };

        Assert.True(user.IsActive);
        Assert.Equal(UserRole.Doctor, user.Role);
        Assert.Equal(VerificationStatus.Approved, user.VerificationStatus);
        Assert.Equal("john.doe@mediflow.ai", user.Email);
        Assert.True(user.CreatedAt <= DateTime.UtcNow);
    }

    [Theory]
    [InlineData(UserRole.Patient)]
    [InlineData(UserRole.Doctor)]
    [InlineData(UserRole.Receptionist)]
    [InlineData(UserRole.Pharmacist)]
    [InlineData(UserRole.PharmacyOwner)]
    [InlineData(UserRole.Supplier)]
    [InlineData(UserRole.Administrator)]
    public void UserRole_ContainsAllSevenProjectRoles(UserRole role)
    {
        Assert.True(Enum.IsDefined(typeof(UserRole), role));
    }

    [Fact]
    public async Task StaffRegistration_Doctor_CreatesPendingAccountWithRegistrationNumber()
    {
        var (db, authService) = CreateAuthService();

        var request = new StaffRegisterRequest(
            FullName: "Dr. Nimal Silva",
            Email: "nimal.silva@mediflow.lk",
            Password: "Password@123",
            PhoneNumber: "+94771112233",
            Role: "Doctor",
            RegistrationNumber: "SLMC-98765"
        );

        var response = await authService.RegisterStaffAsync(request);

        Assert.Equal("Pending", response.VerificationStatus);
        Assert.Equal("Doctor", response.Role);
        Assert.Contains("pending administrator verification", response.Message);

        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == "nimal.silva@mediflow.lk");
        Assert.NotNull(user);
        Assert.Equal(VerificationStatus.Pending, user.VerificationStatus);
        Assert.Equal("SLMC-98765", user.RegistrationNumber);

        // Associated Doctor entity should exist and be inactive
        var doctor = await db.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
        Assert.NotNull(doctor);
        Assert.False(doctor.IsActive);
        Assert.Equal("SLMC-98765", doctor.RegistrationNumber);
    }

    [Fact]
    public async Task StaffRegistration_Doctor_MissingRegNo_ThrowsArgumentException()
    {
        var (_, authService) = CreateAuthService();

        var request = new StaffRegisterRequest(
            FullName: "Dr. No Reg",
            Email: "noreg@mediflow.lk",
            Password: "Password@123",
            PhoneNumber: "+94771112233",
            Role: "Doctor",
            RegistrationNumber: ""
        );

        var ex = await Assert.ThrowsAsync<ArgumentException>(() => authService.RegisterStaffAsync(request));
        Assert.Contains("Registration number (Reg No.) is mandatory", ex.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task StaffRegistration_Doctor_DuplicateRegNo_ThrowsInvalidOperationException()
    {
        var (_, authService) = CreateAuthService();

        var request1 = new StaffRegisterRequest(
            FullName: "Dr. First Doctor",
            Email: "first.doc@mediflow.lk",
            Password: "Password@123",
            PhoneNumber: "+94771112233",
            Role: "Doctor",
            RegistrationNumber: "SLMC-55555"
        );
        await authService.RegisterStaffAsync(request1);

        var request2 = new StaffRegisterRequest(
            FullName: "Dr. Second Doctor",
            Email: "second.doc@mediflow.lk",
            Password: "Password@123",
            PhoneNumber: "+94772223344",
            Role: "Doctor",
            RegistrationNumber: "SLMC-55555"
        );

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => authService.RegisterStaffAsync(request2));
        Assert.Contains("registration number already exists", ex.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Theory]
    [InlineData("Administrator")]
    [InlineData("Admin")]
    [InlineData("Patient")]
    public async Task StaffRegistration_DisallowedRoles_ThrowsArgumentException(string role)
    {
        var (_, authService) = CreateAuthService();

        var request = new StaffRegisterRequest(
            FullName: "Malicious User",
            Email: $"hacker_{role}@mediflow.lk",
            Password: "Password@123",
            PhoneNumber: "+94779998877",
            Role: role
        );

        await Assert.ThrowsAsync<ArgumentException>(() => authService.RegisterStaffAsync(request));
    }

    [Fact]
    public async Task StaffLogin_WhenPending_ThrowsUnauthorizedAccessExceptionWithHelpCenterMessage()
    {
        var (db, authService) = CreateAuthService();

        var register = new StaffRegisterRequest(
            FullName: "Sunil Pharmacist",
            Email: "sunil.pharm@mediflow.lk",
            Password: "Staff@123",
            PhoneNumber: "+94773334455",
            Role: "Pharmacist"
        );
        await authService.RegisterStaffAsync(register);

        var login = new LoginRequest("sunil.pharm@mediflow.lk", "Staff@123", LoginType: "Staff");
        var ex = await Assert.ThrowsAsync<UnauthorizedAccessException>(() => authService.LoginAsync(login));

        Assert.Contains("Your account is awaiting administrator verification", ex.Message);
        Assert.Contains("MediFlow Help Center", ex.Message);
    }

    [Fact]
    public async Task StaffLogin_WhenRejected_ThrowsUnauthorizedAccessExceptionWithReason()
    {
        var (db, authService) = CreateAuthService();

        var register = new StaffRegisterRequest(
            FullName: "Rejected Pharmacist",
            Email: "rejected@mediflow.lk",
            Password: "Staff@123",
            PhoneNumber: "+94773334455",
            Role: "Pharmacist"
        );
        var regResp = await authService.RegisterStaffAsync(register);

        var user = await db.Users.FindAsync(regResp.UserId);
        Assert.NotNull(user);
        user.VerificationStatus = VerificationStatus.Rejected;
        user.RejectionReason = "Unverified pharmacy license documentation.";
        await db.SaveChangesAsync();

        var login = new LoginRequest("rejected@mediflow.lk", "Staff@123", LoginType: "Staff");
        var ex = await Assert.ThrowsAsync<UnauthorizedAccessException>(() => authService.LoginAsync(login));

        Assert.Contains("Your registration was rejected by the administrator", ex.Message);
        Assert.Contains("Unverified pharmacy license documentation", ex.Message);
    }

    [Fact]
    public async Task StaffLogin_WhenApproved_Succeeds()
    {
        var (db, authService) = CreateAuthService();

        var register = new StaffRegisterRequest(
            FullName: "Approved Pharmacist",
            Email: "approved@mediflow.lk",
            Password: "Staff@123",
            PhoneNumber: "+94773334455",
            Role: "Pharmacist"
        );
        var regResp = await authService.RegisterStaffAsync(register);

        var user = await db.Users.FindAsync(regResp.UserId);
        Assert.NotNull(user);
        user.VerificationStatus = VerificationStatus.Approved;
        await db.SaveChangesAsync();

        var login = new LoginRequest("approved@mediflow.lk", "Staff@123", LoginType: "Staff");
        var authResp = await authService.LoginAsync(login);

        Assert.NotNull(authResp);
        Assert.Equal("Pharmacist", authResp.Role);
        Assert.Equal("Approved", authResp.VerificationStatus);
        Assert.NotEmpty(authResp.Token);
    }

    [Fact]
    public async Task PortalSeparation_PatientAttemptingStaffLogin_IsBlocked()
    {
        var (_, authService) = CreateAuthService();

        var patientReq = new RegisterRequest(
            FullName: "Kasun Patient",
            Email: "kasun.patient@mediflow.lk",
            Password: "Patient@123",
            PhoneNumber: "+94771234567"
        );
        await authService.RegisterAsync(patientReq);

        var staffLogin = new LoginRequest("kasun.patient@mediflow.lk", "Patient@123", LoginType: "Staff");
        var ex = await Assert.ThrowsAsync<UnauthorizedAccessException>(() => authService.LoginAsync(staffLogin));

        Assert.Contains("Patients must use the Patient Login portal", ex.Message);
    }

    [Fact]
    public async Task PortalSeparation_StaffAttemptingPatientLogin_IsBlocked()
    {
        var (db, authService) = CreateAuthService();

        var register = new StaffRegisterRequest(
            FullName: "Dr. Kamal",
            Email: "dr.kamal@mediflow.lk",
            Password: "Doctor@123",
            PhoneNumber: "+94774445566",
            Role: "Doctor",
            RegistrationNumber: "SLMC-77777"
        );
        var regResp = await authService.RegisterStaffAsync(register);

        var user = await db.Users.FindAsync(regResp.UserId);
        Assert.NotNull(user);
        user.VerificationStatus = VerificationStatus.Approved;
        await db.SaveChangesAsync();

        var patientLogin = new LoginRequest("dr.kamal@mediflow.lk", "Doctor@123", LoginType: "Patient");
        var ex = await Assert.ThrowsAsync<UnauthorizedAccessException>(() => authService.LoginAsync(patientLogin));

        Assert.Contains("Staff members must use the Staff Login portal", ex.Message);
    }
}
