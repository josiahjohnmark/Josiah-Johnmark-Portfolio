import { getSupabase, type AnalyticsSession } from "./supabase";

/* ==========================================================================
   Real Visitor Analytics Tracker
   Tracks visits, country, city, device, browser, and real dwell time
   without blocking or degrading page performance.
   ========================================================================== */

const SESSION_KEY = "jj_visit_sid";
const SESSION_START_KEY = "jj_visit_start";

/** Generate a unique session identifier for this visit */
function getOrCreateSessionId(): { sessionId: string; startTime: number; isNew: boolean } {
  let sessionId = "";
  let startTime = Date.now();
  let isNew = false;

  try {
    sessionId = sessionStorage.getItem(SESSION_KEY) || "";
    const storedStart = sessionStorage.getItem(SESSION_START_KEY);
    if (storedStart) {
      startTime = parseInt(storedStart, 10) || Date.now();
    }

    if (!sessionId) {
      sessionId = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem(SESSION_KEY, sessionId);
      sessionStorage.setItem(SESSION_START_KEY, String(startTime));
      isNew = true;
    }
  } catch {
    sessionId = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    isNew = true;
  }

  return { sessionId, startTime, isNew };
}

/** Detect device category from User Agent & screen */
function detectDevice(): "mobile" | "desktop" | "tablet" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;

  if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(ua)) {
    return "tablet";
  }
  if (/(mobi|iphone|ipod|android.*mobile|blackberry|opera mini|iemobile|wpdesktop)/i.test(ua) || width < 640) {
    return "mobile";
  }
  return "desktop";
}

/** Detect human-friendly browser name */
function detectBrowser(): string {
  if (typeof window === "undefined") return "Unknown";
  const ua = navigator.userAgent;

  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Edg/")) return "Microsoft Edge";
  if (ua.includes("Chrome/") && !ua.includes("Edg/")) return "Google Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  if (ua.includes("OPR/") || ua.includes("Opera/")) return "Opera";
  if (ua.includes("SamsungBrowser/")) return "Samsung Internet";
  return "Other";
}

/** Detect operating system */
function detectOS(): string {
  if (typeof window === "undefined") return "Unknown";
  const ua = navigator.userAgent;

  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Mac OS X|Macintosh/i.test(ua)) return "macOS";
  if (/Windows NT/i.test(ua)) return "Windows";
  if (/Linux/i.test(ua)) return "Linux";
  if (/CrOS/i.test(ua)) return "ChromeOS";
  return "Other";
}

/** Get visitor IP location safely without blocking */
async function resolveLocation(): Promise<{ country: string; country_code: string; city: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch("https://ipapi.co/json/", {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        country: data.country_name || data.country || "Unknown",
        country_code: data.country_code || data.country || "",
        city: data.city || "Unknown",
      };
    }
  } catch {
    // If ipapi is blocked or offline, try fast fallback
    try {
      const controller2 = new AbortController();
      const timeoutId2 = setTimeout(() => controller2.abort(), 2000);
      const res2 = await fetch("https://api.country.is/", { signal: controller2.signal });
      clearTimeout(timeoutId2);
      if (res2.ok) {
        const data2 = await res2.json();
        return {
          country: data2.country || "Unknown",
          country_code: data2.country || "",
          city: "Unknown",
        };
      }
    } catch {
      /* Fallback gracefully */
    }
  }

  // Fallback using browser timezone hint
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("/")) {
      const parts = tz.split("/");
      return {
        country: parts[0] || "Unknown",
        country_code: "",
        city: parts[1]?.replace(/_/g, " ") || "Unknown",
      };
    }
  } catch {
    /* No-op */
  }

  return { country: "Unknown", country_code: "", city: "Unknown" };
}

let trackerInitialized = false;

/**
 * Initialize real-time visitor analytics tracking.
 * Safe to call multiple times (guarded by singleton flag).
 */
export function initVisitorTracker(): () => void {
  if (typeof window === "undefined" || trackerInitialized) {
    return () => {};
  }

  // Do not track admin panel visits as client portfolio views
  if (window.location.pathname.startsWith("/admin")) {
    return () => {};
  }

  trackerInitialized = true;
  const { sessionId, startTime, isNew } = getOrCreateSessionId();

  const device = detectDevice();
  const browser = detectBrowser();
  const os = detectOS();
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const pagePath = window.location.pathname + window.location.hash;
  const referrer = document.referrer ? new URL(document.referrer, window.location.href).hostname : "direct";

  let lastReportedDuration = 0;

  // Function to send duration updates to Supabase
  const sendDurationUpdate = async (seconds: number) => {
    if (seconds <= lastReportedDuration) return;
    lastReportedDuration = seconds;

    const supabase = getSupabase();
    if (!supabase) return;

    try {
      await supabase
        .from("portfolio_analytics")
        .update({
          duration_seconds: seconds,
          updated_at: new Date().toISOString(),
        })
        .eq("session_id", sessionId);
    } catch {
      /* Silent error handling for background telemetry */
    }
  };

  // Asynchronously record session start
  (async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    const loc = await resolveLocation();

    const record: AnalyticsSession = {
      session_id: sessionId,
      page_path: pagePath,
      referrer,
      device_type: device,
      browser,
      os,
      country: loc.country,
      country_code: loc.country_code,
      city: loc.city,
      duration_seconds: Math.floor((Date.now() - startTime) / 1000),
      screen_resolution: screenResolution,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isNew) {
        await supabase.from("portfolio_analytics").insert([record]);
      } else {
        await supabase
          .from("portfolio_analytics")
          .update({
            duration_seconds: record.duration_seconds,
            updated_at: record.updated_at,
          })
          .eq("session_id", sessionId);
      }
    } catch (e) {
      console.warn("Analytics ping error:", e);
    }
  })();

  // Periodic heartbeat every 15 seconds to track active minutes spent
  const heartbeatTimer = window.setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    void sendDurationUpdate(elapsedSeconds);
  }, 15000);

  // Send update when user switches tabs or navigates away
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      void sendDurationUpdate(elapsedSeconds);
    }
  };

  const handlePageHide = () => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    void sendDurationUpdate(elapsedSeconds);
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("pagehide", handlePageHide);
  window.addEventListener("beforeunload", handlePageHide);

  return () => {
    clearInterval(heartbeatTimer);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("pagehide", handlePageHide);
    window.removeEventListener("beforeunload", handlePageHide);
  };
}
