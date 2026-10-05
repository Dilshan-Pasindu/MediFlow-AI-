using MediFlow.Api.Data;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace MediFlow.Api.Services;

/// <summary>
/// Health check that probes the active AppDbContext database connection.
/// Ensures container and deployment health monitors reflect true database connectivity.
/// </summary>
public class DatabaseHealthCheck : IHealthCheck
{
    private readonly AppDbContext _db;

    public DatabaseHealthCheck(AppDbContext db)
    {
        _db = db;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var canConnect = await _db.Database.CanConnectAsync(cancellationToken);
            return canConnect
                ? HealthCheckResult.Healthy("Database connection is healthy.")
                : HealthCheckResult.Unhealthy("Database connection failed: CanConnect returned false.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy($"Database connection exception: {ex.Message}");
        }
    }
}
