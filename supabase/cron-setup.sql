-- ─────────────────────────────────────────────────────────────────
-- TimeCapsula — Email Delivery Setup
-- Run this in your Supabase SQL Editor (after schema.sql)
-- ─────────────────────────────────────────────────────────────────

-- 1. Add delivered_at column to track when capsule was sent
alter table capsules
  add column if not exists delivered_at timestamptz;

-- 2. Enable pg_cron extension (needed for scheduled jobs)
create extension if not exists pg_cron;

-- 3. Enable pg_net extension (needed to make HTTP calls from cron)
create extension if not exists pg_net;

-- 4. Create the daily cron job
--    Runs every day at 9:00 AM UTC
--    Calls our Edge Function to deliver due capsules
--    ⚠️  Replace YOUR_PROJECT_REF with your actual Supabase project ref
--    ⚠️  Replace YOUR_CRON_SECRET with a random secret string you make up
select cron.schedule(
  'deliver-capsules-daily',         -- job name
  '0 9 * * *',                      -- every day at 9am UTC
  $$
    select net.http_post(
      url    := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/deliver-capsules',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer YOUR_CRON_SECRET'
      ),
      body   := '{}'::jsonb
    );
  $$
);

-- 5. Verify the cron job was created
select jobname, schedule, command from cron.job;
