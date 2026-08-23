# MediFlow AI — 4-Member Project Division

## Project Overview

**MediFlow AI — Intelligent Healthcare, Pharmacy & Medical Management System**

A web and mobile-based Intelligent Healthcare, Pharmacy & Medical Management System that combines Software Engineering principles with a multi-agent Artificial Intelligence architecture. The system provides patients with intelligent assistance for finding suitable medical specialists and doctors, understanding symptoms, managing prescriptions and medications, locating pharmacies, ordering medicines, and monitoring medicine availability. Doctors, pharmacists, pharmacy owners, suppliers, and administrators have dedicated interfaces for managing their respective activities.

The system must be developed using a shared **ASP.NET Core backend and PostgreSQL database**, with a **React web application** for staff/admin/pharmacy workflows and a **Flutter mobile application** for patient-facing workflows. The AI functionality is implemented through four specialized intelligent agents that communicate with the main system through controlled APIs/tools.

> **Key Design Principle:** AI agents assist healthcare professionals and patients — they do **not** independently make final medical decisions. Human professionals maintain control over all critical medical and operational decisions.

### Technology Stack

| Layer | Technology |
|---|---|
| Mobile | Flutter / Dart |
| Web | React / React Router |
| Backend API | ASP.NET Core Web API / C# |
| Database | PostgreSQL / EF Core |
| Auth | JWT / Role-based |
| Agentic AI | Agent orchestration framework (LangGraph / MS Agent Framework / Google ADK) |
| Docs | Swagger / OpenAPI |
| CI/CD | GitHub Actions |

### Core Principle

> Every member owns a **complete vertical business component** — database tables, API endpoints, UI screens (both React and Flutter), an AI agent, tests, and documentation. Every member must make meaningful contributions to **all layers**: ASP.NET Core, PostgreSQL, React, Flutter, and AI. No member is "just backend" or "just frontend."

### Minimum Requirements Per Member

| Requirement | Minimum |
|---|---|
| Meaningful API endpoints | At least **4** |
| Non-CRUD business operation | At least **1** |
| Database tables | Relevant to their module |
| React screens | Relevant to their module |
| Flutter screens | Relevant to their module |
| AI agent | **1** specialized agent |
| Tests | Unit + Integration + API |

---

## 1. System Architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│                          MEDIFLOW AI                             │
├──────────────┬──────────────────────────┬────────────────────────┤
│   Flutter    │         React            │     Agentic AI         │
│  (Patient)   │ (Doctor/Pharmacist/      │     Subsystem          │
│              │  Pharmacy Owner/         │                        │
│              │  Supplier/Admin)         │                        │
├──────────────┴──────────────────────────┴────────────────────────┤
│                    ASP.NET Core Web API                          │
│                (JWT Auth · Role-Based Access)                    │
├─────────────────────────────────────────────────────────────────┤
│                        PostgreSQL                                │
└─────────────────────────────────────────────────────────────────┘
```

### Four Business Components

```text
┌─────────────────────────────────────────────────────────────────────┐
│                           MEDIFLOW AI                               │
├─────────────────────────────────────────────────────────────────────┤
│  Member 1 → Doctor & Specialist Management                          │
│  Member 2 → Patient & Medical History & Appointment Management      │
│  Member 3 → Prescription & Medicine & Order Management              │
│  Member 4 → Pharmacy & Inventory & Supplier Management              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Main System Concept — Healthcare Workflow

The system provides an end-to-end healthcare workflow where patients can find specialists, book appointments, receive clinical decision support, manage prescriptions, order medicines, and track their care.

```text
Patient
   ↓
Enter Symptoms
   ↓
AI Specialist & Doctor Recommendation
   ↓
Recommended Specialty + Ranked Doctors
   ↓
Patient Selects Doctor
   ↓
Book Appointment
   ↓
Appointment Scheduling (conflict check)
   ↓
Appointment Confirmed
   ↓
Doctor Consultation
   ↓
AI Clinical Decision Support
   ↓
Doctor Makes Final Decision
   ↓
Patient Uploads Prescription
   ↓
AI Medication Intelligence
   ↓
Extract Medicine Information
   ↓
Search Pharmacies
   ↓
AI Pharmacy Intelligence
   ↓
Patient Selects Pharmacy
   ↓
Place Medicine Order
   ↓
Pharmacist Verifies & Processes Order
   ↓
Patient Pays for Medicine
   ↓
Order Completed
   ↓
Inventory Monitoring
   ↓
Low Stock / Demand Prediction
   ↓
Restocking Recommendation
   ↓
Supplier Portal
```

---

## 3. User Roles

| Role | Portal | Description |
|---|---|---|
| `PATIENT` | Flutter Mobile / React | Searches doctors, books appointments, uploads prescriptions, orders medicines, tracks orders |
| `DOCTOR` | React | Manages profile, views appointments, conducts consultations |
| `PHARMACIST` | React | Verifies prescriptions, processes orders, manages inventory |
| `PHARMACY_OWNER` | React | Manages pharmacy, full inventory control, views analytics |
| `SUPPLIER` | React | Views restock requests, approves/rejects supply orders |
| `ADMIN` | React | System administration, user management, audit logs, AI monitoring |

Each role has its own appropriate portal and permissions.

---

## 4. User Role → Member Mapping

| User Role | Primary Owner | UI Platform | Key Permissions |
|---|---|---|---|
| Patient | Member 2 (profile/appointments) + Member 3 (prescriptions/orders) | Flutter + React | Book appointments, upload prescriptions, order medicines, provide feedback |
| Doctor | Member 1 | React | Manage profile, view appointments, manage availability |
| Pharmacist | Member 3 | React | Verify prescriptions, process orders, manage medicines |
| Pharmacy Owner | Member 4 | React | Manage pharmacy, full inventory control, view analytics |
| Supplier | Member 4 | React | View/approve/reject restock requests |
| Admin | Shared (all members contribute) | React | System monitoring, audit logs, AI monitoring |

---

## 5. Member 1 — Doctor & Specialist Management

### Business Focus

Everything related to **doctor and specialist management** — doctor registration, profile management, specialist categorization, doctor search, availability management, ratings, and the doctor ranking algorithm. Also owns the **Specialist & Doctor Recommendation Agent**.

### Database Entities Owned

| Entity | Purpose |
|---|---|
| `Users` (Doctor subset) | Doctor user accounts |
| `Doctors` | Doctor profiles (qualifications, bio, consultation fee) |
| `Specialties` | Medical specialty records |
| `DoctorSpecialties` | Doctor-specialty associations |
| `DoctorAvailability` | Doctor schedule and availability slots |
| `DoctorRatings` | Patient ratings for doctors |
| `DoctorExperience` | Doctor experience records (years, institutions) |

### API Endpoints

```text
# Specialist Management
GET    /api/specialists                    # List all specialties
GET    /api/specialists/{id}               # Get specialty details
POST   /api/specialists                    # Create specialty (Admin)
PUT    /api/specialists/{id}               # Update specialty (Admin)

# Doctor Management
GET    /api/doctors                        # Search/list doctors
GET    /api/doctors/{id}                   # Get doctor profile details
POST   /api/doctors                        # Register doctor
PUT    /api/doctors/{id}                   # Update doctor profile
GET    /api/doctors/search                 # Search doctors (name, specialty, location)

# Doctor Availability
GET    /api/doctors/{id}/availability      # Get doctor availability slots
POST   /api/doctors/{id}/availability      # Set availability (Doctor)
PUT    /api/availability/{id}              # Update availability slot
DELETE /api/availability/{id}              # Remove availability slot

# Doctor Ratings
POST   /api/doctors/{id}/ratings           # Submit doctor rating (Patient)
GET    /api/doctors/{id}/ratings           # Get doctor ratings
GET    /api/doctors/{id}/rating-summary    # Get average rating and distribution

# Doctor Ranking
GET    /api/doctors/ranked                 # Get ranked doctor list for a specialty
```

### Non-CRUD Business Operation — Doctor Ranking Algorithm

The system should calculate a **Doctor Recommendation Score** using a weighted algorithm:

```text
Doctor Score = (Rating × W1) + (Review Reliability × W2) + (Experience × W3)
             + (Availability × W4) + (Specialty Match × W5) + (Consultation Fee × W6)
```

Example weights:

| Factor | Weight |
|---|---|
| Specialty Match | 30% |
| Patient Rating | 25% |
| Experience | 15% |
| Number of Reviews | 10% |
| Availability | 10% |
| Consultation Fee | 5% |
| Location | 5% |

The exact weights can be determined and evaluated by the project team. The ranking should **not** simply sort by a single rating value.

**Example Output:**

```text
Recommended Specialty: Cardiology

Recommended Doctors:

🥇 Dr. A — 4.9 ⭐ — 15 years experience — Available
🥈 Dr. B — 4.7 ⭐ — 12 years experience — Available
🥉 Dr. C — 4.6 ⭐ — 10 years experience — Limited availability
```

### React Screens (Primary Owner) — Doctor Management Portal

```text
Doctor Management Portal
    ├── Dashboard Home
    │       ├── Total Doctors
    │       ├── Specialties Overview
    │       └── Quick Stats
    ├── Doctor Management
    │       ├── Doctor List (search, filter by specialty)
    │       ├── Doctor Profile View
    │       ├── Doctor Registration
    │       └── Edit Doctor Profile
    ├── Specialist Management
    │       ├── Specialty List
    │       ├── Add Specialty
    │       └── Edit Specialty
    ├── Doctor Rating Overview
    │       ├── Rating Summary
    │       ├── Rating Distribution
    │       └── Recent Reviews
    ├── Doctor Availability Management
    │       ├── Availability Calendar
    │       ├── Set Availability Slots
    │       └── Availability History
    └── Doctor Ranking Dashboard
            ├── Ranking Algorithm Configuration
            ├── Ranked Doctor List
            └── Ranking Analytics
```

### Flutter Screens (Primary Owner)

```text
Patient App — Doctor Discovery
    ├── Specialist Browsing
    │       ├── Specialty List (cards with icons)
    │       └── Specialty Details
    ├── Doctor Search
    │       ├── Search by Name
    │       ├── Filter by Specialty
    │       ├── Filter by Availability
    │       └── Filter by Location
    ├── Doctor Profile
    │       ├── Doctor Information
    │       ├── Qualifications
    │       ├── Experience
    │       ├── Consultation Fee
    │       ├── Availability Slots
    │       └── Patient Reviews
    ├── Doctor Rating Display
    │       ├── Average Rating
    │       ├── Rating Distribution
    │       └── Recent Feedback
    └── Recommended Doctor List
            ├── AI-Recommended Specialty
            ├── Ranked Doctors
            ├── Recommendation Explanation
            └── Select Doctor → Appointment
```

### AI Agent — Specialist & Doctor Recommendation Agent

**Purpose:** Analyze patient-provided information to determine the most appropriate medical specialty and rank suitable doctors within that specialty. This agent does **not** diagnose the patient — it recommends a **specialty** for consultation.

**Input:** Patient symptoms (free text), age, medical history, existing conditions, current medications

**Recommendation Flow:**

```text
Patient Provides Information
       ↓
Symptom Analysis
       ↓
Identify Relevant Specialty
       ↓
Find Doctors in Specialty
       ↓
Calculate Doctor Recommendation Score
       ↓
Rank Doctors
       ↓
Generate Explanation
       ↓
Show Recommendations
```

**Output:**

```json
{
  "patientId": "PAT-1024",
  "submittedSymptoms": "I have been having chest pain and shortness of breath",
  "recommendations": [
    {
      "rank": 1,
      "specialty": "Cardiology",
      "confidence": 0.92
    },
    {
      "rank": 2,
      "specialty": "Pulmonology",
      "confidence": 0.71
    }
  ],
  "explanation": "Your symptoms — chest pain and shortness of breath — are commonly evaluated by specialists in cardiovascular conditions.",
  "rankedDoctors": [
    { "doctorId": 5, "name": "Dr. A", "rating": 4.9, "experience": 15, "available": true, "score": 92.5 },
    { "doctorId": 8, "name": "Dr. B", "rating": 4.7, "experience": 12, "available": true, "score": 87.3 },
    { "doctorId": 12, "name": "Dr. C", "rating": 4.6, "experience": 10, "available": false, "score": 78.1 }
  ]
}
```

**Example Specialty Recommendations:**

| Patient Symptoms | Recommended Specialty | Confidence |
|---|---|---|
| Persistent skin rash, itching | Dermatology | 89% |
| Frequent headaches, dizziness | Neurology | 85% |
| Joint pain, swelling, stiffness | Orthopedics / Rheumatology | 82% |
| Vision problems, eye pain | Ophthalmology | 93% |
| Stomach pain, bloating, acidity | Gastroenterology | 91% |
| Chest pain, shortness of breath | Cardiology | 95% |
| Ear pain, hearing issues | ENT (Otolaryngology) | 90% |

**Doctor Ranking Factors:**

| Factor | Description |
|---|---|
| Specialty Match | How well the doctor's specialty matches the recommendation |
| Patient Rating | Average rating from patient reviews |
| Experience | Years of medical practice |
| Reviews | Number and reliability of reviews |
| Availability | Current appointment availability |
| Location | Proximity to patient |
| Consultation Fee | Cost factor for ranking |

**Tools Used:**

| Tool | Purpose |
|---|---|
| `analyze_symptoms()` | Analyze patient symptoms to identify relevant specialties |
| `rank_specialties()` | Rank medical specialties by relevance with confidence scores |
| `get_doctors_by_specialty()` | Retrieve doctors in the recommended specialty |
| `calculate_doctor_score()` | Calculate weighted recommendation score for each doctor |
| `generate_explanation()` | Generate human-readable explanation for recommendation |

**Safety Rules:**

- Must NOT diagnose the patient — only recommend a **specialty**
- Must NOT replace professional medical judgment
- Must always display: *"This is a specialty recommendation, not a diagnosis."*
- AI should assist with recommendations but should NOT independently make final medical decisions
- If symptom analysis is uncertain → recommend General Medicine with explanation
- If analysis fails → safe failure: *"Unable to analyze symptoms. Please search for a doctor manually."*

### AI Explainability — Specialist Recommendation

```text
Specialist Recommendation Result

Submitted Symptoms:
  "I have chest pain, shortness of breath,
   and occasional dizziness."

Recommended Specialty:
  🥇 Cardiology — 95% confidence
  🥈 Pulmonology — 72% confidence

Why this specialty?
  Your reported symptoms — chest pain, shortness of breath,
  and dizziness — are commonly evaluated by a cardiologist.
  These symptoms are frequently associated with cardiovascular
  conditions that require specialist evaluation.

Recommended Doctors:
  1. Dr. A — 4.9 ⭐ — 15 years — Available
  2. Dr. B — 4.7 ⭐ — 12 years — Available

⚠️ Note: This is a specialty recommendation, not a diagnosis.
```

### AI Evaluation Metrics — Specialist & Doctor Recommendation

| Metric | Description |
|---|---|
| Specialty Recommendation Accuracy | % of recommendations matching the specialty the patient was eventually seen by |
| Doctor Ranking Consistency | Consistency of ranking across similar patient profiles |
| Recommendation Relevance | Quality of specialty match for given symptoms |
| Doctor Ranking Quality | Precision@K / NDCG where appropriate |
| User Satisfaction | Patient satisfaction with recommendations |

### Testing Responsibilities

- Unit tests for doctor/specialist services
- Unit tests for doctor ranking algorithm
- API integration tests for doctor, specialist, and rating endpoints
- React component tests for doctor management screens
- Flutter widget tests for doctor discovery screens
- Ranking algorithm edge case tests
- Authorization tests (only authorized users can manage doctors)
- Invalid doctor/specialist search tests

### Feature Branches

```text
feature/doctor-management
feature/specialist-management
feature/doctor-availability
feature/doctor-ratings
feature/doctor-ranking-algorithm
feature/doctor-search
feature/agent-specialist-recommendation
feature/react-doctor-screens
feature/flutter-doctor-discovery
```

### Deliverables Summary

- [ ] Doctor, Specialty, DoctorSpecialty, DoctorAvailability, DoctorRating, DoctorExperience database tables + EF Core migrations
- [ ] Doctor & Specialist REST APIs (minimum 4 meaningful endpoints)
- [ ] Doctor Ranking Algorithm (non-CRUD business operation)
- [ ] React doctor management portal (all screens listed above)
- [ ] Flutter doctor discovery screens (all screens listed above)
- [ ] Specialist & Doctor Recommendation Agent
- [ ] Seed data (sample doctors, specialties, ratings)
- [ ] Unit + integration + component tests
- [ ] API documentation (Swagger)
- [ ] Component documentation

---

## 6. Member 2 — Patient & Medical History & Appointment Management

### Business Focus

Everything related to **patient management and appointment workflow** — patient profiles, medical history, symptom recording, appointment booking, appointment scheduling with conflict detection, and appointment status management. Also owns the **Clinical Decision Support & Diagnosis Suggestion Agent**.

### Database Entities Owned

| Entity | Purpose |
|---|---|
| `Users` (Patient subset) | Patient user accounts |
| `Patients` | Patient profiles (contact, demographics, medical info) |
| `MedicalHistory` | Patient medical history records |
| `Symptoms` | Patient symptom submissions |
| `Appointments` | Appointment booking records |
| `AppointmentStatus` | Appointment status tracking |
| `DoctorSchedules` | Doctor scheduling slots for appointments |

### API Endpoints

```text
# Patient Management
POST   /api/auth/register                 # Patient registration
POST   /api/auth/login                    # Login (shared, but Member 2 implements)
GET    /api/patients/{id}                 # Get patient profile
PUT    /api/patients/{id}                 # Update patient profile

# Medical History
GET    /api/patients/{id}/medical-history # Get patient medical history
POST   /api/patients/{id}/medical-history # Add medical history entry
PUT    /api/medical-history/{id}          # Update medical history entry

# Symptoms
POST   /api/symptoms                      # Submit symptoms
GET    /api/symptoms/{id}                 # Get symptom details
GET    /api/patients/{id}/symptoms        # Get patient's symptom history

# Appointments
POST   /api/appointments                  # Book appointment
GET    /api/appointments/{id}             # Get appointment details
GET    /api/appointments/my               # Get patient's appointments
PATCH  /api/appointments/{id}/status      # Update appointment status
GET    /api/appointments/history          # Get appointment history
DELETE /api/appointments/{id}             # Cancel appointment (if permitted)

# Doctor Schedules
GET    /api/doctors/{id}/schedules        # Get doctor's available schedule slots
```

### Non-CRUD Business Operation — Appointment Scheduling

The system must perform intelligent appointment scheduling that goes beyond simple CRUD:

```text
Patient Requests Appointment
        ↓
Check Doctor Availability
        ↓
Check Existing Appointments
        ↓
Detect Time Conflicts
        ↓
Validate Appointment Rules
        ↓
Confirm or Reject
```

The scheduling logic should check:

- Doctor availability for the requested time slot
- Existing appointments to prevent double-booking
- Time conflict detection between overlapping slots
- Appointment status (cannot book with a suspended doctor)
- Patient eligibility (cannot book if account is restricted)

**Example — Conflict Detection:**

```text
Requested: Dr. A, 21 Aug 2026, 5:00 PM

Existing Appointments:
  4:30 PM - 5:00 PM → Patient X (CONFIRMED)
  5:00 PM - 5:30 PM → Patient Y (CONFIRMED)

Result: ❌ CONFLICT — Slot already booked.
Next available: 5:30 PM
```

### React Screens (Primary Owner) — Doctor Dashboard

```text
Doctor Dashboard (Doctor's View)
    ├── Dashboard Home
    │       ├── Today's Appointments
    │       ├── Upcoming Appointments
    │       └── Quick Stats
    ├── Appointment Management
    │       ├── Appointment List (filter by status, date)
    │       ├── Appointment Details
    │       │       ├── Patient Information
    │       │       ├── Scheduled Time
    │       │       ├── Status
    │       │       └── Actions (Confirm / Cancel)
    │       └── Appointment Calendar View
    ├── Patient Information View
    │       ├── Patient Profile
    │       ├── Medical History
    │       ├── Previous Appointments
    │       └── Symptom History
    └── Schedule Management
            ├── Set Available Slots
            ├── Block Dates
            └── Schedule Overview
```

### Flutter Screens (Primary Owner)

```text
Patient App — Medical & Appointments
    ├── Login / Register
    │       ├── Patient Registration
    │       └── Login Screen
    ├── Patient Dashboard
    │       ├── Quick Actions
    │       ├── Upcoming Appointments
    │       └── Recent Activity
    ├── Symptom Submission
    │       ├── Enter Symptoms (description, duration, severity)
    │       ├── Medical History Input
    │       └── Submit to AI Agent
    ├── Appointment Booking
    │       ├── Select Doctor (from recommendation or search)
    │       ├── Select Date/Time
    │       ├── Confirm Booking
    │       └── Booking Confirmation
    ├── Appointment History
    │       ├── Appointment List
    │       ├── Appointment Details
    │       └── Appointment Status Tracking
    └── Profile Management
            ├── Edit Profile
            ├── Medical History
            └── Settings
```

### AI Agent — Clinical Decision Support & Diagnosis Suggestion Agent

**Purpose:** Analyze patient-provided clinical information to identify possible medical conditions and provide decision-support suggestions. This agent does **not** diagnose the patient — it provides **decision support** for qualified healthcare professionals.

**Input:** Symptoms, patient-provided history, existing conditions, current medication information

**Workflow:**

```text
Patient Information
       +
Symptoms
       +
Medical History
       +
Existing Conditions
       ↓
Clinical Decision Support Agent
       ↓
Symptom Pattern Analysis
       ↓
Possible Condition Identification
       ↓
Confidence/Likelihood Scoring
       ↓
Supporting Evidence
       ↓
Recommended Specialty
       ↓
Suggested Next Steps
```

**Output:**

```json
{
  "patientId": "PAT-1024",
  "symptoms": ["fever", "cough", "sore throat"],
  "possibleConditions": [
    {
      "condition": "Viral Infection",
      "confidence": 0.85,
      "supportingSymptoms": ["fever", "cough", "sore throat"],
      "suggestedSpecialty": "General Medicine"
    },
    {
      "condition": "Influenza",
      "confidence": 0.72,
      "supportingSymptoms": ["fever", "cough"],
      "suggestedSpecialty": "General Medicine"
    },
    {
      "condition": "Respiratory Infection",
      "confidence": 0.58,
      "supportingSymptoms": ["cough", "sore throat"],
      "suggestedSpecialty": "Pulmonology"
    }
  ],
  "recommendedAction": "Consult an appropriate medical professional.",
  "disclaimer": "This is not a final medical diagnosis. A qualified healthcare professional must make the final decision."
}
```

**Example Display:**

```text
Clinical Decision Support Result

Symptoms: Fever, cough, sore throat

Possible Conditions:

1. Viral Infection — 85% likelihood
   Supporting: fever, cough, sore throat

2. Influenza — 72% likelihood
   Supporting: fever, cough

3. Respiratory Infection — 58% likelihood
   Supporting: cough, sore throat

Recommended Action:
  Consult an appropriate medical professional.

⚠️ This is NOT a final medical diagnosis.
   A qualified healthcare professional must make
   the final decision.
```

**Tools Used:**

| Tool | Purpose |
|---|---|
| `analyze_symptoms()` | Analyze submitted symptoms for pattern matching |
| `identify_conditions()` | Identify possible conditions based on symptom patterns |
| `calculate_confidence()` | Calculate likelihood/confidence scores |
| `get_supporting_evidence()` | Retrieve supporting symptoms for each condition |
| `suggest_next_steps()` | Generate recommended next steps |

**Safety Rules:**

- Must NOT present output as a confirmed diagnosis
- Must always clearly state: *"This is not a final medical diagnosis"*
- Must NOT prescribe treatment or medication
- Must recommend consulting a qualified healthcare professional
- If analysis is uncertain → recommend General Medicine consultation
- If analysis fails → safe failure: *"Unable to analyze symptoms. Please consult a healthcare professional directly."*

### AI Explainability — Clinical Decision Support

```text
Clinical Decision Support Result

Submitted Information:
  Symptoms: persistent headache, blurred vision, dizziness
  Duration: 2 weeks
  Existing conditions: hypertension

Possible Conditions:

1. Hypertension-related symptoms — 88%
   Supporting: headache, dizziness, existing hypertension

2. Migraine — 65%
   Supporting: persistent headache, blurred vision

Why these suggestions?
  The combination of persistent headache, blurred vision,
  and dizziness, together with existing hypertension,
  is commonly associated with blood pressure-related conditions.

Recommended Action:
  Consult a physician or cardiologist.

⚠️ This is decision support, not a final diagnosis.
```

### AI Evaluation Metrics — Clinical Decision Support

| Metric | Description |
|---|---|
| Condition Suggestion Accuracy | % of suggested conditions that were clinically relevant |
| Top-K Accuracy | Whether the correct condition appears in the top K suggestions |
| Confidence Calibration | Alignment between confidence scores and actual accuracy |
| Supporting Evidence Quality | Relevance of supporting symptoms cited |
| Safe Fallback Rate | % of uncertain cases correctly defaulting to safe recommendation |

### Testing Responsibilities

- Unit tests for patient/appointment services
- Unit tests for appointment scheduling conflict detection
- API integration tests for patient, appointment, and symptom endpoints
- React component tests for doctor dashboard screens
- Flutter widget tests for patient app screens
- Appointment conflict detection tests
- Authorization tests (patients see only their data)
- Clinical Decision Support Agent tests (valid symptoms, edge cases, safe failures)

### Feature Branches

```text
feature/authentication
feature/patient-management
feature/medical-history
feature/symptom-submission
feature/appointment-booking
feature/appointment-scheduling
feature/appointment-status
feature/agent-clinical-decision-support
feature/react-doctor-dashboard
feature/flutter-patient-app
```

### Deliverables Summary

- [ ] Patient, MedicalHistory, Symptom, Appointment, AppointmentStatus, DoctorSchedule database tables + EF Core migrations
- [ ] Authentication system (JWT, password hashing, login/register endpoints)
- [ ] Patient & Appointment REST APIs (minimum 4 meaningful endpoints)
- [ ] Appointment Scheduling Logic (non-CRUD business operation)
- [ ] React doctor dashboard (all screens listed above)
- [ ] Flutter patient app (all screens listed above)
- [ ] Clinical Decision Support & Diagnosis Suggestion Agent
- [ ] Seed data (sample patients, appointments, symptoms)
- [ ] Unit + integration + component tests
- [ ] API documentation (Swagger)
- [ ] Component documentation

---

## 7. Member 3 — Prescription & Medicine & Order Management

### Business Focus

Everything related to **prescription handling, medicine management, and order processing** — prescription upload and retrieval, medicine search and information, order creation, order cancellation, order status tracking, prescription-to-medicine processing, and pharmacist verification. Also owns the **Medication Intelligence Agent**.

### Database Entities Owned

| Entity | Purpose |
|---|---|
| `Prescriptions` | Prescription records (uploaded by patients) |
| `PrescriptionItems` | Individual medicine items within a prescription |
| `Medicines` | Master medicine records (name, strength, form, category) |
| `MedicineCategories` | Categories/classifications for medicines |
| `MedicationInstructions` | Dosage and frequency instructions |
| `Orders` | Medicine orders placed by patients |
| `OrderItems` | Individual medicines in an order |
| `OrderStatus` | Order status tracking |

### API Endpoints

```text
# Prescription Management
POST   /api/prescriptions                  # Upload prescription (Patient)
GET    /api/prescriptions/{id}             # Get prescription details
GET    /api/prescriptions/my               # Get patient's prescriptions
PUT    /api/prescriptions/{id}             # Update prescription status
GET    /api/prescriptions/{id}/items       # Get prescription items

# Medicine Management
GET    /api/medicines                      # Search/list medicines
GET    /api/medicines/{id}                 # Get medicine details
POST   /api/medicines                      # Add medicine (Admin/Pharmacist)
PUT    /api/medicines/{id}                 # Update medicine
GET    /api/medicines/search               # Search medicines (name, category)
GET    /api/medicine-categories            # List categories

# Orders
POST   /api/orders                         # Place medicine order (Patient)
GET    /api/orders/{id}                    # Get order details
GET    /api/orders/my                      # Get patient's orders
PATCH  /api/orders/{id}/cancel             # Cancel order
PATCH  /api/orders/{id}/status             # Update order status (Pharmacist)
GET    /api/orders/history                 # Get order history

# Pharmacist Actions
GET    /api/pharmacist/prescriptions       # View received prescriptions
POST   /api/pharmacist/prescriptions/{id}/verify  # Verify prescription
POST   /api/pharmacist/orders/{id}/confirm        # Confirm order
POST   /api/pharmacist/orders/{id}/reject         # Reject order
POST   /api/pharmacist/orders/{id}/ready          # Mark order as ready
POST   /api/pharmacist/orders/{id}/complete       # Mark order as completed
```

### Non-CRUD Business Operation — Prescription-to-Medicine Processing

The system processes an uploaded prescription and identifies relevant medicine information before checking pharmacy availability:

```text
Patient Uploads Prescription
        ↓
System Receives Prescription
        ↓
AI Extracts Medicine Information
        ↓
Identify Medicine Names
        ↓
Match with Medicine Database
        ↓
Identify Dosage & Frequency
        ↓
Check Pharmacy Availability
        ↓
Generate Order-Ready Information
```

**Example — Prescription Processing:**

```text
Uploaded Prescription: prescription_img_1024.jpg

AI Extraction Result:
  1. Amoxicillin 500mg — 3 times daily — 7 days
  2. Paracetamol 500mg — as needed — 5 days
  3. Omeprazole 20mg — once daily — 14 days

Medicine Database Match:
  ✓ Amoxicillin 500mg — Found
  ✓ Paracetamol 500mg — Found
  ✓ Omeprazole 20mg — Found

Status: Ready for pharmacy selection
```

### Medicine Price Calculation

The system should automatically calculate the medicine order price:

```text
Amoxicillin 500mg
Rs. 25 × 21 (3/day × 7 days) = Rs. 525

Paracetamol 500mg
Rs. 10 × 10 = Rs. 100

Omeprazole 20mg
Rs. 15 × 14 = Rs. 210

─────────────────────────────
TOTAL = Rs. 835
```

### React Screens (Primary Owner) — Pharmacist Portal

```text
Pharmacist Portal
    ├── Dashboard Home
    │       ├── Pending Prescriptions Count
    │       ├── Orders In Progress
    │       └── Completed Orders Today
    ├── Received Prescriptions
    │       ├── Prescription List
    │       └── Prescription Detail View
    │               ├── Prescription Image
    │               ├── AI-Extracted Medicines
    │               ├── Patient Information
    │               ├── Doctor Information
    │               ├── [ VERIFY PRESCRIPTION ]
    │               └── [ REJECT PRESCRIPTION ]
    ├── Medicine Management
    │       ├── Medicine List
    │       ├── Add Medicine
    │       ├── Edit Medicine
    │       ├── Medicine Categories
    │       └── Medicine Search
    ├── Order Management
    │       ├── Order List (filter by status)
    │       ├── Order Details
    │       │       ├── Medicine List with Quantities
    │       │       ├── Price Calculation
    │       │       ├── Patient Information
    │       │       └── Status Updates
    │       ├── Confirm Order
    │       ├── Prepare Order
    │       ├── Order Ready
    │       └── Order Completed
    └── Order Verification
            ├── Verify Prescription Accuracy
            ├── Contact Patient (if needed)
            └── Approval / Rejection
```

### Flutter Screens (Primary Owner)

```text
Patient App — Prescriptions & Orders
    ├── Prescription Upload
    │       ├── Camera Capture
    │       ├── Gallery Upload
    │       ├── Prescription Preview
    │       └── Submit Prescription
    ├── Medicine Information
    │       ├── Medicine Details
    │       ├── Dosage Instructions
    │       └── Medication Warnings
    ├── Medicine Search
    │       ├── Search by Name
    │       ├── Filter by Category
    │       └── Medicine Details
    ├── Order Placement
    │       ├── Review Extracted Medicines
    │       ├── Select Pharmacy
    │       ├── Review Order
    │       ├── Confirm Order
    │       └── Order Confirmation
    ├── Order Tracking
    │       ├── Order Status
    │       ├── Status Timeline
    │       └── Estimated Time
    ├── Order Cancellation
    │       ├── Cancel Before Confirmation
    │       ├── Cancel After Confirmation (with warning)
    │       └── Cancellation Confirmation
    └── Order History
            ├── Past Orders
            ├── Order Details
            └── Reorder
```

### AI Agent — Medication Intelligence Agent

**Purpose:** Analyze prescription and medication information to assist patients and pharmacists with prescription interpretation, medicine identification, dosage understanding, and potential conflict detection. This agent does **not** prescribe medicines or independently change a doctor's prescription.

**Input:** Prescription image/text, medicine names, dosage information

**Output:**

```json
{
  "prescriptionId": "RX-1024",
  "extractedMedicines": [
    {
      "name": "Amoxicillin 500mg",
      "dosage": "3 times daily",
      "duration": "7 days",
      "totalQuantity": 21,
      "instructions": "Take after meals",
      "warnings": ["May cause diarrhea", "Complete full course"]
    },
    {
      "name": "Paracetamol 500mg",
      "dosage": "As needed",
      "duration": "5 days",
      "totalQuantity": 10,
      "instructions": "Take for pain/fever",
      "warnings": ["Do not exceed 4g per day"]
    }
  ],
  "duplicateCheck": [],
  "conflictCheck": [],
  "overallWarnings": ["No significant interactions detected"]
}
```

**Functions:**

| Function | Description |
|---|---|
| Extract medicine names | Identify medicine names from prescription text/image |
| Identify dosage/frequency | Parse dosage and frequency information |
| Explain instructions | Provide clear medication instructions |
| Detect duplicates | Identify if same medicine appears multiple times |
| Check conflicts | Identify potential medication interactions |
| Generate warnings | Provide medication-related safety warnings |
| Assist interpretation | Help pharmacists and patients understand prescriptions |

**Tools Used:**

| Tool | Purpose |
|---|---|
| `extract_medicines()` | Extract medicine names from prescription text/image |
| `parse_dosage()` | Parse dosage and frequency information |
| `check_duplicates()` | Check for duplicate medicine entries |
| `check_interactions()` | Check for potential drug interactions |
| `generate_instructions()` | Generate clear medication instructions |
| `generate_warnings()` | Generate medication safety warnings |

**Safety Rules:**

- Must NOT prescribe medicines or independently change a doctor's prescription
- Must NOT independently substitute medicines
- Extracted information must be verified by a pharmacist
- If extraction fails → safe failure: *"Unable to read prescription. Please consult the pharmacist directly."*
- Must clearly label output as AI-assisted extraction, not a verified result

### AI Explainability — Medication Intelligence

```text
Medication Intelligence Result

Prescription: RX-1024

Extracted Medicines:
  1. Amoxicillin 500mg — 3× daily — 7 days
     → Antibiotic for bacterial infections
     → Complete full course even if feeling better

  2. Paracetamol 500mg — As needed — 5 days
     → Pain/fever relief
     → Do not exceed 4g per day

Duplicate Check: ✓ No duplicates found
Interaction Check: ✓ No significant interactions

⚠️ This is AI-assisted extraction.
   Pharmacist verification is required.
```

### AI Evaluation Metrics — Medication Intelligence

| Metric | Description |
|---|---|
| Medicine Extraction Accuracy | % of medicine names correctly extracted from prescriptions |
| Dosage Parsing Accuracy | % of dosage/frequency information correctly parsed |
| Duplicate Detection Accuracy | % of duplicate medicines correctly identified |
| Interaction Detection Accuracy | % of potential interactions correctly flagged |
| Safe Fallback Rate | % of unreadable prescriptions correctly flagged for manual review |

### Testing Responsibilities

- Unit tests for prescription/medicine/order services
- Unit tests for prescription-to-medicine processing
- API integration tests for prescription, medicine, and order endpoints
- React component tests for pharmacist portal screens
- Flutter widget tests for prescription and order screens
- Prescription processing edge case tests
- Order cancellation rule tests
- Medicine search and validation tests
- Medication Intelligence Agent tests (extraction, conflicts, edge cases)

### Feature Branches

```text
feature/prescription-upload
feature/prescription-processing
feature/medicine-management
feature/medicine-categories
feature/order-management
feature/order-cancellation
feature/order-status
feature/price-calculation
feature/agent-medication-intelligence
feature/react-pharmacist-portal
feature/flutter-prescription-screens
feature/flutter-order-screens
```

### Deliverables Summary

- [ ] Prescription, PrescriptionItem, Medicine, MedicineCategory, MedicationInstruction, Order, OrderItem, OrderStatus database tables + EF Core migrations
- [ ] Prescription & Medicine REST APIs (minimum 4 meaningful endpoints)
- [ ] Order Management REST APIs
- [ ] Prescription-to-Medicine Processing (non-CRUD business operation)
- [ ] Medicine price calculation
- [ ] React pharmacist portal (all screens listed above)
- [ ] Flutter prescription & order screens (all screens listed above)
- [ ] Medication Intelligence Agent
- [ ] Seed data (sample medicines, categories, prescriptions)
- [ ] Unit + integration + component tests
- [ ] API documentation (Swagger)
- [ ] Component documentation

---

## 8. Member 4 — Pharmacy & Inventory & Supplier Management

### Business Focus

Everything related to **pharmacy operations, inventory management, and supplier restocking** — pharmacy registration and search, inventory management, stock monitoring, supplier management, restocking requests, pharmacy selection based on availability and distance, and demand-based restocking intelligence. Also owns the **Pharmacy & Inventory Intelligence Agent**.

### Database Entities Owned

| Entity | Purpose |
|---|---|
| `Pharmacies` | Pharmacy records (name, address, details, status) |
| `PharmacyLocations` | Pharmacy location/coordinates for distance-based search |
| `Inventory` | Stock levels per medicine (quantity, expiry, min stock) |
| `InventoryTransactions` | Historical stock changes (additions, removals, adjustments) |
| `Suppliers` | Supplier company records |
| `RestockRequests` | Restock requests from pharmacy to supplier |
| `PharmacyOrders` | Pharmacy-level order records |

### API Endpoints

```text
# Pharmacy Management
GET    /api/pharmacies                     # List/search pharmacies
GET    /api/pharmacies/{id}                # Get pharmacy details
POST   /api/pharmacies                     # Register pharmacy
PUT    /api/pharmacies/{id}                # Update pharmacy
GET    /api/pharmacies/nearby              # Search nearby pharmacies (location-based)
GET    /api/pharmacies/{id}/medicines      # Get medicines available at pharmacy

# Inventory Management
GET    /api/pharmacies/{id}/inventory      # Get pharmacy inventory
POST   /api/inventory                      # Add inventory entry
PATCH  /api/inventory/{id}                 # Update stock level
GET    /api/inventory/low-stock            # Get low-stock items
GET    /api/inventory/expiring             # Get expiring/expired items
GET    /api/inventory/history              # Get inventory transaction history

# Supplier Management
GET    /api/suppliers                      # List suppliers
GET    /api/suppliers/{id}                 # Supplier details
POST   /api/suppliers                      # Register supplier
PUT    /api/suppliers/{id}                 # Update supplier
GET    /api/suppliers/{id}/medicines       # Medicines supplied by this supplier

# Restock Requests
POST   /api/restock-requests               # Create restock request
GET    /api/restock-requests               # List restock requests
GET    /api/restock-requests/{id}          # Get request details
POST   /api/restock-requests/{id}/approve  # Approve request (Supplier)
POST   /api/restock-requests/{id}/reject   # Reject request (Supplier)
PUT    /api/restock-requests/{id}/delivery # Update delivery status
GET    /api/suppliers/{id}/supply-history  # View supply history
```

### Non-CRUD Business Operation — Pharmacy Selection & Restocking Decision

**Pharmacy Selection:**

The system should determine suitable pharmacies for a patient's order based on multiple factors:

```text
Patient Order Request
        ↓
Check Medicine Availability
        ↓
Calculate Distance
        ↓
Check Stock Quantity
        ↓
Check Pharmacy Status
        ↓
Check Operating Hours
        ↓
Rank Pharmacies
        ↓
Recommend Best Options
```

| Factor | Description |
|---|---|
| Medicine Availability | Does the pharmacy have the required medicines? |
| Distance | How far is the pharmacy from the patient? |
| Stock Quantity | Does the pharmacy have sufficient stock? |
| Pharmacy Status | Is the pharmacy currently active/open? |
| Operating Hours | Is the pharmacy open during the desired time? |

**Restocking Decision:**

The inventory system should identify medicines that require restocking:

```text
When: Current Stock < Minimum Stock

⚠️ Amoxicillin 500mg is low in stock.

Current Stock:  8
Minimum Stock:  20

Suggested Restock Quantity: 50
```

### React Screens (Primary Owner) — Pharmacy & Supplier Portals

#### Pharmacy Owner Dashboard

```text
Pharmacy Owner Dashboard
    ├── Dashboard Home
    │       ├── Inventory Overview
    │       ├── Low-Stock Alerts
    │       ├── Active Orders Count
    │       └── Revenue Summary
    ├── Inventory Dashboard
    │       ├── Stock Overview
    │       ├── Inventory List (all medicines)
    │       ├── Low Stock Alerts (⚠ with current vs. minimum)
    │       ├── Expiring / Expired Medicines
    │       └── Inventory History
    ├── Stock Management
    │       ├── Add Medicine to Inventory
    │       ├── Update Stock Level
    │       ├── Set Minimum Stock
    │       └── Stock Adjustment
    ├── AI Demand Insights
    │       ├── Demand Predictions
    │       ├── Frequently Ordered Medicines
    │       ├── Stock-Out Predictions
    │       └── Restocking Recommendations
    ├── Pharmacy Profile Management
    │       ├── Pharmacy Information
    │       ├── Location
    │       ├── Operating Hours
    │       └── Contact Details
    └── Pharmacy Analytics
            ├── Order Statistics
            ├── Medicine Demand Trends
            └── Customer Ratings & Feedback
```

#### Supplier Portal

```text
Supplier Portal
    ├── Dashboard Home
    │       ├── Pending Requests Count
    │       ├── Approved Requests
    │       └── Quick Stats
    ├── Supplier Profile
    ├── Medicines Supplied
    ├── Restock Requests
    │       ├── Request List (Pending / Approved / Rejected)
    │       ├── Request Details
    │       │       ├── Medicine Name
    │       │       ├── Current Stock (at pharmacy)
    │       │       ├── Requested Quantity
    │       │       ├── AI Recommendation
    │       │       ├── Status
    │       │       ├── [ APPROVE ]
    │       │       └── [ REJECT ]
    │       └── Request History
    ├── Delivery Management
    │       ├── Pending Deliveries
    │       ├── Delivery Status Updates
    │       └── Completed Deliveries
    └── Supply History
```

**Example — Restock Request:**

```text
RESTOCK REQUEST

Medicine:           Amoxicillin 500mg
Current Stock:      8
Requested Quantity: 50
AI Recommendation:  Restock ~100 units (high demand predicted)
Status:             PENDING

[ APPROVE ]  [ REJECT ]
```

### Flutter Screens (Primary Owner)

```text
Patient App — Pharmacy & Availability
    ├── Nearby Pharmacy Search
    │       ├── Map View (nearby pharmacies)
    │       ├── List View (distance-based)
    │       ├── Filter by Medicine Availability
    │       └── Filter by Operating Hours
    ├── Pharmacy Details
    │       ├── Pharmacy Information
    │       ├── Location & Map
    │       ├── Operating Hours
    │       ├── Available Medicines
    │       └── Ratings & Reviews
    ├── Medicine Availability
    │       ├── Check Medicine at Pharmacy
    │       ├── Stock Status
    │       └── Alternative Pharmacies
    ├── Pharmacy Selection
    │       ├── Compare Pharmacies
    │       ├── Availability Status
    │       ├── Distance
    │       └── Select Pharmacy for Order
    └── Order Tracking (pharmacy side)
            ├── Order Status from Pharmacy
            └── Delivery/Pickup Status
```

### Supplier Restocking Workflow

```text
Pharmacy Inventory
   ↓
AI Detects Low Stock
   ↓
Demand Prediction
   ↓
Recommended Restock Quantity
   ↓
Pharmacist / Owner Reviews
   ↓
Create Restock Request
   ↓
Supplier Portal
   ↓
Supplier Reviews Request
   ↓
Supplier Approves / Rejects
   ↓
Supply Process
   ↓
Pharmacy Receives Stock
   ↓
Inventory Updated
```

### AI Agent — Pharmacy & Inventory Intelligence Agent

**Purpose:** Analyze pharmacy inventory and operational data to predict demand, detect low stock, recommend restocking quantities, and assist with pharmacy selection for patient orders. The final restocking decision should remain under authorized pharmacist/pharmacy-owner control.

**Input:** Inventory data, order history, demand patterns, pharmacy location data

**Output:**

```json
{
  "medicine": "Paracetamol 500mg",
  "currentStock": 20,
  "minimumStock": 50,
  "averageWeeklyDemand": 80,
  "status": "LOW_STOCK",
  "prediction": "Stock-out likely within approximately 2 days.",
  "recommendation": "Restock approximately 100 units.",
  "reason": "Current stock is well below minimum threshold and weekly demand is high.",
  "frequentlyOrdered": true
}
```

**Functions:**

| Function | Description |
|---|---|
| Predict future demand | Analyze historical orders to forecast medicine demand |
| Detect low stock | Identify medicines below minimum stock levels |
| Predict stock-outs | Predict when a medicine may become unavailable |
| Recommend restocking | Suggest optimal restocking quantities |
| Identify frequently ordered | Track most frequently ordered medicines |
| Recommend pharmacies | Suggest suitable pharmacies based on availability |
| Assist suppliers | Help suppliers prioritize restocking |

**Tools Used:**

| Tool | Purpose |
|---|---|
| `monitor_inventory_levels()` | Real-time inventory monitoring |
| `detect_low_stock()` | Detect medicines below minimum stock level |
| `analyze_demand()` | Analyze historical demand patterns |
| `predict_stockout()` | Predict when stock may run out |
| `calculate_restock_quantity()` | Recommend optimal restock quantities |
| `recommend_pharmacies()` | Rank pharmacies by availability and distance |

**Safety Rules:**

- Must base recommendations on actual inventory data only
- Must NOT auto-restock without pharmacist/owner approval
- Restock recommendations are suggestions — human decides
- If data insufficient → report *"Insufficient historical data for demand prediction"*
- If inventory data unavailable → safe failure with message

### AI Explainability — Pharmacy & Inventory Intelligence

```text
AI Inventory Intelligence Result

Medicine:       Paracetamol 500mg
Current Stock:  20 units
Minimum Stock:  50 units
Weekly Demand:  80 units (average)

Prediction:
  Stock may become insufficient within approximately 2 days
  based on recent demand patterns.

Recommendation:
  Restock approximately 100 units.

Reason:
  Current stock (20) is significantly below the minimum
  threshold (50) and recent demand has been increasing.
  Historical data shows average weekly usage of 80 units.

⚠️ This is an AI recommendation.
   The pharmacist/pharmacy owner must approve any restocking decision.
```

### AI Evaluation Metrics — Pharmacy & Inventory Intelligence

| Metric | Description |
|---|---|
| Low-Stock Detection Accuracy | % of low-stock situations correctly identified |
| Demand Prediction Accuracy | Accuracy of usage/demand forecasting |
| Stock-Out Prediction Accuracy | % of stock-outs correctly predicted before occurrence |
| Restocking Recommendation Accuracy | Appropriateness of suggested restock quantities |
| Pharmacy Selection Accuracy | % of pharmacy recommendations matching patient needs |

### Testing Responsibilities

- Unit tests for pharmacy/inventory/supplier services
- Unit tests for pharmacy selection logic
- API integration tests for pharmacy, inventory, and supplier endpoints
- React component tests for pharmacy and supplier portal screens
- Flutter widget tests for pharmacy search and selection screens
- Stock update and inventory calculation tests
- Restocking request workflow tests
- Distance-based pharmacy selection tests
- Pharmacy & Inventory Intelligence Agent tests (low stock, demand, restocking)

### Feature Branches

```text
feature/pharmacy-management
feature/pharmacy-search
feature/pharmacy-location
feature/inventory-management
feature/stock-monitoring
feature/low-stock-detection
feature/supplier-management
feature/restock-requests
feature/restock-approval
feature/supply-workflow
feature/agent-pharmacy-inventory-intelligence
feature/react-pharmacy-owner-dashboard
feature/react-supplier-portal
feature/flutter-pharmacy-screens
```

### Deliverables Summary

- [ ] Pharmacy, PharmacyLocation, Inventory, InventoryTransaction, Supplier, RestockRequest, PharmacyOrder database tables + EF Core migrations
- [ ] Pharmacy & Inventory REST APIs (minimum 4 meaningful endpoints)
- [ ] Supplier & Restock REST APIs
- [ ] Pharmacy Selection Logic (non-CRUD business operation)
- [ ] Restocking Decision Logic (non-CRUD business operation)
- [ ] React pharmacy owner dashboard (all screens listed above)
- [ ] React supplier portal (all screens listed above)
- [ ] Flutter pharmacy search & selection screens (all screens listed above)
- [ ] Pharmacy & Inventory Intelligence Agent
- [ ] Seed data (sample pharmacies, inventory, suppliers)
- [ ] Unit + integration + component tests
- [ ] API documentation (Swagger)
- [ ] Component documentation

---

## 9. Agent & SE Responsibility Summary

| Member | SE Component | AI Agent |
|---|---|---|
| Member 1 | Doctor & Specialist Management | 🩺 Specialist & Doctor Recommendation Agent |
| Member 2 | Patient & Medical History & Appointment Management | 🧠 Clinical Decision Support & Diagnosis Suggestion Agent |
| Member 3 | Prescription & Medicine & Order Management | 💊 Medication Intelligence Agent |
| Member 4 | Pharmacy & Inventory & Supplier Management | 📦 Pharmacy & Inventory Intelligence Agent |

### Four Agents — What They Answer

```text
Agent 1 (Member 1) — Specialist & Doctor Recommendation
    → "Who should I see?"
    → Symptoms → Specialty → Ranked Doctors

Agent 2 (Member 2) — Clinical Decision Support
    → "What could this condition indicate?"
    → Symptoms + History → Possible Conditions → Decision Support

Agent 3 (Member 3) — Medication Intelligence
    → "What does this prescription mean?"
    → Prescription → Medicine Extraction → Instructions → Warnings

Agent 4 (Member 4) — Pharmacy & Inventory Intelligence
    → "Where can I get medicine and should the pharmacy restock?"
    → Inventory → Demand → Prediction → Restocking
```

---

## 10. Human-in-the-Loop AI Architecture

AI should **assist** rather than independently make medical decisions. The following decisions **must** remain with humans:

| Decision Point | Human Authority | AI Role |
|---|---|---|
| Specialist Selection | Patient selects doctor and makes booking decision | AI recommends specialty based on symptoms (not a diagnosis) |
| Clinical Assessment | Doctor/healthcare professional makes the final clinical decision | AI suggests possible conditions with confidence scores |
| Prescription | Doctor prescribes medicines; pharmacist verifies | AI extracts and interprets prescription information |
| Medicine Substitution | Doctor decides if alternative is clinically appropriate | AI identifies potential conflicts and warnings |
| Pharmacy Selection | Patient selects pharmacy | AI recommends pharmacies by availability and distance |
| Restocking | Pharmacist/pharmacy owner approves restock | AI recommends restocking quantities based on demand |
| Supplier Fulfillment | Supplier approves/rejects restock request | AI assists with restocking priorities |

This creates a strong **Human-in-the-Loop Agentic AI Architecture**.

---

## 11. Complete End-to-End Workflow with Member Ownership

```text
MEMBER 2              MEMBER 1              MEMBER 2              MEMBER 3              MEMBER 4
────────              ────────              ────────              ────────              ────────
Patient opens
app
    │
    ▼
Login / Register
    │
    ▼
Enter Symptoms ────────────────► Specialist
                                 Recommendation
                                 Agent (M1)
                                      │
                                      ▼
                                 Recommended
                                 Specialty +
                                 Ranked Doctors
    ◄─────────────────────────────────┘
    │
    ▼
View Recommendation
    │
    ▼
Select Doctor
    │
    ▼
Book Appointment ──► Appointment
    │                Scheduling
    ▼                Logic (M2)
Appointment Confirmed
    │
    ▼
Doctor Consultation
    │
    ▼
Clinical Decision ──► Clinical Decision
Support                Support Agent (M2)
    │
    ▼
Doctor Reviews
AI Suggestions
    │
    ▼
Patient Gets ───────────────────► Patient Uploads
Prescription                      Prescription
                                      │
                                      ▼
                                 Medication
                                 Intelligence
                                 Agent (M3)
                                      │
                                      ▼
                                 Extract Medicines
                                      │
                                      ▼
                                 Search Pharmacies ──────► Pharmacy
                                      │                    Intelligence
                                      │                    Agent (M4)
                                      │                         │
                                      ◄──────────────────────────┘
                                      │
                                      ▼
                                 Patient Selects
                                 Pharmacy
                                      │
                                      ▼
                                 Place Order
                                      │
                                      ▼
                                 Pharmacist
                                 Verifies (M3)
                                      │
                                      ▼
                                 Process Order
                                      │
                                      ▼
                                 Order Completed
                                      │
                                 Inventory Update ───────► Inventory
                                                           Intelligence
                                                           Agent (M4)
                                                                │
                                                           Low Stock?
                                                                │
                                                           Restock
                                                           Recommendation
                                                                │
                                                                ▼
                                                           Supplier
                                                           Portal (M4)
                                                                │
                                                           Approve/Reject
                                                                │
                                                           Supply & Update
                                                           Inventory
    │
    ▼
Patient Feedback
& Rating
```

---

## 12. Pharmacy Ordering Workflow

The complete medicine-order workflow:

### Patient Side

```text
1. Patient uploads prescription
2. Medication Intelligence Agent extracts medicine information
3. System validates the prescription information
4. System searches pharmacies
5. Pharmacy & Inventory Agent helps identify suitable pharmacies
6. Patient selects a pharmacy
7. Patient places the order
```

### Pharmacist Side

```text
8. Pharmacist receives the order
9. Pharmacist verifies the prescription
10. Pharmacist contacts the patient if required
11. Pharmacist confirms or rejects the order
```

### Patient Follow-up

```text
12. Patient receives order status
13. Patient can cancel before confirmation
14. After confirmation, cancellation follows system rules
```

---

## 13. Cancellation & Account Suspension

The system should implement a business rule for repeated confirmed-order cancellations:

```text
Cancel before pharmacist confirmation → Normal cancellation
Cancel after confirmation → Warning issued
Repeated confirmed-order cancellations → Account restriction
Exceed cancellation threshold → Account suspended
Pharmacy can review/reactivate → Per system policy
```

**Business Rules:**

| Scenario | Action |
|---|---|
| Patient cancels before pharmacist confirms | Normal cancellation, no penalty |
| Patient cancels after pharmacist confirms (1st time) | Warning message displayed |
| Patient cancels after confirmation (repeated) | Account restriction at pharmacy |
| Cancellation threshold exceeded | Account suspended at that pharmacy |
| Pharmacy reviews suspension | Can reactivate account per policy |

This must be implemented as a **business workflow**, not simply as CRUD operations.

---

## 14. Rating & Feedback System

Patients can rate:

- Doctors (contributes to Member 1's ranking algorithm)
- Pharmacies (contributes to Member 4's pharmacy selection)

The system should store:

| Field | Description |
|---|---|
| Rating | Numeric rating (e.g., 1-5 stars) |
| Review | Text feedback |
| User | Patient who submitted |
| Target | Doctor or pharmacy being rated |
| Timestamp | When the review was submitted |

**Rating Usage:**

- Doctor rankings should use ratings together with other meaningful factors (see Member 1 — Doctor Ranking Algorithm)
- Pharmacy recommendations should consider ratings alongside availability and distance
- Only patients with completed interactions should be able to submit reviews

---

## 15. Patient Order History

The patient dashboard should show all previous medicine orders:

```text
MY MEDICINE ORDERS

Order #ORD-1024
Pharmacy:     ABC Pharmacy
Medicines:    Amoxicillin 500mg × 21
              Paracetamol 500mg × 10
Total:        Rs. 625
Status:       COMPLETED

Order #ORD-1018
Pharmacy:     City Pharmacy
Medicines:    Omeprazole 20mg × 14
Total:        Rs. 210
Status:       DELIVERED
```

Patients can view previous:

- Appointments
- Prescriptions
- Medicine orders
- Order status
- Ratings given

---

## 16. Database Requirements

The PostgreSQL database should follow proper relational database principles.

### User Management

| Entity | Owner | Purpose |
|---|---|---|
| `Users` | Shared | User accounts (all roles) |
| `Roles` | Shared | Role definitions |
| `UserRoles` | Shared | User-role associations |

### Medical

| Entity | Owner | Purpose |
|---|---|---|
| `Doctors` | Member 1 | Doctor profiles |
| `Specialties` | Member 1 | Medical specialties |
| `DoctorSpecialties` | Member 1 | Doctor-specialty mapping |
| `DoctorAvailability` | Member 1 | Doctor schedule slots |
| `DoctorRatings` | Member 1 | Doctor ratings/reviews |
| `DoctorExperience` | Member 1 | Doctor experience records |
| `Patients` | Member 2 | Patient profiles |
| `MedicalHistory` | Member 2 | Patient medical history |
| `Symptoms` | Member 2 | Patient symptom records |
| `Appointments` | Member 2 | Appointment bookings |
| `AppointmentStatus` | Member 2 | Appointment tracking |
| `DoctorSchedules` | Member 2 | Doctor schedule slots |

### Prescription & Medicine

| Entity | Owner | Purpose |
|---|---|---|
| `Prescriptions` | Member 3 | Prescription records |
| `PrescriptionItems` | Member 3 | Medicine items in prescriptions |
| `Medicines` | Member 3 | Master medicine records |
| `MedicineCategories` | Member 3 | Medicine classifications |
| `MedicationInstructions` | Member 3 | Dosage/frequency information |
| `Orders` | Member 3 | Medicine orders |
| `OrderItems` | Member 3 | Individual order items |
| `OrderStatus` | Member 3 | Order status tracking |

### Pharmacy & Supplier

| Entity | Owner | Purpose |
|---|---|---|
| `Pharmacies` | Member 4 | Pharmacy records |
| `PharmacyLocations` | Member 4 | Pharmacy coordinates |
| `Inventory` | Member 4 | Stock levels |
| `InventoryTransactions` | Member 4 | Stock change history |
| `Suppliers` | Member 4 | Supplier records |
| `RestockRequests` | Member 4 | Restock requests |
| `PharmacyOrders` | Member 4 | Pharmacy-level orders |

### Feedback & AI

| Entity | Owner | Purpose |
|---|---|---|
| `PharmacyRatings` | Member 4 | Pharmacy ratings |
| `Reviews` | Shared | Review text |
| `AgentRequests` | Shared | AI agent request records |
| `AgentRecommendations` | Shared | AI recommendation records |
| `AgentExecutionLogs` | Shared | Agent execution audit trail |
| `AgentApprovals` | Shared | Human approval/rejection records |
| `AuditLogs` | Shared | System-wide audit trail |

---

## 17. Controlled Tool Registry

All agents access the system through **allow-listed tools only**. No agent has direct database or system access.

| Tool | Owner | Used By | Purpose |
|---|---|---|---|
| `analyze_symptoms()` | Member 1 | Specialist Recommendation Agent | Analyze symptoms for specialty match |
| `rank_specialties()` | Member 1 | Specialist Recommendation Agent | Rank specialties with confidence |
| `get_doctors_by_specialty()` | Member 1 | Specialist Recommendation Agent | Find doctors in specialty |
| `calculate_doctor_score()` | Member 1 | Specialist Recommendation Agent | Calculate weighted doctor score |
| `generate_explanation()` | Member 1 | Specialist Recommendation Agent | Generate recommendation explanation |
| `analyze_symptoms()` | Member 2 | Clinical Decision Support Agent | Analyze symptoms for conditions |
| `identify_conditions()` | Member 2 | Clinical Decision Support Agent | Identify possible conditions |
| `calculate_confidence()` | Member 2 | Clinical Decision Support Agent | Calculate confidence scores |
| `get_supporting_evidence()` | Member 2 | Clinical Decision Support Agent | Get supporting evidence |
| `suggest_next_steps()` | Member 2 | Clinical Decision Support Agent | Generate next step suggestions |
| `extract_medicines()` | Member 3 | Medication Intelligence Agent | Extract medicines from prescription |
| `parse_dosage()` | Member 3 | Medication Intelligence Agent | Parse dosage information |
| `check_duplicates()` | Member 3 | Medication Intelligence Agent | Check for duplicate medicines |
| `check_interactions()` | Member 3 | Medication Intelligence Agent | Check drug interactions |
| `generate_warnings()` | Member 3 | Medication Intelligence Agent | Generate medication warnings |
| `monitor_inventory_levels()` | Member 4 | Pharmacy & Inventory Intelligence Agent | Real-time inventory monitoring |
| `detect_low_stock()` | Member 4 | Pharmacy & Inventory Intelligence Agent | Low-stock detection |
| `analyze_demand()` | Member 4 | Pharmacy & Inventory Intelligence Agent | Demand analysis |
| `predict_stockout()` | Member 4 | Pharmacy & Inventory Intelligence Agent | Stock-out prediction |
| `calculate_restock_quantity()` | Member 4 | Pharmacy & Inventory Intelligence Agent | Restock recommendations |
| `recommend_pharmacies()` | Member 4 | Pharmacy & Inventory Intelligence Agent | Pharmacy recommendations |

**Every tool must:**

- Validate inputs
- Validate outputs
- Enforce authorization
- Return structured results
- Log execution to `AgentExecutionLogs`
- Handle errors safely (no unhandled exceptions)

---

## 18. AI Agent Architecture

The four agents should not operate as uncontrolled chatbots. Each agent follows a structured workflow:

```text
Step 1 — Receive Request
    User submits information through Flutter or React.

Step 2 — Validate Input
    Backend validates: user identity, required fields, data format, permissions.

Step 3 — Agent Planning
    The relevant agent determines what information/tools it needs.

Step 4 — Controlled Tool/API Access
    Agent accesses ONLY allow-listed tools/APIs.

Step 5 — Generate Recommendation
    Agent processes retrieved information.

Step 6 — Deterministic Validation
    Backend validates agent output against system rules.

Step 7 — Human Approval (Where Required)
    For medical, prescription, inventory, or pharmacy-sensitive operations,
    authorized professionals have the final approval.

Step 8 — Persist Result
    Recommendation/decision is stored.

Step 9 — Audit
    System records: agent used, input, tools accessed, recommendation,
    timestamp, user, approval/rejection, final action.
```

**Example — Agent Tool Access:**

```text
Specialist Agent
    → Symptoms API
    → Specialist API
    → Doctor API
    → Rating API
    → Availability API

Clinical Decision Support Agent
    → Symptoms API
    → Medical History API
    → Conditions Database

Medication Intelligence Agent
    → Prescription API
    → Medicine Database API
    → Interaction Database

Pharmacy & Inventory Agent
    → Inventory API
    → Order History API
    → Pharmacy Location API
    → Supplier API
```

---

## 19. Security and Authorization

### Authentication & Authorization

| Responsibility | Owner |
|---|---|
| JWT generation, validation, middleware | Member 2 (implements) |
| Password hashing (bcrypt) | Member 2 (implements) |
| Role-based `[Authorize]` attributes on endpoints | Each member on their own endpoints |
| Protected React routes | All members (on their own pages) |
| Flutter secure token storage | Member 2 |

### Roles and Permissions

```text
PATIENT         → Search doctors, book appointments, upload prescriptions, order medicines,
                  track orders, provide feedback
DOCTOR          → Manage profile, view appointments, manage availability
PHARMACIST      → Verify prescriptions, process orders, manage medicines
PHARMACY_OWNER  → Manage pharmacy, full inventory control, analytics
SUPPLIER        → View/approve/reject restock requests
ADMIN           → Full system access, audit logs, AI monitoring
```

### Security Rules

| Rule | Details |
|---|---|
| No secrets in Git | Connection strings, API keys stored in environment variables |
| Input validation on all endpoints | All members validate their endpoints |
| Role-based authorization | All members enforce on their endpoints |
| Patient-specific access | Patients see only their own data |
| Doctor-specific access | Doctors see only their own appointments/patients |
| Pharmacy-specific access | Pharmacists see only their pharmacy data |
| Supplier-specific access | Suppliers see only their restock requests |
| Patients cannot modify inventory | Enforced by authorization |
| Suppliers cannot access patient history | Enforced by authorization |
| Safe AI failure | All agents handle errors gracefully |
| Audit logging for critical actions | All members log critical actions |

---

## 20. AI Evaluation Framework

### Agent-Level Metrics

| Agent | Metrics |
|---|---|
| Specialist & Doctor Recommendation | Specialty accuracy, ranking consistency, recommendation relevance, user satisfaction |
| Clinical Decision Support | Condition suggestion accuracy, top-K accuracy, confidence calibration, safe fallback rate |
| Medication Intelligence | Extraction accuracy, dosage parsing, duplicate/conflict detection, safe fallback rate |
| Pharmacy & Inventory Intelligence | Low-stock detection, demand prediction, stock-out prediction, restocking accuracy, pharmacy selection |

### System-Level Metrics

| Metric | Description |
|---|---|
| Agent Success Rate | % of individual agent executions that succeed |
| Tool-Call Success Rate | % of tool calls that return expected results |
| Recommendation Accuracy | Aggregate accuracy across all agents |
| Average Processing Time | Mean time from request to recommendation |
| Patient Satisfaction | Average feedback rating across the system |
| Safe Failure Rate | % of errors handled gracefully |

---

## 21. Shared Responsibilities

These responsibilities are shared across **all four members**:

### Database & EF Core (Collaborative)

| Responsibility | Details |
|---|---|
| Shared `AppDbContext` | All members register their entities |
| Migrations | Each member creates migrations for their tables |
| Seed data | Each member seeds demo data for their entities |
| Connection strings | Stored in environment variables / User Secrets, never in Git |

### Swagger / OpenAPI (Each Member)

Every member documents **their own endpoints** with:

- Request/response schemas
- Status codes and error responses
- Authentication requirements
- Example values

### CI / GitHub Actions (Collaborative)

| Step | Responsibility |
|---|---|
| Workflow file creation (`.github/workflows/ci.yml`) | Shared (one member leads) |
| Backend build + test | Verifies all members' code |
| React build + test | Verifies all members' React code |
| Flutter test | Verifies Flutter code |
| Secret management | GitHub Secrets, not committed |

---

## 22. Responsibility Matrix

| Area | M1 | M2 | M3 | M4 |
|---|:---:|:---:|:---:|:---:|
| **Backend (DB + API)** | | | | |
| Doctor/Specialist tables & APIs | ⭐ | | | |
| Doctor Availability APIs | ⭐ | | | |
| Doctor Rating APIs | ⭐ | | | |
| Doctor Ranking Algorithm | ⭐ | | | |
| Patient tables & APIs | | ⭐ | | |
| Authentication (JWT) | | ⭐ | | |
| Appointment tables & APIs | | ⭐ | | |
| Medical History APIs | | ⭐ | | |
| Symptom APIs | | ⭐ | | |
| Prescription tables & APIs | | | ⭐ | |
| Medicine tables & APIs | | | ⭐ | |
| Order tables & APIs | | | ⭐ | |
| Price Calculation | | | ⭐ | |
| Pharmacy tables & APIs | | | | ⭐ |
| Inventory tables & APIs | | | | ⭐ |
| Supplier tables & APIs | | | | ⭐ |
| Restock Request APIs | | | | ⭐ |
| **Flutter** | | | | |
| Doctor discovery screens | ⭐ | | | |
| Auth + patient screens | | ⭐ | | |
| Appointment screens | | ⭐ | | |
| Prescription upload screens | | | ⭐ | |
| Order screens | | | ⭐ | |
| Pharmacy search screens | | | | ⭐ |
| **React** | | | | |
| Doctor management portal | ⭐ | | | |
| Doctor dashboard (appointment view) | | ⭐ | | |
| Pharmacist portal | | | ⭐ | |
| Medicine management | | | ⭐ | |
| Pharmacy owner dashboard | | | | ⭐ |
| Supplier portal | | | | ⭐ |
| **Agentic AI** | | | | |
| Specialist & Doctor Recommendation Agent | ⭐ | | | |
| Clinical Decision Support Agent | | ⭐ | | |
| Medication Intelligence Agent | | | ⭐ | |
| Pharmacy & Inventory Intelligence Agent | | | | ⭐ |
| **Cross-Cutting** | | | | |
| Testing | ⭐ | ⭐ | ⭐ | ⭐ |
| Documentation | ⭐ | ⭐ | ⭐ | ⭐ |
| GitHub / CI | ⭐ | ⭐ | ⭐ | ⭐ |
| Swagger (own endpoints) | ⭐ | ⭐ | ⭐ | ⭐ |

---

## 23. Safe Failure Scenarios

Each member must handle failures gracefully within their component:

| Scenario | Owner | Safe Response |
|---|---|---|
| Symptom analysis fails | Member 1 | *"Unable to analyze symptoms. Please search for a doctor manually."* |
| Doctor ranking data insufficient | Member 1 | Show doctors sorted by rating only with explanation |
| No doctors available in specialty | Member 1 | *"No doctors currently available in this specialty."* |
| Appointment conflict detected | Member 2 | *"This time slot is not available. Next available: {time}"* |
| Clinical analysis uncertain | Member 2 | Recommend General Medicine consultation |
| Clinical analysis fails | Member 2 | *"Unable to analyze symptoms. Please consult a healthcare professional directly."* |
| Prescription extraction fails | Member 3 | *"Unable to read prescription. Please consult the pharmacist directly."* |
| Medicine not found in database | Member 3 | *"Medicine not found"* with search suggestions |
| Order cancellation after confirmation | Member 3 | Apply cancellation rules with appropriate warning |
| Inventory data unavailable | Member 4 | `INVENTORY_CHECK_FAILED` — safe failure with message |
| Low-stock detection error | Member 4 | Log error, do NOT auto-generate restock requests |
| Demand prediction insufficient data | Member 4 | *"Insufficient historical data for demand prediction"* |
| Pharmacy search returns no results | Member 4 | *"No pharmacies found with required medicines nearby"* |

---

## 24. Repository Structure

One GitHub repository, one VS Code workspace:

```text
MediFlow-AI/
│
├── backend/
│   └── MediFlow.Api/
│       ├── Controllers/
│       │   ├── AuthController.cs                # Member 2
│       │   ├── DoctorController.cs              # Member 1
│       │   ├── SpecialistController.cs          # Member 1
│       │   ├── DoctorAvailabilityController.cs  # Member 1
│       │   ├── DoctorRatingController.cs        # Member 1
│       │   ├── PatientController.cs             # Member 2
│       │   ├── AppointmentController.cs         # Member 2
│       │   ├── SymptomController.cs             # Member 2
│       │   ├── MedicalHistoryController.cs      # Member 2
│       │   ├── PrescriptionController.cs        # Member 3
│       │   ├── MedicineController.cs            # Member 3
│       │   ├── OrderController.cs               # Member 3
│       │   ├── PharmacyController.cs            # Member 4
│       │   ├── InventoryController.cs           # Member 4
│       │   ├── SupplierController.cs            # Member 4
│       │   └── RestockController.cs             # Member 4
│       ├── Models/               # Entity models (all members)
│       ├── DTOs/                 # Request/Response DTOs
│       ├── Services/             # Business logic services
│       ├── Data/
│       │   ├── AppDbContext.cs
│       │   └── Migrations/
│       ├── Auth/                 # JWT, password hashing (Member 2)
│       ├── Middleware/           # Error handling, auth middleware
│       └── Program.cs
│
├── web/
│   └── mediflow-web/             # React app
│       ├── src/
│       │   ├── components/       # Shared components
│       │   ├── pages/
│       │   │   ├── doctor-management/  # Member 1
│       │   │   ├── doctor-dashboard/   # Member 2
│       │   │   ├── pharmacist/         # Member 3
│       │   │   ├── pharmacy-owner/     # Member 4
│       │   │   ├── supplier/           # Member 4
│       │   │   └── admin/              # Shared
│       │   ├── services/         # API service layer
│       │   ├── context/          # Auth & state context
│       │   └── routes/           # Protected routing
│       └── package.json
│
├── mobile/
│   └── mediflow_mobile/          # Flutter app
│       ├── lib/
│       │   ├── screens/
│       │   │   ├── doctor_discovery/    # Member 1
│       │   │   ├── auth/               # Member 2
│       │   │   ├── patient/            # Member 2
│       │   │   ├── appointments/       # Member 2
│       │   │   ├── prescriptions/      # Member 3
│       │   │   ├── orders/             # Member 3
│       │   │   └── pharmacy/           # Member 4
│       │   ├── services/         # API services
│       │   ├── models/           # Data models
│       │   ├── providers/        # State management
│       │   └── widgets/          # Reusable widgets
│       └── pubspec.yaml
│
├── ai/
│   └── mediflow_agents/          # Agentic AI subsystem
│       ├── agents/
│       │   ├── specialist_recommendation_agent.py  # Member 1
│       │   ├── clinical_decision_support_agent.py  # Member 2
│       │   ├── medication_intelligence_agent.py    # Member 3
│       │   └── inventory_intelligence_agent.py     # Member 4
│       ├── tools/
│       │   ├── specialist_tools.py                 # Member 1
│       │   ├── clinical_tools.py                   # Member 2
│       │   ├── medication_tools.py                 # Member 3
│       │   └── inventory_tools.py                  # Member 4
│       └── config/
│
├── tests/
│   ├── backend/
│   ├── web/
│   ├── mobile/
│   └── ai/
│
├── docs/
│   ├── architecture.md
│   ├── er-diagram.md
│   ├── agent-workflow.md
│   ├── adr/                       # Architecture Decision Records
│   └── api-documentation.md
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .gitignore
├── README.md
└── MediFlowAI_4_Member_Project_Division.md
```

---

## 25. Git Branching Strategy

### Branch Naming Convention

```text
main                              # Production-ready code
develop                           # Integration branch
feature/<member>-<feature-name>   # Feature branches
```

### Per-Member Branches

| Member | Feature Branches |
|---|---|
| Member 1 | `feature/doctor-management`, `feature/specialist-management`, `feature/doctor-availability`, `feature/doctor-ratings`, `feature/doctor-ranking-algorithm`, `feature/agent-specialist-recommendation`, `feature/react-doctor-screens`, `feature/flutter-doctor-discovery` |
| Member 2 | `feature/authentication`, `feature/patient-management`, `feature/medical-history`, `feature/appointment-booking`, `feature/appointment-scheduling`, `feature/agent-clinical-decision-support`, `feature/react-doctor-dashboard`, `feature/flutter-patient-app` |
| Member 3 | `feature/prescription-upload`, `feature/prescription-processing`, `feature/medicine-management`, `feature/order-management`, `feature/order-cancellation`, `feature/price-calculation`, `feature/agent-medication-intelligence`, `feature/react-pharmacist-portal`, `feature/flutter-order-screens` |
| Member 4 | `feature/pharmacy-management`, `feature/pharmacy-search`, `feature/inventory-management`, `feature/supplier-management`, `feature/restock-requests`, `feature/supply-workflow`, `feature/agent-pharmacy-inventory-intelligence`, `feature/react-pharmacy-owner-dashboard`, `feature/react-supplier-portal`, `feature/flutter-pharmacy-screens` |

### Workflow

1. Create feature branch from `develop`
2. Implement feature with meaningful commits
3. Open Pull Request to `develop`
4. Code review by at least one other member
5. Merge after approval
6. Merge `develop` → `main` for releases

---

## 26. Testing Strategy

### Unit Testing

Test:

- Business logic (ranking algorithms, scheduling, prescription processing, inventory calculations)
- Validation rules
- Cancellation rules
- Non-CRUD operations

### Integration Testing

Test:

- React/Flutter → ASP.NET Core
- ASP.NET Core → PostgreSQL
- Backend → AI agents
- Agent → controlled tools/APIs

### API Testing

Use tools such as Swagger/Postman to test:

- Authentication
- Authorization
- CRUD operations
- Business operations
- Invalid requests
- Unauthorized requests

### AI Testing

Evaluate:

- Recommendation accuracy (specialty classification, doctor ranking)
- Condition suggestion accuracy (clinical decision support)
- Medicine extraction accuracy (prescription processing)
- Inventory prediction performance (demand forecasting)
- Unsafe/invalid output handling
- Safe failure behavior

---

## 27. Documentation Requirements

### Software Engineering Documentation

- Problem statement
- Functional requirements
- Non-functional requirements
- Use-case diagram
- System architecture
- Component diagram
- Class diagram
- ER diagram
- Sequence diagrams
- API documentation
- Database design
- Security design
- Testing strategy

### AI Agent Documentation

For each agent document:

- Agent objective
- Input
- Output
- Tools/APIs
- Workflow
- Decision process
- Data used
- Validation
- Human approval
- Error handling
- Evaluation metrics
- Limitations

---

## 28. Demo Walkthrough — Member Responsibilities

The final demo follows a specific sequence. Each member leads their portion:

| Demo Step | Lead | What to Show |
|---|---|---|
| 1. Patient login/register | Member 2 | Flutter login + registration |
| 2. Enter symptoms | Member 2 | Flutter symptom entry screen |
| 3. Specialist Recommendation Agent | Member 1 | AI specialty recommendation with ranked doctors |
| 4. Doctor profile & ratings | Member 1 | Flutter doctor profile + React doctor management |
| 5. Book appointment | Member 2 | Flutter appointment booking |
| 6. Appointment scheduling logic | Member 2 | Show conflict detection + scheduling |
| 7. Clinical Decision Support Agent | Member 2 | AI condition suggestions with confidence |
| 8. Upload prescription | Member 3 | Flutter prescription upload |
| 9. Medication Intelligence Agent | Member 3 | AI medicine extraction + warnings |
| 10. Pharmacist verification | Member 3 | React pharmacist portal |
| 11. Search nearby pharmacies | Member 4 | Flutter pharmacy search |
| 12. Pharmacy Intelligence Agent | Member 4 | AI pharmacy recommendation |
| 13. Place order | Member 3 | Flutter order placement |
| 14. Order processing | Member 3 | React order management + price calculation |
| 15. Order tracking | Member 3 | Flutter order tracking |
| 16. Order cancellation demo | Member 3 | Cancellation rules in action |
| 17. Low-stock detection | Member 4 | React inventory dashboard + AI alerts |
| 18. Restock recommendation | Member 4 | AI restocking recommendations |
| 19. Supplier approval | Member 4 | React supplier portal |
| 20. Inventory updated | Member 4 | Show inventory updated after supply |
| 21. Patient feedback | Member 1 | Doctor rating + pharmacy rating |
| 22. PostgreSQL state | All | Show database state at key points |
| 23. Swagger docs | All | Each member shows their endpoints |
| 24. Tests | All | Each member runs their tests |
| 25. GitHub Actions CI | All | Show passing CI pipeline |
| 26. Git history | All | Show branches, PRs, contributions |

---

## 29. Quick Reference — Who Owns What

### Member 1 — "Doctor & Specialist Intelligence"

> *Patients discover the right specialist and doctor through AI-powered recommendations.*

- Doctor registration & profiles
- Specialist management
- Doctor search & availability
- Doctor rating system
- Doctor ranking algorithm (weighted scoring)
- React doctor management portal
- Flutter doctor discovery screens
- **Specialist & Doctor Recommendation Agent**

### Member 2 — "Patient & Clinical Intelligence"

> *Patients manage their health journey with AI-assisted clinical decision support.*

- Patient registration & authentication
- Patient profiles & medical history
- Symptom submission
- Appointment booking & scheduling
- Appointment conflict detection
- React doctor dashboard (appointment view)
- Flutter patient app (auth, symptoms, appointments)
- **Clinical Decision Support & Diagnosis Suggestion Agent**

### Member 3 — "Prescription & Medication Intelligence"

> *Prescriptions are intelligently processed and medicines are ordered seamlessly.*

- Prescription upload & management
- Medicine database & search
- Order management (create, cancel, track)
- Prescription-to-medicine processing
- Medicine price calculation
- React pharmacist portal
- Flutter prescription & order screens
- **Medication Intelligence Agent**

### Member 4 — "Pharmacy & Inventory Intelligence"

> *Pharmacies are intelligently managed with demand prediction and automated restocking.*

- Pharmacy registration & search
- Nearby pharmacy discovery
- Inventory management & monitoring
- Supplier management
- Restocking workflow
- React pharmacy owner dashboard + supplier portal
- Flutter pharmacy search & selection screens
- **Pharmacy & Inventory Intelligence Agent**

### Together — One Workflow

```text
Patient (M2) → Symptoms (M2) → Specialist Recommendation (M1)
    → Doctor Selection (M1) → Appointment (M2) → Scheduling Logic (M2)
    → Clinical Decision Support (M2)
    → Prescription Upload (M3) → Medicine Extraction (M3)
    → Pharmacy Search (M4) → Pharmacy Selection (M4)
    → Order Placement (M3) → Pharmacist Verification (M3)
    → Order Processing (M3) → Price Calculation (M3)
    → Inventory Monitoring (M4) → Restock Recommendation (M4)
    → Supplier Approval (M4) → Inventory Updated (M4)
    → Patient Feedback (M1 + M4)
```

This forms **one complete MediFlow AI healthcare workflow**, not four disconnected projects.

---

## 30. Critical Group Working Rules

### ✅ DO

- Each member owns a **full vertical slice** (DB → API → React → Flutter → AI → Tests → Docs)
- All members work in the **same GitHub repository**
- Every member contributes to **all layers** (ASP.NET, PostgreSQL, React, Flutter)
- Use **feature branches** and **pull requests** with code review
- Every member must have **visible, meaningful Git contributions**
- Share the `AppDbContext` — register your entities in one shared context
- Implement at least **4 meaningful APIs** per member
- Implement at least **1 non-CRUD business operation** per member
- Communicate when your component's API contract changes
- Write tests for your own components
- Document your own Swagger endpoints
- Ensure human-in-the-loop at every critical decision point

### ❌ DON'T

- Don't divide as: *Member 1 = Backend, Member 2 = React, Member 3 = Flutter, Member 4 = AI*
- Don't commit secrets, API keys, connection strings, or JWT secrets
- Don't create fake/back-filled Git contribution history
- Don't add unnecessary features before the core workflow is stable
- Don't let agents make unsupported medical decisions
- Don't let AI independently prescribe or substitute medicines
- Don't expose stack traces or internal errors to users
- Don't present AI suggestions as confirmed medical diagnoses

---

## 31. Overall Goal

The final system should demonstrate that the group can integrate **Software Engineering and Artificial Intelligence into one practical multi-agent healthcare platform**.

The project should not be simply:

> "A website with four chatbots."

Instead, it should be a complete software system where:

**Flutter/React → ASP.NET Core APIs → PostgreSQL → Controlled AI Agents → Business Rules → Human Approval → Persisted Results → Audit Logs**

The AI agents should interact with real system data and controlled APIs, while the Software Engineering layer ensures security, reliability, maintainability, testing, and proper user workflows.

The final system should demonstrate four meaningful AI capabilities:

1. **"Who should I see?"**
   → Specialist & Doctor Recommendation Agent

2. **"What could this condition indicate?"**
   → Clinical Decision Support Agent

3. **"What does this prescription/medicine information mean?"**
   → Medication Intelligence Agent

4. **"Where can I get the medicine and should the pharmacy restock it?"**
   → Pharmacy & Inventory Intelligence Agent

This architecture ensures that all four members have substantial contributions to both **SE implementation and AI-agent development**, while maintaining clear ownership of separate modules.
