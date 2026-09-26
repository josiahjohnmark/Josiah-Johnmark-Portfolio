import React, { useRef, useEffect } from "react";
import { motion, useScroll, useVelocity, useSpring, useTransform } from "motion/react";
import { profile } from "../data/site";
import Magnetic from "./Magnetic";

const EASE = [0.76, 0, 0.24, 1] as const;

/* --------------------------------------------------------------------------
   Scroll-responsive continuous marquee track
   Animates continuously, accelerates when scrolling down, reverses when scrolling up
   -------------------------------------------------------------------------- */
const ScrollResponsiveMarquee: React.FC = () => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const baseSpeed = -0.06; // Baseline drift speed (% per frame)
  const trackRef = useRef<HTMLDivElement>(null);
  const xPos = useRef(0);
  const dir = useRef(-1);

  useEffect(() => {
    let animId: number;

    const animate = () => {
      const v = smoothVelocity.get();
      if (Math.abs(v) > 2) {
        dir.current = v > 0 ? -1 : 1;
      }
      const scrollBoost = (v / 800) * -1;
      xPos.current += (baseSpeed + scrollBoost);

      // Loop between 0% and -50%
      if (xPos.current <= -50) {
        xPos.current = 0;
      } else if (xPos.current > 0) {
        xPos.current = -50;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${xPos.current}%)`;
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [smoothVelocity]);

  return (
    <div className="absolute inset-x-0 bottom-16 sm:bottom-20 md:bottom-2 z-20 pointer-events-none overflow-hidden select-none">
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform w-fit">
        <span className="font-sans font-normal text-[clamp(5.5rem,18vw,22rem)] md:text-[clamp(8.5rem,24vw,22rem)] leading-[0.82] tracking-[-0.04em] text-white pr-12 md:pr-24 drop-shadow-sm">
          — {profile.name} — {profile.name}
        </span>
        <span className="font-sans font-normal text-[clamp(5.5rem,18vw,22rem)] md:text-[clamp(8.5rem,24vw,22rem)] leading-[0.82] tracking-[-0.04em] text-white pr-12 md:pr-24 drop-shadow-sm">
          — {profile.name} — {profile.name}
        </span>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  return (
    /* =========================================================================
       HERO — Dennis Snellenberg Signature Layout:
       - Exact 100vh (h-screen)
       - Pinned sticky underneath (z-0)
       - Scaled-up confident portrait
       - Clean mobile view (matching Dennis Image 2: bottom badge, large face)
       - Giant responsive sliding typography
       ========================================================================= */
    <section
      id="top"
      className="sticky top-0 h-screen w-full flex flex-col justify-end overflow-hidden bg-[#999D9E] text-white select-none z-0"
    >
      {/* Studio lighting vignette */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 25%, rgba(255, 255, 255, 0.45) 0%, rgba(153, 157, 158, 0) 70%)",
        }}
        aria-hidden="true"
      />

      {/* -----------------------------------------------------------------------
          DESKTOP LEFT BADGE: "Located in Nigeria" capsule (hidden on mobile)
          Attached to left edge at Dennis's signature midpoint position
          ----------------------------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: EASE }}
        className="hidden md:block absolute left-0 top-[38%] lg:top-[40%] -translate-y-1/2 z-30"
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
          DESKTOP RIGHT BADGE: Down-right arrow + "Freelance Designer & Developer"
          ----------------------------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.25, ease: EASE }}
        className="hidden md:block absolute right-6 md:right-16 lg:right-28 top-[38%] lg:top-[40%] -translate-y-1/2 z-30 text-left pointer-events-none select-none"
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
          <div className="text-white text-2xl md:text-3xl lg:text-[2.2rem] font-sans font-normal leading-[1.12] tracking-tight">
            <p>Freelance</p>
            <p className="font-light text-white/90">Designer &amp; Developer</p>
          </div>
        </div>
      </motion.div>

      {/* -----------------------------------------------------------------------
          MOBILE BOTTOM-LEFT BADGE (Exact Dennis Snellenberg Image 2):
          Placed below the sliding text in the bottom-left corner
          ----------------------------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
        className="md:hidden absolute left-5 bottom-4 z-30 pointer-events-none select-none"
      >
        <div className="flex flex-col items-start">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white mb-1"
            aria-hidden="true"
          >
            <path d="M7 7l10 10M17 7v10H7" />
          </svg>
          <div className="text-white text-base font-sans font-normal leading-[1.15] tracking-tight">
            <p>Freelance</p>
            <p className="font-light text-white/90">Designer &amp; Developer</p>
          </div>
        </div>
      </motion.div>

      {/* -----------------------------------------------------------------------
          CENTERED PORTRAIT: Scaled up boldly, BEHIND the sliding typography (z-10)
          - Desktop: fills 88vh to 94vh height with broad presence
          - Mobile: scaled up significantly (matching Dennis Image 2), prominent face
          ----------------------------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
        className="absolute inset-x-0 bottom-0 flex justify-center items-end pointer-events-none z-10 overflow-hidden h-[78vh] sm:h-[84vh] md:h-[90vh] lg:h-[94vh]"
      >
        <img
          src="/brand/portrait-clean.png"
          alt={`${profile.name}, ${profile.role}`}
          width={1313}
          height={812}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-full w-auto max-w-none object-contain object-bottom select-none drop-shadow-2xl scale-[1.12] sm:scale-[1.08] md:scale-100 origin-bottom"
          style={{
            /* Centered on the person with subtle leftward shift */
            transform: "translateX(-8%) translateY(2px)",
          }}
        />
      </motion.div>

      {/* -----------------------------------------------------------------------
          SIGNATURE SCROLL-RESPONSIVE MARQUEE: IN FRONT of portrait (z-20)
          ----------------------------------------------------------------------- */}
      <ScrollResponsiveMarquee />
    </section>
  );
};

export default Hero;
