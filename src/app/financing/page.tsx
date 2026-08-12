import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, WhatsAppIcon } from "@/components/icons";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Financing",
  description:
    "Arrange credit financing with RAGERIDE. With a minimum down payment and approved credit you can be on the road a few hours after picking out your motorcycle.",
  alternates: { canonical: "/financing" },
};

/**
 * Financing.
 *
 * Copy is adapted from the client's original — same facts (70% of buyers
 * finance, minimum down payment, approved credit, on the road within hours),
 * tightened, and pointing at WhatsApp rather than the "call or email" the
 * original invited, since neither of those channels exists.
 */
export default function FinancingPage() {
  const enquiry = whatsappLink(
    `Hello ${site.name}, I'd like to ask about financing rates and current promotions.`,
  );

  return (
    <>
      <SiteHeader />
      <main>
        <section className="shell py-12 lg:py-20">
          <div className="lg:grid lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow">Approved credit</p>
              <h1 className="section-title mt-2">Financing</h1>

              <div className="mt-7 max-w-2xl space-y-5 text-[1.0625rem] leading-[1.65] text-slate lg:text-lg">
                <p>
                  Thinking about financing your next motorcycle? You&apos;re in
                  good company — most of our buyers do exactly that.
                </p>
                <p>
                  With a small down payment and approved credit, we can arrange
                  financing on any new or pre-owned bike in our collection — and
                  have you on the road the same day you pick it out. Message us
                  on WhatsApp to check today&apos;s rates and any current
                  promotions.
                </p>
              </div>
            </div>

            <div className="mt-12 lg:mt-0">
              <Image
                src="/brand/icon-finance.webp"
                alt=""
                width={256}
                height={256}
                className="mx-auto size-48 object-contain lg:size-64"
              />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-navy py-14 lg:py-20">
          <Image
            src="/brand/night-road.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-[0.28]"
          />

          <div className="shell relative text-center">
            <h2 className="section-title text-gold">
              Ask About <span className="text-white">Rates</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[0.9375rem] leading-[1.6] text-white/80 lg:text-base">
              Message our sales staff and we will come back to you with current
              financing rates and promotions.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={enquiry}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold w-full rounded-lg sm:w-auto sm:px-10"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Ask about financing
              </a>
              <Link
                href="/bikes"
                className="btn w-full rounded-lg border-2 border-white/40 text-white hover:bg-white hover:text-navy sm:w-auto sm:px-10"
              >
                Browse the collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
