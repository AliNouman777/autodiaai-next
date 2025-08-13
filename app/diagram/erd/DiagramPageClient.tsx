"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TabsDemo } from "./TextTab";
import DiagramFlow from "./DiagramFlow";
import { useDiagramApi } from "@/src/context/DiagramContext";
import type { Diagram } from "@/lib/api";
import { Spinner } from "@/src/components/ui/shadcn-io/spinner";
import toast from "react-hot-toast";

const Page: React.FC = () => {
  const params = useParams<{ id: string }>();
  const diagramId = params?.id;

  const { getDiagram, fetching } = useDiagramApi();
  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load the diagram when the id changes
  useEffect(() => {
    if (!diagramId) return;

    let alive = true;
    setError(null);

    (async () => {
      try {
        const doc = await getDiagram(diagramId);
        if (alive) setDiagram(doc);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Failed to load diagram");
      }
    })();

    return () => {
      alive = false;
    };
  }, [diagramId, getDiagram]);

  // Error UI
  if (error) {
    toast.error("Something Went Wrong");
    console.log(error);
  }

  // Page layout
  return (
    <div className="flex h-full w-full gap-3">
      {/* Left: Update panel (Generate calls PATCH to update existing diagram) */}
      <div className="w-full md:w-1/3">
        <TabsDemo
          title={diagram?.title}
          prompt={diagram?.prompt}
          diagramId={diagramId}
          isLoading={fetching && !diagram}
        />
      </div>

      {/* Right: Canvas */}
      <div className="w-full md:w-3/4 border border-gray-100 shadow-lg rounded-2xl">
        {fetching && !diagram ? (
          <div className="flex h-full min-h-[24rem] items-center justify-center text-slate-600 gap-2">
            <Spinner className="h-5 w-5" />
            Loading canvas…
          </div>
        ) : (
          <DiagramFlow
            diagramId={diagramId}
            initialNodes={diagram?.nodes ?? []}
            initialEdges={diagram?.edges ?? []}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
