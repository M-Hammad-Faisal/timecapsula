-- ─────────────────────────────────────────────────────────────────
-- TimeCapsula — Cron Setup
-- Run this in your Supabase SQL Editor
-- Requires pg_cron and pg_net extensions enabled
-- ─────────────────────────────────────────────────────────────────

-- Enable extensions if not already enabled
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Remove old job if it exists
select cron.unschedule('deliver-capsules-daily');

-- Single daily job handles both deliveries AND reminders
select cron.schedule(
  'deliver-capsules-daily',
  '0 9 * * *',  -- 9am UTC every day
  $$
  select net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/deliver-capsules',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_CRON_SECRET'
    ),
    body := '{}'::jsonb
  );
  $$
);
