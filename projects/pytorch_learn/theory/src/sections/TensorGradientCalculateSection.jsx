import React, { useState, useEffect } from 'react';
import { 
  ToggleRight, ChevronLeft, ChevronRight, Code, Terminal, 
  AlertTriangle, CheckCircle2, Pointer, Activity, GitMerge, FileDigit
} from 'lucide-react';

export default function RequiresGradSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'default', title: 'The requires_grad Flag', component: DefaultBehaviorSlide },
    { id: 'enabling', title: 'Enabling Gradient Tracking', component: EnablingSlide },
    { id: 'propagation', title: 'Propagation & grad_fn', component: PropagationSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <ToggleRight size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Tensors and Gradient Calculation</h2>
        <p className="text-slate-400 text-sm mb-4">Controlling Autograd with the requires_grad attribute</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-blue-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-blue-400' : 'hidden md:inline'}>
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

// --- Slide 1: Default Behavior ---
function DefaultBehaviorSlide() {
  const pyCode = `import torch\n\n# Default behavior: requires_grad is False\nx = torch.tensor([1.0, 2.0, 3.0])\nprint(f"Tensor x: {x}")\nprint(f"x.requires_grad: {x.requires_grad}")\n\n# Create another tensor explicitly setting requires_grad to False\ny = torch.tensor([4.0, 5.0, 6.0], requires_grad=False)\nprint(f"\\nTensor y: {y}")\nprint(f"y.requires_grad: {y.requires_grad}")`;
  const outCode = `Tensor x: tensor([1., 2., 3.])\nx.requires_grad: False\n\nTensor y: tensor([4., 5., 6.])\ny.requires_grad: False`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">The requires_grad Attribute</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Every PyTorch tensor possesses a boolean attribute called <code>requires_grad</code>. This flag signals Autograd whether operations involving this tensor should be recorded to compute gradients later.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center flex-1 min-h-[200px]">
          <div className="flex flex-col items-center gap-4 w-full max-w-xs">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Default State</h4>
            
            {/* Visual Toggle */}
            <div className="bg-white border border-slate-300 rounded-xl p-4 w-full flex items-center justify-between shadow-sm">
              <span className="font-mono font-bold text-slate-700">requires_grad</span>
              <div className="w-14 h-8 bg-slate-200 rounded-full p-1 transition-colors flex items-center shadow-inner">
                <div className="w-6 h-6 bg-white rounded-full shadow-sm border border-slate-300"></div>
              </div>
            </div>
            
            <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded border border-blue-200 mt-2 text-center leading-relaxed">
              <strong>Why default to False?</strong> Memory Efficiency! Input data and labels are fixed; tracking operations for them needlessly wastes memory and computation.
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[150px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: Enabling ---
function EnablingSlide() {
  const [view, setView] = useState('creation');

  const pyCode = {
    'creation': `# Enable gradient tracking at creation time\nw = torch.tensor([0.5, -1.0], requires_grad=True)\n\nprint(f"Tensor w: {w}")\nprint(f"w.requires_grad: {w.requires_grad}")`,
    'inplace': `b = torch.tensor([0.1])\nprint(f"b.requires_grad (before): {b.requires_grad}")\n\n# Enable gradient tracking after creation (in-place)\nb.requires_grad_(True)\n\nprint(f"\\nb.requires_grad (after): {b.requires_grad}")`,
    'integer': `try:\n    # Gradients are only meaningful for continuous numbers\n    int_tensor = torch.tensor([1, 2], dtype=torch.int64, requires_grad=True)\nexcept RuntimeError as e:\n    print(f"Error setting requires_grad on integer tensor:\\n{e}")`
  };

  const outCode = {
    'creation': `Tensor w: tensor([ 0.5000, -1.0000], requires_grad=True)\nw.requires_grad: True`,
    'inplace': `b.requires_grad (before): False\n\nb.requires_grad (after): True`,
    'integer': `Error setting requires_grad on integer tensor:\nOnly Tensors of floating point and complex dtype can require gradients`
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Enabling Gradient Tracking</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          To instruct PyTorch to track operations for a tensor (e.g., a model weight), set its flag to <code>True</code>.
        </p>

        <div className="space-y-2 mb-6">
          <button onClick={() => setView('creation')} className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'creation' ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 text-slate-600'}`}>
            <span>1. During Creation</span>
            {view === 'creation' && <CheckCircle2 size={16} className="text-blue-500" />}
          </button>
          <button onClick={() => setView('inplace')} className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'inplace' ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 text-slate-600'}`}>
            <span>2. In-Place Method <code>.requires_grad_()</code></span>
            {view === 'inplace' && <CheckCircle2 size={16} className="text-blue-500" />}
          </button>
          <button onClick={() => setView('integer')} className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'integer' ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold' : 'border-slate-200 text-slate-600'}`}>
            <span><AlertTriangle size={14} className="inline mr-1 text-rose-500"/> Important Note: Integers</span>
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-h-[140px]">
          {view === 'creation' || view === 'inplace' ? (
            <div className="flex flex-col items-center animate-in zoom-in-95">
               <div className="bg-white border-2 border-blue-400 rounded-xl p-4 w-64 flex items-center justify-between shadow-sm">
                 <span className="font-mono font-bold text-blue-700">requires_grad</span>
                 <div className="w-14 h-8 bg-blue-500 rounded-full p-1 transition-colors flex items-center justify-end shadow-inner">
                   <div className="w-6 h-6 bg-white rounded-full shadow-sm border border-blue-600"></div>
                 </div>
               </div>
               {view === 'inplace' && <span className="text-[10px] text-blue-600 mt-2 font-bold uppercase tracking-widest">Note the trailing underscore: _()</span>}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center animate-in fade-in">
               <div className="bg-rose-100 text-rose-800 p-4 rounded-xl border border-rose-300">
                  <h4 className="font-bold flex items-center justify-center gap-2 mb-2"><FileDigit size={18}/> Floats Only!</h4>
                  <p className="text-xs leading-relaxed">
                    Gradients involve continuous changes. Attempting to set <code>requires_grad=True</code> on integer or boolean tensors will raise a <strong>RuntimeError</strong>. Use floating-point types!
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[250px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode[view]}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[180px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode[view]}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Propagation & grad_fn (Bright & Clear Visual Graph) ---
function PropagationSlide() {
  const [step, setStep] = useState(0);

  const explanations = [
    <span><strong>Step 1: Leaf Tensors.</strong> We define our inputs. <code>x</code> doesn't require gradients. <code>w</code> and <code>b</code> do. Because they are created by the user, their <code>grad_fn</code> is None.</span>,
    <span><strong>Step 2: Operations Propagate.</strong> We calculate <code>intermediate = w * x</code>. Because <code>w</code> requires gradients, the requirement <strong>propagates</strong> to <code>intermediate</code>. Autograd attaches <code>&lt;MulBackward0&gt;</code>.</span>,
    <span><strong>Step 3: Graph Completion.</strong> Finally, <code>y = intermediate + b</code>. The requirement propagates again. <code>y</code> gets an <code>&lt;AddBackward0&gt;</code> function attached, ready for backpropagation!</span>
  ];

  const pyCode = `# Define tensors: x, w, b
x = torch.tensor([1.0, 2.0]) # No gradients
w = torch.tensor([0.5, -1.0], requires_grad=True)
b = torch.tensor([0.1], requires_grad=True)

# 1. intermediate = w * x
intermediate = w * x
print(f"intermediate requires_grad: {intermediate.requires_grad}")
print(f"intermediate grad_fn: {intermediate.grad_fn}")

# 2. y = intermediate + b
y = intermediate + b
print(f"\\ny requires_grad: {y.requires_grad}")
print(f"y grad_fn: {y.grad_fn}")`;

  const outCode = `intermediate requires_grad: True
intermediate grad_fn: <MulBackward0 object at ...>

y requires_grad: True
y grad_fn: <AddBackward0 object at ...>`;

  // Compacted SVG Coordinates
  const W = 550;
  const H = 500;

  // Optimized, tighter layout to fit without scrolling
  const pos = {
    x: { x: 80, y: 70 },
    w: { x: 270, y: 70 },
    b: { x: 460, y: 70 },
    mul: { x: 270, y: 170 },
    inter: { x: 270, y: 260 },
    add: { x: 270, y: 360 },
    y: { x: 270, y: 460 }
  };

  const drawLine = (p1, p2) => `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
  const drawCurve = (p1, p2) => `M ${p1.x} ${p1.y} Q ${p1.x} ${p2.y} ${p2.x} ${p2.y}`;

  return (
    <div className="grid lg:grid-cols-2 gap-6 animate-in fade-in duration-500 h-full">
      {/* LEFT COLUMN: Text, Buttons, Code */}
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-2">Propagation & grad_fn</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          If <strong>any</strong> input to an operation has <code>requires_grad=True</code>, the resulting tensor will too. PyTorch attaches a <code>.grad_fn</code> to track the math.
        </p>

        <button 
          onClick={() => setStep(s => (s + 1) % 3)} 
          className="w-full py-2 mb-4 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600 shadow transition-all flex justify-center items-center gap-2"
        >
          {step === 0 ? "Step 1: Setup Leaves (Click to Compute *)" : step === 1 ? "Step 2: w * x (Click to Compute +)" : "Step 3: Result y (Click to Reset)"} <Pointer size={16}/>
        </button>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3 rounded-lg mb-6 shadow-sm leading-relaxed min-h-[60px]">
          {explanations[step]}
        </div>

        <div className="flex flex-col gap-4 overflow-hidden flex-1">
          <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
            <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
          </div>
          <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[120px]">
            <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
            <pre className="whitespace-pre-wrap">{outCode}</pre>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Visualizer */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl relative overflow-x-auto shadow-sm p-2 flex items-center justify-center">
        <div style={{ minWidth: W, width: W, height: H, position: 'relative' }}>
          
          {/* Background Regions (Light Theme) */}
          <div className="absolute top-[10px] left-[10px] w-[530px] h-[100px] border border-dashed border-slate-400 bg-white/50 rounded-lg flex justify-center">
            <span className="text-slate-400 font-sans text-xs mt-2 font-bold uppercase tracking-widest">Leaf Tensors</span>
          </div>
          <div className="absolute top-[120px] left-[80px] w-[380px] h-[380px] border border-dashed border-slate-400 bg-white/50 rounded-lg flex justify-center">
            <span className="text-slate-400 font-sans text-xs mt-2 bg-slate-50 px-2 z-10 font-bold uppercase tracking-widest h-4">Operations & Results</span>
          </div>

          {/* SVG Lines (Dark Slate) */}
          <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 z-0">
            <defs>
              <marker id="arrowDark" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
              </marker>
            </defs>
            
            {/* Step 1 paths */}
            <g className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
               <path d={drawLine({x:80, y:105}, {x:240, y:155})} stroke="#475569" strokeWidth="2" fill="none" markerEnd="url(#arrowDark)" />
               <text x="140" y="145" fontSize="12" fill="#475569" fontWeight="bold">input</text>
               
               <path d={drawLine({x:270, y:105}, {x:270, y:145})} stroke="#475569" strokeWidth="2" fill="none" markerEnd="url(#arrowDark)" />
               <text x="275" y="130" fontSize="12" fill="#475569" fontWeight="bold">input</text>

               <path d={drawLine({x:270, y:195}, {x:270, y:225})} stroke="#475569" strokeWidth="2" fill="none" markerEnd="url(#arrowDark)" />
               <text x="275" y="215" fontSize="12" fill="#475569" fontWeight="bold">output</text>
            </g>

            {/* Step 2 paths */}
            <g className={`transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
               <path d={drawLine({x:270, y:295}, {x:270, y:335})} stroke="#475569" strokeWidth="2" fill="none" markerEnd="url(#arrowDark)" />
               <text x="275" y="325" fontSize="12" fill="#475569" fontWeight="bold">input</text>

               <path d={drawCurve({x:460, y:105}, {x:310, y:360})} stroke="#475569" strokeWidth="2" fill="none" markerEnd="url(#arrowDark)" />
               <text x="410" y="280" fontSize="12" fill="#475569" fontWeight="bold">input</text>

               <path d={drawLine({x:270, y:385}, {x:270, y:425})} stroke="#475569" strokeWidth="2" fill="none" markerEnd="url(#arrowDark)" />
               <text x="275" y="415" fontSize="12" fill="#475569" fontWeight="bold">output</text>
            </g>
          </svg>

          {/* HTML Nodes Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            
            {/* x tensor */}
            <div className="absolute bg-[#e2e8f0] border border-slate-300 font-mono text-[10px] flex flex-col items-center justify-center p-2 shadow-sm text-slate-700 rounded" style={{left: '10px', top: '40px', width: '140px', height: '65px'}}>
              <span className="font-sans mb-1 font-bold text-sm">x</span>
              <span>requires_grad=False</span>
              <span className="text-slate-400">grad_fn=None</span>
            </div>

            {/* w tensor */}
            <div className="absolute bg-[#92c5fc] border border-blue-300 font-mono text-[10px] flex flex-col items-center justify-center p-2 shadow-sm text-blue-900 rounded" style={{left: '200px', top: '40px', width: '140px', height: '65px'}}>
              <span className="font-sans mb-1 font-bold text-sm">w</span>
              <span className="font-bold">requires_grad=True</span>
              <span className="text-blue-700">grad_fn=None</span>
            </div>

            {/* b tensor */}
            <div className="absolute bg-[#92c5fc] border border-blue-300 font-mono text-[10px] flex flex-col items-center justify-center p-2 shadow-sm text-blue-900 rounded" style={{left: '390px', top: '40px', width: '140px', height: '65px'}}>
              <span className="font-sans mb-1 font-bold text-sm">b</span>
              <span className="font-bold">requires_grad=True</span>
              <span className="text-blue-700">grad_fn=None</span>
            </div>

            {/* Mul Op */}
            <div className={`absolute bg-[#cbd5e1] border border-slate-400 font-mono text-lg font-bold flex items-center justify-center rounded-[100%] shadow-sm text-slate-800 transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{left: '235px', top: '150px', width: '70px', height: '40px'}}>
              *
            </div>

            {/* Intermediate tensor */}
            <div className={`absolute bg-[#69abf6] border border-blue-400 font-mono text-[10px] flex flex-col items-center justify-center p-2 shadow-md text-white rounded transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{left: '170px', top: '230px', width: '200px', height: '65px'}}>
              <span className="font-sans mb-1 font-bold text-sm">intermediate</span>
              <span className="font-bold">requires_grad=True</span>
              <span>grad_fn=&lt;MulBackward0&gt;</span>
            </div>

            {/* Add Op */}
            <div className={`absolute bg-[#cbd5e1] border border-slate-400 font-mono text-lg font-bold flex items-center justify-center rounded-[100%] shadow-sm text-slate-800 transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`} style={{left: '235px', top: '340px', width: '70px', height: '40px'}}>
              +
            </div>

            {/* Final y tensor */}
            <div className={`absolute bg-[#69abf6] border border-blue-400 font-mono text-[10px] flex flex-col items-center justify-center p-2 shadow-md text-white rounded transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`} style={{left: '170px', top: '430px', width: '200px', height: '65px'}}>
              <span className="font-sans mb-1 font-bold text-sm">y</span>
              <span className="font-bold">requires_grad=True</span>
              <span>grad_fn=&lt;AddBackward0&gt;</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}