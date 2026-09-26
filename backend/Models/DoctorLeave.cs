using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MediFlow.Api.Models;

public class DoctorLeave
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int DoctorId { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [MaxLength(500)]
    public string? Reason { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    [ForeignKey("DoctorId")]
    public Doctor? Doctor { get; set; }
}
