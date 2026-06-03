import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MessageSquare } from 'lucide-react';

interface ToolsUsedCardProps {
  playSynthNote: (freq: number, keyName: string) => void;
  setAiTwinOpen: (open: boolean) => void;
  handleSendMessage: (text: string) => void;
  isZooming: boolean;
}

interface ToolItem {
  id: string;
  name: string;
  freq: number;
  color: string;
  hoverGlow: string;
  logo: React.ReactNode;
  question: string;
}

export default function ToolsUsedCard({ 
  playSynthNote, 
  setAiTwinOpen, 
  handleSendMessage,
  isZooming 
}: ToolsUsedCardProps) {

  const tools: ToolItem[] = [
    {
      id: 'claude',
      name: 'Claude Code',
      freq: 392.00, // G4
      color: 'text-[#d97706]',
      hoverGlow: 'hover:shadow-[0_0_15px_rgba(217,119,6,0.35)] hover:border-amber-400',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          {/* Anthropic / Claude organic minimalist symbol */}
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" className="opacity-30" />
          <path d="M12.5 5.5c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V7c0-.83-.67-1.5-1.5-1.5zm-3 8c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm6 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
        </svg>
      ),
      question: "How do you leverage Claude Code for developer scaffolding and codebases?"
    },
    {
      id: 'banana',
      name: 'Nano Banana',
      freq: 440.00, // A4
      color: 'text-[#eab308]',
      hoverGlow: 'hover:shadow-[0_0_15px_rgba(234,179,8,0.35)] hover:border-yellow-400',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Neon Banana SVG */}
          <path d="M5 21c3.5-3 8-3.5 11-6.5s3.5-7.5.5-11c-.5-.8-1.5-1.2-2.3-.7-.8.5-.7 1.8-.3 2.7 1 2.2.3 5-1.7 7s-4.8 2.7-7 1.7c-.9-.4-2.2-.5-2.7.3-.5.8-.1 1.8.7 2.3 3 3 3.5 7.5 6.5 11z" />
          <path d="M2 18c1.5.5 3 .5 4 0" strokeWidth="1.5" />
        </svg>
      ),
      question: "What is Nano Banana, and how do you implement its micro-agents in your apps?"
    },
    {
      id: 'gemini',
      name: 'Gemini Studio',
      freq: 493.88, // B4
      color: 'text-[#3b82f6]',
      hoverGlow: 'hover:shadow-[0_0_15px_rgba(59,130,246,0.35)] hover:border-blue-400',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          {/* Gemini AI Sparkle */}
          <path d="M12 2c-.3 2.8-2.2 4.7-5 5 2.8.3 4.7 2.2 5 5 .3-2.8 2.2-4.7 5-5-2.8-.3-4.7-2.2-5-5zm-7 12c-.2 1.7-1.3 2.8-3 3 1.7.2 2.8 1.3 3 3 .2-1.7 1.3-2.8 3-3-1.7-.2-2.8-1.3-3-3zm14 2c-.1 1.1-.9 1.9-2 2 1.1.1 1.9.9 2 2 .1-1.1.9-1.9 2-2-1.1-.1-1.9-.9-2-2z" />
        </svg>
      ),
      question: "How do you construct custom system instructions in Gemini AI Studio?"
    },
    {
      id: 'google',
      name: 'Google Workspace',
      freq: 523.25, // C5
      color: 'text-[#10b981]',
      hoverGlow: 'hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] hover:border-emerald-400',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Google iconic G outline */}
          <path d="M18 12c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c1.7 0 3.2.7 4.2 1.8L19 5.2C17.2 3.2 14.8 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5 0 9-3.6 9.8-8.3H12" />
        </svg>
      ),
      question: "Can you describe how Google AI API quotas and deployment targets shape your systems?"
    },
    {
      id: 'canva',
      name: 'Canva Design',
      freq: 587.33, // D5
      color: 'text-[#a855f7]',
      hoverGlow: 'hover:shadow-[0_0_15px_rgba(168,85,247,0.35)] hover:border-purple-400',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round">
          {/* Canva fluid circular brush stroke */}
          <circle cx="12" cy="12" r="9" strokeDasharray="4,4" />
          <path d="M12 6a6 6 0 11-6 6c0-2 1.5-4 3.5-5" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" strokeWidth="1.5" />
        </svg>
      ),
      question: "How does Canva enable rapid layout sketching and moodboard asset assembly?"
    },
    {
      id: 'photoshop',
      name: 'Photoshop',
      freq: 659.25, // E5
      color: 'text-[#0284c7]',
      hoverGlow: 'hover:shadow-[0_0_15px_rgba(2,132,199,0.35)] hover:border-sky-400',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          {/* Photoshop custom logo */}
          <rect x="3" y="3" width="18" height="18" rx="3" className="opacity-10" />
          <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <text x="6" y="14" fontFamily="monospace" fontSize="8" fontWeight="bold">P</text>
          <text x="12" y="17" fontFamily="monospace" fontSize="8" fontWeight="bold">s</text>
        </svg>
      ),
      question: "What Photoshop compositing techniques do you combine with web canvas visuals?"
    },
    {
      id: 'figma',
      name: 'Figma',
      freq: 698.46, // F5
      color: 'text-[#f43f5e]',
      hoverGlow: 'hover:shadow-[0_0_15px_rgba(244,63,94,0.35)] hover:border-rose-400',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          {/* Figma brand logo (5 circle grids) */}
          <path d="M8 2h4v4H8z" />
          <circle cx="8" cy="4" r="2" />
          <circle cx="12" cy="4" r="2" />
          <circle cx="12" cy="8" r="2" />
          <path d="M8 10a2 2 0 012 2v2a2 2 0 11-2-2z" />
          <path d="M12 10a2 2 0 012 2v2a2 2 0 11-2-2z" />
        </svg>
      ),
      question: "How do you align Figma layout grids directly to Tailwind code tokens?"
    },
    {
      id: 'framer',
      name: 'Framer Canvas',
      freq: 783.99, // G5
      color: 'text-[#a855f7]',
      hoverGlow: 'hover:shadow-[0_0_15px_rgba(168,85,247,0.35)] hover:border-violet-400',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          {/* Framer double triangle outline */}
          <path d="M12 2L4 10h16zM4 10h8v8zM12 10h8v8l-8 4z" />
        </svg>
      ),
      question: "What Framer interaction curves are ideal for translating into code-based animations?"
    }
  ];

  const handleToolClick = (e: React.MouseEvent, tool: ToolItem) => {
    e.stopPropagation();
    playSynthNote(tool.freq, tool.id);
    setAiTwinOpen(true);
    handleSendMessage(tool.question);
  };

  return (
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div>
        <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase mb-0.5 block">Tools & Workflows</span>
        <h3 className="text-lg font-bold text-gray-800 tracking-tight group-hover:text-amber-500 transition-colors uppercase">Tools Used</h3>
      </div>
      
      {/* 2x4 Tactile Button Grid */}
      <div className="grid grid-cols-4 gap-2 py-2 flex-grow pointer-events-auto">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={(e) => handleToolClick(e, tool)}
            title={tool.name}
            className={`flex flex-col items-center justify-center p-1 rounded-xl border border-white/60 bg-white/40 shadow-sm active:scale-90 active:shadow-inner transition-all cursor-pointer group/tool relative ${tool.color} ${tool.hoverGlow}`}
          >
            <div className="mb-0.5 transition-transform group-hover/tool:scale-110">
              {tool.logo}
            </div>
            <span className="text-[6.5px] font-black text-gray-600 block text-center truncate w-full select-none">
              {tool.name.split(' ')[0]}
            </span>
            <div className="absolute top-1 right-1 opacity-0 group-hover/tool:opacity-100 transition-opacity">
              <Sparkles size={6} className="text-cyan-400" />
            </div>
          </button>
        ))}
      </div>

      <div className="border-t border-gray-300/40 pt-2 flex items-center justify-between text-[7px] font-extrabold text-gray-500 uppercase tracking-widest">
        <span>Click to ask AI Twin</span>
        <MessageSquare size={8} className="animate-pulse text-cyan-500" />
      </div>
    </div>
  );
}
