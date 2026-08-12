import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BikeCard } from "@/components/BikeCard";
import { BikeGallery } from "@/components/BikeGallery";
import { ArrowRight, WhatsAppIcon } from "@/components/icons";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { bikeName, bikeTitle, formatDistance } from "@/lib/bikes";
import { getBikeBySlug, getRelatedBikes } from "@/lib/bikes-data";
import { emailLink, formatPrice, site, whatsappLink } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

// Listings live in the database now, so a bike is rendered on demand rather
// than baked at build time — an edit in the admin is visible on next request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const bike = await getBikeBySlug(slug);
  if (!bike) return { title: "Listing not found" };

  // Every part of this is optional on a listing, so the description is
  // assembled from what is actually recorded rather than a fixed sentence with
  // holes in it.
  const facts = [formatDistance(bike), formatPrice(bike.price)].filter(Boolean);
  const lead = bike.photos[0];

  return {
    title: bike.year ? `${bikeName(bike)} (${bike.year})` : bikeName(bike),
    description: `${[bikeTitle(bike), ...facts].join(", ")}. Inspected and vetted by ${site.name}.`,
    alternates: { canonical: `/bikes/${bike.slug}` },
    openGraph: {
      title: bikeTitle(bike),
      type: "website",
      url: `${site.url}/bikes/${bike.slug}`,
      // Photo URLs are absolute (Supabase Storage) or root-relative (the seed
      // photos); metadataBase in the root layout resolves the latter.
      ...(lead ? { images: [{ url: lead.src }] } : {}),
    },
  };
}

/**
 * A single listing.
 *
 * The spec rows are assembled from the fields that are actually set, so a bike
 * with no warranty or location noted simply shows fewer rows rather than a
 * column of blanks — and adding a field (engine, colour, service history) is
 * one more entry here plus one more key on the type.
 */
export default async function BikePage({ params }: Params) {
  const { slug } = await params;
  const bike = await getBikeBySlug(slug);
  if (!bike) notFound();

  const specs = [
    { label: "Make", value: bike.make },
    { label: "Model", value: bike.model },
    { label: "Year", value: bike.year ? String(bike.year) : undefined },
    { label: "Mileage", value: formatDistance(bike) },
    { label: "Colour", value: bike.colour },
    { label: "Fuel type", value: bike.fuelType },
    { label: "Location", value: bike.location },
    { label: "Warranty", value: bike.warranty },
  ].filter(
    (spec): spec is { label: string; value: string } =>
      typeof spec.value === "string" && spec.value.length > 0,
  );

  const related = await getRelatedBikes(bike, 4);

  // "listed at $4,500" only if there is a price; otherwise the buyer is asking
  // what it costs, which is exactly what "price on request" means.
  const enquiryText =
    typeof bike.price === "number"
      ? `Hello ${site.name}, I'm interested in the ${bikeTitle(bike)} listed at ${formatPrice(bike.price)}.`
      : `Hello ${site.name}, I'm interested in the ${bikeTitle(bike)}. Could you tell me the price?`;
  const enquiry = whatsappLink(enquiryText);

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
            <BikeGallery photos={bike.photos} />

            <div className="mt-10 lg:mt-0">
              {bike.year ? <p className="eyebrow">{bike.year}</p> : null}
              <h1 className={`section-title ${bike.year ? "mt-2" : ""}`}>
                {bikeName(bike)}
              </h1>

              <p
                className={`mt-5 font-display font-medium ${
                  typeof bike.price === "number"
                    ? "text-4xl lg:text-5xl"
                    : "text-2xl lg:text-3xl"
                }`}
              >
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

              {/* WhatsApp stays the main channel; email is the fallback for
                  buyers who would rather write. */}
              <p className="mt-4 text-[0.9375rem] text-slate">
                Prefer email?{" "}
                <a
                  href={emailLink(`Enquiry — ${bikeTitle(bike)}`)}
                  className="font-medium text-navy underline underline-offset-4 hover:text-gold"
                >
                  {site.email}
                </a>
              </p>

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
            <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-2 lg:gap-7">
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
