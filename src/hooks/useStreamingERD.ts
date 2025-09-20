// Rationale: Consolidate BASE_URL access pattern
import { useState, useCallback, useRef } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface StreamingState {
  isStreaming: boolean;
  progress: number;
  message: string;
  error: string | null;
  connectionStatus: "disconnected" | "connecting" | "connected";
}

export const useStreamingERD = () => {
  const [state, setState] = useState<StreamingState>({
    isStreaming: false,
    progress: 0,
    message: "",
    error: null,
    connectionStatus: "disconnected",
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const startStreaming = useCallback(
    async (
      diagramId: string,
      prompt: string,
      model: string = "gemini-2.5-flash",
      onProgress?: (data: unknown) => void
    ) => {
      // Cleanup previous connection
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setState({
        isStreaming: true,
        progress: 0,
        message: "Starting connection...",
        error: null,
        connectionStatus: "connecting",
      });

      try {
        const url = `${BASE_URL}/api/diagrams/${diagramId}/stream?stream=true`;

        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            Accept: "text/event-stream",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ prompt, model }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setState((prev) => ({ ...prev, connectionStatus: "connected" }));

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body reader available");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));

                switch (data.type) {
                  case "start":
                    setState((prev) => ({
                      ...prev,
                      message: data.message,
                      progress: 0,
                    }));
                    break;

                  case "progress":
                    setState((prev) => ({
                      ...prev,
                      message: data.data.message,
                      progress: data.data.progress,
                    }));
                    // Call the progress callback if provided
                    onProgress?.(data);
                    break;

                  case "heartbeat":
                    // Keep connection alive - no UI update needed
                    break;

                  case "complete":
                    setState((prev) => ({
                      ...prev,
                      isStreaming: false,
                      progress: 100,
                      message: "Complete!",
                      connectionStatus: "disconnected",
                    }));
                    return data.data; // Return the complete diagram data

                  case "error":
                    setState((prev) => ({
                      ...prev,
                      isStreaming: false,
                      error: data.error,
                      connectionStatus: "disconnected",
                    }));
                    throw new Error(data.error);
                }
              } catch (parseError) {
                // Silently handle parse errors in production
              }
            }
          }
        }
      } catch (error: unknown) {
        const err = error as { message?: string; name?: string };
        if (err.name === "AbortError") {
          setState((prev) => ({
            ...prev,
            isStreaming: false,
            message: "Cancelled",
            connectionStatus: "disconnected",
          }));
          // Don't throw error for cancellation - it's expected behavior
          return;
        } else {
          setState((prev) => ({
            ...prev,
            isStreaming: false,
            error: err.message || "Unknown error",
            connectionStatus: "disconnected",
          }));
          throw error;
        }
      }
    },
    []
  );

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    ...state,
    startStreaming,
    stopStreaming,
  };
};
