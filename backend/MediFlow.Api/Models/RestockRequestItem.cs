namespace MediFlow.Api.Models;

public class RestockRequestItem
{
    public int Id { get; set; }

    public int RestockRequestId { get; set; }
    public RestockRequest? RestockRequest { get; set; }

    public int MedicineId { get; set; }
    public Medicine? Medicine { get; set; }

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal SubTotal { get; set; }

    /// <summary>Batch number assigned when supplier confirms. Used for InventoryBatch on receipt.</summary>
    public string? BatchNumber { get; set; }
    
    /// <summary>Expiry date provided by supplier (populated when status moves to Dispatched).</summary>
    public DateTime? ExpiryDate { get; set; }
}
