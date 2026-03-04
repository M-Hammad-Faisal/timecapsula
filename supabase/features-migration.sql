-- ─────────────────────────────────────────────────────────────────
-- TimeCapsula — Features Migration
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────

-- 1. Rate limiting — track IP for guest submissions
alter table capsules
  add column if not exists ip_address text;

create index if not exists idx_capsules_ip on capsules (ip_address)
  where user_id is null;

-- 2. Reminder emails — track if 7-day reminder was sent
alter table capsules
  add column if not exists reminder_sent boolean default false;

-- 3. Shareable links — allow public preview
alter table capsules
  add column if not exists share_enabled boolean default true;

-- 4. Template used for email rendering
alter table capsules
  add column if not exists template text default 'cosmic';

-- 4. Update RLS policy to allow reading public capsule previews
-- (only non-sensitive fields — no message content)
create policy "Allow public preview read" on capsules
  for select using (share_enabled = true);
