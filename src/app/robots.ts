import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Serves /robots.txt.
 *
 * Everything public is fair game for search engines; the admin is not. Note
 * that this is a request not to index, not a lock — the admin's actual
 * protection is the login (checked in the middleware and again in the page).
 * It is listed here so the panel never turns up in a search result, which is
 * the realistic risk: nobody guesses the URL, they find it on Google.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
