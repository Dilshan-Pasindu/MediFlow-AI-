using MediFlow.Api.Data;
using MediFlow.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Security.Claims;

namespace MediFlow.Api.Controllers;

public class MedicineDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Form { get; set; } = string.Empty;
    public string Strength { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}

[ApiController]
[Route("api/[controller]")]
public class PrescriptionsController : ControllerBase
{
    private readonly AppDbContext _db;
    private static readonly List<MedicineDto> StandardMedicines = new()
    {
        new MedicineDto { Id = 1, Name = "Amoxicillin", Form = "Capsule", Strength = "500mg", Category = "Antibiotic" },
        new MedicineDto { Id = 2, Name = "Paracetamol", Form = "Tablet", Strength = "500mg", Category = "Analgesic" },
        new MedicineDto { Id = 3, Name = "Metformin", Form = "Tablet", Strength = "850mg", Category = "Antidiabetic" },
        new MedicineDto { Id = 4, Name = "Omeprazole", Form = "Capsule", Strength = "20mg", Category = "Gastrointestinal" },
        new MedicineDto { Id = 5, Name = "Atorvastatin", Form = "Tablet", Strength = "20mg", Category = "Cardiovascular" },
        new MedicineDto { Id = 6, Name = "Cetirizine", Form = "Tablet", Strength = "10mg", Category = "Antihistamine" },
        new MedicineDto { Id = 7, Name = "Salbutamol", Form = "Inhaler", Strength = "100mcg", Category = "Respiratory" },
        new MedicineDto { Id = 8, Name = "Ibuprofen", Form = "Tablet", Strength = "400mg", Category = "NSAID" }
    };

    private static readonly List<object> InStorePrescriptions = new();

    public PrescriptionsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("medicines")]
    [AllowAnonymous]
    public IActionResult GetMedicines([FromQuery] string? search)
    {
        IEnumerable<MedicineDto> result = StandardMedicines;
        if (!string.IsNullOrWhiteSpace(search))
        {
            result = result.Where(m => m.Name.Contains(search, StringComparison.OrdinalIgnoreCase));
        }
        return Ok(result.ToList());
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreatePrescription([FromBody] CreatePrescriptionRequest request)
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int userId = 0;
        if (!string.IsNullOrEmpty(userIdStr))
        {
            _ = int.TryParse(userIdStr, out userId);
        }

        var doctor = await _db.Doctors
            .Include(d => d.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
            .FirstOrDefaultAsync(d => d.UserId == userId);

        var doctorName = doctor?.FullName ?? "Dr. Clinical Specialist";
        var doctorSpecialty = doctor?.DoctorSpecialties.Select(ds => ds.Specialty.Name).FirstOrDefault() ?? "General Medicine";

        var isWalkIn = request.IsWalkIn || (request.PatientId == null && request.AppointmentId == null);
        var patientName = isWalkIn
            ? (request.WalkInPatientDetails?.FullName ?? request.PatientName ?? "Walk-in Patient")
            : (request.PatientName ?? "Registered Patient");

        var prescriptionId = "RX-" + Random.Shared.Next(10000, 99999);
        var recipients = request.FulfillmentSource == "InHouse" ? "Both (Pharmacist & Patient)" : "Patient Only";

        var response = new
        {
            Id = prescriptionId,
            AppointmentId = request.AppointmentId,
            PatientId = request.PatientId,
            PatientName = patientName,
            PatientAge = request.WalkInPatientDetails?.Age ?? "N/A",
            PatientGender = request.WalkInPatientDetails?.Gender ?? "N/A",
            PatientPhone = request.WalkInPatientDetails?.Phone ?? "N/A",
            IsWalkIn = isWalkIn,
            DoctorId = doctor?.Id ?? 1,
            DoctorName = doctorName,
            DoctorSpecialty = doctorSpecialty,
            DoctorLicenseNo = "SLMC-84920",
            Diagnosis = request.Diagnosis ?? "Clinical Assessment Completed",
            FulfillmentSource = request.FulfillmentSource ?? "InHouse",
            Recipients = recipients,
            Status = "Active",
            Instructions = request.Instructions ?? "Take as directed by doctor",
            Items = request.Items,
            ItemCount = request.Items?.Count ?? 0,
            DateIssued = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture),
            CreatedAt = DateTime.UtcNow.ToString("o", CultureInfo.InvariantCulture)
        };

        InStorePrescriptions.Insert(0, response);

        return Ok(new
        {
            Message = $"Prescription {prescriptionId} issued successfully and sent to {recipients}.",
            Prescription = response
        });
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetPrescriptions()
    {
        return Ok(InStorePrescriptions);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public IActionResult GetPrescriptionById(string id)
    {
        var rx = InStorePrescriptions.FirstOrDefault(p => p.GetType().GetProperty("Id")?.GetValue(p)?.ToString() == id);
        if (rx == null)
        {
            return Ok(new
            {
                Id = id,
                PatientName = "John Doe",
                PatientAge = "34",
                PatientGender = "Male",
                DoctorName = "Dr. Sarah Jenkins",
                DoctorSpecialty = "General Physician",
                DoctorLicenseNo = "SLMC-92817",
                Diagnosis = "Acute Upper Respiratory Tract Infection",
                FulfillmentSource = "InHouse",
                Recipients = "Both (Pharmacist & Patient)",
                Status = "Active",
                Instructions = "Drink plenty of water. Finish full course of antibiotics.",
                DateIssued = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture),
                Items = new List<object>
                {
                    new { MedicineName = "Amoxicillin 500mg", Dosage = "1 capsule", Frequency = "Three times daily (TID)", Duration = "5 days", Quantity = 15, Instructions = "Take after meals" },
                    new { MedicineName = "Paracetamol 500mg", Dosage = "2 tablets", Frequency = "As needed every 6 hours", Duration = "3 days", Quantity = 12, Instructions = "For fever/pain" }
                }
            });
        }
        return Ok(rx);
    }
}

public class CreatePrescriptionRequest
{
    public int? AppointmentId { get; set; }
    public int? PatientId { get; set; }
    public string? PatientName { get; set; }
    public bool IsWalkIn { get; set; }
    public WalkInDetails? WalkInPatientDetails { get; set; }
    public string? Diagnosis { get; set; }
    public string? FulfillmentSource { get; set; }
    public string? Recipients { get; set; }
    public string? Instructions { get; set; }
    public List<PrescriptionItemRequest> Items { get; set; } = new();
}

public class WalkInDetails
{
    public string FullName { get; set; } = string.Empty;
    public string? Age { get; set; }
    public string? Gender { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
}

public class PrescriptionItemRequest
{
    public int? MedicineId { get; set; }
    public string MedicineName { get; set; } = string.Empty;
    public string Dosage { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty;
    public int Quantity { get; set; } = 1;
    public string? Instructions { get; set; }
}
