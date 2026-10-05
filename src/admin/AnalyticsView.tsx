import React, { useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  Clock,
  Compass,
  Database,
  ExternalLink,
  Eye,
  Globe,
  Laptop,
  RefreshCw,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
  Users,
} from "lucide-react";
import {
  fetchAnalyticsSummary,
  formatDuration,
  getCountryFlag,
  getSupabaseConfig,
  type AnalyticsSummary,
} from "../lib/supabase";

interface AnalyticsViewProps {
  onOpenSupabaseModal: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onOpenSupabaseModal }) => {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const summary = await fetchAnalyticsSummary();
      setData(summary);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadData();
    // Auto refresh every 30 seconds for live data
    const interval = setInterval(() => {
      void fetchAnalyticsSummary().then(setData);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const config = getSupabaseConfig();

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Top Banner / Supabase Connection Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#17171a] via-[#1c1c20] to-[#17171a] border border-white/10 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                config.isConfigured
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
              }`}
            >
              <Database className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-medium text-white">
                  {config.isConfigured ? "Supabase Live Connected" : "Supabase Setup Required"}
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    config.isConfigured
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      config.isConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                    }`}
                  />
                  {config.isConfigured ? "Real-time Telemetry Active" : "Waiting for Connection"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {config.isConfigured
                  ? "Every portfolio visitor, their country, device, and exact dwell time is recorded in your Supabase database."
                  : "Connect your Supabase project in 2 minutes to start capturing 100% real visitor data."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={onOpenSupabaseModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-medium transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{config.isConfigured ? "Supabase Settings" : "Connect Supabase"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid (Creator Studio / Social Media Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Visitors */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#141417] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Total Visitors</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            {loading ? "…" : data?.totalVisitors ?? 0}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1.5">
            {config.isConfigured ? "Recorded in Supabase" : "Connect database to record"}
          </p>
        </div>

        {/* Avg Time Spent */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#141417] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Avg. Time Spent</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            {loading ? "…" : data?.avgDurationFormatted || "0s"}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1.5">
            {data && data.avgDurationSeconds > 120
              ? "🔥 High engagement"
              : "Active time on portfolio"}
          </p>
        </div>

        {/* Live Active Now */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#141417] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Live Now</span>
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              {loading ? "…" : data?.liveNow ?? 0}
            </span>
            <span className="text-xs text-emerald-400 font-medium">active</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1.5">Active in last 5 minutes</p>
        </div>

        {/* Top Platform / Mobile vs Desktop */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#141417] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Top Device</span>
            <Smartphone className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white capitalize">
            {loading ? "…" : data?.devices?.[0]?.type || "Desktop"}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1.5">
            {data?.devices?.[0]
              ? `${data.devices[0].percentage}% of your audience`
              : "Device breakdown"}
          </p>
        </div>
      </div>

      {/* Middle Section: Time Spent Breakdown & Geographic View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dwell Time & Engagement Distribution */}
        <div className="p-6 rounded-2xl bg-[#141417] border border-white/5 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
                Visitor Dwell Time (Minutes Spent)
              </h3>
            </div>
            <span className="text-xs text-zinc-400">
              Avg: <strong>{data?.avgDurationFormatted || "0s"}</strong>
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            See how long visitors browse your work before leaving. Clients and recruiters typically spend 2+ minutes reviewing projects.
          </p>

          <div className="space-y-3.5 pt-1">
            {/* Quick Bounce < 30s */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-zinc-400">⚡ Quick Glance (&lt; 30 sec)</span>
                <span className="font-mono text-zinc-300">
                  {data?.durationBuckets?.bounce ?? 0} visitors
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-zinc-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      data?.totalVisitors
                        ? Math.round(((data.durationBuckets.bounce || 0) / data.totalVisitors) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Skimmers 30s - 2m */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-zinc-400">👀 Casual Skim (30s – 2 min)</span>
                <span className="font-mono text-zinc-300">
                  {data?.durationBuckets?.short ?? 0} visitors
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      data?.totalVisitors
                        ? Math.round(((data.durationBuckets.short || 0) / data.totalVisitors) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Engaged 2m - 5m */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-zinc-400">🎯 Engaged Reader (2 – 5 min)</span>
                <span className="font-mono text-zinc-300">
                  {data?.durationBuckets?.engaged ?? 0} visitors
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      data?.totalVisitors
                        ? Math.round(((data.durationBuckets.engaged || 0) / data.totalVisitors) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Deep Dive 5m+ */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-zinc-400">⭐ Deep Portfolio Review (5+ min)</span>
                <span className="font-mono text-zinc-300">
                  {data?.durationBuckets?.deep ?? 0} visitors
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      data?.totalVisitors
                        ? Math.round(((data.durationBuckets.deep || 0) / data.totalVisitors) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Where They Viewed From (Countries & Cities) */}
        <div className="p-6 rounded-2xl bg-[#141417] border border-white/5 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
                Where Visitors Are From
              </h3>
            </div>
            <span className="text-xs text-zinc-400">
              {data?.topCountries?.length ?? 0} locations
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Geographic location tracked from client IP upon arrival.
          </p>

          <div className="space-y-3">
            {(!data?.topCountries || data.topCountries.length === 0) && (
              <div className="py-8 text-center text-xs text-zinc-500">
                {config.isConfigured
                  ? "Waiting for your first visitor! Share your portfolio URL to see locations."
                  : "Connect Supabase to start tracking visitor locations."}
              </div>
            )}

            {data?.topCountries?.slice(0, 5).map((c) => (
              <div key={c.country} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">{getCountryFlag(c.code)}</span>
                  <span className="text-zinc-200 font-medium">{c.country}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 sm:w-28 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-sky-400 rounded-full"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-zinc-400">
                    {c.count} ({c.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {data?.topCities && data.topCities.length > 0 && (
            <div className="pt-3 border-t border-white/5">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-2 font-medium">
                Top Cities:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {data.topCities.map((item) => (
                  <span
                    key={item.city}
                    className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] text-zinc-300 border border-white/5"
                  >
                    📍 {item.city} ({item.count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Device & Tech Split */}
      <div className="p-6 rounded-2xl bg-[#141417] border border-white/5 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          Devices, Browsers & Operating Systems
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Device types */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium block">
              Device Split
            </span>
            <div className="space-y-2">
              {data?.devices?.map((d) => (
                <div key={d.type} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 capitalize text-zinc-300">
                    {d.type === "mobile" && <Smartphone className="w-3.5 h-3.5 text-zinc-400" />}
                    {d.type === "desktop" && <Laptop className="w-3.5 h-3.5 text-zinc-400" />}
                    {d.type === "tablet" && <Tablet className="w-3.5 h-3.5 text-zinc-400" />}
                    <span>{d.type}</span>
                  </div>
                  <span className="font-mono text-zinc-400">
                    {d.count} ({d.percentage}%)
                  </span>
                </div>
              ))}
              {(!data?.devices || data.devices.length === 0) && (
                <span className="text-xs text-zinc-500">No device data yet</span>
              )}
            </div>
          </div>

          {/* Operating Systems */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium block">
              Operating Systems
            </span>
            <div className="space-y-2">
              {data?.osList?.map((os) => (
                <div key={os.name} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300">{os.name}</span>
                  <span className="font-mono text-zinc-400">{os.count} views</span>
                </div>
              ))}
              {(!data?.osList || data.osList.length === 0) && (
                <span className="text-xs text-zinc-500">No OS data yet</span>
              )}
            </div>
          </div>

          {/* Browsers */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium block">
              Browsers
            </span>
            <div className="space-y-2">
              {data?.browsers?.map((b) => (
                <div key={b.name} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300">{b.name}</span>
                  <span className="font-mono text-zinc-400">{b.count} views</span>
                </div>
              ))}
              {(!data?.browsers || data.browsers.length === 0) && (
                <span className="text-xs text-zinc-500">No browser data yet</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Style Live Activity Feed */}
      <div className="p-6 rounded-2xl bg-[#141417] border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
              Live Visitor Feed (Real Stream)
            </h3>
          </div>
          <span className="text-xs text-zinc-400">
            Recent {data?.recentVisitors?.length ?? 0} sessions
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {(!data?.recentVisitors || data.recentVisitors.length === 0) && (
            <div className="py-12 text-center space-y-2">
              <Eye className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm text-zinc-400 font-medium">No visitor sessions recorded yet</p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {config.isConfigured
                  ? "As soon as someone opens your portfolio URL, their visit and exact minutes spent will stream live here."
                  : "Connect your Supabase database above to enable live visitor tracking."}
              </p>
            </div>
          )}

          {data?.recentVisitors?.map((session, idx) => {
            const date = session.created_at ? new Date(session.created_at) : null;
            const timeAgo = date
              ? new Intl.DateTimeFormat("en", {
                  hour: "numeric",
                  minute: "numeric",
                  month: "short",
                  day: "numeric",
                }).format(date)
              : "Just now";

            return (
              <div
                key={session.id || session.session_id || idx}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-base shrink-0 border border-white/5">
                    {getCountryFlag(session.country_code)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white">
                        {session.city && session.city !== "Unknown" ? session.city + ", " : ""}
                        {session.country && session.country !== "Unknown"
                          ? session.country
                          : "Direct Visitor"}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5 capitalize">
                        {session.device_type} · {session.browser}
                      </span>
                      {session.referrer && session.referrer !== "direct" && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          via {session.referrer}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-500 block mt-0.5">
                      Visited {timeAgo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:self-center pl-11 sm:pl-0">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Spent {formatDuration(session.duration_seconds || 0)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
