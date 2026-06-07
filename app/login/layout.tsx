// app/login/layout.tsx
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Log In — AutoDia AI",
  description:
    "Sign in to AutoDia AI to generate, edit, and export ER diagrams. Secure login to access your projects.",
  alternates: { canonical: "https://www.autodia.tech/login" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white">
      {/* JSON-LD for login page */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Log In",
          url: "https://www.autodia.tech/login",
        }}
      />

      <div className="w-full mx-auto">{children}</div>
    </section>
  );
}
