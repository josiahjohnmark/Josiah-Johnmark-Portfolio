/* ==========================================================================
   Image optimisation, done in the browser before upload.

   Doing it here rather than on the server means the serverless function stays
   tiny (no native image library) and a 6MB phone screenshot never has to
   travel over the network in the first place.
   ========================================================================== */

export type ImageKind = "cover" | "screen" | "exploration" | "drawing" | "brand";

/* Longest-edge budget per use. Generous enough for retina, small enough that
   nothing here slows the site down. */
const MAX_EDGE: Record<ImageKind, number> = {
  cover: 1600,
  screen: 1200,
  exploration: 1280,
  drawing: 1100,
  brand: 1200,
};

const FOLDER: Record<ImageKind, string> = {
  cover: "projects",
  screen: "screens",
  exploration: "explorations",
  drawing: "drawings",
  brand: "brand",
};

export const folderFor = (kind: ImageKind) => FOLDER[kind];

export type Optimised = {
  base64: string;
  type: string;
  width: number;
  height: number;
  bytes: number;
  originalBytes: number;
};

function canEncodeWebp(): boolean {
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    return c.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    return false;
  }
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(file);
    } catch {
      /* Fall through to the <img> path below. */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("That file could not be read as an image."));
      img.src = url;
    });
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(blob);
  });
}

export async function optimise(file: File, kind: ImageKind): Promise<Optimised> {
  if (!file.type.startsWith("image/")) {
    throw new Error("That is not an image file.");
  }
  if (file.size > 25_000_000) {
    throw new Error("That image is over 25MB — please pick a smaller one.");
  }

  /* SVGs are already small and vector; pass them through untouched. */
  if (file.type === "image/svg+xml") {
    throw new Error("SVGs are not supported here — export a PNG or JPG instead.");
  }

  const source = await loadBitmap(file);
  const sw = "width" in source ? source.width : 0;
  const sh = "height" in source ? source.height : 0;
  if (!sw || !sh) throw new Error("That image has no usable dimensions.");

  const max = MAX_EDGE[kind];
  const scale = Math.min(1, max / Math.max(sw, sh));
  const width = Math.max(1, Math.round(sw * scale));
  const height = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser cannot process images.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source as CanvasImageSource, 0, 0, width, height);
  if ("close" in source) source.close();

  const webp = canEncodeWebp();
  let type = webp ? "image/webp" : "image/jpeg";
  let quality = webp ? 0.86 : 0.88;
  let blob = await toBlob(canvas, type, quality);

  /* If it is still heavy, step the quality down rather than the size —
     screenshots stay legible that way. */
  while (blob && blob.size > 900_000 && quality > 0.6) {
    quality -= 0.08;
    blob = await toBlob(canvas, type, quality);
  }

  if (!blob) {
    type = "image/png";
    blob = await toBlob(canvas, type, 1);
  }
  if (!blob) throw new Error("This browser could not encode that image.");

  return {
    base64: await blobToBase64(blob),
    type,
    width,
    height,
    bytes: blob.size,
    originalBytes: file.size,
  };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1_000_000) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1_000_000).toFixed(1)} MB`;
}
