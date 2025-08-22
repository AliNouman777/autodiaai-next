// components/sections/UseCases.tsx
"use client";

import type { ReactNode } from "react";
import {
  Code2,
  Database,
  Server,
  GraduationCap,
  GitBranch,
  Layers,
} from "lucide-react";
import Button from "../common/Button";

type Item = { icon: ReactNode; title: string; desc: string };

const ITEMS: Item[] = [
  {
    icon: <Code2 className="h-6 w-6 text-primary" />,
    title: "Backend Developers",
    desc: "Go from spec to ERD in minutes. Iterate quickly and export SQL for migrations.",
  },
  {
    icon: <Database className="h-6 w-6 text-primary" />,
    title: "Database Engineers / DBAs",
    desc: "Normalize schemas, validate keys & relations, and keep diagrams aligned with DDL.",
  },
  {
    icon: <Layers className="h-6 w-6 text-primary" />,
    title: "Startup & Product Teams",
    desc: "Align on the data model early and share a single source of truth with stakeholders.",
  },
  {
    icon: <Server className="h-6 w-6 text-primary" />,
    title: "Data & Analytics",
    desc: "Document sources and models today; lineage and pipeline maps are coming soon.",
  },
  {
    icon: <GitBranch className="h-6 w-6 text-primary" />,
    title: "GraphQL / Prisma Teams",
    desc: "Visualize types and relations, import schemas, and keep models consistent.",
  },
  {
    icon: <GraduationCap className="h-6 w-6 text-primary" />,
    title: "Students & Educators",
    desc: "Learn ER modeling with instant visual feedback and clean exports for assignments.",
  },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="relative py-20">
      {/* subtle background wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Use Cases
          </h2>
          <p className="mt-4 text-muted-foreground">
            See how teams use Autodia AI to design, iterate, and ship faster.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ITEMS.map((it) => (
            <article
              key={it.title}
              className="group relative rounded-2xl border border-border bg-card p-6 lg:p-7 shadow-sm transition-all hover:shadow-md hover-lift"
            >
              {/* corner glow */}
              <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <header className="flex items-start gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
                  {it.icon}
                </span>
                <h3 className="text-lg font-semibold leading-snug text-foreground">
                  {it.title}
                </h3>
              </header>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {it.desc}
              </p>
              <div className="mt-6 h-1 w-16 rounded-full bg-primary/20 group-hover:bg-primary/35 transition-colors" />
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Button
            href="/diagram"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Start free — generate your ERD
          </Button>
        </div>
      </div>
    </section>
  );
}
