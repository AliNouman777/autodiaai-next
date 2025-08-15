// "use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/src/components/ui/shadcn-io/spinner";
import { useDiagram } from "@/src/context/DiagramContext";
import {
  ModelSelect,
  type CanonicalModel,
} from "@/components/common/ModelSelect";
import { Tabs } from "@/components/ui/tabs";
import StatefulButton from "@/components/common/StatefulButton";
import { toast } from "react-hot-toast";

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
  const [model, setModel] = useState<CanonicalModel>(
    "deepseek/deepseek-chat-v3-0324:free"
  );

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
      setLocalBusy(true);
      await onSubmit(nextTitle); // parent handles API + state
      setCurrentTitle(nextTitle);
      setIsEditing(false);
    } finally {
      setLocalBusy(false);
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
              className="px-5 font-bold border text-xs rounded-md"
              type="button"
              onClick={handleSaveTitle}
              disabled={localBusy}
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
            if (words.length <= 100) setDescription(text);
          }}
        />
        <p className="text-sm text-gray-500 mt-1">{wordCount}/100</p>
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

        <div className="mt-4 flex w-full md:w-35">
          <ModelSelect value={model} onChange={setModel} />
        </div>
      </div>
    </div>
  );
}

/* =======================
   Export Panel (presentational)
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
      content: <ExportPanel />,
    },
  ];

  return (
    <div className="h-[35rem] md:h-[48rem] relative flex flex-col max-w-5xl mx-auto w-full">
      <Tabs key={diagramId} tabs={tabs} />
    </div>
  );
}
