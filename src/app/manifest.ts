import type { MetadataRoute } from "next";

// Permet d'ajouter l'app à l'écran d'accueil du téléphone (plein écran, avec icône).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gestion des présences — CIM",
    short_name: "Présences",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#2563eb",
    icons: [{ src: "/icon.png", sizes: "100x100", type: "image/png" }],
  };
}
