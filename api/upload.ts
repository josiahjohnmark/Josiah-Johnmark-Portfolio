import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { getSha, putFile } from "./_lib/github";
import { slugify } from "../src/data/schema";

/* Images arrive already resized and converted by the browser, so this handler
   only has to name them safely and commit them. That keeps the function small
   and avoids a native image dependency. */

const ALLOWED: Record<string, string> = {
  "image/webp": "webp",
  "image/png": "png",
  "image/jpeg": "jpg",
};

/* Folders the panel is allowed to write into. */
const FOLDERS = new Set(["projects", "screens", "explorations", "drawings", "brand"]);

const MAX_BYTES = 3_500_000; // comfortably under Vercel's request body limit

async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const body = req.body as
    | { folder?: unknown; name?: unknown; type?: unknown; data?: unknown }
    | undefined;

  const folder = String(body?.folder ?? "");
  const type = String(body?.type ?? "");
  const rawName = String(body?.name ?? "");
  const data = body?.data;

  if (!FOLDERS.has(folder)) {
    res.status(400).json({ error: `Unknown image folder "${folder}".` });
    return;
  }
  const ext = ALLOWED[type];
  if (!ext) {
    res.status(415).json({ error: "Only WebP, PNG and JPEG images can be uploaded." });
    return;
  }
  if (typeof data !== "string" || data.length === 0) {
    res.status(400).json({ error: "No image data was received." });
    return;
  }

  const bytes = Buffer.from(data, "base64");
  if (bytes.length === 0) {
    res.status(400).json({ error: "That image could not be read." });
    return;
  }
  if (bytes.length > MAX_BYTES) {
    res.status(413).json({
      error: `That image is ${(bytes.length / 1_000_000).toFixed(1)}MB after optimising, which is too large. Try a smaller source image.`,
    });
    return;
  }

  /* Check the file really is the image type it claims to be. */
  const sig = bytes.subarray(0, 12);
  const looksPng = sig[0] === 0x89 && sig[1] === 0x50 && sig[2] === 0x4e && sig[3] === 0x47;
  const looksJpeg = sig[0] === 0xff && sig[1] === 0xd8 && sig[2] === 0xff;
  const looksWebp =
    sig.subarray(0, 4).toString("ascii") === "RIFF" &&
    sig.subarray(8, 12).toString("ascii") === "WEBP";
  const matches =
    (ext === "png" && looksPng) || (ext === "jpg" && looksJpeg) || (ext === "webp" && looksWebp);
  if (!matches) {
    res.status(415).json({ error: "That file does not look like a real image." });
    return;
  }

  /* Safe, readable, collision-proof filename. */
  const base = slugify(rawName.replace(/\.[a-z0-9]+$/i, "")) || "image";
  const stamp = Date.now().toString(36).slice(-6);
  const filename = `${base}-${stamp}.${ext}`;
  const path = `public/images/${folder}/${filename}`;
  const publicPath = `/images/${folder}/${filename}`;

  try {
    const existing = await getSha(path); // essentially always null thanks to the stamp
    const result = await putFile({
      path,
      content: bytes.toString("base64"),
      base64: true,
      message: `content: add image ${filename}\n\nUploaded from the admin panel.`,
      sha: existing,
    });
    res.status(200).json({
      path: publicPath,
      bytes: bytes.length,
      commit: result.commit.slice(0, 7),
    });
  } catch (e) {
    res.status(502).json({ error: (e as Error).message });
  }
}

export default requireAuth(handler);
