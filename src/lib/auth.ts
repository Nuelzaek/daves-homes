import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

function getSecret() {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error(
      "NEXTAUTH_SECRET is not set. Refusing to sign/verify tokens with an insecure fallback."
    )
  }
  return new TextEncoder().encode(secret)
}

// ---------- Admin sessions ----------
// Dave's Homes has no public user accounts (no shopping cart / checkout) — only
// an admin session for managing listings, mirroring the pattern used across
// every Zaek project (see Website_Security_SEO_Protocol.docx).

export async function createAdminToken() {
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(getSecret())
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (payload.role !== "admin") return null
    return payload as { role: "admin" }
  } catch {
    return null
  }
}
