// components/Landing/FAQ.tsx  (SSR — no "use client")
import { ChevronDown } from "lucide-react";

type QA = { question: string; answer: string };

const FAQS: QA[] = [
  {
    question: "What is Autodia AI?",
    answer:
      "Autodia AI is an AI ERD generator that turns plain text prompts into Entity Relationship Diagrams (ERDs) you can edit, refine, and export.",
  },
  {
    question: "Do I need an account to try it?",
    answer: "No. Guest users can generate up to 4 diagrams without login.",
  },
  {
    question: "What do I get with the Free plan?",
    answer:
      "The Free plan includes 10 diagrams per account, editable ERDs, PNG & JSON exports, and SQL export (Postgres/MySQL/SQLite).",
  },
  {
    question: "Is Pro available now?",
    answer:
      "Pro is coming soon. Join the waitlist to get early access and priority features.",
  },
  {
    question: "Which exports are supported?",
    answer:
      "Today: PNG, JSON, and SQL (Postgres/MySQL/SQLite). SVG export and version history are on the roadmap.",
  },
  {
    question: "How accurate are relationships and keys?",
    answer:
      "The model infers primary/foreign keys and common relationships from context. You can adjust everything in the interactive editor.",
  },
  {
    question: "Can I edit a generated diagram?",
    answer:
      "Yes—drag tables, rename fields, add relations, and restructure the schema directly on the canvas. Edits don’t consume a credit.",
  },
  {
    question: "What counts as a “diagram” credit?",
    answer:
      "A credit is used when you generate a new diagram with AI. Editing and exporting don’t use extra credits.",
  },
  {
    question: "Do you support reverse-engineering from existing schemas?",
    answer:
      "Planned. We’re building importers for SQL DDL, Prisma schema, and Mongo collections to convert into editable ERDs.",
  },
  {
    question: "What databases do you target?",
    answer:
      "We optimize for Postgres, MySQL, and SQLite types/constraints today, with broader coverage improving over time.",
  },
  {
    question: "Is my data private?",
    answer:
      "Your prompts and diagrams are used only to generate your result and improve reliability. We don’t sell data. See our Privacy Policy for details.",
  },
  {
    question: "Can I use Autodia AI for commercial projects?",
    answer:
      "Yes—diagrams and exports you create are yours to use in commercial work. Please review the Terms for any limits during beta.",
  },
  {
    question: "What browsers are supported?",
    answer:
      "Latest Chrome, Edge, Safari, and Firefox. If you see performance issues, close heavy tabs or reduce canvas size.",
  },
  {
    question: "Why did generation fail or time out?",
    answer:
      "Network hiccups or overly long prompts can cause errors. Try a shorter prompt, then expand. If it persists, contact support.",
  },
  {
    question: "Will you support other diagram types?",
    answer:
      "Yes. Next up: UML Class, Flowcharts, Org Charts—plus big bets like C4, BPMN, and Data Lineage.",
  },
  {
    question: "How can I influence the roadmap?",
    answer:
      "Vote on features and join the Pro waitlist—your feedback directly prioritizes what we ship next.",
  },
];

export default function FAQ() {
  // SEO: structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section id="faq" className="relative py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="relative mx-auto max-w-4xl px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Frequently Asked
            </span>{" "}
            Questions
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Everything you need to know about Autodia AI, plans, and features.
          </p>
        </div>

        {/* Accordion (no JS) */}
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <details
              key={faq.question}
              className="group rounded-xl border bg-card transition-colors open:border-primary/40 open:ring-1 open:ring-primary/20 border-border"
            >
              <summary className="list-none px-5 md:px-6 py-5 flex items-center justify-between cursor-pointer rounded-xl select-none">
                <span className="font-semibold text-foreground pr-6">
                  {faq.question}
                </span>
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-primary transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>

              <div className="px-5 md:px-6 pb-5 md:pb-6">
                <p className="text-sm leading-6 text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        {/* JSON-LD for SEO */}
        <script
          type="application/ld+json"
          // avoid React diff noise:
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </div>
    </section>
  );
}
