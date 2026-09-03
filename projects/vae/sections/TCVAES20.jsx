import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Calculator, 
  ArrowLeft, ArrowRight, Target, CheckCircle, 
  AlertTriangle, BrainCircuit, Scale, ArrowDown, Activity, 
  Layers, Shuffle, Link, Unlink, Box, Database,
  Split, Network, Hammer, Search, Eye,
  BarChart, Grid, GitCommit, FileQuestion, Cpu, HelpCircle, Swords, Dices,
  Users, SlidersHorizontal, Share2, Plus, ArrowRightLeft,
  BookOpen, Lightbulb, Settings2, UnfoldVertical, Lock
} from 'lucide-react';

const TheSledgehammerSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">Beta-VAE vs. Factor/TC-VAE</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Why do we need complex new models when <strong>β-VAE</strong> already exists? Because cranking up β is like using a <strong>Sledgehammer</strong> to solve a delicate problem.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* The Sledgehammer */}
        <div className="flex-1 bg-rose-950/20 rounded-2xl shadow-xl border-2 border-rose-500/50 p-8 flex flex-col items-center relative overflow-hidden">
           <div className="absolute top-0 left-0 right-0 h-2 bg-rose-500"></div>
           <Hammer className="w-16 h-16 text-rose-500 mb-6" />
           <h3 className="text-2xl font-bold text-rose-400 mb-2">The β-VAE Sledgehammer</h3>
           <p className="text-sm text-slate-300 text-center mb-6">
             Beta-VAE applies a heavy penalty (β &gt; 1) to the <em>entire</em> KL Divergence term uniformly.
           </p>
           <div className="bg-slate-900 border border-rose-500/50 p-4 rounded-xl w-full mt-auto">
             <div className="text-rose-300 font-bold text-sm mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> The Unintended Damage:</div>
             <ul className="text-xs text-slate-400 space-y-3 list-disc pl-4">
               <li>Crushes the Total Correlation (Good! Disentangles).</li>
               <li><strong className="text-rose-400">Also crushes Mutual Information!</strong> (Bad! Destroys reconstruction quality, making images blurry).</li>
             </ul>
           </div>
        </div>

        {/* The Scalpel */}
        <div className="flex-1 bg-blue-950/20 rounded-2xl shadow-xl border-2 border-blue-500/50 p-8 flex flex-col items-center relative overflow-hidden">
           <div className="absolute top-0 left-0 right-0 h-2 bg-blue-500"></div>
           <Split className="w-16 h-16 text-blue-500 mb-6" />
           <h3 className="text-2xl font-bold text-blue-400 mb-2">The Factor/TC-VAE Scalpel</h3>
           <p className="text-sm text-slate-300 text-center mb-6">
             These models mathematically isolate the specific source of entanglement and penalize <em>only</em> that term.
           </p>
           <div className="bg-slate-900 border border-blue-500/50 p-4 rounded-xl w-full mt-auto">
             <div className="text-blue-300 font-bold text-sm mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> The Precision Surgery:</div>
             <ul className="text-xs text-slate-400 space-y-3 list-disc pl-4">
               <li>Penalizes the <strong>Total Correlation</strong> term heavily to force disentanglement.</li>
               <li><strong className="text-blue-400">Protects Mutual Information!</strong> Keeps reconstructions sharp and high-fidelity.</li>
             </ul>
           </div>
        </div>

      </div>
    </div>
  );
};

const LatentVariablesClarificationSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-indigo-700 flex items-center gap-3">
          <HelpCircle className="w-8 h-8"/> Clearing the Confusion
        </h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          You asked: <em>"What are z₁, z₂? Are they the mean and variance that we get after the encoder?"</em> <strong>NO! Let's visualize exactly what they are.</strong>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: The Pipeline */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col relative overflow-hidden items-center justify-center">
           
           <div className="flex flex-col items-center w-full max-w-sm gap-4">
              
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">1. Encoder Outputs</span>
                <div className="bg-slate-100 border border-slate-300 p-3 rounded-lg flex gap-4 mt-2 shadow-inner">
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-blue-600 font-bold">μ (10 Means)</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-emerald-600 font-bold">σ² (10 Vars)</span>
                  </div>
                </div>
              </div>

              <ArrowDown className="w-6 h-6 text-slate-400" />

              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-amber-500 uppercase bg-amber-100 px-2 py-1 rounded">2. Reparameterization Trick (Sampling)</span>
                <div className="mt-2 bg-amber-500 text-white font-bold p-2 rounded-full shadow-lg">
                  <Dices className="w-6 h-6"/>
                </div>
              </div>

              <ArrowDown className="w-6 h-6 text-slate-400" />

              <div className="flex flex-col items-center w-full">
                <span className="text-[10px] font-bold text-purple-600 uppercase mb-2">3. The Final Latent Vector (z)</span>
                <div className="bg-purple-50 border-2 border-purple-400 p-4 rounded-xl shadow-md w-full">
                  <span className="font-mono text-sm font-bold text-purple-800">
                    z = [ z₁, z₂, z₃, ..., z₁₀ ]
                  </span>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white border border-purple-200 p-2 rounded flex flex-col">
                      <strong className="text-purple-600">z₁</strong>
                      <span className="text-slate-500">e.g. Size</span>
                    </div>
                    <div className="bg-white border border-purple-200 p-2 rounded flex flex-col">
                      <strong className="text-purple-600">z₂</strong>
                      <span className="text-slate-500">e.g. Color</span>
                    </div>
                    <div className="bg-white border border-purple-200 p-2 rounded flex flex-col">
                      <strong className="text-purple-600">z₃</strong>
                      <span className="text-slate-500">e.g. Shape</span>
                    </div>
                  </div>
                </div>
              </div>

           </div>
        </div>

        {/* Right: The Takeaway */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           
           <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-sm border border-slate-700">
             <h4 className="font-bold text-indigo-400 text-lg mb-2 flex items-center gap-2"><Target className="w-5 h-5"/> What Total Correlation Looks At</h4>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               We do NOT care about the means and variances anymore. We care about the <strong>final sampled dimensions</strong> of the latent vector <span className="font-mono bg-slate-900 px-1 rounded text-purple-300">z</span>.
             </p>
             <p className="text-sm text-slate-300 leading-relaxed">
               Total Correlation asks: <em>"If I look at the generated number for <span className="font-mono text-xs">z₁</span> (Size), does it accidentally give me information about what the number for <span className="font-mono text-xs">z₂</span> (Color) will be?"</em>
             </p>
           </div>

           <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl shadow-sm">
             <h4 className="font-bold text-emerald-800 text-lg mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5"/> The Goal of Disentanglement</h4>
             <p className="text-sm text-slate-700 leading-relaxed">
               If <span className="font-mono font-bold">z₁</span>, <span className="font-mono font-bold">z₂</span>, and <span className="font-mono font-bold">z₃</span> are perfectly disentangled (Total Correlation = 0), they act as completely independent dials. Changing the "Size" dial has absolutely zero mathematical effect on the "Color" dial.
             </p>
           </div>

        </div>

      </div>
    </div>
  );
};

const TotalCorrelationSlide = () => {
  const [tcLevel, setTcLevel] = useState(100); 

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">Understanding Total Correlation (TC)</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          The foundation of these new methods is <strong>Total Correlation (TC)</strong>. It measures the amount of statistical dependence (entanglement) among the variables in your latent space.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: Interactive Dependency Graph */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-8 flex flex-col items-center relative overflow-hidden">
           
           <div className="flex justify-between w-full mb-6 relative z-10">
             <span className={`text-xs font-bold uppercase tracking-widest ${tcLevel > 50 ? 'text-rose-400' : 'text-slate-500'}`}>High TC (Entangled)</span>
             <span className={`text-xs font-bold uppercase tracking-widest ${tcLevel <= 50 ? 'text-emerald-400' : 'text-slate-500'}`}>Low TC (Disentangled)</span>
           </div>

           <input 
             type="range" min="0" max="100" value={tcLevel} 
             onChange={(e) => setTcLevel(parseInt(e.target.value))} 
             className={`w-full mb-8 z-10 h-2 rounded-lg appearance-none cursor-pointer ${tcLevel > 50 ? 'accent-rose-500 bg-rose-900/50' : 'accent-emerald-500 bg-emerald-900/50'}`} 
           />

           <div className="flex-grow flex flex-col items-center justify-center w-full relative">
              
              {/* Node z1 */}
              <motion.div animate={{ x: (100 - tcLevel) * 1.5, y: 0 }} className="absolute z-20">
                <div className={`px-4 py-2 rounded-full border-2 font-bold text-sm shadow-lg ${tcLevel > 50 ? 'bg-rose-100 border-rose-500 text-rose-900' : 'bg-emerald-100 border-emerald-500 text-emerald-900'}`}>
                  z₁ (Shape)
                </div>
              </motion.div>

              {/* Node z2 */}
              <motion.div animate={{ x: -(100 - tcLevel) * 1.5, y: - (100 - tcLevel) }} className="absolute z-20">
                <div className={`px-4 py-2 rounded-full border-2 font-bold text-sm shadow-lg ${tcLevel > 50 ? 'bg-rose-100 border-rose-500 text-rose-900' : 'bg-emerald-100 border-emerald-500 text-emerald-900'}`}>
                  z₂ (Color)
                </div>
              </motion.div>

              {/* Node z3 */}
              <motion.div animate={{ x: -(100 - tcLevel) * 0.5, y: (100 - tcLevel) }} className="absolute z-20">
                <div className={`px-4 py-2 rounded-full border-2 font-bold text-sm shadow-lg ${tcLevel > 50 ? 'bg-rose-100 border-rose-500 text-rose-900' : 'bg-emerald-100 border-emerald-500 text-emerald-900'}`}>
                  z₃ (Size)
                </div>
              </motion.div>

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <motion.line x1="50%" y1="50%" x2="50%" y2="50%" stroke="#f43f5e" strokeWidth="4" strokeDasharray="5 5" animate={{ opacity: tcLevel / 100 }} />
                <motion.line x1="50%" y1="50%" x2="50%" y2="50%" stroke="#f43f5e" strokeWidth="4" strokeDasharray="5 5" animate={{ opacity: tcLevel / 100 }} />
                <motion.line x1="50%" y1="50%" x2="50%" y2="50%" stroke="#f43f5e" strokeWidth="4" strokeDasharray="5 5" animate={{ opacity: tcLevel / 100 }} />
              </svg>
              
              <AnimatePresence>
                {tcLevel > 80 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-rose-500/10 rounded-full blur-xl z-0"></motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* Right: Explanations */}
        <div className="flex-1 flex flex-col gap-4">
           <div className="bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700">
             <h4 className="font-bold text-rose-400 mb-2 flex items-center gap-2"><Link className="w-5 h-5"/> Entangled (TC &gt; 0)</h4>
             <p className="text-sm text-slate-300 leading-relaxed">
               If variables are entangled, knowing <span className="font-mono text-xs">z₁</span> gives you information about <span className="font-mono text-xs">z₂</span>. They move together. This means the model failed to isolate independent concepts.
             </p>
           </div>

           <div className="bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700">
             <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2"><Unlink className="w-5 h-5"/> Disentangled (TC = 0)</h4>
             <p className="text-sm text-slate-300 leading-relaxed">
               If Total Correlation is exactly zero, the variables are statistically independent. Changing the "Shape" dial (<span className="font-mono text-xs">z₁</span>) has zero effect on the "Color" dial (<span className="font-mono text-xs">z₂</span>). This is the holy grail.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

const JointVsMarginalSlide = () => {
  const [isEntangled, setIsEntangled] = useState(true);

  // Generate 40 fixed points for the scatter plot to prevent react re-renders from jumping
  const [points] = useState(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const x = 15 + (i * 1.7) % 70; 
      const entangledY = x + (Math.random() * 20 - 10);
      const independentY = 15 + Math.random() * 70;
      const prodY = 15 + Math.random() * 70;
      return { id: i, x, entangledY, independentY, prodY };
    });
  });

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">Deep Dive: What are Joint & Marginal Distributions?</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Let's break down the exact math of Total Correlation into visual geometry. TC compares <strong>Reality</strong> to a <strong>Hypothetical Independent World</strong>.
        </p>
      </div>

      <div className="flex justify-center mb-6 w-full max-w-md mx-auto relative z-20">
        <div className="flex bg-slate-800 p-1 rounded-xl w-full shadow-inner border border-slate-700">
           <button onClick={() => setIsEntangled(true)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${isEntangled ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>
             Correlated Data (Entangled)
           </button>
           <button onClick={() => setIsEntangled(false)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${!isEntangled ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>
             Independent Data (Disentangled)
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Reality (Joint) */}
        <div className="flex-[1.2] bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-6 flex flex-col items-center relative overflow-hidden">
           <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
             <Grid className="w-5 h-5 text-blue-400" /> Reality: The Joint Distribution
           </h3>
           <div className="font-mono text-sm bg-slate-900 px-3 py-1 rounded text-blue-300 border border-slate-600 mb-6">q(z) = q(z₁, z₂)</div>
           
           <div className="relative w-48 h-48 bg-slate-900 border-l-2 border-b-2 border-slate-500 mb-6 mt-4">
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">z₁ (e.g. Size)</span>
              <span className="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-90 text-[10px] text-slate-400 font-bold uppercase tracking-widest">z₂ (Color)</span>
              
              <div className="absolute -top-6 left-0 right-0 h-4 bg-slate-800/50 rounded flex items-end px-1">
                <div className="w-full h-full bg-blue-500/30 rounded" style={{ clipPath: 'polygon(0% 100%, 20% 40%, 50% 10%, 80% 40%, 100% 100%)' }}></div>
              </div>
              <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-[9px] font-mono text-blue-400">Marginal q(z₁)</span>

              <div className="absolute top-0 bottom-0 -right-6 w-4 bg-slate-800/50 rounded flex items-center py-1">
                <div className="w-full h-full bg-amber-500/30 rounded" style={{ clipPath: 'polygon(0% 0%, 60% 20%, 90% 50%, 60% 80%, 0% 100%)' }}></div>
              </div>
              <span className="absolute top-1/2 -right-24 transform -translate-y-1/2 text-[9px] font-mono text-amber-400 whitespace-nowrap">Marginal q(z₂)</span>

              {points.map(p => (
                <motion.div 
                  key={p.id}
                  animate={{ left: `${p.x}%`, top: `${isEntangled ? p.entangledY : p.independentY}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className={`absolute w-2 h-2 rounded-full shadow-sm transform -translate-x-1/2 -translate-y-1/2 ${isEntangled ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'}`}
                />
              ))}
           </div>
           <p className="text-xs text-slate-400 leading-relaxed text-center px-4">
             The <strong>Joint Distribution</strong> is where the data <em>actually</em> lives in 2D space. The <strong>Marginals</strong> are just the 1D "shadows" cast on the walls.
           </p>
        </div>

        {/* Comparator */}
        <div className="flex flex-col items-center justify-center shrink-0 w-24">
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">Compare With</span>
           <div className="w-16 h-16 bg-slate-800 border-4 border-slate-600 rounded-full flex flex-col items-center justify-center shadow-lg relative z-10">
             <span className="font-bold text-slate-300">KL</span>
             <span className="text-[9px] text-slate-500 font-mono">(Gap)</span>
           </div>
           
           <AnimatePresence mode="wait">
             <motion.div 
               key={isEntangled ? 'diff' : 'same'}
               initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
               className={`mt-4 px-3 py-1.5 rounded-lg text-xs font-bold text-center border-2 ${isEntangled ? 'bg-rose-950/50 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-emerald-950/50 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}
             >
               {isEntangled ? 'Huge Gap!' : 'Perfect Match!'}
               <br/>
               <span className="font-mono">{isEntangled ? 'TC > 0' : 'TC = 0'}</span>
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Product of Marginals */}
        <div className="flex-[1.2] bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-6 flex flex-col items-center relative overflow-hidden">
           <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
             <GitCommit className="w-5 h-5 text-purple-400" /> Hypothetical Independent World
           </h3>
           <div className="font-mono text-sm bg-slate-900 px-3 py-1 rounded text-purple-300 border border-slate-600 mb-6">∏ q(z_j) = q(z₁) × q(z₂)</div>
           
           <div className="relative w-48 h-48 bg-slate-900 border-l-2 border-b-2 border-slate-500 mb-6 mt-4">
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">z₁ (e.g. Size)</span>
              <span className="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-90 text-[10px] text-slate-400 font-bold uppercase tracking-widest">z₂ (Color)</span>
              
              {points.map(p => (
                <motion.div 
                  key={`prod-${p.id}`}
                  animate={{ left: `${p.x}%`, top: `${p.prodY}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="absolute w-2 h-2 rounded-full shadow-sm transform -translate-x-1/2 -translate-y-1/2 bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)] opacity-70"
                />
              ))}
           </div>

           <p className="text-xs text-slate-400 leading-relaxed text-center px-4">
             The <strong>Product of Marginals</strong> asks: <em>"What if I randomly multiplied the shadows to build a fake 2D world?"</em> This hypothetical world <strong>forces</strong> independence!
           </p>
        </div>

      </div>
    </div>
  );
};

const FactorVAEPipelineSlide = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "1. The Target", desc: "Our goal is to penalize Total Correlation. But calculating it directly is mathematically impossible because the distributions are intractable." },
    { title: "2. Encoding the Real Batch", desc: "Take a batch of images and encode them. This gives us a 'Real Batch' of latent vectors. Notice that Shape and Color might be entangled (e.g., all circles are red)." },
    { title: "3. Creating the Shuffled Batch", desc: "We take the Real Batch and randomly shuffle the values within each column independently. This destroys all entanglement, creating a 'Fake' batch that represents perfect independence (the product of marginals)!" },
    { title: "4. Training the Discriminator", desc: "We train a binary classifier Discriminator D(z). Its only job is to look at a vector and guess: Is this from the Real batch (Target=1) or the Shuffled batch (Target=0)?" },
    { title: "5. Penalizing the VAE", desc: "If the Discriminator can easily tell them apart, it means the Real data is entangled! We penalize the VAE Encoder based on the Discriminator's success. To avoid the penalty, the VAE is forced to produce Real vectors that naturally look Shuffled." }
  ];

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-4">
        <h2 className="text-3xl font-bold mb-2 text-center text-indigo-700">FactorVAE: The Shuffling Trick</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          You asked: <em>"What does Real and Shuffled Batch refer to? What data trains the Discriminator?"</em> Let's walk through the exact pipeline to see how it works.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-4">
        
        {/* Interactive Flowchart */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col relative items-center justify-center overflow-hidden">
           
           <div className="w-full flex justify-between items-center relative z-10 px-4">
              
              {/* Image to Encoder */}
              <div className="flex flex-col items-center gap-2">
                 <span className="text-[10px] font-bold text-slate-500 uppercase">Image Batch</span>
                 <div className="flex gap-1 bg-slate-100 p-2 rounded border border-slate-300 shadow-inner">
                   <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                   <div className="w-6 h-6 bg-blue-500 rounded-sm"></div>
                   <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-green-500"></div>
                 </div>
                 <ArrowDown className={`w-5 h-5 transition-colors ${step >= 1 ? 'text-indigo-500' : 'text-slate-300'}`} />
                 <div className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors ${step >= 1 ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 border border-slate-300'}`}>VAE Encoder</div>
              </div>

              <ArrowRight className={`w-6 h-6 transition-colors ${step >= 1 ? 'text-indigo-500' : 'text-slate-300'}`} />

              {/* Real Latent Batch */}
              <div className="flex flex-col items-center">
                 <span className={`text-[10px] font-bold uppercase transition-colors ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>Real Batch q(z)</span>
                 <div className={`flex flex-col gap-1 p-2 rounded-lg border-2 transition-colors shadow-sm ${step >= 1 ? 'bg-indigo-50 border-indigo-300' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex gap-1">
                      <div className={`w-8 h-6 flex items-center justify-center text-[10px] font-bold rounded ${step >= 1 ? 'bg-red-200 text-red-800' : 'bg-slate-200 text-transparent'}`}>z1</div>
                      <div className={`w-8 h-6 flex items-center justify-center text-[10px] font-bold rounded ${step >= 1 ? 'bg-red-200 text-red-800' : 'bg-slate-200 text-transparent'}`}>z2</div>
                    </div>
                    <div className="flex gap-1">
                      <div className={`w-8 h-6 flex items-center justify-center text-[10px] font-bold rounded ${step >= 1 ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-transparent'}`}>z1</div>
                      <div className={`w-8 h-6 flex items-center justify-center text-[10px] font-bold rounded ${step >= 1 ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-transparent'}`}>z2</div>
                    </div>
                    <div className="flex gap-1">
                      <div className={`w-8 h-6 flex items-center justify-center text-[10px] font-bold rounded ${step >= 1 ? 'bg-green-200 text-green-800' : 'bg-slate-200 text-transparent'}`}>z1</div>
                      <div className={`w-8 h-6 flex items-center justify-center text-[10px] font-bold rounded ${step >= 1 ? 'bg-green-200 text-green-800' : 'bg-slate-200 text-transparent'}`}>z2</div>
                    </div>
                 </div>
                 {step === 1 && <span className="text-[9px] text-indigo-500 mt-2 font-bold max-w-[100px] text-center">Rows are intact. Entanglement exists.</span>}
              </div>

              {/* Shuffling operation */}
              <div className="flex flex-col items-center px-2">
                 <ArrowRight className={`w-6 h-6 transition-colors ${step >= 2 ? 'text-amber-500' : 'text-slate-300'}`} />
                 {step >= 2 && <Shuffle className="w-4 h-4 text-amber-500 mt-1 animate-pulse" />}
              </div>

              {/* Fake Latent Batch */}
              <div className="flex flex-col items-center">
                 <span className={`text-[10px] font-bold uppercase transition-colors ${step >= 2 ? 'text-amber-600' : 'text-slate-400'}`}>Shuffled Batch ∏ q(z_j)</span>
                 <div className={`flex flex-col gap-1 p-2 rounded-lg border-2 transition-colors shadow-sm ${step >= 2 ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
                    {/* Shuffled rows */}
                    <div className="flex gap-1">
                      <div className={`w-8 h-6 flex items-center justify-center text-[10px] font-bold rounded ${step >= 2 ? 'bg-red-200 text-red-800' : 'bg-slate-200 text-transparent'}`}>z1</div>
                      <div className={`w-8 h-6 flex items-center justify-center text-[10px] font-bold rounded ${step >= 2 ? 'bg-green-200 text-green-800' : 'bg-slate-200 text-transparent'}`}>z2</div>
                    </div>
                    <div className="flex gap-1">
                      <div className={`w-8 h-6 flex items-center justify-center text-[10px] font-bold rounded ${step >= 2 ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-transparent'}`}>z1</div>
                      <div className={`w-8 h-6 flex items-center justify-center text-[10px] font-bold rounded ${step >= 2 ? 'bg-red-200 text-red-800' : 'bg-slate-200 text-transparent'}`}>z2</div>
                    </div>
                    <div className="flex gap-1">
                      <div className={`w-8 h-6 flex items-center justify-center text-[10px] font-bold rounded ${step >= 2 ? 'bg-green-200 text-green-800' : 'bg-slate-200 text-transparent'}`}>z1</div>
                      <div className={`w-8 h-6 flex items-center justify-center text-[10px] font-bold rounded ${step >= 2 ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-transparent'}`}>z2</div>
                    </div>
                 </div>
                 {step === 2 && <span className="text-[9px] text-amber-600 mt-2 font-bold max-w-[100px] text-center">Columns scrambled. Independence forced!</span>}
              </div>
           </div>

           {/* The Discriminator Area */}
           <div className={`w-[90%] border-t-2 border-dashed mt-8 pt-6 flex justify-center relative transition-colors ${step >= 3 ? 'border-rose-400' : 'border-slate-300'}`}>
              
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex gap-12">
                 <ArrowDown className={`w-6 h-6 transition-colors ${step >= 3 ? 'text-indigo-500' : 'text-transparent'}`} />
                 <ArrowDown className={`w-6 h-6 transition-colors ${step >= 3 ? 'text-amber-500' : 'text-transparent'}`} />
              </div>

              <div className={`flex flex-col items-center bg-white p-4 rounded-xl border-2 transition-all z-10 ${step >= 3 ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'border-slate-200 shadow-sm'}`}>
                 <span className={`font-bold text-sm flex items-center gap-2 ${step >= 3 ? 'text-rose-600' : 'text-slate-400'}`}><Swords className="w-5 h-5"/> Discriminator D(z)</span>
                 <span className={`text-[10px] font-mono mt-1 ${step >= 3 ? 'text-rose-400' : 'text-transparent'}`}>BCE Loss Target: Real=1, Shuffled=0</span>
              </div>
           </div>

           {/* VAE Penalty Arrow */}
           <AnimatePresence>
             {step >= 4 && (
               <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} className="absolute left-[15%] bottom-[20%] h-32 border-l-4 border-b-4 border-rose-500 rounded-bl-xl origin-bottom flex items-end">
                  <ArrowLeft className="w-8 h-8 text-rose-500 absolute -bottom-4 -left-4 animate-pulse" />
                  <div className="absolute -left-20 bottom-8 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-1 rounded shadow-md w-32 text-center">
                    Penalty: "Stop making it easy for the Discriminator!"
                  </div>
               </motion.div>
             )}
           </AnimatePresence>

        </div>

        {/* Right Info Panel */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           <div className="bg-slate-800 text-white rounded-2xl shadow-xl p-8 border border-slate-700 min-h-[250px] flex flex-col">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-700 pb-2 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4"/> Step {step + 1} of 5
              </h3>
              
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                  <h4 className="text-2xl font-bold mb-4 text-emerald-400">{steps[step].title}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{steps[step].desc}</p>
                </motion.div>
              </AnimatePresence>
           </div>

           <div className="flex justify-between items-center w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mt-auto">
             <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg disabled:opacity-30 hover:bg-slate-200 flex items-center gap-1 text-sm transition-colors"><ChevronLeft className="w-4 h-4"/> Prev</button>
             <div className="flex gap-1.5">{Array.from({length: 5}).map((_, i) => (<div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>))}</div>
             <button onClick={() => setStep(Math.min(4, step + 1))} disabled={step === 4} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg disabled:opacity-30 hover:bg-indigo-500 flex items-center gap-1 text-sm shadow transition-colors">Next <ChevronRight className="w-4 h-4"/></button>
           </div>
        </div>

      </div>
    </div>
  );
};

const FactorVAEMathVisualizerSlide = () => {
  const [step, setStep] = useState(1);
  const [discScore, setDiscScore] = useState(0.9);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">Demystifying the FactorVAE Math</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Let's translate the intimidating formulas from the paper directly into their intuitive meanings. The math is just a formal way of describing a "Spot the Fake" sorting game.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left Nav */}
        <div className="lg:w-1/3 flex flex-col gap-3">
          <button onClick={() => setStep(1)} className={`p-4 rounded-xl text-left flex flex-col gap-2 transition-all border-l-4 ${step === 1 ? 'bg-slate-800 border-indigo-500 shadow-lg' : 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-400'}`}>
            <span className="font-bold text-sm text-indigo-400">Step 1: Sampling</span>
            <span className="font-mono text-[10px]">q(z) vs ∏ q(z_j)</span>
          </button>
          
          <button onClick={() => setStep(2)} className={`p-4 rounded-xl text-left flex flex-col gap-2 transition-all border-l-4 ${step === 2 ? 'bg-slate-800 border-amber-500 shadow-lg' : 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-400'}`}>
            <span className="font-bold text-sm text-amber-400">Step 2: Training Discriminator</span>
            <span className="font-mono text-[10px]">L_D = -E[log D(z)] - E[log(1-D(z'))]</span>
          </button>

          <button onClick={() => setStep(3)} className={`p-4 rounded-xl text-left flex flex-col gap-2 transition-all border-l-4 ${step === 3 ? 'bg-slate-800 border-rose-500 shadow-lg' : 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-400'}`}>
            <span className="font-bold text-sm text-rose-400">Step 3: Estimating TC</span>
            <span className="font-mono text-[10px]">TC ≈ E[log D(z) - log(1-D(z))]</span>
          </button>
        </div>

        {/* Right Content */}
        <div className="lg:w-2/3 bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-8 flex flex-col relative overflow-hidden">
           <AnimatePresence mode="wait">
             
             {/* STEP 1: SAMPLING */}
             {step === 1 && (
               <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                 <h3 className="text-xl font-bold text-indigo-400 mb-4 border-b border-slate-600 pb-2 flex items-center gap-2"><Shuffle className="w-5 h-5"/> What are the two datasets?</h3>
                 
                 <div className="grid grid-cols-2 gap-8 mb-6 flex-grow">
                    <div className="flex flex-col items-center bg-slate-900 p-4 rounded-xl border border-indigo-500/50">
                       <span className="font-mono font-bold text-indigo-300 text-sm mb-2">z ~ q(z)</span>
                       <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-4">"The Real Data"</span>
                       <div className="flex flex-col gap-2 w-full">
                          <div className="flex bg-indigo-950 border border-indigo-500/30 p-1 rounded gap-1"><div className="w-1/3 h-6 bg-red-500 rounded-sm"/><div className="w-1/3 h-6 bg-red-400 rounded-sm"/><div className="w-1/3 h-6 bg-red-300 rounded-sm"/></div>
                          <div className="flex bg-indigo-950 border border-indigo-500/30 p-1 rounded gap-1"><div className="w-1/3 h-6 bg-blue-500 rounded-sm"/><div className="w-1/3 h-6 bg-blue-400 rounded-sm"/><div className="w-1/3 h-6 bg-blue-300 rounded-sm"/></div>
                       </div>
                       <p className="text-[10px] text-slate-300 mt-4 text-center">Take a batch of images. Encode them. Keep the rows intact. Features are naturally correlated (e.g. all red).</p>
                    </div>

                    <div className="flex flex-col items-center bg-slate-900 p-4 rounded-xl border border-emerald-500/50">
                       <span className="font-mono font-bold text-emerald-300 text-sm mb-2">z' ~ ∏ q(z_j)</span>
                       <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-4">"The Fake (Independent) Data"</span>
                       <div className="flex flex-col gap-2 w-full">
                          <div className="flex bg-emerald-950 border border-emerald-500/30 p-1 rounded gap-1"><div className="w-1/3 h-6 bg-red-500 rounded-sm"/><div className="w-1/3 h-6 bg-blue-400 rounded-sm"/><div className="w-1/3 h-6 bg-green-300 rounded-sm"/></div>
                          <div className="flex bg-emerald-950 border border-emerald-500/30 p-1 rounded gap-1"><div className="w-1/3 h-6 bg-blue-500 rounded-sm"/><div className="w-1/3 h-6 bg-green-400 rounded-sm"/><div className="w-1/3 h-6 bg-red-300 rounded-sm"/></div>
                       </div>
                       <p className="text-[10px] text-slate-300 mt-4 text-center">Take the same batch, but shuffle each column randomly. This destroys correlation, creating perfectly independent "Frankenstein" codes.</p>
                    </div>
                 </div>
               </motion.div>
             )}

             {/* STEP 2: DISCRIMINATOR LOSS */}
             {step === 2 && (
               <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                 <h3 className="text-xl font-bold text-amber-400 mb-4 border-b border-slate-600 pb-2 flex items-center gap-2"><Cpu className="w-5 h-5"/> Training the "Sorting Robot"</h3>
                 
                 <div className="bg-black/50 p-4 rounded-xl border border-slate-700 font-mono text-[11px] md:text-sm text-center mb-6 text-slate-300">
                    L_D = <span className="text-indigo-400">-E[ log <span className="font-bold text-indigo-300 border-b border-indigo-400">D(z)</span> ]</span> <span className="text-emerald-400">- E[ log(1 - <span className="font-bold text-emerald-300 border-b border-emerald-400">D(z')</span>) ]</span>
                 </div>

                 <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                   This terrifying equation is just standard Binary Cross-Entropy loss. It's the mathematical score for a sorting game.
                 </p>

                 <div className="flex items-center justify-between w-full max-w-sm mx-auto bg-slate-900 p-4 rounded-xl border border-slate-600">
                    <div className="flex flex-col items-center">
                       <span className="text-indigo-400 font-bold mb-1">D(z)</span>
                       <span className="text-[10px] text-slate-400 text-center w-24">Score for Real Data</span>
                       <span className="font-mono text-xs bg-indigo-950 text-indigo-300 px-2 py-1 rounded mt-2 border border-indigo-500/50">Wants to be 1.0</span>
                    </div>
                    <div className="text-3xl text-amber-500 mx-4">🤖</div>
                    <div className="flex flex-col items-center">
                       <span className="text-emerald-400 font-bold mb-1">D(z')</span>
                       <span className="text-[10px] text-slate-400 text-center w-24">Score for Fake Data</span>
                       <span className="font-mono text-xs bg-emerald-950 text-emerald-300 px-2 py-1 rounded mt-2 border border-emerald-500/50">Wants to be 0.0</span>
                    </div>
                 </div>
               </motion.div>
             )}

             {/* STEP 3: ESTIMATING TC */}
             {step === 3 && (
               <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                 <h3 className="text-xl font-bold text-rose-400 mb-4 border-b border-slate-600 pb-2 flex items-center gap-2"><Scale className="w-5 h-5"/> The "Confusion Penalty"</h3>
                 
                 <div className="bg-black/50 p-4 rounded-xl border border-slate-700 font-mono text-[11px] md:text-sm text-center mb-6 text-slate-300">
                    TC(z) ≈ E[ <span className="text-rose-400 font-bold">log D(z) - log(1 - D(z))</span> ]
                 </div>

                 <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                   This equation calculates the penalty we apply to the VAE Encoder. It uses the "Density Ratio Trick". The penalty is based entirely on <strong>how confident the Discriminator D(z) is.</strong>
                 </p>

                 <div className="bg-slate-900 p-6 rounded-xl border border-slate-600 flex flex-col items-center relative overflow-hidden">
                    <span className="absolute top-2 left-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Interactive TC Penalty Calculator</span>
                    
                    <div className="flex justify-between items-center w-full mb-2 mt-4">
                       <span className="text-xs text-slate-400 w-24 text-left">Confused (D=0.5)<br/>"Disentangled"</span>
                       <span className="font-mono text-rose-400 font-bold bg-rose-950 px-2 py-1 rounded border border-rose-500/50">D(z) = {discScore.toFixed(2)}</span>
                       <span className="text-xs text-slate-400 w-24 text-right">Sure it's Real (D=0.99)<br/>"Highly Entangled"</span>
                    </div>
                    <input type="range" min="0.5" max="0.99" step="0.01" value={discScore} onChange={(e) => setDiscScore(parseFloat(e.target.value))} className="w-full accent-rose-500 mb-6" />

                    <div className="bg-slate-800 border-2 border-rose-500/50 p-4 rounded-xl w-full text-center shadow-lg">
                       <div className="font-mono text-sm text-slate-300 mb-2">
                         log({discScore.toFixed(2)}) - log({(1-discScore).toFixed(2)})
                       </div>
                       <div className="flex items-center justify-center gap-2 text-xl">
                         <span className="text-slate-400 font-bold">Penalty = </span>
                         <span className="font-mono font-bold text-rose-500">{ (Math.log(discScore) - Math.log(1-discScore)).toFixed(2) }</span>
                       </div>
                       {discScore <= 0.55 && <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-2 block">D is completely guessing! TC = 0!</span>}
                       {discScore >= 0.90 && <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest mt-2 block animate-pulse">D easily spots the pattern! Huge Penalty!</span>}
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

const TCVAEDecompositionMathSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Deconstructing the KL Divergence</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          You asked: <em>"Do we just define those 3 hyperparameters on the original formula?"</em> <strong>NO!</strong> The original formula is a solid block. We must use algebra to shatter it into pieces before we can attach weights.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: The Shattering Process */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col relative overflow-hidden">
           <h3 className="text-center font-bold text-slate-400 uppercase tracking-widest text-xs mb-6">The Mathematical Shattering</h3>
           
           <div className="flex-grow flex flex-col justify-center gap-6 relative z-10 w-full max-w-2xl mx-auto">
              
              {/* Step 1: Solid Block */}
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-slate-500 uppercase mb-1">1. The Original Solid Block (Standard VAE)</span>
                 <div className="w-full bg-slate-800 text-white p-4 rounded-xl flex items-center justify-center font-mono font-bold shadow-md relative">
                   E[ KL( q(z|x) || p(z) ) ]
                   <div className="absolute -right-4 -top-4 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg transform rotate-12 flex items-center gap-1">
                     <Lock className="w-3 h-3"/> Inseparable
                   </div>
                 </div>
                 <p className="text-[10px] text-slate-500 mt-1">If you attach a weight here (like β-VAE does), it multiplies everything at once. You cannot isolate Total Correlation.</p>
              </div>

              <div className="flex justify-center"><ArrowDown className="text-slate-400 w-6 h-6" /></div>

              {/* Step 2: The Hack */}
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-indigo-500 uppercase mb-1 flex items-center gap-2"><UnfoldVertical className="w-4 h-4"/> 2. The Algebraic Expansion</span>
                 <div className="w-full bg-indigo-50 border-2 border-indigo-200 p-4 rounded-xl flex flex-col items-center justify-center font-mono text-xs text-indigo-900 shadow-inner">
                   <span>Expand the log fraction: <span className="font-bold">log(q/p) = log(q) - log(p)</span></span>
                   <span className="mt-2 text-rose-600 font-bold">Add and Subtract log q(z) !</span>
                   <span className="mt-1 text-emerald-600 font-bold">Add and Subtract log ∏q(z_j) !</span>
                 </div>
                 <p className="text-[10px] text-slate-500 mt-1">By adding and subtracting the exact same terms (which equals 0), the math remains perfectly legal, but the equation expands.</p>
              </div>

              <div className="flex justify-center"><ArrowDown className="text-slate-400 w-6 h-6" /></div>

              {/* Step 3: The 3 Bricks */}
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-emerald-600 uppercase mb-1">3. The 3 Independent Lego Bricks</span>
                 <div className="flex gap-2 w-full">
                    <div className="flex-1 bg-blue-100 border-2 border-blue-400 p-3 rounded-lg flex items-center justify-center font-mono font-bold text-blue-800 shadow-sm text-xs text-center">
                      Mutual<br/>Info
                    </div>
                    <div className="flex-1 bg-rose-100 border-2 border-rose-400 p-3 rounded-lg flex items-center justify-center font-mono font-bold text-rose-800 shadow-sm text-xs text-center relative overflow-hidden">
                      Total<br/>Correlation
                      <div className="absolute top-0 right-0 bg-rose-500 text-white text-[8px] px-1 rounded-bl">TARGET</div>
                    </div>
                    <div className="flex-1 bg-emerald-100 border-2 border-emerald-400 p-3 rounded-lg flex items-center justify-center font-mono font-bold text-emerald-800 shadow-sm text-xs text-center">
                      Dim-wise<br/>KL
                    </div>
                 </div>
                 <p className="text-[10px] text-slate-500 mt-1">The solid block has been perfectly factored into three separate terms.</p>
              </div>

           </div>
        </div>

        {/* Right: Attaching the weights */}
        <div className="flex-1 flex flex-col gap-4">
           
           <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border-t-4 border-emerald-500">
             <h3 className="font-bold text-emerald-400 mb-4 flex items-center gap-2"><Settings2 className="w-5 h-5"/> Step 4: Attaching the Dials</h3>
             
             <p className="text-sm text-slate-300 leading-relaxed mb-6">
               NOW that the formula is broken into three separate pieces, TCVAE modifies the ELBO objective by attaching independent volume knobs (weights) to each piece!
             </p>

             <div className="flex flex-col gap-3">
               <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg flex items-center gap-4">
                 <div className="bg-blue-500/20 text-blue-400 font-mono font-bold px-2 py-1 rounded">w_I = 1</div>
                 <span className="text-xs text-slate-400">Keep Mutual Info intact so images stay sharp.</span>
               </div>
               <div className="bg-rose-900/40 border border-rose-500 p-3 rounded-lg flex items-center gap-4 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                 <div className="bg-rose-500/20 text-rose-400 font-mono font-bold px-2 py-1 rounded border border-rose-500/50">w_TC = 10</div>
                 <span className="text-xs text-rose-200">Crank up the penalty specifically on Total Correlation to force disentanglement!</span>
               </div>
               <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg flex items-center gap-4">
                 <div className="bg-emerald-500/20 text-emerald-400 font-mono font-bold px-2 py-1 rounded">w_DKL = 1</div>
                 <span className="text-xs text-slate-400">Keep the latent space bounded normally.</span>
               </div>
             </div>
           </div>

           <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-200 flex-grow flex flex-col justify-center">
             <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5"/> Jargon Buster</h3>
             <div className="space-y-3">
               <div>
                 <span className="font-mono text-xs bg-white border border-blue-200 px-2 py-1 rounded text-blue-700 font-bold mb-1 inline-block">Factorized Prior / Isotropic Gaussian</span>
                 <p className="text-xs text-slate-600">This just means a <strong>perfectly round, 3D bell curve</strong> where the axes don't interact. Because it's perfectly round, the dimensions are completely independent by default.</p>
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

const TCVAESlide = () => {
  const [activeTerm, setActiveTerm] = useState('all'); 

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">β-TCVAE: The Mathematical Scalpel</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Instead of using an external Discriminator, the <strong>Total Correlation VAE (β-TCVAE)</strong> mathematically decomposes the average KL divergence penalty into three exact, separate components.
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* The Equation Block */}
        <div className="bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-8 flex flex-col items-center relative w-full shrink-0 overflow-hidden cursor-pointer" onClick={() => setActiveTerm('all')}>
           <span className="absolute top-4 left-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">Average KL Divergence =</span>
           
           <div className="font-mono text-sm md:text-xl font-bold text-white text-center flex flex-wrap justify-center items-center gap-y-4 gap-x-2 mt-4 w-full">
             
             {/* Term 1: MI */}
             <div 
               onClick={(e) => { e.stopPropagation(); setActiveTerm('mi'); }}
               className={`relative group mx-1 transition-all duration-300 rounded-lg cursor-pointer ${activeTerm === 'all' || activeTerm === 'mi' ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}
             >
               <span className={`px-4 py-3 rounded-lg inline-block border-2 ${activeTerm === 'mi' ? 'bg-blue-900 text-blue-100 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-slate-900 text-blue-400 border-blue-500/50'}`}>
                 <span className="text-white opacity-50 mr-1">w_I ·</span>I(x; z)
               </span>
             </div>
             
             <span className={`text-slate-500 text-3xl mx-1 transition-opacity ${activeTerm === 'all' ? 'opacity-100' : 'opacity-0'}`}>+</span>
             
             {/* Term 2: TC */}
             <div 
               onClick={(e) => { e.stopPropagation(); setActiveTerm('tc'); }}
               className={`relative group mx-1 transition-all duration-300 rounded-lg cursor-pointer ${activeTerm === 'all' || activeTerm === 'tc' ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}
             >
               <span className={`px-4 py-3 rounded-lg inline-block border-2 ${activeTerm === 'tc' ? 'bg-rose-900 text-rose-100 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-slate-900 text-rose-400 border-rose-500/50'}`}>
                 <span className="text-white opacity-50 mr-1">w_TC ·</span>TC(z)
               </span>
             </div>

             <span className={`text-slate-500 text-3xl mx-1 transition-opacity ${activeTerm === 'all' ? 'opacity-100' : 'opacity-0'}`}>+</span>

             {/* Term 3: DKL */}
             <div 
               onClick={(e) => { e.stopPropagation(); setActiveTerm('dkl'); }}
               className={`relative group mx-1 transition-all duration-300 rounded-lg cursor-pointer ${activeTerm === 'all' || activeTerm === 'dkl' ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}
             >
               <span className={`px-4 py-3 rounded-lg inline-block border-2 ${activeTerm === 'dkl' ? 'bg-emerald-900 text-emerald-100 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-slate-900 text-emerald-400 border-emerald-500/50'}`}>
                 <span className="text-white opacity-50 mr-1">w_DKL ·</span>∑ KL(q(z_j) || p(z_j))
               </span>
             </div>
           </div>

           <div className="mt-6 text-xs text-slate-400 italic">Click a specific term to isolate it. Click the background to view all.</div>
        </div>

        {/* Explanation Panels */}
        <div className="flex-grow flex flex-col justify-center">
           <AnimatePresence mode="wait">
             
             {activeTerm === 'all' && (
               <motion.div key="all" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl text-center">
                 <h3 className="text-xl font-bold text-slate-200 mb-4">The Power of Decomposition</h3>
                 <p className="text-slate-400 leading-relaxed max-w-3xl mx-auto">
                   In standard Beta-VAE, multiplying the whole KL term by β forces <strong>all three weights</strong> to be huge simultaneously. TCVAE allows us to set custom weights for each term. We can set <span className="font-mono text-rose-300 bg-slate-900 px-1 rounded">w_TC = 10</span> to crush entanglement, while keeping <span className="font-mono text-blue-300 bg-slate-900 px-1 rounded">w_I = 1</span> so we don't accidentally destroy information retention!
                 </p>
               </motion.div>
             )}

             {activeTerm === 'mi' && (
               <motion.div key="mi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-blue-900/20 border-2 border-blue-500/50 p-8 rounded-2xl">
                 <h3 className="text-2xl font-bold text-blue-400 mb-2 flex items-center gap-2"><Database className="w-6 h-6"/> Index-Code Mutual Information</h3>
                 <p className="text-slate-300 leading-relaxed mb-4">
                   This term measures the mutual information between the input data <span className="font-mono text-xs">x</span> and the latent code <span className="font-mono text-xs">z</span>. A higher value means the latent space is storing a lot of useful information about the input images.
                 </p>
                 <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-sm text-blue-200">
                   <strong>Why separate it?</strong> Beta-VAE heavily penalizes this term by accident, which causes blurry reconstructions. TCVAE lets us protect this term.
                 </div>
               </motion.div>
             )}

             {activeTerm === 'tc' && (
               <motion.div key="tc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-rose-900/20 border-2 border-rose-500/50 p-8 rounded-2xl">
                 <h3 className="text-2xl font-bold text-rose-400 mb-2 flex items-center gap-2"><Unlink className="w-6 h-6"/> Total Correlation</h3>
                 <p className="text-slate-300 leading-relaxed mb-4">
                   This term measures the dependencies <em>between</em> the latent variables (e.g., does changing variable 1 accidentally change variable 2?). Lower is better for disentanglement.
                 </p>
                 <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-sm text-rose-200">
                   <strong>The Target:</strong> This is the <em>only</em> term we actually want to penalize heavily to achieve disentangled representations. We set <span className="font-mono font-bold bg-slate-800 px-1 rounded">w_TC &gt; 1</span>.
                 </div>
               </motion.div>
             )}

             {activeTerm === 'dkl' && (
               <motion.div key="dkl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-emerald-900/20 border-2 border-emerald-500/50 p-8 rounded-2xl">
                 <h3 className="text-2xl font-bold text-emerald-400 mb-2 flex items-center gap-2"><Target className="w-6 h-6"/> Dimension-wise KL</h3>
                 <p className="text-slate-300 leading-relaxed mb-4">
                   This term encourages the marginal distribution of <em>each individual latent dimension</em> to match the Prior (typically a standard Gaussian).
                 </p>
                 <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-sm text-emerald-200">
                   <strong>Purpose:</strong> It keeps the overall shape of the latent space organized and centered around zero, preventing values from drifting off to infinity, without strictly forcing independence.
                 </div>
               </motion.div>
             )}

           </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

const TCVAEWeightingSlide = () => {
  const [mode, setMode] = useState('tcvae');

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">The Power of Custom Weights</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Why go through the pain of mathematically decomposing the KL divergence? So we can assign <strong>independent penalty weights</strong> to each component!
        </p>
      </div>

      <div className="flex justify-center mb-8 w-full max-w-md mx-auto relative z-20">
        <div className="flex bg-slate-800 p-1 rounded-xl w-full shadow-inner border border-slate-700">
           <button onClick={() => setMode('beta')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${mode === 'beta' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>
             Standard β-VAE (β=10)
           </button>
           <button onClick={() => setMode('tcvae')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${mode === 'tcvae' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>
             β-TCVAE (β=10)
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: The Weighting Bar Chart */}
        <div className="flex-[1.5] bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-6 flex flex-col relative overflow-hidden">
           <h3 className="text-center font-bold text-slate-400 uppercase tracking-widest text-xs mb-6">Penalty Weights Assigned</h3>
           
           <div className="flex justify-around items-end h-48 mb-6 border-b border-slate-600 pb-2">
             {/* MI Bar */}
             <div className="flex flex-col items-center w-24">
               <motion.div 
                 animate={{ height: mode === 'beta' ? '100%' : '20%', backgroundColor: mode === 'beta' ? '#f43f5e' : '#3b82f6' }} 
                 className="w-16 rounded-t-lg shadow-lg relative flex justify-center items-start pt-2"
               >
                 <span className="font-bold font-mono text-white drop-shadow-md">{mode === 'beta' ? '10x' : '1x'}</span>
               </motion.div>
               <span className="text-[10px] font-bold text-slate-300 mt-2 text-center uppercase tracking-widest">w_I<br/>(Mutual Info)</span>
             </div>

             {/* TC Bar */}
             <div className="flex flex-col items-center w-24">
               <motion.div 
                 animate={{ height: '100%', backgroundColor: mode === 'beta' ? '#f43f5e' : '#a855f7' }} 
                 className="w-16 rounded-t-lg shadow-lg relative flex justify-center items-start pt-2"
               >
                 <span className="font-bold font-mono text-white drop-shadow-md">10x</span>
               </motion.div>
               <span className="text-[10px] font-bold text-slate-300 mt-2 text-center uppercase tracking-widest">w_TC<br/>(Total Corr.)</span>
             </div>

             {/* DKL Bar */}
             <div className="flex flex-col items-center w-24">
               <motion.div 
                 animate={{ height: mode === 'beta' ? '100%' : '20%', backgroundColor: mode === 'beta' ? '#f43f5e' : '#10b981' }} 
                 className="w-16 rounded-t-lg shadow-lg relative flex justify-center items-start pt-2"
               >
                 <span className="font-bold font-mono text-white drop-shadow-md">{mode === 'beta' ? '10x' : '1x'}</span>
               </motion.div>
               <span className="text-[10px] font-bold text-slate-300 mt-2 text-center uppercase tracking-widest">w_DKL<br/>(Dim-wise KL)</span>
             </div>
           </div>

           <div className="bg-slate-900 p-4 rounded-xl border border-slate-600 text-sm text-slate-300 text-center shadow-inner leading-relaxed">
             {mode === 'beta' ? 
               "In standard Beta-VAE, turning up β applies a massive penalty to EVERY term simultaneously. We crush Mutual Information by accident, destroying reconstruction quality!" : 
               "In TCVAE, we keep w_I = 1 so we don't penalize Mutual Information! We ONLY apply the heavy 10x penalty to Total Correlation to force disentanglement."}
           </div>
        </div>

        {/* Right: The Generative Consequence */}
        <div className="flex-1 flex flex-col gap-4">
           <div className="bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-6 flex flex-col items-center justify-center flex-grow">
             <h3 className="text-center font-bold text-slate-400 uppercase tracking-widest text-xs mb-4">Resulting Generation</h3>
             <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-slate-600 shadow-lg relative bg-black">
               <motion.img 
                 animate={{ filter: mode === 'beta' ? 'blur(4px)' : 'blur(0px)' }}
                 src="https://picsum.photos/id/1025/200/200" 
                 className="w-full h-full object-cover grayscale transition-all duration-700" 
               />
             </div>
             <div className={`mt-6 px-4 py-2 rounded-lg font-bold text-sm text-center border-2 ${mode === 'beta' ? 'bg-rose-950/50 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-emerald-950/50 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}>
               {mode === 'beta' ? 'Disentangled, but Blurry' : 'Disentangled AND Sharp!'}
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

const TCVAEEstimationSlide = () => {
  const [activeZ, setActiveZ] = useState(0); 
  
  // Fake minibatch data
  const batch = [
    { id: 0, name: "Image A", emoji: "🐶", mu: 20 },
    { id: 1, name: "Image B", emoji: "🐱", mu: 45 },
    { id: 2, name: "Image C", emoji: "🦊", mu: 70 },
    { id: 3, name: "Image D", emoji: "🐻", mu: 90 },
  ];

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-indigo-700">The Minibatch Estimator: The "Mini-Universe"</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          You asked: <em>"What batch is being compared with what, and what are we getting out of it?"</em> We need to calculate the probability of a latent vector across the <strong>entire dataset</strong>. We cheat by pretending our current batch IS the entire dataset!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: The Minibatch Matrix Visualizer */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col relative overflow-hidden">
           <h3 className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-widest text-center">Batch Size: M = 4</h3>
           <p className="text-xs text-slate-500 text-center mb-6">We take ONE vector <span className="font-mono font-bold text-indigo-600">z_{activeZ}</span> and ask every other image's Encoder: <em>"Would you have generated this?"</em></p>
           
           <div className="flex-grow relative flex flex-col items-center justify-center w-full">
              
              <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner">
                 
                 {/* Target Z indicator */}
                 <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
                    <span className="text-sm font-bold text-slate-700">Evaluate <span className="font-mono text-indigo-600 bg-indigo-100 px-1 rounded border border-indigo-200">z_{activeZ}</span> (produced by {batch[activeZ].emoji})</span>
                    <div className="flex gap-1">
                      {batch.map((b, i) => (
                        <button key={i} onClick={() => setActiveZ(i)} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${activeZ === i ? 'bg-indigo-600 text-white shadow-md scale-110' : 'bg-slate-200 hover:bg-slate-300 grayscale'}`}>{b.emoji}</button>
                      ))}
                    </div>
                 </div>

                 {/* The Matrix */}
                 <div className="flex flex-col gap-3">
                    {batch.map((item, index) => {
                      const isActiveTarget = activeZ === index;
                      const targetMu = batch[activeZ].mu;
                      const dist = Math.abs(item.mu - targetMu);
                      // Probability is high if distance is low
                      const probability = Math.max(0.01, Math.exp(-dist / 20));

                      return (
                        <div key={item.id} className={`flex items-center gap-4 p-2 rounded-lg transition-colors ${isActiveTarget ? 'bg-indigo-100 border border-indigo-200' : 'bg-white border border-slate-100'}`}>
                           <div className="w-8 h-8 text-xl flex items-center justify-center shrink-0">{item.emoji}</div>
                           
                           <div className="flex-grow flex items-center text-xs font-mono text-slate-600">
                             q( <span className="text-indigo-600 font-bold mx-1">z_{activeZ}</span> | x_{index} )
                           </div>

                           {/* Probability Bar */}
                           <div className="w-32 h-4 bg-slate-200 rounded-full overflow-hidden relative flex items-center">
                              <motion.div animate={{ width: `${probability * 100}%` }} className={`absolute h-full ${isActiveTarget ? 'bg-indigo-500' : 'bg-emerald-400'}`} />
                           </div>
                           
                           <div className="w-12 text-right font-mono text-xs font-bold">
                             {probability.toFixed(2)}
                           </div>
                        </div>
                      );
                    })}
                 </div>

                 {/* The Summation Math */}
                 <div className="mt-4 pt-4 border-t border-slate-300 flex justify-between items-center bg-slate-800 text-white p-3 rounded-lg shadow-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl"></div>
                    <span className="text-[10px] uppercase font-bold text-slate-300 tracking-widest relative z-10">Average Results = </span>
                    <span className="font-mono text-lg font-bold text-emerald-400 relative z-10">
                       q(z_{activeZ}) ≈ {(batch.reduce((sum, item) => sum + Math.max(0.01, Math.exp(-Math.abs(item.mu - batch[activeZ].mu) / 20)), 0) / 4).toFixed(3)}
                    </span>
                 </div>

              </div>
           </div>
        </div>

        {/* Right: The Math Breakdown */}
        <div className="flex-1 flex flex-col gap-4">
           
           <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700 flex flex-col">
             <h4 className="font-bold text-emerald-400 text-lg mb-4 flex items-center gap-2 border-b border-slate-600 pb-2"><HelpCircle className="w-5 h-5"/> What do we get out of it?</h4>
             
             <p className="text-sm text-slate-300 mb-4 leading-relaxed">
               We successfully calculated <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-1 rounded">q(z_i)</span>! This is the exact number we needed to plug into the Total Correlation (TC) formula. 
             </p>
             <p className="text-sm text-slate-300 leading-relaxed">
               Because we calculated it purely by averaging the Encoders that are already sitting in our GPU memory for this batch, it requires <strong>zero extra neural networks</strong> (unlike FactorVAE which needed a whole Discriminator!).
             </p>
           </div>

           <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-200 flex-grow flex flex-col justify-center">
             <h4 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-2"><ArrowRightLeft className="w-4 h-4"/> The "What is Compared" Summary:</h4>
             <ul className="text-sm text-slate-700 space-y-4">
               <li className="flex items-start gap-2">
                 <span className="text-blue-500 mt-0.5">1.</span>
                 <span>We take <strong>one specific vector</strong> (z) generated by Image A.</span>
               </li>
               <li className="flex items-start gap-2">
                 <span className="text-blue-500 mt-0.5">2.</span>
                 <span>We compare it against the <strong>probability bell curve</strong> (μ, σ²) generated by Image B, Image C, Image D, etc.</span>
               </li>
               <li className="flex items-start gap-2">
                 <span className="text-blue-500 mt-0.5">3.</span>
                 <span>We average the scores. High score means this vector is common. Low score means it's an outlier!</span>
               </li>
             </ul>
           </div>

        </div>

      </div>
    </div>
  );
};

const ComparisonSummarySlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">Comparing Approaches</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          A high-level summary of the evolution of disentangled representation learning in VAEs.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto flex-grow flex flex-col justify-center pb-8">
         <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            
            {/* Table Header */}
            <div className="grid grid-cols-4 bg-slate-800 text-white font-bold text-sm uppercase tracking-widest divide-x divide-slate-600">
               <div className="p-4">Feature</div>
               <div className="p-4 text-center">β-VAE</div>
               <div className="p-4 text-center">FactorVAE</div>
               <div className="p-4 text-center">β-TCVAE</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-slate-100">
               
               <div className="grid grid-cols-4 divide-x divide-slate-100 hover:bg-slate-50 transition-colors">
                 <div className="p-4 font-bold text-slate-700 flex items-center">TC Control</div>
                 <div className="p-4 text-sm text-slate-600 flex items-center justify-center text-center">Indirect (through overall KL penalty)</div>
                 <div className="p-4 text-sm text-slate-600 flex items-center justify-center text-center bg-emerald-50/30 font-semibold">Direct (via explicit TC term)</div>
                 <div className="p-4 text-sm text-slate-600 flex items-center justify-center text-center bg-emerald-50/30 font-semibold">Direct (via decomposed KL weighting)</div>
               </div>

               <div className="grid grid-cols-4 divide-x divide-slate-100 hover:bg-slate-50 transition-colors">
                 <div className="p-4 font-bold text-slate-700 flex items-center">TC Estimation</div>
                 <div className="p-4 text-sm text-slate-600 flex items-center justify-center text-center">Not explicitly estimated</div>
                 <div className="p-4 text-sm text-slate-600 flex items-center justify-center text-center">Discriminator-based (Permutations)</div>
                 <div className="p-4 text-sm text-slate-600 flex items-center justify-center text-center">Minibatch Monte Carlo estimation</div>
               </div>

               <div className="grid grid-cols-4 divide-x divide-slate-100 hover:bg-slate-50 transition-colors">
                 <div className="p-4 font-bold text-slate-700 flex items-center">Hyperparameters</div>
                 <div className="p-4 text-sm font-mono font-bold text-blue-600 flex items-center justify-center text-center">β</div>
                 <div className="p-4 text-sm font-mono font-bold text-indigo-600 flex items-center justify-center text-center">λ, Discriminator Arch</div>
                 <div className="p-4 text-sm font-mono font-bold text-purple-600 flex items-center justify-center text-center">w_I, w_TC, w_DKL</div>
               </div>

               <div className="grid grid-cols-4 divide-x divide-slate-100 hover:bg-slate-50 transition-colors">
                 <div className="p-4 font-bold text-slate-700 flex items-center">Complexity & Stability</div>
                 <div className="p-4 text-sm text-slate-600 flex items-center justify-center text-center">Simple & Generally stable</div>
                 <div className="p-4 text-sm text-slate-600 flex items-center justify-center text-center bg-amber-50/30">Higher (train VAE + discriminator, GAN-like stability issues)</div>
                 <div className="p-4 text-sm text-slate-600 flex items-center justify-center text-center bg-amber-50/30">Moderate (estimators can be complex, batch noise affects stability)</div>
               </div>

            </div>
         </div>

         <div className="mt-8 bg-indigo-50 border border-indigo-200 p-6 rounded-2xl text-sm text-indigo-900 shadow-sm">
           <strong>Practical Takeaway:</strong> Both FactorVAE and TCVAE achieve much stronger disentanglement than standard β-VAE at the same level of image quality. However, they add mathematical and computational complexity. If you implement them, pay close attention to your batch sizes (for TCVAE estimation) and discriminator training stability (for FactorVAE).
         </div>
      </div>
    </div>
  );
};

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Reordered and updated slides array
  const slides = [
    TheSledgehammerSlide,
    LatentVariablesClarificationSlide, 
    TotalCorrelationSlide,
    JointVsMarginalSlide,
    FactorVAEPipelineSlide, 
    FactorVAEMathVisualizerSlide, 
    TCVAEDecompositionMathSlide, // NEW SLIDE: Math Decomposition and Jargon
    TCVAESlide,
    TCVAEWeightingSlide,    
    TCVAEEstimationSlide,   // OVERHAULED SLIDE: Minibatch Estimator Matrix
    ComparisonSummarySlide
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