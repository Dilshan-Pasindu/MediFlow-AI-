from typing import Any, Dict, List, Optional
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


class AgentThoughtStep(BaseModel):
    stepNumber: int = Field(..., description="Sequence step index")
    thought: str = Field(..., description="Agent internal clinical reasoning step")
    toolName: Optional[str] = Field(None, description="Name of tool executed by agent")
    toolInput: Optional[str] = Field(None, description="Input arguments passed to tool")
    observation: Optional[str] = Field(None, description="Output observation returned by tool execution")


class AgentLabDraft(BaseModel):
    id: str = Field(..., description="Unique lab order draft ID")
    testName: str = Field(..., description="Recommended lab/diagnostic test name")
    indication: str = Field(..., description="Clinical reason/indication for ordering")
    urgency: str = Field("routine", description="Urgency level: routine, urgent, stat")


class AgentMedicationDraft(BaseModel):
    id: str = Field(..., description="Unique medication draft ID")
    drugName: str = Field(..., description="Medication name")
    dosage: str = Field(..., description="Dosage string e.g. 20mg")
    frequency: str = Field(..., description="Dosing frequency e.g. Once daily after meals")
    duration: str = Field(..., description="Treatment duration e.g. 14 days")
    instructions: str = Field("", description="Patient instructions / warnings")
    safetyWarning: Optional[str] = Field(None, description="Safety or allergy warning flag if present")


class ClinicalCDSResult(BaseModel):
    diagnoses: List[DiagnosisCandidate] = Field(..., description="Differential diagnosis candidates")
    labTests: List[str] = Field(default_factory=list, description="Recommended diagnostic/laboratory tests")
    urgency: str = Field("routine", description="Urgency assessment: routine, urgent, emergency")
    warnings: List[str] = Field(default_factory=list, description="Clinical safety warnings or contraindications")
    thoughtStream: List[AgentThoughtStep] = Field(default_factory=list, description="ReAct thought execution log")
    labDrafts: List[AgentLabDraft] = Field(default_factory=list, description="Structured lab order drafts")
    medicationDrafts: List[AgentMedicationDraft] = Field(default_factory=list, description="Structured treatment medication drafts")


# Medication Intelligence Schemas (Agent 3)
class DrugInteraction(BaseModel):
    drug_pair: List[str] = Field(..., description="Pair of interacting drug names")
    severity: str = Field(..., description="Severity level: High, Moderate, Low")
    description: str = Field(..., description="Interaction clinical description")
    recommendation: str = Field(..., description="Clinical recommendation for managing the interaction")


class AlternativeDrug(BaseModel):
    original_drug: str = Field(..., description="Original requested drug name")
    alternative_drug: str = Field(..., description="Recommended bioequivalent alternative")
    reason: str = Field(..., description="Clinical/availability reason for substitution")
    dosage_guidance: str = Field(..., description="Equivalent dosage guidance")


class MedicationCheckInput(BaseModel):
    medications: List[str] = Field(..., min_length=1, description="List of prescribed/dispensed medication names")
    patient_allergies: Optional[str] = Field(None, description="Documented patient allergies")
    pharmacy_id: Optional[int] = Field(None, description="Target pharmacy ID for stock validation")
    patient_conditions: Optional[List[str]] = Field(default_factory=list, description="Patient medical conditions")


class MedicationCheckResult(BaseModel):
    safe_to_dispense: bool = Field(..., description="Whether prescription is clinically safe to dispense")
    safety_score: int = Field(..., ge=0, le=100, description="Calculated safety confidence score 0-100")
    interactions: List[DrugInteraction] = Field(default_factory=list, description="Detected drug-drug interactions")
    allergy_warnings: List[str] = Field(default_factory=list, description="Allergy contraindication alerts")
    alternatives: List[AlternativeDrug] = Field(default_factory=list, description="Suggested bioequivalent alternatives")
    summary: str = Field(..., description="Clinical reasoning summary for pharmacist")


# Pharmacy & Inventory Intelligence Schemas (Agent 4)


class InventoryAgentItem(BaseModel):
    """Typed representation of InventoryItemAgentContextDto for tool I/O documentation."""
    medicine_id: int = Field(..., description="Medicine unique ID")
    medicine_name: str = Field(..., description="Medicine name")
    category: str = Field(..., description="Medicine category")
    current_stock: int = Field(..., description="Current on-hand units")
    min_stock_level: int = Field(..., description="Minimum stock threshold")
    unit_price: float = Field(..., description="Unit price in LKR")
    demand_rate_per_day: float = Field(..., description="Computed daily demand rate (units/day)")
    total_dispensed_30d: int = Field(..., description="Total dispensed units in 30-day window")
    has_demand_history: bool = Field(..., description="True if item has actual dispense transactions")
    days_until_stockout: int = Field(..., description="Predicted days until stockout")
    urgency: str = Field(..., description="CRITICAL | WARNING | HEALTHY")
    needs_restock: bool = Field(..., description="True if the item requires a restock proposal")

class StockoutRiskItem(BaseModel):
    medicine_id: int = Field(..., description="Medicine unique ID")
    medicine_name: str = Field(..., description="Medicine brand / generic name")
    current_stock: int = Field(..., description="Current on-hand inventory units")
    daily_burn_rate: float = Field(..., description="Calculated units consumed per day")
    days_until_stockout: int = Field(..., description="Estimated days until stock is exhausted")
    urgency: str = Field(..., description="Risk urgency: CRITICAL, WARNING, HEALTHY")


class RestockProposal(BaseModel):
    medicine_id: int = Field(..., description="Medicine unique ID")
    medicine_name: str = Field(..., description="Medicine brand / generic name")
    suggested_quantity: int = Field(..., description="Proposed reorder quantity")
    reason: str = Field(..., description="Algorithmic rationale for proposed batch size")
    estimated_unit_cost: float = Field(..., description="Estimated cost per unit in LKR")
    priority: str = Field("NORMAL", description="Priority level: HIGH, NORMAL, LOW")


class InventoryForecastInput(BaseModel):
    pharmacy_id: int = Field(..., description="Pharmacy ID to forecast inventory for")
    lookback_days: Optional[int] = Field(30, description="Historical analysis window in days")


class InventoryForecastResult(BaseModel):
    pharmacy_id: int = Field(..., description="Pharmacy ID evaluated")
    risk_items: List[StockoutRiskItem] = Field(default_factory=list, description="Medicines facing stockout risk")
    restock_recommendations: List[RestockProposal] = Field(default_factory=list, description="Automated batch restock proposals")
    total_projected_cost: float = Field(..., description="Total estimated cost for recommended restock")
    summary: str = Field(..., description="Executive inventory health summary")
    workflow_audit: Optional[Dict[str, Any]] = Field(
        None,
        description="Structured agent tool execution audit trail (step names, timestamps, counts)"
    )


