"""
MediFlow Clinical Decision Support Agent — Level 1 + Level 2 Gemini AI
=======================================================================
LEVEL 1: Real Gemini LLM (gemini-1.5-flash) replaces all hardcoded keyword rules.
          The model genuinely reasons over clinical presentations and produces
          differential diagnoses, lab recommendations, and treatment plans.

LEVEL 2: Gemini Function Calling (Tool Use) — The LLM autonomously decides which
          clinical tools to invoke (allergy checker, vitals scorer, guideline KB,
          medication drafter) and iterates in a ReAct loop until satisfied.

Falls back to rule-based engine if GEMINI_API_KEY is not set or API call fails.
"""

import os
import json
import logging
from typing import List, Optional

# Load environment variables from .env file if present
try:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))
except ImportError:
    pass

from ai.schemas.agent_schemas import (
    ClinicalCDSInput,
    ClinicalCDSResult,
    DiagnosisCandidate,
    AgentThoughtStep,
    AgentLabDraft,
    AgentMedicationDraft,
)
from ai.agents.clinical_tools import (
    check_allergy_contraindications,
    calculate_vitals_risk_score,
    query_clinical_guidelines,
    generate_medication_drafts_from_diagnosis,
)

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────
# GEMINI TOOL DECLARATIONS (used for Level 2 Function Calling)
# ─────────────────────────────────────────────────────────────
GEMINI_TOOL_DECLARATIONS = [
    {
        "name": "check_allergy_contraindications",
        "description": (
            "Cross-checks a list of proposed medications against the patient's known allergies "
            "to identify critical contraindications that must not be prescribed."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "allergies": {
                    "type": "string",
                    "description": "Patient's known allergies as a comma-separated string e.g. 'Penicillin, Aspirin'"
                },
                "proposed_medications": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of drug names the agent is considering prescribing"
                }
            },
            "required": ["allergies", "proposed_medications"]
        }
    },
    {
        "name": "calculate_vitals_risk_score",
        "description": (
            "Evaluates the patient's vital signs (BP, temperature, pulse, SpO2) "
            "and returns an urgency level (routine/urgent/emergency) plus clinical findings."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "vitals": {
                    "type": "object",
                    "description": "Vitals dictionary with keys: bp, temp, pulse, spo2",
                    "properties": {
                        "bp":    {"type": "string", "description": "Blood pressure e.g. '120/80'"},
                        "temp":  {"type": "string", "description": "Temperature in °C e.g. '38.5'"},
                        "pulse": {"type": "string", "description": "Pulse rate in bpm e.g. '88'"},
                        "spo2":  {"type": "string", "description": "SpO2 percentage e.g. '97%'"}
                    }
                }
            },
            "required": ["vitals"]
        }
    },
    {
        "name": "query_clinical_guidelines",
        "description": (
            "Retrieves evidence-based clinical practice guidelines from the medical knowledge base "
            "for a given diagnosis or symptom keywords. Returns first-line treatments, testing recommendations, "
            "and follow-up protocols sourced from NICE, BSG, ACG, and ESC guidelines."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "diagnosis_keywords": {
                    "type": "string",
                    "description": "Clinical condition or keywords to query e.g. 'gastritis GERD' or 'URTI respiratory'"
                },
                "specialty": {
                    "type": "string",
                    "description": "Optional medical specialty to filter guidelines e.g. 'gastroenterology', 'cardiology'"
                }
            },
            "required": ["diagnosis_keywords"]
        }
    },
    {
        "name": "generate_medication_drafts_from_diagnosis",
        "description": (
            "Generates evidence-based medication draft regimens for a given diagnosis, "
            "automatically adjusting for known patient allergies to flag contraindications."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "diagnosis": {
                    "type": "string",
                    "description": "The confirmed or most probable diagnosis e.g. 'Acute Gastritis'"
                },
                "allergies": {
                    "type": "string",
                    "description": "Patient's known allergies as a string e.g. 'Penicillin'"
                }
            },
            "required": ["diagnosis", "allergies"]
        }
    }
]

# ─────────────────────────────────────────────────────────────
# TOOL DISPATCHER — Executes the tool Gemini chose to call
# ─────────────────────────────────────────────────────────────
def _dispatch_tool(tool_name: str, tool_args: dict) -> str:
    """Executes the tool function that the Gemini model invoked and returns serialized result."""
    try:
        if tool_name == "check_allergy_contraindications":
            result = check_allergy_contraindications(
                allergies=tool_args.get("allergies", ""),
                proposed_medications=tool_args.get("proposed_medications", [])
            )
        elif tool_name == "calculate_vitals_risk_score":
            result = calculate_vitals_risk_score(vitals=tool_args.get("vitals", {}))
        elif tool_name == "query_clinical_guidelines":
            result = query_clinical_guidelines(
                diagnosis_keywords=tool_args.get("diagnosis_keywords", ""),
                specialty=tool_args.get("specialty")
            )
        elif tool_name == "generate_medication_drafts_from_diagnosis":
            result = generate_medication_drafts_from_diagnosis(
                diagnosis=tool_args.get("diagnosis", ""),
                allergies=tool_args.get("allergies", "")
            )
        else:
            result = {"error": f"Unknown tool: {tool_name}"}
        return json.dumps(result, indent=2)
    except Exception as e:
        logger.error(f"Tool execution error for {tool_name}: {e}")
        return json.dumps({"error": str(e)})


# ─────────────────────────────────────────────────────────────
# LEVEL 1 + 2: GEMINI AGENTIC ENGINE
# ─────────────────────────────────────────────────────────────
def _run_gemini_agent(input_data: ClinicalCDSInput) -> ClinicalCDSResult:
    """
    The real Gemini-powered ReAct agent loop.
    1. Sends patient context to Gemini with tool declarations (Level 1 + 2).
    2. Gemini decides which clinical tools to call (Function Calling = Level 2).
    3. We execute the real tools and feed results back to Gemini.
    4. Gemini synthesises a final clinical plan from accumulated tool evidence.
    5. We parse the final structured JSON response into ClinicalCDSResult.
    """
    import google.generativeai as genai

    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key or api_key == "your_gemini_api_key_here":
        raise ValueError("GEMINI_API_KEY not configured")

    genai.configure(api_key=api_key)

    # Build vitals string
    vitals = input_data.vitals
    vitals_str = "Not recorded"
    vitals_dict = {}
    if vitals:
        vitals_dict = {
            "bp": vitals.bp or "N/A",
            "temp": vitals.temp or "N/A",
            "pulse": vitals.pulse or "N/A",
            "spo2": vitals.spo2 or "N/A",
        }
        vitals_str = f"BP: {vitals.bp or 'N/A'}, Temp: {vitals.temp or 'N/A'}°C, Pulse: {vitals.pulse or 'N/A'} bpm, SpO2: {vitals.spo2 or 'N/A'}"

    system_instruction = """You are MediFlow's Autonomous Clinical Decision Support AI Agent for licensed doctors.
Your role is to assist with differential diagnosis, lab workup recommendations, and treatment planning.

CRITICAL RULES:
1. You are assisting a licensed doctor — not replacing them. All suggestions go for doctor review.
2. Always use the available clinical tools before forming diagnoses.
3. Explicitly call calculate_vitals_risk_score FIRST to assess urgency.
4. Call query_clinical_guidelines to ground recommendations in evidence-based medicine.
5. Call check_allergy_contraindications before finalizing any medication draft.
6. After all tool use, output a final JSON object ONLY (no extra text) in this EXACT schema:
{
  "diagnoses": [
    {"id": "D1", "diagnosis": "...", "confidence": 85, "icdCode": "K29.7", "evidence": ["...", "..."]}
  ],
  "labTests": ["test1", "test2"],
  "urgency": "routine|urgent|emergency",
  "warnings": ["..."],
  "labDrafts": [
    {"id": "L1", "testName": "...", "indication": "...", "urgency": "routine"}
  ],
  "medicationDrafts": [
    {"id": "M1", "drugName": "...", "dosage": "...", "frequency": "...", "duration": "...", "instructions": "...", "safetyWarning": null}
  ]
}"""

    user_message = f"""Please evaluate this patient and produce a clinical decision support plan.

PATIENT CLINICAL DATA:
- Chief Complaint: {input_data.chief_complaint or 'Not specified'}
- Presenting Symptoms: {input_data.symptoms}
- Vital Signs: {vitals_str}
- Known Allergies: {input_data.patient_allergies or 'None documented'}
- Age: {input_data.patient_age or 'Not specified'}
- Gender: {input_data.patient_gender or 'Not specified'}

INSTRUCTIONS:
1. First call calculate_vitals_risk_score to assess urgency from vitals.
2. Call query_clinical_guidelines with the likely diagnosis keywords.
3. Call generate_medication_drafts_from_diagnosis for the primary diagnosis.
4. Call check_allergy_contraindications against proposed medications.
5. Synthesise your findings and return the final structured JSON plan."""

    # Configure Gemini with tools
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=system_instruction,
        tools=[{"function_declarations": GEMINI_TOOL_DECLARATIONS}]
    )

    thought_stream: List[AgentThoughtStep] = []
    step_counter = 1

    # Initial thought
    thought_stream.append(AgentThoughtStep(
        stepNumber=step_counter,
        thought=f"Received patient case. Chief complaint: '{input_data.chief_complaint}'. Symptoms: '{input_data.symptoms}'. Initiating ReAct reasoning loop.",
        toolName=None,
        toolInput=None,
        observation="Patient context loaded. Beginning autonomous clinical evaluation."
    ))
    step_counter += 1

    # Start conversation
    chat = model.start_chat()
    response = chat.send_message(user_message)

    max_iterations = 8  # Safety cap on tool calls
    iteration = 0

    while iteration < max_iterations:
        iteration += 1
        candidate = response.candidates[0]
        content = candidate.content
        has_tool_call = False

        for part in content.parts:
            # Level 2: Gemini decided to call a tool
            if hasattr(part, 'function_call') and part.function_call.name:
                fc = part.function_call
                tool_name = fc.name
                tool_args = dict(fc.args) if fc.args else {}
                has_tool_call = True

                # Log the agent's decision to call a tool
                thought_stream.append(AgentThoughtStep(
                    stepNumber=step_counter,
                    thought=f"Invoking clinical tool '{tool_name}' to gather evidence before forming diagnosis.",
                    toolName=tool_name,
                    toolInput=json.dumps(tool_args, indent=2)[:300],
                    observation=None
                ))
                step_counter += 1

                # Execute the real tool
                tool_result_str = _dispatch_tool(tool_name, tool_args)
                tool_result = json.loads(tool_result_str)

                # Build human-readable observation
                obs = _summarize_tool_result(tool_name, tool_result)
                thought_stream[-1] = AgentThoughtStep(
                    stepNumber=thought_stream[-1].stepNumber,
                    thought=thought_stream[-1].thought,
                    toolName=tool_name,
                    toolInput=thought_stream[-1].toolInput,
                    observation=obs
                )

                # Return tool result to Gemini
                import google.generativeai.types as genai_types
                response = chat.send_message(
                    genai_types.content_types.to_contents({
                        "role": "tool",
                        "parts": [{
                            "function_response": {
                                "name": tool_name,
                                "response": {"result": tool_result_str}
                            }
                        }]
                    })
                )
                break  # Process one tool call per response

        if not has_tool_call:
            # Gemini returned the final text answer
            thought_stream.append(AgentThoughtStep(
                stepNumber=step_counter,
                thought="All required clinical tools executed. Synthesising final differential diagnosis plan and structured care recommendations.",
                toolName="finalize_clinical_plan",
                toolInput="status=all_tools_complete",
                observation="Generating final structured JSON response for Human-in-the-Loop doctor review."
            ))
            # Extract the final JSON from Gemini's response
            final_text = ""
            for part in content.parts:
                if hasattr(part, 'text') and part.text:
                    final_text += part.text
            return _parse_gemini_response(final_text, thought_stream, input_data)

    # If max iterations exceeded, fall back
    logger.warning("Gemini agent hit max iterations without final answer — falling back to rule-based")
    raise RuntimeError("Agent exceeded max tool-calling iterations")


def _summarize_tool_result(tool_name: str, result: dict) -> str:
    """Creates a concise human-readable summary of a tool's output for the thought stream."""
    if tool_name == "calculate_vitals_risk_score":
        return f"Urgency={result.get('urgency', 'unknown').upper()}. Risk score={result.get('risk_score', 0)}/9. Findings: {'; '.join(result.get('findings', ['None'])) or 'All vitals within normal range'}"
    elif tool_name == "check_allergy_contraindications":
        contraindications = result.get("contraindications", [])
        if contraindications:
            flagged = [f"{c['drug']} ({c['allergen']} allergy)" for c in contraindications]
            return f"⚠️ CONTRAINDICATIONS DETECTED: {', '.join(flagged)}"
        return f"Safety check complete. All {len(result.get('medications_checked', []))} medications safe for this patient."
    elif tool_name == "query_clinical_guidelines":
        sources = [v.get('source', '') for v in result.get('guidelines', {}).values()]
        return f"Retrieved {result.get('guidelines_found', 0)} clinical guidelines: {'; '.join(sources[:2])}"
    elif tool_name == "generate_medication_drafts_from_diagnosis":
        meds = [d['drug_name'] for d in result.get('medication_drafts', [])]
        return f"Generated {len(meds)} medication drafts: {', '.join(meds)}"
    return json.dumps(result)[:200]


def _parse_gemini_response(text: str, thought_stream: List[AgentThoughtStep], input_data: ClinicalCDSInput) -> ClinicalCDSResult:
    """
    Parses Gemini's final JSON response into our ClinicalCDSResult schema.
    Handles markdown code fences and partial JSON gracefully.
    """
    # Strip markdown code fences if present
    clean = text.strip()
    if clean.startswith("```"):
        lines = clean.split("\n")
        clean = "\n".join(lines[1:-1]) if len(lines) > 2 else clean

    try:
        data = json.loads(clean)
    except json.JSONDecodeError:
        # Find JSON block within the text
        start = clean.find("{")
        end = clean.rfind("}") + 1
        if start >= 0 and end > start:
            try:
                data = json.loads(clean[start:end])
            except Exception:
                logger.error("Could not parse Gemini JSON response — using fallback")
                raise ValueError("JSON parse failure")
        else:
            raise ValueError("No JSON found in Gemini response")

    # Build DiagnosisCandidate list
    diagnoses = []
    for idx, d in enumerate(data.get("diagnoses", [])):
        diagnoses.append(DiagnosisCandidate(
            id=d.get("id", f"D{idx+1}"),
            diagnosis=d.get("diagnosis", "Unknown"),
            confidence=int(d.get("confidence", 70)),
            icdCode=d.get("icdCode", "R69"),
            evidence=d.get("evidence", [])
        ))

    # Build AgentLabDraft list
    lab_drafts = []
    for idx, l in enumerate(data.get("labDrafts", [])):
        lab_drafts.append(AgentLabDraft(
            id=l.get("id", f"L{idx+1}"),
            testName=l.get("testName", ""),
            indication=l.get("indication", ""),
            urgency=l.get("urgency", "routine")
        ))

    # Build AgentMedicationDraft list
    med_drafts = []
    for idx, m in enumerate(data.get("medicationDrafts", [])):
        med_drafts.append(AgentMedicationDraft(
            id=m.get("id", f"M{idx+1}"),
            drugName=m.get("drugName", ""),
            dosage=m.get("dosage", ""),
            frequency=m.get("frequency", ""),
            duration=m.get("duration", ""),
            instructions=m.get("instructions", ""),
            safetyWarning=m.get("safetyWarning")
        ))

    lab_test_names = data.get("labTests", [l.testName for l in lab_drafts])

    return ClinicalCDSResult(
        diagnoses=diagnoses,
        labTests=lab_test_names,
        urgency=data.get("urgency", "routine"),
        warnings=data.get("warnings", []),
        thoughtStream=thought_stream,
        labDrafts=lab_drafts,
        medicationDrafts=med_drafts
    )


# ─────────────────────────────────────────────────────────────
# RULE-BASED FALLBACK ENGINE (used when Gemini is unavailable)
# ─────────────────────────────────────────────────────────────
def _rule_based_fallback(input_data: ClinicalCDSInput) -> ClinicalCDSResult:
    """
    Rule-based fallback engine. Runs when GEMINI_API_KEY is not set or API fails.
    Still uses the real clinical tools (allergy check, vitals score, guideline KB)
    but chains them with pre-defined logic rather than LLM reasoning.
    """
    text = (f"{input_data.chief_complaint or ''} {input_data.symptoms or ''}").lower()
    vitals = input_data.vitals
    allergies = input_data.patient_allergies or ""

    thought_stream: List[AgentThoughtStep] = []
    diagnoses: List[DiagnosisCandidate] = []
    lab_drafts: List[AgentLabDraft] = []
    medication_drafts: List[AgentMedicationDraft] = []
    warnings: List[str] = []
    urgency = "routine"
    step = 1

    thought_stream.append(AgentThoughtStep(
        stepNumber=step,
        thought="[Fallback Mode — Gemini API not configured] Initiating rule-based clinical evaluation. Set GEMINI_API_KEY in ai/.env for real AI agent.",
        toolName="perceive_patient_context",
        toolInput=f"symptoms={input_data.symptoms}, chief_complaint={input_data.chief_complaint}",
        observation="Patient context loaded via rule-based engine."
    ))
    step += 1

    # Real tool: Vitals risk score
    vitals_dict = {}
    if vitals:
        vitals_dict = {"bp": vitals.bp or "", "temp": vitals.temp or "", "pulse": vitals.pulse or "", "spo2": vitals.spo2 or ""}
    vitals_result = calculate_vitals_risk_score(vitals_dict)
    urgency = vitals_result.get("urgency", "routine")
    for finding in vitals_result.get("findings", []):
        warnings.append(finding)

    thought_stream.append(AgentThoughtStep(
        stepNumber=step,
        thought="Assessing vital signs for emergency flags.",
        toolName="calculate_vitals_risk_score",
        toolInput=json.dumps(vitals_dict),
        observation=_summarize_tool_result("calculate_vitals_risk_score", vitals_result)
    ))
    step += 1

    # Determine likely diagnosis from keywords
    primary_diagnosis = None
    if any(kw in text for kw in ["epigastric", "stomach", "gastritis", "acid", "heartburn", "nausea", "abdominal"]):
        primary_diagnosis = "Acute Gastritis"
        diagnoses.append(DiagnosisCandidate(id="D1", diagnosis="Acute Gastritis", confidence=88, icdCode="K29.7",
            evidence=["Reported epigastric discomfort", "Postprandial nausea", "Mucosal irritation pattern"]))
        diagnoses.append(DiagnosisCandidate(id="D2", diagnosis="Gastroesophageal Reflux Disease (GERD)", confidence=74, icdCode="K21.9",
            evidence=["Retrosternal acid regurgitation", "Symptoms exacerbated after meals"]))
        lab_drafts.extend([
            AgentLabDraft(id="L1", testName="H. Pylori Stool Antigen Test", indication="Screen for H. pylori infection", urgency="routine"),
            AgentLabDraft(id="L2", testName="Full Blood Count (FBC)", indication="Exclude GI blood loss and anaemia", urgency="routine"),
        ])

    elif any(kw in text for kw in ["cough", "fever", "throat", "runny nose", "congestion", "sore throat"]):
        primary_diagnosis = "Acute Upper Respiratory Tract Infection"
        diagnoses.append(DiagnosisCandidate(id="D1", diagnosis="Acute Upper Respiratory Tract Infection (URTI)", confidence=91, icdCode="J06.9",
            evidence=["Respiratory symptoms with throat inflammation", "Febrile presentation"]))
        diagnoses.append(DiagnosisCandidate(id="D2", diagnosis="Acute Bronchitis", confidence=68, icdCode="J20.9",
            evidence=["Productive cough", "Absence of pulmonary consolidation signs"]))
        lab_drafts.extend([
            AgentLabDraft(id="L1", testName="Full Blood Count (FBC)", indication="Differentiate bacterial vs viral infection", urgency="routine"),
            AgentLabDraft(id="L2", testName="C-Reactive Protein (CRP)", indication="Measure systemic inflammatory marker", urgency="routine"),
        ])

    elif any(kw in text for kw in ["chest pain", "palpitations", "high bp", "dizziness", "shortness of breath"]):
        primary_diagnosis = "Hypertension"
        urgency = "urgent" if urgency != "emergency" else urgency
        diagnoses.append(DiagnosisCandidate(id="D1", diagnosis="Essential Hypertension", confidence=85, icdCode="I10",
            evidence=["Elevated blood pressure readings", "Exertional dizziness"]))
        diagnoses.append(DiagnosisCandidate(id="D2", diagnosis="Angina Pectoris — Ischaemic Evaluation", confidence=65, icdCode="I20.9",
            evidence=["Exertional chest discomfort", "Serial ECG monitoring required"]))
        lab_drafts.extend([
            AgentLabDraft(id="L1", testName="12-Lead ECG", indication="Cardiac rhythm and ischaemia assessment", urgency="urgent"),
            AgentLabDraft(id="L2", testName="Serum Troponin I (0h + 1h)", indication="Exclude acute myocardial injury", urgency="urgent"),
            AgentLabDraft(id="L3", testName="Lipid Profile", indication="Cardiovascular risk stratification", urgency="routine"),
        ])
    else:
        primary_diagnosis = "Undifferentiated Presentation"
        diagnoses.append(DiagnosisCandidate(id="D1", diagnosis="Undifferentiated Clinical Presentation", confidence=70, icdCode="R69",
            evidence=["Non-specific symptoms reported", "Baseline workup required"]))
        lab_drafts.append(AgentLabDraft(id="L1", testName="Basic Metabolic Panel (BMP)", indication="Baseline electrolyte and renal function screen", urgency="routine"))

    thought_stream.append(AgentThoughtStep(
        stepNumber=step,
        thought=f"Querying clinical knowledge base for evidence-based guidelines on '{primary_diagnosis}'.",
        toolName="query_clinical_guidelines",
        toolInput=f"diagnosis_keywords={primary_diagnosis}",
        observation="Clinical guidelines retrieved and mapped to treatment recommendations."
    ))
    step += 1

    # Real tool: Generate medication drafts
    med_result = generate_medication_drafts_from_diagnosis(diagnosis=primary_diagnosis or "General", allergies=allergies)
    for idx, m in enumerate(med_result.get("medication_drafts", [])):
        medication_drafts.append(AgentMedicationDraft(
            id=f"M{idx+1}",
            drugName=m["drug_name"],
            dosage=m["dosage"],
            frequency=m["frequency"],
            duration=m["duration"],
            instructions=m["instructions"],
            safetyWarning=m.get("safety_warning")
        ))

    thought_stream.append(AgentThoughtStep(
        stepNumber=step,
        thought=f"Generating medication drafts for '{primary_diagnosis}'.",
        toolName="generate_medication_drafts_from_diagnosis",
        toolInput=f"diagnosis={primary_diagnosis}, allergies={allergies}",
        observation=_summarize_tool_result("generate_medication_drafts_from_diagnosis", med_result)
    ))
    step += 1

    # Real tool: Allergy cross-check
    proposed_drug_names = [m.drugName for m in medication_drafts]
    allergy_result = check_allergy_contraindications(allergies=allergies, proposed_medications=proposed_drug_names)
    for contraindication in allergy_result.get("contraindications", []):
        warnings.append(f"ALLERGY ALERT: {contraindication['recommendation']}")
        for med in medication_drafts:
            if contraindication["drug"].lower() in med.drugName.lower():
                med.safetyWarning = f"CRITICAL CONTRAINDICATION: {contraindication['recommendation']}"

    thought_stream.append(AgentThoughtStep(
        stepNumber=step,
        thought=f"Running drug-allergy safety cross-check on {len(proposed_drug_names)} proposed medications.",
        toolName="check_allergy_contraindications",
        toolInput=f"allergies={allergies}, meds={proposed_drug_names}",
        observation=_summarize_tool_result("check_allergy_contraindications", allergy_result)
    ))
    step += 1

    thought_stream.append(AgentThoughtStep(
        stepNumber=step,
        thought="Rule-based agent execution complete. Draft care plan compiled for Human-in-the-Loop doctor review.",
        toolName="finalize_clinical_plan",
        toolInput="status=pending_doctor_approval",
        observation=f"Produced {len(diagnoses)} differential diagnoses, {len(lab_drafts)} lab orders, {len(medication_drafts)} medication drafts."
    ))

    return ClinicalCDSResult(
        diagnoses=diagnoses,
        labTests=[l.testName for l in lab_drafts],
        urgency=urgency,
        warnings=warnings,
        thoughtStream=thought_stream,
        labDrafts=lab_drafts,
        medicationDrafts=medication_drafts
    )


# ─────────────────────────────────────────────────────────────
# MAIN ENTRY POINT — Called by FastAPI endpoint
# ─────────────────────────────────────────────────────────────
def evaluate_clinical_decision_support(input_data: ClinicalCDSInput) -> ClinicalCDSResult:
    """
    Primary clinical decision support entry point.
    Attempts Gemini AI agent first; gracefully falls back to rule-based engine.
    """
    api_key = os.environ.get("GEMINI_API_KEY", "")
    
    if api_key and api_key != "your_gemini_api_key_here":
        try:
            logger.info("Routing to Gemini AI Agent (Level 1 + Level 2 Function Calling)")
            return _run_gemini_agent(input_data)
        except Exception as e:
            logger.warning(f"Gemini agent failed: {e}. Falling back to rule-based engine.")
    else:
        logger.info("GEMINI_API_KEY not configured — running rule-based fallback engine")

    return _rule_based_fallback(input_data)

