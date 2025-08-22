// components/ui/card-spotlight.tsx
"use client";

import { useMotionValue, motion, useMotionTemplate } from "motion/react";
import React, { MouseEvent as ReactMouseEvent, useState } from "react";
import { CanvasRevealEffect } from "./canvas-reveal-effect";
import { cn } from "@/lib/utils";

export const CardSpotlight = ({
  children,
  radius = 340,
  // defaults to your brand (primary) with tokenized alpha
  color = "hsl(var(--primary) / 0.16)",
  className,
  ...props
}: {
  radius?: number;
  color?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className={cn(
        // tokenized surfaces/borders for light+dark
        "group/spotlight relative rounded-2xl border border-border bg-card text-foreground p-6",
        "transition-colors",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      {/* spotlight mask (uses primary token color) */}
      <motion.div
        className="pointer-events-none absolute z-0 -inset-px rounded-2xl opacity-0 transition duration-300 group-hover/spotlight:opacity-100"
        style={{
          backgroundColor: color,
          maskImage: useMotionTemplate`
            radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, white, transparent 70%)
          `,
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, white, transparent 70%)
          `,
        }}
      >
        {isHovering && (
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-transparent absolute inset-0 pointer-events-none"
            colors={[
              [59, 130, 246], // blue-500
              [56, 189, 248], // cyan-400
            ]}
            dotSize={3}
          />
        )}
      </motion.div>

      {/* content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
