import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Info, Play, RotateCcw, ArrowRightLeft, Cpu, AlertCircle, CheckCircle2, Maximize2, Minimize2, Grid, Box, XCircle, Zap, Hourglass, X, Network, ArrowDown, Activity, Database, Sliders, Layers, CornerDownRight } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(0);
  const [squeezeLevel, setSqueezeLevel] = useState(50);
  const [isFlowing, setIsFlowing] = useState(false);
  const [flowDirection, setFlowDirection] = useState('training'); // 'training' or 'generating'
  const [trainingEpoch, setTrainingEpoch] = useState(0); // For step 7
  const [stretchFactor, setStretchFactor] = useState(1); // For step 10
  
  // Toggle for the Math Formula (Slides 14 & 15)
  const [formulaView, setFormulaView] = useState('textbook'); // 'textbook' or 'pytorch'

  // States for Step 11 & 12 (Multivariate/Jacobian)
  const [scaleX, setScaleX] = useState(1.0);
  const [scaleY, setScaleY] = useState(1.0);
  const determinant = (scaleX * scaleY).toFixed(2);

  // Helper to generate a Gaussian (bell curve) path
  const generateGaussianPath = (mu, sigma, heightScale = 1, width = 400, height = 200) => {
    let path = `M 0 ${height} `;
    for (let x = 0; x <= width; x += 2) {
      const scaledX = ((x / width) * 8) - 4;
      const y = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((scaledX - mu) / sigma, 2));
      const visualY = height - (y * heightScale);
      path += `L ${x} ${visualY} `;
    }
    path += `L ${width} ${height} Z`;
    return path;
  };

  // Helper for a complex, bumpy distribution (Target Data Space)
  const generateComplexPath = (width = 400, height = 200) => {
    let path = `M 0 ${height} `;
    for (let x = 0; x <= width; x += 2) {
      const scaledX = ((x / width) * 8) - 4;
      const y1 = (1 / (0.8 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((scaledX + 2) / 0.8, 2));
      const y2 = (1 / (0.4 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((scaledX - 1) / 0.4, 2));
      const y3 = (1 / (1.2 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((scaledX - 3) / 1.2, 2));
      
      const totalY = (y1 * 0.4) + (y2 * 0.5) + (y3 * 0.3);
      const visualY = height - (totalY * 180);
      path += `L ${x} ${visualY} `;
    }
    path += `L ${width} ${height} Z`;
    return path;
  };

  // Helper to blend between complex and gaussian
  const generateBlendedPath = (t, width = 120, height = 60) => {
    let path = `M 0 ${height} `;
    for (let x = 0; x <= width; x += 2) {
      const scaledX = ((x / width) * 8) - 4;
      const yG = (1 / (1 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(scaledX / 1, 2));
      const y1 = (1 / (0.8 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((scaledX + 2) / 0.8, 2));
      const y2 = (1 / (0.4 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((scaledX - 1) / 0.4, 2));
      const y3 = (1 / (1.2 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((scaledX - 3) / 1.2, 2));
      const yC = (y1 * 0.4) + (y2 * 0.5) + (y3 * 0.3);

      const finalY = (yC * (1 - t)) + (yG * t);
      const scale = (180 * (1 - t)) + (80 * t);
      const visualY = height - (finalY * scale * (height / 200));
      path += `L ${x} ${visualY} `;
    }
    path += `L ${width} ${height} Z`;
    return path;
  };

  const runTrainingEpoch = () => {
    if (trainingEpoch >= 100) {
      setTrainingEpoch(0);
      return;
    }
    setTrainingEpoch(prev => Math.min(prev + 33.33, 100));
  };

  const renderFormulaToggle = () => (
    <div className="flex justify-center gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit mx-auto">
       <button 
          onClick={() => setFormulaView('textbook')} 
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${formulaView === 'textbook' ? 'bg-white shadow text-rose-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
         Textbook View (Generating: Z → X)
       </button>
       <button 
          onClick={() => setFormulaView('pytorch')} 
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${formulaView === 'pytorch' ? 'bg-white shadow text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
         PyTorch View (Training: X → Z)
       </button>
    </div>
  );

  const steps = [
    {
      title: "1. Continuous vs. Discrete",
      subtitle: "Why we can't count exact probabilities anymore.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            <strong>Discrete variables</strong> are like rolling dice or counting people. You get exact, isolated numbers (1, 2, 3). The probability of rolling exactly a 3 is 1/6.
          </p>
          <p className="text-gray-700">
            <strong>Continuous variables</strong> are like measuring height, weight, or pouring water. You can always get more precise (1.5 liters, 1.512 liters, 1.51299 liters...). 
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 relative overflow-hidden h-48 flex flex-col justify-center items-center">
            <div className="w-full flex justify-around items-center mb-6">
              <div className="text-center">
                <div className="flex gap-2 mb-2">
                  {[1,2,3].map(i => <div key={i} className="w-6 h-6 bg-blue-500 rounded-full" />)}
                </div>
                <span className="text-sm font-semibold text-blue-700">Discrete (Countable)</span>
              </div>
              <div className="text-center w-1/2">
                <div className="h-6 w-full bg-gradient-to-r from-blue-300 to-blue-600 rounded-full mb-2 relative overflow-hidden">
                    <div className="absolute top-0 bottom-0 w-1 bg-white/50 animate-[ping_3s_infinite]" style={{left: '43.218%_infinite'}} />
                </div>
                <span className="text-sm font-semibold text-blue-700">Continuous (Infinite points)</span>
              </div>
            </div>
            <p className="text-sm text-blue-800 text-center px-4">
              Because there are <i>infinite</i> possible exact measurements, the chance of hitting one <strong>exact, microscopic</strong> number is basically zero. We need a new way to measure probability.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "2. The Probability Density Function (PDF)",
      subtitle: "Think of it as a block of clay.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Instead of asking "What is the probability of exactly X?", we use a PDF (the curve below). It shows the <strong>density</strong> of likelihood.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <strong className="text-green-800 font-mono text-xs block mb-1">∫ p(x)dx = 1</strong>
              <span className="text-green-900"><strong>Rule 1:</strong> The total area under the curve is always exactly 1 (or 100%). You have exactly 1 block of clay.</span>
            </div>
            <div className="bg-purple-50 p-3 rounded border border-purple-200">
              <strong className="text-purple-800 font-mono text-xs block mb-1">p(x) &gt; 1 is OK!</strong>
              <span className="text-purple-900"><strong>Rule 2:</strong> Density is NOT probability. Use the slider below to squeeze the clay!</span>
            </div>
          </div>
          
          <div className="relative border border-gray-200 rounded-lg bg-white p-4">
            <svg viewBox="0 0 400 200" className="w-full h-48 overflow-visible">
              <line x1="0" y1="100" x2="400" y2="100" stroke="#ef4444" strokeWidth="1" strokeDasharray="5,5" />
              <text x="5" y="95" className="text-xs fill-red-500 font-semibold">Density = 1.0</text>
              <path 
                d={generateGaussianPath(0, 1.2 - (squeezeLevel / 100) * 1.0, 100)} 
                fill="url(#clayGradient)" 
                stroke="#6366f1" 
                strokeWidth="2"
                style={{ transition: 'd 0.1s ease-out' }}
              />
              <defs>
                <linearGradient id="clayGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="mt-4 flex flex-col items-center">
              <label className="text-sm font-semibold text-gray-700 mb-2">Squeeze the distribution</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={squeezeLevel} 
                onChange={(e) => setSqueezeLevel(e.target.value)}
                className="w-full max-w-xs accent-indigo-600"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Notice how the peak goes <strong>above 1.0</strong> when you squeeze it? The total area (amount of clay) is still 1, but it's densely packed into a narrow space!
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "3. Latent Space (Z) vs Data Space (X)",
      subtitle: "The Factory Default vs. The Real World",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We are working with two different "worlds" or spaces.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 flex flex-col items-center">
              <h4 className="font-bold text-indigo-800 mb-2">Latent Space (Z)</h4>
              <p className="text-xs text-indigo-600 mb-4 text-center">The "Base Distribution". Simple, cheap, standard bell curve.</p>
              <svg viewBox="0 0 200 100" className="w-full">
                <path d={generateGaussianPath(0, 1, 80, 200, 100)} fill="#c7d2fe" stroke="#4f46e5" strokeWidth="2" />
              </svg>
              <p className="text-xs mt-4 text-gray-600 text-center">Like a perfectly smooth, unformed ball of clay. Easy to grab a piece from the middle.</p>
            </div>
            <div className="bg-rose-50 rounded-lg p-4 border border-rose-100 flex flex-col items-center">
              <h4 className="font-bold text-rose-800 mb-2">Data Space (X)</h4>
              <p className="text-xs text-rose-600 mb-4 text-center">The "Target Distribution". Real data (like human speech or images).</p>
              <svg viewBox="0 0 200 100" className="w-full">
                <path d={generateComplexPath(200, 100)} fill="#fecdd3" stroke="#e11d48" strokeWidth="2" />
              </svg>
              <p className="text-xs mt-4 text-gray-600 text-center">Highly complex, "multimodal" (many peaks). You can't describe this with a simple equation.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "4. The Normalizing Flow",
      subtitle: "Molding the clay with math.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We want our AI to generate complex real-world data. But we only know how to easily generate simple bell-curve data. 
          </p>
          <p className="text-gray-700">
            A <strong>Normalizing Flow</strong> is an invertible mathematical transformation. It acts like a mold or a funhouse mirror: it stretches, squishes, and shifts the simple Latent Space (Z) into the complex Data Space (X).
          </p>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative overflow-hidden flex flex-col items-center">
            <svg viewBox="0 0 400 200" className="w-full h-48 mb-4">
              <path 
                d={isFlowing ? generateComplexPath(400, 200) : generateGaussianPath(0, 1.2, 120, 400, 200)} 
                fill={isFlowing ? "#fecdd3" : "#c7d2fe"} 
                stroke={isFlowing ? "#e11d48" : "#4f46e5"} 
                strokeWidth="3"
                style={{ transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
            </svg>
            <button 
              onClick={() => setIsFlowing(!isFlowing)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-colors ${
                isFlowing ? 'bg-rose-500 hover:bg-rose-600' : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              {isFlowing ? (
                <><RotateCcw size={18} /> Revert to Simple Base (Z)</>
              ) : (
                <><Play size={18} /> Apply Normalizing Flow (to X)</>
              )}
            </button>
            <p className="text-xs text-center text-slate-500 mt-4 max-w-md">
              Because the math is "invertible", we can train the AI by taking real data (X), flowing it backwards into simple clay (Z), and adjusting our "mold" until the clay forms a perfect bell curve!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "5. The Blueprint vs. The Builder",
      subtitle: "Did the network design the Bell Curve?",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            You might wonder: Do we use the neural network to <em>decide</em> what the Latent Space (Z) should look like? 
            <strong> No! The shape of the Latent Space is a "blueprint" chosen entirely out of nowhere.</strong>
          </p>
          <p className="text-gray-700">
            We explicitly choose a perfect bell curve to be our target blueprint <em>before the AI even looks at the data</em>. We pick it because computers already know the exact mathematical rules for picking random numbers from a bell curve. 
          </p>
          <p className="text-gray-700">
            The Neural Network doesn't <em>invent</em> the Latent Space. The network is the <strong>builder (or bridge)</strong> whose only job is to squish the messy data until it fits that pre-chosen blueprint.
          </p>
          <div className="bg-white p-5 rounded-xl border border-gray-200 mt-4 shadow-sm">
            <div className="flex justify-center gap-2 mb-8 bg-gray-100 p-1 rounded-lg w-fit mx-auto">
               <button 
                  onClick={() => setFlowDirection('training')} 
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${flowDirection === 'training' ? 'bg-white shadow text-rose-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                 1. Training Phase (X → Z)
               </button>
               <button 
                  onClick={() => setFlowDirection('generating')} 
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${flowDirection === 'generating' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                 2. Generating Phase (Z → X)
               </button>
            </div>
            <div className="flex items-center justify-between gap-2 px-4">
              <div className={`flex flex-col items-center transition-opacity ${flowDirection === 'generating' ? 'opacity-50' : 'opacity-100'}`}>
                <span className="text-xs font-bold text-rose-600 mb-2">Real Data (X)</span>
                <svg viewBox="0 0 100 50" className="w-24 border-b-2 border-rose-200 pb-1">
                  <path d={generateComplexPath(100, 50)} fill="#fecdd3" stroke="#e11d48" strokeWidth="2" />
                </svg>
                <span className="text-[10px] text-gray-500 mt-2 max-w-[80px] text-center">Messy, complex dataset</span>
              </div>
              <div className="flex flex-col items-center relative flex-1">
                <div className={`w-full flex items-center justify-center transition-all duration-500 absolute top-[-15px] ${flowDirection === 'training' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px]'}`}>
                  <div className="h-1 w-full bg-gradient-to-r from-rose-400 to-indigo-400 rounded-full relative overflow-hidden">
                    <div className="absolute top-0 bottom-0 w-4 bg-white/60 shadow-[0_0_8px_white] animate-[moveRight_1.5s_linear_infinite]" />
                  </div>
                  <ArrowRight className="text-indigo-500 -ml-2" size={16} />
                </div>
                <div className={`w-full flex items-center justify-center transition-all duration-500 absolute top-[-15px] ${flowDirection === 'generating' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[20px]'}`}>
                  <ArrowLeft className="text-rose-500 -mr-2 z-10" size={16} />
                  <div className="h-1 w-full bg-gradient-to-l from-indigo-400 to-rose-400 rounded-full relative overflow-hidden">
                    <div className="absolute top-0 bottom-0 w-4 bg-white/60 shadow-[0_0_8px_white] animate-[moveLeft_1.5s_linear_infinite]" />
                  </div>
                </div>
                <div className="bg-slate-800 text-white p-3 rounded-lg shadow-lg flex flex-col items-center relative z-10 mt-4 border-2 border-slate-700">
                  <Cpu size={24} className="mb-1 text-teal-400" />
                  <span className="text-xs font-bold text-center">Neural Network<br/>(The Flow)</span>
                </div>
              </div>
              <div className={`flex flex-col items-center transition-opacity ${flowDirection === 'training' ? 'opacity-50' : 'opacity-100'}`}>
                <span className="text-xs font-bold text-indigo-600 mb-2">Latent Space (Z)</span>
                <svg viewBox="0 0 100 50" className="w-24 border-b-2 border-indigo-200 pb-1">
                  <path d={generateGaussianPath(0, 1, 40, 100, 50)} fill="#c7d2fe" stroke="#4f46e5" strokeWidth="2" />
                </svg>
                <span className="text-[10px] text-gray-500 mt-2 max-w-[80px] text-center">Pre-chosen perfect bell curve blueprint</span>
              </div>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes moveRight { from { left: -20%; } to { left: 120%; } }
              @keyframes moveLeft { from { right: -20%; } to { right: 120%; } }
            `}} />
            <div className="mt-6 bg-blue-50 text-blue-900 text-sm p-4 rounded-lg border border-blue-100">
              {flowDirection === 'training' ? (
                <p><strong>Training:</strong> The Neural Network takes real data (X) and tries to warp it. We tweak the network until the output perfectly matches our pre-chosen bell curve blueprint (Z).</p>
              ) : (
                <p><strong>Generating:</strong> Since we know the math of a bell curve, we easily pick a random point in Z. We run the Neural Network <em>in reverse</em> to warp that point into a brand new piece of complex data (X)!</p>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "6. Layer by Layer Learning",
      subtitle: "Ironing out the wrinkles, one hidden layer at a time.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            <strong>Yes, you nailed it!</strong> The neural network <em>learns</em> to transform the data into a bell curve over a series of steps. 
          </p>
          <p className="text-gray-700">
            During training, we feed the messy Real Data (X) into the first layer of the network. Each hidden layer applies a tiny mathematical tweak to the data. By the time the data reaches the final layer, the network has gradually "ironed out" all the complex bumps <strong>until the data perfectly matches the pre-chosen blueprint (Z)</strong> we talked about in Step 5.
          </p>
          <div className="bg-white p-6 rounded-xl border border-gray-200 mt-4 shadow-sm overflow-x-auto">
            <div className="flex items-center justify-between min-w-[600px] gap-2">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-rose-600 mb-2">Input Data (X)</span>
                <svg viewBox="0 0 120 60" className="w-20">
                  <path d={generateBlendedPath(0)} fill="#fecdd3" stroke="#e11d48" strokeWidth="2" />
                </svg>
              </div>
              <ArrowRight className="text-gray-400" size={16} />
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-500 mb-2">Hidden Layer 1</span>
                <svg viewBox="0 0 120 60" className="w-20">
                  <path d={generateBlendedPath(0.33)} fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
                </svg>
              </div>
              <ArrowRight className="text-gray-400" size={16} />
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-500 mb-2">Hidden Layer 2</span>
                <svg viewBox="0 0 120 60" className="w-20">
                  <path d={generateBlendedPath(0.66)} fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
                </svg>
              </div>
              <ArrowRight className="text-gray-400" size={16} />
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-indigo-600 mb-2">Output (Z)</span>
                <svg viewBox="0 0 120 60" className="w-20">
                  <path d={generateBlendedPath(1)} fill="#c7d2fe" stroke="#4f46e5" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500 mt-6 bg-gray-50 p-3 rounded-lg">
              <strong>Generative Phase:</strong> When we want to generate <strong>new data</strong>, we just flip the arrows! We start with Z on the right, run the network backward layer-by-layer, and a new X (like an image or speech) pops out on the left.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "7. Enforcing the Blueprint",
      subtitle: "How do we force the builder to follow the rules?",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            If the network is doing the building, how does it know it's supposed to make a bell curve?
          </p>
          <p className="text-gray-700">
            We use our blueprint as a <strong>Scoring Formula</strong> (this is mathematically called the <em>Loss Function</em>). We know the exact math equation for a perfect bell curve. When the neural network spits out a shape, we plug that shape into our equation. The equation acts as an strict Inspector, grading the network's work!
          </p>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-4 relative overflow-hidden">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex flex-col items-center w-1/3">
                <span className="text-xs font-bold text-gray-600 mb-2">Network's Current Output</span>
                <svg viewBox="0 0 120 60" className="w-full bg-white rounded-lg border border-gray-200 p-2">
                  <path d={generateBlendedPath(trainingEpoch / 100)} fill="#e2e8f0" stroke="#64748b" strokeWidth="2" style={{ transition: 'd 0.5s ease-in-out' }} />
                </svg>
              </div>
              <div className="flex flex-col items-center w-1/3 z-10">
                <div className="bg-indigo-600 text-white rounded-lg p-3 flex flex-col items-center shadow-lg relative">
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-1 bg-indigo-600"></div>
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-1 bg-indigo-600"></div>
                  <span className="text-[10px] uppercase tracking-wider mb-1 font-semibold opacity-80">The Inspector</span>
                  <span className="text-sm font-bold text-center">Blueprint Formula<br/>(Loss Function)</span>
                </div>
              </div>
              <div className="flex flex-col items-center w-1/3">
                <span className="text-xs font-bold text-gray-600 mb-2">Score (Likelihood)</span>
                <div className={`w-full p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-colors duration-500 ${
                  trainingEpoch < 50 ? 'bg-red-50 border-red-200 text-red-600' : 
                  trainingEpoch < 99 ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 
                  'bg-green-50 border-green-200 text-green-600'
                }`}>
                  {trainingEpoch < 50 ? <AlertCircle size={20}/> : 
                   trainingEpoch < 99 ? <RotateCcw size={20}/> : 
                   <CheckCircle2 size={20}/>}
                  <span className="font-bold text-lg">{Math.round(trainingEpoch)}% Match</span>
                </div>
              </div>
            </div>
            <div className="relative h-8 w-full">
               <div className="absolute bottom-0 right-[16%] w-[68%] h-full border-b-2 border-l-2 border-r-2 border-dashed border-gray-400 rounded-b-xl"></div>
               <div className="absolute -bottom-2 left-[15%] text-gray-500 bg-slate-50 px-2 text-xs font-bold flex items-center">
                 <ArrowLeft size={14} className="mr-1"/> "Adjust your layers!" (Backpropagation)
               </div>
            </div>
            <div className="mt-8 flex justify-center">
              <button 
                onClick={runTrainingEpoch}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow transition-transform active:scale-95 flex items-center gap-2"
              >
                {trainingEpoch >= 100 ? "Reset Training" : "Run Training Loop"}
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "8. The Code Behind the Canvas",
      subtitle: "Mapping your PyTorch code to our analogies.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Let's look at the Python code you found! It directly matches our "Gotcha" concepts. PyTorch handles all the complex math for us.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-xl text-xs font-mono overflow-x-auto shadow-inner border border-gray-800">
              <div className="mb-3 text-indigo-400"># 1. Define the Blueprint (Z)</div>
              <div>loc = torch.<span className="text-blue-400">zeros</span>(2)</div>
              <div>cov = torch.<span className="text-blue-400">eye</span>(2)</div>
              <div className="mb-3">base_dist = <span className="text-yellow-200">MultivariateNormal</span>(loc, cov)</div>
              <div className="mb-3 text-rose-400"># 2. Generating Phase (Z → X)</div>
              <div className="mb-3">z_samples = base_dist.<span className="text-yellow-200">sample</span>((5,))</div>
              <div className="mb-1 text-green-400"># 3. The Inspector (Scoring)</div>
              <div>log_probs = base_dist.<span className="text-yellow-200">log_prob</span>(z_samples)</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded-r-lg">
                <strong className="text-indigo-800 text-sm block">1. The Blueprint</strong>
                <p className="text-xs text-indigo-900 mt-1">Setting <code>loc=zeros</code> and <code>cov=eye</code> is just the mathematical way of saying "I want a perfectly centered, standard bell curve as my target shape."</p>
              </div>
              <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-r-lg">
                <strong className="text-rose-800 text-sm block">2. Generating</strong>
                <p className="text-xs text-rose-900 mt-1"><code>.sample()</code> reaches into the perfect bell curve and grabs a random piece of clay. We feed this into the network backward to make new data.</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
                <strong className="text-green-800 text-sm block">3. The Inspector</strong>
                <p className="text-xs text-green-900 mt-1"><code>.log_prob()</code> is the Inspector grading the network! It returns a score of how well the network is matching the blueprint.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h4 className="font-bold text-gray-800 mb-2">Why "log_prob" instead of "prob"? (Underflow)</h4>
            <p className="text-sm text-gray-600 mb-4">
              To calculate the total score of thousands of data points, we have to combine their individual probabilities. Look at what happens to a computer when we use standard math vs. log math:
            </p>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex flex-col items-center justify-center text-center">
                 <span className="text-xs font-bold text-red-600 mb-2">Standard Probability (Multiplying)</span>
                 <div className="font-mono text-sm text-red-800 break-all leading-tight">
                   0.1 × 0.1 × 0.1 × 0.1...
                   <div className="my-2 border-t border-red-200 w-full"></div>
                   = 0.00000000000...<span className="font-bold text-red-500">1</span>
                 </div>
                 <span className="text-xs text-red-700 mt-3 bg-red-100 px-2 py-1 rounded font-semibold">Computer rounds to 0 (Crashes!)</span>
               </div>
               <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 flex flex-col items-center justify-center text-center">
                 <span className="text-xs font-bold text-emerald-600 mb-2">Logarithmic Math (Adding)</span>
                 <div className="font-mono text-sm text-emerald-800 leading-tight">
                   log(0.1) + log(0.1) + log(0.1)...<br/>
                   (-1) + (-1) + (-1)...
                   <div className="my-2 border-t border-emerald-200 w-full"></div>
                   = -3.0
                 </div>
                 <span className="text-xs text-emerald-700 mt-3 bg-emerald-100 px-2 py-1 rounded font-semibold">Stable numbers! (PyTorch is happy)</span>
               </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "9. Where is the Neural Network?",
      subtitle: "Putting your snippet into the big picture.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            You noticed a massive missing piece: <em>"I don't see any data going in the neural network or anything, I just see code building the Gaussian!"</em>
          </p>
          <p className="text-gray-700">
            You are absolutely right. The code you provided was just the setup for the <strong>Inspector</strong>. To actually train a model, we have to wrap your code together with a neural network and a dataset. Here is what the "missing" code looks like conceptually:
          </p>
          <div className="bg-[#1e1e1e] text-[#d4d4d4] p-5 rounded-xl text-sm font-mono overflow-x-auto shadow-inner border border-gray-800">
            <div className="mb-4">
              <span className="text-gray-400 block italic mb-1"># --- YOUR CODE: THE BLUEPRINT ---</span>
              <div>base_dist = <span className="text-yellow-200">MultivariateNormal</span>(zeros, eye)</div>
            </div>
            <div className="mb-4">
              <span className="text-gray-400 block italic mb-1"># --- THE MISSING PART: THE BUILDER ---</span>
              <div>flow_network = <span className="text-yellow-200">NormalizingFlowNeuralNet</span>()</div>
              <div>optimizer = torch.optim.<span className="text-yellow-200">Adam</span>(flow_network.parameters())</div>
            </div>
            <div>
              <span className="text-gray-400 block italic mb-1"># --- THE MISSING PART: THE TRAINING LOOP ---</span>
              <div><span className="text-purple-400">for</span> real_data_X <span className="text-purple-400">in</span> dataset:</div>
              <div className="ml-6 mt-2">
                <span className="text-gray-500 italic"># 1. The builder irons out the messy data</span>
                <div>z_output = flow_network(real_data_X)</div>
              </div>
              <div className="ml-6 mt-3">
                <span className="text-gray-500 italic"># 2. The Inspector grades the output using YOUR blueprint</span>
                <div><span className="text-gray-400"># Notice we use your log_prob here!</span></div>
                <div>loss = -base_dist.<span className="text-yellow-200">log_prob</span>(z_output)</div>
              </div>
              <div className="ml-6 mt-3">
                <span className="text-gray-500 italic"># 3. Send the error backward to adjust the layers</span>
                <div>loss.<span className="text-yellow-200">backward</span>()</div>
                <div>optimizer.<span className="text-yellow-200">step</span>()</div>
              </div>
            </div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-4 text-sm text-indigo-900">
            <strong>The takeaway:</strong> The snippet you found was basically importing the grading rubric. The actual Neural Network (the Normalizing Flow) is a separate chunk of code that continuously submits its homework (<code>z_output</code>) to that grading rubric (<code>base_dist.log_prob</code>) until it gets a perfect score!
          </div>
        </div>
      )
    },
    {
      title: "10. Change of Variables (1D)",
      subtitle: "Stretching the rubber band changes the ink density.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            The text introduces the <strong>Change of Variables Theorem</strong>. This is the exact math formula the neural network uses to stretch and squish the data.
          </p>
          <p className="text-gray-700">
            Remember Rule 1 from Step 2? <strong>You only have 1 block of clay (probability).</strong><br/>
            Imagine taking a thick rubber band and painting a square of wet ink on it. If you grab the rubber band and <em>stretch</em> it, the ink spreads out over a wider area. Because the total amount of ink hasn't changed, the ink's thickness (its density) goes <strong>down</strong>. If you let it <em>squish</em> back together, the ink pools up and the density goes <strong>up</strong>.
          </p>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between text-sm font-bold text-gray-700 mb-4 px-4">
               <span className="flex items-center gap-1"><Minimize2 size={16} className="text-rose-500"/> Squish (Density UP)</span>
               <span className="flex items-center gap-1">Stretch (Density DOWN) <Maximize2 size={16} className="text-indigo-500"/></span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="2.0" 
              step="0.1"
              value={stretchFactor} 
              onChange={(e) => setStretchFactor(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-6"
            />
            <div className="relative h-48 border-b-2 border-gray-300 overflow-visible flex items-end justify-center">
              <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible absolute bottom-0">
                <path 
                  d={generateGaussianPath(0, stretchFactor, 100)} 
                  fill="#c7d2fe" 
                  stroke="#4f46e5" 
                  strokeWidth="2"
                  style={{ transition: 'd 0.1s ease-out' }}
                />
                <rect 
                  x={200 - (20 * stretchFactor)} 
                  y={200 - (80 / stretchFactor)} 
                  width={40 * stretchFactor} 
                  height={80 / stretchFactor} 
                  fill="#4f46e5" 
                  fillOpacity="0.4"
                  stroke="#312e81"
                  strokeWidth="1"
                  style={{ transition: 'all 0.1s ease-out' }}
                />
                <text x={200} y={200 - (80 / stretchFactor) - 10} textAnchor="middle" className="text-[10px] font-bold fill-indigo-900">
                  Total Ink (Area) Stays Same
                </text>
              </svg>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-6">
               <div className="bg-gray-50 p-3 rounded border text-center">
                  <span className="block text-xs text-gray-500 uppercase">New Density (Height)</span>
                  <strong className="text-lg text-indigo-700">p_x(x)</strong>
               </div>
               <div className="flex items-center justify-center text-xl font-bold text-gray-400">=</div>
               <div className="bg-gray-50 p-3 rounded border text-center">
                  <span className="block text-xs text-gray-500 uppercase">Base Density × Stretch/Squish Ratio</span>
                  <strong className="text-lg text-indigo-700">p_z(z) × |dz/dx|</strong>
               </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              The scary math term <strong>|dz/dx|</strong> is just the exact ratio of how much you stretched or squished the rubber band. We use absolute value ( <strong>| |</strong> ) because even if you stretch the rubber band backward (a negative slope), you can't have negative density!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "11. High Dimensions & The Jacobian",
      subtitle: "From Rubber Bands to Rubber Sheets.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Real AI models don't stretch 1D lines; they stretch highly complex, multi-dimensional spaces (like 1024-pixel images). Instead of a rubber band, imagine a 2D rubber sheet.
          </p>
          <p className="text-gray-700">
            When you pull a rubber sheet horizontally, it often gets thinner vertically. Every dimension affects every other dimension! A simple scalar derivative (<code>dz/dx</code>) can't track this.
          </p>
          <div className="bg-white p-6 rounded-xl border border-gray-200 mt-4 shadow-sm flex flex-col items-center">
             
             <div className="flex gap-8 items-center w-full justify-center">
               <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-indigo-600 mb-2">1D Stretch (Scalar)</span>
                  <div className="bg-indigo-50 p-4 rounded border border-indigo-200">
                    <code className="text-indigo-800 font-bold">dz/dx = 2.0</code>
                    <p className="text-[10px] text-indigo-600 mt-1 text-center max-w-[100px]">Just one number tracking one direction.</p>
                  </div>
               </div>

               <ArrowRight className="text-gray-400" />

               <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-rose-600 mb-2">2D Stretch (Jacobian Matrix)</span>
                  <div className="bg-rose-50 p-4 rounded border border-rose-200 flex flex-col items-center">
                    <table className="border-l-2 border-r-2 border-rose-800 px-2 font-mono text-rose-800 font-bold text-center">
                      <tbody>
                        <tr><td className="p-1">2.0</td><td className="p-1">-0.5</td></tr>
                        <tr><td className="p-1">0.1</td><td className="p-1">1.5</td></tr>
                      </tbody>
                    </table>
                    <p className="text-[10px] text-rose-600 mt-2 text-center max-w-[140px]">A grid tracking how every direction affects every other direction.</p>
                  </div>
               </div>
             </div>

             <div className="mt-6 bg-slate-50 border border-slate-200 p-4 rounded-lg text-sm text-slate-700 w-full">
               The <strong>Jacobian Matrix</strong> is simply a dashboard of numbers that tracks how the Neural Network is stretching, squishing, and warping the space across <em>all</em> dimensions at the exact same time.
             </div>
          </div>
        </div>
      )
    },
    {
      title: "12. The Determinant",
      subtitle: "Measuring the total change in Volume.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            If the Jacobian Matrix is a massive dashboard of stretching numbers, how do we plug that into our density formula? We need a single number that tells us the <strong>Total Volume Change</strong>.
          </p>
          <p className="text-gray-700">
            That single number is the <strong>Determinant</strong> of the Jacobian. 
            Just like 1D stretch changes the ink density, expanding the 2D Area (or 3D Volume) thins out the probability density.
          </p>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600">Stretch Width (X)</label>
                <input type="range" min="0.5" max="2.5" step="0.1" value={scaleX} onChange={(e)=>setScaleX(parseFloat(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Stretch Height (Y)</label>
                <input type="range" min="0.5" max="2.5" step="0.1" value={scaleY} onChange={(e)=>setScaleY(parseFloat(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"/>
              </div>
            </div>

            <div className="flex justify-center items-center h-48 bg-slate-50 border border-slate-200 rounded-lg relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                
                {/* The "Volume" Box */}
                <div 
                  className="bg-indigo-500 opacity-60 border-2 border-indigo-900 absolute flex items-center justify-center text-white font-bold text-xs"
                  style={{
                    width: `${40 * scaleX}px`, 
                    height: `${40 * scaleY}px`,
                    transition: 'all 0.1s linear'
                  }}
                >
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center bg-gray-100 p-3 rounded-lg border border-gray-300">
               <div className="text-sm font-bold text-gray-700">Determinant = Area Multiplier</div>
               <div className="text-2xl font-black text-indigo-600">{determinant}x</div>
            </div>
            
            <p className="text-[11px] text-gray-500 mt-2 text-center">
              Formula: <code>p_x(x) = p_z(z) × |det(Jacobian)|</code>. If the Determinant is 2.0, the space doubled in size, meaning the probability density is cut in half to conserve the "ink"!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "13. The Strict Rule of Bijection",
      subtitle: "No folding, no tearing, no losing data.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            For this math to work, the text says the Neural Network must be a <strong>Bijection</strong>. This means the network must follow two strict rules:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
             {/* Rule 1 */}
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                <span className="font-bold text-indigo-700 mb-2 flex items-center gap-2"><ArrowRightLeft size={18}/> 1. One-to-One</span>
                <p className="text-xs text-gray-600 text-center mb-4">Every point in Z maps to exactly one point in X. You cannot fold the rubber sheet over itself!</p>
                <div className="flex gap-4 items-center">
                   <div className="flex flex-col gap-2">
                     <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                     <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                   </div>
                   <div className="flex flex-col gap-2 relative">
                     <ArrowRight size={14} className="text-gray-400"/>
                     <ArrowRight size={14} className="text-gray-400"/>
                     {/* Bad arrow crossing */}
                     <div className="absolute top-0 right-0 w-full h-full border-t-2 border-red-500 origin-top-left rotate-45 transform opacity-0"></div>
                   </div>
                   <div className="flex flex-col gap-2">
                     <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                     <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                   </div>
                </div>
                <div className="mt-3 text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 flex items-center gap-1">
                  <XCircle size={12}/> If 2 points mapped to 1, probability is lost!
                </div>
             </div>

             {/* Rule 2 */}
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                <span className="font-bold text-teal-700 mb-2 flex items-center gap-2"><Box size={18}/> 2. Identical Dimensions</span>
                <p className="text-xs text-gray-600 text-center mb-4">You cannot turn a 3D object into a 2D shadow. Inputs and Outputs must match perfectly.</p>
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-gray-500">
                   <div className="bg-teal-50 text-teal-700 p-2 rounded">3D (Z)</div>
                   <ArrowRight size={16}/>
                   <div className="bg-teal-50 text-teal-700 p-2 rounded">3D (X)</div>
                </div>
                <div className="mt-3 text-[10px] bg-teal-50 text-teal-800 px-2 py-1 rounded border border-teal-100 text-center">
                  Mathematically required so the Jacobian is a <strong>Square Matrix</strong>. You can only calculate Determinants for squares!
                </div>
             </div>
          </div>
        </div>
      )
    },
    {
      title: formulaView === 'textbook' ? "14. The Math Trick: Forward vs Inverse" : "14. Natively Forward in PyTorch",
      subtitle: formulaView === 'textbook' ? "Flipping the Jacobian and preparing for the Log." : "Why we don't need the textbook flip trick.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Before we look at the final formula, we must solve the "Plus vs Minus" mystery. Toggle below to see the two different ways to calculate the stretch!
          </p>
          
          {renderFormulaToggle()}

          {formulaView === 'textbook' ? (
            <div className="animate-fade-in">
              {/* Breakdown of the Inverse */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-indigo-800 border-b border-indigo-100 pb-2 mb-3">Trick 1: The Forward Flip</h4>
                <p className="text-sm text-gray-600 mb-3">
                  The textbook assumes we are going backward from X to Z. Calculating this inverse math is hard. So, mathematicians take the easy forward stretch and stick a <strong>-1 exponent</strong> on it to flip it upside down.
                </p>
                <div className="flex items-center justify-center gap-4 bg-slate-50 p-4 rounded-lg font-mono text-sm">
                  <div className="text-center">
                    <span className="block text-gray-500 text-[10px] uppercase mb-1">Inverse (Hard)</span>
                    <span className="text-rose-600 font-bold">|det(∂z/∂x)|</span>
                  </div>
                  <div className="text-gray-400 font-bold text-lg">=</div>
                  <div className="text-center">
                    <span className="block text-gray-500 text-[10px] uppercase mb-1">Forward (Easy)</span>
                    <span className="text-indigo-600 font-bold">|det(∂x/∂z)|<sup className="text-gray-500 ml-1">-1</sup></span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-2 font-mono">Example: "Divide by 2" is the exact same thing as "Multiply by 2<sup className="ml-0.5">-1</sup>"</p>
              </div>

              {/* Slapping the Log */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-4">
                <h4 className="font-bold text-teal-800 border-b border-teal-100 pb-2 mb-3">Trick 2: The Logarithm Magic</h4>
                <p className="text-sm text-gray-600 mb-3">
                  To prevent computer memory crashes (underflow), we slap a <code>log()</code> onto the formula. Logarithms automatically drop that <strong>-1</strong> exponent down to the front, turning addition into a minus sign!
                </p>
                <div className="bg-teal-50 p-4 rounded-lg flex flex-col gap-2">
                  <div className="font-mono text-sm text-gray-500 flex justify-between items-center">
                    <span>Original:</span>
                    <span>p_x(x) <strong className="text-teal-500">=</strong> p_z(z) <strong className="text-teal-500">×</strong> |det(J)|<strong className="text-teal-500"><sup>-1</sup></strong></span>
                  </div>
                  <ArrowRight className="text-teal-300 mx-auto rotate-90" size={16}/>
                  <div className="font-mono text-sm font-bold text-teal-800 flex justify-between items-center">
                    <span>With Log:</span>
                    <span>log p_x(x) <strong className="text-teal-500">=</strong> log p_z(z) <strong className="text-rose-500">-</strong> log |det(J)|</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-teal-800 border-b border-teal-100 pb-2 mb-3">No Flipping Required!</h4>
                <p className="text-sm text-gray-600 mb-3">
                  During training, PyTorch naturally feeds data from <strong>X to Z</strong>. This means it is natively calculating the stretch in the correct training direction! 
                </p>
                <div className="flex items-center justify-center gap-4 bg-slate-50 p-4 rounded-lg font-mono text-sm">
                  <div className="text-center">
                    <span className="block text-gray-500 text-[10px] uppercase mb-1">PyTorch Stretch (Training)</span>
                    <span className="text-teal-600 font-bold">|det(∂z/∂x)|</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-2">Because we don't have to flip the equation upside down, there is no -1 exponent!</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-4">
                <h4 className="font-bold text-indigo-800 border-b border-indigo-100 pb-2 mb-3">The Logarithm Addition</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Just like before, we apply the <code>log()</code> to prevent underflow. Because there is no -1 exponent to drop down, the multiplication simply turns into standard addition.
                </p>
                <div className="bg-teal-50 p-4 rounded-lg flex flex-col gap-2">
                  <div className="font-mono text-sm text-gray-500 flex justify-between items-center">
                    <span>Original:</span>
                    <span>p_x(x) <strong className="text-teal-500">=</strong> p_z(z) <strong className="text-teal-500">×</strong> |det(J)|</span>
                  </div>
                  <ArrowRight className="text-teal-300 mx-auto rotate-90" size={16}/>
                  <div className="font-mono text-sm font-bold text-teal-800 flex justify-between items-center">
                    <span>With Log:</span>
                    <span>log p_x(x) <strong className="text-teal-500">=</strong> log p_z(z) <strong className="text-teal-500">+</strong> log |det(J)|</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "15. The Final Boss Formula",
      subtitle: "The Log-Likelihood Objective Function.",
      content: (
        <div className="space-y-4 animate-fade-in">
          <p className="text-gray-700">
            Let's put it all together. Toggle below to see why the textbook uses a minus, while your actual PyTorch code will use a plus!
          </p>
          
          {renderFormulaToggle()}

          <div className="bg-[#0f172a] p-6 rounded-xl border border-gray-800 shadow-xl relative mt-4 transition-colors">
            <div className="text-center font-mono text-lg md:text-xl font-bold tracking-wider mb-8">
              <span className="text-white">log p<sub>x</sub>(x)</span> 
              <span className="text-gray-400 mx-3">=</span> 
              <span className="text-indigo-400">log p<sub>z</sub>(z)</span> 
              
              {formulaView === 'textbook' ? (
                <span className="text-rose-400 mx-3 text-2xl font-black transition-all">-</span> 
              ) : (
                <span className="text-teal-400 mx-3 text-2xl font-black transition-all">+</span> 
              )}
              
              <span className={formulaView === 'textbook' ? "text-rose-400" : "text-teal-400"}>log |det(J)|</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="flex flex-col items-center text-center">
                 <span className="text-white font-bold text-sm mb-1 bg-gray-800 px-2 py-1 rounded w-full">log p<sub>x</sub>(x)</span>
                 <span className="text-xs text-gray-400 mt-2"><strong>The Final Score.</strong> The exact probability density of the real data we want to maximize.</span>
               </div>

               <div className="flex flex-col items-center text-center">
                 <span className="text-indigo-400 font-bold text-sm mb-1 bg-indigo-900/30 px-2 py-1 rounded w-full">log p<sub>z</sub>(z)</span>
                 <span className="text-xs text-indigo-300 mt-2"><strong>The Blueprint Match.</strong> Does the data look like the perfect bell curve we asked for?</span>
               </div>

               <div className="flex flex-col items-center text-center">
                 <span className={`${formulaView === 'textbook' ? 'text-rose-400 bg-rose-900/30' : 'text-teal-400 bg-teal-900/30'} font-bold text-sm mb-1 px-2 py-1 rounded w-full transition-colors`}>
                   {formulaView === 'textbook' ? '-' : '+'} log |det(J)|
                 </span>
                 <span className={`text-xs ${formulaView === 'textbook' ? 'text-rose-300' : 'text-teal-300'} mt-2 transition-colors`}>
                   {formulaView === 'textbook' ? <strong>The Volume Penalty.</strong> : <strong>The Accumulated Stretch.</strong>}
                   {formulaView === 'textbook' 
                     ? " (Subtracted because we measured the reverse direction!)" 
                     : " (Added because PyTorch natively calculates the training direction!)"}
                 </span>
               </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "16. Calculating Loss & Backprop",
      subtitle: "Using the formula ONCE at the very end.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Now that the forward pass is complete, we hand our two final values (<code>z = [1.2, -0.1]</code> and <code>Total_LogDet = 0.8</code>) over to the Loss Function. 
          </p>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
             
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">
                   <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 border border-indigo-200">1</div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 mb-1">Evaluate Blueprint Score: <code className="text-indigo-600 font-normal">log p_z(z)</code></p>
                      <p className="text-xs text-slate-600">We plug <code>[1.2, -0.1]</code> into the Gaussian equation to score how close it landed to the center [0,0]. Let's say it scores <strong className="text-rose-500">-2.1</strong>.</p>
                   </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">
                   <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-600 border border-teal-200">2</div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 mb-1">Apply Formula: <code className="text-teal-600 font-normal">Score = Blueprint + Total_LogDet</code></p>
                      <p className="text-xs text-slate-600">We add our accumulated stretch. Final Score = <code>-2.1 + 0.8</code> = <strong className="text-rose-500">-1.3</strong>.</p>
                   </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">
                   <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center font-bold text-rose-600 border border-rose-200">3</div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 mb-1">Define Loss & Backpropagate: <code className="text-rose-600 font-normal">loss.backward()</code></p>
                      <p className="text-xs text-slate-600">Optimizers minimize to 0, so we multiply the score by -1 to get Negative Log-Likelihood (<strong>Loss = 1.3</strong>). PyTorch sends this error backward to update weights in Layers 2 and 1.</p>
                   </div>
                </div>
             </div>
             
             <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded p-3 text-xs text-indigo-900 text-center shadow-inner">
                <strong>No Reversing During Training!</strong> We push X forward, calculate Jacobians, calculate Loss, and update weights. Reversing the network (Z → X) is <em>only</em> done after training is totally finished to generate new data!
             </div>
          </div>
        </div>
      )
    },
    {
      title: "17. The Two-Way Bridge (Summary)",
      subtitle: "How architectural choices dictate the + or - loss function.",
      content: (
        <div className="space-y-3 animate-fade-in">
          <p className="text-gray-700 text-sm">
            The neural network is a 1-to-1 bridge between the Data World (X) and the Latent Blueprint (Z). Training <em>always</em> requires pushing real data to Z to be scored. The <code>+</code> or <code>-</code> simply depends on how the engineers built the bridge!
          </p>

          <div className="grid grid-cols-1 gap-4 mt-2">
             {/* Choice A */}
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                   <span className="font-bold text-teal-700 flex items-center gap-2"><ArrowRight size={18}/> Choice A: Native Forward is X → Z</span>
                   <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold">e.g., MAF, RealNVP, Glow</span>
                </div>
                <p className="text-[11px] text-gray-600 mb-3">The bridge's "easy lane" goes from X to Z. During training, PyTorch just drives forward happily.</p>
                
                <div className="flex items-center justify-between bg-teal-50 p-3 rounded-lg border border-teal-100 mb-3">
                   <div className="text-center w-1/4"><span className="font-bold text-teal-800 text-xs block">Data (X)</span></div>
                   <div className="flex-1 relative flex flex-col items-center">
                     <span className="text-[9px] text-teal-600 uppercase font-bold tracking-widest mb-1">Native Math Direction</span>
                     <div className="w-full flex items-center justify-center">
                       <div className="h-1 w-full bg-teal-200 rounded"></div>
                       <ArrowRight className="text-teal-500 -ml-2" size={16}/>
                     </div>
                     <span className="text-[10px] text-teal-700 font-bold mt-1 bg-white px-2 py-0.5 rounded shadow-sm relative -top-3 border border-teal-100">
                       Driving Forward (Training)
                     </span>
                   </div>
                   <div className="text-center w-1/4"><span className="font-bold text-teal-800 text-xs block">Blueprint (Z)</span></div>
                </div>

                <div className="text-center">
                  <code className="bg-teal-100 text-teal-800 px-3 py-1.5 rounded text-xs font-bold border border-teal-200 shadow-inner">Loss = log p_z(z) <strong className="text-teal-600 text-sm mx-1">+</strong> log |det(J)|</code>
                  <p className="text-[10px] text-teal-600 mt-2 font-medium">Driving natively forward? PyTorch just <strong className="uppercase">Adds</strong> the stretch!</p>
                </div>
             </div>

             {/* Choice B */}
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                   <span className="font-bold text-rose-700 flex items-center gap-2"><ArrowLeft size={18}/> Choice B: Native Forward is Z → X</span>
                   <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold">e.g., Inverse Autoregressive Flow (IAF)</span>
                </div>
                <p className="text-[11px] text-gray-600 mb-3">The bridge's "easy lane" goes from Z to X for blazingly fast generation. To train, we force real data backward against traffic!</p>
                
                <div className="flex items-center justify-between bg-rose-50 p-3 rounded-lg border border-rose-100 mb-3">
                   <div className="text-center w-1/4"><span className="font-bold text-rose-800 text-xs block">Data (X)</span></div>
                   <div className="flex-1 relative flex flex-col items-center">
                     <span className="text-[9px] text-rose-600 uppercase font-bold tracking-widest mb-1">Native Math Direction</span>
                     <div className="w-full flex items-center justify-center">
                       <ArrowLeft className="text-rose-500 -mr-2 z-10" size={16}/>
                       <div className="h-1 w-full bg-rose-200 rounded"></div>
                     </div>
                     <span className="text-[10px] text-rose-700 font-bold mt-1 bg-white px-2 py-0.5 rounded shadow-sm relative -top-3 border border-rose-100">
                       Driving in Reverse (Training)
                     </span>
                   </div>
                   <div className="text-center w-1/4"><span className="font-bold text-rose-800 text-xs block">Blueprint (Z)</span></div>
                </div>

                <div className="text-center">
                  <code className="bg-rose-100 text-rose-800 px-3 py-1.5 rounded text-xs font-bold border border-rose-200 shadow-inner">Loss = log p_z(z) <strong className="text-rose-600 text-sm mx-1">-</strong> log |det(J)|</code>
                  <p className="text-[10px] text-rose-600 mt-2 font-medium">Driving backward against the native math? <strong className="uppercase">Subtract</strong> to flip it!</p>
                </div>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "18. The Triangular Cheat Code",
      subtitle: "How computers calculate Jacobians without exploding.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            You might have noticed a massive problem: If an image has 10,000 pixels, the Jacobian Matrix is a grid of 10,000 × 10,000. Calculating that determinant takes O(N³) time. It would take a supercomputer weeks to train a single image!
          </p>
          <p className="text-gray-700">
            <strong>The Solution:</strong> AI Engineers specially design the neural network layers so their Jacobian matrices are strictly <em>Triangular</em> (half of the matrix is forced to be zeros).
          </p>

          <div className="bg-white p-6 rounded-xl border border-gray-200 mt-4 shadow-sm flex flex-col items-center">
             
             <div className="flex gap-8 items-center w-full justify-center">
               <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-rose-600 mb-2">Standard Matrix: O(N³)</span>
                  <div className="bg-rose-50 p-4 rounded border border-rose-200 flex flex-col items-center">
                    <table className="border-l-2 border-r-2 border-rose-800 px-2 font-mono text-rose-800 font-bold text-center">
                      <tbody>
                        <tr><td className="p-1">2.0</td><td className="p-1">0.5</td><td className="p-1">0.1</td></tr>
                        <tr><td className="p-1">0.3</td><td className="p-1">1.5</td><td className="p-1">0.2</td></tr>
                        <tr><td className="p-1">0.7</td><td className="p-1">0.4</td><td className="p-1">0.8</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-rose-600 mt-2 text-center max-w-[150px]">Requires insanely complex cross-multiplication.</p>
               </div>

               <ArrowRight className="text-gray-400" />

               <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-indigo-600 mb-2">Triangular Matrix: O(N)</span>
                  <div className="bg-indigo-50 p-4 rounded border border-indigo-200 flex flex-col items-center relative">
                    {/* Highlight diagonal */}
                    <div className="absolute w-[80%] h-8 bg-indigo-300/30 -rotate-45 top-10 pointer-events-none rounded"></div>
                    <table className="border-l-2 border-r-2 border-indigo-800 px-2 font-mono text-indigo-800 font-bold text-center">
                      <tbody>
                        <tr><td className="p-1 text-indigo-600">2.0</td><td className="p-1">0.5</td><td className="p-1">0.1</td></tr>
                        <tr><td className="p-1 text-gray-400">0</td><td className="p-1 text-indigo-600">1.5</td><td className="p-1">0.2</td></tr>
                        <tr><td className="p-1 text-gray-400">0</td><td className="p-1 text-gray-400">0</td><td className="p-1 text-indigo-600">0.8</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-indigo-600 mt-2 text-center max-w-[150px]">The determinant is simply the diagonal multiplied together!</p>
               </div>
             </div>

             <div className="mt-6 bg-slate-50 border border-slate-200 p-4 rounded-lg text-sm text-slate-700 w-full text-center">
               Because we use logarithms, multiplying the diagonal turns into <strong>adding the diagonal elements together</strong>. PyTorch isn't doing complex matrix algebra during training; it's literally just summing up a single diagonal line of numbers!
             </div>
          </div>
        </div>
      )
    },
    {
      title: "19. Autoregressive Dependency (The Chain Rule)",
      subtitle: "Predicting the present by strictly looking at the past.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We know we need a <strong>Triangular Jacobian</strong> to make the math fast. But how do we actually force a neural network to create one? We use <strong>Autoregressive Models</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
             
             {/* The Node Graph Visual */}
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
               <h4 className="font-bold text-indigo-800 mb-4 border-b border-indigo-100 pb-2 w-full text-center">Sequential Dependency Structure</h4>
               <div className="relative w-48 h-80 flex flex-col items-center justify-between">
                 {/* Nodes */}
                 <div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-indigo-400 flex items-center justify-center font-bold text-indigo-800 z-10">x₁</div>
                 <div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-indigo-400 flex items-center justify-center font-bold text-indigo-800 z-10 ml-12">x₂</div>
                 <div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-indigo-400 flex items-center justify-center font-bold text-indigo-800 z-10">x₃</div>
                 <div className="text-gray-400 font-bold z-10">...</div>
                 <div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-indigo-400 flex items-center justify-center font-bold text-indigo-800 z-10">xₙ</div>
                 
                 {/* SVG Lines for connections */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 0}}>
                    <defs>
                      <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="#9ca3af" />
                      </marker>
                    </defs>
                    {/* From x1 */}
                    <line x1="96" y1="45" x2="114" y2="72" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <path d="M 86 45 Q 60 110 86 172" fill="none" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <path d="M 106 45 Q 150 160 106 270" fill="none" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    
                    {/* From x2 */}
                    <line x1="108" y1="120" x2="96" y2="148" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <line x1="120" y1="124" x2="108" y2="270" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />

                    {/* From x3 */}
                    <line x1="96" y1="196" x2="96" y2="216" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    
                    {/* From ... */}
                    <line x1="96" y1="240" x2="108" y2="270" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
                 </svg>
               </div>
             </div>

             <div className="flex flex-col gap-4">
                {/* The Product Rule Formula */}
                <div className="bg-[#0f172a] p-5 rounded-xl border border-gray-800 shadow-md flex flex-col items-center">
                   <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-3">The Factorization Formula</span>
                   <div className="flex items-center text-white font-mono text-lg md:text-2xl font-bold">
                     <span>p(x) = </span>
                     <div className="flex flex-col items-center mx-2 relative top-1">
                       <span className="text-[10px] text-gray-400 -mb-1">n</span>
                       <span className="text-4xl leading-none text-indigo-400 font-light">∏</span>
                       <span className="text-[10px] text-gray-400 -mt-1">i=1</span>
                     </div>
                     <span>p(x<sub>i</sub> | x<sub>1</sub>, ..., x<sub>i-1</sub>)</span>
                   </div>
                   <p className="text-[11px] text-gray-400 mt-3 text-center">The joint probability is strictly factored so each variable is conditioned ONLY on the variables before it.</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                   <h4 className="font-bold text-teal-800 mb-2 border-b border-teal-100 pb-1">Breaking down the math:</h4>
                   <ul className="text-sm space-y-2 text-gray-600">
                     <li><strong>x₁</strong> is completely unconditional (looks at nothing).</li>
                     <li><strong>x₂</strong> looks <em>only</em> at x₁.</li>
                     <li><strong>x₃</strong> looks <em>only</em> at x₁ and x₂.</li>
                     <li>This forces a strict, one-way flow of information through the data space.</li>
                   </ul>
                </div>
             </div>

          </div>
        </div>
      )
    },
    {
      title: "20. The Autoregressive Transformation & Jacobian",
      subtitle: "Why the sequential rule creates the Triangular cheat code.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            To use this structure in a Normalizing Flow, we map our simple blueprint (Z) to our complex data (X) using this specific autoregressive function:
          </p>

          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
                 <code className="text-indigo-800 text-lg font-bold font-mono bg-indigo-50 px-3 py-1 rounded">x<sub>i</sub> = f<sub>i</sub>(z<sub>i</sub> ; θ(x<sub>&lt;i</sub>))</code>
                 <p className="text-xs text-gray-600 mt-3 text-left">
                   The output pixel <code>x_i</code> depends directly on its own latent noise <code>z_i</code>, but the <em>parameters/weights</em> doing the warping (θ) are strictly wired to only look at previously generated pixels <code>x_&lt;i</code>.
                 </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm flex-1">
                 <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">The Math Translation:</h4>
                 <ul className="text-xs space-y-3 font-mono text-slate-700">
                   <li><span className="bg-indigo-100 text-indigo-800 px-1 rounded">x₁</span> = f₁( <span className="text-teal-600">z₁</span> )</li>
                   <li><span className="bg-indigo-100 text-indigo-800 px-1 rounded">x₂</span> = f₂( <span className="text-teal-600">z₂</span> ; θ(<span className="text-rose-500">x₁</span>) )</li>
                   <li><span className="bg-indigo-100 text-indigo-800 px-1 rounded">x₃</span> = f₃( <span className="text-teal-600">z₃</span> ; θ(<span className="text-rose-500">x₁, x₂</span>) )</li>
                 </ul>
              </div>
            </div>

            <ArrowRight className="text-gray-400 self-center hidden md:block" />

            <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
               <h4 className="font-bold text-teal-800 mb-2 border-b border-teal-100 pb-1 w-full text-center">Resulting Jacobian</h4>
               <p className="text-[11px] text-gray-600 mb-4 text-center">Because <code>x₁</code> NEVER looks at <code>z₂</code> or <code>z₃</code>, the derivative (stretch) for those relationships is mathematically forced to be exactly 0!</p>
               
               <table className="border-l-2 border-r-2 border-teal-800 px-3 py-2 font-mono text-sm text-center bg-teal-50 rounded shadow-inner">
                  <tbody>
                    <tr>
                      <td className="p-3 text-teal-700 font-bold border-b border-r border-teal-200">∂x₁/∂z₁</td>
                      <td className="p-3 text-gray-300 font-bold border-b border-r border-teal-200">0</td>
                      <td className="p-3 text-gray-300 font-bold border-b border-teal-200">0</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-teal-700 font-bold border-b border-r border-teal-200">∂x₂/∂z₁</td>
                      <td className="p-3 text-teal-700 font-bold border-b border-r border-teal-200">∂x₂/∂z₂</td>
                      <td className="p-3 text-gray-300 font-bold border-b border-teal-200">0</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-teal-700 font-bold border-r border-teal-200">∂x₃/∂z₁</td>
                      <td className="p-3 text-teal-700 font-bold border-r border-teal-200">∂x₃/∂z₂</td>
                      <td className="p-3 text-teal-700 font-bold">∂x₃/∂z₃</td>
                    </tr>
                  </tbody>
               </table>

               <p className="text-xs text-center text-teal-700 mt-4 font-bold bg-white py-1.5 px-3 rounded border border-teal-200 shadow-sm">
                  Determinant = Product of the Diagonal!
               </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "21. Weights vs. Jacobian (The Missing Link)",
      subtitle: "Clearing up the biggest confusion in Autoregressive Flows.",
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-red-900 text-sm shadow-sm">
            <strong>Crucial Distinction:</strong> The Weight Matrix (W) and the Jacobian Matrix (J) are <strong>NOT</strong> the same thing. They are two completely different matrices that both exist in the model!
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-stretch mt-4">
             {/* Box 1: The Weight Matrix */}
             <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
               <h4 className="font-bold text-rose-800 mb-2 border-b border-rose-100 pb-1 w-full text-center">1. The Neural Network (Weights)</h4>
               <p className="text-[11px] text-gray-600 mb-3 text-center">The network calculates the scaling parameters (μ, σ). We apply a Binary Mask to the <strong>Weight Matrix (W)</strong> to physically cut the "future" wires in the code.</p>
               
               <table className="border-l-2 border-r-2 border-rose-400 px-1 bg-rose-50 rounded shadow-inner text-xs font-mono text-center mb-2">
                  <tbody>
                    <tr><td className="p-2 border border-rose-200 font-bold text-rose-700">W₁₁</td><td className="p-2 border border-rose-200 text-gray-400">0 (cut)</td><td className="p-2 border border-rose-200 text-gray-400">0 (cut)</td></tr>
                    <tr><td className="p-2 border border-rose-200 font-bold text-rose-700">W₂₁</td><td className="p-2 border border-rose-200 font-bold text-rose-700">W₂₂</td><td className="p-2 border border-rose-200 text-gray-400">0 (cut)</td></tr>
                    <tr><td className="p-2 border border-rose-200 font-bold text-rose-700">W₃₁</td><td className="p-2 border border-rose-200 font-bold text-rose-700">W₃₂</td><td className="p-2 border border-rose-200 font-bold text-rose-700">W₃₃</td></tr>
                  </tbody>
               </table>
               <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-1 rounded">Masked Neural Network Weights</span>
             </div>

             <ArrowRight className="text-gray-400 self-center hidden md:block" />

             {/* Box 2: The Jacobian Matrix */}
             <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
               <h4 className="font-bold text-teal-800 mb-2 border-b border-teal-100 pb-1 w-full text-center">2. The Data Math (Jacobian)</h4>
               <p className="text-[11px] text-gray-600 mb-3 text-center">The Jacobian measures data stretch. Because the weight wires were cut, changing Pixel 3 mathematically has <strong>0% effect</strong> on Pixel 1.</p>
               
               <table className="border-l-2 border-r-2 border-teal-500 px-1 bg-teal-50 rounded shadow-inner text-xs font-mono text-center mb-2">
                  <tbody>
                    <tr><td className="p-2 border border-teal-200 font-bold text-teal-700">∂x₁/∂z₁</td><td className="p-2 border border-teal-200 text-gray-400">0</td><td className="p-2 border border-teal-200 text-gray-400">0</td></tr>
                    <tr><td className="p-2 border border-teal-200 font-bold text-teal-700">∂x₂/∂z₁</td><td className="p-2 border border-teal-200 font-bold text-teal-700">∂x₂/∂z₂</td><td className="p-2 border border-teal-200 text-gray-400">0</td></tr>
                    <tr><td className="p-2 border border-teal-200 font-bold text-teal-700">∂x₃/∂z₁</td><td className="p-2 border border-teal-200 font-bold text-teal-700">∂x₃/∂z₂</td><td className="p-2 border border-teal-200 font-bold text-teal-700">∂x₃/∂z₃</td></tr>
                  </tbody>
               </table>
               <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-1 rounded">Triangular Data Jacobian</span>
             </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg text-sm text-slate-300 w-full mt-2 border border-slate-700 text-center">
             <strong className="text-white">The Conclusion:</strong> We intentionally cripple the Neural Network's vision by cutting its wires (Masking W). This mathematical blindfold directly forces the Data's stretch matrix (J) to become a perfect Triangle!
          </div>
        </div>
      )
    },
    {
      title: "22. The Terminology Trap: 'Layers'",
      subtitle: "Dumb Neurons vs. Big Wrappers.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 text-sm">
            You are 100% correct! Neurons do not possess a brain; they just do <code>wx+b</code>. The confusion comes from AI researchers using the word <strong>"Layer"</strong> to mean two different things.
          </p>

          <div className="flex flex-col md:flex-row gap-4 items-stretch mt-4">
             {/* NN Layer */}
             <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
               <div>
                 <h4 className="font-bold text-rose-800 mb-2 border-b border-rose-100 pb-1">1. "Neural Network Layer"</h4>
                 <p className="text-[11px] text-gray-600 mb-3">Inside the MADE network, a layer is just a collection of dumb neurons. They multiply data by weights, add bias, apply ReLU, and output a vector <code>[h₁, h₂, ..., hₙ]</code>.</p>
               </div>
               
               <div className="bg-slate-50 p-3 rounded border border-slate-200 text-center font-mono text-xs">
                 <div className="text-gray-500 mb-1">Standard: <span className="text-gray-800">y = (w * x) + b</span></div>
                 <div className="text-rose-600 font-bold text-sm bg-rose-50 py-1 rounded">MADE: y = ((W ⊙ Mask) * X) + b</div>
               </div>
               <p className="text-[10px] text-gray-500 mt-2 text-center">It is just standard neural network math, but the Mask mathematically forces some weights to be 0 (blindfolding them).</p>
             </div>

             {/* Flow Layer */}
             <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
               <div>
                 <h4 className="font-bold text-indigo-800 mb-2 border-b border-indigo-100 pb-1">2. "Flow Layer" (The Wrapper)</h4>
                 <p className="text-[11px] text-gray-600 mb-3">A Flow Layer is <strong>not</strong> a layer of neurons. It is a massive mathematical box (a module) that <em>contains</em> a MADE neural network inside it, plus the final algebra.</p>
               </div>
               
               <div className="flex flex-col gap-2">
                 <div className="bg-indigo-50 px-2 py-1 rounded text-[10px] text-indigo-800 font-bold border border-indigo-100 text-center">MADE Network (The Brain)</div>
                 <div className="flex justify-center"><ArrowRight className="text-indigo-300 rotate-90" size={14}/></div>
                 <div className="bg-teal-50 px-2 py-1 rounded text-[10px] text-teal-800 font-bold border border-teal-100 text-center">Math Equation (The Muscle)</div>
               </div>
               <p className="text-[10px] text-gray-500 mt-2 text-center">When we say MAF "stacks multiple layers", it stacks multiple of these giant Flow Wrapper boxes!</p>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "23. Anatomy of a Flow Layer",
      subtitle: "How the Brain and the Muscle work together.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 text-sm">
            Let's tear apart the giant "Flow Layer" wrapper. Because it literally contains an entire MADE neural network inside it, we call it "Smarter" than an old Planar flow.
          </p>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl relative overflow-hidden">
             {/* The Animation Track */}
             <style dangerouslySetInnerHTML={{__html: `
               @keyframes move-x { 0% { left: 0%; } 100% { left: 100%; } }
             `}} />
             <h4 className="text-white font-bold mb-4 text-center">The Flow Layer Wrapper</h4>
             
             <div className="flex items-center justify-between gap-2 relative">
                {/* Step A */}
                <div className="flex flex-col items-center w-1/5 z-10">
                  <div className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded mb-1 shadow-[0_0_10px_rgba(59,130,246,0.5)]">Data (X)</div>
                  <span className="text-gray-400 text-[9px]">Step A: Enters</span>
                </div>

                {/* Step B & C (MADE) */}
                <div className="flex flex-col items-center w-2/5 z-10">
                  <div className="bg-rose-500 text-white text-xs font-bold px-4 py-3 rounded-lg border-2 border-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.6)] w-full text-center relative overflow-hidden">
                    <span className="relative z-10">MADE Network</span>
                    <div className="absolute top-0 bottom-0 left-0 w-4 bg-white/30 skew-x-12 animate-[move-x_2s_linear_infinite]" />
                  </div>
                  <span className="text-rose-200 text-[9px] mt-1 text-center">Step B: Dumb neurons do ((W⊙M)*X)+b</span>
                  <div className="flex gap-4 mt-2">
                    <div className="bg-rose-900/50 text-rose-200 px-2 py-1 rounded text-[10px] border border-rose-500/50">μ (Shift)</div>
                    <div className="bg-rose-900/50 text-rose-200 px-2 py-1 rounded text-[10px] border border-rose-500/50">α (Scale)</div>
                  </div>
                  <span className="text-gray-400 text-[9px] mt-1">Step C: Output Vectors</span>
                </div>

                {/* Step D (Math) */}
                <div className="flex flex-col items-center w-2/5 z-10">
                  <div className="bg-teal-500 text-white text-[11px] font-mono font-bold px-3 py-3 rounded-lg border-2 border-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.6)] w-full text-center">
                    Z = (X - μ) * exp(-α)
                  </div>
                  <span className="text-teal-200 text-[9px] mt-1 text-center">Step D: The Final Math</span>
                </div>

                {/* Step E */}
                <div className="flex flex-col items-center w-1/5 z-10">
                  <div className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded mt-1 shadow-[0_0_10px_rgba(99,102,241,0.5)]">Latent (Z)</div>
                  <span className="text-gray-400 text-[9px]">Step E: Next Layer</span>
                </div>

                {/* Connecting Lines (Background) */}
                <div className="absolute top-6 left-[10%] w-[80%] h-0.5 bg-slate-600 z-0"></div>
                <div className="absolute top-6 left-[10%] w-[30%] h-0.5 bg-blue-400 z-0 shadow-[0_0_8px_#3b82f6]"></div>
                
                {/* Math X bypass line */}
                <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                  <path d="M 10% 24 Q 30% -20, 60% 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
                </svg>
             </div>
             
             <div className="mt-8 bg-slate-800 p-3 rounded border border-slate-600 text-xs text-slate-300 flex flex-col gap-1">
               <span className="text-white font-bold flex items-center gap-2"><CheckCircle2 size={14} className="text-green-400"/> Your Mental Model is Flawless</span>
               <ul className="list-disc pl-5 space-y-1 mt-1">
                 <li><strong>MADE</strong> is a neural network using standard backprop, gradients, and <code>wx+b</code> (just with masks).</li>
                 <li><strong>MAF</strong> is the architecture made of multiple stacked Flow Layers.</li>
                 <li>The Jacobian determinant only measures the final stretch in Step D.</li>
               </ul>
             </div>
          </div>

        </div>
      )
    },
    {
      title: "24. The Output Trick (μ & α)",
      subtitle: "How one neural network outputs two different things.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 text-sm">
            In Step C of the Flow Layer, MADE outputs two vectors: Means (μ) and Scales (α). How does a single network output two different parameter types? <strong>We just double the output neurons!</strong>
          </p>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
            {/* The Visual representation of doubling */}
            <div className="flex-1 flex flex-col items-center">
                <h4 className="font-bold text-indigo-800 mb-3 border-b border-indigo-100 pb-1">1. The Doubling Trick</h4>
                <div className="flex items-center gap-2 w-full justify-center">
                    <div className="bg-blue-100 p-2 rounded border border-blue-300 text-center text-xs shadow-sm">
                        Input<br/><b className="text-blue-800">N Pixels</b>
                    </div>
                    <ArrowRight size={16} className="text-gray-400" />
                    <div className="bg-slate-800 text-white p-3 rounded-lg text-center text-xs shadow-lg border border-slate-600">
                        <b className="text-indigo-400">MADE</b><br/>Network
                    </div>
                    <ArrowRight size={16} className="text-gray-400" />
                    <div className="flex flex-col gap-2">
                        <div className="bg-rose-50 p-2 rounded border border-rose-300 text-center text-xs shadow-sm">
                            <span className="text-[10px] text-gray-500 uppercase block leading-none mb-1">First Half</span>
                            <b className="text-rose-700">N μ (Means)</b>
                        </div>
                        <div className="bg-teal-50 p-2 rounded border border-teal-300 text-center text-xs shadow-sm">
                            <span className="text-[10px] text-gray-500 uppercase block leading-none mb-1">Second Half</span>
                            <b className="text-teal-700">N α (Scales)</b>
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-gray-500 mt-3 text-center">If we input 100 pixels, we build 200 output neurons and literally just slice the array in half in the code!</p>
            </div>

            {/* The Masking Note */}
            <div className="flex-1 flex flex-col items-center md:border-l border-gray-200 md:pl-6">
                <h4 className="font-bold text-rose-800 mb-3 border-b border-rose-100 pb-1">2. Applying the Mask</h4>
                <p className="text-xs text-gray-600 mb-3 text-center">To prevent cheating, both halves must share the exact same masking rules.</p>
                <div className="flex gap-4">
                    <div className="text-center bg-rose-50 px-4 py-2 rounded-lg border border-rose-200 shadow-inner">
                        <code className="text-rose-700 font-bold text-lg">μ₃</code><br/><span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">Degree m=3</span>
                    </div>
                    <div className="text-center bg-teal-50 px-4 py-2 rounded-lg border border-teal-200 shadow-inner">
                        <code className="text-teal-700 font-bold text-lg">α₃</code><br/><span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">Degree m=3</span>
                    </div>
                </div>
                <p className="text-[10px] text-gray-500 mt-3 text-center">Both the shift (μ₃) and scale (α₃) for Pixel 3 are assigned degree m=3, making them strictly blindfolded to Pixels 3 and beyond!</p>
            </div>
          </div>

          {/* The Deep Learning Magic */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-md text-white mt-2 relative overflow-hidden">
            <h4 className="font-bold text-amber-400 mb-3 border-b border-slate-700 pb-2 flex items-center gap-2"><Zap size={18}/> 3. The Deep Learning "Magic"</h4>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">When first initialized, these 200 neurons output random garbage. They don't "know" they are Means or Scales! They only learn their identity because of <strong>where we plug them in</strong>:</p>
            
            <div className="flex justify-center mb-5">
              <code className="bg-slate-800 px-5 py-3 rounded-xl text-lg md:text-xl font-mono border border-slate-600 shadow-inner">
                Z = (X - <span className="text-rose-400">μ</span>) * exp(-<span className="text-teal-400">α</span>)
              </code>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 text-xs text-slate-300 leading-relaxed">
                    Because the first half is plugged into the <strong>subtraction</strong> slot, the Loss Function mathematically forces those specific neurons to act as <span className="text-rose-400 font-bold">Shift Vectors (Means)</span> to center the data at 0.
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 text-xs text-slate-300 leading-relaxed">
                    Because the second half is plugged into the <strong>exponent</strong> slot, the Loss Function mathematically forces them to act as <span className="text-teal-400 font-bold">Scale Vectors</span> to squeeze the width.
                </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "25. The End-to-End Relay Race (MAF)",
      subtitle: "How multiple Flow Layers train together without stopping.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            MAF = multiple Flow Layers stacked together. But we do <strong>not</strong> calculate loss or backpropagate after each layer. They act as a massive relay race!
          </p>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl relative overflow-hidden text-white">
            <div className="flex flex-col gap-6 relative z-10">
               {/* Forward Pass */}
               <div className="flex items-center gap-4">
                 <div className="bg-blue-500/20 text-blue-400 p-3 rounded-lg border border-blue-500/50 w-1/4 text-center">
                    <span className="block font-bold text-sm">1. Forward Pass</span>
                    <span className="text-[10px]">Data flows through all layers</span>
                 </div>
                 <div className="flex-1 flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-600">
                    <div className="text-center"><span className="text-xs text-slate-400 block">Layer 1</span><span className="font-mono text-sm">Z₁</span></div>
                    <ArrowRight size={14} className="text-slate-500"/>
                    <div className="text-center"><span className="text-xs text-slate-400 block">Layer 2</span><span className="font-mono text-sm">Z₂</span></div>
                    <ArrowRight size={14} className="text-slate-500"/>
                    <div className="text-center"><span className="text-xs text-slate-400 block">Layer 10</span><span className="font-mono text-sm text-indigo-400 font-bold">Z_final</span></div>
                 </div>
               </div>

               {/* Loss Calculation */}
               <div className="flex items-center gap-4">
                 <div className="bg-teal-500/20 text-teal-400 p-3 rounded-lg border border-teal-500/50 w-1/4 text-center">
                    <span className="block font-bold text-sm">2. Global Loss</span>
                    <span className="text-[10px]">Calculated exactly ONCE</span>
                 </div>
                 <div className="flex-1 flex items-center gap-4 bg-slate-800 p-3 rounded-lg border border-slate-600">
                    <div className="flex-1 text-center text-xs">
                      <span className="block text-slate-400">Blueprint Score</span>
                      <span className="font-mono text-indigo-300">log p(Z_final)</span>
                    </div>
                    <div className="text-teal-500 font-bold">+</div>
                    <div className="flex-1 text-center text-xs">
                      <span className="block text-slate-400">Total Volume Penalty</span>
                      <span className="font-mono text-teal-300">Σ log|det(J)|</span>
                    </div>
                 </div>
               </div>

               {/* Backprop */}
               <div className="flex items-center gap-4">
                 <div className="bg-rose-500/20 text-rose-400 p-3 rounded-lg border border-rose-500/50 w-1/4 text-center">
                    <span className="block font-bold text-sm">3. Backpropagate</span>
                    <span className="text-[10px]">The Domino Effect</span>
                 </div>
                 <div className="flex-1 flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-rose-900/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-l from-rose-500/10 to-transparent"></div>
                    <div className="text-center z-10"><span className="text-xs text-rose-300 block">Update MADE 1</span></div>
                    <ArrowLeft size={14} className="text-rose-500 z-10"/>
                    <div className="text-center z-10"><span className="text-xs text-rose-300 block">Update MADE 2</span></div>
                    <ArrowLeft size={14} className="text-rose-500 z-10"/>
                    <div className="text-center z-10"><span className="text-xs text-rose-300 block">Update MADE 10</span></div>
                 </div>
               </div>
            </div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded p-4 text-sm text-indigo-900">
             Every MADE network is just a small gear in a massive machine. The data flows completely through all the gears, we calculate <strong>one final score</strong> at the very end, and that single score ripples backward to tune every single gear at the same time!
          </div>
        </div>
      )
    },
    {
      title: "26. The Mechanics of Masking (Degrees)",
      subtitle: "How programmers decide where the 1s and 0s go.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            To build the Binary Mask mathematically, programmers assign an integer called a <strong>Degree (m)</strong> to every node in the network. The degree dictates what connections are allowed to exist.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* The Rules */}
            <div className="flex flex-col gap-4">
               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                 <h4 className="font-bold text-green-700 mb-2 border-b border-green-100 pb-1">Rule 1: Hidden Layers</h4>
                 <p className="text-xs text-gray-600 mb-2">A hidden node can only receive info from nodes with an <strong>equal or lower</strong> degree.</p>
                 <div className="bg-green-50 p-2 rounded text-center font-mono text-green-800 text-sm font-bold border border-green-200">
                   m<sup>L</sup> ≥ m<sup>L-1</sup>
                 </div>
               </div>

               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                 <h4 className="font-bold text-orange-700 mb-2 border-b border-orange-100 pb-1">Rule 2: Output Layers</h4>
                 <p className="text-xs text-gray-600 mb-2">An output node must strictly look at nodes with a <strong>lower</strong> degree. This prevents an output from accidentally seeing itself!</p>
                 <div className="bg-orange-50 p-2 rounded text-center font-mono text-orange-800 text-sm font-bold border border-orange-200">
                   m<sup>L</sup> &gt; m<sup>L-1</sup>
                 </div>
               </div>
            </div>

            {/* The Visual Node Graph */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-lg relative h-80 flex flex-col items-center justify-between">
               
               {/* Outputs */}
               <div className="flex w-full justify-around z-10">
                 <div className="w-14 h-14 rounded-full bg-orange-200 border-2 border-orange-400 flex items-center justify-center font-bold text-orange-900 text-xs shadow">p(X₁)</div>
                 <div className="w-14 h-14 rounded-full bg-orange-200 border-2 border-orange-400 flex items-center justify-center font-bold text-orange-900 text-xs shadow flex-col leading-tight"><span>p(X₂)</span><span className="text-[9px] font-normal">m=2</span></div>
                 <div className="w-14 h-14 rounded-full bg-orange-200 border-2 border-orange-400 flex items-center justify-center font-bold text-orange-900 text-xs shadow flex-col leading-tight"><span>p(X₃)</span><span className="text-[9px] font-normal">m=3</span></div>
               </div>

               {/* Hidden */}
               <div className="flex w-2/3 justify-around z-10">
                 <div className="w-14 h-14 rounded-full bg-green-200 border-2 border-green-400 flex flex-col items-center justify-center font-bold text-green-900 text-xs shadow leading-tight"><span>h₁</span><span className="text-[9px] font-normal">m=1</span></div>
                 <div className="w-14 h-14 rounded-full bg-green-200 border-2 border-green-400 flex flex-col items-center justify-center font-bold text-green-900 text-xs shadow leading-tight"><span>h₂</span><span className="text-[9px] font-normal">m=2</span></div>
               </div>

               {/* Inputs */}
               <div className="flex w-full justify-around z-10">
                 <div className="w-14 h-14 rounded-full bg-blue-200 border-2 border-blue-400 flex flex-col items-center justify-center font-bold text-blue-900 text-xs shadow leading-tight"><span>X₁</span><span className="text-[9px] font-normal">m=1</span></div>
                 <div className="w-14 h-14 rounded-full bg-blue-200 border-2 border-blue-400 flex flex-col items-center justify-center font-bold text-blue-900 text-xs shadow leading-tight"><span>X₂</span><span className="text-[9px] font-normal">m=2</span></div>
                 <div className="w-14 h-14 rounded-full bg-blue-200 border-2 border-blue-400 flex flex-col items-center justify-center font-bold text-blue-900 text-xs shadow leading-tight"><span>X₃</span><span className="text-[9px] font-normal">m=3</span></div>
               </div>

               {/* SVGs Lines */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 0}}>
                 <defs>
                   <marker id="arrow-light" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
                     <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
                   </marker>
                 </defs>
                 {/* From Inputs to Hidden (Rule 1: >=) */}
                 <line x1="16%" y1="240" x2="33%" y2="185" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-light)" /> {/* x1 -> h1 (1>=1) */}
                 <line x1="16%" y1="240" x2="66%" y2="185" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-light)" /> {/* x1 -> h2 (2>=1) */}
                 <line x1="50%" y1="240" x2="66%" y2="185" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-light)" /> {/* x2 -> h2 (2>=2) */}
                 {/* Notice x3 connects to nothing, because no hidden node is m=3 */}

                 {/* From Hidden to Output (Rule 2: >) */}
                 <line x1="33%" y1="130" x2="50%" y2="70" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-light)" /> {/* h1 -> p2 (2>1) */}
                 <line x1="33%" y1="130" x2="83%" y2="70" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-light)" /> {/* h1 -> p3 (3>1) */}
                 <line x1="66%" y1="130" x2="83%" y2="70" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-light)" /> {/* h2 -> p3 (3>2) */}
                 
                 {/* p1 has NO inputs because nothing is strictly less than 1! */}
               </svg>
            </div>

          </div>
        </div>
      )
    },
    {
      title: "27. The Autoregressive Bottleneck",
      subtitle: "Why MAF struggles with real-time Control and Simulation.",
      content: (
        <div className="space-y-4 animate-fade-in">
          <p className="text-gray-700">
            For problems like Model Predictive Control (MPC) of energy pipelines, we must simulate <em>thousands</em> of future states in milliseconds. Autoregressive flows (like MAF) fail here because of the <strong>Sampling Bottleneck</strong>.
          </p>

          <div className="flex flex-col md:flex-row gap-6 mt-4">
             {/* Fast Forward (Training) */}
             <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                <h4 className="font-bold text-teal-700 mb-3 border-b border-teal-100 pb-2 w-full text-center">Forward Pass (Training)</h4>
                <div className="bg-teal-50 w-full rounded-lg p-4 flex flex-col gap-2 items-center border border-teal-200">
                   <div className="flex gap-1 w-full justify-center">
                     {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-6 h-6 bg-teal-400 rounded-sm"></div>
                     ))}
                   </div>
                   <ArrowDown size={16} className="text-teal-400" />
                   <div className="w-full bg-slate-800 text-white text-xs text-center py-2 rounded shadow-inner">Masked Neural Network</div>
                   <ArrowDown size={16} className="text-teal-400" />
                   <div className="flex gap-1 w-full justify-center">
                     {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-6 h-6 bg-indigo-400 rounded-full"></div>
                     ))}
                   </div>
                </div>
                <div className="mt-4 text-center">
                   <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-bold">Fast & Parallel</span>
                   <p className="text-[11px] text-gray-500 mt-2">All data points process simultaneously in one GPU operation.</p>
                </div>
             </div>

             {/* Slow Inverse (Sampling) */}
             <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                <h4 className="font-bold text-rose-700 mb-3 border-b border-rose-100 pb-2 w-full text-center">Inverse Pass (Sampling)</h4>
                
                <div className="bg-rose-50 w-full rounded-lg p-4 flex flex-col gap-2 items-center border border-rose-200">
                   <style dangerouslySetInnerHTML={{__html: `
                     @keyframes loop-appear { 
                       0%, 100% { opacity: 0; }
                       20%, 80% { opacity: 1; }
                     }
                   `}} />
                   
                   <div className="flex gap-1 w-full justify-center">
                     <div className="w-6 h-6 bg-indigo-400 rounded-full"></div>
                     <div className="w-6 h-6 bg-gray-300 rounded-full opacity-30"></div>
                     <div className="w-6 h-6 bg-gray-300 rounded-full opacity-30"></div>
                     <div className="w-6 h-6 bg-gray-300 rounded-full opacity-30"></div>
                     <div className="w-6 h-6 bg-gray-300 rounded-full opacity-30"></div>
                   </div>
                   <div className="flex justify-center w-full relative">
                      <ArrowDown size={16} className="text-rose-400" />
                      <RotateCcw size={14} className="absolute right-[30%] text-rose-500 animate-[spin_2s_linear_infinite]" />
                   </div>
                   <div className="w-full bg-slate-800 text-white text-xs text-center py-2 rounded shadow-inner">MADE Network</div>
                   <ArrowDown size={16} className="text-rose-400" />
                   <div className="flex gap-1 w-full justify-center">
                     <div className="w-6 h-6 bg-teal-400 rounded-sm"></div>
                     <div className="w-6 h-6 bg-teal-400 rounded-sm animate-[loop-appear_2s_infinite]"></div>
                     <div className="w-6 h-6 border-2 border-dashed border-rose-300 rounded-sm"></div>
                     <div className="w-6 h-6 border-2 border-dashed border-rose-300 rounded-sm"></div>
                     <div className="w-6 h-6 border-2 border-dashed border-rose-300 rounded-sm"></div>
                   </div>
                </div>

                <div className="mt-4 text-center">
                   <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold">Slow Sequential Loop</span>
                   <p className="text-[11px] text-gray-500 mt-2">Generating D variables requires D separate passes through the network.</p>
                </div>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "28. Affine Coupling Layers",
      subtitle: "The 'Lazy' Split Trick.",
      content: (
        <div className="space-y-4 animate-fade-in">
          <p className="text-gray-700">
            Coupling layers completely abandon the strict pixel-by-pixel autoregressive rule. Instead, they simply chop the entire data vector perfectly in half.
          </p>
          
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl relative mt-4">
             <h4 className="text-white text-center font-bold mb-6">The Forward Transformation</h4>
             
             <div className="flex items-start justify-center gap-12 relative z-10">
                {/* Left Side (Pass Through) */}
                <div className="flex flex-col items-center gap-4 w-1/3">
                   <div className="bg-blue-500 text-white px-6 py-2 rounded shadow-lg font-mono w-full text-center">X₁ (Half A)</div>
                   
                   <div className="h-32 w-1 bg-blue-500/50 relative">
                     <div className="absolute top-0 w-3 h-3 -left-1 rounded-full bg-blue-400 animate-[ping_1.5s_infinite]"></div>
                   </div>
                   
                   <div className="bg-blue-400 text-white px-6 py-2 rounded shadow-lg font-mono w-full text-center border border-blue-300">Y₁ = X₁</div>
                   <p className="text-[10px] text-blue-200 mt-2 text-center">Passes through entirely untouched!</p>
                </div>

                {/* The Network Bridge */}
                <div className="absolute left-[35%] top-[25%] flex items-center">
                   <div className="w-16 h-1 bg-blue-500/50"></div>
                   <div className="bg-slate-800 text-white p-3 rounded-lg border border-slate-600 shadow-lg text-center text-xs">
                     Standard NN<br/><span className="text-[10px] text-gray-400">s(X₁), t(X₁)</span>
                   </div>
                   <div className="w-16 h-1 bg-rose-500/50 relative">
                     <div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-rose-500"></div>
                   </div>
                </div>

                {/* Right Side (Transform) */}
                <div className="flex flex-col items-center gap-4 w-1/3">
                   <div className="bg-rose-500 text-white px-6 py-2 rounded shadow-lg font-mono w-full text-center">X₂ (Half B)</div>
                   
                   <div className="h-12 w-1 bg-rose-500/50"></div>
                   
                   <div className="bg-amber-400 text-slate-900 font-bold p-3 rounded-full border-2 border-amber-200 shadow-lg flex items-center justify-center relative">
                     <span className="text-xl leading-none px-1">Affine</span>
                   </div>

                   <div className="h-8 w-1 bg-rose-400/50 relative">
                      <ArrowDown size={16} className="absolute -left-1.5 bottom-0 text-rose-400"/>
                   </div>
                   
                   <div className="bg-rose-400 text-white px-4 py-2 rounded shadow-lg font-mono w-full text-center text-[10px] border border-rose-300 flex flex-col">
                     <span className="font-bold text-xs mb-1">Y₂</span>
                     <span>X₂ ⊙ exp(s) + t</span>
                   </div>
                   <p className="text-[10px] text-rose-200 mt-2 text-center">Warped by the output of Half A's network.</p>
                </div>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "29. The Block-Triangular Jacobian",
      subtitle: "Erasing the complex neural network from the math.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Because Half A (Y₁) passes through identically, and Half A calculates the parameters for Half B (Y₂), the Jacobian Matrix forms four distinct blocks:
          </p>

          <div className="flex flex-col md:flex-row gap-6 mt-4 items-center justify-center">
             
             {/* The Matrix */}
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg relative flex items-center justify-center w-[250px] h-[250px]">
                {/* Large Brackets */}
                <div className="absolute left-2 top-2 bottom-2 w-4 border-l-4 border-t-4 border-b-4 border-slate-800 rounded-l-lg"></div>
                <div className="absolute right-2 top-2 bottom-2 w-4 border-r-4 border-t-4 border-b-4 border-slate-800 rounded-r-lg"></div>
                
                <div className="grid grid-cols-2 gap-4 w-full h-full p-4 relative z-10">
                   <div className="flex flex-col items-center justify-center bg-blue-50 border border-blue-200 rounded p-2 text-center">
                      <span className="text-[9px] text-gray-500 mb-1">∂Y₁ / ∂X₁</span>
                      <strong className="text-xl text-blue-700">I</strong>
                      <span className="text-[8px] text-blue-600 mt-1">Identity</span>
                   </div>
                   <div className="flex flex-col items-center justify-center bg-green-50 border-2 border-green-400 rounded p-2 text-center shadow-[0_0_15px_rgba(74,222,128,0.3)]">
                      <span className="text-[9px] text-gray-500 mb-1">∂Y₁ / ∂X₂</span>
                      <strong className="text-3xl text-green-600">0</strong>
                      <span className="text-[8px] text-green-700 mt-1">No relation!</span>
                   </div>
                   <div className="flex flex-col items-center justify-center bg-slate-100 border border-slate-300 rounded p-2 text-center">
                      <span className="text-[9px] text-gray-500 mb-1">∂Y₂ / ∂X₁</span>
                      <strong className="text-xl text-slate-700">A</strong>
                      <span className="text-[8px] text-slate-500 mt-1">NN Derivs</span>
                   </div>
                   <div className="flex flex-col items-center justify-center bg-rose-50 border border-rose-200 rounded p-2 text-center">
                      <span className="text-[9px] text-gray-500 mb-1">∂Y₂ / ∂X₂</span>
                      <strong className="text-sm text-rose-700 font-mono">diag<br/>(exp(s))</strong>
                   </div>
                </div>
             </div>

             <div className="flex flex-col gap-4 flex-1">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
                   <h4 className="font-bold text-green-800 mb-1 flex items-center gap-2"><CheckCircle2 size={16}/> The Diagonal Rule</h4>
                   <p className="text-xs text-green-700 leading-relaxed">Because the Top-Right block is exactly <strong>0</strong>, the entire matrix becomes a "Lower Triangular Block Matrix".</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 shadow-sm">
                   <h4 className="font-bold text-indigo-800 mb-1 flex items-center gap-2"><Zap size={16}/> The Math Shortcut</h4>
                   <p className="text-xs text-indigo-700 leading-relaxed">The determinant of a triangular matrix is just the product of its diagonal. The massive, terrifying Neural Network derivatives (Block A) are <strong>mathematically multiplied by zero and erased!</strong></p>
                </div>
                <div className="bg-slate-800 text-white p-3 rounded-lg text-center font-mono text-sm border border-slate-600 shadow-inner">
                   log |det(J)| = Σ s(X₁)
                </div>
             </div>

          </div>
        </div>
      )
    },
    {
      title: "30. The Lightning-Fast Inverse",
      subtitle: "Why sampling is instant (No For Loops!).",
      content: (
        <div className="space-y-4 animate-fade-in">
          <p className="text-gray-700">
            For Model Predictive Control, we need to generate thousands of states instantly. Because Half A (X₁) passed through untouched, it is our key to reversing the entire layer in a single pass.
          </p>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative mt-4">
             <h4 className="text-slate-800 text-center font-bold mb-6">The Inverse Transformation (Sampling)</h4>
             
             <div className="flex items-start justify-center gap-12 relative z-10">
                {/* Left Side (Pass Through) */}
                <div className="flex flex-col items-center gap-4 w-1/3">
                   <div className="bg-blue-400 text-white px-6 py-2 rounded shadow font-mono w-full text-center">Y₁</div>
                   
                   <div className="h-32 w-1 bg-blue-300/50 relative">
                     <ArrowDown size={16} className="absolute -left-1.5 bottom-0 text-blue-400"/>
                   </div>
                   
                   <div className="bg-blue-500 text-white px-6 py-2 rounded shadow-lg font-mono w-full text-center border-2 border-blue-400 flex flex-col">
                     <span className="font-bold text-xs mb-1">X₁</span>
                     <span className="text-[10px]">X₁ = Y₁</span>
                   </div>
                </div>

                {/* The Network Bridge */}
                <div className="absolute left-[35%] top-[25%] flex items-center">
                   <div className="w-16 h-1 bg-blue-500/50 relative">
                     <ArrowRight size={14} className="absolute -right-1 -top-1.5 text-blue-500"/>
                   </div>
                   <div className="bg-emerald-100 text-emerald-800 p-3 rounded-lg border-2 border-emerald-400 shadow text-center text-xs font-bold relative">
                     <span className="absolute -top-3 -right-3 flex h-5 w-5">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 text-white items-center justify-center text-[10px]"><Zap size={10}/></span>
                     </span>
                     Standard NN<br/><span className="text-[10px] text-emerald-600 font-mono mt-1 block">s(Y₁), t(Y₁)</span>
                   </div>
                   <div className="w-16 h-1 bg-emerald-400/50 relative">
                     <div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-emerald-500"></div>
                   </div>
                </div>

                {/* Right Side (Transform) */}
                <div className="flex flex-col items-center gap-4 w-1/3">
                   <div className="bg-rose-400 text-white px-6 py-2 rounded shadow font-mono w-full text-center">Y₂</div>
                   
                   <div className="h-12 w-1 bg-rose-300/50"></div>
                   
                   <div className="bg-slate-100 text-slate-800 font-bold p-3 rounded border border-slate-300 shadow flex items-center justify-center">
                     <span className="text-xs">Inverse Affine</span>
                   </div>

                   <div className="h-8 w-1 bg-rose-500/50 relative">
                      <ArrowDown size={16} className="absolute -left-1.5 bottom-0 text-rose-500"/>
                   </div>
                   
                   <div className="bg-rose-500 text-white px-2 py-2 rounded shadow-lg font-mono w-full text-center text-[9px] border-2 border-rose-400 flex flex-col">
                     <span className="font-bold text-xs mb-1">X₂</span>
                     <span>(Y₂ - t) ⊙ exp(-s)</span>
                   </div>
                </div>
             </div>

             <div className="mt-8 bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-sm text-emerald-900 text-center shadow-inner">
               Because Y₁ is instantly available, we can run the Neural Network to get the exact same s and t parameters <strong>in one single pass</strong>. There are no sequential loops! This makes Affine Coupling perfectly suited for fast, real-time Model Predictive Control simulations.
             </div>
          </div>
        </div>
      )
    },
    {
      title: "31. The Grand Unification",
      subtitle: "Do we use Log-Likelihood and Backprop? Yes!",
      content: (
        <div className="space-y-4 animate-fade-in">
          <p className="text-gray-700">
            You have connected the dots perfectly! You just realized the greatest secret of Normalizing Flows: no matter how crazy the names get (MADE, MAF, IAF, RealNVP, Glow), <strong>the underlying engine is exactly the same</strong>.
          </p>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl mt-4">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="text-green-400"/> 1. The Training Loop is Identical</h4>
            <p className="text-sm text-slate-300 mb-4">
              The data flows through all the Coupling Layers, doing the splits and math, until it pops out at the very end as <code className="bg-slate-800 text-indigo-400 px-1 rounded">Z_final</code>. We call the exact same "Inspector":
            </p>
            <div className="bg-slate-800 p-4 rounded-lg text-center border border-slate-600 mb-4">
              <code className="text-rose-400 font-bold text-lg">Loss = -1 * (Blueprint Score + Volume Penalty)</code>
            </div>
            <p className="text-sm text-slate-300">
              We call <code className="bg-slate-800 px-1 rounded text-teal-400">loss.backward()</code>, and the error flows backward through the entire model, updating the weights inside <em>every single neural network</em> in those coupling layers simultaneously.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "32. Vocabulary Shift: s & t vs μ & α",
      subtitle: "Are they the exact same thing? Yes!",
      content: (
        <div className="space-y-4 animate-fade-in">
          <p className="text-gray-700">
            They are the exact same concepts wearing a different trench coat! Different textbook authors just like to use different letters.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
              <h4 className="font-bold text-indigo-800 mb-2 border-b border-indigo-100 pb-2 w-full text-center">Translation (t) = Mean (μ)</h4>
              <div className="bg-indigo-50 w-full p-4 rounded-lg flex justify-center items-center gap-4 border border-indigo-200">
                <span className="text-2xl font-bold text-indigo-600">t</span>
                <ArrowRightLeft className="text-indigo-400"/>
                <span className="text-2xl font-bold text-indigo-600">μ</span>
              </div>
              <p className="text-xs text-gray-600 mt-3 text-center">It shifts the data left or right. It controls the center of the distribution.</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
              <h4 className="font-bold text-teal-800 mb-2 border-b border-teal-100 pb-2 w-full text-center">Scale (s) = Log-Std (α)</h4>
              <div className="bg-teal-50 w-full p-4 rounded-lg flex justify-center items-center gap-4 border border-teal-200">
                <span className="text-2xl font-bold text-teal-600">s</span>
                <ArrowRightLeft className="text-teal-400"/>
                <span className="text-2xl font-bold text-teal-600">α</span>
              </div>
              <p className="text-xs text-gray-600 mt-3 text-center">It stretches or squishes the data. It controls the width of the distribution.</p>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center shadow-sm mt-4">
            <span className="text-sm font-bold text-slate-700">The Affine Math Equation:</span>
            <div className="mt-2 text-lg font-mono text-slate-800">
              Y₂ = (X₂ ⊙ exp(<span className="text-teal-600">s</span>)) + <span className="text-indigo-600">t</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">It's just a Shift and a Scale, identical to the Gaussian formula we used earlier!</p>
          </div>
        </div>
      )
    },
    {
      title: "33. The Brain vs. The Muscle (Coupling)",
      subtitle: "The neural network finishes completely before the math starts.",
      content: (
        <div className="space-y-4 animate-fade-in">
          <p className="text-gray-700">
            <strong>No, we do not warp X₂ inside the hidden layers!</strong> The entire Neural Network acts as a single, isolated "Brain." X₁ goes all the way through every hidden layer first to produce the final s and t.
          </p>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center mt-4 relative">
            
            <div className="flex w-full items-stretch justify-between gap-4">
                {/* The Brain */}
                <div className="flex-1 bg-slate-900 p-4 pt-6 rounded-xl border border-slate-700 shadow-lg relative flex flex-col items-center">
                    <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest mb-3 absolute top-0 -translate-y-1/2 border border-slate-600">1. The Brain (Neural Network)</span>
                    <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded mb-2">Input: X₁</div>
                    <ArrowDown size={14} className="text-slate-500 mb-1"/>
                    <div className="flex gap-2">
                       <div className="bg-slate-800 border border-slate-600 w-8 h-8 rounded-full flex items-center justify-center text-[10px] text-slate-400">L1</div>
                       <div className="bg-slate-800 border border-slate-600 w-8 h-8 rounded-full flex items-center justify-center text-[10px] text-slate-400">L2</div>
                       <div className="bg-slate-800 border border-slate-600 w-8 h-8 rounded-full flex items-center justify-center text-[10px] text-slate-400">L3</div>
                    </div>
                    <ArrowDown size={14} className="text-slate-500 mt-1 mb-2"/>
                    <div className="flex gap-2 w-full justify-center">
                        <div className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded shadow">Output: t</div>
                        <div className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded shadow">Output: s</div>
                    </div>
                </div>

                <div className="flex items-center justify-center">
                   <ArrowRight size={24} className="text-gray-400"/>
                </div>

                {/* The Muscle */}
                <div className="flex-1 bg-rose-50 p-4 pt-6 rounded-xl border border-rose-200 shadow-sm relative flex flex-col items-center justify-center">
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest mb-3 absolute top-0 -translate-y-1/2 border border-rose-300">2. The Muscle (Math)</span>
                    <div className="flex items-center gap-2 mb-3">
                       <div className="bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded shadow-sm">Input: X₂</div>
                       <span className="text-rose-400 font-bold">+</span>
                       <div className="flex gap-1">
                          <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">t</span>
                          <span className="bg-teal-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">s</span>
                       </div>
                    </div>
                    <ArrowDown size={14} className="text-rose-400 mb-2"/>
                    <code className="bg-white border border-rose-300 text-rose-800 font-bold px-4 py-2 rounded-lg shadow-sm">
                       Y₂ = (X₂ ⊙ exp(s)) + t
                    </code>
                </div>
            </div>

          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded text-sm text-indigo-900 shadow-sm mt-4">
            Only <strong>after</strong> the Neural Network completely finishes calculating does it pass the final <code>s</code> and <code>t</code> vectors to the Affine Math block, which executes exactly <strong>once</strong> for that Flow Layer.
          </div>
        </div>
      )
    },
    {
      title: "34. Volume Penalty: Shift vs. Stretch",
      subtitle: "Why the Jacobian completely ignores the t variable.",
      content: (
        <div className="space-y-4 animate-fade-in">
          <p className="text-gray-700">
            Do we calculate loss on s and t? We calculate loss directly on <strong>s</strong>, but we NEVER calculate loss directly on <strong>t</strong>. Here is the elegant reason why:
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 mt-4">
             {/* Translation (t) */}
             <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                <h4 className="font-bold text-indigo-800 mb-4 w-full text-center border-b border-indigo-100 pb-2">Translation (t): No Stretch</h4>
                
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes shift-block {
                    0%, 100% { transform: translateX(-40px); }
                    50% { transform: translateX(40px); }
                  }
                `}} />
                
                <div className="w-full bg-indigo-50 h-32 rounded-lg border border-indigo-200 flex items-center justify-center relative overflow-hidden mb-4">
                   <div className="w-16 h-16 bg-indigo-500 rounded border-2 border-indigo-700 animate-[shift-block_3s_ease-in-out_infinite] shadow-lg flex items-center justify-center text-white text-[10px] font-bold">1 lb clay</div>
                   {/* Background grid */}
                   <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(#c7d2fe 1px, transparent 1px), linear-gradient(90deg, #c7d2fe 1px, transparent 1px)', backgroundSize: '16px 16px', opacity: 0.5, zIndex: 0}}></div>
                </div>
                
                <p className="text-xs text-slate-600 text-center leading-relaxed">
                   <strong>The variable t is added to the data (a shift).</strong> Imagine a 1-pound block of clay resting on a table. If I pick up the clay and move it 5 inches to the left (applying t), did the volume change? <strong>No.</strong>
                </p>
                <div className="mt-3 bg-indigo-100 text-indigo-900 text-[11px] font-bold px-3 py-1.5 rounded-full w-full text-center">Jacobian Determinant Ignores t</div>
             </div>

             {/* Scale (s) */}
             <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                <h4 className="font-bold text-teal-800 mb-4 w-full text-center border-b border-teal-100 pb-2">Scale (s): The Stretch</h4>
                
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes stretch-block {
                    0%, 100% { transform: scaleX(1); opacity: 1; }
                    50% { transform: scaleX(2.5); opacity: 0.5; }
                  }
                `}} />
                
                <div className="w-full bg-teal-50 h-32 rounded-lg border border-teal-200 flex items-center justify-center relative overflow-hidden mb-4">
                   <div className="w-16 h-16 bg-teal-500 rounded border-2 border-teal-700 animate-[stretch-block_3s_ease-in-out_infinite] shadow-lg flex items-center justify-center text-white text-[10px] font-bold whitespace-nowrap">Ink Density</div>
                   {/* Background grid */}
                   <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(#99f6e4 1px, transparent 1px), linear-gradient(90deg, #99f6e4 1px, transparent 1px)', backgroundSize: '16px 16px', opacity: 0.5, zIndex: 0}}></div>
                </div>
                
                <p className="text-xs text-slate-600 text-center leading-relaxed">
                   <strong>The variable s multiplies the data (a scale).</strong> If I multiply data by exp(s), I stretch the rubber band! That means the density of the probability ink just got cut in half.
                </p>
                <div className="mt-3 bg-teal-100 text-teal-900 text-[11px] font-bold px-3 py-1.5 rounded-full w-full text-center">Jacobian Determinant IS exp(s)!</div>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "35. The Magic 'Cancel Out' Trick",
      subtitle: "How terrifying matrix math simplifies into simple addition.",
      content: (
        <div className="space-y-4 animate-fade-in">
          <p className="text-gray-700">
             The formula for the Volume Penalty requires us to calculate the <strong>Log-Determinant</strong>. Let's see what happens to exp(s)...
          </p>

          <div className="bg-slate-900 p-8 rounded-xl text-white shadow-xl mt-4 flex flex-col items-center justify-center border border-slate-700">
             
             <div className="bg-slate-800 px-6 py-3 rounded-lg border border-slate-600 shadow-sm flex items-center gap-3 text-lg font-mono text-slate-300">
                Volume Penalty = <span className="text-rose-400 font-bold">log</span> ( |<span className="text-white">det(J)</span>| )
             </div>

             <ArrowDown size={24} className="text-slate-600 my-4" />

             <div className="bg-slate-800 px-6 py-3 rounded-lg border border-slate-600 shadow-sm flex items-center gap-3 text-lg font-mono text-slate-300">
                Volume Penalty = <span className="text-rose-400 font-bold">log</span> ( <span className="text-teal-400 font-bold">exp(s)</span> )
             </div>

             <ArrowDown size={24} className="text-slate-600 my-4" />

             <div className="relative inline-block my-2">
                <span className="text-5xl font-black text-rose-500 opacity-50 relative inline-block">
                   log( exp(
                   {/* Slash line */}
                   <div className="absolute top-1/2 left-[-10%] w-[120%] h-1.5 bg-red-500 -rotate-12 z-10 shadow-lg"></div>
                </span>
                <span className="text-6xl font-black text-teal-400 mx-2 animate-pulse drop-shadow-[0_0_15px_rgba(45,212,191,0.6)]">s</span>
                <span className="text-5xl font-black text-rose-500 opacity-50 relative inline-block">
                   ) )
                   {/* Slash line */}
                   <div className="absolute top-1/2 left-[-10%] w-[120%] h-1.5 bg-red-500 -rotate-12 z-10 shadow-lg"></div>
                </span>
             </div>
             
             <p className="text-amber-400 font-bold text-sm mt-4 uppercase tracking-widest">Mathematical Opposites Cancel Out!</p>

             <div className="mt-8 bg-teal-900/40 border border-teal-500/50 px-8 py-4 rounded-xl text-center shadow-lg">
                <span className="block text-2xl font-bold text-teal-400 font-mono">Volume Penalty = s</span>
                <p className="text-xs text-teal-100 mt-2 opacity-80">The massive Jacobian matrix calculation literally simplifies down to just taking the <strong>s</strong> numbers from the Neural Network and adding them up!</p>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "36. Putting It All Together",
      subtitle: "Calculating the final loss in three easy steps.",
      content: (
        <div className="space-y-4 animate-fade-in">
          <p className="text-gray-700">
            At the end of the entire network, your real pipeline data (X) has been warped into Y_final (which we call Z_final). PyTorch evaluates everything in three lines of code.
          </p>

          <div className="flex flex-col gap-4 mt-4">
             {/* Step 1 */}
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
                <div className="bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow">1</div>
                <div className="w-full">
                   <h4 className="font-bold text-indigo-800 mb-1">The Blueprint Score</h4>
                   <code className="bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded text-sm font-mono border border-indigo-100 block w-full mb-2">score = bell_curve.log_prob(Z_final)</code>
                   <p className="text-xs text-gray-500 bg-slate-50 p-2 rounded border border-slate-100">
                      <strong>Notice:</strong> <code>t</code> is implicitly graded here! We don't evaluate <code>t</code> directly, but if the network chose a bad <code>t</code>, Z_final will land far away from the center of the bell curve, and this score will be terrible.
                   </p>
                </div>
             </div>

             {/* Step 2 */}
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
                <div className="bg-teal-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow">2</div>
                <div className="w-full">
                   <h4 className="font-bold text-teal-800 mb-1">The Volume Penalty</h4>
                   <code className="bg-teal-50 text-teal-900 px-3 py-1.5 rounded text-sm font-mono border border-teal-100 block w-full mb-2">penalty = sum(s)</code>
                   <p className="text-xs text-gray-500 bg-slate-50 p-2 rounded border border-slate-100">
                      PyTorch grabs all the <code>s</code> vectors generated by your Neural Networks across every layer and simply adds them up.
                   </p>
                </div>
             </div>

             {/* Step 3 */}
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
                <div className="bg-rose-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow">3</div>
                <div className="w-full">
                   <h4 className="font-bold text-rose-800 mb-1">Total Loss</h4>
                   <code className="bg-rose-50 text-rose-900 px-3 py-1.5 rounded text-sm font-mono border border-rose-100 block w-full mb-2">loss = -1 * (score + penalty)</code>
                   <p className="text-xs text-gray-500 bg-slate-50 p-2 rounded border border-slate-100">
                      We flip it negative because optimizers minimize to zero. <code>loss.backward()</code> handles the rest, tracing the math backward to update the neural network weights!
                   </p>
                </div>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "37. Why Coupling is Easier to Code",
      subtitle: "Goodbye, complicated binary masks!",
      content: (
        <div className="space-y-4 animate-fade-in">
          <p className="text-gray-700">
            In MAF, you had to write a complicated "Binary Mask" to cut the wires inside the Neural Network so it wouldn't cheat. In Affine Coupling, <strong>you don't need a mask at all!</strong>
          </p>

          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm opacity-60 grayscale">
              <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3 text-center">MAF (The Hard Way)</h4>
              <div className="flex justify-center mb-3">
                <Network size={32} className="text-slate-400"/>
              </div>
              <p className="text-xs text-slate-600 text-center">Requires calculating exact "degrees" for every hidden neuron and multiplying weight matrices by 0 to prevent looking into the future.</p>
            </div>

            <div className="flex-1 bg-white p-5 rounded-xl border border-emerald-300 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">THE EASY WAY</div>
              <h4 className="font-bold text-emerald-800 border-b border-emerald-100 pb-2 mb-3 text-center">Coupling (Physical Split)</h4>
              <div className="flex justify-center gap-4 mb-3">
                <div className="bg-blue-100 border border-blue-300 px-3 py-1 rounded text-xs font-mono font-bold text-blue-800">x[:50]</div>
                <div className="bg-rose-100 border border-rose-300 px-3 py-1 rounded text-xs font-mono font-bold text-rose-800">x[50:]</div>
              </div>
              <p className="text-xs text-emerald-700 text-center leading-relaxed">
                Because you physically split the data array in half, and the Neural Network <em>only</em> takes Half A as input, it is physically impossible for the network to cheat and look at Half B.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-slate-900 text-white p-4 rounded-xl text-center shadow-xl border border-slate-700">
            <span className="block text-lg font-bold mb-1 flex justify-center items-center gap-2"><CheckCircle2 className="text-green-400"/> You have fully mastered the architecture!</span>
            <span className="text-sm text-slate-300 leading-relaxed block mt-1">You can use literally any standard, off-the-shelf neural network (MLP, ResNet, etc.) as your "Brain" to calculate s and t. You are completely ready to write the code for this!</span>
          </div>
        </div>
      )
    },
    {
      title: "38. Reimagining the Architecture for Our Dataset",
      subtitle: "End-to-end: Splitting, Conditioning, Swapping, and Loss.",
      content: (
        <div className="space-y-6 animate-fade-in">
          <p className="text-gray-700 text-base">
             Here is the complete architectural diagram for your Stochastic MPC project. Scroll down to trace the data from the SCADA sensors all the way to the final Loss calculation!
          </p>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl overflow-y-auto h-[450px] relative font-mono">
             
             {/* STEP 1: THE DATA & SPLIT */}
             <div className="flex flex-col items-center w-full mb-12">
                <span className="bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-slate-600 mb-6 shadow-md">1. The 3-Way Partition & Split</span>
                
                <div className="flex justify-center gap-8 w-full text-center">
                   {/* Condition Data */}
                   <div className="flex flex-col gap-4 w-1/3">
                      <div className="bg-blue-900/50 border border-blue-500/50 p-4 rounded-xl text-blue-200 shadow-lg">
                         <span className="font-bold text-sm block mb-1">x (Measured)</span>
                         <span className="text-xs opacity-80">e.g. Current Temp</span>
                      </div>
                      <div className="bg-amber-900/50 border border-amber-500/50 p-4 rounded-xl text-amber-200 shadow-lg">
                         <span className="font-bold text-sm block mb-1">u (Controls)</span>
                         <span className="text-xs opacity-80">e.g. Shaft Speed</span>
                      </div>
                   </div>

                   {/* Uncertain Data */}
                   <div className="flex flex-col items-center w-1/3">
                      <div className="bg-rose-600 text-white p-4 rounded-xl text-sm font-bold w-full shadow-lg mb-4 border border-rose-500">
                         θ (Uncertain Future)
                      </div>
                      <ArrowDown size={24} className="text-rose-500 mb-4"/>
                      <div className="flex gap-4 w-full">
                         <div className="bg-rose-400/20 text-rose-300 py-3 rounded-lg text-sm font-bold flex-1 border border-rose-400/50 shadow-inner">θ₁ (Half A)</div>
                         <div className="bg-rose-400/20 text-rose-300 py-3 rounded-lg text-sm font-bold flex-1 border border-rose-400/50 shadow-inner">θ₂ (Half B)</div>
                      </div>
                   </div>
                </div>
             </div>

             {/* STEP 2: LAYER 1 */}
             <div className="flex flex-col items-center w-full mb-12 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 shadow-lg">
                <span className="bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-slate-600 mb-6">2. Coupling Layer 1</span>
                
                <div className="flex justify-center gap-10 w-full">
                   {/* The Brain 1 */}
                   <div className="w-1/2 flex flex-col items-center relative">
                      <div className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-3">
                        <span className="bg-rose-500/20 border border-rose-500/50 text-rose-300 px-3 py-1.5 rounded-lg shadow-sm">θ₁</span> <span className="text-slate-500">+</span> 
                        <span className="bg-blue-500/20 border border-blue-500/50 text-blue-300 px-3 py-1.5 rounded-lg shadow-sm">x</span> <span className="text-slate-500">+</span> 
                        <span className="bg-amber-500/20 border border-amber-500/50 text-amber-300 px-3 py-1.5 rounded-lg shadow-sm">u</span>
                      </div>
                      <ArrowDown size={20} className="text-slate-500 mb-3"/>
                      <div className="bg-slate-700 border-2 border-indigo-500 p-5 rounded-xl flex flex-col items-center shadow-xl w-full transform transition-transform">
                         <Cpu size={24} className="text-indigo-400 mb-2"/>
                         <span className="text-sm text-white font-bold tracking-wide">Residual MLP 1</span>
                      </div>
                      <ArrowDown size={20} className="text-slate-500 mt-3 mb-3"/>
                      <div className="flex gap-4">
                         <span className="bg-indigo-500 text-white font-bold px-4 py-1.5 rounded-lg text-sm shadow-md">t₁</span>
                         <span className="bg-teal-500 text-white font-bold px-4 py-1.5 rounded-lg text-sm shadow-md">s₁</span>
                      </div>
                   </div>

                   {/* The Muscle 1 */}
                   <div className="w-1/3 flex flex-col items-center">
                      <div className="text-sm font-bold text-rose-300 mb-4 bg-rose-500/20 border border-rose-500/50 px-6 py-1.5 rounded-lg shadow-sm">θ₂</div>
                      <ArrowDown size={20} className="text-rose-500 mb-3"/>
                      <div className="bg-slate-700 border-2 border-rose-500 p-5 rounded-xl flex flex-col items-center shadow-xl w-full transform transition-transform">
                         <span className="text-sm text-white font-bold mb-2">Affine Math</span>
                         <code className="text-xs text-rose-200 bg-slate-900 px-2 py-1 rounded">θ₂ ⊙ exp(s₁) + t₁</code>
                      </div>
                      <ArrowDown size={20} className="text-rose-500 mt-3 mb-3"/>
                      <span className="bg-rose-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md">Y₂</span>
                   </div>
                </div>
             </div>

             {/* STEP 3: THE SWAP */}
             <div className="flex flex-col items-center w-full mb-12">
                <div className="flex items-center gap-6 bg-indigo-900/20 px-8 py-5 rounded-2xl border border-indigo-500/30 shadow-lg">
                   <span className="bg-rose-500 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md">Y₂</span>
                   <div className="flex flex-col items-center px-4">
                      <span className="text-xs text-indigo-300 font-bold mb-2 tracking-wider bg-indigo-950 px-2 py-1 rounded">torch.flip()</span>
                      <ArrowRightLeft size={28} className="text-indigo-400"/>
                   </div>
                   <span className="bg-rose-400/20 border border-rose-500/50 text-rose-300 px-5 py-2 rounded-lg text-sm font-bold shadow-md">θ₁</span>
                </div>
                <p className="text-xs text-slate-400 mt-4 font-sans italic">The arrays cross over! Y₂ becomes the new Half A.</p>
             </div>

             {/* STEP 4: LAYER 2 */}
             <div className="flex flex-col items-center w-full mb-12 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 shadow-lg">
                <span className="bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-slate-600 mb-6">3. Coupling Layer 2</span>
                
                <div className="flex justify-center gap-10 w-full">
                   {/* The Brain 2 */}
                   <div className="w-1/2 flex flex-col items-center relative">
                      <div className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-3">
                        <span className="bg-rose-500 border border-rose-600 text-white px-3 py-1.5 rounded-lg shadow-sm">Y₂</span> <span className="text-slate-500">+</span> 
                        <span className="bg-blue-500/20 border border-blue-500/50 text-blue-300 px-3 py-1.5 rounded-lg shadow-sm">x</span> <span className="text-slate-500">+</span> 
                        <span className="bg-amber-500/20 border border-amber-500/50 text-amber-300 px-3 py-1.5 rounded-lg shadow-sm">u</span>
                      </div>
                      <ArrowDown size={20} className="text-slate-500 mb-3"/>
                      <div className="bg-slate-700 border-2 border-indigo-500 p-5 rounded-xl flex flex-col items-center shadow-xl w-full transform transition-transform">
                         <Cpu size={24} className="text-indigo-400 mb-2"/>
                         <span className="text-sm text-white font-bold tracking-wide">Residual MLP 2</span>
                      </div>
                      <ArrowDown size={20} className="text-slate-500 mt-3 mb-3"/>
                      <div className="flex gap-4">
                         <span className="bg-indigo-500 text-white font-bold px-4 py-1.5 rounded-lg text-sm shadow-md">t₂</span>
                         <span className="bg-teal-500 text-white font-bold px-4 py-1.5 rounded-lg text-sm shadow-md">s₂</span>
                      </div>
                   </div>

                   {/* The Muscle 2 */}
                   <div className="w-1/3 flex flex-col items-center">
                      <div className="text-sm font-bold text-rose-300 mb-4 bg-rose-400/20 border border-rose-500/50 px-6 py-1.5 rounded-lg shadow-sm">θ₁</div>
                      <ArrowDown size={20} className="text-rose-500 mb-3"/>
                      <div className="bg-slate-700 border-2 border-rose-500 p-5 rounded-xl flex flex-col items-center shadow-xl w-full transform transition-transform">
                         <span className="text-sm text-white font-bold mb-2">Affine Math</span>
                         <code className="text-xs text-rose-200 bg-slate-900 px-2 py-1 rounded">θ₁ ⊙ exp(s₂) + t₂</code>
                      </div>
                      <ArrowDown size={20} className="text-rose-500 mt-3 mb-3"/>
                      <span className="bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md">Z₂</span>
                   </div>
                </div>
             </div>

             {/* STEP 5: FINAL OUTPUT & LOSS */}
             <div className="flex flex-col items-center w-full pb-4">
                <span className="bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-slate-600 mb-6 shadow-md">4. Final Output & Loss</span>
                
                <div className="flex items-center gap-4 mb-6">
                   <span className="text-white text-sm font-bold">Z_final = </span>
                   <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm flex gap-3 border-2 border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.5)] font-bold">
                      <span>Y₂</span>
                      <span className="border-l-2 border-indigo-400 pl-3">Z₂</span>
                   </div>
                </div>

                <div className="bg-slate-800/80 w-full p-6 rounded-2xl border border-slate-600 shadow-2xl">
                   <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-400 font-sans font-medium">Blueprint Score:</span>
                         <code className="text-indigo-300 bg-indigo-950 px-3 py-1.5 rounded-lg border border-indigo-500/30">gaussian.log_prob(Z_final)</code>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-400 font-sans font-medium">Volume Penalty:</span>
                         <code className="text-teal-300 bg-teal-950 px-3 py-1.5 rounded-lg border border-teal-500/30">sum(s₁) + sum(s₂)</code>
                      </div>
                      <div className="border-t border-slate-600 my-2"></div>
                      <div className="flex justify-between items-center text-base font-bold">
                         <span className="text-rose-400 font-sans">Final Loss:</span>
                         <code className="text-white bg-rose-900/60 border border-rose-500 px-3 py-1.5 rounded-lg shadow-inner">-1 * (Score + Penalty)</code>
                      </div>
                   </div>
                </div>
                
                <div className="mt-6 bg-emerald-900/30 border border-emerald-500/50 px-6 py-3 rounded-xl text-emerald-300 text-sm font-bold flex items-center gap-2 shadow-lg font-sans">
                   <Zap size={18} className="text-emerald-400"/> loss.backward() updates MLP 1 and MLP 2 simultaneously!
                </div>
             </div>

          </div>
        </div>
      )
    },
    {
      title: "39. PyTorch UML Class Diagram",
      subtitle: "Object-oriented dependencies, inheritance, and composition.",
      content: (
        <div className="space-y-4 animate-fade-in w-full max-w-4xl mx-auto">
          <p className="text-gray-700 text-sm mb-2">
            To scale this for edge deployment, the system is strictly modular. The diagram below illustrates how our PyTorch components inherit from <code>nn.Module</code> and compose together using <strong>Aggregation/Composition</strong> (filled diamonds) and <strong>Inheritance</strong> (empty triangles).
          </p>

          <div className="bg-slate-900 p-4 md:p-6 rounded-2xl border border-slate-700 shadow-xl overflow-x-auto custom-scrollbar flex justify-center w-full">
             
             {/* Scaled Canvas to fit perfectly within the 4xl max-width */}
             <div className="relative w-[800px] h-[480px] shrink-0 font-mono text-slate-300 mx-auto">
                
                {/* --- SVG LINES & MARKERS --- */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                   <defs>
                      <marker id="inheritance" markerWidth="14" markerHeight="14" refX="14" refY="7" orient="auto">
                         <path d="M 0 0 L 14 7 L 0 14 Z" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5" />
                      </marker>
                      <marker id="composition" markerWidth="14" markerHeight="14" refX="0" refY="7" orient="auto">
                         <path d="M 0 7 L 7 0 L 14 7 L 7 14 Z" fill="#cbd5e1" stroke="#cbd5e1" strokeWidth="1" />
                      </marker>
                   </defs>

                   {/* INHERITANCE LINES (Pointing UP to nn.Module) */}
                   <path d="M 130 160 L 130 110 L 400 110 L 400 84" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#inheritance)" />
                   <path d="M 400 160 L 400 84" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#inheritance)" />
                   <path d="M 670 160 L 670 110 L 400 110 L 400 84" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#inheritance)" />

                   {/* COMPOSITION LINES */}
                   {/* Pipeline "HAS-A" CouplingLayer */}
                   <path d="M 250 280 L 280 280" fill="none" stroke="#cbd5e1" strokeWidth="1.5" markerStart="url(#composition)" />
                   {/* CouplingLayer "HAS-A" ResidualMLP */}
                   <path d="M 520 280 L 550 280" fill="none" stroke="#cbd5e1" strokeWidth="1.5" markerStart="url(#composition)" />
                </svg>

                {/* --- UML CLASS BOXES (HTML Overlays) --- */}

                {/* 1. Base PyTorch Module */}
                <div className="absolute top-[20px] left-[320px] w-[160px] bg-slate-800 border border-slate-500 rounded shadow-lg z-10 flex flex-col text-center">
                   <div className="bg-slate-700 py-1 border-b border-slate-500 rounded-t">
                      <span className="block text-[9px] text-slate-400">&lt;&lt;pytorch&gt;&gt;</span>
                      <strong className="text-white text-xs">nn.Module</strong>
                   </div>
                </div>

                {/* 2. PipelineConditionalFlow (The Wrapper) */}
                <div className="absolute top-[160px] left-[10px] w-[240px] bg-indigo-950/40 border border-indigo-500 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.2)] z-10 flex flex-col text-[10px]">
                   <div className="bg-indigo-900/80 py-2 border-b border-indigo-500 rounded-t-lg text-center">
                      <span className="block text-[9px] text-indigo-300">&lt;&lt;wrapper_class&gt;&gt;</span>
                      <strong className="text-white text-xs">PipelineConditionalFlow</strong>
                   </div>
                   <div className="p-3 border-b border-indigo-800/50 space-y-1">
                      <p className="text-indigo-200">+ dim_theta: <span className="text-slate-400">int</span></p>
                      <p className="text-indigo-200">+ blueprint_loc: <span className="text-slate-400">Tensor</span></p>
                      <p className="text-indigo-200">+ blueprint_cov: <span className="text-slate-400">Tensor</span></p>
                      <p className="text-indigo-200">+ layers: <span className="text-slate-400">nn.ModuleList</span></p>
                   </div>
                   <div className="p-3 space-y-1 text-slate-300">
                      <p>+ __init__(t, c, n_layers)</p>
                      <p>+ get_blueprint(): <span className="text-slate-400">Normal</span></p>
                      <p className="font-bold text-white">+ forward(θ, cond)</p>
                      <p className="font-bold text-white">+ compute_loss(θ, cond)</p>
                      <p>+ sample(num_samples, cond)</p>
                   </div>
                </div>

                {/* 3. ConditionalAffineCouplingLayer (The Muscle) */}
                <div className="absolute top-[160px] left-[280px] w-[240px] bg-rose-950/40 border border-rose-500 rounded-lg shadow-[0_0_15px_rgba(225,29,72,0.2)] z-10 flex flex-col text-[10px]">
                   <div className="bg-rose-900/80 py-2 border-b border-rose-500 rounded-t-lg text-center">
                      <span className="block text-[9px] text-rose-300">&lt;&lt;flow_layer&gt;&gt;</span>
                      <strong className="text-white text-xs truncate px-2 block">ConditionalAffineCouplingLayer</strong>
                   </div>
                   <div className="p-3 border-b border-rose-800/50 space-y-1">
                      <p className="text-rose-200">+ half_dim: <span className="text-slate-400">int</span></p>
                      <p className="text-rose-200">+ brain: <span className="text-slate-400">ResidualMLP</span></p>
                   </div>
                   <div className="p-3 space-y-1 text-slate-300">
                      <p>+ __init__(t, c, hidden)</p>
                      <p className="font-bold text-white">+ forward(θ, cond)</p>
                      <p className="font-bold text-white">+ inverse(z, cond)</p>
                   </div>
                </div>

                {/* 4. ResidualMLP (The Brain) */}
                <div className="absolute top-[160px] left-[550px] w-[240px] bg-teal-950/40 border border-teal-500 rounded-lg shadow-[0_0_15px_rgba(20,184,166,0.2)] z-10 flex flex-col text-[10px]">
                   <div className="bg-teal-900/80 py-2 border-b border-teal-500 rounded-t-lg text-center">
                      <span className="block text-[9px] text-teal-300">&lt;&lt;neural_network&gt;&gt;</span>
                      <strong className="text-white text-xs">ResidualMLP</strong>
                   </div>
                   <div className="p-3 border-b border-teal-800/50 space-y-1">
                      <p className="text-teal-200">+ init_layer: <span className="text-slate-400">nn.Linear</span></p>
                      <p className="text-teal-200">+ blocks: <span className="text-slate-400">nn.ModuleList</span></p>
                      <p className="text-teal-200">+ act: <span className="text-slate-400">nn.GELU</span></p>
                      <p className="text-teal-200">+ final_layer: <span className="text-slate-400">nn.Linear</span></p>
                   </div>
                   <div className="p-3 space-y-1 text-slate-300">
                      <p>+ __init__(in, hid, out)</p>
                      <p className="font-bold text-white">+ forward(x)</p>
                   </div>
                </div>

                {/* --- ANNOTATIONS --- */}
                <div className="absolute top-[80px] left-[150px] text-[10px] text-slate-400 font-sans italic">Inherits from (Is-A)</div>
                
                <div className="absolute top-[285px] left-[255px] text-[9px] text-indigo-300 font-sans font-bold">1</div>
                <div className="absolute top-[285px] left-[270px] text-[9px] text-indigo-300 font-sans font-bold">*</div>
                <div className="absolute top-[260px] left-[245px] text-[9px] text-slate-400 font-sans italic text-center w-10">Aggreg.<br/>(Has-A)</div>

                <div className="absolute top-[285px] left-[525px] text-[9px] text-rose-300 font-sans font-bold">1</div>
                <div className="absolute top-[285px] left-[540px] text-[9px] text-rose-300 font-sans font-bold">1</div>
                <div className="absolute top-[260px] left-[515px] text-[9px] text-slate-400 font-sans italic text-center w-10">Compos.<br/>(Owns-A)</div>

             </div>
          </div>
          
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded text-xs text-indigo-900 shadow-sm mt-2 w-full mx-auto">
            <strong>Reading the UML:</strong> The outer Pipeline Flow manages a list of Coupling Layers. Each Coupling Layer instantiates exactly one ResidualMLP as its "Brain". Because they all inherit from <code>nn.Module</code>, calling <code>.parameters()</code> on the outer Wrapper automatically recursively finds the weights of every single MLP!
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans flex justify-center items-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Network size={120} />
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <Cpu className="text-indigo-400" />
              Normalizing Flows: Architecture & Implementation
            </h1>
            <p className="text-slate-300 text-sm">Visualizing stochastic optimal control, math intuition, and PyTorch concepts.</p>
          </div>
          
          {/* Progress Bar (Condensed for many slides) */}
          <div className="flex gap-1 mt-6">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${idx <= step ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-slate-700'}`}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 min-h-[550px] flex flex-col">
          <div className="mb-6">
            <div className="inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-indigo-100 shadow-sm">
              Slide {step + 1} of {steps.length}
            </div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">{steps[step].title}</h2>
            <h3 className="text-md text-indigo-500 font-medium mt-2">{steps[step].subtitle}</h3>
          </div>
          
          <div className="animate-fade-in flex-grow flex flex-col justify-center">
            {steps[step].content}
          </div>
        </div>

        {/* Footer / Navigation */}
        <div className="bg-slate-50 border-t border-slate-200 p-5 flex justify-between items-center">
          <button 
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all ${step === 0 ? 'text-slate-400 bg-slate-100 cursor-not-allowed' : 'text-slate-700 bg-white hover:bg-slate-200 hover:shadow shadow-sm border border-slate-200 active:scale-95'}`}
          >
            <ArrowLeft size={18} /> Previous
          </button>
          
          <button 
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            disabled={step === steps.length - 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm ${step === steps.length - 1 ? 'text-slate-400 bg-slate-100 cursor-not-allowed border border-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md active:scale-95'}`}
          >
            Next <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}