// components/about/WhoWeServeGrid.tsx
import { WHO_WE_SERVE } from "@/lib/content/about";

export default function WhoWeServeGrid() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-16">
        <h2 className="text-2xl font-semibold">Who we serve</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {WHO_WE_SERVE.map((w) => (
            <div
              key={w.title}
              className="glass dark:glass-dark hover-lift rounded-xl p-6 transition-all"
            >
              <h3 className="text-base font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
