// components/about/BuildSection.tsx
export default function BuildSection() {
  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-16">
        <h2 className="text-2xl font-semibold">How we build</h2>
        <div className="mt-4 grid gap-8 lg:grid-cols-12">
          <p className="lg:col-span-7 text-muted-foreground">
            AutoDia AI blends large-language-model capabilities with
            deterministic post-processing and schema checks. We prefer systems
            that are inspectable and easy to correct: human-in-the-loop by
            design. Our north star is simple—get you to a trustworthy, editable
            diagram faster than any manual approach.
          </p>
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-base font-semibold">Guiding choices</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Clear diffs over hidden magic</li>
                <li>• Legible naming & constraints</li>
                <li>• Safe defaults; easy overrides</li>
                <li>• Predictable performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
