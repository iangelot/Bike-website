import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./icons";
import { bikeTitle, CARD_FOCUS, formatDistance, type Bike } from "@/lib/bikes";
import { formatPrice } from "@/lib/site";

const SIZES = "(width >= 64rem) 22vw, (width >= 40rem) 40vw, 92vw";

/**
 * A listing card: photo on one side, details on the other.
 *
 * This replaces the Figma frame's card, which laid the navy panel OVER the
 * bottom of the photo. That works for the frame's cut-out artwork — a small
 * bike floating on a mostly-empty road plate — but with real photography the
 * panel covered the part of the frame the bike actually occupies, so the
 * thing a buyer is scanning for was the thing being hidden.
 *
 * The panel now sits beside the photo instead of on it. Nothing is occluded,
 * and the details get more room than they had, which is why the model name
 * fits here and did not before.
 *
 * It stacks on phones — photo on top, panel underneath. A 400px-wide screen
 * split in two would leave a ~170px preview, which defeats the point.
 */
export function BikeCard({ bike, priority = false }: { bike: Bike; priority?: boolean }) {
  const [lead] = bike.photos;
  const distance = formatDistance(bike);

  // Make is the headline and model the line under it, but either can be
  // missing: with no make the model becomes the headline, and with neither the
  // card still needs a name to sit above the price.
  const heading = bike.make ?? bike.model ?? bikeTitle(bike);
  const subheading = bike.make ? bike.model : undefined;

  return (
    <article className="group">
      <Link
        href={`/bikes/${bike.slug}`}
        className="flex flex-col overflow-hidden rounded-card bg-navy focus-visible:outline-offset-4 sm:flex-row"
      >
        {/* Photo half. Fixed 3:2 stacked; on a row it stretches to the panel's
            height so the two halves always meet flush. */}
        <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden bg-plate sm:aspect-auto sm:min-h-[11.5rem] sm:w-[44%]">
          {lead ? (
            <Image
              src={lead.src}
              alt={lead.alt}
              fill
              priority={priority}
              sizes={SIZES}
              style={{ objectPosition: lead.focus ?? CARD_FOCUS }}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            // Photos are optional too, so the card keeps its shape instead of
            // collapsing when a listing is published before the photos land.
            <span className="absolute inset-0 grid place-items-center text-center text-[0.6875rem] font-medium uppercase tracking-wide text-navy/45">
              Photos coming soon
            </span>
          )}
        </div>

        {/* Details half. */}
        <div className="flex flex-1 items-center justify-between gap-4 px-6 py-6 text-white">
          <div className="min-w-0">
            <h3 className="truncate font-sans text-sm font-medium uppercase tracking-wide">
              {heading}
            </h3>
            {subheading ? (
              <p className="truncate text-[0.9375rem] text-white/85">{subheading}</p>
            ) : null}
            {bike.year || distance ? (
              <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[0.6875rem] font-medium text-white/70">
                {bike.year ? <span>{bike.year}</span> : null}
                {distance ? <span>{distance}</span> : null}
              </p>
            ) : null}
            {/* "Price on request" is three words where a figure is a few
                characters, so it drops a size rather than wrapping. */}
            <p
              className={`mt-2 font-display font-medium ${
                typeof bike.price === "number" ? "text-2xl" : "text-lg"
              }`}
            >
              {formatPrice(bike.price)}
            </p>
          </div>

          {/* Decorative: the whole card is already one link, so this must not
              announce itself as a second destination. */}
          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-navy transition-transform group-hover:translate-x-0.5"
          >
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </article>
  );
}
