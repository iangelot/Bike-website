import type { Metadata } from "next";
import { Anton, Archivo_Black, Inter } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Three families, all free and self-hosted by next/font.
 *
 * The Figma file also specified Helvetica Neue (not a web font — it silently
 * becomes Arial off macOS) and "FONTSPRING DEMO - Visby CF Extra Bold", a trial
 * font that cannot be licensed for a live site. Inter and Archivo Black stand
 * in for those respectively.
 */
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const archivo = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.fullName} — New and pre-owned motorcycles`,
    template: `%s — ${site.name}`,
  },
  description:
    "Quality used and new bikes, checked, ridden, and sold straight. No surprises, no hidden fees. Financing available.",
  openGraph: {
    title: site.fullName,
    description: "Quality used and new motorcycles. Financing available.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivo.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
