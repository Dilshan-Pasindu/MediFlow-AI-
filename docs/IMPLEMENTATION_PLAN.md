# MediFlow AI — Comprehensive Implementation Plan & Engineering Roadmap
## Intelligent Channeling, E-Prescription & Pharmacy Management System
### SE3090 Full-Stack Architecture & Multi-Phase Execution Plan

---

## Executive Summary

This Implementation Plan provides an exhaustive, multi-phase technical roadmap for the development, integration, verification, and deployment of **MediFlow AI**. Designed for a 4-member engineering team, the plan establishes strict sprint boundaries, technical deliverables, cross-member contracts, database schemas, agent workflows, and automated testing criteria.

Member 1 (**Dilshan Pasindu**) spearheads the platform foundation, infrastructure, testing framework, authentication, database migrations, CI/CD pipelines, container orchestration, three dedicated portals (**Patient**, **Receptionist**, and **Admin**), and the **🩺 Specialist & Doctor Recommendation Agent**.

---

## Technical Work Breakdown Structure (WBS) by Member

```
                                    MEDIFLOW AI WORK BREAKDOWN STRUCTURE
  ┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ MEMBER 1: Dilshan Pasindu (Lead Architect & Platform Core)                                            │
  │ ├── Foundation: PostgreSQL 16 schemas, EF Core 8 Code-First Migrations, DatabaseSeeder, Connection Pool│
  │ ├── Security: JWT Bearer auth, BCrypt hashing, Claims-based RBAC, RFC 7807 global exception handler   │
  │ ├── DevOps: Multi-stage Dockerfiles (API, Web, AI), docker-compose.yml, GitHub Actions (ci.yml, cd.yml│
  │ ├── Testing: xUnit test suite (27 passing), WebApplicationFactory integration, Vitest web tests      │
  │ ├── Portals: Patient Portal (Web & Mobile), Receptionist Portal (Web), Admin Portal (Web)             │
  │ └── Agentic AI: 🩺 Specialist & Doctor Recommendation Agent (LangGraph, triage, ranking algorithm)    │
  ├───────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ MEMBER 2: Thumula (Clinical Systems)                                                                  │
  │ ├── Portal: 🩺 Doctor Portal (Consultation workspace, vitals capture, EHR longitudinal viewer)       │
  │ └── Agentic AI: 🧠 Clinical Decision Support Agent (CDSS, ICD-10 differential diagnosis, HITL review) │
  ├───────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ MEMBER 3: Kusalya Methpani (Pharmaceutical Distribution)                                              │
  │ ├── Portal: 💊 Pharmacist Portal (Prescription queue, automated price calculator, dispensing tracker) │
  │ └── Agentic AI: 💊 Medication Intelligence Agent (Drug interaction screening, allergy guardrails)     │
  ├───────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ MEMBER 4: Maneesha Pramodini (Supply Chain & Inventory)                                               │
  │ ├── Portals: 🏪 Pharmacy Owner Portal (Stock levels, batch expiry picker), 🚚 Supplier Portal (Orders)│
  │ └── Agentic AI: 📦 Pharmacy & Inventory Intelligence Agent (Consumption velocity, restock forecasting)│
  └───────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Multi-Phase Implementation Roadmap

### Phase 1: Core Platform Foundation, Security & DevOps (Member 1 Lead)
**Goal:** Establish enterprise-ready backend architecture, data persistence, authentication, and containerized dev environments.

#### Tasks:
1. **Database Schema & Migrations (`backend/MediFlow.Api/Data`)**:
   - Define master `AppDbContext` with Fluent API mappings for 20+ entities.
   - Configure composite indexes on `(DoctorId, SlotTime)`, `(InventoryId, ExpiryDate)`, and `(UserId, Role)`.
   - Implement `DatabaseSeeder.cs` provisioning initial admin, doctors, pharmacists, medicines, and sample clinic rooms.
2. **Authentication & Global Authorization (`backend/MediFlow.Api/Services/AuthService.cs`)**:
   - Implement JWT Bearer token generation with 15-minute access tokens and 7-day cryptographically secure refresh tokens.
   - Implement BCrypt password hashing (work factor 11).
   - Configure Claims-based role policies (`RequireRole("Patient")`, `RequireRole("Doctor")`, `RequireRole("Receptionist")`, `RequireRole("Admin")`).
3. **Containerization & Environment (`docker-compose.yml`)**:
   - Configure multi-stage Dockerfiles for backend API, web frontend, and AI subsystem.
   - Orchestrate PostgreSQL 16 container with health checks, persistent volumes, and custom networks.
4. **CI/CD Pipeline Setup (`.github/workflows`)**:
   - Maintain `ci.yml` verifying backend compilation, xUnit test execution, and frontend TypeScript build.
   - Maintain `cd.yml` handling Docker container builds, Trivy vulnerability scans, and GHCR publishing.

---

### Phase 2: Patient Portal, Booking Flow & Specialist AI Agent (Member 1)
**Goal:** Implement the complete patient journey from symptom intake to specialist recommendation, doctor booking, and queue tracking.

#### Tasks:
1. **Backend Endpoints (`backend/MediFlow.Api/Controllers`)**:
   - `POST /api/patients/symptoms`: Ingest symptoms and forward to internal AI agent.
   - `GET /api/doctors`: Doctor discovery with multi-parameter filtering (specialty, rating, fee, availability).
   - `POST /api/appointments`: Draft appointment creation with `PENDING_PAYMENT` state.
   - `POST /api/appointments/{id}/pay`: Card payment simulation and bank slip receipt upload.
   - `GET /api/appointments/my`: Patient appointment history and active queue status.
2. **Specialist & Doctor Recommendation Agent (`ai/agents/specialist_recommender.py`)**:
   - Implement LangGraph state graph with Emergency Red-Flag detection.
   - Construct clinical NLP entity extractor mapping patient complaints to medical specialties.
   - Implement multi-factor doctor ranking algorithm combining rating, distance, availability, and fee.
   - Add safe fallback to General Practice when symptom confidence is below 60%.
3. **Frontend Patient UI (`web/mediflow-web/src/pages/patient`)**:
   - Symptom consultation page with interactive pain scale, duration selectors, and anatomical body map.
   - Recommendation results view displaying recommended specialty badges, doctor cards, and reasoning text.
   - Appointment booking modal with slot selection and payment submission.
   - Live queue status card displaying current serving token and estimated consultation time.

---

### Phase 3: Receptionist Portal & Live Queue Verification (Member 1)
**Goal:** Equip clinic staff with operational tools to verify payments, issue sequenced tokens, and manage patient flow.

#### Tasks:
1. **Backend Endpoints (`backend/MediFlow.Api/Controllers/ReceptionistController.cs`)**:
   - `GET /api/receptionist/appointments/pending`: Query bookings requiring payment verification.
   - `POST /api/receptionist/appointments/{id}/verify`: Verify payment and assign daily sequence token (`APP-YYYY-XXXX`).
   - `POST /api/receptionist/appointments/walk-in`: Fast-track registration and scheduling for walk-in patients.
   - `PATCH /api/receptionist/appointments/{id}/reschedule`: Update appointment slot with notification hook.
   - `PATCH /api/receptionist/appointments/{id}/cancel`: Cancel booking with mandatory reason auditing.
2. **Frontend Receptionist UI (`web/mediflow-web/src/pages/receptionist`)**:
   - Live verification workspace with split-screen slip preview and one-click **Verify & Issue Token** action.
   - Interactive clinic queue monitor showing room occupancy, doctor active states, and patient waiting lists.
   - Walk-in booking modal enabling rapid patient registration and immediate slot allocation.

---

### Phase 4: Admin Portal, Telemetry & Role Management (Member 1)
**Goal:** Deliver enterprise administrative controls, audit compliance, and real-time AI telemetry.

#### Tasks:
1. **Backend Endpoints (`backend/MediFlow.Api/Controllers/AdminController.cs`)**:
   - `GET /api/admin/dashboard/stats`: System KPIs (total users, daily appointments, revenue, active agents).
   - `GET /api/admin/users`: Paginated user directory with role filtering, status toggles, and credential resets.
   - `POST /api/admin/specialties`: Provision and manage clinic specialties and consultation room bindings.
   - `GET /api/admin/audit-logs`: Query security audit logs with timestamp, user, and action filters.
   - `GET /api/admin/agent-telemetry`: Monitor AI response latency, fallback rates, and error logs.
2. **Frontend Admin UI (`web/mediflow-web/src/pages/admin`)**:
   - Executive dashboard featuring KPI stat cards, appointment volume charts, and system status pills.
   - User management table with inline role assignment, activation toggles, and search filters.
   - Specialty configuration manager with modal forms for adding new medical departments.
   - Security audit explorer with JSON detail viewers for compliance tracking.

---

### Phase 5: Doctor Portal & Clinical Decision Support Agent (Member 2)
**Goal:** Enable doctors to conduct consultations, examine EHRs, leverage AI diagnostic support, and initiate e-prescriptions.

#### Tasks:
1. **Backend Endpoints (`backend/MediFlow.Api/Controllers/ConsultationsController.cs`)**:
   - `GET /api/doctors/appointments`: Retrieve verified patient queue filtered by the authenticated doctor's ID.
   - `POST /api/consultations`: Start consultation session and bind clinical records.
   - `POST /api/consultations/{id}/vitals`: Capture physiological vitals (BP, HR, Temp, SpO2, Blood Glucose).
   - `POST /api/consultations/{id}/clinical-analysis`: Trigger AI Clinical Decision Support Agent.
   - `POST /api/consultations/{id}/diagnosis-decision`: Log doctor's `ACCEPT`, `MODIFY`, or `REJECT` decision.
2. **Clinical Decision Support Agent (`ai/agents/clinical_decision_support.py`)**:
   - Synthesize patient vitals, symptoms, and medical history to generate differential diagnoses with ICD-10 codes.
   - Detect physiological warning thresholds (e.g. hypertensive crisis, acute infection signals).
3. **Frontend Doctor UI (`web/mediflow-web/src/pages/doctor`)**:
   - Consultation room interface with patient EHR summary, vitals recording form, and clinical note editor.
   - CDSS suggestion drawer presenting differential diagnoses with confidence scores and literature citations.
   - Doctor decision review buttons (`Accept`, `Modify`, `Reject`) ensuring strict Human-in-the-Loop oversight.

---

### Phase 6: Pharmacist Portal & Medication Intelligence Agent (Member 3)
**Goal:** Enable pharmacists to receive digital prescriptions, run automated drug interaction checks, calculate billing, and manage dispensing.

#### Tasks:
1. **Backend Endpoints (`backend/MediFlow.Api/Controllers/PrescriptionsController.cs` & `OrdersController.cs`)**:
   - `POST /api/prescriptions`: Doctor issues and digitally signs official e-prescription.
   - `GET /api/pharmacist/prescriptions/inbox`: Query unfulfilled e-prescriptions.
   - `POST /api/prescriptions/{id}/screen-interactions`: Run Medication Intelligence Agent on prescribed items.
   - `POST /api/orders/from-prescription/{rxId}`: Convert verified prescription into order with auto-pricing.
   - `PATCH /api/orders/{id}/dispense-status`: Transition order status (`PENDING` → `IN_PROGRESS` → `DISPENSED`).
2. **Medication Intelligence Agent (`ai/agents/medication_intelligence.py`)**:
   - Cross-check prescribed drug combinations for Drug-Drug Interactions (Major, Moderate, Minor).
   - Verify patient allergy contraindications and flags abnormal pediatric/geriatric dosage limits.
   - Recommend bioequivalent generic alternatives when a prescribed brand is unavailable.
3. **Frontend Pharmacist UI (`web/mediflow-web/src/pages/pharmacist`)**:
   - Incoming digital prescription feed with real-time badges.
   - Interaction analysis panel highlighting warnings in red/yellow with pharmacological explanations.
   - Automated billing breakdown calculating subtotal, taxes, and final payable amount.
   - Dispensing completion workflow triggering inventory deduction.

---

### Phase 7: Pharmacy Owner Portal, Multi-Batch Expiry & Supplier Restocking (Member 4)
**Goal:** Deliver inventory oversight, real-world multi-batch expiration date tracking, predictive demand forecasting, and supplier fulfillment.

#### Tasks:
1. **Backend Endpoints (`backend/MediFlow.Api/Controllers/InventoryController.cs` & `SuppliersController.cs`)**:
   - `GET /api/inventory`: Inventory catalog with stock levels, category filters, and reorder levels.
   - `POST /api/inventory/{id}/batches`: Add new batch with `BatchNumber`, `Quantity`, and `ExpiryDate`.
   - `PUT /api/inventory/{id}/batches/{batchId}/expiry`: Update batch expiry date via date picker.
   - `GET /api/inventory/expiry-alerts`: Classify batches (`Expired`, `Critical`, `ExpiringSoon`, `Good`).
   - `POST /api/restock-requests`: Generate restock purchase order.
   - `PATCH /api/suppliers/orders/{id}/status`: Supplier accepts, fulfills, or rejects restock order.
2. **Pharmacy & Inventory Intelligence Agent (`ai/agents/inventory_intelligence.py`)**:
   - Calculate historical dispensing consumption rates and seasonal velocity trends.
   - Compute dynamic safety stock thresholds and recommend optimal restock batch quantities.
3. **Frontend Portals (`web/mediflow-web/src/pages/pharmacyowner` & `supplier`)**:
   - Pharmacy Owner Dashboard with interactive batch management modal, date pickers, and expandable breakdown.
   - Visual stock health progress bars and threshold status badges (`Critical`, `Expiring Soon`, `Good`).
   - Supplier Portal featuring incoming purchase request review, catalog price management, and shipment updates.

---

### Phase 8: System Verification, Testing & DevSecOps Hardening (Member 1 Lead)
**Goal:** Validate all components, guarantee 100% test pass rates, execute cross-platform smoke tests, and prepare evaluation artifacts.

#### Verification Activities:
1. **Automated Unit Testing**:
   - Run complete xUnit test suite (`dotnet test tests/MediFlow.Tests`).
   - Confirm all 27 unit tests pass with zero regressions.
2. **Automated Frontend Build & Typecheck**:
   - Run `npm run build` in `web/mediflow-web` verifying strict TypeScript compilation and asset bundling.
3. **Container Orchestration Verification**:
   - Execute `docker-compose up --build` verifying backend, frontend, database, and AI service health probes.
4. **End-to-End Simulation**:
   - Execute the 5-phase live demonstration script verifying end-to-end data flow and Human-in-the-Loop decision points.

---

## Verification Plan

### Automated Tests
1. **Backend Unit & Service Tests**:
   ```bash
   dotnet test tests/MediFlow.Tests/MediFlow.Tests.csproj
   ```
   *Expected Result: 27/27 tests passed, 0 failed, 0 skipped.*

2. **Frontend Production Compilation**:
   ```bash
   cd web/mediflow-web && npm run build
   ```
   *Expected Result: TypeScript typecheck passes and Vite builds production bundles with 0 errors.*

3. **Git Branch & Repository Hygiene**:
   ```bash
   git status && git log -n 5 --oneline
   ```
   *Expected Result: Clean branch state on `feature/member1-patient-portal-management-and-specialist-recommendation`.*

### Manual Verification
- Verify that `MediFlowAI_4_Member_Project_Division.md` renders seamlessly in GitHub and local markdown viewers.
- Verify that the sequence diagrams, ER diagrams, and LaTeX formulas format cleanly without rendering bugs.
- Verify that each team member's domain, endpoints, database entities, and agentic AI models are clearly demarcated.
