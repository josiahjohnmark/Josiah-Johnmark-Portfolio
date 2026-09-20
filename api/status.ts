import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { checkAccess } from "./_lib/github";

/* Tells the panel whether the server is configured correctly, so a
   misconfiguration shows as a clear message instead of a failed save. */
async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  const env = {
    ADMIN_PASSWORD: Boolean(process.env.ADMIN_PASSWORD),
    SESSION_SECRET: Boolean(process.env.SESSION_SECRET),
    GITHUB_TOKEN: Boolean(process.env.GITHUB_TOKEN),
    GITHUB_REPO: process.env.GITHUB_REPO ?? null,
    GITHUB_BRANCH: process.env.GITHUB_BRANCH ?? "main",
  };

  const github = await checkAccess();

  res.status(200).json({ env, github });
}

export default requireAuth(handler);
