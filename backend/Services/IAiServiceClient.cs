using MediFlow.Api.DTOs;

namespace MediFlow.Api.Services;

public interface IAiServiceClient
{
    Task<MedicationCheckResultDto> CheckMedicationSafetyAsync(
        List<string> medications,
        string? patientAllergies,
        int? pharmacyId,
        int? patientAge,
        List<string>? outOfStockMedications);

    Task<SpecialistRecommendationDto?> RecommendSpecialistAsync(
        string symptoms,
        string? severity = null,
        string? duration = null);
}
