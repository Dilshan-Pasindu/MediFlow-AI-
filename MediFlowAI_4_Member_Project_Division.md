# MediFlow AI — 4-Member Project Component Division

## Project Overview

**MediFlow AI — Intelligent Pharmacy & Medication Management System**

The project is divided into four major business components for a four-member group. All four components remain part of **one project, one GitHub repository, and one VS Code workspace**.

The system uses:

- Flutter — Patient mobile application
- React — Pharmacy staff/admin web application
- ASP.NET Core Web API — Shared backend
- PostgreSQL — Shared database
- Agentic AI — Multi-agent prescription and pharmacy workflow
- Third-party Maps/Location API — Pharmacy location and distance functionality
- JWT authentication and role-based authorization
- Testing, GitHub Actions CI, documentation, and deployment

The four members should not divide the work simply as "backend/frontend/mobile/AI." Instead, each member owns a complete **business component** including database work, API development, UI work, AI/business logic, testing, and documentation.

---

# 1. Overall Architecture

```text
                         MEDIFLOW AI
                              |
             +----------------+----------------+
             |                |                |
             v                v                v
          Flutter           React          Agentic AI
          Patient           Staff/Admin      Workflow
             |                |                |
             +----------------+----------------+
                              |
                       ASP.NET Core API
                              |
                         PostgreSQL
                              |
                     External APIs
                    (Maps / Location)
```

The four major components are:

```text
+---------------------------------------------------------+
|                    MEDIFLOW AI                          |
+---------------------------------------------------------+
|                                                         |
| Member 1 -> Patient & Prescription Management            |
| Member 2 -> Medication & Inventory Management             |
| Member 3 -> Pharmacy Fulfillment & Approval               |
| Member 4 -> Pharmacy Location & AI Monitoring             |
|                                                         |
+---------------------------------------------------------+
```

---

# 2. Member 1 — Patient & Prescription Management

## Main Responsibility

Everything related to the **patient and their prescription**.

## Backend Responsibilities

Develop and maintain:

- Patient
- Prescription
- PrescriptionItem
- MedicationRequest

### Example APIs

```text
POST   /api/patients
GET    /api/patients/{id}
PUT    /api/patients/{id}

POST   /api/prescriptions
GET    /api/prescriptions/{id}
GET    /api/prescriptions/my
```

## Flutter Responsibilities

Member 1 primarily owns the patient mobile workflow:

```text
Login/Register
      |
      v
Patient Dashboard
      |
      v
Upload Prescription
      |
      v
Prescription Details
      |
      v
Medication Request
      |
      v
Request Status
```

### Important Mobile Feature

Use:

- Camera
- Image picker

The patient should be able to take a photo of a doctor-issued prescription or upload an existing prescription image.

## Agent — Prescription Extraction Agent

The Prescription Extraction Agent is responsible for extracting structured medication information from the uploaded prescription.

### Input

- Prescription image/PDF

### Output Example

```json
{
  "prescriptionId": 123,
  "medications": [
    {
      "name": "Amoxicillin",
      "strength": "500mg",
      "quantity": 20
    },
    {
      "name": "Paracetamol",
      "strength": "500mg",
      "quantity": 10
    }
  ]
}
```

The agent must not invent missing information.

If the prescription cannot be reliably read, the workflow should request a clearer image or human review.

## Member 1 Deliverables

- Patient APIs
- Prescription APIs
- Patient database tables
- Flutter patient screens
- Prescription upload
- Prescription Extraction Agent
- Unit/API tests
- Documentation

---

# 3. Member 2 — Medication & Inventory Management

## Main Responsibility

Everything related to **medicines, pharmacy stock, inventory, and suppliers**.

## Backend Responsibilities

Develop and maintain:

- Medicine
- MedicineCategory
- Inventory
- Supplier
- PharmacyInventory

### Example APIs

```text
GET    /api/medicines
POST   /api/medicines
PUT    /api/medicines/{id}
DELETE /api/medicines/{id}

GET    /api/inventory
POST   /api/inventory
PUT    /api/inventory/{id}
```

## React Responsibilities

Member 2 primarily owns:

```text
Medicines
  |
  +-- Medicine List
  +-- Add Medicine
  +-- Edit Medicine
  +-- Categories

Inventory
  |
  +-- Stock
  +-- Low Stock
  +-- Expiring Medicines
  +-- Stock Updates

Suppliers
```

Implement:

- Search
- Filtering
- Sorting
- Pagination
- Form validation

## Agent — Medication Verification Agent

The Medication Verification Agent receives extracted medication information and verifies it against the medication database.

### Checks

- Does the medicine exist?
- Does the strength exist?
- Is the information complete?
- Is the quantity valid?
- Does the medication match known records?
- Are there duplicate/invalid requests?

### Example

```text
Extracted:
Amoxicillin 500mg x 20

        |
        v

Medication Database

Medicine exists      ✓
Strength exists      ✓
Quantity valid       ✓
```

If verification fails:

```text
VERIFICATION FAILED
        |
        v
Human Review Required
```

The agent must not independently change the doctor's prescription.

## Inventory Search Tool

Member 2 also owns the controlled **Inventory Search Tool**.

Example:

```text
check_pharmacy_inventory()
```

This tool can return:

- Medicine
- Required quantity
- Available quantity
- Pharmacy
- Availability status

Example:

```text
ABC Pharmacy
Amoxicillin: 30 available ✓
Paracetamol: 20 available ✓

HealthPlus Pharmacy
Amoxicillin: 0 available ✗
Paracetamol: 20 available ✓

City Pharmacy
Amoxicillin: 25 available ✓
Paracetamol: 0 available ✗
```

## Member 2 Deliverables

- Medicine APIs
- Inventory APIs
- Supplier APIs
- Database tables
- React medicine management
- React inventory management
- Medication Verification Agent
- Inventory Search Tool
- Tests
- Documentation

---

# 4. Member 3 — Pharmacy Fulfillment & Pharmacist Approval

## Main Responsibility

This member owns the business workflow after medicines have been verified and pharmacies have been identified.

This is one of the most important components of the project.

## Backend Responsibilities

Develop and maintain:

- MedicationRequest
- Order
- OrderItem
- DispensingRecord
- ApprovalRequest

### Example APIs

```text
GET  /api/requests/pending
GET  /api/requests/{id}

POST /api/requests/{id}/approve
POST /api/requests/{id}/reject
POST /api/requests/{id}/revision

PUT  /api/orders/{id}/status
```

## Request Statuses

Use statuses such as:

```text
PENDING
PROCESSING
AWAITING_APPROVAL
APPROVED
REJECTED
REVISION_REQUIRED
READY
COMPLETED
FAILED
```

## React Responsibilities

Member 3 owns the pharmacist dashboard.

### Workflow

```text
Pharmacist Dashboard
        |
        v
Pending Requests
        |
        v
Prescription Details
        |
        v
AI Results
        |
        v
Inventory Results
        |
        v
Pharmacy Recommendation
        |
        +------------------+
        |                  |
        v                  v
     APPROVE             REJECT
        |
        v
REQUEST REVISION
```

Example:

```text
Patient: Dilshan

Prescription:
✓ Amoxicillin 500mg x 20
✓ Paracetamol 500mg x 10

AI Validation:
✓ Passed

Recommended Pharmacy:
ABC Pharmacy

Distance:
1.2 km

[ APPROVE ]
[ REJECT ]
[ REQUEST REVISION ]
```

## Agentic Workflow Orchestrator

Member 3 owns the **Agentic Workflow Orchestrator / Approval Workflow**.

The orchestrator coordinates:

```text
Prescription Extraction Agent
            |
            v
Medication Verification Agent
            |
            v
Inventory Search Tool
            |
            v
Pharmacy Location & Recommendation Agent
            |
            v
Deterministic Validation
            |
            v
Human Pharmacist Approval
```

The orchestrator should maintain persistent workflow state, including:

- Workflow ID
- Objective
- Current state
- Plan
- Completed steps
- Agent results
- Tool results
- Validation results
- Approval status
- Final outcome
- Failure reason

## Human-in-the-Loop

The AI must not automatically finalize high-impact pharmacy fulfillment decisions.

The workflow should pause at:

```text
AI Recommendation
        |
        v
Validation Passed
        |
        v
AWAITING PHARMACIST APPROVAL
```

The pharmacist reviews:

- Prescription
- Extracted medicines
- Inventory
- Pharmacy recommendation
- Distance
- AI results
- Validation results

Actions:

```text
[ APPROVE ]
[ REJECT ]
[ REQUEST REVISION ]
```

Record:

- Approver
- Role
- Timestamp
- Decision
- Reason
- Workflow ID

## Member 3 Deliverables

- Fulfillment APIs
- Approval APIs
- Order/dispensing APIs
- Pharmacist React dashboard
- Human approval workflow
- Agent orchestrator
- Workflow state management
- Approval audit records
- Tests
- Documentation

---

# 5. Member 4 — Pharmacy Location, Recommendation & AI Monitoring

## Main Responsibility

This member owns:

- Pharmacy discovery
- Pharmacy locations
- Distance calculation
- Pharmacy recommendation
- Maps integration
- AI workflow monitoring
- Agent execution history
- Audit logs

## Backend Responsibilities

Develop and maintain:

- Pharmacy
- PharmacyLocation
- PharmacyAvailability
- AIWorkflow
- AIAgentExecution
- AIToolCall
- ValidationResult
- AuditLog

### Example APIs

```text
GET /api/pharmacies
GET /api/pharmacies/nearby
GET /api/pharmacies/{id}

GET /api/ai/workflows
GET /api/ai/workflows/{id}
GET /api/ai/executions
GET /api/audit-logs
```

## Agent — Pharmacy Location & Recommendation Agent

This agent combines:

- Patient location
- Available medicines
- Pharmacy locations
- Distance
- Business rules

### Workflow

```text
Patient Location
       +
Available Medicines
       +
Pharmacy Locations
       |
       v
Distance Calculation
       |
       v
Ranking
       |
       v
Recommended Pharmacy
```

Example:

```text
ABC Pharmacy
✓ All medicines
1.2 km ⭐

HealthPlus Pharmacy
✓ All medicines
2.8 km

City Pharmacy
✓ All medicines
4.5 km
```

Recommendation:

> ABC Pharmacy is the nearest pharmacy with all requested medicines available.

## Third-Party Maps/Location API

Member 4 owns the third-party location integration.

Use it for:

- Patient location
- Pharmacy locations
- Distance calculation
- Nearby pharmacy discovery
- Map display

The integration must have a genuine business purpose.

## React Responsibilities

Member 4 owns:

```text
AI Monitoring
  |
  +-- Workflow List
  +-- Workflow Details
  +-- Agent Execution
  +-- Tool Calls
  +-- Validation Results
  +-- Audit Logs

Pharmacies
  |
  +-- Pharmacy List
  +-- Locations
  +-- Availability
```

## Member 4 Deliverables

- Pharmacy APIs
- Location APIs
- Maps integration
- Pharmacy Location & Recommendation Agent
- AI workflow monitoring
- Agent execution history
- Tool-call logging
- Audit logs
- React monitoring dashboard
- Tests
- Documentation

---

# 6. The Four Main Agentic Responsibilities

| Member | Agent / Responsibility | Main Purpose |
|---|---|---|
| Member 1 | Prescription Extraction Agent | Extract medicines from prescription |
| Member 2 | Medication Verification Agent | Verify extracted medicines |
| Member 3 | Workflow Orchestrator / Approval | Coordinate workflow and human approval |
| Member 4 | Pharmacy Location & Recommendation Agent | Find and rank nearby suitable pharmacies |

### Inventory Search

Inventory Search is implemented as a **controlled tool owned by Member 2**, rather than as a separate fifth agent.

This keeps the four main agent responsibilities clear while still giving the Agentic AI system access to inventory information.

---

# 7. Complete End-to-End Workflow

```text
                    MEMBER 1
                       |
                       v
              Flutter Patient App
                       |
                Upload Prescription
                       |
                       v
          Prescription Extraction Agent
                       |
                       v
              Structured Medicines
                       |
                       v
                    MEMBER 2
                       |
                       v
          Medication Verification Agent
                       |
                       v
             Inventory Search Tool
                       |
                       v
              Available Pharmacies
                       |
                       v
                    MEMBER 4
                       |
                       v
       Pharmacy Location & Recommendation
                       |
                       v
                Nearest Pharmacy
                       |
                       v
                    MEMBER 3
                       |
                       v
              Pharmacist Dashboard
                       |
                       v
                Human Validation
                       |
              +--------+--------+
              |                 |
              v                 v
           APPROVE           REJECT
              |
              v
       Final Recommendation
              |
              v
        Flutter Patient App
```

---

# 8. Responsibility Matrix

| Area | Member 1 | Member 2 | Member 3 | Member 4 |
|---|:---:|:---:|:---:|:---:|
| Patient Management | ⭐ | | | |
| Prescription Management | ⭐ | | | |
| Flutter Patient App | ⭐ | | | |
| Prescription Agent | ⭐ | | | |
| Medicine Management | | ⭐ | | |
| Inventory | | ⭐ | | |
| Supplier | | ⭐ | | |
| Verification Agent | | ⭐ | | |
| Inventory Tool | | ⭐ | | |
| Fulfillment | | | ⭐ | |
| Orders | | | ⭐ | |
| Pharmacist Dashboard | | | ⭐ | |
| Approval Workflow | | | ⭐ | |
| Agent Orchestration | | | ⭐ | |
| Pharmacy Management | | | | ⭐ |
| Location/Maps | | | | ⭐ |
| Recommendation Agent | | | | ⭐ |
| AI Monitoring | | | | ⭐ |
| Audit Logs | | | | ⭐ |
| Testing | ⭐ | ⭐ | ⭐ | ⭐ |
| Documentation | ⭐ | ⭐ | ⭐ | ⭐ |
| GitHub/CI | ⭐ | ⭐ | ⭐ | ⭐ |

---

# 9. Recommended VS Code / GitHub Repository Structure

Use **one GitHub repository** and **one VS Code workspace**.

```text
MediFlowAI/
|
├── backend/
│   └── MediFlow.Api/
|
├── web/
│   └── mediflow-web/
|
├── mobile/
│   └── mediflow-mobile/
|
├── ai/
│   └── mediflow-agents/
|
├── database/
|
├── tests/
|
├── docs/
|
└── .github/
    └── workflows/
```

All four members work within the same repository.

---

# 10. Important Group Working Rule

Do NOT divide the project like:

```text
Member 1 = Backend
Member 2 = React
Member 3 = Flutter
Member 4 = AI
```

Instead, every member should own a complete **business component**.

Each component should include:

```text
Database
   |
   v
ASP.NET Core APIs
   |
   v
React / Flutter UI
   |
   v
AI / Business Logic
   |
   v
Testing
   |
   v
Documentation
```

This makes every member's contribution meaningful and easier to demonstrate and defend.

---

# 11. Simple Way to Remember the Four Components

### Member 1 — Patient

> Patient gives us the prescription.

### Member 2 — Medicine

> We understand, verify, and check the medicines.

### Member 3 — Pharmacist

> Pharmacist reviews and approves the result.

### Member 4 — Pharmacy

> We find the best/nearest pharmacy and monitor the AI workflow.

Together:

```text
Patient
   ↓
Prescription
   ↓
Verification
   ↓
Inventory Search
   ↓
Pharmacy Location
   ↓
Pharmacist Approval
   ↓
Patient Recommendation
```

This forms one complete MediFlow AI workflow rather than four disconnected projects.
