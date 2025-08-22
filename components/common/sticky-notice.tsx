// src/components/common/sticky-notice.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { StickyBanner } from "@/src/components/ui/sticky-banner";

type Tone = "primary" | "accent" | "destructive" | "success" | "custom";

const TONE_STYLES: Record<
  Tone,
  { wrap: string; text: string; border: string }
> = {
  primary: {
    wrap: "bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.92)]",
    text: "text-[hsl(var(--primary-foreground))]",
    border: "border-[hsl(var(--primary)/0.30)]",
  },
  accent: {
    wrap: "bg-gradient-to-b from-[hsl(var(--accent))] to-[hsl(var(--accent)/0.92)]",
    text: "text-[hsl(var(--accent-foreground))]",
    border: "border-[hsl(var(--accent)/0.30)]",
  },
  destructive: {
    wrap: "bg-gradient-to-b from-[hsl(var(--destructive))] to-[hsl(var(--destructive)/0.92)]",
    text: "text-[hsl(var(--destructive-foreground))]",
    border: "border-[hsl(var(--destructive)/0.30)]",
  },
  success: {
    wrap: "bg-gradient-to-b from-[hsl(var(--chart-2))] to-[hsl(var(--chart-2)/0.92)]",
    text: "text-[hsl(var(--primary-foreground))]",
    border: "border-[hsl(var(--chart-2)/0.30)]",
  },
  custom: { wrap: "", text: "", border: "" },
};

export function StickyNotice({
  message,
  ctaHref,
  ctaLabel,
  tone = "primary",
  className,
  hideOnScroll = false,
  children,
}: {
  message?: React.ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
  tone?: Tone;
  className?: string;
  hideOnScroll?: boolean; // pass-through to StickyBanner
  children?: React.ReactNode;
}) {
  const styles = TONE_STYLES[tone];

  const CTA =
    ctaHref && ctaLabel ? (
      ctaHref.startsWith("/") ? (
        <Link
          href={ctaHref}
          className="font-medium underline underline-offset-4 transition hover:opacity-90"
        >
          {ctaLabel}
        </Link>
      ) : (
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-4 transition hover:opacity-90"
        >
          {ctaLabel}
        </a>
      )
    ) : null;

  return (
    <StickyBanner
      className={cn(
        "z-50 border",
        styles.wrap,
        styles.text,
        styles.border,
        className
      )}
      hideOnScroll={hideOnScroll}
    >
      <div className="mx-0 flex w-full items-center justify-between gap-4">
        {children ? (
          children
        ) : (
          <p className="mx-0 max-w-[92%]">
            {message} {CTA}
          </p>
        )}
      </div>
    </StickyBanner>
  );
}
