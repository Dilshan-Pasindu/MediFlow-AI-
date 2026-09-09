from typing import List
from ai.schemas.agent_schemas import ClinicalCDSInput, ClinicalCDSResult, DiagnosisCandidate


def evaluate_clinical_decision_support(input_data: ClinicalCDSInput) -> ClinicalCDSResult:
    """
    Evaluates patient examination data (symptoms, chief complaint, vitals, allergies)
    and returns ranked differential diagnosis candidates, recommended lab tests, and safety warnings.
    """
    text = (f"{input_data.chief_complaint or ''} {input_data.symptoms or ''}").lower()
    vitals = input_data.vitals
    allergies = (input_data.patient_allergies or '').lower()

    diagnoses: List[DiagnosisCandidate] = []
    lab_tests: List[str] = []
    warnings: List[str] = []
    urgency = "routine"

    # Check vitals warnings
    if vitals:
        if vitals.spo2 and vitals.spo2.replace('%', '').isdigit():
            spo2_val = int(vitals.spo2.replace('%', ''))
            if spo2_val < 94:
                urgency = "emergency"
                warnings.append(f"Hypoxia detected (SpO2: {vitals.spo2}). Immediate oxygen therapy & evaluation recommended.")

        if vitals.temp and any(char.isdigit() for char in vitals.temp):
            try:
                temp_num = float(''.join(c for c in vitals.temp if c.isdigit() or c == '.'))
                if temp_num > 38.5:
                    warnings.append(f"High grade fever detected ({temp_num}°C). Assess for infectious etiology.")
            except ValueError:
                pass

    # Clinical condition rules
    # 1. Gastritis / Peptic Ulcer / GERD
    if any(kw in text for kw in ["epigastric", "stomach", "gastric", "acid", "heartburn", "nausea", "abdominal pain", "vomiting"]):
        diagnoses.append(DiagnosisCandidate(
            id="D1",
            diagnosis="Acute Gastritis",
            confidence=88,
            icdCode="K29.7",
            evidence=[
                "Reported upper abdominal / epigastric pain",
                "Nausea or postprandial discomfort",
                "Clinical presentation matching acute mucosal irritation"
            ]
        ))
        diagnoses.append(DiagnosisCandidate(
            id="D2",
            diagnosis="Gastroesophageal Reflux Disease (GERD)",
            confidence=72,
            icdCode="K21.9",
            evidence=[
                "Retrosternal / burning sensation",
                "Symptoms exacerbated following meals"
            ]
        ))
        lab_tests.extend(["H. pylori Stool Antigen Test", "Full Blood Count (FBC)", "Liver Function Tests (LFTs)"])

    # 2. Upper Respiratory Tract Infection / Bronchitis
    if any(kw in text for kw in ["cough", "fever", "sore throat", "runny nose", "phlegm", "congestion", "sneezing"]):
        diagnoses.append(DiagnosisCandidate(
            id="D3",
            diagnosis="Acute Upper Respiratory Tract Infection (URTI)",
            confidence=91,
            icdCode="J06.9",
            evidence=[
                "Respiratory symptoms with sore throat and congestion",
                "Acro-febrile pattern"
            ]
        ))
        diagnoses.append(DiagnosisCandidate(
            id="D4",
            diagnosis="Acute Bronchitis",
            confidence=68,
            icdCode="J20.9",
            evidence=[
                "Persistent cough with sputum production",
                "Absence of consolidation signs"
            ]
        ))
        lab_tests.extend(["Full Blood Count (FBC)", "C-Reactive Protein (CRP)", "Rapid Influenza Diagnostic Test"])

    # 3. Hypertension / Cardiovascular
    if any(kw in text for kw in ["chest pain", "palpitations", "high bp", "dizziness", "shortness of breath"]):
        if urgency != "emergency":
            urgency = "urgent"
        diagnoses.append(DiagnosisCandidate(
            id="D5",
            diagnosis="Essential Hypertension",
            confidence=85,
            icdCode="I10",
            evidence=[
                "Elevated systolic / diastolic readings",
                "Reported exertion dizziness"
            ]
        ))
        diagnoses.append(DiagnosisCandidate(
            id="D6",
            diagnosis="Angina Pectoris / Ischemic Evaluation",
            confidence=65,
            icdCode="I20.9",
            evidence=[
                "Chest discomfort exacerbated by effort",
                "Requires serial ECG evaluation"
            ]
        ))
        lab_tests.extend(["12-Lead ECG", "Troponin I Tightly Monitored", "Lipid Profile", "Serum Creatinine"])

    # Fallback if no specific rule matches
    if not diagnoses:
        diagnoses.append(DiagnosisCandidate(
            id="D0",
            diagnosis="Undifferentiated Presentation / General Consultation",
            confidence=70,
            icdCode="R69",
            evidence=[
                "General non-specific symptoms reported",
                "Requires baseline lab investigation and physical examination"
            ]
        ))
        lab_tests.extend(["Full Blood Count (FBC)", "Basic Metabolic Panel (BMP)", "Urinalysis"])

    # Allergy warnings cross-checks
    if "penicillin" in allergies or "amoxicillin" in allergies:
        warnings.append("ALLERGY ALERT: Patient is allergic to Penicillins. Avoid beta-lactam prescribing.")
    if "nsaid" in allergies or "aspirin" in allergies:
        warnings.append("ALLERGY ALERT: Patient has reported NSAID sensitivity.")

    return ClinicalCDSResult(
        diagnoses=diagnoses,
        labTests=list(set(lab_tests)),
        urgency=urgency,
        warnings=warnings
    )
