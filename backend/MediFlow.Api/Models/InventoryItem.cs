namespace MediFlow.Api.Models;

public class InventoryItem
{
    public int Id { get; set; }
    public int PharmacyId { get; set; }
    public Pharmacy? Pharmacy { get; set; }

    public int MedicineId { get; set; }
    public Medicine? Medicine { get; set; }

    // Aggregated stock level from all active batches
    public int CurrentStock { get; set; }
    public int MinStockLevel { get; set; }
    public decimal UnitPrice { get; set; }

    public ICollection<InventoryBatch> Batches { get; set; } = new List<InventoryBatch>();
    public ICollection<InventoryTransaction> Transactions { get; set; } = new List<InventoryTransaction>();
}
