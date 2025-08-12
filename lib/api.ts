const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    const message = data?.error?.message || res.statusText || "Request failed";
    const code = data?.error?.code;
    throw Object.assign(new Error(message), { code, status: res.status, data });
  }
  return data?.data ?? data;
}

export type Diagram = {
  _id: string;
  userId: string;
  title: string;
  type: string;
  prompt: string;
  model: "gpt5" | "gemini";
  nodes: any[];
  edges: any[];
  createdAt: string;
  updatedAt: string;
};

export type CreateDiagramBody = { name: string; type: string };
export type UpdateDiagramBody = Partial<{
  name: string;
  type: string;
  title: string; // legacy (server maps to name if needed)
  nodes: any[];
  edges: any[];
  prompt: string;
  model: "gpt5" | "gemini";
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
