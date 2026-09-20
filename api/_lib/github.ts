/* ==========================================================================
   Thin GitHub Contents API client. The admin panel saves by committing to the
   repository, which is what triggers Vercel to rebuild and publish.
   ========================================================================== */

const API = "https://api.github.com";

function config() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token) throw new Error("GITHUB_TOKEN is not set in your Vercel project settings.");
  if (!repo || !repo.includes("/")) {
    throw new Error('GITHUB_REPO must look like "owner/repository".');
  }
  return { token, repo, branch };
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "josiah-johnmark-admin",
  };
}

export type FileResult = { text: string; sha: string };

/** Reads a UTF-8 file from the repo. Returns null when it does not exist. */
export async function getFile(path: string): Promise<FileResult | null> {
  const { token, repo, branch } = config();
  const res = await fetch(
    `${API}/repos/${repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch)}`,
    { headers: headers(token), cache: "no-store" }
  );

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub read failed (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { content?: string; sha: string; encoding?: string };
  if (!json.content) throw new Error(`"${path}" is not a readable file.`);
  return {
    text: Buffer.from(json.content, "base64").toString("utf8"),
    sha: json.sha,
  };
}

/** Returns just the sha of a path, or null. Cheaper than reading a big file. */
export async function getSha(path: string): Promise<string | null> {
  const file = await getFile(path);
  return file?.sha ?? null;
}

/**
 * Creates or updates a file.
 * `sha` must be the sha you last read for an update; omitting it on an
 * existing path is rejected by GitHub, which is what stops two tabs from
 * silently overwriting each other.
 */
export async function putFile(opts: {
  path: string;
  /** Raw text, or base64 when `base64` is true. */
  content: string;
  base64?: boolean;
  message: string;
  sha?: string | null;
}): Promise<{ sha: string; commit: string }> {
  const { token, repo, branch } = config();

  const body: Record<string, unknown> = {
    message: opts.message,
    content: opts.base64 ? opts.content : Buffer.from(opts.content, "utf8").toString("base64"),
    branch,
  };
  if (opts.sha) body.sha = opts.sha;

  const res = await fetch(`${API}/repos/${repo}/contents/${encodeURI(opts.path)}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.status === 409 || res.status === 422) {
    throw Object.assign(
      new Error(
        "This file changed since you loaded it — someone or something else saved first. Reload the panel and reapply your edit."
      ),
      { status: 409 }
    );
  }
  if (!res.ok) {
    throw new Error(`GitHub write failed (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as {
    content: { sha: string };
    commit: { sha: string };
  };
  return { sha: json.content.sha, commit: json.commit.sha };
}

/** True when the token and repo actually work — used by the status endpoint. */
export async function checkAccess(): Promise<{ ok: boolean; repo: string; detail?: string }> {
  try {
    const { token, repo } = config();
    const res = await fetch(`${API}/repos/${repo}`, { headers: headers(token) });
    if (!res.ok) {
      return { ok: false, repo, detail: `GitHub returned ${res.status}` };
    }
    const json = (await res.json()) as { permissions?: { push?: boolean } };
    if (!json.permissions?.push) {
      return { ok: false, repo, detail: "The token cannot write to this repository." };
    }
    return { ok: true, repo };
  } catch (e) {
    return { ok: false, repo: process.env.GITHUB_REPO ?? "(unset)", detail: (e as Error).message };
  }
}
