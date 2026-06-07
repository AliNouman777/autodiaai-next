// app/privacy/page.tsx
import React from "react";
import Link from "next/link";
import Script from "next/script";

const SITE = "https://www.autodia.tech";
const OG_IMAGE = `${SITE}/og.png`;
const UPDATED_ISO = "2025-08-29";
const UPDATED_READABLE = "August 29, 2025";

export const metadata = {
  title: "Privacy Policy — AutoDia AI",
  description:
    "Learn how AutoDia AI collects, uses, and protects your data. Read about cookies, analytics, AI processing, and your privacy rights.",
  alternates: {
    canonical: `${SITE}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Privacy Policy — AutoDia AI",
    description: "How we collect, use, and protect your data at AutoDia AI.",
    url: `${SITE}/privacy`,
    siteName: "AutoDia AI",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "AutoDia AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — AutoDia AI",
    description: "How we collect, use, and protect your data at AutoDia AI.",
    images: [OG_IMAGE],
  },
};

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    name: "Privacy Policy — AutoDia AI",
    url: `${SITE}/privacy`,
    inLanguage: "en",
    dateModified: UPDATED_ISO,
    publisher: {
      "@type": "Organization",
      name: "AutoDia AI",
      url: SITE,
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/favicon-512x512.png`,
      },
    },
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      {
        "@type": "ListItem",
        position: 2,
        name: "Privacy Policy",
        item: `${SITE}/privacy`,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* JSON-LD */}
      <Script
        id="jsonld-privacy"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="jsonld-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {UPDATED_READABLE}
        </p>
      </header>

      <article className="prose prose-sm sm:prose-base dark:prose-invert prose-h2:mt-8 prose-h2:mb-3 prose-p:leading-7">
        <p>
          This Privacy Policy explains how <strong>AutoDia AI</strong> (“we”,
          “us”, or “our”) collects, uses, and protects your information when you
          visit {SITE} or use our services (the “Services”). By using our
          Services, you agree to this Policy. If you do not agree, please do not
          use the Services.
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li>
            <strong>Account & Profile:</strong> name, email, and settings you
            provide when you sign up or update your account.
          </li>
          <li>
            <strong>Content You Create:</strong> prompts, diagrams, schema text,
            and related files you upload or generate within the app.
          </li>
          <li>
            <strong>Usage & Device Data:</strong> IP address, device/browser
            info, pages viewed, referring URLs, and actions taken (for
            reliability and analytics).
          </li>
          <li>
            <strong>Payments:</strong> if/when applicable, billing details
            processed by our payment provider; we do not store full card numbers
            on our servers.
          </li>
          <li>
            <strong>Support & Feedback:</strong> messages you send us via forms
            or email.
          </li>
        </ul>

        <h2>How We Use Information</h2>
        <ul>
          <li>Provide, maintain, and improve the Services and features.</li>
          <li>Authenticate users, secure accounts, and prevent abuse.</li>
          <li>
            Process requests (e.g., generate ERDs from prompts) and exports.
          </li>
          <li>
            Analyze performance and reliability to fix bugs and improve UX.
          </li>
          <li>Communicate important updates, changes, or service notices.</li>
        </ul>

        <h2>AI Processing</h2>
        <p>
          To generate ER diagrams and related outputs, your prompts and content
          may be processed by AI models. We retain minimal necessary logs to
          improve reliability and prevent abuse. We do <strong>not</strong> sell
          your data.
        </p>

        <h2>Cookies & Analytics</h2>
        <p>
          We use cookies and similar technologies for authentication, session
          management, preferences, analytics, and performance. You can manage
          cookies in your browser settings. We may use analytics tools to
          understand usage and improve the Service.
        </p>

        <h2>Legal Bases (EEA/UK)</h2>
        <ul>
          <li>
            <strong>Contract:</strong> to deliver the Service you request.
          </li>
          <li>
            <strong>Legitimate Interests:</strong> to improve and secure the
            Service.
          </li>
          <li>
            <strong>Consent:</strong> where required (e.g., certain
            cookies/marketing).
          </li>
          <li>
            <strong>Legal Obligation:</strong> to comply with applicable laws.
          </li>
        </ul>

        <h2>Sharing Information</h2>
        <ul>
          <li>
            <strong>Service Providers:</strong> infrastructure, analytics,
            email, and payment vendors who process data on our behalf under
            appropriate safeguards.
          </li>
          <li>
            <strong>Compliance & Safety:</strong> to comply with law or protect
            rights, safety, and security.
          </li>
          <li>
            <strong>Business Transfers:</strong> in a merger, acquisition, or
            asset sale, your data may be transferred with notice where required.
          </li>
        </ul>

        <h2>Data Retention</h2>
        <p>
          We retain information as long as necessary to provide the Services,
          comply with legal obligations, resolve disputes, and enforce
          agreements. You may request deletion as described below.
        </p>

        <h2>Security</h2>
        <p>
          We implement technical and organizational measures to protect your
          information. However, no method of transmission or storage is 100%
          secure.
        </p>

        <h2>Your Rights</h2>
        <p>
          Subject to your location, you may have rights to access, correct,
          delete, restrict, or object to processing of your personal data, and
          to data portability. To exercise rights, contact us via{" "}
          <Link href="/feedback" className="underline">
            Feedback
          </Link>
          . You may also have the right to lodge a complaint with your local
          data authority.
        </p>

        <h2>International Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries
          other than your own. Where required, we use appropriate safeguards for
          international transfers.
        </p>

        <h2>Children’s Privacy</h2>
        <p>
          The Services are not directed to children under 13 (or the minimum age
          required by your jurisdiction). We do not knowingly collect personal
          data from children.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Policy from time to time. The “Last updated” date
          above reflects the latest change. Significant changes will be
          highlighted on this page.
        </p>

        <h2>Contact Us</h2>
        <p>
          Questions about this Policy? Contact us via{" "}
          <Link href="/feedback" className="underline">
            Feedback
          </Link>{" "}
          .
        </p>
      </article>
    </main>
  );
}
