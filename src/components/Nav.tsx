import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, profile } from "../data/site";
import { Arrow, Mark, useBodyLock, useEscape, useScrolled } from "./primitives";

const Nav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(32);

  useBodyLock(open);
  useEscape(open, () => setOpen(false));

  const toTop = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled || open
            ? "bg-ink/85 backdrop-blur-xl border-b border-[var(--line)]"
            : "border-b border-transparent"
        }`}
        style={{ height: "var(--nav-h)" }}
      >
        <nav
          className="shell h-full flex items-center justify-between gap-6"
          aria-label="Primary"
        >
          {/* Mark + name */}
          <a
            href="#top"
            onClick={toTop}
            className="flex items-center gap-3 shrink-0 group/logo"
            aria-label={`${profile.name} — back to top`}
          >
            <Mark className="h-6 text-bone transition-colors duration-500 group-hover/logo:text-gold" />
            <span className="hidden sm:block text-sm tracking-[0.02em] text-bone font-medium">
              {profile.name}
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-9">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="link-quiet text-sm">
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <a href="#contact" className="btn btn-primary !min-h-[2.75rem] !px-5 !text-sm">
              Start a project
            </a>
          </div>

          {/* Mobile toggle — 48px target */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden -mr-2 w-12 h-12 flex items-center justify-center text-bone"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="relative block w-6 h-3.5" aria-hidden="true">
              <span
                className={`absolute left-0 w-6 h-px bg-current transition-all duration-400 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 w-6 h-px bg-current transition-all duration-400 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-ink md:hidden flex flex-col"
            style={{ paddingTop: "var(--nav-h)" }}
          >
            <div className="shell flex-1 flex flex-col justify-center gap-1 pb-24">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.05 + i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="display text-[clamp(2.5rem,13vw,3.5rem)] text-bone py-3 flex items-baseline gap-4"
                >
                  <span className="rule-index">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </motion.a>
              ))}
            </div>

            <div className="shell pb-10 border-t border-[var(--line)] pt-6">
              <a
                href={`mailto:${profile.email}`}
                onClick={() => setOpen(false)}
                className="btn btn-primary w-full"
              >
                Start a project <Arrow size={15} />
              </a>
              <p className="label mt-5">{profile.location}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
