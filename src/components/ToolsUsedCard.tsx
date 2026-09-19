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
      id: 'unity',
      name: 'Unity 3D',
      freq: 392.00, // G4
      color: 'text-gray-900',
      hoverGlow: 'hover:shadow-[0_0_15px_rgba(0,0,0,0.25)] hover:border-gray-800',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12 2L2 7.8v8.4L12 22l10-5.8V7.8L12 2zm0 3.3l6.5 3.8-3 1.7-6.5-3.8 3-1.7zm-2.6 4.5l6.5 3.8v5.8l-6.5-3.8V9.8zm-5 1.2l3-1.7v5.8l-3 1.7V11zm15.2 5.8l-3-1.7V9.3l3 1.7v5.8z"/>
        </svg>
      ),
      question: "How do you build interactive game loops and mechanics in Unity for games like Ludo NX?"
    },
    {
      id: 'csharp',
      name: 'C# Engine',
      freq: 440.00, // A4
      color: 'text-[#68217a]',
      hoverGlow: 'hover:shadow-[0_0_15px_rgba(104,33,122,0.35)] hover:border-purple-500',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2zm0 2.3L5.34 8.15v7.7L12 19.7l6.66-3.85v-7.7L12 4.3z"/>
          <path d="M13.2 9.5c-.5-.3-1.1-.4-1.8-.4-1.8 0-3 1.2-3 2.9s1.2 2.9 3 2.9c.7 0 1.3-.1 1.8-.4v-1.3c-.5.3-1 .4-1.5.4-1 0-1.6-.7-1.6-1.6s.6-1.6 1.6-1.6c.5 0 1 .1 1.5.4V9.5zm3.8 1.8h-1v-1h-1v1h-1v1h1v1h-1v1h1v1h1v-1h1v1h1v-1h1v-1h-1v-1h1v-1h-1zm-1 2h-1v-1h1v1z"/>
        </svg>
      ),
      question: "How do you architect game systems, state management, and gameplay logic in C#?"
    },
    {
      id: 'blender',
      name: 'Blender 3D',
      freq: 493.88, // B4
      color: 'text-[#ea7600]',
      hoverGlow: 'hover:shadow-[0_0_15px_rgba(234,118,0,0.35)] hover:border-amber-500',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12.5 2a1.5 1.5 0 0 0-1.2 2.4l2.1 2.8-4.5-2.6a1.5 1.5 0 0 0-2.1.8 1.5 1.5 0 0 0 .6 2l4.8 2.8-5.3-.2a1.5 1.5 0 0 0-1.5 1.5c0 .8.6 1.5 1.5 1.5h1.2C6.9 14.2 6.5 15.6 6.5 17c0 3.9 3.1 7 7 7s7-3.1 7-7c0-3.4-2.4-6.2-5.6-6.8l.5-.7 1.8-2.4a1.5 1.5 0 0 0-.4-2.1 1.5 1.5 0 0 0-2.1.4l-1.9 2.5-.3-4.4A1.5 1.5 0 0 0 12.5 2zm1 11.5c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z"/>
        </svg>
      ),
      question: "How do you model, texture, and optimize 3D game assets in Blender for real-time engines?"
    },
    {
      id: 'figma',
      name: 'Figma UI',
      freq: 523.25, // C5
      color: 'text-[#f24e1e]',
      hoverGlow: 'hover:shadow-[0_0_15px_rgba(242,78,30,0.35)] hover:border-red-400',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M8 2h4v4H8a2 2 0 1 1 0-4z" fill="#F24E1E"/>
          <path d="M12 2h4a2 2 0 1 1 0 4h-4V2z" fill="#FF7262"/>
          <path d="M12 6h4a2 2 0 1 1 0 4h-4V6z" fill="#1ABCFE"/>
          <path d="M8 6h4v4H8a2 2 0 1 1 0-4z" fill="#A259FF"/>
          <path d="M8 10h4v4H8a2 2 0 1 1 0-4z" fill="#0ACF83"/>
          <path d="M8 14h4v2a2 2 0 1 1-4 0v-2z" fill="#0ACF83"/>
        </svg>
      ),
      question: "What is your UI/UX design workflow in Figma for games and mobile apps like Selah?"
    },
    {
      id: 'vscode',
      name: 'VS Code',
      freq: 587.33, // D5
      color: 'text-[#007acc]',
      hoverGlow: 'hover:shadow-[0_0_15px_rgba(0,122,204,0.35)] hover:border-sky-400',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M17.5 2.2l-9.8 8.9L4.4 8 2 9.2l4.3 3.8L2 16.8 4.4 18l3.3-3.1 9.8 8.9c.7.6 1.8.4 2.2-.4.2-.3.3-.7.3-1.1V2.8c0-.9-.7-1.6-1.6-1.6-.3 0-.6.1-.9.3zM18 17.6l-6.8-5.6L18 6.4v11.2z"/>
        </svg>
      ),
      question: "What IDE setup and extensions do you use for rapid game and fullstack engineering?"
    },
    {
      id: 'photoshop',
      name: 'Photoshop',
      freq: 659.25, // E5
      color: 'text-[#31a8ff]',
      hoverGlow: 'hover:shadow-[0_0_15px_rgba(49,168,255,0.35)] hover:border-blue-400',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#001e36"/>
          <path d="M7 6.5h3.2c1.7 0 2.8.9 2.8 2.3 0 1.5-1.1 2.4-2.8 2.4H8.5v3.3H7V6.5zm1.5 3.4h1.6c.8 0 1.4-.4 1.4-1.1 0-.7-.6-1.1-1.4-1.1H8.5v2.2zm7.6 1.8c.8 0 1.4.3 1.7.7l-.8 1c-.3-.2-.5-.4-.9-.4-.5 0-.7.3-.7.6 0 .8 2.5.5 2.5 2.2 0 1.2-1 1.9-2.2 1.9-.9 0-1.6-.3-2-.8l.8-1c.3.4.7.6 1.2.6.5 0 .8-.3.8-.6 0-.9-2.5-.5-2.5-2.2-.1-1.2.9-2 2.1-2z" fill="#31a8ff"/>
        </svg>
      ),
      question: "How do your seven years of traditional pencil art translate into digital illustration in Photoshop?"
    },
    {
      id: 'git',
      name: 'Git VCS',
      freq: 698.46, // F5
      color: 'text-[#f05032]',
      hoverGlow: 'hover:shadow-[0_0_15px_rgba(240,80,50,0.35)] hover:border-orange-500',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M21.7 10.3L13.7 2.3a2.4 2.4 0 0 0-3.4 0L8.2 4.4l3.1 3.1a2.1 2.1 0 0 1 2.6 2.6l3 3a2.1 2.1 0 1 1-1.3 1.2l-2.8-2.8v4.3a2.1 2.1 0 1 1-1.8 0v-4.5a2.1 2.1 0 0 1-1.1-2.7L6.8 5.7 2.3 10.3a2.4 2.4 0 0 0 0 3.4l8 8a2.4 2.4 0 0 0 3.4 0l8-8a2.4 2.4 0 0 0 0-3.4z"/>
        </svg>
      ),
      question: "How do you manage version control and collaborative repositories for your games and client apps?"
    },
    {
      id: 'react',
      name: 'React & Web',
      freq: 783.99, // G5
      color: 'text-[#61dafb]',
      hoverGlow: 'hover:shadow-[0_0_15px_rgba(97,218,251,0.35)] hover:border-cyan-400',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <ellipse cx="12" cy="12" rx="3.5" ry="9" transform="rotate(30 12 12)" fill="none" stroke="#61dafb" strokeWidth="1.5"/>
          <ellipse cx="12" cy="12" rx="3.5" ry="9" transform="rotate(90 12 12)" fill="none" stroke="#61dafb" strokeWidth="1.5"/>
          <ellipse cx="12" cy="12" rx="3.5" ry="9" transform="rotate(150 12 12)" fill="none" stroke="#61dafb" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="1.8" fill="#61dafb"/>
        </svg>
      ),
      question: "How do you build responsive web applications and interactive UI prototypes using React?"
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
        <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase mb-0.5 block">Development Suite</span>
        <h3 className="text-lg font-bold text-gray-800 tracking-tight group-hover:text-cyan-600 transition-colors uppercase">Core Toolkit</h3>
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
