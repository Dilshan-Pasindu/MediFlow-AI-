namespace MediFlow.Api.Models;

public class Notification
{
    public int Id { get; set; }
    public int UserId { get; set; }          // recipient user id
    public string Title { get; set; } = "";
    public string Message { get; set; } = "";
    public bool IsRead { get; set; } = false;
    public string Type { get; set; } = "info"; // info | warning | success
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
}
