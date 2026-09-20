import React from "react";
import { capabilities } from "../data/site";
import { Reveal, SectionHeading } from "./primitives";

const Capabilities: React.FC = () => (
  <section id="capabilities" className="section hairline">
    <div className="shell">
      <SectionHeading
        index="04"
        title="What I do"
        lede="Four disciplines that overlap more than they separate — most projects use all of them."
      />

      <ul className="border-t border-[var(--line)]">
        {capabilities.map((c, i) => (
          <Reveal as="li" key={c.title} delay={Math.min(i, 3) * 0.05}>
            <div className="border-b border-[var(--line)] py-9 md:py-11 grid md:grid-cols-12 gap-5 md:gap-10 items-start">
              <div className="md:col-span-1">
                <span className="rule-index">{String(i + 1).padStart(2, "0")}</span>
              </div>

              <h3 className="md:col-span-4 display text-bone text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight">
                {c.title}
              </h3>

              <div className="md:col-span-7">
                <p className="prose-body max-w-[54ch]">{c.body}</p>
                <p className="meta-list mt-4" aria-label={`${c.title} tools`}>
                  {c.tools.map((t, n) => (
                    <React.Fragment key={t}>
                      {n > 0 && <span className="sep">·</span>}
                      {t}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);

export default Capabilities;
