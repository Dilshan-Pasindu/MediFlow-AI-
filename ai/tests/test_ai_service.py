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
    """
    Tests the /api/ai/inventory-forecast endpoint with mocked backend tool calls.
    The real agent now fetches data from the backend; we mock httpx to avoid
    requiring a live backend in the test environment.
    """
    import os
    from unittest.mock import MagicMock, patch

    mock_backend_response = {
        "pharmacyId": 1,
        "generatedAt": "2026-09-16T06:00:00Z",
        "recommendations": [],
        "agentContext": {
            "pharmacyId": 1,
            "pharmacyName": "Test Pharmacy",
            "contextGeneratedAt": "2026-09-16T06:00:00Z",
            "items": [
                {
                    "medicineId": 101, "medicineName": "Amoxicillin 500mg Capsule",
                    "category": "Antibiotic", "currentStock": 18, "minStockLevel": 50,
                    "unitPrice": 45.0, "demandRateLast30Days": 9.0,
                    "totalDispensedLast30Days": 270, "totalRestockedLast30Days": 0,
                    "daysUntilStockOut": 2.0, "expiringBatches": [],
                },
                {
                    "medicineId": 102, "medicineName": "Paracetamol 500mg Tablet",
                    "category": "Analgesic", "currentStock": 500, "minStockLevel": 100,
                    "unitPrice": 5.0, "demandRateLast30Days": 20.0,
                    "totalDispensedLast30Days": 600, "totalRestockedLast30Days": 1000,
                    "daysUntilStockOut": 25.0, "expiringBatches": [],
                },
            ],
        },
    }

    mock_post_resp = MagicMock()
    mock_post_resp.status_code = 200
    mock_post_resp.raise_for_status = MagicMock()
    mock_post_resp.json.return_value = mock_backend_response

    mock_get_resp = MagicMock()
    mock_get_resp.status_code = 200
    mock_get_resp.raise_for_status = MagicMock()
    mock_get_resp.json.return_value = []  # empty transactions — non-fatal

    env_patch = {
        "BACKEND_URL": "http://mock-backend:5000",
        "BACKEND_SERVICE_TOKEN": "mock-test-token",
    }

    with patch.dict(os.environ, env_patch):
        with patch("httpx.Client") as mock_client_cls:
            mock_client = mock_client_cls.return_value.__enter__.return_value
            mock_client.post.return_value = mock_post_resp
            mock_client.get.return_value = mock_get_resp

            payload = {"pharmacy_id": 1, "lookback_days": 30}
            response = client.post("/api/ai/inventory-forecast", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["pharmacy_id"] == 1
    assert len(data["risk_items"]) > 0
    assert len(data["restock_recommendations"]) > 0
    assert data["total_projected_cost"] > 0
    # Approval gate message must be present in summary
    assert "approval" in data["summary"].lower() or "APPROVAL" in data["summary"]
    # Real pharmacy name from backend context must appear in summary
    assert "Test Pharmacy" in data["summary"]
    # Workflow audit must be populated with all 6 tools
    assert data["workflow_audit"] is not None
    tool_names = [s["tool"] for s in data["workflow_audit"]["steps"]]
    for expected_tool in [
        "getInventory", "getHistoricalOrders", "calculateDemand",
        "forecastDemand", "predictStockout", "generateRestockRecommendation"
    ]:
        assert expected_tool in tool_names, f"Tool '{expected_tool}' missing from audit steps"


