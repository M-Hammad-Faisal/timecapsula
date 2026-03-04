-- ─────────────────────────────────────────────────────────────────
-- TimeCapsula — Auth Migration
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────

-- 1. Add user_id column (nullable — guests can still submit)
alter table capsules
  add column if not exists user_id uuid references auth.users(id) on delete set null;

-- 2. Index for fast dashboard queries
create index if not exists idx_capsules_user_id on capsules (user_id);
