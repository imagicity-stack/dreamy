import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * The sitemap, served at /sitemap.xml.
 *
 * It is written as code rather than a static file for one reason: a file goes
 * stale the first time somebody adds a page and forgets, and a sitemap that
 * lies about what exists is worse than none. The list below is every page a
 * stranger is meant to land on, and nothing else — the gate scanner, the admin
 * screens, the API and the per-ticket pages under /t are all private, are all
 * blocked in robots.txt, and would be a small privacy leak here.
 *
 * The priorities are honest about what the fest wants found: the ticket page
 * first, because that is the point, then the things people search for by name.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, changeFrequency: "daily" },
    { path: "/tickets", priority: 0.9, changeFrequency: "daily" },
    { path: "/concert", priority: 0.8, changeFrequency: "daily" },
    { path: "/cosplay", priority: 0.8, changeFrequency: "weekly" },
    { path: "/fete", priority: 0.7, changeFrequency: "weekly" },
    { path: "/lineup", priority: 0.7, changeFrequency: "daily" },
    { path: "/merch", priority: 0.6, changeFrequency: "weekly" },
    { path: "/gallery", priority: 0.5, changeFrequency: "weekly" },
    { path: "/sponsors", priority: 0.5, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.5, changeFrequency: "weekly" },
    // The legal pages rank for nothing and are still the first thing a parent
    // or a payment gateway looks for, so they belong in the index.
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/refunds", priority: 0.3, changeFrequency: "yearly" },
  ];

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
