import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Network, BrainCircuit, 
  Layers, Box, Type, Binary, Image as ImageIcon, 
  ArrowRight, ArrowDown, Split, Zap, AlertTriangle, 
  Activity, Maximize2, Minimize2, CheckCircle, Database,
  Cpu, Crosshair, Scale, Calculator, Search, Sigma, 
  LineChart, EyeOff, Target
} from 'lucide-react';

// --- SLIDE 1: The Encoder Network ---
const EncoderDesignSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The Encoder: Parameterizing the Posterior</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          The Encoder network's job is not to output a single vector, but to output the <strong>parameters of a probability distribution</strong>. Let's translate the math into neural network layers.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* LEFT: Visual Architecture */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col items-center relative overflow-hidden">
           <h3 className="font-bold text-teal-800 mb-6 text-sm uppercase tracking-widest border-b border-teal-100 pb-2 w-full text-center">
             Encoder Architecture <span className="font-mono bg-teal-50 px-2 py-0.5 rounded ml-2">q_φ(z|x)</span>
           </h3>

           <div className="flex-grow flex flex-col items-center justify-center w-full gap-4 relative">
              
              {/* Input */}
              <div className="flex flex-col items-center z-10 w-32">
                 <span className="text-xs font-bold text-slate-500 mb-2 uppercase">Input Data (x)</span>
                 <div className="w-16 h-16 bg-slate-100 border-2 border-slate-300 rounded-lg shadow-inner flex items-center justify-center">
                   <ImageIcon className="text-slate-400 w-8 h-8" />
                 </div>
              </div>

              <ArrowDown className="w-5 h-5 text-slate-300" />

              {/* Hidden Layers */}
              <div className="flex flex-col items-center z-10 w-48">
                 <span className="text-xs font-bold text-teal-600 mb-2 uppercase">Hidden Layers (φ)</span>
                 <div className="w-full bg-teal-600 text-white rounded-xl shadow-md flex flex-col items-center justify-center border-2 border-teal-500 p-3">
                   <span className="font-bold text-sm mb-1">MLP / CNN / RNN</span>
                   <span className="text-[10px] font-mono opacity-80">Activation: ReLU / ELU</span>
                 </div>
                 <span className="text-[10px] text-slate-500 mt-2 text-center">Gradually reduces dimensionality (Funnel shape)</span>
              </div>

              {/* The Split */}
              <div className="w-full h-8 relative flex items-center justify-center">
                 <div className="absolute w-1 h-full bg-slate-300"></div>
                 <div className="absolute w-32 h-1 bg-slate-300 bottom-0"></div>
                 <div className="absolute left-[calc(50%-4rem)] top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-400"></div>
                 <div className="absolute right-[calc(50%-4rem)] top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-400"></div>
              </div>

              {/* Output Heads */}
              <div className="flex gap-8 mt-2 z-10 w-full justify-center">
                 
                 {/* Mean Head */}
                 <div className="flex flex-col items-center w-28">
                    <div className="w-full bg-blue-50 border-2 border-blue-400 p-2 rounded-lg shadow-sm flex flex-col items-center">
                      <span className="text-[10px] font-bold text-blue-800 uppercase text-center mb-1">Dense Layer</span>
                      <span className="text-[9px] font-mono text-blue-600 text-center bg-white px-1 border border-blue-200 w-full">Linear Activ.</span>
                    </div>
                    <span className="mt-2 font-mono font-bold text-blue-600 text-lg">μ_z</span>
                 </div>

                 {/* Variance Head */}
                 <div className="flex flex-col items-center w-28">
                    <div className="w-full bg-emerald-50 border-2 border-emerald-400 p-2 rounded-lg shadow-sm flex flex-col items-center">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase text-center mb-1">Dense Layer</span>
                      <span className="text-[9px] font-mono text-emerald-600 text-center bg-white px-1 border border-emerald-200 w-full">Linear Activ.</span>
                    </div>
                    <span className="mt-2 font-mono font-bold text-emerald-600 text-lg">log(σ²_z)</span>
                 </div>

              </div>
           </div>
        </div>

        {/* RIGHT: Explanations */}
        <div className="flex-1 flex flex-col gap-4">
           <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 text-white">
             <h4 className="font-bold text-teal-400 mb-2 flex items-center gap-2"><Layers className="w-5 h-5"/> Architectural Choices</h4>
             <ul className="text-sm text-slate-300 space-y-3">
               <li><strong className="text-white">MLPs:</strong> Good for flattened data (tabular or simple MNIST).</li>
               <li><strong className="text-white">CNNs:</strong> Standard for images. Uses stacked convolutions to extract spatial features.</li>
               <li><strong className="text-white">RNNs / Transformers:</strong> Used for sequential data like text or time series.</li>
             </ul>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-grow flex flex-col gap-4">
             <div>
               <h4 className="font-bold text-slate-800 text-sm mb-1">The "Two-Headed" Output</h4>
               <p className="text-xs text-slate-600 leading-relaxed">
                 The final hidden layer splits into two separate <strong>Linear (Dense) layers</strong>. One outputs the means (<span className="font-mono text-blue-600 font-bold">μ</span>), the other outputs log-variances (<span className="font-mono text-emerald-600 font-bold">log σ²</span>). <strong>Linear activation is used because these parameters can mathematically be any real number (negative or positive).</strong> If we used a Sigmoid here, we could never predict a mean below 0 or above 1!
               </p>
             </div>
             
             <div className="mt-auto bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg">
               <h4 className="font-bold text-amber-900 text-xs mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Warning: Batch Normalization</h4>
               <p className="text-[10px] text-amber-800 leading-relaxed">
                 Using Batch Norm (BN) requires careful examination in VAEs. It introduces dependencies between samples in a batch, which can interfere with the instance-wise nature of the KL Divergence calculation.
               </p>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 2: The Decoder & Data Likelihood ---
const DecoderLikelihoodSlide = () => {
  const [dataType, setDataType] = useState('continuous');

  const getContent = () => {
    switch(dataType) {
      case 'continuous':
        return {
          title: "Gaussian Likelihood (Unbounded)",
          desc: "For continuous data with no strict minimum or maximum (e.g., temperatures, raw stock prices).",
          math: "p_θ(x|z) = N(x | μ_x(z), σ²_x(z))",
          domain: "[-∞, ∞]",
          activation: "Linear",
          actReason: "Linear layers output (-∞, ∞), perfectly matching unbounded data.",
          loss: "Mean Squared Error (MSE)",
          lossColor: "text-blue-600",
          bgLoss: "bg-blue-50 border-blue-200",
          nodeColor: "bg-blue-600",
          icon: <Activity className="w-12 h-12 text-blue-500" />
        };
      case 'continuous_bounded':
        return {
          title: "Gaussian Likelihood (Bounded)",
          desc: "For continuous data normalized to a specific range (e.g., pixel intensities scaled to [-1, 1]).",
          math: "p_θ(x|z) = N(x | μ_x(z), σ²_x(z))",
          domain: "[-1, 1]",
          activation: "Tanh",
          actReason: "Tanh perfectly squishes any network output into the strict [-1, 1] range.",
          loss: "Mean Squared Error (MSE)",
          lossColor: "text-indigo-600",
          bgLoss: "bg-indigo-50 border-indigo-200",
          nodeColor: "bg-indigo-600",
          icon: <ImageIcon className="w-12 h-12 text-indigo-500" />
        };
      case 'binary':
        return {
          title: "Bernoulli Likelihood",
          desc: "For strictly binary data (like Black & White thresholded MNIST pixels).",
          math: "p_i(z) ∈ [0, 1] for each feature i",
          domain: "{0, 1}",
          activation: "Sigmoid",
          actReason: "Sigmoid outputs a probability (0.0 to 1.0) predicting the chance the pixel is '1'.",
          loss: "Binary Cross-Entropy (BCE)",
          lossColor: "text-rose-600",
          bgLoss: "bg-rose-50 border-rose-200",
          nodeColor: "bg-rose-600",
          icon: <Binary className="w-12 h-12 text-rose-500" />
        };
      case 'categorical':
        return {
          title: "Categorical Likelihood",
          desc: "For discrete data with K distinct categories (e.g., text tokens, or a 256-color palette).",
          math: "Softmax probabilities over K classes",
          domain: "{Class 1, ..., Class K}",
          activation: "Softmax",
          actReason: "Softmax outputs K probabilities that sum exactly to 100%.",
          loss: "Categorical Cross-Entropy",
          lossColor: "text-purple-600",
          bgLoss: "bg-purple-50 border-purple-200",
          nodeColor: "bg-purple-600",
          icon: <Type className="w-12 h-12 text-purple-500" />
        };
      default:
        return {};
    }
  };

  const content = getContent();

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">The Output Layer: The Most Critical Design Choice</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          The Decoder maps the latent sample back to the data space. <strong>The final activation function MUST match the physical reality of your data</strong>, which mathematically defines your Reconstruction Loss!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* LEFT: Interactive Switchboard */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col items-center">
           <h3 className="font-bold text-slate-300 mb-6 text-sm uppercase tracking-widest border-b border-slate-600 pb-2 w-full text-center">
             Select True Data Domain
           </h3>
           
           <div className="flex flex-col gap-3 w-full max-w-sm">
             <button onClick={() => setDataType('continuous')} className={`p-3 rounded-xl flex items-center gap-4 transition-all border-2 ${dataType === 'continuous' ? 'bg-blue-900/40 border-blue-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
               <Activity className={`w-5 h-5 ${dataType === 'continuous' ? 'text-blue-400' : 'text-slate-500'}`} />
               <div className="flex flex-col items-start">
                 <span className={`text-sm font-bold ${dataType === 'continuous' ? 'text-white' : 'text-slate-400'}`}>Continuous (Unbounded)</span>
                 <span className="text-[10px] text-slate-500 font-mono">Range: [-∞, ∞]</span>
               </div>
             </button>

             <button onClick={() => setDataType('continuous_bounded')} className={`p-3 rounded-xl flex items-center gap-4 transition-all border-2 ${dataType === 'continuous_bounded' ? 'bg-indigo-900/40 border-indigo-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
               <ImageIcon className={`w-5 h-5 ${dataType === 'continuous_bounded' ? 'text-indigo-400' : 'text-slate-500'}`} />
               <div className="flex flex-col items-start">
                 <span className={`text-sm font-bold ${dataType === 'continuous_bounded' ? 'text-white' : 'text-slate-400'}`}>Continuous (Normalized)</span>
                 <span className="text-[10px] text-slate-500 font-mono">Range: [-1, 1]</span>
               </div>
             </button>

             <button onClick={() => setDataType('binary')} className={`p-3 rounded-xl flex items-center gap-4 transition-all border-2 ${dataType === 'binary' ? 'bg-rose-900/40 border-rose-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
               <Binary className={`w-5 h-5 ${dataType === 'binary' ? 'text-rose-400' : 'text-slate-500'}`} />
               <div className="flex flex-col items-start">
                 <span className={`text-sm font-bold ${dataType === 'binary' ? 'text-white' : 'text-slate-400'}`}>Strictly Binary</span>
                 <span className="text-[10px] text-slate-500 font-mono">Set: &#123;0, 1&#125;</span>
               </div>
             </button>

             <button onClick={() => setDataType('categorical')} className={`p-3 rounded-xl flex items-center gap-4 transition-all border-2 ${dataType === 'categorical' ? 'bg-purple-900/40 border-purple-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
               <Type className={`w-5 h-5 ${dataType === 'categorical' ? 'text-purple-400' : 'text-slate-500'}`} />
               <div className="flex flex-col items-start">
                 <span className={`text-sm font-bold ${dataType === 'categorical' ? 'text-white' : 'text-slate-400'}`}>Categorical Classes</span>
                 <span className="text-[10px] text-slate-500 font-mono">Set: &#123;1, 2, ..., K&#125;</span>
               </div>
             </button>
           </div>
        </div>

        {/* RIGHT: Architecture Result */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col text-slate-800">
           
           <AnimatePresence mode="wait">
             <motion.div 
               key={dataType}
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
               className="flex flex-col h-full"
             >
                <div className="flex items-center gap-4 mb-4">
                  {content.icon}
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      {content.title} <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-200">Domain: {content.domain}</span>
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{content.desc}</p>
                  </div>
                </div>

                <div className="font-mono text-sm font-bold bg-slate-100 p-3 rounded-lg border border-slate-200 mb-8 text-center text-slate-700">
                  {content.math}
                </div>

                <div className="flex items-center justify-between w-full mb-6 mt-6 relative">
                   <div className="flex flex-col items-center z-10 w-24">
                     <div className="w-16 h-12 bg-slate-800 text-white rounded-lg flex items-center justify-center font-mono text-sm shadow-md">z</div>
                     <span className="text-[10px] font-bold text-slate-500 mt-2">Latent Sample</span>
                   </div>
                   
                   <div className="flex-1 border-t-4 border-slate-300 border-dashed relative">
                     <ArrowRight className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-slate-300 w-6 h-6" />
                   </div>

                   {/* REQUIRED ACTIVATION */}
                   <div className="flex flex-col items-center z-10 w-40 px-2">
                     <div className="w-full h-20 bg-slate-100 border-2 border-slate-400 rounded-lg flex flex-col items-center justify-center shadow-md relative">
                       <span className="absolute -top-3 bg-white px-2 text-[10px] font-bold uppercase text-slate-600">Final Layer</span>
                       <span className={`font-mono font-bold text-lg bg-white px-3 py-1 rounded shadow-sm border ${content.lossColor}`}>
                         {content.activation}
                       </span>
                     </div>
                   </div>

                   <div className="flex-1 border-t-4 border-slate-300 border-dashed relative">
                     <ArrowRight className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-slate-300 w-6 h-6" />
                   </div>

                   <div className="flex flex-col items-center z-10 w-24">
                     <div className={`w-16 h-12 rounded-lg flex items-center justify-center font-mono text-sm shadow-md font-bold text-white ${content.nodeColor}`}>
                       x_pred
                     </div>
                     <span className="text-[10px] font-bold text-slate-500 mt-2">Reconstruction</span>
                   </div>
                </div>

                <div className="text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <strong>Why {content.activation}?</strong> {content.actReason}
                </div>

                <div className={`mt-auto p-4 rounded-xl border-2 flex flex-col items-center text-center ${content.bgLoss}`}>
                   <span className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">Mathematical Result: The Reconstruction Loss</span>
                   <span className={`text-xl font-bold font-mono ${content.lossColor}`}>{content.loss}</span>
                </div>

             </motion.div>
           </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

// --- SLIDE 3: What is Continuous Data & Why Gaussian? ---
const ContinuousDataSlide = () => {
  const [pixelValue, setPixelValue] = useState(0.7);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">What is "Continuous Data"?</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          You asked: <em>"Why for continuous data, a Gaussian likelihood is common? First of all, what is continuous data?"</em> Let's look at a single pixel.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* BINARY DATA */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-6 flex flex-col items-center">
           <h3 className="font-bold text-rose-400 mb-2 text-xl flex items-center gap-2">
             <Binary className="w-6 h-6"/> Binary Data
           </h3>
           <p className="text-sm text-slate-400 mb-8 text-center h-10">Only two states exist. Like a coin flip.</p>
           
           <div className="flex gap-8 items-center justify-center mb-8">
             <div className="flex flex-col items-center">
               <div className="w-20 h-20 bg-black border border-slate-500 rounded-md shadow-lg"></div>
               <span className="font-mono text-rose-300 font-bold mt-2">State 0</span>
             </div>
             <span className="font-bold text-slate-500 italic">OR</span>
             <div className="flex flex-col items-center">
               <div className="w-20 h-20 bg-white border border-slate-500 rounded-md shadow-lg"></div>
               <span className="font-mono text-rose-300 font-bold mt-2">State 1</span>
             </div>
           </div>

           <div className="bg-rose-950/30 p-4 rounded-xl border border-rose-500/30 w-full mt-auto">
             <h4 className="font-bold text-rose-300 text-xs uppercase tracking-widest mb-1">Math Tool: Bernoulli Likelihood</h4>
             <p className="text-xs text-slate-300">We just predict a single percentage (e.g., "70% chance it is white"). We use <strong>Binary Cross-Entropy (BCE)</strong> loss.</p>
           </div>
        </div>

        {/* CONTINUOUS DATA */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border-2 border-blue-500 p-6 flex flex-col items-center relative overflow-hidden">
           <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">Most Images</div>
           
           <h3 className="font-bold text-blue-400 mb-2 text-xl flex items-center gap-2">
             <Activity className="w-6 h-6"/> Continuous Data
           </h3>
           <p className="text-sm text-slate-400 mb-8 text-center h-10">An infinite number of smooth states between min and max.</p>
           
           <div className="flex flex-col items-center w-full max-w-xs mb-8 relative">
             <div 
               className="w-32 h-32 rounded-xl shadow-lg border-2 border-slate-500 mb-4 transition-colors"
               style={{ backgroundColor: `rgb(${pixelValue*255}, ${pixelValue*255}, ${pixelValue*255})` }}
             ></div>
             
             <div className="w-full flex flex-col gap-2 relative">
                {/* The Gaussian Curve hovering over the slider */}
                <div className="absolute -top-12 left-0 w-full h-12 pointer-events-none flex justify-center">
                   <motion.svg className="w-full h-full overflow-visible">
                     <motion.path 
                       d="M -20 40 Q 20 40 25 10 T 50 10 Q 80 40 120 40" 
                       fill="none" stroke="#60a5fa" strokeWidth="2"
                       animate={{ x: `calc(${pixelValue * 100}% - 50px)` }}
                       transition={{ type: "spring", stiffness: 300, damping: 20 }}
                     />
                   </motion.svg>
                </div>
                
                <input type="range" min="0" max="1" step="0.01" value={pixelValue} onChange={(e) => setPixelValue(parseFloat(e.target.value))} className="w-full accent-blue-500" />
                <div className="flex justify-between font-mono text-xs text-slate-400">
                  <span>0.0 (Black)</span>
                  <span className="font-bold text-blue-400 bg-slate-900 px-2 rounded">Target: {pixelValue.toFixed(2)}</span>
                  <span>1.0 (White)</span>
                </div>
             </div>
           </div>

           <div className="bg-blue-950/30 p-4 rounded-xl border border-blue-500/30 w-full mt-auto">
             <h4 className="font-bold text-blue-300 text-xs uppercase tracking-widest mb-1">Math Tool: Gaussian Likelihood</h4>
             <p className="text-xs text-slate-300">Because the color is exactly 0.70, predicting 0.69 is "close". A Bell Curve perfectly represents "I'm aiming for 0.70, with a tiny bit of fuzziness/error."</p>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 4: The Activation Playground ---
const ActivationPlaygroundSlide = () => {
  const [rawOutput, setRawOutput] = useState(2.5);
  const [activeFunc, setActiveFunc] = useState('linear');

  const functions = {
    linear: { name: 'Linear', color: 'text-blue-500', stroke: '#3b82f6', calc: (x) => x, desc: "f(x) = x. It does absolutely nothing! It just passes the raw number through. Essential if your data target can be literally any number (-∞ to ∞)." },
    relu: { name: 'ReLU', color: 'text-orange-500', stroke: '#f97316', calc: (x) => Math.max(0, x), desc: "f(x) = max(0, x). It kills all negative numbers, but lets positive numbers grow to infinity. NOT linear! Used in hidden layers, but bad for outputs that need to predict negative values." },
    sigmoid: { name: 'Sigmoid', color: 'text-rose-500', stroke: '#f43f5e', calc: (x) => 1 / (1 + Math.exp(-x)), desc: "Squishes everything to exactly [0, 1]. Perfect for probabilities or Binary Data." },
    tanh: { name: 'Tanh', color: 'text-emerald-500', stroke: '#10b981', calc: (x) => Math.tanh(x), desc: "Squishes everything to exactly [-1, 1]. If you normalized your images so black is -1 and white is 1, you MUST use this! A linear layer might guess 5.2, which breaks images. Tanh safely squishes 5.2 down to 0.999." }
  };

  const currentVal = functions[activeFunc].calc(rawOutput);

  // Generate SVG path for the active function
  const generatePath = (fn) => {
    let path = "M 0,100";
    for (let x = -5; x <= 5; x += 0.1) {
      const y = fn(x);
      // Map x:[-5,5] to SVG x:[0,200], Map y:[-5,5] to SVG y:[200,0]
      const px = (x + 5) * 20; 
      const py = 100 - (y * 20); 
      path += ` L ${px},${py}`;
    }
    return path;
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">The Activation Playground</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          You asked: <em>"What are linear activations? Is ReLU a linear activation? Why use tanh?"</em> Let's see what these math functions actually do to the raw output of a Neural Network.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left: The Graph */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col items-center relative overflow-hidden">
           
           {/* Navigation Tabs */}
           <div className="flex gap-2 bg-slate-100 p-1 rounded-lg mb-8 border border-slate-200">
             {Object.keys(functions).map(key => (
               <button 
                 key={key} onClick={() => setActiveFunc(key)}
                 className={`px-4 py-2 rounded-md font-bold text-xs transition-colors ${activeFunc === key ? `bg-white shadow-sm border border-slate-200 ${functions[key].color}` : 'text-slate-500 hover:text-slate-700'}`}
               >
                 {functions[key].name}
               </button>
             ))}
           </div>

           {/* The SVG Graph */}
           <div className="w-full max-w-[400px] aspect-square relative bg-slate-50 border-2 border-slate-200 rounded-xl mb-8 flex items-center justify-center overflow-hidden">
              {/* Grid Lines */}
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: 'center center' }}></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300"></div>
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-300"></div>
              
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full overflow-visible">
                 <path d={generatePath(functions[activeFunc].calc)} fill="none" stroke={functions[activeFunc].stroke} strokeWidth="4" />
                 
                 {/* Live Point */}
                 <motion.circle 
                   cx={(rawOutput + 5) * 20} 
                   cy={100 - (currentVal * 20)} 
                   r="6" 
                   fill={functions[activeFunc].stroke} 
                   className="shadow-lg"
                 />
                 
                 {/* Projection Lines */}
                 <motion.line x1={(rawOutput + 5) * 20} y1="100" x2={(rawOutput + 5) * 20} y2={100 - (currentVal * 20)} stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
                 <motion.line x1="100" y1={100 - (currentVal * 20)} x2={(rawOutput + 5) * 20} y2={100 - (currentVal * 20)} stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
              
              <span className="absolute bottom-2 right-2 text-[10px] font-bold text-slate-400 font-mono">Raw Output (x)</span>
              <span className="absolute top-2 left-[52%] text-[10px] font-bold text-slate-400 font-mono">Final Value (y)</span>
           </div>

           {/* Interactive Slider */}
           <div className="w-full max-w-md flex flex-col gap-2 bg-slate-100 p-4 rounded-xl border border-slate-200">
             <div className="flex justify-between text-xs font-bold text-slate-600">
               <span>Raw NN Output: <span className="font-mono text-slate-800">{rawOutput.toFixed(2)}</span></span>
               <span>Activation Result: <span className={`font-mono text-lg ${functions[activeFunc].color}`}>{currentVal.toFixed(2)}</span></span>
             </div>
             <input type="range" min="-5" max="5" step="0.1" value={rawOutput} onChange={(e) => setRawOutput(parseFloat(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-300" style={{ accentColor: functions[activeFunc].stroke }} />
           </div>
        </div>

        {/* Right: Explanations */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-200">
             <h4 className={`font-bold text-xl mb-2 ${functions[activeFunc].color}`}>{functions[activeFunc].name} Activation</h4>
             <p className="text-sm text-slate-700 leading-relaxed mb-4">
               {functions[activeFunc].desc}
             </p>
             <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-start gap-3">
               <Target className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
               <p className="text-xs text-slate-600">
                 <strong>Rule of Thumb:</strong> The final layer of your Decoder MUST use an activation function that matches the mathematical limits of your training data. 
               </p>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 5: Deep Dive: Gaussian Likelihood = MSE Loss ---
const GaussianToMSESlide = () => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Step 1: The Raw Negative Log-Likelihood",
      eq: (
        <span>
          -log <span className="text-indigo-400">p(x|z)</span> = -log <span className="text-slate-400">&#123;</span> <span className="text-slate-500 text-sm">1 / √(2π<span className="text-emerald-500">σ²</span>)</span> <span className="text-slate-400">&#125;</span> -log <span className="text-slate-400">&#123;</span> <span className="text-slate-500 text-sm">exp(</span> -<span className="text-blue-500">(x-μ)²</span> / 2<span className="text-emerald-500">σ²</span> <span className="text-slate-500 text-sm">)</span> <span className="text-slate-400">&#125;</span>
        </span>
      ),
      desc: "If we assume our data follows a Gaussian (Bell Curve) distribution, the Reconstruction Loss is just the Negative Log-Likelihood (NLL) of the Gaussian probability density function."
    },
    {
      title: "Step 2: Logarithm Magic",
      eq: (
        <span>
          -log <span className="text-indigo-400">p(x|z)</span> = <span className="text-slate-400">&#123;</span> -log(1) + ½log(2π) + <span className="text-emerald-500">½log(σ²)</span> <span className="text-slate-400">&#125;</span> + <span className="text-slate-400">&#123;</span> <span className="text-blue-500">(x-μ)²</span> / 2<span className="text-emerald-500">σ²</span> <span className="text-slate-400">&#125;</span>
        </span>
      ),
      desc: "The logarithm cancels out the 'exp' function completely. It also breaks the fraction into simple addition. Look at the last term: it's starting to look familiar..."
    },
    {
      title: "Step 3: The 'Fixed Scalar' Assumption",
      eq: (
        <span>
          <span className="text-xs uppercase tracking-widest text-emerald-600 bg-emerald-100 px-2 py-1 rounded font-bold mr-4">Assume σ² = 1</span> <br/><br/>
          -log <span className="text-indigo-400">p(x|z)</span> = <span className="text-slate-300">&#123; Constant &#125;</span> + <span className="text-slate-400">&#123;</span> <span className="text-blue-500">(x-μ)²</span> / 2(1) <span className="text-slate-400">&#125;</span>
        </span>
      ),
      desc: "In many basic VAEs, we assume the variance of every pixel is a fixed constant (like 1). If σ²=1, the log(σ²) term becomes zero, and the denominator disappears!"
    },
    {
      title: "Step 4: Behold, Mean Squared Error!",
      eq: (
        <span>
          Loss ∝ <span className="text-blue-600 font-bold bg-blue-100 px-2 rounded">(x - μ)²</span>
        </span>
      ),
      desc: "Because constants don't affect Neural Network gradients, we ignore them. The only thing left to minimize is the squared difference between the True Pixel (x) and the Network's Predicted Pixel (μ). This is the exact definition of MSE!"
    }
  ];

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The Math Bridge: Why Gaussian = MSE</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          It's easy to get confused when a textbook says <em>"We use a Gaussian Likelihood, which gives us an MSE loss."</em> Let's watch the terrifying math collapse into something simple.
        </p>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center max-w-5xl mx-auto w-full">
         <div className="bg-white border border-slate-200 rounded-2xl w-full p-8 shadow-xl relative overflow-hidden flex flex-col min-h-[450px]">
            
            <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto flex-grow justify-center">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={step}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center w-full"
                >
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-indigo-600 bg-indigo-50 px-4 py-1 rounded-full border border-indigo-200">
                    {steps[step].title}
                  </h4>
                  
                  <div className="font-mono text-xl md:text-3xl font-bold bg-slate-900 text-white px-8 py-10 rounded-2xl shadow-inner border-4 border-slate-800 mb-8 w-full text-center leading-relaxed">
                    {steps[step].eq}
                  </div>
                  
                  <p className="text-slate-600 text-base md:text-lg max-w-2xl text-center leading-relaxed border-t border-slate-200 pt-6">
                    {steps[step].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex justify-between items-center w-full max-w-4xl mx-auto border-t border-slate-200 pt-6">
               <button 
                 onClick={() => setStep(Math.max(0, step - 1))}
                 disabled={step === 0}
                 className="flex items-center gap-2 px-6 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg font-bold text-slate-700 transition-colors"
               >
                 <ChevronLeft className="w-5 h-5"/> Previous
               </button>
               
               <div className="flex gap-2">
                 {steps.map((_, i) => (
                   <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                 ))}
               </div>

               <button 
                 onClick={() => setStep(Math.min(3, step + 1))}
                 disabled={step === 3}
                 className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-colors"
               >
                 Next Math Step <ChevronRight className="w-5 h-5"/>
               </button>
            </div>

         </div>
      </div>
    </div>
  );
};

// --- SLIDE 6: The Decoder Variance Mystery ---
const DecoderVarianceMysterySlide = () => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "1. The User's Intuition",
      content: (
        <div className="flex flex-col items-center">
          <div className="bg-slate-100 border-l-4 border-slate-400 p-4 rounded-r-xl w-full mb-6">
            <span className="text-xs font-bold text-slate-500 uppercase">Your Question:</span>
            <p className="text-slate-700 font-medium italic mt-1">"For the decoder where does this variance term come from? We just compare reconstructed data to original data, isn't it? What am I missing?"</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-4 shadow-sm w-full">
            <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
            <p className="text-sm text-emerald-900">
              <strong>You are missing absolutely nothing! You are 100% correct.</strong> We DO just compare the output image directly to the real image using an error function! 
              <br/><br/>The "Variance" in the textbook is just mathematicians explaining <em>why</em> Mean Squared Error (MSE) works! Let me prove it to you.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "2. The Mathematical Connection",
      content: (
        <div className="flex flex-col w-full h-full">
          <p className="text-sm text-slate-600 mb-6 text-center">If we assume the "Error" between our output and the truth forms a Bell Curve (Gaussian)...</p>
          
          <div className="font-mono text-sm md:text-lg font-bold bg-slate-900 text-white p-6 rounded-2xl shadow-inner border-2 border-slate-800 mb-6 w-full text-center leading-relaxed">
            -log <span className="text-indigo-400">p(x|z)</span> = <span className="text-slate-400">&#123;</span> <span className="text-slate-500 text-sm">Constant</span> <span className="text-slate-400">&#125;</span> + <span className="text-slate-400">&#123;</span> <span className="text-blue-500">(x<sub className="text-xs">true</sub> - x<sub className="text-xs">pred</sub>)²</span> / 2<span className="text-emerald-500">σ²</span> <span className="text-slate-400">&#125;</span>
          </div>
          
          <p className="text-sm text-slate-600 bg-blue-50 p-4 rounded-xl border border-blue-200">
            This terrifying equation is the formal <strong>Negative Log-Likelihood of a Gaussian</strong>. Notice that <span className="font-mono font-bold text-blue-600">x_pred</span> (the Decoder's output) acts as the Mean (μ) of the curve!
          </p>
        </div>
      )
    },
    {
      title: "3. The Magic Eraser (σ² = 1)",
      content: (
        <div className="flex flex-col w-full h-full items-center">
          <div className="bg-emerald-100 text-emerald-800 font-bold px-6 py-2 rounded-full border-2 border-emerald-400 mb-6 shadow-md animate-pulse">
            Assume Variance (σ²) = 1
          </div>
          
          <p className="text-sm text-slate-600 mb-6 text-center max-w-lg">
            In standard Autoencoders, we don't build a network to guess the variance. We just mathematically declare: <em>"The variance of the error is exactly 1."</em> Watch what happens to the math:
          </p>
          
          <div className="font-mono text-xl md:text-3xl font-bold bg-slate-900 text-white p-6 rounded-2xl shadow-inner border-2 border-slate-800 w-full text-center">
            Loss = <span className="text-slate-500 line-through mr-2">Constant +</span><span className="text-blue-500 bg-blue-900/50 px-2 py-1 rounded">(x<sub className="text-lg">true</sub> - x<sub className="text-lg">pred</sub>)²</span><span className="text-slate-500 line-through ml-2">/ 2(1)</span>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 w-full">
            <ArrowDown className="w-8 h-8 text-blue-500 animate-bounce" />
          </div>

          <div className="font-bold text-2xl text-blue-700 bg-blue-100 px-8 py-3 rounded-xl border-2 border-blue-300 shadow-md mt-4">
            Mean Squared Error (MSE)!
          </div>
        </div>
      )
    },
    {
      title: "4. The Conclusion",
      content: (
        <div className="flex flex-col items-center justify-center h-full gap-6">
          <div className="bg-white border-2 border-slate-200 p-8 rounded-2xl shadow-xl w-full max-w-lg text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">TL;DR</div>
             <Target className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
             <p className="text-slate-700 leading-relaxed text-lg">
               When a textbook says: <br/><strong>"Use a Gaussian Likelihood with a fixed variance."</strong>
             </p>
             <div className="h-px bg-slate-200 w-full my-4"></div>
             <p className="text-slate-700 leading-relaxed text-lg">
               It is literally just academic code for: <br/><strong>"Compare the images using MSE Loss."</strong>
             </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">The Decoder Variance Mystery</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Let's resolve the confusion between "comparing reconstructed data" and "Decoder Variance".
        </p>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
         <div className="bg-white border border-slate-200 rounded-3xl w-full p-8 shadow-xl relative overflow-hidden flex flex-col min-h-[450px]">
            
            <div className="flex flex-col gap-6 w-full mx-auto flex-grow justify-center">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={step}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col items-center w-full h-full"
                >
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-indigo-600 bg-indigo-50 px-4 py-1 rounded-full border border-indigo-200">
                    {steps[step].title}
                  </h4>
                  
                  {steps[step].content}

                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex justify-between items-center w-full border-t border-slate-200 pt-6">
               <button 
                 onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
                 className="flex items-center gap-2 px-6 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg font-bold text-slate-700 transition-colors"
               >
                 <ChevronLeft className="w-5 h-5"/> Previous
               </button>
               
               <div className="flex gap-2">
                 {steps.map((_, i) => (
                   <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                 ))}
               </div>

               <button 
                 onClick={() => setStep(Math.min(3, step + 1))} disabled={step === 3}
                 className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-colors"
               >
                 Next <ChevronRight className="w-5 h-5"/>
               </button>
            </div>

         </div>
      </div>
    </div>
  );
};

// --- SLIDE 7: Handling Decoder Variance (Uncertainty Maps) ---
const DecoderVarianceSlide = () => {
  const [varianceMode, setVarianceMode] = useState('fixed');

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">What if we DON'T fix the Variance to 1?</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          If we let the Decoder learn its own variance, it works exactly like the Encoder! We add a <strong>second output head</strong> predicting <span className="font-mono bg-slate-800 px-1 rounded text-emerald-400">log(σ²_x)</span>. This acts as an "Uncertainty Map".
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Left Nav */}
        <div className="lg:w-1/3 flex flex-col gap-3">
          <button onClick={() => setVarianceMode('fixed')} className={`text-left p-4 rounded-xl border-l-4 transition-colors ${varianceMode === 'fixed' ? 'bg-slate-800 shadow-md border-blue-500' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'}`}>
            <h4 className="font-bold text-sm mb-1 text-slate-200">1. Fixed Scalar (σ² = 1)</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">The math collapses to Standard MSE. The network assumes equal confidence for every pixel.</p>
          </button>
          
          <button onClick={() => setVarianceMode('global')} className={`text-left p-4 rounded-xl border-l-4 transition-colors ${varianceMode === 'global' ? 'bg-slate-800 shadow-md border-amber-500' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'}`}>
            <h4 className="font-bold text-sm mb-1 text-slate-200">2. Learned Global Scalar</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">Network predicts the image pixels, plus ONE single variable representing "overall image noise".</p>
          </button>

          <button onClick={() => setVarianceMode('pixel')} className={`text-left p-4 rounded-xl border-l-4 transition-colors ${varianceMode === 'pixel' ? 'bg-slate-800 shadow-md border-emerald-500' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'}`}>
            <h4 className="font-bold text-sm mb-1 text-slate-200">3. Learned Per-Pixel Variance</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">Decoder outputs TWO full images: One for predicted pixels (μ), and an "Uncertainty Map" (σ²).</p>
          </button>
        </div>

        {/* Right Visualizer */}
        <div className="lg:w-2/3 bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-6 flex flex-col relative overflow-hidden">
           
           <AnimatePresence mode="wait">
             <motion.div 
               key={varianceMode}
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
               className="flex flex-col h-full items-center justify-center gap-6"
             >
               
               <h3 className="font-bold uppercase tracking-widest text-xs text-slate-400 border-b border-slate-600 pb-2 w-full text-center">Decoder Outputs</h3>

               <div className="flex items-center gap-8 justify-center w-full">
                  
                  {/* Always present: Predicted Mean Image */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-blue-400 mb-2">Predicted Image (μ_x)</span>
                    <div className="w-32 h-32 bg-black border-2 border-blue-500 rounded-lg overflow-hidden shadow-lg p-1">
                      <img src="https://picsum.photos/id/1011/200/200" className="w-full h-full object-cover grayscale blur-[1px]" />
                    </div>
                  </div>

                  {varianceMode === 'fixed' && (
                    <div className="flex flex-col items-center opacity-50">
                      <span className="text-[10px] font-bold text-slate-500 mb-2">Variance Constraint</span>
                      <div className="w-32 h-32 border-2 border-dashed border-slate-500 rounded-lg flex items-center justify-center font-mono font-bold text-slate-400 text-center p-4">
                        σ² = 1.0<br/><br/>(No output head needed)
                      </div>
                    </div>
                  )}

                  {varianceMode === 'global' && (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-amber-400 mb-2">Learned Global Variance (σ²)</span>
                      <div className="w-32 h-32 bg-slate-900 border-2 border-amber-500 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                        <span>σ² = 0.04</span>
                        <span className="text-[8px] mt-2 text-center text-amber-200/50">One number for<br/>the whole image</span>
                      </div>
                    </div>
                  )}

                  {varianceMode === 'pixel' && (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-emerald-400 mb-2">Per-Pixel Uncertainty Map (σ²_x)</span>
                      <div className="w-32 h-32 bg-black border-2 border-emerald-500 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.3)] p-1 relative">
                        {/* Fake uncertainty map (edges are bright green, flat areas are black) */}
                        <img src="https://picsum.photos/id/1011/200/200" className="w-full h-full object-cover" style={{ filter: 'contrast(200%) grayscale(100%) invert(100%) sepia(100%) hue-rotate(90deg) saturate(300%)' }} />
                      </div>
                    </div>
                  )}

               </div>

               <div className="mt-8 bg-slate-900/50 p-4 rounded-xl border border-slate-700 text-sm text-slate-300 w-full">
                 {varianceMode === 'fixed' && <span><strong>Effect:</strong> The network is punished equally for errors anywhere in the image. If the image has inherently chaotic parts (like hair or water), the MSE penalty explodes and the network struggles to train.</span>}
                 {varianceMode === 'global' && <span><strong>Effect:</strong> The network can learn to output a higher variance to say "This dataset is noisy overall," lowering the massive MSE penalties and stabilizing training slightly.</span>}
                 {varianceMode === 'pixel' && <span><strong>Effect:</strong> Maximum flexibility. The network looks at a sharp edge and outputs high uncertainty (bright green) for those specific pixels. It tells the loss function: <em>"I'm guessing the edge is here, but don't penalize me massively if it's shifted by 1 pixel."</em> This helps prevent overly blurry reconstructions!</span>}
               </div>

             </motion.div>
           </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

// --- SLIDE 8: The Full CNN Pipeline Stepper ---
const CNNPipelineSlide = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Input Image", desc: "Data enters the Encoder.", shape: "28 x 28 x 1", block: "input" },
    { title: "Convolutional Downsampling", desc: "Extracts spatial features while reducing dimensions (strides > 1).", shape: "14x14x32 → 7x7x64", block: "conv_enc" },
    { title: "Flatten & Dense", desc: "Transforms spatial maps into a flat feature vector.", shape: "3136 → 128", block: "dense_enc" },
    { title: "Latent Parameterization", desc: "Splits into two heads to output Mean and Log-Variance.", shape: "latent_dim (e.g., 10)", block: "params" },
    { title: "Reparameterization Trick", desc: "Samples z using external noise ε.", shape: "latent_dim (e.g., 10)", block: "z" },
    { title: "Dense & Reshape", desc: "Maps z back to a high-dimensional flat vector, then reshapes to a spatial grid.", shape: "128 → 3136 → 7x7x64", block: "dense_dec" },
    { title: "Transposed Convolution", desc: "Upsamples the grid back to the original image dimensions.", shape: "14x14x32 → 28x28x1", block: "conv_dec" },
    { title: "Reconstruction", desc: "Final activation matches data type (e.g. Sigmoid for B&W pixels).", shape: "28 x 28 x 1", block: "output" }
  ];

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-4">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Illustrative Example: CNN-Based VAE</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Let's trace a standard image (like MNIST) through a common CNN architecture.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow pb-4 items-stretch">
        
        {/* LEFT: The Flowchart */}
        <div className="flex-[1.5] bg-[#eceff1] rounded-2xl shadow-inner border border-slate-300 p-6 flex flex-col items-center overflow-y-auto relative">
           
           <div className="flex flex-col items-center w-full max-w-md pb-10">
              
              {/* ENCODER BLOCK */}
              <div className={`w-full border-2 rounded-2xl p-4 flex flex-col items-center relative transition-colors duration-500 ${step >= 0 && step <= 3 ? 'border-teal-400 bg-white/50' : 'border-transparent'}`}>
                <span className="absolute -top-3 bg-[#eceff1] px-2 text-xs font-bold text-slate-500">Encoder q_φ(z|x)</span>
                
                {/* Block 0: Input */}
                <div className={`w-64 py-3 rounded-lg border-2 text-center shadow-sm transition-all duration-300 z-10 ${step === 0 ? 'bg-blue-100 border-blue-400 scale-105' : 'bg-blue-50/50 border-blue-200'}`}>
                   <span className="text-sm font-bold text-blue-900 block">Input x</span>
                   <span className="text-xs font-mono text-blue-700">Image 28x28x1</span>
                </div>
                <ArrowDown className="text-slate-400 w-5 h-5 my-1" />
                
                {/* Block 1: Conv Enc */}
                <div className={`w-64 py-3 rounded-lg border-2 text-center shadow-sm transition-all duration-300 z-10 ${step === 1 ? 'bg-indigo-100 border-indigo-400 scale-105' : 'bg-indigo-50/50 border-indigo-200'}`}>
                   <span className="text-sm font-bold text-indigo-900 block">Conv2D + ReLU (x2)</span>
                   <span className="text-xs font-mono text-indigo-700">Output: 7x7x64</span>
                </div>
                <ArrowDown className="text-slate-400 w-5 h-5 my-1" />

                {/* Block 2: Dense Enc */}
                <div className={`w-64 py-3 rounded-lg border-2 text-center shadow-sm transition-all duration-300 z-10 ${step === 2 ? 'bg-purple-100 border-purple-400 scale-105' : 'bg-purple-50/50 border-purple-200'}`}>
                   <span className="text-sm font-bold text-purple-900 block">Flatten → Dense</span>
                   <span className="text-xs font-mono text-purple-700">Output: 128</span>
                </div>
                
                {/* Split Arrows */}
                <div className="flex w-32 justify-between mt-1 mb-1">
                  <div className="w-px h-6 bg-slate-400 transform rotate-[30deg] origin-top"></div>
                  <div className="w-px h-6 bg-slate-400 transform -rotate-[30deg] origin-top"></div>
                </div>

                {/* Block 3: Params */}
                <div className="flex gap-4 z-10">
                  <div className={`w-32 py-2 rounded-lg border-2 text-center shadow-sm transition-all duration-300 ${step === 3 ? 'bg-emerald-100 border-emerald-400 scale-105' : 'bg-emerald-50/50 border-emerald-200'}`}>
                    <span className="text-[10px] font-bold text-emerald-900 block">Dense (to μ_z)</span>
                  </div>
                  <div className={`w-32 py-2 rounded-lg border-2 text-center shadow-sm transition-all duration-300 ${step === 3 ? 'bg-emerald-100 border-emerald-400 scale-105' : 'bg-emerald-50/50 border-emerald-200'}`}>
                    <span className="text-[10px] font-bold text-emerald-900 block">Dense (to log σ²)</span>
                  </div>
                </div>
              </div>

              {/* Converge Arrows */}
              <div className="flex w-32 justify-between mt-1 mb-1 relative z-0">
                  <div className="w-px h-8 border-l-2 border-dashed border-emerald-500 transform -rotate-[30deg] origin-bottom"></div>
                  <div className="w-px h-8 border-r-2 border-dashed border-emerald-500 transform rotate-[30deg] origin-bottom"></div>
              </div>

              {/* LATENT SPACE BLOCK */}
              <div className={`w-[110%] border-2 rounded-2xl p-4 flex flex-col items-center relative transition-colors duration-500 z-10 ${step === 4 ? 'border-emerald-400 bg-emerald-50/50' : 'border-transparent'}`}>
                <span className="absolute -top-3 bg-[#eceff1] px-2 text-xs font-bold text-slate-500">Latent Space</span>
                
                {/* Block 4: Z */}
                <div className={`w-72 py-4 rounded-full border-2 text-center shadow-md transition-all duration-300 z-10 ${step === 4 ? 'bg-emerald-200 border-emerald-500 scale-105' : 'bg-emerald-100/50 border-emerald-300'}`}>
                   <span className="text-sm font-bold text-emerald-900 block">z ~ N(μ, σ²)</span>
                   <span className="text-[10px] text-emerald-700 block mb-1">(Reparameterization Trick)</span>
                   <span className="text-xs font-mono text-emerald-800">Shape: latent_dim</span>
                </div>
              </div>

              <ArrowDown className="text-slate-400 w-5 h-5 my-1" />

              {/* DECODER BLOCK */}
              <div className={`w-full border-2 rounded-2xl p-4 flex flex-col items-center relative transition-colors duration-500 ${step >= 5 ? 'border-rose-400 bg-white/50' : 'border-transparent'}`}>
                <span className="absolute -top-3 bg-[#eceff1] px-2 text-xs font-bold text-slate-500">Decoder p_θ(x|z)</span>
                
                {/* Block 5: Dense Dec */}
                <div className={`w-64 py-3 rounded-lg border-2 text-center shadow-sm transition-all duration-300 z-10 ${step === 5 ? 'bg-pink-100 border-pink-400 scale-105' : 'bg-pink-50/50 border-pink-200'}`}>
                   <span className="text-sm font-bold text-pink-900 block">Dense → Reshape</span>
                   <span className="text-xs font-mono text-pink-700">Output: 7x7x64</span>
                </div>
                <ArrowDown className="text-slate-400 w-5 h-5 my-1" />

                {/* Block 6: Conv Dec */}
                <div className={`w-64 py-3 rounded-lg border-2 text-center shadow-sm transition-all duration-300 z-10 ${step === 6 ? 'bg-rose-100 border-rose-400 scale-105' : 'bg-rose-50/50 border-rose-200'}`}>
                   <span className="text-sm font-bold text-rose-900 block">Conv2DTranspose (x2)</span>
                   <span className="text-[10px] text-rose-700 block mb-1">Upsampling (stride 2)</span>
                   <span className="text-xs font-mono text-rose-700">Output: 28x28x1</span>
                </div>
                <ArrowDown className="text-slate-400 w-5 h-5 my-1" />

                {/* Block 7: Output */}
                <div className={`w-64 py-3 rounded-lg border-2 text-center shadow-sm transition-all duration-300 z-10 ${step === 7 ? 'bg-orange-100 border-orange-400 scale-105' : 'bg-orange-50/50 border-orange-200'}`}>
                   <span className="text-sm font-bold text-orange-900 block">Reconstructed x_hat</span>
                   <span className="text-[10px] text-orange-800 block mb-1">Final Activation (e.g. Sigmoid)</span>
                </div>

              </div>

           </div>
        </div>

        {/* RIGHT: Step Descriptions */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 min-h-[250px] flex flex-col">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2 mb-4">Pipeline Inspector</h3>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={step}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col h-full"
                >
                  <h4 className="text-2xl font-bold text-slate-800 mb-2">{steps[step].title}</h4>
                  <p className="text-slate-600 mb-6">{steps[step].desc}</p>
                  
                  <div className="mt-auto bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between shadow-inner">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tensor Shape</span>
                    <span className="font-mono text-lg text-emerald-400 font-bold">{steps[step].shape}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
           </div>

           {/* Manual Controls */}
           <div className="flex justify-between items-center w-full bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-700">
             <button 
               onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
               className="p-2 bg-slate-700 text-white rounded-lg disabled:opacity-30 hover:bg-slate-600 transition-colors"
             ><ChevronLeft /></button>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step {step + 1} of 8</span>
             <button 
               onClick={() => setStep(Math.min(7, step + 1))} disabled={step === 7}
               className="p-2 bg-slate-700 text-white rounded-lg disabled:opacity-30 hover:bg-slate-600 transition-colors"
             ><ChevronRight /></button>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 9: Capacity & Posterior Collapse ---
const CapacityCollapseSlide = () => {
  const [decoderPower, setDecoderPower] = useState(50); // 0 = Weak, 100 = Autoregressive/Too Strong

  // Determine state based on slider
  const isCollapsed = decoderPower > 80;
  const isBottlenecked = decoderPower < 20;

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">The Capacity Balancing Act</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Network design dictates learning dynamics. If networks are unbalanced, the VAE fails. The most notorious failure mode is <strong>Posterior Collapse</strong>.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* LEFT: Interactive Simulator */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8 flex flex-col relative overflow-hidden">
           
           <div className="flex-grow flex flex-col justify-center gap-8 relative z-10">
              
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-center w-1/3">
                  <div className="w-16 h-16 bg-blue-900/50 border-2 border-blue-500 rounded-xl flex items-center justify-center font-bold text-blue-400 mb-2">Encoder</div>
                  <span className="text-[10px] text-slate-400 text-center">Standard CNN</span>
                </div>
                
                <div className="flex-1 flex flex-col items-center px-2">
                  <span className="text-[10px] font-mono text-emerald-400 mb-1">Latent Z (Bottleneck)</span>
                  <div className={`w-full h-8 flex items-center justify-center transition-all duration-500 ${isCollapsed ? 'opacity-20' : 'opacity-100'}`}>
                     <div className="w-full h-1 bg-slate-600 relative">
                       {/* Data flow particles */}
                       <motion.div animate={{ left: ['0%', '100%'] }} transition={{ duration: 1, repeat: Infinity }} className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
                     </div>
                  </div>
                  {isCollapsed && <span className="text-[9px] font-bold text-rose-500 mt-1 uppercase bg-rose-950/50 px-1 rounded">Ignored!</span>}
                </div>

                <div className="flex flex-col items-center w-1/3">
                  <div className={`transition-all duration-500 border-2 rounded-xl flex items-center justify-center font-bold mb-2 shadow-lg ${decoderPower > 80 ? 'w-24 h-24 bg-rose-900/50 border-rose-500 text-rose-400' : decoderPower < 20 ? 'w-12 h-12 bg-slate-700 border-slate-500 text-slate-400' : 'w-16 h-16 bg-indigo-900/50 border-indigo-500 text-indigo-400'}`}>
                    Decoder
                  </div>
                  <span className="text-[10px] text-slate-400 text-center">{decoderPower > 80 ? 'Autoregressive (Overpowered)' : decoderPower < 20 ? 'Too Shallow (Weak)' : 'Standard CNN'}</span>
                </div>
              </div>

              <div className="w-full bg-slate-900 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  <span className={isBottlenecked ? 'text-blue-400' : ''}>Weak Decoder</span>
                  <span className={!isCollapsed && !isBottlenecked ? 'text-emerald-400' : ''}>Balanced</span>
                  <span className={isCollapsed ? 'text-rose-400' : ''}>Overpowered Decoder</span>
                </div>
                <input type="range" min="0" max="100" value={decoderPower} onChange={(e) => setDecoderPower(parseInt(e.target.value))} className="w-full" style={{ accentColor: '#6366f1' }} />
              </div>

           </div>
        </div>

        {/* RIGHT: Results & Explanation */}
        <div className="flex-1 flex flex-col gap-4">
           
           <AnimatePresence mode="wait">
             {isCollapsed && (
               <motion.div key="collapse" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-rose-950/30 border border-rose-500/50 p-6 rounded-2xl shadow-sm h-full flex flex-col justify-center">
                 <h4 className="font-bold text-rose-400 mb-2 text-xl flex items-center gap-2"><AlertTriangle className="w-6 h-6"/> Posterior Collapse</h4>
                 <p className="text-sm text-slate-300 leading-relaxed mb-4">
                   If the Decoder is immensely powerful (e.g., an Autoregressive model like PixelCNN), it doesn't <em>need</em> the latent code Z to generate good images. It can predict pixels just by looking at neighboring pixels!
                 </p>
                 <div className="bg-black/40 p-3 rounded-lg border border-rose-900 text-xs text-rose-200 font-mono">
                   <strong>Result:</strong> To avoid the KL penalty, the model sets q(z|x) exactly to p(z) for all inputs. The latent space becomes completely uninformative. Z is ignored.
                 </div>
               </motion.div>
             )}

             {isBottlenecked && (
               <motion.div key="bottleneck" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-blue-950/30 border border-blue-500/50 p-6 rounded-2xl shadow-sm h-full flex flex-col justify-center">
                 <h4 className="font-bold text-blue-400 mb-2 text-xl flex items-center gap-2"><Minimize2 className="w-6 h-6"/> Information Bottlenecked</h4>
                 <p className="text-sm text-slate-300 leading-relaxed mb-4">
                   If the Decoder lacks the capacity (too shallow, too few filters) to reconstruct the complexity of the data, it cannot utilize the rich information provided by the Encoder.
                 </p>
                 <div className="bg-black/40 p-3 rounded-lg border border-blue-900 text-xs text-blue-200 font-mono">
                   <strong>Result:</strong> High reconstruction error (MSE). The generated images will be blurry and lack fine details, no matter how good the latent representation is.
                 </div>
               </motion.div>
             )}

             {!isCollapsed && !isBottlenecked && (
               <motion.div key="balanced" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-emerald-950/30 border border-emerald-500/50 p-6 rounded-2xl shadow-sm h-full flex flex-col justify-center">
                 <h4 className="font-bold text-emerald-400 mb-2 text-xl flex items-center gap-2"><Scale className="w-6 h-6"/> The Sweet Spot</h4>
                 <p className="text-sm text-slate-300 leading-relaxed mb-4">
                   Encoder and Decoder capacities are balanced. The Decoder is powerful enough to generate sharp images, but weak enough that it <em>depends</em> on the latent code Z to know what to draw.
                 </p>
                 <div className="bg-black/40 p-3 rounded-lg border border-emerald-900 text-xs text-emerald-200 font-mono">
                   <strong>Result:</strong> A rich, informative latent space and high-quality reconstructions. The KL term successfully regularizes without destroying the signal.
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

        </div>

      </div>
    </div>
  );
};

// --- SLIDE 10: Advanced Network Designs ---
const AdvancedDesignsSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Advanced Network Designs</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          While standard MLPs and CNNs form the backbone, modern VAEs integrate sophisticated components to handle higher resolution, complex sequences, and avoid posterior collapse.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full pb-8">
        
        {/* Residual Connections */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Split className="w-6 h-6 transform -rotate-90"/></div>
            <h3 className="font-bold text-lg text-slate-800">Residual Connections</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Blocks like ResNet allow training of much deeper encoders and decoders. They mitigate the vanishing gradient problem, allowing the VAE to capture highly complex, hierarchical features in high-res images.
          </p>
        </div>

        {/* Attention Mechanisms */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><Crosshair className="w-6 h-6"/></div>
            <h3 className="font-bold text-lg text-slate-800">Attention Mechanisms</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Crucial for sequential data (Transformers) or high-res images. Allows the Decoder to selectively focus on specific, relevant parts of the latent code or encoder features during the generation step.
          </p>
        </div>

        {/* Normalizing Flows */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Activity className="w-6 h-6"/></div>
            <h3 className="font-bold text-lg text-slate-800">Normalizing Flows</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Breaks the assumption that <span className="font-mono text-xs bg-slate-100 px-1 rounded">q(z|x)</span> must be a simple Gaussian. Uses a chain of invertible transformations to warp a simple Gaussian into a highly complex, multimodal posterior distribution for better expressiveness.
          </p>
        </div>

        {/* Autoregressive Decoders */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><Cpu className="w-6 h-6"/></div>
            <h3 className="font-bold text-lg text-slate-800">Autoregressive Decoders</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Uses powerful models like PixelCNN or WaveNet as the Decoder. They generate data pixel-by-pixel (or audio sample by sample). Significantly improves sample quality, but drastically slows down generation speed.
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
    EncoderDesignSlide,
    DecoderLikelihoodSlide,
    ContinuousDataSlide, 
    ActivationPlaygroundSlide, 
    GaussianToMSESlide, 
    DecoderVarianceMysterySlide, 
    DecoderVarianceSlide, 
    CNNPipelineSlide,
    CapacityCollapseSlide,
    AdvancedDesignsSlide
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