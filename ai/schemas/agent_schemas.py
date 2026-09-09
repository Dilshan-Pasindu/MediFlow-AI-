from typing import List, Optional, Dict
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


# Clinical Decision Support Schemas
class VitalsInput(BaseModel):
    bp: Optional[str] = Field(None, description="Blood pressure e.g., 120/80")
    temp: Optional[str] = Field(None, description="Temperature in °C")
    pulse: Optional[str] = Field(None, description="Pulse rate in bpm")
    spo2: Optional[str] = Field(None, description="Oxygen saturation %")


class ClinicalCDSInput(BaseModel):
    symptoms: str = Field(..., description="Free text or list of presenting symptoms")
    chief_complaint: Optional[str] = Field(None, description="Chief complaint of the patient")
    vitals: Optional[VitalsInput] = Field(None, description="Vital signs")
    patient_allergies: Optional[str] = Field(None, description="Known allergies")
    patient_age: Optional[int] = Field(None, description="Patient age in years")
    patient_gender: Optional[str] = Field(None, description="Patient gender")


class DiagnosisCandidate(BaseModel):
    id: str = Field(..., description="Unique candidate ID")
    diagnosis: str = Field(..., description="Diagnosis name")
    confidence: int = Field(..., ge=0, le=100, description="Confidence percentage")
    icdCode: str = Field(..., description="ICD-10 code")
    evidence: List[str] = Field(default_factory=list, description="Supporting clinical evidence items")


class ClinicalCDSResult(BaseModel):
    diagnoses: List[DiagnosisCandidate] = Field(..., description="Differential diagnosis candidates")
    labTests: List[str] = Field(default_factory=list, description="Recommended diagnostic/laboratory tests")
    urgency: str = Field("routine", description="Urgency assessment: routine, urgent, emergency")
    warnings: List[str] = Field(default_factory=list, description="Clinical safety warnings or contraindications")
