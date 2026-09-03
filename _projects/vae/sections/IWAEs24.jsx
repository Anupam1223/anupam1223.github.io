import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Target, Layers, 
  Activity, ArrowRight, ArrowDown, Database, 
  Calculator, LineChart, AlertCircle, CheckCircle,
  Eye, Unlock, Variable, BrainCircuit, Image as ImageIcon,
  RotateCcw, Zap, Play, Pause,
  Cpu, Clock, Gauge, Terminal, ShieldAlert, Scale
} from 'lucide-react';

const JargonDecoderSlide = () => {
  const [activeJargon, setActiveJargon] = useState(0);

  const jargons = [
    {
      symbol: "x",
      name: "The Observed Data",
      icon: <Eye className="w-6 h-6 text-slate-500" />,
      desc: "This is simply your input. If you are training a face generator, 'x' is the actual pixels of a specific face image from your dataset.",
      color: "bg-slate-100 border-slate-300 text-slate-800"
    },
    {
      symbol: "z",
      name: "The Latent Variables",
      icon: <Variable className="w-6 h-6 text-amber-500" />,
      desc: "The hidden, underlying causes that created the data. For a face, 'z' might be numbers representing 'Lighting', 'Pose', or 'Smile'. We can't see them; we have to guess them.",
      color: "bg-amber-50 border-amber-300 text-amber-900"
    },
    {
      symbol: "log p_θ(x)",
      name: "True Log Marginal Likelihood",
      icon: <Unlock className="w-6 h-6 text-emerald-500" />,
      desc: "The ultimate score. It asks: 'What is the absolute, true probability that our model would generate this exact image (x), considering ALL possible hidden causes (z)?' It is mathematically impossible to calculate exactly, which is why we need bounds.",
      color: "bg-emerald-50 border-emerald-300 text-emerald-900"
    },
    {
      symbol: "p_θ(z|x)",
      name: "True Posterior",
      icon: <Target className="w-6 h-6 text-blue-500" />,
      desc: "Given this specific image (x), what were the EXACT hidden causes (z) that made it? Like the marginal likelihood, this is intractable (impossible to calculate perfectly).",
      color: "bg-blue-50 border-blue-300 text-blue-900"
    },
    {
      symbol: "q_φ(z|x)",
      name: "Approximate Posterior (Encoder)",
      icon: <Calculator className="w-6 h-6 text-purple-500" />,
      desc: "Because the True Posterior is impossible to calculate, we use a Neural Network (the Encoder) to GUESS the hidden causes. This is a cheaper, simplified approximation.",
      color: "bg-purple-50 border-purple-300 text-purple-900"
    },
    {
      symbol: "p_θ(x, z)",
      name: "Joint Probability",
      icon: <Database className="w-6 h-6 text-rose-500" />,
      desc: "How likely is it that this specific hidden cause (z) AND this specific image (x) happen together? This is easy to calculate! It's just the Prior p(z) times the Decoder p(x|z).",
      color: "bg-rose-50 border-rose-300 text-rose-900"
    }
  ];

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Step 1: The Jargon Decoder</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Before we can understand the gap, we must understand the symbols. Click on any mathematical term below to translate it into plain English.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto flex-grow pb-8">
        <div className="flex-1 flex flex-col gap-3">
          <h3 className="font-bold text-slate-500 uppercase tracking-widest text-xs mb-2">The Symbols</h3>
          {jargons.map((j, idx) => (
            <button
              key={idx}
              onClick={() => setActiveJargon(idx)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left ${activeJargon === idx ? `border-${j.color.split('-')[1]}-500 shadow-md bg-white scale-[1.02]` : 'border-slate-200 bg-white hover:bg-slate-50 opacity-70'}`}
            >
              <div className="flex items-center gap-4">
                {j.icon}
                <span className={`font-mono font-bold text-lg ${activeJargon === idx ? `text-${j.color.split('-')[1]}-600` : 'text-slate-700'}`}>{j.symbol}</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${activeJargon === idx ? `text-${j.color.split('-')[1]}-500` : 'text-slate-300'}`} />
            </button>
          ))}
        </div>

        <div className="flex-[1.2] flex flex-col">
           <h3 className="font-bold text-slate-500 uppercase tracking-widest text-xs mb-2 lg:mt-0 mt-6">The Translation</h3>
           <AnimatePresence mode="wait">
             <motion.div
               key={activeJargon}
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
               className={`flex-grow rounded-2xl p-8 border-2 shadow-lg flex flex-col justify-center ${jargons[activeJargon].color}`}
             >
                <div className="bg-white/60 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm border border-white">
                  {React.cloneElement(jargons[activeJargon].icon, { className: "w-8 h-8" })}
                </div>
                <h3 className="text-3xl font-bold mb-2">{jargons[activeJargon].name}</h3>
                <div className="font-mono text-xl mb-6 opacity-75">{jargons[activeJargon].symbol}</div>
                <p className="text-lg leading-relaxed font-medium">
                  {jargons[activeJargon].desc}
                </p>
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const GapProofSlide = () => {
  const [encoderQuality, setEncoderQuality] = useState(30);
  const [proofStep, setProofStep] = useState(0);

  const klDivergence = 100 - encoderQuality; 
  const elbo = encoderQuality; 

  const proofSteps = [
    {
      title: "1. Start with the error",
      formula: <span>D_KL( <span className="text-purple-600">q(z|x)</span> || <span className="text-blue-600">p(z|x)</span> ) = <span className="text-indigo-600">E_q</span> [ log <span className="text-purple-600">q(z|x)</span> - log <span className="text-blue-600">p(z|x)</span> ]</span>,
      desc: "We start by writing the formula for the KL Divergence. It measures the difference between our Encoder's guess (q) and the True Posterior (p). By definition, this error is ALWAYS ≥ 0."
    },
    {
      title: "2. Expand using Bayes' Rule",
      formula: <span>D_KL = <span className="text-indigo-600">E_q</span> [ log <span className="text-purple-600">q(z|x)</span> - log( <span className="text-rose-600">p(x,z)</span> / <span className="text-emerald-600">p(x)</span> ) ]</span>,
      desc: "We don't know the True Posterior p(z|x). But Bayes' Rule lets us replace it with the Joint Probability divided by the Marginal Likelihood."
    },
    {
      title: "3. Split the logarithm",
      formula: <span>D_KL = <span className="text-indigo-600">E_q</span> [ log <span className="text-purple-600">q(z|x)</span> - log <span className="text-rose-600">p(x,z)</span> + log <span className="text-emerald-600">p(x)</span> ]</span>,
      desc: "Using basic algebra (log(a/b) = log(a) - log(b)), we split the fraction into two separate terms."
    },
    {
      title: "4. Pull out the target",
      formula: <span>D_KL = <span className="text-indigo-600">E_q</span> [ log <span className="text-purple-600">q(z|x)</span> - log <span className="text-rose-600">p(x,z)</span> ] + log <span className="text-emerald-600">p(x)</span></span>,
      desc: "Because log p(x) does not contain 'z', the Expectation (averaging over z) doesn't affect it. We can safely pull it outside the brackets."
    },
    {
      title: "5. Rearrange the formula",
      formula: <span>log <span className="text-emerald-600">p(x)</span> = <span className="text-indigo-600">E_q</span> [ log <span className="text-rose-600">p(x,z)</span> - log <span className="text-purple-600">q(z|x)</span> ] + D_KL</span>,
      desc: "We move things across the equals sign to solve for our ultimate target: log p(x)."
    },
    {
      title: "6. Reveal the ELBO",
      formula: <span><span className="text-emerald-600 font-bold">log p(x)</span> = <span className="bg-amber-200 px-2 py-1 rounded text-amber-900 font-bold">ELBO</span> + <span className="bg-rose-200 px-2 py-1 rounded text-rose-900 font-bold">KL Divergence</span></span>,
      desc: "Look closely at the Expectation block: that is the exact definition of the ELBO! We have just mathematically proven that the Target = ELBO + Error. Therefore, the ELBO is ALWAYS a lower bound."
    }
  ];

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-amber-400 mb-2 text-center">Why is ELBO a "Lower Bound"?</h2>
        <p className="text-slate-300 text-center max-w-4xl text-sm md:text-base">
          The screenshot states: <em>"The gap between the ELBO and the true log-likelihood is precisely the KL divergence."</em> 
          Let's prove exactly why this is true, visually and mathematically.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto items-stretch flex-grow pb-8">
        <div className="flex-1 bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col items-center">
           <h3 className="font-bold text-slate-300 mb-6 uppercase tracking-widest text-sm">The Probability Stack</h3>
           
           <div className="relative w-48 h-64 border-2 border-emerald-500 rounded-lg flex flex-col justify-end overflow-hidden p-1">
             <div className="absolute top-2 left-0 right-0 text-center text-emerald-400 font-bold text-xs uppercase z-10">True log p(x)<br/>(Fixed Target)</div>
             <div 
               className="bg-rose-500/80 w-full flex items-center justify-center transition-all duration-300 border-b border-rose-700 rounded-t"
               style={{ height: `${klDivergence}%` }}
             >
               {klDivergence > 15 && <span className="text-white font-bold text-xs">Gap (KL)</span>}
             </div>
             <div 
               className="bg-amber-500 w-full flex items-center justify-center transition-all duration-300 rounded-b"
               style={{ height: `${elbo}%` }}
             >
               <span className="text-amber-900 font-bold text-sm">ELBO</span>
             </div>
           </div>

           <div className="w-full mt-8 px-4">
             <label className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase">
               <span>Poor Encoder</span>
               <span>Perfect Encoder</span>
             </label>
             <input 
               type="range" min="10" max="100" step="1" 
               value={encoderQuality} onChange={(e) => setEncoderQuality(parseInt(e.target.value))} 
               className="w-full accent-amber-500" 
             />
           </div>
        </div>

        <div className="flex-[1.5] flex flex-col">
           <div className="bg-slate-800 p-1 rounded-xl flex justify-between mb-4 shadow-inner border border-slate-700">
             {proofSteps.map((_, idx) => (
               <button 
                 key={idx} 
                 onClick={() => setProofStep(idx)}
                 className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${proofStep === idx ? 'bg-indigo-500 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 Step {idx + 1}
               </button>
             ))}
           </div>

           <AnimatePresence mode="wait">
             <motion.div
               key={proofStep}
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
               className="flex-grow bg-slate-800 rounded-xl border border-slate-700 p-8 flex flex-col justify-center shadow-lg"
             >
                <h3 className="text-xl font-bold text-indigo-400 mb-6">{proofSteps[proofStep].title}</h3>
                <div className="bg-slate-900 p-6 rounded-xl font-mono text-lg md:text-xl border border-slate-600 shadow-inner flex justify-center items-center mb-6">
                  {proofSteps[proofStep].formula}
                </div>
                <div className="bg-indigo-900/30 border-l-4 border-indigo-500 p-4 rounded-r text-slate-300 leading-relaxed">
                  {proofSteps[proofStep].desc}
                </div>
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const AnatomyOfWeightSlide = () => {
  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">What exactly is a "Weight" (w_k)?</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Let's rip open the importance weight formula <span className="font-mono bg-slate-200 px-1 rounded">w_k</span> to see exactly where the Encoder and Decoder live inside it.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto items-stretch flex-grow pb-8">
        <div className="flex-[1.5] bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col items-center justify-center relative">
          
          <div className="flex items-center gap-4 font-mono text-3xl md:text-4xl mb-12 relative z-20">
            <span className="font-bold text-slate-700">w_k</span>
            <span className="text-slate-400">=</span>
            
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-slate-800 relative group cursor-help">
                <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded">p_θ(x, z_k)</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-slate-800 text-white text-xs w-64 p-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-xl">
                  <div className="font-bold text-emerald-400 mb-2 border-b border-slate-600 pb-1">The True Joint Probability</div>
                  <span className="font-mono text-amber-300">p(z_k)</span> * <span className="font-mono text-sky-300">p_θ(x | z_k)</span><br/><br/>
                  <span className="text-[10px] text-slate-300">Prior Probability × Decoder's Reconstruction Score</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 relative group cursor-help">
                <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded">q_φ(z_k | x)</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-slate-800 text-white text-xs w-56 p-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-xl">
                  <div className="font-bold text-purple-400 mb-2 border-b border-slate-600 pb-1">The Encoder's Guess</div>
                  How likely was our neural network to guess this specific <span className="font-mono text-white">z_k</span>?
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500 animate-pulse mb-8 relative z-10">Hover over the top and bottom of the fraction to reveal their secrets.</p>

          <div className="w-full bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner flex items-center justify-between z-10">
             <div className="flex flex-col items-center w-1/4">
               <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center mb-2 shadow"><ImageIcon className="w-6 h-6 text-slate-500" /></div>
               <span className="text-[10px] font-bold text-slate-500 uppercase">Input x</span>
             </div>
             <ArrowRight className="w-6 h-6 text-slate-300" />
             <div className="flex flex-col items-center w-1/4 relative group">
               <div className="w-12 h-12 bg-purple-100 border-2 border-purple-400 rounded-full flex items-center justify-center mb-2 shadow-md z-10"><BrainCircuit className="w-6 h-6 text-purple-600" /></div>
               <span className="text-[10px] font-bold text-purple-700 uppercase text-center">Encoder<br/>q_φ(z|x)</span>
             </div>
             <ArrowRight className="w-6 h-6 text-slate-300" />
             <div className="flex flex-col items-center w-1/4 relative group">
               <div className="w-12 h-12 bg-sky-100 border-2 border-sky-400 rounded-lg flex items-center justify-center mb-2 shadow-md z-10"><ImageIcon className="w-6 h-6 text-sky-600" /></div>
               <span className="text-[10px] font-bold text-sky-700 uppercase text-center">Decoder<br/>p_θ(x|z)</span>
             </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 justify-center">
          <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 text-white h-full flex flex-col justify-center">
             <h4 className="font-bold text-emerald-400 text-xl mb-4 border-b border-slate-600 pb-2">The Intuition of the Weight</h4>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               When you draw a sample <span className="font-mono bg-slate-700 px-1 rounded">z_k</span>, you are testing a hypothesis. 
             </p>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               The <strong>Numerator</strong> (The Decoder) asks: <em>"If I use this <span className="font-mono">z_k</span>, does it successfully rebuild the original image?"</em> If yes, the score is high!
             </p>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               The <strong>Denominator</strong> (The Encoder) asks: <em>"How heavily did I bias the network to pick this <span className="font-mono">z_k</span>?"</em>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const IntuitionSlide = () => {
  const [samples, setSamples] = useState([]);
  const [isIWAE, setIsIWAE] = useState(false);
  const [hasSampled, setHasSampled] = useState(false);

  const drawSamples = () => {
    const k = isIWAE ? 5 : 1;
    const newSamples = [];
    for (let i = 0; i < k; i++) {
      const x = 20 + Math.random() * 40; 
      const y = 30 + Math.random() * 40;
      const dist = Math.sqrt(Math.pow(x - 70, 2) + Math.pow(y - 50, 2));
      const weight = Math.max(0.01, 1 - (dist / 60)); 
      newSamples.push({ id: i, x, y, weight });
    }
    setSamples(newSamples);
    setHasSampled(true);
  };

  const maxWeight = samples.length > 0 ? Math.max(...samples.map(s => s.weight)) : 0;
  const avgWeight = samples.length > 0 ? samples.reduce((sum, s) => sum + s.weight, 0) / samples.length : 0;

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-emerald-600 mb-2 text-center">Intuition: The "Unlucky" Sample</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          If our approximation <span className="font-mono">q(z|x)</span> is poor, a single sample might land in a useless, low-density region. IWAE fixes this by taking <strong>K samples</strong>.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto items-stretch flex-grow pb-8">
        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex flex-col items-center">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex mb-4">
            <button 
              onClick={() => {setIsIWAE(false); setHasSampled(false); setSamples([]);}}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${!isIWAE ? 'bg-white shadow text-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Standard VAE (K = 1)
            </button>
            <button 
              onClick={() => {setIsIWAE(true); setHasSampled(false); setSamples([]);}}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${isIWAE ? 'bg-white shadow text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              IWAE (K = 5)
            </button>
          </div>

          <div className="relative w-full aspect-square max-w-[300px] bg-slate-900 rounded-xl overflow-hidden shadow-inner mb-6 border border-slate-700">
             <span className="absolute top-2 left-2 text-[10px] text-slate-400 font-bold uppercase">Latent Space (Z)</span>
             <div className="absolute w-24 h-24 bg-emerald-500/40 rounded-full blur-xl" style={{ left: '60%', top: '35%' }}></div>
             <div className="absolute w-8 h-8 bg-emerald-400/80 rounded-full blur-md" style={{ left: '72%', top: '45%' }}></div>
             <span className="absolute top-[35%] right-2 text-[9px] text-emerald-400 font-bold text-right leading-tight">True Posterior<br/>(Joint Peaks)</span>
             <div className="absolute w-48 h-48 bg-rose-500/20 rounded-full blur-xl border border-rose-500/30" style={{ left: '10%', top: '20%' }}></div>
             <span className="absolute bottom-4 left-4 text-[9px] text-rose-300 font-bold leading-tight">Our Poor<br/>Approximation q(z|x)</span>

             <AnimatePresence>
               {samples.map((s) => (
                 <motion.div
                   key={s.id}
                   initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                   className={`absolute w-3 h-3 rounded-full shadow border border-white ${s.weight > 0.6 ? 'bg-emerald-400 z-20' : 'bg-rose-400 z-10'}`}
                   style={{ left: `${s.x}%`, top: `${s.y}%`, marginLeft: -6, marginTop: -6 }}
                 />
               ))}
             </AnimatePresence>
          </div>

          <button 
            onClick={drawSamples}
            className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-colors flex items-center justify-center gap-2 ${isIWAE ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'}`}
          >
            <Activity className="w-5 h-5" /> {isIWAE ? 'Draw 5 Samples' : 'Draw 1 Sample'}
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-4">
           {hasSampled ? (
             <div className={`p-6 rounded-xl border-2 flex flex-col items-center justify-center h-40 transition-colors ${maxWeight > 0.6 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
               <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Estimate Quality</span>
               <div className={`text-4xl font-bold font-mono ${maxWeight > 0.6 ? 'text-emerald-600' : 'text-rose-600'}`}>
                 {isIWAE ? `Avg W: ${(avgWeight).toFixed(2)}` : `Weight: ${avgWeight.toFixed(2)}`}
               </div>
               <p className={`text-xs mt-3 text-center ${maxWeight > 0.6 ? 'text-emerald-800' : 'text-rose-800'}`}>
                 {maxWeight > 0.6 
                   ? (isIWAE ? "A 'lucky' sample hit the true distribution, saving the average!" : "Lucky hit! But relying on 1 sample is risky.") 
                   : "Missed the high-density region entirely. The estimate is extremely poor."}
               </p>
             </div>
           ) : (
             <div className="p-6 rounded-xl border-2 border-slate-200 bg-white flex flex-col items-center justify-center h-40 text-slate-400 text-sm">
               Click the button to draw sample(s).
             </div>
           )}

           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-grow overflow-y-auto">
             <h3 className="font-bold text-slate-800 mb-2 text-lg">Wait, isn't the True Posterior impossible?</h3>
             <p className="text-sm text-slate-600 leading-relaxed mb-3">
               You are completely right! We <strong>never</strong> calculate the true posterior <span className="font-mono text-xs bg-slate-100 px-1 rounded">p(z|x)</span>.
             </p>
             <div className="bg-indigo-50 border border-indigo-100 p-3 mb-4 text-xs text-indigo-900 rounded shadow-sm">
               <strong>The Math Cheat Code:</strong> The weight formula uses the <strong>Joint Probability</strong> <span className="font-mono font-bold">p(x, z)</span> in the numerator. Because the Joint has the <em>exact same peaks and shape</em> as the True Posterior, evaluating how well the Decoder reconstructs the image lets us "feel around in the dark" for the green zone without ever calculating the impossible denominator!
             </div>
             
             <h3 className="font-bold text-slate-800 mb-2 text-md">Why averaging saves the day:</h3>
             {!isIWAE ? (
               <div className="bg-rose-50 border-l-4 border-rose-500 p-3 text-xs text-rose-900 rounded-r">
                 <strong>Standard VAE (K=1):</strong> If your one sample misses the hidden green zone, the weight is near zero. The logarithm of near-zero is a massive negative penalty. The ELBO crashes.
               </div>
             ) : (
               <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 text-xs text-emerald-900 rounded-r">
                 <strong>IWAE (K is greater than 1):</strong> You average the weights <em>first</em>. Even if 4 samples miss, just 1 sample hitting the green zone lifts the entire average up <em>before</em> the logarithm is applied.
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

const AveragingMathSlide = () => {
  const weights = [0.01, 0.05, 0.02, 5.00, 0.01];
  
  const logs = weights.map(w => Math.log(w));
  const elboSum = logs.reduce((a, b) => a + b, 0);
  const elboAverage = elboSum / weights.length;

  const weightSum = weights.reduce((a, b) => a + b, 0);
  const weightAverage = weightSum / weights.length;
  const iwaeScore = Math.log(weightAverage);

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The Math Simulator</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Let's see what happens to the final loss score when Sample 4 is a "Lucky Hit".
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto flex-grow pb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Our 5 Importance Weights (w_k)</h3>
           <div className="flex justify-between items-center gap-2">
             {weights.map((w, i) => (
               <div key={i} className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-transform hover:scale-105 ${w > 1 ? 'bg-emerald-50 border-emerald-400 shadow-md' : 'bg-slate-50 border-slate-200'}`}>
                 <span className="text-[10px] text-slate-400 font-bold mb-1">Sample {i+1}</span>
                 <span className={`font-mono text-xl font-bold ${w > 1 ? 'text-emerald-600' : 'text-slate-700'}`}>{w.toFixed(2)}</span>
               </div>
             ))}
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="flex-1 bg-rose-50 rounded-xl shadow-lg border border-rose-200 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-6 border-b border-rose-200 pb-4">
               <div>
                 <h3 className="font-bold text-rose-900 text-xl flex items-center gap-2"><Activity className="w-5 h-5"/> Standard VAE (ELBO)</h3>
                 <p className="text-xs text-rose-700 mt-1 font-mono">E [ log(w) ]</p>
               </div>
               <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Log First</span>
            </div>

            <div className="space-y-3 flex-grow">
               <div className="flex justify-between text-sm font-mono text-rose-800">
                 <span>1. Take log of each weight:</span>
               </div>
               <div className="flex gap-1 flex-wrap text-xs font-mono">
                 {logs.map((l, i) => (
                   <span key={i} className={`px-2 py-1 rounded border ${l < -4 ? 'bg-rose-200 border-rose-400 text-rose-900 font-bold' : 'bg-rose-100 border-rose-200'}`}>
                     {l.toFixed(2)}
                   </span>
                 ))}
               </div>
               <div className="flex justify-between text-sm font-mono text-rose-800 items-center mt-4">
                 <span>2. Average the logs:</span>
                 <span className="text-3xl font-bold text-rose-700">{elboAverage.toFixed(2)}</span>
               </div>
            </div>
            <div className="mt-6 bg-white/60 p-4 rounded-lg border border-rose-200 text-sm text-rose-900 shadow-sm">
              The terrible samples destroyed the score. The lucky hit (1.61) was drowned out by the massive negative penalties (-4.61).
            </div>
          </div>

          <div className="flex-1 bg-emerald-50 rounded-xl shadow-lg border border-emerald-200 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-6 border-b border-emerald-200 pb-4">
               <div>
                 <h3 className="font-bold text-emerald-900 text-xl flex items-center gap-2"><Target className="w-5 h-5"/> IWAE Objective</h3>
                 <p className="text-xs text-emerald-700 mt-1 font-mono">log( E [ w ] )</p>
               </div>
               <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Average First</span>
            </div>

            <div className="space-y-3 flex-grow">
               <div className="flex justify-between text-sm font-mono text-emerald-800 items-center">
                 <span>1. Average the weights:</span>
                 <span className="text-xl font-bold text-emerald-700">{weightAverage.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-sm font-mono text-emerald-800 items-center mt-4">
                 <span>2. Take log of average:</span>
                 <span className="text-3xl font-bold text-emerald-700">{iwaeScore.toFixed(2)}</span>
               </div>
            </div>
            <div className="mt-6 bg-white/60 p-4 rounded-lg border border-emerald-200 text-sm text-emerald-900 shadow-sm">
              By averaging <em>before</em> the logarithm, Sample 4 dominates the sum. It rescues the entire batch, resulting in a healthy, positive score!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const JensensMathSlide = () => {
  const [w1, setW1] = useState(0.5);
  const [w2, setW2] = useState(4.0);

  const logW1 = Math.log(w1);
  const logW2 = Math.log(w2);
  
  const avgOfLogs = (logW1 + logW2) / 2;     
  const logOfAvgs = Math.log((w1 + w2) / 2); 

  const width = 400;
  const height = 250;
  const padding = 40;
  
  const scaleX = (val) => padding + (val / 5) * (width - padding * 2);
  const scaleY = (val) => (height - padding) - ((val + 2) / 4) * (height - padding * 2); 

  let pathD = `M ${scaleX(0.1)} ${scaleY(Math.log(0.1))}`;
  for (let x = 0.2; x <= 5; x += 0.1) {
    pathD += ` L ${scaleX(x)} ${scaleY(Math.log(x))}`;
  }

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-indigo-700 mb-2 text-center">The Math: Jensen's Inequality</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Because the logarithm is a <em>concave</em> curve, averaging <strong>then</strong> logging will always yield a higher number than logging <strong>then</strong> averaging.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto items-stretch flex-grow pb-8">
        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex flex-col items-center">
          <div className="relative w-full max-w-[400px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner mb-6">
             <svg width={width} height={height} className="w-full h-auto">
                <line x1={padding} y1={scaleY(0)} x2={width - padding} y2={scaleY(0)} stroke="#cbd5e1" strokeWidth="2" />
                <line x1={scaleX(1)} y1={padding} x2={scaleX(1)} y2={height - padding} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="3" />
                
                <line x1={scaleX(w1)} y1={scaleY(logW1)} x2={scaleX(w2)} y2={scaleY(logW2)} stroke="#f43f5e" strokeWidth="2" strokeDasharray="4" />
                <circle cx={scaleX(w1)} cy={scaleY(logW1)} r="5" fill="#334155" />
                <circle cx={scaleX(w2)} cy={scaleY(logW2)} r="5" fill="#334155" />

                <circle cx={scaleX((w1+w2)/2)} cy={scaleY(avgOfLogs)} r="6" fill="#f43f5e" />
                <text x={scaleX((w1+w2)/2) + 10} y={scaleY(avgOfLogs) + 15} className="text-[10px] fill-rose-600 font-bold">Avg of Logs (ELBO)</text>

                <circle cx={scaleX((w1+w2)/2)} cy={scaleY(logOfAvgs)} r="6" fill="#10b981" />
                <text x={scaleX((w1+w2)/2) - 100} y={scaleY(logOfAvgs) - 10} className="text-[10px] fill-emerald-600 font-bold">Log of Avg (IWAE)</text>
                
                <line x1={scaleX((w1+w2)/2)} y1={scaleY(avgOfLogs)} x2={scaleX((w1+w2)/2)} y2={scaleY(logOfAvgs)} stroke="#10b981" strokeWidth="2" />
             </svg>
          </div>

          <div className="w-full flex gap-4 px-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500">Weight 1: {w1.toFixed(1)}</label>
              <input type="range" min="0.1" max="2.5" step="0.1" value={w1} onChange={(e) => setW1(parseFloat(e.target.value))} className="w-full accent-slate-600" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500">Weight 2: {w2.toFixed(1)}</label>
              <input type="range" min="2.6" max="5.0" step="0.1" value={w2} onChange={(e) => setW2(parseFloat(e.target.value))} className="w-full accent-slate-600" />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
           <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 shadow-sm relative">
             <div className="bg-white p-3 rounded border border-emerald-100 font-mono text-center text-emerald-700 font-bold text-lg mb-3 shadow-sm">
                log ( E [ w ] ) = {logOfAvgs.toFixed(3)}
             </div>
           </div>
           <div className="bg-rose-50 p-6 rounded-xl border border-rose-200 shadow-sm relative">
             <div className="bg-white p-3 rounded border border-rose-100 font-mono text-center text-rose-700 font-bold text-lg mb-3 shadow-sm">
                E [ log(w) ] = {avgOfLogs.toFixed(3)}
             </div>
           </div>
           <p className="text-sm text-slate-600 p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
             Notice that <span className="font-mono text-emerald-600 font-bold">{logOfAvgs.toFixed(3)}</span> is strictly greater than <span className="font-mono text-rose-600 font-bold">{avgOfLogs.toFixed(3)}</span>. By moving the log outside, the IWAE objective is mathematically guaranteed to be a tighter bound!
           </p>
        </div>
      </div>
    </div>
  );
};

const WhyItWorksSlide = () => {
  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-900 text-slate-200">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Why does Averaging z help?</h2>
      </div>

      <div className="flex flex-col lg:flex-row items-center max-w-5xl mx-auto w-full flex-grow pb-8 gap-12">
        <div className="flex-1 flex justify-center w-full">
           <div className="relative w-80 h-80 bg-slate-800 rounded-2xl border-2 border-slate-600 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center">
              
              <div className="absolute top-1/4 right-1/4 w-12 h-24 bg-emerald-500/50 rounded-full blur-md transform rotate-45 border border-emerald-400"></div>
              <span className="absolute top-[10%] right-[10%] text-emerald-400 text-[10px] font-bold">True p(z|x)</span>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-dashed border-rose-500/50 rounded-full bg-rose-500/10"></div>
              <span className="absolute bottom-4 left-4 text-rose-400 text-[10px] font-bold">Encoder q(z|x)</span>

              <div className="absolute w-2 h-2 bg-rose-400 rounded-full top-[60%] left-[30%] shadow-[0_0_10px_#f43f5e]"></div>
              <div className="absolute w-2 h-2 bg-rose-400 rounded-full top-[40%] left-[20%] shadow-[0_0_10px_#f43f5e]"></div>
              <div className="absolute w-2 h-2 bg-rose-400 rounded-full top-[70%] left-[60%] shadow-[0_0_10px_#f43f5e]"></div>
              <div className="absolute w-2 h-2 bg-rose-400 rounded-full top-[20%] left-[40%] shadow-[0_0_10px_#f43f5e]"></div>
              
              <motion.div 
                initial={{ scale: 1 }} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }}
                className="absolute w-3 h-3 bg-emerald-400 rounded-full top-[30%] right-[30%] shadow-[0_0_15px_#34d399] z-10"
              ></motion.div>

           </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
             <h3 className="text-xl font-bold text-emerald-400 mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5"/> Brute-Forcing Expressiveness</h3>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               Look at the diagram. The Encoder (red dashed line) is forced to be a giant circle because it uses the "Mean-Field" assumption. Most of the area inside it is useless garbage.
             </p>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               If we take just 1 sample, it will likely land in the garbage (red dots). The Decoder will try to rebuild the image from garbage, fail, and the Loss will be terrible.
             </p>
             <p className="text-sm text-emerald-200 leading-relaxed font-bold bg-emerald-900/30 p-4 rounded-lg border border-emerald-800 shadow-inner">
               By taking multiple samples, we vastly increase the odds that at least one randomly lands inside the True Posterior (the green dot). 
               Because IWAE averages the weights first, this single good sample dominates the math, telling the network: "Good job, you found a way to reconstruct the image!"
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const IWAEFlowchartSlide = () => {
  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-900 text-slate-200">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">The IWAE Architecture Flow</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          This is exactly how the computation graph looks when programming an Importance Weighted Autoencoder. We draw multiple parallel samples, calculate independent weights, and merge them at the end.
        </p>
      </div>

      <div className="flex flex-col items-center max-w-5xl mx-auto w-full flex-grow pb-8">
        <div className="relative w-full max-w-3xl bg-slate-800 rounded-2xl p-8 border border-slate-600 shadow-2xl flex flex-col items-center">
          
          <div className="bg-sky-300 text-sky-900 font-bold px-6 py-3 rounded-lg shadow-md z-10 w-32 text-center border-2 border-sky-400">
            Input x
          </div>
          
          <ArrowDown className="w-6 h-6 text-slate-500 my-2" />

          <div className="bg-indigo-300 text-indigo-900 font-bold px-8 py-4 rounded-lg shadow-md z-10 border-2 border-indigo-400 text-center">
            Inference Network<br/>
            <span className="font-mono text-sm font-normal">q_φ(z|x)</span>
          </div>

          <div className="relative w-full h-16 flex justify-center">
            <svg className="absolute inset-0 w-full h-full">
               <defs>
                 <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                   <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                 </marker>
               </defs>
               <path d="M 50% 0 Q 20% 50 15% 100" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
               <path d="M 50% 0 L 50% 100" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
               <path d="M 50% 0 Q 80% 50 85% 100" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
            </svg>
            <div className="absolute top-4 bg-slate-800 text-slate-300 text-[10px] px-2 rounded-full border border-slate-600">Draw K Samples</div>
          </div>

          <div className="flex justify-between w-[90%] border-2 border-dashed border-slate-600 p-4 rounded-xl relative z-10 bg-slate-800/50">
             <div className="flex flex-col items-center gap-4">
                <div className="bg-amber-200 text-amber-900 w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-md border-2 border-amber-400 relative group">
                  z₁
                  <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Sample 1</div>
                </div>
                <div className="flex gap-2 relative">
                   <div className="bg-emerald-200 text-emerald-900 px-2 py-1 rounded shadow-md border border-emerald-400 text-[10px] font-mono relative group">
                     p(x|z₁)
                     <div className="absolute bottom-full mb-2 bg-slate-900 text-emerald-300 text-[9px] p-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Decoder Probability</div>
                   </div>
                   <div className="bg-rose-200 text-rose-900 px-2 py-1 rounded shadow-md border border-rose-400 text-[10px] font-mono relative group">
                     p(z₁)
                     <div className="absolute bottom-full mb-2 bg-slate-900 text-rose-300 text-[9px] p-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Prior Probability</div>
                   </div>
                   <div className="bg-indigo-200 text-indigo-900 px-2 py-1 rounded shadow-md border border-indigo-400 text-[10px] font-mono relative group">
                     q(z₁|x)
                     <div className="absolute bottom-full mb-2 bg-slate-900 text-indigo-300 text-[9px] p-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Encoder Probability</div>
                   </div>
                </div>
                <div className="bg-orange-200 text-orange-900 px-4 py-2 rounded shadow-md border-2 border-orange-400 text-xs font-mono text-center">
                   w₁ = p(x,z₁)<br/><span className="border-t border-orange-900/30 w-full block mt-1 pt-1">q(z₁|x)</span>
                </div>
             </div>

             <div className="flex flex-col items-center gap-4 justify-center opacity-50">
                <div className="bg-slate-700 text-slate-300 px-4 py-2 rounded-full font-bold">...</div>
             </div>

             <div className="flex flex-col items-center gap-4">
                <div className="bg-amber-200 text-amber-900 w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-md border-2 border-amber-400 relative group">
                  z_K
                  <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Sample K</div>
                </div>
                <div className="flex gap-2 relative">
                   <div className="bg-emerald-200 text-emerald-900 px-2 py-1 rounded shadow-md border border-emerald-400 text-[10px] font-mono">p(x|z_K)</div>
                   <div className="bg-rose-200 text-rose-900 px-2 py-1 rounded shadow-md border border-rose-400 text-[10px] font-mono">p(z_K)</div>
                   <div className="bg-indigo-200 text-indigo-900 px-2 py-1 rounded shadow-md border border-indigo-400 text-[10px] font-mono">q(z_K|x)</div>
                </div>
                <div className="bg-orange-200 text-orange-900 px-4 py-2 rounded shadow-md border-2 border-orange-400 text-xs font-mono text-center">
                   w_K = p(x,z_K)<br/><span className="border-t border-orange-900/30 w-full block mt-1 pt-1">q(z_K|x)</span>
                </div>
             </div>
          </div>

          <div className="relative w-full h-16 flex justify-center">
            <svg className="absolute inset-0 w-full h-full">
               <path d="M 15% 0 Q 20% 50 50% 100" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
               <path d="M 85% 0 Q 80% 50 50% 100" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
            </svg>
          </div>

          <div className="bg-teal-300 text-teal-900 font-bold px-10 py-5 rounded-lg shadow-[0_0_15px_rgba(45,212,191,0.3)] z-10 border-2 border-teal-400 text-center transform hover:scale-105 transition-transform cursor-pointer">
            IWAE Objective L_K<br/>
            <span className="font-mono text-xs font-normal bg-teal-100/50 px-2 py-1 rounded mt-2 block">log( (w₁ + ... + w_K) / K )</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrainingBenefitSlide = () => {
  const [step, setStep] = useState('forward'); 

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-indigo-700 mb-2 text-center">How does this improve Training?</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Yes! <span className="font-mono font-bold bg-slate-200 px-1 rounded">L_K</span> is your brand new Loss score. You tell your optimizer to maximize it. Let's look at what happens during Backpropagation when we use this new score.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto items-stretch flex-grow pb-8">
        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex flex-col items-center relative overflow-hidden">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex mb-8 relative z-20">
            <button 
              onClick={() => setStep('forward')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${step === 'forward' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ArrowRight className="w-4 h-4" /> 1. Forward Pass
            </button>
            <button 
              onClick={() => setStep('backward')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${step === 'backward' ? 'bg-rose-600 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <RotateCcw className="w-4 h-4" /> 2. Backpropagation
            </button>
          </div>

          <div className="w-full max-w-md relative flex flex-col items-center flex-grow justify-center gap-8">
             <div className={`transition-all duration-500 border-2 px-8 py-4 rounded-xl shadow-lg z-10 flex flex-col items-center ${step === 'backward' ? 'bg-rose-100 border-rose-400' : 'bg-emerald-100 border-emerald-400'}`}>
                <span className={`font-bold ${step === 'backward' ? 'text-rose-800' : 'text-emerald-800'}`}>IWAE Objective L_K</span>
                <span className={`text-xs font-mono mt-1 ${step === 'backward' ? 'text-rose-600' : 'text-emerald-600'}`}>{step === 'backward' ? '∇ Gradients Flowing Back' : 'log( Average(w) )'}</span>
             </div>

             <div className="absolute inset-0 w-full h-full pointer-events-none">
                <svg className="w-full h-full">
                  <defs>
                     <marker id="arrow-down-tb" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                     </marker>
                     <marker id="arrow-up-thin-tb" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#fca5a5" />
                     </marker>
                     <marker id="arrow-up-thick-tb" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#e11d48" />
                     </marker>
                  </defs>
                  
                  {step === 'forward' ? (
                    <>
                      <path d="M 50% 25% Q 20% 50% 20% 75%" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-down-tb)" />
                      <path d="M 50% 25% L 50% 75%" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-down-tb)" />
                      <path d="M 50% 25% Q 80% 50% 80% 75%" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-down-tb)" />
                    </>
                  ) : (
                    <>
                      <path d="M 50% 25% Q 20% 50% 20% 75%" fill="none" stroke="#fca5a5" strokeWidth="2" strokeDasharray="4" markerStart="url(#arrow-up-thin-tb)" />
                      <path d="M 50% 25% L 50% 75%" fill="none" stroke="#e11d48" strokeWidth="8" markerStart="url(#arrow-up-thick-tb)" className="animate-pulse" />
                      <path d="M 50% 25% Q 80% 50% 80% 75%" fill="none" stroke="#fca5a5" strokeWidth="2" strokeDasharray="4" markerStart="url(#arrow-up-thin-tb)" />
                    </>
                  )}
                </svg>
             </div>

             <div className="flex justify-between w-full px-4 z-10 pt-16">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-100 border-2 border-slate-300 rounded-full flex items-center justify-center font-bold text-slate-500 shadow">z₁</div>
                  <div className="mt-2 bg-white px-2 py-1 border rounded text-[10px] text-center font-mono text-slate-500">w₁ = 0.02<br/>(Garbage)</div>
                  {step === 'backward' && <div className="mt-2 bg-rose-50 text-rose-500 text-[10px] font-bold px-2 py-1 border border-rose-200 rounded text-center">Gradient<br/>Scaled by 0.3%</div>}
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-100 border-4 border-emerald-500 rounded-full flex items-center justify-center font-bold text-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.5)]">z₂</div>
                  <div className="mt-2 bg-white px-2 py-1 border border-emerald-300 rounded text-xs text-center font-mono font-bold text-emerald-600">w₂ = 5.80<br/>(Lucky Hit!)</div>
                  {step === 'backward' && <div className="mt-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded text-center shadow-md animate-bounce">Gradient<br/>Scaled by 99%</div>}
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-100 border-2 border-slate-300 rounded-full flex items-center justify-center font-bold text-slate-500 shadow">z₃</div>
                  <div className="mt-2 bg-white px-2 py-1 border rounded text-[10px] text-center font-mono text-slate-500">w₃ = 0.05<br/>(Garbage)</div>
                  {step === 'backward' && <div className="mt-2 bg-rose-50 text-rose-500 text-[10px] font-bold px-2 py-1 border border-rose-200 rounded text-center">Gradient<br/>Scaled by 0.7%</div>}
                </div>
             </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 justify-center">
           <AnimatePresence mode="wait">
             {step === 'forward' ? (
               <motion.div key="forward" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 text-white h-full flex flex-col justify-center">
                 <h4 className="font-bold text-blue-400 text-xl mb-4 border-b border-slate-600 pb-2">The Setup</h4>
                 <p className="text-sm text-slate-300 leading-relaxed mb-4">
                   We draw 3 samples. Two of them missed the target completely. One of them was a lucky hit.
                 </p>
                 <p className="text-sm text-slate-300 leading-relaxed">
                   Because we average them first, the total Loss score <span className="font-mono bg-slate-700 px-1 rounded">L_K</span> is dominated almost entirely by the success of Sample 2. 
                 </p>
               </motion.div>
             ) : (
               <motion.div key="backward" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-rose-50 p-6 rounded-2xl shadow-xl border border-rose-200 h-full flex flex-col justify-center">
                 <h4 className="font-bold text-rose-800 text-xl mb-4 border-b border-rose-200 pb-2 flex items-center gap-2"><Zap className="w-5 h-5"/> The Self-Correcting Gradient</h4>
                 <p className="text-sm text-rose-900 leading-relaxed mb-4">
                   When PyTorch calculates the gradients flowing backwards to update the Encoder, it multiplies the gradient of each sample by its <strong>Relative Importance Weight</strong>.
                 </p>
                 <div className="bg-white border-l-4 border-rose-500 p-4 rounded text-sm text-slate-700 font-medium mb-4 shadow-sm">
                   The math automatically routes 99% of the learning signal through the "Lucky Hit". 
                 </div>
                 <p className="text-sm text-rose-900 leading-relaxed">
                   The Encoder gets a crystal clear message: <em>"Ignore the garbage. Sample 2 was exactly what we wanted, update your parameters to do that more often!"</em>
                 </p>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const IWAEPipelineSlide = () => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setStep((prev) => {
          if (prev >= 5) {
            setIsPlaying(false);
            return 5;
          }
          return prev + 1;
        });
      }, 2000); 
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));
  const reset = () => { setStep(0); setIsPlaying(false); };

  const stepsInfo = [
    {
      title: "1. The Input",
      desc: "The training loop begins. We feed a single data point (e.g., an image of a face) into the model.",
      icon: <ImageIcon className="w-5 h-5 text-blue-500" />
    },
    {
      title: "2. The Encoder (Approximate Posterior)",
      desc: "The Encoder network processes the image and outputs a single set of parameters: a Mean (μ) and Variance (σ). This defines our guessed distribution.",
      icon: <BrainCircuit className="w-5 h-5 text-purple-500" />
    },
    {
      title: "3. Drawing Multiple Samples",
      desc: "Using the Reparameterization Trick, we draw K independent samples (let's use K=3) from that exact same (μ, σ) distribution.",
      icon: <Layers className="w-5 h-5 text-amber-500" />
    },
    {
      title: "4. Decoding & Weighting",
      desc: "Each sample is passed to the Decoder. We calculate its Importance Weight. Notice Sample 2 is a 'lucky hit' with a massive weight, while 1 and 3 are poor guesses.",
      icon: <Calculator className="w-5 h-5 text-orange-500" />
    },
    {
      title: "5. The IWAE Objective",
      desc: "We AVERAGE the weights first (saving the batch thanks to Sample 2), and then take the logarithm. This is our final Loss Score to maximize.",
      icon: <Target className="w-5 h-5 text-emerald-500" />
    },
    {
      title: "6. Backpropagation (The Magic)",
      desc: "Gradients flow backwards! The math automatically routes ~95% of the learning signal through the 'Lucky' Sample 2. The Encoder learns to produce more samples like z₂.",
      icon: <Zap className="w-5 h-5 text-rose-500" />
    }
  ];

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The Master Pipeline: Training an IWAE</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Step through the entire process to see exactly how data flows forward, how the objective is calculated, and how the gradients flow backward to train the network.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto items-stretch flex-grow pb-8">
        <div className="flex-1 flex flex-col gap-4">
           <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 flex flex-col gap-4">
              <div className="flex justify-between items-center bg-slate-100 p-1 rounded-lg">
                <button onClick={prevStep} disabled={step === 0} className="px-3 py-2 text-slate-600 disabled:opacity-30 hover:bg-slate-200 rounded font-bold text-sm flex items-center gap-1"><ChevronLeft className="w-4 h-4"/> Prev</button>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 font-bold text-sm flex items-center gap-2">
                    {isPlaying ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>} {isPlaying ? 'Pause' : 'Auto-Play'}
                  </button>
                  <button onClick={reset} className="p-2 text-slate-500 hover:bg-slate-200 rounded" title="Reset"><RotateCcw className="w-4 h-4"/></button>
                </div>
                <button onClick={nextStep} disabled={step === 5} className="px-3 py-2 text-slate-600 disabled:opacity-30 hover:bg-slate-200 rounded font-bold text-sm flex items-center gap-1">Next <ChevronRight className="w-4 h-4"/></button>
              </div>

              <div className="flex justify-between relative px-2">
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
                <div className="absolute top-1/2 left-4 h-1 bg-indigo-500 -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }}></div>
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-colors duration-300 border-2 ${step >= i ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-400 border-slate-300'}`}>
                    {i+1}
                  </div>
                ))}
              </div>
           </div>

           <AnimatePresence mode="wait">
             <motion.div
               key={step}
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
               className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700 flex-grow flex flex-col justify-center"
             >
                <div className="flex items-center gap-3 mb-4 border-b border-slate-600 pb-3">
                  <div className="bg-slate-700 p-2 rounded-lg">{stepsInfo[step].icon}</div>
                  <h3 className="text-xl font-bold text-indigo-400">{stepsInfo[step].title}</h3>
                </div>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  {stepsInfo[step].desc}
                </p>
             </motion.div>
           </AnimatePresence>
        </div>

        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex items-center justify-center relative overflow-hidden min-h-[500px]">
           <div className="relative w-full h-[450px] max-w-lg">
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
               className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-12 bg-blue-100 border-2 border-blue-400 rounded-lg flex items-center justify-center font-bold text-blue-800 shadow z-20"
             >
               Image x
             </motion.div>

             <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
               <defs>
                 <marker id="arrow-down-p" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                   <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                 </marker>
                 <marker id="arrow-up-p" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                   <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                 </marker>
               </defs>
               {step >= 1 && <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} x1="50%" y1="48" x2="50%" y2="80" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-down-p)" />}
             </svg>

             {step >= 1 && (
               <motion.div 
                 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                 className="absolute top-[80px] left-1/2 -translate-x-1/2 w-40 py-3 bg-purple-100 border-2 border-purple-400 rounded-xl flex flex-col items-center justify-center shadow-md z-20"
               >
                 <span className="font-bold text-purple-900 text-sm">Encoder q(z|x)</span>
                 <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded mt-1 text-purple-700 border border-purple-200">Outputs: μ, σ</span>
               </motion.div>
             )}

             <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
               {step >= 2 && (
                 <>
                   <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M 50% 135 Q 20% 150 15% 190" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-down-p)" />
                   <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M 50% 135 L 50% 190" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-down-p)" />
                   <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M 50% 135 Q 80% 150 85% 190" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-down-p)" />
                 </>
               )}
             </svg>

             {step >= 2 && (
               <>
                 <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="absolute top-[190px] left-[15%] -translate-x-1/2 w-10 h-10 bg-amber-100 border-2 border-amber-400 rounded-full flex items-center justify-center font-bold text-amber-800 shadow z-20">z₁</motion.div>
                 <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="absolute top-[190px] left-[50%] -translate-x-1/2 w-12 h-12 bg-amber-200 border-2 border-amber-500 rounded-full flex items-center justify-center font-bold text-amber-900 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-20">z₂</motion.div>
                 <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="absolute top-[190px] left-[85%] -translate-x-1/2 w-10 h-10 bg-amber-100 border-2 border-amber-400 rounded-full flex items-center justify-center font-bold text-amber-800 shadow z-20">z₃</motion.div>
               </>
             )}

             <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
               {step >= 3 && (
                 <>
                   <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} x1="15%" y1="230" x2="15%" y2="260" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-down-p)" />
                   <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} x1="50%" y1="238" x2="50%" y2="260" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-down-p)" />
                   <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} x1="85%" y1="230" x2="85%" y2="260" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-down-p)" />
                 </>
               )}
             </svg>

             {step >= 3 && (
               <>
                 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-[260px] left-[15%] -translate-x-1/2 w-20 py-2 bg-orange-50 border border-orange-200 rounded flex flex-col items-center justify-center shadow-sm z-20">
                    <span className="text-[10px] font-bold text-slate-500">Weight 1</span>
                    <span className="font-mono text-sm font-bold text-rose-500">0.05</span>
                 </motion.div>
                 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-[260px] left-[50%] -translate-x-1/2 w-24 py-3 bg-orange-100 border-2 border-orange-400 rounded flex flex-col items-center justify-center shadow-md z-20">
                    <span className="text-[10px] font-bold text-slate-500">Weight 2</span>
                    <span className="font-mono text-lg font-bold text-emerald-600 animate-pulse">4.80</span>
                 </motion.div>
                 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-[260px] left-[85%] -translate-x-1/2 w-20 py-2 bg-orange-50 border border-orange-200 rounded flex flex-col items-center justify-center shadow-sm z-20">
                    <span className="text-[10px] font-bold text-slate-500">Weight 3</span>
                    <span className="font-mono text-sm font-bold text-rose-500">0.15</span>
                 </motion.div>
               </>
             )}

             <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
               {step >= 4 && (
                 <>
                   <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M 15% 305 Q 20% 340 50% 350" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-down-p)" />
                   <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M 50% 320 L 50% 350" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-down-p)" />
                   <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M 85% 305 Q 80% 340 50% 350" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-down-p)" />
                 </>
               )}
             </svg>

             {step >= 4 && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                 className="absolute top-[350px] left-1/2 -translate-x-1/2 w-64 py-3 bg-emerald-100 border-2 border-emerald-500 rounded-xl flex flex-col items-center justify-center shadow-lg z-20"
               >
                 <span className="font-bold text-emerald-900 text-sm">Objective L_K (Maximize)</span>
                 <div className="flex items-center gap-2 mt-1">
                   <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-200 font-mono text-emerald-700">log(1.66)</span>
                   <span className="font-mono font-bold text-emerald-700">= 0.51</span>
                 </div>
               </motion.div>
             )}

             {step >= 5 && (
               <svg className="absolute inset-0 w-full h-full z-30 pointer-events-none opacity-80">
                 <path d="M 50% 350 L 50% 320" fill="none" stroke="#f43f5e" strokeWidth="8" strokeDasharray="6" markerStart="url(#arrow-up-p)" className="animate-pulse" />
                 <path d="M 50% 260 L 50% 238" fill="none" stroke="#f43f5e" strokeWidth="8" strokeDasharray="6" markerStart="url(#arrow-up-p)" className="animate-pulse" />
                 <path d="M 50% 190 L 50% 135" fill="none" stroke="#f43f5e" strokeWidth="8" strokeDasharray="6" markerStart="url(#arrow-up-p)" className="animate-pulse" />
                 <path d="M 15% 260 L 15% 230" fill="none" stroke="#fca5a5" strokeWidth="2" strokeDasharray="4" markerStart="url(#arrow-up-p)" />
                 <path d="M 15% 190 Q 20% 150 50% 135" fill="none" stroke="#fca5a5" strokeWidth="2" strokeDasharray="4" markerStart="url(#arrow-up-p)" />
                 <path d="M 85% 260 L 85% 230" fill="none" stroke="#fca5a5" strokeWidth="2" strokeDasharray="4" markerStart="url(#arrow-up-p)" />
                 <path d="M 85% 190 Q 80% 150 50% 135" fill="none" stroke="#fca5a5" strokeWidth="2" strokeDasharray="4" markerStart="url(#arrow-up-p)" />
                 <path d="M 50% 80 L 50% 48" fill="none" stroke="#f43f5e" strokeWidth="8" strokeDasharray="6" markerStart="url(#arrow-up-p)" className="animate-pulse" />
               </svg>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

const MonotonicBoundSlide = () => {
  const [kSamples, setKSamples] = useState(1);
  const currentBound = -10 * Math.exp(-0.2 * kSamples);

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The Mathematical Guarantee</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          This guarantees that simply increasing K will always tighten the bound on your true likelihood.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl mx-auto items-center justify-center flex-grow pb-8">
        <div className="flex-1 w-full flex flex-col items-center">
           <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 w-full relative overflow-hidden h-72 flex items-end">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:20px_20px] opacity-50"></div>
              <div className="absolute top-12 left-0 right-0 h-1 bg-emerald-500"></div>
              <span className="absolute top-6 right-4 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">True Log p(x)</span>

              <div className="w-full flex items-end h-full px-8 pb-8 relative z-10">
                 <div className="w-full h-full relative border-l-2 border-b-2 border-slate-400">
                    <span className="absolute -bottom-6 right-0 text-[10px] font-bold text-slate-500">Number of Samples (K)</span>
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-indigo-500/20 transition-all duration-300"
                      style={{ height: `${((currentBound + 10) / 10) * 100}%` }}
                    >
                       <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>
                       <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow whitespace-nowrap">IWAE Bound L_K</span>
                    </div>
                 </div>
              </div>
           </div>
           <div className="w-full mt-8 max-w-sm">
             <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
               <span>Increase Samples (K)</span>
               <span className="font-mono text-indigo-600">K = {kSamples}</span>
             </label>
             <input type="range" min="1" max="50" step="1" value={kSamples} onChange={(e) => setKSamples(parseInt(e.target.value))} className="w-full accent-indigo-600" />
           </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
           <div className="bg-slate-800 text-white p-6 rounded-xl shadow-xl border border-slate-700">
             <h3 className="font-bold text-indigo-400 mb-4 text-xl border-b border-slate-600 pb-2">The Limit Theorem</h3>
             <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center font-bold text-indigo-300 shrink-0">1</div>
                  <p>When K = 1, the IWAE objective is literally exactly identical to the standard VAE ELBO.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center font-bold text-indigo-300 shrink-0">2</div>
                  <p>As you drag the slider right, the bound physically pushes upwards, getting tighter and tighter.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center font-bold text-indigo-300 shrink-0">3</div>
                  <p>If K → ∞, the bound perfectly equals the True Log-Likelihood! The "gap" vanishes.</p>
                </li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

const ComputationalCostSlide = () => {
  const [kSamples, setKSamples] = useState(5);
  
  // Cost scales linearly, bound tightness scales logarithmically/asymptotically
  const computeCost = (kSamples / 50) * 100; 
  const boundTightness = 100 - (100 / (kSamples * 1.5));

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Computational Cost & Trade-offs</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          There is no free lunch. Sampling K times means we have to run the Decoder K times for <em>every single data point</em>. Let's look at how K affects the hardware.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto items-stretch flex-grow pb-8">
        
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex flex-col items-center">
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Cpu className="w-5 h-5"/> GPU Bottleneck</h3>
           
           <div className="w-full bg-slate-900 rounded-xl p-4 flex gap-2 flex-wrap items-center justify-center content-start h-48 overflow-hidden shadow-inner border-2 border-slate-700 relative">
             {Array.from({ length: kSamples }).map((_, i) => (
                <div key={i} className="w-8 h-8 bg-sky-500 rounded border border-sky-300 flex items-center justify-center text-white text-[10px] font-bold shadow-md animate-pulse">
                  D
                </div>
             ))}
             {kSamples > 30 && (
               <div className="absolute bottom-2 bg-slate-800/80 px-3 py-1 rounded text-xs text-white font-mono border border-slate-600">Running {kSamples} Decoder Passes</div>
             )}
           </div>

           <div className="w-full mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-rose-500"/> Compute Time (Linear)</span>
                  <span className="text-rose-600">{kSamples}x slower</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${computeCost}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span className="flex items-center gap-1"><Gauge className="w-4 h-4 text-emerald-500"/> Bound Tightness (Diminishing Returns)</span>
                  <span className="text-emerald-600">{boundTightness.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${boundTightness}%` }}></div>
                </div>
              </div>
           </div>

           <div className="w-full mt-8 max-w-sm">
             <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
               <span>Adjust K Samples</span>
               <span className="font-mono text-indigo-600">K = {kSamples}</span>
             </label>
             <input type="range" min="1" max="50" step="1" value={kSamples} onChange={(e) => setKSamples(parseInt(e.target.value))} className="w-full accent-indigo-600" />
           </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
           <div className="bg-slate-800 text-white p-6 rounded-xl shadow-xl border border-slate-700">
             <h4 className="font-bold text-indigo-400 text-xl mb-4 border-b border-slate-600 pb-2">Strategic Choices for K</h4>
             
             <div className="space-y-4">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                   <strong className="text-amber-400 block mb-1">Small K (e.g., 5 to 10) → For Training</strong>
                   <p className="text-sm text-slate-300">Offers a significant improvement over standard VAEs (K=1) without completely destroying training time. The diminishing returns curve shoots up quickly here.</p>
                </div>
                
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                   <strong className="text-emerald-400 block mb-1">Large K (e.g., 50 to 5000) → For Evaluation</strong>
                   <p className="text-sm text-slate-300">When you finish training and want to test how good your model actually is, you crank K to a massive number to get an ultra-tight estimate of the true Log-Likelihood.</p>
                </div>
             </div>
           </div>

           <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-sm mt-auto">
             <h4 className="font-bold text-orange-800 text-sm flex items-center gap-2"><Scale className="w-4 h-4" /> Gradient Variance</h4>
             <p className="text-xs text-orange-900 mt-1">
               When K is extremely large, the importance weights can become highly skewed. This can cause unstable gradients during backpropagation. The <strong>Reparameterization Trick</strong> is completely mandatory to keep this variance under control!
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const LogSumExpSlide = () => {
  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto bg-slate-900 text-slate-200">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Training: The LogSumExp Trick</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          In practice, working with raw probabilities causes catastrophic computer errors. We must perform all math in <strong>Log-Space</strong>.
        </p>
      </div>

      <div className="flex flex-col items-center max-w-5xl mx-auto w-full flex-grow pb-8 gap-8">
        
        <div className="w-full bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-600">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Terminal className="w-4 h-4"/> 1. The Unnormalized Log-Weight</h3>
           
           <p className="text-sm text-slate-300 mb-6">Instead of calculating raw probabilities (which multiply), we calculate the <strong>logarithms</strong> of the probabilities (which add and subtract). This is vastly more numerically stable.</p>

           <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 font-mono text-sm md:text-xl bg-slate-900 py-6 px-4 rounded-xl border border-slate-700 shadow-inner">
             <span className="text-white font-bold whitespace-nowrap">log w_k = </span>
             
             <div className="flex flex-wrap items-center justify-center gap-2">
               <div className="bg-sky-500/20 text-sky-300 px-3 py-2 rounded border border-sky-500/50 flex flex-col items-center">
                 <span>log p_θ(x|z_k)</span>
                 <span className="text-[10px] text-sky-400 uppercase tracking-widest mt-1">Decoder</span>
               </div>
               <span className="text-white">+</span>
               <div className="bg-rose-500/20 text-rose-300 px-3 py-2 rounded border border-rose-500/50 flex flex-col items-center">
                 <span>log p(z_k)</span>
                 <span className="text-[10px] text-rose-400 uppercase tracking-widest mt-1">Prior</span>
               </div>
               <span className="text-white">-</span>
               <div className="bg-purple-500/20 text-purple-300 px-3 py-2 rounded border border-purple-500/50 flex flex-col items-center">
                 <span>log q_φ(z_k|x)</span>
                 <span className="text-[10px] text-purple-400 uppercase tracking-widest mt-1">Encoder</span>
               </div>
             </div>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
           
           <div className="flex-1 bg-rose-900/30 border border-rose-500/50 p-6 rounded-xl shadow-inner relative">
             <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">The Underflow Problem</div>
             <h4 className="text-lg font-bold text-rose-300 mb-2 flex items-center gap-2"><ShieldAlert className="w-5 h-5"/> Why log(sum(exp()))?</h4>
             
             <p className="text-sm text-rose-200/80 leading-relaxed mb-4">
               The IWAE objective requires us to <em>add up</em> the raw weights before logging them. To get the raw weight, we would have to calculate the exponent of our log-weight.
             </p>
             
             <div className="bg-slate-900 p-4 rounded border border-rose-500/30 font-mono text-xs text-rose-300 shadow-md">
               <div className="text-slate-500 mb-1">// If a model is uncertain, the log-weight is very negative:</div>
               <div>log w_1 = -1200</div>
               <div className="mt-2 text-slate-500 mb-1">// Converting back to raw weight causes Computer Underflow:</div>
               <div>Math.exp(-1200) <span className="text-white">===</span> <span className="text-rose-500 font-bold bg-rose-500/20 px-1 rounded">0</span></div>
               <div className="mt-2 text-slate-500 mb-1">// The gradients instantly die!</div>
               <div>log(0 + 0) <span className="text-white">===</span> <span className="text-rose-500 font-bold bg-rose-500/20 px-1 rounded">-Infinity</span></div>
             </div>
           </div>

           <div className="flex-1 bg-emerald-900/30 border border-emerald-500/50 p-6 rounded-xl shadow-inner relative">
             <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">The Solution</div>
             <h4 className="text-lg font-bold text-emerald-300 mb-2">The LogSumExp Trick</h4>
             
             <p className="text-sm text-emerald-200/80 leading-relaxed mb-4">
               To prevent exp(-1200) from turning into `0`, the LogSumExp trick finds the <strong>maximum</strong> value among all K samples, pulls it out of the exponent, and calculates the rest relative to that max!
             </p>

             <div className="bg-slate-900 p-4 rounded border border-emerald-500/30 font-mono text-xs text-emerald-300 shadow-md">
               <div className="text-slate-500 mb-1">// E.g., log w_1 = -1200, log w_2 = -1205</div>
               <div className="text-slate-500 mb-1">// 1. Find Max (m = -1200)</div>
               <div className="text-slate-500 mt-2 mb-1">// 2. Calculate safely:</div>
               <div className="text-white bg-slate-800 p-2 rounded mb-2">
                 m + log( sum( exp(log w_k - m) ) )
               </div>
               <div className="text-emerald-400">
                 = -1200 + log( exp(0) + exp(-5) )<br/>
                 = -1200 + log( 1 + 0.0067 )<br/>
                 = <span className="font-bold bg-emerald-500/20 px-1 rounded">-1199.993</span> <span className="text-emerald-500">// Saved from -Infinity!</span>
               </div>
             </div>
           </div>

        </div>

      </div>
    </div>
  );
};

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    JargonDecoderSlide,
    GapProofSlide,
    AnatomyOfWeightSlide,
    IntuitionSlide,
    AveragingMathSlide,
    JensensMathSlide,
    WhyItWorksSlide,
    IWAEFlowchartSlide,
    TrainingBenefitSlide,
    IWAEPipelineSlide,
    MonotonicBoundSlide,
    ComputationalCostSlide,
    LogSumExpSlide
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="flex flex-col min-h-full bg-slate-50 font-sans">
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
          className="p-3 rounded-full bg-gray-100 text-blue-600 hover:bg-blue-50 shadow-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex space-x-3">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-blue-600 scale-150' : 'bg-gray-300'}`}
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
  title: "Importance Weighted Autoencoders",
  subtitle: "Visualizing the IWAE Objective, Jensen's Inequality, and Architecture."
};

export default function App() {
  return (
    <Slideshow />
  );
}