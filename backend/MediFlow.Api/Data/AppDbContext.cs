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
    public DbSet<Notification> Notifications => Set<Notification>();

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
    public DbSet<DoctorLeave> DoctorLeaves => Set<DoctorLeave>();

    // ─────────────────────────────────────────────────────────────────────
    // MEMBER 2 — Doctor Consultation & Clinical Management
    // (Member 2 will add their DbSet<> entries here)
    // ─────────────────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────────────────
    // MEMBER 3 — E-Prescription & Medicine Ordering
    // ─────────────────────────────────────────────────────────────────────
    public DbSet<Prescription> Prescriptions => Set<Prescription>();
    public DbSet<PrescriptionItem> PrescriptionItems => Set<PrescriptionItem>();
    public DbSet<MedicineOrder> Orders => Set<MedicineOrder>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<DrugInteractionLog> DrugInteractionLogs => Set<DrugInteractionLog>();

    // ─────────────────────────────────────────────────────────────────────
    // MEMBER 4 — Pharmacy Inventory & Supplier Management
    // ─────────────────────────────────────────────────────────────────────
    public DbSet<Pharmacy> Pharmacies => Set<Pharmacy>();
    public DbSet<SupplierProfile> SupplierProfiles => Set<SupplierProfile>();
    public DbSet<Medicine> Medicines => Set<Medicine>();
    public DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();
    public DbSet<InventoryBatch> InventoryBatches => Set<InventoryBatch>();
    public DbSet<RestockRequest> RestockRequests => Set<RestockRequest>();
    public DbSet<RestockRequestItem> RestockRequestItems => Set<RestockRequestItem>();
    public DbSet<InventoryTransaction> InventoryTransactions => Set<InventoryTransaction>();

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

        // ── DoctorLeave ───────────────────────────────────────────────────
        modelBuilder.Entity<DoctorLeave>(entity =>
        {
            entity.HasKey(dl => dl.Id);
            entity.Property(dl => dl.Reason).HasMaxLength(500);

            entity.HasOne(dl => dl.Doctor)
                .WithMany(d => d.Leaves)
                .HasForeignKey(dl => dl.DoctorId)
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

        // ════════════════════════════════════════════════════════════════
        // MEMBER 3 — E-Prescription & Medicine Ordering
        // ════════════════════════════════════════════════════════════════

        // ── Prescription ──────────────────────────────────────────────────
        modelBuilder.Entity<Prescription>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Status).HasConversion<string>();
            entity.Property(p => p.FulfillmentSource).HasConversion<string>();
            entity.Property(p => p.Recipients).HasConversion<string>();
            entity.HasIndex(p => p.DoctorId);
            entity.HasIndex(p => p.PatientId);
            entity.HasIndex(p => p.Status);

            // FK into Member 1 — Doctor (Restrict: deleting a doctor must not cascade)
            entity.HasOne(p => p.Doctor)
                .WithMany()
                .HasForeignKey(p => p.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // FK into Member 1 — Patient (nullable; Restrict to protect patient history)
            entity.HasOne(p => p.Patient)
                .WithMany()
                .HasForeignKey(p => p.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            // FK into Member 1 — Appointment (nullable soft link; Restrict)
            entity.HasOne(p => p.Appointment)
                .WithMany()
                .HasForeignKey(p => p.AppointmentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── PrescriptionItem ──────────────────────────────────────────────
        modelBuilder.Entity<PrescriptionItem>(entity =>
        {
            entity.HasKey(pi => pi.Id);
            entity.Property(pi => pi.MedicineName).IsRequired().HasMaxLength(200);
            entity.Property(pi => pi.Dosage).HasMaxLength(100);
            entity.Property(pi => pi.Frequency).HasMaxLength(100);
            entity.Property(pi => pi.Duration).HasMaxLength(100);
            entity.HasIndex(pi => pi.PrescriptionId);

            // Parent Prescription — Cascade: items are deleted with their prescription
            entity.HasOne(pi => pi.Prescription)
                .WithMany(p => p.Items)
                .HasForeignKey(pi => pi.PrescriptionId)
                .OnDelete(DeleteBehavior.Cascade);

            // FK into Member 4 — Medicine catalogue (nullable; Restrict)
            entity.HasOne(pi => pi.Medicine)
                .WithMany()
                .HasForeignKey(pi => pi.MedicineId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── MedicineOrder ─────────────────────────────────────────────────
        modelBuilder.Entity<MedicineOrder>(entity =>
        {
            entity.HasKey(o => o.Id);
            entity.Property(o => o.Status).HasConversion<string>();
            entity.Property(o => o.TotalAmount).HasColumnType("decimal(10,2)");
            entity.HasIndex(o => o.PrescriptionId);
            entity.HasIndex(o => o.PatientId);
            entity.HasIndex(o => o.PharmacyId);
            entity.HasIndex(o => o.Status);

            // FK into Member 3 — Prescription (nullable; Restrict)
            entity.HasOne(o => o.Prescription)
                .WithMany(p => p.Orders)
                .HasForeignKey(o => o.PrescriptionId)
                .OnDelete(DeleteBehavior.Restrict);

            // FK into Member 1 — Patient (nullable; Restrict)
            entity.HasOne(o => o.Patient)
                .WithMany()
                .HasForeignKey(o => o.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            // FK into Member 4 — Pharmacy (nullable; Restrict)
            entity.HasOne(o => o.Pharmacy)
                .WithMany()
                .HasForeignKey(o => o.PharmacyId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── OrderItem ─────────────────────────────────────────────────────
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(oi => oi.Id);
            entity.Property(oi => oi.MedicineName).IsRequired().HasMaxLength(200);
            entity.Property(oi => oi.Dosage).HasMaxLength(100);
            entity.Property(oi => oi.UnitPrice).HasColumnType("decimal(10,2)");
            entity.Property(oi => oi.Subtotal).HasColumnType("decimal(10,2)");
            entity.HasIndex(oi => oi.MedicineOrderId);

            // Parent MedicineOrder — Cascade: items are deleted with their order
            entity.HasOne(oi => oi.MedicineOrder)
                .WithMany(o => o.Items)
                .HasForeignKey(oi => oi.MedicineOrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // FK into Member 4 — Medicine catalogue (nullable; Restrict)
            entity.HasOne(oi => oi.Medicine)
                .WithMany()
                .HasForeignKey(oi => oi.MedicineId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── DrugInteractionLog ────────────────────────────────────────────
        modelBuilder.Entity<DrugInteractionLog>(entity =>
        {
            entity.HasKey(d => d.Id);
            entity.Property(d => d.DrugA).IsRequired().HasMaxLength(200);
            entity.Property(d => d.DrugB).HasMaxLength(200);
            entity.Property(d => d.SeverityLevel).IsRequired().HasMaxLength(20);
            entity.Property(d => d.Description).IsRequired();
            entity.Property(d => d.WarningType).HasConversion<string>();
            entity.HasIndex(d => d.PrescriptionId);
            entity.HasIndex(d => new { d.PrescriptionId, d.AcknowledgedAt });

            // FK → Prescription (Cascade: logs deleted when prescription is deleted)
            entity.HasOne(d => d.Prescription)
                .WithMany()
                .HasForeignKey(d => d.PrescriptionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ════════════════════════════════════════════════════════════════
        // MEMBER 4 — Pharmacy Inventory & Supplier Management
        // ════════════════════════════════════════════════════════════════

        // ── Pharmacy ─────────────────────────────────────────────────────
        modelBuilder.Entity<Pharmacy>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
            entity.Property(p => p.Location).HasMaxLength(500);
            entity.Property(p => p.ContactNumber).HasMaxLength(20);

            entity.HasOne(p => p.Owner)
                .WithMany()
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── SupplierProfile ────────────────────────────────────────────
        modelBuilder.Entity<SupplierProfile>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.HasIndex(s => s.UserId).IsUnique(); // one profile per user
            entity.Property(s => s.CompanyName).IsRequired().HasMaxLength(200);
            entity.Property(s => s.ContactEmail).HasMaxLength(255);
            entity.Property(s => s.ContactPhone).HasMaxLength(20);

            entity.HasOne(s => s.User)
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── Medicine ──────────────────────────────────────────────────
        modelBuilder.Entity<Medicine>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.HasIndex(m => m.MedicineName);
            entity.Property(m => m.MedicineName).IsRequired().HasMaxLength(200);
            entity.Property(m => m.GenericName).HasMaxLength(200);
            entity.Property(m => m.Category).HasMaxLength(100);
            entity.Property(m => m.UnitOfMeasure).HasMaxLength(50);
        });

        // ── InventoryItem ──────────────────────────────────────────────
        modelBuilder.Entity<InventoryItem>(entity =>
        {
            entity.HasKey(i => i.Id);
            // Unique per pharmacy+medicine combination
            entity.HasIndex(i => new { i.PharmacyId, i.MedicineId }).IsUnique();
            entity.Property(i => i.UnitPrice).HasColumnType("decimal(10,2)");

            entity.HasOne(i => i.Pharmacy)
                .WithMany(p => p.InventoryItems)
                .HasForeignKey(i => i.PharmacyId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(i => i.Medicine)
                .WithMany(m => m.InventoryItems)
                .HasForeignKey(i => i.MedicineId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── InventoryBatch ────────────────────────────────────────────
        modelBuilder.Entity<InventoryBatch>(entity =>
        {
            entity.HasKey(b => b.Id);
            entity.HasIndex(b => b.BatchNumber);
            entity.Property(b => b.BatchNumber).IsRequired().HasMaxLength(100);

            entity.HasOne(b => b.InventoryItem)
                .WithMany(i => i.Batches)
                .HasForeignKey(b => b.InventoryItemId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── RestockRequest ────────────────────────────────────────────
        modelBuilder.Entity<RestockRequest>(entity =>
        {
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Status).HasConversion<string>();
            entity.Property(r => r.TotalAmount).HasColumnType("decimal(12,2)");
            entity.HasIndex(r => r.PharmacyId);
            entity.HasIndex(r => r.SupplierProfileId);
            entity.HasIndex(r => r.Status);

            entity.HasOne(r => r.Pharmacy)
                .WithMany(p => p.RestockRequests)
                .HasForeignKey(r => r.PharmacyId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.SupplierProfile)
                .WithMany(s => s.RestockRequests)
                .HasForeignKey(r => r.SupplierProfileId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── RestockRequestItem ────────────────────────────────────────
        modelBuilder.Entity<RestockRequestItem>(entity =>
        {
            entity.HasKey(i => i.Id);
            entity.Property(i => i.UnitPrice).HasColumnType("decimal(10,2)");
            entity.Property(i => i.SubTotal).HasColumnType("decimal(12,2)");

            entity.HasOne(i => i.RestockRequest)
                .WithMany(r => r.Items)
                .HasForeignKey(i => i.RestockRequestId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(i => i.Medicine)
                .WithMany()
                .HasForeignKey(i => i.MedicineId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── InventoryTransaction ──────────────────────────────────────
        modelBuilder.Entity<InventoryTransaction>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.TransactionType).HasConversion<string>();
            entity.HasIndex(t => t.InventoryItemId);
            entity.HasIndex(t => t.TransactionDate);

            entity.HasOne(t => t.InventoryItem)
                .WithMany(i => i.Transactions)
                .HasForeignKey(t => t.InventoryItemId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
