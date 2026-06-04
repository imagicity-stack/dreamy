import type { MetadataRoute } from "next";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://madooza.com").replace(/\/+$/, "");

const ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: MetadataRoute.Sitemap[number]["priority"];
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "weekly", priority: 0.9 },
  { path: "/lineup", changeFrequency: "weekly", priority: 0.95 },
  { path: "/schedule", changeFrequency: "weekly", priority: 0.9 },
  { path: "/venue", changeFrequency: "weekly", priority: 0.8 },
  { path: "/gallery", changeFrequency: "weekly", priority: 0.7 },
  { path: "/sponsors", changeFrequency: "weekly", priority: 0.7 },
  { path: "/tickets", changeFrequency: "weekly", priority: 1 },
  { path: "/cosplay", changeFrequency: "weekly", priority: 0.9 },
  { path: "/stall", changeFrequency: "weekly", priority: 0.9 },
  { path: "/performer", changeFrequency: "monthly", priority: 0.7 },
  { path: "/volunteer", changeFrequency: "monthly", priority: 0.7 },
  { path: "/sponsor", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.5 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.5 },
  { path: "/cancellation-refund-policy", changeFrequency: "yearly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
