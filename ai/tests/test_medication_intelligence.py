"""
Tests for Medication Intelligence Agent (ai.agents.medication_intelligence).
Validates real-time drug-drug interaction (DDI) detection, patient allergy contraindications,
pediatric/geriatric dosage safety checks, bioequivalent alternative suggestions,
safety scoring (0-100), and end-to-end LangGraph evaluation.
"""

import pytest
from ai.agents.medication_intelligence import (
    check_drug_interactions,
    check_allergy_contraindications,
    check_dosage_safety,
    find_alternative_medicines,
    node_score_safety,
    _build_deterministic_summary,
    evaluate_medication_intelligence,
)
from ai.schemas.agent_schemas import (
    MedicationCheckInput,
    MedicationCheckResult,
    DrugInteraction,
)


class TestDrugInteractions:
    """Validates real-time clinical drug-drug interaction checks."""

    def test_warfarin_and_aspirin_flags_high_severity_bleeding_risk(self):
        meds = ["Warfarin 5mg", "Aspirin 75mg"]
        interactions = check_drug_interactions(meds)
        assert len(interactions) >= 1
        high_ddi = [i for i in interactions if i.severity == "High"]
        assert len(high_ddi) >= 1
        assert any("Warfarin" in i.drug_pair and "Aspirin" in i.drug_pair for i in high_ddi)
        assert "hemorrhage" in high_ddi[0].description.lower() or "bleeding" in high_ddi[0].description.lower()

    def test_fluoxetine_and_tramadol_flags_high_severity_serotonin_syndrome(self):
        meds = ["Fluoxetine 20mg", "Tramadol 50mg"]
        interactions = check_drug_interactions(meds)
        assert len(interactions) >= 1
        high_ddi = [i for i in interactions if i.severity == "High"]
        assert len(high_ddi) >= 1
        assert any("Fluoxetine" in i.drug_pair and "Tramadol" in i.drug_pair for i in high_ddi)
        assert "serotonin" in high_ddi[0].description.lower()

    def test_safe_medication_combination_returns_no_interactions(self):
        meds = ["Paracetamol 500mg", "Amoxicillin 250mg", "Cetirizine 10mg"]
        interactions = check_drug_interactions(meds)
        assert len(interactions) == 0

    def test_single_or_empty_medication_returns_no_interactions(self):
        assert len(check_drug_interactions(["Paracetamol 500mg"])) == 0
        assert len(check_drug_interactions([])) == 0


class TestAllergyContraindications:
    """Validates patient drug allergy safety checks against cross-reactivity rules."""

    def test_penicillin_allergy_flags_amoxicillin_and_augmentin(self):
        allergies = "Penicillin, Pollen"
        meds = ["Amoxicillin 500mg", "Paracetamol 500mg", "Augmentin 625mg"]
        warnings = check_allergy_contraindications(allergies, meds)
        assert len(warnings) >= 2
        warn_text = " ".join(warnings).lower()
        assert "amoxicillin" in warn_text
        assert "augmentin" in warn_text

    def test_sulfa_allergy_flags_cotrimoxazole(self):
        allergies = "Sulfa drugs, Peanuts"
        meds = ["Bactrim 480mg", "Sulfamethoxazole 400mg"]
        warnings = check_allergy_contraindications(allergies, meds)
        assert len(warnings) >= 1
        assert any("bactrim" in w.lower() or "sulfa" in w.lower() for w in warnings)

    def test_no_known_allergies_returns_empty_warnings(self):
        meds = ["Metformin 500mg", "Atorvastatin 20mg"]
        assert len(check_allergy_contraindications("None / NKDA", meds)) == 0
        assert len(check_allergy_contraindications(None, meds)) == 0


class TestDosageSafety:
    """Validates patient age-dependent dosage checks."""

    def test_aspirin_in_pediatric_patient_flags_reye_syndrome(self):
        meds = ["Aspirin 300mg", "Paracetamol 120mg"]
        warnings = check_dosage_safety(meds, patient_age=7)
        assert len(warnings) >= 1
        assert any("aspirin" in w.lower() and ("reye" in w.lower() or "pediatric" in w.lower() or "child" in w.lower()) for w in warnings)

    def test_adult_patient_does_not_trigger_pediatric_warning(self):
        meds = ["Aspirin 300mg"]
        warnings = check_dosage_safety(meds, patient_age=35)
        assert len(warnings) == 0

    def test_unknown_age_does_not_raise_exception(self):
        meds = ["Paracetamol 500mg", "Amoxicillin 500mg"]
        warnings = check_dosage_safety(meds, patient_age=None)
        assert isinstance(warnings, list)


class TestAlternativeMedicines:
    """Validates therapeutic and bioequivalent alternative suggestions."""

    def test_out_of_stock_generates_alternative_suggestions(self):
        meds = ["Amoxicillin 500mg", "Paracetamol 500mg"]
        alts = find_alternative_medicines(
            medications=meds,
            flagged_reasons={},
            out_of_stock=["Amoxicillin 500mg"],
        )
        assert len(alts) >= 1
        assert any("Amoxicillin" in a.original_drug for a in alts)
        assert any("out-of-stock" in a.reason.lower() or "unavailable" in a.reason.lower() for a in alts)

    def test_in_stock_safe_drugs_generate_no_unnecessary_alternatives(self):
        meds = ["Paracetamol 500mg"]
        alts = find_alternative_medicines(
            medications=meds,
            flagged_reasons={},
            out_of_stock=[],
        )
        assert len(alts) == 0


class TestSafetyScoring:
    """Validates safety score deduction and safe_to_dispense gatekeeper logic."""

    def test_clean_prescription_scores_100_and_safe_to_dispense(self):
        state = {"interactions": [], "allergy_warnings": []}
        res = node_score_safety(state)
        assert res["safety_score"] == 100
        assert res["safe_to_dispense"] is True

    def test_high_severity_interaction_penalizes_score_and_blocks_dispense(self):
        high_ddi = DrugInteraction(
            drug_pair=["Warfarin", "Aspirin"],
            severity="High",
            description="Severe bleeding risk",
            recommendation="Avoid co-prescribing",
        )
        state = {"interactions": [high_ddi], "allergy_warnings": []}
        res = node_score_safety(state)
        assert res["safety_score"] == 65
        assert res["safe_to_dispense"] is False

    def test_allergy_warning_penalizes_score_and_blocks_dispense(self):
        state = {
            "interactions": [],
            "allergy_warnings": ["Allergy Alert: Patient is allergic to Penicillin"],
        }
        res = node_score_safety(state)
        assert res["safety_score"] == 60
        assert res["safe_to_dispense"] is False


class TestDeterministicSummary:
    """Validates offline fallback clinical summary generation."""

    def test_safe_prescription_summary(self):
        summary = _build_deterministic_summary(
            safe_to_dispense=True,
            interactions=[],
            allergy_warnings=[],
            dosage_warnings=[],
            medications=["Paracetamol 500mg", "Amoxicillin 250mg"],
        )
        assert "safe to dispense" in summary.lower()
        assert "no drug interactions" in summary.lower()

    def test_unsafe_prescription_summary(self):
        high_ddi = DrugInteraction(
            drug_pair=["Warfarin", "Aspirin"],
            severity="High",
            description="Bleeding risk",
            recommendation="Avoid",
        )
        summary = _build_deterministic_summary(
            safe_to_dispense=False,
            interactions=[high_ddi],
            allergy_warnings=["Allergy Alert: Penicillin"],
            dosage_warnings=[],
            medications=["Warfarin 5mg", "Aspirin 75mg"],
        )
        assert "action required" in summary.lower() or "not safe" in summary.lower() or "warning" in summary.lower()


class TestEvaluateMedicationIntelligenceEndToEnd:
    """Validates the full LangGraph workflow execution for medication screening."""

    def test_clean_prescription_evaluates_healthy(self):
        inp = MedicationCheckInput(
            medications=["Paracetamol 500mg", "Amoxicillin 250mg"],
            patient_allergies="None",
            patient_age=28,
        )
        result = evaluate_medication_intelligence(inp)
        assert isinstance(result, MedicationCheckResult)
        assert result.safe_to_dispense is True
        assert result.safety_score == 100
        assert len(result.interactions) == 0
        assert len(result.allergy_warnings) == 0

    def test_high_risk_prescription_evaluates_unsafe(self):
        inp = MedicationCheckInput(
            medications=["Warfarin 5mg", "Aspirin 100mg"],
            patient_allergies=None,
            patient_age=60,
        )
        result = evaluate_medication_intelligence(inp)
        assert isinstance(result, MedicationCheckResult)
        assert result.safe_to_dispense is False
        assert result.safety_score < 75
        assert len(result.interactions) >= 1
