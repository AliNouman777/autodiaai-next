// app/diagrams/erd/[id]/DiagramPageClient.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { TextTab } from "@/components/TextTab";
import DiagramFlow from "./DiagramFlow";
import { useDiagramApi } from "@/src/context/DiagramContext";
import type { Diagram, UpdateDiagramBody } from "@/lib/api";
import { Spinner } from "@/src/components/ui/shadcn-io/spinner";
import toast from "react-hot-toast";
import FancyProgressLoader from "@/components/common/fancy-progress-loader";
import { StickyNotice } from "@/components/common/sticky-notice";

const DiagramPageClient: React.FC = () => {
  const params = useParams<{ id: string }>();
  const diagramId = params?.id;

  const {
    getDiagram,
    fetching,
    updateDiagram: updateDiagramApi,
  } = useDiagramApi();

  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [showBanner, setShowBanner] = useState(false);
  const bannerTimer = useRef<number | null>(null);

  // guard against duplicate fetches in dev (StrictMode)
  const fetchedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!diagramId) return;
    if (fetchedFor.current === diagramId) return;
    fetchedFor.current = diagramId;

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const doc = await getDiagram(diagramId);
        if (alive) setDiagram(doc);
      } catch (e: any) {
        const data = e?.response?.data ?? e?.data ?? e;
        const msg =
          (data?.success === false && data?.error?.message) ||
          data?.message ||
          e?.message ||
          "Something went wrong";
        toast.error(msg);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [diagramId, getDiagram]);

  // cleanup banner timer on unmount
  useEffect(() => {
    return () => {
      if (bannerTimer.current) window.clearTimeout(bannerTimer.current);
    };
  }, []);

  // this handles title/prompt/model updates (patch) and rehydrates local state
  const handleUpdate = async (
    newTitle?: string,
    newPrompt?: string,
    model?: string
  ) => {
    if (!diagramId) return;

    const body: UpdateDiagramBody = {};
    if (typeof newTitle === "string" && newTitle !== diagram?.title)
      body.title = newTitle;
    if (typeof newPrompt === "string" && newPrompt !== diagram?.prompt)
      body.prompt = newPrompt;
    if (typeof model === "string" && model !== (diagram as any)?.model)
      body.model = model as any;

    if (Object.keys(body).length === 0) return;

    const needsGeneration = Boolean(body.prompt) || Boolean(body.model);

    try {
      if (needsGeneration) setGenerating(true);

      const prevNodes = diagram?.nodes?.length ?? 0;
      const updated = await updateDiagramApi(diagramId, body);

      // IMPORTANT: set the whole updated diagram so `chat` changes flow into TextTab
      setDiagram(updated);

      const nowNodes = updated?.nodes?.length ?? 0;
      const firstGenKey = `firstGenSeen:${diagramId}`;
      const firstTimeGenerated =
        needsGeneration && prevNodes === 0 && nowNodes > 0;

      if (firstTimeGenerated) {
        const alreadySeen =
          typeof window !== "undefined" && localStorage.getItem(firstGenKey);
        if (!alreadySeen) {
          if (bannerTimer.current) window.clearTimeout(bannerTimer.current);
          bannerTimer.current = window.setTimeout(() => {
            setShowBanner(true);
            localStorage.setItem(firstGenKey, "1");
          }, 3000);
        }
      }

      toast.success(
        needsGeneration ? "Diagram updated successfully!" : "Title updated"
      );
    } catch (e: any) {
      const data = e?.response?.data ?? e?.data ?? e;
      const msg =
        (data?.success === false && data?.error?.message) ||
        data?.message ||
        e?.message ||
        "Update failed";
      toast.error(msg);
      throw e;
    } finally {
      if (needsGeneration) setGenerating(false);
    }
  };

  const showingInitialLoader = (fetching || loading) && !diagram;

  return (
    <div className="relative w-full">
      {/* optional banner */}
      {showBanner && (
        <StickyNotice
          tone="primary"
          message="🎉 Your diagram is ready! Please don’t forget to share your valuable feedback."
          ctaHref="/feedback"
          ctaLabel="Share feedback"
          hideOnScroll={false}
        />
      )}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-6">
        {/* Left panel: Text tabs (Create / Export) */}
        <aside className="order-1 lg:order-1 lg:col-span-4 w-full lg:sticky lg:top-4 lg:self-start lg:h-[calc(100vh-2rem)] overflow-auto">
          <TextTab
            title={diagram?.title}
            diagramId={diagramId!}
            isLoading={showingInitialLoader}
            isBusy={generating}
            onUpdate={handleUpdate}
            chat={(diagram as any)?.chat ?? []} // ← this is key: pass server chat
          />
        </aside>

        {/* Right panel: Canvas */}
        <section className="order-2 lg:col-span-8 w-full shadow-md bg-card text-card-foreground border border-border lg:h-[calc(100vh-2rem)] relative flex">
          {showingInitialLoader ? (
            <div className="flex h-[55vh] grow items-center justify-center gap-2 text-muted-foreground sm:h-[60vh] md:h-[68vh] lg:h-full">
              <Spinner className="h-5 w-5" />
              Loading canvas…
            </div>
          ) : (
            <div className="h-[55vh] w-full sm:h-[60vh] md:h-[68vh] lg:h-full">
              <DiagramFlow
                key={`${diagramId}:${diagram?.nodes?.length ?? 0}:${
                  diagram?.edges?.length ?? 0
                }`}
                nodes={diagram?.nodes ?? []}
                edges={diagram?.edges ?? []}
              />
            </div>
          )}

          {generating && (
            <div className="absolute inset-0 z-40">
              <FancyProgressLoader loading={true} withBackdrop />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DiagramPageClient;
