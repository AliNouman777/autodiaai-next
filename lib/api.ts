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
