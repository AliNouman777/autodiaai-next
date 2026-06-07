// components/about/CommitmentsGrid.tsx
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
