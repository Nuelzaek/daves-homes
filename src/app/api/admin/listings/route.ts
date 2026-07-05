import { NextRequest, NextResponse } from "next/server"
import { getAdminSession } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { cleanListing } from "@/lib/validateListing"

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: "Failed to load listings" }, { status: 500 })
  return NextResponse.json({ listings: data ?? [] })
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { value, error } = cleanListing(body, false)
  if (error || !value) return NextResponse.json({ error: error || "Invalid listing" }, { status: 400 })

  const { data, error: dbErr } = await supabaseAdmin.from("listings").insert(value).select().single()
  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 400 })
  return NextResponse.json(data)
}
