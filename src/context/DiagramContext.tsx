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

/* -------------------------------- Types -------------------------------- */

type DiagramContextType = {
  diagramRef: React.RefObject<HTMLDivElement>;
  setReactFlowInstance: (instance: ReactFlowInstance) => void;
  exportPNG: () => Promise<void>;
  isExporting: boolean;
};

type SqlDialect = "postgres" | "mysql" | "sqlite";

type ExportOptions = {
  dialect: SqlDialect;
  schema?: string;
  filename?: string;
};

/** UI shows "", "PK", "FK"; backend expects "NONE", "PK", "FK" */
export type KeyKindUI = "" | "PK" | "FK";
type KeyKindServer = "NONE" | "PK" | "FK";

type FieldPatchUI = {
  id?: string;
  title?: string;
  type?: string;
  key?: KeyKindUI;
};

type FieldCreateUI = {
  id: string;
  title: string;
  type: string;
  key?: KeyKindUI; // optional in UI, will default to "NONE" on server
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

  /** --- Node Schema CRUD (matches backend routes) --- */
  updateNodeLabel: (
    diagramId: string,
    nodeId: string,
    label: string
  ) => Promise<void>;

  /** Upsert a field (PATCH /schema/:fieldId). If fieldId doesn't exist server will create it. */
  updateField: (
    diagramId: string,
    nodeId: string,
    fieldId: string,
    patch:
      | { id: string; title: string; type: string; key?: KeyKindUI }
      | FieldPatchUI
  ) => Promise<void>;

  /** Delete an existing field */
  deleteField: (
    diagramId: string,
    nodeId: string,
    fieldId: string
  ) => Promise<void>;

  /** (Optional) Create explicitly (POST /schema) */
  addField: (
    diagramId: string,
    nodeId: string,
    field: FieldCreateUI
  ) => Promise<void>;

  /** (Optional) Reorder fields (PATCH /schema/reorder) */
  reorderFields: (
    diagramId: string,
    nodeId: string,
    order: string[]
  ) => Promise<void>;
};

/* ------------------------------- Helpers ------------------------------- */

function isUnauthorized(err: unknown) {
  const e = err as any;
  if (!e) return false;
  if (e.status === 401) return true;
  if (typeof e?.message === "string" && /unauthorized|401/i.test(e.message))
    return true;
  if (typeof e === "string" && /unauthorized|401/i.test(e)) return true;
  return false;
}

function redirectToLoginWithNext(router: ReturnType<typeof useRouter>) {
  if (typeof window === "undefined") return;
  router.replace(`/login`);
}

const toServerKey = (k?: KeyKindUI): KeyKindServer => {
  if (k === "PK" || k === "FK") return k;
  return "NONE";
};

/* ------------------------------- Contexts ------------------------------ */

const DiagramContext = createContext<DiagramContextType | null>(null);
const DiagramApiContext = createContext<DiagramApiContextType | null>(null);

/* -------------------------------- Provider ----------------------------- */

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

  /* ----------------------------- Diagram CRUD ----------------------------- */

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

      if (!filename.endsWith(".sql")) filename += ".sql";
      return { blob, filename };
    },
    []
  );

  /* ----------------------- Node Schema CRUD (frontend) ---------------------- */

  const baseURL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
  ).replace(/\/+$/, "");

  const updateNodeLabel = useCallback(
    async (diagramId: string, nodeId: string, label: string) => {
      setUpdating(true);
      try {
        await run(async () => {
          const res = await fetch(
            `${baseURL}/api/diagrams/${encodeURIComponent(
              diagramId
            )}/nodes/${encodeURIComponent(nodeId)}/label`,
            {
              method: "PATCH",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ label }),
            }
          );
          if (!res.ok) {
            const t = await res.text().catch(() => "");
            throw new Error(`updateNodeLabel failed: ${res.status} ${t}`);
          }
        });
      } finally {
        setUpdating(false);
      }
    },
    [run, baseURL]
  );

  const updateField = useCallback(
    async (
      diagramId: string,
      nodeId: string,
      fieldId: string,
      patch:
        | FieldPatchUI
        | { id: string; title: string; type: string; key?: KeyKindUI }
    ) => {
      setUpdating(true);
      try {
        await run(async () => {
          const body: any = { ...patch };
          if ("key" in body) body.key = toServerKey(body.key);
          const res = await fetch(
            `${baseURL}/api/diagrams/${encodeURIComponent(
              diagramId
            )}/nodes/${encodeURIComponent(nodeId)}/schema/${encodeURIComponent(
              fieldId
            )}`,
            {
              method: "PATCH",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }
          );
          if (!res.ok) {
            const t = await res.text().catch(() => "");
            throw new Error(`updateField failed: ${res.status} ${t}`);
          }
        });
      } finally {
        setUpdating(false);
      }
    },
    [run, baseURL]
  );

  const deleteField = useCallback(
    async (diagramId: string, nodeId: string, fieldId: string) => {
      setUpdating(true);
      try {
        await run(async () => {
          const res = await fetch(
            `${baseURL}/api/diagrams/${encodeURIComponent(
              diagramId
            )}/nodes/${encodeURIComponent(nodeId)}/schema/${encodeURIComponent(
              fieldId
            )}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );
          if (!res.ok) {
            const t = await res.text().catch(() => "");
            throw new Error(`deleteField failed: ${res.status} ${t}`);
          }
        });
      } finally {
        setUpdating(false);
      }
    },
    [run, baseURL]
  );

  const addField = useCallback(
    async (diagramId: string, nodeId: string, field: FieldCreateUI) => {
      setUpdating(true);
      try {
        await run(async () => {
          const body = { ...field, key: toServerKey(field.key) };
          const res = await fetch(
            `${baseURL}/api/diagrams/${encodeURIComponent(
              diagramId
            )}/nodes/${encodeURIComponent(nodeId)}/schema`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }
          );
          if (!res.ok) {
            const t = await res.text().catch(() => "");
            throw new Error(`addField failed: ${res.status} ${t}`);
          }
        });
      } finally {
        setUpdating(false);
      }
    },
    [run, baseURL]
  );

  const reorderFields = useCallback(
    async (diagramId: string, nodeId: string, order: string[]) => {
      setUpdating(true);
      try {
        await run(async () => {
          const res = await fetch(
            `${baseURL}/api/diagrams/${encodeURIComponent(
              diagramId
            )}/nodes/${encodeURIComponent(nodeId)}/schema/reorder`,
            {
              method: "PATCH",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order }),
            }
          );
          if (!res.ok) {
            const t = await res.text().catch(() => "");
            throw new Error(`reorderFields failed: ${res.status} ${t}`);
          }
        });
      } finally {
        setUpdating(false);
      }
    },
    [run, baseURL]
  );

  /* ----------------------------- Memoized values ---------------------------- */

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

      // Node schema CRUD
      updateNodeLabel,
      updateField,
      deleteField,
      addField,
      reorderFields,
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

      updateNodeLabel,
      updateField,
      deleteField,
      addField,
      reorderFields,
    ]
  );

  // Canvas/export actions
  const setReactFlowInstance = useCallback((instance: ReactFlowInstance) => {
    setRfInstance(instance);
  }, []);

  const exportPNG = useCallback(async () => {
    if (!diagramRef.current || !rfInstance) return;

    // 2–4 is crisp; files get larger as you go up
    const EXPORT_SCALE = Math.min(4, (window.devicePixelRatio || 1) * 2);
    const PAD = 24; // extra room for arrowheads/outer glow, etc.

    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));

    // Read the *actual* on-screen bounds of nodes + edge paths
    const getGraphBBox = (root: HTMLElement) => {
      const rootRect = root.getBoundingClientRect();
      const elements = Array.from(
        root.querySelectorAll<HTMLElement>(
          // nodes + primary edge paths + connection line + edge labels
          ".react-flow__node, .react-flow__edge-path, .react-flow__connectionline, .react-flow__edge-text"
        )
      );

      if (!elements.length) {
        return { x: 0, y: 0, w: rootRect.width, h: rootRect.height };
      }

      let minL = Infinity,
        minT = Infinity,
        maxR = -Infinity,
        maxB = -Infinity;

      for (const el of elements) {
        // Use DOM client rects (already include transforms and stroke width)
        const r = el.getBoundingClientRect();
        minL = Math.min(minL, r.left);
        minT = Math.min(minT, r.top);
        maxR = Math.max(maxR, r.right);
        maxB = Math.max(maxB, r.bottom);
      }

      // Convert page coords -> container-local coords
      const x = minL - rootRect.left;
      const y = minT - rootRect.top;
      const w = maxR - minL;
      const h = maxB - minT;

      return { x, y, w, h };
    };

    try {
      setIsExporting(true);

      // Ensure everything is visible and settled
      rfInstance.fitView({ padding: 1 });
      await new Promise((r) => setTimeout(r, 240));

      const container = diagramRef.current;

      // 1) Measure DOM bounds
      const box = getGraphBBox(container);
      let x = Math.max(0, Math.floor(box.x - PAD));
      let y = Math.max(0, Math.floor(box.y - PAD));
      let w = Math.ceil(box.w + PAD * 2);
      let h = Math.ceil(box.h + PAD * 2);

      // 2) Render container to a big canvas, skipping the dock
      const fullCanvas = await htmlToImage.toCanvas(container, {
        backgroundColor: "white",
        pixelRatio: EXPORT_SCALE,
        cacheBust: true,
        skipFonts: false,
        filter: (el) => {
          // Exclude anything wrapped in data-export-exclude="true"
          return !(el as HTMLElement)?.closest?.(
            '[data-export-exclude="true"]'
          );
        },
      } as any);

      // 3) Crop to the measured box (convert CSS px -> canvas px)
      const cw = container.clientWidth;
      const ratio = fullCanvas.width / cw;

      const sx = clamp(Math.floor(x * ratio), 0, fullCanvas.width - 1);
      const sy = clamp(Math.floor(y * ratio), 0, fullCanvas.height - 1);
      const sw = clamp(Math.ceil(w * ratio), 1, fullCanvas.width - sx);
      const sh = clamp(Math.ceil(h * ratio), 1, fullCanvas.height - sy);

      const out = document.createElement("canvas");
      out.width = sw;
      out.height = sh;

      const ctx = out.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(fullCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

      const dataUrl = out.toDataURL("image/png");
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

/* --------------------------------- Hooks -------------------------------- */

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
