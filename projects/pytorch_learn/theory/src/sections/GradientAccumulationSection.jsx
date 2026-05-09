import React, { useState, useEffect } from 'react';
import { 
  Layers, ChevronLeft, ChevronRight, Code, Terminal, 
  AlertTriangle, Pointer, PlusSquare, RefreshCw, 
  Cpu, Zap, ArrowRight, PlayCircle, ShieldAlert, CheckCircle2
} from 'lucide-react';

export default function AccumulationSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'default', title: 'Default Accumulation', component: DefaultBehaviorSlide },
    { id: 'why', title: 'Why Accumulate? (Large Batches)', component: SimulatingBatchesSlide },
    { id: 'loop', title: 'Standard Training Loop', component: TrainingLoopSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Layers size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Gradient Accumulation</h2>
        <p className="text-slate-400 text-sm mb-4">Understanding .backward() defaults and the need for .zero_grad()</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-amber-400 whitespace-nowrap' : 'hidden md:inline whitespace-nowrap'}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 font-semibold transition-colors"
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
  const [passes, setPasses] = useState(0);

  const pyCode = `import torch

# Create a tensor that requires gradients
x = torch.tensor([2.0], requires_grad=True)

# Perform some operations
y = x * x
z = y * 3 # z = 3 * x^2

# First backward pass (dz/dx = 6*x = 12)
z.backward(retain_graph=True) 
print(f"After first backward pass, x.grad: {x.grad}")

# Second backward pass (adds 12 to existing 12)
z.backward() 
print(f"After second backward pass, x.grad: {x.grad}")

# Manually zero the gradient
x.grad.zero_()
print(f"After zeroing, x.grad: {x.grad}")`;

  const outCode = passes === 0 
    ? `Waiting for execution...` 
    : passes === 1
    ? `After first backward pass, x.grad: tensor([12.])`
    : passes === 2
    ? `After first backward pass, x.grad: tensor([12.])\nAfter second backward pass, x.grad: tensor([24.])`
    : `After first backward pass, x.grad: tensor([12.])\nAfter second backward pass, x.grad: tensor([24.])\nAfter zeroing, x.grad: tensor([0.])`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Default Gradient Accumulation</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          When you call <code>.backward()</code> multiple times without clearing gradients, PyTorch <strong>adds</strong> the newly computed gradients to the existing values stored in the <code>.grad</code> attribute.
        </p>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setPasses(p => Math.min(p + 1, 2))}
            disabled={passes >= 2}
            className="flex-1 py-3 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 shadow disabled:opacity-50 flex justify-center items-center gap-2 transition-all"
          >
            <PlusSquare size={16}/> z.backward()
          </button>
          <button 
            onClick={() => setPasses(3)}
            disabled={passes === 0 || passes === 3}
            className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-300 shadow disabled:opacity-50 flex justify-center items-center gap-2 transition-all"
          >
            <RefreshCw size={16}/> x.grad.zero_()
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center flex-1 relative overflow-hidden shadow-inner">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 text-center">Memory Slot for <code>x.grad</code></h4>
          
          <div className="relative w-32 h-40 border-4 border-slate-300 rounded-b-xl rounded-t-sm flex items-end justify-center overflow-hidden bg-white shadow-sm">
            
            {/* The "Liquid" accumulating */}
            <div 
              className="absolute bottom-0 w-full bg-amber-400 transition-all duration-500 ease-out flex items-center justify-center flex-col"
              style={{ height: passes === 0 || passes === 3 ? '0%' : passes === 1 ? '50%' : '100%' }}
            >
            </div>
            
            {/* The Value Text */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-mono font-black text-3xl z-10 transition-colors duration-500 ${passes > 0 && passes < 3 ? 'text-amber-900' : 'text-slate-400'}`}>
              {passes === 0 || passes === 3 ? '0.0' : passes === 1 ? '12.0' : '24.0'}
            </div>
            
            {/* Markers */}
            <div className="absolute left-0 w-full h-full flex flex-col justify-between pointer-events-none">
              <div className="border-t-2 border-slate-300/30 w-4"></div>
              <div className="border-t-2 border-slate-300/30 w-4"></div>
            </div>
          </div>

          <div className="mt-6 h-8">
            {passes === 1 && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full animate-in slide-in-from-bottom-2">
                + 12.0 added!
              </span>
            )}
            {passes === 2 && (
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1.5 rounded-full animate-in slide-in-from-bottom-2">
                + 12.0 accumulated! (Total: 24)
              </span>
            )}
            {passes === 3 && (
              <span className="text-xs font-bold text-slate-600 bg-slate-200 px-3 py-1.5 rounded-full animate-in slide-in-from-bottom-2">
                Cleared to 0.0
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
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[150px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: Why Accumulate? (Large Batches) ---
function SimulatingBatchesSlide() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <h3 className="text-xl font-bold mb-4">Why Accumulate? Simulating Larger Batches</h3>
      <p className="text-slate-600 mb-8 leading-relaxed text-sm max-w-4xl">
        When training large models, you often need large batch sizes for stable convergence. But what if a batch of <code>1024</code> images exceeds your GPU's VRAM? Accumulation allows you to divide it into smaller mini-batches, summing their gradients before taking a single optimizer step.
      </p>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
        
        {/* The Bad Way (OOM) */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm">
           <h4 className="font-bold text-rose-900 mb-6 flex items-center gap-2"><Zap size={20}/> The Bad Strategy</h4>
           
           <div className="w-full max-w-[200px] h-32 bg-slate-800 rounded-lg flex flex-col items-center justify-center shadow-lg relative overflow-hidden border-2 border-slate-700">
             <div className="absolute inset-0 flex items-center justify-center opacity-20">
               <Cpu size={100} className="text-white" />
             </div>
             <span className="relative z-10 text-white font-mono font-bold text-sm">Target Batch: 1024</span>
           </div>

           <ArrowRight size={24} className="text-slate-400 my-4 rotate-90" />

           <div className="bg-rose-100 border border-rose-300 p-4 rounded-xl w-full flex flex-col items-center justify-center gap-2 shadow-inner">
             <ShieldAlert size={32} className="text-rose-600 animate-pulse" />
             <span className="text-rose-800 font-bold text-sm uppercase tracking-wider text-center">Out of Memory (OOM)</span>
             <span className="text-rose-600 text-[10px] text-center">GPU VRAM Exceeded!</span>
           </div>
        </div>

        {/* The Good Way (Accumulation) */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h4 className="font-bold text-emerald-900 flex items-center gap-2"><Layers size={20}/> The Accumulation Strategy</h4>
             <button 
                onClick={() => setStep(s => s >= 5 ? 0 : s + 1)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow hover:bg-emerald-700 transition-colors"
             >
                {step === 0 ? "Process Mini-Batch 1" : step === 1 ? "Process Mini-Batch 2" : step === 2 ? "Process Mini-Batch 3" : step === 3 ? "Process Mini-Batch 4" : step === 4 ? "Trigger optimizer.step()" : "Reset Simulation"}
             </button>
           </div>

           <div className="flex items-center gap-6 flex-1">
              
              {/* Mini Batches Queue */}
              <div className="flex flex-col gap-2 w-32 relative">
                <span className="text-[10px] text-slate-500 font-bold uppercase mb-2 text-center">4 x 256 Batches</span>
                {[4,3,2,1].map(num => {
                  const isProcessed = step >= num;
                  const isCurrent = step === num - 1;
                  return (
                    <div key={num} className={`h-10 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all duration-500
                      ${isProcessed ? 'bg-emerald-100 text-emerald-300 border border-emerald-200 opacity-50 translate-x-12' : 
                        isCurrent ? 'bg-amber-400 text-amber-900 shadow-md scale-105 border border-amber-500' : 'bg-slate-200 text-slate-500 border border-slate-300'}`}>
                      Batch {num}
                    </div>
                  )
                })}
              </div>

              <div className="flex-1 flex flex-col items-center justify-center relative">
                 {/* Forward/Backward Process */}
                 <div className="w-full flex justify-center mb-4">
                   <div className={`transition-opacity duration-300 ${step > 0 && step < 5 ? 'opacity-100' : 'opacity-0'}`}>
                     <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded border border-amber-200">Forward ➔ Loss ➔ Backward()</span>
                   </div>
                 </div>

                 {/* The Gradient Pool */}
                 <div className="w-full h-32 bg-white border-4 border-slate-200 rounded-xl flex flex-col justify-end overflow-hidden relative shadow-inner">
                    <span className="absolute top-2 left-0 w-full text-center text-[10px] font-bold text-slate-400 uppercase z-10">Accumulated Gradients (.grad)</span>
                    <div 
                      className="w-full bg-amber-400 transition-all duration-500 flex items-center justify-center relative"
                      style={{ height: `${Math.min(step * 25, 100)}%`, opacity: step === 5 ? 0 : 1 }}
                    >
                      {step > 0 && step < 5 && <span className="text-amber-900 font-bold text-sm absolute top-2">{step * 25}% Complete</span>}
                    </div>
                 </div>
                 
                 {/* The Step Button Trigger */}
                 <div className="w-full flex justify-center mt-4">
                   <div className={`transition-all duration-500 ${step === 5 ? 'scale-110 opacity-100' : 'scale-90 opacity-40'}`}>
                     <div className="bg-emerald-600 text-white font-mono text-sm font-bold px-6 py-3 rounded-xl shadow-lg border border-emerald-700 flex items-center gap-2">
                       <CheckCircle2 size={18}/> optimizer.step()
                     </div>
                   </div>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: The Standard Training Loop ---
function TrainingLoopSlide() {
  const [activeStep, setActiveStep] = useState(0);

  const loopSteps = [
    { title: "Get Data", desc: "Retrieve inputs and labels, move them to the device (GPU/CPU)." },
    { title: "Zero Gradients", desc: "optimizer.zero_grad(): CRUCIAL. Clears the old gradients from the previous iteration so they don't corrupt the current update." },
    { title: "Forward Pass", desc: "outputs = model(inputs): Pass the data through the network to get predictions." },
    { title: "Calculate Loss", desc: "loss = loss_fn(outputs, labels): Determine the error between predictions and targets." },
    { title: "Backward Pass", desc: "loss.backward(): Traverse the graph backwards to compute and accumulate gradients in the .grad attributes." },
    { title: "Optimizer Step", desc: "optimizer.step(): Update the model's weights based on the newly computed gradients." },
  ];

  const pyCode = `# Loop over epochs...
  # Loop over batches...
    # 1. Get data batch
    inputs, labels = data_batch
    inputs, labels = inputs.to(device), labels.to(device)

    # 2. Zero the gradients
    # IMPORTANT: Clear previous gradients!
    optimizer.zero_grad()

    # 3. Forward pass: Compute predictions
    outputs = model(inputs)

    # 4. Calculate the loss
    loss = loss_fn(outputs, labels)

    # 5. Backward pass: Compute gradients
    loss.backward()

    # 6. Optimizer step: Update weights
    optimizer.step()`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2 h-full">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">The Standard Training Loop</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Because PyTorch accumulates gradients by default, failing to clear them before computing gradients for a new batch leads to corrupted, incorrect weight updates.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex-1">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Iteration Lifecycle</h4>
            <button 
              onClick={() => setActiveStep(s => (s + 1) % 6)}
              className="bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700 transition flex items-center gap-2"
            >
               Next Step <PlayCircle size={14}/>
            </button>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
            {loopSteps.map((step, idx) => {
              const isActive = activeStep === idx;
              const isPast = activeStep > idx;
              const isZeroGrad = idx === 1;

              return (
                <div key={idx} className="relative pl-6 transition-all duration-300">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 transition-all duration-300
                    ${isActive && isZeroGrad ? 'bg-rose-500 border-rose-500 scale-125 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 
                      isActive ? 'bg-amber-500 border-amber-500 scale-125 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                      isPast ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'}`} 
                  />
                  
                  {/* Content */}
                  <div className={`transition-all duration-300 ${isActive ? 'opacity-100 translate-x-1' : 'opacity-50'}`}>
                    <h5 className={`font-bold text-sm mb-1 ${isActive && isZeroGrad ? 'text-rose-600' : isActive ? 'text-slate-800' : 'text-slate-500'}`}>
                      {idx + 1}. {step.title}
                    </h5>
                    {isActive && (
                      <p className={`text-xs leading-relaxed animate-in slide-in-from-top-1 ${isZeroGrad ? 'text-rose-700 font-medium bg-rose-50 p-2 rounded border border-rose-100' : 'text-slate-600'}`}>
                        {step.desc}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[12px] text-slate-300 flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
            <Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code Snippet</span>
          </div>
          <pre className="whitespace-pre-wrap leading-relaxed">
{`# Loop over epochs...
  # Loop over batches...
    # 1. Get data batch
    inputs, labels = data_batch
    inputs, labels = inputs.to(device), labels.to(device)

`}
<span className={`transition-colors duration-300 ${activeStep === 1 ? 'text-rose-400 font-bold bg-rose-500/20 block p-1 -mx-1 rounded' : 'text-emerald-100'}`}>
{`    # 2. Zero the gradients
    # IMPORTANT: Clear previous gradients!
    optimizer.zero_grad()
`}
</span>
{`
    # 3. Forward pass: Compute predictions
    outputs = model(inputs)

    # 4. Calculate the loss
    loss = loss_fn(outputs, labels)

    # 5. Backward pass: Compute gradients
    loss.backward()

    # 6. Optimizer step: Update weights
    optimizer.step()`}
          </pre>
        </div>
      </div>
    </div>
  );
}