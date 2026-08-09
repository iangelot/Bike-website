/**
 * Single source of truth for business details that appear across the site.
 * Kept out of components so the shop's phone number, name or currency can be
 * changed in one place rather than hunted through JSX.
 */
export const site = {
  name: "RAGERIDE",
  fullName: "RAGERIDE MOTORCYCLES",
  tagline: "Where passion meets the ground",

  /**
   * International format, digits only — this is what wa.me expects.
   * Cameroon is +237. Set NEXT_PUBLIC_WHATSAPP to override without a rebuild.
   */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "237600000000",

  /** Currency chosen during design review: US Dollars. */
  currency: "USD",
  locale: "en-US",
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/bikes" },
  { label: "Financing", href: "/financing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** Formats a price the same way everywhere — cards, detail pages, admin. */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(site.locale, {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Builds a WhatsApp deep link with the message pre-filled. Passing the bike
 * means the seller sees which listing the buyer is asking about instead of a
 * bare "hello", which is the whole point of contacting from a listing page.
 */
export function whatsappLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
