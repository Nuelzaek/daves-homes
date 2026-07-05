import type { Metadata } from "next"
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { getSiteUrl } from "@/lib/siteUrl"

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
})
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
})

const SITE_URL = getSiteUrl()
const SITE_NAME = "Dave's Homes"
const SITE_DESCRIPTION = "Verified houses for rent in Port Harcourt — real photos, real landlords, zero agent drama."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Houses for Rent in Port Harcourt`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Houses for Rent in Port Harcourt`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Houses for Rent in Port Harcourt`,
    description: SITE_DESCRIPTION,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  )
}
