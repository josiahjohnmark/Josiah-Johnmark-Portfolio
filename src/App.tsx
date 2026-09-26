import { useState } from "react";
import type { Project } from "./data/site";
import About from "./components/About";
import Capabilities from "./components/Capabilities";
import Contact from "./components/Contact";
import Explorations from "./components/Explorations";
import Hero from "./components/Hero";
import Loader from "./components/Loader";
import Nav from "./components/Nav";
import Work from "./components/Work";

export default function App() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [opening, setOpening] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="bg-[#1C1D20] min-h-screen text-ink overflow-x-clip selection:bg-ink selection:text-white">
      {/* ============ INTRO LOADER ============ */}
      {!loaded && (
        <Loader
          onStartOpening={() => setOpening(true)}
          onComplete={() => setLoaded(true)}
        />
      )}

      {/* ============ SITE CONTENT ============
          Soft cinematic zoom-in reveal:
          Site sits behind the dark doors slightly pulled back (scale 0.965).
          The moment the doors part open, the site softly zooms to natural scale 1.0,
          giving the viewer the gentle sensation of moving closer into the portfolio.
          The deep background matches the doors, preventing any jarring white flash.
          ======================================= */}
      <div
        className="bg-cream min-h-screen"
        style={{
          transform: opening ? "scale(1)" : "scale(0.965)",
          opacity: opening ? 1 : 0.88,
          transformOrigin: "center 35%",
          transition: opening
            ? "transform 1.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease"
            : "none",
          pointerEvents: loaded ? "auto" : "none",
        }}
      >
        <a
          href="#work"
          className="sr-only focus:not-sr-only focus:fixed focus:z-[200] focus:top-4 focus:left-4 focus:inline-flex focus:items-center focus:h-12 focus:px-6 focus:rounded-full focus:bg-cream focus:text-ink focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>

        <Nav />

        <main>
          <Hero />
          <Work onOpen={setSelected} />
          <Explorations />
          <About />
          <Capabilities />
          <Contact />
        </main>
      </div>
    </div>
  );
}
