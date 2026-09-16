namespace MediFlow.Api.DTOs;

// ─── Order Response DTOs ───────────────────────────────────────────────────────

public record OrderItemDto(
    int Id,
    int? MedicineId,
    string MedicineName,
    string? Dosage,
    int Quantity,
    decimal UnitPrice,
    decimal Subtotal
);

public record OrderDto(
    int Id,
    int? PrescriptionId,
    int? PatientId,
    string PatientName,
    int? PharmacyId,
    string PharmacyName,
    string? AppointmentNumber,
    string? DoctorName,
    string Status,          // Pending | Confirmed | Preparing | Ready | Dispensed | Cancelled
    List<OrderItemDto> Items,
    decimal TotalAmount,
    bool IsPaid,
    string? DeliveryAddress,
    string? Notes,
    string CreatedAt,
    string UpdatedAt,
    string? DispensedAt
);

// ─── Order Request DTOs ────────────────────────────────────────────────────────

public record CreateOrderItemDto(
    int? MedicineId,
    string MedicineName,
    string? Dosage,
    int Quantity,
    decimal? UnitPrice = null   // null → look up from InventoryItem
);

public record CreateOrderRequestDto(
    int? PrescriptionId,
    int? PatientId,
    int PharmacyId,
    List<CreateOrderItemDto>? Items,    // null/empty → copy from prescription
    string? DeliveryAddress,
    string? Notes
);

public record UpdateOrderStatusDto(
    string Status   // Confirmed | Preparing | Ready | Dispensed | Cancelled
);

public record CalculateOrderPriceDto(
    int PharmacyId
);
