import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Palette, PenTool, Image, Sparkles, X, 
  Trash2, Download, RefreshCw, Layers
} from 'lucide-react';

interface VisualArtsModalProps {
  onClose: () => void;
  playSynthNote: (freq: number, keyName: string) => void;
}

interface BrushType {
  id: string;
  name: string;
  icon: React.ReactNode;
  opacity: number;
  widthMultiplier: number;
  lineJoin: CanvasLineJoin;
  lineCap: CanvasLineCap;
}

const BRUSHES: BrushType[] = [
  { id: 'pencil', name: 'Graphite Pencil', icon: <PenTool size={14} />, opacity: 0.6, widthMultiplier: 0.8, lineJoin: 'round', lineCap: 'round' },
  { id: 'brush', name: 'Paint Brush', icon: <Palette size={14} />, opacity: 0.8, widthMultiplier: 2.2, lineJoin: 'round', lineCap: 'round' },
  { id: 'pen', name: 'Calligraphy Pen', icon: <Layers size={14} />, opacity: 1.0, widthMultiplier: 1.5, lineJoin: 'miter', lineCap: 'square' }
];

const GALLERY_DRAWINGS = [
  { title: "Chiaroscuro Face Study", year: "2025", medium: "Graphite on Paper", desc: "Fine paper shading focusing on extreme light-contrast shadows.", image: "/images/drawings/drawing-1.webp" },
  { title: "Symmetrical Botanical Study", year: "2024", medium: "Ink and Hatching", desc: "Traditional cross-hatching detail cataloging geometric growth patterns.", image: "/images/drawings/drawing-2.webp" },
  { title: "Anatomical Hand Study", year: "2025", medium: "Carbon Pencil", desc: "Detailed traditional anatomical sketch analyzing muscular tendon tension.", image: "/images/drawings/drawing-3.webp" }
];

export default function VisualArtsModal({ onClose, playSynthNote }: VisualArtsModalProps) {
  const [selectedBrush, setSelectedBrush] = useState<BrushType>(BRUSHES[0]);
  const [brushColor, setBrushColor] = useState<string>('#06b6d4');
  const [brushSize, setBrushSize] = useState<number>(5);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'sketchpad' | 'gallery'>('sketchpad');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorWheelRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastX = useRef<number>(0);
  const lastY = useRef<number>(0);

  // Initialize and paint Color Wheel canvas
  useEffect(() => {
    const canvas = colorWheelRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(cx, cy) - 2;

    ctx.clearRect(0, 0, width, height);

    // Paint a gorgeous radial hue color circle
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 1) * Math.PI / 180;
      const endAngle = (angle + 1) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();

      const hue = angle;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, 'white');
      gradient.addColorStop(0.3, `hsl(${hue}, 100%, 75%)`);
      gradient.addColorStop(1, `hsl(${hue}, 100%, 45%)`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [activeTab]);

  // Handle color wheel mouse clicks / drags
  const handleColorWheelClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = colorWheelRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      if (pixel[3] > 0) { // check opacity to ensure we clicked inside circle
        const hexColor = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
        setBrushColor(hexColor);
        playSynthNote(440 + pixel[0] * 0.5, 'colorWheel');
      }
    } catch (err) {
      console.warn("Could not retrieve pixel from color wheel:", err);
    }
  };

  // Canvas Drawing Initializer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeTab !== 'sketchpad') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white background for saving clean image
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [activeTab]);

  // Sketchpad Mouse Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    isDrawingRef.current = true;
    setIsDrawing(true);
    lastX.current = e.clientX - rect.left;
    lastY.current = e.clientY - rect.top;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX.current, lastY.current);
    ctx.lineTo(currentX, currentY);

    // Apply custom brush style
    ctx.strokeStyle = brushColor;
    ctx.globalAlpha = selectedBrush.opacity;
    ctx.lineWidth = brushSize * selectedBrush.widthMultiplier;
    ctx.lineJoin = selectedBrush.lineJoin;
    ctx.lineCap = selectedBrush.lineCap;

    ctx.stroke();

    lastX.current = currentX;
    lastY.current = currentY;
  };

  // Sketchpad Touch Handlers
  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    
    isDrawingRef.current = true;
    setIsDrawing(true);
    lastX.current = touch.clientX - rect.left;
    lastY.current = touch.clientY - rect.top;
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX.current, lastY.current);
    ctx.lineTo(currentX, currentY);

    // Apply custom brush style
    ctx.strokeStyle = brushColor;
    ctx.globalAlpha = selectedBrush.opacity;
    ctx.lineWidth = brushSize * selectedBrush.widthMultiplier;
    ctx.lineJoin = selectedBrush.lineJoin;
    ctx.lineCap = selectedBrush.lineCap;

    ctx.stroke();

    lastX.current = currentX;
    lastY.current = currentY;
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    playSynthNote(261.63, 'clear');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    playSynthNote(523.25, 'download');
    const link = document.createElement('a');
    link.download = `josiah-sketch-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      
      {/* Studio Header tabs */}
      <div className="flex justify-between items-center bg-white/40 border border-white/50 px-4 py-2.5 rounded-2xl">
        <div className="flex gap-2">
          {(['sketchpad', 'gallery'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => {
                playSynthNote(tab === 'sketchpad' ? 392 : 440, tab);
                setActiveTab(tab);
              }}
              className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-md border transition-all cursor-pointer
                ${activeTab === tab 
                  ? 'bg-pink-500 text-white shadow-inner border-pink-400' 
                  : 'bg-white shadow-sm border-transparent hover:text-pink-500'}`}
            >
              {tab === 'sketchpad' ? 'Tactile Sketchpad' : 'Graphite Art Gallery'}
            </button>
          ))}
        </div>
        <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
          <Sparkles size={12} className="text-pink-500" />
          <span>Traditional & Digital Fusion</span>
        </div>
      </div>

      {activeTab === 'sketchpad' ? (
        /* SKETCHPAD DESIGNER STUDIO */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-grow">
          
          {/* Drawing Board Canvas (7 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <div className="neu-in rounded-xl overflow-hidden aspect-[4/3] relative border border-white/60 bg-white shadow-inner">
              <canvas
                ref={canvasRef}
                width="400"
                height="300"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawingTouch}
                onTouchMove={drawTouch}
                onTouchEnd={stopDrawing}
                className="w-full h-full object-contain cursor-crosshair touch-none select-none pointer-events-auto"
              />
              {isDrawing && (
                <div className="absolute top-3 left-3 bg-pink-500 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider animate-pulse pointer-events-none select-none">
                  Drawing active
                </div>
              )}
            </div>

            {/* Clear and download buttons */}
            <div className="flex justify-between items-center bg-white/40 border border-white/50 p-2.5 rounded-2xl pointer-events-auto">
              <button 
                onClick={clearCanvas}
                className="neu-out px-4 py-2 text-[10px] font-extrabold uppercase hover:text-red-500 bg-white rounded-xl flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Trash2 size={12} />
                Clear board
              </button>
              <button 
                onClick={downloadDrawing}
                className="neu-out px-4 py-2 text-[10px] font-extrabold uppercase hover:text-pink-500 bg-white rounded-xl flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Download size={12} />
                Save vector draw
              </button>
            </div>
          </div>

          {/* Color Wheel & Brushes Drawer (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Color Wheel Circular spectrum */}
            <div className="neu-out p-4 rounded-xl border border-white/60 flex flex-col items-center justify-between gap-3 text-center">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block w-full text-left">Color Wheel Picker</span>
              
              <div className="relative w-36 h-36 flex items-center justify-center neu-in rounded-full p-1 bg-white">
                <canvas
                  ref={colorWheelRef}
                  width="130"
                  height="130"
                  onClick={handleColorWheelClick}
                  className="w-full h-full rounded-full cursor-pointer pointer-events-auto"
                />
                {/* Visual selected color preview dot in center */}
                <div 
                  className="absolute w-8 h-8 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: brushColor }}
                />
              </div>

              <div className="flex items-center justify-between w-full font-mono text-[9px] text-gray-500 bg-white/30 border border-white/20 p-2 rounded-xl">
                <span>HEX CODE:</span>
                <span className="font-bold text-gray-800 tracking-tight uppercase" style={{ color: brushColor }}>{brushColor}</span>
              </div>
            </div>

            {/* Brushes selection & Slider size */}
            <div className="neu-out p-5 rounded-xl border border-white/60 flex flex-col gap-4 flex-grow justify-between">
              <div className="space-y-2.5">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Brush Instruments</span>
                <div className="flex flex-col gap-2 pointer-events-auto">
                  {BRUSHES.map(brush => (
                    <button
                      key={brush.id}
                      onClick={() => {
                        playSynthNote(350 + brush.opacity * 200, brush.id);
                        setSelectedBrush(brush);
                      }}
                      className={`w-full py-2 px-3 rounded-xl border font-bold text-[10px] flex items-center gap-2 transition-all cursor-pointer
                        ${selectedBrush.id === brush.id
                          ? 'bg-pink-500 text-white shadow-inner border-pink-400'
                          : 'bg-white shadow-sm border-transparent hover:text-pink-500'}`}
                    >
                      {brush.icon}
                      {brush.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest select-none">
                  <span>Brush Radius</span>
                  <span>{brushSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="2" max="25" step="1"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="neu-slider cursor-pointer pointer-events-auto"
                />
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* GRAPHITE PORTFOLIO GALLERY CARDS */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow items-stretch">
          {GALLERY_DRAWINGS.map((draw, idx) => (
            <div key={idx} className="neu-out rounded-xl border border-white/60 p-5 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-500 bg-[#e0e5ec] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-purple-500"></div>
              
              <div className="space-y-4">
                {/* Traditional styled picture frame placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl flex items-center justify-center relative shadow-inner border border-gray-400/20 group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden">
                  <img src={draw.image} alt={draw.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-2 border border-dashed border-white/40 rounded-xl pointer-events-none mix-blend-overlay"></div>
                  <div className="absolute bottom-2 right-3 font-mono text-[7px] text-white bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm tracking-widest pointer-events-none">{draw.year}</div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-800 tracking-tight group-hover:text-pink-500 transition-colors">{draw.title}</h4>
                  <span className="text-[8px] font-extrabold uppercase text-gray-400 tracking-wider block mt-0.5">{draw.medium}</span>
                </div>
                
                <p className="text-[10px] font-semibold text-gray-500 leading-relaxed bg-white/30 border border-white/20 p-2.5 rounded-xl">
                  {draw.desc}
                </p>
              </div>

              <div className="border-t border-gray-300/40 pt-3 mt-4 flex items-center justify-between text-[7px] font-bold text-gray-400 uppercase tracking-widest select-none">
                <span>Josiah Sketch Study</span>
                <span>Traditional Pen</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
