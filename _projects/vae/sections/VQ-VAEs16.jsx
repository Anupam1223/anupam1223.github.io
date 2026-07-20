import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, ArrowRight, ArrowDown,
  BrainCircuit, Activity, Target, AlertTriangle, 
  Database, Magnet, SkipBack, Zap, Grid, 
  BookOpen, Key, CheckCircle
} from 'lucide-react';

// --- SLIDE 1: Continuous vs Discrete ---
const ContinuousVsDiscreteSlide = () => {
  const [mode, setMode] = useState('continuous');

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">The Shift: Continuous to Discrete</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Standard VAEs use a <strong>continuous</strong> latent space, which often results in blurry, averaged-out images. VQ-VAEs introduce a <strong>discrete</strong> latent space (a finite dictionary), forcing the model to make sharp, crisp decisions.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Visualizer */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border-4 border-slate-700 p-8 flex flex-col items-center justify-center relative overflow-hidden transition-colors">
           
           <div className="flex gap-4 mb-8 bg-slate-900 p-2 rounded-xl shadow-inner border border-slate-700 z-20 relative">
             <button onClick={() => setMode('continuous')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${mode === 'continuous' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Continuous (Standard VAE)</button>
             <button onClick={() => setMode('discrete')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${mode === 'discrete' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Discrete (VQ-VAE)</button>
           </div>

           <div className="relative w-64 h-64 flex items-center justify-center">
              <AnimatePresence mode="wait">
                 {mode === 'continuous' ? (
                   <motion.div key="cont" initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.8}} className="w-full h-full rounded-full bg-[conic-gradient(from_0deg,red,yellow,lime,aqua,blue,magenta,red)] blur-md opacity-80 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-white/10 rounded-full"></div>
                      <div className="absolute w-4 h-4 bg-white/80 rounded-full shadow-[0_0_15px_white] backdrop-blur-sm border-2 border-white" style={{ top: '30%', left: '70%' }}></div>
                   </motion.div>
                 ) : (
                   <motion.div key="disc" initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.8}} className="w-full h-full grid grid-cols-4 grid-rows-4 gap-2">
                      {Array.from({length: 16}).map((_, i) => (
                        <div key={i} className={`rounded-md shadow-sm border-2 ${i === 6 ? 'border-white scale-110 z-10 shadow-[0_0_15px_white]' : 'border-slate-800/50'}`} style={{ backgroundColor: `hsl(${(i * 360) / 16}, 80%, 50%)`}}></div>
                      ))}
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>

        </div>

        {/* Explanation */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           
           <div className={`p-6 rounded-2xl border-l-4 shadow-md transition-all duration-500 ${mode === 'continuous' ? 'bg-indigo-900/30 border-indigo-500' : 'bg-slate-800 border-slate-700'}`}>
             <h4 className="font-bold text-indigo-400 mb-2 flex items-center gap-2"><Activity className="w-5 h-5"/> The Continuous Problem</h4>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               In a continuous space, there are infinite possible values between "Red" and "Yellow". The VAE decoder tries to accommodate all of them, often outputting a blurry, muddy orange when uncertain.
             </p>
           </div>

           <div className={`p-6 rounded-2xl border-l-4 shadow-md transition-all duration-500 ${mode === 'discrete' ? 'bg-emerald-900/30 border-emerald-500' : 'bg-slate-800 border-slate-700'}`}>
             <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2"><Grid className="w-5 h-5"/> The Discrete Solution</h4>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               VQ-VAEs force the model to choose from a strict <strong>Codebook</strong> (a fixed palette). It cannot choose a muddy in-between color. It MUST snap to the nearest defined concept.
             </p>
             <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs font-mono text-emerald-300">
               Result: Sharper, crisper generated samples!
             </div>
           </div>

        </div>

      </div>
    </div>
  );
};

// --- SLIDE 2: VQ-VAE Architecture & Quantization ---
const VQVAEArchitectureSlide = () => {
  const [step, setStep] = useState(0);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-4">
        <h2 className="text-3xl font-bold mb-2 text-center">Architecture: The Quantization Step</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          How do we map a continuous output into a discrete space? We use a <strong>Codebook</strong> and a Nearest Neighbor lookup.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-4">
        
        {/* Architecture Flow */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
           
           <div className="flex items-center w-full justify-between max-w-3xl relative">
              
              {/* Encoder */}
              <div className="flex flex-col items-center z-10 w-24 shrink-0">
                 <div className={`w-16 h-16 bg-blue-100 border-2 border-blue-400 rounded-lg flex items-center justify-center shadow-md transition-all ${step >= 1 ? 'ring-4 ring-blue-300' : ''}`}>
                   <span className="font-bold text-blue-800 text-xs">Encoder</span>
                 </div>
                 <span className="text-[10px] font-mono text-blue-600 mt-2">enc(x)</span>
              </div>

              {/* Continuous Output z_e */}
              <div className="flex flex-col items-center z-10 relative">
                 <div className={`w-28 h-12 bg-indigo-100 border-2 border-indigo-400 rounded-full flex flex-col items-center justify-center shadow-md transition-all ${step >= 2 ? 'ring-4 ring-indigo-300' : ''}`}>
                   <span className="font-mono font-bold text-indigo-800 text-[10px]">z_e(x)</span>
                   <span className="text-[8px] text-indigo-600">Continuous Vector</span>
                 </div>
                 {step >= 2 && <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -top-10 bg-slate-800 text-white text-[9px] font-mono px-2 py-1 rounded shadow-lg">[0.82, -0.41, 1.05]</motion.div>}
              </div>

              {/* Quantizer & Codebook */}
              <div className="flex flex-col items-center relative z-20">
                 {/* Codebook Database */}
                 <div className={`absolute -bottom-24 w-32 bg-emerald-50 border-2 border-emerald-400 rounded-lg p-2 shadow-lg flex flex-col items-center transition-all ${step >= 3 ? 'ring-4 ring-emerald-300 scale-110' : ''}`}>
                    <span className="text-[10px] font-bold text-emerald-800 mb-1 border-b border-emerald-200 w-full text-center pb-1">Codebook E</span>
                    <div className="text-[8px] font-mono text-emerald-700 w-full text-left space-y-1">
                      <div>e1: [0.10, 0.20, -0.1]</div>
                      <div className={`transition-colors ${step >= 3 ? 'bg-emerald-400 text-white font-bold p-0.5 rounded' : ''}`}>e2: [0.80, -0.40, 1.00]</div>
                      <div>...</div>
                      <div>e_K: [0.50, 0.50, 0.5]</div>
                    </div>
                 </div>

                 {/* Quantizer Block */}
                 <div className={`w-28 h-16 bg-teal-100 border-2 border-teal-400 rounded-lg flex flex-col items-center justify-center shadow-lg transition-all z-20 ${step >= 3 ? 'ring-4 ring-teal-300' : ''}`}>
                   <span className="font-bold text-teal-800 text-[10px]">Quantizer</span>
                   <span className="text-[8px] text-teal-600">(Lookup)</span>
                 </div>

                 {/* Dotted lines to codebook */}
                 <svg className="absolute w-full h-20 -bottom-20 z-10 pointer-events-none">
                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
                 </svg>
              </div>

              {/* Discrete Output z_q */}
              <div className="flex flex-col items-center z-10 relative">
                 <div className={`w-28 h-12 bg-purple-100 border-2 border-purple-400 rounded-full flex flex-col items-center justify-center shadow-md transition-all ${step >= 4 ? 'ring-4 ring-purple-300' : ''}`}>
                   <span className="font-mono font-bold text-purple-800 text-[10px]">z_q(x) = e_k</span>
                   <span className="text-[8px] text-purple-600">Discrete Vector</span>
                 </div>
                 {step >= 4 && <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -top-10 bg-slate-800 text-white text-[9px] font-mono px-2 py-1 rounded shadow-lg">[0.80, -0.40, 1.00]</motion.div>}
              </div>

              {/* Decoder */}
              <div className="flex flex-col items-center z-10 w-24 shrink-0">
                 <div className={`w-16 h-16 bg-rose-100 border-2 border-rose-400 rounded-lg flex items-center justify-center shadow-md transition-all ${step >= 5 ? 'ring-4 ring-rose-300' : ''}`}>
                   <span className="font-bold text-rose-800 text-xs">Decoder</span>
                 </div>
                 <span className="text-[10px] font-mono text-rose-600 mt-2">dec(z_q)</span>
              </div>

              {/* Arrow connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                 <path d="M 80 50 L 140 50" stroke="#94a3b8" strokeWidth="2" fill="none" />
                 <polygon points="135,45 145,50 135,55" fill="#94a3b8" />
                 
                 <path d="M 250 50 L 310 50" stroke="#94a3b8" strokeWidth="2" fill="none" />
                 <polygon points="305,45 315,50 305,55" fill="#94a3b8" />

                 <path d="M 420 50 L 480 50" stroke="#94a3b8" strokeWidth="2" fill="none" />
                 <polygon points="475,45 485,50 475,55" fill="#94a3b8" />

                 <path d="M 600 50 L 660 50" stroke="#94a3b8" strokeWidth="2" fill="none" />
                 <polygon points="655,45 665,50 655,55" fill="#94a3b8" />
              </svg>

           </div>
        </div>

        {/* Right Info Panel */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           <div className="bg-slate-800 text-white rounded-2xl shadow-xl p-8 border border-slate-700 min-h-[250px] flex flex-col">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-700 pb-2 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4"/> Step {step} of 5
              </h3>
              
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                  {step === 0 && <div><h4 className="text-xl font-bold mb-2">The Quantization Pipeline</h4><p className="text-sm text-slate-300">Click Next to trace data through the VQ-VAE architecture.</p></div>}
                  {step === 1 && <div><h4 className="text-xl font-bold text-blue-400 mb-2">1. Encoder</h4><p className="text-sm text-slate-300">The neural network processes the input image just like a normal VAE.</p></div>}
                  {step === 2 && <div><h4 className="text-xl font-bold text-indigo-400 mb-2">2. Continuous Output (z_e)</h4><p className="text-sm text-slate-300">The encoder outputs a continuous vector <span className="font-mono text-xs bg-slate-700 px-1 rounded">z_e(x)</span>. Notice this is just an intermediate output, NOT the final latent variable!</p></div>}
                  {step === 3 && <div><h4 className="text-xl font-bold text-emerald-400 mb-2">3. The Quantizer & Codebook</h4><p className="text-sm text-slate-300">The system calculates the Euclidean distance between <span className="font-mono text-xs">z_e</span> and every single vector in the learned <strong>Codebook E</strong>. It selects the closest match (the nearest neighbor).<br/><br/><span className="font-mono text-[10px] bg-slate-900 p-2 rounded block">k = argmin || z_e(x) - e_j ||²</span></p></div>}
                  {step === 4 && <div><h4 className="text-xl font-bold text-purple-400 mb-2">4. Discrete Output (z_q)</h4><p className="text-sm text-slate-300">The continuous vector is completely replaced by the chosen Codebook vector <span className="font-mono text-xs">e_k</span>. We now have our discrete latent representation <span className="font-mono text-xs">z_q(x)</span>.</p></div>}
                  {step === 5 && <div><h4 className="text-xl font-bold text-rose-400 mb-2">5. Decoder</h4><p className="text-sm text-slate-300">The Decoder takes this perfectly crisp, predefined codebook vector and reconstructs the image.</p></div>}
                </motion.div>
              </AnimatePresence>
           </div>

           <div className="flex justify-between items-center w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mt-auto">
             <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg disabled:opacity-30 hover:bg-slate-200 flex items-center gap-1 text-sm"><ChevronLeft className="w-4 h-4"/> Prev</button>
             <div className="flex gap-1.5">{Array.from({length: 6}).map((_, i) => (<div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>))}</div>
             <button onClick={() => setStep(Math.min(5, step + 1))} disabled={step === 5} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg disabled:opacity-30 hover:bg-indigo-500 flex items-center gap-1 text-sm">Next <ChevronRight className="w-4 h-4"/></button>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 3: Non-Differentiability & STE ---
const STESlide = () => {
  const [steActive, setSteActive] = useState(false);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">The Non-Differentiability Challenge</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          The <span className="font-mono bg-slate-800 px-1 rounded">argmin</span> function (picking the closest neighbor) is a hard step function. It has zero gradient everywhere. How do we backpropagate from the Decoder to the Encoder?
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Interactive Diagram */}
        <div className="flex-[1.5] bg-slate-800 rounded-2xl shadow-xl border-4 border-slate-700 p-8 flex flex-col relative overflow-hidden items-center justify-center">
           
           <div className="flex w-full items-center justify-between relative mt-16 max-w-2xl">
              
              <div className="bg-blue-900/50 border-2 border-blue-500 text-blue-300 font-bold px-6 py-4 rounded-xl z-10 shadow-lg">Encoder</div>
              
              <div className="relative flex flex-col items-center z-10 mx-4">
                 <div className="w-16 h-16 bg-rose-900/50 border-4 border-rose-500 rounded-lg flex items-center justify-center text-rose-300 font-bold font-mono shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                   argmin
                 </div>
                 {!steActive && (
                   <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-12 bg-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded shadow-lg uppercase tracking-widest whitespace-nowrap">
                     Gradient Blocked!
                   </motion.div>
                 )}
              </div>

              <div className="bg-emerald-900/50 border-2 border-emerald-500 text-emerald-300 font-bold px-6 py-4 rounded-xl z-10 shadow-lg">Decoder</div>
              
              {/* Normal Data Flow (Forward Pass) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                 <path d="M 120 30 L 250 30" stroke="#475569" strokeWidth="4" fill="none" />
                 <path d="M 320 30 L 450 30" stroke="#475569" strokeWidth="4" fill="none" />
              </svg>

              {/* Gradient Flow (Backward Pass) */}
              {steActive ? (
                 // STE active: Gradient bridges over
                 <>
                   <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                     <path d="M 450 -10 Q 285 -80 120 -10" stroke="#facc15" strokeWidth="4" strokeDasharray="8 8" fill="none" />
                     <polygon points="120,-10 135,-15 130,-5" fill="#facc15" />
                   </svg>
                   <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-widest z-30">
                     Straight-Through Estimator (STE)
                   </div>
                 </>
              ) : (
                 // STE inactive: Gradient hits argmin and dies
                 <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                   <path d="M 450 -10 L 320 -10" stroke="#f43f5e" strokeWidth="4" strokeDasharray="8 8" fill="none" />
                   <polygon points="320,-10 335,-15 330,-5" fill="#f43f5e" />
                   <circle cx="320" cy="-10" r="10" fill="#e11d48" className="animate-ping" />
                 </svg>
              )}

           </div>

           <button 
             onClick={() => setSteActive(!steActive)}
             className={`mt-24 px-8 py-3 rounded-full font-bold shadow-xl transition-all flex items-center gap-2 z-30 ${steActive ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-rose-600 text-white hover:bg-rose-500'}`}
           >
             <Zap className="w-5 h-5"/> {steActive ? 'Disable STE' : 'Activate Straight-Through Estimator'}
           </button>
        </div>

        {/* Explanation */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           
           <div className={`p-6 rounded-2xl border-l-4 transition-all duration-500 ${steActive ? 'bg-yellow-900/20 border-yellow-500' : 'bg-slate-800 border-slate-600'}`}>
             <h4 className={`font-bold mb-2 flex items-center gap-2 ${steActive ? 'text-yellow-400' : 'text-slate-300'}`}>
               <SkipBack className="w-5 h-5"/> The STE Bridge
             </h4>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               During the backward pass, we simply <strong>pretend the argmin operation doesn't exist</strong>. We copy the gradients directly from the Decoder's input <span className="font-mono text-xs bg-slate-900 px-1 rounded">z_q</span> and paste them straight onto the Encoder's output <span className="font-mono text-xs bg-slate-900 px-1 rounded">z_e</span>.
             </p>
             <div className="font-mono text-[10px] bg-slate-900 p-3 rounded-lg border border-slate-700 text-yellow-200/80">
               ∂L / ∂z_e(x) ≈ ∂L / ∂z_q(x)
             </div>
           </div>

           <div className="bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700">
             <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2"><Target className="w-5 h-5"/> The Result</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               This "hack" allows the Encoder to learn. The gradient tells the Encoder how to change its continuous output <span className="font-mono">z_e</span> so that, when it gets snapped to the nearest codebook vector, the resulting reconstruction is better.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 4: The 3-Part Loss Function ---
const VQVAELossSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">The VQ-VAE Loss Function</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Because we removed the standard KL Divergence prior, we need new loss terms to organize the latent space and keep the Codebook aligned with the Encoder.
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Giant Formula Box */}
        <div className="bg-slate-900 rounded-2xl shadow-xl border-2 border-slate-800 p-6 flex flex-col items-center relative w-full shrink-0 overflow-hidden">
           <div className="font-mono text-sm md:text-xl font-bold text-white text-center flex flex-wrap justify-center items-center gap-y-4 gap-x-2 mt-2 w-full">
             <span className="text-slate-400">Total Loss =</span>
             
             {/* Recon Loss */}
             <div className="relative group mx-2">
               <span className="bg-blue-900/50 text-blue-300 border border-blue-500/50 px-3 py-2 rounded-lg inline-block whitespace-nowrap shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                 || x - dec(z<sub className="text-[10px]">q</sub>(x)) ||²
               </span>
               <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] text-blue-400 uppercase tracking-widest font-sans font-bold whitespace-nowrap">
                 Reconstruction
               </div>
             </div>
             
             <span className="text-slate-500 text-3xl mx-1">+</span>
             
             {/* Codebook Loss */}
             <div className="relative group mx-2">
               <span className="bg-emerald-900/50 text-emerald-300 border border-emerald-500/50 px-3 py-2 rounded-lg inline-block whitespace-nowrap shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                 || <span className="text-rose-400">sg</span>[z<sub className="text-[10px]">e</sub>(x)] - e<sub className="text-[10px]">k</sub> ||²
               </span>
               <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] text-emerald-400 uppercase tracking-widest font-sans font-bold whitespace-nowrap">
                 Codebook Loss
               </div>
             </div>

             <span className="text-slate-500 text-3xl mx-1">+ β</span>

             {/* Commitment Loss */}
             <div className="relative group mx-2">
               <span className="bg-purple-900/50 text-purple-300 border border-purple-500/50 px-3 py-2 rounded-lg inline-block whitespace-nowrap shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                 || z<sub className="text-[10px]">e</sub>(x) - <span className="text-rose-400">sg</span>[e<sub className="text-[10px]">k</sub>] ||²
               </span>
               <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] text-purple-400 uppercase tracking-widest font-sans font-bold whitespace-nowrap">
                 Commitment Loss
               </div>
             </div>
           </div>
        </div>

        {/* Explanations & Visuals */}
        <div className="flex flex-col lg:flex-row gap-6 w-full flex-grow mt-2">
           
           {/* Codebook Loss Visualizer */}
           <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col relative overflow-hidden shadow-sm">
             <h4 className="font-bold text-emerald-600 text-lg mb-2 flex items-center gap-2"><Database className="w-5 h-5"/> Codebook Alignment</h4>
             <p className="text-xs text-slate-600 mb-6 leading-relaxed">
               The Encoder produces output <span className="font-mono font-bold">z_e</span>. The stop-gradient <span className="font-mono text-rose-500 font-bold">sg[]</span> acts like an anchor, freezing <span className="font-mono font-bold">z_e</span> in place. This loss pulls the Codebook vector <span className="font-mono font-bold">e_k</span> towards the Encoder's output to update the dictionary.
             </p>
             
             <div className="flex-grow bg-slate-50 rounded-xl border border-slate-200 relative flex items-center justify-center min-h-[120px]">
                {/* z_e Anchor */}
                <div className="absolute right-[20%] flex flex-col items-center z-20">
                   <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-rose-500 flex items-center justify-center shadow-lg"></div>
                   <span className="text-[9px] font-bold font-mono mt-1 text-blue-700 bg-white px-1 rounded shadow-sm border border-slate-200">sg[z_e]</span>
                </div>
                {/* e_k Moving */}
                <div className="absolute left-[30%] flex flex-col items-center z-10">
                   <motion.div animate={{ x: [0, 40, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-6 h-6 bg-emerald-400 rounded-md shadow-md"></motion.div>
                   <span className="text-[9px] font-bold font-mono mt-1 text-emerald-700 bg-white px-1 rounded shadow-sm border border-slate-200">e_k</span>
                </div>
                {/* Arrow */}
                <ArrowRight className="absolute text-emerald-500 w-8 h-8 opacity-50 z-0" style={{ left: '45%'}} />
             </div>
           </div>

           {/* Commitment Loss Visualizer */}
           <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col relative overflow-hidden shadow-sm">
             <h4 className="font-bold text-purple-600 text-lg mb-2 flex items-center gap-2"><Magnet className="w-5 h-5"/> Encoder Commitment</h4>
             <p className="text-xs text-slate-600 mb-6 leading-relaxed">
               Now, the Codebook vector <span className="font-mono font-bold">e_k</span> gets anchored by <span className="font-mono text-rose-500 font-bold">sg[]</span>. This loss forces the Encoder to "commit" to the nearest Codebook vector, stopping the Encoder's outputs from fluctuating wildly or growing too large.
             </p>
             
             <div className="flex-grow bg-slate-50 rounded-xl border border-slate-200 relative flex items-center justify-center min-h-[120px]">
                {/* e_k Anchor */}
                <div className="absolute left-[20%] flex flex-col items-center z-20">
                   <div className="w-6 h-6 bg-emerald-400 rounded-md border-4 border-rose-500 flex items-center justify-center shadow-lg"></div>
                   <span className="text-[9px] font-bold font-mono mt-1 text-emerald-700 bg-white px-1 rounded shadow-sm border border-slate-200">sg[e_k]</span>
                </div>
                {/* z_e Moving */}
                <div className="absolute right-[30%] flex flex-col items-center z-10">
                   <motion.div animate={{ x: [0, -40, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-6 h-6 bg-blue-500 rounded-full shadow-md"></motion.div>
                   <span className="text-[9px] font-bold font-mono mt-1 text-blue-700 bg-white px-1 rounded shadow-sm border border-slate-200">z_e</span>
                </div>
                {/* Arrow */}
                <ArrowRight className="absolute text-purple-500 w-8 h-8 opacity-50 z-0 transform rotate-180" style={{ right: '45%'}} />
             </div>
           </div>

        </div>

      </div>
    </div>
  );
};

// --- SLIDE 5: Advantages & Dead Codes ---
const AdvantagesAndChallengesSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">Advantages & The "Dead Code" Challenge</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          VQ-VAEs solve major problems with standard VAEs, but managing the discrete Codebook introduces its own unique failure mode.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: Advantages */}
        <div className="flex-1 flex flex-col gap-4">
           <h3 className="font-bold text-emerald-400 text-sm uppercase tracking-widest border-b border-slate-700 pb-2 flex items-center gap-2">
             <CheckCircle className="w-5 h-5"/> Key Advantages
           </h3>
           
           <div className="bg-slate-800 border-l-4 border-emerald-500 p-5 rounded-r-xl shadow-sm hover:bg-slate-700 transition-colors">
             <h4 className="font-bold text-emerald-300 mb-1">Sharper Samples</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               Continuous latent spaces suffer from "averaging effects" causing blur. By forcing the decoder to pick from a defined, crisp vocabulary (the Codebook), outputs become highly detailed.
             </p>
           </div>

           <div className="bg-slate-800 border-l-4 border-emerald-500 p-5 rounded-r-xl shadow-sm hover:bg-slate-700 transition-colors">
             <h4 className="font-bold text-emerald-300 mb-1">No Posterior Collapse</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               Because there is <strong>no KL Divergence penalty</strong> aggressively pushing the encoder to a N(0,1) prior, the encoder never "gives up" and stops learning. The bottleneck is enforced structurally via quantization instead of mathematically.
             </p>
           </div>

           <div className="bg-slate-800 border-l-4 border-emerald-500 p-5 rounded-r-xl shadow-sm hover:bg-slate-700 transition-colors">
             <h4 className="font-bold text-emerald-300 mb-1">Semantic Vocabulary</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               The learned discrete codes often map perfectly to real-world concepts (like distinct phonemes in speech audio).
             </p>
           </div>
        </div>

        {/* Right: Dead Codebook Visualizer */}
        <div className="flex-[1.2] bg-slate-800 rounded-2xl shadow-xl border-4 border-slate-700 p-6 flex flex-col relative overflow-hidden items-center">
           <h3 className="font-bold text-amber-400 text-sm uppercase tracking-widest border-b border-slate-700 pb-2 w-full flex items-center justify-center gap-2 mb-6">
             <AlertTriangle className="w-5 h-5"/> Codebook Collapse (Dead Codes)
           </h3>

           <div className="w-full h-64 bg-slate-900 border-2 border-slate-600 rounded-xl relative overflow-hidden shadow-inner flex items-center justify-center mb-4">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '10% 20%', backgroundPosition: 'left bottom' }}></div>

              {/* Encoder Output Cluster */}
              <div className="absolute w-32 h-32 bg-blue-500/10 rounded-full border border-blue-500/30 flex items-center justify-center" style={{ left: '20%', top: '20%' }}>
                {/* Deterministic clustered points */}
                <div className="absolute w-2 h-2 bg-blue-400 rounded-full" style={{ left: '40%', top: '35%'}}></div>
                <div className="absolute w-2 h-2 bg-blue-400 rounded-full" style={{ left: '55%', top: '60%'}}></div>
                <div className="absolute w-2 h-2 bg-blue-400 rounded-full" style={{ left: '30%', top: '50%'}}></div>
                <div className="absolute w-2 h-2 bg-blue-400 rounded-full" style={{ left: '60%', top: '40%'}}></div>
                <div className="absolute w-2 h-2 bg-blue-400 rounded-full" style={{ left: '45%', top: '70%'}}></div>
                <span className="absolute -bottom-6 text-[10px] text-blue-400 font-bold">Encoder Outputs</span>
              </div>

              {/* Active Codebook Vectors */}
              <div className="absolute w-4 h-4 bg-emerald-400 rounded-sm shadow-[0_0_10px_#34d399] z-10" style={{ left: '30%', top: '35%' }}></div>
              <div className="absolute w-4 h-4 bg-emerald-400 rounded-sm shadow-[0_0_10px_#34d399] z-10" style={{ left: '45%', top: '45%' }}></div>

              {/* Dead Codebook Vectors */}
              <div className="absolute w-4 h-4 bg-slate-600 rounded-sm opacity-50" style={{ left: '70%', top: '70%' }}></div>
              <div className="absolute w-4 h-4 bg-slate-600 rounded-sm opacity-50" style={{ left: '80%', top: '60%' }}></div>
              <div className="absolute w-4 h-4 bg-slate-600 rounded-sm opacity-50" style={{ left: '60%', top: '80%' }}></div>
              
              <div className="absolute bottom-4 right-4 bg-slate-800/80 p-2 rounded border border-slate-600">
                <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 bg-emerald-400 rounded-sm"></div><span className="text-[10px] text-slate-300">Active (Used)</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-600 rounded-sm"></div><span className="text-[10px] text-slate-300">Dead (Never picked)</span></div>
              </div>
           </div>

           <p className="text-sm text-slate-400 leading-relaxed text-center px-4">
             If the encoder outputs tightly cluster in one corner of space, many codebook vectors will <em>never</em> be the "nearest neighbor". Because they are never picked, they receive zero gradient and die. If your codebook size K=512, you might only actually be using 20 of them!
           </p>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 6: Stage 2 - Autoregressive Prior ---
const Stage2ConceptSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">Stage 2: The Autoregressive Prior</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          A VQ-VAE learns a vocabulary (the Codebook) and how to compress an image into a grid of indices (e.g., <code>[12, 45, 2, 88...]</code>). But to generate <strong>new</strong> images, we need a model that knows how to write sentences using that vocabulary!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Visual Analogy */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col relative overflow-hidden">
           <h3 className="font-bold text-slate-700 mb-8 text-sm uppercase tracking-widest text-center border-b pb-2">Separating Concerns</h3>
           
           <div className="flex-grow flex flex-col items-center justify-center w-full gap-8">
              
              <div className="flex items-center gap-6 w-full justify-center">
                 <div className="bg-blue-50 border-2 border-blue-400 p-4 rounded-xl flex flex-col items-center w-48 shadow-sm">
                   <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                   <h4 className="font-bold text-blue-900 text-sm text-center">Stage 1: VQ-VAE</h4>
                   <p className="text-[10px] text-blue-700 text-center mt-2 font-mono">Learns the Dictionary<br/>(Local Features: "What")</p>
                   <div className="flex gap-1 mt-3">
                     <div className="w-4 h-4 bg-emerald-400 rounded-sm"></div>
                     <div className="w-4 h-4 bg-rose-400 rounded-sm"></div>
                     <div className="w-4 h-4 bg-purple-400 rounded-sm"></div>
                   </div>
                 </div>

                 <span className="text-2xl font-bold text-slate-300">+</span>

                 <div className="bg-rose-50 border-2 border-rose-400 p-4 rounded-xl flex flex-col items-center w-48 shadow-sm">
                   <BrainCircuit className="w-8 h-8 text-rose-600 mb-2" />
                   <h4 className="font-bold text-rose-900 text-sm text-center">Stage 2: Transformer</h4>
                   <p className="text-[10px] text-rose-700 text-center mt-2 font-mono">Learns the Grammar<br/>(Global Structure: "How")</p>
                   <div className="flex gap-1 mt-3 opacity-50">
                     <div className="w-12 h-2 bg-slate-400 rounded-full"></div>
                   </div>
                 </div>
              </div>

              <div className="bg-slate-800 text-white p-6 rounded-2xl w-full max-w-lg shadow-xl border border-slate-700 relative mt-4">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute top-2 left-4">How it looks at an image</span>
                 
                 <div className="flex flex-col gap-2 mt-4 font-mono text-xs">
                   <div className="flex items-center gap-2">
                     <span className="text-emerald-400">[Code 12]</span>
                     <span className="text-slate-300">"This corner looks like a left ear."</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-rose-400">[Code 45]</span>
                     <span className="text-slate-300">"Given it's a left ear, the next block is probably fur."</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-purple-400">[Code 88]</span>
                     <span className="text-slate-300">"Given ear and fur, the next block must be an eye."</span>
                   </div>
                 </div>
              </div>

           </div>
        </div>

        {/* Right Info */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h4 className="font-bold text-slate-800 text-lg mb-2">Why a 2-Stage Process?</h4>
             <p className="text-sm text-slate-600 leading-relaxed">
               Standard VAEs try to learn local pixel sharpness AND global image layout inside one single model. This causes them to compromise and blur everything. VQ-VAEs isolate these tasks.
             </p>
           </div>
           
           <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-sm border border-slate-700 flex-grow flex flex-col justify-center">
             <h4 className="font-bold text-rose-400 text-lg mb-2 flex items-center gap-2"><Key className="w-5 h-5"/> Powerful Priors</h4>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               Because the latent space is now just a sequence of discrete indices (integers like <span className="font-mono text-xs">0, 1, 2... K</span>), we can apply standard NLP models (like Transformers or PixelCNN) to learn the prior <span className="font-mono text-xs bg-slate-900 p-1 rounded">p(k)</span>.
             </p>
             <div className="bg-slate-900 border border-slate-600 p-3 rounded-lg text-xs font-mono text-slate-400 text-center" dangerouslySetInnerHTML={{__html: "p(k) = &prod; p(k_i | k_{&lt;i})" }} />
           </div>
        </div>

      </div>
    </div>
  );
};

const TwoStageFlowchartSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white font-sans">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">Two-Stage Training & Generation</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Because we removed the standard VAE prior, we explicitly train a separate autoregressive model <span className="font-mono text-xs bg-slate-800 px-1 rounded">p(k) = ∏ p(k_i | k_{'{'}&lt;i{'}'})</span> on the discrete indices generated by the frozen VQ-VAE encoder.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto flex-grow pb-8 items-stretch">
        
        {/* LEFT COLUMN: TRAINING */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Stage 1 Training */}
          <div className="bg-slate-50 text-slate-800 rounded-xl p-6 shadow-lg border border-slate-300 flex flex-col items-center relative">
             <div className="absolute top-0 left-0 bg-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-tl-xl rounded-br-xl uppercase tracking-widest">Training (Stage 1)</div>
             <h3 className="font-bold text-lg mb-6 mt-2 text-slate-700">VQ-VAE Training</h3>
             
             <div className="bg-blue-300 border border-blue-400 text-blue-900 px-6 py-2 rounded-lg text-sm font-medium shadow-sm z-10 w-40 text-center">Input x</div>
             <ArrowDown className="w-5 h-5 text-slate-400 my-2" />
             
             <div className="bg-blue-400 border border-blue-500 text-blue-950 px-6 py-4 rounded-lg text-sm font-bold shadow-md z-10 w-64 text-center">
               VQ-VAE<br/>
               <span className="font-normal text-xs">(Encoder + Quantizer + Decoder)</span>
             </div>
             
             {/* Diagonal Arrows Container */}
             <div className="w-full flex justify-center h-12 relative mt-2 mb-2">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                  {/* Left branch */}
                  <path d="M 50% 0 L 25% 100%" stroke="#94a3b8" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
                  {/* Right branch */}
                  <path d="M 50% 0 L 75% 100%" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" fill="none" markerEnd="url(#arrowhead)"/>
                </svg>
                {/* Arrowhead definition for SVG */}
                <svg className="hidden">
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                    </marker>
                  </defs>
                </svg>
             </div>

             <div className="flex w-full justify-between px-4 z-10 mt-2">
               <div className="bg-indigo-300/80 border border-indigo-400 text-indigo-900 px-4 py-3 rounded-full text-xs font-bold shadow-sm w-[45%] text-center">
                 Discrete Latent Codes k
               </div>
               <div className="bg-emerald-300 border border-emerald-400 text-emerald-900 px-4 py-3 rounded-lg text-xs font-bold shadow-sm w-[45%] text-center flex flex-col justify-center relative">
                 <span className="absolute -top-6 text-[9px] text-slate-500 left-1/2 transform -translate-x-1/2">learns</span>
                 Learned Codebook E
               </div>
             </div>
          </div>

          {/* Stage 2 Training */}
          <div className="bg-slate-50 text-slate-800 rounded-xl p-6 shadow-lg border border-slate-300 flex flex-col items-center relative flex-grow">
             <div className="absolute top-0 left-0 bg-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-tl-xl rounded-br-xl uppercase tracking-widest">Training (Stage 2)</div>
             <h3 className="font-bold text-lg mb-6 mt-2 text-slate-700">Autoregressive Prior</h3>
             
             <div className="bg-indigo-300 border border-indigo-400 text-indigo-900 px-6 py-3 rounded-lg text-xs font-bold shadow-sm z-10 w-64 text-center">
               Discrete Latent Codes k<br/>
               <span className="font-normal text-[10px]">(from VQ-VAE Encoder)</span>
             </div>
             
             <ArrowDown className="w-5 h-5 text-slate-400 my-4" />
             
             <div className="bg-rose-300 border border-rose-400 text-rose-950 px-6 py-4 rounded-lg text-sm font-bold shadow-md z-10 w-64 text-center">
               Autoregressive Model<br/>
               <span className="font-normal text-[10px]">(e.g., PixelCNN, Transformer)</span>
             </div>

             <div className="flex flex-col items-center relative my-4">
                <div className="h-8 border-l-2 border-slate-400 border-dashed"></div>
                <span className="absolute top-1/2 transform -translate-y-1/2 left-4 text-[10px] text-slate-500 font-bold bg-slate-50 px-1">learns</span>
             </div>
             
             <div className="bg-rose-400 border border-rose-500 text-rose-950 px-8 py-3 rounded-full text-xs font-bold shadow-sm z-10 text-center">
               Learned Prior p(k)
             </div>
          </div>

        </div>

        {/* RIGHT COLUMN: GENERATION */}
        <div className="flex-1 bg-slate-800 rounded-xl p-6 shadow-2xl border-2 border-slate-600 flex flex-col items-center relative h-full">
           <div className="absolute top-0 left-0 bg-slate-700 text-slate-300 text-[10px] font-bold px-3 py-1 rounded-tl-xl rounded-br-xl uppercase tracking-widest">Inference</div>
           <h3 className="font-bold text-xl mb-12 mt-2 text-white flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400"/> Generation</h3>
           
           <div className="flex flex-col items-center flex-grow justify-center w-full max-w-sm gap-2">
             
             <div className="bg-rose-500 border-2 border-rose-400 text-white px-6 py-4 rounded-xl text-sm font-bold shadow-lg z-10 w-full text-center">
               Sample k ~ p(k)<br/>
               <span className="font-normal text-xs text-rose-200">from Autoregressive Prior</span>
             </div>
             
             <div className="h-12 border-l-2 border-slate-500"></div>
             
             <div className="bg-emerald-500 border-2 border-emerald-400 text-white px-6 py-4 rounded-xl text-sm font-bold shadow-lg z-10 w-full text-center">
               Lookup e_k in E<br/>
               <span className="font-normal text-xs text-emerald-200">(from VQ-VAE Codebook)</span>
             </div>

             <div className="h-12 border-l-2 border-slate-500"></div>

             <div className="bg-blue-500 border-2 border-blue-400 text-white px-6 py-4 rounded-xl text-sm font-bold shadow-lg z-10 w-full text-center">
               VQ-VAE Decoder
             </div>

             <div className="h-12 border-l-2 border-slate-500"></div>

             <div className="bg-sky-400 border-2 border-sky-300 text-sky-950 px-6 py-4 rounded-full text-sm font-bold shadow-lg z-10 w-full text-center">
               Generated Sample x_hat
             </div>

           </div>
           
           <p className="text-xs text-slate-400 mt-8 text-center italic border-t border-slate-700 pt-4">
             Two-stage generation process with VQ-VAEs. Stage 1 trains the VQ-VAE. Stage 2 trains an autoregressive prior over the learned discrete codes. For generation, codes are sampled from this prior, converted to embeddings, and decoded.
           </p>
        </div>

      </div>
    </div>
  );
};


// --- MAIN SLIDESHOW COMPONENT ---
const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    ContinuousVsDiscreteSlide,
    VQVAEArchitectureSlide,
    STESlide,
    VQVAELossSlide,
    AdvantagesAndChallengesSlide,
    Stage2ConceptSlide,
    TwoStageFlowchartSlide
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
            key={`slide-${currentSlide}`}
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
          className="p-3 rounded-full bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-slate-200"
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-6 h-6"/>
        </button>
        
        <div className="flex space-x-2">
          {slides.map((_, i) => (
            <div
              key={`dot-${i}`}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentSlide ? 'bg-indigo-600 scale-125' : 'bg-slate-300'}`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-indigo-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-indigo-700 shadow-md"
          disabled={currentSlide === slides.length - 1}
        >
          <ChevronRight className="w-6 h-6"/>
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