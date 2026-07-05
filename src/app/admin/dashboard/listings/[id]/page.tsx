import { notFound } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import ListingForm from "@/components/ListingForm"

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await supabaseAdmin.from("listings").select("*").eq("id", id).single()
  if (error || !data) notFound()

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      <div className="px-6 md:px-10 py-6" style={{ background: "var(--ink)" }}>
        <p className="font-display font-bold text-xl" style={{ color: "var(--cream)" }}>Edit listing</p>
      </div>
      <ListingForm initial={data} listingId={id} />
    </div>
  )
}
