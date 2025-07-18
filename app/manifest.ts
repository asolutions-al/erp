import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Erp Asolutions",
    short_name: "ERP",
    description: "Menaxho biznesin tënd.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/manifest/icons/logo-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/manifest/icons/logo-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/manifest/screenshots/dashboard.png",
        sizes: "1024x1024",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/manifest/screenshots/new_invoice.png",
        sizes: "1024x1024",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/manifest/screenshots/invoice_settings.png",
        sizes: "1024x1024",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/manifest/screenshots/new_customer.png",
        sizes: "1024x1024",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
  }
}
