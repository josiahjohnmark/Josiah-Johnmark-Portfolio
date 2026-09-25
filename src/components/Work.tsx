import React, { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { projects, type Project } from "../data/site";
import { Reveal, SectionHeading } from "./primitives";


/* --------------------------------------------------------------------------
   Hover preview image that follows cursor — the signature effect
   -------------------------------------------------------------------------- */
const HoverPreview: React.FC<{
  activeProject: Project | null;
  mousePos: { x: number; y: number };
}> = ({ activeProject, mousePos }) => {
  /* Determine preview image: cover image, or a generated gradient if none */
  const imgSrc = activeProject?.cover;

  return (
    <div
      className={`project-hover-img ${activeProject ? "visible" : ""}`}
      style={{
        left: mousePos.x - 220,
        top: mousePos.y - 155,
      }}
    >
      {imgSrc ? (
        <img src={imgSrc} alt="" />
      ) : (
        <div
          className="w-full h-full"
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
   Single project row — large serif title, label on the right
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
    <div className="flex items-baseline gap-6">
      <span className="rule-index hidden md:inline-block w-8">{project.index}</span>
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
   Work section — project list with floating hover preview
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
