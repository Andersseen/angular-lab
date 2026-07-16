-- Progress sync schema (Phase 04): one row per user and mission, replaced whole.

CREATE TABLE IF NOT EXISTS progress (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL,
  current_step_id TEXT NOT NULL DEFAULT '',
  step_code TEXT NOT NULL DEFAULT '{}',
  completed INTEGER NOT NULL DEFAULT 0,
  completed_at INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, mission_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
