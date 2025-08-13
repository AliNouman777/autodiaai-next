"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/src/components/ui/shadcn-io/spinner";
import { useDiagramApi, useDiagram } from "@/src/context/DiagramContext";
import {
  ModelSelect,
  type CanonicalModel,
} from "@/components/common/ModelSelect";
import { Tabs } from "@/components/ui/tabs";
import StatefulButton from "@/components/common/StatefulButton";

/* =======================
   Reusable Form Panel
======================= */

type DiagramFormPanelProps = {
  actionLabel: string;
  actionColor?: string;
  defaultTitle?: string; // fetched from backend
  defaultDescription?: string; // fetched from backend
  onSubmit?: (
    title: string,
    description: string,
    model: CanonicalModel
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
  // Title draft exists only while editing (no continuous prop→state mirroring)
  const [isEditing, setIsEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState<string>("");

  // Description stays in sync with prop
  const [description, setDescription] = useState<string>(defaultDescription);
  useEffect(() => {
    setDescription(defaultDescription ?? "");
  }, [defaultDescription]);

  // Model select
  const [model, setModel] = useState<CanonicalModel>("gpt-5");

  // Word counter
  const wordCount = useMemo(() => {
    const trimmed = description.trim();
    return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  }, [description]);

  // Begin editing title: seed from latest prop
  const beginEditing = () => {
    setTitleDraft((defaultTitle ?? "").trim());
    setIsEditing(true);
  };

  const handleSaveTitle = () => {
    setIsEditing(false);
  };

  const handleCancelTitle = () => {
    setIsEditing(false);
    setTitleDraft((defaultTitle ?? "").trim());
  };

  // Submit using draft if editing, otherwise current prop title
  const handleAction = async () => {
    if (!onSubmit) return;
    const effectiveTitle = isEditing ? titleDraft : defaultTitle ?? "";
    await onSubmit(effectiveTitle, description, model);
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
              {(defaultTitle ?? "").trim()}
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
            >
              Cancel
            </Button>
            <Button
              className="px-5 font-bold border text-xs rounded-md"
              type="button"
              onClick={handleSaveTitle}
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
            if (words.length <= 1000) setDescription(text);
          }}
        />
        <p className="text-sm text-gray-500 mt-1">{wordCount}/1000</p>
      </div>

      {/* Action + Model */}
      <div className="flex flex-wrap w-full justify-between px-3">
        <Button
          onClick={handleAction}
          disabled={isBusy}
          className={`w-full md:w-37 my-4 text-white text-md py-4 rounded-md font-semibold hover-lift transform hover:scale-105 transition-all duration-300 ${
            actionLabel.includes("Update")
              ? "bg-green-500 hover:bg-green-700"
              : actionColor
          }`}
        >
          {isBusy ? "Working…" : actionLabel}
        </Button>

        <div className="mt-4 flex w-full md:w-35">
          <ModelSelect value={model} onChange={setModel} />
        </div>
      </div>
    </div>
  );
}

/* =======================
   Export Panel
======================= */
function ExportPanel() {
  const { exportPNG } = useDiagram();
  return (
    <div className="w-full overflow-hidden relative h-full rounded-2xl text-gray-700 border-2 bg-white p-4 flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Export Your Diagram</h2>
      <div className="flex flex-col gap-3">
        <StatefulButton
          label="Save as PNG"
          onAction={exportPNG}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-medium"
        />
        <Button
          className="bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-md font-medium"
          onClick={() => {}}
        >
          Save as SQL
        </Button>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        Choose a format to download your ERD. PNG will save the diagram image,
        SQL will save a generated schema.
      </p>
    </div>
  );
}

/* =======================
   Tabs Wrapper
======================= */
export function TabsDemo({
  title,
  prompt,
  diagramId,
  isLoading = false,
}: {
  title?: string;
  prompt?: string;
  diagramId: string;
  isLoading?: boolean;
}) {
  const { updateDiagram } = useDiagramApi();

  // Gate initial paint until title exists, to avoid initial empty → filled flicker
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

  if (!diagramId) {
    return (
      <div className="grid h-40 place-items-center text-sm text-red-600 border rounded-md bg-white">
        Missing diagramId — pass it to <code>TabsDemo</code>.
      </div>
    );
  }

  const handleUpdate = async (
    newTitle: string,
    newPrompt: string,
    model: CanonicalModel
  ) => {
    await updateDiagram(diagramId, {
      title: newTitle, // ensure this matches your backend contract
      prompt: newPrompt,
      model,
    });
  };

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
          onSubmit={handleUpdate}
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
          onSubmit={handleUpdate}
        />
      ),
    },
    {
      title: "Export",
      value: "export",
      content: <ExportPanel />,
    },
  ];

  return (
    <div className="h-[35rem] md:h-[48rem] relative flex flex-col max-w-5xl mx-auto w-full">
      <Tabs key={diagramId} tabs={tabs} />
    </div>
  );
}
