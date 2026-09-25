import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { profile } from "../data/site";

const EASE = [0.76, 0, 0.24, 1] as const;

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
          - Studio grey background (#999D9E)
          - Left: "Located in Nigeria" capsule pill with spinning wireframe globe
          - Right: Diagonal arrow + "Freelance / Designer & Developer" (large)
          - Center: Portrait BEHIND sliding text (z-10)
          - In front: Giant continuous marquee typography (z-20), exactly like Dennis
          ========================================================================= */}
      <section
        id="top"
        className="relative h-[94vh] min-h-[700px] max-h-[1100px] flex flex-col justify-end overflow-hidden bg-[#999D9E] text-white select-none"
      >
        {/* Soft top studio light vignette */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 z-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 25%, rgba(255, 255, 255, 0.4) 0%, rgba(153, 157, 158, 0) 70%)",
          }}
          aria-hidden="true"
        />

        {/* -----------------------------------------------------------------------
            LEFT BADGE: "Located in Nigeria" capsule with rotating wireframe globe
            Exact Dennis Snellenberg style attached to the left edge
            ----------------------------------------------------------------------- */}
        <motion.div
          {...fadeIn(0.2)}
          className="absolute left-0 top-[35%] md:top-[40%] -translate-y-1/2 z-30"
        >
          <div className="bg-[#1C1D20] text-white pl-5 md:pl-7 pr-3 py-3 md:py-3.5 rounded-r-full flex items-center gap-3.5 md:gap-4 shadow-2xl border-y border-r border-white/10 group cursor-default">
            <div className="text-xs sm:text-[13px] md:text-sm leading-[1.25] font-sans tracking-wide text-left select-none">
              <span className="block text-white/80">Located</span>
              <span className="block text-white/80">in</span>
              <span className="block text-white font-semibold">Nigeria</span>
            </div>

            <div className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-[#999D9E]/30 border border-white/20 flex items-center justify-center text-white/95 shrink-0">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="globe-spin"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* -----------------------------------------------------------------------
            RIGHT BADGE: Down-right arrow + "Freelance Designer & Developer"
            Exact Dennis Snellenberg style positioned on right side with large font
            ----------------------------------------------------------------------- */}
        <motion.div
          {...fadeIn(0.25)}
          className="absolute right-6 md:right-16 lg:right-28 top-[35%] md:top-[40%] -translate-y-1/2 z-30 text-left pointer-events-none select-none"
        >
          <div className="flex flex-col items-start">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white mb-2 md:mb-3"
              aria-hidden="true"
            >
              <path d="M7 7l10 10M17 7v10H7" />
            </svg>
            <div className="text-white text-xl sm:text-2xl md:text-3xl lg:text-[2.2rem] font-sans font-normal leading-[1.12] tracking-tight">
              <p>Freelance</p>
              <p className="font-light text-white/90">Designer &amp; Developer</p>
            </div>
          </div>
        </motion.div>

        {/* -----------------------------------------------------------------------
            CENTERED PORTRAIT: BEHIND the sliding marquee text (z-10)
            Head reaches near top, chest & body sits behind the giant white letters
            ----------------------------------------------------------------------- */}
        <motion.div
          {...fadeIn(0.3)}
          className="relative inset-x-0 bottom-0 flex justify-center items-end pointer-events-none z-10 overflow-hidden h-[76vh] sm:h-[80vh] md:h-[85vh] lg:h-[89vh] max-h-[950px]"
        >
          <img
            src="/brand/portrait-clean.png"
            alt={`${profile.name}, ${profile.role}`}
            width={1313}
            height={812}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-auto max-w-none object-contain object-bottom select-none drop-shadow-2xl translate-y-[2px]"
          />
        </motion.div>

        {/* -----------------------------------------------------------------------
            SIGNATURE MARQUEE: IN FRONT of the portrait (z-20)
            Giant bold white typography sliding continuously across his lower chest
            Matches Dennis Snellenberg's exact proportion and layering
            ----------------------------------------------------------------------- */}
        <div className="absolute inset-x-0 bottom-0 md:bottom-2 z-20 pointer-events-none overflow-hidden select-none">
          <div className="hero-marquee-track">
            <span className="font-sans font-normal text-[clamp(8.5rem,24vw,22rem)] leading-[0.82] tracking-[-0.04em] text-white pr-16 md:pr-24 drop-shadow-sm">
              — {profile.name} — {profile.name}
            </span>
            <span className="font-sans font-normal text-[clamp(8.5rem,24vw,22rem)] leading-[0.82] tracking-[-0.04em] text-white pr-16 md:pr-24 drop-shadow-sm">
              — {profile.name} — {profile.name}
            </span>
          </div>
        </div>
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
