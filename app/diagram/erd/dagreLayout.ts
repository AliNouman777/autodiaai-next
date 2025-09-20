// layout.ts
import dagre from "dagre";
import { Position, type Edge, type Node } from "@xyflow/react";
import type { RankDir } from "@/types/flowdiagram";

// Exported so DiagramFlow can reuse as fallback sizes (e.g., getNodeCenter)
export const DEFAULT_NODE_W = 260;
export const DEFAULT_NODE_H = 120;

/** Rough fallback when a node hasn't measured itself yet. */
// Rationale: Improve type safety by replacing 'any' with proper interface
export function estimateERDSize(n: {
  data?: {
    schema?: Array<{ title: string; type: string }>;
    label?: string;
  };
  schema?: Array<{ title: string; type: string }>;
}) {
  const rows = Array.isArray(n?.data?.schema)
    ? n.data.schema.length
    : Array.isArray(n?.schema)
    ? n.schema.length
    : 0;
  const header = 36; // label bar
  const rowH = 24; // per-field row
  const padding = 12;
  const minW = 220;

  const title = String(n?.data?.label ?? "Table");
  const titleW = 9 * Math.min(title.length, 28); // rough text width

  const width = Math.max(minW, 180 + titleW);
  const height = header + rows * rowH + padding;
  return { width, height };
}

/** Read actual node width/height when available; otherwise estimate. */
// Rationale: Improve type safety by replacing 'any' with proper interface
export function getNodeSize(n: {
  data?: {
    schema?: Array<{ title: string; type: string }>;
    label?: string;
  };
  schema?: Array<{ title: string; type: string }>;
  width?: number;
  height?: number;
  style?: { width?: number; height?: number };
}) {
  const width =
    n.width ??
    (typeof n?.style?.width === "number" ? n.style.width : undefined);
  const height =
    n.height ??
    (typeof n?.style?.height === "number" ? n.style.height : undefined);

  if (typeof width === "number" && typeof height === "number") {
    return { width, height };
  }
  return estimateERDSize(n);
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Compute dagre spacings dynamically based on node sizes, viewport, and density.
 * This results in tighter but readable layouts without hardcoding gaps.
 */
export function computeGaps(nodes: Node[], direction: RankDir) {
  const sizes = nodes.map((n) => getNodeSize(n as any));
  const widths = sizes.map((s) => s.width);
  const heights = sizes.map((s) => s.height);

  const avg = (arr: number[]) =>
    arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);
  const max = (arr: number[]) => arr.reduce((a, b) => Math.max(a, b), 0);

  const avgW = avg(widths) || DEFAULT_NODE_W;
  const avgH = avg(heights) || DEFAULT_NODE_H;
  const maxW = max(widths) || DEFAULT_NODE_W;
  const maxH = max(heights) || DEFAULT_NODE_H;

  // Viewport-aware scaling
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const area = vw * vh;
  const nodeArea = avgW * avgH;

  const capacity = Math.max(1, Math.floor(area / Math.max(1, nodeArea * 2)));
  const rawDensity = nodes.length / capacity;
  const density = clamp(rawDensity, 0.5, 2);

  // Softer density attenuation for smoother packing
  const densityAdj = Math.pow(density, 0.6);

  // Compact base gaps
  const baseNodeSep =
    direction === "LR" ? avgW * 0.22 + maxW * 0.04 : avgW * 0.18 + maxW * 0.04;
  const baseRankSep =
    direction === "LR" ? avgH * 0.5 + maxH * 0.06 : avgH * 0.65 + maxH * 0.06;

  const nodesep = clamp(Math.round(baseNodeSep / densityAdj), 12, 320);
  const ranksep = clamp(Math.round(baseRankSep / densityAdj), 16, 420);
  const edgesep = clamp(Math.round((avgW + avgH) * 0.03), 8, 40);
  const margin = clamp(Math.round(Math.min(avgW, avgH) * 0.12), 8, 24);

  return {
    nodesep,
    ranksep,
    edgesep,
    marginx: margin,
    marginy: margin,
  };
}

/**
 * Generate a dagre layout and return nodes with positioned coordinates and
 * correct handle positions for the current rank direction.
 */
export function layoutWithDagre(
  nodes: Node[],
  edges: Edge[],
  direction: RankDir = "LR"
): Node[] {
  const g = new dagre.graphlib.Graph();
  const gaps = computeGaps(nodes, direction);

  g.setGraph({ rankdir: direction, ...gaps });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((n) => {
    const { width, height } = getNodeSize(n as any);
    g.setNode(n.id, { width, height });
  });

  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);

  return nodes.map((n) => {
    const { x, y } = g.node(n.id) || { x: 0, y: 0 };
    const { width, height } = getNodeSize(n as any);

    const horizontal = direction === "LR";
    const sourcePosition = horizontal ? Position.Right : Position.Bottom;
    const targetPosition = horizontal ? Position.Left : Position.Top;

    return {
      ...n,
      position: { x: x - width / 2, y: y - height / 2 },
      sourcePosition,
      targetPosition,
      draggable: true,
      width,
      height,
    };
  });
}
