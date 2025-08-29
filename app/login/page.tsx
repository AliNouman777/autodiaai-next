import logo from "@/public/logo.png";
import { LoginForm } from "@/components/Login/login-form";
import Link from "next/link";
import Image from "next/image";

// ✅ Next.js App Router metadata (ensures no accidental noindex)
export const metadata = {
  title: "Log In to AutoDia AI — Access Your ERD Projects",
  description:
    "Sign in to AutoDia AI to generate, edit, and export professional Entity Relationship Diagrams (ERDs). Secure login to access saved diagrams and continue your work.",
  alternates: {
    canonical: "https://www.autodia.tech/login",
  },
  robots: {
    index: true,
    follow: true,
    // Helps rich results; safe defaults:
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Log In to AutoDia AI",
    description:
      "Access your saved ERDs, continue editing, and export clean database diagrams.",
    url: "https://www.autodia.tech/login",
    siteName: "AutoDia AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Log In to AutoDia AI",
    description:
      "Access your saved ERDs, continue editing, and export clean database diagrams.",
  },
};

export default function LoginPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Log In to AutoDia AI",
    url: "https://www.autodia.tech/login",
    description:
      "Sign in to AutoDia AI to generate, edit, and export professional ERDs. Secure login to access saved diagrams and continue your work.",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.autodia.tech/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Log In",
          item: "https://www.autodia.tech/login",
        },
      ],
    },
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {/* ✅ JSON-LD for clarity (won't change UI) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="text-primary-foreground flex size-18 items-center justify-center rounded-md">
            <Image src={logo} alt="Company Logo" width={40} height={40} />
          </div>
          <div className="-ml-5 text-2xl font-bold">
            <span className="text-foreground">Auto</span>
            <span className="text-primary">Dia</span>{" "}
            <span className="text-foreground">AI</span>
          </div>
        </Link>

        {/* Optional: small, helpful on-page copy (keeps the page from looking like a “soft 404”) */}
        <h1 className="sr-only">Log In to AutoDia AI</h1>
        <p className="text-sm text-muted-foreground text-center">
          Sign in to continue generating and editing clean, professional{" "}
          <strong>ERD diagrams</strong>. New here?{" "}
          <Link href="/signup" className="underline">
            Create a free account
          </Link>
          .
        </p>

        <LoginForm />

        {/* Helpful internal links improve discoverability */}
        <div className="text-xs text-muted-foreground text-center space-x-3">
          {/* <Link href="/forgot-password" className="underline">
            Forgot password?
          </Link> */}
          <Link href="/#features" className="underline">
            Features
          </Link>
          <Link href="/#pricing" className="underline">
            Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
