import Button from "../common/Button";
import { LayoutTemplate } from "lucide-react";
import ERDdiagram from "@/public/erd.png";
import Image from "next/image";
import StatefulButton from "../common/StatefulButton";

export default function Hero() {
  return (
    <section className="pt-24 pb-20 bg-gradient-to-br from-background to-primary/5 overflow-hidden">
      <div className="mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-slide-in-left">
            {/* H1 */}
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6 animate-fade-in">
              AI ERD Generator —{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Create Database Diagrams
              </span>{" "}
              from Text
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in-delay">
              Build professional{" "}
              <strong>Entity Relationship Diagrams (ERDs)</strong> instantly.
              Just type a prompt and get a clean, interactive{" "}
              <strong>database diagram</strong> you can edit, refine, and
              export.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up"
              style={{ animationDelay: "0.6s", animationFillMode: "both" }}
            >
              <StatefulButton
                navigateTo="/diagram"
                label="Start Free — Generate Your ERD"
              />

              {/* Optional secondary CTA:
              <Button
                href="/pricing"
                className="border border-border text-foreground px-8 py-4 rounded-full hover:bg-accent transition-all duration-300 font-semibold text-lg hover-lift cursor-pointer"
              >
                See Pricing
              </Button> */}
            </div>

            {/* Value bullets */}
            <div
              className="flex flex-col gap-3 mb-8 text-foreground/90 text-base animate-slide-up"
              style={{ animationDelay: "0.7s", animationFillMode: "both" }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-chart-2"></span>
                <span>Generate ERDs from natural language prompts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-chart-1"></span>
                <span>
                  No login required — guest users can create up to 4 diagrams
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-chart-3"></span>
                <span>Free account unlocks 10 diagrams + exports</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-chart-4"></span>
                <span>Pro plan coming soon for unlimited AI diagrams</span>
              </div>
            </div>
          </div>

          {/* Right-side visual */}
          <div className="relative animate-slide-in-right">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/15 to-primary/5 rounded-3xl blur-2xl animate-pulse-subtle"></div>
            <Image
              src={ERDdiagram}
              alt="Autodia AI — ERD Generator Interface"
              className="relative rounded-2xl shadow-xl w-auto h-auto border border-border hover-lift transition-all duration-500"
              width={800}
              height={600}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl pointer-events-none"></div>

            {/* Floating pills (tokenized) */}
            <div
              className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-float"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute top-1/4 -left-4 w-6 h-6 bg-accent rounded-full animate-float"
              style={{ animationDelay: "2s" }}
            />
            <div
              className="absolute bottom-1/4 -right-6 w-4 h-4 bg-chart-1 rounded-full animate-float"
              style={{ animationDelay: "4s" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
