namespace MediFlow.Api.Models;

public class Doctor
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Qualifications { get; set; } = string.Empty;
    public int ExperienceYears { get; set; }
    public decimal ConsultationFee { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Extended profile fields
    public string? ProfilePhoto { get; set; }
    public string? SubSpecialty { get; set; }
    public string? HospitalClinic { get; set; }
    public string? Languages { get; set; }
    public string? Location { get; set; }
    public string? MbbsUniversity { get; set; }
    public string? PhdUniversity { get; set; }
    public string? OtherQualifications { get; set; }
    public string? Certifications { get; set; }
    public int? Age { get; set; }
    public string? RegistrationNumber { get; set; }

    // Navigation properties
    public ICollection<DoctorSpecialty> DoctorSpecialties { get; set; } = new List<DoctorSpecialty>();
    public ICollection<DoctorAvailability> Availabilities { get; set; } = new List<DoctorAvailability>();
    public ICollection<DoctorRating> Ratings { get; set; } = new List<DoctorRating>();
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<DoctorLeave> Leaves { get; set; } = new List<DoctorLeave>();
}
