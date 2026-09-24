namespace MediFlow.Api.Models;

public class InventoryBatch
{
    public int Id { get; set; }
    public int InventoryItemId { get; set; }
    public InventoryItem? InventoryItem { get; set; }

    public string BatchNumber { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public DateTime ExpiryDate { get; set; }
    public DateTime ReceivedDate { get; set; } = DateTime.UtcNow;
}
