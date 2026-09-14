namespace MediFlow.Api.DTOs;

// ─── Medicine DTOs ──────────────────────────────────────────────────────────

public record MedicineDto(
    int Id,
    string MedicineName,
    string GenericName,
    string Category,
    string UnitOfMeasure,
    bool IsActive
);

public record CreateMedicineDto(
    string MedicineName,
    string GenericName,
    string Category,
    string UnitOfMeasure
);

/// <summary>
/// Creates a Medicine (or links an existing one), InventoryItem, and an optional initial InventoryBatch.
/// Rule: If InitialStock > 0, BatchNumber and ExpiryDate are required.
/// </summary>
public record CreateMedicineWithInventoryDto(
    // Medicine fields
    string MedicineName,
    string GenericName,
    string Category,
    string UnitOfMeasure,
    // InventoryItem fields
    int MinStockLevel,
    decimal UnitPrice,
    // Initial stock (0 = no batch created)
    int InitialStock,
    // Required when InitialStock > 0
    string? BatchNumber,
    DateTime? ExpiryDate,
    string? BatchNotes
);

// ─── Inventory DTOs ──────────────────────────────────────────────────────────

public record InventoryItemDto(
    int Id,
    int PharmacyId,
    int MedicineId,
    string MedicineName,
    string GenericName,
    string Category,
    string UnitOfMeasure,
    int CurrentStock,
    int MinStockLevel,
    decimal UnitPrice,
    string StockStatus,    // OK | Low | Critical | OutOfStock
    List<InventoryBatchDto> Batches
);

/// <summary>
/// Editable fields for an existing InventoryItem.
/// StockAdjustment is a signed delta applied to CurrentStock (0 = no change).
/// Positive values add stock, negative values remove it.
/// An Adjustment transaction is written whenever StockAdjustment != 0.
/// </summary>
public record UpdateInventoryItemDto(
    int MinStockLevel,
    decimal UnitPrice,
    int StockAdjustment,   // signed delta: +N or -N (0 = no change)
    string? AdjustmentReason  // written to transaction Notes
);

public record InventoryBatchDto(
    int Id,
    string BatchNumber,
    int Quantity,
    DateTime ExpiryDate,
    DateTime ReceivedDate,
    bool IsExpired,
    bool IsExpiringSoon,       // within 60 days
    int DaysUntilExpiry = 0,   // automated days calculation
    string ExpiryStatus = "Good", // Good | ExpiringSoon | Critical | Expired
    bool IsCriticalExpiry = false // within 30 days
);

public record CreateInventoryBatchDto(
    string BatchNumber,
    int Quantity,
    DateTime ExpiryDate,
    string? Notes = null
);

public record UpdateBatchExpiryDto(
    DateTime ExpiryDate,
    string? Notes = null
);

public record InventoryListResponse(
    List<InventoryItemDto> Items,
    int TotalCount,
    int LowStockCount,
    int CriticalCount,
    int OutOfStockCount
);

// ─── Restock Request DTOs ────────────────────────────────────────────────────

public record CreateRestockRequestDto(
    int SupplierProfileId,
    string? Notes,
    List<CreateRestockRequestItemDto> Items,
    int? PharmacyId = null
);

public record CreateRestockRequestItemDto(
    int MedicineId,
    int Quantity,
    decimal UnitPrice
);

public record UpdateRestockStatusDto(
    string Status,          // Approved | Rejected | Dispatched
    string? ResponseNote,
    List<UpdateRestockItemBatchDto>? ItemBatches  // Provided by supplier when Dispatching
);

public record UpdateRestockItemBatchDto(
    int RestockRequestItemId,
    string BatchNumber,
    DateTime ExpiryDate
);

public record ReceiveRestockDto(
    string? Notes
);

public record RestockRequestDto(
    int Id,
    int PharmacyId,
    string PharmacyName,
    int SupplierProfileId,
    string SupplierName,
    string Status,
    decimal TotalAmount,
    string? Notes,
    string? SupplierResponseNote,
    DateTime? ReceivedAt,
    DateTime RequestedAt,
    DateTime UpdatedAt,
    List<RestockRequestItemDto> Items
);

public record RestockRequestItemDto(
    int Id,
    int MedicineId,
    string MedicineName,
    int Quantity,
    decimal UnitPrice,
    decimal SubTotal,
    string? BatchNumber,
    DateTime? ExpiryDate
);

// ─── Restock Recommendation DTO (Agent Context) ──────────────────────────────

public record RestockRecommendationDto(
    int MedicineId,
    string MedicineName,
    string Category,
    int CurrentStock,
    int MinStockLevel,
    decimal DemandRate,         // units/day (30-day average)
    double DaysUntilStockOut,   // CurrentStock / DemandRate
    int RecommendedRestockQty,  // (SafetyDays * DemandRate) - CurrentStock
    string Urgency,             // Critical | High | Medium | Low
    string Reason
);

public record RestockRecommendationResponse(
    int PharmacyId,
    DateTime GeneratedAt,
    List<RestockRecommendationDto> Recommendations,
    // Agent context data — structured for the Inventory Intelligence Agent
    InventoryAgentContextDto AgentContext
);

public record InventoryAgentContextDto(
    int PharmacyId,
    string PharmacyName,
    DateTime ContextGeneratedAt,
    List<InventoryItemAgentContextDto> Items
);

public record InventoryItemAgentContextDto(
    int MedicineId,
    string MedicineName,
    string Category,
    int CurrentStock,
    int MinStockLevel,
    decimal UnitPrice,
    decimal DemandRateLast30Days,
    int TotalDispensedLast30Days,
    int TotalRestockedLast30Days,
    double DaysUntilStockOut,
    List<ExpiringBatchDto> ExpiringBatches
);

public record ExpiringBatchDto(
    string BatchNumber,
    int Quantity,
    DateTime ExpiryDate,
    int DaysUntilExpiry
);

// ─── Supplier DTOs ───────────────────────────────────────────────────────────

public record SupplierProfileDto(
    int Id,
    int UserId,
    string CompanyName,
    string ContactEmail,
    string ContactPhone,
    string Address,
    bool IsActive
);

// ─── Pharmacy DTOs ───────────────────────────────────────────────────────────

public record PharmacyDto(
    int Id,
    string Name,
    string Location,
    string ContactNumber,
    int OwnerId
);
