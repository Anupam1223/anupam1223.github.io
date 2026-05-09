import React, { useState, useEffect } from 'react';
import { 
  Rewind, ChevronLeft, ChevronRight, Code, Terminal, 
  AlertTriangle, CheckCircle2, Pointer, Network, 
  Calculator, Database, PlusSquare, RefreshCw, Wrench, ArrowRight
} from 'lucide-react';

export default function BackwardSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'backward', title: 'Computing Gradients (.backward)', component: BackwardSlide },
    { id: 'accum', title: 'Gradient Accumulation', component: AccumulationSlide },
    { id: 'step', title: 'Updating Weights (.step)', component: OptimizerStepSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Rewind size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Backpropagation & Optimizers</h2>
        <p className="text-slate-400 text-sm mb-4">Computing gradients and updating model parameters</p>
        
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
            <span key={idx} className={idx === currentSlide ? 'text-rose-400 whitespace-nowrap font-bold' : 'hidden md:inline whitespace-nowrap'}>
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

// --- Slide 1: Computing Gradients (.backward) ---
function BackwardSlide() {
  const [step, setStep] = useState(0);

  const explanations = [
    <span><strong>Step 1: Forward Pass Complete.</strong> A computation graph has been dynamically built. The parameters (Weights & Biases) have <code>requires_grad=True</code>, but their <code>.grad</code> attributes are currently empty.</span>,
    <span><strong>Step 2: Trigger Autograd.</strong> Calling <code>loss.backward()</code> initiates a traversal <em>backward</em> through the graph (dotted lines). It uses the chain rule to calculate partial derivatives (∂L/∂θ).</span>,
    <span><strong>Step 3: Gradients Stored.</strong> The computed gradients representing the sensitivity of the loss to each parameter are stored directly in their respective <code>.grad</code> attributes!</span>
  ];

  const pyCode = `import torch\nimport torch.nn as nn\n\n# Instantiate a simple model (1 feature in, 1 out)\nmodel = nn.Linear(1, 1)\n\n# ... Forward pass & loss calculation ...\ninputs = torch.tensor([[2.0]])\ntargets = torch.tensor([[10.0]])\n\npredictions = model(inputs)\nloss = nn.MSELoss()(predictions, targets)\n\nprint(f"Weight grad before: {model.weight.grad}")\nprint(f"Bias grad before: {model.bias.grad}")\n\n# Compute Gradients via Backpropagation!\nloss.backward()\n\n# Gradients are now populated in the leaf nodes\nprint(f"\\nWeight grad after: {model.weight.grad}")\nprint(f"Bias grad after: {model.bias.grad}")`;

  const outCode = step < 2 
    ? `Weight grad before: None\nBias grad before: None\n...` 
    : `Weight grad before: None\nBias grad before: None\n\nWeight grad after: tensor([[-14.42]])\nBias grad after: tensor([-7.21])`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Backpropagation: Computing Gradients</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Calling <code>loss.backward()</code> triggers PyTorch's Autograd engine. It traverses the computation graph backwards, calculating the partial derivative (∂L/∂θ) for every parameter that contributed to the loss.
        </p>

        <button 
          onClick={() => setStep(s => (s + 1) % 3)} 
          className="w-full py-3 mb-6 bg-rose-500 text-white rounded-lg text-sm font-bold hover:bg-rose-600 shadow transition-all flex justify-center items-center gap-2 flex-shrink-0"
        >
          {step === 0 ? "Step 1: Graph Built (Click to Run .backward)" : step === 1 ? "Step 2: Backpropagate! (Click to Store Grads)" : "Step 3: Gradients Populated (Click to Reset)"} <Pointer size={16}/>
        </button>

        <div className="bg-rose-50 border border-rose-200 text-rose-900 text-xs p-4 rounded-xl mb-6 shadow-sm min-h-[70px] animate-in fade-in flex items-center">
          {explanations[step]}
        </div>

        {/* Interactive Visualizer */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col flex-1 items-center justify-center relative overflow-hidden min-h-[250px]">
           <div className="w-full max-w-sm relative h-48">
              
              {/* Nodes */}
              <div className="absolute top-4 left-4 w-20 h-16 bg-blue-100 border-2 border-blue-400 rounded-xl flex flex-col items-center justify-center shadow text-blue-900 z-10">
                <span className="font-bold text-sm">Weights</span>
                <span className={`text-[10px] font-mono font-bold mt-1 px-1 rounded transition-colors ${step >= 2 ? 'bg-emerald-200 text-emerald-800' : 'bg-white/50 text-slate-500'}`}>.grad {step >= 2 ? '✓' : '∅'}</span>
              </div>

              <div className="absolute top-32 left-4 w-20 h-16 bg-blue-100 border-2 border-blue-400 rounded-xl flex flex-col items-center justify-center shadow text-blue-900 z-10">
                <span className="font-bold text-sm">Biases</span>
                <span className={`text-[10px] font-mono font-bold mt-1 px-1 rounded transition-colors ${step >= 2 ? 'bg-emerald-200 text-emerald-800' : 'bg-white/50 text-slate-500'}`}>.grad {step >= 2 ? '✓' : '∅'}</span>
              </div>

              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-24 h-12 bg-amber-100 border-2 border-amber-400 rounded-full flex flex-col items-center justify-center shadow text-amber-900 z-10">
                <span className="font-bold text-sm">Model Op</span>
              </div>

              <div className="absolute top-16 right-4 w-20 h-16 bg-rose-100 border-2 border-rose-500 rounded-[100%] flex flex-col items-center justify-center shadow-lg text-rose-900 z-10">
                <span className="font-bold font-mono text-sm">Loss (L)</span>
              </div>

              {/* Forward Edges (Solid) */}
              <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                <defs>
                  <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" fill="#64748b" />
                  </marker>
                  <marker id="arrowheadRed" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" fill="#ef4444" />
                  </marker>
                </defs>
                <path d="M 85 45 Q 140 60 175 75" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
                <path d="M 85 155 Q 140 140 175 105" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
                <path d="M 255 90 L 305 90" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
              </svg>

              {/* Backward Edges (Dashed Red) */}
              {step >= 1 && (
                <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none animate-in fade-in">
                  {/* Loss back to Model */}
                  <path d="M 315 105 L 265 105" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" fill="none" markerEnd="url(#arrowheadRed)"/>
                  <text x="290" y="125" fontSize="10" fill="#ef4444" fontWeight="bold" textAnchor="middle">∂L/∂y</text>

                  {/* Model back to Weights */}
                  <path d="M 165 75 Q 140 30 95 30" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" fill="none" markerEnd="url(#arrowheadRed)"/>
                  <text x="130" y="45" fontSize="10" fill="#ef4444" fontWeight="bold" textAnchor="middle">∂L/∂W</text>

                  {/* Model back to Biases */}
                  <path d="M 165 105 Q 140 170 95 170" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" fill="none" markerEnd="url(#arrowheadRed)"/>
                  <text x="130" y="165" fontSize="10" fill="#ef4444" fontWeight="bold" textAnchor="middle">∂L/∂B</text>
                </svg>
              )}
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[350px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[150px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: Gradient Accumulation ---
function AccumulationSlide() {
  const [passes, setPasses] = useState(0);

  const pyCode = `import torch

# Parameter with tracking
w = torch.tensor(3.0, requires_grad=True)
x = torch.tensor(2.0)

# Simulate 3 batches without clearing gradients
for i in range(3):
    loss = w * x
    loss.backward()
    print(f"Pass {i+1} w.grad: {w.grad}")

# Explicitly clear them (Crucial for training loops!)
# In practice: optimizer.zero_grad()
w.grad.zero_()
print(f"After zero_(): {w.grad}")`;

  const outCode = `Pass 1 w.grad: 2.0\nPass 2 w.grad: 4.0\nPass 3 w.grad: 6.0\nAfter zero_(): 0.0`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Gradient Accumulation</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          When you call <code>loss.backward()</code>, PyTorch does <strong>not</strong> overwrite previous gradients. It <strong>accumulates (adds)</strong> the newly computed gradients to the existing <code>.grad</code> attribute. 
        </p>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setPasses(p => Math.min(p + 1, 3))}
            disabled={passes >= 3}
            className="flex-1 py-3 bg-rose-500 text-white rounded-lg text-sm font-bold hover:bg-rose-600 shadow disabled:opacity-50 flex justify-center items-center gap-2 transition-all"
          >
            <PlusSquare size={16}/> loss.backward()
          </button>
          <button 
            onClick={() => setPasses(0)}
            className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-300 shadow flex justify-center items-center gap-2 transition-all"
          >
            <RefreshCw size={16}/> optimizer.zero_grad()
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center flex-1 relative overflow-hidden shadow-inner">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 text-center">Memory Buffer for <code>w.grad</code></h4>
          
          <div className="relative w-32 h-40 border-4 border-slate-300 rounded-b-xl rounded-t-sm flex items-end justify-center overflow-hidden bg-white">
            
            {/* The "Liquid" accumulating */}
            <div 
              className="absolute bottom-0 w-full bg-rose-400 transition-all duration-500 ease-out flex items-center justify-center flex-col"
              style={{ height: `${(passes / 3) * 100}%` }}
            >
            </div>
            
            {/* The Value Text */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-mono font-black text-3xl z-10 transition-colors duration-500 ${passes > 1 ? 'text-white' : 'text-slate-400'}`}>
              {(passes * 2).toFixed(1)}
            </div>
            
            {/* Markers */}
            <div className="absolute left-0 w-full h-full flex flex-col justify-between pointer-events-none">
              <div className="border-t-2 border-slate-300/30 w-4"></div>
              <div className="border-t-2 border-slate-300/30 w-4"></div>
              <div className="border-t-2 border-slate-300/30 w-4"></div>
              <div className="border-t-2 border-slate-300/30 w-4"></div>
            </div>
          </div>

          <div className="mt-6 h-8">
            {passes > 0 && (
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1.5 rounded-full animate-in slide-in-from-bottom-2">
                + 2.0 added to accumulator!
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[200px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">
            {passes >= 1 ? `Pass 1 w.grad: 2.0\n` : ''}
            {passes >= 2 ? `Pass 2 w.grad: 4.0\n` : ''}
            {passes >= 3 ? `Pass 3 w.grad: 6.0\n` : ''}
            {passes === 0 && `After zero_(): 0.0`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Updating Weights (Optimizer Step) ---
function OptimizerStepSlide() {
  const [step, setStep] = useState(0);

  const pyCode = `import torch\nimport torch.optim as optim\n\n# Initialize a parameter and an optimizer\nw = torch.tensor([0.8], requires_grad=True)\noptimizer = optim.SGD([w], lr=0.1)\n\n# Simulate computing a loss and running backward()\n# This populates w.grad\nw.grad = torch.tensor([2.0])\n\nprint(f"Weight before step: {w.data}")\n\n# The Optimizer performs the math:\n# w_new = w_old - (lr * w.grad)\noptimizer.step()\n\nprint(f"Weight after step: {w.data}")`;

  return (
    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Updating Weights (optimizer.step)</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Once the gradients (<strong>∇L</strong>) are computed and stored in the <code>.grad</code> attributes, we must move the parameters in the <strong>opposite</strong> direction of the gradient to minimize the loss. The optimizer's <code>.step()</code> method handles this math.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center flex-1 shadow-inner relative overflow-hidden">
           
           <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-200 w-full text-center pb-2">The Parameter Update Rule (SGD)</h4>

           {/* The Mathematical Formula */}
           <div className="flex items-center gap-4 text-2xl font-serif text-slate-800 mb-10 w-full justify-center font-bold">
              <span className="text-emerald-600 border-b-2 border-emerald-300">θ<sub>new</sub></span>
              <span>=</span>
              <span className="text-blue-600">θ<sub>old</sub></span>
              <span className="text-rose-500">-</span>
              <span className="text-amber-500">(η</span>
              <span>×</span>
              <span className="text-rose-500">∇<sub>θ</sub>L)</span>
           </div>

           {/* Interactive Execution */}
           <div className="w-full max-w-md flex flex-col items-center">
             
             {/* The Values */}
             <div className="flex items-center gap-4 mb-6 font-mono text-sm w-full justify-center">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">w.data (θ_old)</span>
                  <div className={`px-4 py-2 border-2 rounded-lg font-bold transition-all duration-500 ${step === 2 ? 'bg-slate-100 text-slate-400 border-slate-300 line-through' : 'bg-blue-100 text-blue-800 border-blue-400'}`}>0.8</div>
                </div>
                
                <span className="font-bold text-slate-400 mt-5">-</span>
                
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">lr (η)</span>
                  <div className="px-4 py-2 bg-amber-100 text-amber-800 border-2 border-amber-400 rounded-lg font-bold">0.1</div>
                </div>

                <span className="font-bold text-slate-400 mt-5">×</span>

                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">w.grad (∇L)</span>
                  <div className="px-4 py-2 bg-rose-100 text-rose-800 border-2 border-rose-400 rounded-lg font-bold">2.0</div>
                </div>
             </div>

             <div className="h-8 mb-4 w-full flex justify-center">
               {step >= 1 && (
                 <div className="flex items-center gap-2 text-rose-600 font-mono text-xs font-bold animate-in slide-in-from-top-2">
                    <ArrowRight size={14}/> 0.1 × 2.0 = <span className="bg-rose-100 px-2 py-0.5 rounded border border-rose-200">0.2</span>
                 </div>
               )}
             </div>

             {/* Action Button */}
             <button 
                onClick={() => setStep(s => (s + 1) % 3)}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
             >
                {step === 0 ? "Execute optimizer.step()" : step === 1 ? "Apply Update" : "Reset"} <Wrench size={18}/>
             </button>

             <div className="h-16 mt-6 w-full flex justify-center items-center">
               {step === 2 && (
                 <div className="flex flex-col items-center animate-in slide-in-from-bottom-4">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase mb-1 tracking-widest">New Weight Data</span>
                    <div className="text-3xl font-mono font-black text-emerald-600 bg-emerald-100 px-6 py-2 rounded-xl shadow-inner border border-emerald-300">
                      0.6
                    </div>
                 </div>
               )}
             </div>

           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[150px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">
            {step === 0 ? "Weight before step: tensor([0.8000])\n" : `Weight before step: tensor([0.8000])\n\nWeight after step: tensor([0.6000])`}
          </pre>
        </div>
      </div>
    </div>
  );
}