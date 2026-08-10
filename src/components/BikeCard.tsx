import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./icons";
import { CARD_FOCUS, formatDistance, type Bike } from "@/lib/bikes";
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
 *
 * Cut-outs keep their road plate inside the photo half, so the sample entries
 * still look deliberate next to photographed stock.
 */
export function BikeCard({ bike, priority = false }: { bike: Bike; priority?: boolean }) {
  const [lead] = bike.photos;

  return (
    <article className="group">
      <Link
        href={`/bikes/${bike.slug}`}
        className="flex flex-col overflow-hidden rounded-card bg-navy focus-visible:outline-offset-4 sm:flex-row"
      >
        {/* Photo half. Fixed 3:2 stacked; on a row it stretches to the panel's
            height so the two halves always meet flush. */}
        <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden bg-plate sm:aspect-auto sm:min-h-[11.5rem] sm:w-[44%]">
          {bike.cutout ? (
            <>
              <Image
                src="/brand/card-road.webp"
                alt=""
                fill
                sizes={SIZES}
                className="object-cover opacity-20"
              />
              <Image
                src={lead.src}
                alt={lead.alt}
                fill
                priority={priority}
                sizes={SIZES}
                className="-scale-x-100 object-contain p-4 drop-shadow-[0_8px_16px_rgba(0,26,52,0.25)]"
              />
            </>
          ) : (
            <Image
              src={lead.src}
              alt={lead.alt}
              fill
              priority={priority}
              sizes={SIZES}
              style={{ objectPosition: lead.focus ?? CARD_FOCUS }}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          )}
        </div>

        {/* Details half. */}
        <div className="flex flex-1 items-center justify-between gap-4 px-6 py-6 text-white">
          <div className="min-w-0">
            <h3 className="truncate font-sans text-sm font-medium uppercase tracking-wide">
              {bike.make}
            </h3>
            <p className="truncate text-[0.9375rem] text-white/85">{bike.model}</p>
            <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[0.6875rem] font-medium text-white/70">
              <span>{bike.year}</span>
              <span>{formatDistance(bike)}</span>
            </p>
            <p className="mt-2 font-display text-2xl font-medium">
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
