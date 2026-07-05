import type { Metadata } from "next"
import Link from "next/link"
import { getAllListings } from "@/lib/db/listings"

export const metadata: Metadata = {
  title: "All Listings",
  description: "Every verified house currently available to rent through Dave's Homes in Port Harcourt.",
  alternates: { canonical: "/listings" },
}

function formatPrice(n: number) {
  return `₦${(n / 1_000_000).toFixed(1)}M / year`
}

export default async function ListingsPage() {
  const listings = (await getAllListings()).filter((l) => l.available)

  return (
    <main className="min-h-screen px-4 md:px-8 py-16 md:py-24" style={{ background: "var(--cream)" }}>
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-sm font-semibold opacity-60 hover:opacity-100">&larr; Back home</Link>
        <h1 className="font-display font-extrabold mt-4 mb-10" style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}>
          All houses currently for rent
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/listings/${listing.slug}`}
              className="group rounded-[1.5rem] overflow-hidden relative block"
              style={{ height: 340 }}
            >
              <img src={listing.images[0]} alt={listing.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(36,26,21,0.85), transparent 55%)" }} />
              <div className="absolute bottom-0 p-5" style={{ color: "var(--cream)" }}>
                <p className="text-xs uppercase tracking-widest opacity-70 font-semibold mb-1">{listing.neighbourhood}, Port Harcourt</p>
                <h2 className="font-display font-bold text-xl">{listing.title}</h2>
                <p className="font-bold mt-1" style={{ color: "var(--sand)" }}>{formatPrice(listing.price_per_year)}</p>
              </div>
            </Link>
          ))}
        </div>
        {listings.length === 0 && <p className="opacity-60">No houses are listed right now — check back soon.</p>}
      </div>
    </main>
  )
}
