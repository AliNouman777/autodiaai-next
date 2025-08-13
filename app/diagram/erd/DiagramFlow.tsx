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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Markers } from "@/components/diagramcanvas/markers";
import CustomERDNode from "@/components/diagramcanvas/CustomERDNode";
import SuperCurvyEdge from "@/components/diagramcanvas/customedges";
import { useDiagram } from "@/src/context/DiagramContext";

const nodeTypes = { databaseSchema: CustomERDNode };
const edgeTypes = { superCurvyEdge: SuperCurvyEdge };

/* --------------------------------- Handles -------------------------------- */

type HandleMap = Record<
  string,
  {
    all: Set<string>;
    defaultLeft: string | null;
    defaultRight: string | null;
  }
>;

function buildHandleMap(nodes: Node[]): HandleMap {
  const map: HandleMap = {};
  for (const n of nodes) {
    const handles = new Set<string>();
    let defaultLeft: string | null = null;
    let defaultRight: string | null = null;

    // Expect node.data.schema: [{ id, title, type, key? }]
    const schema: any[] =
      (n as any)?.data?.schema ?? (n as any)?.data?.fields ?? [];

    if (Array.isArray(schema)) {
      for (const f of schema) {
        const fid = typeof f?.id === "string" ? f.id.trim() : "";
        if (!fid) continue;
        const L = `${fid}-left`;
        const R = `${fid}-right`;
        handles.add(L);
        handles.add(R);
        if (!defaultLeft) defaultLeft = L;
        if (!defaultRight) defaultRight = R;
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

/**
 * IMPORTANT: We only connect edges to *existing* field handles.
 * If a node has no field handles -> we drop the edge (don't guess "1-left/right").
 */
function sanitizeEdges(rawEdges: any[], nodes: Node[]) {
  const map = buildHandleMap(nodes);
  const fixed: Edge[] = [];
  let warned = false;

  for (const raw of rawEdges ?? []) {
    const e = coerceEdge(raw);
    const src = map[e.source];
    const tgt = map[e.target];

    // must reference existing nodes
    if (!src || !tgt) continue;

    // if either side has no handles, drop the edge
    if (src.all.size === 0 || tgt.all.size === 0) {
      if (!warned && process.env.NODE_ENV !== "production") {
        console.warn(
          "[DiagramFlow] Dropping edges that reference nodes without field handles. " +
            "Ensure node.data.schema has fields with 'id' so handles like '<fieldId>-left/right' exist."
        );
        warned = true;
      }
      continue;
    }

    // choose valid handles (prefer the provided ones if valid, else fall back)
    const srcHandleValid = e.sourceHandle && src.all.has(e.sourceHandle);
    const tgtHandleValid = e.targetHandle && tgt.all.has(e.targetHandle);

    const sourceHandle = srcHandleValid ? e.sourceHandle! : src.defaultRight!;
    const targetHandle = tgtHandleValid ? e.targetHandle! : tgt.defaultLeft!;

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

/* -------------------------- Flip helpers (unchanged) ----------------------- */

function getNodeCenter(node: any): [number, number] {
  const width = node.width ?? 150;
  const height = node.height ?? 50;
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

/* --------------------------------- Component -------------------------------- */

type Props = {
  diagramId?: string;
  initialNodes: Node[];
  initialEdges: Edge[];
};

const DiagramFlow: React.FC<Props> = ({
  diagramId,
  initialNodes,
  initialEdges,
}) => {
  const { diagramRef, setReactFlowInstance } = useDiagram();

  // sanitize once for initial props
  const saneInitialEdges = useMemo(
    () => sanitizeEdges(initialEdges ?? [], initialNodes ?? []),
    [initialEdges, initialNodes]
  );

  const [nodes, setNodes] = useState<Node[]>(initialNodes ?? []);
  const [edges, setEdges] = useState<Edge[]>(saneInitialEdges);

  // sync on prop changes
  useEffect(() => {
    setNodes(initialNodes ?? []);
  }, [initialNodes]);

  useEffect(() => {
    setEdges(sanitizeEdges(initialEdges ?? [], initialNodes ?? []));
  }, [initialEdges, initialNodes]);

  // hover state
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const handleNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nds) => {
      const updatedNodes = applyNodeChanges(changes, nds);

      // keep your flip logic
      setEdges((currentEdges) => {
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
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // derive hover decorations
  const connectedEdges = useMemo(() => {
    if (!hoveredNodeId) return [];
    return edges.filter(
      (e) => e.source === hoveredNodeId || e.target === hoveredNodeId
    );
  }, [edges, hoveredNodeId]);

  const connectedNodeIds = useMemo(() => {
    const ids = new Set<string>();
    connectedEdges.forEach((e) =>
      ids.add(e.source === hoveredNodeId ? e.target : e.source)
    );
    return ids;
  }, [connectedEdges, hoveredNodeId]);

  const nodesWithHover = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          onNodeHover: () => setHoveredNodeId(n.id),
          onNodeUnhover: () => setHoveredNodeId(null),
          isHovered: hoveredNodeId === n.id,
          isConnected: connectedNodeIds.has(n.id),
        },
      })),
    [nodes, hoveredNodeId, connectedNodeIds]
  );

  const connectedEdgeIds = useMemo(
    () => new Set(connectedEdges.map((e) => e.id)),
    [connectedEdges]
  );

  const edgesWithHover = useMemo(
    () =>
      edges.map((e) => ({
        ...e,
        animated: connectedEdgeIds.has(e.id),
        data: {
          ...(e.data || {}),
          isConnected: connectedEdgeIds.has(e.id),
          hoveredNodeId,
        },
      })),
    [edges, connectedEdgeIds, hoveredNodeId]
  );

  return (
    <div className="w-full h-full bg-gray-100" ref={diagramRef}>
      <ReactFlow
        nodes={nodesWithHover}
        edges={edgesWithHover}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onNodesChange={handleNodesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
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
