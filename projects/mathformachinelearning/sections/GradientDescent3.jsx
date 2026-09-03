import React, { useState, useEffect } from 'react';
import { 
  Info,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Map,
  Footprints,
  Repeat,
  Crosshair,
  ArrowLeftRight,
  MoveRight,
  MoveLeft,
  Ruler
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
  ReferenceLine
} from 'recharts';

export const meta = {
  title: '3. Gradient Descent Understanding',
  subtitle: 'How derivatives guide optimization',
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

// Standardized Slide Container with flex-grow to work inside App.jsx <main>
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
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Introduction to Gradient Descent</h2>
      <p className="text-slate-300 text-lg leading-relaxed mb-4">
        Finding the minimum point of a cost function is a major goal in training machine learning models. The derivative indicates its slope at any given point. Setting the derivative to zero (<MathExpr>f'(x) = 0</MathExpr>) can help locate potential minimum points analytically.
      </p>
      <p className="text-slate-300 text-lg leading-relaxed mb-6">
        But what happens when the cost function is complex, perhaps involving millions of parameters? Solving <MathExpr>f'(x) = 0</MathExpr> directly becomes computationally infeasible. We need an iterative approach to systematically find the minimum. This is where <strong>Gradient Descent</strong> comes in.
      </p>
      
      <HighlightBox icon={Map} title="The Foggy Mountain Analogy">
        <p className="text-lg mb-4">
          Imagine you're standing on a foggy mountainside and want to get to the lowest point in the valley. You can't see the entire ground, but you can feel the slope beneath your feet. What's the most straightforward strategy?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col items-center text-center gap-3">
            <Activity className="w-8 h-8 text-blue-400" />
            <span className="text-sm"><strong>1. Check the steepness</strong> and direction of the slope where you are currently standing.</span>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col items-center text-center gap-3">
            <Footprints className="w-8 h-8 text-emerald-400" />
            <span className="text-sm"><strong>2. Take a small step</strong> downhill in the steepest direction.</span>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col items-center text-center gap-3">
            <Repeat className="w-8 h-8 text-orange-400" />
            <span className="text-sm"><strong>3. Repeat the process:</strong> check the slope at your new location and take another step downhill.</span>
          </div>
        </div>
      </HighlightBox>

      <p className="text-slate-300 text-lg leading-relaxed mt-6">
        By repeating these steps, you'll gradually make your way down towards the valley floor. Gradient Descent is the exact mathematical equivalent of this process.
      </p>
    </div>
  </SlideFrame>
);

const SlideMathRule = () => (
  <SlideFrame>
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Update Rule</h2>
      <p className="text-slate-300 text-lg leading-relaxed mb-6">
        Let's examine a simple cost function <MathExpr>J(w)</MathExpr>, where <MathExpr>w</MathExpr> represents a parameter we want to optimize. We start with an initial guess, calculate the slope <MathExpr>J'(w)</MathExpr>, and move <em>opposite</em> to the sign of the derivative. We achieve this with a simple update rule:
      </p>

      <div className="bg-slate-900 py-10 px-6 rounded-3xl border border-slate-800 shadow-2xl flex justify-center mb-10">
        <div className="text-3xl md:text-5xl font-serif text-white flex items-center flex-wrap justify-center gap-4">
          <span className="text-blue-400">w<sub className="text-xl">new</sub></span>
          <span>=</span>
          <span className="text-blue-300">w<sub className="text-xl">old</sub></span>
          <span className="text-rose-400 font-bold mx-2">-</span>
          <span className="text-emerald-400">α</span>
          <span>·</span>
          <span className="text-orange-400">J'(w<sub className="text-xl">old</sub>)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-start gap-4">
          <div className="font-serif text-xl text-blue-400 mt-1">w<sub className="text-sm">new</sub></div>
          <div className="text-slate-300 text-sm">The <strong>updated value</strong> of our parameter. This is our new position on the mountain.</div>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-start gap-4">
          <div className="font-serif text-xl text-blue-300 mt-1">w<sub className="text-sm">old</sub></div>
          <div className="text-slate-300 text-sm">The <strong>current value</strong> of our parameter. Where we are standing right now.</div>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-start gap-4">
          <div className="font-serif text-xl text-orange-400 mt-1">J'(w<sub className="text-sm">old</sub>)</div>
          <div className="text-slate-300 text-sm">The <strong>derivative (slope)</strong> calculated at the current value. It tells us which way is uphill.</div>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-start gap-4">
          <div className="font-serif text-2xl text-emerald-400">α</div>
          <div className="text-slate-300 text-sm mt-1">The <strong>learning rate</strong> (alpha). A small positive number that controls how big of a step we take.</div>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideVisualizer = () => {
  const [currentX, setCurrentX] = useState(2.8);
  const [history, setHistory] = useState([2.8]);
  const learningRate = 0.15;

  const takeStep = () => {
    // f(x) = x^2, f'(x) = 2x
    // x_new = x_old - alpha * f'(x_old)
    const derivative = 2 * currentX;
    const nextX = currentX - learningRate * derivative;
    setCurrentX(nextX);
    setHistory([...history, nextX]);
  };

  const reset = () => {
    setCurrentX(2.8);
    setHistory([2.8]);
  };

  // Build the parabola
  const curveData = [];
  for (let i = -3; i <= 3.1; i += 0.1) {
    curveData.push({ x: parseFloat(i.toFixed(1)), y: i * i });
  }

  // Current point and tangent line
  const currentY = currentX * currentX;
  const slope = 2 * currentX;
  
  // Tangent line points (extending a bit from current point)
  const tangentData = [
    { x: currentX - 1, y: slope * ((currentX - 1) - currentX) + currentY },
    { x: currentX + 1, y: slope * ((currentX + 1) - currentX) + currentY }
  ];

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Visualizing the Descent</h2>
        <p className="text-slate-400 text-sm md:text-base mb-6">
          Let's visualize this with a simple cost function <MathExpr>f(x) = x^2</MathExpr>. The derivative is <MathExpr>f'(x) = 2x</MathExpr>. Click "Take Step" to see the math in action.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
          
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-inner space-y-4">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Current Position (x)</div>
                <div className="font-mono text-2xl text-white font-bold">{currentX.toFixed(3)}</div>
              </div>
              <div className="border-t border-slate-800 pt-3">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Cost / Error f(x)</div>
                <div className="font-mono text-xl text-blue-400">{currentY.toFixed(3)}</div>
              </div>
              <div className="border-t border-slate-800 pt-3">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Derivative (Slope)</div>
                <div className="font-mono text-xl text-rose-400">
                  {slope > 0 ? "+" : ""}{slope.toFixed(3)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {slope > 0 ? "Slope is positive (uphill to right)" : "Slope is negative (uphill to left)"}
                </div>
              </div>
              <div className="border-t border-slate-800 pt-3">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Formula</div>
                <div className="font-mono text-sm text-slate-300">
                  x<sub className="text-[10px]">new</sub> = {currentX.toFixed(2)} - (0.15) * ({slope.toFixed(2)})
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={takeStep}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-md transition-all flex justify-center items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" /> Take Step
              </button>
              <button 
                onClick={reset}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold shadow-md transition-all flex justify-center items-center"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-inner flex flex-col min-h-[350px]">
             <div className="w-full h-full min-h-[300px] relative">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" dataKey="x" domain={[-3, 3]} stroke="#94a3b8" />
                    <YAxis type="number" domain={[-1, 10]} stroke="#94a3b8" />
                    
                    {/* The Parabola */}
                    <Line data={curveData} type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={false} />
                    
                    {/* The Tangent Line */}
                    <Line data={tangentData} type="linear" dataKey="y" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" dot={false} isAnimationActive={false} />

                    {/* Step History (Trail) */}
                    <Scatter data={history.map(x => ({x: x, y: x*x}))} fill="#64748b" shape="circle" />
                    
                    {/* Current Point */}
                    <Scatter data={[{x: currentX, y: currentY}]} fill="#f97316" shape="circle" />
                    
                  </ComposedChart>
               </ResponsiveContainer>
               
               {/* Arrow indicating direction */}
               <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none w-full h-full">
                   {currentX > 0.1 && (
                     <div className="absolute flex flex-col items-center text-blue-400" style={{ left: `${50 + (currentX - 0.5)*15}%`, top: `${90 - currentY*8}%` }}>
                       <MoveLeft className="w-6 h-6 animate-pulse"/>
                       <span className="text-[10px] font-bold bg-slate-900/80 px-1 rounded">Move Left (Decrease x)</span>
                     </div>
                   )}
                   {currentX < -0.1 && (
                     <div className="absolute flex flex-col items-center text-blue-400" style={{ left: `${50 + (currentX + 0.5)*15}%`, top: `${90 - currentY*8}%` }}>
                       <MoveRight className="w-6 h-6 animate-pulse"/>
                       <span className="text-[10px] font-bold bg-slate-900/80 px-1 rounded">Move Right (Increase x)</span>
                     </div>
                   )}
               </div>

             </div>
             <div className="text-center mt-2 text-sm text-slate-500">
                Notice how the steps get naturally smaller as the slope flattens out near the minimum!
             </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideDirection = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">How Derivatives Guide the Direction</h2>
      <p className="text-slate-300 text-lg mb-8">
        The objective is to find the minimum. The main part of our update formula is the <strong>minus sign</strong>. It ensures you always move <em>against</em> the gradient.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* Positive Slope Box */}
        <div className="bg-slate-800 p-6 rounded-xl border-t-4 border-t-rose-500 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-rose-400" />
            <h3 className="font-bold text-white text-xl">If Derivative is POSITIVE</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            The slope points uphill to the right. The function is increasing. To go downhill towards the minimum, you need to move to the <strong>left</strong>.
          </p>
          <div className="bg-slate-900 p-3 rounded border border-slate-700 text-sm font-mono text-slate-300">
            x<sub className="text-[10px]">new</sub> = x<sub className="text-[10px]">old</sub> - (+ value)
            <br/>
            <span className="text-rose-400">Result: x decreases (moves left).</span>
          </div>
        </div>

        {/* Negative Slope Box */}
        <div className="bg-slate-800 p-6 rounded-xl border-t-4 border-t-emerald-500 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-white text-xl">If Derivative is NEGATIVE</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            The slope points downhill to the right. The function is decreasing. To continue going downhill towards the minimum, you need to move to the <strong>right</strong>.
          </p>
          <div className="bg-slate-900 p-3 rounded border border-slate-700 text-sm font-mono text-slate-300">
            x<sub className="text-[10px]">new</sub> = x<sub className="text-[10px]">old</sub> - (- value)
            <br/>
            <span className="text-emerald-400">Result: x increases (moves right).</span>
          </div>
        </div>

      </div>

      <HighlightBox icon={Crosshair} title="The Flat Plateau" color="purple">
        <p className="text-[15px]">
          If the derivative <MathExpr>f'(x)</MathExpr> is exactly <strong>zero</strong>, the slope is flat. The formula becomes <MathExpr>x_{"{new}"} = x_{"{old}"} - 0</MathExpr>. Gradient descent stops moving. This suggests you might be at the bottom (a minimum), which is exactly where we want to be!
        </p>
      </HighlightBox>
    </div>
  </SlideFrame>
);

const SlideStepSize = () => {
  const [currentX, setCurrentX] = useState(2.8);
  const learningRate = 0.4; // Exaggerated for visual clarity
  
  const currentY = currentX * currentX;
  const slope = 2 * currentX;
  const stepSize = learningRate * slope;
  const nextX = currentX - stepSize;

  const curveData = [];
  for (let i = -3.5; i <= 3.5; i += 0.1) {
    curveData.push({ x: parseFloat(i.toFixed(1)), y: i * i });
  }

  const tangentData = [
    { x: currentX - 0.8, y: slope * ((currentX - 0.8) - currentX) + currentY },
    { x: currentX + 0.8, y: slope * ((currentX + 0.8) - currentX) + currentY }
  ];

  const stepLineData = [
    { x: currentX, y: 0 },
    { x: nextX, y: 0 }
  ];

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Magnitude & Direction in Action</h2>
        <p className="text-slate-400 text-sm md:text-base mb-6">
          The derivative dictates both <strong>direction</strong> (sign) and <strong>step size</strong> (magnitude). A steeper slope results in a larger step, while a gentle slope results in a smaller step.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg">
              <label className="block text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">
                Position (x): <span className="text-white bg-slate-900 px-2 py-1 rounded">{currentX.toFixed(2)}</span>
              </label>
              <input 
                type="range" 
                min="-3.0" 
                max="3.0" 
                step="0.1" 
                value={currentX} 
                onChange={(e) => setCurrentX(parseFloat(e.target.value))} 
                className="w-full accent-blue-500"
              />
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <ArrowLeftRight className="w-3 h-3" /> Slide past zero to see direction change
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-inner space-y-4">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Slope f'(x)</div>
                <div className="font-mono text-2xl text-blue-400 font-bold">{slope > 0 ? "+" : ""}{slope.toFixed(2)}</div>
                
                {/* Dynamic text based on position */}
                <div className="text-[12px] text-slate-300 mt-2 leading-relaxed bg-slate-800/50 p-3 rounded border border-slate-700 min-h-[90px] flex items-center">
                  {slope > 0.01 ? (
                    <span>If derivative is <strong>positive</strong>, the function is increasing. To go downhill towards the minimum, you move left (<strong>decrease x</strong>).</span>
                  ) : slope < -0.01 ? (
                    <span>If derivative is <strong>negative</strong>, the function is decreasing. To continue downhill, you move right (<strong>increase x</strong>).</span>
                  ) : (
                    <span className="text-purple-400 font-bold">If derivative is <strong>zero</strong>, the slope is flat. Gradient descent stops here (minimum).</span>
                  )}
                </div>
              </div>
              <div className="border-t border-slate-800 pt-3">
                <div className="text-xs text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Ruler className="w-4 h-4" /> Calculated Step Size
                </div>
                <div className="font-mono text-2xl text-emerald-400 font-bold">{Math.abs(stepSize).toFixed(2)}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {Math.abs(slope) > 4 ? "Very steep slope = Large step magnitude." : Math.abs(slope) > 1 ? "Moderate slope = Medium step magnitude." : "Gentle slope = Small step magnitude."}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-inner flex flex-col min-h-[350px]">
             <div className="w-full h-full min-h-[300px] relative">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis type="number" dataKey="x" domain={[-3.5, 3.5]} stroke="#94a3b8" />
                    <YAxis type="number" domain={[-1, 10]} stroke="#94a3b8" />
                    
                    {/* The Parabola */}
                    <Line data={curveData} type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={false} />
                    
                    {/* The Tangent Line indicating steepness */}
                    <Line data={tangentData} type="linear" dataKey="y" stroke="#f43f5e" strokeWidth={2} dot={false} isAnimationActive={false} />
                    
                    {/* Dropdown line from point to axis */}
                    <ReferenceLine x={currentX} stroke="#64748b" strokeDasharray="3 3" />
                    <ReferenceLine x={nextX} stroke="#10b981" strokeDasharray="3 3" />

                    {/* Step Size Line on X-axis */}
                    <Line data={stepLineData} type="linear" dataKey="y" stroke="#10b981" strokeWidth={8} dot={false} isAnimationActive={false} />

                    {/* Start and End Points */}
                    <Scatter data={[{x: currentX, y: currentY}]} fill="#f43f5e" shape="circle" />
                    <Scatter data={[{x: currentX, y: 0}]} fill="#64748b" shape="circle" />
                    {Math.abs(slope) > 0.01 && <Scatter data={[{x: nextX, y: 0}]} fill="#10b981" shape="circle" />}
                  </ComposedChart>
               </ResponsiveContainer>
             </div>
             <div className="text-center mt-2 text-sm text-slate-500">
                The thick green line on the axis shows the size and direction of the step. Slide left and right to see it adapt!
             </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

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

      {/* Navigation Footer (Sticky to bottom) */}
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

export default function GradientDescentUnderstanding() {
  const slides = [
    { component: SlideIntro, title: 'Introduction' },
    { component: SlideMathRule, title: 'The Update Rule' },
    { component: SlideDirection, title: 'Following the Gradient' },
    { component: SlideStepSize, title: 'Step Magnitude' },
    { component: SlideVisualizer, title: 'Interactive Descent' },
  ];

  return <Slideshow slides={slides} />;
}