"use client";
import React, { useCallback, useMemo, useState } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Markers } from "@/components/diagramcanvas/markers";
import CustomERDNode from "@/components/diagramcanvas/CustomERDNode";
import SuperCurvyEdge from "@/components/diagramcanvas/customedges";
import { useDiagram } from "@/src/context/DiagramContext";



// ---- Node & Edge Types ----
const nodeTypes = { databaseSchema: CustomERDNode };
const edgeTypes = { superCurvyEdge: SuperCurvyEdge };

// ---- Initial Data ----
import { initialNodes, initialEdges } from "@/data/initialdata";

// ---- Marker Flip Helper ----
function flipMarkerName(name: string) {
  if (typeof name !== "string") return name;
  if (name.endsWith("-start")) return name.replace(/-start$/, "-end");
  if (name.endsWith("-end")) return name.replace(/-end$/, "-start");
  return name;
}

// ---- Handle Flip Helper ----
function flipHandleId(handleId?: string) {
  if (!handleId) return handleId;
  if (handleId.endsWith("-left")) return handleId.replace(/-left$/, "-right");
  if (handleId.endsWith("-right")) return handleId.replace(/-right$/, "-left");
  return handleId;
}

// ---- Calculate Node Center ----
function getNodeCenter(node: any): [number, number] {
  const width = node.width ?? 150; // fallback width
  const height = node.height ?? 50; // fallback height
  return [node.position.x + width / 2, node.position.y + height / 2];
}

const DiagramFlow = () => {
  const { diagramRef, setReactFlowInstance } = useDiagram();
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // ---- Main Nodes Change with Flip Logic ----
  const handleNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => {
        const updatedNodes = applyNodeChanges(changes, nds);

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
                    ? flipMarkerName(edge.markerEnd.replace("url(#", "").replace(")", ""))
                    : edge.markerEnd;
                const markerEnd =
                  typeof edge.markerStart === "string"
                    ? flipMarkerName(edge.markerStart.replace("url(#", "").replace(")", ""))
                    : edge.markerStart;

                const flippedEdge = {
                  ...edge,
                  source: edge.target,
                  target: edge.source,
                  sourceHandle: flipHandleId(edge.targetHandle),
                  targetHandle: flipHandleId(edge.sourceHandle),
                  markerStart,
                  markerEnd,
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
    },
    []
  );

  // ---- Edges Change ----
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // ---- On Connect ----
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // ---- Hover Logic ----
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

  // ---- Nodes with Hover State ----
  const nodesWithHover = useMemo(() => {
    return nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        onNodeHover: () => setHoveredNodeId(n.id),
        onNodeUnhover: () => setHoveredNodeId(null),
        isHovered: hoveredNodeId === n.id,
        isConnected: connectedNodeIds.has(n.id),
      },
    }));
  }, [nodes, hoveredNodeId, connectedNodeIds]);

  // ---- Edges with Hover State ----
  const connectedEdgeIds = useMemo(
    () => new Set(connectedEdges.map((e) => e.id)),
    [connectedEdges]
  );

  const edgesWithHover = useMemo(() => {
    return edges.map((e) => ({
      ...e,
      animated: connectedEdgeIds.has(e.id),
      data: {
        ...(e.data || {}),
        isConnected: connectedEdgeIds.has(e.id),
        hoveredNodeId,
      },
    }));
  }, [edges, connectedEdgeIds, hoveredNodeId]);

  return (
    <div className="w-full h-full bg-gray-100 " ref={diagramRef}>
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
