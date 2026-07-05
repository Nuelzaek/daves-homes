'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Listing } from '@/lib/listings'

const TYPES = ["Duplex", "Detached", "Bungalow", "Terrace", "Semi-Detached"]

export default function ListingForm({ initial, listingId }: { initial?: Partial<Listing>; listingId?: string }) {
  const router = useRouter()
  const [form, setForm] = useState({
    slug: initial?.slug ?? '',
    title: initial?.title ?? '',
    neighbourhood: initial?.neighbourhood ?? '',
    type: (initial?.type ?? 'Duplex') as Listing['type'],
    price_per_year: initial?.price_per_year ?? 0,
    beds: initial?.beds ?? 1,
    baths: initial?.baths ?? 1,
    size_sqm: initial?.size_sqm ?? 0,
    description: initial?.description ?? '',
    images: (initial?.images ?? []).join('\n'),
    featured: initial?.featured ?? false,
    available: initial?.available ?? true,
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
    }
    const url = listingId ? `/api/admin/listings/${listingId}` : '/api/admin/listings'
    const method = listingId ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Save failed')
      setSaving(false)
      return
    }
    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 md:p-10 grid gap-4">
      <div>
        <label className="text-xs uppercase tracking-widest font-bold opacity-50">Title</label>
        <input value={form.title} onChange={(e) => set('title', e.target.value)} required className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none" />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest font-bold opacity-50">Slug (URL, lowercase-with-dashes)</label>
        <input value={form.slug} onChange={(e) => set('slug', e.target.value)} required pattern="[a-z0-9-]+" className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-widest font-bold opacity-50">Neighbourhood</label>
          <input value={form.neighbourhood} onChange={(e) => set('neighbourhood', e.target.value)} required className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest font-bold opacity-50">Type</label>
          <select value={form.type} onChange={(e) => set('type', e.target.value as Listing['type'])} className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none">
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-xs uppercase tracking-widest font-bold opacity-50">₦/year</label>
          <input type="number" value={form.price_per_year} onChange={(e) => set('price_per_year', Number(e.target.value))} required className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest font-bold opacity-50">Beds</label>
          <input type="number" value={form.beds} onChange={(e) => set('beds', Number(e.target.value))} required className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest font-bold opacity-50">Baths</label>
          <input type="number" value={form.baths} onChange={(e) => set('baths', Number(e.target.value))} required className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest font-bold opacity-50">sqm</label>
          <input type="number" value={form.size_sqm} onChange={(e) => set('size_sqm', Number(e.target.value))} required className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none" />
        </div>
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest font-bold opacity-50">Description</label>
        <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={5} className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none" />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest font-bold opacity-50">Image URLs (one per line, https only)</label>
        <textarea value={form.images} onChange={(e) => set('images', e.target.value)} rows={4} className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none font-mono text-sm" />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={form.available} onChange={(e) => set('available', e.target.checked)} /> Available
        </label>
      </div>
      {error && <p style={{ color: 'var(--terracotta)' }}>{error}</p>}
      <button type="submit" disabled={saving} className="btn rounded-full py-3 font-bold disabled:opacity-50" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
        {saving ? 'Saving…' : listingId ? 'Save changes' : 'Create listing'}
      </button>
    </form>
  )
}
