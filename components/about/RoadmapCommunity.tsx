// components/about/RoadmapCommunity.tsx
import Link from "next/link";

export default function RoadmapCommunity() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-16">
        <h2 className="text-2xl font-semibold">Roadmap & community</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold">Roadmap</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We publish what we’re exploring next—new diagram types, exports,
              collaboration, and importer tools.
            </p>
            <Link
              href="/#roadmap"
              className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Explore Roadmap
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold">Changelog</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ship notes you can skim—focused on reliability, clarity, and small
              quality wins.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold">Docs & Support</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Short, practical guides. If something’s unclear, tell us—we’ll fix
              the docs or the product.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/contact"
                className="inline-flex rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
