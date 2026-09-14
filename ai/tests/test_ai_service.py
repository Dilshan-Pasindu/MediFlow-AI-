import pytest
from fastapi.testclient import TestClient
from ai.main import app
from ai.schemas.agent_schemas import SymptomInput
from ai.agents.specialist_recommender import recommend_specialist


@pytest.fixture
def client():
    return TestClient(app)


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "mediflow-ai-service"


def test_recommend_specialist_cardiology(client):
    payload = {
        "symptoms": ["chest pain", "shortness of breath", "palpitations"],
        "patient_notes": "Occurs when climbing stairs",
        "severity": "severe",
    }
    response = client.post("/api/ai/recommend-specialist", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["recommended_specialty"] == "Cardiology"
    assert data["confidence_score"] >= 0.8
    assert "Cardiology" in data["rationale"]
    assert len(data["suggested_actions"]) > 0


def test_recommend_specialist_dermatology(client):
    payload = {
        "symptoms": ["skin rash", "itching", "red patches on arms"],
        "severity": "mild",
    }
    response = client.post("/api/ai/recommend-specialist", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["recommended_specialty"] == "Dermatology"


def test_recommend_specialist_general_fallback():
    input_data = SymptomInput(
        symptoms=["general fatigue", "mild unease"],
        severity="mild",
    )
    result = recommend_specialist(input_data)
    assert result.recommended_specialty == "General Medicine"
    assert result.confidence_score > 0.5


def test_recommend_specialist_validation_error(client):
    response = client.post("/api/ai/recommend-specialist", json={"symptoms": []})
    assert response.status_code == 422  # Pydantic min_length validation failure


def test_clinical_cds_agent(client):
    payload = {
        "symptoms": "Severe epigastric pain after meals, acid regurgitation",
        "chief_complaint": "Heartburn and nausea",
        "vitals": {"bp": "120/80", "temp": "37.0", "pulse": "75", "spo2": "98%"},
        "patient_allergies": "Penicillin"
    }
    response = client.post("/api/ai/clinical-cds", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["diagnoses"]) >= 1
    assert len(data["thoughtStream"]) >= 3
    assert len(data["labDrafts"]) >= 1
    assert len(data["medicationDrafts"]) >= 1
    assert any("ALLERGY ALERT" in w for w in data["warnings"])


def test_medication_check_agent_ddi(client):
    payload = {
        "medications": ["Warfarin 5mg", "Aspirin 75mg"],
        "patient_allergies": None,
    }
    response = client.post("/api/ai/medication-check", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["safe_to_dispense"] is False
    assert len(data["interactions"]) >= 1
    assert data["interactions"][0]["severity"] == "High"
    assert data["safety_score"] < 70


def test_medication_check_agent_allergy_and_alternative(client):
    payload = {
        "medications": ["Amoxicillin 500mg"],
        "patient_allergies": "Penicillin",
    }
    response = client.post("/api/ai/medication-check", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["safe_to_dispense"] is False
    assert len(data["allergy_warnings"]) >= 1
    assert any("Azithromycin" in a["alternative_drug"] for a in data["alternatives"])


def test_inventory_forecast_agent(client):
    payload = {
        "pharmacy_id": 1,
        "lookback_days": 30
    }
    response = client.post("/api/ai/inventory-forecast", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["pharmacy_id"] == 1
    assert len(data["risk_items"]) > 0
    assert len(data["restock_recommendations"]) > 0
    assert data["total_projected_cost"] > 0
    assert "Pharmacy #1" in data["summary"]


