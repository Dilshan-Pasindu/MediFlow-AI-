"""
MediFlow Clinical Agent Tools — Level 2 Gemini Function Calling
Each function here is a real tool that the Gemini model can autonomously
decide to invoke during its ReAct reasoning loop.
"""

from typing import Optional


def check_allergy_contraindications(allergies: str, proposed_medications: list[str]) -> dict:
    """
    Real-time drug-allergy cross-check tool.
    Checks proposed medications against patient's known allergy list.
    In production this would call OpenFDA / DrugBank API.
    """
    allergies_lower = allergies.lower()
    flagged = []

    cross_reference = {
        "penicillin": ["amoxicillin", "ampicillin", "penicillin", "augmentin", "piperacillin"],
        "amoxicillin": ["amoxicillin", "augmentin", "co-amoxiclav"],
        "sulfa": ["sulfamethoxazole", "trimethoprim-sulfamethoxazole", "bactrim"],
        "aspirin": ["aspirin", "salicylates", "nsaid"],
        "nsaid": ["ibuprofen", "naproxen", "diclofenac", "aspirin"],
        "cephalosporin": ["cephalexin", "ceftriaxone", "cefixime", "cefalexin"],
        "codeine": ["codeine", "morphine", "tramadol", "opioid"],
        "sulfonamide": ["sulfamethoxazole", "bactrim", "trimethoprim"],
    }

    for allergen, contraindicated_drugs in cross_reference.items():
        if allergen in allergies_lower:
            for med in proposed_medications:
                med_lower = med.lower()
                for cd in contraindicated_drugs:
                    if cd in med_lower:
                        flagged.append({
                            "drug": med,
                            "allergen": allergen,
                            "severity": "CRITICAL",
                            "recommendation": f"Do NOT prescribe {med} — patient has documented {allergen} allergy."
                        })

    return {
        "allergies_checked": allergies,
        "medications_checked": proposed_medications,
        "contraindications": flagged,
        "safe_to_prescribe": len(flagged) == 0
    }


def calculate_vitals_risk_score(vitals: dict) -> dict:
    """
    Calculates clinical severity scores from vitals.
    Returns urgency level and specific risk findings.
    """
    urgency = "routine"
    findings = []
    score = 0

    bp = vitals.get("bp", "")
    temp = vitals.get("temp", "")
    pulse = vitals.get("pulse", "")
    spo2 = vitals.get("spo2", "")

    # SpO2 check
    try:
        spo2_val = int(str(spo2).replace("%", "").strip())
        if spo2_val < 90:
            urgency = "emergency"
            score += 3
            findings.append(f"CRITICAL HYPOXIA: SpO2 {spo2_val}% — Immediate oxygen therapy required")
        elif spo2_val < 94:
            urgency = "urgent"
            score += 2
            findings.append(f"LOW SpO2: {spo2_val}% — Supplemental O2 and monitoring needed")
    except (ValueError, TypeError):
        pass

    # Temperature check
    try:
        temp_str = str(temp).replace("°C", "").replace("°F", "").strip()
        temp_val = float(temp_str)
        if temp_val > 39.5:
            if urgency != "emergency":
                urgency = "urgent"
            score += 2
            findings.append(f"HIGH GRADE FEVER: {temp_val}°C — Sepsis workup recommended")
        elif temp_val > 38.0:
            score += 1
            findings.append(f"Fever: {temp_val}°C — Monitor for infectious etiology")
    except (ValueError, TypeError):
        pass

    # Pulse check
    try:
        pulse_val = int(str(pulse).replace("bpm", "").strip())
        if pulse_val > 120 or pulse_val < 50:
            if urgency == "routine":
                urgency = "urgent"
            score += 2
            findings.append(f"ABNORMAL PULSE: {pulse_val} bpm — Cardiac evaluation needed")
        elif pulse_val > 100:
            score += 1
            findings.append(f"Tachycardia: {pulse_val} bpm")
    except (ValueError, TypeError):
        pass

    # Blood pressure check
    try:
        if "/" in str(bp):
            systolic, diastolic = [int(x.strip()) for x in str(bp).split("/")]
            if systolic > 180 or diastolic > 110:
                if urgency != "emergency":
                    urgency = "urgent"
                score += 2
                findings.append(f"HYPERTENSIVE CRISIS: BP {systolic}/{diastolic} mmHg")
            elif systolic > 140:
                score += 1
                findings.append(f"Elevated BP: {systolic}/{diastolic} mmHg — Hypertension screening needed")
    except (ValueError, TypeError):
        pass

    return {
        "urgency": urgency,
        "risk_score": score,
        "findings": findings,
        "summary": f"Urgency: {urgency.upper()}. Risk score: {score}/9. Findings: {len(findings)} flagged."
    }


def query_clinical_guidelines(diagnosis_keywords: str, specialty: Optional[str] = None) -> dict:
    """
    Retrieves evidence-based clinical practice guidelines.
    In production this would query a vector-embedded guideline database (RAG).
    Currently returns curated structured guideline data for demonstration.
    """
    keywords_lower = diagnosis_keywords.lower()

    guidelines_kb = {
        "gastritis": {
            "source": "British Society of Gastroenterology (BSG) 2021",
            "first_line": "Proton Pump Inhibitor (PPI) therapy — Omeprazole 20mg OD or Esomeprazole 40mg OD for 4-8 weeks",
            "testing": "H. pylori testing recommended (Urea Breath Test or Stool Antigen Test)",
            "avoid": "NSAIDs, aspirin, alcohol, spicy foods during treatment",
            "follow_up": "Review at 4 weeks. Endoscopy if no response or red-flag symptoms."
        },
        "gerd": {
            "source": "American College of Gastroenterology (ACG) Guidelines 2022",
            "first_line": "PPI therapy for 8 weeks. Lifestyle modifications: head elevation, weight loss, dietary changes",
            "testing": "pH monitoring or endoscopy for refractory cases",
            "avoid": "Caffeine, fatty foods, lying down after meals, smoking",
            "follow_up": "Step-down therapy. Long-term PPI only if symptomatic relapse."
        },
        "urti": {
            "source": "NICE Clinical Knowledge Summary — Common cold & URTI 2023",
            "first_line": "Symptomatic management: analgesics (Paracetamol/Ibuprofen), hydration, rest",
            "antibiotics": "NOT recommended for viral URTI. Antibiotics only if bacterial superinfection confirmed",
            "testing": "FBC + CRP to differentiate bacterial vs viral. Throat swab if strep suspected",
            "follow_up": "Return if symptoms worsen, fever persists >5 days, or dyspnoea develops."
        },
        "hypertension": {
            "source": "NICE Hypertension Guidelines NG136 (2023)",
            "first_line": "ACE inhibitor (Ramipril 2.5-10mg) or Calcium Channel Blocker (Amlodipine 5-10mg)",
            "lifestyle": "DASH diet, sodium restriction <6g/day, regular aerobic exercise, smoking cessation",
            "monitoring": "Review BP in 1-4 weeks. Target <140/90 mmHg (<130/80 if CVD risk >10%)",
            "follow_up": "Annual bloods: renal function, electrolytes, HbA1c."
        },
        "chest pain": {
            "source": "ESC Chest Pain Guidelines 2021",
            "immediate": "12-lead ECG within 10 minutes. Troponin I at 0h and 1h.",
            "risk_stratify": "HEART Score / TIMI Score assessment required",
            "red_flags": "ST elevation → Immediate PCI. High troponin → ACS workup",
            "follow_up": "Cardiology referral. Stress ECG if low-intermediate risk."
        }
    }

    matched_guidelines = {}
    for key, content in guidelines_kb.items():
        if key in keywords_lower:
            matched_guidelines[key] = content

    if not matched_guidelines:
        matched_guidelines["general"] = {
            "source": "General Clinical Practice",
            "first_line": "Full history and physical examination. Targeted investigation based on clinical findings.",
            "testing": "FBC, BMP, urinalysis as baseline",
            "follow_up": "Review in 1-2 weeks or sooner if deterioration."
        }

    return {
        "queried_terms": diagnosis_keywords,
        "guidelines_found": len(matched_guidelines),
        "guidelines": matched_guidelines
    }


def generate_medication_drafts_from_diagnosis(diagnosis: str, allergies: str) -> dict:
    """
    Generates evidence-based medication draft regimens based on diagnosis.
    Returns structured medication proposals for HITL doctor review.
    """
    allergies_lower = allergies.lower()
    drafts = []

    diagnosis_lower = diagnosis.lower()

    if "gastritis" in diagnosis_lower or "peptic" in diagnosis_lower:
        drafts.append({
            "drug_name": "Omeprazole",
            "dosage": "20mg",
            "frequency": "Once daily, 30 minutes before breakfast",
            "duration": "4-8 weeks",
            "instructions": "Swallow capsule whole. Do not crush.",
            "indication": "Proton pump inhibitor — reduces gastric acid production"
        })
        drafts.append({
            "drug_name": "Sucralfate Suspension",
            "dosage": "1g (10ml)",
            "frequency": "Four times daily — 1 hour before meals & at bedtime",
            "duration": "4 weeks",
            "instructions": "Take on empty stomach. Space from other medications by 2 hours.",
            "indication": "Mucosal protective agent"
        })

    elif "gerd" in diagnosis_lower or "reflux" in diagnosis_lower:
        drafts.append({
            "drug_name": "Esomeprazole",
            "dosage": "40mg",
            "frequency": "Once daily before breakfast",
            "duration": "8 weeks",
            "instructions": "Take 30-60 minutes before eating.",
            "indication": "PPI — first-line GERD management"
        })
        drafts.append({
            "drug_name": "Gaviscon Advance Suspension",
            "dosage": "10ml",
            "frequency": "After meals and at bedtime",
            "duration": "As needed",
            "instructions": "Shake before use. Acts as alginate barrier against reflux.",
            "indication": "Alginate antireflux agent for symptom relief"
        })

    elif "urti" in diagnosis_lower or "respiratory" in diagnosis_lower:
        drafts.append({
            "drug_name": "Paracetamol",
            "dosage": "500-1000mg",
            "frequency": "Every 4-6 hours as needed",
            "duration": "5 days or until resolution",
            "instructions": "Max 4g per 24 hours. Avoid in hepatic impairment.",
            "indication": "Analgesic and antipyretic"
        })
        amox_allergy_flag = None
        if "penicillin" in allergies_lower or "amoxicillin" in allergies_lower:
            amox_allergy_flag = "⚠️ CONTRAINDICATED — Patient has Penicillin/Amoxicillin allergy. Use Azithromycin instead."
        drafts.append({
            "drug_name": "Amoxicillin" if not amox_allergy_flag else "Azithromycin",
            "dosage": "500mg" if not amox_allergy_flag else "500mg Day 1, then 250mg",
            "frequency": "Three times daily" if not amox_allergy_flag else "Once daily for 5 days",
            "duration": "7 days" if not amox_allergy_flag else "5 days",
            "instructions": "Complete the full antibiotic course.",
            "indication": "Antibiotic therapy for confirmed bacterial URTI",
            "safety_warning": amox_allergy_flag
        })

    elif "hypertension" in diagnosis_lower:
        drafts.append({
            "drug_name": "Amlodipine",
            "dosage": "5mg",
            "frequency": "Once daily",
            "duration": "Ongoing — reassess at 4 weeks",
            "instructions": "May cause peripheral oedema. Monitor BP weekly initially.",
            "indication": "Calcium channel blocker — first-line hypertension"
        })
        drafts.append({
            "drug_name": "Ramipril",
            "dosage": "2.5mg",
            "frequency": "Once daily",
            "duration": "Ongoing — titrate up based on BP response",
            "instructions": "Monitor for dry cough (ACE inhibitor side effect). Check renal function in 1-2 weeks.",
            "indication": "ACE inhibitor — cardioprotective antihypertensive"
        })

    if not drafts:
        drafts.append({
            "drug_name": "Paracetamol",
            "dosage": "500mg",
            "frequency": "Every 6 hours as needed",
            "duration": "5 days",
            "instructions": "For symptomatic relief. Take with food.",
            "indication": "General symptomatic analgesic"
        })

    return {
        "diagnosis": diagnosis,
        "medication_drafts": drafts,
        "clinical_note": f"Generated {len(drafts)} medication drafts based on {diagnosis}. Review and approve before prescribing."
    }
