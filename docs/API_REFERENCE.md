# 📖 MediFlow AI — API Reference Manual

Welcome to the comprehensive API Reference Manual for the **MediFlow AI** platform. This document outlines the RESTful interfaces, request payloads, response structures, and security considerations across all core microservices and web controllers.

---

## 🔐 Authentication & Authorization

All authenticated endpoints require a JSON Web Token (JWT) passed in the HTTP `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

Tokens are signed using `HMAC-SHA256` and contain role and user identifier claims:
- `userId`: Internal database identifier of the authenticated user.
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`: Assigned platform role.

### Supported User Roles
- `Patient`: Booking channeling slots, viewing medical history and prescriptions.
- `Doctor`: Managing verified patient queues, conducting consultations, issuing e-prescriptions.
- `Receptionist`: Payment slip verification, walk-in patient token issuance, queue oversight.
- `Pharmacist`: Dispensing validation, medication safety interaction checks, order fulfillment.
- `PharmacyOwner`: Real-time stock audit, multi-batch expiry tracking, restock approvals.
- `Supplier`: Restock purchase request fulfillment, catalog pricing updates.
- `Administrator`: System metrics, role assignment, audit log inspection, AI latency monitoring.

---

## 1. Authentication Endpoints

### 1.1 Register User
- **Method:** `POST`
- **Path:** `/api/auth/register`
- **Access:** Public

#### Request Body
```json
{
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "SecurePassword123!",
  "phoneNumber": "+1555123456",
  "role": "Patient"
}
```

#### Response (`200 OK`)
```json
{
  "userId": 25,
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "role": "Patient",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-10-25T12:00:00Z"
}
```

---

### 1.2 Login User
- **Method:** `POST`
- **Path:** `/api/auth/login`
- **Access:** Public

#### Request Body
```json
{
  "email": "jane.doe@example.com",
  "password": "SecurePassword123!"
}
```

#### Response (`200 OK`)
```json
{
  "userId": 25,
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "role": "Patient",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-10-25T12:00:00Z"
}
```

---

## 2. Doctor Channeling & Directory

### 2.1 Get Doctors Directory
- **Method:** `GET`
- **Path:** `/api/doctors`
- **Query Parameters:**
  - `specialty` *(optional, string)*: Filter by department (e.g. `Cardiology`, `Dermatology`).
  - `search` *(optional, string)*: Name, qualification, or clinic search term.
- **Access:** Public / Patient

#### Example Request
```bash
curl -X GET "http://localhost:5224/api/doctors?specialty=Cardiology" \
     -H "Accept: application/json"
```

#### Response (`200 OK`)
```json
[
  {
    "id": 1,
    "fullName": "Dr. Alice Morgan",
    "specialty": "Cardiology",
    "qualifications": "MBBS, MD (Cardiology), MRCP",
    "experienceYears": 14,
    "consultationFee": 50.00,
    "rating": 4.9,
    "totalReviews": 84,
    "isActive": true
  }
]
```

---

### 2.2 Get Doctor Profile & Reviews
- **Method:** `GET`
- **Path:** `/api/doctors/{id}`
- **Access:** Public / Patient

#### Response (`200 OK`)
```json
{
  "id": 1,
  "fullName": "Dr. Alice Morgan",
  "bio": "Senior Consultant Cardiologist specializing in preventive cardiology and heart failure.",
  "qualifications": "MBBS, MD (Cardiology), MRCP",
  "hospitalClinic": "MediFlow Heart Center, Tower B, Suite 301",
  "languages": "English, Sinhala",
  "consultationFee": 50.00,
  "availabilities": [
    {
      "dayOfWeek": "Monday",
      "startTime": "09:00",
      "endTime": "13:00",
      "maxPatients": 20
    }
  ]
}
```

---

## 3. Appointments & Queue Management

### 3.1 Book Consultation
- **Method:** `POST`
- **Path:** `/api/appointments`
- **Access:** `Patient`

#### Request Body
```json
{
  "doctorId": 1,
  "dateTime": "2026-10-15T09:30:00Z",
  "notes": "Follow-up consultation regarding antihypertensive medication titration."
}
```

#### Response (`200 OK`)
```json
{
  "id": 105,
  "appointmentNumber": "APP-2026-0105",
  "doctor": "Dr. Alice Morgan",
  "dateTime": "2026-10-15T09:30:00Z",
  "fee": 50.00,
  "status": "Pending",
  "message": "Appointment booked successfully. Please submit payment slip for confirmation."
}
```

---

### 3.2 Consultation Lifecycle Transitions
- `POST /api/appointments/{id}/start` (`Doctor`): Begins clinical consultation; notifies queue monitor via SignalR.
- `POST /api/appointments/{id}/complete` (`Doctor`): Concludes patient session and logs encounter duration.
- `POST /api/appointments/{id}/cancel` (`Patient`, `Doctor`, `Receptionist`): Releases channeling slot.

---

## 4. E-Prescriptions & Safety Verification

### 4.1 Create E-Prescription
- **Method:** `POST`
- **Path:** `/api/prescriptions`
- **Access:** `Doctor`

#### Request Body
```json
{
  "appointmentId": 105,
  "patientId": 25,
  "isWalkIn": false,
  "diagnosis": "Essential Hypertension (ICD-10 I10)",
  "fulfillmentSource": "InHouse",
  "recipients": "Both",
  "instructions": "Monitor daily morning blood pressure readings.",
  "items": [
    {
      "medicineId": 14,
      "medicineName": "Amlodipine 5mg",
      "dosage": "5mg",
      "frequency": "Once daily (OD)",
      "duration": "30 Days",
      "quantity": 30,
      "instructions": "Take in the morning with water"
    }
  ]
}
```

#### Response (`200 OK`)
```json
{
  "message": "Prescription created successfully.",
  "prescription": {
    "id": 402,
    "doctorName": "Dr. Alice Morgan",
    "patientName": "Jane Doe",
    "status": "Active",
    "fulfillmentSource": "InHouse",
    "itemCount": 1
  }
}
```

---

### 4.2 Drug Interaction Screening
- **Method:** `POST`
- **Path:** `/api/prescriptions/{id}/screen-interactions`
- **Access:** `Doctor`, `Pharmacist`

#### Response (`200 OK`)
```json
{
  "prescriptionId": 402,
  "safeToPrescribe": true,
  "riskSeverity": "Low",
  "interactionCount": 0,
  "flaggedInteractions": [],
  "pharmacistGuidance": "Dosage parameters adhere to clinical safety guidelines."
}
```

---

## 5. AI Microservice Endpoints

### 5.1 Symptom-to-Specialist Recommendation
- **Method:** `POST`
- **Path:** `http://localhost:8000/recommend-specialist`

#### Request Body
```json
{
  "symptoms": "Chest heaviness radiating into the left arm during exertion, shortness of breath, palpitations."
}
```

#### Response (`200 OK`)
```json
{
  "recommended_specialty": "Cardiology",
  "confidence_score": 0.94,
  "reasoning": "Symptoms strongly correlate with angina pectoris and ischemic cardiovascular disease.",
  "recommended_action": "Consult a cardiologist promptly; proceed to emergency department if pain is prolonged.",
  "urgency": "Urgent"
}
```

---

## 6. HTTP Status & Error Codes

| Status Code | Meaning | Resolution |
| :--- | :--- | :--- |
| `200 OK` | Request succeeded | Process returned data |
| `201 Created` | Resource provisioned | Inspect `Location` header or payload ID |
| `400 Bad Request` | Validation constraint violation | Correct request body according to schema |
| `401 Unauthorized` | Missing or expired JWT | Re-authenticate via `/api/auth/login` |
| `403 Forbidden` | Insufficient role permissions | Verify required role in API reference |
| `404 Not Found` | Target record does not exist | Verify ID parameter |
| `409 Conflict` | Unique constraint violated | Email or slot already taken |
| `500 Server Error`| Internal processing failure | Consult server diagnostic logs |
