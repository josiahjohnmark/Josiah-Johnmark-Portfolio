import { useState } from "react";
import type { Project } from "./data/site";
import About from "./components/About";
import Capabilities from "./components/Capabilities";
import Contact from "./components/Contact";
import Explorations from "./components/Explorations";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import ProjectModal from "./components/ProjectModal";
import Work from "./components/Work";

export default function App() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:z-[200] focus:top-4 focus:left-4 focus:inline-flex focus:items-center focus:h-12 focus:px-6 focus:rounded-full focus:bg-bone focus:text-ink focus:text-sm focus:font-medium"
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

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
