import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { LISTINGS, type Listing } from "@/lib/listings"

// Reads go through the service-role client from the server only. Public pages
// are server components, so the anon key is never needed for listing reads.
// If Supabase is unreachable, fall back to the static catalog rather than
// showing an empty/broken page.

export async function getAllListings(): Promise<Listing[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false })
    if (error || !data || data.length === 0) return LISTINGS
    return data as Listing[]
  } catch {
    return LISTINGS
  }
}

export async function getFeaturedListings(): Promise<Listing[]> {
  const all = await getAllListings()
  return all.filter((l) => l.featured && l.available)
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const all = await getAllListings()
  return all.find((l) => l.slug === slug) ?? null
}
