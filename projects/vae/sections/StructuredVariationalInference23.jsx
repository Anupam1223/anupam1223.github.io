import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Network, GitMerge, 
  ArrowRight, ArrowLeft, ArrowDown, Activity, Settings, 
  Box, Calculator, Zap, Grid, Scaling, Variable, 
  AlertTriangle, CheckCircle, Database, BrainCircuit, Workflow,
  Play, Rewind, Layers, Search, ImageOff, Target, Lightbulb
} from 'lucide-react';

// --- SLIDE 1: Topologies (High-Level Concept) ---
const TopologiesSlide = () => {
  const [isStructured, setIsStructured] = useState(false);

  return (
    <div className="flex flex-col h-full p-6 md:p-10 overflow-y-auto">
      <h2 className="text-3xl font-bold text-blue-600 mb-4 text-center shrink-0">Breaking the Independence Assumption</h2>
      <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto shrink-0 text-sm md:text-base">
        The Mean-Field approximation forces all latent variables to be independent. <strong>Structured Variational Inference</strong> fixes this by allowing the latent variables to influence each other during the approximation.
      </p>

      <div className="flex flex-col lg:flex-row items-center justify-center flex-grow gap-12 w-full max-w-5xl mx-auto pb-8">
        
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center w-full min-h-[400px]">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex mb-12 relative z-20">
            <button 
              onClick={() => setIsStructured(false)}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${!isStructured ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Network className="w-4 h-4" /> Mean-Field
            </button>
            <button 
              onClick={() => setIsStructured(true)}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${isStructured ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <GitMerge className="w-4 h-4" /> Structured
            </button>
          </div>

          <div className="relative w-64 h-64 flex flex-col items-center">
            <div className="w-16 h-16 bg-teal-100 border-2 border-teal-500 rounded-full flex items-center justify-center font-bold text-teal-800 shadow-md z-10 relative">
              x
              <span className="absolute -top-6 text-[10px] text-teal-600 uppercase tracking-widest font-bold">Input</span>
            </div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <marker id="arrowhead-gray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
                </marker>
                <marker id="arrowhead-purple" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" />
                </marker>
              </defs>
              
              <line x1="50%" y1="15%" x2="20%" y2="70%" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead-gray)" />
              <line x1="50%" y1="15%" x2="50%" y2="70%" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead-gray)" />
              <line x1="50%" y1="15%" x2="80%" y2="70%" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead-gray)" />

              <AnimatePresence>
                {isStructured && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <path d="M 25% 85% Q 35% 105% 45% 85%" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4" markerEnd="url(#arrowhead-purple)" />
                    <path d="M 55% 85% Q 65% 105% 75% 85%" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4" markerEnd="url(#arrowhead-purple)" />
                  </motion.g>
                )}
              </AnimatePresence>
            </svg>

            <div className="absolute bottom-4 w-full flex justify-between px-2 z-10">
              <div className="w-14 h-14 bg-blue-100 border-2 border-blue-500 rounded-full flex items-center justify-center font-bold text-blue-800 shadow-sm relative">
                z₁
              </div>
              <div className="w-14 h-14 bg-blue-100 border-2 border-blue-500 rounded-full flex items-center justify-center font-bold text-blue-800 shadow-sm relative">
                z₂
                {isStructured && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-8 whitespace-nowrap text-[9px] bg-purple-100 text-purple-800 px-1 py-0.5 rounded border border-purple-300 font-mono font-bold">q(z₂|z₁,x)</motion.div>}
              </div>
              <div className="w-14 h-14 bg-blue-100 border-2 border-blue-500 rounded-full flex items-center justify-center font-bold text-blue-800 shadow-sm relative">
                z₃
                {isStructured && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-8 whitespace-nowrap text-[9px] bg-purple-100 text-purple-800 px-1 py-0.5 rounded border border-purple-300 font-mono font-bold">q(z₃|z₂,x)</motion.div>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">The Mathematics</h3>
            
            <AnimatePresence mode="wait">
              {!isStructured ? (
                <motion.div key="mf" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 font-mono text-sm text-blue-900 rounded-r shadow-sm">
                    q(z|x) = q(z₁|x) * q(z₂|x) * q(z₃|x)
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Notice the <span className="font-mono bg-gray-200 px-1 rounded text-gray-800">*</span> symbol. We are simply multiplying independent probabilities. <br/><br/>
                    When generating <span className="font-mono font-bold text-gray-800">z₂</span>, the model is completely blind to whatever value it just chose for <span className="font-mono font-bold text-gray-800">z₁</span>.
                  </p>
                </motion.div>
              ) : (
                <motion.div key="struct" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 font-mono text-sm text-purple-900 rounded-r shadow-sm">
                    q(z|x) = q(z₁|x) * q(z₂|z₁,x) * q(z₃|z₂,x)
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Notice the <span className="font-mono bg-purple-200 px-1 rounded text-purple-900">| z</span> conditioning. <br/><br/>
                    We construct a chain. When the model generates <span className="font-mono font-bold text-gray-800">z₂</span>, it looks at <span className="font-mono font-bold text-gray-800">x</span> <strong>AND</strong> the specific value of <span className="font-mono font-bold text-gray-800">z₁</span>. This allows the model to capture correlations!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 2: The Architecture Change ---
const ArchitectureSlide = () => {
  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Are we replacing the standard Encoder?</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Yes. To break the independence assumption, we must fundamentally change how the Neural Network operates. We move from a <strong>Parallel</strong> architecture to a <strong>Sequential (Chain)</strong> architecture.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto items-stretch flex-grow pb-8">
        
        {/* Standard VAE Encoder */}
        <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-rose-500"></div>
          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Box className="w-5 h-5 text-rose-500"/> Standard VAE (Mean-Field)
          </h3>
          <p className="text-xs text-slate-500 mb-8 text-center">One network computes everything at once. No variable knows about the others.</p>
          
          <div className="flex flex-col items-center flex-grow justify-center w-full">
            <div className="w-16 h-12 bg-slate-100 border-2 border-slate-300 rounded flex items-center justify-center font-bold text-slate-600 mb-6 z-10">Image x</div>
            
            <div className="relative w-full flex justify-center h-24">
               <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                 <line x1="50%" y1="0" x2="30%" y2="100%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                 <line x1="50%" y1="0" x2="70%" y2="100%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
               </svg>
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-rose-100 border-2 border-rose-400 text-rose-800 px-6 py-3 rounded-lg font-bold shadow-sm z-10 flex items-center gap-2">
                 <BrainCircuit className="w-5 h-5" /> Encoder Net f(x)
               </div>
            </div>

            <div className="flex justify-between w-64 mt-2 z-10">
               <div className="flex flex-col items-center gap-2">
                 <div className="bg-white border-2 border-rose-200 px-3 py-2 rounded shadow-sm text-xs font-mono font-bold text-rose-700">μ₁, σ₁</div>
                 <ArrowDown className="w-4 h-4 text-slate-300"/>
                 <div className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">z₁</div>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <div className="bg-white border-2 border-rose-200 px-3 py-2 rounded shadow-sm text-xs font-mono font-bold text-rose-700">μ₂, σ₂</div>
                 <ArrowDown className="w-4 h-4 text-slate-300"/>
                 <div className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">z₂</div>
               </div>
            </div>
          </div>
        </div>

        {/* Autoregressive VAE Encoder */}
        <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500"></div>
          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Workflow className="w-5 h-5 text-indigo-500"/> Autoregressive VAE
          </h3>
          <p className="text-xs text-slate-500 mb-8 text-center">Calculated sequentially. z₂ waits to see what z₁ rolled before calculating its mean.</p>
          
          <div className="flex flex-col items-center flex-grow justify-center w-full relative">
            <div className="absolute top-0 left-12 w-16 h-12 bg-slate-100 border-2 border-slate-300 rounded flex items-center justify-center font-bold text-slate-600 z-10">Image x</div>
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
               <defs>
                 <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                   <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
                 </marker>
               </defs>
               <path d="M 80 48 L 80 80" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4"/>
               <path d="M 80 120 L 80 140" stroke="#cbd5e1" strokeWidth="2"/>
               
               <path d="M 100 24 C 180 24, 240 50, 240 80" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4"/>
               <path d="M 100 160 C 150 160, 240 160, 240 120" fill="none" stroke="#818cf8" strokeWidth="3" markerEnd="url(#arrow)"/>
               
               <path d="M 240 120 L 240 140" stroke="#cbd5e1" strokeWidth="2"/>
            </svg>

            <div className="flex justify-between w-64 mt-20 z-10">
               <div className="flex flex-col items-center gap-2">
                 <div className="bg-indigo-100 border-2 border-indigo-400 text-indigo-800 px-3 py-2 rounded font-bold shadow-sm text-xs">Net f₁(x)</div>
                 <div className="bg-white border border-indigo-200 px-2 py-1 rounded text-[10px] font-mono font-bold text-indigo-600">μ₁, σ₁</div>
                 <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">z₁</div>
               </div>

               <div className="flex flex-col items-center gap-2 mt-0">
                 <div className="bg-indigo-100 border-2 border-indigo-500 text-indigo-900 px-3 py-2 rounded font-bold shadow-md text-xs relative animate-pulse">
                    Net f₂(x, z₁)
                    <span className="absolute -top-6 -right-4 bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded shadow">Covariance Injected!</span>
                 </div>
                 <div className="bg-white border border-indigo-200 px-2 py-1 rounded text-[10px] font-mono font-bold text-indigo-600">μ₂, σ₂</div>
                 <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">z₂</div>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 3: How does it Train? (Backprop & Masking) ---
const AutoregressiveTrainingSlide = () => {
  const [step, setStep] = useState('forward'); 

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">How does an Autoregressive Model Train?</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          If generation is a slow sequence, how does backpropagation work? Modern autodiff engines handle this by tracking the <strong>Computational Graph</strong>. Furthermore, we can use <strong>Masked Matrices</strong> to train in parallel!
        </p>
      </div>

      <div className="flex justify-center mb-6 w-full max-w-4xl mx-auto relative z-20">
        <div className="flex bg-slate-200 p-1 rounded-xl w-full shadow-inner border border-slate-300">
           <button onClick={() => setStep('forward')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${step === 'forward' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
             <Play className="w-4 h-4"/> 1. The Forward Chain
           </button>
           <button onClick={() => setStep('backward')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${step === 'backward' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
             <Rewind className="w-4 h-4"/> 2. The Backprop Flow
           </button>
           <button onClick={() => setStep('masking')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${step === 'masking' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
             <Layers className="w-4 h-4"/> 3. The MADE Masking Trick
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto items-stretch flex-grow pb-8">
        
        <div className="flex-[1.5] bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col items-center relative overflow-hidden">
           <AnimatePresence mode="wait">
             
             {(step === 'forward' || step === 'backward') && (
               <motion.div key="graph" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col justify-center relative">
                 
                 <div className="flex justify-between items-center w-full max-w-3xl mx-auto mt-8 relative z-10">
                   
                   <div className="flex flex-col items-center gap-2 relative">
                     <div className="w-12 h-12 bg-slate-100 border-2 border-slate-300 rounded flex items-center justify-center font-bold text-slate-600 z-10">x</div>
                     <div className="absolute top-16 w-0.5 h-8 bg-blue-300"></div>
                     
                     <div className="mt-8 bg-blue-100 border-2 border-blue-400 text-blue-900 px-3 py-2 rounded text-xs font-bold z-10 relative">
                        Net f₁ (Parameters θ₁)
                        {step === 'backward' && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute -left-12 top-2 text-rose-600 font-bold text-xs flex items-center gap-1 bg-rose-50 px-1 rounded border border-rose-200">
                             <ArrowRight className="w-3 h-3"/> ∇θ₁
                          </motion.div>
                        )}
                     </div>

                     <div className="absolute top-32 w-0.5 h-8 bg-blue-300"></div>
                     
                     <div className="mt-8 w-14 h-14 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold shadow-md z-10 relative">
                        z₁
                        {step === 'backward' && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute -left-20 top-4 text-rose-600 font-bold text-[10px] text-right">
                             Grad from<br/>Loss 1 & Net 2
                          </motion.div>
                        )}
                     </div>
                   </div>

                   <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                     <defs>
                       <marker id="blue-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                         <path d="M 0 0 L 10 5 L 0 10 z" fill="#93c5fd" />
                       </marker>
                       <marker id="red-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                         <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                       </marker>
                     </defs>
                     
                     <path d="M 120 180 C 250 180, 250 110, 420 110" fill="none" stroke="#93c5fd" strokeWidth="3" markerEnd="url(#blue-arrow)"/>
                     
                     {step === 'backward' && (
                       <>
                         <motion.path 
                           initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }}
                           d="M 420 105 C 250 105, 250 175, 120 175" fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="6" markerEnd="url(#red-arrow)"
                         />
                         <motion.path 
                           initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.5 }}
                           d="M 100 170 L 100 140" fill="none" stroke="#f43f5e" strokeWidth="4" markerEnd="url(#red-arrow)"
                         />
                         <motion.path 
                           initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}
                           d="M 450 170 L 450 140" fill="none" stroke="#f43f5e" strokeWidth="4" markerEnd="url(#red-arrow)"
                         />
                       </>
                     )}
                   </svg>

                   <div className="flex flex-col items-center gap-2 relative">
                     <div className="w-12 h-12 bg-slate-100 border-2 border-slate-300 rounded flex items-center justify-center font-bold text-slate-600 z-10">x</div>
                     <div className="absolute top-16 w-0.5 h-8 bg-blue-300"></div>
                     
                     <div className="mt-8 bg-blue-100 border-2 border-blue-400 text-blue-900 px-3 py-2 rounded text-xs font-bold z-10 relative">
                        Net f₂ (Parameters θ₂)
                        {step === 'backward' && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute -right-12 top-2 text-rose-600 font-bold text-xs flex items-center gap-1 bg-rose-50 px-1 rounded border border-rose-200">
                             ∇θ₂ <ArrowLeft className="w-3 h-3"/>
                          </motion.div>
                        )}
                     </div>

                     <div className="absolute top-32 w-0.5 h-8 bg-blue-300"></div>
                     
                     <div className="mt-8 w-14 h-14 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold shadow-md z-10 relative">
                        z₂
                     </div>
                   </div>

                   {step === 'backward' && (
                     <div className="absolute right-0 top-1/2 transform translate-x-12 -translate-y-1/2 flex flex-col items-center">
                       <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-rose-100 border-2 border-rose-500 text-rose-900 font-bold px-4 py-2 rounded-xl shadow-lg">
                         ELBO Loss
                       </motion.div>
                       <svg className="absolute w-32 h-64 -left-32 top-1/2 transform -translate-y-1/2 pointer-events-none">
                         <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} d="M 120 160 C 80 160, 40 250, 0 250" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4"/>
                         <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} d="M 120 160 C 80 160, 40 100, 0 100" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4"/>
                       </svg>
                     </div>
                   )}
                 </div>

                 <div className="mt-20 text-center max-w-lg mx-auto">
                   {step === 'forward' ? (
                     <p className="text-sm text-slate-600 bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm">
                       <strong className="text-blue-800">Unrolling the Computational Graph:</strong> During the forward pass, PyTorch builds a map of operations in memory. It literally records that <span className="font-mono bg-blue-100 px-1">Net f₂</span> required the output of <span className="font-mono bg-blue-100 px-1">z₁</span> to execute.
                     </p>
                   ) : (
                     <p className="text-sm text-rose-900 bg-rose-50 border border-rose-200 p-4 rounded-lg shadow-sm">
                       <strong className="text-rose-700">The Chain Rule in Action:</strong> Backprop flows backwards through the graph. The error from <span className="font-mono">z₂</span> flows into <span className="font-mono">Net f₂</span>, and then <strong>splits</strong>, flowing backwards over the dependency wire directly into <span className="font-mono">z₁</span>.
                     </p>
                   )}
                 </div>
               </motion.div>
             )}

             {step === 'masking' && (
               <motion.div key="masking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col items-center justify-center relative">
                  
                  <h3 className="text-emerald-700 font-bold mb-6 text-center text-sm uppercase tracking-widest">How to train without a slow loop</h3>

                  <div className="flex items-center gap-4 font-mono text-xs md:text-sm">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-slate-500 mb-2">Input (x)</span>
                      <div className="flex flex-col gap-1 bg-slate-100 p-2 rounded border border-slate-300">
                        <div className="w-8 h-8 bg-blue-100 flex items-center justify-center rounded">x₁</div>
                        <div className="w-8 h-8 bg-blue-100 flex items-center justify-center rounded">x₂</div>
                        <div className="w-8 h-8 bg-blue-100 flex items-center justify-center rounded">x₃</div>
                      </div>
                    </div>

                    <span className="text-xl font-bold text-slate-400">×</span>

                    <div className="flex flex-col items-center relative">
                      <span className="font-bold text-slate-500 mb-2">Weights (W)</span>
                      <div className="grid grid-cols-3 gap-1 bg-slate-100 p-2 rounded border border-slate-300">
                        <div className="w-8 h-8 bg-blue-300 flex items-center justify-center rounded">w₁₁</div>
                        <div className="w-8 h-8 bg-blue-300 flex items-center justify-center rounded">w₁₂</div>
                        <div className="w-8 h-8 bg-blue-300 flex items-center justify-center rounded">w₁₃</div>
                        <div className="w-8 h-8 bg-blue-300 flex items-center justify-center rounded">w₂₁</div>
                        <div className="w-8 h-8 bg-blue-300 flex items-center justify-center rounded">w₂₂</div>
                        <div className="w-8 h-8 bg-blue-300 flex items-center justify-center rounded">w₂₃</div>
                        <div className="w-8 h-8 bg-blue-300 flex items-center justify-center rounded">w₃₁</div>
                        <div className="w-8 h-8 bg-blue-300 flex items-center justify-center rounded">w₃₂</div>
                        <div className="w-8 h-8 bg-blue-300 flex items-center justify-center rounded">w₃₃</div>
                      </div>
                      <div className="absolute -top-6 -right-6 bg-slate-800 text-white text-[9px] px-2 py-1 rounded shadow-lg transform rotate-6">Standard Matrix<br/>(Parallel)</div>
                    </div>

                    <span className="text-xl font-bold text-slate-400">⊙</span>

                    <div className="flex flex-col items-center relative">
                      <span className="font-bold text-emerald-600 mb-2">Mask (M)</span>
                      <div className="grid grid-cols-3 gap-1 bg-emerald-50 p-2 rounded border border-emerald-300 relative z-10">
                        <div className="w-8 h-8 bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center rounded border border-emerald-400">1</div>
                        <div className="w-8 h-8 bg-rose-200 text-rose-800 font-bold flex items-center justify-center rounded border-2 border-rose-500 opacity-60">0</div>
                        <div className="w-8 h-8 bg-rose-200 text-rose-800 font-bold flex items-center justify-center rounded border-2 border-rose-500 opacity-60">0</div>
                        <div className="w-8 h-8 bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center rounded border border-emerald-400">1</div>
                        <div className="w-8 h-8 bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center rounded border border-emerald-400">1</div>
                        <div className="w-8 h-8 bg-rose-200 text-rose-800 font-bold flex items-center justify-center rounded border-2 border-rose-500 opacity-60">0</div>
                        <div className="w-8 h-8 bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center rounded border border-emerald-400">1</div>
                        <div className="w-8 h-8 bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center rounded border border-emerald-400">1</div>
                        <div className="w-8 h-8 bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center rounded border border-emerald-400">1</div>
                      </div>
                      <div className="absolute -top-4 -right-16 bg-emerald-600 text-white text-[9px] px-2 py-1 rounded shadow-lg transform -rotate-3 z-20">Severed Connections</div>
                    </div>

                    <span className="text-xl font-bold text-slate-400">=</span>

                    <div className="flex flex-col items-center">
                      <span className="font-bold text-indigo-600 mb-2">Output (z)</span>
                      <div className="flex flex-col gap-1 bg-indigo-50 p-2 rounded border border-indigo-200">
                        <div className="w-[100px] h-8 bg-indigo-100 flex flex-col items-center justify-center rounded leading-tight">
                           <span className="font-bold text-indigo-700">z₁</span>
                           <span className="text-[8px] text-indigo-500">Sees only x₁</span>
                        </div>
                        <div className="w-[100px] h-8 bg-indigo-100 flex flex-col items-center justify-center rounded leading-tight">
                           <span className="font-bold text-indigo-700">z₂</span>
                           <span className="text-[8px] text-indigo-500">Sees x₁, x₂</span>
                        </div>
                        <div className="w-[100px] h-8 bg-indigo-100 flex flex-col items-center justify-center rounded leading-tight">
                           <span className="font-bold text-indigo-700">z₃</span>
                           <span className="text-[8px] text-indigo-500">Sees all prior</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  <p className="text-sm text-slate-600 bg-emerald-50 border border-emerald-200 p-4 rounded-lg mt-8 text-center max-w-lg shadow-sm">
                    <strong>The MADE architecture:</strong> To solve the slow `for` loop during training, we construct standard parallel layers, but multiply the weights by a binary <strong>Mask</strong>.<br/><br/>
                    The zeroes physically sever the neural connections to "future" variables, forcing the neural network to act autoregressively in one fast, parallel matrix multiplication step!
                  </p>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        <div className="flex-1 flex flex-col gap-4">
           <div className={`p-6 rounded-2xl shadow-lg border h-full flex flex-col justify-center transition-colors ${
             step === 'forward' ? 'bg-blue-900 border-blue-700 text-white' : 
             step === 'backward' ? 'bg-rose-900 border-rose-700 text-white' : 'bg-emerald-900 border-emerald-700 text-white'
           }`}>
             {step === 'forward' && (
               <>
                 <h4 className="font-bold text-blue-300 text-xl mb-4 flex items-center gap-2"><ArrowRight className="w-5 h-5"/> Sequential Forward Pass</h4>
                 <p className="text-sm text-blue-100 leading-relaxed mb-4">
                   When <em>generating</em> new data, the network is physically bottlenecked. It must calculate <span className="font-mono bg-blue-800 px-1 rounded">μ₁</span>, sample <span className="font-mono bg-blue-800 px-1 rounded">z₁</span>, feed it into the next layer to get <span className="font-mono bg-blue-800 px-1 rounded">μ₂</span>, and so on.
                 </p>
                 <p className="text-sm text-blue-200 font-semibold bg-blue-950 p-3 rounded-lg border border-blue-800 shadow-inner">
                   This creates a literal chain of mathematical operations in PyTorch's memory.
                 </p>
               </>
             )}

             {step === 'backward' && (
               <>
                 <h4 className="font-bold text-rose-300 text-xl mb-4 flex items-center gap-2"><Rewind className="w-5 h-5"/> Backpropagation Chain Rule</h4>
                 <p className="text-sm text-rose-100 leading-relaxed mb-4">
                   Because the Reparameterization Trick allows gradients to pass through sampling, the backprop engine just follows the chain backward.
                 </p>
                 <p className="text-sm text-rose-200 font-semibold bg-rose-950 p-3 rounded-lg border border-rose-800 shadow-inner">
                   The parameters for <span className="font-mono">z₁</span> are updated to minimize the reconstruction error of <span className="font-mono">z₁</span> <strong>PLUS</strong> the error of <span className="font-mono">z₂</span>, because <span className="font-mono">z₁</span> helped create <span className="font-mono">z₂</span>!
                 </p>
               </>
             )}

             {step === 'masking' && (
               <>
                 <h4 className="font-bold text-emerald-300 text-xl mb-4 flex items-center gap-2"><Grid className="w-5 h-5"/> Parallel Training (MADE)</h4>
                 <p className="text-sm text-emerald-100 leading-relaxed mb-4">
                   During training, we already have the target sequence. Instead of a slow loop, we use standard Matrix Multiplications (just like in CNNs). 
                 </p>
                 <p className="text-sm text-emerald-200 font-semibold bg-emerald-950 p-3 rounded-lg border border-emerald-800 shadow-inner">
                   By zeroing out the upper triangle of the Weight matrix, we physically blind Output 2 from seeing Input 3. It calculates the likelihood of the entire sequence instantly in parallel!
                 </p>
               </>
             )}
           </div>
        </div>

      </div>
    </div>
  );
};


// --- SLIDE 4: How Covariance is Injected (The Sandbox) ---
const CovarianceInjectionSlide = () => {
  const [z1Value, setZ1Value] = useState(0); 
  
  const z2Mean = 0.8 * z1Value; 
  const z2StdDev = 0.7; 

  const plotSize = 280;
  const scale = plotSize / 6; 
  const center = plotSize / 2;

  const curvePoints = [];
  for(let y = -3; y <= 3; y += 0.1) {
    const probability = Math.exp(-0.5 * Math.pow((y - z2Mean)/z2StdDev, 2));
    const plotY = center - (y * scale);
    const plotX = center + (z1Value * scale) + (probability * 60); 
    curvePoints.push(`${plotX},${plotY}`);
  }

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-indigo-600 mb-2 text-center">Visualizing the Injection</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          How exactly does feeding <span className="font-mono">z₁</span> into the second network create covariance? 
          Move the slider to sample a different <span className="font-mono">z₁</span> and watch what happens to the mean of <span className="font-mono">z₂</span>.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 flex-grow w-full max-w-6xl mx-auto pb-8">
        
        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex flex-col justify-center">
          
          <div className="bg-slate-900 p-4 rounded-xl text-white shadow-inner mb-6 relative">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">The Neural Network Formula:</h3>
            <div className="flex items-center gap-4 justify-center font-mono">
               <span className="text-indigo-400">μ₂</span>
               <span>=</span>
               <span className="text-emerald-400">f₂(x, z₁)</span>
               <span>=</span>
               <span className="bg-slate-800 px-2 py-1 rounded">0.8 * <span className="text-amber-400">{z1Value.toFixed(2)}</span></span>
               <span>=</span>
               <span className="text-indigo-400 font-bold bg-indigo-500/20 px-2 py-1 rounded">{z2Mean.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-3 text-center">
              (For simplicity, we assume the network f₂ learned a linear weight of 0.8 for z₁)
            </p>
          </div>

          <div className="w-full">
            <label className="flex justify-between text-sm font-bold text-slate-700 mb-3">
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-400 rounded-full"></div> 1. Sample Z₁ (Independent)</span>
              <span className="font-mono text-amber-600 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded">{z1Value.toFixed(2)}</span>
            </label>
            <input 
              type="range" min="-2.5" max="2.5" step="0.1" 
              value={z1Value} onChange={(e) => setZ1Value(parseFloat(e.target.value))} 
              className="w-full accent-amber-500 mb-2 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
            />
            <p className="text-xs text-slate-500 text-center">Drag to change the value of z₁</p>
          </div>
        </div>

        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex flex-col items-center">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">The Resulting Latent Space</h3>
          
          <div className="relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner" style={{ width: plotSize, height: plotSize }}>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            <line x1={0} y1={center} x2={plotSize} y2={center} stroke="#94a3b8" strokeWidth="2" className="absolute inset-0" />
            <line x1={center} y1={0} x2={center} y2={plotSize} stroke="#94a3b8" strokeWidth="2" className="absolute inset-0" />
            <span className="absolute bottom-2 right-2 text-xs font-bold text-slate-500">Z₁</span>
            <span className="absolute top-2 left-2 text-xs font-bold text-slate-500">Z₂</span>

            <div 
              className="absolute w-24 h-64 bg-indigo-500/10 rounded-[100%] blur-md border border-indigo-500/20"
              style={{
                left: '50%', top: '50%',
                transform: `translate(-50%, -50%) rotate(38deg)`
              }}
            />
            <span className="absolute bottom-4 left-4 text-[9px] font-bold text-indigo-400 bg-white/80 px-1 rounded">Overall Joint Probability</span>

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line 
                x1={center + (z1Value * scale)} y1={0} 
                x2={center + (z1Value * scale)} y2={plotSize} 
                stroke="#fbbf24" strokeWidth="2" strokeDasharray="4"
              />
              <polyline fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2" points={`${center + (z1Value * scale)},${plotSize} ${curvePoints.join(' ')} ${center + (z1Value * scale)},0`} />
              <circle cx={center + (z1Value * scale)} cy={center - (z2Mean * scale)} r="6" fill="#4f46e5" className="shadow-lg" />
              <line 
                x1={center} y1={center - (z2Mean * scale)} 
                x2={center + (z1Value * scale)} y2={center - (z2Mean * scale)} 
                stroke="#6366f1" strokeWidth="1.5" strokeDasharray="2"
              />
            </svg>
          </div>

          <p className="text-sm text-indigo-800 mt-6 bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-center">
            <strong>Look at the blue dot (μ₂).</strong> Because the formula explicitly calculates μ₂ using z₁, as you move z₁ right, μ₂ goes up. This physical, sequential dependency draws a tilted, correlated distribution!
          </p>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 5: Deconstructing the Math Formula ---
const FormulaBreakdownSlide = () => {
  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-900 text-slate-200">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Decoding the Giant Formula</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          In your screenshot, there is a large, intimidating formula with a <span className="font-mono bg-slate-800 px-1 rounded text-white text-lg">∏</span> (Product) symbol. Let's translate it into plain English.
        </p>
      </div>

      <div className="flex flex-col items-center max-w-4xl mx-auto w-full flex-grow pb-8 gap-8">
        
        <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-8 shadow-2xl w-full flex flex-col items-center justify-center relative">
           
           <div className="flex items-center gap-3 font-mono text-2xl md:text-3xl lg:text-4xl">
              <span className="text-white">q_φ(z|x)</span>
              <span className="text-white">=</span>
              
              <div className="relative group cursor-help">
                <span className="text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/30">q_φ(z₁|x)</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white text-slate-900 text-xs w-48 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-xl border-t-4 border-amber-400">
                  <strong className="block text-amber-600 mb-1">The First Step</strong>
                  Sample z₁ normally, looking ONLY at the image x. Just like a standard VAE.
                </div>
              </div>

              <div className="relative group cursor-help flex items-center mx-2">
                <span className="text-rose-400 text-5xl font-light">∏</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white text-slate-900 text-xs w-48 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-xl border-t-4 border-rose-400">
                  <strong className="block text-rose-600 mb-1">The Multiplier Loop</strong>
                  This just means "multiply the following thing in a loop, from variable 2 up to D."
                </div>
              </div>

              <div className="relative group cursor-help">
                <span className="text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded border border-indigo-400/30">q_φ(z_j | z_&lt;j, x)</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white text-slate-900 text-xs w-64 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-xl border-t-4 border-indigo-500">
                  <strong className="block text-indigo-600 mb-1">The Autoregressive Part</strong>
                  For the current variable (j), look at the image (x) AND <strong>every single variable sampled before it (z_&lt;j)</strong> to calculate its mean and variance.
                </div>
              </div>
           </div>

           <p className="mt-8 text-sm text-slate-400 animate-pulse">Hover over each part of the formula to translate it.</p>
        </div>

        <div className="bg-rose-900/30 border border-rose-500/50 p-6 rounded-xl w-full flex items-start gap-4 shadow-inner">
           <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0 mt-1" />
           <div>
             <h4 className="text-lg font-bold text-rose-300 mb-2">The Hidden Cost: Sequential Sampling</h4>
             <p className="text-sm text-rose-200/80 leading-relaxed mb-3">
               Because of the <span className="font-mono text-indigo-300 bg-indigo-900/50 px-1 rounded">| z_&lt;j</span> part, you <strong>cannot</strong> calculate variable 100 until you have finished calculating variable 99. 
             </p>
             <p className="text-sm text-rose-200/80 leading-relaxed">
               A standard VAE calculates all 100 dimensions instantly in parallel on the GPU. Autoregressive models force a slow, sequential loop. This is why the screenshot mentions it can be "slow if D is large."
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 6: Normalizing Flows ---
const NormalizingFlowsSlide = () => {
  const [flowStep, setFlowStep] = useState(0); 
  
  const gridSize = 10;
  const gridPoints = [];
  for (let x = -gridSize; x <= gridSize; x += 2) {
    for (let y = -gridSize; y <= gridSize; y += 2) {
      gridPoints.push({ x, y });
    }
  }

  const getTransform = (x, y) => {
    let nx = x;
    let ny = y;
    
    if (flowStep >= 1) {
      nx = x + 0.5 * y; 
      ny = y;
    }
    if (flowStep >= 2) {
      const r = Math.sqrt(nx*nx + ny*ny);
      const theta = Math.atan2(ny, nx) + (r * 0.1); 
      nx = r * Math.cos(theta);
      ny = r * Math.sin(theta) * 1.5; 
    }
    return { nx, ny };
  };

  const jacobianExplainer = [
    "Determinant = 1.0 (Base area)",
    "Determinant = 1.0 (Shear doesn't change total area volume!)",
    "Determinant ≠ 1.0 (Non-linear stretch dilutes the density)"
  ];

  return (
    <div className="flex flex-col h-full p-6 md:p-10 overflow-y-auto">
      <h2 className="text-3xl font-bold text-teal-600 mb-4 text-center shrink-0">Normalizing Flows (Visualized)</h2>
      <p className="text-gray-600 mb-8 text-center max-w-4xl mx-auto shrink-0 text-sm md:text-base">
        A Normalizing Flow takes a simple distribution and repeatedly pushes it through mathematical functions (<span className="font-mono">f₁, f₂...</span>) to warp it like putty into a complex shape.
      </p>

      <div className="flex flex-col lg:flex-row justify-center items-center gap-12 flex-grow w-full max-w-5xl mx-auto">
        
        <div className="flex-1 flex flex-col items-center w-full">
           <div className="w-72 h-72 bg-slate-50 border-2 border-slate-200 rounded-xl relative overflow-hidden shadow-inner flex items-center justify-center">
             
             <div className="absolute w-2 h-2 bg-red-500 rounded-full z-20"></div>

             <div className="relative" style={{ width: '100%', height: '100%' }}>
               {gridPoints.map((pt, i) => {
                 const { nx, ny } = getTransform(pt.x, pt.y);
                 const dist = Math.sqrt(pt.x*pt.x + pt.y*pt.y);
                 const opacity = Math.max(0, 1 - (dist / (gridSize * 1.2)));

                 return (
                   <motion.div
                     key={i}
                     initial={false}
                     animate={{
                       x: (nx * 10), 
                       y: (ny * 10)
                     }}
                     transition={{ type: "spring", stiffness: 60, damping: 12 }}
                     className="absolute w-3 h-3 bg-teal-500 rounded-full shadow-sm"
                     style={{
                       left: '50%', top: '50%',
                       marginLeft: -6, marginTop: -6, 
                       opacity: opacity
                     }}
                   />
                 )
               })}
             </div>
           </div>

           <div className="flex gap-2 mt-6">
             <button onClick={() => setFlowStep(0)} className={`px-4 py-2 rounded font-bold text-sm transition-colors ${flowStep === 0 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Base q₀(u)</button>
             <button onClick={() => setFlowStep(1)} className={`px-4 py-2 rounded font-bold text-sm transition-colors ${flowStep === 1 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Apply f₁</button>
             <button onClick={() => setFlowStep(2)} className={`px-4 py-2 rounded font-bold text-sm transition-colors ${flowStep === 2 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Apply f₂</button>
           </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 w-full">
           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
             <h3 className="font-bold text-teal-800 text-lg mb-4">The Change of Variables Formula</h3>
             
             <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-inner flex flex-col items-center mb-6">
                <span className="font-mono text-teal-300 text-sm md:text-base text-center">
                  q(z|x) = q₀(u) × |det( ∂f / ∂u )|⁻¹
                </span>
             </div>

             <div className="space-y-4">
                <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-700 shrink-0">1</div>
                   <div>
                     <strong className="text-gray-800 text-sm block">Transforming the Points (f)</strong>
                     <p className="text-xs text-gray-600 mt-1">We literally calculate new coordinates for our sample. <span className="font-mono bg-gray-100 px-1">z = f(u)</span>.</p>
                   </div>
                </div>
                
                <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-700 shrink-0">2</div>
                   <div>
                     <strong className="text-gray-800 text-sm block">Adjusting the Density (Jacobian)</strong>
                     <p className="text-xs text-gray-600 mt-1">
                       If <span className="font-mono">f</span> stretches the grid, the dots get further apart. Because probability must sum to 1, stretching a region means the <em>density</em> in that region must drop.
                     </p>
                   </div>
                </div>
             </div>

             <motion.div 
               key={flowStep}
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
               className="mt-6 bg-teal-50 border-l-4 border-teal-500 p-3 rounded-r text-sm text-teal-900 font-mono"
             >
               {jacobianExplainer[flowStep]}
             </motion.div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 7: Trade-offs ---
const TradeoffsSlide = () => {
  return (
    <div className="flex flex-col h-full p-6 md:p-10 overflow-y-auto bg-slate-50">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center shrink-0">When to use Structured Inference?</h2>
      
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto flex-grow items-stretch">
        
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border-t-8 border-green-500 flex flex-col">
          <h3 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2"><CheckCircle className="w-6 h-6"/> The Benefits</h3>
          
          <ul className="space-y-6 flex-grow">
            <li className="flex gap-4 items-start">
              <div className="bg-green-100 p-2 rounded text-green-600 shrink-0"><Scaling className="w-5 h-5"/></div>
              <div>
                <strong className="text-gray-800 block text-lg">Tighter ELBO (Better Fit)</strong>
                <p className="text-gray-600 text-sm mt-1">Because the shape can bend and tilt, the approximation <span className="font-mono bg-gray-100 px-1">q(z|x)</span> fits the true posterior much closer, reducing the Amortization Gap.</p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <div className="bg-green-100 p-2 rounded text-green-600 shrink-0"><Grid className="w-5 h-5"/></div>
              <div>
                <strong className="text-gray-800 block text-lg">Sharper Generated Samples</strong>
                <p className="text-gray-600 text-sm mt-1">Mean-field VAEs often produce blurry images because their independent boxes average out intricate details. Structured posteriors preserve these correlated details.</p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <div className="bg-green-100 p-2 rounded text-green-600 shrink-0"><Database className="w-5 h-5"/></div>
              <div>
                <strong className="text-gray-800 block text-lg">Richer Representations</strong>
                <p className="text-gray-600 text-sm mt-1">The latent space captures the true data manifold more accurately, making it more useful for downstream tasks.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border-t-8 border-red-500 flex flex-col">
          <h3 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-2"><AlertTriangle className="w-6 h-6"/> The Costs</h3>
          
          <ul className="space-y-6 flex-grow">
            <li className="flex gap-4 items-start">
              <div className="bg-red-100 p-2 rounded text-red-600 shrink-0"><Zap className="w-5 h-5"/></div>
              <div>
                <strong className="text-gray-800 block text-lg">Computational Complexity</strong>
                <p className="text-gray-600 text-sm mt-1">Calculating Jacobian determinants (for flows) requires clever mathematical engineering to not freeze the GPU. Architectures like RealNVP are explicitly designed to keep this fast.</p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <div className="bg-red-100 p-2 rounded text-red-600 shrink-0"><Settings className="w-5 h-5"/></div>
              <div>
                <strong className="text-gray-800 block text-lg">Sequential Inference Speed</strong>
                <p className="text-gray-600 text-sm mt-1">Standard autoregressive models cannot be parallelized during sampling. (Though advanced tricks like <em>Inverse Autoregressive Flows (IAF)</em> solve this!).</p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <div className="bg-red-100 p-2 rounded text-red-600 shrink-0"><Variable className="w-5 h-5"/></div>
              <div>
                <strong className="text-gray-800 block text-lg">KL Divergence Math</strong>
                <p className="text-gray-600 text-sm mt-1">With a standard Gaussian, the KL Divergence is a simple closed-form equation. With complex flows, we often lose that analytical equation and have to estimate it via sampling.</p>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 8: When to Consider Structured Inference ---
const WhenToUseSlide = () => {
  return (
    <div className="flex flex-col h-full p-6 md:p-10 overflow-y-auto bg-slate-50">
      <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center shrink-0">When to Consider Structured Inference</h2>
      <p className="text-slate-600 mb-8 text-center max-w-4xl mx-auto shrink-0 text-sm md:text-base">
        While introducing structure adds complexity, the potential gains in model expressiveness and performance often justify the overhead. Here is when you should make the switch:
      </p>

      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto flex-grow pb-8">
        
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-blue-500 flex items-start gap-6 hover:-translate-y-1 transition-transform">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">1. Strong Suspected Correlations</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              You suspect strong correlations or dependencies exist among the true latent factors of variation in your data. A standard mean-field VAE is mathematically incapable of capturing these complex dependencies.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-purple-500 flex items-start gap-6 hover:-translate-y-1 transition-transform">
          <div className="bg-purple-100 p-3 rounded-full text-purple-600 shrink-0">
            <ImageOff className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">2. Unsatisfactory Standard Results</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Standard VAEs yield overly smooth or blurry generated samples, or low likelihoods. If you hypothesize that the inference network itself is the bottleneck preventing sharper details, structured inference helps close that "Amortization Gap."
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-emerald-500 flex items-start gap-6 hover:-translate-y-1 transition-transform">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">3. Direct Interest in Latent Variables</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              The application demands highly accurate posterior inference. For instance, in scenarios where you aren't just generating data, but the <em>latent variables themselves</em> are objects of direct interest (e.g., representation learning, downstream classification, or anomaly detection).
            </p>
          </div>
        </div>
        
        <div className="mt-4 bg-slate-800 text-slate-200 p-6 rounded-xl shadow-lg flex items-center gap-4 border border-slate-700">
           <Lightbulb className="w-8 h-8 text-yellow-400 shrink-0" />
           <p className="text-sm leading-relaxed">
             <strong>The Takeaway:</strong> Techniques like autoregressive models and normalizing flows for <span className="font-mono text-xs bg-slate-700 px-1 rounded text-white border border-slate-600">q_φ(z|x)</span> are foundational for building more sophisticated and powerful VAEs, pushing beyond the restrictive limits of basic Mean-Field models.
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
    TopologiesSlide,
    ArchitectureSlide,
    AutoregressiveTrainingSlide,
    CovarianceInjectionSlide,
    FormulaBreakdownSlide,
    NormalizingFlowsSlide,
    TradeoffsSlide,
    WhenToUseSlide
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="flex flex-col min-h-full bg-slate-50 font-sans">
      
      {/* Top Blue Progress Bar */}
      <div className="w-full h-2 bg-gray-200 shrink-0">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="h-full"
          >
            <CurrentSlideComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center p-6 bg-white shadow-md z-10 border-t border-gray-200 shrink-0">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-gray-100 text-blue-600 hover:bg-blue-50 shadow-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex space-x-3">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-blue-600 scale-125' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={currentSlide === slides.length - 1}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export const meta = {
  title: "Structured Variational Inference",
  subtitle: "Visualizing Autoregressive dependencies, training, and math."
};

export default function App() {
  return (
    <Slideshow />
  );
}