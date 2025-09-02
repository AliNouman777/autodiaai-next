import React from "react";
import { Spinner } from "@/src/components/ui/shadcn-io/spinner";
import { Tabs } from "@/components/ui/tabs";
import ChatCreatePanel, { type CanonicalModel } from "./ChatCreatePanel";
import ExportPanel from "./ExportPanel";
import type { ServerChatMessage } from "@/lib/api";

export function TextTab({
  title,
  diagramId,
  isLoading = false,
  isBusy = false,
  chat = [],
  onUpdate,
}: {
  title?: string;
  diagramId: string;
  isLoading?: boolean;
  isBusy?: boolean;
  chat?: ServerChatMessage[];
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

  // Version key to force refresh of the Chat panel when server chat updates
  const chatLen = chat?.length ?? 0;
  const chatLastTs = chatLen ? chat[chatLen - 1].ts : 0;
  const chatKey = `${diagramId}:${chatLen}:${chatLastTs}`;

  const tabs = [
    {
      title: "Create",
      value: "create",
      content: (
        <ChatCreatePanel
          key={chatKey}
          diagramId={diagramId}
          defaultTitle={title}
          isBusy={isBusy}
          onSubmit={onUpdate}
          examplePrompts={[]}
          initialChat={chat}
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
      {/* Key Tabs by chatKey so memoized content updates reliably */}
      <Tabs key={chatKey} tabs={tabs} />
    </div>
  );
}
