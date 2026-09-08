namespace MediFlow.Api.Models;

/// <summary>
/// Patient's symptom submission — sent to the Specialist Recommendation Agent.
/// Owned by Member 1.
/// </summary>
public class SymptomSubmission
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string SymptomsText { get; set; } = string.Empty;   // Free-text from patient
    public string? Duration { get; set; }                       // e.g. "3 days", "2 weeks"
    public string? Severity { get; set; }                       // e.g. "Mild", "Moderate", "Severe"
    public string? RecommendedSpecialty { get; set; }          // AI output — specialty name
    public decimal? RecommendationConfidence { get; set; }     // AI output — e.g. 0.91
    public string? AgentExplanation { get; set; }              // AI output — explanation text
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Patient Patient { get; set; } = null!;
}
