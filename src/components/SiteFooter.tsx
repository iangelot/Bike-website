import Image from "next/image";
import Link from "next/link";
import {
  MailIcon,
  PinIcon,
  SocialIcon,
  WhatsAppIcon,
} from "./icons";
import { nav, site, socials, whatsappLink, smsLink } from "@/lib/site";
import { PhoneIcon } from "./icons";

/**
 * The Figma footer is a 483px navy block containing nothing but the light
 * wordmark, so its contents were designed here rather than read off the file:
 * the mark and a line of positioning, then a column of page links and a column
 * of contact details, closing on a thin rule and a copyright bar.
 *
 * Everything under "Contact" comes from site.ts — WhatsApp first, then the
 * email as the secondary channel, then the address. Each row is dropped when
 * its value is unset, so the layout does not change when the remaining details
 * land.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div className="shell grid gap-12 py-14 lg:grid-cols-[1.4fr_1fr_1.2fr] lg:gap-16 lg:py-20">
        <div>
          <Link href="/" aria-label={`${site.fullName} — home`} className="inline-block">
            <Image
              src="/brand/logo-light.webp"
              alt={site.fullName}
              width={600}
              height={170}
              className="h-auto w-[11.5rem]"
            />
          </Link>
          <p className="mt-6 max-w-xs text-[0.9375rem] leading-[1.6] text-white/75">
            {site.tagline}. Quality used and new bikes, checked, ridden, and sold
            straight — no surprises, no hidden fees.
          </p>

          {socials.length > 0 ? (
            <ul className="mt-7 flex gap-3">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${site.name} on ${social.label}`}
                    className="grid size-10 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-gold hover:text-gold"
                  >
                    <SocialIcon name={social.icon} />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-xl font-medium uppercase text-gold">
            Explore
          </h2>
          <ul className="mt-5 flex flex-col gap-3.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[0.9375rem] text-white/80 underline-offset-4 transition-colors hover:text-gold hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-xl font-medium uppercase text-gold">
            Contact
          </h2>
          <ul className="mt-5 flex flex-col gap-3.5 text-[0.9375rem] text-white/80">
            {/* WhatsApp link, not a tel: link — the number is used for
                messaging rather than voice. See the note in site.ts. */}
            <li>
              <a
                href={whatsappLink(`Hello ${site.name}, I'd like to buy a bike.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 underline-offset-4 transition-colors hover:text-gold hover:underline"
              >
                <WhatsAppIcon className="h-[1.125rem] w-[1.125rem] shrink-0 text-gold" />
                {site.whatsappDisplay}
              </a>
            </li>
            {/* SMS as an alternate messaging channel */}
            <li>
              <a
                href={smsLink(`Hello ${site.name}, I'd like to buy a bike.`)}
                className="flex items-center gap-3 underline-offset-4 transition-colors hover:text-gold hover:underline"
              >
                <PhoneIcon className="h-[1.125rem] w-[1.125rem] shrink-0 text-gold" />
                {site.smsDisplay}
              </a>
            </li>
            {site.email ? (
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-3 underline-offset-4 transition-colors hover:text-gold hover:underline"
                >
                  <MailIcon className="h-[1.125rem] w-[1.125rem] shrink-0 text-gold" />
                  {site.email}
                </a>
              </li>
            ) : null}
            {site.address ? (
              <li className="flex items-start gap-3">
                <PinIcon className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-gold" />
                <span>
                  {site.address}
                  {site.hours ? (
                    <>
                      <br />
                      <span className="text-white/60">{site.hours}</span>
                    </>
                  ) : null}
                </span>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/12">
        <div className="shell flex flex-col gap-2 py-6 text-[0.8125rem] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.fullName}. All rights reserved.
          </p>
          <p>{site.tagline}.</p>
        </div>
      </div>
    </footer>
  );
}
