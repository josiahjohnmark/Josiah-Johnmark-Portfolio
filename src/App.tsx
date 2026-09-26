import { useState, useEffect } from "react";
import type { Project } from "./data/site";
import About from "./components/About";
import Capabilities from "./components/Capabilities";
import Contact from "./components/Contact";
import EditorialIntro from "./components/EditorialIntro";
import Explorations from "./components/Explorations";
import Hero from "./components/Hero";
import Loader from "./components/Loader";
import Nav from "./components/Nav";
import Work from "./components/Work";
import Magnetic from "./components/Magnetic";

export default function App() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Ensure scroll is at absolute top when page is refreshed or loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#1C1D20] min-h-screen text-ink overflow-x-clip selection:bg-ink selection:text-white">
      {/* ============ INTRO CURVED LOADER ============
          Dennis Snellenberg signature curved swipe-up loader.
          Curtain lifts with an organic upward SVG curve, strictly resetting scroll to top.
          ============================================= */}
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      {/* Navigation */}
      <Nav />

      <main className="relative">
        {/* =========================================================================
            1. STICKY 100VH HERO SECTION (z-0)
            - Fills 100% of the viewport (h-screen)
            - Pinned in place underneath
            - Scaled-up portrait & scroll-responsive sliding typography
            ========================================================================= */}
        <Hero />

        {/* =========================================================================
            2. RISING CREAM CURTAIN (z-10)
            - As user scrolls, this rounded cream container rolls UP OVER the hero section
            - When on hero, you see only hero (100vh)
            - Houses Editorial Intro, Selected Work, Explorations, About, Capabilities
            ========================================================================= */}
        <div className="relative z-10 bg-cream rounded-t-[2.5rem] md:rounded-t-[3.5rem] shadow-[0_-25px_60px_rgba(0,0,0,0.2)]">
          <EditorialIntro />
          <Work onOpen={setSelected} />
          <Explorations />
          <About />
          <Capabilities />

          {/* Centered "More work" pill button — Dennis Snellenberg Image 4 */}
          <div className="pt-16 pb-20 flex justify-center bg-cream">
            <Magnetic strength={0.35}>
              <a
                href="#work"
                className="btn-curve !min-h-[3.25rem] !px-8 rounded-full border border-[var(--line-strong)] text-ink bg-transparent flex items-center justify-center font-sans font-medium text-sm transition-all duration-300 shadow-sm"
                style={{ "--fill-bg": "#1C1D20" } as React.CSSProperties}
              >
                More work <sup className="font-mono text-xs text-ink-light ml-1.5">05</sup>
              </a>
            </Magnetic>
          </div>

          {/* Bottom curved unmask edge — Dennis Snellenberg Image 4/5
              Peels away smoothly as user scrolls down to reveal the dark footer */}
          <div className="relative w-full h-[100px] sm:h-[140px] md:h-[180px] overflow-hidden bg-cream">
            <div
              className="absolute inset-x-[-8%] top-0 h-full rounded-b-[50%] bg-cream shadow-2xl"
            />
          </div>
        </div>

        {/* =========================================================================
            3. PINNED FOOTER WITH SLIDING BLUE "GET IN TOUCH" CIRCLE (z-0)
            - Unmasked by the rising curved cream curtain
            - Blue circle slides softly from center toward right
            ========================================================================= */}
        <Contact />
      </main>
    </div>
  );
}
