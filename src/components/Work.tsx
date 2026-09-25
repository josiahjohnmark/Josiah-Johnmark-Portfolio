import React, { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { projects, type Project } from "../data/site";
import { Reveal, SectionHeading } from "./primitives";

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
  onOpen: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}> = ({ project, onOpen, onHoverStart, onHoverEnd }) => (
  <motion.div
    className="project-row"
    onClick={onOpen}
    onMouseEnter={onHoverStart}
    onMouseLeave={onHoverEnd}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpen();
      }
    }}
    tabIndex={0}
    role="button"
    aria-label={`Open the ${project.title} case study`}
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
        <div className="text-right">
          <span className="text-sm font-medium text-ink-light block">{project.year}</span>
          {project.liveUrl && (
            <span className="inline-block w-2 h-2 rounded-full bg-[#3DD68C] mt-1" title="Live platform" />
          )}
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
    </div>
  </motion.div>
);

/* --------------------------------------------------------------------------
   Work section — project list with curved floating hover preview
   -------------------------------------------------------------------------- */
const Work: React.FC<{ onOpen: (p: Project) => void }> = ({ onOpen }) => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
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
                onOpen={() => onOpen(p)}
                onHoverStart={() => setActiveProject(p)}
                onHoverEnd={() => setActiveProject(null)}
              />
            </Reveal>
          ))}
        </div>

        <HoverPreview activeProject={activeProject} mousePos={mousePos} />
      </div>
    </section>
  );
};

export default Work;
