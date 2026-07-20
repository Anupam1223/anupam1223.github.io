import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Calculator, 
  ArrowRight, ArrowDown, Target, CheckCircle, 
  Zap, ShieldAlert, AlertTriangle, 
  BrainCircuit, RotateCcw, Shuffle, XCircle, Settings2, Activity, HelpCircle,
  Network, ArrowLeft
} from 'lucide-react';

// --- SLIDE 1: The Problem (Stochastic Nodes Block Gradients) ---
const TheRoadblockSlide = () => {
  const [backpropState, setBackpropState] = useState('idle');

  const triggerBackprop = () => {
    setBackpropState('flowing');
    setTimeout(() => setBackpropState('blocked'), 1500);
    setTimeout(() => setBackpropState('idle'), 4000);
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The Problem: Sampling Breaks Gradient Flow</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          To train a VAE, we must minimize the Reconstruction Loss. This requires backpropagating gradients from the loss, through the Decoder, <strong>through the latent variable z</strong>, and back to the Encoder.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col items-center relative overflow-hidden">
           <h3 className="font-bold text-slate-700 mb-6 text-sm uppercase tracking-widest border-b pb-2 w-full text-center">The Computation Graph</h3>

           <div className="flex-grow flex flex-col items-center justify-center w-full relative">
              
              <div className="w-48 bg-blue-100 border-2 border-blue-400 p-3 rounded-xl flex flex-col items-center shadow-md z-10">
                 <span className="font-bold text-blue-800">Encoder (φ)</span>
                 <span className="text-xs font-mono text-blue-600 mt-1">Outputs: μ_φ(x), σ_φ(x)</span>
                 {backpropState === 'blocked' && <span className="absolute -left-12 text-xs font-bold text-rose-500 font-mono animate-pulse">∇φ = ???</span>}
              </div>

              <div className="h-12 w-1 bg-slate-300 relative">
                 <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-400"></div>
                 <AnimatePresence>
                   {backpropState === 'blocked' && (
                     <motion.div key="block-icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute -left-8 top-1/2 flex flex-col items-center text-rose-500">
                        <XCircle className="w-6 h-6 bg-white rounded-full"/>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              <div className="relative z-10 group">
                 <div className="w-56 bg-rose-50 border-2 border-dashed border-rose-400 p-4 rounded-full flex flex-col items-center shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500 to-transparent"></div>
                    <Shuffle className="w-6 h-6 text-rose-500 mb-1 relative z-10" />
                    <span className="font-bold text-rose-800 text-sm relative z-10">Stochastic Node</span>
                    <span className="text-[10px] font-mono font-bold text-rose-600 mt-1 relative z-10">Sample z ~ q_φ(z|x)</span>
                 </div>
                 {backpropState === 'blocked' && (
                   <motion.div key="grad-blocked-label" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                      <div className="bg-rose-600 text-white font-bold text-xs px-3 py-1 rounded shadow-lg transform rotate-12 uppercase tracking-widest whitespace-nowrap">Gradient Blocked!</div>
                   </motion.div>
                 )}
              </div>

              <div className="h-12 w-1 bg-slate-300 relative">
                 <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-400"></div>
                 <AnimatePresence>
                   {(backpropState === 'flowing' || backpropState === 'blocked') && (
                     <motion.div key="flow-line" initial={{ height: 0, opacity: 0 }} animate={{ height: '100%', opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute left-4 bottom-0 w-1 bg-emerald-500 origin-bottom flex flex-col items-center justify-start">
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-emerald-500"></div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              <div className="w-48 bg-emerald-50 border-2 border-emerald-400 p-3 rounded-xl flex flex-col items-center shadow-md z-10">
                 <span className="font-bold text-emerald-800">Decoder (θ)</span>
                 <span className="text-xs font-mono text-emerald-600 mt-1">log p_θ(x|z)</span>
              </div>
           </div>

           <button 
             onClick={triggerBackprop}
             disabled={backpropState !== 'idle'}
             className={`mt-8 px-8 py-3 rounded-full font-bold shadow-md transition-all flex items-center gap-2 ${backpropState !== 'idle' ? 'bg-slate-200 text-slate-500' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105'}`}
           >
             <RotateCcw className={`w-5 h-5 ${backpropState === 'flowing' ? 'animate-spin' : ''}`} />
             Trigger Backpropagation
           </button>
        </div>

        <div className="flex-1 flex flex-col gap-4">
           
           <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl shadow-sm">
             <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-2"><ShieldAlert className="w-5 h-5"/> The Mathematical Wall</h4>
             <div className="font-mono text-xs bg-white px-3 py-2 border border-rose-100 rounded mb-4 text-slate-600 overflow-x-auto">
               ∇_φ E<sub className="text-[10px]">q_φ(z|x)</sub> [ log p_θ(x|z) ] = <span className="text-rose-600 font-bold">???</span>
             </div>
             <p className="text-sm text-slate-700 leading-relaxed mb-4">
               To update the Encoder's weights (<span className="font-mono font-bold">φ</span>), the gradient must pass through the sampling operation <span className="font-mono">z ~ q(z|x)</span>.
             </p>
             <p className="text-sm text-slate-700 leading-relaxed">
               <strong>You cannot take the derivative of a random coin flip.</strong> The act of sampling is inherently random and non-differentiable. The computational chain is broken, making standard backpropagation impossible.
             </p>
           </div>

           <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm flex-grow text-white">
             <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-blue-400"/> Analogy</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               Imagine a machine where turning a dial changes how hard you shake a box containing a pair of dice. You shake the box, open it, and look at the number. 
               <br/><br/>
               If I ask you, <em>"What is the exact mathematical derivative of the dice roll with respect to the dial?"</em> you cannot answer. The outcome is fundamentally random.
             </p>
           </div>

        </div>
      </div>
    </div>
  );
};

// --- SLIDE 2: Gradient Calculation & The Sampling Block (MANUAL STEP-BY-STEP) ---
const GradientCalculationSlide = () => {
  const [step, setStep] = useState(0); 
  
  const pipelineSteps = [
    { title: "1. Input Data", desc: "Ready to feed the array into the Encoder." },
    { title: "2. Encoder Forward Pass", desc: "The network outputs the distribution parameters μ and σ." },
    { title: "3. Stochastic Sampling", desc: "We roll the dice and draw a random sample z." },
    { title: "4. Decoder & Loss", desc: "We reconstruct the data and calculate our Total Loss (J)." },
    { title: "5. Backpropagation", desc: "The gradient flows backwards, but hits the random sampling wall!" }
  ];

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Calculating Gradients: The Pipeline</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Use the controls below to step through the VAE pipeline and see exactly where and why the Chain Rule breaks. Gradient Descent relies on a continuous chain of derivatives!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full flex-grow items-stretch pb-4">
        
        <div className="flex-[1.5] bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-6 flex flex-col relative overflow-hidden">
           
           <div className="flex justify-between items-center w-full relative mt-8 flex-grow max-h-[300px]">
              
              <div className="flex flex-col items-center z-10 w-24">
                 <span className="text-xs font-bold text-slate-400 mb-2">Input (x)</span>
                 <div className="bg-slate-700 border border-slate-600 rounded p-2 text-[10px] font-mono shadow-inner space-y-1 w-full text-center">
                   <div>[1.0]</div><div>[2.0]</div><div>[3.0]</div><div>[4.0]</div><div>[5.0]</div><div>[6.0]</div>
                 </div>
              </div>

              <div className="flex-1 relative h-8 flex items-center">
                 <div className={`w-full h-1 transition-colors duration-500 ${step >= 1 ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'bg-slate-600'}`}></div>
              </div>

              <div className="flex flex-col items-center z-10 relative">
                 <span className={`text-xs font-bold transition-colors duration-500 mb-2 ${step >= 1 ? 'text-blue-400' : 'text-slate-500'}`}>Encoder Weights (φ)</span>
                 <div className={`w-24 h-24 bg-blue-900/50 border-2 transition-all duration-500 rounded-xl flex items-center justify-center ${step >= 1 ? 'border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.4)]' : 'border-slate-600'}`}>
                    <Network className={`w-10 h-10 transition-colors duration-500 ${step >= 1 ? 'text-blue-400' : 'text-slate-500'}`} />
                 </div>
                 <AnimatePresence>
                   {step >= 4 && (
                     <motion.div key="enc-backprop-err" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-12 bg-slate-800 border border-slate-600 px-2 py-1 rounded text-[10px] font-mono text-slate-500 shadow flex flex-col items-center w-max">
                        <span className="text-rose-500 font-bold mb-1">Cannot update φ!</span>
                        <span>∇φ J = NaN</span>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              <div className="flex-1 relative h-8 flex items-center">
                 <div className={`w-full h-1 transition-colors duration-500 ${step >= 1 ? 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]' : 'bg-slate-600'}`}></div>
                 <AnimatePresence>
                   {step >= 4 && (
                     <motion.div key="broken-line" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1 }} className="absolute right-0 h-1 bg-rose-500 top-4 shadow-[0_0_8px_rgba(244,63,94,1)] origin-right z-20"></motion.div>
                   )}
                 </AnimatePresence>
              </div>

              <div className="flex flex-col items-center z-10 relative">
                 <span className={`text-xs font-bold transition-colors duration-500 mb-2 ${step >= 2 ? 'text-purple-400' : 'text-slate-500'}`}>Latent Space (z)</span>
                 <div className={`w-32 bg-purple-900/30 border-2 border-dashed rounded-xl p-3 flex flex-col gap-2 shadow-inner transition-colors duration-500 ${step >= 4 ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : step >= 1 ? 'border-purple-500' : 'border-slate-600'}`}>
                    <div className={`flex justify-between items-center text-[9px] font-mono bg-slate-800 p-1 rounded border transition-colors ${step >= 1 ? 'border-purple-500/50 text-purple-200' : 'border-slate-600 text-slate-500'}`}>
                      <span>μ: [0.5, -0.2]</span>
                    </div>
                    <div className={`flex justify-between items-center text-[9px] font-mono bg-slate-800 p-1 rounded border transition-colors ${step >= 1 ? 'border-purple-500/50 text-purple-200' : 'border-slate-600 text-slate-500'}`}>
                      <span>σ: [0.1, 0.8]</span>
                    </div>
                    
                    <div className={`flex items-center justify-center gap-2 mt-1 pt-2 border-t transition-colors ${step >= 4 ? 'border-rose-500/50' : step >= 1 ? 'border-purple-500/50' : 'border-slate-700'}`}>
                       <Shuffle className={`w-4 h-4 transition-colors ${step >= 4 ? 'text-rose-500' : step >= 2 ? 'text-purple-400' : 'text-slate-600'}`} />
                       <span className={`text-[10px] font-bold transition-colors ${step >= 2 ? 'text-white' : 'text-slate-500'}`}>Sample z</span>
                    </div>
                    
                    <div className={`flex justify-center text-[9px] font-mono font-bold p-1 rounded shadow transition-all duration-500 ${step >= 2 ? 'bg-purple-600 text-white opacity-100' : 'opacity-0'}`}>
                      z: [0.45, -0.3]
                    </div>
                 </div>
                 <AnimatePresence>
                   {step >= 4 && (
                     <motion.div key="wall-x" initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-16 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,1)] rounded flex items-center justify-center z-30">
                        <XCircle className="absolute -left-3 text-rose-500 bg-slate-900 rounded-full w-6 h-6"/>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              <div className="flex-1 relative h-8 flex items-center">
                 <div className={`w-full h-1 transition-colors duration-500 ${step >= 3 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`}></div>
                 <AnimatePresence>
                   {step >= 4 && (
                     <motion.div key="backprop-flow" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.5 }} className="absolute right-0 h-1 bg-rose-500 top-4 shadow-[0_0_8px_rgba(244,63,94,1)] origin-right"></motion.div>
                   )}
                 </AnimatePresence>
              </div>

              <div className="flex flex-col items-center z-10 relative">
                 <span className={`text-xs font-bold transition-colors duration-500 mb-2 ${step >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>Decoder Weights (θ)</span>
                 <div className={`w-24 h-24 bg-emerald-900/50 border-2 transition-all duration-500 rounded-xl flex items-center justify-center ${step >= 3 ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-slate-600'}`}>
                    <BrainCircuit className={`w-10 h-10 transition-colors duration-500 ${step >= 3 ? 'text-emerald-400' : 'text-slate-500'}`} />
                 </div>
                 <AnimatePresence>
                   {step >= 4 && (
                     <motion.div key="dec-backprop-ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="absolute -bottom-12 bg-slate-800 border border-slate-600 px-2 py-1 rounded text-[10px] font-mono text-slate-300 shadow flex flex-col items-center w-max">
                        <span className="text-emerald-400 font-bold mb-1">∇θ J OK!</span>
                        <span>θ updated</span>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              <div className="flex-1 relative h-8 flex items-center">
                 <div className={`w-full h-1 transition-colors duration-500 ${step >= 3 ? 'bg-slate-400' : 'bg-slate-600'}`}></div>
              </div>

              <div className="flex flex-col items-center z-10 w-24">
                 <span className={`text-xs font-bold transition-colors duration-500 mb-2 ${step >= 3 ? 'text-slate-300' : 'text-slate-500'}`}>Reconstructed</span>
                 <div className={`bg-slate-700 border rounded p-2 text-[10px] font-mono shadow-inner space-y-1 w-full text-center transition-colors duration-500 ${step >= 3 ? 'border-slate-400 text-white' : 'border-slate-600 text-transparent'}`}>
                   <div>[1.1]</div><div>[1.9]</div><div>[3.2]</div><div>[3.9]</div><div>[5.1]</div><div>[5.8]</div>
                 </div>
              </div>

           </div>

           <div className="mt-auto pt-6 flex justify-between items-center border-t border-slate-700">
              <div className={`flex flex-col items-center px-6 py-2 rounded-xl border-2 transition-colors duration-500 ${step >= 4 ? 'bg-rose-900/30 border-rose-500' : step >= 3 ? 'bg-amber-900/30 border-amber-500' : 'bg-slate-800 border-slate-600'}`}>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Error (Loss J)</span>
                 <span className={`font-mono text-xl font-bold transition-colors duration-500 ${step >= 4 ? 'text-rose-400' : step >= 3 ? 'text-amber-400' : 'text-slate-600'}`}>
                   {step >= 3 ? 'MSE(x, x\') + KL' : 'Waiting...'}
                 </span>
                 <AnimatePresence>
                   {step >= 4 && (
                     <motion.div key="loss-line" initial={{ width: 0 }} animate={{ width: '100%' }} className="absolute -top-1 right-[20%] h-1 bg-rose-500 w-64 origin-right z-20"></motion.div>
                   )}
                 </AnimatePresence>
              </div>
           </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
           
           <div className="bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-700 flex flex-col items-center">
              <h4 className="font-bold text-slate-200 mb-4 text-sm uppercase tracking-widest">Gradient Descent Objective</h4>
              <div className="w-full max-w-[200px] h-32 relative">
                 <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                    <path d="M 10 10 Q 50 80 90 10" fill="none" stroke="url(#grad)" strokeWidth="4" />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                    
                    <AnimatePresence>
                      {step >= 3 && (
                        <motion.circle key="ball" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} cx="25" cy="30" r="4" fill="#ef4444" />
                      )}
                      {step >= 4 && (
                        <motion.g key="arrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <line x1="25" y1="30" x2="35" y2="45" stroke="#ef4444" strokeWidth="2" strokeDasharray="2 2" />
                          <polygon points="32,45 38,45 35,50" fill="#ef4444" />
                        </motion.g>
                      )}
                    </AnimatePresence>
                 </svg>
                 <AnimatePresence>
                   {step >= 4 && <motion.span key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute bottom-0 right-4 text-[10px] text-slate-300 bg-slate-900 px-2 rounded">We need the slope (∇) to go down!</motion.span>}
                 </AnimatePresence>
              </div>
           </div>

           <div className="bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-700 flex-grow flex flex-col">
              <h4 className="font-bold text-rose-400 mb-4 text-sm flex items-center gap-2"><Calculator className="w-5 h-5"/> The Chain Rule Breaks</h4>
              <p className="text-xs text-slate-400 mb-4">To update the Encoder weights (<span className="font-mono text-blue-400">φ</span>), calculus requires us to multiply the derivatives backwards along the path:</p>
              
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-600 shadow-inner overflow-x-auto flex items-center justify-center font-mono text-sm whitespace-nowrap mb-6">
                <span className="text-white">∂J / ∂φ = </span>
                <span className={`mx-2 transition-colors duration-500 ${step >= 4 ? 'text-emerald-400' : 'text-slate-600'}`}>(∂J / ∂θ)</span>
                <span className="text-white">×</span>
                <span className={`mx-2 transition-colors duration-500 ${step >= 4 ? 'text-purple-400' : 'text-slate-600'}`}>(∂θ / ∂z)</span>
                <span className="text-white">×</span>
                <span className={`mx-2 transition-colors duration-500 font-bold ${step >= 4 ? 'text-rose-500 border-b-2 border-rose-500' : 'text-slate-600'}`}>(∂z / ∂φ)</span>
              </div>

              <div className="space-y-3 mt-auto">
                 <div className={`flex items-start gap-2 p-2 rounded text-xs transition-colors duration-500 ${step >= 4 ? 'bg-slate-700/50' : 'opacity-30'}`}>
                   <CheckCircle className={`w-4 h-4 shrink-0 ${step >= 4 ? 'text-emerald-400' : 'text-slate-500'}`}/>
                   <span className="text-slate-300"><strong>Decoder is fine:</strong> It's just matrix multiplication. The derivatives exist.</span>
                 </div>
                 <div className={`flex items-start gap-2 border p-2 rounded text-xs transition-colors duration-500 ${step >= 4 ? 'bg-rose-900/30 border-rose-500/50' : 'border-transparent opacity-30'}`}>
                   <XCircle className={`w-4 h-4 shrink-0 mt-0.5 ${step >= 4 ? 'text-rose-500' : 'text-slate-500'}`}/>
                   <span className="text-slate-300"><strong>Sampling fails:</strong> The term <span className="font-mono text-rose-400">∂z / ∂φ</span> asks: "How does changing the weights change the result of a random dice roll?" This is mathematically undefined.</span>
                 </div>
              </div>
           </div>

        </div>
      </div>

      <div className="flex justify-between items-center w-full max-w-7xl mx-auto border-t border-slate-700 pt-4 shrink-0 mt-2">
         <button 
           onClick={() => setStep(Math.max(0, step - 1))}
           disabled={step === 0}
           className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-colors"
         >
           <ChevronLeft className="w-5 h-5"/> Previous Step
         </button>
         
         <div className="flex flex-col items-center">
           <span className="text-slate-300 font-bold text-sm tracking-wide">{pipelineSteps[step].title}</span>
           <span className="text-slate-500 text-[10px] mt-1 hidden md:block">{pipelineSteps[step].desc}</span>
         </div>

         <button 
           onClick={() => setStep(Math.min(4, step + 1))}
           disabled={step === 4}
           className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-colors"
         >
           Next Step <ChevronRight className="w-5 h-5"/>
         </button>
      </div>
    </div>
  );
};

// --- SLIDE 3: The Core Idea (Separating Randomness) ---
const TheCoreIdeaSlide = () => {
  const [mu, setMu] = useState(1.5);
  const [sigma, setSigma] = useState(0.8);
  const [epsilon, setEpsilon] = useState(null);
  const [z, setZ] = useState(null);
  const [animating, setAnimating] = useState(false);

  const handleSample = () => {
    setAnimating(true);
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = Math.max(-3, Math.min(3, num));
    
    setEpsilon(num);
    
    setTimeout(() => {
      setZ(mu + sigma * num);
      setAnimating(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center shrink-0">The Solution: Separating Randomness</h2>
      <p className="text-slate-600 mb-8 text-center max-w-4xl mx-auto shrink-0 text-sm md:text-base">
        Instead of treating sampling as an internal "black box" process, we isolate the randomness into an <strong>independent external input</strong>.
      </p>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-6xl mx-auto flex-grow pb-8">
        
        <div className="flex-[1.2] bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col relative w-full overflow-hidden">
           
           <h3 className="font-bold text-indigo-800 mb-6 text-sm uppercase tracking-widest text-center border-b pb-2">The Deterministic Function</h3>
           
           <div className="bg-slate-900 px-6 py-4 rounded-xl flex justify-center mb-8 shadow-inner border border-slate-700">
             <span className="font-mono text-2xl font-bold text-white">
               z = <span className="text-blue-400">μ_φ(x)</span> + <span className="text-emerald-400">σ_φ(x)</span> ⊙ <span className="text-amber-400">ε</span>
             </span>
           </div>

           <div className="flex-grow flex flex-col items-center justify-center gap-6 w-full relative">
              <div className="flex items-center gap-12 w-full justify-center">
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-amber-600 uppercase mb-2 bg-amber-50 px-2 py-1 rounded">Independent Noise</span>
                    <button onClick={handleSample} disabled={animating} className="w-20 h-20 bg-amber-100 border-4 border-amber-400 rounded-lg flex flex-col items-center justify-center shadow-md hover:bg-amber-200 transition-colors disabled:opacity-50 group">
                      <Shuffle className="text-amber-600 w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                      <span className="font-mono font-bold text-amber-700 mt-1">ε ~ N(0,1)</span>
                    </button>
                    <div className="h-6 flex items-center justify-center mt-2">
                       {epsilon !== null && <span className="font-mono font-bold text-amber-600 border border-amber-300 px-2 rounded bg-amber-50 shadow-sm">{epsilon > 0 ? '+' : ''}{epsilon.toFixed(2)}</span>}
                    </div>
                 </div>

                 <div className="relative">
                    <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-6 border-b-4 border-dashed border-amber-400 z-0"></div>
                    <div className="w-32 bg-slate-100 border-2 border-slate-300 rounded-xl flex flex-col items-center shadow-sm relative z-10 overflow-hidden">
                       <div className="bg-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest py-1 w-full text-center border-b border-slate-300">Deterministic</div>
                       <div className="p-4 flex flex-col gap-2 w-full">
                         <div className="flex justify-between items-center text-xs font-bold text-emerald-700"><span>× σ</span> <span className="font-mono">{sigma.toFixed(1)}</span></div>
                         <div className="flex justify-between items-center text-xs font-bold text-blue-700"><span>+ μ</span> <span className="font-mono">{mu.toFixed(1)}</span></div>
                       </div>
                    </div>
                    <AnimatePresence>
                      {animating && epsilon !== null && (
                        <motion.div initial={{ x: -30, y: 10, opacity: 0 }} animate={{ x: 30, opacity: [0, 1, 0] }} transition={{ duration: 1 }} className="absolute text-amber-500 z-20">
                          <Zap className="w-6 h-6 fill-current"/>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-6 border-b-4 border-slate-400 z-0">
                       <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-slate-400"></div>
                    </div>
                 </div>

                 <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-purple-600 uppercase mb-2 bg-purple-50 px-2 py-1 rounded">Latent Variable</span>
                    <div className="w-20 h-20 bg-purple-100 border-4 border-purple-400 rounded-full flex flex-col items-center justify-center shadow-md">
                      <span className="font-mono font-bold text-purple-700 text-xl">z</span>
                    </div>
                    <div className="h-6 flex items-center justify-center mt-2">
                       {z !== null && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="font-mono font-bold text-purple-600 text-lg">{z.toFixed(2)}</motion.span>}
                    </div>
                 </div>
              </div>

           </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
           
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Settings2 className="w-5 h-5 text-indigo-500"/> Encoder Outputs (Parameters)</h4>
             <div className="flex flex-col gap-4">
               <div>
                 <div className="flex justify-between text-xs font-bold text-blue-700 mb-1">
                   <span>Mean (μ)</span> <span>{mu.toFixed(1)}</span>
                 </div>
                 <input type="range" min="-3" max="3" step="0.1" value={mu} onChange={(e) => setMu(parseFloat(e.target.value))} className="w-full accent-blue-500" />
               </div>
               <div>
                 <div className="flex justify-between text-xs font-bold text-emerald-700 mb-1">
                   <span>Standard Deviation (σ)</span> <span>{sigma.toFixed(1)}</span>
                 </div>
                 <input type="range" min="0.1" max="2" step="0.1" value={sigma} onChange={(e) => setSigma(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
               </div>
             </div>
           </div>

           <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl shadow-sm flex-grow">
             <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5"/> Why this solves the problem</h4>
             <p className="text-sm text-slate-700 leading-relaxed mb-3">
               The random variable <span className="font-mono font-bold text-amber-600">ε</span> is now just an external input, like data. It does not depend on the Encoder parameters (<span className="font-mono font-bold text-blue-600">μ</span>, <span className="font-mono font-bold text-emerald-600">σ</span>).
             </p>
             <p className="text-sm text-slate-700 leading-relaxed">
               Because the transformation <span className="font-mono font-bold bg-white px-1 border rounded">z = g(μ, σ, ε)</span> is just simple multiplication and addition, it is <strong>100% deterministic and differentiable</strong>. Gradients can flow backwards through <span className="font-mono font-bold">z</span> directly into <span className="font-mono font-bold">μ</span> and <span className="font-mono font-bold">σ</span>!
             </p>
           </div>

        </div>

      </div>
    </div>
  );
};

// --- SLIDE 4: Visualizing the Gradient Flow ---
const GradientFlowSlide = () => {
  const [runSimulation, setRunSimulation] = useState(false);

  const handleRun = () => {
    setRunSimulation(true);
    setTimeout(() => setRunSimulation(false), 4000);
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Visualizing the Gradient Flow</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Let's compare the computational graphs side-by-side to see exactly how the Reparameterization Trick unblocks the backpropagation algorithm.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        <div className="flex-1 bg-[#ffeded] rounded-2xl border-2 border-rose-300 p-6 flex flex-col relative overflow-hidden text-slate-800">
           <h3 className="font-bold text-rose-800 mb-6 text-sm text-center">Without Reparameterization Trick</h3>
           
           <div className="flex flex-col items-center w-full gap-4 relative">
             <div className="w-16 h-10 bg-white border border-slate-300 rounded flex items-center justify-center font-mono font-bold text-sm shadow-sm z-10">x</div>
             <ArrowDown className="w-4 h-4 text-slate-400" />
             
             <div className="w-28 h-12 bg-blue-200 border-2 border-blue-400 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm z-10">Encoder (φ)</div>
             <ArrowDown className="w-4 h-4 text-slate-400" />
             
             <div className="w-32 h-12 bg-slate-200 border-2 border-slate-400 rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow-sm z-10">μ<sub className="text-[10px]">φ</sub>(x), σ<sub className="text-[10px]">φ</sub>(x)</div>
             <ArrowDown className="w-4 h-4 text-slate-400" />

             <div className="absolute left-[20%] top-24 bottom-32 w-1 border-l-2 border-dotted border-rose-500 z-0 flex flex-col items-center pt-8">
               <span className="text-rose-500 font-mono text-[10px] font-bold bg-[#ffeded] py-1">∇φ ?</span>
               <AnimatePresence>
                 {runSimulation && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-4 transform translate-y-full text-rose-600 text-[10px] font-bold bg-white border border-rose-300 px-2 py-1 rounded shadow-lg whitespace-nowrap">Gradient stops here</motion.div>
                 )}
               </AnimatePresence>
             </div>

             <div className="w-40 h-14 bg-rose-100 border-2 border-dashed border-rose-500 rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow-sm z-10">Sample z ~ q(z|x)</div>
             <ArrowDown className="w-4 h-4 text-slate-400" />
             
             <div className="w-28 h-12 bg-emerald-200 border-2 border-emerald-400 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm z-10">Decoder (θ)</div>
             <ArrowDown className="w-4 h-4 text-slate-400" />

             <div className="w-24 h-10 bg-white border border-slate-300 rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-sm z-10">log p(x|z)</div>
           </div>
        </div>

        <div className="flex-1 bg-[#eafff0] rounded-2xl border-2 border-emerald-300 p-6 flex flex-col relative overflow-hidden text-slate-800">
           <h3 className="font-bold text-emerald-800 mb-6 text-sm text-center">With Reparameterization Trick</h3>
           
           <div className="flex flex-col items-center w-full gap-4 relative">
             <div className="w-16 h-10 bg-white border border-slate-300 rounded flex items-center justify-center font-mono font-bold text-sm shadow-sm z-10">x</div>
             <ArrowDown className="w-4 h-4 text-slate-400" />
             
             <div className="w-28 h-12 bg-blue-200 border-2 border-blue-400 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm z-10">Encoder (φ)</div>
             <ArrowDown className="w-4 h-4 text-slate-400" />
             
             <div className="flex gap-4 w-full justify-center relative">
                <div className="w-24 h-10 bg-amber-100 border-2 border-amber-400 rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow-sm z-10 mt-2">ε ~ N(0,I)</div>
                <div className="w-32 h-12 bg-slate-200 border-2 border-slate-400 rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow-sm z-10">μ<sub className="text-[10px]">φ</sub>(x), σ<sub className="text-[10px]">φ</sub>(x)</div>
                
                <div className="absolute right-[20%] top-[-40px] bottom-[-20px] w-1 border-r-2 border-dotted border-emerald-500 z-0 flex flex-col items-center pt-8">
                  <span className="text-emerald-600 font-mono text-[10px] font-bold bg-[#eafff0] py-1 px-1">∇φ flows</span>
                  <AnimatePresence>
                    {runSimulation && (
                      <motion.div initial={{ height: 0 }} animate={{ height: '100%' }} transition={{ duration: 1.5, ease: "linear" }} className="absolute bottom-0 w-1 bg-emerald-500 origin-bottom" />
                    )}
                  </AnimatePresence>
                </div>
             </div>
             
             <div className="flex gap-16 -my-2 relative z-0">
               <div className="w-px h-8 bg-slate-400 transform rotate-12 origin-top"><span className="absolute bottom-2 -left-3 text-[10px] font-mono text-amber-600 font-bold">ε</span></div>
               <div className="w-px h-8 bg-slate-400 transform -rotate-12 origin-top"><span className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-600 font-bold">μ, σ</span></div>
             </div>

             <div className="w-56 h-14 bg-slate-200 border-2 border-slate-400 rounded-xl flex flex-col items-center justify-center shadow-sm z-10">
               <span className="font-mono font-bold text-xs">z = μ + σ ⊙ ε</span>
               <span className="text-[9px] text-slate-600">(Deterministic function g_φ)</span>
             </div>
             <ArrowDown className="w-4 h-4 text-slate-400" />
             
             <div className="w-28 h-12 bg-emerald-200 border-2 border-emerald-400 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm z-10">Decoder (θ)</div>
             <ArrowDown className="w-4 h-4 text-slate-400" />

             <div className="w-24 h-10 bg-white border border-slate-300 rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-sm z-10">log p(x|z)</div>
           </div>
        </div>

      </div>

      <div className="flex justify-center shrink-0">
        <button 
          onClick={handleRun}
          disabled={runSimulation}
          className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all flex items-center gap-2 ${runSimulation ? 'bg-slate-700 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-105'}`}
        >
          <Activity className="w-5 h-5"/> Test Backpropagation
        </button>
      </div>
    </div>
  );
};

// --- SLIDE 5: The Mathematical Magic ---
const MathematicalMagicSlide = () => {
  const [step, setStep] = useState(0);

  const mathSteps = [
    {
      title: "The Target Gradient",
      eq: <span>∇<sub className="text-xs">φ</sub> E<sub className="text-[10px] text-blue-500">q<sub className="text-[8px]">φ</sub>(z|x)</sub> [ f(z) ]</span>,
      desc: "We want to compute the derivative (∇φ) of the expected value of our loss function f(z)."
    },
    {
      title: "Apply Reparameterization",
      eq: <span>∇<sub className="text-xs">φ</sub> E<sub className="text-[10px] text-amber-600">p(ε)</sub> [ f(<span className="text-emerald-600">g<sub className="text-[10px]">φ</sub>(x, ε)</span>) ]</span>,
      desc: "Substitute z with our deterministic function g(x, ε). The expectation is now over p(ε), which is a constant standard normal distribution. It no longer depends on φ!"
    },
    {
      title: "Swap Gradient and Expectation",
      eq: <span>E<sub className="text-[10px] text-amber-600">p(ε)</sub> [ ∇<sub className="text-xs">φ</sub> f(<span className="text-emerald-600">g<sub className="text-[10px]">φ</sub>(x, ε)</span>) ]</span>,
      desc: "Because p(ε) is independent of φ, we can legally pull the derivative operator inside the expectation. This is known as the Pathwise Derivative Estimator."
    },
    {
      title: "Apply the Chain Rule",
      eq: <span>E<sub className="text-[10px] text-amber-600">p(ε)</sub> [ (∂f / ∂z) × (<span className="text-emerald-600">∂g<sub className="text-[10px]">φ</sub> / ∂φ</span>) ]</span>,
      desc: "Inside the expectation, we just use standard calculus (the Chain Rule). This is exactly what libraries like PyTorch or TensorFlow do automatically during backprop."
    }
  ];

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The Mathematical Magic</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          This is called a <strong>Pathwise Derivative Estimator</strong>. The core idea is simple: we want to move the derivative operator <em>inside</em> the expectation.
        </p>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center max-w-5xl mx-auto w-full">
         <div className="bg-white border border-slate-200 rounded-2xl w-full p-8 shadow-xl relative overflow-hidden flex flex-col">
            
            <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
              {mathSteps.map((s, idx) => (
                <div key={idx} className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full">
                  <div className="hidden md:flex flex-col items-center w-8 shrink-0 relative mt-2">
                     {idx > 0 && <ArrowDown className={`w-5 h-5 ${idx <= step ? 'text-indigo-500' : 'text-slate-200'}`} />}
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: idx <= step ? 1 : 0.2, x: 0 }}
                    className={`flex-1 p-4 rounded-xl border-2 transition-colors duration-300 w-full text-center md:text-left ${idx === step ? 'bg-indigo-50 border-indigo-400 shadow-md' : idx < step ? 'bg-slate-50 border-slate-200' : 'bg-transparent border-slate-100'}`}
                  >
                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-2 ${idx === step ? 'text-indigo-700' : 'text-slate-400'}`}>{s.title}</h4>
                    <div className={`font-mono text-lg md:text-2xl font-bold mb-2 ${idx === step ? 'text-slate-800' : 'text-slate-500'}`}>
                      {s.eq}
                    </div>
                    {idx <= step && <p className="text-sm text-slate-600 border-t border-slate-200 pt-2">{s.desc}</p>}
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-slate-800 p-4 rounded-xl flex items-center justify-between w-full max-w-3xl mx-auto border-2 border-slate-700">
               <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step===0} className="px-4 py-2 bg-slate-700 text-white rounded font-bold text-sm disabled:opacity-50 transition-colors hover:bg-slate-600">Previous</button>
               <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{step === 3 ? "Derivation Complete!" : "Click Next to advance"}</span>
               <button onClick={() => setStep(Math.min(3, step + 1))} disabled={step===3} className="px-4 py-2 bg-indigo-600 text-white rounded font-bold text-sm disabled:opacity-50 hover:bg-indigo-500 shadow transition-colors">Next Step</button>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- SLIDE 6: Log-Variance Implementation Trick ---
const LogVarianceTrickSlide = () => {
  const [logVarStr, setLogVarStr] = useState("0");
  const logVar = parseFloat(logVarStr) || 0;
  const variance = Math.exp(logVar);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Practical Implementation: The Log-Variance Trick</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          In practice, forcing a Neural Network to output a strictly positive number (Variance &gt; 0) is unstable. If an activation function drops below 0, learning stops. We use a neat trick to fix this.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto w-full flex-grow items-stretch pb-8">
        
        <div className="flex-[1.2] bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col items-center relative overflow-hidden">
           
           <h3 className="font-bold text-slate-700 mb-6 text-sm uppercase tracking-widest text-center border-b pb-2 w-full">The Exponentiation Map</h3>
           
           <div className="flex-grow flex flex-col items-center justify-center w-full gap-8">
              
              <div className="flex items-center justify-between w-full max-w-md bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
                <div className="flex flex-col items-center w-1/3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Network Output</span>
                  <span className="font-mono font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded mt-1">log(σ²)</span>
                </div>
                
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] font-mono text-slate-400 bg-white px-2 rounded border border-slate-200">exp(...)</span>
                  <ArrowRight className="w-8 h-8 text-emerald-400 my-1" />
                </div>

                <div className="flex flex-col items-center w-1/3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">True Variance</span>
                  <span className="font-mono font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded mt-1">σ²</span>
                </div>
              </div>

              <div className="w-full flex flex-col items-center bg-slate-800 p-6 rounded-2xl border-4 border-slate-700 text-white shadow-xl relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.8) 100%)`}}></div>

                 <div className="flex justify-between w-full px-4 mb-2 z-10">
                   <div className="flex flex-col items-center">
                     <span className="text-xs text-blue-300 font-bold uppercase tracking-wider">Network Guesses:</span>
                     <span className="font-mono text-3xl font-bold text-blue-400">{logVar > 0 ? '+' : ''}{logVar.toFixed(2)}</span>
                     <span className="text-[10px] text-slate-400 mt-1">Range: (-∞, ∞)</span>
                   </div>
                   
                   <div className="flex flex-col items-center">
                     <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">Math Maps it to:</span>
                     <span className="font-mono text-4xl font-bold text-emerald-400 drop-shadow-md">{variance.toFixed(4)}</span>
                     <span className="text-[10px] text-slate-400 mt-1">Range: (0, ∞)</span>
                   </div>
                 </div>

                 <div className="w-full max-w-sm mt-6 z-10">
                   <input type="range" min="-5" max="5" step="0.1" value={logVarStr} onChange={(e) => setLogVarStr(e.target.value)} className="w-full accent-blue-500" />
                   <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1 uppercase">
                     <span>Large Negative = Tiny σ²</span>
                     <span>Zero = σ² is 1</span>
                     <span>Positive = Huge σ²</span>
                   </div>
                 </div>
              </div>

           </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
           
           <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl shadow-sm">
             <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><BrainCircuit className="w-5 h-5"/> Unconstrained Networks</h4>
             <p className="text-sm text-slate-700 leading-relaxed">
               A linear layer in a neural network can output any real number between <span className="font-mono">-∞</span> and <span className="font-mono">∞</span>. However, mathematical Variance (<span className="font-mono">σ²</span>) <strong>cannot be negative</strong>.
             </p>
           </div>

           <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl shadow-sm flex-grow">
             <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2"><Zap className="w-5 h-5"/> The Exponential Fix</h4>
             <p className="text-sm text-slate-700 leading-relaxed mb-4">
               Instead of asking the network to output Variance directly and struggling to keep it positive, we ask it to output the <strong>Logarithm of the Variance</strong>.
             </p>
             <div className="font-mono text-xs bg-white px-3 py-2 rounded border border-emerald-200 text-slate-700 mb-4 inline-block shadow-sm">
               σ = exp(0.5 × log_var)
             </div>
             <p className="text-sm text-slate-700 leading-relaxed">
               Because the exponential function <span className="font-mono">exp(x)</span> is always strictly greater than zero for any input <span className="font-mono">x</span>, we guarantee numerical stability without killing gradients using activation functions like ReLU!
             </p>
           </div>

        </div>

      </div>
    </div>
  );
};

// --- SLIDE 7: Impact & Applicability ---
const ApplicabilitySlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Impact & Applicability</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          The Reparameterization Trick unlocks end-to-end training for VAEs using standard gradient ascent.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow pb-8 items-stretch">
        
        <div className="flex-[1.5] bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8 flex flex-col">
           <h3 className="font-bold text-emerald-400 mb-6 text-sm uppercase tracking-widest flex items-center gap-2 border-b border-slate-600 pb-2">
             <Target className="w-5 h-5"/> The Analytical KL Divergence
           </h3>
           <p className="text-sm text-slate-300 mb-6">
             Because we assume both the Encoder <span className="font-mono text-blue-300">q(z|x)</span> and the Prior <span className="font-mono text-purple-300">p(z)</span> are Gaussian, the KL divergence term has an exact, analytical closed-form solution. We don't even need to approximate it with sampling!
           </p>

           <div className="bg-slate-900 border border-slate-600 p-6 rounded-xl flex justify-center mb-8 shadow-inner">
             <span className="font-mono text-lg md:text-xl font-bold text-white text-center leading-relaxed">
               D<sub className="text-xs">KL</sub>(q<sub className="text-[10px]">φ</sub> || p) = <br className="md:hidden"/>
               <span className="text-slate-400 text-2xl ml-2">½ ∑</span> <span className="text-slate-300">(</span> <span className="text-blue-400">μ<sub className="text-[10px]">j</sub>²</span> <span className="text-slate-400">+</span> <span className="text-emerald-400">σ<sub className="text-[10px]">j</sub>²</span> <span className="text-slate-400">-</span> <span className="text-emerald-400">log(σ<sub className="text-[10px]">j</sub>²)</span> <span className="text-slate-400">- 1</span> <span className="text-slate-300">)</span>
             </span>
           </div>

           <div className="flex-grow bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl flex items-start gap-4">
             <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
             <div>
               <h4 className="font-bold text-emerald-300 text-sm mb-1">End-to-End Differentiable</h4>
               <p className="text-xs text-slate-300 leading-relaxed">
                 This expression is clearly composed of simple operations (squares, logs, additions). It is perfectly differentiable with respect to <span className="font-mono font-bold">μ</span> and <span className="font-mono font-bold">σ²</span>. Thus, the entire ELBO can be optimized normally!
               </p>
             </div>
           </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
           
           <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl shadow-sm flex-1">
             <h4 className="font-bold text-blue-400 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5"/> Where it Shines (Continuous)</h4>
             <ul className="text-sm text-slate-300 space-y-3">
               <li><strong className="text-white">Gaussian:</strong> z = μ + σ * ε</li>
               <li><strong className="text-white">Uniform:</strong> z = a + (b-a) * ε</li>
               <li><strong className="text-white">Exponential:</strong> z = -(1/λ) * log(ε)</li>
               <li className="pt-2 text-xs text-slate-400 border-t border-blue-500/30 mt-2">Also works for Laplace, Gamma, Beta, Cauchy, etc.</li>
             </ul>
           </div>

           <div className="bg-rose-900/20 border border-rose-500/30 p-6 rounded-2xl shadow-sm flex-1">
             <h4 className="font-bold text-rose-400 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Where it Fails (Discrete)</h4>
             <p className="text-sm text-slate-300 mb-3 leading-relaxed">
               If your latent variable <span className="font-mono font-bold">z</span> represents discrete classes (e.g., Cat=0, Dog=1), this trick <strong>does not work</strong> directly.
             </p>
             <p className="text-xs text-slate-400 leading-relaxed">
               Mapping continuous noise to discrete integers involves non-differentiable step functions (like <span className="font-mono">argmax</span> or rounding). The gradients become zero everywhere.
             </p>
             <div className="mt-3 bg-slate-800 text-xs px-3 py-2 rounded border border-slate-600 text-slate-300">
               <strong>Workarounds:</strong> Gumbel-Softmax Trick (continuous relaxation) or REINFORCE estimators.
             </div>
           </div>

        </div>

      </div>
    </div>
  );
};

// --- MAIN SLIDESHOW COMPONENT ---
const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    TheRoadblockSlide,
    GradientCalculationSlide, 
    TheCoreIdeaSlide,
    GradientFlowSlide,
    MathematicalMagicSlide,
    LogVarianceTrickSlide,
    ApplicabilitySlide
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="flex flex-col h-screen bg-slate-200 font-sans">
      <div className="w-full h-1.5 bg-slate-300">
        <motion.div
          className="h-full bg-indigo-600"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

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
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentSlide ? 'bg-indigo-600 scale-125' : 'bg-slate-300'}`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-indigo-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-indigo-700 shadow"
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