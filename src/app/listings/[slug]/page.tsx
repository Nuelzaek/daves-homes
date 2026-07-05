import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllListings, getListingBySlug } from "@/lib/db/listings"

function formatPrice(n: number) {
  return `₦${(n / 1_000_000).toFixed(1)}M / year`
}

export async function generateStaticParams() {
  const listings = await getAllListings()
  return listings.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListingBySlug(slug)
  if (!listing) return {}
  const title = `${listing.title}, ${listing.neighbourhood}`
  const description = listing.description.slice(0, 155)
  return {
    title,
    description,
    alternates: { canonical: `/listings/${listing.slug}` },
    openGraph: { title, description, images: [{ url: listing.images[0] }] },
  }
}

export default async function ListingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const listing = await getListingBySlug(slug)
  if (!listing) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: listing.title,
    description: listing.description,
    address: { "@type": "PostalAddress", addressLocality: listing.neighbourhood, addressRegion: "Rivers State", addressCountry: "NG" },
    numberOfRooms: listing.beds,
    image: listing.images,
  }

  return (
    <main className="min-h-screen px-4 md:px-8 py-16 md:py-24" style={{ background: "var(--cream)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <Link href="/listings" className="text-sm font-semibold opacity-60 hover:opacity-100">&larr; All listings</Link>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-8 rounded-[1.5rem] overflow-hidden">
          {listing.images.map((src, i) => (
            <img key={i} src={src} alt={`${listing.title} photo ${i + 1}`} className={i === 0 ? "col-span-2 row-span-2 w-full h-full object-cover" : "w-full h-full object-cover"} />
          ))}
        </div>

        <p className="text-xs uppercase tracking-widest font-bold opacity-60 mb-1">{listing.neighbourhood}, Port Harcourt</p>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <h1 className="font-display font-extrabold" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>{listing.title}</h1>
          <p className="font-display font-extrabold text-2xl shrink-0" style={{ color: "var(--terracotta)" }}>{formatPrice(listing.price_per_year)}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="spec-pill">{listing.type}</span>
          <span className="spec-pill">{listing.beds} bed</span>
          <span className="spec-pill">{listing.baths} bath</span>
          <span className="spec-pill">{listing.size_sqm} sqm</span>
        </div>

        <p className="opacity-80 font-medium leading-relaxed mb-10 max-w-2xl">{listing.description}</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a href="tel:+2340000000000" className="btn flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold" style={{ background: "var(--ink)", color: "var(--cream)" }}>
            Schedule a viewing
          </a>
          <a href="mailto:hello@daveshomesph.com" className="btn flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold" style={{ background: "rgba(31,110,106,0.1)", color: "var(--teal)" }}>
            Contact agent
          </a>
        </div>
      </div>
    </main>
  )
}
