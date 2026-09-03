import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Info,
  TrendingUp,
  Target,
  Box,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ComposedChart,
  ReferenceDot
} from 'recharts';

// Meta object required by your dynamic App.jsx router
export const meta = { 
  title: '1. Limits & Intuition',
  subtitle: 'The foundation of calculus for machine learning' 
};

// --- DATA & CONFIG ---

// Data for f(x) = 2x + 1
const lineDataIntuition = [
  { x: 2.5, y: 6 },
  { x: 2.8, y: 6.6 },
  { x: 3, y: 7 },
  { x: 3.2, y: 7.4 },
  { x: 3.5, y: 8 }
];

// Data for approaching points (2x + 1)
const approachSteps = [
  { step: 0, left: null, right: null },
  { step: 1, left: { x: 2.9, y: 6.8 }, right: { x: 3.1, y: 7.2 } },
  { step: 2, left: { x: 2.99, y: 6.98 }, right: { x: 3.01, y: 7.02 } },
  { step: 3, left: { x: 2.999, y: 6.998 }, right: { x: 3.001, y: 7.002 } },
];

// Data for g(x) = (x^2 - 1) / (x - 1) which simplifies to x + 1
const lineDataHole = [
  { x: 0, y: 1 },
  { x: 0.5, y: 1.5 },
  { x: 0.9, y: 1.9 },
  { x: 1.1, y: 2.1 },
  { x: 1.5, y: 2.5 },
  { x: 2, y: 3 }
];

// --- HELPER COMPONENTS ---

// Custom Math Notation Component for consistent styling
const MathExpr = ({ children }) => (
  <span className="font-serif italic text-blue-300 mx-1 text-[1.05em]">
    {children}
  </span>
);

const HighlightBox = ({ children, icon: Icon, title }) => (
  <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-6 my-6 shadow-inner">
    {title && (
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-5 h-5 text-blue-400" />}
        <h4 className="text-blue-100 font-semibold">{title}</h4>
      </div>
    )}
    <div className="text-blue-50/90 leading-relaxed">
      {children}
    </div>
  </div>
);

// Padded canvas for slides - naturally grows with content
const SlideFrame = ({ children }) => (
  <div className="flex flex-col w-full flex-grow px-6 py-8 md:px-12 md:py-10 bg-[#111111] text-slate-200">
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {children}
    </div>
  </div>
);

// --- SLIDE COMPONENTS ---

const SlideIntro = () => (
  <SlideFrame>
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">What is a Limit?</h2>
      <p className="text-slate-300 text-lg leading-relaxed">
        Functions describe relationships between inputs and outputs, such as <MathExpr>y = f(x)</MathExpr>. 
        A foundational concept for calculus is the <strong>limit</strong>. Limits help understand how a function 
        behaves near a particular input value.
      </p>
      
      <HighlightBox icon={Info} title="The Core Intuition">
        <p className="text-lg">
          "Imagine you're walking towards a specific point on a path. A limit is like asking: 'Where does it 
          look like I'll end up as I get incredibly close to that point, even if I don't actually step on 
          that exact spot?'"
        </p>
      </HighlightBox>

      <h3 className="text-2xl font-semibold text-white mt-10 mb-4">Why "Close To"?</h3>
      <p className="text-slate-300 text-lg leading-relaxed">
        Sometimes, we can just plug an input value into a function to see the output. If we have 
        <MathExpr>f(x) = x + 2</MathExpr> and want to know what happens at <MathExpr>x = 3</MathExpr>, 
        we calculate <MathExpr>f(3) = 3 + 2 = 5</MathExpr>. Simple enough.
      </p>
      <p className="text-slate-300 text-lg leading-relaxed mt-4">
        But what if the function is undefined at the specific point we're interested in? Or what if we want 
        to understand the <em>trend or tendency</em> of the function right around that point? This is where limits 
        become essential. They allow us to analyze the function's behavior as we approach a value, regardless of 
        what happens <em>precisely</em> at that value.
      </p>
    </div>
  </SlideFrame>
);

const SlideIntuition = () => {
  const [step, setStep] = useState(0);

  const currentPoints = approachSteps.slice(1, step + 1).map(s => s.left).concat(
    approachSteps.slice(1, step + 1).map(s => s.right)
  ).filter(Boolean);

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Intuition Behind Limits</h2>
        <p className="text-slate-300 text-lg mb-6">
          Let's try this with <MathExpr>f(x) = 2x + 1</MathExpr> as <MathExpr>x</MathExpr> approaches 3. 
          We aren't asking what <MathExpr>f(3)</MathExpr> is (though here it's 7). Instead, we're exploring 
          the <em>neighborhood</em> around <MathExpr>x = 3</MathExpr>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 shadow-lg">
              <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                x slightly <em>less</em> than 3
              </h4>
              <ul className="space-y-3 font-mono text-sm md:text-base">
                <li className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                  If x = 2.9, <span className="text-slate-400">f(x) = 2(2.9)+1 = </span><span className="text-orange-400 font-bold">6.8</span>
                </li>
                <li className={`transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                  If x = 2.99, <span className="text-slate-400">f(x) = 2(2.99)+1 = </span><span className="text-orange-400 font-bold">6.98</span>
                </li>
                <li className={`transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                  If x = 2.999, <span className="text-slate-400">f(x) = 2(2.999)+1 = </span><span className="text-orange-400 font-bold">6.998</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 shadow-lg">
              <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                x slightly <em>greater</em> than 3
              </h4>
              <ul className="space-y-3 font-mono text-sm md:text-base">
                <li className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                  If x = 3.1, <span className="text-slate-400">f(x) = 2(3.1)+1 = </span><span className="text-orange-400 font-bold">7.2</span>
                </li>
                <li className={`transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                  If x = 3.01, <span className="text-slate-400">f(x) = 2(3.01)+1 = </span><span className="text-orange-400 font-bold">7.02</span>
                </li>
                <li className={`transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                  If x = 3.001, <span className="text-slate-400">f(x) = 2(3.001)+1 = </span><span className="text-orange-400 font-bold">7.002</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setStep(prev => Math.min(prev + 1, 3))}
                disabled={step === 3}
                className="flex-1 flex justify-center items-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg font-medium transition-all"
              >
                <Play className="w-4 h-4" /> Trace Closer
              </button>
              <button 
                onClick={() => setStep(0)}
                disabled={step === 0}
                className="flex-none px-4 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white rounded-lg transition-all"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 flex flex-col shadow-inner">
            {/* STRICT explicit pixel height ensures recharts does not collapse */}
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={lineDataIntuition} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="x" type="number" domain={[2.5, 3.5]} stroke="#94a3b8" tickCount={6} />
                  <YAxis domain={[5.5, 8.5]} stroke="#94a3b8" tickCount={7} />
                  <Line type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={false} />
                  <Scatter data={currentPoints} fill="#f97316" line={false} shape="diamond" />
                  {step > 0 && <ReferenceDot x={3} y={7} r={6} fill="#f97316" stroke="none" isFront={true}/>}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4 text-sm text-slate-400 italic">
              {step === 0 ? "As we pick points closer to the vertical line where x = 3..." : 
               step === 3 ? "The corresponding points on the function get closer to the height y = 7." : "Notice the y-values converging..."}
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideNotation = () => (
  <SlideFrame>
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Mathematical Notation</h2>
        <p className="text-slate-300 text-lg">
          Notice a pattern? As <MathExpr>x</MathExpr> gets closer and closer to 3, from either side, the 
          output value <MathExpr>f(x)</MathExpr> gets closer and closer to 7. We write this mathematically as:
        </p>
      </div>

      <div className="bg-slate-900 py-12 px-6 rounded-3xl border border-slate-800 shadow-2xl flex justify-center">
        <div className="flex items-end text-5xl md:text-7xl font-serif text-white">
          <div className="flex flex-col items-center mr-3">
            <span>lim</span>
            <span className="text-lg md:text-2xl mt-1 text-blue-400">x→3</span>
          </div>
          <span className="mb-2 md:mb-4">(2x + 1)</span>
          <span className="mx-5 mb-2 md:mb-4 text-slate-500">=</span>
          <span className="mb-2 md:mb-4 text-orange-400 font-bold">7</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-start gap-4">
          <div className="font-serif text-2xl text-white">lim</div>
          <div className="text-slate-300 text-sm mt-1">Indicates we are finding a limit (a trend, not necessarily a hard value).</div>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-start gap-4">
          <div className="font-serif text-xl text-blue-400 mt-1">x→3</div>
          <div className="text-slate-300 text-sm">Means "as the input <MathExpr>x</MathExpr> gets arbitrarily close to the value 3".</div>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-start gap-4">
          <div className="font-serif text-xl text-white mt-1">(2x+1)</div>
          <div className="text-slate-300 text-sm">The specific function or relationship we are examining.</div>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-start gap-4">
          <div className="font-serif text-2xl text-orange-400">= 7</div>
          <div className="text-slate-300 text-sm mt-1">States the target value the function is approaching.</div>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideHole = () => (
  <SlideFrame>
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">When the Function Has a Hole</h2>
      <p className="text-slate-300 text-lg mb-8">
        The real utility of limits shines when a function has a gap or is undefined at a point. Consider:
      </p>
      
      <div className="flex justify-center mb-8">
        <div className="text-3xl md:text-4xl text-white font-serif flex items-center bg-slate-900 px-8 py-5 rounded-2xl border border-slate-800 shadow-xl">
          <span>g(x) = </span>
          <div className="flex flex-col items-center mx-4">
            <span className="border-b-2 border-white/70 pb-1 px-4">x² - 1</span>
            <span className="pt-2">x - 1</span>
          </div>
        </div>
      </div>

      <p className="text-slate-300 text-lg mb-8 leading-relaxed">
        At <MathExpr>x = 1</MathExpr>, we get <MathExpr>0/0</MathExpr> (undefined). But if we factor the top to <MathExpr>(x-1)(x+1)</MathExpr> and cancel, 
        it simplifies to <MathExpr>g(x) = x + 1</MathExpr>, provided <MathExpr>x ≠ 1</MathExpr>. The graph looks exactly like a line, except there's a "hole" at <MathExpr>x = 1</MathExpr>.
      </p>

      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-inner">
        {/* STRICT explicit pixel height ensures recharts does not collapse */}
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={lineDataHole} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="x" type="number" domain={[0, 2]} stroke="#94a3b8" tickCount={5} />
              <YAxis domain={[0.5, 3.5]} stroke="#94a3b8" tickCount={7} />
              <Line type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <ReferenceDot x={1} y={2} r={6} fill="#0f172a" stroke="#3b82f6" strokeWidth={2} isFront={true} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-6 text-sm text-slate-400 italic">
          The graph of <MathExpr>g(x)</MathExpr> is the line <MathExpr>y = x + 1</MathExpr> with a single point removed at (1, 2).
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideCoreIdea = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Core Idea Summarized</h2>
      
      <div className="bg-slate-800 border-l-4 border-blue-500 rounded-r-xl p-8 shadow-lg my-8 text-lg">
        <p className="text-slate-200 leading-relaxed">
          A limit <MathExpr>L</MathExpr> exists for a function <MathExpr>f(x)</MathExpr> as <MathExpr>x</MathExpr> approaches 
          some value <MathExpr>c</MathExpr> if we can make the function's output <MathExpr>f(x)</MathExpr> as close 
          to <MathExpr>L</MathExpr> as we desire, simply by choosing an input <MathExpr>x</MathExpr> sufficiently close 
          to <MathExpr>c</MathExpr> (but not actually equal to <MathExpr>c</MathExpr>).
        </p>
        <p className="text-blue-300 font-semibold mt-4">
          The function doesn't even need to be defined at <MathExpr>c</MathExpr> for the limit to exist.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-slate-300 text-lg leading-relaxed">
          This idea of "getting arbitrarily close" is the foundation upon which the idea of the derivative is built. 
        </p>
        <div className="flex gap-4 p-5 bg-slate-900 rounded-lg border border-slate-800 shadow-inner">
          <TrendingUp className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
          <p className="text-slate-400">
            <strong className="text-slate-200">Derivatives</strong> measure <em>instantaneous</em> rates of change, and limits 
            provide the mathematical machinery to define this "instantaneous" behavior. Understanding limits gives us the basis 
            to understand how functions change.
          </p>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideMLFunctions = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Connecting Functions to ML</h2>
      <h3 className="text-xl text-blue-400 font-medium mb-6">Functions as Models</h3>
      
      <p className="text-slate-300 text-lg leading-relaxed">
        Many machine learning models can be thought of as functions. For example, consider a simple task: 
        predicting a house's price based on its size (square footage).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Input</div>
          <p className="text-white font-medium">House size (e.g., 1500 sq ft)</p>
          <p className="text-blue-300 mt-2 text-sm">Let's call this <MathExpr>x</MathExpr></p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Output</div>
          <p className="text-white font-medium">Predicted price (e.g., $300,000)</p>
          <p className="text-blue-300 mt-2 text-sm">Let's call this <MathExpr>y</MathExpr></p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Model</div>
          <p className="text-white font-medium">The mechanism mapping size to price</p>
          <p className="text-blue-300 mt-2 text-sm">Function <MathExpr>f</MathExpr>, so <MathExpr>y = f(x)</MathExpr></p>
        </div>
      </div>

      <p className="text-slate-300 text-lg leading-relaxed">
        For instance, a very simple linear model might try to capture this relationship using the familiar equation:
      </p>
      <div className="text-center my-8">
        <span className="text-3xl font-serif text-white bg-slate-900 px-8 py-4 rounded-xl border border-slate-800 shadow-lg inline-block">
          y = mx + b
        </span>
      </div>
      <p className="text-slate-300 text-lg leading-relaxed">
        Here, <MathExpr>m</MathExpr> and <MathExpr>b</MathExpr> are <strong>parameters</strong> the model needs to learn 
        from data. More complex models, like neural networks, are just more elaborate, multi-layered functions.
      </p>
    </div>
  </SlideFrame>
);

const SlideMLFoundation = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Limits as the Foundation for Learning</h2>
      <p className="text-slate-300 text-lg mb-10">
        How do we optimize our model's parameters to minimize errors? We use derivatives. And derivatives are defined using limits!
      </p>

      {/* Interactive Flowchart Diagram */}
      <div className="bg-slate-900 py-10 px-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        
        {/* Box 1: Limits */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-5 w-full md:w-1/4 text-center shadow-lg relative z-10">
          <h4 className="font-bold text-white mb-1">Limits</h4>
          <p className="text-xs text-slate-400">(Concept of 'Approaching')</p>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex flex-col items-center text-blue-500 relative z-0">
          <span className="text-[10px] font-semibold tracking-wider uppercase mb-1 whitespace-nowrap">Foundation For</span>
          <ArrowRight className="w-6 h-6" />
        </div>
        <div className="md:hidden flex justify-center text-blue-500 my-2"><ArrowRight className="w-5 h-5 rotate-90" /></div>

        {/* Box 2: Derivatives & Functions */}
        <div className="flex flex-col gap-4 w-full md:w-1/3 z-10">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 text-center shadow-lg relative">
            <Box className="w-4 h-4 absolute top-3 right-3 text-slate-500" />
            <h4 className="font-bold text-white mb-1">Functions</h4>
            <p className="text-xs text-slate-400">Represent Models</p>
            <p className="text-xs font-serif text-blue-400 mt-1">y = f(x)</p>
          </div>
          <div className="bg-slate-800 border-2 border-blue-500/50 rounded-xl p-4 text-center shadow-[0_0_15px_rgba(59,130,246,0.15)] relative">
            <TrendingUp className="w-4 h-4 absolute top-3 right-3 text-blue-400" />
            <h4 className="font-bold text-white mb-1">Derivatives</h4>
            <p className="text-xs text-slate-400">Measure Change</p>
            <p className="text-xs text-slate-500 mt-1">(Built using Limits)</p>
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex flex-col items-center text-green-500 z-0">
          <span className="text-[10px] font-semibold tracking-wider uppercase mb-1 whitespace-nowrap">Guides Process</span>
          <ArrowRight className="w-6 h-6" />
        </div>
        <div className="md:hidden flex justify-center text-green-500 my-2"><ArrowRight className="w-5 h-5 rotate-90" /></div>

        {/* Box 3: Optimization */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-green-500/40 rounded-xl p-5 w-full md:w-1/3 text-center shadow-[0_0_20px_rgba(34,197,94,0.1)] z-10">
          <Target className="w-5 h-5 mx-auto text-green-400 mb-2" />
          <h4 className="font-bold text-white mb-1">Optimization</h4>
          <p className="text-xs text-slate-300">Find Best Parameters</p>
          <p className="text-xs text-slate-500 mt-1">(Guided by Derivatives)</p>
        </div>

      </div>

      <div className="bg-blue-900/10 border-l-2 border-blue-500 pl-6 py-4 space-y-4 rounded-r-lg">
        <p className="text-slate-300"><strong className="text-slate-100">1. Functions</strong> provide the structure for our models.</p>
        <p className="text-slate-300"><strong className="text-slate-100">2. Limits</strong> provide the mathematical foundation needed to precisely define how a function changes.</p>
        <p className="text-slate-300"><strong className="text-slate-100">3. Derivatives</strong> allows us to systematically adjust model parameters to improve performance.</p>
      </div>
    </div>
  </SlideFrame>
);

export default function Limits1() {
  const slides = [
    { component: SlideIntro, title: 'What is a Limit?' },
    { component: SlideIntuition, title: 'Intuition' },
    { component: SlideNotation, title: 'Notation' },
    { component: SlideHole, title: 'Functions with Holes' },
    { component: SlideCoreIdea, title: 'Core Idea' },
    { component: SlideMLFunctions, title: 'Functions in ML' },
    { component: SlideMLFoundation, title: 'Foundation for ML' },
  ];

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
    // 1. `grow shrink-0` makes this container fill the parent `<main>` and prevents it from collapsing.
    // 2. We do NOT use `absolute inset-0` or `overflow-hidden` so that `<main>` in App.jsx handles scrolling perfectly.
    <div className="flex flex-col grow shrink-0 w-full min-h-full bg-[#111111]">
      
      {/* Target the outer main container for pretty custom scrollbars when this component mounts */}
      <style dangerouslySetInnerHTML={{__html: `
        main::-webkit-scrollbar {
          width: 8px;
        }
        main::-webkit-scrollbar-track {
          background: #111111;
        }
        main::-webkit-scrollbar-thumb {
          background-color: #334155;
          border-radius: 10px;
        }
        main::-webkit-scrollbar-thumb:hover {
          background-color: #475569;
        }
      `}} />

      {/* The Slide Area (Natural Flow) */}
      <div className="flex flex-col grow w-full">
        {React.createElement(slides[currentSlide].component)}
      </div>

      {/* Navigation Footer 
          `sticky bottom-0` ensures this tab bar is always anchored to the bottom of the visible screen 
          while scrolling down the content! */}
      <div className="sticky bottom-0 w-full shrink-0 bg-[#111111] border-t border-slate-800 p-4 md:px-8 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.8)] z-50">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex gap-2.5">
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
}