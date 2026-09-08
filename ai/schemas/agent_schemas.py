from typing import List, Optional
from pydantic import BaseModel, Field


class HealthCheckResponse(BaseModel):
    status: str = Field(default="healthy", description="Service health status")
    service: str = Field(default="mediflow-ai-service", description="Service name")
    version: str = Field(default="1.0.0", description="API version")


class SymptomInput(BaseModel):
    symptoms: List[str] = Field(..., min_length=1, description="List of patient symptoms")
    patient_notes: Optional[str] = Field(None, description="Optional free-text notes from patient")
    severity: Optional[str] = Field("moderate", description="Self-reported severity: mild, moderate, severe")


class SpecialistRecommendation(BaseModel):
    recommended_specialty: str = Field(..., description="Recommended medical specialty department")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Confidence score from 0.0 to 1.0")
    rationale: str = Field(..., description="Clinical reasoning explaining the recommendation")
    suggested_actions: List[str] = Field(default_factory=list, description="Next steps for the patient")
