import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { profile, resumeUrl } from "../data/site";
import { Arrow } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

const Hero: React.FC = () => {
  const reduced = useReducedMotion();

  /* Entrance: one short, staggered fade. Nothing loops, nothing floats. */
  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.85, delay, ease: EASE },
        };

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-[calc(var(--nav-h)_+_1.5rem)] lg:pt-[calc(var(--nav-h)_+_2.5rem)]"
    >
      {/* A single, still pool of light behind the portrait. No animation. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-12%] top-[6%] w-[46rem] h-[46rem] max-w-[120vw] rounded-full opacity-[0.55]"
        style={{
          background:
            "radial-gradient(circle, rgba(216,180,74,0.07) 0%, rgba(216,180,74,0.02) 42%, transparent 68%)",
        }}
      />

      <div className="shell relative pb-20 md:pb-28 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-x-12 gap-y-14 items-center lg:min-h-[calc(100svh_-_var(--nav-h)_-_2.5rem)]">
          {/* ---------------- Text ---------------- */}
          <div className="lg:col-span-7 xl:col-span-7 lg:py-16">
            {profile.available && (
              <motion.div {...rise(0)}>
                <span className="pill">
                  <span className="dot-live" aria-hidden="true" />
                  {profile.availableLabel}
                </span>
              </motion.div>
            )}

            <motion.h1
              {...rise(0.08)}
              className="display mt-6 lg:mt-7 text-bone text-[clamp(3rem,12vw,7.5rem)]"
            >
              Josiah
              <br />
              <span className="italic">Johnmark</span>
            </motion.h1>

            <motion.p
              {...rise(0.16)}
              className="lede mt-6 lg:mt-7 max-w-[34rem] text-pretty"
            >
              {profile.statement}
            </motion.p>

            <motion.div
              {...rise(0.24)}
              className="mt-8 lg:mt-10 flex flex-wrap items-center gap-3"
            >
              <a href="#work" className="btn btn-primary">
                See selected work <Arrow size={15} />
              </a>
              <a href="#contact" className="btn btn-ghost">
                Get in touch
              </a>
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  Download CV
                </a>
              )}
            </motion.div>
          </div>

          {/* ---------------- Portrait ---------------- */}
          <motion.div
            {...(reduced
              ? {}
              : {
                  initial: { opacity: 0, scale: 1.03 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 1.3, delay: 0.1, ease: EASE },
                })}
            className="lg:col-span-5 xl:col-span-5 order-last"
          >
            <div className="relative mx-auto w-[78%] max-w-[22rem] sm:max-w-[24rem] lg:w-full lg:max-w-none">
              <img
                src="/brand/portrait-hero.png"
                alt={`${profile.name}, ${profile.role}`}
                width={535}
                height={714}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-auto select-none"
              />
            </div>
          </motion.div>
        </div>

        {/* Spec strip. A labelled row per line on a phone, three columns above it. */}
        <motion.dl
          {...rise(0.36)}
          className="mt-12 lg:mt-4 border-t border-[var(--line)] sm:grid sm:grid-cols-3 sm:gap-8 sm:pt-7"
        >
          {[
            ["Role", profile.role],
            ["Stack", "Unity · C# · Figma · React"],
            ["Based in", profile.location],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex items-baseline justify-between gap-5 py-4 border-b border-[var(--line)] sm:block sm:py-0 sm:border-0"
            >
              <dt className="label shrink-0 sm:mb-2">{k}</dt>
              <dd className="text-sm text-bone-muted text-right sm:text-left">
                {v}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
};

export default Hero;
