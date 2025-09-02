import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/src/components/ui/shadcn-io/spinner";
import { AppSelect } from "@/components/common/AppSelect";
import { toast } from "react-hot-toast";
import ExamplePromptBox, {
  ExamplePrompt,
} from "@/components/common/ExamplePromptBox";
import type { ServerChatMessage } from "@/lib/api";

/* =======================
   Canonical Model
======================= */

export type CanonicalModel = "gemini-2.5-flash" | "gemini-2.5-flash-lite";

const MODEL_OPTIONS = [
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite" },
] as const;

/* =======================
   Types
======================= */

type ChatMessage = ServerChatMessage & { id: string };

export type ChatCreatePanelProps = {
  diagramId: string;
  defaultTitle?: string;
  isBusy?: boolean;
  onSubmit?: (
    title?: string,
    description?: string,
    model?: CanonicalModel
  ) => Promise<void>;
  examplePrompts?: ExamplePrompt[];
  initialChat?: ServerChatMessage[];
};

const ChatCreatePanel: React.FC<ChatCreatePanelProps> = ({
  diagramId,
  defaultTitle,
  isBusy = false,
  onSubmit,
  examplePrompts = [],
  initialChat = [],
}) => {
  const [title, setTitle] = useState<string>(defaultTitle ?? "");
  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const [titleDraft, setTitleDraft] = useState<string>(defaultTitle ?? "");
  const [model, setModel] = useState<CanonicalModel>("gemini-2.5-flash");
  const [input, setInput] = useState<string>("");
  const [localBusy, setLocalBusy] = useState<boolean>(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const SYSTEM_SEED: ServerChatMessage = useMemo(
    () => ({
      role: "system",
      content:
        "Describe your database or business objects. I’ll generate an ERD. Example: “Create an ERD for a ride-sharing app with Users, Drivers, Rides, Payments, Ratings.”",
      ts: Date.now(),
    }),
    []
  );

  const mapToMessages = (list: ServerChatMessage[]): ChatMessage[] =>
    list.map((m, idx) => ({
      ...m,
      id:
        crypto.randomUUID?.() ??
        `${m.role}-${m.ts}-${idx}-${Math.random().toString(36).slice(2)}`,
    }));

  // Seed from props
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    mapToMessages(initialChat.length ? initialChat : [SYSTEM_SEED])
  );

  // Re-hydrate when new chat arrives from the server.
  // Watch both length and the timestamp of the last message.
  const chatLen = initialChat?.length ?? 0;
  const lastTs = chatLen ? initialChat[chatLen - 1].ts : 0;
  useEffect(() => {
    const serverList = chatLen ? initialChat : [SYSTEM_SEED];
    setMessages(mapToMessages(serverList));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagramId, chatLen, lastTs]);

  useEffect(() => setTitle(defaultTitle ?? ""), [defaultTitle]);

  // Auto-scroll on message change
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, localBusy, isBusy]);

  const handleSaveTitle = async () => {
    if (!onSubmit) return;
    const nextTitle = titleDraft.trim();
    if (!nextTitle) return toast.error("Title must not be empty");

    try {
      setLocalBusy(true);
      await onSubmit(nextTitle); // rename only
      setTitle(nextTitle);
      setEditingTitle(false);
      toast.success("Title updated");
    } catch (e: any) {
      toast.error(e?.message || "Failed to rename");
    } finally {
      setLocalBusy(false);
    }
  };

  const pushLocal = (m: ServerChatMessage): ChatMessage => {
    const msg: ChatMessage = {
      ...m,
      id:
        crypto.randomUUID?.() ??
        `${m.role}-${m.ts}-${Math.random().toString(36).slice(2)}`,
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  const handleSend = async (text?: string) => {
    if (!onSubmit) return;
    const body = (text ?? input).trim();
    if (!body) {
      toast.error("Prompt cannot be empty");
      return;
    }

    // Optimistic local user message
    const userMsg: ServerChatMessage = {
      role: "user",
      content: body,
      ts: Date.now(),
    };
    pushLocal(userMsg);
    setInput("");

    try {
      setLocalBusy(true);
      await onSubmit(title.trim() || "Untitled Diagram", body, model);
      // Parent updates diagram.chat; our effect above will re-hydrate from props.
    } catch (e: any) {
      const errMsg =
        typeof e?.message === "string" ? e.message : "Generation failed";
      const failMsg: ServerChatMessage = {
        role: "assistant",
        content: `There was an error: ${errMsg}`,
        ts: Date.now(),
      };
      pushLocal(failMsg);
      toast.error(errMsg);
    } finally {
      setLocalBusy(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePickExample = (promptText: string) => {
    setInput(promptText);
    inputRef.current?.focus();
  };

  const busy = localBusy || isBusy;

  return (
    <div className="w-full h-full rounded-2xl bg-card text-card-foreground border border-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 p-3 border-b border-border sticky top-0 z-10 bg-card/80 backdrop-blur">
        {/* Title (editable) */}
        <div className="flex items-center gap-2 min-w-0">
          {!editingTitle ? (
            <button
              className="text-lg font-semibold truncate text-left hover:text-primary"
              onClick={() => {
                setTitleDraft(title.trim());
                setEditingTitle(true);
              }}
              title="Rename diagram"
            >
              {title.trim() || "Untitled Diagram"}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                autoFocus
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                className="text-lg font-semibold w-56"
                placeholder="Diagram title"
              />
              <Button
                size="sm"
                onClick={handleSaveTitle}
                disabled={busy || !titleDraft.trim()}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingTitle(false)}
                disabled={busy}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Model select */}
        <div className="w-56">
          <AppSelect<CanonicalModel>
            value={model}
            onChange={setModel}
            options={MODEL_OPTIONS}
            placeholder="Select Model"
          />
        </div>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-sm text-muted-foreground">No messages yet.</div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={[
                "max-w-[85%] md:max-w-[70%] lg:max-w-[60%] rounded-xl px-4 py-3 shadow-sm",
                m.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : m.role === "assistant"
                  ? "mr-auto bg-muted"
                  : "mx-auto bg-secondary text-secondary-foreground",
              ].join(" ")}
            >
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {m.content}
              </div>
              <div className="mt-1 text-[10px] opacity-70">
                {new Date(m.ts).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}

        {(localBusy || isBusy) && (
          <div className="mr-auto bg-muted rounded-xl px-4 py-3 shadow-sm inline-flex items-center gap-2">
            <Spinner className="h-4 w-4" />
            <span className="text-sm">Generating…</span>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-border p-3 space-y-3">
        {examplePrompts.length > 0 && (
          <ExamplePromptBox
            prompts={examplePrompts}
            onPick={handlePickExample}
            className="mb-2"
          />
        )}

        <div className="flex items-end gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the ERD you want to create. Shift+Enter for a new line."
            className="min-h-[90px] max-h-[220px] bg-muted focus:bg-background border border-border focus:ring-2 focus:ring-primary/20 rounded-md"
          />
          <Button
            onClick={() => handleSend()}
            disabled={busy || !input.trim()}
            className="px-5 py-6 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold disabled:opacity-60"
          >
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="h-4 w-4" /> Sending
              </span>
            ) : (
              "Send"
            )}
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          Press <kbd className="px-1 py-0.5 border rounded">Enter</kbd> to send
          • <kbd className="px-1 py-0.5 border rounded">Shift</kbd> +{" "}
          <kbd className="px-1 py-0.5 border rounded">Enter</kbd> for a newline
        </div>
      </div>
    </div>
  );
};

export default ChatCreatePanel;
