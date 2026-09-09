namespace MediFlow.Api.Models;

/// <summary>
/// Explicit state machine: Pending → Approved → Dispatched → Delivered → Completed
///                                          └────────────────────────────► Rejected
/// </summary>
public enum RestockRequestStatus
{
    Pending,    // Created by Pharmacy Owner (awaiting supplier)
    Approved,   // Supplier has confirmed the order
    Rejected,   // Supplier has rejected the order
    Dispatched, // Supplier has dispatched the goods
    Delivered,  // Goods arrived at pharmacy (awaiting pharmacist confirmation)
    Completed   // Pharmacist confirmed receipt → inventory updated
}

public class RestockRequest
{
    public int Id { get; set; }

    public int PharmacyId { get; set; }
    public Pharmacy? Pharmacy { get; set; }

    /// <summary>FK to SupplierProfile (not User) for proper supplier profile lookup.</summary>
    public int SupplierProfileId { get; set; }
    public SupplierProfile? SupplierProfile { get; set; }

    public RestockRequestStatus Status { get; set; } = RestockRequestStatus.Pending;
    public decimal TotalAmount { get; set; }

    /// <summary>Optional note from the pharmacy owner when creating the request.</summary>
    public string? Notes { get; set; }
    
    /// <summary>Reason provided by supplier when approving or rejecting.</summary>
    public string? SupplierResponseNote { get; set; }
    
    /// <summary>Timestamp when pharmacy owner confirmed receipt of stock (triggers inventory update).</summary>
    public DateTime? ReceivedAt { get; set; }

    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<RestockRequestItem> Items { get; set; } = new List<RestockRequestItem>();
}
