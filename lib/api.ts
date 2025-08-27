// lib/api.ts
const BASE_URL = "https://api.autodia.tech";
// const BASE_URL = "http://localhost:4000";

export class ApiError extends Error {
  status?: number;
  code?: string | number;
  data?: any;
  constructor(
    message: string,
    opts?: { status?: number; code?: string | number; data?: any }
  ) {
    super(message);
    this.name = "ApiError";
    this.status = opts?.status;
    this.code = opts?.code;
    this.data = opts?.data;
  }
}

type ApiOptions = RequestInit & {
  /** Optional: run on client when a 401 is detected (e.g., redirect to /login). */
  onUnauthorized?: (info: { path: string; status: number }) => void;
};

export type FeedbackPayload = { name: string; feedback: string };
export type Feedback = {
  id?: string; // mongoose virtual id
  _id?: string; // raw ObjectId (optional, if backend includes it)
  name: string;
  feedback?: string; // include only if backend echoes it back
  message: string; // e.g. "John, thank you for your feedback!"
  createdAt?: string;
  updatedAt?: string;
};

function isFormData(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

async function parseBodySafe(res: Response) {
  // Handle no-content responses fast
  if (res.status === 204 || res.status === 205) return undefined;

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      // Server said JSON but body was empty/invalid
      return undefined;
    }
  }

  // Fallback to text to preserve server error messages
  try {
    const text = await res.text();
    return text || undefined;
  } catch {
    return undefined;
  }
}

export async function api(path: string, options: ApiOptions = {}) {
  const { onUnauthorized, ...fetchOptions } = options;

  // Auto headers: only set JSON when we're actually sending JSON
  const init: RequestInit = {
    credentials: "include",
    ...fetchOptions,
    headers: {
      ...(fetchOptions.headers || {}),
    },
  };

  const body = (fetchOptions as RequestInit).body;
  const shouldSetJson =
    body !== undefined &&
    typeof body === "string" && // you already stringified JSON in callers
    !isFormData(body as any);
  if (shouldSetJson) {
    (init.headers as Record<string, string>)["Content-Type"] =
      "application/json";
  }
  // Clients often expect JSON back
  (init.headers as Record<string, string>)["Accept"] =
    (init.headers as Record<string, string>)["Accept"] || "application/json";

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, init);
  } catch (e: any) {
    // Network/CORS errors never reach res.ok; normalize them
    throw new ApiError(e?.message || "Network error", { status: undefined });
  }

  const raw = await parseBodySafe(res);
  // If server uses { ok, data, error }, normalize it; otherwise just pass raw
  const isJsonEnvelope =
    raw &&
    typeof raw === "object" &&
    ("ok" in (raw as any) || "data" in (raw as any));

  const ok = isJsonEnvelope ? (raw as any).ok !== false && res.ok : res.ok;
  if (!ok) {
    const message =
      (isJsonEnvelope &&
        ((raw as any).error?.message || (raw as any).message)) ||
      (typeof raw === "string" ? raw : undefined) ||
      res.statusText ||
      "Request failed";

    if (res.status === 401 && typeof window !== "undefined" && onUnauthorized) {
      onUnauthorized({ path, status: res.status });
    }

    const code = isJsonEnvelope ? (raw as any).error?.code : undefined;
    const data = isJsonEnvelope ? (raw as any).data ?? raw : raw;

    throw new ApiError(message, { status: res.status, code, data });
  }

  // Success: unwrap your envelope or return raw
  return isJsonEnvelope ? (raw as any).data ?? raw : raw;
}

/** Canonical model types only */
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
  title: string; // legacy server mapping still allowed
  nodes: any[];
  edges: any[];
  prompt: string;
  model: Model;
}>;

export const AuthAPI = {
  register: (body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => api("/api/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    api("/api/login", { method: "POST", body: JSON.stringify(body) }),

  me: () => api("/api/me"),
  logout: () => api("/api/logout", { method: "POST" }),
};

export const DiagramAPI = {
  list: (params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    items: Diagram[];
    page?: number;
    limit?: number;
    total?: number;
    pages?: number;
  }> => {
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

  delete: (id: string): Promise<{}> =>
    api(`/api/diagrams/${id}`, { method: "DELETE" }),

  get: (id: string): Promise<Diagram> => api(`/api/diagrams/${id}`),
};

export const FeedbackAPI = {
  create: (body: FeedbackPayload): Promise<Feedback> =>
    api("/api/feedback", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
