import Link from "next/link";

/**
 * The RAGERIDE wordmark.
 *
 * The logo file exported from Figma is white-on-transparent, so it only reads
 * on dark surfaces — which is why the design tucks it inside the navy band.
 * On cream we need a dark version, and no dark asset exists in the file yet,
 * so the wordmark is set in type here: Anton for RAGERIDE, Archivo Black for
 * MOTORCYCLES, over the gold rule from the original mark.
 *
 * Swap in a real dark PNG/SVG later by rendering it for variant="dark".
 */
export function Logo({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const primary = variant === "dark" ? "text-navy" : "text-white";

  return (
    <Link
      href="/"
      aria-label="RAGERIDE Motorcycles — home"
      className={`inline-block leading-none ${className}`}
    >
      <span
        className={`block font-display text-2xl tracking-wide italic ${primary}`}
      >
        RAGERIDE
      </span>
      <span className="block font-heading text-[0.6875rem] tracking-[0.22em] text-gold">
        MOTORCYCLES
      </span>
      <span className="mt-1 block h-[3px] w-full bg-gold" aria-hidden />
    </Link>
  );
}
