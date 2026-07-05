import type { MetadataRoute } from "next"
import { getAllListings } from "@/lib/db/listings"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.daveshomesph.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getAllListings()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/listings`, changeFrequency: "daily", priority: 0.9 },
  ]

  const listingRoutes: MetadataRoute.Sitemap = listings
    .filter((l) => l.available)
    .map((l) => ({ url: `${SITE_URL}/listings/${l.slug}`, changeFrequency: "weekly", priority: 0.8 }))

  return [...staticRoutes, ...listingRoutes]
}
