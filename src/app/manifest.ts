import type { MetadataRoute } from "next";

// Permet d'ajouter l'app à l'écran d'accueil du téléphone (plein écran, avec icône).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Présences — CIM",
    short_name: "Présences",
    start_url: "/",
    display: "standalone",
    background_color: "#eaeeeb",
    theme_color: "#13201e",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
