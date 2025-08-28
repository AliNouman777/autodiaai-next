import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { Handle, Position } from "@xyflow/react";
import { Pencil, Check, X, Trash2, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useDiagramApi } from "@/src/context/DiagramContext";

type KeyKind = "" | "PK" | "FK";

interface Column {
  id: string;
  title: string;
  type: string;
  key?: KeyKind;
}

type SchemaData = {
  diagramId: string; // injected by DiagramFlow
  label: string;
  schema: Column[];
  onChange?: (data: { label: string; schema: Column[] }) => void;
  onNodeUnhover?: () => void;
  onNodeHover?: () => void;
  isHovered?: boolean;
  isConnected?: boolean;
};

type CustomERDNodeProps = {
  id: string; // nodeId from React Flow
  data: SchemaData;
};

const generateId = () =>
  `col-${Math.random().toString(36).slice(2, 8)}-${Date.now()
    .toString()
    .slice(-4)}`;

const isFieldChanged = (a: Column, b: Column) =>
  (a.title ?? "") !== (b.title ?? "") ||
  (a.type ?? "") !== (b.type ?? "") ||
  (a.key ?? "") !== (b.key ?? "");

function getErrorMessage(err: unknown, fallback: string) {
  const e = err as any;
  if (!e) return fallback;
  if (typeof e?.message === "string" && e.message.trim()) return e.message;
  if (typeof e === "string") return e;
  if (typeof e?.data?.message === "string") return e.data.message;
  if (typeof e?.code === "string") return `${fallback} (${e.code})`;
  if (typeof e?.status === "number") return `${fallback} (HTTP ${e.status})`;
  return fallback;
}

export default function CustomERDNode({ id, data }: CustomERDNodeProps) {
  const { updateField, deleteField, updateNodeLabel } = useDiagramApi();

  const nodeId = id;
  const diagramId = data.diagramId;

  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rowBusy, setRowBusy] = useState<Record<string, boolean>>({});
  const [editData, setEditData] = useState(() => ({
    label: data.label,
    schema: [...data.schema],
  }));

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => void (mountedRef.current = false);
  }, []);

  const originalById = useMemo(() => {
    const m = new Map<string, Column>();
    for (const c of data.schema) m.set(c.id, c);
    return m;
  }, [data.schema]);

  const resetEditData = useCallback(() => {
    setEditData({ label: data.label, schema: [...data.schema] });
  }, [data.label, data.schema]);

  const handleSave = useCallback(async () => {
    if (saving) return;

    if (!diagramId) {
      toast.error("Can't save: missing diagram id.");
      setEdit(false);
      return;
    }

    const newLabel = editData.label.trim();
    const oldLabel = data.label.trim();
    const labelChanged = newLabel !== oldLabel;

    const toUpsert = editData.schema.filter((c) => {
      const o = originalById.get(c.id);
      if (!o) {
        return !!c.title.trim() && !!c.type.trim();
      }
      return isFieldChanged(c, o);
    });

    if (!labelChanged && toUpsert.length === 0) {
      setEdit(false);
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Saving changes…");
    try {
      if (labelChanged) {
        await updateNodeLabel(diagramId, nodeId, newLabel);
      }

      if (toUpsert.length > 0) {
        const results = await Promise.allSettled(
          toUpsert.map((f) => {
            const safeKey: KeyKind = (["", "PK", "FK"] as const).includes(
              (f.key ?? "") as any
            )
              ? ((f.key ?? "") as KeyKind)
              : "";
            return updateField(diagramId, nodeId, f.id, {
              id: f.id,
              title: f.title.trim(),
              type: f.type.trim(),
              key: safeKey || undefined,
            });
          })
        );

        const failures = results.filter(
          (r) => r.status === "rejected"
        ) as PromiseRejectedResult[];
        if (failures.length) {
          const first = failures[0].reason;
          throw new Error(
            getErrorMessage(first, "One or more fields failed to save.")
          );
        }
      }

      toast.success("Saved successfully.", { id: toastId });
      setEdit(false);
      data.onChange?.(editData);
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to save changes.");
      console.error("Save node failed:", err);
      toast.error(msg, { id: toastId });
      resetEditData();
    } finally {
      setSaving(false);
    }
  }, [
    saving,
    diagramId,
    nodeId,
    editData,
    data.label,
    originalById,
    updateNodeLabel,
    updateField,
    data.onChange,
    resetEditData,
  ]);

  const handleCancel = useCallback(() => {
    resetEditData();
    setEdit(false);
  }, [resetEditData]);

  const updateCol = useCallback(
    (idx: number, key: keyof Column, value: string) => {
      setEditData((prev) => {
        const updatedSchema = [...prev.schema];
        updatedSchema[idx] = { ...updatedSchema[idx], [key]: value as any };
        return { ...prev, schema: updatedSchema };
      });
    },
    []
  );

  const handleDeleteCol = useCallback(
    async (idx: number) => {
      const col = editData.schema[idx];
      const existed = originalById.has(col.id);

      if (!diagramId) {
        toast.error("Can't delete: missing diagram id.");
        return;
      }

      if (existed) {
        setRowBusy((s) => ({ ...s, [col.id]: true }));
        const toastId = toast.loading("Deleting field…");
        try {
          await deleteField(diagramId, nodeId, col.id);
          toast.success("Field deleted.", { id: toastId });
        } catch (err) {
          const msg = getErrorMessage(err, "Failed to delete field.");
          console.error("Delete field failed:", err);
          toast.error(msg, { id: toastId });
          setRowBusy((s) => {
            const next = { ...s };
            delete next[col.id];
            return next;
          });
          return;
        }
        setRowBusy((s) => {
          const next = { ...s };
          delete next[col.id];
          return next;
        });
      }

      setEditData((prev) => ({
        ...prev,
        schema: prev.schema.filter((_, i) => i !== idx),
      }));

      data.onChange?.({
        label: editData.label,
        schema: editData.schema.filter((_, i) => i !== idx),
      });
    },
    [
      editData.schema,
      editData.label,
      originalById,
      deleteField,
      diagramId,
      nodeId,
      data.onChange,
    ]
  );

  const handleAddRow = useCallback(() => {
    setEditData((prev) => ({
      ...prev,
      schema: [
        ...prev.schema,
        { id: generateId(), title: "", type: "", key: "" },
      ],
    }));
    toast.success("New row added.");
  }, []);

  const glowClasses = [
    data.isHovered &&
      "ring-2 ring-primary shadow-[0_0_40px_rgba(59,130,246,0.35)]",
    data.isConnected &&
      "ring-2 ring-violet-500 dark:ring-violet-400 shadow-[0_0_50px_rgba(139,92,246,0.35)]",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`min-w-[250px] rounded-lg bg-card border border-border shadow  transition-shadow font-sans text-xs duration-150 relative group ${glowClasses}`}
      onMouseEnter={data.onNodeHover}
      onMouseLeave={data.onNodeUnhover}
    >
      {/* Action Buttons */}
      <div className="absolute top-1 right-2 flex gap-1 z-10">
        {!edit ? (
          <button
            type="button"
            onClick={() => setEdit(true)}
            className="opacity-80 hover:opacity-100 text-primary-foreground bg-primary rounded p-1 transition-colors cursor-pointer"
            title="Edit Table"
          >
            <Pencil size={16} />
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`rounded p-1 transition-colors ${
                saving
                  ? "text-green-600 bg-card/60 cursor-not-allowed"
                  : "text-green-600 bg-card hover:bg-green-100 dark:hover:bg-green-950/40"
              }`}
              title="Save"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Check size={16} />
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="text-destructive bg-card rounded hover:bg-destructive/10 p-1 transition-colors disabled:opacity-50"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </>
        )}
      </div>

      {/* Table Label */}
      {!edit ? (
        <div className="bg-primary text-primary-foreground px-2.5 py-1.5 font-bold rounded-t-lg text-center text-sm transition-colors">
          {editData.label}
        </div>
      ) : (
        <input
          value={editData.label}
          onChange={(e) =>
            setEditData((prev) => ({ ...prev, label: e.target.value }))
          }
          className="bg-muted border-b-2 border-primary px-2.5 py-1.5 font-bold rounded-t-lg text-center text-sm w-full focus:outline-none text-foreground transition-colors"
        />
      )}

      {/* Schema Columns */}
      <div>
        {editData.schema.map((col, idx) => {
          const busy = !!rowBusy[col.id];
          const bgClass =
            col.key === "PK"
              ? "bg-amber-100 dark:bg-amber-900/30"
              : col.key === "FK"
              ? "bg-blue-100 dark:bg-blue-900/30"
              : "bg-card";
          return (
            <div
              key={col.id}
              className={`flex items-center px-2 py-1 border-b border-border last:border-b-0 ${bgClass} relative min-h-[32px] hover:bg-muted/70 transition-colors`}
            >
              {/* Left Handle */}
              <Handle
                type="target"
                position={Position.Left}
                id={`${col.id}-left`}
                className="w-2 h-2 absolute -left-2 top-1/2 -translate-y-1/2 bg-primary"
              />

              {!edit ? (
                <span className="flex justify-between w-full">
                  <span className="flex items-center ml-2">
                    {col.key && (
                      <span className="mr-1.5 text-xs">
                        {col.key === "PK" ? "🔑" : col.key === "FK" ? "🔗" : ""}
                      </span>
                    )}
                    <span className="font-medium text-foreground">
                      {col.title}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {col.type}
                  </span>
                </span>
              ) : (
                <>
                  <span className="flex items-center gap-1 ml-2">
                    <select
                      value={col.key ?? ""}
                      onChange={(e) =>
                        updateCol(idx, "key", e.target.value as KeyKind)
                      }
                      className="rounded border border-border text-xs focus:border-primary bg-background w-[52px] transition-colors"
                      disabled={busy}
                    >
                      <option value="">None</option>
                      <option value="PK">PK</option>
                      <option value="FK">FK</option>
                    </select>
                    <input
                      value={col.title}
                      onChange={(e) => updateCol(idx, "title", e.target.value)}
                      className="border-b border-border focus:border-primary bg-transparent px-1 py-0.5 w-20 text-xs text-foreground transition-colors"
                      disabled={busy}
                    />
                  </span>
                  <input
                    value={col.type}
                    onChange={(e) => updateCol(idx, "type", e.target.value)}
                    className="border-b border-border focus:border-primary bg-transparent px-1 py-0.5 w-14 text-xs text-foreground transition-colors"
                    disabled={busy}
                  />
                  <button
                    type="button"
                    title="Delete row"
                    onClick={() => handleDeleteCol(idx)}
                    className="ml-2 text-destructive hover:text-destructive/80 p-1 disabled:opacity-50 transition-colors"
                    disabled={busy}
                  >
                    {busy ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                  </button>
                </>
              )}

              {/* Right Handle */}
              <Handle
                type="source"
                position={Position.Right}
                id={`${col.id}-right`}
                className="w-2 h-2 absolute -right-2 top-1/2 -translate-y-1/2 bg-primary"
              />
            </div>
          );
        })}
      </div>

      {/* Add Row */}
      {edit && (
        <button
          type="button"
          onClick={handleAddRow}
          className="flex items-center justify-center w-full gap-1 text-primary hover:text-primary/80 bg-primary/10 dark:bg-primary/15 hover:bg-primary/15 py-1 transition-colors"
          disabled={saving}
        >
          <Plus size={16} />
          <span className="text-xs font-medium">Add Row</span>
        </button>
      )}
    </div>
  );
}
