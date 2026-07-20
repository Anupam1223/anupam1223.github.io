import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, CheckCircle, XCircle, 
  Target, Layers, Lock, Unlock, ArrowDown, ArrowRight, 
  Activity, Search, Crosshair, BarChart3, ScatterChart, 
  Image as ImageIcon, Fingerprint, ShieldAlert, Zap, 
  TrendingUp, Copy, AlertTriangle, RefreshCw, Eye, BrainCircuit,
  Map, SlidersHorizontal, Stethoscope, Scissors, Scale, Cpu, Link, HelpCircle
} from 'lucide-react';

// --- SLIDE 1: Introduction to Evaluation ---
const IntroEvaluationSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center shrink-0">Evaluating Representation Quality</h2>
      <p className="text-slate-600 mb-10 text-center max-w-3xl mx-auto shrink-0 text-sm md:text-base">
        We built an Encoder. We squished the data into a latent space. <strong className="text-indigo-700">But is it actually any good?</strong> Evaluating representations is a major challenge because "goodness" depends entirely on what you want to use it for.
      </p>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 w-full max-w-5xl mx-auto flex-grow pb-8">
        
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Search className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Intrinsic Evaluation</h3>
          <p className="text-slate-600 text-sm flex-grow">
            Measuring the <strong>inherent mathematical properties</strong> of the representation space itself, without worrying about a complex downstream app. 
            <br/><br/>
            <em>"Does it retain info? Are the classes naturally separated? Is it disentangled?"</em>
          </p>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Target className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Extrinsic Evaluation</h3>
          <p className="text-slate-600 text-sm flex-grow">
            Measuring performance by actually <strong>plugging it into a real-world downstream task</strong>.
            <br/><br/>
            <em>"Did using these features make my final app more accurate, faster to train, and more robust?"</em>
          </p>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 2: Linear Probing Overview ---
const LinearProbingSlide = () => {
  const [probeStatus, setProbeStatus] = useState('idle'); 
  const [repQuality, setRepQuality] = useState('good'); 

  const handleTrain = () => {
    setProbeStatus('training');
    setTimeout(() => setProbeStatus('done'), 1500);
  };

  useEffect(() => { setProbeStatus('idle'); }, [repQuality]);

  const generatePoints = (quality) => {
    const points = [];
    for (let i = 0; i < 60; i++) {
      const isClassA = i < 30;
      if (quality === 'good') {
        points.push({
          id: i, isClassA,
          x: isClassA ? 20 + Math.random() * 25 : 60 + Math.random() * 25,
          y: isClassA ? 20 + Math.random() * 60 : 20 + Math.random() * 60
        });
      } else {
        const region = Math.random();
        let x, y;
        if (isClassA) {
          x = region > 0.5 ? 10 + Math.random() * 30 : 60 + Math.random() * 30;
          y = region > 0.5 ? 10 + Math.random() * 30 : 60 + Math.random() * 30;
        } else {
          x = region > 0.5 ? 60 + Math.random() * 30 : 10 + Math.random() * 30;
          y = region > 0.5 ? 10 + Math.random() * 30 : 60 + Math.random() * 30;
        }
        points.push({ id: i, isClassA, x, y });
      }
    }
    return points;
  };

  const [points, setPoints] = useState(generatePoints('good'));
  useEffect(() => { setPoints(generatePoints(repQuality)); }, [repQuality]);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Intrinsic Eval 1: Linear Probing</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          If a learned representation is truly good, it should untangle the data so well that even the "dumbest" model—a simple straight line (Linear Classifier)—can easily solve the task. <strong>The simplicity of the probe is the entire point!</strong>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* LEFT: The Flowchart */}
        <div className="lg:w-[45%] bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center relative border border-slate-700">
           <div className="w-full bg-slate-700/50 border border-slate-600 p-4 rounded-xl flex flex-col items-center relative z-10">
              <span className="text-slate-300 font-bold text-sm mb-3 flex items-center gap-2">
                 Learned Representation (Frozen) <Lock className="w-4 h-4 text-rose-400" />
              </span>
              <div className="bg-slate-600 w-full py-3 rounded-lg text-center shadow-inner border border-slate-500 relative overflow-hidden text-sm text-slate-200">
                 Input Data (x) → Representation Encoder → z
              </div>
           </div>

           <div className="h-8 border-l-2 border-slate-500 relative flex items-center justify-center -my-1 z-0">
             <ArrowDown className="absolute -bottom-3 -left-[11px] text-slate-500 w-5 h-5" />
           </div>

           <div className="w-full bg-slate-700/50 border border-slate-600 p-4 rounded-xl flex flex-col items-center relative z-10 mt-2">
              <span className="text-slate-300 font-bold text-sm mb-3 flex items-center gap-2">
                 Linear Probe <Unlock className="w-4 h-4 text-emerald-400" />
              </span>
              <div className="bg-slate-600 w-full py-3 rounded-lg flex flex-col items-center justify-center shadow-inner border border-slate-500 relative overflow-hidden text-sm text-slate-200">
                 <span>Linear Classifier</span>
                 <span className="font-mono text-emerald-300 mt-1 text-xs">w_probeᵀ z + b_probe</span>
              </div>
           </div>
           
           <div className="mt-4 bg-slate-900/50 border border-slate-600 p-3 rounded-lg text-xs text-slate-300 w-full text-center">
             <strong>Why Linear?</strong> If we used a complex neural network here, it might "cheat" and solve a bad representation for us, hiding the flaws!
           </div>
        </div>

        {/* RIGHT: Interactive Sandbox */}
        <div className="lg:w-[55%] bg-white rounded-2xl shadow-xl p-6 border border-slate-200 flex flex-col relative">
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <ScatterChart className="w-5 h-5 text-indigo-600"/> Probing Simulator
            </h3>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
               <button onClick={() => setRepQuality('bad')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${repQuality === 'bad' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Entangled Space</button>
               <button onClick={() => setRepQuality('good')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${repQuality === 'good' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Separable Space</button>
            </div>
          </div>

          <div className="flex-grow bg-slate-50 rounded-xl border-2 border-slate-200 relative overflow-hidden flex items-center justify-center mb-4">
             <div className="relative w-full h-full max-w-[400px] max-h-[300px]">
               {points.map(p => (
                 <motion.div key={p.id} animate={{ left: `${p.x}%`, top: `${p.y}%` }} transition={{ type: "spring", stiffness: 100, damping: 15 }} className={`absolute w-3 h-3 rounded-full shadow-sm transform -translate-x-1/2 -translate-y-1/2 border border-white ${p.isClassA ? 'bg-orange-500' : 'bg-indigo-500'}`} />
               ))}
               <AnimatePresence>
                 {probeStatus !== 'idle' && (
                   <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1, rotate: repQuality === 'good' ? 15 : -45 }} exit={{ opacity: 0 }} transition={{ duration: 1, type: "spring" }} className="absolute top-0 bottom-0 left-1/2 w-1 bg-emerald-500 origin-center z-10" />
                 )}
               </AnimatePresence>
             </div>
          </div>

          <div className="flex items-center justify-between bg-slate-100 p-4 rounded-xl border border-slate-200">
             <button onClick={handleTrain} disabled={probeStatus === 'training'} className={`px-6 py-2.5 rounded-lg font-bold shadow-md transition-all flex items-center gap-2 ${probeStatus === 'training' ? 'bg-slate-300 text-slate-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
               <Crosshair className="w-5 h-5" /> {probeStatus === 'training' ? 'Finding Boundary...' : 'Train Linear Probe'}
             </button>
             <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Probe Accuracy</span>
                {probeStatus === 'idle' && <span className="text-xl font-mono text-slate-400 font-bold">--%</span>}
                {probeStatus === 'training' && <span className="text-xl font-mono text-indigo-500 font-bold animate-pulse">Computing</span>}
                {probeStatus === 'done' && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className={`text-2xl font-mono font-bold flex items-center gap-2 ${repQuality === 'good' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {repQuality === 'good' ? '98.5%' : '52.1%'}
                    {repQuality === 'good' ? <CheckCircle className="w-6 h-6"/> : <XCircle className="w-6 h-6"/>}
                  </motion.span>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SLIDE 3: Clustering Quality ---
const ClusteringQualitySlide = () => {
  const [showClusters, setShowClusters] = useState(false);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Intrinsic Eval 2: Clustering Quality</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          If data has natural categories (e.g., dogs, cats, birds), a good representation will group them tightly together in latent space without us telling it to. We use algorithms like <strong>K-Means</strong> to find these groups and compare them to ground-truth labels.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Interactive Visualizer */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-slate-200 flex flex-col items-center">
           <h3 className="font-bold text-slate-700 mb-4 uppercase tracking-widest text-xs">Latent Space Map</h3>
           
           <div className="relative w-full max-w-[300px] h-[300px] bg-slate-100 rounded-xl border-2 border-slate-200 overflow-hidden mb-6">
              {/* Fake Clusters */}
              <div className="absolute top-[20%] left-[30%]">
                 <div className={`absolute w-24 h-24 -ml-12 -mt-12 rounded-full transition-all duration-1000 ${showClusters ? 'bg-indigo-500/20 border-2 border-indigo-500' : 'opacity-0'}`}></div>
                 <div className="absolute w-3 h-3 bg-indigo-500 rounded-full shadow-sm -ml-2 -mt-4"></div>
                 <div className="absolute w-3 h-3 bg-indigo-500 rounded-full shadow-sm ml-4 -mt-2"></div>
                 <div className="absolute w-3 h-3 bg-indigo-500 rounded-full shadow-sm -ml-5 mt-4"></div>
                 <div className="absolute w-3 h-3 bg-indigo-500 rounded-full shadow-sm ml-2 mt-2"></div>
                 <div className="absolute w-3 h-3 bg-rose-500 rounded-full shadow-sm ml-6 mt-6"></div>
              </div>

              <div className="absolute top-[65%] left-[70%]">
                 <div className={`absolute w-28 h-24 -ml-14 -mt-12 rounded-full transition-all duration-1000 ${showClusters ? 'bg-rose-500/20 border-2 border-rose-500' : 'opacity-0'}`}></div>
                 <div className="absolute w-3 h-3 bg-rose-500 rounded-full shadow-sm -ml-2 -mt-4"></div>
                 <div className="absolute w-3 h-3 bg-rose-500 rounded-full shadow-sm ml-4 -mt-2"></div>
                 <div className="absolute w-3 h-3 bg-rose-500 rounded-full shadow-sm -ml-6 mt-2"></div>
                 <div className="absolute w-3 h-3 bg-rose-500 rounded-full shadow-sm ml-2 mt-4"></div>
                 <div className="absolute w-3 h-3 bg-rose-500 rounded-full shadow-sm ml-6 -mt-6"></div>
              </div>
              
              <div className="absolute top-[80%] left-[20%] w-3 h-3 bg-indigo-500 rounded-full shadow-sm"></div>
           </div>

           <button 
             onClick={() => setShowClusters(!showClusters)}
             className="px-6 py-2 rounded-full font-bold shadow-md transition-all flex items-center gap-2 bg-slate-800 text-white hover:bg-slate-700"
           >
             {showClusters ? <><Eye className="w-4 h-4"/> Hide Predicted Clusters</> : <><Target className="w-4 h-4"/> Run K-Means Clustering</>}
           </button>
        </div>

        {/* Metrics Definitions */}
        <div className="flex-1 flex flex-col gap-4">
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h4 className="font-bold text-indigo-900 mb-1">NMI (Normalized Mutual Info)</h4>
             <p className="text-sm text-slate-600 mb-2">Measures agreement between algorithm clusters and ground truth, normalized to <span className="font-mono text-xs bg-slate-100 px-1 rounded">[0, 1]</span>.</p>
             <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">0.0 (Random)</span>
                <div className="flex-grow h-2 bg-gradient-to-r from-rose-400 to-emerald-400 rounded-full relative">
                  {showClusters && <motion.div initial={{ left: 0 }} animate={{ left: '85%' }} className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-800 border-2 border-white rounded-full shadow"></motion.div>}
                </div>
                <span className="text-slate-400">1.0 (Perfect)</span>
             </div>
           </div>

           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h4 className="font-bold text-indigo-900 mb-1">ARI (Adjusted Rand Index)</h4>
             <p className="text-sm text-slate-600 mb-2">Similar to NMI, but mathematically corrects for chance. If you just guessed clusters randomly, ARI would be 0.</p>
             <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">0.0</span>
                <div className="flex-grow h-2 bg-gradient-to-r from-rose-400 to-emerald-400 rounded-full relative">
                  {showClusters && <motion.div initial={{ left: 0 }} animate={{ left: '80%' }} className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-800 border-2 border-white rounded-full shadow"></motion.div>}
                </div>
                <span className="text-slate-400">1.0</span>
             </div>
           </div>

           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h4 className="font-bold text-indigo-900 mb-1">Purity</h4>
             <p className="text-sm text-slate-600 mb-2">Assigns each predicted cluster to whatever true label is most frequent inside it. <em>(Look at the top-left cluster: mostly blue dots, but one red dot ruins perfect purity!)</em></p>
             {showClusters && (
               <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-2 rounded flex items-start gap-2">
                 <AlertTriangle className="w-4 h-4 shrink-0" />
                 <span>Purity is easy to "cheat". If you make 100 clusters for 100 data points, purity is 100%! NMI and ARI are usually safer metrics.</span>
               </div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 4: Reconstruction & The Identity Trap ---
const ReconstructionSlide = () => {
  const [bottleneck, setBottleneck] = useState(3); // 1 = trivial, 2 = good, 3 = too small

  const getReconstructionVisual = () => {
    if (bottleneck === 1) return { blur: '0px', mse: '0.001', note: 'Perfect! (But useless)', img: "https://picsum.photos/id/1025/200/200" };
    if (bottleneck === 2) return { blur: '2px', mse: '0.045', note: 'Slightly blurry, but learned structure.', img: "https://picsum.photos/id/1025/200/200" };
    return { blur: '8px', mse: '0.892', note: 'Too compressed. Lost all details.', img: "https://picsum.photos/id/1025/200/200" };
  };

  const visual = getReconstructionVisual();

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Intrinsic Eval 3: Reconstruction Quality</h2>
      <p className="text-slate-600 text-center max-w-4xl mx-auto text-sm md:text-base mb-8">
        For autoencoders, we measure how perfectly <span className="font-mono bg-slate-200 px-1 rounded">x'</span> matches the original <span className="font-mono bg-slate-200 px-1 rounded">x</span>. But beware of the <strong>Identity Trap</strong>!
      </p>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow pb-8 items-stretch">
        
        {/* Left: The Identity Trap visualizer */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl p-6 border border-slate-200 flex flex-col items-center">
           <h3 className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-widest">Adjust Latent Bottleneck Size</h3>
           <div className="w-full max-w-sm mb-8">
             <input type="range" min="1" max="3" step="1" value={bottleneck} onChange={(e) => setBottleneck(parseInt(e.target.value))} className="w-full accent-indigo-600" />
             <div className="flex justify-between text-xs font-bold text-slate-500 mt-1">
               <span>Huge (Identity Trap)</span>
               <span>Perfect Size</span>
               <span>Too Small</span>
             </div>
           </div>

           <div className="flex items-center justify-between w-full max-w-lg mb-6 relative">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 mb-2">Original (x)</span>
                <img src="https://picsum.photos/id/1025/100/100" className="w-24 h-24 rounded-lg shadow-md grayscale" />
              </div>

              {/* Dynamic Bottleneck visual */}
              <div className="flex flex-col items-center z-10 px-4">
                 <div className={`transition-all duration-500 bg-purple-100 border-2 border-purple-400 rounded-lg flex flex-wrap gap-1 p-2 shadow-inner ${bottleneck === 1 ? 'w-24 h-24' : bottleneck === 2 ? 'w-12 h-12' : 'w-6 h-6'}`}>
                 </div>
                 <span className="text-[10px] font-bold text-purple-700 mt-2">Latent Space (z)</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 mb-2">Output (x')</span>
                <div className="w-24 h-24 rounded-lg shadow-md overflow-hidden relative">
                  <img src={visual.img} className="w-full h-full object-cover grayscale transition-all duration-500" style={{ filter: `blur(${visual.blur})` }} />
                </div>
              </div>
           </div>

           <div className={`w-full p-4 rounded-xl border-l-4 text-sm ${bottleneck === 1 ? 'bg-rose-50 border-rose-500 text-rose-900' : bottleneck === 2 ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-amber-50 border-amber-500 text-amber-900'}`}>
              <strong>MSE Loss: <span className="font-mono">{visual.mse}</span></strong><br/>
              {visual.note}
              {bottleneck === 1 && <p className="mt-2 text-xs opacity-80">If the latent space is huge, the network doesn't learn any rules or features. It just memorizes the input pixel-for-pixel (an identity function). It's a useless representation!</p>}
           </div>
        </div>

        {/* Right: Metrics Definitions */}
        <div className="flex-1 flex flex-col gap-4">
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h4 className="font-bold text-indigo-900 mb-2">MSE (Mean Squared Error)</h4>
             <p className="text-sm text-slate-600 mb-2">Measures average squared difference between pixels. Heavily penalizes large outliers.</p>
           </div>

           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h4 className="font-bold text-indigo-900 mb-2">MAE (Mean Absolute Error)</h4>
             <p className="text-sm text-slate-600 mb-2">Also known as L1 Loss. Measures absolute differences. Less aggressive on outliers than MSE.</p>
           </div>

           <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
             <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Perceptual Metrics</h4>
             <p className="text-sm text-slate-600">
               Metrics like <strong>SSIM</strong> (Structural Similarity) evaluate how <em>perceptually</em> similar images are based on human vision, ignoring tiny 1-pixel shifts that break MSE.
             </p>
           </div>

           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h4 className="font-bold text-indigo-900 mb-2">Info Theoretic Measures</h4>
             <p className="text-sm text-slate-600">
               We can estimate <strong>Mutual Information I(X;Z)</strong> to see how much data Z retains about X.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 5: Extrinsic Evaluation ---
const ExtrinsicSlide = () => {
  const [activeTab, setActiveTab] = useState('transfer');

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-800 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Extrinsic Evaluation</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          The ultimate test. Does this representation actually help us solve real, practical machine learning problems downstream?
        </p>
      </div>

      <div className="flex justify-center mb-8 w-full max-w-2xl mx-auto">
        <div className="flex bg-slate-700/50 p-1 rounded-xl w-full">
           <button onClick={() => setActiveTab('transfer')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'transfer' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}><Copy className="w-4 h-4"/> Transfer Learning</button>
           <button onClick={() => setActiveTab('efficiency')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'efficiency' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}><TrendingUp className="w-4 h-4"/> Sample Efficiency</button>
           <button onClick={() => setActiveTab('robustness')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'robustness' ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}><ShieldAlert className="w-4 h-4"/> Robustness</button>
        </div>
      </div>

      <div className="flex-grow w-full max-w-5xl mx-auto bg-slate-900 border border-slate-700 rounded-3xl p-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* TRANSFER LEARNING */}
          {activeTab === 'transfer' && (
            <motion.div key="transfer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-full items-center justify-center gap-8">
               <p className="text-center text-slate-300 max-w-2xl">Train a massive representation on a giant dataset (like ImageNet). Then, "transfer" that frozen encoder to a small, specialized task (like Medical X-Rays).</p>
               
               <div className="flex items-center gap-4 w-full justify-center">
                  <div className="flex flex-col items-center bg-slate-800 p-4 rounded-xl border border-slate-600">
                    <span className="text-4xl mb-2">🌍</span>
                    <span className="text-xs font-bold text-slate-400">14 Million Images</span>
                  </div>
                  <ArrowRight className="text-indigo-400 w-6 h-6"/>
                  <div className="bg-indigo-600 border-2 border-indigo-400 p-6 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.4)] flex flex-col items-center z-10">
                    <BrainCircuit className="w-8 h-8 text-white mb-2" />
                    <span className="font-bold text-white text-sm">Learned Encoder</span>
                  </div>
                  <ArrowRight className="text-indigo-400 w-6 h-6"/>
                  <div className="flex flex-col items-center bg-slate-800 p-4 rounded-xl border border-slate-600 relative">
                    <span className="text-4xl mb-2">🦴</span>
                    <span className="text-xs font-bold text-slate-400">100 Rare X-Rays</span>
                    <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg">High Accuracy!</div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* SAMPLE EFFICIENCY */}
          {activeTab === 'efficiency' && (
            <motion.div key="efficiency" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-full items-center justify-center gap-8">
               <p className="text-center text-slate-300 max-w-2xl">Because the representation already understands the structure of the data, the downstream task requires <strong>significantly less labeled training data</strong> to achieve high accuracy.</p>
               
               <div className="w-full max-w-md h-48 bg-slate-800 border-l-2 border-b-2 border-slate-600 relative mt-4">
                  <span className="absolute -left-12 top-1/2 transform -translate-y-1/2 -rotate-90 text-[10px] font-bold text-slate-400 tracking-widest">Accuracy</span>
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-slate-400 tracking-widest">Amount of Training Data Needed</span>
                  
                  {/* Raw Pixels Curve */}
                  <svg className="w-full h-full absolute inset-0 overflow-visible">
                    <path d="M 0 180 Q 150 160 300 20" fill="none" stroke="#64748b" strokeWidth="3" strokeDasharray="4 4" />
                  </svg>
                  <div className="absolute right-4 top-16 flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-slate-500 border-t border-dashed border-slate-500"></div>
                    <span className="text-[10px] text-slate-400">Raw Pixels</span>
                  </div>

                  {/* Good Representation Curve */}
                  <svg className="w-full h-full absolute inset-0 overflow-visible">
                    <path d="M 0 180 Q 20 20 300 10" fill="none" stroke="#10b981" strokeWidth="4" />
                  </svg>
                  <div className="absolute right-4 top-4 flex items-center gap-2">
                    <div className="w-3 h-1 bg-emerald-500"></div>
                    <span className="text-[10px] font-bold text-emerald-400">Good Representation</span>
                  </div>
               </div>
            </motion.div>
          )}

          {/* ROBUSTNESS */}
          {activeTab === 'robustness' && (
            <motion.div key="robustness" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-full items-center justify-center gap-8">
               <p className="text-center text-slate-300 max-w-2xl">A high-quality representation learns true structural features, making it highly robust against random noise, adversarial attacks, and domain shifts.</p>
               
               <div className="flex gap-8 items-center w-full justify-center">
                  
                  {/* Clean Input */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 mb-2 font-mono">Input x</span>
                    <div className="w-24 h-24 bg-white rounded-lg shadow-md overflow-hidden relative">
                       <img src="https://picsum.photos/id/237/100/100" className="w-full h-full object-cover grayscale" />
                    </div>
                    <div className="mt-4 flex flex-col items-center">
                       <ArrowDown className="text-slate-500 w-4 h-4 mb-2" />
                       <div className="bg-indigo-600 px-3 py-1 rounded text-xs font-mono font-bold">z = [0.8, -0.2]</div>
                    </div>
                  </div>

                  {/* Noisy Input */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 mb-2 font-mono">Noisy x (Perturbation)</span>
                    <div className="w-24 h-24 bg-white rounded-lg shadow-md overflow-hidden relative">
                       <img src="https://picsum.photos/id/237/100/100" className="w-full h-full object-cover grayscale" />
                       {/* Noise overlay */}
                       <div 
                         className="absolute inset-0 opacity-50 mix-blend-overlay"
                         style={{ backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjxwYXRoIGQ9Ik0wIDBMMCA0TDEgNEwxIDBMMCAwWk0xIDBMMSA0TDIgNEwyIDBMMSAwWk0yIDBMMiA0TDMgNEwzIDBMMiAwWk0zIDBMMyA0TDQgNEw0IDBMMyAwWiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')` }}
                       ></div>
                       <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]"></div>
                    </div>
                    <div className="mt-4 flex flex-col items-center">
                       <ArrowDown className="text-slate-500 w-4 h-4 mb-2" />
                       <div className="bg-emerald-600 border border-emerald-400 px-3 py-1 rounded text-xs font-mono font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]">z = [0.8, -0.2]</div>
                       <span className="text-[9px] text-emerald-400 font-bold mt-1 tracking-wider uppercase">Representation Unchanged!</span>
                    </div>
                  </div>

               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

// --- SLIDE 6: Qualitative & Analytical Eval ---
const QualitativeEvalSlide = () => {
  const [activeTab, setActiveTab] = useState('visualization');
  const [traversal, setTraversal] = useState(50);
  const [ablated, setAblated] = useState(false);

  // Generate fake t-SNE scatter points matching screenshot colors
  const tsnePoints = Array.from({ length: 40 }).map((_, i) => {
    let cluster, color, cx, cy;
    if (i < 10) { cluster = 'green'; color = 'bg-emerald-500'; cx = 25; cy = 20; }
    else if (i < 20) { cluster = 'blue'; color = 'bg-blue-500'; cx = 50; cy = 40; }
    else if (i < 30) { cluster = 'red'; color = 'bg-rose-500'; cx = 15; cy = 75; }
    else { cluster = 'orange'; color = 'bg-amber-500'; cx = 80; cy = 70; }
    
    return {
      id: i, color,
      x: cx + (Math.random() - 0.5) * 15,
      y: cy + (Math.random() - 0.5) * 15
    };
  });

  const getEmoji = () => {
    if (traversal < 20) return "😠";
    if (traversal < 40) return "🙁";
    if (traversal < 60) return "😐";
    if (traversal < 80) return "🙂";
    return "😄";
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Qualitative & Analytical Methodologies</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Beyond raw numbers, we can visually and structurally probe the latent space to prove it has learned meaningful, controllable concepts.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left Nav */}
        <div className="lg:w-1/3 flex flex-col gap-3">
          {[
            { id: 'visualization', title: '1. Visualization (t-SNE)', icon: <Map className="w-5 h-5"/> },
            { id: 'traversal', title: '2. Latent Traversal', icon: <SlidersHorizontal className="w-5 h-5"/> },
            { id: 'probing', title: '3. Probing Tasks', icon: <Stethoscope className="w-5 h-5"/> },
            { id: 'ablation', title: '4. Ablation Studies', icon: <Scissors className="w-5 h-5"/> }
          ].map((tab) => (
            <button
              key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`text-left p-4 rounded-xl flex items-center gap-3 transition-all duration-200 border-2 ${
                activeTab === tab.id ? 'bg-white shadow-md border-indigo-500 text-indigo-900 font-bold' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <div className={activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}>{tab.icon}</div>
              <span className="text-sm">{tab.title}</span>
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="lg:w-2/3 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 relative overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            
            {/* VISUALIZATION */}
            {activeTab === 'visualization' && (
              <motion.div key="vis" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                <h3 className="text-xl font-bold text-indigo-900 mb-2 border-b border-indigo-100 pb-2">Visualization of Latent Space</h3>
                <p className="text-sm text-slate-600 mb-6">Using algorithms like <strong>t-SNE</strong> or <strong>UMAP</strong>, we crush high-dimensional representations into 2D. If the model learned well, different classes naturally separate into beautiful, distinct clusters!</p>
                
                <div className="flex-grow bg-slate-50 border-2 border-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full relative max-w-sm max-h-64">
                    {tsnePoints.map(p => (
                      <motion.div 
                        key={p.id}
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: Math.random() * 0.5 }}
                        className={`absolute w-3 h-3 rounded-full ${p.color}`}
                        style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      />
                    ))}
                  </div>
                  <span className="absolute bottom-3 right-3 text-[10px] font-mono font-bold text-slate-400">t-SNE Projection</span>
                </div>
              </motion.div>
            )}

            {/* TRAVERSAL */}
            {activeTab === 'traversal' && (
              <motion.div key="trav" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                <h3 className="text-xl font-bold text-indigo-900 mb-2 border-b border-indigo-100 pb-2">Latent Space Traversal</h3>
                <p className="text-sm text-slate-600 mb-6">If we slowly slide the value of just <em>one</em> latent dimension while freezing the others, the output should morph in a semantically meaningful way (e.g., changing an expression).</p>
                
                <div className="flex-grow flex flex-col items-center justify-center gap-8 bg-slate-50 border border-slate-200 rounded-xl p-6">
                  
                  <div className="flex items-center gap-8">
                     <div className="flex flex-col items-center">
                       <span className="text-[10px] font-bold text-slate-500 mb-1">Current z-vector</span>
                       <div className="bg-white border border-slate-300 font-mono text-xs px-3 py-2 rounded shadow-inner">
                         [0.2, 0.4, <span className="bg-indigo-100 text-indigo-700 font-bold px-1 rounded">{(traversal / 100).toFixed(2)}</span>, -0.9]
                       </div>
                     </div>
                     <ArrowRight className="w-6 h-6 text-slate-300" />
                     <div className="text-7xl bg-white w-32 h-32 flex items-center justify-center rounded-2xl shadow-lg border-2 border-slate-200 select-none">
                       {getEmoji()}
                     </div>
                  </div>

                  <div className="w-full max-w-sm flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500 font-mono">
                      <span>z_3 = 0.00</span>
                      <span className="text-indigo-600">Traverse "Smile" Dimension</span>
                      <span>z_3 = 1.00</span>
                    </div>
                    <input type="range" min="0" max="100" value={traversal} onChange={(e) => setTraversal(e.target.value)} className="w-full accent-indigo-500" />
                  </div>

                </div>
              </motion.div>
            )}

            {/* PROBING */}
            {activeTab === 'probing' && (
              <motion.div key="probe" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                <h3 className="text-xl font-bold text-indigo-900 mb-2 border-b border-indigo-100 pb-2">Diagnostic Probing Tasks</h3>
                <p className="text-sm text-slate-600 mb-6">We suspect our model learned about "Age" even though we didn't train it to. We attach a tiny regressor specifically to predict age from <span className="font-mono">z</span>. If it succeeds, the info is there!</p>
                
                <div className="flex-grow flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-4 w-full justify-between max-w-md">
                     <div className="flex flex-col items-center">
                       <div className="text-4xl bg-white w-16 h-16 flex items-center justify-center rounded-full shadow border border-slate-200 mb-2">👴</div>
                       <span className="text-[10px] font-bold text-slate-500">Raw Input</span>
                     </div>
                     <div className="h-0.5 w-12 bg-slate-300"></div>
                     <div className="bg-indigo-600 text-white font-mono text-xs font-bold px-3 py-2 rounded shadow-md">
                       z_rep
                     </div>
                     <ArrowRight className="text-indigo-400 w-5 h-5"/>
                     <div className="bg-emerald-100 border border-emerald-400 p-2 rounded-lg flex flex-col items-center shadow-sm">
                       <Stethoscope className="w-5 h-5 text-emerald-600 mb-1" />
                       <span className="text-[10px] font-bold text-emerald-800">Age Regressor</span>
                     </div>
                     <ArrowRight className="text-emerald-400 w-5 h-5"/>
                     <div className="flex flex-col items-center bg-white border-2 border-emerald-500 px-3 py-2 rounded shadow-lg">
                       <span className="text-emerald-600 font-bold text-lg">72</span>
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Predicted Age</span>
                     </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ABLATION */}
            {activeTab === 'ablation' && (
              <motion.div key="ablation" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                <h3 className="text-xl font-bold text-indigo-900 mb-2 border-b border-indigo-100 pb-2">Ablation Studies</h3>
                <p className="text-sm text-slate-600 mb-6">Systematically remove or alter parts of the model architecture to prove exactly which component is responsible for success.</p>
                
                <div className="flex-grow flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl p-6 gap-6">
                   <div className="flex items-center gap-6">
                      {/* Architecture Blocks */}
                      <div className="flex gap-2 p-2 bg-white rounded-lg border border-slate-300 shadow-sm">
                        <div className="w-12 h-16 bg-blue-100 border border-blue-300 rounded flex items-center justify-center text-[10px] font-bold text-blue-800 text-center">Conv<br/>Layer</div>
                        
                        <div onClick={() => setAblated(!ablated)} className={`w-12 h-16 rounded flex items-center justify-center text-[10px] font-bold text-center cursor-pointer transition-colors relative ${ablated ? 'bg-slate-200 border border-slate-300 text-slate-400' : 'bg-purple-100 border border-purple-300 text-purple-800 hover:ring-2 ring-purple-400'}`}>
                          {ablated && <div className="absolute inset-0 bg-red-500/20 rounded flex items-center justify-center"><XCircle className="text-red-500 w-6 h-6"/></div>}
                          KL<br/>Loss
                        </div>

                        <div className="w-12 h-16 bg-blue-100 border border-blue-300 rounded flex items-center justify-center text-[10px] font-bold text-blue-800 text-center">Linear<br/>Layer</div>
                      </div>

                      <ArrowRight className="w-6 h-6 text-slate-400" />

                      {/* Performance Metric */}
                      <div className="flex flex-col items-center w-24">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Representation Score</span>
                        <div className={`text-3xl font-mono font-bold transition-colors ${ablated ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {ablated ? '45%' : '92%'}
                        </div>
                      </div>
                   </div>

                   <button onClick={() => setAblated(!ablated)} className="text-sm font-bold bg-slate-800 text-white px-6 py-2 rounded-full hover:bg-slate-700 transition-colors shadow">
                     {ablated ? "Restore KL Loss Component" : "Ablate (Remove) KL Loss"}
                   </button>
                   
                   <p className="text-xs text-slate-500 italic max-w-sm text-center">
                     Conclusion: Removing the KL Loss drops performance drastically, proving it is a critical component for learning good features.
                   </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- SLIDE 7: Challenges ---
const ChallengesSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-800 text-white">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Challenges in Evaluating Representations</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Evaluation is notoriously tricky. A representation might look perfect on paper but fail in reality due to these common pitfalls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full pb-8">
        
        {/* Challenge 1 */}
        <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-2xl hover:bg-slate-700 transition-colors group">
          <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-100 mb-2">No Single Best Metric</h3>
          <p className="text-sm text-slate-400">
            A representation that clusters beautifully (good Intrinsic score) might perform terribly on a generative task. The "best" metric depends entirely on your specific end goal.
          </p>
        </div>

        {/* Challenge 2 */}
        <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-2xl hover:bg-slate-700 transition-colors group">
          <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-100 mb-2">Confounding Factors</h3>
          <p className="text-sm text-slate-400">
            If you test a bad representation using a massive, powerful downstream Deep Neural Network, the downstream network might just "compensate" for the bad features, masking the problem.
          </p>
        </div>

        {/* Challenge 3 */}
        <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-2xl hover:bg-slate-700 transition-colors group">
          <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-100 mb-2">Computational Cost</h3>
          <p className="text-sm text-slate-400">
            Thorough extrinsic evaluation requires training dozens of downstream models on massive datasets just to test one representation. It is extremely expensive and slow.
          </p>
        </div>

        {/* Challenge 4 */}
        <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-2xl hover:bg-slate-700 transition-colors group lg:col-span-1 md:col-span-2">
          <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Link className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-100 mb-2">Correlation vs. Causation</h3>
          <p className="text-sm text-slate-400">
            A probing task might successfully predict "Age" from the representation. But that only proves correlation. It doesn't mean the model has an explicit, disentangled "Age Slider" dimension.
          </p>
        </div>

        {/* Challenge 5 */}
        <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-2xl hover:bg-slate-700 transition-colors group lg:col-span-2 md:col-span-2">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-100 mb-2">Metric Optimization (Goodhart's Law)</h3>
          <p className="text-sm text-slate-400">
            <em>"When a measure becomes a target, it ceases to be a good measure."</em> If you specifically design a loss function to hack and maximize the "Disentanglement Score", the model might achieve a 100% score while destroying the overall usefulness of the representation.
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
    IntroEvaluationSlide,
    LinearProbingSlide,
    ClusteringQualitySlide,
    ReconstructionSlide,
    ExtrinsicSlide,
    QualitativeEvalSlide,
    ChallengesSlide
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* Top Progress Bar */}
      <div className="w-full h-1.5 bg-slate-200">
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
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full w-full absolute inset-0"
          >
            <CurrentSlideComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center p-4 md:p-6 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 border-t border-slate-200">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex space-x-2 md:space-x-3">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-indigo-600 scale-125' : 'bg-slate-300'}`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={currentSlide === slides.length - 1}
        >
          <ChevronRight className="w-6 h-6" />
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