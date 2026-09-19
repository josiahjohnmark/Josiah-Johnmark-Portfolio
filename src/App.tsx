import { 
  Code2, ArrowDown, Database, Server, Cloud, Code, Palette, 
  PenTool, Camera, Mic, Keyboard, Activity, Coffee, Headphones, 
  Film, Fingerprint, Network, Tablet, Video, SlidersHorizontal, 
  Smartphone, Lightbulb, Cpu, MessageSquare, Send, X, Play, 
  Square, Volume2, Sparkles, Check, Copy, Search, Calendar, Clock, 
  Plus, ChevronRight, Briefcase, RefreshCw, AlertCircle,
  Github, Instagram, Twitter, Mail, Globe, Brain, Music, Gamepad2, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { getAudioContext } from './utils/audio';

// Modular Bento Modals and Cards Imports
import WebStackModal from './components/WebStackModal';
import ToolsUsedCard from './components/ToolsUsedCard';
import KeyboardModal from './components/KeyboardModal';
import PianoModal from './components/PianoModal';
import VisualArtsModal from './components/VisualArtsModal';
import ImageEditorModal from './components/ImageEditorModal';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Josiah's Narrative Context for the AI Twin
const JOSIAH_SYSTEM_INSTRUCTION = `
You are the AI Twin of Josiah Johnmark, a dedicated Game Developer, UI/UX Designer, and Web & App Developer.
You speak in his voice: thoughtful, grounded, creative, disciplined, and passionate about turning ideas from imagination into tactile reality.

Key Background Facts about Josiah:
- Roles: Game Developer, UI/UX Designer, Web & App Developer, and Creative Technologist.
- Traditional Roots: Started with more than seven years of traditional pencil art, gradually expanding into photography, digital art, UI/UX, and software development.
- Core Philosophy: "I like seeing ideas come to life. I enjoy taking something from imagination to something real — designing it, building it, experimenting with it and refining it along the way. I'm still learning. Still experimenting. Still building."
- Flagship Projects:
  1. Ludo NX: Modern, interactive, cross-platform board game combining custom art, dice physics, fluid animations, and multiplayer mechanics in Unity & C#.
  2. Selah: A tranquil, beautifully crafted Bible and spiritual reflection mobile app designed for serene typography, quiet aesthetic pacing, and daily devotionals.
  3. Client & Freelance Solutions: Custom web applications, digital systems, and UI architecture developed for companies and organizations.
  4. Interactive UI Prototypes: Kinematic 60 FPS web interfaces, micro-interactions, and visual prototypes.
- Toolset: Unity, C#, Blender, Figma, VS Code, Git, Photoshop, React, TypeScript, and Tailwind CSS.

Conversation Guidelines:
1. Speak in the first person ("I", "my") as Josiah's digital twin.
2. Be genuine, professional, humble yet confident in your craft.
3. If asked about projects, explain Ludo NX, Selah, or client work with authentic technical and design insight.
4. If asked about background, mention the 7+ years of traditional pencil art that built your foundation in observation, composition, and patient craft.
`;

const fadeInSlideUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } }
};

// Preset projects data for portfolio
const PROJECTS_DATA = [
  {
    id: 1,
    title: "Ludo NX",
    category: "Game Dev",
    shortDesc: "A modern mobile Ludo game combining polished UI/UX, competitive gameplay, player progression, customization, rewards, and a premium board-game aesthetic.",
    role: "Game Developer · UI/UX Designer · Visual Designer",
    tools: ["Unity", "Figma", "Canva", "C#", "AI-assisted development"],
    platform: "Mobile (iOS & Android)",
    tags: ["Unity", "C#", "Figma", "Game Systems", "Mobile Game"],
    metric: "Flagship Game",
    thumbnail: "/images/thumbnails/ludo_nx_thumbnail.png",
    screenshots: [
      "/images/thumbnails/ludo_nx_thumbnail.png",
      "/images/ludo_nx/MATCH coundown (2).png",
      "/images/ludo_nx/game result_page.png",
      "/images/ludo_nx/friend_list_screen.png",
      "/images/ludo_nx/freind_request_screen.png",
      "/images/ludo_nx/iPhone 16 & 17 Pro - 2 (1).png"
    ],
    details: "Ludo NX is a premium mobile board game that reimagines the classic Ludo experience with a modern, polished visual style and game-first progression system. I developed Ludo NX as both a game and a product, focusing not only on core gameplay, but also on how players navigate, progress, customize their experience, and interact with the game's economy.",
    caseStudy: {
      overview: "Ludo NX is a premium mobile board game that reimagines the classic Ludo experience with a modern, polished visual style and game-first progression system. The project combines game development, UI/UX design, visual design, and interactive systems into one cohesive mobile experience. I designed the interface and visual direction around a clean, premium board-game aesthetic, while building systems for gameplay, player progression, profiles, rewards, rankings, customization, and in-game interactions.",
      concept: "The core vision was to take an internationally beloved classic and elevate it into a sleek, high-engagement digital title. Rather than treating Ludo as a static digital board, Ludo NX creates an immersive mobile arena with distinct player quadrants, dynamic dice-roll states, and tournament-grade pacing.",
      myRole: "Game Developer · UI/UX Designer · Visual Designer — End-to-end solo creator responsible for complete product architecture, user research, interface layouts, vector asset creation, C# mechanics programming, and audio design.",
      uiUx: "Designed the full interface and visual direction in Figma and implemented in Unity. Focused on mobile ergonomic reachability, crystal-clear token path indicators, tactile dice roll controls, tournament-style profile frames, and reward celebration modals.",
      gameplay: "Engineered 15×15 Ludo board logic, responsive turn management, multiplayer-style player setups, token paths, safe zones, capture logic, realistic dice physics, and multiple difficulty options with smart AI decision engines.",
      progression: "Built a comprehensive player progression loop: profile levels, experience points, milestone achievements, customizable dice and token skins, daily rewards, missions, rankings ladders, and an integrated in-game shop.",
      visualDesign: "Developed a distinctive visual language: rich deep-space hues, glowing board accents, custom token silhouettes, vibrant dice pips, and fluid micro-animations that deliver satisfying physical weight to digital moves.",
      development: "Engineered in Unity using modular C# architecture, decoupled event-driven game controllers, optimized sprite atlases, dynamic Canvas Scalers for phone and tablet aspect ratios, and fluid Lottie/sprite animations.",
      finalResult: "A comprehensive, high-polish mobile title that demonstrates end-to-end capabilities across game systems engineering, visual polish, product architecture, and user experience."
    },
    isFeatured: true
  },
  {
    id: 2,
    title: "Selah",
    category: "Apps",
    shortDesc: "Thoughtfully crafted Bible & spiritual reflection mobile application with serene typography and daily devotionals.",
    role: "Mobile Developer · UI/UX Designer",
    tools: ["Mobile App", "Figma", "Typography", "Clean Architecture"],
    platform: "Mobile",
    tags: ["Mobile App", "UI/UX Design", "Clean Architecture", "Typography"],
    details: "Selah is a tranquil scripture reading and reflection application designed with serene typography, quiet aesthetic pacing, daily devotionals, custom verse bookmarking, and distraction-free mobile interaction design.",
    metric: "Mobile App",
    thumbnail: "/images/thumbnails/selah_thumbnail.png",
    isFeatured: true
  },
  {
    id: 3,
    title: "USH Community",
    category: "Client Work",
    shortDesc: "Digital platform built for a thriving community of 20,000+ traders providing access to market insights, trading education, and mentorship.",
    role: "UI/UX Design · Website Development · Visual Design",
    focus: "Responsive design · User experience · Trading/finance presentation · Community platform",
    tools: ["React", "UI/UX Design", "Fintech", "Tailwind CSS"],
    platform: "Web & Mobile",
    liveUrl: "https://www.ushcommunity.com/",
    tags: ["Trading & Finance", "UI/UX Design", "Web Development", "20k+ Community"],
    details: "USH Community is a digital platform built for a community of traders, providing access to market insights, trading education, analysis, mentorship, and trading-related resources. I designed and developed the website to give the community a clear and professional online presence, with a visual direction suited to the trading and financial space. The focus was on creating a straightforward experience that communicates the platform's purpose while making key information and community resources easy to access for its 20,000+ Telegram community members.",
    metric: "20k+ Traders",
    isFeatured: true
  },
  {
    id: 4,
    title: "Zubairu Mustapha Foundation",
    category: "Client Work",
    shortDesc: "Official digital presence and impact portal for an NGO dedicated to empowering the boy child across Taraba State, Nigeria.",
    role: "UI/UX Design · Website Development · Visual Design",
    focus: "Nonprofit website · Responsive design · Information architecture · Brand presentation",
    tools: ["Web Development", "UI/UX", "Brand Identity", "Responsive Design"],
    platform: "Web",
    liveUrl: "https://zubairumustaphafoundation.org/",
    tags: ["Nonprofit", "Web Development", "UI/UX Design", "Brand Presentation"],
    details: "I designed and developed the website for the Zubairu Mustapha Foundation, creating a professional digital presence for an organization focused on empowering the boy child. The website was structured to present the foundation clearly, communicate its mission, and give its work a more accessible online presence. I focused on a clean visual system, intuitive navigation, responsive layouts, and a design that gives the organization a credible and modern identity online.",
    metric: "Live NGO Portal",
    isFeatured: true
  },
  {
    id: 5,
    title: "California Coast Real Estate",
    category: "UI Prototypes",
    shortDesc: "High-end coastal property platform with interactive viewport transitions.",
    tags: ["Figma", "UI/UX", "Interactive Web"],
    details: "Interactive production prototype showcasing layout hierarchy, fluid video framing, and responsive residential showcase mechanics.",
    metric: "60 FPS loop",
    isPrototype: true,
    prototypeSlug: "project-1"
  },
  {
    id: 6,
    title: "Brain Trainer Cognitive UI",
    category: "UI Prototypes",
    shortDesc: "Interactive neuro-cognitive training dashboard with 3D model interaction.",
    tags: ["3D UI", "Figma", "Motion"],
    details: "Interactive production prototype demonstrating spatial brain visualization, cognitive analytics widgets, and dark-mode aesthetic.",
    metric: "60 FPS loop",
    isPrototype: true,
    prototypeSlug: "project-2"
  },
  {
    id: 7,
    title: "Car Brands Showcase",
    category: "UI Prototypes",
    shortDesc: "Dynamic automotive manufacturer brand index with kinetic carousels.",
    tags: ["Automotive", "UI Motion", "Branding"],
    details: "Kinetic automotive portal showcasing brand indexing, typography, and interactive media scrubbers.",
    metric: "60 FPS loop",
    isPrototype: true,
    prototypeSlug: "car-brands-hero-section"
  },
  {
    id: 8,
    title: "Interactive 3D Robot Arm",
    category: "UI Prototypes",
    shortDesc: "Robotic industrial automation interface with real-time controls.",
    tags: ["Industrial 3D", "Kinematics", "UI"],
    details: "Kinetic interface prototype demonstrating industrial robotics controls, degrees of freedom visualization, and tactile feedback.",
    metric: "60 FPS loop",
    isPrototype: true,
    prototypeSlug: "robot-arm-project"
  },
  {
    id: 9,
    title: "Brand Launch & Kinetic Ad",
    category: "UI Prototypes",
    shortDesc: "High-impact brand launch sequence with layered parallax typography.",
    tags: ["Brand Experience", "Typography", "Motion"],
    details: "Dynamic advertising showcase highlighting motion pacing, bold typography, and cinematic branding.",
    metric: "60 FPS loop",
    isPrototype: true,
    prototypeSlug: "hero-section-a-brand-add"
  },
  {
    id: 10,
    title: "Interactive Mouse Physics Hero",
    category: "UI Prototypes",
    shortDesc: "Cursor-reactive kinetic physics interface with tactile depth feedback.",
    tags: ["Physics UI", "Micro-Interactions"],
    details: "Web design prototype exploring cursor kinematics, reactive particles, and responsive physics states.",
    metric: "60 FPS loop",
    isPrototype: true,
    prototypeSlug: "hero-section-with-hover-mouse-effects"
  },
  {
    id: 11,
    title: "Fintech & Wealth Experience",
    category: "UI Prototypes",
    shortDesc: "Modern wealth management dashboard with fluid transactional states.",
    tags: ["Fintech", "Dashboard", "UI/UX"],
    details: "Clean financial interface focusing on data density, monetary flow clarity, and premium neo-minimalist styling.",
    metric: "60 FPS loop",
    isPrototype: true,
    prototypeSlug: "project-7"
  },
  {
    id: 12,
    title: "Creative Media Studio Portal",
    category: "UI Prototypes",
    shortDesc: "Editorial portfolio interface for visual media artists and creators.",
    tags: ["Editorial", "Creative Tech", "Web Design"],
    details: "High-fashion creative agency layout featuring asymmetrical grids, media curation, and smooth scroll animations.",
    metric: "60 FPS loop",
    isPrototype: true,
    prototypeSlug: "project-8"
  }
];

interface ProjectCardProps {
  proj: typeof PROJECTS_DATA[0];
  pageInteractive: boolean;
  isMobile: boolean;
  isActiveMobile: boolean;
  onMobilePlayToggle: () => void;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  proj, 
  pageInteractive, 
  isMobile, 
  isActiveMobile, 
  onMobilePlayToggle, 
  onClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const slug = (proj as any).prototypeSlug || proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const staticImageSrc = `/images/thumbnails/${slug}.webp`;
  const animationSrc = `/images/animations/${slug}.webp`;

  const shouldPlay = isMobile ? isActiveMobile : isHovered;

  const handleCardClick = (e: React.MouseEvent) => {
    if ((proj as any).isPrototype && isMobile) {
      e.stopPropagation();
      onMobilePlayToggle();
    } else {
      onClick();
    }
  };

  return (
    <motion.div
      layout
      onMouseEnter={() => {
        if (!isMobile) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (!isMobile) setIsHovered(false);
      }}
      onClick={handleCardClick}
      className={`neu-out rounded-[2rem] md:rounded-[2.5rem] border border-white/60 p-4 md:p-6 group transition-all duration-300 w-full md:hover:shadow-[14px_14px_28px_#bebec9,-14px_-14px_28px_#ffffff] md:hover:-translate-y-2 active:scale-[0.98] active:shadow-inner cursor-pointer relative ${
        isMobile && isActiveMobile ? 'shadow-inner' : ''
      }`}
    >
      {/* Visual Media Showcase */}
      {(proj as any).isPrototype ? (
        <div className="w-full neu-in rounded-2xl md:rounded-3xl overflow-hidden relative p-1 border border-white/40 shadow-inner">
          <div className="w-full rounded-xl md:rounded-2xl overflow-hidden bg-[#e0e5ec] relative">
            <img 
              src={staticImageSrc} 
              alt={`${proj.title} Thumbnail`}
              className="w-full h-auto object-contain transition-opacity duration-500 relative z-10"
              style={{ 
                opacity: shouldPlay ? 0 : 1,
                display: 'block' 
              }}
            />
            {pageInteractive && (
              <img 
                src={animationSrc} 
                alt={`${proj.title} Animation`}
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 z-0"
                style={{ 
                  opacity: shouldPlay ? 1 : 0,
                  display: 'block'
                }}
              />
            )}
            {isMobile && (
              <div className="absolute top-3 right-3 z-20 flex gap-2">
                <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider flex items-center gap-1 ${
                  isActiveMobile 
                    ? 'bg-cyan-500 text-white animate-pulse' 
                    : 'bg-white/70 text-gray-600'
                }`}>
                  {isActiveMobile ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      Playing
                    </>
                  ) : (
                    <>
                      <Play size={8} fill="currentColor" />
                      Tap to Play
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : proj.id === 1 ? (
        /* Ludo NX Custom Card with Real Thumbnail */
        <div className="w-full aspect-[16/10] rounded-2xl md:rounded-3xl bg-[#0c1222] relative overflow-hidden group-hover:scale-[1.01] transition-transform duration-500 shadow-inner border border-indigo-500/30">
          <img 
            src="/images/thumbnails/ludo_nx_thumbnail.png"
            alt="Ludo NX Mobile Game"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-[#0c1222]/65 to-transparent"></div>
          
          <div className="relative z-10 p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1.5 rounded-xl text-[9px] font-mono font-bold uppercase tracking-wider bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                <Gamepad2 size={13} className="text-cyan-400 animate-pulse" /> Game Development
              </span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-400/30">
                Unity 3D · Mobile
              </span>
            </div>

            <div className="text-left my-auto py-2">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-syncopate tracking-tight uppercase flex items-center gap-2 drop-shadow-md">
                LUDO <span className="text-cyan-400">NX</span>
              </div>
              <p className="text-xs md:text-sm text-gray-200 font-medium line-clamp-2 mt-2 max-w-lg leading-relaxed drop-shadow">
                {proj.shortDesc}
              </p>
            </div>

            <div className="flex items-center justify-between text-[8.5px] font-mono text-gray-300 uppercase tracking-widest border-t border-white/20 pt-3">
              <span>Unity • C# • Figma • Mobile</span>
              <span className="text-cyan-300 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Deep Case Study <ChevronRight size={12} />
              </span>
            </div>
          </div>
        </div>
      ) : proj.id === 2 ? (
        /* Selah Bible App Custom Card */
        <div className="w-full aspect-[16/10] rounded-2xl md:rounded-3xl bg-[#12161f] relative overflow-hidden group-hover:scale-[1.01] transition-transform duration-500 shadow-inner border border-amber-500/30">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1.5 rounded-xl text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5 shadow-sm">
                <Smartphone size={13} className="text-amber-400" /> App Development
              </span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-xl border border-cyan-400/20">
                Mobile App
              </span>
            </div>

            <div className="text-left my-auto py-2 flex items-center gap-4 sm:gap-5">
              <img 
                src="/images/thumbnails/selah_thumbnail.png" 
                alt="Selah App Logo" 
                className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl object-contain shadow-lg border border-white/10 shrink-0 bg-white/5 p-1"
              />
              <div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-syncopate tracking-tight uppercase">
                  SELAH
                </div>
                <p className="text-xs md:text-sm text-gray-300 font-medium line-clamp-2 mt-1 max-w-md leading-relaxed">
                  {proj.shortDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[8.5px] font-mono text-gray-400 uppercase tracking-widest border-t border-white/10 pt-3">
              <span>Mobile Architecture • UI/UX • Typography</span>
              <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Case Study <ChevronRight size={12} />
              </span>
            </div>
          </div>
        </div>
      ) : proj.id === 3 ? (
        /* USH Community Custom Card */
        <div className="w-full aspect-[16/10] rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#060c1d] via-[#0b1633] to-[#040814] p-6 flex flex-col justify-between relative overflow-hidden group-hover:scale-[1.01] transition-transform duration-500 shadow-inner border border-blue-500/30">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex justify-between items-start">
            <span className="px-3 py-1.5 rounded-xl text-[9px] font-mono font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5 shadow-sm">
              <Briefcase size={13} className="text-blue-400" /> Client Work · Trading & Finance
            </span>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-400/20">
              20k+ Members
            </span>
          </div>

          <div className="relative z-10 text-left my-auto py-2">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-syncopate tracking-tight uppercase flex items-center gap-2">
              USH <span className="text-blue-400">COMMUNITY</span>
            </div>
            <p className="text-xs md:text-sm text-gray-300 font-medium line-clamp-2 mt-2 max-w-lg leading-relaxed">
              {proj.shortDesc}
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[8.5px] font-mono text-gray-400 uppercase tracking-widest border-t border-white/10 pt-3">
            <span>Responsive Web • UI/UX • Community Hub</span>
            <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Case Study & Live Site <ChevronRight size={12} />
            </span>
          </div>
        </div>
      ) : proj.id === 4 ? (
        /* Zubairu Mustapha Foundation Custom Card */
        <div className="w-full aspect-[16/10] rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#0c1f17] via-[#122e23] to-[#07130e] p-6 flex flex-col justify-between relative overflow-hidden group-hover:scale-[1.01] transition-transform duration-500 shadow-inner border border-emerald-500/30">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex justify-between items-start">
            <span className="px-3 py-1.5 rounded-xl text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5 shadow-sm">
              <Briefcase size={13} className="text-emerald-400" /> Client Work · Nonprofit NGO
            </span>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
              Live Foundation Portal
            </span>
          </div>

          <div className="relative z-10 text-left my-auto py-2">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-syncopate tracking-tight uppercase">
              ZUBAIRU MUSTAPHA <span className="text-emerald-400">FOUNDATION</span>
            </div>
            <p className="text-xs md:text-sm text-gray-300 font-medium line-clamp-2 mt-2 max-w-lg leading-relaxed">
              {proj.shortDesc}
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[8.5px] font-mono text-gray-400 uppercase tracking-widest border-t border-white/10 pt-3">
            <span>NGO Digital Presence • Boy Child Empowerment</span>
            <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Case Study & Live Site <ChevronRight size={12} />
            </span>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex justify-between items-center px-1">
        <div>
          <h4 className="text-xs md:text-sm font-bold text-gray-800 tracking-tight uppercase group-hover:text-cyan-600 transition-colors">{proj.title}</h4>
          <span className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-wider block mt-0.5">{proj.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-cyan-600 bg-white/60 border border-white/50 px-2.5 py-1 rounded-xl shadow-sm font-mono uppercase tracking-widest">{proj.metric}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  // Bento modals states
  const [activeBento, setActiveBento] = useState<string | null>(null);

  const scrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Portfolio filters state
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS_DATA[0] | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [activeMobileProjId, setActiveMobileProjId] = useState<number | null>(null);

  // Blog states
  const [blogSearch, setBlogSearch] = useState("");

  // AI Twin States
  const [aiTwinOpen, setAiTwinOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: "Hey there! I'm Josiah's AI Twin. Ask me anything about my game development work on Ludo NX, mobile apps like Selah, or our design and engineering process!"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Services Estimator States
  const [selectedServices, setSelectedServices] = useState<string[]>(["Full Website"]);
  const [pageCount, setPageCount] = useState(5);
  const [developerTier, setDeveloperTier] = useState<'junior' | 'mid'>('junior');
  const [customProposal, setCustomProposal] = useState("");
  const [generatingProposal, setGeneratingProposal] = useState(false);
  const [copiedProposal, setCopiedProposal] = useState(false);
  const [proposalLog, setProposalLog] = useState<string[]>([]);

  // Sound Synth States
  const [synthOscType, setSynthOscType] = useState<'sine' | 'square' | 'sawtooth' | 'triangle'>('sine');
  const [synthVolume, setSynthVolume] = useState(0.4);
  const [synthFilterFreq, setSynthFilterFreq] = useState(1200);
  const [synthLfoSpeed, setSynthLfoSpeed] = useState(6);
  const [synthLfoEnabled, setSynthLfoEnabled] = useState(false);
  const [activeSynthKey, setActiveSynthKey] = useState<string | null>(null);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(12).fill(1));

  // Generative Canvas States
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasAlgo, setCanvasAlgo] = useState<'waves' | 'particles' | 'fractal'>('waves');
  const [canvasSpeed, setCanvasSpeed] = useState(3);
  const [canvasComplexity, setCanvasComplexity] = useState(5);
  const [canvasSeed, setCanvasSeed] = useState(1);

  // Timeline / Picture filter States
  const [timelinePlayhead, setTimelinePlayhead] = useState(25);
  const [activeFilterPreset, setActiveFilterPreset] = useState("Teal & Orange");

  // Keyboard simulator state
  const [typewriterCode, setTypewriterCode] = useState("// Interactive development console...\n");
  const [activeKeyboardKey, setActiveKeyboardKey] = useState<string | null>(null);

  const [isZooming, setIsZooming] = useState(false);

  const [pageInteractive, setPageInteractive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const interactiveTimer = setTimeout(() => {
      setPageInteractive(true);
    }, 2000); // 2 second delay to let main critical assets render

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Smart bypass: If user is typing in active form inputs, ignore global glow triggers
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }
      const key = e.key.toUpperCase();
      if (key.length === 1 && key >= 'A' && key <= 'Z') {
        setActiveKeyboardKey(key);
        playSynthNote(261.63 + (key.charCodeAt(0) - 65) * 12, key);
        setTimeout(() => setActiveKeyboardKey(null), 120);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('keydown', handleGlobalKeyDown);
      clearTimeout(interactiveTimer);
    };
  }, []);

  // Lock body scroll when bento modals or project case studies are open
  useEffect(() => {
    if (activeBento || selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeBento, selectedProject]);


  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Generative Canvas animation loop
  useEffect(() => {
    if (activeBento !== 'canvas' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Create particles once for particle algo
    const particles: {x: number, y: number, vx: number, vy: number}[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += (canvasSpeed * 0.01);

      if (canvasAlgo === 'waves') {
        // Draw elegant flowing overlapping waves
        ctx.lineWidth = 2;
        for (let w = 0; w < canvasComplexity; w++) {
          ctx.beginPath();
          const hue = 180 + (w * 20); // Cyan/blue gradient
          ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${0.15 + (w * 0.05)})`;
          
          for (let x = 0; x < canvas.width; x++) {
            const angle = (x * 0.004 * (w + 1)) + time;
            const y = canvas.height / 2 + Math.sin(angle) * (50 + w * 15) * Math.cos(time * 0.2);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (canvasAlgo === 'particles') {
        // Interconnected dynamic particle matrix
        ctx.fillStyle = "rgba(74, 85, 104, 0.8)";
        particles.forEach((p, idx) => {
          p.x += p.vx * (canvasSpeed / 3);
          p.y += p.vy * (canvasSpeed / 3);

          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${190 + (idx % 3) * 30}, 80%, 55%, 0.6)`;
          ctx.fill();

          // Connect nearby particles
          for (let j = idx + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 100 * (canvasComplexity / 5)) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 * (1 - dist / (100 * (canvasComplexity / 5)))})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });
      } else if (canvasAlgo === 'fractal') {
        // Generates recursive botanical/fractal structure
        const drawBranch = (startX: number, startY: number, len: number, angle: number, branchWidth: number, depth: number) => {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          const endX = startX + Math.cos(angle) * len;
          const endY = startY + Math.sin(angle) * len;
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = `hsla(${140 + (depth * 25)}, 65%, ${40 + depth * 5}%, ${0.8 - depth * 0.08})`;
          ctx.lineWidth = branchWidth;
          ctx.stroke();

          if (depth >= canvasComplexity) return;

          // Branch off with subtle wind oscillation
          const wind = Math.sin(time + depth) * 0.05;
          drawBranch(endX, endY, len * 0.72, angle - 0.4 + wind, branchWidth * 0.7, depth + 1);
          drawBranch(endX, endY, len * 0.72, angle + 0.4 + wind, branchWidth * 0.7, depth + 1);
        };

        drawBranch(canvas.width / 2, canvas.height - 20, 80, -Math.PI / 2, 8, 1);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeBento, canvasAlgo, canvasSpeed, canvasComplexity, canvasSeed]);

  // Web Audio Synth trigger
  const playSynthNote = (freq: number, keyName: string) => {
    setActiveSynthKey(keyName);
    setTimeout(() => setActiveSynthKey(null), 300);

    // Dynamic bar heights visualizer feedback
    const activePulse = Array(12).fill(0).map(() => Math.floor(Math.random() * 4) + 1);
    setVisualizerBars(activePulse);
    setTimeout(() => setVisualizerBars(Array(12).fill(1)), 350);

    try {
      const ctx = getAudioContext();
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();
      
      osc.type = synthOscType;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      filterNode.frequency.setValueAtTime(synthFilterFreq, ctx.currentTime);
      
      // Envelope volume triggers
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(synthVolume, ctx.currentTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7); 
      
      if (synthLfoEnabled) {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = synthLfoSpeed;
        lfoGain.gain.value = 120; // depth
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        lfo.stop(ctx.currentTime + 0.7);
      }
      
      osc.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch (e) {
      console.warn("Audio Context blocked or failed:", e);
    }
  };

  // Keyboard typing simulator handler (unused backup)
  const handleKeySimulator = (char: string) => {
    setActiveKeyboardKey(char);
    setTimeout(() => setActiveKeyboardKey(null), 150);

    const snippets = [
      "const sessionCache = new RedisPool({ host: '127.0.0.1', port: 6379 });\n",
      "const modalTransition = { type: 'spring', stiffness: 260, damping: 25 };\n",
      "await processVideoQueue(jobs);\n",
      "const activePulse = Array(12).fill(0).map(() => Math.random());\n",
      "const audioCtx = getAudioContext();\n",
      "// Calibrating DaVinci Resolve Teal & Orange grading matrices...\n",
      "// Initializing parallel worker pool pipelines...\n"
    ];
    
    setTypewriterCode(prev => prev + snippets[Math.floor(Math.random() * snippets.length)]);
  };

  // AI Twin Send Message (Call Gemini API)
  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    if (!ai) {
      // Graceful offline mock logic for clean presentation if no key configured
      setTimeout(() => {
        setIsTyping(false);
        const reply = mockAIResponse(text);
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      }, 1000);
      return;
    }

    try {
      // Map existing messages to standard structures
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      // Append current message
      history.push({ role: 'user', parts: [{ text }] });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: text,
        config: {
          systemInstruction: JOSIAH_SYSTEM_INSTRUCTION,
          temperature: 0.75,
        }
      });

      setIsTyping(false);
      const reply = response.text || "I processed that concept, but let's re-align. How else can I help build your vision?";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error("Gemini API Twin failed:", error);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "My server neural node timed out! But rest assured, my stack is completely capable. To set up my live AI brain, ensure your active `.env.local` contains a valid `GEMINI_API_KEY`." 
      }]);
    }
  };

  
  // Mock responses for AI Twin when API key is missing
  const mockAIResponse = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes("ludo") || q.includes("game")) {
      return "Ludo NX is my flagship game development project built in Unity and C#! It features custom-designed visual assets, realistic dice physics, fluid turn progression, Lottie animations, and cross-platform multiplayer support.";
    }
    if (q.includes("selah") || q.includes("bible") || q.includes("app")) {
      return "Selah is a thoughtfully crafted Bible and spiritual reflection mobile application. I focused heavily on tranquil typography, serene aesthetic pacing, daily devotionals, and distraction-free mobile interaction design.";
    }
    if (q.includes("client") || q.includes("freelance") || q.includes("work")) {
      return "I've designed and delivered custom digital solutions for multiple companies and organizations—spanning high-conversion web portals, brand identity design systems, and responsive full-stack applications.";
    }
    if (q.includes("art") || q.includes("pencil") || q.includes("draw")) {
      return "My background includes over seven years of traditional pencil art! That foundational discipline shaped my eye for chiaroscuro, spatial tension, and composition, which directly influences my UI/UX design, 3D work in Blender, and game graphics.";
    }
    if (q.includes("stack") || q.includes("code") || q.includes("tech") || q.includes("tool")) {
      return "My core toolkit centers around Unity, C#, Blender, Figma, VS Code, Git, Photoshop, and React/TypeScript. I love connecting design and code into fluid, tactile experiences.";
    }
    return "I am Josiah's AI Twin! I'm focused on game development (like Ludo NX), mobile applications (like Selah), UI/UX design, and client engineering. Ask me anything about my process, projects, or background!";
  };

  // Filter projects helper
  const filteredProjects = PROJECTS_DATA.filter(p => {
    if (activeFilter === "All") return true;
    return p.category === activeFilter;
  });

  
  // Auto preset timelines configuration
  const applyPresetFilter = (presetName: string) => {
    setActiveFilterPreset(presetName);
    if (presetName === "Teal & Orange") setTimelinePlayhead(30);
    else if (presetName === "Sleek Grayscale") setTimelinePlayhead(100);
    else if (presetName === "Lofi Sunset") setTimelinePlayhead(65);
    else if (presetName === "Cyber Matrix") setTimelinePlayhead(5);
  };

  // Calculates active styles based on scrubber
  const getScrubberStyles = () => {
    if (activeFilterPreset === "Teal & Orange") {
      return { filter: `contrast(${105 + timelinePlayhead/4}%) saturate(${110 + timelinePlayhead/2}%) hue-rotate(5deg)` };
    }
    if (activeFilterPreset === "Sleek Grayscale") {
      return { filter: `grayscale(${timelinePlayhead}%) contrast(${100 + timelinePlayhead/5}%)` };
    }
    if (activeFilterPreset === "Lofi Sunset") {
      return { filter: `sepia(${timelinePlayhead * 0.7}%) saturate(${130 + timelinePlayhead}%) hue-rotate(340deg)` };
    }
    if (activeFilterPreset === "Cyber Matrix") {
      return { filter: `hue-rotate(120deg) saturate(${100 + timelinePlayhead}%) brightness(90%) contrast(120%)` };
    }
    return {};
  };

  return (
    <AnimatePresence>
      <div className="min-h-screen bg-[#e0e5ec] text-[#4a5568] selection:bg-gray-300 font-sans flex flex-col relative overflow-x-hidden font-medium">
        
        {/* Background Blobs */}
        <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-white rounded-full opacity-40 blur-[100px] blob-anim pointer-events-none" />
        <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-gray-300 rounded-full mix-blend-multiply opacity-20 blur-[100px] blob-anim pointer-events-none" style={{ animationDelay: '3s' }} />

        {/* NavBar */}
        <AnimatePresence>
          {!activeBento && !selectedProject && (
            <motion.nav 
              variants={fadeInSlideUp}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex justify-between items-center px-6 md:px-12 lg:px-20 py-4 md:py-6 max-w-[1600px] mx-auto relative z-20"
            >
              {/* Logo */}
              <div className="cursor-pointer group flex-shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <span className="font-syncopate text-lg md:text-xl font-bold tracking-[0.1em] text-gray-800 group-hover:text-cyan-600 transition-colors uppercase select-none">
                  Jay Jay
                </span>
              </div>

              {/* Links */}
              <div className="hidden md:flex flex-1 justify-evenly px-8 lg:px-24 text-xs font-semibold text-gray-500 tracking-wide">
                <a href="#about" onClick={scrollToAbout} className="neu-out px-5 py-3 rounded-xl hover:text-gray-900 transition-all hover:scale-105 active:scale-95 active:shadow-[inset_2px_2px_5px_#bebec9,inset_-2px_-2px_5px_#ffffff] neu-hover">About Me</a>
                <a href="#portfolio" className="neu-out px-5 py-3 rounded-xl hover:text-gray-900 transition-all hover:scale-105 active:scale-95 active:shadow-[inset_2px_2px_5px_#bebec9,inset_-2px_-2px_5px_#ffffff] neu-hover">Projects</a>
                <a href="#contact" className="neu-out px-5 py-3 rounded-xl hover:text-gray-900 transition-all hover:scale-105 active:scale-95 active:shadow-[inset_2px_2px_5px_#bebec9,inset_-2px_-2px_5px_#ffffff] neu-hover">Contact</a>
              </div>

              {/* Right CTA */}
              <div className="flex-shrink-0">
                 <a 
                   href="#contact"
                   className="neu-out px-6 py-3 rounded-xl text-xs font-bold text-gray-800 hover:text-cyan-600 transition-all flex items-center gap-2 group hover:scale-105 active:scale-95 active:shadow-[inset_2px_2px_5px_#bebec9,inset_-2px_-2px_5px_#ffffff] neu-hover cursor-pointer"
                 >
                    <Sparkles size={12} className="text-cyan-500 animate-pulse pointer-events-none" />
                    Contact
                 </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* HERO SECTION */}
        <section id="hero" className="w-full flex flex-col justify-start relative z-10 pt-2 lg:pt-4 pb-8">
                {/* Main Content Area */}
                <main className="flex-grow relative z-20 flex px-4 md:px-12 lg:px-20 max-w-[1600px] mx-auto w-full pt-0">
          
          {/* Vertical text (Left Edge) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:flex flex-col justify-between w-12 py-4 relative border-r border-[#bebec9]/30 mr-12 xl:mr-16 z-40"
          >
            <div className="absolute top-24 -left-16 origin-top-left -rotate-90 text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400 whitespace-nowrap">
              Game Dev • UI/UX • Software
            </div>
            <div className="absolute bottom-24 -left-2 origin-center -rotate-90 text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400">
              2026
            </div>
          </motion.div>

          {/* Inner Grid / Layout */}
          <div className="relative w-full flex-grow flex flex-col items-center justify-start pb-12 pt-0 lg:pt-4">
            
            {/* Top Name / Title */}
            <motion.div 
               variants={fadeInSlideUp}
               initial="initial"
               animate="animate"
               className="z-20 text-center mb-8 w-full pointer-events-auto flex flex-col items-center"
            >
               <h1 className="text-[1.65rem] xs:text-[2.2rem] sm:text-5xl md:text-[5rem] lg:text-[5.5rem] xl:text-[6.5rem] font-bold text-[#1a202c] tracking-tighter mb-2 leading-none font-syncopate break-words">
                 Josiah Johnmark
               </h1>
               <div className="flex items-center gap-4 mb-3">
                 <span className="hidden md:block w-8 h-[2px] bg-cyan-400/60" />
                 <p className="text-[10px] md:text-xs text-[#2d3748] font-black tracking-[0.3em] uppercase">
                   Game Developer • UI/UX Designer • Web & App Developer
                 </p>
                 <span className="hidden md:block w-8 h-[2px] bg-cyan-400/60" />
               </div>
               {/* Animated Tagline Accent */}
               <div className="mt-2 select-none">
                 <p className="text-[10px] md:text-xs font-black tracking-[0.3em] text-gray-400 uppercase font-mono">
                   Think it. <span className="text-cyan-500">Design it.</span> Build it.
                 </p>
               </div>
            </motion.div>

            {/* Expanded professional background floaters (Very low opacity for ambient background depth) */}
            <div className="absolute top-[10%] left-[2%] opacity-[0.05] text-cyan-500 hover:scale-110 transition-transform pointer-events-none select-none z-0 hidden lg:block">
              <Code size={48} className="animate-pulse" />
            </div>
            <div className="absolute top-[2%] right-[10%] opacity-[0.04] text-pink-500 hover:scale-110 transition-transform pointer-events-none select-none z-0 hidden lg:block">
              <Sparkles size={40} className="animate-pulse" />
            </div>
            <div className="absolute bottom-[35%] left-[4%] opacity-[0.04] text-purple-500 hover:scale-110 transition-transform pointer-events-none select-none z-0 hidden lg:block">
              <Palette size={44} className="animate-pulse" />
            </div>
            <div className="absolute bottom-[10%] right-[12%] opacity-[0.04] text-emerald-500 hover:scale-110 transition-transform pointer-events-none select-none z-0 hidden lg:block">
              <Database size={48} className="animate-pulse" />
            </div>
            <div className="absolute top-[40%] right-[32%] opacity-[0.03] text-indigo-500 hover:scale-110 transition-transform pointer-events-none select-none z-0 hidden lg:block">
              <Brain size={44} className="animate-pulse" />
            </div>
            <div className="absolute bottom-[20%] left-[30%] opacity-[0.04] text-amber-600 hover:scale-110 transition-transform pointer-events-none select-none z-0 hidden lg:block">
              <Cpu size={40} className="animate-pulse" />
            </div>
            <div className="absolute top-[22%] left-[45%] opacity-[0.03] text-sky-500 hover:scale-110 transition-transform pointer-events-none select-none z-0 hidden lg:block">
              <Globe size={44} className="animate-pulse" />
            </div>

            {/* Bento Grid */}
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="w-full max-w-[1300px] grid grid-cols-1 md:grid-cols-12 gap-4 xl:gap-6 relative z-10 px-0 md:px-4 xl:px-0 auto-rows-auto md:auto-rows-[160px] xl:auto-rows-[170px]"
            >
               {/* Card 1: Game Dev & Tech Stack */}
               <motion.div 
                 variants={fadeInSlideUp}
                 className="relative group col-span-12 md:col-span-4 lg:col-span-3 lg:row-span-1 rounded-[2rem] border border-white/80 neu-out overflow-hidden p-6 flex flex-col justify-between select-none bg-white/60 backdrop-blur-md transition-all duration-500"
               >
                  <div className="absolute top-[40%] left-[-20%] w-[140%] h-32 flex items-center justify-center opacity-20 select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">
                     <Activity className="w-full h-full text-cyan-400 blur-[2px]" strokeWidth={1} />
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full justify-between gap-2">
                     <div>
                       <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase mb-0.5 block">Game & App Engine</span>
                       <h3 className="text-lg font-bold text-gray-800 tracking-tight group-hover:text-cyan-600 transition-colors uppercase">Core Tech Stack</h3>
                     </div>
                     
                     {/* Game & Web Tech authentic SVG mini grid */}
                     <div className="flex gap-2 items-center justify-between py-1.5">
                        {/* Unity */}
                        <div className="w-8 h-8 rounded-xl neu-out bg-white flex items-center justify-center text-gray-900" title="Unity 3D">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                            <path d="M12 2L2 7.8v8.4L12 22l10-5.8V7.8L12 2zm0 3.3l6.5 3.8-3 1.7-6.5-3.8 3-1.7zm-2.6 4.5l6.5 3.8v5.8l-6.5-3.8V9.8zm-5 1.2l3-1.7v5.8l-3 1.7V11zm15.2 5.8l-3-1.7V9.3l3 1.7v5.8z"/>
                          </svg>
                        </div>
                        {/* C# */}
                        <div className="w-8 h-8 rounded-xl neu-out bg-white flex items-center justify-center text-[#68217a]" title="C#">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                            <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2zm0 2.3L5.34 8.15v7.7L12 19.7l6.66-3.85v-7.7L12 4.3z"/>
                            <path d="M13.2 9.5c-.5-.3-1.1-.4-1.8-.4-1.8 0-3 1.2-3 2.9s1.2 2.9 3 2.9c.7 0 1.3-.1 1.8-.4v-1.3c-.5.3-1 .4-1.5.4-1 0-1.6-.7-1.6-1.6s.6-1.6 1.6-1.6c.5 0 1 .1 1.5.4V9.5zm3.8 1.8h-1v-1h-1v1h-1v1h1v1h-1v1h1v1h1v-1h1v1h1v-1h1v-1h-1v-1h1v-1h-1zm-1 2h-1v-1h1v1z"/>
                          </svg>
                        </div>
                        {/* Blender */}
                        <div className="w-8 h-8 rounded-xl neu-out bg-white flex items-center justify-center text-[#ea7600]" title="Blender 3D">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                            <path d="M12.5 2a1.5 1.5 0 0 0-1.2 2.4l2.1 2.8-4.5-2.6a1.5 1.5 0 0 0-2.1.8 1.5 1.5 0 0 0 .6 2l4.8 2.8-5.3-.2a1.5 1.5 0 0 0-1.5 1.5c0 .8.6 1.5 1.5 1.5h1.2C6.9 14.2 6.5 15.6 6.5 17c0 3.9 3.1 7 7 7s7-3.1 7-7c0-3.4-2.4-6.2-5.6-6.8l.5-.7 1.8-2.4a1.5 1.5 0 0 0-.4-2.1 1.5 1.5 0 0 0-2.1.4l-1.9 2.5-.3-4.4A1.5 1.5 0 0 0 12.5 2zm1 11.5c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z"/>
                          </svg>
                        </div>
                        {/* React */}
                        <div className="w-8 h-8 rounded-xl neu-out bg-white flex items-center justify-center text-[#61dafb]" title="React & Web">
                          <svg viewBox="0 0 24 24" className="w-4 h-4">
                            <ellipse cx="12" cy="12" rx="3.5" ry="9" transform="rotate(30 12 12)" fill="none" stroke="#61dafb" strokeWidth="1.5"/>
                            <ellipse cx="12" cy="12" rx="3.5" ry="9" transform="rotate(90 12 12)" fill="none" stroke="#61dafb" strokeWidth="1.5"/>
                            <ellipse cx="12" cy="12" rx="3.5" ry="9" transform="rotate(150 12 12)" fill="none" stroke="#61dafb" strokeWidth="1.5"/>
                            <circle cx="12" cy="12" r="1.8" fill="#61dafb"/>
                          </svg>
                        </div>
                     </div>

                     <div className="border-t border-gray-300/40 pt-1.5 flex items-center justify-between text-[7px] font-extrabold text-gray-400 uppercase tracking-widest">
                       <span>Game loops, 3D physics & reactive UI</span>
                       <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                     </div>
                  </div>
               </motion.div>

               {/* Card 2: Visual Arts & 3D */}
               <motion.div 
                 variants={fadeInSlideUp}
                 className="relative group col-span-12 md:col-span-8 lg:col-span-4 lg:row-span-2 rounded-[2rem] border border-white/80 neu-out overflow-hidden p-6 flex flex-col select-none bg-white/60 backdrop-blur-md transition-all duration-500"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-pink-200/10"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-25 pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col h-full justify-between">
                     <div>
                       <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase mb-1 block">Art & Design Studio</span>
                       <h3 className="text-xl font-bold text-gray-800 tracking-tight group-hover:text-pink-500 transition-colors uppercase">Visual Arts & 3D</h3>
                     </div>
                     
                     <div className="flex-grow flex items-center justify-center relative py-6">
                        <div className="absolute w-28 h-28 neu-out rounded-full flex items-center justify-center z-10 left-[15%] group-hover:rotate-12 transition-transform drop-shadow-2xl ring-1 ring-white/60 bg-white/60 backdrop-blur-md">
                           <Palette size={52} className="text-pink-400 drop-shadow-sm pointer-events-none" strokeWidth={1.5} />
                        </div>
                        <div className="absolute w-14 h-14 neu-out rounded-2xl flex items-center justify-center z-20 right-[20%] group-hover:-rotate-12 transition-transform drop-shadow-xl ring-1 ring-white/80 bg-white/85">
                           <PenTool size={26} className="text-purple-500 pointer-events-none" />
                        </div>
                     </div>

                     <div className="border-t border-gray-300/40 pt-3">
                       <span className="text-[9.5px] font-extrabold text-gray-600 block uppercase tracking-widest flex justify-between items-center">
                         <span>7+ Years Fine Art & 3D Modeling</span>
                         <span className="text-[7.5px] font-bold text-pink-500 uppercase font-mono">Traditional & Digital</span>
                       </span>
                     </div>
                  </div>
               </motion.div>

               {/* Card 3: Interactive Motion & Media Pacing */}
               <motion.div 
                 variants={fadeInSlideUp}
                 className="relative group col-span-12 md:col-span-12 lg:col-span-5 lg:row-span-2 rounded-[2rem] border border-white/80 neu-out overflow-hidden p-6 flex flex-col select-none bg-white/60 backdrop-blur-md transition-all duration-500"
               >
                  <div className="relative z-10 flex flex-col h-full justify-between">
                     <div>
                       <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase mb-1 block">Kinetic Media & Pacing</span>
                       <h3 className="text-xl font-bold text-gray-800 tracking-tight group-hover:text-cyan-600 transition-colors uppercase">Motion & Game Cinematics</h3>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 flex-grow my-4">
                        {/* Media tools grid */}
                        <div className="flex flex-col justify-center gap-2.5">
                           <div className="flex gap-2">
                             <div className="w-9 h-9 rounded-xl neu-out bg-white flex items-center justify-center text-cyan-500" title="Video Dynamics"><Video size={18} /></div>
                             <div className="w-9 h-9 rounded-xl neu-out bg-white flex items-center justify-center text-purple-600" title="Film Editing"><Film size={18} /></div>
                           </div>
                           <div className="flex gap-2">
                             <div className="w-9 h-9 rounded-xl neu-out bg-white flex items-center justify-center text-rose-500" title="Visual Framing"><Camera size={18} /></div>
                             <div className="w-9 h-9 rounded-xl neu-out bg-white flex items-center justify-center text-gray-700" title="Color & Grading"><SlidersHorizontal size={18} /></div>
                           </div>
                        </div>

                        {/* Timeline UI Simulated */}
                        <div className="flex flex-col gap-2 justify-center">
                          <div className="w-full h-8 neu-out rounded-lg flex items-center px-3 bg-white/40 border border-white/50">
                            <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-red-500 border-b-4 border-b-transparent mr-2"></div>
                            <div className="flex-1 h-[2px] bg-gray-300 relative">
                               <div className="absolute top-1/2 left-[45%] w-3 h-3 bg-red-500 rounded-full -translate-y-1/2 shadow-md"></div>
                            </div>
                          </div>
                          <div className="w-full h-6 neu-out rounded-lg flex items-center px-2 bg-gray-100/50">
                            <div className="w-1/2 h-2 bg-cyan-300 rounded-sm mr-1"></div>
                            <div className="w-1/3 h-2 bg-pink-300 rounded-sm"></div>
                          </div>
                       </div>
                     </div>

                     <div className="pt-3 border-t border-gray-300/50 flex justify-between text-[8px] font-extrabold text-gray-500 uppercase tracking-widest">
                       <span>Dynamic Pacing & Rhythm</span>
                       <span>Keyframed Precision</span>
                     </div>
                  </div>
               </motion.div>
               
               {/* Card 4: Tools Used (Development Suite) */}
               <motion.div 
                 variants={fadeInSlideUp}
                 className="relative group col-span-12 md:col-span-4 lg:col-span-3 lg:row-span-1 rounded-[2rem] border border-white/80 neu-out overflow-hidden p-5 flex flex-col select-none bg-white/60 backdrop-blur-md transition-all duration-500"
               >
                  <ToolsUsedCard 
                    playSynthNote={playSynthNote}
                    setAiTwinOpen={setAiTwinOpen}
                    handleSendMessage={handleSendMessage}
                    isZooming={isZooming}
                  />
               </motion.div>

               {/* Card 5: Workflow Keyboard */}
               <motion.div 
                 variants={fadeInSlideUp}
                 className="relative group col-span-12 md:col-span-5 lg:col-span-4 lg:row-span-1 rounded-[2rem] border border-white/80 neu-out overflow-hidden p-5 flex flex-col select-none bg-white/60 backdrop-blur-md transition-all duration-500"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 to-purple-100/30"></div>
                  <div className="flex justify-between items-center mb-2 z-10">
                     <h3 className="text-lg font-bold text-gray-800 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">Workflow Keyboard</h3>
                     <span className="text-[7.5px] font-bold bg-indigo-100 px-2 py-0.5 rounded text-indigo-700 uppercase font-mono">Live Key Matrix</span>
                  </div>
                  <div className="mt-auto relative z-10 flex justify-center items-center py-0">
                     <div className="w-[110%] h-[72px] neu-out bg-white/80 rounded-xl rotate-[-3deg] drop-shadow-xl relative flex p-2 gap-1 flex-wrap content-start overflow-hidden pointer-events-auto">
                       {Array.from({length: 21}).map((_, i) => {
                         const char = String.fromCharCode(65 + i);
                         const isActive = activeKeyboardKey === char;
                         return (
                           <button 
                             key={i} 
                             onClick={(e) => {
                               e.stopPropagation();
                               playSynthNote(261.63 + i * 15, char);
                             }}
                             className={`w-6 h-6 neu-out bg-white rounded-md border border-gray-100 transition-all flex items-center justify-center text-[8.5px] font-mono font-black hover:bg-cyan-50 active:scale-90 pointer-events-auto cursor-pointer
                               ${isActive ? 'scale-90 shadow-inner bg-cyan-100 border-cyan-300 text-cyan-600 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'text-gray-600'}`}
                           >
                             {char}
                           </button>
                         );
                       })}
                       <div className="absolute -bottom-2 right-10 w-24 h-4 bg-fuchsia-400 blur-md opacity-60"></div>
                     </div>
                   </div>
                </motion.div>

               {/* Card 6: Ecosystem & Software Suite */}
               <motion.div 
                 variants={fadeInSlideUp}
                 className="relative group col-span-12 md:col-span-3 lg:col-span-3 lg:row-span-1 rounded-[2rem] border border-white/80 neu-out overflow-hidden p-5 flex flex-col justify-between transition-all duration-500 select-none bg-white/60 backdrop-blur-md"
               >
                  <div className="flex justify-between items-start w-full">
                     <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">Ecosystem</span>
                     <span className="text-[6.5px] font-bold bg-cyan-100 px-1.5 py-0.5 rounded text-cyan-700 uppercase font-mono">Production</span>
                  </div>
                  
                  {/* Dense grid of real design & game dev tool logos */}
                  <div className="flex flex-wrap gap-2 justify-center w-full py-1.5 pointer-events-none">
                     {/* Blender */}
                     <div className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#ea7600]" title="Blender">
                       <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12.5 2a1.5 1.5 0 0 0-1.2 2.4l2.1 2.8-4.5-2.6a1.5 1.5 0 0 0-2.1.8 1.5 1.5 0 0 0 .6 2l4.8 2.8-5.3-.2a1.5 1.5 0 0 0-1.5 1.5c0 .8.6 1.5 1.5 1.5h1.2C6.9 14.2 6.5 15.6 6.5 17c0 3.9 3.1 7 7 7s7-3.1 7-7c0-3.4-2.4-6.2-5.6-6.8l.5-.7 1.8-2.4a1.5 1.5 0 0 0-.4-2.1 1.5 1.5 0 0 0-2.1.4l-1.9 2.5-.3-4.4A1.5 1.5 0 0 0 12.5 2zm1 11.5c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z"/></svg>
                     </div>
                     {/* Unity */}
                     <div className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-900" title="Unity 3D">
                       <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2L2 7.8v8.4L12 22l10-5.8V7.8L12 2zm0 3.3l6.5 3.8-3 1.7-6.5-3.8 3-1.7zm-2.6 4.5l6.5 3.8v5.8l-6.5-3.8V9.8zm-5 1.2l3-1.7v5.8l-3 1.7V11zm15.2 5.8l-3-1.7V9.3l3 1.7v5.8z"/></svg>
                     </div>
                     {/* Figma */}
                     <div className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center" title="Figma">
                       <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M8 2h4v4H8a2 2 0 1 1 0-4z" fill="#F24E1E"/><path d="M12 2h4a2 2 0 1 1 0 4h-4V2z" fill="#FF7262"/><path d="M12 6h4a2 2 0 1 1 0 4h-4V6z" fill="#1ABCFE"/><path d="M8 6h4v4H8a2 2 0 1 1 0-4z" fill="#A259FF"/><path d="M8 10h4v4H8a2 2 0 1 1 0-4z" fill="#0ACF83"/><path d="M8 14h4v2a2 2 0 1 1-4 0v-2z" fill="#0ACF83"/></svg>
                     </div>
                     {/* VS Code */}
                     <div className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#007acc]" title="VS Code">
                       <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.5 2.2l-9.8 8.9L4.4 8 2 9.2l4.3 3.8L2 16.8 4.4 18l3.3-3.1 9.8 8.9c.7.6 1.8.4 2.2-.4.2-.3.3-.7.3-1.1V2.8c0-.9-.7-1.6-1.6-1.6-.3 0-.6.1-.9.3zM18 17.6l-6.8-5.6L18 6.4v11.2z"/></svg>
                     </div>
                     {/* Git */}
                     <div className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#f05032]" title="Git">
                       <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M21.7 10.3L13.7 2.3a2.4 2.4 0 0 0-3.4 0L8.2 4.4l3.1 3.1a2.1 2.1 0 0 1 2.6 2.6l3 3a2.1 2.1 0 1 1-1.3 1.2l-2.8-2.8v4.3a2.1 2.1 0 1 1-1.8 0v-4.5a2.1 2.1 0 0 1-1.1-2.7L6.8 5.7 2.3 10.3a2.4 2.4 0 0 0 0 3.4l8 8a2.4 2.4 0 0 0 3.4 0l8-8a2.4 2.4 0 0 0 0-3.4z"/></svg>
                     </div>
                     {/* Premiere */}
                     <div className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center" title="Premiere Pro">
                       <div className="w-4 h-4 rounded bg-[#00005b] text-[#ea77ff] font-bold text-[7px] flex items-center justify-center font-mono">Pr</div>
                     </div>
                  </div>

                  <div>
                     <span className="text-[9.5px] font-bold text-gray-800 block uppercase tracking-tight">Game & Software Suite</span>
                  </div>
               </motion.div>

               {/* Card 7: Creative Channels & Socials */}
               <motion.div 
                 variants={fadeInSlideUp}
                 className="relative group col-span-12 md:col-span-4 lg:col-span-2 lg:row-span-1 rounded-[2rem] border border-white/80 neu-out overflow-hidden p-5 flex flex-col justify-between select-none bg-white/60 backdrop-blur-md transition-all duration-500"
               >
                  <div className="flex justify-between items-start w-full">
                     <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">Socials</span>
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  </div>
                  
                  {/* Social Media Link Icons Grid */}
                  <div className="flex flex-wrap gap-2.5 justify-center py-1 pointer-events-auto">
                     <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-lg bg-white neu-out hover:scale-115 transition-transform flex items-center justify-center text-gray-700" onClick={e => e.stopPropagation()}><Github size={12} /></a>
                     <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-lg bg-white neu-out hover:scale-115 transition-transform flex items-center justify-center text-pink-500" onClick={e => e.stopPropagation()}><Instagram size={12} /></a>
                     <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-lg bg-white neu-out hover:scale-115 transition-transform flex items-center justify-center text-sky-500" onClick={e => e.stopPropagation()}><Twitter size={12} /></a>
                     <a href="mailto:josiahjohnmark9@gmail.com" className="w-6 h-6 rounded-lg bg-white neu-out hover:scale-115 transition-transform flex items-center justify-center text-red-500" onClick={e => e.stopPropagation()}><Mail size={12} /></a>
                  </div>
                  
                  <div className="text-left">
                     <span className="text-[9px] font-bold text-gray-800 block uppercase leading-none">Social Hub</span>
                     <span className="text-[7.5px] font-bold text-gray-400 block uppercase tracking-wider mt-0.5">Network Channels</span>
                  </div>
               </motion.div>

               {/* Card 8: Playable Piano Synth */}
               <motion.div 
                 variants={fadeInSlideUp}
                 className="relative group col-span-12 md:col-span-8 lg:col-span-3 lg:row-span-1 rounded-[2rem] border border-white/80 neu-out overflow-hidden p-5 flex flex-col justify-between select-none bg-white/60 backdrop-blur-md transition-all duration-500"
               >
                  <div className="flex justify-between items-start w-full">
                     <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">Audio Synth</span>
                     <span className="text-[6.5px] font-bold bg-cyan-100 px-1.5 py-0.5 rounded text-cyan-700 uppercase font-mono">Tactile</span>
                  </div>

                  {/* Neumorphic Mini piano strip */}
                  <div className="w-full flex justify-between h-9 bg-slate-200 rounded-lg p-0.5 shadow-inner gap-0.5 pointer-events-auto">
                     {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((n) => (
                       <button
                         key={n}
                         onClick={(e) => {
                           e.stopPropagation();
                           playSynthNote(261.63 + ['C', 'D', 'E', 'F', 'G', 'A', 'B'].indexOf(n) * 30, n);
                         }}
                         className="flex-1 bg-white hover:bg-cyan-50 rounded shadow-[0_1.5px_0_rgba(0,0,0,0.1)] active:scale-95 transition-transform text-[6.5px] font-black text-gray-400 flex items-end justify-center pb-0.5 select-none cursor-pointer"
                       >
                         {n}
                       </button>
                     ))}
                  </div>

                  <div className="w-full text-left flex items-end justify-between">
                     <div>
                       <span className="text-[10px] font-bold text-gray-800 block uppercase leading-tight group-hover:text-cyan-500 transition-colors">Tactile Piano</span>
                       <span className="text-[7.5px] font-bold text-gray-400 block uppercase leading-none tracking-wider">Rhodes audio tones</span>
                     </div>
                     <Music size={14} className="text-cyan-500 mb-1" />
                  </div>
               </motion.div>

            </motion.div>

          </div>
        </main>
        </section>

        {/* ABOUT ME SECTION */}
        <motion.section 
          id="about" 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="relative w-full py-12 lg:py-16 z-30 overflow-hidden border-t border-[#bebec9]/30 bg-[#e0e5ec]"
        >
          {/* Subtle Floating Background Icons */}
          <div className="absolute top-[10%] left-[8%] opacity-[0.03] text-cyan-600 rotate-[-12deg] pointer-events-none z-10 hidden md:block">
            <Code2 size={130} className="pointer-events-none" />
          </div>
          <div className="absolute top-[45%] right-[5%] opacity-[0.025] text-pink-600 rotate-[15deg] pointer-events-none z-10 hidden md:block">
            <Film size={160} className="pointer-events-none" />
          </div>
          <div className="absolute bottom-[8%] left-[22%] opacity-[0.03] text-[#f59e0b] rotate-[22deg] pointer-events-none z-10 hidden md:block">
            <Palette size={120} className="pointer-events-none" />
          </div>
          <div className="absolute top-[8%] right-[25%] opacity-[0.02] text-[#8b5cf6] rotate-[-20deg] pointer-events-none z-10 hidden md:block">
            <Coffee size={110} className="pointer-events-none" />
          </div>

          <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              
              {/* Left Column: Viewfinder camera frame */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
                className="lg:col-span-5 flex flex-col items-center"
              >
                 
                 {/* Clean Neumorphic Frame around the profile picture */}
                 <div className="relative w-full max-w-[360px] aspect-[4/5] rounded-[2.5rem] p-4 flex flex-col group overflow-hidden border border-white/50 bg-[#e0e5ec] shadow-[12px_12px_24px_#bebec9,-12px_-12px_24px_#ffffff] transition-all duration-500 hover:scale-[1.02]">
                    <div className="relative w-full h-full rounded-[2rem] overflow-hidden flex flex-col items-center justify-end border border-white/30 shadow-inner">
                       <img 
                          src="/josiah-profile.jpg?v=3" 
                          alt="Josiah Johnmark portrait"
                          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-[1.08] z-10"
                          style={{ 
                            WebkitUserDrag: 'none'
                          }}
                       />
                    </div>
                 </div>

                 {/* Monospace Name Tag directly below camera frame */}
                 <div className="mt-4 text-center select-none">
                   <h3 className="font-syncopate text-xs md:text-sm font-bold tracking-[0.25em] text-gray-800 uppercase">
                     Josiah Johnmark
                   </h3>
                   <span className="text-[8px] font-mono text-cyan-600 font-extrabold uppercase tracking-[0.15em] block mt-1.5">
                     GAME DEVELOPER • UI/UX DESIGNER • SOFTWARE ENGINEER
                   </span>
                 </div>

                 {/* Creative Studio Frequency & Status Stack */}
                 <div className="w-full max-w-[360px] flex flex-col items-center mt-6 gap-3.5">
                   {/* Audio Monitor Stack */}
                   <div className="flex items-center gap-1.5 h-10 px-5 py-1.5 neu-in rounded-full w-full border border-white/40">
                     <span className="text-[8px] font-mono text-gray-500 mr-2 uppercase tracking-widest font-bold">STUDIO FREQ:</span>
                     <div className="flex items-end gap-1 h-full flex-grow pb-1">
                       {Array.from({ length: 18 }).map((_, i) => (
                         <div 
                           key={i} 
                           className="w-1 bg-cyan-500 rounded-full bar-anim origin-bottom" 
                           style={{ 
                             height: `${20 + Math.sin(i * 0.4) * 15}%`,
                             animationDelay: `${i * 0.05}s`,
                             animationDuration: `${0.6 + Math.random() * 0.4}s`
                           }} 
                         />
                       ))}
                     </div>
                     <span className="text-[9px] font-mono text-cyan-600 font-extrabold ml-2">48 kHz</span>
                   </div>

                   {/* Discipline Focus Badges */}
                   <div className="grid grid-cols-2 gap-3 w-full">
                     <div className="flex items-center gap-2.5 bg-[#e0e5ec] p-3 rounded-2xl border border-white/50 shadow-[inset_2px_2px_5px_#bebec9,inset_-2px_-2px_5px_#ffffff]">
                       <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shrink-0"></div>
                       <div className="flex flex-col select-none">
                         <span className="text-[7px] font-mono text-gray-400 uppercase tracking-widest font-bold">FOCUS</span>
                         <span className="text-[9px] font-bold text-gray-700 tracking-tight">Game Dev & UI</span>
                       </div>
                     </div>
                     <div className="flex items-center gap-2.5 bg-[#e0e5ec] p-3 rounded-2xl border border-white/50 shadow-[inset_2px_2px_5px_#bebec9,inset_-2px_-2px_5px_#ffffff]">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                       <div className="flex flex-col select-none">
                         <span className="text-[7px] font-mono text-gray-400 uppercase tracking-widest font-bold">ORIGIN</span>
                         <span className="text-[9px] font-bold text-gray-700 tracking-tight">Traditional Art</span>
                       </div>
                     </div>
                   </div>
                 </div>
              </motion.div>

              {/* Right Column: Authentic Editorial Narrative */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                className="lg:col-span-7 flex flex-col justify-center"
              >
                {/* About Me Syncopate Header */}
                <div className="mb-6">
                  <h2 className="font-syncopate text-3xl md:text-5xl lg:text-6xl font-black text-[#1a202c] tracking-tight uppercase leading-none">
                    ABOUT ME
                  </h2>
                </div>

                {/* Editorial Story Card */}
                <div className="p-7 md:p-9 neu-out rounded-[2.5rem] border border-white/60 bg-[#e0e5ec] shadow-[12px_12px_24px_#bebec9,-12px_-12px_24px_#ffffff] space-y-5">
                  {/* Paragraph 1 */}
                  <p className="text-gray-900 text-lg md:text-xl font-bold tracking-tight leading-snug">
                    I’ve always been interested in making things.
                  </p>

                  {/* Paragraph 2 */}
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    My journey started with more than seven years of traditional pencil art and gradually expanded into photography, digital art, UI/UX and software development. What connects all of it is simple: <span className="font-bold text-gray-900">I like seeing ideas come to life.</span>
                  </p>

                  {/* Paragraph 3 */}
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    I enjoy taking something from imagination to something real — designing it, building it, experimenting with it and refining it along the way. That same process shapes how I learn: I research deeply, explore different approaches, learn through building and improve from every mistake.
                  </p>

                  {/* Paragraph 4 */}
                  <div className="border-l-2 border-cyan-500/40 pl-4 py-1">
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                      Today, I’m focused on game development and creative technology, combining my background in art, design and development to create interactive experiences. <span className="font-semibold text-gray-900">Ludo NX</span> is one example of that approach, bringing those disciplines together in a single project.
                    </p>
                  </div>

                  {/* Paragraph 5 */}
                  <div className="pt-2">
                    <p className="text-cyan-600 text-base md:text-lg font-bold font-mono tracking-wide">
                      I’m still learning. Still experimenting. Still building.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Projects Section Showcase */}
        <section id="portfolio" className="relative w-full py-12 lg:py-16 z-30 border-t border-[#bebec9]/30">
          <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#1a202c] tracking-tighter uppercase mb-2 font-syncopate select-none">
                  PROJECTS
                </h2>
                <p className="text-xs md:text-sm text-gray-500 font-semibold tracking-wider uppercase">
                  Games, mobile applications, client systems, and interactive UI prototypes
                </p>
              </div>

              {/* Tag filters */}
              <div className="flex flex-wrap gap-2 neu-in p-2 rounded-2xl self-start md:self-auto pointer-events-auto">
                {["All", "Game Dev", "Apps", "Client Work", "UI Prototypes"].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`text-[10px] font-bold py-2.5 px-5 rounded-xl uppercase transition-all cursor-pointer active:scale-95
                      ${activeFilter === filter 
                        ? 'bg-cyan-500 text-white shadow-inner' 
                        : 'hover:text-cyan-600'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid (Two-by-Two / Side-by-Side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
              {filteredProjects.slice(0, (showAllProjects || activeFilter !== "All") ? undefined : 4).map(proj => (
                <ProjectCard 
                  key={proj.id}
                  proj={proj}
                  pageInteractive={pageInteractive}
                  isMobile={isMobile}
                  isActiveMobile={activeMobileProjId === proj.id}
                  onMobilePlayToggle={() => {
                    if (activeMobileProjId === proj.id) {
                      setActiveMobileProjId(null);
                    } else {
                      setActiveMobileProjId(proj.id);
                    }
                  }}
                  onClick={() => setSelectedProject(proj)}
                />
              ))}
            </div>

            {/* See More Toggle */}
            {activeFilter === "All" && filteredProjects.length > 4 && (
              <div className="flex justify-center mt-16 lg:mt-24 w-full pointer-events-auto">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAllProjects(!showAllProjects)}
                  className="relative px-10 py-5 rounded-[2rem] font-bold text-xs md:text-sm text-white uppercase tracking-widest transition-all duration-300 cursor-pointer overflow-hidden shadow-[0_10px_25px_rgba(6,182,212,0.25)] border border-cyan-400/30 group"
                >
                  {/* Glowing background gradient */}
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 bg-[length:200%_auto] group-hover:bg-right transition-all duration-500 z-0" />
                  
                  {/* Outer light glow effect */}
                  <span className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-[2rem] blur opacity-30 group-hover:opacity-75 transition-opacity duration-300 -z-10" />

                  {/* Button content */}
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Sparkles size={14} className="text-cyan-200 animate-pulse" />
                    <span>{showAllProjects ? 'Show Less' : 'See More Projects'}</span>
                    <Plus 
                      size={14} 
                      className={`text-cyan-200 transition-transform duration-300 ${showAllProjects ? 'rotate-45' : 'group-hover:rotate-90'}`} 
                    />
                  </span>
                </motion.button>
              </div>
            )}
          </div>
        </section>

        <section id="contact" className="relative w-full py-12 lg:py-16 z-30 border-t border-[#bebec9]/30 bg-[#e0e5ec]">
          <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
            <div className="mb-8 text-center">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#1a202c] tracking-tighter uppercase mb-4 font-syncopate select-none">
                GET IN TOUCH
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-semibold tracking-wider uppercase max-w-xl mx-auto leading-relaxed">
                Have a vision? Let's build it step-by-step. Speak to my AI Twin, use the estimator, or contact me directly below.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-8">
              
              {/* Card 1: Email */}
              <a 
                href="mailto:josiahjohnmark9@gmail.com"
                className="neu-out rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/60 text-center flex flex-col items-center justify-between md:hover:shadow-[14px_14px_28px_#bebec9,-14px_-14px_28px_#ffffff] md:hover:-translate-y-1.5 active:scale-[0.98] active:shadow-inner transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full neu-in flex items-center justify-center text-cyan-500 mb-6 md:group-hover:scale-110 transition-transform">
                  <Mail size={24} className="pointer-events-none" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2 leading-none">Drop an email</span>
                  <h4 className="text-xs sm:text-sm font-black text-[#1a202c] tracking-tight group-hover:text-cyan-600 transition-colors break-all">
                    josiahjohnmark9@gmail.com
                  </h4>
                </div>
              </a>

              {/* Card 2: WhatsApp */}
              <a 
                href="https://wa.me/2347033223491"
                target="_blank"
                rel="noopener noreferrer"
                className="neu-out rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/60 text-center flex flex-col items-center justify-between md:hover:shadow-[14px_14px_28px_#bebec9,-14px_-14px_28px_#ffffff] md:hover:-translate-y-1.5 active:scale-[0.98] active:shadow-inner transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full neu-in flex items-center justify-center text-emerald-500 mb-6 md:group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} className="pointer-events-none" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2 leading-none">Instant WhatsApp Chat</span>
                  <h4 className="text-xs sm:text-sm font-black text-[#1a202c] tracking-tight group-hover:text-emerald-600 transition-colors">
                    +234 703 322 3491
                  </h4>
                </div>
              </a>

              {/* Card 3: Telegram */}
              <a 
                href="https://t.me/+2347033223491"
                target="_blank"
                rel="noopener noreferrer"
                className="neu-out rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/60 text-center flex flex-col items-center justify-between md:hover:shadow-[14px_14px_28px_#bebec9,-14px_-14px_28px_#ffffff] md:hover:-translate-y-1.5 active:scale-[0.98] active:shadow-inner transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full neu-in flex items-center justify-center text-blue-400 mb-6 md:group-hover:scale-110 transition-transform">
                  <Send size={24} className="pointer-events-none" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2 leading-none">Direct Telegram Node</span>
                  <h4 className="text-xs sm:text-sm font-black text-[#1a202c] tracking-tight group-hover:text-blue-500 transition-colors">
                    @josiahjohnmark9
                  </h4>
                </div>
              </a>

            </div>

            {/* Social Links & Copyright */}
            <div className="flex flex-col items-center justify-center border-t border-gray-300/40 pt-12 gap-8">
              <div className="flex gap-6">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full neu-out flex items-center justify-center text-gray-600 hover:text-cyan-600 hover:scale-105 active:scale-95 active:shadow-[inset_2px_2px_5px_#bebec9] transition-all"
                >
                  <Github size={20} />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full neu-out flex items-center justify-center text-gray-600 hover:text-pink-500 hover:scale-105 active:scale-95 active:shadow-[inset_2px_2px_5px_#bebec9] transition-all"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://x.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full neu-out flex items-center justify-center text-gray-600 hover:text-slate-900 hover:scale-105 active:scale-95 active:shadow-[inset_2px_2px_5px_#bebec9] transition-all"
                >
                  <Twitter size={20} />
                </a>
              </div>

              <div className="text-center select-none">
                <span className="font-syncopate text-xs md:text-sm font-bold tracking-[0.15em] text-gray-800 uppercase block mb-2">
                  Jay Jay
                </span>
                <span className="font-mono text-[8px] text-gray-400 tracking-[0.25em] block uppercase">
                  © 2026 JAY JAY // CORE STUDIO PORTFOLIO
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Float expandable AI Twin Widget */}
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end w-[calc(100vw-2rem)] sm:w-auto">
          
          {/* Main Expandable chat card */}
          <AnimatePresence>
            {aiTwinOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="w-full sm:w-[380px] h-[450px] sm:h-[480px] bg-[#e0e5ec]/95 border border-white/80 rounded-[2rem] sm:rounded-[2.5rem] shadow-[15px_15px_30px_#bebec9,-15px_-15px_30px_#ffffff] p-5 flex flex-col mb-4 overflow-hidden backdrop-blur-md relative"
              >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-300/50 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full border border-white bg-slate-300 overflow-hidden flex items-center justify-center shadow-inner">
                      <img src="/josiah-logo.svg" alt="Josiah Logo" className="w-[80%] h-[80%] object-contain" />
                      {/* Active green node indicator */}
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[#e0e5ec] animate-pulse"></div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1a202c] uppercase leading-none">Josiah's AI Twin</h4>
                      <span className="text-[8px] font-bold text-cyan-600 uppercase tracking-widest">Active Gemini node</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setAiTwinOpen(false)}
                    className="w-8 h-8 rounded-full neu-out flex items-center justify-center text-gray-500 hover:text-red-500 active:scale-90"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Dialog Messages list */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-3 mb-3 text-xs font-semibold leading-relaxed">
                  {messages.map((m, i) => (
                    <div 
                      key={i} 
                      className={`flex flex-col max-w-[85%] p-3 rounded-2xl shadow-sm border
                        ${m.role === 'user' 
                          ? 'bg-cyan-500 border-cyan-400 text-white self-end rounded-tr-none ml-auto' 
                          : 'bg-white/80 border-white/90 text-gray-700 self-start rounded-tl-none mr-auto'}`}
                    >
                      <span className="text-[7px] font-black uppercase tracking-wider mb-0.5 opacity-60">
                        {m.role === 'user' ? 'You' : 'Josiah AI'}
                      </span>
                      <p className="whitespace-pre-line leading-normal">{m.content}</p>
                    </div>
                  ))}

                  {/* Typing animation block */}
                  {isTyping && (
                    <div className="bg-white/80 border-white/90 text-gray-700 self-start rounded-2xl rounded-tl-none mr-auto max-w-[85%] p-3 flex items-center gap-1.5 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Query Chips Suggestions */}
                <div className="flex gap-1.5 overflow-x-auto pb-2 border-t border-gray-300/40 pt-2 select-none shrink-0 scrollbar-none">
                  {[
                    "Tell me about Ludo NX",
                    "What game dev tools do you use?",
                    "Tell me about Selah & your apps"
                  ].map(chip => (
                    <button
                      key={chip}
                      onClick={() => handleSendMessage(chip)}
                      className="text-[8px] font-bold text-gray-500 bg-white/60 hover:text-cyan-600 px-2 py-1.5 rounded-lg border border-white/70 whitespace-nowrap active:scale-95 shrink-0"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Input text send container */}
                <div className="flex gap-2 items-center shrink-0 mt-1">
                  <div className="flex-1 neu-in px-4 py-2.5 rounded-xl border border-white/50 flex items-center">
                    <input 
                      type="text"
                      placeholder="Ask Josiah's AI Twin..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="bg-transparent border-none outline-none text-xs w-full font-semibold text-gray-700 placeholder-gray-400"
                    />
                  </div>
                  <button
                    onClick={() => handleSendMessage()}
                    className="w-9 h-9 bg-cyan-500 text-white rounded-xl flex items-center justify-center hover:bg-cyan-400 transition-colors active:scale-90 shadow-md shrink-0"
                  >
                    <Send size={14} />
                  </button>
                </div>

                {/* Tiny offline/mock state indicator if API key is missing */}
                {!apiKey && (
                  <div className="absolute top-12 left-0 w-full bg-amber-500/10 border-b border-amber-500/20 text-amber-700 text-[7px] font-bold uppercase tracking-widest text-center py-1 flex items-center justify-center gap-1">
                    <AlertCircle size={8} /> Offline Mock Mode Active. Configure GEMINI_API_KEY to enable live AI.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Circle Button */}
          <button 
            onClick={() => setAiTwinOpen(!aiTwinOpen)}
            className="w-14 h-14 bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-cyan-400 transition-colors active:scale-90 md:hover:scale-105 z-50 border border-white/40 group relative"
          >
            {aiTwinOpen ? <X size={20} /> : <MessageSquare size={20} />}
            {/* Active green blinking dot on the bubble button */}
            <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
            </div>
            
            {/* Floating label tip */}
            <span className="absolute right-16 bg-slate-900 text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow pointer-events-none">
              Chat AI Twin
            </span>
          </button>

        </div>

        {/* Bento Modals AnimatePresence */}
        <AnimatePresence>
          {activeBento && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#e0e5ec]/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-[1000px] lg:max-w-5xl bg-[#e0e5ec] rounded-2xl border border-white/80 p-4 sm:p-6 md:p-8 shadow-[20px_20px_60px_#bebec9,-20px_-20px_60px_#ffffff] relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] overscroll-contain"
              >
                {/* Header close */}
                <div className="flex justify-between items-center mb-6 z-10">
                  <h2 className="text-xl font-bold uppercase tracking-widest text-[#1a202c] flex items-center gap-2">
                    <Sparkles size={16} className="text-cyan-500" />
                    {activeBento === 'synth' && "Playable Modular Synth"}
                    {activeBento === 'canvas' && "HTML5 Generative Art Canvas"}
                    {activeBento === 'creation' && "Cinematic Timeline Editor"}
                    {activeBento === 'tech' && "Core Technical Skillset"}
                  </h2>
                  <button 
                    onClick={() => setActiveBento(null)}
                    className="w-10 h-10 rounded-full neu-out flex items-center justify-center text-gray-600 hover:text-red-500 active:scale-90 active:shadow-[inset_2px_2px_5px_#bebec9]"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 z-10 space-y-6">
                  {/* Modals rendering */}
                  {activeBento === 'synth' && <PianoModal onClose={() => setActiveBento(null)} playSynthNote={playSynthNote} />}
                  {activeBento === 'canvas' && <VisualArtsModal onClose={() => setActiveBento(null)} playSynthNote={playSynthNote} />}
                  {activeBento === 'creation' && <ImageEditorModal onClose={() => setActiveBento(null)} playSynthNote={playSynthNote} />}
                  {activeBento === 'tech' && <WebStackModal onClose={() => setActiveBento(null)} playSynthNote={playSynthNote} />}
                  {activeBento === 'keyboard' && <KeyboardModal onClose={() => setActiveBento(null)} playSynthNote={playSynthNote} />}
                </div>

                {/* Background lighting blobs inside modal */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-cyan-300 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-pink-300 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Details Modal Drawer */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#e0e5ec]/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                className={`w-full bg-[#e0e5ec] rounded-[2rem] border border-white/80 p-4 sm:p-6 md:p-8 shadow-[20px_20px_60px_#bebec9,-20px_-20px_60px_#ffffff] relative transition-all duration-500 overflow-y-auto max-h-[95vh] md:max-h-[90vh] max-w-[1000px] lg:max-w-5xl overscroll-contain`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-600 uppercase tracking-widest block mb-1">
                      {selectedProject.id === 1 
                        ? 'GAME ARCHITECTURE · MOBILE TITLE'
                        : selectedProject.category === 'Client Work'
                        ? 'COMMERCIAL CLIENT PLATFORM'
                        : `${selectedProject.category} Case Study`}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a202c] font-syncopate tracking-tight uppercase">
                      {selectedProject.title}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="w-10 h-10 rounded-full neu-out flex items-center justify-center text-gray-600 hover:text-red-500 active:scale-90 active:shadow-[inset_2px_2px_5px_#bebec9] z-20 shrink-0 cursor-pointer"
                  >
                    <X size={18} className="pointer-events-none" />
                  </button>
                </div>

                {/* Body Content */}
                {selectedProject.id === 1 ? (
                  /* ==========================================================
                     LUDO NX DEDICATED DEEP CASE STUDY BREAKDOWN
                     Overview → Concept → My Role → UI/UX → Gameplay → Progression → Visual Design → Development → Final Result
                     ========================================================== */
                  <div className="space-y-8 text-gray-700">
                    
                    {/* Hero Showcase Image */}
                    <div className="w-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/80 neu-out bg-[#0c1222] relative p-2 shadow-inner">
                      <div className="w-full aspect-[16/9] rounded-xl md:rounded-2xl overflow-hidden relative shadow-md">
                        <img 
                          src="/images/thumbnails/ludo_nx_thumbnail.png" 
                          alt="Ludo NX Mobile Game Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-between items-end gap-2 text-white">
                          <div>
                            <span className="text-[8.5px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">Mobile Board Game Experience</span>
                            <h3 className="text-xl sm:text-2xl font-bold font-syncopate">LUDO NX</h3>
                          </div>
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-xl text-[9px] font-mono border border-white/30">
                            Unity 3D · C# · Mobile
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Specs Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="neu-in p-3 rounded-2xl">
                        <span className="text-[8px] font-mono text-gray-400 uppercase font-bold block">Role</span>
                        <span className="text-xs font-bold text-gray-800">Developer & Designer</span>
                      </div>
                      <div className="neu-in p-3 rounded-2xl">
                        <span className="text-[8px] font-mono text-gray-400 uppercase font-bold block">Platform</span>
                        <span className="text-xs font-bold text-gray-800">Mobile (iOS & Android)</span>
                      </div>
                      <div className="neu-in p-3 rounded-2xl">
                        <span className="text-[8px] font-mono text-gray-400 uppercase font-bold block">Board Format</span>
                        <span className="text-xs font-bold text-gray-800">15×15 Grid Mechanics</span>
                      </div>
                      <div className="neu-in p-3 rounded-2xl">
                        <span className="text-[8px] font-mono text-gray-400 uppercase font-bold block">Tools</span>
                        <span className="text-xs font-bold text-gray-800">Unity · Figma · Canva</span>
                      </div>
                    </div>

                    {/* 9-Part Case Study Flow */}
                    <div className="space-y-6">
                      
                      {/* 1. Overview */}
                      <div className="p-6 neu-out rounded-2xl bg-[#e0e5ec] border border-white/70 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-600 font-mono text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[9px]">1</span>
                          <span>Overview</span>
                        </div>
                        <h4 className="text-base font-bold text-gray-900">Reimagining Classic Board Play for Modern Mobile Gaming</h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                          {(selectedProject as any).caseStudy?.overview}
                        </p>
                      </div>

                      {/* 2. Concept */}
                      <div className="p-6 neu-out rounded-2xl bg-[#e0e5ec] border border-white/70 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-600 font-mono text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[9px]">2</span>
                          <span>Concept</span>
                        </div>
                        <h4 className="text-base font-bold text-gray-900">Competitive Pace & Tactical Board Space</h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                          {(selectedProject as any).caseStudy?.concept}
                        </p>
                      </div>

                      {/* 3. My Role */}
                      <div className="p-6 neu-out rounded-2xl bg-[#e0e5ec] border border-white/70 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-600 font-mono text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[9px]">3</span>
                          <span>My Role</span>
                        </div>
                        <h4 className="text-base font-bold text-gray-900">Solo End-to-End Game Development & Visual Leadership</h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                          {(selectedProject as any).caseStudy?.myRole}
                        </p>
                      </div>

                      {/* 4. UI/UX Design */}
                      <div className="p-6 neu-out rounded-2xl bg-[#e0e5ec] border border-white/70 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-600 font-mono text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[9px]">4</span>
                          <span>UI/UX Design</span>
                        </div>
                        <h4 className="text-base font-bold text-gray-900">Tactile Mobile Ergonomics & Tournament Pacing</h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                          {(selectedProject as any).caseStudy?.uiUx}
                        </p>
                      </div>

                      {/* 5. Gameplay Systems */}
                      <div className="p-6 neu-out rounded-2xl bg-[#e0e5ec] border border-white/70 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-600 font-mono text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[9px]">5</span>
                          <span>Gameplay Systems</span>
                        </div>
                        <h4 className="text-base font-bold text-gray-900">15×15 Grid Mechanics & Dynamic Turn Engine</h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                          {(selectedProject as any).caseStudy?.gameplay}
                        </p>
                      </div>

                      {/* 6. Progression & Economy */}
                      <div className="p-6 neu-out rounded-2xl bg-[#e0e5ec] border border-white/70 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-600 font-mono text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[9px]">6</span>
                          <span>Progression & In-Game Economy</span>
                        </div>
                        <h4 className="text-base font-bold text-gray-900">Rewards, Rankings, Customization & In-Game Shop</h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                          {(selectedProject as any).caseStudy?.progression}
                        </p>
                      </div>

                      {/* 7. Visual Design */}
                      <div className="p-6 neu-out rounded-2xl bg-[#e0e5ec] border border-white/70 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-600 font-mono text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[9px]">7</span>
                          <span>Visual Design</span>
                        </div>
                        <h4 className="text-base font-bold text-gray-900">High-Contrast Aesthetic, Particles & Micro-Animations</h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                          {(selectedProject as any).caseStudy?.visualDesign}
                        </p>
                      </div>

                      {/* 8. Development */}
                      <div className="p-6 neu-out rounded-2xl bg-[#e0e5ec] border border-white/70 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-600 font-mono text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[9px]">8</span>
                          <span>Development Architecture</span>
                        </div>
                        <h4 className="text-base font-bold text-gray-900">Unity & C# Modular State Machines</h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                          {(selectedProject as any).caseStudy?.development}
                        </p>
                      </div>

                      {/* 9. Final Result */}
                      <div className="p-6 neu-out rounded-2xl bg-gradient-to-br from-cyan-500/10 via-white/50 to-indigo-500/10 border border-cyan-400/40 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-600 font-mono text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[9px]">9</span>
                          <span>Final Result</span>
                        </div>
                        <h4 className="text-base font-bold text-gray-900">End-to-End Game Development Mastery</h4>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                          {(selectedProject as any).caseStudy?.finalResult}
                        </p>
                      </div>

                    </div>

                    {/* Screenshot Gallery */}
                    <div className="space-y-4 pt-4">
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                        <span>Production Game UI & Screens</span>
                        <span className="text-cyan-600">Figma & Unity In-Game Captures</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="neu-in p-2 rounded-2xl">
                          <img 
                            src="/images/ludo_nx/MATCH coundown (2).png" 
                            alt="Match Countdown Screen" 
                            className="w-full aspect-[4/3] object-cover rounded-xl shadow-sm"
                          />
                          <span className="text-[9px] font-mono text-gray-500 block text-center mt-1.5 font-bold">Match Countdown Screen</span>
                        </div>
                        <div className="neu-in p-2 rounded-2xl">
                          <img 
                            src="/images/ludo_nx/game result_page.png" 
                            alt="Game Result Summary Screen" 
                            className="w-full aspect-[4/3] object-cover rounded-xl shadow-sm"
                          />
                          <span className="text-[9px] font-mono text-gray-500 block text-center mt-1.5 font-bold">Game Result & Stat Board</span>
                        </div>
                        <div className="neu-in p-2 rounded-2xl">
                          <img 
                            src="/images/ludo_nx/friend_list_screen.png" 
                            alt="Friend List Screen" 
                            className="w-full aspect-[4/3] object-cover rounded-xl shadow-sm"
                          />
                          <span className="text-[9px] font-mono text-gray-500 block text-center mt-1.5 font-bold">Social & Friends Hub</span>
                        </div>
                        <div className="neu-in p-2 rounded-2xl">
                          <img 
                            src="/images/ludo_nx/freind_request_screen.png" 
                            alt="Friend Requests Screen" 
                            className="w-full aspect-[4/3] object-cover rounded-xl shadow-sm"
                          />
                          <span className="text-[9px] font-mono text-gray-500 block text-center mt-1.5 font-bold">Friend Requests UI</span>
                        </div>
                        <div className="neu-in p-2 rounded-2xl">
                          <img 
                            src="/images/ludo_nx/iPhone 16 & 17 Pro - 2 (1).png" 
                            alt="Mobile Frame View" 
                            className="w-full aspect-[4/3] object-cover rounded-xl shadow-sm"
                          />
                          <span className="text-[9px] font-mono text-gray-500 block text-center mt-1.5 font-bold">Mobile Viewport Framing</span>
                        </div>
                        <div className="neu-in p-2 rounded-2xl">
                          <img 
                            src="/images/thumbnails/ludo_nx_thumbnail.png" 
                            alt="Profile & Board Hub" 
                            className="w-full aspect-[4/3] object-cover rounded-xl shadow-sm"
                          />
                          <span className="text-[9px] font-mono text-gray-500 block text-center mt-1.5 font-bold">Player Profile & Customization</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center pt-2">
                      {selectedProject.tags.map(t => (
                        <span key={t} className="text-[9px] font-bold text-gray-800 neu-out px-3 py-1.5 rounded-lg border border-white/50">{t}</span>
                      ))}
                    </div>

                  </div>
                ) : selectedProject.category === 'Client Work' ? (
                  /* ==========================================================
                     CLIENT & FREELANCE PROJECT CASE STUDY
                     (USH Community & Zubairu Mustapha Foundation)
                     ========================================================== */
                  <div className="space-y-6 text-gray-700">
                    
                    {/* Live Website Header Card */}
                    <div className="p-6 md:p-8 neu-out rounded-2xl bg-[#e0e5ec] border border-white/80 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-[9px] font-mono uppercase font-bold text-cyan-600 tracking-widest block mb-1">
                            {(selectedProject as any).focus}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-syncopate">
                            {selectedProject.title}
                          </h3>
                        </div>
                        {(selectedProject as any).liveUrl && (
                          <a 
                            href={(selectedProject as any).liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(6,182,212,0.35)] hover:bg-cyan-400 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
                          >
                            Visit Live Platform <ExternalLink size={14} />
                          </a>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                        {selectedProject.details}
                      </p>
                    </div>

                    {/* Key Specs Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="neu-in p-4 rounded-2xl">
                        <span className="text-[8.5px] font-mono text-gray-400 uppercase font-bold block mb-1">My Role</span>
                        <span className="text-xs font-bold text-gray-800 block">{(selectedProject as any).role || 'UI/UX Design & Development'}</span>
                      </div>
                      <div className="neu-in p-4 rounded-2xl">
                        <span className="text-[8.5px] font-mono text-gray-400 uppercase font-bold block mb-1">Core Focus</span>
                        <span className="text-xs font-bold text-gray-800 block">{(selectedProject as any).focus || 'Web Systems & Architecture'}</span>
                      </div>
                      <div className="neu-in p-4 rounded-2xl">
                        <span className="text-[8.5px] font-mono text-gray-400 uppercase font-bold block mb-1">Platform Metric</span>
                        <span className="text-xs font-bold text-cyan-600 block">{selectedProject.metric}</span>
                      </div>
                    </div>

                    {/* Direct Live Preview Action */}
                    {(selectedProject as any).liveUrl && (
                      <div className="neu-out p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/70">
                        <div>
                          <h4 className="text-sm font-bold text-gray-800 uppercase font-syncopate">Explore Live Production Build</h4>
                          <span className="text-xs text-gray-500 font-mono">{(selectedProject as any).liveUrl}</span>
                        </div>
                        <a 
                          href={(selectedProject as any).liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-6 py-2.5 neu-in rounded-xl text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                        >
                          Launch in New Tab <ExternalLink size={12} />
                        </a>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 justify-center pt-2">
                      {selectedProject.tags.map(t => (
                        <span key={t} className="text-[9px] font-bold text-gray-800 neu-out px-3 py-1.5 rounded-lg border border-white/50">{t}</span>
                      ))}
                    </div>

                  </div>
                ) : (
                  /* ==========================================================
                     SELAH & UI PROTOTYPES VIEW
                     ========================================================== */
                  <div className="space-y-6 text-xs text-gray-600 font-semibold leading-relaxed">
                    
                    {/* Thumbnail / Media Preview if available */}
                    {(selectedProject as any).thumbnail && (
                      <div className="w-full rounded-2xl overflow-hidden border border-white/80 neu-out bg-[#e0e5ec] p-4 flex items-center justify-center">
                        <img 
                          src={(selectedProject as any).thumbnail} 
                          alt={selectedProject.title} 
                          className="max-h-48 object-contain rounded-xl shadow"
                        />
                      </div>
                    )}

                    <div className="p-5 neu-in rounded-2xl">
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-300/50 pb-2">Technical Overview</h4>
                      <p className="text-xs sm:text-sm text-gray-700 font-normal leading-relaxed">{selectedProject.details}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="neu-out p-4 rounded-xl text-center border border-white/60">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Efficiency Metric</span>
                        <span className="text-lg font-black text-cyan-600">{selectedProject.metric}</span>
                      </div>
                      <div className="neu-out p-4 rounded-xl text-center border border-white/60">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Production Grade</span>
                        <span className="text-lg font-black text-slate-700">60 FPS Responsive</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center pt-2">
                      {selectedProject.tags.map(t => (
                        <span key={t} className="text-[9px] font-bold text-gray-800 neu-out px-3 py-1.5 rounded-lg border border-white/50">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AnimatePresence>
  );
}
