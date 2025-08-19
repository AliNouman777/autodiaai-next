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
    <div className="w-full ">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6">
        {/* Left: Create/Update panel */}
        <aside
          className="
            order-1 lg:order-1
            lg:col-span-4
            w-full
            lg:sticky lg:top-4 lg:self-start
            lg:h-[calc(100vh-2rem)]  
            overflow-auto
          "
        >
          <TextTab
            title={diagram?.title}
            prompt={diagram?.prompt}
            diagramId={diagramId}
            isLoading={(fetching || loading) && !diagram}
            onUpdate={handleUpdate}
          />
        </aside>

        {/* Right: Canvas */}
        <section
          className="
            order-2
            lg:col-span-8
            w-full
            shadow-md
            bg-white
            
            lg:h-[calc(100vh-2rem)]   /* full height on desktop minus top-4 */
            flex
          "
        >
          {(fetching || loading) && !diagram ? (
            <div className="flex h-[55vh] sm:h-[60vh] md:h-[68vh] lg:h-full items-center justify-center text-slate-600 gap-2 grow">
              <Spinner className="h-5 w-5" />
              Loading canvas…
            </div>
          ) : (
            <div className="h-[55vh] sm:h-[60vh] md:h-[68vh] lg:h-full w-full">
              <DiagramFlow
                key={`${diagramId}:${diagram?.nodes?.length ?? 0}:${
                  diagram?.edges?.length ?? 0
                }`}
                nodes={diagram?.nodes ?? []}
                edges={diagram?.edges ?? []}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DiagramPageClient;
