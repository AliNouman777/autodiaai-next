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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Markers } from "@/components/diagramcanvas/markers";
import CustomERDNode from "@/components/diagramcanvas/CustomERDNode";
import SuperCurvyEdge from "@/components/diagramcanvas/customedges";
import { useDiagram } from "@/src/context/DiagramContext";
import { useParams, usePathname } from "next/navigation";
import { HandleMap, Props, RankDir } from "@/types/flowdiagram";
import {
  ArrowUpDown,
  ArrowLeftRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  RotateCcw,
} from "lucide-react";

// 🔁 Layout utilities moved to dagreLayout.ts
import {
  layoutWithDagre,
  getNodeSize,
  DEFAULT_NODE_W,
  DEFAULT_NODE_H,
} from "./dagreLayout";

// Your compact FloatingDock (supports onClick/actions)
import { FloatingDock } from "@/components/ui/floating-dock";

/* -------------------- Node/edge renderers -------------------- */
const nodeTypes = { databaseSchema: CustomERDNode };
const edgeTypes = { superCurvyEdge: SuperCurvyEdge };

/* =========================
   Handle map / sanitization
========================= */

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

/** Enforce that edges connect to existing field handles. */
function sanitizeEdges(rawEdges: any[], nodes: Node[]) {
  const map = buildHandleMap(nodes);
  const fixed: Edge[] = [];

  for (const raw of rawEdges ?? []) {
    const e = coerceEdge(raw);
    const src = map[e.source];
    const tgt = map[e.target];
    if (!src || !tgt) continue;

    if (src.all.size === 0 || tgt.all.size === 0) continue;

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

/* =========================
   Small helpers
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

const DiagramFlow: React.FC<Props> = ({
  nodes,
  edges,
  layout = "LR",
  diagramId,
}) => {
  const { diagramRef, setReactFlowInstance, exportPNG, isExporting } =
    useDiagram();

  // Resolve diagramId: prefer prop -> route param -> pathname match
  const params = useParams() as any;
  const pathname = usePathname() || "";
  const idFromParam = params?.id as string | undefined;
  const idFromPath = useMemo(() => {
    const m = pathname.match(/\/diagram\/[^/]+\/([^/]+)/i);
    return m?.[1];
  }, [pathname]);
  const resolvedDiagramId = diagramId || idFromParam || idFromPath || "";

  useEffect(() => {
    if (!resolvedDiagramId) {
      console.warn(
        "[DiagramFlow] diagramId is missing; CustomERDNode API calls will fail."
      );
    }
  }, [resolvedDiagramId]);

  // React Flow instance
  const rfRef = useRef<ReactFlowInstance | null>(null);
  const onInit = useCallback(
    (inst: ReactFlowInstance) => {
      rfRef.current = inst;
      setReactFlowInstance(inst);
      inst.fitView({ padding: 0.15 });
    },
    [setReactFlowInstance]
  );

  // Local state
  const [nodesState, setNodesState] = useState<Node[]>([]);
  const [edgesState, setEdgesState] = useState<Edge[]>([]);
  const [layoutDir, setLayoutDir] = useState<RankDir>(layout);

  // Recompute layout whenever inputs or layoutDir change
  useEffect(() => {
    const sanitized = sanitizeEdges(edges ?? [], nodes ?? []);
    const sized = (nodes ?? []).map((n) => {
      const { width, height } = getNodeSize(n as any);
      return { ...n, width, height };
    });
    const laidOut = layoutWithDagre(sized, sanitized, layoutDir);
    setNodesState(laidOut);
    setEdgesState(sanitized);
    requestAnimationFrame(() => rfRef.current?.fitView({ padding: 0.15 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, layoutDir]);

  // Hover state
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodesState((nds) => {
      const updatedNodes = applyNodeChanges(changes, nds);

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

  const onConnect: OnConnect = useCallback((params) => {
    setEdgesState((eds) => addEdge(params, eds));
  }, []);

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

  // Inject diagramId + hover flags into each node
  const nodesWithHover = useMemo(
    () =>
      nodesState.map((n) => ({
        ...n,
        data: {
          ...n.data,
          diagramId: resolvedDiagramId,
          onNodeHover: () => setHoveredNodeId(n.id),
          onNodeUnhover: () => setHoveredNodeId(null),
          isHovered: hoveredNodeId === n.id,
          isConnected: connectedNodeIds.has(n.id),
        },
      })),
    [nodesState, hoveredNodeId, connectedNodeIds, resolvedDiagramId]
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

  /* ------------------------- Layout + controller actions ------------------------- */
  const applyLayout = useCallback(
    (dir: RankDir) => {
      setLayoutDir(dir);
      setNodesState((curr) => layoutWithDagre(curr, edgesState, dir));
      requestAnimationFrame(() => rfRef.current?.fitView({ padding: 0.15 }));
    },
    [edgesState]
  );

  const fitViewNow = useCallback(() => {
    rfRef.current?.fitView?.({ padding: 0.15 });
  }, []);

  const zoomBy = useCallback((delta: number) => {
    const cur = rfRef.current?.getViewport?.().zoom ?? 1;
    const next = Math.max(0.1, Math.min(4, cur + delta));
    rfRef.current?.zoomTo?.(next);
  }, []);

  /* ------------------------- UI ------------------------- */
  return (
    <div className="relative w-full h-full bg-gray-100">
      {/* Floating controller dock (centered bottom on desktop, bottom-right on mobile) */}
      <div data-export-exclude="true">
        <FloatingDock
          items={[
            {
              title: "Zoom Out",
              icon: <ZoomOut className="w-4 h-4" />,
              onClick: () => zoomBy(-0.2),
            },
            {
              title: "Fit View",
              icon: <Maximize2 className="w-4 h-4" />,
              onClick: fitViewNow,
            },
            {
              title: "Zoom In",
              icon: <ZoomIn className="w-4 h-4" />,
              onClick: () => zoomBy(+0.2),
            },
            {
              title: isExporting ? "Exporting…" : "Export PNG",
              icon: <Download className="w-4 h-4" />,
              onClick: () => exportPNG(),
              active: isExporting,
            },
            {
              title: "Horizontal layout",
              icon: <ArrowLeftRight className="w-4 h-4" />,
              onClick: () => applyLayout("LR"),
              active: layoutDir === "LR",
            },
            {
              title: "Vertical layout",
              icon: <ArrowUpDown className="w-4 h-4" />,
              onClick: () => applyLayout("TB"),
              active: layoutDir === "TB",
            },
          ]}
          desktopClassName="absolute bottom-2 inset-x-0 mx-auto w-fit z-30"
          mobileClassName="fixed bottom-4 right-4 z-30"
        />
      </div>

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
        ref={diagramRef}
      >
        <Background />
        <Markers color={hoveredNodeId ? "#0042ff" : "#666"} />
      </ReactFlow>
    </div>
  );
};

export default DiagramFlow;
