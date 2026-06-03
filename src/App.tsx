import { 
  Code2, ArrowDown, Database, Server, Cloud, Code, Palette, 
  PenTool, Camera, Mic, Keyboard, Activity, Coffee, Headphones, 
  Film, Fingerprint, Network, Tablet, Video, SlidersHorizontal, 
  Smartphone, Lightbulb, Cpu, MessageSquare, Send, X, Play, 
  Square, Volume2, Sparkles, Check, Copy, Search, Calendar, Clock, 
  Plus, ChevronRight, Briefcase, RefreshCw, AlertCircle,
  Github, Instagram, Twitter, Mail, Globe, Brain, Music
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
You are the AI Twin of Josiah Johnmark, a creative and ideas-driven "Vibe Coder", digital artist, and professional video editor.
You speak in his voice: creative, highly disciplined, professional yet witty, and passionate about turning abstract concepts into tactile solutions.

Key Background Facts about Josiah:
- Roles: Full-stack engineer, digital artist, and video editor.
- Tech Stack: React, Next.js, Node.js, AWS, Postgres, Tailwind CSS, Framer Motion.
- Production Suite: Figma, Spline (3D), Adobe Premiere, Adobe Illustrator, Procreate.
- Philosophy: Values patience, steady progress, and high standards. Prefers engineering applications step-by-step to achieve high scalability and meaning. Avoids unethical shortcuts.
- Personal interests: Drawing, writing, painting, modular synthesizers, studying systems through video/board games, and sports strategy.
- Focus: "Vibe Coding" - rapid, creative, high-fidelity development where coding feels like making art or music.

Conversation Guidelines:
1. Speak in the first person ("I", "my") as Josiah's digital twin.
2. Keep answers concise, engaging, and professional yet creative.
3. If asked to write code, provide elegant, modern snippets.
4. Encourage collaboration and direct users to hire Josiah through the Services section or the Contact button!
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
// Preset projects data for portfolio
const PROJECTS_DATA = [
  {
    id: 1,
    title: "Luxurious Real Estate Hub",
    category: "Development",
    shortDesc: "High-performance properties search engine and showcase booking portal.",
    image: "/josiah-no-background.png",
    tags: ["React 19", "Neumorphic UI", "Vercel"],
    details: "Crafted a gorgeous, lightweight real estate sample app. Implements high-end bento listings, maps integration, and fluid search filters for property catalogs.",
    metric: "1.2s Page Load",
    iframeUrl: "https://real-estate-sample-website.vercel.app/"
  },
  {
    id: 2,
    title: "Skylite Aviation Portal",
    category: "Development",
    shortDesc: "Tactile private aviation schedule board and booking console.",
    image: "/josiah-no-background.png",
    tags: ["Vite", "Liquid Glass", "Framer Motion"],
    details: "Created an immersive schedule board and booking system for aircraft. Responsive mock dashboards let clients request flights with premium micro-interactions.",
    metric: "60 FPS Transitions",
    iframeUrl: "https://skylite-plane.vercel.app/"
  },
  {
    id: 3,
    title: "Premium Design Showcase",
    category: "Development",
    shortDesc: "Tactile digital landscape with dynamic theme modifiers and modular grids.",
    image: "/josiah-no-background.png",
    tags: ["Next.js 15", "Web Audio API", "Tailwind CSS"],
    details: "Engineered a high-fidelity interactive creative layout. Features dynamic backdrop-filter blur windows, modular interactive grids, and integrated background sound triggers.",
    metric: "99/100 Lighthouse",
    iframeUrl: "https://premium-web-design-sample.vercel.app/"
  }
];

interface ProjectCardProps {
  proj: typeof PROJECTS_DATA[0];
  setSelectedProject: React.Dispatch<React.SetStateAction<typeof PROJECTS_DATA[0] | null>>;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ proj, setSelectedProject }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log("Video play failed:", err));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const slug = proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const videoSrc = `/videos/${slug}.mp4`;

  return (
    <motion.div
      layout
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="neu-out rounded-[2.5rem] border border-white/60 p-6 md:p-8 flex flex-col lg:flex-row gap-8 group transition-all duration-300 w-full min-h-[50vh] lg:min-h-[60vh] justify-between items-stretch"
    >
      {/* Video / Image Preview Area */}
      <div 
        className="w-full lg:w-[55%] aspect-[16/10] neu-in rounded-3xl overflow-hidden relative p-1 border border-white/40 shadow-inner cursor-pointer flex-shrink-0" 
        onClick={() => setSelectedProject(proj)}
      >
        <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center relative">
          {/* Video element */}
          <video
            ref={videoRef}
            src={videoSrc}
            poster={proj.image}
            muted
            playsInline
            loop
            className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0 z-10"
          />

          {/* Static image fallback */}
          <img 
            src={proj.image} 
            alt={proj.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-105 z-0" 
          />
          
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
            <span className="text-white font-bold bg-cyan-600/90 px-4 py-2 rounded-xl text-xs backdrop-blur-sm shadow-lg">Playing Video Preview</span>
          </div>
        </div>
      </div>

      {/* Text Details Area */}
      <div className="flex-1 flex flex-col justify-between py-2 gap-4">
        <div className="space-y-3">
          <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest block">{proj.category}</span>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-[#1a202c] tracking-tight group-hover:text-cyan-600 transition-colors uppercase leading-tight">
            {proj.title}
          </h3>
          <p className="text-xs md:text-sm text-gray-600 font-semibold leading-relaxed">{proj.shortDesc}</p>
          <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed bg-white/40 border border-white/20 p-4 rounded-2xl font-medium">{proj.details}</p>
        </div>

        <div className="flex flex-col gap-4 border-t border-gray-300/40 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {proj.tags.map(t => (
              <span key={t} className="text-[9px] font-bold text-gray-600 neu-in px-3 py-1.5 rounded-lg">{t}</span>
            ))}
          </div>
          <div className="flex gap-3 items-center">
            <button 
              onClick={() => setSelectedProject(proj)}
              className="px-5 py-3 text-[10px] font-black uppercase rounded-xl neu-out hover:text-cyan-600 active:scale-95 transition-all text-center cursor-pointer pointer-events-auto"
            >
              Case Study
            </button>
            <div className="neu-out p-3 rounded-xl text-center border border-white/60 flex-1 flex justify-between items-center px-4 h-[42px]">
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Telemetry</span>
              <span className="text-xs font-black text-cyan-600">{proj.metric}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  // Bento modals states
  const [activeBento, setActiveBento] = useState<string | null>(null);

  // About Me Role Switcher Helpers
  const getPortraitFilter = () => {
    switch (activeRole) {
      case 'artist':
        return 'sepia(0.35) saturate(1.25) brightness(1.05) contrast(0.98) hue-rotate(-5deg)';
      case 'developer':
      case 'editor':
      default:
        return 'none';
    }
  };

  const getRoleStory = () => {
    switch (activeRole) {
      case 'developer':
        return {
          title: "01 / THE CODE CONVERSATION",
          brief: "Interview: AI-First Engineering & Autonomous Agent Systems",
          q1: "Q: What is your primary tool stack and development philosophy?",
          a1: "A: I construct clean, secure, and logical fullstack backends. Today, I'm an AI-first engineer harnessing Google Antigravity SDK, Google Flow, Claude Code, Google AI Studio, and Nano Banana nodes alongside advanced autonomous AI agent squads for my production workflows. I treat these tools as strategic multipliers—blending agentic prompt chaining with secure Node/Postgres backends to scale digital ideas rapidly.",
          q2: "Q: What does 'Vibe Coding' mean with agentic assistance?",
          a2: "A: It is high-fidelity, rapid production driven by automated AI agent swarms. It means orchestrating AI agents to generate structured codebases while I direct the architecture, transitions, and aesthetics as a creative conductor.",
          skills: ["Google Antigravity SDK", "Google Flow / AI Studio", "Claude Code / Agents", "Nano Banana / React"],
          pillars: "ANTIGRAVITY SDK // GOOGLE FLOW NODES // CLAUDE CODE"
        };
      case 'artist':
        return {
          title: "02 / THE AESTHETIC SESSION",
          brief: "Interview: Traditional Sketching, Chiaroscuro & Digital Systems",
          q1: "Q: What is the core of your drawing philosophy?",
          a1: "A: Traditional pencil sketch art is the root of my visual composition. I specialize in fine graphite drawing techniques, chiaroscuro shading contrast, museum-grade paper hatching, and traditional sketches. Fusing traditional pencil drawings with 3D digital coordinates creates a rich, physical visual tension.",
          q2: "Q: Why play audio synthesizers in a web application?",
          a2: "A: Because sound adds spatial dimension. Synthesizing custom audio waves using Web Audio API nodes proves the web browser is an immersive, multi-sensory canvas.",
          skills: ["Chiaroscuro Graphite", "Museum Paper Hatching", "Traditional Sketching", "Figma Art / Spline"],
          pillars: "GRAPHITE PORTRAITS // TRADITIONAL ART // HATCHING PIPELINES"
        };
      case 'editor':
      default:
        return {
          title: "03 / THE KINETIC DIALOGUE",
          brief: "Interview: Directing Cinematic Rhythm, Color Grades, and Pacing",
          q1: "Q: What does video editing bring to your digital engineering?",
          a1: "A: Pure rhythm and momentum. Premiere Pro and DaVinci Resolve taught me that interface transitions are cinematic frames. I direct attention through color telemetry, balanced motion curves, and steady pacing.",
          q2: "Q: How do you achieve high-production video value?",
          a2: "A: I grade with Teal & Orange LUTs, synchronize keyframed audios, and cut frame-accurately so that every visual transition holds strategic narrative meaning.",
          skills: ["Teal & Orange Grade", "Cinematic Kinetics", "DaVinci Resolve", "Timing Cuts"],
          pillars: "COLOR LUT PIPELINE // KEYFRAME KINETICS // CINEMATIC CUTS"
        };
    }
  };

  // Portfolio filters state
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS_DATA[0] | null>(null);

  // Blog states
  const [blogSearch, setBlogSearch] = useState("");

  // AI Twin States
  const [aiTwinOpen, setAiTwinOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: "Hey there! I'm Josiah's AI Twin. Ask me anything about my vibe coding projects, modular synth stacks, or video editing secrets!"
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
  const [typewriterCode, setTypewriterCode] = useState("// Press physical keys or click keys to Vibe Code...\n");
  const [activeKeyboardKey, setActiveKeyboardKey] = useState<string | null>(null);

  const [activeRole, setActiveRole] = useState<'developer' | 'artist' | 'editor'>('developer');
  const [isZooming, setIsZooming] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

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

  // Click scroll helper for About Me
  const scrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

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
    if (q.includes("synth") || q.includes("audio") || q.includes("sound")) {
      return "Ah, modular synthesizers! I love building custom sounds. Clicking my Modular Synth card in the grid opens a fully playable AudioContext engine right in this app! I use oscillators, frequency filters, and LFOs to create tactile auditory waves.";
    }
    if (q.includes("stack") || q.includes("code") || q.includes("tech") || q.includes("program")) {
      return "My core stack is built for high-performance scale: React 19, Next.js, and Node on the frontend/backend, backed by Postgres data storage and AWS server hosting. I call myself a 'vibe coder' because I build with design and motion flow fully integrated.";
    }
    if (q.includes("edit") || q.includes("video") || q.includes("film")) {
      return "Video is a key pillar of my creative work! I use Premiere Pro and DaVinci Resolve for professional cuts, color grading, and timing calibration. Try out my Creation card overlay in the bento grid—it lets you scrub a real timeline to adjust color filters on my picture!";
    }
    if (q.includes("hire") || q.includes("service") || q.includes("pricing") || q.includes("cost")) {
      return "I'd love to help build your next vision! Scroll down to my Services section to use the interactive scope estimator. You can adjust service categories and project urgency, and I'll generate a custom PDF/Markdown proposal for you instantly.";
    }
    return "I am a creator spanning engineering, art, and video production. I focus on high-fidelity designs, steady progress, and extreme discipline. Ask me about Vibe Coding, my tech tools, or how we can collaborate on a project!";
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
    else if (presetName === "Vibe Code Matrix") setTimelinePlayhead(5);
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
    if (activeFilterPreset === "Vibe Code Matrix") {
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
                <a href="#portfolio" className="neu-out px-5 py-3 rounded-xl hover:text-gray-900 transition-all hover:scale-105 active:scale-95 active:shadow-[inset_2px_2px_5px_#bebec9,inset_-2px_-2px_5px_#ffffff] neu-hover">Portfolio</a>
                <a href="#services" className="neu-out px-5 py-3 rounded-xl hover:text-gray-900 transition-all hover:scale-105 active:scale-95 active:shadow-[inset_2px_2px_5px_#bebec9,inset_-2px_-2px_5px_#ffffff] neu-hover">Services</a>
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
                <main className="flex-grow relative z-20 flex px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto w-full pt-0">
          
          {/* Vertical text (Left Edge) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:flex flex-col justify-between w-12 py-4 relative border-r border-[#bebec9]/30 mr-12 xl:mr-16 z-40"
          >
            <div className="absolute top-24 -left-16 origin-top-left -rotate-90 text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400 whitespace-nowrap">
              Product designer & Developer
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
               <h1 className="text-4xl sm:text-6xl md:text-[5rem] lg:text-[5.5rem] xl:text-[6.5rem] font-bold text-[#1a202c] tracking-tighter mb-2 leading-none font-syncopate">
                 Josiah Johnmark
               </h1>
               <div className="flex items-center gap-4 mb-3">
                 <span className="hidden md:block w-8 h-[2px] bg-cyan-400/60" />
                 <p className="text-[10px] md:text-xs text-[#2d3748] font-black tracking-[0.3em] uppercase">
                   Fullstack AI Developer
                 </p>
                 <span className="hidden md:block w-8 h-[2px] bg-cyan-400/60" />
               </div>
               <div className="flex justify-center items-center mb-4">
                 <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-cyan-600 bg-white/50 border border-cyan-300/40 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),2px_2px_5px_rgba(0,0,0,0.05)] font-syncopate hover:scale-105 active:scale-95 transition-transform duration-300 cursor-default select-none">
                   Vibe Coder
                 </span>
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
              className="w-full max-w-[1300px] grid grid-cols-1 md:grid-cols-12 gap-4 xl:gap-6 relative z-10 px-4 xl:px-0 auto-rows-auto md:auto-rows-[160px] xl:auto-rows-[170px]"
            >
               {/* Card 1: Web Stack (Core Ecosystem) */}
               <motion.div 
                 variants={fadeInSlideUp}
                 onClick={() => setActiveBento('tech')}
                 className={`relative group col-span-12 md:col-span-4 lg:col-span-3 lg:row-span-1 rounded-[2rem] border border-white/80 neu-out overflow-hidden p-6 flex flex-col justify-between hover:-translate-y-2 cursor-pointer transition-all duration-500 ${isZooming ? 'bg-white/95' : 'bg-white/60 backdrop-blur-md'}`}
               >
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-cyan-500/10 text-cyan-600 px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 z-10">
                     <Sparkles size={8} /> Interactive Graph
                  </div>
                  <div className="absolute top-[40%] left-[-20%] w-[140%] h-32 flex items-center justify-center opacity-25 select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">
                     <Activity className="w-full h-full text-cyan-400 blur-[2px]" strokeWidth={1} />
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full justify-between gap-2">
                     <div>
                       <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase mb-0.5 block">Web Stack</span>
                       <h3 className="text-lg font-bold text-gray-800 tracking-tight group-hover:text-cyan-600 transition-colors uppercase">Core Ecosystem</h3>
                     </div>
                     
                     {/* Web Tech custom SVG mini grid */}
                     <div className="flex gap-2 items-center justify-between py-1.5">
                        <div className="w-7 h-7 rounded-lg neu-out bg-white flex items-center justify-center text-[#61dafb]" title="React"><Code2 size={16} /></div>
                        <div className="w-7 h-7 rounded-lg neu-out bg-white flex items-center justify-center text-gray-800 font-extrabold text-[10px]" title="Next.js">N</div>
                        <div className="w-7 h-7 rounded-lg neu-out bg-white flex items-center justify-center text-[#339933]" title="Node.js"><Server size={14} /></div>
                        <div className="w-7 h-7 rounded-lg neu-out bg-white flex items-center justify-center text-[#336791]" title="PostgreSQL"><Database size={14} /></div>
                     </div>

                     <div className="border-t border-gray-300/40 pt-1.5 flex items-center justify-between text-[7px] font-extrabold text-gray-400 uppercase tracking-widest">
                       <span>Click to view dependency tree</span>
                       <ChevronRight size={8} className="text-cyan-500" />
                     </div>
                  </div>
               </motion.div>

               {/* Card 2: Visual Arts */}
               <motion.div 
                 variants={fadeInSlideUp}
                 onClick={() => setActiveBento('canvas')}
                 className={`relative group col-span-12 md:col-span-8 lg:col-span-4 lg:row-span-2 rounded-[2rem] border border-white/80 neu-out overflow-hidden p-6 flex flex-col hover:-translate-y-2 cursor-pointer transition-all duration-500 ${isZooming ? 'bg-white/95' : 'bg-white/60 backdrop-blur-md'}`}
               >
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-pink-500/10 text-pink-600 px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 z-20">
                     <Sparkles size={8} /> Drawing Studio
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-pink-200/10"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 group-hover:opacity-45 transition-opacity duration-500 pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col h-full justify-between">
                     <div>
                       <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase mb-1 block">Production Suite</span>
                       <h3 className="text-xl font-bold text-gray-800 tracking-tight group-hover:text-pink-500 transition-colors uppercase">Visual Arts</h3>
                     </div>
                     
                     <div className="flex-grow flex items-center justify-center relative py-6">
                        <div className={`absolute w-28 h-28 neu-out rounded-full flex items-center justify-center z-10 left-[15%] group-hover:rotate-12 transition-transform drop-shadow-2xl ring-1 ring-white/60 ${isZooming ? 'bg-white/95' : 'bg-white/60 backdrop-blur-md'}`}>
                           <Palette size={52} className="text-pink-400 drop-shadow-sm pointer-events-none" strokeWidth={1.5} />
                        </div>
                        <div className={`absolute w-14 h-14 neu-out rounded-2xl flex items-center justify-center z-20 right-[20%] group-hover:-rotate-12 transition-transform drop-shadow-xl ring-1 ring-white/80 ${isZooming ? 'bg-white/95' : 'bg-white/85'}`}>
                           <PenTool size={26} className="text-purple-500 pointer-events-none" />
                        </div>
                     </div>

                     <div className="border-t border-gray-300/40 pt-3">
                       <span className="text-[9.5px] font-extrabold text-gray-600 block uppercase tracking-widest flex justify-between items-center">
                         <span>Sketchpad, Pen & brushes</span>
                         <span className="text-[7.5px] font-bold text-pink-500 uppercase">Draw live</span>
                       </span>
                     </div>
                  </div>
               </motion.div>

               {/* Card 3: Creation & Filter Scrubber */}
               <motion.div 
                 variants={fadeInSlideUp}
                 onClick={() => setActiveBento('creation')}
                 className={`relative group col-span-12 md:col-span-12 lg:col-span-5 lg:row-span-2 rounded-[2rem] border border-white/80 neu-out overflow-hidden p-6 flex flex-col hover:-translate-y-2 cursor-pointer transition-all duration-500 ${isZooming ? 'bg-white/95' : 'bg-white/60 backdrop-blur-md'}`}
               >
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-cyan-500/10 text-cyan-600 px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 z-20">
                     <Sparkles size={8} /> Cinematic Grades
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full justify-between">
                     <div>
                       <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase mb-1 block">Timeline Editor</span>
                       <h3 className="text-xl font-bold text-gray-800 tracking-tight group-hover:text-cyan-600 transition-colors uppercase">Creation & Filter Scrubber</h3>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 flex-grow my-4">
                        {/* Film icons grid area */}
                        <div className="flex flex-col justify-center gap-2.5">
                           <div className="flex gap-2">
                             <div className="w-9 h-9 rounded-xl neu-out bg-white flex items-center justify-center text-cyan-500" title="CapCut"><Video size={18} /></div>
                             <div className="w-9 h-9 rounded-xl neu-out bg-white flex items-center justify-center text-purple-600" title="Adobe Premiere"><Film size={18} /></div>
                           </div>
                           <div className="flex gap-2">
                             <div className="w-9 h-9 rounded-xl neu-out bg-white flex items-center justify-center text-rose-500" title="Camera"><Camera size={18} /></div>
                             <div className="w-9 h-9 rounded-xl neu-out bg-white flex items-center justify-center text-gray-700" title="Color Wheels"><SlidersHorizontal size={18} /></div>
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
                       <span>Resolve color grades</span>
                       <span>Click to edit portrait</span>
                     </div>
                  </div>
               </motion.div>
               
               {/* Card 4: Tools Used (Replaces old Infra) */}
               <motion.div 
                 variants={fadeInSlideUp}
                 className={`relative group col-span-12 md:col-span-4 lg:col-span-3 lg:row-span-1 rounded-[2rem] border border-white/80 neu-out overflow-hidden p-5 flex flex-col hover:-translate-y-2 cursor-pointer transition-all duration-500 ${isZooming ? 'bg-white/95' : 'bg-white/60 backdrop-blur-md'}`}
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
                 onClick={() => setActiveBento('keyboard')}
                 className={`relative group col-span-12 md:col-span-5 lg:col-span-4 lg:row-span-1 rounded-[2rem] border border-white/80 neu-out overflow-hidden p-5 flex flex-col hover:-translate-y-2 cursor-pointer transition-all duration-500 ${isZooming ? 'bg-white/95' : 'bg-white/60 backdrop-blur-md'}`}
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 to-purple-100/30"></div>
                  <div className="flex justify-between items-center mb-2 z-10">
                     <h3 className="text-lg font-bold text-gray-800 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">Workflow Keyboard</h3>
                     <span className="text-[7.5px] font-bold bg-indigo-100 px-2 py-0.5 rounded text-indigo-700 uppercase">Live LED matrix</span>
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
                               setActiveBento('keyboard');
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

               {/* Card 6: Tools Used */}
               <motion.div 
                 variants={fadeInSlideUp}
                 className={`relative group col-span-12 md:col-span-3 lg:col-span-3 lg:row-span-1 rounded-[2rem] border border-white/80 neu-out overflow-hidden p-5 flex flex-col justify-between transition-all duration-500 select-none ${isZooming ? 'bg-white/95' : 'bg-white/60 backdrop-blur-md'}`}
               >
                  <div className="flex justify-between items-start w-full">
                     <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">Tools Used</span>
                     <span className="text-[6.5px] font-bold bg-pink-100 px-1.5 py-0.5 rounded text-pink-700 uppercase">Hub</span>
                  </div>
                  
                  {/* Dense grid of design & development tool tags */}
                  <div className="flex flex-wrap gap-2 justify-center w-full py-1.5 pointer-events-none">
                     <div className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-rose-500 font-black text-[9px]" title="Figma">F</div>
                     <div className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-cyan-500 font-black text-[9px]" title="Spline">Spl</div>
                     <div className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-sky-600 font-black text-[9px]" title="VS Code">VS</div>
                     <div className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-500 font-black text-[9px]" title="DaVinci Resolve">Dr</div>
                     <div className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-purple-600 font-black text-[9px]" title="Premiere Pro">Pr</div>
                     <div className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 font-black text-[9px]" title="Git">Git</div>
                  </div>

                  <div>
                     <span className="text-[9.5px] font-bold text-gray-800 block uppercase tracking-tight">Vibe Coders Hub</span>
                  </div>
               </motion.div>

               {/* Card 7: Creative Channels & Socials */}
               <motion.div 
                 variants={fadeInSlideUp}
                 onClick={() => {
                   playSynthNote(523.25, 'socialSuite');
                 }}
                 className={`relative group col-span-12 md:col-span-4 lg:col-span-2 lg:row-span-1 rounded-[2rem] border border-white/80 neu-out overflow-hidden p-5 flex flex-col justify-between hover:-translate-y-2 cursor-pointer transition-all duration-500 ${isZooming ? 'bg-white/95' : 'bg-white/60 backdrop-blur-md'}`}
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
                     <span className="text-[7.5px] font-bold text-gray-400 block uppercase tracking-wider mt-0.5">Network Nodes</span>
                  </div>
               </motion.div>

               {/* Card 8: Playable Piano Synth */}
               <motion.div 
                 variants={fadeInSlideUp}
                 onClick={() => setActiveBento('synth')}
                 className={`relative group col-span-12 md:col-span-8 lg:col-span-3 lg:row-span-1 rounded-[2rem] border border-white/80 neu-out overflow-hidden p-5 flex flex-col justify-between hover:-translate-y-2 cursor-pointer transition-all duration-500 ${isZooming ? 'bg-white/95' : 'bg-white/60 backdrop-blur-md'}`}
               >
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-cyan-500/10 text-cyan-600 px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 z-20">
                     <Sparkles size={8} /> Play Keys
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
                         className="flex-1 bg-white hover:bg-cyan-50 rounded shadow-[0_1.5px_0_rgba(0,0,0,0.1)] active:scale-95 transition-transform text-[6.5px] font-black text-gray-400 flex items-end justify-center pb-0.5 select-none"
                       >
                         {n}
                       </button>
                     ))}
                  </div>

                  <div className="w-full text-left flex items-end justify-between">
                     <div>
                       <span className="text-[10px] font-bold text-gray-800 block uppercase leading-tight group-hover:text-cyan-500 transition-colors">Tactile Piano</span>
                       <span className="text-[7.5px] font-bold text-gray-400 block uppercase leading-none tracking-wider">Play Rhodes tones</span>
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
                   <span className="text-[7px] font-mono text-cyan-600 font-extrabold uppercase tracking-[0.2em] block mt-1">
                     SYSTEMS INTEGRATION // R-018
                   </span>
                 </div>

                 {/* Creative Dials & Decibel Frequency Stack */}
                 <div className="w-full max-w-[360px] flex flex-col items-center mt-6 gap-3.5">
                   {/* Audio Monitor Stack */}
                   <div className="flex items-center gap-1.5 h-10 px-5 py-1.5 neu-in rounded-full w-full border border-white/40">
                     <span className="text-[8px] font-mono text-gray-500 mr-2 uppercase tracking-widest font-bold">AUDIO FREQ:</span>
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
                     <span className="text-[9px] font-mono text-cyan-600 font-extrabold ml-2">60%</span>
                   </div>

                   {/* Tactile knobs */}
                   <div className="flex gap-4 items-center justify-between w-full">
                     <div className="flex-1 flex items-center gap-3 bg-[#e0e5ec] p-2.5 rounded-2xl border border-white/50 shadow-[inset_2px_2px_5px_#bebec9,inset_-2px_-2px_5px_#ffffff] interactive-item neu-hover">
                       <div 
                         className="w-8 h-8 rounded-full bg-[#e0e5ec] shadow-[3px_3px_6px_#bebec9,-3px_-3px_6px_#ffffff] flex items-center justify-center relative cursor-pointer active:scale-95 transition-all"
                         onClick={() => {
                           const roles = ['developer', 'artist', 'editor'] as const;
                           const nextIndex = (roles.indexOf(activeRole) + 1) % 3;
                           setActiveRole(roles[nextIndex]);
                         }}
                       >
                         <div 
                           className="w-1 h-3 bg-cyan-500 rounded-full absolute top-0.5 transition-transform duration-300 origin-bottom pointer-events-none"
                           style={{
                             transform: activeRole === 'developer' ? 'rotate(0deg)' : activeRole === 'artist' ? 'rotate(-60deg)' : 'rotate(60deg)'
                           }}
                         />
                         <div className="w-2.5 h-2.5 rounded-full bg-white/40 shadow-inner pointer-events-none"></div>
                       </div>
                       <div className="flex flex-col select-none">
                         <span className="text-[7px] font-mono text-gray-400 uppercase tracking-widest leading-none mb-1 font-bold">GAIN LEVEL</span>
                         <span className="text-[9px] font-black text-gray-700 uppercase tracking-wider font-mono">
                           {activeRole === 'developer' ? 'Cyber' : activeRole === 'artist' ? 'Lofi' : 'Mono'}
                         </span>
                       </div>
                     </div>

                     <div className="flex-1 flex items-center gap-3 bg-[#e0e5ec] p-2.5 rounded-2xl border border-white/50 shadow-[inset_2px_2px_5px_#bebec9,inset_-2px_-2px_5px_#ffffff] interactive-item neu-hover">
                       <div className="w-8 h-8 rounded-full bg-[#e0e5ec] shadow-[3px_3px_6px_#bebec9,-3px_-3px_6px_#ffffff] flex items-center justify-center relative active:scale-95 transition-all">
                         <div className="w-1 h-3 bg-gray-400 rounded-full absolute top-0.5 origin-bottom rotate-[-20deg]" />
                         <div className="w-2.5 h-2.5 rounded-full bg-white/40 shadow-inner"></div>
                       </div>
                       <div className="flex flex-col select-none">
                         <span className="text-[7px] font-mono text-gray-400 uppercase tracking-widest leading-none mb-1 font-bold">LENS DIAL</span>
                         <span className="text-[9px] font-black text-gray-700 uppercase tracking-wider font-mono">1.4 AF-C</span>
                       </div>
                     </div>
                   </div>
                 </div>
              </motion.div>

              {/* Right Column: Console Interface */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                className="lg:col-span-7 flex flex-col justify-center"
              >
                
                {/* About Me Syncopate Header */}
                <div className="mb-6">
                  <div className="text-[9px] font-mono text-cyan-600 uppercase tracking-[0.3em] font-extrabold mb-1.5 block">
                    CONSOLE_INIT // PERSONAL INTERVIEW MATRIX
                  </div>
                  <h2 className="font-syncopate text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a202c] tracking-tight uppercase leading-[0.95]">
                    ABOUT ME<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-gray-700 text-xl md:text-2xl font-light">
                      // DEVELOPER. ARTIST. EDITOR.
                    </span>
                  </h2>
                </div>

                {/* Interactive Role Switcher Desk */}
                <div className="neu-in p-2 rounded-[2rem] border border-white/50 flex flex-wrap gap-2 mb-6 max-w-md w-full">
                  {(['developer', 'artist', 'editor'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => setActiveRole(role)}
                      className={`flex-1 min-w-[90px] text-[9px] font-black py-3 px-4 rounded-[1.5rem] uppercase tracking-widest transition-all duration-300 interactive-item neu-hover
                        ${activeRole === role 
                          ? 'bg-white text-cyan-600 shadow-[2px_2px_5px_#bebec9,-2px_-2px_5px_#ffffff] border border-cyan-400/20 active:scale-98' 
                          : 'text-gray-500 hover:text-cyan-600 bg-transparent active:scale-95'}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                {/* Dynamic Story Narrative Card with AnimatePresence */}
                <div className="relative min-h-[220px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeRole}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="space-y-5 p-6 md:p-8 neu-out rounded-[2.5rem] border border-white/60 bg-[#e0e5ec] shadow-[8px_8px_16px_#bebec9,-8px_-8px_16px_#ffffff]"
                    >
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-bold text-gray-800 uppercase tracking-widest flex items-center gap-3.5 font-syncopate">
                          <span className="w-5 h-[2px] bg-cyan-500 block rounded-full"></span>
                          {getRoleStory().title}
                        </h3>
                        <p className="text-gray-800 text-base md:text-lg tracking-wide font-black leading-tight">
                          {getRoleStory().brief}
                        </p>
                        
                        {/* Interview Q&A Layout */}
                        <div className="space-y-3.5 border-l-2 border-cyan-400/25 pl-4 mt-2">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono font-bold text-cyan-600 uppercase tracking-wider block">{getRoleStory().q1}</span>
                            <span className="text-xs text-gray-600 block leading-relaxed font-semibold">{getRoleStory().a1}</span>
                          </div>
                          <div className="space-y-1 pt-2">
                            <span className="text-[9px] font-mono font-bold text-pink-600 uppercase tracking-wider block">{getRoleStory().q2}</span>
                            <span className="text-xs text-gray-600 block leading-relaxed font-semibold">{getRoleStory().a2}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-300/40 flex flex-col gap-2">
                        <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest font-bold">TACTICAL SPECIALTIES</span>
                        <div className="flex flex-wrap gap-1.5">
                          {getRoleStory().skills.map((skill, index) => (
                            <span key={index} className="text-[9px] font-mono font-bold bg-[#e0e5ec] text-cyan-600 border border-white/50 shadow-[1px_1px_2px_#bebec9,-1px_-1px_2px_#ffffff] px-2.5 py-1.5 rounded-xl uppercase tracking-wider hover:scale-105 active:scale-95 transition-all cursor-default">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* High-Contrast Console Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full">
                  
                  {/* Deployments Card */}
                  <div className="neu-out rounded-[2rem] border border-white/50 p-5 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-[12px_12px_24px_#bebec9,-12px_-12px_24px_#ffffff] transition-all duration-300 group cursor-default h-[115px] bg-[#e0e5ec] interactive-item neu-hover">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] text-gray-400 tracking-[0.2em] font-mono font-bold uppercase leading-none group-hover:text-cyan-600 transition-colors">DEPL_METRICS</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-gray-800 font-mono tracking-tighter">50+</div>
                      <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">Live Systems</div>
                    </div>
                  </div>

                  {/* Era Card */}
                  <div className="neu-out rounded-[2rem] border border-white/50 p-5 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-[12px_12px_24px_#bebec9,-12px_-12px_24px_#ffffff] transition-all duration-300 group cursor-default h-[115px] bg-[#e0e5ec] interactive-item neu-hover">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] text-gray-400 tracking-[0.2em] font-mono font-bold uppercase leading-none group-hover:text-cyan-600 transition-colors">ACTIVE_ERA</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-gray-800 font-mono tracking-tighter">08Y</div>
                      <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">2018 - Pres</div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="neu-out rounded-[2rem] border border-white/50 p-5 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-[12px_12px_24px_#bebec9,-12px_-12px_24px_#ffffff] transition-all duration-300 group cursor-default h-[115px] bg-[#e0e5ec] interactive-item neu-hover">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] text-gray-400 tracking-[0.2em] font-mono font-bold uppercase leading-none group-hover:text-cyan-600 transition-colors">SYS_STATUS</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></span>
                    </div>
                    <div>
                      <div className="text-xl font-black text-cyan-600 font-mono tracking-tight uppercase leading-none">Vibe Coding</div>
                      <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1.5">Current Focus</div>
                    </div>
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
                  Hand-crafted technical pipelines, fine drawings, and interactive AI user interfaces
                </p>
              </div>

              {/* Tag filters */}
              <div className="flex flex-wrap gap-2 neu-in p-2 rounded-2xl self-start md:self-auto pointer-events-auto">
                {["All", "Development"].map(filter => (
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

            {/* Projects Column Stack */}
            <div className="flex flex-col gap-12 lg:gap-16 w-full">
              {filteredProjects.map(proj => (
                <ProjectCard 
                  key={proj.id}
                  proj={proj}
                  setSelectedProject={setSelectedProject}
                />
              ))}
            </div>
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
                className="neu-out rounded-[2.5rem] p-8 border border-white/60 text-center flex flex-col items-center justify-between hover:shadow-[14px_14px_28px_#bebec9,-14px_-14px_28px_#ffffff] hover:-translate-y-1.5 active:scale-98 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full neu-in flex items-center justify-center text-cyan-500 mb-6 group-hover:scale-110 transition-transform">
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
                className="neu-out rounded-[2.5rem] p-8 border border-white/60 text-center flex flex-col items-center justify-between hover:shadow-[14px_14px_28px_#bebec9,-14px_-14px_28px_#ffffff] hover:-translate-y-1.5 active:scale-98 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full neu-in flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
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
                className="neu-out rounded-[2.5rem] p-8 border border-white/60 text-center flex flex-col items-center justify-between hover:shadow-[14px_14px_28px_#bebec9,-14px_-14px_28px_#ffffff] hover:-translate-y-1.5 active:scale-98 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full neu-in flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
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
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          
          {/* Main Expandable chat card */}
          <AnimatePresence>
            {aiTwinOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="w-[320px] sm:w-[380px] h-[480px] bg-[#e0e5ec]/95 border border-white/80 rounded-[2.5rem] shadow-[15px_15px_30px_#bebec9,-15px_-15px_30px_#ffffff] p-5 flex flex-col mb-4 overflow-hidden backdrop-blur-md relative"
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
                    "What is Vibe Coding?",
                    "Tell me about your tech stack",
                    "Draft a custom contact request"
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
            className="w-14 h-14 bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-cyan-400 transition-colors active:scale-90 hover:scale-105 z-50 border border-white/40 group relative"
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
                className="w-full max-w-[1000px] lg:max-w-5xl bg-[#e0e5ec] rounded-2xl border border-white/80 p-4 sm:p-8 shadow-[20px_20px_60px_#bebec9,-20px_-20px_60px_#ffffff] relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]"
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
                className={`w-full bg-[#e0e5ec] rounded-2xl border border-white/80 p-4 md:p-8 shadow-[20px_20px_60px_#bebec9,-20px_-20px_60px_#ffffff] relative transition-all duration-500 overflow-y-auto max-h-[95vh] md:max-h-[90vh] max-w-[1000px] lg:max-w-5xl`}
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest">{selectedProject.category} Case Study</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1a202c] tracking-tight">{selectedProject.title}</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="w-10 h-10 rounded-full neu-out flex items-center justify-center text-gray-600 hover:text-red-500 active:scale-90 active:shadow-[inset_2px_2px_5px_#bebec9] z-20 shrink-0"
                  >
                    <X size={18} className="pointer-events-none" />
                  </button>
                </div>

                <div className="space-y-6 text-xs text-gray-600 font-semibold leading-relaxed">
                  <div className="p-5 neu-in rounded-2xl">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-300/50 pb-2">Technical Overview</h4>
                    <p>{selectedProject.details}</p>
                  </div>

                  {/* Screenshot Modal Preview */}
                  {selectedProject.iframeUrl && (
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest select-none">
                        <span>Project Screenshot</span>
                        <a 
                          href={selectedProject.iframeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-600 hover:text-cyan-800 transition-all font-extrabold flex items-center gap-1 hover:underline hover:scale-105 active:scale-95"
                        >
                          Visit Live Site <ChevronRight size={10} className="pointer-events-none" />
                        </a>
                      </div>
                      
                      <div className="w-full rounded-2xl overflow-hidden border border-white/60 neu-out bg-[#e0e5ec] p-2 shadow-inner">
                        <div className="w-full aspect-[16/10] bg-white rounded-xl overflow-hidden relative shadow-md cursor-pointer" onClick={() => window.open(selectedProject.iframeUrl, '_blank')}>
                          <img 
                            src={selectedProject.image} 
                            alt={selectedProject.title} 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="neu-out p-4 rounded-xl text-center border border-white/60">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Efficiency Metric</span>
                      <span className="text-lg font-black text-cyan-600">{selectedProject.metric}</span>
                    </div>
                    <div className="neu-out p-4 rounded-xl text-center border border-white/60">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Production Grade</span>
                      <span className="text-lg font-black text-slate-700">Premium SLA</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    {selectedProject.tags.map(t => (
                      <span key={t} className="text-[9px] font-bold text-gray-800 neu-out px-3 py-1.5 rounded-lg border border-white/50">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AnimatePresence>
  );
}
