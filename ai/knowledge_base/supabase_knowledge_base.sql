-- ====================================================================
-- MediFlow-AI: Supabase / PostgreSQL pgvector Knowledge Base Schema
-- ====================================================================
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Knowledge Documents Table
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id VARCHAR(64) PRIMARY KEY,
    title TEXT NOT NULL,
    source_organization TEXT NOT NULL,
    source_url TEXT,
    publication_date TEXT,
    country VARCHAR(64),
    version VARCHAR(32),
    data_type VARCHAR(32) NOT NULL,
    document_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Knowledge Units Table
CREATE TABLE IF NOT EXISTS knowledge_units (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) REFERENCES knowledge_documents(id) ON DELETE CASCADE,
    data_type VARCHAR(32) NOT NULL,
    agent VARCHAR(64) NOT NULL,
    knowledge_category VARCHAR(64) NOT NULL,
    concept TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    chunk_hash VARCHAR(64) UNIQUE NOT NULL,
    embedding vector(128) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for ultra-fast top-K retrieval
CREATE INDEX IF NOT EXISTS idx_ku_agent ON knowledge_units(agent);
CREATE INDEX IF NOT EXISTS idx_ku_category ON knowledge_units(knowledge_category);
CREATE INDEX IF NOT EXISTS idx_ku_concept ON knowledge_units(concept);
CREATE INDEX IF NOT EXISTS idx_ku_data_type ON knowledge_units(data_type);
CREATE INDEX IF NOT EXISTS idx_ku_embedding_hnsw ON knowledge_units USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_ku_content_fts ON knowledge_units USING gin (to_tsvector('english', concept || ' ' || content));

-- Hybrid search function (cosine similarity + full text search)
CREATE OR REPLACE FUNCTION match_knowledge_units(
    query_embedding vector(128),
    query_text TEXT,
    filter_agent TEXT DEFAULT NULL,
    match_threshold FLOAT DEFAULT 0.5,
    match_count INT DEFAULT 20
)
RETURNS TABLE (
    id VARCHAR(64),
    concept TEXT,
    content TEXT,
    knowledge_category VARCHAR(64),
    agent VARCHAR(64),
    data_type VARCHAR(32),
    metadata_json JSONB,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        ku.id,
        ku.concept,
        ku.content,
        ku.knowledge_category,
        ku.agent,
        ku.data_type,
        ku.metadata_json,
        (1 - (ku.embedding <=> query_embedding))::FLOAT AS similarity
    FROM knowledge_units ku
    WHERE
        (filter_agent IS NULL OR ku.agent = filter_agent OR ku.agent = 'shared')
        AND (1 - (ku.embedding <=> query_embedding)) >= match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$;
