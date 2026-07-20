import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Activity, ArrowRight, 
  Target, Layers, Zap, ArrowDown, HelpCircle,
  GitCommit, Waves, Maximize2, Variable, BarChart, 
  CheckCircle, AlertTriangle, Eye, BrainCircuit, RotateCcw,
  ArrowLeft, Check, Shuffle, Dices, Scale, Swords, XCircle,
  Wind, Link, Lock, BookOpen
} from 'lucide-react';

// --- SLIDE 1: The Problem with Gaussians ---
const TheProblemSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">The Problem: Gaussian Limitations</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Standard VAEs rely heavily on the <strong>Factorized Gaussian</strong> (the simple Bell Curve) for both the Prior <span className="font-mono bg-slate-200 px-1 rounded">p(z)</span> and the Approximate Posterior <span className="font-mono bg-slate-200 px-1 rounded">q(z|x)</span>. This severely caps the model's expressiveness.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: Complex True Data */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col items-center text-center relative overflow-hidden">
           <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg">
             <Target className="w-5 h-5 text-indigo-500"/> The True Posterior p(z|x)
           </h3>
           
           <div className="flex-grow w-full flex items-center justify-center relative">
              <div className="w-48 h-48 bg-slate-900 rounded-2xl border-4 border-slate-800 relative overflow-hidden shadow-inner">
                 {/* Fake complex multi-modal distribution */}
                 <div className="absolute w-16 h-24 bg-rose-500/60 blur-xl rounded-full top-[10%] left-[20%] mix-blend-screen"></div>
                 <div className="absolute w-20 h-16 bg-blue-500/60 blur-xl rounded-full bottom-[15%] right-[10%] mix-blend-screen"></div>
                 <div className="absolute w-12 h-12 bg-emerald-500/50 blur-lg rounded-full top-[40%] right-[30%] mix-blend-screen"></div>
                 
                 {/* Curving dependency */}
                 <svg className="absolute inset-0 w-full h-full opacity-30">
                   <path d="M 20 80 Q 50 100 80 40" fill="none" stroke="#fff" strokeWidth="10" filter="blur(8px)" />
                 </svg>
              </div>
           </div>

           <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200 w-full">
             <p className="text-xs text-slate-600 font-bold uppercase tracking-widest mb-1">Reality:</p>
             <p className="text-sm text-slate-700">True data distributions are often <strong>multi-modal</strong> (multiple peaks) and feature highly complex, curving dependencies between variables.</p>
           </div>
        </div>

        {/* Right: The Gaussian Approximation */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border-t-8 border-rose-500 p-8 flex flex-col items-center text-center relative overflow-hidden">
           <div className="absolute top-4 right-4 bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
             The Restriction
           </div>
           <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg">
             <Activity className="w-5 h-5 text-rose-500"/> The Gaussian Approximation
           </h3>
           
           <div className="flex-grow w-full flex items-center justify-center relative">
              <div className="w-48 h-48 bg-slate-900 rounded-2xl border-4 border-slate-800 relative overflow-hidden shadow-inner flex items-center justify-center">
                 {/* The restrictive Gaussian blob */}
                 <div className="w-32 h-32 bg-white/20 border-2 border-dashed border-rose-400 rounded-full flex items-center justify-center relative">
                    <div className="w-16 h-16 bg-white/30 rounded-full blur-sm"></div>
                 </div>
              </div>
           </div>

           <div className="mt-6 bg-rose-50 p-4 rounded-xl border border-rose-200 w-full">
             <p className="text-xs text-rose-800 font-bold uppercase tracking-widest mb-1">The VAE Compromise:</p>
             <p className="text-sm text-rose-900">A standard Gaussian can only form a single, symmetrical blob. It <strong>cannot</strong> wrap around curves or split into multiple peaks. It severely restricts what the VAE can learn.</p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 2: The Core Concept of Normalizing Flows ---
const CoreConceptSlide = () => {
  const [flowStep, setFlowStep] = useState(0);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">The Essence of Normalizing Flows</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          A Normalizing Flow transforms a simple base distribution (like our basic Gaussian blob) into a highly complex target distribution by applying a sequence of <strong>invertible</strong> and <strong>differentiable</strong> transformations.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-6xl mx-auto pb-8 relative">
         
         {/* The Visual Pipeline */}
         <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-2xl shadow-2xl w-full flex items-center justify-between relative h-[300px]">
            
            {/* Step 0: Base Distribution */}
            <div className="flex flex-col items-center z-10 w-32 relative">
               <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Base Dist. p₀(z₀)</span>
               <div className="w-24 h-24 bg-slate-900 border-2 border-slate-600 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <motion.div 
                    animate={{ scale: flowStep === 0 ? 1 : 0.8, opacity: flowStep === 0 ? 1 : 0.3 }}
                    className="w-16 h-16 bg-blue-500 rounded-full blur-md"
                  />
               </div>
               <span className="font-mono text-xs text-slate-400 mt-2">z₀</span>
            </div>

            {/* F1 */}
            <div className="flex-1 flex flex-col items-center z-10">
               <span className="font-mono text-xs text-emerald-400 font-bold mb-1">f₁</span>
               <div className="w-full h-1 bg-slate-600 relative overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: flowStep >= 1 ? '100%' : 0 }} className="absolute h-full bg-emerald-500" />
               </div>
            </div>

            {/* Step 1: Z1 */}
            <div className="flex flex-col items-center z-10 w-32 relative">
               <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Intermediate z₁</span>
               <div className="w-24 h-24 bg-slate-900 border-2 border-slate-600 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: flowStep === 1 ? 1 : flowStep > 1 ? 0.8 : 0, 
                      opacity: flowStep === 1 ? 1 : flowStep > 1 ? 0.3 : 0,
                      borderRadius: "50% 10% 50% 10%",
                      rotate: 45
                    }}
                    className="w-20 h-12 bg-emerald-500 blur-md"
                  />
               </div>
               <span className="font-mono text-xs text-slate-400 mt-2">z₁ = f₁(z₀)</span>
            </div>

            {/* F2 to FK-1 (Ellipsis) */}
            <div className="flex-1 flex flex-col items-center z-10 mx-2">
               <div className="w-full h-1 bg-slate-600 relative overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: flowStep >= 2 ? '100%' : 0 }} transition={{ duration: 1 }} className="absolute h-full bg-purple-500" />
               </div>
               <span className="font-bold text-slate-500 mt-2">... f_K ...</span>
            </div>

            {/* Step K: Target Distribution */}
            <div className="flex flex-col items-center z-10 w-32 relative">
               <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">Target p_K(z_K)</span>
               <div className="w-24 h-24 bg-slate-900 border-2 border-slate-600 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: flowStep === 3 ? 1 : 0, 
                      opacity: flowStep === 3 ? 1 : 0,
                    }}
                    className="w-full h-full relative"
                  >
                     <div className="absolute w-12 h-16 bg-rose-500 blur-md rounded-full top-[10%] left-[20%]"></div>
                     <div className="absolute w-12 h-12 bg-rose-500 blur-md rounded-full bottom-[15%] right-[10%]"></div>
                  </motion.div>
               </div>
               <span className="font-mono text-xs text-rose-300 font-bold mt-2">z_K = f_K(z_K-1)</span>
            </div>

         </div>

         {/* Controls and Explanation */}
         <div className="mt-8 flex flex-col items-center w-full max-w-2xl">
            <div className="flex gap-4 mb-6 items-center">
              <button 
                onClick={() => setFlowStep(Math.max(0, flowStep - 1))}
                disabled={flowStep === 0}
                className="px-6 py-2 bg-slate-700 text-white font-bold rounded-full shadow hover:bg-slate-600 disabled:opacity-30 transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4"/> Previous
              </button>
              
              <div className="flex items-center gap-2 px-4">
                 {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === flowStep ? 'bg-indigo-500 scale-150' : 'bg-slate-600'}`} />
                 ))}
              </div>

              <button 
                onClick={() => setFlowStep(flowStep === 3 ? 0 : Math.min(3, flowStep + 1))}
                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:bg-indigo-500 transition-all flex items-center gap-2"
              >
                {flowStep === 3 ? <><RotateCcw className="w-4 h-4"/> Reset</> : <>Next <ChevronRight className="w-4 h-4"/></>}
              </button>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full text-center h-28 flex items-center justify-center shadow-inner">
               <AnimatePresence mode="wait">
                 {flowStep === 0 && <motion.div key="0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-blue-300">We start with a simple, tractable Gaussian distribution <span className="font-mono bg-slate-900 px-1 rounded">p₀(z₀)</span>.</motion.div>}
                 {flowStep === 1 && <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-emerald-300">The first function <span className="font-mono">f₁</span> stretches and squishes the space, warping the distribution.</motion.div>}
                 {flowStep === 2 && <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-purple-300">We chain multiple neural network functions <span className="font-mono">f</span> together. Each one warps the space further.</motion.div>}
                 {flowStep === 3 && <motion.div key="3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-rose-300 font-bold">The final result is a highly complex, multi-modal target distribution that perfectly models our data!</motion.div>}
               </AnimatePresence>
            </div>
         </div>

      </div>
    </div>
  );
};

// --- SLIDE 3: The 3 Golden Rules of Flow Layers ---
const GoldenRulesSlide = () => {
  const [activeRule, setActiveRule] = useState('invertible');
  const [invDirection, setInvDirection] = useState('forward');

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">The 3 Golden Rules of Flow Layers</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          We can't just use standard Neural Network layers. For the math to work, every transformation <span className="font-mono text-xs bg-slate-800 border border-slate-700 px-1 rounded">f_k</span> MUST satisfy three strict computational constraints.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left Nav */}
        <div className="lg:w-1/3 flex flex-col gap-3">
          <button onClick={() => setActiveRule('invertible')} className={`p-4 rounded-xl border-2 text-left transition-all ${activeRule === 'invertible' ? 'bg-blue-900/40 border-blue-500 shadow-md' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}>
            <h3 className="font-bold text-blue-400 mb-1 flex items-center gap-2"><RotateCcw className="w-4 h-4"/> 1. Invertible</h3>
            <p className="text-xs text-slate-400">Must map exactly 1-to-1 forwards and backwards.</p>
          </button>

          <button onClick={() => setActiveRule('differentiable')} className={`p-4 rounded-xl border-2 text-left transition-all ${activeRule === 'differentiable' ? 'bg-emerald-900/40 border-emerald-500 shadow-md' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}>
            <h3 className="font-bold text-emerald-400 mb-1 flex items-center gap-2"><Activity className="w-4 h-4"/> 2. Differentiable</h3>
            <p className="text-xs text-slate-400">Must be smooth to compute the rate of change.</p>
          </button>

          <button onClick={() => setActiveRule('jacobian')} className={`p-4 rounded-xl border-2 text-left transition-all ${activeRule === 'jacobian' ? 'bg-rose-900/40 border-rose-500 shadow-md' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}>
            <h3 className="font-bold text-rose-400 mb-1 flex items-center gap-2"><Zap className="w-4 h-4"/> 3. Efficient Jacobian</h3>
            <p className="text-xs text-slate-400">The determinant computation must be fast (O(D)).</p>
          </button>
        </div>

        {/* Right Visualizer */}
        <div className="lg:w-2/3 bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-8 flex flex-col relative overflow-hidden">
           <AnimatePresence mode="wait">
              
              {/* 1. Invertible Visual */}
              {activeRule === 'invertible' && (
                <motion.div key="inv" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                   <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-slate-600 pb-2">Rule 1: Strict Invertibility (Bijective)</h3>
                   <p className="text-sm text-slate-300 mb-8">
                     You must be able to recover <span className="font-mono text-xs">z_(k-1)</span> from <span className="font-mono text-xs">z_k</span> via <span className="font-mono text-xs">f_k⁻¹</span>. You cannot use functions that lose information (like a standard ReLU).
                   </p>
                   
                   <div className="flex-grow flex flex-col items-center justify-center gap-8 w-full">
                      <div className="flex items-center justify-center w-full gap-4">
                        <div className={`flex flex-col items-center transition-all ${invDirection === 'forward' ? 'scale-110 opacity-100' : 'scale-90 opacity-50'}`}>
                          <div className="w-20 h-20 bg-slate-100 rounded-full border-4 border-blue-500 flex items-center justify-center shadow-lg">
                            <span className="font-mono font-bold text-blue-800 text-lg">z_0</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center w-40 relative">
                           {invDirection === 'forward' ? (
                             <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-2 bg-blue-500 relative flex items-center shadow-[0_0_10px_#3b82f6]">
                               <ArrowRight className="absolute -right-3 text-blue-500 w-8 h-8" />
                             </motion.div>
                           ) : (
                             <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-2 bg-purple-500 relative flex items-center justify-end shadow-[0_0_10px_#a855f7]">
                               <ArrowLeft className="absolute -left-3 text-purple-500 w-8 h-8" />
                             </motion.div>
                           )}
                           <span className="font-mono text-sm font-bold mt-2 text-white bg-slate-900 px-3 py-1 rounded border border-slate-600">
                             {invDirection === 'forward' ? 'z_1 = f(z_0)' : 'z_0 = f⁻¹(z_1)'}
                           </span>
                        </div>

                        <div className={`flex flex-col items-center transition-all ${invDirection === 'backward' ? 'scale-110 opacity-100' : 'scale-90 opacity-50'}`}>
                          <div className="w-20 h-20 bg-slate-100 rounded-lg border-4 border-purple-500 flex items-center justify-center shadow-lg transform rotate-12">
                            <span className="font-mono font-bold text-purple-800 text-lg">z_1</span>
                          </div>
                        </div>
                      </div>

                      <button onClick={() => setInvDirection(invDirection === 'forward' ? 'backward' : 'forward')} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-full shadow border border-slate-500 flex items-center gap-2 transition-colors">
                        <Shuffle className="w-4 h-4"/> Toggle Direction
                      </button>
                   </div>
                </motion.div>
              )}

              {/* 2. Differentiable Visual */}
              {activeRule === 'differentiable' && (
                <motion.div key="diff" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                   <h3 className="text-xl font-bold text-emerald-400 mb-4 border-b border-slate-600 pb-2">Rule 2: Differentiable</h3>
                   <p className="text-sm text-slate-300 mb-8">
                     The function must be differentiable so that the Jacobian matrix exists. We need to compute gradients everywhere to know how space is warping.
                   </p>
                   
                   <div className="flex-grow flex items-center justify-center gap-8 w-full">
                      {/* Non-differentiable */}
                      <div className="flex flex-col items-center w-48">
                         <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-2">Forbidden (Step)</span>
                         <div className="w-full h-32 bg-slate-900 border-2 border-slate-600 rounded-lg relative flex items-center p-2">
                            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                              <path d="M 0 40 L 40 40 L 40 10 L 100 10" fill="none" stroke="#f43f5e" strokeWidth="3" />
                            </svg>
                            <AlertTriangle className="absolute top-2 left-2 text-rose-500 w-5 h-5" />
                         </div>
                         <span className="text-[9px] text-slate-400 mt-2 text-center">Derivative is undefined at the jump.</span>
                      </div>

                      {/* Differentiable */}
                      <div className="flex flex-col items-center w-48">
                         <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Allowed (Smooth)</span>
                         <div className="w-full h-32 bg-slate-900 border-2 border-slate-600 rounded-lg relative flex items-center p-2">
                            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                              <path d="M 0 40 Q 50 40 50 25 T 100 10" fill="none" stroke="#10b981" strokeWidth="3" />
                            </svg>
                            <Check className="absolute top-2 left-2 text-emerald-500 w-5 h-5" />
                         </div>
                         <span className="text-[9px] text-slate-400 mt-2 text-center">Derivative exists smoothly everywhere.</span>
                      </div>
                   </div>
                </motion.div>
              )}

              {/* 3. Efficient Jacobian Visual */}
              {activeRule === 'jacobian' && (
                <motion.div key="jac" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                   <h3 className="text-xl font-bold text-rose-400 mb-4 border-b border-slate-600 pb-2">Rule 3: Efficient Jacobian Determinant</h3>
                   <p className="text-sm text-slate-300 mb-6">
                     Crucially, <span className="font-mono text-rose-300">det J_f</span> must be efficient to compute. For a 1000-dimensional vector, standard determinants take O(D³) operations. This constraint heavily influences flow layer design.
                   </p>

                   <div className="flex-grow flex items-center justify-center gap-6 w-full">
                      {/* Standard Matrix */}
                      <div className="flex flex-col items-center bg-slate-900 p-4 rounded-xl border border-slate-700">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Standard Matrix</span>
                        <div className="grid grid-cols-4 grid-rows-4 gap-1 opacity-70">
                          {Array.from({length: 16}).map((_, i) => <div key={i} className="w-6 h-6 bg-slate-600 rounded-sm"></div>)}
                        </div>
                        <span className="text-xs font-bold text-rose-500 mt-3 font-mono bg-rose-950/50 px-2 py-1 rounded">Cost: O(D³) ❌</span>
                      </div>

                      <ArrowRight className="w-6 h-6 text-slate-500" />

                      {/* Lower Triangular Matrix */}
                      <div className="flex flex-col items-center bg-slate-900 p-4 rounded-xl border-2 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Lower Triangular</span>
                        <div className="grid grid-cols-4 grid-rows-4 gap-1">
                          {Array.from({length: 16}).map((_, i) => {
                            const row = Math.floor(i / 4);
                            const col = i % 4;
                            const isDiagonal = row === col;
                            const isZero = col > row;
                            return (
                              <div key={i} className={`w-6 h-6 rounded-sm flex items-center justify-center text-[8px] font-mono font-bold ${isZero ? 'bg-slate-800 text-slate-600' : isDiagonal ? 'bg-emerald-500 text-emerald-900 ring-2 ring-emerald-300' : 'bg-slate-600 text-transparent'}`}>
                                {isZero ? '0' : ''}
                              </div>
                            )
                          })}
                        </div>
                        <span className="text-xs font-bold text-emerald-400 mt-3 font-mono bg-emerald-950/50 px-2 py-1 rounded border border-emerald-500/30">Cost: O(D) ✅</span>
                      </div>
                   </div>

                   <p className="text-[10px] text-slate-400 mt-4 text-center">
                     <strong>The Solution:</strong> Designing flows where the Jacobian is triangular means the determinant is just multiplying the diagonal elements!
                   </p>
                </motion.div>
              )}

           </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 4: The Change of Variables Formula (Visual Intuition) ---
const ChangeOfVariablesSlide = () => {
  const [stretch, setStretch] = useState(1);

  // Math logic for the visualizer
  const baseArea = 100; // Base "probability mass"
  const newWidth = 50 * stretch;
  const newHeight = baseArea / stretch; // Area must remain constant! Probability must sum to 1.

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">The "Change of Variables" Formula</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          If we warp the space (the x-axis), what happens to the probability density (the y-axis)? The total probability must always equal 1. <strong>If we stretch the space, the density must drop to compensate.</strong>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Visualizer */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col relative overflow-hidden items-center justify-center">
           
           <div className="flex items-end justify-center w-full h-64 border-b-2 border-slate-400 relative mb-8">
              
              {/* Base Distribution (Ghost) */}
              <div className="absolute bottom-0 border-2 border-dashed border-blue-300 bg-blue-50/50 flex flex-col items-center justify-end" style={{ width: '50px', height: '100px' }}>
                <span className="absolute -top-6 text-[10px] font-bold text-blue-400 whitespace-nowrap">Base P(z)</span>
              </div>

              {/* Transformed Distribution */}
              <motion.div 
                className="absolute bottom-0 bg-rose-500/80 border-2 border-rose-600 flex flex-col items-center justify-end shadow-lg origin-bottom"
                style={{ width: newWidth, height: newHeight }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                 <span className="text-[10px] font-bold text-white mb-1 shadow-sm px-1 bg-rose-900/50 rounded">Transformed P(z')</span>
              </motion.div>

              <span className="absolute -bottom-6 text-xs font-bold text-slate-500">Space (z)</span>
           </div>

           <div className="w-full max-w-md bg-slate-100 p-4 rounded-xl border border-slate-200">
             <div className="flex justify-between text-xs font-bold text-slate-600 mb-2 uppercase tracking-widest">
               <span>Compress Space</span>
               <span>Stretch Space</span>
             </div>
             <input type="range" min="0.5" max="3" step="0.1" value={stretch} onChange={(e) => setStretch(parseFloat(e.target.value))} className="w-full accent-rose-500" />
           </div>

           <div className="mt-8 flex gap-4 text-sm font-mono bg-slate-800 text-white px-6 py-3 rounded-lg shadow-inner w-full max-w-md justify-between">
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-[10px] uppercase">Stretch Factor (Derivative)</span>
                <span className="text-rose-400 font-bold">{stretch.toFixed(2)}x</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-[10px] uppercase">New Density (Height)</span>
                <span className="text-emerald-400 font-bold">{(1/stretch).toFixed(2)}x</span>
              </div>
           </div>
        </div>

        {/* Right Info: The Jacobian */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           
           <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700">
             <h4 className="font-bold text-indigo-400 mb-4 text-lg border-b border-slate-600 pb-2">The Log-Density Formula</h4>
             
             <div className="font-mono text-sm lg:text-base font-bold text-center leading-loose mb-6">
               log <span className="text-rose-400">P_K(z_K)</span> = 
               log <span className="text-blue-400">P_0(z_0)</span> 
               <br/><span className="text-slate-400">-</span> ∑ log <span className="text-emerald-400">|det J_f|</span>
             </div>

             <div className="space-y-4 text-sm text-slate-300">
                <p>
                  <strong className="text-blue-400">log P_0(z_0):</strong> The starting probability from our simple base Gaussian.
                </p>
                <div className="p-3 bg-slate-900 rounded border border-slate-600">
                  <p>
                    <strong className="text-emerald-400">|det J| (Jacobian Determinant):</strong><br/>
                    This terrifying term is exactly the "Stretch Factor" from the interactive visualization! It measures how much the function <span className="font-mono">f</span> locally stretches or compresses the space.
                  </p>
                </div>
                <p>
                  Because we <em>subtract</em> the log of the stretch factor, if the space is stretched (<span className="font-mono">det J &gt; 1</span>), the final probability density <strong>decreases</strong>.
                </p>
             </div>
           </div>

        </div>

      </div>
    </div>
  );
};

// --- SLIDE 5: Common Flow Architectures ---
// --- SLIDE 5: Common Flow Architectures ---
const FlowArchitecturesSlide = () => {
  const [activeFlow, setActiveFlow] = useState('planar');

  const flows = {
    planar: {
      name: "Planar Flows",
      desc: "Pushes and pulls the density along a specific straight hyperplane (like squeezing a balloon from two sides).",
      equation: "f(z) = z + u·h(wᵀz + b)",
      pros: "Conceptually simple. Easy to understand.",
      cons: "Requires stacking many, many layers to achieve highly complex shapes because each layer only makes a simple linear fold.",
      visual: (
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="w-32 h-32 bg-blue-500/20 rounded-full absolute mix-blend-screen blur-sm"></div>
          {/* Planar push visual */}
          <svg className="absolute inset-0 w-full h-full">
            <line x1="20%" y1="80%" x2="80%" y2="20%" stroke="#fff" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
            <path d="M 40% 60% Q 60% 40% 70% 30%" stroke="#60a5fa" strokeWidth="4" fill="none" />
            <polygon points="68%,28% 75%,25% 72%,32%" fill="#60a5fa" />
          </svg>
        </div>
      )
    },
    radial: {
      name: "Radial Flows",
      desc: "Modifies the density locally around a specific reference point, either expanding outward from it or compressing inward toward it.",
      equation: "f(z) = z + β(α + ||z - z_ref||)⁻¹(z - z_ref)",
      pros: "Great for creating highly localized changes in density (like poking a dimple into the distribution).",
      cons: "Like Planar, still relatively simple per layer. Needs many layers.",
      visual: (
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="w-32 h-32 bg-blue-500/20 rounded-full absolute mix-blend-screen blur-sm"></div>
          {/* Radial push visual */}
          <div className="absolute w-2 h-2 bg-white rounded-full"></div>
          <svg className="absolute inset-0 w-full h-full">
            <circle cx="50%" cy="50%" r="40" stroke="#fff" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.5" />
            <path d="M 50% 50% L 70% 20%" stroke="#60a5fa" strokeWidth="3" fill="none" />
            <polygon points="68%,23% 72%,17% 73%,24%" fill="#60a5fa" />
            <path d="M 50% 50% L 20% 60%" stroke="#60a5fa" strokeWidth="3" fill="none" />
            <polygon points="23%,58% 18%,60% 23%,62%" fill="#60a5fa" />
          </svg>
        </div>
      )
    },
    coupling: {
      name: "Coupling Layers (RealNVP, Glow)",
      desc: "Splits the input vector in half. Leaves the first half unchanged. Uses the first half to determine how to scale and shift the second half.",
      equation: "z'_A = z_A  |  z'_B = z_B ⊙ exp(s(z_A)) + t(z_A)",
      pros: "Extremely powerful. The Jacobian determinant is perfectly triangular, making computation incredibly fast. Inverting it is also trivial.",
      cons: "Half the variables are left unmodified in each layer, requiring specific alternating permutation layers.",
      visual: (
        <div className="w-full h-full flex items-center justify-center gap-4 relative">
          <div className="flex flex-col gap-2">
            <div className="w-12 h-16 bg-slate-600 rounded flex items-center justify-center text-xs font-bold font-mono">z_A</div>
            <div className="w-12 h-16 bg-blue-600 rounded flex items-center justify-center text-xs font-bold font-mono">z_B</div>
          </div>
          <ArrowRight className="w-6 h-6 text-slate-500" />
          <div className="flex flex-col gap-2">
            <div className="w-12 h-16 bg-slate-600 rounded flex items-center justify-center text-xs font-bold font-mono">z'_A</div>
            <div className="w-12 h-20 bg-blue-400 rounded flex items-center justify-center text-xs font-bold font-mono shadow-[0_0_15px_#60a5fa] border-2 border-white">z'_B</div>
          </div>
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
             <path d="M 100 35 Q 150 35 150 75 T 195 110" stroke="#fff" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          </svg>
        </div>
      )
    },
    autoregressive: {
      name: "Autoregressive Flows (MAF, IAF)",
      desc: "Transforms each dimension conditioned on all preceding dimensions. Uses a scalar transform (like az + b) where parameters are generated by neural networks looking at past values.",
      equation: "z'_i = τ( z_i ; h_i(z_{<i}) )",
      pros: "Highly expressive. MAF offers extremely fast density evaluation (O(1)). IAF offers extremely fast parallel sampling (O(1)).",
      cons: "Asymmetric cost. MAF is very slow to sample (sequential). IAF is very slow to evaluate density. Both often use MADE architecture.",
      visual: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-slate-600 rounded flex items-center justify-center text-[10px] font-bold font-mono">z₁</div>
               <ArrowRight className="w-4 h-4 text-slate-500" />
               <div className="bg-emerald-900/30 border border-emerald-500/50 px-3 py-1.5 rounded text-[10px] font-mono text-emerald-300 w-40 text-center shadow-inner">z'₁ = τ(z₁)</div>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-slate-600 rounded flex items-center justify-center text-[10px] font-bold font-mono">z₂</div>
               <ArrowRight className="w-4 h-4 text-slate-500" />
               <div className="bg-emerald-900/30 border border-emerald-500/50 px-3 py-1.5 rounded text-[10px] font-mono text-emerald-300 w-40 text-center shadow-inner">z'₂ = τ(z₂ ; h(z₁))</div>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-slate-600 rounded flex items-center justify-center text-[10px] font-bold font-mono">z₃</div>
               <ArrowRight className="w-4 h-4 text-slate-500" />
               <div className="bg-emerald-900/30 border border-emerald-500/50 px-3 py-1.5 rounded text-[10px] font-bold font-mono text-emerald-300 w-40 text-center shadow-inner">z'₃ = τ(z₃ ; h(z₁,z₂))</div>
            </div>
            <span className="text-[10px] text-slate-400 mt-2 text-center uppercase tracking-widest">Sequential Conditioning</span>
          </div>
        </div>
      )
    }
  };

  const curr = flows[activeFlow];

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">Common Flow Architectures</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          The main challenge in Normalizing Flows is finding functions that are highly expressive, but where the Jacobian determinant remains <strong>computationally cheap</strong> to calculate.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left Nav */}
        <div className="lg:w-1/3 flex flex-col gap-3">
          {Object.keys(flows).map(k => (
            <button 
              key={k} onClick={() => setActiveFlow(k)}
              className={`p-4 rounded-xl text-left flex flex-col gap-1 transition-all border-l-4 ${activeFlow === k ? 'bg-slate-800 border-indigo-500 shadow-lg' : 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-400'}`}
            >
              <span className="font-bold text-sm text-slate-200">{flows[k].name}</span>
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="lg:w-2/3 bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-8 flex flex-col relative overflow-hidden">
           <AnimatePresence mode="wait">
             <motion.div key={activeFlow} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
               
               <h3 className="text-2xl font-bold text-indigo-400 mb-2">{curr.name}</h3>
               <p className="text-sm text-slate-300 leading-relaxed mb-6">{curr.desc}</p>
               
               <div className="bg-slate-900 border border-slate-600 rounded-xl p-4 font-mono text-sm text-center text-emerald-400 mb-6 shadow-inner">
                 {curr.equation}
               </div>

               <div className="flex-grow bg-black/40 rounded-xl border border-slate-700 relative overflow-hidden mb-6 h-48">
                 {curr.visual}
               </div>

               <div className="grid grid-cols-2 gap-4 mt-auto">
                 <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl">
                   <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Advantage</span>
                   <span className="text-xs text-slate-300">{curr.pros}</span>
                 </div>
                 <div className="bg-rose-900/20 border border-rose-500/30 p-4 rounded-xl">
                   <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block mb-1">Limitation</span>
                   <span className="text-xs text-slate-300">{curr.cons}</span>
                 </div>
               </div>

             </motion.div>
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 6: Weaving Flows into VAEs ---
const WeavingFlowsSlide = () => {
  const [integration, setIntegration] = useState('posterior');

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">Weaving Flows into VAEs</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Now that we have this powerful tool to bend probabilities, where do we put it inside the VAE architecture? We can use it to upgrade the <strong>Posterior</strong>, the <strong>Prior</strong>, or both!
        </p>
      </div>

      <div className="flex justify-center mb-8 w-full max-w-2xl mx-auto">
        <div className="flex bg-slate-200 p-1 rounded-xl w-full shadow-inner border border-slate-300">
           <button onClick={() => setIntegration('posterior')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${integration === 'posterior' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-300/50'}`}>Flexible Posterior <span className="font-mono text-[10px] bg-white/20 px-1 rounded">q(z|x)</span></button>
           <button onClick={() => setIntegration('prior')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${integration === 'prior' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-300/50'}`}>Learnable Prior <span className="font-mono text-[10px] bg-white/20 px-1 rounded">p(z)</span></button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Visualizer */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col items-center justify-center relative overflow-hidden">
           
           <AnimatePresence mode="wait">
             {integration === 'posterior' ? (
               <motion.div key="post" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full gap-4">
                  <h3 className="font-bold text-indigo-800 uppercase tracking-widest text-xs mb-4">Upgrading the Encoder Output</h3>
                  
                  <div className="flex items-center gap-4 w-full justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-800 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-md">Encoder</div>
                      <span className="text-[10px] font-mono text-slate-500 mt-1">x</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300" />
                    
                    <div className="flex flex-col items-center relative">
                      <span className="absolute -top-6 text-[10px] font-bold text-blue-500 whitespace-nowrap">Base Gaussian</span>
                      <div className="w-16 h-16 bg-blue-100 border-2 border-blue-400 rounded-full flex items-center justify-center shadow-inner text-xs font-mono font-bold text-blue-800">z_0</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300" />
                    
                    <div className="flex flex-col items-center relative">
                      <span className="absolute -top-6 text-[10px] font-bold text-indigo-500 whitespace-nowrap">Flow Layers (f_1, ..., f_K)</span>
                      <div className="flex gap-1 bg-indigo-50 p-2 rounded-lg border border-indigo-200">
                        <div className="w-8 h-12 bg-indigo-300 rounded shadow-sm"></div>
                        <div className="w-8 h-12 bg-indigo-400 rounded shadow-sm"></div>
                        <div className="w-8 h-12 bg-indigo-500 rounded shadow-sm"></div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300" />
                    
                    <div className="flex flex-col items-center relative">
                      <span className="absolute -top-6 text-[10px] font-bold text-purple-600 whitespace-nowrap">Complex Posterior</span>
                      <div className="w-20 h-20 bg-purple-100 border-2 border-purple-500 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] flex items-center justify-center shadow-lg text-xs font-mono font-bold text-purple-800">z_K</div>
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-sm text-indigo-900 w-full text-center">
                    The Encoder still outputs parameters for a simple Gaussian (<span className="font-mono">z_0</span>). But before calculating the ELBO, we pass <span className="font-mono">z_0</span> through the Flow network to warp it into a highly complex, multi-modal shape!
                  </div>
               </motion.div>
             ) : (
               <motion.div key="prior" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full gap-4">
                  <h3 className="font-bold text-emerald-800 uppercase tracking-widest text-xs mb-4">Making the Prior Learnable</h3>
                  
                  <div className="flex items-center gap-4 w-full justify-center">
                    <div className="flex flex-col items-center relative">
                      <span className="absolute -top-6 text-[10px] font-bold text-slate-500 whitespace-nowrap">Standard Gaussian</span>
                      <div className="w-16 h-16 bg-slate-100 border-2 border-slate-400 rounded-full flex items-center justify-center shadow-inner text-xs font-mono font-bold text-slate-600">N(0,I)</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300" />
                    
                    <div className="flex flex-col items-center relative">
                      <span className="absolute -top-6 text-[10px] font-bold text-emerald-500 whitespace-nowrap">Flow Layers (g_1, ..., g_M)</span>
                      <div className="flex gap-1 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        <div className="w-8 h-12 bg-emerald-300 rounded shadow-sm"></div>
                        <div className="w-8 h-12 bg-emerald-400 rounded shadow-sm"></div>
                        <div className="w-8 h-12 bg-emerald-500 rounded shadow-sm"></div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300" />
                    
                    <div className="flex flex-col items-center relative">
                      <span className="absolute -top-6 text-[10px] font-bold text-teal-600 whitespace-nowrap">Learnable Target Prior</span>
                      <div className="w-24 h-24 bg-teal-100 border-2 border-teal-500 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] flex items-center justify-center shadow-lg text-xs font-mono font-bold text-teal-800 text-center leading-tight">
                        p(z)<br/>(Adapted)
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-sm text-emerald-900 w-full text-center">
                    Instead of forcing the Encoder to match a boring perfect circle, we use a Flow to let the Prior <strong>adapt its shape</strong> to fit the natural geometry of the data! This severely reduces KL Divergence tension.
                  </div>
               </motion.div>
             )}
           </AnimatePresence>

        </div>

        {/* Info Box */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700 flex-grow flex flex-col justify-center">
             <h4 className="font-bold text-amber-400 text-lg mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5"/> The Big Win: Tighter ELBO</h4>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               If your Approximate Posterior <span className="font-mono text-xs">q(z|x)</span> is restricted to a simple bell curve, it will never perfectly overlap with the True Posterior <span className="font-mono text-xs">p(z|x)</span>. There will always be a "gap".
             </p>
             <p className="text-sm text-slate-300 leading-relaxed">
               By using Normalizing Flows to make <span className="font-mono text-xs">q(z|x)</span> highly flexible, it can bend and warp to perfectly match the True Posterior. This shrinks the KL gap, leading to a much tighter (higher) ELBO, indicating a vastly superior model.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 7: Resolving Your Confusions ---
const ResolvingConfusionsSlide = () => {
  const [activeDoubt, setActiveDoubt] = useState('doubt1');

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">Clearing the Confusion: Visualizing the Math</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Let's explicitly resolve the two biggest confusions about how Normalizing Flows actually wire into the VAE.
        </p>
      </div>

      <div className="flex justify-center mb-6 w-full max-w-3xl mx-auto">
        <div className="flex bg-slate-800 p-1 rounded-xl w-full shadow-inner border border-slate-700">
           <button onClick={() => setActiveDoubt('doubt1')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeDoubt === 'doubt1' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}>
             <HelpCircle className="w-4 h-4"/> Doubt 1: What goes into the Flow?
           </button>
           <button onClick={() => setActiveDoubt('doubt2')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeDoubt === 'doubt2' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}>
             <HelpCircle className="w-4 h-4"/> Doubt 2: Aren't q and p the same?
           </button>
        </div>
      </div>

      <div className="flex flex-col max-w-6xl mx-auto w-full flex-grow pb-8 relative overflow-hidden">
         <AnimatePresence mode="wait">
            
            {/* DOUBT 1: What goes into the Flow? */}
            {activeDoubt === 'doubt1' && (
              <motion.div key="d1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full w-full">
                
                <div className="bg-indigo-900/30 border-l-4 border-indigo-500 p-4 rounded-r-xl mb-6 shadow-sm">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">Your Question:</span>
                  <p className="text-sm text-slate-200 italic">"We output 10 means and 10 variances... so the input to our NF is this 10 mean and 10 variance correct?"</p>
                  <div className="mt-3 bg-indigo-950 p-3 rounded-lg border border-indigo-500/50 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5"/>
                    <p className="text-sm text-slate-300"><strong>INCORRECT!</strong> We do <em>not</em> pass the raw parameters (mean, variance) into the flow. We use those parameters to roll the dice and draw a single <strong>Sample (z_0)</strong>. We pass that <em>sample</em> into the flow!</p>
                  </div>
                </div>

                <div className="flex-grow bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                   
                   <div className="flex items-center gap-4 w-full justify-center relative z-10">
                      
                      {/* Encoder Output */}
                      <div className="flex flex-col items-center bg-slate-900 p-3 rounded-xl border border-slate-600 shadow-inner">
                        <span className="text-[10px] text-slate-400 font-bold uppercase mb-2">Encoder Outputs</span>
                        <div className="flex gap-2">
                           <div className="bg-blue-900/50 text-blue-300 font-mono text-xs px-2 py-1 rounded border border-blue-500/50">mean (10 dims)</div>
                           <div className="bg-emerald-900/50 text-emerald-300 font-mono text-xs px-2 py-1 rounded border border-emerald-500/50">variance (10 dims)</div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center relative">
                        <ArrowRight className="w-6 h-6 text-slate-400" />
                        <div className="absolute -top-8 bg-amber-500 text-amber-950 text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-bounce flex items-center gap-1">
                          <Dices className="w-3 h-3"/> SAMPLE!
                        </div>
                      </div>

                      {/* The Sample (z0) */}
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-amber-100 border-4 border-amber-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.4)] z-10 relative">
                          <span className="font-mono font-bold text-amber-700 text-lg">z_0</span>
                        </div>
                        <span className="text-[10px] text-amber-500 font-bold mt-2 uppercase text-center">1 Single Point<br/>(10 dims)</span>
                      </div>

                      <ArrowRight className="w-6 h-6 text-slate-400" />

                      {/* The Flows */}
                      <div className="flex gap-1 bg-indigo-900/20 p-2 rounded-xl border border-indigo-500/30 relative">
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-indigo-400 uppercase whitespace-nowrap">Normalizing Flow</span>
                        <div className="w-12 h-16 bg-indigo-500 rounded flex items-center justify-center font-mono font-bold text-xs shadow-md">f_1</div>
                        <div className="w-12 h-16 bg-indigo-600 rounded flex items-center justify-center font-mono font-bold text-xs shadow-md">f_2</div>
                        <div className="w-12 h-16 bg-indigo-700 rounded flex items-center justify-center font-mono font-bold text-xs shadow-md">...</div>
                      </div>

                      <ArrowRight className="w-6 h-6 text-slate-400" />

                      {/* Final Z */}
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-purple-100 border-4 border-purple-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)] z-10 relative">
                          <span className="font-mono font-bold text-purple-700 text-xl">z_K</span>
                        </div>
                        <span className="text-[10px] text-purple-400 font-bold mt-2 uppercase text-center">Final Latent Space<br/>(Goes to Decoder)</span>
                      </div>

                   </div>

                   <div className="mt-8 bg-slate-900 border border-slate-600 p-4 rounded-xl text-sm text-slate-300 text-center w-full max-w-2xl font-mono">
                     <span className="text-amber-400">z_0</span> is drawn from <span className="text-blue-400">mean</span> and <span className="text-emerald-400">variance</span>.<br/>Then <span className="text-purple-400">z_K</span> = f_K( ... f_2( f_1(<span className="text-amber-400">z_0</span>) ) )
                   </div>
                </div>

              </motion.div>
            )}

            {/* DOUBT 2: Aren't q and p the same? */}
            {activeDoubt === 'doubt2' && (
              <motion.div key="d2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full w-full">
                
                <div className="bg-rose-900/30 border-l-4 border-rose-500 p-4 rounded-r-xl mb-6 shadow-sm">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-widest block mb-1">Your Question:</span>
                  <p className="text-sm text-slate-200 italic">"What does Learnable Prior even mean? Isn't log q(z_K|x) and log p(z_M) the same thing? We are talking about the same training but two different things are calculating their own stuff?"</p>
                  <div className="mt-3 bg-rose-950 p-3 rounded-lg border border-rose-500/50 flex items-start gap-3">
                    <Swords className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5"/>
                    <p className="text-sm text-slate-300"><strong>They are the two competitors in the KL Divergence tug-of-war!</strong> They are completely different pipelines trying to match each other.</p>
                  </div>
                </div>

                <div className="flex-grow bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-6 flex flex-col relative overflow-hidden">
                   
                   <div className="flex justify-between items-center w-full h-full relative z-10 gap-4">
                      
                      {/* Left: The Posterior Pipeline */}
                      <div className="flex-1 bg-indigo-900/20 border-2 border-indigo-500/50 p-4 rounded-xl flex flex-col items-center relative h-full">
                         <span className="absolute top-0 left-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg uppercase tracking-widest">Corner 1: The Guess</span>
                         
                         <h4 className="font-bold text-indigo-300 mt-6 mb-2">The Approximate Posterior</h4>
                         <span className="font-mono text-xl font-bold text-white bg-indigo-950 px-3 py-1 rounded border border-indigo-500 shadow-lg mb-6">q( z_K | x )</span>
                         
                         <div className="flex flex-col items-center gap-2 text-xs text-indigo-200 text-center w-full max-w-[200px] bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                           <span>Starts from Image <strong>x</strong></span>
                           <ArrowDown className="w-4 h-4 text-slate-500"/>
                           <span>Encoder outputs Base N(mean, var)</span>
                           <ArrowDown className="w-4 h-4 text-slate-500"/>
                           <span>Flows <strong>f</strong> warp it into z_K</span>
                         </div>
                      </div>

                      {/* Middle: The KL Battleground */}
                      <div className="flex flex-col items-center shrink-0 w-32 relative">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">The Battleground</span>
                         <div className="w-20 h-20 bg-slate-900 rounded-full border-4 border-slate-600 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] z-20">
                            <Scale className="w-10 h-10 text-slate-300" />
                         </div>
                         <div className="bg-slate-700 text-white font-mono text-xs font-bold px-3 py-2 rounded-xl mt-4 text-center border border-slate-500">
                           KL Divergence<br/>(Match each other!)
                         </div>
                         {/* Connecting lines */}
                         <div className="absolute top-16 left-[-2rem] w-8 h-1 bg-indigo-500"></div>
                         <div className="absolute top-16 right-[-2rem] w-8 h-1 bg-emerald-500"></div>
                      </div>

                      {/* Right: The Prior Pipeline */}
                      <div className="flex-1 bg-emerald-900/20 border-2 border-emerald-500/50 p-4 rounded-xl flex flex-col items-center relative h-full">
                         <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-widest">Corner 2: The Target</span>
                         
                         <h4 className="font-bold text-emerald-300 mt-6 mb-2">The Learnable Prior</h4>
                         <span className="font-mono text-xl font-bold text-white bg-emerald-950 px-3 py-1 rounded border border-emerald-500 shadow-lg mb-6">p( z_M )</span>
                         
                         <div className="flex flex-col items-center gap-2 text-xs text-emerald-200 text-center w-full max-w-[200px] bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                           <span>Starts from <strong>Nothing</strong> (Universal)</span>
                           <ArrowDown className="w-4 h-4 text-slate-500"/>
                           <span>Base N(0,I)</span>
                           <ArrowDown className="w-4 h-4 text-slate-500"/>
                           <span>Flows <strong>g</strong> warp it into z_M</span>
                         </div>
                      </div>

                   </div>
                   
                   <p className="text-xs text-slate-400 text-center mt-6 z-10 px-8">
                     <strong>Why are they calculating their own stuff?</strong> Because <span className="font-mono text-indigo-300">q</span> is trying to map the specific image into a complex shape. If the Prior target <span className="font-mono text-emerald-300">p</span> was just a rigid perfect circle (N(0,1)), the KL divergence penalty would be massive. By giving <span className="font-mono text-emerald-300">p</span> its own Normalizing Flows, the target can morph to meet the Encoder halfway!
                   </p>
                </div>

              </motion.div>
            )}

         </AnimatePresence>
      </div>
    </div>
  );
};

// --- SLIDE 8: Deep Breath - The Learnable Prior Visualized ---
const TheLearnablePriorSlide = () => {
  const [mode, setMode] = useState('standard'); // 'standard' or 'flow'

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-white flex items-center gap-3">
          <Wind className="w-8 h-8 text-sky-400"/> Deep Breath: Demystifying the "Learnable Prior"
        </h2>
        <p className="text-slate-300 text-center max-w-4xl text-sm md:text-base bg-sky-900/30 p-4 rounded-xl border border-sky-500/30">
          Your understanding of ELBO is perfectly correct! KL Divergence measures the gap between the Encoder's guess (<span className="font-mono text-indigo-300">q</span>) and the Target Prior (<span className="font-mono text-emerald-300">p</span>). The confusion vanishes when you realize we are just <strong>changing the shape of the Target</strong>.
        </p>
      </div>

      <div className="flex justify-center mb-6 w-full max-w-2xl mx-auto">
        <div className="flex bg-slate-800 p-1 rounded-xl w-full shadow-inner border border-slate-700">
           <button onClick={() => setMode('standard')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${mode === 'standard' ? 'bg-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}>
             <Lock className="w-4 h-4"/> Standard VAE (Rigid Target)
           </button>
           <button onClick={() => setMode('flow')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${mode === 'flow' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}>
             <Waves className="w-4 h-4"/> Normalizing Flow Prior (Adaptive Target)
           </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full items-stretch pb-8">
        
        {/* Visualizer */}
        <div className="flex-[1.5] bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-6 flex flex-col relative overflow-hidden">
           
           <div className="flex justify-between items-end w-full h-64 relative mt-8 px-4">
              
              {/* LEFT: ENCODER (q) */}
              <div className="flex flex-col items-center z-10 w-1/3">
                 <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 text-center">Encoder's Guess<br/><span className="font-mono">q(z|x)</span></span>
                 {/* The data naturally wants to be a crescent shape */}
                 <div className="w-24 h-24 bg-slate-900 border-2 border-slate-600 rounded-xl relative flex items-center justify-center shadow-lg overflow-hidden">
                    <motion.div 
                      className="absolute w-20 h-20 bg-transparent border-8 border-indigo-500 rounded-full"
                      style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
                    />
                 </div>
                 <span className="text-[9px] text-slate-400 mt-2 text-center">Data naturally forms a complex "C" shape.</span>
              </div>

              {/* MIDDLE: THE KL TUG OF WAR */}
              <div className="flex-1 flex flex-col items-center justify-center h-24 relative z-0">
                 <Scale className={`w-8 h-8 mb-2 ${mode === 'standard' ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`} />
                 <span className={`text-[10px] font-bold uppercase tracking-widest ${mode === 'standard' ? 'text-rose-400' : 'text-emerald-400'}`}>
                   KL Divergence
                 </span>
                 
                 {/* Tension Line */}
                 {mode === 'standard' ? (
                   <div className="absolute top-1/2 w-full flex items-center justify-center">
                     <svg className="w-full h-8 overflow-visible">
                       <path d="M 10 15 Q 20 -10 30 15 T 50 15 T 70 15 T 90 15" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" className="animate-[pulse_0.5s_infinite]" />
                     </svg>
                     <span className="absolute -top-4 text-[9px] font-bold text-rose-500 bg-slate-800 px-1">MASSIVE PENALTY</span>
                   </div>
                 ) : (
                   <div className="absolute top-1/2 w-full flex items-center justify-center">
                     <div className="w-full h-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                     <span className="absolute -top-4 text-[9px] font-bold text-emerald-400 bg-slate-800 px-1">LOW PENALTY (Match!)</span>
                   </div>
                 )}
              </div>

              {/* RIGHT: TARGET PRIOR (p) */}
              <div className="flex flex-col items-center z-10 w-1/3">
                 <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2 text-center">Target Prior<br/><span className="font-mono">{mode === 'standard' ? 'p(z)' : 'p(z_M)'}</span></span>
                 
                 <div className="w-24 h-24 bg-slate-900 border-2 border-slate-600 rounded-xl relative flex items-center justify-center shadow-lg overflow-hidden">
                    <AnimatePresence mode="wait">
                      {mode === 'standard' ? (
                        <motion.div key="circle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-16 h-16 bg-emerald-500/50 border-2 border-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-[8px] font-mono font-bold text-emerald-900">N(0,I)</span>
                        </motion.div>
                      ) : (
                        <motion.div key="crescent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute w-20 h-20 bg-transparent border-8 border-emerald-500 rounded-full" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
                 
                 {mode === 'flow' && (
                   <div className="absolute -top-16 flex flex-col items-center">
                     <div className="flex gap-1 bg-emerald-900/50 p-1 rounded border border-emerald-500">
                       <span className="text-[8px] font-mono">N(0,I) ➔ g_m ➔</span>
                     </div>
                     <ArrowDown className="w-4 h-4 text-emerald-500 my-1" />
                   </div>
                 )}
                 <span className="text-[9px] text-slate-400 mt-2 text-center">{mode === 'standard' ? 'Rigid, unmoving perfect circle.' : 'Flows warped the circle to match the data!'}</span>
              </div>
              
           </div>

           <div className={`mt-8 p-4 rounded-xl text-sm leading-relaxed ${mode === 'standard' ? 'bg-rose-950/30 border border-rose-500/30 text-rose-200' : 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-200'}`}>
             {mode === 'standard' ? (
               <p><strong>The "Posterior Collapse" Trap:</strong> The Encoder tries to map the image to a complex "C" shape. But the KL penalty screams: <em>"No! You must look like a perfect circle!"</em> To stop the massive penalty, the Encoder gives up, ignores the image, and just outputs a generic circle. The model collapses.</p>
             ) : (
               <p><strong>The Fix:</strong> We don't change the Encoder. Instead, we give the Target Prior its <em>own</em> little Flow Network (<span className="font-mono text-xs">g_m</span>). The Target starts as a circle, flows through <span className="font-mono text-xs">g_m</span>, and morphs into a "C" shape. Now, when KL compares them, they match perfectly! No massive penalty, no collapse.</p>
             )}
           </div>

        </div>

        {/* Right Info */}
        <div className="flex-1 flex flex-col gap-4">
           <div className="bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700">
             <h4 className="font-bold text-sky-400 mb-2 flex items-center gap-2"><Link className="w-5 h-5"/> Two Separate Pipelines</h4>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               You asked: <em>"Isn't log q(z_K|x) and log p(z_M) the same thing?"</em>
             </p>
             <p className="text-sm text-slate-300 leading-relaxed">
               No! They are two totally different pathways trying to meet in the middle:
               <br/><br/>
               <strong>Pathway 1 (The Encoder):</strong> Looks at the image <span className="font-mono text-xs text-slate-400">x</span>, generates a base guess, and runs it through Flow <span className="font-mono text-xs text-indigo-400">f</span> to get <span className="font-mono text-xs text-indigo-400">q(z_K|x)</span>.
               <br/><br/>
               <strong>Pathway 2 (The Prior):</strong> Looks at NOTHING. Generates random noise <span className="font-mono text-xs text-slate-400">z_0</span>, and runs it through Flow <span className="font-mono text-xs text-emerald-400">g</span> to get <span className="font-mono text-xs text-emerald-400">p(z_M)</span>.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 9: How Does the Blind Prior Learn? (NEW) ---
const HowThePriorLearnsSlide = () => {
  const [animationStep, setAnimationStep] = useState(0);

  const runAnimation = () => {
    setAnimationStep(1); // Show forward pass
    setTimeout(() => setAnimationStep(2), 2000); // Show loss comparison
    setTimeout(() => setAnimationStep(3), 4000); // Show backprop
    setTimeout(() => setAnimationStep(0), 7000); // Reset
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">How Does the "Blind" Prior Learn?</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          If the Prior starts with pure noise <span className="font-mono bg-slate-800 px-1 rounded text-slate-200">z_0 ~ N(0,1)</span>, how do its parameters know what the data looks like? The answer is <strong>Backpropagation</strong>. The Encoder acts as a teacher!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: Forward Pass (Blind) */}
        <div className={`flex-1 rounded-2xl p-6 flex flex-col items-center relative transition-colors duration-500 border-2 ${animationStep === 1 ? 'bg-slate-800 border-slate-500 shadow-lg' : 'bg-slate-800/50 border-slate-700'}`}>
           <h3 className="font-bold text-slate-300 text-sm uppercase tracking-widest mb-6 text-center">1. Forward Pass (Blind)</h3>
           
           <div className="flex flex-col items-center w-full gap-4 relative z-10">
              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-bold text-slate-500 mb-1">Random Noise</span>
                 <div className="w-16 h-16 bg-slate-700 border-2 border-dashed border-slate-500 rounded-full flex items-center justify-center font-mono text-xs">z_0</div>
              </div>

              <ArrowDown className="text-slate-500 w-6 h-6" />

              <div className="bg-emerald-900/50 border-2 border-emerald-500 px-6 py-3 rounded-xl flex flex-col items-center shadow-lg">
                 <span className="font-bold text-emerald-400">Prior Flow (g_m)</span>
                 <span className="text-[10px] text-emerald-200/50 font-mono mt-1">Parameters: θ</span>
              </div>

              <ArrowDown className="text-slate-500 w-6 h-6" />

              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-bold text-emerald-500 mb-1">Prior Output p(z_M)</span>
                 <div className="w-24 h-24 bg-slate-900 border-2 border-emerald-500 rounded-xl relative flex items-center justify-center overflow-hidden">
                    <motion.div animate={{ borderRadius: animationStep === 3 ? "50% 10% 50% 10%" : "50%", rotate: animationStep === 3 ? 45 : 0 }} transition={{ duration: 1 }} className="w-16 h-16 bg-emerald-500/50 blur-md"></motion.div>
                 </div>
                 <span className="text-[10px] text-slate-400 text-center mt-2 h-8">
                   {animationStep === 1 ? "Blind guess. Doesn't look like data yet." : ""}
                   {animationStep === 3 ? "Shape morphs to match the Encoder!" : ""}
                 </span>
              </div>
           </div>
        </div>

        {/* Center: The Loss Comparison & Backprop */}
        <div className="flex flex-col items-center justify-center px-4 w-40 shrink-0 relative">
           
           <AnimatePresence>
             {animationStep >= 2 && (
               <motion.div key="kl-divergence-box" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center relative z-20 w-full">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2 text-center">KL Divergence</span>
                  <div className="w-full bg-amber-900/40 border-2 border-amber-500 rounded-xl p-3 flex flex-col items-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                    <Scale className="text-amber-400 w-8 h-8 mb-1" />
                    <span className="text-[10px] font-bold text-amber-200 text-center">Compares Prior to Encoder</span>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>

           <AnimatePresence>
             {animationStep === 3 && (
               <motion.div key="backprop-arrow-box" initial={{ height: 0, opacity: 0 }} animate={{ height: 180, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute top-[60%] -left-8 w-32 border-l-4 border-b-4 border-amber-400 rounded-bl-3xl flex items-end">
                  <ArrowLeft className="text-amber-400 w-8 h-8 transform translate-y-4 -translate-x-3 animate-pulse" />
                  <span className="absolute bottom-2 left-6 text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-slate-900 px-1">Gradient updates θ</span>
               </motion.div>
             )}
           </AnimatePresence>

           <button onClick={runAnimation} disabled={animationStep !== 0} className="absolute bottom-4 bg-indigo-600 text-white font-bold px-6 py-2 rounded-full hover:bg-indigo-500 shadow-lg disabled:opacity-30 transition-colors whitespace-nowrap z-30">
             Watch it Learn
           </button>
        </div>

        {/* Right: The Teacher (Encoder) */}
        <div className={`flex-1 rounded-2xl p-6 flex flex-col items-center relative transition-colors duration-500 border-2 ${animationStep === 2 ? 'bg-slate-800 border-slate-500 shadow-lg' : 'bg-slate-800/50 border-slate-700'}`}>
           <h3 className="font-bold text-slate-300 text-sm uppercase tracking-widest mb-6 text-center">2. The Teacher (Encoder)</h3>
           
           <div className="flex flex-col items-center w-full gap-4 relative z-10">
              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-bold text-slate-500 mb-1">Image Data</span>
                 <div className="w-16 h-16 bg-slate-200 border-2 border-slate-400 rounded-lg flex items-center justify-center text-2xl shadow-inner">🐶</div>
              </div>

              <ArrowDown className="text-slate-500 w-6 h-6" />

              <div className="bg-indigo-900/50 border-2 border-indigo-500 px-6 py-3 rounded-xl flex flex-col items-center shadow-lg">
                 <span className="font-bold text-indigo-400">Encoder + Flow (f_k)</span>
                 <span className="text-[10px] text-indigo-200/50 font-mono mt-1">Parameters: φ</span>
              </div>

              <ArrowDown className="text-slate-500 w-6 h-6" />

              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-bold text-indigo-500 mb-1">Encoder Output q(z_K|x)</span>
                 <div className="w-24 h-24 bg-slate-900 border-2 border-indigo-500 rounded-xl relative flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <div className="w-16 h-16 bg-indigo-500/50 blur-md rounded-[50%_10%_50%_10%] transform rotate-45"></div>
                 </div>
                 <span className="text-[10px] text-slate-400 text-center mt-2 h-8">
                   {animationStep >= 2 ? "The true target shape!" : ""}
                 </span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 10: The Upshot (Trade-offs) ---
const UpshotSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">The Upshot: Is it worth it?</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Normalizing Flows are incredibly mathematically elegant, but they introduce significant engineering trade-offs.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left Column: Benefits */}
        <div className="flex-1 flex flex-col gap-4">
           <h3 className="font-bold text-emerald-400 text-sm uppercase tracking-widest mb-2 px-2 border-b border-slate-700 pb-2 flex items-center gap-2">
             <CheckCircle className="w-5 h-5"/> The Benefits
           </h3>
           
           <div className="bg-slate-800 border-l-4 border-emerald-500 p-5 rounded-r-xl shadow-sm hover:bg-slate-700 transition-colors">
             <h4 className="font-bold text-emerald-300 mb-1">Tighter ELBO & Better Modeling</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               Allows <span className="font-mono text-xs">q(z|x)</span> to perfectly approximate the true posterior, drastically improving the mathematical soundness of the model.
             </p>
           </div>

           <div className="bg-slate-800 border-l-4 border-emerald-500 p-5 rounded-r-xl shadow-sm hover:bg-slate-700 transition-colors">
             <h4 className="font-bold text-emerald-300 mb-1">Enhanced Sample Quality</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               Because the latent space is no longer artificially squeezed into a sphere, the model captures finer details, leading to sharper and more diverse generated images.
             </p>
           </div>

           <div className="bg-slate-800 border-l-4 border-emerald-500 p-5 rounded-r-xl shadow-sm hover:bg-slate-700 transition-colors">
             <h4 className="font-bold text-emerald-300 mb-1">Alleviation of Posterior Collapse</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               A flexible prior can adapt to the aggregated posterior of the data. This completely removes the "KL panic" that usually causes the model to ignore the latent code.
             </p>
           </div>
        </div>

        {/* Right Column: Trade-offs */}
        <div className="flex-1 flex flex-col gap-4">
           <h3 className="font-bold text-amber-400 text-sm uppercase tracking-widest mb-2 px-2 border-b border-slate-700 pb-2 flex items-center gap-2">
             <AlertTriangle className="w-5 h-5"/> The Trade-Offs
           </h3>

           <div className="bg-slate-800 border-t-4 border-rose-500 p-5 rounded-b-xl shadow-sm">
             <h4 className="font-bold text-rose-300 mb-1">Massive Computational Demand</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               Every single flow layer requires a forward pass AND the calculation of the Jacobian determinant. Deep flows significantly increase training and inference times.
             </p>
           </div>

           <div className="bg-slate-800 border-t-4 border-orange-500 p-5 rounded-b-xl shadow-sm">
             <h4 className="font-bold text-orange-300 mb-1">Optimization Challenges</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               You are now training a VAE <em>plus</em> an entire chain of complex Flow networks simultaneously. This requires highly sophisticated hyperparameter tuning and longer training schedules.
             </p>
           </div>

           <div className="bg-slate-800 border-t-4 border-amber-500 p-5 rounded-b-xl shadow-sm">
             <h4 className="font-bold text-amber-300 mb-1">Architecture Paralysis</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               Choosing between Planar, Radial, RealNVP, or MAF is difficult. The "best" flow heavily depends on the specific shape of your target data, requiring extensive research and trial-and-error.
             </p>
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
    TheProblemSlide,
    CoreConceptSlide,
    GoldenRulesSlide,
    ChangeOfVariablesSlide,
    WeavingFlowsSlide,
    TheLearnablePriorSlide,
    FlowArchitecturesSlide,
    UpshotSlide
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
        
        <div className="flex space-x-1 md:space-x-2">
          {slides.map((_, i) => (
            <div
              key={`dot-${i}`}
              className={`w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full transition-all ${i === currentSlide ? 'bg-indigo-600 scale-125' : 'bg-slate-300'}`}
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