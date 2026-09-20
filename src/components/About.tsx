import React from "react";
import { about, drawings, profile } from "../data/site";
import { Reveal, SectionHeading } from "./primitives";

const About: React.FC = () => (
  <section id="about" className="section hairline">
    <div className="shell">
      <SectionHeading index="03" title="About" />

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20">
        {/* Portrait */}
        <Reveal className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)_+_2.5rem)]">
            <div className="w-[68%] max-w-[19rem] lg:w-full lg:max-w-none">
              <img
                src="/brand/portrait-about.png"
                alt={`${profile.name} in the studio`}
                width={571}
                height={714}
                loading="lazy"
                decoding="async"
                className="w-full h-auto"
              />
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 max-w-sm">
              {about.facts.map((f) => (
                <div key={f.label}>
                  <dt className="label mb-1.5">{f.label}</dt>
                  <dd className="text-sm text-bone leading-snug">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        {/* Narrative */}
        <div className="lg:col-span-7">
          <Reveal delay={0.08}>
            <p className="display text-bone text-[clamp(1.6rem,3.6vw,2.4rem)] leading-[1.18] max-w-[24ch]">
              {about.paragraphs[0]}
            </p>
          </Reveal>

          <div className="mt-8 space-y-6 max-w-[62ch]">
            {about.paragraphs.slice(1).map((p, i) => (
              <Reveal key={i} delay={0.12 + i * 0.05}>
                <p className="prose-body">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <p className="mt-10 pl-6 border-l border-gold text-bone text-lg md:text-xl italic font-display">
              {about.closing}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Where it started — the graphite work the narrative refers to. */}
      <Reveal delay={0.1}>
        <div className="mt-20 md:mt-28 pt-10 border-t border-[var(--line)]">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-8">
            <h3 className="display text-bone text-[clamp(1.35rem,3vw,1.9rem)]">
              Where it started
            </h3>
            <span className="label">Graphite · Drawn from observation</span>
          </div>

          <ul className="grid grid-cols-3 gap-3 md:gap-6">
            {drawings.map((d) => (
              <li key={d.src}>
                <div className="frame rounded-xl aspect-square">
                  <img
                    src={d.src}
                    alt={d.alt}
                    width={720}
                    height={720}
                    loading="lazy"
                    decoding="async"
                    className="object-cover"
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
