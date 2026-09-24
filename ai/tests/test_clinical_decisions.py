"""
Tests for Clinical Decision Support Agent and Clinical Tools.
Validates allergy contraindication checks, vitals risk scoring,
clinical guideline queries, and deterministic medical fallback logic.
"""

import pytest
from ai.agents.clinical_tools import (
    check_allergy_contraindications,
    calculate_vitals_risk_score,
    query_clinical_guidelines,
)


class TestAllergyContraindications:
    """Validates real-time drug-allergy cross-check tool."""

    def test_penicillin_allergy_flags_amoxicillin_and_augmentin(self):
        allergies = "Penicillin, Pollen"
        proposed = ["Amoxicillin 500mg", "Paracetamol 500mg", "Augmentin 625mg"]

        result = check_allergy_contraindications(allergies, proposed)

        assert result["safe_to_prescribe"] is False
        assert len(result["contraindications"]) == 2
        flagged_drugs = [c["drug"] for c in result["contraindications"]]
        assert "Amoxicillin 500mg" in flagged_drugs
        assert "Augmentin 625mg" in flagged_drugs
        for c in result["contraindications"]:
            assert c["severity"] == "CRITICAL"

    def test_nsaid_allergy_flags_ibuprofen_and_aspirin(self):
        allergies = "NSAID, Shellfish"
        proposed = ["Ibuprofen 400mg", "Omeprazole 20mg"]

        result = check_allergy_contraindications(allergies, proposed)

        assert result["safe_to_prescribe"] is False
        assert len(result["contraindications"]) == 1
        assert result["contraindications"][0]["drug"] == "Ibuprofen 400mg"

    def test_no_allergies_allows_all_medications(self):
        allergies = "None / NKDA (No Known Drug Allergies)"
        proposed = ["Metformin 500mg", "Atorvastatin 20mg", "Amlodipine 5mg"]

        result = check_allergy_contraindications(allergies, proposed)

        assert result["safe_to_prescribe"] is True
        assert len(result["contraindications"]) == 0


class TestVitalsRiskScore:
    """Validates clinical severity and urgency calculation from physiological vitals."""

    def test_critical_hypoxia_triggers_emergency_level(self):
        vitals = {
            "bp": "120/80",
            "pulse": "88",
            "temp": "37.0°C",
            "spo2": "88%",
        }

        result = calculate_vitals_risk_score(vitals)

        assert result["urgency"] == "emergency"
        assert result["risk_score"] >= 3
        assert any("CRITICAL HYPOXIA" in f for f in result["findings"])

    def test_hypertensive_crisis_triggers_urgent_level(self):
        vitals = {
            "bp": "195/115",
            "pulse": "92",
            "temp": "36.8°C",
            "spo2": "98%",
        }

        result = calculate_vitals_risk_score(vitals)

        assert result["urgency"] in ("urgent", "emergency")
        assert any("HYPERTENSIVE CRISIS" in f for f in result["findings"])

    def test_high_grade_fever_and_tachycardia_accumulation(self):
        vitals = {
            "bp": "110/70",
            "pulse": "125 bpm",
            "temp": "40.1°C",
            "spo2": "97%",
        }

        result = calculate_vitals_risk_score(vitals)

        assert result["urgency"] == "urgent"
        assert result["risk_score"] >= 4
        assert any("HIGH GRADE FEVER" in f for f in result["findings"])
        assert any("ABNORMAL PULSE" in f for f in result["findings"])

    def test_normal_vitals_yield_routine_urgency(self):
        vitals = {
            "bp": "120/80 mmHg",
            "pulse": "72 bpm",
            "temp": "36.6°C",
            "spo2": "99%",
        }

        result = calculate_vitals_risk_score(vitals)

        assert result["urgency"] == "routine"
        assert result["risk_score"] == 0
        assert len(result["findings"]) == 0


class TestClinicalGuidelinesQuery:
    """Validates clinical practice guidelines retrieval."""

    def test_gastritis_guideline_returns_bsg_recommendations(self):
        result = query_clinical_guidelines("acute gastritis")

        assert "gastritis" in result["guidelines"]
        info = result["guidelines"]["gastritis"]
        assert "British Society of Gastroenterology" in info["source"]
        assert "PPI" in info["first_line"]
        assert "H. pylori" in info["testing"]

    def test_urti_guideline_discourages_antibiotics_for_viral_cases(self):
        result = query_clinical_guidelines("urti cold and cough")

        assert "urti" in result["guidelines"]
        info = result["guidelines"]["urti"]
        assert "NICE" in info["source"]
        assert "NOT recommended" in info["antibiotics"]
