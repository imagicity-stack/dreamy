import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * robots.txt, and the pointer to the sitemap.
 *
 * Everything that is not a public page is disallowed. /t in particular: those
 * URLs are the tickets themselves, and a crawler following one would be
 * indexing somebody's pass.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/gate", "/t/"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
