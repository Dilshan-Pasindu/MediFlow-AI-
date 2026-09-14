"""
MediFlow Medication Intelligence Agent — Agent 3
=================================================
Automated clinical screening for Drug-Drug Interactions (DDI),
Allergy Contraindications, and Bioequivalent Alternative Recommendations.
Provides a Human-in-the-Loop (HITL) checkpoint for pharmacists before dispensing.
"""

from typing import List, Dict, Tuple, Optional
from ai.schemas.agent_schemas import (
    MedicationCheckInput,
    MedicationCheckResult,
    DrugInteraction,
    AlternativeDrug,
)

# ─── Clinical Knowledge Bases ────────────────────────────────────────────────

# Known Drug-Drug Interactions (DDI)
KNOWN_INTERACTIONS: List[Dict] = [
    {
        "pair": ("warfarin", "aspirin"),
        "severity": "High",
        "description": "Concurrent use of Warfarin and Aspirin significantly increases risk of major gastrointestinal and systemic hemorrhage.",
        "recommendation": "Avoid combination if possible, or closely monitor INR and co-prescribe gastroprotection (e.g. PPI)."
    },
    {
        "pair": ("warfarin", "ibuprofen"),
        "severity": "High",
        "description": "NSAIDs displace Warfarin from albumin and irritate gastric mucosa, increasing severe bleeding risk.",
        "recommendation": "Substitute NSAID with Paracetamol for analgesia."
    },
    {
        "pair": ("omeprazole", "clopidogrel"),
        "severity": "Moderate",
        "description": "Omeprazole competitively inhibits CYP2C19, reducing the bioactivation of Clopidogrel and increasing thromboembolic risk.",
        "recommendation": "Switch to Pantoprazole which has minimal CYP2C19 inhibition, or space dosing."
    },
    {
        "pair": ("ciprofloxacin", "antacid"),
        "severity": "Moderate",
        "description": "Polyvalent cations in antacids (Al, Mg, Ca) chelate Ciprofloxacin, drastically reducing antibiotic bioavailability.",
        "recommendation": "Administer Ciprofloxacin at least 2 hours before or 4 hours after antacid intake."
    },
    {
        "pair": ("ramipril", "spironolactone"),
        "severity": "Moderate",
        "description": "Co-administration of ACE inhibitor and potassium-sparing diuretic significantly elevates risk of hyperkalemia.",
        "recommendation": "Monitor serum potassium and renal function within 1-2 weeks of initiation."
    },
    {
        "pair": ("metformin", "prednisolone"),
        "severity": "Moderate",
        "description": "Corticosteroids antagonize hypoglycemic effect of Metformin, leading to glycemic variability.",
        "recommendation": "Increase frequency of blood glucose monitoring and consider temporary insulin dose adjustment."
    },
    {
        "pair": ("amoxicillin", "methotrexate"),
        "severity": "High",
        "description": "Penicillins reduce renal tubular clearance of Methotrexate, potentially causing severe toxicity (bone marrow suppression).",
        "recommendation": "Avoid concurrent use or monitor Methotrexate serum levels closely."
    },
    {
        "pair": ("fluoxetine", "tramadol"),
        "severity": "High",
        "description": "Combined serotonergic action increases risk of potentially fatal Serotonin Syndrome and lowers seizure threshold.",
        "recommendation": "Avoid combination. Consider alternative non-serotonergic analgesic or monitor closely for agitation/clonus."
    },
]

# Drug-Allergy Cross Reference
ALLERGY_CROSS_REFERENCE: Dict[str, List[str]] = {
    "penicillin": ["amoxicillin", "ampicillin", "penicillin", "augmentin", "co-amoxiclav", "piperacillin"],
    "amoxicillin": ["amoxicillin", "augmentin", "co-amoxiclav"],
    "sulfa": ["sulfamethoxazole", "trimethoprim-sulfamethoxazole", "bactrim", "sulfasalazine"],
    "aspirin": ["aspirin", "salicylates", "acetylsalicylic acid"],
    "nsaid": ["ibuprofen", "naproxen", "diclofenac", "ketoprofen", "indomethacin", "aspirin", "mefenamic acid"],
    "cephalosporin": ["cephalexin", "ceftriaxone", "cefixime", "cefaclor", "cefuroxime"],
    "codeine": ["codeine", "morphine", "tramadol", "fentanyl", "oxycodone"],
}

# Bioequivalent Alternatives
BIOEQUIVALENT_ALTERNATIVES: Dict[str, Dict] = {
    "amoxicillin": {
        "alt": "Azithromycin 500mg (or Erythromycin)",
        "reason": "Macrolide alternative for patients allergic to beta-lactam penicillins",
        "dosage": "500mg once daily for 3-5 days"
    },
    "augmentin": {
        "alt": "Ciprofloxacin 500mg or Clarithromycin 500mg",
        "reason": "Broad-spectrum coverage alternative avoiding penicillin backbone",
        "dosage": "500mg twice daily"
    },
    "ibuprofen": {
        "alt": "Paracetamol 1000mg + Tramadol (if severe)",
        "reason": "Safe analgesic avoiding NSAID allergy or gastrointestinal irritation",
        "dosage": "1000mg every 6 hours (max 4g/day)"
    },
    "omeprazole": {
        "alt": "Pantoprazole 40mg",
        "reason": "Lower CYP2C19 interaction potential; safe with antiplatelet therapy",
        "dosage": "40mg once daily before breakfast"
    },
    "diclofenac": {
        "alt": "Celecoxib 200mg or Paracetamol 1000mg",
        "reason": "COX-2 selective alternative or non-NSAID analgesic option",
        "dosage": "200mg once daily or 1000mg QDS"
    },
    "aspirin": {
        "alt": "Clopidogrel 75mg",
        "reason": "Antiplatelet alternative for aspirin-intolerant or allergic patients",
        "dosage": "75mg once daily"
    }
}


def check_drug_interactions(medications: List[str]) -> List[DrugInteraction]:
    """Detects clinically significant interactions between pairs of medications."""
    detected: List[DrugInteraction] = []
    meds_clean = [m.lower().strip() for m in medications]

    for rule in KNOWN_INTERACTIONS:
        d1, d2 = rule["pair"]
        d1_present = any(d1 in med for med in meds_clean)
        d2_present = any(d2 in med for med in meds_clean)

        if d1_present and d2_present:
            detected.append(
                DrugInteraction(
                    drug_pair=[d1.capitalize(), d2.capitalize()],
                    severity=rule["severity"],
                    description=rule["description"],
                    recommendation=rule["recommendation"],
                )
            )

    return detected


def check_allergy_contraindications(allergies: Optional[str], medications: List[str]) -> List[str]:
    """Checks proposed medications against documented patient allergies."""
    if not allergies or not allergies.strip():
        return []

    warnings: List[str] = []
    allergies_lower = allergies.lower()
    meds_clean = [m.lower().strip() for m in medications]

    for allergen, forbidden_drugs in ALLERGY_CROSS_REFERENCE.items():
        if allergen in allergies_lower:
            for med in meds_clean:
                for forbidden in forbidden_drugs:
                    if forbidden in med:
                        warnings.append(
                            f"CRITICAL ALLERGY ALERT: '{med.title()}' is contraindicated for patient with documented '{allergen.title()}' allergy."
                        )

    return warnings


def find_alternative_medicines(medications: List[str], flagged_reasons: Dict[str, str]) -> List[AlternativeDrug]:
    """Finds bioequivalent or therapeutic alternatives for flagged drugs."""
    alternatives: List[AlternativeDrug] = []
    meds_clean = [m.lower().strip() for m in medications]

    for med in meds_clean:
        for orig, alt_data in BIOEQUIVALENT_ALTERNATIVES.items():
            if orig in med and orig in flagged_reasons:
                alternatives.append(
                    AlternativeDrug(
                        original_drug=med.title(),
                        alternative_drug=alt_data["alt"],
                        reason=flagged_reasons.get(orig, alt_data["reason"]),
                        dosage_guidance=alt_data["dosage"],
                    )
                )

    return alternatives


def evaluate_medication_intelligence(payload: MedicationCheckInput) -> MedicationCheckResult:
    """
    Main evaluation pipeline for Medication Intelligence Agent (Agent 3).
    Executes DDI screening, allergy safety checks, calculates safety score,
    and proposes alternatives for pharmacist HITL review.
    """
    interactions = check_drug_interactions(payload.medications)
    allergy_warnings = check_allergy_contraindications(payload.patient_allergies, payload.medications)

    flagged_reasons: Dict[str, str] = {}
    if allergy_warnings:
        for w in allergy_warnings:
            for k in BIOEQUIVALENT_ALTERNATIVES:
                if k in w.lower():
                    flagged_reasons[k] = "Allergy contraindication detected"

    for inter in interactions:
        for drug in inter.drug_pair:
            k = drug.lower()
            if k in BIOEQUIVALENT_ALTERNATIVES and k not in flagged_reasons:
                flagged_reasons[k] = f"DDI conflict ({inter.severity} severity with {inter.drug_pair})"

    alternatives = find_alternative_medicines(payload.medications, flagged_reasons)

    # Score calculation (100 is pristine, deduct for hazards)
    safety_score = 100
    for inter in interactions:
        if inter.severity == "High":
            safety_score -= 35
        elif inter.severity == "Moderate":
            safety_score -= 15
        else:
            safety_score -= 5

    if allergy_warnings:
        safety_score -= (40 * len(allergy_warnings))

    safety_score = max(0, min(100, safety_score))
    safe_to_dispense = len(allergy_warnings) == 0 and not any(i.severity == "High" for i in interactions)

    # Summary synthesis
    if safe_to_dispense and not interactions:
        summary = (
            f"Prescription verified: {len(payload.medications)} medication(s) checked. "
            "No drug interactions or allergy conflicts detected. Safe to dispense."
        )
    elif not safe_to_dispense:
        issue_count = len(allergy_warnings) + sum(1 for i in interactions if i.severity == 'High')
        summary = (
            f"⚠️ Dispensing Warning: Detected {issue_count} critical safety flag(s). "
            "Human pharmacist review and intervention required before dispensing."
        )
    else:
        summary = (
            f"Caution: {len(interactions)} moderate interaction(s) detected. "
            "Review dosing intervals and monitor patient clinical status."
        )

    return MedicationCheckResult(
        safe_to_dispense=safe_to_dispense,
        safety_score=safety_score,
        interactions=interactions,
        allergy_warnings=allergy_warnings,
        alternatives=alternatives,
        summary=summary,
    )
