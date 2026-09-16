"""
MediFlow Pharmacy & Inventory Intelligence — Controlled Tool Implementations
============================================================================
Six validated, deterministic tools consumed by the Inventory Intelligence Agent (Agent 4).

Documented tool names (called in this order by the agent orchestrator):
  1. getInventory()                — fetch real inventory + demand context from backend
  2. getHistoricalOrders()         — fetch raw dispensing transaction history
  3. calculateDemand()             — compute per-item demand rate (units/day)
  4. forecastDemand()              — project demand forward N days
  5. predictStockout()             — calculate days-until-stockout + urgency classification
  6. generateRestockRecommendation() — build validated, approval-ready proposals

Design rules:
  * All business arithmetic (demand, stockout, restock qty) is deterministic Python — no LLM.
  * Backend URL and service token are read ONLY from process environment variables.
  * No secret, URL, port, or credential is hard-coded anywhere in this file.
  * The agent never calls any restock creation or inventory mutation endpoint.
  * Business constants mirror InventoryService.cs (SafetyDays=45, DemandWindowDays=30).
  * The Backend → AI call chain is one-directional: no circular Backend→AI→Backend→AI calls.
"""

import os
import math
import logging
from typing import Any, Dict, List

import httpx

logger = logging.getLogger(__name__)

# ── Business constants — mirror MediFlow.Api/Services/InventoryService.cs ────
SAFETY_DAYS: int = 45           # Target coverage buffer (InventoryService.SafetyDays)
DEMAND_WINDOW_DAYS: int = 30    # Rolling demand window (InventoryService.DemandWindowDays)
CRITICAL_HORIZON_DAYS: int = 5  # ≤ 5 days → CRITICAL
WARNING_HORIZON_DAYS: int = 14  # ≤ 14 days → WARNING
MIN_ORDER_QTY: int = 10         # Minimum meaningful reorder quantity
ROUND_TO_NEAREST: int = 10      # Round reorder quantities to nearest 10
COST_REVIEW_THRESHOLD: float = 500_000.0  # Flag line costs above LKR 500 000

URGENCY_CRITICAL = "CRITICAL"
URGENCY_WARNING = "WARNING"
URGENCY_HEALTHY = "HEALTHY"


# ── Environment helpers ───────────────────────────────────────────────────────

def _get_backend_url() -> str:
    """Returns the backend base URL from BACKEND_URL environment variable."""
    url = os.environ.get("BACKEND_URL", "").rstrip("/")
    if not url:
        raise EnvironmentError(
            "BACKEND_URL is not configured. "
            "Add BACKEND_URL=http://localhost:5000 to ai/.env or set the environment variable."
        )
    return url


def _get_auth_headers() -> Dict[str, str]:
    """Returns Authorization headers using BACKEND_SERVICE_TOKEN environment variable."""
    token = os.environ.get("BACKEND_SERVICE_TOKEN", "").strip()
    if not token:
        raise EnvironmentError(
            "BACKEND_SERVICE_TOKEN is not configured. "
            "Add BACKEND_SERVICE_TOKEN=<JWT> to ai/.env or set the environment variable. "
            "Generate a token by logging in as PharmacyOwner or Administrator."
        )
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }


# ─────────────────────────────────────────────────────────────────────────────
# Tool 1: getInventory
# ─────────────────────────────────────────────────────────────────────────────

def getInventory(pharmacy_id: int, lookback_days: int = DEMAND_WINDOW_DAYS) -> Dict[str, Any]:
    """
    Fetches real current inventory and pre-computed demand context from the backend.

    Endpoint: POST /api/pharmacies/{pharmacyId}/generate-restock-recommendations
    Auth:     Bearer token from BACKEND_SERVICE_TOKEN env var

    The backend's InventoryService already computes for each item:
      - DemandRateLast30Days     (decimal units/day rolling average)
      - TotalDispensedLast30Days (int)
      - TotalRestockedLast30Days (int)
      - DaysUntilStockOut        (double)
      - ExpiringBatches          (list — batches expiring within 60 days)

    Returns a normalized dict containing the InventoryAgentContextDto fields
    and raw backend recommendations for cross-validation.

    Raises:
        EnvironmentError  — BACKEND_URL or BACKEND_SERVICE_TOKEN not set
        RuntimeError      — HTTP error or backend unreachable
        ValueError        — Backend returned empty inventory context
    """
    base_url = _get_backend_url()
    headers = _get_auth_headers()
    url = f"{base_url}/api/pharmacies/{pharmacy_id}/generate-restock-recommendations"

    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(url, headers=headers)
        response.raise_for_status()
        data = response.json()
    except httpx.HTTPStatusError as exc:
        status = exc.response.status_code
        detail = exc.response.text[:300]
        logger.error("getInventory: HTTP %s from backend for pharmacy %s: %s", status, pharmacy_id, detail)
        if status == 401:
            raise RuntimeError(
                f"Backend returned 401 Unauthorized for pharmacy {pharmacy_id}. "
                "Verify BACKEND_SERVICE_TOKEN is a valid, unexpired JWT with "
                "PharmacyOwner or Administrator role."
            ) from exc
        if status == 403:
            raise RuntimeError(
                f"Backend returned 403 Forbidden for pharmacy {pharmacy_id}. "
                "Ensure the token's user owns this pharmacy or has Administrator role."
            ) from exc
        if status == 404:
            raise RuntimeError(
                f"Pharmacy {pharmacy_id} not found in backend. "
                "Verify the pharmacy_id is correct."
            ) from exc
        raise RuntimeError(
            f"Backend returned HTTP {status} for pharmacy {pharmacy_id}: {detail}"
        ) from exc
    except httpx.RequestError as exc:
        logger.error("getInventory: Network error reaching backend at %s: %s", base_url, exc)
        raise RuntimeError(
            f"Cannot reach backend at {base_url}. "
            "Verify BACKEND_URL is correct and the backend service is running."
        ) from exc

    agent_context = data.get("agentContext") or {}
    items = agent_context.get("items") or []
    if not items:
        raise ValueError(
            f"Backend returned an empty inventory context for pharmacy {pharmacy_id}. "
            "Ensure the pharmacy has at least one inventory item before running the agent."
        )

    logger.info(
        "getInventory: Retrieved %d inventory items for pharmacy %d (%s).",
        len(items), pharmacy_id, agent_context.get("pharmacyName", "unknown")
    )
    return {
        "pharmacy_id": agent_context.get("pharmacyId", pharmacy_id),
        "pharmacy_name": agent_context.get("pharmacyName", f"Pharmacy #{pharmacy_id}"),
        "context_generated_at": agent_context.get("contextGeneratedAt", ""),
        "items": items,
        "backend_recommendations": data.get("recommendations") or [],
        "lookback_days": lookback_days,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Tool 2: getHistoricalOrders
# ─────────────────────────────────────────────────────────────────────────────

def getHistoricalOrders(pharmacy_id: int, lookback_days: int = DEMAND_WINDOW_DAYS) -> Dict[str, Any]:
    """
    Fetches raw dispensing and restock transaction history for a pharmacy.

    Endpoint: GET /api/inventory/transactions?pharmacyId={id}&days={days}
    Auth:     Bearer token from BACKEND_SERVICE_TOKEN env var

    Returns aggregated summary per medicine:
      - total_dispensed      — abs sum of Dispense transactions in the window
      - total_restocked      — sum of Restock transactions
      - transaction_count    — total number of transactions
      - daily_dispense_avg   — total_dispensed / lookback_days

    On network error or HTTP failure, logs a warning and returns an empty
    summary (non-blocking — getInventory already contains pre-computed demand).
    """
    base_url = _get_backend_url()
    headers = _get_auth_headers()
    url = f"{base_url}/api/inventory/transactions"
    params: Dict[str, Any] = {"pharmacyId": pharmacy_id, "days": lookback_days}

    try:
        with httpx.Client(timeout=20.0) as client:
            response = client.get(url, headers=headers, params=params)
        response.raise_for_status()
        transactions: List[Dict[str, Any]] = response.json()
    except (httpx.HTTPStatusError, httpx.RequestError) as exc:
        logger.warning(
            "getHistoricalOrders: Could not fetch transaction history (non-fatal): %s. "
            "Proceeding with demand data from getInventory().",
            exc
        )
        transactions = []

    # Aggregate by medicine
    summary: Dict[str, Dict[str, Any]] = {}
    for tx in transactions:
        medicine_name = tx.get("medicineName") or "Unknown"
        tx_type = tx.get("transactionType") or ""
        qty = abs(int(tx.get("quantityChanged") or 0))

        if medicine_name not in summary:
            summary[medicine_name] = {
                "medicine_name": medicine_name,
                "total_dispensed": 0,
                "total_restocked": 0,
                "transaction_count": 0,
            }
        summary[medicine_name]["transaction_count"] += 1
        if tx_type == "Dispense":
            summary[medicine_name]["total_dispensed"] += qty
        elif tx_type == "Restock":
            summary[medicine_name]["total_restocked"] += qty

    # Compute daily averages
    for med in summary.values():
        med["daily_dispense_avg"] = round(
            med["total_dispensed"] / max(lookback_days, 1), 4
        )

    logger.info(
        "getHistoricalOrders: %d transactions across %d medicines for pharmacy %d.",
        len(transactions), len(summary), pharmacy_id
    )
    return {
        "pharmacy_id": pharmacy_id,
        "lookback_days": lookback_days,
        "transaction_count": len(transactions),
        "by_medicine": list(summary.values()),
    }


# ─────────────────────────────────────────────────────────────────────────────
# Tool 3: calculateDemand
# ─────────────────────────────────────────────────────────────────────────────

def calculateDemand(inventory_context: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Computes validated demand metrics for each inventory item.

    Input:  inventory_context dict returned by getInventory()
    Output: List of per-item dicts enriched with:
      - demand_rate_per_day   — authoritative value from backend InventoryService
                                (DemandRateLast30Days). Clamped to ≥ 0.
      - total_dispensed_30d   — raw dispensed units in the demand window
      - demand_confidence     — "high" (has dispense transactions) | "low" (zero activity)
      - has_demand_history    — bool

    Business logic mirrors InventoryService.cs demand calculation.
    No values are invented; demand_rate_per_day is the backend-computed rolling average.
    """
    items: List[Dict[str, Any]] = inventory_context.get("items") or []
    result: List[Dict[str, Any]] = []

    for item in items:
        demand_rate = max(0.0, float(item.get("demandRateLast30Days") or 0))
        total_dispensed = max(0, int(item.get("totalDispensedLast30Days") or 0))
        current_stock = max(0, int(item.get("currentStock") or 0))
        min_stock = max(0, int(item.get("minStockLevel") or 0))
        unit_price = max(0.0, float(item.get("unitPrice") or 0))

        has_demand_history = total_dispensed > 0
        demand_confidence = "high" if has_demand_history else "low"

        result.append({
            "medicine_id": item.get("medicineId"),
            "medicine_name": item.get("medicineName") or "",
            "category": item.get("category") or "",
            "current_stock": current_stock,
            "min_stock_level": min_stock,
            "unit_price": unit_price,
            "demand_rate_per_day": round(demand_rate, 4),
            "total_dispensed_30d": total_dispensed,
            "total_restocked_30d": max(0, int(item.get("totalRestockedLast30Days") or 0)),
            "demand_confidence": demand_confidence,
            "has_demand_history": has_demand_history,
            "expiring_batches": item.get("expiringBatches") or [],
        })

    high_conf = sum(1 for i in result if i["has_demand_history"])
    logger.info(
        "calculateDemand: %d items processed; %d have dispensing history (high confidence).",
        len(result), high_conf
    )
    return result


# ─────────────────────────────────────────────────────────────────────────────
# Tool 4: forecastDemand
# ─────────────────────────────────────────────────────────────────────────────

def forecastDemand(
    demand_items: List[Dict[str, Any]],
    forecast_days: int = SAFETY_DAYS,
) -> List[Dict[str, Any]]:
    """
    Projects demand forward by forecast_days for each item.

    Input:  demand_items list from calculateDemand()
    Output: Items enriched with:
      - projected_demand_units   — ceil(demand_rate_per_day * forecast_days)
      - safety_stock_target      — units needed to cover forecast_days of demand
      - forecast_days            — projection window used
      - restock_gap              — units needed above current stock to reach safety target
                                   Formula: max(0, safety_stock_target - current_stock)
                                   Matches InventoryService: (SafetyDays * demandRate) - currentStock

    For items with no demand history (demand_rate = 0), uses min_stock_level as the
    conservative safety target — matching InventoryService fallback behaviour.
    """
    result: List[Dict[str, Any]] = []

    for item in demand_items:
        demand_rate = item["demand_rate_per_day"]
        current_stock = item["current_stock"]
        min_stock = item["min_stock_level"]

        if demand_rate > 0:
            projected_demand = math.ceil(demand_rate * forecast_days)
            safety_stock_target = projected_demand
            restock_gap = max(0, safety_stock_target - current_stock)
        else:
            # No consumption history: use min_stock_level as conservative target
            projected_demand = min_stock
            safety_stock_target = min_stock
            restock_gap = max(0, min_stock - current_stock)

        result.append({
            **item,
            "projected_demand_units": projected_demand,
            "safety_stock_target": safety_stock_target,
            "forecast_days": forecast_days,
            "restock_gap": restock_gap,
        })

    logger.info(
        "forecastDemand: %d items projected over %d days. "
        "%d items have a non-zero restock gap.",
        len(result), forecast_days, sum(1 for i in result if i["restock_gap"] > 0)
    )
    return result


# ─────────────────────────────────────────────────────────────────────────────
# Tool 5: predictStockout
# ─────────────────────────────────────────────────────────────────────────────

def predictStockout(forecast_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Predicts stockout horizon and risk classification for each inventory item.

    Input:  forecast_items list from forecastDemand()
    Output: Items enriched with:
      - days_until_stockout   — floor(current_stock / demand_rate_per_day)
                                999 when demand_rate = 0 (no active consumption risk)
      - urgency               — CRITICAL (≤5d) | WARNING (≤14d) | HEALTHY (>14d)
      - stockout_risk_score   — 0–100 (100 = already out of stock)
      - needs_restock         — True if CRITICAL | WARNING | below min_stock_level
      - below_min_stock       — True if current_stock < min_stock_level

    Urgency thresholds match InventoryService.cs classification logic.
    """
    result: List[Dict[str, Any]] = []

    for item in forecast_items:
        demand_rate = item["demand_rate_per_day"]
        current_stock = item["current_stock"]
        min_stock = item["min_stock_level"]

        # --- Days until stockout ---
        if demand_rate > 0:
            days_until_stockout = math.floor(current_stock / demand_rate)
        else:
            days_until_stockout = 999  # No active consumption

        # --- Urgency + risk score ---
        if current_stock == 0:
            urgency = URGENCY_CRITICAL
            risk_score = 100
        elif days_until_stockout <= CRITICAL_HORIZON_DAYS:
            urgency = URGENCY_CRITICAL
            # Score 70–99 range
            risk_score = min(99, 70 + int((CRITICAL_HORIZON_DAYS - days_until_stockout) * 6))
        elif days_until_stockout <= WARNING_HORIZON_DAYS:
            urgency = URGENCY_WARNING
            # Score 30–69 range
            remaining_band = WARNING_HORIZON_DAYS - CRITICAL_HORIZON_DAYS
            position = days_until_stockout - CRITICAL_HORIZON_DAYS
            risk_score = max(30, 69 - int(position / remaining_band * 39))
        else:
            urgency = URGENCY_HEALTHY
            # Score 0–29 range
            risk_score = max(0, min(29, int(29 - (days_until_stockout - WARNING_HORIZON_DAYS) * 0.5)))

        below_min = current_stock < min_stock
        needs_restock = urgency in (URGENCY_CRITICAL, URGENCY_WARNING) or below_min

        result.append({
            **item,
            "days_until_stockout": days_until_stockout,
            "urgency": urgency,
            "stockout_risk_score": risk_score,
            "needs_restock": needs_restock,
            "below_min_stock": below_min,
        })

    critical_count = sum(1 for i in result if i["urgency"] == URGENCY_CRITICAL)
    warning_count = sum(1 for i in result if i["urgency"] == URGENCY_WARNING)
    logger.info(
        "predictStockout: %d CRITICAL, %d WARNING, %d HEALTHY items.",
        critical_count, warning_count,
        len(result) - critical_count - warning_count
    )
    return result


# ─────────────────────────────────────────────────────────────────────────────
# Tool 6: generateRestockRecommendation
# ─────────────────────────────────────────────────────────────────────────────

def generateRestockRecommendation(
    stockout_items: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Generates validated, approval-ready restock proposals for items that need restocking.

    Input:  stockout_items list from predictStockout()
    Output: {
      "proposals"               — list of RestockProposal-compatible dicts
      "total_projected_cost"    — estimated total LKR cost of all proposals
      "safety_check_flags"      — list of validation warnings / anomalies
      "items_requiring_action"  — count of items for which proposals were generated
    }

    Quantity formula (mirrors InventoryService.cs):
      raw_qty       = max(0, ceil(SAFETY_DAYS * demand_rate) - current_stock)
      proposed_qty  = ceil(raw_qty / ROUND_TO_NEAREST) * ROUND_TO_NEAREST
      proposed_qty  = max(proposed_qty, MIN_ORDER_QTY)

    Deterministic safety checks performed before each proposal is emitted:
      1. Quantity must be > 0 after calculation (skips otherwise)
      2. Line cost > LKR 500 000 → flagged for manual review (still included)
      3. Expiry awareness: batches expiring in ≤ 30 days noted in flags

    IMPORTANT: This tool ONLY generates proposals.
               It does NOT call any restock creation or inventory mutation endpoint.
               The PharmacyOwner must approve each proposal via the existing
               Owner Dashboard workflow before any restock request is created.
    """
    proposals: List[Dict[str, Any]] = []
    safety_flags: List[str] = []
    total_cost = 0.0

    # Sort: CRITICAL first, then WARNING, then ascending days_until_stockout
    urgency_order = {URGENCY_CRITICAL: 0, URGENCY_WARNING: 1, URGENCY_HEALTHY: 2}
    candidates = sorted(
        [i for i in stockout_items if i.get("needs_restock", False)],
        key=lambda x: (urgency_order.get(x["urgency"], 3), x["days_until_stockout"]),
    )

    for item in candidates:
        demand_rate = item["demand_rate_per_day"]
        current_stock = item["current_stock"]
        min_stock = item["min_stock_level"]
        unit_price = item["unit_price"]
        urgency = item["urgency"]
        days_until_stockout = item["days_until_stockout"]
        medicine_name = item["medicine_name"]

        # ── Safety Check 1: Quantity calculation ───────────────────────────
        if demand_rate > 0:
            # Cover SAFETY_DAYS of demand; subtract stock already on hand
            raw_qty = max(0, math.ceil(SAFETY_DAYS * demand_rate) - current_stock)
        else:
            # No demand history: fill up to min_stock_level
            raw_qty = max(0, min_stock - current_stock)

        if raw_qty <= 0:
            safety_flags.append(
                f"[SKIP] {medicine_name}: Computed restock quantity ≤ 0 "
                f"(current stock {current_stock} already covers {SAFETY_DAYS}-day target). Skipped."
            )
            continue

        # Round up to nearest ROUND_TO_NEAREST, enforce MIN_ORDER_QTY floor
        proposed_qty = max(
            MIN_ORDER_QTY,
            math.ceil(raw_qty / ROUND_TO_NEAREST) * ROUND_TO_NEAREST,
        )

        # ── Safety Check 2: Cost anomaly detection ─────────────────────────
        line_cost = proposed_qty * unit_price
        if unit_price > 0 and line_cost > COST_REVIEW_THRESHOLD:
            safety_flags.append(
                f"[REVIEW] {medicine_name}: Line cost LKR {line_cost:,.2f} exceeds "
                f"LKR {COST_REVIEW_THRESHOLD:,.0f}. Manual review recommended before approval."
            )

        # ── Safety Check 3: Expiry awareness ──────────────────────────────
        expiring_batches = item.get("expiring_batches") or []
        near_expiry_qty = sum(
            int(b.get("quantity") or 0)
            for b in expiring_batches
            if int(b.get("daysUntilExpiry") or 999) <= 30
        )
        if near_expiry_qty > 0:
            safety_flags.append(
                f"[EXPIRY] {medicine_name}: {near_expiry_qty} units in batches "
                f"expiring within 30 days. Consider expiry impact on restock quantity."
            )

        # ── Build priority and reason ──────────────────────────────────────
        priority = "HIGH" if urgency == URGENCY_CRITICAL else "NORMAL"

        if current_stock == 0:
            reason = (
                f"OUT OF STOCK. Demand: {demand_rate:.1f} units/day (30-day rolling average). "
                f"Recommending {proposed_qty} units for {SAFETY_DAYS}-day safety buffer."
            )
        elif days_until_stockout <= CRITICAL_HORIZON_DAYS:
            reason = (
                f"CRITICAL: ~{days_until_stockout} day(s) until stockout at "
                f"{demand_rate:.1f} units/day. Current stock: {current_stock}. "
                f"Recommending {proposed_qty} units ({SAFETY_DAYS}-day buffer)."
            )
        elif days_until_stockout <= WARNING_HORIZON_DAYS:
            reason = (
                f"WARNING: ~{days_until_stockout} days until stockout at "
                f"{demand_rate:.1f} units/day. Current stock: {current_stock}. "
                f"Recommending {proposed_qty} units."
            )
        else:
            reason = (
                f"Below minimum stock level ({current_stock}/{min_stock} units). "
                f"Demand: {demand_rate:.1f} units/day. "
                f"Recommending {proposed_qty} units to restore {SAFETY_DAYS}-day buffer."
            )

        total_cost += line_cost
        proposals.append({
            "medicine_id": item["medicine_id"],
            "medicine_name": medicine_name,
            "suggested_quantity": proposed_qty,
            "reason": reason,
            "estimated_unit_cost": round(unit_price, 2),
            "priority": priority,
        })

    logger.info(
        "generateRestockRecommendation: %d proposals generated. "
        "Total estimated cost: LKR %s. %d safety flag(s) raised.",
        len(proposals), f"{total_cost:,.2f}", len(safety_flags)
    )
    return {
        "proposals": proposals,
        "total_projected_cost": round(total_cost, 2),
        "safety_check_flags": safety_flags,
        "items_requiring_action": len(proposals),
    }
