import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info, Sliders, Database, Brain, Target, Network, Box, ArrowRight, ArrowDown, Loader, CheckCircle, XCircle } from 'lucide-react';

// --- Utility Functions ---
const generateDataPoints = (num, type = 'gaussian') => {
  const points = [];
  for (let i = 0; i < num; i++) {
    let x, y;
    if (type === 'gaussian') {
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
      x = z0 * 0.15 + 0.5;
      y = z1 * 0.15 + 0.5;
    } else {
      x = Math.random();
      y = Math.random();
    }
    points.push({ x, y, id: i });
  }
  return points;
};

// --- Slide 1: Introduction ---
const IntroductionSlide = () => {
  const [dataPoints, setDataPoints] = useState(generateDataPoints(50));
  const [showDistribution, setShowDistribution] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold text-blue-600 mb-4 text-center">Probabilistic Models: An Advanced Perspective</h1>
        <p className="text-xl text-gray-600 text-center max-w-3xl">
          At its core, machine learning is about understanding data. Probabilistic models take a principled approach: they attempt to learn the true, underlying probability distribution, <span className="font-mono font-bold">P(x)</span>, from which the data was generated.
        </p>
      </motion.div>

      <div className="mt-12 relative w-96 h-96 bg-white rounded-xl shadow-inner border border-gray-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span className="text-gray-200 text-8xl font-bold opacity-40">P(x)</span>
        </div>
        
        <AnimatePresence>
          {showDistribution && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.5, x: "-50%", y: "-50%" }}
              className="absolute w-80 h-80 rounded-full pointer-events-none"
              style={{ 
                left: '50%', 
                top: '50%', 
                background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(59,130,246,0.2) 40%, rgba(59,130,246,0) 70%)'
              }}
            />
          )}
        </AnimatePresence>

        {dataPoints.map((point) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, x: point.x * 384, y: point.y * 384 }}
            transition={{ duration: 0.5, delay: point.id * 0.02 }}
            className="absolute w-3 h-3 bg-teal-500 rounded-full shadow-sm z-10"
            style={{ left: -6, top: -6 }}
          />
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowDistribution(!showDistribution)}
        className="mt-8 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors flex items-center z-20"
      >
        {showDistribution ? 'Hide' : 'Reveal'} Underlying Distribution
      </motion.button>
      <p className="mt-4 text-gray-500 text-sm">
        Click to see the hidden distribution the model tries to learn from the observed data points.
      </p>
    </div>
  );
};

// --- Slide 2: Generative vs. Discriminative ---
const GenVsDiscSlide = () => {
  const [activeModel, setActiveModel] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleGenerate = () => {
    const hexColors = ['#f87171', '#60a5fa', '#4ade80', '#facc15', '#c084fc'];
    const randomColor = hexColors[Math.floor(Math.random() * hexColors.length)];
    setGeneratedImage(randomColor);
  };

  return (
    <div className="flex flex-col h-full p-8">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Generative vs. Discriminative Models</h2>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-4xl mx-auto">
        Machine learning models can be broadly categorized by their goal.
      </p>

      <div className="flex flex-col md:flex-row justify-around items-stretch flex-grow gap-8">
        {/* Discriminative Panel */}
        <motion.div
          className={`flex-1 bg-white rounded-xl shadow-lg border-2 ${activeModel === 'disc' ? 'border-purple-400' : 'border-transparent'} p-6 flex flex-col items-center transition-all cursor-pointer`}
          onClick={() => setActiveModel('disc')}
          whileHover={{ scale: 1.02 }}
        >
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <Target className="w-12 h-12 text-purple-500" />
          </div>
          <h3 className="text-2xl font-semibold text-purple-700 mb-2">Discriminative</h3>
          <p className="text-gray-500 text-center mb-6 font-mono bg-gray-100 px-3 py-1 rounded">Learn P(y|x)</p>
          <p className="text-gray-600 text-center mb-6">Given an input <strong>x</strong>, predict the label <strong>y</strong>.</p>
          
          <div className="flex items-center justify-center w-full space-x-4 mt-auto">
            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-4xl">🐱</div>
            <ArrowRight className="text-gray-400" />
            <div className="w-24 h-12 bg-purple-500 text-white rounded-md flex items-center justify-center font-bold">Model</div>
            <ArrowRight className="text-gray-400" />
            <div className="w-20 h-10 bg-purple-200 text-purple-800 rounded-md flex items-center justify-center font-bold">"Cat"</div>
          </div>
          {activeModel === 'disc' && <p className="text-purple-500 mt-4 text-sm font-medium">Cannot generate new cats.</p>}
        </motion.div>

        {/* Generative Panel */}
        <motion.div
          className={`flex-1 bg-white rounded-xl shadow-lg border-2 ${activeModel === 'gen' ? 'border-teal-400' : 'border-transparent'} p-6 flex flex-col items-center transition-all cursor-pointer`}
          onClick={() => setActiveModel('gen')}
          whileHover={{ scale: 1.02 }}
        >
          <div className="bg-teal-100 p-4 rounded-full mb-4">
            <Box className="w-12 h-12 text-teal-500" />
          </div>
          <h3 className="text-2xl font-semibold text-teal-700 mb-2">Generative (like VAEs)</h3>
          <p className="text-gray-500 text-center mb-6 font-mono bg-gray-100 px-3 py-1 rounded">Learn P(x)</p>
          <p className="text-gray-600 text-center mb-6">Learn the distribution of the data itself to create new samples.</p>
          
          <div className="flex items-center justify-center w-full space-x-4 mt-auto relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); handleGenerate(); setActiveModel('gen'); }}
              className="absolute -top-16 px-4 py-2 bg-teal-500 text-white font-semibold rounded shadow hover:bg-teal-600 transition-colors z-10"
            >
              Sample P(x)
            </motion.button>
            <div className="w-16 h-16 bg-teal-50 rounded-full border-2 border-dashed border-teal-400 flex items-center justify-center text-xs text-center italic text-teal-700">Latent<br/>Space</div>
            <ArrowRight className="text-gray-400" />
            <div className="w-24 h-12 bg-teal-500 text-white rounded-md flex items-center justify-center font-bold">Model</div>
            <ArrowRight className="text-gray-400" />
            <AnimatePresence mode='wait'>
              <motion.div
                key={generatedImage || 'placeholder'}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ backgroundColor: generatedImage || '#f3f4f6' }}
                className="w-16 h-16 rounded-md flex items-center justify-center text-4xl shadow-sm border border-gray-200"
              >
                {generatedImage ? '' : '?'}
              </motion.div>
            </AnimatePresence>
          </div>
          {activeModel === 'gen' && <p className="text-teal-600 mt-4 text-sm font-medium">Can generate new, synthetic data.</p>}
        </motion.div>
      </div>
      <p className="text-gray-500 mt-6 text-center">Click on a panel to highlight it. Try sampling from the generative model!</p>
    </div>
  );
};

// --- Slide 3: Explicit vs. Implicit Density ---
const ExplicitVsImplicitSlide = () => {
  const [xValue, setXValue] = useState(0);
  const [implicitSamples, setImplicitSamples] = useState([]);
  
  // Interactive states for Tractable/Intractable simulation
  const [tractableState, setTractableState] = useState('idle');
  const [intractableState, setIntractableState] = useState('idle');
  
  const gaussian = (x) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
  const yValue = gaussian(xValue);

  const plotWidth = 300;
  const plotHeight = 120;
  const plotPoints = [];
  for (let x = -3; x <= 3; x += 0.1) {
    plotPoints.push(`${(x + 3) * (plotWidth / 6)},${plotHeight - gaussian(x) * plotHeight * 2.5}`);
  }

  const handleGenerateSample = () => {
    setImplicitSamples([...implicitSamples, {
      id: Date.now(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    }]);
  };

  const handleTractableCompute = () => {
    setTractableState('computing');
    setTimeout(() => setTractableState('done'), 400); // Fast computation
    setTimeout(() => setTractableState('idle'), 3000); // Reset after 3s
  };

  const handleIntractableCompute = () => {
    setIntractableState('computing');
    setTimeout(() => setIntractableState('failed'), 2500); // Gets stuck computing integral, then fails
    setTimeout(() => setIntractableState('idle'), 5000); // Reset after 5s
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
      <h2 className="text-3xl font-bold text-blue-600 mb-2 text-center shrink-0">Explicit vs. Implicit Density Models</h2>
      <p className="text-gray-600 mb-4 text-center max-w-2xl mx-auto shrink-0">
        How do these models actually represent the probability of data, <span className="font-mono font-bold">P(x)</span>?
      </p>

      <div className="flex flex-col md:flex-row justify-around items-stretch flex-grow gap-4 lg:gap-6 pb-8">
        
        {/* --- EXPLICIT DENSITY PANEL --- */}
        <div className="flex-1 bg-white rounded-xl shadow-lg border-t-4 border-blue-500 p-4 lg:p-6 flex flex-col">
          <div className="flex items-center mb-2">
            <h3 className="text-xl lg:text-2xl font-bold text-blue-800">Explicit Density</h3>
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            The model defines a clear, mathematical formula for <span className="font-mono bg-gray-100 px-1 rounded">P(x)</span>. We can calculate the exact likelihood of any data point.
          </p>

          {/* Interactive Plot */}
          <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center border border-blue-100 mb-4 shrink-0">
            <svg width={plotWidth} height={plotHeight} className="overflow-visible">
              <polyline fill="none" stroke="#3b82f6" strokeWidth="3" points={plotPoints.join(' ')} />
              <line x1={(xValue + 3) * (plotWidth / 6)} y1={plotHeight} x2={(xValue + 3) * (plotWidth / 6)} y2={plotHeight - yValue * plotHeight * 2.5} stroke="#14b8a6" strokeWidth="2" strokeDasharray="4 2" />
              <circle cx={(xValue + 3) * (plotWidth / 6)} cy={plotHeight - yValue * plotHeight * 2.5} r="5" fill="#14b8a6" />
            </svg>
            <input type="range" min="-3" max="3" step="0.01" value={xValue} onChange={(e) => setXValue(parseFloat(e.target.value))} className="w-full mt-4" />
            <div className="mt-2 text-sm font-mono text-blue-900 bg-white px-3 py-1 rounded shadow-sm border border-blue-100">
              P(x) = <span className="text-teal-600 font-bold">{yValue.toFixed(4)}</span>
            </div>
          </div>
          
          {/* Sub-categories with Interactive Computation Test */}
          <div className="mt-auto flex flex-col gap-3">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Computation Test</div>
            
            {/* Tractable Card */}
            <div className={`border rounded-lg p-3 text-sm flex flex-col gap-2 relative overflow-hidden transition-colors ${tractableState === 'done' ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
              <div className="absolute right-0 top-0 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">Flows Live Here</div>
              <div className="flex justify-between items-start mt-2">
                <div className="pr-2">
                  <strong className="text-gray-800 flex items-center gap-1"><Target className="w-4 h-4 text-green-600"/> Tractable</strong>
                  <p className="text-[11px] text-gray-600 mt-1">Uses <strong>invertible</strong> functions. We can perfectly trace data backwards to compute exact probability.</p>
                </div>
                <button
                  onClick={handleTractableCompute}
                  disabled={tractableState !== 'idle'}
                  className={`px-2 py-1.5 text-[11px] font-bold rounded flex items-center gap-1 w-24 justify-center shrink-0 transition-colors ${
                    tractableState === 'idle' ? 'bg-green-600 text-white hover:bg-green-700' :
                    tractableState === 'computing' ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-800 border border-green-300'
                  }`}
                >
                  {tractableState === 'idle' && 'Compute P(x)'}
                  {tractableState === 'computing' && <Loader className="w-3 h-3 animate-spin" />}
                  {tractableState === 'done' && <><CheckCircle className="w-3 h-3"/> Fast: 0.04s</>}
                </button>
              </div>
              
              {/* NEW VISUAL GRAPHIC FOR TRACTABLE */}
              <div className="bg-white/60 rounded border border-green-100 p-2 flex items-center justify-between mt-1">
                <div className="flex flex-col items-center gap-1 w-1/3">
                  <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                  <span className="text-[9px] font-bold text-green-800 leading-tight text-center">Latent (z)</span>
                </div>
                
                <div className="flex flex-col items-center justify-center relative flex-grow px-2">
                  <div className="relative w-full h-8 flex items-center justify-center">
                       <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 32" preserveAspectRatio="none">
                          <path d="M0,16 L100,16" stroke="#22c55e" fill="none" strokeWidth="2" />
                          <polygon points="90,12 100,16 90,20" fill="#22c55e" />
                          <polygon points="10,12 0,16 10,20" fill="#22c55e" />
                       </svg>
                       <span className="bg-white/90 px-1 py-0.5 rounded text-[9px] font-bold z-10 text-green-700 shadow-sm border border-green-100">1:1 Reversible</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 w-1/3">
                  <div className="w-4 h-4 bg-gray-800 rounded-sm shadow-md"></div>
                  <span className="text-[9px] font-bold text-gray-800 leading-tight text-center">Data (x)</span>
                </div>
              </div>
            </div>
            
            {/* Intractable Card */}
            <div className={`border rounded-lg p-3 text-sm flex flex-col gap-2 relative overflow-hidden transition-colors ${intractableState === 'failed' ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-200'}`}>
              <div className="absolute right-0 top-0 bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">VAEs Live Here</div>
              <div className="flex justify-between items-start mt-2">
                <div className="pr-2">
                  <strong className="text-gray-800 flex items-center gap-1"><Brain className="w-4 h-4 text-blue-600"/> Intractable</strong>
                  <p className="text-[11px] text-gray-600 mt-1">Not perfectly reversible. Requires summing (<strong>integrating</strong>) over <em>infinite</em> hidden paths to get exact P(x).</p>
                </div>
                <button
                  onClick={handleIntractableCompute}
                  disabled={intractableState !== 'idle'}
                  className={`px-2 py-1.5 text-[11px] font-bold rounded flex items-center gap-1 w-24 justify-center shrink-0 transition-colors ${
                    intractableState === 'idle' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                    intractableState === 'computing' ? 'bg-gray-200 text-gray-600' : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {intractableState === 'idle' && 'Compute P(x)'}
                  {intractableState === 'computing' && <Loader className="w-3 h-3 animate-spin" />}
                  {intractableState === 'failed' && <><XCircle className="w-3 h-3"/> Too Slow!</>}
                </button>
              </div>

              {/* NEW VISUAL GRAPHIC FOR INTRACTABLE */}
              <div className="bg-white/60 rounded border border-blue-100 p-2 flex items-center justify-between mt-1">
                <div className="flex flex-col items-center gap-1 w-1/3">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 border-2 border-blue-400 rounded-sm"></div>
                    <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-blue-400 transform rotate-45"></div>
                  </div>
                  <span className="text-[9px] font-bold text-blue-800 leading-tight text-center">Latent (z)</span>
                  <span className="text-[8px] text-gray-500 leading-tight text-center">Infinite Hidden Causes</span>
                </div>
                
                <div className="flex flex-col items-center justify-center relative flex-grow px-2">
                  <div className="relative w-full h-10 flex items-center justify-center">
                       <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <path d="M0,5 Q50,0 100,20" stroke="#93c5fd" fill="none" strokeWidth="1" strokeDasharray="3 3" />
                          <path d="M0,20 Q50,20 100,20" stroke="#60a5fa" fill="none" strokeWidth="1.5" />
                          <path d="M0,35 Q50,40 100,20" stroke="#93c5fd" fill="none" strokeWidth="1" strokeDasharray="3 3" />
                       </svg>
                       <span className="bg-white/90 px-1 py-0.5 rounded text-[10px] font-mono font-bold z-10 text-blue-700 shadow-sm border border-blue-100 text-center whitespace-nowrap">∫ sum over ∞</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 w-1/3">
                  <div className="w-5 h-5 bg-gray-800 rounded-full shadow-md"></div>
                  <span className="text-[9px] font-bold text-gray-800 leading-tight text-center">Data (x)</span>
                  <span className="text-[8px] text-gray-500 leading-tight text-center">Observed "Shadow"</span>
                </div>
              </div>

              {intractableState === 'computing' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-red-600 mt-1 bg-red-100 p-1 rounded font-mono font-medium flex items-center gap-2">
                  <Loader className="w-3 h-3 animate-spin shrink-0"/> Stuck integrating over z... (∞)
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* --- IMPLICIT DENSITY PANEL --- */}
        <div className="flex-1 bg-white rounded-xl shadow-lg border-t-4 border-purple-500 p-4 lg:p-6 flex flex-col">
          <div className="flex items-center mb-2">
            <h3 className="text-xl lg:text-2xl font-bold text-purple-800">Implicit Density</h3>
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            No exact formula exists. The model acts as a "black box" mechanism designed only to <span className="font-bold">sample</span> new, realistic data.
          </p>

          {/* Interactive Generator */}
          <div className="bg-purple-50 rounded-xl p-4 flex-grow flex flex-col items-center justify-center border border-purple-100 relative overflow-hidden mb-4 min-h-[120px] shrink-0">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-400 to-transparent"></div>
            
            {implicitSamples.map((sample) => (
              <motion.div key={sample.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute w-3 h-3 bg-purple-500 rounded-full shadow-md" style={{ left: `${sample.x}%`, top: `${sample.y}%` }} />
            ))}

            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleGenerateSample}
              className="px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors z-10 flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" /> Sample Data
            </motion.button>
            <div className="mt-3 text-xs text-purple-800 bg-white/80 px-2 py-1 rounded border border-purple-200 z-10 font-mono">
              P(x) = ??? (Unknown)
            </div>
          </div>

          {/* Sub-categories */}
          <div className="mt-auto flex flex-col gap-2">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm flex items-start gap-2">
               <div className="mt-0.5 text-gray-500"><Box className="w-4 h-4" /></div>
               <div>
                 <strong className="text-gray-800">How it works:</strong> Maps random noise directly to data. Great at generation, but cannot evaluate likelihood.
               </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm relative overflow-hidden flex items-start gap-2 shadow-sm">
              <div className="absolute right-0 top-0 bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">GANs Live Here</div>
              <div className="mt-0.5 text-purple-600"><Database className="w-4 h-4" /></div>
              <div className="pr-16">
                <strong className="text-purple-900">Example:</strong> Generative Adversarial Networks (GANs) are the prime example of implicit models.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Slide 4: Maximum Likelihood Estimation ---
const MLESlide = () => {
  const [mean, setMean] = useState(150);
  const [stdDev, setStdDev] = useState(30);
  const [likelihood, setLikelihood] = useState(0);

  const data = [120, 145, 155, 170, 130, 160]; // Fixed data points
  const plotWidth = 400;
  const plotHeight = 200;

  const gaussian = (x, mu, sigma) => {
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
  };

  useEffect(() => {
    let logLikelihood = 0;
    data.forEach(x => {
      logLikelihood += Math.log(gaussian(x, mean, stdDev) + 1e-9); // Add small epsilon for stability
    });
    setLikelihood(logLikelihood);
  }, [mean, stdDev]);

  const plotPoints = [];
  for (let x = 50; x <= 250; x += 2) {
    plotPoints.push(`${x * (plotWidth / 300)},${plotHeight - gaussian(x, mean, stdDev) * plotHeight * 80}`);
  }

  const isOptimal = likelihood > -31;

  return (
    <div className="flex flex-col h-full p-8">
      <h2 className="text-3xl font-bold text-blue-600 mb-4 text-center">Maximum Likelihood Estimation (MLE)</h2>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
        The goal is to find the parameters θ (e.g., mean μ, standard deviation σ) that maximize the likelihood of the observed data.
      </p>

      <div className="flex flex-col md:flex-row justify-center items-start gap-12">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <svg width={plotWidth} height={plotHeight} className="overflow-visible border-b-2 border-l-2 border-gray-300">
            {/* Data Points */}
            {data.map((x, i) => (
              <g key={i}>
                <line x1={x * (plotWidth / 300)} y1={plotHeight} x2={x * (plotWidth / 300)} y2={plotHeight - gaussian(x, mean, stdDev) * plotHeight * 80} stroke="#14b8a6" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
                <circle cx={x * (plotWidth / 300)} cy={plotHeight} r="6" fill="#8b5cf6" className="shadow-sm" />
              </g>
            ))}
            {/* Distribution Curve */}
            <polyline fill="none" stroke="#3b82f6" strokeWidth="3" points={plotPoints.join(' ')} />
          </svg>
          <div className="flex justify-between text-gray-500 text-sm mt-2 font-mono">
            <span>50</span><span>150</span><span>250</span>
          </div>
          <p className="text-center text-gray-500 text-sm mt-1 font-medium">Observed Data Values (x)</p>
        </div>

        <div className="flex flex-col space-y-6 bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-100">
          <div>
            <label className="flex justify-between items-center text-sm font-bold text-gray-700 mb-2">
              Mean (μ): <span className="font-mono text-blue-600">{mean.toFixed(0)}</span>
            </label>
            <input type="range" min="100" max="200" value={mean} onChange={(e) => setMean(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <label className="flex justify-between items-center text-sm font-bold text-gray-700 mb-2">
              Std Dev (σ): <span className="font-mono text-blue-600">{stdDev.toFixed(0)}</span>
            </label>
            <input type="range" min="10" max="60" value={stdDev} onChange={(e) => setStdDev(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
          </div>

          <div className={`p-6 rounded-xl border-2 transition-colors ${isOptimal ? 'bg-teal-50 border-teal-200' : 'bg-gray-50 border-gray-200'}`}>
            <p className="text-center text-sm text-gray-600 mb-2 font-medium">Total Log-Likelihood</p>
            <p className={`text-center font-mono text-4xl font-bold ${isOptimal ? 'text-teal-600' : 'text-gray-700'}`}>
              {likelihood.toFixed(2)}
            </p>
            <p className="text-center text-xs text-gray-500 mt-3">Adjust sliders to maximize this value!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Slide 5: High Dimensions & Manifolds ---
const ManifoldSlide = () => {
  const numPoints = 200;
  const points = Array.from({ length: numPoints }, () => ({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    z: Math.random() * 2 - 1,
  }));

  // Create manifold points (a twisted ribbon)
  const manifoldPoints = [];
  for (let t = 0; t < Math.PI * 2; t += 0.15) {
    for (let w = -0.5; w <= 0.5; w += 0.15) {
      const x = Math.cos(t) * (1 + w * Math.cos(t / 2));
      const y = Math.sin(t) * (1 + w * Math.cos(t / 2));
      const z = w * Math.sin(t / 2);
      manifoldPoints.push({ x: x * 0.5, y: y * 0.5, z: z * 0.5 });
    }
  }

  return (
    <div className="flex flex-col h-full p-8 items-center">
      <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">Challenges in High-Dimensional Spaces</h2>

      <div className="flex flex-col lg:flex-row w-full max-w-6xl items-center justify-between flex-grow gap-12">
        
        {/* Left Column: Text Content */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          
          <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl shadow-sm">
            <h3 className="text-xl font-bold text-red-700 mb-2">The "Curse of Dimensionality"</h3>
            <p className="text-gray-700 text-sm mb-3">
              A tiny 100x100 pixel image with 3 color channels has <strong>30,000 dimensions</strong>. Directly modeling <span className="font-mono bg-white px-1 border border-red-100 rounded">P(x)</span> in such spaces is exceptionally challenging:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 marker:text-red-400">
              <li>The volume of space grows exponentially.</li>
              <li>Data becomes inherently <strong>sparse</strong>.</li>
              <li>Possible configurations are astronomically large.</li>
            </ul>
          </div>

          <div className="bg-teal-50 border-l-4 border-teal-500 p-5 rounded-r-xl shadow-sm">
            <h3 className="text-xl font-bold text-teal-800 mb-2">The Manifold Hypothesis</h3>
            <p className="text-gray-700 text-sm">
              Despite high dimensionality, real data (like faces or audio) isn't random static. It lies on or near a <strong>lower-dimensional manifold</strong> embedded within that massive high-dimensional space.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full opacity-50"></div>
             <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
               <Box className="w-5 h-5 text-blue-600" /> Enter Latent Variables
             </h3>
             <p className="text-gray-700 text-sm">
               This hypothesis directly motivates the use of <strong>latent variables</strong>. They aim to capture the intrinsic structure of the data in a much more compact form.
             </p>
          </div>
        </div>

        {/* Right Column: 3D Visualization */}
        <div className="flex-1 flex flex-col items-center justify-center relative w-full">
          <div className="relative w-80 h-80 md:w-96 md:h-96" style={{ perspective: '1000px' }}>
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: 360, rotateX: 15 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              {/* Bounding Box (Centered) */}
              <div className="absolute inset-0 border border-gray-300 opacity-30" style={{ transform: 'translateZ(-150px)' }}></div>
              <div className="absolute inset-0 border border-gray-300 opacity-30" style={{ transform: 'translateZ(150px)' }}></div>
              
              {/* Scattered "Sparse" Data */}
              {points.map((p, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-gray-400 rounded-full opacity-40"
                  style={{
                    left: '50%', top: '50%', // Centered origin
                    transform: `translate3d(${p.x * 150}px, ${p.y * 150}px, ${p.z * 150}px)`,
                  }}
                />
              ))}

              {/* Manifold Data */}
              {manifoldPoints.map((p, i) => (
                <div
                  key={`m-${i}`}
                  className="absolute w-2 h-2 bg-teal-500 rounded-full shadow-sm"
                  style={{
                    left: '50%', top: '50%', // Centered origin
                    transform: `translate3d(${p.x * 180}px, ${p.y * 180}px, ${p.z * 180}px)`,
                  }}
                />
              ))}
            </motion.div>
          </div>
          
          {/* Visual Legend */}
          <div className="mt-8 flex flex-col gap-3 text-sm max-w-sm w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 text-gray-600">
               <div className="w-4 h-4 bg-gray-400 rounded-full opacity-50 shrink-0"></div>
               <span><strong>Random Space:</strong> Sparse, meaningless configurations.</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
               <div className="w-4 h-4 bg-teal-500 rounded-full shadow-sm shrink-0"></div>
               <span><strong>Manifold:</strong> Structured, concentrated real data.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

// --- Slide 6: The Importance of Model Assumptions ---
const AssumptionsSlide = () => {
  const [assumptionType, setAssumptionType] = useState('strong');

  // Generate U-shaped data to represent "complex real-world data"
  const complexDataPoints = Array.from({ length: 40 }).map((_, i) => {
    const x = (i / 39) * 2 - 1; // -1 to 1
    const y = x * x; // Parabola
    return { x, y: y + (Math.random() * 0.2 - 0.1) }; // Add noise
  });

  return (
    <div className="flex flex-col h-full p-8 items-center overflow-y-auto">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">The Importance of Model Assumptions</h2>
      <p className="text-gray-600 mb-8 text-center max-w-4xl text-sm md:text-base">
        A model can't learn everything from scratch. We have to give it "rules" or "shapes" to start with. These are <strong>model assumptions</strong>, encoded in the math we choose.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl items-stretch">
        
        {/* Left Column: Types of Assumptions */}
        <div className="flex-1 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-2">Common Types of Assumptions</h3>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-start">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0"><Target className="w-5 h-5" /></div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Distributional</h4>
              <p className="text-xs text-gray-600 mt-1">Assuming the data follows a specific shape, like a Gaussian (bell curve) or Bernoulli (coin flip).</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-start">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600 shrink-0"><Box className="w-5 h-5" /></div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Independence</h4>
              <p className="text-xs text-gray-600 mt-1">Assuming variables don't directly affect each other (e.g., assuming pixels are independent given a latent variable).</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-start">
            <div className="bg-teal-100 p-2 rounded-lg text-teal-600 shrink-0"><Network className="w-5 h-5" /></div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Structural</h4>
              <p className="text-xs text-gray-600 mt-1">Assuming specific relationships, like using a particular neural network architecture (e.g., CNNs assume grid structures).</p>
            </div>
          </div>

          {/* VAE Callout */}
          <div className="mt-auto bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl shadow-sm">
            <h4 className="font-bold text-blue-800 text-sm flex items-center gap-2"><Brain className="w-4 h-4" /> In VAEs:</h4>
            <p className="text-xs text-blue-900 mt-2">
              VAEs make a massive distributional assumption: they assume the latent variables <span className="font-mono font-bold bg-white px-1 rounded">P(z)</span> follow a <strong>Standard Gaussian</strong> distribution.
            </p>
          </div>
        </div>

        {/* Right Column: The Double-Edged Sword Visualizer */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-lg border-t-4 border-gray-800 p-6 flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">The "Double-Edged Sword"</h3>
          <p className="text-center text-sm text-gray-500 mb-6">See how different assumptions affect fitting to complex data.</p>

          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <button 
                onClick={() => setAssumptionType('strong')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${assumptionType === 'strong' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Strong Assumption (Gaussian)
              </button>
              <button 
                onClick={() => setAssumptionType('weak')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${assumptionType === 'weak' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Weak Assumption (Complex)
              </button>
            </div>
          </div>

          {/* Plot Area */}
          <div className="relative w-full h-48 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
            {/* Raw Data Points (U-Shape) */}
            {complexDataPoints.map((p, i) => (
              <div 
                key={i} 
                className="absolute w-2 h-2 bg-gray-800 rounded-full z-20"
                style={{ left: `${(p.x + 1) * 40 + 10}%`, top: `${(1 - p.y) * 60 + 20}%` }}
              />
            ))}

            {/* Overlays based on Assumption */}
            <AnimatePresence mode="wait">
              {assumptionType === 'strong' ? (
                <motion.div
                  key="strong"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="absolute w-[80%] h-[80%] border-4 border-blue-500 bg-blue-200 bg-opacity-30 rounded-full z-10"
                />
              ) : (
                <motion.svg
                  key="weak"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 w-full h-full z-10"
                >
                  <path 
                    d="M 10% 20% Q 50% 120% 90% 20%" 
                    fill="none" 
                    stroke="rgba(168, 85, 247, 0.5)" 
                    strokeWidth="40" 
                    strokeLinecap="round"
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </div>

          {/* Trade-off Explanation */}
          <div className="mt-6 flex gap-4 h-28">
             <div className="flex-1 bg-green-50 border border-green-200 p-3 rounded-xl flex flex-col">
                <span className="text-green-700 font-bold text-sm mb-1 flex items-center gap-1">Benefits</span>
                <p className="text-xs text-green-800">
                  {assumptionType === 'strong' 
                    ? "Math is tractable (solvable). Requires very few parameters (just mean & variance). Fast to compute." 
                    : "Can capture the true, complex nature of the real data distribution perfectly."}
                </p>
             </div>
             <div className="flex-1 bg-red-50 border border-red-200 p-3 rounded-xl flex flex-col">
                <span className="text-red-700 font-bold text-sm mb-1 flex items-center gap-1">Drawbacks</span>
                <p className="text-xs text-red-800">
                  {assumptionType === 'strong' 
                    ? "High Bias! The data isn't a circle, so the model fundamentally misunderstands the true shape." 
                    : "Math becomes intractable. Requires massive amounts of data and compute to learn. Prone to overfitting."}
                </p>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

// --- Main Slideshow Component ---
const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    IntroductionSlide,
    GenVsDiscSlide,
    ExplicitVsImplicitSlide,
    MLESlide,
    ManifoldSlide,
    AssumptionsSlide,
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="flex flex-col min-h-full bg-slate-50 font-sans">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 shrink-0">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <CurrentSlideComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center p-6 bg-white shadow-md z-10 border-t border-gray-200 shrink-0">
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
              className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-blue-600 scale-125' : 'bg-gray-300'}`}
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

// --- App Component ---
export default function App() {
  return (
    <div className="App">
      <Slideshow />
    </div>
  );
}