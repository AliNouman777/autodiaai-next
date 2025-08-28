// components/about/StorySection.tsx
export default function StorySection() {
  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-16">
        <h2 className="text-2xl font-semibold">Our story</h2>
        <div className="mt-4 grid gap-8 lg:grid-cols-12">
          <p className="lg:col-span-7 text-muted-foreground">
            Modeling a database shouldn’t feel like wrestling a drawing tool. We
            wanted a path from concept to ERD that was fast, legible, and easy
            to change. That’s why AutoDia AI pairs language understanding with a
            disciplined editor: AI drafts the first pass, humans refine the
            truth.
          </p>
          <div className="lg:col-span-5">
            <div className="glass dark:glass-dark rounded-xl p-6 animate-float">
              <h3 className="text-base font-semibold">What that means</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Language in, diagram out—without heavy setup.</li>
                <li>• Edits are first-class; diagrams are living documents.</li>
                <li>• Exports keep you in control of your work.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
