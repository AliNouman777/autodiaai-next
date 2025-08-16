"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TextTab } from "./TextTab";
import DiagramFlow from "./DiagramFlow";
import { useDiagramApi } from "@/src/context/DiagramContext";
import type { Diagram, UpdateDiagramBody } from "@/lib/api";
import { Spinner } from "@/src/components/ui/shadcn-io/spinner";
import toast from "react-hot-toast";

const DiagramPageClient: React.FC = () => {
  const params = useParams<{ id: string }>();
  const diagramId = params?.id;

  const {
    getDiagram,
    fetching,
    updateDiagram: updateDiagramApi,
  } = useDiagramApi();
  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ---- Helpers ----
  const getToastMessage = (err: any): string => {
    const data = err?.response?.data ?? err?.data ?? err;
    if (data?.success === false && data?.error?.message)
      return data.error.message;
    if (data?.message) return data.message;
    if (typeof data === "string") return data;
    return err?.message || "Something went wrong";
  };

  // ---- Initial fetch ----
  useEffect(() => {
    if (!diagramId) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const doc = await getDiagram(diagramId);
        if (alive) setDiagram(doc);
      } catch (e: any) {
        if (alive) {
          const msg = getToastMessage(e);
          setError(msg);
          toast.error(msg);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [diagramId, getDiagram]);

  // ---- Update handler passed to TabsDemo ----
  const handleUpdate = async (
    newTitle?: string,
    newPrompt?: string,
    model?: string
  ) => {
    if (!diagramId) return;

    const body: UpdateDiagramBody = {};
    if (typeof newTitle === "string") {
      body.title = newTitle;
    }
    if (typeof newPrompt === "string") body.prompt = newPrompt;
    if (typeof model === "string") body.model = model as any;


    // No-op if nothing provided
    if (Object.keys(body).length === 0) return;

    try {
      const updated = await updateDiagramApi(diagramId, body);
      setDiagram(updated); // keep UI in sync with server response (nodes/edges may change after prompt)
      toast.success("Diagram updated successfully!");
    } catch (e: any) {
      const msg = getToastMessage(e);
      toast.error(msg);
      throw e;
    }
  };

  // ---- Layout ----
  return (
    <div className="flex h-full w-full gap-3">
      {/* Left: Create/Update panels */}
      <div className="w-full md:w-1/3">
        <TextTab
          title={diagram?.title}
          prompt={diagram?.prompt}
          diagramId={diagramId}
          isLoading={(fetching || loading) && !diagram}
          onUpdate={handleUpdate}
        />
      </div>

      {/* Right: Canvas */}
      <div className="w-full md:w-3/4 border border-gray-100 shadow-lg rounded-2xl">
        {(fetching || loading) && !diagram ? (
          <div className="flex h-full min-h-[24rem] items-center justify-center text-slate-600 gap-2">
            <Spinner className="h-5 w-5" />
            Loading canvas…
          </div>
        ) : (
          <DiagramFlow
            key={`${diagramId}:${diagram?.nodes?.length ?? 0}:${
              diagram?.edges?.length ?? 0
            }`}
            nodes={diagram?.nodes ?? []}
            edges={diagram?.edges ?? []}
          />
        )}
      </div>
    </div>
  );
};

export default DiagramPageClient;
