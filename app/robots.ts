// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/", // allow crawling of all public pages
        disallow: ["/api/", "/diagram/erd/"], // block private/API routes
      },
    ],
    sitemap: "https://www.autodia.tech/sitemap.xml",
    host: "https://www.autodia.tech",
  };
}
