import Link from "next/link";
import { BikeCard } from "./BikeCard";
import { ArrowRight } from "./icons";
import { getFeaturedBikes } from "@/lib/bikes";

/**
 * The mobile frame centres the eyebrow and title and hangs "View all bikes →"
 * on the right above a single column of cards. Desktop keeps that centred
 * masthead — the whole lower page is centre-aligned in the design — and turns
 * the column into a three-up grid, which is exactly the count the frame shows.
 */
export function FeaturedListings() {
  const featured = getFeaturedBikes();

  return (
    <section className="shell py-16 lg:py-24" aria-labelledby="featured-heading">
      <p className="eyebrow text-center">New Arrivals</p>
      <h2 id="featured-heading" className="section-title mt-2 text-center">
        Featured Listings
      </h2>

      <div className="mt-6 flex justify-end lg:mt-8">
        <Link
          href="/bikes"
          className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-navy underline-offset-4 hover:underline lg:text-lg"
        >
          View all bikes
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:mt-10 lg:grid-cols-2 lg:gap-7">
        {featured.map((bike, i) => (
          <BikeCard key={bike.slug} bike={bike} priority={i === 0} />
        ))}
      </div>
    </section>
  );
}
