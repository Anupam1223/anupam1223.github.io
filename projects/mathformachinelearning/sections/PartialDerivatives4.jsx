import React, { useState, useEffect } from 'react';
import { 
  Info,
  TrendingUp,
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Home,
  Box,
  Layers,
  Calculator,
  Grid3X3,
  Network,
  Target,
  Map,
  Snowflake,
  FileText,
  Compass,
  Type
} from 'lucide-react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';

export const meta = {
  title: '4. Partial Derivatives (Part 1)',
  subtitle: 'Functions of Multiple Variables',
};

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

const SlideFrame = ({ children }) => (
  <div className="flex flex-col h-full px-6 py-8 md:px-12 md:py-10 bg-[#111111] text-slate-200">
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {children}
    </div>
  </div>
);

const SlideIntro = () => {
  const curveData = [];
  for (let i = -5; i <= 5; i += 0.5) {
    curveData.push({ x: i, y: i * i });
  }

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Functions of Multiple Variables</h2>
        
        <p className="text-slate-300 text-lg leading-relaxed mb-6">
          Up until now, we've looked at <strong>single-variable functions</strong> like <MathExpr>f(x) = x^2</MathExpr> or <MathExpr>f(x) = 3x + 5</MathExpr>. They take one input (<MathExpr>x</MathExpr>) and produce one output. You can easily visualize them as a curve on a 2D graph.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg flex flex-col">
            <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Single Variable
            </h3>
            <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700 mb-6 font-mono text-sm">
              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Input: x</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="text-slate-300">f(x) = x²</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Output: y</span>
            </div>
            
            <div className="flex-grow w-full min-h-[200px] bg-slate-900/50 rounded-xl border border-slate-700/50">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" dataKey="x" domain={[-5, 5]} stroke="#94a3b8" />
                  <YAxis type="number" domain={[0, 25]} stroke="#94a3b8" />
                  <Line data={curveData} type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg flex flex-col">
            <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5" /> Multiple Variables
            </h3>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Many scenarios, especially in machine learning, involve more than one influencing factor. Think about predicting a house's price:
            </p>
            
            <div className="flex-grow flex flex-col justify-center gap-4 relative">
               <div className="absolute inset-y-0 left-[20%] w-0.5 bg-slate-700 z-0"></div>
               
               <div className="flex items-center gap-4 z-10">
                 <div className="bg-blue-500/20 text-blue-400 px-3 py-2 rounded-lg border border-blue-500/30 text-sm font-mono shadow-md">Size (sq ft)</div>
                 <ArrowRight className="w-5 h-5 text-slate-500" />
               </div>
               <div className="flex items-center gap-4 z-10">
                 <div className="bg-blue-500/20 text-blue-400 px-3 py-2 rounded-lg border border-blue-500/30 text-sm font-mono shadow-md">Bedrooms</div>
                 <ArrowRight className="w-5 h-5 text-slate-500" />
                 <div className="bg-purple-600 text-white p-4 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] flex flex-col items-center gap-1 border border-purple-500">
                    <Home className="w-6 h-6" />
                    <span className="font-bold text-sm">Model f(...)</span>
                 </div>
                 <ArrowRight className="w-5 h-5 text-emerald-500" />
                 <div className="bg-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg border border-emerald-500/30 font-bold shadow-md text-center">
                    Price<br/><span className="text-xs font-mono font-normal">($ Output)</span>
                 </div>
               </div>
               <div className="flex items-center gap-4 z-10">
                 <div className="bg-blue-500/20 text-blue-400 px-3 py-2 rounded-lg border border-blue-500/30 text-sm font-mono shadow-md">Age (years)</div>
                 <ArrowRight className="w-5 h-5 text-slate-500" />
               </div>
            </div>

            <p className="text-xs text-slate-500 mt-4 text-center">Each of these is an <strong>independent input variable</strong>.</p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideDefining = () => {
  const [x1, setX1] = useState(3);
  const [y1, setY1] = useState(-1);

  const [w, setW] = useState(2);
  const [b, setB] = useState(3);

  const res1 = Math.pow(x1, 2) + Math.pow(y1, 2);
  const res2 = Math.pow((w * 5 + b - 12), 2);

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Defining Multivariable Functions</h2>
        
        <p className="text-slate-300 text-lg leading-relaxed mb-6">
          A function of multiple variables maps a set of input values to a single output value. We write this as <MathExpr>z = f(x, y)</MathExpr> for two variables, or <MathExpr>y_{"{output}"} = f(x_1, x_2, ..., x_n)</MathExpr> for <MathExpr>n</MathExpr> variables. The inputs are <strong>independent variables</strong>, and the output is the <strong>dependent variable</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col">
            <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" /> Example 1: f(x,y)
            </h3>
            <div className="text-center mb-6">
              <span className="font-serif text-2xl text-white bg-slate-800 px-6 py-3 rounded-xl border border-slate-700 inline-block shadow-inner">
                f(x, y) = x² + y²
              </span>
            </div>
            
            <div className="space-y-4 flex-grow bg-slate-800/50 p-4 rounded-xl border border-slate-700">
               <div className="flex items-center gap-4">
                 <label className="text-slate-400 text-sm w-8">x =</label>
                 <input type="range" min="-5" max="5" value={x1} onChange={(e) => setX1(parseInt(e.target.value))} className="w-full accent-blue-500" />
                 <span className="font-mono text-white w-6">{x1}</span>
               </div>
               <div className="flex items-center gap-4">
                 <label className="text-slate-400 text-sm w-8">y =</label>
                 <input type="range" min="-5" max="5" value={y1} onChange={(e) => setY1(parseInt(e.target.value))} className="w-full accent-blue-500" />
                 <span className="font-mono text-white w-6">{y1}</span>
               </div>
               
               <div className="mt-6 pt-4 border-t border-slate-700">
                 <div className="font-mono text-sm text-slate-300 flex flex-col gap-2">
                   <span>f({x1}, {y1}) = ({x1})² + ({y1})²</span>
                   <span>f({x1}, {y1}) = {Math.pow(x1, 2)} + {Math.pow(y1, 2)}</span>
                   <span className="text-xl text-emerald-400 font-bold mt-2">Output = {res1}</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col">
            <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" /> Example 2: Machine Learning Error
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Here, <MathExpr>w</MathExpr> and <MathExpr>b</MathExpr> are model parameters. <MathExpr>5</MathExpr> is an input feature, and <MathExpr>12</MathExpr> is the true target value. This function calculates the squared error.
            </p>
            <div className="text-center mb-6">
              <span className="font-serif text-xl md:text-2xl text-white bg-slate-800 px-4 py-3 rounded-xl border border-slate-700 inline-block shadow-inner overflow-x-auto whitespace-nowrap max-w-full">
                g(w, b) = (w · 5 + b - 12)²
              </span>
            </div>
            
            <div className="space-y-4 flex-grow bg-slate-800/50 p-4 rounded-xl border border-slate-700">
               <div className="flex items-center gap-4">
                 <label className="text-slate-400 text-sm w-8">w =</label>
                 <input type="range" min="-5" max="5" value={w} onChange={(e) => setW(parseInt(e.target.value))} className="w-full accent-purple-500" />
                 <span className="font-mono text-white w-6">{w}</span>
               </div>
               <div className="flex items-center gap-4">
                 <label className="text-slate-400 text-sm w-8">b =</label>
                 <input type="range" min="-5" max="5" value={b} onChange={(e) => setB(parseInt(e.target.value))} className="w-full accent-purple-500" />
                 <span className="font-mono text-white w-6">{b}</span>
               </div>
               
               <div className="mt-6 pt-4 border-t border-slate-700">
                 <div className="font-mono text-sm text-slate-300 flex flex-col gap-2">
                   <span>g({w}, {b}) = ({w} · 5 + {b} - 12)²</span>
                   <span>g({w}, {b}) = ({w * 5} + {b} - 12)²</span>
                   <span>g({w}, {b}) = ({w * 5 + b - 12})²</span>
                   <span className="text-xl text-rose-400 font-bold mt-2">Error = {res2}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideVisualizing3D = () => {
  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Visualizing Functions of Multiple Variables</h2>
        <p className="text-slate-300 text-lg leading-relaxed mb-6">
          Since we have two inputs (<MathExpr>x</MathExpr>, <MathExpr>y</MathExpr>) and one output (<MathExpr>z</MathExpr>), we need <strong>three dimensions</strong> to plot the function <MathExpr>z = x^2 + y^2</MathExpr>. Plotting these combinations creates a <strong>surface</strong> in 3D space.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
            <h3 className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-widest z-20">The Paraboloid Surface</h3>
            
            <svg viewBox="0 0 400 400" className="w-full h-full max-w-[400px] z-10 relative">
              <g stroke="#334155" strokeWidth="1" opacity="0.5">
                {[...Array(11)].map((_, i) => (
                   <line key={`x-${i}`} x1={200 - 150 + (i*15)} y1={250 + 75 - (i*7.5)} x2={200 + 150 + (i*15)} y2={250 - 75 - (i*7.5)} />
                ))}
                {[...Array(11)].map((_, i) => (
                   <line key={`y-${i}`} x1={200 - 150 + (i*15)} y1={250 - 75 + (i*7.5)} x2={200 + 150 + (i*15)} y2={250 + 75 + (i*7.5)} />
                ))}
              </g>

              <line x1="200" y1="250" x2="200" y2="50" stroke="#94a3b8" strokeWidth="2" />
              <text x="185" y="60" fill="#94a3b8" fontSize="12" fontFamily="monospace">z</text>
              <text x="360" y="270" fill="#94a3b8" fontSize="12" fontFamily="monospace">y</text>
              <text x="40" y="270" fill="#94a3b8" fontSize="12" fontFamily="monospace">x</text>
              
              <g fill="none" strokeWidth="2">
                <ellipse cx="200" cy="230" rx="20" ry="10" stroke="#3b82f6" opacity="0.3" />
                <ellipse cx="200" cy="200" rx="40" ry="20" stroke="#3b82f6" opacity="0.5" />
                <ellipse cx="200" cy="160" rx="60" ry="30" stroke="#3b82f6" opacity="0.7" />
                <ellipse cx="200" cy="110" rx="80" ry="40" stroke="#60a5fa" opacity="0.9" />
                <ellipse cx="200" cy="50" rx="100" ry="50" stroke="#93c5fd" opacity="1.0" />
                
                <path d="M 100 50 Q 200 350 300 50" stroke="#60a5fa" strokeWidth="3" opacity="0.8" />
                <path d="M 120 110 Q 200 320 280 110" stroke="#3b82f6" strokeWidth="2" opacity="0.6" />
                <path d="M 160 200 Q 200 280 240 200" stroke="#1d4ed8" strokeWidth="2" opacity="0.4" />
              </g>

              <circle cx="200" cy="250" r="4" fill="#f43f5e" />
              <text x="210" y="265" fill="#f43f5e" fontSize="12" fontWeight="bold">Minimum at (0,0)</text>
            </svg>
          </div>

          <div className="flex flex-col gap-6 justify-center">
             <HighlightBox icon={Box} title="The Z-Axis Height" color="blue">
                <p className="text-sm">
                  We can imagine an <strong>xy-plane</strong> representing the possible input combinations on the floor. For each point <MathExpr>(x, y)</MathExpr> on that floor, the function <MathExpr>f(x, y)</MathExpr> calculates a height <MathExpr>z</MathExpr>. 
                </p>
             </HighlightBox>

             <HighlightBox icon={Grid3X3} title="The Paraboloid" color="purple">
                <p className="text-[15px] mb-2">
                  The function <MathExpr>f(x, y) = x^2 + y^2</MathExpr> describes a bowl shape opening upwards. 
                </p>
                <p className="text-[14px] text-slate-400">
                  Because any number squared is positive (or zero), the lowest this bowl can ever get is when both <MathExpr>x = 0</MathExpr> and <MathExpr>y = 0</MathExpr>. 
                  <br/><br/>
                  <MathExpr>f(0, 0) = 0^2 + 0^2 = 0</MathExpr>. This is the global minimum!
                </p>
             </HighlightBox>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideBeyond3D = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Beyond 3 Dimensions</h2>
      <p className="text-slate-300 text-lg mb-8">
        What about functions with more than two inputs? Visualizing <MathExpr>f(x_1, x_2, x_3)</MathExpr> would require <strong>4 dimensions</strong> (3 for input, 1 for output). 
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center min-h-[120px]">
          <div className="w-16 h-1 bg-blue-500 mb-3"></div>
          <span className="font-bold text-white">1D (Line)</span>
          <span className="text-xs text-slate-400">f(x) input</span>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center min-h-[120px]">
          <div className="w-12 h-12 border-2 border-emerald-500 mb-3 transform skew-x-12"></div>
          <span className="font-bold text-white">2D (Plane)</span>
          <span className="text-xs text-slate-400">f(x,y) input</span>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center min-h-[120px]">
          <Box className="w-12 h-12 text-purple-500 mb-3" strokeWidth={1.5} />
          <span className="font-bold text-white">3D (Space)</span>
          <span className="text-xs text-slate-400">f(x,y,z) input</span>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)] flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden">
          <Network className="w-12 h-12 text-rose-400 mb-3 animate-pulse" />
          <span className="font-bold text-white">4D+ (Hyperspace)</span>
          <span className="text-xs text-slate-400">Our brains melt</span>
        </div>
      </div>

      <div className="bg-slate-900 border-l-4 border-blue-500 rounded-r-xl p-8 shadow-lg text-lg flex items-start gap-6">
        <Info className="w-8 h-8 text-blue-400 shrink-0 mt-1" />
        <div>
          <p className="text-slate-200 leading-relaxed mb-4">
            And a general function <MathExpr>f(x_1, \dots, x_n)</MathExpr> would require <MathExpr>n + 1</MathExpr> dimensions. Our brains aren't equipped to directly visualize spaces with more than three dimensions!
          </p>
          <p className="text-blue-300 font-semibold text-[15px]">
            However, the <em>mathematical concepts</em> we develop work just fine in higher dimensions. Even if we can't draw a picture of a cost function that depends on thousands of model parameters, we can still analyze how the cost changes when we adjust those parameters.
          </p>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideHillsideAnalogy = () => {
  const [direction, setDirection] = useState('x');

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Core Idea: The Hillside Analogy</h2>
        <p className="text-slate-300 text-lg leading-relaxed mb-6">
          When we have a function like <MathExpr>f(x, y)</MathExpr>, we often want to know: how does the output change if we <em>only</em> adjust <MathExpr>x</MathExpr>, keeping <MathExpr>y</MathExpr> fixed?
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          <div className="flex flex-col gap-6">
             <HighlightBox icon={Map} title="Standing on a Hill" color="emerald">
                <p className="text-[15px] mb-4">
                  Imagine you're standing on a hillside. Your altitude (<MathExpr>z</MathExpr>) depends on your position in two directions: how far East you are (<MathExpr>x</MathExpr>) and how far North you are (<MathExpr>y</MathExpr>).
                </p>
                <p className="text-[15px]">
                  If you want to know how steep the hill is <em>specifically in the East direction</em>, you only look at your change in altitude as you move East/West, without moving North/South. You treat the North/South position as a constant.
                </p>
             </HighlightBox>

             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
               <h4 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                 <Compass className="w-5 h-5 text-blue-400"/> Choose a Direction
               </h4>
               <div className="flex gap-4">
                 <button 
                   onClick={() => setDirection('x')}
                   className={`flex-1 py-3 rounded-lg font-bold transition-all border ${direction === 'x' ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                 >
                   Move East (Change x)
                 </button>
                 <button 
                   onClick={() => setDirection('y')}
                   className={`flex-1 py-3 rounded-lg font-bold transition-all border ${direction === 'y' ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                 >
                   Move North (Change y)
                 </button>
               </div>
             </div>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
            <svg viewBox="0 0 300 300" className="w-full h-full max-w-[300px] relative z-10">
              <g stroke="#334155" strokeWidth="2" opacity="0.5">
                {[...Array(9)].map((_, i) => (
                   <line key={`gx-${i}`} x1={50 + (i*25)} y1="50" x2={50 + (i*25)} y2="250" />
                ))}
                {[...Array(9)].map((_, i) => (
                   <line key={`gy-${i}`} x1="50" y1={50 + (i*25)} x2="250" y2={50 + (i*25)} />
                ))}
              </g>

              <text x="150" y="275" fill="#94a3b8" fontSize="14" textAnchor="middle" fontWeight="bold">East (x)</text>
              <text x="25" y="150" fill="#94a3b8" fontSize="14" textAnchor="middle" transform="rotate(-90 25 150)" fontWeight="bold">North (y)</text>

              <circle cx="150" cy="150" r="6" fill="#f43f5e" className="z-20" />

              {direction === 'x' && (
                <g className="animate-in fade-in duration-500">
                  <line x1="50" y1="150" x2="250" y2="150" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
                  <path d="M 240 140 L 255 150 L 240 160" fill="#3b82f6" />
                  <path d="M 60 140 L 45 150 L 60 160" fill="#3b82f6" />
                  <text x="150" y="135" fill="#3b82f6" fontSize="12" textAnchor="middle" fontWeight="bold">Measuring slope along X</text>
                  <text x="150" y="170" fill="#94a3b8" fontSize="11" textAnchor="middle">(Y is locked at a constant value)</text>
                </g>
              )}

              {direction === 'y' && (
                <g className="animate-in fade-in duration-500">
                  <line x1="150" y1="50" x2="150" y2="250" stroke="#10b981" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
                  <path d="M 140 60 L 150 45 L 160 60" fill="#10b981" />
                  <path d="M 140 240 L 150 255 L 160 240" fill="#10b981" />
                  <text x="165" y="100" fill="#10b981" fontSize="12" fontWeight="bold">Measuring</text>
                  <text x="165" y="115" fill="#10b981" fontSize="12" fontWeight="bold">slope along Y</text>
                  <text x="80" y="150" fill="#94a3b8" fontSize="11" transform="rotate(-90 80 150)" textAnchor="middle">(X is locked at constant)</text>
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideFreezeProcess = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">The Process: Freeze and Differentiate</h2>
      <p className="text-slate-300 text-lg mb-8">
        Calculating partial derivatives involves treating other variables as constants. If you are comfortable calculating derivatives for single-variable functions, you already possess most of the required skills!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-xl border-t-4 border-t-blue-500 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-blue-500/10"><Target className="w-32 h-32" /></div>
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 border border-blue-500/50">
            <span className="font-bold text-blue-400 text-lg">1</span>
          </div>
          <h3 className="font-bold text-white text-xl mb-3">Identify Target</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Determine which variable you are differentiating <em>with respect to</em>. For example, if you are looking for the rate of change along the x-axis, your target variable is <MathExpr>x</MathExpr>.
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border-t-4 border-t-emerald-500 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-emerald-500/10"><Snowflake className="w-32 h-32" /></div>
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4 border border-emerald-500/50">
            <span className="font-bold text-emerald-400 text-lg">2</span>
          </div>
          <h3 className="font-bold text-white text-xl mb-3">Freeze Others</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Mentally (or literally, if it helps) replace all other variables in the function with fixed constants. Treat them exactly as if they were numbers like 5, -2, or <MathExpr>\pi</MathExpr>.
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border-t-4 border-t-orange-500 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-orange-500/10"><Calculator className="w-32 h-32" /></div>
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 border border-orange-500/50">
            <span className="font-bold text-orange-400 text-lg">3</span>
          </div>
          <h3 className="font-bold text-white text-xl mb-3">Differentiate</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Apply the standard differentiation rules (Power Rule, Constant Rule, Sum Rule) <em>only</em> with respect to your target variable. Remember that the derivative of any constant term is zero!
          </p>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideExamplePolynomial = () => {
  const [target, setTarget] = useState('x');

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Example 1: A Simple Polynomial</h2>
        <p className="text-slate-300 text-lg mb-6">
          Let's find the partial derivatives of <MathExpr>f(x, y) = x^2 + y^3 + 4</MathExpr>.
        </p>

        <div className="bg-slate-800 border border-slate-700 p-2 rounded-xl flex gap-2 w-full max-w-md mx-auto mb-8 shadow-inner">
          <button 
            onClick={() => setTarget('x')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${target === 'x' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
          >
            Partial w.r.t 'x'
          </button>
          <button 
            onClick={() => setTarget('y')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${target === 'y' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
          >
            Partial w.r.t 'y'
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-8 flex flex-col items-center justify-center text-center">
             <span className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-6 border-b border-slate-700 pb-2">The Function</span>
             
             <div className="text-4xl md:text-5xl font-serif flex items-center gap-4 mb-10 transition-all duration-300">
               <span className={target === 'x' ? 'text-blue-400 scale-110 font-bold' : 'text-slate-500 opacity-50'}>x²</span>
               <span className="text-slate-400">+</span>
               <span className={target === 'y' ? 'text-emerald-400 scale-110 font-bold' : 'text-slate-500 opacity-50 relative'}>
                  y³
                  {target === 'x' && <Snowflake className="absolute -top-4 -right-4 w-5 h-5 text-cyan-200 opacity-80" />}
               </span>
               <span className="text-slate-400">+</span>
               <span className="text-slate-500 opacity-50 relative">
                  4
                  <Snowflake className="absolute -top-4 -right-4 w-4 h-4 text-cyan-200 opacity-80" />
               </span>
             </div>

             <ArrowRight className="w-8 h-8 text-slate-600 mb-8 rotate-90 md:rotate-0" />

             <span className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-4 border-b border-slate-700 pb-2">Resulting Derivative</span>
             <div className="text-3xl md:text-4xl font-serif text-white">
                {target === 'x' ? (
                  <span className="animate-in fade-in slide-in-from-bottom-2"><span className="text-blue-400">2x</span> + 0 + 0 = <span className="text-blue-400 font-bold">2x</span></span>
                ) : (
                  <span className="animate-in fade-in slide-in-from-bottom-2">0 + <span className="text-emerald-400">3y²</span> + 0 = <span className="text-emerald-400 font-bold">3y²</span></span>
                )}
             </div>
          </div>

          <div className="flex flex-col justify-center space-y-6">
             {target === 'x' ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h4 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2"><Target className="w-5 h-5"/> Target Variable: x</h4>
                  <ul className="space-y-4 text-slate-300 text-sm leading-relaxed">
                    <li><strong className="text-white">Treat 'y' as a constant:</strong> This means <MathExpr>y^3</MathExpr> is treated entirely as a constant number. The number 4 is already a constant.</li>
                    <li><strong className="text-white">Differentiate x²:</strong> Using the power rule, the derivative of <MathExpr>x^2</MathExpr> is <MathExpr>2x</MathExpr>.</li>
                    <li><strong className="text-white">Differentiate constants:</strong> The derivative of <MathExpr>y^3</MathExpr> is 0. The derivative of 4 is 0.</li>
                  </ul>
                </div>
             ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2"><Target className="w-5 h-5"/> Target Variable: y</h4>
                  <ul className="space-y-4 text-slate-300 text-sm leading-relaxed">
                    <li><strong className="text-white">Treat 'x' as a constant:</strong> This means <MathExpr>x^2</MathExpr> is treated entirely as a constant number.</li>
                    <li><strong className="text-white">Differentiate y³:</strong> Using the power rule, the derivative of <MathExpr>y^3</MathExpr> is <MathExpr>3y^2</MathExpr>.</li>
                    <li><strong className="text-white">Differentiate constants:</strong> The derivative of <MathExpr>x^2</MathExpr> is 0. The derivative of 4 is 0.</li>
                  </ul>
                </div>
             )}
             
             <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-slate-500 text-sm text-slate-400 italic mt-4">
               Notice how the process isolates the effect of changing only one variable. When calculating with respect to x, the y³ term vanishes entirely because from x's perspective, y isn't changing!
             </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideExampleMultiplied = () => {
  const [target, setTarget] = useState('w');

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Example 2: Variables Multiplied Together</h2>
        <p className="text-slate-300 text-lg mb-6">
          Let's look at a function structure often seen with model weights and biases: <MathExpr>g(w, b) = w^2b + 5w - 2b + 7</MathExpr>.
        </p>

        <div className="bg-slate-800 border border-slate-700 p-2 rounded-xl flex gap-2 w-full max-w-md mx-auto mb-8 shadow-inner">
          <button 
            onClick={() => setTarget('w')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${target === 'w' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
          >
            Partial w.r.t 'w'
          </button>
          <button 
            onClick={() => setTarget('b')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${target === 'b' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
          >
            Partial w.r.t 'b'
          </button>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 md:p-8 flex flex-col items-center">
          <div className="text-2xl md:text-4xl font-serif flex items-center justify-center flex-wrap gap-x-4 gap-y-6 mb-10 transition-all duration-300">
             <div className="flex items-center bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 shadow-inner">
               <span className={target === 'w' ? 'text-purple-400 font-bold' : 'text-slate-500'}>w²</span>
               <span className="text-slate-600 mx-1">·</span>
               <span className={target === 'b' ? 'text-orange-400 font-bold' : 'text-cyan-200 opacity-70'}>
                 b
                 {target === 'w' && <span className="text-[10px] absolute -top-4 left-1/2 transform -translate-x-1/2 text-cyan-200 uppercase tracking-widest font-sans">Coeff</span>}
               </span>
             </div>

             <span className="text-slate-400">+</span>

             <div className="flex items-center bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 shadow-inner">
               <span className="text-slate-500">5</span>
               <span className={target === 'w' ? 'text-purple-400 font-bold' : 'text-slate-600 opacity-50 line-through decoration-rose-500 decoration-2'}>w</span>
             </div>

             <span className="text-slate-400">-</span>

             <div className="flex items-center bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 shadow-inner">
               <span className="text-slate-500">2</span>
               <span className={target === 'b' ? 'text-orange-400 font-bold' : 'text-slate-600 opacity-50 line-through decoration-rose-500 decoration-2'}>b</span>
             </div>

             <span className="text-slate-400">+</span>

             <div className="flex items-center bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 shadow-inner relative">
               <span className="text-slate-500 opacity-50 line-through decoration-rose-500 decoration-2">7</span>
               <Snowflake className="absolute -top-3 -right-3 w-4 h-4 text-cyan-200 opacity-50" />
             </div>
          </div>

          <div className="w-full max-w-2xl bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
            {target === 'w' ? (
               <div className="animate-in fade-in duration-500 space-y-4">
                 <h4 className="text-lg font-bold text-purple-400 border-b border-slate-700 pb-2 mb-4">Differentiating with respect to w:</h4>
                 <p className="text-sm text-slate-300">
                   <strong>Term <MathExpr>w^2b</MathExpr>:</strong> <MathExpr>b</MathExpr> acts as a constant coefficient (like a 5). Derivative of <MathExpr>w^2</MathExpr> is <MathExpr>2w</MathExpr>, so the term becomes <MathExpr>(2w) \cdot b = 2wb</MathExpr>.
                 </p>
                 <p className="text-sm text-slate-300">
                   <strong>Term <MathExpr>5w</MathExpr>:</strong> Becomes <MathExpr>5</MathExpr>.
                 </p>
                 <p className="text-sm text-slate-300">
                   <strong>Terms <MathExpr>-2b</MathExpr> and <MathExpr>7</MathExpr>:</strong> Both are pure constants with no <MathExpr>w</MathExpr>, so their derivatives are <MathExpr>0</MathExpr>.
                 </p>
                 <div className="mt-4 pt-4 border-t border-slate-700 text-center font-serif text-2xl text-white">
                   Result: <span className="text-purple-400 font-bold">2wb + 5</span>
                 </div>
               </div>
            ) : (
               <div className="animate-in fade-in duration-500 space-y-4">
                 <h4 className="text-lg font-bold text-orange-400 border-b border-slate-700 pb-2 mb-4">Differentiating with respect to b:</h4>
                 <p className="text-sm text-slate-300">
                   <strong>Term <MathExpr>w^2b</MathExpr>:</strong> <MathExpr>w^2</MathExpr> acts as a constant coefficient (like an <MathExpr>a</MathExpr> in <MathExpr>ab</MathExpr>). Derivative of <MathExpr>b</MathExpr> is 1, so the term becomes <MathExpr>w^2 \cdot 1 = w^2</MathExpr>.
                 </p>
                 <p className="text-sm text-slate-300">
                   <strong>Term <MathExpr>-2b</MathExpr>:</strong> Becomes <MathExpr>-2</MathExpr>.
                 </p>
                 <p className="text-sm text-slate-300">
                   <strong>Terms <MathExpr>5w</MathExpr> and <MathExpr>7</MathExpr>:</strong> Both are pure constants with no <MathExpr>b</MathExpr>, so their derivatives are <MathExpr>0</MathExpr>.
                 </p>
                 <div className="mt-4 pt-4 border-t border-slate-700 text-center font-serif text-2xl text-white">
                   Result: <span className="text-orange-400 font-bold">w² - 2</span>
                 </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideNotation = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Partial Derivative Notation</h2>
      <p className="text-slate-300 text-lg mb-8">
        Because functions of multiple variables have more than one input, we must specify the exact variable for differentiation using special notation.
      </p>

      <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl mb-8 flex flex-col md:flex-row items-center gap-8">
        <div className="text-[120px] font-serif leading-none text-blue-500 bg-slate-800 w-40 h-40 flex items-center justify-center rounded-2xl border border-slate-700 shadow-inner shrink-0">
          ∂
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">The "Del" Symbol</h3>
          <p className="text-slate-300 leading-relaxed">
            To distinguish partial derivatives from the ordinary derivatives (<MathExpr>d</MathExpr>), we use the curly symbol <MathExpr>\partial</MathExpr>. It is often called "curly d", "del", or simply "partial". It signals that we are holding other variables constant.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <h4 className="font-bold text-blue-400 text-lg mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
            <FileText className="w-5 h-5"/> Leibniz-Style Notation
          </h4>
          <div className="flex justify-center items-center font-serif text-4xl text-white py-6">
            <div className="flex flex-col items-center">
              <span className="border-b-2 border-white px-2 pb-1">∂f</span>
              <span className="px-2 pt-1">∂x</span>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Reads as "the partial derivative of <MathExpr>f</MathExpr> with respect to <MathExpr>x</MathExpr>". Explicitly states the function on top and the target variable on the bottom.
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <h4 className="font-bold text-emerald-400 text-lg mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
            <Type className="w-5 h-5"/> Subscript Notation
          </h4>
          <div className="flex justify-center items-center font-serif text-4xl text-white py-6 h-[116px]">
             f<sub className="text-2xl text-emerald-400 font-bold ml-1">x</sub>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            A more compact notation. The subscript indicates the variable of differentiation. Very convenient when writing out long mathematical equations like the Gradient vector!
          </p>
        </div>
      </div>

      <div className="mt-6 bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center">
        <p className="text-slate-400 text-sm">
          If we want to evaluate the partial derivative at a specific point <MathExpr>(x_0, y_0)</MathExpr>, we use the vertical bar: 
          <br/><br/>
          <span className="font-serif text-2xl text-white">
            <span className="inline-flex flex-col items-center align-middle mr-1"><span className="border-b border-white px-1">∂f</span><span>∂x</span></span>
            <span className="border-l-2 border-slate-500 h-10 inline-block align-middle mx-1"></span>
            <sub className="text-sm text-slate-400 align-bottom">(x₀, y₀)</sub>
          </span>
        </p>
      </div>
    </div>
  </SlideFrame>
);

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
    <div className="flex flex-col h-full bg-[#111111] overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {React.createElement(slides[currentSlide].component)}
      </div>

      <div className="bg-[#111111] border-t border-slate-800 p-4 md:px-8 flex justify-between items-center shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
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

export default function PartialDerivatives4() {
  const slides = [
    { component: SlideIntro, title: 'Multiple Variables' },
    { component: SlideDefining, title: 'Defining Functions' },
    { component: SlideVisualizing3D, title: 'Visualizing 3D' },
    { component: SlideBeyond3D, title: 'Beyond 3D' },
    { component: SlideHillsideAnalogy, title: 'The Core Idea' },
    { component: SlideFreezeProcess, title: 'The Process' },
    { component: SlideExamplePolynomial, title: 'Example 1: Sums' },
    { component: SlideExampleMultiplied, title: 'Example 2: Products' },
    { component: SlideNotation, title: 'Notation' }
  ];

  return <Slideshow slides={slides} />;
}