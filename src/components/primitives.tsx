import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MARK_PATH, MARK_VIEWBOX } from "../brand-mark";

/* --------------------------------------------------------------------------
   Logo — the traced JJ monogram
   -------------------------------------------------------------------------- */
export const Mark: React.FC<{ className?: string; title?: string }> = ({
  className = "",
  title = "Josiah Johnmark",
}) => (
  <svg
    viewBox={MARK_VIEWBOX}
    role="img"
    aria-label={title}
    className={`w-auto ${className}`}
    style={{ display: "block" }}
  >
    <path d={MARK_PATH} fill="currentColor" fillRule="evenodd" />
  </svg>
);

/* --------------------------------------------------------------------------
   Reveal — smooth text/element reveal on scroll. Uses clip-path for a more
   editorial feel instead of simple opacity fades.
   -------------------------------------------------------------------------- */
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}> = ({ children, delay = 0, className = "", as = "div" }) => {
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  if (reduced) {
    const Plain = as as React.ElementType;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -5% 0px" }}
      transition={{ duration: 1, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </Tag>
  );
};

/* --------------------------------------------------------------------------
   SectionHeading — minimalist: index line, then a big serif title.
   -------------------------------------------------------------------------- */
export const SectionHeading: React.FC<{
  index: string;
  title: string;
  lede?: string;
  id?: string;
}> = ({ index, title, lede, id }) => (
  <header className="mb-14 md:mb-20">
    <Reveal>
      <div className="flex items-center gap-4 mb-6">
        <span className="rule-index">{index}</span>
        <span className="h-px flex-1 bg-[var(--line)]" aria-hidden="true" />
      </div>
      <h2 id={id} className="h-section text-ink">
        {title}
      </h2>
      {lede && <p className="lede mt-6 max-w-2xl">{lede}</p>}
    </Reveal>
  </header>
);

/* --------------------------------------------------------------------------
   Social icons — inline SVG, no library weight
   -------------------------------------------------------------------------- */
export const SocialGlyph: React.FC<{ name: string; size?: number }> = ({
  name,
  size = 18,
}) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
    focusable: "false" as const,
  };

  switch (name) {
    case "github":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.51 2.87 8.34 6.84 9.69.5.1.68-.22.68-.49l-.01-1.72c-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.57 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.79-4.57 5.04.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.6.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "x":
      return (
        <svg {...common} fill="currentColor">
          <path d="M17.53 3h3.07l-6.7 7.66L21.8 21h-6.16l-4.83-6.31L5.29 21H2.22l7.17-8.19L2.2 3h6.32l4.37 5.77L17.53 3Zm-1.08 16.16h1.7L7.63 4.75H5.81l10.64 14.41Z" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} fill="currentColor">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.71h.05c.53-.96 1.83-1.98 3.77-1.98C21.2 8.73 22 11 22 14.02V21h-4v-6.19c0-1.48-.03-3.38-2.09-3.38-2.09 0-2.41 1.6-2.41 3.27V21h-4V9Z" />
        </svg>
      );
    default:
      return null;
  }
};

/* --------------------------------------------------------------------------
   Arrow — shared directional glyph
   -------------------------------------------------------------------------- */
export const Arrow: React.FC<{ size?: number; className?: string }> = ({
  size = 16,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* --------------------------------------------------------------------------
   useScrolled — true once the page has scrolled past a threshold
   -------------------------------------------------------------------------- */
export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/* --------------------------------------------------------------------------
   useBodyLock — prevent scroll behind overlays
   -------------------------------------------------------------------------- */
export function useBodyLock(locked: boolean) {
  const y = useRef(0);
  useEffect(() => {
    if (!locked) return;
    y.current = window.scrollY;
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
      window.scrollTo({ top: y.current, behavior: "auto" });
    };
  }, [locked]);
}

/* --------------------------------------------------------------------------
   useEscape — close overlay on Escape key
   -------------------------------------------------------------------------- */
export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onEscape]);
}
