namespace MediFlow.Api.Models;

/// <summary>
/// Appointment booking record. 
/// Created by Patient, verified by Receptionist (who assigns AppointmentNumber), 
/// then accessible by Doctor.
/// Owned by Member 1.
/// </summary>
public class Appointment
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
    public DateTime AppointmentDateTime { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
    
    // Set by Receptionist after verifying payment — e.g. "APP-2026-1024"
    public string? AppointmentNumber { get; set; }
    
    public string? Notes { get; set; }
    public decimal? Fee { get; set; }           // Consultation fee at time of booking
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Patient Patient { get; set; } = null!;
    public Doctor Doctor { get; set; } = null!;
    public AppointmentPayment? Payment { get; set; }
}

public enum AppointmentStatus
{
    Pending,            // Booked but payment not submitted
    PaymentSubmitted,   // Patient submitted payment, awaiting receptionist verification
    Confirmed,          // Receptionist verified payment, assigned appointment number
    Completed,          // Doctor completed the consultation
    Cancelled,          // Cancelled by patient, doctor, or receptionist
    NoShow              // Patient did not attend
}
