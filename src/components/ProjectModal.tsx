import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Project, Shot } from "../data/site";
import Lightbox from "./Lightbox";
import { Arrow, useBodyLock, useEscape } from "./primitives";
import { LiveScreen } from "./LiveScreen";

const ShotGrid: React.FC<{
  shots: Shot[];
  shape: Shot["shape"];
  onOpen: (shot: Shot) => void;
}> = ({ shots, shape, onOpen }) => {
  const list = shots.filter((s) => s.shape === shape);
  if (list.length === 0) return null;

  return (
    <div
      className={
        shape === "phone"
          ? "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          : "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
      }
    >
      {list.map((s) => (
        <figure key={s.id} className="group/shot">
          <button
            type="button"
            onClick={() => onOpen(s)}
            className="block w-full cursor-pointer"
            aria-label={`Enlarge: ${s.title}`}
          >
            <div
              className={`frame rounded-xl ${
                shape === "phone" ? "aspect-[440/956]" : "aspect-square"
              }`}
            >
              <img
                src={s.src}
                alt={s.caption}
                loading="lazy"
                decoding="async"
                className="object-cover transition-transform duration-700 group-hover/shot:scale-[1.03]"
              />
            </div>
          </button>
          <figcaption className="mt-3">
            <span className="block text-sm text-bone">{s.title}</span>
            <span className="block text-xs text-bone-faint leading-relaxed mt-1">
              {s.caption}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
};

const ProjectModal: React.FC<{
  project: Project | null;
  onClose: () => void;
}> = ({ project, onClose }) => {
  const open = !!project;
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useBodyLock(open);
  useEscape(open && lightbox === null, onClose);

  /* Reset scroll and move focus into the panel each time a project opens. */
  useEffect(() => {
    if (!open) return;
    setLightbox(null);
    panelRef.current?.scrollTo({ top: 0 });
    closeRef.current?.focus();
  }, [open, project?.id]);

  const shots = project?.shots ?? [];

  return (
    <>
      <AnimatePresence>
        {project && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-ink/80 backdrop-blur-md"
            onClick={onClose}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${project.title} case study`}
              onClick={(e) => e.stopPropagation()}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 bottom-0 top-[3vh] md:top-[5vh] bg-ink border-t md:border border-[var(--line-strong)] md:rounded-t-3xl md:inset-x-[3vw] lg:inset-x-[6vw] overflow-y-auto overscroll-contain"
            >
              {/* Sticky header */}
              <div className="sticky top-0 z-20 bg-ink/90 backdrop-blur-xl border-b border-[var(--line)]">
                <div className="px-6 md:px-10 lg:px-14 h-[4.5rem] flex items-center justify-between gap-4">
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span className="rule-index shrink-0">{project.index}</span>
                    <span className="text-bone text-sm md:text-base truncate">
                      {project.title}
                    </span>
                    <span className="label hidden sm:block truncate">{project.kind}</span>
                  </div>

                  <button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    className="w-12 h-12 shrink-0 rounded-full border border-[var(--line-strong)] text-bone flex items-center justify-center hover:bg-ink-elev transition-colors cursor-pointer"
                    aria-label="Close case study"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="px-6 md:px-10 lg:px-14 pb-24 md:pb-32">
                {/* Title block */}
                <header className="pt-10 md:pt-16 max-w-4xl">
                  <h2 className="display text-bone text-[clamp(2.25rem,7vw,4.5rem)]">
                    {project.title}
                  </h2>
                  <p className="lede mt-6 max-w-[52ch]">{project.summary}</p>
                </header>

                {/* Meta */}
                <dl className="mt-10 md:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-7 border-y border-[var(--line)] py-8">
                  {[
                    ["Role", project.role],
                    ["Platform", project.platform],
                    ["Year", project.year],
                    ["Tools", project.tools.join(" · ")],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="label mb-2">{k}</dt>
                      <dd className="text-sm text-bone leading-snug">{v}</dd>
                    </div>
                  ))}
                </dl>

                {/* Live Interactive Screen (Expanded Workstation) */}
                {project.liveUrl && (
                  <div className="mt-10 md:mt-14">
                    <LiveScreen
                      url={project.liveUrl}
                      title={project.title}
                      variant="expanded"
                      mirrors={project.mirrors}
                    />
                  </div>
                )}

                {/* Cover (for projects without liveUrl or with key art) */}
                {project.cover && !project.liveUrl && (
                  <div
                    className="frame rounded-2xl mt-10 md:mt-12 aspect-[16/9]"
                    style={{ backgroundColor: project.coverTone }}
                  >
                    <img
                      src={project.cover}
                      alt={`${project.title} key art`}
                      loading="lazy"
                      decoding="async"
                      className={
                        project.coverFit === "contain"
                          ? "object-contain p-[11%]"
                          : "object-cover"
                      }
                    />
                  </div>
                )}

                {/* Live site / Multi-domain ecosystem */}
                {project.liveUrl && project.mirrors && project.mirrors.length > 0 ? (
                  <div className="card mt-10 md:mt-12 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <span className="label block mb-2">Multi-domain network</span>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-bone hover:text-gold text-base md:text-lg font-mono inline-flex items-center gap-1.5 transition-colors"
                        >
                          {project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                            Primary
                          </span>
                        </a>
                        {project.mirrors.map((m) => (
                          <a
                            key={m.url}
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-bone-muted hover:text-bone text-sm md:text-base font-mono inline-flex items-center gap-1.5 transition-colors"
                          >
                            <span className="text-bone-faint">·</span>
                            <span>{m.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost shrink-0"
                    >
                      Visit primary flagship
                      <Arrow size={15} />
                    </a>
                  </div>
                ) : project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card mt-10 md:mt-12 p-6 md:p-8 flex flex-wrap items-center justify-between gap-4 group/live"
                  >
                    <div>
                      <span className="label block mb-2">Live site</span>
                      <span className="text-bone text-base md:text-lg break-all">
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
                  </a>
                ) : null}

                {/* Narrative */}
                <div className="mt-14 md:mt-20 grid lg:grid-cols-12 gap-y-10 gap-x-14">
                  <div className="lg:col-span-4">
                    <h3 className="label lg:sticky lg:top-[7rem]">Case study</h3>
                  </div>

                  <div className="lg:col-span-8 space-y-10 md:space-y-12 max-w-[62ch]">
                    {project.sections.map((s, i) => (
                      <section key={s.heading}>
                        <div className="flex items-baseline gap-3 mb-3">
                          <span className="rule-index">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <h4 className="text-bone text-lg md:text-xl font-display">
                            {s.heading}
                          </h4>
                        </div>
                        <p className="prose-body">{s.body}</p>
                      </section>
                    ))}
                  </div>
                </div>

                {/* Screens */}
                {shots.length > 0 && (
                  <div className="mt-16 md:mt-24">
                    <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-[var(--line)] pt-8 mb-8">
                      <h3 className="display text-bone text-[clamp(1.5rem,3.2vw,2.25rem)]">
                        Screens
                      </h3>
                      <span className="label">
                        Shown uncropped · tap any screen to enlarge
                      </span>
                    </div>

                    <div className="space-y-12">
                      <ShotGrid
                        shots={shots}
                        shape="phone"
                        onOpen={(s) => setLightbox(shots.indexOf(s))}
                      />
                      <ShotGrid
                        shots={shots}
                        shape="square"
                        onOpen={(s) => setLightbox(shots.indexOf(s))}
                      />
                    </div>
                  </div>
                )}

                {project.note && (
                  <p className="label mt-14 pt-8 border-t border-[var(--line)]">
                    {project.note}
                  </p>
                )}

                {/* Tail CTA */}
                <div className="mt-16 md:mt-24 border-t border-[var(--line)] pt-10 flex flex-wrap items-center gap-4">
                  <a
                    href="#contact"
                    onClick={onClose}
                    className="btn btn-primary"
                  >
                    Start a project like this <Arrow size={15} />
                  </a>
                  <button type="button" onClick={onClose} className="btn btn-ghost">
                    Back to work
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Lightbox
        shots={shots}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onChange={setLightbox}
      />
    </>
  );
};

export default ProjectModal;
