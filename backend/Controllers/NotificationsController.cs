using MediFlow.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Security.Claims;

namespace MediFlow.Api.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly AppDbContext _db;
    public NotificationsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetMine()
    {
        var userId = GetUserId();
        var notifications = await _db.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(50)
            .Select(n => new { n.Id, n.Title, n.Message, n.Type, n.IsRead, n.CreatedAt })
            .ToListAsync();
        return Ok(notifications);
    }

    [HttpPost("{id}/read")]
    public async Task<IActionResult> MarkRead(int id)
    {
        var userId = GetUserId();
        var n = await _db.Notifications.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
        if (n == null) return NotFound();
        n.IsRead = true;
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("read-all")]
    public async Task<IActionResult> MarkAllRead()
    {
        var userId = GetUserId();
        await _db.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true));
        return Ok();
    }

    private int GetUserId()
    {
        var claim = User.FindFirst("userId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value, CultureInfo.InvariantCulture) : 0;
    }
}
