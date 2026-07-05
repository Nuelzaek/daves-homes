import { getFeaturedListings } from "@/lib/db/listings"
import HomeClient from "@/components/HomeClient"

export default async function HomePage() {
  const listings = await getFeaturedListings()
  return <HomeClient listings={listings} />
}
