import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Dices, Pointer, 
  ArrowRight, ArrowDown, BrainCircuit, Box, 
  Settings2, AlignLeft, Image as ImageIcon, 
  Binary, Merge, CheckCircle, AlertTriangle, 
  Network, Database, BookOpen, Fingerprint, Layers,
  Mic, FlaskConical, Palette, MessageSquare, ShieldCheck, HelpCircle
} from 'lucide-react';

// --- SLIDE 1: Why Conditional VAEs? ---
const IntroCVAESlide = () => {
  const [generateTick, setGenerateTick] = useState(0);
  const [vaeResult, setVaeResult] = useState('?');
  
  const [selectedDigit, setSelectedDigit] = useState('7');
  const [cvaeResult, setCvaeResult] = useState('?');

  const randomDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  const triggerVAE = () => {
    let count = 0;
    const interval = setInterval(() => {
      setVaeResult(randomDigits[Math.floor(Math.random() * randomDigits.length)]);
      count++;
      if (count > 10) clearInterval(interval);
    }, 50);
  };

  const triggerCVAE = () => {
    let count = 0;
    const interval = setInterval(() => {
      setCvaeResult(randomDigits[Math.floor(Math.random() * randomDigits.length)]);
      count++;
      if (count > 10) {
        clearInterval(interval);
        setCvaeResult(selectedDigit);
      }
    }, 50);
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">From Randomness to Control: The CVAE</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Standard VAEs are amazing at learning distributions, but we have zero control over what they generate. We want to tell the model exactly <em>what</em> to draw.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* LEFT: Standard VAE */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border-t-4 border-slate-400 p-8 flex flex-col items-center text-center relative overflow-hidden">
           <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2 text-lg">
             <Dices className="w-5 h-5"/> Standard VAE
           </h3>
           <p className="text-xs text-slate-500 mb-8 uppercase tracking-widest font-bold">The Slot Machine</p>
           
           <div className="flex-grow flex flex-col items-center justify-center w-full gap-4">
              <div className="bg-purple-100 border-2 border-purple-300 w-20 h-20 rounded-full flex items-center justify-center font-mono font-bold text-purple-700 text-sm shadow-inner">
                z ~ p(z)
              </div>
              <ArrowDown className="text-slate-300 w-6 h-6" />
              <div className="bg-slate-800 text-white font-bold w-full py-3 rounded-lg shadow-md border-2 border-slate-700">
                Decoder p(x|z)
              </div>
              <ArrowDown className="text-slate-300 w-6 h-6" />
              <div className="w-24 h-24 bg-slate-100 border-2 border-slate-300 rounded-xl flex items-center justify-center text-5xl font-mono shadow-inner">
                {vaeResult}
              </div>
           </div>

           <button onClick={triggerVAE} className="mt-8 w-full py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-colors">
             Generate Random Digit
           </button>
           <p className="text-[10px] text-slate-500 mt-3 text-center px-4">We sample a random 'z' and get a random digit back. We cannot ask for a '7'.</p>
        </div>

        {/* RIGHT: Conditional VAE */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border-t-4 border-indigo-500 p-8 flex flex-col items-center text-center relative overflow-hidden">
           <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
             The Solution
           </div>
           <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2 text-lg">
             <Pointer className="w-5 h-5"/> Conditional VAE
           </h3>
           <p className="text-xs text-indigo-400 mb-8 uppercase tracking-widest font-bold">The Vending Machine</p>
           
           <div className="flex-grow flex flex-col items-center justify-center w-full gap-4 relative">
              
              <div className="flex gap-4 items-center">
                 <div className="bg-emerald-100 border-2 border-emerald-400 p-2 rounded-lg flex flex-col items-center shadow-sm z-10 relative group cursor-pointer">
                    <span className="text-[9px] font-bold text-emerald-800 uppercase mb-1">Condition (c)</span>
                    <select value={selectedDigit} onChange={(e) => setSelectedDigit(e.target.value)} className="font-mono font-bold text-emerald-900 bg-white border border-emerald-300 rounded outline-none p-1 text-lg">
                      {randomDigits.map(d => <option key={d} value={d}>Digit {d}</option>)}
                    </select>
                 </div>
                 
                 <span className="font-bold text-slate-300">+</span>

                 <div className="bg-purple-100 border-2 border-purple-300 w-16 h-16 rounded-full flex flex-col items-center justify-center font-mono font-bold text-purple-700 text-xs shadow-inner">
                   <span className="text-[9px] font-sans uppercase">Noise</span>
                   z ~ p(z)
                 </div>
              </div>

              <ArrowDown className="text-slate-300 w-6 h-6" />
              
              <div className="bg-indigo-600 text-white font-bold w-full py-3 rounded-lg shadow-md border-2 border-indigo-500">
                Decoder p(x|z, c)
              </div>
              
              <ArrowDown className="text-slate-300 w-6 h-6" />
              
              <div className="w-24 h-24 bg-white border-4 border-indigo-400 rounded-xl flex items-center justify-center text-5xl font-mono shadow-lg text-indigo-900">
                {cvaeResult}
              </div>
           </div>

           <button onClick={triggerCVAE} className="mt-8 w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md transition-colors">
             Generate Specific Digit
           </button>
           <p className="text-[10px] text-slate-500 mt-3 text-center px-4">We pass our desired condition <span className="font-mono font-bold">c</span> ALONGSIDE the noise <span className="font-mono font-bold">z</span>. The network is forced to draw what we ask for.</p>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 2: The Architecture Flow ---
const ArchitectureSlide = () => {
  const [animating, setAnimating] = useState(false);

  const runFlow = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 3000);
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-4">
        <h2 className="text-3xl font-bold mb-2 text-center">CVAE Architecture Diagram</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          To make the model "conditional", we must feed the condition variable <span className="font-mono font-bold text-emerald-400">c</span> into <strong>both</strong> the Encoder and the Decoder alongside their normal inputs.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* LEFT: The Architecture Flowchart */}
        <div className="flex-[1.2] bg-slate-800 rounded-2xl shadow-2xl border-2 border-slate-700 p-6 flex flex-col relative items-center overflow-hidden">
           
           <div className="w-full max-w-[350px] relative flex flex-col items-center">
              
              {/* TOP INPUTS */}
              <div className="flex justify-between w-full px-8 relative z-20">
                <div className="bg-emerald-900/50 border-2 border-emerald-500 p-3 rounded-lg flex flex-col items-center shadow-lg w-28 relative">
                   <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Condition</span>
                   <span className="font-mono font-bold text-lg text-white">c</span>
                   {animating && <motion.div initial={{ top: 40 }} animate={{ top: 400 }} transition={{ duration: 1.5 }} className="absolute w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399] -z-10" />}
                </div>
                <div className="bg-blue-900/50 border-2 border-blue-500 p-3 rounded-lg flex flex-col items-center shadow-lg w-28 relative">
                   <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Input Data</span>
                   <span className="font-mono font-bold text-lg text-white">x</span>
                   {animating && <motion.div initial={{ top: 40 }} animate={{ top: 100 }} transition={{ duration: 0.5 }} className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] -z-10" />}
                </div>
              </div>

              {/* ENCODER BLOCK */}
              <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-4 w-full mt-6 flex flex-col items-center relative z-10">
                 <span className="absolute -top-3 bg-slate-800 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Encoder q_φ(z | x, c)</span>
                 
                 <div className="w-48 bg-blue-500/20 border-2 border-blue-400 rounded-full py-2 flex items-center justify-center font-bold text-sm text-blue-200 shadow-inner mt-4">
                   Encoder NN
                 </div>
                 
                 <div className="flex justify-between w-full px-6 mt-6">
                    <div className="bg-purple-900/50 border-2 border-purple-500 rounded-full w-16 h-10 flex items-center justify-center font-mono font-bold text-xs text-purple-300">μ</div>
                    <div className="bg-purple-900/50 border-2 border-purple-500 rounded-full w-16 h-10 flex items-center justify-center font-mono font-bold text-xs text-purple-300">log(σ²)</div>
                 </div>
                 {/* Arrows inside encoder */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
                   <path d="M 100 0 L 175 40" stroke="#94a3b8" strokeWidth="2" fill="none" />
                   <path d="M 250 0 L 175 40" stroke="#94a3b8" strokeWidth="2" fill="none" />
                   <path d="M 175 80 L 100 120" stroke="#94a3b8" strokeWidth="2" fill="none" />
                   <path d="M 175 80 L 250 120" stroke="#94a3b8" strokeWidth="2" fill="none" />
                 </svg>
              </div>

              {/* LATENT SPACE BLOCK */}
              <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-4 w-full mt-6 flex flex-col items-center relative z-10">
                 <span className="absolute -top-3 bg-slate-800 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latent Space</span>
                 
                 <div className="w-full bg-orange-500/20 border-2 border-orange-400/50 rounded-lg p-3 flex flex-col items-center justify-center mt-2 shadow-inner" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)' }}>
                   <span className="font-bold text-xs text-orange-200">Reparameterization</span>
                   <span className="font-mono text-[10px] text-orange-300">z = μ + ε · σ</span>
                 </div>

                 <div className="bg-yellow-500 border-2 border-yellow-400 text-yellow-900 font-bold font-mono px-6 py-2 rounded mt-6 shadow-md z-20">
                   z (Sampled)
                 </div>
                 {/* Arrows inside latent */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
                   <path d="M 100 -25 L 175 25" stroke="#94a3b8" strokeWidth="2" fill="none" />
                   <path d="M 250 -25 L 175 25" stroke="#94a3b8" strokeWidth="2" fill="none" />
                   <path d="M 175 80 L 175 110" stroke="#94a3b8" strokeWidth="2" fill="none" />
                 </svg>
              </div>

              {/* DECODER BLOCK */}
              <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-4 w-full mt-6 flex flex-col items-center relative z-10">
                 <span className="absolute -top-3 bg-slate-800 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Decoder p_θ(x | z, c)</span>
                 
                 <div className="w-48 bg-rose-500/20 border-2 border-rose-400 rounded-full py-2 flex items-center justify-center font-bold text-sm text-rose-200 shadow-inner mt-4">
                   Decoder NN
                 </div>
                 
                 <div className="bg-white text-slate-900 font-bold px-6 py-2 rounded border-2 border-slate-300 mt-6 shadow-md">
                   Reconstructed x̂
                 </div>
                 {/* Arrows inside decoder */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
                   <path d="M 175 -25 L 175 25" stroke="#94a3b8" strokeWidth="2" fill="none" />
                   <path d="M 175 60 L 175 100" stroke="#94a3b8" strokeWidth="2" fill="none" />
                 </svg>
              </div>

              {/* The Long "C" Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ top: 0, left: 0, overflow: 'visible' }}>
                 {/* C to Encoder */}
                 <path d="M 100 40 L 100 90 L 140 100" stroke="#34d399" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                 {/* C to Decoder */}
                 <path d="M 70 40 L 40 40 L 40 450 L 140 450" stroke="#34d399" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              </svg>

           </div>
           
           <div className="mt-8 flex justify-center w-full">
             <button onClick={runFlow} disabled={animating} className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-full hover:bg-emerald-500 shadow-lg disabled:opacity-50 transition-colors flex items-center gap-2">
               <Fingerprint className="w-4 h-4"/> Trace Flow
             </button>
           </div>
        </div>

        {/* RIGHT: Explanations */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           <div className="bg-emerald-900/30 border border-emerald-500/50 p-6 rounded-2xl shadow-sm">
             <h4 className="font-bold text-emerald-400 mb-2 text-lg">The "Condition" Variable (c)</h4>
             <p className="text-sm text-slate-300 leading-relaxed">
               <span className="font-mono">c</span> represents the extra information we want to guide the generation (e.g., class label '7', text description, or physical properties).
             </p>
           </div>
           
           <div className="bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700">
             <h4 className="font-bold text-blue-400 mb-2">Conditioning the Encoder</h4>
             <div className="font-mono text-xs bg-slate-900 p-2 rounded text-slate-400 mb-3 border border-slate-600">q_φ(z | x, <span className="text-emerald-400 font-bold">c</span>)</div>
             <p className="text-sm text-slate-300 leading-relaxed">
               The Encoder learns to map data to latent space <em>given</em> the context of <span className="font-mono">c</span>. It figures out how to extract features that are <em>independent</em> of <span className="font-mono">c</span>.
             </p>
           </div>

           <div className="bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700">
             <h4 className="font-bold text-rose-400 mb-2">Conditioning the Decoder</h4>
             <div className="font-mono text-xs bg-slate-900 p-2 rounded text-slate-400 mb-3 border border-slate-600">p_θ(x | z, <span className="text-emerald-400 font-bold">c</span>)</div>
             <p className="text-sm text-slate-300 leading-relaxed">
               The Decoder combines the random style/noise from <span className="font-mono">z</span> with the strict instructions from <span className="font-mono">c</span> to generate the final targeted image.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 3: The Mathematical Formulation (ELBO) ---
const MathFormulationSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Mathematical Formulation of CVAEs</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          The objective function is a conditional version of the Evidence Lower Bound (ELBO). It looks complex, but it is exactly the same as the standard VAE, just with <span className="font-mono font-bold bg-slate-200 px-1 rounded text-emerald-600">| c</span> glued to every term!
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* The Equation Box */}
        <div className="bg-slate-900 rounded-2xl shadow-xl border-2 border-slate-800 p-8 flex flex-col items-center relative w-full shrink-0">
           <span className="absolute -top-3 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg tracking-widest uppercase">The Conditional ELBO</span>
           <div className="font-mono text-lg md:text-2xl font-bold text-white text-center flex flex-wrap justify-center items-center gap-3 mt-4">
             <span className="text-slate-300">L(x, <span className="text-emerald-400">c</span>) =</span>
             
             <div className="relative group">
               <span className="bg-blue-900/50 text-blue-300 border border-blue-500/50 px-3 py-2 rounded-lg inline-block">
                 E<sub className="text-[10px]">q(z|x, <span className="text-emerald-400">c</span>)</sub>[ log p(x|z, <span className="text-emerald-400">c</span>) ]
               </span>
             </div>
             
             <span className="text-slate-500 text-3xl mx-2">-</span>
             
             <div className="relative group">
               <span className="bg-rose-900/50 text-rose-300 border border-rose-500/50 px-3 py-2 rounded-lg inline-block">
                 D<sub className="text-[10px]">KL</sub>( q(z|x, <span className="text-emerald-400">c</span>) || p(z|<span className="text-emerald-400">c</span>) )
               </span>
             </div>
           </div>
        </div>

        {/* Breakdown Panels */}
        <div className="flex flex-col lg:flex-row gap-6 w-full flex-grow">
           
           <div className="flex-1 bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex flex-col">
             <h4 className="font-bold text-blue-800 text-lg mb-2 border-b pb-2">Reconstruction Term</h4>
             <p className="text-sm text-slate-600 leading-relaxed mb-4">
               Encourages the decoder <span className="font-mono text-xs font-bold text-blue-600">p(x|z, c)</span> to accurately reconstruct <span className="font-mono font-bold">x</span> given the latent code <span className="font-mono font-bold">z</span> AND the specific condition <span className="font-mono font-bold text-emerald-600">c</span>.
             </p>
           </div>

           <div className="flex-1 bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex flex-col">
             <h4 className="font-bold text-rose-800 text-lg mb-2 border-b pb-2">KL Divergence Term</h4>
             <p className="text-sm text-slate-600 leading-relaxed mb-4">
               Pushes the encoder's distribution to be close to the prior distribution over the latent variables, which is <em>also</em> conditioned on <span className="font-mono font-bold text-emerald-600">c</span>.
             </p>
           </div>

        </div>

        {/* The Crucial Simplification Callout */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl shadow-sm p-6 w-full relative">
           <h3 className="font-bold text-amber-900 text-lg mb-2 flex items-center gap-2">
             <AlertTriangle className="w-5 h-5"/> Crucial Simplification in Practice
           </h3>
           <p className="text-sm text-slate-700 leading-relaxed mb-4">
             The math says the prior should be <span className="font-mono font-bold bg-white px-1 border border-amber-200 rounded text-amber-700">p(z|c)</span>. But in practice, a common simplification is to assume the prior is independent of the condition:
           </p>
           <div className="flex justify-center mb-4">
             <span className="font-mono font-bold text-lg bg-white px-4 py-2 border-2 border-dashed border-amber-400 rounded-lg shadow-inner text-slate-800">
               p(z|c) = p(z) = <span className="text-purple-600">N(0, I)</span>
             </span>
           </div>
           <p className="text-sm text-slate-700 leading-relaxed">
             <strong>Why?</strong> If we force the prior to be a standard Gaussian <span className="font-mono">N(0, I)</span> regardless of the condition, it forces the Encoder to push <em>all</em> the class-specific information into <span className="font-mono">c</span>, leaving <span className="font-mono">z</span> to solely represent independent style variations! This is how CVAEs achieve disentanglement.
           </p>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 4: Implementing Conditioning ---
const ImplementationSlide = () => {
  const [method, setMethod] = useState('categorical');

  const methods = {
    categorical: {
      title: "Categorical Conditions (Classes)",
      desc: "For discrete classes like Digit '0' through '9', we use One-Hot Encoding and concatenate it.",
      inputX: "[0.8, -0.2, 0.5, ...]",
      inputC: "Digit '3'",
      encodedC: "[0, 0, 0, 1, 0, 0, 0, 0, 0, 0]",
      result: "[0.8, -0.2, 0.5, ..., 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]",
      icon: <Binary className="w-6 h-6 text-emerald-500" />
    },
    continuous: {
      title: "Continuous Conditions (Attributes)",
      desc: "For physical properties like 'Rotation Angle' or 'Thickness', we normalize the value and concatenate it directly.",
      inputX: "[0.8, -0.2, 0.5, ...]",
      inputC: "Angle: 45°",
      encodedC: "[0.5] (Normalized -1 to 1)",
      result: "[0.8, -0.2, 0.5, ..., 0.5]",
      icon: <Settings2 className="w-6 h-6 text-blue-500" />
    },
    complex: {
      title: "Complex Conditions (Text/Images)",
      desc: "For complex data like text prompts, we pass it through an embedding network (like an RNN or Transformer) first to get a dense vector.",
      inputX: "[Image Pixels]",
      inputC: "\"A red bird flying\"",
      encodedC: "TextEncoder(c) ➔ [0.1, 0.9, -0.4, ...]",
      result: "[Image Pixels, 0.1, 0.9, -0.4, ...]",
      icon: <AlignLeft className="w-6 h-6 text-purple-500" />
    }
  };

  const curr = methods[method];

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Implementing Conditioning</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          How do we literally feed a word like "Cat" or a number like "3" into a neural network alongside an image?
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left Nav */}
        <div className="lg:w-1/3 flex flex-col gap-3">
          {Object.keys(methods).map(k => (
            <button 
              key={k} onClick={() => setMethod(k)}
              className={`p-4 rounded-xl text-left flex flex-col gap-2 transition-all border-2 ${method === k ? 'bg-slate-800 border-indigo-500 shadow-lg' : 'bg-slate-900 border-slate-700 hover:border-slate-500 opacity-60'}`}
            >
              <div className="flex items-center gap-2">
                {methods[k].icon}
                <span className="font-bold text-sm text-slate-200">{methods[k].title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Visualizer */}
        <div className="lg:w-2/3 bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-8 flex flex-col relative overflow-hidden">
           <h3 className="text-xl font-bold text-white mb-2">{curr.title}</h3>
           <p className="text-sm text-slate-400 mb-8">{curr.desc}</p>
           
           <div className="flex-grow flex flex-col items-center justify-center gap-6 w-full">
              
              <div className="flex items-center justify-center gap-4 w-full">
                {/* Data Block */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Primary Input (e.g. x or z)</span>
                  <div className="bg-slate-900 border border-slate-600 px-4 py-3 rounded-lg font-mono text-sm shadow-inner text-slate-300">
                    {curr.inputX}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 w-full">
                {/* Condition Block */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Raw Condition (c)</span>
                  <div className="bg-emerald-900/30 border border-emerald-500 px-4 py-2 rounded-lg font-mono font-bold text-sm shadow-sm text-emerald-400">
                    {curr.inputC}
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-slate-500" />

                {/* Encoded Condition Block */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest mb-2">Processed Condition</span>
                  <div className="bg-teal-900/30 border border-teal-500 px-4 py-2 rounded-lg font-mono text-sm shadow-sm text-teal-400">
                    {curr.encodedC}
                  </div>
                </div>
              </div>

              {/* Concatenation Visual */}
              <div className="flex flex-col items-center w-full mt-4">
                <Merge className="w-8 h-8 text-indigo-400 mb-2" />
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Concatenation (Early Fusion)</span>
                <motion.div 
                  key={method} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="w-full max-w-lg bg-indigo-900/30 border-2 border-indigo-500 p-4 rounded-xl text-center shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                >
                  <span className="font-mono text-sm font-bold text-indigo-200 break-all leading-relaxed">
                    {curr.result}
                  </span>
                </motion.div>
                <span className="text-xs text-slate-400 mt-4 italic">This combined vector is then passed into the Neural Network layers.</span>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 5: Interactive CVAE Playground ---
const CVAEPlaygroundSlide = () => {
  const [condition, setCondition] = useState('shoe');
  const [latentStyle, setLatentStyle] = useState(50); // 0 to 100

  // Maps condition + style to a mock image representation
  const getMockImage = () => {
    let baseHue = condition === 'shoe' ? 200 : condition === 'shirt' ? 350 : 40;
    // Style modulates hue and lightness
    let hue = (baseHue + latentStyle) % 360;
    let lightness = 30 + (latentStyle / 2);
    let borderRadius = condition === 'bag' ? '20%' : condition === 'shoe' ? '50% 10% 20% 10%' : '10% 10% 50% 50%';
    
    return {
      hue, lightness, borderRadius,
      emoji: condition === 'shoe' ? '👟' : condition === 'shirt' ? '👕' : '👜'
    }
  };

  const imgData = getMockImage();

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Interactive CVAE Playground</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Notice how the <strong>Condition (c)</strong> strictly controls the class, while the <strong>Latent Variable (z)</strong> controls independent style variations (color, shape) <em>across</em> all classes.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Controls */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col gap-8 justify-center">
           
           <div className="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-xl relative">
              <span className="absolute -top-3 left-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Select Condition (c)</span>
              <p className="text-xs text-emerald-800 mb-4">Determines the fundamental <strong>Class</strong>.</p>
              <div className="flex gap-2">
                {['shoe', 'shirt', 'bag'].map(c => (
                  <button 
                    key={c} onClick={() => setCondition(c)}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm capitalize transition-colors border-2 ${condition === c ? 'bg-emerald-500 border-emerald-600 text-white shadow-md' : 'bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-100'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
           </div>

           <div className="bg-purple-50 border-2 border-purple-300 p-6 rounded-xl relative">
              <span className="absolute -top-3 left-4 bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Tweak Latent Noise (z)</span>
              <p className="text-xs text-purple-800 mb-4">Determines the independent <strong>Style / Variation</strong>.</p>
              <input type="range" min="0" max="100" value={latentStyle} onChange={(e) => setLatentStyle(e.target.value)} className="w-full accent-purple-500" />
              <div className="flex justify-between text-[10px] font-bold text-purple-400 mt-2 font-mono">
                <span>z = [-2.1]</span>
                <span>z = [0.0]</span>
                <span>z = [+1.8]</span>
              </div>
           </div>

        </div>

        {/* Decoder Output */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-2xl border-4 border-slate-700 p-8 flex flex-col items-center justify-center relative overflow-hidden">
           <span className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Generated Output x̂</span>
           
           <div className="flex flex-col items-center gap-6">
              
              <div className="flex items-center gap-4 text-slate-400">
                 <div className="font-mono text-sm bg-emerald-900/50 text-emerald-400 border border-emerald-500 px-2 py-1 rounded">c="{condition}"</div>
                 <span className="font-bold">+</span>
                 <div className="font-mono text-sm bg-purple-900/50 text-purple-400 border border-purple-500 px-2 py-1 rounded">z={(latentStyle/100).toFixed(2)}</div>
                 <ArrowDown className="w-5 h-5 ml-2" />
              </div>

              {/* The "Generated" Image */}
              <div className="w-48 h-48 bg-slate-900 rounded-2xl border-2 border-slate-600 shadow-inner flex items-center justify-center p-4 relative overflow-hidden">
                 {/* Fake generated object */}
                 <motion.div 
                   animate={{ 
                     backgroundColor: `hsl(${imgData.hue}, 70%, ${imgData.lightness}%)`,
                     borderRadius: imgData.borderRadius,
                     rotate: (latentStyle - 50) * 0.5
                   }}
                   transition={{ type: "spring", stiffness: 100, damping: 15 }}
                   className="w-full h-full flex items-center justify-center shadow-lg border-4 border-white/20 relative"
                 >
                   <span className="text-6xl absolute z-10 filter drop-shadow-md">{imgData.emoji}</span>
                 </motion.div>
              </div>

           </div>
           
           <p className="text-xs text-slate-400 text-center mt-8 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
             Notice how the condition rigidly fixes the category, while sliding <code>z</code> morphs the color and subtle shape dynamics continuously. This is <strong>disentanglement</strong> achieved via conditioning!
           </p>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 6: Applications of CVAEs (NEW) ---
const CVAEApplicationsSlide = () => {
  const applications = [
    {
      title: "Image Generation with Attributes",
      desc: "Generating images of faces with specific hairstyles or expressions, or generating MNIST digits of a requested class.",
      icon: <ImageIcon className="w-8 h-8 text-blue-500" />,
      color: "border-blue-500 bg-blue-50"
    },
    {
      title: "Controllable Text Generation",
      desc: "Generating coherent sentences or paragraphs adhering to a specified topic, sentiment, or writing style.",
      icon: <MessageSquare className="w-8 h-8 text-emerald-500" />,
      color: "border-emerald-500 bg-emerald-50"
    },
    {
      title: "Voice Conversion",
      desc: "Modifying a speaker's voice to sound like a target speaker while perfectly preserving the spoken content.",
      icon: <Mic className="w-8 h-8 text-rose-500" />,
      color: "border-rose-500 bg-rose-50"
    },
    {
      title: "Drug Discovery",
      desc: "Guiding the generative process to construct molecular structures that possess desired chemical properties.",
      icon: <FlaskConical className="w-8 h-8 text-purple-500" />,
      color: "border-purple-500 bg-purple-50"
    },
    {
      title: "Interactive Art & Design",
      desc: "Allowing users to guide complex generative models by specifying high-level semantic attributes.",
      icon: <Palette className="w-8 h-8 text-amber-500" />,
      color: "border-amber-500 bg-amber-50"
    }
  ];

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Real-World Applications of CVAEs</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          CVAEs unlock a vast range of applications wherever <strong>controlled generation</strong> is desired.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full pb-8">
        {applications.map((app, i) => (
          <div key={i} className={`p-6 rounded-2xl shadow-md border-l-4 bg-white flex flex-col hover:-translate-y-1 transition-transform ${app.color}`}>
             <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center shadow-sm border border-slate-100 mb-4 shrink-0">
               {app.icon}
             </div>
             <h3 className="font-bold text-lg text-slate-800 mb-2">{app.title}</h3>
             <p className="text-sm text-slate-600 leading-relaxed">{app.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SLIDE 7: Advantages & Insights (EXPANDED) ---
const CVAEInsightsSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Advantages & Critical Considerations</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          CVAEs represent a significant step up from basic VAEs, enabling targeted interactions. However, they introduce new design challenges.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left Column: Key Advantages */}
        <div className="flex-1 flex flex-col gap-4">
           <h3 className="font-bold text-emerald-400 text-sm uppercase tracking-widest mb-2 px-2 border-b border-slate-700 pb-2 flex items-center gap-2">
             <ShieldCheck className="w-5 h-5"/> Key Advantages
           </h3>
           
           <div className="bg-slate-800 border-l-4 border-emerald-500 p-5 rounded-r-xl shadow-sm hover:bg-slate-700 transition-colors">
             <h4 className="font-bold text-emerald-300 mb-1 flex items-center gap-2"><Pointer className="w-4 h-4"/> Controlled Generation</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               The primary benefit. Direct the generative process to output specific attributes rather than relying on random draws.
             </p>
           </div>

           <div className="bg-slate-800 border-l-4 border-emerald-500 p-5 rounded-r-xl shadow-sm hover:bg-slate-700 transition-colors">
             <h4 className="font-bold text-emerald-300 mb-1 flex items-center gap-2"><Layers className="w-4 h-4"/> Learning Conditional Representations</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               By offloading semantic factors into <span className="font-mono text-emerald-200">c</span>, the latent space <span className="font-mono text-purple-300">z</span> learns how data varies <em>with respect</em> to conditions, leading to interpretable, disentangled spaces.
             </p>
           </div>

           <div className="bg-slate-800 border-l-4 border-emerald-500 p-5 rounded-r-xl shadow-sm hover:bg-slate-700 transition-colors">
             <h4 className="font-bold text-emerald-300 mb-1 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Improved Sample Quality</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               By providing more explicit structural information upfront, CVAEs can often produce higher-quality, more coherent samples compared to unconditional VAEs facing complex tasks.
             </p>
           </div>
        </div>

        {/* Right Column: Challenges & Key Points */}
        <div className="flex-1 flex flex-col gap-4">
           <h3 className="font-bold text-amber-400 text-sm uppercase tracking-widest mb-2 px-2 border-b border-slate-700 pb-2 flex items-center gap-2">
             <AlertTriangle className="w-5 h-5"/> Critical Challenges
           </h3>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800 border-t-4 border-amber-500 p-5 rounded-b-xl shadow-sm">
                <h4 className="font-bold text-amber-300 mb-1 text-sm">Quality of Condition (c)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Effectiveness heavily depends on the relevance of <span className="font-mono">c</span>. If <span className="font-mono">c</span> is noisy or irrelevant to <span className="font-mono">x</span>, it can actually hinder generation.
                </p>
              </div>

              <div className="bg-slate-800 border-t-4 border-rose-500 p-5 rounded-b-xl shadow-sm">
                <h4 className="font-bold text-rose-300 mb-1 text-sm">Data Requirements</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  CVAEs absolutely require <strong>paired data</strong> <span className="font-mono bg-slate-900 px-1 rounded">(x, c)</span>. If pairs are scarce for certain conditions, it won't generalize.
                </p>
              </div>

              <div className="bg-slate-800 border-t-4 border-orange-500 p-5 rounded-b-xl shadow-sm">
                <h4 className="font-bold text-orange-300 mb-1 text-sm">Conditional Mode Collapse</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The CVAE might perfectly generate a "Cat" using <span className="font-mono">c</span>, but completely ignore <span className="font-mono">z</span>, outputting the exact same blurry cat every time, destroying diversity.
                </p>
              </div>

              <div className="bg-slate-800 border-t-4 border-purple-500 p-5 rounded-b-xl shadow-sm">
                <h4 className="font-bold text-purple-300 mb-1 text-sm">Prior Specification</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  While assuming <span className="font-mono">p(z) = N(0, I)</span> is common, defining an expressive conditional prior <span className="font-mono bg-slate-900 px-1 rounded">p_θ(z|c)</span> might be necessary for complex dependencies.
                </p>
              </div>
           </div>
        </div>

      </div>

      {/* Conclusion Footer */}
      <div className="bg-indigo-900/40 border border-indigo-500/50 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 mt-auto shrink-0 max-w-7xl mx-auto w-full shadow-lg">
         <BookOpen className="w-12 h-12 text-indigo-400 shrink-0" />
         <div>
           <h3 className="font-bold text-lg text-slate-200 mb-1">The Foundation of Controllable AI</h3>
           <p className="text-sm text-indigo-200 leading-relaxed">
             CVAEs are the conceptual ancestor of modern generative systems. Whenever you provide a prompt to guide a latent model, you are leveraging the core principles of conditioning. It is a recurring theme in enhancing generative capabilities.
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
    IntroCVAESlide,
    ArchitectureSlide,
    MathFormulationSlide,
    ImplementationSlide,
    CVAEPlaygroundSlide,
    CVAEApplicationsSlide, // NEW SLIDE ADDED
    CVAEInsightsSlide      // MODIFIED SLIDE
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