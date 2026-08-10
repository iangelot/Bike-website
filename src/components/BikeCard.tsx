import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./icons";
import { CARD_FOCUS, formatDistance, type Bike } from "@/lib/bikes";
import { formatPrice } from "@/lib/site";

const SIZES = "(width >= 64rem) 30vw, (width >= 40rem) 45vw, 92vw";

/**
 * A listing card.
 *
 * The photo block, the 13px radius and the navy panel overlaying its bottom
 * are the Figma card's geometry (node 19:76). What sits inside the block
 * depends on the artwork:
 *
 *   • A cut-out — a bike on transparent, as the Figma frame draws it — floats
 *     over the desert-road plate at 20% and breaks the top edge of the card.
 *   • A photograph fills the block edge to edge. There is no plate to float
 *     over, and cropping a real photo to sit inside one looks like a mistake.
 *
 * Both keep the same outer shape, so a grid mixing the two still reads as one
 * set of cards.
 */
export function BikeCard({ bike, priority = false }: { bike: Bike; priority?: boolean }) {
  const [lead] = bike.photos;

  return (
    // The top padding is the space a cut-out needs to break the card's top
    // edge. It is reserved on every card, not just cut-out ones, so that a grid
    // mixing photographs and cut-outs still lines their photo blocks up.
    <article className="group relative pt-[3.6%]">
      <Link
        href={`/bikes/${bike.slug}`}
        className="block rounded-card focus-visible:outline-offset-4"
      >
        <div className="relative aspect-[3/2] overflow-hidden rounded-card bg-plate">
          {bike.cutout ? (
            <Image
              src="/brand/card-road.webp"
              alt=""
              fill
              sizes={SIZES}
              className="object-cover opacity-20"
            />
          ) : (
            <Image
              src={lead.src}
              alt={lead.alt}
              fill
              priority={priority}
              sizes={SIZES}
              style={{ objectPosition: lead.focus ?? CARD_FOCUS }}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}

          {/* Info panel. Overlays the bottom of the photo rather than sitting
              below it, which is what makes the image show either side of it. */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 rounded-xl bg-navy px-7 py-5 text-white">
            <div className="min-w-0">
              <h3 className="truncate font-sans text-sm font-medium uppercase tracking-wide">
                {bike.make}
              </h3>
              <p className="mt-1 flex gap-6 text-[0.6875rem] font-medium text-white/85">
                <span>{bike.year}</span>
                <span>{formatDistance(bike)}</span>
              </p>
              <p className="mt-1 font-display text-xl font-medium">
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
        </div>

        {/* Cut-outs only: the artwork breaking the top edge. Figma places it at
            x=71 of 360 (19.7%) at 198 wide (55%), mirrored to face inward. */}
        {bike.cutout ? (
          <div className="pointer-events-none absolute left-[19.7%] top-0 aspect-[198/148] w-[55%]">
            <Image
              src={lead.src}
              alt={lead.alt}
              fill
              priority={priority}
              sizes="(width >= 64rem) 17vw, (width >= 40rem) 25vw, 51vw"
              className="-scale-x-100 object-contain drop-shadow-[0_10px_18px_rgba(0,26,52,0.28)]"
            />
          </div>
        ) : null}
      </Link>
    </article>
  );
}
