import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import type { Project } from "../data/site";
import { Arrow } from "./primitives";

const EASE = [0.76, 0, 0.24, 1] as const;

/* --------------------------------------------------------------------------
   Scroll-hijack horizontal gallery
   - Reaches the vertical middle of screen and pins
   - Holds first screenshot centered (0 to 0.12) so user sees it in the middle
   - Slides screenshots horizontally one-by-one (0.12 to 0.88) through screen center
   - Holds the final screenshot centered (0.88 to 1.0) so user views it completely
   - Only after last image is viewed does the page scroll to the next section
   -------------------------------------------------------------------------- */
const ScrollGallery: React.FC<{ shots: NonNullable<Project["shots"]> }> = ({ shots }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const count = shots.length;
  if (count === 0) return null;

  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;
  const cardWidth = isMobile ? 200 : isTablet ? 240 : 270;
  const cardGap = isMobile ? 18 : 28;
  const cardStep = cardWidth + cardGap;
  const centerOffset = (viewportWidth - cardWidth) / 2;
  const totalTravel = (count - 1) * cardStep;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* Hold first shot in center -> slide one by one -> hold last shot in center */
  const x = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [centerOffset, centerOffset, centerOffset - totalTravel, centerOffset - totalTravel]
  );

  /* Track which screenshot is currently centered */
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest <= 0.12) {
      setActiveIdx(0);
    } else if (latest >= 0.88) {
      setActiveIdx(count - 1);
    } else {
      const normalized = (latest - 0.12) / (0.88 - 0.12);
      const idx = Math.min(Math.round(normalized * (count - 1)), count - 1);
      setActiveIdx(idx);
    }
  });

  /* Runway height: generous scroll distance so shots can be seen one by one comfortably */
  const galleryScrollHeight = Math.max((count + 1.2) * 75, 280);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${galleryScrollHeight}vh` }}
    >
      {/* Sticky viewport — vertically centered on screen */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Top bar inside sticky gallery: Title & current shot counter */}
        <div className="shell flex items-center justify-between pb-5 md:pb-7">
          <div>
            <span className="label block mb-1">In-Game Screenshots</span>
            <h3 className="display text-ink text-xl sm:text-2xl md:text-3xl">
              {shots[activeIdx]?.title || "Gameplay Screens"}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs sm:text-sm text-ink-light tabular-nums bg-cream-dark/60 px-3 py-1.5 rounded-full border border-[var(--line)]">
              {String(activeIdx + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Horizontal sliding track */}
        <div className="overflow-hidden w-full py-2">
          <motion.div
            style={{ x }}
            className="flex w-max will-change-transform items-center"
          >
            {shots.map((shot, idx) => {
              const isCurrent = idx === activeIdx;
              return (
                <div
                  key={shot.id}
                  style={{
                    width: cardWidth,
                    marginRight: idx === count - 1 ? 0 : cardGap,
                  }}
                  className={`shrink-0 flex flex-col transition-all duration-500 ${
                    isCurrent ? "opacity-100 scale-100" : "opacity-45 scale-[0.96]"
                  }`}
                >
                  <div
                    className={`rounded-[1.75rem] overflow-hidden bg-[#0F1012] border shadow-2xl p-2.5 sm:p-3 transition-all duration-500 ${
                      isCurrent
                        ? "border-ink/20 shadow-2xl ring-1 ring-black/5"
                        : "border-[var(--line)]"
                    } ${
                      shot.shape === "phone"
                        ? "aspect-[440/956]"
                        : "aspect-[16/10]"
                    }`}
                  >
                    <div className="w-full h-full rounded-[1.25rem] overflow-hidden bg-black/40">
                      <img
                        src={shot.src}
                        alt={shot.caption || shot.title}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Caption beneath each screenshot */}
                  <div className="pt-3 px-1 text-center sm:text-left">
                    <p className="text-xs sm:text-sm text-ink font-medium truncate">
                      {shot.title}
                    </p>
                    {shot.caption && (
                      <p className="text-[11px] sm:text-xs text-ink-light truncate mt-0.5">
                        {shot.caption}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Progress track at bottom */}
        <div className="shell mt-6 md:mt-8">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-ink-light">01</span>
            <div className="flex-1 h-1 bg-[var(--line)] rounded-full overflow-hidden relative">
              <motion.div
                className="absolute inset-y-0 left-0 bg-ink rounded-full"
                style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
              />
            </div>
            <span className="text-[11px] font-mono text-ink-light">
              {String(count).padStart(2, "0")}
            </span>
          </div>
          <p className="text-center text-[11px] text-ink-light mt-2 tracking-wide font-sans">
            Scroll down to view all {count} screens before proceeding
          </p>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
   Scroll-triggered text reveal for case study sections
   -------------------------------------------------------------------------- */
const ScrollRevealSection: React.FC<{
  heading: string;
  body: string;
  index: number;
}> = ({ heading, body, index }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "start 0.4"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <motion.div
      ref={sectionRef}
      style={{ opacity, y }}
      className="mb-10 md:mb-14"
    >
      <div className="flex items-baseline gap-3 mb-3">
        <span className="rule-index">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h4 className="text-ink text-lg md:text-xl font-display">{heading}</h4>
      </div>
      <p className="prose-body max-w-[60ch]">{body}</p>
    </motion.div>
  );
};

/* --------------------------------------------------------------------------
   Sticky project header — becomes the "new header" as user scrolls
   -------------------------------------------------------------------------- */
const StickyProjectHeader: React.FC<{
  project: Project;
  onClose: () => void;
}> = ({ project, onClose }) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });

  const [isStuck, setIsStuck] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsStuck(v >= 0.1);
  });

  return (
    <div ref={headerRef}>
      <div
        className={`sticky top-[var(--nav-h)] z-40 transition-all duration-500 ${
          isStuck
            ? "bg-cream/95 backdrop-blur-xl shadow-sm border-b border-[var(--line)]"
            : "bg-transparent"
        }`}
      >
        <div className="shell flex items-center justify-between py-4 md:py-5">
          <div className="flex items-baseline gap-3 min-w-0">
            <span className="rule-index shrink-0">{project.index}</span>
            <span className="text-ink text-sm md:text-base font-medium truncate">
              {project.title}
            </span>
            <span className="label hidden sm:block truncate">
              {project.kind}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost !min-h-[2.5rem] !px-4 text-sm hidden sm:inline-flex"
              >
                Visit site <Arrow size={13} />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full border border-[var(--line-strong)] text-ink flex items-center justify-center hover:bg-cream-dark transition-colors cursor-pointer shrink-0"
              aria-label="Close project"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
   ProjectAccordion — the expanded, inline project detail view
   -------------------------------------------------------------------------- */
const ProjectAccordion: React.FC<{
  project: Project;
  onClose: () => void;
}> = ({ project, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isFullyOpen, setIsFullyOpen] = useState(false);
  const shots = project.shots ?? [];

  useEffect(() => {
    const timer = setTimeout(() => {
      contentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [project.id]);

  const handleClose = () => {
    setIsFullyOpen(false);
    onClose();
  };

  return (
    <motion.div
      ref={contentRef}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.8, ease: EASE as unknown as number[] }}
      onAnimationComplete={(def) => {
        if (typeof def === "object" && "height" in def && def.height === "auto") {
          setIsFullyOpen(true);
        }
      }}
      className={isFullyOpen ? "overflow-visible" : "overflow-hidden"}
      style={{ scrollMarginTop: "calc(var(--nav-h) + 1rem)" }}
    >
      <div className="bg-cream border-t border-b border-[var(--line)]">
        <StickyProjectHeader project={project} onClose={handleClose} />

        <div className="shell pb-20 md:pb-28">
          {/* Title block */}
          <header className="pt-8 md:pt-14 max-w-4xl">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE as unknown as number[] }}
              className="display text-ink text-[clamp(2rem,6vw,4rem)]"
            >
              {project.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: EASE as unknown as number[] }}
              className="lede mt-5 max-w-[52ch]"
            >
              {project.summary}
            </motion.p>
          </header>

          {/* Meta */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8 md:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 border-y border-[var(--line)] py-7"
          >
            {[
              ["Role", project.role],
              ["Platform", project.platform],
              ["Year", project.year],
              ["Tools", project.tools.join(" · ")],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="label mb-2">{k}</dt>
                <dd className="text-sm text-ink leading-snug">{v}</dd>
              </div>
            ))}
          </motion.dl>

          {/* Cover image */}
          {project.cover && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="frame rounded-2xl mt-8 md:mt-10 aspect-[16/9] overflow-hidden"
              style={{ backgroundColor: project.coverTone || "#EAEAE6" }}
            >
              <img
                src={project.cover}
                alt={`${project.title} key art`}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
                className={`w-full h-full ${
                  project.coverFit === "contain"
                    ? "object-contain p-[11%]"
                    : "object-cover"
                }`}
              />
            </motion.div>
          )}

          {/* Live site link */}
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-8 md:mt-10 p-5 md:p-7 border border-[var(--line)] rounded-2xl flex flex-wrap items-center justify-between gap-4 group/live block"
            >
              <div>
                <span className="label block mb-2">Live site</span>
                <span className="text-ink text-base md:text-lg break-all">
                  {project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </span>
              </div>
              <span className="btn btn-ghost pointer-events-none">
                Open
                <Arrow
                  size={15}
                  className="transition-transform duration-500 group-hover/live:translate-x-1"
                />
              </span>
            </motion.a>
          )}

          {/* Scroll-triggered case study sections */}
          <div className="mt-12 md:mt-16 grid lg:grid-cols-12 gap-y-8 gap-x-14">
            <div className="lg:col-span-4">
              <h3 className="label lg:sticky lg:top-[calc(var(--nav-h)+5rem)]">
                Case study
              </h3>
            </div>
            <div className="lg:col-span-8">
              {project.sections.map((s, i) => (
                <ScrollRevealSection
                  key={s.heading}
                  heading={s.heading}
                  body={s.body}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ============ SCROLL-HIJACK IMAGE GALLERY ============ */}
        {shots.length > 0 && (
          <ScrollGallery shots={shots} />
        )}

        {/* Bottom section: note + CTA */}
        <div className="shell pb-20 md:pb-28">
          {project.note && (
            <p className="label mt-12 pt-7 border-t border-[var(--line)]">
              {project.note}
            </p>
          )}

          <div className="mt-14 md:mt-20 border-t border-[var(--line)] pt-8 flex flex-wrap items-center gap-4">
            <a href="#contact" className="btn btn-primary">
              Start a project like this <Arrow size={15} />
            </a>
            <button type="button" onClick={handleClose} className="btn btn-ghost">
              Close
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectAccordion;
