import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./icons";

/**
 * The hero is two separate compositions rather than one responsive layout.
 *
 * The Figma file contains a 1440 desktop frame and a 402 iPhone frame whose
 * elements sit at unrelated coordinates, so trying to interpolate one into the
 * other is what produced the earlier misalignment. Each is built to its own
 * frame's numbers instead.
 *
 * Band treatment is taken from the Figma layer rather than estimated: the road
 * photograph at full opacity beneath a rgba(0,26,52,0.65) navy fill.
 */

const BAND_OVERLAY = "bg-[rgba(0,26,52,0.65)]";

/* ------------------------------------------------------------------ mobile */

/**
 * Mobile hero, laid out in the Figma iPhone frame's own coordinate space:
 * 402 wide by 608 tall (the frame's y=59..667, below the header).
 *
 * Every position is a percentage of that box and every type size is a fraction
 * of the viewport width, so the whole composition scales as one piece exactly
 * as it does in Figma — which is what keeps the labels on their arrows.
 */

/** px in the 402-wide frame → viewport width units, capped so it stops growing. */
const fig = (px: number, maxRem: number) =>
  `min(${((px / 402) * 100).toFixed(2)}vw, ${maxRem}rem)`;

function MobileCallouts() {
  return (
    <svg
      viewBox="0 0 402 608"
      fill="none"
      aria-hidden
      className="absolute inset-0 h-full w-full"
    >
      <g stroke="#001a34" strokeWidth="1.5">
        <line x1="86" y1="430" x2="150" y2="461" />
        <line x1="350" y1="334" x2="308" y2="372" />
        <line x1="332" y1="537" x2="274" y2="461" />
      </g>
      <g fill="#001a34">
        <circle cx="150" cy="461" r="4" />
        <circle cx="308" cy="372" r="4" />
        <circle cx="274" cy="461" r="4" />
      </g>
    </svg>
  );
}

function HeroMobile() {
  const label = {
    fontSize: fig(11, 1),
    letterSpacing: "0.02em",
  } as const;

  /* Plain navy type, no backing plate — as the Figma draws it. */
  const chip = "absolute font-heading uppercase text-navy";

  return (
    <section className="relative overflow-hidden bg-cream lg:hidden">
      <div className="relative w-full" style={{ aspectRatio: "402 / 608" }}>
        {/* Band: photo at full strength under a 65% navy fill, per Figma. */}
        <div className="road-band absolute inset-0">
          <Image
            src="/brand/road-band.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className={`absolute inset-0 ${BAND_OVERLAY}`} />
        </div>

        {/* Brand mark, centred in the band: Figma x=294 w=88 on a 402 frame. */}
        <Image
          src="/brand/logo-light.webp"
          alt=""
          width={600}
          height={171}
          className="absolute"
          style={{ left: "73.1%", top: "3.8%", width: "21.9%" }}
        />

        <h1
          className="absolute text-navy"
          style={{
            left: "5.72%",
            top: "5.6%",
            fontSize: fig(48, 4),
            lineHeight: 1.06,
          }}
        >
          Not just
          <br />
          bikes
        </h1>

        <p
          className="absolute font-heading uppercase text-navy"
          style={{
            left: "5.72%",
            top: "25.7%",
            fontSize: fig(15, 1.25),
            lineHeight: 1.53,
          }}
        >
          Where passion meets
          <br />
          the ground
        </p>

        <p
          className="absolute text-slate"
          style={{
            left: "5.72%",
            top: "34%",
            width: "55%",
            fontSize: fig(11, 0.95),
            lineHeight: 1.18,
          }}
        >
          Quality used and new bikes, checked, ridden, and sold straight. No
          surprises, no hidden fees.
        </p>

        {/* Figma draws this button 23px tall. That is below the 44px minimum
            touch target, so the height is raised while the width is kept. */}
        <Link
          href="/bikes"
          className="btn btn-primary absolute"
          style={{
            left: "5.72%",
            top: "45%",
            width: "49.5%",
            fontSize: fig(11, 0.95),
            paddingInline: "1rem",
          }}
        >
          VIEW ALL MOTORCYCLES
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        {/* Bike: Figma x=77 y=357 w=369 h=228. */}
        <div
          className="absolute"
          style={{ left: "19.2%", top: "49%", width: "91.8%", height: "37.5%" }}
        >
          <Image
            src="/brand/hero-bike.webp"
            alt="Honda sports motorcycle in black, side view"
            fill
            priority
            sizes="92vw"
            className="object-contain"
          />
        </div>

        <MobileCallouts />

        <span className={chip} style={{ ...label, left: "1.5%", top: "66.6%" }}>
          Handling
        </span>
        <span className={chip} style={{ ...label, left: "79.5%", top: "49.7%" }}>
          Comfort
        </span>
        <span className={chip} style={{ ...label, left: "78.9%", top: "86.7%" }}>
          Speed
        </span>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- desktop */

function DesktopCallouts() {
  return (
    <svg
      viewBox="0 0 999 618"
      fill="none"
      aria-hidden
      className="absolute inset-0 h-full w-full"
    >
      <g stroke="#001a34" strokeWidth="2">
        {/* handling → front brake */}
        <line x1="70" y1="330" x2="250" y2="286" />
        {/* comfort → seat */}
        <line x1="820" y1="150" x2="700" y2="300" />
        {/* speed → engine block */}
        <line x1="700" y1="565" x2="560" y2="405" />
      </g>
      <g fill="#001a34">
        <circle cx="250" cy="286" r="6" />
        <circle cx="700" cy="300" r="6" />
        <circle cx="560" cy="405" r="6" />
      </g>
    </svg>
  );
}

/**
 * Labels sit at the outer end of their own line, vertically centred on it, and
 * carry the same cream chip as the mobile ones — SPEED in particular lands on
 * the black rear tyre, where plain navy type disappears.
 */
function DesktopLabel({ text, className }: { text: string; className: string }) {
  return (
    <span
      className={`pointer-events-none absolute -translate-y-1/2 rounded-[3px] bg-cream/95 px-2 py-1 font-heading text-sm uppercase tracking-wide text-navy ${className}`}
    >
      {text}
    </span>
  );
}

function HeroDesktop() {
  return (
    <section className="relative hidden overflow-hidden bg-cream pb-6 lg:block">
      <div className="road-band absolute inset-y-0 right-0 w-full">
        <Image
          src="/brand/road-band.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className={`absolute inset-0 ${BAND_OVERLAY}`} />
      </div>

      {/* Brand mark centred in the band's visible width at its own height. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
        <Image
          src="/brand/logo-light.webp"
          alt=""
          width={600}
          height={171}
          className="ml-[67%] mt-12 w-32"
        />
      </div>

      <div className="shell relative z-10 pt-16">
        <div className="max-w-[46rem]">
          <h1 className="text-[6.5rem] leading-[0.92]">Not just bikes</h1>
          <p className="mt-5 whitespace-nowrap font-heading text-[2rem] uppercase leading-tight">
            Where passion meets the ground
          </p>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate">
            Quality used and new bikes, checked, ridden, and sold straight. No
            surprises, no hidden fees.
          </p>
          <Link
            href="/bikes"
            className="btn btn-primary mt-9 gap-4 px-7 py-4 tracking-wide"
          >
            VIEW ALL MOTORCYCLES
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="relative z-10 -mt-44">
        <div className="relative mx-auto aspect-[999/618] w-[72%] max-w-none translate-x-[18%]">
          <Image
            src="/brand/hero-bike.webp"
            alt="Honda sports motorcycle in black, side view"
            fill
            priority
            sizes="72vw"
            className="object-contain"
          />
          <DesktopCallouts />

          <DesktopLabel text="Handling" className="right-[94%] top-[53.4%]" />
          <DesktopLabel text="Comfort" className="left-[83.1%] top-[24.3%]" />
          <DesktopLabel text="Speed" className="left-[71.1%] top-[91.4%]" />
        </div>
      </div>

      {/* Fills the empty lower-left of the composition. Positioned against the
          section, not inside .shell — that centres its own max-width. */}
      <div className="absolute bottom-10 left-12 z-10">
        <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-3 shadow-[0_10px_30px_rgba(0,26,52,0.10)]">
          <Image
            src="/brand/bike-red.webp"
            alt=""
            width={480}
            height={359}
            className="w-20 shrink-0"
          />
          <span className="font-heading text-sm uppercase tracking-wide">
            +150 bikes sold
          </span>
        </div>
      </div>
    </section>
  );
}

export function Hero() {
  return (
    <>
      <HeroMobile />
      <HeroDesktop />
    </>
  );
}
