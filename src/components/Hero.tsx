import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./icons";

/**
 * Curved pointer drawn from a label toward the bike. The Figma arrows were
 * loose vectors sitting outside the desktop frame — which is why they never
 * appeared in that export — so they are re-authored here as SVG that scales.
 */
function Pointer({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 80 48"
      fill="none"
      aria-hidden
      className={`h-5 w-9 shrink-0 lg:h-10 lg:w-16 ${flip ? "-scale-x-100" : ""}`}
    >
      <path
        d="M2 4C22 4 46 12 66 38"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M56 34l12 6-4-12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * A label anchored in percentages of the bike box rather than pixels, so the
 * pointer keeps aiming at the same part of the motorcycle at every width.
 */
function Annotation({
  label,
  side,
  className,
  tone = "dark",
}: {
  label: string;
  side: "left" | "right";
  className: string;
  /** Labels that land on the navy band need light type to stay readable. */
  tone?: "dark" | "light";
}) {
  return (
    <div
      className={`pointer-events-none absolute flex items-center gap-1 ${
        tone === "light" ? "text-white" : "text-navy"
      } ${className}`}
    >
      {side === "right" && <Pointer flip />}
      <span className="font-heading text-[0.625rem] uppercase tracking-wide lg:text-xl">
        {label}
      </span>
      {side === "left" && <Pointer />}
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 lg:pb-6">
      {/* Angled road band, running to the very top of the page and past the
          bottom edge, clipped by the section. */}
      <div className="road-band absolute -top-[2%] bottom-[-12%] right-0 w-[52%] sm:w-[46%] lg:w-[42%]">
        <Image
          src="/brand/road-band.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 52vw, 42vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy/65" />
      </div>

      {/* Brand mark on the band. Deliberately a sibling of the clipped element:
          when it lived inside, the clip-path cut it off — the "going high up
          and not even seen" problem. Offsets are relative to the band's own
          box so it stays centred in the visible part at every width. */}
      <div className="pointer-events-none absolute right-0 top-0 z-20 w-[52%] sm:w-[46%] lg:w-[42%]">
        <Image
          src="/brand/logo-light.webp"
          alt=""
          width={560}
          height={418}
          className="ml-[42%] mt-16 w-[4.5rem] lg:ml-[45%] lg:mt-5 lg:w-28"
        />
      </div>

      {/* Text column is deliberately narrow at small sizes so it can never run
          underneath the band. Top padding clears the overlaid header. */}
      <div className="shell relative z-10 pt-24 lg:pt-32">
        <div className="max-w-[13.5rem] sm:max-w-[20rem] md:max-w-[32rem] lg:max-w-[56rem]">
          <h1 className="text-[2.375rem] sm:text-5xl md:text-6xl lg:text-[5.5rem]">
            Not just bikes
          </h1>
          <p className="mt-3 font-heading text-base uppercase leading-tight sm:text-xl lg:mt-4 lg:whitespace-nowrap lg:text-[2.15rem]">
            Where passion meets the ground
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate lg:mt-6 lg:max-w-md lg:text-lg">
            Quality used and new bikes, checked, ridden, and sold straight. No
            surprises, no hidden fees.
          </p>
          <Link href="/bikes" className="btn btn-primary mt-6 text-[0.8125rem] lg:mt-8 lg:text-[0.9375rem]">
            View all motorcycles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Bike and its annotations share one box, so labels travel with it. */}
      <div className="relative z-10 mt-3 lg:-mt-40">
        <div className="relative mx-auto aspect-[999/618] w-[95%] max-w-none translate-x-[12%] lg:w-[76%] lg:translate-x-[20%]">
          <Image
            src="/brand/hero-bike.webp"
            alt="Honda sports motorcycle in black, side view"
            fill
            priority
            sizes="(max-width: 1024px) 95vw, 76vw"
            className="object-contain"
          />

          <Annotation
            label="Comfort"
            side="right"
            tone="light"
            className="left-[54%] top-[1%] lg:left-[70%] lg:top-[2%]"
          />
          <Annotation
            label="Handling"
            side="left"
            className="-left-[13%] top-[52%] lg:-left-[9%] lg:top-[46%]"
          />
          <Annotation
            label="Speed"
            side="right"
            tone="light"
            className="left-[50%] top-[94%] lg:left-[74%] lg:top-[88%]"
          />
        </div>
      </div>

      {/* Social proof pill. Absolute on desktop so it fills the empty lower-left
          of the composition instead of adding height below the bike. */}
      <div className="shell relative z-10 mt-6 lg:absolute lg:bottom-12 lg:left-0 lg:mt-0">
        <div className="inline-flex items-center gap-3 rounded-pill border-[2.5px] border-navy bg-cream px-4 py-2.5">
          <span className="flex items-center">
            <Image src="/brand/bike-red.webp" alt="" width={480} height={359} className="w-9 lg:w-12" />
            <Image src="/brand/hero-bike.webp" alt="" width={999} height={618} className="-ml-3 w-9 lg:w-12" />
            <Image src="/brand/bike-blue.webp" alt="" width={480} height={289} className="-ml-3 w-9 lg:w-12" />
          </span>
          <span className="font-heading text-[0.6875rem] uppercase tracking-wide lg:text-sm">
            +150 bikes sold
          </span>
        </div>
      </div>
    </section>
  );
}
