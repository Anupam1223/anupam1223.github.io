import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, ArrowRight, ChevronLeft, ChevronRight, 
  GitBranch, GitMerge, Layers, Network, 
  Settings, Play, Cpu, MoveLeft, FastForward, RotateCcw, Combine, Box, Calculator,
  HelpCircle, CheckCircle2, Lightbulb
} from 'lucide-react';

export const meta = {
  title: '13. The Chain Rule & Backprop',
  subtitle: 'Forward & Backpropagation of Neural Networks',
};

// --- Shared Helper Components ---
const MathExpr = ({ children }) => (
  <span className="font-serif italic text-blue-300 mx-1 text-[1.05em] whitespace-nowrap">
    {children}
  </span>
);

const HighlightBox = ({ children, icon: Icon, title, color = "blue" }) => {
  const colorMap = {
    blue: "bg-blue-900/20 border-blue-800/50 text-blue-400",
    emerald: "bg-emerald-900/20 border-emerald-800/50 text-emerald-400",
    purple: "bg-purple-900/20 border-purple-800/50 text-purple-400",
    orange: "bg-orange-900/20 border-orange-800/50 text-orange-400",
    rose: "bg-rose-900/20 border-rose-800/50 text-rose-400",
  };
  
  return (
    <div className={`border rounded-xl p-6 my-6 shadow-inner ${colorMap[color] || colorMap.blue}`}>
      {title && (
        <div className="flex items-center gap-2 mb-3">
          {Icon && <Icon className="w-5 h-5" />}
          <h4 className="font-semibold text-slate-100">{title}</h4>
        </div>
      )}
      <div className="text-slate-300 leading-relaxed">
        {children}
      </div>
    </div>
  );
};

const SlideFrame = ({ title, children }) => (
  <div className="flex flex-col h-full bg-[#0a0f18] p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-800">
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3 pb-4 border-b border-slate-800/80 shrink-0">
      <Activity className="text-blue-500" size={28} />
      {title}
    </h2>
    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
      {children}
    </div>
  </div>
);

const SlideSingleVariable = () => {
  return (
    <SlideFrame title="Revisiting the Chain Rule">
      <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
        <p>
          Machine learning models are built by <strong>composing functions together</strong>. Imagine an assembly line: an input <MathExpr>x</MathExpr> goes into a function <MathExpr>g</MathExpr>, producing an intermediate output <MathExpr>u</MathExpr>. This <MathExpr>u</MathExpr> immediately becomes the input to the next function <MathExpr>f</MathExpr>, yielding the final result <MathExpr>y</MathExpr>.
        </p>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center my-8 shadow-xl">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Function Composition</span>
          <div className="flex items-center gap-4 text-2xl font-serif text-white flex-wrap justify-center">
            <span className="text-blue-400 font-bold">x</span>
            <ArrowRight className="text-slate-600" />
            <span className="border-2 border-purple-500/50 bg-purple-900/20 px-4 py-2 rounded-xl text-purple-300">g(x)</span>
            <ArrowRight className="text-slate-600" />
            <span className="text-purple-400 font-bold">u</span>
            <ArrowRight className="text-slate-600" />
            <span className="border-2 border-emerald-500/50 bg-emerald-900/20 px-4 py-2 rounded-xl text-emerald-300">f(u)</span>
            <ArrowRight className="text-slate-600" />
            <span className="text-emerald-400 font-bold">y</span>
          </div>
          <p className="mt-4 text-slate-400 text-sm italic">Mathematically: y = f(g(x))</p>
        </div>

        <p>
          If we want to know how a tiny change in the initial input <MathExpr>x</MathExpr> affects the final output <MathExpr>y</MathExpr>, we need the derivative <MathExpr>dy/dx</MathExpr>. The <strong>Chain Rule</strong> connects these layers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-md">
            <h4 className="text-blue-400 font-bold mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Settings size={18} /> Leibniz Notation
            </h4>
            <div className="flex items-center justify-center text-2xl font-serif text-white py-4 gap-4">
              <div className="flex flex-col items-center"><span className="border-b border-white px-2 pb-1 text-emerald-400">dy</span><span className="pt-1 text-blue-400">dx</span></div>
              <span className="text-slate-500">=</span>
              <div className="flex flex-col items-center"><span className="border-b border-white px-2 pb-1 text-emerald-400">dy</span><span className="pt-1 text-purple-400">du</span></div>
              <span className="text-slate-400 font-bold">&middot;</span>
              <div className="flex flex-col items-center"><span className="border-b border-white px-2 pb-1 text-purple-400">du</span><span className="pt-1 text-blue-400">dx</span></div>
            </div>
            <p className="text-sm text-slate-400 mt-2 text-center">Visualizes the "canceling" of intermediate variables.</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-md">
            <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Layers size={18} /> Lagrange Notation
            </h4>
            <div className="flex items-center justify-center text-xl md:text-2xl font-serif text-white py-6">
              h'(x) = <span className="text-emerald-400 ml-2">f'(</span><span className="text-purple-400">g(x)</span><span className="text-emerald-400">)</span> <span className="text-slate-400 mx-2 font-bold">&middot;</span> <span className="text-purple-400">g'(x)</span>
            </div>
            <p className="text-sm text-slate-400 mt-2 text-center">Derivative of outside (evaluated at inside) &times; derivative of inside.</p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideExample = () => {
  const [step, setStep] = useState(0);

  return (
    <SlideFrame title="Example: Exponential Composition">
      <div className="space-y-6 flex flex-col h-full">
        <div className="flex justify-between items-end shrink-0">
          <p className="text-slate-300 text-lg">
            Let's evaluate <MathExpr>h(x) = e&sup3;&#739;</MathExpr>. We can break this composite function into two distinct layers.
          </p>
          <button 
            onClick={() => setStep(s => (s + 1) % 4)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-all active:scale-95 shadow-md"
          >
            {step === 3 ? "Reset" : "Next Step"} <ArrowRight size={16}/>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col justify-center">
            <div className="space-y-6 text-xl font-serif text-white">
              {/* Function Definition */}
              <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 w-24 text-sm font-sans uppercase font-bold tracking-widest">Setup</span>
                <span>
                  <span className="text-emerald-400">y</span> = e<sup className="text-purple-400">u</sup>
                </span>
                <span className="text-slate-500 text-sm font-sans mx-2">where</span>
                <span>
                  <span className="text-purple-400">u</span> = <span className="text-blue-400">3x</span>
                </span>
              </div>

              {/* Step 1: Individual Derivatives */}
              <div className={`transition-all duration-500 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="flex flex-col gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-inner">
                  <span className="text-slate-400 text-sm font-sans uppercase font-bold tracking-widest border-b border-slate-700 pb-2">1. Individual Derivatives</span>
                  <div className="flex justify-around">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center text-lg"><span className="border-b border-white px-1 text-purple-400">du</span><span className="text-blue-400">dx</span></div>
                      <span>= <span className="text-blue-300 font-bold">3</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center text-lg"><span className="border-b border-white px-1 text-emerald-400">dy</span><span className="text-purple-400">du</span></div>
                      <span>= <span className="text-emerald-300 font-bold">e<sup className="text-purple-400">u</sup></span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Multiply */}
              <div className={`transition-all duration-500 delay-100 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                 <div className="flex flex-col gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-inner">
                  <span className="text-slate-400 text-sm font-sans uppercase font-bold tracking-widest border-b border-slate-700 pb-2">2. Apply Chain Rule (Multiply)</span>
                  <div className="flex justify-center items-center gap-4">
                    <div className="flex flex-col items-center text-lg"><span className="border-b border-white px-1 text-emerald-400">dy</span><span className="text-blue-400">dx</span></div>
                    <span>=</span>
                    <span className="bg-emerald-900/30 px-3 py-1 rounded border border-emerald-500/30 text-emerald-300 font-bold">e<sup className="text-purple-400">u</sup></span>
                    <span className="text-slate-400 font-bold">&middot;</span>
                    <span className="bg-blue-900/30 px-3 py-1 rounded border border-blue-500/30 text-blue-300 font-bold">3</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Substitute Back */}
              <div className={`transition-all duration-500 delay-100 ${step >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <div className="flex flex-col gap-4 bg-blue-900/20 p-6 rounded-xl border-2 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                  <span className="text-blue-400 text-sm font-sans uppercase font-bold tracking-widest border-b border-blue-800/50 pb-2">3. Substitute u = 3x Back</span>
                  <div className="flex justify-center items-center gap-4 text-3xl">
                    <div className="flex flex-col items-center text-xl"><span className="border-b border-white px-1 text-emerald-400">dy</span><span className="text-blue-400">dx</span></div>
                    <span>=</span>
                    <span className="text-white font-bold">e<sup className="text-blue-400">3x</sup> &middot; 3</span>
                    <span className="text-slate-500">=</span>
                    <span className="text-emerald-400 font-bold">3e<sup className="text-blue-400">3x</sup></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <HighlightBox icon={Layers} title="Layer by Layer" color="blue">
              <p className="text-[15px]">
                The chain rule allows us to break down complex, nested functions into manageable steps. We compute the rate of change <strong>layer by layer</strong>, multiplying these rates together to find the overall rate of change.
              </p>
            </HighlightBox>
            <HighlightBox icon={Network} title="The Deep Learning Link" color="purple">
              <p className="text-[15px]">
                This exact principle, extended to functions with multiple variables, forms the core mechanism of <strong>backpropagation</strong>. It allows us to calculate how changes in a specific weight deep inside the network affect the final error output.
              </p>
            </HighlightBox>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideMultivariable = () => {
  const [activePath, setActivePath] = useState('all');

  return (
    <SlideFrame title="The Multivariable Chain Rule">
      <div className="space-y-6 flex flex-col h-full">
        <p className="text-slate-300 text-lg leading-relaxed shrink-0">
          Machine learning models have multiple inputs and outputs. Imagine an output <MathExpr>z</MathExpr> depends on two intermediate variables, <MathExpr>x</MathExpr> and <MathExpr>y</MathExpr>. Furthermore, both <MathExpr>x</MathExpr> and <MathExpr>y</MathExpr> depend on an underlying variable <MathExpr>t</MathExpr>. How does <MathExpr>z</MathExpr> change when <MathExpr>t</MathExpr> changes?
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col items-center justify-center relative min-h-[300px]">
             <h3 className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Dependency Graph</h3>
             
             <svg viewBox="0 0 400 250" className="w-full h-full max-w-[400px] mt-4">
               <defs>
                 <marker id="arrow-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                   <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                 </marker>
                 <marker id="arrow-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                   <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                 </marker>
                 <marker id="arrow-slate" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                   <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                 </marker>
               </defs>

               {/* Nodes */}
               <circle cx="50" cy="125" r="25" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
               <text x="50" y="130" fill="#fff" fontSize="18" fontStyle="italic" textAnchor="middle">t</text>

               <circle cx="200" cy="50" r="25" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" opacity={activePath === 'y' ? 0.3 : 1}/>
               <text x="200" y="55" fill="#fff" fontSize="18" fontStyle="italic" textAnchor="middle" opacity={activePath === 'y' ? 0.3 : 1}>x</text>

               <circle cx="200" cy="200" r="25" fill="#10b981" stroke="#059669" strokeWidth="2" opacity={activePath === 'x' ? 0.3 : 1}/>
               <text x="200" y="205" fill="#fff" fontSize="18" fontStyle="italic" textAnchor="middle" opacity={activePath === 'x' ? 0.3 : 1}>y</text>

               <circle cx="350" cy="125" r="25" fill="#a855f7" stroke="#9333ea" strokeWidth="2" />
               <text x="350" y="130" fill="#fff" fontSize="18" fontStyle="italic" textAnchor="middle">z</text>

               {/* Path T -> X -> Z */}
               <g opacity={activePath === 'y' ? 0.2 : 1} className="transition-opacity duration-300">
                 <line x1="72" y1="114" x2="175" y2="62" stroke={activePath === 'x' || activePath === 'all' ? "#3b82f6" : "#475569"} strokeWidth="3" markerEnd={`url(#arrow-${activePath === 'x' || activePath === 'all' ? 'blue' : 'slate'})`} />
                 <text x="110" y="75" fill={activePath === 'x' || activePath === 'all' ? "#93c5fd" : "#64748b"} fontSize="14" fontStyle="italic">dx/dt</text>

                 <line x1="225" y1="62" x2="328" y2="114" stroke={activePath === 'x' || activePath === 'all' ? "#3b82f6" : "#475569"} strokeWidth="3" markerEnd={`url(#arrow-${activePath === 'x' || activePath === 'all' ? 'blue' : 'slate'})`} />
                 <text x="270" y="75" fill={activePath === 'x' || activePath === 'all' ? "#93c5fd" : "#64748b"} fontSize="14" fontStyle="italic">&part;z/&part;x</text>
               </g>

               {/* Path T -> Y -> Z */}
               <g opacity={activePath === 'x' ? 0.2 : 1} className="transition-opacity duration-300">
                 <line x1="72" y1="136" x2="175" y2="188" stroke={activePath === 'y' || activePath === 'all' ? "#10b981" : "#475569"} strokeWidth="3" markerEnd={`url(#arrow-${activePath === 'y' || activePath === 'all' ? 'green' : 'slate'})`} />
                 <text x="110" y="185" fill={activePath === 'y' || activePath === 'all' ? "#6ee7b7" : "#64748b"} fontSize="14" fontStyle="italic">dy/dt</text>

                 <line x1="225" y1="188" x2="328" y2="136" stroke={activePath === 'y' || activePath === 'all' ? "#10b981" : "#475569"} strokeWidth="3" markerEnd={`url(#arrow-${activePath === 'y' || activePath === 'all' ? 'green' : 'slate'})`} />
                 <text x="270" y="185" fill={activePath === 'y' || activePath === 'all' ? "#6ee7b7" : "#64748b"} fontSize="14" fontStyle="italic">&part;z/&part;y</text>
               </g>
             </svg>
             
             <div className="flex gap-2 mt-4 z-20">
               <button onClick={()=>setActivePath('x')} className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${activePath === 'x' ? 'bg-blue-600/30 border-blue-500 text-blue-200' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>Highlight X Path</button>
               <button onClick={()=>setActivePath('y')} className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${activePath === 'y' ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>Highlight Y Path</button>
               <button onClick={()=>setActivePath('all')} className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${activePath === 'all' ? 'bg-purple-600/30 border-purple-500 text-purple-200' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>Show Full Sum</button>
             </div>
          </div>

          <div className="flex flex-col justify-center gap-6">
            <HighlightBox icon={GitBranch} title="Sum of All Paths" color="emerald">
              <p className="text-sm mb-4">
                Since <MathExpr>t</MathExpr> affects <MathExpr>z</MathExpr> through <em>two</em> independent paths, we must calculate the chain rule for each path, and then <strong>add them together</strong>.
              </p>
              
              <div className="flex items-center justify-center text-xl md:text-2xl font-serif text-white bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-inner overflow-x-auto whitespace-nowrap">
                <div className="flex flex-col items-center"><span className="border-b border-white px-1 text-yellow-400">dz</span><span className="pt-1 text-yellow-400">dt</span></div>
                <span className="mx-3 text-slate-500">=</span>
                
                {/* Path 1 */}
                <div className={`flex items-center transition-opacity duration-300 ${activePath === 'y' ? 'opacity-30' : 'opacity-100'}`}>
                  <div className="flex flex-col items-center"><span className="border-b border-white px-1 text-purple-400">&part;z</span><span className="pt-1 text-blue-400">&part;x</span></div>
                  <span className="mx-1 text-slate-400 font-bold">&middot;</span>
                  <div className="flex flex-col items-center"><span className="border-b border-white px-1 text-blue-400">dx</span><span className="pt-1 text-yellow-400">dt</span></div>
                </div>

                <span className={`mx-3 font-bold transition-opacity duration-300 ${activePath === 'all' ? 'text-white' : 'text-slate-600'}`}>+</span>

                {/* Path 2 */}
                <div className={`flex items-center transition-opacity duration-300 ${activePath === 'x' ? 'opacity-30' : 'opacity-100'}`}>
                  <div className="flex flex-col items-center"><span className="border-b border-white px-1 text-purple-400">&part;z</span><span className="pt-1 text-emerald-400">&part;y</span></div>
                  <span className="mx-1 text-slate-400 font-bold">&middot;</span>
                  <div className="flex flex-col items-center"><span className="border-b border-white px-1 text-emerald-400">dy</span><span className="pt-1 text-yellow-400">dt</span></div>
                </div>
              </div>
            </HighlightBox>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideGeneralizing = () => (
  <SlideFrame title="Generalizing the Multivariable Chain Rule">
    <div className="space-y-8 text-slate-300 leading-relaxed text-lg">
      <p>
        In machine learning, we don't just have two paths. A final output (like Error/Loss <MathExpr>z</MathExpr>) might depend on thousands of intermediate variables (neuron activations <MathExpr>u&#8339;</MathExpr>), which in turn depend on input parameters (weights <MathExpr>x&#11386;</MathExpr>).
      </p>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center my-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <span className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-6">The General Form</span>
        
        <div className="flex items-center justify-center text-3xl md:text-5xl font-serif text-white gap-4 flex-wrap">
          <div className="flex flex-col items-center">
            <span className="border-b border-white px-2 pb-1 text-rose-400">&part;z</span>
            <span className="pt-1 text-blue-400">&part;x<sub className="text-sm">j</sub></span>
          </div>
          <span className="text-slate-500 mx-2">=</span>
          
          <div className="flex flex-col items-center text-purple-400 mx-2">
            <span className="text-sm">m</span>
            <span className="text-6xl md:text-7xl leading-none">&Sigma;</span>
            <span className="text-sm">i=1</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="border-b border-white px-2 pb-1 text-rose-400">&part;z</span>
            <span className="pt-1 text-emerald-400">&part;u<sub className="text-sm">i</sub></span>
          </div>
          <span className="text-slate-400 font-bold text-2xl mx-1">&middot;</span>
          <div className="flex flex-col items-center">
            <span className="border-b border-white px-2 pb-1 text-emerald-400">&part;u<sub className="text-sm">i</sub></span>
            <span className="pt-1 text-blue-400">&part;x<sub className="text-sm">j</sub></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-purple-500 shadow-md">
           <h4 className="text-white font-bold mb-2">Translation to Plain English:</h4>
           <p className="text-sm">
             The total rate of change of the final output <MathExpr>z</MathExpr> with respect to a specific early input <MathExpr>x&#11386;</MathExpr> is found by looking at <strong>every single intermediate path</strong> <MathExpr>u&#8339;</MathExpr> that connects them, multiplying the chain rule along that path, and summing them all up.
           </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-emerald-500 shadow-md">
           <h4 className="text-white font-bold mb-2">Why it matters:</h4>
           <p className="text-sm">
             A single weight deep in a neural network might influence dozens of neurons in the next layer, which influence hundreds in the next. This formula is the exact mathematical recipe for tracking all those overlapping influences to calculate the final gradient.
           </p>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideCompositeNetwork = () => {
  const [activeLayer, setActiveLayer] = useState(0); 

  return (
    <SlideFrame title="Neural Networks as Composite Functions">
      <div className="space-y-6 flex flex-col h-full">
        <p className="text-slate-300 text-lg leading-relaxed shrink-0">
          A neural network is ultimately just one giant composite function. Let's trace how an input vector <MathExpr>x</MathExpr> flows through a simple feedforward network to produce a prediction <MathExpr>ŷ</MathExpr>, and eventually a Loss <MathExpr>L</MathExpr>.
        </p>

        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col relative overflow-hidden">
          
          <div className="flex gap-2 justify-center mb-8 z-20">
            <button onMouseEnter={() => setActiveLayer(1)} onMouseLeave={() => setActiveLayer(0)} className="px-4 py-2 text-xs font-bold rounded bg-slate-800 text-blue-300 border border-blue-900/50 hover:bg-blue-900/30">Hover: Hidden Layer</button>
            <button onMouseEnter={() => setActiveLayer(2)} onMouseLeave={() => setActiveLayer(0)} className="px-4 py-2 text-xs font-bold rounded bg-slate-800 text-emerald-300 border border-emerald-900/50 hover:bg-emerald-900/30">Hover: Output Layer</button>
            <button onMouseEnter={() => setActiveLayer(3)} onMouseLeave={() => setActiveLayer(0)} className="px-4 py-2 text-xs font-bold rounded bg-slate-800 text-rose-300 border border-rose-900/50 hover:bg-rose-900/30">Hover: Full Substitution</button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
            <div className="w-full max-w-4xl relative h-[120px] md:h-[150px] mb-8">
              <div className="absolute inset-0 flex items-center justify-between px-4">
                
                {/* Input */}
                <div className="bg-slate-800 border-2 border-slate-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-white z-10 shadow-lg">x</div>
                <ArrowRight className="text-slate-600" />
                
                {/* Hidden Layer L1 */}
                <div className={`flex items-center bg-blue-950/30 border-2 ${activeLayer === 1 || activeLayer === 3 ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-blue-900/50'} rounded-xl p-2 md:p-4 z-10 transition-all duration-300`}>
                  <div className="flex flex-col gap-2">
                    <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider text-center">Hidden L1</div>
                    <div className="flex gap-2">
                      <div className="bg-slate-800 px-2 md:px-4 py-2 rounded text-xs md:text-sm font-mono text-slate-300 border border-slate-700">z<sup className="text-[10px]">[1]</sup> = W<sup className="text-[10px]">[1]</sup>x + b<sup className="text-[10px]">[1]</sup></div>
                      <div className="bg-slate-800 px-2 md:px-4 py-2 rounded text-xs md:text-sm font-mono text-slate-300 border border-slate-700">a<sup className="text-[10px]">[1]</sup> = g<sup className="text-[10px]">[1]</sup>(z<sup className="text-[10px]">[1]</sup>)</div>
                    </div>
                  </div>
                </div>

                <ArrowRight className="text-slate-600" />

                {/* Output Layer L2 */}
                <div className={`flex items-center bg-emerald-950/30 border-2 ${activeLayer === 2 || activeLayer === 3 ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-emerald-900/50'} rounded-xl p-2 md:p-4 z-10 transition-all duration-300`}>
                  <div className="flex flex-col gap-2">
                    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider text-center">Output L2</div>
                    <div className="flex gap-2">
                      <div className="bg-slate-800 px-2 md:px-4 py-2 rounded text-xs md:text-sm font-mono text-slate-300 border border-slate-700">z<sup className="text-[10px]">[2]</sup> = W<sup className="text-[10px]">[2]</sup>a<sup className="text-[10px]">[1]</sup> + b<sup className="text-[10px]">[2]</sup></div>
                      <div className="bg-slate-800 px-2 md:px-4 py-2 rounded text-xs md:text-sm font-mono text-slate-300 border border-slate-700">ŷ = g<sup className="text-[10px]">[2]</sup>(z<sup className="text-[10px]">[2]</sup>)</div>
                    </div>
                  </div>
                </div>

                <ArrowRight className="text-slate-600" />

                {/* Loss */}
                <div className={`bg-rose-950/30 border-2 ${activeLayer === 3 ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'border-rose-900/50'} rounded-xl w-16 h-12 flex items-center justify-center font-bold text-rose-300 z-10 transition-all duration-300`}>L(ŷ)</div>
              </div>
            </div>

            {/* Substitution Equations */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 w-full text-center relative h-[140px] flex items-center justify-center overflow-x-auto overflow-y-hidden">
               {activeLayer === 0 && <span className="text-slate-500 italic">Hover over buttons above to see equations</span>}
               
               {activeLayer === 1 && (
                 <div className="font-serif text-xl md:text-2xl text-white animate-in slide-in-from-bottom-2 whitespace-nowrap">
                   <span className="text-blue-400">a<sup className="text-sm">[1]</sup></span> = g<sup className="text-sm">[1]</sup>( <span className="text-blue-300">W<sup className="text-sm">[1]</sup>x + b<sup className="text-sm">[1]</sup></span> )
                 </div>
               )}

               {activeLayer === 2 && (
                 <div className="font-serif text-xl md:text-2xl text-white animate-in slide-in-from-bottom-2 whitespace-nowrap">
                   <span className="text-emerald-400">ŷ</span> = g<sup className="text-sm">[2]</sup>( <span className="text-emerald-300">W<sup className="text-sm">[2]</sup><span className="text-blue-400">a<sup className="text-sm">[1]</sup></span> + b<sup className="text-sm">[2]</sup></span> )
                 </div>
               )}

               {activeLayer === 3 && (
                 <div className="font-serif text-lg md:text-xl text-white animate-in slide-in-from-bottom-2 whitespace-nowrap flex flex-col items-center gap-2">
                   <span className="text-xs text-rose-400 font-sans uppercase tracking-widest font-bold">The Fully Expanded Network Function</span>
                   <div>
                     <span className="text-rose-400">L</span>( <span className="text-emerald-400">g<sup className="text-sm">[2]</sup>( <span className="text-emerald-300">W<sup className="text-sm">[2]</sup></span></span> <span className="text-blue-400">g<sup className="text-sm">[1]</sup>( <span className="text-blue-300">W<sup className="text-sm">[1]</sup>x + b<sup className="text-sm">[1]</sup></span> )</span> <span className="text-emerald-400"><span className="text-emerald-300">+ b<sup className="text-sm">[2]</sup></span> )</span> )
                   </div>
                   <span className="text-xs text-slate-500 font-sans mt-2">Think of it like nesting Russian dolls!</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideBackpropConnection = () => (
  <SlideFrame title="Backpropagation: Applying the Chain Rule">
    <div className="space-y-6 flex flex-col h-full">
      <p className="text-slate-300 text-lg leading-relaxed">
        Training a neural network involves minimizing a loss function <MathExpr>L</MathExpr>. To do this using gradient descent, we need the partial derivative of <MathExpr>L</MathExpr> with respect to <em>every single weight <MathExpr>W</MathExpr> and bias <MathExpr>b</MathExpr></em> in the network.
      </p>
      
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex-grow flex flex-col justify-center">
        <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-slate-700 pb-2">The Backward Pass Explained</h3>
        <p className="text-sm text-slate-300 mb-6">
          Backpropagation is not a new optimization algorithm; it's an efficient <strong>algorithm for computing gradients</strong>. It systematically applies the multivariable chain rule by working <em>backward</em> from the loss.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-slate-800/80 p-5 rounded-xl border-l-4 border-rose-500 shadow-md">
             <h4 className="font-bold text-rose-400 mb-2">1. Start at the End</h4>
             <p className="text-sm text-slate-400">Begin by calculating the derivative of the loss <MathExpr>L</MathExpr> with respect to the final output prediction of the network.</p>
           </div>
           <div className="bg-slate-800/80 p-5 rounded-xl border-l-4 border-indigo-500 shadow-md">
             <h4 className="font-bold text-indigo-400 mb-2">2. Pre-activation Gradient</h4>
             <p className="text-sm text-slate-400">Use the chain rule to step backward through the activation function to find the error gradient at the raw linear output <MathExpr>Z</MathExpr>.</p>
           </div>
           <div className="bg-slate-800/80 p-5 rounded-xl border-l-4 border-blue-500 shadow-md">
             <h4 className="font-bold text-blue-400 mb-2">3. Parameter Gradients</h4>
             <p className="text-sm text-slate-400">Using the error at <MathExpr>Z</MathExpr>, calculate exactly how much the specific weights <MathExpr>W</MathExpr> and biases <MathExpr>b</MathExpr> contributed to that error.</p>
           </div>
           <div className="bg-slate-800/80 p-5 rounded-xl border-l-4 border-emerald-500 shadow-md">
             <h4 className="font-bold text-emerald-400 mb-2">4. Propagate Backward</h4>
             <p className="text-sm text-slate-400">Calculate the gradient with respect to the <em>previous</em> layer's activations. Pass this backward so the previous layer can repeat steps 2, 3, and 4!</p>
           </div>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideBackpropMath = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <SlideFrame title="The 4 Equations of Backpropagation">
      <div className="flex flex-col h-full space-y-6">
        <p className="text-slate-300 text-lg">
          To update our weights, we need to know how they affect the final loss <MathExpr>L</MathExpr>. This involves stepping backward through layer <MathExpr>l</MathExpr>. The chain rule gives us four fundamental equations to compute these gradients systematically.
        </p>

        <div className="flex gap-2">
          {[1, 2, 3, 4].map(num => (
            <button 
              key={num}
              onClick={() => setActiveStep(num)}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all border ${activeStep === num ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
            >
              Equation {num}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-700 shadow-xl p-8 flex flex-col justify-center min-h-[350px]">
          
          {activeStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
              <h3 className="text-2xl font-bold text-indigo-400 border-b border-slate-700 pb-2">1. Pre-activation Gradient (<MathExpr>dZ</MathExpr>)</h3>
              <p className="text-slate-300">First, how does the loss change with respect to the pre-activation <MathExpr>z</MathExpr> before it goes through the activation function <MathExpr>g()</MathExpr>?</p>
              
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center font-serif text-2xl md:text-4xl text-white shadow-inner">
                <span className="text-indigo-400">dZ<sup className="text-sm">[l]</sup></span> = <span className="text-rose-400">dA<sup className="text-sm">[l]</sup></span> <span className="text-slate-500">*</span> <span className="text-emerald-400">g'(Z<sup className="text-sm">[l]</sup>)</span>
              </div>
              
              <div className="bg-indigo-950/30 p-4 rounded-xl border border-indigo-900/50 text-indigo-200 text-sm">
                <strong>Translation:</strong> The "error" arriving at this layer (<MathExpr>dA</MathExpr>) is multiplied element-wise by the derivative of the activation function evaluated at <MathExpr>Z</MathExpr>. This tells us how much the raw linear output <MathExpr>Z</MathExpr> contributed to the error.
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
              <h3 className="text-2xl font-bold text-blue-400 border-b border-slate-700 pb-2">2. Weight Gradient (<MathExpr>dW</MathExpr>)</h3>
              <p className="text-slate-300">Now that we know the error at <MathExpr>Z</MathExpr>, how do the weights <MathExpr>W</MathExpr> influence it? Recall <MathExpr>Z = WA + b</MathExpr>.</p>
              
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center font-serif text-2xl md:text-4xl text-white shadow-inner">
                <span className="text-blue-400">dW<sup className="text-sm">[l]</sup></span> = <span className="text-slate-400 text-xl align-middle">1/m</span> <span className="text-indigo-400">dZ<sup className="text-sm">[l]</sup></span> <span className="text-slate-500">&middot;</span> <span className="text-purple-400">(A<sup className="text-sm">[l-1]</sup>)<sup className="text-sm">T</sup></span>
              </div>
              
              <div className="bg-blue-950/30 p-4 rounded-xl border border-blue-900/50 text-blue-200 text-sm">
                <strong>Translation:</strong> The error <MathExpr>dZ</MathExpr> is multiplied by the <em>inputs</em> to this layer (<MathExpr>A</MathExpr> from the previous layer, transposed). If the input activation was high, that weight had a bigger impact on the error! We divide by <MathExpr>m</MathExpr> to average across the batch.
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
              <h3 className="text-2xl font-bold text-emerald-400 border-b border-slate-700 pb-2">3. Bias Gradient (<MathExpr>db</MathExpr>)</h3>
              <p className="text-slate-300">How do the biases <MathExpr>b</MathExpr> influence the error? Again, recall <MathExpr>Z = WA + b</MathExpr>. The derivative of <MathExpr>b</MathExpr> is just 1!</p>
              
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center font-serif text-2xl md:text-4xl text-white shadow-inner">
                <span className="text-emerald-400">db<sup className="text-sm">[l]</sup></span> = <span className="text-slate-400 text-xl align-middle">1/m</span> &Sigma; <span className="text-indigo-400">dZ<sup className="text-sm">[l]</sup></span>
              </div>
              
              <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-900/50 text-emerald-200 text-sm">
                <strong>Translation:</strong> Because the bias just adds a constant, its gradient is exactly equal to the error <MathExpr>dZ</MathExpr>. In vectorized code, we just sum up the errors across all examples in the batch and average them (divide by <MathExpr>m</MathExpr>).
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
              <h3 className="text-2xl font-bold text-rose-400 border-b border-slate-700 pb-2">4. Pass Error Backward (<MathExpr>dA</MathExpr>)</h3>
              <p className="text-slate-300">To continue backpropagation to the <em>previous</em> layer, we must calculate the error with respect to the previous layer's activations <MathExpr>A^{"[l-1]"}</MathExpr>.</p>
              
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center font-serif text-2xl md:text-4xl text-white shadow-inner">
                <span className="text-rose-400">dA<sup className="text-sm">[l-1]</sup></span> = <span className="text-blue-400">(W<sup className="text-sm">[l]</sup>)<sup className="text-sm">T</sup></span> <span className="text-slate-500">&middot;</span> <span className="text-indigo-400">dZ<sup className="text-sm">[l]</sup></span>
              </div>
              
              <div className="bg-rose-950/30 p-4 rounded-xl border border-rose-900/50 text-rose-200 text-sm">
                <strong>Translation:</strong> We push the error <MathExpr>dZ</MathExpr> backwards through the weights <MathExpr>W</MathExpr>. This calculates how much the previous layer's output is "to blame" for the current error, which then becomes the starting point (Equation 1) for the next layer back!
              </div>
            </div>
          )}
        </div>
      </div>
    </SlideFrame>
  );
};

// --- Extra: Clearing the "after loss" confusion (does not change prior slides) ---

const SlideDoubtYouAreClear = () => (
  <SlideFrame title="First: What You Already Know (Crystal Clear)">
    <div className="space-y-6 text-slate-300 leading-relaxed">
      <p className="text-lg">
        Before the confusing part — lock in your mental model. <strong className="text-emerald-400">You already understand the forward pass correctly.</strong>
      </p>

      <div className="bg-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold">
          <CheckCircle2 className="w-5 h-5" /> Your picture (forward)
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm md:text-base font-medium">
          {[
            { t: 'X = [x₁…xₙ]', c: 'bg-blue-950/50 border-blue-700 text-blue-200' },
            { t: 'z = Wx + b', c: 'bg-indigo-950/50 border-indigo-700 text-indigo-200' },
            { t: 'a = g(z)', c: 'bg-purple-950/50 border-purple-700 text-purple-200' },
            { t: '→ next layer', c: 'bg-slate-800 border-slate-600 text-slate-300' },
            { t: '… final ŷ', c: 'bg-amber-950/50 border-amber-700 text-amber-200' },
            { t: 'Loss L', c: 'bg-rose-950/50 border-rose-700 text-rose-200' },
          ].map((n, i) => (
            <React.Fragment key={n.t}>
              {i > 0 && <ArrowRight className="text-slate-600 w-4 h-4 shrink-0" />}
              <span className={`px-3 py-2 rounded-xl border ${n.c}`}>{n.t}</span>
            </React.Fragment>
          ))}
        </div>
        <p className="text-sm text-slate-400 mt-4 text-center">
          Each neuron&apos;s output becomes the next layer&apos;s input — until we get a prediction and a loss number.
        </p>
      </div>

      <div className="bg-amber-950/20 border border-amber-700/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3 text-amber-400 font-bold">
          <HelpCircle className="w-5 h-5" /> Where people get stuck (your questions)
        </div>
        <ol className="space-y-3 text-slate-300 list-decimal list-inside">
          <li><strong className="text-white">How do we &quot;go back&quot;?</strong> — What does walking backward even mean?</li>
          <li><strong className="text-white">What is calculated first?</strong> — Gradients? Weight updates? Which layer?</li>
          <li><strong className="text-white">When / how are W and b actually changed?</strong> — Is that the same moment as going back?</li>
        </ol>
        <p className="text-sm text-amber-200/80 mt-4">
          The next slide answers all three at once — network, gradient surface and math side by side.
        </p>
      </div>
    </div>
  </SlideFrame>
);

// --- Live scenario: network blips + gradient surface + math ---

// Loss surface over a 2-parameter slice: u = a weight in layer 1, v = a weight in layer 2.
const surfaceLoss = (u, v) => 0.5 * (u * u + v * v) + 0.25 * Math.sin(2.2 * u) * Math.cos(2.2 * v);

const surfaceGrad = (u, v) => {
  const h = 1e-3;
  return {
    gu: (surfaceLoss(u + h, v) - surfaceLoss(u - h, v)) / (2 * h),
    gv: (surfaceLoss(u, v + h) - surfaceLoss(u, v - h)) / (2 * h),
  };
};

const HEIGHT_STOPS = [
  [37, 99, 235], [6, 182, 212], [34, 197, 94], [234, 179, 8], [239, 68, 68],
];

const heightColor = (t) => {
  const s = Math.max(0, Math.min(0.9999, t)) * (HEIGHT_STOPS.length - 1);
  const i = Math.floor(s);
  const f = s - i;
  const a = HEIGHT_STOPS[i];
  const b = HEIGHT_STOPS[i + 1];
  const mix = (k) => Math.round(a[k] + (b[k] - a[k]) * f);
  return `rgb(${mix(0)},${mix(1)},${mix(2)})`;
};

const projectSurface = (u, v, z) => ({
  x: 210 + (u - v) * 58,
  y: 175 + (u + v) * 24 - z * 32,
});

const START_POINT = { u: -1.1, v: 0.85 };
const SCENARIO_ETA = 0.4;

const GradientSurface = ({ show }) => {
  const quads = SURFACE_QUADS;
  const { u, v } = START_POINT;
  const z = surfaceLoss(u, v);
  const { gu, gv } = surfaceGrad(u, v);
  const P = projectSurface(u, v, z);

  const d = 0.5;
  const uTip = projectSurface(u + d, v, z + gu * d);
  const vTip = projectSurface(u, v + d, z + gv * d);

  const mag = Math.hypot(gu, gv) || 1;
  const nu = gu / mag;
  const nv = gv / mag;
  const gLen = 0.62;
  const upTip = projectSurface(u + nu * gLen, v + nv * gLen, z + mag * gLen);
  const downTip = projectSurface(u - nu * gLen, v - nv * gLen, z - mag * gLen);

  const planeCorners = [[-d, -d], [d, -d], [d, d], [-d, d]]
    .map(([du, dv]) => projectSurface(u + du, v + dv, z + gu * du + gv * dv))
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

  const nu2 = u - SCENARIO_ETA * gu;
  const nv2 = v - SCENARIO_ETA * gv;
  const nz2 = surfaceLoss(nu2, nv2);
  const P2 = projectSurface(nu2, nv2, nz2);

  return (
    <svg viewBox="0 0 420 290" className="w-full">
      <defs>
        <marker id="scRose" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 7 3, 0 6" fill="#fb7185" />
        </marker>
        <marker id="scEmerald" markerWidth="8" markerHeight="7" refX="7" refY="3.5" orient="auto">
          <polygon points="0 0, 8 3.5, 0 7" fill="#34d399" />
        </marker>
        <marker id="scAmber" markerWidth="8" markerHeight="7" refX="7" refY="3.5" orient="auto">
          <polygon points="0 0, 8 3.5, 0 7" fill="#fbbf24" />
        </marker>
      </defs>

      {quads.map((q, i) => (
        <polygon key={i} points={q.pts} fill={q.color} fillOpacity="0.68" stroke="#0f172a" strokeWidth="0.4" />
      ))}

      {show.plane && (
        <polygon points={planeCorners} fill="#e0e7ff" fillOpacity="0.32" stroke="#a5b4fc" strokeWidth="1.5" />
      )}

      {show.slopeV && (
        <g>
          <line x1={P.x} y1={P.y} x2={vTip.x} y2={vTip.y} stroke="#fb7185" strokeWidth="2.5" markerEnd="url(#scRose)" />
          <text x={vTip.x - 6} y={vTip.y - 8} fill="#fda4af" fontSize="10" textAnchor="end" fontWeight="bold">∂L/∂W[2]</text>
        </g>
      )}

      {show.slopeU && (
        <g>
          <line x1={P.x} y1={P.y} x2={uTip.x} y2={uTip.y} stroke="#fb7185" strokeWidth="2.5" markerEnd="url(#scRose)" />
          <text x={uTip.x + 6} y={uTip.y - 8} fill="#fda4af" fontSize="10" fontWeight="bold">∂L/∂W[1]</text>
        </g>
      )}

      {show.gradient && (
        <g>
          <line x1={P.x} y1={P.y} x2={upTip.x} y2={upTip.y} stroke="#fbbf24" strokeWidth="3" markerEnd="url(#scAmber)" />
          <text x={upTip.x} y={upTip.y - 10} fill="#fcd34d" fontSize="11" textAnchor="middle" fontWeight="bold">∇L (uphill)</text>
        </g>
      )}

      {show.descent && (
        <g>
          <line x1={P.x} y1={P.y} x2={downTip.x} y2={downTip.y} stroke="#34d399" strokeWidth="3" markerEnd="url(#scEmerald)" />
          <text x={downTip.x} y={downTip.y + 18} fill="#6ee7b7" fontSize="11" textAnchor="middle" fontWeight="bold">−η∇L (we step here)</text>
        </g>
      )}

      {show.moved && (
        <g>
          <line x1={P.x} y1={P.y} x2={P2.x} y2={P2.y} stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />
          <circle cx={P2.x} cy={P2.y} r="7" fill="#34d399" stroke="#022c22" strokeWidth="2" />
          <text x={P2.x} y={P2.y + 22} fill="#6ee7b7" fontSize="10" textAnchor="middle" fontWeight="bold">
            new L = {surfaceLoss(nu2, nv2).toFixed(3)}
          </text>
        </g>
      )}

      <circle cx={P.x} cy={P.y} r="8" fill="#f43f5e" stroke="#4c0519" strokeWidth="2" className={show.pulse ? 'animate-pulse' : ''} />
      <text x={P.x} y={P.y - 15} fill="#fecdd3" fontSize="10" textAnchor="middle" fontWeight="bold">
        L = {z.toFixed(3)}
      </text>

      <text x="20" y="278" fill="#64748b" fontSize="9">axis ↙ W[1]</text>
      <text x="400" y="278" fill="#64748b" fontSize="9" textAnchor="end">axis ↘ W[2]</text>
      <text x="210" y="18" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
        Loss surface (height = L)
      </text>
    </svg>
  );
};

const SCENARIO_NET = [
  { x: 45, nodes: [85, 145, 205], label: 'X' },
  { x: 150, nodes: [60, 115, 170, 225], label: 'A[1]' },
  { x: 250, nodes: [115, 170], label: 'A[2] = ŷ' },
];

const ScenarioNetwork = ({ activeLayer, litNodes, direction, accent = 'rose' }) => {
  const hotEdge = accent === 'blue' ? '#60a5fa' : '#fb7185';
  const litFill = accent === 'blue' ? '#1e3a8a' : '#7f1d1d';
  const litStroke = accent === 'blue' ? '#60a5fa' : '#fb7185';
  const edges = [];
  for (let l = 0; l < SCENARIO_NET.length - 1; l += 1) {
    SCENARIO_NET[l].nodes.forEach((y1) => {
      SCENARIO_NET[l + 1].nodes.forEach((y2) => {
        edges.push({ wl: l + 1, x1: SCENARIO_NET[l].x, y1, x2: SCENARIO_NET[l + 1].x, y2 });
      });
    });
  }

  return (
    <svg viewBox="0 0 340 290" className="w-full">
      <defs>
        <marker id="scnBack" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
          <polygon points="0 0, 6 2.5, 0 5" fill="#fb7185" />
        </marker>
      </defs>

      {edges.map((e, i) => {
        const hot = e.wl === activeLayer;
        return (
          <line
            key={i}
            x1={hot && direction === 'back' ? e.x2 : e.x1}
            y1={hot && direction === 'back' ? e.y2 : e.y1}
            x2={hot && direction === 'back' ? e.x1 : e.x2}
            y2={hot && direction === 'back' ? e.y1 : e.y2}
            stroke={hot ? hotEdge : '#1e293b'}
            strokeWidth={hot ? 1.6 : 0.7}
            markerEnd={hot && direction === 'back' ? 'url(#scnBack)' : undefined}
            className={hot ? 'animate-pulse' : ''}
          />
        );
      })}

      {SCENARIO_NET.map((layer, li) => (
        <g key={layer.label}>
          {layer.nodes.map((y) => {
            const lit = litNodes.includes(li);
            return (
              <circle
                key={y}
                cx={layer.x}
                cy={y}
                r="13"
                fill={lit ? litFill : '#1e293b'}
                stroke={lit ? litStroke : '#475569'}
                strokeWidth={lit ? 2.5 : 1.5}
                className={lit ? 'animate-pulse' : ''}
              />
            );
          })}
          <text x={layer.x} y={262} textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">{layer.label}</text>
        </g>
      ))}

      <rect x={295} y={128} width="34" height="34" rx="8"
        fill={litNodes.includes(3) ? litFill : '#1e293b'}
        stroke={litNodes.includes(3) ? litStroke : '#475569'}
        strokeWidth={litNodes.includes(3) ? 2.5 : 1.5}
        className={litNodes.includes(3) ? 'animate-pulse' : ''} />
      <text x={312} y={150} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">L</text>
      <line x1={263} y1={145} x2={293} y2={145} stroke="#334155" strokeWidth="1" />

      <text x={97} y={30} textAnchor="middle" fill="#64748b" fontSize="9">W[1], b[1]</text>
      <text x={200} y={30} textAnchor="middle" fill="#64748b" fontSize="9">W[2], b[2]</text>
    </svg>
  );
};

// --- Forward-pass companion: where does the surface come from? ---

const FLOOR_Z = -0.55;

const PROBE_POINTS = [
  { u: 0.55, v: -0.9 }, { u: -0.4, v: -1.2 }, { u: 1.15, v: 0.35 },
  { u: -1.3, v: -0.35 }, { u: 0.2, v: 1.25 }, { u: 1.35, v: -1.35 },
  { u: -0.85, v: 1.35 }, { u: 0.85, v: 1.0 }, { u: -1.4, v: -1.4 },
  { u: 0.0, v: -0.35 }, { u: 1.4, v: 1.4 }, { u: -0.15, v: 0.6 },
];

const SURFACE_QUADS = (() => {
  const N = 14;
  const lo = -1.5;
  const span = 3.0;
  const cells = [];
  for (let i = 0; i < N; i += 1) {
    for (let j = 0; j < N; j += 1) {
      const u0 = lo + (span * i) / N;
      const u1 = lo + (span * (i + 1)) / N;
      const v0 = lo + (span * j) / N;
      const v1 = lo + (span * (j + 1)) / N;
      const corners = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
      const zs = corners.map(([u, v]) => surfaceLoss(u, v));
      const pts = corners
        .map(([u, v], k) => projectSurface(u, v, zs[k]))
        .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
        .join(' ');
      const avgZ = zs.reduce((s, z) => s + z, 0) / 4;
      cells.push({ pts, depth: u0 + v0, color: heightColor(avgZ / 2.4) });
    }
  }
  return cells.sort((a, b) => a.depth - b.depth);
})();

const ForwardSurface = ({ reveal = 0, dot = 'floor', stem = false, probes = 0 }) => {
  const floorLines = useMemo(() => {
    const lines = [];
    const N = 7;
    for (let i = 0; i <= N; i += 1) {
      const t = -1.5 + (3 * i) / N;
      lines.push([projectSurface(t, -1.5, FLOOR_Z), projectSurface(t, 1.5, FLOOR_Z)]);
      lines.push([projectSurface(-1.5, t, FLOOR_Z), projectSurface(1.5, t, FLOOR_Z)]);
    }
    return lines;
  }, []);

  const shown = SURFACE_QUADS.slice(0, Math.round(SURFACE_QUADS.length * reveal));
  const { u, v } = START_POINT;
  const zL = surfaceLoss(u, v);
  const base = projectSurface(u, v, FLOOR_Z);
  const top = projectSurface(u, v, zL);
  const dotPos = dot === 'loss' ? top : base;

  return (
    <svg viewBox="0 0 420 290" className="w-full">
      {floorLines.map(([a, b], i) => (
        <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#1e293b" strokeWidth="1" />
      ))}

      {shown.map((q, i) => (
        <polygon key={i} points={q.pts} fill={q.color} fillOpacity="0.6" stroke="#0f172a" strokeWidth="0.4" />
      ))}

      {PROBE_POINTS.slice(0, probes).map((p) => {
        const pb = projectSurface(p.u, p.v, FLOOR_Z);
        const pt = projectSurface(p.u, p.v, surfaceLoss(p.u, p.v));
        return (
          <g key={`${p.u}-${p.v}`}>
            <line x1={pb.x} y1={pb.y} x2={pt.x} y2={pt.y} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
            <circle cx={pt.x} cy={pt.y} r="4" fill="#e2e8f0" stroke="#334155" strokeWidth="1" />
          </g>
        );
      })}

      {stem && (
        <g>
          <line x1={base.x} y1={base.y} x2={top.x} y2={top.y} stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="5 3" />
          <circle cx={base.x} cy={base.y} r="4" fill="#475569" />
          <text x={base.x + 8} y={(base.y + top.y) / 2} fill="#fcd34d" fontSize="10" fontWeight="bold">height = L</text>
        </g>
      )}

      <circle cx={dotPos.x} cy={dotPos.y} r="8" fill="#f43f5e" stroke="#4c0519" strokeWidth="2" className="animate-pulse" />
      <text x={dotPos.x} y={dotPos.y - 15} fill="#fecdd3" fontSize="10" textAnchor="middle" fontWeight="bold">
        {dot === 'loss' ? `L = ${zL.toFixed(3)}` : `W[1]=${START_POINT.u}, W[2]=${START_POINT.v}`}
      </text>

      <text x="20" y="278" fill="#64748b" fontSize="9">axis ↙ W[1]</text>
      <text x="400" y="278" fill="#64748b" fontSize="9" textAnchor="end">axis ↘ W[2]</text>
      <text x="210" y="18" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
        {reveal >= 1 ? 'Loss surface = L at EVERY possible weight setting' : 'Weight space (the floor of all possible W)'}
      </text>
    </svg>
  );
};

const FORWARD_STEPS = [
  {
    tag: 'The floor',
    title: 'Every possible weight setting is just an address on a flat map',
    activeLayer: null, litNodes: [],
    surf: { reveal: 0, dot: 'floor', stem: false, probes: 0 },
    eqs: ['floor coordinates = ( W[1], W[2] )'],
    note: 'Forget height for a moment. Each combination of weight values is one address on this grid. Your randomly initialised network sits at one address (red dot). No height yet — because we have not computed a loss.',
  },
  {
    tag: 'Layer 1 mix',
    title: 'Feed X in: the first linear mix',
    activeLayer: 1, litNodes: [0, 1],
    surf: { reveal: 0, dot: 'floor', stem: false, probes: 0 },
    eqs: ['Z[1] = W[1]·X + b[1]'],
    note: 'The forward pass begins. We use the weights at our current address — these exact numbers are what will decide the height we end up at.',
  },
  {
    tag: 'Activate',
    title: 'Squash it through the activation gate',
    activeLayer: null, litNodes: [1],
    surf: { reveal: 0, dot: 'floor', stem: false, probes: 0 },
    eqs: ['A[1] = g( Z[1] )'],
    note: 'The non-linearity is what makes the final surface bumpy instead of a simple bowl. Without activations the loss surface would be a plain convex valley.',
  },
  {
    tag: 'Layer 2 mix',
    title: 'Hidden output becomes the next layer’s input',
    activeLayer: 2, litNodes: [1, 2],
    surf: { reveal: 0, dot: 'floor', stem: false, probes: 0 },
    eqs: ['Z[2] = W[2]·A[1] + b[2]'],
    note: 'Exactly the pattern you already knew: each layer’s activation is the next layer’s input.',
  },
  {
    tag: 'Prediction',
    title: 'Final activation gives the prediction ŷ',
    activeLayer: null, litNodes: [2],
    surf: { reveal: 0, dot: 'floor', stem: false, probes: 0 },
    eqs: ['A[2] = ŷ = g( Z[2] )'],
    note: 'We now have a guess. Still no height — a prediction alone is not a loss. We need to compare it with the truth.',
  },
  {
    tag: 'Land at L',
    title: 'Compare with the truth → this is your height',
    activeLayer: null, litNodes: [2, 3],
    surf: { reveal: 0, dot: 'loss', stem: true, probes: 0 },
    eqs: ['L = (1/m) · Σ loss( ŷ, Y )'],
    note: 'THIS is “landing at L”. The forward pass turned one address (W[1], W[2]) into one number. The red dot lifts off the floor to that height. One forward pass = one height measurement, nothing more.',
  },
  {
    tag: 'One probe',
    title: 'Want the height somewhere else? Run another full forward pass',
    activeLayer: null, litNodes: [],
    surf: { reveal: 0, dot: 'loss', stem: true, probes: 4 },
    eqs: ['L( W ) = forward_pass( W, data )'],
    note: 'Each white dot is a different weight setting whose height we measured with its own complete forward pass over the data. The heights were always determined — we just had not looked yet.',
  },
  {
    tag: 'Many probes',
    title: 'Probe more addresses and a shape starts to appear',
    activeLayer: null, litNodes: [],
    surf: { reveal: 0.45, dot: 'loss', stem: true, probes: 12 },
    eqs: ['L is a FUNCTION of the weights: L = L( W, b )'],
    note: 'Nothing is being invented here. We are only sampling a function that already had a value at every address, fixed the instant you chose your data and architecture.',
  },
  {
    tag: 'The surface',
    title: 'All possible addresses at once = the loss surface',
    activeLayer: null, litNodes: [],
    surf: { reveal: 1, dot: 'loss', stem: true, probes: 0 },
    eqs: ['surface = { ( W, L(W) )  for every possible W }'],
    note: 'So the earlier statement means: this shape is the graph of L(W). Change your data or architecture and you get a different surface. Change only W and b, and you simply move the dot on the SAME surface.',
  },
  {
    tag: 'Why backprop',
    title: 'You cannot probe millions of addresses — so ask for the slope',
    activeLayer: null, litNodes: [0, 1, 2, 3],
    surf: { reveal: 1, dot: 'loss', stem: true, probes: 6 },
    eqs: ['forward → L at ONE point', 'backward → slope ∇L at that SAME point'],
    note: 'Probing your way downhill would need a fresh forward pass per weight, per direction — hopeless for millions of parameters. Backpropagation gets the slope in every direction at your current dot from a single backward sweep. That is the next slide.',
  },
];

const SlideForwardSurfaceScenario = () => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= FORWARD_STEPS.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 2600);
    return () => clearInterval(id);
  }, [playing]);

  const cur = FORWARD_STEPS[step];

  return (
    <SlideFrame title="Forward Pass: Where the Loss Surface Comes From">
      <div className="flex flex-col h-full space-y-4">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <p className="text-slate-300 text-sm md:text-base max-w-2xl">
            The surface is not built by training — it is the <strong className="text-amber-300">graph of L as a function of the weights</strong>.
            A forward pass just <strong className="text-blue-300">measures the height at one address</strong>.
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => { setPlaying(false); setStep(0); }}
              className="p-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-500 flex items-center gap-2"
            >
              <Play className="w-4 h-4" /> {playing ? 'Pause' : 'Auto-play'}
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(s + 1, FORWARD_STEPS.length - 1))}
              disabled={step === FORWARD_STEPS.length - 1}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-500 disabled:opacity-30 flex items-center gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FORWARD_STEPS.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => { setPlaying(false); setStep(i); }}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                step === i
                  ? 'bg-indigo-600 border-indigo-400 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'
              }`}
            >
              {i + 1}. {s.tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1 px-2">
              Network · data flowing forward
            </div>
            <ScenarioNetwork activeLayer={cur.activeLayer} litNodes={cur.litNodes} direction="fwd" accent="blue" />
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1 px-2">
              Weight space · the surface being revealed
            </div>
            <ForwardSurface {...cur.surf} />
          </div>
        </div>

        <div className="bg-slate-900 border border-indigo-800/50 rounded-2xl p-5 space-y-3">
          <h3 className="text-lg font-bold text-white">
            <span className="text-indigo-400">Step {step + 1}/{FORWARD_STEPS.length} · </span>
            {cur.title}
          </h3>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            {cur.eqs.map((eq) => (
              <div key={eq} className="font-serif text-lg md:text-2xl text-white text-center tracking-wide">
                {eq}
              </div>
            ))}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed flex gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{cur.note}</span>
          </p>
        </div>
      </div>
    </SlideFrame>
  );
};

const SCENARIO_STEPS = [
  {
    tag: 'Setup',
    title: 'Forward pass finished — you are standing at one point',
    activeLayer: null, litNodes: [0, 1, 2, 3], direction: 'fwd',
    show: { pulse: true },
    eqs: ['Z[l] = W[l]·A[l−1] + b[l]', 'A[l] = g(Z[l])', 'L = loss(A[2], Y)'],
    note: 'As the previous slide showed, this surface is the graph of L(W) — every address already has a height, decided by your data and architecture. The forward pass measured just one of them, so you are standing on one red dot. Backprop now measures the SLOPE at that dot.',
  },
  {
    tag: 'Eq 0',
    title: 'Start at the loss: error at the output activations',
    activeLayer: null, litNodes: [2, 3], direction: 'back',
    show: { pulse: true },
    eqs: ['dA[2] = ∂L/∂A[2] = A[2] − Y'],
    note: 'The output neurons blip: we ask how much the loss changes if the final prediction wiggles. This is the seed of the whole backward pass.',
  },
  {
    tag: 'Eq 1',
    title: 'Layer 2: step backward through the activation gate',
    activeLayer: 2, litNodes: [2], direction: 'back',
    show: { pulse: true },
    eqs: ['dZ[2] = dA[2] ⊙ g′(Z[2])'],
    note: 'Multiply by the activation slope. If the gate was flat (slope ≈ 0), almost no blame gets through — that is the vanishing-gradient problem in one line.',
  },
  {
    tag: 'Eq 2 & 3',
    title: 'Layer 2: measure the slope for W[2] and b[2]',
    activeLayer: 2, litNodes: [1, 2], direction: 'back',
    show: { slopeV: true },
    eqs: ['dW[2] = (1/m) · dZ[2] · A[1]ᵀ', 'db[2] = (1/m) · Σ dZ[2]'],
    note: 'This is the moment a real slope number appears. On the right, one axis of the tangent direction is now known: how L rises if W[2] increases.',
  },
  {
    tag: 'Eq 4',
    title: 'Hand the blame back to layer 1',
    activeLayer: 2, litNodes: [1], direction: 'back',
    show: { slopeV: true },
    eqs: ['dA[1] = (W[2])ᵀ · dZ[2]'],
    note: 'Push the error backward through the weights. Notice the arrows on the network reverse — this dA[1] is exactly the input layer 1 needs to run its own Eq 1.',
  },
  {
    tag: 'Eq 1',
    title: 'Layer 1: through its activation gate',
    activeLayer: 1, litNodes: [1], direction: 'back',
    show: { slopeV: true },
    eqs: ['dZ[1] = dA[1] ⊙ g′(Z[1])'],
    note: 'Same equation as before, one layer deeper. This repetition is all backpropagation is.',
  },
  {
    tag: 'Eq 2 & 3',
    title: 'Layer 1: measure the slope for W[1] and b[1]',
    activeLayer: 1, litNodes: [0, 1], direction: 'back',
    show: { slopeV: true, slopeU: true },
    eqs: ['dW[1] = (1/m) · dZ[1] · Xᵀ', 'db[1] = (1/m) · Σ dZ[1]'],
    note: 'The second slope direction appears. Now both axes of our 2D slice have a measured slope — the local tangent is fully determined.',
  },
  {
    tag: 'Assemble',
    title: 'All gradients collected → the tangent plane',
    activeLayer: null, litNodes: [0, 1, 2], direction: 'back',
    show: { slopeV: true, slopeU: true, plane: true, gradient: true },
    eqs: ['∇L = [ dW[1], db[1], dW[2], db[2] ]'],
    note: 'THIS is the thing backprop actually constructs: the tangent plane (the local linear approximation) at your point. Its steepest-uphill direction is ∇L. Real networks have millions of axes; we are drawing a 2D slice.',
  },
  {
    tag: 'Update',
    title: 'Gradient descent: step opposite the gradient',
    activeLayer: null, litNodes: [], direction: 'fwd',
    show: { plane: true, gradient: true, descent: true, moved: true },
    eqs: ['W[l] ← W[l] − η · dW[l]', 'b[l] ← b[l] − η · db[l]'],
    note: 'Only now do the weights change. The dot slides downhill to a lower L, and the whole loop repeats: forward → backward → update. Each loop measures a new tangent plane at a new point.',
  },
];

const SlideBackpropLiveScenario = () => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= SCENARIO_STEPS.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 2600);
    return () => clearInterval(id);
  }, [playing]);

  const cur = SCENARIO_STEPS[step];
  const collected = [
    { key: 'dW[2]', ready: step >= 3 },
    { key: 'db[2]', ready: step >= 3 },
    { key: 'dW[1]', ready: step >= 6 },
    { key: 'db[1]', ready: step >= 6 },
  ];

  return (
    <SlideFrame title="Backprop in Action: Network → Gradient Surface → Math">
      <div className="flex flex-col h-full space-y-4">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <p className="text-slate-300 text-sm md:text-base max-w-2xl">
            Watch all three views at once: which <strong className="text-rose-300">neurons are blipping</strong>,
            how the <strong className="text-amber-300">gradient (tangent plane)</strong> gets built, and the
            <strong className="text-emerald-300"> exact math</strong> running at that instant.
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => { setPlaying(false); setStep(0); }}
              className="p-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-500 flex items-center gap-2"
            >
              <Play className="w-4 h-4" /> {playing ? 'Pause' : 'Auto-play'}
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(s + 1, SCENARIO_STEPS.length - 1))}
              disabled={step === SCENARIO_STEPS.length - 1}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-500 disabled:opacity-30 flex items-center gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SCENARIO_STEPS.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => { setPlaying(false); setStep(i); }}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                step === i
                  ? 'bg-indigo-600 border-indigo-400 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'
              }`}
            >
              {i + 1}. {s.tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1 px-2">
              Network · blipping where backprop is working
            </div>
            <ScenarioNetwork activeLayer={cur.activeLayer} litNodes={cur.litNodes} direction={cur.direction} />
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1 px-2">
              Gradient surface · tangent plane being measured
            </div>
            <GradientSurface show={cur.show} />
          </div>
        </div>

        <div className="bg-slate-900 border border-indigo-800/50 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-lg font-bold text-white">
              <span className="text-indigo-400">Step {step + 1}/{SCENARIO_STEPS.length} · </span>
              {cur.title}
            </h3>
            <div className="flex gap-1.5">
              {collected.map((c) => (
                <span
                  key={c.key}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono border ${
                    c.ready
                      ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                      : 'bg-slate-950 border-slate-700 text-slate-600'
                  }`}
                >
                  {c.key}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            {cur.eqs.map((eq) => (
              <div key={eq} className="font-serif text-lg md:text-2xl text-white text-center tracking-wide">
                {eq}
              </div>
            ))}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed flex gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{cur.note}</span>
          </p>
        </div>
      </div>
    </SlideFrame>
  );
};

// --- Per-neuron backprop: the 4 equations, de-mystified with real numbers ---

const MICRO = (() => {
  const sig = (z) => 1 / (1 + Math.exp(-z));
  const x = [1.0, 0.5];
  const y = 1.0;
  const W1 = [[0.4, -0.2], [0.3, 0.8]];
  const b1 = [0.1, -0.1];
  const W2 = [0.7, -0.5];
  const b2 = 0.2;

  const z1 = [
    W1[0][0] * x[0] + W1[0][1] * x[1] + b1[0],
    W1[1][0] * x[0] + W1[1][1] * x[1] + b1[1],
  ];
  const a1 = z1.map(sig);
  const z2 = W2[0] * a1[0] + W2[1] * a1[1] + b2;
  const a2 = sig(z2);
  const L = 0.5 * (a2 - y) ** 2;

  const dA2 = a2 - y;
  const sp2 = a2 * (1 - a2);
  const dZ2 = dA2 * sp2;
  const dW2 = [dZ2 * a1[0], dZ2 * a1[1]];
  const db2 = dZ2;
  const dA1 = [dZ2 * W2[0], dZ2 * W2[1]];
  const sp1 = a1.map((a) => a * (1 - a));
  const dZ1 = [dA1[0] * sp1[0], dA1[1] * sp1[1]];
  const dW1 = [
    [dZ1[0] * x[0], dZ1[0] * x[1]],
    [dZ1[1] * x[0], dZ1[1] * x[1]],
  ];
  const db1 = [dZ1[0], dZ1[1]];

  const eps = 0.001;
  const Lnudged = 0.5 * (a2 + eps - y) ** 2;

  return {
    x, y, W1, b1, W2, b2, z1, a1, z2, a2, L,
    dA2, sp2, dZ2, dW2, db2, dA1, sp1, dZ1, dW1, db1,
    eps, Lnudged, measuredRatio: (Lnudged - L) / eps,
  };
})();

const f4 = (n) => n.toFixed(4);
const f3 = (n) => n.toFixed(3);

const MICRO_NODES = {
  x1: { x: 45, y: 95, label: 'x₁', val: MICRO.x[0] },
  x2: { x: 45, y: 205, label: 'x₂', val: MICRO.x[1] },
  h1: { x: 168, y: 95, label: 'a¹₁', val: MICRO.a1[0] },
  h2: { x: 168, y: 205, label: 'a¹₂', val: MICRO.a1[1] },
  out: { x: 285, y: 150, label: 'ŷ', val: MICRO.a2 },
};

const MICRO_EDGES = [
  { id: 'w1_11', from: 'x1', to: 'h1', w: MICRO.W1[0][0], g: MICRO.dW1[0][0], lbl: 'W¹₁₁' },
  { id: 'w1_12', from: 'x2', to: 'h1', w: MICRO.W1[0][1], g: MICRO.dW1[0][1], lbl: 'W¹₁₂' },
  { id: 'w1_21', from: 'x1', to: 'h2', w: MICRO.W1[1][0], g: MICRO.dW1[1][0], lbl: 'W¹₂₁' },
  { id: 'w1_22', from: 'x2', to: 'h2', w: MICRO.W1[1][1], g: MICRO.dW1[1][1], lbl: 'W¹₂₂' },
  { id: 'w2_1', from: 'h1', to: 'out', w: MICRO.W2[0], g: MICRO.dW2[0], lbl: 'W²₁' },
  { id: 'w2_2', from: 'h2', to: 'out', w: MICRO.W2[1], g: MICRO.dW2[1], lbl: 'W²₂' },
];

const MicroNet = ({ hotNodes = [], hotEdges = [], gradEdges = [], showLoss = false }) => (
  <svg viewBox="0 0 380 290" className="w-full">
    <defs>
      <marker id="mnBackArr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
        <polygon points="0 0, 6 2.5, 0 5" fill="#fb7185" />
      </marker>
    </defs>

    {MICRO_EDGES.map((e) => {
      const a = MICRO_NODES[e.from];
      const b = MICRO_NODES[e.to];
      const hot = hotEdges.includes(e.id);
      const known = gradEdges.includes(e.id);
      const mx = a.x + (b.x - a.x) * 0.52;
      const my = a.y + (b.y - a.y) * 0.52;
      return (
        <g key={e.id}>
          <line
            x1={hot ? b.x : a.x}
            y1={hot ? b.y : a.y}
            x2={hot ? a.x : b.x}
            y2={hot ? a.y : b.y}
            stroke={hot ? '#fb7185' : known ? '#4c1d24' : '#1e293b'}
            strokeWidth={hot ? 2.2 : 1.2}
            markerEnd={hot ? 'url(#mnBackArr)' : undefined}
            className={hot ? 'animate-pulse' : ''}
          />
          <text x={mx} y={my - 4} fill="#64748b" fontSize="8" textAnchor="middle">{e.lbl}={e.w}</text>
          {known && (
            <text x={mx} y={my + 7} fill="#fb7185" fontSize="8" textAnchor="middle" fontWeight="bold">
              grad {f4(e.g)}
            </text>
          )}
        </g>
      );
    })}

    {Object.entries(MICRO_NODES).map(([id, n]) => {
      const hot = hotNodes.includes(id);
      return (
        <g key={id}>
          <circle
            cx={n.x} cy={n.y} r="24"
            fill={hot ? '#7f1d1d' : '#1e293b'}
            stroke={hot ? '#fb7185' : '#475569'}
            strokeWidth={hot ? 3 : 1.5}
            className={hot ? 'animate-pulse' : ''}
          />
          <text x={n.x} y={n.y - 3} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">{n.label}</text>
          <text x={n.x} y={n.y + 10} textAnchor="middle" fill="#93c5fd" fontSize="9">{f3(n.val)}</text>
        </g>
      );
    })}

    <line x1={309} y1={150} x2={329} y2={150} stroke="#334155" strokeWidth="1.2" />
    <rect
      x={330} y={130} width="42" height="40" rx="8"
      fill={showLoss ? '#7f1d1d' : '#1e293b'}
      stroke={showLoss ? '#fb7185' : '#475569'}
      strokeWidth={showLoss ? 3 : 1.5}
      className={showLoss ? 'animate-pulse' : ''}
    />
    <text x={351} y={147} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">L</text>
    <text x={351} y={160} textAnchor="middle" fill="#fca5a5" fontSize="8">{f3(MICRO.L)}</text>

    <text x={45} y={252} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">input</text>
    <text x={168} y={252} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">hidden (σ)</text>
    <text x={285} y={252} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">output (σ)</text>
    <text x={190} y={278} textAnchor="middle" fill="#64748b" fontSize="9">
      y_true = {MICRO.y} · every number below is real, not a symbol
    </text>
  </svg>
);

const GRAD_SLOTS = [
  { key: '∂L/∂W¹₁₁', val: MICRO.dW1[0][0], ready: 4, group: 'L1' },
  { key: '∂L/∂W¹₁₂', val: MICRO.dW1[0][1], ready: 4, group: 'L1' },
  { key: '∂L/∂b¹₁', val: MICRO.db1[0], ready: 4, group: 'L1' },
  { key: '∂L/∂W¹₂₁', val: MICRO.dW1[1][0], ready: 5, group: 'L1' },
  { key: '∂L/∂W¹₂₂', val: MICRO.dW1[1][1], ready: 5, group: 'L1' },
  { key: '∂L/∂b¹₂', val: MICRO.db1[1], ready: 5, group: 'L1' },
  { key: '∂L/∂W²₁', val: MICRO.dW2[0], ready: 2, group: 'L2' },
  { key: '∂L/∂W²₂', val: MICRO.dW2[1], ready: 2, group: 'L2' },
  { key: '∂L/∂b²', val: MICRO.db2, ready: 2, group: 'L2' },
];

const GRAD_MAX = Math.max(...GRAD_SLOTS.map((s) => Math.abs(s.val)));

const GradientVectorPanel = ({ step }) => (
  <div className="space-y-2">
    <p className="text-[11px] text-slate-400 px-1">
      One slot per tunable number. Backprop fills it <strong className="text-white">bottom-up</strong> — last layer first.
    </p>
    <div className="flex gap-2 items-stretch">
      <div className="w-2 rounded-full bg-gradient-to-b from-rose-500 via-amber-500 to-emerald-500 opacity-60" />
      <div className="flex-1 space-y-1">
        {GRAD_SLOTS.map((s) => {
          const known = step >= s.ready;
          const pct = (Math.abs(s.val) / GRAD_MAX) * 100;
          const neg = s.val < 0;
          return (
            <div
              key={s.key}
              className={`flex items-center gap-2 rounded-lg border px-2 py-1 transition-all ${
                known ? 'bg-slate-950 border-emerald-700/60' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <span className={`font-mono text-[10px] w-[74px] shrink-0 ${known ? 'text-emerald-300' : 'text-slate-600'}`}>
                {s.key}
              </span>
              <span className={`font-mono text-[10px] w-[62px] shrink-0 text-right ${known ? 'text-white' : 'text-slate-700'}`}>
                {known ? f4(s.val) : '— · —'}
              </span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                {known && (
                  <div
                    className={`h-full rounded-full ${neg ? 'bg-sky-400' : 'bg-rose-400'}`}
                    style={{ width: `${Math.max(4, pct)}%` }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    <p className="text-[10px] text-slate-500 px-1">
      Bar length = magnitude · <span className="text-sky-400">blue</span> = negative (increase this weight),
      <span className="text-rose-400"> red</span> = positive (decrease it).
      {step >= 6 && <strong className="text-amber-300"> Vector complete → this is ∇L.</strong>}
    </p>
  </div>
);

const NEURON_STEPS = [
  {
    tag: '“wiggle”',
    title: 'What “how much the loss changes if the prediction wiggles” literally means',
    hotNodes: ['out'], hotEdges: [], showLoss: true,
    eqs: ['∂L/∂ŷ = ŷ − y'],
    intuition: 'The question is: if ŷ moved by a hair, how far would L follow? The code answers it with the FORMULA ŷ − y — one subtraction, no bumping, no loop. Calculus did the hard part once, on paper. The bump rows below are only a sanity check that this number is physically real: notice the bumped value and the formula disagree by exactly ε/2, because a bump is an approximation while the formula is exact. (Next slide explores this properly.)',
    table: [
      ['ŷ now', f4(MICRO.a2)],
      ['L now', f4(MICRO.L)],
      [`ŷ + ε (ε = ${MICRO.eps}) — check only`, f4(MICRO.a2 + MICRO.eps)],
      ['L after bump — check only', f4(MICRO.Lnudged)],
      ['ΔL ÷ Δŷ — bumped, approximate', f4(MICRO.measuredRatio)],
      ['ŷ − y — exact, what the code uses', f4(MICRO.dA2)],
      ['their gap = exactly ε/2', f4(MICRO.measuredRatio - MICRO.dA2)],
    ],
  },
  {
    tag: 'Eq 1 · out',
    title: 'Output neuron asks: how much of that is MY raw sum z’s fault?',
    hotNodes: ['out'], hotEdges: [], showLoss: false,
    eqs: ['∂L/∂z² = ∂L/∂ŷ · σ′(z²)', `= ${f4(MICRO.dA2)} × ${f4(MICRO.sp2)} = ${f4(MICRO.dZ2)}`],
    intuition: 'The neuron owns one gate. σ′(z) = a(1−a) tells you how much a wiggle in z actually reaches the output. A saturated neuron (a near 0 or 1) has σ′ ≈ 0 and swallows the blame — that is a vanishing gradient, visible as a number.',
    table: [
      ['z² (raw sum)', f4(MICRO.z2)],
      ['ŷ = σ(z²)', f4(MICRO.a2)],
      ['σ′(z²) = ŷ(1−ŷ)', f4(MICRO.sp2)],
      ['∂L/∂z² (this neuron’s error)', f4(MICRO.dZ2)],
    ],
  },
  {
    tag: 'Eq 2,3 · out',
    title: 'Output neuron blames each of its own weights separately',
    hotNodes: ['out', 'h1', 'h2'], hotEdges: ['w2_1', 'w2_2'], showLoss: false,
    eqs: [
      '∂L/∂W²ⱼ = ∂L/∂z² · a¹ⱼ',
      '∂L/∂b² = ∂L/∂z² · 1',
    ],
    intuition: 'Here is the whole idea behind Eq 2. A weight only mattered as much as the signal it multiplied. W²₁ carried a¹₁ = ' + f3(MICRO.a1[0]) + ', so it gets that share of the blame. The bias multiplied a constant 1, so it gets the error untouched — that is all Eq 3 says.',
    table: [
      ['∂L/∂z²', f4(MICRO.dZ2)],
      [`× a¹₁ = ${f3(MICRO.a1[0])}  →  ∂L/∂W²₁`, f4(MICRO.dW2[0])],
      [`× a¹₂ = ${f3(MICRO.a1[1])}  →  ∂L/∂W²₂`, f4(MICRO.dW2[1])],
      ['× 1  →  ∂L/∂b²', f4(MICRO.db2)],
    ],
  },
  {
    tag: 'Eq 4 · pass',
    title: 'Each hidden neuron receives blame through the wire it sent signal on',
    hotNodes: ['h1', 'h2'], hotEdges: ['w2_1', 'w2_2'], showLoss: false,
    eqs: ['∂L/∂a¹ⱼ = ∂L/∂z² · W²ⱼ'],
    intuition: 'Same wire, opposite direction. Forward, a¹ⱼ was multiplied by W²ⱼ to influence z². So backward, the blame is multiplied by that same W²ⱼ. Note a¹₂ gets POSITIVE blame because its weight was negative — it was pushing the prediction the wrong way.',
    table: [
      [`∂L/∂a¹₁ = ${f4(MICRO.dZ2)} × ${MICRO.W2[0]}`, f4(MICRO.dA1[0])],
      [`∂L/∂a¹₂ = ${f4(MICRO.dZ2)} × ${MICRO.W2[1]}`, f4(MICRO.dA1[1])],
    ],
  },
  {
    tag: 'Neuron a¹₁',
    title: 'Hidden neuron 1 now runs the exact same three lines',
    hotNodes: ['h1', 'x1', 'x2'], hotEdges: ['w1_11', 'w1_12'], showLoss: false,
    eqs: [
      `∂L/∂z¹₁ = ${f4(MICRO.dA1[0])} × ${f4(MICRO.sp1[0])} = ${f4(MICRO.dZ1[0])}`,
      '∂L/∂W¹₁ⱼ = ∂L/∂z¹₁ · xⱼ',
    ],
    intuition: 'Nothing new is learned here — this neuron does not know it is “inside” a network. It received a blame number, pushed it through its own gate, and multiplied by its own inputs. Recursion, not new math.',
    table: [
      ['incoming ∂L/∂a¹₁', f4(MICRO.dA1[0])],
      ['σ′(z¹₁)', f4(MICRO.sp1[0])],
      ['∂L/∂z¹₁', f4(MICRO.dZ1[0])],
      [`× x₁ = ${MICRO.x[0]}  →  ∂L/∂W¹₁₁`, f4(MICRO.dW1[0][0])],
      [`× x₂ = ${MICRO.x[1]}  →  ∂L/∂W¹₁₂`, f4(MICRO.dW1[0][1])],
      ['× 1  →  ∂L/∂b¹₁', f4(MICRO.db1[0])],
    ],
  },
  {
    tag: 'Neuron a¹₂',
    title: 'Hidden neuron 2, same three lines, its own numbers',
    hotNodes: ['h2', 'x1', 'x2'], hotEdges: ['w1_21', 'w1_22'], showLoss: false,
    eqs: [
      `∂L/∂z¹₂ = ${f4(MICRO.dA1[1])} × ${f4(MICRO.sp1[1])} = ${f4(MICRO.dZ1[1])}`,
      '∂L/∂W¹₂ⱼ = ∂L/∂z¹₂ · xⱼ',
    ],
    intuition: 'Both hidden neurons work in parallel and never talk to each other. That independence is exactly why we can batch them into one matrix line instead of a loop — which is what the next step reveals.',
    table: [
      ['incoming ∂L/∂a¹₂', f4(MICRO.dA1[1])],
      ['σ′(z¹₂)', f4(MICRO.sp1[1])],
      ['∂L/∂z¹₂', f4(MICRO.dZ1[1])],
      [`× x₁ = ${MICRO.x[0]}  →  ∂L/∂W¹₂₁`, f4(MICRO.dW1[1][0])],
      [`× x₂ = ${MICRO.x[1]}  →  ∂L/∂W¹₂₂`, f4(MICRO.dW1[1][1])],
      ['× 1  →  ∂L/∂b¹₂', f4(MICRO.db1[1])],
    ],
  },
  {
    tag: '∇L',
    title: 'Stack every neuron’s answers → that IS the gradient vector',
    hotNodes: ['x1', 'x2', 'h1', 'h2', 'out'], hotEdges: [], showLoss: true,
    eqs: ['∇L = [ ∂L/∂W¹₁₁ , ∂L/∂W¹₁₂ , ∂L/∂b¹₁ , … , ∂L/∂b² ]'],
    intuition: 'This is the missing link. The gradient vector you met earlier — like ∇J(m,b) with one slot for m and one for b — is the same object. A neural net just has 9 slots here instead of 2, and millions in practice. Backprop is simply how you fill that vector cheaply.',
    table: [
      ['parameters in this net', '9'],
      ['forward passes needed', '1'],
      ['backward passes needed', '1'],
      ['naive probing would need', '≈ 10 forward passes'],
      ['then update', 'W ← W − α · ∇L'],
    ],
  },
  {
    tag: 'Why matrices',
    title: 'The 4 scary equations are just these per-neuron lines, batched',
    hotNodes: [], hotEdges: [], showLoss: false,
    eqs: ['same math · fewer symbols'],
    intuition: 'Read the table right-to-left and the fear goes away. Every matrix equation is a for-loop over neurons that someone already wrote for you. The transpose (ᵀ) is not a new idea — it is bookkeeping that makes the shapes line up when you swap “rows = outputs” for “rows = inputs” while going backward.',
    mapping: [
      { eq: 'Eq 1', neuron: '∂L/∂z = ∂L/∂a · σ′(z)   (one neuron)', matrix: 'dZ[l] = dA[l] ⊙ g′(Z[l])', why: '⊙ = do it for every neuron at once' },
      { eq: 'Eq 2', neuron: '∂L/∂Wⱼ = ∂L/∂z · aⱼ   (one weight)', matrix: 'dW[l] = (1/m) dZ[l] · A[l−1]ᵀ', why: 'the ᵀ pairs each error with each input; 1/m averages the batch' },
      { eq: 'Eq 3', neuron: '∂L/∂b = ∂L/∂z · 1', matrix: 'db[l] = (1/m) Σ dZ[l]', why: 'the ×1 means “just collect the errors”' },
      { eq: 'Eq 4', neuron: '∂L/∂aⱼ = ∂L/∂z · Wⱼ   (one wire)', matrix: 'dA[l−1] = (W[l])ᵀ · dZ[l]', why: 'same wire, reversed — hence the ᵀ' },
    ],
    table: null,
  },
];

const SlideNeuronBackprop = () => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= NEURON_STEPS.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 3200);
    return () => clearInterval(id);
  }, [playing]);

  const cur = NEURON_STEPS[step];
  const gradEdges = MICRO_EDGES
    .filter((e) => (e.id.startsWith('w2') ? step >= 2 : e.id === 'w1_11' || e.id === 'w1_12' ? step >= 4 : step >= 5))
    .map((e) => e.id);

  return (
    <SlideFrame title="Backprop Neuron by Neuron: Where the 4 Equations Come From">
      <div className="flex flex-col h-full space-y-4">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <p className="text-slate-300 text-sm md:text-base max-w-2xl">
            Every neuron does the <strong className="text-rose-300">same three lines of arithmetic</strong> on its own numbers.
            Stack their answers and you get the <strong className="text-amber-300">gradient vector ∇L</strong>.
            The 4 matrix equations are only shorthand for this.
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => { setPlaying(false); setStep(0); }}
              className="p-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-500 flex items-center gap-2"
            >
              <Play className="w-4 h-4" /> {playing ? 'Pause' : 'Auto-play'}
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(s + 1, NEURON_STEPS.length - 1))}
              disabled={step === NEURON_STEPS.length - 1}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-500 disabled:opacity-30 flex items-center gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {NEURON_STEPS.map((s, i) => (
            <button
              key={s.tag}
              type="button"
              onClick={() => { setPlaying(false); setStep(i); }}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                step === i
                  ? 'bg-indigo-600 border-indigo-400 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'
              }`}
            >
              {i + 1}. {s.tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1 px-2">
              Network · the neuron doing the work right now
            </div>
            <MicroNet hotNodes={cur.hotNodes} hotEdges={cur.hotEdges} gradEdges={gradEdges} showLoss={cur.showLoss} />
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 px-2">
              Gradient vector ∇L · filling up slot by slot
            </div>
            <GradientVectorPanel step={step} />
          </div>
        </div>

        <div className="bg-slate-900 border border-indigo-800/50 rounded-2xl p-5 space-y-3">
          <h3 className="text-lg font-bold text-white">
            <span className="text-indigo-400">Step {step + 1}/{NEURON_STEPS.length} · </span>
            {cur.title}
          </h3>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            {cur.eqs.map((eq) => (
              <div key={eq} className="font-serif text-base md:text-xl text-white text-center tracking-wide">
                {eq}
              </div>
            ))}
          </div>

          {cur.table && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {cur.table.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-1.5">
                  <span className="text-[11px] text-slate-400">{k}</span>
                  <span className="text-[11px] font-mono font-bold text-emerald-300">{v}</span>
                </div>
              ))}
            </div>
          )}

          {cur.mapping && (
            <div className="space-y-1.5">
              <div className="hidden md:grid grid-cols-12 gap-2 px-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                <div className="col-span-1">Eq</div>
                <div className="col-span-4">One neuron (what you just saw)</div>
                <div className="col-span-3">Matrix form (the scary one)</div>
                <div className="col-span-4">Why they are the same</div>
              </div>
              {cur.mapping.map((m) => (
                <div key={m.eq} className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-2">
                  <div className="md:col-span-1 text-[11px] font-bold text-indigo-400">{m.eq}</div>
                  <div className="md:col-span-4 text-[11px] font-mono text-rose-300">{m.neuron}</div>
                  <div className="md:col-span-3 text-[11px] font-mono text-blue-300">{m.matrix}</div>
                  <div className="md:col-span-4 text-[11px] text-slate-400">{m.why}</div>
                </div>
              ))}
            </div>
          )}

          <p className="text-sm text-slate-300 leading-relaxed flex gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{cur.intuition}</span>
          </p>
        </div>
      </div>
    </SlideFrame>
  );
};

// --- Do we actually bump epsilon? ---

const bumpEstimate = (eps) => (0.5 * (MICRO.a2 + eps - MICRO.y) ** 2 - MICRO.L) / eps;

const EPS_CURVE = Array.from({ length: 16 }, (_, i) => {
  const k = i + 1;
  const eps = Math.pow(10, -k);
  const err = Math.abs(bumpEstimate(eps) - MICRO.dA2);
  return { k, eps, err, logErr: Math.max(-11, Math.log10(err || 1e-11)) };
});

const epsX = (k) => 40 + ((k - 1) * 330) / 15;
const epsY = (logErr) => 25 + (-logErr) * 18;

const SlideEpsilonTruth = () => {
  const [k, setK] = useState(3);
  const eps = Math.pow(10, -k);
  const est = bumpEstimate(eps);
  const exact = MICRO.dA2;
  const err = Math.abs(est - exact);

  const best = EPS_CURVE.reduce((a, b) => (b.err < a.err ? b : a));

  return (
    <SlideFrame title="Do We Actually Bump ε? No — Here Is the Proof">
      <div className="flex flex-col h-full space-y-4">
        <p className="text-slate-300 text-base leading-relaxed">
          Backprop never nudges anything numerically. Calculus turned the limit into a <strong className="text-emerald-300">formula, once, on paper</strong>;
          the code just evaluates it. Drag ε below and watch why bumping is a <em>sanity check</em>, never the algorithm.
        </p>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
          <label className="text-xs font-bold text-slate-400 flex justify-between mb-2">
            <span>bump size ε</span>
            <span className="font-mono text-violet-300">1e−{k}</span>
          </label>
          <input
            type="range" min={1} max={16} step={1} value={k}
            onChange={(e) => setK(parseInt(e.target.value, 10))}
            className="w-full accent-violet-500"
          />
          <div className="flex justify-between text-[10px] text-slate-600 mt-1">
            <span>1e−1 (too coarse)</span>
            <span>sweet spot ≈ 1e−{best.k}</span>
            <span>1e−16 (round-off garbage)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-1.5">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
              Numbers at this ε
            </div>
            {[
              ['L(ŷ)', MICRO.L.toExponential(6)],
              ['L(ŷ + ε)', (0.5 * (MICRO.a2 + eps - MICRO.y) ** 2).toExponential(6)],
              ['bumped estimate  ΔL/ε', est.toExponential(6)],
              ['exact formula  ŷ − y', exact.toExponential(6)],
              ['error |estimate − exact|', err.toExponential(3)],
              ['predicted truncation ε/2', (eps / 2).toExponential(3)],
            ].map(([kk, v], i) => (
              <div
                key={kk}
                className={`flex justify-between gap-3 rounded-lg px-3 py-1.5 border ${
                  i === 3
                    ? 'bg-emerald-950/40 border-emerald-700/60'
                    : i === 4
                      ? 'bg-rose-950/30 border-rose-800/50'
                      : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <span className="text-[11px] text-slate-400">{kk}</span>
                <span className={`text-[11px] font-mono font-bold ${i === 3 ? 'text-emerald-300' : i === 4 ? 'text-rose-300' : 'text-slate-200'}`}>{v}</span>
              </div>
            ))}
            <p className="text-[11px] text-slate-500 pt-1">
              The exact row never changes — it does not depend on ε at all. Only the bumped row wobbles.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1 px-1">
              Error of the bump vs ε (log–log)
            </div>
            <svg viewBox="0 0 400 250" className="w-full">
              {[0, -2, -4, -6, -8, -10].map((g) => (
                <g key={g}>
                  <line x1={38} y1={epsY(g)} x2={378} y2={epsY(g)} stroke="#1e293b" strokeWidth="1" />
                  <text x={32} y={epsY(g) + 3} fill="#475569" fontSize="8" textAnchor="end">1e{g}</text>
                </g>
              ))}

              <polyline
                points={EPS_CURVE.map((p) => `${epsX(p.k)},${epsY(p.logErr)}`).join(' ')}
                fill="none" stroke="#fbbf24" strokeWidth="2"
              />
              {EPS_CURVE.map((p) => (
                <circle
                  key={p.k}
                  cx={epsX(p.k)} cy={epsY(p.logErr)} r={p.k === k ? 6 : 3}
                  fill={p.k === k ? '#f43f5e' : '#fbbf24'}
                  stroke={p.k === k ? '#4c0519' : 'none'} strokeWidth="2"
                  className={p.k === k ? 'animate-pulse' : ''}
                />
              ))}

              <text x={110} y={225} fill="#38bdf8" fontSize="9" textAnchor="middle">← truncation error (ε too big)</text>
              <text x={310} y={225} fill="#fb7185" fontSize="9" textAnchor="middle">round-off error (ε too small) →</text>
              <text x={epsX(best.k)} y={epsY(best.logErr) - 12} fill="#6ee7b7" fontSize="9" textAnchor="middle" fontWeight="bold">
                best ≈ 1e−{best.k}
              </text>
              <text x={208} y={244} fill="#64748b" fontSize="9" textAnchor="middle">ε from 1e−1 (left) to 1e−16 (right)</text>
            </svg>
            <p className="text-[11px] text-slate-500 px-1">
              A V shape, not a straight line down. There is no ε that gives the true answer — the bump is always wrong,
              just wrong by different amounts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-900 border-t-4 border-emerald-500 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-white text-sm">What the code does</h4>
            </div>
            <p className="text-xs text-slate-400">
              Evaluates a formula a human derived once. <MathExpr>∂L/∂ŷ = ŷ − y</MathExpr> is one subtraction.
              <MathExpr>σ′(z) = a(1−a)</MathExpr> is one multiply. Exact, ε-free, instant.
            </p>
          </div>
          <div className="bg-slate-900 border-t-4 border-rose-500 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-rose-400" />
              <h4 className="font-bold text-white text-sm">Why bumping is hopeless</h4>
            </div>
            <p className="text-xs text-slate-400">
              One extra forward pass <em>per parameter</em>. This 9-weight net needs ~10 passes; backprop needs
              1 forward + 1 backward. At a billion parameters, bumping is physically impossible.
            </p>
          </div>
          <div className="bg-slate-900 border-t-4 border-blue-500 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-blue-400" />
              <h4 className="font-bold text-white text-sm">Where it IS real</h4>
            </div>
            <p className="text-xs text-slate-400">
              <strong>Gradient checking</strong> (<code>torch.autograd.gradcheck</code>). Write a custom layer, bump its
              inputs once on a toy example, compare to your formula. A debugging tool — never part of training.
            </p>
          </div>
        </div>

        <HighlightBox icon={Lightbulb} title="The one sentence to remember" color="emerald">
          The ε bump is the <strong>definition</strong> of the derivative; the formula is the <strong>closed-form answer</strong> to that definition.
          Backprop ships the answer, so it never has to ask the question numerically.
        </HighlightBox>
      </div>
    </SlideFrame>
  );
};

const SlideAutograd = () => (
  <SlideFrame title="Relevance to Deep Learning Frameworks">
    <div className="space-y-6 text-slate-300 leading-relaxed text-lg flex flex-col h-full">
      <p>
        Modern deep learning libraries like <strong>TensorFlow</strong> and <strong>PyTorch</strong> heavily rely on this exact concept. They automatically build computational graphs based on the operations you define in your model code.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        <div className="bg-slate-900 p-6 rounded-2xl border-t-4 border-blue-500 shadow-xl">
          <FastForward className="w-8 h-8 text-blue-400 mb-4" />
          <h4 className="font-bold text-white mb-2">1. Forward Pass</h4>
          <p className="text-sm">They efficiently compute the forward pass, storing intermediate values in memory because they know they will be needed for the local gradients later.</p>
        </div>
        
        <div className="bg-slate-900 p-6 rounded-2xl border-t-4 border-rose-500 shadow-xl">
          <RotateCcw className="w-8 h-8 text-rose-400 mb-4" />
          <h4 className="font-bold text-white mb-2">2. Autograd</h4>
          <p className="text-sm">When you call <code>loss.backward()</code>, the engine simply traverses the graph backwards, applying the chain rule exactly as we just did. This is "automatic differentiation".</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border-t-4 border-emerald-500 shadow-xl">
          <Cpu className="w-8 h-8 text-emerald-400 mb-4" />
          <h4 className="font-bold text-white mb-2">3. Optimization</h4>
          <p className="text-sm">It frees you from manually deriving gradients for complex architectures. The framework identifies parallelizable operations and optimizes the execution on GPUs.</p>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center mt-auto shadow-inner">
        Understanding computational graphs clarifies how the chain rule enables the training of even very deep neural networks. It turns the potentially complex calculus of backpropagation into a structured, programmable traversal of a graph!
      </div>
    </div>
  </SlideFrame>
);


// --- Main Slideshow Wrapper ---
const Slideshow = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((p) => Math.min(p + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide((p) => Math.max(p - 1, 0));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  return (
    <div className="flex flex-col grow shrink-0 w-full min-h-full bg-[#0a0f18] font-sans">
      
      {/* Content Area */}
      <div className="flex flex-col grow w-full">
        {React.createElement(slides[currentSlide].component)}
      </div>

      {/* Navigation Footer */}
      <div className="sticky bottom-0 w-full shrink-0 bg-[#0a0f18] border-t border-slate-800 p-4 md:px-8 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.8)] z-50">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex gap-2.5 flex-wrap justify-center px-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-10 bg-blue-500' : 'w-2.5 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default function ChainRuleBackprop13() {
  const slides = [
    { component: SlideSingleVariable, title: 'Revisiting Chain Rule' },
    { component: SlideExample, title: 'Example Breakdown' },
    { component: SlideMultivariable, title: 'Multivariable Chain Rule' },
    { component: SlideGeneralizing, title: 'Generalizing to Sums' },
    { component: SlideCompositeNetwork, title: 'Networks as Composite Functions' },
    { component: SlideBackpropConnection, title: 'The Backprop Connection' },
    { component: SlideBackpropMath, title: 'The 4 Equations' },
    { component: SlideDoubtYouAreClear, title: 'Your Mental Model' },
    { component: SlideForwardSurfaceScenario, title: 'Forward Pass & the Surface' },
    { component: SlideBackpropLiveScenario, title: 'Backprop in Action' },
    { component: SlideNeuronBackprop, title: 'Backprop Neuron by Neuron' },
    { component: SlideEpsilonTruth, title: 'Do We Actually Bump ε?' },
    { component: SlideAutograd, title: 'Deep Learning Frameworks' }
  ];

  return <Slideshow slides={slides} />;
}