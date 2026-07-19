-- Engagement schema (Phase 09): practice days behind streaks and badges.
--
-- One row per user and calendar day. The set is append-only and merges by
-- union, so there is nothing to version or resolve (see specs/engagement.md).
-- `day` is the learner's local calendar day as 'YYYY-MM-DD'.

CREATE TABLE IF NOT EXISTS activity_days (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  PRIMARY KEY (user_id, day)
);

CREATE INDEX IF NOT EXISTS idx_activity_days_user_id ON activity_days(user_id);
