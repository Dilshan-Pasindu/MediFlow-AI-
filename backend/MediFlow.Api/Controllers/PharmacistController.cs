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
/// Pharmacist workspace endpoints.
/// Route: api/pharmacist
/// Owned by Member 3 — E-Prescription &amp; Medicine Ordering.
/// </summary>
[ApiController]
[Route("api/pharmacist")]
[Authorize(Roles = "Pharmacist")]
public class PharmacistController : ControllerBase
{
    private readonly AppDbContext _db;

    public PharmacistController(AppDbContext db) => _db = db;

    private static PrescriptionDto ToDto(Prescription p)
    {
        var doctorName = p.Doctor?.FullName ?? "Unknown Doctor";
        var doctorSpecialty = p.Doctor?.DoctorSpecialties.Select(ds => ds.Specialty.Name).FirstOrDefault();

        var patientName = p.IsWalkIn
            ? (p.WalkInPatientName ?? "Walk-in Patient")
            : (p.Patient?.FullName ?? "Registered Patient");

        var patientAge = p.IsWalkIn
            ? p.WalkInPatientAge
            : (p.Patient?.DateOfBirth.HasValue == true
                ? (DateTime.UtcNow.Year - p.Patient.DateOfBirth.Value.Year).ToString(CultureInfo.InvariantCulture)
                : null);

        return new PrescriptionDto(
            Id: p.Id,
            AppointmentId: p.AppointmentId,
            PatientId: p.PatientId,
            PatientName: patientName,
            PatientAge: patientAge,
            PatientGender: p.IsWalkIn ? p.WalkInPatientGender : p.Patient?.Gender,
            PatientPhone: p.IsWalkIn ? p.WalkInPatientPhone : p.Patient?.PhoneNumber,
            IsWalkIn: p.IsWalkIn,
            DoctorId: p.DoctorId,
            DoctorName: doctorName,
            DoctorSpecialty: doctorSpecialty,
            DoctorLicenseNo: "SLMC-84920",
            Diagnosis: p.Diagnosis,
            Status: p.Status.ToString(),
            FulfillmentSource: p.FulfillmentSource.ToString(),
            Recipients: p.Recipients.ToString(),
            Instructions: p.Instructions,
            Items: p.Items.Select(i => new PrescriptionItemDto(
                MedicineId: i.MedicineId,
                MedicineName: i.MedicineName,
                Dosage: i.Dosage,
                Frequency: i.Frequency,
                Duration: i.Duration,
                Quantity: i.Quantity,
                Instructions: i.Instructions
            )).ToList(),
            ItemCount: p.Items.Count,
            DateIssued: p.IssuedAt.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture),
            CreatedAt: p.CreatedAt.ToString("o", CultureInfo.InvariantCulture)
        );
    }

    // ─── GET api/pharmacist/prescriptions ──────────────────────────────────

    /// <summary>
    /// Returns Active prescriptions that have no linked MedicineOrder yet —
    /// the pharmacist's incoming unfulfilled queue.
    /// </summary>
    [HttpGet("prescriptions")]
    public async Task<IActionResult> GetIncomingPrescriptions()
    {
        // Prescriptions that are Active AND have no order yet
        var fulfilledIds = await _db.Orders
            .Where(o => o.PrescriptionId != null && o.Status != OrderStatus.Cancelled)
            .Select(o => o.PrescriptionId!.Value)
            .Distinct()
            .ToListAsync();

        var prescriptions = await _db.Prescriptions
            .Where(p => p.Status == PrescriptionStatus.Active && !fulfilledIds.Contains(p.Id))
            .Include(p => p.Items)
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
                .ThenInclude(d => d.DoctorSpecialties)
                .ThenInclude(ds => ds.Specialty)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return Ok(prescriptions.Select(ToDto).ToList());
    }

    // ─── GET api/pharmacist/orders ─────────────────────────────────────────

    /// <summary>Returns all medicine orders visible to the pharmacist workspace.</summary>
    [HttpGet("orders")]
    public async Task<IActionResult> GetPharmacistOrders()
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

        return Ok(orders.Select(OrdersController.ToOrderDto).ToList());
    }
}
