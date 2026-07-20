import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Activity, 
  HelpCircle, Target, ArrowRight, Merge, 
  Split, BarChart2, PieChart, BrainCircuit, 
  Calculator, ArrowDown, RotateCcw, Cpu, 
  TrendingDown, ArrowLeftRight, AlertTriangle, 
  CheckCircle, Zap, FileWarning, ArrowUpRight,
  Car, Bus, Map, Filter, Minimize, Maximize,
  Database, Eye, Settings2, Unlink
} from 'lucide-react';

// --- SLIDE 1: Entropy (H) ---
const EntropySlide = () => {
  const [prob, setProb] = useState(50);

  const p = prob / 100;
  let entropy = 0;
  if (p > 0 && p < 1) {
    entropy = -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
  }

  const curvePoints = [];
  for (let i = 0; i <= 100; i += 2) {
    let px = i / 100;
    let py = 0;
    if (px > 0 && px < 1) {
      py = -px * Math.log2(px) - (1 - px) * Math.log2(1 - px);
    }
    curvePoints.push(`${i},${100 - (py * 100)}`);
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Quantifying Uncertainty: Entropy H(X)</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Entropy measures the average amount of "surprise" or uncertainty. A highly predictable event has low entropy; a completely random event has maximum entropy.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto w-full flex-grow items-stretch pb-8">
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 flex flex-col items-center relative">
           <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-widest flex items-center gap-2">
             <PieChart className="w-5 h-5 text-indigo-500"/> Biased Coin Simulator
           </h3>
           <div className="flex-grow w-full flex flex-col items-center justify-center gap-8">
              <div className="flex gap-4 items-center">
                 <div className="flex flex-col items-center">
                   <div className="w-24 h-24 rounded-full border-4 border-emerald-400 bg-emerald-100 flex items-center justify-center shadow-lg relative overflow-hidden">
                     <div className="absolute bottom-0 w-full bg-emerald-300" style={{ height: `${prob}%` }}></div>
                     <span className="font-bold text-emerald-800 z-10 text-xl">HEADS</span>
                   </div>
                   <span className="mt-2 font-mono font-bold text-emerald-600">{prob}%</span>
                 </div>
                 <div className="flex flex-col items-center">
                   <div className="w-24 h-24 rounded-full border-4 border-rose-400 bg-rose-100 flex items-center justify-center shadow-lg relative overflow-hidden">
                     <div className="absolute bottom-0 w-full bg-rose-300" style={{ height: `${100 - prob}%` }}></div>
                     <span className="font-bold text-rose-800 z-10 text-xl">TAILS</span>
                   </div>
                   <span className="mt-2 font-mono font-bold text-rose-600">{100 - prob}%</span>
                 </div>
              </div>
              <div className="w-full max-w-xs flex flex-col gap-2">
                 <div className="flex justify-between text-xs font-bold text-slate-500">
                   <span>Always Tails</span>
                   <span>Fair Coin</span>
                   <span>Always Heads</span>
                 </div>
                 <input type="range" min="0" max="100" value={prob} onChange={(e) => setProb(e.target.value)} className="w-full accent-indigo-500" />
              </div>
           </div>
        </div>

        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col text-white">
           <div className="flex justify-between items-start mb-6">
             <h3 className="font-bold text-slate-200 text-lg flex items-center gap-2">
               <Activity className="w-5 h-5 text-blue-400"/> Entropy Curve
             </h3>
             <div className="bg-slate-900 border border-slate-600 px-3 py-1 rounded text-right">
               <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Current Entropy</span>
               <span className="font-mono font-bold text-blue-400 text-xl">{entropy.toFixed(2)} bits</span>
             </div>
           </div>
           <div className="flex-grow relative bg-slate-900 rounded-xl border border-slate-700 p-4 flex items-end">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', backgroundSize: '10% 20%', backgroundPosition: 'left bottom' }}></div>
              <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <polyline points={curvePoints.join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2" />
                 <motion.circle cx={prob} cy={100 - (entropy * 100)} r="3" fill="#60a5fa" className="shadow-[0_0_10px_#60a5fa]" />
                 <motion.line x1={prob} y1="100" x2={prob} y2={100 - (entropy * 100)} stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
              <span className="absolute -bottom-5 left-0 text-[10px] text-slate-500">P(x)=0</span>
              <span className="absolute -bottom-5 right-0 text-[10px] text-slate-500">P(x)=1</span>
           </div>
           <div className="mt-8 bg-slate-700 border border-slate-600 p-4 rounded-xl">
             <div className="font-mono text-xs text-blue-300 text-center mb-2">H(X) = - ∑ P(x) log₂ P(x)</div>
             <p className="text-xs text-slate-300 text-center">Entropy is <strong>maximized</strong> when outcomes are equally likely (a fair coin). It drops to <strong>zero</strong> when an outcome is completely certain.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- SLIDE 2: Mutual Information ---
const MutualInformationSlide = () => {
  const [overlap, setOverlap] = useState(50);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Mutual Information: I(X;Z)</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Mutual Information measures how much knowing one variable (like Latent <span className="font-mono font-bold">Z</span>) reduces your uncertainty about another (like Input <span className="font-mono font-bold">X</span>).
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col items-center relative overflow-hidden">
           <h3 className="font-bold text-slate-700 mb-8 text-sm uppercase tracking-widest flex items-center gap-2">
             <Merge className="w-5 h-5 text-purple-500"/> Information Venn Diagram
           </h3>
           <div className="flex-grow w-full relative flex items-center justify-center h-64">
              <motion.div className="absolute w-48 h-48 rounded-full border-4 border-blue-500 bg-blue-500/20 mix-blend-multiply flex items-center justify-center" animate={{ x: -60 + (overlap * 0.6) }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
                 <span className="text-blue-800 font-bold font-mono absolute top-4">H(X)</span>
                 <span className="text-[10px] font-bold text-blue-700/50 absolute left-4 w-20 text-center leading-tight">Info in Input Image</span>
              </motion.div>
              <motion.div className="absolute w-48 h-48 rounded-full border-4 border-purple-500 bg-purple-500/20 mix-blend-multiply flex items-center justify-center" animate={{ x: 60 - (overlap * 0.6) }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
                 <span className="text-purple-800 font-bold font-mono absolute top-4">H(Z)</span>
                 <span className="text-[10px] font-bold text-purple-700/50 absolute right-4 w-20 text-center leading-tight">Info in Latent Code</span>
              </motion.div>
              <AnimatePresence>
                {overlap > 10 && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute z-10 flex flex-col items-center">
                     <span className="text-slate-800 font-bold font-mono bg-white/80 px-2 py-1 rounded shadow-sm border border-slate-200">I(X;Z)</span>
                     <span className="text-[10px] font-bold text-slate-600 bg-white/80 px-1 mt-1 rounded">Mutual Info</span>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
           <div className="w-full max-w-sm mt-8 flex flex-col gap-2">
             <div className="flex justify-between text-xs font-bold text-slate-500">
               <span>Independent (I=0)</span>
               <span>Highly Dependent</span>
             </div>
             <input type="range" min="0" max="100" value={overlap} onChange={(e) => setOverlap(e.target.value)} className="w-full accent-purple-500" />
           </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
           <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl shadow-sm">
             <div className="font-mono text-sm font-bold text-blue-800 mb-2 border-b border-blue-200 pb-2">I(X;Z) = H(X) - H(X|Z)</div>
             <p className="text-sm text-slate-600 leading-relaxed">
               <strong>In English:</strong> The Mutual Information is the total info in X, <em>minus</em> the info in X that is still a mystery after we look at Z. 
             </p>
           </div>
           <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex-grow">
             <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-emerald-500"/> Goal for Encoders</h4>
             <p className="text-sm text-slate-600 mb-4">We want the latent code Z to retain as much relevant information about the input X as possible. Thus, <strong>high I(X;Z) is desirable.</strong></p>
             <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 mt-6"><Split className="w-4 h-4 text-rose-500"/> Goal for Disentanglement</h4>
             <p className="text-sm text-slate-600">Within the latent vector itself, we want dimensions to capture <em>different</em> things (like color vs shape). Thus, we want <strong>low I(Z₁;Z₂)</strong> between individual dimensions.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- SLIDE 3: The Core KL Definition ---
const KLDefinitionSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">What is KL Divergence?</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Before the math, let's understand the concept. KL divergence, is a measure of how one probability distribution differs from a second, reference probability distribution. KL Divergence, denoted <span className="font-mono bg-slate-200 px-1 rounded text-sm">D_KL(P||Q)</span>, measures <strong>the information lost</strong> when you use an approximation (Q) instead of the true distribution (P).
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto w-full flex-grow items-center pb-8">
        
        <div className="flex-1 bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-700 text-white w-full">
           <h3 className="font-bold text-blue-400 mb-6 text-sm uppercase tracking-widest flex items-center gap-2">
             <Calculator className="w-5 h-5"/> The Equation
           </h3>
           <div className="flex justify-center mb-8">
              <span className="font-mono text-xl md:text-2xl font-bold bg-slate-800 p-4 rounded-xl shadow-inner border border-slate-600">
                D<sub className="text-sm">KL</sub>(<span className="text-blue-400">P</span>||<span className="text-purple-400">Q</span>) = Σ <span className="text-blue-400">P(x)</span> ln( <span className="text-blue-400">P(x)</span> / <span className="text-purple-400">Q(x)</span> )
              </span>
           </div>
           
           <ul className="space-y-6">
             <li className="flex gap-4 items-start">
               <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-bold font-mono">P</div>
               <div>
                 <strong className="text-blue-300">The True Distribution (Reference)</strong>
                 <p className="text-xs text-slate-400 mt-1">The actual expected data. In the formula, it acts as a weight. We only care about errors where <span className="font-mono">P(x)</span> is actually happening.</p>
               </div>
             </li>
             <li className="flex gap-4 items-start">
               <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 font-bold font-mono">Q</div>
               <div>
                 <strong className="text-purple-300">The Approximation (Model)</strong>
                 <p className="text-xs text-slate-400 mt-1">Our model's attempt to guess the truth. We are measuring how badly <span className="font-mono">Q</span> fails to match <span className="font-mono">P</span>.</p>
               </div>
             </li>
             <li className="flex gap-4 items-start">
               <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold font-mono">ln</div>
               <div>
                 <strong className="text-emerald-300">The Penalty Term</strong>
                 <p className="text-xs text-slate-400 mt-1">If P and Q match exactly, <span className="font-mono">P/Q = 1</span>, and <span className="font-mono">ln(1) = 0</span> (No Penalty!).</p>
               </div>
             </li>
           </ul>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col w-full">
           <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-widest flex items-center gap-2">
             <Activity className="w-5 h-5 text-indigo-500"/> The "Extra Bits" Analogy
           </h3>
           <p className="text-sm text-slate-600 mb-8 leading-relaxed">
             Imagine trying to compress and send a file over the internet. If you know exactly how the file is structured (<strong>Distribution P</strong>), you can build the perfect zip algorithm.
           </p>

           <div className="flex flex-col gap-6 relative">
              <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl flex justify-between items-center z-10">
                <div>
                  <h4 className="font-bold text-blue-800 text-xs">Using the Perfect Code (P)</h4>
                  <p className="text-[10px] text-slate-500">File compresses perfectly.</p>
                </div>
                <div className="font-mono font-bold text-blue-600 bg-white px-3 py-1 rounded shadow-sm border border-blue-100">100 kb</div>
              </div>

              <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-xl flex justify-between items-center z-10">
                <div>
                  <h4 className="font-bold text-purple-800 text-xs">Using a Flawed Approximation (Q)</h4>
                  <p className="text-[10px] text-slate-500">Suboptimal compression causes bloat.</p>
                </div>
                <div className="font-mono font-bold text-purple-600 bg-white px-3 py-1 rounded shadow-sm border border-purple-100">135 kb</div>
              </div>

              <div className="absolute right-6 top-1/2 bottom-1/4 w-8 border-r-2 border-b-2 border-rose-400 border-dashed rounded-br-xl"></div>
              <div className="absolute right-0 bottom-[-20px] bg-rose-100 border border-rose-400 text-rose-700 font-bold text-xs px-2 py-1 rounded shadow-md flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3"/> +35 kb Extra Bits
              </div>
           </div>

           <p className="text-sm text-slate-600 mt-12 bg-slate-50 p-4 rounded-lg border border-slate-100">
             <strong>KL Divergence is literally measuring those 35 extra kilobytes!</strong> It tells us the expected number of extra bits required to encode the data because we used the wrong assumption (<span className="font-mono">Q</span>) instead of the truth (<span className="font-mono">P</span>).
           </p>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 4: The Infinity Trap & Smoothing ---
const KLSmoothingSlide = () => {
  const [smoothed, setSmoothed] = useState(false);

  const P = { a: 0.60, b: 0.20, c: 0.20, d: 0.00 };
  const Q_unsmoothed = { a: 0.55, b: 0.34, c: 0.00, d: 0.11 };
  const epsilon = 0.01;
  const Q_smoothed = { a: 0.55 - epsilon/3, b: 0.34 - epsilon/3, c: epsilon, d: 0.11 - epsilon/3 };

  const currentQ = smoothed ? Q_smoothed : Q_unsmoothed;

  const getPenalty = (x) => {
    const p = P[x];
    const q = currentQ[x];
    if (p === 0) return 0; 
    if (q === 0) return Infinity; 
    return p * Math.log(p / q);
  };

  const totalKL = getPenalty('a') + getPenalty('b') + getPenalty('c') + getPenalty('d');

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The Infinity Trap & Smoothing</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          What happens to the math if our Model <span className="font-mono bg-slate-200 px-1 rounded text-purple-600">Q</span> predicts something is <em>completely impossible</em>, but the Reality <span className="font-mono bg-slate-200 px-1 rounded text-blue-600">P</span> proves it actually happens?
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto w-full flex-grow items-stretch pb-8">
        
        <div className="flex-[1.2] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col relative overflow-hidden">
           <h3 className="font-bold text-slate-700 mb-6 text-sm uppercase tracking-widest flex justify-between items-center">
             <span>Probability Distributions</span>
             <button 
               onClick={() => setSmoothed(!smoothed)}
               className={`px-4 py-1.5 rounded-full font-bold text-xs transition-colors shadow-sm border ${smoothed ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-rose-100 text-rose-700 border-rose-300'}`}
             >
               {smoothed ? "Epsilon Smoothing ON" : "Smoothing OFF"}
             </button>
           </h3>

           <div className="w-full flex flex-col gap-4">
             <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2 px-2">
                <div className="w-12">Event</div>
                <div className="flex-1 text-blue-500 text-center">True P(x)</div>
                <div className="flex-1 text-purple-500 text-center">Model Q(x)</div>
                <div className="flex-1 text-slate-600 text-right">Penalty Score</div>
             </div>

             {['a', 'b', 'c', 'd'].map((event) => {
                const penalty = getPenalty(event);
                const isInfinity = penalty === Infinity;
                
                return (
                  <div key={event} className={`flex items-center text-sm font-mono p-2 rounded-lg transition-colors ${isInfinity ? 'bg-rose-50 border border-rose-200' : 'hover:bg-slate-50'}`}>
                    <div className="w-12 font-bold text-slate-700 uppercase">{event}</div>
                    
                    <div className="flex-1 flex flex-col items-center justify-center relative group">
                       <span className="z-10">{P[event].toFixed(2)}</span>
                       <div className="absolute bottom-0 left-0 h-1 bg-blue-400 rounded-full transition-all" style={{ width: `${P[event]*100}%` }}></div>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center justify-center relative group">
                       <span className={`z-10 transition-colors ${currentQ[event] === 0 ? 'text-rose-500 font-bold' : ''}`}>
                         {currentQ[event].toFixed(3)}
                       </span>
                       <div className="absolute bottom-0 left-0 h-1 bg-purple-400 rounded-full transition-all" style={{ width: `${currentQ[event]*100}%` }}></div>
                    </div>
                    
                    <div className="flex-1 flex justify-end items-center">
                       {isInfinity ? (
                         <span className="bg-rose-500 text-white font-bold px-2 py-0.5 rounded text-xs animate-pulse">INFINITY!</span>
                       ) : (
                         <span className="text-slate-600">{penalty.toFixed(3)}</span>
                       )}
                    </div>
                  </div>
                );
             })}
           </div>

           <div className={`mt-auto pt-6 border-t ${totalKL === Infinity ? 'border-rose-200' : 'border-slate-200'} flex justify-between items-center`}>
              <span className="font-bold text-slate-700">Total KL Divergence:</span>
              <span className={`font-mono text-3xl font-bold ${totalKL === Infinity ? 'text-rose-600' : 'text-emerald-600'}`}>
                {totalKL === Infinity ? '∞' : totalKL.toFixed(3)}
              </span>
           </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
           
           <div className="bg-rose-50 p-6 rounded-2xl shadow-sm border border-rose-200">
             <h4 className="font-bold text-rose-800 mb-2 flex items-center gap-2"><FileWarning className="w-5 h-5"/> The Infinity Trap</h4>
             <p className="text-sm text-slate-700 leading-relaxed mb-4">
               Look at Event <strong>C</strong>. The real world <span className="font-mono text-blue-600">P</span> says it happens 20% of the time. But our flawed model <span className="font-mono text-purple-600">Q</span> predicts it happens <strong>0%</strong> of the time.
             </p>
             <div className="bg-white border border-rose-200 p-2 rounded text-xs font-mono text-rose-700 text-center">
               Penalty = 0.20 * ln( 0.20 / 0 ) = ∞
             </div>
             <p className="text-sm text-slate-700 leading-relaxed mt-4">
               In math, dividing by zero breaks everything. The penalty becomes infinite because the model was absolutely, confidently wrong about something that actually exists.
             </p>
           </div>

           <div className="bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-200 flex-grow">
             <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5"/> The Smoothing Fix</h4>
             <p className="text-sm text-slate-700 leading-relaxed mb-4">
               In practice, it's unreasonable to predict that an event is "completely impossible." We might just lack the data.
             </p>
             <p className="text-sm text-slate-700 leading-relaxed">
               <strong>Smoothing</strong> fixes this. We steal a tiny fraction of probability (e.g., <span className="font-mono font-bold text-emerald-600 border-b border-emerald-400">ε = 0.01</span>) from the other events and give it to the zero-probability event. 
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- SLIDE 5: KL Properties ---
const KLTheorySlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Fundamental Properties of KL Divergence</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          KL Divergence is often used as a "distance" metric in machine learning loss functions, but it has some very unique mathematical quirks.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto w-full flex-grow items-stretch pb-8">
        
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col items-center text-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-bl-full opacity-50"></div>
          <div className="w-24 h-24 bg-emerald-50 border-4 border-emerald-400 rounded-full flex items-center justify-center font-mono font-bold text-4xl shrink-0 text-emerald-600 shadow-sm mb-6 z-10">
            ≥ 0
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4 z-10">Always Non-Negative</h3>
          <p className="text-slate-600 z-10">
            Information distance can never be negative. You can never have "less than zero" lost information when approximating a curve. The lowest possible score is exactly 0.
          </p>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col items-center text-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full opacity-50"></div>
          <div className="w-24 h-24 bg-blue-50 border-4 border-blue-400 rounded-full flex items-center justify-center font-mono font-bold text-4xl shrink-0 text-blue-600 shadow-sm mb-6 z-10">
            = 0
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4 z-10">Identity (P = Q)</h3>
          <p className="text-slate-600 z-10">
            The divergence is exactly zero <strong>if and only if</strong> the two distributions match perfectly everywhere. This is what makes it a perfect target for Neural Network loss functions!
          </p>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 6: Asymmetry: A Real-World Example ---
const KLAsymmetryRealWorldSlide = () => {
  const [klMode, setKlMode] = useState('forward');

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Asymmetry: Forward vs Reverse KL</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          KL Divergence is <strong>not symmetric</strong>. Let's see how placing the Target in the first slot vs the second slot entirely changes the network's behavior.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Interactive Visualizer */}
        <div className="flex-[1.5] bg-slate-800 rounded-2xl shadow-2xl border-4 border-slate-700 p-6 flex flex-col relative overflow-hidden">
           
           <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-600 pb-2 flex justify-between items-center">
             Choose the Loss Function:
             <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-600 font-sans shadow-inner">
               <button onClick={() => setKlMode('forward')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${klMode === 'forward' ? 'bg-slate-700 text-rose-400 shadow-sm border border-slate-500' : 'text-slate-500 hover:text-slate-300'}`}>
                 Forward KL
               </button>
               <button onClick={() => setKlMode('reverse')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${klMode === 'reverse' ? 'bg-slate-700 text-emerald-400 shadow-sm border border-slate-500' : 'text-slate-500 hover:text-slate-300'}`}>
                 Reverse KL
               </button>
               <button onClick={() => setKlMode('vae')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${klMode === 'vae' ? 'bg-slate-700 text-purple-400 shadow-sm border border-slate-500' : 'text-slate-500 hover:text-slate-300'}`}>
                 VAE Context
               </button>
             </div>
           </h3>
           
           <div className="flex-grow relative bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden flex items-end shadow-inner h-64 shrink-0">
              
              {/* Background Grid */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '10% 20%', backgroundPosition: 'left bottom' }}></div>

              {/* The "Truth" P */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none">
                {klMode === 'vae' ? (
                  // Unimodal Prior for VAE
                  <path d="M 0,100 C 30,100 40,20 50,20 C 60,20 70,100 100,100" fill="rgba(168, 85, 247, 0.3)" stroke="#a855f7" strokeWidth="2"/>
                ) : (
                  // Bimodal Reality for Forward/Reverse generic explanation
                  <path d="M 0,100 C 10,100 15,20 25,20 C 35,20 40,100 50,100 C 60,100 65,20 75,20 C 85,20 90,100 100,100" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="2"/>
                )}
              </svg>

              {/* Labels for True P */}
              {klMode !== 'vae' && (
                <>
                  <div className="absolute bottom-4 left-[25%] transform -translate-x-1/2 flex flex-col items-center text-blue-300 opacity-80">
                     <Car className="w-6 h-6 mb-1"/>
                     <span className="text-[10px] font-bold">Drive (25m)</span>
                  </div>
                  <div className="absolute bottom-4 left-[75%] transform -translate-x-1/2 flex flex-col items-center text-blue-300 opacity-80">
                     <Bus className="w-6 h-6 mb-1"/>
                     <span className="text-[10px] font-bold">Bus (75m)</span>
                  </div>
                </>
              )}
              {klMode === 'vae' && (
                <div className="absolute bottom-4 left-[50%] transform -translate-x-1/2 flex flex-col items-center text-purple-300 opacity-80">
                   <Target className="w-6 h-6 mb-1"/>
                   <span className="text-[10px] font-bold">Target Prior N(0,1)</span>
                </div>
              )}

              {/* The "Model Guess" Q */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <AnimatePresence mode="wait">
                  {klMode === 'forward' && (
                    <motion.path 
                      key="fwd" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                      d="M 0,100 C 20,100 25,50 50,50 C 75,50 80,100 100,100" fill="none" stroke="#f43f5e" strokeWidth="4" strokeDasharray="4 4" 
                    />
                  )}
                  {klMode === 'reverse' && (
                    <motion.path 
                      key="rev" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                      d="M 0,100 C 15,100 20,20 25,20 C 30,20 35,100 50,100" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="4 4" 
                    />
                  )}
                  {klMode === 'vae' && (
                    <motion.path 
                      key="vae" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                      d="M 0,100 C 35,100 45,20 50,20 C 55,20 65,100 100,100" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="4 4" 
                    />
                  )}
                </AnimatePresence>
              </svg>

              <div className="absolute top-4 left-4 flex flex-col gap-2 bg-slate-800/80 p-3 rounded-lg shadow-sm border border-slate-600 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-sm border ${klMode==='vae' ? 'bg-purple-500/50 border-purple-500' : 'bg-blue-500/50 border-blue-500'}`}></div>
                  <span className="text-[11px] font-bold text-slate-300">Target (P)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 border-b-4 border-dashed border-white"></div>
                  <span className="text-[11px] font-bold text-slate-300">Encoder's Guess (Q)</span>
                </div>
              </div>
           </div>
        </div>

        {/* Text Explanations */}
        <div className="flex-1 flex flex-col gap-4">
           
           {klMode === 'forward' && (
             <div className="p-6 rounded-2xl shadow-sm border-2 transition-colors duration-500 flex-grow flex flex-col justify-center bg-rose-900/20 border-rose-500/50">
               <h4 className="font-bold mb-3 flex items-center gap-2 text-rose-400">
                 <ArrowRight className="w-5 h-5"/> Forward KL: Mean-Seeking
               </h4>
               <div className="font-mono text-[10px] bg-slate-900/50 p-2 rounded mb-4 text-slate-400 border border-slate-600">
                 D_KL(<span className="text-blue-400 font-bold">P</span>||<span className="text-rose-400 font-bold">Q</span>)
               </div>
               <p className="text-sm text-slate-300 leading-relaxed">
                 Because <strong>Target P</strong> is in the first slot, the formula shouts: <em>"If Target happens, you MUST guess it, or penalty is infinity!"</em>
                 <br/><br/>
                 To avoid infinity, our guess stretches its single bell curve to cover <em>both</em> the Drive and the Bus peaks. <strong>Result:</strong> It guesses ~50 mins. But Bob <em>never</em> takes 50 mins! The model is "safe" but useless.
               </p>
             </div>
           )}

           {klMode === 'reverse' && (
             <div className="p-6 rounded-2xl shadow-sm border-2 transition-colors duration-500 flex-grow flex flex-col justify-center bg-emerald-900/20 border-emerald-500/50">
               <h4 className="font-bold mb-3 flex items-center gap-2 text-emerald-400">
                 <ArrowLeftRight className="w-5 h-5"/> Reverse KL: Mode-Seeking
               </h4>
               <div className="font-mono text-[10px] bg-slate-900/50 p-2 rounded mb-4 text-slate-400 border border-slate-600">
                 D_KL(<span className="text-emerald-400 font-bold">Q</span>||<span className="text-blue-400 font-bold">P</span>)
               </div>
               <p className="text-sm text-slate-300 leading-relaxed">
                 Here, the <strong>Guess Q</strong> is in the first slot! The formula shouts: <em>"If you guess a spot where the Target is empty, penalty is infinity!"</em>
                 <br/><br/>
                 The guess becomes terrified of the empty 50-minute middle zone. Instead of stretching, it safely tucks itself into just <em>one</em> real peak. <strong>Result:</strong> It drops a mode and is completely wrong 50% of the time!
               </p>
             </div>
           )}

           {klMode === 'vae' && (
             <div className="p-6 rounded-2xl shadow-sm border-2 transition-colors duration-500 flex-grow flex flex-col justify-center bg-purple-900/20 border-purple-500/50">
               <h4 className="font-bold mb-3 flex items-center gap-2 text-purple-400">
                 <BrainCircuit className="w-5 h-5"/> VAE Context: Why it's safe!
               </h4>
               <div className="font-mono text-[10px] bg-slate-900/50 p-2 rounded mb-4 text-slate-400 border border-slate-600">
                 D_KL(<span className="text-blue-400 font-bold">Encoder_Q</span>||<span className="text-purple-400 font-bold">Prior_P</span>)
               </div>
               <p className="text-sm text-slate-300 leading-relaxed">
                 Your insight is absolutely correct! In a VAE, our Target <span className="font-mono">P</span> is a Standard Bell Curve. <strong>It only has ONE peak!</strong>
                 <br/><br/>
                 Because the target is perfectly unimodal, there are no "competing modes" for the Encoder to drop. Reverse KL loses its risky behavior and simply acts as a gentle, perfect rubber band, pulling the Encoder's guess cleanly to the center without any 50% accuracy penalty!
               </p>
             </div>
           )}

        </div>

      </div>
    </div>
  );
};

// --- SLIDE 7: KL Divergence Gaussian Simulator & Calculation ---
const KLDivergenceSlide = () => {
  const [muP, setMuP] = useState(2.5); 
  const [sigP, setSigP] = useState(0.5); 

  const muQ = 0;
  const sigQ = 1;

  // Safe variance calculation to avoid log(0)
  const safeVarP = Math.max(sigP * sigP, 0.01);
  
  // Breakdown of the VAE KL Loss Formula:
  // D_KL = 0.5 * (mu^2 + sigma^2 - log(sigma^2) - 1)
  const meanPenalty = muP * muP; 
  const varPenalty = safeVarP - Math.log(safeVarP) - 1;
  const klValue = 0.5 * (meanPenalty + varPenalty);

  const generateGaussianPath = (mu, sig, height, width) => {
    let path = `M 0,${height}`;
    for (let x = -5; x <= 5; x += 0.1) {
      const y = (1 / (sig * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sig, 2));
      const px = (x + 5) * (width / 10);
      const py = height - (y * height * 1.5); 
      path += ` L ${px},${py}`;
    }
    return path;
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Simulating the VAE KL-Loss</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Assume you are the VAE's loss function. Use the sliders to force the Encoder's distribution <span className="font-mono bg-slate-800 px-1 rounded text-blue-400">q(z|x)</span> to perfectly match the Standard Prior <span className="font-mono bg-slate-800 px-1 rounded text-purple-400">p(z)</span>.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Visual Simulator */}
        <div className="flex-[1.5] bg-slate-800 rounded-2xl shadow-2xl border-4 border-slate-700 p-6 flex flex-col relative overflow-hidden">
           <h3 className="font-bold text-slate-300 uppercase tracking-widest text-xs mb-4">Distribution Alignment Simulator</h3>
           
           <div className="w-full h-48 md:h-64 relative border-b-2 border-l-2 border-slate-600 mb-8 flex items-end">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', backgroundSize: '10% 20%', backgroundPosition: 'left bottom' }}></div>

              <svg className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none">
                 <path d={generateGaussianPath(muQ, sigQ, 256, 1000)} fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth="3" strokeDasharray="5 5" />
                 <path d={generateGaussianPath(muP, sigP, 256, 1000)} fill="rgba(59, 130, 246, 0.4)" stroke="#3b82f6" strokeWidth="4" />
                 <line x1={(muP + 5) * 10} y1="256" x2={(muP + 5) * 10} y2="0" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
              
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                 <div className="flex items-center gap-2">
                   <div className="w-4 h-1 border-b-2 border-dashed border-purple-500"></div>
                   <span className="text-[10px] font-mono text-purple-300 bg-slate-900/50 px-1 rounded">Target Prior p(z) = N(0,1)</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-4 h-1 bg-blue-500"></div>
                   <span className="text-[10px] font-mono text-blue-300 bg-slate-900/50 px-1 rounded">Encoder Guess q(z|x)</span>
                 </div>
              </div>
           </div>

           {/* Controls & Math Breakdown */}
           <div className="flex flex-col gap-6 w-full px-2">
              <div className="flex items-center gap-8 w-full">
                <div className="flex-1 flex flex-col gap-2">
                   <div className="flex justify-between text-xs font-bold text-slate-400">
                     <span>Shift Mean (μ)</span>
                     <span className="font-mono text-blue-400">{muP.toFixed(2)}</span>
                   </div>
                   <input type="range" min="-4" max="4" step="0.1" value={muP} onChange={(e) => setMuP(parseFloat(e.target.value))} className="w-full accent-blue-500" />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                   <div className="flex justify-between text-xs font-bold text-slate-400">
                     <span>Adjust Variance (σ²)</span>
                     <span className="font-mono text-blue-400">{safeVarP.toFixed(2)}</span>
                   </div>
                   {/* We bind the slider to standard deviation sigP for rendering, but display/think in terms of variance (sigP^2) for the math */}
                   <input type="range" min="0.2" max="2.0" step="0.05" value={sigP} onChange={(e) => setSigP(parseFloat(e.target.value))} className="w-full accent-blue-500" />
                </div>
              </div>

              {/* The Real-time Equation Breakdown */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-600 flex flex-col gap-2 shadow-inner">
                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1 border-b border-slate-700 pb-1">Real-Time Loss Calculation</div>
                <div className="flex justify-between items-center text-xs font-mono text-slate-300">
                  <span>0.5 * ( <span className="text-blue-400">Mean_Penalty</span> + <span className="text-rose-400">Var_Penalty</span> )</span>
                  <span className="font-bold text-emerald-400">Total Loss</span>
                </div>
                <div className="flex justify-between items-center text-sm font-mono font-bold">
                  <span>0.5 * ( <span className="text-blue-400">{meanPenalty.toFixed(2)}</span> + <span className="text-rose-400">{varPenalty.toFixed(2)}</span> )</span>
                  <span className="text-emerald-400 text-xl">={klValue.toFixed(3)}</span>
                </div>
              </div>
           </div>
        </div>

        {/* Info Context */}
        <div className="flex-1 flex flex-col gap-4">
           <div className={`p-6 rounded-2xl border-2 shadow-lg flex flex-col items-center justify-center transition-colors duration-300 ${klValue < 0.1 ? 'bg-emerald-900/40 border-emerald-500' : 'bg-slate-800 border-slate-700'}`}>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">KL Divergence Score</span>
              <div className="font-mono text-5xl font-bold flex items-center gap-2">
                <span className={klValue < 0.1 ? 'text-emerald-400' : 'text-white'}>
                  {klValue.toFixed(3)}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-2">D_KL( q || p ) ≥ 0</span>
              {klValue < 0.1 && <span className="mt-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Perfect Match!</span>}
           </div>

           <div className="bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-700 flex-grow flex flex-col justify-center">
             <h4 className="font-bold text-slate-200 mb-3 flex items-center gap-2"><Calculator className="w-4 h-4 text-blue-400"/> The Math Penalty</h4>
             <p className="text-sm text-slate-400 mb-4 leading-relaxed">
               The algebraic formula penalizes the Mean and Variance separately:
             </p>
             <ul className="text-xs text-slate-400 space-y-3 pl-2 border-l-2 border-slate-600">
               <li><strong className="text-blue-400">Mean Penalty (μ²):</strong> Simply squares the Mean. To get zero penalty, the Mean MUST slide perfectly to 0.</li>
               <li><strong className="text-rose-400">Variance Penalty (σ² - ln(σ²) - 1):</strong> To get zero penalty, Variance MUST be exactly 1. It heavily penalizes tiny variances (prevents points from collapsing to zero width) and large variances (prevents smearing).</li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- SLIDE 8: The Information Bottleneck Principle ---
const InformationBottleneckSlide = () => {
  const [beta, setBeta] = useState(1);

  // Derived styling based on beta (acts as the bottleneck width)
  const getBottleneckWidth = () => {
    if (beta === 0) return 96; // Wide open
    if (beta === 1) return 48; // Moderate
    return 16; // Tightly constrained
  };

  // Particles passing through
  const numParticles = 20;
  const particles = Array.from({length: numParticles}).map((_, i) => ({
    id: i,
    isSignal: i < 5, // Only 5 particles represent the core signal (relevant to Y)
    delay: Math.random() * 2
  }));

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The Information Bottleneck Principle</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          A formal framework for representation learning. The goal is to squeeze the input data <span className="font-mono font-bold text-blue-600">X</span> through a "bottleneck" <span className="font-mono font-bold text-emerald-600">Z</span> that discards irrelevant noise but retains all the information necessary for the target task <span className="font-mono font-bold text-rose-600">Y</span>.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* LEFT: Visualizer */}
        <div className="flex-[1.5] bg-slate-900 rounded-2xl shadow-xl border border-slate-700 p-8 flex flex-col relative overflow-hidden text-white">
           <h3 className="font-bold text-slate-300 mb-8 text-sm uppercase tracking-widest text-center">Interactive Structure</h3>

           <div className="flex-grow flex items-center justify-between relative w-full h-48 my-8 px-4">
              
              {/* Input X */}
              <div className="flex flex-col items-center z-10 w-24 shrink-0">
                 <div className="w-20 h-20 bg-blue-300 text-blue-900 font-bold flex flex-col items-center justify-center shadow-lg rounded-sm border-2 border-blue-400">
                    <span>Input</span>
                    <span className="text-xl font-mono mt-1">X</span>
                 </div>
                 <div className="mt-4 flex gap-1 flex-wrap w-full justify-center opacity-70">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span><span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_5px_#fb7185]"></span><span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="text-[9px] text-slate-400 mt-1 text-center leading-tight">Lots of noise,<br/>some signal</span>
                 </div>
              </div>

              {/* Arrow to Encoder */}
              <div className="flex-1 flex flex-col items-center relative z-0">
                 <span className="text-[10px] text-slate-400 mb-1 absolute -top-8 text-center w-full">Encoder q(Z|X)<br/>Constrain I(X;Z)</span>
                 <div className="w-full h-0.5 bg-slate-500"></div>
                 <div className="absolute right-0 w-0 h-0 border-l-[8px] border-l-slate-500 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent top-[-4px]"></div>
              </div>

              {/* The Bottleneck Z */}
              <div className="flex flex-col items-center z-10 shrink-0 w-48 transition-all duration-500 ease-in-out" style={{ transform: `scaleY(${beta === 0 ? 1 : beta === 1 ? 0.7 : 0.4})`}}>
                 <div className="w-full h-32 bg-emerald-200/90 text-emerald-900 border-2 border-emerald-400 rounded-[50%] flex flex-col items-center justify-center shadow-lg relative overflow-hidden backdrop-blur-sm">
                    <span className="font-bold text-xs">Representation</span>
                    <span className="text-lg font-mono font-bold my-1">Z</span>
                    <span className="text-[10px] opacity-80">(Bottleneck)</span>
                    
                    {/* Animated Particles flowing through */}
                    <div className="absolute inset-0 flex items-center justify-center">
                       {particles.map(p => {
                         // Only let signal through if bottleneck is tight
                         const willPass = beta === 0 ? true : beta === 1 ? (p.isSignal || p.id % 3 === 0) : p.isSignal;
                         return willPass && (
                           <motion.div 
                             key={p.id}
                             initial={{ x: -80, opacity: 0 }}
                             animate={{ x: 80, opacity: [0, 1, 1, 0] }}
                             transition={{ duration: 2, repeat: Infinity, delay: p.delay, ease: "linear" }}
                             className={`absolute w-2 h-2 rounded-full ${p.isSignal ? 'bg-rose-500 shadow-[0_0_8px_#fb7185] z-20' : 'bg-blue-400 opacity-40 z-10'}`}
                             style={{ top: `${20 + (p.id * 5) % 60}%` }}
                           />
                         )
                       })}
                    </div>
                 </div>
              </div>

              {/* Arrow to Target */}
              <div className="flex-1 flex flex-col items-center relative z-0">
                 <span className="text-[10px] text-slate-400 mb-1 absolute -top-8 text-center w-full">Task p(Y|Z)<br/>Maximize I(Z;Y)</span>
                 <div className="w-full h-0.5 bg-slate-500"></div>
                 <div className="absolute right-0 w-0 h-0 border-l-[8px] border-l-slate-500 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent top-[-4px]"></div>
              </div>

              {/* Target Y */}
              <div className="flex flex-col items-center z-10 w-24 shrink-0">
                 <div className="w-20 h-20 bg-rose-200 text-rose-900 font-bold flex flex-col items-center justify-center shadow-lg rounded-sm border-2 border-rose-400">
                    <span>Target</span>
                    <span className="text-xl font-mono mt-1">Y</span>
                 </div>
                 <div className="mt-4 flex gap-1 flex-wrap w-full justify-center opacity-70 min-h-[20px]">
                    <AnimatePresence>
                       {beta < 2 && <motion.span initial={{ opacity:0 }} animate={{opacity:1}} exit={{opacity:0}} className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_5px_#fb7185]"></motion.span>}
                       {beta < 2 && <motion.span initial={{ opacity:0 }} animate={{opacity:1}} exit={{opacity:0}} className="text-[9px] text-slate-400 w-full text-center leading-tight">Task<br/>Successful</motion.span>}
                       {beta === 2 && <motion.span initial={{ opacity:0 }} animate={{opacity:1}} exit={{opacity:0}} className="text-[9px] text-rose-400 font-bold w-full text-center leading-tight">Over-compressed!<br/>Signal lost.</motion.span>}
                    </AnimatePresence>
                 </div>
              </div>

           </div>

           {/* Interactive Slider */}
           <div className="mt-auto w-full max-w-md mx-auto flex flex-col gap-2 bg-slate-800 p-4 rounded-xl border border-slate-600">
             <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
               <span className={beta === 0 ? 'text-blue-400' : ''}>β = 0 (No Compression)</span>
               <span className={beta === 1 ? 'text-emerald-400' : ''}>β = 1 (Optimal)</span>
               <span className={beta === 2 ? 'text-rose-400' : ''}>β = High (Too Tight)</span>
             </div>
             <input type="range" min="0" max="2" step="1" value={beta} onChange={(e) => setBeta(parseInt(e.target.value))} className="w-full accent-emerald-500" />
           </div>

        </div>

        {/* RIGHT: Math & Theory */}
        <div className="flex-1 flex flex-col gap-4">
           
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h4 className="font-bold text-slate-800 mb-2 border-b pb-2">The IB Objective</h4>
             <div className="font-mono text-lg font-bold text-center bg-slate-100 py-3 rounded-xl border border-slate-300 text-slate-700 my-4 shadow-inner">
               L<sub className="text-xs">IB</sub> = I(Z;Y) - <span className="text-emerald-500">β</span> I(X;Z)
             </div>
             <p className="text-sm text-slate-600 leading-relaxed">
               We want to <strong>maximize</strong> this equation. It represents a tug-of-war between two opposing forces controlled by the Lagrange multiplier <span className="font-bold text-emerald-600">β</span>.
             </p>
           </div>

           <div className="flex flex-col gap-3 flex-grow">
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl">
                 <div className="font-bold text-rose-800 text-sm mb-1 flex items-center gap-2"><Target className="w-4 h-4"/> Maximize I(Z;Y)</div>
                 <p className="text-xs text-slate-700">The representation <span className="font-mono">Z</span> must retain as much information as possible about the final target <span className="font-mono">Y</span> to solve the task accurately.</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                 <div className="font-bold text-blue-800 text-sm mb-1 flex items-center gap-2"><Minimize className="w-4 h-4"/> Minimize I(X;Z)</div>
                 <p className="text-xs text-slate-700">Subtracting this term forces <span className="font-mono">Z</span> to "forget" information about the input <span className="font-mono">X</span> that isn't strictly necessary for the task. This acts as massive compression, shedding noise and preventing memorization.</p>
              </div>

              {beta === 0 && <div className="bg-slate-800 text-white text-xs p-3 rounded-lg animate-pulse font-medium">When β=0, the bottleneck is wide open. Z simply memorizes X (overfitting). No useful representation is learned.</div>}
              {beta === 1 && <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs p-3 rounded-lg font-medium shadow-sm">At optimal β, noise is squeezed out but the core signal survives. A robust representation is formed!</div>}
              {beta === 2 && <div className="bg-rose-100 text-rose-900 border border-rose-300 text-xs p-3 rounded-lg font-medium shadow-sm">When β is too high, the bottleneck is too tight. It accidentally squeezes out the target signal along with the noise!</div>}
           </div>

        </div>

      </div>
    </div>
  );
};

// --- SLIDE 9: Info Theory in Context of VAEs ---
const VAEInfoTheorySlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Information Theory in VAEs</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Information Theory isn't just an analytical tool—it is the literal blueprint for Variational Autoencoders. The VAE loss function is just a specific implementation of the Information Bottleneck principle!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Mapping Visualization */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col relative w-full">
           
           <h3 className="font-bold text-slate-700 mb-8 text-sm uppercase tracking-widest text-center border-b pb-2">The Direct Mapping</h3>

           <div className="flex flex-col gap-8 flex-grow justify-center">
              
              {/* Row 1: Reconstruction -> Maximize I */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 relative shadow-sm">
                 <div className="flex-1 flex flex-col items-center text-center px-2">
                    <span className="text-xs font-bold text-slate-500 uppercase mb-1">VAE Term</span>
                    <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 border border-blue-200 rounded">E[ log p(x|z) ]</span>
                    <span className="text-[10px] mt-1 text-slate-600 font-semibold">Reconstruction Accuracy</span>
                 </div>
                 
                 <div className="shrink-0 mx-2 text-slate-300">
                    <ArrowLeftRight className="w-6 h-6" />
                 </div>

                 <div className="flex-1 flex flex-col items-center text-center px-2">
                    <span className="text-xs font-bold text-slate-500 uppercase mb-1">Info Theory Concept</span>
                    <span className="font-mono text-sm font-bold text-rose-600 bg-rose-50 px-2 py-1 border border-rose-200 rounded">Maximize I(X;Z)</span>
                    <span className="text-[10px] mt-1 text-slate-600 font-semibold">Keep info to rebuild X</span>
                 </div>

                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-sm border border-slate-100 z-10 text-slate-400">
                   <Merge className="w-4 h-4"/>
                 </div>
              </div>

              {/* Row 2: KL Div -> Minimize I */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 relative shadow-sm">
                 <div className="flex-1 flex flex-col items-center text-center px-2">
                    <span className="text-xs font-bold text-slate-500 uppercase mb-1">VAE Term</span>
                    <span className="font-mono text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 border border-emerald-200 rounded">D_KL( q(z|x) || p(z) )</span>
                    <span className="text-[10px] mt-1 text-slate-600 font-semibold">Prior Regularization</span>
                 </div>
                 
                 <div className="shrink-0 mx-2 text-slate-300">
                    <ArrowLeftRight className="w-6 h-6" />
                 </div>

                 <div className="flex-1 flex flex-col items-center text-center px-2">
                    <span className="text-xs font-bold text-slate-500 uppercase mb-1">Info Theory Concept</span>
                    <span className="font-mono text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 border border-purple-200 rounded">Minimize I(X;Z)</span>
                    <span className="text-[10px] mt-1 text-slate-600 font-semibold">The Information Bottleneck</span>
                 </div>

                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-sm border border-slate-100 z-10 text-slate-400">
                   <Split className="w-4 h-4"/>
                 </div>
              </div>

           </div>

           <p className="text-xs text-center text-slate-500 mt-6 max-w-sm mx-auto">
             In a standard autoencoder, the target <span className="font-mono">Y</span> is just the input <span className="font-mono">X</span> itself. The VAE simultaneously tries to remember <span className="font-mono">X</span> while actively forgetting everything except the absolute core features!
           </p>
        </div>

        {/* Deep Dive Explanations */}
        <div className="flex-1 flex flex-col gap-4">
           
           <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm">
             <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2"><Database className="w-4 h-4"/> KL Divergence = Channel Capacity</h4>
             <p className="text-sm text-slate-700 leading-relaxed">
               Minimizing <span className="font-mono bg-white px-1 border rounded">D_KL</span> under Evidence Lower Bound (ELBO) maximization implicitly controls the <strong>channel capacity</strong> between X and Z.
             </p>
             <p className="text-xs text-slate-600 mt-2">
               If the divergence is forced to be low, the "pipe" (channel) carrying information from the Encoder to the Latent Space gets physically narrower in an information-theoretic sense. It cannot transmit raw pixel noise, forcing it to compress.
             </p>
           </div>

           <div className="bg-purple-50 border border-purple-200 p-5 rounded-2xl shadow-sm flex-grow">
             <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2"><Filter className="w-4 h-4"/> Disentanglement Guarantee</h4>
             <p className="text-sm text-slate-700 leading-relaxed mb-3">
               Information theory also explains why VAEs can achieve Disentanglement natively:
             </p>
             <ul className="text-xs text-slate-700 space-y-2 pl-4 list-disc marker:text-purple-400">
               <li>If the prior <span className="font-mono font-bold">p(z)</span> is factorial (meaning its dimensions $z_1$, $z_2$ are mathematically independent)...</li>
               <li>And we use KL Divergence to force our guess <span className="font-mono font-bold">q(z|x)</span> to closely mimic that prior...</li>
               <li>Then the dimensions of our learned representation are actively encouraged to be independent! <br/>(<span className="font-mono bg-white px-1 rounded border">I(Z_i ; Z_j) ≈ 0</span>)</li>
             </ul>
           </div>

        </div>

      </div>
    </div>
  );
};

// --- SLIDE 10: Evaluating Representations ---
const EvaluatingInfoSlide = () => {
  const [indep, setIndep] = useState(10); // 0 to 100 for visual independence

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Evaluating Representations</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          We use Mutual Information not just to train models, but to score them. We can precisely quantify the two hallmarks of a "good" representation: Informativeness and Disentanglement.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Informativeness */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-6 flex flex-col relative overflow-hidden">
           <h3 className="font-bold text-slate-200 mb-4 text-sm uppercase tracking-widest flex items-center gap-2 border-b border-slate-600 pb-2">
             <Eye className="w-5 h-5 text-blue-400"/> 1. Informativeness
           </h3>
           <p className="text-sm text-slate-400 mb-6">
             How much does a latent variable <span className="font-mono text-blue-300">Z_i</span> tell us about a known underlying factor in the data <span className="font-mono text-emerald-300">F_k</span>?
           </p>

           <div className="flex-grow flex flex-col items-center justify-center gap-6">
              <div className="flex items-center gap-6 bg-slate-900 p-6 rounded-xl border border-slate-700 w-full justify-center">
                 <div className="flex flex-col items-center">
                   <div className="w-16 h-16 bg-blue-500/20 border-2 border-blue-500 rounded flex items-center justify-center font-mono font-bold text-blue-400 shadow-inner">Z_1</div>
                   <span className="text-[10px] text-slate-400 mt-2">Latent Var 1</span>
                 </div>

                 <div className="flex flex-col items-center justify-center">
                    <span className="font-mono font-bold text-white bg-slate-800 px-3 py-1 rounded-full border border-slate-600 shadow-md z-10 whitespace-nowrap">
                      I(Z_1 ; F_size) = High
                    </span>
                    <div className="h-0.5 w-full bg-slate-600 -mt-3.5 z-0"></div>
                 </div>

                 <div className="flex flex-col items-center">
                   <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center font-mono font-bold text-emerald-400 shadow-inner">F_size</div>
                   <span className="text-[10px] text-slate-400 mt-2 text-center leading-tight">True Factor<br/>(Size)</span>
                 </div>
              </div>
              <p className="text-xs text-slate-500 text-center italic bg-slate-800 px-4 py-2 rounded">
                A high score proves that if we read Z_1, we mathematically know the exact Size of the object in the image.
              </p>
           </div>
        </div>

        {/* Disentanglement */}
        <div className="flex-[1.2] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-6 flex flex-col relative overflow-hidden">
           <h3 className="font-bold text-slate-200 mb-4 text-sm uppercase tracking-widest flex items-center gap-2 border-b border-slate-600 pb-2">
             <Unlink className="w-5 h-5 text-purple-400"/> 2. Disentanglement
           </h3>
           <p className="text-sm text-slate-400 mb-4">
             Are different latent variables statistically independent? <span className="font-mono text-rose-300">I(Z_i ; Z_j)</span> quantifies this. If they are entangled, moving one accidentally moves the other.
           </p>

           <div className="flex-grow flex flex-col items-center justify-center gap-4">
              
              <div className="relative w-full h-32 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex items-center justify-center">
                 {/* Visual representation of Independence vs Entanglement */}
                 <motion.div 
                   className="absolute w-24 h-24 rounded-full border-4 border-purple-500 bg-purple-500/30 mix-blend-screen flex items-center justify-center"
                   animate={{ x: -40 - (indep * 0.5) }}
                 >
                   <span className="text-purple-300 font-bold font-mono">Z_1</span>
                 </motion.div>

                 <motion.div 
                   className="absolute w-24 h-24 rounded-full border-4 border-rose-500 bg-rose-500/30 mix-blend-screen flex items-center justify-center"
                   animate={{ x: 40 + (indep * 0.5) }}
                 >
                   <span className="text-rose-300 font-bold font-mono">Z_2</span>
                 </motion.div>

                 <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-slate-600 px-2 py-1 rounded text-xs font-mono font-bold text-white z-10">
                   I(Z_1 ; Z_2) = {Math.max(0, 100 - indep * 2).toFixed(1)}
                 </div>
              </div>

              <div className="w-full max-w-sm flex flex-col gap-2 mt-4 bg-slate-800 p-4 rounded-xl border border-slate-600 shadow-sm">
                 <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   <span className={indep < 20 ? 'text-rose-400' : ''}>Entangled</span>
                   <span className={indep > 80 ? 'text-emerald-400' : ''}>Fully Disentangled</span>
                 </div>
                 <input type="range" min="0" max="50" value={indep} onChange={(e) => setIndep(parseInt(e.target.value))} className="w-full accent-purple-500" />
                 <p className="text-[10px] text-slate-400 mt-2 text-center leading-tight">
                   {indep < 20 ? "High Mutual Info! Z_1 and Z_2 are sharing redundant information. If you change Z_1, Z_2 is also affected." : "Low Mutual Info! Z_1 and Z_2 are completely statistically independent."}
                 </p>
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
    EntropySlide,
    MutualInformationSlide,
    KLDefinitionSlide,
    KLSmoothingSlide,
    KLTheorySlide,
    KLAsymmetryRealWorldSlide,
    KLDivergenceSlide,
    InformationBottleneckSlide,
    VAEInfoTheorySlide,
    EvaluatingInfoSlide
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
          className="p-3 rounded-full bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          disabled={currentSlide === 0}
        >
          <ChevronLeft />
        </button>
        
        <div className="flex space-x-1 sm:space-x-1.5 md:space-x-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full transition-all ${i === currentSlide ? 'bg-indigo-600 scale-125' : 'bg-slate-300'}`}
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