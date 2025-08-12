"use client";
import * as htmlToImage from "html-to-image";
import type { ReactFlowInstance } from "@xyflow/react";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { DiagramAPI, type Diagram, type UpdateDiagramBody } from "@/lib/api";

// ===== Types =====
type DiagramContextType = {
  diagramRef: React.RefObject<HTMLDivElement>;
  setReactFlowInstance: (instance: ReactFlowInstance) => void;
  exportPNG: () => Promise<void>;
  isExporting: boolean;
};

type DiagramApiContextType = {
  creating: boolean;
  updating: boolean;
  fetching: boolean;
  deleting: boolean;
  diagrams: Diagram[] | null;
  createDiagram: (name: string, type: string) => Promise<Diagram>;
  listDiagrams: (opts?: {
    page?: number;
    limit?: number;
  }) => Promise<Diagram[]>;
  updateDiagram: (id: string, body: UpdateDiagramBody) => Promise<Diagram>;
  deleteDiagram: (id: string) => Promise<void>;
  getDiagram: (id: string) => Promise<Diagram>;
};

// ===== Contexts =====
const DiagramContext = createContext<DiagramContextType | null>(null);
const DiagramApiContext = createContext<DiagramApiContextType | null>(null);

// ===== Provider =====
export const DiagramProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Canvas / export state
  const diagramRef = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // API state
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [diagrams, setDiagrams] = useState<Diagram[] | null>(null);

  // API actions
  const listDiagrams = useCallback(
    async (opts?: { page?: number; limit?: number }) => {
      setFetching(true);
      try {
        const { items } = await DiagramAPI.list(opts);
        setDiagrams(items);
        return items;
      } finally {
        setFetching(false);
      }
    },
    []
  );

  const createDiagram = useCallback(async (name: string, type: string) => {
    setCreating(true);
    try {
      return await DiagramAPI.create({ name, type });
    } finally {
      setCreating(false);
    }
  }, []);

  const updateDiagram = useCallback(
    async (id: string, body: UpdateDiagramBody) => {
      setUpdating(true);
      try {
        return await DiagramAPI.update(id, body);
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  const deleteDiagram = useCallback(async (id: string) => {
    setDeleting(true);
    try {
      await DiagramAPI.delete(id);
      setDiagrams((prev) => (prev ? prev.filter((d) => d._id !== id) : prev));
    } finally {
      setDeleting(false);
    }
  }, []);

  const getDiagram = useCallback(async (id: string) => {
    // optional: setFetching(true) if you want global spinner
    const doc = await DiagramAPI.get(id);
    // optionally merge into list cache
    setDiagrams((prev) => {
      if (!prev) return prev;
      const idx = prev.findIndex((d) => d._id === doc._id);
      if (idx === -1) return prev;
      const copy = prev.slice();
      copy[idx] = doc;
      return copy;
    });
    return doc;
  }, []);

  const apiValue = useMemo(
    () => ({
      creating,
      updating,
      fetching,
      deleting,
      diagrams,
      listDiagrams,
      createDiagram,
      updateDiagram,
      deleteDiagram,
      getDiagram, // 👈 include
    }),
    [
      creating,
      updating,
      fetching,
      deleting,
      diagrams,
      listDiagrams,
      createDiagram,
      updateDiagram,
      deleteDiagram,
      getDiagram,
    ]
  );

  // Canvas/export actions
  const setReactFlowInstance = useCallback((instance: ReactFlowInstance) => {
    setRfInstance(instance);
  }, []);

  const exportPNG = useCallback(async () => {
    if (!diagramRef.current || !rfInstance) return;

    try {
      setIsExporting(true);

      // Fit into view, then wait a tick for layout to settle
      rfInstance.fitView({ padding: 0.2 });
      await new Promise((r) => setTimeout(r, 300));

      const dataUrl = await htmlToImage.toPng(diagramRef.current, {
        backgroundColor: "white",
        quality: 1,
      });

      const link = document.createElement("a");
      link.download = "diagram.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setIsExporting(false);
    }
  }, [rfInstance]);

  const diagramValue = useMemo(
    () => ({ diagramRef, setReactFlowInstance, exportPNG, isExporting }),
    [exportPNG, isExporting, setReactFlowInstance]
  );

  return (
    <DiagramContext.Provider value={diagramValue}>
      <DiagramApiContext.Provider value={apiValue}>
        {children}
      </DiagramApiContext.Provider>
    </DiagramContext.Provider>
  );
};

// ===== Hooks =====
export function useDiagram() {
  const ctx = useContext(DiagramContext);
  if (!ctx) throw new Error("useDiagram must be used inside DiagramProvider");
  return ctx;
}

export function useDiagramApi() {
  const ctx = useContext(DiagramApiContext);
  if (!ctx)
    throw new Error("useDiagramApi must be used within DiagramProvider");
  return ctx;
}
