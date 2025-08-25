// components/sections/FeaturesGrid.tsx
import type { ReactNode } from "react";
import { Brain, Edit3, Key, Download, UserCheck, Layers } from "lucide-react";

type Feature = {
  title: string;
  desc: string;
  icon: ReactNode;
};

const FEATURES: Feature[] = [
  {
    title: "AI-Powered ERD Generator",
    desc: "Turn natural language prompts into clean Entity Relationship Diagrams (ERDs) instantly.",
    icon: <Brain className="h-6 w-6 text-primary" />,
  },
  {
    title: "Interactive Diagram Editor",
    desc: "Drag, rename, and restructure tables and relationships directly on the canvas.",
    icon: <Edit3 className="h-6 w-6 text-primary" />,
  },
  {
    title: "Smart Keys & Relationships",
    desc: "Automatic detection of primary and foreign keys makes your database schema accurate by default.",
    icon: <Key className="h-6 w-6 text-primary" />,
  },
  {
    title: "Easy Export Options",
    desc: "Download diagrams as PNG images (JSON for free users, SVG coming soon for Pro).",
    icon: <Download className="h-6 w-6 text-primary" />,
  },
  {
    title: "No Login to Start",
    desc: "Generate up to 4 diagrams as a guest — no account required.",
    icon: <UserCheck className="h-6 w-6 text-primary" />,
  },
  {
    title: "Future-Ready Platform",
    desc: "More diagram types (UML, flowcharts, org charts, and more) are on the roadmap.",
    icon: <Layers className="h-6 w-6 text-primary" />,
  },
];

export function FeaturesGrid() {
  return (
    <section className="relative py-20">
      {/* soft background wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Powerful Features for Smarter Diagramming
          </h2>
          <p className="mt-4 text-muted-foreground">
            With Autodia AI you can go from plain text to interactive database
            diagrams in seconds. Edit, refine, and export with ease.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="group relative rounded-2xl border border-border bg-card p-6 lg:p-7 shadow-sm transition-all hover:shadow-md hover-lift"
            >
              {/* corner glow */}
              <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <header className="flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 ring-1 ring-primary/15">
                  {f.icon}
                </span>
                <h3 className="text-lg font-semibold leading-snug text-foreground">
                  {f.title}
                </h3>
              </header>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {f.desc}
              </p>

              {/* bottom accent */}
              <div className="mt-6 h-1 w-16 rounded-full bg-primary/20 group-hover:bg-primary/35 transition-colors" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesGrid;
