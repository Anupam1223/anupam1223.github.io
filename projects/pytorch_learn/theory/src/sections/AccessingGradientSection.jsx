import React, { useState } from 'react';
import { 
  Download, ChevronLeft, ChevronRight, Code, Terminal, 
  CheckCircle2, Pointer, Calculator, Database, PlusSquare, 
  RefreshCw, AlertTriangle
} from 'lucide-react';

export default function AccessGradSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'access', title: 'The .grad Attribute', component: AccessSlide },
    { id: 'math', title: 'The Math Breakdown', component: MathSlide },
    { id: 'accum', title: 'Gradient Accumulation', component: AccumulationSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Download size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Accessing Gradients (.grad)</h2>
        <p className="text-slate-400 text-sm mb-4">Retrieving computed gradients and managing accumulation</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-violet-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-violet-400' : 'hidden md:inline'}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: Accessing .grad ---
function AccessSlide() {
  const [step, setStep] = useState(0);

  const pyCode = `import torch

# Create input tensors
x = torch.tensor(2.0, requires_grad=True)
w = torch.tensor(3.0, requires_grad=True)
b = torch.tensor(1.0, requires_grad=True)

# Tensor without gradient tracking
z = torch.tensor(4.0, requires_grad=False)

# Define computation
y = w * x + b

# Trigger Autograd
y.backward()

# Check gradients
print(f"x.grad (Leaf): {x.grad}")
print(f"w.grad (Leaf): {w.grad}")
print(f"b.grad (Leaf): {b.grad}")
print(f"y.grad (Non-Leaf): {y.grad}")
print(f"z.grad (No tracking): {z.grad}")`;

  const outCode = `x.grad (Leaf): 3.0\nw.grad (Leaf): 2.0\nb.grad (Leaf): 1.0\n\nUserWarning: The .grad attribute of a non-leaf tensor is being accessed.\ny.grad (Non-Leaf): None\n\nz.grad (No tracking): None`;

  const NodeCard = ({ title, isLeaf, reqGrad, gradVal, delay }) => (
    <div className={`p-4 rounded-xl border shadow flex flex-col justify-between transition-all duration-700
      ${gradVal === 'None' ? 'bg-slate-50 border-slate-200' : 'bg-emerald-50 border-emerald-300'}
      ${step === 1 ? `opacity-100 translate-y-0` : 'opacity-80 translate-y-2'}`}
      style={{ transitionDelay: step === 1 ? delay : '0ms' }}
    >
      <div>
        <h4 className="font-bold text-slate-800 text-lg flex items-center justify-between">
          {title} 
          {gradVal !== 'None' && step === 1 && <CheckCircle2 size={16} className="text-emerald-500 animate-in zoom-in" />}
        </h4>
        <div className="flex gap-2 mt-2">
          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${isLeaf ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>{isLeaf ? 'Leaf Tensor' : 'Non-Leaf'}</span>
          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${reqGrad ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'}`}>req_grad={reqGrad ? 'True' : 'False'}</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-200/50">
        <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">.grad attribute</span>
        <div className={`font-mono text-sm font-bold ${step === 1 && gradVal !== 'None' ? 'text-emerald-700 text-xl' : 'text-slate-400'}`}>
          {step === 1 ? gradVal : 'None'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">The .grad Attribute</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          <code>.backward()</code> doesn't return gradients. Instead, it populates the <code>.grad</code> attribute of <strong>Leaf</strong> tensors that have <code>requires_grad=True</code>.
        </p>

        <button 
          onClick={() => setStep(s => s === 0 ? 1 : 0)} 
          className={`w-full py-3 mb-6 text-white rounded-lg text-sm font-bold shadow transition-all flex justify-center items-center gap-2 ${step === 0 ? 'bg-violet-500 hover:bg-violet-600 animate-pulse' : 'bg-slate-400 hover:bg-slate-500'}`}
        >
          {step === 0 ? "Execute y.backward()" : "Reset .grad Attributes"} <Pointer size={16}/>
        </button>

        <div className="grid grid-cols-2 gap-4 flex-1">
          <NodeCard title="Tensor x" isLeaf={true} reqGrad={true} gradVal="3.0" delay="100ms" />
          <NodeCard title="Tensor w" isLeaf={true} reqGrad={true} gradVal="2.0" delay="200ms" />
          <NodeCard title="Tensor b" isLeaf={true} reqGrad={true} gradVal="1.0" delay="300ms" />
          <NodeCard title="Tensor z" isLeaf={true} reqGrad={false} gradVal="None" delay="0ms" />
        </div>
        
        <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center justify-between shadow-sm">
           <div>
             <h4 className="font-bold text-amber-900 text-sm">Tensor y (Result)</h4>
             <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">Non-Leaf</span>
           </div>
           <div className="text-right">
             <span className="text-[10px] text-amber-700 font-bold uppercase block">.grad attribute</span>
             <span className="font-mono text-sm font-bold text-amber-600">None</span>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[350px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[150px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{step === 1 ? outCode : ''}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: The Math Breakdown ---
function MathSlide() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <h3 className="text-xl font-bold mb-4">The Mathematical Breakdown</h3>
      <p className="text-slate-600 mb-8 leading-relaxed text-sm">
        The <code>.grad</code> attribute holds a tensor of the exact same shape as the original tensor. Each element represents the partial derivative of the scalar output with respect to that specific element.
      </p>

      <div className="grid md:grid-cols-2 gap-8 flex-1">
        
        {/* The Equation */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm">
           <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Forward Pass Equation</h4>
           
           <div className="text-3xl font-mono font-bold text-slate-800 flex items-center gap-4 mb-4">
             <span className="text-emerald-600">y</span> = 
             <span className="text-blue-600">w</span> * <span className="text-blue-600">x</span> + 
             <span className="text-blue-600">b</span>
           </div>
           
           <div className="text-xl font-mono font-bold text-slate-500 flex items-center gap-4">
             <span>7.0</span> = 
             <span>(3.0</span> * <span>2.0)</span> + 
             <span>1.0</span>
           </div>
        </div>

        {/* The Derivatives */}
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6 flex flex-col justify-center shadow-sm">
           <h4 className="text-xs font-bold text-violet-500 uppercase tracking-widest mb-6 flex items-center gap-2">
             <Calculator size={14}/> Partial Derivatives
           </h4>
           
           <div className="space-y-4">
             
             {/* dy/dx */}
             <div className="bg-white p-4 rounded-xl border border-violet-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4 text-lg font-serif">
                  <div className="flex flex-col items-center">
                    <span className="border-b border-slate-400 px-1 leading-tight">∂y</span>
                    <span className="leading-tight px-1 text-slate-600">∂<span className="text-blue-600 font-bold">x</span></span>
                  </div>
                  <span>= <span className="text-blue-600 font-bold font-mono">w</span></span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">x.grad</span>
                  <span className="font-mono text-xl font-bold text-emerald-600">3.0</span>
                </div>
             </div>

             {/* dy/dw */}
             <div className="bg-white p-4 rounded-xl border border-violet-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4 text-lg font-serif">
                  <div className="flex flex-col items-center">
                    <span className="border-b border-slate-400 px-1 leading-tight">∂y</span>
                    <span className="leading-tight px-1 text-slate-600">∂<span className="text-blue-600 font-bold">w</span></span>
                  </div>
                  <span>= <span className="text-blue-600 font-bold font-mono">x</span></span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">w.grad</span>
                  <span className="font-mono text-xl font-bold text-emerald-600">2.0</span>
                </div>
             </div>

             {/* dy/db */}
             <div className="bg-white p-4 rounded-xl border border-violet-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4 text-lg font-serif">
                  <div className="flex flex-col items-center">
                    <span className="border-b border-slate-400 px-1 leading-tight">∂y</span>
                    <span className="leading-tight px-1 text-slate-600">∂<span className="text-blue-600 font-bold">b</span></span>
                  </div>
                  <span>= <span className="text-slate-600 font-bold font-mono">1</span></span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">b.grad</span>
                  <span className="font-mono text-xl font-bold text-emerald-600">1.0</span>
                </div>
             </div>

           </div>
        </div>

      </div>
    </div>
  );
}

// --- Slide 3: Gradient Accumulation ---
function AccumulationSlide() {
  const [passes, setPasses] = useState(0);

  const pyCode = `import torch

w = torch.tensor(3.0, requires_grad=True)
x = torch.tensor(2.0)

# Loop 3 times without zeroing gradients
for i in range(3):
    y = w * x
    y.backward()
    print(f"Pass {i+1} w.grad: {w.grad}")

# Now clear them (Crucial for training loops!)
w.grad.zero_()
print(f"After zero_(): {w.grad}")`;

  const outCode = `Pass 1 w.grad: 2.0\nPass 2 w.grad: 4.0\nPass 3 w.grad: 6.0\nAfter zero_(): 0.0`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Gradient Accumulation</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          If you call <code>backward()</code> multiple times, PyTorch doesn't overwrite old gradients—it <strong>adds</strong> them to the existing values. This is why you must explicitly clear them using <code>.zero_()</code> or <code>optimizer.zero_grad()</code> before each new training step.
        </p>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setPasses(p => Math.min(p + 1, 3))}
            disabled={passes >= 3}
            className="flex-1 py-3 bg-violet-500 text-white rounded-lg text-sm font-bold hover:bg-violet-600 shadow disabled:opacity-50 flex justify-center items-center gap-2 transition-all"
          >
            <PlusSquare size={16}/> Run backward() pass
          </button>
          <button 
            onClick={() => setPasses(0)}
            className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-300 shadow flex justify-center items-center gap-2 transition-all"
          >
            <RefreshCw size={16}/> w.grad.zero_()
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center flex-1 relative overflow-hidden shadow-inner">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 text-center">Memory Slot for <code>w.grad</code></h4>
          
          <div className="relative w-32 h-40 border-4 border-slate-300 rounded-b-xl rounded-t-sm flex items-end justify-center overflow-hidden bg-white">
            
            {/* The "Liquid" accumulating */}
            <div 
              className="absolute bottom-0 w-full bg-violet-400 transition-all duration-500 ease-out flex items-center justify-center flex-col"
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
              <span className="text-xs font-bold text-violet-700 bg-violet-100 px-3 py-1.5 rounded-full animate-in slide-in-from-bottom-2">
                + 2.0 added to accumulator!
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[200px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
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