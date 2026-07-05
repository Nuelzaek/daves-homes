const TYPES = ["Duplex", "Detached", "Bungalow", "Terrace", "Semi-Detached"]
const NEIGHBOURHOODS_MAX = 60

export function cleanListing(body: unknown, partial: boolean): { value?: Record<string, unknown>; error?: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { error: "Invalid body" }
  const b = body as Record<string, unknown>
  const out: Record<string, unknown> = {}
  const has = (k: string) => Object.prototype.hasOwnProperty.call(b, k)

  const strFields: Array<[string, number, boolean, RegExp | undefined]> = [
    ["slug", 80, true, /^[a-z0-9-]+$/],
    ["title", 120, true, undefined],
    ["neighbourhood", NEIGHBOURHOODS_MAX, true, undefined],
    ["description", 4000, false, undefined],
  ]
  for (const [k, max, required, pattern] of strFields) {
    if (has(k)) {
      const v = b[k]
      if (typeof v !== "string" || v.length === 0 || v.length > max) return { error: `Invalid ${k}` }
      if (pattern && !pattern.test(v)) return { error: `Invalid ${k} format` }
      out[k] = v
    } else if (required && !partial) {
      return { error: `${k} is required` }
    }
  }

  if (has("type")) {
    if (typeof b.type !== "string" || !TYPES.includes(b.type)) return { error: "Invalid type" }
    out.type = b.type
  } else if (!partial) {
    return { error: "type is required" }
  }

  const numFields: Array<[string, number, number, boolean]> = [
    ["price_per_year", 0, 1_000_000_000, true],
    ["beds", 0, 30, true],
    ["baths", 0, 30, true],
    ["size_sqm", 0, 10000, true],
  ]
  for (const [k, min, max, required] of numFields) {
    if (has(k)) {
      const v = Number(b[k])
      if (!Number.isFinite(v) || v < min || v > max) return { error: `Invalid ${k}` }
      out[k] = v
    } else if (required && !partial) {
      return { error: `${k} is required` }
    }
  }

  if (has("images")) {
    if (!Array.isArray(b.images)) return { error: "Invalid images" }
    const images = (b.images as unknown[])
      .filter((x) => typeof x === "string" && x.length <= 2000)
      .slice(0, 12)
    for (const img of images) {
      if (!/^https:\/\//.test(img as string)) return { error: "Image URLs must be https" }
    }
    out.images = images
  }

  if (has("featured")) out.featured = Boolean(b.featured)
  if (has("available")) out.available = Boolean(b.available)

  return { value: out }
}
