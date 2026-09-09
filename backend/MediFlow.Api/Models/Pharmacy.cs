namespace MediFlow.Api.Models;

public class Pharmacy
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    
    // Owner of the pharmacy (User with Role = PharmacyOwner)
    public int OwnerId { get; set; }
    public User? Owner { get; set; }

    public ICollection<InventoryItem> InventoryItems { get; set; } = new List<InventoryItem>();
    public ICollection<RestockRequest> RestockRequests { get; set; } = new List<RestockRequest>();
}
