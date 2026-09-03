import React, { useState, useEffect } from 'react';
import { 
  GitMerge, 
  ChevronRight, 
  ChevronLeft, 
  Activity,
  Maximize2,
  Cpu,
  Waves,
  MousePointer2,
  BoxSelect,
  Filter,
  ArrowRight,
  ArrowDown,
  TrendingUp,
  Network,
  Search,
  Ruler,
  Divide,
  AlertTriangle,
  ListOrdered,
  Target,
  Play,
  Pause,
  Layers,
  Columns,
  Sigma,
  ArrowRightLeft,
  Combine,
  Bell,
  Grid3x3,
  Calculator
} from 'lucide-react';

export const meta = {
  title: "39. Neural Spline Flows",
  subtitle: "Deconstructing Monotonic Rational-Quadratic Transforms"
};

// ==========================================
// INTERACTIVE VISUAL COMPONENTS
// ==========================================

const VisualButton = ({ onClick, disabled, children, active }) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`flex items-center justify-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 z-10 ${
      active 
        ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-fuchsia-900/50' 
        : 'bg-slate-700 hover:bg-slate-600 text-slate-200 shadow-slate-900/50 border border-slate-600'
    }`}
  >
    {children}
  </button>
);

// 1. Coupling Layer 1
const AnimatedExactSequence = () => {
  const [seqStep, setSeqStep] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let int;
    if (isPlaying) {
      int = setInterval(() => {
        setSeqStep(prev => (prev + 1) % 4);
      }, 2500);
    }
    return () => clearInterval(int);
  }, [isPlaying]);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-16">
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Coupling Layer 1: Transforming the First Half
      </div>

      <div className="flex w-full items-center justify-between max-w-2xl mt-4 px-4">
         
         <div className="flex flex-col items-center relative z-10">
            <div className="bg-rose-900/50 border border-rose-500 text-rose-300 font-bold px-4 py-2 rounded-xl mb-4 shadow-lg">θ (Future Data)</div>
            <svg width="60" height="40" className="mb-4 overflow-visible">
              <path d="M 30 0 L 10 40" stroke="#f43f5e" strokeWidth="2" fill="none" />
              <path d="M 30 0 L 50 40" stroke="#f43f5e" strokeWidth="2" fill="none" />
            </svg>
            <div className="flex gap-4">
               <div className="bg-rose-500/20 border border-rose-500/50 text-rose-300 font-bold px-3 py-1 rounded shadow-sm">θ₁</div>
               <div className="bg-rose-500/20 border border-rose-500/50 text-rose-300 font-bold px-3 py-1 rounded shadow-sm">θ₂</div>
            </div>
            
            <div className="bg-blue-900/50 border border-blue-500 text-blue-300 font-bold px-4 py-2 rounded-xl mt-8 shadow-lg">x (Current State)</div>
         </div>

         <div className="relative flex items-center justify-center h-full w-24">
            <svg className={`absolute inset-0 w-full h-full transition-opacity duration-300 overflow-visible ${seqStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
               <path d="M 0 65 L 100 110" stroke="#818cf8" strokeWidth="2" strokeDasharray="4" className="animate-pulse" />
               <path d="M 0 200 L 100 130" stroke="#818cf8" strokeWidth="2" strokeDasharray="4" className="animate-pulse" />
            </svg>
         </div>

         <div className={`flex flex-col items-center z-10 transition-all duration-500 ${seqStep >= 1 ? 'scale-110' : 'scale-100 opacity-50'}`}>
            <div className="bg-slate-800 border-2 border-indigo-500 p-4 rounded-xl flex flex-col items-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
               <Cpu size={24} className="text-indigo-400 mb-1" />
               <span className="text-white font-bold text-sm">The Brain</span>
               <span className="text-[10px] text-slate-400 mt-1">Residual MLP 1</span>
            </div>
            {seqStep >= 2 && (
               <div className="mt-4 flex gap-1 animate-in slide-in-from-top-2">
                 <span className="bg-fuchsia-900/50 border border-fuchsia-500 text-fuchsia-300 px-2 py-1 text-[9px] rounded">W</span>
                 <span className="bg-sky-900/50 border border-sky-500 text-sky-300 px-2 py-1 text-[9px] rounded">H</span>
                 <span className="bg-emerald-900/50 border border-emerald-500 text-emerald-300 px-2 py-1 text-[9px] rounded">D</span>
               </div>
            )}
         </div>

         <div className="relative flex items-center justify-center h-full w-24">
            <svg className={`absolute inset-0 w-full h-full transition-opacity duration-300 overflow-visible ${seqStep >= 2 ? 'opacity-100' : 'opacity-0'}`}>
               <path d="M 0 150 L 100 120" stroke="#a855f7" strokeWidth="2" strokeDasharray="4" className="animate-pulse" />
            </svg>
         </div>

         <div className={`flex flex-col items-center z-10 transition-all duration-500 ${seqStep >= 2 ? 'scale-110' : 'scale-100 opacity-50'}`}>
            <div className="relative w-24 h-24 border-l-2 border-b-2 border-slate-500 bg-slate-800/40">
               {seqStep >= 2 && (
                 <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible animate-in fade-in duration-500">
                    <path d="M 0 100 C 15 90, 30 80, 50 50 C 70 20, 85 10, 100 0" fill="none" stroke="#f472b6" strokeWidth="3" className="drop-shadow-[0_0_8px_#f472b6]" />
                 </svg>
               )}
               {seqStep >= 3 && (
                 <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible z-20">
                    <line x1="50" y1="130" x2="50" y2="50" stroke="#f43f5e" strokeWidth="2" strokeDasharray="2" className="animate-in slide-in-from-bottom-4 duration-500" />
                    <line x1="50" y1="50" x2="-30" y2="50" stroke="#f472b6" strokeWidth="2" strokeDasharray="2" className="animate-in slide-in-from-right-4 duration-500 delay-300" />
                    <circle cx="50" cy="50" r="4" fill="#fff" className="animate-in fade-in duration-300 delay-300" />
                 </svg>
               )}
               <span className="absolute -bottom-6 text-[10px] text-rose-400 font-bold left-1/2 -translate-x-1/2">θ₂ (In)</span>
               <span className="absolute -left-10 text-[10px] text-fuchsia-400 font-bold top-1/2 -translate-y-1/2">Y₂ (Out)</span>
            </div>
         </div>

      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-lg mt-12 h-16">
        {seqStep === 0 && "1. We take a training sample and split the Future Data (θ)."}
        {seqStep === 1 && <span className="text-indigo-300">2. We feed the Current State (x) and Half A (θ₁) into the Neural Network.</span>}
        {seqStep === 2 && <span className="text-fuchsia-300">3. The Network outputs W, H, D. We INSTANTLY use them to draw the Spline Box.</span>}
        {seqStep === 3 && <span className="text-fuchsia-400">4. We push Half B (θ₂) into the bottom of the box. It hits the curve and shoots out as Y₂. Notice θ₁ was NEVER transformed!</span>}
      </div>

      <div className="absolute bottom-4 flex gap-4">
        <VisualButton onClick={() => setSeqStep(s => Math.max(0, s - 1))} active={false} disabled={seqStep === 0 || isPlaying}>
          <ChevronLeft size={14} /> Previous Stage
        </VisualButton>
        <VisualButton onClick={() => setIsPlaying(!isPlaying)} active={isPlaying}>
          {isPlaying ? <Pause size={14} /> : <Play size={14} />} {isPlaying ? "Pause Flow" : "Play Flow"}
        </VisualButton>
        <VisualButton onClick={() => setSeqStep(s => Math.min(3, s + 1))} active={true} disabled={seqStep === 3 || isPlaying}>
          Next Stage <ChevronRight size={14} />
        </VisualButton>
      </div>
    </div>
  );
};

// 2. The Swap
const AnimatedLayerSwap = () => {
  const [swapStep, setSwapStep] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let int;
    if (isPlaying) {
      int = setInterval(() => {
        setSwapStep(prev => (prev + 1) % 4);
      }, 2500);
    }
    return () => clearInterval(int);
  }, [isPlaying]);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-16">
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Layer 2: The Swap (Transforming the Untouched Half)
      </div>

      <div className="flex flex-col w-full max-w-lg items-center">
         
         <div className="flex justify-between w-64 mb-4 z-10">
            <div className="bg-rose-900/30 border border-rose-500/50 text-rose-300 px-4 py-2 rounded-xl text-sm font-bold shadow-md">θ₁ (Untouched)</div>
            <div className="bg-fuchsia-900/50 border border-fuchsia-500 text-fuchsia-300 px-4 py-2 rounded-xl text-sm font-bold shadow-md">Y₂ (Transformed)</div>
         </div>

         <div className={`flex flex-col items-center transition-all duration-500 ${swapStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-indigo-950 border border-indigo-500/50 text-indigo-300 text-[10px] px-2 py-1 rounded font-mono mb-2">torch.flip()</div>
            <ArrowRightLeft size={24} className="text-indigo-400 mb-2" />
         </div>

         <div className={`flex justify-between w-64 mt-2 transition-all duration-500 ${swapStep >= 1 ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
            <div className="bg-fuchsia-900/50 border border-fuchsia-500 text-fuchsia-300 px-4 py-2 rounded-xl text-sm font-bold shadow-md">Y₂ (New Half A)</div>
            <div className="bg-rose-900/30 border border-rose-500/50 text-rose-300 px-4 py-2 rounded-xl text-sm font-bold shadow-md">θ₁ (New Half B)</div>
         </div>

         <div className="flex w-full mt-8 items-start justify-center gap-12">
            
            <div className={`flex flex-col items-center transition-all duration-500 ${swapStep >= 2 ? 'opacity-100' : 'opacity-0'}`}>
               <ArrowDown size={16} className="text-slate-500 mb-2" />
               <div className="bg-slate-800 border-2 border-indigo-500 p-4 rounded-xl flex flex-col items-center shadow-lg">
                  <Cpu size={20} className="text-indigo-400 mb-1" />
                  <span className="text-white font-bold text-[10px]">Residual MLP 2</span>
               </div>
               {swapStep >= 2 && (
                 <div className="flex gap-1 mt-2">
                   <span className="bg-fuchsia-900/50 text-fuchsia-300 px-1.5 py-0.5 text-[8px] rounded border border-fuchsia-500/30">W₂</span>
                   <span className="bg-sky-900/50 text-sky-300 px-1.5 py-0.5 text-[8px] rounded border border-sky-500/30">H₂</span>
                   <span className="bg-emerald-900/50 text-emerald-300 px-1.5 py-0.5 text-[8px] rounded border border-emerald-500/30">D₂</span>
                 </div>
               )}
            </div>

            <div className={`flex flex-col items-center transition-all duration-500 ${swapStep >= 3 ? 'opacity-100' : 'opacity-0'}`}>
               <ArrowDown size={16} className="text-slate-500 mb-2" />
               <div className="relative w-20 h-20 border-l-2 border-b-2 border-slate-500 bg-slate-800/40 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                     <path d="M 0 100 C 30 90, 40 50, 100 0" fill="none" stroke="#38bdf8" strokeWidth="3" className="drop-shadow-[0_0_8px_#38bdf8]" />
                  </svg>
               </div>
               <ArrowDown size={16} className="text-slate-500 mt-2 mb-2" />
               <div className="bg-sky-600 border border-sky-400 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_10px_#0284c7]">Z₂ (Latent Space)</div>
            </div>
         </div>

      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-lg mt-8 h-16">
        {swapStep === 0 && "1. We start with the outputs from Layer 1. Notice θ₁ was never transformed."}
        {swapStep === 1 && <span className="text-indigo-400">2. THE SWAP: We physically flip the array. The transformed half (Y₂) becomes the new condition, and the untouched half (θ₁) moves into the target position!</span>}
        {swapStep === 2 && <span className="text-fuchsia-300">3. MLP 2 looks at Y₂ and x to draw a brand new Spline Box.</span>}
        {swapStep === 3 && <span className="text-sky-300">4. Finally, θ₁ gets pushed through the new Spline and reaches the Latent Space as Z₂! Both halves have now been transformed.</span>}
      </div>

      <div className="absolute bottom-4 flex gap-4">
        <VisualButton onClick={() => setSwapStep(s => Math.max(0, s - 1))} active={false} disabled={swapStep === 0 || isPlaying}>
          <ChevronLeft size={14} /> Previous Stage
        </VisualButton>
        <VisualButton onClick={() => setIsPlaying(!isPlaying)} active={isPlaying}>
          {isPlaying ? <Pause size={14} /> : <Play size={14} />} {isPlaying ? "Pause Flow" : "Play Flow"}
        </VisualButton>
        <VisualButton onClick={() => setSwapStep(s => Math.min(3, s + 1))} active={true} disabled={swapStep === 3 || isPlaying}>
          Next Stage <ChevronRight size={14} />
        </VisualButton>
      </div>
    </div>
  );
};

// 3. Final Concatenation
const AnimatedFinalConcatenation = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setStep(s => (s + 1) % 2);
    }, 2000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        The Final Assembly: torch.cat([Y₂, Z₂], dim=-1)
      </div>

      <div className="flex flex-col items-center w-full max-w-lg mt-8">
        
        <div className="flex justify-between w-64 mb-8 h-12 relative">
           <div className={`absolute w-28 h-full bg-fuchsia-900/50 border-2 border-fuchsia-500 text-fuchsia-300 flex items-center justify-center rounded-xl text-sm font-bold shadow-md transition-all duration-700 ${step === 1 ? 'left-[4px]' : '-left-8'}`}>
             Y₂ (from θ₂)
           </div>
           
           <div className={`absolute w-28 h-full bg-sky-900/50 border-2 border-sky-500 text-sky-300 flex items-center justify-center rounded-xl text-sm font-bold shadow-md transition-all duration-700 ${step === 1 ? 'right-[4px]' : '-right-8'}`}>
             Z₂ (from θ₁)
           </div>
        </div>

        <div className={`transition-all duration-700 flex flex-col items-center ${step === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
           <ArrowDown size={24} className="text-slate-500 mb-4" />
           <div className="bg-indigo-600 border border-indigo-400 text-white px-8 py-3 rounded-xl text-lg font-extrabold shadow-[0_0_20px_#4f46e5] tracking-widest">
             Z_final
           </div>
           <span className="text-[10px] font-mono text-indigo-300 mt-2">Full 12-Dimensional Latent Vector</span>
        </div>

      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md mt-12 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        Yes, we concatenate them! Because Layer 1 transformed Half B into <strong>Y₂</strong>, and Layer 2 transformed Half A into <strong>Z₂</strong>, both halves of our data are now successfully Gaussianized. We physically stick the arrays back together to form the complete <strong>Z_final</strong> vector!
      </div>
    </div>
  );
};

// 4. The Latent Space Paradox
const AnimatedLatentSpaceParadox = () => {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        The Latent Space is Just a Grading Rubric
      </div>

      <div className="flex flex-col items-center w-full max-w-lg">
         
         <div className="flex justify-between items-center w-full mb-8">
            <div className="flex flex-col items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700 relative">
               <span className="text-[10px] text-indigo-300 font-bold mb-2">Network Output</span>
               <div className="w-20 h-8 bg-indigo-900/50 border border-indigo-500 flex items-center justify-center rounded shadow-[0_0_10px_rgba(79,70,229,0.5)]">
                  <span className="text-indigo-100 font-bold">Z_final</span>
               </div>
               <svg className="absolute -right-16 top-1/2 -translate-y-1/2 w-16 h-8 overflow-visible">
                  <line x1="0" y1="4" x2="60" y2="4" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4" className="animate-pulse" />
                  <polygon points="55,0 65,4 55,8" fill="#4f46e5" />
               </svg>
            </div>

            <div className="flex flex-col items-center bg-slate-800/80 p-4 rounded-xl border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] relative">
               <span className="text-[10px] text-emerald-400 font-bold mb-2">The Latent Space (Rubric)</span>
               <div className="w-32 h-20 border-b border-slate-500 relative flex items-end justify-center">
                  <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible absolute inset-0">
                     <path d="M 0 50 C 30 50, 40 10, 50 10 C 60 10, 70 50, 100 50" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
                     <line x1="70" y1="50" x2="70" y2="35" stroke="#fff" strokeWidth="1" strokeDasharray="2" />
                     <circle cx="70" cy="35" r="3" fill="#fff" className="shadow-[0_0_10px_#fff]" />
                  </svg>
                  <span className="absolute -bottom-5 text-[8px] text-slate-400">0.0</span>
               </div>
               <div className="mt-4 bg-slate-950 px-3 py-1.5 rounded border border-slate-700 text-[10px] font-mono text-slate-300">
                  Loss = -log( BellCurve(Z_final) )
               </div>

               <svg className="absolute -left-20 -bottom-8 w-64 h-16 overflow-visible">
                  <path d="M 60 16 C 40 16, 20 16, 0 16" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4" className="animate-pulse" />
                  <polygon points="5,12 -5,16 5,20" fill="#f43f5e" />
                  <text x="30" y="8" fill="#f43f5e" fontSize="7" fontWeight="bold" textAnchor="middle">BACKPROPAGATION</text>
               </svg>
            </div>
         </div>

         <div className="text-[11px] text-slate-400 text-center max-w-md mt-6 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            The Latent Space isn't a place we "create" beforehand. It is literally just a <strong>Math Formula (The Gaussian Bell Curve)</strong>. <br/><br/>
            When we assemble <strong>Z_final</strong>, we plug it into the Bell Curve formula. If the number falls in the fat part of the bell, the Loss is low. If it falls way outside, the Loss is high. Backpropagation then yells at the MLP to draw a different Spline Box next time!
         </div>
      </div>
    </div>
  );
};

// 5. The Standard Normal
const AnimatedStandardNormal = () => {
  const [zVal, setZVal] = useState(0); 

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Which Bell Curve? The Standard Normal N(0, 1)
      </div>

      <div className="flex flex-col items-center w-full max-w-md">
         
         <div className="relative w-full h-40 border-b-2 border-slate-500 mb-6 flex items-end justify-center">
            
            <svg viewBox="0 0 100 50" className="w-full h-full absolute inset-0 overflow-visible">
               <path d="M 0 50 C 30 50, 40 5, 50 5 C 60 5, 70 50, 100 50" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeWidth="2" />
               
               <line x1="50" y1="5" x2="50" y2="50" stroke="#475569" strokeWidth="1" strokeDasharray="4" />
               
               {zVal === 0 && (
                 <g className="animate-in fade-in duration-300">
                   <line x1="50" y1="50" x2="50" y2="5" stroke="#fff" strokeWidth="1.5" strokeDasharray="2" />
                   <circle cx="50" cy="5" r="4" fill="#fff" className="shadow-[0_0_10px_#fff]" />
                 </g>
               )}
               {zVal === 1 && (
                 <g className="animate-in fade-in duration-300">
                   <line x1="65" y1="50" x2="65" y2="25" stroke="#fff" strokeWidth="1.5" strokeDasharray="2" />
                   <circle cx="65" cy="25" r="4" fill="#fff" className="shadow-[0_0_10px_#fff]" />
                 </g>
               )}
               {zVal === 2 && (
                 <g className="animate-in fade-in duration-300">
                   <line x1="90" y1="50" x2="90" y2="48" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2" />
                   <circle cx="90" cy="48" r="4" fill="#ef4444" className="shadow-[0_0_10px_#ef4444]" />
                 </g>
               )}
            </svg>

            <span className="absolute -bottom-5 left-[50%] -translate-x-1/2 text-[10px] text-slate-300 font-bold">0</span>
            <span className="absolute -bottom-5 left-[65%] -translate-x-1/2 text-[10px] text-slate-500">+1.5</span>
            <span className="absolute -bottom-5 left-[90%] -translate-x-1/2 text-[10px] text-slate-500">+4.0</span>
         </div>

         <div className="flex gap-4 w-full justify-center mb-6">
            <VisualButton onClick={() => setZVal(0)} active={zVal === 0}>Z = 0.0</VisualButton>
            <VisualButton onClick={() => setZVal(1)} active={zVal === 1}>Z = 1.5</VisualButton>
            <VisualButton onClick={() => setZVal(2)} active={zVal === 2}>Z = 4.0</VisualButton>
         </div>

         <div className="flex gap-4 w-full">
            <div className={`flex-1 p-3 rounded-xl border text-center transition-colors duration-300 ${zVal === 0 ? 'bg-emerald-900/50 border-emerald-500' : zVal === 1 ? 'bg-amber-900/50 border-amber-500' : 'bg-rose-900/50 border-rose-500'}`}>
               <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Probability</span>
               <span className={`text-lg font-bold ${zVal === 0 ? 'text-emerald-400' : zVal === 1 ? 'text-amber-400' : 'text-rose-400'}`}>
                 {zVal === 0 ? '39.8%' : zVal === 1 ? '12.9%' : '0.01%'}
               </span>
            </div>
            <div className={`flex-1 p-3 rounded-xl border text-center transition-colors duration-300 ${zVal === 0 ? 'bg-emerald-900/50 border-emerald-500' : zVal === 1 ? 'bg-amber-900/50 border-amber-500' : 'bg-rose-900/50 border-rose-500'}`}>
               <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Loss Penalty</span>
               <span className={`text-lg font-bold ${zVal === 0 ? 'text-emerald-400' : zVal === 1 ? 'text-amber-400' : 'text-rose-400'}`}>
                 {zVal === 0 ? '0.92' : zVal === 1 ? '2.04' : '9.21'}
               </span>
            </div>
         </div>

      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md mt-6">
        There are infinite possible bell curves, but we ONLY compare against the <strong>Standard Normal Distribution</strong>. It is always perfectly centered at 0 with a standard deviation of 1. If our Spline outputs a Z value near 0, the math is happy (low loss). If it outputs a Z value like 4.0, the math heavily penalizes the network!
      </div>
    </div>
  );
};

// 6. Affine vs Spline
const AnimatedAffineLimitation = () => {
  const [isAffine, setIsAffine] = useState(true);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-16">
      <div className="text-xs text-slate-400 mb-8 font-mono text-center">
        {isAffine ? "Affine Transform: y = αx + β" : "Spline Transform: Piecewise Bending"}
      </div>

      <div className="relative w-full max-w-sm h-48 border-l border-b border-slate-700 bg-slate-800/30 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <div className="absolute bottom-4 left-4 w-16 h-16 bg-blue-500 rounded-full blur-xl"></div>
           <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-rose-500 rounded-full blur-xl"></div>
           <div className="absolute top-4 right-8 w-12 h-12 bg-amber-500 rounded-full blur-xl"></div>
        </div>
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full transition-opacity duration-500 preserveAspectRatio-none ${isAffine ? 'opacity-100' : 'opacity-0'}`}>
           <path d="M 0 100 L 100 0" fill="none" stroke="#facc15" strokeWidth="3" className="drop-shadow-[0_0_8px_#facc15]" />
        </svg>
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full transition-opacity duration-500 preserveAspectRatio-none ${!isAffine ? 'opacity-100' : 'opacity-0'}`}>
           <path d="M 0 100 C 10 90, 20 80, 25 80 C 35 80, 45 60, 50 50 C 60 30, 70 20, 80 20 C 90 20, 95 10, 100 0" fill="none" stroke="#d946ef" strokeWidth="3" className="drop-shadow-[0_0_8px_#d946ef]" />
        </svg>
      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md h-12 mt-6">
        {isAffine 
          ? "Affine transformations (scaling and shifting) are essentially straight lines. They are mathematically easy to invert, but heavily lack the flexibility needed to model multi-modal industrial distributions." 
          : "Splines generalize Affine transforms by breaking the line into pieces and bending them. This captures complex operating modes perfectly while remaining strictly invertible."}
      </div>

      <div className="absolute bottom-4">
        <VisualButton onClick={() => setIsAffine(!isAffine)} active={!isAffine}>
          {isAffine ? "Upgrade to Spline Transform" : "Show Affine Limitation"}
        </VisualButton>
      </div>
    </div>
  );
};

// 7. Bounding Boxes
const AnimatedArchitecture = () => {
  const [view, setView] = useState('box'); 

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      <div className="text-xs text-slate-400 mb-4 font-mono text-center">
        {view === 'box' ? "The Bounding Box (A Single 1D Variable)" : "Knots vs Bins (The Fence Analogy)"}
      </div>

      <div className="flex gap-4 mb-4">
         <VisualButton onClick={() => setView('box')} active={view === 'box'}>
           1. The 1D Box
         </VisualButton>
         <VisualButton onClick={() => setView('knots')} active={view === 'knots'}>
           2. Knots & Bins
         </VisualButton>
      </div>

      <div className="relative w-56 h-56 bg-slate-800/30 flex items-center justify-center p-4">
        <svg viewBox="0 0 150 150" className={`absolute inset-0 w-full h-full overflow-visible z-0 transition-opacity duration-500 ${view === 'box' ? 'opacity-100' : 'opacity-20'}`}>
           <line x1="-10" y1="160" x2="25" y2="125" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4" />
           <line x1="125" y1="25" x2="160" y2="-10" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4" />
           {view === 'box' && (
             <>
               <text x="140" y="-15" fill="#38bdf8" fontSize="6">Linear Tail</text>
               <text x="-25" y="165" fill="#38bdf8" fontSize="6">Linear Tail</text>
             </>
           )}
        </svg>

        <div className={`w-[160px] h-[160px] border-[3px] border-dashed relative z-10 transition-colors duration-500 ${view === 'box' ? 'border-sky-400' : 'border-slate-500/50'}`}>
           
           {view === 'box' && (
             <>
               <span className="absolute -left-10 -bottom-4 text-[10px] font-bold text-sky-400">-5.0</span>
               <span className="absolute -left-10 top-0 text-[10px] font-bold text-sky-400">5.0</span>
               <span className="absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] text-sky-200 tracking-widest uppercase">Latent Space (y)</span>
               <span className="absolute -right-4 -bottom-6 text-[10px] font-bold text-sky-400">5.0</span>
               <span className="absolute -right-10 -bottom-2 text-[10px] font-bold text-sky-400">-5.0</span>
               <span className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 text-[8px] text-sky-200 tracking-widest uppercase">Input Data (x)</span>
             </>
           )}
           
           <div className={`absolute inset-0 grid grid-cols-4 opacity-30 pointer-events-none transition-all duration-500 ${view === 'knots' ? 'divide-x-2 divide-fuchsia-400/50' : ''}`}>
              <div className={view === 'knots' ? 'bg-fuchsia-900/20' : ''}></div><div className={view === 'knots' ? 'bg-fuchsia-900/20' : ''}></div><div className={view === 'knots' ? 'bg-fuchsia-900/20' : ''}></div><div className={view === 'knots' ? 'bg-fuchsia-900/20' : ''}></div>
           </div>

           <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 overflow-visible">
              <path d="M 0 100 C 15 90, 20 85, 25 75 C 40 65, 45 65, 50 50 C 65 35, 70 25, 75 15 C 90 10, 95 5, 100 0" fill="none" stroke="#f472b6" strokeWidth="2.5" className="drop-shadow-[0_0_8px_#f472b6]" />
              <g className={`transition-opacity duration-500 ${view === 'knots' ? 'opacity-100' : 'opacity-40'}`}>
                <circle cx="25" cy="75" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" className="shadow-[0_0_8px_#10b981]" />
                <circle cx="50" cy="50" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" className="shadow-[0_0_8px_#10b981]" />
                <circle cx="75" cy="15" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" className="shadow-[0_0_8px_#10b981]" />
                <circle cx="0" cy="100" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" className="shadow-[0_0_8px_#10b981]" />
                <circle cx="100" cy="0" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" className="shadow-[0_0_8px_#10b981]" />
                {view === 'knots' && (
                  <>
                    <text x="12" y="105" fill="#f472b6" fontSize="5" fontWeight="bold">Bin 1</text>
                    <text x="37" y="105" fill="#f472b6" fontSize="5" fontWeight="bold">Bin 2</text>
                    <text x="62" y="105" fill="#f472b6" fontSize="5" fontWeight="bold">Bin 3</text>
                    <text x="87" y="105" fill="#f472b6" fontSize="5" fontWeight="bold">Bin 4</text>
                  </>
                )}
              </g>
           </svg>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md mt-6 h-20">
        {view === 'box' && <span><strong>What is this Box?</strong> It operates on a <i>single 1D variable</i> at a time (e.g. PCA_1). The X-axis is the Input SCADA Data, the Y-axis is the Latent Space. Because we used <strong>RobustScaler</strong>, 99.9% of our data lives perfectly between -5.0 and 5.0, making B=5 the perfect boundary! Anything outside [-5,5] is passed straight through the linear tails.</span>}
        {view === 'knots' && <span><strong>Knots vs. Bins:</strong> Think of building a wooden fence. The <strong>Knots</strong> (green dots) are the fence posts. The <strong>Bins</strong> are the panels between them. If you hammer <strong>5 Knots</strong> (K+1) into the graph, you naturally create exactly <strong>4 Bins</strong> (K). Inside each bin, a specific mathematical equation bends the wire.</span>}
      </div>
    </div>
  );
};

// 8. The MLP Output
const AnimatedMLPOutput = () => {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        The MLP Output Layer (Example: K = 4 Bins)
      </div>

      <div className="flex flex-col items-center w-full max-w-md">
         <div className="bg-slate-800 border-2 border-indigo-500 px-8 py-3 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)] w-full mb-4">
            <Cpu size={24} className="text-indigo-400 mr-3"/>
            <div className="flex flex-col">
              <span className="text-sm text-white font-bold">Standard Residual MLP</span>
              <span className="text-[10px] text-slate-400">Processes condition (x)</span>
            </div>
         </div>

         <ArrowRight size={20} className="text-slate-500 mb-4 rotate-90" />

         <div className="flex flex-col w-full bg-slate-950 p-4 rounded-xl border border-slate-700">
            <div className="text-[10px] text-slate-400 text-center mb-2">Output Layer: (3 * K) - 1 Neurons = <strong className="text-white">11 Raw Numbers</strong></div>
            
            <div className="flex w-full gap-2 mt-2">
               <div className="flex flex-col flex-1 gap-1">
                 <span className="text-[8px] font-bold text-fuchsia-400 text-center">Widths (4)</span>
                 <div className="flex gap-0.5 w-full bg-fuchsia-900/30 p-1 border border-fuchsia-500/30 rounded">
                   {Array.from({length: 4}).map((_,i)=><div key={i} className="h-4 flex-1 bg-fuchsia-500/50 rounded-sm"></div>)}
                 </div>
               </div>

               <div className="flex flex-col flex-1 gap-1">
                 <span className="text-[8px] font-bold text-sky-400 text-center">Heights (4)</span>
                 <div className="flex gap-0.5 w-full bg-sky-900/30 p-1 border border-sky-500/30 rounded">
                   {Array.from({length: 4}).map((_,i)=><div key={i} className="h-4 flex-1 bg-sky-500/50 rounded-sm"></div>)}
                 </div>
               </div>

               <div className="flex flex-col flex-1 gap-1">
                 <span className="text-[8px] font-bold text-emerald-400 text-center">Slopes / Derivs (3)</span>
                 <div className="flex gap-0.5 w-full bg-emerald-900/30 p-1 border border-emerald-500/30 rounded">
                   {Array.from({length: 3}).map((_,i)=><div key={i} className="h-4 flex-1 bg-emerald-500/50 rounded-sm"></div>)}
                 </div>
                 <span className="text-[7px] text-slate-500 text-center leading-tight mt-1">Knots 2, 3, 4<br/>(Edges are fixed at 1)</span>
               </div>
            </div>
         </div>
      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md mt-8 bg-slate-800/50 p-3 rounded border border-slate-700">
        Yes, the MLP is a completely normal neural network! However, instead of outputting just a single prediction, the final layer has <strong>(3K - 1)</strong> neurons. For K=4 bins, it outputs 11 raw numbers. We simply slice this array into three parts: Widths, Heights, and Slopes.
      </div>
    </div>
  );
};

// 9. Constraints (FIXED S-CURVE SVG)
const AnimatedConstraints = () => {
  const [showBroken, setShowBroken] = useState(false);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Why Softplus? The Horizontal Line Test (Invertibility)
      </div>

      <div className="flex gap-6 w-full max-w-lg">
         
         <div className={`flex flex-col items-center flex-1 bg-slate-800/50 p-4 rounded-xl border transition-all duration-300 ${!showBroken ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-700 opacity-40'}`}>
            <span className="text-[10px] font-bold text-emerald-400 mb-2">Softplus = Positive Slopes</span>
            <div className="relative w-24 h-24 border-l-2 border-b-2 border-slate-500 mb-2 overflow-hidden">
               <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                  <path d="M 0 100 C 20 80, 50 60, 100 0" fill="none" stroke="#10b981" strokeWidth="3" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#fff" strokeWidth="1" strokeDasharray="2" />
                  <circle cx="58" cy="50" r="4" fill="#fff" />
               </svg>
            </div>
            <span className="text-[8px] text-slate-300 text-center leading-tight">Strictly Monotonic (Always goes up).<br/>Any Y maps back to exactly ONE X.</span>
         </div>

         <div className={`flex flex-col items-center flex-1 bg-slate-800/50 p-4 rounded-xl border transition-all duration-300 ${showBroken ? 'border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.2)]' : 'border-slate-700 opacity-40'}`}>
            <span className="text-[10px] font-bold text-rose-400 mb-2">Negative Slope (Broken)</span>
            <div className="relative w-24 h-24 border-l-2 border-b-2 border-slate-500 mb-2 overflow-hidden">
               <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                  <path d="M 0 100 C 10 10, 30 10, 50 50 C 70 90, 90 90, 100 0" fill="none" stroke="#f43f5e" strokeWidth="3" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#fff" strokeWidth="1" strokeDasharray="2" />
                  <circle cx="18" cy="50" r="4" fill="#fff" />
                  <circle cx="50" cy="50" r="4" fill="#fff" />
                  <circle cx="82" cy="50" r="4" fill="#fff" />
               </svg>
            </div>
            <span className="text-[8px] text-slate-300 text-center leading-tight">Curve dips down (Creates an S-bend).<br/>One Y maps to MULTIPLE X's!</span>
         </div>

      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md mt-6 h-12">
        If a slope was allowed to be negative, the curve would dip backwards, creating an S-shape. If you draw a horizontal line, it literally crosses the curve 3 times! This permanently destroys mathematical invertibility because we wouldn't know which X generated our Y. <strong>Softplus strictly enforces positive slopes, guaranteeing invertibility.</strong>
      </div>

      <div className="absolute bottom-4">
        <VisualButton onClick={() => setShowBroken(!showBroken)} active={showBroken}>
          {showBroken ? "Show Correct Spline" : "What if Slope is Negative?"}
        </VisualButton>
      </div>
    </div>
  );
};

// 10. Constructing the Geometry
const AnimatedKnotBuilding = () => {
  const [step, setStep] = useState(0); 

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-16">
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Building the Geometry (Single Variable): Scaffolding vs. Bending
      </div>

      <div className="relative w-56 h-56 border-[3px] border-slate-600/50 bg-slate-800/30">
         
         <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <circle cx="0" cy="100" r="2.5" fill="#fff" />
            <circle cx="100" cy="0" r="2.5" fill="#fff" />
            
            {step >= 1 && (
              <g className="animate-in fade-in duration-500">
                <line x1="0" y1="100" x2="30" y2="100" stroke="#c026d3" strokeWidth="1" strokeDasharray="2" />
                <line x1="30" y1="100" x2="30" y2="70" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2" />
                <circle cx="30" cy="70" r="2.5" fill="#10b981" />

                <line x1="30" y1="70" x2="55" y2="70" stroke="#c026d3" strokeWidth="1" strokeDasharray="2" />
                <line x1="55" y1="70" x2="55" y2="50" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2" />
                <circle cx="55" cy="50" r="2.5" fill="#10b981" />

                <line x1="55" y1="50" x2="85" y2="50" stroke="#c026d3" strokeWidth="1" strokeDasharray="2" />
                <line x1="85" y1="50" x2="85" y2="15" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2" />
                <circle cx="85" cy="15" r="2.5" fill="#10b981" />

                <line x1="85" y1="15" x2="100" y2="15" stroke="#c026d3" strokeWidth="1" strokeDasharray="2" />
                <line x1="100" y1="15" x2="100" y2="0" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2" />
              </g>
            )}

            {step >= 2 && (
              <g className="animate-in zoom-in duration-500">
                <line x1="-5" y1="105" x2="5" y2="95" stroke="#facc15" strokeWidth="2" />
                <line x1="22" y1="74" x2="38" y2="66" stroke="#facc15" strokeWidth="2" />
                <line x1="50" y1="55" x2="60" y2="45" stroke="#facc15" strokeWidth="2" />
                <line x1="77" y1="16" x2="93" y2="14" stroke="#facc15" strokeWidth="2" />
                <line x1="95" y1="5" x2="105" y2="-5" stroke="#facc15" strokeWidth="2" />
              </g>
            )}

            {step >= 3 && (
              <path 
                d="M 0 100 C 10 90, 20 85, 30 70 C 40 55, 45 60, 55 50 C 65 40, 75 25, 85 15 C 90 10, 95 5, 100 0" 
                fill="none" stroke="#f472b6" strokeWidth="2.5" className="animate-in fade-in duration-1000 drop-shadow-[0_0_6px_#f472b6]" 
              />
            )}
         </svg>
      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md mt-6 h-12">
        {step === 0 && "Start with the Bounding Box for this specific variable."}
        {step === 1 && <span className="text-slate-300"><strong>Widths & Heights:</strong> The MLP acts like a hand, placing 'pushpins' (Knots) inside the box based on the current SCADA state using cumulative sums.</span>}
        {step === 2 && <span className="text-amber-400"><strong>Slopes:</strong> The Derivatives (D) dictate the exact tangent angles (the wire's entry/exit angle) at each pushpin.</span>}
        {step === 3 && <span className="text-fuchsia-400"><strong>The Curve:</strong> The Spline bends smoothly to connect the dots, perfectly following those angles to create the exact probability curve!</span>}
      </div>

      <div className="absolute bottom-4 flex gap-4">
        <VisualButton onClick={() => setStep(s => Math.max(0, s - 1))} active={false} disabled={step === 0}>
          <ChevronLeft size={14} /> Previous Stage
        </VisualButton>
        <VisualButton onClick={() => setStep(s => Math.min(3, s + 1))} active={true} disabled={step === 3}>
          Next Stage <ChevronRight size={14} />
        </VisualButton>
      </div>
    </div>
  );
};

// 11. Binary Search
const AnimatedBinarySearch = () => {
  const [searchStep, setSearchStep] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setSearchStep(prev => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Step 1: Finding the Bin (Binary Search)
      </div>

      <div className="relative w-full max-w-md bg-slate-800/40 p-6 rounded-xl border border-slate-700 overflow-hidden flex flex-col items-center">
        
        <div className="flex gap-4 w-full mb-6">
           <div className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-[9px] text-slate-400 font-mono text-center">
             <strong>Training:</strong> Input = Real SCADA Data.<br/>Searching X-axis to find y.
           </div>
           <div className="flex-1 bg-fuchsia-900/30 border border-fuchsia-500/50 p-2 rounded text-[9px] text-fuchsia-300 font-mono text-center">
             <strong>Generation:</strong> Input = Random Noise (z).<br/>Searching Y-axis to map back to SCADA.
           </div>
        </div>
        
        <div className="relative w-full h-8 flex border-b-2 border-slate-500 mb-4 mt-2">
           {Array.from({length: 8}).map((_, i) => {
             let isActive = false;
             if (searchStep === 0) isActive = true; 
             if (searchStep === 1 && i >= 4) isActive = true; 
             if (searchStep === 2 && i >= 4 && i < 6) isActive = true; 
             if (searchStep === 3 && i === 5) isActive = true; 

             return (
               <div key={i} className="flex-1 border-r border-slate-600 relative flex items-end justify-center pb-1">
                 <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-fuchsia-500/20' : 'bg-transparent'}`}></div>
                 {isActive && searchStep === 3 && <div className="absolute inset-0 bg-fuchsia-500/40 border-2 border-fuchsia-400 rounded-sm shadow-[0_0_10px_rgba(217,70,239,0.5)]"></div>}
                 <span className="text-[8px] text-slate-500">B{i+1}</span>
               </div>
             )
           })}
           
           <div className="absolute top-0 bottom-0 border-l-[3px] border-fuchsia-400 transition-all duration-300 shadow-[0_0_8px_#e879f9]" style={{ left: '68%' }}></div>
           <div className="absolute -top-4 text-[10px] font-bold text-fuchsia-400 transition-all duration-300" style={{ left: '68%', transform: 'translateX(-50%)' }}>input</div>
        </div>

        <div className="flex gap-2 w-full text-[10px] font-mono text-center">
           <div className={`flex-1 p-2 rounded border transition-colors ${searchStep === 0 ? 'bg-slate-700 border-slate-500 text-white' : 'border-slate-800 text-slate-500'}`}>Search [0, 8]</div>
           <div className={`flex-1 p-2 rounded border transition-colors ${searchStep === 1 ? 'bg-slate-700 border-slate-500 text-white' : 'border-slate-800 text-slate-500'}`}>Search [4, 8]</div>
           <div className={`flex-1 p-2 rounded border transition-colors ${searchStep === 2 ? 'bg-slate-700 border-slate-500 text-white' : 'border-slate-800 text-slate-500'}`}>Search [4, 6]</div>
           <div className={`flex-1 p-2 rounded border transition-colors ${searchStep === 3 ? 'bg-fuchsia-900/50 border-fuchsia-500 text-fuchsia-300' : 'border-slate-800 text-slate-500'}`}>Found Bin 6!</div>
        </div>

      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md mt-6">
        When an input arrives, the flow must determine which of the K bins it belongs to. Because the knots are strictly ordered, PyTorch uses a highly optimized <strong>Binary Search (torch.searchsorted)</strong> to find the correct bin extremely fast.
      </div>
    </div>
  );
};

// 12. Local Coordinates
const AnimatedLocalCoordinates = () => {
  const binStart = 1.5;
  const binEnd = 3.5;
  const W_k = binEnd - binStart;
  const [xVal, setXVal] = useState(2.5); // Range 1.5 to 3.5
  
  // Calculate xi (percentage)
  const xi = (xVal - binStart) / W_k;

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6 overflow-y-auto custom-scrollbar">
      
      <div className="text-xs text-slate-400 mb-2 font-mono text-center">
        We found Bin 6! Now we need Local Coordinates (ξ)
      </div>

      <div className="flex flex-col items-center w-full max-w-lg mt-2">
         
         {/* New Warning Box Explaining Global vs Local */}
         <div className="bg-amber-900/20 border border-amber-500/50 p-3 rounded-lg mb-4 text-[10px] text-amber-200/90 leading-relaxed shadow-sm">
            <strong>Wait, didn't we already scale the data in preprocessing?</strong> Yes! RobustScaler scaled the raw sensor data (e.g. 500 psi) into the global Bounding Box (e.g. X = 2.5). However, the Spline's Rational-Quadratic formula is hardcoded to <strong>only accept inputs between 0.0 and 1.0</strong>. We must convert the global X position into a local bin percentage (ξ).
         </div>

         <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700 relative w-full flex flex-col shadow-lg">
            
            <div className="flex justify-between items-center mb-6">
               <span className="text-[10px] text-slate-400 font-mono flex flex-col items-start"><span>Start Knot</span><strong className="text-white text-xs">X = {binStart.toFixed(1)}</strong></span>
               <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-700 text-center">Bin Width (W₆) = {W_k.toFixed(1)}<br/><span className="text-[8px] text-fuchsia-400 font-bold">(Output by Neural Network)</span></span>
               <span className="text-[10px] text-slate-400 font-mono flex flex-col items-end"><span>End Knot</span><strong className="text-white text-xs">X = {binEnd.toFixed(1)}</strong></span>
            </div>

            {/* The "YouTube" Progress Bar */}
            <div className="relative w-full h-8 bg-slate-900 border border-slate-600 rounded-full overflow-hidden">
               <div className="absolute top-0 left-0 h-full bg-sky-500/30 transition-all duration-100" style={{ width: `${xi * 100}%` }}></div>
               <div className="absolute top-0 bottom-0 border-l-[3px] border-sky-400 transition-all duration-100 shadow-[0_0_10px_#38bdf8]" style={{ left: `${xi * 100}%` }}></div>
            </div>

            {/* Real X values below the bar */}
            <div className="flex justify-between mt-2 px-1 relative h-4">
               <span className="text-xs font-bold text-sky-400 transition-all duration-100 absolute top-0" style={{ left: `${xi * 100}%`, transform: 'translateX(-50%)' }}>X = {xVal.toFixed(2)}</span>
            </div>

            {/* Interactive Slider */}
            <div className="mt-4 flex flex-col items-center">
               <span className="text-[9px] text-slate-400 mb-2 uppercase tracking-wider font-bold">Slide to test different scaled outputs inside Bin 6</span>
               <input 
                  type="range" 
                  min={binStart} 
                  max={binEnd} 
                  step="0.05" 
                  value={xVal} 
                  onChange={(e) => setXVal(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
               />
            </div>

         </div>

         {/* Calculation Output Box */}
         <div className="mt-4 flex flex-col items-center bg-slate-950 border border-sky-500/50 p-4 rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.1)] w-full max-w-sm">
            <span className="font-mono text-[10px] text-slate-400 mb-1">Normalized Fraction (ξ)</span>
            <span className="font-mono text-sm text-white mb-2">
               ξ = (X - Start_Knot) / W₆
            </span>
            <span className="font-mono text-sm text-sky-300 font-bold bg-sky-900/30 px-3 py-1 rounded tracking-widest">
               ({xVal.toFixed(2)} - {binStart.toFixed(2)}) / {W_k.toFixed(1)} = {xi.toFixed(2)}
            </span>
         </div>
         
      </div>

    </div>
  );
};

// 13. The Math Formula (COMPLETELY REBUILT: 4 Sub-Tabs for intuition)
const AnimatedRQMath = () => {
  const [view, setView] = useState('problem'); // 'problem', 'quadratic', 'rational', 'sequence'

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Deconstructing the Spline Equation
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap justify-center gap-3 mb-6 max-w-2xl">
         <VisualButton onClick={() => setView('problem')} active={view === 'problem'}>
           1. The Problem
         </VisualButton>
         <VisualButton onClick={() => setView('quadratic')} active={view === 'quadratic'}>
           2. Why not a Quadratic?
         </VisualButton>
         <VisualButton onClick={() => setView('rational')} active={view === 'rational'}>
           3. The "Rational" Cheat Code
         </VisualButton>
         <VisualButton onClick={() => setView('sequence')} active={view === 'sequence'}>
           4. The Code Sequence
         </VisualButton>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-3xl bg-slate-800/40 p-6 rounded-xl border border-slate-700 min-h-[280px]">
         
         {/* VIEW 1: THE PROBLEM */}
         {view === 'problem' && (
           <div className="flex flex-col items-center animate-in fade-in duration-300 w-full">
              
              <div className="relative w-64 h-32 border-l-2 border-b-2 border-slate-500 mb-4 overflow-visible">
                 <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                    {/* Knots */}
                    <circle cx="20" cy="40" r="2" fill="#fff" />
                    <circle cx="80" cy="10" r="2" fill="#fff" />
                    {/* Slopes */}
                    <line x1="10" y1="40" x2="30" y2="40" stroke="#facc15" strokeWidth="1" />
                    <line x1="70" y1="10" x2="90" y2="10" stroke="#facc15" strokeWidth="1" />
                    {/* Erratical connecting lines (Infinite possibilities) */}
                    <path d="M 20 40 Q 50 10, 80 10" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2" className="opacity-50" />
                    <path d="M 20 40 Q 50 60, 80 10" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2" className="opacity-50" />
                    <path d="M 20 40 C 30 20, 70 30, 80 10" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2" className="opacity-50" />
                 </svg>
                 <span className="absolute bottom-2 left-6 text-[8px] text-white">Start</span>
                 <span className="absolute top-0 right-6 text-[8px] text-white">End</span>
              </div>

              <div className="text-[11px] text-slate-300 text-center max-w-lg bg-slate-950 p-4 rounded-lg border border-slate-700 leading-relaxed shadow-inner">
                <strong>How do you connect the dots?</strong> W and H give us the start and end dots (the fence posts). D gives us the entry and exit angles. But there are infinite ways to draw a line between them! PyTorch needs a hard, concrete math equation to evaluate exactly where the curve is.
              </div>
           </div>
         )}

         {/* VIEW 2: QUADRATIC FAILURE */}
         {view === 'quadratic' && (
           <div className="flex flex-col items-center animate-in fade-in duration-300 w-full">
              
              <div className="relative w-64 h-32 border-l-2 border-b-2 border-slate-500 mb-4 overflow-visible">
                 <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                    {/* Knots */}
                    <circle cx="20" cy="20" r="2" fill="#fff" />
                    <circle cx="80" cy="10" r="2" fill="#fff" />
                    {/* U-Shape Curve */}
                    <path d="M 20 20 Q 50 70, 80 10" fill="none" stroke="#f43f5e" strokeWidth="2" />
                    {/* Horizontal Line Test Failure */}
                    <line x1="0" y1="35" x2="100" y2="35" stroke="#fff" strokeWidth="1" strokeDasharray="2" />
                    <circle cx="34" cy="35" r="2" fill="#fff" />
                    <circle cx="68" cy="35" r="2" fill="#fff" />
                 </svg>
              </div>

              <div className="text-[11px] text-slate-300 text-center max-w-lg bg-slate-950 p-4 rounded-lg border border-rose-900/50 leading-relaxed shadow-inner">
                A standard quadratic equation (ax² + bx + c) forms a "U" shape. To connect these specific angles, it has to dip down and back up. What's the problem? <strong>It fails the Horizontal Line Test!</strong> If a curve ever dips down (negative slope), it completely breaks mathematical invertibility.
              </div>
           </div>
         )}

         {/* VIEW 3: THE RATIONAL CHEAT CODE */}
         {view === 'rational' && (
           <div className="flex flex-col items-center animate-in fade-in duration-300 w-full">
              
              <div className="flex items-center justify-center gap-6 w-full mb-4">
                 
                 <div className="flex flex-col items-center gap-1">
                    <div className="bg-slate-900 border border-slate-600 p-3 rounded-xl flex flex-col gap-2 shadow-inner">
                      <span className="text-[10px] text-emerald-400 font-mono font-bold text-center">Top Quadratic (α)</span>
                      <div className="w-full border-b border-slate-500"></div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold text-center">Bottom Quadratic (β)</span>
                    </div>
                 </div>

                 <span className="text-xl font-bold text-slate-500">=</span>

                 <div className="relative w-32 h-20 border-l-2 border-b-2 border-slate-500 overflow-visible">
                    <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                       <circle cx="20" cy="40" r="2" fill="#fff" />
                       <circle cx="80" cy="10" r="2" fill="#fff" />
                       {/* Perfect S-Bend */}
                       <path d="M 20 40 C 60 40, 40 10, 80 10" fill="none" stroke="#10b981" strokeWidth="2" className="drop-shadow-[0_0_5px_#10b981]" />
                    </svg>
                 </div>

              </div>

              <div className="text-[11px] text-slate-300 text-center max-w-lg bg-slate-950 p-4 rounded-lg border border-emerald-900/50 leading-relaxed shadow-inner">
                Mathematicians discovered a brilliant cheat code. "Rational" is just a fancy math word for a fraction. If you divide one quadratic equation (let's call it <strong>α</strong>) by a different quadratic equation (<strong>β</strong>), something magical happens: The curve becomes incredibly flexible to match our W,H,D, but is mathematically guaranteed to <strong>NEVER dip downwards!</strong>
              </div>
           </div>
         )}

         {/* VIEW 4: THE CODE SEQUENCE */}
         {view === 'sequence' && (
           <div className="flex flex-col items-center animate-in fade-in duration-300 w-full">
              
              <div className="grid grid-cols-3 gap-2 w-full text-center">
                 {/* Step 1 */}
                 <div className="bg-slate-800 p-2 rounded border border-slate-600 flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 font-bold mb-1">1. Network Outputs</span>
                    <span className="text-xs text-sky-400 font-mono">W, H, D</span>
                 </div>
                 {/* Step 2 */}
                 <div className="bg-slate-800 p-2 rounded border border-slate-600 flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 font-bold mb-1">2. Algebra</span>
                    <span className="text-xs text-sky-400 font-mono">Calculate c₁, c₂...</span>
                 </div>
                 {/* Step 3 */}
                 <div className="bg-slate-800 p-2 rounded border border-slate-600 flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 font-bold mb-1">3. Curve is Locked</span>
                    <span className="text-xs text-emerald-400 font-mono">α(ξ) / β(ξ)</span>
                 </div>
                 {/* Step 4 */}
                 <div className="bg-slate-800 p-2 rounded border border-slate-600 flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 font-bold mb-1">4. Data Arrives</span>
                    <span className="text-xs text-fuchsia-400 font-mono">ξ (Input %)</span>
                 </div>
                 {/* Step 5 */}
                 <div className="bg-slate-800 p-2 rounded border border-slate-600 flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 font-bold mb-1">5. Evaluate</span>
                    <span className="text-xs text-fuchsia-400 font-mono">Top / Bottom</span>
                 </div>
                 {/* Step 6 */}
                 <div className="bg-slate-800 p-2 rounded border border-slate-600 flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 font-bold mb-1">6. Output</span>
                    <span className="text-xs text-emerald-400 font-mono">Y (Gaussian)</span>
                 </div>
              </div>

              <div className="mt-4 text-[11px] text-slate-300 text-center max-w-lg bg-slate-950 p-4 rounded-lg border border-slate-700 leading-relaxed shadow-inner">
                α and β are not two different shapes on the graph. They are just the numerator and the denominator of a single mathematical fraction. The network outputs W,H,D → PyTorch calculates the exact polynomials → ξ arrives → PyTorch divides them to get Y.
              </div>
           </div>
         )}

      </div>
    </div>
  );
};
// 14. The Coefficient Algebra (NEW)
const AnimatedCoefficients = () => {
  const [view, setView] = useState('forward'); // 'forward' or 'inverse'

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      <div className="text-xs text-slate-400 mb-4 font-mono text-center">
        Calculating the Exact Polynomial Coefficients
      </div>

      <div className="flex gap-4 mb-4">
         <VisualButton onClick={() => setView('forward')} active={view === 'forward'}>
           1. Forward (Calculating c)
         </VisualButton>
         <VisualButton onClick={() => setView('inverse')} active={view === 'inverse'}>
           2. Inverse (The Quadratic Formula)
         </VisualButton>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-3xl bg-slate-800/40 p-4 rounded-xl border border-slate-700 min-h-[300px] overflow-y-auto">
         {view === 'forward' && (
            <div className="flex flex-col w-full gap-4 animate-in fade-in duration-300">
                <div className="flex gap-2 justify-center">
                    <span className="bg-slate-800 px-3 py-1 rounded text-[10px] font-mono text-slate-300">Inputs: W, H, D₀, D₁</span>
                    <ArrowRight size={14} className="text-slate-500 self-center"/>
                    <span className="bg-indigo-900/50 border border-indigo-500 text-indigo-300 px-3 py-1 rounded text-[10px] font-mono font-bold shadow-md">Helper: S = H / W</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-slate-900 border border-emerald-500/30 p-3 rounded-lg flex flex-col gap-1 shadow-inner">
                        <span className="text-[10px] text-emerald-400 font-bold mb-1 border-b border-emerald-900/50 pb-1">Bottom Polynomial (β)</span>
                        <span className="text-[9px] font-mono text-slate-300">c₄ = -(D₁ + D₀ - 2S)</span>
                        <span className="text-[9px] font-mono text-slate-300">c₅ = (D₁ + D₀ - 2S)</span>
                        <span className="text-[9px] font-mono text-slate-300">c₆ = S</span>
                        <span className="text-[10px] font-mono text-emerald-300 mt-2 font-bold">β(ξ) = c₄ξ² + c₅ξ + c₆</span>
                    </div>
                    <div className="bg-slate-900 border border-sky-500/30 p-3 rounded-lg flex flex-col gap-1 shadow-inner">
                        <span className="text-[10px] text-sky-400 font-bold mb-1 border-b border-sky-900/50 pb-1">Top Polynomial (α)</span>
                        <span className="text-[9px] font-mono text-slate-300">c₁ = H * (S - D₀)</span>
                        <span className="text-[9px] font-mono text-slate-300">c₂ = H * D₀</span>
                        <span className="text-[9px] font-mono text-slate-300">c₃ = 0</span>
                        <span className="text-[10px] font-mono text-sky-300 mt-2 font-bold">α(ξ) = c₁ξ² + c₂ξ + c₃</span>
                    </div>
                </div>

                <div className="mt-2 bg-fuchsia-950/40 border border-fuchsia-500 p-3 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                    <span className="font-mono text-sm text-fuchsia-300 font-bold">Y = (c₁ξ² + c₂ξ + c₃) / (c₄ξ² + c₅ξ + c₆)</span>
                </div>
            </div>
         )}

         {view === 'inverse' && (
            <div className="flex flex-col w-full items-center gap-3 animate-in fade-in duration-300 text-slate-300">
                <div className="text-[10px] bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg w-full max-w-lg text-center font-mono">
                    <span className="text-slate-500 mr-2">1. Multiply:</span>
                    Y · (c₄ξ² + c₅ξ + c₆) = c₁ξ² + c₂ξ + c₃
                </div>
                <ArrowDown size={12} className="text-slate-600" />
                <div className="text-[10px] bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg w-full max-w-lg text-center font-mono">
                    <span className="text-slate-500 mr-2">2. Group ξ:</span>
                    (Yc₄ - c₁)ξ² + (Yc₅ - c₂)ξ + (Yc₆ - c₃) = 0
                </div>
                <ArrowDown size={12} className="text-slate-600" />
                <div className="flex gap-4 w-full max-w-lg justify-center">
                    <span className="bg-amber-900/30 border border-amber-500/50 text-amber-200 px-2 py-1 rounded text-[9px] font-mono">a = (Yc₄ - c₁)</span>
                    <span className="bg-amber-900/30 border border-amber-500/50 text-amber-200 px-2 py-1 rounded text-[9px] font-mono">b = (Yc₅ - c₂)</span>
                    <span className="bg-amber-900/30 border border-amber-500/50 text-amber-200 px-2 py-1 rounded text-[9px] font-mono">c = (Yc₆ - c₃)</span>
                </div>
                <div className="mt-2 bg-amber-950/50 border-2 border-amber-500 p-3 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.25)] flex flex-col items-center">
                    <span className="text-[9px] text-amber-400 font-bold uppercase mb-1">Standard Quadratic Formula</span>
                    <span className="font-mono text-sm text-amber-300 font-bold">ξ = (-b ± √(b² - 4ac)) / 2a</span>
                </div>
            </div>
         )}
      </div>

      <div className="text-[11px] text-slate-400 text-center mt-4 max-w-2xl leading-relaxed h-16">
        {view === 'forward'
          ? "PyTorch calculates a helper variable S (Straight-Line Slope = H/W). Then, it uses basic arithmetic to find the exact 'c' coefficients for the Top and Bottom polynomials. There is no ML magic here—just pure math creating the curve from W, H, and D!"
          : "During generation, we know Y and want to find ξ. By isolating ξ and grouping the terms, the Rational-Quadratic beautifully simplifies into a standard quadratic equation (aξ² + bξ + c = 0). PyTorch instantly calculates the exact input data using the high-school quadratic formula!"
        }
      </div>
    </div>
  );
};

// 14. The Jacobian Shortcut
const AnimatedJacobianMatrix = () => {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      
      <div className="text-xs text-slate-400 mb-4 font-mono text-center">
        Erasing the complex neural network from the math.
      </div>

      <div className="flex flex-col items-center w-full max-w-lg">
         
         <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700 relative w-full flex flex-col items-center shadow-lg">
            
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-slate-600 font-light">[</div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl text-slate-600 font-light">]</div>

            <div className="grid grid-cols-2 gap-4 w-48 relative z-10">
               {/* Top Left: Identity */}
               <div className="bg-blue-900/20 border border-blue-500/50 text-blue-400 p-3 rounded-lg flex flex-col items-center justify-center shadow-inner">
                  <span className="text-[8px] font-mono mb-1 text-blue-300">∂Y₁ / ∂X₁</span>
                  <span className="text-xl font-bold">I</span>
                  <span className="text-[7px] mt-1 text-blue-200/70">Identity</span>
               </div>
               
               {/* Top Right: ZERO (The magic trick) */}
               <div className="bg-emerald-900/20 border-2 border-emerald-400 text-emerald-400 p-3 rounded-lg flex flex-col items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <span className="text-[8px] font-mono mb-1 text-emerald-300">∂Y₁ / ∂X₂</span>
                  <span className="text-xl font-bold">0</span>
                  <span className="text-[7px] mt-1 text-emerald-200/70">No relation!</span>
               </div>

               {/* Bottom Left: NN Derivs (Erased) */}
               <div className="bg-slate-800 border border-slate-600 text-slate-400 p-3 rounded-lg flex flex-col items-center justify-center opacity-50">
                  <span className="text-[8px] font-mono mb-1 text-slate-500">∂Y₂ / ∂X₁</span>
                  <span className="text-xl font-bold">A</span>
                  <span className="text-[7px] mt-1 text-slate-500">NN Derivs</span>
               </div>

               {/* Bottom Right: Spline Derivs (The Penalty) */}
               <div className="bg-rose-900/20 border border-rose-500/50 text-rose-400 p-3 rounded-lg flex flex-col items-center justify-center shadow-inner">
                  <span className="text-[8px] font-mono mb-1 text-rose-300">∂Y₂ / ∂X₂</span>
                  <span className="text-[12px] font-bold mt-1 text-rose-400 leading-tight text-center">diag<br/>(Spline')</span>
               </div>
            </div>
            
         </div>

         <div className="mt-6 bg-slate-800/80 border border-slate-600 p-4 rounded-xl shadow-md w-full max-w-sm flex items-center justify-center">
            <span className="font-mono text-slate-300 text-xs text-center leading-relaxed">
              <span className="text-emerald-400 font-bold">The Diagonal Rule:</span> The determinant of a triangular matrix is just the product of its diagonal.<br/><br/>
              log |det(J)| = <span className="text-rose-400 font-bold text-sm">∑ log(Spline')</span>
            </span>
         </div>
         
      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md mt-6">
        We <strong>are</strong> calculating the Jacobian matrix! But because Half A passes through untouched, the top-right block is exactly 0. This mathematically <strong>erases</strong> the terrifying Neural Network derivatives (Block A). All we are left with is the simple 1D derivatives of the Spline curve!
      </div>
    </div>
  );
};

// 15. The Jacobian Derivative (The Slopes!)
const AnimatedJacobian = () => {
  const [view, setView] = useState('micro'); // 'peaks' or 'micro'
  const [step, setStep] = useState(0); // 0: Forward, 1: Derivative, 2: Log Store

  // Handle auto-playing the micro steps
  useEffect(() => {
    let int;
    if (view === 'micro') {
      int = setInterval(() => {
        setStep(s => (s + 1) % 3);
      }, 4000);
    }
    return () => clearInterval(int);
  }, [view]);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-16">
      
      <div className="text-xs text-slate-400 mb-4 font-mono text-center">
        {view === 'peaks' ? "Macro View: The Full Volume Penalty (det J)" : "Micro View: Calculating Rate of Change"}
      </div>

      <div className="flex gap-4 mb-4">
         <VisualButton onClick={() => setView('micro')} active={view === 'micro'}>
           1. Simultaneous Calculation
         </VisualButton>
         <VisualButton onClick={() => setView('peaks')} active={view === 'peaks'}>
           2. The Jagged Peaks View
         </VisualButton>
      </div>

      {/* EXPANDED CONTAINER: Taller and wider to prevent squishing and clipping */}
      <div className={`relative w-full max-w-3xl h-[340px] border-slate-600 bg-slate-800/30 overflow-hidden flex justify-center rounded-xl shadow-inner border mt-2 ${view === 'peaks' ? 'items-end' : 'items-center'}`}>
        
        {view === 'peaks' ? (
          <div className="relative w-full h-full">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 z-20">1</span>
            <span className="absolute left-2 bottom-2 text-[10px] text-slate-400 z-20">0</span>
            <span className="absolute bottom-2 left-[20%] -translate-x-1/2 text-[10px] text-slate-400 z-20">-B</span>
            <span className="absolute bottom-2 left-[50%] -translate-x-1/2 text-[10px] text-slate-400 z-20">0</span>
            <span className="absolute bottom-2 left-[80%] -translate-x-1/2 text-[10px] text-slate-400 z-20">B</span>

            <div className="absolute top-1/2 w-full border-t border-dashed border-slate-500/50 z-0"></div>
            <div className="absolute top-0 bottom-0 left-[20%] border-l border-dashed border-slate-500/50 z-0"></div>
            <div className="absolute top-0 bottom-0 left-[80%] border-l border-dashed border-slate-500/50 z-0"></div>

            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible preserveAspectRatio-none z-10 animate-in fade-in duration-500">
               <path d="M 0 100 L 0 50 L 20 50 C 25 80, 27 10, 30 50 C 33 90, 35 15, 40 60 C 45 40, 50 80, 55 45 C 60 90, 65 5, 70 70 C 75 40, 78 80, 80 50 L 100 50 L 100 100 Z" fill="rgba(56, 189, 248, 0.2)" />
               <path d="M 0 50 L 20 50 C 25 80, 27 10, 30 50 C 33 90, 35 15, 40 60 C 45 40, 50 80, 55 45 C 60 90, 65 5, 70 70 C 75 40, 78 80, 80 50 L 100 50" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="drop-shadow-[0_0_4px_#38bdf8]" />
            </svg>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-between p-4 gap-4 h-full">
             
             {/* Left Side: Micro View - Single Bin Zoom */}
             <div className="relative w-1/2 h-full flex items-center justify-center p-2 border-r border-slate-700/50">
               {/* FIXED VIEWBOX: Expanded to prevent labels from getting clipped off the edge */}
               <svg viewBox="-20 -20 140 160" className="w-full h-full z-10 overflow-visible">
                  {/* Bin Background */}
                  <rect x="20" y="20" width="60" height="60" fill="rgba(15, 23, 42, 0.5)" stroke="#475569" strokeDasharray="2" />
                  
                  {/* Curve */}
                  <path d="M 20 80 C 60 80, 40 20, 80 20" fill="none" stroke="#f472b6" strokeWidth="3" />
                  
                  {/* Step 0: Forward Pass */}
                  <g className={`transition-opacity duration-500 ${step >= 0 ? 'opacity-100' : 'opacity-0'}`}>
                     {/* Data point X entering */}
                     <line x1="50" y1="110" x2="50" y2="50" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3" className="animate-pulse" />
                     <circle cx="50" cy="110" r="4" fill="#38bdf8" />
                     <text x="35" y="125" fill="#38bdf8" fontSize="9" fontWeight="bold">Input (X)</text>
                     
                     {/* Point on curve */}
                     <circle cx="50" cy="50" r="4" fill="#fff" className="shadow-[0_0_8px_#fff]" />
                     
                     {/* Data point Y exiting */}
                     <line x1="50" y1="50" x2="-10" y2="50" stroke="#f472b6" strokeWidth="2" strokeDasharray="3" className="animate-pulse" />
                     <circle cx="-10" cy="50" r="4" fill="#f472b6" />
                     <text x="-32" y="47" fill="#f472b6" fontSize="9" fontWeight="bold">Out (Y)</text>
                  </g>

                  {/* Step 1: Exact Derivative Tangent */}
                  <g className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                     <line x1="30" y1="90" x2="70" y2="10" stroke="#10b981" strokeWidth="2.5" />
                     <text x="65" y="5" fill="#10b981" fontSize="8" fontWeight="bold">Slope = 2.0</text>
                  </g>
               </svg>
             </div>

             {/* Right Side: Math Legend and Equations */}
             <div className="w-1/2 h-full flex flex-col gap-2 justify-center px-4 py-2 overflow-y-auto">
                
                {/* Math Legend */}
                <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-[10px] text-slate-400 mb-1">
                  <strong className="text-white border-b border-slate-700 block mb-1.5 pb-1">Math Legend:</strong>
                  <span className="text-amber-400">ξ (xi)</span> = X's local % position inside this bin (0.0 to 1.0)<br/>
                  <span className="text-blue-400">α (alpha)</span> = Top quadratic polynomial shape<br/>
                  <span className="text-blue-400">β (beta)</span> = Bottom quadratic polynomial shape
                </div>

                <div className={`p-3 bg-slate-900 border transition-all duration-500 rounded-lg shadow-md ${step >= 0 ? 'border-sky-500/50 text-sky-300' : 'border-slate-700 text-slate-500 opacity-50'}`}>
                   <span className="text-xs font-bold text-white block mb-1">1. Find Point (Y)</span>
                   <span className="text-sm font-mono font-bold tracking-wider">y = α(ξ) / β(ξ)</span>
                   <p className="text-[10px] mt-1.5 leading-tight text-slate-400">Calculate Y directly from X using the two curve polynomials.</p>
                </div>

                <div className={`p-3 bg-slate-900 border transition-all duration-500 rounded-lg shadow-md ${step >= 1 ? 'border-emerald-500/50 text-emerald-300' : 'border-slate-700 text-slate-500 opacity-50'}`}>
                   <span className="text-xs font-bold text-white block mb-1">2. Find True Slope (Y')</span>
                   <span className="text-sm font-mono font-bold tracking-wider">y' = (α'β - αβ') / β²</span>
                   <p className="text-[10px] mt-1.5 leading-tight text-slate-400">Calculus "Quotient Rule". Gets exact slope at X's position.</p>
                </div>

                <div className={`p-3 bg-slate-900 border transition-all duration-500 rounded-lg shadow-md ${step >= 2 ? 'border-rose-400 bg-rose-950/40 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'border-slate-700 text-slate-500 opacity-50'}`}>
                   <span className="text-xs font-bold text-white block mb-1">3. Apply Volume Penalty</span>
                   <span className="text-sm font-mono font-bold tracking-wider">Store log(y')</span>
                   <p className="text-[10px] mt-1.5 leading-tight text-slate-400">Log the slope and add it to our array for the final loss.</p>
                </div>

             </div>
          </div>
        )}

      </div>

      <div className="text-[11px] text-slate-400 text-center mt-6 h-12 max-w-2xl leading-relaxed">
        {view === 'peaks' 
          ? "This matches Figure 1 in the paper. The Volume Penalty is just the sum of the logs of these peaks and valleys! It quantifies exactly how much probability mass is being stretched."
          : <span><strong>When do we calculate this?</strong> During the forward pass! As PyTorch passes your data point X through the Spline equation to calculate Y, it immediately runs the derivative of that exact equation (using the Calculus Quotient Rule) to get the true slope at that micro-location. We save that slope, take the log, and pass it to the final loss function.</span>}
      </div>
    </div>
  );
};

// 16. The 3-Step Flow Loss
const AnimatedFinalLoss = () => {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6 overflow-y-auto custom-scrollbar">
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Calculating the Final Loss in Three Easy Steps
      </div>

      <div className="flex flex-col gap-4 w-full max-w-lg mt-2">
         
         {/* Step 1: Blueprint Score */}
         <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">1</div>
               <span className="text-indigo-400 font-bold text-sm">The Blueprint Score</span>
            </div>
            <div className="bg-slate-900 border border-slate-700 px-3 py-2 rounded text-[11px] font-mono text-indigo-300">
               score = bell_curve.log_prob(Z_final)
            </div>
            <div className="text-[9px] text-slate-500 mt-2 bg-slate-900/50 p-2 rounded">
               <strong>Notice:</strong> We don't evaluate the target directly. If the network drew a bad Spline Box, Z_final will land far outside the bell curve, and this score will be terrible.
            </div>
         </div>

         {/* Step 2: Volume Penalty */}
         <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-md">2</div>
               <span className="text-emerald-400 font-bold text-sm">The Volume Penalty</span>
            </div>
            <div className="bg-slate-900 border border-slate-700 px-3 py-2 rounded text-[11px] font-mono text-emerald-300">
               penalty = sum(spline_log_det_1 + ..._det_N)
            </div>
            <div className="text-[9px] text-slate-500 mt-2 bg-slate-900/50 p-2 rounded">
               PyTorch grabs all the Log Jacobian Determinants (the true curve slopes at x) generated across every single Spline layer and simply adds them up.
            </div>
         </div>

         {/* Step 3: Total Loss */}
         <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-xl shadow-md border-b-2 border-b-rose-500">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center text-white text-xs font-bold shadow-md">3</div>
               <span className="text-rose-400 font-bold text-sm">Total Loss</span>
            </div>
            <div className="bg-rose-950/30 border border-rose-500/50 px-3 py-2 rounded text-[12px] font-mono text-rose-300 font-bold shadow-inner">
               loss = -1 * (score + penalty)
            </div>
            <div className="text-[9px] text-slate-500 mt-2 bg-slate-900/50 p-2 rounded">
               We flip it negative because neural networks minimize to zero. <code>loss.backward()</code> traces the math backward to update the network weights!
            </div>
         </div>

      </div>
    </div>
  );
};

// 17. Gaussianization
const AnimatedGaussianization = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    let int;
    if (isRunning) {
      int = setInterval(() => {
        const rand = Math.random();
        let startX = 0;
        if (rand < 0.3) startX = 15 + Math.random() * 10;
        else if (rand < 0.7) startX = 50 + Math.random() * 20;
        else startX = 85 + Math.random() * 10;

        const newPoint = { id: Date.now() + Math.random(), x: startX, progress: 0 };
        setPoints(curr => [...curr, newPoint].slice(-40));
      }, 150);
    }
    return () => clearInterval(int);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;
    const animationFrame = setInterval(() => {
      setPoints(curr => curr.map(p => {
        if (p.progress >= 100) return p;
        return { ...p, progress: p.progress + 2 };
      }));
    }, 30);
    return () => clearInterval(animationFrame);
  }, [isRunning]);

  const mapXtoY = (x) => {
    if (x < 30) return (x / 30) * 20; 
    if (x < 80) return 20 + ((x - 30) / 50) * 60; 
    return 80 + ((x - 80) / 20) * 20; 
  };

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-16">
      
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Gaussianization: Mapping Complex Data (x) to Latent Space (z)
      </div>

      <div className="relative w-64 h-64 border-l border-b border-slate-600 bg-slate-800/30">
         
         <div className="absolute -bottom-10 left-0 w-full h-8 flex items-end">
            <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
               <path d="M 0 20 C 15 20, 15 5, 20 5 C 25 5, 25 20, 30 20 L 40 20 C 50 20, 55 0, 60 0 C 65 0, 70 20, 80 20 L 80 20 C 85 20, 88 10, 90 10 C 92 10, 95 20, 100 20" fill="rgba(244, 63, 94, 0.3)" stroke="#f43f5e" strokeWidth="1" />
            </svg>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-rose-400 font-bold whitespace-nowrap">Complex Data (θ₂)</span>
         </div>

         <div className="absolute top-0 -left-12 w-10 h-full flex items-center">
            <svg viewBox="0 0 20 100" className="w-full h-full overflow-visible">
               <path d="M 0 100 C 0 80, 20 60, 20 50 C 20 40, 0 20, 0 0" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="1" />
            </svg>
            <span className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] text-sky-400 font-bold whitespace-nowrap">Latent Normal (z₂)</span>
         </div>

         <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible z-10">
            <path d="M 0 100 C 10 95, 25 90, 30 80 C 40 50, 70 50, 80 20 C 85 10, 90 5, 100 0" fill="none" stroke="#d946ef" strokeWidth="2" className="drop-shadow-[0_0_5px_#d946ef]" />
            
            {points.map(p => {
               const targetY = 100 - mapXtoY(p.x);
               let cx, cy, opacity;

               if (p.progress < 40) {
                 cx = p.x;
                 cy = 100 - (p.progress / 40) * (100 - targetY);
                 opacity = p.progress / 40;
               } else if (p.progress < 60) {
                 cx = p.x;
                 cy = targetY;
                 opacity = 1;
               } else {
                 const leftProgress = (p.progress - 60) / 40;
                 cx = p.x - (leftProgress * p.x);
                 cy = targetY;
                 opacity = 1 - leftProgress;
               }

               return (
                 <circle key={p.id} cx={cx} cy={cy} r="1.5" fill="#fff" opacity={opacity} className="shadow-lg" />
               );
            })}
         </svg>
      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md mt-14 h-12">
        After millions of rounds of training, the MLP becomes an expert at drawing boxes. It bends the space so perfectly that when you feed in messy, 3-peaked SCADA data, it flows through the spline and maps flawlessly onto the Bell Curve grading rubric! We call this <strong>Gaussianizing</strong> the data.
      </div>

      <div className="absolute bottom-4">
        <VisualButton onClick={() => { setIsRunning(!isRunning); setPoints([]); }} active={isRunning}>
          {isRunning ? "Stop Data Flow" : "Flow Data into Latent Space"}
        </VisualButton>
      </div>
    </div>
  );
};

// 18. Batch Processing
const AnimatedBatchProcessing = () => {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Batch Dimension: Every Data Point gets its own Box
      </div>

      <div className="flex flex-col gap-4 w-full max-w-2xl">
         {/* Row 1 */}
         <div className="flex items-center gap-4 w-full">
            <div className="bg-blue-900/50 border border-blue-500 p-2 rounded-lg text-[9px] text-blue-200 text-center w-28">
               <strong>Sample 1</strong><br/>Normal Pressure
            </div>
            <ArrowRight size={16} className="text-slate-500" />
            <div className="bg-slate-800 border-2 border-indigo-500 p-2 rounded-lg flex items-center justify-center">
               <Cpu size={16} className="text-indigo-400"/>
            </div>
            <ArrowRight size={16} className="text-slate-500" />
            <div className="relative w-16 h-12 border-l border-b border-slate-500 bg-slate-800/30">
               <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                  <path d="M 0 100 C 40 80, 60 20, 100 0" fill="none" stroke="#f472b6" strokeWidth="3" />
               </svg>
            </div>
            <ArrowRight size={16} className="text-slate-500" />
            <div className="bg-sky-900/50 border border-sky-500 p-2 rounded text-[10px] text-sky-200 font-bold">Z = 0.5</div>
         </div>

         {/* Row 2 */}
         <div className="flex items-center gap-4 w-full">
            <div className="bg-rose-900/50 border border-rose-500 p-2 rounded-lg text-[9px] text-rose-200 text-center w-28">
               <strong>Sample 2</strong><br/>Massive Surge Spike
            </div>
            <ArrowRight size={16} className="text-slate-500" />
            <div className="bg-slate-800 border-2 border-indigo-500 p-2 rounded-lg flex items-center justify-center">
               <Cpu size={16} className="text-indigo-400"/>
            </div>
            <ArrowRight size={16} className="text-slate-500" />
            <div className="relative w-16 h-12 border-l border-b border-slate-500 bg-slate-800/30">
               <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                  <path d="M 0 100 C 10 90, 10 20, 100 0" fill="none" stroke="#f472b6" strokeWidth="3" />
               </svg>
            </div>
            <ArrowRight size={16} className="text-slate-500" />
            <div className="bg-sky-900/50 border border-sky-500 p-2 rounded text-[10px] text-sky-200 font-bold">Z = -1.2</div>
         </div>

         {/* Row 3 */}
         <div className="flex items-center gap-4 w-full">
            <div className="bg-amber-900/50 border border-amber-500 p-2 rounded-lg text-[9px] text-amber-200 text-center w-28">
               <strong>Sample 3</strong><br/>Low Demand
            </div>
            <ArrowRight size={16} className="text-slate-500" />
            <div className="bg-slate-800 border-2 border-indigo-500 p-2 rounded-lg flex items-center justify-center">
               <Cpu size={16} className="text-indigo-400"/>
            </div>
            <ArrowRight size={16} className="text-slate-500" />
            <div className="relative w-16 h-12 border-l border-b border-slate-500 bg-slate-800/30">
               <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                  <path d="M 0 100 C 90 80, 90 20, 100 0" fill="none" stroke="#f472b6" strokeWidth="3" />
               </svg>
            </div>
            <ArrowRight size={16} className="text-slate-500" />
            <div className="bg-sky-900/50 border border-sky-500 p-2 rounded text-[10px] text-sky-200 font-bold">Z = 2.1</div>
         </div>

         <div className="w-full text-center text-slate-500 text-xs mt-2">
            ... repeated for all 1,024 samples in the batch ...
         </div>
      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-lg mt-6 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
         During training, PyTorch processes a <strong>Batch</strong> of data (e.g., 1,024 historical SCADA windows) all at once. The MLP looks at all 1,024 Current States and outputs 1,024 completely different sets of Spline parameters. It instantly draws <strong>1,024 unique Spline Boxes</strong> in parallel so every data point is bent exactly the way it needs to be!
      </div>
    </div>
  );
};

// 19. Column Dimensions
const AnimatedDimensionality = () => {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Feature Dimension: Every Column gets its own Box
      </div>

      <div className="flex flex-col items-center w-full max-w-2xl">
         
         <div className="flex gap-2 w-full justify-center mb-6">
            <div className="bg-slate-800 text-slate-500 border border-slate-700 px-3 py-1 text-[10px] rounded opacity-50">PCA 1</div>
            <div className="bg-slate-800 text-slate-500 border border-slate-700 px-3 py-1 text-[10px] rounded opacity-50">...</div>
            <div className="bg-slate-800 text-slate-500 border border-slate-700 px-3 py-1 text-[10px] rounded opacity-50 mr-4">PCA 6</div>
            
            <div className="bg-rose-900/50 text-rose-300 border border-rose-500 px-3 py-1 text-[10px] font-bold rounded shadow-[0_0_10px_rgba(244,63,94,0.3)]">PCA 7</div>
            <div className="bg-rose-900/50 text-rose-300 border border-rose-500 px-3 py-1 text-[10px] font-bold rounded shadow-[0_0_10px_rgba(244,63,94,0.3)]">PCA 8</div>
            <div className="bg-rose-900/50 text-rose-300 border border-rose-500 px-3 py-1 text-[10px] font-bold rounded shadow-[0_0_10px_rgba(244,63,94,0.3)]">PCA 9</div>
            <div className="bg-rose-900/50 text-rose-300 border border-rose-500 px-3 py-1 text-[10px] font-bold rounded shadow-[0_0_10px_rgba(244,63,94,0.3)]">PCA 10</div>
            <div className="bg-rose-900/50 text-rose-300 border border-rose-500 px-3 py-1 text-[10px] font-bold rounded shadow-[0_0_10px_rgba(244,63,94,0.3)]">PCA 11</div>
            <div className="bg-rose-900/50 text-rose-300 border border-rose-500 px-3 py-1 text-[10px] font-bold rounded shadow-[0_0_10px_rgba(244,63,94,0.3)]">PCA 12</div>
         </div>

         <div className="flex gap-4 mb-6 relative w-full justify-center">
            {/* Arrows pointing down to boxes */}
            <div className="absolute top-[-15px] left-0 w-full flex justify-center gap-12">
               <ArrowDown size={16} className="text-rose-500" />
               <ArrowDown size={16} className="text-rose-500" />
               <ArrowDown size={16} className="text-rose-500" />
               <ArrowDown size={16} className="text-rose-500" />
               <ArrowDown size={16} className="text-rose-500" />
               <ArrowDown size={16} className="text-rose-500" />
            </div>

            {Array.from({length: 6}).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="relative w-12 h-12 border-l border-b border-slate-500 bg-slate-800/30">
                   <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                      <path d={`M 0 100 C ${10+i*5} ${90-i*10}, ${20+i*10} ${80-i*5}, 100 0`} fill="none" stroke="#f472b6" strokeWidth="3" />
                   </svg>
                </div>
                <ArrowDown size={16} className="text-sky-500 mt-2 mb-2" />
                <span className="text-[10px] font-bold text-sky-300">z_{i+7}</span>
              </div>
            ))}
         </div>

      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-lg mt-6 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
         Our Future Data (θ) is made up of 12 PCA columns. In this layer, Half B (Columns 7 to 12) is being transformed. The MLP doesn't just output parameters for one box per sample—it outputs parameters for <strong>6 distinct boxes</strong> simultaneously. Column 7 gets bent by Box A, Column 8 by Box B, outputting 6 separate z-values!
      </div>
    </div>
  );
};

// 20. The Massive Loss Calculation
const AnimatedMassiveLoss = () => {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        The Massive Scale of Loss Calculation
      </div>

      <div className="flex flex-col items-center w-full max-w-2xl">
         
         <div className="flex items-center gap-6 w-full justify-center">
            
            <div className="flex flex-col items-center">
               <div className="bg-slate-800 border border-slate-600 p-4 rounded-xl flex flex-col items-center relative shadow-lg">
                  <div className="flex flex-wrap gap-1 w-32 justify-center">
                     {Array.from({length: 40}).map((_,i) => <div key={i} className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" style={{ animationDelay: `${i*0.05}s` }}></div>)}
                  </div>
                  <span className="absolute -bottom-3 bg-slate-950 px-2 py-0.5 rounded text-[8px] text-slate-300 font-bold border border-slate-700">6,144 Output z-values</span>
               </div>
               <span className="text-[9px] text-slate-500 mt-5">(1,024 batches × 6 cols)</span>
            </div>

            <div className="flex flex-col items-center">
               <ArrowRight size={24} className="text-slate-500" />
               <span className="text-[8px] text-emerald-500 font-mono mt-1 bg-emerald-950 px-1 rounded border border-emerald-900">.log_prob()</span>
            </div>

            <div className="flex flex-col items-center relative">
               <div className="w-40 h-24 border-b-2 border-slate-500 relative flex items-end justify-center bg-emerald-900/10 rounded-t-xl overflow-hidden border border-emerald-500/30">
                  <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible absolute inset-0">
                     <path d="M 0 50 C 30 50, 40 10, 50 10 C 60 10, 70 50, 100 50" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Sigma size={32} className="text-emerald-400/50" />
                  </div>
               </div>
               <span className="absolute -bottom-3 bg-slate-950 px-2 py-0.5 rounded text-[8px] text-emerald-400 font-bold border border-emerald-700 text-center">6-Dimensional<br/>Gaussian Rubric</span>
            </div>

         </div>

         <div className="mt-8 bg-rose-950/50 border-2 border-rose-500 p-4 rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.2)] w-full max-w-sm text-center relative overflow-visible">
            <span className="text-white font-mono font-bold text-sm block">Final Loss = Mean( Scores )</span>
            <svg className="absolute -left-16 top-1/2 -translate-y-1/2 w-16 h-8 overflow-visible">
               <line x1="0" y1="4" x2="60" y2="4" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4" className="animate-pulse" />
               <polygon points="5,0 -5,4 5,8" fill="#f43f5e" />
               <text x="30" y="-2" fill="#f43f5e" fontSize="8" fontWeight="bold" textAnchor="middle">BACKPROP</text>
            </svg>
         </div>

      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-lg mt-8 h-12">
         If you have a batch size of 1,024, and 6 columns, PyTorch physically draws <strong>6,144 unique Spline Boxes</strong> in a fraction of a millisecond! It grades all 6,144 z-values on the Bell Curve, averages the scores, and backpropagates to make the MLP smarter for the next batch.
      </div>
    </div>
  );
};


// ==========================================
// MAIN CONFIGURATION & COMPONENT
// ==========================================

const steps = [
  {
    id: 'exact-sequence',
    chapter: 'The Big Picture',
    title: '1. Coupling Layer 1: The First Half',
    icon: ListOrdered,
    Visual: AnimatedExactSequence,
    description: "Let's put the sequence together for a SINGLE coupling layer. 1: Data enters. 2: The MLP looks at Half A and predicts W, H, D. 3: We instantly draw a Spline Box using those numbers. 4: We push Half B into the X-axis of the box, and it comes out the Y-axis as Y₂. Notice that Half A (θ₁) was never transformed!"
  },
  {
    id: 'layer-swap',
    chapter: 'The Big Picture',
    title: '2. The Alternating Swap',
    icon: GitMerge,
    Visual: AnimatedLayerSwap,
    description: "Why did we leave Half A alone? If we fed the entire vector into the MLP, the math would become strictly un-invertible! To ensure the ENTIRE vector gets transformed, we stack multiple layers and SWAP the halves in between (using torch.flip). In Layer 2, the newly transformed Y₂ becomes the brain's input, and the previously untouched θ₁ goes through the spline."
  },
  {
    id: 'final-concat',
    chapter: 'The Big Picture',
    title: '3. The Final Assembly (Z_final)',
    icon: Combine,
    Visual: AnimatedFinalConcatenation,
    description: "Since Layer 1 successfully bent Half B into Y₂, and Layer 2 successfully bent Half A into Z₂, BOTH halves of our original data have now been transformed! We literally stitch the two arrays back together side-by-side to form Z_final. This is our complete, 12-dimensional Latent Vector output."
  },
  {
    id: 'latent-paradox',
    chapter: 'The Big Picture',
    title: '4. The Latent Space Paradox',
    icon: Target,
    Visual: AnimatedLatentSpaceParadox,
    description: "When does the Latent Space get created? Never! It's not a physical place, it's a math formula acting as a grading rubric. The Z_final vector that pops out of our flow is immediately graded against a mathematical Bell Curve. If it's a bad fit, the Loss spikes, and backpropagation forces the MLP to draw better boxes next time."
  },
  {
    id: 'standard-normal',
    chapter: 'The Big Picture',
    title: '5. The Standard Normal',
    icon: Bell,
    Visual: AnimatedStandardNormal,
    description: "Which Bell Curve do we use? Out of infinite possibilities, we ONLY compare against the Standard Normal Distribution N(0,1). It is always perfectly centered at 0 with a width of 1. If our Spline maps a messy SCADA point perfectly near 0, the probability is high (low loss). If it maps it far away, the loss penalty explodes!"
  },
  {
    id: 'affine-vs-spline',
    chapter: 'Transform Types',
    title: '6. The Limits of Affine Math',
    icon: GitMerge,
    Visual: AnimatedAffineLimitation,
    description: "Traditionally, flows used Affine transformations (simply shifting and scaling the data). As the authors note, while Affine is mathematically easy to invert, it lacks the flexibility to model discontinuous or multi-modal densities. We need a function that can 'bend' to fit the actual data shape."
  },
  {
    id: 'spline-bounds',
    chapter: 'Rational-Quadratic Splines',
    title: '7. Bounding Boxes and Knots',
    icon: BoxSelect,
    Visual: AnimatedArchitecture,
    description: "A major point of confusion: The Bounding Box operates on a SINGLE data column at a time! Because we 'RobustScaled' our SCADA data during preprocessing, 99.9% of our data lives between -5.0 and 5.0, making B=5 perfect. Inside this box, we define K distinct bins (panels) separated by K+1 Knots (fence posts). Outside the box, the function safely defaults to a straight line."
  },
  {
    id: 'spline-params',
    chapter: 'The Neural Architecture',
    title: '8. The Neural Network Outputs',
    icon: Cpu,
    Visual: AnimatedMLPOutput,
    description: "Yes, 'The Brain' is a completely standard Residual MLP! But instead of outputting just 1 prediction, the final layer outputs a long array of (3K - 1) neurons for every dimension it transforms. For K=4 bins, it outputs 11 raw numbers. We cleanly slice this array into three parts: Widths, Heights, and Slopes."
  },
  {
    id: 'spline-activations',
    chapter: 'The Neural Architecture',
    title: '9. Enforcing Physical Constraints',
    icon: AlertTriangle,
    Visual: AnimatedConstraints,
    description: "Neural networks output unbounded raw numbers. We must constrain them so the math doesn't break. Softmax forces the Widths and Heights to sum perfectly to 2B so the curve never leaks outside the bounding box. Crucially, Softplus ensures the slopes are strictly positive so the curve never 'dips', maintaining perfect analytic invertibility."
  },
  {
    id: 'spline-cumsum',
    chapter: 'Constructing the Spline',
    title: '10. Scaffolding vs. Bending',
    icon: Activity,
    Visual: AnimatedKnotBuilding,
    description: "How does the geometry physically come together for a single variable? Step 1: Using cumulative sums (torch.cumsum) of the Widths and Heights, we plot the exact (x,y) coordinate of each Knot (like placing pushpins in a board). Step 2: The Slopes (D) dictate the tangent angle at each knot. Step 3: The Spline curve bends to connect the dots following those angles."
  },
  {
    id: 'spline-search',
    chapter: 'Evaluating the Curve',
    title: '11. Finding the Bin',
    icon: Search,
    Visual: AnimatedBinarySearch,
    description: "Once the grid of K knots is built, the flow needs to evaluate a specific input. During training, this input is your real SCADA data moving forward. During generation, the input is random Gaussian noise moving backward. Because the knots are strictly ordered, PyTorch uses a highly optimized Binary Search to instantly find exactly which bin the input falls into."
  },
  {
    id: 'spline-local',
    chapter: 'Evaluating the Curve',
    title: '12. Local Coordinates (ξ)',
    icon: Ruler,
    Visual: AnimatedLocalCoordinates,
    description: "We don't use absolute SCADA values to calculate the math. Once we find the correct bin, we calculate ξ (xi): the fractional distance of the input across that specific bin. ξ is always exactly 0.0 at the left knot and 1.0 at the right knot."
  },
  {
    id: 'spline-math',
    chapter: 'Evaluating the Curve',
    title: '13. The Rational-Quadratic Formula',
    icon: Divide,
    Visual: AnimatedRQMath,
    description: "Inside the bin, the curve is mathematically defined as a quotient of two quadratic polynomials. Because the curve is strictly monotonic (always increasing), calculating the exact Inverse mathematically simplifies to just solving for the roots of a quadratic equation!"
  },
  {
    id: 'spline-algebra',
    chapter: 'Evaluating the Curve',
    title: '14. The Coefficient Algebra',
    icon: Calculator,
    Visual: AnimatedCoefficients,
    description: "How exactly do W, H, and D become the polynomials? First, PyTorch calculates the straight-line slope S = H/W. Then, it uses simple arithmetic to find the exact coefficients (c₁ to c₆) for the Top and Bottom polynomials. During generation, these coefficients perfectly rearrange into the standard high-school Quadratic Formula to instantly find the original data!"
  },
  {
    id: 'jacobian-shortcut',
    chapter: 'Mathematical Properties',
    title: '15. The Jacobian Shortcut',
    icon: Grid3x3,
    Visual: AnimatedJacobianMatrix,
    description: "What happened to the Jacobian matrix? Because we only transform Half B, the relationship between Half A's input and output is exactly 1 (Identity), and the relationship between Half B's input and Half A's output is 0. This mathematically 'erases' the complex Neural Network derivatives, leaving only the Spline derivatives!"
  },
  {
    id: 'spline-jacobian',
    chapter: 'Mathematical Properties',
    title: '16. The Volume Penalty',
    icon: Waves,
    Visual: AnimatedJacobian,
    description: "Are these jagged peaks just the 'D' values from the neural network? NO! The NN outputs 'D' (the slopes at the edges). The math formula must be used to calculate the true slope g'(x) exactly where the point landed. This exact slope is what we take the log of to create the volume penalty!"
  },
  {
    id: 'final-loss',
    chapter: 'Mathematical Properties',
    title: '17. The 3-Step Flow Loss',
    icon: Calculator,
    Visual: AnimatedFinalLoss,
    description: "Now we combine everything. 1: Calculate the Blueprint Score using the Bell Curve formula. 2: Calculate the Volume Penalty using the sum of the TRUE Spline derivatives across all layers. 3: Combine them, multiply by -1, and backpropagate!"
  },
  {
    id: 'gaussianization',
    chapter: 'Putting it Together',
    title: '18. Gaussianizing the Data',
    icon: Filter,
    Visual: AnimatedGaussianization,
    description: "By combining these properties, the Neural Spline acts as a funnel. It takes complex, real-world SCADA distributions and forces them to align with a perfect, easy-to-sample Standard Normal distribution in the latent space. Once trained, we can reverse the flow: sampling simple Gaussian noise to generate hyper-realistic future scenarios."
  },
  {
    id: 'batch-scale',
    chapter: 'The Massive Scale',
    title: '19. The Batch Dimension',
    icon: Layers,
    Visual: AnimatedBatchProcessing,
    description: "Training isn't done one point at a time. The MLP looks at a batch of 1,024 SCADA windows simultaneously. It instantly draws 1,024 completely unique Spline Boxes so every single data point gets bent according to its own exact physical state."
  },
  {
    id: 'column-scale',
    chapter: 'The Massive Scale',
    title: '20. The Column Dimension',
    icon: Columns,
    Visual: AnimatedDimensionality,
    description: "Every dimension gets its own box too! For the 6 columns in Half B, the MLP outputs parameters for 6 distinct boxes simultaneously per data point. Column 7 gets bent by Box A, Column 8 gets bent by Box B, outputting 6 separate z-values."
  },
  {
    id: 'loss-scale',
    chapter: 'The Massive Scale',
    title: '21. The Grading Rubric',
    icon: Sigma,
    Visual: AnimatedMassiveLoss,
    description: "At 1,024 samples and 6 columns, PyTorch physically draws 6,144 unique Spline Boxes per layer in a millisecond. All 6,144 resulting z-values are evaluated by the 6D Bell Curve rubric. The scores are averaged to create the Final Loss, triggering backpropagation."
  }
];

export default function SplineIntuitionSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
        <div className="p-3 bg-fuchsia-100 text-fuchsia-600 rounded-xl shadow-sm border border-fuchsia-200">
          <Activity className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Neural Spline Flows</h2>
          <p className="text-sm text-slate-500 font-medium">Deconstructing Monotonic Rational-Quadratic Transforms</p>
        </div>
      </div>

      {/* Chapter Indicator */}
      <div className="w-full flex items-center justify-between mb-2">
         <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-500">{step.chapter}</span>
         <span className="font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200 shadow-sm">
            Concept {currentStep + 1} / {steps.length}
         </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full flex gap-1 mb-6 flex-wrap">
        {steps.map((s, idx) => (
          <div 
            key={s.id} 
            onClick={() => setCurrentStep(idx)}
            className={`h-2 flex-1 min-w-[10px] rounded-full cursor-pointer transition-all duration-300 ${
              idx === currentStep ? 'bg-fuchsia-600 scale-y-125 shadow-[0_0_8px_rgba(192,38,211,0.5)]' : 
              idx < currentStep ? 'bg-fuchsia-300' : 'bg-slate-200 hover:bg-slate-300'
            }`}
            title={s.title}
          />
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[450px]">
        
        {/* Left Col: Explanations */}
        <div className="lg:col-span-5 flex flex-col gap-5 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-slate-900 rounded-xl text-white shadow-md flex-shrink-0 border border-slate-700">
              <step.icon size={20} className="text-fuchsia-400" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">{step.title}</h3>
          </div>
          
          <div className="text-slate-600 leading-relaxed text-[15px]">
            {step.description}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100">
             <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
               <MousePointer2 className="text-fuchsia-500 flex-shrink-0 mt-0.5" size={18}/>
               <p className="text-xs text-slate-600 leading-relaxed">
                 The visuals on the right directly recreate the mathematical mechanics and figures detailed in <strong>Section 3: Method</strong> of the Durkan et al. paper.
               </p>
             </div>
          </div>
        </div>

        {/* Right Col: Interactive Visual */}
        <div className="lg:col-span-7 flex flex-col min-w-0">
          <div className="flex-1 w-full rounded-2xl shadow-xl overflow-hidden relative border-4 border-slate-900/5 bg-[#0d1117]">
             <step.Visual />
          </div>
        </div>

      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
        <button 
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <ChevronLeft size={18} /> Previous Concept
        </button>
        
        <button 
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all text-white bg-fuchsia-600 hover:bg-fuchsia-700 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {currentStep === steps.length - 1 ? 'Finish Exploration' : 'Next Concept'} <ChevronRight size={18} />
        </button>
      </div>

    </div>
  );
}