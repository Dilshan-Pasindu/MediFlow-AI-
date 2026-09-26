namespace MediFlow.Api.Models;

public enum TransactionType
{
    Restock,    // Stock was received from supplier
    Dispense,   // Stock was dispensed (from prescription order)
    Adjustment, // Manual stock correction
    Expired     // Stock removed due to expiry
}

/// <summary>
/// Immutable audit log for every stock movement against an InventoryItem.
/// Forms the demand history consumed by the Inventory Intelligence Agent.
/// </summary>
public class InventoryTransaction
{
    public int Id { get; set; }

    public int InventoryItemId { get; set; }
    public InventoryItem? InventoryItem { get; set; }

    public TransactionType TransactionType { get; set; }

    /// <summary>
    /// Positive = stock added (Restock). Negative = stock removed (Dispense, Expired, Adjustment).
    /// </summary>
    public int QuantityChanged { get; set; }

    /// <summary>Stock level after this transaction (snapshot for fast reporting).</summary>
    public int StockAfter { get; set; }

    public DateTime TransactionDate { get; set; } = DateTime.UtcNow;

    /// <summary>Reference to the restock request that triggered this transaction (nullable).</summary>
    public int? RestockRequestId { get; set; }

    public string? Notes { get; set; }
}
