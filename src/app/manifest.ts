import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dave's Homes",
    short_name: "Dave's Homes",
    description: "Verified houses for rent in Port Harcourt.",
    start_url: "/",
    display: "standalone",
    background_color: "#FDF6EC",
    theme_color: "#241A15",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  }
}
