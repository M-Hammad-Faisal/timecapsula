-- TimeCapsula Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Capsules table
create table capsules (
  id            uuid primary key default uuid_generate_v4(),
  to_name       text not null,
  to_email      text not null,
  from_name     text,
  subject       text,
  message       text not null,
  deliver_at    timestamptz not null,
  delivered     boolean default false,
  created_at    timestamptz default now()
);

-- Index for the scheduler to quickly find pending capsules
create index idx_capsules_deliver_at on capsules (deliver_at)
  where delivered = false;

-- Row Level Security (keep data private)
alter table capsules enable row level security;

-- Only allow inserts from the API (service role key bypasses RLS)
create policy "Allow insert from API" on capsules
  for insert with check (true);

-- Only allow the service role to read/update (for the scheduler)
create policy "Service role only" on capsules
  for select using (false);
