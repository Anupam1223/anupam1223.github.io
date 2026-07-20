import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Scale, 
  ArrowRight, Maximize, Minimize, 
  Layers, Target, Activity, 
  Settings, Image as ImageIcon,
  Grid, Cpu, AlignCenter
} from 'lucide-react';

// --- SLIDE 1: The Two Pillars of ELBO ---
const ELBOPillarsSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">The Two Pillars of the ELBO</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          The Evidence Lower Bound (ELBO) is the objective function we want to <strong>maximize</strong>. It consists of two competing forces that define how a VAE learns.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Pilar 1: Reconstruction */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border-t-4 border-t-blue-500 border border-slate-700 p-6 flex flex-col relative overflow-hidden group">
           <h3 className="font-bold text-blue-400 mb-2 text-xl flex items-center gap-2">
             1. Reconstruction Term
           </h3>
           <div className="font-mono text-sm bg-slate-950 p-2 rounded border border-slate-700 text-slate-300 mb-4 text-center">
             E[ log p_θ(x|z) ]
           </div>
           
           <div className="flex-grow flex flex-col justify-center items-center gap-4 relative">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-700 rounded-lg border-2 border-slate-600 flex items-center justify-center relative overflow-hidden">
                  <span className="text-2xl z-10 relative">🐶</span>
                  <div className="absolute inset-0 bg-blue-500/20"></div>
                </div>
                <div className="flex flex-col items-center text-slate-500">
                  <ArrowRight className="w-5 h-5"/>
                  <span className="text-[10px] font-mono">Decoder</span>
                </div>
                <div className="w-16 h-16 bg-slate-700 rounded-lg border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center relative overflow-hidden">
                  <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="text-2xl z-10 relative">🐶</motion.span>
                </div>
             </div>
             
             <div className="bg-blue-950/40 p-4 rounded-xl border border-blue-500/30 mt-4">
               <p className="text-sm text-blue-200/80 leading-relaxed">
                 <strong>Goal:</strong> High Fidelity. <br/>
                 Measures how well the decoder can rebuild the original input from the latent code. Depending on the data type, this is often Binary Cross-Entropy (BCE) or Mean Squared Error (MSE).
               </p>
             </div>
           </div>
        </div>

        {/* Pilar 2: Regularization */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border-t-4 border-t-indigo-500 border border-slate-700 p-6 flex flex-col relative overflow-hidden group">
           <h3 className="font-bold text-indigo-400 mb-2 text-xl flex items-center gap-2">
             2. Regularization Term
           </h3>
           <div className="font-mono text-sm bg-slate-950 p-2 rounded border border-slate-700 text-slate-300 mb-4 text-center">
             - D_KL( q_φ(z|x) || p(z) )
           </div>
           
           <div className="flex-grow flex flex-col justify-center items-center gap-4 relative">
             
             <div className="w-40 h-32 relative flex items-center justify-center mt-4">
               {/* Prior */}
               <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-indigo-400/60 flex items-center justify-center">
                 <span className="absolute -top-6 text-xs text-indigo-300 font-mono">Prior p(z)</span>
               </div>
               {/* Encoded Distribution */}
               <motion.div 
                 animate={{ x: [20, 0], y: [15, 0], scale: [0.6, 0.9] }}
                 transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
                 className="absolute w-20 h-20 bg-indigo-500/40 border border-indigo-400 rounded-full flex items-center justify-center backdrop-blur-sm"
               >
                 <span className="text-[10px] text-white font-mono">q(z|x)</span>
               </motion.div>
             </div>

             <div className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-500/30 mt-auto">
               <p className="text-sm text-indigo-200/80 leading-relaxed">
                 <strong>Goal:</strong> Structure & Continuity. <br/>
                 Forces the encoded distributions to match a chosen prior (usually a standard Gaussian). This prevents "holes" in the latent space and ensures generating from random noise works.
               </p>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 2: The Inherent Trade-off ---
const TradeoffSlide = () => {
  const [balance, setBalance] = useState(50); // 0 = 100% Recon, 100 = 100% Reg

  const isReconHeavy = balance < 30;
  const isBalanced = balance >= 30 && balance <= 70;
  const isRegHeavy = balance > 70;

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The Inherent Trade-off</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          These two terms pull the model in opposite directions. Adjust the slider to see what happens when one term dominates the other.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Interactive Viewer */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col relative overflow-hidden items-center">
          
          <div className="w-full max-w-md mb-8 relative z-10">
             <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
               <span className={`${isReconHeavy ? 'text-blue-600 scale-110' : ''} transition-all origin-left`}>Prioritize Recon</span>
               <span className={`${isBalanced ? 'text-emerald-600 scale-110' : ''} transition-all`}>Balanced</span>
               <span className={`${isRegHeavy ? 'text-indigo-600 scale-110' : ''} transition-all origin-right`}>Prioritize Prior</span>
             </div>
             <input 
               type="range" min="0" max="100" value={balance} 
               onChange={(e) => setBalance(parseInt(e.target.value))} 
               className="w-full accent-slate-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
             />
          </div>

          <div className="flex w-full gap-8 h-64">
            {/* Latent Space Viz */}
            <div className="flex-1 bg-slate-900 rounded-xl relative overflow-hidden border-4 border-slate-800 flex items-center justify-center flex-col">
              <span className="text-xs text-slate-400 font-bold absolute top-2 uppercase tracking-widest">Latent Space</span>
              
              <div className="relative w-40 h-40 mt-4">
                {/* Prior Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/20"></div>
                
                {/* Clusters */}
                <motion.div 
                  className="absolute w-12 h-12 bg-blue-500 rounded-full mix-blend-screen opacity-80"
                  animate={{
                    x: isReconHeavy ? -40 : (isBalanced ? -20 : 0),
                    y: isReconHeavy ? -40 : (isBalanced ? -10 : 0),
                    scale: isReconHeavy ? 0.5 : (isBalanced ? 1 : 1.5),
                    filter: isReconHeavy ? 'blur(0px)' : (isBalanced ? 'blur(4px)' : 'blur(10px)')
                  }}
                  transition={{ type: "spring", stiffness: 100 }}
                  style={{ top: '50%', left: '50%', marginTop: '-24px', marginLeft: '-24px' }}
                />
                <motion.div 
                  className="absolute w-12 h-12 bg-emerald-500 rounded-full mix-blend-screen opacity-80"
                  animate={{
                    x: isReconHeavy ? 50 : (isBalanced ? 20 : 0),
                    y: isReconHeavy ? -20 : (isBalanced ? 15 : 0),
                    scale: isReconHeavy ? 0.5 : (isBalanced ? 1 : 1.5),
                    filter: isReconHeavy ? 'blur(0px)' : (isBalanced ? 'blur(4px)' : 'blur(10px)')
                  }}
                  transition={{ type: "spring", stiffness: 100 }}
                  style={{ top: '50%', left: '50%', marginTop: '-24px', marginLeft: '-24px' }}
                />
                <motion.div 
                  className="absolute w-12 h-12 bg-amber-500 rounded-full mix-blend-screen opacity-80"
                  animate={{
                    x: isReconHeavy ? -10 : (isBalanced ? -5 : 0),
                    y: isReconHeavy ? 50 : (isBalanced ? 20 : 0),
                    scale: isReconHeavy ? 0.5 : (isBalanced ? 1 : 1.5),
                    filter: isReconHeavy ? 'blur(0px)' : (isBalanced ? 'blur(4px)' : 'blur(10px)')
                  }}
                  transition={{ type: "spring", stiffness: 100 }}
                  style={{ top: '50%', left: '50%', marginTop: '-24px', marginLeft: '-24px' }}
                />
              </div>

              {isReconHeavy && <span className="absolute bottom-2 text-[10px] text-rose-400 font-bold bg-slate-900/80 px-2 rounded border border-rose-500/50">"Gappy" Space</span>}
              {isRegHeavy && <span className="absolute bottom-2 text-[10px] text-indigo-400 font-bold bg-slate-900/80 px-2 rounded border border-indigo-500/50">Posterior Collapse</span>}
            </div>

            {/* Reconstruction Output Viz */}
            <div className="flex-1 bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-center flex-col relative">
              <span className="text-xs text-slate-500 font-bold absolute top-2 uppercase tracking-widest">Reconstruction</span>
              
              <div className="relative flex items-center justify-center w-full h-full">
                <motion.div
                   className="text-6xl absolute"
                   animate={{ 
                     opacity: isReconHeavy ? 1 : (isBalanced ? 0.9 : 0.3),
                     filter: isReconHeavy ? 'blur(0px)' : (isBalanced ? 'blur(1px)' : 'blur(8px)')
                   }}
                >
                  🏞️
                </motion.div>
                {isRegHeavy && <div className="absolute text-sm font-bold text-slate-400 bg-white/80 p-2 rounded">Average Blob</div>}
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Explanations */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          <AnimatePresence mode="wait">
            {isReconHeavy && (
              <motion.div key="recon" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="bg-blue-50 border border-blue-200 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-blue-800 text-lg mb-2">High-Fidelity Reconstruction</h3>
                <p className="text-sm text-blue-900/80 mb-4 leading-relaxed">
                  The model memorizes exact images. The latent space fractures into tiny, specific dots far away from the prior. 
                </p>
                <div className="text-xs bg-white p-3 rounded border border-blue-100 text-blue-700">
                  <strong>Consequence:</strong> Excellent reconstructions, but terrible generation. Sampling random points hits the "gaps" and produces noise.
                </div>
              </motion.div>
            )}

            {isBalanced && (
              <motion.div key="bal" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-emerald-800 text-lg mb-2">The Sweet Spot</h3>
                <p className="text-sm text-emerald-900/80 mb-4 leading-relaxed">
                  Clusters are spread out just enough to distinguish different images, but packed tightly enough inside the prior to ensure the space is continuous.
                </p>
                <div className="text-xs bg-white p-3 rounded border border-emerald-100 text-emerald-700">
                  <strong>Consequence:</strong> Good reconstructions and smooth interpolations when generating new data.
                </div>
              </motion.div>
            )}

            {isRegHeavy && (
              <motion.div key="reg" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-indigo-800 text-lg mb-2">Strong Regularization</h3>
                <p className="text-sm text-indigo-900/80 mb-4 leading-relaxed">
                  The model is terrified of the KL penalty and forces all latent distributions to match the prior exactly. The latent code loses all specific information about the input `x`.
                </p>
                <div className="text-xs bg-white p-3 rounded border border-indigo-100 text-indigo-700">
                  <strong>Consequence:</strong> Posterior Collapse. The decoder just outputs a blurry average of the entire dataset.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};


// --- SLIDE 3: Beta-VAE Objective ---
const BetaVAESlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">The β-VAE Objective</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          To explicitly control this trade-off, we introduce a hyperparameter <strong>β</strong> to weight the KL term. This is primarily done to encourage <em>disentangled representations</em>.
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-2xl mb-8 flex items-center justify-center">
        <div className="font-mono text-xl md:text-3xl font-bold text-center flex flex-wrap justify-center items-center gap-4">
          <span className="text-slate-300">L<sub className="text-sm">β-VAE</sub> = </span>
          <span className="text-blue-400">E[log p(x|z)]</span>
          <span className="text-slate-500">-</span>
          <span className="text-amber-400 bg-amber-400/10 px-2 rounded border border-amber-400/30">β</span>
          <span className="text-indigo-400">D<sub className="text-sm">KL</sub>(q(z|x)||p(z))</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full flex-grow pb-8">
        
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg flex flex-col hover:border-blue-500 transition-colors">
          <h3 className="font-mono text-xl font-bold text-blue-400 mb-4 border-b border-slate-700 pb-2">0 {'<'} β {'<'} 1</h3>
          <h4 className="font-bold text-slate-200 mb-2">Reconstruction Priority</h4>
          <p className="text-sm text-slate-400 leading-relaxed flex-grow">
            Less weight on the KL term. Useful when standard VAE produces overly blurry results and high visual fidelity is strictly required.
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg flex flex-col hover:border-emerald-500 transition-colors relative transform scale-105 z-10 border-t-4 border-t-emerald-500">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Standard VAE</div>
          <h3 className="font-mono text-xl font-bold text-emerald-400 mb-4 border-b border-slate-700 pb-2">β = 1</h3>
          <h4 className="font-bold text-slate-200 mb-2">The Original ELBO</h4>
          <p className="text-sm text-slate-400 leading-relaxed flex-grow">
            Recovers the mathematically pure Evidence Lower Bound. Balances reconstruction with a structured prior seamlessly.
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg flex flex-col hover:border-amber-500 transition-colors">
          <h3 className="font-mono text-xl font-bold text-amber-400 mb-4 border-b border-slate-700 pb-2">β {'>'} 1</h3>
          <h4 className="font-bold text-slate-200 mb-2">Disentanglement Priority</h4>
          <p className="text-sm text-slate-400 leading-relaxed flex-grow">
            Puts immense pressure on the encoder to match the prior (which is factorial/independent). Forces individual latent dimensions to represent distinct, interpretable factors of variation (e.g., one dimension controls 'smile', another controls 'hair color').
          </p>
          <div className="bg-rose-950/40 p-2 rounded text-xs text-rose-300 mt-4 border border-rose-900">
            Sacrifices reconstruction quality.
          </div>
        </div>

      </div>
    </div>
  );
};


// --- SLIDE 4: Impact of the Prior ---
const PriorImpactSlide = () => {
  const [priorType, setPriorType] = useState('gaussian');

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Impact of the Prior p(z)</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          The KL divergence pulls the learned encodings towards a specific target distribution. Changing the target prior completely changes the geometry of the latent space.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Interactive Viewer */}
        <div className="flex-[1.2] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col items-center justify-center relative">
          
          <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200">
             <button 
               onClick={() => setPriorType('gaussian')} 
               className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${priorType === 'gaussian' ? 'bg-indigo-500 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
             >
               Standard Gaussian N(0,I)
             </button>
             <button 
               onClick={() => setPriorType('gmm')} 
               className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${priorType === 'gmm' ? 'bg-indigo-500 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
             >
               Gaussian Mixture Model (GMM)
             </button>
          </div>

          <div className="w-full max-w-[350px] h-[350px] bg-slate-900 rounded-xl border-4 border-slate-800 shadow-inner relative flex items-center justify-center overflow-hidden">
            
            <AnimatePresence mode="wait">
              {priorType === 'gaussian' ? (
                <motion.div key="gauss" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 flex items-center justify-center">
                  {/* Single Prior Target */}
                  <div className="w-48 h-48 rounded-full border-2 border-dashed border-indigo-400/50 absolute"></div>
                  
                  {/* Clustered Data Points */}
                  <motion.div animate={{ scale: [0.95, 1.05, 0.95] }} transition={{ duration: 4, repeat: Infinity }} className="absolute w-24 h-24 bg-blue-500 rounded-full mix-blend-screen blur-md opacity-70" style={{ transform: 'translate(-20px, -20px)' }}></motion.div>
                  <motion.div animate={{ scale: [1.05, 0.95, 1.05] }} transition={{ duration: 3.5, repeat: Infinity }} className="absolute w-20 h-20 bg-emerald-500 rounded-full mix-blend-screen blur-md opacity-70" style={{ transform: 'translate(30px, 10px)' }}></motion.div>
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity }} className="absolute w-28 h-28 bg-rose-500 rounded-full mix-blend-screen blur-md opacity-70" style={{ transform: 'translate(-10px, 30px)' }}></motion.div>
                </motion.div>
              ) : (
                <motion.div key="gmm" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 flex items-center justify-center">
                  {/* Multi Prior Targets */}
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-amber-400/50 absolute top-4 left-4"></div>
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-400/50 absolute bottom-8 right-8"></div>
                  <div className="w-28 h-28 rounded-full border-2 border-dashed border-rose-400/50 absolute bottom-12 left-10"></div>
                  
                  {/* Clustered Data Points separating into the components */}
                  <motion.div animate={{ scale: [0.95, 1.05, 0.95] }} transition={{ duration: 4, repeat: Infinity }} className="absolute w-24 h-24 bg-amber-500 rounded-full mix-blend-screen blur-md opacity-80" style={{ top: '32px', left: '32px' }}></motion.div>
                  <motion.div animate={{ scale: [1.05, 0.95, 1.05] }} transition={{ duration: 3.5, repeat: Infinity }} className="absolute w-20 h-20 bg-emerald-500 rounded-full mix-blend-screen blur-md opacity-80" style={{ bottom: '40px', right: '40px' }}></motion.div>
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity }} className="absolute w-20 h-20 bg-rose-500 rounded-full mix-blend-screen blur-md opacity-80" style={{ bottom: '64px', left: '56px' }}></motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Dynamic Explanations */}
        <div className="flex-1 flex flex-col justify-center gap-6">
          <AnimatePresence mode="wait">
             {priorType === 'gaussian' ? (
               <motion.div key="gauss-text" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="flex flex-col gap-4">
                 <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl shadow-sm">
                   <h3 className="font-bold text-indigo-800 text-lg mb-2">The Standard Choice</h3>
                   <ul className="text-sm text-indigo-900/80 space-y-2 list-disc pl-4">
                     <li>Implies each latent dimension is <strong>independent</strong>.</li>
                     <li>Implies each dimension is <strong>centered at zero</strong> with unit variance.</li>
                     <li>Excellent for <em>disentanglement</em> (forcing independence).</li>
                   </ul>
                 </div>
                 <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                   <h4 className="font-bold text-slate-700 mb-1">The Problem</h4>
                   <p className="text-sm text-slate-600">The true underlying structure of your complex data might not actually look like a single round sphere. Forcing it into one can cause blurry reconstructions or conflicting feature mappings.</p>
                 </div>
               </motion.div>
             ) : (
               <motion.div key="gmm-text" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="flex flex-col gap-4">
                 <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl shadow-sm">
                   <h3 className="font-bold text-amber-800 text-lg mb-2">Complex Priors (e.g., GMMs)</h3>
                   <p className="text-sm text-amber-900/80 mb-4">
                     If you believe your data has distinct, categorical clusters (e.g., handwritten digits 0-9), a GMM prior provides multiple "targets" for the KL divergence.
                   </p>
                   <ul className="text-sm text-amber-900/80 space-y-2 list-disc pl-4">
                     <li>Encourages the encoder to map inputs to distinct, separated clusters.</li>
                     <li>Prevents the model from forcing distinct concepts to overlap.</li>
                   </ul>
                 </div>
                 <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                   <h4 className="font-bold text-slate-700 mb-1">Learnable Priors</h4>
                   <p className="text-sm text-slate-600">Instead of hard-coding the prior shape, advanced techniques like <strong>Normalizing Flows</strong> allow the prior distribution itself to be learned from the data, adapting to highly complex manifolds.</p>
                 </div>
               </motion.div>
             )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};


// --- SLIDE 5: Weighting the Objective (Numerical Scaling) ---
const WeightingSlide = () => {
  const [lambdaKL, setLambdaKL] = useState(1);
  const [lambdaRec, setLambdaRec] = useState(1);
  
  // Fake scales based on text: MSE is often [0,255] making it huge. KL is usually 10s or 100s.
  const rawRecon = 15000; 
  const rawKL = 50;

  const weightedRecon = rawRecon * lambdaRec;
  const weightedKL = rawKL * lambdaKL;

  // Calculate rotation for seesaw (simulate balance)
  // Let's say perfect balance means weightedRecon ≈ weightedKL.
  // We'll map the ratio to an angle between -30 (KL heavy) and 30 (Recon heavy).
  const total = weightedRecon + weightedKL;
  const reconRatio = weightedRecon / total; // 0 to 1
  const rotationAngle = (reconRatio - 0.5) * -60; // if reconRatio=1 -> -30deg (tips left)

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">The Scale Imbalance Problem</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          In practice, the numerical scale of MSE (e.g., squared pixel differences on [0, 255]) can be massive compared to KL divergence. This makes the KL gradient negligible during optimization.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Seesaw Animation */}
        <div className="flex-[1.5] bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col relative items-center justify-center overflow-hidden">
          
          {/* Formula */}
          <div className="absolute top-6 w-full text-center font-mono text-sm px-4">
             <span className="text-slate-300">Loss = </span>
             <span className="text-blue-400 border border-blue-500/50 bg-blue-900/30 px-1 rounded">λ_rec</span>
             <span className="text-slate-400"> × (Recon Loss) + </span>
             <span className="text-indigo-400 border border-indigo-500/50 bg-indigo-900/30 px-1 rounded">λ_KL</span>
             <span className="text-slate-400"> × (KL Div)</span>
          </div>

          <div className="relative w-full max-w-md h-64 mt-16 flex flex-col items-center justify-end pb-8">
             
             {/* The Beam */}
             <motion.div 
                className="w-full h-4 bg-slate-600 rounded-full relative z-10 flex justify-between items-center px-4"
                animate={{ rotate: rotationAngle }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
             >
                {/* Recon Box */}
                <div className="absolute left-4 bottom-full mb-1 flex flex-col items-center" style={{ transform: 'rotate(0deg)'}}>
                  <div className="bg-blue-500 w-20 flex flex-col items-center justify-center rounded-lg shadow-lg border-2 border-blue-400 p-2" style={{ height: `${Math.min(120, Math.max(40, Math.log10(weightedRecon)*15))}px`}}>
                    <span className="text-xs font-bold text-white mb-1 uppercase">Recon</span>
                    <span className="text-[10px] font-mono text-blue-100">Val: {Math.round(weightedRecon)}</span>
                  </div>
                </div>

                {/* KL Box */}
                <div className="absolute right-4 bottom-full mb-1 flex flex-col items-center" style={{ transform: 'rotate(0deg)'}}>
                  <div className="bg-indigo-500 w-20 flex flex-col items-center justify-center rounded-lg shadow-lg border-2 border-indigo-400 p-2" style={{ height: `${Math.min(120, Math.max(40, Math.log10(weightedKL)*15))}px`}}>
                    <span className="text-xs font-bold text-white mb-1 uppercase">KL Div</span>
                    <span className="text-[10px] font-mono text-indigo-100">Val: {Math.round(weightedKL)}</span>
                  </div>
                </div>
             </motion.div>

             {/* The Pivot */}
             <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-slate-400 mt-[-2px] z-0"></div>
          </div>
          
          <div className="mt-8 text-center text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg w-full">
            If the seesaw is tilted all the way to one side, the optimizer's gradients will almost entirely ignore the other term.
          </div>
        </div>

        {/* Controls and Explanations */}
        <div className="flex-1 flex flex-col justify-center gap-6">
          
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-inner">
             <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Explicit Multipliers</h4>
             
             <div className="flex flex-col gap-4 mb-6">
               <div className="flex flex-col gap-2">
                 <div className="flex justify-between items-center">
                   <label className="text-xs font-bold text-blue-400">λ_rec (Recon Weight)</label>
                   <span className="font-mono text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded">{lambdaRec}x</span>
                 </div>
                 <input type="range" min="0.001" max="1" step="0.001" value={lambdaRec} onChange={(e) => setLambdaRec(parseFloat(e.target.value))} className="w-full accent-blue-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
               </div>

               <div className="flex flex-col gap-2">
                 <div className="flex justify-between items-center">
                   <label className="text-xs font-bold text-indigo-400">λ_KL (KL Weight)</label>
                   <span className="font-mono text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded">{lambdaKL}x</span>
                 </div>
                 <input type="range" min="1" max="1000" step="1" value={lambdaKL} onChange={(e) => setLambdaKL(parseFloat(e.target.value))} className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
               </div>
             </div>

             <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/30">
               <p className="text-xs text-emerald-300 leading-relaxed">
                 <strong>Solution:</strong> To restore balance, practitioners often scale down λ_rec (e.g., averaging MSE across pixels instead of summing) or scale up λ_KL significantly so both gradients contribute meaningfully.
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
    ELBOPillarsSlide,
    TradeoffSlide,
    BetaVAESlide,
    PriorImpactSlide,
    WeightingSlide
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
      <div className="flex justify-between items-center p-4 md:p-6 bg-white border-t border-slate-300 z-10 shadow-lg">
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