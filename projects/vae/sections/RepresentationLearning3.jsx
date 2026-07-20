import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, BrainCircuit, 
  Filter, Shuffle, Move, RotateCw, 
  LineChart, Target, ArrowRight, Box, 
  Network, Activity, Eye, Zap, Combine, Split,
  Search, Image as ImageIcon
} from 'lucide-react';

// --- SLIDE 1: Introduction to Representation Learning ---
const IntroSlide = () => {
  const [isTransformed, setIsTransformed] = useState(false);

  const pixels = Array.from({ length: 64 }).map((_, i) => {
    const isCat = [1,2,3,4,8,16,24,32,40,48,56,57,58,59,60].includes(i);
    return isCat ? 'bg-slate-800' : 'bg-slate-200';
  });

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center shrink-0">Core Principles of Representation Learning</h2>
      <p className="text-slate-600 mb-8 text-center max-w-3xl mx-auto shrink-0 text-sm md:text-base">
        Raw data (like grids of pixels) is terrible for machine learning algorithms. <strong>Representation Learning</strong> automates the discovery of the perfect underlying features directly from the raw data.
      </p>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 flex-grow w-full max-w-5xl mx-auto">
        
        {/* Raw Data */}
        <div className="flex flex-col items-center">
          <h3 className="font-bold text-slate-700 mb-4 uppercase tracking-wider text-sm">1. Raw Data (Pixels)</h3>
          <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200">
            <div className="grid grid-cols-8 gap-1 w-48 h-48">
              {pixels.map((color, i) => (
                <div key={i} className={`w-full h-full rounded-sm ${color} opacity-80`}></div>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center max-w-[200px]">
            To a computer, this is just a giant array of meaningless numbers.
          </p>
        </div>

        {/* The Transformation */}
        <div className="flex flex-col items-center">
          <button 
            onClick={() => setIsTransformed(!isTransformed)}
            className={`px-6 py-3 rounded-full font-bold shadow-md transition-all flex items-center gap-2 ${isTransformed ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            <BrainCircuit className="w-5 h-5" />
            {isTransformed ? 'Reset' : 'Learn Representation'}
          </button>
          <div className="h-16 w-1 border-l-2 border-dashed border-indigo-300 my-2 relative">
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-100 px-2 text-xs font-mono text-indigo-400 font-bold">Deep Learning</div>
          </div>
        </div>

        {/* Learned Representation */}
        <div className="flex flex-col items-center relative">
          <h3 className="font-bold text-slate-700 mb-4 uppercase tracking-wider text-sm">2. Learned Representation</h3>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 w-64 h-48 flex flex-col justify-center gap-4 relative overflow-hidden">
            {!isTransformed && (
              <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-sm flex items-center justify-center z-10">
                <span className="text-slate-400 font-bold text-sm">Awaiting Transformation...</span>
              </div>
            )}
            
            <div>
              <div className="flex justify-between text-xs font-bold text-indigo-900 mb-1"><span>Edges</span> <span>85%</span></div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: isTransformed ? '85%' : 0 }} transition={{ duration: 1 }} className="h-full bg-indigo-500" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-emerald-900 mb-1"><span>Curves</span> <span>60%</span></div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: isTransformed ? '60%' : 0 }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-emerald-500" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-rose-900 mb-1"><span>Texture</span> <span>20%</span></div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: isTransformed ? '20%' : 0 }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-rose-500" />
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center max-w-[200px]">
            The model automatically extracts abstract, high-level features that actually matter.
          </p>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 2: Fundamental Goals ---
const FundamentalGoalsSlide = () => {
  const [activeGoal, setActiveGoal] = useState('salient');
  const [isSeparated, setIsSeparated] = useState(false);

  const scatterPoints = Array.from({ length: 100 }).map((_, i) => {
    const isInner = i < 50;
    const r = isInner ? Math.random() * 0.4 : 0.6 + Math.random() * 0.4;
    const theta = Math.random() * 2 * Math.PI;
    return {
      id: i, isInner,
      x1: r * Math.cos(theta), y1: r * Math.sin(theta),
      x2: (r - 0.5) * 2, y2: (Math.random() - 0.5) * 1.5 
    };
  });

  const goals = {
    salient: {
      title: "Extracting Salient Information",
      icon: <Filter className="w-5 h-5" />,
      content: (
        <div className="flex flex-col items-center justify-center h-full gap-6">
          <p className="text-sm text-slate-600 text-center max-w-md">Distill data to its most informative essence. Preserve what's useful (the shape) and filter out noise (background clutter, lighting).</p>
          <div className="flex items-center gap-4">
             <div className="w-24 h-24 rounded-lg overflow-hidden relative">
               <img src="https://picsum.photos/id/237/200/200" alt="Dog" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-yellow-900/30 mix-blend-color-burn"></div>
             </div>
             <ArrowRight className="text-slate-300 w-6 h-6" />
             <div className="w-24 h-24 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
               <div className="w-16 h-16 bg-white" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'}}></div>
             </div>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Noise Filtered Out</span>
        </div>
      )
    },
    factors: {
      title: "Identifying Underlying Factors",
      icon: <Shuffle className="w-5 h-5" />,
      content: (
        <div className="flex flex-col items-center justify-center h-full gap-6">
          <p className="text-sm text-slate-600 text-center max-w-md">Data is generated by distinct hidden factors. A good representation isolates these factors so we can manipulate them.</p>
          <div className="flex flex-col items-center">
             <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-rose-400 rounded-full border-4 border-white shadow-lg mb-4 flex items-center justify-center text-2xl">😊</div>
             <div className="flex gap-4">
                <div className="flex flex-col items-center bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 mb-1">Identity</span>
                  <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
                </div>
                <div className="flex flex-col items-center bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 mb-1">Expression</span>
                  <div className="text-lg leading-none mt-1">😊</div>
                </div>
                <div className="flex flex-col items-center bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 mb-1">Lighting</span>
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-transparent rounded-full border border-slate-200"></div>
                </div>
             </div>
          </div>
        </div>
      )
    },
    downstream: {
      title: "Facilitating Downstream Tasks",
      icon: <Target className="w-5 h-5" />,
      content: (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <p className="text-sm text-slate-600 text-center max-w-md mb-4">A good representation transforms impossible data (e.g., overlapping circles) into a space where simple models (like a straight linear line) can easily classify them.</p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full max-w-sm flex flex-col items-center relative h-64 overflow-hidden">
             <div className="relative w-48 h-48 border-l-2 border-b-2 border-slate-400">
               {scatterPoints.map((p) => (
                 <motion.div 
                   key={p.id}
                   animate={{ x: (isSeparated ? p.x2 : p.x1) * 80 + 96, y: (isSeparated ? p.y2 : p.y1) * 80 + 96 }}
                   transition={{ duration: 1, type: "spring" }}
                   className={`absolute w-2.5 h-2.5 rounded-full shadow-sm transform -translate-x-1/2 -translate-y-1/2 ${p.isInner ? 'bg-rose-500' : 'bg-blue-500'}`}
                 />
               ))}
               <AnimatePresence>
                 {isSeparated && (
                   <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: '100%' }} exit={{ opacity: 0 }} className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-emerald-500" />
                 )}
               </AnimatePresence>
             </div>
             <button 
               onClick={() => setIsSeparated(!isSeparated)}
               className="mt-4 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded shadow hover:bg-emerald-700 transition-colors z-10"
             >
               {isSeparated ? 'Revert to Raw Data' : 'Apply Learned Representation'}
             </button>
             {isSeparated && <div className="absolute right-4 top-4 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Linearly Separable!</div>}
          </div>
        </div>
      )
    },
    generalization: {
      title: "Improving Generalization",
      icon: <LineChart className="w-5 h-5" />,
      content: (
        <div className="flex flex-col items-center justify-center h-full gap-6">
          <p className="text-sm text-slate-600 text-center max-w-md">By capturing true underlying structures rather than memorizing noisy training data, the model resists overfitting and performs well on unseen data.</p>
          <div className="flex gap-6 w-full justify-center px-4">
             <div className="flex-1 bg-red-50 border border-red-200 p-4 rounded-xl flex flex-col items-center">
               <span className="text-xs font-bold text-red-700 mb-2">Superficial Memorization</span>
               <svg viewBox="0 0 100 50" className="w-full h-16 overflow-visible">
                 <path d="M0,40 Q10,10 20,40 T40,40 T60,20 T80,45 T100,20" fill="none" stroke="#ef4444" strokeWidth="2" />
                 <circle cx="20" cy="40" r="2" fill="#94a3b8"/><circle cx="40" cy="40" r="2" fill="#94a3b8"/><circle cx="60" cy="20" r="2" fill="#94a3b8"/>
               </svg>
               <span className="text-[9px] text-red-500 mt-2 font-bold uppercase tracking-wider">Overfitting</span>
             </div>
             <div className="flex-1 bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex flex-col items-center">
               <span className="text-xs font-bold text-emerald-700 mb-2">True Structure Learned</span>
               <svg viewBox="0 0 100 50" className="w-full h-16 overflow-visible">
                 <path d="M0,45 Q50,20 100,25" fill="none" stroke="#10b981" strokeWidth="3" />
                 <circle cx="20" cy="40" r="2" fill="#94a3b8"/><circle cx="40" cy="40" r="2" fill="#94a3b8"/><circle cx="60" cy="20" r="2" fill="#94a3b8"/>
               </svg>
               <span className="text-[9px] text-emerald-600 mt-2 font-bold uppercase tracking-wider">Generalization</span>
             </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center shrink-0">Fundamental Goals</h2>
      <p className="text-slate-600 mb-8 text-center max-w-2xl mx-auto shrink-0 text-sm md:text-base">
        Why do we care about building good representations?
      </p>

      <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto w-full flex-grow items-stretch pb-8">
        <div className="lg:w-1/3 flex flex-col gap-3">
          {Object.keys(goals).map((key) => (
            <button
              key={key} 
              onClick={() => setActiveGoal(key)}
              className={`text-left p-4 rounded-xl flex items-center gap-3 transition-all duration-200 border-2 ${
                activeGoal === key ? 'bg-white shadow-md border-indigo-500 text-indigo-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className={activeGoal === key ? 'text-indigo-600' : 'text-slate-400'}>{goals[key].icon}</div>
              <span className="text-sm">{goals[key].title}</span>
            </button>
          ))}
        </div>
        <div className="lg:w-2/3 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 relative overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div key={activeGoal} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex flex-col h-full">
              <h3 className="text-xl font-bold text-indigo-900 mb-4 border-b border-indigo-100 pb-2 flex items-center gap-2">
                {goals[activeGoal].icon} {goals[activeGoal].title}
              </h3>
              <div className="flex-grow">{goals[activeGoal].content}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- SLIDE 3: Invariance vs Equivariance ---
const InvarianceEquivarianceSlide = () => {
  const [catPos, setCatPos] = useState({ x: 0, y: 0 });
  const [catRot, setCatRot] = useState(0);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center shrink-0">Characteristics: Invariance & Equivariance</h2>
      <p className="text-slate-600 mb-8 text-center max-w-3xl mx-auto shrink-0 text-sm md:text-base">
        A good representation responds predictably to changes in the raw data. 
      </p>

      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto w-full flex-grow pb-8">
        
        {/* INVARIANCE */}
        <div className="flex-1 bg-white rounded-2xl shadow-md border-t-4 border-rose-500 p-6 flex flex-col">
           <div className="flex items-center gap-2 mb-2">
             <Move className="text-rose-500 w-6 h-6" />
             <h3 className="text-2xl font-bold text-rose-800">Invariance</h3>
           </div>
           <p className="text-sm text-slate-600 mb-6">
             Insensitivity to transformations that don't matter. If a cat moves, the representation <span className="font-mono text-rose-600 font-bold bg-rose-50 px-1 rounded">"Is Cat?"</span> should stay exactly the same.
           </p>

           <div className="flex-grow flex flex-col items-center gap-6">
              <div className="w-full h-48 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 relative overflow-hidden flex items-center justify-center cursor-move"
                   onMouseMove={(e) => {
                     const rect = e.currentTarget.getBoundingClientRect();
                     const x = (e.clientX - rect.left - rect.width/2) * 0.8;
                     const y = (e.clientY - rect.top - rect.height/2) * 0.8;
                     setCatPos({x, y});
                   }}
                   onMouseLeave={() => setCatPos({x: 0, y: 0})}
              >
                 <span className="absolute top-2 left-2 text-[10px] font-bold text-slate-400">Hover & Move</span>
                 <motion.div animate={{ x: catPos.x, y: catPos.y }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="text-6xl select-none">🐈</motion.div>
              </div>

              <div className="w-full bg-rose-50 border border-rose-200 p-4 rounded-xl">
                 <div className="flex justify-between text-xs font-bold text-rose-900 mb-1">
                   <span>Output Neuron: "Cat Confidence"</span> 
                   <span className="font-mono bg-white px-1 rounded">99.8%</span>
                 </div>
                 <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-rose-500 w-[99.8%]" />
                 </div>
                 <p className="text-[10px] text-center text-rose-600 mt-2 font-semibold uppercase tracking-wider">Unchanged regardless of position</p>
              </div>
           </div>
        </div>

        {/* EQUIVARIANCE */}
        <div className="flex-1 bg-white rounded-2xl shadow-md border-t-4 border-blue-500 p-6 flex flex-col">
           <div className="flex items-center gap-2 mb-2">
             <RotateCw className="text-blue-500 w-6 h-6" />
             <h3 className="text-2xl font-bold text-blue-800">Equivariance</h3>
           </div>
           <p className="text-sm text-slate-600 mb-6">
             Predictable sensitivity. If the input rotates, the representation <span className="font-mono text-blue-600 font-bold bg-blue-50 px-1 rounded">"Angle"</span> should change in a directly mirroring way.
           </p>

           <div className="flex-grow flex flex-col items-center gap-6">
              <div className="w-full h-48 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 relative overflow-hidden flex items-center justify-center cursor-ew-resize">
                 <span className="absolute top-2 left-2 text-[10px] font-bold text-slate-400">Slide to Rotate</span>
                 <input type="range" min="0" max="360" value={catRot} onChange={(e) => setCatRot(e.target.value)} className="absolute bottom-4 w-3/4 z-10 accent-blue-500" />
                 <motion.div animate={{ rotate: parseInt(catRot) }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="text-6xl select-none">🐈</motion.div>
              </div>

              <div className="w-full bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full border-4 border-blue-200 relative flex items-center justify-center bg-white shadow-inner shrink-0">
                    <motion.div animate={{ rotate: parseInt(catRot) }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="absolute w-1 h-8 bg-blue-600 rounded-full origin-bottom" style={{ bottom: '50%' }} />
                 </div>
                 <div className="flex-grow">
                   <div className="flex justify-between text-xs font-bold text-blue-900 mb-1">
                     <span>Latent Feature: "Angle"</span> 
                   </div>
                   <div className="font-mono text-lg font-bold text-blue-700 bg-white border border-blue-200 px-2 py-1 rounded inline-block">{catRot}°</div>
                   <p className="text-[10px] text-blue-600 mt-1 font-semibold uppercase tracking-wider">Mirrors the input exactly</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 4: Disentanglement ---
const DisentanglementSlide = () => {
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState(1);
  const [colorHue, setColorHue] = useState(0);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-800 text-slate-200">
      <h2 className="text-3xl font-bold text-white mb-2 text-center shrink-0">Disentanglement</h2>
      <p className="text-slate-400 mb-6 text-center max-w-3xl mx-auto shrink-0 text-sm md:text-base">
        The holy grail of representation learning. A disentangled representation ensures that <strong>one latent dimension controls exactly one independent factor</strong> of the observed data.
      </p>

      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-5xl mx-auto relative pb-10">
         <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Disentangled Latent Space Mapping</div>

         {/* 1. OBSERVED DATA */}
         <div className="bg-amber-100 text-amber-900 border-2 border-amber-400 rounded-xl p-4 w-48 text-center flex flex-col items-center shadow-lg relative z-20 mb-8">
            <span className="font-bold text-sm">Observed Data X</span>
            <span className="text-xs opacity-80 mb-3">(e.g. Images)</span>
            <div className="w-24 h-24 bg-white/50 rounded-lg flex items-center justify-center overflow-hidden border border-amber-300 shadow-inner">
               <motion.div 
                 style={{ backgroundColor: `hsl(${colorHue}, 80%, 60%)` }}
                 animate={{ rotate: parseInt(rotation), scale: parseFloat(size) }}
                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
                 className="w-12 h-12 rounded-sm shadow-md"
               />
            </div>
         </div>

         {/* Connecting Lines Data -> Factors */}
         <div className="absolute top-36 w-full max-w-2xl flex justify-between px-16 z-0">
            <div className="border-l-2 border-dashed border-slate-500 h-12 transform -rotate-[30deg] origin-top"></div>
            <div className="border-l-2 border-dashed border-slate-500 h-12 ml-4"></div>
            <div className="border-l-2 border-dashed border-slate-500 h-12 transform rotate-[30deg] origin-top"></div>
         </div>
         <div className="absolute top-44 w-full max-w-xl flex justify-between px-20 z-0 text-[10px] text-slate-400 font-mono">
            <span>exhibits</span><span>exhibits</span><span>exhibits</span>
         </div>

         {/* 2. FACTORS */}
         <div className="flex w-full max-w-3xl justify-between gap-4 mb-8 relative z-20 mt-4">
            <div className="flex-1 bg-orange-200 text-orange-900 border-2 border-orange-400 rounded-full py-3 text-center text-sm font-bold shadow-md">Factor: Rotation</div>
            <div className="flex-1 bg-orange-300 text-orange-900 border-2 border-orange-500 rounded-full py-3 text-center text-sm font-bold shadow-md">Factor: Size</div>
            <div className="flex-1 bg-pink-200 text-pink-900 border-2 border-pink-400 rounded-full py-3 text-center text-sm font-bold shadow-md">Factor: Color</div>
         </div>

         {/* Connecting Lines Factors -> Dimensions */}
         <div className="absolute top-[280px] w-full max-w-2xl flex justify-between px-12 z-0">
            <div className="flex flex-col items-center"><div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-500"></div><div className="w-0.5 bg-slate-500 h-8 -mt-1"></div></div>
            <div className="flex flex-col items-center"><div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-500"></div><div className="w-0.5 bg-slate-500 h-8 -mt-1"></div></div>
            <div className="flex flex-col items-center"><div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-500"></div><div className="w-0.5 bg-slate-500 h-8 -mt-1"></div></div>
         </div>

         {/* 3. LATENT DIMENSIONS (Interactive Sliders) */}
         <div className="flex w-full max-w-4xl justify-between gap-4 mb-12 relative z-20 mt-4 items-center">
            <div className="flex-1 bg-sky-100 border-2 border-sky-400 rounded-lg p-3 flex flex-col items-center shadow-md">
               <span className="text-sky-900 font-bold text-sm">Latent Dimension z1</span>
               <span className="text-sky-700 text-xs mb-3">(e.g., Object Rotation)</span>
               <input type="range" min="0" max="360" value={rotation} onChange={(e) => setRotation(e.target.value)} className="w-full accent-sky-500" />
            </div>
            <div className="flex-1 bg-cyan-100 border-2 border-cyan-400 rounded-lg p-3 flex flex-col items-center shadow-md">
               <span className="text-cyan-900 font-bold text-sm">Latent Dimension z2</span>
               <span className="text-cyan-700 text-xs mb-3">(e.g., Object Size)</span>
               <input type="range" min="0.5" max="2.0" step="0.1" value={size} onChange={(e) => setSize(e.target.value)} className="w-full accent-cyan-500" />
            </div>
            <div className="flex-1 bg-emerald-100 border-2 border-emerald-400 rounded-lg p-3 flex flex-col items-center shadow-md">
               <span className="text-emerald-900 font-bold text-sm">Latent Dimension z3</span>
               <span className="text-emerald-700 text-xs mb-3">(e.g., Object Color)</span>
               <input type="range" min="0" max="360" value={colorHue} onChange={(e) => setColorHue(e.target.value)} className="w-full accent-emerald-500" style={{ background: 'linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)' }} />
            </div>
            <span className="text-2xl text-slate-500 font-bold ml-4">...</span>
         </div>

         {/* Connecting Lines Dimensions -> Space */}
         <div className="absolute bottom-16 w-full max-w-2xl flex justify-between px-24 z-0">
            <div className="w-0.5 bg-slate-500 h-12 transform rotate-[45deg] origin-bottom -ml-8"></div>
            <div className="w-0.5 bg-slate-500 h-12"></div>
            <div className="w-0.5 bg-slate-500 h-12 transform -rotate-[45deg] origin-bottom ml-4"></div>
         </div>

         {/* 4. LATENT SPACE */}
         <div className="bg-indigo-200 text-indigo-900 border-2 border-indigo-400 rounded-full px-12 py-4 text-center font-bold shadow-lg relative z-20">
            Latent Space (z)
         </div>
      </div>
    </div>
  );
};

// --- SLIDE 5: The Manifold Hypothesis (FIXED BLUR & 3D CSS) ---
const ManifoldHypothesisSlide = () => {
  const [unrolled, setUnrolled] = useState(false);

  // Generate a twisted "Swiss Roll" manifold
  const manifoldPoints = Array.from({ length: 200 }).map((_, i) => {
    // Parameter t (along the curve), y (height)
    const t = 1.5 + Math.random() * 3.5; 
    const y = (Math.random() - 0.5) * 4; 
    
    // 3D coordinates (twisted)
    const x3d = t * Math.cos(t);
    const z3d = t * Math.sin(t);
    
    // 2D coordinates (unrolled/flattened)
    const x2d = t * 2 - 5; 
    const y2d = y * 1.5;

    return { id: i, t, y, x3d, z3d, y3d: y, x2d, y2d };
  });

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center shrink-0">Low-Dimensionality & The Manifold Hypothesis</h2>
      <p className="text-slate-600 mb-8 text-center max-w-4xl mx-auto shrink-0 text-sm md:text-base">
        High-dimensional data (like 30,000-pixel images) is mostly empty space. Real data concentrates on a much lower-dimensional "surface" embedded inside it, called a <strong>Manifold</strong>.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto w-full flex-grow items-center pb-8">
        
        {/* The Text Explanation */}
        <div className="flex-1 flex flex-col gap-4 w-full">
           <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-xl shadow-sm">
             <h3 className="font-bold text-indigo-900 mb-1">The Goal of Representation Learning</h3>
             <p className="text-sm text-slate-700">
               To discover this hidden manifold and "unroll" it. We want to learn a <strong>coordinate system</strong> for the surface itself, discarding the useless, noisy high-dimensional space around it.
             </p>
           </div>
           
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-4">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Interactive Visualization</span>
             <p className="text-sm text-center text-slate-600">
               Watch how a complex 3D shape (representing high dimensions) is actually just a simple 2D sheet (the manifold) that has been bent.
             </p>
             <button 
               onClick={() => setUnrolled(!unrolled)}
               className={`px-8 py-3 rounded-full font-bold shadow-md transition-colors w-full max-w-xs flex items-center justify-center gap-2 ${unrolled ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
             >
               {unrolled ? <><Combine className="w-5 h-5"/> Roll Back into 3D Space</> : <><Split className="w-5 h-5"/> Discover Intrinsic 2D Manifold</>}
             </button>
           </div>
        </div>

        {/* The 3D Manifold Visualizer */}
        <div className="flex-[1.2] bg-slate-900 rounded-2xl shadow-2xl border-4 border-slate-800 p-2 flex flex-col relative w-full h-[400px] overflow-hidden">
           
           {/* Labels */}
           <div className="absolute top-4 left-4 z-20">
              <span className={`px-3 py-1 rounded text-xs font-bold font-mono transition-colors ${unrolled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'}`}>
                {unrolled ? 'Intrinsic Latent Space (2D)' : 'Ambient Space (3D)'}
              </span>
           </div>

           {/* The Plot Area (Using inline styles to guarantee 3D CSS works) */}
           <div className="w-full h-full relative flex items-center justify-center" style={{ perspective: '1000px' }}>
              <motion.div 
                className="w-full h-full absolute inset-0"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ 
                  rotateY: unrolled ? 0 : 360,
                  rotateX: unrolled ? 0 : 15
                }}
                transition={{ duration: unrolled ? 1 : 20, repeat: unrolled ? 0 : Infinity, ease: "linear" }}
              >
                 {/* Central axis reference to ground the 3D space */}
                 <div className="absolute left-1/2 top-1/4 bottom-1/4 w-px bg-slate-700/50" style={{ transform: 'translateZ(0px)'}}></div>
                 
                 {/* The Data Points */}
                 {manifoldPoints.map(p => (
                   <motion.div 
                     key={p.id}
                     className={`absolute w-3 h-3 rounded-full ${unrolled ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]'}`}
                     animate={{
                       x: unrolled ? p.x2d * 30 : p.x3d * 20,
                       y: unrolled ? p.y2d * 30 : p.y3d * 30,
                       z: unrolled ? 0 : p.z3d * 20
                     }}
                     style={{
                       left: '50%', top: '50%',
                       marginTop: '-6px', marginLeft: '-6px'
                     }}
                     transition={{ duration: 1, type: "spring", bounce: 0.2 }}
                   />
                 ))}
              </motion.div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 6: Smoothness, Continuity & Hierarchy ---
const SmoothnessHierarchySlide = () => {
  const [interp, setInterp] = useState(0); // 0 to 100

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center shrink-0">Smoothness & Hierarchical Structure</h2>
      <p className="text-slate-600 mb-8 text-center max-w-4xl mx-auto shrink-0 text-sm md:text-base">
        Beyond disentanglement, great representations exhibit two more key properties that allow deep learning models to generalize and generate gracefully.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow pb-8">
        
        {/* SMOOTHNESS & CONTINUITY */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 flex flex-col relative overflow-hidden">
           <h3 className="text-xl font-bold text-blue-800 mb-2 flex items-center gap-2 border-b pb-2">
             <Move className="w-5 h-5"/> Smoothness & Continuity
           </h3>
           <p className="text-sm text-slate-600 mb-6">
             Small changes in the latent space should result in small, predictable changes in the output. This allows for <strong>interpolation</strong>—morphing one concept into another.
           </p>

           <div className="flex flex-col items-center justify-center flex-grow gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              
              <div className="relative w-32 h-32 flex items-center justify-center bg-white rounded-2xl shadow-md border-2 border-blue-100 overflow-hidden text-7xl select-none">
                 <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: 1 - (interp/100) }}>🐱</div>
                 <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: (interp/100) }}>🐶</div>
              </div>

              <div className="w-full max-w-xs flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-slate-500 font-mono">
                   <span>z_cat</span>
                   <span>Latent Trajectory</span>
                   <span>z_dog</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={interp} 
                  onChange={(e) => setInterp(e.target.value)}
                  className="w-full accent-blue-500" 
                />
              </div>

           </div>
        </div>

        {/* HIERARCHICAL STRUCTURE */}
        <div className="flex-[1.2] bg-white rounded-2xl shadow-lg border border-slate-200 p-6 flex flex-col relative overflow-hidden">
           <h3 className="text-xl font-bold text-purple-800 mb-2 flex items-center gap-2 border-b pb-2">
             <Network className="w-5 h-5"/> Hierarchical Structure
           </h3>
           <p className="text-sm text-slate-600 mb-6">
             Deep neural networks learn representations in layers. Lower layers learn basic details; higher layers combine them into abstract, complex concepts.
           </p>

           <div className="flex-grow flex flex-col items-center justify-end gap-2 relative h-64">
              
              {/* Layer 3: Objects */}
              <div className="w-48 bg-purple-100 border-2 border-purple-400 p-2 rounded-lg flex flex-col items-center shadow-md z-30">
                <span className="text-[10px] font-bold text-purple-800 uppercase">Layer 3: Objects</span>
                <div className="flex gap-4 text-2xl mt-1">🚗 🏠</div>
              </div>

              <div className="flex gap-8 -my-2 z-20">
                <div className="w-0.5 h-6 bg-slate-300 transform rotate-12"></div>
                <div className="w-0.5 h-6 bg-slate-300 transform -rotate-12"></div>
              </div>

              {/* Layer 2: Motifs/Parts */}
              <div className="w-64 bg-indigo-100 border-2 border-indigo-400 p-2 rounded-lg flex flex-col items-center shadow-sm z-20">
                <span className="text-[10px] font-bold text-indigo-800 uppercase">Layer 2: Parts & Motifs</span>
                <div className="flex gap-4 text-lg mt-1">🛞 🚪 🪟</div>
              </div>

              <div className="flex gap-16 -my-2 z-10">
                <div className="w-0.5 h-6 bg-slate-300 transform rotate-[20deg]"></div>
                <div className="w-0.5 h-6 bg-slate-300"></div>
                <div className="w-0.5 h-6 bg-slate-300 transform -rotate-[20deg]"></div>
              </div>

              {/* Layer 1: Edges */}
              <div className="w-80 bg-slate-100 border-2 border-slate-300 p-2 rounded-lg flex flex-col items-center z-10">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Layer 1: Edges & Pixels</span>
                <div className="flex gap-2 mt-1 font-mono text-slate-600 font-bold">
                   <span>/</span> <span>\</span> <span>|</span> <span>—</span> <span>O</span>
                </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 7: Probabilistic Context ---
const ProbabilisticContextSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center shrink-0">Representation Learning in Probabilistic Models</h2>
      <p className="text-slate-600 mb-8 text-center max-w-4xl mx-auto shrink-0 text-sm md:text-base">
        In Latent Variable Models (like VAEs), learning the model and learning the representation are exactly the same thing. The entire mathematical structure maps directly to finding a representation.
      </p>

      <div className="flex-grow flex items-center justify-center w-full max-w-5xl mx-auto pb-10">
         
         <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between w-full relative">
            
            {/* The Data Space X */}
            <div className="flex flex-col items-center bg-green-50 p-6 rounded-2xl border-2 border-green-200 shadow-sm w-48 relative z-10">
               <span className="text-xs font-bold text-green-800 uppercase tracking-widest mb-4 border-b border-green-200 pb-2 w-full text-center">Data Space (X)</span>
               <div className="w-24 h-24 bg-white rounded-lg border-2 border-green-400 overflow-hidden shadow-inner p-1">
                 <img src="https://picsum.photos/id/1025/100/100" className="w-full h-full object-cover grayscale" />
               </div>
               <span className="font-mono font-bold text-green-700 mt-3 text-lg">x</span>
            </div>

            {/* The Bridge (Encoder/Decoder) */}
            <div className="flex flex-col items-center justify-center relative flex-grow min-w-[250px] py-8 md:py-0">
               
               {/* Top Arrow: Encoder */}
               <div className="flex flex-col items-center w-full relative -translate-y-4">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Encoding / Inference</span>
                 <div className="w-full h-8 flex items-center relative">
                   <div className="w-full border-t-4 border-slate-300"></div>
                   <div className="absolute right-0 w-0 h-0 border-l-[12px] border-l-slate-300 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"></div>
                 </div>
                 <div className="bg-slate-800 text-white px-4 py-1.5 rounded-lg shadow-md font-mono font-bold text-sm transform -translate-y-1/2">
                   q_φ(z|x)
                 </div>
               </div>

               {/* Bottom Arrow: Decoder */}
               <div className="flex flex-col items-center w-full relative translate-y-4">
                 <div className="bg-blue-600 text-white px-4 py-1.5 rounded-lg shadow-md font-mono font-bold text-sm transform translate-y-1/2 z-10">
                   p_θ(x|z)
                 </div>
                 <div className="w-full h-8 flex items-center relative mt-1">
                   <div className="absolute left-0 w-0 h-0 border-r-[12px] border-r-blue-300 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent z-10"></div>
                   <div className="w-full border-t-4 border-blue-300"></div>
                 </div>
                 <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Decoding / Generation</span>
               </div>

            </div>

            {/* The Latent Space Z */}
            <div className="flex flex-col items-center bg-purple-50 p-6 rounded-2xl border-2 border-purple-200 shadow-sm w-48 relative z-10">
               <span className="text-xs font-bold text-purple-800 uppercase tracking-widest mb-4 border-b border-purple-200 pb-2 w-full text-center">Latent Space (Z)</span>
               <div className="w-24 h-24 bg-white rounded-full border-2 border-purple-400 overflow-hidden shadow-inner relative flex items-center justify-center">
                 <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500 to-transparent"></div>
                 <span className="font-bold text-purple-700 z-10 text-xs text-center">Compressed<br/>Representation</span>
               </div>
               <span className="font-mono font-bold text-purple-700 mt-3 text-lg">z</span>
               
               {/* Prior attached to Z */}
               <div className="absolute -top-4 -right-4 bg-white border border-purple-300 px-2 py-1 rounded shadow text-[9px] font-bold text-purple-600 flex flex-col items-center">
                 <span>Prior</span>
                 <span className="font-mono">p(z)</span>
               </div>
            </div>

         </div>

      </div>
    </div>
  );
};

// --- SLIDE 8: Evaluating Representations ---
const EvaluationSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center shrink-0">Measuring "Goodness"</h2>
      <p className="text-slate-600 mb-8 text-center max-w-4xl mx-auto shrink-0 text-sm md:text-base">
        How do we know if our learned representation is actually any good? We evaluate it using two primary methodologies.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow pb-8 items-stretch">
        
        {/* EXTRINSIC */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border-t-4 border-indigo-500 p-6 flex flex-col">
           <h3 className="text-xl font-bold text-indigo-900 mb-2 flex items-center gap-2">
             <Target className="w-5 h-5"/> Extrinsic Evaluation
           </h3>
           <p className="text-sm text-slate-600 mb-6">
             Test the representation on a completely separate, practical <strong>downstream task</strong>. If the representation is good, a simple classifier should get high accuracy easily.
           </p>

           <div className="flex-grow flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 w-full justify-between">
                 <div className="flex flex-col items-center">
                   <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center text-xl">🐶</div>
                   <span className="text-[9px] font-bold text-slate-500 mt-1">Raw Data</span>
                 </div>
                 
                 <ArrowRight className="w-4 h-4 text-slate-400" />
                 
                 <div className="bg-indigo-100 border border-indigo-300 px-2 py-4 rounded flex flex-col items-center">
                   <span className="text-[10px] font-bold text-indigo-800 text-center leading-tight">Frozen<br/>Encoder</span>
                 </div>

                 <ArrowRight className="w-4 h-4 text-slate-400" />

                 <div className="flex flex-col items-center">
                   <div className="w-8 h-8 bg-purple-100 border border-purple-300 rounded-full flex items-center justify-center font-mono text-[10px] font-bold text-purple-700">z</div>
                   <span className="text-[9px] font-bold text-slate-500 mt-1">Features</span>
                 </div>

                 <ArrowRight className="w-4 h-4 text-slate-400" />

                 <div className="bg-emerald-100 border border-emerald-300 px-2 py-4 rounded flex flex-col items-center shadow-sm">
                   <span className="text-[10px] font-bold text-emerald-800 text-center leading-tight">Simple<br/>Classifier</span>
                 </div>

                 <ArrowRight className="w-4 h-4 text-slate-400" />

                 <div className="flex flex-col items-center">
                   <div className="font-bold text-emerald-600 text-lg">99%</div>
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Accuracy</span>
                 </div>
              </div>
           </div>
        </div>

        {/* INTRINSIC */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border-t-4 border-rose-500 p-6 flex flex-col">
           <h3 className="text-xl font-bold text-rose-900 mb-2 flex items-center gap-2">
             <Search className="w-5 h-5"/> Intrinsic Evaluation
           </h3>
           <p className="text-sm text-slate-600 mb-6">
             Analyze the mathematical and structural properties of the representation space itself, without needing a downstream task.
           </p>

           <div className="flex-grow flex flex-col gap-3">
              
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-4">
                 <div className="bg-rose-100 p-2 rounded-lg text-rose-600 shrink-0"><ImageIcon className="w-4 h-4"/></div>
                 <div>
                   <h4 className="font-bold text-slate-800 text-sm">1. Reconstruction Quality</h4>
                   <p className="text-xs text-slate-500 mt-1">Does passing <span className="font-mono">x</span> to <span className="font-mono">z</span> and back perfectly recreate the original <span className="font-mono">x</span>?</p>
                 </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-4">
                 <div className="bg-amber-100 p-2 rounded-lg text-amber-600 shrink-0"><Shuffle className="w-4 h-4"/></div>
                 <div>
                   <h4 className="font-bold text-slate-800 text-sm">2. Disentanglement Metrics</h4>
                   <p className="text-xs text-slate-500 mt-1">Using mathematical scores (like MIG or SAP) to prove that <span className="font-mono">z1</span> controls <em>only</em> size, and <span className="font-mono">z2</span> controls <em>only</em> color.</p>
                 </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-4">
                 <div className="bg-teal-100 p-2 rounded-lg text-teal-600 shrink-0"><Move className="w-4 h-4"/></div>
                 <div>
                   <h4 className="font-bold text-slate-800 text-sm">3. Smoothness & Interpolation</h4>
                   <p className="text-xs text-slate-500 mt-1">Ensuring that drawing a straight line in <span className="font-mono">z</span>-space creates a smooth visual morph in <span className="font-mono">x</span>-space.</p>
                 </div>
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
    IntroSlide,
    FundamentalGoalsSlide,
    InvarianceEquivarianceSlide,
    DisentanglementSlide,
    ManifoldHypothesisSlide,
    SmoothnessHierarchySlide,
    ProbabilisticContextSlide,
    EvaluationSlide
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