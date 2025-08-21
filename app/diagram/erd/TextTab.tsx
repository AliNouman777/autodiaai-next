// "use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/src/components/ui/shadcn-io/spinner";
import { useDiagram, useExportSql } from "@/src/context/DiagramContext";
import { AppSelect } from "@/components/common/AppSelect";
import { Tabs } from "@/components/ui/tabs";
import StatefulButton from "@/components/common/StatefulButton";
import { toast } from "react-hot-toast";
import ExamplePromptBox, {
  ExamplePrompt,
} from "@/components/common/ExamplePromptBox";
import { EXAMPLE_PROMPTS } from "@/constant/example-prompt";

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
  examplePrompts?: ExamplePrompt[];
};

function DiagramFormPanel({
  actionLabel,
  // theme-aware by default; if you pass a custom class, prefer tokens (e.g. bg-primary/90)
  actionColor = "bg-primary hover:bg-primary/90",
  defaultTitle,
  defaultDescription = "",
  onSubmit,
  isBusy = false,
  examplePrompts = [],
}: DiagramFormPanelProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [titleDraft, setTitleDraft] = React.useState<string>("");
  const [localBusy, setLocalBusy] = React.useState<boolean>(false);
  const [currentTitle, setCurrentTitle] = React.useState<string>(
    defaultTitle ?? ""
  );
  const [description, setDescription] =
    React.useState<string>(defaultDescription);
  const [renameBusy, setRenameBusy] = React.useState<boolean>(false);
  const [model, setModel] = React.useState<CanonicalModel>("gemini-2.5-flash");

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

  const clampTo250 = (text: string) => {
    const words = text.trim() === "" ? [] : text.trim().split(/\s+/);
    return words.length <= 250 ? text : words.slice(0, 250).join(" ");
  };

  const handlePickExample = (promptText: string) => {
    setDescription(clampTo250(promptText)); // auto-fill textarea
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
      await onSubmit(effectiveTitle, description, model);
    } finally {
      setLocalBusy(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden relative h-full rounded-2xl bg-card text-card-foreground border border-border">
      {/* Header */}
      <div className="flex justify-between w-full p-3 items-center">
        <div className="mt-1 flex-1">
          {!isEditing ? (
            <span
              className="block text-lg font-semibold cursor-pointer transition hover:text-primary"
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
              className="px-3 font-bold text-xs"
              type="button"
              onClick={handleCancelTitle}
              disabled={localBusy}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="px-5 font-bold text-xs rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="mt-3 border border-border bg-muted focus:bg-background rounded-md min-h-[250px] shadow-sm focus:ring-2 focus:ring-primary/20 transition max-h-[350px]"
          value={description}
          onChange={(e) => {
            const text = e.target.value;
            const words = text.trim() === "" ? [] : text.trim().split(/\s+/);
            if (words.length <= 250) setDescription(text);
          }}
        />

        <p className="text-sm text-muted-foreground mt-1">{wordCount}/250</p>
      </div>

      {/* Action + Model */}
      <div className="flex flex-wrap w-full justify-between px-3">
        <Button
          onClick={handleAction}
          disabled={localBusy || isBusy}
          className={`w-full md:w-37 my-4 text-md py-4 rounded-md font-semibold hover-lift transform hover:scale-105 transition-all duration-300 cursor-pointer text-primary-foreground ${actionColor}`}
        >
          {localBusy || isBusy ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner className="h-4 w-4" />
              <span>Generating…</span>
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

      {/* Example prompts (Create only) */}
      {examplePrompts.length > 0 && (
        <ExamplePromptBox
          prompts={examplePrompts}
          onPick={handlePickExample}
          className="m-3"
        />
      )}
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
    <div className="w-full overflow-hidden relative h-full rounded-2xl bg-card text-card-foreground border border-border p-4 flex flex-col gap-6">
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
          className="text-lg cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground py-5 rounded-md font-medium disabled:opacity-60"
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
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 rounded-md font-medium"
        />
      </div>

      <p className="text-sm text-muted-foreground mt-2">
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
  // prompt removed/ignored intentionally while Update tab is disabled
  diagramId,
  isLoading = false,
  isBusy = false,
  onUpdate,
}: {
  title?: string;
  diagramId: string;
  isLoading?: boolean;
  isBusy?: boolean;
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
        <div className="flex-1 rounded-2xl border border-border bg-card" />
        <div className="pointer-events-none absolute inset-0 rounded-md bg-background/60 backdrop-blur-[1px] flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
          actionColor="bg-primary hover:bg-primary/90"
          defaultTitle={title}
          defaultDescription={""}
          onSubmit={onUpdate}
          isBusy={isBusy}
          examplePrompts={EXAMPLE_PROMPTS}
        />
      ),
    },
    // Update tab removed
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
