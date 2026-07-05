'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Listing } from '@/lib/listings'

export default function AdminDashboard() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/listings')
      .then((r) => r.json())
      .then((data) => {
        setListings(data.listings ?? [])
        setLoading(false)
      })
  }, [])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    await fetch(`/api/admin/listings/${id}`, { method: 'DELETE' })
    setListings((prev) => prev.filter((l) => l.id !== id))
    setDeleting(null)
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="flex items-center justify-between px-6 md:px-10 py-6" style={{ background: 'var(--ink)' }}>
        <div>
          <p className="font-display font-bold text-xl" style={{ color: 'var(--cream)' }}>Listings</p>
          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--sand)' }}>Dave&rsquo;s Homes Admin</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/dashboard/listings/new" className="rounded-full px-5 py-2 text-sm font-bold" style={{ background: 'var(--sand)', color: 'var(--ink)' }}>
            + Add listing
          </Link>
          <button onClick={handleLogout} className="rounded-full px-5 py-2 text-sm font-bold border" style={{ color: 'var(--cream)', borderColor: 'rgba(253,246,236,0.3)' }}>
            Log out
          </button>
        </div>
      </div>

      <div className="p-6 md:p-10">
        {loading ? (
          <p className="opacity-60">Loading&hellip;</p>
        ) : listings.length === 0 ? (
          <p className="opacity-60">No listings yet. Add your first one.</p>
        ) : (
          <div className="grid gap-4">
            {listings.map((listing) => (
              <div key={listing.id} className="flex items-center gap-4 rounded-2xl p-4 bg-white/60 border border-black/5">
                <img src={listing.images?.[0]} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold">{listing.title}</p>
                  <p className="text-sm opacity-60">{listing.neighbourhood} &middot; {listing.type} &middot; {listing.available ? 'Available' : 'Not available'}</p>
                </div>
                <Link href={`/admin/dashboard/listings/${listing.id}`} className="rounded-full px-4 py-2 text-sm font-bold" style={{ background: 'rgba(36,26,21,0.06)' }}>
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(listing.id, listing.title)}
                  disabled={deleting === listing.id}
                  className="rounded-full px-4 py-2 text-sm font-bold disabled:opacity-50"
                  style={{ background: 'rgba(217,96,59,0.1)', color: 'var(--terracotta)' }}
                >
                  {deleting === listing.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
