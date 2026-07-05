// Resolves the canonical site URL for metadata, robots.txt, and the sitemap.
//
// Priority:
// 1. NEXT_PUBLIC_SITE_URL — set this explicitly once a real custom domain
//    (e.g. daveshomesph.com) is pointed at the deployment.
// 2. VERCEL_PROJECT_PRODUCTION_URL — set automatically by Vercel to the
//    project's actual production domain. Using this means the sitemap/
//    canonical/OG URLs can never silently point at a stale or guessed
//    domain again, even if NEXT_PUBLIC_SITE_URL is misconfigured or unset.
// 3. A hardcoded fallback, only used for local dev outside Vercel.
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return "https://www.daveshomesph.com"
}
