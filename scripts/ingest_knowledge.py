#!/usr/bin/env python3
"""
MediFlow-AI Reusable Knowledge Ingestion CLI Pipeline
=====================================================
Usage:
    python scripts/ingest_knowledge.py [--target-count 100000] [--db-path path/to/db] [--stats]
"""

import sys
import argparse
from pathlib import Path

# Add project root and ai directory to sys.path
_current_dir = Path(__file__).resolve().parent
_workspace_root = _current_dir.parent
_ai_dir = _workspace_root / "ai"
for _p in [str(_workspace_root), str(_ai_dir)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

from ai.knowledge_base.build_hybrid_knowledge_base import (
    build_hybrid_knowledge_base,
    DB_PATH,
)


def main():
    parser = argparse.ArgumentParser(description="MediFlow-AI Hybrid Knowledge Base Ingestion Pipeline")
    parser.add_argument("--target-count", type=int, default=100_000, help="Target minimum number of knowledge units")
    parser.add_argument("--db-path", type=str, default=str(DB_PATH), help="Target SQLite database file path")
    parser.add_argument("--stats", action="store_true", help="Print summary statistics of the knowledge base")

    args = parser.parse_args()

    stats = build_hybrid_knowledge_base(target_count=args.target_count)

    print("\n[Ingestion Pipeline Complete]")
    print(f"Total units in database: {stats.get('final_count', 0):,}")
    print(f"Database file: {args.db_path}")


if __name__ == "__main__":
    main()
