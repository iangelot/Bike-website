import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./icons";

/**
 * Callout lines are drawn as one SVG sharing the bike image's viewBox, so each
 * line always ends on the same part of the motorcycle however the image is
 * scaled. Thin line plus a dot, per the reference mockup — the earlier fat
 * curved arrows were much heavier than the design wants.
 */
function CalloutLines() {
  return (
    <svg
      viewBox="0 0 999 618"
      fill="none"
      aria-hidden
      className="absolute inset-0 h-full w-full"
    >
      <g stroke="#2f6fe0" strokeWidth="2.5">
        {/* handling → front brake */}
        <line x1="70" y1="330" x2="250" y2="286" />
        {/* comfort → seat */}
        <line x1="905" y1="150" x2="700" y2="300" />
        {/* speed → engine block */}
        <line x1="700" y1="565" x2="560" y2="405" />
      </g>
      <g fill="#2f6fe0">
        <circle cx="70" cy="330" r="7" />
        <circle cx="905" cy="150" r="7" />
        <circle cx="700" cy="565" r="7" />
      </g>
    </svg>
  );
}

/** Small uppercase label anchored in percentages of the bike box. */
function Label({ text, className }: { text: string; className: string }) {
  return (
    <span
      className={`pointer-events-none absolute font-heading text-[0.625rem] uppercase tracking-wide text-navy lg:text-sm ${className}`}
    >
      {text}
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream pb-8">
      {/* Solid navy stripe. The road photograph sits behind it at low opacity so
          the band keeps the texture from the Figma file while reading as the
          flat navy of the reference mockup. Drop the <Image> for pure navy. */}
      <div className="road-band absolute inset-y-0 right-0 w-full bg-band">
        <Image
          src="/brand/road-band.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40 mix-blend-overlay"
        />
      </div>

      {/* Brand mark on the band — a sibling of the clipped element so the
          clip-path cannot cut it off. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
        <Image
          src="/brand/logo-light.webp"
          alt=""
          width={560}
          height={418}
          className="ml-[74%] mt-[4.5rem] w-20 lg:ml-[64%] lg:mt-12 lg:w-32"
        />
      </div>

      <div className="shell relative z-10 pt-10 lg:pt-16">
        <div className="max-w-[15rem] sm:max-w-[22rem] md:max-w-[32rem] lg:max-w-[46rem]">
          <h1 className="text-[4rem] leading-[0.92] sm:text-7xl md:text-8xl lg:text-[6.5rem]">
            Not just bikes
          </h1>
          <p className="mt-4 font-heading text-lg uppercase leading-tight sm:text-xl lg:mt-5 lg:whitespace-nowrap lg:text-[2rem]">
            Where passion meets the ground
          </p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-slate lg:mt-6 lg:max-w-md lg:text-lg">
            Quality used and new bikes, checked, ridden, and sold straight. No
            surprises, no hidden fees.
          </p>
          <Link
            href="/bikes"
            className="btn btn-primary mt-7 gap-4 px-7 py-4 text-[0.8125rem] tracking-wide lg:mt-9 lg:text-[0.9375rem]"
          >
            VIEW ALL MOTORCYCLES
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Bike, callout lines and labels share one box so they scale together. */}
      <div className="relative z-10 mt-6 lg:-mt-44">
        <div className="relative mx-auto aspect-[999/618] w-[115%] max-w-none translate-x-[14%] lg:w-[72%] lg:translate-x-[18%]">
          <Image
            src="/brand/hero-bike.webp"
            alt="Honda sports motorcycle in black, side view"
            fill
            priority
            sizes="(max-width: 1024px) 115vw, 72vw"
            className="object-contain"
          />
          <CalloutLines />

          <Label text="Handling" className="-left-[8%] top-[45%] -translate-y-7 lg:left-[2%]" />
          <Label text="Comfort" className="right-[34%] top-[18%] -translate-y-7 text-white lg:right-[6%] lg:text-navy" />
          <Label text="Speed" className="left-[62%] top-[93%] lg:left-[66%]" />
        </div>
      </div>

      {/* Social-proof card, as a card rather than the old outlined pill. */}
      <div className="shell relative z-10 mt-2 lg:absolute lg:bottom-10 lg:left-0 lg:mt-0 lg:max-w-md">
        <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-3 shadow-[0_10px_30px_rgba(0,26,52,0.10)]">
          <Image
            src="/brand/bike-red.webp"
            alt=""
            width={480}
            height={359}
            className="w-16 shrink-0 lg:w-20"
          />
          <span className="flex-1 font-heading text-xs uppercase tracking-wide lg:text-sm">
            +150 bikes sold
          </span>
          <span className="h-8 w-px bg-line" aria-hidden />
          <ArrowRight className="h-5 w-5 shrink-0 text-navy" />
        </div>
      </div>

      {/* Scroll cue from the mockup. */}
      <div className="relative z-10 mt-6 flex justify-center lg:absolute lg:bottom-4 lg:left-1/2 lg:mt-0 lg:-translate-x-1/2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className="h-6 w-6 text-navy"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
