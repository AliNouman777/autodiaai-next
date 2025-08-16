// "use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/src/components/ui/shadcn-io/spinner";
import {
  useDiagram,
  useDiagramApi,
  useExportSql,
} from "@/src/context/DiagramContext";
import { AppSelect } from "@/components/common/AppSelect";
import { Tabs } from "@/components/ui/tabs";
import StatefulButton from "@/components/common/StatefulButton";
import { toast } from "react-hot-toast";

// ---- Canonical Model Types ----
type CanonicalModel = "gemini-2.5-flash" | "gemini-2.5-flash-lite";

const MODEL_OPTIONS = [
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite" },
] as const;

type SqlDialect = "postgres" | "mysql" | "sqlite";
const DIALECT_OPTIONS = [
  { value: "postgres", label: "Postgres" },
  { value: "mysql", label: "MySQL" },
  { value: "sqlite", label: "SQLite" },
] as const;

/* =======================
   Reusable Form Panel (presentational)
======================= */

type DiagramFormPanelProps = {
  actionLabel: string;
  actionColor?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  onSubmit?: (
    title?: string,
    description?: string,
    model?: CanonicalModel
  ) => Promise<void>;
  isBusy?: boolean;
};

function DiagramFormPanel({
  actionLabel,
  actionColor = "bg-primary hover:bg-blue-700",
  defaultTitle,
  defaultDescription = "",
  onSubmit,
  isBusy = false,
}: DiagramFormPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState<string>("");
  const [localBusy, setLocalBusy] = useState<boolean>(false);
  const [currentTitle, setCurrentTitle] = useState<string>(defaultTitle ?? "");
  const [description, setDescription] = useState<string>(defaultDescription);
  const [renameBusy, setRenameBusy] = useState<boolean>(false);
  const [model, setModel] = useState<CanonicalModel>("gemini-2.5-flash");

  useEffect(() => {
    setDescription(defaultDescription ?? "");
  }, [defaultDescription]);

  useEffect(() => {
    setCurrentTitle(defaultTitle ?? "");
  }, [defaultTitle]);

  const wordCount = useMemo(() => {
    const trimmed = description.trim();
    return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  }, [description]);

  const beginEditing = () => {
    setTitleDraft(currentTitle.trim());
    setIsEditing(true);
  };

  const handleSaveTitle = async () => {
    if (!onSubmit) return;
    const nextTitle = titleDraft.trim();
    if (!nextTitle) {
      toast.error("Title must not be empty");
      return;
    }
    try {
      setRenameBusy(true);
      await onSubmit(nextTitle);
      setCurrentTitle(nextTitle);
      setIsEditing(false);
    } finally {
      setRenameBusy(false);
    }
  };

  const handleCancelTitle = () => {
    setIsEditing(false);
    setTitleDraft(currentTitle.trim());
  };

  const handleAction = async () => {
    if (!onSubmit) return;
    try {
      setLocalBusy(true);
      const effectiveTitle = isEditing
        ? titleDraft.trim()
        : currentTitle.trim();
      if (!description?.trim()) {
        toast.error("Prompt could not be empty");
        return;
      }
      await onSubmit(effectiveTitle, description, model); // parent handles API + state
    } finally {
      setLocalBusy(false);
    }
  };

  return (
    <div className="w-full overflow-hidden relative h-full rounded-2xl text-gray-700 border-2 bg-white">
      {/* Header */}
      <div className="flex justify-between w-full p-3 items-center">
        <div className="mt-1 flex-1">
          {!isEditing ? (
            <span
              className="block text-lg font-semibold cursor-pointer transition hover:text-blue-600"
              onClick={beginEditing}
              tabIndex={0}
              role="button"
            >
              {currentTitle.trim()}
            </span>
          ) : (
            <Input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              className="text-lg font-semibold"
            />
          )}
        </div>

        {isEditing && (
          <div className="mt-1 ml-2 flex gap-2">
            <Button
              className="px-3 font-bold border rounded-md text-xs"
              type="button"
              onClick={handleCancelTitle}
              disabled={localBusy}
            >
              Cancel
            </Button>
            <Button
              className="px-5 font-bold border text-xs rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              onClick={handleSaveTitle}
              disabled={renameBusy}
            >
              Save
            </Button>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="p-3 w-full">
        <Textarea
          placeholder="Enter the Diagram Description"
          className="border border-gray-200 bg-gray-50 focus:bg-white rounded-md min-h-[250px] shadow-sm focus:ring-2 focus:ring-blue-200 transition max-h-[350px]"
          value={description}
          onChange={(e) => {
            const text = e.target.value;
            const words = text.trim() === "" ? [] : text.trim().split(/\s+/);
            if (words.length <= 250) setDescription(text);
          }}
        />
        <p className="text-sm text-gray-500 mt-1">{wordCount}/250</p>
      </div>

      {/* Action + Model */}
      <div className="flex flex-wrap w-full justify-between px-3">
        <Button
          onClick={handleAction}
          disabled={localBusy || isBusy}
          className={`w-full md:w-37 my-4 text-white text-md py-4 rounded-md font-semibold hover-lift transform hover:scale-105 transition-all duration-300 cursor-pointer ${
            actionLabel.includes("Update")
              ? "bg-green-500 hover:bg-green-700"
              : actionColor
          }`}
        >
          {localBusy || isBusy ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner className="h-4 w-4" />
              <span>
                {actionLabel.includes("Update") ? "Updating…" : "Generating…"}
              </span>
            </div>
          ) : (
            actionLabel
          )}
        </Button>

        <div className="mt-4 flex w-full md:w-40 ">
          <AppSelect<CanonicalModel>
            value={model}
            onChange={setModel}
            options={MODEL_OPTIONS}
            placeholder="Select Model"
          />
        </div>
      </div>
    </div>
  );
}

/* =======================
   Export Panel (presentational)
======================= */
function ExportPanel({
  diagramId,
  defaultTitle,
}: {
  diagramId: string;
  defaultTitle?: string;
}) {
  const { exportPNG } = useDiagram();
  const { exportSQL } = useExportSql();

  const [dialect, setDialect] = useState<SqlDialect>("postgres");
  const [filename, setFilename] = useState<string>(
    defaultTitle || "Untitled Diagram"
  );
  const [busy, setBusy] = useState(false);

  const handleExportSql = async () => {
    try {
      setBusy(true);
      const { blob, filename: serverFilename } = await exportSQL(diagramId, {
        dialect,
        filename,
      });

      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = serverFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error(e?.message || "Export failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full overflow-hidden relative h-full rounded-2xl text-gray-700 border-2 bg-white p-4 flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Export Your Diagram</h2>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-2 w-full justify-between">
          <label className="text-sm font-medium">SQL Dialect</label>
          <AppSelect<SqlDialect>
            value={dialect}
            onChange={setDialect}
            options={DIALECT_OPTIONS}
            placeholder="Choose dialect"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium">File name</label>
          <Input
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="diagram"
          />
          <p className="text-xs text-muted-foreground">
            The <code>.sql</code> extension will be added automatically.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          disabled={busy}
          onClick={handleExportSql}
          className="bg-purple-400 text-lg cursor-pointer hover:bg-purple-600 text-white py-5 rounded-md font-medium disabled:opacity-60"
        >
          {busy ? (
            <span className="inline-flex items-center gap-2">
              <Spinner className="h-4 w-4" /> Exporting SQL…
            </span>
          ) : (
            "Save as SQL"
          )}
        </Button>

        <StatefulButton
          label="Save as PNG"
          onAction={exportPNG}
          className="bg-blue-500 hover:bg-blue-600 text-white text-lg py-3 rounded-md font-medium"
        />
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Choose a format to download your ERD. PNG will save the diagram image;
        SQL will generate a schema based on your diagram.
      </p>
    </div>
  );
}

/* =======================
   Tabs Wrapper (presentational)
======================= */
export function TextTab({
  title,
  prompt,
  diagramId,
  isLoading = false,
  onUpdate,
}: {
  title?: string;
  prompt?: string;
  diagramId: string;
  isLoading?: boolean;
  onUpdate: (
    title?: string,
    description?: string,
    model?: CanonicalModel
  ) => Promise<void>;
}) {
  const dataReady = typeof title === "string";
  if (isLoading || !dataReady) {
    return (
      <div className="relative h-[35rem] md:h-[48rem] flex flex-col max-w-5xl mx-auto w-full">
        <div className="flex-1 rounded-2xl border-2 bg-white" />
        <div className="pointer-events-none absolute inset-0 rounded-md bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Spinner className="h-5 w-5" />
            <span>{isLoading ? "Loading…" : "Preparing…"}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!diagramId) return null;

  const tabs = [
    {
      title: "Create",
      value: "create",
      content: (
        <DiagramFormPanel
          actionLabel="Generate Diagram"
          actionColor="bg-primary hover:bg-blue-700"
          defaultTitle={title}
          defaultDescription={""}
          onSubmit={onUpdate}
        />
      ),
    },
    {
      title: "Update",
      value: "update",
      content: (
        <DiagramFormPanel
          actionLabel="Update Diagram"
          actionColor="bg-green-500 hover:bg-green-700"
          defaultTitle={title}
          defaultDescription={prompt ?? ""}
          onSubmit={onUpdate}
        />
      ),
    },
    {
      title: "Export",
      value: "export",
      content: <ExportPanel diagramId={diagramId} defaultTitle={title} />,
    },
  ];

  return (
    <div className="h-[35rem] md:h-[48rem] relative flex flex-col max-w-5xl mx-auto w-full">
      <Tabs key={diagramId} tabs={tabs} />
    </div>
  );
}
