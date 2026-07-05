import { NextRequest, NextResponse } from "next/server"
import { getAdminSession } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { cleanListing } from "@/lib/validateListing"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { value, error } = cleanListing(body, true)
  if (error || !value) return NextResponse.json({ error: error || "Invalid listing" }, { status: 400 })

  const { data, error: dbErr } = await supabaseAdmin.from("listings").update(value).eq("id", id).select().single()
  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const { error } = await supabaseAdmin.from("listings").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
