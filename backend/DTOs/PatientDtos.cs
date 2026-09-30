namespace MediFlow.Api.DTOs;

// ─── Patient DTOs ─────────────────────────────────────────────────────────────

public record UpdatePatientRequest(
    string? FullName = null,
    string? PhoneNumber = null,
    DateOnly? DateOfBirth = null,
    string? Gender = null,
    string? Address = null,
    string? BloodGroup = null,
    string? Allergies = null
);

public class SystemCheckItemDto
{
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = "PASSED";
    public string Detail { get; set; } = string.Empty;
}

public class SystemCheckerResultDto
{
    public string Status { get; set; } = "PASSED";
    public List<SystemCheckItemDto> Checks { get; set; } = new();
    public string? CheckedAt { get; set; }
}

public class SpecialistRecommendationDto
{
    public string RecommendedSpecialty { get; set; } = string.Empty;
    public double ConfidenceScore { get; set; }
    public string Rationale { get; set; } = string.Empty;
    public List<string> SuggestedActions { get; set; } = new();
    public string? AlternativeSpecialty { get; set; }
    public double? AlternativeConfidence { get; set; }
    public SystemCheckerResultDto? SystemChecker { get; set; }
}
