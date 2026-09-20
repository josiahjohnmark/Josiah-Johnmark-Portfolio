import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  checkPassword,
  clearSession,
  clearThrottle,
  hasValidSession,
  issueSession,
  throttle,
} from "./_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  /* Is the current visitor signed in? */
  if (req.method === "GET") {
    res.status(200).json({ signedIn: hasValidSession(req) });
    return;
  }

  /* Sign out. */
  if (req.method === "DELETE") {
    clearSession(res);
    res.status(200).json({ signedIn: false });
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, DELETE");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  /* Sign in. */
  const gate = throttle(req);
  if (!gate.allowed) {
    res.status(429).json({
      error: `Too many attempts. Try again in about ${Math.ceil(gate.retryInSeconds / 60)} minutes.`,
    });
    return;
  }

  try {
    const password = (req.body as { password?: unknown } | undefined)?.password;
    if (!checkPassword(password)) {
      /* A deliberate pause so guessing is slow even when the throttle resets. */
      await new Promise((r) => setTimeout(r, 600));
      res.status(401).json({ error: "That password is not right." });
      return;
    }
    clearThrottle(req);
    issueSession(res);
    res.status(200).json({ signedIn: true });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}
