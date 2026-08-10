import Image from "next/image";
import Link from "next/link";

/**
 * Closing call to action.
 *
 * Mobile is the frame's card verbatim: navy, 15px radius, gold title, three
 * gold-bulleted pillars, gold button. Desktop splits it into two columns and
 * fills the right-hand side with the red bike cut-out — at 1440 the card is
 * otherwise 300px of empty navy either side of a short list.
 */
const PILLARS = ["Vetted Listings", "Industry Trusted", "Finance Available"];

export function BuyCta() {
  return (
    <section className="shell pb-16 pt-6 lg:pb-24 lg:pt-10">
      <div className="relative overflow-hidden rounded-[15px] bg-navy px-6 py-10 lg:grid lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-center lg:gap-10 lg:px-14 lg:py-14">
        <div className="text-center lg:text-left">
          <h2 className="font-display text-[2rem] font-medium leading-[0.85] text-gold lg:text-5xl lg:leading-[0.9]">
            Want To Buy A Bike ?
          </h2>

          {/* Left-aligned even though the title above is centred — that is how
              the frame sets it, and a centred bullet list reads as a poster
              rather than a list of claims. */}
          <ul className="mt-8 flex flex-col gap-5 text-left lg:mt-10">
            {PILLARS.map((pillar) => (
              <li key={pillar} className="flex items-center gap-6">
                <span aria-hidden className="size-5 shrink-0 rounded-full bg-gold" />
                <span className="text-base text-white">{pillar}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 lg:mt-10">
            <Link
              href="/contact"
              className="btn btn-gold w-full rounded-lg lg:w-auto lg:px-16"
            >
              Contact Us!
            </Link>
          </div>
        </div>

        {/* Desktop only: the mobile card has no room for it, and it carries no
            information the list does not already give. */}
        <div className="pointer-events-none relative mt-10 hidden aspect-[900/672] lg:mt-0 lg:block">
          <Image
            src="/brand/bike-red.webp"
            alt=""
            fill
            sizes="26rem"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
