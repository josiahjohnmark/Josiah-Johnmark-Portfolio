import type { Content, Issue } from "../data/schema";

export class ApiError extends Error {
  status: number;
  issues?: Issue[];
  constructor(message: string, status: number, issues?: Issue[]) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
  } catch {
    throw new ApiError("Could not reach the server. Check your connection.", 0);
  }

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* Server returned something that is not JSON — surface the status. */
  }

  if (!res.ok) {
    const payload = data as { error?: string; issues?: Issue[] } | null;
    throw new ApiError(
      payload?.error ?? `Request failed (${res.status}).`,
      res.status,
      payload?.issues
    );
  }
  return data as T;
}

export const api = {
  session: () => request<{ signedIn: boolean }>("/api/auth"),

  signIn: (password: string) =>
    request<{ signedIn: boolean }>("/api/auth", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),

  signOut: () => request<{ signedIn: boolean }>("/api/auth", { method: "DELETE" }),

  status: () =>
    request<{
      env: Record<string, unknown>;
      github: { ok: boolean; repo: string; detail?: string };
    }>("/api/status"),

  load: () => request<{ content: Content; sha: string }>("/api/content"),

  save: (content: Content, sha: string, message: string) =>
    request<{ sha: string; commit: string }>("/api/content", {
      method: "PUT",
      body: JSON.stringify({ content, sha, message }),
    }),

  upload: (folder: string, name: string, type: string, base64: string) =>
    request<{ path: string; bytes: number; commit: string }>("/api/upload", {
      method: "POST",
      body: JSON.stringify({ folder, name, type, data: base64 }),
    }),
};
