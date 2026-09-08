from typing import Dict, List, Tuple
from ai.schemas.agent_schemas import SymptomInput, SpecialistRecommendation

# Clinical knowledge base mapping symptoms to specialties
SPECIALTY_RULES: Dict[str, List[str]] = {
    "Cardiology": [
        "chest pain", "palpitations", "shortness of breath", "high blood pressure",
        "irregular heartbeat", "swollen ankles", "dizziness", "chest pressure"
    ],
    "Dermatology": [
        "skin rash", "itching", "acne", "mole changes", "eczema", "hives",
        "skin lesion", "psoriasis", "dry skin", "blisters"
    ],
    "Neurology": [
        "severe headache", "migraine", "numbness", "tingling", "seizures",
        "memory loss", "tremors", "loss of balance", "facial drooping"
    ],
    "Orthopedics": [
        "joint pain", "knee pain", "back pain", "fracture", "stiff joints",
        "swollen knee", "shoulder pain", "sprain", "limited mobility"
    ],
    "ENT": [
        "earache", "hearing loss", "sore throat", "sinus pressure", "ringing in ears",
        "nasal congestion", "hoarseness", "difficulty swallowing"
    ],
    "Ophthalmology": [
        "blurred vision", "eye redness", "double vision", "eye pain",
        "sensitivity to light", "floaters", "dry eyes"
    ],
    "Pediatrics": [
        "infant fever", "childhood rash", "growth concerns", "colic",
        "child cough", "immunization questions"
    ],
}


def recommend_specialist(input_data: SymptomInput) -> SpecialistRecommendation:
    """
    Analyzes input symptoms using medical domain rules and returns a structured recommendation.
    """
    scores: Dict[str, int] = {spec: 0 for spec in SPECIALTY_RULES}
    matched_symptoms: Dict[str, List[str]] = {spec: [] for spec in SPECIALTY_RULES}

    normalized_symptoms = [s.lower().strip() for s in input_data.symptoms]
    if input_data.patient_notes:
        normalized_symptoms.append(input_data.patient_notes.lower().strip())

    for user_sym in normalized_symptoms:
        for spec, keywords in SPECIALTY_RULES.items():
            for kw in keywords:
                if kw in user_sym or user_sym in kw:
                    scores[spec] += 1
                    matched_symptoms[spec].append(kw)

    best_spec = max(scores, key=lambda k: scores[k])
    best_score = scores[best_spec]

    if best_score == 0:
        return SpecialistRecommendation(
            recommended_specialty="General Medicine",
            confidence_score=0.70,
            rationale="General symptoms provided do not point exclusively to a single specialized subdiscipline. A primary consultation with General Medicine is recommended.",
            suggested_actions=[
                "Schedule a preliminary consultation with a General Practitioner",
                "Keep a daily log of symptom occurrence and intensity",
                "Seek immediate emergency care if symptoms rapidly escalate",
            ],
        )

    # Calculate confidence based on matches and severity
    base_confidence = min(0.95, 0.75 + (best_score * 0.05))
    if input_data.severity == "severe":
        base_confidence = min(0.98, base_confidence + 0.05)

    unique_matched = list(set(matched_symptoms[best_spec]))
    rationale = (
        f"Patient presented symptoms matching {best_spec} profile: "
        f"{', '.join(unique_matched)}. Recommended consultation with a certified specialist."
    )

    suggested_actions = [
        f"Book an appointment with a verified {best_spec} specialist",
        "Bring any prior test results or prescription history to the appointment",
    ]
    if input_data.severity == "severe":
        suggested_actions.insert(0, "URGENT: Consider urgent medical care if experiencing severe pain or shortness of breath")

    return SpecialistRecommendation(
        recommended_specialty=best_spec,
        confidence_score=round(base_confidence, 2),
        rationale=rationale,
        suggested_actions=suggested_actions,
    )
