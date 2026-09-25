import React, { useState, useRef, useEffect } from "react";
import { explorations } from "../data/site";
import { Reveal, SectionHeading } from "./primitives";

const Tile: React.FC<{ slug: string; title: string; tag: string }> = ({
  slug,
  title,
  tag,
}) => {
  const [touched, setTouched] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [animLoaded, setAnimLoaded] = useState(false);
  const [animError, setAnimError] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    // Debounce touched state by 80ms so quick mouse swipes don't trigger heavy file downloads
    if (!touched) {
      hoverTimerRef.current = setTimeout(() => {
        setTouched(true);
      }, 80);
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const isMotionActive = hovered && animLoaded && !animError;

  return (
    <figure
      className="group/tile"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="frame rounded-2xl relative aspect-[4/3] bg-[#EAEAE6] overflow-hidden shadow-sm border border-[var(--line)]">
        {/* Static high-res thumbnail: ALWAYS visible while animation is loading or if it fails */}
        <img
          src={`/images/thumbnails/${slug}.webp`}
          alt={title}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: isMotionActive ? 0 : 1 }}
        />

        {/* Animated preview: only mounts after hover intent and fades in when fully loaded */}
        {touched && (
          <img
            src={`/images/animations/${slug}.webp`}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            onLoad={() => setAnimLoaded(true)}
            onError={() => setAnimError(true)}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none"
            style={{ opacity: isMotionActive ? 1 : 0 }}
          />
        )}

        {/* Loading motion pill indicator if hovered and buffering high-res frames */}
        {hovered && touched && !animLoaded && !animError && (
          <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-mono tracking-wider text-white/90 pointer-events-none flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>Motion</span>
          </div>
        )}

        {/* Live motion pill when active */}
        {isMotionActive && (
          <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-[10px] font-mono tracking-wider text-white/95 pointer-events-none flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>Live</span>
          </div>
        )}
      </div>

      <figcaption className="mt-3">
        <span className="block text-sm text-ink-mid transition-colors duration-400 group-hover/tile:text-ink font-medium">
          {title}
        </span>
        <span className="label mt-1 block">{tag}</span>
      </figcaption>
    </figure>
  );
};

const Explorations: React.FC = () => (
  <section id="explorations" className="section">
    <div className="shell">
      <SectionHeading
        index="02"
        title="Explorations"
        lede="Personal interface experiments — motion, layout and interaction ideas built to try something, not for a client."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 md:gap-x-7">
        {explorations.map((e, i) => (
          <Reveal key={e.slug} delay={Math.min(i, 3) * 0.06}>
            <Tile {...e} />
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Explorations;
