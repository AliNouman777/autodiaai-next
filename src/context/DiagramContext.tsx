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
import { useRouter } from "next/navigation";
import { DiagramAPI, type Diagram, type UpdateDiagramBody } from "@/lib/api";

// ===== Types =====
type DiagramContextType = {
  diagramRef: React.RefObject<HTMLDivElement>;
  setReactFlowInstance: (instance: ReactFlowInstance) => void;
  exportPNG: () => Promise<void>;
  isExporting: boolean;
};

type SqlDialect = "postgres" | "mysql" | "sqlite";

type ExportOptions = {
  dialect: SqlDialect;
  schema?: string; // for Postgres (optional)
  filename?: string; // desired filename without extension
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
  exportSQL: (
    id: string,
    opts: ExportOptions
  ) => Promise<{ blob: Blob; filename: string }>;
};

// ===== Helpers =====
function isUnauthorized(err: unknown) {
  const e = err as any;
  if (!e) return false;
  if (e.status === 401) return true; // from your api.ts normalized error
  if (typeof e?.message === "string" && /unauthorized|401/i.test(e.message))
    return true;
  if (typeof e === "string" && /unauthorized|401/i.test(e)) return true;
  return false;
}

function redirectToLoginWithNext(router: ReturnType<typeof useRouter>) {
  if (typeof window === "undefined") return;
  const current = window.location.pathname + window.location.search;
  router.replace(`/login`);
}

// ===== Contexts =====
const DiagramContext = createContext<DiagramContextType | null>(null);
const DiagramApiContext = createContext<DiagramApiContextType | null>(null);

// ===== Provider =====
export const DiagramProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

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

  // Centralized 401 guard wrapper
  const run = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      try {
        return await fn();
      } catch (e) {
        if (isUnauthorized(e)) {
          redirectToLoginWithNext(router);
        }
        throw e;
      }
    },
    [router]
  );

  // API actions
  const listDiagrams = useCallback(
    async (opts?: { page?: number; limit?: number }) => {
      setFetching(true);
      try {
        const { items } = await run(() => DiagramAPI.list(opts));
        setDiagrams(items ?? null);
        return items ?? [];
      } finally {
        setFetching(false);
      }
    },
    [run]
  );

  const createDiagram = useCallback(
    async (name: string, type: string) => {
      setCreating(true);
      try {
        return await run(() => DiagramAPI.create({ name, type }));
      } finally {
        setCreating(false);
      }
    },
    [run]
  );

  const updateDiagram = useCallback(
    async (id: string, body: UpdateDiagramBody) => {
      setUpdating(true);
      try {
        return await run(() => DiagramAPI.update(id, body));
      } finally {
        setUpdating(false);
      }
    },
    [run]
  );

  const deleteDiagram = useCallback(
    async (id: string) => {
      setDeleting(true);
      try {
        await run(() => DiagramAPI.delete(id));
        setDiagrams((prev) => (prev ? prev.filter((d) => d._id !== id) : prev));
      } finally {
        setDeleting(false);
      }
    },
    [run]
  );

  const getDiagram = useCallback(
    async (id: string) => {
      const doc = await run(() => DiagramAPI.get(id));
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
    },
    [run]
  );

  const exportSQL = useCallback(
    async (
      id: string,
      opts: ExportOptions
    ): Promise<{ blob: Blob; filename: string }> => {
      const params = new URLSearchParams();
      params.set("dialect", opts.dialect);
      if (opts.schema) params.set("schema", opts.schema);
      if (opts.filename) params.set("filename", opts.filename);
      const baseUrlRef =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const url = `${baseUrlRef}/api/diagrams/${id}/export.sql?${params.toString()}`;
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`Export failed: ${res.status} ${t}`);
      }

      const blob = await res.blob();

      // Try to read filename from Content-Disposition
      let filename = `${opts.filename || "diagram"}.sql`;
      const dispo =
        res.headers.get("Content-Disposition") ||
        res.headers.get("content-disposition");
      if (dispo) {
        const m = /filename\*?=(?:UTF-8''|")?([^\";]+)/i.exec(dispo);
        if (m?.[1]) {
          try {
            filename = decodeURIComponent(m[1].replace(/"/g, ""));
          } catch {
            filename = m[1].replace(/"/g, "");
          }
        }
      }

      // If server didn’t set, fallback to query-provided name
      if (!filename.endsWith(".sql")) filename += ".sql";
      return { blob, filename };
    },
    []
  );

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
      getDiagram,
      exportSQL,
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
      exportSQL,
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

export function useExportSql() {
  const ctx = useContext(DiagramApiContext);
  if (!ctx) throw new Error("useExportSql must be used inside DiagramProvider");
  return ctx;
}

export function useDiagramApi() {
  const ctx = useContext(DiagramApiContext);
  if (!ctx)
    throw new Error("useDiagramApi must be used within DiagramProvider");
  return ctx;
}
