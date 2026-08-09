import Image from "next/image";
import Link from "next/link";

/**
 * The RAGERIDE wordmark.
 *
 * Two artwork files, because the mark is not recolourable in CSS: the dark
 * version (navy script over gold) reads on cream, the light version (white
 * script over gold) reads on the navy band. Both are trimmed of their
 * transparent margin during asset optimisation so the widths below describe
 * the artwork itself rather than empty space.
 */
export function Logo({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="RAGERIDE Motorcycles — home"
      className={`inline-block ${className}`}
    >
      <Image
        src={variant === "dark" ? "/brand/logo-dark.webp" : "/brand/logo-light.webp"}
        alt="RAGERIDE Motorcycles"
        width={600}
        height={171}
        priority
        className="h-auto w-[8.5rem] lg:w-[10.5rem]"
      />
    </Link>
  );
}
