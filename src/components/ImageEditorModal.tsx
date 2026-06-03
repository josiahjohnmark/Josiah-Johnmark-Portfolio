import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Camera, SlidersHorizontal, Laptop, Video, 
  Sparkles, RefreshCw, Film, Volume2 
} from 'lucide-react';

interface ImageEditorModalProps {
  onClose: () => void;
  playSynthNote: (freq: number, keyName: string) => void;
}

interface LUTPreset {
  name: string;
  freq: number;
  saturation: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  blur: number;
}

const LUT_PRESETS: LUTPreset[] = [
  { name: "Teal & Orange", freq: 293.66, saturation: 145, brightness: 105, contrast: 120, grayscale: 0, hueRotate: 15, blur: 0 },
  { name: "Sleek Grayscale", freq: 329.63, saturation: 0, brightness: 110, contrast: 135, grayscale: 100, hueRotate: 0, blur: 0 },
  { name: "Lofi Sunset", freq: 392.00, saturation: 160, brightness: 95, contrast: 115, grayscale: 0, hueRotate: 320, blur: 0 },
  { name: "Vibe Code Matrix", freq: 440.00, saturation: 150, brightness: 90, contrast: 140, grayscale: 0, hueRotate: 105, blur: 0.5 }
];

export default function ImageEditorModal({ onClose, playSynthNote }: ImageEditorModalProps) {
  const [saturation, setSaturation] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [hueRotate, setHueRotate] = useState<number>(0);
  const [blur, setBlur] = useState<number>(0);
  const [activeLUT, setActiveLUT] = useState<string>("Raw Log");

  const applyLUT = (lut: LUTPreset) => {
    playSynthNote(lut.freq, lut.name);
    setSaturation(lut.saturation);
    setBrightness(lut.brightness);
    setContrast(lut.contrast);
    setGrayscale(lut.grayscale);
    setHueRotate(lut.hueRotate);
    setBlur(lut.blur);
    setActiveLUT(lut.name);
  };

  const resetFilters = () => {
    playSynthNote(261.63, 'reset');
    setSaturation(100);
    setBrightness(100);
    setContrast(100);
    setGrayscale(0);
    setHueRotate(0);
    setBlur(0);
    setActiveLUT("Raw Log");
  };

  // Build the inline CSS filter dynamically
  const getFilterStyle = () => {
    return {
      filter: `saturate(${saturation}%) brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) hue-rotate(${hueRotate}deg) blur(${blur}px)`
    };
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <p className="text-xs text-gray-500 leading-relaxed font-semibold">
        Calibrate the cinematic timeline grades live. Adjust color coordinates using the Premiere-grade sliders below, or trigger professional LUT presets to see real-time CSS filter transitions on Josiah's profile!
      </p>

      {/* Editor Layout: Image Monitor & Grading Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-grow">
        
        {/* Cinema Monitor Frame (7 cols) */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-3">
          <div className="neu-in rounded-xl overflow-hidden aspect-[4/3] relative flex items-center justify-center border border-white/60 bg-gray-950 shadow-inner">
            
            {/* Portrait Image with Live CSS filter */}
            <img 
              src="/josiah-profile.jpg?v=3" 
              alt="Josiah Cinematic Grading monitor" 
              className="w-full h-full object-cover object-center transition-all duration-300 pointer-events-none select-none"
              style={getFilterStyle()}
              onError={(e) => {
                // Safe logo fallback if no background image is generated
                e.currentTarget.src = "/josiah-logo.png";
                e.currentTarget.className = "w-40 h-40 object-contain";
              }}
            />
            
            {/* Vignette Shadow Overlay */}
            <div className="absolute inset-0 border border-white/10 pointer-events-none bg-gradient-to-t from-black/75 via-transparent to-black/40"></div>

            {/* CRT TV scanlines and monitor indicators */}
            <div className="absolute top-4 left-6 font-mono text-[8px] text-cyan-400 flex flex-col uppercase gap-0.5 tracking-wider select-none pointer-events-none">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                REC // Grading_Mode
              </span>
              <span>CALIBRATION: {activeLUT}</span>
            </div>
            <div className="absolute bottom-4 right-6 font-mono text-[8px] text-cyan-400 uppercase select-none pointer-events-none tracking-wider flex items-center gap-1">
              <Film size={10} className="animate-spin" style={{ animationDuration: '4s' }} />
              <span>FR: {saturation > 140 ? '60_FPS' : '24_FPS'} // 2.39:1 CinemaScope</span>
            </div>
          </div>

          {/* Quick presets row */}
          <div className="flex justify-between items-center bg-white/40 border border-white/50 p-2.5 rounded-xl pointer-events-auto">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest pl-2">Cinema LUT Presets:</span>
            <button 
              onClick={resetFilters}
              className="neu-out px-3 py-1.5 text-[8.5px] font-extrabold uppercase hover:text-red-500 bg-white rounded-lg flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <RefreshCw size={10} />
              Reset Raw
            </button>
          </div>
        </div>

        {/* Sliders Deck Panel (5 cols) */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-4">
          
          {/* LUT Preset grid select */}
          <div className="neu-out p-4 rounded-xl border border-white/60 flex flex-col gap-3">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">LUT LUTs Matrix</span>
            <div className="grid grid-cols-2 gap-2 pointer-events-auto">
              {LUT_PRESETS.map(lut => (
                <button
                  key={lut.name}
                  onClick={() => applyLUT(lut)}
                  className={`py-2 px-3 rounded-xl border text-[9.5px] font-black uppercase text-center transition-all cursor-pointer
                    ${activeLUT === lut.name 
                      ? 'bg-cyan-500 text-white shadow-inner border-cyan-400' 
                      : 'bg-white shadow-sm border-transparent hover:text-cyan-500'}`}
                >
                  {lut.name}
                </button>
              ))}
            </div>
          </div>

          {/* Control sliders deck */}
          <div className="neu-out p-5 rounded-xl border border-white/60 space-y-4 flex-grow flex flex-col justify-between pointer-events-auto">
            <div className="flex justify-between items-center pb-2 border-b border-gray-300/30">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <SlidersHorizontal size={10} />
                Telemetry Sliders
              </span>
              <div className="flex gap-1.5">
                <Laptop size={10} className="text-gray-400" />
                <Camera size={10} className="text-gray-400" />
                <Video size={10} className="text-gray-400" />
              </div>
            </div>

            {/* Saturation */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase tracking-widest select-none">
                <span>Color Saturation</span>
                <span>{saturation}%</span>
              </div>
              <input 
                type="range" min="0" max="200" step="5"
                value={saturation}
                onChange={(e) => {
                  setSaturation(parseInt(e.target.value));
                  setActiveLUT("Custom Custom");
                }}
                className="neu-slider cursor-pointer"
              />
            </div>

            {/* Brightness */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase tracking-widest select-none">
                <span>Exposure Brightness</span>
                <span>{brightness}%</span>
              </div>
              <input 
                type="range" min="50" max="150" step="2"
                value={brightness}
                onChange={(e) => {
                  setBrightness(parseInt(e.target.value));
                  setActiveLUT("Custom Custom");
                }}
                className="neu-slider cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase tracking-widest select-none">
                <span>Contrast Depth</span>
                <span>{contrast}%</span>
              </div>
              <input 
                type="range" min="50" max="150" step="2"
                value={contrast}
                onChange={(e) => {
                  setContrast(parseInt(e.target.value));
                  setActiveLUT("Custom Custom");
                }}
                className="neu-slider cursor-pointer"
              />
            </div>

            {/* Grayscale */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase tracking-widest select-none">
                <span>Grayscale Fade</span>
                <span>{grayscale}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="5"
                value={grayscale}
                onChange={(e) => {
                  setGrayscale(parseInt(e.target.value));
                  setActiveLUT("Custom Custom");
                }}
                className="neu-slider cursor-pointer"
              />
            </div>

            {/* Hue-rotate */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase tracking-widest select-none">
                <span>Hue Rotation Angle</span>
                <span>{hueRotate}°</span>
              </div>
              <input 
                type="range" min="0" max="360" step="5"
                value={hueRotate}
                onChange={(e) => {
                  setHueRotate(parseInt(e.target.value));
                  setActiveLUT("Custom Custom");
                }}
                className="neu-slider cursor-pointer"
              />
            </div>

            {/* Blur */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase tracking-widest select-none">
                <span>Depth Blur Radius</span>
                <span>{blur}px</span>
              </div>
              <input 
                type="range" min="0" max="8" step="0.5"
                value={blur}
                onChange={(e) => {
                  setBlur(parseFloat(e.target.value));
                  setActiveLUT("Custom Custom");
                }}
                className="neu-slider cursor-pointer"
              />
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}
