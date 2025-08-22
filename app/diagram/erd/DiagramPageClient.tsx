"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { TextTab } from "./TextTab";
import DiagramFlow from "./DiagramFlow";
import { useDiagramApi } from "@/src/context/DiagramContext";
import type { Diagram, UpdateDiagramBody } from "@/lib/api";
import { Spinner } from "@/src/components/ui/shadcn-io/spinner";
import toast from "react-hot-toast";
import FancyProgressLoader from "@/components/common/fancy-progress-loader";

import { StickyBanner } from "@/src/components/ui/sticky-banner";
import { X } from "lucide-react";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);

  const [showBanner, setShowBanner] = useState<boolean>(false);
  const bannerTimer = useRef<number | null>(null);

  // initial fetch
  useEffect(() => {
    if (!diagramId) return;
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
      setDiagram(updated);

      // first successful generation (0 -> >0 nodes)
      const nowNodes = updated?.nodes?.length ?? 0;
      const firstGenKey = `firstGenSeen:${diagramId}`;
      const firstTimeGenerated =
        needsGeneration && prevNodes === 0 && nowNodes > 0;

      if (firstTimeGenerated && typeof window !== "undefined") {
        const alreadySeen = localStorage.getItem(firstGenKey);
        if (!alreadySeen) {
          if (bannerTimer.current) window.clearTimeout(bannerTimer.current);
          bannerTimer.current = window.setTimeout(() => {
            setShowBanner(true);
            localStorage.setItem(firstGenKey, "1"); // mark as shown only when we actually show it
          }, 3000); // ✅ 3s delay
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
      {/* Sticky banner (tokenized colors) */}
      {showBanner && (
        <StickyNotice
          tone="primary"
          message="🎉 Your diagram is ready! Please don’t forget to share your valuable feedback."
          ctaHref="/feedback"
          ctaLabel="Share feedback"
          hideOnScroll={false} // stays put; your StickyBanner handles close + unmount
        />
      )}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-6">
        {/* Left panel */}
        <aside
          className="
            order-1 lg:order-1 lg:col-span-4 w-full
            lg:sticky lg:top-4 lg:self-start lg:h-[calc(100vh-2rem)]
            overflow-auto
          "
        >
          <TextTab
            title={diagram?.title}
            diagramId={diagramId!}
            isLoading={showingInitialLoader}
            isBusy={generating}
            onUpdate={handleUpdate}
          />
        </aside>

        {/* Right: Canvas */}
        <section
          className="
            order-2 lg:col-span-8 w-full shadow-md
            bg-card text-card-foreground border border-border
            lg:h-[calc(100vh-2rem)] relative flex
          "
        >
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
