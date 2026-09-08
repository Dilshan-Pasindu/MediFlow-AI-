using MediFlow.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MediFlow.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // ─────────────────────────────────────────────────────────────────────
    // SHARED (used across all members)
    // ─────────────────────────────────────────────────────────────────────
    public DbSet<User> Users => Set<User>();

    // ─────────────────────────────────────────────────────────────────────
    // MEMBER 1 — Patient & Appointment Management
    // ─────────────────────────────────────────────────────────────────────
    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<Doctor> Doctors => Set<Doctor>();
    public DbSet<Specialty> Specialties => Set<Specialty>();
    public DbSet<DoctorSpecialty> DoctorSpecialties => Set<DoctorSpecialty>();
    public DbSet<DoctorAvailability> DoctorAvailabilities => Set<DoctorAvailability>();
    public DbSet<DoctorRating> DoctorRatings => Set<DoctorRating>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<AppointmentPayment> AppointmentPayments => Set<AppointmentPayment>();
    public DbSet<SymptomSubmission> SymptomSubmissions => Set<SymptomSubmission>();

    // ─────────────────────────────────────────────────────────────────────
    // MEMBER 2 — Doctor Consultation & Clinical Management
    // (Member 2 will add their DbSet<> entries here)
    // ─────────────────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────────────────
    // MEMBER 3 — E-Prescription & Medicine Ordering
    // (Member 3 will add their DbSet<> entries here)
    // ─────────────────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────────────────
    // MEMBER 4 — Pharmacy Inventory & Supplier Management
    // (Member 4 will add their DbSet<> entries here)
    // ─────────────────────────────────────────────────────────────────────

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── User ──────────────────────────────────────────────────────────
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Email).IsRequired().HasMaxLength(255);
            entity.Property(u => u.FullName).IsRequired().HasMaxLength(150);
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.Role).HasConversion<string>();
        });

        // ── Patient ───────────────────────────────────────────────────────
        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.FullName).IsRequired().HasMaxLength(150);
            entity.Property(p => p.Email).IsRequired().HasMaxLength(255);
        });

        // ── Doctor ────────────────────────────────────────────────────────
        modelBuilder.Entity<Doctor>(entity =>
        {
            entity.HasKey(d => d.Id);
            entity.Property(d => d.FullName).IsRequired().HasMaxLength(150);
            entity.Property(d => d.ConsultationFee).HasColumnType("decimal(10,2)");
        });

        // ── Specialty ─────────────────────────────────────────────────────
        modelBuilder.Entity<Specialty>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.HasIndex(s => s.Name).IsUnique();
            entity.Property(s => s.Name).IsRequired().HasMaxLength(100);
        });

        // ── DoctorSpecialty (join table) ──────────────────────────────────
        modelBuilder.Entity<DoctorSpecialty>(entity =>
        {
            entity.HasKey(ds => ds.Id);
            // Prevent duplicate doctor-specialty pairs
            entity.HasIndex(ds => new { ds.DoctorId, ds.SpecialtyId }).IsUnique();

            entity.HasOne(ds => ds.Doctor)
                .WithMany(d => d.DoctorSpecialties)
                .HasForeignKey(ds => ds.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ds => ds.Specialty)
                .WithMany(s => s.DoctorSpecialties)
                .HasForeignKey(ds => ds.SpecialtyId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── DoctorAvailability ────────────────────────────────────────────
        modelBuilder.Entity<DoctorAvailability>(entity =>
        {
            entity.HasKey(da => da.Id);

            entity.HasOne(da => da.Doctor)
                .WithMany(d => d.Availabilities)
                .HasForeignKey(da => da.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── DoctorRating ──────────────────────────────────────────────────
        modelBuilder.Entity<DoctorRating>(entity =>
        {
            entity.HasKey(dr => dr.Id);
            // One rating per patient per appointment
            entity.HasIndex(dr => dr.AppointmentId).IsUnique();
            entity.Property(dr => dr.Stars).IsRequired();

            entity.HasOne(dr => dr.Doctor)
                .WithMany(d => d.Ratings)
                .HasForeignKey(dr => dr.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(dr => dr.Appointment)
                .WithMany()
                .HasForeignKey(dr => dr.AppointmentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── Appointment ───────────────────────────────────────────────────
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.Status).HasConversion<string>();
            entity.Property(a => a.Fee).HasColumnType("decimal(10,2)");
            // Index for fast queries by doctor+date and patient
            entity.HasIndex(a => new { a.DoctorId, a.AppointmentDateTime });
            entity.HasIndex(a => a.PatientId);
            entity.HasIndex(a => a.AppointmentNumber);

            entity.HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Doctor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Payment)
                .WithOne(ap => ap.Appointment)
                .HasForeignKey<AppointmentPayment>(ap => ap.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── AppointmentPayment ────────────────────────────────────────────
        modelBuilder.Entity<AppointmentPayment>(entity =>
        {
            entity.HasKey(ap => ap.Id);
            entity.Property(ap => ap.Amount).HasColumnType("decimal(10,2)");
            entity.Property(ap => ap.Status).HasConversion<string>();
        });

        // ── SymptomSubmission ─────────────────────────────────────────────
        modelBuilder.Entity<SymptomSubmission>(entity =>
        {
            entity.HasKey(ss => ss.Id);
            entity.Property(ss => ss.SymptomsText).IsRequired();

            entity.HasOne(ss => ss.Patient)
                .WithMany(p => p.SymptomSubmissions)
                .HasForeignKey(ss => ss.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
