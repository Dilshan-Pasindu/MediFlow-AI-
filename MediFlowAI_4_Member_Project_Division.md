# MediFlow AI — 4-Member Project Division

## Project Overview

**MediFlow AI — Intelligent Pharmacy & Medication Management System**

A full-stack production-style application where patients upload doctor-issued prescriptions, and an Agentic AI workflow extracts medications, verifies them, searches pharmacy inventories, recommends the nearest suitable pharmacy, and awaits pharmacist approval before finalizing.

### Technology Stack

| Layer | Technology |
|---|---|
| Mobile | Flutter / Dart |
| Web | React / React Router |
| Backend API | ASP.NET Core Web API / C# |
| Database | PostgreSQL / EF Core |
| Auth | JWT / Role-based |
| Agentic AI | Agent orchestration framework (LangGraph / MS Agent Framework / Google ADK) |
| Location | Third-party Maps/Location API |
| Docs | Swagger / OpenAPI |
| CI/CD | GitHub Actions |

### Core Principle

> Every member owns a **complete vertical business component** — database tables, API endpoints, UI screens, an AI agent (or orchestrator), tests, and documentation. No member is "just backend" or "just frontend."

---

## 1. System Architecture

```text
┌──────────────────────────────────────────────────────┐
│                     MEDIFLOW AI                      │
├──────────────┬───────────────┬────────────────────────┤
│   Flutter    │    React      │     Agentic AI         │
│  (Patient)   │ (Staff/Admin) │     Subsystem          │
├──────────────┴───────────────┴────────────────────────┤
│                  ASP.NET Core Web API                 │
│              (JWT Auth · Role-Based Access)           │
├───────────────────────────────────────────────────────┤
│                     PostgreSQL                        │
├───────────────────────────────────────────────────────┤
│               External APIs (Maps/Location)           │
└───────────────────────────────────────────────────────┘
```

### Four Business Components

```text
┌─────────────────────────────────────────────────────────────────┐
│                        MEDIFLOW AI                              │
├─────────────────────────────────────────────────────────────────┤
│  Member 1 → Patient & Prescription Management                  │
│  Member 2 → Medication & Inventory Management                  │
│  Member 3 → Pharmacy Fulfillment & Pharmacist Approval         │
│  Member 4 → Pharmacy Location, Recommendation & AI Monitoring  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. User Role → Member Mapping

Each user role has a **primary owner** who implements the majority of that role's functionality.

| User Role | Primary Owner | UI Platform | Key Permissions |
|---|---|---|---|
| Patient | Member 1 | Flutter | Upload prescriptions, view recommendations, track status |
| Pharmacist | Member 3 | React | Review AI results, approve/reject/revise workflows |
| Pharmacy Admin | Member 2 + Member 4 | React | Manage medicines, inventory, pharmacies, users, reports |
| Supplier | Member 2 | React | View supply requests, update supply status |

> **Note:** Pharmacy Admin functionality is shared — Member 2 handles medicine/inventory/supplier admin, Member 4 handles pharmacy management and AI monitoring.

---

## 3. Member 1 — Patient & Prescription Management

### Business Focus

Everything related to the **patient** and their **prescription lifecycle** — from registration through upload to viewing the final recommendation.

### Database Entities Owned

| Entity | Purpose |
|---|---|
| `Users` (Patient subset) | Patient user accounts |
| `Patients` | Patient profiles (contact, location, medical info) |
| `Prescriptions` | Uploaded prescription records (image URL, status, timestamps) |
| `PrescriptionItems` | Individual line items extracted from a prescription |
| `MedicationRequests` | Patient's request to fulfill a prescription |
| `Notifications` | Patient notifications and status updates |

### API Endpoints

```text
POST   /api/auth/register          # Patient registration
POST   /api/auth/login              # Login (shared, but Member 1 implements)

POST   /api/patients                # Create patient profile
GET    /api/patients/{id}           # Get patient details
PUT    /api/patients/{id}           # Update patient profile

POST   /api/prescriptions           # Upload prescription (image/PDF)
GET    /api/prescriptions/{id}      # Get prescription details
GET    /api/prescriptions/my        # Get current patient's prescriptions
PUT    /api/prescriptions/{id}      # Update prescription
DELETE /api/prescriptions/{id}      # Cancel/delete prescription

POST   /api/medication-requests     # Submit prescription for AI processing
GET    /api/medication-requests/my  # Get patient's requests
GET    /api/medication-requests/{id} # Get request details + status

GET    /api/notifications/my        # Get patient notifications
PUT    /api/notifications/{id}/read # Mark notification as read
```

### Flutter Screens (Primary Owner)

```text
Splash Screen
    ↓
Login / Register
    ↓
Patient Home Dashboard
    ├── Upload Prescription (Camera / Image Picker)
    ├── Prescription List (My Prescriptions)
    ├── Prescription Details
    │       └── Extracted Medications View
    ├── Submit Medication Request
    ├── AI Processing Status (real-time tracking)
    ├── Available Pharmacies List
    ├── Nearest Pharmacy Recommendation
    ├── Map / Location View
    ├── Request History
    ├── Notifications
    ├── Profile Management
    └── Settings
```

### Device Feature

- **Camera** — capture a photo of a doctor-issued prescription
- **Image Picker** — select an existing prescription image from gallery

### AI Agent — Prescription Extraction Agent

**Purpose:** Extract structured medication data from the uploaded prescription image/PDF.

**Input:** Prescription image or PDF file

**Output:**

```json
{
  "prescriptionId": 123,
  "extractionConfidence": 0.92,
  "medications": [
    {
      "name": "Amoxicillin",
      "strength": "500mg",
      "quantity": 20,
      "dosageInstructions": "1 tablet 3 times daily"
    },
    {
      "name": "Paracetamol",
      "strength": "500mg",
      "quantity": 10,
      "dosageInstructions": "As needed for pain"
    }
  ]
}
```

**Tools Used:**

| Tool | Purpose |
|---|---|
| `extract_prescription()` | OCR / document extraction from image/PDF |
| `parse_prescription_structure()` | Parse raw OCR text into structured medication JSON |

**Safety Rules:**

- Must NOT invent missing medication information
- Must NOT guess medication names or strengths
- If confidence < threshold → set status to `EXTRACTION_REQUIRES_REVIEW`
- If image is unreadable → safe failure with message: *"Please upload a clearer image"*

### Testing Responsibilities

- Unit tests for patient/prescription services
- API integration tests for patient endpoints
- Flutter widget tests for patient screens
- Flutter form validation tests
- Prescription upload integration test
- Extraction Agent tests (valid input, unclear image, missing data, agent failure)

### Feature Branches

```text
feature/authentication
feature/patient-management
feature/prescription-management
feature/prescription-upload
feature/agent-extraction
feature/flutter-patient-screens
feature/flutter-auth
```

### Deliverables Summary

- [ ] Patient database tables + EF Core migrations
- [ ] Authentication system (JWT, password hashing, login/register endpoints)
- [ ] Patient & Prescription REST APIs
- [ ] Flutter patient app (all screens listed above)
- [ ] Camera/image picker integration
- [ ] Prescription Extraction Agent with OCR tool
- [ ] Unit + integration + widget tests
- [ ] API documentation (Swagger)
- [ ] Component documentation

---

## 4. Member 2 — Medication & Inventory Management

### Business Focus

Everything related to **medicines, categories, pharmacy stock/inventory, and suppliers**. This member ensures the system has accurate medication data and real-time inventory information.

### Database Entities Owned

| Entity | Purpose |
|---|---|
| `Medicines` | Master medicine records (name, generic name, strength, form, description) |
| `MedicineCategories` | Categories/classifications for medicines |
| `Inventory` / `PharmacyInventory` | Stock levels per pharmacy per medicine (quantity, expiry, batch) |
| `Suppliers` | Supplier company records |
| `SupplierMedicines` | Which suppliers provide which medicines |
| `MedicationHistory` | Historical medication dispensing records |

### API Endpoints

```text
GET    /api/medicines               # List medicines (search, filter, sort, paginate)
GET    /api/medicines/{id}          # Get medicine details
POST   /api/medicines               # Add new medicine
PUT    /api/medicines/{id}          # Update medicine
DELETE /api/medicines/{id}          # Remove medicine

GET    /api/medicine-categories     # List categories
POST   /api/medicine-categories     # Create category
PUT    /api/medicine-categories/{id} # Update category

GET    /api/inventory               # List inventory (filter by pharmacy, medicine, stock level)
GET    /api/inventory/{id}          # Get specific inventory record
POST   /api/inventory               # Add inventory entry
PUT    /api/inventory/{id}          # Update stock
GET    /api/inventory/low-stock     # Get low-stock items
GET    /api/inventory/expiring      # Get expiring/expired items

GET    /api/suppliers               # List suppliers
GET    /api/suppliers/{id}          # Supplier details
POST   /api/suppliers               # Add supplier
PUT    /api/suppliers/{id}          # Update supplier

POST   /api/inventory/check-availability  # Check medicine availability across pharmacies
```

### React Screens (Primary Owner)

```text
Medicine Management
    ├── Medicine List (search, filter, sort, paginate)
    ├── Add Medicine Form (with validation)
    ├── Edit Medicine Form
    ├── Medicine Details
    └── Medicine Categories

Inventory Management
    ├── Stock Overview Dashboard
    ├── Inventory List (filter by pharmacy, category)
    ├── Update Stock
    ├── Low Stock Alerts
    ├── Expiring / Expired Medicines
    └── Stock History

Supplier Management
    ├── Supplier List
    ├── Add / Edit Supplier
    ├── Supplier Details
    └── Supplied Medicines
```

### Required React Features

- Search with debounce
- Multi-criteria filtering (category, pharmacy, stock level, expiry)
- Column sorting
- Server-side pagination
- Form validation (required fields, valid ranges, duplicate checks)
- Loading states and error handling
- Reusable table/list components

### AI Agent — Medication Verification Agent

**Purpose:** Verify extracted medication data against the PostgreSQL medicine database using controlled tools.

**Input:** Structured medication list from the Extraction Agent

**Verification Checks:**

```text
For each extracted medication:
  ✓ Medicine name exists in database
  ✓ Medicine strength exists and matches
  ✓ Required fields are present (name, strength, quantity)
  ✓ Quantity is within valid range
  ✓ No duplicate medications in the same prescription
  ✓ Prescription structure is valid
  ✓ Medication is not discontinued/banned
```

**Output Example:**

```json
{
  "verificationStatus": "VERIFIED",
  "medications": [
    {
      "name": "Amoxicillin",
      "strength": "500mg",
      "quantity": 20,
      "medicineId": 45,
      "exists": true,
      "strengthValid": true,
      "quantityValid": true,
      "status": "VERIFIED"
    }
  ],
  "issues": []
}
```

**Tools Used:**

| Tool | Purpose |
|---|---|
| `search_medication()` | Look up medicine by name in the database |
| `validate_medication()` | Validate strength, quantity, and status |
| `check_pharmacy_inventory()` | Search pharmacy inventory for availability |

**Safety Rules:**

- Must NOT independently change the doctor's prescription
- Must NOT substitute medications
- If medicine not found → status `VERIFICATION_REQUIRES_REVIEW`
- If any check fails → flag for pharmacist review, do NOT auto-correct

### Inventory Search Tool (Controlled Tool)

Member 2 owns the `check_pharmacy_inventory()` tool used by the Inventory & Availability step.

```text
Input:  List of medications with required quantities
Output: Per-pharmacy availability matrix

Example:
┌─────────────────────┬──────────────────┬──────────┬────────────┐
│ Pharmacy            │ Medicine         │ Required │ Available  │
├─────────────────────┼──────────────────┼──────────┼────────────┤
│ ABC Pharmacy        │ Amoxicillin 500mg│ 20       │ 30 ✓       │
│ ABC Pharmacy        │ Paracetamol 500mg│ 10       │ 20 ✓       │
│ HealthPlus Pharmacy │ Amoxicillin 500mg│ 20       │  0 ✗       │
│ HealthPlus Pharmacy │ Paracetamol 500mg│ 10       │ 20 ✓       │
│ City Pharmacy       │ Amoxicillin 500mg│ 20       │ 25 ✓       │
│ City Pharmacy       │ Paracetamol 500mg│ 10       │  0 ✗       │
└─────────────────────┴──────────────────┴──────────┴────────────┘

Summary:
  ABC Pharmacy       → FULL AVAILABILITY
  HealthPlus Pharmacy → PARTIAL AVAILABILITY (1/2)
  City Pharmacy       → PARTIAL AVAILABILITY (1/2)
```

### Testing Responsibilities

- Unit tests for medicine/inventory/supplier services
- API integration tests for all CRUD endpoints
- React component tests for medicine/inventory forms and lists
- Form validation tests
- Verification Agent tests (valid meds, unknown meds, invalid strength, missing data)
- Inventory tool tests (full, partial, no availability scenarios)

### Feature Branches

```text
feature/medicine-management
feature/inventory-management
feature/supplier-management
feature/agent-verification
feature/inventory-tool
feature/react-medicine-screens
feature/react-inventory-screens
```

### Deliverables Summary

- [ ] Medicine, Category, Inventory, Supplier database tables + migrations
- [ ] Medicine, Inventory, Supplier REST APIs (with search/filter/sort/paginate)
- [ ] React medicine management screens
- [ ] React inventory management screens
- [ ] React supplier management screens
- [ ] Medication Verification Agent
- [ ] `check_pharmacy_inventory()` controlled tool
- [ ] Seed data (sample medicines, categories, suppliers, inventory)
- [ ] Unit + integration + component tests
- [ ] API documentation (Swagger)
- [ ] Component documentation

---

## 5. Member 3 — Pharmacy Fulfillment & Pharmacist Approval

### Business Focus

This is the **workflow engine** of the entire system. Member 3 owns the fulfillment lifecycle, the pharmacist approval workflow, the Agentic AI orchestrator/planner, and the pharmacist dashboard. This component ties all other members' work together.

### Database Entities Owned

| Entity | Purpose |
|---|---|
| `MedicationRequests` (status management) | Request lifecycle and status transitions |
| `Orders` | Fulfillment orders created after approval |
| `OrderItems` | Individual medicines in an order |
| `DispensingRecords` | Records of actual medicine dispensing |
| `ApprovalRequests` | Pharmacist approval/rejection records |
| `AIWorkflows` | Agentic workflow state and plan persistence |
| `AIAgentExecutions` | Per-agent execution records within a workflow |
| `AIToolCalls` | Individual tool call logs |
| `ValidationResults` | Deterministic validation check results |

> **Note:** Member 3 co-owns `AIWorkflows`, `AIAgentExecutions`, `AIToolCalls`, and `ValidationResults` with Member 4. Member 3 focuses on the **write/state-management** side; Member 4 focuses on the **read/monitoring** side.

### API Endpoints

```text
# Request Management
GET    /api/requests/pending            # List pending requests
GET    /api/requests/processing         # List in-progress requests
GET    /api/requests/{id}               # Get full request details + AI results

# Pharmacist Actions
POST   /api/requests/{id}/approve       # Approve recommendation
POST   /api/requests/{id}/reject        # Reject with reason
POST   /api/requests/{id}/revision      # Request revision with reason

# Order / Fulfillment
POST   /api/orders                      # Create order from approved request
GET    /api/orders/{id}                 # Get order details
PUT    /api/orders/{id}/status          # Update order status (READY, COMPLETED)
GET    /api/orders                      # List orders (filter by status)

# Dispensing
POST   /api/dispensing                  # Record dispensing
GET    /api/dispensing/{orderId}        # Get dispensing records for an order

# AI Workflow State
POST   /api/ai/workflows                # Create new AI workflow
PUT    /api/ai/workflows/{id}/state     # Update workflow state
GET    /api/ai/workflows/{id}/state     # Get current workflow state
```

### Request Status State Machine

```text
                    ┌──────────┐
                    │ PENDING  │
                    └────┬─────┘
                         │ AI workflow starts
                    ┌────▼──────────┐
                    │  PROCESSING   │
                    └────┬──────────┘
                         │ All agents complete + validation passes
               ┌─────────▼───────────┐
               │ AWAITING_APPROVAL   │
               └──┬──────┬───────┬───┘
       Approve    │      │       │   Revision
          ┌───────▼─┐    │    ┌──▼──────────────┐
          │APPROVED │    │    │REVISION_REQUIRED │
          └───┬─────┘    │    └─────────────────┘
              │          │ Reject
         ┌────▼──┐  ┌────▼────┐
         │ READY │  │REJECTED │
         └───┬───┘  └─────────┘
             │ Dispensed
        ┌────▼─────┐
        │COMPLETED │
        └──────────┘

    (Any stage can → FAILED on error)
```

### React Screens (Primary Owner) — Pharmacist Dashboard

```text
Pharmacist Dashboard
    ├── Dashboard Home (counts: pending, processing, approved today)
    ├── Pending Requests Queue
    │       └── Request Detail View
    │           ├── Patient Information
    │           ├── Prescription Image
    │           ├── Extracted Medications (from Agent 1)
    │           ├── Verification Results (from Agent 2)
    │           ├── Inventory Availability (from Agent 2 tool)
    │           ├── Pharmacy Recommendation (from Agent 4)
    │           ├── Distance & Map
    │           ├── AI Validation Results
    │           ├── AI Reasoning Summary
    │           └── Action Buttons: [APPROVE] [REJECT] [REQUEST REVISION]
    ├── Approved Requests
    ├── Rejected Requests
    ├── Orders & Fulfillment
    │       ├── Order List
    │       ├── Order Details
    │       └── Update Dispensing Status
    └── My Approval History
```

### Agentic AI — Workflow Orchestrator / Planner

**Purpose:** Coordinate all four agents in sequence, maintain workflow state, enforce validation, and manage the human approval checkpoint.

**Orchestration Flow:**

```text
Step 1: Receive prescription submission
    ↓
Step 2: Create workflow plan
    ↓
Step 3: Delegate → Prescription Extraction Agent (Member 1)
    ↓  (if extraction fails → SAFE FAILURE)
Step 4: Delegate → Medication Verification Agent (Member 2)
    ↓  (if verification fails → REQUIRES_REVIEW)
Step 5: Invoke → Inventory Search Tool (Member 2)
    ↓  (if no pharmacy has all meds → report partial results)
Step 6: Delegate → Pharmacy Location & Recommendation Agent (Member 4)
    ↓  (if maps API fails → return availability without distance)
Step 7: Run Deterministic Validation
    ↓  (if validation fails → SAFE FAILURE)
Step 8: Pause → AWAITING_PHARMACIST_APPROVAL
    ↓
Step 9: Pharmacist action (approve / reject / revise)
    ↓
Step 10: Persist final result + Notify patient
```

**Workflow State (persisted in PostgreSQL):**

```json
{
  "workflowId": "WF-1024",
  "objective": "Find a suitable pharmacy for prescription #123",
  "status": "AWAITING_HUMAN_APPROVAL",
  "createdAt": "2026-08-16T10:30:00Z",
  "updatedAt": "2026-08-16T10:32:15Z",
  "plan": [
    "Extract prescription",
    "Verify medications",
    "Check pharmacy inventory",
    "Find nearby pharmacies",
    "Validate recommendation",
    "Request pharmacist approval"
  ],
  "completedSteps": [
    "prescription_extraction",
    "medication_verification",
    "inventory_search",
    "location_search",
    "validation"
  ],
  "currentStep": "pharmacist_approval",
  "agentResults": {
    "extraction": { "status": "SUCCESS", "medicationCount": 2 },
    "verification": { "status": "VERIFIED", "allValid": true },
    "inventory": { "status": "FOUND", "fullyAvailablePharmacies": 1 },
    "location": { "status": "SUCCESS", "recommendedPharmacy": "ABC Pharmacy" }
  },
  "validationResult": { "status": "PASSED", "checks": 10, "passed": 10 },
  "approval": { "status": "PENDING", "approver": null },
  "failureReason": null
}
```

### Deterministic Validation (Post-Agent)

Run these checks **after** all agents complete, **before** requesting approval:

```text
 ✓ Prescription extraction completed successfully
 ✓ All medications exist in the database
 ✓ All medication strengths are valid
 ✓ All quantities are within valid range
 ✓ At least one pharmacy has required medicines
 ✓ Recommended pharmacy is active (not suspended/closed)
 ✓ Pharmacy location data is valid
 ✓ Distance calculation succeeded (or gracefully degraded)
 ✓ Recommendation follows business rules
 ✓ No conflicting previous approvals exist
```

If **any** check fails → `SAFE FAILURE` — record reason, do not proceed to approval.

### Human-in-the-Loop Protocol

```text
AI Recommendation
       ↓
Deterministic Validation Passed
       ↓
Status → AWAITING_PHARMACIST_APPROVAL
       ↓
Pharmacist sees full context:
  • Patient info
  • Prescription image
  • Extracted medicines
  • Verification results
  • Inventory availability
  • Recommended pharmacy + distance
  • AI reasoning summary
  • Validation results
       ↓
Pharmacist action:
  [ APPROVE ]  → Proceed to fulfillment
  [ REJECT ]   → Record reason, notify patient
  [ REVISION ] → Record reason, loop back

Audit record captured:
  • Approver ID + role
  • Timestamp
  • Decision + reason
  • Workflow ID
```

### Testing Responsibilities

- Unit tests for fulfillment/approval services
- API tests for approve/reject/revise endpoints
- React component tests for pharmacist dashboard
- Orchestrator tests (happy path, agent failure, validation failure, safe failure)
- Human approval workflow tests
- End-to-end workflow test (Flutter → API → Agents → Validation → React → Approval → Flutter)

### Feature Branches

```text
feature/fulfillment-management
feature/approval-workflow
feature/agent-orchestrator
feature/pharmacist-dashboard
feature/deterministic-validation
feature/order-management
feature/dispensing
```

### Deliverables Summary

- [ ] Request, Order, Dispensing, Approval database tables + migrations
- [ ] AI Workflow state tables + migrations (co-owned with Member 4)
- [ ] Fulfillment & Approval REST APIs
- [ ] Order & Dispensing REST APIs
- [ ] React pharmacist dashboard (all screens listed above)
- [ ] Agentic AI orchestrator / planner
- [ ] Deterministic validation engine
- [ ] Human-in-the-loop approval flow
- [ ] Workflow state persistence
- [ ] Unit + integration + component + E2E tests
- [ ] API documentation (Swagger)
- [ ] Component documentation

---

## 6. Member 4 — Pharmacy Location, Recommendation & AI Monitoring

### Business Focus

Everything related to **pharmacy management, location/maps, distance-based recommendation, AI workflow monitoring, execution history, and audit logs**.

### Database Entities Owned

| Entity | Purpose |
|---|---|
| `Pharmacies` | Pharmacy records (name, address, phone, status, hours) |
| `PharmacyLocations` | GPS coordinates and address for each pharmacy |
| `AuditLogs` | System-wide audit trail |
| `AIWorkflows` (read/monitoring) | Workflow monitoring views |
| `AIAgentExecutions` (read/monitoring) | Agent execution history views |
| `AIToolCalls` (read/monitoring) | Tool call history views |
| `ValidationResults` (read/monitoring) | Validation result views |

> **Note:** Member 4 co-owns AI observability tables with Member 3. Member 4 focuses on the **read/monitoring/dashboard** side; Member 3 focuses on **write/state-management** during orchestration.

### API Endpoints

```text
# Pharmacy Management
GET    /api/pharmacies                  # List pharmacies
GET    /api/pharmacies/{id}             # Pharmacy details
POST   /api/pharmacies                  # Add pharmacy
PUT    /api/pharmacies/{id}             # Update pharmacy
DELETE /api/pharmacies/{id}             # Deactivate pharmacy

# Location & Discovery
GET    /api/pharmacies/nearby           # Find nearby pharmacies (lat, lng, radius)
GET    /api/pharmacies/{id}/distance    # Calculate distance from patient
GET    /api/pharmacies/available        # Pharmacies with specific medicines available

# AI Monitoring & History
GET    /api/ai/workflows                # List all workflows (filter, sort, paginate)
GET    /api/ai/workflows/{id}           # Full workflow details + timeline
GET    /api/ai/workflows/{id}/executions # Agent executions for a workflow
GET    /api/ai/workflows/{id}/tool-calls # Tool calls for a workflow
GET    /api/ai/workflows/{id}/validation # Validation results for a workflow

# Audit Logs
GET    /api/audit-logs                  # List audit logs (filter by user, action, date)
GET    /api/audit-logs/{id}             # Audit log details

# Reports
GET    /api/reports/pharmacy-availability # Pharmacy availability report
GET    /api/reports/workflow-summary      # AI workflow summary stats
```

### AI Agent — Pharmacy Location & Recommendation Agent

**Purpose:** Given a list of pharmacies with full medicine availability, calculate distances from the patient's location and rank/recommend the best option.

**Input:**

```json
{
  "patientLocation": { "lat": 6.9271, "lng": 79.8612 },
  "availablePharmacies": [
    { "pharmacyId": 1, "name": "ABC Pharmacy", "availability": "FULL" },
    { "pharmacyId": 3, "name": "HealthPlus Pharmacy", "availability": "FULL" },
    { "pharmacyId": 5, "name": "City Pharmacy", "availability": "FULL" }
  ]
}
```

**Output:**

```json
{
  "recommendation": {
    "pharmacyId": 1,
    "name": "ABC Pharmacy",
    "distance": "1.2 km",
    "availability": "FULL",
    "address": "123 Main Street, Colombo",
    "coordinates": { "lat": 6.9285, "lng": 79.8610 }
  },
  "alternatives": [
    {
      "pharmacyId": 3,
      "name": "HealthPlus Pharmacy",
      "distance": "2.8 km",
      "availability": "FULL"
    },
    {
      "pharmacyId": 5,
      "name": "City Pharmacy",
      "distance": "4.5 km",
      "availability": "FULL"
    }
  ]
}
```

**Tools Used:**

| Tool | Purpose |
|---|---|
| `get_pharmacy_location()` | Retrieve pharmacy GPS coordinates |
| `calculate_distance()` | Calculate distance between patient and pharmacy |
| `find_nearby_pharmacies()` | Discover pharmacies within a radius |

**Safety Rules:**

- Must base recommendations on **actual tool/database results** only
- If Maps API fails → return availability results without distance, flag `DISTANCE_UNAVAILABLE`
- If no pharmacy has all medicines → report partial availability, do NOT auto-substitute

### Third-Party Maps/Location API Integration

Member 4 owns the third-party integration (e.g., Google Maps API, Mapbox, OpenStreetMap/Nominatim).

**Use cases:**

| Feature | Description |
|---|---|
| Patient location | Capture patient GPS coordinates |
| Pharmacy geocoding | Convert pharmacy addresses to coordinates |
| Distance calculation | Calculate road/straight-line distance |
| Nearby discovery | Find pharmacies within a configurable radius |
| Map display | Show pharmacy locations on a map (React + Flutter) |

### React Screens (Primary Owner) — AI Monitoring & Pharmacy Management

```text
AI Monitoring Dashboard
    ├── Workflow List (search, filter by status, sort by date)
    ├── Workflow Detail View
    │       ├── Workflow Timeline / Progress
    │       │       └── Step 1: Planner ✓
    │       │       └── Step 2: Extraction Agent ✓
    │       │       └── Step 3: Verification Agent ✓
    │       │       └── Step 4: Inventory Search ✓
    │       │       └── Step 5: Location Agent ✓
    │       │       └── Step 6: Validation ✓
    │       │       └── Step 7: Pharmacist Approval ✓
    │       ├── Agent Execution Details (input, output, duration)
    │       ├── Tool Call Logs (tool name, input, output, timestamp)
    │       └── Validation Results (each check, pass/fail)
    ├── Execution History (filterable)
    └── Audit Logs (system-wide, filterable)

Pharmacy Management
    ├── Pharmacy List
    ├── Add / Edit Pharmacy
    ├── Pharmacy Details + Location
    ├── Pharmacy Availability View
    └── Pharmacy Map View

Reports
    ├── Pharmacy Availability Report
    ├── Workflow Summary (success rate, avg time, failure reasons)
    └── Analytics Dashboard
```

### Flutter Contribution

Member 4 also contributes to the Flutter app:

- **Map/Location view** — displaying the recommended pharmacy on a map
- **Nearby pharmacies list** with distance
- **Pharmacy detail screen** with map integration

### Testing Responsibilities

- Unit tests for pharmacy/location services
- API tests for pharmacy and AI monitoring endpoints
- React component tests for monitoring dashboard
- Location Agent tests (valid coordinates, API failure, no nearby pharmacies)
- Maps API integration tests (mocking external calls)
- Audit log tests
- Performance tests (API response time, pharmacy search time, agent workflow time)

### Feature Branches

```text
feature/pharmacy-management
feature/pharmacy-location
feature/maps-integration
feature/agent-location-recommendation
feature/ai-monitoring-dashboard
feature/audit-logs
feature/reports
feature/flutter-map-view
```

### Deliverables Summary

- [ ] Pharmacy, PharmacyLocation database tables + migrations
- [ ] AuditLog table + migrations
- [ ] AI monitoring tables (co-owned with Member 3) + migrations
- [ ] Pharmacy REST APIs (CRUD + location + nearby)
- [ ] AI Monitoring REST APIs
- [ ] Audit Log REST APIs
- [ ] Report REST APIs
- [ ] Pharmacy Location & Recommendation Agent
- [ ] Third-party Maps/Location API integration
- [ ] React AI monitoring dashboard (all screens listed above)
- [ ] React pharmacy management screens
- [ ] React reports/analytics
- [ ] Flutter map/location screens
- [ ] Seed data (sample pharmacies with coordinates)
- [ ] Unit + integration + component + performance tests
- [ ] API documentation (Swagger)
- [ ] Component documentation

---

## 7. Agent & Orchestrator Responsibility Summary

| Member | AI Responsibility | Type | Input | Output |
|---|---|---|---|---|
| Member 1 | Prescription Extraction Agent | Agent | Prescription image/PDF | Structured medication JSON |
| Member 2 | Medication Verification Agent + Inventory Tool | Agent + Tool | Medication list | Verification result + availability matrix |
| Member 3 | Workflow Orchestrator / Planner | Orchestrator | Prescription submission | End-to-end workflow coordination |
| Member 4 | Pharmacy Location & Recommendation Agent | Agent | Available pharmacies + patient location | Ranked pharmacy recommendation |

### Why Inventory Search is a Tool, Not a Fifth Agent

The master prompt defines **four** specialized agents. Inventory search is implemented as a **controlled tool** (`check_pharmacy_inventory()`) owned by Member 2. The Verification Agent (Member 2) and the Orchestrator (Member 3) can invoke this tool. This keeps the agent count at four while giving the AI system full inventory access.

---

## 8. Complete End-to-End Workflow with Member Ownership

```text
MEMBER 1                    MEMBER 2                    MEMBER 4                    MEMBER 3
────────                    ────────                    ────────                    ────────
Patient opens
Flutter app
    │
    ▼
Login / Register
    │
    ▼
Upload Prescription
(Camera / Image Picker)
    │
    ▼
POST /api/prescriptions
    │
    ▼
POST /api/medication-requests
    │
    ▼
AI Workflow Created ──────────────────────────────────────────────────────────────► Orchestrator
    │                                                                              starts plan
    ▼                                                                                  │
Extraction Agent                                                                       │
(OCR → structured meds)                                                                │
    │                                                                                  │
    ├──── result ──────► Verification Agent                                            │
                         (check DB for each med)                                       │
                              │                                                        │
                              ├──── result ──────────────────────────────────────────► Orchestrator
                              │                                                     invokes tool
                         Inventory Tool                                                │
                         (check_pharmacy_inventory)                                    │
                              │                                                        │
                              ├──── result ────────► Location Agent                    │
                                                     (calculate distances)             │
                                                     (rank pharmacies)                 │
                                                          │                            │
                                                          ├──── result ──────────────► Orchestrator
                                                                                    validates
                                                                                       │
                                                                                       ▼
                                                                              Deterministic
                                                                              Validation
                                                                                       │
                                                                                       ▼
                                                                              AWAITING_APPROVAL
                                                                                       │
                                                                                       ▼
                                                                              Pharmacist
                                                                              Dashboard (React)
                                                                                       │
                                                                              ┌────────┼────────┐
                                                                              ▼        ▼        ▼
                                                                           APPROVE  REJECT   REVISE
                                                                              │
                                                                              ▼
                                                                           Persist
                                                                           Result
                                                                              │
    ◄────────────────────────────────────────────────────────────────────── Notify
Flutter shows                                                              Patient
recommendation
```

---

## 9. Controlled Tool Registry

All agents access the system through **allow-listed tools only**. No agent has direct database or system access.

| Tool | Owner | Used By | Purpose |
|---|---|---|---|
| `extract_prescription()` | Member 1 | Extraction Agent | OCR/document extraction |
| `parse_prescription_structure()` | Member 1 | Extraction Agent | Parse raw text into structured JSON |
| `search_medication()` | Member 2 | Verification Agent | Look up medicine in database |
| `validate_medication()` | Member 2 | Verification Agent | Validate strength, quantity, status |
| `check_pharmacy_inventory()` | Member 2 | Orchestrator / Verification Agent | Check stock across pharmacies |
| `get_pharmacy_location()` | Member 4 | Location Agent | Retrieve pharmacy coordinates |
| `calculate_distance()` | Member 4 | Location Agent | Distance between two coordinates |
| `find_nearby_pharmacies()` | Member 4 | Location Agent | Discover pharmacies within radius |
| `create_approval_request()` | Member 3 | Orchestrator | Create approval queue entry |
| `record_approval()` | Member 3 | Orchestrator | Record pharmacist decision |
| `update_workflow()` | Member 3 | Orchestrator | Update workflow state |
| `notify_patient()` | Member 1 | Orchestrator | Send notification to patient |

**Every tool must:**
- Validate inputs
- Validate outputs
- Enforce authorization
- Return structured results
- Log execution to `AIToolCalls`
- Handle errors safely (no unhandled exceptions)

---

## 10. Shared Responsibilities

These responsibilities are shared across **all four members**:

### Authentication & Authorization (Led by Member 1)

| Responsibility | Owner |
|---|---|
| JWT generation, validation, middleware | Member 1 (implements) |
| Role-based `[Authorize]` attributes on endpoints | Each member on their own endpoints |
| Protected React routes | Members 2, 3, 4 (on their own pages) |
| Flutter secure token storage | Member 1 |

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

### Security (All Members)

| Rule | Applies To |
|---|---|
| No secrets in Git | All |
| Input validation on all endpoints | All |
| File type/size validation on upload | Member 1 |
| Role-based authorization | All |
| Tool authorization | Members 1, 2, 3, 4 (on their tools) |
| Audit logging for critical actions | Member 4 provides the logging infrastructure; all members call it |
| Safe AI failure | Members 1, 2, 3, 4 |
| No patient data exposure | All |

### CI / GitHub Actions (Led by Member 3 or Member 4)

| Step | Responsibility |
|---|---|
| Workflow file creation (`.github/workflows/ci.yml`) | One member leads, all contribute |
| Backend build + test | Verifies all members' code |
| React build + test | Verifies Members 2, 3, 4 React code |
| Flutter test | Verifies Member 1 Flutter code |
| Secret management | GitHub Secrets, not committed |

### Deployment (Collaborative)

| Component | Owner |
|---|---|
| ASP.NET Core API deployment | Member 3 (as orchestrator owner) or shared |
| PostgreSQL deployment | Shared |
| React deployment | Member 4 (or shared) |
| Flutter APK generation | Member 1 |

---

## 11. Responsibility Matrix

| Area | M1 | M2 | M3 | M4 |
|---|:---:|:---:|:---:|:---:|
| **Backend (DB + API)** | | | | |
| Patient tables & APIs | ⭐ | | | |
| Prescription tables & APIs | ⭐ | | | |
| Authentication (JWT) | ⭐ | | | |
| Medicine tables & APIs | | ⭐ | | |
| Inventory tables & APIs | | ⭐ | | |
| Supplier tables & APIs | | ⭐ | | |
| Fulfillment/Order APIs | | | ⭐ | |
| Approval APIs | | | ⭐ | |
| AI Workflow state (write) | | | ⭐ | |
| Pharmacy tables & APIs | | | | ⭐ |
| Location/Distance APIs | | | | ⭐ |
| AI Monitoring APIs (read) | | | | ⭐ |
| Audit Log APIs | | | | ⭐ |
| Report APIs | | | | ⭐ |
| **Flutter** | | | | |
| Auth screens | ⭐ | | | |
| Patient screens | ⭐ | | | |
| Prescription upload | ⭐ | | | |
| Status tracking | ⭐ | | | |
| Map/location view | | | | ⭐ |
| **React** | | | | |
| Medicine management | | ⭐ | | |
| Inventory management | | ⭐ | | |
| Supplier management | | ⭐ | | |
| Pharmacist dashboard | | | ⭐ | |
| Approval workflow UI | | | ⭐ | |
| AI monitoring dashboard | | | | ⭐ |
| Pharmacy management | | | | ⭐ |
| Reports/analytics | | | | ⭐ |
| **Agentic AI** | | | | |
| Prescription Extraction Agent | ⭐ | | | |
| Medication Verification Agent | | ⭐ | | |
| Inventory Search Tool | | ⭐ | | |
| Workflow Orchestrator / Planner | | | ⭐ | |
| Deterministic Validation | | | ⭐ | |
| Human Approval Flow | | | ⭐ | |
| Location & Recommendation Agent | | | | ⭐ |
| **Cross-Cutting** | | | | |
| Testing | ⭐ | ⭐ | ⭐ | ⭐ |
| Documentation | ⭐ | ⭐ | ⭐ | ⭐ |
| GitHub / CI | ⭐ | ⭐ | ⭐ | ⭐ |
| Swagger (own endpoints) | ⭐ | ⭐ | ⭐ | ⭐ |
| Deployment | ⭐ | ⭐ | ⭐ | ⭐ |

---

## 12. Safe Failure Scenarios

Each member must handle failures gracefully within their component:

| Scenario | Owner | Safe Response |
|---|---|---|
| Prescription image unreadable | Member 1 | `EXTRACTION_FAILED` — "Please upload a clearer image" |
| Medicine not found in database | Member 2 | `VERIFICATION_REQUIRES_REVIEW` — "Pharmacist review required" |
| Invalid strength/quantity | Member 2 | `VERIFICATION_FAILED` — flag specific issues |
| No pharmacy has all medicines | Member 2 | Report partial availability, do not auto-substitute |
| Maps API failure | Member 4 | Return availability without distance: `DISTANCE_UNAVAILABLE` |
| No nearby pharmacies found | Member 4 | Report "No pharmacies within search radius" |
| Agent throws exception | Member 3 | Orchestrator catches, sets `FAILED`, records reason |
| Validation fails | Member 3 | `SAFE_FAILURE` — do NOT proceed to approval |
| Workflow timeout | Member 3 | Set `FAILED` with timeout reason |

---

## 13. Repository Structure

One GitHub repository, one VS Code workspace:

```text
MediFlow-AI/
│
├── backend/
│   └── MediFlow.Api/
│       ├── Controllers/          # API controllers (all members)
│       ├── Models/               # Entity models (all members)
│       ├── DTOs/                 # Request/Response DTOs
│       ├── Services/             # Business logic services
│       ├── Data/
│       │   ├── AppDbContext.cs
│       │   └── Migrations/
│       ├── Auth/                 # JWT, password hashing (Member 1)
│       ├── Middleware/           # Error handling, auth middleware
│       └── Program.cs
│
├── web/
│   └── mediflow-web/             # React app
│       ├── src/
│       │   ├── components/       # Shared components
│       │   ├── pages/            # Page components (Members 2, 3, 4)
│       │   ├── services/         # API service layer
│       │   ├── context/          # Auth & state context
│       │   └── routes/           # Protected routing
│       └── package.json
│
├── mobile/
│   └── mediflow_mobile/          # Flutter app
│       ├── lib/
│       │   ├── screens/          # Screen widgets (Member 1 + Member 4)
│       │   ├── services/         # API services
│       │   ├── models/           # Data models
│       │   ├── providers/        # State management
│       │   └── widgets/          # Reusable widgets
│       └── pubspec.yaml
│
├── ai/
│   └── mediflow_agents/          # Agentic AI subsystem
│       ├── agents/
│       │   ├── extraction_agent.py      # Member 1
│       │   ├── verification_agent.py    # Member 2
│       │   ├── location_agent.py        # Member 4
│       │   └── orchestrator.py          # Member 3
│       ├── tools/
│       │   ├── prescription_tools.py    # Member 1
│       │   ├── medication_tools.py      # Member 2
│       │   ├── inventory_tools.py       # Member 2
│       │   ├── location_tools.py        # Member 4
│       │   └── workflow_tools.py        # Member 3
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

## 14. Git Branching Strategy

### Branch Naming Convention

```text
main                              # Production-ready code
develop                           # Integration branch
feature/<member>-<feature-name>   # Feature branches
```

### Per-Member Branches

| Member | Feature Branches |
|---|---|
| Member 1 | `feature/authentication`, `feature/patient-management`, `feature/prescription-management`, `feature/prescription-upload`, `feature/agent-extraction`, `feature/flutter-patient-screens`, `feature/flutter-auth` |
| Member 2 | `feature/medicine-management`, `feature/inventory-management`, `feature/supplier-management`, `feature/agent-verification`, `feature/inventory-tool`, `feature/react-medicine-screens`, `feature/react-inventory-screens` |
| Member 3 | `feature/fulfillment-management`, `feature/approval-workflow`, `feature/agent-orchestrator`, `feature/pharmacist-dashboard`, `feature/deterministic-validation`, `feature/order-management` |
| Member 4 | `feature/pharmacy-management`, `feature/pharmacy-location`, `feature/maps-integration`, `feature/agent-location-recommendation`, `feature/ai-monitoring-dashboard`, `feature/audit-logs`, `feature/reports` |

### Workflow

1. Create feature branch from `develop`
2. Implement feature with meaningful commits
3. Open Pull Request to `develop`
4. Code review by at least one other member
5. Merge after approval
6. Merge `develop` → `main` for releases

---

## 15. Demo Walkthrough — Member Responsibilities

The final demo follows a specific sequence. Each member leads their portion:

| Demo Step | Lead | What to Show |
|---|---|---|
| 1. Patient login | Member 1 | Flutter login screen |
| 2. Upload prescription | Member 1 | Camera/image picker → upload flow |
| 3. Prescription processing | Member 1 | AI status tracking in Flutter |
| 4. Extraction Agent execution | Member 1 | Agent extracting medicines from image |
| 5. Verification Agent execution | Member 2 | Agent verifying against medicine DB |
| 6. Inventory search | Member 2 | Tool checking pharmacy stock |
| 7. Location Agent execution | Member 4 | Agent calculating distances, ranking |
| 8. PostgreSQL changes | All | Show database state at this point |
| 9. Pharmacist dashboard | Member 3 | React — pending approval queue |
| 10. Review AI results | Member 3 | Full context display for pharmacist |
| 11. Pharmacist approves | Member 3 | Approve action + audit record |
| 12. Database/workflow state change | Member 3 | Show state transition in DB |
| 13. Patient notification | Member 1 | Flutter — recommendation displayed |
| 14. Map view | Member 4 | Flutter/React — pharmacy on map |
| 15. AI monitoring | Member 4 | React — execution history + audit logs |
| 16. Swagger docs | All | Each member shows their endpoints |
| 17. Tests | All | Each member runs their tests |
| 18. GitHub Actions CI | All | Show passing CI pipeline |
| 19. Deployment | All | Show deployed URLs + APK |
| 20. Git history | All | Show branches, PRs, contributions |

---

## 16. Quick Reference — Who Owns What

### Member 1 — "The Patient's Journey"

> *Patient gives us the prescription.*

- Patient registration & profiles
- Prescription upload & management
- Flutter mobile app (primary owner)
- Prescription Extraction Agent
- Patient notifications

### Member 2 — "The Medicine Expert"

> *We understand, verify, and check the medicines.*

- Medicine CRUD & categories
- Inventory management & stock
- Supplier management
- React medicine/inventory screens
- Medication Verification Agent
- Inventory Search Tool

### Member 3 — "The Workflow Controller"

> *The pharmacist reviews, and the system orchestrates.*

- Fulfillment & order lifecycle
- Pharmacist approval workflow
- AI Orchestrator / Planner
- Deterministic validation
- React pharmacist dashboard
- Human-in-the-loop protocol

### Member 4 — "The Pharmacy Finder"

> *We find the best pharmacy and monitor everything.*

- Pharmacy management
- Maps/location integration
- Distance-based recommendation
- AI monitoring & execution history
- Audit logs & reports
- React monitoring dashboard

### Together — One Workflow

```text
Patient (M1) → Prescription (M1) → Extraction (M1)
    → Verification (M2) → Inventory Search (M2)
    → Location & Recommendation (M4)
    → Validation (M3) → Pharmacist Approval (M3)
    → Patient Notification (M1)
```

This forms **one complete MediFlow AI workflow**, not four disconnected projects.

---

## 17. Critical Group Working Rules

### ✅ DO

- Each member owns a **full vertical slice** (DB → API → UI → AI → Tests → Docs)
- All members work in the **same GitHub repository**
- Use **feature branches** and **pull requests** with code review
- Every member must have **visible, meaningful Git contributions**
- Share the `AppDbContext` — register your entities in one shared context
- Communicate when your component's API contract changes
- Write tests for your own components
- Document your own Swagger endpoints

### ❌ DON'T

- Don't divide as: *Member 1 = Backend, Member 2 = React, Member 3 = Flutter, Member 4 = AI*
- Don't commit secrets, API keys, connection strings, or JWT secrets
- Don't create fake/back-filled Git contribution history
- Don't add unnecessary features before the core workflow is stable
- Don't let agents make unsupported medical decisions
- Don't expose stack traces or internal errors to users
