// components/sections/RoadmapTimeline.tsx
"use client";

import type { ReactNode } from "react";
import { Timeline } from "@/src/components/ui/timeline";
import Button from "./Button";

type TimelineEntry = {
  title: string;
  content: ReactNode;
};

const DATA: TimelineEntry[] = [
  {
    title: "Now",
    content: (
      <ul className="ml-4 list-disc space-y-2 text-sm leading-6 text-muted-foreground">
        <li>
          <strong className="text-foreground">Smarter ERD generation</strong> —
          stronger key inference, clearer relationship labels, better naming
          suggestions.
        </li>
        <li>
          <strong className="text-foreground">Export upgrades</strong> —
          higher-fidelity PNG, stable JSON schema export.
        </li>
        <li>
          <strong className="text-foreground">Performance</strong> — faster
          generation and smoother canvas editing.
        </li>
        <li>
          <strong className="text-foreground">SQL export is live</strong> —
          already available from ERDs.
        </li>
      </ul>
    ),
  },
  {
    title: "Next",
    content: (
      <ul className="ml-4 list-disc space-y-2 text-sm leading-6 text-muted-foreground">
        <li>
          <strong className="text-foreground">
            UML Class, Flowcharts, Org Charts
          </strong>{" "}
          — text-to-diagram beyond ERD with the same prompt workflow.
        </li>
        <li>
          <strong className="text-foreground">SVG export</strong> — crisp vector
          exports for decks and docs.
        </li>
        <li>
          <strong className="text-foreground">Version history</strong> — diff,
          name, and restore any diagram state.
        </li>
        <li>
          <strong className="text-foreground">
            Reverse-engineering importers
          </strong>{" "}
          — turn existing databases and schemas (SQL DDL, Prisma schema, Mongo
          collections) into editable diagrams.
        </li>
      </ul>
    ),
  },
  {
    title: "Soon",
    content: (
      <ul className="ml-4 list-disc space-y-2 text-sm leading-6 text-muted-foreground">
        <li>
          <strong className="text-foreground">Team collaboration</strong> —
          invites, roles, shared workspaces, and real-time co-editing.
        </li>
        <li>
          <strong className="text-foreground">Multi-diagram projects</strong> —
          link an ERD to its UML, flowchart, and sequence views in one
          workspace.
        </li>
        <li>
          <strong className="text-foreground">GraphQL schema maps</strong> —
          visualize types, fields, and relationships straight from a schema or
          prompt.
        </li>
        <li>
          <strong className="text-foreground">Data lineage maps</strong> — model
          pipelines end-to-end (sources → transforms → destinations) for
          analytics & ETL.
        </li>
      </ul>
    ),
  },
  {
    title: "On the Horizon",
    content: (
      <ul className="ml-4 list-disc space-y-2 text-sm leading-6 text-muted-foreground">
        <li>
          <strong className="text-foreground">Knowledge Graph Designer</strong>{" "}
          — generate property graphs from text with labels/properties/edges;
          export Cypher/Neo4j formats.
        </li>
        <li>
          <strong className="text-foreground">
            System Architecture (C4) Autodrafts
          </strong>{" "}
          — produce C1–C3 C4 diagrams from prompts and lightweight repo
          introspection.
        </li>
        <li>
          <strong className="text-foreground">
            Event-Driven Architecture Maps
          </strong>{" "}
          — model topics/queues, producers, consumers, and contracts for
          Kafka/RabbitMQ-style systems.
        </li>
        <li>
          <strong className="text-foreground">
            BPMN-style Process Modeling
          </strong>{" "}
          — text-to-BPMN for business workflows with swimlanes and gateways.
        </li>
        <li>
          <strong className="text-foreground">
            Security & Compliance Overlays
          </strong>{" "}
          — highlight PII/PCI fields, access paths, and threat surfaces
          (STRIDE-style) directly on diagrams.
        </li>
      </ul>
    ),
  },
];

export default function RoadmapTimeline() {
  return (
    <section className="relative py-20">
      {/* soft background wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="relative mx-auto max-w-7xl px-6">
        {/* Timeline */}
        <Timeline data={DATA} />

        {/* CTA strip */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            href="/vote"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
          >
            Vote on features
          </Button>
          <Button
            href="/waitlist"
            className="border border-border bg-card text-foreground px-6 py-3 rounded-full hover:bg-accent transition-colors"
          >
            Join Pro waitlist
          </Button>
        </div>
      </div>
    </section>
  );
}
