import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./icons";
import { formatKm, type Bike } from "@/lib/bikes";
import { formatPrice } from "@/lib/site";

/**
 * A listing card, built to the Figma group's geometry (node 19:76).
 *
 * In the frame the card is 360 wide and three pieces deep:
 *   • a 360×240 photo block, 13px radius, flat #d4d4d4 under the desert-road
 *     photo at 20% opacity;
 *   • the bike cut-out, 198×148, sitting 13px ABOVE the photo block so it
 *     breaks the top edge;
 *   • a 360×93 navy panel, 12px radius, flush to the bottom of the photo block.
 *
 * The photo block keeps a 3:2 ratio and everything else is positioned as a
 * percentage of it, so the whole card scales as one piece from a 360px phone
 * column to a ~430px desktop grid cell. The panel is the one exception — its
 * height comes from its own content, because a price or a make longer than the
 * design's sample would otherwise be clipped.
 */
export function BikeCard({ bike, priority = false }: { bike: Bike; priority?: boolean }) {
  return (
    <article className="group relative pt-[3.6%]">
      <Link
        href={`/bikes/${bike.slug}`}
        className="block rounded-card focus-visible:outline-offset-4"
      >
        {/* Photo block. */}
        <div className="relative aspect-[3/2] overflow-hidden rounded-card bg-plate">
          <Image
            src="/brand/card-road.webp"
            alt=""
            fill
            sizes="(width >= 64rem) 30vw, (width >= 40rem) 45vw, 92vw"
            className="object-cover opacity-20"
          />

          {/* Info panel. Overlays the bottom of the photo rather than sitting
              below it, which is what makes the road show either side of it. */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 rounded-xl bg-navy px-7 py-5 text-white">
            <div className="min-w-0">
              <h3 className="truncate font-sans text-sm font-medium uppercase tracking-wide">
                {bike.make}
              </h3>
              <p className="mt-1 flex gap-6 text-[0.6875rem] font-medium text-white/85">
                <span>{bike.year}</span>
                <span>{formatKm(bike.km)}</span>
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

        {/* Bike cut-out, breaking the top edge. Figma places it at x=71 of 360
            (19.7%) at 198 wide (55%); the frame is mirrored so the bike faces
            into the card. */}
        <div className="pointer-events-none absolute left-[19.7%] top-0 aspect-[198/148] w-[55%]">
          <Image
            src={bike.image}
            alt={bike.alt}
            fill
            priority={priority}
            sizes="(width >= 64rem) 17vw, (width >= 40rem) 25vw, 51vw"
            className="-scale-x-100 object-contain drop-shadow-[0_10px_18px_rgba(0,26,52,0.28)]"
          />
        </div>
      </Link>
    </article>
  );
}
