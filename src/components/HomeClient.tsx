'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Listing } from '@/lib/listings'

function formatPrice(n: number) {
  return `₦${(n / 1_000_000).toFixed(1)}M / year`
}

export default function HomeClient({ listings }: { listings: Listing[] }) {
  const [active, setActive] = useState<Listing | null>(null)
  const [activeImg, setActiveImg] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const lastFocused = useRef<HTMLElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  function openListing(listing: Listing) {
    lastFocused.current = document.activeElement as HTMLElement
    setActive(listing)
    setActiveImg(0)
  }
  function closeListing() {
    setActive(null)
    lastFocused.current?.focus()
  }

  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : ''
    if (active && closeBtnRef.current) closeBtnRef.current.focus()
    return () => {
      document.body.style.overflow = ''
    }
  }, [active])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeListing()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Scroll-in reveals + pinned horizontal scroll gallery, ported from the
  // original design. Loaded dynamically so gsap/ScrollTrigger never block
  // first paint or run during SSR.
  useEffect(() => {
    let ctx: { revert: () => void } | undefined
    ;(async () => {
      const gsapModule = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      const gsap = gsapModule.default
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        document.querySelectorAll('.reveal').forEach((el) => {
          gsap.to(el, {
            opacity: 1, y: 0, filter: 'blur(0px)', duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          })
        })
        gsap.to('#hero-text', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, delay: 0.1, ease: 'power3.out' })
        gsap.to('#hero-search', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, delay: 0.35, ease: 'power3.out' })

        // Hero background drift is handled by a pure CSS animation
        // (see .hero-drift in globals.css) — more reliable than a JS-driven
        // tween for an always-on ambient effect, and it respects
        // prefers-reduced-motion via a plain media query.

        // Scroll-jacked pinned gallery only on larger screens — on phones
        // this pattern fights with native scroll and feels janky, so mobile
        // gets a plain swipeable horizontal scroll instead (see overflow-x-auto
        // in the markup below).
        const track = document.querySelector('.horiz-track') as HTMLElement | null
        const wrap = document.querySelector('.pin-wrap') as HTMLElement | null
        if (track && wrap && window.innerWidth >= 768) {
          let scrollAmount = track.scrollWidth - window.innerWidth + 64
          if (scrollAmount < 0) scrollAmount = 0
          gsap.to(track, {
            x: () => -scrollAmount,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap, start: 'top top',
              end: () => '+=' + (scrollAmount + window.innerHeight),
              scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
            },
          })
        }
      })
    })()
    return () => ctx?.revert()
  }, [])

  return (
    <>
      <div className="grain" />

      <header className="fixed top-0 left-0 w-full z-40 flex flex-col items-center px-4 mt-4 md:mt-6">
        <nav className="glass-nav w-full max-w-5xl rounded-full flex items-center justify-between px-4 md:px-6 py-3 shadow-[0_8px_30px_rgba(36,26,21,0.08)] border border-black/5">
          <a href="#top" className="font-display text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'var(--terracotta)', color: 'var(--cream)' }}>D</span>
            Dave&rsquo;s Homes
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <a href="#explore" className="hover:opacity-60 transition">House types</a>
            <a href="#stays" className="hover:opacity-60 transition">Listings</a>
            <a href="#why" className="hover:opacity-60 transition">Why Dave&rsquo;s</a>
            <a href="#reviews" className="hover:opacity-60 transition">Reviews</a>
          </div>
          <div className="flex items-center gap-2">
            <a href="#contact" className="btn group hidden sm:flex items-center gap-2 rounded-full pl-4 pr-1.5 py-1.5 text-sm font-bold" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
              Contact agent
              <span className="btn-icon w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--sand)', color: 'var(--ink)' }}>&#8599;</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'var(--ink)', color: 'var(--cream)' }}
            >
              {mobileMenuOpen ? '\u2715' : '\u2630'}
            </button>
          </div>
        </nav>
        {mobileMenuOpen && (
          <div className="md:hidden w-full max-w-5xl mt-2 rounded-[1.5rem] overflow-hidden glass-nav border border-black/5 shadow-[0_8px_30px_rgba(36,26,21,0.08)]">
            <div className="flex flex-col p-2 text-sm font-semibold">
              <a href="#explore" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-black/5">House types</a>
              <a href="#stays" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-black/5">Listings</a>
              <a href="#why" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-black/5">Why Dave&rsquo;s</a>
              <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-black/5">Reviews</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl font-bold" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>Contact agent</a>
            </div>
          </div>
        )}
      </header>

      <section id="top" className="relative min-h-[100dvh] flex flex-col justify-center pt-32 pb-16 px-4 md:px-8 overflow-hidden" style={{ background: 'var(--ink)' }}>
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="hero-drift absolute -left-10 top-10 w-64 h-80 md:w-80 md:h-96 rounded-[2rem] overflow-hidden rotate-[-6deg]">
            <Image src="https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=900" fill sizes="320px" priority className="object-cover" alt="" />
          </div>
          <div className="hero-drift absolute right-0 top-0 w-56 h-72 md:w-72 md:h-96 rounded-[2rem] overflow-hidden rotate-[5deg]">
            <Image src="https://images.pexels.com/photos/7031406/pexels-photo-7031406.jpeg?auto=compress&cs=tinysrgb&w=900" fill sizes="288px" priority className="object-cover" alt="" />
          </div>
          <div className="hero-drift absolute left-1/3 bottom-0 w-60 h-64 rounded-[2rem] overflow-hidden rotate-[3deg] hidden md:block">
            <Image src="https://images.pexels.com/photos/7031604/pexels-photo-7031604.jpeg?auto=compress&cs=tinysrgb&w=900" fill sizes="240px" className="object-cover" alt="" />
          </div>
        </div>
        <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse at center, rgba(36,26,21,0.55) 0%, rgba(36,26,21,0.92) 70%)' }} />

        <div className="relative z-10 max-w-5xl mx-auto text-center reveal" id="hero-text">
          <span className="inline-block rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-bold mb-6" style={{ background: 'var(--sand)', color: 'var(--ink)' }}>Port Harcourt houses only</span>
          <h1 className="font-display font-extrabold leading-[0.95] mb-6" style={{ color: 'var(--cream)', fontSize: 'clamp(2.75rem, 6.5vw, 6rem)' }}>
            Port Harcourt&rsquo;s<br />
            <span style={{ color: 'var(--terracotta)' }}>home</span> for houses.
          </h1>
          <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: 'rgba(253,246,236,0.75)' }}>
            Dave&rsquo;s Homes lists real houses in real Port Harcourt neighbourhoods &mdash; verified landlords, real photos, zero agent drama.
          </p>
        </div>

        <div className="relative z-10 max-w-4xl w-full mx-auto mt-10 reveal" id="hero-search">
          <div className="bezel-dark shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            <div className="bezel-inner grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_auto] gap-2 p-3 md:p-2" style={{ background: 'var(--cream)' }}>
              <div className="flex flex-col px-4 py-2">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Neighbourhood</label>
                <input type="text" placeholder="GRA, Woji, Eliozu, Trans-Amadi&hellip;" className="bg-transparent outline-none font-semibold placeholder:opacity-40 placeholder:font-medium" />
              </div>
              <div className="flex flex-col px-4 py-2 border-t md:border-t-0 md:border-l border-black/10">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">House type</label>
                <input type="text" placeholder="Duplex" className="bg-transparent outline-none font-semibold placeholder:opacity-40 placeholder:font-medium" />
              </div>
              <div className="flex flex-col px-4 py-2 border-t md:border-t-0 md:border-l border-black/10">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Budget</label>
                <input type="text" placeholder="Any price" className="bg-transparent outline-none font-semibold placeholder:opacity-40 placeholder:font-medium" />
              </div>
              <Link href="/listings" className="btn group m-1 flex items-center justify-center gap-2 rounded-[1.4rem] px-6 py-3 font-bold" style={{ background: 'var(--terracotta)', color: 'var(--cream)' }}>
                Search
                <span className="btn-icon w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="explore" className="py-24 md:py-36 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <h2 className="font-display font-extrabold" style={{ fontSize: 'clamp(2rem,4vw,3.2rem)' }}>Houses, by type</h2>
            <p className="max-w-sm opacity-60 font-medium">Every house in Port Harcourt, sorted your way. Each one inspected by our team before it goes live.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 grid-flow-dense gap-4 md:gap-5">
            <Link href="/listings" className="reveal group relative col-span-2 row-span-2 rounded-[2rem] overflow-hidden min-h-[280px] md:min-h-[420px]">
              <Image src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" alt="Duplexes" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(36,26,21,0.85), transparent 60%)' }} />
              <div className="absolute bottom-0 p-6">
                <span className="inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-widest font-bold mb-2" style={{ background: 'var(--terracotta)', color: 'var(--cream)' }}>Most popular</span>
                <h3 className="font-display font-bold text-2xl md:text-3xl" style={{ color: 'var(--cream)' }}>Duplexes</h3>
              </div>
            </Link>
            {[
              ['https://images.pexels.com/photos/20296321/pexels-photo-20296321.jpeg?auto=compress&cs=tinysrgb&w=800', 'Detached houses', 'Detached'],
              ['https://images.pexels.com/photos/27953061/pexels-photo-27953061.jpeg?auto=compress&cs=tinysrgb&w=800', 'Bungalows', 'Bungalows'],
              ['https://images.pexels.com/photos/19516616/pexels-photo-19516616.jpeg?auto=compress&cs=tinysrgb&w=800', 'Terraces', 'Terraces'],
              ['https://images.pexels.com/photos/30580640/pexels-photo-30580640.jpeg?auto=compress&cs=tinysrgb&w=800', 'Semi-detached', 'Semi-Detached'],
            ].map(([img, alt, label]) => (
              <Link key={label} href="/listings" className="reveal group relative rounded-[2rem] overflow-hidden min-h-[130px] md:min-h-[200px]">
                <Image src={img} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" alt={alt} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(36,26,21,0.8), transparent 55%)' }} />
                <h3 className="absolute bottom-4 left-4 font-display font-bold text-lg md:text-xl" style={{ color: 'var(--cream)' }}>{label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="stays" className="relative" style={{ background: 'var(--ink)' }}>
        <div className="pin-wrap relative py-16 md:py-0 md:h-[100dvh] md:overflow-hidden flex flex-col justify-center">
          <div className="px-4 md:px-8 mb-8 md:mb-10 shrink-0">
            <span className="inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-widest font-bold mb-3" style={{ background: 'var(--teal)', color: 'var(--cream)' }}>Featured houses</span>
            <h2 className="font-display font-extrabold" style={{ color: 'var(--cream)', fontSize: 'clamp(1.8rem,3.6vw,3rem)' }}>Live in Port Harcourt right now</h2>
          </div>

          <div className="horiz-track flex gap-5 px-4 md:px-8 will-change-transform overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none no-scrollbar">
            {listings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => openListing(listing)}
                tabIndex={0}
                role="button"
                aria-label={`View ${listing.title}, ${listing.neighbourhood}`}
                className="listing-card btn group shrink-0 w-[78vw] md:w-[26vw] rounded-[2rem] overflow-hidden relative cursor-pointer snap-start"
                style={{ height: '56vh' }}
              >
                <Image src={listing.images[0]} fill sizes="(max-width: 768px) 78vw, 26vw" className="object-cover transition-transform duration-700 group-hover:scale-105" alt={listing.title} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(36,26,21,0.85), transparent 55%)' }} />
                <span className="absolute top-4 right-4 rounded-full px-3 py-1.5 text-xs font-bold flex items-center gap-1" style={{ background: 'rgba(253,246,236,0.92)', color: 'var(--ink)' }}>
                  View interior <span className="btn-icon">&rarr;</span>
                </span>
                <div className="absolute bottom-0 p-5" style={{ color: 'var(--cream)' }}>
                  <p className="text-xs uppercase tracking-widest opacity-70 font-semibold mb-1">{listing.neighbourhood}, Port Harcourt</p>
                  <h3 className="font-display font-bold text-xl">{listing.title}</h3>
                  <p className="font-bold mt-1" style={{ color: 'var(--sand)' }}>{formatPrice(listing.price_per_year)}</p>
                </div>
              </div>
            ))}
            <div className="shrink-0 w-[60vw] md:w-[18vw] flex items-center">
              <Link href="/listings" className="btn group flex items-center gap-3 rounded-full px-6 py-4 font-bold" style={{ background: 'var(--terracotta)', color: 'var(--cream)' }}>
                See all stays
                <span className="btn-icon w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>&#8599;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="py-24 md:py-36 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <span className="inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-widest font-bold mb-4" style={{ background: 'var(--teal)', color: 'var(--cream)' }}>Why Dave&rsquo;s Homes</span>
            <h2 className="font-display font-extrabold mb-6" style={{ fontSize: 'clamp(2rem,4vw,3.2rem)' }}>Renting in PH shouldn&rsquo;t feel like a gamble.</h2>
            <p className="opacity-70 font-medium max-w-md mb-8">Every house on Dave&rsquo;s Homes is inspected in person, every landlord is verified, and the price you see is the price you pay &mdash; no surprise agency fees, no ghost listings.</p>
            <Link href="/listings" className="btn group inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
              Start browsing
              <span className="btn-icon w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--sand)', color: 'var(--ink)' }}>&rarr;</span>
            </Link>
          </div>
          <div className="relative h-[420px]">
            <div className="reveal absolute top-0 left-0 w-56 md:w-64 bezel rotate-[-4deg] shadow-[0_20px_50px_rgba(36,26,21,0.15)]" style={{ background: 'var(--cream)' }}>
              <div className="bezel-inner p-5" style={{ background: 'var(--cream)' }}>
                <p className="font-display font-extrabold text-3xl">1,200+</p>
                <p className="text-sm opacity-60 font-semibold mt-1">Verified houses live in PH today</p>
              </div>
            </div>
            <div className="reveal absolute top-24 right-0 w-56 md:w-64 bezel rotate-[3deg] shadow-[0_20px_50px_rgba(36,26,21,0.15)]" style={{ background: 'var(--terracotta)' }}>
              <div className="bezel-inner p-5" style={{ background: 'var(--terracotta)' }}>
                <p className="font-display font-extrabold text-3xl" style={{ color: 'var(--cream)' }}>0%</p>
                <p className="text-sm opacity-80 font-semibold mt-1" style={{ color: 'var(--cream)' }}>Hidden agency fees</p>
              </div>
            </div>
            <div className="reveal absolute bottom-0 left-10 w-56 md:w-64 bezel rotate-[-2deg] shadow-[0_20px_50px_rgba(36,26,21,0.15)]" style={{ background: 'var(--sand)' }}>
              <div className="bezel-inner p-5" style={{ background: 'var(--sand)' }}>
                <p className="font-display font-extrabold text-3xl">48hrs</p>
                <p className="text-sm opacity-70 font-semibold mt-1">Average move-in time, PH-wide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-24 md:py-32 px-4 md:px-8" style={{ background: 'var(--ink-2)' }}>
        <div className="max-w-6xl mx-auto mb-10">
          <h2 className="font-display font-extrabold reveal" style={{ color: 'var(--cream)', fontSize: 'clamp(1.8rem,3.6vw,2.8rem)' }}>Port Harcourt families who found their house</h2>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            ['“Relocated to Woji and had a duplex confirmed in two days. No agent drama at all.”', '— Amaka O.'],
            ['“The photos matched the actual house in GRA. First time that’s ever happened to me.”', '— Tunde A.'],
            ['“Listed my duplex in Trans-Amadi on a Monday, had three verified applicants by Wednesday.”', '— Chidera N.'],
          ].map(([quote, author], i) => (
            <div key={i} className="reveal bezel-dark">
              <div className="bezel-inner p-6" style={{ background: 'var(--ink)' }}>
                <p className="font-medium mb-4" style={{ color: 'rgba(253,246,236,0.85)' }}>{quote}</p>
                <p className="font-bold text-sm" style={{ color: 'var(--sand)' }}>{author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer id="contact" className="px-4 md:px-8 pt-24 md:pt-32 pb-10" style={{ background: 'var(--terracotta)' }}>
        <div className="max-w-5xl mx-auto text-center reveal">
          <h2 className="font-display font-extrabold mb-6" style={{ color: 'var(--cream)', fontSize: 'clamp(2.2rem,5.5vw,4.5rem)', lineHeight: 0.98 }}>Found one you like?<br />Let&rsquo;s get you inside.</h2>
          <p className="max-w-md mx-auto mb-8 font-medium" style={{ color: 'rgba(253,246,236,0.85)' }}>Every house on this site is managed directly by Dave&rsquo;s Homes &mdash; no agents, no middlemen.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a href="tel:+2340000000000" className="btn group flex items-center gap-2 rounded-full px-6 py-4 font-bold w-full sm:w-auto justify-center" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
              Schedule a viewing
              <span className="btn-icon w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--sand)', color: 'var(--ink)' }}>&rarr;</span>
            </a>
            <a href="mailto:hello@daveshomesph.com" className="btn flex items-center gap-2 rounded-full px-6 py-4 font-bold w-full sm:w-auto justify-center" style={{ background: 'rgba(253,246,236,0.15)', color: 'var(--cream)', border: '1px solid rgba(253,246,236,0.3)' }}>
              Contact agent
            </a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-24 pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid rgba(253,246,236,0.3)' }}>
          <a href="#top" className="font-display text-xl font-bold" style={{ color: 'var(--cream)' }}>Dave&rsquo;s Homes</a>
          <div className="flex gap-6 text-sm font-semibold" style={{ color: 'rgba(253,246,236,0.85)' }}>
            <a href="#explore" className="hover:opacity-70">House types</a>
            <a href="#stays" className="hover:opacity-70">Listings</a>
            <a href="#why" className="hover:opacity-70">Why Dave&rsquo;s</a>
            <a href="#reviews" className="hover:opacity-70">Reviews</a>
          </div>
          <p className="text-xs font-medium" style={{ color: 'rgba(253,246,236,0.6)' }}>&copy; 2026 Dave&rsquo;s Homes, Port Harcourt. All rights reserved.</p>
        </div>
      </footer>

      <div id="listing-modal" role="dialog" aria-modal="true" aria-label="House details" className={active ? 'open' : ''}>
        <div className="modal-backdrop" onClick={closeListing} />
        {active && (
          <div className="modal-panel">
            <button ref={closeBtnRef} onClick={closeListing} aria-label="Close" className="btn absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: 'rgba(36,26,21,0.85)', color: 'var(--cream)' }}>&#10005;</button>
            <div className="w-full" style={{ height: '38vh', backgroundImage: `url('${active.images[activeImg]}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="p-6 md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-60 mb-1">{active.neighbourhood}, Port Harcourt</p>
                  <h2 className="font-display font-extrabold" style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)' }}>{active.title}</h2>
                </div>
                <p className="font-display font-extrabold text-2xl shrink-0" style={{ color: 'var(--terracotta)' }}>{formatPrice(active.price_per_year)}</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="spec-pill">{active.type}</span>
                <span className="spec-pill">{active.beds} bed</span>
                <span className="spec-pill">{active.baths} bath</span>
                <span className="spec-pill">{active.size_sqm} sqm</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {active.images.map((src, i) => (
                  <button key={i} className={`thumb-btn${i === activeImg ? ' active' : ''}`} onClick={() => setActiveImg(i)} aria-label={`View photo ${i + 1}`}>
                    <Image src={src} width={200} height={70} style={{ width: '100%', height: 70, objectFit: 'cover', display: 'block' }} alt="" />
                  </button>
                ))}
              </div>
              <p className="opacity-80 font-medium leading-relaxed mb-8 max-w-2xl">{active.description}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="tel:+2340000000000" onClick={closeListing} className="btn group flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
                  Schedule a viewing
                  <span className="btn-icon w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--sand)', color: 'var(--ink)' }}>&rarr;</span>
                </a>
                <a href="mailto:hello@daveshomesph.com" onClick={closeListing} className="btn flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold" style={{ background: 'rgba(31,110,106,0.1)', color: 'var(--teal)' }}>
                  Contact agent
                </a>
                <Link href={`/listings/${active.slug}`} onClick={closeListing} className="btn flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold" style={{ background: 'rgba(36,26,21,0.06)', color: 'var(--ink)' }}>
                  View full listing page
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
