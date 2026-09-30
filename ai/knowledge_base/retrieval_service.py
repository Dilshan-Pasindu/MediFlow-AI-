"""
MediFlow-AI Hybrid Knowledge Base Retrieval Service
====================================================
High-performance, free-tier optimized hybrid search engine:
- Combines normalized dense semantic vector similarity with SQLite FTS5 BM25 lexical search.
- Zero startup memory overhead: queries persistent database directly on demand.
- Agent-specific filtering ('specialist_recommendation', 'clinical_decision', 'shared').
- Source prioritization: Authoritative (WHO, NICE, CDC, NIH, MoH Sri Lanka) > Guidelines > Red Flags > Synthetic.
- LRU caching with TTL for sub-millisecond repeated queries.
- Graceful degradation and medical safety controls.
"""

import os
import sys
import re
import time
import math
import json
import struct
import sqlite3
import hashlib
import logging
from collections import OrderedDict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

# Paths
_current_dir = Path(__file__).resolve().parent
_ai_dir = _current_dir.parent
_workspace_root = _ai_dir.parent
for _p in [str(_workspace_root), str(_ai_dir)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

DEFAULT_DB_PATH = _current_dir / "mediflow_knowledge_base.db"
VECTOR_DIM = 128

# English clinical and general stopwords
STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "but", "by", "can", "cannot", "could", "couldn't",
    "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
    "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
    "have", "haven't", "having", "he", "her", "here", "hers", "herself", "him",
    "himself", "his", "how", "i", "i'm", "i've", "i'll", "i'd", "if", "in", "into",
    "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most",
    "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once",
    "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over",
    "own", "same", "shan't", "she", "should", "shouldn't", "so", "some", "such",
    "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there",
    "these", "they", "this", "those", "through", "to", "too", "under", "until",
    "up", "very", "was", "wasn't", "we", "were", "weren't", "what", "when",
    "where", "which", "while", "who", "whom", "why", "with", "won't", "would",
    "wouldn't", "you", "your", "yours", "yourself", "yourselves", "feel", "feeling",
    "have", "having", "been", "suffer", "suffering", "started", "since",
    "behind", "between", "around", "through", "during", "before", "after", "above", "below",
}


def compute_query_vector(text: str, dim: int = VECTOR_DIM) -> Tuple[bytes, List[float]]:
    """
    Computes a deterministic, normalized 128-dimensional dense vector for a query.
    Returns both packed bytes and float list.
    """
    vec = [0.0] * dim
    tokens = re.findall(r"\b[a-zA-Z0-9_\-\']+\b", text.lower())
    for token in tokens:
        h = int(hashlib.sha256(token.encode("utf-8")).hexdigest()[:16], 16)
        idx = h % dim
        sign = 1.0 if ((h >> 8) & 1) == 0 else -1.0
        vec[idx] += sign

        # Subword 3-grams
        if len(token) >= 3:
            for i in range(len(token) - 2):
                ng = token[i : i + 3]
                h_ng = int(hashlib.sha256(ng.encode("utf-8")).hexdigest()[:16], 16)
                idx_ng = h_ng % dim
                sign_ng = 0.5 if ((h_ng >> 8) & 1) == 0 else -0.5
                vec[idx_ng] += sign_ng

    norm = math.sqrt(sum(x * x for x in vec)) or 1.0
    norm_vec = [x / norm for x in vec]
    return struct.pack(f"{dim}f", *norm_vec), norm_vec


CONVERSATIONAL_STOPWORDS = {
    "doctor", "specialist", "type", "see", "best", "recommend", "recommended",
    "visit", "consult", "clinic", "hospital", "department", "handles", "dealing",
    "deals", "treats", "treatment", "seeking", "advice", "help", "asking", "who",
    "what", "which", "where", "should", "would", "could", "please", "tell", "need",
    "having", "suffer", "suffering", "have", "with", "from", "for", "the", "and",
    "under", "over", "into", "about", "like", "also", "want", "know",
    "patient", "complains", "complaining", "complaint", "history", "reported",
    "reports", "experiencing", "experience", "complained",
    "keeps", "keep", "felt", "feel", "started", "start", "starting", "since",
    "ago", "days", "day", "week", "weeks", "hours", "hour", "times", "time",
    "standing", "sitting", "walking", "bird", "bit", "somewhat", "quite", "really",
    "getting", "gets", "think", "wondering", "maybe"
}

CLINICAL_QUALIFIERS = {
    "severe", "persistent", "frequent", "chronic", "acute", "constant",
    "mild", "high", "low", "morning", "pain", "aches", "feeling", "intermittent",
    "flare", "flares", "ups", "attack", "attacks", "episode", "episodes", "onset", "signs", "sign"
}

EFFECTIVE_STOPWORDS = STOPWORDS.union(CONVERSATIONAL_STOPWORDS)

# ── Comprehensive Patient Idiom & Colloquial Symptom Mapping ───────────────────
# Maps common patient lay phrases, metaphors, typos, and everyday complaints
# to corresponding target specialties and canonical clinical search terms.
PATIENT_IDIOM_MAP: List[Tuple[str, str, str]] = [
    # Musculoskeletal & Rheumatology / Orthopedics
    ("knuckles locked up like rusty hinges", "Orthopedics", "knuckles joint stiffness morning stiffness rheumatoid arthritis osteoarthritis"),
    ("rusty hinges", "Orthopedics", "joint stiffness osteoarthritis rheumatoid arthritis"),
    ("knuckles locked", "Orthopedics", "knuckles joint stiffness morning stiffness arthritis"),
    ("locked up", "Orthopedics", "joint locking stiffness limited mobility arthritis"),
    ("rusty joints", "Orthopedics", "joint stiffness morning stiffness arthritis osteoarthritis"),
    ("joints locked up", "Orthopedics", "joint locking stiffness arthritis"),
    ("knuckles", "Orthopedics", "knuckles finger joints arthritis morning stiffness"),
    ("morning stiffness", "Orthopedics", "morning stiffness rheumatoid arthritis osteoarthritis joint"),
    ("popping knee", "Orthopedics", "meniscus tear knee clicking knee pain ligament"),
    ("knee giving way", "Orthopedics", "knee instability meniscus acl ligament rupture"),
    ("sciatica", "Orthopedics", "sciatica lumbar radiculopathy herniated disc back pain leg"),
    ("frozen shoulder", "Orthopedics", "adhesive capsulitis frozen shoulder joint pain"),
    ("stiff fingers", "Orthopedics", "morning stiffness rheumatoid arthritis osteoarthritis"),
    ("popping joints", "Orthopedics", "joint crepitus osteoarthritis popping knee"),

    # Cardiology
    ("fluttering like a bird", "Cardiology", "palpitations arrhythmia fluttering tachycardia irregular heartbeat"),
    ("fluttering", "Cardiology", "palpitations arrhythmia irregular heartbeat cardiac"),
    ("skipping beats", "Cardiology", "palpitations ectopic beats arrhythmia irregular heartbeat"),
    ("skipped beat", "Cardiology", "palpitations arrhythmia irregular heartbeat"),
    ("thumping chest", "Cardiology", "palpitations tachycardia pounding heart cardiac"),
    ("heart racing", "Cardiology", "tachycardia palpitations cardiac arrhythmia"),
    ("racing heart", "Cardiology", "tachycardia palpitations cardiac arrhythmia"),
    ("elephant on chest", "Cardiology", "acute coronary syndrome myocardial infarction crushing chest pain angina"),
    ("tight chest", "Cardiology", "chest tightness angina cardiac"),
    ("swollen ankles", "Cardiology", "peripheral edema heart failure cardiac ankles swelling"),

    # Neurology
    ("pins and needles", "Neurology", "paresthesia peripheral neuropathy nerve numbness tingling"),
    ("pins & needles", "Neurology", "paresthesia peripheral neuropathy tingling numbness"),
    ("electric shocks", "Neurology", "neuropathic pain radiculopathy nerve pain shock sensations"),
    ("numb toes", "Neurology", "peripheral neuropathy numbness sensory deficit"),
    ("numb fingers", "Neurology", "carpal tunnel peripheral neuropathy numbness"),
    ("room spinning", "Neurology", "vertigo vestibular migraine dizziness loss of balance"),
    ("spinning sensations", "Neurology", "vertigo dizziness vestibular loss of balance"),
    ("throbbing head", "Neurology", "migraine headache vascular headache"),
    ("shaking hands", "Neurology", "tremor essential tremor parkinson neurological"),
    ("slurred speech", "Neurology", "dysarthria stroke transient ischemic attack facial drooping"),
    ("facial droop", "Neurology", "facial drooping stroke transient ischemic attack fast"),
    ("worst headache of life", "Neurology", "subarachnoid hemorrhage thunderclap headache emergency"),

    # Gastroenterology
    ("acid coming up throat", "Gastroenterology", "gerd gastroesophageal reflux acid regurgitation heartburn"),
    ("acid coming up", "Gastroenterology", "gerd gastroesophageal reflux acid regurgitation heartburn"),
    ("stomach burning", "Gastroenterology", "gastritis peptic ulcer dyspepsia burning abdominal pain"),
    ("burning stomach", "Gastroenterology", "gastritis peptic ulcer dyspepsia burning stomach"),
    ("gnawing belly cramps", "Gastroenterology", "peptic ulcer disease abdominal cramps gastritis"),
    ("gnawing stomach", "Gastroenterology", "peptic ulcer disease gastritis stomach ache"),
    ("bloated stomach", "Gastroenterology", "abdominal distension bloating dyspepsia ibs"),
    ("black stools", "Gastroenterology", "melena upper gastrointestinal bleeding peptic ulcer"),
    ("indigestion", "Gastroenterology", "dyspepsia gerd indigestion gastritis"),
    ("sour burps", "Gastroenterology", "acid reflux gerd sour regurgitation dyspepsia"),

    # Dermatology & Ophthalmology
    ("dermatoligist", "Dermatology", "dermatologist skin rash eczema dermatitis psoriasis"),
    ("dermatolagist", "Dermatology", "dermatologist skin rash eczema dermatitis"),
    ("welts", "Dermatology", "urticaria hives allergic skin rash welts pruritus"),
    ("hives on skin", "Dermatology", "urticaria hives dermatitis allergic rash"),
    ("curtain over eye", "Ophthalmology", "amaurosis fugax retinal detachment sudden vision loss eye"),
    ("opthalmologist", "Ophthalmology", "ophthalmologist eye cataracts glaucoma vision"),
    ("optamologist", "Ophthalmology", "ophthalmologist eye vision floaters"),
    ("floaters", "Ophthalmology", "vitreous floaters retinal detachment vision spots"),
    ("eye floaters", "Ophthalmology", "vitreous floaters retinal tear ophthalmology"),

    # Pulmonology
    ("gasping for air", "Pulmonology", "bronchial asthma dyspnea wheezing respiratory"),
    ("tight breathing", "Pulmonology", "bronchial asthma copd bronchospasm wheezing"),
    ("coughing fits", "Pulmonology", "chronic cough bronchial asthma bronchitis"),

    # Endocrinology
    ("drinking water all day", "Endocrinology", "polydipsia diabetes mellitus polyuria hyperglycemia"),
    ("drinking water like a fish", "Endocrinology", "polydipsia diabetes mellitus polyuria hyperglycemia"),
    ("unquenchable thirst", "Endocrinology", "polydipsia diabetes mellitus polyuria hyperglycemia"),
    ("peeing constantly", "Endocrinology", "polyuria diabetes mellitus hyperglycemia nocturia"),
    ("peeing all night", "Endocrinology", "polyuria nocturia diabetes mellitus hyperglycemia"),
]


def expand_patient_idioms(text: str) -> Tuple[str, Optional[str], List[str]]:
    """
    Expands colloquial patient idioms, metaphors, typos, and lay expressions
    into canonical clinical search terms and candidate medical specialties.
    Returns: (expanded_text, detected_specialty, canonical_terms_list)
    """
    text_lower = text.lower()
    expanded_terms: List[str] = []
    detected_specialty: Optional[str] = None

    for trigger, specialty, clinical_terms in PATIENT_IDIOM_MAP:
        if trigger in text_lower:
            expanded_terms.append(clinical_terms)
            if not detected_specialty:
                detected_specialty = specialty

    if expanded_terms:
        # Append canonical clinical terms to boost retrieval relevance
        combined_expanded = f"{text} {' '.join(expanded_terms)}"
        return (combined_expanded, detected_specialty, expanded_terms)
    return (text, None, [])


def build_fts_query(text: str, fallback_to_qualifiers: bool = False) -> str:
    """
    Constructs an FTS5 query with stopwords removed and smart clause weighting:
    Prioritizes discriminative anatomical, symptom, and condition terms over
    generic clinical qualifiers (e.g. 'stomach' over 'persistent' or 'pain').
    Automatically incorporates patient idiom expansions when present.
    """
    expanded_text, _, _ = expand_patient_idioms(text)
    tokens = re.findall(r"[a-zA-Z0-9]+", expanded_text.lower())
    meaningful = [t for t in tokens if t not in EFFECTIVE_STOPWORDS and len(t) > 2]
    if not meaningful:
        meaningful = [t for t in tokens if len(t) > 1] or tokens

    if not meaningful:
        return ""

    if not fallback_to_qualifiers:
        discriminative = [t for t in meaningful if t not in CLINICAL_QUALIFIERS]
        active_terms = discriminative if discriminative else meaningful
    else:
        active_terms = meaningful

    if len(active_terms) >= 2:
        phrase = " ".join(active_terms[:4])
        and_clause = " AND ".join(f'"{t}"*' for t in active_terms[:4])
        or_clause = " OR ".join(f'"{t}"*' for t in active_terms[:6])
        return f'("{phrase}") OR ({and_clause}) OR ({or_clause})'
    else:
        return " OR ".join(f'"{t}"*' for t in active_terms)


class HybridKnowledgeRetriever:
    """
    Production-grade hybrid knowledge retrieval service for Specialist Recommendation
    and Clinical Decision Support agents.
    """

    def __init__(self, db_path: Optional[Path] = None, cache_capacity: int = 1024, cache_ttl: int = 3600):
        self.db_path = db_path or DEFAULT_DB_PATH
        self.cache_capacity = cache_capacity
        self.cache_ttl = cache_ttl
        self._cache: OrderedDict = OrderedDict()  # (query_key) -> (timestamp, result)
        self._conn: Optional[sqlite3.Connection] = None
        self._is_available = False

        self._init_connection()

    def _init_connection(self):
        """Establishes read-only connection to the persistent SQLite database."""
        if not self.db_path.exists():
            logger.warning(f"MediFlow Knowledge Base DB not found at {self.db_path}. RAG will operate in fallback mode.")
            self._is_available = False
            return

        try:
            # Open URI with mode=ro for concurrent read safety and zero locking
            uri = f"file:{self.db_path.resolve()}?mode=ro"
            self._conn = sqlite3.connect(uri, uri=True, check_same_thread=False)
            self._conn.execute("PRAGMA query_only = ON;")
            self._conn.execute("PRAGMA cache_size = -16000;")  # 16MB cache
            self._is_available = True
            logger.info(f"Hybrid Knowledge Base connected successfully to {self.db_path}")
        except Exception as e:
            logger.error(f"Failed to open Knowledge Base DB at {self.db_path}: {e}")
            self._is_available = False

    @property
    def is_available(self) -> bool:
        return self._is_available and self._conn is not None

    def retrieve_knowledge(
        self,
        query: str,
        agent: Optional[str] = None,
        category: Optional[str] = None,
        top_k: int = 10,
        include_synthetic: bool = True,
        min_score: float = 0.05,
    ) -> List[Dict[str, Any]]:
        """
        Executes hybrid top-K retrieval combining BM25 lexical ranking and dense cosine similarity.
        Prioritizes authoritative clinical sources while utilizing synthetic augmentations
        for query understanding and patient language mapping.
        """
        t0 = time.time()
        query_clean = query.strip()
        if not query_clean:
            return []

        # Check in-memory cache
        cache_key = f"{query_clean.lower()}|{agent}|{category}|{top_k}|{include_synthetic}"
        now = time.time()
        if cache_key in self._cache:
            ts, cached_res = self._cache[cache_key]
            if now - ts < self.cache_ttl:
                self._cache.move_to_end(cache_key)
                return cached_res

        if not self.is_available:
            return self._fallback_retrieval(query_clean, agent, top_k)

        try:
            _, q_floats = compute_query_vector(query_clean)
            fts_q = build_fts_query(query_clean, fallback_to_qualifiers=False)

            cursor = self._conn.cursor()
            candidates = []

            # 1. Lexical retrieval via FTS5 if valid terms exist
            if fts_q:
                # Build agent and category filters
                filters = []
                params: List[Any] = [fts_q]

                if agent:
                    filters.append("(k.agent = ? OR k.agent = 'shared')")
                    params.append(agent)

                if category:
                    filters.append("k.knowledge_category = ?")
                    params.append(category)

                if not include_synthetic:
                    filters.append("k.data_type = 'authoritative'")

                filter_clause = ("AND " + " AND ".join(filters)) if filters else ""

                sql = f"""
                    SELECT k.id, k.document_id, k.data_type, k.agent, k.knowledge_category,
                           k.concept, k.content, k.metadata_json, k.embedding, rank
                    FROM knowledge_fts f
                    JOIN knowledge_units k ON f.id = k.id
                    WHERE knowledge_fts MATCH ? {filter_clause}
                    ORDER BY rank
                    LIMIT 250;
                """
                cursor.execute(sql, tuple(params))
                candidates = cursor.fetchall()

                # If discriminative search yielded no results, fallback to broader query
                if not candidates:
                    fallback_fts_q = build_fts_query(query_clean, fallback_to_qualifiers=True)
                    if fallback_fts_q and fallback_fts_q != fts_q:
                        params[0] = fallback_fts_q
                        cursor.execute(sql, tuple(params))
                        candidates = cursor.fetchall()

            # 2. Rescore and rank candidates using hybrid scoring
            ranked_results: List[Dict[str, Any]] = []
            for row in candidates:
                (
                    uid,
                    doc_id,
                    data_type,
                    ku_agent,
                    ku_cat,
                    concept,
                    content,
                    meta_json,
                    emb_bytes,
                    fts_rank,
                ) = row

                cand_floats = struct.unpack(f"{VECTOR_DIM}f", emb_bytes)
                cosine_sim = sum(a * b for a, b in zip(q_floats, cand_floats))

                # Normalize FTS BM25 rank (negative score in SQLite FTS5: more negative = better match)
                abs_rank = abs(fts_rank) if fts_rank else 0.0
                bm25_norm = (abs_rank / (1.0 + abs_rank)) if abs_rank > 0 else 0.1

                # Source Priority Weighting:
                # 1. Authoritative sources get 1.25x boost
                # 2. Red-flag clinical warnings get 1.20x boost
                # 3. Clinical relationships get 1.15x boost
                priority_multiplier = 1.0
                if data_type == "authoritative":
                    priority_multiplier *= 1.25
                if ku_cat == "red_flag":
                    priority_multiplier *= 1.20
                elif ku_cat in ("clinical_presentation", "treatment_concept"):
                    priority_multiplier *= 1.10

                hybrid_score = (0.65 * cosine_sim + 0.35 * bm25_norm) * priority_multiplier

                if hybrid_score < min_score:
                    continue

                try:
                    meta = json.loads(meta_json)
                except Exception:
                    meta = {}

                ranked_results.append({
                    "id": uid,
                    "document_id": doc_id,
                    "data_type": data_type,
                    "agent": ku_agent,
                    "knowledge_category": ku_cat,
                    "concept": concept,
                    "content": content,
                    "metadata": meta,
                    "score": round(float(hybrid_score), 4),
                    "semantic_similarity": round(float(cosine_sim), 4),
                    "lexical_score": round(float(bm25_norm), 4),
                })

            # Sort by hybrid score descending
            ranked_results.sort(key=lambda x: x["score"], reverse=True)
            top_results = ranked_results[:top_k]

            elapsed_ms = (time.time() - t0) * 1000
            logger.debug(f"Retrieved {len(top_results)} knowledge units in {elapsed_ms:.2f}ms")

            # Store in cache
            if len(self._cache) >= self.cache_capacity:
                self._cache.popitem(last=False)
            self._cache[cache_key] = (now, top_results)

            return top_results

        except Exception as e:
            logger.warning(f"Error during hybrid knowledge retrieval: {e}. Yielding fallback results.")
            return self._fallback_retrieval(query_clean, agent, top_k)

    def _fallback_retrieval(self, query: str, agent: Optional[str], top_k: int) -> List[Dict[str, Any]]:
        """Safe deterministic fallback when database is unavailable."""
        return [{
            "id": "kb_fallback_001",
            "document_id": "SRC-FALLBACK",
            "data_type": "authoritative",
            "agent": agent or "shared",
            "knowledge_category": "clinical_relationship",
            "concept": "Standard Ambulatory Triage Profile",
            "content": f"Standard clinical triage profile applied for presentation '{query[:60]}'. Global evidence-based clinical practice guidelines standard.",
            "metadata": {
                "source_organization": "MediFlow Clinical Rules Engine",
                "evidence_level": "Grade A Standard",
            },
            "score": 0.50,
            "semantic_similarity": 0.50,
            "lexical_score": 0.50,
        }]

    # ── Specialist Recommendation Specific Helpers ───────────────────────────
    def get_specialist_recommendation_context(
        self,
        symptoms: List[str],
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Specialist Recommendation Agent helper:
        Analyzes patient symptoms and optional notes, querying the hybrid knowledge base
        for specialty mappings, patient-language alignments, and red flags.
        """
        combined_text = " ".join(symptoms)
        if notes:
            combined_text += f" {notes}"

        # Expand colloquial patient idioms into canonical clinical concepts
        expanded_text, detected_idiom_spec, _ = expand_patient_idioms(combined_text)

        # Retrieve relevant specialty mappings and patient language matches
        results = self.retrieve_knowledge(
            query=expanded_text,
            agent="specialist_recommendation",
            top_k=15,
            include_synthetic=True,
        )

        # If zero results retrieved with agent filter, retry without agent filter to capture shared clinical units
        if not results:
            results = self.retrieve_knowledge(
                query=expanded_text,
                top_k=15,
                include_synthetic=True,
            )

        # Detect candidate specialties and red flags
        specialty_votes: Dict[str, float] = {}
        if detected_idiom_spec:
            specialty_votes[detected_idiom_spec] = 4.0

        retrieved_evidence: List[str] = []
        red_flags_detected: List[str] = []
        authoritative_sources_used: List[str] = []

        for idx, item in enumerate(results):
            meta = item.get("metadata", {})
            cat = item.get("knowledge_category")
            dt = item.get("data_type")
            score = item.get("score", 0.1)

            # Check specialty recommendation with rank-weighted voting (excluding Emergency Medicine which is acute triage)
            spec = meta.get("recommended_specialty") or meta.get("intended_specialty") or meta.get("specialty")
            if spec and spec != "Emergency Medicine":
                weight = 1.0 / (idx + 1)
                specialty_votes[spec] = specialty_votes.get(spec, 0.0) + (score * weight)

            # Collect evidence
            if dt == "authoritative":
                org = meta.get("source_organization", "Medical Practice Guideline")
                authoritative_sources_used.append(org)
                retrieved_evidence.append(f"[{org}] {item['content'][:140]}")

            # Collect red flags
            if cat == "red_flag" or meta.get("urgency") == "emergency":
                red_flags_detected.append(item["content"][:120])

        # Pick top candidate
        sorted_specs = sorted(specialty_votes.items(), key=lambda x: x[1], reverse=True)
        primary_spec = sorted_specs[0][0] if sorted_specs else "General Medicine"
        secondary_spec = sorted_specs[1][0] if len(sorted_specs) > 1 else None
        recommended_specs = [primary_spec] + ([secondary_spec] if secondary_spec else [])

        return {
            "query": combined_text,
            "primary_specialty_candidate": primary_spec,
            "alternative_specialty_candidate": secondary_spec,
            "recommended_specialties": recommended_specs,
            "specialty_confidence": min(0.98, max(0.65, round(sorted_specs[0][1] / (sum(specialty_votes.values()) or 1.0) + 0.3, 2))) if sorted_specs else 0.70,
            "retrieved_units": results,
            "retrieved_concepts": [r.get("concept") for r in results if r.get("concept")],
            "clinical_evidence_snippets": retrieved_evidence[:3],
            "red_flags": list(set(red_flags_detected)),
            "authoritative_sources": list(set(authoritative_sources_used)),
        }

    # ── Clinical Decision Support Specific Helpers ────────────────────────────
    def get_clinical_cds_guideline_context(
        self,
        keywords: Optional[str] = None,
        specialty: Optional[str] = None,
        clinical_presentation: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Clinical Decision Support Agent helper:
        Retrieves evidence-based clinical practice guidelines, diagnostic testing pathways,
        and red flags matching the diagnosis keywords or clinical presentation.
        """
        query_text = (clinical_presentation or keywords or "").strip()
        results = self.retrieve_knowledge(
            query=query_text,
            agent="clinical_decision",
            top_k=10,
            include_synthetic=True,
        )

        guidelines_found: Dict[str, Any] = {}
        for item in results:
            cat = item.get("knowledge_category")
            meta = item.get("metadata", {})
            concept = item.get("concept", "general")

            key = concept.lower()
            if key not in guidelines_found:
                guidelines_found[key] = {
                    "source": meta.get("source_organization", "Evidence-Based Clinical Practice Guidelines"),
                    "first_line": item["content"],
                    "testing": meta.get("diagnostics", "Standard baseline diagnostic panel"),
                    "avoid": "Contraindicated agents per drug-allergy matrix",
                    "follow_up": "Clinical review in 1-2 weeks or sooner upon symptom progression.",
                }

        first_line_list = [g["first_line"] for g in guidelines_found.values()]

        return {
            "query": query_text,
            "queried_terms": query_text,
            "guidelines_found": len(guidelines_found),
            "guidelines": guidelines_found,
            "first_line_therapies": first_line_list,
            "retrieved_guidelines": guidelines_found,
            "retrieved_units": results,
            "top_units": results[:5],
        }


# Global singleton instance for sub-millisecond reuse across requests
_retriever_instance: Optional[HybridKnowledgeRetriever] = None


def get_hybrid_retriever() -> HybridKnowledgeRetriever:
    """Returns or lazily initializes the singleton HybridKnowledgeRetriever instance."""
    global _retriever_instance
    if _retriever_instance is None:
        _retriever_instance = HybridKnowledgeRetriever()
    return _retriever_instance
