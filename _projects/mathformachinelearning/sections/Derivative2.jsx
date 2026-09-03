import React, { useState, useEffect } from 'react';
import { 
  Info,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  PenTool,
  MoveHorizontal,
  Plus,
  Minus,
  Layers,
  Zap,
  Target
} from 'lucide-react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ComposedChart,
  ReferenceDot,
  ReferenceLine,
  Area
} from 'recharts';

export const meta = {
  title: '2. Derivatives: Measuring Change',
  subtitle: 'Rules of differentiation and higher-order derivatives',
};

// Custom Math Notation Component
const MathExpr = ({ children }) => (
  <span className="font-serif italic text-blue-300 mx-1 text-[1.05em]">
    {children}
  </span>
);

const HighlightBox = ({ children, icon: Icon, title, color = "blue" }) => {
  const colorMap = {
    blue: "bg-blue-900/20 border-blue-800/50 text-blue-400",
    emerald: "bg-emerald-900/20 border-emerald-800/50 text-emerald-400",
    purple: "bg-purple-900/20 border-purple-800/50 text-purple-400",
    orange: "bg-orange-900/20 border-orange-800/50 text-orange-400",
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

// Standardized Slide Container with padding
const SlideFrame = ({ children }) => (
  <div className="flex flex-col w-full flex-grow px-6 py-8 md:px-12 md:py-10 bg-[#111111] text-slate-200 selection:bg-blue-500/30">
    <div className="w-full max-w-5xl mx-auto space-y-6 flex flex-col flex-grow">
      {children}
    </div>
  </div>
);

const SlideIntro = () => (
  <SlideFrame>
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Derivative: Slope of a Tangent Line</h2>
      <p className="text-slate-300 text-lg leading-relaxed mb-4">
        Functions exhibit change, which can be measured as an <strong>average rate</strong> over an interval or an <strong>instantaneous rate</strong> at a specific moment.
      </p>
      
      <HighlightBox icon={Activity} title="The Speedometer Analogy">
        <p className="text-lg">
          Think about your car's speedometer. It doesn't show your average speed for the last hour; it shows your speed <em>right now</em>. This "right now" rate of change is what we're after, and it leads us directly to the concept of the derivative.
        </p>
      </HighlightBox>

      <h3 className="text-2xl font-semibold text-white mt-10 mb-4">Secant vs. Tangent</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
          <h4 className="text-orange-400 font-bold mb-2 flex items-center gap-2">
            <MoveHorizontal className="w-5 h-5" /> Secant Line
          </h4>
          <p className="text-slate-300 text-sm">
            A line drawn through <em>two</em> points on a curve. The slope of this line represents the <strong>average rate of change</strong> between those two specific points.
          </p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
          <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Tangent Line
          </h4>
          <p className="text-slate-300 text-sm">
            Imagine moving one of those points closer and closer to the other. As the distance shrinks to zero, the line just barely touches the curve at <em>one</em> point. This tangent line represents <strong>instantaneous change</strong>.
          </p>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideSecantToTangent = () => {
  const [h, setH] = useState(2.0); 

  const x1 = 1; 
  const y1 = x1 * x1; 
  
  const x2 = x1 + h;
  const y2 = x2 * x2;

  const m_secant = (y2 - y1) / h;
  const m_tangent = 2;

  const curveData = [];
  for (let i = -1; i <= 3.5; i += 0.1) {
    curveData.push({ x: i, y: i * i });
  }

  const secantData = [
    { x: -0.5, y: m_secant * (-0.5 - x1) + y1 },
    { x: 3.5, y: m_secant * (3.5 - x1) + y1 }
  ];

  const tangentData = [
    { x: -0.5, y: m_tangent * (-0.5 - x1) + y1 },
    { x: 3.5, y: m_tangent * (3.5 - x1) + y1 }
  ];

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Visualizing the Limit</h2>
        <p className="text-slate-400 text-sm md:text-base mb-6">
          Watch how the Secant line approaches the Tangent line as the distance <MathExpr>h</MathExpr> shrinks to zero.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg">
              <label className="block text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">
                Distance <MathExpr>h</MathExpr>: <span className="text-white bg-slate-900 px-2 py-1 rounded">{h.toFixed(3)}</span>
              </label>
              <input 
                type="range" 
                min="0.001" 
                max="2.0" 
                step="0.001" 
                value={h} 
                onChange={(e) => setH(parseFloat(e.target.value))} 
                className="w-full accent-blue-500"
              />
              <p className="text-xs text-slate-500 mt-2">Slide left to make <MathExpr>h \to 0</MathExpr></p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-inner space-y-4">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Fixed Point</div>
                <div className="font-mono text-slate-200">x = {x1}, y = {y1}</div>
              </div>
              <div className="border-t border-slate-800 pt-3">
                <div className="text-xs text-orange-500 uppercase tracking-widest mb-1">Moving Point</div>
                <div className="font-mono text-orange-400">x = {x2.toFixed(3)}, y = {y2.toFixed(3)}</div>
              </div>
              <div className="border-t border-slate-800 pt-3">
                <div className="text-xs text-orange-500 uppercase tracking-widest mb-1">Secant Slope (Average)</div>
                <div className="font-mono text-2xl text-orange-400 font-bold">{m_secant.toFixed(3)}</div>
              </div>
              <div className="border-t border-slate-800 pt-3">
                <div className="text-xs text-emerald-500 uppercase tracking-widest mb-1">Tangent Slope (Instant)</div>
                <div className="font-mono text-2xl text-emerald-400 font-bold">{m_tangent.toFixed(3)}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-inner flex flex-col min-h-[350px]">
             <div className="w-full h-full min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" dataKey="x" domain={[-1, 3.5]} stroke="#94a3b8" />
                    <YAxis type="number" domain={[-2, 10]} stroke="#94a3b8" />
                    
                    <Line data={curveData} type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={false} />
                    <Line data={tangentData} type="linear" dataKey="y" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} isAnimationActive={false} />
                    <Line data={secantData} type="linear" dataKey="y" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={false} />

                    <Scatter data={[{x: x1, y: y1}]} fill="#10b981" />
                    <Scatter data={[{x: x2, y: y2}]} fill="#f97316" />
                  </ComposedChart>
               </ResponsiveContainer>
             </div>
             <div className="text-center mt-2 text-sm text-slate-500">
                Graph of <MathExpr>f(x) = x^2</MathExpr>. As orange approaches green, Secant becomes Tangent.
             </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideDefinition = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Geometric Definition</h2>
      <p className="text-slate-300 text-lg mb-8">
        The derivative of a function <MathExpr>f(x)</MathExpr> at a point <MathExpr>x = a</MathExpr> is the <strong>slope of the tangent line</strong> to the graph of <MathExpr>f(x)</MathExpr> at that point.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
          <TrendingUp className="w-6 h-6 text-emerald-400 mb-2" />
          <h4 className="font-bold text-white mb-1">Positive Slope</h4>
          <p className="text-sm text-slate-400">Function is increasing (going up).</p>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
          <TrendingDown className="w-6 h-6 text-rose-400 mb-2" />
          <h4 className="font-bold text-white mb-1">Negative Slope</h4>
          <p className="text-sm text-slate-400">Function is decreasing (going down).</p>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
          <MoveHorizontal className="w-6 h-6 text-slate-400 mb-2" />
          <h4 className="font-bold text-white mb-1">Zero Slope</h4>
          <p className="text-sm text-slate-400">Function is momentarily flat (peak/valley).</p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-200 mt-8 mb-4">The Limit Formula</h3>
      <div className="bg-slate-900 py-8 px-6 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto">
        <div className="flex items-center justify-center min-w-[500px]">
          <span className="text-2xl text-white mr-4">Slope<sub className="text-sm">secant</sub> =</span>
          <div className="flex flex-col items-center mx-4 text-xl text-blue-300 font-serif">
            <span className="border-b border-blue-500 pb-1 px-4">f(x + h) - f(x)</span>
            <span className="pt-1 text-slate-400">h</span>
          </div>
          <ArrowRight className="w-6 h-6 text-emerald-500 mx-6" />
          <span className="text-2xl text-emerald-400 font-bold mr-4">f'(x) = </span>
          <div className="flex flex-col items-center mr-2 text-2xl text-white font-serif">
            <span>lim</span>
            <span className="text-sm text-slate-400">h→0</span>
          </div>
          <div className="flex flex-col items-center text-xl text-emerald-300 font-serif">
            <span className="border-b border-emerald-500 pb-1 px-4">f(x + h) - f(x)</span>
            <span className="pt-1">h</span>
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-slate-500 italic mt-4">
        As the distance between points (<MathExpr>h</MathExpr>) shrinks to zero, the secant slope becomes the exact derivative.
      </p>
    </div>
  </SlideFrame>
);

const SlideNotation = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Derivative Notation</h2>
        <p className="text-slate-300 text-lg mb-8">
          Mathematicians developed a couple of common ways to denote the derivative. Knowing these notations is important because you'll encounter them frequently in machine learning literature.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        
        {/* Lagrange */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 shadow-lg flex flex-col">
          <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-slate-700 pb-2">
            Lagrange Notation: The Prime Symbol
          </h3>
          <div className="flex items-center justify-center py-8">
            <span className="text-6xl font-serif text-white">f'(x)</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Read as "f prime of x". The tick mark (<MathExpr>'</MathExpr>) simply indicates the derivative.
          </p>
          <ul className="space-y-3 text-sm text-slate-400 list-disc pl-5 mt-auto">
            <li>Very compact and clean.</li>
            <li>Easy to evaluate at a point, e.g., <MathExpr>f'(3)</MathExpr>.</li>
            <li>If output <MathExpr>y = f(x)</MathExpr>, it's often written as <MathExpr>y'</MathExpr>.</li>
          </ul>
        </div>

        {/* Leibniz */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 shadow-lg flex flex-col">
          <h3 className="text-xl font-bold text-emerald-400 mb-4 border-b border-slate-700 pb-2">
            Leibniz Notation: Ratio of Infinitesimals
          </h3>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center text-5xl font-serif text-white">
              <span className="border-b-2 border-white pb-1 px-2">dy</span>
              <span className="pt-1 px-2">dx</span>
            </div>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Read as "dee y, dee x". Visually represents an infinitesimal change in <MathExpr>y</MathExpr> over an infinitesimal change in <MathExpr>x</MathExpr>.
          </p>
          <ul className="space-y-3 text-sm text-slate-400 list-disc pl-5 mt-auto">
            <li>Visually reminds you it's a slope (<MathExpr>\Delta y / \Delta x</MathExpr>).</li>
            <li>Explicitly states <em>which</em> variable is changing (<MathExpr>x</MathExpr>).</li>
            <li>Crucial for multivariable calculus and the Chain Rule!</li>
          </ul>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlidePowerRule = () => {
  const [step, setStep] = useState(0);

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full">
        <h2 className="text-3xl font-bold text-white mb-2">Shortcut: The Power Rule</h2>
        <p className="text-slate-300 text-lg mb-6">
          Calculating limits manually is tedious. Fortunately, mathematicians derived shortcuts! For variables raised to a power, we use the <strong>Power Rule</strong>.
        </p>

        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-xl mb-8 flex justify-center items-center">
          <span className="text-2xl md:text-3xl text-white font-serif flex items-center">
            If <MathExpr>f(x) = x^n</MathExpr>, then <span className="text-emerald-400 font-bold ml-3 bg-slate-800 px-4 py-2 rounded-lg border border-slate-600">f'(x) = n \cdot x^{"{n-1}"}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
          <div className="space-y-6">
             <HighlightBox icon={PenTool} title="The 2-Step Process" color="emerald">
                <ol className="list-decimal pl-5 space-y-3 text-slate-200">
                  <li><strong>Bring the exponent down:</strong> Multiply the term by the original exponent <MathExpr>n</MathExpr>.</li>
                  <li><strong>Reduce the exponent:</strong> Subtract 1 from the original exponent.</li>
                </ol>
             </HighlightBox>
             
             <div className="flex gap-4">
                <button 
                  onClick={() => setStep((s) => (s + 1) % 4)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-md transition-all flex items-center gap-2"
                >
                  Show Next Step <ArrowRight className="w-4 h-4" />
                </button>
             </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest absolute top-4 left-4">Example</span>
            
            {/* Step 0: Starting Equation */}
            <div className={`text-5xl font-serif transition-all duration-500 absolute ${step === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <span className="text-white">f(x) = x</span>
              <span className="text-blue-400 text-4xl align-super ml-1">3</span>
            </div>

            {/* Step 1: Bring down */}
            <div className={`text-5xl font-serif transition-all duration-500 absolute flex items-center ${step === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <span className="text-emerald-400 mr-2 border-2 border-dashed border-emerald-500 p-2 rounded">3</span>
              <span className="text-white">x</span>
              <span className="text-blue-400 text-4xl align-super ml-1">3</span>
            </div>

            {/* Step 2: Reduce */}
            <div className={`text-5xl font-serif transition-all duration-500 absolute flex items-center ${step === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <span className="text-emerald-400 mr-2">3</span>
              <span className="text-white">x</span>
              <span className="text-blue-400 text-4xl align-super ml-1 border-2 border-dashed border-blue-500 p-1 rounded">3 - 1</span>
            </div>

            {/* Step 3: Final */}
            <div className={`text-5xl font-serif transition-all duration-500 absolute flex flex-col items-center gap-4 ${step === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="text-slate-400 text-lg">Derivative:</div>
              <div>
                <span className="text-white">f'(x) = </span>
                <span className="text-emerald-400">3</span>
                <span className="text-white">x</span>
                <span className="text-blue-400 text-4xl align-super ml-1">2</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideConstantAndMultiple = () => {
  // Constant line data
  const constantData = [
    { x: -5, y: 5 },
    { x: 5, y: 5 }
  ];

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full">
        <h2 className="text-3xl font-bold text-white mb-2">Constants & Multiples</h2>
        <p className="text-slate-300 text-lg mb-6">
          What happens to standalone numbers, or numbers attached to variables?
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          
          {/* Constant Rule */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-emerald-400 mb-3 flex items-center gap-2">
              <MoveHorizontal className="w-5 h-5"/> 1. The Constant Rule
            </h3>
            <p className="text-slate-300 mb-4">
              If <MathExpr>f(x) = 5</MathExpr>, what is <MathExpr>f'(x)</MathExpr>? A constant function never changes. Its rate of change is zero everywhere. 
            </p>
            
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-inner w-full h-[200px] mb-4">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis type="number" dataKey="x" domain={[-5, 5]} stroke="#94a3b8" />
                    <YAxis type="number" domain={[0, 10]} stroke="#94a3b8" />
                    <Line data={constantData} type="monotone" dataKey="y" stroke="#10b981" strokeWidth={4} dot={false} isAnimationActive={false} />
                    <ReferenceLine x={2} stroke="#f97316" strokeDasharray="3 3" label={{ position: 'top', value: 'Slope = 0', fill: '#f97316' }} />
                  </ComposedChart>
               </ResponsiveContainer>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg text-center border border-slate-800 mt-auto">
              <span className="font-serif text-lg text-emerald-400">Derivative of a Constant is 0</span>
            </div>
          </div>

          {/* Constant Multiple Rule */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5"/> 2. Constant Multiple Rule
            </h3>
            <p className="text-slate-300 mb-4">
              What about <MathExpr>f(x) = 3x^2</MathExpr>? Constant factors just "tag along" when you differentiate.
            </p>
            
            <div className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-inner">
               <p className="text-slate-400 text-sm">Find the derivative of <MathExpr>x^2</MathExpr>, then multiply by 3.</p>
               
               <div className="font-serif text-lg text-white">
                 <div className="flex items-center gap-4 mb-2">
                   <span>f(x) = <span className="text-blue-400 font-bold">3</span>x²</span>
                 </div>
                 
                 <div className="flex items-center gap-4 mb-2">
                   <ArrowRight className="w-4 h-4 text-slate-500" />
                   <span>f'(x) = <span className="text-blue-400 font-bold">3</span> · <span className="text-emerald-400 border border-emerald-500/50 px-2 rounded bg-emerald-900/30">(2x)</span></span>
                 </div>

                 <div className="flex items-center gap-4 border-t border-slate-700 pt-3 mt-3">
                   <ArrowRight className="w-4 h-4 text-emerald-500" />
                   <span className="text-xl font-bold">f'(x) = 6x</span>
                 </div>
               </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg text-center border border-slate-800 mt-auto">
              <span className="font-serif text-lg text-blue-400">h(x) = c·f(x) → h'(x) = c·f'(x)</span>
            </div>
          </div>

        </div>
      </div>
    </SlideFrame>
  );
};

const SlideSumDifference = () => (
  <SlideFrame>
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Combining Functions</h2>
      <p className="text-slate-300 text-lg mb-8">
        Calculus provides a straightforward rule: the derivative of a sum (or difference) of functions is simply the sum (or difference) of their individual derivatives.
      </p>

      <div className="space-y-8">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg">
          <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5"/> The Sum & Difference Rules
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center flex flex-col justify-center">
              <span className="text-sm text-slate-400 uppercase tracking-widest mb-2">Lagrange Notation</span>
              <span className="font-serif text-2xl text-white">h'(x) = f'(x) ± g'(x)</span>
            </div>
            
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center flex flex-col justify-center">
              <span className="text-sm text-slate-400 uppercase tracking-widest mb-2">Leibniz Notation</span>
              <div className="flex items-center justify-center font-serif text-xl text-white gap-2">
                <div className="flex flex-col items-center"><span className="border-b border-white px-1">d</span><span>dx</span></div>
                <span>[f(x) ± g(x)] =</span>
                <div className="flex flex-col items-center"><span className="border-b border-white px-1">d</span><span>dx</span></div>
                <span>f(x) ±</span>
                <div className="flex flex-col items-center"><span className="border-b border-white px-1">d</span><span>dx</span></div>
                <span>g(x)</span>
              </div>
            </div>
          </div>
        </div>

        <HighlightBox icon={Zap} title="What this means in practice:" color="emerald">
          <p className="text-lg">
            Essentially, you can differentiate a function <strong>term by term</strong>. If you have a long polynomial, you don't need a complex new rule. Just apply the Power Rule, Constant Multiple Rule, and Constant Rule to each piece separately!
          </p>
        </HighlightBox>
      </div>
    </div>
  </SlideFrame>
);

const SlidePuttingItTogether = () => {
  const [step, setStep] = useState(0);

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Putting It All Together</h2>
            <p className="text-slate-300 text-lg">Let's differentiate a full polynomial step-by-step.</p>
          </div>
          <button 
            onClick={() => setStep((s) => (s + 1) % 5)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-md transition-all text-sm"
          >
            {step === 4 ? "Reset" : "Next Term"}
          </button>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl mb-6 text-center">
          <span className="text-2xl md:text-3xl text-white font-serif">
            p(x) = 
            <span className={step >= 1 ? 'text-blue-400' : ''}> 4x³</span> - 
            <span className={step >= 2 ? 'text-emerald-400' : ''}> 5x²</span> + 
            <span className={step >= 3 ? 'text-orange-400' : ''}> x</span> - 
            <span className={step >= 4 ? 'text-purple-400' : ''}> 2</span>
          </span>
        </div>

        <div className="flex-grow space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          
          <div className={`p-4 rounded-xl border transition-all duration-500 ${step >= 1 ? 'bg-slate-800 border-blue-500/50 opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h4 className="font-bold text-blue-400 mb-1">1. Term: 4x³</h4>
            <div className="font-mono text-sm text-slate-300 flex items-center gap-2">
              Derivative of x³ is 3x². Multiply by 4. <ArrowRight className="w-4 h-4 inline text-blue-400"/> <span className="text-white font-bold text-lg">12x²</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-all duration-500 delay-100 ${step >= 2 ? 'bg-slate-800 border-emerald-500/50 opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h4 className="font-bold text-emerald-400 mb-1">2. Term: -5x²</h4>
            <div className="font-mono text-sm text-slate-300 flex items-center gap-2">
              Derivative of x² is 2x. Multiply by -5. <ArrowRight className="w-4 h-4 inline text-emerald-400"/> <span className="text-white font-bold text-lg">-10x</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-all duration-500 delay-100 ${step >= 3 ? 'bg-slate-800 border-orange-500/50 opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h4 className="font-bold text-orange-400 mb-1">3. Term: +x (or 1x¹)</h4>
            <div className="font-mono text-sm text-slate-300 flex items-center gap-2">
              Derivative of x¹ is 1x⁰ = 1. Multiply by 1. <ArrowRight className="w-4 h-4 inline text-orange-400"/> <span className="text-white font-bold text-lg">+1</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-all duration-500 delay-100 ${step >= 4 ? 'bg-slate-800 border-purple-500/50 opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h4 className="font-bold text-purple-400 mb-1">4. Term: -2</h4>
            <div className="font-mono text-sm text-slate-300 flex items-center gap-2">
              This is a constant. Constant rule applies. <ArrowRight className="w-4 h-4 inline text-purple-400"/> <span className="text-white font-bold text-lg">0</span>
            </div>
          </div>

        </div>

        <div className={`mt-6 bg-slate-800 border-2 border-emerald-500 p-6 rounded-2xl shadow-xl text-center transition-all duration-1000 ${step === 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest block mb-2">Final Derivative</span>
          <span className="text-3xl text-white font-serif">
            p'(x) = 12x² - 10x + 1
          </span>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideHigherOrder = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Higher-Order Derivatives</h2>
      <p className="text-slate-300 text-lg mb-8">
        The first derivative <MathExpr>f'(x)</MathExpr> tells us how quickly the output is changing. But what if we want to know how the <em>rate of change itself</em> is changing? We take the derivative of the derivative!
      </p>

      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg">
        <h3 className="text-2xl font-bold text-blue-400 mb-6 border-b border-slate-700 pb-3">
          The Second Derivative
        </h3>
        
        <p className="text-slate-300 mb-6">
          Simply put, if you have a function <MathExpr>f(x)</MathExpr>, you find its first derivative <MathExpr>f'(x)</MathExpr>. Then, you differentiate <MathExpr>f'(x)</MathExpr> again to get the second derivative.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 uppercase tracking-widest block mb-3">Lagrange Notation</span>
            <div className="text-3xl font-serif text-white text-center">f''(x)</div>
            <p className="text-center text-sm text-slate-400 mt-3">Read as "f double prime of x"</p>
          </div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 uppercase tracking-widest block mb-3">Leibniz Notation</span>
            <div className="flex justify-center items-center font-serif text-2xl text-white">
              <div className="flex flex-col items-center">
                <span className="border-b border-white px-1">d²y</span>
                <span>dx²</span>
              </div>
            </div>
            <p className="text-center text-sm text-slate-400 mt-3">Notice the '2' placements.</p>
          </div>
        </div>

        <HighlightBox icon={Activity} title="Why do we care?" color="purple">
          <p className="text-[15px]">
            In machine learning (specifically optimization), the first derivative points us towards a minimum or maximum (like the bottom of a valley in a cost function). The <strong>second derivative</strong> confirms if it's actually a minimum (a valley) or a maximum (a hill) by describing the <em>curvature</em>.
          </p>
        </HighlightBox>
      </div>
    </div>
  </SlideFrame>
);

const SlideConcavity = () => {
  const curveData = [];
  for (let i = -2; i <= 2; i += 0.1) {
    curveData.push({ x: parseFloat(i.toFixed(1)), yUp: i * i, yDown: -i * i });
  }

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">What Does the Second Derivative Tell Us?</h2>
        <p className="text-slate-300 text-lg mb-6">
          While the first derivative <MathExpr>f'(x)</MathExpr> tells us the <em>slope</em>, the second derivative <MathExpr>f''(x)</MathExpr> tells us how the slope is changing, which dictates <strong>concavity</strong>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
          
          <div className="lg:col-span-1 space-y-4">
             <div className="bg-slate-800 p-5 rounded-xl border-l-4 border-blue-500 shadow-md">
               <h4 className="font-bold text-blue-400 mb-2">Concave Up (f'' &gt; 0)</h4>
               <p className="text-sm text-slate-300 mb-2">The slope is increasing. The graph bends upwards, like a cup holding water.</p>
               <div className="bg-slate-900 px-3 py-2 rounded text-xs font-mono text-blue-300">Ex: y = x² → y'' = 2 (Always &gt; 0)</div>
             </div>

             <div className="bg-slate-800 p-5 rounded-xl border-l-4 border-rose-500 shadow-md">
               <h4 className="font-bold text-rose-400 mb-2">Concave Down (f'' &lt; 0)</h4>
               <p className="text-sm text-slate-300 mb-2">The slope is decreasing. The graph bends downwards, like an overturned cup.</p>
               <div className="bg-slate-900 px-3 py-2 rounded text-xs font-mono text-rose-300">Ex: y = -x² → y'' = -2 (Always &lt; 0)</div>
             </div>

             <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 mt-4">
               <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2"><Target className="w-4 h-4 text-emerald-400"/> Physics Analogy</h4>
               <p className="text-xs text-slate-400 leading-relaxed">
                 If <MathExpr>f(x)</MathExpr> is position...<br/>
                 <MathExpr>f'(x)</MathExpr> is velocity (speeding up/down).<br/>
                 <MathExpr>f''(x)</MathExpr> is <strong>acceleration</strong>. Positive acceleration pulls you "up", negative pulls you "down".
               </p>
             </div>
          </div>

          {/* Explicit height wrapper for Recharts */}
          <div className="lg:col-span-2 bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-inner flex flex-col min-h-[350px]">
             <div className="w-full h-full min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" dataKey="x" domain={[-2, 2]} stroke="#94a3b8" />
                    <YAxis type="number" domain={[-4, 4]} stroke="#94a3b8" />
                    
                    <Line data={curveData} type="monotone" dataKey="yUp" stroke="#3b82f6" strokeWidth={3} dot={false} name="y = x²" />
                    <Line data={curveData} type="monotone" dataKey="yDown" stroke="#f43f5e" strokeWidth={3} dot={false} name="y = -x²" />

                    <ReferenceLine y={0} stroke="#475569" />
                    <ReferenceLine x={0} stroke="#475569" />
                    
                    {/* Fake Annotations */}
                    <ReferenceDot x={-1.2} y={3} r={0} fill="none" label={{ position: 'center', value: "Concave Up (f'' > 0)", fill: '#3b82f6', fontSize: 12 }} />
                    <ReferenceDot x={1.2} y={-3} r={0} fill="none" label={{ position: 'center', value: "Concave Down (f'' < 0)", fill: '#f43f5e', fontSize: 12 }} />
                  </ComposedChart>
               </ResponsiveContainer>
             </div>
          </div>

        </div>
      </div>
    </SlideFrame>
  );
};


// Built-in Slideshow logic to ensure styles and navigation map correctly in a standalone file
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
    <div className="flex flex-col grow shrink-0 w-full min-h-full bg-[#111111]">
      
      {/* Content Area (Flows naturally, allowing App.jsx <main> to scroll) */}
      <div className="flex flex-col grow w-full">
        {React.createElement(slides[currentSlide].component)}
      </div>

      {/* Navigation Footer (Sticky) */}
      <div className="sticky bottom-0 w-full shrink-0 bg-[#111111] border-t border-slate-800 p-4 md:px-8 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.8)] z-50">
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

export default function Derivatives2() {
  const slides = [
    { component: SlideIntro, title: 'Intro' },
    { component: SlideSecantToTangent, title: 'Visualizing Change' },
    { component: SlideDefinition, title: 'Geometric Definition' },
    { component: SlideNotation, title: 'Notation' },
    { component: SlidePowerRule, title: 'Power Rule' },
    { component: SlideConstantAndMultiple, title: 'Constants & Multiples' },
    { component: SlideSumDifference, title: 'Combining Functions' },
    { component: SlidePuttingItTogether, title: 'Putting it all together' },
    { component: SlideHigherOrder, title: 'Higher-Order Derivatives' },
    { component: SlideConcavity, title: 'Concavity' },
  ];

  // Return the Slideshow using the sticky bottom method to match App layout perfectly
  return <Slideshow slides={slides} />;
}