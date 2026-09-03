import React, { useState, useEffect } from 'react';
import { 
  Info,
  ChevronLeft,
  ChevronRight,
  Maximize,
  BarChart2,
  Activity,
  ArrowRight,
  Crosshair,
  Waves,
  Target,
  Brain,
  Zap,
  SplitSquareHorizontal,
  Scale,
  ListChecks,
  HelpCircle,
  CheckSquare,
  Calculator,
  Terminal,
  Code
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
  ReferenceArea,
  ReferenceLine,
  Line
} from 'recharts';

export const meta = {
  title: '10. Continuous Distributions',
  subtitle: 'Uniform, Normal, and the Central Limit Theorem',
};

// Custom Math Notation Component
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

// Standardized Slide Container
const SlideFrame = ({ children }) => (
  <div className="flex flex-col w-full flex-grow px-6 py-8 md:px-12 md:py-10 bg-[#111111] text-slate-200 selection:bg-blue-500/30">
    <div className="w-full max-w-5xl mx-auto space-y-6 flex flex-col flex-grow">
      {children}
    </div>
  </div>
);

const SlideUniformIntro = () => (
  <SlideFrame>
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Continuous Distribution: Uniform</h2>
      <p className="text-slate-300 text-lg mb-6 leading-relaxed">
        The Uniform distribution is the most straightforward continuous probability distribution. Imagine a random number generator that produces decimals between 0 and 1; any exact number in that interval has an equal probability density of being generated.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        
        <div className="flex flex-col gap-6">
           <HighlightBox icon={Maximize} title="Defining the Parameters" color="emerald">
             <p className="text-[15px] mb-4">
               A continuous random variable <MathExpr>X</MathExpr> follows a Uniform distribution if it takes values within a defined interval with a constant probability density. It requires two parameters:
             </p>
             <ul className="space-y-3 font-mono text-sm bg-slate-900 p-4 rounded-lg border border-slate-700 shadow-inner text-slate-300">
               <li><span className="text-emerald-400 font-bold font-serif text-lg">a</span> : Minimum possible value.</li>
               <li><span className="text-emerald-400 font-bold font-serif text-lg">b</span> : Maximum possible value.</li>
             </ul>
           </HighlightBox>
           
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
             <h4 className="font-bold text-blue-400 mb-2">The "Rectangle" Distribution</h4>
             <p className="text-sm text-slate-300">
               Because the probability density is perfectly flat between <MathExpr>a</MathExpr> and <MathExpr>b</MathExpr>, and drops to 0 everywhere else, the visual shape of the PDF is a simple rectangle!
             </p>
           </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-800 shadow-xl flex flex-col justify-center">
           <h3 className="text-xl font-bold text-blue-400 mb-6 border-b border-slate-700 pb-2">The PDF Formula</h3>
           <p className="text-sm text-slate-300 mb-6">
             Remember the golden rule of PDFs: <strong>Total Area = 1</strong>. <br/><br/>
             If the shape is a rectangle, and Area = Width &times; Height, we know the Width is <MathExpr>(b - a)</MathExpr>. To make the Area exactly 1, the Height <em>must</em> be <MathExpr>1 / (b - a)</MathExpr>.
           </p>
           
           <div className="flex justify-center mb-6">
             <div className="font-serif text-xl md:text-2xl text-white bg-slate-800 px-6 py-6 rounded-xl border border-slate-700 shadow-inner flex items-center gap-4 flex-wrap">
               <span>f(x; a, b) =</span>
               <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-4">
                   <div className="flex flex-col items-center">
                     <span className="border-b border-slate-400 px-2 pb-1 text-emerald-400">1</span>
                     <span className="pt-1 text-blue-300">b - a</span>
                   </div>
                   <span className="text-slate-300 text-lg">for <span className="text-emerald-400">a</span> &le; x &le; <span className="text-blue-300">b</span></span>
                 </div>
                 <div className="flex items-center gap-4">
                   <span className="px-2 text-rose-400">0</span>
                   <span className="text-slate-300 text-lg">otherwise</span>
                 </div>
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  </SlideFrame>
);

const SlideUniformVisualizer = () => {
  const [a, setA] = useState(2);
  const [b, setB] = useState(8);
  const [c, setC] = useState(3);
  const [d, setD] = useState(5);

  // Enforce constraints
  useEffect(() => {
    if (a >= b) setB(a + 1);
    if (c < a) setC(a);
    if (d > b) setD(b);
    if (c >= d) setD(c + 1);
  }, [a, b, c, d]);

  const height = 1 / (b - a);
  const probArea = (d - c) * height;
  const mean = (a + b) / 2;
  const variance = Math.pow(b - a, 2) / 12;

  // Generate data for Recharts
  const data = [
    { x: 0, y: 0 },
    { x: a, y: 0 },
    { x: a, y: height },
    { x: b, y: height },
    { x: b, y: 0 },
    { x: 10, y: 0 },
  ];

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Interactive Uniform Distribution</h2>
        <p className="text-slate-300 text-sm md:text-base mb-6">
          Adjust the bounds <MathExpr>a</MathExpr> and <MathExpr>b</MathExpr> to change the distribution. Notice how the height automatically adjusts to keep the total area at 1.0! Then, adjust <MathExpr>c</MathExpr> and <MathExpr>d</MathExpr> to calculate a specific probability.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
          
          {/* Controls & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                  <span>Lower Bound (a)</span> <span className="text-emerald-400">{a}</span>
                </label>
                <input type="range" min="0" max="8" step="1" value={a} onChange={(e) => setA(parseInt(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                  <span>Upper Bound (b)</span> <span className="text-blue-400">{b}</span>
                </label>
                <input type="range" min="2" max="10" step="1" value={b} onChange={(e) => setB(parseInt(e.target.value))} className="w-full accent-blue-500" />
              </div>
              <div className="border-t border-slate-700 pt-4">
                <label className="text-xs font-bold text-rose-400 uppercase tracking-widest flex justify-between">
                  <span>Prob Start (c)</span> <span>{c}</span>
                </label>
                <input type="range" min={a} max={b-1} step="0.5" value={c} onChange={(e) => setC(parseFloat(e.target.value))} className="w-full accent-rose-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-rose-400 uppercase tracking-widest flex justify-between">
                  <span>Prob End (d)</span> <span>{d}</span>
                </label>
                <input type="range" min={c+0.5} max={b} step="0.5" value={d} onChange={(e) => setD(parseFloat(e.target.value))} className="w-full accent-rose-500" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-inner space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Mean (Expected)</span>
                <span className="font-mono text-xl text-white font-bold">{mean.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-3">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Variance</span>
                <span className="font-mono text-xl text-white font-bold">{variance.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-3 bg-rose-900/20 p-2 rounded">
                <span className="text-xs text-rose-400 uppercase tracking-widest font-bold">P({c} &le; X &le; {d})</span>
                <span className="font-mono text-2xl text-rose-400 font-bold">{(probArea * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-xl flex flex-col min-h-[350px]">
             <div className="w-full h-full min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="x" type="number" domain={[0, 10]} stroke="#94a3b8" tickCount={11} />
                    <YAxis domain={[0, 1]} stroke="#94a3b8" />
                    
                    {/* The main rectangle */}
                    <Area type="step" dataKey="y" fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" strokeWidth={3} isAnimationActive={false} />
                    
                    {/* The probability shaded region */}
                    <ReferenceArea x1={c} x2={d} y1={0} y2={height} fill="#f43f5e" fillOpacity={0.5} />
                    
                    <ReferenceLine y={height} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: `Height = 1/${b-a} = ${height.toFixed(2)}`, fill: '#94a3b8', fontSize: 12 }} />
                  </ComposedChart>
               </ResponsiveContainer>
             </div>
             
             <div className="text-center mt-2 text-sm text-slate-400 bg-slate-800/50 py-3 px-4 rounded-lg border border-slate-700">
                Probability is simply Area: <MathExpr>"Width" &times; "Height"</MathExpr> &rarr; <MathExpr>({d} - {c}) &times; {height.toFixed(3)} = {probArea.toFixed(3)}</MathExpr>
             </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideNormalIntro = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Continuous Distribution: Normal (Gaussian)</h2>
      <p className="text-slate-300 text-lg mb-6 leading-relaxed">
        The Normal distribution (the "bell curve") is the undisputed king of probability and statistics. Its prevalence in nature and machine learning is not accidental—it mathematically emerges whenever you sum up many small, independent effects.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        
        <div className="flex flex-col gap-6">
           <HighlightBox icon={Activity} title="The Two Parameters" color="blue">
             <p className="text-[15px] mb-4">
               Every specific Normal distribution is entirely defined by just two numbers:
             </p>
             <ul className="space-y-4 font-mono text-sm bg-slate-900 p-5 rounded-xl border border-slate-700 shadow-inner">
               <li>
                 <span className="text-blue-400 font-bold font-serif text-xl mr-2">&mu;</span> 
                 <span className="text-white">(Mean):</span> Controls the <em>center</em>. Shifting &mu; slides the bell left or right.
               </li>
               <li>
                 <span className="text-emerald-400 font-bold font-serif text-xl mr-2">&sigma;</span> 
                 <span className="text-white">(Std Dev):</span> Controls the <em>spread</em>. A small &sigma; makes a tall/skinny spike. A large &sigma; makes a short/fat pancake.
               </li>
             </ul>
           </HighlightBox>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-800 shadow-xl flex flex-col justify-center">
           <h3 className="text-xl font-bold text-rose-400 mb-6 border-b border-slate-700 pb-2">Deconstructing the PDF Formula</h3>
           <p className="text-sm text-slate-300 mb-6">
             The PDF formula for the Normal distribution looks terrifying. Let's break it into two logical pieces so it makes intuitive sense:
           </p>
           
           <div className="flex justify-center mb-8">
             <div className="font-serif text-xl md:text-3xl text-white bg-slate-800 px-6 py-6 rounded-xl border border-slate-700 shadow-inner flex items-center gap-2">
               <span>f(x) =</span>
               <div className="flex flex-col items-center mx-2 text-emerald-400">
                 <span className="border-b border-slate-500 px-2 pb-1">1</span>
                 <span className="pt-1 text-sm md:text-xl">&sigma; &radic;<span className="border-t border-emerald-400">2&pi;</span></span>
               </div>
               <span className="text-rose-400">e<sup className="text-sm md:text-lg text-blue-300">-&frac12; ( (x - &mu;) / &sigma; )²</sup></span>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4 text-sm">
             <div className="bg-emerald-900/20 border border-emerald-800/50 p-3 rounded-lg">
               <span className="font-bold text-emerald-400 block mb-1">The Normalizer</span>
               <span className="text-slate-300 text-xs">This messy fraction at the front has one job: ensure the total area under the entire bell curve equals exactly 1.0.</span>
             </div>
             <div className="bg-rose-900/20 border border-rose-800/50 p-3 rounded-lg">
               <span className="font-bold text-rose-400 block mb-1">The Exponent (Shape)</span>
               <span className="text-slate-300 text-xs">This dictates the bell shape. It calculates the squared distance from the mean. As <MathExpr>x</MathExpr> moves away from <MathExpr>&mu;</MathExpr>, the negative exponent drives the value towards 0.</span>
             </div>
           </div>
        </div>

      </div>
    </div>
  </SlideFrame>
);

const SlideNormalVisualizer = () => {
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);

  // Generate smooth curve data
  const data = [];
  for (let i = -10; i <= 10; i += 0.2) {
    const x = parseFloat(i.toFixed(1));
    const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const y = coeff * Math.exp(exponent);
    
    data.push({ x, y });
  }

  // Reference Standard Normal Curve (mu=0, sigma=1)
  const stdData = [];
  for (let i = -10; i <= 10; i += 0.2) {
    const x = parseFloat(i.toFixed(1));
    const exponent = -0.5 * Math.pow(x, 2);
    const coeff = 1 / Math.sqrt(2 * Math.PI);
    const y = coeff * Math.exp(exponent);
    stdData.push({ x, stdY: y });
  }
  
  // Merge datasets
  const mergedData = data.map((d, i) => ({ ...d, stdY: stdData[i].stdY }));

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Interactive Normal Distribution</h2>
        <p className="text-slate-300 text-sm md:text-base mb-6">
          Adjust the Mean (<MathExpr>&mu;</MathExpr>) to shift the curve. Adjust the Standard Deviation (<MathExpr>&sigma;</MathExpr>) to squish or stretch it. The faded gray curve is the "Standard Normal" (<MathExpr>&mu;=0, &sigma;=1</MathExpr>) for reference.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
          
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-300 mb-2 flex justify-between uppercase tracking-wider">
                  <span>Mean (&mu;)</span>
                  <span className="text-blue-400 font-mono">{mu.toFixed(1)}</span>
                </label>
                <input type="range" min="-5" max="5" step="0.5" value={mu} onChange={(e) => setMu(parseFloat(e.target.value))} className="w-full accent-blue-500" />
                <p className="text-xs text-slate-500 mt-1">Shifts the center of gravity.</p>
              </div>
              <div className="border-t border-slate-700 pt-4">
                <label className="text-sm font-bold text-slate-300 mb-2 flex justify-between uppercase tracking-wider">
                  <span>Std Dev (&sigma;)</span>
                  <span className="text-emerald-400 font-mono">{sigma.toFixed(1)}</span>
                </label>
                <input type="range" min="0.5" max="4" step="0.1" value={sigma} onChange={(e) => setSigma(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                <p className="text-xs text-slate-500 mt-1">Changes the width and height.</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-inner space-y-4">
               <h4 className="font-bold text-white text-sm border-b border-slate-700 pb-2">Observations:</h4>
               <ul className="space-y-3 text-sm text-slate-400">
                 <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"/>
                   <span>As <MathExpr>&sigma;</MathExpr> increases, the peak gets shorter to ensure the total area remains 1.0.</span>
                 </li>
                 <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"/>
                   <span>The curve is perfectly symmetrical around <MathExpr>&mu;</MathExpr>.</span>
                 </li>
               </ul>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-xl flex flex-col min-h-[350px]">
             <div className="w-full h-full min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={mergedData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="x" type="number" domain={[-10, 10]} stroke="#94a3b8" tickCount={11} />
                    <YAxis domain={[0, 0.9]} stroke="#94a3b8" />
                    
                    {/* Standard Normal Reference */}
                    <Line type="monotone" dataKey="stdY" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
                    
                    {/* Dynamic Normal */}
                    <Area type="monotone" dataKey="y" fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" strokeWidth={3} isAnimationActive={false} />
                    
                    <ReferenceLine x={mu} stroke="#3b82f6" strokeDasharray="3 3" label={{ position: 'top', value: 'μ', fill: '#3b82f6', fontSize: 16, fontWeight: 'bold' }} />
                  </ComposedChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideEmpiricalRule = () => {
  const mu = 0;
  const sigma = 1;
  const data = [];
  for (let i = -4; i <= 4; i += 0.1) {
    const x = parseFloat(i.toFixed(1));
    const exponent = -0.5 * Math.pow(x, 2);
    const coeff = 1 / Math.sqrt(2 * Math.PI);
    const y = coeff * Math.exp(exponent);
    data.push({ x, y });
  }

  return (
    <SlideFrame>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">The Empirical Rule (68-95-99.7)</h2>
        <p className="text-slate-300 text-lg mb-6">
          A incredibly useful guideline for understanding the spread of <em>any</em> Normal distribution is the Empirical Rule. It gives us a quick mental shortcut for probability areas.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-xl flex flex-col min-h-[350px]">
             <div className="w-full h-full min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="x" type="number" domain={[-4, 4]} stroke="#94a3b8" tickCount={9} tickFormatter={(val) => `${val > 0 ? '+' : ''}${val}σ`} />
                    <YAxis hide />
                    
                    {/* 99.7% Area (3 Sigma) */}
                    <ReferenceArea x1={-3} x2={3} fill="#f43f5e" fillOpacity={0.2} />
                    
                    {/* 95% Area (2 Sigma) */}
                    <ReferenceArea x1={-2} x2={2} fill="#a855f7" fillOpacity={0.3} />
                    
                    {/* 68% Area (1 Sigma) */}
                    <ReferenceArea x1={-1} x2={1} fill="#3b82f6" fillOpacity={0.4} />

                    <Line type="monotone" dataKey="y" stroke="#ffffff" strokeWidth={3} dot={false} />
                    
                    <ReferenceLine x={0} stroke="#ffffff" strokeDasharray="3 3" />
                  </ComposedChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="flex flex-col justify-center gap-6">
             <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-blue-500 shadow-md">
               <h4 className="font-bold text-blue-400 text-xl mb-2">&plusmn; 1&sigma; contains ~68%</h4>
               <p className="text-sm text-slate-300">
                 Roughly 68% of all data points fall within exactly one standard deviation of the mean. This is the "fat" part of the bell.
               </p>
             </div>
             
             <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-purple-500 shadow-md">
               <h4 className="font-bold text-purple-400 text-xl mb-2">&plusmn; 2&sigma; contains ~95%</h4>
               <p className="text-sm text-slate-300">
                 Roughly 95% of the data falls within two standard deviations. In many scientific fields, an observation outside this range is considered statistically significant (the famous p &lt; 0.05).
               </p>
             </div>

             <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-rose-500 shadow-md">
               <h4 className="font-bold text-rose-400 text-xl mb-2">&plusmn; 3&sigma; contains ~99.7%</h4>
               <p className="text-sm text-slate-300">
                 Almost all (99.7%) data falls within three standard deviations. Anything beyond this is considered an extreme outlier (e.g., a "Six Sigma" event).
               </p>
             </div>
          </div>

        </div>
      </div>
    </SlideFrame>
  );
};

const SlideMLRelevance = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Why is the Normal Distribution the King of ML?</h2>
      <p className="text-slate-300 text-lg mb-8 leading-relaxed">
        You will see the Normal distribution everywhere in Data Science and Machine Learning. It's not just a mathematically convenient shape; it's practically baked into the laws of nature and statistics.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <SplitSquareHorizontal className="w-8 h-8 text-blue-400" />
            <h3 className="text-xl font-bold text-white">1. Modeling Residuals</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            In linear regression, a core assumption is that the errors (residuals) between your model's predictions and the actual true values are Normally distributed. If they aren't, your model might be missing a systematic pattern.
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-purple-400" />
            <h3 className="text-xl font-bold text-white">2. Algorithm Assumptions</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Many algorithms, like Gaussian Naive Bayes and Linear Discriminant Analysis (LDA), explicitly assume that the input features follow a Normal distribution. Knowing this helps you preprocess your data correctly.
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-orange-400" />
            <h3 className="text-xl font-bold text-white">3. Parameter Initialization</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            When training deep neural networks, starting with all weights at 0 is disastrous. Instead, weights are almost always initialized by drawing random numbers from a Normal distribution (often with a mean of 0 and a small variance).
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)] flex flex-col justify-center text-center">
          <Scale className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-emerald-400 mb-2">The Central Limit Theorem</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            The ultimate reason for its prevalence. The CLT proves that the sum of many independent random variables—<em>regardless of their original distribution</em>—will tend towards a Normal distribution. We will cover this magical theorem next!
          </p>
        </div>

      </div>
    </div>
  </SlideFrame>
);

const SlideCLTIntro = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">The Central Limit Theorem (CLT)</h2>
      <p className="text-slate-300 text-lg mb-6 leading-relaxed">
        The Central Limit Theorem is arguably the most remarkable concept in statistics. It acts as a bridge between <em>different</em> distributions and the Normal distribution, forming the foundation for most data analysis.
      </p>

      <HighlightBox icon={Zap} title="The Core Magic" color="emerald">
        <p className="text-[15px] mb-2">
          Imagine you have <em>any</em> population distribution. It could be skewed, uniform, bimodal, or completely weird.
        </p>
        <p className="text-[15px] font-bold text-white">
          If you take sufficiently large random samples from that population and calculate the mean of each sample, the distribution of those <em>sample means</em> will form a Normal distribution!
        </p>
      </HighlightBox>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col">
           <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
             <ListChecks className="w-5 h-5"/> Required Conditions
           </h3>
           <ul className="space-y-4 text-sm text-slate-300 flex-grow">
             <li className="flex items-start gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"/>
               <div><strong className="text-white">Random Samples:</strong> Samples must be drawn randomly from the population.</div>
             </li>
             <li className="flex items-start gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"/>
               <div><strong className="text-white">Independence:</strong> Observations within each sample should be independent.</div>
             </li>
             <li className="flex items-start gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"/>
               <div><strong className="text-white">Sample Size (n):</strong> Needs to be "sufficiently large". The rule of thumb is <MathExpr>n &ge; 30</MathExpr>. If the original population is already symmetric, smaller sample sizes work.</div>
             </li>
           </ul>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
           <h3 className="text-xl font-bold text-purple-400 mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
             <Brain className="w-5 h-5"/> Why is this Important?
           </h3>
           <ul className="space-y-4 text-sm text-slate-300 flex-grow">
             <li className="flex items-start gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"/>
               <div><strong className="text-white">Inference on Means:</strong> It allows us to use the well-understood Normal distribution to make estimates about population means, even if we don't know the population's shape.</div>
             </li>
             <li className="flex items-start gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"/>
               <div><strong className="text-white">Foundation for Tests:</strong> Procedures like the t-test (used to compare machine learning model performance) rely heavily on principles derived from the CLT.</div>
             </li>
             <li className="flex items-start gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"/>
               <div><strong className="text-white">Explains Normality:</strong> Many real-world metrics are the sum/average of many underlying random factors, which is why the bell curve appears everywhere in nature!</div>
             </li>
           </ul>
        </div>

      </div>
    </div>
  </SlideFrame>
);

const SlideCLTVisualizer = () => {
  const [n, setN] = useState(1);

  // Original Population: Uniform between 0 and 10
  const popMu = 5;
  const popVariance = 100 / 12; // Variance of Uniform(0,10) is (10-0)^2 / 12
  
  // Sampling Distribution of the Mean
  const sampleMu = popMu;
  const sampleStdDev = Math.sqrt(popVariance / n);

  // Generate data points
  const data = [];
  for (let i = 0; i <= 10; i += 0.1) {
    const x = parseFloat(i.toFixed(1));
    let y = 0;
    
    if (n === 1) {
      // Show the raw Uniform Distribution PDF (Height = 1/10 = 0.1)
      y = 0.1;
    } else {
      // Show the Normal Distribution PDF approximation
      const exponent = -0.5 * Math.pow((x - sampleMu) / sampleStdDev, 2);
      const coeff = 1 / (sampleStdDev * Math.sqrt(2 * Math.PI));
      y = coeff * Math.exp(exponent);
    }
    
    data.push({ x, y });
  }

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Visualizing the CLT</h2>
        <p className="text-slate-300 text-sm md:text-base mb-6">
          Watch what happens as we increase the sample size (<MathExpr>n</MathExpr>). We start with a flat <strong>Uniform Distribution</strong> (measuring individuals). As <MathExpr>n</MathExpr> increases, we are plotting the distribution of <em>averages</em>, which squeezes into a Normal curve!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
          
          <div className="lg:col-span-1 space-y-6 flex flex-col justify-center">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-300 mb-2 flex justify-between uppercase tracking-wider">
                  <span>Sample Size (n)</span>
                  <span className="text-emerald-400 font-mono">{n === 1 ? '1 (Individuals)' : n}</span>
                </label>
                <input 
                  type="range" min="1" max="30" step="1" 
                  value={n} onChange={(e) => setN(parseInt(e.target.value))} 
                  className="w-full accent-emerald-500" 
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-inner space-y-4">
               <h4 className="font-bold text-white text-sm border-b border-slate-700 pb-2">Implications of CLT</h4>
               <ul className="space-y-4 text-sm text-slate-300">
                 <li>
                   <strong className="text-blue-400">1. Center:</strong> The mean of the sampling distribution remains anchored at the population mean (<MathExpr>&mu; = 5</MathExpr>).
                 </li>
                 <li>
                   <strong className="text-rose-400">2. Spread:</strong> The standard deviation of the sampling distribution (Standard Error) shrinks as <MathExpr>&sigma; / &radic;n</MathExpr>. Notice how the curve gets taller and skinnier as <MathExpr>n</MathExpr> increases!
                 </li>
               </ul>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-xl flex flex-col min-h-[350px]">
             <div className="w-full h-full min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="x" type="number" domain={[0, 10]} stroke="#94a3b8" tickCount={11} />
                    <YAxis domain={[0, 1.2]} stroke="#94a3b8" />
                    
                    <Area 
                      type={n === 1 ? "step" : "monotone"} 
                      dataKey="y" 
                      fill="#10b981" fillOpacity={0.3} 
                      stroke="#10b981" strokeWidth={3} 
                      isAnimationActive={false} 
                    />
                    
                    <ReferenceLine x={5} stroke="#94a3b8" strokeDasharray="3 3" />
                  </ComposedChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlidePracticeIdentifying = () => {
  const [revealed, setRevealed] = useState([false, false, false, false]);

  const toggleReveal = (idx) => {
    const newRevealed = [...revealed];
    newRevealed[idx] = !newRevealed[idx];
    setRevealed(newRevealed);
  };

  const scenarios = [
    {
      q: "A single user visits a webpage. The random variable is whether the user clicks on an ad (Yes/No).",
      hint: "Think about the number of trials and possible outcomes.",
      dist: "Bernoulli Distribution",
      ans: "Involves a single trial with two mutually exclusive outcomes (click or no click)."
    },
    {
      q: "You survey 100 students asking if they prefer online classes. The variable is the NUMBER of students out of 100 who prefer online.",
      hint: "Multiple trials, each with two outcomes, counting successes.",
      dist: "Binomial Distribution",
      ans: "A fixed number of independent trials (100), two outcomes (prefer/not), tracking total successes."
    },
    {
      q: "A generator produces random numbers where any value between 0.0 and 1.0 is equally likely.",
      hint: "Focus on equal likelihood across a continuous range.",
      dist: "Uniform Distribution",
      ans: "Continuous interval [0.0, 1.0] where probability density is assigned equally everywhere."
    },
    {
      q: "You measure the exact height of adult males in a large city.",
      hint: "Think about natural phenomena clustering around an average.",
      dist: "Normal Distribution",
      ans: "Physical measurements follow a bell curve due to the Central Limit Theorem (many small genetic/environmental factors adding up)."
    }
  ];

  return (
    <SlideFrame>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Practice 1: Identifying Distributions</h2>
        <p className="text-slate-300 text-lg mb-4">
          Determine which probability distribution best describes the random variable in each scenario. Click the cards to reveal the answer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
          {scenarios.map((s, idx) => (
            <div 
              key={idx} 
              onClick={() => toggleReveal(idx)}
              className={`cursor-pointer rounded-2xl p-6 border transition-all duration-500 relative flex flex-col ${revealed[idx] ? 'bg-slate-800 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-900 border-slate-700 shadow-md hover:bg-slate-800/80'}`}
            >
              {!revealed[idx] ? (
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3 text-blue-400 font-bold">
                    <HelpCircle className="w-5 h-5"/> Scenario {idx + 1}
                  </div>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-4">{s.q}</p>
                  <p className="text-xs text-slate-500 italic mt-auto border-t border-slate-800 pt-3 flex items-center justify-between">
                    <span>Hint: {s.hint}</span>
                    <span className="bg-slate-800 px-2 py-1 rounded text-white font-bold">Click to Reveal</span>
                  </p>
                </div>
              ) : (
                <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold">
                    <CheckSquare className="w-5 h-5"/> Scenario {idx + 1} Solution
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{s.dist}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{s.ans}</p>
                  <p className="text-xs text-slate-500 italic mt-auto border-t border-slate-800 pt-3 text-right">
                    Click to hide
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
};

const SlidePracticeBinomial = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl font-bold text-white mb-2">Practice 2: Calculating Binomial</h2>
      
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md">
        <p className="text-slate-300 leading-relaxed text-sm md:text-base">
          Imagine a quality control process where the probability of a widget being defective is <MathExpr>p = 0.05</MathExpr>. You inspect a batch of <MathExpr>n = 10</MathExpr> widgets. What is the probability that <strong>exactly one</strong> widget is defective <MathExpr>P(X = 1)</MathExpr>? What about <strong>at most one</strong> <MathExpr>P(X &le; 1)</MathExpr>?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
        
        {/* Exactly One */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col">
           <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
             <Calculator className="w-5 h-5"/> Exactly One Defect: P(X = 1)
           </h3>
           
           <ol className="space-y-4 text-sm font-mono bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 flex-grow">
             <li className="text-slate-300">
               <span className="text-slate-400 block mb-1 font-sans font-bold text-xs uppercase tracking-widest">Parameters:</span>
               n = 10, k = 1, p = 0.05
             </li>
             <li className="text-slate-300">
               <span className="text-slate-400 block mb-1 font-sans font-bold text-xs uppercase tracking-widest">1. Combinations (10 choose 1):</span>
               10! / (1! * 9!) = <span className="text-blue-400 font-bold">10 ways</span>
             </li>
             <li className="text-slate-300">
               <span className="text-slate-400 block mb-1 font-sans font-bold text-xs uppercase tracking-widest">2. Probability Part:</span>
               p¹(1-p)⁹ = (0.05)¹ × (0.95)⁹ <br/>
               ≈ 0.05 × 0.6302 ≈ <span className="text-emerald-400 font-bold">0.0315</span>
             </li>
           </ol>

           <div className="mt-4 bg-slate-900 p-4 rounded-xl border border-slate-800 text-center font-serif text-lg text-white">
             P(X=1) = 10 × 0.03151 <br/>
             <span className="text-blue-400 font-bold font-sans text-xl mt-2 block">≈ 31.5%</span>
           </div>
        </div>

        {/* At Most One */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col">
           <h3 className="text-xl font-bold text-purple-400 mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
             <Calculator className="w-5 h-5"/> At Most One: P(X ≤ 1)
           </h3>
           
           <div className="text-sm text-slate-300 mb-4">
             "At most one" means either 0 widgets are defective OR 1 widget is defective. We must calculate <MathExpr>P(X=0)</MathExpr> and add it to <MathExpr>P(X=1)</MathExpr>.
           </div>

           <ol className="space-y-4 text-sm font-mono bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 flex-grow">
             <li className="text-slate-300">
               <span className="text-slate-400 block mb-1 font-sans font-bold text-xs uppercase tracking-widest">Calculate P(X = 0):</span>
               Ways: (10 choose 0) = 1 <br/>
               Prob: (0.05)⁰ × (0.95)¹⁰ ≈ 1 × 1 × 0.5987 <br/>
               <span className="text-purple-400 font-bold">P(X=0) ≈ 0.5987 (or 59.87%)</span>
             </li>
             <li className="text-slate-300">
               <span className="text-slate-400 block mb-1 font-sans font-bold text-xs uppercase tracking-widest">Add them together:</span>
               P(X ≤ 1) = P(X=0) + P(X=1) <br/>
               P(X ≤ 1) ≈ 0.5987 + 0.3151
             </li>
           </ol>

           <div className="mt-4 bg-slate-900 p-4 rounded-xl border border-slate-800 text-center font-serif text-lg text-white">
             P(X ≤ 1) ≈ 0.9138 <br/>
             <span className="text-purple-400 font-bold font-sans text-xl mt-2 block">≈ 91.4%</span>
           </div>
        </div>

      </div>
    </div>
  </SlideFrame>
);

const SlidePracticeNormal = () => {
  const [problem, setProblem] = useState(1);
  const mu = 1000;
  const sigma = 150;

  // Generate curve data
  const data = [];
  for (let i = 400; i <= 1600; i += 10) {
    const x = i;
    const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const y = coeff * Math.exp(exponent);
    data.push({ x, y });
  }

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Practice 3: Normal Distribution & Z-Scores</h2>
        <p className="text-slate-300 text-sm md:text-base mb-6">
          Assume test scores are normally distributed with <MathExpr>&mu; = 1000</MathExpr> and <MathExpr>&sigma; = 150</MathExpr>. Calculate the probabilities using Z-scores: <MathExpr>Z = (X - &mu;) / &sigma;</MathExpr>.
        </p>

        <div className="bg-slate-800 border border-slate-700 p-2 rounded-xl flex gap-2 w-full max-w-xl mx-auto mb-6 shadow-inner">
          <button 
            onClick={() => setProblem(1)}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${problem === 1 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
          >
            1. P(X &lt; 850)
          </button>
          <button 
            onClick={() => setProblem(2)}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${problem === 2 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
          >
            2. P(900 &lt; X &lt; 1100)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-xl flex flex-col min-h-[350px]">
             <div className="w-full h-full min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="x" type="number" domain={[400, 1600]} stroke="#94a3b8" tickCount={7} />
                    <YAxis hide />
                    
                    {/* Problem 1 Shading */}
                    {problem === 1 && <ReferenceArea x1={400} x2={850} fill="#3b82f6" fillOpacity={0.4} />}
                    {problem === 1 && <ReferenceLine x={850} stroke="#3b82f6" strokeDasharray="3 3" label={{ position: 'top', value: 'X=850', fill: '#3b82f6' }} />}
                    
                    {/* Problem 2 Shading */}
                    {problem === 2 && <ReferenceArea x1={900} x2={1100} fill="#10b981" fillOpacity={0.4} />}
                    {problem === 2 && <ReferenceLine x={900} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: 'X=900', fill: '#10b981' }} />}
                    {problem === 2 && <ReferenceLine x={1100} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: 'X=1100', fill: '#10b981' }} />}

                    <Line type="monotone" dataKey="y" stroke="#ffffff" strokeWidth={3} dot={false} isAnimationActive={false} />
                    <ReferenceLine x={1000} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'bottom', value: 'μ=1000', fill: '#94a3b8' }} />
                  </ComposedChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="flex flex-col justify-center space-y-6">
             {problem === 1 ? (
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md animate-in fade-in slide-in-from-right-4 duration-500">
                  <h4 className="font-bold text-blue-400 mb-4 text-xl">Scoring Below 850</h4>
                  <ul className="space-y-4 text-sm text-slate-300 font-mono">
                    <li>
                      <span className="text-slate-400 font-sans font-bold block mb-1">1. Convert to Z-Score:</span>
                      Z = (850 - 1000) / 150 <br/>
                      Z = -150 / 150 = <span className="text-white font-bold">-1.0</span>
                    </li>
                    <li>
                      <span className="text-slate-400 font-sans font-bold block mb-1">2. Look up P(Z &lt; -1.0):</span>
                      Using a standard normal table or software, the area to the left of Z = -1.0 is 0.1587.
                    </li>
                  </ul>
                  <div className="mt-6 bg-slate-900 p-4 rounded-xl border border-slate-800 text-center font-bold text-xl text-blue-400 shadow-inner">
                    P(X &lt; 850) ≈ 15.9%
                  </div>
                </div>
             ) : (
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md animate-in fade-in slide-in-from-right-4 duration-500">
                  <h4 className="font-bold text-emerald-400 mb-4 text-xl">Scoring Between 900 and 1100</h4>
                  <ul className="space-y-4 text-sm text-slate-300 font-mono">
                    <li>
                      <span className="text-slate-400 font-sans font-bold block mb-1">1. Convert both to Z-Scores:</span>
                      Z₁ = (900 - 1000) / 150 ≈ <span className="text-white font-bold">-0.67</span><br/>
                      Z₂ = (1100 - 1000) / 150 ≈ <span className="text-white font-bold">0.67</span>
                    </li>
                    <li>
                      <span className="text-slate-400 font-sans font-bold block mb-1">2. Look up areas & Subtract:</span>
                      P(Z &lt; 0.67) ≈ 0.7486 <br/>
                      P(Z &lt; -0.67) ≈ 0.2514 <br/>
                      P(Between) = 0.7486 - 0.2514 = 0.4972
                    </li>
                  </ul>
                  <div className="mt-6 bg-slate-900 p-4 rounded-xl border border-slate-800 text-center font-bold text-xl text-emerald-400 shadow-inner">
                    P(900 &lt; X &lt; 1100) ≈ 49.7%
                  </div>
                </div>
             )}
          </div>

        </div>
      </div>
    </SlideFrame>
  );
};

const SlidePythonCode = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Python Implementation</h2>
      <p className="text-slate-300 text-lg mb-4">
        In practice, we use libraries like `scipy.stats` to calculate exact probabilities, and `numpy.random` to generate random samples from these distributions.
      </p>

      <div className="bg-[#1e1e1e] rounded-xl border border-slate-700 shadow-2xl overflow-hidden flex-grow flex flex-col">
        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-black/50 shrink-0">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-slate-400 text-xs ml-2 font-mono flex items-center gap-2"><Code className="w-3 h-3"/> distributions_practice.py</span>
        </div>
        
        <div className="p-4 md:p-6 text-sm md:text-base font-mono leading-relaxed overflow-x-auto text-slate-300">
          <span className="text-purple-400">import</span> scipy.stats <span className="text-purple-400">as</span> stats<br/>
          <span className="text-purple-400">import</span> numpy <span className="text-purple-400">as</span> np<br/><br/>
          
          <span className="text-slate-500"># --- Normal Distribution Calculations ---</span><br/>
          mu, sigma = <span className="text-orange-400">1000</span>, <span className="text-orange-400">150</span><br/>
          <span className="text-slate-500"># P(X &lt; 850) using Cumulative Distribution Function (CDF)</span><br/>
          prob_below = stats.norm.cdf(x=<span className="text-orange-400">850</span>, loc=mu, scale=sigma)<br/>
          <span className="text-blue-300">print</span>(<span className="text-emerald-300">f"P(X &lt; 850) = </span><span className="text-blue-400">{`{prob_below:.4f}`}</span><span className="text-emerald-300">"</span>) <span className="text-slate-500"># Output: 0.1587</span><br/><br/>
          
          <span className="text-slate-500"># --- Binomial Distribution Calculations ---</span><br/>
          n, p = <span className="text-orange-400">10</span>, <span className="text-orange-400">0.05</span><br/>
          <span className="text-slate-500"># P(X = 1) using Probability Mass Function (PMF)</span><br/>
          prob_exact = stats.binom.pmf(k=<span className="text-orange-400">1</span>, n=n, p=p)<br/>
          <span className="text-blue-300">print</span>(<span className="text-emerald-300">f"P(X = 1) = </span><span className="text-blue-400">{`{prob_exact:.4f}`}</span><span className="text-emerald-300">"</span>) <span className="text-slate-500"># Output: 0.3151</span><br/><br/>

          <span className="text-slate-500"># --- Generating Random Samples (Simulation) ---</span><br/>
          <span className="text-slate-500"># Generate 1000 samples from a Normal Distribution</span><br/>
          normal_samples = np.random.normal(loc=<span className="text-orange-400">50</span>, scale=<span className="text-orange-400">5</span>, size=<span className="text-orange-400">1000</span>)<br/>
          <span className="text-slate-500"># Generate 1000 samples from a Binomial Distribution</span><br/>
          binomial_samples = np.random.binomial(n=<span className="text-orange-400">20</span>, p=<span className="text-orange-400">0.7</span>, size=<span className="text-orange-400">1000</span>)<br/>
        </div>
      </div>
      
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-start gap-3 shadow-md">
        <Terminal className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-300">
          The <strong>CDF</strong> (Cumulative Distribution Function) calculates the area under the curve to the <em>left</em> of a given point. The <strong>PMF/PDF</strong> calculate the specific density/mass at exactly that point.
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
    <div className="flex flex-col grow shrink-0 w-full min-h-full bg-[#111111]">
      
      {/* Scrollable Content Area */}
      <div className="flex flex-col grow w-full">
        {React.createElement(slides[currentSlide].component)}
      </div>

      {/* Sticky Bottom Navigation Footer */}
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

export default function ContinuousDistributions10() {
  const slides = [
    { component: SlideUniformIntro, title: 'Uniform Distribution' },
    { component: SlideUniformVisualizer, title: 'Interactive Uniform' },
    { component: SlideNormalIntro, title: 'Normal Distribution' },
    { component: SlideNormalVisualizer, title: 'Interactive Normal' },
    { component: SlideEmpiricalRule, title: 'Empirical Rule' },
    { component: SlideMLRelevance, title: 'ML Relevance' },
    { component: SlideCLTIntro, title: 'Central Limit Theorem' },
    { component: SlideCLTVisualizer, title: 'Interactive CLT' },
    { component: SlidePracticeIdentifying, title: 'Practice: Identifying' },
    { component: SlidePracticeBinomial, title: 'Practice: Binomial' },
    { component: SlidePracticeNormal, title: 'Practice: Normal & Z-Scores' },
    { component: SlidePythonCode, title: 'Python Implementation' },
  ];

  return <Slideshow slides={slides} />;
}