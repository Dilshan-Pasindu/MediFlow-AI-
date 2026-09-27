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

    internal static InvoiceDto ToInvoiceDto(Invoice inv, MedicineOrder? order = null)
    {
        var itemsSource = order?.Items ?? inv.MedicineOrder?.Items;
        var items = itemsSource?.Select(i => new InvoiceLineItemDto(
            Id: i.Id,
            MedicineId: i.MedicineId,
            MedicineName: i.MedicineName,
            Dosage: i.Dosage,
            Quantity: i.Quantity,
            UnitPrice: i.UnitPrice,
            Subtotal: i.Subtotal
        )).ToList() ?? new List<InvoiceLineItemDto>();

        return new InvoiceDto(
            Id: inv.Id,
            MedicineOrderId: inv.MedicineOrderId,
            InvoiceNumber: inv.InvoiceNumber,
            IssuedAt: inv.IssuedAt.ToString("o", CultureInfo.InvariantCulture),
            TotalAmount: inv.TotalAmount,
            IsPaid: inv.IsPaid,
            PaidAt: inv.PaidAt?.ToString("o", CultureInfo.InvariantCulture),
            PaymentMethod: inv.PaymentMethod,
            GeneratedByPharmacistId: inv.GeneratedByPharmacistId,
            Items: items
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
            var existingOrder = await _db.Orders
                .AnyAsync(o => o.PrescriptionId == request.PrescriptionId.Value && o.Status != OrderStatus.Cancelled);
            if (existingOrder)
                return Conflict(new { message = $"A non-cancelled order already exists for prescription {request.PrescriptionId.Value}." });

            prescription = await _db.Prescriptions
                .Include(p => p.Items)
                .FirstOrDefaultAsync(p => p.Id == request.PrescriptionId.Value);

            if (prescription == null)
                return NotFound(new { message = $"Prescription {request.PrescriptionId} not found." });

            if (prescription.Status is PrescriptionStatus.Expired or PrescriptionStatus.Cancelled)
                return BadRequest(new { message = $"Cannot create an order from a prescription with status '{prescription.Status}'." });

            if (prescription.FulfillmentSource == FulfillmentSource.External)
                return BadRequest(new { message = "Cannot create an order for an external fulfillment prescription." });

            if (!prescription.SafetyCheckedAt.HasValue)
                return Conflict(new { message = "This prescription must pass the AI safety check before it can be converted to an order. Run 'Run AI Safety Check' first." });
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

            // Look up unit price from pharmacy inventory if not supplied or zero (Fix Bug #13)
            decimal unitPrice = item.UnitPrice ?? 0m;
            int? resolvedMedicineId = item.MedicineId;

            if (unitPrice == 0m)
            {
                InventoryItem? inv = null;
                if (item.MedicineId.HasValue)
                {
                    inv = await _db.InventoryItems
                        .FirstOrDefaultAsync(i => i.PharmacyId == request.PharmacyId && i.MedicineId == item.MedicineId.Value);
                }

                if (inv == null && !string.IsNullOrWhiteSpace(item.MedicineName))
                {
                    var nameTrimmed = item.MedicineName.Trim().ToLower();
                    inv = await _db.InventoryItems
                        .Include(i => i.Medicine)
                        .FirstOrDefaultAsync(i => i.PharmacyId == request.PharmacyId &&
                            (i.Medicine != null && i.Medicine.MedicineName.ToLower() == nameTrimmed));
                }

                if (inv != null)
                {
                    unitPrice = inv.UnitPrice;
                    resolvedMedicineId ??= inv.MedicineId;
                }
            }

            var subtotal = unitPrice * item.Quantity;
            total += subtotal;

            orderItems.Add(new OrderItem
            {
                MedicineId = resolvedMedicineId,
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

        // ── HUMAN-IN-THE-LOOP SAFETY GATE ─────────────────────────────────────
        // Advancing from Pending → Confirmed is the gate point.
        // Any unacknowledged High-severity DrugInteractionLog on the linked
        // prescription blocks progression until a pharmacist signs off.
        if (order.Status == OrderStatus.Pending && newStatus == OrderStatus.Confirmed
            && order.PrescriptionId.HasValue)
        {
            var rx = await _db.Prescriptions.FindAsync(order.PrescriptionId.Value);
            if (rx != null && !rx.SafetyCheckedAt.HasValue)
            {
                return Conflict(new { message = "This prescription must pass the AI safety check before it can be converted to an order. Run 'Run AI Safety Check' first." });
            }

            var blockers = await _db.DrugInteractionLogs
                .Where(l =>
                    l.PrescriptionId == order.PrescriptionId.Value &&
                    l.SeverityLevel == "High" &&
                    l.AcknowledgedAt == null)
                .ToListAsync();

            if (blockers.Count > 0)
            {
                // Surface Moderate/Low unacknowledged warnings as informational
                var moderateWarnings = await _db.DrugInteractionLogs
                    .Where(l =>
                        l.PrescriptionId == order.PrescriptionId.Value &&
                        l.SeverityLevel != "High" &&
                        l.AcknowledgedAt == null)
                    .Select(l => $"{l.WarningType}: {l.DrugA} ({l.SeverityLevel})")
                    .ToListAsync();

                return Conflict(new
                {
                    message = $"Cannot advance order {id}: {blockers.Count} unacknowledged " +
                              $"High-severity drug interaction warning(s) require pharmacist " +
                              "sign-off via POST /api/prescriptions/{prescriptionId}/acknowledge-warning " +
                              "before this order may proceed.",
                    blockedByLogIds = blockers.Select(b => b.Id).ToList(),
                    additionalInformationalWarnings = moderateWarnings
                });
            }
        }
        // ─────────────────────────────────────────────────────────────────────

        // ── DISPENSING GATES & STOCK DECREMENT (Ready → Dispensed) ───────────
        if (newStatus == OrderStatus.Dispensed)
        {
            // 1. Invoice & Payment verification
            var invoice = await _db.Invoices.FirstOrDefaultAsync(i => i.MedicineOrderId == id);
            if (invoice == null || !invoice.IsPaid)
            {
                return Conflict(new { message = $"Cannot dispense order {id}: Payment must be recorded on the invoice before dispensing." });
            }

            // 2. Final stock re-validation
            var orderWithItems = await _db.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (orderWithItems == null || !orderWithItems.PharmacyId.HasValue)
            {
                return BadRequest(new { message = $"Order {id} does not have an assigned pharmacy." });
            }

            var unpriced = orderWithItems.Items.Where(i => i.UnitPrice <= 0 || i.Subtotal <= 0).Select(i => i.MedicineName).ToList();
            if (unpriced.Count > 0)
            {
                return BadRequest(new { message = $"Cannot dispense order {id}: medicine(s) '{string.Join(", ", unpriced)}' have invalid or unset prices." });
            }

            var stockErrors = new List<string>();
            var itemsToProcess = new List<(OrderItem Item, InventoryItem Inventory)>();

            foreach (var item in orderWithItems.Items)
            {
                if (item.MedicineId.HasValue)
                {
                    var inv = await _db.InventoryItems
                        .Include(i => i.Medicine)
                        .FirstOrDefaultAsync(i => i.PharmacyId == orderWithItems.PharmacyId.Value && i.MedicineId == item.MedicineId.Value);

                    if (inv == null || item.Quantity > inv.CurrentStock)
                    {
                        var medName = inv?.Medicine?.MedicineName ?? item.MedicineName;
                        var availStock = inv?.CurrentStock ?? 0;
                        stockErrors.Add($"Requested quantity ({item.Quantity}) exceeds available stock ({availStock}) for medicine '{medName}'.");
                    }
                    else
                    {
                        itemsToProcess.Add((item, inv));
                    }
                }
            }

            if (stockErrors.Count > 0)
            {
                return BadRequest(new { message = $"Cannot dispense order {id} due to insufficient inventory stock.", errors = stockErrors });
            }

            // 3. Execution within a single database transaction (All-or-Nothing)
            using var tx = _db.Database.ProviderName != "Microsoft.EntityFrameworkCore.InMemory"
                ? await _db.Database.BeginTransactionAsync()
                : null;
            try
            {
                foreach (var (item, inv) in itemsToProcess)
                {
                    inv.CurrentStock -= item.Quantity;

                    var txLog = new InventoryTransaction
                    {
                        InventoryItemId = inv.Id,
                        TransactionType = TransactionType.Dispense,
                        QuantityChanged = -item.Quantity,
                        StockAfter = inv.CurrentStock,
                        TransactionDate = DateTime.UtcNow,
                        Notes = $"Dispensed for Order #{id}"
                    };
                    _db.InventoryTransactions.Add(txLog);
                }

                order.Status = OrderStatus.Dispensed;
                order.DispensedAt = DateTime.UtcNow;
                var currentUserId = TryGetUserId();
                if (currentUserId.HasValue)
                {
                    order.PharmacistId = currentUserId.Value;
                }
                order.UpdatedAt = DateTime.UtcNow;

                await _db.SaveChangesAsync();
                if (tx != null)
                {
                    await tx.CommitAsync();
                }

                var updated = await LoadOrderAsync(id);
                return Ok(ToOrderDto(updated!));
            }
            catch
            {
                if (tx != null)
                {
                    await tx.RollbackAsync();
                }
                throw;
            }
        }

        order.Status = newStatus;
        order.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var updatedOrder = await LoadOrderAsync(id);
        return Ok(ToOrderDto(updatedOrder!));
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

        // Handle linked Invoice on cancellation (Section H Rule 34)
        var existingInvoice = await _db.Invoices.FirstOrDefaultAsync(i => i.MedicineOrderId == id);
        if (existingInvoice != null)
        {
            if (existingInvoice.IsPaid)
            {
                return Conflict(new { message = $"Cannot cancel order {id} because a paid invoice ({existingInvoice.InvoiceNumber}) exists for this order." });
            }

            _db.Invoices.Remove(existingInvoice);
        }

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

    // ─── POST /api/orders/{id}/items ────────────────────────────────────────

    /// <summary>
    /// Pharmacist adds a line item to an order.
    /// Rejects with 409 Conflict if order is Dispensed or Cancelled.
    /// Stock validation: Rejects with 400 Bad Request if requested quantity > available stock.
    /// </summary>
    [HttpPost("{id:int}/items")]
    [Authorize(Roles = "Pharmacist")]
    public async Task<IActionResult> AddOrderItem(int id, [FromBody] AddOrderItemRequestDto dto)
    {
        var order = await LoadOrderAsync(id);
        if (order == null)
            return NotFound(new { message = $"Order {id} not found." });

        if (order.Status is OrderStatus.Dispensed or OrderStatus.Cancelled)
            return Conflict(new { message = $"Cannot modify items for order {id} because it is in terminal state '{order.Status}'." });

        if (dto.Quantity <= 0)
            return BadRequest(new { message = "Quantity must be greater than zero." });

        if (!order.PharmacyId.HasValue)
            return BadRequest(new { message = $"Order {id} does not have an assigned pharmacy." });

        var inv = await _db.InventoryItems
            .Include(i => i.Medicine)
            .FirstOrDefaultAsync(i => i.PharmacyId == order.PharmacyId.Value && i.MedicineId == dto.MedicineId);

        if (inv == null)
            return BadRequest(new { message = $"Medicine with ID {dto.MedicineId} is not available in the pharmacy inventory." });

        var existingItem = order.Items.FirstOrDefault(i => i.MedicineId == dto.MedicineId);
        var currentlyHeld = existingItem?.Quantity ?? 0;
        var totalProposed = currentlyHeld + dto.Quantity;

        if (totalProposed > inv.CurrentStock)
        {
            var medicineName = inv.Medicine?.MedicineName ?? $"ID {dto.MedicineId}";
            return BadRequest(new { message = $"Not enough stock available for {medicineName} (Requested: {totalProposed}, Available stock: {inv.CurrentStock})." });
        }

        if (existingItem != null)
        {
            existingItem.Quantity = totalProposed;
            existingItem.UnitPrice = inv.UnitPrice;
            existingItem.Subtotal = inv.UnitPrice * existingItem.Quantity;
        }
        else
        {
            var newItem = new OrderItem
            {
                MedicineOrderId = order.Id,
                MedicineId = dto.MedicineId,
                MedicineName = inv.Medicine?.MedicineName ?? "Medicine",
                Dosage = inv.Medicine?.UnitOfMeasure,
                Quantity = dto.Quantity,
                UnitPrice = inv.UnitPrice,
                Subtotal = inv.UnitPrice * dto.Quantity
            };
            _db.OrderItems.Add(newItem);
            order.Items.Add(newItem);
        }

        order.TotalAmount = order.Items.Sum(i => i.Subtotal);
        order.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var updated = await LoadOrderAsync(id);
        return Ok(ToOrderDto(updated!));
    }

    // ─── PUT /api/orders/{id}/items/{itemId} ────────────────────────────────

    /// <summary>
    /// Pharmacist updates quantity of an existing line item in an order.
    /// Rejects with 409 Conflict if order is Dispensed or Cancelled.
    /// Stock validation: Rejects if requested quantity exceeds available physical stock.
    /// </summary>
    [HttpPut("{id:int}/items/{itemId:int}")]
    [Authorize(Roles = "Pharmacist")]
    public async Task<IActionResult> UpdateOrderItem(int id, int itemId, [FromBody] UpdateOrderItemQuantityDto dto)
    {
        var order = await LoadOrderAsync(id);
        if (order == null)
            return NotFound(new { message = $"Order {id} not found." });

        if (order.Status is OrderStatus.Dispensed or OrderStatus.Cancelled)
            return Conflict(new { message = $"Cannot modify items for order {id} because it is in terminal state '{order.Status}'." });

        if (dto.Quantity <= 0)
            return BadRequest(new { message = "Quantity must be greater than zero." });

        var item = order.Items.FirstOrDefault(i => i.Id == itemId);
        if (item == null)
            return NotFound(new { message = $"Order item {itemId} not found in order {id}." });

        if (order.PharmacyId.HasValue && item.MedicineId.HasValue)
        {
            var inv = await _db.InventoryItems
                .Include(i => i.Medicine)
                .FirstOrDefaultAsync(i => i.PharmacyId == order.PharmacyId.Value && i.MedicineId == item.MedicineId.Value);

            if (inv != null)
            {
                if (dto.Quantity > inv.CurrentStock)
                {
                    var medicineName = inv.Medicine?.MedicineName ?? item.MedicineName;
                    return BadRequest(new { message = $"Not enough stock available for {medicineName} (Requested: {dto.Quantity}, Available stock: {inv.CurrentStock})." });
                }

                item.UnitPrice = inv.UnitPrice;
            }
        }

        item.Quantity = dto.Quantity;
        item.Subtotal = item.UnitPrice * item.Quantity;

        order.TotalAmount = order.Items.Sum(i => i.Subtotal);
        order.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var updated = await LoadOrderAsync(id);
        return Ok(ToOrderDto(updated!));
    }

    // ─── DELETE /api/orders/{id}/items/{itemId} ─────────────────────────────

    /// <summary>
    /// Pharmacist removes a line item from an order and recalculates TotalAmount.
    /// Rejects with 409 Conflict if order is Dispensed or Cancelled.
    /// </summary>
    [HttpDelete("{id:int}/items/{itemId:int}")]
    [Authorize(Roles = "Pharmacist")]
    public async Task<IActionResult> DeleteOrderItem(int id, int itemId)
    {
        var order = await LoadOrderAsync(id);
        if (order == null)
            return NotFound(new { message = $"Order {id} not found." });

        if (order.Status is OrderStatus.Dispensed or OrderStatus.Cancelled)
            return Conflict(new { message = $"Cannot modify items for order {id} because it is in terminal state '{order.Status}'." });

        var item = order.Items.FirstOrDefault(i => i.Id == itemId);
        if (item == null)
            return NotFound(new { message = $"Order item {itemId} not found in order {id}." });

        _db.OrderItems.Remove(item);
        order.Items.Remove(item);

        order.TotalAmount = order.Items.Sum(i => i.Subtotal);
        order.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var updated = await LoadOrderAsync(id);
        return Ok(ToOrderDto(updated!));
    }

    // ─── POST /api/orders/{id}/generate-bill ────────────────────────────────

    /// <summary>
    /// Pharmacist generates a billing invoice for an order.
    /// Rejects with 400 Bad Request if order has zero items or insufficient inventory stock.
    /// Rejects with 409 Conflict if order is already Dispensed or Cancelled.
    /// Idempotent: returns existing invoice if already generated.
    /// </summary>
    [HttpPost("{id:int}/generate-bill")]
    [Authorize(Roles = "Pharmacist")]
    public async Task<IActionResult> GenerateBill(int id)
    {
        var order = await _db.Orders
            .Include(o => o.Items)
            .Include(o => o.Invoice)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new { message = $"Order {id} not found." });

        if (order.Items.Count == 0)
            return BadRequest(new { message = $"Cannot generate bill for order {id} because it has zero items." });

        if (order.Status is OrderStatus.Dispensed or OrderStatus.Cancelled)
            return Conflict(new { message = $"Cannot generate bill for order {id} because it is in status '{order.Status}'." });

        // Reject bill generation if any line item is unpriced or <= 0 (Fix Bug #18 & Item 19)
        var unpricedItems = order.Items.Where(i => i.UnitPrice <= 0 || i.Subtotal <= 0).Select(i => i.MedicineName).ToList();
        if (unpricedItems.Count > 0)
        {
            return BadRequest(new { message = $"Cannot generate bill for order {id}: the following medicine(s) have invalid/unset prices: {string.Join(", ", unpricedItems)}. Please calculate or set prices before billing." });
        }

        if (order.Items.Sum(i => i.Subtotal) <= 0)
        {
            return BadRequest(new { message = $"Cannot generate bill for order {id}: grand total must be greater than zero." });
        }

        // Check stock availability for all items before billing
        if (order.PharmacyId.HasValue)
        {
            var stockErrors = new List<string>();
            foreach (var item in order.Items)
            {
                if (item.MedicineId.HasValue)
                {
                    var inv = await _db.InventoryItems
                        .Include(i => i.Medicine)
                        .FirstOrDefaultAsync(i => i.PharmacyId == order.PharmacyId.Value && i.MedicineId == item.MedicineId.Value);

                    if (inv != null && item.Quantity > inv.CurrentStock)
                    {
                        var medName = inv.Medicine?.MedicineName ?? item.MedicineName;
                        stockErrors.Add($"Not enough stock available for {medName} (Requested: {item.Quantity}, Available stock: {inv.CurrentStock}).");
                    }
                }
            }

            if (stockErrors.Count > 0)
            {
                return BadRequest(new { message = $"Cannot generate bill: {string.Join(" ", stockErrors)}" });
            }
        }

        // Recompute TotalAmount server-side as sum of current item subtotals
        order.TotalAmount = order.Items.Sum(i => i.Subtotal);
        order.UpdatedAt = DateTime.UtcNow;

        Invoice invoice;
        if (order.Invoice != null)
        {
            invoice = order.Invoice;
            invoice.TotalAmount = order.TotalAmount;
        }
        else
        {
            invoice = new Invoice
            {
                MedicineOrderId = order.Id,
                InvoiceNumber = $"INV-{order.Id:D6}",
                IssuedAt = DateTime.UtcNow,
                TotalAmount = order.TotalAmount,
                IsPaid = false,
                GeneratedByPharmacistId = TryGetUserId(),
                CreatedAt = DateTime.UtcNow
            };
            _db.Invoices.Add(invoice);
        }

        await _db.SaveChangesAsync();

        return Ok(ToInvoiceDto(invoice, order));
    }

    // ─── POST /api/orders/{id}/record-payment ───────────────────────────────

    /// <summary>
    /// Pharmacist records payment against an existing counter Invoice.
    /// Rejects with 400 Bad Request if no invoice exists yet.
    /// Rejects with 409 Conflict if invoice is already paid or order is Dispensed/Cancelled.
    /// </summary>
    [HttpPost("{id:int}/record-payment")]
    [Authorize(Roles = "Pharmacist")]
    public async Task<IActionResult> RecordPayment(int id, [FromBody] RecordPaymentDto dto)
    {
        var invoice = await _db.Invoices
            .Include(i => i.MedicineOrder)
                .ThenInclude(o => o!.Items)
            .FirstOrDefaultAsync(i => i.MedicineOrderId == id);

        if (invoice == null)
        {
            var orderExists = await _db.Orders.AnyAsync(o => o.Id == id);
            if (!orderExists)
                return NotFound(new { message = $"Order {id} not found." });

            return BadRequest(new { message = $"No invoice exists for order {id}. Generate the bill first." });
        }

        if (invoice.IsPaid)
            return Conflict(new { message = $"Invoice {invoice.InvoiceNumber} for order {id} is already paid." });

        if (invoice.MedicineOrder.Status is OrderStatus.Dispensed or OrderStatus.Cancelled)
            return Conflict(new { message = $"Cannot record payment for order {id} because it is in status '{invoice.MedicineOrder.Status}'." });

        invoice.IsPaid = true;
        invoice.PaidAt = DateTime.UtcNow;
        invoice.PaymentMethod = !string.IsNullOrWhiteSpace(dto.PaymentMethod) ? dto.PaymentMethod : "Cash";
        invoice.MedicineOrder.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(ToInvoiceDto(invoice, invoice.MedicineOrder));
    }

    // ─── GET /api/orders/{id}/invoice ───────────────────────────────────────

    /// <summary>
    /// Retrieves itemized invoice for display or PDF rendering.
    /// Accessible by Pharmacists, Administrators, or the Patient who owns the order.
    /// </summary>
    [HttpGet("{id:int}/invoice")]
    [Authorize(Roles = "Pharmacist,Patient,Administrator")]
    public async Task<IActionResult> GetInvoice(int id)
    {
        var order = await LoadOrderAsync(id);
        if (order == null)
            return NotFound(new { message = $"Order {id} not found." });

        // Patient ownership check
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

        var invoice = await _db.Invoices
            .FirstOrDefaultAsync(i => i.MedicineOrderId == id);

        return Ok(ToInvoiceDto(invoice, order));
    }

    // ─── POST /api/orders/{id}/notify-owner-restock ────────────────────────

    /// <summary>
    /// Sends a low-stock / restock notification to the Pharmacy Owner for items exceeding inventory stock.
    /// Accessible by Pharmacists.
    /// </summary>
    [HttpPost("{id:int}/notify-owner-restock")]
    [Authorize(Roles = "Pharmacist")]
    public async Task<IActionResult> NotifyOwnerRestock(int id)
    {
        var order = await _db.Orders
            .Include(o => o.Items)
            .Include(o => o.Prescription)
            .Include(o => o.Patient)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new { message = $"Order #{id} not found." });

        // Find items that exceed current inventory stock
        var shortItems = new List<string>();
        if (order.PharmacyId.HasValue)
        {
            foreach (var item in order.Items)
            {
                if (item.MedicineId.HasValue)
                {
                    var inv = await _db.InventoryItems
                        .FirstOrDefaultAsync(i => i.PharmacyId == order.PharmacyId.Value && i.MedicineId == item.MedicineId.Value);

                    var stock = inv?.CurrentStock ?? 0;
                    if (inv == null || item.Quantity > stock)
                    {
                        shortItems.Add($"{item.MedicineName} (Stock: {stock}, Requested: {item.Quantity})");
                    }
                }
            }
        }

        var detailMsg = shortItems.Count > 0
            ? string.Join(", ", shortItems)
            : string.Join(", ", order.Items.Select(i => i.MedicineName));

        var patientName = order.Prescription?.WalkInPatientName 
            ?? order.Prescription?.Patient?.FullName 
            ?? order.Patient?.FullName 
            ?? "Patient";

        // Find Pharmacy Owner(s)
        var owners = await _db.Users.Where(u => u.Role == UserRole.PharmacyOwner).ToListAsync();
        if (owners.Count == 0)
        {
            owners = await _db.Users.Where(u => u.Role == UserRole.Administrator).ToListAsync();
        }

        foreach (var owner in owners)
        {
            _db.Notifications.Add(new Notification
            {
                UserId = owner.Id,
                Title = $"Low Stock Restock Alert: Order #{id}",
                Message = $"Order #{id} for patient '{patientName}' requires restocking: {detailMsg}.",
                Type = "warning",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _db.SaveChangesAsync();

        return Ok(new { message = $"Restock alert sent to Pharmacy Owner successfully for Order #{id}!", orderId = id });
    }
}


