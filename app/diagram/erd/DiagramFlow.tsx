"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type ReactFlowInstance,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { Markers } from "@/components/diagramcanvas/markers";
import CustomERDNode from "@/components/diagramcanvas/CustomERDNode";
import SuperCurvyEdge from "@/components/diagramcanvas/customedges";
import { useDiagram } from "@/src/context/DiagramContext";

const nodeTypes = { databaseSchema: CustomERDNode };
const edgeTypes = { superCurvyEdge: SuperCurvyEdge };

/* =========================
   Handle map / sanitization
========================= */

type HandleMap = Record<
  string,
  {
    all: Set<string>;
    defaultLeft: string | null;
    defaultRight: string | null;
  }
>;

/** Build a set of valid handle ids for each node.
 * Supports both "fieldId-left/right" and "nodeId-fieldId-left/right".
 */
function buildHandleMap(nodes: Node[]): HandleMap {
  const map: HandleMap = {};
  for (const n of nodes) {
    const handles = new Set<string>();
    let defaultLeft: string | null = null;
    let defaultRight: string | null = null;

    const schema: any[] =
      (n as any)?.data?.schema ?? (n as any)?.data?.fields ?? [];

    if (Array.isArray(schema)) {
      for (const f of schema) {
        const rawId =
          typeof f?.id === "string" && f.id.trim()
            ? f.id.trim()
            : typeof f?.fieldId === "string" && f.fieldId.trim()
            ? f.fieldId.trim()
            : "";
        if (!rawId) continue;

        const plainL = `${rawId}-left`;
        const plainR = `${rawId}-right`;
        const prefL = `${n.id}-${rawId}-left`;
        const prefR = `${n.id}-${rawId}-right`;

        handles.add(plainL);
        handles.add(plainR);
        handles.add(prefL);
        handles.add(prefR);

        if (!defaultLeft) defaultLeft = prefL;
        if (!defaultRight) defaultRight = prefR;
      }
    }

    map[n.id] = { all: handles, defaultLeft, defaultRight };
  }
  return map;
}

function coerceEdge(e: any): Edge {
  const id = String(
    e?.id ??
      `${e?.source}-${e?.target}-${Math.random().toString(36).slice(2, 8)}`
  );
  return {
    id,
    source: String(e?.source ?? ""),
    target: String(e?.target ?? ""),
    sourceHandle: e?.sourceHandle ?? null,
    targetHandle: e?.targetHandle ?? null,
    type: e?.type ?? "superCurvyEdge",
    markerStart: e?.markerStart ?? "one-start",
    markerEnd: e?.markerEnd ?? "one-end",
    data: e?.data ?? {},
  } as Edge;
}

/** Enforce that edges connect to **existing** field handles. */
function sanitizeEdges(rawEdges: any[], nodes: Node[]) {
  const map = buildHandleMap(nodes);
  const fixed: Edge[] = [];
  let warned = false;

  for (const raw of rawEdges ?? []) {
    const e = coerceEdge(raw);
    const src = map[e.source];
    const tgt = map[e.target];
    if (!src || !tgt) continue;

    if (src.all.size === 0 || tgt.all.size === 0) {
      if (!warned && process.env.NODE_ENV !== "production") {
        console.warn(
          "[DiagramFlow] Dropping edges referencing nodes without field handles."
        );
        warned = true;
      }
      continue;
    }

    const srcValid = !!(e.sourceHandle && src.all.has(e.sourceHandle));
    const tgtValid = !!(e.targetHandle && tgt.all.has(e.targetHandle));

    const sourceHandle = srcValid ? e.sourceHandle! : src.defaultRight!;
    const targetHandle = tgtValid ? e.targetHandle! : tgt.defaultLeft!;

    if (!sourceHandle || !targetHandle) continue;

    fixed.push({
      ...e,
      sourceHandle,
      targetHandle,
      type: e.type ?? "superCurvyEdge",
      markerStart: e.markerStart ?? "one-start",
      markerEnd: e.markerEnd ?? "one-end",
      data: e.data ?? {},
    });
  }
  return fixed;
}

/* ===============
   Dagre layout
=============== */

const DEFAULT_NODE_W = 260;
const DEFAULT_NODE_H = 120;

type RankDir = "LR" | "TB";

function layoutWithDagre(
  nodes: Node[],
  edges: Edge[],
  direction: RankDir = "LR"
): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: direction, // "LR" left->right, "TB" top->bottom
    nodesep: 40,
    ranksep: 80,
    edgesep: 20,
    marginx: 20,
    marginy: 20,
  });
  g.setDefaultEdgeLabel(() => ({}));

  // Use known/measured size if present; otherwise a safe default
  nodes.forEach((n) => {
    const width =
      (n as any).width ??
      (typeof (n as any)?.style?.width === "number"
        ? (n as any).style.width
        : DEFAULT_NODE_W);
    const height =
      (n as any).height ??
      (typeof (n as any)?.style?.height === "number"
        ? (n as any).style.height
        : DEFAULT_NODE_H);

    g.setNode(n.id, { width, height });
  });

  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  // Place each node at Dagre's computed center minus half width/height
  return nodes.map((n) => {
    const { x, y } = g.node(n.id) || { x: 0, y: 0 };
    const width =
      (n as any).width ??
      (typeof (n as any)?.style?.width === "number"
        ? (n as any).style.width
        : DEFAULT_NODE_W);
    const height =
      (n as any).height ??
      (typeof (n as any)?.style?.height === "number"
        ? (n as any).style.height
        : DEFAULT_NODE_H);

    // Hint to edges about preferred connection sides
    const horizontal = direction === "LR";
    const sourcePosition = horizontal ? Position.Right : Position.Bottom;
    const targetPosition = horizontal ? Position.Left : Position.Top;

    return {
      ...n,
      position: { x: x - width / 2, y: y - height / 2 },
      sourcePosition,
      targetPosition,
      // prevent Dagre positions from being overridden by RF initial auto-positioning
      draggable: true,
    };
  });
}

/* =========================
   Flip helpers (unchanged)
========================= */

function getNodeCenter(node: any): [number, number] {
  const width = node.width ?? DEFAULT_NODE_W;
  const height = node.height ?? DEFAULT_NODE_H;
  return [node.position.x + width / 2, node.position.y + height / 2];
}
function flipMarkerName(name: string) {
  if (typeof name !== "string") return name as any;
  if (name.endsWith("-start")) return name.replace(/-start$/, "-end");
  if (name.endsWith("-end")) return name.replace(/-end$/, "-start");
  return name;
}
function flipHandleId(handleId?: string) {
  if (!handleId) return handleId;
  if (handleId.endsWith("-left")) return handleId.replace(/-left$/, "-right");
  if (handleId.endsWith("-right")) return handleId.replace(/-right$/, "-left");
  return handleId;
}

/* =========================
   Component
========================= */

type Props = {
  nodes: Node[];
  edges: Edge[];
  layout?: RankDir; // "LR" or "TB" (default LR)
};

const DiagramFlow: React.FC<Props> = ({ nodes, edges, layout = "LR" }) => {
  const { diagramRef, setReactFlowInstance } = useDiagram();

  // React Flow instance for fitView after layout
  const rfRef = useRef<ReactFlowInstance | null>(null);
  const onInit = useCallback(
    (inst: ReactFlowInstance) => {
      rfRef.current = inst;
      setReactFlowInstance(inst);
      inst.fitView({ padding: 0.2 });
    },
    [setReactFlowInstance]
  );

  // Local interactive state
  const [nodesState, setNodesState] = useState<Node[]>([]);
  const [edgesState, setEdgesState] = useState<Edge[]>([]);

  // Recompute layout whenever parent sends a new graph
  useEffect(() => {
    const sanitized = sanitizeEdges(edges ?? [], nodes ?? []);
    const laidOut = layoutWithDagre(nodes ?? [], sanitized, layout);
    setNodesState(laidOut);
    setEdgesState(sanitized);

    // ensure the new layout is visible
    requestAnimationFrame(() => rfRef.current?.fitView({ padding: 0.2 }));
  }, [nodes, edges, layout]);

  // Hover state
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodesState((nds) => {
      const updatedNodes = applyNodeChanges(changes, nds);

      // Keep your horizontal flip logic
      setEdgesState((currentEdges) => {
        let updatedEdges = [...currentEdges];

        changes.forEach((change) => {
          if (change.type !== "position") return;

          const changedNode = updatedNodes.find((n) => n.id === change.id);
          if (!changedNode) return;

          currentEdges.forEach((edge) => {
            if (edge.source !== change.id && edge.target !== change.id) return;

            const sourceNode = updatedNodes.find((n) => n.id === edge.source);
            const targetNode = updatedNodes.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return;

            const [sx] = getNodeCenter(sourceNode);
            const [tx] = getNodeCenter(targetNode);
            const shouldFlip = sx > tx;

            if (shouldFlip) {
              const markerStart =
                typeof edge.markerEnd === "string"
                  ? flipMarkerName(edge.markerEnd)
                  : edge.markerEnd;
              const markerEnd =
                typeof edge.markerStart === "string"
                  ? flipMarkerName(edge.markerStart)
                  : edge.markerStart;

              const flippedEdge: Edge = {
                ...edge,
                source: edge.target,
                target: edge.source,
                sourceHandle:
                  flipHandleId(edge.targetHandle ?? undefined) ?? undefined,
                targetHandle:
                  flipHandleId(edge.sourceHandle ?? undefined) ?? undefined,
                markerStart: markerStart as any,
                markerEnd: markerEnd as any,
              };

              updatedEdges = updatedEdges.map((e) =>
                e.id === edge.id ? flippedEdge : e
              );
            }
          });
        });

        return updatedEdges;
      });

      return updatedNodes;
    });
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdgesState((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdgesState((eds) => addEdge(params, eds)),
    []
  );

  // Derived hover decorations
  const connectedEdges = useMemo(() => {
    if (!hoveredNodeId) return [];
    return edgesState.filter(
      (e) => e.source === hoveredNodeId || e.target === hoveredNodeId
    );
  }, [edgesState, hoveredNodeId]);

  const connectedNodeIds = useMemo(() => {
    const ids = new Set<string>();
    connectedEdges.forEach((e) =>
      ids.add(e.source === hoveredNodeId ? e.target : e.source)
    );
    return ids;
  }, [connectedEdges, hoveredNodeId]);

  const nodesWithHover = useMemo(
    () =>
      nodesState.map((n) => ({
        ...n,
        data: {
          ...n.data,
          onNodeHover: () => setHoveredNodeId(n.id),
          onNodeUnhover: () => setHoveredNodeId(null),
          isHovered: hoveredNodeId === n.id,
          isConnected: connectedNodeIds.has(n.id),
        },
      })),
    [nodesState, hoveredNodeId, connectedNodeIds]
  );

  const connectedEdgeIds = useMemo(
    () => new Set(connectedEdges.map((e) => e.id)),
    [connectedEdges]
  );

  const edgesWithHover = useMemo(
    () =>
      edgesState.map((e) => ({
        ...e,
        animated: connectedEdgeIds.has(e.id),
        data: {
          ...(e.data || {}),
          isConnected: connectedEdgeIds.has(e.id),
          hoveredNodeId,
        },
      })),
    [edgesState, connectedEdgeIds, hoveredNodeId]
  );

  return (
    <div className="w-full h-full bg-gray-100" ref={diagramRef}>
      <ReactFlow
        nodes={nodesWithHover}
        edges={edgesWithHover}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        fitView
      >
        <Background />
        <Controls />
        <Markers color={hoveredNodeId ? "#0042ff" : "#666"} />
      </ReactFlow>
    </div>
  );
};

export default DiagramFlow;
