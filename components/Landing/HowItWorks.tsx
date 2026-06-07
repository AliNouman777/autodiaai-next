// components/Landing/HowItWorks.tsx  (SSR – no "use client")
import {
  Keyboard as KeyboardIcon,
  Wand as WandIcon,
  Download as DownloadIcon,
} from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Describe Your Schema",
    description:
      'Type your database requirements in plain English. "Create a blog system with users, posts."',
    icon: KeyboardIcon,
  },
  {
    number: 2,
    title: "AI Infers Relationships",
    description:
      "AutoDia AI automatically identifies entities, attributes, primary keys, and relationships between tables.",
    icon: WandIcon,
  },
  {
    number: 3,
    title: "Edit & Export",
    description:
      "Fine-tune your diagram with the visual editor, then export as PNG for immediate use.",
    icon: DownloadIcon,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 animate-fade-in">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p
            className="text-xl text-muted-foreground animate-slide-up"
            style={{ animationDelay: "150ms", animationFillMode: "both" }}
          >
            Three simple steps to professional ERD diagrams
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="text-center animate-slide-up"
              style={{
                animationDelay: `${150 * index}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto shadow-lg animate-glow">
                  <span className="text-primary-foreground font-bold text-xl">
                    {step.number}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-4">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {step.description}
              </p>

              <div className="bg-card rounded-lg p-4 border border-border transition-all duration-300 group hover:scale-105 hover:shadow-[0_6px_24px_0_rgba(37,99,235,0.10)] hover:border-primary/40">
                <step.icon className="h-8 w-8 text-primary mx-auto transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="text-center mt-16 animate-slide-up"
          style={{ animationDelay: "100ms", animationFillMode: "both" }}
        >
          <div className="inline-flex items-center space-x-4 bg-card rounded-full px-6 py-3 shadow-lg border border-border">
            <span className="text-muted-foreground">Ready to get started?</span>
            <div className="flex space-x-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse-dot" />
              <span
                className="w-2 h-2 bg-primary/70 rounded-full animate-pulse-dot"
                style={{ animationDelay: "300ms" }}
              />
              <span
                className="w-2 h-2 bg-primary/40 rounded-full animate-pulse-dot"
                style={{ animationDelay: "600ms" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
