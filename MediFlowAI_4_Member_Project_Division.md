# MediFlow AI — 4-Member Project Division
## Intelligent Channeling, E-Prescription & Pharmacy Management System
### SE3090 Group Project — Complete Technical Reference

---

## Project Overview

**MediFlow AI — Intelligent Channeling, E-Prescription & Pharmacy Management System**

An integrated AI-powered healthcare channeling and pharmacy management system built as a four-member  group project. The system provides a complete end-to-end healthcare ecosystem where a patient enters symptoms → AI recommends a suitable medical specialty and ranks doctors → patient books an appointment and pays → receptionist verifies payment and confirms the appointment → doctor conducts the consultation with AI clinical decision support → doctor selects medicines and AI checks pharmacy availability → the doctor generates an official e-prescription → patient and pharmacist receive the e-prescription → pharmacist processes the medicine order with automatic price calculation → pharmacy inventory is monitored → AI predicts demand and recommends restocking → supplier receives and approves the restock request.

Human professionals approve every critical decision. AI assists users and professionals — it does **not** autonomously make high-impact medical decisions.

> **Key Design Principle:** AI agents assist healthcare professionals and patients — they do **not** independently make final medical decisions. Human professionals maintain control over all critical medical and operational decisions (Human-in-the-Loop AI).

### Technology Stack

| Layer | Technology |
|---|---|
| Mobile | Flutter / Dart |
| Web | React / React Router |
| Backend API | ASP.NET Core Web API / C# |
| Database | PostgreSQL / Entity Framework Core |
| Auth | JWT Authentication & Role-Based Authorization |
| Agentic AI | Python AI Subsystem (LangGraph / FastAPI / Google ADK) |
| Docs | Swagger / OpenAPI |
| CI/CD | GitHub Actions |
| Third-Party | Maps / Location API (Google Maps or equivalent) |

> **Architecture Rule:** React and Flutter must communicate **only** through the ASP.NET Core Web API and must use the same PostgreSQL database, identity, permissions, and business rules. If a Python service is used for AI, it must be an **internal service called by ASP.NET Core**, not directly by React or Flutter.

### Project Requirements Overview

| Requirement | Minimum |
|---|---|
| Primary business components | **4** (one per member) |
| Meaningful API endpoints per member | At least **4** |
| Non-CRUD business operations per member | At least **1** |
| All-layer contribution | Every member: ASP.NET Core, PostgreSQL, React, Flutter, Testing, Git, Docs, AI |
| Complete cross-platform workflow | At least **1** (React/Flutter → ASP.NET Core → PostgreSQL → AI → Human Approval → Result) |
| Human approval pause points | At least **1** (multiple recommended) |
| Third-party API integration | At least **1** meaningful service |
| Genuine mobile device feature | At least **1** per member (GPS, notifications, date/time, etc.) |

### Core Principle

> The project should not be presented as: *"Member 1 does React, Member 2 does backend, Member 3 does AI…"*
>
> Instead: **Each member owns one major business component** and is responsible for its ASP.NET Core API, PostgreSQL model, React workflow, Flutter workflow, testing, documentation, Git evidence, and one distinct Agentic AI contribution. That structure directly follows the SE3090 requirement.

---

## 1. User Roles

| Role | Portal / Platform | Key Responsibilities |
|---|---|---|
| `PATIENT` | Flutter Mobile + React | Symptom entry, view AI doctor recommendations, book appointments, make payments, view e-prescriptions, track medicine orders, rate pharmacies and doctors |
| `DOCTOR` | React Web | View verified appointments only, conduct consultations, receive AI clinical decision support, finalize diagnoses, check medicine availability, generate e-prescriptions |
| `RECEPTIONIST` | React Web | View pending appointments, verify patient payments, confirm bookings, generate unique appointment numbers, reschedule/cancel where permitted |
| `PHARMACIST` | React Web | Receive doctor e-prescriptions, view auto-calculated prices, process medicine orders, update dispensing status, initiate restock requests |
| `PHARMACY_OWNER` | React Web | Overview pharmacy performance, monitor inventory, review AI demand forecasts, approve restock orders, view sales and revenue |
| `SUPPLIER` | React Web | Receive restock requests from pharmacies, approve/reject orders, update delivery/supply status |
| `ADMINISTRATOR` | React Web | System-wide user role management, system health monitoring, audit logging, agent monitoring |

Each role must have appropriate authentication, authorization, protected APIs, dashboards, and permissions.

---

## 2. Four Primary Business Components

| Member | Primary Business Component | Agentic AI |
|---|---|---|
| **Member 1** | Patient & Appointment Management | 🩺 **Specialist & Doctor Recommendation Agent** |
| **Member 2** | Doctor Consultation & Clinical Management | 🧠 **Clinical Decision Support & Diagnosis Suggestion Agent** |
| **Member 3** | E-Prescription & Medicine Ordering | 💊 **Medication Intelligence Agent** |
| **Member 4** | Pharmacy Inventory & Supplier Management | 📦 **Pharmacy & Inventory Intelligence Agent** |

> **Important:** This table represents **primary ownership**, not isolated development. Every member must demonstrate technical contribution across the full stack.

---

## 3. Complete End-to-End Workflow

```text
                         PATIENT
                            │
                            ▼
                    Enter Symptoms
                            │
                            ▼
          🩺 SPECIALIST & DOCTOR AGENT (Member 1)
                            │
                   Specialty + Doctor Ranking
                            │
                            ▼
                     Select Doctor
                            │
                            ▼
                   Book Appointment
                            │
                            ▼
                       PAYMENT
                            │
                            ▼
                RECEPTIONIST (Verification)
                            │
                   Verify Payment
                            │
                            ▼
              Generate Appointment Number
              (e.g. APP-2026-1024)
                            │
                            ▼
                    DOCTOR PORTAL
                (Only verified appointments)
                            │
                            ▼
          🧠 CLINICAL DECISION SUPPORT (Member 2)
                            │
                   AI Diagnosis Suggestions
                            │
                            ▼
                  Doctor: ACCEPT / MODIFY / REJECT
                            │
                            ▼
              Doctor Selects Required Medicine
                            │
                            ▼
            💊 MEDICATION AGENT (Member 3)
                            │
               Check Pharmacy Stock Availability
                            │
                            ▼
                 Doctor Confirms Medicine
                            │
                            ▼
                    E-PRESCRIPTION
                   /               \
                  /                 \
                 ▼                   ▼
            PATIENT             PHARMACIST
                               PORTAL (Member 3)
                                     │
                              Auto-Calculate Price
                                     │
                                  PAYMENT
                                     │
                             Process Medicine Order
                                     │
                                     ▼
           📦 INVENTORY INTELLIGENCE (Member 4)
                                     │
                          Demand Prediction
                                     │
                            Stock-Out Prediction
                                     │
                         Restock Recommendation
                                     │
                                     ▼
                        ── HUMAN APPROVAL ──
                       Pharmacist / Owner Review
                                     │
                                     ▼
                              SUPPLIER PORTAL
                            (Approve / Reject)
                                     │
                                     ▼
                           Inventory Updated
```

---

## 4. Member 1 — Patient & Appointment Management

### Business Focus

Everything related to **patient management, symptom submission, doctor discovery, appointment booking, payment, and doctor ratings**. Member 1 also owns the **Specialist & Doctor Recommendation Agent** that analyzes patient symptoms and recommends a suitable specialty and ranked doctors.

### A. Software Engineering (SE) Responsibility

#### ASP.NET Core — API Endpoints (Minimum 4)

```text
# Patient Profile
GET    /api/patients/{id}                  # Get patient profile
PUT    /api/patients/{id}                  # Update patient profile

# Symptoms
POST   /api/patients/symptoms              # Submit symptoms

# Doctor Discovery
GET    /api/doctors                        # List/search doctors
GET    /api/doctors/{id}                   # Get doctor profile
GET    /api/doctors/{id}/availability      # Get doctor availability slots

# Appointments
POST   /api/appointments                   # Book appointment
GET    /api/appointments/my                # Get patient's appointments
GET    /api/appointments/{id}              # Get appointment details
PATCH  /api/appointments/{id}/status       # Update appointment status

# Ratings
POST   /api/doctors/{id}/ratings           # Submit doctor rating (Patient)
GET    /api/doctors/{id}/ratings           # Get doctor ratings
```

Include: request validation, role-based authorization, DTOs, proper HTTP status codes, and asynchronous operations throughout.

#### PostgreSQL — Database Entities

| Entity | Purpose |
|---|---|
| `Patient` | Patient profiles (demographics, contact, medical info) |
| `Doctor` | Doctor profiles (qualifications, bio, consultation fee) |
| `Specialty` | Medical specialty records |
| `DoctorSpecialty` | Doctor-specialty associations (many-to-many) |
| `DoctorAvailability` | Doctor schedule and availability slots |
| `DoctorRating` | Patient ratings and reviews for doctors |
| `Appointment` | Appointment booking records |
| `AppointmentPayment` | Payment records for appointments |

Requirements: primary keys, foreign keys, constraints, indexes, EF Core migrations, seed data, `CreatedAt`/`UpdatedAt` timestamps.

#### React Screens — Patient & Admin Workflows

```text
Patient Portal (React)
    ├── Patient Dashboard
    │       ├── Upcoming Appointments
    │       ├── Recent Prescriptions
    │       └── Quick Actions
    ├── Symptom Input
    │       ├── Symptom Entry Form
    │       ├── Severity & Duration
    │       └── Submit to AI Agent
    ├── Doctor Discovery
    │       ├── Doctor Listing (search + filter)
    │       ├── Doctor Profile View
    │       ├── Doctor Rating Display
    │       └── Doctor Availability Viewer
    ├── Appointment Management
    │       ├── Appointment Booking
    │       ├── Appointment History
    │       ├── Payment Status
    │       └── Appointment Status
    └── AI Recommendation Results
            ├── Recommended Specialty
            ├── Ranked Doctor List
            └── Recommendation Explanation
```

#### Flutter Screens — Patient Mobile App

```text
Patient Mobile App
    ├── Patient Login / Register
    ├── Symptom Entry Screen
    │       ├── Free-text symptom input
    │       ├── Severity slider
    │       └── Submit
    ├── AI Doctor Recommendations
    │       ├── Recommended Specialty Card
    │       ├── Ranked Doctor List
    │       └── Recommendation Explanation
    ├── Doctor Details Screen
    │       ├── Profile, qualifications, experience
    │       ├── Ratings display
    │       └── Available Slots
    ├── Appointment Booking
    │       ├── Date/time selector (device feature)
    │       ├── Booking Confirmation
    │       └── Payment
    ├── Appointment Status & History
    └── GPS / Map — Nearby Doctors (device feature)
```

> **Device Feature Requirement:** Member 1 must include at least one meaningful mobile device feature such as GPS/map for doctor location, date/time pickers for appointment selection, or push notifications for appointment confirmation.

#### Testing

- Backend unit tests for patient/appointment services
- API tests for all Member 1 endpoints
- Validation tests (invalid input, unauthorized access)
- React component/form tests
- Flutter widget tests
- Agent evaluation tests for specialty recommendation
- Integration tests (symptom submission → AI recommendation → appointment booking)

#### Non-CRUD Business Operation — Doctor Filtering & Ranking

Beyond basic CRUD, Member 1 must implement a **Doctor Recommendation Scoring** system:

```text
Doctor Score = (Specialty Match × 30%) + (Patient Rating × 25%)
             + (Experience × 15%) + (Review Count × 10%)
             + (Availability × 10%) + (Location/Fee × 10%)
```

Endpoint: `GET /api/doctors/ranked?specialty={id}` — returns doctors ranked by the weighted algorithm.

### B. AI Agent — 🩺 Specialist & Doctor Recommendation Agent

**Purpose:** Receive the patient's symptoms and recommend the most appropriate medical specialty and a ranked list of suitable doctors. This agent does **not** diagnose — it recommends a specialty for consultation.

**Workflow:**

```text
Patient Symptoms (Natural Language)
       ↓
Symptom Analysis
       ↓
Specialty Recommendation
       ↓
Retrieve Matching Doctors in Specialty
       ↓
Calculate Weighted Recommendation Score
       ↓
Rank Doctors
       ↓
Generate Explanation
       ↓
Patient Selects Doctor
```

**Example Output:**

```text
Symptoms:
  "Stomach pain, bloating, acid reflux"

Recommended Specialty:
  🥇 Gastroenterology — 91% confidence
  🥈 General Medicine — 64% confidence

Recommended Doctors:

1. Dr. Perera — 4.9 ⭐ — 12 years experience — Available
2. Dr. Silva — 4.7 ⭐ — 9 years experience — Available
3. Dr. Fernando — 4.6 ⭐ — 15 years experience — Limited

Why Gastroenterology?
  Your symptoms (stomach pain, bloating, acid reflux) are
  commonly evaluated by gastroenterologists.

⚠️ This is a specialty and doctor recommendation, not a diagnosis.
```

**Ranking Factors:**

| Factor | Weight |
|---|---|
| Specialty Match | 30% |
| Patient Rating | 25% |
| Experience (Years) | 15% |
| Review Count | 10% |
| Current Availability | 10% |
| Location / Fee | 10% |

**Agent Tools (Allow-Listed):**

| Tool | Purpose |
|---|---|
| `searchSpecialties()` | Search medical specialties by symptom keywords |
| `searchDoctors()` | Find doctors by specialty |
| `getDoctorRating()` | Retrieve doctor ratings and review data |
| `getDoctorAvailability()` | Check doctor availability |
| `calculateDoctorScore()` | Calculate weighted recommendation score |

**Safety Rules:**

- Must state this is a specialty/doctor recommendation, not a diagnosis
- Must NOT replace professional medical judgment
- If analysis uncertain → recommend General Medicine
- If analysis fails → *"Unable to analyze symptoms. Please search for a doctor manually."*

**Evaluation Metrics:**

| Metric | Method |
|---|---|
| Specialty Recommendation Accuracy | Rule-based golden test cases |
| Ranking Quality | Precision@K (not LLM-as-judge) |
| Confidence Calibration | Expected vs. actual specialty match |
| Safe Failure Rate | Schema validation + deterministic tests |

### Feature Branches

```text
feature/m1-patient-management
feature/m1-doctor-search
feature/m1-doctor-availability
feature/m1-doctor-ratings
feature/m1-doctor-ranking
feature/m1-appointment-booking
feature/m1-appointment-payment
feature/m1-agent-specialist-recommendation
feature/m1-react-patient-portal
feature/m1-flutter-patient-app
```

### Deliverables

- [ ] Patient, Doctor, Specialty, DoctorSpecialty, DoctorAvailability, DoctorRating, Appointment, AppointmentPayment tables + EF Core migrations
- [ ] Patient & Appointment REST APIs (minimum 4 meaningful endpoints)
- [ ] Doctor Ranking Algorithm (non-CRUD business operation)
- [ ] React patient portal (all screens listed above)
- [ ] Flutter patient mobile app (all screens listed above, with device feature)
- [ ] Specialist & Doctor Recommendation Agent with agent tools
- [ ] Seed data (sample patients, doctors, specialties, ratings, appointments)
- [ ] Unit + API + integration + component tests + agent evaluation tests
- [ ] Swagger API documentation
- [ ] Individual AI usage log

---

## 5. Receptionist Workflow

The receptionist is a critical part of the appointment management workflow. Receptionist functionality is integrated into the overall appointment system — it is not a standalone component isolated to one member.

### Receptionist Responsibilities

- View all pending appointment requests
- View patient payment status
- Verify successful payments
- Confirm appointments
- Generate a unique appointment number (format: `APP-{YEAR}-{SEQ}`, e.g. `APP-2026-1024`)
- Reschedule appointments where permitted by business rules
- Cancel appointments where permitted
- View appointment history and statistics

### Receptionist Workflow

```text
Patient
   ↓
Book Appointment + Payment Submitted
   ↓
RECEPTIONIST PORTAL
   ↓
View Appointment Request
   ↓
Check Payment Status
   ↓
Verify Payment
   ↓
Confirm Appointment
   ↓
Generate Appointment Number (APP-2026-1024)
   ↓
DOCTOR PORTAL
(Only confirmed + numbered appointments appear)
```

> **Critical Rule:** Only appointments that have been verified by the receptionist and assigned an appointment number should appear in the doctor's portal.

### Receptionist API Endpoints

```text
GET    /api/receptionist/appointments              # View pending appointments
GET    /api/receptionist/appointments/{id}         # Appointment detail with payment status
POST   /api/receptionist/appointments/{id}/verify  # Verify payment + confirm
POST   /api/receptionist/appointments/{id}/generate-number  # Generate appointment number
PUT    /api/receptionist/appointments/{id}/reschedule       # Reschedule
PUT    /api/receptionist/appointments/{id}/cancel           # Cancel
GET    /api/receptionist/appointments/history      # Appointment history
```

### Receptionist React Screens

```text
Receptionist Portal
    ├── Dashboard
    │       ├── Pending Verification Count
    │       ├── Today's Confirmed Appointments
    │       └── Quick Actions
    ├── Appointment Queue
    │       ├── Pending List (payment status visible)
    │       ├── Appointment Detail View
    │       ├── [ VERIFY PAYMENT ]
    │       ├── [ CONFIRM APPOINTMENT ]
    │       └── [ GENERATE APPOINTMENT NUMBER ]
    ├── Appointment History
    │       ├── All verified appointments
    │       ├── Filter by date, doctor, status
    │       └── Appointment number search
    └── Reschedule / Cancel
            ├── Reschedule form
            └── Cancellation reason
```

---

## 6. Member 2 — Doctor Consultation & Clinical Management

### Business Focus

Everything related to **doctor consultation, clinical information management, and prescription initiation** — doctor profile management, doctor schedules, verified appointment handling, patient consultation workspace, clinical examination data, lab results, diagnosis decision recording, and e-prescription initiation. Member 2 also owns the **Clinical Decision Support & Diagnosis Suggestion Agent**.

### A. Software Engineering (SE) Responsibility

#### ASP.NET Core — API Endpoints (Minimum 4)

```text
# Doctor Appointments (verified only)
GET    /api/doctors/appointments               # Doctor's verified appointment queue
GET    /api/appointments/{id}/clinical-record  # Get patient clinical record

# Consultation Management
POST   /api/consultations                      # Start/create consultation
PUT    /api/consultations/{id}                 # Update consultation notes
GET    /api/consultations/{id}                 # Get consultation details
GET    /api/consultations/history              # Consultation history

# Clinical Analysis
POST   /api/clinical-analysis                  # Submit for AI clinical decision support

# Doctor Decisions
POST   /api/diagnosis/{id}/decision            # Record doctor's diagnosis decision (ACCEPT/MODIFY/REJECT)
GET    /api/appointments/{id}/patient-history  # Full patient history for consultation
```

Include: authorization ensuring doctors only see their own verified appointments, validation, DTOs, async operations.

#### PostgreSQL — Database Entities

| Entity | Purpose |
|---|---|
| `ClinicalRecord` | Patient clinical record per appointment |
| `Consultation` | Doctor consultation records |
| `PatientHistory` | Patient past conditions and history |
| `Allergy` | Patient allergy records |
| `Examination` | Clinical examination findings |
| `LabResult` | Laboratory test results |
| `DiagnosisSuggestion` | AI-generated diagnosis suggestions (stored per consultation) |
| `DoctorDecision` | Doctor's ACCEPT/MODIFY/REJECT decision on AI suggestions |

Requirements: PKs, FKs, constraints, indexes, EF Core migrations, seed data, timestamps.

#### React Screens — Doctor Portal

```text
Doctor Portal
    ├── Doctor Dashboard
    │       ├── Today's Verified Appointments
    │       ├── Upcoming Appointments
    │       └── Quick Stats
    ├── Verified Appointment Queue
    │       ├── Patient list for today
    │       ├── Appointment Number display (APP-2026-1024)
    │       └── Filter by date/status
    ├── Patient Consultation Screen
    │       ├── Patient Information
    │       ├── Medical History
    │       ├── Allergy Records
    │       ├── Symptom Details (from patient submission)
    │       ├── Clinical Examination Input Form
    │       ├── Lab Result Input
    │       └── Consultation Notes
    ├── AI Decision Support Panel
    │       ├── AI Suggestion Display (conditions + confidence)
    │       ├── Supporting Evidence List
    │       ├── Suggested Tests
    │       ├── [ ACCEPT ] / [ MODIFY ] / [ REJECT ] controls
    │       └── Doctor's Decision Record
    └── Consultation History
            ├── Past consultations
            └── Patient outcomes
```

#### Flutter Screens — Doctor/Operational Workflows

```text
Doctor Mobile App
    ├── Doctor Login
    ├── Appointment Status View
    ├── Patient Consultation Summary
    │       ├── Patient info overview
    │       └── Consultation status
    ├── AI Result Review
    │       ├── Diagnosis suggestions summary
    │       └── Decision recorded status
    └── Consultation Status Updates
```

> **Device Feature Requirement:** Include at least one meaningful mobile device feature such as push notifications for new verified appointments.

#### Testing

- Clinical API tests (consultation, clinical analysis endpoints)
- Authorization tests (doctor only sees their own verified appointments)
- React component tests (consultation form, AI display, decision controls)
- Flutter tests (appointment status, consultation summary)
- AI golden-case tests (known symptom sets → expected suggestions)
- Validation tests (invalid clinical data)
- Integration tests (verified appointment → consultation → AI suggestion → decision)

#### Non-CRUD Business Operation — Clinical Analysis Routing

Beyond CRUD, Member 2 must implement a **Clinical Analysis Service** that:

1. Accepts structured clinical input (symptoms, history, allergies, examination, lab results)
2. Sends to the Clinical Decision Support Agent
3. Validates the agent output (schema validation, safety checks)
4. Persists suggestions to `DiagnosisSuggestion` table
5. Records doctor's decision to `DoctorDecision` table
6. Returns structured decision-support results to the React UI

### B. AI Agent — 🧠 Clinical Decision Support & Diagnosis Suggestion Agent

**Purpose:** Assist the doctor by analyzing the patient's complete clinical information and generating ranked possible diagnoses with confidence scores, supporting evidence, and suggested diagnostic tests. The doctor retains full clinical authority.

**Input:** Symptoms, medical history, allergies, clinical examination findings, lab results

**Workflow:**

```text
Clinical Information (Symptoms + History + Allergies + Examination + Labs)
       ↓
Clinical Decision Support Agent
       ↓
Analyze Symptoms & Clinical Patterns
       ↓
Retrieve Relevant Clinical Knowledge / Similar Cases
       ↓
Generate Possible Diagnoses
       ↓
Rank by Confidence
       ↓
Generate Supporting Evidence
       ↓
Suggest Relevant Diagnostic Tests
       ↓
Doctor Review: ACCEPT / MODIFY / REJECT
```

**Example Output:**

```text
Clinical Decision Support

Patient: PAT-1024 | Consultation: CONS-0451

Possible Diagnoses:

1. Acute Gastritis — 92% Confidence
   Supporting factors:
   • Epigastric pain (reported)
   • Nausea (examination finding)
   • Postprandial discomfort (history)

2. Peptic Ulcer Disease — 68% Confidence
   Supporting factors:
   • Burning stomach pain
   • Acid reflux (history)

3. GERD — 45% Confidence

Suggested Diagnostic Tests:
  • Upper Endoscopy
  • H. Pylori Stool Antigen Test
  • Complete Blood Count

Doctor Decision:
  [ ACCEPT ]  [ MODIFY ]  [ REJECT ]

⚠️ This is clinical decision support.
   The consulting doctor makes the final diagnosis.
```

**Agent Tools (Allow-Listed):**

| Tool | Purpose |
|---|---|
| `getPatientClinicalData()` | Retrieve structured patient clinical data |
| `searchClinicalKnowledge()` | Search clinical knowledge base |
| `retrieveSimilarCases()` | Retrieve similar historical cases |
| `validateDiagnosisOutput()` | Validate AI output schema and safety rules |

**Safety Rules:**

- AI output must always be labeled as decision support, not a final diagnosis
- Must NOT autonomously finalize any diagnosis
- Doctor's ACCEPT/MODIFY/REJECT decision must be explicitly recorded
- If analysis fails → *"Unable to generate suggestions. Please proceed with standard clinical assessment."*

**Evaluation Metrics:**

| Metric | Method |
|---|---|
| Top-K Diagnostic Accuracy | Golden cases with known expected diagnoses |
| Confidence Calibration | Expected confidence vs. clinically validated outcomes |
| Doctor Acceptance Rate | % of suggestions accepted without modification |
| Supporting Evidence Relevance | Rule-based relevance checks |
| Safe Failure Rate | Deterministic validation tests |

> **Note:** LLM-as-a-judge cannot be the only evaluation method. Use rule-based assertions, golden cases, schema validation, and deterministic validators.

### Feature Branches

```text
feature/m2-doctor-profile
feature/m2-doctor-schedule
feature/m2-consultation-management
feature/m2-clinical-records
feature/m2-examination-input
feature/m2-lab-results
feature/m2-diagnosis-decision
feature/m2-agent-clinical-decision-support
feature/m2-react-doctor-portal
feature/m2-flutter-doctor-app
```

### Deliverables

- [ ] ClinicalRecord, Consultation, PatientHistory, Allergy, Examination, LabResult, DiagnosisSuggestion, DoctorDecision tables + EF Core migrations
- [ ] Doctor Consultation REST APIs (minimum 4 meaningful endpoints)
- [ ] Clinical Analysis Routing Service (non-CRUD business operation)
- [ ] React doctor portal with full consultation workspace
- [ ] Flutter doctor/operational mobile screens
- [ ] Clinical Decision Support Agent with agent tools
- [ ] Seed data (sample consultations, clinical records, suggestions)
- [ ] Clinical API + authorization + golden-case + integration tests
- [ ] Swagger API documentation
- [ ] Individual AI usage log

---

## 7. Member 3 — E-Prescription & Medicine Ordering

### Business Focus

Everything related to **medicine management, e-prescription generation and distribution, medicine order processing, price calculation, and order status management**. Member 3 also owns the **Medication Intelligence Agent** that assists the doctor in checking medicine availability before prescribing.

### A. Software Engineering (SE) Responsibility

#### ASP.NET Core — API Endpoints (Minimum 4)

```text
# Medicine Management
GET    /api/medicines                             # List/search medicines
GET    /api/medicines/{id}                        # Get medicine details

# Medicine Availability
GET    /api/pharmacies/{id}/medicine-availability # Check medicine availability at pharmacy

# E-Prescriptions
POST   /api/prescriptions                         # Generate e-prescription (Doctor)
GET    /api/prescriptions/{id}                    # Get prescription details
GET    /api/prescriptions/my                      # Patient's prescriptions

# Orders
POST   /api/orders                                # Create medicine order
GET    /api/orders/{id}                           # Get order details
POST   /api/orders/{id}/payment                   # Process order payment
PUT    /api/orders/{id}/status                    # Update order status (Pharmacist)
GET    /api/orders/my                             # Patient's order history
```

#### PostgreSQL — Database Entities

| Entity | Purpose |
|---|---|
| `Medicine` | Master medicine records (name, generic, strength, form, unit price) |
| `MedicineCategory` | Medicine category classifications |
| `PharmacyMedicine` | Medicine stock at each pharmacy (availability link) |
| `Prescription` | E-prescription records generated by doctors |
| `PrescriptionItem` | Individual medicines in a prescription |
| `MedicineOrder` | Medicine orders placed by patients |
| `OrderItem` | Individual medicine items in an order |
| `OrderPayment` | Payment records for medicine orders |

#### React Screens — Pharmacist Portal

```text
Pharmacist Portal
    ├── Dashboard
    │       ├── Pending Prescriptions Count
    │       ├── Orders In Progress
    │       └── Completed Orders Today
    ├── Received Prescriptions
    │       ├── Prescription List (searchable by APP-2026-1024 or patient)
    │       └── Prescription Detail View
    │               ├── Appointment Number
    │               ├── Patient Name
    │               ├── Doctor Name
    │               ├── Medicine List + Quantities
    │               └── AI Availability Check Results
    ├── Medicine Order Processing
    │       ├── Order List (filter by status)
    │       ├── Order Detail
    │       │       ├── Auto-Calculated Price Breakdown
    │       │       ├── Patient Information
    │       │       └── Status Controls
    │       ├── [ CONFIRM ORDER ]
    │       ├── [ MARK AS PREPARING ]
    │       ├── [ MARK AS READY ]
    │       └── [ MARK AS DISPENSED ]
    └── Medicine Management
            ├── Medicine Catalog
            ├── Add Medicine
            ├── Edit Medicine
            ├── Medicine Categories
            └── Price Management
```

#### Flutter Screens — Patient Order Tracking

```text
Patient App — Prescriptions & Orders
    ├── E-Prescription Viewer
    │       ├── Prescription List
    │       ├── Prescription Details
    │       │       ├── Appointment Number
    │       │       ├── Doctor Name
    │       │       ├── Medicine List + Dosage
    │       │       └── Status
    │       └── Download / Share
    ├── Medicine Order Viewer
    │       ├── Order List
    │       ├── Order Details
    │       │       ├── Medicine + Quantity
    │       │       ├── Price Breakdown
    │       │       └── Payment Status
    │       └── Order History
    ├── Order Tracking
    │       ├── Status Timeline (PENDING → CONFIRMED → PREPARING → READY → DISPENSED)
    │       └── Order Progress
    └── Notifications (Push)
            ├── Order Confirmed
            ├── Order Ready for Collection
            └── Payment Confirmation
```

> **Device Feature Requirement:** Push notifications for order status updates (Order Ready, Payment Confirmed).

#### Testing

- Prescription API tests
- Order API tests
- Price calculation unit tests (edge cases: zero quantity, decimal prices)
- React component tests (pharmacist portal, price display)
- Flutter tests (prescription viewer, order tracking)
- Agent tests (availability check accuracy)
- Integration tests (doctor generates prescription → patient views → pharmacist processes → order completed)

#### Non-CRUD Business Operation — Prescription-to-Order Processing & Price Calculation

Beyond CRUD, Member 3 must implement:

**Automatic Price Calculation:**

```text
POST /api/orders/{id}/calculate-price

Input: Prescription items + pharmacy ID

Process:
  For each PrescriptionItem:
    1. Look up unit price from Medicine table
    2. Multiply by quantity
    3. Apply any applicable discounts
    4. Calculate subtotal

Output:
  Amoxicillin 500mg × 20 → Rs. 25 × 20  = Rs.  500
  Paracetamol 500mg × 10 → Rs. 10 × 10  = Rs.  100
  Omeprazole 20mg  × 14 → Rs. 15 × 14  = Rs.  210
  ──────────────────────────────────────────────────
  TOTAL                                  = Rs.  810
```

**Order Status State Machine:**

```text
PENDING → CONFIRMED → PREPARING → READY → DISPENSED
    └─────────────────────────────────────────► CANCELLED
```

### B. AI Agent — 💊 Medication Intelligence Agent

**Purpose:** When the doctor is writing a prescription, check whether each prescribed medicine is available at the pharmacy in the required quantity. If not available, identify potential therapeutic alternatives. The doctor makes the final prescribing decision.

**Workflow:**

```text
Doctor Selects Medicine + Quantity
       ↓
💊 Medication Intelligence Agent
       ↓
Query Pharmacy Inventory
       ↓
Check Required Quantity
       ↓
       ┌────────────────┴────────────────┐
       ▼                                 ▼
  [ AVAILABLE ]                   [ NOT AVAILABLE ]
       │                                 │
  ✓ Sufficient stock             Find Potential Alternatives:
  ✓ Quantity confirmed           • Alternative A — In Stock (qty: 30)
       │                         • Alternative B — In Stock (qty: 15)
       ▼                                 ↓
  Doctor Confirms              Doctor Selects Alternative OR
  Original Medicine            Provides Alternative Prescription
       │
       ▼
  Proceed to E-Prescription
```

**Example Display in Doctor UI:**

```text
Medication Availability Check

Amoxicillin 500mg × 20

✓ Available at ABC Pharmacy
✓ Current Stock: 45 units
✓ Sufficient for prescription (need: 20)

[ CONFIRM MEDICINE ]

──────────────────────────────

Cefadroxil 500mg × 20 (for a different patient)

❌ Not Available at ABC Pharmacy
   Current Stock: 0 units

Potential Alternatives:
  • Augmentin 625mg — Stock: 30 (clinically consider with doctor)
  • Cefuroxime 250mg — Stock: 15 (clinically consider with doctor)

⚠️ Final medicine selection is the doctor's clinical decision.
```

**Agent Tools (Allow-Listed):**

| Tool | Purpose |
|---|---|
| `searchMedicine()` | Search medicine by name/category |
| `checkInventory()` | Check pharmacy stock for a medicine |
| `checkMedicineQuantity()` | Verify if quantity is sufficient |
| `findPotentialAlternatives()` | Find available alternative medicines |
| `validatePrescription()` | Validate prescription structure |

**Safety Rules:**

- Must NOT automatically substitute a prescribed medicine
- Must NOT change dosage or quantity without doctor approval
- Alternatives are presented for doctor consideration only
- If inventory check fails → *"Inventory check unavailable. Please verify stock manually."*

**Evaluation Metrics:**

| Metric | Method |
|---|---|
| Stock Lookup Accuracy | Rule-based tests against seed data |
| Alternative Medicine Relevance | Golden test cases |
| False Negative Rate | Tests where medicine IS available but wrongly flagged |
| Safe Failure Rate | Deterministic failure handling tests |

### Feature Branches

```text
feature/m3-medicine-management
feature/m3-medicine-categories
feature/m3-pharmacy-medicine-stock
feature/m3-prescription-generation
feature/m3-prescription-distribution
feature/m3-order-management
feature/m3-order-payment
feature/m3-price-calculation
feature/m3-order-status-workflow
feature/m3-agent-medication-intelligence
feature/m3-react-pharmacist-portal
feature/m3-flutter-order-tracking
```

### Deliverables

- [ ] Medicine, MedicineCategory, PharmacyMedicine, Prescription, PrescriptionItem, MedicineOrder, OrderItem, OrderPayment tables + EF Core migrations
- [ ] E-Prescription & Medicine Order REST APIs (minimum 4 meaningful endpoints)
- [ ] Price Calculation Service + Order Status State Machine (non-CRUD business operations)
- [ ] React pharmacist portal (all screens listed above)
- [ ] Flutter patient prescription and order tracking screens (with push notifications)
- [ ] Medication Intelligence Agent with agent tools
- [ ] Seed data (sample medicines, categories, prescriptions, orders)
- [ ] Prescription + order + price calculation + integration tests
- [ ] Swagger API documentation
- [ ] Individual AI usage log

---

## 8. E-Prescription Generation & Distribution Workflow

### Doctor Creates E-Prescription

```text
Doctor
   ↓
Opens Verified Appointment (APP-2026-1024)
   ↓
Consultation Complete
   ↓
Select Required Medicine
   ↓
💊 Medication Intelligence Agent checks availability
   ↓
Doctor Confirms Medicine (+ quantity, dosage, duration)
   ↓
Doctor clicks [ GENERATE E-PRESCRIPTION ]
   ↓
System Creates E-Prescription Record
```

### E-Prescription Distribution

```text
E-Prescription Generated
      ├──────────────────────────────────────┐
      ▼                                       ▼
PATIENT PORTAL (Flutter + React)      PHARMACIST PORTAL (React)
  • View prescription                   • View prescription
  • See medicines + dosage              • See appointment number
  • Download/share                      • See medicine list + quantity
                                        • Auto-calculate price
                                        • Process order
```

### E-Prescription Fields

| Field | Description |
|---|---|
| Prescription ID | Unique prescription identifier |
| Appointment Number | e.g. `APP-2026-1024` |
| Patient ID | Patient reference |
| Doctor ID | Issuing doctor reference |
| Date Issued | Timestamp of generation |
| Medicines | List of medicine items |
| Quantity | Per medicine quantity |
| Dosage & Frequency | Dosage instructions |
| Status | ACTIVE / FULFILLED / EXPIRED |

---

## 9. Pharmacist Order Processing Workflow

```text
Pharmacist
   ↓
Search Prescription (by APP-2026-1024 or Prescription ID)
   ↓
View E-Prescription Details
   ↓
System Auto-Calculates Total Price:

  Amoxicillin 500mg × 20    Rs. 25 × 20 = Rs.  500
  Paracetamol 500mg × 10    Rs. 10 × 10 = Rs.  100
  TOTAL                                 = Rs.  600

   ↓
Pharmacist Confirms Order
   ↓
Patient Notified + Payment Requested
   ↓
Patient Pays
   ↓
Pharmacist Prepares Order
   ↓
Order Status: READY
   ↓
Patient Collects
   ↓
Order Status: DISPENSED
   ↓
Pharmacy Inventory Automatically Decremented
```

---

## 10. Member 4 — Pharmacy Inventory & Supplier Management

### Business Focus

Everything related to **pharmacy management, inventory monitoring, supplier management, and restocking workflows** — pharmacy profiles, real-time stock levels, low-stock alerts, demand forecasting, restock request management, supplier portal, and pharmacy feedback. Member 4 also owns the **Pharmacy & Inventory Intelligence Agent**.

### A. Software Engineering (SE) Responsibility

#### ASP.NET Core — API Endpoints (Minimum 4)

```text
# Pharmacy Management
GET    /api/pharmacies/{id}                  # Get pharmacy details
GET    /api/pharmacies/nearby                # Nearby pharmacy search (location-based)

# Inventory Management
GET    /api/pharmacies/{id}/inventory        # Get pharmacy inventory
POST   /api/pharmacies/{id}/inventory        # Add stock
PUT    /api/inventory/{id}                   # Update stock level
GET    /api/inventory/low-stock              # Get low-stock items

# Restock Requests
POST   /api/restock-requests                 # Create restock request
GET    /api/restock-requests                 # List restock requests
PUT    /api/restock-requests/{id}            # Update request status

# Supplier Actions
POST   /api/suppliers/{id}/approve           # Supplier approves request
GET    /api/suppliers/{id}/supply-history    # View supply history

# Pharmacy Analytics
GET    /api/pharmacies/{id}/analytics        # Sales + order analytics
GET    /api/pharmacies/{id}/ratings          # Pharmacy ratings
```

#### PostgreSQL — Database Entities

| Entity | Purpose |
|---|---|
| `Pharmacy` | Pharmacy records (name, address, contact, location, status) |
| `PharmacyInventory` | Stock levels per medicine per pharmacy |
| `InventoryHistory` | Historical stock change records |
| `Supplier` | Supplier company profiles |
| `SupplierMedicine` | Medicines a supplier can provide |
| `RestockRequest` | Restock requests from pharmacy to supplier |
| `RestockRequestItem` | Individual medicine items in a restock request |

Requirements: PKs, FKs, constraints, indexes, EF Core migrations, seed data, timestamps.

#### React Screens — Pharmacy Owner & Supplier Portals

```text
Pharmacy Owner Dashboard
    ├── Dashboard Home
    │       ├── Real-time Stock Level Overview
    │       ├── Low-Stock Alert Count
    │       ├── Active Orders
    │       └── Revenue Summary
    ├── Inventory Dashboard
    │       ├── Full Stock List
    │       ├── Low-Stock Items (⚠ Current < Minimum)
    │       ├── Expiring / Expired Items
    │       └── Inventory History
    ├── Stock Management
    │       ├── Add/Update Stock
    │       ├── Set Minimum Thresholds
    │       └── Stock Adjustment Records
    ├── AI Demand Intelligence
    │       ├── Demand Forecast View
    │       ├── Stock-Out Predictions
    │       ├── Restock Recommendations (AI)
    │       └── [ APPROVE RESTOCK ] / [ DISMISS ]
    ├── Pharmacy Profile
    │       ├── Pharmacy Information
    │       ├── Location & Map
    │       └── Operating Hours
    └── Pharmacy Feedback & Ratings
            ├── Average Rating
            ├── Rating Distribution
            └── Recent Patient Feedback

Supplier Portal
    ├── Supplier Dashboard
    │       ├── Pending Requests Count
    │       └── Quick Stats
    ├── Supplier Profile
    ├── Medicines Supplied List
    ├── Restock Requests
    │       ├── Request List (PENDING / APPROVED / REJECTED)
    │       └── Request Detail
    │               ├── Medicine Name
    │               ├── Requested Quantity
    │               ├── AI Recommendation Note
    │               ├── Current Pharmacy Stock
    │               ├── [ APPROVE ]
    │               └── [ REJECT ]
    ├── Delivery Management
    │       ├── Pending Deliveries
    │       └── Delivery Status Updates
    └── Supply History
```

#### Flutter Screens — Pharmacist/Operational Mobile

```text
Pharmacist/Operational App
    ├── Pharmacist Login
    ├── Stock Overview
    │       ├── Current Stock Levels
    │       └── Low-Stock Alerts (push notification)
    ├── Stock Update Screen
    │       ├── Update Quantity
    │       └── Record Reason
    ├── Restock Request Status
    │       ├── Pending Requests
    │       ├── Approved Requests
    │       └── Delivery Status
    └── Supplier Request Status
            └── Track Pending Supply Orders
```

> **Device Feature Requirement:** Push notifications for low-stock alerts and restock approval status updates.

#### Testing

- Inventory API tests (add stock, update, low-stock detection)
- Restocking business-rule tests (threshold detection, request creation)
- React component tests (inventory dashboard, supplier portal)
- Flutter tests (stock overview, notifications)
- AI forecasting/demand tests (golden cases with known order history)
- Integration tests (order dispensed → inventory decremented → low-stock detected → restock requested → supplier approves → stock updated)
- Performance tests (API response time, concurrent inventory reads)

#### Non-CRUD Business Operation — Restocking Decision & Demand Forecasting

Beyond CRUD, Member 4 must implement an **Inventory Intelligence Service** that:

1. Monitors all inventory levels against minimum thresholds
2. Analyzes recent order history to calculate demand rate
3. Predicts estimated stock-out date
4. Calculates recommended restock quantity
5. Exposes these as structured recommendations for pharmacist/owner review

```text
POST /api/pharmacies/{id}/generate-restock-recommendations

Process:
  For each medicine in inventory:
    1. Check: currentStock < minimumThreshold?
    2. Analyze: recent orders (last 30 days) → demand rate/day
    3. Predict: estimated stock-out = currentStock / demand_per_day
    4. Recommend: restockQty = (target_days × demand_per_day) - currentStock

Output:
  {
    medicine: "Amoxicillin 500mg",
    currentStock: 8,
    minimumThreshold: 20,
    demandPerDay: 6,
    predictedStockOutIn: "1.3 days",
    recommendedRestockQty: 50,
    status: "CRITICAL"
  }
```

### B. AI Agent — 📦 Pharmacy & Inventory Intelligence Agent

**Purpose:** Monitor pharmacy inventory levels, analyze historical demand patterns, forecast future demand, predict stock-outs, and recommend optimal restocking quantities. The pharmacist or pharmacy owner must approve any recommendation before a supplier request is created.

**Workflow:**

```text
Pharmacy Inventory Levels + Historical Order Data
       ↓
📦 Pharmacy & Inventory Intelligence Agent
       ↓
Low-Stock Detection (currentStock < minimumThreshold)
       ↓
Demand Analysis (recent orders + trends)
       ↓
Demand Forecasting (predicted usage)
       ↓
Stock-Out Date Prediction
       ↓
Optimal Restock Quantity Recommendation
       ↓
Pharmacist / Owner Reviews
       ↓
[ APPROVE → Supplier Request Created ]
[ DISMISS → No action taken ]
```

**Example Agent Recommendation:**

```text
📦 Inventory Intelligence Report — ABC Pharmacy

Medicine: Amoxicillin 500mg
─────────────────────────────────────
Current Stock:       8 units
Minimum Threshold:   20 units
Status:              ⚠️ CRITICAL — LOW STOCK

Recent Demand:
  Last 7 days: 42 units
  Daily average: 6 units/day

Stock-Out Prediction:
  Estimated stock-out in approximately 1.3 days

AI Recommendation:
  Restock 50 units from Supplier Alpha

Reason:
  Current stock is 60% below minimum threshold.
  High recent demand indicates continued usage.
  50 units covers approximately 8 days of supply.

[ APPROVE RESTOCK ]  [ DISMISS ]

⚠️ This is an AI recommendation.
   Pharmacist / Owner must approve before
   supplier request is created.
```

**Agent Tools (Allow-Listed):**

| Tool | Purpose |
|---|---|
| `getInventory()` | Retrieve current inventory levels for a pharmacy |
| `getHistoricalOrders()` | Get historical order data for demand analysis |
| `calculateDemand()` | Calculate average demand rate |
| `forecastDemand()` | Forecast future demand |
| `predictStockout()` | Predict when stock will run out |
| `generateRestockRecommendation()` | Generate recommended restock quantity and supplier |

**Safety Rules:**

- Must NOT create supplier requests automatically without approval
- Restock recommendations are suggestions only — human decides
- If insufficient historical data → *"Insufficient historical data for demand prediction. Manual assessment recommended."*
- If inventory data unavailable → *"Inventory check failed. Please verify stock manually."*

**Evaluation Metrics:**

| Metric | Method |
|---|---|
| Low-Stock Detection Precision | Rule-based tests against seeded inventory |
| Demand Prediction MAE | Mean Absolute Error vs. actual consumption |
| Stock-Out Prevention Rate | % of predicted stock-outs avoided with restock |
| Restocking Quantity Accuracy | Within acceptable range tests |
| False Positive Rate | Tests where stock is fine but flagged as low |

### Supplier Portal Workflow

```text
Pharmacy Owner / Pharmacist
   ↓
Reviews AI Restock Recommendation
   ↓
Approves → Restock Request Created
   ↓
SUPPLIER PORTAL

  RESTOCK REQUEST

  Medicine:      Amoxicillin 500mg
  Quantity:      50 units
  Requested By:  ABC Pharmacy
  AI Note:       High demand predicted
  Status:        PENDING

  [ APPROVE ]   [ REJECT ]

   ↓ (Supplier Action)
Supplier Approves
   ↓
Delivery Status Updated
   ↓
Pharmacy Marks as Received
   ↓
Inventory Automatically Updated
```

### Pharmacy Feedback & Rating

After a completed medicine order, patients can rate the pharmacy:

```text
Rate Pharmacy

ABC Pharmacy

★★★★★ (5 stars)

Review: "Fast service and helpful staff."

[ SUBMIT ]
```

The system displays:
- Average rating (e.g. 4.8 ⭐)
- Number of ratings
- Rating distribution (5⭐: 80%, 4⭐: 15%, 3⭐: 5%)
- Recent feedback list

> **Rule:** Only patients who have completed a medicine order at that pharmacy can submit a rating.

### Patient Order History

The patient dashboard must display:

```text
MY ORDER HISTORY

Order #ORD-1024
─────────────────────────
Appointment: APP-2026-1024
Pharmacy:    ABC Pharmacy
Medicines:   Amoxicillin 500mg × 20
             Paracetamol 500mg × 10
Total:       Rs. 600
Status:      COMPLETED
Feedback:    ★★★★★ (submitted)

Order #ORD-1018
─────────────────────────
Appointment: APP-2026-1001
Pharmacy:    City Pharmacy
Medicines:   Omeprazole 20mg × 14
Total:       Rs. 210
Status:      DISPENSED
```

### Feature Branches

```text
feature/m4-pharmacy-management
feature/m4-pharmacy-location
feature/m4-inventory-management
feature/m4-stock-monitoring
feature/m4-low-stock-alerts
feature/m4-inventory-history
feature/m4-supplier-management
feature/m4-restock-requests
feature/m4-restock-approval
feature/m4-supply-workflow
feature/m4-pharmacy-feedback
feature/m4-agent-inventory-intelligence
feature/m4-react-pharmacy-owner
feature/m4-react-supplier-portal
feature/m4-flutter-pharmacist-app
```

### Deliverables

- [ ] Pharmacy, PharmacyInventory, InventoryHistory, Supplier, SupplierMedicine, RestockRequest, RestockRequestItem tables + EF Core migrations
- [ ] Pharmacy & Inventory REST APIs (minimum 4 meaningful endpoints)
- [ ] Inventory Intelligence Service + Demand Forecasting (non-CRUD business operations)
- [ ] React pharmacy owner dashboard + supplier portal (all screens listed above)
- [ ] Flutter pharmacist/operational mobile app (with push notifications)
- [ ] Pharmacy & Inventory Intelligence Agent with agent tools
- [ ] Seed data (sample pharmacies, inventory, suppliers, restock requests)
- [ ] Inventory + restocking + supplier + integration + performance tests
- [ ] Swagger API documentation
- [ ] Individual AI usage log

---

## 11. Agentic AI Architecture

### Overview

The four agents must not be implemented as four disconnected prompt-based chatbots. The SE3090 assignment requires distinct agents with identifiable responsibilities, input/output contracts, controlled tools, and visible participation in a structured workflow managed by an **Agentic Orchestrator**.

### Agentic Orchestrator

The orchestrator is a **cross-cutting component** that coordinates the four agents across the end-to-end workflow:

```text
Orchestrator Responsibilities:
  1. Receive a domain objective
  2. Create a structured plan
  3. Select / delegate tasks to appropriate agents
  4. Allow agents to call only allow-listed tools
  5. Validate inputs and outputs at each step
  6. Persist workflow state to database
  7. Apply business-rule validation
  8. Pause high-impact actions for authorized human approval
  9. Continue or revise the workflow based on human decisions
  10. Produce an auditable result or safe failure record
```

### Complete Orchestrated Workflow

```text
Patient submits symptoms
        ↓
Agentic Orchestrator
        ↓
Create structured plan
        ↓
Delegate → 🩺 Specialist & Doctor Recommendation Agent
        ↓
Specialty + Doctor Ranking → Patient selects doctor
        ↓
Appointment + Payment
        ↓
Receptionist Verification (Human Approval Point #1)
        ↓
Doctor Consultation
        ↓
Delegate → 🧠 Clinical Decision Support Agent
        ↓
Diagnosis Suggestions → Doctor Reviews (Human Approval Point #2: ACCEPT/MODIFY/REJECT)
        ↓
Doctor Selects Medicine
        ↓
Delegate → 💊 Medication Intelligence Agent
        ↓
Medicine Availability Check → Doctor Confirms Medicine
        ↓
E-Prescription Generated
        ↓
Pharmacist Processes Order
        ↓
Inventory Decremented
        ↓
Delegate → 📦 Pharmacy & Inventory Intelligence Agent
        ↓
Demand Analysis + Stock-Out Prediction
        ↓
Restock Recommendation → Pharmacist/Owner Reviews (Human Approval Point #3)
        ↓
Supplier Request Created → Supplier Approves (Human Approval Point #4)
        ↓
Inventory Updated
```

### Human Approval Points

At least two human approval points are required by the assignment. This system implements four:

| # | Trigger | Approver | Action |
|---|---|---|---|
| 1 | Payment submitted | Receptionist | Verify payment, confirm appointment, generate number |
| 2 | AI diagnosis suggestion | Doctor | ACCEPT / MODIFY / REJECT |
| 3 | AI restock recommendation | Pharmacist / Owner | APPROVE / DISMISS |
| 4 | Restock request received | Supplier | APPROVE / REJECT |

### Agent Tool Registry (Allow-Listed)

All agents access the system through **controlled, allow-listed tools only**. No agent has direct database or unrestricted system access.

#### 🩺 Specialist & Doctor Recommendation Agent Tools

| Tool | Purpose |
|---|---|
| `searchSpecialties()` | Search specialties by symptom keywords |
| `searchDoctors()` | Find doctors by specialty |
| `getDoctorRating()` | Retrieve rating data |
| `getDoctorAvailability()` | Check appointment availability |
| `calculateDoctorScore()` | Calculate weighted recommendation score |

#### 🧠 Clinical Decision Support Agent Tools

| Tool | Purpose |
|---|---|
| `getPatientClinicalData()` | Retrieve structured clinical data |
| `searchClinicalKnowledge()` | Search clinical knowledge base |
| `retrieveSimilarCases()` | Retrieve similar historical cases |
| `validateDiagnosisOutput()` | Validate output schema and safety |

#### 💊 Medication Intelligence Agent Tools

| Tool | Purpose |
|---|---|
| `searchMedicine()` | Search medicine catalog |
| `checkInventory()` | Check pharmacy stock |
| `checkMedicineQuantity()` | Verify sufficiency of quantity |
| `findPotentialAlternatives()` | Find available alternatives |
| `validatePrescription()` | Validate prescription structure |

#### 📦 Pharmacy & Inventory Intelligence Agent Tools

| Tool | Purpose |
|---|---|
| `getInventory()` | Get current stock levels |
| `getHistoricalOrders()` | Get historical order/demand data |
| `calculateDemand()` | Calculate demand rate |
| `forecastDemand()` | Forecast future demand |
| `predictStockout()` | Predict stock-out date |
| `generateRestockRecommendation()` | Generate restock quantity recommendation |

> **Tool Requirements:** Every tool must validate inputs, validate outputs, enforce authorization, return structured results, log execution, and handle errors safely.

### Shared Workflow State (Persisted)

```json
{
  "workflowId": "WF-2026-0451",
  "objective": "Complete healthcare consultation and dispensing",
  "plan": ["symptom-analysis", "doctor-recommendation", "appointment", "consultation", "prescription", "dispensing", "inventory"],
  "currentStep": "dispensing",
  "completedSteps": ["symptom-analysis", "doctor-recommendation", "appointment", "consultation", "prescription"],
  "agentResults": {
    "specialistAgent": { "specialty": "Gastroenterology", "confidence": 0.91 },
    "clinicalAgent": { "topDiagnosis": "Acute Gastritis", "confidence": 0.92, "doctorDecision": "ACCEPTED" },
    "medicationAgent": { "medicine": "Amoxicillin 500mg", "available": true, "confirmed": true }
  },
  "toolResults": { ... },
  "validationResults": { ... },
  "approvalStatus": {
    "receptionistVerification": "APPROVED",
    "doctorDiagnosis": "ACCEPTED",
    "restockRecommendation": "PENDING"
  },
  "errors": [],
  "retries": 0,
  "finalOutcome": null,
  "createdAt": "2026-08-24T09:00:00Z",
  "updatedAt": "2026-08-24T10:30:00Z"
}
```

> **Rule:** Do not store hidden chain-of-thought/reasoning, passwords, tokens, or unnecessary sensitive information. Only persist workflow state and execution summaries needed for audit and continuation.

---

## 12. Validation & Safety

### Input/Output Validation

- Schema validation on all API inputs (DTOs with data annotations)
- Business-rule validation (appointment conflicts, stock thresholds, order eligibility)
- Output validation on all agent results (schema validation before persisting)
- Role-based authorization on all endpoints

### Agent Safety

```text
Example: AI suggests alternative medicine
        ↓
Business-Rule Validator
        ↓
Is medicine valid? (exists in database)
Is it available? (stock > 0)
Is doctor approval required? (yes, always)
        ↓
Reject / Request Revision / Continue to Doctor Review
```

### Safety Controls

| Control | Implementation |
|---|---|
| Tool allow-lists | Agents can only call registered tools |
| Input validation | All tools validate input types and ranges |
| Output validation | All agent outputs validated before use |
| Timeouts | Agent calls have configured timeouts |
| Retry limits | Maximum retry count per workflow step |
| Prompt-injection resistance | Input sanitization before LLM calls |
| Safe failure | Every agent has defined fallback behavior |
| Error logging | All errors logged with context |
| Audit logging | All agent actions, tool calls, decisions logged |

---

## 13. React Web Application

### Purpose

The React application primarily supports **administrative, staff, and professional workflows**.

### Portals by Member

| Portal | Primary Owner | Secondary Contribution |
|---|---|---|
| Patient Portal / Admin | Member 1 | — |
| Doctor Portal | Member 2 | — |
| Receptionist Portal | Shared (M1 owns appointment data, M2 owns workflow) | — |
| Pharmacist Portal | Member 3 | — |
| Pharmacy Owner Dashboard | Member 4 | — |
| Supplier Portal | Member 4 | — |
| Agent Monitoring / Execution History | Shared (all contribute) | — |
| Admin Panel | Shared | — |

### Technical Requirements

- Functional components + React Hooks
- React Router with protected routes
- Role-based navigation (different portals per role)
- Reusable component library
- State management (Context API or equivalent, justified)
- Search, filtering, sorting, pagination on list views
- Form validation
- Loading states and error states
- Agent monitoring dashboard (view workflow state, agent results, approval history)

---

## 14. Flutter Mobile Application

### Purpose

Flutter primarily supports **patient-facing and operational mobile workflows**.

### Patient Mobile Workflows

```text
Registration / Login
    ↓
Symptom Submission
    ↓
AI Doctor Recommendations
    ↓
Doctor Search & Profiles
    ↓
Appointment Booking
    ↓
Appointment Tracking
    ↓
E-Prescription Viewing
    ↓
Medicine Order Tracking
    ↓
Order History
    ↓
Pharmacy Rating
    ↓
Push Notifications
```

### Device Feature Requirement

Each member must include at least one meaningful device feature:

| Member | Recommended Device Feature |
|---|---|
| Member 1 | GPS / Map for nearby doctors |
| Member 2 | Push notifications for verified appointment |
| Member 3 | Push notifications for order status |
| Member 4 | Push notifications for low-stock / restock status |

### Technical Requirements

- Shared API service layer (HTTP client with JWT headers)
- Provider or Riverpod state management
- Navigation with named routes
- Form validation
- Error handling and empty states
- Platform-specific features (camera, GPS, notifications as appropriate)

---

## 15. Backend Architecture

```text
ASP.NET Core Web API
        ↓
Controllers (per member: organized by module)
        ↓
DTOs (Request/Response objects with validation)
        ↓
Application / Service Layer (business logic)
        ↓
Data Access Layer
        ↓
Entity Framework Core
        ↓
PostgreSQL
```

The backend is the **authoritative application layer** for:
- Public REST APIs consumed by React and Flutter
- JWT authentication and token validation
- Role-based authorization
- Input validation and business rules
- Data persistence
- Agent workflow initiation and orchestration calls
- Human approval recording
- Audit logging

> **Python AI Service Rule:** If a Python service is used for the AI subsystem, it must be called by ASP.NET Core as an internal service. React and Flutter must **never** call the Python service directly.

---

## 16. Authentication & Security

### Implementation

| Feature | Implementation |
|---|---|
| Authentication | JWT Bearer tokens |
| Password storage | BCrypt hashing |
| Role authorization | `[Authorize(Roles = "...")]` on controllers |
| Protected routes | React: route guards; Flutter: auth middleware |
| Secure config | User Secrets / environment variables (never commit secrets) |
| CORS | Configured for React and Flutter origins |
| Global error handling | Middleware returning structured error responses |
| Logging | Structured logging (Serilog or equivalent) |
| API docs | Swagger/OpenAPI with auth requirements |

### Role-to-API Mapping

```text
PATIENT          → Patient APIs, Appointment APIs, Prescription read, Order APIs
DOCTOR           → Doctor APIs, Consultation APIs, Clinical APIs, Prescription generate
RECEPTIONIST     → Receptionist verification APIs
PHARMACIST       → Pharmacist APIs, Order status APIs, Inventory APIs (read)
PHARMACY_OWNER   → Pharmacy APIs, Full Inventory APIs, Restock APIs, Analytics
SUPPLIER         → Supplier APIs, Restock approval APIs
ADMINISTRATOR    → All APIs, Audit logs, System management
```

---

## 17. Database Design

### PostgreSQL Requirements

| Requirement | Detail |
|---|---|
| Primary Keys | All entities |
| Foreign Keys | All relationships enforced at DB level |
| Constraints | NOT NULL, CHECK, UNIQUE where appropriate |
| Indexes | On frequently queried columns (role, status, FK columns) |
| EF Core Migrations | All schema changes through migrations |
| Seed Data | Realistic demo data for all entities |
| Transactions | Used for multi-step operations (order processing, inventory updates) |
| Timestamps | `CreatedAt`, `UpdatedAt` on all entities |

### Entity Ownership Summary

| Member | Owned Entities |
|---|---|
| Member 1 | Patient, Doctor, Specialty, DoctorSpecialty, DoctorAvailability, DoctorRating, Appointment, AppointmentPayment |
| Member 2 | ClinicalRecord, Consultation, PatientHistory, Allergy, Examination, LabResult, DiagnosisSuggestion, DoctorDecision |
| Member 3 | Medicine, MedicineCategory, PharmacyMedicine, Prescription, PrescriptionItem, MedicineOrder, OrderItem, OrderPayment |
| Member 4 | Pharmacy, PharmacyInventory, InventoryHistory, Supplier, SupplierMedicine, RestockRequest, RestockRequestItem |
| Shared | Users, Roles, UserRoles, WorkflowState, AgentExecutionLog, AuditLog |

> An **ER diagram** covering all entities and relationships is required in the documentation.

---

## 18. Third-Party API Integration

The project must integrate **at least one meaningful third-party API or service**.

### Recommended: Maps / Location API

Use a Maps API (Google Maps, OpenStreetMap, or equivalent) to:

- Display doctor and pharmacy locations on a map
- Find nearby pharmacies (location-based search)
- Show distance from patient to doctor/pharmacy
- Support location-based recommendations

**Integration points:**
- Flutter: Google Maps Flutter plugin for patient-facing location features
- React: Maps embed for doctor/pharmacy location display
- Backend: Geocoding API for coordinates from addresses

### Other Acceptable Options

| Integration | Use Case |
|---|---|
| Payment sandbox (Stripe, PayHere) | Appointment and medicine order payments |
| Email / SMS (SendGrid, Twilio) | Appointment confirmations, prescription notifications |
| Push notifications (Firebase FCM) | Order status, low-stock alerts |
| Calendar API | Appointment scheduling synchronization |

> **Rule:** External services should be accessed through ASP.NET Core where appropriate. Credentials must be stored in environment variables / configuration secrets and never committed to Git. Failures must be handled gracefully.

---

## 19. Testing Strategy

### Backend Testing

- Unit tests for service layer (business logic, ranking, scheduling, price calculation, demand forecasting)
- Validation tests (invalid inputs rejected correctly)
- Authentication/authorization tests (roles enforced correctly)
- Controller / API integration tests (full request → response cycle)
- PostgreSQL integration tests (constraints, migrations, transactions)

### React Testing

- Component render tests
- Form validation tests
- Protected route tests (unauthorized redirect)
- API integration tests (mock API responses)
- Error state rendering

### Flutter Testing

- Unit tests for service/model logic
- Widget tests for key screens
- Validation tests (form inputs)
- Navigation tests
- API integration tests (mock HTTP)

### Agentic AI Testing

> **Critical:** LLM-as-a-judge **cannot** be the only evaluation method.

Use:

| Method | Purpose |
|---|---|
| Golden test cases | Known symptom sets → expected specialty/diagnosis |
| Schema validation | Assert output structure is correct |
| Rule-based assertions | Deterministic checks on output fields |
| Deterministic validators | Business rules evaluated programmatically |
| Human review | Sample review of agent outputs |

Test:

- Planning (orchestrator creates valid plan)
- Delegation (correct agent selected for task)
- Tool selection (correct tool called with valid inputs)
- Structured outputs (output schema matches expected)
- Business-rule validation (invalid outputs rejected)
- Human approval flow (workflow pauses correctly)
- Prompt-injection resistance (malicious input handled safely)
- Failure recovery (agent failure leads to safe fallback)
- Safe failure (meaningful error message, no crash)

### Performance Testing

| Metric | Target |
|---|---|
| API response time | Measure P50, P95, P99 |
| Concurrent requests | Test under simulated load |
| Success/failure rate | Under load |
| Database response time | Query execution time |
| Agent latency | Time from request to recommendation |
| Workflow completion time | End-to-end workflow duration |

---

## 20. Git & GitHub

### From Day One

- GitHub repository (one shared repository)
- Feature branches per member per feature
- Meaningful commit messages (conventional commits recommended)
- GitHub Issues for task tracking
- Pull Requests with code review (minimum 1 reviewer per PR)
- Project board (Kanban / milestone tracking)
- Conflict resolution process

### Commit Convention

```text
feat(m1): add doctor ranking algorithm
fix(m2): resolve appointment authorization issue
test(m3): add price calculation unit tests
docs(m4): update inventory API swagger docs
style(m1): format patient service code
refactor(m2): extract consultation logic to service
```

> **Rule:** Every member must have visible, regular technical Git contributions. Do NOT create artificial commits or bulk-upload work at the end of the project.

### Branch Naming

```text
main              ← production-ready code
develop           ← integration branch
feature/m1-doctor-ranking
feature/m2-clinical-records
feature/m3-price-calculation
feature/m4-inventory-intelligence
```

---

## 21. GitHub Actions CI

### Minimum CI Pipeline

```yaml
# On every push and pull request:
Restore NuGet packages
    ↓
Build ASP.NET Core API
    ↓
Run Backend Unit Tests
    ↓
Pass / Fail
```

### Extended CI (Recommended)

```text
Backend Build + Test
React Build + Lint + Test
Flutter Analyze + Test
Deploy to staging (on merge to main)
```

---

## 22. Complete Responsibility Matrix

| Area | Member 1 | Member 2 | Member 3 | Member 4 |
|---|:---:|:---:|:---:|:---:|
| **Primary Component** | Patient & Appointment | Doctor & Clinical | E-Prescription & Orders | Inventory & Supplier |
| **ASP.NET Core** | Patient/Appointment APIs | Clinical/Consultation APIs | Prescription/Order APIs | Inventory/Supplier APIs |
| **PostgreSQL** | Patient/Appointment data | Clinical/Consultation data | Prescription/Order data | Inventory/Supplier data |
| **React** | Patient portal + Admin workflows | Doctor consultation portal | Pharmacist portal | Pharmacy owner + Supplier portals |
| **Flutter** | Patient mobile (symptoms, doctors, appointments) | Doctor/operational mobile | Patient order/prescription mobile | Pharmacist/stock mobile |
| **Agentic AI** | 🩺 Specialist & Doctor Recommendation | 🧠 Clinical Decision Support | 💊 Medication Intelligence | 📦 Inventory Intelligence |
| **Testing** | Own component + agent tests | Own component + agent tests | Own component + agent tests | Own component + agent tests |
| **Git** | Regular contributions | Regular contributions | Regular contributions | Regular contributions |
| **Documentation** | Individual evidence | Individual evidence | Individual evidence | Individual evidence |

> **Important:** This matrix represents primary ownership — NOT isolated development. Every member must demonstrate contribution across the full stack.

---

## 23. Documentation Requirements

### Group Documentation

| Document | Description |
|---|---|
| Consolidated Report | Group report + individual sections combined |
| Architecture Diagram | System components and their interactions |
| ER Diagram | Complete entity-relationship diagram |
| API Documentation | Swagger/OpenAPI for all endpoints |
| Agent Architecture | How the four agents + orchestrator interact |
| Agent Workflow Diagram | Step-by-step agentic workflow visualization |
| Testing Report | Test results, coverage, methodology |
| Performance Report | Performance test results |
| Deployment Report | How the system is deployed |
| ADR | Architecture Decision Records (key decisions made) |

### Individual Documentation (Per Member)

| Document | Description |
|---|---|
| Individual Report | Personal technical contribution summary |
| Individual AI Usage Log | Date, Tool, Task, AI Output, What Changed, How Verified |
| Individual Reflection | Learning outcomes and personal contributions |

---

## 24. AI Usage Documentation

Because this is a Level 4 AI-use assignment, **each student must maintain an individual AI usage log**.

### Per-Member AI Usage Log Format

| Date | Tool / Model | Task | What AI Produced | What Was Changed / Rejected | How Result Was Verified |
|---|---|---|---|---|---|
| 2026-08-24 | Claude Sonnet | Generate DoctorRankingService | Initial code structure | Adjusted weights, removed hardcoded values | Unit tests, manual review |
| 2026-08-24 | GitHub Copilot | Autocomplete DTO validation | Field annotations | Removed incorrect regex | Manual testing |

### Group AI Declaration

A consolidated group AI declaration must be included in the consolidated report covering:
- Which AI tools were used
- How they were used
- How outputs were verified
- What was rejected or significantly modified

> **Rules:**
> - Do NOT submit code or features that a member cannot explain, test, modify, or debug
> - External AI tools are **not allowed** during the final demonstration/viva
> - Members must be able to explain every part of their code

---

## 25. Safe Failure Scenarios

| Scenario | Owner | Safe Response |
|---|---|---|
| Symptom analysis fails | Member 1 | *"Unable to analyze symptoms. Please search for a doctor manually."* |
| Doctor ranking data insufficient | Member 1 | Show doctors sorted by rating with explanation |
| Appointment conflict detected | Member 1 | *"This time slot is not available. Next available: {time}"* |
| Clinical analysis fails | Member 2 | *"Unable to generate suggestions. Please proceed with standard clinical assessment."* |
| Clinical output invalid (schema fail) | Member 2 | Reject output, log error, return safe fallback to doctor |
| Medicine availability check fails | Member 3 | *"Inventory check unavailable. Please verify stock manually."* |
| Price calculation error | Member 3 | Return itemized error, do not present incorrect total |
| Inventory data unavailable | Member 4 | *"Inventory check failed. Please verify stock manually."* |
| Demand prediction insufficient data | Member 4 | *"Insufficient historical data. Manual assessment recommended."* |
| Supplier request fails to send | Member 4 | Log error, notify pharmacy owner, do not silently fail |
| Orchestrator step fails | Shared | Persist error state, allow retry or human intervention |
| JWT token invalid | Shared | Return 401 with clear message |

---

## 26. Repository Structure

```text
MediFlow-AI/
│
├── backend/
│   └── MediFlow.Api/
│       ├── Controllers/
│       │   ├── AuthController.cs                 # Shared
│       │   ├── PatientController.cs              # Member 1
│       │   ├── DoctorController.cs               # Member 1
│       │   ├── AppointmentController.cs          # Member 1
│       │   ├── ReceptionistController.cs         # Shared (M1 data, M2 workflow)
│       │   ├── ConsultationController.cs         # Member 2
│       │   ├── ClinicalController.cs             # Member 2
│       │   ├── DiagnosisController.cs            # Member 2
│       │   ├── MedicineController.cs             # Member 3
│       │   ├── PrescriptionController.cs         # Member 3
│       │   ├── OrderController.cs                # Member 3
│       │   ├── PharmacyController.cs             # Member 4
│       │   ├── InventoryController.cs            # Member 4
│       │   ├── SupplierController.cs             # Member 4
│       │   └── RestockController.cs              # Member 4
│       ├── Models/               # Entity models (all members)
│       ├── DTOs/                 # Request/Response DTOs
│       ├── Services/             # Business logic services
│       ├── Data/
│       │   ├── AppDbContext.cs
│       │   └── Migrations/
│       ├── Auth/                 # JWT + password hashing
│       ├── Middleware/           # Error handling, auth middleware
│       └── Program.cs
│
├── web/
│   └── mediflow-web/             # React application
│       ├── src/
│       │   ├── components/       # Shared components
│       │   ├── pages/
│       │   │   ├── patient/          # Member 1
│       │   │   ├── doctor/           # Member 2
│       │   │   ├── receptionist/     # Shared
│       │   │   ├── pharmacist/       # Member 3
│       │   │   ├── pharmacy-owner/   # Member 4
│       │   │   ├── supplier/         # Member 4
│       │   │   └── admin/            # Shared
│       │   ├── services/         # API service layer
│       │   ├── context/          # Auth context
│       │   └── routes/           # Protected routing
│       └── package.json
│
├── mobile/
│   └── mediflow_mobile/          # Flutter application
│       ├── lib/
│       │   ├── screens/
│       │   │   ├── auth/             # Shared (M2 implements)
│       │   │   ├── patient/          # Member 1 + Member 3
│       │   │   ├── appointments/     # Member 1
│       │   │   ├── doctor/           # Member 2
│       │   │   ├── prescriptions/    # Member 3
│       │   │   ├── orders/           # Member 3
│       │   │   └── pharmacy/         # Member 4
│       │   ├── services/         # API HTTP services
│       │   ├── models/           # Data models
│       │   ├── providers/        # State management
│       │   └── widgets/          # Reusable widgets
│       └── pubspec.yaml
│
├── ai/
│   └── mediflow_agents/          # Python Agentic AI subsystem
│       ├── orchestrator/
│       │   └── workflow_orchestrator.py          # Main orchestrator
│       ├── agents/
│       │   ├── specialist_recommendation_agent.py   # Member 1
│       │   ├── clinical_decision_support_agent.py   # Member 2
│       │   ├── medication_intelligence_agent.py     # Member 3
│       │   └── inventory_intelligence_agent.py      # Member 4
│       ├── tools/
│       │   ├── specialist_tools.py               # Member 1
│       │   ├── clinical_tools.py                 # Member 2
│       │   ├── medication_tools.py               # Member 3
│       │   └── inventory_tools.py                # Member 4
│       ├── validators/           # Input/output validators
│       ├── state/                # Workflow state management
│       └── requirements.txt
│
├── tests/
│   ├── backend/                  # .NET test projects
│   ├── web/                      # React tests
│   ├── mobile/                   # Flutter tests
│   └── ai/                       # Agent evaluation tests
│
├── docs/
│   ├── architecture.md
│   ├── er-diagram.md
│   ├── agent-workflow.md
│   ├── api-documentation.md
│   ├── adr/                      # Architecture Decision Records
│   └── ai-usage-logs/            # Per-member AI usage logs
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

## 27. Demo Walkthrough — Member Responsibilities

The final demonstration follows this sequence. Each member leads their own portion.

| # | Demo Step | Lead | What to Show |
|---|---|---|---|
| 1 | Patient registers | M1 | Flutter registration flow |
| 2 | Patient enters symptoms | M1 | Flutter symptom entry screen |
| 3 | AI Specialist Recommendation | M1 | Specialty + ranked doctors with explanation |
| 4 | Patient selects doctor and books | M1 | Flutter booking + date/time picker + payment |
| 5 | Receptionist verifies payment | Shared | React receptionist portal → confirm → APP-2026-1024 |
| 6 | Doctor opens verified appointment | M2 | React doctor portal (only verified appointments visible) |
| 7 | Doctor enters clinical data | M2 | Consultation form + examination + lab results |
| 8 | Clinical Decision Support Agent | M2 | AI suggestions with confidence + ACCEPT/MODIFY/REJECT |
| 9 | Doctor selects medicine | M3 | React prescription creation screen |
| 10 | Medication Intelligence Agent | M3 | Availability check → confirm medicine |
| 11 | E-Prescription generated | M3 | Distributed to patient + pharmacist simultaneously |
| 12 | Patient views prescription | M3 | Flutter prescription viewer |
| 13 | Pharmacist views prescription | M3 | React pharmacist portal + auto price calculation |
| 14 | Patient pays + Pharmacist processes | M3 | Order status workflow (PREPARING → READY → DISPENSED) |
| 15 | Patient tracks order | M3 | Flutter order tracking |
| 16 | Inventory decremented | M4 | Show inventory updated after dispensing |
| 17 | Inventory Intelligence Agent | M4 | Low-stock detection + demand forecast + restock recommendation |
| 18 | Owner reviews AI recommendation | M4 | React pharmacy owner dashboard → APPROVE RESTOCK |
| 19 | Supplier portal | M4 | React supplier portal → APPROVE request |
| 20 | Inventory updated | M4 | Show stock replenished after supplier approval |
| 21 | Patient rates pharmacy | M4 | Flutter pharmacy rating screen |
| 22 | Patient views order history | M1+M3 | Flutter order history |
| 23 | GitHub Actions CI | All | Show passing CI pipeline |
| 24 | Swagger docs | All | Each member shows their endpoints |
| 25 | Tests | All | Each member runs their tests live |
| 26 | Database state | All | Show PostgreSQL tables at key points |
| 27 | AI usage logs | All | Show individual AI usage log entries |

---

## 28. Overall Goal

The final system should demonstrate that the group can integrate **Software Engineering and Artificial Intelligence into one practical multi-agent healthcare platform** that directly follows SE3090 requirements.

### Required Cross-Platform Workflow

The assignment requires at least one complete cross-platform workflow:

```text
Flutter / React
    ↓
ASP.NET Core Web API
    ↓
PostgreSQL
    ↓
Agentic AI (via orchestrator)
    ↓
Human Approval
    ↓
Updated Result persisted to database
    ↓
Response returned to Flutter / React
```

### What the Four Agents Answer

```text
🩺 Agent 1 (Member 1) — "Who should I see?"
    → Symptoms → Specialty → Ranked Doctors

🧠 Agent 2 (Member 2) — "What could this condition be?"
    → Clinical Information → Possible Diagnoses → Doctor Decision Support

💊 Agent 3 (Member 3) — "Is this medicine available?"
    → Medicine Request → Stock Check → Availability Confirmation or Alternatives

📦 Agent 4 (Member 4) — "Should the pharmacy restock this?"
    → Inventory + Demand → Forecast → Restocking Recommendation
```

### Final Rule

The project must not be four mini-projects running in isolation. It must be one integrated system where:

**Flutter/React → ASP.NET Core → PostgreSQL → Agentic AI Orchestrator → Agent → Allow-Listed Tools → Business-Rule Validation → Human Approval → Persisted Workflow State → Audit Log → Response to User**

All four components are interconnected through the shared database, shared authentication, shared business rules, and the agentic orchestration layer — forming **one complete MediFlow AI healthcare system**.
