// lib/site.ts
export const site = {
  name: "AutoDia AI", // change to your site
  url: process.env.NEXT_FPUBLIC_SITE_URL ?? "https://autodia.tech",
  twitter: "@autodia", // your brand handle (optional)
  defaultOg: "/og.jpg", // fallback OG image path in /public
  logo: "/favicon.png", // square logo for schema
};
