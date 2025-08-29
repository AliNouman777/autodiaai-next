// app/diagram/page.tsx
import React, { Suspense } from "react";
import Table from "@/components/common/table";
import { TableSkeleton } from "@/components/skeleton/TableSkeleton";
import CreateDiagramSheet from "@/components/common/CreateDiagramSheet";

// ✅ Strong, intent-matching metadata for this route
export const metadata = {
  title: "Free AI ERD Generator Online | Create ER Diagrams",
  description:
    "Generate ER diagrams instantly from text with AutoDia AI. Free, fast, and easy-to-use ERD generator for database design and documentation.",
  alternates: {
    canonical: "https://www.autodia.tech/diagram",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Free AI ERD Generator Online",
    description:
      "Turn text into professional ER diagrams instantly. Free, accurate, and editable online ERD generator.",
    url: "https://www.autodia.tech/diagram",
    siteName: "AutoDia AI",
    type: "website",
    images: [
      {
        url: "https://www.autodia.tech/og.png",
        width: 1200,
        height: 630,
        alt: "AutoDia AI ERD Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI ERD Generator Online",
    description:
      "Turn text into professional ER diagrams instantly. Free, accurate, and editable online ERD generator.",
    images: ["https://www.autodia.tech/og.png"],
  },
};

export default function Page() {
  // ✅ SoftwareApplication JSON-LD for this tool page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AutoDia AI ERD Generator",
    url: "https://www.autodia.tech/diagram",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description:
      "Generate ER diagrams instantly from text with AutoDia AI. Free, fast, and easy-to-use ERD generator for database design and documentation.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="w-full gap-3 flex flex-col">
      {/* JSON-LD (no UI impact) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Accessible H1 for SEO; hidden visually */}
      <h1 className="sr-only">
        AI ERD Generator – Create Entity Relationship Diagrams from Text
      </h1>

      {/* Tiny intro to avoid “soft-404” and clarify purpose */}
      <p className="text-sm text-muted-foreground">
        Use AutoDia AI to generate clean, editable ER diagrams from plain
        English. Create your diagram, refine entities and relations on canvas,
        and export to PNG, JSON, or SQL.
      </p>

      <div className="flex w-full justify-between items-center">
        <CreateDiagramSheet
          triggerLabel="Create Diagram"
          className="w-fit cursor-pointer "
        />
      </div>

      <Suspense fallback={<TableSkeleton rows={5} />}>
        <Table />
      </Suspense>
    </div>
  );
}
