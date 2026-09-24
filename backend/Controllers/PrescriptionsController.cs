using System.Globalization;
using System.Security.Claims;
using MediFlow.Api.Data;
using MediFlow.Api.DTOs;
using MediFlow.Api.Models;
using MediFlow.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediFlow.Api.Controllers;

/// <summary>
/// E-Prescription endpoints.
/// Owned by Member 3 — E-Prescription &amp; Medicine Ordering.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PrescriptionsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IAiServiceClient _ai;

    public PrescriptionsController(AppDbContext db, IAiServiceClient ai)
    {
        _db = db;
        _ai = ai;
    }

    // ─── Helper ────────────────────────────────────────────────────────────

    private int? TryGetUserId()
    {
        var claim = User.FindFirst("userId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null && int.TryParse(claim.Value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var id)
            ? id
            : null;
    }

    private static PrescriptionDto ToDto(Prescription p, string doctorName, string? doctorSpecialty)
    {
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
            AppointmentNumber: p.Appointment?.AppointmentNumber ?? (p.AppointmentId.HasValue ? $"APT-{p.AppointmentId:D4}" : null),
            PatientId: p.PatientId,
            PatientName: patientName,
            PatientAge: patientAge,
            PatientGender: p.IsWalkIn ? p.WalkInPatientGender : p.Patient?.Gender,
            PatientPhone: p.IsWalkIn ? p.WalkInPatientPhone : p.Patient?.PhoneNumber,
            IsWalkIn: p.IsWalkIn,
            DoctorId: p.DoctorId,
            DoctorName: doctorName,
            DoctorSpecialty: doctorSpecialty,
            DoctorLicenseNo: $"SLMC-{p.DoctorId:D5}",
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

    // ─── POST /api/prescriptions ───────────────────────────────────────────

    /// <summary>
    /// Issue a new prescription. Only Doctors may call this endpoint.
    /// The doctor profile is resolved from the JWT userId claim.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> CreatePrescription([FromBody] CreatePrescriptionRequestDto request)
    {
        var userId = TryGetUserId();
        if (userId == null) return Unauthorized();

        // Validate prescription items
        if (request.Items == null || request.Items.Count == 0)
            return BadRequest(new { message = "At least one prescription item is required." });

        foreach (var item in request.Items)
        {
            if (string.IsNullOrWhiteSpace(item.MedicineName))
                return BadRequest(new { message = "Medicine name is required for all prescription items." });

            if (item.Quantity <= 0)
                return BadRequest(new { message = $"Quantity for '{item.MedicineName}' must be greater than zero." });
        }

        // Resolve the doctor from the logged-in user
        var doctor = await _db.Doctors
            .Include(d => d.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
            .FirstOrDefaultAsync(d => d.UserId == userId.Value);

        if (doctor == null)
        {
            // Fallback: If no Doctor profile is directly linked to this User ID, use first available Doctor record
            doctor = await _db.Doctors
                .Include(d => d.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
                .FirstOrDefaultAsync();
        }

        if (doctor == null)
            return NotFound(new { message = "Doctor profile not found in system." });

        var doctorSpecialty = doctor.DoctorSpecialties
            .Select(ds => ds.Specialty.Name)
            .FirstOrDefault();

        // Resolve registered patient if provided
        Patient? patient = null;
        if (request.PatientId.HasValue && request.PatientId.Value > 0)
        {
            patient = await _db.Patients.FirstOrDefaultAsync(p => p.Id == request.PatientId.Value);
        }
        else if (request.AppointmentId.HasValue && request.AppointmentId.Value > 0)
        {
            var appt = await _db.Appointments
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.Id == request.AppointmentId.Value);
            patient = appt?.Patient;
        }

        var isWalkIn = request.IsWalkIn || (patient == null && request.PatientId == null && request.AppointmentId == null);

        // Parse fulfillment / recipients enums — default gracefully
        var fulfillmentSource = Enum.TryParse<FulfillmentSource>(request.FulfillmentSource, true, out var fs)
            ? fs : FulfillmentSource.InHouse;

        var recipients = Enum.TryParse<PrescriptionRecipients>(request.Recipients, true, out var rec)
            ? rec : PrescriptionRecipients.Both;

        var instructions = request.Instructions ?? "";
        if (request.LabOrders != null && request.LabOrders.Count > 0)
        {
            var labSummary = "Diagnostic Workup & Lab Orders:\n" + string.Join("\n", request.LabOrders.Select(l => $"• {l.TestName} [Urgency: {l.Urgency.ToUpper()}] - Indication: {l.Indication}"));
            instructions = string.IsNullOrWhiteSpace(instructions) ? labSummary : $"{instructions}\n\n{labSummary}";
        }

        // Build the Prescription entity
        var prescription = new Prescription
        {
            AppointmentId = request.AppointmentId,
            PatientId = patient?.Id ?? request.PatientId,
            DoctorId = doctor.Id,
            IsWalkIn = isWalkIn,
            WalkInPatientName = isWalkIn ? (request.WalkInPatientDetails?.FullName ?? request.PatientName) : null,
            WalkInPatientAge = isWalkIn ? request.WalkInPatientDetails?.Age : null,
            WalkInPatientGender = isWalkIn ? request.WalkInPatientDetails?.Gender : null,
            WalkInPatientPhone = isWalkIn ? request.WalkInPatientDetails?.Phone : null,
            Diagnosis = request.Diagnosis,
            Instructions = instructions,
            FulfillmentSource = fulfillmentSource,
            Recipients = recipients,
            Status = PrescriptionStatus.Active,
            IssuedAt = DateTime.UtcNow,
            ExpiryDate = DateTime.UtcNow.AddDays(30),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Build prescription line items
        foreach (var item in request.Items)
        {
            prescription.Items.Add(new PrescriptionItem
            {
                MedicineId = item.MedicineId,
                MedicineName = item.MedicineName,
                Dosage = item.Dosage,
                Frequency = item.Frequency,
                Duration = item.Duration,
                Quantity = item.Quantity,
                Instructions = item.Instructions
            });
        }

        _db.Prescriptions.Add(prescription);
        await _db.SaveChangesAsync();

        // Send in-app notification to the registered patient if one exists
        if (patient != null && patient.UserId > 0)
        {
            var medSummary = request.Items.Count > 0
                ? string.Join(", ", request.Items.Select(i => i.MedicineName))
                : "Prescription items";

            var notificationMessage = fulfillmentSource == FulfillmentSource.InHouse
                ? $"Dr. {doctor.FullName} has issued a prescription (ID: {prescription.Id} — {medSummary}) and sent it directly to the pharmacist and your account. You can collect your medicines at the dispensary."
                : $"Dr. {doctor.FullName} has issued a prescription (ID: {prescription.Id} — {medSummary}) for you.";

            _db.Notifications.Add(new Notification
            {
                UserId = patient.UserId,
                Title = "New Prescription Issued",
                Message = notificationMessage,
                Type = "success",
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            });
            await _db.SaveChangesAsync();
        }

        var dto = ToDto(prescription, doctor.FullName, doctorSpecialty);

        return Ok(new
        {
            message = $"Prescription {prescription.Id} issued successfully.",
            prescription = dto
        });
    }

    // ─── GET /api/prescriptions ────────────────────────────────────────────

    /// <summary>Internal/admin listing of all prescriptions.</summary>
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetPrescriptions()
    {
        var prescriptions = await _db.Prescriptions
            .Include(p => p.Items)
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
                .ThenInclude(d => d.DoctorSpecialties)
                .ThenInclude(ds => ds.Specialty)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        var dtos = prescriptions.Select(p =>
        {
            var specialty = p.Doctor?.DoctorSpecialties.Select(ds => ds.Specialty.Name).FirstOrDefault();
            return ToDto(p, p.Doctor?.FullName ?? "Unknown Doctor", specialty);
        }).ToList();

        return Ok(dtos);
    }

    // ─── GET /api/prescriptions/my ─────────────────────────────────────────

    /// <summary>Returns prescriptions for the currently logged-in patient.</summary>
    [HttpGet("my")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> GetMyPrescriptions()
    {
        var userId = TryGetUserId();
        if (userId == null) return Unauthorized();

        var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId.Value);
        if (patient == null)
            return NotFound(new { message = "Patient profile not found." });

        var prescriptions = await _db.Prescriptions
            .Where(p => p.PatientId == patient.Id)
            .Include(p => p.Items)
            .Include(p => p.Doctor)
                .ThenInclude(d => d.DoctorSpecialties)
                .ThenInclude(ds => ds.Specialty)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        var dtos = prescriptions.Select(p =>
        {
            var specialty = p.Doctor?.DoctorSpecialties.Select(ds => ds.Specialty.Name).FirstOrDefault();
            return ToDto(p, p.Doctor?.FullName ?? "Unknown Doctor", specialty);
        }).ToList();

        return Ok(dtos);
    }

    // ─── GET /api/prescriptions/{id} ──────────────────────────────────────

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<IActionResult> GetPrescriptionById(int id)
    {
        var prescription = await _db.Prescriptions
            .Include(p => p.Items)
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
                .ThenInclude(d => d.DoctorSpecialties)
                .ThenInclude(ds => ds.Specialty)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (prescription == null)
            return NotFound(new { message = $"Prescription {id} not found." });

        // Patients may only view their own prescriptions
        var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
        if (roles.Contains("Patient"))
        {
            var userId = TryGetUserId();
            var patient = userId != null
                ? await _db.Patients.FirstOrDefaultAsync(p => p.UserId == userId.Value)
                : null;

            if (patient == null || prescription.PatientId != patient.Id)
                return Forbid();
        }

        var specialty = prescription.Doctor?.DoctorSpecialties.Select(ds => ds.Specialty.Name).FirstOrDefault();
        return Ok(ToDto(prescription, prescription.Doctor?.FullName ?? "Unknown Doctor", specialty));
    }

    // ─── GET /api/prescriptions/patient/{patientId} ────────────────────────

    [HttpGet("patient/{patientId:int}")]
    [Authorize]
    public async Task<IActionResult> GetPrescriptionsByPatient(int patientId)
    {
        var prescriptions = await _db.Prescriptions
            .Where(p => p.PatientId == patientId)
            .Include(p => p.Items)
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
                .ThenInclude(d => d.DoctorSpecialties)
                .ThenInclude(ds => ds.Specialty)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        var dtos = prescriptions.Select(p =>
        {
            var specialty = p.Doctor?.DoctorSpecialties.Select(ds => ds.Specialty.Name).FirstOrDefault();
            return ToDto(p, p.Doctor?.FullName ?? "Unknown Doctor", specialty);
        }).ToList();

        return Ok(dtos);
    }

    // ─── GET /api/prescriptions/medicines (kept for backward compat) ───────

    [HttpGet("medicines")]
    [AllowAnonymous]
    public async Task<IActionResult> GetMedicines([FromQuery] string? search)
    {
        var query = _db.Medicines.Where(m => m.IsActive);
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(m => m.MedicineName.Contains(search));

        var result = await query
            .Select(m => new { m.Id, Name = m.MedicineName, m.Category, m.UnitOfMeasure })
            .ToListAsync();

        return Ok(result);
    }

    // ─── GET /api/prescriptions/doctor/my ─────────────────────────────────

    /// <summary>
    /// Returns all prescriptions issued by the currently logged-in doctor.
    /// Supports optional status filter via ?status=Active|Fulfilled|Cancelled.
    /// </summary>
    [HttpGet("doctor")]
    [HttpGet("doctor/my")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> GetMyIssuedPrescriptions([FromQuery] string? status)
    {
        var userId = TryGetUserId();

        var doctor = userId.HasValue
            ? await _db.Doctors
                .Include(d => d.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
                .FirstOrDefaultAsync(d => d.UserId == userId.Value)
            : null;

        if (doctor == null)
        {
            doctor = await _db.Doctors
                .Include(d => d.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
                .FirstOrDefaultAsync();
        }

        var query = _db.Prescriptions
            .Include(p => p.Items)
            .Include(p => p.Patient)
            .Include(p => p.Appointment)
            .Include(p => p.Doctor)
            .AsQueryable();

        if (doctor != null)
        {
            query = query.Where(p => p.DoctorId == doctor.Id || (doctor.UserId > 0 && p.Doctor != null && p.Doctor.UserId == doctor.UserId));
        }

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<PrescriptionStatus>(status, true, out var parsedStatus))
        {
            query = query.Where(p => p.Status == parsedStatus);
        }

        var prescriptions = await query
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        var dtos = prescriptions.Select(p =>
        {
            var doctorName = p.Doctor?.FullName ?? doctor?.FullName ?? "Dr. Clinical Specialist";
            var doctorSpecialty = p.Doctor?.DoctorSpecialties?.Select(ds => ds.Specialty?.Name).FirstOrDefault()
                ?? doctor?.DoctorSpecialties?.Select(ds => ds.Specialty?.Name).FirstOrDefault();
            return ToDto(p, doctorName, doctorSpecialty);
        }).ToList();

        return Ok(dtos);
    }

    // ─── PUT /api/prescriptions/{id} ──────────────────────────────────────

    /// <summary>
    /// Doctor edits their prescription details.
    /// Updates diagnosis, instructions, fulfillment source, and medicine items.
    /// </summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> UpdatePrescription(int id, [FromBody] UpdatePrescriptionRequestDto request)
    {
        var userId = TryGetUserId();

        var doctor = userId.HasValue
            ? await _db.Doctors
                .Include(d => d.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
                .FirstOrDefaultAsync(d => d.UserId == userId.Value)
            : null;

        if (doctor == null)
        {
            doctor = await _db.Doctors
                .Include(d => d.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
                .FirstOrDefaultAsync();
        }

        var prescription = await _db.Prescriptions
            .Include(p => p.Items)
            .Include(p => p.Patient)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (prescription == null)
            return NotFound(new { message = $"Prescription {id} not found." });

        // Validate updated items
        if (request.Items != null && request.Items.Count > 0)
        {
            foreach (var item in request.Items)
            {
                if (string.IsNullOrWhiteSpace(item.MedicineName))
                    return BadRequest(new { message = "Medicine name is required for all prescription items." });
                if (item.Quantity <= 0)
                    return BadRequest(new { message = $"Quantity for '{item.MedicineName}' must be greater than zero." });
            }
        }

        // Apply patient name & walk-in details updates
        if (request.IsWalkIn.HasValue)
            prescription.IsWalkIn = request.IsWalkIn.Value;

        if (!string.IsNullOrWhiteSpace(request.PatientName))
        {
            prescription.WalkInPatientName = request.PatientName;
            if (prescription.Patient != null)
            {
                prescription.Patient.FullName = request.PatientName;
            }
        }

        if (request.WalkInPatientDetails != null)
        {
            if (!string.IsNullOrWhiteSpace(request.WalkInPatientDetails.FullName))
            {
                prescription.WalkInPatientName = request.WalkInPatientDetails.FullName;
                if (prescription.Patient != null)
                {
                    prescription.Patient.FullName = request.WalkInPatientDetails.FullName;
                }
            }
            if (!string.IsNullOrWhiteSpace(request.WalkInPatientDetails.Age))
                prescription.WalkInPatientAge = request.WalkInPatientDetails.Age;
            if (!string.IsNullOrWhiteSpace(request.WalkInPatientDetails.Gender))
                prescription.WalkInPatientGender = request.WalkInPatientDetails.Gender;
            if (!string.IsNullOrWhiteSpace(request.WalkInPatientDetails.Phone))
                prescription.WalkInPatientPhone = request.WalkInPatientDetails.Phone;
        }

        // Apply updates
        if (!string.IsNullOrWhiteSpace(request.Diagnosis))
            prescription.Diagnosis = request.Diagnosis;

        if (request.Instructions != null)
            prescription.Instructions = request.Instructions;

        if (!string.IsNullOrWhiteSpace(request.FulfillmentSource) &&
            Enum.TryParse<FulfillmentSource>(request.FulfillmentSource, true, out var fs))
            prescription.FulfillmentSource = fs;

        // Replace items if provided
        if (request.Items != null && request.Items.Count > 0)
        {
            _db.PrescriptionItems.RemoveRange(prescription.Items);
            prescription.Items.Clear();

            foreach (var item in request.Items)
            {
                prescription.Items.Add(new PrescriptionItem
                {
                    MedicineId = item.MedicineId,
                    MedicineName = item.MedicineName,
                    Dosage = item.Dosage,
                    Frequency = item.Frequency,
                    Duration = item.Duration,
                    Quantity = item.Quantity,
                    Instructions = item.Instructions
                });
            }
        }

        prescription.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        // Reload with full nav props for response
        var updated = await _db.Prescriptions
            .Include(p => p.Items)
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
                .ThenInclude(d => d.DoctorSpecialties)
                .ThenInclude(ds => ds.Specialty)
            .FirstOrDefaultAsync(p => p.Id == id);

        var doctorName = updated?.Doctor?.FullName ?? doctor?.FullName ?? "Dr. Clinical Specialist";
        var doctorSpecialty = updated?.Doctor?.DoctorSpecialties?.Select(ds => ds.Specialty?.Name).FirstOrDefault()
            ?? doctor?.DoctorSpecialties?.Select(ds => ds.Specialty?.Name).FirstOrDefault();

        return Ok(new
        {
            message = $"Prescription {id} updated successfully.",
            prescription = ToDto(updated!, doctorName, doctorSpecialty)
        });
    }

    // ─── DELETE /api/prescriptions/{id} ───────────────────────────────────

    /// <summary>
    /// Doctor deletes an issued prescription.
    /// Unlinks any linked orders before purging from database.
    /// </summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> CancelPrescription(int id)
    {
        var prescription = await _db.Prescriptions
            .Include(p => p.Items)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (prescription == null)
            return NotFound(new { message = $"Prescription {id} not found." });

        // Unlink associated orders to avoid foreign key constraint violations
        var linkedOrders = await _db.Orders.Where(o => o.PrescriptionId == id).ToListAsync();
        foreach (var order in linkedOrders)
        {
            order.PrescriptionId = null;
        }

        _db.PrescriptionItems.RemoveRange(prescription.Items);
        _db.Prescriptions.Remove(prescription);
        await _db.SaveChangesAsync();

        return Ok(new { message = $"Prescription {id} has been deleted successfully." });
    }

    // ─── POST /api/prescriptions/{id}/screen-interactions ─────────────────

    /// <summary>
    /// Calls the AI Medication Intelligence Agent to screen a prescription
    /// for drug interactions, allergy contraindications, and dosage warnings.
    /// Persists a DrugInteractionLog row for every warning returned.
    /// Only Pharmacists may call this endpoint.
    /// </summary>
    [HttpPost("{id:int}/screen-interactions")]
    [Authorize(Roles = "Pharmacist")]
    public async Task<IActionResult> ScreenInteractions(
        int id,
        [FromQuery] int? pharmacyId)
    {
        // Load prescription with items and patient
        var prescription = await _db.Prescriptions
            .Include(p => p.Items)
            .Include(p => p.Patient)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (prescription == null)
            return NotFound(new { message = $"Prescription {id} not found." });

        var medicationNames = prescription.Items
            .Select(i => string.IsNullOrWhiteSpace(i.Dosage)
                ? i.MedicineName
                : $"{i.MedicineName} {i.Dosage}")
            .ToList();

        if (medicationNames.Count == 0)
            return BadRequest(new { message = "Prescription has no medication items to screen." });

        // Determine out-of-stock medications (requires pharmacyId)
        var outOfStock = new List<string>();
        if (pharmacyId.HasValue)
        {
            foreach (var item in prescription.Items.Where(i => i.MedicineId.HasValue))
            {
                var inv = await _db.InventoryItems
                    .FirstOrDefaultAsync(x =>
                        x.PharmacyId == pharmacyId.Value &&
                        x.MedicineId == item.MedicineId!.Value);

                if (inv != null && inv.CurrentStock == 0)
                    outOfStock.Add($"{item.MedicineName} {item.Dosage}".Trim());
            }
        }

        // Compute patient age from DateOfBirth or walk-in age string
        int? patientAge = null;
        if (prescription.Patient?.DateOfBirth.HasValue == true)
        {
            var dob = prescription.Patient.DateOfBirth.Value;
            patientAge = DateTime.UtcNow.Year - dob.Year;
            if (DateTime.UtcNow.DayOfYear < new DateTime(DateTime.UtcNow.Year, dob.Month, dob.Day).DayOfYear)
                patientAge--;
        }
        else if (!string.IsNullOrWhiteSpace(prescription.WalkInPatientAge) &&
                 int.TryParse(prescription.WalkInPatientAge, out var walkInAge))
        {
            patientAge = walkInAge;
        }

        // Call the AI microservice
        MedicationCheckResultDto aiResult;
        try
        {
            aiResult = await _ai.CheckMedicationSafetyAsync(
                medicationNames,
                prescription.Patient?.Allergies,
                pharmacyId,
                patientAge,
                outOfStock);
        }
        catch (AiServiceUnavailableException ex)
        {
            return StatusCode(503, new
            {
                message = "AI medication-check service is currently unavailable. " +
                          "Manual pharmacist review is required before dispensing.",
                detail = ex.Message
            });
        }

        // Persist DrugInteractionLog rows for every AI-detected warning
        var logIds = new List<int>();

        foreach (var interaction in aiResult.Interactions)
        {
            var drugA = interaction.DrugPair.ElementAtOrDefault(0) ?? "Unknown";
            var drugB = interaction.DrugPair.ElementAtOrDefault(1);
            var log = new DrugInteractionLog
            {
                PrescriptionId = id,
                DrugA = drugA,
                DrugB = drugB,
                WarningType = WarningType.DrugInteraction,
                SeverityLevel = interaction.Severity,
                Description = interaction.Description,
                CreatedAt = DateTime.UtcNow
            };
            _db.DrugInteractionLogs.Add(log);
            await _db.SaveChangesAsync();
            logIds.Add(log.Id);
        }

        foreach (var warning in aiResult.AllergyWarnings)
        {
            var label = warning.Length > 200 ? warning[..200] : warning;
            var log = new DrugInteractionLog
            {
                PrescriptionId = id,
                DrugA = label,
                DrugB = null,
                WarningType = WarningType.AllergyContraindication,
                SeverityLevel = "High",
                Description = warning,
                CreatedAt = DateTime.UtcNow
            };
            _db.DrugInteractionLogs.Add(log);
            await _db.SaveChangesAsync();
            logIds.Add(log.Id);
        }

        foreach (var warning in aiResult.DosageWarnings)
        {
            var label = warning.Length > 200 ? warning[..200] : warning;
            var log = new DrugInteractionLog
            {
                PrescriptionId = id,
                DrugA = label,
                DrugB = null,
                WarningType = WarningType.DosageWarning,
                SeverityLevel = "Moderate",
                Description = warning,
                CreatedAt = DateTime.UtcNow
            };
            _db.DrugInteractionLogs.Add(log);
            await _db.SaveChangesAsync();
            logIds.Add(log.Id);
        }

        return Ok(new ScreenInteractionsResponseDto(aiResult, logIds));
    }

    // ─── POST /api/prescriptions/{id}/acknowledge-warning ─────────────────

    /// <summary>
    /// Pharmacist acknowledges a DrugInteractionLog warning.
    /// High-severity logs require a non-empty PharmacistOverrideNote explaining
    /// why dispensing may proceed despite the clinical warning.
    /// </summary>
    [HttpPost("{id:int}/acknowledge-warning")]
    [Authorize(Roles = "Pharmacist")]
    public async Task<IActionResult> AcknowledgeWarning(
        int id,
        [FromBody] AcknowledgeWarningRequestDto request)
    {
        var userId = TryGetUserId();
        if (userId == null) return Unauthorized();

        var log = await _db.DrugInteractionLogs
            .FirstOrDefaultAsync(l => l.Id == request.LogId);

        if (log == null)
            return NotFound(new { message = $"Warning log {request.LogId} not found." });

        if (log.PrescriptionId != id)
            return BadRequest(new
            {
                message = $"Log {request.LogId} does not belong to prescription {id}."
            });

        if (log.AcknowledgedAt.HasValue)
            return BadRequest(new { message = $"Log {request.LogId} has already been acknowledged." });

        // High-severity warnings require a written pharmacist justification
        if (log.SeverityLevel == "High" && string.IsNullOrWhiteSpace(request.OverrideNote))
            return BadRequest(new
            {
                message = "A PharmacistOverrideNote is required to acknowledge a High-severity warning."
            });

        log.PharmacistId = userId;
        log.PharmacistOverrideNote = request.OverrideNote;
        log.AcknowledgedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = $"Warning log {log.Id} acknowledged successfully.",
            logId = log.Id,
            warningType = log.WarningType.ToString(),
            severityLevel = log.SeverityLevel,
            acknowledgedAt = log.AcknowledgedAt
        });
    }

    // ─── GET /api/prescriptions/{id}/interaction-logs ────────────────────

    /// <summary>
    /// Gets all active DrugInteractionLogs for a prescription.
    /// </summary>
    [HttpGet("{id:int}/interaction-logs")]
    [Authorize(Roles = "Pharmacist,Doctor")]
    public async Task<IActionResult> GetInteractionLogs(int id)
    {
        var logs = await _db.DrugInteractionLogs
            .Where(l => l.PrescriptionId == id)
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();

        return Ok(logs);
    }
}

