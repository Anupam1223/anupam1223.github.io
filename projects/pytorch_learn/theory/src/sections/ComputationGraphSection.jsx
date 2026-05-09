import React, { useState, useEffect } from 'react';
import { 
  Network, ChevronLeft, ChevronRight, Code, Terminal, 
  GitMerge, RefreshCw, Leaf, ArrowDown, Activity, Play, Pointer, ArrowRight
} from 'lucide-react';

export default function ComputationGraphSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'concept', title: 'Directed Acyclic Graphs', component: ConceptSlide },
    { id: 'dynamic', title: 'Dynamic Nature', component: DynamicNatureSlide },
    { id: 'passes', title: 'Forward & Backward', component: PassesSlide },
    { id: 'leaves', title: 'Leaf Tensors', component: LeafTensorsSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Network size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">PyTorch Computation Graphs</h2>
        <p className="text-slate-400 text-sm mb-4">Under the hood of Autograd's dynamic DAGs</p>
        
        <div className="flex gap-2 mb-2">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-sky-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-sky-400' : 'hidden md:inline'}>
              {slide.title}
            </span>
          ))}
        </div>
      </div>

      <div className="min-h-[550px] flex flex-col">
        <div className="flex-1">
          <CurrentComponent />
        </div>

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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Slide 1: Concept ---
function ConceptSlide() {
  const pyCode = `import torch\n\n# Tensors that require gradients\nx = torch.tensor(2.0, requires_grad=True)\nw = torch.tensor(3.0, requires_grad=True)\nb = torch.tensor(1.0, requires_grad=True)\n\n# Operations\ny = w * x  # Intermediate result 'y'\nz = y + b  # Final result 'z'\n\nprint(f"Result z: {z}")`;
  const outCode = `Result z: 7.0`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Directed Acyclic Graphs (DAG)</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Every time you perform an operation on tensors with <code>requires_grad=True</code>, PyTorch dynamically builds a computation graph behind the scenes to track the math.
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 shadow-sm flex items-start gap-4">
            <div className="bg-white p-2 rounded-lg shadow-sm border border-sky-100 mt-1">
              <div className="w-4 h-4 rounded-sm bg-[#bde0fe] border border-slate-800"></div>
            </div>
            <div>
              <h4 className="font-bold text-sky-900 text-sm mb-1">Nodes</h4>
              <p className="text-xs text-sky-800 leading-relaxed">Represent the actual <strong>Tensors</strong> (data) or the mathematical <strong>Operations</strong> applied to them.</p>
            </div>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm flex items-start gap-4">
            <div className="bg-white p-2 rounded-lg shadow-sm border border-emerald-100 mt-1">
              <ArrowDown size={16} className="text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 text-sm mb-1">Edges (Arrows)</h4>
              <p className="text-xs text-emerald-800 leading-relaxed">Represent the <strong>flow of data</strong> and the functional dependencies from one operation to the next.</p>
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

// --- Slide 2: Dynamic Nature ---
function DynamicNatureSlide() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % 4);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">The Dynamic Nature of PyTorch</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Unlike older frameworks that require defining the entire graph before running, PyTorch builds the graph <strong>on-the-fly</strong> (Define-by-Run) as your Python code executes line-by-line.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 flex-1">
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-sm">
           <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4"><RefreshCw size={20} className="text-sky-500"/> Flexibility</h4>
           <p className="text-xs text-slate-600 leading-relaxed mb-6">
             Standard Python control flow (like <code>if</code> conditions or <code>for</code> loops) can directly change the graph structure mid-flight during the forward pass.
           </p>
           
           {/* Animated Loop Unrolling Visual */}
           <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex-1 flex flex-col justify-center gap-3">
              <div className="font-mono text-xs font-bold text-slate-500">for i in range(3):<br/>&nbsp;&nbsp;y = y * w</div>
              <div className="flex items-center gap-2 mt-2 transition-all">
                 <div className="w-8 h-8 rounded bg-[#bde0fe] border border-slate-800 flex items-center justify-center text-xs font-mono">y</div>
                 {step >= 1 && <><ArrowRight size={12} className="text-slate-400"/><div className="w-8 h-8 rounded-full bg-[#fceda6] border border-slate-800 flex items-center justify-center text-xs font-mono">*w</div></>}
                 {step >= 2 && <><ArrowRight size={12} className="text-slate-400"/><div className="w-8 h-8 rounded-full bg-[#fceda6] border border-slate-800 flex items-center justify-center text-xs font-mono">*w</div></>}
                 {step >= 3 && <><ArrowRight size={12} className="text-slate-400"/><div className="w-8 h-8 rounded-full bg-[#fceda6] border border-slate-800 flex items-center justify-center text-xs font-mono">*w</div></>}
              </div>
           </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-sm">
           <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4"><Activity size={20} className="text-sky-500"/> Debugging</h4>
           <p className="text-xs text-slate-600 leading-relaxed mb-6">
             Because graph construction happens concurrently with your code, standard Python debuggers (like <code>pdb</code> or <code>print()</code> statements) work perfectly.
           </p>
           
           <div className="bg-slate-900 rounded-xl p-4 flex-1 font-mono text-[10px] text-emerald-100 flex flex-col justify-center">
<pre>
def my_model(x):
    y = x * w
    <span className="text-amber-400 font-bold">print(f"y shape: {'{y.shape}'}")</span> # Works!
    if y.sum() &gt; 0:
        return y + b
    return y - b
</pre>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Accurate Visual Graph (Forward/Backward) ---
function PassesSlide() {
  const [step, setStep] = useState(0);

  const W = 600;
  const H = 380;

  // Exact coordinates derived from the uploaded image structure
  const pos = {
    x: { x: 150, y: 50 },
    w: { x: 450, y: 50 },
    mul: { x: 300, y: 140 },
    y: { x: 300, y: 220 },
    b: { x: 450, y: 220 },
    add: { x: 360, y: 300 },
    z: { x: 360, y: 380 } // slightly lower
  };

  const drawLine = (p1, p2) => `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold">Forward and Backward Passes</h3>
          <p className="text-slate-600 text-sm">Visualizing <code>z = (w * x) + b</code></p>
        </div>
        <button 
          onClick={() => setStep(s => (s + 1) % 3)} 
          className="px-6 py-2 bg-sky-500 text-white rounded-lg text-sm font-bold hover:bg-sky-600 shadow transition-all flex items-center gap-2"
        >
          {step === 0 ? "1. Input Tensors" : step === 1 ? "2. Forward Pass (Build DAG)" : "3. .backward() Pass"} <Pointer size={16}/>
        </button>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl relative overflow-x-auto overflow-y-hidden shadow-sm p-4">
        <div style={{ minWidth: W, width: '100%', height: H, position: 'relative' }} className="mx-auto max-w-[700px]">
          
          <svg width="100%" height="100%" viewBox="0 0 600 420" className="absolute inset-0 z-0">
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
              </marker>
            </defs>

            {/* Edges shown during and after Forward Pass */}
            <g className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
              {/* x to * */}
              <path d={drawLine({x:200, y:70}, {x:280, y:125})} stroke="#000" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
              {/* w to * */}
              <path d={drawLine({x:400, y:70}, {x:320, y:125})} stroke="#000" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
              {/* * to y */}
              <path d={drawLine({x:300, y:160}, {x:300, y:190})} stroke="#000" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
              
              <text x="310" y="180" fontSize="12" fill="#000">grad_fn=&lt;MulBackward0&gt;</text>

              {/* y to + */}
              <path d={drawLine({x:320, y:250}, {x:345, y:285})} stroke="#000" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
              {/* b to + */}
              <path d={drawLine({x:420, y:250}, {x:375, y:285})} stroke="#000" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
              {/* + to z */}
              <path d={drawLine({x:360, y:320}, {x:360, y:350})} stroke="#000" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
              
              <text x="370" y="340" fontSize="12" fill="#000">grad_fn=&lt;AddBackward0&gt;</text>
            </g>
          </svg>

          {/* HTML Nodes matching the exact visual style of the screenshot */}
          <div className="absolute inset-0 pointer-events-none" style={{ transform: 'scale(1)', transformOrigin: 'top left' }}>
             
             {/* Inputs (Blue) */}
             <div className="absolute bg-[#bde0fe] border border-black font-mono text-xs flex items-center justify-center p-3 shadow-sm" style={{left: '50px', top: '20px', width: '220px', height: '40px'}}>
               x (data=2.0, requires_grad=True)
             </div>
             
             <div className="absolute bg-[#bde0fe] border border-black font-mono text-xs flex items-center justify-center p-3 shadow-sm" style={{left: '330px', top: '20px', width: '220px', height: '40px'}}>
               w (data=3.0, requires_grad=True)
             </div>

             {/* Operations (Yellow Ellipses) */}
             <div className={`absolute bg-[#fceda6] border border-black font-mono text-sm flex items-center justify-center rounded-[100%] shadow-sm transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{left: '270px', top: '120px', width: '60px', height: '40px'}}>
               *
             </div>

             {/* Intermediate / Output (Green) */}
             <div className={`absolute bg-[#c3f0c2] border border-black font-mono text-xs flex items-center justify-center p-3 shadow-sm transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{left: '210px', top: '210px', width: '180px', height: '40px'}}>
               y (result of w*x)
             </div>

             <div className="absolute bg-[#bde0fe] border border-black font-mono text-xs flex items-center justify-center p-3 shadow-sm" style={{left: '420px', top: '210px', width: '200px', height: '40px'}}>
               b (data=1.0, requires_grad=True)
             </div>

             <div className={`absolute bg-[#fceda6] border border-black font-mono text-sm flex items-center justify-center rounded-[100%] shadow-sm transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{left: '330px', top: '280px', width: '60px', height: '40px'}}>
               +
             </div>

             <div className={`absolute bg-[#c3f0c2] border border-black font-mono text-xs flex items-center justify-center p-3 shadow-sm transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{left: '285px', top: '350px', width: '150px', height: '40px'}}>
               z (result of y+b)
             </div>

             {/* Backward Gradients Highlights (Step 2) */}
             {step >= 2 && (
               <>
                 <div className="absolute border-[3px] border-rose-500 bg-rose-500/20 rounded shadow-lg shadow-rose-500/30 animate-pulse" style={{left: '46px', top: '16px', width: '228px', height: '48px'}} />
                 <div className="absolute border-[3px] border-rose-500 bg-rose-500/20 rounded shadow-lg shadow-rose-500/30 animate-pulse" style={{left: '326px', top: '16px', width: '228px', height: '48px'}} />
                 <div className="absolute border-[3px] border-rose-500 bg-rose-500/20 rounded shadow-lg shadow-rose-500/30 animate-pulse" style={{left: '416px', top: '206px', width: '208px', height: '48px'}} />
                 <div className="absolute text-rose-600 font-bold text-xs bg-white px-2 border border-rose-200 rounded" style={{left: '110px', top: '70px'}}>z.backward() computes gradients</div>
                 <div className="absolute text-rose-600 font-bold text-xs bg-white px-2 border border-rose-200 rounded" style={{left: '110px', top: '90px'}}>.grad accumulates here</div>
               </>
             )}
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium text-center shadow-sm">
        {step === 0 && "Blue boxes are input tensors. Notice they all have requires_grad=True."}
        {step === 1 && "Forward Pass: Yellow ellipses are operations. Green boxes are intermediate/output tensors. Tensors created by ops gain a grad_fn pointing back to their creator."}
        {step === 2 && "Backward Pass: Calling z.backward() traverses the grad_fn edges backwards, applying the chain rule to accumulate gradients (.grad) exclusively into the initial blue Leaf tensors."}
      </div>
    </div>
  );
}

// --- Slide 4: Leaf Tensors ---
function LeafTensorsSlide() {
  const codeStr = `# Leaf Tensors (User created)
print(f"x is_leaf: {x.is_leaf}") # True
print(f"w is_leaf: {w.is_leaf}") # True
print(f"b is_leaf: {b.is_leaf}") # True

# Non-Leaf Tensors (Result of operations)
print(f"y is_leaf: {y.is_leaf}") # False
print(f"z is_leaf: {z.is_leaf}") # False

# Only leaf tensors retain gradients by default!
z.backward()
print(x.grad) # tensor(3.)
print(y.grad) # None (Discarded to save memory!)`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Leaf vs Non-Leaf Tensors</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Understanding the graph structure reveals a crucial PyTorch memory optimization mechanism regarding where gradients are actually stored.
        </p>

        <div className="space-y-4">
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 shadow-sm">
            <h4 className="font-bold text-sky-900 text-sm mb-2 flex items-center gap-2"><Leaf size={16}/> Leaf Tensors</h4>
            <p className="text-xs text-sky-800 leading-relaxed">
              Tensors at the "beginning" of the graph. They are created directly by you (e.g., <code>torch.tensor()</code>, Model parameters). 
              <br/><br/><strong>Rule:</strong> Gradients computed during <code>.backward()</code> are retained and accumulated in their <code>.grad</code> attribute.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
            <h4 className="font-bold text-emerald-900 text-sm mb-2 flex items-center gap-2"><GitMerge size={16}/> Non-Leaf (Intermediate)</h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Tensors created as the result of an operation within the graph (like <code>y</code> and <code>z</code>). They have a <code>grad_fn</code>.
              <br/><br/><strong>Rule:</strong> Their gradients are computed to pass backwards, but are <strong>discarded after use</strong> to save memory, leaving their <code>.grad</code> as <code>None</code>.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[350px] text-emerald-100">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Verifying Leaves in Python</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed">{codeStr}</pre>
        </div>
      </div>
    </div>
  );
}