import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Code2, Server, Database, Cloud, Palette, Cpu, Sparkles, Code, 
  Terminal, Layers, AlertCircle, X, ChevronRight, Zap
} from 'lucide-react';

interface WebStackModalProps {
  onClose: () => void;
  playSynthNote: (freq: number, keyName: string) => void;
}

interface TechNode {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'infra' | 'styling';
  icon: React.ReactNode;
  freq: number;
  description: string;
  experience: string;
  whyUseful: string;
  codeSnippet: string;
  connections: string[];
  x: number; // percentage
  y: number; // percentage
}

const TECH_NODES: TechNode[] = [
  {
    id: 'react',
    name: 'React 19',
    category: 'frontend',
    icon: <Code2 size={20} className="text-[#61dafb]" />,
    freq: 523.25, // C5
    experience: "Expert / 5+ Years",
    description: "Component-driven single page architectures, fluid UI states, and immersive client experiences.",
    whyUseful: "React 19's direct Actions API, Server Actions, and high-performance suspense hydration form the bedrock of my interactive client-side design patterns.",
    codeSnippet: `// Immersive Neumorphic Button component
export const TouchButton = ({ children, onClick }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <button 
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={onClick}
      className={\`px-6 py-3 rounded-2xl transition-all duration-300 \${
        pressed 
          ? 'shadow-[inset_4px_4px_8px_#bebec9,inset_-4px_-4px_8px_#ffffff]' 
          : 'shadow-[6px_6px_12px_#bebec9,-6px_-6px_12px_#ffffff]'
      }\`}
    >
      {children}
    </button>
  );
};`,
    connections: ['next', 'tailwind'],
    x: 20,
    y: 35
  },
  {
    id: 'next',
    name: 'Next.js 15',
    category: 'frontend',
    icon: <Layers size={20} className="text-gray-800" />,
    freq: 587.33, // D5
    experience: "Expert / 3+ Years",
    description: "Server-side rendering, optimized static site generation, React Server Components, and seamless routing pipelines.",
    whyUseful: "Next.js routes and layouts structure scalable content systems, providing excellent SEO, dynamic page caching, and sub-second Largest Contentful Paint.",
    codeSnippet: `// Optimized Page Routing & Dynamic Streaming
import { Suspense } from 'react';
import { BentoGrid, BentoSkeleton } from '@/components/BentoGrid';

export default async function PortfolioPage() {
  return (
    <main className="min-h-screen p-8 bg-[#e0e5ec]">
      <h1 className="text-4xl font-bold tracking-tight">Ecosystem</h1>
      <Suspense fallback={<BentoSkeleton />}>
        <BentoGrid fetchUrl="/api/projects" />
      </Suspense>
    </main>
  );
}`,
    connections: ['react', 'node'],
    x: 50,
    y: 15
  },
  {
    id: 'tailwind',
    name: 'TailwindCSS v4',
    category: 'styling',
    icon: <Palette size={20} className="text-[#38bdf8]" />,
    freq: 659.25, // E5
    experience: "Expert / 4+ Years",
    description: "Rapid design token alignment, custom layout matrices, and optimized fluid layout systems.",
    whyUseful: "Tailwind's unified utility architecture fits perfectly alongside Framer Motion to craft custom glassmorphism and beautiful responsive layouts.",
    codeSnippet: `/* Glassmorphic card styling with Tailwind v4 */
.premium-card {
  @apply relative overflow-hidden rounded-[2rem] border border-white/80
         bg-white/40 backdrop-blur-md shadow-[10px_10px_30px_rgba(0,0,0,0.03)]
         hover:-translate-y-1.5 transition-all duration-500;
}`,
    connections: ['react'],
    x: 18,
    y: 75
  },
  {
    id: 'node',
    name: 'Node.js',
    category: 'backend',
    icon: <Server size={20} className="text-[#339933]" />,
    freq: 698.46, // F5
    experience: "Expert / 4+ Years",
    description: "Scalable REST APIs, websocket message systems, real-time background queues, and secure integrations.",
    whyUseful: "Provides secure modular business logic, handling high concurrent loads, background token parsing, and secure database CRUD operations.",
    codeSnippet: `// Scalable WebSocket real-time event broker
import { WebSocketServer } from 'ws';

export function setupBroker(server) {
  const wss = new WebSocketServer({ noServer: true });
  wss.on('connection', (ws) => {
    ws.on('message', (data) => {
      // Broadcast real-time telemetry
      const packet = JSON.parse(data.toString());
      wss.clients.forEach(client => {
        if (client.readyState === 1) client.send(JSON.stringify(packet));
      });
    });
  });
  return wss;
}`,
    connections: ['next', 'postgres', 'aws'],
    x: 50,
    y: 55
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    category: 'backend',
    icon: <Database size={20} className="text-[#336791]" />,
    freq: 783.99, // G5
    experience: "Advanced / 3+ Years",
    description: "Relational modeling, robust index configurations, and complex transactional queries.",
    whyUseful: "Safeguards structural data consistency with ACID guarantees, allowing robust lookup queries and index adjustments for immediate response times.",
    codeSnippet: `-- Highly optimized indexing for relational search queries
CREATE INDEX CONCURRENTLY idx_projects_slug 
ON projects(slug) 
WHERE status = 'published';

SELECT p.id, p.title, json_agg(t.name) as tags
FROM projects p
LEFT JOIN project_tags pt ON pt.project_id = p.id
LEFT JOIN tags t ON t.id = pt.tag_id
GROUP BY p.id;`,
    connections: ['node'],
    x: 82,
    y: 35
  },
  {
    id: 'aws',
    name: 'AWS S3 & EC2',
    category: 'infra',
    icon: <Cloud size={20} className="text-[#FF9900]" />,
    freq: 880.00, // A5
    experience: "Advanced / 3+ Years",
    description: "Secure object buckets, virtual servers, reverse proxy routing, and cloud delivery pipelines.",
    whyUseful: "Ensures highly available digital assets, rapid delivery caching, and robust security walls guarding API endpoints.",
    codeSnippet: `# S3 Cloud Asset caching alignment
aws s3 sync ./dist s3://josiah-portfolio-bucket \\
  --cache-control "max-age=31536000,public,immutable" \\
  --delete`,
    connections: ['node'],
    x: 82,
    y: 75
  }
];

export default function WebStackModal({ onClose, playSynthNote }: WebStackModalProps) {
  const [selectedNode, setSelectedNode] = useState<TechNode>(TECH_NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const handleNodeClick = (node: TechNode) => {
    playSynthNote(node.freq, node.id);
    setSelectedNode(node);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'frontend': return 'border-cyan-400 text-cyan-600 bg-cyan-50';
      case 'backend': return 'border-emerald-400 text-emerald-600 bg-emerald-50';
      case 'styling': return 'border-pink-400 text-pink-600 bg-pink-50';
      case 'infra': return 'border-amber-400 text-amber-600 bg-amber-50';
      default: return 'border-gray-400 text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <p className="text-xs text-gray-500 leading-relaxed font-semibold">
        Explore my core technical ecosystem below. Click on any node in the glowing map to check its connection paths, architecture metrics, and view real production code snippets!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-grow min-h-[420px]">
        {/* Interactive Neural Node Graph (7 cols) */}
        <div className="lg:col-span-6 xl:col-span-7 neu-in rounded-2xl p-4 relative overflow-hidden flex items-center justify-center min-h-[300px] border border-white/60">
          
          {/* Dynamic Grid GridLines overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ 
                 backgroundImage: 'radial-gradient(#4a5568 1.5px, transparent 1.5px)', 
                 backgroundSize: '24px 24px' 
               }} />

          {/* SVG Connection Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
              </linearGradient>
              <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Draw active connected pathways */}
            {TECH_NODES.map(node => {
              return node.connections.map(targetId => {
                const targetNode = TECH_NODES.find(t => t.id === targetId);
                if (!targetNode) return null;

                const isPathActive = 
                  selectedNode.id === node.id || 
                  selectedNode.id === targetNode.id ||
                  hoveredNode === node.id ||
                  hoveredNode === targetNode.id;

                return (
                  <motion.line
                    key={`${node.id}-${targetId}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${targetNode.x}%`}
                    y2={`${targetNode.y}%`}
                    stroke={isPathActive ? 'url(#glowGrad)' : '#cbd5e1'}
                    strokeWidth={isPathActive ? 2.5 : 1}
                    strokeDasharray={isPathActive ? 'none' : '4,4'}
                    filter={isPathActive ? 'url(#glowFilter)' : 'none'}
                    animate={{
                      strokeWidth: isPathActive ? 2.5 : 1,
                      opacity: isPathActive ? 1 : 0.4
                    }}
                    transition={{ duration: 0.3 }}
                  />
                );
              });
            })}
          </svg>

          {/* Floating Nodes */}
          {TECH_NODES.map(node => {
            const isSelected = selectedNode.id === node.id;
            const isHovered = hoveredNode === node.id;
            const catColors = getCategoryColor(node.category);

            return (
              <motion.button
                key={node.id}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`absolute w-14 h-14 rounded-full flex flex-col items-center justify-center z-10 border transition-all pointer-events-auto cursor-pointer
                  ${isSelected 
                    ? 'bg-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-110 border-cyan-400 font-extrabold z-20' 
                    : 'bg-[#e0e5ec] shadow-[4px_4px_10px_#bebec9,-4px_-4px_10px_#ffffff] hover:scale-105 hover:bg-white border-transparent'
                  }`}
                style={{ 
                  left: `${node.x}%`, 
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-center gap-0.5">
                  {node.icon}
                  <span className="text-[7px] font-black uppercase tracking-tight block max-w-[50px] text-center truncate">{node.name.split(' ')[0]}</span>
                </div>

                {/* Animated halo pulses */}
                {isSelected && (
                  <motion.div 
                    layoutId="nodeHalo"
                    className="absolute -inset-1 rounded-full border border-cyan-400/50 animate-ping pointer-events-none"
                    style={{ animationDuration: '2s' }}
                  />
                )}
              </motion.button>
            );
          })}
          
          {/* Centered Glowing Graph Core Indicator */}
          <div className="absolute text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 pointer-events-none select-none bottom-3 text-center w-full">
            Tactile Dependency Map
          </div>
        </div>

        {/* Selected Node Details Sidebar (5 cols) */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-4">
          <div className="neu-out rounded-xl p-5 border border-white/60 space-y-4 flex-grow flex flex-col">
            
            {/* Header / Category Badge */}
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${getCategoryColor(selectedNode.category)}`}>
                  {selectedNode.category}
                </span>
                <h3 className="text-xl font-bold text-gray-800 tracking-tight mt-1 flex items-center gap-1.5">
                  {selectedNode.name}
                  <Zap size={14} className="text-cyan-500 fill-cyan-400" />
                </h3>
              </div>
              <span className="text-[9px] font-bold text-gray-500 font-mono text-right">{selectedNode.experience}</span>
            </div>

            {/* Description Paragraph */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-gray-700 leading-relaxed">
                {selectedNode.description}
              </p>
              <p className="text-[10px] font-semibold text-gray-500 bg-white/40 border border-white/30 rounded-xl p-3 leading-relaxed">
                <span className="font-bold text-cyan-600 uppercase tracking-widest block text-[8px] mb-1">Architecture Integration</span>
                {selectedNode.whyUseful}
              </p>
            </div>

            {/* Interactive Code Editor Pane */}
            <div className="flex-grow flex flex-col min-h-[160px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-950 font-mono text-[9px] text-slate-300">
              <div className="bg-slate-950 px-3 py-1.5 flex justify-between items-center text-slate-500 text-[8px] font-bold tracking-wider select-none border-b border-slate-900">
                <span>{selectedNode.id === 'postgres' ? 'SQL' : 'TYPESCRIPT'} COMPILER</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                </span>
              </div>
              <div className="p-3.5 flex-grow overflow-x-auto overflow-y-auto whitespace-pre leading-relaxed select-text font-medium text-cyan-400/90 max-h-[180px]">
                <code>{selectedNode.codeSnippet}</code>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
