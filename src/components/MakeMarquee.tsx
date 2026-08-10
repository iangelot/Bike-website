import Image from "next/image";

/**
 * "Exclusive Track & Motorcycles" — the manufacturer strip.
 *
 * The frame draws three marks oversized and bleeding off both edges of the
 * phone, which reads as a strip caught mid-scroll rather than a tidy row. This
 * builds that literally: the run is rendered twice inside a track that slides
 * exactly one run's width, so the seam never shows. It pauses on hover and
 * parks entirely under prefers-reduced-motion (see .marquee in globals.css).
 *
 * Each mark is boxed square with object-contain. The sources are square with
 * their own transparent padding, which is what keeps a wide mark (Honda's
 * wing) and a round one (the BMW roundel) at the same optical size.
 */
const MAKES = [
  { src: "/brand/make-honda.webp", name: "Honda" },
  { src: "/brand/make-suzuki.webp", name: "Suzuki" },
  { src: "/brand/make-bmw.webp", name: "BMW" },
];

function Run({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {MAKES.map((make) => (
        <li key={make.name} className="px-8 lg:px-14">
          <Image
            src={make.src}
            alt={hidden ? "" : make.name}
            width={320}
            height={320}
            className="size-28 object-contain lg:size-40"
          />
        </li>
      ))}
    </ul>
  );
}

export function MakeMarquee() {
  return (
    <section className="py-14 lg:py-20" aria-labelledby="makes-heading">
      <h2 id="makes-heading" className="shell section-title text-center text-gold">
        Exclusive Track &amp; Motorcycles
      </h2>

      <div className="marquee mt-10 lg:mt-14">
        <div className="marquee-track" style={{ "--marquee-duration": "28s" } as React.CSSProperties}>
          <Run />
          {/* The duplicate exists only to make the loop seamless, so it is
              hidden from assistive tech rather than read out twice. */}
          <Run hidden />
        </div>
      </div>
    </section>
  );
}
