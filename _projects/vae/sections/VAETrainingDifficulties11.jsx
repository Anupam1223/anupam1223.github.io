import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Calculator, 
  ArrowRight, Target, CheckCircle, 
  Zap, ShieldAlert, AlertTriangle, 
  BrainCircuit, Scale, ArrowDown, Activity, 
  Minimize2, Droplet, EyeOff, Layers, Sliders, Image as ImageIcon,
  LineChart, Unlock, Search
} from 'lucide-react';

// --- SLIDE 1: Clarifying "Weights" ---
const KLWeightSlide = () => {
  const [beta, setBeta] = useState(1.0);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Clearing the Confusion: What is "KL Weight"?</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          You asked: <em>"What is KL weight? Is it talking about the parameters that the encoders have?"</em> No! They are two completely different things. Let's separate them.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* LEFT: Network Weights */}
        <div className="flex-[1] bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col items-center">
           <h3 className="font-bold text-blue-400 mb-6 text-sm uppercase tracking-widest flex items-center gap-2 border-b border-slate-600 pb-2 w-full justify-center">
             <BrainCircuit className="w-5 h-5"/> 1. Network Parameters (φ, θ)
           </h3>
           
           <div className="flex flex-col gap-4 w-full">
             <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center gap-4 shadow-inner">
               <div className="w-12 h-12 bg-blue-900/50 border-2 border-blue-500 rounded-lg flex flex-wrap gap-[1px] p-1 justify-center content-center">
                 {Array.from({length:9}).map((_,i)=><div key={i} className="w-2 h-2 bg-blue-400 rounded-sm opacity-80"></div>)}
               </div>
               <div>
                 <span className="font-bold text-blue-300 block">Encoder Weights (φ)</span>
                 <span className="text-[10px] text-slate-500">Millions of learnable synapses.</span>
               </div>
             </div>
             
             <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center gap-4 shadow-inner">
               <div className="w-12 h-12 bg-emerald-900/50 border-2 border-emerald-500 rounded-lg flex flex-wrap gap-[1px] p-1 justify-center content-center">
                 {Array.from({length:9}).map((_,i)=><div key={i} className="w-2 h-2 bg-emerald-400 rounded-sm opacity-80"></div>)}
               </div>
               <div>
                 <span className="font-bold text-emerald-300 block">Decoder Weights (θ)</span>
                 <span className="text-[10px] text-slate-500">Millions of learnable synapses.</span>
               </div>
             </div>
           </div>

           <p className="text-sm text-slate-400 mt-auto text-center bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
             These are the physical matrices inside your PyTorch model. We optimize these using gradient descent.
           </p>
        </div>

        {/* RIGHT: KL Hyperparameter Weight */}
        <div className="flex-[1.5] bg-slate-800 rounded-2xl shadow-xl border-2 border-indigo-500 p-6 flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow-md">The "KL Weight"</div>
           
           <h3 className="font-bold text-indigo-400 mb-6 text-sm uppercase tracking-widest flex items-center gap-2 border-b border-slate-600 pb-2 w-full justify-center">
             <Sliders className="w-5 h-5"/> 2. The Hyperparameter (β)
           </h3>

           <p className="text-sm text-slate-300 mb-6 text-center">
             The KL Weight (often called <strong>Beta / β</strong>) is just a single scalar multiplier. It acts like a "Volume Knob" for the KL Divergence penalty in the loss function.
           </p>

           <div className="font-mono text-lg md:text-2xl font-bold bg-slate-900 text-white p-6 rounded-2xl shadow-inner border border-slate-700 mb-6 w-full text-center flex flex-wrap justify-center items-center gap-3">
             <span className="text-slate-400 text-sm">Total Loss = </span>
             <span className="text-blue-400">Recon_Loss</span>
             <span className="text-slate-500">+</span>
             <span className="text-indigo-400 border-b-2 border-indigo-500 pb-1 relative">
               β
               <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] font-sans text-indigo-300 tracking-widest">Weight</span>
             </span>
             <span className="text-slate-500">×</span>
             <span className="text-rose-400">KL_Loss</span>
           </div>

           <div className="w-full max-w-sm mx-auto flex flex-col gap-2 mt-auto">
             <div className="flex justify-between text-xs font-bold text-slate-400 font-mono">
               <span>β = 0.0</span>
               <span className="text-indigo-400 text-lg">β = {beta.toFixed(2)}</span>
               <span>β = 5.0</span>
             </div>
             <input type="range" min="0" max="5" step="0.1" value={beta} onChange={(e) => setBeta(parseFloat(e.target.value))} className="w-full accent-indigo-500 h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
             <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mt-1">
               <span className="w-24 text-left">Ignore KL completely</span>
               <span className="w-24 text-right">Massive KL Penalty</span>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 2: The Balancing Act (Beta-VAE) ---
const BalancingActSlide = () => {
  const [beta, setBeta] = useState(1);

  // Beta determines the spread (variance) of the latent clusters
  // Low beta = tiny clusters far apart (Recon dominates)
  // High beta = huge overlapping clusters at origin (KL dominates)
  const spread = Math.max(0, 40 - (beta * 20)); // Distance from center
  const radius = Math.max(5, beta * 25); // Size of the cloud

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The Balancing Act: Reconstruction vs. Regularization</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Training a VAE is a tug-of-war. Explicitly weighting the KL term with <strong>β</strong> (Beta-VAE) shows the consequences of imbalance.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Interactive Latent Space */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          
          <div className="w-full max-w-sm mb-6 flex flex-col gap-2 z-10">
             <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
               <span className={beta < 0.5 ? 'text-rose-500' : ''}>Small β (Recon Dom.)</span>
               <span className={beta >= 0.5 && beta <= 1.5 ? 'text-indigo-500' : ''}>Balanced</span>
               <span className={beta > 1.5 ? 'text-rose-500' : ''}>Large β (KL Dom.)</span>
             </div>
             <input type="range" min="0" max="3" step="0.1" value={beta} onChange={(e) => setBeta(parseFloat(e.target.value))} className="w-full accent-indigo-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
          </div>

          <div className="w-full max-w-[300px] h-[300px] bg-slate-900 rounded-xl border-4 border-slate-800 shadow-inner relative overflow-hidden flex items-center justify-center">
            
            {/* Prior N(0,1) Ring */}
            <div className="absolute w-[50%] h-[50%] border-2 border-dashed border-white/20 rounded-full"></div>
            
            {/* Holes / Bad zones (Visible when beta is low) */}
            <AnimatePresence>
              {beta < 0.5 && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-rose-900/40"></div>
                  <span className="absolute top-4 text-rose-400 text-[10px] font-bold uppercase tracking-widest bg-slate-900/80 px-2 py-1 rounded">"Holes" in latent space</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Clusters */}
            <div className="absolute transition-all duration-300 bg-blue-500 mix-blend-screen rounded-full blur-md" style={{ width: `${radius}%`, height: `${radius}%`, left: `calc(50% - ${spread}%)`, top: `calc(50% - ${spread}%)`, transform: 'translate(-50%, -50%)', opacity: 0.8 }}></div>
            <div className="absolute transition-all duration-300 bg-emerald-500 mix-blend-screen rounded-full blur-md" style={{ width: `${radius}%`, height: `${radius}%`, left: `calc(50% + ${spread}%)`, top: `calc(50% + ${spread}%)`, transform: 'translate(-50%, -50%)', opacity: 0.8 }}></div>
            <div className="absolute transition-all duration-300 bg-amber-500 mix-blend-screen rounded-full blur-md" style={{ width: `${radius}%`, height: `${radius}%`, left: `calc(50% - ${spread/2}%)`, top: `calc(50% + ${spread}%)`, transform: 'translate(-50%, -50%)', opacity: 0.8 }}></div>
            
          </div>
        </div>

        {/* Dynamic Explanations */}
        <div className="flex-[1] flex flex-col gap-4 justify-center">
          
          <div className={`p-5 rounded-2xl border transition-colors ${beta < 0.5 ? 'bg-rose-50 border-rose-300 shadow-md' : 'bg-white border-slate-200 opacity-50'}`}>
            <h3 className="font-bold text-rose-700 flex items-center gap-2 mb-2"><Search className="w-4 h-4"/> Small β (Weak KL Pressure)</h3>
            <p className="text-xs text-rose-900/80">
              The encoder learns tiny, dense clusters specific to training images. Huge "holes" appear in the latent space. Sampling from a hole produces poor quality, meaningless garbage because the decoder never saw those regions.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border transition-colors ${beta >= 0.5 && beta <= 1.5 ? 'bg-indigo-50 border-indigo-300 shadow-md' : 'bg-white border-slate-200 opacity-50'}`}>
            <h3 className="font-bold text-indigo-700 flex items-center gap-2 mb-2"><Scale className="w-4 h-4"/> Balanced (β ≈ 1)</h3>
            <p className="text-xs text-indigo-900/80">
              Clusters are packed within the prior distribution seamlessly, allowing smooth interpolation between classes without leaving empty gaps.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border transition-colors ${beta > 1.5 ? 'bg-amber-50 border-amber-300 shadow-md' : 'bg-white border-slate-200 opacity-50'}`}>
            <h3 className="font-bold text-amber-700 flex items-center gap-2 mb-2"><Minimize2 className="w-4 h-4"/> Large β (Strong KL Pressure)</h3>
            <p className="text-xs text-amber-900/80">
              Posterior Collapse! The penalty to match the prior is so high that the encoder squashes all clusters into a single point at (0,0). Latent variables become uninformative.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};


// --- SLIDE 3: Posterior Collapse Visualized ---
const PosteriorCollapseSlide = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const healthyClouds = [
    { id: 'cat', emoji: '🐱', color: 'bg-blue-500', x: 20, y: 30, mu: "[-1.2, 0.8]" },
    { id: 'dog', emoji: '🐶', color: 'bg-emerald-500', x: 80, y: 20, mu: "[1.5, 1.1]" },
    { id: 'bird', emoji: '🐦', color: 'bg-amber-500', x: 50, y: 80, mu: "[0.1, -1.5]" }
  ];

  const collapsedClouds = [
    { id: 'cat', emoji: '🐱', color: 'bg-slate-400', x: 50, y: 50, mu: "[0.0, 0.0]" },
    { id: 'dog', emoji: '🐶', color: 'bg-slate-400', x: 50, y: 50, mu: "[0.0, 0.0]" },
    { id: 'bird', emoji: '🐦', color: 'bg-slate-400', x: 50, y: 50, mu: "[0.0, 0.0]" }
  ];

  const currentClouds = isCollapsed ? collapsedClouds : healthyClouds;

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Visualizing Posterior Collapse</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          You asked: <em>"How does the encoder effectively learn to ignore the input x?"</em> Let's watch it happen.
        </p>
      </div>

      <div className="flex justify-center mb-6">
         <div className="bg-slate-800 p-1 rounded-xl flex shadow-inner border border-slate-700">
           <button onClick={() => setIsCollapsed(false)} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${!isCollapsed ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>Healthy VAE</button>
           <button onClick={() => setIsCollapsed(true)} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${isCollapsed ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>Posterior Collapse</button>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Latent Space Map */}
        <div className="flex-[1.5] bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col relative overflow-hidden items-center justify-center">
           <span className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Latent Space (Z)</span>
           
           <div className="w-full max-w-[300px] h-[300px] bg-slate-950 rounded-full border-4 border-slate-900 shadow-inner relative overflow-hidden flex items-center justify-center">
              
              {/* Prior Boundary */}
              <div className="absolute w-[60%] h-[60%] border-2 border-dashed border-indigo-500/50 rounded-full"></div>
              <span className="absolute top-[20%] text-indigo-400/50 text-[10px] font-mono font-bold">Prior N(0,I)</span>

              {/* Data Clouds */}
              {currentClouds.map((cloud) => (
                <motion.div
                  key={cloud.id}
                  animate={{ left: `${cloud.x}%`, top: `${cloud.y}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className={`absolute w-24 h-24 rounded-full blur-md transform -translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-80 ${cloud.color}`}
                />
              ))}

              <AnimatePresence>
                {isCollapsed && (
                  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="absolute text-rose-400 font-bold text-xs bg-slate-900/90 px-2 py-1 rounded border border-rose-500/50 z-10 text-center">
                    All inputs map to <br/>the exact same spot!
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* Decoder Pipeline */}
        <div className="flex-1 flex flex-col gap-4">
           
           <div className="bg-slate-800 rounded-2xl shadow-md border border-slate-700 p-5 flex flex-col">
             <h4 className="font-bold text-slate-300 text-xs uppercase tracking-widest mb-4 border-b border-slate-700 pb-2">The Pipeline</h4>
             
             {currentClouds.map((cloud, i) => (
               <div key={`pipe-${i}`} className="flex items-center justify-between mb-4">
                 <div className="text-2xl bg-slate-700 p-2 rounded-lg border border-slate-600">{cloud.emoji}</div>
                 <ArrowRight className="w-4 h-4 text-slate-500" />
                 
                 <div className="flex flex-col items-center">
                   <span className="text-[9px] font-bold text-slate-500 uppercase">Encoder Guess</span>
                   <motion.span animate={{ color: isCollapsed ? '#f43f5e' : '#cbd5e1' }} className="font-mono text-xs font-bold bg-slate-900 px-2 py-1 rounded border border-slate-700">
                     μ = {cloud.mu}
                   </motion.span>
                 </div>
                 
                 <ArrowRight className="w-4 h-4 text-slate-500" />
                 
                 <div className="text-2xl bg-slate-700 p-2 rounded-lg border border-slate-600 relative overflow-hidden">
                   <AnimatePresence mode="wait">
                     <motion.div key={isCollapsed ? 'collapse' : cloud.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
                       {isCollapsed ? (
                         <div className="w-full h-full flex items-center justify-center bg-slate-800 relative">
                            <span className="absolute opacity-30 blur-[2px]">🐱</span>
                            <span className="absolute opacity-30 blur-[2px]">🐶</span>
                            <span className="absolute opacity-30 blur-[2px]">🐦</span>
                         </div>
                       ) : (
                         cloud.emoji
                       )}
                     </motion.div>
                   </AnimatePresence>
                 </div>
               </div>
             ))}
           </div>

           <div className={`p-5 rounded-2xl shadow-sm border-l-4 transition-colors ${isCollapsed ? 'bg-rose-950/40 border-rose-500' : 'bg-indigo-950/40 border-indigo-500'} flex-grow flex flex-col justify-center`}>
              <h4 className={`font-bold text-lg mb-2 flex items-center gap-2 ${isCollapsed ? 'text-rose-400' : 'text-indigo-400'}`}>
                {isCollapsed ? <><AlertTriangle className="w-5 h-5"/> How the KL Vanishes</> : <><CheckCircle className="w-5 h-5"/> Healthy Balance</>}
              </h4>
              <p className={`text-sm leading-relaxed ${isCollapsed ? 'text-rose-300' : 'text-indigo-300'}`}>
                {isCollapsed 
                  ? "To make the KL penalty exactly 0, the Encoder outputs μ=0 and σ=1 for EVERY image. It ignores 'x'! The Decoder is starved of info and outputs a blurry average of all images." 
                  : "The Encoder accepts a small KL penalty to separate the clouds. The Decoder receives distinct z coordinates and perfectly reconstructs the specific animal."
                }
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 4: The Causes of Collapse ---
const CausesOfCollapseSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Why Does Posterior Collapse Happen?</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Posterior collapse isn't a bug in the math; it's the model finding an easy (but useless) shortcut to minimize the loss function. Triggered by:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full flex-grow pb-8">
        
        {/* Cause 1 */}
        <div className="bg-white border border-slate-200 shadow-xl p-6 rounded-2xl flex flex-col relative overflow-hidden group hover:border-blue-500 transition-colors">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 z-10">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xl text-slate-800 mb-3 z-10">1. Overly Powerful Decoder</h3>
          <p className="text-sm text-slate-600 z-10 mb-4 flex-grow">
            If the Decoder is massive (e.g., PixelCNN), it can reconstruct images perfectly just by looking at neighboring pixels. It doesn't <em>need</em> the latent code <span className="font-mono text-blue-600">z</span>. 
          </p>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-900 z-10">
            <strong>The Shortcut:</strong> Since the decoder doesn't need <span className="font-mono">z</span>, the encoder drops the KL penalty to 0.
          </div>
        </div>

        {/* Cause 2 */}
        <div className="bg-white border border-slate-200 shadow-xl p-6 rounded-2xl flex flex-col relative overflow-hidden group hover:border-amber-500 transition-colors">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 z-10">
            <Minimize2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xl text-slate-800 mb-3 z-10">2. Weak Encoder</h3>
          <p className="text-sm text-slate-600 z-10 mb-4 flex-grow">
            Conversely, if the Encoder is too simple, it might fail to learn how to map complex images into meaningful coordinates.
          </p>
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-xs text-amber-900 z-10">
            <strong>The Shortcut:</strong> If it can't figure out a meaningful map, the easiest way to lower loss is just to give up and match the Prior exactly (KL=0).
          </div>
        </div>

        {/* Cause 3 */}
        <div className="bg-white border border-slate-200 shadow-xl p-6 rounded-2xl flex flex-col relative overflow-hidden group hover:border-rose-500 transition-colors">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6 z-10">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xl text-slate-800 mb-3 z-10">3. High Initial KL Weight</h3>
          <p className="text-sm text-slate-600 z-10 mb-4 flex-grow">
            At Epoch 0, weights produce garbage. If the KL Weight is 1.0 from the start, the KL penalty is massive and overpowering.
          </p>
          <div className="bg-rose-50 p-3 rounded-lg border border-rose-100 text-xs text-rose-900 z-10">
            <strong>The Shortcut:</strong> The model panics. Before it tries to reconstruct, it collapses to the prior to stop the massive penalty.
          </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 5: KL Annealing (Warm-up) ---
const KLAnnealingSlide = () => {
  const [epoch, setEpoch] = useState(0);

  let beta = 0;
  if (epoch > 20 && epoch < 80) beta = (epoch - 20) / 60;
  else if (epoch >= 80) beta = 1;

  const cloudSpread = Math.max(10, 40 - (beta * 30)); 
  const reconQuality = Math.min(100, epoch * 2); 

  const playSimulation = () => {
    setEpoch(0);
    let currentEpoch = 0;
    const interval = setInterval(() => {
      currentEpoch += 2;
      setEpoch(currentEpoch);
      if (currentEpoch >= 100) clearInterval(interval);
    }, 100);
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Fix #1: KL Annealing (Warm-up)</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          To stop the network from panicking early, we artificially set the KL Weight (β) to 0 at the start. We let it learn to be a good Autoencoder first.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col relative overflow-hidden">
           <h3 className="font-bold text-slate-300 mb-4 text-sm uppercase tracking-widest text-center border-b border-slate-700 pb-2">KL Annealing Schedule</h3>
           
           <div className="flex-grow relative bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-end">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20% 20%', backgroundPosition: 'left bottom' }}></div>
              
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full p-4 overflow-visible">
                 <path d="M 0,100 L 20,100 L 80,0 L 100,0" fill="none" stroke="#475569" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                 <path d={`M 0,100 L ${Math.min(20, epoch)},100 ${epoch > 20 ? `L ${epoch},${100 - (beta * 100)}` : ''}`} fill="none" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                 <motion.circle cx={epoch} cy={100 - (beta * 100)} r="4" fill="#3b82f6" className="shadow-lg" />
              </svg>

              <span className="absolute left-2 top-2 text-[10px] font-bold text-slate-500">β = 1.0</span>
              <span className="absolute left-2 bottom-2 text-[10px] font-bold text-slate-500">β = 0.0</span>
              <span className="absolute right-2 bottom-2 text-[10px] font-bold text-slate-500">Epoch 100</span>
           </div>

           <div className="mt-6 flex justify-between items-center bg-blue-900/30 p-4 rounded-xl border border-blue-500/30">
             <div className="flex flex-col">
               <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Current Epoch</span>
               <span className="font-mono text-2xl font-bold text-blue-100">{epoch}</span>
             </div>
             <div className="flex flex-col items-end">
               <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">KL Weight (β)</span>
               <span className="font-mono text-2xl font-bold text-blue-100">{beta.toFixed(2)}</span>
             </div>
           </div>
        </div>

        <div className="flex-[1.2] flex flex-col gap-4">
           
           <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col items-center justify-center flex-grow relative overflow-hidden">
              <span className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Latent Space Simulation</span>
              
              <div className="w-full max-w-[300px] h-[200px] bg-black rounded-xl border-4 border-slate-900 relative overflow-hidden shadow-inner flex items-center justify-center mt-6">
                 <div className="absolute w-[40%] h-[60%] border-2 border-dashed border-indigo-500/50 rounded-full" style={{ opacity: Math.max(0.2, beta) }}></div>
                 <div className="absolute w-16 h-16 bg-blue-500 rounded-full blur-md mix-blend-screen transition-all duration-75" style={{ left: `calc(50% - ${cloudSpread}%)`, top: `calc(50% + ${cloudSpread/2}%)`, transform: 'translate(-50%, -50%)', opacity: 0.8 }}></div>
                 <div className="absolute w-16 h-16 bg-rose-500 rounded-full blur-md mix-blend-screen transition-all duration-75" style={{ left: `calc(50% + ${cloudSpread}%)`, top: `calc(50% - ${cloudSpread/2}%)`, transform: 'translate(-50%, -50%)', opacity: 0.8 }}></div>
              </div>

              <div className="mt-4 flex w-full justify-between items-center">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-slate-400">Reconstruction Quality</span>
                   <div className="w-32 h-2 bg-slate-700 rounded-full mt-1 overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${reconQuality}%`}}></div></div>
                 </div>
                 <button onClick={playSimulation} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-blue-500 transition-colors flex items-center gap-2">
                   <Activity className="w-4 h-4"/> Run Training
                 </button>
              </div>
           </div>

           <div className="bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-700 h-32 flex flex-col justify-center">
             <h4 className="font-bold text-blue-400 mb-1 text-sm">What is happening?</h4>
             {epoch < 20 && <p className="text-xs text-slate-300 leading-relaxed"><strong>Phase 1: Pure Autoencoder.</strong> β=0. Model ignores the Prior. Clouds separate completely for perfect reconstruction.</p>}
             {epoch >= 20 && epoch < 80 && <p className="text-xs text-slate-300 leading-relaxed"><strong>Phase 2: The Squeeze.</strong> β rises. Gravitational pull turns on. Clouds are dragged in, but resist collapsing perfectly into a single point.</p>}
             {epoch >= 80 && <p className="text-xs text-slate-300 leading-relaxed"><strong>Phase 3: Stable VAE.</strong> β=1. Clouds are neatly packed inside the Prior, but distinct enough to generate separate images.</p>}
           </div>

        </div>
      </div>
    </div>
  );
};


// --- SLIDE 6: Free Bits (Kingma et al.) ---
const FreeBitsSlide = () => {
  const [budgetC, setBudgetC] = useState(2.0);
  const [trueKL, setTrueKL] = useState(1.0);

  // max(C, D_KL) logic
  const penalty = Math.max(budgetC, trueKL);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Fix #2: "Free Bits" Budget</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Instead of modifying β, Kingma et al. modified the objective to: <strong>max(C, KL)</strong>. <br/>
          This gives the model a "tax-free bracket" of information (the budget <em>C</em>).
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Interactive Chart */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col relative overflow-hidden">
          
          <div className="flex justify-between items-end mb-6">
            <div className="w-64">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-2"><Unlock className="w-4 h-4"/> Budget C (The "Free" Zone)</label>
              <input type="range" min="0" max="5" step="0.1" value={budgetC} onChange={(e) => setBudgetC(parseFloat(e.target.value))} className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div className="text-right">
               <div className="text-xs text-slate-500 uppercase font-bold">Applied Penalty</div>
               <div className="text-3xl font-mono font-black text-rose-500">{penalty.toFixed(1)}</div>
            </div>
          </div>

          <div className="w-full h-full min-h-[250px] bg-slate-50 border border-slate-200 rounded-xl relative overflow-visible">
            
            <svg viewBox="0 0 10 10" className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
               {/* Grid */}
               <path d="M 0,2 L 10,2 M 0,4 L 10,4 M 0,6 L 10,6 M 0,8 L 10,8" stroke="#e2e8f0" strokeWidth="0.05" />
               <path d="M 2,0 L 2,10 M 4,0 L 4,10 M 6,0 L 6,10 M 8,0 L 8,10" stroke="#e2e8f0" strokeWidth="0.05" />
               
               {/* The max(C, x) curve */}
               <path d={`M 0,${10 - budgetC} L ${budgetC},${10 - budgetC} L 10,0`} fill="none" stroke="#10b981" strokeWidth="0.2" strokeLinejoin="round" />
               
               {/* Current Point */}
               <circle cx={trueKL} cy={10 - penalty} r="0.2" fill="#f43f5e" />
            </svg>

            {/* Labels overlay */}
            <div className="absolute bottom-2 left-0 w-full flex justify-between px-2 text-[10px] text-slate-400 font-mono">
              <span>0 (Collapsed)</span>
              <span>Actual KL Divergence (Information encoded) ➔</span>
              <span>10</span>
            </div>
            
            <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-2 text-[10px] text-slate-400 font-mono" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
               <span>Penalty</span>
            </div>
            
            {/* The Budget Shaded Area */}
            <div className="absolute left-0 bottom-0 bg-emerald-500/10 border-r border-t border-emerald-500/30 transition-all" style={{ width: `${(budgetC/10)*100}%`, height: `${(budgetC/10)*100}%`}}>
              <span className="absolute right-2 bottom-2 text-emerald-600 font-bold text-[10px] whitespace-nowrap">Free Zone</span>
            </div>

          </div>

          <div className="mt-4 w-full">
            <label className="text-xs font-bold text-slate-500 uppercase">Simulate True KL Divergence</label>
            <input type="range" min="0" max="10" step="0.1" value={trueKL} onChange={(e) => setTrueKL(parseFloat(e.target.value))} className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2" />
          </div>

        </div>

        {/* Explanations */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
          
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm">
            <h4 className="font-bold text-emerald-800 mb-2">How it prevents collapse</h4>
            <p className="text-sm text-emerald-900/80 leading-relaxed">
              If the actual KL drops below the constant <strong>C</strong>, the loss function stops punishing it. The penalty stays completely flat at C. 
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <p className="text-sm text-slate-600 leading-relaxed">
              Because the penalty is flat in the "Free Zone", the model's gradients for the KL term become zero. 
              The optimizer can then focus 100% of its effort on the Reconstruction Loss, encouraging the latent dimensions to actually store information.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <h4 className="font-bold text-slate-700 mb-2">Other Architectural Adjustments</h4>
            <ul className="text-xs text-slate-600 list-disc pl-4 space-y-2">
              <li><strong>Weaken the Decoder:</strong> Force it to rely on the latent space.</li>
              <li><strong>Autoregressive Decoders:</strong> Make information in 'z' more valuable.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};


// --- SLIDE 7: Blurry Samples (MSE) ---
const BlurrySamplesSlide = () => {
  const [edgePos, setEdgePos] = useState(5); 

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Why are VAE Generations Blurry?</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          VAEs are notorious for producing blurry images compared to GANs. The culprit is the <strong>Mean Squared Error (MSE)</strong> reconstruction loss under a Gaussian Likelihood.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Visualizer */}
        <div className="flex-[1.5] bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8 flex flex-col relative overflow-hidden">
           <h3 className="font-bold text-slate-300 mb-6 text-sm uppercase tracking-widest text-center border-b border-slate-600 pb-2">The "Safe Average" Phenomenon</h3>
           
           <div className="flex-grow flex flex-col items-center justify-center w-full gap-8">
              
              <div className="flex items-center gap-8 justify-center w-full">
                 
                 {/* True Distribution (Bimodal) */}
                 <div className="flex flex-col items-center w-48">
                   <span className="text-[10px] font-bold text-blue-400 uppercase mb-2 text-center">True Data<br/>(Multiple Modes)</span>
                   <div className="w-full h-32 bg-slate-900 border border-slate-600 rounded-xl relative flex items-end justify-center p-2">
                      <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                        <path d="M 0 50 Q 20 50 30 10 Q 40 50 50 50 Q 60 50 70 10 Q 80 50 100 50" fill="none" stroke="#60a5fa" strokeWidth="3" />
                      </svg>
                      <div className="absolute top-2 left-2 text-[8px] text-slate-500">"The sharp edge could be at Pixel 3... or Pixel 7"</div>
                   </div>
                 </div>

                 <ArrowRight className="w-8 h-8 text-slate-500" />

                 {/* MSE Output (Averaged) */}
                 <div className="flex flex-col items-center w-48">
                   <span className="text-[10px] font-bold text-rose-400 uppercase mb-2 text-center">MSE Network Output<br/>(Averaged)</span>
                   <div className="w-full h-32 bg-slate-900 border border-slate-600 rounded-xl relative flex items-end justify-center p-2">
                      <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                        <path d="M 0 50 Q 25 50 50 30 Q 75 50 100 50" fill="none" stroke="#fb7185" strokeWidth="3" />
                      </svg>
                      <div className="absolute top-2 left-2 text-[8px] text-slate-500">"I'll play it safe and guess Pixel 5 (blurry gray)"</div>
                   </div>
                 </div>
              </div>

              {/* Pixel Visualizer */}
              <div className="w-full bg-black border-2 border-slate-700 rounded-xl p-4 flex flex-col items-center">
                 <span className="text-[10px] text-slate-400 font-mono mb-2">Simulated 1D Image Edge</span>
                 <div className="flex h-12 w-full max-w-sm rounded overflow-hidden">
                   {Array.from({length: 11}).map((_, i) => {
                     let color = '#000';
                     if (i > edgePos) color = '#fff';
                     if (i === edgePos) color = '#888';
                     
                     if (edgePos === 5) {
                       if (i === 4) color = '#444';
                       if (i === 5) color = '#888';
                       if (i === 6) color = '#ccc';
                     }

                     return <div key={i} className="flex-1 border-r border-slate-800" style={{ backgroundColor: color }}></div>
                   })}
                 </div>
                 <div className="w-full max-w-sm mt-4">
                   <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest mb-1">
                     <span>Sharp (Mode 1)</span>
                     <span className="text-rose-400 font-bold">Averaged (Blurry)</span>
                     <span>Sharp (Mode 2)</span>
                   </div>
                   <input type="range" min="1" max="9" step="4" value={edgePos} onChange={(e) => setEdgePos(parseInt(e.target.value))} className="w-full accent-rose-500" />
                 </div>
              </div>

           </div>
        </div>

        {/* Right: Explanations */}
        <div className="flex-1 flex flex-col gap-4">
           
           <div className="bg-rose-950/30 border border-rose-500/30 p-6 rounded-2xl shadow-sm">
             <h4 className="font-bold text-rose-400 mb-2 flex items-center gap-2"><Droplet className="w-5 h-5"/> MSE Hates Outliers</h4>
             <p className="text-sm text-slate-300 leading-relaxed">
               Because MSE squares the error (<span className="font-mono text-xs">error²</span>), being completely wrong is punished massively. 
             </p>
           </div>

           <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm flex-grow">
             <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-2"><Layers className="w-5 h-5 text-indigo-400"/> The Bimodal Problem</h4>
             <p className="text-sm text-slate-400 leading-relaxed mb-4">
               Suppose the data contains images where a cat's ear is slightly to the left, and slightly to the right. The VAE latent space isn't sure which one to pick.
             </p>
             <p className="text-sm text-slate-400 leading-relaxed">
               If it guesses "Left" and the answer is "Right", the MSE penalty is huge. To minimize risk, the network outputs a blurry blob exactly in the middle. It's the safest mathematical bet, but looks terrible.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};


// --- SLIDE 8: Monitoring & Diagnostics ---
const MonitoringSlide = () => {
  const [scenario, setScenario] = useState('healthy');
  const [progress, setProgress] = useState(0);

  // Animate progress when scenario changes
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [scenario]);

  // Data point generators for 100 steps
  const getHealthyData = () => {
    let recon = [], kl = [];
    for(let i=0; i<=100; i++) {
      recon.push(100 - (i * 0.8) + (Math.sin(i)*2)); // Drops and stabilizes
      kl.push(i < 20 ? i*1.5 : 30 + (Math.sin(i/2)*3)); // Rises then stabilizes
    }
    return { recon, kl };
  };

  const getCollapseData = () => {
    let recon = [], kl = [];
    for(let i=0; i<=100; i++) {
      recon.push(100 - (i * 0.3)); // Drops slowly / plateaus high
      kl.push(Math.max(0, 50 - i*2)); // Crashes to 0 quickly
    }
    return { recon, kl };
  };

  const getLowCapacityData = () => {
    let recon = [], kl = [];
    for(let i=0; i<=100; i++) {
      recon.push(95 - (i * 0.1) + (Math.random()*5)); // Stays very high, noisy
      kl.push(40 + (Math.sin(i/5)*5)); // Stays high, varying
    }
    return { recon, kl };
  };

  const currentData = scenario === 'healthy' ? getHealthyData() : (scenario === 'collapse' ? getCollapseData() : getLowCapacityData());
  
  // Create SVG path strings from array subset based on progress
  const reconPath = currentData.recon.slice(0, progress).map((y, i) => `${i===0?'M':'L'} ${i},${y}`).join(' ');
  const klPath = currentData.kl.slice(0, progress).map((y, i) => `${i===0?'M':'L'} ${i},${100 - y}`).join(' '); // Invert Y for KL

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Diagnostic Dashboard: Monitoring Training</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Monitoring <em>total ELBO</em> isn't enough. You must monitor Reconstruction Loss and KL Divergence <strong>separately</strong> to diagnose optimization issues.
        </p>
      </div>

      <div className="flex justify-center mb-6 gap-2">
         <button onClick={() => setScenario('healthy')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${scenario === 'healthy' ? 'bg-emerald-500 text-white shadow' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>Healthy Training</button>
         <button onClick={() => setScenario('collapse')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${scenario === 'collapse' ? 'bg-rose-500 text-white shadow' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>Posterior Collapse</button>
         <button onClick={() => setScenario('lowCap')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${scenario === 'lowCap' ? 'bg-amber-500 text-white shadow' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>Low Model Capacity</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Live Charts */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col gap-4">
           
           {/* Recon Loss Chart */}
           <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col relative">
              <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2 mb-2"><LineChart className="w-4 h-4"/> Reconstruction Loss (Decrease = Better)</h4>
              <div className="flex-grow relative">
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                   <path d={reconPath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
           </div>

           {/* KL Divergence Chart */}
           <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col relative">
              <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2 mb-2"><LineChart className="w-4 h-4"/> KL Divergence (Should be {'>'} 0)</h4>
              <div className="flex-grow relative">
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                   <path d={klPath} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
           </div>

        </div>

        {/* Diagnosis Explanations */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          
          <AnimatePresence mode='wait'>
             <motion.div key={scenario} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} className="h-full flex flex-col justify-center">
               
               {scenario === 'healthy' && (
                 <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
                   <h3 className="text-lg font-bold text-emerald-800 mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5"/> Healthy Balance</h3>
                   <p className="text-sm text-emerald-900/80 mb-4">Reconstruction loss decreases steadily. KL divergence rises initially (or stays stable if annealed) and finds a non-zero plateau. The model is learning to reconstruct while properly organizing the latent space.</p>
                 </div>
               )}

               {scenario === 'collapse' && (
                 <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl">
                   <h3 className="text-lg font-bold text-rose-800 mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Posterior Collapse</h3>
                   <p className="text-sm text-rose-900/80 mb-4">The ELBO might be improving slightly, but <strong>the KL term is stuck at exactly zero</strong>. The encoder is ignoring the input. Reconstructions might be okay if the decoder is powerful, but generation from random noise will fail.</p>
                   <div className="bg-rose-100 p-3 rounded-lg text-xs font-bold text-rose-800">Fix: Use KL Annealing or Free Bits.</div>
                 </div>
               )}

               {scenario === 'lowCap' && (
                 <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
                   <h3 className="text-lg font-bold text-amber-800 mb-2 flex items-center gap-2"><Minimize2 className="w-5 h-5"/> Low Capacity / Bad Balance</h3>
                   <p className="text-sm text-amber-900/80 mb-4">The KL term is high (it's trying to spread out), but reconstructions are terrible (loss stays high). The model simply doesn't have enough neural network parameters to model the data, or the learning rate is unstable.</p>
                   <div className="bg-amber-100 p-3 rounded-lg text-xs font-bold text-amber-800">Fix: Make networks deeper, tune LR, or decrease β.</div>
                 </div>
               )}

             </motion.div>
          </AnimatePresence>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm mt-auto">
             <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">General Optimization Checklist</h4>
             <ul className="text-xs text-slate-600 space-y-1">
               <li>• <strong>Learning Rate:</strong> VAEs are sensitive. Tune carefully with Adam.</li>
               <li>• <strong>Initialization:</strong> Bad initial weights cause massive initial KL spikes.</li>
               <li>• <strong>Batch Size:</strong> Too small introduces noise, hurting the delicate ELBO balance.</li>
             </ul>
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
    KLWeightSlide,
    BalancingActSlide,
    PosteriorCollapseSlide,
    CausesOfCollapseSlide,
    KLAnnealingSlide,
    FreeBitsSlide,
    BlurrySamplesSlide,
    MonitoringSlide
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