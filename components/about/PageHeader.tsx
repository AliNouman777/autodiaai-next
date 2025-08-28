// components/about/PageHeader.tsx
export default function PageHeader() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <p className="text-sm font-medium text-muted-foreground animate-fade-in">
          About Us
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl animate-fade-up">
          The story behind <span className="text-primary">AutoDia AI</span>
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-muted-foreground animate-fade-in-delay">
          AutoDia AI began with a simple frustration: turning ideas into
          trustworthy data models took too long. We’re building tools that
          transform plain language into clear, editable diagrams—so teams can
          reason about systems sooner and ship with confidence.
        </p>
      </div>
    </section>
  );
}
