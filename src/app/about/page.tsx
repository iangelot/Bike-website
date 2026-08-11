import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, WhatsAppIcon } from "@/components/icons";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllBikes } from "@/lib/bikes-data";
import { site, whatsappLink } from "@/lib/site";

// Reads the live "in stock" count.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "RAGERIDE Motorcycles — quality used and new bikes, inspected, ridden, and sold straight. No surprises, no hidden fees. Financing available.",
};

/**
 * About.
 *
 * Written from what is already established about the business rather than
 * invented: the brand promise ("checked, ridden, and sold straight"), the
 * vetting process, the 120+ figure (the client's own Figma copy), financing,
 * and the WhatsApp channel. Deliberately avoids specifics nobody has supplied
 * — founding year, a named owner, a showroom address — so nothing here is a
 * claim the shop would have to walk back.
 *
 * The three pillars reuse the "Why Choose" icons, tying this page to the home
 * page's section. The stock count is read live so it never goes stale.
 */
export default async function AboutPage() {
  const inStock = (await getAllBikes()).length;

  const pillars = [
    {
      icon: "/brand/icon-vetted.webp",
      title: "Every bike vetted",
      body: "Every motorcycle is thoroughly inspected and vetted to insure it is fit for safe track and road use. What you see in the photos is the bike you ride away on.",
    },
    {
      icon: "/brand/icon-trusted.webp",
      title: "Straight dealing",
      body: "Checked, ridden, and sold straight — no surprises and no hidden fees. The price on the listing is the price, and we tell you what we know about the bike.",
    },
    {
      icon: "/brand/icon-finance.webp",
      title: "Financing available",
      body: "With a small down payment and approved credit we can arrange financing on any bike in the collection, and have you on the road the same day.",
    },
  ];

  return (
    <>
      <SiteHeader />
      <main>
        {/* Intro */}
        <section className="shell py-12 lg:py-20">
          <div className="lg:grid lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow">Who we are</p>
              <h1 className="section-title mt-2">About RAGERIDE</h1>
              <div className="mt-7 max-w-2xl space-y-5 text-[1.0625rem] leading-[1.65] text-slate lg:text-lg">
                <p>
                  RAGERIDE Motorcycles buys and sells quality used and new
                  bikes — checked, ridden, and sold straight. Where passion
                  meets the ground.
                </p>
                <p>
                  We are riders first. Every motorcycle that comes through us is
                  inspected and ridden before it is listed, so the bike in the
                  photos is the bike you take home — no surprises, no hidden
                  fees. If we would not ride it ourselves, we do not sell it.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-plate">
                <Image
                  src="/bikes/yamaha-yzf-r6-2009/01-side-left.webp"
                  alt="A motorcycle from the RAGERIDE collection"
                  fill
                  priority
                  sizes="(width >= 64rem) 38vw, 92vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 60%" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="shell pb-6 lg:pb-10">
          <dl className="grid grid-cols-2 gap-4 rounded-[15px] bg-navy px-6 py-8 text-center text-white sm:grid-cols-3 lg:gap-8 lg:px-14 lg:py-10">
            <div>
              <dt className="order-2 mt-1 text-[0.8125rem] uppercase tracking-wide text-white/70">
                Bikes sold
              </dt>
              <dd className="order-1 font-display text-4xl font-medium text-gold lg:text-5xl">
                120+
              </dd>
            </div>
            <div>
              <dt className="order-2 mt-1 text-[0.8125rem] uppercase tracking-wide text-white/70">
                In stock now
              </dt>
              <dd className="order-1 font-display text-4xl font-medium text-gold lg:text-5xl">
                {inStock}
              </dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="order-2 mt-1 text-[0.8125rem] uppercase tracking-wide text-white/70">
                Hidden fees
              </dt>
              <dd className="order-1 font-display text-4xl font-medium text-gold lg:text-5xl">
                Zero
              </dd>
            </div>
          </dl>
        </section>

        {/* Pillars */}
        <section className="shell py-12 lg:py-16" aria-labelledby="about-pillars">
          <h2 id="about-pillars" className="section-title text-center">
            How we work
          </h2>
          <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-3 lg:gap-12">
            {pillars.map((pillar) => (
              <article key={pillar.title} className="text-center">
                <Image
                  src={pillar.icon}
                  alt=""
                  width={256}
                  height={256}
                  className="mx-auto size-24 object-contain"
                />
                <h3 className="mt-6 font-sans text-xl font-medium uppercase leading-tight">
                  {pillar.title}
                </h3>
                <p className="mx-auto mt-4 max-w-prose text-[0.9375rem] leading-[1.55] text-slate">
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="shell pb-16 lg:pb-24">
          <div className="rounded-[15px] bg-navy px-6 py-10 text-center lg:px-14 lg:py-12">
            <h2 className="font-display text-[2rem] font-medium leading-tight text-gold lg:text-4xl">
              Come find your next bike
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[0.9375rem] text-white/80">
              Browse the collection, or message us on WhatsApp and tell us what
              you are after — we will point you at the right bike.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/bikes" className="btn btn-gold w-full rounded-lg sm:w-auto sm:px-10">
                View all bikes
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappLink(`Hello ${site.name}, I'd like to buy a bike.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full rounded-lg border-2 border-white/40 text-white hover:bg-white hover:text-navy sm:w-auto sm:px-10"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Message us
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
