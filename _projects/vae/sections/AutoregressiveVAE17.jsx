import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Image as ImageIcon, 
  Droplet, Layers, ArrowRight, Grid, BrainCircuit, 
  Zap, ListTree, Play, Pause, Brackets, Network,
  SplitSquareHorizontal, FastForward, CheckCircle, Database,
  Activity, RotateCcw, ArrowDown, Calculator,
  AlertTriangle, Clock, Bug, AlignLeft, Volume2, Scale, ThumbsUp, ThumbsDown, Crosshair
} from 'lucide-react';

// --- SLIDE 1: The Challenge (Blurry Outputs) ---
const BlurProblemSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">The Challenge: Expressive Likelihoods</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Standard VAEs often produce blurry, overly smooth samples for high-dimensional data (like images). Why? Because the standard Decoder assumes all pixels are <strong>independent</strong> from each other given the latent code <span className="font-mono bg-slate-200 px-1 rounded">z</span>.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Visualizer */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col items-center justify-center relative overflow-hidden">
           <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-8">The "Pixel Independence" Problem</h3>
           
           <div className="flex items-center gap-8 w-full justify-center">
              
              {/* True Data Modes */}
              <div className="flex flex-col items-center">
                 <span className="text-xs font-bold text-slate-500 mb-2 text-center">Plausible Real Details<br/>(Sharp Edges)</span>
                 <div className="flex gap-2">
                   <div className="w-16 h-16 bg-white border-2 border-slate-300 grid grid-cols-2 shadow-sm">
                     <div className="bg-slate-800"></div><div className="bg-white"></div>
                     <div className="bg-slate-800"></div><div className="bg-white"></div>
                   </div>
                   <span className="flex items-center text-xs font-bold text-slate-400 italic">OR</span>
                   <div className="w-16 h-16 bg-white border-2 border-slate-300 grid grid-cols-2 shadow-sm">
                     <div className="bg-white"></div><div className="bg-slate-800"></div>
                     <div className="bg-white"></div><div className="bg-slate-800"></div>
                   </div>
                 </div>
                 <span className="text-[10px] text-slate-400 mt-2 max-w-[150px] text-center">Data has multiple valid high-frequency modes.</span>
              </div>

              <ArrowRight className="w-8 h-8 text-rose-400" />

              {/* Independent Average */}
              <div className="flex flex-col items-center">
                 <span className="text-xs font-bold text-rose-500 mb-2 text-center">Standard VAE Output<br/>(Independent Pixels)</span>
                 <div className="w-24 h-24 bg-slate-400 border-4 border-rose-400 shadow-lg rounded flex items-center justify-center relative overflow-hidden">
                   <Droplet className="w-12 h-12 text-white/50" />
                 </div>
                 <span className="text-[10px] text-rose-500 mt-2 font-bold max-w-[150px] text-center">Averages everything.<br/>Result: Gray Blur.</span>
              </div>

           </div>
           
           <div className="mt-12 bg-slate-50 border border-slate-200 p-4 rounded-xl text-center max-w-lg">
             <div className="font-mono text-sm font-bold text-slate-700 mb-2">p_θ(x | z) = ∏ p_θ(x_i | z)</div>
             <p className="text-xs text-slate-600">If the decoder looks ONLY at <span className="font-mono">z</span> and ignores neighboring pixels, it doesn't know which sharp edge to draw. It plays it safe and averages them out.</p>
           </div>
        </div>

        {/* Explanation */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-sm border border-slate-700">
             <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2"><ImageIcon className="w-5 h-5"/> Complex Data Fails</h4>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               A simple factorized Gaussian decoder struggles to capture <strong>long-range dependencies</strong> and <strong>high-frequency details</strong> (like crisp textures or sharp lines).
             </p>
           </div>

           <div className="bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-200">
             <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2"><Zap className="w-5 h-5"/> The Solution</h4>
             <p className="text-sm text-slate-700 leading-relaxed">
               We need a much more expressive likelihood function <span className="font-mono font-bold text-emerald-700">p_θ(x|z)</span>. We do this by upgrading the Decoder itself into an <strong>Autoregressive Model</strong>.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 2: Autoregressive Recap ---
const ARRecapSlide = () => {
  const [pixelIndex, setPixelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPixelIndex(prev => {
          if (prev >= 15) { setIsPlaying(false); return 16; }
          return prev + 1;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const reset = () => { setPixelIndex(0); setIsPlaying(false); };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">Autoregressive Models: A Quick Recap</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Instead of generating the whole image at once, AR models generate data <strong>sequentially</strong>. Each new pixel depends on all the pixels generated before it.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: Equation & Examples */}
        <div className="flex-1 flex flex-col gap-6">
           <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-700 pb-2">The Chain Rule of Probability</h3>
             <div className="font-mono text-xl font-bold text-emerald-400 text-center my-6">
               p(x) = ∏ p(x_i | x_&lt;i)
             </div>
             <p className="text-sm text-slate-300 leading-relaxed text-center">
               The probability of the whole image is the product of the probability of each pixel (<span className="font-mono text-xs">x_i</span>), given all preceding pixels (<span className="font-mono text-xs">x_&lt;i</span>).
             </p>
           </div>

           <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 flex-grow">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-700 pb-2">Prominent Examples</h3>
             <ul className="space-y-4">
               <li className="flex items-start gap-3">
                 <Grid className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                 <div>
                   <strong className="text-blue-300 block">PixelCNN / PixelRNN</strong>
                   <span className="text-xs text-slate-400">Generates images pixel by pixel.</span>
                 </div>
               </li>
               <li className="flex items-start gap-3">
                 <Activity className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
                 <div>
                   <strong className="text-rose-300 block">WaveNet</strong>
                   <span className="text-xs text-slate-400">Generates raw audio waveforms sequentially.</span>
                 </div>
               </li>
               <li className="flex items-start gap-3">
                 <ListTree className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                 <div>
                   <strong className="text-purple-300 block">Transformer Decoders</strong>
                   <span className="text-xs text-slate-400">Uses attention to model text/sequence dependencies.</span>
                 </div>
               </li>
             </ul>
           </div>
        </div>

        {/* Right: Interactive Pixel Generation */}
        <div className="flex-[1.2] bg-slate-800 rounded-2xl shadow-2xl border-4 border-slate-700 p-8 flex flex-col relative overflow-hidden items-center justify-center">
           <h3 className="absolute top-6 left-1/2 transform -translate-x-1/2 text-sm font-bold text-white uppercase tracking-widest whitespace-nowrap">Sequential Generation Visualizer</h3>
           
           <div className="w-64 h-64 bg-black border-2 border-slate-600 rounded-lg p-1 grid grid-cols-4 grid-rows-4 gap-1 relative z-10 mt-8 shadow-inner">
             {Array.from({length: 16}).map((_, i) => {
               const isGenerated = i < pixelIndex;
               const isCurrent = i === pixelIndex;
               
               return (
                 <div 
                   key={i} 
                   className={`rounded-sm transition-all duration-300 relative flex items-center justify-center
                     ${isGenerated ? 'bg-slate-300' : 'bg-slate-900'}
                     ${isCurrent ? 'ring-2 ring-emerald-400 bg-emerald-900/50 z-20 scale-110' : ''}
                   `}
                 >
                   {isCurrent && <span className="text-emerald-400 text-[10px] font-mono font-bold">x_i</span>}
                   {isGenerated && !isCurrent && <span className="text-slate-500 text-[8px] font-mono">x_&lt;i</span>}
                 </div>
               );
             })}
           </div>

           <div className="mt-8 flex gap-4 w-full justify-center z-10">
             <button onClick={() => { setIsPlaying(true); if(pixelIndex >= 16) setPixelIndex(0); }} disabled={isPlaying} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 shadow-lg disabled:opacity-50 transition-colors">
               <Play className="w-4 h-4"/> Generate
             </button>
             <button onClick={reset} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 shadow transition-colors">
               <RotateCcw className="w-4 h-4"/> Reset
             </button>
           </div>
           
           <div className="mt-6 text-center text-xs text-slate-400 font-mono bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-700">
             Currently predicting: p( x_{pixelIndex >= 16 ? 'done' : pixelIndex} | x_&lt;{pixelIndex >= 16 ? 'done' : pixelIndex} )
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 3: Marrying VAEs with AR Decoders ---
const MarryingVaeArSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">Marrying VAEs with Autoregressive Decoders</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Instead of using a simple neural network, the VAE Decoder <span className="font-mono bg-slate-200 px-1 rounded">p_θ(x|z)</span> <em>is itself</em> an autoregressive model. The latent variable <span className="font-mono bg-slate-200 px-1 rounded text-blue-600 font-bold">z</span> acts as a global blueprint for the entire sequence.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Math Breakdown Box */}
        <div className="flex-1 bg-slate-900 rounded-2xl shadow-xl border-2 border-slate-800 p-8 flex flex-col items-center justify-center relative">
           <span className="absolute -top-3 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">New Reconstruction Term</span>
           
           <div className="font-mono text-xl md:text-2xl font-bold text-white text-center flex flex-wrap justify-center items-center gap-y-4 gap-x-2 bg-black/40 p-6 rounded-xl border border-slate-700">
             <span>log p_θ(x | <span className="text-blue-400">z</span>) = </span>
             <span className="text-3xl mx-2 text-slate-500">∑</span>
             <span>log p_θ(x_i | x_&lt;i, <span className="text-blue-400">z</span>)</span>
           </div>

           <div className="mt-12 flex flex-col gap-4 w-full">
             <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-emerald-500 flex items-start gap-3">
               <Brackets className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
               <p className="text-sm text-slate-300">
                 <strong className="text-emerald-300">x_&lt;i (Local Context):</strong> The previously generated pixels. Provides high-frequency details and ensures sharp, crisp textures.
               </p>
             </div>
             <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-blue-500 flex items-start gap-3">
               <BrainCircuit className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
               <p className="text-sm text-slate-300">
                 <strong className="text-blue-300">z (Global Context):</strong> The latent vector. Provides the global blueprint (e.g., "draw a smiling face"). Conditions the <em>entire</em> sequence.
               </p>
             </div>
           </div>
        </div>

        {/* Visual Metaphor */}
        <div className="flex-[0.8] bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col items-center justify-center text-center">
           <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-8">The Builder Metaphor</h3>
           
           <div className="flex flex-col items-center gap-4">
             <div className="w-24 h-24 bg-blue-50 border-4 border-blue-200 rounded-xl flex items-center justify-center shadow-inner relative">
               <span className="text-4xl filter drop-shadow">🗺️</span>
               <span className="absolute -bottom-3 right-0 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">Global z</span>
             </div>
             <span className="text-sm font-bold text-slate-600 max-w-[200px]">The Architect gives the blueprint (z) to the builder.</span>
           </div>

           <div className="h-8 w-1 border-l-2 border-dashed border-slate-300 my-2"></div>

           <div className="flex flex-col items-center gap-4">
             <div className="w-24 h-24 bg-emerald-50 border-4 border-emerald-200 rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden">
               <div className="grid grid-cols-2 grid-rows-2 w-12 h-12 gap-0.5">
                 <div className="bg-emerald-400"></div><div className="bg-emerald-400"></div>
                 <div className="bg-emerald-400"></div><div className="bg-slate-200 animate-pulse"></div>
               </div>
               <span className="absolute -bottom-3 right-0 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">Local x_&lt;i</span>
             </div>
             <span className="text-sm font-bold text-slate-600 max-w-[200px]">The Builder lays bricks one-by-one, perfectly aligned with previous bricks AND the blueprint.</span>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 4: Architecture Diagram Trace ---
const ArArchitectureDiagramSlide = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Input Data", text: "The raw image 'x' is fed into the system." },
    { title: "Encoder", text: "The Encoder compresses 'x' into the Approximate Posterior q_φ(z|x)." },
    { title: "Latent Vector", text: "We sample the latent blueprint 'z'. This 'z' conditions the ENTIRE sequence generation below." },
    { title: "Autoregressive Model", text: "The AR Decoder starts generating. To generate pixel x_i, it looks at the previously generated pixels (x_<i) AND the global blueprint (z)." },
    { title: "Step-by-Step Generation", text: "It loops continuously. Generate pixel 1 -> generate pixel 2 -> ... -> generate pixel D." },
    { title: "Output Sequence", text: "The final reconstructed data x̂ is assembled." }
  ];

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-4">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">The General Structure</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Let's trace how data flows through a VAE that incorporates an Autoregressive Decoder.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-4">
        
        {/* Interactive Flowchart */}
        <div className="flex-[1.2] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col relative items-center justify-center overflow-hidden">
           
           <div className="w-full max-w-[400px] flex flex-col items-center relative z-10">
              
              {/* x */}
              <div className={`px-6 py-3 rounded-xl border-2 font-bold text-sm z-10 transition-all duration-300 ${step >= 0 ? 'bg-sky-100 border-sky-400 text-sky-900 shadow-md' : 'bg-slate-100 border-slate-300 text-slate-400'}`}>Input Data x</div>
              <ArrowDown className={`w-6 h-6 my-2 transition-colors ${step >= 1 ? 'text-slate-800' : 'text-slate-300'}`} />
              
              {/* Encoder */}
              <div className={`px-6 py-3 rounded-2xl border-2 font-bold text-sm z-10 text-center transition-all duration-300 ${step >= 1 ? 'bg-indigo-100 border-indigo-400 text-indigo-900 shadow-md scale-105' : 'bg-slate-100 border-slate-300 text-slate-400'}`}>
                Encoder<br/><span className="font-mono text-xs">q_φ(z|x)</span>
              </div>
              <ArrowDown className={`w-6 h-6 my-2 transition-colors ${step >= 2 ? 'text-slate-800' : 'text-slate-300'}`} />

              {/* Z */}
              <div className={`px-8 py-3 rounded-full border-2 font-bold text-sm z-10 transition-all duration-300 ${step >= 2 ? 'bg-purple-200 border-purple-500 text-purple-900 shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-110' : 'bg-slate-100 border-slate-300 text-slate-400'}`}>
                Latent Vector z
              </div>
              
              {/* Line down to AR */}
              <div className="flex flex-col items-center my-1 relative w-full h-16 z-0">
                 <div className={`w-0.5 h-full transition-colors ${step >= 3 ? 'bg-slate-800' : 'bg-slate-300'}`}></div>
                 {step >= 2 && <span className="absolute top-1/2 left-[55%] transform -translate-y-1/2 text-[10px] font-bold text-slate-600 bg-white px-1 leading-tight">conditions<br/>entire sequence</span>}
                 {step >= 3 && <div className="absolute bottom-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-800"></div>}
              </div>

              {/* AR DECODER BOX */}
              <div className={`w-[110%] border-2 rounded-xl p-6 flex flex-col items-center relative transition-colors duration-500 z-10 ${step >= 3 ? 'bg-slate-50 border-slate-800 shadow-xl' : 'bg-transparent border-slate-300 border-dashed'}`}>
                 <span className={`absolute top-2 text-[10px] font-bold tracking-widest uppercase ${step >= 3 ? 'text-slate-800' : 'text-slate-400'}`}>Autoregressive Decoder p_θ(x|z)</span>
                 
                 <div className={`w-full mt-6 py-6 px-4 text-center text-sm font-bold shadow-inner transition-all duration-500 z-20 ${step >= 3 ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-900' : 'bg-slate-100 border-2 border-slate-300 text-slate-400'}`} style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}>
                   Autoregressive Model<br/>
                   <span className="text-[10px] font-normal">(e.g. PixelCNN, Transformer)</span><br/>
                   <span className="text-xs font-mono">Generates x_i conditioned on x_&lt;i and z</span>
                 </div>

                 {/* Step by step loop visual */}
                 <div className="flex flex-col items-center my-4 h-12 w-full relative z-0">
                   <div className={`w-0.5 h-full transition-colors ${step >= 4 ? 'bg-slate-800' : 'bg-slate-300'}`}></div>
                   {step >= 4 && <span className="absolute top-1/2 left-[55%] transform -translate-y-1/2 text-[10px] font-bold text-slate-600 bg-slate-50 px-1 leading-tight">step-by-step<br/>generation</span>}
                   {step >= 4 && <div className="absolute bottom-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-800"></div>}
                 </div>

                 <div className={`px-6 py-3 rounded-xl border-2 font-bold text-sm z-10 text-center transition-all duration-300 ${step >= 5 ? 'bg-emerald-200 border-emerald-500 text-emerald-900 shadow-md scale-105' : 'bg-slate-100 border-slate-300 text-slate-400'}`}>
                   Output Sequence<br/>
                   <span className="font-mono text-xs font-normal">x̂ = (x̂_1, x̂_2, ..., x̂_D)</span>
                 </div>
              </div>

              <ArrowDown className={`w-6 h-6 my-2 transition-colors ${step >= 5 ? 'text-slate-800' : 'text-slate-300'}`} />
              
              {/* Recon Data */}
              <div className={`px-6 py-3 rounded-xl border-2 font-bold text-sm z-10 transition-all duration-300 ${step >= 5 ? 'bg-sky-100 border-sky-400 text-sky-900 shadow-md' : 'bg-slate-100 border-slate-300 text-slate-400'}`}>Reconstructed Data x̂</div>

           </div>
        </div>

        {/* Right Info Panel */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           <div className="bg-slate-800 text-white rounded-2xl shadow-xl p-8 border border-slate-700 min-h-[250px] flex flex-col">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest border-b border-slate-700 pb-2 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4"/> Step {step + 1} of 6
              </h3>
              
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                  <h4 className="text-2xl font-bold mb-4">{steps[step].title}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{steps[step].text}</p>
                </motion.div>
              </AnimatePresence>
           </div>

           <div className="flex justify-between items-center w-full bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-700 mt-auto">
             <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2 bg-slate-700 text-white font-bold rounded-lg disabled:opacity-30 hover:bg-slate-600 flex items-center gap-1 text-sm transition-colors"><ChevronLeft className="w-4 h-4"/> Prev</button>
             <div className="flex gap-1.5">{Array.from({length: 6}).map((_, i) => (<div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-blue-500' : 'bg-slate-600'}`}></div>))}</div>
             <button onClick={() => setStep(Math.min(5, step + 1))} disabled={step === 5} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg disabled:opacity-30 hover:bg-blue-500 flex items-center gap-1 text-sm shadow transition-colors">Next <ChevronRight className="w-4 h-4"/></button>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 5: Architectural Integration ---
const ArchitecturalIntegrationSlide = () => {
  const [activeTab, setActiveTab] = useState('global');

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">Architectural Integration</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          How do we physically inject the latent vector <span className="font-mono bg-slate-200 px-1 rounded text-blue-600 font-bold">z</span> into the layers of the Autoregressive Decoder? There are three main approaches.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left Nav */}
        <div className="lg:w-1/3 flex flex-col gap-3">
          <button onClick={() => setActiveTab('global')} className={`p-4 rounded-xl border-l-4 text-left transition-all ${activeTab === 'global' ? 'bg-white shadow-md border-blue-500 font-bold text-blue-900' : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'}`}>
            <span className="flex items-center gap-2"><Grid className="w-4 h-4"/> 1. Global Conditioning</span>
          </button>
          
          <button onClick={() => setActiveTab('initial')} className={`p-4 rounded-xl border-l-4 text-left transition-all ${activeTab === 'initial' ? 'bg-white shadow-md border-emerald-500 font-bold text-emerald-900' : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'}`}>
            <span className="flex items-center gap-2"><Network className="w-4 h-4"/> 2. Initial State (RNN)</span>
          </button>

          <button onClick={() => setActiveTab('concat')} className={`p-4 rounded-xl border-l-4 text-left transition-all ${activeTab === 'concat' ? 'bg-white shadow-md border-purple-500 font-bold text-purple-900' : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'}`}>
            <span className="flex items-center gap-2"><SplitSquareHorizontal className="w-4 h-4"/> 3. Concatenation</span>
          </button>
        </div>

        {/* Right Visualizer */}
        <div className="lg:w-2/3 bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col relative overflow-hidden">
           <AnimatePresence mode="wait">
             
             {activeTab === 'global' && (
               <motion.div key="global" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                 <h3 className="text-xl font-bold text-blue-800 mb-2 border-b pb-2">Global Conditioning (PixelCNN)</h3>
                 <p className="text-sm text-slate-600 mb-8">Used for CNN-based models. The vector <span className="font-mono text-xs">z</span> is transformed (via a dense layer) and then <strong>spatially tiled</strong> across the width and height of the image, or added as a bias to every convolutional layer.</p>
                 
                 <div className="flex-grow flex items-center justify-center gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-24 bg-blue-100 border-2 border-blue-400 rounded-lg flex items-center justify-center font-mono font-bold text-blue-800 shadow-md z-10">z</div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-slate-400" />
                    <div className="flex flex-col items-center relative">
                      <span className="text-[10px] font-bold text-slate-400 uppercase absolute -top-6">Broadcast / Tile</span>
                      <div className="w-24 h-24 bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg grid grid-cols-3 grid-rows-3 gap-1 p-1">
                        {Array.from({length: 9}).map((_, i) => <div key={i} className="bg-blue-400/50 rounded-sm flex items-center justify-center text-[8px] font-mono font-bold text-blue-900">z</div>)}
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-slate-300">+</span>
                    <div className="flex flex-col items-center relative">
                      <span className="text-[10px] font-bold text-slate-400 uppercase absolute -top-6">Conv Layer Feats</span>
                      <div className="w-24 h-24 bg-slate-100 border-2 border-slate-300 rounded-lg grid grid-cols-3 grid-rows-3 gap-1 p-1">
                        {Array.from({length: 9}).map((_, i) => <div key={i} className="bg-slate-300 rounded-sm"></div>)}
                      </div>
                    </div>
                 </div>
               </motion.div>
             )}

             {activeTab === 'initial' && (
               <motion.div key="initial" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                 <h3 className="text-xl font-bold text-emerald-800 mb-2 border-b pb-2">Initial State (RNNs)</h3>
                 <p className="text-sm text-slate-600 mb-8">Used for RNN-based autoregressive models. The sequence generation has a "hidden state" memory. We use <span className="font-mono text-xs">z</span> to <strong>initialize the hidden state</strong> at time step t=0.</p>
                 
                 <div className="flex-grow flex items-center justify-center gap-4 pt-8">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-emerald-600 mb-2 uppercase">Init State (h_0)</span>
                      <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-500 rounded-full flex items-center justify-center font-mono font-bold text-emerald-800 shadow-md">z</div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-slate-400" />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-slate-500 mb-2 font-mono">x_1</span>
                      <div className="w-16 h-16 bg-slate-100 border-2 border-slate-400 rounded-lg flex items-center justify-center font-bold text-slate-700 shadow-md">RNN<br/>Cell 1</div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-slate-400" />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-slate-500 mb-2 font-mono">x_2</span>
                      <div className="w-16 h-16 bg-slate-100 border-2 border-slate-400 rounded-lg flex items-center justify-center font-bold text-slate-700 shadow-md">RNN<br/>Cell 2</div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-slate-400" />
                    <span className="font-bold text-slate-400">...</span>
                 </div>
               </motion.div>
             )}

             {activeTab === 'concat' && (
               <motion.div key="concat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                 <h3 className="text-xl font-bold text-purple-800 mb-2 border-b pb-2">Concatenation</h3>
                 <p className="text-sm text-slate-600 mb-8">Works across various models (like Transformers). The latent vector <span className="font-mono text-xs">z</span> is literally <strong>glued (concatenated)</strong> to the input data <span className="font-mono text-xs">x_i</span> at every single generation step.</p>
                 
                 <div className="flex-grow flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-500 mb-2 uppercase">Input Token x_i</span>
                        <div className="w-24 h-8 bg-slate-200 border border-slate-400 rounded flex items-center justify-center text-xs font-mono font-bold">Word Embed</div>
                      </div>
                      <span className="text-2xl font-bold text-slate-300 translate-y-3">+</span>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-purple-500 mb-2 uppercase">Latent Vector</span>
                        <div className="w-16 h-8 bg-purple-200 border border-purple-500 rounded flex items-center justify-center text-xs font-mono font-bold text-purple-900">z</div>
                      </div>
                    </div>
                    
                    <ArrowDown className="w-6 h-6 text-slate-400" />
                    
                    <div className="w-48 h-12 bg-slate-800 text-white rounded-lg flex items-center justify-center border-2 border-slate-600 shadow-md font-mono text-xs">
                      [ Word Embed , z ]
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Feed into next layer</span>
                 </div>
               </motion.div>
             )}

           </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 6: Teacher Forcing (Training Optimization) ---
const TeacherForcingSlide = () => {
  const [mode, setMode] = useState('training'); // 'inference' or 'training'

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Training vs. Inference: Teacher Forcing</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          If generation happens step-by-step, wouldn't training be impossibly slow? No! During training, we use a trick called <strong>Teacher Forcing</strong>.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-slate-800 p-1 rounded-xl flex shadow-inner border border-slate-700">
          <button onClick={() => setMode('inference')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${mode === 'inference' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}><Play className="w-4 h-4"/> Generation (Slow)</button>
          <button onClick={() => setMode('training')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${mode === 'training' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}><FastForward className="w-4 h-4"/> Training (Fast Parallel)</button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Visualizer */}
        <div className="flex-[1.5] bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-8 flex items-center justify-center relative overflow-hidden">
           
           <AnimatePresence mode="wait">
             {mode === 'inference' ? (
               <motion.div key="inf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full gap-6">
                  <div className="bg-slate-900 border border-indigo-500/50 p-4 rounded-xl flex gap-4 items-center">
                    <div className="flex flex-col items-center"><span className="text-[10px] font-mono text-slate-400 mb-1">Step 1</span><div className="w-12 h-12 bg-slate-700 rounded border border-slate-500 flex items-center justify-center font-bold">x̂_1</div></div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <div className="flex flex-col items-center"><span className="text-[10px] font-mono text-slate-400 mb-1">Step 2</span><div className="w-12 h-12 bg-slate-700 rounded border border-slate-500 flex items-center justify-center font-bold">x̂_2</div></div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <div className="flex flex-col items-center"><span className="text-[10px] font-mono text-slate-400 mb-1">Step 3</span><div className="w-12 h-12 bg-slate-700 rounded border border-slate-500 flex items-center justify-center font-bold opacity-50">?</div></div>
                  </div>
                  <div className="flex items-center gap-2 bg-indigo-900/30 text-indigo-300 px-4 py-2 rounded-full border border-indigo-500/50 text-xs">
                    <Pause className="w-4 h-4" /> Must wait for x̂_2 to finish before generating x̂_3.
                  </div>
               </motion.div>
             ) : (
               <motion.div key="train" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full gap-6">
                  <div className="flex flex-col items-center w-full gap-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-900/50 px-2 py-1 rounded">Ground Truth Image (Teacher)</span>
                    <div className="flex gap-2 bg-slate-900 p-2 rounded-lg border border-slate-700">
                      <div className="w-12 h-12 bg-slate-200 text-slate-800 rounded border border-slate-400 flex items-center justify-center font-bold">x_1</div>
                      <div className="w-12 h-12 bg-slate-200 text-slate-800 rounded border border-slate-400 flex items-center justify-center font-bold">x_2</div>
                      <div className="w-12 h-12 bg-slate-200 text-slate-800 rounded border border-slate-400 flex items-center justify-center font-bold">x_3</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-16 relative w-full justify-center">
                     <ArrowDown className="w-5 h-5 text-emerald-500" />
                     <ArrowDown className="w-5 h-5 text-emerald-500" />
                     <ArrowDown className="w-5 h-5 text-emerald-500" />
                     {/* Cross connections simulating CNN masking */}
                     <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                       <path d="M 190 0 L 250 20" stroke="#34d399" strokeWidth="2" strokeDasharray="2 2" fill="none" opacity="0.5"/>
                       <path d="M 250 0 L 310 20" stroke="#34d399" strokeWidth="2" strokeDasharray="2 2" fill="none" opacity="0.5"/>
                     </svg>
                  </div>

                  <div className="flex flex-col items-center w-full gap-2">
                    <div className="flex gap-2 bg-slate-900 p-2 rounded-lg border border-emerald-500/50 relative z-10">
                      <div className="w-12 h-12 bg-emerald-900/80 text-emerald-300 rounded border-2 border-emerald-500 flex items-center justify-center font-bold">x̂_1</div>
                      <div className="w-12 h-12 bg-emerald-900/80 text-emerald-300 rounded border-2 border-emerald-500 flex items-center justify-center font-bold">x̂_2</div>
                      <div className="w-12 h-12 bg-emerald-900/80 text-emerald-300 rounded border-2 border-emerald-500 flex items-center justify-center font-bold">x̂_3</div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Compute loss for all pixels simultaneously</span>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>

        </div>

        {/* Text Explanations */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           <AnimatePresence mode="wait">
             {mode === 'inference' ? (
               <motion.div key="inf-text" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-2xl shadow-sm h-full flex flex-col justify-center">
                 <h4 className="font-bold text-indigo-400 text-lg mb-2 flex items-center gap-2"><Play className="w-5 h-5"/> Sequential Generation</h4>
                 <p className="text-sm text-slate-300 leading-relaxed">
                   When creating a new image, the model <em>must</em> generate it pixel by pixel. It cannot predict Pixel 3 until it knows exactly what it drew for Pixels 1 and 2. This makes generation slow.
                 </p>
               </motion.div>
             ) : (
               <motion.div key="train-text" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-2xl shadow-sm h-full flex flex-col justify-center">
                 <h4 className="font-bold text-emerald-400 text-lg mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5"/> Teacher Forcing</h4>
                 <p className="text-sm text-slate-300 leading-relaxed mb-4">
                   During training, we already have the perfect, complete Ground Truth image. We don't need to wait for the model's own predictions!
                 </p>
                 <p className="text-sm text-slate-300 leading-relaxed">
                   We feed the <em>true</em> preceding pixels into the network to predict the next pixel. Because we have all true pixels available at once, we can calculate the loss for the entire image in a single, lightning-fast parallel matrix operation.
                 </p>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
};


// --- SLIDE 7: Advantages: Why Bother? ---
const AdvantagesSlide = () => {
  const [showAR, setShowAR] = useState(false);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">Advantages: Why Bother?</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Integrating autoregressive decoders brings massive benefits, primarily revolving around sample fidelity and mathematical tractability.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: Interactive Visual Comparison */}
        <div className="flex-[1.2] bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col items-center justify-center relative overflow-hidden">
           <h3 className="font-bold text-slate-700 uppercase tracking-widest text-xs mb-8">Sample Quality Comparison</h3>
           
           <div className="flex items-center gap-6 w-full justify-center relative h-64">
              
              {/* Standard Output */}
              <div className="flex flex-col items-center z-10 transition-all duration-500" style={{ opacity: showAR ? 0.3 : 1, transform: showAR ? 'scale(0.9)' : 'scale(1)' }}>
                <span className="text-xs font-bold text-slate-500 mb-2">Standard VAE</span>
                <div className="w-40 h-40 bg-slate-200 border-4 border-slate-300 rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-2 relative">
                  <img src="https://picsum.photos/id/1025/200/200" className="w-full h-full object-cover rounded blur-[4px] opacity-80" alt="blurry dog" />
                  <div className="absolute inset-0 bg-white/20"></div>
                </div>
              </div>

              {/* Toggle Button */}
              <button 
                onClick={() => setShowAR(!showAR)}
                className="z-20 bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                <ArrowRight className={`w-6 h-6 transform transition-transform duration-500 ${showAR ? 'rotate-180' : ''}`} />
              </button>

              {/* AR Output */}
              <div className="flex flex-col items-center z-10 transition-all duration-500" style={{ opacity: showAR ? 1 : 0.3, transform: showAR ? 'scale(1)' : 'scale(0.9)' }}>
                <span className="text-xs font-bold text-indigo-600 mb-2">VAE + AR Decoder</span>
                <div className="w-40 h-40 bg-white border-4 border-indigo-500 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center p-1">
                  <img src="https://picsum.photos/id/1025/200/200" className="w-full h-full object-cover rounded contrast-125" alt="sharp dog" />
                </div>
              </div>

           </div>

           <div className="mt-8 bg-slate-50 border border-slate-200 p-4 rounded-xl text-center max-w-md">
             <p className="text-sm text-slate-700">
               {showAR 
                 ? <span><strong>Sharp & Coherent:</strong> The AR decoder models complex, high-frequency details and long-range dependencies perfectly.</span>
                 : <span><strong>Blurry & Smooth:</strong> A factorized Gaussian decoder assumes pixels are independent, averaging out details.</span>
               }
             </p>
           </div>
        </div>

        {/* Right: Key Benefits List */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           
           <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-2xl shadow-sm">
             <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><ImageIcon className="w-5 h-5"/> Significantly Improved Quality</h4>
             <p className="text-sm text-slate-700 leading-relaxed">
               This is the primary motivation. AR models generate samples that are much sharper and qualitatively superior to VAEs with simpler decoders.
             </p>
           </div>

           <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-2xl shadow-sm">
             <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2"><Calculator className="w-5 h-5"/> Expressive & Tractable Likelihoods</h4>
             <p className="text-sm text-slate-700 leading-relaxed">
               The AR formulation provides a mathematically well-defined, tractable way to compute <span className="font-mono bg-white px-1 rounded text-emerald-700">p_θ(x|z)</span>, leading to higher overall ELBO values.
             </p>
           </div>

           <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-2xl shadow-sm">
             <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2"><Layers className="w-5 h-5"/> Flexibility for Diverse Data</h4>
             <p className="text-sm text-slate-700 leading-relaxed">
               AR models are incredibly versatile. They have been successfully applied to images (PixelCNN), raw audio (WaveNet), and text (Transformers).
             </p>
           </div>

        </div>

      </div>
    </div>
  );
};

// --- SLIDE 8: The Catch: Challenges and Trade-offs ---
const ChallengesSlide = () => {
  const [activeTab, setActiveTab] = useState('speed');
  const [errorTick, setErrorTick] = useState(0);

  useEffect(() => {
    let interval;
    if (activeTab === 'error' || activeTab === 'bias') {
      interval = setInterval(() => setErrorTick(prev => (prev + 1) % 25), 200);
    }
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">The Catch: Challenges & Trade-offs</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          While powerful, the autoregressive approach introduces significant computational bottlenecks and biases.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: Navigation Tabs */}
        <div className="lg:w-1/3 flex flex-col gap-3">
          <button onClick={() => setActiveTab('speed')} className={`p-4 rounded-xl border-l-4 text-left transition-all flex items-center gap-3 ${activeTab === 'speed' ? 'bg-slate-800 shadow-md border-rose-500' : 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-400'}`}>
            <Clock className={`w-5 h-5 ${activeTab === 'speed' ? 'text-rose-400' : ''}`} />
            <div>
              <span className="block font-bold text-sm text-white">Slow Sequential Sampling</span>
              <span className="text-[10px] text-slate-400">O(N) generation time</span>
            </div>
          </button>
          
          <button onClick={() => setActiveTab('cost')} className={`p-4 rounded-xl border-l-4 text-left transition-all flex items-center gap-3 ${activeTab === 'cost' ? 'bg-slate-800 shadow-md border-amber-500' : 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-400'}`}>
            <Activity className={`w-5 h-5 ${activeTab === 'cost' ? 'text-amber-400' : ''}`} />
            <div>
              <span className="block font-bold text-sm text-white">Increased Training Cost</span>
              <span className="text-[10px] text-slate-400">Heavy convolutions/attention</span>
            </div>
          </button>

          <button onClick={() => setActiveTab('error')} className={`p-4 rounded-xl border-l-4 text-left transition-all flex items-center gap-3 ${activeTab === 'error' ? 'bg-slate-800 shadow-md border-purple-500' : 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-400'}`}>
            <Bug className={`w-5 h-5 ${activeTab === 'error' ? 'text-purple-400' : ''}`} />
            <div>
              <span className="block font-bold text-sm text-white">Error Propagation</span>
              <span className="text-[10px] text-slate-400">Mistakes cascade in free sampling</span>
            </div>
          </button>

          <button onClick={() => setActiveTab('bias')} className={`p-4 rounded-xl border-l-4 text-left transition-all flex items-center gap-3 ${activeTab === 'bias' ? 'bg-slate-800 shadow-md border-blue-500' : 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-400'}`}>
            <Grid className={`w-5 h-5 ${activeTab === 'bias' ? 'text-blue-400' : ''}`} />
            <div>
              <span className="block font-bold text-sm text-white">Directional Bias</span>
              <span className="text-[10px] text-slate-400">Forced arbitrary ordering</span>
            </div>
          </button>
        </div>

        {/* Right: Dynamic Content Area */}
        <div className="lg:w-2/3 bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-8 flex flex-col relative overflow-hidden">
           <AnimatePresence mode="wait">
             
             {activeTab === 'speed' && (
               <motion.div key="speed" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                 <h3 className="text-xl font-bold text-rose-400 mb-2">The O(N) Bottleneck</h3>
                 <p className="text-sm text-slate-300 mb-8">
                   To generate a 1-megapixel image (1000x1000 pixels), an AR decoder must run a full neural network forward pass <strong>1,000,000 separate times</strong>, waiting for each pixel to finish before starting the next.
                 </p>
                 <div className="flex-grow flex flex-col justify-center gap-8">
                   <div>
                     <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 block">Standard VAE (O(1) Parallel)</span>
                     <div className="h-6 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                       <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }} className="h-full bg-emerald-500" />
                     </div>
                   </div>
                   <div>
                     <span className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2 block">AR VAE (O(N) Sequential)</span>
                     <div className="h-6 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                       <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 5, ease: "linear", repeat: Infinity }} className="h-full bg-rose-500" />
                     </div>
                   </div>
                 </div>
               </motion.div>
             )}

             {activeTab === 'cost' && (
               <motion.div key="cost" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                 <h3 className="text-xl font-bold text-amber-400 mb-2">Computational Overhead</h3>
                 <p className="text-sm text-slate-300 mb-8">
                   Although "Teacher Forcing" allows parallel training, the operations inside AR models are extremely heavy.
                 </p>
                 <div className="flex-grow flex items-center justify-center gap-6">
                    <div className="bg-slate-900 p-6 rounded-xl border border-amber-500/50 flex flex-col items-center shadow-lg">
                      <Layers className="w-12 h-12 text-amber-500 mb-4" />
                      <span className="font-bold text-amber-300 text-sm">Masked Convolutions</span>
                      <span className="text-xs text-slate-400 mt-2 text-center max-w-[150px]">Require special padding and filter structures to prevent looking ahead.</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-500">+</span>
                    <div className="bg-slate-900 p-6 rounded-xl border border-amber-500/50 flex flex-col items-center shadow-lg">
                      <Network className="w-12 h-12 text-amber-500 mb-4" />
                      <span className="font-bold text-amber-300 text-sm">Attention Mechanisms</span>
                      <span className="text-xs text-slate-400 mt-2 text-center max-w-[150px]">O(N²) complexity limits sequence length and resolution.</span>
                    </div>
                 </div>
               </motion.div>
             )}

             {activeTab === 'error' && (
               <motion.div key="error" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                 <h3 className="text-xl font-bold text-purple-400 mb-2">Cascading Failures</h3>
                 <p className="text-sm text-slate-300 mb-8">
                   During "free sampling" (generation without ground truth), if the model makes a poor prediction early on, all subsequent predictions are conditioned on that mistake.
                 </p>
                 <div className="flex-grow flex items-center justify-center">
                    <div className="grid grid-cols-5 gap-1 w-48 h-48">
                      {Array.from({length: 25}).map((_, i) => {
                        const isGenerated = i < errorTick;
                        const isMistake = i === 7; // Arbitrary mistake point
                        const isCorrupted = i >= 7 && isGenerated;

                        return (
                          <div 
                            key={i} 
                            className={`rounded-sm transition-colors duration-200 ${
                              isMistake && isGenerated ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' 
                              : isCorrupted ? 'bg-rose-900/50 border border-rose-500/50' 
                              : isGenerated ? 'bg-indigo-400' 
                              : 'bg-slate-900 border border-slate-700'
                            }`}
                          />
                        )
                      })}
                    </div>
                 </div>
               </motion.div>
             )}

             {activeTab === 'bias' && (
               <motion.div key="bias" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                 <h3 className="text-xl font-bold text-blue-400 mb-2">Arbitrary Ordering</h3>
                 <p className="text-sm text-slate-300 mb-8">
                   Audio and Text naturally flow forward in time. But images are 2D. Forcing a "Raster Scan" (top-to-bottom, left-to-right) introduces an unnatural inductive bias.
                 </p>
                 <div className="flex-grow flex flex-col items-center justify-center gap-6">
                    <div className="grid grid-cols-5 gap-1 w-48 h-48 relative">
                      {Array.from({length: 25}).map((_, i) => (
                        <div key={i} className={`rounded-sm transition-colors duration-100 ${i === errorTick ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]' : i < errorTick ? 'bg-slate-600' : 'bg-slate-900 border border-slate-700'}`} />
                      ))}
                      <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 flex flex-col gap-1 items-center">
                        <ArrowDown className="text-slate-500 w-4 h-4"/>
                        <span className="text-[10px] text-slate-500 font-mono rotate-180" style={{ writingMode: 'vertical-rl' }}>Raster Scan</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 italic text-center max-w-sm">"Why should the bottom-right pixel only depend on what happened before it, and not the bottom edge?"</p>
                 </div>
               </motion.div>
             )}

           </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 9: Notable Implementations: PixelVAE ---
const PixelVaeSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">Notable Implementations & Applications</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          The concept of marrying VAEs with AR Decoders spawned several pioneering architectures tailored to specific data types.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* PixelVAE Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border-t-8 border-blue-500 p-6 flex flex-col hover:-translate-y-1 transition-transform">
           <div className="flex justify-between items-start mb-4">
             <h3 className="font-bold text-xl text-slate-800">PixelVAE</h3>
             <ImageIcon className="w-8 h-8 text-blue-500" />
           </div>
           <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 block">Images</span>
           <p className="text-sm text-slate-600 mb-6 flex-grow">
             Pioneered by Gulrajani et al. (2016). It uses a PixelCNN or PixelRNN as the decoder. It drastically improved the sharpness of VAE images. The latent <span className="font-mono text-xs bg-slate-100 px-1 rounded">z</span> provides the global structure, while PixelCNN handles crisp textures.
           </p>
           <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
             <span className="text-[10px] font-bold text-slate-500 block mb-1">Architecture Variations:</span>
             <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
               <li>Global <span className="font-mono">z</span> conditioning PixelCNN.</li>
               <li>Hierarchical <span className="font-mono">z</span> mapping to different image resolutions.</li>
             </ul>
           </div>
        </div>

        {/* WaveNet Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border-t-8 border-emerald-500 p-6 flex flex-col hover:-translate-y-1 transition-transform">
           <div className="flex justify-between items-start mb-4">
             <h3 className="font-bold text-xl text-slate-800">WaveNet Decoders</h3>
             <Volume2 className="w-8 h-8 text-emerald-500" />
           </div>
           <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4 block">Raw Audio</span>
           <p className="text-sm text-slate-600 mb-6 flex-grow">
             Applying WaveNet (a powerful 1D dilated convolutional AR model) as the decoder. It generates incredibly high-fidelity audio samples within a VAE framework, where <span className="font-mono text-xs bg-slate-100 px-1 rounded">z</span> controls the speaker identity or prosody.
           </p>
           <div className="w-full h-16 bg-slate-900 rounded-lg flex items-center justify-center gap-1 px-4 overflow-hidden">
             {Array.from({length: 20}).map((_, i) => (
               <div key={i} className="w-2 bg-emerald-500 rounded-full" style={{ height: `${Math.random() * 80 + 20}%`}}></div>
             ))}
           </div>
        </div>

        {/* Transformer Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border-t-8 border-purple-500 p-6 flex flex-col hover:-translate-y-1 transition-transform">
           <div className="flex justify-between items-start mb-4">
             <h3 className="font-bold text-xl text-slate-800">Transformers</h3>
             <AlignLeft className="w-8 h-8 text-purple-500" />
           </div>
           <span className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-4 block">Text & Sequences</span>
           <p className="text-sm text-slate-600 mb-6 flex-grow">
             Using attention mechanisms as the AR decoder. The latent variable <span className="font-mono text-xs bg-slate-100 px-1 rounded">z</span> encodes high-level semantic attributes (like sentiment or topic), while the Transformer generates the text token-by-token.
           </p>
           <div className="bg-purple-50 text-purple-800 p-3 rounded-lg border border-purple-200 text-xs font-mono">
             "The [z=positive] movie was..." <br/>➔ "absolutely fantastic."
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 10: When to Choose an AR Decoder ---
const DecisionSlide = () => {
  const [priority, setPriority] = useState(50); // 0 = Speed, 100 = Quality

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">When to Choose an Autoregressive Decoder</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          It all comes down to the fundamental trade-off of Generative AI: Speed vs. Quality.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center max-w-4xl mx-auto w-full flex-grow pb-8">
         
         <div className="w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
            
            {/* The Balance Scale */}
            <div className="flex justify-between items-center mb-8 relative z-10 px-4">
               <div className="flex flex-col items-center w-32">
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-colors ${priority < 40 ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-slate-700 text-slate-400'}`}>
                   <FastForward className="w-8 h-8" />
                 </div>
                 <span className="font-bold text-sm text-center">Inference Speed</span>
               </div>
               
               <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
                 <Scale className="w-12 h-12 text-slate-500 mb-4" />
                 <input 
                   type="range" min="0" max="100" value={priority} 
                   onChange={(e) => setPriority(parseInt(e.target.value))} 
                   className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer relative z-20" 
                 />
                 <div className="flex justify-between w-full mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                   <span>Real-Time Apps</span>
                   <span>Offline Generation</span>
                 </div>
               </div>

               <div className="flex flex-col items-center w-32">
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-colors ${priority > 60 ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)]' : 'bg-slate-700 text-slate-400'}`}>
                   <CheckCircle className="w-8 h-8" />
                 </div>
                 <span className="font-bold text-sm text-center">Sample Fidelity</span>
               </div>
            </div>

            {/* Recommendation Box */}
            <div className="bg-slate-900 border-2 border-slate-600 p-6 rounded-2xl relative z-10 mt-8 min-h-[160px] flex flex-col justify-center">
               <AnimatePresence mode="wait">
                 {priority < 40 && (
                   <motion.div key="speed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                     <div className="flex items-center gap-3 mb-2">
                       <ThumbsDown className="w-6 h-6 text-rose-500" />
                       <h3 className="font-bold text-xl text-white">Avoid AR Decoders</h3>
                     </div>
                     <p className="text-slate-400 text-sm leading-relaxed mb-3">
                       If your application requires real-time generation (e.g., interactive gaming, real-time voice synthesis), the O(N) sequential generation time of AR decoders will break your app.
                     </p>
                     <p className="text-emerald-400 font-mono text-xs font-bold">Recommended: Standard VAEs, GANs, or Distilled Diffusion.</p>
                   </motion.div>
                 )}
                 {priority >= 40 && priority <= 60 && (
                   <motion.div key="balance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                     <div className="flex items-center gap-3 mb-2">
                       <Scale className="w-6 h-6 text-amber-500" />
                       <h3 className="font-bold text-xl text-white">Consider Hybrid Models</h3>
                     </div>
                     <p className="text-slate-400 text-sm leading-relaxed mb-3">
                       You need a balance. You might want to use a standard VAE but upgrade the latent space (e.g., VQ-VAE) or use a shallow AR model that groups generation into blocks rather than individual pixels.
                     </p>
                   </motion.div>
                 )}
                 {priority > 60 && (
                   <motion.div key="quality" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                     <div className="flex items-center gap-3 mb-2">
                       <ThumbsUp className="w-6 h-6 text-emerald-500" />
                       <h3 className="font-bold text-xl text-white">Highly Recommended</h3>
                     </div>
                     <p className="text-slate-400 text-sm leading-relaxed mb-3">
                       If you are doing offline generation (rendering artwork, generating high-fidelity music tracks) and prioritize hyper-realistic, sharp details over immediate results, AR decoders are the perfect choice.
                     </p>
                     <p className="text-blue-400 font-mono text-xs font-bold">Recommended: PixelCNN, WaveNet, Transformers.</p>
                   </motion.div>
                 )}
               </AnimatePresence>
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
    BlurProblemSlide,
    ARRecapSlide,
    MarryingVaeArSlide,
    ArArchitectureDiagramSlide,
    ArchitecturalIntegrationSlide,
    TeacherForcingSlide,
    AdvantagesSlide,
    ChallengesSlide,
    PixelVaeSlide,
    DecisionSlide
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="flex flex-col h-screen bg-slate-950 font-sans">
      {/* Top Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800">
        <motion.div
          className="h-full bg-emerald-500"
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
      <div className="flex justify-between items-center p-4 md:p-6 bg-slate-900 border-t border-slate-800 z-10">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-slate-800 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-slate-700 hover:text-white"
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-6 h-6"/>
        </button>
        
        <div className="flex space-x-1 md:space-x-2">
          {slides.map((_, i) => (
            <div
              key={`dot-${i}`}
              className={`w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full transition-all ${i === currentSlide ? 'bg-emerald-500 scale-125' : 'bg-slate-700'}`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-emerald-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-emerald-500 shadow-md shadow-emerald-900/50"
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