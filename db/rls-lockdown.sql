-- Dave's Homes — RLS lockdown. Run in Supabase SQL Editor AFTER schema.sql
-- and after SUPABASE_SERVICE_ROLE_KEY is set for the deployed app.
-- The service-role key bypasses RLS; with RLS enabled and no client
-- policies, the public anon key is denied on both tables.

alter table public.listings enable row level security;
alter table public.rate_limits enable row level security;

-- (Intentionally no policies for anon/authenticated client keys — listings
-- are served to visitors via server components using the service-role key,
-- never the anon key, so no public-read policy is needed.)
