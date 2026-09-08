using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using Xunit;

namespace MediFlow.Tests;

public class AuthTests
{
    [Fact]
    public void NewUser_DefaultValues_AreCorrect()
    {
        // Arrange & Act
        var user = new User
        {
            FullName = "Dr. John Doe",
            Email = "john.doe@mediflow.ai",
            Role = UserRole.Doctor
        };

        // Assert
        Assert.True(user.IsActive);
        Assert.Equal(UserRole.Doctor, user.Role);
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
    public void LoginRequest_Fields_SetProperly()
    {
        var request = new LoginRequest
        {
            Email = "patient@mediflow.ai",
            Password = "SecurePassword123!"
        };

        Assert.Equal("patient@mediflow.ai", request.Email);
        Assert.Equal("SecurePassword123!", request.Password);
    }
}
