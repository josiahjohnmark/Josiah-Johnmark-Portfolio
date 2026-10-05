import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Database,
  ExternalLink,
  FileText,
  Grid,
  HelpCircle,
  Layers,
  LogOut,
  MoreHorizontal,
  Sparkles,
  User,
} from "lucide-react";
import type { Content, Issue } from "../data/schema";
import { validateContent } from "../data/schema";
import { ApiError, api } from "./api";
import { MARK_PATH, MARK_VIEWBOX } from "../brand-mark";
import {
  AboutSection,
  CapabilitiesSection,
  ExplorationsSection,
  HelpSection,
} from "./sections";
import { Button } from "./ui";
import { AnalyticsView } from "./AnalyticsView";
import { SocialFeedView } from "./SocialFeedView";
import { SocialProfileView } from "./SocialProfileView";
import { SupabaseModal } from "./SupabaseModal";
import { getSupabaseConfig, SUPABASE_SQL_SCHEMA } from "../lib/supabase";

type TabId =
  | "insights"
  | "feed"
  | "profile"
  | "stories"
  | "about"
  | "capabilities"
  | "database"
  | "help";

interface TabItem {
  id: TabId;
  label: string;
  /** Short name for the mobile tab bar. */
  short: string;
  note: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const TABS: TabItem[] = [
  {
    id: "insights",
    short: "Insights",
    label: "Insights & Analytics",
    note: "Real visitors, minutes, devices & locations",
    icon: BarChart3,
    badge: "Live",
  },
  {
    id: "feed",
    short: "Projects",
    label: "Portfolio Feed",
    note: "Projects & case study posts",
    icon: Grid,
  },
  {
    id: "profile",
    short: "Profile",
    label: "Profile & Bio",
    note: "Status, hero, bio & contact links",
    icon: User,
  },
  {
    id: "stories",
    short: "Stories",
    label: "Stories & Experiments",
    note: "Motion & interactive explorations",
    icon: Sparkles,
  },
  {
    id: "about",
    short: "About",
    label: "About & Story",
    note: "Narrative, quick facts, graphite art",
    icon: FileText,
  },
  {
    id: "capabilities",
    short: "Disciplines",
    label: "Disciplines",
    note: "Product design, motion, brand systems",
    icon: Layers,
  },
  {
    id: "database",
    short: "Database",
    label: "Supabase & Database",
    note: "Cloud keys & 1-click SQL schema",
    icon: Database,
  },
  {
    id: "help",
    short: "System",
    label: "System & Status",
    note: "Publishing pipeline & GitHub status",
    icon: HelpCircle,
  },
];

/* Tabs pinned to the mobile tab bar; the rest live in the "More" sheet. */
const PRIMARY_TABS: TabId[] = ["insights", "feed", "profile"];

const Mark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox={MARK_VIEWBOX} className={className} aria-label="Josiah Johnmark" role="img">
    <path d={MARK_PATH} fill="currentColor" fillRule="evenodd" />
  </svg>
);

/* ========================================================================
   Sign in Screen
   ======================================================================== */

const SignIn: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.signIn(password);
      onDone();
    } catch (e2) {
      setError((e2 as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className="signin bg-[#0a0a0b] min-h-screen flex items-center justify-center p-4">
      <form
        className="signin-card w-full max-w-sm bg-[#121214] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-5"
        onSubmit={submit}
      >
        <div className="flex items-center gap-3">
          <Mark className="signin-mark h-7 w-auto text-amber-400" />
          <div>
            <h1 className="text-xl font-medium tracking-tight text-white">Creator Studio</h1>
            <p className="text-xs text-zinc-400">Josiah Johnmark Portfolio Admin</p>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Sign in to view real visitor analytics, edit your portfolio posts, and publish updates live.
        </p>

        <div className="space-y-2">
          <input
            className={`w-full bg-[#18181c] border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 ${
              error ? "border-rose-500" : "border-white/10"
            }`}
            type="password"
            value={password}
            autoFocus
            autoComplete="current-password"
            placeholder="Admin Password"
            aria-label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
          disabled={busy || !password}
        >
          {busy && <span className="spinner" />}
          Enter Studio
        </button>

        <div className="pt-2 text-center">
          <a
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-1"
            href="/"
          >
            ← Back to live portfolio
          </a>
        </div>
      </form>
    </div>
  );
};

/* ========================================================================
   Main Admin Panel Component
   ======================================================================== */

export default function AdminApp() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [content, setContent] = useState<Content | null>(null);
  const [sha, setSha] = useState<string>("");
  const [saved, setSaved] = useState<string>("");
  const [tab, setTab] = useState<TabId>("insights");
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "bad"; text: string } | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<React.ReactNode>("Checking…");

  const [supabaseConfig, setSupabaseConfig] = useState(getSupabaseConfig());

  const toastTimer = useRef<number | undefined>(undefined);
  const flash = useCallback((kind: "ok" | "bad", text: string) => {
    setToast({ kind, text });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), kind === "ok" ? 6000 : 12000);
  }, []);

  const go = useCallback((id: TabId) => {
    setTab(id);
    setMenuOpen(false);
    setMoreOpen(false);
    window.scrollTo({ top: 0 });
  }, []);

  /* ---------------------------- session ---------------------------- */
  useEffect(() => {
    api
      .session()
      .then((r) => setSignedIn(r.signedIn))
      .catch(() => setSignedIn(false));
  }, []);

  /* ---------------------------- load ---------------------------- */
  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const r = await api.load();
      setContent(r.content);
      setSha(r.sha);
      setSaved(JSON.stringify(r.content));
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setSignedIn(false);
        return;
      }
      setLoadError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    if (signedIn) void load();
  }, [signedIn, load]);

  useEffect(() => {
    if (!signedIn) return;
    api
      .status()
      .then((s) =>
        setStatus(
          <ul className="status-list">
            <li className={s.github.ok ? "is-ok" : "is-bad"}>
              GitHub · {s.github.ok ? `connected to ${s.github.repo}` : s.github.detail}
            </li>
            {Object.entries(s.env).map(([k, v]) => (
              <li key={k} className={v ? "is-ok" : "is-bad"}>
                {k} · {v === true ? "set" : v === false ? "missing" : String(v)}
              </li>
            ))}
          </ul>
        )
      )
      .catch((e) => setStatus(<p className="field-error">{(e as Error).message}</p>));
  }, [signedIn]);

  /* ---------------------------- editing ---------------------------- */
  const patch = useCallback((fn: (draft: Content) => void) => {
    setContent((prev) => {
      if (!prev) return prev;
      const draft = structuredClone(prev) as Content;
      fn(draft);
      return draft;
    });
  }, []);

  const dirty = useMemo(
    () => content !== null && JSON.stringify(content) !== saved,
    [content, saved]
  );

  /* Warn before leaving with unsaved work */
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const errorMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const i of issues) map[i.path] = i.message;
    return map;
  }, [issues]);

  /* ---------------------------- publish ---------------------------- */
  const publish = async () => {
    if (!content) return;

    const found = validateContent(content);
    setIssues(found);
    if (found.length > 0) {
      flash(
        "bad",
        `${found.length} field${found.length === 1 ? "" : "s"} need${
          found.length === 1 ? "s" : ""
        } fixing before this can go live.`
      );
      return;
    }

    setSaving(true);
    try {
      const r = await api.save(content, sha, message);
      setSha(r.sha);
      setSaved(JSON.stringify(content));
      setMessage("");
      flash("ok", `Published as ${r.commit}. The live site updates in about a minute.`);
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.status === 401) {
          setSignedIn(false);
          return;
        }
        if (e.issues) setIssues(e.issues);
      }
      flash("bad", (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const signOut = async () => {
    if (dirty && !window.confirm("You have unpublished changes. Sign out anyway?")) return;
    await api.signOut().catch(() => {});
    setSignedIn(false);
    setContent(null);
  };

  /* ---------------------------- render ---------------------------- */
  if (signedIn === null) {
    return (
      <div className="boot">
        <span className="spinner" /> Loading Studio…
      </div>
    );
  }

  if (!signedIn) return <SignIn onDone={() => setSignedIn(true)} />;

  if (loadError) {
    return (
      <div className="boot boot-error">
        <p>{loadError}</p>
        <Button variant="primary" onClick={() => void load()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="boot">
        <span className="spinner" /> Loading your studio…
      </div>
    );
  }

  const shared = { content, patch, errors: errorMap };
  const currentTab = TABS.find((t) => t.id === tab) ?? TABS[0];
  const moreTabs = TABS.filter((t) => !PRIMARY_TABS.includes(t.id));
  const moreActive = !PRIMARY_TABS.includes(tab);

  return (
    <div className="admin bg-[#0a0a0b] min-h-screen text-white">
      {/* ---------------- Top Creator Studio Bar ---------------- */}
      <header className="topbar bg-[#0e0e10]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            className="menu-toggle md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
          </button>

          <a href="/admin" className="flex items-center gap-2.5 text-white font-medium">
            <Mark className="h-5 w-auto text-amber-400" />
            <span className="desktop-only text-sm font-semibold tracking-tight">Creator Studio</span>
          </a>
          <span className="mobile-title">{currentTab.short}</span>

          {/* Quick Availability status */}
          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-white/10 text-xs text-zinc-400">
            <span
              className={`w-2 h-2 rounded-full ${
                content.profile.available ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"
              }`}
            />
            <span className="text-zinc-300">
              {content.profile.available ? "Available for Work" : "Busy"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Supabase Status Pill */}
          <button
            onClick={() => setSupabaseModalOpen(true)}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              supabaseConfig.isConfigured
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20"
                : "bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{supabaseConfig.isConfigured ? "Supabase Active" : "Connect Supabase"}</span>
          </button>

          {/* Dirty changes status */}
          <span
            className={`hidden md:inline-block font-mono text-[11px] uppercase tracking-wider ${
              dirty ? "text-amber-400 font-semibold" : "text-zinc-500"
            }`}
          >
            {dirty ? "● Unpublished Changes" : "✓ Saved"}
          </span>

          {/* Live site link */}
          <a
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-300 transition-colors"
            aria-label="View live site"
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Site</span>
          </a>

          <button
            onClick={() => void signOut()}
            className="desktop-only p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="admin-body flex max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* ---------------- Sidebar Navigation (Social Studio Style) ---------------- */}
        <nav
          className={`sidebar ${
            menuOpen ? "is-open" : ""
          } w-64 shrink-0 py-6 pr-4 border-r border-white/5 space-y-1`}
          aria-label="Navigation Sections"
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;

            return (
              <button
                key={t.id}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all duration-200 group ${
                  isActive
                    ? "bg-[#18181c] text-white font-medium border border-white/10 shadow-md"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                }`}
                onClick={() => go(t.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-xl ${
                      isActive
                        ? "bg-amber-400/10 text-amber-400"
                        : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold block truncate">{t.label}</span>
                    <span className="text-[10px] text-zinc-500 block truncate">{t.note}</span>
                  </div>
                </div>

                {t.badge && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} />}

        {/* ---------------- Main Content View Area ---------------- */}
        <main className="admin-main flex-1 py-6 px-3 sm:px-8 min-w-0">
          {issues.length > 0 && (
            <div className="p-4 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs space-y-2">
              <strong className="font-semibold">
                {issues.length} field{issues.length === 1 ? "" : "s"} need fixing before
                publishing:
              </strong>
              <ul className="list-disc list-inside space-y-1">
                {issues.slice(0, 5).map((i) => (
                  <li key={i.path}>
                    <code className="text-rose-200">{i.path}</code> — {i.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab 1: Real Visitor Analytics & Social Insights */}
          {tab === "insights" && (
            <AnalyticsView onOpenSupabaseModal={() => setSupabaseModalOpen(true)} />
          )}

          {/* Tab 2: Portfolio Feed (Projects) */}
          {tab === "feed" && <SocialFeedView {...shared} />}

          {/* Tab 3: Profile & Bio */}
          {tab === "profile" && <SocialProfileView {...shared} />}

          {/* Tab 4: Stories & Explorations */}
          {tab === "stories" && <ExplorationsSection {...shared} />}

          {/* Tab 5: About & Story */}
          {tab === "about" && <AboutSection {...shared} />}

          {/* Tab 6: Disciplines / Capabilities */}
          {tab === "capabilities" && <CapabilitiesSection {...shared} />}

          {/* Tab 7: Supabase & Database */}
          {tab === "database" && (
            <div className="space-y-6 text-white animate-fade-in">
              <div className="p-6 rounded-2xl bg-[#141417] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">Supabase Analytics Connection</h3>
                      <p className="text-xs text-zinc-400">
                        Configured for genuine real-time visitor and dwell time tracking.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSupabaseModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors"
                  >
                    Configure Credentials
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Connection Status</span>
                    <span
                      className={`font-semibold ${
                        supabaseConfig.isConfigured ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {supabaseConfig.isConfigured ? "🟢 Connected & Live" : "🟡 Not Configured"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Supabase Project URL</span>
                    <span className="font-mono text-zinc-300 truncate max-w-xs">
                      {supabaseConfig.url || "None"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-400">Tracking Table</span>
                    <span className="font-mono text-zinc-300">public.portfolio_analytics</span>
                  </div>
                </div>
              </div>

              {/* SQL Schema Copy Section */}
              <div className="p-6 rounded-2xl bg-[#141417] border border-white/5 space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
                  Supabase SQL Table Schema
                </h4>
                <p className="text-xs text-zinc-400">
                  Run this once in Supabase (SQL Editor → New Query → Run) to enable anonymous
                  visitor logging and session duration heartbeats.
                </p>
                <pre className="p-4 bg-[#0d0d0f] border border-white/5 rounded-xl text-xs font-mono text-zinc-300 overflow-x-auto max-h-64 scrollbar-thin">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            </div>
          )}

          {/* Tab 8: System & Help Status */}
          {tab === "help" && <HelpSection status={status} />}

          <div className="h-24" />
        </main>
      </div>

      {/* ---------------- Bottom Publish Bar ---------------- */}
      <div
        className={`publishbar fixed bottom-0 inset-x-0 bg-[#121214]/95 backdrop-blur-md border-t border-white/10 p-3 sm:p-4 z-40 transition-all ${
          dirty ? "is-dirty" : ""
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="publish-note flex-1 max-w-lg min-w-0">
            <input
              type="text"
              placeholder="What did you change? (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#18181c] border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto shrink-0">
            {dirty && (
              <span className="text-xs text-amber-400 font-medium hidden md:inline">
                You have unsaved changes
              </span>
            )}
            <button
              onClick={() => void publish()}
              disabled={saving || !dirty}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                dirty
                  ? "bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20"
                  : "bg-white/10 text-zinc-500 cursor-not-allowed"
              }`}
            >
              {saving && <span className="spinner" />}
              <span>{saving ? "Publishing Live…" : dirty ? "Publish to Live Site" : "All Published"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- Mobile Tab Bar ---------------- */}
      <nav className="tabbar" aria-label="Sections">
        {PRIMARY_TABS.map((id) => {
          const t = TABS.find((x) => x.id === id)!;
          const Icon = t.icon;
          return (
            <button
              key={id}
              className={`tab-btn ${tab === id ? "is-active" : ""}`}
              aria-current={tab === id ? "page" : undefined}
              onClick={() => go(id)}
            >
              <Icon className="w-[22px] h-[22px]" />
              <span>{t.short}</span>
            </button>
          );
        })}
        <button
          className={`tab-btn ${moreActive || moreOpen ? "is-active" : ""}`}
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen(true)}
        >
          <MoreHorizontal className="w-[22px] h-[22px]" />
          <span>{moreActive ? currentTab.short : "More"}</span>
        </button>
      </nav>

      {/* ---------------- Mobile "More" Sheet ---------------- */}
      {moreOpen && (
        <>
          <div className="sheet-scrim" onClick={() => setMoreOpen(false)} />
          <div className="sheet" role="dialog" aria-modal="true" aria-label="More sections">
            <div className="sheet-grip" />
            {moreTabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  className={`sheet-item ${tab === t.id ? "is-active" : ""}`}
                  onClick={() => go(t.id)}
                >
                  <span className="sheet-icon">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{t.label}</span>
                    <span className="block text-xs text-zinc-500 truncate">{t.note}</span>
                  </span>
                </button>
              );
            })}
            <div className="sheet-divider" />
            <button
              className="sheet-item"
              onClick={() => {
                setMoreOpen(false);
                setSupabaseModalOpen(true);
              }}
            >
              <span className="sheet-icon">
                <Database className="w-5 h-5" />
              </span>
              <span className="text-sm font-semibold">
                {supabaseConfig.isConfigured ? "Supabase connected" : "Connect Supabase"}
              </span>
            </button>
            <a className="sheet-item" href="/" target="_blank" rel="noreferrer">
              <span className="sheet-icon">
                <ExternalLink className="w-5 h-5" />
              </span>
              <span className="text-sm font-semibold">View live site</span>
            </a>
            <button className="sheet-item text-rose-300" onClick={() => void signOut()}>
              <span className="sheet-icon">
                <LogOut className="w-5 h-5" />
              </span>
              <span className="text-sm font-semibold">Sign out</span>
            </button>
          </div>
        </>
      )}

      {/* Supabase Connection Modal */}
      <SupabaseModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
        onSaved={() => setSupabaseConfig(getSupabaseConfig())}
      />

      {/* Floating Notifications / Toasts */}
      {toast && (
        <div
          className={`toast-pos fixed bottom-20 right-6 z-50 p-4 rounded-2xl shadow-2xl border text-xs max-w-sm flex items-start justify-between gap-3 animate-slide-up ${
            toast.kind === "ok"
              ? "bg-emerald-950 border-emerald-500/30 text-emerald-200"
              : "bg-rose-950 border-rose-500/30 text-rose-200"
          }`}
          role="status"
        >
          <div className="flex items-center gap-2">
            {toast.kind === "ok" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Activity className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <p>{toast.text}</p>
          </div>
          <button
            className="text-zinc-400 hover:text-white"
            onClick={() => setToast(null)}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
