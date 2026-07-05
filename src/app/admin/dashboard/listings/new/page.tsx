import ListingForm from "@/components/ListingForm"

export default function NewListingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      <div className="px-6 md:px-10 py-6" style={{ background: "var(--ink)" }}>
        <p className="font-display font-bold text-xl" style={{ color: "var(--cream)" }}>Add listing</p>
      </div>
      <ListingForm />
    </div>
  )
}
