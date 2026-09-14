import os
import sys
from pathlib import Path

# Add project root and ai directory to sys.path so modules resolve correctly in all environments
_current_dir = Path(__file__).resolve().parent
_workspace_root = _current_dir.parent
for _p in [str(_workspace_root), str(_current_dir)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

try:
    from ai.schemas.agent_schemas import (
        HealthCheckResponse,
        SymptomInput,
        SpecialistRecommendation,
        ClinicalCDSInput,
        ClinicalCDSResult,
        MedicationCheckInput,
        MedicationCheckResult,
        InventoryForecastInput,
        InventoryForecastResult,
    )
    from ai.agents.specialist_recommender import recommend_specialist
    from ai.agents.clinical_decision_support import evaluate_clinical_decision_support
    from ai.agents.medication_intelligence import evaluate_medication_intelligence
    from ai.agents.inventory_intelligence import evaluate_inventory_intelligence
except ImportError:
    from schemas.agent_schemas import (  # type: ignore
        HealthCheckResponse,
        SymptomInput,
        SpecialistRecommendation,
        ClinicalCDSInput,
        ClinicalCDSResult,
        MedicationCheckInput,
        MedicationCheckResult,
        InventoryForecastInput,
        InventoryForecastResult,
    )
    from agents.specialist_recommender import recommend_specialist  # type: ignore
    from agents.clinical_decision_support import evaluate_clinical_decision_support  # type: ignore
    from agents.medication_intelligence import evaluate_medication_intelligence  # type: ignore
    from agents.inventory_intelligence import evaluate_inventory_intelligence  # type: ignore

app = FastAPI(
    title="MediFlow AI Microservice",
    description="Agentic clinical reasoning and decision support service for MediFlow",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthCheckResponse, tags=["Health"])
async def health_check():
    """Returns service health status."""
    return HealthCheckResponse(status="healthy", service="mediflow-ai-service", version="1.0.0")


@app.post("/api/ai/recommend-specialist", response_model=SpecialistRecommendation, tags=["Agents"])
async def get_specialist_recommendation(payload: SymptomInput):
    """
    Accepts patient symptoms and returns the recommended medical department with clinical rationale.
    """
    if not payload.symptoms:
        raise HTTPException(status_code=400, detail="At least one symptom must be provided")

    try:
        recommendation = recommend_specialist(payload)
        return recommendation
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Recommendation pipeline failed: {str(exc)}")


@app.post("/api/ai/clinical-cds", response_model=ClinicalCDSResult, tags=["Agents"])
async def get_clinical_decision_support(payload: ClinicalCDSInput):
    """
    Evaluates patient examination data (symptoms, vitals, allergies)
    and returns AI differential diagnosis, lab recommendations, and warnings.
    """
    try:
        result = evaluate_clinical_decision_support(payload)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"CDS evaluation pipeline failed: {str(exc)}")


@app.post("/api/ai/medication-check", response_model=MedicationCheckResult, tags=["Agents"])
async def check_medication_safety(payload: MedicationCheckInput):
    """
    Evaluates medication safety, checks for drug-drug interactions,
    flags allergy contraindications, and recommends bioequivalent alternatives.
    """
    try:
        result = evaluate_medication_intelligence(payload)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Medication check pipeline failed: {str(exc)}")


@app.post("/api/ai/inventory-forecast", response_model=InventoryForecastResult, tags=["Agents"])
async def get_inventory_forecast(payload: InventoryForecastInput):
    """
    Performs predictive inventory demand forecasting, identifies stockout horizons,
    and constructs automated batch restock proposals.
    """
    try:
        result = evaluate_inventory_intelligence(payload)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Inventory forecast pipeline failed: {str(exc)}")

