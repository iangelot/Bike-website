import { BuyCta } from "@/components/BuyCta";
import { FeaturedListings } from "@/components/FeaturedListings";
import { FindYourBike } from "@/components/FindYourBike";
import { Hero } from "@/components/Hero";
import { MakeMarquee } from "@/components/MakeMarquee";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhyChoose } from "@/components/WhyChoose";

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
