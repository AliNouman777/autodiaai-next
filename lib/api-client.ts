// lib/api-client.ts
import { api } from "./api";
import { redirect } from "next/navigation";

// Only call this in client components (useRouter is also fine)
export function apiWithRedirect(path: string, options?: RequestInit) {
  return api(path, {
    ...options,
    onUnauthorized: ({ path }) => {
      const current =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/";
      window.location.replace(`/login?next=${encodeURIComponent(current)}`);
    },
  });
}
