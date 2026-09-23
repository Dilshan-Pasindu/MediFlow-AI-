using System.Net.Http.Json;
using System.Text.Json;
using MediFlow.Api.DTOs;

namespace MediFlow.Api.Services;

/// <summary>
/// Raised when the AI microservice is unreachable or returns an unexpected error.
/// The caller should treat this as "unable to verify safety" and require manual
/// pharmacist review — never assume safe-to-dispense on failure.
/// </summary>
public sealed class AiServiceUnavailableException : Exception
{
    public AiServiceUnavailableException(string message, Exception? inner = null)
        : base(message, inner) { }
}

/// <summary>
/// Typed HTTP client that calls the MediFlow Python AI microservice.
/// Registered via IHttpClientFactory with the named client "AiService".
///
/// Owned by Member 3 — E-Prescription &amp; Medicine Ordering.
/// </summary>
public class AiServiceClient : IAiServiceClient
{
    private readonly HttpClient _http;
    private readonly ILogger<AiServiceClient> _logger;

    // JSON options: snake_case keys come from Python, so we use case-insensitive reading.
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public AiServiceClient(IHttpClientFactory httpClientFactory, ILogger<AiServiceClient> logger)
    {
        _http = httpClientFactory.CreateClient("AiService");
        _logger = logger;
    }

    /// <summary>
    /// POSTs to <c>/api/ai/medication-check</c> on the Python AI microservice
    /// and returns the deserialized result.
    /// </summary>
    /// <exception cref="AiServiceUnavailableException">
    /// Thrown on network failure or unexpected HTTP status — the caller must
    /// never silently assume safe-to-dispense when this exception is raised.
    /// </exception>
    public virtual async Task<MedicationCheckResultDto> CheckMedicationSafetyAsync(
        List<string> medications,
        string? patientAllergies,
        int? pharmacyId,
        int? patientAge,
        List<string>? outOfStockMedications)
    {
        // Build the snake_case payload that the Python service expects
        var payload = new
        {
            medications,
            patient_allergies = patientAllergies,
            pharmacy_id = pharmacyId,
            patient_age = patientAge,
            out_of_stock_medications = outOfStockMedications ?? new List<string>()
        };

        try
        {
            _logger.LogInformation(
                "Calling AI medication-check for {Count} medication(s).", medications.Count);

            var response = await _http.PostAsJsonAsync("/api/ai/medication-check", payload);

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                _logger.LogError(
                    "AI service returned HTTP {Status}: {Body}",
                    (int)response.StatusCode, body);

                throw new AiServiceUnavailableException(
                    $"AI medication-check returned HTTP {(int)response.StatusCode}. " +
                    "Manual pharmacist review is required before dispensing.");
            }

            var result = await response.Content.ReadFromJsonAsync<MedicationCheckResultDto>(_jsonOptions);

            if (result is null)
                throw new AiServiceUnavailableException(
                    "AI service returned an empty response. Manual pharmacist review is required.");

            _logger.LogInformation(
                "AI medication-check completed. SafeToDispense={Safe}, Score={Score}.",
                result.SafeToDispense, result.SafetyScore);

            return result;
        }
        catch (AiServiceUnavailableException)
        {
            throw; // re-throw without wrapping
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Network error contacting AI service.");
            throw new AiServiceUnavailableException(
                "Could not reach the AI medication-check service. " +
                "Ensure the Python AI microservice is running. Manual review required.", ex);
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogError(ex, "AI service request timed out.");
            throw new AiServiceUnavailableException(
                "AI medication-check request timed out. Manual pharmacist review is required.", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error calling AI service.");
            throw new AiServiceUnavailableException(
                $"Unexpected error from AI service: {ex.Message}. Manual review required.", ex);
        }
    }
}
