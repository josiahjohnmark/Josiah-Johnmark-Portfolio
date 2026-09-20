import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const COOKIE = "jj_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "SESSION_SECRET is missing or too short. Set it in your Vercel project settings."
    );
  }
  return s;
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(payload: string): string {
  return b64url(createHmac("sha256", secret()).update(payload).digest());
}

/* Constant-time string comparison that does not leak length through timing
   any more than necessary — both sides are hashed to a fixed width first. */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHmac("sha256", "cmp").update(a).digest();
  const hb = createHmac("sha256", "cmp").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(candidate: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 8) {
    throw new Error(
      "ADMIN_PASSWORD is missing or shorter than 8 characters. Set it in your Vercel project settings."
    );
  }
  if (typeof candidate !== "string" || candidate.length === 0) return false;
  return safeEqual(candidate, expected);
}

export function issueSession(res: VercelResponse): void {
  const payload = b64url(
    JSON.stringify({ exp: Date.now() + MAX_AGE_SECONDS * 1000, n: randomBytes(6).toString("hex") })
  );
  const token = `${payload}.${sign(payload)}`;
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE_SECONDS}`
  );
}

export function clearSession(res: VercelResponse): void {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`
  );
}

export function hasValidSession(req: VercelRequest): boolean {
  const raw = req.headers.cookie ?? "";
  const match = raw
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE}=`));
  if (!match) return false;

  const token = match.slice(COOKIE.length + 1);
  const dot = token.lastIndexOf(".");
  if (dot < 1) return false;

  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!safeEqual(signature, sign(payload))) return false;

  try {
    const data = JSON.parse(
      Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
    );
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

/* Wraps a handler so it only runs for a signed-in admin. */
export function requireAuth(
  handler: (req: VercelRequest, res: VercelResponse) => Promise<void> | void
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    if (!hasValidSession(req)) {
      res.status(401).json({ error: "Not signed in." });
      return;
    }
    await handler(req, res);
  };
}

/* --------------------------------------------------------------------------
   Very small in-memory throttle. Serverless instances are recycled, so this
   is a speed bump rather than a guarantee — the real protection is a long
   ADMIN_PASSWORD. It does stop a naive loop from one warm instance.
   -------------------------------------------------------------------------- */
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export function throttle(req: VercelRequest): { allowed: boolean; retryInSeconds: number } {
  const ip =
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ||
    "unknown";
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now - entry.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now });
    return { allowed: true, retryInSeconds: 0 };
  }
  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryInSeconds: Math.ceil((entry.first + WINDOW_MS - now) / 1000),
    };
  }
  return { allowed: true, retryInSeconds: 0 };
}

export function clearThrottle(req: VercelRequest): void {
  const ip =
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ||
    "unknown";
  attempts.delete(ip);
}
