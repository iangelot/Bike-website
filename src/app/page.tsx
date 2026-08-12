import type { Metadata } from "next";
import { BuyCta } from "@/components/BuyCta";
import { FeaturedListings } from "@/components/FeaturedListings";
import { FindYourBike } from "@/components/FindYourBike";
import { Hero } from "@/components/Hero";
import { MakeMarquee } from "@/components/MakeMarquee";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhyChoose } from "@/components/WhyChoose";

// The home page shows live "Featured Listings", so it renders per request.
export const dynamic = "force-dynamic";

// Title and description are inherited from the root layout; this pins the
// canonical address so the apex and the .vercel.app copy don't compete with it.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <FeaturedListings />
        <FindYourBike />
        <MakeMarquee />
        <WhyChoose />
        <BuyCta />
      </main>
      <SiteFooter />
    </>
  );
}
