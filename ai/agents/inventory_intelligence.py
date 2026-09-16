"""
MediFlow Pharmacy & Inventory Intelligence Agent — Agent 4
===========================================================
Predictive demand forecasting, stockout horizon detection, and automated
batch restock proposal generation for pharmacy inventory.

Upgrade (v2): Replaced all hard-coded/simulated data with real backend data
consumed through six controlled, deterministic tools (inventory_tools.py).

Tool execution pipeline (one-directional; no circular calls):
  Step 1 — getInventory()                  → real inventory + demand context
  Step 2 — getHistoricalOrders()           → raw dispensing transaction history
  Step 3 — calculateDemand()               → per-item demand metrics (validated)
  Step 4 — forecastDemand()                → demand projection (deterministic)
  Step 5 — predictStockout()               → days-until-stockout + urgency
  Step 6 — generateRestockRecommendation() → validated, approval-ready proposals

Approval gate: All output is proposals only.
               The PharmacyOwner MUST approve each item via the existing
               Owner Dashboard → AI Restock Analysis → "Approve & Send to Supplier" flow.
               This agent never calls any restock creation or inventory mutation endpoint.
"""

import logging
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import List

# ── Path resolution for all run contexts ─────────────────────────────────────
_current_dir = Path(__file__).resolve().parent
_ai_dir = _current_dir.parent
_workspace_root = _ai_dir.parent
for _p in [str(_workspace_root), str(_ai_dir)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

# ── Load .env file if present (for local development) ────────────────────────
try:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=str(_ai_dir / ".env"))
    load_dotenv(dotenv_path=str(_workspace_root / ".env"))
except ImportError:
    pass

# ── Schema imports (supports both package and direct run contexts) ─────────────
try:
    from ai.schemas.agent_schemas import (
        InventoryForecastInput,
        InventoryForecastResult,
        StockoutRiskItem,
        RestockProposal,
    )
    from ai.agents.inventory_tools import (
        getInventory,
        getHistoricalOrders,
        calculateDemand,
        forecastDemand,
        predictStockout,
        generateRestockRecommendation,
        SAFETY_DAYS,
        CRITICAL_HORIZON_DAYS,
        WARNING_HORIZON_DAYS,
    )
except ImportError:
    from schemas.agent_schemas import (  # type: ignore[no-redef]
        InventoryForecastInput,
        InventoryForecastResult,
        StockoutRiskItem,
        RestockProposal,
    )
    from agents.inventory_tools import (  # type: ignore[no-redef]
        getInventory,
        getHistoricalOrders,
        calculateDemand,
        forecastDemand,
        predictStockout,
        generateRestockRecommendation,
        SAFETY_DAYS,
        CRITICAL_HORIZON_DAYS,
        WARNING_HORIZON_DAYS,
    )

logger = logging.getLogger(__name__)


def evaluate_inventory_intelligence(
    payload: InventoryForecastInput,
) -> InventoryForecastResult:
    """
    Orchestrates the six Inventory Intelligence tools to produce a structured,
    validated restock forecast for a pharmacy.

    Arguments:
        payload.pharmacy_id    — pharmacy to analyse (required)
        payload.lookback_days  — demand history window in days (default: 30)

    Returns:
        InventoryForecastResult containing:
          - risk_items              — all items with stockout horizon + urgency
          - restock_recommendations — proposals for CRITICAL/WARNING/below-min items
          - total_projected_cost    — estimated LKR total for all proposals
          - summary                 — audit narrative with workflow step log
          - workflow_audit          — structured dict of step timings and counts

    Raises:
        EnvironmentError — BACKEND_URL or BACKEND_SERVICE_TOKEN not configured
        RuntimeError     — backend unreachable or returned unexpected HTTP error
        ValueError       — pharmacy has no inventory items
    """
    lookback_days = payload.lookback_days or 30
    pharmacy_id = payload.pharmacy_id

    # Workflow audit tracking
    audit: dict = {
        "pharmacy_id": pharmacy_id,
        "lookback_days": lookback_days,
        "started_at": datetime.now(timezone.utc).isoformat(),
        "steps": [],
        "safety_flags": [],
    }

    def _log_step(name: str, detail: str) -> None:
        audit["steps"].append({
            "tool": name,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "detail": detail,
        })

    # ── Step 1: getInventory ──────────────────────────────────────────────────
    logger.info("[Agent4] Step 1 — getInventory(pharmacy_id=%d, lookback_days=%d)",
                pharmacy_id, lookback_days)
    inventory_context = getInventory(pharmacy_id, lookback_days)
    _log_step("getInventory", f"Retrieved {len(inventory_context['items'])} items from backend.")

    # ── Step 2: getHistoricalOrders ───────────────────────────────────────────
    logger.info("[Agent4] Step 2 — getHistoricalOrders(pharmacy_id=%d, lookback_days=%d)",
                pharmacy_id, lookback_days)
    historical_orders = getHistoricalOrders(pharmacy_id, lookback_days)
    _log_step("getHistoricalOrders",
              f"{historical_orders['transaction_count']} transactions across "
              f"{len(historical_orders['by_medicine'])} medicines.")

    # ── Step 3: calculateDemand ───────────────────────────────────────────────
    logger.info("[Agent4] Step 3 — calculateDemand()")
    demand_items = calculateDemand(inventory_context)
    high_conf = sum(1 for i in demand_items if i["has_demand_history"])
    _log_step("calculateDemand",
              f"{len(demand_items)} items; {high_conf} with high-confidence demand history.")

    # ── Step 4: forecastDemand ────────────────────────────────────────────────
    logger.info("[Agent4] Step 4 — forecastDemand(forecast_days=%d)", SAFETY_DAYS)
    forecast_items = forecastDemand(demand_items, forecast_days=SAFETY_DAYS)
    _log_step("forecastDemand",
              f"{sum(1 for i in forecast_items if i['restock_gap'] > 0)} items with non-zero restock gap.")

    # ── Step 5: predictStockout ───────────────────────────────────────────────
    logger.info("[Agent4] Step 5 — predictStockout()")
    stockout_items = predictStockout(forecast_items)
    critical_count = sum(1 for i in stockout_items if i["urgency"] == "CRITICAL")
    warning_count = sum(1 for i in stockout_items if i["urgency"] == "WARNING")
    _log_step("predictStockout",
              f"{critical_count} CRITICAL, {warning_count} WARNING, "
              f"{len(stockout_items) - critical_count - warning_count} HEALTHY.")

    # ── Step 6: generateRestockRecommendation ─────────────────────────────────
    logger.info("[Agent4] Step 6 — generateRestockRecommendation()")
    recommendation_result = generateRestockRecommendation(stockout_items)
    audit["safety_flags"] = recommendation_result["safety_check_flags"]
    _log_step("generateRestockRecommendation",
              f"{recommendation_result['items_requiring_action']} proposals. "
              f"Total cost: LKR {recommendation_result['total_projected_cost']:,.2f}. "
              f"{len(audit['safety_flags'])} safety flag(s).")

    audit["completed_at"] = datetime.now(timezone.utc).isoformat()

    # ── Map to StockoutRiskItem schema ────────────────────────────────────────
    risk_items: List[StockoutRiskItem] = [
        StockoutRiskItem(
            medicine_id=item["medicine_id"],
            medicine_name=item["medicine_name"],
            current_stock=item["current_stock"],
            daily_burn_rate=round(item["demand_rate_per_day"], 1),
            days_until_stockout=item["days_until_stockout"],
            urgency=item["urgency"],
        )
        for item in sorted(stockout_items, key=lambda x: x["days_until_stockout"])
    ]

    # ── Map to RestockProposal schema ─────────────────────────────────────────
    restock_proposals: List[RestockProposal] = [
        RestockProposal(
            medicine_id=p["medicine_id"],
            medicine_name=p["medicine_name"],
            suggested_quantity=p["suggested_quantity"],
            reason=p["reason"],
            estimated_unit_cost=p["estimated_unit_cost"],
            priority=p["priority"],
        )
        for p in recommendation_result["proposals"]
    ]

    # ── Build human-readable summary with approval gate reminder ──────────────
    flag_note = ""
    if audit["safety_flags"]:
        flag_note = (
            f" {len(audit['safety_flags'])} safety flag(s) raised — "
            f"review before approving flagged proposals."
        )

    summary = (
        f"Inventory audit for {inventory_context['pharmacy_name']} "
        f"(Pharmacy #{pharmacy_id}) complete. "
        f"Analysed {len(stockout_items)} medicines using {lookback_days}-day "
        f"dispensing history ({historical_orders['transaction_count']} transactions). "
        f"Identified {critical_count} critical stockout risk(s) (≤{CRITICAL_HORIZON_DAYS} days) "
        f"and {warning_count} warning(s) (≤{WARNING_HORIZON_DAYS} days). "
        f"Generated {len(restock_proposals)} restock proposal(s) totalling estimated "
        f"LKR {recommendation_result['total_projected_cost']:,.2f}.{flag_note} "
        f"[APPROVAL REQUIRED: Each proposal must be reviewed and approved by the "
        f"Pharmacy Owner before any restock request is submitted to a supplier.]"
    )

    logger.info("[Agent4] Completed. %d proposals, LKR %s total. %s",
                len(restock_proposals),
                f"{recommendation_result['total_projected_cost']:,.2f}",
                "Approval pending." if restock_proposals else "No action required.")

    return InventoryForecastResult(
        pharmacy_id=pharmacy_id,
        risk_items=risk_items,
        restock_recommendations=restock_proposals,
        total_projected_cost=recommendation_result["total_projected_cost"],
        summary=summary,
        workflow_audit=audit,
    )
