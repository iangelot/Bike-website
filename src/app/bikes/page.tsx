import type { Metadata } from "next";
import Link from "next/link";
import { BikeCard } from "@/components/BikeCard";
import { BikeFilter } from "@/components/BikeFilter";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllBikes, getMakes } from "@/lib/bikes-data";

export const metadata: Metadata = {
  title: "Collection",
  description:
    "Every motorcycle currently on the floor at RAGERIDE — track and road bikes, inspected and vetted, with financing available.",
};

// Always reflect the live database — a bike the admin just added or removed
// must show up immediately, not on the next rebuild.
export const dynamic = "force-dynamic";

/**
 * The collection page the home page's search and every "View all bikes" link
 * point at. Filtering happens here on the server from the ?make= query string,
 * which is what keeps the whole flow free of client JavaScript.
 */
export default async function BikesPage({
  searchParams,
}: {
  searchParams: Promise<{ make?: string }>;
}) {
  const { make } = await searchParams;

  const [allBikes, makes] = await Promise.all([getAllBikes(), getMakes()]);

  // Validated against the real makes rather than trusted, so a hand-typed or
  // stale query string falls back to the full list instead of an empty page.
  const activeMake = make && makes.includes(make) ? make : undefined;

  const bikes = activeMake
    ? allBikes.filter((bike) => bike.make === activeMake)
    : allBikes;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="shell py-12 lg:py-20">
          <p className="eyebrow">Our Collection</p>
          <h1 className="section-title mt-2">
            {activeMake ? `${activeMake} Motorcycles` : "All Motorcycles"}
          </h1>
          <p className="mt-5 max-w-xl text-[0.9375rem] leading-[1.6] text-slate lg:text-base">
            Quality used and new bikes, checked, ridden, and sold straight. No
            surprises, no hidden fees.
          </p>

          <div className="mt-9">
            <BikeFilter make={activeMake} makes={makes} />
          </div>

          <p aria-live="polite" className="mt-8 text-[0.9375rem] text-slate">
            {bikes.length} {bikes.length === 1 ? "motorcycle" : "motorcycles"}
            {activeMake ? ` from ${activeMake}` : ""}
          </p>

          {bikes.length > 0 ? (
            <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-7">
              {bikes.map((bike, i) => (
                <BikeCard key={bike.slug} bike={bike} priority={i < 3} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[15px] border border-line bg-white px-6 py-12 text-center">
              <h2 className="font-display text-2xl font-medium">
                Nothing in stock under that filter
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[0.9375rem] text-slate">
                Stock moves quickly. Tell us what you are after and we will call
                you when the right bike lands.
              </p>
              <Link href="/contact" className="btn btn-gold mt-7 rounded-lg">
                Contact Us!
              </Link>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
