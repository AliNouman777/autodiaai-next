// components/about/CommitmentsGrid.tsx
import Link from "next/link";
import { COMMITMENTS } from "@/lib/content/about";

export default function CommitmentsGrid() {
  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-16">
        <h2 className="text-2xl font-semibold">Our commitments</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {COMMITMENTS.map((c) => (
            <div
              key={c.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h3 className="text-base font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              {!!c.links?.length && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-accent"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
