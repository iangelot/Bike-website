import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Two families, both free and self-hosted by next/font, matching what the
 * Figma file actually specifies.
 *
 * Oswald Medium is the display face for every heading in both frames — the
 * hero headline (96px desktop / 48px mobile), the section titles, the prices.
 * An earlier pass guessed Anton and Archivo Black from the screenshots; the
 * design context confirms Oswald, which is lighter and slightly wider.
 *
 * Everything else in the file is Helvetica Neue, which is not a web font (it
 * silently degrades to Arial off macOS). Inter stands in for it: same
 * neo-grotesque skeleton, and it ships real Medium and Regular weights rather
 * than letting the browser synthesise them.
 */
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-oswald",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  /**
   * Every relative URL in the metadata below — and in each page's — is
   * resolved against this. Without it, a listing's Open Graph image is a path
   * rather than an address, and WhatsApp or Facebook show the link with no
   * picture. See `site.url`.
   */
  metadataBase: new URL(site.url),
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
    url: site.url,
    siteName: site.fullName,
  },
};

/**
 * Business identity for Google, as JSON-LD.
 *
 * This is what turns "a website that ranks" into "a business Google
 * recognises": the name, logo, phone and email in a form search engines read
 * directly, rather than guessing them from page text. It's the groundwork for
 * a proper branded result — and eventually a knowledge panel — and it's built
 * from site.ts so it can never drift from what the footer shows.
 */
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: site.fullName,
  url: site.url,
  logo: `${site.url}/brand/og-cover.png`,
  image: `${site.url}/brand/og-cover.png`,
  description:
    "Quality used and new motorcycles, checked, ridden, and sold straight. Financing available.",
  email: site.email,
  telephone: `+${site.whatsapp}`,
  areaServed: "US",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // Trusted, static values from site.ts — no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        {children}
        {/* Privacy-friendly visitor counts (pages, countries, referrers) shown
            in the Vercel dashboard's Analytics tab. No cookies, so no consent
            banner is needed. Collects nothing until Analytics is enabled for
            the project in Vercel, and is inert off Vercel (local, previews). */}
        <Analytics />
      </body>
    </html>
  );
}
