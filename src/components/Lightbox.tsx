import React, { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Shot } from "../data/site";
import { useBodyLock } from "./primitives";

type Props = {
  shots: Shot[];
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
};

const Lightbox: React.FC<Props> = ({ shots, index, onClose, onChange }) => {
  const open = index !== null;
  useBodyLock(open);

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onChange((index + delta + shots.length) % shots.length);
    },
    [index, onChange, shots.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, step]);

  const shot = index !== null ? shots[index] : null;

  return (
    <AnimatePresence>
      {shot && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[120] bg-ink/95 backdrop-blur-sm flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={`${shot.title} — enlarged`}
          onClick={onClose}
        >
          {/* Top bar */}
          <div
            className="shrink-0 flex items-center justify-between gap-4 px-5 md:px-8 h-[4.5rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <p className="text-bone text-sm md:text-base truncate">{shot.title}</p>
              <p className="label mt-0.5">
                {(index as number) + 1} / {shots.length}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              autoFocus
              className="w-12 h-12 shrink-0 rounded-full border border-[var(--line-strong)] text-bone flex items-center justify-center hover:bg-ink-elev transition-colors cursor-pointer"
              aria-label="Close image viewer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Stage — the image gets the full width; controls live below it so a
              phone screenshot is not squeezed between two arrow buttons. */}
          <div
            className="flex-1 min-h-0 flex items-center justify-center px-4 md:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              key={shot.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              src={shot.src}
              alt={shot.caption}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>

          {/* Controls + caption */}
          <div
            className="shrink-0 px-4 md:px-8 py-4 md:py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-3xl mx-auto flex items-center gap-4">
              {shots.length > 1 && (
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="w-12 h-12 shrink-0 rounded-full border border-[var(--line-strong)] text-bone flex items-center justify-center hover:bg-ink-elev transition-colors cursor-pointer"
                  aria-label="Previous image"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
              )}

              <p className="flex-1 text-center text-sm text-bone-muted leading-relaxed">
                {shot.caption}
              </p>

              {shots.length > 1 && (
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="w-12 h-12 shrink-0 rounded-full border border-[var(--line-strong)] text-bone flex items-center justify-center hover:bg-ink-elev transition-colors cursor-pointer"
                  aria-label="Next image"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
