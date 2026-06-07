// components/sections/Pricing.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import Button from "../common/Button";
import { CardSpotlight } from "@/src/components/ui/card-spotlight";

// --- Types ---
type Plan = {
  title: string;
  priceLabel: string; // "Free" | "$0" | "Coming Soon"
  subtitle?: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  tag?: "Most Popular" | "Coming Soon";
  highlight?: boolean;
};

// --- Data ---
const PLANS: Plan[] = [
  {
    title: "Guest — Free (No login)",
    priceLabel: "Free",
    subtitle: "Start without an account",
    features: [
      "4 diagrams (no account required)",
      "AI ERD generator",
      "Interactive editor (drag, rename, relations)",
      "PNG export",
      "Standard rate limits",
    ],
    ctaLabel: "Try without login",
    ctaHref: "/diagram",
  },
  {
    title: "Free — $0 (Sign in)",
    priceLabel: "$0",
    subtitle: "More diagrams + exports",
    features: [
      "10 diagrams per account",
      "Everything in Guest",
      "PNG & JSON exports",
      "SQL export (Postgres/MySQL/SQLite) — live",
      "Faster generation than Guest",
      "Early access to new diagram types",
    ],
    ctaLabel: "Create free account",
    ctaHref: "/signup",
    tag: "Most Popular",
    highlight: true,
  },
  {
    title: "Pro — Coming Soon",
    priceLabel: "Coming Soon",
    subtitle: "For teams & power users",
    features: [
      "Unlimited diagrams",
      "Priority generation",
      "SVG export",
      "Version history & restore",
      "Team workspaces & roles (soon)",
      "Multi-diagram projects (ERD ↔ UML ↔ Flow)",
      "Reverse-engineering importers (DDL / Prisma / Mongo)",
      "Advanced: GraphQL maps, Data lineage, C4, EDA, BPMN (as released)",
    ],
    ctaLabel: "Join Pro waitlist",
    ctaHref: "/waitlist",
    tag: "Coming Soon",
  },
];

const VISIBLE_FEATURES = 5;

const cardIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.08 * i, ease: "easeOut" },
  }),
};

export default function Pricing() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="pricing" className="relative py-20">
      {/* subtle bg wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free — no login required. Generate your first ERD in seconds
            and upgrade only when you need more.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {PLANS.map((plan, i) => {
            const isExpanded = expanded === i;
            const visible = plan.features.slice(0, VISIBLE_FEATURES);
            const hidden = plan.features.slice(VISIBLE_FEATURES);
            const hiddenCount = hidden.length;

            return (
              <motion.div
                key={plan.title}
                className="h-full"
                // variants={cardIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={i}
              >
                {/* Spotlight card wrapper */}
                <CardSpotlight
                  className={[
                    "h-full rounded-2xl border border-border bg-card/95 backdrop-blur-sm",
                    plan.highlight ? "shadow-lg" : "shadow-sm",
                  ].join(" ")}
                >
                  <motion.article
                    role="article"
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 240, damping: 20 }}
                    className={[
                      "h-full flex flex-col rounded-2xl p-6 lg:p-7",
                      plan.highlight ? "ring-1 ring-primary/20" : "",
                      // optional fixed height if you want perfect alignment across rows
                      // "min-h-[520px]"
                    ].join(" ")}
                  >
                    {/* Top: tag */}
                    {(plan.tag || plan.highlight) && (
                      <div className="mb-4">
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                            plan.tag === "Coming Soon"
                              ? "bg-muted text-muted-foreground"
                              : "bg-primary/10 text-foreground ring-1 ring-primary/20",
                          ].join(" ")}
                        >
                          {plan.tag || "Most Popular"}
                        </span>
                      </div>
                    )}

                    {/* Title / Price */}
                    <header>
                      <h3 className="text-lg font-semibold text-foreground leading-snug">
                        {plan.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {plan.subtitle}
                      </p>
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">
                          {plan.priceLabel}
                        </span>
                      </div>
                    </header>

                    {/* Features (equal height region) */}
                    <div className="mt-6 flex-1">
                      <ul className="space-y-3">
                        {visible.map((feat) => (
                          <li key={feat} className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                            <span className="text-sm leading-6 text-muted-foreground">
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Collapsible extra features */}
                      <AnimatePresence initial={false}>
                        {isExpanded && hiddenCount > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <ul className="mt-3 space-y-3">
                              {hidden.map((feat) => (
                                <li
                                  key={feat}
                                  className="flex items-start gap-3"
                                >
                                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                                  <span className="text-sm leading-6 text-muted-foreground">
                                    {feat}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* “+X more” control */}
                      {hiddenCount > 0 && (
                        <button
                          onClick={() => setExpanded(isExpanded ? null : i)}
                          className="mt-4 cursor-pointer text-xs font-medium text-foreground/80 hover:text-foreground underline-offset-4 hover:underline"
                          aria-expanded={isExpanded}
                          aria-controls={`plan-more-${i}`}
                        >
                          {isExpanded
                            ? "Show less"
                            : `Show ${hiddenCount} more`}
                        </button>
                      )}
                    </div>

                    {/* CTA (bottom pinned) */}
                    <div className="mt-8">
                      <Button
                        href={plan.ctaHref}
                        className={[
                          "w-full rounded-full px-6 py-3 text-center transition-colors cursor-pointer",
                          plan.highlight
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "border border-border bg-card text-foreground hover:bg-accent",
                        ].join(" ")}
                      >
                        {plan.ctaLabel}
                      </Button>
                    </div>
                  </motion.article>
                </CardSpotlight>
              </motion.div>
            );
          })}
        </div>

        {/* Footnotes */}
        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">“Diagram”</strong> = one new AI
            generation. Edits don’t consume a credit. Limits and features may
            evolve during beta to keep things fast and reliable.
          </p>
        </div>
      </div>
    </section>
  );
}
