import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Settings2, Sliders, 
  ArrowRight, Activity, Target, AlertTriangle, 
  Layers, Filter, Eye, Cpu, BookOpen, Code, 
  CheckCircle, XCircle, Shrink, Maximize, FileCode2, ArrowDown
} from 'lucide-react';

// --- SLIDE 1: Intro & Objective Function ---
const IntroBetaVAESlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold mb-2 text-center">Beta-VAEs for Disentangled Representations</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Standard VAEs generate great samples, but their latent dimensions are often "tangled" together. <strong>Beta-VAE</strong> is a simple, pioneering modification designed to force the network to learn <em>independent, interpretable</em> factors of variation.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* LEFT: Standard VAE ELBO */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border-t-4 border-blue-500 p-6 flex flex-col relative overflow-hidden">
           <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
             <Layers className="w-5 h-5 text-blue-400"/> Standard VAE ELBO
           </h3>
           
           <div className="flex-grow flex flex-col items-center justify-center w-full gap-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-700 w-full flex flex-col items-center shadow-inner">
                <span className="font-mono text-sm md:text-base font-bold text-white flex flex-wrap justify-center items-center gap-2">
                  <span>L<sub className="text-[10px]">ELBO</sub> =</span>
                  <span className="text-blue-400">E[log p<sub className="text-[10px]">θ</sub>(x|z)]</span>
                  <span className="text-slate-500">-</span>
                  <span className="text-rose-400">D<sub className="text-[10px]">KL</sub>(q<sub className="text-[10px]">φ</sub>(z|x)||p(z))</span>
                </span>
              </div>
              
              <div className="flex gap-4 w-full text-xs text-slate-300">
                 <div className="flex-1 bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
                   <strong className="text-blue-400 block mb-1">Reconstruction Term</strong>
                   Encourages accurate rebuilding of input x from latent z.
                 </div>
                 <div className="flex-1 bg-rose-900/20 border border-rose-500/30 p-3 rounded-lg">
                   <strong className="text-rose-400 block mb-1">KL Divergence Term</strong>
                   Regularizes the posterior to match the prior p(z).
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT: Beta-VAE Modification */}
        <div className="flex-[1.2] bg-slate-800 rounded-2xl shadow-xl border-t-4 border-emerald-500 p-6 flex flex-col relative overflow-hidden">
           <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
             The Innovation
           </div>
           <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
             <Settings2 className="w-5 h-5 text-emerald-400"/> Beta-VAE Modification
           </h3>
           
           <div className="flex-grow flex flex-col items-center justify-center w-full gap-6">
              <div className="bg-slate-950 p-4 rounded-xl border-2 border-emerald-500/50 w-full flex flex-col items-center shadow-[0_0_20px_rgba(16,185,129,0.15)] relative">
                <span className="font-mono text-sm md:text-lg font-bold text-white flex flex-wrap justify-center items-center gap-2">
                  <span>L<sub className="text-[10px]">β-VAE</sub> =</span>
                  <span className="text-blue-400 opacity-70">E[log p<sub className="text-[10px]">θ</sub>(x|z)]</span>
                  <span className="text-slate-500">-</span>
                  <span className="text-emerald-400 text-2xl animate-pulse">β</span>
                  <span className="text-rose-400 opacity-70">D<sub className="text-[10px]">KL</sub>(q<sub className="text-[10px]">φ</sub>(z|x)||p(z))</span>
                </span>
              </div>
              
              <div className="w-full bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl">
                 <h4 className="font-bold text-emerald-400 text-sm mb-2">The Hyperparameter β</h4>
                 <ul className="text-xs text-slate-300 space-y-2">
                   <li><strong className="text-white font-mono">β = 1 :</strong> Recovers standard VAE.</li>
                   <li><strong className="text-white font-mono">β &gt; 1 :</strong> Stronger emphasis on matching the prior p(z). Promotes disentanglement!</li>
                   <li><strong className="text-white font-mono">0 &lt; β &lt; 1 :</strong> Reduces KL penalty, prioritizing raw reconstruction quality.</li>
                 </ul>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 2: What is Disentanglement? ---
const DisentanglementConceptSlide = () => {
  const [entangledVal, setEntangledVal] = useState(50);
  const [disRotation, setDisRotation] = useState(0);
  const [disSize, setDisSize] = useState(1);
  const [disColor, setDisColor] = useState(180);

  // Entangled logic: One slider messes up everything unpredictably
  const entRot = (entangledVal * 3.6) + 45;
  const entSize = 0.5 + (Math.sin(entangledVal / 10) * 0.5) + 0.5;
  const entHue = (entangledVal * 5) % 360;

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">What is a "Disentangled" Representation?</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          A representation is disentangled if <strong>each latent dimension (z) captures exactly one distinct, independent factor of variation</strong> in the data (like size, color, or rotation).
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Entangled Simulator */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border-t-8 border-rose-400 p-6 flex flex-col relative overflow-hidden">
           <h3 className="font-bold text-rose-700 mb-2 flex items-center gap-2 border-b pb-2">
             <AlertTriangle className="w-5 h-5"/> Entangled (Standard VAE)
           </h3>
           <p className="text-xs text-slate-500 mb-6 h-12">Dimensions are mixed. Changing one latent variable unpredictably alters multiple features at once.</p>
           
           <div className="flex-grow flex flex-col items-center justify-center gap-6 w-full">
              <div className="w-32 h-32 bg-slate-100 rounded-xl border-2 border-slate-300 shadow-inner flex items-center justify-center overflow-hidden">
                 <motion.div 
                   className="w-16 h-16 rounded-sm shadow-md"
                   style={{ backgroundColor: `hsl(${entHue}, 80%, 60%)` }}
                   animate={{ rotate: entRot, scale: entSize }}
                   transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
                 />
              </div>

              <div className="w-full max-w-xs bg-rose-50 p-4 rounded-xl border border-rose-200">
                <span className="text-[10px] font-bold text-rose-800 uppercase tracking-widest block mb-2">Latent Dimension z₁</span>
                <input type="range" min="0" max="100" value={entangledVal} onChange={(e) => setEntangledVal(e.target.value)} className="w-full accent-rose-500" />
                <span className="text-[10px] text-rose-600 block mt-1 text-center italic">Changes Size, Color AND Rotation simultaneously!</span>
              </div>
           </div>
        </div>

        {/* Disentangled Simulator */}
        <div className="flex-[1.2] bg-white rounded-2xl shadow-lg border-t-8 border-emerald-500 p-6 flex flex-col relative overflow-hidden">
           <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider">
             The Goal
           </div>
           <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2 border-b pb-2">
             <Sliders className="w-5 h-5"/> Disentangled (Beta-VAE)
           </h3>
           <p className="text-xs text-slate-500 mb-6 h-12">Fine-grained control. Each latent variable acts as an isolated dial for a specific generative feature.</p>
           
           <div className="flex-grow flex flex-col items-center justify-center gap-6 w-full">
              <div className="w-32 h-32 bg-slate-100 rounded-xl border-2 border-slate-300 shadow-inner flex items-center justify-center overflow-hidden">
                 <motion.div 
                   className="w-16 h-16 rounded-sm shadow-md"
                   style={{ backgroundColor: `hsl(${disColor}, 80%, 60%)` }}
                   animate={{ rotate: parseInt(disRotation), scale: parseFloat(disSize) }}
                   transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
                 />
              </div>

              <div className="w-full grid grid-cols-3 gap-3">
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex flex-col items-center">
                  <span className="text-[9px] font-bold text-emerald-800 uppercase mb-2">z₁ (Rotation)</span>
                  <input type="range" min="0" max="360" value={disRotation} onChange={(e) => setDisRotation(e.target.value)} className="w-full accent-emerald-500" />
                </div>
                <div className="bg-blue-50 p-2 rounded-lg border border-blue-200 flex flex-col items-center">
                  <span className="text-[9px] font-bold text-blue-800 uppercase mb-2">z₂ (Size)</span>
                  <input type="range" min="0.5" max="1.5" step="0.1" value={disSize} onChange={(e) => setDisSize(e.target.value)} className="w-full accent-blue-500" />
                </div>
                <div className="bg-purple-50 p-2 rounded-lg border border-purple-200 flex flex-col items-center">
                  <span className="text-[9px] font-bold text-purple-800 uppercase mb-2">z₃ (Color)</span>
                  <input type="range" min="0" max="360" value={disColor} onChange={(e) => setDisColor(e.target.value)} className="w-full accent-purple-500" />
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 3: The Information Bottleneck ---
const InformationBottleneckSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">How β &gt; 1 Encourages Disentanglement</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Increasing the weight on the KL Divergence term effectively constrains the <strong>information capacity</strong> of the latent channel <span className="font-mono text-emerald-400">z</span>. It creates an <em>Information Bottleneck</em>.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: The Prior Match Visual */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col relative overflow-hidden">
           <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2 border-b border-slate-600 pb-2">
             <Target className="w-5 h-5"/> Matching an Isotropic Prior
           </h3>
           <p className="text-sm text-slate-300 mb-6 leading-relaxed">
             The standard prior <span className="font-mono text-xs bg-slate-900 px-1 rounded text-purple-300">p(z) = N(0, I)</span> has <strong>independent dimensions</strong> (due to the Identity matrix <span className="font-mono">I</span>). 
           </p>
           
           <div className="flex-grow flex items-center justify-center">
              <div className="relative w-48 h-48">
                 {/* X/Y Axes */}
                 <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-500"></div>
                 <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-500"></div>
                 
                 {/* Perfect Circle Gaussian */}
                 <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-400 bg-emerald-500/10 flex items-center justify-center">
                    <span className="absolute -top-6 text-[10px] font-bold text-emerald-400 font-mono">Independent N(0,I)</span>
                 </div>
                 
                 {/* Squeezing Arrows */}
                 <ArrowRight className="absolute -left-8 top-1/2 -translate-y-1/2 text-rose-400 animate-pulse" />
                 <ArrowRight className="absolute -right-8 top-1/2 -translate-y-1/2 text-rose-400 animate-pulse rotate-180" />
                 <ArrowDown className="absolute left-1/2 -top-8 -translate-x-1/2 text-rose-400 animate-pulse" />
                 <ArrowDown className="absolute left-1/2 -bottom-8 -translate-x-1/2 text-rose-400 animate-pulse rotate-180" />
              </div>
           </div>

           <p className="text-xs text-slate-400 mt-6 text-center italic">
             High pressure (large β) forces the encoder's output <span className="font-mono text-rose-300">q(z|x)</span> to perfectly align with this statistically independent structure.
           </p>
        </div>

        {/* Right: The Squeeze (Bottleneck) */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col relative overflow-hidden">
           <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2 border-b border-slate-600 pb-2">
             <Shrink className="w-5 h-5"/> The Information Bottleneck
           </h3>
           <p className="text-sm text-slate-300 mb-6 leading-relaxed">
             Under immense KL pressure, the model cannot pass everything through <span className="font-mono">z</span>. It is forced to be <strong>highly selective</strong> about what information survives.
           </p>

           <div className="flex-grow flex flex-col items-center justify-center w-full">
              
              <div className="flex w-full items-center justify-center gap-2">
                 <div className="bg-slate-700 p-2 rounded flex flex-col gap-1 w-24">
                   <div className="h-2 w-full bg-slate-400 rounded"></div>
                   <div className="h-2 w-full bg-slate-400 rounded"></div>
                   <div className="h-2 w-full bg-slate-400 rounded"></div>
                   <div className="h-2 w-full bg-slate-400 rounded"></div>
                   <div className="h-2 w-full bg-slate-400 rounded"></div>
                   <span className="text-[8px] text-center text-slate-400 mt-1">All Data Features</span>
                 </div>
                 
                 {/* Funnel Shape */}
                 <div className="w-16 h-24 bg-slate-600 relative overflow-hidden flex items-center justify-center" style={{ clipPath: 'polygon(0 0, 100% 30%, 100% 70%, 0 100%)' }}>
                    <div className="w-full h-2 bg-rose-500 absolute top-1/2 -translate-y-1/2 shadow-[0_0_10px_red]"></div>
                    <span className="absolute text-[8px] font-bold text-white uppercase transform rotate-90">High β</span>
                 </div>

                 <div className="bg-blue-900/50 border border-blue-500 p-2 rounded flex flex-col gap-1 w-24 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                   <div className="h-2 w-full bg-emerald-400 rounded shadow-sm"></div>
                   <div className="h-2 w-full bg-blue-400 rounded shadow-sm"></div>
                   <div className="h-2 w-full bg-transparent"></div>
                   <div className="h-2 w-full bg-transparent"></div>
                   <div className="h-2 w-full bg-transparent"></div>
                   <span className="text-[8px] text-center text-blue-300 mt-1">Most Salient &<br/>Independent</span>
                 </div>
              </div>

           </div>

           <p className="text-xs text-slate-400 mt-6 text-center italic">
             To survive the bottleneck and still rebuild the image, the model <strong>discards noise and entangled features</strong>, keeping only the most fundamental, independent properties.
           </p>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 4: The Beta Trade-off Spectrum (Interactive) ---
const BetaTradeoffSlide = () => {
  const [betaValue, setBetaValue] = useState(1);

  // Derive states from Beta
  const getVisualState = () => {
    if (betaValue < 1) { // e.g. 0 to 0.9: Overfitting / Standard AE territory
      return { label: "Low β", type: "Standard VAE / AE", reconBlur: 0, disColor: '#fb923c', disText: 'Often Entangled Representations', klPressure: 'Low' };
    } else if (betaValue < 4) { // e.g. 1 to 3.9: Balanced
      return { label: "β = 1", type: "Standard VAE", reconBlur: 1, disColor: '#fb923c', disText: 'Balances recon and KL. Somewhat entangled.', klPressure: 'Moderate' };
    } else if (betaValue <= 8) { // e.g. 4 to 8: Beta VAE Sweet spot
      return { label: "High β (e.g. β > 4)", type: "Beta-VAE", reconBlur: 3, disColor: '#34d399', disText: 'Improved Disentanglement', klPressure: 'Strong' };
    } else { // e.g. > 8: Posterior collapse
      return { label: "Extreme β", type: "Posterior Collapse", reconBlur: 8, disColor: '#facc15', disText: 'Latent variables ignored. Severe blur.', klPressure: 'Overpowering' };
    }
  };

  const state = getVisualState();

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">The Trade-off Spectrum</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Increasing <span className="font-mono font-bold">β</span> comes at a cost. It forces disentanglement by sacrificing reconstruction fidelity. There is a delicate balance to strike.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* The Interactive Dashboard */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col relative overflow-hidden">
           
           {/* Slider Area */}
           <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 mb-8 relative">
              <span className="absolute top-2 left-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">β Setting</span>
              <div className="flex justify-between items-end mb-2 mt-2">
                 <span className="font-mono text-2xl font-bold text-indigo-600">β = {betaValue.toFixed(1)}</span>
                 <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded shadow-sm">{state.type}</span>
              </div>
              <input type="range" min="0" max="12" step="0.5" value={betaValue} onChange={(e) => setBetaValue(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
           </div>

           {/* Outcomes Visualizer */}
           <div className="flex-grow flex flex-col gap-6 w-full relative">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-full text-center">Observed Outcomes</span>
              
              <div className="flex gap-6 w-full h-full">
                 {/* Reconstruction Box */}
                 <div className="flex-1 bg-green-50/50 border-2 border-green-200 rounded-xl flex flex-col items-center p-4 transition-colors">
                    <span className="text-xs font-bold text-green-800 mb-4 text-center">Reconstruction<br/>Fidelity</span>
                    <div className="w-24 h-24 bg-black rounded-lg border-2 border-slate-300 shadow-inner overflow-hidden flex items-center justify-center">
                       <img src="https://picsum.photos/id/1025/100/100" className="w-full h-full object-cover grayscale transition-all duration-300" style={{ filter: `blur(${state.reconBlur}px)` }} />
                    </div>
                    {betaValue > 8 && <span className="text-[10px] text-rose-600 font-bold mt-3 text-center uppercase tracking-widest">Fidelity Sacrificed</span>}
                 </div>

                 {/* Disentanglement Box */}
                 <div className="flex-1 rounded-xl flex flex-col items-center p-4 transition-colors border-2 shadow-sm" style={{ backgroundColor: `${state.disColor}20`, borderColor: state.disColor }}>
                    <span className="text-xs font-bold mb-4 text-center" style={{ color: state.disColor }}>Representation<br/>Structure</span>
                    
                    <div className="w-24 h-24 bg-white rounded-lg shadow-inner flex items-center justify-center p-2 relative">
                       {/* Visualizing Entangled vs Disentangled axes */}
                       <motion.div className="absolute w-1 h-16 origin-center rounded-full" style={{ backgroundColor: state.disColor }} animate={{ rotate: betaValue < 4 ? 45 : 0 }} />
                       <motion.div className="absolute w-16 h-1 origin-center rounded-full" style={{ backgroundColor: state.disColor }} animate={{ rotate: betaValue < 4 ? 45 : 0 }} />
                       <motion.div className="absolute w-1 h-16 origin-center rounded-full" style={{ backgroundColor: state.disColor }} animate={{ rotate: betaValue < 4 ? -20 : 90 }} />
                    </div>
                    <span className="text-[10px] font-bold mt-3 text-center" style={{ color: state.disColor }}>{state.disText}</span>
                 </div>
              </div>
           </div>

        </div>

        {/* Text Explanations */}
        <div className="flex-[0.8] flex flex-col gap-4 justify-center">
           <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-sm border border-slate-700">
             <h4 className="font-bold text-rose-400 text-lg mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> The Blur Phenomenon</h4>
             <p className="text-sm text-slate-300 leading-relaxed mb-2">
               Increasing β too much forces the model to prioritize the Prior over Reconstruction.
             </p>
             <p className="text-sm text-slate-300 leading-relaxed">
               The generated samples become overly smooth or blurry. If forced too hard, the model may experience <strong>Posterior Collapse</strong>, ignoring the latent variables entirely because they cost too much "KL penalty" to use.
             </p>
           </div>
           
           <div className="bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-200 mt-2">
             <h4 className="font-bold text-emerald-800 text-lg mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5"/> Finding the Balance</h4>
             <p className="text-sm text-slate-700 leading-relaxed">
               There is no universal "perfect" β. It must be carefully tuned. You want it high enough to force the vectors to align with independent axes (disentanglement), but low enough that the image doesn't turn to mush.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 5: Practical Implementation & Tuning ---
const ImplementationSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">Practical Implementation & Tuning</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Implementing Beta-VAE is incredibly straightforward. It requires modifying only a single line of code in a standard VAE training loop.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: Code Block */}
        <div className="flex-[1.2] bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col relative overflow-hidden">
           <h3 className="font-bold text-slate-300 mb-4 text-sm uppercase tracking-widest flex items-center gap-2 border-b border-slate-600 pb-2">
             <FileCode2 className="w-5 h-5"/> PyTorch Loss Computation
           </h3>
           
           <div className="flex-grow bg-[#1e1e1e] rounded-xl p-4 font-mono text-sm leading-relaxed overflow-x-auto border border-slate-700 shadow-inner text-slate-300">
              <span className="text-slate-500"># Assume losses are computed per batch</span><br/>
              <span className="text-blue-400">recon_loss</span> = criterion(x_reconstructed, x_original)<br/>
              <span className="text-purple-400">kl_loss</span> = -0.5 * torch.sum(1 + log_var - mu.pow(2) - log_var.exp())<br/>
              <br/>
              <span className="text-slate-500"># Standard VAE loss</span><br/>
              <span className="opacity-50 line-through">total_loss = recon_loss + kl_loss</span><br/>
              <br/>
              <span className="text-emerald-400 font-bold"># Beta-VAE loss</span><br/>
              <span className="text-yellow-300 font-bold">beta_value = 4.0</span> <span className="text-slate-500"># Hyperparameter</span><br/>
              <span className="text-white font-bold bg-slate-800 px-2 py-1 rounded">total_loss = <span className="text-blue-400">recon_loss</span> + <span className="text-yellow-300">beta_value</span> * <span className="text-purple-400">kl_loss</span></span><br/>
              <br/>
              <span className="text-slate-500"># Backpropagate</span><br/>
              total_loss.backward()
           </div>
        </div>

        {/* Right: Tuning Advice */}
        <div className="flex-1 flex flex-col gap-4">
           
           <div className="bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700 flex-1">
             <h4 className="font-bold text-amber-400 text-lg mb-2 flex items-center gap-2"><Eye className="w-5 h-5"/> How to Tune β</h4>
             <ul className="text-sm text-slate-300 space-y-4">
               <li className="flex gap-2">
                 <span className="text-amber-500">1.</span> 
                 <span><strong>Values:</strong> β = 4 or β = 10 are common starting points in literature (e.g., dSprites dataset).</span>
               </li>
               <li className="flex gap-2">
                 <span className="text-amber-500">2.</span> 
                 <span><strong>Monitor Separately:</strong> Log <span className="font-mono text-blue-300">recon_loss</span> and <span className="font-mono text-purple-300">kl_loss</span> separately during training.</span>
               </li>
               <li className="flex gap-2">
                 <span className="text-amber-500">3.</span> 
                 <span><strong>Watch for Collapse:</strong> If KL quickly drops to near zero while Recon remains terrible, β is too high or the model lacks capacity.</span>
               </li>
             </ul>
           </div>

           <div className="bg-indigo-900/30 border border-indigo-500/50 p-6 rounded-2xl shadow-sm flex-1">
             <h4 className="font-bold text-indigo-400 text-lg mb-2 flex items-center gap-2"><Maximize className="w-5 h-5"/> Visual Inspection</h4>
             <p className="text-sm text-slate-300 leading-relaxed">
               The optimal β is often found by visually inspecting <strong>Latent Traversals</strong>. You sweep the value of a single dimension zᵢ from -3 to +3 while keeping others fixed. If the generated image smoothly changes exactly one feature (e.g., only hair color changes), you have achieved disentanglement!
             </p>
           </div>
           
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 6: Strengths and Limitations ---
const SummarySlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Strengths and Limitations</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Beta-VAE laid the critical groundwork for disentangled representation learning, highlighting the manipulation of the VAE objective.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Strengths */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border-t-8 border-emerald-500 p-8 flex flex-col relative overflow-hidden">
           <h3 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
             <CheckCircle className="w-6 h-6 text-emerald-500"/> Strengths
           </h3>
           
           <div className="flex flex-col gap-6 flex-grow">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                 <h4 className="font-bold text-emerald-700 mb-1">Simplicity</h4>
                 <p className="text-sm text-slate-600">Introduces only one single additional hyperparameter (β). It requires absolutely minimal changes to the standard VAE architecture or training loop.</p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                 <h4 className="font-bold text-emerald-700 mb-1">Empirical Effectiveness</h4>
                 <p className="text-sm text-slate-600">Despite its simplicity, it has been empirically shown to significantly improve disentanglement over standard VAEs on several benchmark datasets (like 3D Faces or dSprites).</p>
              </div>
           </div>
        </div>

        {/* Limitations */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border-t-8 border-rose-500 p-8 flex flex-col relative overflow-hidden">
           <h3 className="text-2xl font-bold text-rose-800 mb-6 flex items-center gap-2">
             <XCircle className="w-6 h-6 text-rose-500"/> Limitations
           </h3>
           
           <div className="flex flex-col gap-4 flex-grow">
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                 <h4 className="font-bold text-rose-700 mb-1">The Core Trade-off</h4>
                 <p className="text-sm text-slate-600">Balancing disentanglement with reconstruction quality is tough. High β leads to overly constrained spaces that discard necessary information (blurriness).</p>
              </div>
              
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                 <h4 className="font-bold text-rose-700 mb-1">Hyperparameter Sensitivity</h4>
                 <p className="text-sm text-slate-600">The model's performance is extremely sensitive to the exact choice of β, demanding careful and tedious tuning.</p>
              </div>

              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                 <h4 className="font-bold text-rose-700 mb-1">Indirect Optimization</h4>
                 <p className="text-sm text-slate-600">Beta-VAE only <em>indirectly</em> encourages disentanglement via pressure. It does not explicitly target statistical independence metrics.</p>
              </div>
           </div>
        </div>

      </div>
      
      {/* Conclusion Bar */}
      <div className="w-full max-w-6xl mx-auto mt-auto shrink-0 bg-slate-800 text-white p-4 rounded-xl text-center text-sm shadow-md border border-slate-700">
         These limitations paved the way for advanced variants like <strong>FactorVAE</strong> and <strong>Total Correlation VAE (TCVAE)</strong>, which refine the objective function to directly target disentanglement without sacrificing as much reconstruction quality.
      </div>

    </div>
  );
};

// --- MAIN SLIDESHOW COMPONENT ---
const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    IntroBetaVAESlide,
    DisentanglementConceptSlide,
    InformationBottleneckSlide,
    BetaTradeoffSlide,
    ImplementationSlide,
    SummarySlide
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