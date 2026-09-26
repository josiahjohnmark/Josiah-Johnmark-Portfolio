import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { projects, type Project } from "../data/site";
import { Reveal, SectionHeading } from "./primitives";
import ProjectAccordion from "./ProjectAccordion";

/* --------------------------------------------------------------------------
   Hover preview image that follows cursor — the signature effect
   Now featuring smooth 24px curved corners (border-radius: 1.5rem)
   -------------------------------------------------------------------------- */
const HoverPreview: React.FC<{
  activeProject: Project | null;
  mousePos: { x: number; y: number };
}> = ({ activeProject, mousePos }) => {
  const imgSrc = activeProject?.cover;

  return (
    <div
      className={`project-hover-img rounded-2xl overflow-hidden ${
        activeProject ? "visible" : ""
      }`}
      style={{
        left: mousePos.x - 220,
        top: mousePos.y - 155,
        backgroundColor: activeProject?.coverTone || "#1C1D20",
      }}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt=""
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
          className={`w-full h-full rounded-2xl transition-transform duration-500 ${
            activeProject?.coverFit === "contain"
              ? "object-contain p-8 scale-95"
              : "object-cover scale-100"
          }`}
        />
      ) : (
        <div
          className="w-full h-full rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${activeProject?.coverTone || "#333"} 0%, #1C1D20 100%)`,
          }}
        />
      )}
      <div className="project-hover-badge" aria-hidden="true">
        View
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
   Single project row —
   Desktop: large serif title + label on hover with mouse effect
   Mobile: direct curved thumbnail card with details
   -------------------------------------------------------------------------- */
const ProjectRow: React.FC<{
  project: Project;
  isExpanded: boolean;
  onToggle: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}> = ({ project, isExpanded, onToggle, onHoverStart, onHoverEnd }) => (
  <motion.div
    className={`project-row ${isExpanded ? "!opacity-100 !border-b-transparent" : ""}`}
    onClick={onToggle}
    onMouseEnter={onHoverStart}
    onMouseLeave={onHoverEnd}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggle();
      }
    }}
    tabIndex={0}
    role="button"
    aria-expanded={isExpanded}
    aria-label={`${isExpanded ? "Close" : "Open"} the ${project.title} case study`}
  >
    {/* Mobile view (< md): curved thumbnail image directly visible on card */}
    <div className="md:hidden w-full flex flex-col gap-4 py-4 text-left">
      {project.cover && (
        <div
          className="w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-sm border border-[var(--line)]"
          style={{ backgroundColor: project.coverTone || "#1C1D20" }}
        >
          <img
            src={project.cover}
            alt={project.title}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
            className={`w-full h-full rounded-2xl ${
              project.coverFit === "contain"
                ? "object-contain p-7 scale-95"
                : "object-cover scale-100"
            }`}
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <span className="rule-index text-xs text-ink-light block mb-1">
            {project.index} — {project.kind}
          </span>
          <h3 className="text-2xl font-serif text-ink font-normal">{project.title}</h3>
        </div>
        <div className="flex items-center gap-3">
          {project.liveUrl && (
            <span className="inline-block w-2 h-2 rounded-full bg-[#3DD68C]" title="Live platform" />
          )}
          {/* Expand/collapse chevron */}
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-ink-light"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </div>
      </div>
    </div>

    {/* Desktop view (>= md): sleek Dennis Snellenberg row with cursor preview */}
    <div className="hidden md:flex items-baseline gap-6">
      <span className="rule-index inline-block w-8">{project.index}</span>
      <h3>{project.title}</h3>
    </div>

    <div className="hidden md:flex items-center gap-8">
      <span className="label !text-ink-light">{project.kind}</span>
      <span className="text-sm text-ink-light">{project.year}</span>
      {project.liveUrl && (
        <span className="w-2 h-2 rounded-full bg-[#3DD68C]" title="Live" />
      )}
      {/* Expand/collapse indicator */}
      <motion.div
        className="w-9 h-9 rounded-full border border-[var(--line-strong)] flex items-center justify-center text-ink-light"
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </div>
  </motion.div>
);

/* --------------------------------------------------------------------------
   Work section — project list with accordion expansion + floating hover preview
   -------------------------------------------------------------------------- */
const Work: React.FC<{ onOpen: (p: Project) => void }> = ({ onOpen }) => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    /* Only track mouse when no project is expanded */
    if (!expandedId) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  }, [expandedId]);

  const handleToggle = useCallback((p: Project) => {
    setExpandedId((prev) => (prev === p.id ? null : p.id));
    /* Clear hover preview when expanding */
    setActiveProject(null);
  }, []);

  return (
    <section id="work" className="section" onMouseMove={handleMouseMove}>
      <div className="shell">
        <SectionHeading
          index="01"
          title="Selected work"
          lede="A game, a mobile app and three live web platforms — each one designed and built end to end."
        />

        <div ref={containerRef} className="project-list">
          {projects.map((p) => (
            <Reveal key={p.id} delay={0}>
              <ProjectRow
                project={p}
                isExpanded={expandedId === p.id}
                onToggle={() => handleToggle(p)}
                onHoverStart={() => {
                  if (!expandedId) setActiveProject(p);
                }}
                onHoverEnd={() => setActiveProject(null)}
              />

              {/* Accordion dropdown — soft expand below the row */}
              <AnimatePresence>
                {expandedId === p.id && (
                  <ProjectAccordion
                    project={p}
                    onClose={() => setExpandedId(null)}
                  />
                )}
              </AnimatePresence>
            </Reveal>
          ))}
        </div>

        {/* Only show hover preview when nothing is expanded */}
        {!expandedId && (
          <HoverPreview activeProject={activeProject} mousePos={mousePos} />
        )}
      </div>
    </section>
  );
};

export default Work;
