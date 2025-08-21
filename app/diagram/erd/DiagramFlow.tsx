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
  ReactFlow,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  ArrowLeftRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Workflow,
  ChevronDown,
} from "lucide-react";

import { Markers } from "@/components/diagramcanvas/markers";
import CustomERDNode from "@/components/diagramcanvas/CustomERDNode";
import AdaptiveEdge from "@/components/diagramcanvas/AdaptiveEdge";
import { useDiagram } from "@/src/context/DiagramContext";
import { useParams, usePathname } from "next/navigation";
import { HandleMap, Props, RankDir } from "@/types/flowdiagram";
import { layoutWithDagre, getNodeSize } from "./dagreLayout";
import { FloatingDock } from "@/components/ui/floating-dock";

/* Node/edge renderers */
const nodeTypes = { databaseSchema: CustomERDNode };
const edgeTypes = { adaptiveEdge: AdaptiveEdge };

/* Edge type (single custom edge with variants) */
type EdgeRenderType = "curvy" | "step" | "smoothstep" | "straight" | "bezier";
const EDGE_TYPE_LS_KEY = "diagram.edgeType";

/* -------------------- Handle map / sanitization -------------------- */
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

/* Deterministic fallback id (avoids SSR/CSR mismatches) */
function stableEdgeId(e: any) {
  const s = String(e?.source ?? "");
  const t = String(e?.target ?? "");
  const sh = String(e?.sourceHandle ?? "");
  const th = String(e?.targetHandle ?? "");
  return `e:${s}|${sh}=>${t}|${th}`;
}

function coerceEdge(e: any): Edge {
  const id = typeof e?.id === "string" && e.id ? e.id : stableEdgeId(e);
  return {
    id,
    source: String(e?.source ?? ""),
    target: String(e?.target ?? ""),
    sourceHandle: e?.sourceHandle ?? null,
    targetHandle: e?.targetHandle ?? null,
    type: "adaptiveEdge",
    markerStart: e?.markerStart ?? "one-start",
    markerEnd: e?.markerEnd ?? "one-end",
    data: e?.data ?? {},
  } as Edge;
}

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
      markerStart: e.markerStart ?? "one-start",
      markerEnd: e.markerEnd ?? "one-end",
      data: e.data ?? {},
    });
  }
  return fixed;
}

/* -------------------- Small helpers -------------------- */
function getNodeCenter(node: any): [number, number] {
  const width = (node.width as number) ?? 240;
  const height = (node.height as number) ?? 120;
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

/* -------------------- Component -------------------- */
const DiagramFlow: React.FC<Props> = ({
  nodes,
  edges,
  layout = "LR",
  diagramId,
}) => {
  const { diagramRef, setReactFlowInstance, exportPNG, isExporting } =
    useDiagram();

  // Resolve diagramId
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
      console.warn("[DiagramFlow] diagramId is missing; node APIs may fail.");
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

  // Hydration-safe edge variant
  const [edgeRenderType, setEdgeRenderType] = useState<EdgeRenderType>("curvy");
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
    try {
      const saved = localStorage.getItem(
        EDGE_TYPE_LS_KEY
      ) as EdgeRenderType | null;
      const allowed = [
        "curvy",
        "step",
        "smoothstep",
        "straight",
        "bezier",
      ] as const;
      if (saved && (allowed as readonly string[]).includes(saved)) {
        setEdgeRenderType(saved);
      }
    } catch {}
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(EDGE_TYPE_LS_KEY, edgeRenderType);
    } catch {}
  }, [edgeRenderType, hydrated]);

  const edgeTypeLabel = useMemo(() => {
    const labels: Record<EdgeRenderType, string> = {
      curvy: "Curvy",
      step: "Step",
      smoothstep: "Smooth",
      straight: "Straight",
      bezier: "Bezier",
    };
    return labels[edgeRenderType];
  }, [edgeRenderType]);

  // Layout + sanitize on inputs change
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

  /* ---------- PERFORMANCE: index edges by node to avoid scanning all edges ---------- */
  const nodeEdgeIndex = useMemo(() => {
    const m = new Map<string, Edge[]>();
    for (const e of edgesState) {
      if (!m.has(e.source)) m.set(e.source, []);
      if (!m.has(e.target)) m.set(e.target, []);
      m.get(e.source)!.push(e);
      m.get(e.target)!.push(e);
    }
    return m;
  }, [edgesState]);

  // Hover (optional)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  /* ---------- PERFORMANCE: rAF throttle for flip work during drags ---------- */
  const pendingChangesRef = useRef<ReturnType<typeof applyNodeChanges> | null>(
    null
  );
  const flipRAF = useRef<number | null>(null);

  const processFlipWork = useCallback(
    (updatedNodes: Node[]) => {
      let anyFlip = false;
      const idToNode = new Map(updatedNodes.map((n) => [n.id, n]));
      const newEdges = edgesState.map((edge) => edge); // shallow copy reference
      const byId = new Map(newEdges.map((e) => [e.id, e]));

      // For each node that moved, only inspect its connected edges
      for (const n of updatedNodes) {
        const connected = nodeEdgeIndex.get(n.id);
        if (!connected) continue;

        for (const edge of connected) {
          const sourceNode = idToNode.get(edge.source);
          const targetNode = idToNode.get(edge.target);
          if (!sourceNode || !targetNode) continue;

          const [sx, sy] = getNodeCenter(sourceNode);
          const [tx, ty] = getNodeCenter(targetNode);

          const shouldFlip =
            (layoutDir === "TB" && sy > ty) || (layoutDir !== "TB" && sx > tx);

          if (shouldFlip) {
            const markerStart =
              typeof edge.markerEnd === "string"
                ? flipMarkerName(edge.markerEnd)
                : edge.markerEnd;
            const markerEnd =
              typeof edge.markerStart === "string"
                ? flipMarkerName(edge.markerStart)
                : edge.markerStart;

            const flipped: Edge = {
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

            byId.set(edge.id, flipped);
            anyFlip = true;
          }
        }
      }

      if (anyFlip) {
        // Rebuild array only if something actually changed
        setEdgesState(Array.from(byId.values()));
      }
    },
    [edgesState, layoutDir, nodeEdgeIndex]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      // 1) Apply node changes immediately
      setNodesState((nds) => applyNodeChanges(changes, nds));

      // 2) If there were position changes, schedule one flip pass for this frame
      const hasPositionChange = changes.some((c) => c.type === "position");
      if (!hasPositionChange) return;

      // Run at most once per animation frame
      if (flipRAF.current) cancelAnimationFrame(flipRAF.current);
      flipRAF.current = requestAnimationFrame(() => {
        // Read the latest nodes and do minimal flip work
        setNodesState((latest) => {
          processFlipWork(latest);
          return latest;
        });
      });
    },
    [processFlipWork]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdgesState((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdgesState((eds) => addEdge(params, eds)),
    []
  );

  // Connected highlights
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

  const edgesForRender = useMemo(
    () =>
      edgesState.map((e) => ({
        ...e,
        type: "adaptiveEdge" as const,
        animated: connectedEdgeIds.has(e.id),
        data: {
          ...(e.data || {}),
          variant: edgeRenderType,
          isConnected: connectedEdgeIds.has(e.id),
          hoveredNodeId,
        },
      })),
    [edgesState, connectedEdgeIds, hoveredNodeId, edgeRenderType]
  );

  /* Layout + viewport controls */
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

  return (
    <div className="relative w-full h-full bg-gray-100">
      {/* Bottom controls: Dock + Edge-type dropdown */}
      <div
        data-export-exclude="true"
        className="absolute bottom-2 inset-x-0 mx-auto w-fit z-30 flex items-center gap-2"
      >
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
          desktopClassName="w-fit"
          mobileClassName="w-fit"
        />

        {/* Edge type dropdown (hydration-safe label) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-xl border-slate-300 bg-white/90 backdrop-blur hover:bg-white"
              title="Edge type"
            >
              <Workflow className="w-4 h-4 mr-2" />
              <span className="text-xs">
                {
                  {
                    curvy: "Curvy",
                    step: "Step",
                    smoothstep: "Smooth",
                    straight: "Straight",
                    bezier: "Bezier",
                  }[edgeRenderType]
                }
              </span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[160px]">
            <DropdownMenuRadioGroup
              value={edgeRenderType}
              onValueChange={(v) => setEdgeRenderType(v as EdgeRenderType)}
            >
              <DropdownMenuRadioItem value="step">Step</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="smoothstep">
                Smooth Step
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="straight">
                Straight
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bezier">
                Bezier
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Canvas */}
      <ReactFlow
        nodes={nodesWithHover}
        edges={edgesForRender}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        fitView
        ref={diagramRef}
        onlyRenderVisibleElements
        proOptions={{ hideAttribution: true }}
        className="!bg-background"
      >
        <Background color="var(--border)" />

        <Markers color={hoveredNodeId ? "#0042ff" : " #fff"} />
      </ReactFlow>
    </div>
  );
};

export default DiagramFlow;
