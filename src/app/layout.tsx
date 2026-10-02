import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Titres: serif éditoriale. Interface: grotesque nette. Montants et dates: mono.
const display = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-instrument-serif" });
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Présences — CIM",
  description: "Calendrier de présence et paie du personnel",
};

export const viewport: Viewport = {
  themeColor: "#13201e",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`h-full antialiased ${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
