import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { profile } from "../data/site";

const EASE = [0.76, 0, 0.24, 1] as const;

const GlobeIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const Hero: React.FC = () => {
  const reduced = useReducedMotion();

  const fadeIn = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 1.2, delay, ease: EASE },
        };

  return (
    <>
      {/* =========================================================================
          HERO — Dennis Snellenberg signature layout:
          - Studio slate background that seamlessly melts portrait borders
          - Badges on left ("Located in Nigeria" + spinning globe) and right (role)
          - Centered portrait anchored at the bottom
          - Infinite sliding marquee text moving horizontally behind portrait
          ========================================================================= */}
      <section
        id="top"
        className="relative h-[92vh] min-h-[640px] max-h-[1050px] flex flex-col justify-between overflow-hidden bg-[#161719] text-white select-none"
        style={{ paddingTop: "calc(var(--nav-h) + 1rem)" }}
      >
        {/* Subtle studio glow in center */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 50% 60%, rgba(69, 92, 233, 0.15) 0%, rgba(22, 23, 25, 0) 70%)",
          }}
          aria-hidden="true"
        />

        {/* Top meta row: Left Location badge / Right arrow + role */}
        <div className="shell relative z-20 flex items-start justify-between gap-6">
          {/* Left badge */}
          <motion.div {...fadeIn(0.1)} className="flex items-center gap-3">
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium tracking-wide">
              <span>Located in Nigeria</span>
              <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center animate-spin-slow">
                <GlobeIcon className="w-3.5 h-3.5 text-white/80" />
              </div>
            </div>

            {profile.available && (
              <span className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/80">
                <span className="w-2 h-2 rounded-full bg-[#3DD68C] animate-pulse" />
                {profile.availableLabel}
              </span>
            )}
          </motion.div>

          {/* Right role title */}
          <motion.div {...fadeIn(0.2)} className="text-right">
            <span className="block text-white text-xl font-light leading-none mb-1">↘</span>
            <p className="text-white text-sm md:text-base font-medium tracking-tight">
              Freelance Game Developer
            </p>
            <p className="text-white/60 text-xs md:text-sm">&amp; UI/UX Designer</p>
          </motion.div>
        </div>

        {/* The Dennis Snellenberg Signature Marquee — slides continuously behind portrait */}
        <div className="absolute inset-x-0 bottom-4 md:bottom-8 z-10 pointer-events-none overflow-hidden">
          <div className="hero-marquee-track">
            <span className="font-sans font-medium text-[clamp(4.5rem,13vw,12.5rem)] leading-none tracking-[-0.04em] text-white/90 pr-12">
              {profile.name} — {profile.role} —
            </span>
            <span className="font-sans font-medium text-[clamp(4.5rem,13vw,12.5rem)] leading-none tracking-[-0.04em] text-white/90 pr-12">
              {profile.name} — {profile.role} —
            </span>
          </div>
        </div>

        {/* Centered portrait — anchored at bottom, in front of marquee */}
        <motion.div
          {...fadeIn(0.3)}
          className="absolute inset-x-0 bottom-0 flex justify-center items-end pointer-events-none z-20"
        >
          <div className="relative w-[75vw] max-w-[360px] sm:max-w-[420px] md:w-[36vw] md:max-w-[480px] lg:max-w-[520px]">
            <img
              src="/brand/portrait-hero.png"
              alt={`${profile.name}, ${profile.role}`}
              width={535}
              height={714}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto object-bottom select-none drop-shadow-2xl"
            />
          </div>
        </motion.div>
      </section>

      {/* =========================================================================
          EDITORIAL INTRO SECTION — Dennis Snellenberg style
          - Clean off-white background
          - Large editorial statement
          - Ethos description
          - Circular magnetic "About me" button
          ========================================================================= */}
      <section className="section bg-cream">
        <div className="shell grid lg:grid-cols-12 gap-10 md:gap-14 items-start">
          <div className="lg:col-span-8">
            <h2 className="text-ink text-[clamp(1.75rem,3.6vw,3.25rem)] font-sans font-normal leading-[1.25] tracking-[-0.03em]">
              Helping digital products and brands stand out with craft. Merging game development, system design, and high-fidelity interaction into memorable experiences.
            </h2>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between gap-10 lg:pl-6">
            <p className="prose-body">
              {profile.statement}
            </p>

            <div>
              <a
                href="#about"
                className="magnetic-btn !w-[150px] !h-[150px] md:!w-[170px] md:!h-[170px] !bg-ink !text-white hover:!bg-accent"
              >
                About me
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
