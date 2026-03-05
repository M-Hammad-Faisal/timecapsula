-- ─────────────────────────────────────────────────────────────────
-- TimeCapsula — Waitlist Migration
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────

-- 1. Create waitlist table for premium template interest
create table if not exists public.waitlist (
  id         uuid        default gen_random_uuid() primary key,
  email      text        unique not null,
  template   text,                              -- which locked template they clicked
  created_at timestamptz default now()
);

-- 2. Enable RLS (only service role key can insert via API — no direct client access)
alter table public.waitlist enable row level security;

-- Block all direct client access (API route uses service_role key to bypass RLS)
create policy "No direct access" on public.waitlist
  as restrictive
  for all
  using (false);
