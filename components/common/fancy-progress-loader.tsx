"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

export type FancyProgressLoaderProps = {
  loading: boolean;
  phases?: string[];
  baseDurationMs?: number;
  tailDurationMs?: number;
  showSkeleton?: boolean;
  withBackdrop?: boolean;
  className?: string;
  children?: React.ReactNode;
  // Streaming props
  progressText?: string;
  streamingProgress?: number;
  connectionStatus?: "disconnected" | "connecting" | "connected";
  onCancel?: () => void;
  isStreaming?: boolean;
};

export function FancyProgressLoader({
  loading,
  phases,
  baseDurationMs = 4500,
  tailDurationMs = 3500,
  showSkeleton = true,
  withBackdrop = false,
  className,
  children,
  // Streaming props
  progressText,
  streamingProgress,
  connectionStatus,
  onCancel,
  isStreaming,
}: FancyProgressLoaderProps) {
  const defaultPhases = useMemo(
    () => [
      "Parsing prompt…",
      "Generating tables…",
      "Inferring relations…",
      "Laying out graph…",
    ],
    []
  );
  const PHASES = phases && phases.length > 0 ? phases : defaultPhases;

  const [progress, setProgress] = useState(0);
  const [phaseLabel, setPhaseLabel] = useState(PHASES[0]);

  const startTsRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const phaseSchedule = useMemo(() => {
    const step = baseDurationMs / PHASES.length;
    return PHASES.map((label, i) => ({ atMs: Math.round(i * step), label }));
  }, [baseDurationMs, PHASES]);

  function curve(ms: number) {
    const t = Math.min(ms / baseDurationMs, 1);
    const base = 1 - Math.pow(1 - t, 2.2);
    const fast = Math.min(base * 0.964, 0.964);

    const extraMs = Math.max(ms - baseDurationMs, 0);
    const tail = 1 - Math.exp(-extraMs / tailDurationMs);
    const add = tail * 0.03;
    let p = fast + add;

    const jitter = (Math.sin(ms / 750) + Math.cos(ms / 480)) * 0.003;
    p = Math.max(0, Math.min(0.994, p + jitter));
    return p * 100;
  }

  const tick = () => {
    const now = performance.now();
    const elapsed = now - startTsRef.current;

    const current = [...phaseSchedule]
      .reverse()
      .find((ph) => elapsed >= ph.atMs);
    if (current && current.label !== phaseLabel) setPhaseLabel(current.label);

    setProgress((prev) => Math.max(prev, curve(elapsed)));
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (loading) {
      setProgress(0);
      setPhaseLabel(PHASES[0]);
      startTsRef.current = performance.now();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      };
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setPhaseLabel("Finalizing…");
      setProgress(100);
      const id = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, baseDurationMs, tailDurationMs, PHASES.join("|")]);

  const pct = Math.round(Math.min(100, Math.max(0, progress)));

  // Determine which progress and text to use
  const displayProgress =
    isStreaming && streamingProgress !== undefined ? streamingProgress : pct;
  const displayText = isStreaming && progressText ? progressText : phaseLabel;

  // Connection status indicator
  const getConnectionStatusColor = () => {
    if (!isStreaming) return "bg-gray-400";
    switch (connectionStatus) {
      case "connecting":
        return "bg-yellow-500";
      case "connected":
        return "bg-green-500";
      case "disconnected":
        return "bg-orange-500"; // Orange for cancelled
      default:
        return "bg-gray-400";
    }
  };

  const getConnectionStatusText = () => {
    if (!isStreaming) return "Ready";
    switch (connectionStatus) {
      case "connecting":
        return "Connecting...";
      case "connected":
        return "Generating ERD...";
      case "disconnected":
        return "Cancelled";
      default:
        return "Ready";
    }
  };

  return (
    <div
      className={clsx(
        "relative w-full h-full grid place-items-center",
        withBackdrop &&
          "before:content-[''] before:absolute before:inset-0 before:bg-background/40 before:backdrop-blur-sm",
        className
      )}
    >
      <div className="relative w-[min(760px,94%)] rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-[0_10px_30px_rgba(2,6,23,0.08)] p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-foreground">
              {displayText}
            </div>
            {isStreaming && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${getConnectionStatusColor()} ${
                    isStreaming ? "animate-pulse" : ""
                  }`}
                />
                <span className="text-xs text-muted-foreground">
                  {getConnectionStatusText()}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm tabular-nums font-semibold text-foreground">
              {displayProgress}%
            </div>
            {isStreaming && onCancel && (
              <button
                onClick={onCancel}
                className="px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Progress track */}
        <div
          className="relative h-3 w-full rounded-full bg-muted overflow-hidden"
          role="progressbar"
          aria-valuenow={displayProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Generation progress"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-200 will-change-[width]"
            style={{ width: `${displayProgress}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 pointer-events-none opacity-70 dark:opacity-40"
            style={{
              width: `${displayProgress}%`,
              background:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.6) 0 8px, rgba(255,255,255,0.15) 8px 16px)",
              animation: isStreaming
                ? "stripeMove 1.2s linear infinite"
                : "none",
            }}
          />
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {isStreaming
            ? "Real-time AI generation in progress..."
            : "Preparing your ERD (nodes, relations, layout)."}
        </p>

        {showSkeleton && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={clsx(
                  "rounded-xl border border-border bg-card shadow-sm p-3 animate-pulse",
                  // Hide cards after the first two on screens <= 646px
                  i > 1 && "max-[646px]:hidden"
                )}
              >
                <div className="h-4 w-28 bg-muted rounded mb-3" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-[85%]" />
                  <div className="h-3 bg-muted rounded w-[70%]" />
                  <div className="h-3 bg-muted rounded w-[92%]" />
                  <div className="h-3 bg-muted rounded w-[63%]" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 blur-2xl" />

        {children}
      </div>

      <style jsx>{`
        @keyframes stripeMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 40px 0;
          }
        }
      `}</style>
    </div>
  );
}

export default FancyProgressLoader;
