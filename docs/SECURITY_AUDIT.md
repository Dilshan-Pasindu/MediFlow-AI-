# 🛡️ MediFlow AI — Security Architecture & Threat Audit

This document details the security posture, threat mitigation strategies, Role-Based Access Control (RBAC) matrix, and regulatory data privacy protections implemented across the **MediFlow AI** platform.

---

## 🔒 1. Security Architecture Overview

MediFlow AI enforces a **Defense-in-Depth** model across every layer of the technology stack:

```
┌────────────────────────────────────────────────────────┐
│ 1. Network Boundary: HTTPS (TLS 1.3), CORS, Rate Limit│
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 2. API Gateway: JWT Claims Verification & Anti-CSRF    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 3. Application: RBAC Policy Filters & Model Validation │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 4. Data Layer: Parametrized EF Core, Encrypted at Rest │
└────────────────────────────────────────────────────────┘
```

---

## 👥 2. Role-Based Access Control (RBAC) Matrix

The system implements 7 distinct, mutually exclusive roles using ASP.NET Core authorization attributes (`[Authorize(Roles = "...")]`):

| Resource / Action | Patient | Doctor | Receptionist | Pharmacist | PharmacyOwner | Supplier | Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Search Doctors & Bookings** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Verify Payment Slips & Tokens**| ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Conduct Consultations & Vitals**| ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Issue Digital E-Prescriptions** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **View Own Prescriptions** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Screen Interactions (AI Agent)**| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Dispense Orders & Billing** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Manage Batch Inventory & Expiry**| ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Submit Supply Restock Requests**| ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Fulfill Restock Orders** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Audit Logs & Telemetry Metrics**| ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🎯 3. STRIDE Threat Analysis & Mitigations

| Threat Category | Potential Attack Vector | MediFlow AI Security Control |
| :--- | :--- | :--- |
| **Spoofing** | Forged identity or stolen JWT tokens | Signed HMAC-SHA256 tokens with short expiration; BCrypt password hashing (work factor 11); HTTPS-only transmission. |
| **Tampering** | Altering prescription medication or prices | Entity Framework Core concurrency tokens; digital signing timestamp; immutable audit log entries. |
| **Repudiation** | Doctor claiming they did not issue prescription | Immutable prescription records storing issuing Doctor ID, timestamp, and linked consultation encounter. |
| **Information Disclosure** | Unauthorized access to patient health records (EHR) | Strict tenant-level filtering in EF Core queries; patient records only queryable by patient themselves or authorized consulting doctor. |
| **Denial of Service** | Flooding channeling booking endpoints | Nginx request rate limiting; frontend request debouncing; database connection pooling in EF Core. |
| **Elevation of Privilege** | Normal user attempting administrative actions | Server-side role claim validation on every controller action via ASP.NET Core `ClaimsPrincipal`. |

---

## 💉 4. OWASP Top 10 Mitigations

### 1. SQL Injection (SQLi)
- **Mitigation:** Zero raw concatenated SQL strings. All database queries execute via **Entity Framework Core 8 Object-Relational Mapping (ORM)** with mandatory parameterized commands.

### 2. Broken Authentication & Session Management
- **Mitigation:**
  - Passwords hashed using industry-standard **BCrypt**.
  - JWT tokens signed with a 256-bit cryptographically secure symmetric key.
  - Revocation and expiration enforcement with client-side automated token refresh / logout on 401.

### 3. Cross-Site Scripting (XSS)
- **Mitigation:**
  - React 19 automatically escapes all dynamic text rendered in JSX templates.
  - Strict Content Security Policy (CSP) headers configured on Nginx reverse proxy.

### 4. Cross-Site Request Forgery (CSRF)
- **Mitigation:** Stateless JWT authentication stored in secure authorization headers prevents ambient credential abuse.

### 5. Server-Side Request Forgery (SSRF)
- **Mitigation:** AI microservice API clients communicate across an internal isolated Docker virtual bridge network (`mediflow-network`) inaccessible from external networks.

---

## 🏥 5. Healthcare Data Privacy & HIPAA / GDPR Compliance

### 1. Data Encryption
- **In Transit:** Mandatory **TLS 1.3 / TLS 1.2** for all incoming HTTPS traffic and WebSocket channels.
- **At Rest:** Database disk encryption using AES-256 for persistent PostgreSQL volumes.

### 2. Audit Trails & Accountability
Every sensitive administrative or clinical event generates an immutable audit record:
```json
{
  "timestamp": "2026-09-24T18:30:15Z",
  "userId": 104,
  "role": "Doctor",
  "action": "E_PRESCRIPTION_ISSUED",
  "resourceId": "RX-402",
  "ipAddress": "192.168.1.45",
  "status": "Success"
}
```

### 3. Human-In-The-Loop (HITL) AI Safeguards
- **Zero Autonomous Clinical Execution:** AI agents generate *recommendations*, not autonomous prescriptions.
- **Doctor Authority:** Differential diagnoses and medication suggestions require explicit physician approval (`Accept`, `Modify`, `Reject`) before entering the official health record.
- **Deterministic Tool Validation:** AI agent outputs undergo strict Pydantic v2 schema validation before JSON serialization.

---

## 🔍 6. Vulnerability Scanning & CI Security Guardrails

The MediFlow CI pipeline executes automated security testing on every pull request:
- **CodeQL Static Analysis:** Automated semantic source scanning for vulnerability patterns in C#, TypeScript, and Python.
- **Dependabot:** Weekly vulnerability audits for NuGet packages and npm dependencies.
- **Secret Scanning:** GitHub Secret Scanner preventing accidental credential or private key commits.
