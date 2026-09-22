"""
MediFlow Medication Intelligence Agent — Agent 3
=================================================
Automated clinical screening for Drug-Drug Interactions (DDI),
Allergy Contraindications, Dosage Safety, Out-of-Stock Alternatives,
and Bioequivalent Alternative Recommendations.

Provides a Human-in-the-Loop (HITL) checkpoint for pharmacists before dispensing.

Architecture (Phase A):
  Deterministic pipeline wrapped in a LangGraph StateGraph.
  Gemini is used ONLY to rephrase the final summary — it cannot alter
  clinical flags (safe_to_dispense, safety_score, interactions, warnings).
  Gemini failures / timeouts fall back silently to the deterministic summary.
"""

import os
import logging
from typing import List, Dict, Optional, TypedDict, Any
from dotenv import load_dotenv

# Load .env from the ai/ directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

from langgraph.graph import StateGraph, END

try:
    from ai.schemas.agent_schemas import (
        MedicationCheckInput,
        MedicationCheckResult,
        DrugInteraction,
        AlternativeDrug,
    )
except ImportError:
    from schemas.agent_schemas import (  # type: ignore
        MedicationCheckInput,
        MedicationCheckResult,
        DrugInteraction,
        AlternativeDrug,
    )

logger = logging.getLogger(__name__)

# ─── Clinical Knowledge Bases ─────────────────────────────────────────────────

# Known Drug-Drug Interactions (DDI)
KNOWN_INTERACTIONS: List[Dict] = [
    {
        "pair": ("warfarin", "aspirin"),
        "severity": "High",
        "description": "Concurrent use of Warfarin and Aspirin significantly increases risk of major gastrointestinal and systemic hemorrhage.",
        "recommendation": "Avoid combination if possible, or closely monitor INR and co-prescribe gastroprotection (e.g. PPI).",
    },
    {
        "pair": ("warfarin", "ibuprofen"),
        "severity": "High",
        "description": "NSAIDs displace Warfarin from albumin and irritate gastric mucosa, increasing severe bleeding risk.",
        "recommendation": "Substitute NSAID with Paracetamol for analgesia.",
    },
    {
        "pair": ("omeprazole", "clopidogrel"),
        "severity": "Moderate",
        "description": "Omeprazole competitively inhibits CYP2C19, reducing the bioactivation of Clopidogrel and increasing thromboembolic risk.",
        "recommendation": "Switch to Pantoprazole which has minimal CYP2C19 inhibition, or space dosing.",
    },
    {
        "pair": ("ciprofloxacin", "antacid"),
        "severity": "Moderate",
        "description": "Polyvalent cations in antacids (Al, Mg, Ca) chelate Ciprofloxacin, drastically reducing antibiotic bioavailability.",
        "recommendation": "Administer Ciprofloxacin at least 2 hours before or 4 hours after antacid intake.",
    },
    {
        "pair": ("ramipril", "spironolactone"),
        "severity": "Moderate",
        "description": "Co-administration of ACE inhibitor and potassium-sparing diuretic significantly elevates risk of hyperkalemia.",
        "recommendation": "Monitor serum potassium and renal function within 1-2 weeks of initiation.",
    },
    {
        "pair": ("metformin", "prednisolone"),
        "severity": "Moderate",
        "description": "Corticosteroids antagonize hypoglycemic effect of Metformin, leading to glycemic variability.",
        "recommendation": "Increase frequency of blood glucose monitoring and consider temporary insulin dose adjustment.",
    },
    {
        "pair": ("amoxicillin", "methotrexate"),
        "severity": "High",
        "description": "Penicillins reduce renal tubular clearance of Methotrexate, potentially causing severe toxicity (bone marrow suppression).",
        "recommendation": "Avoid concurrent use or monitor Methotrexate serum levels closely.",
    },
    {
        "pair": ("fluoxetine", "tramadol"),
        "severity": "High",
        "description": "Combined serotonergic action increases risk of potentially fatal Serotonin Syndrome and lowers seizure threshold.",
        "recommendation": "Avoid combination. Consider alternative non-serotonergic analgesic or monitor closely for agitation/clonus.",
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
        "dosage": "500mg once daily for 3-5 days",
    },
    "augmentin": {
        "alt": "Ciprofloxacin 500mg or Clarithromycin 500mg",
        "reason": "Broad-spectrum coverage alternative avoiding penicillin backbone",
        "dosage": "500mg twice daily",
    },
    "ibuprofen": {
        "alt": "Paracetamol 1000mg + Tramadol (if severe)",
        "reason": "Safe analgesic avoiding NSAID allergy or gastrointestinal irritation",
        "dosage": "1000mg every 6 hours (max 4g/day)",
    },
    "omeprazole": {
        "alt": "Pantoprazole 40mg",
        "reason": "Lower CYP2C19 interaction potential; safe with antiplatelet therapy",
        "dosage": "40mg once daily before breakfast",
    },
    "diclofenac": {
        "alt": "Celecoxib 200mg or Paracetamol 1000mg",
        "reason": "COX-2 selective alternative or non-NSAID analgesic option",
        "dosage": "200mg once daily or 1000mg QDS",
    },
    "aspirin": {
        "alt": "Clopidogrel 75mg",
        "reason": "Antiplatelet alternative for aspirin-intolerant or allergic patients",
        "dosage": "75mg once daily",
    },
    "metformin": {
        "alt": "Sitagliptin 100mg or Insulin therapy",
        "reason": "Renal-safe antidiabetic alternative when Metformin is contraindicated in elderly/renal impairment",
        "dosage": "100mg once daily (Sitagliptin) — dose adjust per eGFR",
    },
    "warfarin": {
        "alt": "Apixaban 5mg or Rivaroxaban 20mg",
        "reason": "Direct oral anticoagulant with predictable pharmacokinetics; reduced monitoring burden",
        "dosage": "Apixaban 5mg twice daily (reduce to 2.5mg if ≥2 of: age≥80, weight≤60kg, creatinine≥133μmol/L)",
    },
    "tramadol": {
        "alt": "Paracetamol 1000mg ± Codeine 30mg (if no opioid allergy)",
        "reason": "Non-serotonergic analgesic alternative; safer with SSRIs/SNRIs",
        "dosage": "Paracetamol 1000mg QDS; Codeine 30mg PRN (max 240mg/day)",
    },
}

# ─── Dosage Safety Rules ──────────────────────────────────────────────────────

# Format: { drug_keyword: { "paediatric": message, "geriatric": message } }
# Only one or both keys needed; None means no warning for that age group.
DOSAGE_SAFETY_RULES: Dict[str, Dict] = {
    "aspirin": {
        "paediatric": (
            "DOSAGE WARNING: Aspirin is contraindicated in children under 16 "
            "(Reye's Syndrome risk). Use Paracetamol as an antipyretic/analgesic alternative."
        ),
        "geriatric": (
            "DOSAGE WARNING: High-dose Aspirin in patients ≥65 increases GI bleed and "
            "renal impairment risk. Ensure gastroprotection (PPI) and review dosage necessity."
        ),
    },
    "ibuprofen": {
        "paediatric": (
            "DOSAGE WARNING: Weight-based dosing required for Ibuprofen in children — "
            "standard adult doses (400–800mg) may cause toxicity. Verify mg/kg calculation."
        ),
        "geriatric": (
            "DOSAGE WARNING: NSAIDs (Ibuprofen) should be used with extreme caution in "
            "patients ≥65 due to increased risk of renal impairment, GI haemorrhage, and "
            "fluid retention. Consider Paracetamol as first-line."
        ),
    },
    "metformin": {
        "paediatric": (
            "DOSAGE WARNING: Metformin is not licensed for use in children under 10 years. "
            "Consult paediatric endocrinologist before prescribing."
        ),
        "geriatric": (
            "DOSAGE WARNING: Metformin requires renal function check in patients ≥65. "
            "Reduce dose or withhold if eGFR < 45 mL/min to prevent lactic acidosis."
        ),
    },
    "warfarin": {
        "paediatric": (
            "DOSAGE WARNING: Warfarin dosing in children is highly variable and requires "
            "specialist haematology supervision with frequent INR monitoring."
        ),
        "geriatric": (
            "DOSAGE WARNING: Elderly patients (≥65) on Warfarin have significantly higher "
            "bleeding risk. Aim for lower target INR (1.8–2.5) and review concomitant drugs."
        ),
    },
    "diclofenac": {
        "geriatric": (
            "DOSAGE WARNING: Diclofenac in patients ≥65 carries elevated cardiovascular and "
            "renal risk. Consider short-course only with gastroprotection."
        ),
    },
    "tramadol": {
        "paediatric": (
            "DOSAGE WARNING: Tramadol is contraindicated in children under 12 and in "
            "children under 18 following tonsillectomy/adenoidectomy due to respiratory risk."
        ),
        "geriatric": (
            "DOSAGE WARNING: Tramadol in patients ≥65 increases seizure risk and can cause "
            "confusion/falls. Start at lowest effective dose and titrate slowly."
        ),
    },
    "codeine": {
        "paediatric": (
            "DOSAGE WARNING: Codeine is contraindicated in children under 12 and "
            "post-tonsillectomy patients under 18 (risk of fatal respiratory depression)."
        ),
    },
    "prednisolone": {
        "paediatric": (
            "DOSAGE WARNING: Corticosteroids (Prednisolone) in children require weight-based "
            "dosing. Prolonged use risks growth suppression — use lowest effective dose."
        ),
    },
}

PAEDIATRIC_AGE_THRESHOLD = 12   # < 12 years → paediatric warnings
GERIATRIC_AGE_THRESHOLD = 65    # ≥ 65 years → geriatric warnings


# ─── Clinical Functions ───────────────────────────────────────────────────────

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
                            f"CRITICAL ALLERGY ALERT: '{med.title()}' is contraindicated "
                            f"for patient with documented '{allergen.title()}' allergy."
                        )

    return warnings


def check_dosage_safety(medications: List[str], patient_age: Optional[int]) -> List[str]:
    """
    Rule-based dosage safety check using patient age.
    Returns age-appropriate warnings for paediatric (< 12) and geriatric (≥ 65) patients.
    No warnings are generated when patient_age is None or falls within 12–64.
    """
    if patient_age is None:
        return []

    warnings: List[str] = []
    meds_clean = [m.lower().strip() for m in medications]
    is_paediatric = patient_age < PAEDIATRIC_AGE_THRESHOLD
    is_geriatric = patient_age >= GERIATRIC_AGE_THRESHOLD

    if not is_paediatric and not is_geriatric:
        return []

    for med in meds_clean:
        for drug_key, age_rules in DOSAGE_SAFETY_RULES.items():
            if drug_key in med:
                if is_paediatric and "paediatric" in age_rules:
                    warnings.append(age_rules["paediatric"])
                if is_geriatric and "geriatric" in age_rules:
                    warnings.append(age_rules["geriatric"])

    return warnings


def find_alternative_medicines(
    medications: List[str],
    flagged_reasons: Dict[str, str],
    out_of_stock: Optional[List[str]] = None,
) -> List[AlternativeDrug]:
    """
    Finds bioequivalent / therapeutic alternatives for:
    - Drugs flagged by DDI or allergy contraindications (via flagged_reasons)
    - Drugs that are currently out of stock at the pharmacy (via out_of_stock)

    Out-of-stock alternatives are a logistical recommendation only and do NOT
    affect safe_to_dispense or safety_score.
    """
    alternatives: List[AlternativeDrug] = []
    meds_clean = [m.lower().strip() for m in medications]
    oos_clean = [m.lower().strip() for m in (out_of_stock or [])]

    seen: set = set()  # prevent duplicate entries for the same drug

    for med in meds_clean:
        for orig, alt_data in BIOEQUIVALENT_ALTERNATIVES.items():
            if orig not in med:
                continue

            # Clinical flag takes priority over out-of-stock label
            if orig in flagged_reasons and orig not in seen:
                alternatives.append(
                    AlternativeDrug(
                        original_drug=med.title(),
                        alternative_drug=alt_data["alt"],
                        reason=flagged_reasons[orig],
                        dosage_guidance=alt_data["dosage"],
                    )
                )
                seen.add(orig)

            elif any(orig in oos for oos in oos_clean) and orig not in seen:
                alternatives.append(
                    AlternativeDrug(
                        original_drug=med.title(),
                        alternative_drug=alt_data["alt"],
                        reason=f"OUT-OF-STOCK: {med.title()} is currently unavailable at this pharmacy. "
                               f"{alt_data['reason']}",
                        dosage_guidance=alt_data["dosage"],
                    )
                )
                seen.add(orig)

    return alternatives


def _build_deterministic_summary(
    safe_to_dispense: bool,
    interactions: List[DrugInteraction],
    allergy_warnings: List[str],
    dosage_warnings: List[str],
    medications: List[str],
) -> str:
    """Constructs a deterministic clinical summary string."""
    if safe_to_dispense and not interactions and not dosage_warnings:
        return (
            f"Prescription verified: {len(medications)} medication(s) checked. "
            "No drug interactions, allergy conflicts, or dosage concerns detected. Safe to dispense."
        )

    if not safe_to_dispense:
        issue_count = len(allergy_warnings) + sum(1 for i in interactions if i.severity == "High")
        parts = [f"⚠️ Dispensing Warning: Detected {issue_count} critical safety flag(s)."]
        if allergy_warnings:
            parts.append(f"{len(allergy_warnings)} allergy contraindication(s) found.")
        if any(i.severity == "High" for i in interactions):
            parts.append("High-severity drug interaction(s) present.")
        parts.append("Human pharmacist review and intervention required before dispensing.")
        return " ".join(parts)

    # Moderate interactions or dosage warnings only
    cautions = []
    if interactions:
        cautions.append(f"{len(interactions)} moderate interaction(s) detected")
    if dosage_warnings:
        cautions.append(f"{len(dosage_warnings)} age-related dosage concern(s)")
    caution_str = " and ".join(cautions)
    return (
        f"Caution: {caution_str.capitalize()}. "
        "Review dosing intervals, monitor patient clinical status, and confirm with prescriber."
    )


def generate_summary_with_gemini(
    deterministic_summary: str,
    interactions: List[DrugInteraction],
    allergy_warnings: List[str],
    dosage_warnings: List[str],
    medications: List[str],
    safe_to_dispense: bool,
    safety_score: int,
) -> str:
    """
    Uses Gemini 1.5 Flash to produce a clearer, more readable pharmacist summary.

    STRICT GROUNDING CONSTRAINTS:
    - Gemini may ONLY rephrase facts already present in the structured data below.
    - Gemini MUST NOT invent interactions, drugs, side effects, or clinical facts
      that are not explicitly listed in the prompt.
    - The output is purely cosmetic — it cannot change clinical flags or scores.

    Falls back to deterministic_summary on any failure or timeout.
    """
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not set — using deterministic summary.")
        return deterministic_summary

    try:
        import google.generativeai as genai
        import concurrent.futures

        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Build a structured context block so Gemini is strictly grounded
        interaction_lines = "\n".join(
            f"  - {i.drug_pair[0]} + {i.drug_pair[1]} [{i.severity}]: {i.description}"
            for i in interactions
        ) or "  None detected."

        allergy_lines = "\n".join(f"  - {w}" for w in allergy_warnings) or "  None detected."
        dosage_lines = "\n".join(f"  - {w}" for w in dosage_warnings) or "  None detected."

        prompt = f"""You are a clinical pharmacist assistant at MediFlow Hospital.
Your ONLY job is to rewrite the 'Deterministic Summary' below into clear, professional,
plain-English guidance for a dispensing pharmacist.

STRICT RULES — you MUST follow these without exception:
1. Do NOT introduce ANY drug name, interaction, side effect, or clinical fact
   that is not already present in the 'Verified Clinical Data' section below.
2. Do NOT change the clinical verdict: safe_to_dispense = {safe_to_dispense}, safety_score = {safety_score}/100.
3. Keep the response to 2-4 sentences maximum.
4. Use professional but accessible language — avoid jargon where plain words work.
5. If safe_to_dispense is False, always end with a clear instruction to NOT dispense without pharmacist sign-off.

=== VERIFIED CLINICAL DATA (source of truth — do not deviate from this) ===
Medications checked: {', '.join(medications)}
Safe to dispense: {safe_to_dispense}
Safety score: {safety_score}/100

Drug-Drug Interactions:
{interaction_lines}

Allergy Warnings:
{allergy_lines}

Dosage Warnings:
{dosage_lines}
=== END VERIFIED DATA ===

Deterministic Summary (rephrase this, using only facts above):
{deterministic_summary}

Your rephrased pharmacist summary:"""

        # Run with a 5-second hard timeout via a thread pool
        def _call_gemini() -> str:
            response = model.generate_content(prompt)
            return response.text.strip()

        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(_call_gemini)
            try:
                gemini_text = future.result(timeout=5.0)
                if gemini_text:
                    logger.info("Gemini summary generated successfully.")
                    return gemini_text
            except concurrent.futures.TimeoutError:
                logger.warning("Gemini API call timed out (>5s) — using deterministic summary.")
                return deterministic_summary

    except Exception as exc:
        logger.warning(f"Gemini summary generation failed ({type(exc).__name__}: {exc}) — using deterministic summary.")

    return deterministic_summary


# ─── LangGraph State Definition ───────────────────────────────────────────────

class MedCheckState(TypedDict):
    # Input
    medications: List[str]
    patient_allergies: Optional[str]
    patient_age: Optional[int]
    out_of_stock_medications: List[str]
    # Intermediate
    interactions: List[DrugInteraction]
    allergy_warnings: List[str]
    dosage_warnings: List[str]
    flagged_reasons: Dict[str, str]
    # Output
    alternatives: List[AlternativeDrug]
    safety_score: int
    safe_to_dispense: bool
    summary: str


# ─── LangGraph Node Functions ─────────────────────────────────────────────────

def node_check_interactions(state: MedCheckState) -> Dict[str, Any]:
    interactions = check_drug_interactions(state["medications"])
    return {"interactions": interactions}


def node_check_allergies(state: MedCheckState) -> Dict[str, Any]:
    allergy_warnings = check_allergy_contraindications(
        state["patient_allergies"], state["medications"]
    )
    return {"allergy_warnings": allergy_warnings}


def node_check_dosage(state: MedCheckState) -> Dict[str, Any]:
    dosage_warnings = check_dosage_safety(state["medications"], state["patient_age"])
    return {"dosage_warnings": dosage_warnings}


def node_find_alternatives(state: MedCheckState) -> Dict[str, Any]:
    # Build flagged_reasons from allergy warnings and DDI interactions
    flagged_reasons: Dict[str, str] = {}

    for w in state.get("allergy_warnings", []):
        for k in BIOEQUIVALENT_ALTERNATIVES:
            if k in w.lower() and k not in flagged_reasons:
                flagged_reasons[k] = "Allergy contraindication detected"

    for inter in state.get("interactions", []):
        for drug in inter.drug_pair:
            k = drug.lower()
            if k in BIOEQUIVALENT_ALTERNATIVES and k not in flagged_reasons:
                flagged_reasons[k] = f"DDI conflict ({inter.severity} severity)"

    alternatives = find_alternative_medicines(
        state["medications"],
        flagged_reasons,
        state.get("out_of_stock_medications"),
    )
    return {"alternatives": alternatives, "flagged_reasons": flagged_reasons}


def node_score_safety(state: MedCheckState) -> Dict[str, Any]:
    interactions = state.get("interactions", [])
    allergy_warnings = state.get("allergy_warnings", [])

    safety_score = 100
    for inter in interactions:
        if inter.severity == "High":
            safety_score -= 35
        elif inter.severity == "Moderate":
            safety_score -= 15
        else:
            safety_score -= 5

    if allergy_warnings:
        safety_score -= 40 * len(allergy_warnings)

    safety_score = max(0, min(100, safety_score))
    safe_to_dispense = (
        len(allergy_warnings) == 0
        and not any(i.severity == "High" for i in interactions)
    )

    return {"safety_score": safety_score, "safe_to_dispense": safe_to_dispense}


def node_generate_summary(state: MedCheckState) -> Dict[str, Any]:
    interactions = state.get("interactions", [])
    allergy_warnings = state.get("allergy_warnings", [])
    dosage_warnings = state.get("dosage_warnings", [])
    medications = state["medications"]
    safe_to_dispense = state["safe_to_dispense"]
    safety_score = state["safety_score"]

    # Always build deterministic summary first (ground truth)
    deterministic_summary = _build_deterministic_summary(
        safe_to_dispense, interactions, allergy_warnings, dosage_warnings, medications
    )

    # Attempt Gemini enhancement (cosmetic only, falls back on any failure)
    final_summary = generate_summary_with_gemini(
        deterministic_summary=deterministic_summary,
        interactions=interactions,
        allergy_warnings=allergy_warnings,
        dosage_warnings=dosage_warnings,
        medications=medications,
        safe_to_dispense=safe_to_dispense,
        safety_score=safety_score,
    )

    return {"summary": final_summary}


# ─── Build LangGraph StateGraph ───────────────────────────────────────────────

def _build_graph() -> Any:
    graph = StateGraph(MedCheckState)

    graph.add_node("check_interactions", node_check_interactions)
    graph.add_node("check_allergies", node_check_allergies)
    graph.add_node("check_dosage", node_check_dosage)
    graph.add_node("find_alternatives", node_find_alternatives)
    graph.add_node("score_safety", node_score_safety)
    graph.add_node("generate_summary", node_generate_summary)

    # Execution order:
    # check_interactions → check_allergies → check_dosage → find_alternatives
    #   → score_safety → generate_summary → END
    graph.set_entry_point("check_interactions")
    graph.add_edge("check_interactions", "check_allergies")
    graph.add_edge("check_allergies", "check_dosage")
    graph.add_edge("check_dosage", "find_alternatives")
    graph.add_edge("find_alternatives", "score_safety")
    graph.add_edge("score_safety", "generate_summary")
    graph.add_edge("generate_summary", END)

    return graph.compile()


# Compiled graph — built once at import time
_medication_graph = _build_graph()


# ─── Public API ───────────────────────────────────────────────────────────────

def evaluate_medication_intelligence(payload: MedicationCheckInput) -> MedicationCheckResult:
    """
    Main evaluation entry point for the Medication Intelligence Agent (Agent 3).

    Invokes the LangGraph StateGraph pipeline:
      check_interactions → check_allergies → check_dosage →
      find_alternatives → score_safety → generate_summary

    Returns a MedicationCheckResult whose safe_to_dispense and safety_score
    are always determined by deterministic clinical logic. The summary field
    is enhanced by Gemini when available, with graceful fallback.
    """
    initial_state: MedCheckState = {
        "medications": payload.medications,
        "patient_allergies": payload.patient_allergies,
        "patient_age": payload.patient_age,
        "out_of_stock_medications": payload.out_of_stock_medications or [],
        # Initialise all output fields
        "interactions": [],
        "allergy_warnings": [],
        "dosage_warnings": [],
        "flagged_reasons": {},
        "alternatives": [],
        "safety_score": 100,
        "safe_to_dispense": True,
        "summary": "",
    }

    final_state = _medication_graph.invoke(initial_state)

    return MedicationCheckResult(
        safe_to_dispense=final_state["safe_to_dispense"],
        safety_score=final_state["safety_score"],
        interactions=final_state["interactions"],
        allergy_warnings=final_state["allergy_warnings"],
        dosage_warnings=final_state["dosage_warnings"],
        alternatives=final_state["alternatives"],
        summary=final_state["summary"],
    )
