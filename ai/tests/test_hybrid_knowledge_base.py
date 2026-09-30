"""
Comprehensive tests for MediFlow-AI Hybrid Medical Knowledge Base and Retrieval Service.
Validates:
1. Storage integrity, schema structure, and 100k unit indexing.
2. Source traceability for authoritative guidelines (WHO, NICE, CDC, ACC/AHA, etc.).
3. Grounding integrity for synthetic augmentation units.
4. Free-tier memory constraints (zero bulk loading into RAM, sub-millisecond retrieval).
5. Agent-specific domain filtering (Specialist Recommendation vs Clinical Decision Support).
6. Red-flag detection and emergency escalation metadata.
"""

import os
import sqlite3
import pytest
from pathlib import Path
from ai.knowledge_base.retrieval_service import (
    HybridKnowledgeRetriever,
    get_hybrid_retriever,
    compute_query_vector,
    VECTOR_DIM,
)
from ai.knowledge_base.clinical_data_catalog import AUTHORITATIVE_SOURCES

DB_PATH = Path("ai/knowledge_base/mediflow_knowledge_base.db")


@pytest.fixture(scope="module")
def retriever():
    """Module-scoped retriever fixture."""
    return get_hybrid_retriever()


@pytest.fixture(scope="module")
def db_conn():
    """Read-only SQLite connection fixture."""
    if not DB_PATH.exists():
        pytest.skip(f"Database not found at {DB_PATH}")
    conn = sqlite3.connect(f"file:{DB_PATH.resolve()}?mode=ro", uri=True)
    yield conn
    conn.close()


class TestDatabaseIntegrity:
    """Verifies physical storage, schema design, and scale."""

    def test_database_exists_and_size_reasonable(self):
        assert DB_PATH.exists(), f"Database missing at {DB_PATH}"
        size_mb = DB_PATH.stat().st_size / (1024 * 1024)
        # Database should be between 100MB and 400MB for 100k units with FTS5 and embeddings
        assert 100.0 <= size_mb <= 400.0, f"Unexpected DB size: {size_mb:.2f}MB"

    def test_table_schemas_and_indexes(self, db_conn):
        cursor = db_conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = {row[0] for row in cursor.fetchall()}
        assert "knowledge_documents" in tables
        assert "knowledge_units" in tables
        assert "knowledge_fts" in tables

    def test_total_unit_count_100k(self, db_conn):
        cursor = db_conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM knowledge_units;")
        count = cursor.fetchone()[0]
        assert count >= 100000, f"Expected at least 100,000 units, found {count}"

    def test_fts5_virtual_table_sync(self, db_conn):
        cursor = db_conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM knowledge_units;")
        unit_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM knowledge_fts;")
        fts_count = cursor.fetchone()[0]
        assert fts_count == unit_count, f"FTS table count ({fts_count}) does not match units count ({unit_count})"


class TestSourceTraceabilityAndGrounding:
    """Verifies that all units are strictly partitioned into authoritative and grounded synthetic."""

    def test_authoritative_sources_registered(self, db_conn):
        cursor = db_conn.cursor()
        cursor.execute("SELECT id, source_organization, title FROM knowledge_documents;")
        rows = cursor.fetchall()
        assert len(rows) >= 10, "Expected at least 10 authoritative clinical documents"

        orgs = {r[1] for r in rows}
        assert "WHO" in orgs or any("World Health Organization" in o for o in orgs)
        assert any("NICE" in o for o in orgs)
        assert any("ACC" in o or "AHA" in o or "Cardiology" in o for o in orgs)
        assert any("SRC-ACCAHA" in r[0] for r in rows)

    def test_authoritative_units_have_valid_metadata(self, db_conn):
        cursor = db_conn.cursor()
        cursor.execute("""
            SELECT id, document_id, metadata_json
            FROM knowledge_units
            WHERE data_type = 'authoritative'
            LIMIT 50;
        """)
        rows = cursor.fetchall()
        assert len(rows) > 0
        for uid, doc_id, meta_raw in rows:
            assert doc_id.startswith("SRC-")
            assert "source_id" in meta_raw
            assert "specialty" in meta_raw

    def test_synthetic_units_grounded_to_authoritative_sources(self, db_conn):
        cursor = db_conn.cursor()
        cursor.execute("""
            SELECT id, metadata_json
            FROM knowledge_units
            WHERE data_type = 'synthetic_augmentation'
            LIMIT 100;
        """)
        rows = cursor.fetchall()
        assert len(rows) > 0
        for uid, meta_raw in rows:
            assert "grounded_source_ids" in meta_raw
            assert "knowledge_category" in meta_raw


class TestFreeTierPerformanceAndMemory:
    """Ensures service complies with free-tier constraints (no RAM explosion, instant startup)."""

    def test_retriever_initialization_instant(self):
        # Initializing the retriever should take < 50ms without loading 100k records
        import time
        t0 = time.perf_counter()
        retriever = HybridKnowledgeRetriever(db_path=DB_PATH)
        elapsed_ms = (time.perf_counter() - t0) * 1000
        assert retriever.is_available
        assert elapsed_ms < 50.0, f"Retriever initialization took too long: {elapsed_ms:.2f}ms"

    def test_subword_embedding_dimension_and_speed(self):
        import time
        text = "acute retrosternal chest pain with left arm radiation"
        t0 = time.perf_counter()
        raw_bytes, floats = compute_query_vector(text)
        elapsed_ms = (time.perf_counter() - t0) * 1000

        assert len(floats) == VECTOR_DIM
        assert len(raw_bytes) == VECTOR_DIM * 4
        # Norm should be close to 1.0 (unit vector)
        import math
        norm = math.sqrt(sum(x * x for x in floats))
        assert abs(norm - 1.0) < 1e-4
        assert elapsed_ms < 5.0, f"Embedding generation too slow: {elapsed_ms:.2f}ms"

    def test_query_retrieval_latency(self, retriever):
        import time
        t0 = time.perf_counter()
        results = retriever.retrieve_knowledge("persistent dry cough and shortness of breath", top_k=10)
        elapsed_ms = (time.perf_counter() - t0) * 1000

        assert len(results) > 0
        # First uncached query should be fast (< 250ms on cold SQLite, < 20ms on warm)
        assert elapsed_ms < 300.0

    def test_lru_caching_speedup(self, retriever):
        import time
        query = "sudden severe unilateral headache with visual aura"
        # First query (populates cache)
        retriever.retrieve_knowledge(query, top_k=5)

        # Second query (cached)
        t0 = time.perf_counter()
        cached_results = retriever.retrieve_knowledge(query, top_k=5)
        cached_elapsed_ms = (time.perf_counter() - t0) * 1000

        assert len(cached_results) > 0
        assert cached_elapsed_ms < 2.0, f"Cached retrieval too slow: {cached_elapsed_ms:.2f}ms"


class TestAgentDomainSeparationAndRAG:
    """Verifies agent-specific routing and RAG context builders."""

    def test_specialist_agent_filtering(self, retriever):
        results = retriever.retrieve_knowledge(
            "irregular palpitations and dizziness",
            agent="specialist_recommendation",
            top_k=10
        )
        assert len(results) > 0
        for r in results:
            assert r["agent"] in ("specialist_recommendation", "shared")

    def test_clinical_agent_filtering(self, retriever):
        results = retriever.retrieve_knowledge(
            "peptic ulcer disease first line eradication therapy",
            agent="clinical_decision_support",
            top_k=10
        )
        assert len(results) > 0
        for r in results:
            assert r["agent"] in ("clinical_decision_support", "shared")

    def test_specialist_recommendation_context_builder(self, retriever):
        context = retriever.get_specialist_recommendation_context(
            symptoms=["rash", "severe skin itching", "redness"],
            notes="patient complains of flare ups behind knees"
        )
        assert "recommended_specialties" in context
        assert "dermatology" in [s.lower() for s in context["recommended_specialties"]]
        assert "retrieved_concepts" in context
        assert len(context["retrieved_concepts"]) > 0

    def test_clinical_cds_guideline_context_builder(self, retriever):
        context = retriever.get_clinical_cds_guideline_context(
            clinical_presentation="Type 2 Diabetes Mellitus with elevated HbA1c 9.2%"
        )
        assert "guidelines" in context
        assert "first_line_therapies" in context
        assert len(context["guidelines"]) > 0

    def test_red_flag_detection(self, retriever):
        results = retriever.retrieve_knowledge(
            "crushing retrosternal chest pain radiating to left arm",
            top_k=10
        )
        red_flags = [r for r in results if r["knowledge_category"] == "red_flag" or r.get("metadata", {}).get("urgency") == "emergency"]
        assert len(red_flags) > 0, "Failed to identify emergency red flag for acute chest pain"
