# Dave's Homes

Houses for rent in Port Harcourt — built with Next.js 16 (App Router) and Supabase.

## Stack

- Next.js 16 / React 19
- Supabase (Postgres + service-role access from server components only)
- Tailwind CSS v4
- GSAP (scroll reveals + pinned horizontal gallery on the homepage)
- Resend (transactional email, wired but not yet used — see Roadmap)
- jose (JWT admin sessions), bcryptjs (not currently needed — no public user accounts)

## Environment variables

Create `.env.local` (never committed — see `.gitignore`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=            # long random string, used to sign admin JWTs
ADMIN_PASSWORD=             # admin dashboard password
NEXT_PUBLIC_SITE_URL=https://www.daveshomesph.com
RESEND_API_KEY=             # optional, for future inquiry emails
```

## First-time setup

1. Create a Supabase project.
2. In the Supabase SQL Editor, run `db/schema.sql`, then `db/rls-lockdown.sql`.
3. Optionally run `db/seed.sql` to load 5 sample listings (the ones from the original design) — otherwise add your own from the admin dashboard.
4. Set the env vars above in `.env.local` (local dev) and in the Vercel project settings (production).
5. `npm install && npm run dev`
6. Visit `/admin`, sign in with `ADMIN_PASSWORD`, and add real listings — replace the sample images/descriptions with actual houses, addresses, and prices.
7. Update the placeholder phone number (`tel:+2340000000000`) and email (`hello@daveshomesph.com`) throughout `src/components/HomeClient.tsx` and `src/app/listings/[slug]/page.tsx` with the real contact details.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import into Vercel, set the environment variables above.
3. Set `NEXT_PUBLIC_SITE_URL` to the final production domain (needed for the sitemap, robots.txt, and canonical URLs to be correct).
4. Deploy.

## Security & SEO

This project follows the standing `Website_Security_SEO_Protocol.docx` baseline. Notable choices:

- Admin-only auth (no public user accounts / no checkout — nothing to gate behind bcrypt).
- Service-role Supabase key used only in server components / route handlers, never shipped to the client.
- RLS enabled with no anon/authenticated policies — public listing reads go through server components using the service key, not the anon key.
- Durable, Postgres-backed rate limiting (`rate_limit_hit`) on `/api/admin/login`.
- Security headers + CSP set in `next.config.ts`.
- `robots.txt`, `sitemap.xml` (including every available listing), manifest, and `/.well-known/security.txt` generated from day one.
- Per-listing pages are real server-rendered routes (not just a client-side modal) with unique metadata and JSON-LD, for both crawlability and to avoid duplicate-content SEO issues.

## Roadmap / known gaps

- No MFA on the admin account (single shared password, matches the Rowan House Beauty baseline for now).
- No inquiry form wired to Resend yet — CTAs are `tel:`/`mailto:` links, matching the original design. Add a proper inquiry-to-email flow if lead volume grows.
- SPF/DKIM/DMARC/DNSSEC need configuring at the domain registrar once a real domain is live.
- No cookie consent banner / privacy policy page yet — add before real traffic.
