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
   * WhatsApp is the ONLY way to reach the shop — the number does not take
   * voice calls, so there is deliberately no tel: link anywhere on the site.
   * Printing a callable number would send buyers to a line nobody answers.
   *
   * International format, digits only — this is what wa.me expects.
   * Set NEXT_PUBLIC_WHATSAPP to override without a rebuild.
   */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "16082099441",

  /** Shown next to the WhatsApp link so buyers can save the contact. */
  whatsappDisplay: "+1 (608) 209-9441",

  /**
   * NOT SUPPLIED YET. Every one of these is optional and the footer simply
   * omits the row when it is undefined — a made-up shop address or an email
   * nobody reads is worse than a shorter footer, because a visitor will
   * actually try to use it. Fill them in and the rows come back.
   */
  email: undefined as string | undefined,
  address: undefined as string | undefined,
  hours: undefined as string | undefined,

  /** US Dollars — the shop and its stock are US-based. */
  currency: "USD",
  locale: "en-US",
} as const;

export type Social = {
  label: string;
  href: string;
  icon: "instagram" | "facebook" | "tiktok";
};

/**
 * Social profiles. Empty until the real handles arrive — the footer drops the
 * whole icon row rather than linking to profiles that may not exist or, worse,
 * may belong to someone else. Add an entry and its icon appears.
 */
export const socials: Social[] = [];

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
