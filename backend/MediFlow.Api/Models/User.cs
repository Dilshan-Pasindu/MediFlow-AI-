namespace MediFlow.Api.Models;

/// <summary>
/// Shared User entity — used by all roles (Patient, Doctor, Receptionist, Pharmacist, etc.)
/// Owned by Member 2 (auth), but referenced by all members' entities.
/// </summary>
public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum UserRole
{
    Patient,
    Doctor,
    Receptionist,
    Pharmacist,
    PharmacyOwner,
    Supplier,
    Administrator
}
