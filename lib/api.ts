// lib/api.ts
// NOTE: updated to:
// - add `chat?: ServerChatMessage[]` to Diagram
// - add `chatDelta?: ServerChatMessage[]` to UpdateDiagramBody
// - remove DiagramChatAPI entirely

import BASE_URL from "@/BaseUrl";

/* ===========================
   Error & helpers
=========================== */

export class ApiError extends Error {
  status?: number;
  code?: string | number;
  data?: any;
  constructor(message: string, opts?: { status?: number; code?: string | number; data?: any }) {
    super(message);
    this.name = "ApiError";
    this.status = opts?.status;
    this.code = opts?.code;
    this.data = opts?.data;
  }
}

type ApiOptions = RequestInit & {
  onUnauthorized?: (info: { path: string; status: number }) => void;
};

function isFormData(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

async function parseBodySafe(res: Response) {
  if (res.status === 204 || res.status === 205) return undefined;

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return undefined;
    }
  }
  try {
    const text = await res.text();
    return text || undefined;
  } catch {
    return undefined;
  }
}

export async function api(path: string, options: ApiOptions = {}) {
  const { onUnauthorized, ...fetchOptions } = options;

  const init: RequestInit = {
    credentials: "include",
    ...fetchOptions,
    headers: { ...(fetchOptions.headers || {}) },
  };

  const body = (fetchOptions as RequestInit).body;
  const shouldSetJson = body !== undefined && typeof body === "string" && !isFormData(body);
  if (shouldSetJson) {
    (init.headers as Record<string, string>)["Content-Type"] =
      (init.headers as Record<string, string>)["Content-Type"] || "application/json";
  }
  (init.headers as Record<string, string>)["Accept"] =
    (init.headers as Record<string, string>)["Accept"] || "application/json";

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, init);
  } catch (e: any) {
    throw new ApiError(e?.message || "Network error", { status: undefined });
  }

  const raw = await parseBodySafe(res);
  const isEnvelope = raw && typeof raw === "object" && ("ok" in (raw as any) || "data" in (raw as any));

  const ok = isEnvelope ? (raw as any).ok !== false && res.ok : res.ok;
  if (!ok) {
    const message =
      (isEnvelope && ((raw as any).error?.message || (raw as any).message)) ||
      (typeof raw === "string" ? raw : undefined) ||
      res.statusText ||
      "Request failed";

    if (res.status === 401 && typeof window !== "undefined" && onUnauthorized) {
      onUnauthorized({ path, status: res.status });
    }

    const code = isEnvelope ? (raw as any).error?.code : undefined;
    const data = isEnvelope ? (raw as any).data ?? raw : raw;

    throw new ApiError(message, { status: res.status, code, data });
  }

  return isEnvelope ? (raw as any).data ?? raw : raw;
}

/* ===========================
   Public types
=========================== */

export type ServerChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  ts: number;
};

export type Model =
  | "gpt-5"
  | "gpt-5-mini"
  | "gemini-2.5-flash"
  | "openai/gpt-oss-20b:free"
  | "gemini-2.5-flash-lite";

export type Diagram = {
  _id: string;
  userId: string;
  title: string;
  type: string;
  prompt: string;
  model: Model;
  nodes: any[];
  edges: any[];
  chat?: ServerChatMessage[]; // 👈 now included with diagram
  createdAt: string;
  updatedAt: string;
};

export type CreateDiagramBody = {
  name: string;
  type: string;
  model?: Model;
};

export type UpdateDiagramBody = Partial<{
  name: string;
  type: string;
  title: string;
  nodes: any[];
  edges: any[];
  prompt: string;
  model: Model;
  chatDelta: ServerChatMessage[]; // 👈 append-only messages
}>;

export type FeedbackPayload = { name: string; feedback: string };
export type Feedback = {
  id?: string;
  _id?: string;
  name: string;
  feedback?: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
};

/* ===========================
   APIs
=========================== */

export const AuthAPI = {
  register: (body: { firstName: string; lastName: string; email: string; password: string }) =>
    api("/api/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    api("/api/login", { method: "POST", body: JSON.stringify(body) }),

  me: () => api("/api/me"),
  logout: () => api("/api/logout", { method: "POST" }),
};

export const DiagramAPI = {
  list: (params?: {
    page?: number;
    limit?: number;
  }): Promise<{ items: Diagram[]; page?: number; limit?: number; total?: number; pages?: number }> => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    const qs = q.toString();
    return api(`/api/diagrams${qs ? `?${qs}` : ""}`);
  },

  create: (body: CreateDiagramBody): Promise<Diagram> =>
    api(`/api/diagrams`, { method: "POST", body: JSON.stringify(body) }),

  update: (id: string, body: UpdateDiagramBody): Promise<Diagram> =>
    api(`/api/diagrams/${id}`, { method: "PATCH", body: JSON.stringify(body) }),

  delete: (id: string): Promise<{}> => api(`/api/diagrams/${id}`, { method: "DELETE" }),

  get: (id: string): Promise<Diagram> => api(`/api/diagrams/${id}`),
};

// ❌ removed DiagramChatAPI entirely

export const FeedbackAPI = {
  create: (body: FeedbackPayload): Promise<Feedback> =>
    api("/api/feedback", { method: "POST", body: JSON.stringify(body) }),
};
