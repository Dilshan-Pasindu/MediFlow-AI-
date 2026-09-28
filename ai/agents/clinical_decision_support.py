"""
MediFlow Clinical Decision Support Agent — Gemini Free-Tier Edition
====================================================================
Design goals: work reliably on a FREE Gemini API key and fall back to the
offline rule-based engine as rarely as possible.

How it stays online on the free tier
------------------------------------
1. ONE Gemini request per case. Clinical tools (vitals score, guideline KB) run
   locally in Python first and their results are fed into the prompt.
2. Correct SDK usage: JSON mime type, thinking disabled on 2.5 models (thinking
   tokens would otherwise eat the output budget), generous max_output_tokens.
3. Models are discovered from your key (retired models are skipped), and each
   model gets its own retry/cooldown logic, so a 429 on one model moves to the next.
4. Client-side rate limiter (GEMINI_RPM, default 8/min) so we don't trigger 429s.
5. Smart retry: 429 with a short retryDelay -> wait and retry; 503/timeouts ->
   backoff and retry; truncated/invalid JSON -> repair, then retry.
6. Result cache (1 hour) so repeated identical cases never spend quota.
7. Partial repair: if Gemini omits medications, they are filled from the local
   medication tool instead of discarding the whole Gemini answer.
8. Safety net: allergy check is ALWAYS run on the medications Gemini proposes.

NOTE on "Level 2": tools are pre-executed and their output given to the model
(1 request) instead of a multi-turn function-calling loop (3-6 requests), which
would burn the free quota. The thought stream reflects exactly what happens.

Requires:  pip install google-genai python-dotenv
Env:       GEMINI_API_KEY (required), GEMINI_MODEL (optional), GEMINI_RPM (optional)
"""

import os
import sys
import re
import json
import time
import hashlib
import logging
import threading
from collections import deque, OrderedDict
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# ── Path setup so imports resolve in all environments ────────────────────────
_current_dir = Path(__file__).resolve().parent
_ai_dir = _current_dir.parent
_workspace_root = _ai_dir.parent
for _p in [str(_workspace_root), str(_ai_dir)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

# ── Environment loading ──────────────────────────────────────────────────────
try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv(dotenv_path=os.path.join(str(_ai_dir), ".env"))
    load_dotenv(dotenv_path=os.path.join(str(_workspace_root), ".env"))
except ImportError:
    for _env_file in [os.path.join(str(_ai_dir), ".env"), os.path.join(str(_workspace_root), ".env")]:
        if os.path.isfile(_env_file):
            try:
                with open(_env_file, "r", encoding="utf-8") as _f:
                    for _line in _f:
                        _line = _line.strip()
                        if _line and not _line.startswith("#") and "=" in _line:
                            _k, _v = _line.split("=", 1)
                            _k, _v = _k.strip(), _v.strip().strip("\"'")
                            if _k and _k not in os.environ:
                                os.environ[_k] = _v
            except Exception:
                pass

try:
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
except ImportError:
    from schemas.agent_schemas import (  # type: ignore
        ClinicalCDSInput,
        ClinicalCDSResult,
        DiagnosisCandidate,
        AgentThoughtStep,
        AgentLabDraft,
        AgentMedicationDraft,
    )
    from agents.clinical_tools import (  # type: ignore
        check_allergy_contraindications,
        calculate_vitals_risk_score,
        query_clinical_guidelines,
        generate_medication_drafts_from_diagnosis,
    )

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────────────
# Retired 1.5 models removed. Flash-Lite has the most generous free quota.
DEFAULT_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-2.0-flash",
]
PER_CALL_TIMEOUT_MS = 25_000       # HTTP timeout for one Gemini request
TOTAL_BUDGET_SECONDS = 45.0        # max wall time for all Gemini attempts
MAX_OUTPUT_TOKENS = 4096
CACHE_TTL_SECONDS = 3600
CACHE_MAX_ITEMS = 256

_URGENCY_RANK = {"routine": 0, "urgent": 1, "emergency": 2}


def _api_key() -> str:
    key = os.environ.get("GEMINI_API_KEY", "").strip()
    return "" if key in ("", "your_gemini_api_key_here") else key


# ─────────────────────────────────────────────────────────────
# SHARED STATE: client, model discovery, cooldowns, limiter, cache
# ─────────────────────────────────────────────────────────────
_state_lock = threading.Lock()
_client = None
_client_key = None
_available_models: Optional[set] = None
_dead_models: set = set()                  # 404 / not supported
_model_cooldown: Dict[str, float] = {}     # model -> monotonic time when usable again

_rate_lock = threading.Lock()
_call_times: deque = deque()

_cache_lock = threading.Lock()
_cache: "OrderedDict[str, Tuple[float, ClinicalCDSResult]]" = OrderedDict()


def _get_client(api_key: str):
    """Create (or reuse) the google-genai client with an HTTP timeout."""
    global _client, _client_key
    with _state_lock:
        if _client is not None and _client_key == api_key:
            return _client
        try:
            from google import genai
            from google.genai import types
            _client = genai.Client(
                api_key=api_key,
                http_options=types.HttpOptions(timeout=PER_CALL_TIMEOUT_MS),
            )
            _client_key = api_key
            return _client
        except Exception as e:
            logger.error(f"Failed to initialise google-genai client (pip install google-genai): {e}")
            raise RuntimeError("Google GenAI SDK unavailable") from e


def _discover_models(client) -> set:
    """Ask the API which models this key can actually call. Cached; empty set = unknown."""
    global _available_models
    if _available_models is not None:
        return _available_models
    names: set = set()
    try:
        for m in client.models.list():
            actions = getattr(m, "supported_actions", None) or []
            if not actions or "generateContent" in actions:
                names.add(str(m.name).replace("models/", ""))
    except Exception as e:
        logger.warning(f"Model discovery failed (will try defaults): {e}")
    _available_models = names
    return names


def _candidate_models(client) -> List[str]:
    wanted: List[str] = []
    configured = os.environ.get("GEMINI_MODEL", "").strip()
    if configured:
        wanted.append(configured)
    for m in DEFAULT_MODELS:
        if m not in wanted:
            wanted.append(m)

    available = _discover_models(client)
    if available:
        filtered = [m for m in wanted if m in available]
        if filtered:
            wanted = filtered

    now = time.monotonic()
    return [m for m in wanted if m not in _dead_models and _model_cooldown.get(m, 0) <= now]


def _acquire_rate_slot(deadline: float) -> None:
    """Sliding-window limiter (GEMINI_RPM per 60s). Waits if needed, else raises TimeoutError."""
    try:
        rpm = max(1, int(os.environ.get("GEMINI_RPM", "8")))
    except ValueError:
        rpm = 8
    while True:
        with _rate_lock:
            now = time.monotonic()
            while _call_times and now - _call_times[0] >= 60:
                _call_times.popleft()
            if len(_call_times) < rpm:
                _call_times.append(now)
                return
            wait = 60 - (now - _call_times[0])
        if time.monotonic() + wait > deadline:
            raise TimeoutError("No free rate-limit slot before deadline")
        time.sleep(min(wait, 5.0) + 0.05)


def _cache_key(d: ClinicalCDSInput) -> str:
    v = d.vitals
    payload = {
        "cc": (d.chief_complaint or "").strip().lower(),
        "sx": (d.symptoms or "").strip().lower(),
        "age": str(d.patient_age or ""),
        "sex": str(d.patient_gender or "").lower(),
        "al": (d.patient_allergies or "").strip().lower(),
        "v": [getattr(v, k, None) for k in ("bp", "temp", "pulse", "spo2")] if v else None,
    }
    return hashlib.sha256(json.dumps(payload, sort_keys=True, default=str).encode()).hexdigest()


def _cache_get(key: str) -> Optional[ClinicalCDSResult]:
    with _cache_lock:
        item = _cache.get(key)
        if not item:
            return None
        ts, result = item
        if time.time() - ts > CACHE_TTL_SECONDS:
            _cache.pop(key, None)
            return None
        _cache.move_to_end(key)
        return result.model_copy(deep=True) if hasattr(result, "model_copy") else result


def _cache_put(key: str, result: ClinicalCDSResult) -> None:
    with _cache_lock:
        _cache[key] = (time.time(), result)
        _cache.move_to_end(key)
        while len(_cache) > CACHE_MAX_ITEMS:
            _cache.popitem(last=False)


# ─────────────────────────────────────────────────────────────
# TOOL HELPERS
# ─────────────────────────────────────────────────────────────
def _safe_tool(fn, **kwargs) -> Dict[str, Any]:
    """Run a clinical tool; a tool bug must never take down the whole agent."""
    try:
        res = fn(**kwargs)
        return res if isinstance(res, dict) else {"result": res}
    except Exception as e:
        logger.error(f"Clinical tool {getattr(fn, '__name__', fn)} failed: {e}")
        return {"error": str(e)}


def _summarize_tool_result(tool_name: str, result: dict) -> str:
    """Concise human-readable summary of a tool's output for the thought stream."""
    if result.get("error"):
        return f"Tool error: {result['error']}"
    if tool_name == "calculate_vitals_risk_score":
        findings = "; ".join(result.get("findings", []) or []) or "All vitals within normal range"
        return f"Urgency={str(result.get('urgency', 'unknown')).upper()}. Risk score={result.get('risk_score', 0)}/9. Findings: {findings}"
    if tool_name == "check_allergy_contraindications":
        contra = result.get("contraindications", [])
        if contra:
            flagged = [f"{c.get('drug')} ({c.get('allergen')} allergy)" for c in contra]
            return f"CONTRAINDICATIONS DETECTED: {', '.join(flagged)}"
        return f"Safety check complete. All {len(result.get('medications_checked', []))} medications safe for this patient."
    if tool_name == "query_clinical_guidelines":
        g = result.get("guidelines", {})
        vals = g.values() if isinstance(g, dict) else g
        sources = [v.get("source", "") for v in vals if isinstance(v, dict)]
        return f"Retrieved {result.get('guidelines_found', 0)} clinical guidelines: {'; '.join([s for s in sources if s][:2])}"
    if tool_name == "generate_medication_drafts_from_diagnosis":
        meds = [d.get("drug_name", "?") for d in result.get("medication_drafts", [])]
        return f"Generated {len(meds)} medication drafts: {', '.join(meds)}"
    return json.dumps(result, default=str)[:200]


def _compact_guidelines(res: dict, limit: int = 600) -> str:
    """Flatten the guideline KB output into a short string for the prompt."""
    g = res.get("guidelines", {}) if isinstance(res, dict) else {}
    items = g.values() if isinstance(g, dict) else (g if isinstance(g, list) else [])
    parts: List[str] = []
    for v in items:
        if isinstance(v, dict):
            parts.append("; ".join(f"{k}: {x if isinstance(x, str) else json.dumps(x, default=str)}" for k, x in v.items()))
        else:
            parts.append(str(v))
    return " | ".join(parts)[:limit]


def _add_warning(warnings: List[str], msg: str) -> None:
    if msg and msg not in warnings:
        warnings.append(msg)


# ─────────────────────────────────────────────────────────────
# JSON PARSING / REPAIR
# ─────────────────────────────────────────────────────────────
def _repair_truncated_json(s: str) -> Optional[dict]:
    """Close brackets on a truncated JSON object, backing off to the last valid boundary."""
    start = s.find("{")
    if start < 0:
        return None
    s = s[start:]
    stack: List[str] = []
    in_str = esc = False
    snapshots: List[Tuple[int, List[str]]] = []
    for i, ch in enumerate(s):
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == '"':
                in_str = False
            continue
        if ch == '"':
            in_str = True
        elif ch in "{[":
            stack.append("}" if ch == "{" else "]")
        elif ch in "}]":
            if stack:
                stack.pop()
            snapshots.append((i + 1, list(stack)))
    for pos, stk in reversed(snapshots):
        candidate = s[:pos].rstrip().rstrip(",") + "".join(reversed(stk))
        try:
            data = json.loads(candidate)
            if isinstance(data, dict):
                return data
        except json.JSONDecodeError:
            continue
    return None


def _extract_json(text: str) -> dict:
    clean = (text or "").strip()
    if clean.startswith("```"):
        lines = clean.split("\n")
        clean = "\n".join(lines[1:-1] if lines[-1].strip().startswith("```") else lines[1:])
    try:
        data = json.loads(clean)
        if isinstance(data, dict):
            return data
    except json.JSONDecodeError:
        pass
    start, end = clean.find("{"), clean.rfind("}") + 1
    if start >= 0 and end > start:
        try:
            data = json.loads(clean[start:end])
            if isinstance(data, dict):
                return data
        except json.JSONDecodeError:
            pass
    repaired = _repair_truncated_json(clean)
    if repaired:
        logger.info("Recovered truncated Gemini JSON via repair")
        return repaired
    raise ValueError("No parseable JSON in Gemini response")


# ─────────────────────────────────────────────────────────────
# GEMINI CALL WITH RESILIENCE
# ─────────────────────────────────────────────────────────────
SYSTEM_INSTRUCTION = (
    "You are a clinical decision support assistant for a licensed doctor. "
    "Your output is a DRAFT that a doctor will review. "
    "Reply with ONE valid JSON object and nothing else (no markdown), in exactly this shape:\n"
    '{"diagnoses":[{"id":"D1","diagnosis":"name","confidence":85,"icdCode":"K29.7","evidence":["..."]}],'
    '"labTests":["..."],'
    '"urgency":"routine|urgent|emergency",'
    '"warnings":["..."],'
    '"labDrafts":[{"id":"L1","testName":"...","indication":"...","urgency":"routine|urgent|emergency"}],'
    '"medicationDrafts":[{"id":"M1","drugName":"...","dosage":"...","frequency":"...","duration":"...",'
    '"instructions":"...","safetyWarning":null}]}\n'
    "Rules: 2-3 diagnoses ordered by confidence (integer 0-100) with valid ICD-10 codes; "
    "2-4 lab drafts; 1-4 medication drafts; keep every string short. "
    "NEVER propose a drug (or drug class) the patient is allergic to. "
    "Respect the provided vitals urgency: never lower it. "
    "Add warnings for red flags, drug interactions, and follow-up advice."
)


def _classify_error(err: Exception) -> Tuple[Optional[int], str]:
    msg = str(err)
    code = getattr(err, "code", None) or getattr(err, "status_code", None)
    if not isinstance(code, int):
        m = re.search(r"\b([45]\d\d)\b", msg[:80])
        code = int(m.group(1)) if m else None
    return code, msg


def _parse_retry_delay(msg: str) -> Optional[float]:
    m = re.search(r"retry(?:Delay)?\W+(?:in\s+)?['\"]?([\d.]+)\s*s", msg, re.I)
    return float(m.group(1)) if m else None


def _call_gemini_json(client, prompt: str) -> Tuple[dict, str]:
    """
    Try candidate models in order with per-model retry logic.
    Returns (parsed_json, model_name). Raises RuntimeError if everything fails.
    """
    from google.genai import types

    deadline = time.monotonic() + TOTAL_BUDGET_SECONDS
    models = _candidate_models(client)
    if not models:
        raise RuntimeError("All Gemini models are on cooldown or unavailable")

    safety = [
        types.SafetySetting(category=c, threshold="BLOCK_ONLY_HIGH")
        for c in (
            "HARM_CATEGORY_HARASSMENT",
            "HARM_CATEGORY_HATE_SPEECH",
            "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "HARM_CATEGORY_DANGEROUS_CONTENT",
        )
    ]

    last_error = "unknown"
    for model in models:
        use_thinking_cfg = "2.5" in model and "pro" not in model
        for attempt in range(4):
            if time.monotonic() >= deadline:
                raise RuntimeError(f"Gemini time budget exhausted (last error: {last_error})")

            cfg_kwargs: Dict[str, Any] = dict(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.2,
                top_p=0.95,
                max_output_tokens=MAX_OUTPUT_TOKENS,
                response_mime_type="application/json",
                safety_settings=safety,
            )
            if use_thinking_cfg:
                cfg_kwargs["thinking_config"] = types.ThinkingConfig(thinking_budget=0)

            try:
                _acquire_rate_slot(deadline)
                res = client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=types.GenerateContentConfig(**cfg_kwargs),
                )
                text = getattr(res, "text", None)
                if not text:
                    last_error = f"{model}: empty response"
                    logger.warning(last_error)
                    continue
                data = _extract_json(text)
                if not data.get("diagnoses"):
                    last_error = f"{model}: JSON had no diagnoses"
                    logger.warning(last_error)
                    continue
                logger.info(f"Gemini CDS succeeded with model={model} (attempt {attempt + 1})")
                return data, model

            except TimeoutError as e:  # local limiter couldn't give us a slot in time
                raise RuntimeError(str(e)) from e
            except ValueError as e:    # JSON parse failure -> retry
                last_error = f"{model}: {e}"
                logger.warning(last_error)
                continue
            except Exception as e:
                code, msg = _classify_error(e)
                last_error = f"{model}: {code} {msg[:160]}"
                low = msg.lower()

                if code in (401, 403) or "api key" in low and "invalid" in low:
                    raise PermissionError(f"Gemini rejected the API key: {msg[:200]}") from e

                if code == 404 or "not found" in low or "no longer available" in low:
                    logger.warning(f"Model {model} unavailable, skipping: {msg[:120]}")
                    _dead_models.add(model)
                    break

                if code == 400 and use_thinking_cfg and "think" in low:
                    logger.info(f"{model} rejected thinking config; retrying without it")
                    use_thinking_cfg = False
                    continue

                if code == 429 or "resource_exhausted" in low or "quota" in low:
                    delay = _parse_retry_delay(msg)
                    if "perday" in low.replace(" ", "").replace("_", "") or "per day" in low:
                        _model_cooldown[model] = time.monotonic() + 3600
                        logger.warning(f"{model}: daily quota exhausted, trying next model")
                        break
                    remaining = deadline - time.monotonic()
                    if delay is not None and delay <= 12 and remaining > delay + 6:
                        logger.info(f"{model}: 429, waiting {delay:.1f}s then retrying")
                        time.sleep(delay + 0.5)
                        continue
                    _model_cooldown[model] = time.monotonic() + (delay if delay else 30)
                    logger.warning(f"{model}: rate limited, trying next model")
                    break

                if code in (500, 502, 503, 504) or "timeout" in low or "timed out" in low or "deadline" in low or "overloaded" in low:
                    backoff = 1.5 * (attempt + 1)
                    if deadline - time.monotonic() > backoff + 5:
                        logger.info(f"{model}: transient error ({code}), retrying in {backoff:.1f}s")
                        time.sleep(backoff)
                        continue
                    break

                logger.warning(f"{model}: unhandled error, moving on: {msg[:200]}")
                break

    raise RuntimeError(f"All Gemini models failed (last error: {last_error})")


# ─────────────────────────────────────────────────────────────
# GEMINI AGENT
# ─────────────────────────────────────────────────────────────
def _to_int(v: Any, default: int) -> int:
    try:
        return max(0, min(100, int(float(v))))
    except (TypeError, ValueError):
        return default


def _norm_urgency(v: Any, default: str = "routine") -> str:
    v = str(v or "").strip().lower()
    return v if v in _URGENCY_RANK else default


def _run_gemini_agent(input_data: ClinicalCDSInput) -> ClinicalCDSResult:
    api_key = _api_key()
    if not api_key:
        raise ValueError("GEMINI_API_KEY not configured")

    vitals = input_data.vitals
    vitals_dict: Dict[str, str] = {}
    vitals_str = "None"
    if vitals:
        vitals_dict = {
            "bp": vitals.bp or "",
            "temp": vitals.temp or "",
            "pulse": vitals.pulse or "",
            "spo2": vitals.spo2 or "",
        }
        vitals_str = f"BP {vitals.bp or '-'}, Temp {vitals.temp or '-'}, HR {vitals.pulse or '-'}, SpO2 {vitals.spo2 or '-'}"

    thoughts: List[AgentThoughtStep] = []
    step = 1

    def add_step(thought, tool=None, tool_input=None, obs=""):
        nonlocal step
        thoughts.append(AgentThoughtStep(
            stepNumber=step, thought=thought, toolName=tool, toolInput=tool_input, observation=obs
        ))
        step += 1

    add_step(
        f"Received patient case. Chief complaint: '{input_data.chief_complaint}'. Symptoms: '{input_data.symptoms}'.",
        obs="Patient context loaded. Beginning clinical evaluation.",
    )

    # ── Local tools (no API quota used) ──
    vitals_res = _safe_tool(calculate_vitals_risk_score, vitals=vitals_dict)
    add_step("Invoking 'calculate_vitals_risk_score' to assess urgency.",
             "calculate_vitals_risk_score", json.dumps(vitals_dict),
             _summarize_tool_result("calculate_vitals_risk_score", vitals_res))
    vitals_urgency = _norm_urgency(vitals_res.get("urgency"))

    kw = (input_data.symptoms or input_data.chief_complaint or "general").strip()
    guide_res = _safe_tool(query_clinical_guidelines, diagnosis_keywords=kw)
    add_step("Invoking 'query_clinical_guidelines' to retrieve evidence-based protocols.",
             "query_clinical_guidelines", json.dumps({"diagnosis_keywords": kw}),
             _summarize_tool_result("query_clinical_guidelines", guide_res))

    # ── Single Gemini request ──
    findings = "; ".join(vitals_res.get("findings", []) or []) or "none"
    prompt = (
        f"Patient: age {input_data.patient_age or 'unknown'}, sex {input_data.patient_gender or 'unknown'}.\n"
        f"Chief complaint: {input_data.chief_complaint or 'not stated'}.\n"
        f"Symptoms: {input_data.symptoms or 'not stated'}.\n"
        f"Vitals: {vitals_str}.\n"
        f"Known allergies: {input_data.patient_allergies or 'none reported'}.\n"
        f"Vitals risk tool: urgency={vitals_urgency}, score={vitals_res.get('risk_score', 0)}/9, findings: {findings}.\n"
        f"Guideline context: {_compact_guidelines(guide_res) or 'none'}.\n"
        "Produce the JSON care-plan draft."
    )

    client = _get_client(api_key)
    data, model_used = _call_gemini_json(client, prompt)

    # ── Build typed result ──
    diagnoses: List[DiagnosisCandidate] = []
    for idx, d in enumerate(data.get("diagnoses", [])[:4]):
        if not isinstance(d, dict):
            continue
        evidence = d.get("evidence", [])
        diagnoses.append(DiagnosisCandidate(
            id=str(d.get("id") or f"D{idx + 1}"),
            diagnosis=str(d.get("diagnosis") or "Unknown"),
            confidence=_to_int(d.get("confidence"), 70),
            icdCode=str(d.get("icdCode") or "R69"),
            evidence=[str(e) for e in evidence] if isinstance(evidence, list) else [str(evidence)],
        ))
    if not diagnoses:
        raise ValueError("Gemini returned no usable diagnoses")

    lab_drafts: List[AgentLabDraft] = []
    for idx, l in enumerate(data.get("labDrafts", [])[:6]):
        if isinstance(l, dict) and l.get("testName"):
            lab_drafts.append(AgentLabDraft(
                id=str(l.get("id") or f"L{idx + 1}"),
                testName=str(l["testName"]),
                indication=str(l.get("indication") or ""),
                urgency=_norm_urgency(l.get("urgency")),
            ))

    med_drafts: List[AgentMedicationDraft] = []
    for idx, m in enumerate(data.get("medicationDrafts", [])[:6]):
        if isinstance(m, dict) and m.get("drugName"):
            sw = m.get("safetyWarning")
            med_drafts.append(AgentMedicationDraft(
                id=str(m.get("id") or f"M{idx + 1}"),
                drugName=str(m["drugName"]),
                dosage=str(m.get("dosage") or ""),
                frequency=str(m.get("frequency") or ""),
                duration=str(m.get("duration") or ""),
                instructions=str(m.get("instructions") or ""),
                safetyWarning=str(sw) if sw else None,
            ))

    top_dx = diagnoses[0].diagnosis
    allergies = input_data.patient_allergies or ""

    # ── Partial repair: fill gaps from the local medication tool instead of going offline ──
    if not med_drafts:
        med_res = _safe_tool(generate_medication_drafts_from_diagnosis, diagnosis=top_dx, allergies=allergies)
        for idx, m in enumerate(med_res.get("medication_drafts", [])):
            try:
                med_drafts.append(AgentMedicationDraft(
                    id=f"M{idx + 1}", drugName=m["drug_name"], dosage=m["dosage"],
                    frequency=m["frequency"], duration=m["duration"],
                    instructions=m["instructions"], safetyWarning=m.get("safety_warning"),
                ))
            except Exception:
                continue
        if med_drafts:
            add_step(f"Gemini returned no medications; generated drafts for '{top_dx}' from local tool.",
                     "generate_medication_drafts_from_diagnosis",
                     f"diagnosis={top_dx}, allergies={allergies}",
                     _summarize_tool_result("generate_medication_drafts_from_diagnosis", med_res))

    lab_test_names = [str(t) for t in data.get("labTests", []) if t] or [l.testName for l in lab_drafts]
    if not lab_test_names:
        lab_test_names = [l.testName for l in lab_drafts]

    # ── Mandatory allergy safety check on whatever the model proposed ──
    warnings: List[str] = [str(w) for w in data.get("warnings", []) if w]
    for f in vitals_res.get("findings", []) or []:
        _add_warning(warnings, str(f))

    proposed = [m.drugName for m in med_drafts]
    allergy_res = _safe_tool(check_allergy_contraindications, allergies=allergies, proposed_medications=proposed)
    for c in allergy_res.get("contraindications", []) or []:
        rec = c.get("recommendation", f"{c.get('drug')} contraindicated ({c.get('allergen')} allergy)")
        _add_warning(warnings, f"ALLERGY ALERT: {rec}")
        for m in med_drafts:
            if str(c.get("drug", "")).lower() in m.drugName.lower():
                m.safetyWarning = f"CRITICAL CONTRAINDICATION: {rec}"
    add_step(f"Running drug-allergy safety cross-check on {len(proposed)} proposed medications.",
             "check_allergy_contraindications", f"allergies={allergies}, meds={proposed}",
             _summarize_tool_result("check_allergy_contraindications", allergy_res))

    if allergies.strip() and not any("ALLERGY ALERT" in w for w in warnings):
        _add_warning(warnings, f"ALLERGY ALERT: Documented patient allergy: {allergies.strip()}.")

    # Urgency = the more severe of tool and model
    urgency = max(vitals_urgency, _norm_urgency(data.get("urgency")), key=lambda u: _URGENCY_RANK[u])

    add_step(f"Synthesised differential diagnosis and care plan with Gemini ({model_used}).",
             "finalize_clinical_plan", "status=pending_doctor_approval",
             f"Produced {len(diagnoses)} diagnoses, {len(lab_drafts)} lab orders, {len(med_drafts)} medication drafts for doctor review.")

    return ClinicalCDSResult(
        diagnoses=diagnoses,
        labTests=lab_test_names,
        urgency=urgency,
        warnings=warnings,
        thoughtStream=thoughts,
        labDrafts=lab_drafts,
        medicationDrafts=med_drafts,
    )


# ─────────────────────────────────────────────────────────────
# RULE-BASED FALLBACK (last resort only)
# ─────────────────────────────────────────────────────────────
def _rule_based_fallback(input_data: ClinicalCDSInput, reason: str = "Gemini unavailable") -> ClinicalCDSResult:
    text = f"{input_data.chief_complaint or ''} {input_data.symptoms or ''}".lower()
    vitals = input_data.vitals
    allergies = input_data.patient_allergies or ""

    thoughts: List[AgentThoughtStep] = []
    diagnoses: List[DiagnosisCandidate] = []
    lab_drafts: List[AgentLabDraft] = []
    med_drafts: List[AgentMedicationDraft] = []
    warnings: List[str] = []
    step = 1

    def add_step(thought, tool=None, tool_input=None, obs=""):
        nonlocal step
        thoughts.append(AgentThoughtStep(
            stepNumber=step, thought=thought, toolName=tool, toolInput=tool_input, observation=obs
        ))
        step += 1

    add_step(f"[Fallback Mode — {reason}] Initiating rule-based clinical evaluation.",
             "perceive_patient_context",
             f"symptoms={input_data.symptoms}, chief_complaint={input_data.chief_complaint}",
             "Patient context loaded via rule-based engine.")

    vitals_dict = {}
    if vitals:
        vitals_dict = {"bp": vitals.bp or "", "temp": vitals.temp or "", "pulse": vitals.pulse or "", "spo2": vitals.spo2 or ""}
    vitals_res = _safe_tool(calculate_vitals_risk_score, vitals=vitals_dict)
    urgency = _norm_urgency(vitals_res.get("urgency"))
    for f in vitals_res.get("findings", []) or []:
        _add_warning(warnings, str(f))
    add_step("Assessing vital signs for emergency flags.", "calculate_vitals_risk_score",
             json.dumps(vitals_dict), _summarize_tool_result("calculate_vitals_risk_score", vitals_res))

    if any(k in text for k in ["chest pain", "palpitations", "high bp", "dizziness", "shortness of breath"]):
        primary = "Hypertension"
        if urgency == "routine":
            urgency = "urgent"
        diagnoses += [
            DiagnosisCandidate(id="D1", diagnosis="Essential Hypertension", confidence=85, icdCode="I10",
                               evidence=["Elevated blood pressure readings", "Exertional dizziness"]),
            DiagnosisCandidate(id="D2", diagnosis="Angina Pectoris — Ischaemic Evaluation", confidence=65, icdCode="I20.9",
                               evidence=["Exertional chest discomfort", "Serial ECG monitoring required"]),
        ]
        lab_drafts += [
            AgentLabDraft(id="L1", testName="12-Lead ECG", indication="Cardiac rhythm and ischaemia assessment", urgency="urgent"),
            AgentLabDraft(id="L2", testName="Serum Troponin I (0h + 1h)", indication="Exclude acute myocardial injury", urgency="urgent"),
            AgentLabDraft(id="L3", testName="Lipid Profile", indication="Cardiovascular risk stratification", urgency="routine"),
        ]
    elif any(k in text for k in ["epigastric", "stomach", "gastritis", "acid", "heartburn", "nausea", "abdominal"]):
        primary = "Acute Gastritis"
        diagnoses += [
            DiagnosisCandidate(id="D1", diagnosis="Acute Gastritis", confidence=88, icdCode="K29.7",
                               evidence=["Reported epigastric discomfort", "Postprandial nausea", "Mucosal irritation pattern"]),
            DiagnosisCandidate(id="D2", diagnosis="Gastroesophageal Reflux Disease (GERD)", confidence=74, icdCode="K21.9",
                               evidence=["Retrosternal acid regurgitation", "Symptoms exacerbated after meals"]),
        ]
        lab_drafts += [
            AgentLabDraft(id="L1", testName="H. Pylori Stool Antigen Test", indication="Screen for H. pylori infection", urgency="routine"),
            AgentLabDraft(id="L2", testName="Full Blood Count (FBC)", indication="Exclude GI blood loss and anaemia", urgency="routine"),
        ]
    elif any(k in text for k in ["cough", "fever", "throat", "runny nose", "congestion", "sore throat"]):
        primary = "Acute Upper Respiratory Tract Infection"
        diagnoses += [
            DiagnosisCandidate(id="D1", diagnosis="Acute Upper Respiratory Tract Infection (URTI)", confidence=91, icdCode="J06.9",
                               evidence=["Respiratory symptoms with throat inflammation", "Febrile presentation"]),
            DiagnosisCandidate(id="D2", diagnosis="Acute Bronchitis", confidence=68, icdCode="J20.9",
                               evidence=["Productive cough", "Absence of pulmonary consolidation signs"]),
        ]
        lab_drafts += [
            AgentLabDraft(id="L1", testName="Full Blood Count (FBC)", indication="Differentiate bacterial vs viral infection", urgency="routine"),
            AgentLabDraft(id="L2", testName="C-Reactive Protein (CRP)", indication="Measure systemic inflammatory marker", urgency="routine"),
        ]
    else:
        primary = "Undifferentiated Presentation"
        diagnoses.append(DiagnosisCandidate(id="D1", diagnosis="Undifferentiated Clinical Presentation", confidence=70, icdCode="R69",
                                            evidence=["Non-specific symptoms reported", "Baseline workup required"]))
        lab_drafts.append(AgentLabDraft(id="L1", testName="Basic Metabolic Panel (BMP)",
                                        indication="Baseline electrolyte and renal function screen", urgency="routine"))

    guide_res = _safe_tool(query_clinical_guidelines, diagnosis_keywords=primary)
    add_step(f"Querying clinical knowledge base for guidelines on '{primary}'.", "query_clinical_guidelines",
             f"diagnosis_keywords={primary}", _summarize_tool_result("query_clinical_guidelines", guide_res))

    med_res = _safe_tool(generate_medication_drafts_from_diagnosis, diagnosis=primary, allergies=allergies)
    for idx, m in enumerate(med_res.get("medication_drafts", [])):
        try:
            med_drafts.append(AgentMedicationDraft(
                id=f"M{idx + 1}", drugName=m["drug_name"], dosage=m["dosage"], frequency=m["frequency"],
                duration=m["duration"], instructions=m["instructions"], safetyWarning=m.get("safety_warning"),
            ))
        except Exception:
            continue
    add_step(f"Generating medication drafts for '{primary}'.", "generate_medication_drafts_from_diagnosis",
             f"diagnosis={primary}, allergies={allergies}",
             _summarize_tool_result("generate_medication_drafts_from_diagnosis", med_res))

    proposed = [m.drugName for m in med_drafts]
    allergy_res = _safe_tool(check_allergy_contraindications, allergies=allergies, proposed_medications=proposed)
    for c in allergy_res.get("contraindications", []) or []:
        rec = c.get("recommendation", f"{c.get('drug')} contraindicated")
        _add_warning(warnings, f"ALLERGY ALERT: {rec}")
        for m in med_drafts:
            if str(c.get("drug", "")).lower() in m.drugName.lower():
                m.safetyWarning = f"CRITICAL CONTRAINDICATION: {rec}"

    if allergies.strip():
        al = allergies.lower()
        if "penicillin" in al or "amoxicillin" in al:
            _add_warning(warnings, "ALLERGY ALERT: Patient is allergic to Penicillins. Avoid beta-lactam prescribing.")
        elif "nsaid" in al or "aspirin" in al:
            _add_warning(warnings, "ALLERGY ALERT: Patient has reported NSAID sensitivity.")
        elif not any("ALLERGY ALERT" in w for w in warnings):
            _add_warning(warnings, f"ALLERGY ALERT: Documented allergy to {allergies.strip()}.")
    add_step(f"Running drug-allergy safety cross-check on {len(proposed)} proposed medications.",
             "check_allergy_contraindications", f"allergies={allergies}, meds={proposed}",
             _summarize_tool_result("check_allergy_contraindications", allergy_res))

    add_step("Rule-based execution complete. Draft care plan compiled for doctor review.",
             "finalize_clinical_plan", "status=pending_doctor_approval",
             f"Produced {len(diagnoses)} diagnoses, {len(lab_drafts)} lab orders, {len(med_drafts)} medication drafts.")

    return ClinicalCDSResult(
        diagnoses=diagnoses,
        labTests=[l.testName for l in lab_drafts],
        urgency=urgency,
        warnings=warnings,
        thoughtStream=thoughts,
        labDrafts=lab_drafts,
        medicationDrafts=med_drafts,
    )


# ─────────────────────────────────────────────────────────────
# MAIN ENTRY POINT — called by the FastAPI endpoint
# ─────────────────────────────────────────────────────────────
def evaluate_clinical_decision_support(input_data: ClinicalCDSInput) -> ClinicalCDSResult:
    """
    Cache -> Gemini (with retries / model rotation) -> rule-based fallback.
    Every request logs which engine served it.
    """
    if not _api_key():
        logger.info("ENGINE=fallback reason=no GEMINI_API_KEY")
        return _rule_based_fallback(input_data, "GEMINI_API_KEY not configured")

    key = _cache_key(input_data)
    cached = _cache_get(key)
    if cached is not None:
        logger.info("ENGINE=cache")
        return cached

    try:
        result = _run_gemini_agent(input_data)
        _cache_put(key, result)
        logger.info("ENGINE=gemini")
        return result
    except PermissionError as e:
        logger.error(f"ENGINE=fallback reason=bad API key: {e}")
        return _rule_based_fallback(input_data, "Gemini API key rejected")
    except Exception as e:
        logger.warning(f"ENGINE=fallback reason={e}")
        return _rule_based_fallback(input_data, f"Gemini unavailable: {str(e)[:120]}")