-- ─────────────────────────────────────────────────────────────────
-- Migration: Create user_settings table
-- Description: Stores per-user preference data for the Settings page
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  default_resume_name TEXT DEFAULT '',
  default_job_role TEXT DEFAULT '',
  theme TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast per-user lookup
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings (user_id);

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policy: users can view their own settings
CREATE POLICY "Users can view own settings"
  ON user_settings
  FOR SELECT
  USING (user_id = current_setting('app.user_id', TRUE)::TEXT);

-- Policy: users can insert their own settings
CREATE POLICY "Users can insert own settings"
  ON user_settings
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.user_id', TRUE)::TEXT);

-- Policy: users can update their own settings
CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  USING (user_id = current_setting('app.user_id', TRUE)::TEXT);
