namespace MediFlow.Api.Models;

public class Medicine
{
    public int Id { get; set; }
    public string MedicineName { get; set; } = string.Empty;
    public string GenericName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // e.g., Gastro, Pain, Antibiotics
    public string UnitOfMeasure { get; set; } = string.Empty; // e.g., Tablet, Bottle, Tube
    public bool IsActive { get; set; } = true;

    public ICollection<InventoryItem> InventoryItems { get; set; } = new List<InventoryItem>();
}
