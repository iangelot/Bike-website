import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PinIcon, WhatsAppIcon } from "@/components/icons";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Message RAGERIDE on WhatsApp to ask about a motorcycle, book a viewing, or inquire about financing.`,
};

/**
 * Contact.
 *
 * WhatsApp is the shop's channel, so this page does one thing well rather than
 * offering a form and an email that go nowhere. The primary action is a
 * pre-filled WhatsApp message; a couple of alternate openers (a specific bike,
 * financing) are offered so the buyer does not have to compose from scratch.
 *
 * Location is shown only if set in site.ts. Nothing here is invented.
 */
export default function ContactPage() {
  const openers = [
    {
      label: "Ask about a bike",
      message: `Hello ${site.name}, I'd like to ask about one of your motorcycles.`,
    },
    {
      label: "Ask about financing",
      message: `Hello ${site.name}, I'd like to ask about financing rates and current promotions.`,
    },
  ];

  return (
    <>
      <SiteHeader />
      <main>
        <section className="shell py-12 lg:py-20">
          <div className="lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-16">
            <div>
              <p className="eyebrow">Get in touch</p>
              <h1 className="section-title mt-2">Contact Us</h1>
              <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.65] text-slate lg:text-lg">
                We do everything over WhatsApp — it is the quickest way to reach
                us. Message us to ask about a motorcycle, arrange a viewing, or
                inquire about financing, and our sales staff will get straight
                back to you.
              </p>

              <div className="mt-9">
                <a
                  href={whatsappLink(
                    `Hello ${site.name}, I'd like to buy a bike.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold rounded-lg px-8 text-base"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Message us on WhatsApp
                </a>
                <p className="mt-4 font-display text-2xl font-medium">
                  {site.whatsappDisplay}
                </p>
              </div>

              {site.address ? (
                <p className="mt-8 flex items-center gap-3 text-[0.9375rem] text-slate">
                  <PinIcon className="h-5 w-5 shrink-0 text-gold" />
                  {site.address}
                </p>
              ) : null}
            </div>

            {/* Quick openers, so a buyer taps a reason instead of composing a
                message from a blank thread. */}
            <div className="mt-12 rounded-[15px] border border-line bg-white p-6 lg:mt-0 lg:p-8">
              <h2 className="font-display text-xl font-medium uppercase">
                Start a message
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
                {openers.map((opener) => (
                  <li key={opener.label}>
                    <a
                      href={whatsappLink(opener.message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 rounded-lg border border-line px-5 py-4 text-[0.9375rem] font-medium text-navy transition-colors hover:border-navy hover:bg-cream"
                    >
                      {opener.label}
                      <WhatsAppIcon className="h-5 w-5 shrink-0 text-gold" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="shell pb-16 lg:pb-24">
          <div className="rounded-[15px] bg-navy px-6 py-10 text-center lg:px-14 lg:py-12">
            <h2 className="font-display text-[2rem] font-medium leading-tight text-gold lg:text-4xl">
              Looking for something specific?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[0.9375rem] text-white/80">
              Browse the collection and message us straight from any listing —
              your message arrives with the bike already attached.
            </p>
            <Link
              href="/bikes"
              className="btn btn-gold mt-7 rounded-lg lg:px-10"
            >
              View all bikes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
