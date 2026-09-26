import React from "react";
import { about, drawings, profile } from "../data/site";
import { Reveal } from "./primitives";

const About: React.FC = () => (
  <section id="about" className="section">
    <div className="shell">
      {/* Section intro */}
      <Reveal>
        <div className="flex items-center gap-4 mb-6">
          <span className="rule-index">03</span>
          <span className="h-px flex-1 bg-[var(--line)]" aria-hidden="true" />
        </div>
      </Reveal>

      {/* Two-column: big statement + portrait */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left: narrative */}
        <div>
          <Reveal>
            <h2 className="display text-ink text-[clamp(2rem,4vw,3.2rem)] leading-[1.12] max-w-[18ch]">
              {about.paragraphs[0]}
            </h2>
          </Reveal>

          <div className="mt-10 space-y-6 max-w-[58ch]">
            {about.paragraphs.slice(1).map((p, i) => (
              <Reveal key={i} delay={0.08 + i * 0.04}>
                <p className="prose-body">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.25}>
            <p className="mt-10 pl-6 border-l-2 border-accent text-ink text-lg md:text-xl italic font-display leading-snug">
              {about.closing}
            </p>
          </Reveal>

          {/* Quick facts */}
          <Reveal delay={0.3}>
            <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6">
              {about.facts.map((f) => (
                <div key={f.label}>
                  <dt className="label mb-1.5">{f.label}</dt>
                  <dd className="text-sm text-ink leading-snug font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Right: portrait with #999D9E studio background scaled up boldly */}
        <Reveal delay={0.1}>
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)]">
            <div className="w-full max-w-[480px] lg:max-w-[540px] aspect-[4/5] mx-auto lg:mx-0 rounded-[2rem] overflow-hidden bg-[#999D9E] pt-10 px-2 flex items-end justify-center shadow-2xl border border-black/5">
              <img
                src="/brand/portrait-clean.png"
                alt={`${profile.name} in the studio`}
                width={700}
                height={700}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-bottom select-none drop-shadow-2xl scale-[1.55] origin-bottom translate-y-[4px]"
              />
            </div>
          </div>
        </Reveal>
      </div>

      {/* Drawings gallery — subtle, at the bottom */}
      <Reveal delay={0.1}>
        <div className="mt-24 md:mt-32 pt-10 border-t border-[var(--line)]">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-8">
            <h3 className="display text-ink text-[clamp(1.35rem,3vw,1.9rem)]">
              Where it started
            </h3>
            <span className="label">Graphite · Drawn from observation</span>
          </div>

          <ul className="grid grid-cols-3 gap-3 md:gap-6">
            {drawings.map((d) => (
              <li key={d.src}>
                <div className="frame rounded-2xl aspect-square bg-[#EAEAE6] overflow-hidden border border-[var(--line)]">
                  <img
                    src={d.src}
                    alt={d.alt}
                    width={720}
                    height={720}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  </section>
);

export default About;
