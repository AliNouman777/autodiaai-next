"use client";

import React, { memo, useMemo } from "react";
import {
  BaseEdge,
  type EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
} from "@xyflow/react";

/** Geometry variants this single edge can render */
type Variant = "curvy" | "step" | "smoothstep" | "straight" | "bezier";

export type AdaptiveEdgeData = {
  variant?: Variant;
  isConnected?: boolean;
  /** Optional hard override color. If omitted, theme classes are used. */
  color?: string;
  strokeWidth?: number;
};

const AdaptiveEdge = memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerStart,
    markerEnd,
    interactionWidth,
    data,
  } = props;

  const {
    variant = "curvy",
    isConnected = false,
    color,
    strokeWidth,
  } = (data || {}) as AdaptiveEdgeData;

  const path = useMemo(() => {
    switch (variant) {
      case "step": {
        const [p] = getSmoothStepPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
          borderRadius: 0,
        });
        return p;
      }
      case "smoothstep": {
        const [p] = getSmoothStepPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
          borderRadius: 8,
        });
        return p;
      }
      case "straight": {
        const [p] = getStraightPath({ sourceX, sourceY, targetX, targetY });
        return p;
      }
      case "bezier": {
        const [p] = getBezierPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
        });
        return p;
      }
      case "curvy":
      default: {
        const curveAmount = 100;
        return `
          M ${sourceX},${sourceY}
          C ${sourceX + curveAmount},${sourceY}
            ${targetX - curveAmount},${targetY}
            ${targetX},${targetY}
        `;
      }
    }
  }, [
    variant,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  ]);

  // If a color override is not supplied, use theme classes.
  // - Default edge: muted foreground (resolves via CSS vars in both themes)
  // - Connected edge: primary color
  const themeColorClass = color
    ? ""
    : isConnected
    ? "text-primary"
    : "text-muted-foreground dark:text-slate-300";

  const width = strokeWidth ?? (isConnected ? 1.8 : 1);

  return (
    <>
      {/* Subtle glow when connected (uses current stroke color) */}
      <svg style={{ display: "none" }}>
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </svg>

      <BaseEdge
        path={path}
        markerStart={markerStart || undefined}
        markerEnd={markerEnd || undefined}
        interactionWidth={interactionWidth}
        className={themeColorClass}
        style={{
          stroke: color ?? "currentColor", // <- theme-aware stroke
          strokeWidth: width,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          vectorEffect: "non-scaling-stroke",
          filter: isConnected ? `url(#glow-${id})` : "none",
        }}
      />
    </>
  );
});

export default AdaptiveEdge;
