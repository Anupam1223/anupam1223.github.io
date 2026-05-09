import React, { useState, useEffect } from 'react';
import { 
  Settings2, ChevronLeft, ChevronRight, Code, Terminal, 
  Activity, ArrowRight, PlayCircle, Zap, Cpu, Database, 
  RefreshCcw, MoveRight, ArrowDownToLine, TrendingDown
} from 'lucide-react';

export default function OptimizersSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'concept', title: 'The Optimization Process', component: ConceptSlide },
    { id: 'compare', title: 'Common Optimizers', component: OptimizersCompareSlide },
    { id: 'cycle', title: 'The Training Iteration', component: TrainingCycleSlide },
    { id: 'loop', title: 'Integration & Schedulers', component: CodeLoopSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Settings2 size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Optimizers (torch.optim)</h2>
        <p className="text-slate-400 text-sm mb-4">Updating model parameters to minimize loss</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-blue-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-blue-400 whitespace-nowrap' : 'hidden md:inline whitespace-nowrap'}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: The Optimization Process ---
function ConceptSlide() {
  const [step, setStep] = useState(0);

  // Ball position calculation for the parabola visualization
  const x = -4 + step;
  const y = x * x;
  // SVG coordinates mapping
  const svgX = (x + 5) * 20; 
  const svgY = 100 - (y * 4);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <h3 className="text-xl font-bold mb-4">The Optimization Problem</h3>
      <p className="text-slate-600 mb-6 leading-relaxed text-sm">
        Training a neural network means finding the parameters (weights and biases) that minimize the loss function. 
        Gradients indicate the <strong>direction</strong> of steepest ascent. Optimizers take a step in the <strong>opposite</strong> direction.
      </p>

      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 flex-1">
        
        {/* Math & Equation */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center relative">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Gradient Descent Rule</h4>
          
          <div className="flex items-center justify-center text-2xl font-serif text-slate-800 mb-8 whitespace-nowrap">
             <span>θ<sub>new</sub></span>
             <span className="mx-3">=</span>
             <span>θ<sub>old</sub></span>
             <span className="mx-3 text-rose-500 font-bold">-</span>
             <span className="text-blue-600 font-bold flex items-center">η <span className="text-emerald-600 ml-1">∇L</span></span>
          </div>

          <ul className="text-sm space-y-4 text-slate-600">
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center font-serif font-bold text-slate-700">θ</div>
              <span><strong>Parameter</strong> (Weight or Bias)</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center font-serif font-bold text-emerald-700">∇L</div>
              <span><strong>Gradient</strong> of Loss w.r.t θ</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center font-serif font-bold text-blue-700">η</div>
              <span><strong>Learning Rate</strong> (Step size)</span>
            </li>
          </ul>
        </div>

        {/* Visualizer */}
        <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
          
          <button 
            onClick={() => setStep(s => s >= 4 ? 0 : s + 1)}
            className="mb-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {step === 4 ? "Reset" : "Take Optimizer Step"} <ArrowDownToLine size={16}/>
          </button>

          <div className="relative w-full max-w-[300px] h-48 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center">
             
             <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible p-4">
                {/* Parabola */}
                <path d="M 0 0 Q 100 200 200 0" fill="none" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                
                {/* Rolling Ball */}
                <circle 
                  cx={svgX} 
                  cy={svgY} 
                  r="8" 
                  fill="#2563eb" 
                  className="transition-all duration-500 ease-out" 
                />

                {/* Gradient Arrow */}
                {step < 4 && (
                  <path 
                    d={`M ${svgX} ${svgY} L ${svgX + 20} ${svgY + (y > 4 ? 30 : 15)}`} 
                    stroke="#059669" 
                    strokeWidth="3" 
                    markerEnd="url(#arrow-emerald)"
                    className="transition-all duration-500 ease-out"
                  />
                )}
                
                <defs>
                  <marker id="arrow-emerald" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#059669" />
                  </marker>
                </defs>
             </svg>
             
             {step === 4 && <div className="absolute top-4 bg-emerald-100 text-emerald-800 px-3 py-1 rounded text-xs font-bold border border-emerald-300 animate-in slide-in-from-top-2">Convergence Reached!</div>}
          </div>

        </div>

      </div>
    </div>
  );
}

// --- Slide 2: Common Optimizers ---
function OptimizersCompareSlide() {
  const [view, setView] = useState('sgd');

  const pyCode = {
    'sgd': `import torch.optim as optim\n\n# Classic Stochastic Gradient Descent\n# Operates on mini-batches\noptimizer = optim.SGD(\n    model.parameters(), \n    lr=0.01,           # Step size (η)\n    momentum=0.9,      # Dampens oscillations\n    weight_decay=1e-4  # L2 Regularization\n)`,
    'adam': `import torch.optim as optim\n\n# Adaptive Moment Estimation (Adam)\n# Adapts learning rates for individual parameters\noptimizer = optim.Adam(\n    model.parameters(),\n    lr=0.001,             # Initial learning rate\n    betas=(0.9, 0.999),   # Momentum decay rates\n    weight_decay=1e-5     # L2 Regularization\n)`
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Common Optimizers</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          PyTorch implements optimization algorithms in the <code>torch.optim</code> module. To instantiate one, you must provide it with the <code>model.parameters()</code> it needs to update.
        </p>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setView('sgd')}
            className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${view === 'sgd' ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <span className="font-bold text-sm">SGD</span>
            <span className="text-[10px] uppercase text-center">Stochastic Gradient Descent</span>
          </button>

          <button 
            onClick={() => setView('adam')}
            className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${view === 'adam' ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <span className="font-bold text-sm">Adam</span>
            <span className="text-[10px] uppercase text-center">Adaptive Moment Estimation</span>
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col flex-1 relative overflow-hidden">
          
          {view === 'sgd' ? (
            <div className="flex flex-col gap-4 animate-in slide-in-from-left-4">
               <h4 className="text-sm font-bold text-blue-900 border-b border-blue-200 pb-2">SGD Hyperparameters</h4>
               <ul className="text-sm text-slate-700 space-y-4">
                 <li><strong className="font-mono text-blue-700 bg-blue-100 px-1 rounded">lr</strong>: Learning rate. Critical to tune. Too large = divergence; too small = slow.</li>
                 <li><strong className="font-mono text-blue-700 bg-blue-100 px-1 rounded">momentum</strong>: Adds a fraction of the previous update to the current one. Helps push through shallow valleys and dampens zigzagging.</li>
                 <li><strong className="font-mono text-blue-700 bg-blue-100 px-1 rounded">weight_decay</strong>: Implicitly adds L2 regularization to prevent weights from growing too large (combats overfitting).</li>
               </ul>
            </div>
          ) : (
            <div className="flex flex-col gap-4 animate-in slide-in-from-right-4">
               <h4 className="text-sm font-bold text-blue-900 border-b border-blue-200 pb-2">Adam Hyperparameters</h4>
               <ul className="text-sm text-slate-700 space-y-4">
                 <li><strong className="font-mono text-blue-700 bg-blue-100 px-1 rounded">lr</strong>: Usually starts smaller (e.g., 0.001) because Adam adapts it dynamically per-parameter.</li>
                 <li><strong className="font-mono text-blue-700 bg-blue-100 px-1 rounded">betas</strong>: Tuple controlling the exponential decay rates for computing running averages of gradients and squared gradients.</li>
                 <li><strong className="font-mono text-blue-700 bg-blue-100 px-1 rounded">eps</strong>: Tiny constant added to prevent division by zero errors.</li>
               </ul>
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
      </div>
    </div>
  );
}

// --- Slide 3: The Training Cycle (Screenshot Diagram Recreation) ---
function TrainingCycleSlide() {
  const [step, setStep] = useState(0); // 0: Init, 1: zero_grad, 2: forward, 3: loss, 4: backward, 5: step

  useEffect(() => {
    let timer;
    if (step > 0 && step <= 5) {
      timer = setTimeout(() => {
        setStep(s => s === 5 ? 1 : s + 1); // Loop back to 1 for continuous play
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [step]);

  // Diagram Layout Mapping (Fixed coordinates for a 1000x400 SVG box)
  const cx = {
    zero: 120, fwd: 320, loss: 520, bwd: 720, step: 920,
    paramGrads: 820, modelParams: 420, opt: 620
  };
  const cy = {
    seq: 140, // Top row sequence
    data: 240, // Mid row data 
    base: 320 // Bottom row config
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden pb-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2">The Training Iteration</h3>
          <p className="text-slate-600 text-sm">Visualizing the standard training loop and where the Optimizer fits in.</p>
        </div>
        <button 
          onClick={() => setStep(step === 0 ? 1 : 0)} 
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          {step === 0 ? "Play Cycle Animation" : "Stop Animation"} <PlayCircle size={18} />
        </button>
      </div>

      {/* The Diagram Container */}
      <div className="bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center flex-1 relative overflow-x-auto overflow-y-hidden rounded-xl">
         
         <div style={{ minWidth: 1040, height: 400, position: 'relative' }} className="my-auto mx-4">
            
            {/* The "Training Iteration" Backing Box */}
            <div className="absolute border border-slate-400 bg-slate-50/50" style={{ left: 20, top: 40, width: 1000, height: 150 }}>
               <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-sans text-slate-700">Training Iteration</span>
            </div>

            {/* SVG Edges connecting nodes */}
            <svg width="1040" height="400" className="absolute inset-0 pointer-events-none">
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#475569" />
                </marker>
                <marker id="arrowHighlight" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
                </marker>
              </defs>

              {/* Main Sequence Arrows */}
              <path d={`M ${cx.zero+80} ${cy.seq} L ${cx.fwd-70} ${cy.seq}`} stroke={step === 2 ? '#3b82f6' : '#475569'} strokeWidth={step === 2 ? 3 : 1.5} fill="none" markerEnd={step === 2 ? "url(#arrowHighlight)" : "url(#arrow)"} className="transition-all" />
              <text x={(cx.zero+cx.fwd)/2} y={cy.seq - 8} textAnchor="middle" fontSize="10" fill="#475569">next iteration</text>

              <path d={`M ${cx.fwd+80} ${cy.seq} L ${cx.loss-70} ${cy.seq}`} stroke={step === 3 ? '#3b82f6' : '#475569'} strokeWidth={step === 3 ? 3 : 1.5} fill="none" markerEnd={step === 3 ? "url(#arrowHighlight)" : "url(#arrow)"} className="transition-all" />
              <text x={(cx.fwd+cx.loss)/2} y={cy.seq - 8} textAnchor="middle" fontSize="10" fill="#475569">next iteration</text>

              <path d={`M ${cx.loss+80} ${cy.seq} L ${cx.bwd-80} ${cy.seq}`} stroke={step === 4 ? '#3b82f6' : '#475569'} strokeWidth={step === 4 ? 3 : 1.5} fill="none" markerEnd={step === 4 ? "url(#arrowHighlight)" : "url(#arrow)"} className="transition-all" />
              <text x={(cx.loss+cx.bwd)/2} y={cy.seq - 8} textAnchor="middle" fontSize="10" fill="#475569">next iteration</text>

              <path d={`M ${cx.bwd+80} ${cy.seq} L ${cx.step-70} ${cy.seq}`} stroke={step === 5 ? '#3b82f6' : '#475569'} strokeWidth={step === 5 ? 3 : 1.5} fill="none" markerEnd={step === 5 ? "url(#arrowHighlight)" : "url(#arrow)"} className="transition-all" />
              <text x={(cx.bwd+cx.step)/2} y={cy.seq - 8} textAnchor="middle" fontSize="10" fill="#475569">next iteration</text>

              {/* Loop Back Arrow (top) */}
              <path d={`M ${cx.step} 110 Q ${cx.step} 80 ${(cx.step+cx.zero)/2} 80 Q ${cx.zero} 80 ${cx.zero} 110`} stroke={step === 1 ? '#3b82f6' : '#475569'} strokeWidth={step === 1 ? 3 : 1.5} fill="none" markerEnd={step === 1 ? "url(#arrowHighlight)" : "url(#arrow)"} className="transition-all" />
              <text x={(cx.step+cx.zero)/2} y={75} textAnchor="middle" fontSize="10" fill="#475569">next iteration</text>

              {/* loss.backward() -> Parameter Gradients */}
              <path d={`M ${cx.bwd} 160 L ${cx.paramGrads-30} 220`} stroke={step === 4 ? '#f59e0b' : '#475569'} strokeWidth={step === 4 ? 3 : 1.5} fill="none" markerEnd={step === 4 ? "url(#arrow)" : "url(#arrow)"} className="transition-all" />
              <text x={730} y={190} fontSize="10" fill="#475569">Populates</text>

              {/* Parameter Gradients -> optimizer.step() */}
              <path d={`M ${cx.paramGrads+30} 220 L ${cx.step-10} 165`} stroke={step === 5 ? '#f59e0b' : '#475569'} strokeWidth={step === 5 ? 3 : 1.5} strokeDasharray="4,4" fill="none" markerEnd={step === 5 ? "url(#arrow)" : "url(#arrow)"} className="transition-all" />
              <text x={870} y={190} fontSize="10" fill="#475569">Reads</text>

              {/* optimizer.step() -> Model Parameters */}
              <path d={`M ${cx.step} 165 Q ${cx.step} 280 ${(cx.step+cx.modelParams)/2} 280 L ${cx.modelParams+80} 280`} stroke={step === 5 ? '#3b82f6' : '#475569'} strokeWidth={step === 5 ? 3 : 1.5} fill="none" markerEnd={step === 5 ? "url(#arrowHighlight)" : "url(#arrow)"} className="transition-all" />
              <text x={700} y={275} fontSize="10" fill="#475569">Modifies</text>

              {/* Model Parameters -> Optimizer */}
              <path d={`M ${cx.modelParams+60} 320 L ${cx.opt-70} 320`} stroke="#475569" strokeWidth="1.5" strokeDasharray="4,4" fill="none" markerEnd="url(#arrow)" />
              <text x={(cx.modelParams+cx.opt)/2} y={315} textAnchor="middle" fontSize="10" fill="#475569">Passed at init</text>

              {/* Optimizer -> zero_grad */}
              <path d={`M ${cx.opt-70} 330 Q ${cx.zero} 330 ${cx.zero} 165`} stroke={step === 1 ? '#3b82f6' : '#475569'} strokeWidth={step === 1 ? 3 : 1.5} strokeDasharray="4,4" fill="none" markerEnd={step === 1 ? "url(#arrowHighlight)" : "url(#arrow)"} className="transition-all" />
              <text x={260} y={325} textAnchor="middle" fontSize="10" fill="#475569">Clears .grad</text>
            </svg>

            {/* HTML Nodes */}
            <div className="absolute inset-0 pointer-events-none">
              
              {/* Sequence Nodes (Rounded rects) */}
              {['zero', 'fwd', 'loss', 'bwd', 'step'].map((key, i) => {
                const isActive = step === i + 1;
                const labels = [
                  "optimizer.zero_grad()", 
                  "Forward Pass\n(model output)", 
                  "Calculate Loss\n(criterion)", 
                  "loss.backward()\n(Compute Gradients)", 
                  "optimizer.step()\n(Update Weights)"
                ];
                return (
                  <div key={key} className={`absolute flex flex-col items-center justify-center font-sans text-[11px] text-center px-2 border border-slate-500 rounded-2xl shadow-sm transition-all duration-300 ${isActive ? 'bg-blue-100 ring-2 ring-blue-400 scale-110 font-bold z-20' : 'bg-[#e9ecef] z-10'}`} style={{ left: cx[key]-70, top: cy.seq-25, width: 140, height: 50, whiteSpace: 'pre-line' }}>
                    {labels[i]}
                  </div>
                );
              })}

              {/* Parameter Gradients (Yellow Note) */}
              <div className={`absolute flex flex-col items-center justify-center font-sans text-[11px] text-center px-2 border border-slate-500 rounded-sm rounded-br-2xl shadow-sm transition-all duration-300 ${step === 4 || step === 5 ? 'bg-amber-100 ring-2 ring-amber-400 scale-105 z-20 font-bold' : 'bg-[#fff3cd] z-10'}`} style={{ left: cx.paramGrads-70, top: cy.data-25, width: 140, height: 50 }}>
                Parameter Gradients<br/>(.grad attribute)
              </div>

              {/* Model Parameters (Purple Cylinder look-alike) */}
              <div className={`absolute flex flex-col items-center justify-center font-sans text-[11px] text-center px-2 border border-slate-500 rounded-[50%_50%_10%_10%/10%_10%_10%_10%] shadow-sm transition-all duration-300 ${step === 5 || step === 2 ? 'bg-purple-200 ring-2 ring-purple-400 scale-105 z-20 font-bold' : 'bg-[#e0c3fc] z-10'}`} style={{ left: cx.modelParams-70, top: cy.base-40, width: 140, height: 70 }}>
                Model Parameters<br/>(Weights, Biases)
              </div>

              {/* Optimizer (Green Arrow shape using clip-path) */}
              <div className="absolute flex flex-col items-center justify-center font-sans text-[11px] text-center px-4 py-2 border border-slate-500 shadow-sm bg-[#c3f0c2] z-10" style={{ left: cx.opt-70, top: cy.base-25, width: 140, height: 50, clipPath: 'polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)' }}>
                <span className="font-bold">Optimizer</span><br/>(e.g., Adam, SGD)
              </div>

              {/* TrainingLoop label */}
              <div className="absolute bg-[#5c5c5c] text-white font-sans text-xs font-bold px-3 py-1 rounded shadow-md z-10" style={{ left: 510, top: 265 }}>
                TrainingLoop
              </div>

            </div>

         </div>
      </div>
    </div>
  );
}

// --- Slide 4: Integration & Loop Code ---
function CodeLoopSlide() {
  return (
    <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Integrating the Cycle</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          A standard PyTorch training loop processes data in mini-batches. Because PyTorch accumulates gradients by default, calling <code>optimizer.zero_grad()</code> is mandatory before computing gradients for a new batch.
        </p>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm mb-6">
          <h4 className="font-bold text-emerald-900 text-sm mb-2 flex items-center gap-2"><TrendingDown size={16}/> Learning Rate Schedulers</h4>
          <p className="text-xs text-emerald-800 leading-relaxed mb-3">
            Sometimes, it's beneficial to decrease the learning rate as training progresses to fine-tune convergence. PyTorch provides <code>torch.optim.lr_scheduler</code> for this.
          </p>
          <div className="bg-white p-2 rounded border border-emerald-200 font-mono text-[10px] text-emerald-900">
            scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=30, gamma=0.1)<br/><br/>
            # Inside loop (after optimizer.step()):<br/>
            scheduler.step()
          </div>
        </div>

      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto min-h-[400px]">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">The Complete Training Loop</span></div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
{`# 1. Define Model, Loss Function, and Optimizer
model = MyNeuralNetwork()
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Set model to training mode (important for Dropout/BatchNorm)
model.train() 

# Loop over epochs (entire dataset passes)
for epoch in range(num_epochs):

    # Loop over mini-batches
    for inputs, targets in data_loader:
        
        # 1. Zero out gradients from previous batch
`}
<span className="text-emerald-300 font-bold bg-emerald-900/30 px-1 border border-emerald-800 rounded block">        optimizer.zero_grad()</span>
{`
        # 2. Forward pass: compute model predictions
        outputs = model(inputs)

        # 3. Calculate the scalar loss
        loss = criterion(outputs, targets)

        # 4. Backward pass: compute gradients (.grad)
`}
<span className="text-rose-300 font-bold bg-rose-900/30 px-1 border border-rose-800 rounded block">        loss.backward()</span>
{`
        # 5. Update weights based on computed gradients
`}
<span className="text-blue-300 font-bold bg-blue-900/30 px-1 border border-blue-800 rounded block">        optimizer.step()</span>
          </pre>
        </div>
      </div>
    </div>
  );
}