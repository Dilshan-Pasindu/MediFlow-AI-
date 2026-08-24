namespace MediFlow.Api.Models;

/// <summary>
/// Join table — links a Doctor to one or more Specialties
/// </summary>
public class DoctorSpecialty
{
    public int Id { get; set; }
    public int DoctorId { get; set; }
    public int SpecialtyId { get; set; }
    public bool IsPrimary { get; set; } = false;  // Primary specialty vs. secondary
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Doctor Doctor { get; set; } = null!;
    public Specialty Specialty { get; set; } = null!;
}
