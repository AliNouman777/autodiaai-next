"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/src/components/ui/shadcn-io/spinner";
import { useDiagramApi, useDiagram } from "@/src/context/DiagramContext";
import { ModelSelect, type CanonicalModel } from "@/components/common/ModelSelect";
import { Tabs } from "@/components/ui/tabs";
import StatefulButton from "@/components/common/StatefulButton";
import { toast } from "react-hot-toast";

/* =========================================================
   Error Normalizer (professional, backend-first approach)
   ========================================================= */

type NormalizedApiError = {
  status?: number;
  code?: string;
  message: string;
  raw?: unknown;
};

/**
 * Try to safely JSON.parse something if it looks like a JSON string.
 */
function safeParseJSON(maybeJSON: unknown): any | undefined {
  if (typeof maybeJSON !== "string") return undefined;
  try {
    return JSON.parse(maybeJSON);
  } catch {
    return undefined;
  }
}

/**
 * Extract normalized { status, code, message } from many possible error shapes:
 * - Your backend: { success:false, error:{ code, message } }
 * - Axios error:  error.response.status / error.response.data
 * - Fetch-style:  error.status, error.json body, or thrown Response-like
 * - Raw strings:  "Something happened"
 */
function extractApiError(err: any): NormalizedApiError {
  // 1) If backend already threw our standard shape
  if (err && err.success === false && err.error) {
    return {
      status: err.status,
      code: err.error.code,
      message: err.error.message || "Request failed.",
      raw: err,
    };
  }

  // 2) Axios-style errors (most common in apps)
  const axiosStatus = err?.response?.status ?? err?.status;
  const axiosData = err?.response?.data ?? err?.data;

  // Try to pull our backend shape from axios data
  if (axiosData?.success === false && axiosData?.error) {
    return {
      status: axiosStatus,
      code: axiosData.error.code,
      message: axiosData.error.message || "Request failed.",
      raw: err,
    };
  }

  // Some backends return { code, message } flat in data
  if (axiosData?.code || axiosData?.message) {
    return {
      status: axiosStatus,
      code: axiosData.code,
      message: axiosData.message || "Request failed.",
      raw: err,
    };
  }

  // 3) If server sent a string body like "Bad Request", try parse or show string
  if (typeof axiosData === "string") {
    const parsed = safeParseJSON(axiosData);
    if (parsed?.success === false && parsed?.error) {
      return {
        status: axiosStatus,
        code: parsed.error.code,
        message: parsed.error.message || "Request failed.",
        raw: err,
      };
    }
    return {
      status: axiosStatus,
      message: axiosData || err?.message || "Request failed.",
      raw: err,
    };
  }

  // 4) Fallbacks: fetch thrown Response-like or plain Error
  if (err && typeof err === "object") {
    const status = err.status ?? axiosStatus;
    const code =
      err?.error?.code ??
      err?.code ??
      err?.response?.data?.error?.code ??
      err?.response?.data?.code;

    const message =
      err?.error?.message ??
      err?.response?.data?.error?.message ??
      err?.response?.data?.message ??
      err?.message ??
      "Request failed.";

    return { status, code, message, raw: err };
  }

  // 5) Last resort
  return {
    message: typeof err === "string" ? err : "Request failed.",
    raw: err,
  };
}

/** Map normalized error to a helpful toast message (prioritize backend message). */
function showErrorToast(err: any) {
  const { status, code, message } = extractApiError(err);

  // If backend sent a specific message, prefer it.
  if (message && message !== "Bad Request") {
    toast.error(message);
    return;
  }

  // Otherwise choose a sensible default by code/status.
  if (code === "INVALID_ERD_PROMPT") {
    toast.error("Your prompt does not seem related to generating an ER diagram.");
    return;
  }
  if (code === "AI_QUOTA_EXCEEDED" || status === 429) {
    toast.error("You've reached your AI usage limit. Please check your plan or billing settings.");
    return;
  }
  if (code === "VALIDATION_ERROR" || status === 400) {
    toast.error("Invalid input. Please check your fields and try again.");
    return;
  }
  if (status === 404 || code === "NOT_FOUND") {
    toast.error("Diagram not found.");
    return;
  }
  if (code === "AI_FAILED" || status === 502) {
    toast.error("The server is temporarily unavailable. Please try again shortly.");
    return;
  }

  // Generic fallback
  toast.error(message || "Failed to update diagram. Please try again.");
}

/* =======================
   Reusable Form Panel
======================= */

type DiagramFormPanelProps = {
  actionLabel: string;
  actionColor?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  onSubmit?: (title: string, description: string, model: CanonicalModel) => Promise<void>;
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

  const [description, setDescription] = useState<string>(defaultDescription);
  useEffect(() => {
    setDescription(defaultDescription ?? "");
  }, [defaultDescription]);

  const [model, setModel] = useState<CanonicalModel>("gpt-5");

  const wordCount = useMemo(() => {
    const trimmed = description.trim();
    return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  }, [description]);

  const beginEditing = () => {
    setTitleDraft((defaultTitle ?? "").trim());
    setIsEditing(true);
  };

  const handleSaveTitle = () => setIsEditing(false);
  const handleCancelTitle = () => {
    setIsEditing(false);
    setTitleDraft((defaultTitle ?? "").trim());
  };

  const handleAction = async () => {
    if (!onSubmit) return;
    try {
      setLocalBusy(true);

      const effectiveTitle = isEditing ? titleDraft.trim() : (defaultTitle ?? "").trim();
      if (!effectiveTitle) {
        toast.error("Please enter a diagram title.");
        return;
      }

      // Let the backend be the source of truth for ERD validation.
      await onSubmit(effectiveTitle, description, model);
    } catch (error) {
      console.error("Diagram submission error:", error);
      showErrorToast(error);
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
              <span>{actionLabel.includes("Update") ? "Updating…" : "Generating…"}</span>
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
        Choose a format to download your ERD. PNG will save the diagram image, SQL will save a generated schema.
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

  const handleUpdate = async (newTitle: string, newPrompt: string, model: CanonicalModel) => {
    try {
      await updateDiagram(diagramId, {
        title: newTitle,
        prompt: newPrompt,
        model,
      });
      toast.success("Diagram updated successfully!");
    } catch (error: any) {
      console.error("Update diagram error:", error);
      showErrorToast(error);
    }
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
