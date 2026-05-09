import React, { useState } from 'react';
import { 
  GitBranch, ChevronLeft, ChevronRight, Calculator, 
  FastForward, Rewind, Activity, BookOpen
} from 'lucide-react';

export default function AutogradSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'concept', title: 'Why Auto-Diff?', component: ConceptSlide },
    { id: 'chain', title: 'The Chain Rule', component: ChainRuleSlide },
    { id: 'modes', title: 'Forward vs Reverse', component: ModesSlide },
    { id: 'graph', title: 'Computation Graph', component: GraphSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <GitBranch size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">The Concept of Automatic Differentiation</h2>
        <p className="text-slate-400 text-sm mb-4">How PyTorch calculates gradients automatically via Autograd</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-pink-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-pink-400' : 'hidden md:inline'}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: Concept & Why AD ---
function ConceptSlide() {
  return (
    <div className="animate-in fade-in duration-500 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Why Automatic Differentiation (AD)?</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Training neural networks requires knowing how a small change in millions of parameters affects the final loss value (the <strong>gradient</strong>). Manually calculating these derivatives is impossible. So, how do computers do it?
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 flex-1">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col shadow-sm">
          <div className="w-10 h-10 bg-slate-200 text-slate-600 rounded-lg flex items-center justify-center mb-4 border border-slate-300"><BookOpen size={20}/></div>
          <h4 className="font-bold text-slate-800 mb-2">Symbolic Differentiation</h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-1">
            Manipulates mathematical expressions to find exact formulas (like you do in calculus class).
          </p>
          <div className="bg-rose-50 text-rose-700 text-[10px] p-2 rounded border border-rose-200 font-bold uppercase tracking-wide">
            Flaw: Expression Swell
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Leads to incredibly massive, inefficient formulas for deep networks.</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col shadow-sm">
          <div className="w-10 h-10 bg-slate-200 text-slate-600 rounded-lg flex items-center justify-center mb-4 border border-slate-300"><Calculator size={20}/></div>
          <h4 className="font-bold text-slate-800 mb-2">Numerical Differentiation</h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-1">
            Approximates derivatives using finite differences (e.g., tweaking a parameter slightly and measuring the output change).
          </p>
          <div className="bg-rose-50 text-rose-700 text-[10px] p-2 rounded border border-rose-200 font-bold uppercase tracking-wide">
            Flaw: Round-off Errors
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Too slow (requires running the network for every single parameter) and unstable.</p>
        </div>

        <div className="bg-pink-50 border border-pink-300 rounded-xl p-5 flex flex-col shadow-md transform md:-translate-y-2">
          <div className="w-10 h-10 bg-pink-500 text-white rounded-lg flex items-center justify-center mb-4 shadow"><Activity size={20}/></div>
          <h4 className="font-bold text-pink-900 mb-2">Automatic Differentiation</h4>
          <p className="text-xs text-pink-800 leading-relaxed mb-4 flex-1">
            Calculates <strong>exact gradients efficiently</strong> by systematically applying the chain rule of calculus at the level of elementary computer operations.
          </p>
          <div className="bg-emerald-100 text-emerald-800 text-[10px] p-2 rounded border border-emerald-300 font-bold uppercase tracking-wide">
            The Winner for Deep Learning
          </div>
          <p className="text-[10px] text-pink-700 mt-2">Fast, precise, and easily handles complex control flows.</p>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: The Chain Rule ---
function ChainRuleSlide() {
  const [step, setStep] = useState(0);

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">The Chain Rule: The Engine of AD</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Fundamentally, AD breaks down complex computations into elementary steps, computes the local derivatives for each small step, and combines them using the chain rule.
        </p>

        <div className="bg-slate-100 border border-slate-300 p-4 rounded-xl text-center mb-6 shadow-sm">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">The Chain Rule Formula</p>
          <div className="flex items-center justify-center gap-2 font-serif text-lg text-slate-800">
            <span>dz</span>
            <span className="text-slate-400 border-b border-slate-400 pb-0.5 px-1">/</span>
            <span>dx</span>
            <span className="mx-2">=</span>
            <span>dz</span>
            <span className="text-slate-400 border-b border-slate-400 pb-0.5 px-1">/</span>
            <span className="text-pink-600 font-bold">dy</span>
            <span className="mx-2">·</span>
            <span className="text-pink-600 font-bold">dy</span>
            <span className="text-slate-400 border-b border-slate-400 pb-0.5 px-1">/</span>
            <span>dx</span>
          </div>
        </div>

        <button 
          onClick={() => setStep(s => (s + 1) % 4)} 
          className="w-full py-3 mb-4 bg-pink-500 text-white rounded-lg text-sm font-bold hover:bg-pink-600 shadow transition-all"
        >
          {step === 0 ? "Step 1: The Target Equation" : step === 1 ? "Step 2: Break it Down" : step === 2 ? "Step 3: Local Derivatives" : "Step 4: Combine via Chain Rule"}
        </button>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 shadow-inner flex flex-col font-mono text-sm text-slate-300 relative overflow-hidden">
         <div className="absolute top-0 right-0 bg-slate-800 px-4 py-2 rounded-bl-2xl font-bold text-xs text-slate-400 uppercase tracking-widest">
           Calculation Flow
         </div>

         <div className="mt-8 flex flex-col gap-6">
           {/* Target */}
           <div className={`transition-all duration-500 ${step >= 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <span className="text-slate-500 text-xs uppercase mb-1 block">Target:</span>
              <div className="text-xl text-white">L = (w · x + b)<sup>2</sup></div>
              <div className="text-xs text-pink-400 mt-1">Goal: Find ∂L / ∂w</div>
           </div>

           {/* Breakdown */}
           <div className={`transition-all duration-500 ${step >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <span className="text-slate-500 text-xs uppercase mb-1 block">Substitute variables:</span>
              <div className="flex flex-col gap-1 text-emerald-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <div>Let <strong className="text-emerald-400">y</strong> = w · x + b</div>
                <div>Then <strong className="text-emerald-400">L</strong> = y<sup>2</sup></div>
              </div>
           </div>

           {/* Partials */}
           <div className={`transition-all duration-500 ${step >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <span className="text-slate-500 text-xs uppercase mb-1 block">Local Derivatives:</span>
              <div className="flex justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <div className="text-cyan-300">∂L / ∂y = 2y</div>
                <div className="text-amber-300">∂y / ∂w = x</div>
              </div>
           </div>

           {/* Final */}
           <div className={`transition-all duration-500 ${step >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <span className="text-slate-500 text-xs uppercase mb-1 block">Combined (Chain Rule):</span>
              <div className="text-lg text-white">
                ∂L / ∂w = (∂L / ∂y) · (∂y / ∂w)
              </div>
              <div className="text-lg text-pink-400 mt-2 font-bold bg-pink-900/20 p-3 rounded border border-pink-500/30">
                ∂L / ∂w = (2(w · x + b)) · x
              </div>
           </div>
         </div>
      </div>
    </div>
  );
}

// --- Slide 3: Forward vs Reverse Modes ---
function ModesSlide() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <h3 className="text-xl font-bold mb-4">Forward vs Reverse Modes</h3>
      <p className="text-slate-600 mb-8 leading-relaxed text-sm">
        There are two main ways to apply the chain rule. <strong>PyTorch's Autograd system uses Reverse-mode automatic differentiation.</strong>
      </p>

      <div className="grid md:grid-cols-2 gap-6 flex-1">
        
        {/* Forward Mode */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col relative overflow-hidden opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded flex items-center justify-center border border-slate-300"><FastForward size={20}/></div>
             <h4 className="text-lg font-bold text-slate-800">Forward Mode</h4>
           </div>
           <p className="text-xs text-slate-600 mb-4 leading-relaxed">
             Traverses the steps from <strong>inputs to outputs</strong>. Efficient when the number of inputs is small compared to outputs.
           </p>
           
           <div className="mt-auto bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2 relative">
             <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
               <span>Inputs</span>
               <span>Outputs</span>
             </div>
             <div className="flex items-center gap-2 text-sm font-mono">
               <div className="bg-white px-2 py-1 border rounded shadow-sm">x1, x2</div>
               <div className="flex-1 h-0.5 bg-slate-300 relative">
                 <div className="absolute right-0 -top-1.5 w-3 h-3 border-t-2 border-r-2 border-slate-400 transform rotate-45"></div>
               </div>
               <div className="bg-white px-2 py-1 border rounded shadow-sm">y1...y100</div>
             </div>
             <span className="text-[10px] text-center text-rose-500 font-bold bg-rose-50 p-1 rounded border border-rose-100 mt-2">Terrible for Deep Learning!</span>
           </div>
        </div>

        {/* Reverse Mode */}
        <div className="bg-pink-50 border-2 border-pink-400 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-md transform md:scale-105">
           <div className="absolute -right-4 -top-4 opacity-10 text-pink-600"><Rewind size={120} /></div>
           <div className="flex items-center gap-3 mb-4 relative z-10">
             <div className="w-10 h-10 bg-pink-500 text-white rounded flex items-center justify-center shadow-md"><Rewind size={20}/></div>
             <h4 className="text-lg font-bold text-pink-900">Reverse Mode</h4>
           </div>
           <p className="text-xs text-pink-800 mb-4 leading-relaxed relative z-10">
             Traverses the steps backward, from <strong>final output to inputs</strong>. Significantly more efficient when outputs are small compared to inputs.
           </p>
           
           <div className="mt-auto bg-white/60 p-4 rounded-xl border border-pink-200 flex flex-col gap-2 relative z-10 shadow-sm">
             <div className="flex justify-between items-center text-[10px] font-bold uppercase text-pink-500">
               <span>Outputs</span>
               <span>Inputs (Params)</span>
             </div>
             <div className="flex items-center gap-2 text-sm font-mono flex-row-reverse">
               <div className="bg-white px-2 py-1 border border-pink-300 text-pink-700 font-bold rounded shadow-sm">Loss (1)</div>
               <div className="flex-1 h-0.5 bg-pink-400 relative">
                 <div className="absolute left-0 -top-1.5 w-3 h-3 border-b-2 border-l-2 border-pink-500 transform rotate-45"></div>
               </div>
               <div className="bg-white px-2 py-1 border border-slate-300 rounded shadow-sm text-xs">w1...w1M</div>
             </div>
             <span className="text-[10px] text-center text-emerald-700 font-bold bg-emerald-100 p-1 rounded border border-emerald-300 mt-2">Perfect for Neural Networks!</span>
           </div>
        </div>

      </div>
    </div>
  );
}

// --- Slide 4: Interactive Computation Graph ---
function GraphSlide() {
  const [step, setStep] = useState(0);

  // Layout parameters for the SVG graph overlay
  const W = 800;
  const H = 300;

  // Node Positions (x, y) mapped accurately for 800x300 space
  const pos = {
    a: { x: 80, y: 60 },
    x: { x: 80, y: 150 },
    b: { x: 80, y: 240 },
    mul: { x: 280, y: 150 },
    add: { x: 480, y: 150 },
    sq: { x: 630, y: 150 },
    loss: { x: 740, y: 150 }
  };

  const buildArrowPath = (start, end) => `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  const buildCurvePath = (start, end, offset=40) => {
    const mx = (start.x + end.x) / 2;
    const my = (start.y + end.y) / 2 + offset;
    return `M ${start.x} ${start.y} Q ${mx} ${my} ${end.x} ${end.y}`;
  };

  return (
    <div className="animate-in fade-in duration-500 flex flex-col h-full">
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold">The Computation Graph</h3>
          <p className="text-slate-600 text-sm">Visualizing <code>L = (a · x + b)²</code> and the <code>.backward()</code> pass.</p>
        </div>
        <button 
          onClick={() => setStep(s => (s + 1) % 3)} 
          className="px-6 py-2 bg-pink-500 text-white rounded-lg text-sm font-bold hover:bg-pink-600 shadow transition-all flex items-center gap-2"
        >
          {step === 0 ? "1. Create Tensors" : step === 1 ? "2. Forward Pass (Calculate L)" : "3. .backward() Pass (Gradients)"}
        </button>
      </div>

      {/* Graph Area wrapped in overflow-x-auto to prevent clipping on small screens */}
      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-x-auto overflow-y-hidden flex flex-col items-center justify-center shadow-inner">
        <div style={{ minWidth: W, width: W, height: H, position: 'relative' }}>
          
          {/* Background shaded areas strictly locked to the 800px coordinate system */}
          <div className="absolute top-4 left-[20px] bottom-4 w-[120px] bg-slate-200/50 rounded-xl border border-slate-300 flex justify-center pt-2 z-0">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inputs</span>
          </div>
          <div className="absolute top-10 left-[200px] bottom-10 w-[480px] bg-slate-200/30 rounded-xl border border-slate-300 flex justify-center pt-2 z-0">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operations</span>
          </div>

          {/* SVG overlay for lines */}
          <svg width={W} height={H} className="absolute inset-0 z-0">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
              </marker>
              <marker id="redarrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
              </marker>
            </defs>
            
            {/* Forward Pass Lines (Visible in step 1 & 2) */}
            <g className={`transition-opacity duration-700 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
              <path d={buildArrowPath({x:110, y:60}, {x:250, y:140})} stroke="#475569" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
              <path d={buildArrowPath({x:110, y:150}, {x:250, y:150})} stroke="#475569" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
              <path d={buildArrowPath({x:310, y:150}, {x:450, y:150})} stroke="#475569" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
              <path d={buildArrowPath({x:110, y:240}, {x:450, y:160})} stroke="#475569" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
              <path d={buildArrowPath({x:510, y:150}, {x:600, y:150})} stroke="#475569" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
              <path d={buildArrowPath({x:660, y:150}, {x:700, y:150})} stroke="#475569" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
            </g>

            {/* Backward Pass Lines (Visible in step 2) */}
            <g className={`transition-opacity duration-1000 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
              {/* L -> sq */}
              <path d={buildCurvePath({x:740, y:165}, {x:660, y:165}, 30)} stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#redarrow)"/>
              <circle cx="740" cy="165" r="4" fill="none" stroke="#ef4444" strokeWidth="2" />
              <text x="700" y="195" fontSize="10" fill="#000" fontWeight="bold" textAnchor="middle">dL/dL=1</text>

              {/* sq -> add */}
              <path d={buildCurvePath({x:600, y:160}, {x:510, y:160}, -20)} stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#redarrow)"/>
              <circle cx="600" cy="160" r="4" fill="none" stroke="#ef4444" strokeWidth="2" />
              <text x="555" y="125" fontSize="10" fill="#000" fontWeight="bold" textAnchor="middle">dL/dy</text>

              {/* add -> mul */}
              <path d={buildCurvePath({x:450, y:140}, {x:310, y:140}, -20)} stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#redarrow)"/>
              <circle cx="450" cy="140" r="4" fill="none" stroke="#ef4444" strokeWidth="2" />
              <text x="380" y="105" fontSize="10" fill="#000" fontWeight="bold" textAnchor="middle">dL/d(a*x)</text>

              {/* add -> b */}
              <path d={buildCurvePath({x:450, y:165}, {x:110, y:255}, 80)} stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#redarrow)"/>
              <circle cx="450" cy="165" r="4" fill="none" stroke="#ef4444" strokeWidth="2" />
              <text x="290" y="260" fontSize="10" fill="#000" fontWeight="bold" textAnchor="middle">dL/db</text>

              {/* mul -> x */}
              <path d={buildCurvePath({x:250, y:165}, {x:110, y:165}, 30)} stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#redarrow)"/>
              <circle cx="250" cy="165" r="4" fill="none" stroke="#ef4444" strokeWidth="2" />
              <text x="180" y="200" fontSize="10" fill="#000" fontWeight="bold" textAnchor="middle">dL/dx</text>

              {/* mul -> a */}
              <path d={buildCurvePath({x:250, y:135}, {x:110, y:75}, -40)} stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#redarrow)"/>
              <circle cx="250" cy="135" r="4" fill="none" stroke="#ef4444" strokeWidth="2" />
              <text x="180" y="100" fontSize="10" fill="#000" fontWeight="bold" textAnchor="middle">dL/da</text>
            </g>
          </svg>

          {/* HTML Nodes overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none">
             {/* Inputs */}
             <div className="absolute w-[60px] h-[40px] bg-blue-100 flex items-center justify-center font-bold font-mono text-sm rounded-lg shadow-sm border border-blue-300 text-blue-900" style={{left: pos.a.x - 30, top: pos.a.y - 20}}>a</div>
             <div className="absolute w-[60px] h-[40px] bg-blue-100 flex items-center justify-center font-bold font-mono text-sm rounded-lg shadow-sm border border-blue-300 text-blue-900" style={{left: pos.x.x - 30, top: pos.x.y - 20}}>x</div>
             <div className="absolute w-[60px] h-[40px] bg-blue-100 flex items-center justify-center font-bold font-mono text-sm rounded-lg shadow-sm border border-blue-300 text-blue-900" style={{left: pos.b.x - 30, top: pos.b.y - 20}}>b</div>

             {/* Ops */}
             <div className={`absolute w-[60px] h-[40px] bg-emerald-100 flex items-center justify-center font-bold text-lg rounded-lg shadow-sm border border-emerald-300 text-emerald-900 transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{left: pos.mul.x - 30, top: pos.mul.y - 20}}>*</div>
             <div className={`absolute w-[60px] h-[40px] bg-emerald-100 flex items-center justify-center font-bold text-lg rounded-lg shadow-sm border border-emerald-300 text-emerald-900 transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{left: pos.add.x - 30, top: pos.add.y - 20}}>+</div>
             <div className={`absolute w-[60px] h-[40px] bg-emerald-100 flex items-center justify-center font-bold font-mono text-sm rounded-full shadow-sm border border-emerald-300 text-emerald-900 transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{left: pos.sq.x - 30, top: pos.sq.y - 20}}>^2</div>

             {/* Output */}
             <div className={`absolute w-[70px] h-[40px] bg-rose-100 flex items-center justify-center font-bold font-mono text-xs text-rose-900 rounded-full shadow-sm border border-rose-300 transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{left: pos.loss.x - 35, top: pos.loss.y - 20}}>L (Loss)</div>
          </div>
        </div>
      </div>

      {/* Helper text moved below graph to avoid obscuring it */}
      <div className="mt-4 p-4 bg-slate-100 rounded-xl border border-slate-200 text-sm text-slate-700 font-medium text-center shadow-sm">
        {step === 0 && "Tensors created with requires_grad=True tell PyTorch to prepare for recording operations."}
        {step === 1 && "Solid lines represent the forward pass. PyTorch computes the output AND builds the Directed Acyclic Graph (DAG) representing the math."}
        {step === 2 && "Dashed lines show L.backward() applying the chain rule in reverse to populate the .grad attributes of a, x, and b."}
      </div>
    </div>
  );
}