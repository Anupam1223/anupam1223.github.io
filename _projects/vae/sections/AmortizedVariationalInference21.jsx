import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Zap, Target, 
  Layers, Combine, Split, Database, Clock, 
  Activity, AlertTriangle, Minimize2, Maximize2,
  Cpu, RotateCcw, Box, ArrowRight, ArrowDown,
  BrainCircuit, Crosshair, HelpCircle, Network,
  XCircle, CheckCircle, Grid, Scissors
} from 'lucide-react';

// --- SLIDE 1: The Core Concept (Classical vs Amortized) ---
const ClassicalVsAmortizedSlide = () => {
  const [mode, setMode] = useState('classical'); // 'classical' or 'amortized'

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The Paradigm Shift: What is "Amortized"?</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          To understand VAEs, you must understand how they handle inference. The term <strong>"Amortized"</strong> means we are spreading the computational cost of inference across the entire dataset by using a shared Neural Network.
        </p>
      </div>

      <div className="flex justify-center mb-6 w-full max-w-2xl mx-auto">
        <div className="flex bg-slate-200 p-1 rounded-xl w-full shadow-inner border border-slate-300">
           <button onClick={() => setMode('classical')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${mode === 'classical' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-300/50'}`}>
             <Clock className="w-4 h-4"/> Classical VI (Slow & Independent)
           </button>
           <button onClick={() => setMode('amortized')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${mode === 'amortized' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-300/50'}`}>
             <Zap className="w-4 h-4"/> Amortized VI (Fast & Shared)
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Visualizer */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col relative overflow-hidden items-center justify-center min-h-[400px]">
           <AnimatePresence mode="wait">
             
             {mode === 'classical' && (
               <motion.div key="classical" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full gap-8">
                  <div className="flex justify-around w-full max-w-lg">
                    {['Image 1', 'Image 2', 'Image 3'].map((img, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-500">x_{i+1}</div>
                        <ArrowDown className="text-slate-400 w-5 h-5" />
                        <div className="w-20 h-20 bg-rose-50 border-2 border-rose-300 rounded-full flex flex-col items-center justify-center shadow-inner relative">
                          <RotateCcw className="absolute text-rose-300/50 w-12 h-12 animate-spin-slow" />
                          <span className="text-[10px] font-bold text-rose-800 z-10 text-center leading-tight">Iterative<br/>Optimization</span>
                        </div>
                        <ArrowDown className="text-slate-400 w-5 h-5" />
                        <div className="bg-amber-100 border border-amber-400 p-2 rounded text-[10px] font-mono font-bold text-amber-800 text-center">
                          Post. {i+1}<br/>q(z|x_{i+1})
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm p-4 rounded-xl w-full max-w-lg text-center shadow-sm">
                    <strong>The Problem:</strong> Every single data point requires its own separate, time-consuming optimization loop to find its specific latent parameters. This doesn't scale to millions of images!
                  </div>
               </motion.div>
             )}

             {mode === 'amortized' && (
               <motion.div key="amortized" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full gap-6">
                  
                  {/* Data Points Box */}
                  <div className="border-2 border-slate-300 rounded-xl p-4 w-full max-w-lg flex flex-col items-center relative">
                    <span className="absolute -top-3 bg-white px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Data Points</span>
                    <div className="flex justify-around w-full">
                      {['x_1', 'x_2', 'x_...'].map((txt, i) => (
                        <div key={i} className="w-16 h-12 bg-blue-100 border-2 border-blue-400 rounded-lg flex items-center justify-center font-bold font-mono text-blue-800 shadow-sm">{txt}</div>
                      ))}
                    </div>
                  </div>

                  <div className="flex w-full max-w-lg justify-around px-8">
                     <ArrowDown className="text-slate-400 w-5 h-5" />
                     <ArrowDown className="text-slate-400 w-5 h-5" />
                     <ArrowDown className="text-slate-400 w-5 h-5" />
                  </div>

                  {/* Inference Network (The Encoder) */}
                  <div className="w-full max-w-md bg-emerald-100 border-2 border-emerald-500 rounded-[100%] py-8 flex flex-col items-center shadow-[0_0_20px_rgba(16,185,129,0.3)] z-10 relative">
                    <BrainCircuit className="w-8 h-8 text-emerald-600 mb-2 opacity-50 absolute left-10" />
                    <span className="font-bold text-emerald-900">Inference Network</span>
                    <span className="font-mono text-xs text-emerald-800 mt-1">q_φ(z|x)</span>
                    <span className="text-[10px] text-emerald-700 mt-1">(Shared Parameters φ)</span>
                  </div>

                  <div className="flex w-full max-w-lg justify-around px-8 relative">
                     <div className="flex flex-col items-center"><span className="text-[8px] text-slate-400 mb-1">maps to</span><ArrowDown className="text-slate-400 w-5 h-5" /></div>
                     <div className="flex flex-col items-center"><span className="text-[8px] text-slate-400 mb-1">maps to</span><ArrowDown className="text-slate-400 w-5 h-5" /></div>
                     <div className="flex flex-col items-center"><span className="text-[8px] text-slate-400 mb-1">maps to</span><ArrowDown className="text-slate-400 w-5 h-5 border-l-2 border-dashed border-slate-400 bg-transparent" /></div>
                  </div>

                  {/* Approximate Posteriors Box */}
                  <div className="border-2 border-slate-300 rounded-xl p-4 w-full max-w-lg flex flex-col items-center relative">
                    <span className="absolute -top-3 bg-white px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Approximate Posteriors</span>
                    <div className="flex justify-around w-full">
                      {['x_1', 'x_2', 'x_...'].map((txt, i) => (
                        <div key={i} className="w-24 h-20 bg-amber-100 border-2 border-amber-400 rounded flex flex-col items-center justify-center shadow-sm relative">
                           <div className="absolute top-0 right-0 w-3 h-3 bg-amber-200 border-l border-b border-amber-400 rounded-bl"></div>
                           <span className="text-[8px] font-bold text-amber-900 mb-1 text-center">Parameters for<br/>q_φ(z|{txt})</span>
                           <span className="text-[9px] font-mono text-amber-700">(μ, σ)</span>
                        </div>
                      ))}
                    </div>
                  </div>

               </motion.div>
             )}

           </AnimatePresence>
        </div>

        {/* Info Box */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700 h-full flex flex-col justify-center">
             {mode === 'classical' ? (
               <>
                 <h4 className="font-bold text-rose-400 text-xl mb-4 flex items-center gap-2"><Clock className="w-6 h-6"/> Classical VI</h4>
                 <p className="text-sm text-slate-300 leading-relaxed mb-4">
                   In Classical Variational Inference, if you have 10,000 images, you have to individually optimize 10,000 separate sets of latent parameters. 
                 </p>
                 <p className="text-sm text-slate-300 leading-relaxed">
                   When a new, unseen image arrives, you can't just process it. You have to start a brand new, slow optimization routine just for that image.
                 </p>
               </>
             ) : (
               <>
                 <h4 className="font-bold text-emerald-400 text-xl mb-4 flex items-center gap-2"><Zap className="w-6 h-6"/> Amortized VI (The Encoder)</h4>
                 <p className="text-sm text-slate-300 leading-relaxed mb-4">
                   In Amortized VI, we train <strong>one single Neural Network (the Encoder)</strong> parameterized by <span className="font-mono text-emerald-300">φ</span>. 
                 </p>
                 <p className="text-sm text-slate-300 leading-relaxed">
                   Instead of optimizing parameters for each image, we optimize the network's weights. The network learns a <em>global mapping function</em> from any input <span className="font-mono text-emerald-300">x</span> directly to its latent parameters. This is what makes VAEs possible!
                 </p>
               </>
             )}
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 2: The Strengths ---
const StrengthsSlide = () => {
  const strengths = [
    {
      title: "1. Efficiency at Inference Time",
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      desc: "This is a massive practical benefit. Once the inference network (Encoder) is trained, getting the posterior for a new, unseen data point is lightning fast.",
      highlight: "It only takes a single forward pass (O(1) time) through the neural network.",
      color: "border-yellow-500 bg-yellow-50"
    },
    {
      title: "2. Scalability to Large Datasets",
      icon: <Database className="w-6 h-6 text-blue-500" />,
      desc: "Because the parameters (φ) of the inference network are shared across all data points, it scales perfectly.",
      highlight: "We can use Stochastic Gradient Descent (SGD) on minibatches! We don't need the whole dataset in memory.",
      color: "border-blue-500 bg-blue-50"
    },
    {
      title: "3. Deep Learning Integration",
      icon: <Network className="w-6 h-6 text-purple-500" />,
      desc: "Amortized inference aligns perfectly with modern deep learning. We can use powerful, pre-existing architectures.",
      highlight: "We can use CNNs for images, or RNNs/Transformers for sequences, as the backbone of our q_φ(z|x) network.",
      color: "border-purple-500 bg-purple-50"
    },
    {
      title: "4. Joint Optimization",
      icon: <Combine className="w-6 h-6 text-emerald-500" />,
      desc: "The Encoder (φ) and Decoder (θ) are trained simultaneously, dancing together to maximize the ELBO.",
      highlight: "They co-adapt. The Encoder learns what features the Decoder needs, and the Decoder learns to read the Encoder's specific mapping.",
      color: "border-emerald-500 bg-emerald-50"
    }
  ];

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Strengths of Amortized Inference</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Why has Amortized Variational Inference become the de facto standard for VAEs? It offers compelling advantages that make training generative models on massive datasets viable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full flex-grow pb-8">
        {strengths.map((s, i) => (
          <div key={i} className={`p-6 rounded-2xl shadow-lg border-l-8 flex flex-col ${s.color} text-slate-800 hover:-translate-y-1 transition-transform`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold">{s.title}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed flex-grow">{s.desc}</p>
            <div className="mt-4 bg-white/60 p-3 rounded-lg border border-slate-200/50 text-xs font-semibold text-slate-800 shadow-inner">
              {s.highlight}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SLIDE 3: Weakness 1 - The Amortization Gap ---
const AmortizationGapSlide = () => {
  const [showGap, setShowGap] = useState(false);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Weakness 1: The Amortization Gap</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Sharing parameters across the entire dataset makes inference fast, but it severely limits the <strong>expressiveness</strong> of the approximate posterior. One network has to learn a "good enough" mapping for <em>everything</em>.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Visualizer */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col items-center justify-center relative overflow-hidden">
           
           <div className="flex items-center justify-center w-full gap-8 relative z-10">
              
              {/* True Optimal (Custom Suit) */}
              <div className="flex flex-col items-center">
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Individual Optimization<br/>(The "Custom Suit")</span>
                 <div className="w-32 h-32 bg-slate-50 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center relative">
                    <Target className="absolute text-slate-200 w-24 h-24" />
                    {/* Perfect Hit */}
                    <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] z-10"></div>
                 </div>
                 <span className="font-mono text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded mt-4 border border-emerald-200">Optimal q*(z|x_i)</span>
                 <p className="text-[9px] text-slate-400 mt-2 text-center max-w-[120px]">Perfect fit for this specific data point, but took forever to compute.</p>
              </div>

              {/* The Gap */}
              <div className="flex flex-col items-center justify-center w-24">
                 <AnimatePresence>
                   {showGap && (
                     <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                       <span className="text-rose-500 font-bold text-sm uppercase tracking-widest">The Gap</span>
                       <ArrowRight className="w-8 h-8 text-rose-400" />
                       <span className="text-[10px] text-slate-500 text-center leading-tight mt-1">Loss of ELBO<br/>Accuracy</span>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              {/* Amortized (Off the rack) */}
              <div className="flex flex-col items-center">
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Amortized Network<br/>(The "Off-The-Rack Suit")</span>
                 <div className="w-32 h-32 bg-slate-50 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center relative">
                    <Target className="absolute text-slate-200 w-24 h-24" />
                    {/* Off-center Hit */}
                    <motion.div 
                      animate={{ x: showGap ? 20 : 0, y: showGap ? -15 : 0 }}
                      className={`w-4 h-4 rounded-full z-10 transition-colors duration-500 ${showGap ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : 'bg-indigo-500 shadow-[0_0_15px_#6366f1]'}`}
                    ></motion.div>
                 </div>
                 <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded mt-4 border transition-colors ${showGap ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-indigo-600 bg-indigo-50 border-indigo-200'}`}>Amortized q_φ(z|x_i)</span>
                 <p className="text-[9px] text-slate-400 mt-2 text-center max-w-[120px]">Calculated instantly, but slightly "off" because the network had to compromise for all data points.</p>
              </div>

           </div>

           <button 
             onClick={() => setShowGap(!showGap)}
             className={`mt-10 px-8 py-3 rounded-full font-bold shadow-md transition-all flex items-center gap-2 ${showGap ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-rose-600 text-white hover:bg-rose-700'}`}
           >
             {showGap ? <Minimize2 className="w-5 h-5"/> : <Maximize2 className="w-5 h-5"/>}
             {showGap ? 'Hide Gap' : 'Reveal the Amortization Gap'}
           </button>
        </div>

        {/* Explanation */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700">
             <h4 className="font-bold text-rose-400 text-xl mb-4 border-b border-slate-600 pb-2 flex items-center gap-2">
               <Split className="w-5 h-5"/> What is the Gap?
             </h4>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               The Amortization Gap is the difference between the <strong>best possible ELBO</strong> we could achieve if we optimized each point perfectly, and the <strong>actual ELBO</strong> we get from our shared Encoder network.
             </p>
             <div className="bg-black/30 border border-slate-600 p-4 rounded-xl font-mono text-xs text-rose-300 mb-4 shadow-inner text-center">
               Gap = Max_ELBO - Amortized_ELBO
             </div>
             <p className="text-sm text-slate-300 leading-relaxed">
               Because the network is just a generalized function, its outputs might be too restrictive. A large gap means our ELBO is a very loose (poor) bound on the true log-likelihood, degrading generation quality.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 4: Weakness 2 - The Mean-Field Assumption ---
const MeanFieldSlide = () => {
  const [showConstraint, setShowConstraint] = useState(false);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Weakness 2: The Mean-Field Assumption</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          You asked: <em>"How does a standard VAE force the distribution to be factorized?"</em> It all comes down to what we tell the Neural Network to output. We intentionally limit its output neurons to save computation time!
        </p>
      </div>

      <div className="flex justify-center mb-6 w-full max-w-2xl mx-auto relative z-20">
        <div className="flex bg-slate-200 p-1 rounded-xl w-full shadow-inner border border-slate-300">
           <button onClick={() => setShowConstraint(false)} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${!showConstraint ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
             <Grid className="w-4 h-4"/> 1. The True Reality (Correlated)
           </button>
           <button onClick={() => setShowConstraint(true)} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${showConstraint ? 'bg-rose-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
             <Scissors className="w-4 h-4"/> 2. The VAE "Mean-Field" Constraint
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Visualizer */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
           
           <AnimatePresence mode="wait">
             
             {!showConstraint ? (
               <motion.div key="reality" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col w-full h-full justify-center gap-8">
                 
                 <div className="flex items-center justify-around w-full">
                    {/* The Output Matrix */}
                    <div className="flex flex-col items-center">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">What the math requires<br/>(Full Covariance Matrix)</span>
                       <div className="bg-blue-50 border-2 border-blue-400 p-4 rounded-xl shadow-inner grid grid-cols-2 grid-rows-2 gap-2 relative">
                          <div className="w-12 h-10 bg-blue-200 rounded flex items-center justify-center font-mono text-xs font-bold text-blue-800">Var(z₁)</div>
                          <div className="w-12 h-10 bg-purple-200 rounded flex flex-col items-center justify-center font-mono text-[9px] font-bold text-purple-800 leading-tight">Cov<br/>(z₁,z₂)</div>
                          <div className="w-12 h-10 bg-purple-200 rounded flex flex-col items-center justify-center font-mono text-[9px] font-bold text-purple-800 leading-tight">Cov<br/>(z₂,z₁)</div>
                          <div className="w-12 h-10 bg-blue-200 rounded flex items-center justify-center font-mono text-xs font-bold text-blue-800">Var(z₂)</div>
                       </div>
                    </div>

                    <ArrowRight className="w-8 h-8 text-slate-300" />

                    {/* The 2D Shape */}
                    <div className="flex flex-col items-center relative">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">The Resulting Shape<br/>(Tilted & Correlated)</span>
                       <div className="w-40 h-40 bg-slate-900 rounded-xl relative overflow-hidden shadow-lg border-2 border-slate-700">
                          <div className="absolute top-1/2 left-1/2 w-32 h-12 bg-blue-500/60 rounded-full blur-[2px] transform -translate-x-1/2 -translate-y-1/2 -rotate-45 border-2 border-blue-400"></div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-sm text-blue-900 leading-relaxed text-center shadow-sm">
                   In reality, features interact. E.g., If <span className="font-mono font-bold">z₁</span> is "Hair Length", and <span className="font-mono font-bold">z₂</span> is "Curliness", they might be correlated. A long hair is more likely to curl. To draw this tilted relationship, the network MUST calculate the <strong>Covariance</strong> (the purple boxes).
                 </div>

               </motion.div>
             ) : (
               <motion.div key="meanfield" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col w-full h-full justify-center gap-8">
                 
                 <div className="flex items-center justify-around w-full">
                    {/* The Output Matrix */}
                    <div className="flex flex-col items-center relative">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">What the VAE outputs<br/>(Diagonal Matrix Only)</span>
                       <div className="bg-rose-50 border-2 border-rose-400 p-4 rounded-xl shadow-inner grid grid-cols-2 grid-rows-2 gap-2 relative">
                          <div className="w-12 h-10 bg-rose-200 rounded flex items-center justify-center font-mono text-xs font-bold text-rose-800">Var(z₁)</div>
                          <div className="w-12 h-10 bg-slate-200 rounded flex items-center justify-center font-mono text-xs font-bold text-slate-400">0</div>
                          <div className="w-12 h-10 bg-slate-200 rounded flex items-center justify-center font-mono text-xs font-bold text-slate-400">0</div>
                          <div className="w-12 h-10 bg-rose-200 rounded flex items-center justify-center font-mono text-xs font-bold text-rose-800">Var(z₂)</div>
                       </div>
                       <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-4 -right-4 bg-rose-600 text-white text-[9px] font-bold px-2 py-1 rounded shadow transform rotate-12">Forced to 0!</motion.div>
                    </div>

                    <ArrowRight className="w-8 h-8 text-slate-300" />

                    {/* The 2D Shape */}
                    <div className="flex flex-col items-center relative">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">The Resulting Shape<br/>(Axis-Aligned / Independent)</span>
                       <div className="w-40 h-40 bg-slate-900 rounded-xl relative overflow-hidden shadow-lg border-2 border-slate-700 flex items-center justify-center">
                          {/* Ghost of reality */}
                          <div className="absolute top-1/2 left-1/2 w-32 h-12 border-2 border-dashed border-blue-500/40 rounded-full transform -translate-x-1/2 -translate-y-1/2 -rotate-45 pointer-events-none"></div>
                          {/* The restricted output */}
                          <div className="w-24 h-24 bg-rose-500/60 rounded-full blur-[2px] border-2 border-rose-400"></div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-sm text-rose-900 leading-relaxed text-center shadow-sm">
                   <strong>"Factorized" just means "Independent".</strong> Calculating a full covariance matrix for 100 dimensions takes massive computational power. So, standard VAE Encoders literally do not have the output neurons for it! They are forced to output zeros for interactions. Because it cannot tilt, it is forced to draw an upright "dumbed down" bubble to cover the true shape.
                 </div>

               </motion.div>
             )}

           </AnimatePresence>

        </div>

        {/* Explanation */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           
           <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 text-white">
             <h4 className="font-bold text-indigo-400 text-lg mb-2">What does "Factorized" mean?</h4>
             <div className="font-mono text-sm bg-slate-900 p-3 rounded-lg border border-slate-600 text-slate-300 text-center mb-4 shadow-inner">
               q(z₁, z₂) = q(z₁) × q(z₂)
             </div>
             <p className="text-sm text-slate-300 leading-relaxed">
               In probability, if two things are independent (factorized), their combined probability is just their individual probabilities multiplied together. 
               <br/><br/>
               By hard-coding our Encoder to only output individual variances (and no covariances), we force the math into this exact equation.
             </p>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-grow">
             <h4 className="font-bold text-rose-600 text-lg mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> The Amortization Gap</h4>
             <p className="text-sm text-slate-700 leading-relaxed">
               Because the VAE is forced to draw an upright bubble, it will <em>never</em> perfectly match a tilted reality. 
             </p>
             <p className="text-sm text-slate-700 leading-relaxed mt-2">
               This mismatch is a major source of the "Amortization Gap". The VAE knows the true shape is tilted, but it physically lacks the mathematical tools to express it, leading to a looser ELBO and blurry generations.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 5: Weakness 3 - Posterior Collapse & Uncertainty ---
const PosteriorCollapseSlide = () => {
  const [decoderPower, setDecoderPower] = useState(50); // 0 = Weak, 100 = Autoregressive/Too Strong

  const isCollapsed = decoderPower > 80;

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">Weakness 3: Posterior Collapse & Optimization</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Joint optimization of the Encoder and Decoder is complex and non-convex. If the Decoder is too powerful, the model finds a lazy sub-optimal solution: <strong>Posterior Collapse</strong>.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Simulator */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col relative overflow-hidden">
           
           <div className="flex-grow flex flex-col justify-center gap-8 relative z-10">
              
              <div className="flex items-center justify-between w-full">
                
                {/* Encoder */}
                <div className="flex flex-col items-center w-1/3">
                  <div className="w-16 h-16 bg-blue-100 border-2 border-blue-500 rounded-xl flex items-center justify-center font-bold text-blue-800 mb-2 shadow-sm">Encoder</div>
                </div>
                
                {/* Latent Space */}
                <div className="flex-1 flex flex-col items-center px-2">
                  <span className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">Latent (Z)</span>
                  <div className={`w-full h-8 flex items-center justify-center transition-all duration-500 ${isCollapsed ? 'opacity-20' : 'opacity-100'}`}>
                     <div className="w-full h-1 bg-slate-300 relative rounded-full">
                       <motion.div animate={{ left: ['0%', '100%'] }} transition={{ duration: 1, repeat: Infinity }} className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
                     </div>
                  </div>
                  {isCollapsed && <span className="text-[10px] font-bold text-rose-600 mt-2 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Ignored!</span>}
                </div>

                {/* Decoder */}
                <div className="flex flex-col items-center w-1/3">
                  <div className={`transition-all duration-500 border-2 rounded-xl flex items-center justify-center font-bold mb-2 shadow-lg ${decoderPower > 80 ? 'w-24 h-24 bg-rose-100 border-rose-500 text-rose-900' : 'w-16 h-16 bg-indigo-100 border-indigo-500 text-indigo-900'}`}>
                    Decoder
                  </div>
                </div>
              </div>

              <div className="w-full bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner mt-4">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                  <span>Standard Decoder</span>
                  <span className={isCollapsed ? 'text-rose-600' : ''}>Overpowered Decoder</span>
                </div>
                <input type="range" min="0" max="100" value={decoderPower} onChange={(e) => setDecoderPower(parseInt(e.target.value))} className="w-full accent-indigo-600" />
                <p className="text-[10px] text-slate-500 text-center mt-3">Slide to increase Decoder capacity (e.g. using an Autoregressive Model)</p>
              </div>

           </div>
        </div>

        {/* Explanations */}
        <div className="flex-1 flex flex-col gap-4">
           
           <AnimatePresence mode="wait">
             {isCollapsed ? (
               <motion.div key="collapse" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-2xl shadow-sm h-full flex flex-col justify-center">
                 <h4 className="font-bold text-rose-900 mb-3 text-xl flex items-center gap-2"><AlertTriangle className="w-6 h-6"/> Posterior Collapse</h4>
                 <p className="text-sm text-rose-800 leading-relaxed mb-4">
                   Because the Decoder is so powerful, it doesn't <em>need</em> the latent code <span className="font-mono">z</span> to reconstruct the image. It ignores it!
                 </p>
                 <p className="text-sm text-rose-800 leading-relaxed">
                   To aggressively minimize the KL Divergence penalty in the ELBO, the Encoder just learns to output the exact prior <span className="font-mono font-bold bg-white px-1 rounded">p(z)</span> for every single input. The latent variables become completely uninformative and useless for representation learning.
                 </p>
               </motion.div>
             ) : (
               <motion.div key="healthy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-2xl shadow-sm h-full flex flex-col justify-center">
                 <h4 className="font-bold text-emerald-900 mb-3 text-xl flex items-center gap-2"><Activity className="w-6 h-6"/> Healthy Optimization</h4>
                 <p className="text-sm text-emerald-800 leading-relaxed mb-4">
                   The Decoder relies on the latent code <span className="font-mono">z</span> to know what image to draw. The Encoder successfully maps data into meaningful, distinct regions in the latent space.
                 </p>
                 <p className="text-sm text-emerald-800 leading-relaxed">
                   There is a constant tug-of-war between Reconstruction Quality and the KL Divergence penalty, finding a balanced, informative representation.
                 </p>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="bg-slate-800 text-white p-5 rounded-2xl shadow-sm border border-slate-700">
             <h4 className="font-bold text-indigo-400 text-sm mb-2 flex items-center gap-2"><HelpCircle className="w-4 h-4"/> Other Weaknesses</h4>
             <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
               <li><strong>Fixed Uncertainty:</strong> The encoder maps <span className="font-mono text-blue-300">x</span> deterministically to parameters (μ, σ). This fixed mapping might struggle if the true uncertainty varies drastically depending on the input.</li>
               <li><strong>Training Overhead:</strong> Adding an inference network means more parameters to train, leading to higher memory and compute costs during the training phase.</li>
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
    ClassicalVsAmortizedSlide,
    StrengthsSlide,
    AmortizationGapSlide,
    MeanFieldSlide,
    PosteriorCollapseSlide
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