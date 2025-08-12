// src/components/common/ButtonSkeleton.tsx
"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

type ButtonSkeletonProps = {
  className?: string;
  size?: Size;         // visual height
  fullWidth?: boolean; // stretch to container width
};

/** Pill-shaped button skeleton (e.g., CTA) */
export default function ButtonSkeleton({
  className,
  size = "md",
  fullWidth = false,
}: ButtonSkeletonProps) {
  const sizeToH: Record<Size, string> = { sm: "h-9", md: "h-10", lg: "h-11" };
  return (
    <Skeleton
      className={cn(
        "rounded-full",
        sizeToH[size],
        fullWidth ? "w-full" : "w-40",
        className
      )}
    />
  );
}

/** Circular icon button skeleton */
export function IconButtonSkeleton({
  className,
  size = "md",
}: { className?: string; size?: Size }) {
  const sizeToBox: Record<Size, string> = {
    sm: "h-9 w-9",
    md: "h-10 w-10",
    lg: "h-11 w-11",
  };
  return <Skeleton className={cn("rounded-full", sizeToBox[size], className)} />;
}

/** Button skeleton with an icon circle + label bar */
export function ButtonSkeletonWithIcon({
  className,
  size = "md",
  fullWidth = false,
}: ButtonSkeletonProps) {
  const sizeToH: Record<Size, string> = { sm: "h-9", md: "h-10", lg: "h-11" };
  const h = sizeToH[size];

  return (
    <div className={cn("flex items-center gap-2", fullWidth ? "w-full" : "w-48", className)}>
      <Skeleton className={cn("rounded-full", h, "aspect-square")} />
      <Skeleton className={cn("rounded-full", h, "flex-1")} />
    </div>
  );
}
