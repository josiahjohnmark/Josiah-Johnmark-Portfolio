import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, profile } from "../data/site";
import { useBodyLock, useEscape } from "./primitives";

const EASE = [0.76, 0, 0.24, 1] as const;

const Nav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useBodyLock(open);
  useEscape(open, () => setOpen(false));

  /* Check when scrolled past hero */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 220);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* =========================================================================
          TOP NAV (Visible at top of page over dark hero)
          ========================================================================= */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled && !open
            ? "-translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
        }`}
        style={{ height: "var(--nav-h)" }}
      >
        <nav
          className="shell h-full flex items-center justify-between"
          aria-label="Primary"
        >
          {/* Left: copyright + name */}
          <a
            href="#top"
            onClick={toTop}
            className="flex items-center gap-2 shrink-0 text-white/90 hover:text-white transition-colors"
            aria-label={`${profile.name} — back to top`}
          >
            <span className="text-sm font-medium tracking-[0.01em]">
              © Code by {profile.name}
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors relative py-1"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger on hero */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden -mr-2 w-12 h-12 flex items-center justify-center text-white"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="relative block w-6 h-3.5" aria-hidden="true">
              <span
                className={`absolute left-0 w-6 h-px bg-current transition-all duration-500 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 w-6 h-px bg-current transition-all duration-500 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* =========================================================================
          DENNIS SNELLENBERG FLOATING CIRCULAR BURGER BUTTON (appears on scroll)
          ========================================================================= */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            type="button"
            onClick={() => setOpen((v) => !v)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="floating-burger-btn"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            <span className="relative block w-6 h-3.5" aria-hidden="true">
              <span
                className={`absolute left-0 w-6 h-[1.5px] bg-white transition-all duration-400 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 w-6 h-[1.5px] bg-white transition-all duration-400 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* =========================================================================
          FULL-SCREEN SLIDE-OUT MENU DRAWER
          ========================================================================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="fixed inset-0 md:left-auto md:w-[480px] z-50 bg-[#1C1D20] text-white flex flex-col justify-between p-8 md:p-14 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
              <span className="text-xs uppercase tracking-widest text-white/40">Navigation</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-xs hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 py-10">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + i * 0.08,
                    ease: EASE,
                  }}
                  className="font-sans font-light text-[clamp(2.2rem,6vw,3.5rem)] text-white/90 hover:text-white hover:translate-x-3 transition-transform py-1"
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            <div className="pt-8 border-t border-white/10 space-y-4">
              <span className="text-xs uppercase tracking-widest text-white/40 block">Get in touch</span>
              <a
                href={`mailto:${profile.email}`}
                className="text-sm text-white/80 hover:text-accent transition-colors block"
              >
                {profile.email}
              </a>
              <p className="text-xs text-white/50">{profile.location}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
