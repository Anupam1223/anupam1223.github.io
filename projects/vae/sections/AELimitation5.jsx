import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, BrainCircuit, 
  ArrowRight, ArrowDown, AlertTriangle, 
  Zap, Crosshair, XCircle, CheckCircle, 
  Target, Layers, Move, Image as ImageIcon, 
  Sparkles, ShieldAlert, GitMerge, Eye, Cloud, 
  Hexagon, HelpCircle, Calculator, Search, 
  Maximize, Minimize, Compass
} from 'lucide-react';

// --- SLIDE 1: The Vanilla Autoencoder (Recap) ---
const VanillaAESlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center shrink-0">Autoencoders Revisited: The Baseline</h2>
      <p className="text-slate-600 mb-10 text-center max-w-3xl mx-auto shrink-0 text-sm md:text-base">
        Standard Autoencoders (AEs) are excellent at <strong>compression</strong> and <strong>reconstruction</strong>. But when we try to use them as <em>generative</em> models (to create new things), they fall apart.
      </p>

      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-5xl mx-auto pb-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full flex flex-col items-center relative">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 text-center">The Standard Objective: Minimize MSE</h3>
           <div className="flex items-center justify-between w-full max-w-4xl relative z-10">
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] font-bold text-slate-500 mb-2 font-mono uppercase">Input (x)</span>
                <div className="w-20 h-20 bg-slate-100 rounded-lg border-2 border-slate-300 shadow-md flex items-center justify-center text-4xl">🖼️</div>
              </div>
              <ArrowRight className="text-slate-300 w-6 h-6" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-indigo-600 mb-2 uppercase">Encoder f(x)</span>
                <div className="w-20 h-28 bg-indigo-600 rounded-lg shadow-lg border-2 border-indigo-400" style={{ clipPath: 'polygon(0% 0%, 100% 20%, 100% 80%, 0% 100%)' }}></div>
              </div>
              <ArrowRight className="text-slate-300 w-6 h-6" />
              <div className="flex flex-col items-center relative bg-purple-50 p-3 rounded-xl border border-purple-200">
                <span className="text-[9px] font-bold text-purple-800 mb-2 uppercase tracking-widest">Latent Space (Z)</span>
                <div className="w-10 h-10 bg-white rounded-full border-2 border-purple-400 shadow-inner flex items-center justify-center">
                  <div className="w-3 h-3 bg-purple-600 rounded-full shadow-md"></div>
                </div>
              </div>
              <ArrowRight className="text-slate-300 w-6 h-6" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-blue-600 mb-2 uppercase">Decoder g(z)</span>
                <div className="w-20 h-28 bg-slate-800 rounded-lg shadow-lg border-2 border-slate-700" style={{ clipPath: 'polygon(0% 20%, 100% 0%, 100% 100%, 0% 80%)' }}></div>
              </div>
              <ArrowRight className="text-slate-300 w-6 h-6" />
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] font-bold text-emerald-600 mb-2 font-mono uppercase">Output (x̂)</span>
                <div className="w-20 h-20 bg-white rounded-lg border-2 border-emerald-400 shadow-lg flex items-center justify-center text-4xl">🖼️</div>
              </div>
           </div>
           <div className="mt-10 bg-rose-50 border-2 border-rose-200 p-4 rounded-xl flex flex-col items-center max-w-md w-full">
              <div className="font-mono text-xs font-bold text-rose-800 bg-white px-4 py-2 rounded-lg border border-rose-100 shadow-sm">
                L(x, x̂) = || x - g(f(x)) ||²
              </div>
              <p className="text-[11px] text-rose-700 mt-3 text-center">
                The model ONLY cares about pixel-perfect reconstruction. It ignores the structural health of the latent space Z.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- SLIDE 2: Unstructured Latent Space ---
const UnstructuredSpaceSlide = () => {
  const [activeNode, setActiveNode] = useState('data1');
  const nodes = [
    { id: 'data1', label: 'z_data1', type: 'circle', color: 'bg-blue-400', x: 15, output: 'Realistic Output', outColor: 'bg-emerald-400' },
    { id: 'data2', label: 'z_data2', type: 'circle', color: 'bg-blue-400', x: 35, output: 'Realistic Output', outColor: 'bg-emerald-400' },
    { id: 'interp', label: 'z_interp', type: 'diamond', color: 'bg-lime-400', x: 55, output: 'Plausible Transition', outColor: 'bg-lime-400' },
    { id: 'hole', label: 'z_hole', type: 'diamond', color: 'bg-rose-400', x: 75, output: 'Unrealistic / Blurry', outColor: 'bg-rose-400' },
    { id: 'far', label: 'z_far', type: 'diamond', color: 'bg-red-500', x: 92, output: 'Nonsensical', outColor: 'bg-red-500' },
  ];

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-800 text-white">
      <h2 className="text-3xl font-bold mb-2 text-center">Limitation 1: Unstructured Latent Space</h2>
      <p className="text-slate-300 text-center max-w-4xl mx-auto mb-6 text-sm">AE manifolds are full of "holes". Sampling from these gaps yields nonsensical outputs.</p>
      
      <div className="flex-grow bg-slate-100 rounded-xl p-6 flex flex-col relative shadow-2xl text-slate-800">
        <div className="w-full h-40 border-2 border-slate-800 relative bg-slate-200 shadow-inner mb-20 rounded-lg">
           <span className="absolute top-2 left-4 text-[10px] font-bold uppercase text-slate-400">Latent Space Z</span>
           <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-[55%] h-20 bg-slate-300/50 border border-slate-400 rounded-lg"></div>
           {nodes.map((node) => (
             <button key={node.id} onClick={() => setActiveNode(node.id)} className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all" style={{ left: `${node.x}%` }}>
               <div className={`${node.color} border-2 border-slate-800 flex items-center justify-center shadow-md ${node.type === 'circle' ? 'w-12 h-12 rounded-full' : 'w-10 h-10 rotate-45'} ${activeNode === node.id ? 'ring-4 ring-indigo-500 scale-110 z-20' : 'opacity-80 z-10'}`}>
                 <span className={`text-[9px] font-bold font-mono ${node.type === 'diamond' ? '-rotate-45' : ''}`}>{node.label}</span>
               </div>
             </button>
           ))}
        </div>

        <div className="w-full h-24 border-2 border-slate-800 bg-slate-200 shadow-inner relative flex items-center justify-between px-4 rounded-lg">
           <span className="absolute top-1 left-4 text-[10px] font-bold uppercase text-slate-400">Decoded Output g(Z)</span>
           {nodes.map((node) => (
             <motion.div key={`out-${node.id}`} animate={{ opacity: activeNode === node.id ? 1 : 0.2, scale: activeNode === node.id ? 1.05 : 0.95 }} className={`flex-1 mx-1 ${node.outColor} border-2 border-slate-700 h-14 flex flex-col items-center justify-center rounded shadow-sm`}>
               <span className="text-[9px] font-mono font-bold">g({node.label})</span>
               <span className="text-[8px] leading-tight text-center font-bold">{node.output}</span>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
};

// --- SLIDE 3: No Explicit Prior (Interactive Sampling Simulator) ---
const NoPriorSlide = () => {
  const [samples, setSamples] = useState([]);
  const [showGaussian, setShowGaussian] = useState(false);

  const empiricalBlobs = [
    { x: 30, y: 30, r: 15 },
    { x: 70, y: 40, r: 12 },
    { x: 45, y: 75, r: 18 },
  ];

  const handleSample = () => {
    const rx = 50 + (Math.random() + Math.random() + Math.random() - 1.5) * 30;
    const ry = 50 + (Math.random() + Math.random() + Math.random() - 1.5) * 30;
    
    let hit = false;
    for (let blob of empiricalBlobs) {
      const dist = Math.sqrt(Math.pow(rx - blob.x, 2) + Math.pow(ry - blob.y, 2));
      if (dist < blob.r) hit = true;
    }

    setSamples(prev => [...prev.slice(-4), { id: Date.now(), x: rx, y: ry, hit }]);
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <h2 className="text-3xl font-bold mb-2 text-center">Limitation 2: No Explicit Prior p(z)</h2>
      <p className="text-slate-600 text-center max-w-4xl mx-auto mb-6 text-sm md:text-base">
        To generate new data, we must sample from a distribution <span className="font-mono bg-slate-200 px-1 rounded text-sm">p(z)</span>. Standard AEs don't learn one. If we naively guess a simple Gaussian, it misaligns with the complex trained data.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Visualizer Container */}
        <div className="flex-[1.2] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col relative overflow-hidden">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Latent Space Sampling Simulator</h3>
             <button 
               onClick={() => setShowGaussian(!showGaussian)}
               className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${showGaussian ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
             >
               {showGaussian ? 'Hide Naive Gaussian Prior' : 'Overlay Naive Gaussian Prior'}
             </button>
           </div>
           
           <div className="flex-grow w-full bg-slate-900 rounded-xl relative overflow-hidden border-2 border-slate-800 cursor-crosshair" onClick={handleSample}>
              
              {/* Empirical Data Blobs */}
              {empiricalBlobs.map((blob, i) => (
                <div key={`blob-${i}`} className="absolute bg-blue-500/40 blur-xl rounded-full" 
                     style={{ left: `${blob.x}%`, top: `${blob.y}%`, width: `${blob.r*2}%`, height: `${blob.r*2}%`, transform: 'translate(-50%, -50%)' }}>
                </div>
              ))}
              
              {/* The "Holes" */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none">
                 <span className="text-white text-3xl font-bold tracking-[2em] uppercase">Void</span>
                 <span className="text-white text-3xl font-bold tracking-[2em] uppercase">Void</span>
              </div>

              {/* Naive Gaussian Overlay */}
              <AnimatePresence>
                {showGaussian && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }} 
                    animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }} 
                    exit={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
                    className="absolute top-1/2 left-1/2 w-[80%] h-[80%] rounded-full border-4 border-dashed border-indigo-400/50 bg-indigo-500/10 pointer-events-none flex items-center justify-center"
                  >
                    <span className="text-indigo-300 font-mono font-bold text-sm bg-slate-900/50 px-2 rounded whitespace-nowrap">Arbitrary N(0, I)</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dropped Samples */}
              {samples.map((s) => (
                <motion.div 
                  key={s.id} 
                  initial={{ scale: 0, opacity: 1, x: "-50%", y: "-50%" }} 
                  animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
                  className={`absolute w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${s.hit ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,1)]'}`}
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                >
                  {s.hit && <CheckCircle className="w-3 h-3 text-white absolute -top-4 -right-4" />}
                  {!s.hit && <XCircle className="w-3 h-3 text-white absolute -top-4 -right-4" />}
                </motion.div>
              ))}

              <div className="absolute bottom-4 left-0 w-full flex justify-center pointer-events-none">
                <span className="bg-white/90 text-slate-800 text-xs font-bold px-4 py-2 rounded-full shadow-lg">Click anywhere to sample z</span>
              </div>
           </div>
        </div>

        {/* Right: Explanation Blocks */}
        <div className="flex-1 flex flex-col gap-4">
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-500"/> How to Sample?</h4>
             <p className="text-sm text-slate-600 leading-relaxed">
               The blue clouds represent the <strong>empirical distribution</strong>—where the actual training images mapped to. It is complex, fragmented, and impossible to sample from mathematically.
             </p>
           </div>

           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-rose-500"/> Arbitrary Choices Fail</h4>
             <p className="text-sm text-slate-600 leading-relaxed mb-4">
               If we overlay a simple, convenient Gaussian curve (the dashed circle) and pull random numbers from it, <strong>most of our samples fall into the empty "voids"</strong>.
             </p>
             <div className="flex gap-2">
                <div className="flex-1 bg-emerald-50 border border-emerald-200 p-2 rounded flex flex-col items-center">
                  <span className="text-[10px] font-bold text-emerald-700">Hit Blue Cloud</span>
                  <div className="text-xl mt-1">🖼️</div>
                  <span className="text-[9px] text-emerald-600 mt-1">Realistic</span>
                </div>
                <div className="flex-1 bg-rose-50 border border-rose-200 p-2 rounded flex flex-col items-center">
                  <span className="text-[10px] font-bold text-rose-700">Hit Void (Likely)</span>
                  <div className="text-xl mt-1 opacity-50 blur-[2px]">🖼️</div>
                  <span className="text-[9px] text-rose-600 mt-1">Garbage/Blurry</span>
                </div>
             </div>
           </div>

           <div className="bg-amber-50 p-4 rounded-2xl shadow-sm border border-amber-200">
             <h4 className="font-bold text-amber-900 mb-1 text-sm">Lack of Probabilistic Grounding</h4>
             <p className="text-xs text-amber-800">Without a defined <span className="font-mono">p(z)</span> that the model is explicitly trained to respect, standard AEs simply lack the mathematical foundation to be reliable generative engines.</p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 4: Poor Interpolation Quality ---
const InterpolationSlide = () => {
  const [interp, setInterp] = useState(50);
  
  const isHole = interp > 30 && interp < 70;
  const holeIntensity = isHole ? Math.min((interp - 30) / 20, (70 - interp) / 20) : 0;

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <h2 className="text-3xl font-bold mb-2 text-center">Limitation 3: Poor Interpolation Quality</h2>
      <p className="text-slate-400 text-center max-w-4xl mx-auto mb-8 text-sm md:text-base">
        Taking a convex combination <span className="font-mono bg-slate-800 px-1 rounded text-sm text-slate-300">z_interp = (1-t)z_a + tz_b</span> draws a straight line in latent space. But because the AE only cares about reconstruction, this line often cuts through unmapped territory.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: The Visual Interpolation Map */}
        <div className="flex-[1.5] bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700 flex flex-col relative items-center justify-center">
           
           <div className="w-full h-48 relative flex items-center justify-between mb-8">
              <div className="w-32 h-32 bg-blue-500/20 border-2 border-blue-500 rounded-full blur-[2px] absolute left-[5%] flex items-center justify-center">
                 <span className="text-blue-200 font-bold text-xs uppercase opacity-50">Apples</span>
              </div>
              
              <div className="w-32 h-32 bg-orange-500/20 border-2 border-orange-500 rounded-full blur-[2px] absolute right-[5%] flex items-center justify-center">
                 <span className="text-orange-200 font-bold text-xs uppercase opacity-50">Oranges</span>
              </div>

              <div className="absolute left-[35%] right-[35%] h-full flex flex-col items-center justify-center">
                 <AlertTriangle className="text-rose-500 w-12 h-12 opacity-30 mb-2" />
                 <span className="text-rose-500/50 font-bold tracking-widest uppercase text-xs text-center">Unmapped<br/>Dead Zone</span>
              </div>

              <div className="absolute left-[15%] right-[15%] h-1 border-t-2 border-dashed border-slate-400 top-1/2 transform -translate-y-1/2"></div>
              
              <div className="absolute left-[15%] top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
              <div className="absolute right-[15%] top-1/2 transform -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
              
              <motion.div 
                className="absolute top-1/2 w-6 h-6 bg-emerald-400 border-4 border-white shadow-[0_0_15px_rgba(52,211,153,1)] rounded-full transform -translate-y-1/2 -translate-x-1/2 z-10"
                style={{ left: `calc(15% + ${interp}% * 0.7)` }}
              />
           </div>

           <div className="w-48 h-48 bg-black rounded-xl border-4 border-slate-600 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden relative mb-8 flex items-center justify-center text-8xl">
              <div className="absolute inset-0 flex items-center justify-center transition-opacity" style={{ opacity: 1 - (interp/100) }}>🍎</div>
              <div className="absolute inset-0 flex items-center justify-center transition-opacity" style={{ opacity: (interp/100) }}>🍊</div>
              
              {isHole && (
                <div className="absolute inset-0 backdrop-blur-md bg-white/10 flex items-center justify-center" style={{ opacity: holeIntensity * 2 }}>
                  <div className="w-full h-full flex flex-col items-center justify-center mix-blend-difference">
                    <span className="text-rose-500 font-mono text-sm font-bold bg-black/80 px-2 py-1 border border-rose-500 transform scale-150 rotate-12">
                      GLITCH
                    </span>
                    <span className="text-xs font-mono text-white mt-4 bg-black/50">Decoder Failed</span>
                  </div>
                </div>
              )}
           </div>

           <div className="w-full max-w-md flex flex-col gap-2 relative z-20">
             <div className="flex justify-between text-xs font-bold font-mono">
               <span className="text-blue-400">z_a (t=0)</span>
               <span className="text-slate-400">t = {(interp/100).toFixed(2)}</span>
               <span className="text-orange-400">z_b (t=1)</span>
             </div>
             <input type="range" min="0" max="100" value={interp} onChange={(e) => setInterp(e.target.value)} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
           </div>
        </div>

        {/* Right: Explanations */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           <div className="bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700">
             <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-2"><Move className="w-5 h-5 text-indigo-400"/> Path Through Bad Regions</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               Because the empirical clusters are irregularly scattered, drawing a straight line <span className="font-mono text-xs">z_interp</span> between two valid images almost certainly cuts through "holes" or sparsely populated regions.
             </p>
           </div>
           
           <div className="bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700 mt-2">
             <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-2"><Eye className="w-5 h-5 text-rose-400"/> Focus on Reconstruction, Not Smoothness</h4>
             <p className="text-sm text-slate-400 leading-relaxed mb-4">
               The loss function only penalized the model for failing to reconstruct <em>known</em> apples and oranges. It never provided a penalty for making the space <em>between</em> them look horrible.
             </p>
             <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg flex items-center justify-between text-xs">
                <span className="text-slate-500">Output:</span>
                <span className="text-rose-400 font-bold">Unnatural, abrupt transitions</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- SLIDE 5: Difficulty Generating Novel Samples ---
const DecoderSpecificitySlide = () => {
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  
  const trainingPoints = [
    { x: 20, y: 30, emoji: "🐶" },
    { x: 70, y: 20, emoji: "🐱" },
    { x: 80, y: 70, emoji: "🦊" },
    { x: 30, y: 80, emoji: "🐻" }
  ];

  const getMinDistance = () => {
    let minD = 1000;
    let closestEmoji = "❓";
    for (let p of trainingPoints) {
      const d = Math.sqrt(Math.pow(p.x - cursorPos.x, 2) + Math.pow(p.y - cursorPos.y, 2));
      if (d < minD) {
        minD = d;
        closestEmoji = p.emoji;
      }
    }
    return { minD, closestEmoji };
  };

  const { minD, closestEmoji } = getMinDistance();

  let renderState = 'nonsense';
  let blur = 'blur(10px)';
  let opacity = 0.2;
  
  if (minD < 12) {
    renderState = 'perfect';
    blur = 'blur(0px)';
    opacity = 1;
  } else if (minD < 30) {
    renderState = 'collapse';
    const blurVal = 1 + ((minD - 12) / 18) * 7;
    blur = `blur(${blurVal}px)`;
    opacity = 1 - ((minD - 12) / 18) * 0.5;
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Limitation 4: Difficulty Generating Novel Samples</h2>
      <p className="text-slate-600 text-center max-w-4xl mx-auto mb-8 text-sm md:text-base">
        The ultimate test for a generative model is creating something <strong>new</strong>. Standard AEs suffer from <em>Decoder Specificity</em>—they only know how to decode the exact points they memorized.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: Interactive Latent Radar Map */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-slate-200 flex flex-col items-center justify-center">
           <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-widest flex items-center gap-2">
             <Crosshair className="w-5 h-5"/> Hover Latent Space
           </h3>
           
           <div 
             className="w-full h-72 bg-slate-900 rounded-xl relative overflow-hidden cursor-crosshair border-4 border-slate-800 shadow-inner"
             onMouseMove={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const x = ((e.clientX - rect.left) / rect.width) * 100;
               const y = ((e.clientY - rect.top) / rect.height) * 100;
               setCursorPos({x, y});
             }}
             onMouseLeave={() => setCursorPos({x: 50, y: 50})}
           >
              {/* Render Safe Zones (Training points) */}
              {trainingPoints.map((p, i) => (
                <div key={i} className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                   <div className="w-24 h-24 bg-emerald-500/20 rounded-full blur-xl absolute"></div>
                   <div className="w-12 h-12 bg-emerald-500/40 rounded-full blur-md absolute"></div>
                   <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399] z-10"></div>
                </div>
              ))}

              {/* Cursor Target */}
              <motion.div 
                className="absolute w-6 h-6 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none mix-blend-difference"
                animate={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
                transition={{ type: "tween", ease: "linear", duration: 0.05 }}
              />
           </div>

           <p className="text-xs text-slate-500 mt-4 text-center">
             Green auras = Memorized Training Data.<br/>Dark areas = Untrained Void.
           </p>
        </div>

        {/* Right: Decoder Output and Explanations */}
        <div className="flex-1 flex flex-col gap-4">
           
           {/* Live Decoder Output Box */}
           <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 flex flex-col items-center text-white h-48">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Live Decoder Output</span>
              
              <div className="w-24 h-24 bg-black rounded-xl border-2 border-slate-600 flex items-center justify-center text-6xl relative overflow-hidden mb-2">
                 {/* The Object */}
                 <div className="absolute inset-0 flex items-center justify-center transition-all duration-75" style={{ filter: blur, opacity: opacity }}>
                   {closestEmoji}
                 </div>
                 
                 {/* Nonsense Static Overlay */}
                 {renderState === 'nonsense' && (
                   <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 4px)' }}></div>
                 )}
              </div>

              {/* Status Badge */}
              <div className="h-6">
                {renderState === 'perfect' && <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded border border-emerald-500/50">Perfect Copy (Memorized)</span>}
                {renderState === 'collapse' && <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-1 rounded border border-amber-500/50">Blurry / Mode Collapse</span>}
                {renderState === 'nonsense' && <span className="bg-rose-500/20 text-rose-400 text-xs font-bold px-2 py-1 rounded border border-rose-500/50">Out of Distribution (Noise)</span>}
              </div>
           </div>

           {/* Explanations */}
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h4 className="font-bold text-indigo-900 mb-1">Decoder Specificity</h4>
             <p className="text-sm text-slate-600">
               The decoder becomes highly specialized at reconstructing the exact manifold learned during training. It fails to generalize generative capabilities to wider areas of the latent space.
             </p>
           </div>
           
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex-grow">
             <h4 className="font-bold text-indigo-900 mb-1">Implicit Mode Collapse</h4>
             <p className="text-sm text-slate-600">
               If you step slightly away from a training point, the decoder doesn't generate a "novel, varied" output. It either generates a blurry version of the closest training point, or collapses into static.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- SLIDE 6: Conclusion / Transition to VAEs ---
const ConclusionSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex-grow flex flex-col items-center justify-center max-w-5xl mx-auto w-full">
        <div className="bg-slate-800 rounded-3xl p-10 shadow-2xl border-b-8 border-indigo-600 w-full relative overflow-hidden">
          
          <h2 className="text-3xl font-bold text-white mb-6 relative z-10 text-center">Why We Need Variational Autoencoders</h2>
          <p className="text-slate-300 text-base mb-10 relative z-10 text-center max-w-3xl mx-auto">
            Standard Autoencoders are highly specialized compression engines, <strong>not creative generators</strong>. Their objective function strictly optimizes for reconstruction, entirely ignoring the mathematical structure of the latent space.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-10">
             <div className="bg-slate-700/50 border border-slate-600 p-5 rounded-2xl flex items-start gap-4">
               <XCircle className="text-rose-400 shrink-0 w-6 h-6 mt-0.5" />
               <div>
                 <h4 className="font-bold text-slate-100 text-sm">Unstructured Manifold</h4>
                 <p className="text-slate-400 text-xs mt-1">Full of holes. Off-manifold points decode into pure garbage.</p>
               </div>
             </div>
             <div className="bg-slate-700/50 border border-slate-600 p-5 rounded-2xl flex items-start gap-4">
               <XCircle className="text-rose-400 shrink-0 w-6 h-6 mt-0.5" />
               <div>
                 <h4 className="font-bold text-slate-100 text-sm">No Prior Distribution</h4>
                 <p className="text-slate-400 text-xs mt-1">No defined boundary or mathematical shape to randomly sample from.</p>
               </div>
             </div>
             <div className="bg-slate-700/50 border border-slate-600 p-5 rounded-2xl flex items-start gap-4">
               <XCircle className="text-rose-400 shrink-0 w-6 h-6 mt-0.5" />
               <div>
                 <h4 className="font-bold text-slate-100 text-sm">Discontinuous Space</h4>
                 <p className="text-slate-400 text-xs mt-1">Interpolation fails; traversing space yields abrupt, unnatural changes.</p>
               </div>
             </div>
             <div className="bg-slate-700/50 border border-slate-600 p-5 rounded-2xl flex items-start gap-4">
               <XCircle className="text-rose-400 shrink-0 w-6 h-6 mt-0.5" />
               <div>
                 <h4 className="font-bold text-slate-100 text-sm">Decoder Specificity</h4>
                 <p className="text-slate-400 text-xs mt-1">Overfits to specific training points, failing to generate truly novel samples.</p>
               </div>
             </div>
          </div>

          <div className="bg-indigo-600 border border-indigo-400 p-6 rounded-xl relative z-10 flex items-center justify-between shadow-[0_0_30px_rgba(79,70,229,0.3)] mx-auto max-w-3xl">
             <div className="flex items-center gap-4">
               <div className="bg-white/20 p-3 rounded-full shrink-0"><Zap className="w-8 h-8 text-yellow-300"/></div>
               <div>
                 <h3 className="text-xl font-bold text-white mb-1">Enter the VAE</h3>
                 <p className="text-indigo-200 text-sm">VAEs introduce probabilistic grounding (the <strong>KL Divergence</strong> loss) to force the latent space into a smooth, continuous, densely populated shape!</p>
               </div>
             </div>
             <ArrowRight className="text-white w-10 h-10 shrink-0 hidden sm:block ml-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SLIDE 7: The Core Difference ---
const AEVsVAESlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-indigo-700 mb-2 text-center flex items-center gap-3">
          <HelpCircle className="w-8 h-8"/> The Core Confusion
        </h2>
        <p className="text-slate-600 text-center max-w-4xl mx-auto text-sm md:text-base bg-white p-4 rounded-xl border border-slate-200 shadow-sm italic">
          "Wait... you say Autoencoders have NO prior p(z) and have holes, but they clearly have a latent space and an encoder. Why?"
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* LEFT: Standard Autoencoder */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border-t-8 border-rose-500 p-6 flex flex-col relative overflow-hidden">
           <h3 className="text-2xl font-bold text-slate-800 mb-1">Standard Autoencoder</h3>
           <p className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-6">Deterministic Mapping</p>
           
           <p className="text-sm text-slate-600 mb-6 flex-grow">
             A Latent Space is just an empty coordinate system. A standard AE maps an image to a <strong>single, infinitely tiny point</strong> on that canvas. Because there is no rule <span className="font-mono text-xs">(no Prior p(z))</span> forcing these points into a specific arrangement, the space between the dots is totally meaningless.
           </p>

           <div className="w-full h-64 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border-4 border-slate-800">
             <div className="absolute w-2 h-2 bg-blue-500 rounded-full" style={{ left: '20%', top: '30%' }}></div>
             <div className="absolute w-2 h-2 bg-blue-500 rounded-full" style={{ left: '80%', top: '20%' }}></div>
             <div className="absolute w-2 h-2 bg-blue-500 rounded-full" style={{ left: '50%', top: '80%' }}></div>
             <ArrowDown className="absolute text-blue-400 w-8 h-8 transform -translate-y-8" style={{ left: 'calc(20% - 16px)', top: '30%' }} />
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <span className="text-white/20 font-bold text-2xl tracking-widest uppercase">Meaningless<br/>Void</span>
             </div>
             <div className="absolute bottom-2 bg-slate-800/80 px-2 py-1 rounded text-[10px] font-bold text-rose-400 font-mono">
               z = [0.42, -1.2] (Exact Point)
             </div>
           </div>
        </div>

        {/* RIGHT: Variational Autoencoder */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border-t-8 border-indigo-500 p-6 flex flex-col relative overflow-hidden">
           <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
             The Solution
           </div>
           
           <h3 className="text-2xl font-bold text-slate-800 mb-1">Variational Autoencoder</h3>
           <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-6">Probabilistic Mapping</p>
           
           <p className="text-sm text-slate-600 mb-6 flex-grow">
             A VAE maps an image to a <strong>probability cloud</strong> (a mean and variance). Then, a mathematical rule <span className="font-mono text-xs text-indigo-600 font-bold">(The Prior p(z))</span> forces all these clouds to pack tightly inside a standard shape. The overlapping fuzzy clouds completely eliminate the holes!
           </p>

           <div className="w-full h-64 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border-4 border-slate-800 shadow-inner">
             <div className="absolute w-[70%] h-[70%] border-2 border-dashed border-indigo-400/50 rounded-full flex items-center justify-center">
                <span className="absolute -top-6 text-indigo-300 font-mono text-[10px] font-bold whitespace-nowrap bg-slate-900 px-2">Prior p(z) ~ N(0, I)</span>
             </div>
             <div className="absolute w-24 h-24 bg-emerald-500/40 rounded-full blur-md" style={{ left: '40%', top: '40%', transform: 'translate(-50%, -50%)' }}></div>
             <div className="absolute w-20 h-20 bg-emerald-500/50 rounded-full blur-md" style={{ left: '60%', top: '45%', transform: 'translate(-50%, -50%)' }}></div>
             <div className="absolute w-28 h-28 bg-emerald-500/30 rounded-full blur-md" style={{ left: '50%', top: '60%', transform: 'translate(-50%, -50%)' }}></div>
             <ArrowDown className="absolute text-emerald-400 w-8 h-8 transform -translate-y-6" style={{ left: 'calc(40% - 16px)', top: '40%' }} />
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-overlay opacity-50">
               <span className="text-white font-bold text-2xl tracking-widest uppercase text-center leading-tight">Continuous<br/>Space</span>
             </div>
             <div className="absolute bottom-2 bg-slate-800/80 px-2 py-1 rounded text-[10px] font-bold text-emerald-400 font-mono">
               z ~ N(μ, σ²) (Probability Cloud)
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 8: Deterministic Math ---
const DeterministicMathSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <h2 className="text-3xl font-bold mb-4 text-center shrink-0">How the Standard AE Maps Data</h2>
      <p className="text-slate-600 mb-8 text-center max-w-3xl mx-auto shrink-0 text-sm md:text-base">
        A standard Autoencoder uses a <strong>Deterministic Neural Network</strong>. There is no probability, no sampling, and no Gaussian bell curve. It is just a series of hard mathematical equations.
      </p>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-6xl mx-auto flex-grow pb-8">
        
        {/* LEFT: Standard AE Mapping */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border-t-8 border-rose-500 p-8 flex flex-col relative w-full h-[450px]">
           <h3 className="font-bold text-xl text-slate-800 mb-1 flex items-center gap-2">
             <Calculator className="w-5 h-5 text-rose-500"/> Standard Autoencoder
           </h3>
           <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-6">Deterministic Mapping</p>
           
           <div className="flex-grow flex items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                 <div className="text-5xl bg-slate-100 p-2 rounded-lg border border-slate-300">🐈</div>
                 <span className="text-[10px] font-bold text-slate-500 mt-2">Input (x)</span>
              </div>

              <ArrowRight className="w-6 h-6 text-slate-300" />

              <div className="flex flex-col items-center bg-slate-800 text-white p-4 rounded-xl border-2 border-slate-700 shadow-lg relative">
                 <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Encoder Math</span>
                 <span className="font-mono text-xs mb-1">Layer 1: ReLU(W₁x + b₁)</span>
                 <span className="font-mono text-xs mb-1">Layer 2: ReLU(W₂x + b₂)</span>
                 <span className="font-mono text-xs font-bold text-rose-400">Output: W₃x + b₃</span>
              </div>

              <ArrowRight className="w-6 h-6 text-slate-300" />

              <div className="flex flex-col items-center">
                 <div className="bg-rose-100 border-2 border-rose-400 p-4 rounded-xl shadow-inner flex flex-col items-center">
                    <div className="w-4 h-4 bg-rose-500 rounded-full shadow-md mb-2"></div>
                    <span className="font-mono text-[10px] font-bold text-rose-800 bg-white px-2 py-1 rounded">
                      [45.2, -89.1]
                    </span>
                 </div>
                 <span className="text-[10px] font-bold text-rose-600 mt-2 text-center">Exact Coordinate<br/>(No Boundaries)</span>
              </div>
           </div>

           <div className="mt-4 bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs text-slate-600">
             The input is multiplied by weights (W) and biases (b). The result is a single, exact coordinate. The network can output <strong>any number it wants</strong>, as big or as small as it wants.
           </div>
        </div>

        {/* RIGHT: VAE Mapping (For contrast) */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border-t-8 border-indigo-500 p-8 flex flex-col relative w-full h-[450px]">
           <h3 className="font-bold text-xl text-slate-800 mb-1 flex items-center gap-2">
             <Target className="w-5 h-5 text-indigo-500"/> Variational Autoencoder
           </h3>
           <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-6">Probabilistic Mapping</p>
           
           <div className="flex-grow flex items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                 <div className="text-5xl bg-slate-100 p-2 rounded-lg border border-slate-300">🐈</div>
                 <span className="text-[10px] font-bold text-slate-500 mt-2">Input (x)</span>
              </div>

              <ArrowRight className="w-6 h-6 text-slate-300" />

              <div className="flex flex-col items-center bg-slate-800 text-white p-4 rounded-xl border-2 border-slate-700 shadow-lg">
                 <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Encoder Math</span>
                 <span className="font-mono text-[10px] mb-1">...Hidden Layers...</span>
                 <span className="font-mono text-[10px] font-bold text-indigo-300">Out 1: Mean (μ)</span>
                 <span className="font-mono text-[10px] font-bold text-emerald-300">Out 2: Variance (σ²)</span>
              </div>

              <ArrowRight className="w-6 h-6 text-slate-300" />

              <div className="flex flex-col items-center relative">
                 <div className="bg-indigo-50 border-2 border-indigo-400 p-4 rounded-xl shadow-inner flex items-center justify-center w-24 h-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-md rounded-full"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full shadow-md z-10"></div>
                 </div>
                 <span className="text-[10px] font-bold text-indigo-700 mt-2 text-center">Random Sample<br/>from Cloud</span>
              </div>
           </div>

           <div className="mt-4 bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs text-slate-600">
             The math outputs parameters for a <strong>probability cloud</strong>. We then randomly pick a point from inside that cloud.
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 9: The Wild West Latent Space ---
const WildWestSlide = () => {
  const [animState, setAnimState] = useState(0); 

  const aePoints = Array.from({length: 30}).map((_, i) => ({
    id: i,
    left: (Math.random() - 0.5) * 250 + 50,
    top: (Math.random() - 0.5) * 250 + 50,
    px: 0,
    py: 0
  }));

  const vaePoints = Array.from({length: 30}).map((_, i) => {
    const angle = Math.random() * 2 * Math.PI;
    const r = Math.sqrt(Math.random()) * 80; 
    return { 
      id: i, 
      left: 50, 
      top: 50, 
      px: Math.cos(angle) * r, 
      py: Math.sin(angle) * r 
    };
  });

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <h2 className="text-3xl font-bold mb-4 text-center shrink-0">The "Wild West" Latent Space</h2>
      <p className="text-slate-400 mb-6 text-center max-w-3xl mx-auto shrink-0 text-sm md:text-base">
        Because the standard Autoencoder has no Prior <span className="font-mono text-xs bg-slate-800 px-1 border border-slate-700 rounded">p(z)</span> pulling the points together, it throws data into an infinite void.
      </p>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-6xl mx-auto flex-grow pb-8">
        
        {/* Visualizer */}
        <div className="flex-[1.5] w-full h-[400px] bg-black rounded-2xl border-4 border-slate-700 relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: 'center center' }}></div>

           <AnimatePresence>
             {animState === 2 && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }} 
                 animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                 exit={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
                 className="absolute top-1/2 left-1/2 w-48 h-48 border-2 border-dashed border-indigo-500 rounded-full flex items-center justify-center bg-indigo-500/10 z-0"
               >
                 <span className="absolute -top-6 text-indigo-400 font-mono text-xs font-bold bg-slate-900 px-2 rounded">Prior N(0, I)</span>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="absolute top-4 left-4 z-20">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-900/80 px-3 py-1 rounded">Latent Canvas</span>
           </div>

           <div className="absolute top-1/2 left-1/2 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
             <Crosshair className="text-slate-500 w-full h-full opacity-50" />
           </div>

           {animState > 0 && (
             <div className="absolute inset-0 pointer-events-none z-10">
               {(animState === 1 ? aePoints : vaePoints).map(p => (
                 <motion.div 
                   key={p.id}
                   initial={{ left: '50%', top: '50%', opacity: 0, x: "-50%", y: "-50%" }}
                   animate={{ 
                     left: `${p.left}%`, 
                     top: `${p.top}%`, 
                     x: `calc(-50% + ${p.px}px)`, 
                     y: `calc(-50% + ${p.py}px)`,
                     opacity: 1 
                   }}
                   transition={{ type: "spring", stiffness: 50, damping: 10, delay: Math.random() * 0.5 }}
                   className={`absolute w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] flex items-center justify-center ${animState === 1 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                 />
               ))}
             </div>
           )}
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col gap-4 w-full">
           <button onClick={() => setAnimState(1)} className={`p-6 rounded-xl border-2 transition-all text-left ${animState === 1 ? 'bg-rose-900/30 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}>
             <h3 className="font-bold text-rose-400 mb-2 flex items-center gap-2"><Maximize className="w-5 h-5"/> Standard AE</h3>
             <p className="text-xs text-slate-400">The encoder shoots points infinitely far away from the center. It doesn't care about structure, it just puts them wherever is mathematically convenient for the decoder.</p>
           </button>

           <button onClick={() => setAnimState(2)} className={`p-6 rounded-xl border-2 transition-all text-left ${animState === 2 ? 'bg-indigo-900/30 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}>
             <h3 className="font-bold text-indigo-400 mb-2 flex items-center gap-2"><Minimize className="w-5 h-5"/> Variational AE</h3>
             <p className="text-xs text-slate-400">The KL Divergence loss acts like a gravitational leash, forcing all the points to pack tightly into the central Gaussian prior.</p>
           </button>

           {animState === 1 && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-900/30 border border-amber-500/50 p-4 rounded-lg flex items-start gap-3 mt-2">
               <AlertTriangle className="text-amber-400 w-5 h-5 shrink-0" />
               <p className="text-xs text-amber-200 leading-relaxed">
                 Look at all the empty space between the red dots! If you sample from that empty space, the decoder will fail.
               </p>
             </motion.div>
           )}
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 10: The Driving Force (Pixel Gravity) ---
const PixelGravitySlide = () => {
  const [similarity, setSimilarity] = useState(10); 
  const distance = 100 - similarity; 
  const posA = { x: 50 - (distance * 0.4), y: 50 };
  const posB = { x: 50 + (distance * 0.4), y: 50 };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <h2 className="text-3xl font-bold mb-4 text-center shrink-0">The Only Driving Force: MSE Loss</h2>
      <p className="text-slate-600 mb-8 text-center max-w-4xl mx-auto shrink-0 text-sm md:text-base">
        If there is no Prior shaping the space, why do points form clusters at all in an AE? <strong>Because of the Decoder.</strong> If two images look identical pixel-for-pixel, the math naturally puts them close together so the Decoder can use the same logic to rebuild them.
      </p>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-6xl mx-auto flex-grow pb-8">
        
        {/* LEFT: Controls & Input Images */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col w-full h-[400px]">
           <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs mb-6 text-center border-b pb-2">Image Similarity</h3>
           
           <div className="flex justify-around items-center mb-8 px-4">
              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-bold text-slate-500 mb-2">Image A</span>
                 <div className="w-24 h-24 bg-white border-4 border-blue-500 rounded-xl overflow-hidden shadow-md flex items-center justify-center text-6xl">🐱</div>
              </div>

              <div className="flex flex-col items-center justify-center px-4">
                <span className="text-2xl font-bold text-slate-300">VS</span>
              </div>

              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-bold text-slate-500 mb-2">Image B</span>
                 <div className="w-24 h-24 bg-white border-4 border-orange-500 rounded-xl overflow-hidden shadow-md flex items-center justify-center text-6xl relative">
                   <div className="absolute inset-0 flex items-center justify-center transition-opacity" style={{ opacity: similarity / 100 }}>🐱</div>
                   <div className="absolute inset-0 flex items-center justify-center transition-opacity" style={{ opacity: 1 - (similarity / 100) }}>🚗</div>
                 </div>
              </div>
           </div>

           <div className="w-full flex flex-col gap-2 mt-auto">
             <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
               <span>Completely Different</span>
               <span>Identical</span>
             </div>
             <input type="range" min="0" max="100" value={similarity} onChange={(e) => setSimilarity(e.target.value)} className="w-full accent-indigo-600 h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
             <span className="text-center font-mono text-indigo-600 font-bold mt-2">{similarity}% Pixel Overlap</span>
           </div>
        </div>

        {/* RIGHT: Latent Space Result */}
        <div className="flex-1 bg-slate-100 rounded-2xl shadow-inner border-2 border-slate-300 p-6 flex flex-col relative w-full h-[400px]">
           <h3 className="font-bold text-slate-500 uppercase tracking-widest text-xs mb-4 text-center">Resulting Latent Space Placement</h3>
           
           <div className="flex-grow bg-white border border-slate-200 rounded-xl relative overflow-hidden shadow-sm flex items-center justify-center">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundPosition: 'center center' }}></div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                 <line x1={`${posA.x}%`} y1={`${posA.y}%`} x2={`${posB.x}%`} y2={`${posB.y}%`} stroke={similarity > 80 ? '#10b981' : '#cbd5e1'} strokeWidth="2" strokeDasharray="4 4" />
              </svg>
              <motion.div className="absolute w-6 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)] border-2 border-white transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center" animate={{ left: `${posA.x}%`, top: `${posA.y}%` }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                <span className="absolute -top-6 text-[10px] font-bold text-blue-700 bg-blue-50 px-1 rounded">z_A</span>
              </motion.div>
              <motion.div className="absolute w-6 h-6 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.6)] border-2 border-white transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center" animate={{ left: `${posB.x}%`, top: `${posB.y}%` }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                <span className="absolute -top-6 text-[10px] font-bold text-orange-700 bg-orange-50 px-1 rounded">z_B</span>
              </motion.div>
           </div>

           <div className="mt-4 bg-indigo-50 border border-indigo-200 p-3 rounded-lg text-[11px] text-indigo-900 font-medium">
             <Zap className="inline-block w-4 h-4 text-amber-500 mr-1 -mt-0.5" />
             The Encoder groups things strictly by <strong>reconstruction convenience</strong>. If pixels are similar, the math overlaps. If they are different, the math throws them to opposite sides of the void.
           </div>
        </div>

      </div>
    </div>
  );
};

// --- MAIN SLIDESHOW COMPONENT ---
const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Array of all 10 combined slides
  const slides = [
    VanillaAESlide,
    UnstructuredSpaceSlide,
    NoPriorSlide,
    InterpolationSlide,
    DecoderSpecificitySlide,
    ConclusionSlide,
    AEVsVAESlide,
    DeterministicMathSlide,
    WildWestSlide,
    PixelGravitySlide
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="flex flex-col h-screen bg-slate-200 font-sans">
      {/* Top Progress Bar */}
      <div className="w-full h-1.5 bg-slate-300">
        <motion.div
          className="h-full bg-indigo-600"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-hidden relative">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full absolute inset-0"
          >
            <CurrentSlideComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center p-4 md:p-6 bg-white border-t border-slate-300 z-10">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          disabled={currentSlide === 0}
        >
          <ChevronLeft />
        </button>
        
        <div className="flex space-x-1 sm:space-x-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${i === currentSlide ? 'bg-indigo-600 scale-125' : 'bg-slate-300'}`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-indigo-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          disabled={currentSlide === slides.length - 1}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <Slideshow />
    </div>
  );
}