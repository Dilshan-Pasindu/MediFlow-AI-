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
        // ── Seed Specialties (all 18 specialties across 6 clinical domains) ──
        var requiredSpecialties = new List<(string Name, string Description, string Icon)>
        {
            ("Cardiology", "Treat heart attacks, heart failure, and high blood pressure", "❤️"),
            ("Vascular Surgery", "Operate on blood vessels like arteries and veins", "🩸"),
            ("Neurology", "Diagnose and treat brain, spine, and nerve disorders", "🧠"),
            ("Neurosurgery", "Perform surgery on the brain and spinal cord", "🔬"),
            ("Orthopedics", "Treat bones, joints, ligaments, and muscles", "🦴"),
            ("Physiatry", "Focus on physical medicine, rehabilitation, and back pain", "🏃"),
            ("Dermatology", "Treat conditions of the skin, hair, and nails", "🧴"),
            ("Ophthalmology", "Medical doctors who diagnose and operate on eye conditions", "👁️"),
            ("ENT", "Treat ear, nose, throat, and sinus issues (Otolaryngology)", "👂"),
            ("Gastroenterology", "Treat the stomach, intestines, liver, and pancreas", "🫁"),
            ("Nephrology", "Specialize in kidney health and diseases", "🩺"),
            ("Pulmonology", "Treat the lungs and breathing system", "🫁"),
            ("Endocrinology", "Manage hormone conditions like diabetes and thyroid issues", "⚕️"),
            ("Oncology", "Diagnose and treat cancer using chemotherapy or radiation", "🎗️"),
            ("Allergy and Immunology", "Treat asthma, eczema, and immune disorders", "🛡️"),
            ("Hematology", "Specialize in blood and bone marrow disorders", "🩸"),
            ("General Medicine", "General health and wellness", "🩺"),
            ("Pediatrics", "Child healthcare and development", "👶"),
        };

        foreach (var (name, desc, icon) in requiredSpecialties)
        {
            var existingSpec = await db.Specialties.FirstOrDefaultAsync(s => s.Name == name);
            if (existingSpec == null)
            {
                db.Specialties.Add(new Specialty { Name = name, Description = desc, Icon = icon });
            }
            else
            {
                existingSpec.Description = desc;
                existingSpec.Icon = icon;
            }
        }
        await db.SaveChangesAsync();

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

        // ── Comprehensive Doctor Seeding (At least 2 Doctors per Specialty) ──
        var allSpecialties = await db.Specialties.ToListAsync();
        var doctorProfilesData = new List<DoctorSeedDefinition>
        {
            // Cardiology
            new("Dr. Nimal Perera", "nimal.perera@mediflow.lk", "+94771000001", "Cardiology", "Interventional Cardiology",
                "Senior Consultant Cardiologist with 15+ years experience in managing complex coronary diseases and hypertension.",
                "MBBS, MD (Cardiology), FCCP", 15, 3500m, 52, "National Hospital of Sri Lanka, Colombo", "English, Sinhala", "Colombo 07",
                "Faculty of Medicine, University of Colombo", "Royal College of Physicians (UK)", "Fellow of the American College of Cardiology (FACC)", "Board Certified in Interventional Cardiology", "SLMC-11024"),
            new("Dr. Asanka Wijesinghe", "asanka.w@mediflow.lk", "+94771000007", "Cardiology", "Electrophysiology & Heart Failure",
                "Distinguished heart rhythm and heart failure specialist providing cutting-edge cardiac evaluations.",
                "MBBS, MD, FRCP (Edin), FACC", 18, 4000m, 54, "Lanka Hospitals, Colombo", "English, Sinhala, Tamil", "Colombo 05",
                "Faculty of Medicine, University of Peradeniya", "Johns Hopkins University School of Medicine", "Cardiac Rhythm Device Specialist Certification", "Fellow of Royal College of Physicians", "SLMC-09842"),

            // Vascular Surgery
            new("Dr. Rohan Gunawardena", "rohan.g@mediflow.lk", "+94771000008", "Vascular Surgery", "Endovascular & Aortic Surgery",
                "Specialist vascular surgeon focused on arterial reconstructions, bypass surgeries, and varicose vein treatments.",
                "MBBS, MS (General Surgery), FRCS (Eng)", 16, 4200m, 51, "Asiri Surgical Hospital, Colombo", "English, Sinhala", "Colombo 05",
                "Faculty of Medicine, University of Colombo", "Royal College of Surgeons of England", "Endovascular Surgery Fellowship (UK)", "Fellow of Royal College of Surgeons", "SLMC-10345"),
            new("Dr. Sunethra Dissanayake", "sunethra.d@mediflow.lk", "+94771000009", "Vascular Surgery", "Peripheral Vascular & Venous Care",
                "Pioneering vascular consultant specialized in diabetic foot salvage, aneurysms, and minimally invasive vein therapies.",
                "MBBS, MD Surgery, FEBVS", 13, 3800m, 46, "Colombo South Teaching Hospital, Kalubowila", "English, Sinhala", "Kalubowila",
                "Faculty of Medicine, University of Kelaniya", "European Board of Vascular Surgery", "Microvascular Reconstruction Certified", "Board Certified Vascular Surgeon", "SLMC-13921"),

            // Neurology
            new("Dr. Anusha Jayawardena", "anusha.j@mediflow.lk", "+94771000004", "Neurology", "Headache & Stroke Management",
                "Senior Neurologist specializing in epilepsy, recurrent migraine management, stroke rehabilitation, and neuropathy.",
                "MBBS, MD (Neurology), MRCP (UK)", 12, 4000m, 45, "National Hospital of Sri Lanka, Colombo", "English, Sinhala", "Colombo 07",
                "Faculty of Medicine, University of Colombo", "National Hospital for Neurology and Neurosurgery, London", "Clinical Neurophysiology Certification", "Member of the Royal College of Physicians", "SLMC-14201"),
            new("Dr. Daminda Samarasinghe", "daminda.s@mediflow.lk", "+94771000010", "Neurology", "Neurodegenerative & Movement Disorders",
                "Leading clinical neurologist with extensive expertise in Parkinson's disease, tremors, and neurogenetic conditions.",
                "MBBS, MD, DM Neurology, FAAN", 17, 4500m, 53, "Nawaloka Hospital, Colombo", "English, Sinhala, Tamil", "Colombo 02",
                "University of Peradeniya", "Oxford University Hospitals", "Fellow of the American Academy of Neurology", "Sri Lanka Association of Neurologists Council Member", "SLMC-09214"),

            // Neurosurgery
            new("Dr. Sanjeewa Kulatunga", "sanjeewa.k@mediflow.lk", "+94771000011", "Neurosurgery", "Brain Tumor & Skull Base Surgery",
                "Consultant Neurosurgeon renowned for complex craniotomies, micro-neurosurgery, and spinal cord decompression.",
                "MBBS, MS Neurosurgery, FRCS (Neurosurg)", 19, 5500m, 56, "Asiri Central Hospital, Colombo", "English, Sinhala", "Colombo 10",
                "Faculty of Medicine, University of Colombo", "Royal College of Surgeons of Edinburgh", "Skull Base Surgery Fellowship (Hannover, Germany)", "Board Certified Neurosurgeon", "SLMC-08412"),
            new("Dr. Menaka Rathnayake", "menaka.r@mediflow.lk", "+94771000012", "Neurosurgery", "Spinal Neurosurgery & Trauma",
                "Specialist neurosurgeon with exceptional track record in endoscopic spine interventions and pediatric neurotrauma.",
                "MBBS, MS, Fellowship in Cerebrovascular Surgery (Toronto)", 14, 4800m, 48, "Teaching Hospital Karapitiya, Galle", "English, Sinhala", "Galle",
                "University of Ruhuna", "University of Toronto", "Minimally Invasive Spine Certified", "Fellowship in Neurotrauma", "SLMC-12840"),

            // Orthopedics
            new("Dr. Ruwan Bandara", "ruwan.b@mediflow.lk", "+94771000005", "Orthopedics", "Joint Replacement & Sports Injuries",
                "Senior Orthopedic Surgeon specializing in hip/knee arthroplasty, ligament tears, and complex sports injury recovery.",
                "MBBS, MS (Ortho), FRCS", 14, 4500m, 49, "National Hospital of Sri Lanka, Colombo", "English, Sinhala", "Colombo 07",
                "Faculty of Medicine, University of Colombo", "Royal College of Surgeons (Glasgow)", "AO Trauma Fellowship", "Fellow of Royal College of Surgeons", "SLMC-11894"),
            new("Dr. Jayamal Jayasuriya", "jayamal.j@mediflow.lk", "+94771000013", "Orthopedics", "Spine Surgery & Trauma Reconstruction",
                "Renowned orthopedic surgeon delivering state-of-the-art robotic joint surgery and corrective spinal stabilization.",
                "MBBS, MS Ortho, Fellowship in Joint Replacement (Sydney)", 16, 4800m, 52, "Lanka Hospitals, Colombo", "English, Sinhala", "Colombo 05",
                "University of Peradeniya", "University of Sydney Orthopedic Research Institute", "Robotic Arthroplasty Certified", "Sri Lanka Orthopedic Association Fellow", "SLMC-10492"),

            // Physiatry
            new("Dr. Kanchana Senanayake", "kanchana.s@mediflow.lk", "+94771000014", "Physiatry", "Physical Medicine & Neuro-Rehab",
                "Consultant Physiatrist specializing in back pain rehabilitation, post-stroke mobility recovery, and functional restoration.",
                "MBBS, MD Physical Medicine & Rehabilitation", 11, 3000m, 44, "Ragama Rehabilitation Hospital, Ragama", "English, Sinhala", "Ragama",
                "Faculty of Medicine, University of Kelaniya", "Postgraduate Institute of Medicine (PGIM)", "Musculoskeletal Ultrasound Certification", "Board Certified Physiatrist", "SLMC-15102"),
            new("Dr. Chathura Weerakoon", "chathura.w@mediflow.lk", "+94771000015", "Physiatry", "Sports Rehabilitation & Pain Management",
                "Physical medicine expert dedicated to non-surgical musculoskeletal care, spine reconditioning, and athletic recovery.",
                "MBBS, Dip Sports Medicine, MD Physiatry", 13, 3200m, 47, "Asiri Central Hospital, Colombo", "English, Sinhala, Tamil", "Colombo 10",
                "University of Colombo", "Royal Australasian College of Physicians", "Interventional Spine Pain Certified", "International Society of PRM Member", "SLMC-13480"),

            // Dermatology
            new("Dr. Priya Fernando", "priya.fernando@mediflow.lk", "+94771000002", "Dermatology", "Clinical Dermatology & Psoriasis",
                "Consultant Dermatologist with rich clinical experience in diagnosing eczema, acne, skin lesions, and hair disorders.",
                "MBBS, MD (Dermatology)", 10, 3000m, 42, "Asiri Central Hospital, Colombo", "English, Sinhala", "Colombo 10",
                "Faculty of Medicine, University of Colombo", "St John's Institute of Dermatology, King's College London", "Dermatopathology Certified", "Sri Lanka College of Dermatologists", "SLMC-16201"),
            new("Dr. Lakshman Abeywickrama", "lakshman.a@mediflow.lk", "+94771000016", "Dermatology", "Laser Surgery & Pediatric Dermatology",
                "Senior dermatologist focused on skin allergy detection, laser dermatologic therapy, and chronic autoimmune skin disease.",
                "MBBS, MD Dermatology, Dip Dermatology (Glasgow)", 15, 3500m, 50, "Durdans Hospital, Colombo", "English, Sinhala", "Colombo 03",
                "University of Peradeniya", "University of Glasgow", "British Association of Dermatologists Fellow", "Board Certified Dermatologist", "SLMC-11320"),

            // Ophthalmology
            new("Dr. Ranjan De Silva", "ranjan.d@mediflow.lk", "+94771000017", "Ophthalmology", "Cataract & Vitreoretinal Surgery",
                "Senior Consultant Eye Surgeon specializing in sutureless phacoemulsification, retinal detachments, and diabetic retinopathy.",
                "MBBS, MD Ophthalmology, FRCS (Ophth)", 18, 3800m, 55, "National Eye Hospital, Colombo", "English, Sinhala", "Colombo 10",
                "Faculty of Medicine, University of Colombo", "Moorfields Eye Hospital, London", "Vitreoretinal Specialist Fellowship", "Fellow of Royal College of Surgeons", "SLMC-09411"),
            new("Dr. Hiruni Ranasinghe", "hiruni.r@mediflow.lk", "+94771000018", "Ophthalmology", "Glaucoma & Cornea Transplantation",
                "Expert ophthalmologist recognized for precision glaucoma management, corneal transplants, and pediatric vision care.",
                "MBBS, MD Ophthalmology, FICO", 12, 3600m, 43, "Vision Care Specialist Center, Colombo", "English, Sinhala, Tamil", "Colombo 07",
                "University of Ruhuna", "International Council of Ophthalmology", "Refractive Surgery Certified", "College of Ophthalmologists of Sri Lanka", "SLMC-14902"),

            // ENT (Otolaryngology)
            new("Dr. Chandrakantha Pathirana", "chandrakantha.p@mediflow.lk", "+94771000019", "ENT", "Otology & Hearing Restoration",
                "Consultant ENT Surgeon specializing in endoscopic sinus surgery, tympanoplasty, dizziness, and voice disorders.",
                "MBBS, MS ENT, DLO", 16, 3800m, 52, "National Hospital of Sri Lanka, Colombo", "English, Sinhala", "Colombo 07",
                "Faculty of Medicine, University of Colombo", "Postgraduate Institute of Medicine (PGIM)", "Head & Neck Oncologic Fellowship", "College of Otorhinolaryngologists Fellow", "SLMC-10820"),
            new("Dr. Nilmini Karunaratne", "nilmini.k@mediflow.lk", "+94771000020", "ENT", "Rhinology & Sinus Surgery",
                "Experienced ENT specialist providing advanced diagnostics for snoring, obstructive sleep apnea, and allergy rhinosinusitis.",
                "MBBS, MS Otolaryngology, FRCS (ORL)", 14, 3900m, 47, "Lanka Hospitals, Colombo", "English, Sinhala", "Colombo 05",
                "University of Peradeniya", "Royal College of Surgeons of Edinburgh", "Anterior Skull Base Surgery Certified", "Board Certified ENT Surgeon", "SLMC-12401"),

            // Gastroenterology
            new("Dr. Anuradha Wickramasekera", "anuradha.w@mediflow.lk", "+94771000021", "Gastroenterology", "Hepatology & Therapeutic Endoscopy",
                "Consultant Gastroenterologist specialized in peptic ulcers, liver cirhossis, inflammatory bowel disease, and colonoscopy.",
                "MBBS, MD Medicine, MRCP (Gastro)", 15, 4200m, 50, "Asiri Surgical Hospital, Colombo", "English, Sinhala", "Colombo 05",
                "Faculty of Medicine, University of Colombo", "Royal College of Physicians (London)", "Advanced Endoscopy Fellowship (Hong Kong)", "Sri Lanka Gastroenterology Association", "SLMC-11234"),
            new("Dr. Tharanga Jayasundara", "tharanga.j@mediflow.lk", "+94771000022", "Gastroenterology", "Pancreatic & Biliary Diseases",
                "Renowned digestive specialist focused on acid reflux, pancreatitis, gastrointestinal bleeding, and metabolic liver disease.",
                "MBBS, MD Gastroenterology, FACG", 13, 4000m, 46, "Nawaloka Hospital, Colombo", "English, Sinhala, Tamil", "Colombo 02",
                "University of Kelaniya", "American College of Gastroenterology", "ERCP & Endoscopic Ultrasound Certified", "Fellow of American College of Gastroenterology", "SLMC-13840"),

            // Nephrology
            new("Dr. Mahinda Seneviratne", "mahinda.s@mediflow.lk", "+94771000023", "Nephrology", "Chronic Kidney Disease & Dialysis",
                "Senior Consultant Nephrologist dedicated to kidney failure prevention, glomerulonephritis, and hypertension management.",
                "MBBS, MD Nephrology, FRCP", 17, 4500m, 53, "National Institute of Nephrology, Colombo", "English, Sinhala", "Colombo 10",
                "Faculty of Medicine, University of Colombo", "Royal College of Physicians (Edinburgh)", "Renal Replacement Therapy Certification", "Sri Lanka Society of Nephrology Fellow", "SLMC-09940"),
            new("Dr. Dilini Alahakoon", "dilini.a@mediflow.lk", "+94771000024", "Nephrology", "Kidney Transplantation & Glomerular Diseases",
                "Compassionate nephrologist delivering comprehensive post-transplant care, electrolyte imbalance diagnosis, and dialysis supervision.",
                "MBBS, MD Nephrology, FASN", 12, 3800m, 44, "Kandy General Hospital, Kandy", "English, Sinhala", "Kandy",
                "University of Peradeniya", "American Society of Nephrology", "Kidney Transplant Fellowship (Singapore)", "Board Certified Nephrologist", "SLMC-14782"),

            // Pulmonology
            new("Dr. Bandula Nanayakkara", "bandula.n@mediflow.lk", "+94771000025", "Pulmonology", "Asthma, COPD & Sleep Apnea",
                "Consultant Chest Physician with high expertise in chronic cough, pulmonary fibrosis, bronchial asthma, and pneumonia.",
                "MBBS, MD Chest Medicine, FCCP", 16, 3800m, 52, "Welisara Chest Hospital, Welisara", "English, Sinhala", "Welisara",
                "Faculty of Medicine, University of Colombo", "American College of Chest Physicians", "Interventional Pulmonology Certified", "Sri Lanka College of Pulmonologists", "SLMC-10921"),
            new("Dr. Pavithra Madushani", "pavithra.m@mediflow.lk", "+94771000026", "Pulmonology", "Respiratory Infections & Critical Care",
                "Experienced respiratory consultant specializing in post-viral lung conditions, pleural effusions, and pulmonary rehabilitation.",
                "MBBS, MD Respiratory Medicine, MRCP (UK)", 11, 3600m, 43, "Durdans Hospital, Colombo", "English, Sinhala, Tamil", "Colombo 03",
                "University of Sri Jayewardenepura", "Royal College of Physicians (UK)", "Bronchoscopy & Thoracoscopy Fellowship", "European Respiratory Society Member", "SLMC-15340"),

            // Endocrinology
            new("Dr. Chaminda Garusinghe", "chaminda.g@mediflow.lk", "+94771000027", "Endocrinology", "Diabetes & Thyroid Disorders",
                "Senior Endocrinologist providing modern insulin regimens, thyroid nodule care, metabolic syndrome, and pituitary management.",
                "MBBS, MD Endocrinology, FACE", 15, 4000m, 49, "Lanka Hospitals, Colombo", "English, Sinhala", "Colombo 05",
                "Faculty of Medicine, University of Colombo", "American Association of Clinical Endocrinology", "Pituitary & Adrenal Care Fellowship", "Fellow of the American College of Endocrinology", "SLMC-11782"),
            new("Dr. Roshani Wickramasinghe", "roshani.w@mediflow.lk", "+94771000028", "Endocrinology", "Osteoporosis & Reproductive Hormones",
                "Consultant Endocrinologist specializing in PCOS, hormonal imbalance, metabolic bone disorders, and gestational diabetes.",
                "MBBS, MD, MRCP Diabetes & Endocrinology", 13, 3800m, 45, "Asiri Central Hospital, Colombo", "English, Sinhala", "Colombo 10",
                "University of Kelaniya", "Royal College of Physicians (UK)", "Endocrine Society Fellow (USA)", "Sri Lanka College of Endocrinologists", "SLMC-13901"),

            // Oncology
            new("Dr. Mahendra Somaratne", "mahendra.s@mediflow.lk", "+94771000029", "Oncology", "Radiation & Medical Oncology",
                "Senior Consultant Oncologist with vast experience in personalized cancer therapies, targeted radiation, and chemotherapy.",
                "MBBS, MD Clinical Oncology, FRCR (UK)", 18, 4500m, 55, "Apeksha Hospital Maharagama", "English, Sinhala", "Maharagama",
                "Faculty of Medicine, University of Colombo", "Royal College of Radiologists (UK)", "Stereotactic Body Radiotherapy Fellowship", "Sri Lanka Cancer Society Advisory Board", "SLMC-09320"),
            new("Dr. Shanthi Premaratne", "shanthi.p@mediflow.lk", "+94771000030", "Oncology", "Immunotherapy & Breast Oncology",
                "Expert medical oncologist recognized for breakthrough immunotherapy protocols, clinical trials, and compassionate cancer care.",
                "MBBS, MD Medical Oncology, ESMO Certified", 14, 4400m, 47, "Asiri Central Cancer Center, Colombo", "English, Sinhala, Tamil", "Colombo 10",
                "University of Peradeniya", "European Society for Medical Oncology", "Breast Cancer Multidisciplinary Fellowship", "Board Certified Medical Oncologist", "SLMC-12780"),

            // Allergy and Immunology
            new("Dr. Harsha Samarasekera", "harsha.s@mediflow.lk", "+94771000031", "Allergy and Immunology", "Clinical Allergy & Anaphylaxis",
                "Consultant Allergist & Immunologist managing drug allergies, chronic urticaria, allergic rhinitis, and venom immunotherapy.",
                "MBBS, MD Allergy & Clinical Immunology, FAAAAI", 14, 3600m, 48, "Durdans Hospital, Colombo", "English, Sinhala", "Colombo 03",
                "Faculty of Medicine, University of Colombo", "American Academy of Allergy Asthma & Immunology", "Pediatric Allergy Specialist Certification", "Fellow of AAAAI", "SLMC-12601"),
            new("Dr. Nayomi Vidanapathirana", "nayomi.v@mediflow.lk", "+94771000032", "Allergy and Immunology", "Primary Immunodeficiency & Autoimmunity",
                "Immunologist dedicated to early diagnosis of immune deficiencies, severe food allergies, and autoimmune antibody profiling.",
                "MBBS, MD Immunology, MRCPCH", 11, 3500m, 43, "Lady Ridgeway Hospital, Colombo", "English, Sinhala", "Colombo 08",
                "University of Sri Jayewardenepura", "Imperial College London", "Molecular Allergy Diagnostics Certified", "Sri Lanka Society for Immunology", "SLMC-15420"),

            // Hematology
            new("Dr. Wasantha Jayakody", "wasantha.j@mediflow.lk", "+94771000033", "Hematology", "Leukemia & Stem Cell Transplantation",
                "Senior Consultant Hematologist specialized in anemia investigations, bleeding disorders, lymphomas, and bone marrow biopsies.",
                "MBBS, MD Haematology, FRCPath (UK)", 16, 4200m, 52, "National Blood Transfusion Center, Narahenpita", "English, Sinhala", "Narahenpita",
                "Faculty of Medicine, University of Colombo", "Royal College of Pathologists (UK)", "Bone Marrow Transplantation Fellowship (Australia)", "Fellow of the Royal College of Pathologists", "SLMC-10740"),
            new("Dr. Samanmalee Thushari", "samanmalee.t@mediflow.lk", "+94771000034", "Hematology", "Coagulation & Hemoglobinopathies",
                "Consultant Hematologist with expertise in thalassemia, deep vein thrombosis, platelet deficiencies, and transfusion medicine.",
                "MBBS, MD Haematology", 12, 3900m, 44, "Lanka Hospitals, Colombo", "English, Sinhala, Tamil", "Colombo 05",
                "University of Ruhuna", "Postgraduate Institute of Medicine (PGIM)", "Thalassemia Clinical Management Certified", "Sri Lanka Association of Haematologists", "SLMC-14560"),

            // General Medicine
            new("Dr. Kamal Silva", "kamal.silva@mediflow.lk", "+94771000003", "General Medicine", "Primary Care & Preventive Health",
                "General Practitioner at Lanka Hospitals with broad clinical experience in managing routine medical needs and health checkups.",
                "MBBS, Dip. Family Medicine", 8, 1500m, 39, "Lanka Hospitals, Colombo", "English, Sinhala", "Colombo 05",
                "Faculty of Medicine, University of Colombo", "College of General Practitioners of Sri Lanka", "Occupational Health Certified", "Member of CGPSL", "SLMC-17840"),
            new("Dr. Janaka Ekanayake", "janaka.e@mediflow.lk", "+94771000035", "General Medicine", "Internal Medicine & Chronic Disease",
                "Senior General Physician delivering holistic primary care for elderly patients, hypertension, dyslipidemia, and viral fevers.",
                "MBBS, MD General Medicine", 14, 2200m, 48, "Asiri Medical Hospital, Colombo", "English, Sinhala, Tamil", "Colombo 05",
                "University of Peradeniya", "Royal College of Physicians (Edinburgh)", "Geriatric Care Fellowship", "Board Certified Physician", "SLMC-12340"),

            // Pediatrics
            new("Dr. Sachini Wickrama", "sachini.w@mediflow.lk", "+94771000006", "Pediatrics", "Childhood Development & Nutrition",
                "Consultant Pediatrician with special interest in childhood growth disorders, neonatology, and vaccination scheduling.",
                "MBBS, DCH, MD (Paediatrics)", 9, 2500m, 41, "Lady Ridgeway Hospital, Colombo", "English, Sinhala", "Colombo 08",
                "Faculty of Medicine, University of Colombo", "Royal College of Paediatrics and Child Health (UK)", "Neonatal Resuscitation Certified", "Sri Lanka College of Paediatricians", "SLMC-16890"),
            new("Dr. Gayan Karunatilake", "gayan.k@mediflow.lk", "+94771000036", "Pediatrics", "Pediatric Allergy & Respiratory Care",
                "Dedicated Pediatrician specialized in child asthma, recurring childhood ear infections, and infant gastrointestinal issues.",
                "MBBS, MD Paediatrics, MRCPCH (UK)", 13, 3000m, 46, "Ninewells Hospital, Colombo", "English, Sinhala", "Colombo 05",
                "University of Kelaniya", "Royal College of Paediatrics and Child Health (UK)", "Pediatric Advanced Life Support Certified", "Fellow of RCPCH", "SLMC-13650"),
        };

        var daysOfWeek = new[] { DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Saturday, DayOfWeek.Sunday };
        var avatarBase = "https://images.unsplash.com/photo-";
        var sampleAvatars = new[]
        {
            "1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
            "1594824813571-638f02638523?w=300&auto=format&fit=crop&q=80",
            "1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80",
            "1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80",
            "1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80",
            "1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80",
        };

        int docIdx = 0;
        foreach (var def in doctorProfilesData)
        {
            var photoUrl = $"{avatarBase}{sampleAvatars[docIdx % sampleAvatars.Length]}";
            docIdx++;

            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == def.Email);
            if (user == null)
            {
                user = new User
                {
                    FullName = def.FullName,
                    Email = def.Email,
                    PhoneNumber = def.Phone,
                    Role = UserRole.Doctor,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor@123"),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                db.Users.Add(user);
                await db.SaveChangesAsync();
            }

            var doctor = await db.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id || d.FullName == def.FullName);
            if (doctor == null)
            {
                doctor = new Doctor
                {
                    UserId = user.Id,
                    FullName = def.FullName,
                    Bio = def.Bio,
                    Qualifications = def.Qualifications,
                    ExperienceYears = def.ExperienceYears,
                    ConsultationFee = def.Fee,
                    IsActive = true,
                    ProfilePhoto = photoUrl,
                    SubSpecialty = def.SubSpecialty,
                    HospitalClinic = def.Hospital,
                    Languages = def.Languages,
                    Location = def.Location,
                    MbbsUniversity = def.Mbbs,
                    PhdUniversity = def.Phd,
                    OtherQualifications = def.OtherQuals,
                    Certifications = def.Certifications,
                    Age = def.Age,
                    RegistrationNumber = def.RegNo,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                db.Doctors.Add(doctor);
                await db.SaveChangesAsync();
            }
            else
            {
                // Backfill profile details if missing
                doctor.ProfilePhoto ??= photoUrl;
                doctor.SubSpecialty ??= def.SubSpecialty;
                doctor.HospitalClinic ??= def.Hospital;
                doctor.Languages ??= def.Languages;
                doctor.Location ??= def.Location;
                doctor.MbbsUniversity ??= def.Mbbs;
                doctor.PhdUniversity ??= def.Phd;
                doctor.OtherQualifications ??= def.OtherQuals;
                doctor.Certifications ??= def.Certifications;
                doctor.Age ??= def.Age;
                doctor.RegistrationNumber ??= def.RegNo;
                doctor.Bio = string.IsNullOrWhiteSpace(doctor.Bio) ? def.Bio : doctor.Bio;
                doctor.Qualifications = string.IsNullOrWhiteSpace(doctor.Qualifications) ? def.Qualifications : doctor.Qualifications;
            }

            // Link to Specialty
            var specEntity = allSpecialties.FirstOrDefault(s => s.Name == def.SpecialtyName);
            if (specEntity != null)
            {
                var hasLink = await db.DoctorSpecialties.AnyAsync(ds => ds.DoctorId == doctor.Id && ds.SpecialtyId == specEntity.Id);
                if (!hasLink)
                {
                    db.DoctorSpecialties.Add(new DoctorSpecialty { DoctorId = doctor.Id, SpecialtyId = specEntity.Id });
                    await db.SaveChangesAsync();
                }
            }

            // Seed Availabilities if missing
            var hasAvailability = await db.DoctorAvailabilities.AnyAsync(da => da.DoctorId == doctor.Id);
            if (!hasAvailability)
            {
                foreach (var day in daysOfWeek)
                {
                    db.DoctorAvailabilities.Add(new DoctorAvailability
                    {
                        DoctorId = doctor.Id,
                        DayOfWeek = day,
                        StartTime = new TimeOnly(9, 0),
                        EndTime = new TimeOnly(17, 0)
                    });
                }
                await db.SaveChangesAsync();
            }
        }
        await db.SaveChangesAsync();

        // ── Seed Sample Ratings & Reviews for Doctors if missing ────────────
        var demoPatient = await db.Patients.FirstOrDefaultAsync();
        if (demoPatient != null)
        {
            var doctorsWithoutRatings = await db.Doctors
                .Include(d => d.Ratings)
                .Where(d => d.Ratings.Count == 0)
                .ToListAsync();

            var sampleFeedbackList = new (int Stars, string Comment)[]
            {
                (5, "Exceptional clinical expertise. Explained everything clearly and put me at complete ease throughout the consultation."),
                (5, "Very attentive and compassionate doctor. The prescribed treatment worked wonders within a few days."),
                (4, "Detailed diagnosis and answered all my questions patiently. High level of professionalism."),
                (5, "One of the best specialists I have consulted. Accurate evaluation and very reassuring guidance."),
            };

            int reviewIndex = 0;
            foreach (var doc in doctorsWithoutRatings)
            {
                // Create a completed appointment so the review has valid relational integrity
                var completedAppt = new Appointment
                {
                    PatientId = demoPatient.Id,
                    DoctorId = doc.Id,
                    AppointmentDateTime = DateTime.UtcNow.AddDays(-reviewIndex - 3),
                    AppointmentNumber = $"APT-SEED-{doc.Id:D3}-{reviewIndex:D2}",
                    Status = AppointmentStatus.Completed,
                    Fee = doc.ConsultationFee,
                    Notes = "Routine follow-up completed successfully.",
                    ConsultationStartedAt = DateTime.UtcNow.AddDays(-reviewIndex - 3).AddMinutes(5),
                    ConsultationEndedAt = DateTime.UtcNow.AddDays(-reviewIndex - 3).AddMinutes(35),
                    CreatedAt = DateTime.UtcNow.AddDays(-reviewIndex - 5)
                };
                db.Appointments.Add(completedAppt);
                await db.SaveChangesAsync();

                var (stars, comment) = sampleFeedbackList[reviewIndex % sampleFeedbackList.Length];
                db.DoctorRatings.Add(new DoctorRating
                {
                    DoctorId = doc.Id,
                    PatientId = demoPatient.Id,
                    AppointmentId = completedAppt.Id,
                    Stars = stars,
                    Comment = comment,
                    CreatedAt = DateTime.UtcNow.AddDays(-reviewIndex - 2)
                });
                reviewIndex++;
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

    private record DoctorSeedDefinition(
        string FullName,
        string Email,
        string Phone,
        string SpecialtyName,
        string SubSpecialty,
        string Bio,
        string Qualifications,
        int ExperienceYears,
        decimal Fee,
        int Age,
        string Hospital,
        string Languages,
        string Location,
        string Mbbs,
        string Phd,
        string OtherQuals,
        string Certifications,
        string RegNo
    );
}
