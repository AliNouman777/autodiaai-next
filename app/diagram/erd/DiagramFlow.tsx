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

const nodeTypes = { databaseSchema: CustomERDNode };
const edgeTypes = {
  superCurvyEdge: SuperCurvyEdge,
};

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "databaseSchema",
    data: {
      label: "Patients",
      schema: [
        { id: "patients-id", title: "id", key: "PK", type: "uuid" },
        { id: "patients-name", title: "name", type: "varchar" },
        { id: "patients-dob", title: "dob", type: "date" },
        { id: "patients-gender", title: "gender", type: "varchar" },
        { id: "patients-phone", title: "phone", type: "varchar" },
        { id: "patients-address", title: "address", type: "varchar" },
        { id: "patients-email", title: "email", type: "varchar" },
      ],
    },
  },
  {
    id: "2",
    position: { x: 300, y: 0 },
    type: "databaseSchema",
    data: {
      label: "Doctors",
      schema: [
        { id: "doctors-id", title: "id", key: "PK", type: "uuid" },
        { id: "doctors-name", title: "name", type: "varchar" },
        {
          id: "doctors-specialization",
          title: "specialization",
          type: "varchar",
        },
        {
          id: "doctors-department_id",
          title: "department_id",
          key: "FK",
          type: "uuid",
        },
        { id: "doctors-phone", title: "phone", type: "varchar" },
        { id: "doctors-email", title: "email", type: "varchar" },
      ],
    },
  },
];

// The field-to-field edge (from Patients.id to Doctors.department_id)
const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    sourceHandle: "patients-id-right",
    target: "2",
    targetHandle: "doctors-department_id-left",
    type: "superCurvyEdge", // must match your edgeTypes key
    markerStart: "one-start",
    markerEnd: "zero-end",
    data: {},
  },
];

const DiagramFlow = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const connectedEdges = edges.filter(
    (e) => e.source === hoveredNodeId || e.target === hoveredNodeId
  );

  const connectedNodeIds = new Set(
    connectedEdges.map((e) =>
      e.source === hoveredNodeId ? e.target : e.source
    )
  );

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
    [nodes, hoveredNodeId]
  );

  const connectedEdgeIds = new Set(connectedEdges.map((e) => e.id));

  const edgesWithHover = edges.map((e) => ({
    ...e,
    data: {
      ...(e.data || {}),
      isConnected: connectedEdgeIds.has(e.id),
      // optional: hoveredNodeId for further logic
      hoveredNodeId,
    },
  }));

  return (
    <div className="w-full h-full">
      <style>
        {`
        .glow-blue {
          box-shadow: 0 0 24px 4px #3b82f6, 0 0 48px 8px #2563eb !important;
          transition: box-shadow 0.2s;
        }
        `}
      </style>
      <ReactFlow
        nodes={nodesWithHover}
        edges={edgesWithHover}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <Markers />
      </ReactFlow>
    </div>
  );
};

export default DiagramFlow;
