// components/about/GentleCta.tsx
import Link from "next/link";

export default function GentleCta() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-16 text-center">
        <h2 className="text-2xl font-semibold">
          See how we turn ideas into ERDs
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Try AutoDia AI in your browser. Start as a guest—no login required.
          Create a free account when you need more diagrams and exports.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/diagram"
            className="inline-flex items-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Start Free
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex items-center rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold hover:bg-accent"
          >
            Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
