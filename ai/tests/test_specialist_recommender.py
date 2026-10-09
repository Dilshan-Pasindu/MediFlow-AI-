"""
Tests for Specialist Recommender Agent (ai.agents.specialist_recommender).
Validates 22 medical specialty routing rules, crisis & emergency interception,
system checker audits, clinical confidence scoring, and deterministic fallback behavior.
"""

import pytest
from ai.agents.specialist_recommender import (
    SPECIALTY_RULES,
    _check_crisis_or_emergency_interception,
    _rule_based_recommendation,
    _build_system_checker,
    recommend_specialist,
)
from ai.schemas.agent_schemas import SymptomInput, SpecialistRecommendation


class TestSpecialtyRulesCoverage:
    """Validates clinical knowledge base rules across medical specialties."""

    def test_specialty_rules_exist_and_non_empty(self):
        assert len(SPECIALTY_RULES) >= 15
        for specialty, keywords in SPECIALTY_RULES.items():
            assert isinstance(specialty, str)
            assert len(keywords) > 0

    @pytest.mark.parametrize(
        "symptoms,expected_specialty",
        [
            (["chest pain", "shortness of breath", "palpitations"], "Cardiology"),
            (["skin rash", "severe itching", "eczema"], "Dermatology"),
            (["severe headache", "migraine", "dizziness"], "Neurology"),
            (["knee pain", "swollen knee", "fracture"], "Orthopedics"),
            (["chronic cough", "wheezing", "asthma"], "Pulmonology"),
            (["diabetes", "high blood sugar", "hyperthyroidism"], "Endocrinology"),
            (["severe depression", "crippling anxiety", "panic attack"], "Psychiatry"),
        ],
    )
    def test_rule_based_recommendation_routes_correctly(self, symptoms, expected_specialty):
        inp = SymptomInput(symptoms=symptoms, severity="moderate")
        result = _rule_based_recommendation(inp)
        assert result.recommended_specialty == expected_specialty
        assert result.confidence_score >= 0.70
        assert len(result.suggested_actions) > 0


class TestCrisisAndEmergencyInterception:
    """Validates emergency life-threat and crisis red flag detection."""

    def test_suicidal_ideation_intercepts_to_psychiatry(self):
        text = "I have suicidal thoughts and want to kill myself"
        crisis = _check_crisis_or_emergency_interception(text, severity="severe")
        assert crisis is not None
        assert crisis.recommended_specialty == "Psychiatry"
        assert crisis.confidence_score == 1.0
        assert "CRITICAL CRISIS SAFETY ALERT" in crisis.rationale
        assert any("988" in action for action in crisis.suggested_actions)
        assert any("1926" in action for action in crisis.suggested_actions)
        assert crisis.system_checker is not None
        assert crisis.system_checker.status == "WARNING"

    def test_emergency_chest_pain_and_collapse_intercepts_to_emergency_medicine(self):
        text = "crushing chest pain, blue lips, collapsed"
        emergency = _check_crisis_or_emergency_interception(text, severity="severe")
        assert emergency is not None
        assert emergency.recommended_specialty == "Emergency Medicine"
        assert emergency.confidence_score == 1.0
        assert "EMERGENCY" in emergency.rationale.upper()
        assert any("1990" in action or "911" in action or "ER" in action for action in emergency.suggested_actions)

    def test_non_crisis_symptoms_return_none(self):
        text = "mild headache, stuffy nose"
        intercept = _check_crisis_or_emergency_interception(text, severity="mild")
        assert intercept is None


class TestDeterministicFallbackAndGeneralMedicine:
    """Validates fallback mechanisms when no specialized keywords match."""

    def test_vague_unmatched_symptoms_fallback_to_general_medicine(self):
        inp = SymptomInput(
            symptoms=["feeling a bit off", "unspecified sluggishness"],
            severity="mild"
        )
        result = _rule_based_recommendation(inp)
        assert result.recommended_specialty == "General Medicine"
        assert 0.50 <= result.confidence_score <= 0.75
        assert "General Medicine" in result.rationale

    def test_severity_influences_suggested_actions(self):
        mild_inp = SymptomInput(symptoms=["joint pain"], severity="mild")
        severe_inp = SymptomInput(symptoms=["joint pain"], severity="severe")

        mild_res = _rule_based_recommendation(mild_inp)
        severe_res = _rule_based_recommendation(severe_inp)

        assert mild_res.recommended_specialty == "Orthopedics"
        assert severe_res.recommended_specialty == "Orthopedics"
        assert any("urgent" in a.lower() or "same-day" in a.lower() or "prompt" in a.lower() for a in severe_res.suggested_actions)


class TestSystemCheckerAudit:
    """Validates safety and compliance audit items produced by the agent."""

    def test_build_system_checker_valid_structure(self):
        checker = _build_system_checker(
            recommended="Cardiology",
            confidence=0.88,
            symptoms_text="chest pain, shortness of breath",
            is_gemini=False,
            rag_protocol="Cardiology Guidelines",
        )
        assert checker.status in ("PASSED", "PASS")
        assert len(checker.checks) >= 4
        names = [c.name for c in checker.checks]
        assert "Medical Domain Mapping" in names
        assert "Confidence Threshold Check" in names
        assert "Emergency Red Flag Screening" in names


class TestRecommendSpecialistEndToEnd:
    """Validates the primary entry point recommend_specialist()."""

    def test_recommend_specialist_with_patient_notes(self):
        inp = SymptomInput(
            symptoms=["skin rash", "itchy hives"],
            patient_notes="Started 2 days ago after eating shellfish",
            severity="moderate",
        )
        res = recommend_specialist(inp)
        assert isinstance(res, SpecialistRecommendation)
        assert res.recommended_specialty in ("Dermatology", "Allergy and Immunology")
        assert res.confidence_score > 0.6
        assert len(res.suggested_actions) > 0
        assert res.system_checker is not None
