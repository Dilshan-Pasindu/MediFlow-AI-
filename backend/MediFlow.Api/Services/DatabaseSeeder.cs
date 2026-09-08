using MediFlow.Api.Data;
using MediFlow.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MediFlow.Api.Services;

/// <summary>
/// Seeds the database with initial specialties, doctors, demo staff accounts, and availability data.
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
            var days = new[] { DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday, DayOfWeek.Saturday };
            foreach (var doctor in doctors)
            {
                foreach (var day in days)
                {
                    db.DoctorAvailabilities.Add(new DoctorAvailability
                    {
                        DoctorId = doctor.Id,
                        DayOfWeek = day,
                        StartTime = new TimeOnly(9, 0),
                        EndTime = new TimeOnly(13, 0)
                    });
                }
            }
            await db.SaveChangesAsync();
        }
    }
}
