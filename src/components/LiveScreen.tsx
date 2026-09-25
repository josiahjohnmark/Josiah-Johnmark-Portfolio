import React, { useEffect, useRef, useState } from "react";
import type { DomainMirror } from "../data/schema";

type ViewportMode = "desktop" | "tablet" | "mobile";

interface LiveScreenProps {
  url: string;
  title: string;
  variant?: "card" | "expanded";
  mirrors?: DomainMirror[];
  onOpen?: () => void;
  className?: string;
}

/* Helper to get clean display domain */
function getDisplayDomain(rawUrl: string): string {
  try {
    return rawUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  } catch {
    return rawUrl;
  }
}

export const LiveScreen: React.FC<LiveScreenProps> = ({
  url,
  title,
  variant = "card",
  mirrors = [],
  onOpen,
  className = "",
}) => {
  const [activeUrl, setActiveUrl] = useState<string>(url);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [key, setKey] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const [cardScale, setCardScale] = useState<number>(0.35);

  /* Sync activeUrl if prop changes */
  useEffect(() => {
    setActiveUrl(url);
    setIsLoading(true);
  }, [url]);

  /* Calculate scaling ratio for card mini desktop */
  useEffect(() => {
    if (variant !== "card") return;
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        // Render 1280px standard desktop canvas scaled down into the card
        setCardScale(width / 1280);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, [variant]);

  const handleReload = () => {
    setIsLoading(true);
    setKey((prev) => prev + 1);
  };

  /* --------------------------------------------------------------------------
     CARD VARIANT: Clean, minimal miniature desktop screen for the project list
     -------------------------------------------------------------------------- */
  if (variant === "card") {
    const displayDomain = getDisplayDomain(url);
    return (
      <div
        className={`frame rounded-2xl w-full aspect-[4/3] sm:aspect-[16/10] bg-[#0c0c0e] border border-[var(--line-strong)] overflow-hidden flex flex-col group/live select-none relative transition-all duration-300 hover:border-white/25 ${className}`}
      >
        {/* Minimal browser header */}
        <div className="h-9 px-3.5 bg-ink-elev border-b border-[var(--line)] flex items-center justify-between gap-3 shrink-0 z-10">
          {/* Subtle dots */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-white/20 group-hover/live:bg-[#ff5f56]/70 transition-colors" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20 group-hover/live:bg-[#ffbd2e]/70 transition-colors" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20 group-hover/live:bg-[#27c93f]/70 transition-colors" />
          </div>

          {/* Address pill */}
          <div className="flex-1 max-w-[240px] sm:max-w-[300px] h-6 px-2.5 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center gap-1.5 min-w-0">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="text-gold/80 shrink-0"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-[11px] font-mono text-bone-muted truncate">
              {displayDomain}
            </span>
          </div>

          {/* Quick visit link */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] text-bone-faint hover:text-bone inline-flex items-center gap-1 py-1 px-1.5 transition-colors cursor-pointer"
            title={`Open ${displayDomain} in new tab`}
            aria-label={`Open ${displayDomain} in new tab`}
          >
            <span className="hidden sm:inline">Visit</span>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        </div>

        {/* Viewport frame containing the scaled desktop layout */}
        <div
          ref={containerRef}
          className="relative flex-1 w-full overflow-hidden bg-[#0a0a0b]"
        >
          {/* Scaled Desktop Iframe Canvas */}
          <div
            style={{
              width: "1280px",
              height: "800px",
              transform: `scale(${cardScale})`,
              transformOrigin: "top left",
              pointerEvents: "none", // Prevent scroll interception during listing scroll
            }}
            className="absolute top-0 left-0 bg-[#0a0a0b]"
          >
            <iframe
              key={key}
              src={url}
              title={`${title} live site preview`}
              loading="lazy"
              tabIndex={-1}
              aria-hidden="true"
              className="w-full h-full border-0 bg-[#0a0a0b]"
            />
          </div>

          {/* Click catcher to open case study */}
          <div
            onClick={onOpen}
            className="absolute inset-0 z-10 flex items-end justify-end p-4 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/live:opacity-100 transition-opacity duration-300 cursor-pointer"
          >
            <span className="text-xs font-mono text-bone bg-ink/90 border border-white/20 backdrop-blur-md px-3 py-1.5 rounded-full inline-flex items-center gap-2 shadow-lg">
              <span>Explore live screen</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------------------------
     EXPANDED VARIANT: Large, prominent, fully scrollable workstation
     -------------------------------------------------------------------------- */
  const allDomains = [
    { label: ".com (Primary)", url: url },
    ...mirrors.map((m) => ({ label: m.label, url: m.url })),
  ];

  const getViewportMaxWidth = () => {
    if (viewport === "mobile") return "max-w-[390px]";
    if (viewport === "tablet") return "max-w-[768px]";
    return "w-full";
  };

  return (
    <div
      className={`relative w-full ${
        isFullscreen
          ? "fixed inset-3 sm:inset-6 z-[120] bg-ink/95 backdrop-blur-2xl rounded-2xl border border-[var(--line-strong)] shadow-2xl flex flex-col"
          : "rounded-2xl border border-[var(--line-strong)] bg-[#0c0c0e] shadow-xl flex flex-col overflow-hidden"
      } ${className}`}
    >
      {/* Workstation Top Toolbar */}
      <div className="px-4 py-2.5 bg-ink-elev border-b border-[var(--line)] flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Left: Window dots + Domain indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]/80" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/80" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]/80" />
          </div>

          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-[var(--line)] text-xs font-mono text-bone-muted">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="text-gold"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-bone">{getDisplayDomain(activeUrl)}</span>
          </div>
        </div>

        {/* Center: Multi-Domain switcher (if present, e.g. Dakar Dapper) */}
        {allDomains.length > 1 && (
          <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.06]">
            {allDomains.map((d) => {
              const active = activeUrl === d.url;
              return (
                <button
                  key={d.url}
                  type="button"
                  onClick={() => {
                    setActiveUrl(d.url);
                    setIsLoading(true);
                  }}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    active
                      ? "bg-white/15 text-bone font-medium shadow-sm"
                      : "text-bone-muted hover:text-bone"
                  }`}
                  aria-pressed={active}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Right: Device switchers + Actions */}
        <div className="flex items-center gap-2">
          {/* Responsive Viewport Selector */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewport === "desktop"
                  ? "bg-white/15 text-bone"
                  : "text-bone-muted hover:text-bone"
              }`}
              title="Desktop view"
              aria-label="Desktop view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewport("tablet")}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewport === "tablet"
                  ? "bg-white/15 text-bone"
                  : "text-bone-muted hover:text-bone"
              }`}
              title="Tablet view (768px)"
              aria-label="Tablet view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12" y2="18" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewport === "mobile"
                  ? "bg-white/15 text-bone"
                  : "text-bone-muted hover:text-bone"
              }`}
              title="Mobile view (390px)"
              aria-label="Mobile view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="2" width="12" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12" y2="18" />
              </svg>
            </button>
          </div>

          {/* Reload button */}
          <button
            type="button"
            onClick={handleReload}
            className="p-1.5 text-bone-muted hover:text-bone rounded transition-colors cursor-pointer"
            title="Reload live preview"
            aria-label="Reload preview"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </button>

          {/* Fullscreen toggle button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-bone-muted hover:text-bone rounded transition-colors cursor-pointer"
            title={isFullscreen ? "Exit fullscreen" : "Expand screen to full view"}
            aria-label={isFullscreen ? "Exit fullscreen" : "Expand screen to full view"}
          >
            {isFullscreen ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            )}
          </button>

          {/* Direct visit button */}
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-bone bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
          >
            <span>Visit live</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        </div>
      </div>

      {/* Main Interactive Screen Frame */}
      <div
        className={`relative flex-1 w-full bg-[#0a0a0b] flex justify-center items-stretch overflow-hidden ${
          isFullscreen
            ? "h-[calc(100vh-6.5rem)]"
            : "h-[580px] sm:h-[680px] md:h-[760px] lg:h-[820px]"
        }`}
      >
        {/* Loading shimmer */}
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-[#0a0a0b] flex flex-col items-center justify-center gap-3 text-bone-muted">
            <div className="w-6 h-6 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
            <span className="text-xs font-mono tracking-wider uppercase text-bone-faint">
              Connecting live to {getDisplayDomain(activeUrl)}…
            </span>
          </div>
        )}

        {/* Viewport wrapper for responsive mode */}
        <div
          className={`h-full transition-all duration-300 ${getViewportMaxWidth()} ${
            viewport !== "desktop"
              ? "my-auto shadow-2xl border-x border-[var(--line-strong)] bg-ink"
              : "w-full"
          }`}
        >
          <iframe
            key={key}
            src={activeUrl}
            title={`${title} live interactive preview`}
            onLoad={() => setIsLoading(false)}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full h-full border-0 bg-[#0a0a0b]"
            style={{ display: "block" }}
          />
        </div>
      </div>

      {/* Understated bottom status line */}
      <div className="px-4 py-2 bg-ink-elev/80 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3 text-xs text-bone-faint font-mono shrink-0">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Interactive & scrollable live website</span>
        </span>

        <a
          href={activeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-bone underline underline-offset-4 decoration-[var(--line)] hover:decoration-bone transition-colors"
        >
          Direct link: {getDisplayDomain(activeUrl)} ↗
        </a>
      </div>
    </div>
  );
};

export default LiveScreen;
