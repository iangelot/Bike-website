import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BikeCard } from "@/components/BikeCard";
import { ArrowRight, WhatsAppIcon } from "@/components/icons";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  formatKm,
  getAllBikes,
  getBikeBySlug,
  getRelatedBikes,
} from "@/lib/bikes";
import { formatPrice, site, whatsappLink } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

/** Every listing is known at build time, so all of them prerender. */
export function generateStaticParams() {
  return getAllBikes().map((bike) => ({ slug: bike.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const bike = getBikeBySlug(slug);
  if (!bike) return { title: "Listing not found" };

  return {
    title: `${bike.make} ${bike.model} (${bike.year})`,
    description: `${bike.year} ${bike.make} ${bike.model}, ${formatKm(
      bike.km,
    )}, ${formatPrice(bike.price)}. Inspected and vetted by ${site.name}.`,
  };
}

/**
 * A single listing.
 *
 * The photo keeps the card's treatment — the road plate at 20% with the bike
 * floating over it — so a listing looks like the card it was opened from
 * rather than a different design.
 *
 * The spec rows are built from a plain array so extra fields (engine, colour,
 * ABS, service history) become one more entry rather than a layout change.
 */
export default async function BikePage({ params }: Params) {
  const { slug } = await params;
  const bike = getBikeBySlug(slug);
  if (!bike) notFound();

  const specs = [
    { label: "Make", value: bike.make },
    { label: "Model", value: bike.model },
    { label: "Year", value: String(bike.year) },
    { label: "Mileage", value: formatKm(bike.km) },
  ];

  const related = getRelatedBikes(bike);

  const enquiry = whatsappLink(
    `Hello ${site.name}, I'm interested in the ${bike.year} ${bike.make} ${bike.model} listed at ${formatPrice(bike.price)}.`,
  );

  return (
    <>
      <SiteHeader />
      <main>
        <section className="shell py-10 lg:py-16">
          <Link
            href="/bikes"
            className="inline-flex items-center gap-2 text-[0.9375rem] text-slate underline-offset-4 hover:text-navy hover:underline"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to all bikes
          </Link>

          <div className="mt-7 lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
            <div className="relative aspect-[3/2] overflow-hidden rounded-card bg-plate">
              <Image
                src="/brand/card-road.webp"
                alt=""
                fill
                sizes="(width >= 64rem) 55vw, 92vw"
                className="object-cover opacity-20"
              />
              <Image
                src={bike.image}
                alt={bike.alt}
                fill
                priority
                sizes="(width >= 64rem) 55vw, 92vw"
                className="-scale-x-100 object-contain p-6 drop-shadow-[0_14px_24px_rgba(0,26,52,0.28)]"
              />
            </div>

            <div className="mt-8 lg:mt-0">
              <p className="eyebrow">{bike.year}</p>
              <h1 className="section-title mt-2">
                {bike.make} {bike.model}
              </h1>

              <p className="mt-5 font-display text-4xl font-medium lg:text-5xl">
                {formatPrice(bike.price)}
              </p>

              <dl className="mt-8 border-t border-line">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between gap-6 border-b border-line py-3.5"
                  >
                    <dt className="text-[0.9375rem] text-slate">{spec.label}</dt>
                    <dd className="text-[0.9375rem] font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={enquiry}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold rounded-lg sm:flex-1"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Enquire on WhatsApp
                </a>
                <Link href="/contact" className="btn btn-outline rounded-lg sm:flex-1">
                  Contact Us!
                </Link>
              </div>

              <p className="mt-5 text-[0.9375rem] leading-[1.6] text-slate">
                Inspected and vetted for safe track and road use. Finance
                available — ask our sales staff about current rates.
              </p>
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="shell pb-16 lg:pb-24" aria-labelledby="related-heading">
            <h2 id="related-heading" className="section-title text-center">
              You might also like
            </h2>
            <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-8">
              {related.map((other) => (
                <BikeCard key={other.slug} bike={other} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
