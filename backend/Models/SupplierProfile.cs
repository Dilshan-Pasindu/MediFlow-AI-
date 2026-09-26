namespace MediFlow.Api.Models;

public class SupplierProfile
{
    public int Id { get; set; }
    
    // Linked to User with Role = Supplier
    public int UserId { get; set; }
    public User? User { get; set; }

    public string CompanyName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public ICollection<RestockRequest> RestockRequests { get; set; } = new List<RestockRequest>();
}
