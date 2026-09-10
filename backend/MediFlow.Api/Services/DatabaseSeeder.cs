using MediFlow.Api.Data;
using MediFlow.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MediFlow.Api.Services;

/// <summary>
/// Seeds the database with initial specialties, doctors, demo staff accounts, availability data, and sample appointments.
/// Seeds the database with initial specialties, doctors, demo staff accounts, and availability data.
/// Member 4: Also seeds Pharmacy, SupplierProfile, Medicines, InventoryItems, and InventoryBatches.
/// </summary>
public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        // ── Seed Specialties if missing ──────────────────────────────────
        if (!await db.Specialties.AnyAsync())
        {
            var specialties = new List<Specialty>
            {
                new() { Name = "Cardiology", Description = "Heart and cardiovascular system", Icon = "❤️" },
                new() { Name = "Dermatology", Description = "Skin, hair, and nail conditions", Icon = "🧴" },
                new() { Name = "Neurology", Description = "Brain and nervous system", Icon = "🧠" },
                new() { Name = "Orthopedics", Description = "Bones, joints, and muscles", Icon = "🦴" },
                new() { Name = "ENT", Description = "Ear, nose, and throat", Icon = "👂" },
                new() { Name = "General Medicine", Description = "General health and wellness", Icon = "🩺" },
                new() { Name = "Pediatrics", Description = "Child healthcare", Icon = "👶" },
                new() { Name = "Ophthalmology", Description = "Eye care and vision", Icon = "👁️" },
            };
            db.Specialties.AddRange(specialties);
            await db.SaveChangesAsync();
        }

        // ── Seed Core Role Demo Users if missing ──────────────────────────
        var staffUsers = new List<(string Email, string Name, string Phone, UserRole Role, string Password)>
        {
            ("dilshan@gmail.com", "Dilshan Pasindu", "+94771234567", UserRole.Patient, "Test@123"),
            ("receptionist@mediflow.lk", "Kamani Rajapaksa", "+94772000001", UserRole.Receptionist, "Staff@123"),
            ("pharmacist@mediflow.lk", "Sunil Weerasinghe", "+94773000001", UserRole.Pharmacist, "Staff@123"),
            ("pharmacyowner@mediflow.lk", "Ananda Wickramasinghe", "+94774000001", UserRole.PharmacyOwner, "Staff@123"),
            ("supplier@mediflow.lk", "MedPharm Global Supplies", "+94775000001", UserRole.Supplier, "Staff@123"),
            ("admin@mediflow.lk", "System Administrator", "+94776000001", UserRole.Administrator, "Admin@123"),
        };

        foreach (var staff in staffUsers)
        {
            if (!await db.Users.AnyAsync(u => u.Email == staff.Email))
            {
                var u = new User
                {
                    FullName = staff.Name,
                    Email = staff.Email,
                    PhoneNumber = staff.Phone,
                    Role = staff.Role,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(staff.Password),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                db.Users.Add(u);
                await db.SaveChangesAsync();

                if (staff.Role == UserRole.Patient && !await db.Patients.AnyAsync(p => p.UserId == u.Id))
                {
                    db.Patients.Add(new Patient
                    {
                        UserId = u.Id,
                        FullName = u.FullName,
                        Email = u.Email,
                        PhoneNumber = u.PhoneNumber,
                        BloodGroup = "O+",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                    await db.SaveChangesAsync();
                }
            }
        }

        // ── Seed Doctors if missing ──────────────────────────────────────
        if (!await db.Doctors.AnyAsync())
        {
            var doctorUsers = new List<User>
            {
                new() { FullName = "Dr. Nimal Perera", Email = "nimal.perera@mediflow.lk", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor@123"), PhoneNumber = "+94771000001", Role = UserRole.Doctor },
                new() { FullName = "Dr. Priya Fernando", Email = "priya.fernando@mediflow.lk", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor@123"), PhoneNumber = "+94771000002", Role = UserRole.Doctor },
                new() { FullName = "Dr. Kamal Silva", Email = "kamal.silva@mediflow.lk", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor@123"), PhoneNumber = "+94771000003", Role = UserRole.Doctor },
                new() { FullName = "Dr. Anusha Jayawardena", Email = "anusha.j@mediflow.lk", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor@123"), PhoneNumber = "+94771000004", Role = UserRole.Doctor },
                new() { FullName = "Dr. Ruwan Bandara", Email = "ruwan.b@mediflow.lk", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor@123"), PhoneNumber = "+94771000005", Role = UserRole.Doctor },
                new() { FullName = "Dr. Sachini Wickrama", Email = "sachini.w@mediflow.lk", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor@123"), PhoneNumber = "+94771000006", Role = UserRole.Doctor },
            };
            db.Users.AddRange(doctorUsers);
            await db.SaveChangesAsync();

            var doctors = new List<Doctor>
            {
                new() { UserId = doctorUsers[0].Id, FullName = "Dr. Nimal Perera", Bio = "Senior Cardiologist at National Hospital Colombo with 15+ years experience", Qualifications = "MBBS, MD (Cardiology), FCCP", ExperienceYears = 15, ConsultationFee = 3500 },
                new() { UserId = doctorUsers[1].Id, FullName = "Dr. Priya Fernando", Bio = "Consultant Dermatologist specializing in cosmetic and clinical dermatology", Qualifications = "MBBS, MD (Dermatology)", ExperienceYears = 10, ConsultationFee = 3000 },
                new() { UserId = doctorUsers[2].Id, FullName = "Dr. Kamal Silva", Bio = "General Practitioner at Lanka Hospitals with broad clinical experience", Qualifications = "MBBS, Dip. Family Medicine", ExperienceYears = 8, ConsultationFee = 1500 },
                new() { UserId = doctorUsers[3].Id, FullName = "Dr. Anusha Jayawardena", Bio = "Neurologist specializing in headache disorders and epilepsy", Qualifications = "MBBS, MD (Neurology), MRCP", ExperienceYears = 12, ConsultationFee = 4000 },
                new() { UserId = doctorUsers[4].Id, FullName = "Dr. Ruwan Bandara", Bio = "Orthopedic surgeon specializing in sports injuries and joint replacements", Qualifications = "MBBS, MS (Ortho), FRCS", ExperienceYears = 14, ConsultationFee = 4500 },
                new() { UserId = doctorUsers[5].Id, FullName = "Dr. Sachini Wickrama", Bio = "Pediatrician with special interest in childhood nutrition and development", Qualifications = "MBBS, DCH, MD (Paediatrics)", ExperienceYears = 9, ConsultationFee = 2500 },
            };
            db.Doctors.AddRange(doctors);
            await db.SaveChangesAsync();

            var specialtiesList = await db.Specialties.ToListAsync();
            var cardiology = specialtiesList.FirstOrDefault(s => s.Name == "Cardiology");
            var dermatology = specialtiesList.FirstOrDefault(s => s.Name == "Dermatology");
            var generalMed = specialtiesList.FirstOrDefault(s => s.Name == "General Medicine");
            var neurology = specialtiesList.FirstOrDefault(s => s.Name == "Neurology");
            var ortho = specialtiesList.FirstOrDefault(s => s.Name == "Orthopedics");
            var pediatrics = specialtiesList.FirstOrDefault(s => s.Name == "Pediatrics");

            if (cardiology != null) db.DoctorSpecialties.Add(new DoctorSpecialty { DoctorId = doctors[0].Id, SpecialtyId = cardiology.Id });
            if (dermatology != null) db.DoctorSpecialties.Add(new DoctorSpecialty { DoctorId = doctors[1].Id, SpecialtyId = dermatology.Id });
            if (generalMed != null) db.DoctorSpecialties.Add(new DoctorSpecialty { DoctorId = doctors[2].Id, SpecialtyId = generalMed.Id });
            if (neurology != null) db.DoctorSpecialties.Add(new DoctorSpecialty { DoctorId = doctors[3].Id, SpecialtyId = neurology.Id });
            if (ortho != null) db.DoctorSpecialties.Add(new DoctorSpecialty { DoctorId = doctors[4].Id, SpecialtyId = ortho.Id });
            if (pediatrics != null) db.DoctorSpecialties.Add(new DoctorSpecialty { DoctorId = doctors[5].Id, SpecialtyId = pediatrics.Id });

            await db.SaveChangesAsync();

            // ── Doctor Availability ──────────────────────────────────────────
            var days = new[] { DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Saturday, DayOfWeek.Sunday };
            foreach (var doctor in doctors)
            {
                foreach (var day in days)
                {
                    db.DoctorAvailabilities.Add(new DoctorAvailability
                    {
                        DoctorId = doctor.Id,
                        DayOfWeek = day,
                        StartTime = new TimeOnly(9, 0),
                        EndTime = new TimeOnly(17, 0)
                    });
                }
            }
            await db.SaveChangesAsync();
        }

        // ── Seed Sample Appointments if missing ─────────────────────────────
        if (!await db.Appointments.AnyAsync())
        {
            var doctors = await db.Doctors.ToListAsync();
            var mainDoctor = doctors.FirstOrDefault(d => d.FullName.Contains("Nimal")) ?? doctors.FirstOrDefault();

            if (mainDoctor != null)
            {
                var patientNames = new[] { "Kasun Kalhara", "Sarath Perera", "Kanthi Jayasinghe", "Chamari Athapaththu", "Nalaka Silva", "Dilshan Pasindu" };
                var bloodGroups = new[] { "A+", "B+", "O+", "AB+", "O-", "B+" };
                var samplePatients = new List<Patient>();

                for (int i = 0; i < patientNames.Length; i++)
                {
                    var pName = patientNames[i];
                    var bg = bloodGroups[i];
                    var p = await db.Patients.FirstOrDefaultAsync(x => x.FullName == pName);
                    if (p == null)
                    {
                        p = new Patient
                        {
                            FullName = pName,
                            Email = $"{pName.ToLower().Replace(" ", ".")}@example.com",
                            PhoneNumber = "+94770001122",
                            BloodGroup = bg,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };
                        db.Patients.Add(p);
                        await db.SaveChangesAsync();
                    }
                    samplePatients.Add(p);
                }

                var today = DateTime.UtcNow;

                var sampleAppts = new List<Appointment>
                {
                    new()
                    {
                        PatientId = samplePatients[0].Id,
                        DoctorId = mainDoctor.Id,
                        AppointmentDateTime = new DateTime(today.Year, today.Month, today.Day, 9, 30, 0, DateTimeKind.Utc),
                        AppointmentNumber = $"APT-{today:yyyyMMdd}-0001",
                        Status = AppointmentStatus.Confirmed,
                        Fee = mainDoctor.ConsultationFee,
                        Notes = "Experiencing chest tightness and mild shortness of breath after morning walk.",
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        PatientId = samplePatients[1].Id,
                        DoctorId = mainDoctor.Id,
                        AppointmentDateTime = new DateTime(today.Year, today.Month, today.Day, 10, 45, 0, DateTimeKind.Utc),
                        AppointmentNumber = $"APT-{today:yyyyMMdd}-0002",
                        Status = AppointmentStatus.Confirmed,
                        Fee = mainDoctor.ConsultationFee,
                        Notes = "Routine hypertension review and blood pressure medication checkup.",
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        PatientId = samplePatients[2].Id,
                        DoctorId = mainDoctor.Id,
                        AppointmentDateTime = new DateTime(today.Year, today.Month, today.Day, 11, 30, 0, DateTimeKind.Utc),
                        AppointmentNumber = $"APT-{today:yyyyMMdd}-0003",
                        Status = AppointmentStatus.Confirmed,
                        Fee = mainDoctor.ConsultationFee,
                        Notes = "Follow up on ECG results and lipid profile report.",
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        PatientId = samplePatients[3].Id,
                        DoctorId = mainDoctor.Id,
                        AppointmentDateTime = new DateTime(today.Year, today.Month, today.Day, 14, 0, 0, DateTimeKind.Utc),
                        AppointmentNumber = $"APT-{today:yyyyMMdd}-0004",
                        Status = AppointmentStatus.Pending,
                        Fee = mainDoctor.ConsultationFee,
                        Notes = "Intermittent palpitations during rest.",
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        PatientId = samplePatients[4].Id,
                        DoctorId = mainDoctor.Id,
                        AppointmentDateTime = today.AddDays(-1),
                        AppointmentNumber = $"APT-{today.AddDays(-1):yyyyMMdd}-0005",
                        Status = AppointmentStatus.Completed,
                        Fee = mainDoctor.ConsultationFee,
                        Notes = "Completed cardiac evaluation. Prescribed Amlodipine 5mg.",
                        CreatedAt = DateTime.UtcNow.AddDays(-1)
                    },
                    new()
                    {
                        PatientId = samplePatients[5].Id,
                        DoctorId = mainDoctor.Id,
                        AppointmentDateTime = today.AddDays(1),
                        AppointmentNumber = $"APT-{today.AddDays(1):yyyyMMdd}-0006",
                        Status = AppointmentStatus.Confirmed,
                        Fee = mainDoctor.ConsultationFee,
                        Notes = "Annual health checkup and stress test recommendation.",
                        CreatedAt = DateTime.UtcNow
                    }
                };

                db.Appointments.AddRange(sampleAppts);
                await db.SaveChangesAsync();
            }
        }
        // ════════════════════════════════════════════════════════════════
        // MEMBER 4 — Pharmacy, Supplier, Medicine & Inventory Seed Data
        // ════════════════════════════════════════════════════════════════

        // ── Seed Medicine Catalog ────────────────────────────────────────
        if (!await db.Medicines.AnyAsync())
        {
            var medicines = new List<Medicine>
            {
                new() { MedicineName = "Omeprazole 20mg", GenericName = "Omeprazole", Category = "Gastro", UnitOfMeasure = "Capsule" },
                new() { MedicineName = "Paracetamol 500mg", GenericName = "Paracetamol", Category = "Pain Relief", UnitOfMeasure = "Tablet" },
                new() { MedicineName = "Amoxicillin 250mg", GenericName = "Amoxicillin", Category = "Antibiotics", UnitOfMeasure = "Capsule" },
                new() { MedicineName = "Metformin 500mg", GenericName = "Metformin", Category = "Diabetes", UnitOfMeasure = "Tablet" },
                new() { MedicineName = "Atorvastatin 10mg", GenericName = "Atorvastatin", Category = "Cardiology", UnitOfMeasure = "Tablet" },
                new() { MedicineName = "Aspirin 75mg", GenericName = "Aspirin", Category = "Cardiology", UnitOfMeasure = "Tablet" },
                new() { MedicineName = "Losartan 50mg", GenericName = "Losartan", Category = "Cardiology", UnitOfMeasure = "Tablet" },
                new() { MedicineName = "Cetirizine 10mg", GenericName = "Cetirizine", Category = "Allergy", UnitOfMeasure = "Tablet" },
                new() { MedicineName = "Ibuprofen 400mg", GenericName = "Ibuprofen", Category = "Pain Relief", UnitOfMeasure = "Tablet" },
                new() { MedicineName = "Salbutamol Inhaler", GenericName = "Salbutamol", Category = "Respiratory", UnitOfMeasure = "Inhaler" },
            };
            db.Medicines.AddRange(medicines);
            await db.SaveChangesAsync();
        }

        // ── Seed Pharmacy (linked to demo PharmacyOwner) ─────────────────
        if (!await db.Pharmacies.AnyAsync())
        {
            var ownerUser = await db.Users.FirstOrDefaultAsync(u => u.Email == "pharmacyowner@mediflow.lk");
            if (ownerUser != null)
            {
                var pharmacy = new Pharmacy
                {
                    Name = "MediFlow Central Pharmacy",
                    Location = "123, Galle Road, Colombo 03",
                    ContactNumber = "+94112345678",
                    OwnerId = ownerUser.Id
                };
                db.Pharmacies.Add(pharmacy);
                await db.SaveChangesAsync();

                // ── Seed InventoryItems for the pharmacy ─────────────────
                var medicines = await db.Medicines.ToListAsync();
                var now = DateTime.UtcNow;

                // Data represents a mix of healthy, low, and critical stock levels for demo
                var inventoryData = new[]
                {
                    new { Name = "Omeprazole 20mg",     Stock = 8,   Min = 50,  Price = 45m  },
                    new { Name = "Paracetamol 500mg",   Stock = 420, Min = 200, Price = 12m  },
                    new { Name = "Amoxicillin 250mg",   Stock = 12,  Min = 80,  Price = 35m  },
                    new { Name = "Metformin 500mg",     Stock = 95,  Min = 100, Price = 28m  },
                    new { Name = "Atorvastatin 10mg",   Stock = 5,   Min = 60,  Price = 62m  },
                    new { Name = "Aspirin 75mg",        Stock = 310, Min = 150, Price = 15m  },
                    new { Name = "Losartan 50mg",       Stock = 18,  Min = 70,  Price = 55m  },
                    new { Name = "Cetirizine 10mg",     Stock = 200, Min = 100, Price = 22m  },
                    new { Name = "Ibuprofen 400mg",     Stock = 75,  Min = 120, Price = 30m  },
                    new { Name = "Salbutamol Inhaler",  Stock = 25,  Min = 30,  Price = 850m },
                };

                foreach (var d in inventoryData)
                {
                    var medicine = medicines.FirstOrDefault(m => m.MedicineName == d.Name);
                    if (medicine == null) continue;

                    var item = new InventoryItem
                    {
                        PharmacyId = pharmacy.Id,
                        MedicineId = medicine.Id,
                        CurrentStock = d.Stock,
                        MinStockLevel = d.Min,
                        UnitPrice = d.Price
                    };
                    db.InventoryItems.Add(item);
                    await db.SaveChangesAsync();

                    // Seed an initial batch for each item
                    db.InventoryBatches.Add(new InventoryBatch
                    {
                        InventoryItemId = item.Id,
                        BatchNumber = $"INIT-{medicine.Id:D3}-2026",
                        Quantity = d.Stock,
                        ExpiryDate = now.AddMonths(18),
                        ReceivedDate = now.AddDays(-30)
                    });

                    // Seed initial restock transaction for audit trail
                    db.InventoryTransactions.Add(new InventoryTransaction
                    {
                        InventoryItemId = item.Id,
                        TransactionType = TransactionType.Restock,
                        QuantityChanged = d.Stock,
                        StockAfter = d.Stock,
                        TransactionDate = now.AddDays(-30),
                        Notes = "Initial stock load"
                    });
                }

                // Seed 30 days of dispense history to enable demand calculations by the AI Agent
                var rand = new Random(42); // Fixed seed for reproducibility
                var inventoryItems = await db.InventoryItems.Where(i => i.PharmacyId == pharmacy.Id).ToListAsync();
                for (int daysAgo = 29; daysAgo >= 1; daysAgo--)
                {
                    foreach (var item in inventoryItems)
                    {
                        var dispensed = rand.Next(0, 8); // 0–7 units/day per item
                        if (dispensed > 0)
                        {
                            db.InventoryTransactions.Add(new InventoryTransaction
                            {
                                InventoryItemId = item.Id,
                                TransactionType = TransactionType.Dispense,
                                QuantityChanged = -dispensed,
                                StockAfter = Math.Max(0, item.CurrentStock - dispensed),
                                TransactionDate = now.AddDays(-daysAgo),
                                Notes = "Prescription dispense"
                            });
                        }
                    }
                }

                await db.SaveChangesAsync();
            }
        }

        // ── Seed SupplierProfile (linked to demo Supplier user) ──────────
        if (!await db.SupplierProfiles.AnyAsync())
        {
            var supplierUser = await db.Users.FirstOrDefaultAsync(u => u.Email == "supplier@mediflow.lk");
            if (supplierUser != null)
            {
                db.SupplierProfiles.Add(new SupplierProfile
                {
                    UserId = supplierUser.Id,
                    CompanyName = "MedPharm Global Supplies",
                    ContactEmail = "supplier@mediflow.lk",
                    ContactPhone = "+94775000001",
                    Address = "456, Industrial Zone, Ekala, Ja-Ela",
                    IsActive = true
                });
                await db.SaveChangesAsync();
            }
        }
    }
}
