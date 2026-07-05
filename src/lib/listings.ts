// Static fallback catalog. Used if Supabase is unreachable, and as seed data
// for the initial db/seed.sql. Source of truth in production is the
// `listings` table (see db/schema.sql).

export interface Listing {
  id: string
  slug: string
  title: string
  neighbourhood: string
  type: 'Duplex' | 'Detached' | 'Bungalow' | 'Terrace' | 'Semi-Detached'
  price_per_year: number
  beds: number
  baths: number
  size_sqm: number
  description: string
  images: string[]
  featured: boolean
  available: boolean
}

export const LISTINGS: Listing[] = [
  {
    id: '1', slug: 'woji-terrace',
    title: 'Sunlit 2-Bed Terrace', neighbourhood: 'Woji', type: 'Terrace',
    price_per_year: 2400000, beds: 2, baths: 2, size_sqm: 95,
    description: "A bright, low-maintenance terrace house tucked into a quiet close off the Woji waterline. Both bedrooms face east and catch the morning light, the living room opens onto a small paved yard, and the kitchen has been redone with granite counters. Ten minutes to Genesis Centre, gated compound with 24-hour security.",
    images: [
      'https://images.pexels.com/photos/32115995/pexels-photo-32115995.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/6970077/pexels-photo-6970077.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/8135502/pexels-photo-8135502.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/10827396/pexels-photo-10827396.jpeg?auto=compress&cs=tinysrgb&w=1400',
    ],
    featured: true, available: true,
  },
  {
    id: '2', slug: 'gra-duplex',
    title: 'Modern 4-Bed Duplex', neighbourhood: 'GRA', type: 'Duplex',
    price_per_year: 4800000, beds: 4, baths: 5, size_sqm: 260,
    description: "A fully-serviced duplex on a tree-lined GRA Phase 2 street, built for a family that entertains. Ground floor has a formal living room, a separate family lounge, and a fitted kitchen with an island. Upstairs, the master suite has a walk-in closet and private balcony. Comes with a 2-car carport and backup generator housing already wired in.",
    images: [
      'https://images.pexels.com/photos/323781/pexels-photo-323781.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/6180674/pexels-photo-6180674.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/4740488/pexels-photo-4740488.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/6035312/pexels-photo-6035312.jpeg?auto=compress&cs=tinysrgb&w=1400',
    ],
    featured: true, available: true,
  },
  {
    id: '3', slug: 'eliozu-bungalow',
    title: 'Compact 3-Bed Bungalow', neighbourhood: 'Eliozu', type: 'Bungalow',
    price_per_year: 1600000, beds: 3, baths: 2, size_sqm: 110,
    description: "An easy, single-storey bungalow just off the Eliozu link road — ideal for a small family or first-time renters who want to skip the stairs. Tiled throughout, with a fenced front yard big enough for a car and a bit of garden. Borehole on site, so no water worries, and it's a short drive to the new market.",
    images: [
      'https://images.pexels.com/photos/8482510/pexels-photo-8482510.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/28991200/pexels-photo-28991200.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/15667603/pexels-photo-15667603.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/6908354/pexels-photo-6908354.jpeg?auto=compress&cs=tinysrgb&w=1400',
    ],
    featured: true, available: true,
  },
  {
    id: '4', slug: 'ada-george-family',
    title: 'Family Home with Garden', neighbourhood: 'Ada George', type: 'Detached',
    price_per_year: 3100000, beds: 4, baths: 3, size_sqm: 190,
    description: "A detached family house set back from the road behind a real garden — rare for Ada George. Four bedrooms, a large dining area that opens to the garden through sliding doors, and a boys' quarters at the back for staff or extra storage. Quiet residential street, five minutes' walk from the main road for taxis and shops.",
    images: [
      'https://images.pexels.com/photos/7031581/pexels-photo-7031581.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/18738880/pexels-photo-18738880.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/29923543/pexels-photo-29923543.jpeg?auto=compress&cs=tinysrgb&w=1400',
    ],
    featured: true, available: true,
  },
  {
    id: '5', slug: 'trans-amadi-detached',
    title: '5-Bed Detached House', neighbourhood: 'Trans-Amadi', type: 'Detached',
    price_per_year: 6200000, beds: 5, baths: 6, size_sqm: 340,
    description: "A five-bedroom detached house on a corner plot in Trans-Amadi, built with entertaining in mind — double-height living room, a separate study, and a rooftop terrace with river views on a clear day. Every room is en-suite. Comes with staff quarters, a 2-car garage, and space to add a small pool if you want one.",
    images: [
      'https://images.pexels.com/photos/18214902/pexels-photo-18214902.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/6035357/pexels-photo-6035357.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/34672503/pexels-photo-34672503.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/6301183/pexels-photo-6301183.jpeg?auto=compress&cs=tinysrgb&w=1400',
    ],
    featured: true, available: true,
  },
]
