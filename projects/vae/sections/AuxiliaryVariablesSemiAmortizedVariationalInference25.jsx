import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Target, Activity, 
  ArrowRight, ArrowDown, Database, Zap, 
  Settings, CheckCircle, AlertTriangle, Play,
  RotateCcw, Network, FastForward, Sliders,
  BarChart, Maximize, Cpu, Layers, Grid, 
  Scaling, Variable, Info, BrainCircuit, 
  Box, SplitSquareHorizontal, ShieldAlert, Code,
  Unlink, Lock, TerminalSquare, Unlock
} from 'lucide-react';

// ==========================================
// PART 1: AUXILIARY VARIABLES
// ==========================================

const BottleneckSlide = () => {
  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The Bottleneck of Standard Inference</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Standard amortized inference uses a simple distribution (like a diagonal Gaussian) for <span className="font-mono bg-slate-200 px-1 rounded">q_φ(z|x)</span>. This simplicity is a massive bottleneck when the True Posterior is complex.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto items-stretch flex-grow pb-8">
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">The Mismatch</h3>
          
          <div className="relative w-64 h-64 bg-slate-100 rounded-xl border border-slate-300 shadow-inner overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:20px_20px]"></div>
             <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 100 100">
               <path d="M 20 80 Q 50 20 80 80 Q 50 50 20 80" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="2" />
               <text x="50" y="85" fontSize="6" fill="#047857" fontWeight="bold" textAnchor="middle">True p(z|x)</text>
             </svg>
             <div className="absolute w-32 h-32 bg-rose-500/20 border-2 border-dashed border-rose-500 rounded-full z-20 flex items-center justify-center">
               <span className="text-[10px] font-bold text-rose-700 bg-white/80 px-1 rounded">Simple q(z|x)</span>
             </div>
          </div>

          <p className="text-sm text-slate-600 mt-6 text-center leading-relaxed">
            A single Gaussian oval physically cannot bend to fit a crescent or multimodal shape. It forces a poor approximation.
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-6 justify-center">
          <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-white h-full flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <Layers className="w-6 h-6" /> Augmenting with Auxiliary Variables
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4 text-sm">
              To enhance flexibility <em>without</em> making the direct functional form overly complex, we introduce <strong>Auxiliary Random Variables (<span className="font-mono text-amber-300">a</span>)</strong>.
            </p>
            <div className="bg-slate-900/80 border-l-4 border-amber-400 p-4 rounded text-sm text-slate-200 shadow-inner mb-4">
              These variables are <strong>NOT</strong> part of the original generative model <span className="font-mono">p_θ(x|z)</span>. The Decoder never sees them. 
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">
              They are used <em>exclusively</em> inside the Inference Network (Encoder) to act as "Steering Wheels". They help shape a much richer, complex distribution for <span className="font-mono">z</span> before handing it off.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuxiliaryArchitectureSlide = () => {
  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-900 text-slate-200">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">The Hierarchical Factorization</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Instead of defining <span className="font-mono">q_φ(z|x)</span> directly, we define a <strong>joint distribution</strong> over both the latent variables <span className="font-mono">z</span> and the auxiliary variables <span className="font-mono text-amber-300">a</span>.
        </p>
      </div>

      <div className="flex flex-col items-center max-w-4xl mx-auto w-full flex-grow pb-8">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-600 shadow-lg mb-8 flex items-center gap-4 text-lg md:text-xl font-mono">
           <span className="text-blue-300">q_φ(z, a | x)</span>
           <span className="text-slate-500">=</span>
           <span className="text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded border border-emerald-800">q_φ(z | x, a)</span>
           <span className="text-amber-400 bg-amber-900/30 px-2 py-1 rounded border border-amber-800">q_φ(a | x)</span>
        </div>

        <div className="relative w-full max-w-2xl bg-slate-100 rounded-2xl p-10 border-4 border-slate-300 shadow-2xl flex flex-col items-center">
          <div className="bg-sky-300 text-sky-900 font-bold px-8 py-3 rounded-lg shadow-md z-10 border-2 border-sky-400 mb-8">
            Input Image (x)
          </div>

          <div className="relative w-full h-16 flex justify-center mb-8">
            <svg className="absolute inset-0 w-full h-full">
               <defs>
                 <marker id="arrow-aux" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                   <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                 </marker>
               </defs>
               <path d="M 50% 0 L 50% 100" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-aux)" />
               <path d="M 50% 0 Q 80% 40 85% 150" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4" markerEnd="url(#arrow-aux)" />
            </svg>
          </div>

          <div className="bg-amber-100 border-2 border-amber-400 p-6 rounded-xl flex flex-col items-center w-64 shadow-md z-10 mb-8 relative">
            <div className="absolute -left-32 top-1/2 -translate-y-1/2 text-right hidden sm:block">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Step 1</span>
              <span className="block text-sm text-slate-700">Predict Aux Vars</span>
            </div>
            <span className="font-bold text-amber-900 mb-2">Inference Net 1</span>
            <span className="font-mono text-sm bg-white px-2 py-1 rounded text-amber-700">q_φ(a | x)</span>
            <ArrowDown className="w-5 h-5 text-amber-500 my-2" />
            <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center font-bold text-white shadow-inner">a</div>
          </div>

          <div className="relative w-full h-12 flex justify-center mb-8">
            <svg className="absolute inset-0 w-full h-full">
               <path d="M 50% 0 L 50% 100" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-aux)" />
            </svg>
          </div>

          <div className="bg-emerald-100 border-2 border-emerald-400 p-6 rounded-xl flex flex-col items-center w-72 shadow-md z-10 relative">
             <div className="absolute -left-32 top-1/2 -translate-y-1/2 text-right hidden sm:block">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Step 2</span>
              <span className="block text-sm text-slate-700">Predict Final z</span>
            </div>
            <div className="absolute -right-8 top-0 flex gap-1">
               <span className="bg-sky-200 text-sky-800 text-[10px] font-bold px-2 py-1 rounded shadow">x</span>
               <span className="bg-amber-200 text-amber-800 text-[10px] font-bold px-2 py-1 rounded shadow">a</span>
            </div>
            <span className="font-bold text-emerald-900 mb-2">Inference Net 2</span>
            <span className="font-mono text-sm bg-white px-2 py-1 rounded text-emerald-700">q_φ(z | x, a)</span>
            <ArrowDown className="w-5 h-5 text-emerald-500 my-2" />
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-white shadow-inner">z</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarginalizationSandboxSlide = () => {
  const [isIntegrating, setIsIntegrating] = useState(false);
  const [aValue, setAValue] = useState(0); 

  const zShift = aValue * 25; 

  useEffect(() => {
    let interval;
    if (isIntegrating) {
      let step = -2.5;
      interval = setInterval(() => {
        setAValue(step);
        step += 0.2;
        if (step > 2.6) {
          setIsIntegrating(false);
          setAValue(0);
        }
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isIntegrating]);

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-emerald-600 mb-2 text-center">Marginalization: The Magic "Steering Wheel"</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          To get the final distribution of <span className="font-mono">z</span>, we integrate out the auxiliary variable <span className="font-mono">a</span>.
          <br/> <span className="font-mono font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded mt-2 inline-block">q(z|x) = ∫ q(z|x, a) q(a|x) da</span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 flex-grow w-full max-w-6xl mx-auto pb-8">
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex flex-col justify-center">
          <div className="bg-slate-800 p-6 rounded-xl text-white shadow-inner mb-8">
            <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
               <SplitSquareHorizontal className="w-5 h-5"/> What does this mean?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Think of <span className="font-mono text-amber-300">a</span> as a "steering wheel". <br/><br/>
              For every possible value of <span className="font-mono text-amber-300">a</span>, it shifts and squishes the simple Gaussian <span className="font-mono text-emerald-300">q(z|x,a)</span>. When we calculate the Integral, we are literally <strong>summing up all these shifted Gaussians</strong> to create the final, highly complex shape!
            </p>
          </div>

          <div className="w-full bg-slate-50 p-6 rounded-xl border border-slate-200">
            <label className="flex justify-between text-sm font-bold text-slate-700 mb-4">
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-400 rounded-full"></div> Move Auxiliary Variable 'a'</span>
              <span className="font-mono text-amber-600 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded">{aValue.toFixed(1)}</span>
            </label>
            <input 
              type="range" min="-2.5" max="2.5" step="0.1" 
              value={aValue} onChange={(e) => {setAValue(parseFloat(e.target.value)); setIsIntegrating(false);}} 
              className="w-full accent-amber-500 mb-6" 
              disabled={isIntegrating}
            />
            
            <button 
              onClick={() => setIsIntegrating(true)} disabled={isIntegrating}
              className="w-full py-3 bg-emerald-500 text-white font-bold rounded-lg shadow hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isIntegrating ? <Activity className="w-5 h-5 animate-spin"/> : <Play className="w-5 h-5"/>} 
              {isIntegrating ? "Integrating over 'a'..." : "Visualize Integral (Sum all a)"}
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex flex-col items-center relative overflow-hidden">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">The Latent Space of Z</h3>
          
          <div className="relative w-full h-64 bg-slate-50 border border-slate-300 rounded-xl flex items-end justify-center pb-4 shadow-inner overflow-hidden">
            <svg className="absolute bottom-4 left-0 w-full h-40 pointer-events-none opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0,100 Q15,100 20,40 T30,20 T40,60 T50,80 T60,30 T70,10 T80,50 T90,100 Z" fill="#10b981" />
            </svg>
            
            {isIntegrating && (
              <span className="absolute top-2 right-2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded border border-emerald-300 animate-pulse">
                Resulting Marginal q(z|x)
              </span>
            )}

            <AnimatePresence>
              {isIntegrating && Array.from({length: 10}).map((_, i) => (
                <motion.div 
                  key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} exit={{ opacity: 0 }}
                  className="w-16 h-24 bg-amber-500/20 border border-amber-500 rounded-[100%] absolute bottom-4"
                  style={{ left: `calc(50% + ${(i - 5) * 20}px - 32px)` }}
                />
              ))}
            </AnimatePresence>

            <motion.div 
               className={`w-24 h-32 border-2 rounded-[100%] shadow-lg absolute bottom-4 flex items-start justify-center pt-2 ${isIntegrating ? 'bg-amber-500/40 border-amber-500' : 'bg-emerald-500/40 border-emerald-500'}`}
               animate={{ x: zShift }}
               transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
               {!isIntegrating && <span className="absolute -top-6 text-[10px] font-mono font-bold text-emerald-700 whitespace-nowrap bg-white/80 px-1 rounded">q(z | x, a)</span>}
            </motion.div>

            <div className="absolute bottom-0 w-full h-px bg-slate-300"></div>
          </div>

          <p className="text-sm text-slate-600 mt-6 text-center leading-relaxed">
            By shifting the simple green oval based on the value of <span className="font-mono text-amber-600">a</span>, we can implicitly represent a <strong>mixture of simpler distributions</strong>, creating a highly flexible true posterior!
          </p>
        </div>
      </div>
    </div>
  );
};

const TrainingImplementationSlide = () => {
  const [step, setStep] = useState(0);

  const runForwardPass = () => {
    setStep(0);
    setTimeout(() => setStep(1), 800);
    setTimeout(() => setStep(2), 1600);
    setTimeout(() => setStep(3), 2400);
  };

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-900 text-slate-200">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">How is it actually trained? (No Loops!)</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Do we run a loop to calculate the integral ∫ q(z|x, a)q(a|x)da? <strong>Absolutely not!</strong> Here is how the mathematical theory translates into actual PyTorch/TensorFlow code.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto items-stretch flex-grow pb-8">
        <div className="flex-1 flex flex-col gap-6">
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
             <h3 className="text-xl font-bold text-rose-400 mb-3 border-b border-slate-600 pb-2 flex items-center gap-2"><Network className="w-5 h-5"/> The Mathematical Theory</h3>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               The math uses an integral to describe the <em>shape</em> of the distribution: <span className="font-mono bg-slate-900 px-1 rounded">q(z|x) = ∫ q(z|x,a)q(a|x)da</span>.
             </p>
             <p className="text-sm text-slate-300 leading-relaxed">
               If we had to code this literally, it would be a disaster. We would need a giant 'for' loop to calculate thousands of values for 'a' on every single forward pass.
             </p>
           </div>

           <div className="bg-emerald-900/30 p-6 rounded-xl border border-emerald-500/50 shadow-inner">
             <h3 className="text-xl font-bold text-emerald-400 mb-3 border-b border-emerald-500/50 pb-2 flex items-center gap-2"><Code className="w-5 h-5"/> The Code Reality (Monte Carlo)</h3>
             <p className="text-sm text-emerald-100 leading-relaxed mb-4">
               We use <strong>Ancestral Sampling</strong>. Because the ELBO is wrapped in an Expected Value E_q[a,z|x], we don't need the exact integral.
             </p>
             <p className="text-sm text-emerald-200 font-bold bg-emerald-900/50 p-3 rounded border border-emerald-500/50 shadow">
               We draw exactly ONE random sample for 'a', and ONE random sample for 'z'. 
             </p>
             <p className="text-sm text-emerald-100 leading-relaxed mt-4">
               Over thousands of training epochs, stochastic gradient descent naturally "averages out" these random single samples to magically equal the true integral!
             </p>
           </div>
        </div>

        <div className="flex-[1.2] bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-600 flex flex-col items-center">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">The Forward Pass (1 Data Point)</h3>
          
          <div className="relative w-full max-w-md flex flex-col items-center flex-grow justify-center gap-6 z-10">
            <div className="w-16 h-12 bg-sky-100 text-sky-900 font-bold flex items-center justify-center rounded shadow border-2 border-sky-400">Input x</div>
            <div className="h-8 w-0.5 bg-slate-500"></div>

            <div className={`w-full max-w-sm p-4 rounded-xl border-2 transition-colors flex justify-between items-center ${step >= 1 ? 'bg-amber-100 border-amber-400' : 'bg-slate-900 border-slate-700'}`}>
              <div className="text-sm font-bold text-slate-700">Net 1: <span className="font-mono">q(a|x)</span></div>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] bg-white px-1 rounded text-slate-500 border">μ_a, σ_a</span>
                 <ArrowRight className="w-4 h-4 text-slate-400" />
                 <motion.div initial={{ scale: 0 }} animate={{ scale: step >= 1 ? 1 : 0 }} className="w-8 h-8 bg-amber-400 text-white font-bold flex items-center justify-center rounded-full shadow">a</motion.div>
              </div>
            </div>

            <div className="h-8 w-0.5 bg-slate-500 relative">
               {step >= 1 && <div className="absolute right-2 top-2 text-[10px] text-amber-400 whitespace-nowrap">Pass 'a' Down</div>}
            </div>

            <div className={`w-full max-w-sm p-4 rounded-xl border-2 transition-colors flex justify-between items-center ${step >= 2 ? 'bg-emerald-100 border-emerald-400' : 'bg-slate-900 border-slate-700'}`}>
              <div className="text-sm font-bold text-slate-700">Net 2: <span className="font-mono">q(z|x, a)</span></div>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] bg-white px-1 rounded text-slate-500 border">μ_z, σ_z</span>
                 <ArrowRight className="w-4 h-4 text-slate-400" />
                 <motion.div initial={{ scale: 0 }} animate={{ scale: step >= 2 ? 1 : 0 }} className="w-8 h-8 bg-emerald-500 text-white font-bold flex items-center justify-center rounded-full shadow">z</motion.div>
              </div>
            </div>

            <div className="h-8 w-0.5 bg-slate-500"></div>

            <div className={`w-32 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-colors border-2 ${step >= 3 ? 'bg-blue-100 border-blue-400 text-blue-800' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
              Decoder p(x|z)
            </div>
          </div>

          <button 
            onClick={runForwardPass}
            className="mt-8 w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5"/> Run One Training Step
          </button>
        </div>
      </div>
    </div>
  );
};

const AugmentedELBOSlide = () => {
  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-900 text-slate-200">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-amber-400 mb-2 text-center">Decoding the Augmented ELBO</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Because we added variables, the ELBO formula must change. Hover over the mathematical blocks to translate the nested equation from the screenshot.
        </p>
      </div>

      <div className="flex flex-col items-center max-w-5xl mx-auto w-full flex-grow pb-8 gap-8">
        <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-8 shadow-2xl w-full flex flex-col items-center justify-center relative min-h-[300px]">
           <div className="flex flex-wrap items-center justify-center gap-y-6 gap-x-2 font-mono text-xl md:text-2xl lg:text-3xl">
              <span className="text-white font-bold mr-2">L =</span>
              
              <div className="relative group cursor-help">
                <span className="text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/30">E_q(a|x)</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white text-slate-900 text-xs w-48 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-xl border-t-4 border-amber-400">
                  <strong className="block text-amber-600 mb-1">Outer Loop (Sample 'a')</strong>
                  First, use Inference Net 1 to guess the high-level "steering" variables <strong>a</strong> based on the image.
                </div>
              </div>

              <span className="text-slate-400 font-light mx-1">[</span>

              <div className="relative group cursor-help">
                <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/30">E_q(z|x,a) [ log p(x|z) ]</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white text-slate-900 text-xs w-56 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-xl border-t-4 border-emerald-400">
                  <strong className="block text-emerald-600 mb-1">Reconstruction Term</strong>
                  Given the image <strong>x</strong> AND the steering variable <strong>a</strong>, guess <strong>z</strong>. How well does that <strong>z</strong> rebuild the original image?
                </div>
              </div>

              <span className="text-white mx-2">-</span>

              <div className="relative group cursor-help">
                <span className="text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded border border-indigo-400/30">D_KL( q(z|x,a) || p(z) )</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white text-slate-900 text-xs w-64 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-xl border-t-4 border-indigo-500">
                  <strong className="block text-indigo-600 mb-1">Inner Regularization</strong>
                  Penalty: Ensure the guessed <strong>z</strong> (even when steered by <strong>a</strong>) doesn't stray too far from standard normal noise.
                </div>
              </div>

              <span className="text-slate-400 font-light mx-1">]</span>
              <span className="text-white mx-2">-</span>

              <div className="relative group cursor-help mt-4 md:mt-0">
                <span className="text-rose-400 bg-rose-400/10 px-2 py-1 rounded border border-rose-400/30">D_KL( q(a|x) || p(a) )</span>
                <div className="absolute top-full right-0 md:left-1/2 md:-translate-x-1/2 mt-4 bg-white text-slate-900 text-xs w-56 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-xl border-t-4 border-rose-500">
                  <strong className="block text-rose-600 mb-1">Outer Regularization</strong>
                  Penalty: Ensure the auxiliary variables <strong>a</strong> themselves don't become overly complex compared to their own simple prior.
                </div>
              </div>
           </div>
           <p className="mt-12 text-sm text-slate-400 animate-pulse">Hover over the blocks to decode the decomposed ELBO.</p>
        </div>

        <div className="bg-indigo-900/30 border border-indigo-500/50 p-6 rounded-xl w-full flex items-start gap-4 shadow-inner">
           <Info className="w-8 h-8 text-indigo-400 shrink-0 mt-1" />
           <div>
             <h4 className="text-lg font-bold text-indigo-300 mb-2">The Generative Model Stays Simple</h4>
             <p className="text-sm text-indigo-200/80 leading-relaxed">
               Notice that the reconstruction term <span className="font-mono text-emerald-300 bg-emerald-900/50 px-1 rounded">log p_θ(x|z)</span> doesn't contain <strong>a</strong> anywhere! The Decoder (Generative Model) is completely blind to the auxiliary variables! They exist <em>exclusively</em> inside the Encoder to help it perform complex mental gymnastics before handing the final, polished <strong>z</strong> to the Decoder.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const AuxTradeoffsSlide = () => {
  return (
    <div className="flex flex-col h-full p-6 md:p-10 overflow-y-auto bg-slate-50">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center shrink-0">Benefits, Costs & ADGMs</h2>
      
      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto flex-grow items-stretch pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
           <div className="bg-white p-8 rounded-2xl shadow-lg border-t-8 border-emerald-500">
             <h3 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2"><CheckCircle className="w-6 h-6"/> Benefits</h3>
             <ul className="space-y-6">
               <li className="flex gap-4 items-start">
                 <div className="bg-emerald-100 p-2 rounded text-emerald-600 shrink-0"><Scaling className="w-5 h-5"/></div>
                 <div>
                   <strong className="text-slate-800 block text-lg mb-1">Increased Expressiveness</strong>
                   <p className="text-slate-600 text-sm leading-relaxed">The primary benefit is a highly flexible <span className="font-mono">q(z|x)</span>, capable of better matching the true posterior without needing complex invertible math.</p>
                 </div>
               </li>
               <li className="flex gap-4 items-start">
                 <div className="bg-emerald-100 p-2 rounded text-emerald-600 shrink-0"><Target className="w-5 h-5"/></div>
                 <div>
                   <strong className="text-slate-800 block text-lg mb-1">Tighter ELBO</strong>
                   <p className="text-slate-600 text-sm leading-relaxed">A better approximation strictly leads to a tighter ELBO bound. This improves both the reconstruction quality of the decoder and the usefulness of the learned representations.</p>
                 </div>
               </li>
             </ul>
           </div>

           <div className="bg-white p-8 rounded-2xl shadow-lg border-t-8 border-rose-500">
             <h3 className="text-2xl font-bold text-rose-800 mb-6 flex items-center gap-2"><AlertTriangle className="w-6 h-6"/> Costs</h3>
             <ul className="space-y-6">
               <li className="flex gap-4 items-start">
                 <div className="bg-rose-100 p-2 rounded text-rose-600 shrink-0"><Network className="w-5 h-5"/></div>
                 <div>
                   <strong className="text-slate-800 block text-lg mb-1">Increased Complexity</strong>
                   <p className="text-slate-600 text-sm leading-relaxed">The inference network architecture becomes physically larger and more complex, involving more parameters, two distinct encoder networks, and extra computational steps.</p>
                 </div>
               </li>
               <li className="flex gap-4 items-start">
                 <div className="bg-rose-100 p-2 rounded text-rose-600 shrink-0"><Activity className="w-5 h-5"/></div>
                 <div>
                   <strong className="text-slate-800 block text-lg mb-1">Optimization Challenges</strong>
                   <p className="text-slate-600 text-sm leading-relaxed">Training these nested expectation networks and balancing the two separate KL divergence penalties can sometimes be unstable or challenging to tune.</p>
                 </div>
               </li>
             </ul>
           </div>
        </div>

        <div className="bg-slate-800 text-white p-8 rounded-2xl shadow-xl border border-slate-700 w-full mt-4 flex flex-col md:flex-row gap-6 items-center">
           <Cpu className="w-16 h-16 text-blue-400 shrink-0" />
           <div>
             <h3 className="text-xl font-bold text-blue-300 mb-2">Real-World Use: ADGMs</h3>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               Models like <strong>Auxiliary Deep Generative Models (ADGMs)</strong> and variants of Hierarchical VAEs are prime examples of this exact approach in practice.
             </p>
             <div className="bg-slate-900 p-4 border border-slate-600 rounded-lg text-sm text-slate-400 shadow-inner">
               <strong className="text-amber-400">Wait, how is this different from Normalizing Flows?</strong><br/>
               Normalizing flows mathematically <em>transform</em> a simple distribution into a complex one using strictly invertible functions. Auxiliary variables just <em>add extra dimensions</em> to sum over, achieving a complex distribution implicitly without needing invertible functions. They are different approaches, but can actually be used together!
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// PART 2: SEMI-AMORTIZED VARIATIONAL INFERENCE
// ==========================================

const AmortizationGapSlide = () => {
  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The "Amortization Gap"</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Standard VAEs use <strong>Amortized Inference</strong>: a single neural network maps <em>all</em> images to their latent distributions. While blazing fast, this "one-size-fits-all" approach has a flaw.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto items-stretch flex-grow pb-8">
        <div className="flex-[1.2] bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">The "One-Size-Fits-All" Problem</h3>
          
          <div className="relative w-full max-w-sm h-64 bg-slate-100 rounded-xl border border-slate-300 shadow-inner flex items-center justify-center overflow-hidden">
             <div className="absolute w-12 h-12 bg-emerald-400/30 rounded-full border-2 border-emerald-500 flex items-center justify-center animate-pulse" style={{ top: '20%', right: '20%' }}>
               <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
             </div>
             <span className="absolute top-[8%] right-[10%] text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shadow-sm">True Optimal Posterior</span>

             <div className="absolute w-16 h-16 bg-blue-500/20 rounded-full border-2 border-dashed border-blue-500 flex items-center justify-center" style={{ top: '35%', right: '40%' }}>
               <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
             </div>
             <span className="absolute top-[50%] right-[30%] text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded shadow-sm text-center">
               Encoder's Guess<br/>(Amortized λ₀)
             </span>

             <svg className="absolute inset-0 w-full h-full pointer-events-none">
               <line x1="60%" y1="43%" x2="80%" y2="26%" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4" />
             </svg>
             <span className="absolute top-[32%] right-[25%] text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded shadow-sm transform -rotate-12">
               Amortization Gap
             </span>
          </div>

          <p className="text-sm text-slate-600 mt-6 text-center leading-relaxed">
            The neural network parameters φ are optimized to be "pretty good" on average for the whole dataset. For unusual or complex datapoints, its guess λ₀ will miss the perfect, optimal peak.
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-6 justify-center">
          <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-white h-full flex flex-col justify-center">
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <Network className="w-6 h-6" /> The Global vs. Local Conflict
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4 text-sm">
              If we didn't use a Neural Network, we would randomly guess parameters λ and run thousands of optimization steps for <em>every single image</em> to find its perfect posterior. This is accurate, but incredibly slow.
            </p>
            <div className="bg-slate-900/80 border-l-4 border-amber-400 p-4 rounded text-sm text-slate-200 shadow-inner mb-4">
              <strong>Semi-Amortized Inference</strong> gives us the best of both worlds.
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">
              We use the fast Encoder to instantly jump 90% of the way there (getting λ₀). Then, we perform a few manual optimization steps just for that specific image to close the gap and hit the true peak!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TheParameterSwitchSlide = () => {
  const [step, setStep] = useState(0);

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-900 text-slate-200">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Wait, how do we optimize an "Output"?</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          In standard Deep Learning, you cannot optimize an output (like the mean or variance). You optimize the <strong>weights</strong> of the network. So how does Semi-Amortized inference run gradient ascent directly on the output λ? 
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center max-w-5xl mx-auto w-full flex-grow pb-8 gap-8">
        
        <div className="flex-1 bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-600 flex flex-col items-center w-full min-h-[400px]">
          <div className="bg-slate-900 p-1 rounded-lg inline-flex mb-8 border border-slate-700">
            <button 
              onClick={() => setStep(0)}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${step === 0 ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
            >
              1. The Forward Pass
            </button>
            <button 
              onClick={() => setStep(1)}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${step === 1 ? 'bg-rose-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
            >
              2. The Detachment
            </button>
            <button 
              onClick={() => setStep(2)}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${step === 2 ? 'bg-emerald-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
            >
              3. The Refinement
            </button>
          </div>

          <div className="relative w-full max-w-sm flex-grow flex flex-col items-center justify-center">
             
             {/* Neural Network Box */}
             <motion.div 
               animate={{ opacity: step === 2 ? 0.3 : 1, y: step === 2 ? -20 : 0 }}
               className={`w-40 py-4 rounded-xl border-2 flex flex-col items-center justify-center shadow-lg relative z-10 transition-colors ${step === 0 ? 'bg-blue-900/50 border-blue-500' : 'bg-slate-800 border-slate-600'}`}
             >
               <BrainCircuit className={`w-8 h-8 mb-2 ${step === 0 ? 'text-blue-400' : 'text-slate-500'}`} />
               <span className="font-bold text-sm">Encoder φ</span>
               {step === 2 && <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-xl backdrop-blur-[1px]"><Lock className="w-8 h-8 text-slate-300"/></div>}
             </motion.div>

             {/* Connection Line */}
             <div className="relative w-full h-16 flex justify-center items-center">
               <AnimatePresence>
                 {step === 0 && (
                   <motion.div key="conn-blue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute w-1 h-full bg-blue-500"></motion.div>
                 )}
                 {step >= 1 && (
                   <motion.div key="conn-unlink" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} className="absolute z-20 bg-rose-500 text-white p-1 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                     <Unlink className="w-6 h-6" />
                   </motion.div>
                 )}
                 {step >= 1 && (
                   <motion.div key="conn-dashed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex justify-center">
                     <div className="absolute w-1 h-1/2 top-0 bg-slate-600 border-b border-rose-500 border-dashed"></div>
                     <div className="absolute w-1 h-1/2 bottom-0 bg-slate-600 border-t border-rose-500 border-dashed"></div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>

             {/* Lambda Variables Box */}
             <motion.div 
               animate={{ scale: step === 2 ? 1.1 : 1, y: step === 2 ? 20 : 0 }}
               className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center shadow-xl relative z-10 transition-colors duration-500 ${
                 step === 0 ? 'bg-amber-900/30 border-amber-500' : 
                 step === 1 ? 'bg-amber-900/80 border-amber-500' : 'bg-emerald-900/80 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
               }`}
             >
               <span className="font-mono text-2xl font-bold">λ</span>
               <span className="text-[10px] text-center mt-1">(μ, σ)</span>
               
               {step === 2 && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -right-4 -bottom-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md border border-white">
                   requires_grad=True
                 </motion.div>
               )}
             </motion.div>

             {/* Optimizer / Backprop visual */}
             <AnimatePresence>
               {step === 2 && (
                 <motion.div key="optimizer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute right-0 bottom-0 flex items-center gap-2">
                   <div className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-2 py-1 rounded border border-emerald-500/50">
                     ∇ L(λ)
                   </div>
                   <svg width="40" height="20" viewBox="0 0 40 20">
                     <path d="M 40 10 L 10 10" stroke="#34d399" strokeWidth="2" strokeDasharray="4" markerEnd="url(#arrow-emerald)" />
                   </svg>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
           <AnimatePresence mode="wait">
             {step === 0 && (
               <motion.div key="s0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
                 <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">The Standard Setup</h3>
                 <p className="text-sm text-slate-300 leading-relaxed mb-4">
                   Normally, λ (the mean and variance) is just a set of intermediate numbers spit out by the Encoder network.
                 </p>
                 <p className="text-sm text-slate-300 leading-relaxed">
                   If we want to change λ, we have to calculate the loss, run backpropagation <em>through</em> λ, and update the Encoder's parameters (φ) so it spits out better numbers next time.
                 </p>
               </motion.div>
             )}
             
             {step === 1 && (
               <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-rose-900/30 p-6 rounded-xl border border-rose-500/50 shadow-md">
                 <h3 className="text-xl font-bold text-rose-400 mb-3 flex items-center gap-2">The Detachment</h3>
                 <p className="text-sm text-rose-200 leading-relaxed mb-4">
                   In Semi-Amortized Inference, we run the Encoder once to get the numbers for λ. <strong>Then, we sever the connection.</strong>
                 </p>
                 <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 font-mono text-xs text-slate-300 shadow-inner">
                   <span className="text-slate-500"># PyTorch Pseudo-code</span><br/>
                   lambda_0 = encoder(x)<br/>
                   <span className="text-rose-400 font-bold">lambda_t = lambda_0.detach()</span>
                 </div>
                 <p className="text-sm text-rose-200 leading-relaxed mt-4">
                   We copy the numbers into a brand new, independent variable that has no memory of the network that created it.
                 </p>
               </motion.div>
             )}

             {step === 2 && (
               <motion.div key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-emerald-900/30 p-6 rounded-xl border border-emerald-500/50 shadow-md">
                 <h3 className="text-xl font-bold text-emerald-400 mb-3 flex items-center gap-2">Promoted to Parameter</h3>
                 <p className="text-sm text-emerald-200 leading-relaxed mb-4">
                   Now, we tell our math optimizer to treat these numbers as <strong>trainable weights</strong>. We freeze the original network.
                 </p>
                 <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 font-mono text-xs text-slate-300 shadow-inner">
                   <span className="text-emerald-400 font-bold">lambda_t.requires_grad = True</span><br/>
                   optimizer = Adam([lambda_t])<br/>
                   <br/>
                   <span className="text-slate-500"># Gradient Ascent Loop:</span><br/>
                   loss = calculate_ELBO(x, lambda_t)<br/>
                   loss.backward()<br/>
                   optimizer.step()
                 </div>
                 <p className="text-sm text-emerald-200 leading-relaxed mt-4 font-bold">
                   The output has become the input! We are now running gradient ascent directly on the means and variances themselves.
                 </p>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const TheInnerLoopSlide = () => {
  const [loopStep, setLoopStep] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle, forward, backward

  const runOneStep = () => {
    if (loopStep >= 5) return;
    setPhase('forward');
    setTimeout(() => {
      setPhase('backward');
      setTimeout(() => {
        setLoopStep(prev => prev + 1);
        setPhase('idle');
      }, 1500);
    }, 1500);
  };

  const reset = () => {
    setLoopStep(0);
    setPhase('idle');
  };

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The Inner Loop: Who gets updated?</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          You asked: <em>"Do you train the whole architecture or just λ?"</em><br/>
          <strong>Just λ!</strong> Watch how the neural networks are completely frozen during these 5 steps.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center max-w-5xl mx-auto w-full flex-grow pb-8 gap-12">
        
        <div className="flex-1 flex flex-col gap-6 w-full">
           <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
             <h3 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2"><Lock className="w-5 h-5"/> 1. The Encoder is OFF</h3>
             <p className="text-sm text-slate-600 leading-relaxed mb-4">
               We used the Encoder once to get λ₀. After detaching λ, the Encoder is completely removed from this loop.
             </p>

             <h3 className="text-lg font-bold text-rose-600 mb-4 flex items-center gap-2"><Lock className="w-5 h-5"/> 2. The Decoder is FROZEN</h3>
             <p className="text-sm text-slate-600 leading-relaxed mb-4">
               We must pass our samples through the Decoder to calculate the ELBO score (to see how good our current λ is). But we set <strong><span className="font-mono text-xs bg-slate-100 px-1 rounded">requires_grad=False</span></strong> on all Decoder weights. It acts purely as a measuring stick.
             </p>

             <h3 className="text-lg font-bold text-emerald-600 mb-4 flex items-center gap-2"><Unlock className="w-5 h-5"/> 3. Only λ is UPDATED</h3>
             <p className="text-sm text-slate-600 leading-relaxed">
               When backpropagation runs, the gradients flow <em>through</em> the frozen Decoder without changing it, and land directly into our floating λ parameters!
             </p>
           </div>

           <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-700 flex flex-col items-center">
             <div className="text-white font-mono text-xl mb-4">Step: {loopStep} / 5</div>
             <div className="flex gap-4 w-full">
               <button 
                 onClick={runOneStep} disabled={loopStep >= 5 || phase !== 'idle'}
                 className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-lg shadow hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
               >
                 <Play className="w-4 h-4"/> Run 1 Step
               </button>
               <button 
                 onClick={reset} disabled={phase !== 'idle'}
                 className="py-3 px-4 bg-slate-700 text-white font-bold rounded-lg shadow hover:bg-slate-600 transition-colors disabled:opacity-50"
               >
                 <RotateCcw className="w-4 h-4"/>
               </button>
             </div>
           </div>
        </div>

        <div className="flex-[1.2] bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-600 flex flex-col items-center relative overflow-hidden min-h-[500px] w-full">
          
          <div className="absolute inset-0 pointer-events-none z-0">
             <svg className="w-full h-full">
                <defs>
                  <marker id="arrow-down-loop" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                  </marker>
                  <marker id="arrow-up-loop" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                  </marker>
                </defs>
                <path d="M 50% 120 L 50% 180" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
                
                {phase === 'forward' && (
                  <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} d="M 50% 260 L 50% 320" fill="none" stroke="#94a3b8" strokeWidth="3" markerEnd="url(#arrow-down-loop)" />
                )}
                {(phase === 'backward' || phase === 'idle') && loopStep > 0 && (
                  <path d="M 50% 260 L 50% 320" fill="none" stroke="#94a3b8" strokeWidth="3" markerEnd="url(#arrow-down-loop)" opacity={phase === 'backward' ? 0.2 : 1} />
                )}

                {phase === 'backward' && (
                  <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} d="M 50% 320 L 50% 260" fill="none" stroke="#10b981" strokeWidth="6" strokeDasharray="8" markerStart="url(#arrow-up-loop)" className="animate-pulse" />
                )}
             </svg>
          </div>

          <div className="flex flex-col items-center justify-between w-full h-full z-10 relative">
             
             {/* Locked Encoder */}
             <div className="w-48 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-xl flex flex-col items-center justify-center opacity-50 relative">
               <Lock className="absolute -top-3 -right-3 w-6 h-6 text-rose-500 bg-slate-900 rounded-full p-1 border border-slate-700" />
               <BrainCircuit className="w-6 h-6 text-slate-500 mb-1" />
               <span className="font-bold text-slate-500 text-sm">Encoder φ</span>
               <span className="text-[10px] text-rose-400 font-bold bg-rose-900/30 px-2 rounded mt-1">OFF (Frozen)</span>
             </div>

             {/* Active Lambda */}
             <motion.div 
               animate={{ scale: phase === 'backward' ? 1.1 : 1, y: phase === 'backward' ? 10 : 0 }}
               className={`w-40 h-24 rounded-2xl border-4 flex flex-col items-center justify-center shadow-lg transition-colors duration-500 bg-slate-900 ${
                 phase === 'backward' ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'border-amber-500'
               }`}
               style={{ marginTop: '20px' }}
             >
               <span className="font-mono text-xl font-bold text-white">λ_{loopStep}</span>
               <span className="text-[10px] text-emerald-400 font-bold bg-emerald-900/30 px-2 rounded border border-emerald-800 mt-2">requires_grad=True</span>
             </motion.div>

             {/* Frozen Decoder */}
             <div className="w-56 py-4 bg-blue-900/30 border-2 border-blue-700/50 rounded-xl flex flex-col items-center justify-center relative" style={{ marginTop: '40px' }}>
               <Lock className="absolute -top-3 -right-3 w-6 h-6 text-rose-500 bg-slate-900 rounded-full p-1 border border-slate-700" />
               <span className="font-bold text-blue-300 text-sm">Decoder p(x|z)</span>
               <span className="text-[10px] text-blue-200 text-center mt-1 mx-2">Takes z, calculates reconstruction, but parameters θ are frozen.</span>
               <span className="text-[10px] text-rose-400 font-bold bg-rose-900/30 px-2 rounded mt-2 border border-rose-800">requires_grad=False</span>
             </div>

             {/* Loss Output */}
             <div className="w-full flex justify-center mt-8">
               <div className={`px-6 py-3 rounded-xl border-2 transition-colors ${phase === 'backward' ? 'bg-emerald-900/80 border-emerald-500' : phase === 'forward' ? 'bg-amber-900/80 border-amber-500' : 'bg-slate-900 border-slate-700'}`}>
                 <span className={`font-bold text-sm ${phase === 'backward' ? 'text-emerald-400' : phase === 'forward' ? 'text-amber-400' : 'text-slate-400'}`}>
                   {phase === 'forward' ? 'Calculating ELBO...' : phase === 'backward' ? 'Gradients Flowing UP!' : `ELBO Loss for λ_${loopStep}`}
                 </span>
               </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const RefinementMathDeepDiveSlide = () => {
  const [t, setT] = useState(0);
  const T_MAX = 5;

  // The true optimal parameters for this specific image (unknown to the model)
  const targetMu = 70;
  const targetSigma = 15;
  const maxElbo = -12.5;

  // Track the history of our lambda parameters: lambda_0, lambda_1, etc.
  const [lambdaHistory, setLambdaHistory] = useState([
    { t: 0, mu: 20, sigma: 35, elbo: -85.2, gradMu: 0, gradSigma: 0 } // lambda_0 (from Encoder)
  ]);

  const currentLambda = lambdaHistory[t];
  const isFinished = t >= T_MAX;

  // Generate SVG path for a Gaussian curve
  const generateGaussianPath = (mu, sigma, heightScale = 100) => {
    let path = `M 0 100 `;
    for (let x = 0; x <= 100; x += 1) {
      const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
      const y = 100 - (Math.exp(exponent) * heightScale * (20 / sigma)); // Scale height inversely to spread
      path += `L ${x} ${Math.max(5, y)} `;
    }
    path += `L 100 100 Z`;
    return path;
  };

  const executeNextStep = () => {
    if (isFinished) return;

    // Simulate calculating the Gradient of the ELBO with respect to lambda
    // (In reality, PyTorch autodiff does this via backprop through the Decoder)
    const current = lambdaHistory[t];
    
    // Fake gradient: Proportional to the distance from target
    const gradMu = (targetMu - current.mu) * 0.8;
    const gradSigma = (targetSigma - current.sigma) * 0.4;
    
    const learningRateEta = 0.5; // η

    // THE FORMULA: lambda_{t+1} = lambda_t + (eta * gradient)
    const nextMu = current.mu + (learningRateEta * gradMu);
    const nextSigma = current.sigma + (learningRateEta * gradSigma);
    
    // Fake ELBO improving as we get closer
    const nextElbo = current.elbo + Math.abs(gradMu * 0.5) + Math.abs(gradSigma * 0.5);

    // Update history for the table
    const updatedHistory = [...lambdaHistory];
    updatedHistory[t].gradMu = gradMu;
    updatedHistory[t].gradSigma = gradSigma;
    
    updatedHistory.push({
      t: t + 1,
      mu: nextMu,
      sigma: Math.max(5, nextSigma), // prevent negative variance
      elbo: t === T_MAX - 1 ? maxElbo : nextElbo, // reach max at end
      gradMu: 0,
      gradSigma: 0
    });

    setLambdaHistory(updatedHistory);
    setT(t + 1);
  };

  const reset = () => {
    setT(0);
    setLambdaHistory([lambdaHistory[0]]);
  };

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Executing the Refinement Formula</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Let's map the mathematical equations from the screenshot directly to the raw numbers. <br/>
          Remember: <span className="font-mono font-bold bg-slate-200 px-1 rounded text-emerald-700">λ = (μ, σ)</span>. It is just a bucket holding a Mean and Variance!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 flex-grow w-full max-w-7xl mx-auto pb-8">
        
        {/* Left: The Math Equations */}
        <div className="flex-1 bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-700 flex flex-col justify-between text-slate-200">
           
           <div className={`p-4 rounded-xl border-2 transition-all ${t === 0 ? 'bg-slate-800 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-slate-900/50 border-slate-700 opacity-50'}`}>
             <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">1. Initialization</h3>
             <div className="font-mono text-center text-lg bg-slate-950 py-3 rounded border border-slate-800 shadow-inner">
               <span className="text-white">λ</span><sub className="text-slate-500">0</sub> = <span className="text-blue-300">Encoder<sub className="text-slate-500">φ</sub>(x_i)</span>
             </div>
             {t === 0 && <p className="text-xs text-slate-400 mt-3">The neural network gives us our starting guess (λ₀). We freeze the network after this.</p>}
           </div>

           <div className={`p-4 rounded-xl border-2 transition-all ${t > 0 && t < T_MAX ? 'bg-slate-800 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-900/50 border-slate-700 opacity-50'}`}>
             <h3 className="font-bold text-amber-400 mb-2 flex items-center gap-2">2. Refinement Loop (t={t})</h3>
             <div className="font-mono text-center bg-slate-950 py-3 rounded border border-slate-800 shadow-inner flex flex-col gap-2 overflow-x-auto">
               <div className="whitespace-nowrap text-sm md:text-base">
                 <span className="text-white">λ</span><sub className="text-slate-500">t+1</sub> = <span className="text-white">λ</span><sub className="text-slate-500">t</sub> <span className="text-emerald-400">+</span> <span className="text-rose-400">η</span> <span className="text-emerald-400">∇</span><sub className="text-slate-500">λ_t</sub><span className="text-white"> L</span>(x_i, <span className="text-white">λ</span><sub className="text-slate-500">t</sub>)
               </div>
             </div>
             {(t > 0 && t < T_MAX) && (
               <div className="text-xs text-slate-400 mt-3 space-y-1">
                 <p><span className="text-rose-400 font-bold">η (Learning Rate):</span> The step size (e.g., 0.5).</p>
                 <p><span className="text-emerald-400 font-bold">∇ L (Gradient):</span> Which way should μ and σ change to increase the ELBO score?</p>
               </div>
             )}
           </div>

           <div className={`p-4 rounded-xl border-2 transition-all ${isFinished ? 'bg-slate-800 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-slate-900/50 border-slate-700 opacity-50'}`}>
             <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2">3. Final Posterior</h3>
             <div className="font-mono text-center text-lg bg-slate-950 py-3 rounded border border-slate-800 shadow-inner">
               <span className="text-white">q(z | x_i ; </span><span className="text-purple-400">λ<sub className="text-purple-700">T</sub></span>)
             </div>
             {isFinished && <p className="text-xs text-slate-400 mt-3">Optimization complete! We use λ_5 to calculate our final generative loss.</p>}
           </div>
        </div>

        {/* Right: The Data Dashboard */}
        <div className="flex-[1.5] flex flex-col gap-4 w-full">
           
           {/* Visualizer */}
           <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 h-64 relative flex flex-col justify-end">
              <h3 className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest z-10">Latent Space (1D)</h3>
              
              <div className="absolute top-4 right-4 bg-slate-100 p-2 rounded text-[10px] font-mono border border-slate-200 z-10 text-right">
                <div><span className="inline-block w-3 h-3 bg-emerald-100 border border-emerald-500 align-middle mr-1"></span> True Optimal</div>
                <div className="mt-1"><span className="inline-block w-3 h-3 bg-blue-100 border border-blue-500 align-middle mr-1"></span> Current λ<sub className="text-slate-400">{t}</sub></div>
              </div>

              <div className="relative w-full h-full border-b-2 border-slate-300">
                {/* Target Gaussian */}
                <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d={generateGaussianPath(targetMu, targetSigma, 60)} fill="#d1fae5" stroke="#10b981" strokeWidth="2" strokeDasharray="4" />
                </svg>

                {/* Ghost trails */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {lambdaHistory.map((lam, i) => i < t && (
                    <path key={i} d={generateGaussianPath(lam.mu, lam.sigma, 60)} fill="none" stroke="#93c5fd" strokeWidth="1" opacity={0.3 + (i * 0.1)} />
                  ))}
                </svg>

                {/* Current Lambda Gaussian */}
                <svg className="absolute inset-0 w-full h-full drop-shadow-md transition-all duration-500" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d={generateGaussianPath(currentLambda.mu, currentLambda.sigma, 60)} fill="#bfdbfe" stroke="#3b82f6" strokeWidth="3" />
                  
                  {/* Arrow indicating gradient push */}
                  {!isFinished && currentLambda.gradMu > 0 && (
                    <g transform={`translate(${currentLambda.mu + 5}, 50)`}>
                       <line x1="0" y1="0" x2="10" y2="0" stroke="#f43f5e" strokeWidth="2" />
                       <polygon points="10,-3 15,0 10,3" fill="#f43f5e" />
                       <text x="5" y="-5" fontSize="5" fill="#f43f5e" fontWeight="bold" textAnchor="middle">+∇</text>
                    </g>
                  )}
                </svg>
              </div>
              <div className="w-full flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>0</span><span>z</span><span>100</span>
              </div>
           </div>

           {/* Live Table */}
           <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200 flex-grow flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-mono">
                  <thead>
                    <tr className="border-b-2 border-slate-200 text-slate-500">
                      <th className="pb-2">Step</th>
                      <th className="pb-2 text-blue-600">μ</th>
                      <th className="pb-2 text-blue-600">σ</th>
                      <th className="pb-2 text-amber-600">ELBO Score</th>
                      <th className="pb-2 text-rose-500">∇μ</th>
                      <th className="pb-2 text-rose-500">∇σ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lambdaHistory.map((lam, i) => (
                      <tr key={i} className={`border-b border-slate-100 transition-colors ${i === t ? 'bg-blue-50/50' : ''}`}>
                        <td className="py-2 font-bold text-slate-700">λ_{i}</td>
                        <td className="py-2">{lam.mu.toFixed(1)}</td>
                        <td className="py-2">{lam.sigma.toFixed(1)}</td>
                        <td className="py-2 font-bold text-amber-600">{lam.elbo.toFixed(1)}</td>
                        <td className="py-2 text-slate-400">{i < t ? lam.gradMu.toFixed(1) : '-'}</td>
                        <td className="py-2 text-slate-400">{i < t ? lam.gradSigma.toFixed(1) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-auto pt-4 flex gap-4">
                <button 
                  onClick={executeNextStep} disabled={isFinished}
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Activity className="w-5 h-5"/> {isFinished ? 'Optimization Reached' : `Calculate Gradient & Update λ_${t+1}`}
                </button>
                <button 
                  onClick={reset} disabled={t === 0}
                  className="p-3 bg-slate-100 text-slate-600 font-bold rounded-xl shadow-sm border border-slate-300 hover:bg-slate-200 transition-colors disabled:opacity-50"
                  title="Reset"
                >
                  <RotateCcw className="w-5 h-5"/>
                </button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

const TheMissingLinkSlide = () => {
  const [activeTab, setActiveTab] = useState('inference'); // 'inference' or 'training'

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-900 text-slate-200">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-emerald-400 mb-2 text-center">The Missing Link: Why refine λ?</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          You correctly deduced: <em>"So basically we remove the encoder and just keep the refined latent space?"</em> YES! Here is exactly how that final <span className="font-mono text-emerald-300 bg-emerald-900/50 px-1 rounded">λ_T</span> improves both Inference and the Generative Model.
        </p>
      </div>

      <div className="flex flex-col max-w-5xl mx-auto w-full flex-grow pb-8 gap-6">
        
        <div className="flex bg-slate-800 p-1 rounded-xl shadow-inner border border-slate-700 w-full max-w-md mx-auto">
          <button 
            onClick={() => setActiveTab('inference')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'inference' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Database className="w-4 h-4"/> 1. Downstream Inference
          </button>
          <button 
            onClick={() => setActiveTab('training')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'training' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Box className="w-4 h-4"/> 2. Training the Decoder
          </button>
        </div>

        <div className="flex-grow bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8 flex flex-col lg:flex-row gap-8 items-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {activeTab === 'inference' && (
              <motion.div key="inf" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex w-full gap-8 flex-col lg:flex-row items-center">
                <div className="flex-1 flex flex-col gap-4 w-full">
                  <h3 className="text-2xl font-bold text-emerald-400 mb-2 border-b border-slate-600 pb-2">The "Final Posterior"</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    In your screenshot, step 3 says: <em>"Final Posterior: Use the refined parameters <span className="font-mono">λ_T</span> to define the approximate posterior for downstream tasks."</em>
                  </p>
                  <div className="bg-emerald-900/30 p-4 rounded-xl border-l-4 border-emerald-500 shadow-inner mb-4">
                    <strong className="text-emerald-300 block mb-1">The Encoder is just a fast starting point.</strong>
                    <p className="text-sm text-emerald-100/80">
                      Once we finish the T steps of gradient ascent, we have a highly accurate, custom-tailored representation of the image. If you are doing clustering, anomaly detection, or passing the latents to a classifier, you completely discard the Encoder's initial guess (λ₀) and use λ_T instead!
                    </p>
                  </div>
                </div>

                <div className="flex-[0.8] w-full flex flex-col items-center bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-inner">
                   <div className="relative w-full max-w-[200px] aspect-square flex items-center justify-center mb-4">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:15px_15px]"></div>
                      
                      <div className="absolute w-12 h-12 bg-amber-500/20 border border-amber-500/50 rounded-full flex flex-col items-center justify-center top-8 left-8">
                        <span className="text-[10px] text-amber-400 font-bold">λ₀</span>
                        <span className="text-[8px] text-amber-500/80">(Sloppy)</span>
                      </div>
                      
                      <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 100 100">
                         <defs>
                           <marker id="arrow-em" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                             <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
                           </marker>
                         </defs>
                         <path d="M 30 30 Q 50 60 70 70" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="4" markerEnd="url(#arrow-em)" className="animate-pulse" />
                      </svg>

                      <div className="absolute w-8 h-8 bg-emerald-500/40 border-2 border-emerald-400 rounded-full flex flex-col items-center justify-center bottom-6 right-6 shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                        <span className="text-[10px] text-white font-bold">λ_T</span>
                      </div>
                   </div>
                   <div className="bg-emerald-500 text-slate-900 font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-widest shadow-md">
                     Keep λ_T. Ignore λ₀.
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'training' && (
              <motion.div key="trn" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex w-full gap-8 flex-col lg:flex-row items-center">
                <div className="flex-1 flex flex-col gap-4 w-full">
                  <h3 className="text-2xl font-bold text-blue-400 mb-2 border-b border-slate-600 pb-2">Training the Generative Model (θ)</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    Why does refining λ improve the actual VAE generator? Remember that the Decoder learns by trying to reconstruct the image from the latent variable z.
                  </p>
                  <div className="bg-blue-900/30 p-4 rounded-xl border-l-4 border-blue-500 shadow-inner mb-4">
                    <strong className="text-blue-300 block mb-1">Garbage In, Garbage Out</strong>
                    <p className="text-sm text-blue-100/80 mb-3">
                      In a standard VAE, the lazy Encoder gives the Decoder sloppy, inaccurate z samples. The Decoder is forced to learn how to draw blurry, generic images because the inputs it receives are messy.
                    </p>
                    <p className="text-sm text-blue-100/80 font-bold">
                      By explicitly running the Inner Loop to find $\lambda_T$ <em>before</em> we update the Decoder weights, the Decoder receives perfectly crisp, highly accurate latent codes to learn from! The resulting Generative Model becomes drastically sharper and more capable.
                    </p>
                  </div>
                </div>

                <div className="flex-[0.8] w-full flex flex-col items-center bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-inner justify-center relative">
                   <div className="flex items-center gap-2 mb-8">
                     <div className="w-12 h-12 bg-slate-200 text-slate-800 rounded-lg flex items-center justify-center font-bold text-sm shadow">Img x</div>
                     <ArrowRight className="text-slate-500 w-5 h-5"/>
                     <div className="bg-emerald-900/50 border border-emerald-500 px-3 py-2 rounded flex flex-col items-center">
                       <span className="text-[10px] text-emerald-400 font-bold mb-1">Inner Loop</span>
                       <span className="text-white font-mono text-sm">λ_T</span>
                     </div>
                     <ArrowRight className="text-emerald-500 w-5 h-5"/>
                     <div className="w-12 h-12 bg-blue-600 border-2 border-blue-400 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(37,99,235,0.6)] animate-pulse">Decoder</div>
                   </div>

                   <div className="absolute bottom-4 bg-blue-100 border-2 border-blue-500 text-blue-900 px-4 py-2 rounded text-xs font-bold shadow-lg flex items-center gap-2">
                     <Zap className="w-4 h-4 text-blue-600"/> Update Decoder weights (θ)
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

const FlowchartSlide = () => {
  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-900 text-slate-200">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">The Architecture Pipeline</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          This matches the exact flowchart from your screenshot. It visualizes how the Amortized Network and the Iterative Refinement process interact.
        </p>
      </div>

      <div className="flex flex-col items-center max-w-4xl mx-auto w-full flex-grow pb-8">
        <div className="relative w-full max-w-md bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center font-sans">
          
          {/* Step 1: Input */}
          <div className="bg-slate-400 text-slate-900 font-bold px-8 py-3 rounded-[50%] shadow-md z-10 w-32 text-center border-2 border-slate-500 text-sm">
            Input x_i
          </div>
          
          <div className="relative w-full h-12 flex justify-center">
            <svg className="absolute inset-0 w-full h-full">
               <defs>
                 <marker id="arrow-black" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                   <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a" />
                 </marker>
               </defs>
               <path d="M 50% 0 L 50% 100" fill="none" stroke="#0f172a" strokeWidth="2" markerEnd="url(#arrow-black)" />
            </svg>
          </div>

          {/* Step 2: Encoder */}
          <div className="bg-blue-300 text-blue-900 font-bold px-6 py-4 rounded-xl shadow-md z-10 border-2 border-blue-500 text-center text-sm w-48">
            Amortized<br/>Inference Network<br/>
            <span className="font-mono text-[10px] font-normal">(Encoder q_φ(z|x))</span>
          </div>

          <div className="relative w-full h-16 flex justify-center">
            <svg className="absolute inset-0 w-full h-full">
               <path d="M 50% 0 L 50% 100" fill="none" stroke="#0f172a" strokeWidth="2" markerEnd="url(#arrow-black)" />
            </svg>
            <span className="absolute top-1/2 -translate-y-1/2 left-[55%] text-[10px] font-bold text-slate-600 bg-white px-1">Provides</span>
          </div>

          {/* Step 3: Initial Params */}
          <div className="bg-orange-300 text-orange-900 font-bold px-6 py-4 rounded-xl shadow-md z-10 border-2 border-orange-500 text-center text-sm w-48 rounded-t-sm rounded-b-sm border-b-[8px]">
            Initial Variational<br/>Parameters λ₀
          </div>

          <div className="relative w-full h-16 flex justify-center">
            <svg className="absolute inset-0 w-full h-full z-0 overflow-visible">
               <path d="M 50% 0 L 50% 100" fill="none" stroke="#0f172a" strokeWidth="2" markerEnd="url(#arrow-black)" />
               {/* Dashed skip connection from Input to Refinement */}
               <path d="M 60% -200 Q 90% -50 65% 100" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeDasharray="4" markerEnd="url(#arrow-black)" />
            </svg>
            <span className="absolute top-[20%] left-[55%] text-[10px] font-bold text-slate-600 bg-white px-1">Initializes</span>
            <div className="absolute top-[0%] left-[80%] text-[10px] font-bold text-slate-600 bg-white px-1 text-center leading-tight shadow-sm border border-slate-200 rounded">
              Guides refinement<br/>(via ELBO(x_i, λ))
            </div>
          </div>

          {/* Step 4: Iterative Refinement */}
          <div className="bg-emerald-300 text-emerald-900 font-bold px-4 py-4 shadow-md z-10 border-2 border-emerald-500 text-center text-sm w-64 relative" style={{ clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)' }}>
            Iterative Refinement<br/>
            <span className="text-[10px] font-normal">(e.g., K steps of Gradient Ascent<br/>on ELBO(x_i, λ))</span>
          </div>

          <div className="relative w-full h-16 flex justify-center">
            <svg className="absolute inset-0 w-full h-full">
               <path d="M 50% 0 L 50% 100" fill="none" stroke="#0f172a" strokeWidth="2" markerEnd="url(#arrow-black)" />
            </svg>
            <span className="absolute top-1/2 -translate-y-1/2 left-[55%] text-[10px] font-bold text-slate-600 bg-white px-1">Produces</span>
          </div>

          {/* Step 5: Refined Params */}
          <div className="bg-orange-200 text-orange-900 font-bold px-6 py-4 rounded-xl shadow-md z-10 border-2 border-orange-400 text-center text-sm w-48 rounded-t-sm rounded-b-sm border-b-[8px]">
            Refined Variational<br/>Parameters λ_K
          </div>

          <div className="relative w-full h-16 flex justify-center">
            <svg className="absolute inset-0 w-full h-full">
               <path d="M 50% 0 L 50% 100" fill="none" stroke="#0f172a" strokeWidth="2" markerEnd="url(#arrow-black)" />
            </svg>
            <span className="absolute top-1/2 -translate-y-1/2 left-[55%] text-[10px] font-bold text-slate-600 bg-white px-1">Defines</span>
          </div>

          {/* Step 6: Final Posterior */}
          <div className="bg-purple-300 text-purple-900 font-bold px-6 py-3 rounded-2xl shadow-md z-10 border-2 border-purple-500 text-center text-sm w-48">
            Approximate Posterior<br/>
            <span className="font-mono text-[10px] font-normal">q(z|x_i; λ_K)</span>
          </div>

        </div>
      </div>
    </div>
  );
};

const GlobalTrainingLoopSlide = () => {
  const [phase, setPhase] = useState(1); // 1: Inner Loop, 2: Train Decoder, 3: Train Encoder

  return (
    <div className="flex flex-col h-full p-6 md:p-10 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-indigo-700 mb-2 text-center">The Global Training Loop</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Yes, we still use the ELBO! Yes, we still use KL Divergence! But the training happens in 3 distinct phases. Click through the phases to see what gets updated and how the Loss is calculated.
        </p>
      </div>

      <div className="flex justify-center mb-6 w-full max-w-4xl mx-auto relative z-20">
        <div className="flex bg-slate-200 p-1 rounded-xl w-full shadow-inner border border-slate-300">
           <button onClick={() => setPhase(1)} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${phase === 1 ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
             <RotateCcw className="w-4 h-4"/> 1. Inner Loop (Find λ_T)
           </button>
           <button onClick={() => setPhase(2)} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${phase === 2 ? 'bg-blue-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
             <Cpu className="w-4 h-4"/> 2. Update Decoder (θ)
           </button>
           <button onClick={() => setPhase(3)} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${phase === 3 ? 'bg-purple-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
             <BrainCircuit className="w-4 h-4"/> 3. Update Encoder (φ)
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto items-stretch flex-grow pb-8">
        
        {/* Visual Pipeline */}
        <div className="flex-[1.2] bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-700 flex flex-col items-center justify-center relative min-h-[400px]">
          
          <div className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Network Status</div>
          
          <div className="flex justify-between items-center w-full max-w-md relative z-10">
            
            {/* Encoder Box */}
            <div className={`w-32 py-4 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${phase === 3 ? 'bg-purple-900/80 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-slate-800 border-slate-600 opacity-50'}`}>
              <BrainCircuit className={`w-6 h-6 mb-2 ${phase === 3 ? 'text-purple-400' : 'text-slate-500'}`} />
              <span className="font-bold text-sm text-slate-300">Encoder φ</span>
              <div className="mt-2 text-[10px] font-bold px-2 py-1 rounded bg-slate-950 flex items-center gap-1">
                {phase === 3 ? <Unlock className="w-3 h-3 text-emerald-400"/> : <Lock className="w-3 h-3 text-rose-500"/>}
                <span className={phase === 3 ? 'text-emerald-400' : 'text-rose-500'}>{phase === 3 ? 'TRAINING' : 'FROZEN'}</span>
              </div>
            </div>

            {/* Latent Space (Lambda) */}
            <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 transition-all z-20 ${phase === 1 ? 'bg-amber-900/80 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-emerald-900/80 border-emerald-500'}`}>
               <span className="font-mono text-2xl font-bold text-white">{phase === 1 ? 'λ_t' : 'λ_T'}</span>
               {phase === 1 && <span className="text-[10px] text-amber-400 mt-1 animate-pulse">Updating...</span>}
               {phase !== 1 && <span className="text-[10px] text-emerald-400 mt-1">Perfected!</span>}
            </div>

            {/* Decoder Box */}
            <div className={`w-32 py-4 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${phase === 2 ? 'bg-blue-900/80 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-slate-800 border-slate-600 opacity-50'}`}>
              <Cpu className={`w-6 h-6 mb-2 ${phase === 2 ? 'text-blue-400' : 'text-slate-500'}`} />
              <span className="font-bold text-sm text-slate-300">Decoder θ</span>
              <div className="mt-2 text-[10px] font-bold px-2 py-1 rounded bg-slate-950 flex items-center gap-1">
                {phase === 2 ? <Unlock className="w-3 h-3 text-emerald-400"/> : <Lock className="w-3 h-3 text-rose-500"/>}
                <span className={phase === 2 ? 'text-emerald-400' : 'text-rose-500'}>{phase === 2 ? 'TRAINING' : 'FROZEN'}</span>
              </div>
            </div>
          </div>

          {/* Loss Box */}
          <div className="mt-12 bg-slate-800 p-4 rounded-xl border border-slate-600 w-full max-w-lg text-center relative">
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-3 border border-slate-600 rounded-full text-[10px] text-slate-400 font-bold uppercase tracking-widest">Calculated Loss</div>
             <AnimatePresence mode="wait">
               {phase === 1 && (
                 <motion.div key="p1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-mono text-sm md:text-base text-amber-300 flex flex-col items-center py-2">
                   <span>Instance ELBO = E_q(z|λ_t) [log p(x|z)] - D_KL(λ_t || p(z))</span>
                 </motion.div>
               )}
               {phase === 2 && (
                 <motion.div key="p2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-mono text-sm md:text-base text-blue-300 flex flex-col items-center py-2">
                   <span>Final ELBO = E_q(z|<strong className="text-emerald-400 text-lg">λ_T</strong>) [log p_θ(x|z)] - D_KL(<strong className="text-emerald-400 text-lg">λ_T</strong> || p(z))</span>
                 </motion.div>
               )}
               {phase === 3 && (
                 <motion.div key="p3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-mono text-sm md:text-base text-purple-300 flex flex-col items-center py-2">
                   <span>Encoder Loss = MeanSquaredError( <strong className="text-slate-400">λ_0</strong>, <strong className="text-emerald-400">λ_T</strong> )</span>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>

        {/* Text Explanation */}
        <div className="flex-1 flex flex-col justify-center">
           <AnimatePresence mode="wait">
             
             {phase === 1 && (
               <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white p-6 rounded-2xl shadow-lg border-t-8 border-amber-500">
                 <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">The Setup (Inner Loop)</h3>
                 <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                   First, we freeze BOTH neural networks. We run Gradient Ascent purely on the parameters <span className="font-mono bg-slate-100 px-1 rounded">λ</span> for <span className="font-mono">T</span> steps.
                 </p>
                 <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 shadow-sm text-sm text-amber-900">
                   <strong>Yes, we use the standard ELBO here!</strong> We use the ELBO formula to measure how good our current <span className="font-mono">λ_t</span> is, and we follow the gradient to make it better. The output is the perfected representation: <span className="font-mono font-bold text-emerald-600">λ_T</span>.
                 </div>
               </motion.div>
             )}

             {phase === 2 && (
               <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white p-6 rounded-2xl shadow-lg border-t-8 border-blue-500">
                 <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">Training the Decoder</h3>
                 <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                   Now we lock λ and unlock the Decoder (θ). We calculate the exact same ELBO loss, but we plug in our new, perfect <span className="font-mono bg-slate-100 px-1 rounded text-emerald-600 font-bold">λ_T</span> instead of the original guess.
                 </p>
                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm text-sm text-blue-900">
                   <strong>The Generative Benefit:</strong> Because we are calculating the ELBO using the highly accurate <span className="font-mono font-bold">λ_T</span>, the Decoder receives pristine, high-fidelity latent codes z to learn from! The gradients update the Decoder weights to generate vastly sharper images.
                 </div>
               </motion.div>
             )}

             {phase === 3 && (
               <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white p-6 rounded-2xl shadow-lg border-t-8 border-purple-500">
                 <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">Training the Encoder</h3>
                 <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                   Finally, we must update the Encoder (φ) so that its initial guess (λ₀) is better next time. 
                 </p>
                 <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 shadow-sm text-sm text-purple-900 mb-4">
                   <strong>Why not throw it away?</strong> If we don't train the Encoder, it will give us garbage for brand new images in the future! It needs to learn how to be a fast, accurate "Initialization Predicter."
                 </div>
                 <p className="text-slate-600 leading-relaxed text-sm">
                   <strong>The Optimization:</strong> There are two ways. The hard way is backpropagating through the entire Inner Loop. The easy way is treating <span className="font-mono text-emerald-600 font-bold">λ_T</span> as a "Ground Truth Label" and training the Encoder to output it directly using Mean Squared Error!
                 </p>
               </motion.div>
             )}

           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const SynergiesSlide = () => {
  return (
    <div className="flex flex-col h-full p-6 md:p-10 overflow-y-auto bg-slate-900 text-slate-200">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">When to use these techniques?</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          The final screenshot breaks down the decision matrix. Both Auxiliary Variables and Semi-Amortized Inference add massive complexity. Here is the checklist for when they are worth it.
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto flex-grow pb-8">
        
        <div className="bg-indigo-900/40 border-2 border-indigo-500/50 p-6 rounded-2xl flex items-start gap-4 shadow-lg mb-4">
           <Layers className="w-8 h-8 text-indigo-400 shrink-0 mt-1" />
           <div>
             <h3 className="text-xl font-bold text-indigo-300 mb-2">They are Not Mutually Exclusive!</h3>
             <p className="text-sm text-indigo-100/80 leading-relaxed">
               You can combine them. You can use an <strong>Auxiliary Variable</strong> framework to build a highly complex distribution shape, and then use <strong>Semi-Amortized</strong> optimization steps to slide that complex shape to the perfect spot for each specific datapoint!
             </p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md hover:-translate-y-1 transition-transform">
             <div className="bg-blue-900/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-blue-500/30">
               <Maximize className="w-6 h-6 text-blue-400"/>
             </div>
             <h4 className="font-bold text-white mb-2">High Posterior Variance</h4>
             <p className="text-xs text-slate-400 leading-relaxed">
               If your dataset is incredibly diverse (e.g., highly complex medical images where every patient is fundamentally different), a single amortized network will inevitably struggle. Semi-amortized refinement handles this variance perfectly.
             </p>
           </div>

           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md hover:-translate-y-1 transition-transform">
             <div className="bg-emerald-900/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-emerald-500/30">
               <BarChart className="w-6 h-6 text-emerald-400"/>
             </div>
             <h4 className="font-bold text-white mb-2">Performance vs. Compute</h4>
             <p className="text-xs text-slate-400 leading-relaxed">
               If you are deploying a real-time application (like live video generation), you <strong>cannot</strong> use semi-amortized inference due to the T optimization steps. If you are doing offline analysis where absolute accuracy is paramount, use it.
             </p>
           </div>

           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md hover:-translate-y-1 transition-transform">
             <div className="bg-rose-900/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-rose-500/30">
               <Sliders className="w-6 h-6 text-rose-400"/>
             </div>
             <h4 className="font-bold text-white mb-2">The Standard VAE Baseline</h4>
             <p className="text-xs text-slate-400 leading-relaxed">
               <strong>Implementation Effort:</strong> These methods require complex PyTorch/TensorFlow engineering (meta-gradients, nested expectations). Always start with a well-tuned standard VAE first to see if the engineering effort is actually necessary.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// MAIN APP SLIDESHOW WRAPPER
// ==========================================

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    // Auxiliary Variables Slides
    BottleneckSlide,
    AuxiliaryArchitectureSlide,
    MarginalizationSandboxSlide,
    TrainingImplementationSlide,
    AugmentedELBOSlide,
    AuxTradeoffsSlide,
    // Semi-Amortized Slides
    AmortizationGapSlide,
    TheParameterSwitchSlide,
    TheInnerLoopSlide,
    RefinementMathDeepDiveSlide,
    TheMissingLinkSlide,
    FlowchartSlide,
    GlobalTrainingLoopSlide, // <--- INJECTED NEW REPLACEMENT SLIDE HERE
    SynergiesSlide
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      <div className="w-full h-2 bg-slate-200 shrink-0">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

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

      <div className="flex justify-between items-center p-6 bg-white shadow-md z-10 border-t border-slate-200 shrink-0">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-slate-100 text-blue-600 hover:bg-blue-50 shadow-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex space-x-2 md:space-x-3 overflow-hidden">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-blue-600 scale-125' : 'bg-slate-300'}`}
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
  title: "Advanced Inference Techniques",
  subtitle: "Visualizing Auxiliary Variables and Semi-Amortized Inference in VAEs."
};

export default function App() {
  return (
    <div className="App h-full">
      <Slideshow />
    </div>
  );
}