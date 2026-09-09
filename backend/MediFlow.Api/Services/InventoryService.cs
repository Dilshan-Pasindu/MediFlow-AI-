using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MediFlow.Api.Services;

/// <summary>
/// Core business logic for pharmacy inventory management.
/// Provides structured context data consumed by the Inventory Intelligence Agent.
/// </summary>
public class InventoryService
{
    private readonly AppDbContext _db;
    private const int SafetyDays = 45;           // Target buffer days for restock calc
    private const int DemandWindowDays = 30;     // Rolling window for demand calculation
    private const int ExpiryWarningDays = 60;    // Warn on batches expiring within this range

    public InventoryService(AppDbContext db) => _db = db;

    // ── Stock status helpers ──────────────────────────────────────────────────

    public static string GetStockStatus(int current, int min)
    {
        if (current == 0) return "OutOfStock";
        var pct = (double)current / min * 100;
        if (pct <= 15) return "Critical";
        if (pct <= 50) return "Low";
        return "OK";
    }

    // ── Inventory queries ─────────────────────────────────────────────────────

    public async Task<InventoryListResponse> GetInventoryAsync(
        int pharmacyId,
        string? search = null,
        string? category = null,
        string? stockFilter = null,
        int page = 1,
        int pageSize = 20)
    {
        var query = _db.InventoryItems
            .Include(i => i.Medicine)
            .Include(i => i.Batches)
            .Where(i => i.PharmacyId == pharmacyId);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(i =>
                i.Medicine!.MedicineName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                i.Medicine.GenericName.Contains(search, StringComparison.OrdinalIgnoreCase));

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(i => i.Medicine!.Category == category);

        var all = await query.ToListAsync();

        // Apply stock status filter in memory (calculated field)
        if (!string.IsNullOrWhiteSpace(stockFilter))
            all = all.Where(i => GetStockStatus(i.CurrentStock, i.MinStockLevel) == stockFilter).ToList();

        var total = all.Count;
        var paged = all.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        var items = paged.Select(MapToDto).ToList();
        return new InventoryListResponse(
            items,
            TotalCount: total,
            LowStockCount: all.Count(i => GetStockStatus(i.CurrentStock, i.MinStockLevel) is "Low" or "Critical"),
            CriticalCount: all.Count(i => GetStockStatus(i.CurrentStock, i.MinStockLevel) == "Critical"),
            OutOfStockCount: all.Count(i => i.CurrentStock == 0)
        );
    }

    public async Task<List<InventoryItemDto>> GetLowStockAsync(int? pharmacyId = null)
    {
        var query = _db.InventoryItems
            .Include(i => i.Medicine)
            .Include(i => i.Batches)
            .Where(i => i.CurrentStock < i.MinStockLevel);

        if (pharmacyId.HasValue)
            query = query.Where(i => i.PharmacyId == pharmacyId.Value);

        var items = await query.ToListAsync();
        return items.Select(MapToDto).ToList();
    }

    // ── Restock recommendation engine (agent foundation) ─────────────────────

    /// <summary>
    /// Generates demand-driven restock recommendations and returns structured
    /// agent context for the Inventory Intelligence Agent to consume.
    /// </summary>
    public async Task<RestockRecommendationResponse> GenerateRestockRecommendationsAsync(int pharmacyId)
    {
        var pharmacy = await _db.Pharmacies
            .FirstOrDefaultAsync(p => p.Id == pharmacyId)
            ?? throw new KeyNotFoundException($"Pharmacy {pharmacyId} not found.");

        var cutoff = DateTime.UtcNow.AddDays(-DemandWindowDays);
        var now = DateTime.UtcNow;

        var inventoryItems = await _db.InventoryItems
            .Include(i => i.Medicine)
            .Include(i => i.Batches)
            .Include(i => i.Transactions.Where(t => t.TransactionDate >= cutoff))
            .Where(i => i.PharmacyId == pharmacyId)
            .ToListAsync();

        var recommendations = new List<RestockRecommendationDto>();
        var agentItems = new List<InventoryItemAgentContextDto>();

        foreach (var item in inventoryItems)
        {
            var dispenseTransactions = item.Transactions
                .Where(t => t.TransactionType == TransactionType.Dispense)
                .ToList();

            var restockTransactions = item.Transactions
                .Where(t => t.TransactionType == TransactionType.Restock)
                .ToList();

            int totalDispensed = Math.Abs(dispenseTransactions.Sum(t => t.QuantityChanged));
            int totalRestocked = restockTransactions.Sum(t => t.QuantityChanged);
            decimal demandRate = (decimal)totalDispensed / DemandWindowDays;
            double daysUntilStockOut = demandRate > 0
                ? (double)(item.CurrentStock / demandRate)
                : double.MaxValue;

            // Expiring batches
            var expiringBatches = item.Batches
                .Where(b => b.ExpiryDate <= now.AddDays(ExpiryWarningDays))
                .Select(b => new ExpiringBatchDto(
                    b.BatchNumber,
                    b.Quantity,
                    b.ExpiryDate,
                    (int)(b.ExpiryDate - now).TotalDays))
                .ToList();

            // Agent context item — complete structured data
            agentItems.Add(new InventoryItemAgentContextDto(
                MedicineId: item.MedicineId,
                MedicineName: item.Medicine!.MedicineName,
                Category: item.Medicine.Category,
                CurrentStock: item.CurrentStock,
                MinStockLevel: item.MinStockLevel,
                UnitPrice: item.UnitPrice,
                DemandRateLast30Days: demandRate,
                TotalDispensedLast30Days: totalDispensed,
                TotalRestockedLast30Days: totalRestocked,
                DaysUntilStockOut: daysUntilStockOut == double.MaxValue ? 999 : Math.Round(daysUntilStockOut, 1),
                ExpiringBatches: expiringBatches
            ));

            // Only recommend restock for items that actually need it
            bool needsRestock = item.CurrentStock < item.MinStockLevel ||
                                 daysUntilStockOut < SafetyDays;
            if (!needsRestock) continue;

            int recommendedQty = demandRate > 0
                ? Math.Max(0, (int)(SafetyDays * demandRate) - item.CurrentStock)
                : item.MinStockLevel - item.CurrentStock;

            // Guarantee a minimum meaningful order
            if (recommendedQty < 10) recommendedQty = item.MinStockLevel;

            string urgency = item.CurrentStock == 0 ? "Critical"
                : daysUntilStockOut < 7 ? "Critical"
                : daysUntilStockOut < 15 ? "High"
                : daysUntilStockOut < 30 ? "Medium"
                : "Low";

            string reason = item.CurrentStock == 0
                ? $"OUT OF STOCK. Demand rate: {demandRate:F1} units/day."
                : $"Stock: {item.CurrentStock} units. Demand rate: {demandRate:F1} units/day. Estimated stock-out in {daysUntilStockOut:F0} days.";

            recommendations.Add(new RestockRecommendationDto(
                MedicineId: item.MedicineId,
                MedicineName: item.Medicine!.MedicineName,
                Category: item.Medicine.Category,
                CurrentStock: item.CurrentStock,
                MinStockLevel: item.MinStockLevel,
                DemandRate: demandRate,
                DaysUntilStockOut: daysUntilStockOut == double.MaxValue ? 999 : Math.Round(daysUntilStockOut, 1),
                RecommendedRestockQty: recommendedQty,
                Urgency: urgency,
                Reason: reason
            ));
        }

        recommendations = recommendations
            .OrderBy(r => r.Urgency switch { "Critical" => 0, "High" => 1, "Medium" => 2, _ => 3 })
            .ThenBy(r => r.DaysUntilStockOut)
            .ToList();

        return new RestockRecommendationResponse(
            PharmacyId: pharmacyId,
            GeneratedAt: now,
            Recommendations: recommendations,
            AgentContext: new InventoryAgentContextDto(
                PharmacyId: pharmacyId,
                PharmacyName: pharmacy.Name,
                ContextGeneratedAt: now,
                Items: agentItems
            )
        );
    }

    // ── Restock request operations ────────────────────────────────────────────

    public async Task<RestockRequest> CreateRestockRequestAsync(int pharmacyId, CreateRestockRequestDto dto)
    {
        var pharmacy = await _db.Pharmacies.FindAsync(pharmacyId)
            ?? throw new KeyNotFoundException("Pharmacy not found.");
        var supplier = await _db.SupplierProfiles.FindAsync(dto.SupplierProfileId)
            ?? throw new KeyNotFoundException("Supplier not found.");

        decimal total = dto.Items.Sum(i => i.Quantity * i.UnitPrice);

        var request = new RestockRequest
        {
            PharmacyId = pharmacyId,
            SupplierProfileId = dto.SupplierProfileId,
            Status = RestockRequestStatus.Pending,
            TotalAmount = total,
            Notes = dto.Notes,
            RequestedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.RestockRequests.Add(request);
        await _db.SaveChangesAsync();

        foreach (var item in dto.Items)
        {
            _db.RestockRequestItems.Add(new RestockRequestItem
            {
                RestockRequestId = request.Id,
                MedicineId = item.MedicineId,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                SubTotal = item.Quantity * item.UnitPrice
            });
        }
        await _db.SaveChangesAsync();
        return request;
    }

    /// <summary>
    /// Supplier workflow: Pending → Approved → Dispatched (with batch info).
    /// </summary>
    public async Task<RestockRequest> UpdateRestockStatusAsync(int requestId, UpdateRestockStatusDto dto, int actingUserId)
    {
        var request = await _db.RestockRequests
            .Include(r => r.Items)
            .FirstOrDefaultAsync(r => r.Id == requestId)
            ?? throw new KeyNotFoundException("Restock request not found.");

        if (!Enum.TryParse<RestockRequestStatus>(dto.Status, out var newStatus))
            throw new ArgumentException($"Invalid status: {dto.Status}");

        // Validate state machine transitions
        var validTransitions = new Dictionary<RestockRequestStatus, RestockRequestStatus[]>
        {
            [RestockRequestStatus.Pending]    = [RestockRequestStatus.Approved, RestockRequestStatus.Rejected],
            [RestockRequestStatus.Approved]   = [RestockRequestStatus.Dispatched],
            [RestockRequestStatus.Dispatched] = [RestockRequestStatus.Delivered],
        };

        if (!validTransitions.TryGetValue(request.Status, out var allowed) || !allowed.Contains(newStatus))
            throw new InvalidOperationException(
                $"Cannot transition from {request.Status} to {newStatus}.");

        request.Status = newStatus;
        request.SupplierResponseNote = dto.ResponseNote;
        request.UpdatedAt = DateTime.UtcNow;

        // When supplier dispatches: attach batch numbers and expiry dates to items
        if (newStatus == RestockRequestStatus.Dispatched && dto.ItemBatches != null)
        {
            foreach (var batchInfo in dto.ItemBatches)
            {
                var item = request.Items.FirstOrDefault(i => i.Id == batchInfo.RestockRequestItemId);
                if (item != null)
                {
                    item.BatchNumber = batchInfo.BatchNumber;
                    item.ExpiryDate = batchInfo.ExpiryDate;
                }
            }
        }

        await _db.SaveChangesAsync();
        return request;
    }

    /// <summary>
    /// Pharmacy confirmation: Delivered → Completed.
    /// Inventory is updated ONLY here — after pharmacist explicitly confirms receipt.
    /// </summary>
    public async Task<RestockRequest> ConfirmReceiptAsync(int requestId, ReceiveRestockDto dto)
    {
        var request = await _db.RestockRequests
            .Include(r => r.Items)
                .ThenInclude(i => i.Medicine)
            .FirstOrDefaultAsync(r => r.Id == requestId)
            ?? throw new KeyNotFoundException("Restock request not found.");

        if (request.Status != RestockRequestStatus.Delivered && request.Status != RestockRequestStatus.Dispatched)
            throw new InvalidOperationException(
                $"Stock can only be received when status is 'Delivered' or 'Dispatched'. Current status: {request.Status}.");

        var now = DateTime.UtcNow;

        foreach (var requestItem in request.Items)
        {
            // Find or validate the inventory item
            var invItem = await _db.InventoryItems
                .FirstOrDefaultAsync(i => i.PharmacyId == request.PharmacyId && i.MedicineId == requestItem.MedicineId);

            if (invItem == null) continue;

            // Update aggregate stock
            int oldStock = invItem.CurrentStock;
            invItem.CurrentStock += requestItem.Quantity;

            // Create new inventory batch (batch number and expiry from supplier)
            var batchNumber = requestItem.BatchNumber
                ?? $"RR{request.Id}-MED{requestItem.MedicineId}-{now:yyyyMMdd}";
            var expiryDate = requestItem.ExpiryDate ?? now.AddMonths(12);

            _db.InventoryBatches.Add(new InventoryBatch
            {
                InventoryItemId = invItem.Id,
                BatchNumber = batchNumber,
                Quantity = requestItem.Quantity,
                ExpiryDate = expiryDate,
                ReceivedDate = now
            });

            // Audit trail
            _db.InventoryTransactions.Add(new InventoryTransaction
            {
                InventoryItemId = invItem.Id,
                TransactionType = TransactionType.Restock,
                QuantityChanged = requestItem.Quantity,
                StockAfter = invItem.CurrentStock,
                TransactionDate = now,
                RestockRequestId = request.Id,
                Notes = $"Received from restock request #{request.Id}. Batch: {batchNumber}. {dto.Notes}"
            });
        }

        request.Status = RestockRequestStatus.Completed;
        request.ReceivedAt = now;
        request.UpdatedAt = now;

        await _db.SaveChangesAsync();
        return request;
    }

    // ── Mappers ───────────────────────────────────────────────────────────────

    public static InventoryItemDto MapToDto(InventoryItem i)
    {
        var now = DateTime.UtcNow;
        return new InventoryItemDto(
            Id: i.Id,
            PharmacyId: i.PharmacyId,
            MedicineId: i.MedicineId,
            MedicineName: i.Medicine?.MedicineName ?? "",
            GenericName: i.Medicine?.GenericName ?? "",
            Category: i.Medicine?.Category ?? "",
            UnitOfMeasure: i.Medicine?.UnitOfMeasure ?? "",
            CurrentStock: i.CurrentStock,
            MinStockLevel: i.MinStockLevel,
            UnitPrice: i.UnitPrice,
            StockStatus: GetStockStatus(i.CurrentStock, i.MinStockLevel),
            Batches: i.Batches.Select(b => new InventoryBatchDto(
                Id: b.Id,
                BatchNumber: b.BatchNumber,
                Quantity: b.Quantity,
                ExpiryDate: b.ExpiryDate,
                ReceivedDate: b.ReceivedDate,
                IsExpired: b.ExpiryDate <= now,
                IsExpiringSoon: b.ExpiryDate > now && b.ExpiryDate <= now.AddDays(60)
            )).ToList()
        );
    }

    public static RestockRequestDto MapRequestToDto(RestockRequest r) =>
        new(
            Id: r.Id,
            PharmacyId: r.PharmacyId,
            PharmacyName: r.Pharmacy?.Name ?? "",
            SupplierProfileId: r.SupplierProfileId,
            SupplierName: r.SupplierProfile?.CompanyName ?? "",
            Status: r.Status.ToString(),
            TotalAmount: r.TotalAmount,
            Notes: r.Notes,
            SupplierResponseNote: r.SupplierResponseNote,
            ReceivedAt: r.ReceivedAt,
            RequestedAt: r.RequestedAt,
            UpdatedAt: r.UpdatedAt,
            Items: r.Items.Select(i => new RestockRequestItemDto(
                Id: i.Id,
                MedicineId: i.MedicineId,
                MedicineName: i.Medicine?.MedicineName ?? "",
                Quantity: i.Quantity,
                UnitPrice: i.UnitPrice,
                SubTotal: i.SubTotal,
                BatchNumber: i.BatchNumber,
                ExpiryDate: i.ExpiryDate
            )).ToList()
        );
}
