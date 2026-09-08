from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from ai.schemas.agent_schemas import (
    HealthCheckResponse,
    SymptomInput,
    SpecialistRecommendation,
)
from ai.agents.specialist_recommender import recommend_specialist

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
