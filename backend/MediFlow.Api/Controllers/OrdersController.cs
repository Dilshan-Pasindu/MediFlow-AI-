using System.Globalization;
using System.Security.Claims;
using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediFlow.Api.Controllers;

/// <summary>
/// Medicine Order endpoints.
/// Owned by Member 3 — E-Prescription &amp; Medicine Ordering.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrdersController(AppDbContext db) => _db = db;

    // ─── Shared mapper (internal static so PharmacistController can reuse) ─

    internal static OrderDto ToOrderDto(MedicineOrder o)
    {
        var patientName = o.Patient?.FullName ?? "Walk-in Patient";
        var pharmacyName = o.Pharmacy?.Name ?? "Unknown Pharmacy";

        var appointmentNumber = o.Prescription?.Appointment?.AppointmentNumber;
        var doctorName = o.Prescription?.Doctor?.FullName;

        return new OrderDto(
            Id: o.Id,
            PrescriptionId: o.PrescriptionId,
            PatientId: o.PatientId,
            PatientName: patientName,
            PharmacyId: o.PharmacyId,
            PharmacyName: pharmacyName,
            AppointmentNumber: appointmentNumber,
            DoctorName: doctorName,
            Status: o.Status.ToString(),
            Items: o.Items.Select(i => new OrderItemDto(
                Id: i.Id,
                MedicineId: i.MedicineId,
                MedicineName: i.MedicineName,
                Dosage: i.Dosage,
                Quantity: i.Quantity,
                UnitPrice: i.UnitPrice,
                Subtotal: i.Subtotal
            )).ToList(),
            TotalAmount: o.TotalAmount,
            IsPaid: o.IsPaid,
            DeliveryAddress: o.DeliveryAddress,
            Notes: o.Notes,
            CreatedAt: o.CreatedAt.ToString("o", CultureInfo.InvariantCulture),
            UpdatedAt: o.UpdatedAt.ToString("o", CultureInfo.InvariantCulture),
            DispensedAt: o.DispensedAt?.ToString("o", CultureInfo.InvariantCulture)
        );
    }

    // ─── Helper ────────────────────────────────────────────────────────────

    private int? TryGetUserId()
    {
        var claim = User.FindFirst("userId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null && int.TryParse(claim.Value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var id)
            ? id : null;
    }

    private async Task<MedicineOrder?> LoadOrderAsync(int id) =>
        await _db.Orders
            .Include(o => o.Items)
            .Include(o => o.Patient)
            .Include(o => o.Pharmacy)
            .Include(o => o.Prescription)
                .ThenInclude(p => p!.Doctor)
            .Include(o => o.Prescription)
                .ThenInclude(p => p!.Appointment)
            .FirstOrDefaultAsync(o => o.Id == id);

    // ─── POST /api/orders ──────────────────────────────────────────────────

    /// <summary>
    /// Create a new medicine order. Only Pharmacists may call this.
    /// If PrescriptionId is supplied and no items are provided, copies the
    /// prescription's items as order items and marks the prescription Fulfilled.
    /// Unit prices are looked up from InventoryItem when not explicitly supplied.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Pharmacist")]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequestDto request)
    {
        var userId = TryGetUserId();
        if (userId == null) return Unauthorized();

        // Validate pharmacy exists
        var pharmacyExists = await _db.Pharmacies.AnyAsync(p => p.Id == request.PharmacyId);
        if (!pharmacyExists)
            return BadRequest(new { message = $"Pharmacy with ID {request.PharmacyId} not found." });

        // Optionally resolve prescription
        Prescription? prescription = null;
        if (request.PrescriptionId.HasValue)
        {
            prescription = await _db.Prescriptions
                .Include(p => p.Items)
                .FirstOrDefaultAsync(p => p.Id == request.PrescriptionId.Value);

            if (prescription == null)
                return NotFound(new { message = $"Prescription {request.PrescriptionId} not found." });
        }

        // Build order items — prefer caller-supplied list, fall back to prescription items
        var itemsSource = (request.Items != null && request.Items.Count > 0)
            ? request.Items
            : prescription?.Items.Select(pi => new CreateOrderItemDto(
                MedicineId: pi.MedicineId,
                MedicineName: pi.MedicineName,
                Dosage: pi.Dosage,
                Quantity: pi.Quantity,
                UnitPrice: null   // will look up below
            )).ToList();

        if (itemsSource == null || itemsSource.Count == 0)
            return BadRequest(new { message = "At least one order item is required." });

        var orderItems = new List<OrderItem>();
        decimal total = 0m;

        foreach (var item in itemsSource)
        {
            if (string.IsNullOrWhiteSpace(item.MedicineName))
                return BadRequest(new { message = "Medicine name is required for all order items." });

            if (item.Quantity <= 0)
                return BadRequest(new { message = $"Quantity for '{item.MedicineName}' must be greater than zero." });

            // Look up unit price from pharmacy inventory if not supplied
            decimal unitPrice = item.UnitPrice ?? 0m;
            if (unitPrice == 0m && item.MedicineId.HasValue)
            {
                var inv = await _db.InventoryItems
                    .FirstOrDefaultAsync(i => i.PharmacyId == request.PharmacyId && i.MedicineId == item.MedicineId.Value);
                unitPrice = inv?.UnitPrice ?? 0m;
            }

            var subtotal = unitPrice * item.Quantity;
            total += subtotal;

            orderItems.Add(new OrderItem
            {
                MedicineId = item.MedicineId,
                MedicineName = item.MedicineName,
                Dosage = item.Dosage,
                Quantity = item.Quantity,
                UnitPrice = unitPrice,
                Subtotal = subtotal
            });
        }

        var order = new MedicineOrder
        {
            PrescriptionId = request.PrescriptionId,
            PatientId = request.PatientId ?? prescription?.PatientId,
            PharmacyId = request.PharmacyId,
            PharmacistId = userId,
            Status = OrderStatus.Pending,
            TotalAmount = total,
            IsPaid = false,
            DeliveryAddress = request.DeliveryAddress,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        foreach (var oi in orderItems)
            order.Items.Add(oi);

        _db.Orders.Add(order);

        // Mark the source prescription as Fulfilled
        if (prescription != null)
        {
            prescription.Status = PrescriptionStatus.Fulfilled;
            prescription.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();

        // Reload with nav props for response
        var created = await LoadOrderAsync(order.Id);
        return Ok(ToOrderDto(created!));
    }

    // ─── GET /api/orders ───────────────────────────────────────────────────

    [HttpGet]
    [Authorize(Roles = "Pharmacist,Administrator")]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await _db.Orders
            .Include(o => o.Items)
            .Include(o => o.Patient)
            .Include(o => o.Pharmacy)
            .Include(o => o.Prescription)
                .ThenInclude(p => p!.Doctor)
            .Include(o => o.Prescription)
                .ThenInclude(p => p!.Appointment)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders.Select(ToOrderDto).ToList());
    }

    // ─── GET /api/orders/my ────────────────────────────────────────────────

    [HttpGet("my")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = TryGetUserId();
        if (userId == null) return Unauthorized();

        var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId.Value);
        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        var orders = await _db.Orders
            .Where(o => o.PatientId == patient.Id)
            .Include(o => o.Items)
            .Include(o => o.Patient)
            .Include(o => o.Pharmacy)
            .Include(o => o.Prescription)
                .ThenInclude(p => p!.Doctor)
            .Include(o => o.Prescription)
                .ThenInclude(p => p!.Appointment)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders.Select(ToOrderDto).ToList());
    }

    // ─── GET /api/orders/{id} ──────────────────────────────────────────────

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOrderById(int id)
    {
        var order = await LoadOrderAsync(id);
        if (order == null)
            return NotFound(new { message = $"Order {id} not found." });

        // Patients may only see their own orders
        var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
        if (roles.Contains("Patient"))
        {
            var userId = TryGetUserId();
            var patient = userId != null
                ? await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId.Value)
                : null;

            if (patient == null || order.PatientId != patient.Id)
                return Forbid();
        }

        return Ok(ToOrderDto(order));
    }

    // ─── PUT /api/orders/{id}/status ──────────────────────────────────────

    /// <summary>
    /// Advance or cancel the order status.
    /// Valid forward transitions: Pending → Confirmed → Preparing → Ready → Dispensed.
    /// Cancelled is allowed from any non-terminal state.
    /// </summary>
    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "Pharmacist")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null)
            return NotFound(new { message = $"Order {id} not found." });

        if (!Enum.TryParse<OrderStatus>(dto.Status, out var newStatus))
            return BadRequest(new { message = $"Invalid status '{dto.Status}'." });

        // Terminal states — cannot transition further
        if (order.Status is OrderStatus.Dispensed or OrderStatus.Cancelled)
            return BadRequest(new { message = $"Order is already in terminal state '{order.Status}'." });

        // Validate forward progression
        var validNext = order.Status switch
        {
            OrderStatus.Pending    => new[] { OrderStatus.Confirmed, OrderStatus.Cancelled },
            OrderStatus.Confirmed  => new[] { OrderStatus.Preparing, OrderStatus.Cancelled },
            OrderStatus.Preparing  => new[] { OrderStatus.Ready, OrderStatus.Cancelled },
            OrderStatus.Ready      => new[] { OrderStatus.Dispensed, OrderStatus.Cancelled },
            _                      => Array.Empty<OrderStatus>()
        };

        if (!validNext.Contains(newStatus))
            return BadRequest(new { message = $"Cannot transition from '{order.Status}' to '{newStatus}'." });

        order.Status = newStatus;
        order.UpdatedAt = DateTime.UtcNow;

        if (newStatus == OrderStatus.Dispensed)
            order.DispensedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var updated = await LoadOrderAsync(id);
        return Ok(ToOrderDto(updated!));
    }

    // ─── POST /api/orders/{id}/calculate-price ────────────────────────────

    /// <summary>
    /// Recompute each OrderItem's unit price from the pharmacy's current
    /// inventory pricing and update the order's TotalAmount.
    /// </summary>
    [HttpPost("{id:int}/calculate-price")]
    [Authorize(Roles = "Pharmacist")]
    public async Task<IActionResult> CalculatePrice(int id, [FromBody] CalculateOrderPriceDto dto)
    {
        var order = await _db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new { message = $"Order {id} not found." });

        decimal newTotal = 0m;

        foreach (var item in order.Items)
        {
            if (item.MedicineId.HasValue)
            {
                var inv = await _db.InventoryItems
                    .FirstOrDefaultAsync(i => i.PharmacyId == dto.PharmacyId && i.MedicineId == item.MedicineId.Value);

                if (inv != null)
                {
                    item.UnitPrice = inv.UnitPrice;
                    item.Subtotal = inv.UnitPrice * item.Quantity;
                }
            }
            newTotal += item.Subtotal;
        }

        order.TotalAmount = newTotal;
        order.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var updated = await LoadOrderAsync(id);
        return Ok(ToOrderDto(updated!));
    }

    // ─── POST /api/orders/{id}/payment ────────────────────────────────────

    /// <summary>Marks the order as paid.</summary>
    [HttpPost("{id:int}/payment")]
    [Authorize(Roles = "Patient,Pharmacist,Administrator")]
    public async Task<IActionResult> MarkAsPaid(int id)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null)
            return NotFound(new { message = $"Order {id} not found." });

        // Patients may only pay their own orders
        var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
        if (roles.Contains("Patient") && !roles.Contains("Pharmacist") && !roles.Contains("Administrator"))
        {
            var userId = TryGetUserId();
            var patient = userId != null
                ? await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId.Value)
                : null;

            if (patient == null || order.PatientId != patient.Id)
                return Forbid();
        }

        order.IsPaid = true;
        order.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var updated = await LoadOrderAsync(id);
        return Ok(ToOrderDto(updated!));
    }

    // ─── DELETE /api/orders/{id} ───────────────────────────────────────────

    /// <summary>
    /// Pharmacist cancels an order. Sets Status = Cancelled.
    /// Business rules:
    ///   - Only Pending or Confirmed orders can be cancelled.
    ///   - If the order originated from a prescription, that prescription's
    ///     status is reverted back to Active so it re-enters the queue.
    /// </summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Pharmacist")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        var userId = TryGetUserId();
        if (userId == null) return Unauthorized();

        var order = await _db.Orders
            .Include(o => o.Prescription)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new { message = $"Order {id} not found." });

        // Only cancellable from non-terminal, early states
        if (order.Status is OrderStatus.Dispensed)
            return BadRequest(new { message = $"Order {id} has already been dispensed and cannot be cancelled." });

        if (order.Status is OrderStatus.Cancelled)
            return BadRequest(new { message = $"Order {id} is already cancelled." });

        if (order.Status is OrderStatus.Preparing or OrderStatus.Ready)
            return BadRequest(new { message = $"Order {id} is in '{order.Status}' state. Only Pending or Confirmed orders can be cancelled." });

        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = DateTime.UtcNow;

        // Revert linked prescription back to Active so it re-enters the dispensing queue
        if (order.Prescription != null && order.Prescription.Status == PrescriptionStatus.Fulfilled)
        {
            order.Prescription.Status = PrescriptionStatus.Active;
            order.Prescription.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();

        return Ok(new { message = $"Order {id} has been cancelled. The linked prescription (if any) has been returned to the Active queue." });
    }

}
