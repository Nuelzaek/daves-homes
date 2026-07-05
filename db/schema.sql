-- Dave's Homes — initial schema. Run in Supabase SQL Editor (or `supabase db push`)
-- before deploying. Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE).

create extension if not exists "pgcrypto";

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  neighbourhood text not null,
  type text not null check (type in ('Duplex','Detached','Bungalow','Terrace','Semi-Detached')),
  price_per_year numeric not null check (price_per_year >= 0),
  beds int not null check (beds >= 0),
  baths int not null check (baths >= 0),
  size_sqm numeric not null check (size_sqm >= 0),
  description text not null default '',
  images text[] not null default '{}',
  featured boolean not null default false,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_slug_idx on public.listings (slug);
create index if not exists listings_available_idx on public.listings (available);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

-- Durable, atomic, cross-instance rate limiter backed by Postgres (used by
-- src/lib/rateLimit.ts -> rateLimitDurable for the admin login endpoint).
create table if not exists public.rate_limits (
  key text primary key,
  count int not null default 0,
  reset_at timestamptz not null
);

create or replace function public.rate_limit_hit(p_key text, p_limit int, p_window_ms int)
returns table(ok boolean, retry_after int) as $$
declare
  v_now timestamptz := now();
  v_reset_at timestamptz;
  v_count int;
begin
  insert into public.rate_limits (key, count, reset_at)
  values (p_key, 1, v_now + (p_window_ms || ' milliseconds')::interval)
  on conflict (key) do update set
    count = case when public.rate_limits.reset_at < v_now then 1 else public.rate_limits.count + 1 end,
    reset_at = case when public.rate_limits.reset_at < v_now then v_now + (p_window_ms || ' milliseconds')::interval else public.rate_limits.reset_at end
  returning public.rate_limits.count, public.rate_limits.reset_at into v_count, v_reset_at;

  if v_count > p_limit then
    return query select false, greatest(0, ceil(extract(epoch from (v_reset_at - v_now))))::int;
  else
    return query select true, 0;
  end if;
end;
$$ language plpgsql security definer;

-- RLS: listings are served to the public via the service-role key from server
-- components only (see src/lib/db/listings.ts), so no anon-key policies are
-- needed or granted. rate_limits is never queried directly by clients.
alter table public.listings enable row level security;
alter table public.rate_limits enable row level security;
-- (Intentionally no policies — default deny for anon/authenticated keys;
-- only the service-role key, which bypasses RLS, reads/writes these tables.)
