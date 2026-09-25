import React, { useState } from "react";
import { explorations } from "../data/site";
import { Reveal, SectionHeading } from "./primitives";

const Tile: React.FC<{ slug: string; title: string; tag: string }> = ({
  slug,
  title,
  tag,
}) => {
  const [touched, setTouched] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <figure
      className="group/tile"
      onMouseEnter={() => {
        setTouched(true);
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="frame rounded-xl relative aspect-[4/3]">
        <img
          src={`/images/thumbnails/${slug}.webp`}
          alt={title}
          loading="lazy"
          decoding="async"
          className="object-cover transition-opacity duration-500"
          style={{ opacity: hovered ? 0 : 1 }}
        />
        {touched && (
          <img
            src={`/images/animations/${slug}.webp`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 object-cover transition-opacity duration-500"
            style={{ opacity: hovered ? 1 : 0 }}
          />
        )}
      </div>
      <figcaption className="mt-3">
        <span className="block text-sm text-ink-mid transition-colors duration-400 group-hover/tile:text-ink">
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
