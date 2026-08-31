"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { nav, site, whatsappLink, smsLink } from "@/lib/site";
import { MessageIcon } from "./icons";

/**
 * Overlays the hero rather than stacking above it, so the angled road band can
 * run to the very top of the page with the navigation sitting over it — which
 * is how the Figma desktop frame is composed.
 *
 * Desktop follows the design: nav on the left, no wordmark here, because the
 * brand mark lives in the band top-right. Mobile keeps its own dark wordmark
 * top-left, again as designed.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-line bg-cream">
      <div className="shell flex items-center justify-between gap-6 py-4">
        <Logo />

        <nav className="hidden items-center gap-10 lg:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.9375rem] uppercase tracking-wide text-navy transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={whatsappLink(`Hello ${site.name}, I'd like to buy a bike.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary px-7 uppercase"
          >
            Buy
          </a>
          <a
            href={smsLink(`Hello ${site.name}, I'd like to buy a bike.`)}
            className="btn btn-outline ml-3 hidden md:inline-block"
          >
            <span className="flex items-center gap-2">
              <MessageIcon className="h-4 w-4" />
              <span>SMS</span>
            </span>
          </a>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <a
            href={whatsappLink(`Hello ${site.name}, I'd like to buy a bike.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary px-6 py-2.5 text-[0.8125rem]"
          >
            BUY
          </a>
          <a href={smsLink(`Hello ${site.name}, I'd like to buy a bike.`)} className="btn btn-outline px-3 py-2 text-[0.8125rem] ml-2">
            <MessageIcon className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px]"
          >
          <span
            className={`block h-[3px] w-7 rounded-full bg-navy transition-transform ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[3px] w-7 rounded-full bg-navy transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[3px] w-7 rounded-full bg-navy transition-transform ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="shell bg-cream pb-6 shadow-lg lg:hidden"
        >
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-4 font-medium text-lg uppercase text-navy"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={whatsappLink(`Hello ${site.name}, I'd like to buy a bike.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold mt-5 w-full"
          >
            Message us on WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
