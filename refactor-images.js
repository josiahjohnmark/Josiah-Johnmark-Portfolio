import fs from 'fs';
import path from 'path';

const appPath = path.join(process.cwd(), 'src/App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// Replace the iframe/sketch logic in projects grid with just an image linking to the site
const oldCardLogic = `                  {/* Interactive live iframe viewport frame or static fine art sketch */}
                  {proj.iframeUrl ? (
                    <div className="aspect-[16/9] neu-in rounded-3xl overflow-hidden mb-6 bg-[#e0e5ec] relative border border-white/40 shadow-inner p-1">
                      <div className="w-full h-full rounded-2xl overflow-hidden relative bg-white">
                        <iframe 
                          src={proj.iframeUrl} 
                          title={proj.title} 
                          className="w-full h-full border-0 pointer-events-auto z-10"
                          loading="lazy"
                          sandbox="allow-scripts allow-same-origin allow-forms"
                        />
                      </div>
                      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold text-cyan-600 border border-white/60 uppercase pointer-events-none z-20">
                        Interactive Frame
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[16/9] neu-in rounded-3xl overflow-hidden mb-6 flex items-center justify-center bg-[#e0e5ec] relative p-1 border border-white/40 shadow-inner">
                      <div className="w-full h-full rounded-2xl overflow-hidden bg-white/10 flex items-center justify-center relative">
                        <img 
                          src={proj.image} 
                          alt={proj.title}
                          className="w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-105" 
                        />
                      </div>
                      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold text-gray-600 border border-white/60 uppercase pointer-events-none">
                        Fine Sketch
                      </div>
                    </div>
                  )}`;

const newCardLogic = `                  {/* Image Screenshot Preview */}
                  <div className="aspect-[16/9] neu-in rounded-3xl overflow-hidden mb-6 flex items-center justify-center bg-[#e0e5ec] relative p-1 border border-white/40 shadow-inner cursor-pointer" onClick={() => window.open(proj.iframeUrl, '_blank')}>
                    <div className="w-full h-full rounded-2xl overflow-hidden bg-white/10 flex items-center justify-center relative">
                      <img 
                        src={proj.image} 
                        alt={proj.title}
                        className="w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold bg-cyan-600/90 px-4 py-2 rounded-xl text-xs backdrop-blur-sm shadow-lg">View Live Site</span>
                      </div>
                    </div>
                  </div>`;

content = content.replace(oldCardLogic, newCardLogic);

// Also remove iframe from the modal
const oldModalIframe = `                  {/* Browser Live Preview Mockup */}
                  {selectedProject.iframeUrl && (
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest select-none">
                        <span>Live Embedded Viewport Preview</span>
                        <a 
                          href={selectedProject.iframeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-600 hover:text-cyan-800 transition-all font-extrabold flex items-center gap-1 hover:underline hover:scale-105 active:scale-95"
                        >
                          Visit Main Site <ChevronRight size={10} className="pointer-events-none" />
                        </a>
                      </div>
                      
                      <div className="w-full rounded-2xl overflow-hidden border border-white/60 neu-out bg-[#e0e5ec] p-2 shadow-inner">
                        <div className="flex items-center gap-2 px-3 pb-2 border-b border-gray-300/40 select-none">
                          <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            <div className="w-2 h-2 rounded-full bg-green-400"></div>
                          </div>
                          <div className="flex-1 bg-white/40 border border-white/50 rounded-lg px-3 py-1.5 text-[8px] font-mono text-gray-500 flex items-center justify-between shadow-inner">
                            <span className="truncate">{selectedProject.iframeUrl}</span>
                            <Sparkles size={8} className="text-cyan-500 animate-pulse pointer-events-none" />
                          </div>
                        </div>
                        <div className="w-full aspect-[16/10] bg-white rounded-xl overflow-hidden relative shadow-md">
                          <iframe 
                            src={selectedProject.iframeUrl} 
                            title={selectedProject.title} 
                            className="w-full h-full border-0"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  )}`;

const newModalIframe = `                  {/* Screenshot Modal Preview */}
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
                  )}`;

content = content.replace(oldModalIframe, newModalIframe);

fs.writeFileSync(appPath, content);
console.log("Refactoring complete.");
