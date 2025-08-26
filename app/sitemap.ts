// app/sitemap.ts
// Next.js App Router sitemap generator
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.autodia.tech";

  // Static, human-facing routes in your app
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/diagram", priority: 0.8, changeFrequency: "weekly" },
    { path: "/feedback", priority: 0.6, changeFrequency: "weekly" },
    { path: "/login", priority: 0.3, changeFrequency: "monthly" },
    { path: "/signup", priority: 0.4, changeFrequency: "monthly" },
  ] as const;

  const lastModified = new Date();

  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
