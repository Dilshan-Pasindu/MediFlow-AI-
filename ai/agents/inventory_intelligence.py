"""
MediFlow Pharmacy & Inventory Intelligence Agent — Agent 4
===========================================================
Predictive demand forecasting, stockout horizon detection,
and automated batch restock proposal generation for pharmacy inventory.
"""

from typing import List, Dict, Optional
import math
from ai.schemas.agent_schemas import (
    InventoryForecastInput,
    InventoryForecastResult,
    StockoutRiskItem,
    RestockProposal,
)

# Reference catalog with default typical burn rates and unit acquisition costs
MEDICINE_BENCHMARKS = [
    {"id": 1, "name": "Amoxicillin 500mg Capsule", "avg_daily_burn": 8.5, "unit_cost": 45.0, "reorder_pack": 100},
    {"id": 2, "name": "Paracetamol 500mg Tablet", "avg_daily_burn": 24.0, "unit_cost": 5.0, "reorder_pack": 500},
    {"id": 3, "name": "Omeprazole 20mg Capsule", "avg_daily_burn": 12.0, "unit_cost": 28.0, "reorder_pack": 150},
    {"id": 4, "name": "Metformin 500mg Tablet", "avg_daily_burn": 15.5, "unit_cost": 12.0, "reorder_pack": 300},
    {"id": 5, "name": "Amlodipine 5mg Tablet", "avg_daily_burn": 10.0, "unit_cost": 18.0, "reorder_pack": 200},
    {"id": 6, "name": "Atorvastatin 20mg Tablet", "avg_daily_burn": 7.0, "unit_cost": 35.0, "reorder_pack": 150},
    {"id": 7, "name": "Cetirizine 10mg Tablet", "avg_daily_burn": 9.0, "unit_cost": 8.0, "reorder_pack": 200},
    {"id": 8, "name": "Azithromycin 500mg Tablet", "avg_daily_burn": 4.5, "unit_cost": 120.0, "reorder_pack": 60},
    {"id": 9, "name": "Salbutamol Inhaler 100mcg", "avg_daily_burn": 2.0, "unit_cost": 650.0, "reorder_pack": 20},
    {"id": 10, "name": "Ciprofloxacin 500mg Tablet", "avg_daily_burn": 5.0, "unit_cost": 55.0, "reorder_pack": 100},
]

# Simulated current on-hand levels for typical demonstration
SIMULATED_PHARMACY_STOCK = {
    1: {"stock": 18, "custom_burn": 9.2},    # ~2 days -> CRITICAL
    2: {"stock": 140, "custom_burn": 28.0},  # ~5 days -> CRITICAL
    3: {"stock": 32, "custom_burn": 11.5},   # ~2.7 days -> CRITICAL
    4: {"stock": 110, "custom_burn": 14.0},  # ~7.8 days -> WARNING
    5: {"stock": 95, "custom_burn": 9.5},    # ~10 days -> WARNING
    6: {"stock": 250, "custom_burn": 6.8},   # ~36 days -> HEALTHY
    7: {"stock": 310, "custom_burn": 8.5},   # ~36 days -> HEALTHY
    8: {"stock": 12, "custom_burn": 4.0},    # ~3 days -> CRITICAL
    9: {"stock": 8, "custom_burn": 1.8},     # ~4.4 days -> CRITICAL
    10: {"stock": 180, "custom_burn": 5.2},  # ~34 days -> HEALTHY
}


def calculate_stockout_horizon(current_stock: int, daily_burn_rate: float) -> int:
    """Calculates integer days until stock reaches zero."""
    if daily_burn_rate <= 0:
        return 999
    return max(0, math.floor(current_stock / daily_burn_rate))


def calculate_reorder_quantity(daily_burn_rate: float, target_buffer_days: int = 30) -> int:
    """Calculates recommended reorder batch using buffer coverage rounded to tens."""
    ideal_qty = daily_burn_rate * target_buffer_days
    return max(50, math.ceil(ideal_qty / 10.0) * 10)


def evaluate_inventory_intelligence(payload: InventoryForecastInput) -> InventoryForecastResult:
    """
    Evaluates inventory status for a pharmacy, predicts stockout horizons,
    and constructs batch restock proposals.
    """
    risk_items: List[StockoutRiskItem] = []
    restock_proposals: List[RestockProposal] = []
    total_projected_cost: float = 0.0

    for item in MEDICINE_BENCHMARKS:
        med_id = item["id"]
        med_name = item["name"]
        unit_cost = item["unit_cost"]

        stock_info = SIMULATED_PHARMACY_STOCK.get(
            med_id,
            {"stock": 100, "custom_burn": item["avg_daily_burn"]}
        )
        current_stock = stock_info["stock"]
        daily_burn = stock_info["custom_burn"]

        days_left = calculate_stockout_horizon(current_stock, daily_burn)

        if days_left <= 5:
            urgency = "CRITICAL"
        elif days_left <= 14:
            urgency = "WARNING"
        else:
            urgency = "HEALTHY"

        risk_items.append(
            StockoutRiskItem(
                medicine_id=med_id,
                medicine_name=med_name,
                current_stock=current_stock,
                daily_burn_rate=round(daily_burn, 1),
                days_until_stockout=days_left,
                urgency=urgency,
            )
        )

        # Generate restock proposals for items in CRITICAL or WARNING state
        if urgency in ("CRITICAL", "WARNING"):
            qty = calculate_reorder_quantity(daily_burn, target_buffer_days=30)
            cost = qty * unit_cost
            total_projected_cost += cost

            priority = "HIGH" if urgency == "CRITICAL" else "NORMAL"
            reason = (
                f"Urgent stockout horizon: ~{days_left} days remaining at {daily_burn}/day burn. "
                f"Recommending {qty} units for 30-day safety buffer."
            )

            restock_proposals.append(
                RestockProposal(
                    medicine_id=med_id,
                    medicine_name=med_name,
                    suggested_quantity=qty,
                    reason=reason,
                    estimated_unit_cost=unit_cost,
                    priority=priority,
                )
            )

    # Sort risk items with most urgent first
    risk_items.sort(key=lambda x: x.days_until_stockout)
    restock_proposals.sort(key=lambda x: (0 if x.priority == "HIGH" else 1, -x.suggested_quantity))

    critical_count = sum(1 for r in risk_items if r.urgency == "CRITICAL")
    warning_count = sum(1 for r in risk_items if r.urgency == "WARNING")

    summary = (
        f"Inventory audit for Pharmacy #{payload.pharmacy_id} complete. "
        f"Identified {critical_count} critical stockout risks (<=5 days) and {warning_count} warnings (<=14 days). "
        f"Generated {len(restock_proposals)} automated restock batches totaling estimated LKR {total_projected_cost:,.2f}."
    )

    return InventoryForecastResult(
        pharmacy_id=payload.pharmacy_id,
        risk_items=risk_items,
        restock_recommendations=restock_proposals,
        total_projected_cost=round(total_projected_cost, 2),
        summary=summary,
    )
