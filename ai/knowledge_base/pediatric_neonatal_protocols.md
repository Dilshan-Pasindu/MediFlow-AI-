# MediFlow-AI Clinical Decision Support Knowledge Base: Pediatrics & Neonatal Care Protocols
**Domain:** Pediatrics | **Standard:** Global Evidence-Based Clinical Practice Guidelines
**Review Cycle:** Annual | **Security Clearance:** Clinical Faculty & AI Decision Engine

## Executive Summary
This document provides standardized, clinical-grade reference algorithms for pediatrics conditions.
All recommendations adhere to international guidelines (ACC/AHA, ESC, NICE, WHO, BSG, ADA) and are ingested into MediFlow's Retrieval-Augmented Generation (RAG) vector store.

---

## Protocol 0001: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0002: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0003: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0004: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0005: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0006: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0007: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0008: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0009: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0010: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0011: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0012: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0013: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0014: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0015: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0016: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0017: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0018: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0019: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0020: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0021: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0022: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0023: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0024: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0025: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0026: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0027: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0028: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0029: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0030: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0031: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0032: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0033: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0034: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0035: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0036: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0037: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0038: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0039: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0040: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0041: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0042: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0043: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0044: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0045: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0046: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0047: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0048: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0049: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0050: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0051: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0052: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0053: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0054: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0055: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0056: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0057: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0058: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0059: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0060: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0061: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0062: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0063: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0064: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0065: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0066: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0067: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0068: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0069: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0070: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0071: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0072: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0073: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0074: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0075: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0076: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0077: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0078: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0079: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0080: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0081: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0082: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0083: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0084: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0085: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0086: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0087: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0088: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0089: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0090: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0091: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0092: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0093: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0094: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0095: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0096: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0097: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0098: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0099: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0100: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0101: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0102: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0103: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0104: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0105: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0106: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0107: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0108: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0109: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0110: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0111: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0112: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0113: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0114: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0115: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0116: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0117: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0118: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0119: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0120: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0121: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0122: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0123: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0124: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0125: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0126: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0127: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0128: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0129: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0130: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0131: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0132: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0133: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0134: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0135: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0136: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0137: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0138: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0139: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0140: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0141: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0142: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0143: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0144: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0145: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0146: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0147: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0148: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0149: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0150: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0151: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0152: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0153: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0154: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0155: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0156: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0157: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0158: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0159: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0160: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0161: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0162: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0163: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0164: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0165: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0166: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0167: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0168: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0169: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0170: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0171: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0172: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0173: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0174: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0175: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0176: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0177: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.7
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0178: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.8
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0179: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.9
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0180: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.1
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0181: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.2
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Pediatric Bronchiolitis (RSV) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Humidified high-flow nasal cannula (HFNC) O2` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Routine antibiotics without bacterial superinfection, systemic steroids`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `3% Hypertonic Saline nebulization` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Humidified high-flow nasal cannula (HFNC) O2`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0182: Clinical Management Protocol for Febrile Seizure (Simple and Complex) (ICD-10: R56.00)
**Classification:** Pediatrics :: Category Emergency Priority
**Primary Diagnostic Code:** `R56.00` | **Protocol Version:** 4.2.3
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Febrile Seizure (Simple and Complex) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Emergency.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Respiratory depression without airway support equipment`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Paracetamol 15mg/kg oral/rectal q4-6h` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Midazolam 0.2mg/kg buccal / Midazolam 0.1mg/kg IV`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0183: Clinical Management Protocol for Acute Otitis Media in Children (ICD-10: H66.90)
**Classification:** Pediatrics :: Category Moderate Priority
**Primary Diagnostic Code:** `H66.90` | **Protocol Version:** 4.2.4
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Acute Otitis Media in Children typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class Moderate.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Amoxicillin 90mg/kg/day divided in 2 doses` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Severe penicillin IgE-mediated anaphylaxis`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ibuprofen 10mg/kg oral TDS PRN pain` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Amoxicillin 90mg/kg/day divided in 2 doses`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0184: Clinical Management Protocol for Pediatric Gastroenteritis with Moderate Dehydration (ICD-10: A09)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `A09` | **Protocol Version:** 4.2.5
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Pediatric Gastroenteritis with Moderate Dehydration typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Loperamide or antimotility agents in children < 12 years`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Ondansetron 0.15mg/kg single oral dose` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Low-osmolarity Oral Rehydration Solution (ORS) 50mL/kg over 4 hours`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0185: Clinical Management Protocol for Neonatal Hyperbilirubinemia (Unconjugated) (ICD-10: P59.9)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `P59.9` | **Protocol Version:** 4.2.6
**Last Validated:** 2026-08-15 | **Evidence Level:** Grade A (High-Quality Multi-Center RCTs)

### 1. Clinical Presentation & Diagnostic Criteria
Patients presenting with suspected Neonatal Hyperbilirubinemia (Unconjugated) typically manifest with cardinal symptom clusters:
- **Primary Symptom Complex:** Acute or subacute presentation with clinical severity class High.
- **Biomarker Profile:** Quantitative laboratory indicators requiring immediate blood panel evaluation.
- **Differential Diagnosis Matrix:** Rule out comorbid secondary etiologies within the differential spectrum.
- **Mandatory Physical Examination Findings:** Vital signs evaluation, organ system physical assessment.
- **Diagnostic Imaging & Modalities:** High-resolution ultrasonography, CT/MRI when indicated, ECG/Spirometry as appropriate.

### 2. Clinical Risk Stratification & Scoring Algorithm
The patient must be assessed utilizing the MediFlow standardized risk scoring index:
| Clinical Assessment Variable | Low Risk (Score 0) | Moderate Risk (Score 1) | Severe / High Risk (Score 2) | Critical Risk (Score 3) |
| :--- | :--- | :--- | :--- | :--- |
| Systolic Blood Pressure (mmHg) | 110 - 129 | 130 - 139 | 140 - 179 | ≥ 180 or < 90 |
| Heart Rate (beats/min) | 60 - 80 | 81 - 99 | 100 - 119 | ≥ 120 or < 50 |
| Oxygen Saturation (SpO2 %) | ≥ 98% | 95% - 97% | 92% - 94% | < 92% (Hypoxia) |
| Temperature (°C) | 36.5 - 37.2 | 37.3 - 37.9 | 38.0 - 38.9 | ≥ 39.0 or < 35.5 |
| Neurological Alertness (GCS) | 15 (Alert) | 14 (Mild confusion) | 11 - 13 (Lethargic) | ≤ 10 (Comatose) |

### 3. Stepwise Therapeutic Intervention Protocol
#### Step 1: Immediate Stabilization & Non-Pharmacological Measures
- Establish continuous hemodynamic monitoring and intravenous vascular access.
- Administer supplemental oxygen if oxygen saturation drops below 94% (or 88-92% in chronic hypercapnia).
- Position patient according to postural guidelines (semi-Fowler's position or lateral recumbent as indicated).

#### Step 2: First-Line Pharmacotherapy
- **Primary Therapeutic Agent:** `Intensive Phototherapy (blue-green spectrum 460-490 nm)` at standard evidence-based starting dosage.
- **Route of Administration:** Oral / IV Infusion depending on acuity and gastrointestinal tolerance.
- **Dosing Frequency:** Standard therapeutic regimen with titration every 48-72 hours based on clinical response.
- **Contraindication Warning:** Strictly contraindicated in patients with `Porphyria, concurrent photosensitizing medications`.

#### Step 3: Second-Line Add-On & Escalation Regimen
- **Secondary Agent:** `Intravenous Immunoglobulin (IVIG) 0.5-1 g/kg for isoimmune hemolytic disease` initiated if primary therapy achieves suboptimal target endpoint.
- **Combination Safety:** Screen for cytochrome P450 (CYP3A4 / CYP2D6) enzymatic metabolic interactions.
- **Renal Dose Adjustment:** Reduce baseline dosage by 50% if eGFR is between 30 - 59 mL/min/1.73m²; avoid if eGFR < 30 mL/min/1.73m².
- **Hepatic Dose Adjustment:** Monitor transaminases (ALT/AST); withhold therapy if elevations exceed 3x upper limit of normal.

### 4. Drug-Drug Interaction & Safety Warning Matrix
| Interacting Drug Class | Co-Administered Agent | Severity Level | Clinical Recommendation |
| :--- | :--- | :--- | :--- |
| Anticoagulants / Antiplatelets | Warfarin / Apixaban | Major | Monitor INR / anti-Xa levels closely; adjust dose |
| ACE Inhibitors / ARBs | Lisinopril / Losartan | Moderate | Monitor serum potassium and creatinine within 7 days |
| Macrolide Antibiotics | Clarithromycin | Severe | Avoid co-administration; high risk of QT prolongation |
| NSAIDs | Ibuprofen / Naproxen | Moderate | Renal impairment and attenuation of antihypertensive efficacy |

### 5. Red Flag Signs & Critical Escalation Criteria
The AI Agent must immediately flag the encounter and alert the attending physician if any of the following are observed:
1. Refractory deterioration despite initiation of `Intensive Phototherapy (blue-green spectrum 460-490 nm)`.
2. Rapid onset of hemodynamic instability or lactic acidosis (> 2.0 mmol/L).
3. Neurological deterioration or new focal neurological deficits.
4. Anaphylactoid signs (urticaria, stridor, angioedema, bronchospasm).

### 6. Discharge, Follow-Up & Ambulatory Management
- **Post-Acute Monitoring:** Schedule follow-up consultation in MediFlow Patient Portal within 7 - 14 calendar days.
- **Repeat Diagnostic Studies:** Schedule follow-up laboratory panels (CBC, Renal Function, Liver Function).
- **Patient Education & Lifestyle Modification:** Sodium restriction, aerobic physical conditioning, cessation of smoking/alcohol.
- **E-Prescription Dispensing:** Electronic fulfillment via registered pharmacy with patient allergy cross-check.

---

## Protocol 0186: Clinical Management Protocol for Acute Pediatric Bronchiolitis (RSV) (ICD-10: J21.0)
**Classification:** Pediatrics :: Category High Priority
**Primary Diagnostic Code:** `J21.0` | **Protocol Version:** 4.2.7
