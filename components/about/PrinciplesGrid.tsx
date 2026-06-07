// components/about/PrinciplesGrid.tsx
import { PRINCIPLES } from "@/lib/content/about";

export default function PrinciplesGrid() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-16">
        <h2 className="text-2xl font-semibold">Principles we work by</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-border bg-card p-6 animate-fade-in"
            >
              <h3 className="text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
