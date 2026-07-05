'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }
      router.push('/admin/dashboard')
    } catch {
      setError('Login failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--ink)' }}>
      <form onSubmit={handleLogin} className="w-full max-w-sm rounded-[1.5rem] p-8" style={{ background: 'var(--cream)' }}>
        <h1 className="font-display font-extrabold text-2xl mb-1">Dave&rsquo;s Homes</h1>
        <p className="text-sm opacity-60 mb-6">Admin sign in</p>
        <label className="block text-xs uppercase tracking-widest font-bold opacity-50 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-4 py-3 mb-4 outline-none focus:border-black/30"
          autoFocus
        />
        {error && <p className="text-sm mb-4" style={{ color: 'var(--terracotta)' }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn w-full rounded-full py-3 font-bold disabled:opacity-50"
          style={{ background: 'var(--ink)', color: 'var(--cream)' }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
