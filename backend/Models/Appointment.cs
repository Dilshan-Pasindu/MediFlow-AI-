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
    public DateTime? ConsultationStartedAt { get; set; }
    public DateTime? ConsultationEndedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Patient Patient { get; set; } = null!;
    public Doctor Doctor { get; set; } = null!;
    public AppointmentPayment? Payment { get; set; }
}

public enum AppointmentStatus
{
    // ── Legacy / backward-compatible states ──────────────────────────────────
    Pending,            // Booked but payment not initiated yet
    PaymentSubmitted,   // Payment initiated — awaiting backend verification
    Confirmed,          // Receptionist verified payment, assigned appointment number
    InConsultation,     // Doctor actively consulting the appointment
    Completed,          // Doctor completed the consultation
    Cancelled,          // Cancelled by patient, doctor, or receptionist
    NoShow,             // Patient did not attend

    // ── Extended payment sandbox states ──────────────────────────────────────
    PaymentPending,     // Checkout session opened but not yet completed
    PaymentVerified,    // Backend has independently verified payment with provider
    PaymentFailed,      // Payment failed / expired / cancelled at provider
    WaitingForReceptionist,    // Payment verified; awaiting receptionist decision
    ReceptionistApproved,      // Receptionist approved the appointment
    ReceptionistRejected,      // Receptionist rejected — automatic refund initiated
    PatientCancelled,          // Patient cancelled before approval
    RefundRequested,           // Patient applied for refund (after PatientCancelled)
}
