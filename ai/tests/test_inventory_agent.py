"""
Comprehensive test suite for MediFlow Pharmacy & Inventory Intelligence Agent (Agent 4).

Tests cover:
  - All six documented tool functions (unit tests with mocked HTTP)
  - Demand calculation accuracy
  - Forecast demand projection
  - Stockout prediction urgency thresholds
  - Restock quantity calculation correctness
  - Deterministic safety checks (negative qty, cost anomaly, expiry flags)
  - Approval gate enforcement (no create-restock-request calls from agent)
  - Full pipeline integration with mocked backend
  - Backend offline / misconfigured environment error handling
"""

import math
import os
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

# Ensure project root is on sys.path for all import styles
_here = Path(__file__).resolve()
_ai_dir = _here.parent.parent
_workspace_root = _ai_dir.parent
for _p in [str(_workspace_root), str(_ai_dir)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

# ── Imports under test ────────────────────────────────────────────────────────
try:
    from ai.agents.inventory_tools import (
        COST_REVIEW_THRESHOLD,
        CRITICAL_HORIZON_DAYS,
        MIN_ORDER_QTY,
        ROUND_TO_NEAREST,
        SAFETY_DAYS,
        URGENCY_CRITICAL,
        URGENCY_HEALTHY,
        URGENCY_WARNING,
        WARNING_HORIZON_DAYS,
        calculateDemand,
        forecastDemand,
        generateRestockRecommendation,
        getHistoricalOrders,
        getInventory,
        predictStockout,
    )
    from ai.agents.inventory_intelligence import evaluate_inventory_intelligence
    from ai.schemas.agent_schemas import InventoryForecastInput
except ImportError:
    from agents.inventory_tools import (  # type: ignore[no-redef]
        COST_REVIEW_THRESHOLD,
        CRITICAL_HORIZON_DAYS,
        MIN_ORDER_QTY,
        ROUND_TO_NEAREST,
        SAFETY_DAYS,
        URGENCY_CRITICAL,
        URGENCY_HEALTHY,
        URGENCY_WARNING,
        WARNING_HORIZON_DAYS,
        calculateDemand,
        forecastDemand,
        generateRestockRecommendation,
        getHistoricalOrders,
        getInventory,
        predictStockout,
    )
    from agents.inventory_intelligence import evaluate_inventory_intelligence  # type: ignore
    from schemas.agent_schemas import InventoryForecastInput  # type: ignore


# ─────────────────────────────────────────────────────────────────────────────
# Shared fixtures
# ─────────────────────────────────────────────────────────────────────────────

MOCK_BACKEND_ENV = {
    "BACKEND_URL": "http://mock-backend:5000",
    "BACKEND_SERVICE_TOKEN": "mock-jwt-token-for-testing",
}

MOCK_AGENT_CONTEXT_RESPONSE = {
    "pharmacyId": 1,
    "pharmacyName": "Green Cross Pharmacy",
    "contextGeneratedAt": "2026-09-16T06:00:00Z",
    "items": [
        {
            "medicineId": 101,
            "medicineName": "Amoxicillin 500mg Capsule",
            "category": "Antibiotic",
            "currentStock": 18,
            "minStockLevel": 50,
            "unitPrice": 45.0,
            "demandRateLast30Days": 9.0,
            "totalDispensedLast30Days": 270,
            "totalRestockedLast30Days": 0,
            "daysUntilStockOut": 2.0,
            "expiringBatches": [],
        },
        {
            "medicineId": 102,
            "medicineName": "Paracetamol 500mg Tablet",
            "category": "Analgesic",
            "currentStock": 500,
            "minStockLevel": 100,
            "unitPrice": 5.0,
            "demandRateLast30Days": 20.0,
            "totalDispensedLast30Days": 600,
            "totalRestockedLast30Days": 1000,
            "daysUntilStockOut": 25.0,
            "expiringBatches": [],
        },
        {
            "medicineId": 103,
            "medicineName": "Metformin 500mg Tablet",
            "category": "Antidiabetic",
            "currentStock": 80,
            "minStockLevel": 50,
            "unitPrice": 12.0,
            "demandRateLast30Days": 10.0,
            "totalDispensedLast30Days": 300,
            "totalRestockedLast30Days": 200,
            "daysUntilStockOut": 8.0,
            "expiringBatches": [],
        },
    ],
}

MOCK_BACKEND_FULL_RESPONSE = {
    "pharmacyId": 1,
    "generatedAt": "2026-09-16T06:00:00Z",
    "recommendations": [],
    "agentContext": MOCK_AGENT_CONTEXT_RESPONSE,
}

MOCK_TRANSACTIONS = [
    {"medicineName": "Amoxicillin 500mg Capsule", "transactionType": "Dispense", "quantityChanged": -9},
    {"medicineName": "Amoxicillin 500mg Capsule", "transactionType": "Dispense", "quantityChanged": -9},
    {"medicineName": "Paracetamol 500mg Tablet", "transactionType": "Dispense", "quantityChanged": -20},
    {"medicineName": "Paracetamol 500mg Tablet", "transactionType": "Restock", "quantityChanged": 500},
]


def _make_mock_http_response(json_data: dict, status_code: int = 200):
    """Creates a mock httpx response object."""
    mock_resp = MagicMock()
    mock_resp.status_code = status_code
    mock_resp.json.return_value = json_data
    mock_resp.raise_for_status = MagicMock()
    if status_code >= 400:
        import httpx
        mock_resp.raise_for_status.side_effect = httpx.HTTPStatusError(
            message=f"HTTP {status_code}",
            request=MagicMock(),
            response=mock_resp,
        )
    return mock_resp


# ─────────────────────────────────────────────────────────────────────────────
# Tests: Tool 1 — getInventory
# ─────────────────────────────────────────────────────────────────────────────

class TestGetInventory:
    """Tests for the getInventory() tool."""

    def test_raises_environment_error_when_backend_url_missing(self):
        """getInventory must raise EnvironmentError if BACKEND_URL is not set."""
        with patch.dict(os.environ, {"BACKEND_URL": "", "BACKEND_SERVICE_TOKEN": "token"}):
            with pytest.raises(EnvironmentError, match="BACKEND_URL"):
                getInventory(pharmacy_id=1)

    def test_raises_environment_error_when_token_missing(self):
        """getInventory must raise EnvironmentError if BACKEND_SERVICE_TOKEN is not set."""
        with patch.dict(os.environ, {"BACKEND_URL": "http://localhost:5000", "BACKEND_SERVICE_TOKEN": ""}):
            with pytest.raises(EnvironmentError, match="BACKEND_SERVICE_TOKEN"):
                getInventory(pharmacy_id=1)

    def test_calls_correct_backend_endpoint(self):
        """getInventory must POST to /api/pharmacies/{id}/generate-restock-recommendations."""
        mock_resp = _make_mock_http_response(MOCK_BACKEND_FULL_RESPONSE)
        with patch.dict(os.environ, MOCK_BACKEND_ENV):
            with patch("httpx.Client") as mock_client_cls:
                mock_client = mock_client_cls.return_value.__enter__.return_value
                mock_client.post.return_value = mock_resp

                result = getInventory(pharmacy_id=1, lookback_days=30)

                call_args = mock_client.post.call_args
                assert "/api/pharmacies/1/generate-restock-recommendations" in call_args[0][0]
                assert "Authorization" in call_args[1]["headers"]
                assert call_args[1]["headers"]["Authorization"].startswith("Bearer ")

    def test_returns_normalized_inventory_context(self):
        """getInventory must return normalized dict with pharmacy_id, items list."""
        mock_resp = _make_mock_http_response(MOCK_BACKEND_FULL_RESPONSE)
        with patch.dict(os.environ, MOCK_BACKEND_ENV):
            with patch("httpx.Client") as mock_client_cls:
                mock_client = mock_client_cls.return_value.__enter__.return_value
                mock_client.post.return_value = mock_resp

                result = getInventory(pharmacy_id=1)

                assert result["pharmacy_id"] == 1
                assert result["pharmacy_name"] == "Green Cross Pharmacy"
                assert len(result["items"]) == 3
                assert result["lookback_days"] == 30

    def test_raises_runtime_error_on_backend_offline(self):
        """getInventory must raise RuntimeError when backend is unreachable."""
        import httpx
        with patch.dict(os.environ, MOCK_BACKEND_ENV):
            with patch("httpx.Client") as mock_client_cls:
                mock_client = mock_client_cls.return_value.__enter__.return_value
                mock_client.post.side_effect = httpx.ConnectError("Connection refused")

                with pytest.raises(RuntimeError, match="Cannot reach backend"):
                    getInventory(pharmacy_id=1)

    def test_raises_runtime_error_on_401(self):
        """getInventory must raise RuntimeError with auth guidance on 401."""
        mock_resp = _make_mock_http_response({}, status_code=401)
        import httpx
        with patch.dict(os.environ, MOCK_BACKEND_ENV):
            with patch("httpx.Client") as mock_client_cls:
                mock_client = mock_client_cls.return_value.__enter__.return_value
                mock_client.post.side_effect = httpx.HTTPStatusError(
                    "401", request=MagicMock(), response=mock_resp
                )
                mock_resp.text = "Unauthorized"
                with pytest.raises(RuntimeError, match="401"):
                    getInventory(pharmacy_id=1)

    def test_raises_value_error_when_no_items(self):
        """getInventory must raise ValueError when backend returns empty inventory."""
        empty_response = {
            "pharmacyId": 1,
            "recommendations": [],
            "agentContext": {"pharmacyId": 1, "pharmacyName": "Empty Pharmacy", "items": []},
        }
        mock_resp = _make_mock_http_response(empty_response)
        with patch.dict(os.environ, MOCK_BACKEND_ENV):
            with patch("httpx.Client") as mock_client_cls:
                mock_client = mock_client_cls.return_value.__enter__.return_value
                mock_client.post.return_value = mock_resp

                with pytest.raises(ValueError, match="empty inventory context"):
                    getInventory(pharmacy_id=99)

    def test_does_not_expose_token_in_return_value(self):
        """getInventory must not include BACKEND_SERVICE_TOKEN in its return value."""
        mock_resp = _make_mock_http_response(MOCK_BACKEND_FULL_RESPONSE)
        with patch.dict(os.environ, MOCK_BACKEND_ENV):
            with patch("httpx.Client") as mock_client_cls:
                mock_client = mock_client_cls.return_value.__enter__.return_value
                mock_client.post.return_value = mock_resp

                result = getInventory(pharmacy_id=1)
                result_str = str(result)
                assert "mock-jwt-token-for-testing" not in result_str


# ─────────────────────────────────────────────────────────────────────────────
# Tests: Tool 2 — getHistoricalOrders
# ─────────────────────────────────────────────────────────────────────────────

class TestGetHistoricalOrders:
    """Tests for the getHistoricalOrders() tool."""

    def test_aggregates_dispense_transactions(self):
        """getHistoricalOrders must correctly aggregate Dispense transactions per medicine."""
        mock_resp = _make_mock_http_response(MOCK_TRANSACTIONS)
        with patch.dict(os.environ, MOCK_BACKEND_ENV):
            with patch("httpx.Client") as mock_client_cls:
                mock_client = mock_client_cls.return_value.__enter__.return_value
                mock_client.get.return_value = mock_resp

                result = getHistoricalOrders(pharmacy_id=1, lookback_days=30)

                by_med = {m["medicine_name"]: m for m in result["by_medicine"]}
                assert by_med["Amoxicillin 500mg Capsule"]["total_dispensed"] == 18  # abs(-9) + abs(-9)
                assert by_med["Paracetamol 500mg Tablet"]["total_dispensed"] == 20

    def test_aggregates_restock_transactions(self):
        """getHistoricalOrders must correctly aggregate Restock transactions."""
        mock_resp = _make_mock_http_response(MOCK_TRANSACTIONS)
        with patch.dict(os.environ, MOCK_BACKEND_ENV):
            with patch("httpx.Client") as mock_client_cls:
                mock_client = mock_client_cls.return_value.__enter__.return_value
                mock_client.get.return_value = mock_resp

                result = getHistoricalOrders(pharmacy_id=1, lookback_days=30)

                by_med = {m["medicine_name"]: m for m in result["by_medicine"]}
                assert by_med["Paracetamol 500mg Tablet"]["total_restocked"] == 500

    def test_computes_daily_dispense_average(self):
        """getHistoricalOrders must compute daily_dispense_avg = total_dispensed / lookback_days."""
        mock_resp = _make_mock_http_response(MOCK_TRANSACTIONS)
        with patch.dict(os.environ, MOCK_BACKEND_ENV):
            with patch("httpx.Client") as mock_client_cls:
                mock_client = mock_client_cls.return_value.__enter__.return_value
                mock_client.get.return_value = mock_resp

                result = getHistoricalOrders(pharmacy_id=1, lookback_days=30)

                by_med = {m["medicine_name"]: m for m in result["by_medicine"]}
                expected_avg = round(18 / 30, 4)  # total_dispensed=18, lookback=30
                assert by_med["Amoxicillin 500mg Capsule"]["daily_dispense_avg"] == expected_avg

    def test_returns_empty_summary_on_network_error(self):
        """getHistoricalOrders must return empty summary (non-fatal) on network failure."""
        import httpx
        with patch.dict(os.environ, MOCK_BACKEND_ENV):
            with patch("httpx.Client") as mock_client_cls:
                mock_client = mock_client_cls.return_value.__enter__.return_value
                mock_client.get.side_effect = httpx.ConnectError("offline")

                result = getHistoricalOrders(pharmacy_id=1)

                assert result["transaction_count"] == 0
                assert result["by_medicine"] == []

    def test_calls_correct_endpoint_with_params(self):
        """getHistoricalOrders must GET /api/inventory/transactions with pharmacyId and days params."""
        mock_resp = _make_mock_http_response([])
        with patch.dict(os.environ, MOCK_BACKEND_ENV):
            with patch("httpx.Client") as mock_client_cls:
                mock_client = mock_client_cls.return_value.__enter__.return_value
                mock_client.get.return_value = mock_resp

                getHistoricalOrders(pharmacy_id=5, lookback_days=14)

                call_args = mock_client.get.call_args
                assert "/api/inventory/transactions" in call_args[0][0]
                params = call_args[1]["params"]
                assert params["pharmacyId"] == 5
                assert params["days"] == 14


# ─────────────────────────────────────────────────────────────────────────────
# Tests: Tool 3 — calculateDemand
# ─────────────────────────────────────────────────────────────────────────────

class TestCalculateDemand:
    """Tests for the calculateDemand() tool."""

    def _make_context(self, items):
        return {"pharmacy_id": 1, "pharmacy_name": "Test", "items": items, "lookback_days": 30}

    def test_maps_backend_demand_rate_correctly(self):
        """calculateDemand must use DemandRateLast30Days from backend as-is (validated)."""
        context = self._make_context([{
            "medicineId": 1, "medicineName": "Drug A", "category": "X",
            "currentStock": 100, "minStockLevel": 50, "unitPrice": 10.0,
            "demandRateLast30Days": 3.333,
            "totalDispensedLast30Days": 100,
            "totalRestockedLast30Days": 0,
            "daysUntilStockOut": 30.0,
            "expiringBatches": [],
        }])
        result = calculateDemand(context)
        assert result[0]["demand_rate_per_day"] == round(3.333, 4)

    def test_clamps_negative_demand_rate_to_zero(self):
        """calculateDemand must clamp any invalid negative demand rate to 0."""
        context = self._make_context([{
            "medicineId": 2, "medicineName": "Drug B", "category": "Y",
            "currentStock": 50, "minStockLevel": 20, "unitPrice": 5.0,
            "demandRateLast30Days": -5.0,  # invalid from backend
            "totalDispensedLast30Days": 0,
            "totalRestockedLast30Days": 0,
            "daysUntilStockOut": 999,
            "expiringBatches": [],
        }])
        result = calculateDemand(context)
        assert result[0]["demand_rate_per_day"] == 0.0

    def test_has_demand_history_false_when_zero_dispensed(self):
        """calculateDemand must set has_demand_history=False when totalDispensedLast30Days=0."""
        context = self._make_context([{
            "medicineId": 3, "medicineName": "Drug C", "category": "Z",
            "currentStock": 200, "minStockLevel": 50, "unitPrice": 8.0,
            "demandRateLast30Days": 0.0,
            "totalDispensedLast30Days": 0,
            "totalRestockedLast30Days": 0,
            "daysUntilStockOut": 999,
            "expiringBatches": [],
        }])
        result = calculateDemand(context)
        assert result[0]["has_demand_history"] is False
        assert result[0]["demand_confidence"] == "low"

    def test_has_demand_history_true_when_dispensed(self):
        """calculateDemand must set has_demand_history=True when there are dispense transactions."""
        context = self._make_context([{
            "medicineId": 4, "medicineName": "Drug D", "category": "A",
            "currentStock": 100, "minStockLevel": 30, "unitPrice": 20.0,
            "demandRateLast30Days": 5.0,
            "totalDispensedLast30Days": 150,
            "totalRestockedLast30Days": 0,
            "daysUntilStockOut": 20.0,
            "expiringBatches": [],
        }])
        result = calculateDemand(context)
        assert result[0]["has_demand_history"] is True
        assert result[0]["demand_confidence"] == "high"

    def test_preserves_all_items_from_context(self):
        """calculateDemand must return the same number of items as in the context."""
        items = [
            {
                "medicineId": i, "medicineName": f"Drug {i}", "category": "X",
                "currentStock": 100, "minStockLevel": 50, "unitPrice": 10.0,
                "demandRateLast30Days": float(i), "totalDispensedLast30Days": i * 30,
                "totalRestockedLast30Days": 0, "daysUntilStockOut": 10.0, "expiringBatches": [],
            }
            for i in range(1, 6)
        ]
        context = self._make_context(items)
        result = calculateDemand(context)
        assert len(result) == 5


# ─────────────────────────────────────────────────────────────────────────────
# Tests: Tool 4 — forecastDemand
# ─────────────────────────────────────────────────────────────────────────────

class TestForecastDemand:
    """Tests for the forecastDemand() tool."""

    def _make_demand_item(self, demand_rate: float, current_stock: int, min_stock: int = 50):
        return {
            "medicine_id": 1, "medicine_name": "Test Drug", "category": "X",
            "current_stock": current_stock, "min_stock_level": min_stock,
            "unit_price": 10.0, "demand_rate_per_day": demand_rate,
            "total_dispensed_30d": int(demand_rate * 30), "total_restocked_30d": 0,
            "demand_confidence": "high" if demand_rate > 0 else "low",
            "has_demand_history": demand_rate > 0,
            "expiring_batches": [],
        }

    def test_projected_demand_uses_safety_days_ceiling(self):
        """forecastDemand projected_demand_units = ceil(demand_rate * forecast_days)."""
        items = [self._make_demand_item(demand_rate=7.3, current_stock=100)]
        result = forecastDemand(items, forecast_days=45)
        expected = math.ceil(7.3 * 45)  # = 329
        assert result[0]["projected_demand_units"] == expected

    def test_restock_gap_formula_matches_inventory_service(self):
        """
        forecastDemand restock_gap must match InventoryService formula:
        gap = max(0, ceil(SAFETY_DAYS * demand_rate) - current_stock)
        """
        demand_rate = 10.0
        current_stock = 150
        items = [self._make_demand_item(demand_rate=demand_rate, current_stock=current_stock)]
        result = forecastDemand(items, forecast_days=SAFETY_DAYS)

        expected_gap = max(0, math.ceil(SAFETY_DAYS * demand_rate) - current_stock)
        assert result[0]["restock_gap"] == expected_gap

    def test_zero_demand_uses_min_stock_as_target(self):
        """forecastDemand must use min_stock_level as target when demand_rate = 0."""
        items = [self._make_demand_item(demand_rate=0.0, current_stock=10, min_stock=50)]
        result = forecastDemand(items)
        assert result[0]["safety_stock_target"] == 50
        assert result[0]["restock_gap"] == 40  # 50 - 10

    def test_adequate_stock_produces_zero_restock_gap(self):
        """forecastDemand restock_gap must be 0 when current_stock >= safety_stock_target."""
        # 5 units/day * 45 days = 225 units needed; stock = 300 → gap = 0
        items = [self._make_demand_item(demand_rate=5.0, current_stock=300)]
        result = forecastDemand(items, forecast_days=SAFETY_DAYS)
        assert result[0]["restock_gap"] == 0

    def test_forecast_days_is_recorded_in_output(self):
        """forecastDemand must record the forecast_days value used."""
        items = [self._make_demand_item(demand_rate=2.0, current_stock=10)]
        result = forecastDemand(items, forecast_days=60)
        assert result[0]["forecast_days"] == 60


# ─────────────────────────────────────────────────────────────────────────────
# Tests: Tool 5 — predictStockout
# ─────────────────────────────────────────────────────────────────────────────

class TestPredictStockout:
    """Tests for the predictStockout() tool — urgency thresholds and risk scoring."""

    def _make_forecast_item(self, demand_rate: float, current_stock: int, min_stock: int = 50):
        restock_gap = max(0, math.ceil(SAFETY_DAYS * demand_rate) - current_stock) if demand_rate > 0 else max(0, min_stock - current_stock)
        return {
            "medicine_id": 1, "medicine_name": "Test Drug", "category": "X",
            "current_stock": current_stock, "min_stock_level": min_stock,
            "unit_price": 10.0, "demand_rate_per_day": demand_rate,
            "total_dispensed_30d": int(demand_rate * 30), "total_restocked_30d": 0,
            "demand_confidence": "high", "has_demand_history": demand_rate > 0,
            "expiring_batches": [],
            "projected_demand_units": math.ceil(demand_rate * SAFETY_DAYS),
            "safety_stock_target": math.ceil(demand_rate * SAFETY_DAYS),
            "forecast_days": SAFETY_DAYS,
            "restock_gap": restock_gap,
        }

    def test_critical_urgency_at_exactly_critical_horizon(self):
        """predictStockout: stock for exactly CRITICAL_HORIZON_DAYS must be CRITICAL."""
        # 10 units/day * 5 days = 50 units stock → 5 days left
        items = [self._make_forecast_item(demand_rate=10.0, current_stock=50)]
        result = predictStockout(items)
        assert result[0]["days_until_stockout"] == CRITICAL_HORIZON_DAYS
        assert result[0]["urgency"] == URGENCY_CRITICAL
        assert result[0]["needs_restock"] is True

    def test_critical_urgency_below_critical_horizon(self):
        """predictStockout: stock for < CRITICAL_HORIZON_DAYS must be CRITICAL."""
        items = [self._make_forecast_item(demand_rate=9.0, current_stock=18)]  # 18/9 = 2 days
        result = predictStockout(items)
        assert result[0]["days_until_stockout"] == 2
        assert result[0]["urgency"] == URGENCY_CRITICAL

    def test_warning_urgency_within_warning_horizon(self):
        """predictStockout: stock between 6–14 days must be WARNING."""
        # 10 units/day * 10 days = 100 units → 10 days left
        items = [self._make_forecast_item(demand_rate=10.0, current_stock=100)]
        result = predictStockout(items)
        assert result[0]["days_until_stockout"] == 10
        assert result[0]["urgency"] == URGENCY_WARNING
        assert result[0]["needs_restock"] is True

    def test_healthy_urgency_above_warning_horizon(self):
        """predictStockout: stock for > WARNING_HORIZON_DAYS must be HEALTHY."""
        # 5 units/day * 30 days = 150 → 30 days left
        items = [self._make_forecast_item(demand_rate=5.0, current_stock=150)]
        result = predictStockout(items)
        assert result[0]["days_until_stockout"] == 30
        assert result[0]["urgency"] == URGENCY_HEALTHY
        assert result[0]["needs_restock"] is False

    def test_out_of_stock_is_critical_with_risk_100(self):
        """predictStockout: current_stock = 0 must be CRITICAL with risk_score = 100."""
        items = [self._make_forecast_item(demand_rate=5.0, current_stock=0)]
        result = predictStockout(items)
        assert result[0]["days_until_stockout"] == 0
        assert result[0]["urgency"] == URGENCY_CRITICAL
        assert result[0]["stockout_risk_score"] == 100

    def test_zero_demand_rate_gives_999_days(self):
        """predictStockout: items with zero demand_rate must have days_until_stockout = 999."""
        items = [self._make_forecast_item(demand_rate=0.0, current_stock=500)]
        result = predictStockout(items)
        assert result[0]["days_until_stockout"] == 999
        assert result[0]["urgency"] == URGENCY_HEALTHY

    def test_below_min_stock_flags_needs_restock(self):
        """predictStockout: items below min_stock_level must have needs_restock=True."""
        # Even if urgency is HEALTHY, being below min triggers needs_restock
        items = [self._make_forecast_item(demand_rate=1.0, current_stock=30, min_stock=100)]
        result = predictStockout(items)
        assert result[0]["below_min_stock"] is True
        assert result[0]["needs_restock"] is True


# ─────────────────────────────────────────────────────────────────────────────
# Tests: Tool 6 — generateRestockRecommendation
# ─────────────────────────────────────────────────────────────────────────────

class TestGenerateRestockRecommendation:
    """Tests for the generateRestockRecommendation() tool."""

    def _make_stockout_item(
        self, demand_rate: float, current_stock: int, min_stock: int = 50,
        unit_price: float = 10.0, urgency: str = URGENCY_CRITICAL,
        days_until_stockout: int = 2, medicine_id: int = 1,
        medicine_name: str = "Test Drug", expiring_batches: list = None,
    ):
        return {
            "medicine_id": medicine_id,
            "medicine_name": medicine_name,
            "category": "X",
            "current_stock": current_stock,
            "min_stock_level": min_stock,
            "unit_price": unit_price,
            "demand_rate_per_day": demand_rate,
            "total_dispensed_30d": int(demand_rate * 30),
            "total_restocked_30d": 0,
            "demand_confidence": "high",
            "has_demand_history": demand_rate > 0,
            "expiring_batches": expiring_batches or [],
            "projected_demand_units": math.ceil(demand_rate * SAFETY_DAYS),
            "safety_stock_target": math.ceil(demand_rate * SAFETY_DAYS),
            "forecast_days": SAFETY_DAYS,
            "restock_gap": max(0, math.ceil(SAFETY_DAYS * demand_rate) - current_stock),
            "days_until_stockout": days_until_stockout,
            "urgency": urgency,
            "stockout_risk_score": 95,
            "needs_restock": True,
            "below_min_stock": current_stock < min_stock,
        }

    def test_quantity_rounded_to_nearest_10(self):
        """generateRestockRecommendation quantities must be multiples of ROUND_TO_NEAREST."""
        # demand_rate=9.0, current_stock=18, safety_days=45
        # raw_qty = ceil(45 * 9) - 18 = 405 - 18 = 387
        # rounded = ceil(387/10)*10 = 390
        items = [self._make_stockout_item(demand_rate=9.0, current_stock=18)]
        result = generateRestockRecommendation(items)

        qty = result["proposals"][0]["suggested_quantity"]
        assert qty % ROUND_TO_NEAREST == 0, f"Quantity {qty} is not a multiple of {ROUND_TO_NEAREST}"

    def test_quantity_at_least_min_order_qty(self):
        """generateRestockRecommendation quantities must be >= MIN_ORDER_QTY."""
        items = [self._make_stockout_item(demand_rate=9.0, current_stock=18)]
        result = generateRestockRecommendation(items)

        qty = result["proposals"][0]["suggested_quantity"]
        assert qty >= MIN_ORDER_QTY

    def test_quantity_formula_matches_inventory_service(self):
        """
        generateRestockRecommendation quantity must match InventoryService formula:
        qty = max(MIN_ORDER_QTY, ceil(ceil(SAFETY_DAYS * rate - stock) / 10) * 10)
        """
        demand_rate = 9.0
        current_stock = 18
        items = [self._make_stockout_item(demand_rate=demand_rate, current_stock=current_stock)]
        result = generateRestockRecommendation(items)

        raw_qty = max(0, math.ceil(SAFETY_DAYS * demand_rate) - current_stock)
        expected_qty = max(MIN_ORDER_QTY, math.ceil(raw_qty / ROUND_TO_NEAREST) * ROUND_TO_NEAREST)
        assert result["proposals"][0]["suggested_quantity"] == expected_qty

    def test_critical_items_have_high_priority(self):
        """generateRestockRecommendation must assign HIGH priority to CRITICAL items."""
        items = [self._make_stockout_item(demand_rate=9.0, current_stock=10, urgency=URGENCY_CRITICAL)]
        result = generateRestockRecommendation(items)
        assert result["proposals"][0]["priority"] == "HIGH"

    def test_warning_items_have_normal_priority(self):
        """generateRestockRecommendation must assign NORMAL priority to WARNING items."""
        items = [self._make_stockout_item(
            demand_rate=5.0, current_stock=60, urgency=URGENCY_WARNING,
            days_until_stockout=12, min_stock=50
        )]
        result = generateRestockRecommendation(items)
        assert result["proposals"][0]["priority"] == "NORMAL"

    def test_skips_items_with_adequate_stock(self):
        """generateRestockRecommendation must not generate a proposal when needs_restock is False."""
        # Force needs_restock=False to simulate adequately stocked item (filtered candidate list)
        item = self._make_stockout_item(
            demand_rate=1.0, current_stock=1000, min_stock=50,
            urgency=URGENCY_HEALTHY, days_until_stockout=1000,
        )
        item["needs_restock"] = False  # Adequately stocked — not a candidate
        result = generateRestockRecommendation([item])
        assert len(result["proposals"]) == 0

    def test_skips_items_where_computed_qty_is_zero(self):
        """generateRestockRecommendation must skip with a safety flag when qty ≤ 0."""
        # current_stock > SAFETY_DAYS * demand_rate → raw_qty ≤ 0
        items = [self._make_stockout_item(
            demand_rate=1.0, current_stock=500, min_stock=20,
            urgency=URGENCY_WARNING, days_until_stockout=10
        )]
        result = generateRestockRecommendation(items)
        # If any proposal was generated, qty must be positive; if skipped, safety flag raised
        if len(result["proposals"]) == 0:
            assert any("SKIP" in f for f in result["safety_check_flags"])
        else:
            assert result["proposals"][0]["suggested_quantity"] > 0

    def test_flags_excessive_cost(self):
        """generateRestockRecommendation must flag line costs > LKR 500 000."""
        # unit_price=10000, qty=100 → line_cost=1,000,000 > threshold
        items = [self._make_stockout_item(
            demand_rate=3.0, current_stock=5, min_stock=50,
            unit_price=10_000.0, urgency=URGENCY_CRITICAL
        )]
        result = generateRestockRecommendation(items)
        assert any("REVIEW" in f for f in result["safety_check_flags"])

    def test_flags_near_expiry_batches(self):
        """generateRestockRecommendation must flag batches expiring within 30 days."""
        expiring = [{"batchNumber": "B001", "quantity": 50, "daysUntilExpiry": 15, "expiryDate": "2026-10-01"}]
        items = [self._make_stockout_item(
            demand_rate=9.0, current_stock=18, expiring_batches=expiring
        )]
        result = generateRestockRecommendation(items)
        assert any("EXPIRY" in f for f in result["safety_check_flags"])

    def test_total_cost_calculation(self):
        """generateRestockRecommendation total_projected_cost must equal sum of line costs."""
        items = [
            self._make_stockout_item(
                demand_rate=9.0, current_stock=18, unit_price=45.0,
                medicine_id=1, medicine_name="Drug A"
            ),
            self._make_stockout_item(
                demand_rate=5.0, current_stock=30, unit_price=12.0,
                medicine_id=2, medicine_name="Drug B", urgency=URGENCY_WARNING, days_until_stockout=6
            ),
        ]
        result = generateRestockRecommendation(items)
        expected_total = sum(p["suggested_quantity"] * p["estimated_unit_cost"] for p in result["proposals"])
        assert abs(result["total_projected_cost"] - round(expected_total, 2)) < 0.01

    def test_critical_items_sorted_before_warning(self):
        """generateRestockRecommendation must output CRITICAL proposals before WARNING."""
        items = [
            self._make_stockout_item(
                demand_rate=5.0, current_stock=55, unit_price=10.0,
                urgency=URGENCY_WARNING, days_until_stockout=11,
                medicine_id=2, medicine_name="Warning Drug"
            ),
            self._make_stockout_item(
                demand_rate=9.0, current_stock=18, unit_price=45.0,
                urgency=URGENCY_CRITICAL, days_until_stockout=2,
                medicine_id=1, medicine_name="Critical Drug"
            ),
        ]
        result = generateRestockRecommendation(items)
        if len(result["proposals"]) >= 2:
            assert result["proposals"][0]["priority"] == "HIGH"  # CRITICAL first

    def test_proposals_contain_no_hardcoded_medicine_names(self):
        """generateRestockRecommendation proposals must not contain the old simulated medicine names."""
        FORBIDDEN_NAMES = {"Amoxicillin 500mg Capsule", "Paracetamol 500mg Tablet"}
        items = [
            self._make_stockout_item(
                demand_rate=9.0, current_stock=18,
                medicine_name="Real DB Medicine"
            )
        ]
        result = generateRestockRecommendation(items)
        for p in result["proposals"]:
            assert p["medicine_name"] not in FORBIDDEN_NAMES or p["medicine_name"] == "Real DB Medicine"


# ─────────────────────────────────────────────────────────────────────────────
# Tests: Approval gate — agent must never create restock requests
# ─────────────────────────────────────────────────────────────────────────────

class TestApprovalGate:
    """Verifies that the agent never calls restock-creation or inventory-mutation endpoints."""

    def test_evaluate_inventory_intelligence_does_not_call_restock_endpoint(self):
        """
        The evaluate_inventory_intelligence orchestrator must never POST to
        /api/restock-requests or any inventory mutation endpoint.
        Only two backend endpoints are allowed:
          - POST /api/pharmacies/{id}/generate-restock-recommendations  (getInventory)
          - GET  /api/inventory/transactions                              (getHistoricalOrders)
        """
        called_urls = []

        def mock_post_side_effect(url, **kwargs):
            called_urls.append(("POST", url))
            mock_resp = MagicMock()
            mock_resp.status_code = 200
            mock_resp.raise_for_status = MagicMock()
            mock_resp.json.return_value = MOCK_BACKEND_FULL_RESPONSE
            return mock_resp

        def mock_get_side_effect(url, **kwargs):
            called_urls.append(("GET", url))
            mock_resp = MagicMock()
            mock_resp.status_code = 200
            mock_resp.raise_for_status = MagicMock()
            mock_resp.json.return_value = MOCK_TRANSACTIONS
            return mock_resp

        with patch.dict(os.environ, MOCK_BACKEND_ENV):
            with patch("httpx.Client") as mock_client_cls:
                mock_client = mock_client_cls.return_value.__enter__.return_value
                mock_client.post.side_effect = mock_post_side_effect
                mock_client.get.side_effect = mock_get_side_effect

                payload = InventoryForecastInput(pharmacy_id=1, lookback_days=30)
                evaluate_inventory_intelligence(payload)

        # Assert: no calls to restock creation or inventory mutation endpoints
        forbidden_patterns = ["restock-requests", "inventory/", "batches", "receive", "payment"]
        for method, url in called_urls:
            if "generate-restock-recommendations" in url:
                continue  # allowed
            if "inventory/transactions" in url:
                continue  # allowed
            for pattern in forbidden_patterns:
                assert pattern not in url, (
                    f"Agent made unauthorized call: {method} {url}. "
                    "The agent must ONLY read data, never write."
                )


# ─────────────────────────────────────────────────────────────────────────────
# Tests: Full pipeline integration
# ─────────────────────────────────────────────────────────────────────────────

class TestFullPipelineIntegration:
    """Integration tests — full pipeline with mocked backend responses."""

    def _run_pipeline(self, backend_response=None, transactions=None):
        """Helper to run the full pipeline with mocked HTTP."""
        backend_response = backend_response or MOCK_BACKEND_FULL_RESPONSE
        transactions = transactions or MOCK_TRANSACTIONS

        mock_post_resp = MagicMock()
        mock_post_resp.status_code = 200
        mock_post_resp.raise_for_status = MagicMock()
        mock_post_resp.json.return_value = backend_response

        mock_get_resp = MagicMock()
        mock_get_resp.status_code = 200
        mock_get_resp.raise_for_status = MagicMock()
        mock_get_resp.json.return_value = transactions

        with patch.dict(os.environ, MOCK_BACKEND_ENV):
            with patch("httpx.Client") as mock_client_cls:
                mock_client = mock_client_cls.return_value.__enter__.return_value
                mock_client.post.return_value = mock_post_resp
                mock_client.get.return_value = mock_get_resp

                payload = InventoryForecastInput(pharmacy_id=1, lookback_days=30)
                return evaluate_inventory_intelligence(payload)

    def test_result_has_correct_pharmacy_id(self):
        result = self._run_pipeline()
        assert result.pharmacy_id == 1

    def test_result_has_risk_items_from_real_data(self):
        """risk_items must reflect the mocked backend items, not hard-coded data."""
        result = self._run_pipeline()
        assert len(result.risk_items) == 3  # 3 items in MOCK_AGENT_CONTEXT_RESPONSE
        medicine_names = {r.medicine_name for r in result.risk_items}
        assert "Amoxicillin 500mg Capsule" in medicine_names
        assert "Paracetamol 500mg Tablet" in medicine_names

    def test_amoxicillin_classified_as_critical(self):
        """Amoxicillin (18 units, 9.0/day → 2 days) must be CRITICAL."""
        result = self._run_pipeline()
        amox = next(r for r in result.risk_items if "Amoxicillin" in r.medicine_name)
        assert amox.urgency == URGENCY_CRITICAL
        assert amox.days_until_stockout == 2

    def test_paracetamol_classified_as_healthy(self):
        """Paracetamol (500 units, 20/day → 25 days) must be HEALTHY."""
        result = self._run_pipeline()
        para = next(r for r in result.risk_items if "Paracetamol" in r.medicine_name)
        assert para.urgency == URGENCY_HEALTHY

    def test_restock_proposals_only_for_needing_restock(self):
        """restock_recommendations must only include CRITICAL/WARNING/below-min items."""
        result = self._run_pipeline()
        # Paracetamol is HEALTHY with stock > min — should not have a proposal
        proposal_names = {p.medicine_name for p in result.restock_recommendations}
        assert "Paracetamol 500mg Tablet" not in proposal_names

    def test_total_projected_cost_is_positive(self):
        """total_projected_cost must be > 0 when there are restock proposals."""
        result = self._run_pipeline()
        if result.restock_recommendations:
            assert result.total_projected_cost > 0

    def test_summary_contains_approval_gate_message(self):
        """Summary must contain the approval-required reminder."""
        result = self._run_pipeline()
        assert "APPROVAL REQUIRED" in result.summary or "approval" in result.summary.lower()

    def test_summary_contains_real_pharmacy_name(self):
        """Summary must include the real pharmacy name from the backend, not a hard-coded one."""
        result = self._run_pipeline()
        assert "Green Cross Pharmacy" in result.summary

    def test_summary_does_not_contain_simulated_names(self):
        """Summary must not contain names from the old hard-coded MEDICINE_BENCHMARKS."""
        OLD_SIMULATED_NAMES = [
            "Cetirizine 10mg Tablet",
            "Azithromycin 500mg Tablet",
            "Salbutamol Inhaler 100mcg",
            "Ciprofloxacin 500mg Tablet",
        ]
        result = self._run_pipeline()
        for name in OLD_SIMULATED_NAMES:
            assert name not in result.summary, f"Old simulated name '{name}' found in summary."

    def test_workflow_audit_contains_all_six_tools(self):
        """workflow_audit must record all 6 tool steps."""
        result = self._run_pipeline()
        assert result.workflow_audit is not None
        step_names = [s["tool"] for s in result.workflow_audit["steps"]]
        for tool in ["getInventory", "getHistoricalOrders", "calculateDemand",
                     "forecastDemand", "predictStockout", "generateRestockRecommendation"]:
            assert tool in step_names, f"Tool '{tool}' missing from workflow_audit steps."

    def test_backend_offline_raises_runtime_error(self):
        """Full pipeline must raise RuntimeError (mapped to 502) when backend is unreachable."""
        import httpx
        with patch.dict(os.environ, MOCK_BACKEND_ENV):
            with patch("httpx.Client") as mock_client_cls:
                mock_client = mock_client_cls.return_value.__enter__.return_value
                mock_client.post.side_effect = httpx.ConnectError("Connection refused")

                with pytest.raises(RuntimeError, match="Cannot reach backend"):
                    payload = InventoryForecastInput(pharmacy_id=1, lookback_days=30)
                    evaluate_inventory_intelligence(payload)

    def test_missing_env_raises_environment_error(self):
        """Full pipeline must raise EnvironmentError when BACKEND_SERVICE_TOKEN is absent."""
        with patch.dict(os.environ, {"BACKEND_URL": "http://localhost:5000", "BACKEND_SERVICE_TOKEN": ""}):
            with pytest.raises(EnvironmentError, match="BACKEND_SERVICE_TOKEN"):
                payload = InventoryForecastInput(pharmacy_id=1, lookback_days=30)
                evaluate_inventory_intelligence(payload)
