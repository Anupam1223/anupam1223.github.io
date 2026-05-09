import React, { useState } from 'react';
import { 
  Rewind, ChevronLeft, ChevronRight, Code, Terminal, 
  AlertTriangle, CheckCircle2, Pointer, Network, Trash2, ShieldAlert,
  Calculator, XCircle
} from 'lucide-react';

export default function BackwardSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'init', title: 'Initiating backward()', component: InitiatingSlide },
    { id: 'scalar', title: 'Why a Scalar?', component: ScalarSlide },
    { id: 'graph', title: 'Gradient Flow Graph', component: GraphSlide },
    { id: 'memory', title: 'Graph Memory (retain_graph)', component: MemorySlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Rewind size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Performing Backpropagation</h2>
        <p className="text-slate-400 text-sm mb-4">Driving automatic differentiation with the backward() method</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-rose-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-rose-400' : 'hidden md:inline'}>
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

// --- Slide 1: Initiating backward() (ENHANCED) ---
function InitiatingSlide() {
  const [step, setStep] = useState(0);

  const explanations = [
    <span><strong>Step 1: Forward Pass.</strong> We calculate <code>y = w * x + b</code> and <code>loss = y²</code>. PyTorch builds the graph, but the <code>.grad</code> attributes remain <code>None</code>.</span>,
    <span><strong>Step 2: The Engine.</strong> Calling <code>loss.backward()</code> triggers Autograd to traverse the graph backwards, applying the chain rule to compute exact derivatives for every leaf tensor.</span>,
    <span><strong>Step 3: Gradients Populated.</strong> The calculated gradients are stored in the <code>.grad</code> attributes. Let's look at the exact mathematical chain rule breakdown below!</span>
  ];

  const pyCode = `import torch\n\n# Example setup\nx = torch.tensor(2.0, requires_grad=True)\nw = torch.tensor(3.0, requires_grad=True)\nb = torch.tensor(1.0, requires_grad=True)\n\n# Perform operations (building the graph)\ny = w * x + b  # y = 3*2 + 1 = 7\nloss = y * y   # loss = 7*7 = 49\n\nprint(f"Gradient for x before: {x.grad}")\nprint(f"Gradient for w before: {w.grad}")\nprint(f"Gradient for b before: {b.grad}")\n\n# Compute gradients using the chain rule!\nloss.backward()\n\n# Gradients are now populated in the .grad attributes\nprint(f"Gradient for x after: {x.grad}")\nprint(f"Gradient for w after: {w.grad}")\nprint(f"Gradient for b after: {b.grad}")`;

  const outCode = `Gradient for x before backward: None\nGradient for w before backward: None\nGradient for b before backward: None\n\nGradient for x after backward: 42.0\nGradient for w after backward: 28.0\nGradient for b after backward: 14.0`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Initiating Gradient Calculation</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          The <code>.backward()</code> method is the engine that drives Autograd. It computes gradients for all "leaf" tensors in the graph that have <code>requires_grad=True</code>.
        </p>

        <button 
          onClick={() => setStep(s => (s + 1) % 3)} 
          className="w-full py-3 mb-4 bg-rose-500 text-white rounded-lg text-sm font-bold hover:bg-rose-600 shadow transition-all flex justify-center items-center gap-2"
        >
          {step === 0 ? "Step 1: Forward Pass (Click to Backward)" : step === 1 ? "Step 2: loss.backward() (Click to View .grad)" : "Step 3: Gradients Populated (Click to Reset)"} <Pointer size={16}/>
        </button>

        <div className="bg-rose-50 border border-rose-200 text-rose-900 text-xs p-3 rounded-lg mb-4 shadow-sm min-h-[60px] animate-in fade-in">
          {explanations[step]}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col flex-1 relative overflow-hidden">
          {/* Main Grad Values */}
          <div className="w-full space-y-3 font-mono text-sm relative z-10">
             <div className="flex justify-between items-center bg-white p-2.5 rounded shadow-sm border border-slate-200">
               <span className="font-bold text-slate-700">x.grad</span>
               <span className={`font-bold transition-all ${step >= 2 ? 'text-emerald-600 scale-110' : 'text-slate-400'}`}>{step >= 2 ? '42.0' : 'None'}</span>
             </div>
             <div className="flex justify-between items-center bg-white p-2.5 rounded shadow-sm border border-slate-200">
               <span className="font-bold text-slate-700">w.grad</span>
               <span className={`font-bold transition-all ${step >= 2 ? 'text-emerald-600 scale-110' : 'text-slate-400'}`}>{step >= 2 ? '28.0' : 'None'}</span>
             </div>
             <div className="flex justify-between items-center bg-white p-2.5 rounded shadow-sm border border-slate-200">
               <span className="font-bold text-slate-700">b.grad</span>
               <span className={`font-bold transition-all ${step >= 2 ? 'text-emerald-600 scale-110' : 'text-slate-400'}`}>{step >= 2 ? '14.0' : 'None'}</span>
             </div>
          </div>

          {/* Mathematical Breakdown - Only shows on step 2 */}
          <div className={`mt-4 pt-4 border-t border-slate-200 transition-all duration-700 flex-1 flex flex-col ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute pointer-events-none'}`}>
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1"><Calculator size={12}/> The Chain Rule Breakdown</h4>
             <div className="space-y-2 text-xs font-mono bg-white p-3 rounded-lg border border-slate-200 shadow-inner">
               <div className="flex flex-col border-b border-slate-100 pb-1">
                 <span className="text-slate-400 text-[10px]">d(loss)/dx = d(y²)/dx = 2*y*(dy/dx) = 2*y*w</span>
                 <span className="text-emerald-700 font-bold">= 2 * 7 * 3 = 42.0</span>
               </div>
               <div className="flex flex-col border-b border-slate-100 pb-1">
                 <span className="text-slate-400 text-[10px]">d(loss)/dw = d(y²)/dw = 2*y*(dy/dw) = 2*y*x</span>
                 <span className="text-emerald-700 font-bold">= 2 * 7 * 2 = 28.0</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-slate-400 text-[10px]">d(loss)/db = d(y²)/db = 2*y*(dy/db) = 2*y*1</span>
                 <span className="text-emerald-700 font-bold">= 2 * 7 * 1 = 14.0</span>
               </div>
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
          <pre className="whitespace-pre-wrap">{step >= 2 ? outCode : `Gradient for x before backward: None\nGradient for w before backward: None\nGradient for b before backward: None`}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: Why Scalar? (ENHANCED) ---
function ScalarSlide() {
  const [step, setStep] = useState(0);

  const explanations = [
    <span><strong>The Scenario:</strong> Our model outputs a non-scalar tensor with two elements <code>[7.0, 13.0]</code>. We try to call <code>.backward()</code> directly on it.</span>,
    <span><strong>The Crash:</strong> Autograd computes the Jacobian-vector product. It assumes a starting gradient of <code>1.0</code> for a scalar. For vectors, it doesn't know how to weight each element's gradient, so it panics and throws a <code>RuntimeError</code>!</span>,
    <span><strong>The Fix:</strong> We must explicitly provide a <code>gradient</code> argument of the exact same shape (e.g., <code>[1.0, 1.0]</code>). This feeds the initial weights into the backward pass, allowing it to succeed.</span>
  ];

  const pyCode = `# Non-scalar tensor (2 elements)
x_vector = torch.tensor([2.0, 4.0], requires_grad=True)
w = torch.tensor(3.0, requires_grad=True)
b = torch.tensor(1.0, requires_grad=True)

y_non_scalar = w * x_vector + b # [7.0, 13.0]

try:
    y_non_scalar.backward() # This will cause an error
except RuntimeError as e:
    print(f"Error: {e}")

# FIX: Provide a gradient tensor matching the shape
# This represents the upstream gradient d(Loss)/dy
grad_tensor = torch.ones_like(y_non_scalar) # [1.0, 1.0]
y_non_scalar.backward(gradient=grad_tensor)

print(f"x_vector.grad: {x_vector.grad}")
print(f"w.grad: {w.grad}")`;

  const outCode = step < 2 
    ? `Error: grad can be implicitly created only for scalar outputs`
    : `Error: grad can be implicitly created only for scalar outputs\n\nx_vector.grad: tensor([3., 3.])\nw.grad: 6.0`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Why .backward() on a Scalar?</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Autograd computes the <strong>Jacobian-vector product</strong>. You almost always call <code>backward()</code> on a single scalar loss value because it implies a starting gradient of <code>1.0</code>.
        </p>

        <button 
          onClick={() => setStep(s => (s + 1) % 3)} 
          className="w-full py-3 mb-4 bg-rose-500 text-white rounded-lg text-sm font-bold hover:bg-rose-600 shadow transition-all flex justify-center items-center gap-2"
        >
          {step === 0 ? "Step 1: Non-Scalar Output (Click to Backward)" : step === 1 ? "Step 2: The Crash (Click to Fix)" : "Step 3: The Gradient Argument (Click to Reset)"} <Pointer size={16}/>
        </button>

        <div className="bg-rose-50 border border-rose-200 text-rose-900 text-xs p-3 rounded-lg mb-4 shadow-sm min-h-[60px] animate-in fade-in">
          {explanations[step]}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 relative overflow-hidden">
          
          <div className="flex items-center gap-6">
             {/* The Tensor */}
             <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Output Tensor</span>
                <div className="flex gap-1 border-2 border-blue-400 p-1 rounded-lg bg-blue-50 shadow-sm">
                  <div className="w-10 h-10 flex items-center justify-center font-mono font-bold text-sm bg-blue-500 text-white rounded">7.0</div>
                  <div className="w-10 h-10 flex items-center justify-center font-mono font-bold text-sm bg-blue-500 text-white rounded">13.0</div>
                </div>
                <div className="text-[10px] font-mono text-slate-400 font-bold mt-1">Shape: [2]</div>
             </div>

             {/* The Action */}
             <div className="flex flex-col items-center relative">
                {step === 0 && <span className="text-slate-400 font-mono text-xs">Waiting...</span>}
                {step === 1 && (
                  <div className="flex flex-col items-center animate-in zoom-in-50">
                    <XCircle size={32} className="text-rose-500 mb-1" />
                    <span className="text-[10px] font-bold text-rose-600 uppercase bg-rose-100 px-2 py-1 rounded">Runtime Error</span>
                  </div>
                )}
                {step === 2 && (
                  <div className="flex flex-col items-center animate-in slide-in-from-right-4">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase mb-2">Injecting Gradient</span>
                    <div className="flex gap-1 border-2 border-emerald-400 p-1 rounded-lg bg-emerald-50 shadow-sm">
                      <div className="w-8 h-8 flex items-center justify-center font-mono font-bold text-xs bg-emerald-500 text-white rounded">1.0</div>
                      <div className="w-8 h-8 flex items-center justify-center font-mono font-bold text-xs bg-emerald-500 text-white rounded">1.0</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase mt-2">Success!</span>
                  </div>
                )}
             </div>
          </div>

        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-rose-400 max-h-[150px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{step >= 1 ? outCode : ''}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Interactive Gradient Flow Graph ---
function GraphSlide() {
  const [step, setStep] = useState(0);

  // Absolute coordinate Canvas Size 
  const W = 850;
  const H = 800;

  // Helper Node Generator to perfectly map HTML elements over the exact SVG points
  const Node = ({ x, y, w, h, bg, text, stepReq }) => (
    <div
      className={`absolute flex items-center justify-center font-mono font-bold text-sm shadow-sm transition-opacity duration-500 text-center
        ${step >= stepReq ? 'opacity-100' : 'opacity-20'} ${bg}`}
      style={{
        left: x, top: y, width: w, height: h,
        transform: 'translate(-50%, -50%)',
        borderRadius: w === h ? '50%' : '6px'
      }}
    >
      {text}
    </div>
  );

  // Helper Label Generator for red dashed text
  const Label = ({ x, y, text, stepReq }) => (
    <div 
      className={`absolute transition-opacity duration-1000 ${step >= stepReq ? 'opacity-100' : 'opacity-0'}`}
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      <span className="bg-white px-2 py-1 rounded shadow text-rose-600 text-xs font-bold border border-rose-200 whitespace-nowrap">
        {text}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold">Computation Graph & Gradient Flow</h3>
          <p className="text-slate-600 text-sm">Visualizing the graph topology and <code>.backward()</code> trace</p>
        </div>
        <button 
          onClick={() => setStep(s => (s + 1) % 3)} 
          className="px-6 py-2 bg-rose-500 text-white rounded-lg text-sm font-bold hover:bg-rose-600 shadow transition-all flex items-center gap-2 z-10"
        >
          {step === 0 ? "1. Show Graph" : step === 1 ? "2. Execute Forward Pass" : "3. Execute .backward() Pass"} <Pointer size={16}/>
        </button>
      </div>

      <div className="flex-1 bg-[#1e1e1e] border border-slate-700 rounded-2xl relative overflow-x-auto overflow-y-auto shadow-inner p-4 h-[600px] flex justify-center">
        <div style={{ minWidth: W, width: W, height: H, position: 'relative' }}>
          
          {/* Background Clusters perfectly matched */}
          <div className="absolute bg-[#e9ecef] border border-[#d1d5db] rounded" style={{ left: 80, top: 80, width: 700, height: 200 }}>
             <div className="w-full text-center mt-4 text-sm font-sans text-slate-800 font-bold">Operations</div>
          </div>
          <div className="absolute bg-[#e9ecef] border border-[#d1d5db] rounded" style={{ left: 450, top: 300, width: 200, height: 230 }}>
             <div className="w-full text-center mt-4 text-sm font-sans text-slate-800 font-bold">Inputs (requires_grad=True)</div>
          </div>
          <div className="absolute bg-[#e9ecef] border border-[#d1d5db] rounded" style={{ left: 490, top: 660, width: 120, height: 80 }}>
             <div className="w-full text-center mt-2 text-sm font-sans text-slate-800 font-bold">Output (Scalar)</div>
          </div>

          {/* SVG Canvas for Lines */}
          <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 z-0">
            <defs>
              <marker id="arrowFwd" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#475569" />
              </marker>
              <marker id="arrowBwd" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
              </marker>
            </defs>
            
            {/* FORWARD PASS LINES (Gray solid) */}
            <g className={`transition-opacity duration-700 ${step >= 1 ? 'opacity-100' : 'opacity-20'}`}>
              <path d="M 585 350 Q 720 330 720 255" stroke="#475569" strokeWidth="1.5" fill="none" markerEnd="url(#arrowFwd)" />
              <path d="M 585 420 Q 750 400 735 255" stroke="#475569" strokeWidth="1.5" fill="none" markerEnd="url(#arrowFwd)" />
              <path d="M 705 220 Q 400 130 175 130" stroke="#475569" strokeWidth="1.5" fill="none" markerEnd="url(#arrowFwd)" />
              <path d="M 515 490 Q 250 450 165 150" stroke="#475569" strokeWidth="1.5" fill="none" markerEnd="url(#arrowFwd)" />
              <path d="M 150 155 Q 180 600 515 600" stroke="#475569" strokeWidth="1.5" fill="none" markerEnd="url(#arrowFwd)" />
              <path d="M 515 590 Q 250 400 185 265" stroke="#475569" strokeWidth="1.5" fill="none" markerEnd="url(#arrowFwd)" />
              <path d="M 150 275 Q 180 710 510 710" stroke="#475569" strokeWidth="1.5" fill="none" markerEnd="url(#arrowFwd)" />
            </g>

            {/* BACKWARD PASS LINES (Red Dashed) */}
            <g className={`transition-opacity duration-1000 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
              <path d="M 510 720 Q 120 750 130 275" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#arrowBwd)" />
              <path d="M 195 250 Q 280 500 515 610" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#arrowBwd)" />
              <path d="M 515 615 Q 200 550 140 155" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#arrowBwd)" />
              <path d="M 160 145 Q 280 430 515 500" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#arrowBwd)" />
              <path d="M 165 115 Q 400 100 710 215" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#arrowBwd)" />
              <path d="M 715 245 Q 680 320 585 340" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#arrowBwd)" />
              <path d="M 735 245 Q 730 400 585 410" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#arrowBwd)" />
            </g>
          </svg>

          {/* HTML Nodes overlayed perfectly on coordinates */}
          <div className="absolute inset-0 pointer-events-none">
             
             {/* Operations (Yellow Circles) */}
             <Node x={150} y={130} w={50} h={50} bg="bg-[#fceda6] border border-amber-300 text-slate-800" text="+" stepReq={1} />
             <Node x={150} y={230} w={90} h={90} bg="bg-[#fceda6] border border-amber-300 text-slate-800" text="pow(2)" stepReq={1} />
             <Node x={730} y={230} w={50} h={50} bg="bg-[#fceda6] border border-amber-300 text-slate-800" text="*" stepReq={1} />

             {/* Inputs (Blue Boxes) */}
             <Node x={550} y={350} w={70} h={35} bg="bg-[#bde0fe] border border-blue-300 text-slate-800" text="x=2.0" stepReq={0} />
             <Node x={550} y={420} w={70} h={35} bg="bg-[#bde0fe] border border-blue-300 text-slate-800" text="w=3.0" stepReq={0} />
             <Node x={550} y={490} w={70} h={35} bg="bg-[#bde0fe] border border-blue-300 text-slate-800" text="b=1.0" stepReq={0} />

             {/* Outputs (Green and Red Boxes) */}
             <Node x={550} y={600} w={70} h={35} bg="bg-[#c3f0c2] border border-emerald-300 text-slate-800" text="y=7.0" stepReq={1} />
             <Node x={550} y={710} w={80} h={35} bg="bg-[#ffc7ce] border border-rose-300 text-slate-800" text="loss=49.0" stepReq={1} />
             
             {/* Labels for Red Dashed Lines */}
             <Label x={280} y={730} text="loss.backward() starts here" stepReq={2} />
             <Label x={350} y={480} text="d(loss)/dy = 14" stepReq={2} />
             <Label x={320} y={340} text="d(loss)/db = 14" stepReq={2} />
             <Label x={400} y={110} text="w*x+b" stepReq={2} />
             <Label x={660} y={280} text="d(loss)/dx = 42" stepReq={2} />
             <Label x={680} y={360} text="d(loss)/dw = 28" stepReq={2} />

          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-slate-900 rounded-xl border border-slate-700 text-sm text-slate-300 font-medium text-center shadow-sm">
        A computation graph showing inputs <span className="text-rose-400">x, w, b</span>, intermediate result <span className="text-rose-400">y</span>, and final scalar <span className="text-rose-400">loss</span>.
        {step >= 2 && " The dashed red arrows illustrate the precise path taken during loss.backward() to compute gradients."}
      </div>
    </div>
  );
}

// --- Slide 4: Memory ---
function MemorySlide() {
  const pyCode = `loss = y * y\n\n# 1st Backward pass works fine\nloss.backward()\n\n# By default, the graph is destroyed after backward() to save memory.\ntry:\n    # 2nd Backward pass crashes!\n    loss.backward()\nexcept RuntimeError as e:\n    print(f"Error: {e}")\n\n# --- THE FIX ---\n# If you need to backward() multiple times, keep the graph alive:\n# loss.backward(retain_graph=True)`;

  const outCode = `Error: Trying to backward through the graph a second time (or directly access saved tensors after they have already been freed). Saved intermediate values of the graph are freed when you call .backward() or autograd.grad(). Specify retain_graph=True if you need to backward through the graph a second time or if you need to access saved tensors after calling backward.`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Graph Memory Buffer</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          A computation graph stores intermediate values (activations) needed for the backward pass. To prevent out-of-memory errors, <strong>PyTorch aggressively frees these buffers</strong> immediately after <code>.backward()</code> completes.
        </p>

        <div className="space-y-4 mb-6 flex-1">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm flex items-start gap-4">
            <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 mt-1 text-slate-400">
              <Trash2 size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">The Default Behavior</h4>
              <p className="text-xs text-slate-600 leading-relaxed">You construct a graph, compute loss, and call <code>backward()</code>. The graph is immediately destroyed. Next iteration, a brand new graph is built.</p>
            </div>
          </div>
          
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 shadow-sm flex items-start gap-4">
            <div className="bg-white p-2 rounded-lg shadow-sm border border-rose-100 mt-1 text-rose-500">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="font-bold text-rose-900 text-sm mb-1">Multiple Backward Calls</h4>
              <p className="text-xs text-rose-800 leading-relaxed">If you try to call <code>backward()</code> twice on the exact same loss tensor, it will throw a RuntimeError because the graph is already gone.</p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm flex items-start gap-4">
            <div className="bg-white p-2 rounded-lg shadow-sm border border-emerald-100 mt-1 text-emerald-600">
              <Network size={20} />
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 text-sm mb-1">retain_graph=True</h4>
              <p className="text-xs text-emerald-800 leading-relaxed">Pass this argument to <code>.backward()</code> if you explicitly need to keep the graph alive (e.g., for certain advanced GAN architectures or custom debugging).</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[250px] text-emerald-100">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-rose-400 max-h-[250px] overflow-y-auto transition-all">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}