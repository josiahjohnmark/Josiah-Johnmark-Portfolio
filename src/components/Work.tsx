import React from "react";
import { projects, type Project } from "../data/site";
import { Arrow, Reveal, SectionHeading } from "./primitives";

/* --------------------------------------------------------------------------
   Media panel — a real cover where one exists, and an honest typographic
   panel where one does not. Never a stock image standing in for work.
   -------------------------------------------------------------------------- */
const ProjectMedia: React.FC<{ project: Project }> = ({ project }) => {
  if (project.cover) {
    return (
      <div
        className="frame rounded-2xl w-full aspect-[4/3] sm:aspect-[16/10]"
        style={{ backgroundColor: project.coverTone }}
      >
        <img
          src={project.cover}
          alt={`${project.title} — cover`}
          loading="lazy"
          decoding="async"
          className={
            project.coverFit === "contain"
              ? "object-contain p-[14%]"
              : "object-cover"
          }
        />
      </div>
    );
  }

  /* Typographic cover for the two client sites. */
  return (
    <div
      className="frame rounded-2xl w-full aspect-[4/3] sm:aspect-[16/10] relative flex items-center justify-center p-8"
      style={{
        background: `linear-gradient(145deg, ${project.coverTone} 0%, #0a0a0b 100%)`,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(244,242,238,0.045) 1px, transparent 1px)",
          backgroundSize: "clamp(56px, 9%, 96px) 100%",
        }}
      />
      <span className="display text-bone/90 text-[clamp(1.75rem,4.2vw,3rem)] text-center relative leading-[1.05]">
        {project.title}
      </span>
    </div>
  );
};

const ProjectRow: React.FC<{
  project: Project;
  flipped: boolean;
  onOpen: () => void;
}> = ({ project, flipped, onOpen }) => (
  <Reveal as="article" className="group/card">
    <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
      {/* Media */}
      <div className={`lg:col-span-7 ${flipped ? "lg:order-2" : ""}`}>
        <button
          type="button"
          onClick={onOpen}
          className="block w-full text-left cursor-pointer"
          aria-label={`Open the ${project.title} case study`}
        >
          <ProjectMedia project={project} />
        </button>
      </div>

      {/* Text */}
      <div className={`lg:col-span-5 ${flipped ? "lg:order-1" : ""}`}>
        <div className="flex items-center gap-3 mb-5">
          <span className="rule-index">{project.index}</span>
          <span className="h-px w-8 bg-[var(--line-strong)]" aria-hidden="true" />
          <span className="label !text-bone-muted">{project.kind}</span>
        </div>

        <h3 className="display text-bone text-[clamp(1.9rem,4.5vw,2.75rem)]">
          {project.title}
        </h3>

        <p className="prose-body mt-4">{project.summary}</p>

        <dl className="mt-7 border-t border-[var(--line)]">
          {[
            ["Role", project.role],
            ["Platform", project.platform],
            ["Tools", project.tools.join("  ·  ")],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex items-baseline justify-between gap-5 py-3.5 border-b border-[var(--line)]"
            >
              <dt className="label shrink-0">{k}</dt>
              <dd className="text-sm text-bone-muted text-right leading-snug">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-2 text-sm text-bone cursor-pointer group/link"
          >
            Case study
            <Arrow
              size={15}
              className="text-gold transition-transform duration-500 group-hover/link:translate-x-1"
            />
          </button>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet text-sm inline-flex items-center gap-1.5"
            >
              Visit live site
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  </Reveal>
);

const Work: React.FC<{ onOpen: (p: Project) => void }> = ({ onOpen }) => (
  <section id="work" className="section hairline">
    <div className="shell">
      <SectionHeading
        index="01"
        title="Selected work"
        lede="A game, an app and two client platforms — each one designed and built end to end."
      />

      <div className="space-y-24 md:space-y-32 lg:space-y-40">
        {projects.map((p, i) => (
          <ProjectRow
            key={p.id}
            project={p}
            flipped={i % 2 === 1}
            onOpen={() => onOpen(p)}
          />
        ))}
      </div>
    </div>
  </section>
);

export default Work;
