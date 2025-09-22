// app/cookies/page.tsx
import React from "react";
import Link from "next/link";

const SITE = "https://www.autodia.tech";
const OG_IMAGE = `${SITE}/og.png`;

export const metadata = {
  title: "Cookie Policy — AutoDia AI",
  description:
    "Learn about how AutoDia AI uses cookies and similar technologies to enhance your experience.",
  alternates: {
    canonical: `${SITE}/cookies`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Cookie Policy — AutoDia AI",
    description: "How we use cookies and similar technologies at AutoDia AI.",
    url: `${SITE}/cookies`,
    siteName: "AutoDia AI",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "AutoDia AI" }],
  },
};

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>What Are Cookies?</h2>
        <p>
          Cookies are small text files that are placed on your computer or
          mobile device when you visit our website. They help us provide you
          with a better experience by remembering your preferences and
          understanding how you use our site.
        </p>

        <h2>How We Use Cookies</h2>
        <p>We use cookies for several purposes:</p>
        <ul>
          <li>
            <strong>Authentication:</strong> To keep you logged in and maintain
            your session
          </li>
          <li>
            <strong>Preferences:</strong> To remember your settings and
            preferences
          </li>
          <li>
            <strong>Analytics:</strong> To understand how visitors use our
            website
          </li>
          <li>
            <strong>Performance:</strong> To improve website speed and
            functionality
          </li>
        </ul>

        <h2>Types of Cookies We Use</h2>
        <h3>Essential Cookies</h3>
        <p>
          These cookies are necessary for the website to function properly and
          cannot be disabled.
        </p>

        <h3>Analytics Cookies</h3>
        <p>
          We use analytics cookies to understand how visitors interact with our
          website.
        </p>

        <h3>Preference Cookies</h3>
        <p>
          These cookies remember your choices and preferences to provide a
          personalized experience.
        </p>

        <h2>Managing Cookies</h2>
        <p>
          You can control and manage cookies through your browser settings. Most
          browsers allow you to:
        </p>
        <ul>
          <li>View which cookies are stored on your device</li>
          <li>Delete cookies individually or all at once</li>
          <li>Block cookies from specific websites</li>
          <li>Block third-party cookies</li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about our use of cookies, please contact us
          through our{" "}
          <Link href="/feedback" className="text-blue-600 hover:underline">
            feedback page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
