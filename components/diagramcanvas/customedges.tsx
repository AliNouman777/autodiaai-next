import React from "react";
import { BaseEdge, getBezierPath, EdgeProps } from "@xyflow/react";

// 2. Pass your type as generic argument to EdgeProps
export default function SuperCurvyEdge(props: EdgeProps) {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    markerStart,
    markerEnd,
    interactionWidth,
    data,
  } = props;

  // Custom Bezier path with extra curvature:
  const curveAmount = 200;
  const edgePath = `
    M ${sourceX},${sourceY}
    C ${sourceX + curveAmount},${sourceY}
      ${targetX - curveAmount},${targetY}
      ${targetX},${targetY}
  `;

  return (
    <>
      <svg style={{ display: "none" }}>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </svg>

      <BaseEdge
        path={edgePath}
        markerStart={markerStart ? `${markerStart}` : undefined}
        markerEnd={markerEnd ? `${markerEnd}` : undefined}
        interactionWidth={interactionWidth}
      />
    </>
  );
}
