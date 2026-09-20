import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Content, Issue } from "../data/schema";
import { validateContent } from "../data/schema";
import { ApiError, api } from "./api";
import { MARK_PATH, MARK_VIEWBOX } from "../brand-mark";
import {
  AboutSection,
  CapabilitiesSection,
  ExplorationsSection,
  HelpSection,
  ProfileSection,
  WorkSection,
} from "./sections";
import { Button, Text } from "./ui";

type TabId = "profile" | "about" | "work" | "explorations" | "capabilities" | "help";

const TABS: { id: TabId; label: string; note: string }[] = [
  { id: "profile", label: "Profile & contact", note: "Name, pitch, links" },
  { id: "about", label: "About", note: "Your story, facts, drawings" },
  { id: "work", label: "Projects", note: "Add and edit your work" },
  { id: "explorations", label: "Explorations", note: "Personal experiments" },
  { id: "capabilities", label: "What I do", note: "Disciplines" },
  { id: "help", label: "Help & status", note: "How publishing works" },
];

const Mark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox={MARK_VIEWBOX} className={className} aria-label="Josiah Johnmark" role="img">
    <path d={MARK_PATH} fill="currentColor" fillRule="evenodd" />
  </svg>
);

/* ========================================================================
   Sign in
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
    <div className="signin">
      <form className="signin-card" onSubmit={submit}>
        <Mark className="signin-mark" />
        <h1 className="signin-title">Content</h1>
        <p className="signin-sub">Sign in to edit the site.</p>

        <input
          className={`input${error ? " input-error" : ""}`}
          type="password"
          value={password}
          autoFocus
          autoComplete="current-password"
          placeholder="Password"
          aria-label="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="field-error">{error}</p>}

        <button type="submit" className="btn btn-primary signin-btn" disabled={busy || !password}>
          {busy && <span className="spinner" />}
          Sign in
        </button>

        <a className="signin-back" href="/">
          ← Back to the site
        </a>
      </form>
    </div>
  );
};

/* ========================================================================
   Panel
   ======================================================================== */

export default function AdminApp() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [content, setContent] = useState<Content | null>(null);
  const [sha, setSha] = useState<string>("");
  const [saved, setSaved] = useState<string>("");
  const [tab, setTab] = useState<TabId>("profile");
  const [menuOpen, setMenuOpen] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "bad"; text: string } | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<React.ReactNode>("Checking…");

  const toastTimer = useRef<number | undefined>(undefined);
  const flash = useCallback((kind: "ok" | "bad", text: string) => {
    setToast({ kind, text });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), kind === "ok" ? 6000 : 12000);
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

  /* Warn before leaving with unsaved work. */
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
        `${found.length} field${found.length === 1 ? "" : "s"} need${found.length === 1 ? "s" : ""} fixing before this can go live.`
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
        <span className="spinner" /> Loading…
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
        <span className="spinner" /> Loading your content…
      </div>
    );
  }

  const shared = { content, patch, errors: errorMap };

  return (
    <div className="admin">
      {/* ---------------- top bar ---------------- */}
      <header className="topbar">
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span />
          <span />
        </button>

        <a href="/" className="topbar-brand" title="View the site">
          <Mark className="topbar-mark" />
          <span>Content</span>
        </a>

        <span className={`dirty-badge${dirty ? " is-dirty" : ""}`}>
          {dirty ? "Unpublished changes" : "All changes published"}
        </span>

        <div className="topbar-actions">
          <a className="btn btn-quiet" href="/" target="_blank" rel="noreferrer">
            View site
          </a>
          <Button variant="quiet" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </header>

      <div className="admin-body">
        {/* ---------------- sidebar ---------------- */}
        <nav className={`sidebar${menuOpen ? " is-open" : ""}`} aria-label="Sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`side-link${tab === t.id ? " is-active" : ""}`}
              onClick={() => {
                setTab(t.id);
                setMenuOpen(false);
                window.scrollTo({ top: 0 });
              }}
            >
              <span className="side-label">{t.label}</span>
              <span className="side-note">{t.note}</span>
            </button>
          ))}
        </nav>

        {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} />}

        {/* ---------------- main ---------------- */}
        <main className="admin-main">
          {issues.length > 0 && (
            <div className="issues" role="alert">
              <strong>{issues.length} thing{issues.length === 1 ? "" : "s"} to fix:</strong>
              <ul>
                {issues.slice(0, 8).map((i) => (
                  <li key={i.path}>
                    <code>{i.path}</code> — {i.message}
                  </li>
                ))}
                {issues.length > 8 && <li>…and {issues.length - 8} more.</li>}
              </ul>
            </div>
          )}

          {tab === "profile" && <ProfileSection {...shared} />}
          {tab === "about" && <AboutSection {...shared} />}
          {tab === "work" && <WorkSection {...shared} />}
          {tab === "explorations" && <ExplorationsSection {...shared} />}
          {tab === "capabilities" && <CapabilitiesSection {...shared} />}
          {tab === "help" && <HelpSection status={status} />}

          <div className="main-foot" />
        </main>
      </div>

      {/* ---------------- publish bar ---------------- */}
      <div className={`publishbar${dirty ? " is-dirty" : ""}`}>
        <div className="publishbar-inner">
          <Text
            label=""
            value={message}
            onChange={setMessage}
            placeholder="What did you change? (optional)"
          />
          <Button variant="primary" onClick={() => void publish()} loading={saving} disabled={!dirty}>
            {saving ? "Publishing…" : dirty ? "Publish to live site" : "Nothing to publish"}
          </Button>
        </div>
      </div>

      {toast && (
        <div className={`toast toast-${toast.kind}`} role="status">
          {toast.text}
          <button className="toast-close" onClick={() => setToast(null)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
