-- ─────────────────────────────────────────────────────────────────
-- Migration: Create analyses table
-- Description: Stores AI-powered resume analysis results per user
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  resume_name TEXT NOT NULL,
  job_title TEXT NOT NULL DEFAULT '',
  ats_score INTEGER NOT NULL,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  weaknesses JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  technical_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  soft_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  suggestions JSONB NOT NULL DEFAULT '[]'::jsonb,
  interview_readiness TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast per-user queries
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses (user_id);

-- Index for ordering by newest first
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses (created_at DESC);

-- Composite index for per-user sorted queries (most common access pattern)
CREATE INDEX IF NOT EXISTS idx_analyses_user_created ON analyses (user_id, created_at DESC);

-- Enable Row Level Security (optional; we enforce auth at the API layer)
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own analyses
CREATE POLICY "Users can view own analyses"
  ON analyses
  FOR SELECT
  USING (user_id = current_setting('app.user_id', TRUE)::TEXT);

-- Policy: users can insert their own analyses
CREATE POLICY "Users can insert own analyses"
  ON analyses
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.user_id', TRUE)::TEXT);
