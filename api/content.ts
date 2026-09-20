import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { getFile, putFile } from "./_lib/github";
import { renumber, validateContent, type Content } from "../src/data/schema";

const CONTENT_PATH = "src/data/content.json";

async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  /* ----------------------------- read ----------------------------- */
  if (req.method === "GET") {
    try {
      const file = await getFile(CONTENT_PATH);
      if (!file) {
        res.status(404).json({ error: `${CONTENT_PATH} was not found in the repository.` });
        return;
      }
      res.status(200).json({ content: JSON.parse(file.text), sha: file.sha });
    } catch (e) {
      res.status(502).json({ error: (e as Error).message });
    }
    return;
  }

  /* ----------------------------- save ----------------------------- */
  if (req.method === "PUT") {
    const body = req.body as { content?: unknown; sha?: unknown; message?: unknown } | undefined;

    if (typeof body?.sha !== "string" || body.sha === "") {
      res.status(400).json({ error: "Missing the file revision. Reload the panel and try again." });
      return;
    }

    /* Validate again on the server — the browser check is a convenience, this
       one is the guarantee that nothing malformed reaches the live site. */
    const issues = validateContent(body.content);
    if (issues.length > 0) {
      res.status(422).json({ error: "Some fields need fixing before this can be published.", issues });
      return;
    }

    const content = body.content as Content;
    content.projects = renumber(content.projects);

    const summary =
      typeof body.message === "string" && body.message.trim() !== ""
        ? body.message.trim().slice(0, 72)
        : "Update site content";

    try {
      const result = await putFile({
        path: CONTENT_PATH,
        content: JSON.stringify(content, null, 2) + "\n",
        message: `content: ${summary}\n\nEdited from the admin panel.`,
        sha: body.sha,
      });
      res.status(200).json({ sha: result.sha, commit: result.commit.slice(0, 7) });
    } catch (e) {
      const err = e as Error & { status?: number };
      res.status(err.status === 409 ? 409 : 502).json({ error: err.message });
    }
    return;
  }

  res.setHeader("Allow", "GET, PUT");
  res.status(405).json({ error: "Method not allowed." });
}

export default requireAuth(handler);
