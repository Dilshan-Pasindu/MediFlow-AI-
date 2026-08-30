using MediFlow.Api.Data;
using MediFlow.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MediFlow.Api.Services;

/// <summary>
/// Seeds the database with initial specialties, doctors, and availability data.
/// </summary>
public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        // Only seed if Specialties table is empty
        if (await db.Specialties.AnyAsync()) return;

        // ── Specialties ───────────────────────────────────────────────────
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

        // ── Doctors ───────────────────────────────────────────────────────
        // Create User accounts for doctors first
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

        // ── Doctor-Specialty Links ────────────────────────────────────────
        var cardiology = specialties.First(s => s.Name == "Cardiology");
        var dermatology = specialties.First(s => s.Name == "Dermatology");
        var generalMed = specialties.First(s => s.Name == "General Medicine");
        var neurology = specialties.First(s => s.Name == "Neurology");
        var ortho = specialties.First(s => s.Name == "Orthopedics");
        var pediatrics = specialties.First(s => s.Name == "Pediatrics");

        db.DoctorSpecialties.AddRange(
            new DoctorSpecialty { DoctorId = doctors[0].Id, SpecialtyId = cardiology.Id },
            new DoctorSpecialty { DoctorId = doctors[1].Id, SpecialtyId = dermatology.Id },
            new DoctorSpecialty { DoctorId = doctors[2].Id, SpecialtyId = generalMed.Id },
            new DoctorSpecialty { DoctorId = doctors[3].Id, SpecialtyId = neurology.Id },
            new DoctorSpecialty { DoctorId = doctors[4].Id, SpecialtyId = ortho.Id },
            new DoctorSpecialty { DoctorId = doctors[5].Id, SpecialtyId = pediatrics.Id }
        );
        await db.SaveChangesAsync();

        // ── Doctor Availability ──────────────────────────────────────────
        var days = new[] { DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday };
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
            // Add Saturday slot for some variety
            db.DoctorAvailabilities.Add(new DoctorAvailability
            {
                DoctorId = doctor.Id,
                DayOfWeek = DayOfWeek.Saturday,
                StartTime = new TimeOnly(10, 0),
                EndTime = new TimeOnly(14, 0)
            });
        }
        await db.SaveChangesAsync();
    }
}
