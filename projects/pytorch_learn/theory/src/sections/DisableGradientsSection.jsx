import React, { useState, useEffect } from 'react';
import { 
  PowerOff, ChevronLeft, ChevronRight, Code, Terminal, 
  ShieldOff, Zap, Lock, Database, Scissors, Cpu, Pointer, AlertTriangle, Layers, Braces
} from 'lucide-react';

export default function DisableGradSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'why', title: 'Why Disable Tracking?', component: WhyDisableSlide },
    { id: 'nograd', title: 'torch.no_grad()', component: NoGradSlide },
    { id: 'detach', title: 'The .detach() Method', component: DetachSlide },
    { id: 'compare', title: 'Compare & In-place', component: ComparisonSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <PowerOff size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Disabling Gradient Tracking</h2>
        <p className="text-slate-400 text-sm mb-4">torch.no_grad(), .detach(), and requires_grad_(False)</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-cyan-400 whitespace-nowrap' : 'hidden md:inline whitespace-nowrap'}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: Why Disable Tracking? ---
function WhyDisableSlide() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Why Disable Gradient Tracking?</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          While Autograd is fundamental for training, tracking history consumes memory and computational resources. 
          There are specific scenarios where calculating gradients is unnecessary or undesirable.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 flex-1">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center mb-4 border border-cyan-200">
            <Zap size={24}/>
          </div>
          <h4 className="font-bold text-slate-800 mb-2">1. Model Evaluation (Inference)</h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-1">
            When making predictions on new data, you aren't updating weights. Disabling tracking speeds up the forward pass significantly.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4 border border-amber-200">
            <Lock size={24}/>
          </div>
          <h4 className="font-bold text-slate-800 mb-2">2. Freezing Parameters</h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-1">
            During transfer learning or fine-tuning, you might want to freeze early layers of a pre-trained model so their weights remain unchanged.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 border border-emerald-200">
            <Database size={24}/>
          </div>
          <h4 className="font-bold text-slate-800 mb-2">3. Memory Efficiency</h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-1">
            The computation graph stores intermediate activations. Turning off tracking prevents this massive memory overhead when it isn't needed.
          </p>
        </div>
      </div>

      <div className="mt-6 bg-cyan-50 border border-cyan-200 p-4 rounded-xl text-cyan-900 text-sm flex items-start gap-4">
         <ShieldOff className="flex-shrink-0 mt-0.5 text-cyan-500" />
         <p>
           PyTorch offers three main mechanisms to selectively disable tracking: the <strong>torch.no_grad()</strong> context manager, the <strong>.detach()</strong> method, and the in-place <strong>.requires_grad_(False)</strong> method.
         </p>
      </div>
    </div>
  );
}

// --- Slide 2: torch.no_grad() ---
function NoGradSlide() {
  const [useNoGrad, setUseNoGrad] = useState(false);
  const [codeTab, setCodeTab] = useState('concept'); // 'concept' or 'eval'

  const pyCodeConcept = `import torch

x = torch.randn(2, 2, requires_grad=True)
w = torch.randn(2, 2, requires_grad=True)

${useNoGrad ? `print("\\nEntering torch.no_grad() context:")\nwith torch.no_grad():\n    z = x * w\n    print(f"z.requires_grad: {z.requires_grad}")\n    print(f"z.grad_fn: {z.grad_fn}")\n\n    # Even if an input requires grad, output won't\n    k = x * 5\n    print(f"k.requires_grad: {k.requires_grad}")\n\nprint("\\nExiting torch.no_grad() context:")\np = x * w\nprint(f"p.requires_grad: {p.requires_grad}")` 
: `# Operation outside the no_grad context\ny = x * w\n\nprint(f"y.requires_grad: {y.requires_grad}")\nprint(f"y.grad_fn: {y.grad_fn}")\n\n\n\n\n\n\n\n\n\n`}`;

  const outCodeConcept = useNoGrad 
    ? `Entering torch.no_grad() context:\n  z.requires_grad: False\n  z.grad_fn: None\n  k.requires_grad: False\n\nExiting torch.no_grad() context:\np.requires_grad: True` 
    : `y.requires_grad: True\ny.grad_fn: <MulBackward0 object at 0x...>`;

  const pyCodeEval = `# Evaluation loop snippet
model.eval() # Set model to evaluation mode 
# (important for layers like dropout, batchnorm)

total_loss = 0
correct_predictions = 0

with torch.no_grad(): # Disable gradient tracking!
    for inputs, labels in validation_dataloader:
        inputs = inputs.to(device)
        labels = labels.to(device)

        outputs = model(inputs) # Forward pass
        loss = criterion(outputs, labels) # Calc loss

        total_loss += loss.item()
        _, predicted = torch.max(outputs.data, 1)
        correct_predictions += (predicted == labels).sum().item()

# Calculate average loss and accuracy...`;

  const outCodeEval = `[System Message]\nInference Mode Active: No gradients are computed or stored during this validation loop. This drastically reduces memory consumption and speeds up the forward pass execution!`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">The torch.no_grad() Context</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          The recommended way to disable tracking for a block of code. Operations inside the <code>with</code> block behave as if inputs do not require gradients, returning outputs with <code>requires_grad=False</code>. This is exactly what you want during an <strong>evaluation loop</strong>!
        </p>

        <button 
          onClick={() => setUseNoGrad(!useNoGrad)} 
          className={`w-full py-3 mb-6 text-white rounded-lg text-sm font-bold shadow transition-all flex justify-center items-center gap-2 ${useNoGrad ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-slate-500 hover:bg-slate-600'}`}
        >
          <PowerOff size={16}/> {useNoGrad ? "Context: ON (no_grad)" : "Context: OFF (Normal)"}
        </button>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center flex-1 relative overflow-hidden">
           
           <div className={`absolute inset-4 border-2 border-dashed rounded-xl transition-all duration-500 ${useNoGrad ? 'border-cyan-400 bg-cyan-50/50' : 'border-transparent'}`}>
              {useNoGrad && <span className="absolute top-2 right-2 text-[10px] font-bold text-cyan-600 uppercase tracking-widest bg-cyan-100 px-2 py-1 rounded">with torch.no_grad():</span>}
           </div>

           <div className="relative z-10 flex flex-col items-center gap-6 w-full mt-4">
              
              {/* Inputs */}
              <div className="flex justify-center gap-4 w-full">
                 <div className="bg-blue-100 border border-blue-300 text-blue-900 px-3 py-1 rounded text-xs font-mono font-bold shadow-sm">x (req_grad=T)</div>
                 <div className="bg-blue-100 border border-blue-300 text-blue-900 px-3 py-1 rounded text-xs font-mono font-bold shadow-sm">w (req_grad=T)</div>
              </div>

              {/* Arrow / Operation */}
              <div className="flex flex-col items-center relative">
                 <div className="h-6 border-l-2 border-slate-300"></div>
                 <div className={`w-16 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm shadow transition-all duration-500 ${useNoGrad ? 'bg-slate-200 text-slate-500 border border-slate-300' : 'bg-amber-100 border-2 border-amber-400 text-amber-900'}`}>
                    Op (*)
                 </div>
                 <div className="h-6 border-l-2 border-slate-300"></div>
                 
                 {/* Visual indicator of grad_fn blocking */}
                 {useNoGrad && (
                   <div className="absolute right-12 top-8 animate-in zoom-in slide-in-from-right-4">
                     <div className="bg-rose-100 border border-rose-300 text-rose-700 text-[9px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                       <ShieldOff size={10}/> Graph Blocked
                     </div>
                   </div>
                 )}
              </div>

              {/* Output */}
              <div className={`transition-all duration-500 w-full max-w-[200px] border shadow-sm p-3 flex flex-col items-center justify-center rounded-xl ${useNoGrad ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-emerald-100 border-emerald-400 text-emerald-900'}`}>
                 <span className="font-mono font-bold text-sm mb-2">{useNoGrad ? 'z' : 'y'}</span>
                 <div className="w-full flex flex-col text-[10px] bg-white/60 p-2 rounded">
                    <span>req_grad = <strong>{useNoGrad ? 'False' : 'True'}</strong></span>
                    <span>grad_fn = <strong>{useNoGrad ? 'None' : '<MulBackward>'}</strong></span>
                 </div>
              </div>

           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[360px] flex flex-col">
          <div className="flex items-center justify-between mb-2 border-b border-slate-700 pb-2">
            <div className="flex items-center gap-2">
               <Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span>
            </div>
            <div className="flex gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
               <button 
                 onClick={() => setCodeTab('concept')} 
                 className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${codeTab === 'concept' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
               >
                 Basic Concept
               </button>
               <button 
                 onClick={() => setCodeTab('eval')} 
                 className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-colors flex items-center gap-1 ${codeTab === 'eval' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
               >
                 <Braces size={10}/> Real-World: Eval Loop
               </button>
            </div>
          </div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100 transition-all">
            {codeTab === 'concept' ? pyCodeConcept : pyCodeEval}
          </pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[140px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2">
             <Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span>
          </div>
          <pre className={`whitespace-pre-wrap transition-all ${codeTab === 'eval' && 'text-cyan-300'}`}>
            {codeTab === 'concept' ? outCodeConcept : outCodeEval}
          </pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: The .detach() Method ---
function DetachSlide() {
  const [step, setStep] = useState(0);

  const pyCode = `import torch

# Original tensor requiring gradients
a = torch.randn(3, 3, requires_grad=True)
b = a * 2

print(f"b.requires_grad: {b.requires_grad}")
print(f"b.grad_fn: {b.grad_fn}")

# Detach the tensor 'b' to create 'c'
c = b.detach()

print(f"\\nAfter detaching b to create c:")
print(f"c.requires_grad: {c.requires_grad}")
print(f"c.grad_fn: {c.grad_fn}")

# b is unchanged, but c is isolated from the graph!
d = c + 1
print(f"d.requires_grad: {d.requires_grad}")`;

  const outCode = `b.requires_grad: True
b.grad_fn: <MulBackward0 object at 0x...>

After detaching b to create c:
c.requires_grad: False
c.grad_fn: None
d.requires_grad: False`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500 overflow-y-auto pb-4">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">The .detach() Method</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Creates a <strong>new</strong> tensor object that shares the exact same physical data storage as the original, but is explicitly <strong>disconnected from the computation graph</strong>.
        </p>

        <button 
          onClick={() => setStep(s => (s + 1) % 3)} 
          className="w-full py-3 mb-6 bg-cyan-600 text-white rounded-lg text-sm font-bold hover:bg-cyan-700 shadow transition-all flex justify-center items-center gap-2 flex-shrink-0"
        >
          {step === 0 ? "Step 1: Standard Graph (Click to Detach)" : step === 1 ? "Step 2: c = b.detach() (Click to Apply Op)" : "Step 3: Graph Severed! (Click to Reset)"} <Pointer size={16}/>
        </button>

        {/* Responsive Flexbox Visualizer */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col items-center justify-center flex-1 relative overflow-x-auto min-h-[300px]">
           
           {/* Top container for tensors */}
           <div className="flex items-start justify-center gap-12 md:gap-24 w-full relative z-10 mb-12 mt-8">
              
              {/* Tensor b */}
              <div className="flex flex-col items-center relative">
                 <div className="absolute -top-6 w-0.5 h-6 bg-slate-400"></div>
                 <div className="absolute -top-8 text-[10px] text-slate-500 font-bold whitespace-nowrap">From graph (a * 2)</div>
                 
                 <div className="bg-emerald-100 border-2 border-emerald-400 p-2 rounded-xl text-center shadow-md w-28 relative">
                   <span className="font-mono font-bold text-emerald-900 block mb-1">Tensor b</span>
                   <div className="text-[9px] text-emerald-800 bg-white/60 p-1 rounded">req_grad=True<br/>grad_fn=MulBwd</div>
                 </div>
                 
                 {/* Arrow pointing down to memory */}
                 <div className="w-0.5 h-12 border-l-2 border-dotted border-emerald-400 mt-2"></div>
              </div>

              {/* Scissors Animation */}
              {step >= 1 && (
                 <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 text-rose-500 transition-all duration-1000 z-20
                  ${step === 1 ? 'scale-150 rotate-0' : 'scale-100 -rotate-45 translate-y-8 opacity-0'}`}>
                  <Scissors size={24} />
                 </div>
              )}

              {/* Tensor c */}
              <div className={`flex flex-col items-center transition-all duration-700
                 ${step >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'}`}>
                 <div className="bg-slate-100 border-2 border-slate-300 p-2 rounded-xl text-center shadow-md w-28 relative">
                   <span className="font-mono font-bold text-slate-700 block mb-1">Tensor c</span>
                   <div className="text-[9px] text-slate-500 bg-white/60 p-1 rounded">req_grad=False<br/>grad_fn=None</div>
                   
                   {/* Dependent operation */}
                   {step >= 2 && (
                      <div className="absolute top-[110%] left-1/2 transform -translate-x-1/2 bg-slate-100 border border-slate-300 text-[10px] text-slate-600 px-2 py-1 rounded shadow-sm whitespace-nowrap animate-in fade-in slide-in-from-top-2 z-20">
                          d = c + 1
                      </div>
                   )}
                 </div>
                 
                 {/* Arrow pointing down to memory */}
                 <div className="w-0.5 h-12 border-l-2 border-dotted border-slate-400 mt-2"></div>
              </div>

           </div>

           {/* The underlying physical memory */}
           <div className="w-64 bg-white border border-slate-300 rounded-lg p-3 shadow-inner flex flex-col items-center z-0 relative -mt-4">
              <div className="flex items-center gap-2 mb-2 text-slate-400"><Cpu size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Shared Physical RAM</span></div>
              <div className="flex gap-1 font-mono text-xs font-bold text-slate-700">
                <div className="bg-slate-200 px-2 py-1 rounded">1.0</div>
                <div className="bg-slate-200 px-2 py-1 rounded">2.0</div>
                <div className="bg-slate-200 px-2 py-1 rounded">...</div>
              </div>
           </div>

        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[180px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{step >= 1 ? outCode : `b.requires_grad: True\nb.grad_fn: <MulBackward0 object at 0x...>`}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 4: Comparison & In-Place ---
function ComparisonSlide() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <h3 className="text-xl font-bold mb-4">When to use which?</h3>
      <p className="text-slate-600 mb-6 leading-relaxed text-sm">
        Choosing between <code>torch.no_grad()</code>, <code>.detach()</code>, and <code>requires_grad_(False)</code> depends on the scope of what you are trying to achieve.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="text-cyan-500" size={20} />
            <h4 className="font-bold text-slate-800">torch.no_grad()</h4>
          </div>
          <div className="bg-cyan-50 text-cyan-800 text-[10px] font-bold px-2 py-1 rounded inline-block mb-3 uppercase tracking-wider">Block Level Scope</div>
          <ul className="text-sm text-slate-600 space-y-2 list-disc ml-4">
            <li>Use when performing a <strong>block of operations</strong> where nothing needs tracking.</li>
            <li>Highly efficient.</li>
            <li>Standard practice for wrapping entire validation or inference loops.</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Scissors className="text-rose-500" size={20} />
            <h4 className="font-bold text-slate-800">.detach()</h4>
          </div>
          <div className="bg-rose-50 text-rose-800 text-[10px] font-bold px-2 py-1 rounded inline-block mb-3 uppercase tracking-wider">Tensor Level Scope</div>
          <ul className="text-sm text-slate-600 space-y-2 list-disc ml-4">
            <li>Use when you need a <strong>specific tensor</strong> removed from the graph.</li>
            <li>Great for logging values, passing to NumPy, or updating metrics without ruining the main gradient flow.</li>
            <li>Careful: Modifying the detached tensor in-place modifies the original!</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-5 shadow-inner flex flex-col md:flex-row gap-6 items-start flex-shrink-0">
        <div className="w-full md:w-1/3">
           <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2"><AlertTriangle size={16}/> Modifying In-Place</h4>
           <p className="text-slate-300 text-xs leading-relaxed mb-4">
             You can directly flip the flag on a tensor using the in-place method with a trailing underscore. Often used to freeze specific parameters in a model permanently.
           </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl font-mono text-[11px] text-emerald-100 w-full md:w-2/3 overflow-x-auto shadow-sm">
          <pre>
{`my_tensor = torch.randn(5, requires_grad=`}<span className="text-orange-400">True</span>{`)\n`}
{`print(my_tensor.requires_grad) `}<span className="text-slate-500"># True</span>{`\n\n`}
<span className="text-slate-500"># Disable gradient tracking in-place</span>{`\n`}
{`my_tensor.`}<span className="text-cyan-400">requires_grad_</span>{`(`}<span className="text-orange-400">False</span>{`)\n\n`}
{`print(my_tensor.requires_grad) `}<span className="text-slate-500"># False</span>
          </pre>
        </div>
      </div>
    </div>
  );
}