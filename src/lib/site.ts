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
   * The canonical address, no trailing slash.
   *
   * www is the canonical host: the apex redirects to it (308), which is how
   * the domain is set up at the host. Everything that needs an absolute URL
   * — social link previews, robots.txt, the sitemap — is built from this one
   * value, so a domain change is a one-line edit here or an env var on the
   * host. Vercel sets VERCEL_PROJECT_PRODUCTION_URL automatically, which is
   * the sensible fallback for preview deployments.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://www.rageride.shop"),

  /**
   * WhatsApp is the way to reach the shop — every contact point on the site is
   * a wa.me link, and there is deliberately no tel: link anywhere.
   *
   * International format, digits only — this is what wa.me expects.
   * Set NEXT_PUBLIC_WHATSAPP to override without a rebuild.
   */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "16082099441",

  /** Shown next to the WhatsApp link so buyers can save the contact. */
  whatsappDisplay: "+1 (608) 209-9441",

  /**
   * Secondary contact. WhatsApp stays the primary channel everywhere — this is
   * the fallback for buyers who would rather write, and for anything that
   * needs an attachment. Set NEXT_PUBLIC_CONTACT_EMAIL to override.
   */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "Rageridemotorcycles@gmail.com",

  /**
   * NOT SUPPLIED YET. Both are optional and the footer simply omits the row
   * when it is undefined — a made-up shop address is worse than a shorter
   * footer, because a visitor will actually try to use it. Fill them in and
   * the rows come back.
   */
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

/** Shown in place of a figure when a listing has no price set. */
export const PRICE_ON_REQUEST = "Price on request";

/**
 * Formats a price the same way everywhere — cards, detail pages, admin.
 *
 * A listing may have no price (the field is optional in the admin), and every
 * place that shows one still needs to show something, so an absent price
 * becomes "Price on request" rather than "$0" or a blank line.
 */
export function formatPrice(amount?: number): string {
  if (typeof amount !== "number") return PRICE_ON_REQUEST;
  return new Intl.NumberFormat(site.locale, {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** `mailto:` with the subject pre-filled, mirroring `whatsappLink`. */
export function emailLink(subject: string): string {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
}

/**
 * Builds a WhatsApp deep link with the message pre-filled. Passing the bike
 * means the seller sees which listing the buyer is asking about instead of a
 * bare "hello", which is the whole point of contacting from a listing page.
 */
export function whatsappLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
