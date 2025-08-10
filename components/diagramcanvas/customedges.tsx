import React, { memo } from "react";
import { BaseEdge, EdgeProps } from "@xyflow/react";

const SuperCurvyEdge = memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    markerStart,
    markerEnd,
    interactionWidth,
    data,
  } = props;

  const curveAmount = 100;
  const edgePath = `
    M ${sourceX},${sourceY}
    C ${sourceX + curveAmount},${sourceY}
      ${targetX - curveAmount},${targetY}
      ${targetX},${targetY}
  `;

  const isConnected = !!data?.isConnected;

  return (
    <>
      {/* Define filter once per edge */}
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
        path={edgePath}
        markerStart={markerStart || undefined}
        markerEnd={markerEnd || undefined}
        interactionWidth={interactionWidth}
        style={{
          stroke: isConnected ? "#0042ff" : "#666",
          strokeWidth: isConnected ? 1.8 : 1,
          filter: isConnected ? `url(#glow-${id})` : "none",
        }}
      />
    </>
  );
});

export default SuperCurvyEdge;
