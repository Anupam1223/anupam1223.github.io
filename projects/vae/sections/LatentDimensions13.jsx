import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Sliders, 
  BrainCircuit, Database, Layers,
  Maximize2, Minimize2, CheckCircle, Target,
  Image as ImageIcon, Fingerprint, GripHorizontal, LayoutGrid,
  ArrowRight
} from 'lucide-react';

// --- SLIDE 1: The "Knobs" Analogy ---
const WhatIsADimensionSlide = () => {
  const [activeSliders, setActiveSliders] = useState(2);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">What is a "Dimension"?</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Think of <code>latent_dims</code> as the number of <strong>control knobs</strong> your Decoder has available to draw an image. Each dimension represents a different learned feature.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* LEFT: The Control Board */}
        <div className="flex-[1.2] bg-slate-900 rounded-2xl shadow-xl border border-slate-700 p-8 flex flex-col relative overflow-hidden text-white">
           <h3 className="font-bold text-slate-300 mb-6 text-sm uppercase tracking-widest text-center border-b border-slate-700 pb-2 w-full">
             The Decoder's Control Board
           </h3>

           <div className="flex justify-center gap-4 mb-8">
             <button onClick={() => setActiveSliders(2)} className={`px-4 py-2 rounded font-bold text-xs transition-colors ${activeSliders === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>latent_dims = 2</button>
             <button onClick={() => setActiveSliders(10)} className={`px-4 py-2 rounded font-bold text-xs transition-colors ${activeSliders === 10 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>latent_dims = 10</button>
           </div>

           <div className="flex-grow flex flex-wrap content-start justify-center gap-4">
              <AnimatePresence>
                {Array.from({length: 10}).map((_, i) => {
                  if (i >= activeSliders) return null;
                  
                  // Fake feature names for intuition
                  const features = ["Slant", "Thickness", "Loop Size", "Width", "Height", "Curl", "Sharpness", "Spacing", "Angle", "Density"];
                  
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="bg-slate-800 p-3 rounded-lg border border-slate-600 flex flex-col items-center gap-2 w-24"
                    >
                      <span className="text-[10px] text-slate-400 font-bold uppercase truncate w-full text-center">{features[i]}</span>
                      <div className="w-2 h-16 bg-slate-900 rounded-full relative shadow-inner">
                        <div className="absolute w-4 h-2 bg-indigo-400 rounded left-1/2 transform -translate-x-1/2" style={{ top: `${Math.random() * 80 + 10}%`}}></div>
                      </div>
                      <span className="font-mono text-[10px] text-indigo-300">z_{i+1}</span>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
           </div>
        </div>

        {/* RIGHT: Explanation */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h4 className="font-bold text-indigo-600 text-lg mb-2 flex items-center gap-2"><Sliders className="w-5 h-5"/> Features = Dimensions</h4>
             <p className="text-sm text-slate-700 leading-relaxed mb-4">
               If <code>latent_dims = 2</code>, the Decoder only gets 2 numbers to figure out what image to draw. It might use one for "Slant" and one for "Thickness". That's not enough information to draw a highly detailed face or complex digit!
             </p>
             <p className="text-sm text-slate-700 leading-relaxed">
               If <code>latent_dims = 20</code>, the Decoder gets 20 specific dials. It has enough capacity to control lighting, rotation, specific shapes, and intricate textures independently.
             </p>
           </div>
           
           <div className="bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-200">
             <h4 className="font-bold text-emerald-800 text-sm mb-2 flex items-center gap-2"><Target className="w-5 h-5"/> The Vector <em>Z</em></h4>
             <p className="text-sm text-slate-700 leading-relaxed">
               When we sample from the latent space, we are pulling a <strong>Vector</strong> (a list of numbers), not just a single number.
             </p>
             <div className="mt-3 bg-white border border-emerald-200 p-3 rounded font-mono text-xs text-slate-600 shadow-inner">
               z = [ {Array.from({length: activeSliders}).map((_, i) => "0."+Math.floor(Math.random()*9)).join(", ")} ]
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 2: Arrays of Means and Variances ---
const ArraysOfMeansSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">It's Not Just One Bell Curve!</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          This is the crucial realization: If <code>latent_dims = 20</code>, the Encoder outputs an <strong>Array of 20 Means</strong> and an <strong>Array of 20 Variances</strong>.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* The Architecture Visualization */}
        <div className="flex-[1.5] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-6 flex flex-col relative overflow-hidden">
           
           <div className="flex items-center justify-between w-full h-full relative">
              
              {/* Input */}
              <div className="flex flex-col items-center z-10 w-24 shrink-0">
                 <div className="w-16 h-16 bg-slate-700 border-2 border-slate-500 rounded-lg flex items-center justify-center">
                   <ImageIcon className="text-slate-400 w-8 h-8" />
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">1 Image</span>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-500 shrink-0" />

              {/* Encoder */}
              <div className="flex flex-col items-center z-10 w-32 shrink-0">
                 <div className="w-full bg-blue-900/50 border-2 border-blue-500 rounded-xl p-4 flex flex-col items-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <BrainCircuit className="text-blue-400 w-8 h-8 mb-2" />
                    <span className="text-xs font-bold text-blue-300 text-center">Encoder</span>
                 </div>
              </div>

              {/* Split Paths */}
              <div className="flex flex-col gap-12 relative">
                 <ArrowRight className="absolute -left-6 top-[20%] text-slate-500 w-4 h-4 transform -rotate-45" />
                 <ArrowRight className="absolute -left-6 bottom-[20%] text-slate-500 w-4 h-4 transform rotate-45" />
                 
                 {/* Array of Means */}
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-blue-400 mb-1 uppercase tracking-widest">Vector of Means (μ)</span>
                    <div className="bg-slate-900 border border-blue-500/50 p-2 rounded-lg flex flex-col gap-1 shadow-inner">
                      <div className="font-mono text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded">μ_1 = 0.5</div>
                      <div className="font-mono text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded">μ_2 = -1.2</div>
                      <div className="font-mono text-[10px] text-slate-500 px-2 py-0.5 text-center">...</div>
                      <div className="font-mono text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded">μ_20 = 0.8</div>
                    </div>
                 </div>

                 {/* Array of Vars */}
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-emerald-400 mb-1 uppercase tracking-widest">Vector of Variances (σ²)</span>
                    <div className="bg-slate-900 border border-emerald-500/50 p-2 rounded-lg flex flex-col gap-1 shadow-inner">
                      <div className="font-mono text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded">σ²_1 = 0.1</div>
                      <div className="font-mono text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded">σ²_2 = 0.9</div>
                      <div className="font-mono text-[10px] text-slate-500 px-2 py-0.5 text-center">...</div>
                      <div className="font-mono text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded">σ²_20 = 1.2</div>
                    </div>
                 </div>
              </div>

              {/* Reparameterization */}
              <div className="flex flex-col items-center relative z-10 w-40 shrink-0 px-2">
                 <span className="text-[10px] font-bold text-purple-400 mb-1 uppercase tracking-widest text-center">Reparameterization<br/>(Samples 20 times!)</span>
                 <div className="w-full bg-purple-900/30 border-2 border-purple-500 border-dashed rounded-xl p-3 flex flex-col items-center shadow-inner">
                    <div className="font-mono text-[10px] text-slate-300 bg-slate-900 px-2 py-1 rounded w-full text-center border border-slate-700">
                      z_1 = μ_1 + σ_1·ε_1<br/>
                      z_2 = μ_2 + σ_2·ε_2<br/>
                      ...<br/>
                      z_20 = μ_20 + σ_20·ε_20
                    </div>
                 </div>
              </div>

           </div>
        </div>

        {/* Text Explanations */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           
           <div className="bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700">
             <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2"><GripHorizontal className="w-5 h-5"/> Dense Layer Size</h4>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
               In PyTorch/TensorFlow, this literally means the last layers of your Encoder look like this:
             </p>
             <div className="font-mono text-xs bg-black p-3 rounded border border-slate-600 text-emerald-300">
               self.fc_mu = Linear(128, <strong>20</strong>)<br/>
               self.fc_var = Linear(128, <strong>20</strong>)
             </div>
           </div>

           <div className="bg-indigo-950/30 border border-indigo-500/30 p-6 rounded-2xl shadow-sm flex-grow">
             <h4 className="font-bold text-indigo-400 mb-2 flex items-center gap-2"><Layers className="w-5 h-5"/> 20 Independent Bell Curves</h4>
             <p className="text-sm text-slate-300 leading-relaxed">
               Because <code>latent_dims = 20</code>, we are modeling 20 completely independent features. 
               The Reparameterization trick generates <strong>20 separate random noise values (ε)</strong>, and uses the 20 means and 20 variances to create a final Latent Vector <span className="font-mono text-indigo-300">Z</span> containing 20 distinct numbers.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 3: The Trade-off (2D vs 20D vs 100D) ---
const DimensionalityTradeoffSlide = () => {
  const [dims, setDims] = useState(20);

  const getVisuals = () => {
    if (dims <= 3) {
      return {
        title: "Heavy Bottleneck (Highly Compressed)",
        desc: "The pipe is too narrow. The Encoder is forced to compress all complexity into just 2 numbers. It's impossible to store enough detail.",
        pros: "Very easy to visualize! We can plot a 2D grid and physically see what the VAE learned.",
        cons: "Reconstructions will be incredibly blurry. It loses details like hair texture or precise digit loops.",
        imgBlur: "6px",
        pipeWidth: "20px"
      }
    } else if (dims <= 30) {
      return {
        title: "The Sweet Spot",
        desc: "A great balance for simple datasets like MNIST or basic faces. 20 numbers is plenty to store digit slant, thickness, loop size, etc.",
        pros: "Excellent reconstructions without wasting computational power or severe overfitting.",
        cons: "We can no longer visualize it simply (Humans can't see in 20D!). We have to use techniques like PCA or t-SNE to plot it.",
        imgBlur: "1px",
        pipeWidth: "80px"
      }
    } else {
      return {
        title: "Over-Parameterized (Too Wide)",
        desc: "The pipe is massive. The Encoder has 100+ numbers to use.",
        pros: "Reconstructions can be perfectly sharp, capturing every micro-detail.",
        cons: "High risk of 'ignoring' dimensions (Posterior Collapse). Many of the 100 knobs will just become useless noise. Harder to train the KL penalty effectively.",
        imgBlur: "0px",
        pipeWidth: "160px"
      }
    }
  };

  const visual = getVisuals();

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">Choosing `latent_dims`: The Trade-off</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Why did they choose <code>20</code> for MNIST? Why not 2? Why not 500? It's all about the size of the <strong>Information Bottleneck</strong>.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* LEFT: Simulator */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col relative overflow-hidden">
           <h3 className="font-bold text-slate-700 mb-6 text-sm uppercase tracking-widest text-center border-b pb-2">The Information Bottleneck</h3>

           <div className="flex-grow flex items-center justify-center relative w-full gap-2">
              <div className="w-20 h-24 bg-blue-100 border-2 border-blue-400 rounded-lg flex items-center justify-center font-bold text-blue-800 text-xs text-center shadow-sm z-10">Encoder</div>
              
              {/* The dynamic pipe */}
              <div className="flex-1 h-32 flex items-center justify-center relative">
                 <motion.div 
                   animate={{ height: visual.pipeWidth }} 
                   transition={{ type: "spring", stiffness: 200, damping: 20 }}
                   className="w-full bg-purple-100 border-y-4 border-purple-500 relative flex items-center justify-center overflow-hidden"
                 >
                   <span className="font-mono font-bold text-purple-800 z-10 bg-white/80 px-2 rounded text-xs">{dims} Dimensions</span>
                   {/* Data flow animation */}
                   <motion.div animate={{ left: ['-10%', '110%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute w-8 h-full bg-white/50 blur-sm transform skew-x-12"></motion.div>
                 </motion.div>
              </div>

              <div className="w-20 h-24 bg-emerald-100 border-2 border-emerald-400 rounded-lg flex items-center justify-center font-bold text-emerald-800 text-xs text-center shadow-sm z-10">Decoder</div>
           </div>

           {/* Results Preview */}
           <div className="flex flex-col items-center mt-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Resulting Generation Quality</span>
              <div className="w-24 h-24 bg-slate-200 rounded-lg border-2 border-slate-300 overflow-hidden shadow-inner">
                 <img src="https://picsum.photos/id/1025/100/100" className="w-full h-full object-cover grayscale transition-all duration-500" style={{ filter: `blur(${visual.imgBlur})` }} />
              </div>
           </div>

           {/* Slider */}
           <div className="mt-8 w-full max-w-sm mx-auto bg-slate-100 p-4 rounded-xl border border-slate-200">
             <div className="flex justify-between text-xs font-bold text-slate-600 mb-2 font-mono">
               <span>2</span>
               <span className="text-indigo-600 text-lg">{dims}</span>
               <span>128</span>
             </div>
             <input type="range" min="2" max="128" value={dims} onChange={(e) => setDims(parseInt(e.target.value))} className="w-full accent-indigo-500" />
           </div>
        </div>

        {/* RIGHT: Analysis */}
        <div className="flex-[1.2] flex flex-col gap-4">
           
           <div className="bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700 text-white">
             <h4 className="font-bold text-indigo-400 text-xl mb-2">{visual.title}</h4>
             <p className="text-sm text-slate-300 leading-relaxed mb-6">{visual.desc}</p>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Advantage</span>
                  <span className="text-xs text-slate-300 leading-relaxed">{visual.pros}</span>
                </div>
                <div className="bg-rose-950/30 border border-rose-500/30 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block mb-1">Disadvantage</span>
                  <span className="text-xs text-slate-300 leading-relaxed">{visual.cons}</span>
                </div>
             </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-grow flex flex-col justify-center">
             <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2"><LayoutGrid className="w-5 h-5 text-blue-500"/> Why 20 for MNIST?</h4>
             <p className="text-sm text-slate-600 leading-relaxed">
               MNIST digits (28x28 pixels) are relatively simple. They don't have color, background, or complex lighting. 20 variables are more than enough to capture the digit type (0-9), thickness, slant, and specific loop variations without causing severe posterior collapse.
             </p>
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
    WhatIsADimensionSlide,
    ArraysOfMeansSlide,
    DimensionalityTradeoffSlide
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