import React, { useState, useEffect } from 'react';
import { 
  Target, ChevronLeft, ChevronRight, Code, Terminal, 
  TrendingDown, CheckCircle2, ArrowRight, PlayCircle, 
  Activity, GitBranch, Layers, Scale, Crosshair,
  Maximize2, Zap
} from 'lucide-react';

export default function LossesSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'concept', title: 'The Concept of Loss', component: ConceptSlide },
    { id: 'regression', title: 'Regression Losses', component: RegressionSlide },
    { id: 'classification', title: 'Classification Losses', component: ClassificationSlide },
    { id: 'training', title: 'Choosing & Training', component: TrainingSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Target size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Loss Functions (torch.nn losses)</h2>
        <p className="text-slate-400 text-sm mb-4">Quantifying prediction errors to guide backpropagation</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-rose-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-rose-400 whitespace-nowrap' : 'hidden md:inline whitespace-nowrap'}>
              {slide.title}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[550px] flex flex-col">
        <div className="flex-1">
          <CurrentComponent />
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
          <button 
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))} 
            disabled={currentSlide === 0} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 font-semibold transition-colors"
          >
            <ChevronLeft size={20} /> Previous
          </button>
          <button 
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))} 
            disabled={currentSlide === slides.length - 1} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: Interactive Concept ---
function ConceptSlide() {
  const [prediction, setPrediction] = useState(20);
  const target = 80;
  
  // Calculate dynamic loss values based on the slider
  const error = Math.abs(target - prediction);
  const mseLoss = Math.pow(error, 2);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <h3 className="text-xl font-bold mb-2">Quantifying Network Error</h3>
      <p className="text-slate-600 mb-8 leading-relaxed text-sm">
        For networks to learn, we must quantify how far their predictions deviate from the true target values. 
        A loss function calculates the <strong>"distance" (error)</strong> and outputs a single scalar value. 
        Drag the prediction below to see how the Loss changes!
      </p>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 flex-1">
        
        {/* Interactive Visualizer */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center shadow-inner relative">
           
           <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-12 flex items-center gap-2">
             <Maximize2 size={16}/> Interactive Loss Visualizer
           </h4>

           <div className="w-full max-w-md relative h-32 mb-8">
              
              {/* Base Axis line */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-300 rounded -translate-y-1/2"></div>
              
              {/* The "Error" Gap Highlight */}
              <div 
                className="absolute top-1/2 h-1 bg-rose-400 -translate-y-1/2 transition-all duration-75"
                style={{
                  left: `${Math.min(prediction, target)}%`,
                  width: `${error}%`
                }}
              ></div>

              {/* Target Marker (Ground Truth) */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-0" style={{ left: `${target}%` }}>
                 <div className="w-8 h-8 rounded-full border-4 border-emerald-500 bg-white flex items-center justify-center z-10 shadow-md">
                   <Target size={16} className="text-emerald-500"/>
                 </div>
                 <span className="text-xs font-bold text-emerald-700 mt-2 whitespace-nowrap bg-emerald-50 px-2 py-1 rounded border border-emerald-200">Target (y)</span>
              </div>

              {/* Prediction Marker (Draggable) */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-20" style={{ left: `${prediction}%` }}>
                 <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center cursor-ew-resize"></div>
                 <span className="text-xs font-bold text-blue-700 mb-12 whitespace-nowrap bg-blue-50 px-2 py-1 rounded border border-blue-200 absolute -top-10">Prediction (ŷ)</span>
              </div>

              {/* Error Label floating above the line */}
              {error > 5 && (
                <div 
                  className="absolute top-1/4 -translate-y-1/2 -translate-x-1/2 bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-1 rounded border border-rose-300"
                  style={{ left: `${Math.min(prediction, target) + error/2}%` }}
                >
                  Error: {error.toFixed(0)}
                </div>
              )}

              {/* The invisible native slider for interaction */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={prediction}
                onChange={(e) => setPrediction(Number(e.target.value))}
                className="absolute top-1/2 left-0 w-full h-8 -translate-y-1/2 opacity-0 cursor-ew-resize z-30"
              />
           </div>

           <p className="text-xs text-slate-500 italic mt-4 text-center">
             Slide the blue prediction dot to match the green target. Notice how the loss value explodes when you are far away!
           </p>

        </div>

        {/* Dynamic Calculation Panel */}
        <div className="flex flex-col gap-4">
           
           <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-full justify-center">
              <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">1. Calculate Error</span>
              <div className="font-mono text-sm mb-4 bg-slate-50 p-2 rounded">
                 Error = |y - ŷ| <br/>
                 Error = |{target} - {prediction}| <br/>
                 <strong className="text-rose-500 text-lg">= {error.toFixed(0)}</strong>
              </div>

              <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">2. Calculate MSE Loss</span>
              <div className="font-mono text-sm mb-4 bg-slate-50 p-2 rounded">
                 Loss = Error² <br/>
                 Loss = {error.toFixed(0)}² <br/>
              </div>

              <div className="mt-auto bg-rose-50 border border-rose-200 p-4 rounded-xl text-center">
                 <span className="block text-[10px] font-bold text-rose-800 uppercase tracking-widest mb-1">Final Scalar Loss Value</span>
                 <span className="block text-4xl font-black font-mono text-rose-600">
                   {mseLoss.toLocaleString()}
                 </span>
                 <span className="block text-[9px] text-rose-700 mt-2 uppercase">Used for Backpropagation</span>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}

// --- Slide 2: Regression Losses (Visualizing the Curves) ---
function RegressionSlide() {
  const [view, setView] = useState('mse');

  const pyCode = {
    'mse': `import torch\nimport torch.nn as nn\n\n# Instantiate the loss function\nloss_fn = nn.MSELoss()\n\n# Example predictions and targets (batch size 3, 1 output feature)\npredictions = torch.randn(3, 1, requires_grad=True)\ntargets = torch.randn(3, 1)\n\n# Calculate the loss\nloss = loss_fn(predictions, targets)\nprint(f"MSE Loss: {loss.item()}")\n\n# Gradients can now be computed via loss.backward()\n# loss.backward()\n# print(predictions.grad)`,
    'l1': `import torch\nimport torch.nn as nn\n\nloss_fn_l1 = nn.L1Loss()\npredictions = torch.tensor([[1.0], [2.5], [0.0]], requires_grad=True)\ntargets = torch.tensor([[1.2], [2.2], [0.5]])\n\nloss_l1 = loss_fn_l1(predictions, targets)\nprint(f"L1 Loss: {loss_l1.item()}") \n\n# Calculation breakdown:\n# Average of |1-1.2|, |2.5-2.2|, |0-0.5|\n# (0.2 + 0.3 + 0.5) / 3 = 1.0 / 3 = 0.333...`
  };

  const outCode = {
    'mse': `MSE Loss: 1.8492043018341064`,
    'l1': `L1 Loss: 0.3333333432674408`
  };

  // Generate SVG paths for the graphs
  // X range: -5 to 5 (mapped to 0-100 SVG coordinates)
  // Y range: 0 to 25 (mapped to 100-0 SVG coordinates)
  const msePoints = Array.from({length: 21}, (_, i) => -5 + i*0.5).map(x => {
    return `${x*10 + 50},${100 - (x*x)*4}`; 
  }).join(' ');

  const l1Points = Array.from({length: 21}, (_, i) => -5 + i*0.5).map(x => {
    return `${x*10 + 50},${100 - Math.abs(x)*15}`; 
  }).join(' ');

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><TrendingDown className="text-rose-500"/> Regression Losses</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Used when predicting continuous numerical values. Notice how MSE squares the error, creating a curve that exponentially penalizes large mistakes (outliers).
        </p>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setView('mse')}
            className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${view === 'mse' ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <span className="font-bold text-sm">MSELoss</span>
            <span className="text-[10px] uppercase">Mean Squared Error</span>
          </button>

          <button 
            onClick={() => setView('l1')}
            className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${view === 'l1' ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <span className="font-bold text-sm">L1Loss</span>
            <span className="text-[10px] uppercase">Mean Absolute Error</span>
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col flex-1 items-center justify-center relative overflow-hidden min-h-[300px]">
          
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 z-10 absolute top-6 left-6">Error Penalty Curve</h4>
          
          {/* Dynamic SVG Error Curve */}
          <div className="relative w-full max-w-[200px] aspect-square flex items-center justify-center z-10 my-4">
             <svg viewBox="0 -10 100 120" className="w-full h-full overflow-visible">
               {/* Y-Axis (Loss) */}
               <line x1="50" y1="-10" x2="50" y2="100" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2" />
               <text x="55" y="0" fontSize="8" fill="#64748b" fontWeight="bold">Loss Penalty</text>
               
               {/* X-Axis (Error magnitude) */}
               <line x1="0" y1="100" x2="100" y2="100" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2" />
               <text x="80" y="115" fontSize="8" fill="#64748b" fontWeight="bold">Error (y - ŷ)</text>
               <text x="0" y="115" fontSize="8" fill="#64748b">- Error</text>
               
               {/* Dynamic Path */}
               {view === 'mse' ? (
                 <polyline points={msePoints} fill="none" stroke="#f43f5e" strokeWidth="4" strokeLinejoin="round" className="animate-in fade-in" />
               ) : (
                 <polyline points={l1Points} fill="none" stroke="#f43f5e" strokeWidth="4" strokeLinejoin="round" className="animate-in fade-in" />
               )}
             </svg>
          </div>

          {view === 'mse' ? (
            <div className="w-full animate-in slide-in-from-bottom-2">
              <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm text-center font-serif text-slate-800 mb-4 font-bold">
                 Loss = (y - ŷ)²
              </div>
              <p className="text-xs text-slate-600 bg-rose-50 border border-rose-100 p-3 rounded-lg text-center">
                 The <strong>Parabola</strong> shape means an error of 2 is penalized by 4, but an error of 4 is penalized by 16! It is highly sensitive to outliers.
              </p>
            </div>
          ) : (
            <div className="w-full animate-in slide-in-from-bottom-2">
              <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm text-center font-serif text-slate-800 mb-4 font-bold">
                 Loss = |y - ŷ|
              </div>
              <p className="text-xs text-slate-600 bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-center">
                 The <strong>V-Shape</strong> indicates linear scaling. An error of 4 is penalized exactly twice as much as an error of 2. It is robust against outliers.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto min-h-[250px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Python Code</span></div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-emerald-100 leading-relaxed overflow-x-auto">
{pyCode[view]}
          </pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[150px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap overflow-x-auto">{outCode[view]}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Classification Losses ---
function ClassificationSlide() {
  const [view, setView] = useState('ce');

  const pyCode = {
    'ce': `import torch\nimport torch.nn as nn\n\nloss_fn_ce = nn.CrossEntropyLoss()\n\n# Example: Batch of 3 samples, 5 possible classes\n# Raw scores (logits) from the model (No Softmax needed!)\npredictions_logits = torch.randn(3, 5, requires_grad=True)\n\n# True class indices (Must be LongTensor integers 0 to C-1)\ntargets_classes = torch.tensor([1, 0, 4]) \n\nloss_ce = loss_fn_ce(predictions_logits, targets_classes)\nprint(f"Cross-Entropy Loss: {loss_ce.item()}")\n\n# loss_ce.backward()\n# print(predictions_logits.grad)`,
    'bce': `import torch\nimport torch.nn as nn\n\nloss_fn_bce_logits = nn.BCEWithLogitsLoss()\n\n# Example: Batch of 4 samples, 1 output node (binary classification)\n# Raw scores (logits) from the model (No Sigmoid needed!)\npredictions_logits_bin = torch.randn(4, 1, requires_grad=True) \n\n# Targets MUST be floats (0.0 or 1.0), matching the prediction shape\ntargets_bin = torch.tensor([[1.0], [0.0], [0.0], [1.0]])\n\nloss_bce = loss_fn_bce_logits(predictions_logits_bin, targets_bin)\nprint(f"BCE With Logits Loss: {loss_bce.item()}")`
  };

  const outCode = {
    'ce': `Cross-Entropy Loss: 1.8392105102539062`,
    'bce': `BCE With Logits Loss: 0.7329587936401367`
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Layers className="text-rose-500"/> Classification Losses</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Used when predicting discrete classes. PyTorch seamlessly combines the final activation (Softmax/Sigmoid) inside the loss function itself for numerical stability.
        </p>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setView('ce')}
            className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${view === 'ce' ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <span className="font-bold text-sm">CrossEntropyLoss</span>
            <span className="text-[10px] uppercase">Multi-Class</span>
          </button>

          <button 
            onClick={() => setView('bce')}
            className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${view === 'bce' ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <span className="font-bold text-sm">BCEWithLogitsLoss</span>
            <span className="text-[10px] uppercase">Binary / Multi-Label</span>
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col flex-1 items-center justify-center relative overflow-hidden min-h-[250px]">
          
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Input Requirements</h4>
          
          {view === 'ce' ? (
            <div className="w-full flex flex-col gap-6 animate-in zoom-in-95">
               <div className="flex items-center gap-4">
                 <div className="w-24 font-bold text-sm text-slate-700 text-right">Predictions</div>
                 <div className="flex-1 bg-white border border-slate-300 p-3 rounded-lg shadow-sm">
                   <span className="text-xs font-mono font-bold text-blue-600 block mb-1">Raw Logits [N, C]</span>
                   <span className="text-[10px] text-slate-500">Unnormalized scores. <strong>Do not apply Softmax manually!</strong> CE does it internally.</span>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="w-24 font-bold text-sm text-slate-700 text-right">Targets</div>
                 <div className="flex-1 bg-white border border-slate-300 p-3 rounded-lg shadow-sm">
                   <span className="text-xs font-mono font-bold text-emerald-600 block mb-1">Class Indices [N]</span>
                   <span className="text-[10px] text-slate-500">Integers (LongTensor) from 0 to C-1 representing the correct class.</span>
                 </div>
               </div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-6 animate-in zoom-in-95">
               <div className="flex items-center gap-4">
                 <div className="w-24 font-bold text-sm text-slate-700 text-right">Predictions</div>
                 <div className="flex-1 bg-white border border-slate-300 p-3 rounded-lg shadow-sm">
                   <span className="text-xs font-mono font-bold text-blue-600 block mb-1">Raw Logits [N, *]</span>
                   <span className="text-[10px] text-slate-500">Unnormalized scores. <strong>Do not apply Sigmoid manually!</strong> BCE does it internally.</span>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="w-24 font-bold text-sm text-slate-700 text-right">Targets</div>
                 <div className="flex-1 bg-white border border-slate-300 p-3 rounded-lg shadow-sm">
                   <span className="text-xs font-mono font-bold text-emerald-600 block mb-1">Float Probabilities [N, *]</span>
                   <span className="text-[10px] text-slate-500">Floats (usually 0.0 or 1.0). Must exactly match prediction shape.</span>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto min-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Python Code</span></div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-emerald-100 leading-relaxed overflow-x-auto">
{pyCode[view]}
          </pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[150px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap overflow-x-auto">{outCode[view]}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 4: Choosing & Training Loop ---
function TrainingSlide() {
  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Crosshair className="text-rose-500"/> Choosing the Right Loss</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          The loss function dictates the absolute objective of your model. Choosing incorrectly will guarantee training failure.
        </p>

        <div className="flex flex-col gap-3 flex-1">
           <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
             <h4 className="font-bold text-slate-800 text-sm mb-1">Regression (Continuous)</h4>
             <p className="text-xs text-slate-600 mb-2">Predicting prices, temperatures, coordinates.</p>
             <span className="bg-rose-100 text-rose-800 text-xs font-mono font-bold px-2 py-1 rounded inline-block border border-rose-200">nn.MSELoss()</span>
           </div>

           <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
             <h4 className="font-bold text-slate-800 text-sm mb-1">Binary Classification</h4>
             <p className="text-xs text-slate-600 mb-2">Cat vs Dog, Spam vs Not Spam.</p>
             <span className="bg-rose-100 text-rose-800 text-xs font-mono font-bold px-2 py-1 rounded inline-block border border-rose-200">nn.BCEWithLogitsLoss()</span>
           </div>

           <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
             <h4 className="font-bold text-slate-800 text-sm mb-1">Multi-class (Single correct label)</h4>
             <p className="text-xs text-slate-600 mb-2">MNIST digits (0-9), ImageNet (1000 mutually exclusive classes).</p>
             <span className="bg-rose-100 text-rose-800 text-xs font-mono font-bold px-2 py-1 rounded inline-block border border-rose-200">nn.CrossEntropyLoss()</span>
           </div>

           <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
             <h4 className="font-bold text-slate-800 text-sm mb-1">Multi-label (Multiple correct labels)</h4>
             <p className="text-xs text-slate-600 mb-2">Movie genres (Action AND Comedy AND Sci-Fi).</p>
             <span className="bg-rose-100 text-rose-800 text-xs font-mono font-bold px-2 py-1 rounded inline-block border border-rose-200">nn.BCEWithLogitsLoss()</span>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto min-h-[400px]">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">The Standard Training Loop</span></div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
{`# Assume model, optimizer, dataloader are defined
# Example: Multi-class classification
num_classes = 10
model = nn.Linear(784, num_classes)
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

`}
<span className="text-emerald-300 font-bold bg-emerald-900/30 px-1 border border-emerald-800 rounded block"># 1. Define Loss Function ONCE outside loop
loss_fn = nn.CrossEntropyLoss()</span>
{`
# --- Inside the training loop ---
model.train() # Set to training mode

for batch_idx, (data, target) in enumerate(dataloader):
    
    # A. Zero gradients from previous iteration
    optimizer.zero_grad()

    # B. Forward pass: Get predictions
    predictions = model(data)

`}
<span className="text-rose-300 font-bold bg-rose-900/30 px-1 border border-rose-800 rounded block">    # C. Calculate scalar loss for this batch
    loss = loss_fn(predictions, target)

    # D. Backward pass: Compute gradients 
    # (Triggers chain rule on loss scalar)
    loss.backward()</span>
{`
    # E. Optimizer step: Update weights
    optimizer.step()`}
          </pre>
        </div>
      </div>
    </div>
  );
}