// app/sitemap.ts
// Next.js App Router sitemap generator (with blog posts)
import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { site } from "@/lib/site";

function toDate(input?: string | Date): Date | undefined {
  if (!input) return undefined;
  const d = typeof input === "string" ? new Date(input) : input;
  return isNaN(d.getTime()) ? undefined : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url ?? "https://www.autodia.tech";
  const now = new Date();

  // Static, human-facing routes in your app
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: new URL("/", base).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: new URL("/diagram", base).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: new URL("/feedback", base).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: new URL("/login", base).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: new URL("/signup", base).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: new URL("/about", base).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },

    // Blog index
    {
      url: new URL("/blog", base).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Blog posts (from Fumadocs)
  const pages = await source.getPages();
  const blogPosts: MetadataRoute.Sitemap = pages
    // only blog URLs
    .filter((p) => p.url?.startsWith("/blog/"))
    // ignore drafts
    .filter((p) => !(p.data as any)?.draft)
    .map((p) => {
      const data = p.data as {
        date?: string | Date;
        modified?: string | Date;
      };

      const last = toDate(data?.modified) ?? toDate(data?.date) ?? now;

      return {
        url: new URL(p.url, base).toString(),
        lastModified: last,
        changeFrequency: "monthly",
        priority: 0.6,
      };
    });

  return [...staticRoutes, ...blogPosts];
}
