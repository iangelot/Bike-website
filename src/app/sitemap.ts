import type { MetadataRoute } from "next";
import { getAllBikes } from "@/lib/bikes-data";
import { nav, site } from "@/lib/site";

/**
 * Serves /sitemap.xml — the five public pages plus one entry per listing.
 *
 * Built per request rather than at build time, because listings are added and
 * deleted from the admin panel: a sitemap baked at deploy would advertise
 * bikes that have since sold and miss every bike added since. The reads go
 * through the same `getAllBikes` the pages use, so it can never disagree with
 * what the site actually shows. /admin is deliberately absent (see robots.ts).
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const bikes = await getAllBikes();
  const now = new Date();

  const pages: MetadataRoute.Sitemap = nav.map((item) => ({
    url: `${site.url}${item.href === "/" ? "" : item.href}`,
    lastModified: now,
    // The home page and the collection are the entry points; the rest are
    // supporting pages a buyer reads once.
    changeFrequency: item.href === "/" || item.href === "/bikes" ? "daily" : "monthly",
    priority: item.href === "/" ? 1 : item.href === "/bikes" ? 0.9 : 0.5,
  }));

  const listings: MetadataRoute.Sitemap = bikes.map((bike) => ({
    url: `${site.url}/bikes/${bike.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...pages, ...listings];
}
