// lib/api-client.ts
export type ApiOk<T> = { success: true; data: T };
export type ApiFail = {
  success: false;
  error: { code?: string; message: string };
};

async function parseBody(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

/**
 * Fetch wrapper that:
 * - returns .data for success
 * - throws an error object that carries res.status and res.data for failures
 */
export async function request<T = unknown>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });

  const body = await parseBody(res);

  if (res.ok) {
    // Handle our ok() shape { success:true, data }
    if (body && typeof body === "object" && body.success === true) {
      return (body as ApiOk<T>).data;
    }
    // If you ever return raw data
    return body as T;
  }

  // Build a rich error carrying status + data so your UI can toast properly
  const err: any = new Error(
    (body && body.error?.message) ||
      (body && body.message) ||
      (typeof body === "string" ? body : "Request failed")
  );
  err.status = res.status;
  err.data = body;

  // Keep your backend error code accessible
  if (body && body.error && body.error.code) err.code = body.error.code;

  throw err;
}
