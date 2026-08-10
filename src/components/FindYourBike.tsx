import Image from "next/image";
import { getMakes } from "@/lib/bikes";

/**
 * Full-bleed navy band with the night-rider photo behind it at 28% (both taken
 * from Figma node 26:75), carrying a white search card.
 *
 * It is a plain GET form pointed at /bikes, so it needs no client JavaScript
 * and degrades to a normal link-with-query-string. The frame only draws one
 * control — the make filter — so that is all this ships; year and price
 * filters belong on the collection page where there is room to do them
 * justice.
 */
export function FindYourBike() {
  const makes = getMakes();

  return (
    <section className="relative overflow-hidden bg-navy py-14 lg:py-20">
      <Image
        src="/brand/night-road.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.28]"
      />

      <div className="shell relative">
        {/* The glyph is inline rather than a flex sibling so it stays on the
            same line as "Bike" and wraps with it, the way the frame draws it.
            It is the hero cut-out knocked out to a silhouette — brightness-0
            flattens it to black, invert lifts it to white. */}
        <h2 className="section-title text-gold lg:text-center">
          Find Your <span className="text-white">Perfect</span>{" "}
          {/* Glyph and the word it trails are one unwrappable unit, so a narrow
              phone breaks before "Bike" rather than orphaning the bike on a
              line of its own. */}
          <span className="whitespace-nowrap">
            Bike{" "}
            <Image
              src="/brand/hero-bike.webp"
              alt=""
              width={999}
              height={618}
              className="inline-block h-7 w-auto translate-y-[-0.15em] brightness-0 invert lg:h-12"
            />
          </span>
        </h2>

        <form
          action="/bikes"
          method="get"
          className="mx-auto mt-7 max-w-3xl rounded-3xl bg-white p-4 shadow-[0_18px_40px_rgba(0,0,0,0.25)] sm:flex sm:items-center sm:gap-4 sm:p-5 lg:mt-10"
        >
          <div className="relative sm:flex-1">
            <label htmlFor="make" className="sr-only">
              Filter by make
            </label>
            <select
              id="make"
              name="make"
              defaultValue=""
              className="w-full appearance-none rounded-[17px] border-[0.5px] border-navy bg-white px-5 py-3.5 text-base font-medium text-[#484848] shadow-[0_4px_4px_rgba(0,0,0,0.18)]"
            >
              <option value="">All Makes</option>
              {makes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
            {/* Solid triangle, matching the polygon in the frame. */}
            <svg
              viewBox="0 0 22 12"
              aria-hidden
              className="pointer-events-none absolute right-5 top-1/2 h-3 w-5 -translate-y-1/2 fill-navy"
            >
              <path d="M0 0h22L11 12z" />
            </svg>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-4 w-full rounded-2xl py-5 font-display text-xl font-medium sm:mt-0 sm:w-auto sm:px-16"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
