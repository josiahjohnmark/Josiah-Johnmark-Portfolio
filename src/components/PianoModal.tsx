import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Volume2, Music, Sparkles, Activity, AlertCircle } from 'lucide-react';

interface PianoModalProps {
  onClose: () => void;
  playSynthNote: (freq: number, keyName: string) => void;
}

interface PianoKey {
  name: string;
  freq: number;
  isBlack: boolean;
  bindKey: string;
  leftOffset?: string; // used to position black keys perfectly
}

const PIANO_KEYS: PianoKey[] = [
  { name: 'C4', freq: 261.63, isBlack: false, bindKey: 'A' },
  { name: 'C#4', freq: 277.18, isBlack: true, bindKey: 'W', leftOffset: 'left-[6.2%]' },
  { name: 'D4', freq: 293.66, isBlack: false, bindKey: 'S' },
  { name: 'D#4', freq: 311.13, isBlack: true, bindKey: 'E', leftOffset: 'left-[16.2%]' },
  { name: 'E4', freq: 329.63, isBlack: false, bindKey: 'D' },
  { name: 'F4', freq: 349.23, isBlack: false, bindKey: 'F' },
  { name: 'F#4', freq: 369.99, isBlack: true, bindKey: 'T', leftOffset: 'left-[36.2%]' },
  { name: 'G4', freq: 392.00, isBlack: false, bindKey: 'G' },
  { name: 'G#4', freq: 415.30, isBlack: true, bindKey: 'Y', leftOffset: 'left-[46.2%]' },
  { name: 'A4', freq: 440.00, isBlack: false, bindKey: 'H' },
  { name: 'A#4', freq: 466.16, isBlack: true, bindKey: 'U', leftOffset: 'left-[56.2%]' },
  { name: 'B4', freq: 493.88, isBlack: false, bindKey: 'J' },
  { name: 'C5', freq: 523.25, isBlack: false, bindKey: 'K' },
  { name: 'C#5', freq: 554.37, isBlack: true, bindKey: 'O', leftOffset: 'left-[76.2%]' },
  { name: 'D5', freq: 587.33, isBlack: false, bindKey: 'L' },
  { name: 'D#5', freq: 622.25, isBlack: true, bindKey: 'P', leftOffset: 'left-[86.2%]' },
  { name: 'E5', freq: 659.25, isBlack: false, bindKey: ';' }
];

export default function PianoModal({ onClose, playSynthNote }: PianoModalProps) {
  const [activePianoKeys, setActivePianoKeys] = useState<string[]>([]);
  const [pianoVolume, setPianoVolume] = useState<number>(0.5);
  const [timbre, setTimbre] = useState<'rhodes' | 'classic'>('rhodes');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const oscWaves = useRef<{x: number, amp: number, phase: number, speed: number}[]>([]);

  // Web Audio Grand Piano / Rhodes synthesizer
  const playPianoTone = (freq: number, keyName: string) => {
    // Add to visual active array
    setActivePianoKeys(prev => [...prev, keyName]);
    setTimeout(() => {
      setActivePianoKeys(prev => prev.filter(k => k !== keyName));
    }, 250);

    // Oscilloscope pulse trigger
    oscWaves.current.push({
      x: 0,
      amp: 40 + Math.random() * 20,
      phase: Math.random() * Math.PI,
      speed: 0.15 + Math.random() * 0.1
    });
    if (oscWaves.current.length > 5) oscWaves.current.shift();

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(pianoVolume, ctx.currentTime);
      masterGain.connect(ctx.destination);

      // We synthesis a layered piano overtone stack
      const playFreq = (f: number, amp: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        // Rhodes uses a round sine/triangle. Classic uses triangle/square overtones
        osc.type = timbre === 'rhodes' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        // Envelope: ADSR (Attack, Decay, Sustain, Release)
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(amp, ctx.currentTime + 0.005); // immediate strike
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration); // smooth string fade

        osc.connect(gainNode);
        gainNode.connect(masterGain);
        
        osc.start();
        osc.stop(ctx.currentTime + duration);
      };

      if (timbre === 'rhodes') {
        // Round, deep, metallic warm synthesis
        playFreq(freq, 0.7, 0.9);               // Fundamental (C4)
        playFreq(freq * 2.00, 0.25, 0.65);       // Octave harmonic
        playFreq(freq * 3.00, 0.08, 0.45);       // Sub-octave harmonic
        playFreq(freq * 0.5, 0.15, 1.1);         // Low undertone resonance
      } else {
        // Classic, crisp, direct acoustic chime
        playFreq(freq, 0.65, 0.8);
        playFreq(freq * 2.00, 0.15, 0.5);
        playFreq(freq * 1.5, 0.1, 0.4);         // Fifth harmonic (creates chord depth)
        playFreq(freq * 4.0, 0.05, 0.2);        // High bell ringing
      }

    } catch (e) {
      console.warn("Piano synthesizer failed:", e);
    }
  };

  // Oscilloscope Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const drawOscilloscope = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.04;

      // Draw gridlines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 20) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw glowing oscilloscope center line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
      ctx.lineWidth = 1.5;
      
      for (let x = 0; x < canvas.width; x++) {
        let y = canvas.height / 2;

        // Sum wave pulses together
        oscWaves.current.forEach(wave => {
          const distance = Math.abs(x - canvas.width / 2);
          const envelope = Math.max(0, 1 - distance / (canvas.width * 0.45)); // fade at edges
          y += Math.sin((x * 0.045) + wave.phase + time) * wave.amp * envelope;
        });

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Decay visual waves naturally over time
      oscWaves.current.forEach(wave => {
        wave.amp *= 0.96; // fade down
      });
      oscWaves.current = oscWaves.current.filter(w => w.amp > 0.5);

      // If inactive, draw small warm thermal ripples
      if (oscWaves.current.length === 0) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + Math.sin(x * 0.02 + time) * 3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(drawOscilloscope);
    };

    drawOscilloscope();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Global keydown listeners for computer keyboard playing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Smart bypass: If user is typing in forms, skip piano trigger
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      const keyName = e.key.toUpperCase();
      const matchedKey = PIANO_KEYS.find(k => k.bindKey === keyName);
      if (matchedKey) {
        e.preventDefault();
        playPianoTone(matchedKey.freq, matchedKey.name);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timbre, pianoVolume]);

  return (
    <div className="space-y-6 flex flex-col h-full">
      <p className="text-xs text-gray-500 leading-relaxed font-semibold">
        Interact with the neumorphic piano keybed below, or play directly via your **physical home row** (`A` through `;` for white keys, `W, E, T, Y, U, O, P` for black)! Tweak the timbre and volume values live.
      </p>

      {/* Control panel and visualizer grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sliders and Timbre selection */}
        <div className="neu-in p-4 rounded-2xl flex flex-col justify-between gap-4 border border-white/40">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Piano Timbre</span>
            <div className="flex gap-2">
              {(['rhodes', 'classic'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTimbre(t)}
                  className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md border transition-all cursor-pointer
                    ${timbre === t 
                      ? 'bg-cyan-500 text-white shadow-inner border-cyan-400' 
                      : 'bg-white shadow-sm border-transparent hover:text-cyan-500'}`}
                >
                  {t === 'rhodes' ? 'Warm Rhodes' : 'Classic Grand'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <span>Main Output Gain</span>
              <span>{Math.round(pianoVolume * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="1" step="0.05"
              value={pianoVolume}
              onChange={(e) => setPianoVolume(parseFloat(e.target.value))}
              className="neu-slider cursor-pointer"
            />
          </div>
        </div>

        {/* Live Canvas Oscilloscope */}
        <div className="neu-in p-3 rounded-2xl border border-white/40 bg-slate-950 flex flex-col justify-between h-[100px] overflow-hidden relative shadow-inner">
          <div className="absolute top-1.5 left-3 font-mono text-[7px] text-cyan-400 uppercase tracking-wider select-none z-10 flex items-center gap-1">
            <Activity size={10} className="animate-pulse" />
            <span>Frequence Oscilloscope</span>
          </div>
          <canvas 
            ref={canvasRef} 
            width="280" 
            height="70" 
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>
      </div>

      {/* Tactile Piano Keybed Container */}
      <div className="neu-in p-4 pb-6 rounded-3xl border border-white/60 relative">
        
        {/* White and Black key grid wrapper */}
        <div className="relative flex justify-between h-44 w-full bg-slate-300 rounded-2xl overflow-hidden shadow-inner p-1 select-none">
          
          {/* Render White Keys */}
          {PIANO_KEYS.filter(k => !k.isBlack).map(key => {
            const isActive = activePianoKeys.includes(key.name);
            return (
              <button
                key={key.name}
                onClick={() => playPianoTone(key.freq, key.name)}
                className={`flex-1 h-full rounded-xl border-x border-gray-200 transition-all flex flex-col justify-end pb-3 items-center cursor-pointer pointer-events-auto select-none
                  ${isActive 
                    ? 'bg-gradient-to-t from-cyan-100 to-cyan-50 shadow-inner translate-y-0.5 border-t border-cyan-300' 
                    : 'bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_-8px_0_#eaeaea] hover:bg-gray-50 active:translate-y-0.5'}`}
              >
                <div className="flex flex-col items-center select-none pointer-events-none">
                  <span className="text-[6.5px] font-black text-gray-400 font-sans tracking-tighter uppercase mb-0.5">Key: {key.bindKey}</span>
                  <span className="text-[8px] font-black text-gray-600 font-mono tracking-tight">{key.name}</span>
                </div>
              </button>
            );
          })}

          {/* Render Black Keys Absolutely over Whites */}
          {PIANO_KEYS.filter(k => k.isBlack).map(key => {
            const isActive = activePianoKeys.includes(key.name);
            return (
              <button
                key={key.name}
                onClick={() => playPianoTone(key.freq, key.name)}
                className={`absolute w-[7.8%] h-[58%] rounded-b-lg border-x border-slate-900 transition-all z-20 cursor-pointer pointer-events-auto flex flex-col justify-end pb-1.5 items-center select-none
                  ${key.leftOffset}
                  ${isActive 
                    ? 'bg-cyan-500 text-white translate-y-0.5 shadow-inner' 
                    : 'bg-slate-900 shadow-[2px_2px_4px_rgba(0,0,0,0.3)] hover:bg-slate-800 text-gray-400'}`}
              >
                <div className="flex flex-col items-center select-none pointer-events-none text-center">
                  <span className="text-[5.5px] font-black tracking-tighter block leading-none mb-0.5 uppercase">{key.bindKey}</span>
                  <span className="text-[6.5px] font-bold font-mono tracking-tighter block leading-none">{key.name}</span>
                </div>
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
}
