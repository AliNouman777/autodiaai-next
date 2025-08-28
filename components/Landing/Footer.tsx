// components/sections/Footer.tsx
"use client";

import Link from "next/link";
import { Mail, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-border">
      {/* subtle blueish wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

      <div className="relative mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand / blurb */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center space-x-2">
              <span className="text-xl font-bold text-foreground">
                Auto<span className="text-primary">Dia</span> AI
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-prose">
              Autodia AI turns plain text into clean, editable Entity
              Relationship Diagrams. Start free—no login required.
            </p>

            {/* Newsletter */}
            <form
              className="mt-6 flex w-full max-w-md items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                aria-label="Subscribe"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-2 text-xs text-muted-foreground">
              Get product updates and schema tips—about once a month. By
              subscribing, you agree to our{" "}
              <Link href="/privacy" className="underline underline-offset-4">
                Privacy Policy
              </Link>
              .
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="mailto:alinouman6348248@gmail.com"
                aria-label="Email"
                className="group"
              >
                <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link
                href="https://github.com/AliNouman777/autodiaai-next"
                target="_blank"
                aria-label="GitHub"
                className="group"
              >
                <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link
                href="https://twitter.com/"
                target="_blank"
                aria-label="Twitter/X"
                className="group"
              >
                <Twitter className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link
                href="https://www.linkedin.com/"
                target="_blank"
                aria-label="LinkedIn"
                className="group"
              >
                <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 md:col-span-2">
            <FooterCol
              title="Product"
              links={[
                { label: "ERD Generator", href: "/diagram" },
                { label: "Pricing", href: "/#pricing" },
                { label: "Roadmap", href: "/#roadmap" },
                { label: "FAQ", href: "/#faq" },
              ]}
            />
            <FooterCol
              title="Resources"
              links={[{ label: "Contact", href: "#" }]}
            />
            <FooterCol
              title="Company"
              links={[{ label: "About", href: "/about" }]}
            />
            <FooterCol
              title="Legal"
              links={[{ label: "Privacy", href: "/privacy" }]}
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © 2025 Autodia AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <span aria-hidden>•</span>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <span aria-hidden>•</span>
            <Link href="/security" className="hover:text-foreground">
              Security
            </Link>
            <span aria-hidden>•</span>
            <Link href="/status" className="hover:text-foreground">
              Status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
