import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Calculator, 
  ArrowRight, Target, CheckCircle, 
  Zap, ShieldAlert, AlertTriangle, 
  BrainCircuit, Crosshair, Scale, 
  Layers, Combine, MoveHorizontal, Search, XCircle
} from 'lucide-react';

// --- SLIDE 1: The ELBO Recap & The Two Forces ---
const ELBOReviewSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The ELBO: A Tale of Two Forces</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Before diving deep into the math, let's remind ourselves of the core objective function we are maximizing: the Evidence Lower Bound (ELBO).
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-center pb-8">
        
        {/* The Equation Box */}
        <div className="w-full lg:w-full bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-700 flex flex-col items-center">
           <h3 className="font-bold text-slate-400 mb-6 text-sm uppercase tracking-widest flex items-center gap-2">
             <Calculator className="w-5 h-5 text-indigo-400"/> The VAE Objective
           </h3>
           
           <div className="font-mono text-xl md:text-3xl font-bold text-white flex flex-wrap justify-center items-center gap-4 bg-black/40 p-6 rounded-2xl border border-slate-700 w-full max-w-4xl">
             <span className="text-slate-200">L<sub className="text-lg">ELBO</sub> =</span>
             
             <div className="flex flex-col items-center group relative">
                <span className="bg-blue-900/50 text-blue-400 border-2 border-blue-500/50 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  E<sub className="text-sm">q<sub className="text-[10px]">φ</sub>(z|x)</sub>[log p<sub className="text-sm">θ</sub>(x|z)]
                </span>
                <span className="absolute -bottom-8 text-blue-400 text-xs font-bold uppercase tracking-widest whitespace-nowrap">Reconstruction</span>
             </div>
             
             <span className="text-slate-500 text-4xl mx-2">-</span>
             
             <div className="flex flex-col items-center group relative">
                <span className="bg-rose-900/50 text-rose-400 border-2 border-rose-500/50 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                  D<sub className="text-sm">KL</sub>( q<sub className="text-[10px]">φ</sub>(z|x) || p(z) )
                </span>
                <span className="absolute -bottom-8 text-rose-400 text-xs font-bold uppercase tracking-widest whitespace-nowrap">KL Divergence</span>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 w-full max-w-4xl">
              <div className="bg-blue-950/30 border border-blue-500/30 p-6 rounded-xl flex flex-col items-center text-center">
                 <Target className="w-8 h-8 text-blue-400 mb-3" />
                 <h4 className="font-bold text-blue-300 text-lg mb-2">The Likelihood Force</h4>
                 <p className="text-sm text-slate-400">Encourages the Decoder to accurately rebuild the input <span className="font-mono text-blue-300">x</span> from the latent representation <span className="font-mono text-blue-300">z</span>. It fights to store specific details.</p>
              </div>
              
              <div className="bg-rose-950/30 border border-rose-500/30 p-6 rounded-xl flex flex-col items-center text-center">
                 <ShieldAlert className="w-8 h-8 text-rose-400 mb-3" />
                 <h4 className="font-bold text-rose-300 text-lg mb-2">The Regularizing Force</h4>
                 <p className="text-sm text-slate-400">Because it is <em>subtracted</em>, maximizing ELBO means <strong>minimizing</strong> this KL term. It fights to force the Encoder's output to look exactly like a generic Bell Curve.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 2: What are Q and P? ---
const QvsPSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Understanding the Distributions: Q vs P</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          KL Divergence measures "information loss" or "extra bits" needed when we use one distribution to approximate another. But what exactly are the two distributions we are comparing in a VAE?
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: Explaining Q */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border-t-8 border-blue-500 p-6 flex flex-col relative overflow-hidden">
           <h3 className="text-2xl font-bold text-slate-800 mb-1 flex items-center gap-2">
             <BrainCircuit className="w-6 h-6 text-blue-500"/> The Approximate Posterior
           </h3>
           <div className="font-mono text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded inline-block mb-4 border border-blue-200 w-max">
             q_φ(z|x)
           </div>
           
           <p className="text-sm text-slate-600 mb-6">
             This is the output of our <strong>Encoder Network</strong> (with weights <span className="font-mono font-bold text-blue-500">φ</span>) after looking at a specific image <span className="font-mono font-bold text-slate-700">x</span>. 
           </p>

           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex-grow flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">It is usually a Gaussian:</span>
              <div className="font-mono font-bold text-sm bg-white border border-slate-300 px-4 py-2 rounded shadow-inner text-slate-700 text-center">
                 N( μ_φ(x), diag(σ²_φ(x)) )
              </div>
              <p className="text-xs text-slate-500 mt-4 text-center">
                The network outputs a <strong>Mean vector</strong> (the center of the cloud) and a <strong>Variance vector</strong> (the spread of the cloud). "diag" just means the dimensions (e.g., width vs angle) don't covary.
              </p>
           </div>
        </div>

        {/* Center: The Math */}
        <div className="flex flex-col items-center justify-center px-4 shrink-0 gap-2">
           <span className="font-bold text-slate-400 tracking-widest text-xs uppercase">Compared Using</span>
           <div className="w-16 h-16 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xl shadow-lg border-4 border-slate-200 z-10">
             D_KL
           </div>
           <div className="w-1 h-12 bg-slate-300"></div>
           <div className="bg-slate-800 p-3 rounded-xl border border-slate-600 shadow-lg relative z-20 w-48">
              <span className="text-[10px] text-slate-400 block text-center mb-1">Continuous Math Form:</span>
              <div className="text-white font-mono text-xs text-center flex items-center justify-center gap-1">
                 <span className="text-lg">∫</span> Q(z) log <span className="text-blue-300">Q(z)</span>/<span className="text-purple-300">P(z)</span> dz
              </div>
           </div>
        </div>

        {/* Right: Explaining P */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border-t-8 border-purple-500 p-6 flex flex-col relative overflow-hidden">
           <h3 className="text-2xl font-bold text-slate-800 mb-1 flex items-center gap-2">
             <Target className="w-6 h-6 text-purple-500"/> The Prior Distribution
           </h3>
           <div className="font-mono text-lg font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded inline-block mb-4 border border-purple-200 w-max">
             p(z)
           </div>
           
           <p className="text-sm text-slate-600 mb-6">
             This is our pre-chosen assumption about what the latent space <em>should</em> look like overall, before looking at any data. 
           </p>

           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex-grow flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">It is usually a Standard Gaussian:</span>
              <div className="font-mono font-bold text-sm bg-white border border-slate-300 px-4 py-2 rounded shadow-inner text-slate-700 text-center">
                 N( 0, I )
              </div>
              <p className="text-xs text-slate-500 mt-4 text-center">
                A perfect, standard bell curve centered exactly at zero (<strong>Mean = 0</strong>), with a perfect standard spread (<strong>Variance = Identity Matrix I</strong>).
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 3: The 3 Roles of KL Divergence ---
const RegularizerRolesSlide = () => {
  const [activeRole, setActiveRole] = useState(1);

  const renderVisual = () => {
    switch(activeRole) {
      case 1: // Structured Space
        return (
          <div className="w-full h-full relative flex items-center justify-center">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-200 to-transparent opacity-50"></div>
             <div className="w-48 h-48 border-2 border-dashed border-purple-400 rounded-full flex items-center justify-center relative z-0">
               <span className="absolute -top-6 text-xs font-bold text-purple-500 font-mono">Prior p(z)</span>
             </div>
             {/* Clustered centered points */}
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute w-6 h-6 bg-blue-500/50 rounded-full border border-blue-500 shadow-sm" style={{ top: '45%', left: '45%' }}/>
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{delay: 0.1}} className="absolute w-8 h-8 bg-emerald-500/50 rounded-full border border-emerald-500 shadow-sm" style={{ top: '50%', left: '55%' }}/>
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{delay: 0.2}} className="absolute w-7 h-7 bg-amber-500/50 rounded-full border border-amber-500 shadow-sm" style={{ top: '60%', left: '40%' }}/>
             
             {/* Arrows pulling inward */}
             <ArrowRight className="absolute w-6 h-6 text-slate-400 transform rotate-45 top-1/4 left-1/4 animate-pulse"/>
             <ArrowRight className="absolute w-6 h-6 text-slate-400 transform -rotate-135 bottom-1/4 right-1/4 animate-pulse"/>
          </div>
        );
      case 2: // Preventing Collapse (Variance)
        return (
          <div className="w-full h-full relative flex items-center justify-center gap-8">
             <div className="flex flex-col items-center">
               <span className="text-xs font-bold text-rose-500 mb-2 uppercase">Delta (Too Narrow)</span>
               <div className="w-32 h-32 bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-center relative">
                 <div className="w-1 h-1 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,1)]"></div>
                 <XCircle className="absolute top-2 right-2 text-rose-500 w-5 h-5"/>
               </div>
               <span className="text-[10px] text-slate-500 mt-2 text-center">Variance ≈ 0<br/>Memorizes input</span>
             </div>

             <div className="flex flex-col items-center">
               <span className="text-xs font-bold text-emerald-600 mb-2 uppercase">Healthy Uncertainty</span>
               <div className="w-32 h-32 bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-center relative">
                 <div className="w-16 h-16 bg-blue-500/30 border border-blue-500 rounded-full flex items-center justify-center">
                   <div className="w-1 h-1 bg-blue-700 rounded-full"></div>
                 </div>
                 <CheckCircle className="absolute top-2 right-2 text-emerald-500 w-5 h-5"/>
               </div>
               <span className="text-[10px] text-slate-500 mt-2 text-center">Variance &gt; 0<br/>Creates smooth regions</span>
             </div>
          </div>
        );
      case 3: // Meaningful Generation
        return (
          <div className="w-full h-full relative flex flex-col items-center justify-center">
             <div className="flex items-center gap-4 w-full px-8">
                {/* Sampling from Prior */}
                <div className="flex flex-col items-center w-32 relative">
                  <span className="text-[10px] font-bold text-purple-600 mb-1">Prior p(z)</span>
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-purple-400 bg-purple-50 flex items-center justify-center relative overflow-hidden">
                    <motion.div animate={{ left: ['20%', '70%', '40%'], top: ['40%', '30%', '70%'] }} transition={{ duration: 4, repeat: Infinity }} className="absolute w-3 h-3 bg-purple-600 rounded-full shadow-md z-10" />
                  </div>
                  <span className="text-[9px] text-slate-500 mt-2 font-mono">Sample z_new</span>
                </div>

                <div className="flex-1 border-t-2 border-dashed border-slate-300 relative flex justify-center">
                  <ArrowRight className="absolute -top-3 text-slate-400 bg-white" />
                </div>

                {/* Decoder Output */}
                <div className="flex flex-col items-center w-32">
                  <span className="text-[10px] font-bold text-slate-600 mb-1">Decoder</span>
                  <div className="w-20 h-24 bg-slate-800 rounded-xl flex items-center justify-center text-3xl shadow-lg border border-slate-600 text-white">
                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute">🐶</motion.div>
                    <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 4, repeat: Infinity, delay: 2 }} className="absolute">🐱</motion.div>
                  </div>
                  <span className="text-[9px] text-emerald-600 font-bold mt-2 text-center uppercase">Meaningful<br/>Output</span>
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The 3 Roles of KL Divergence</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Because it is subtracted in the ELBO, maximizing ELBO means minimizing the KL Divergence. This minimization acts as a powerful regularizer with three critical effects.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Nav Tabs */}
        <div className="lg:w-1/3 flex flex-col gap-3">
           <button onClick={() => setActiveRole(1)} className={`p-4 rounded-xl border-l-4 text-left transition-colors ${activeRole === 1 ? 'bg-white shadow-md border-indigo-500' : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'}`}>
             <h4 className="font-bold text-sm mb-1 text-slate-800">1. Structured Latent Space</h4>
             <p className="text-[11px] leading-relaxed">Pushes encodings to the origin (0,0) so they don't form isolated, arbitrary islands.</p>
           </button>
           
           <button onClick={() => setActiveRole(2)} className={`p-4 rounded-xl border-l-4 text-left transition-colors ${activeRole === 2 ? 'bg-white shadow-md border-rose-500' : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'}`}>
             <h4 className="font-bold text-sm mb-1 text-slate-800">2. Preventing "Delta" Collapse</h4>
             <p className="text-[11px] leading-relaxed">Stops the model from making the variance zero. Forces the encoder to maintain healthy uncertainty.</p>
           </button>

           <button onClick={() => setActiveRole(3)} className={`p-4 rounded-xl border-l-4 text-left transition-colors ${activeRole === 3 ? 'bg-white shadow-md border-emerald-500' : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'}`}>
             <h4 className="font-bold text-sm mb-1 text-slate-800">3. Enabling Generation</h4>
             <p className="text-[11px] leading-relaxed">Ensures the regions the Decoder trains on are the exact same regions we sample from later.</p>
           </button>
        </div>

        {/* Visualizer & Deep Dive */}
        <div className="lg:w-2/3 flex flex-col gap-6">
           <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 flex items-center justify-center h-64 shrink-0">
             <AnimatePresence mode="wait">
               <motion.div key={activeRole} initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0}} className="w-full h-full">
                 {renderVisual()}
               </motion.div>
             </AnimatePresence>
           </div>
           
           <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 flex-grow">
              <h4 className="font-bold text-indigo-400 mb-2 uppercase tracking-widest text-xs">Deep Dive</h4>
              {activeRole === 1 && <p className="text-sm text-slate-300 leading-relaxed">By forcing <span className="font-mono text-blue-300">q(z|x)</span> to look like <span className="font-mono text-purple-300">N(0, I)</span>, we guarantee that all encoded images overlap smoothly around the center of the coordinate system. This creates a continuous manifold instead of scattered, disconnected points.</p>}
              {activeRole === 2 && <p className="text-sm text-slate-300 leading-relaxed">Without KL, the Decoder would command the Encoder: <em>"Just output exact coordinates (Variance=0) so I can memorize the data perfectly!"</em> But a variance of zero breaks the probabilistic nature of the VAE. The KL term aggressively penalizes tiny variances, forcing <span className="font-mono text-blue-300">q(z|x)</span> to stay a fuzzy cloud.</p>}
              {activeRole === 3 && <p className="text-sm text-slate-300 leading-relaxed">To generate new art, we sample <span className="font-mono text-purple-300">z ~ p(z)</span> and feed it to the Decoder. If we didn't use KL Divergence during training, the Decoder would have <em>no idea</em> what to do with points drawn from <span className="font-mono text-purple-300">p(z)</span>. The KL loss forces the training data into the same zones we plan to sample from!</p>}
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 4: The Analytical Formula ---
const AnalyticalMathSlide = () => {
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);

  // Safe variance calculation to avoid log(0)
  const var2 = Math.max(sigma * sigma, 0.001);
  
  // Breakdown of the formula: 0.5 * sum( mu^2 + sigma^2 - log(sigma^2) - 1 )
  const meanPenalty = mu * mu; 
  const largeVarPenalty = var2;
  const smallVarPenalty = -Math.log(var2); // This is positive if var < 1, acts as penalty
  const constant = -1;

  const totalKL = 0.5 * (meanPenalty + largeVarPenalty + smallVarPenalty + constant);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-slate-200">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Deconstructing the Analytical Formula</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          When both <span className="font-mono text-blue-400">q</span> and <span className="font-mono text-purple-400">p</span> are Gaussian, the complex KL integral simplifies into a brilliant, easily differentiable algebraic equation. Let's see how each term acts as a penalty.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* LEFT: Formula & Sliders */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-6 flex flex-col items-center">
           
           <div className="bg-slate-950 px-4 py-6 rounded-xl flex justify-center w-full mb-8 shadow-inner border border-slate-700">
             <span className="font-mono text-lg md:text-xl font-bold text-white flex flex-wrap justify-center items-center gap-2">
               <span>D<sub className="text-sm">KL</sub> = ½ ∑ (</span>
               <span className="text-blue-400 border-b-2 border-blue-500 pb-1">μ²</span>
               <span className="text-slate-500">+</span>
               <span className="text-rose-400 border-b-2 border-rose-500 pb-1">σ²</span>
               <span className="text-slate-500">-</span>
               <span className="text-emerald-400 border-b-2 border-emerald-500 pb-1">log(σ²)</span>
               <span className="text-slate-500">- 1 )</span>
             </span>
           </div>

           <div className="w-full flex flex-col gap-6 flex-grow">
              <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Encoder Mean (μ)</span>
                   <span className="font-mono bg-slate-900 px-2 py-1 rounded text-blue-300 font-bold">{mu.toFixed(2)}</span>
                 </div>
                 <input type="range" min="-4" max="4" step="0.1" value={mu} onChange={(e) => setMu(parseFloat(e.target.value))} className="w-full accent-blue-500" />
                 <p className="text-[10px] text-slate-400 mt-2">Target Prior Mean = 0</p>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Encoder StdDev (σ)</span>
                   <span className="font-mono bg-slate-900 px-2 py-1 rounded text-emerald-300 font-bold">{sigma.toFixed(2)}</span>
                 </div>
                 <input type="range" min="0.01" max="3" step="0.05" value={sigma} onChange={(e) => setSigma(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                 <p className="text-[10px] text-slate-400 mt-2">Target Prior Variance (σ²) = 1</p>
              </div>
           </div>

           <div className="mt-8 flex items-center justify-between bg-slate-950 p-4 rounded-xl border-2 border-slate-700 w-full shadow-lg">
             <div className="flex items-center gap-2">
               <Calculator className="w-6 h-6 text-indigo-400" />
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total KL Penalty</span>
             </div>
             <span className={`font-mono text-4xl font-bold ${totalKL < 0.05 ? 'text-indigo-400' : 'text-rose-400'}`}>
               {totalKL.toFixed(3)}
             </span>
           </div>

        </div>

        {/* RIGHT: Live Penalty Breakdown */}
        <div className="flex-[1.2] flex flex-col gap-4">
           
           <div className={`p-4 rounded-xl border-l-4 transition-colors flex items-center justify-between ${meanPenalty > 0.05 ? 'bg-blue-950/50 border-blue-500' : 'bg-slate-800 border-slate-600'}`}>
              <div className="pr-4">
                <h4 className="font-bold text-blue-400 text-sm mb-1 font-mono">μ²</h4>
                <p className="text-xs text-slate-400 leading-relaxed"><strong>Mean Centering Penalty:</strong> Penalizes the Mean for deviating from 0. Minimized exactly when μ = 0.</p>
              </div>
              <div className="flex flex-col items-end shrink-0 w-24">
                <span className="font-mono text-xl font-bold text-blue-300">+{meanPenalty.toFixed(2)}</span>
                {meanPenalty <= 0.05 && <span className="text-[9px] text-emerald-400 font-bold uppercase mt-1 bg-emerald-900/30 px-1 rounded">Perfect!</span>}
              </div>
           </div>

           <div className={`p-4 rounded-xl border-l-4 transition-colors flex items-center justify-between ${largeVarPenalty > 1.1 ? 'bg-rose-950/50 border-rose-500' : 'bg-slate-800 border-slate-600'}`}>
              <div className="pr-4">
                <h4 className="font-bold text-rose-400 text-sm mb-1 font-mono">σ²</h4>
                <p className="text-xs text-slate-400 leading-relaxed"><strong>Maximum Spread Penalty:</strong> Penalizes huge variances. Stops the encoder from just outputting infinite noise to satisfy the next term.</p>
              </div>
              <div className="flex flex-col items-end shrink-0 w-24">
                <span className="font-mono text-xl font-bold text-rose-300">+{largeVarPenalty.toFixed(2)}</span>
              </div>
           </div>

           <div className={`p-4 rounded-xl border-l-4 transition-colors flex items-center justify-between ${smallVarPenalty > 0.1 ? 'bg-emerald-950/50 border-emerald-500' : 'bg-slate-800 border-slate-600'}`}>
              <div className="pr-4">
                <h4 className="font-bold text-emerald-400 text-sm mb-1 font-mono">-log(σ²)</h4>
                <p className="text-xs text-slate-400 leading-relaxed"><strong>Minimum Spread Penalty:</strong> If σ² &lt; 1, log(σ²) is negative, making this term a massive POSITIVE penalty! This forces the model to maintain uncertainty and prevents "delta collapse" to 0 variance.</p>
              </div>
              <div className="flex flex-col items-end shrink-0 w-24">
                <span className="font-mono text-xl font-bold text-emerald-300">{smallVarPenalty > 0 ? '+' : ''}{smallVarPenalty.toFixed(2)}</span>
              </div>
           </div>

           <div className="bg-indigo-950/30 border border-indigo-500/30 p-5 rounded-xl mt-auto flex items-start gap-4">
              <CheckCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-200 leading-relaxed">
                <strong>Combined Magic:</strong> The <span className="font-mono">σ²</span> and <span className="font-mono">-log(σ²)</span> terms fight against each other. Their combined sum is exactly minimized when <span className="font-mono font-bold">σ² = 1</span>. Together with the Mean penalty, this equation neatly algebraically aligns the Encoder's output with the Standard Prior <span className="font-mono">N(0,1)</span>.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 5: The Balancing Act (Beta-VAE Preview) ---
const BalancingActSlide = () => {
  const [klWeight, setKlWeight] = useState(50); // 0 = Ignore KL, 100 = Dominant KL, 50 = Balanced

  // Visual logic based on KL weight
  const getVisuals = () => {
    if (klWeight < 20) {
      return {
        title: "Overfitting & Gappy Space",
        reconColor: "text-emerald-500",
        klColor: "text-rose-500",
        desc: "KL Divergence is too weak! The Encoder ignores the Prior. It outputs tiny variance dots (high confidence) specifically tailored for perfect training reconstruction.",
        issue: "Latent space is fragmented. Generative sampling will fail because the decoder hasn't seen the gaps.",
        imgBlur: "0px",
        latentVisual: (
          <div className="relative w-full h-full">
            <div className="absolute w-2 h-2 bg-blue-500 rounded-full top-[20%] left-[20%] shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
            <div className="absolute w-2 h-2 bg-blue-500 rounded-full top-[80%] left-[80%] shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
            <div className="absolute w-2 h-2 bg-blue-500 rounded-full top-[30%] left-[70%] shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
          </div>
        )
      };
    } else if (klWeight > 80) {
      return {
        title: "Posterior Collapse",
        reconColor: "text-rose-500",
        klColor: "text-emerald-500",
        desc: "KL Divergence is too heavy! The network is so terrified of the KL penalty that it just outputs the Prior N(0,1) for EVERY image.",
        issue: "The latent code loses all information about the input x. The decoder is forced to just generate a single, average, blurry 'mean' image.",
        imgBlur: "8px",
        latentVisual: (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 bg-blue-500/80 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.8)] border-4 border-white flex items-center justify-center text-xs font-bold text-white">All X</div>
          </div>
        )
      };
    } else {
      return {
        title: "The Sweet Spot (Well-Behaved)",
        reconColor: "text-indigo-500",
        klColor: "text-indigo-500",
        desc: "The delicate balance of a standard VAE. The encodings are distinct enough to allow good reconstruction, but regularized enough to form a smooth, continuous space.",
        issue: "Allows for generation of coherent, novel samples by sampling from the prior.",
        imgBlur: "2px",
        latentVisual: (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-[80%] h-[80%] border-2 border-dashed border-slate-300 rounded-full"></div>
            <div className="absolute w-16 h-16 bg-blue-500/40 rounded-full top-[30%] left-[30%] blur-sm"></div>
            <div className="absolute w-16 h-16 bg-emerald-500/40 rounded-full top-[50%] left-[50%] blur-sm"></div>
            <div className="absolute w-16 h-16 bg-purple-500/40 rounded-full top-[30%] left-[60%] blur-sm"></div>
          </div>
        )
      };
    }
  };

  const visual = getVisuals();

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The Balancing Act</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Training a VAE is a delicate trade-off. What happens if we add a weight multiplier (like in <span className="font-mono font-bold">β-VAE</span>) and push the balance too far in either direction?
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Interactive Balance Scale */}
        <div className="flex-[1] bg-white rounded-2xl shadow-xl p-8 border border-slate-200 flex flex-col relative overflow-hidden">
           
           <h3 className="font-bold text-slate-700 mb-8 text-sm uppercase tracking-widest text-center border-b pb-2">KL Divergence Weight</h3>
           
           <div className="flex-grow flex flex-col items-center justify-center w-full relative mb-8">
              
              <div className="flex items-center justify-between w-full px-4 mb-2">
                 <span className={`text-xs font-bold uppercase ${visual.reconColor}`}>Reconstruction</span>
                 <span className={`text-xs font-bold uppercase ${visual.klColor}`}>Regularization</span>
              </div>

              {/* The "See-saw" visual */}
              <div className="w-full h-2 bg-slate-200 rounded-full relative mb-4">
                 <motion.div 
                   className="absolute w-6 h-6 bg-slate-800 rounded-full -mt-2 -ml-3 shadow-md"
                   animate={{ left: `${klWeight}%` }}
                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                 />
              </div>

              <input 
                type="range" min="0" max="100" value={klWeight} 
                onChange={(e) => setKlWeight(parseInt(e.target.value))} 
                className="w-full absolute opacity-0 cursor-pointer h-12 z-20" 
              />
              
              <div className="flex justify-between w-full text-[10px] text-slate-400 font-mono mt-2">
                <span>0.0 (Ignore KL)</span>
                <span>1.0 (Standard)</span>
                <span>High (β &gt;&gt; 1)</span>
              </div>
           </div>

           <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-center">
             <h4 className="font-bold text-indigo-900 text-lg mb-1">{visual.title}</h4>
             <p className="text-xs text-slate-600 leading-relaxed">{visual.desc}</p>
           </div>
        </div>

        {/* Results Panels */}
        <div className="flex-[1.5] flex flex-col gap-6">
           
           <div className="flex gap-6 h-48">
              {/* Latent Space Result */}
              <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 p-4 flex flex-col items-center relative overflow-hidden shadow-inner">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest z-10 bg-slate-900/80 px-2 py-1 rounded">Latent Space Structure</span>
                <div className="absolute inset-0 top-8 p-4">
                  {visual.latentVisual}
                </div>
              </div>

              {/* Decoder Output Result */}
              <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center relative shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Reconstruction Quality</span>
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-300 shadow-md">
                   <img src="https://picsum.photos/id/237/200/200" className="w-full h-full object-cover grayscale transition-all duration-700" style={{ filter: `blur(${visual.imgBlur})` }} />
                </div>
              </div>
           </div>

           <div className={`p-6 rounded-2xl border-l-4 shadow-sm flex items-start gap-4 flex-grow ${klWeight < 20 || klWeight > 80 ? 'bg-amber-50 border-amber-500' : 'bg-emerald-50 border-emerald-500'}`}>
              {klWeight < 20 || klWeight > 80 ? <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5"/> : <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5"/>}
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-widest">Generative Consequence</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{visual.issue}</p>
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
    ELBOReviewSlide,
    QvsPSlide,
    RegularizerRolesSlide,
    AnalyticalMathSlide,
    BalancingActSlide
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