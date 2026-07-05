import { NextRequest, NextResponse } from "next/server"
import { timingSafeEqual } from "crypto"
import { createAdminToken } from "@/lib/auth"
import { rateLimitDurable, clientKey } from "@/lib/rateLimit"

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

export async function POST(req: NextRequest) {
  try {
    const limit = await rateLimitDurable(clientKey(req, "admin-login"), 8, 15 * 60 * 1000)
    if (!limit.ok) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 })
    }

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json({ error: "Admin login is not configured." }, { status: 500 })
    }

    const { password } = await req.json()
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password required" }, { status: 400 })
    }

    if (!safeEqual(password, adminPassword)) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
    }

    const token = await createAdminToken()
    const res = NextResponse.json({ success: true })
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    })
    return res
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
