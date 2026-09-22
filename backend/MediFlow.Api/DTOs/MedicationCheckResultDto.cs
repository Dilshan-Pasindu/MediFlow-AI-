using System.Text.Json.Serialization;

namespace MediFlow.Api.DTOs;

// ─── Nested DTOs (match Python schema exactly via JsonPropertyName) ───────────

/// <summary>Mirrors the Python <c>DrugInteraction</c> Pydantic model.</summary>
public sealed record DrugInteractionDto(
    [property: JsonPropertyName("drug_pair")]    List<string> DrugPair,
    [property: JsonPropertyName("severity")]     string Severity,
    [property: JsonPropertyName("description")]  string Description,
    [property: JsonPropertyName("recommendation")] string Recommendation
);

/// <summary>Mirrors the Python <c>AlternativeDrug</c> Pydantic model.</summary>
public sealed record AlternativeDrugDto(
    [property: JsonPropertyName("original_drug")]    string OriginalDrug,
    [property: JsonPropertyName("alternative_drug")] string AlternativeDrug,
    [property: JsonPropertyName("reason")]           string Reason,
    [property: JsonPropertyName("dosage_guidance")]  string DosageGuidance
);

// ─── Top-level result DTO ──────────────────────────────────────────────────────

/// <summary>
/// Mirrors the Python <c>MedicationCheckResult</c> Pydantic model.
/// All properties use <c>[JsonPropertyName]</c> to map the snake_case
/// JSON keys returned by the AI microservice to PascalCase C# names.
/// </summary>
public sealed record MedicationCheckResultDto(
    [property: JsonPropertyName("safe_to_dispense")]  bool SafeToDispense,
    [property: JsonPropertyName("safety_score")]      int SafetyScore,
    [property: JsonPropertyName("interactions")]      List<DrugInteractionDto> Interactions,
    [property: JsonPropertyName("allergy_warnings")]  List<string> AllergyWarnings,
    [property: JsonPropertyName("dosage_warnings")]   List<string> DosageWarnings,
    [property: JsonPropertyName("alternatives")]      List<AlternativeDrugDto> Alternatives,
    [property: JsonPropertyName("summary")]           string Summary
);

// ─── Request / Response DTOs for the new controller endpoints ─────────────────

/// <summary>Request body for POST /api/prescriptions/{id}/acknowledge-warning.</summary>
public sealed record AcknowledgeWarningRequestDto(
    int LogId,
    string? OverrideNote
);

/// <summary>
/// Response returned by POST /api/prescriptions/{id}/screen-interactions.
/// Contains the full AI result plus the IDs of the newly-created
/// DrugInteractionLog rows that require pharmacist acknowledgment.
/// </summary>
public sealed record ScreenInteractionsResponseDto(
    MedicationCheckResultDto Result,
    List<int> WarningLogIds
);
