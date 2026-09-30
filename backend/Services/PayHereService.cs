using System.Security.Cryptography;
using System.Text;
using MediFlow.Api.Models;
using MediFlow.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace MediFlow.Api.Services;

/// <summary>
/// PayHere Sandbox payment gateway service.
/// Handles payment initiation, server-side verification, and refund processing.
///
/// PayHere Sandbox Credentials (never exposed to frontend):
///   Merchant ID  — from PAYHERE_MERCHANT_ID environment variable
///   Merchant Secret — from PAYHERE_MERCHANT_SECRET environment variable
///   Sandbox Base URL — https://sandbox.payhere.lk
///
/// PayHere documentation: https://support.payhere.lk/api-&-sdk/payhere-checkout
/// </summary>
public class PayHereService
{
    private readonly IConfiguration _config;
    private readonly ILogger<PayHereService> _logger;
    private readonly HttpClient _http;

    // PayHere sandbox endpoints
    private const string SandboxBaseUrl = "https://sandbox.payhere.lk";
    private const string PaymentVerifyUrl = "https://sandbox.payhere.lk/merchant/v1/payment/search";
    private const string RefundUrl = "https://sandbox.payhere.lk/merchant/v1/payment/refund";

    public PayHereService(IConfiguration config, ILogger<PayHereService> logger, IHttpClientFactory httpFactory)
    {
        _config = config;
        _logger = logger;
        _http = httpFactory.CreateClient("PayHere");
    }

    public string MerchantId =>
        _config["PayHere:MerchantId"] ?? _config["PAYHERE_MERCHANT_ID"] ?? "1227208";

    private string MerchantSecret =>
        _config["PayHere:MerchantSecret"] ?? _config["PAYHERE_MERCHANT_SECRET"] ?? "MzYwNDcyMzIyMzIwOTg5MTMxNDIzNTU5MTY1MzExMzQ4NTk0";

    /// <summary>
    /// Generates a PayHere checkout hash for the payment form.
    /// hash = MD5(merchant_id + order_id + amount_formatted + currency + MD5(merchant_secret).toUpperCase())
    /// </summary>
    public string GenerateCheckoutHash(string orderId, decimal amount, string currency = "LKR")
    {
        var amountFormatted = amount.ToString("F2");
        var secretHash = Md5Upper(MerchantSecret);
        var raw = $"{MerchantId}{orderId}{amountFormatted}{currency}{secretHash}";
        return Md5Upper(raw);
    }

    /// <summary>
    /// Generates a unique order ID for a payment.
    /// Format: MF-{appointmentId}-{timestamp}
    /// </summary>
    public static string GenerateOrderId(int appointmentId)
    {
        var ts = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        return $"MF-{appointmentId}-{ts}";
    }

    /// <summary>
    /// Validates the PayHere notify POST callback.
    /// PayHere sends a server-to-server notification with a signature.
    /// md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + md5(merchant_secret).toUpperCase())
    /// </summary>
    public bool ValidateNotifyHash(
        string merchantId,
        string orderId,
        string payhereAmount,
        string payhereCurrency,
        string statusCode,
        string md5sig)
    {
        var secretHash = Md5Upper(MerchantSecret);
        var raw = $"{merchantId}{orderId}{payhereAmount}{payhereCurrency}{statusCode}{secretHash}";
        var expected = Md5Upper(raw);
        return string.Equals(expected, md5sig, StringComparison.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Server-side verification of a payment against PayHere API.
    /// Returns the payment status and details.
    /// </summary>
    public async Task<PayHerePaymentVerificationResult?> VerifyPaymentAsync(string paymentId, CancellationToken ct = default)
    {
        try
        {
            // Get OAuth token first (PayHere uses OAuth 2.0 for API calls)
            var accessToken = await GetAccessTokenAsync(ct);
            if (string.IsNullOrWhiteSpace(accessToken))
            {
                _logger.LogWarning("[PayHere] Failed to obtain access token for payment verification");
                return null;
            }

            using var request = new HttpRequestMessage(HttpMethod.Get,
                $"{PaymentVerifyUrl}?payment_id={paymentId}");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _http.SendAsync(request, ct);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("[PayHere] Verification call returned {Status}", response.StatusCode);
                return null;
            }

            var json = await response.Content.ReadAsStringAsync(ct);
            return ParseVerificationResponse(json);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[PayHere] VerifyPaymentAsync exception for payment {PaymentId}", paymentId);
            return null;
        }
    }

    /// <summary>
    /// Initiates a refund for a completed PayHere payment.
    /// </summary>
    public async Task<PayHereRefundResult?> InitiateRefundAsync(
        string paymentId,
        decimal amount,
        string description,
        CancellationToken ct = default)
    {
        try
        {
            var accessToken = await GetAccessTokenAsync(ct);
            if (string.IsNullOrWhiteSpace(accessToken))
            {
                _logger.LogWarning("[PayHere] Failed to obtain access token for refund");
                return new PayHereRefundResult { Success = false, ErrorMessage = "Could not obtain PayHere access token." };
            }

            var body = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["payment_id"] = paymentId,
                ["description"] = description,
            });

            using var request = new HttpRequestMessage(HttpMethod.Post, RefundUrl);
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            request.Content = body;

            var response = await _http.SendAsync(request, ct);
            var json = await response.Content.ReadAsStringAsync(ct);
            _logger.LogInformation("[PayHere] Refund response: {Status} {Body}", response.StatusCode, json);

            return ParseRefundResponse(json, response.IsSuccessStatusCode);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[PayHere] InitiateRefundAsync exception for payment {PaymentId}", paymentId);
            return new PayHereRefundResult { Success = false, ErrorMessage = ex.Message };
        }
    }

    // ── Private helpers ─────────────────────────────────────────────────────────

    private async Task<string?> GetAccessTokenAsync(CancellationToken ct)
    {
        // PayHere uses Basic Auth (merchantId:merchantSecret base64) for the token endpoint
        var credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{MerchantId}:{MerchantSecret}"));

        using var request = new HttpRequestMessage(HttpMethod.Post,
            $"{SandboxBaseUrl}/merchant/v1/oauth/token");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", credentials);
        request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["grant_type"] = "client_credentials",
        });

        var response = await _http.SendAsync(request, ct);
        if (!response.IsSuccessStatusCode)
            return null;

        var json = await response.Content.ReadAsStringAsync(ct);
        // Parse { "access_token": "...", "token_type": "Bearer", ... }
        using var doc = System.Text.Json.JsonDocument.Parse(json);
        return doc.RootElement.TryGetProperty("access_token", out var tok) ? tok.GetString() : null;
    }

    private static PayHerePaymentVerificationResult? ParseVerificationResponse(string json)
    {
        try
        {
            using var doc = System.Text.Json.JsonDocument.Parse(json);
            var root = doc.RootElement;

            // PayHere returns status 1 for success
            if (!root.TryGetProperty("data", out var data))
                return null;

            var payment = data.EnumerateArray().FirstOrDefault();
            return new PayHerePaymentVerificationResult
            {
                PaymentId = payment.TryGetProperty("payment_id", out var pid) ? pid.GetString() ?? "" : "",
                OrderId = payment.TryGetProperty("order_id", out var oid) ? oid.GetString() ?? "" : "",
                Status = payment.TryGetProperty("status", out var st) ? st.GetString() ?? "" : "",
                Amount = payment.TryGetProperty("payhere_amount", out var amt) ? amt.GetDecimal() : 0,
                Currency = payment.TryGetProperty("payhere_currency", out var cur) ? cur.GetString() ?? "LKR" : "LKR",
                PayerName = payment.TryGetProperty("payer_name", out var pn) ? pn.GetString() : null,
                PayerEmail = payment.TryGetProperty("payer_email", out var pe) ? pe.GetString() : null,
                RawJson = json,
            };
        }
        catch
        {
            return null;
        }
    }

    private static PayHereRefundResult ParseRefundResponse(string json, bool httpSuccess)
    {
        try
        {
            using var doc = System.Text.Json.JsonDocument.Parse(json);
            var root = doc.RootElement;
            var status = root.TryGetProperty("status", out var s) ? s.GetInt32() : 0;
            var msg = root.TryGetProperty("msg", out var m) ? m.GetString() : "";
            var refundId = root.TryGetProperty("data", out var d)
                ? (d.TryGetProperty("refund_id", out var rid) ? rid.GetString() : null)
                : null;

            return new PayHereRefundResult
            {
                Success = httpSuccess && status == 1,
                RefundId = refundId,
                Message = msg,
                ErrorMessage = status != 1 ? msg : null,
                RawJson = json,
            };
        }
        catch
        {
            return new PayHereRefundResult { Success = false, ErrorMessage = "Failed to parse refund response." };
        }
    }

    private static string Md5Upper(string input)
    {
        var bytes = MD5.HashData(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes).ToUpperInvariant();
    }
}

// ── Result DTOs ────────────────────────────────────────────────────────────────

public class PayHerePaymentVerificationResult
{
    public string PaymentId { get; set; } = string.Empty;
    public string OrderId { get; set; } = string.Empty;
    /// <summary>2 = Success, 0 = Pending, -1 = Cancelled, -2 = Failed, -3 = Charged Back</summary>
    public string Status { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "LKR";
    public string? PayerName { get; set; }
    public string? PayerEmail { get; set; }
    public string? RawJson { get; set; }

    public bool IsSuccessful => Status == "2";
}

public class PayHereRefundResult
{
    public bool Success { get; set; }
    public string? RefundId { get; set; }
    public string? Message { get; set; }
    public string? ErrorMessage { get; set; }
    public string? RawJson { get; set; }
}
