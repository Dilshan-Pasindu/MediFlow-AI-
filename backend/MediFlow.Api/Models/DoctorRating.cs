namespace MediFlow.Api.Models;

/// <summary>
/// Patient rating and review submitted after a completed appointment
/// </summary>
public class DoctorRating
{
    public int Id { get; set; }
    public int DoctorId { get; set; }
    public int PatientId { get; set; }
    public int AppointmentId { get; set; }    // Must have a completed appointment to rate
    public int Stars { get; set; }            // 1–5 stars
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Doctor Doctor { get; set; } = null!;
    public Appointment Appointment { get; set; } = null!;
}
