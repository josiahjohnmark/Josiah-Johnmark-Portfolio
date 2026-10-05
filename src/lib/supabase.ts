import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* ==========================================================================
   Supabase Analytics & Storage Client
   Provides real-time visitor tracking, dwell time monitoring, and
   social-media-style creator metrics.
   ========================================================================== */

const STORAGE_KEY_URL = "jj_supabase_url";
const STORAGE_KEY_ANON = "jj_supabase_key";

export interface AnalyticsSession {
  id?: string;
  session_id: string;
  page_path: string;
  referrer: string;
  device_type: "mobile" | "desktop" | "tablet";
  browser: string;
  os: string;
  country: string;
  country_code: string;
  city: string;
  duration_seconds: number;
  screen_resolution?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AnalyticsSummary {
  connected: boolean;
  totalVisitors: number;
  liveNow: number;
  avgDurationSeconds: number;
  avgDurationFormatted: string;
  topCountries: { country: string; code: string; count: number; percentage: number }[];
  topCities: { city: string; country: string; count: number }[];
  devices: { type: string; count: number; percentage: number }[];
  browsers: { name: string; count: number }[];
  osList: { name: string; count: number }[];
  durationBuckets: {
    bounce: number; // < 30s
    short: number; // 30s - 2m
    engaged: number; // 2m - 5m
    deep: number; // 5m+
  };
  recentVisitors: AnalyticsSession[];
}

/** Get active Supabase configuration (prefers localStorage override for easy dashboard setup, falls back to env vars) */
export function getSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean } {
  let url = "";
  let anonKey = "";

  if (typeof window !== "undefined") {
    url = window.localStorage.getItem(STORAGE_KEY_URL) || "";
    anonKey = window.localStorage.getItem(STORAGE_KEY_ANON) || "";
  }

  if (!url) {
    url = (import.meta.env.VITE_SUPABASE_URL as string) || "";
  }
  if (!anonKey) {
    anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "";
  }

  url = url.trim().replace(/\/+$/, "");
  anonKey = anonKey.trim();

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && url.startsWith("https://")),
  };
}

/** Save custom Supabase credentials from the Admin Panel */
export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY_URL, url.trim().replace(/\/+$/, ""));
  window.localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
}

/** Clear saved Supabase credentials */
export function clearSupabaseConfig(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY_URL);
  window.localStorage.removeItem(STORAGE_KEY_ANON);
}

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = "";
let lastUsedKey = "";

/** Get or create Supabase client instance */
export function getSupabase(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (cachedClient && lastUsedUrl === url && lastUsedKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
    lastUsedUrl = url;
    lastUsedKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.warn("Could not initialize Supabase client:", err);
    return null;
  }
}

/** Test Supabase connection and check if `portfolio_analytics` table exists */
export async function testSupabaseConnection(
  urlInput?: string,
  keyInput?: string
): Promise<{ ok: boolean; message: string; tableReady: boolean }> {
  const url = (urlInput ?? getSupabaseConfig().url).trim().replace(/\/+$/, "");
  const anonKey = (keyInput ?? getSupabaseConfig().anonKey).trim();

  if (!url || !anonKey) {
    return { ok: false, message: "Missing Supabase URL or Anon key.", tableReady: false };
  }

  if (!url.startsWith("https://")) {
    return { ok: false, message: "Supabase URL must start with https://", tableReady: false };
  }

  try {
    const testClient = createClient(url, anonKey, { auth: { persistSession: false } });
    const { data, error } = await testClient
      .from("portfolio_analytics")
      .select("id")
      .limit(1);

    if (error) {
      if (error.code === "42P01" || error.message?.includes("relation") || error.message?.includes("does not exist")) {
        return {
          ok: true,
          tableReady: false,
          message: "Connected to Supabase! However, the 'portfolio_analytics' table hasn't been created yet. Run the SQL schema script below.",
        };
      }
      return {
        ok: false,
        tableReady: false,
        message: `Supabase error: ${error.message} (code: ${error.code || "unknown"})`,
      };
    }

    return {
      ok: true,
      tableReady: true,
      message: "Connection verified! Supabase is active and recording real visitor analytics.",
    };
  } catch (e) {
    return {
      ok: false,
      tableReady: false,
      message: (e as Error).message || "Failed to reach Supabase.",
    };
  }
}

/** Format seconds into readable duration e.g. "3m 42s" */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

/** Convert 2-letter country code into flag emoji */
export function getCountryFlag(code?: string): string {
  if (!code || code.length !== 2) return "🌐";
  const upper = code.toUpperCase();
  const first = upper.codePointAt(0);
  const second = upper.codePointAt(1);
  if (!first || !second) return "🌐";
  // Regional indicator symbols start at 0x1F1E6 for 'A'
  return String.fromCodePoint(first + 127397, second + 127397);
}

/** Fetch aggregated real analytics summary from Supabase */
export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      connected: false,
      totalVisitors: 0,
      liveNow: 0,
      avgDurationSeconds: 0,
      avgDurationFormatted: "0s",
      topCountries: [],
      topCities: [],
      devices: [],
      browsers: [],
      osList: [],
      durationBuckets: { bounce: 0, short: 0, engaged: 0, deep: 0 },
      recentVisitors: [],
    };
  }

  try {
    // Fetch recent 500 visitor records
    const { data, error } = await supabase
      .from("portfolio_analytics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error || !data) {
      console.warn("Error fetching portfolio_analytics:", error);
      return {
        connected: true,
        totalVisitors: 0,
        liveNow: 0,
        avgDurationSeconds: 0,
        avgDurationFormatted: "0s",
        topCountries: [],
        topCities: [],
        devices: [],
        browsers: [],
        osList: [],
        durationBuckets: { bounce: 0, short: 0, engaged: 0, deep: 0 },
        recentVisitors: [],
      };
    }

    const rows = data as AnalyticsSession[];
    const totalVisitors = rows.length;

    // Calculate live visitors (active within last 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    let liveNow = 0;

    let totalDuration = 0;
    const countryMap = new Map<string, { code: string; count: number }>();
    const cityMap = new Map<string, { country: string; count: number }>();
    const deviceMap = new Map<string, number>();
    const browserMap = new Map<string, number>();
    const osMap = new Map<string, number>();
    const buckets = { bounce: 0, short: 0, engaged: 0, deep: 0 };

    for (const row of rows) {
      const duration = Number(row.duration_seconds) || 0;
      totalDuration += duration;

      // Bucketing
      if (duration < 30) buckets.bounce++;
      else if (duration < 120) buckets.short++;
      else if (duration < 300) buckets.engaged++;
      else buckets.deep++;

      // Live detection
      const updatedTimestamp = new Date(row.updated_at || row.created_at || 0).getTime();
      if (updatedTimestamp > fiveMinutesAgo) {
        liveNow++;
      }

      // Countries
      const country = row.country && row.country !== "Unknown" ? row.country : "Direct / Other";
      const code = row.country_code || "";
      const c = countryMap.get(country) || { code, count: 0 };
      c.count++;
      if (code && !c.code) c.code = code;
      countryMap.set(country, c);

      // Cities
      if (row.city && row.city !== "Unknown") {
        const cityKey = `${row.city}, ${country}`;
        const count = (cityMap.get(cityKey)?.count || 0) + 1;
        cityMap.set(cityKey, { country, count });
      }

      // Devices
      const dev = row.device_type || "desktop";
      deviceMap.set(dev, (deviceMap.get(dev) || 0) + 1);

      // Browsers
      const b = row.browser || "Other";
      browserMap.set(b, (browserMap.get(b) || 0) + 1);

      // OS
      const os = row.os || "Other";
      osMap.set(os, (osMap.get(os) || 0) + 1);
    }

    const avgDurationSeconds = totalVisitors > 0 ? Math.round(totalDuration / totalVisitors) : 0;

    const topCountries = Array.from(countryMap.entries())
      .map(([country, info]) => ({
        country,
        code: info.code,
        count: info.count,
        percentage: Math.round((info.count / (totalVisitors || 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const topCities = Array.from(cityMap.entries())
      .map(([key, info]) => ({
        city: key.split(",")[0].trim(),
        country: info.country,
        count: info.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const devices = Array.from(deviceMap.entries())
      .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / (totalVisitors || 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    const browsers = Array.from(browserMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const osList = Array.from(osMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      connected: true,
      totalVisitors,
      liveNow,
      avgDurationSeconds,
      avgDurationFormatted: formatDuration(avgDurationSeconds),
      topCountries,
      topCities,
      devices,
      browsers,
      osList,
      durationBuckets: buckets,
      recentVisitors: rows.slice(0, 25),
    };
  } catch (err) {
    console.error("fetchAnalyticsSummary failed:", err);
    return {
      connected: true,
      totalVisitors: 0,
      liveNow: 0,
      avgDurationSeconds: 0,
      avgDurationFormatted: "0s",
      topCountries: [],
      topCities: [],
      devices: [],
      browsers: [],
      osList: [],
      durationBuckets: { bounce: 0, short: 0, engaged: 0, deep: 0 },
      recentVisitors: [],
    };
  }
}

/** SQL schema definition that user can run in Supabase */
export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- Josiah Johnmark Portfolio Analytics
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ========================================================

create table if not exists public.portfolio_analytics (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  page_path text default '/',
  referrer text default 'direct',
  device_type text default 'desktop',
  browser text default 'Unknown',
  os text default 'Unknown',
  country text default 'Unknown',
  country_code text default '',
  city text default 'Unknown',
  duration_seconds integer default 0,
  screen_resolution text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Optimize queries for analytics aggregation
create index if not exists idx_portfolio_analytics_created on public.portfolio_analytics (created_at desc);
create index if not exists idx_portfolio_analytics_session on public.portfolio_analytics (session_id);

-- Enable Row Level Security (RLS)
alter table public.portfolio_analytics enable row level security;

-- Policies
drop policy if exists "Allow public visitor log insert" on public.portfolio_analytics;
drop policy if exists "Allow session duration heartbeat" on public.portfolio_analytics;
drop policy if exists "Allow reading analytics" on public.portfolio_analytics;

create policy "Allow public visitor log insert"
  on public.portfolio_analytics for insert
  with check (true);

create policy "Allow session duration heartbeat"
  on public.portfolio_analytics for update
  using (true);

create policy "Allow reading analytics"
  on public.portfolio_analytics for select
  using (true);
`;
