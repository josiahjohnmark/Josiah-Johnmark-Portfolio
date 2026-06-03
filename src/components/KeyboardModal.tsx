import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Keyboard, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { getAudioContext } from '../utils/audio';

interface KeyboardModalProps {
  onClose: () => void;
  playSynthNote: (freq: number, keyName: string) => void;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const SNIPPETS = [
  `// Setup Redis client with pool connection for thread-safe caching
const sessionCache = new RedisPool({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: 6379,
  maxConnections: 32,
  idleTimeoutMillis: 10000
});
`,
  `// Calibrate studio-grade ADSR envelope on Voltage Controlled Amplifier
const triggerEnvelope = (gainNode: GainNode, filterNode: BiquadFilterNode) => {
  const now = audioCtx.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.35, now + 0.025); // Warm attack
  gainNode.gain.exponentialRampToValueAtTime(0.12, now + 0.15); // Smooth decay
  filterNode.frequency.exponentialRampToValueAtTime(800, now + 0.25);
};
`,
  `// Spawning concurrent worker threads for Teal & Orange transcode queue
async function processVideoQueue(jobs: TranscodeJob[]): Promise<void> {
  const threads = navigator.hardwareConcurrency || 4;
  const limit = pLimit(threads);
  const tasks = jobs.map(job => limit(() => renderDaVinciLUT(job)));
  await Promise.all(tasks);
}
`,
  `// PostgreSQL transaction schema for high-throughput client logs
const CREATE_TELEMETRY_TABLE = \`
  CREATE TABLE IF NOT EXISTS telemetry_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    latency_ms INTEGER NOT NULL,
    fps_count DOUBLE PRECISION DEFAULT 60.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
\`;
await db.query(CREATE_TELEMETRY_TABLE);
`,
  `// Spring motion physics setup for modal interface transition
const modalTransition = {
  type: 'spring',
  stiffness: 260,
  damping: 25,
  mass: 1.2,
  restDelta: 0.001
};
`
];

export default function KeyboardModal({ onClose, playSynthNote }: KeyboardModalProps) {
  const [typedCode, setTypedCode] = useState<string>("// Vibe Code Terminal. Start typing on physical keys to compile production code...\n\n");
  const [activePhysicalKey, setActivePhysicalKey] = useState<string | null>(null);
  const [switchType, setSwitchType] = useState<'blue' | 'brown'>('blue');
  const [keyPressCount, setKeyPressCount] = useState<number>(0);
  const [snippetIdx, setSnippetIdx] = useState<number>(0);
  const [charIdx, setCharIdx] = useState<number>(0);

  // Custom mechanical keyboard sound synthesizer
  const playMechSound = (keyName: string) => {
    try {
      const ctx = getAudioContext();
      
      // Source oscillator & noise buffer
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();

      // Mechanical sound differences with soft attack thresholds to prevent pops
      if (switchType === 'blue') {
        // High clicky clack
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800 + Math.random() * 200, ctx.currentTime);
        
        filterNode.type = 'bandpass';
        filterNode.frequency.setValueAtTime(1500, ctx.currentTime);
        filterNode.Q.setValueAtTime(5, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.012); // Slightly softened attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
      } else {
        // Quiet tactile thump
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120 + Math.random() * 30, ctx.currentTime);
        
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(500, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.018); // Soft cinematic attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      }

      osc.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio Context blocked or failed:", e);
    }
  };

  const handleKeyPress = (keyName: string) => {
    playMechSound(keyName);
    setActivePhysicalKey(keyName);
    setKeyPressCount(prev => prev + 1);

    if (keyName === 'DELETE') {
      setTypedCode(prev => prev.length > 0 ? prev.slice(0, -1) : "");
      setCharIdx(prev => Math.max(0, prev - 1));
      return;
    }

    const currentSnippet = SNIPPETS[snippetIdx];
    const chunk = currentSnippet.slice(charIdx, charIdx + 3);
    setTypedCode(prev => {
      // Limit total buffer to avoid memory slowdowns
      if (prev.length > 500) {
        return prev.slice(120) + chunk;
      }
      return prev + chunk;
    });

    const nextCharIdx = charIdx + 3;
    if (nextCharIdx >= currentSnippet.length) {
      setSnippetIdx(prev => (prev + 1) % SNIPPETS.length);
      setCharIdx(0);
    } else {
      setCharIdx(nextCharIdx);
    }

    setTimeout(() => setActivePhysicalKey(null), 100);
  };

  // Global physical keyboard listener with focus detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Smart bypass: If typing in an active input or textarea, skip virtual keyboard trigger
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      
      // Map check if standard alphabet key
      if (key.length === 1 && key >= 'A' && key <= 'Z') {
        e.preventDefault();
        handleKeyPress(key);
      } else if (e.key === ' ') {
        e.preventDefault();
        handleKeyPress('SPACE');
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleKeyPress('DELETE');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [switchType]);

  return (
    <div className="space-y-6 flex flex-col h-full">
      <p className="text-xs text-gray-500 leading-relaxed font-semibold">
        Click the mechanical keycaps below to type, or type directly on your **own physical keyboard**! Pressing keys triggers tactile LED glows, plays switch sounds, and compiles vibe code.
      </p>

      {/* Switch Selector & Count Indicator */}
      <div className="flex justify-between items-center bg-white/40 border border-white/50 px-4 py-2.5 rounded-2xl">
        <div className="flex gap-2 items-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Switch:</span>
          {(['blue', 'brown'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSwitchType(type)}
              className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md border transition-all cursor-pointer
                ${switchType === type 
                  ? 'bg-indigo-500 text-white shadow-inner border-indigo-400' 
                  : 'bg-white shadow-sm border-transparent hover:text-indigo-500'}`}
            >
              {type === 'blue' ? 'Blue Switch (Clicky)' : 'Brown Switch (Silent)'}
            </button>
          ))}
        </div>
        <div className="text-[9px] font-mono font-bold text-gray-500 flex items-center gap-1.5">
          <Terminal size={12} className="text-indigo-500" />
          <span>Keystrokes: {keyPressCount}</span>
        </div>
      </div>

      {/* Typewriter Code terminal */}
      <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-950 font-mono text-[9.5px] text-slate-300 flex-grow min-h-[140px] flex flex-col shadow-inner">
        <div className="bg-slate-950 px-3 py-1.5 flex justify-between items-center text-slate-500 text-[8px] font-bold tracking-wider select-none border-b border-slate-900">
          <span>VIBE_TERMINAL // LIVE_COMPILER</span>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setTypedCode("// Vibe Code Terminal. Press physical keys or click keys below...\n")}
              title="Clear terminal"
              className="hover:text-cyan-400 cursor-pointer active:scale-90 transition-transform"
            >
              <RefreshCw size={10} />
            </button>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            </span>
          </div>
        </div>
        <div className="p-4 flex-grow overflow-y-auto whitespace-pre leading-relaxed select-text font-medium text-emerald-400/90 max-h-[160px]">
          {typedCode}
          <motion.span 
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-1.5 h-3 bg-emerald-400/90 ml-0.5"
          />
        </div>
      </div>

      {/* Mechanical Keyboard Deck */}
      <div className="neu-in p-5 rounded-xl border border-white/60 relative">
        <div className="absolute top-2.5 right-6 flex items-center gap-1 opacity-70">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></div>
          <span className="text-[7px] font-black uppercase text-cyan-600 tracking-wider">RGB Matrix Live</span>
        </div>

        <div className="w-full overflow-x-auto pb-2 scrollbar-none overscroll-contain">
          <div className="flex flex-col gap-1.5 sm:gap-2 min-w-[460px] sm:min-w-0 max-w-[500px] mx-auto pt-2">
            {KEYBOARD_ROWS.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
                {/* Row offsets */}
                {rIdx === 1 && <div className="w-1 sm:w-2" />}
                {rIdx === 2 && <div className="w-3 sm:w-5" />}

                {row.map(char => {
                  const isActive = activePhysicalKey === char;
                  return (
                    <button
                      key={char}
                      onClick={() => handleKeyPress(char)}
                      className={`w-7 h-7 sm:w-10 sm:h-10 neu-out rounded-lg border border-transparent font-mono text-[9px] sm:text-xs font-bold transition-all duration-75 flex items-center justify-center cursor-pointer pointer-events-auto
                        ${isActive 
                          ? 'bg-cyan-100 border-cyan-400 text-cyan-600 shadow-inner scale-90 shadow-[0_0_12px_rgba(6,182,212,0.4)]' 
                          : 'bg-white hover:bg-cyan-50/50 hover:border-cyan-200/50 active:scale-95 text-gray-700'}`}
                    >
                      {char}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Bottom spacebar row */}
            <div className="flex justify-center gap-1.5 sm:gap-2 mt-1">
              <button
                onClick={() => playMechSound('CONTROL')}
                className="px-2 h-7 sm:h-10 neu-out bg-white rounded-lg border border-transparent text-[7px] sm:text-[8px] font-bold text-gray-500 cursor-pointer pointer-events-auto hover:bg-cyan-50/30"
              >
                Ctrl
              </button>
              <button
                onClick={() => handleKeyPress('SPACE')}
                className={`w-28 sm:w-48 h-7 sm:h-10 neu-out rounded-lg border border-transparent transition-all duration-75 cursor-pointer pointer-events-auto
                  ${activePhysicalKey === 'SPACE'
                    ? 'bg-cyan-100 border-cyan-400 shadow-inner scale-95 shadow-[0_0_12px_rgba(6,182,212,0.4)]' 
                    : 'bg-white hover:bg-cyan-50/50 hover:border-cyan-200/50 active:scale-95'}`}
              >
                <span className="text-[6.5px] sm:text-[8px] text-gray-400 font-sans tracking-widest font-bold">SPACE</span>
              </button>
              <button
                onClick={() => {
                  playMechSound('DELETE');
                  setTypedCode(prev => prev.length > 2 ? prev.slice(0, -5) : prev);
                }}
                className="px-2 h-7 sm:h-10 neu-out bg-white rounded-lg border border-transparent text-[7px] sm:text-[8px] font-bold text-gray-500 cursor-pointer pointer-events-auto hover:bg-red-50/50 hover:text-red-500 active:scale-90"
              >
                Del
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
