import React, { useState, useEffect } from 'react';
import { 
  Info, Activity, ArrowRight, ChevronLeft, ChevronRight, 
  Target, Layers, MoveDown, Focus, Crosshair, PenTool, Calculator, Play, CheckCircle, RotateCcw
} from 'lucide-react';
import {
  Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Scatter, ComposedChart, ReferenceLine
} from 'recharts';

export const meta = {
  title: '6. Calculus in Action: Cost Function',
  subtitle: 'Applying derivatives to Mean Squared Error',
};

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

const SlideFrame = ({ children }) => (
  <div className="flex flex-col h-full px-6 py-8 md:px-12 md:py-10 bg-[#111111] text-slate-200">
    <div className="w-full max-w-5xl mx-auto space-y-6 flex flex-col h-full">
      {children}
    </div>
  </div>
);

const SlideRegressionVisualizer = () => {
  const [m, setM] = useState(0.8);
  const [b, setB] = useState(0.5);

  const rawData = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
    { x: 4, y: 4 },
    { x: 5, y: 6 },
  ];

  let mse = 0;
  const chartData = [];
  const residualLines = [];

  rawData.forEach(pt => {
    const yHat = m * pt.x + b;
    const error = pt.y - yHat;
    mse += error * error;
    
    // Add point for scatter plot
    chartData.push({ x: pt.x, actualY: pt.y });
    
    // Generate individual lines for residuals to overlay on chart
    residualLines.push([
      { x: pt.x, y: pt.y },
      { x: pt.x, y: yHat }
    ]);
  });
  
  mse = mse / rawData.length;

  // The regression line endpoints for rendering
  const lineStart = { x: 0, y: m * 0 + b };
  const lineEnd = { x: 6, y: m * 6 + b };

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Defining a Cost Function</h2>
        <p className="text-slate-300 text-lg mb-6">
          A model predicts outputs based on inputs. For a linear model <MathExpr>{"y = mx + b"}</MathExpr>, we need to measure <em>how well</em> a specific line fits our data points. This measure is the <strong>Cost Function</strong>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          {/* Interactive Visualizer */}
          <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-xl p-6 flex flex-col min-h-[400px]">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
              <span>Interactive Model</span>
              <span className="bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-xs font-mono">
                MSE (Cost): {mse.toFixed(3)}
              </span>
            </h3>

            <div className="flex-grow w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="x" type="number" domain={[0, 6]} stroke="#94a3b8" tickCount={7} />
                  <YAxis domain={[0, 7]} stroke="#94a3b8" tickCount={8} />
                  
                  {/* Regression Line */}
                  <Line data={[lineStart, lineEnd]} type="linear" dataKey="y" stroke="#ef4444" strokeWidth={3} dot={false} isAnimationActive={false} />
                  
                  {/* Residual Lines */}
                  {residualLines.map((resData, idx) => (
                    <Line key={`res-${idx}`} data={resData} type="linear" dataKey="y" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} dot={false} isAnimationActive={false} />
                  ))}

                  {/* Actual Data Points */}
                  <Scatter data={chartData} dataKey="actualY" fill="#3b82f6" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                 <label className="text-sm font-bold text-slate-400 w-16">Slope m</label>
                 <input type="range" min="0" max="2" step="0.1" value={m} onChange={(e) => setM(parseFloat(e.target.value))} className="w-full accent-blue-500" />
                 <span className="font-mono text-white w-10 text-right">{m.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-4">
                 <label className="text-sm font-bold text-slate-400 w-16">Intrcpt b</label>
                 <input type="range" min="-1" max="3" step="0.1" value={b} onChange={(e) => setB(parseFloat(e.target.value))} className="w-full accent-blue-500" />
                 <span className="font-mono text-white w-10 text-right">{b.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Explanations */}
          <div className="flex flex-col gap-4 justify-center">
             <HighlightBox icon={Activity} title="Residuals: The Mistakes" color="blue">
                <p className="text-[15px]">
                  The dotted lines show the <strong>residual</strong>: the vertical difference between the actual data point <span>y<sub className="text-xs">i</sub></span> and the predicted point on our line <span>ŷ<sub className="text-xs">i</sub></span>.
                </p>
             </HighlightBox>

             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
                <h4 className="font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <Focus className="w-5 h-5 text-rose-400"/> Mean Squared Error (MSE)
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  We square each residual to ensure positive and negative errors don't cancel out, and to heavily penalize large mistakes. We then calculate the average (mean) across all data points to get our single Cost value, <MathExpr>{"J(m,b)"}</MathExpr>.
                </p>
             </div>
             
             <p className="text-sm text-slate-400 italic bg-slate-900/50 p-4 rounded-lg border border-slate-800">
               Play with the sliders! Your goal as a human optimizer is to find the <MathExpr>m</MathExpr> and <MathExpr>b</MathExpr> that make the red MSE badge as small as possible. Machine learning uses Gradient Descent to do this automatically.
             </p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideMSEFormula = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">The Mean Squared Error Formula</h2>
      <p className="text-slate-300 text-lg mb-8">
        Let's break down the exact mathematical formula for the Mean Squared Error cost function. This is the equation we will differentiate.
      </p>

      <div className="bg-slate-900 py-10 px-4 md:px-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center mb-8">
        <div className="flex items-center justify-center text-2xl md:text-4xl font-serif text-white flex-wrap gap-y-4">
          <span className="text-emerald-400 mr-2">J(m, b)</span>
          <span className="mx-2">=</span>
          <div className="flex flex-col items-center mx-2">
            <span className="border-b border-white px-2 pb-1">1</span>
            <span className="px-2 pt-1 text-blue-400">n</span>
          </div>
          <div className="flex items-center text-purple-400 mx-2">
            <div className="flex flex-col items-center mr-1">
              <span className="text-sm">n</span>
              <span className="text-5xl leading-none">Σ</span>
              <span className="text-sm">i=1</span>
            </div>
          </div>
          <span className="text-white">(</span>
          <span className="text-rose-400">y<sub className="text-lg">i</sub></span>
          <span className="mx-2">-</span>
          <span className="text-white">(</span>
          <span className="text-emerald-400">m</span>
          <span className="text-blue-300">x<sub className="text-lg">i</sub></span>
          <span className="mx-2">+</span>
          <span className="text-emerald-400">b</span>
          <span className="text-white">) )</span>
          <span className="text-xl align-super ml-1 text-slate-300">2</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        <div className="bg-slate-800 p-5 rounded-xl border-l-4 border-emerald-500 shadow-md">
          <h4 className="font-bold text-emerald-400 mb-1 font-serif text-lg">J(m, b)</h4>
          <p className="text-sm text-slate-300">The <strong>Cost Function</strong>. It outputs a single number (the error) depending on the parameters <MathExpr>m</MathExpr> and <MathExpr>b</MathExpr> we choose.</p>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border-l-4 border-purple-500 shadow-md">
          <h4 className="font-bold text-purple-400 mb-1 font-serif text-lg">1/n Σ</h4>
          <p className="text-sm text-slate-300">The <strong>Mean</strong>. We sum up the errors for all <MathExpr>n</MathExpr> data points (from <MathExpr>i=1</MathExpr> to <MathExpr>n</MathExpr>), and divide by <MathExpr>n</MathExpr> to get the average.</p>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border-l-4 border-rose-500 shadow-md">
          <h4 className="font-bold text-rose-400 mb-1 font-serif text-lg">yᵢ - (mxᵢ + b)</h4>
          <p className="text-sm text-slate-300">The <strong>Residual</strong>. The actual target value <span>y<sub className="text-xs">i</sub></span> minus our model's prediction <span>ŷ<sub className="text-xs">i</sub></span> for that specific point.</p>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border-l-4 border-slate-400 shadow-md">
          <h4 className="font-bold text-slate-300 mb-1 font-serif text-lg">( ... )²</h4>
          <p className="text-sm text-slate-300">The <strong>Squared</strong> part. Ensures all errors are positive and heavily penalizes large mistakes.</p>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideGradientM = () => {
  const [step, setStep] = useState(0);

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <div className="flex justify-between items-end mb-4 shrink-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Calculating Partial w.r.t <MathExpr>m</MathExpr> (<MathExpr>∂C/∂m</MathExpr>)</h2>
            <p className="text-slate-300 text-sm md:text-base">
              To find <MathExpr>{"∂C/∂m"}</MathExpr>, we differentiate the cost function <MathExpr>C(m, b)</MathExpr> with respect to <MathExpr>m</MathExpr>, treating <MathExpr>b</MathExpr> (and all <MathExpr>x_i, y_i</MathExpr>, and <MathExpr>N</MathExpr>) as constants. Let's look at the expression term by term:
            </p>
          </div>
          <button 
            onClick={() => setStep((s) => (s + 1) % 6)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-md transition-all text-sm shrink-0 ml-4"
          >
            {step === 5 ? "Reset" : "Next Step"}
          </button>
        </div>

        <div className="flex-grow space-y-3 overflow-y-auto pr-2 custom-scrollbar pb-10">
          
          {/* Step 1 & 2: Constant & Sum Rule */}
          <div className={`bg-slate-800 p-4 rounded-xl border transition-all duration-500 ${step >= 0 ? 'border-slate-600 opacity-100' : 'opacity-0 translate-y-4 hidden'}`}>
            <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2">1. Constant Factor & 2. Sum Rule</h4>
            <p className="text-sm text-slate-300 mb-3">
              The <MathExpr>1/N</MathExpr> is a constant multiplier, so it stays put. The derivative of a sum is the sum of the derivatives. We can move the derivative inside the summation:
            </p>
            <div className="font-serif text-lg md:text-xl text-center text-white bg-slate-900 py-3 rounded border border-slate-700 shadow-inner">
               <span className="text-blue-300">∂C/∂m</span> = <span className="text-slate-400">1/N Σ</span> <span className="text-emerald-400">∂/∂m</span> <span className="text-white">(mxᵢ + b - yᵢ)²</span>
            </div>
          </div>

          {/* Step 3: Chain Rule */}
          <div className={`bg-slate-800 p-4 rounded-xl border transition-all duration-500 ${step >= 1 ? 'border-emerald-500/50 shadow-md opacity-100' : 'opacity-0 translate-y-4 hidden'}`}>
            <h4 className="font-bold text-emerald-400 mb-2">3. Chain Rule</h4>
            <p className="text-sm text-slate-300 mb-3">
              We need to differentiate the term <MathExpr>(mxᵢ + b - yᵢ)²</MathExpr> with respect to <MathExpr>m</MathExpr>. Let <MathExpr>u = mxᵢ + b - yᵢ</MathExpr>. We are differentiating <MathExpr>u²</MathExpr> with respect to <MathExpr>m</MathExpr>. The chain rule states <MathExpr>d/dm(u²) = 2u · (∂u/∂m)</MathExpr>.
            </p>
            <ul className="text-sm text-slate-300 list-disc pl-5 space-y-2">
              <li><strong>First part:</strong> <MathExpr>2u = 2(mxᵢ + b - yᵢ)</MathExpr>.</li>
              <li>
                <strong>Second part:</strong> We need <MathExpr>∂u/∂m = ∂/∂m (mxᵢ + b - yᵢ)</MathExpr>. 
                Since <MathExpr>b</MathExpr> and <MathExpr>yᵢ</MathExpr> are treated as constants, their derivatives are zero. 
                The derivative of <MathExpr>mxᵢ</MathExpr> with respect to <MathExpr>m</MathExpr> is just <MathExpr>xᵢ</MathExpr> 
                (because <MathExpr>xᵢ</MathExpr> is treated as a constant coefficient of <MathExpr>m</MathExpr>). 
                So, <MathExpr>∂u/∂m = xᵢ</MathExpr>.
              </li>
            </ul>
          </div>

          {/* Step 4: Putting it Together */}
          <div className={`bg-slate-800 p-4 rounded-xl border transition-all duration-500 ${step >= 2 ? 'border-purple-500/50 shadow-md opacity-100' : 'opacity-0 translate-y-4 hidden'}`}>
            <h4 className="font-bold text-purple-400 mb-2">4. Putting it Together</h4>
            <p className="text-sm text-slate-300 mb-2">Substituting back into the chain rule formula:</p>
            <div className="font-serif text-lg md:text-xl text-center text-white bg-slate-900 py-3 rounded border border-slate-700 shadow-inner">
               <span className="text-emerald-400">∂/∂m</span> (mxᵢ + b - yᵢ)² = <span className="text-white">2(mxᵢ + b - yᵢ) · xᵢ</span>
            </div>
          </div>

          {/* Step 5: Final Result Before Pulling Constant */}
          <div className={`bg-slate-800 p-4 rounded-xl border transition-all duration-500 ${step >= 3 ? 'border-orange-500/50 shadow-md opacity-100' : 'opacity-0 translate-y-4 hidden'}`}>
            <h4 className="font-bold text-orange-400 mb-2">5. Final Result for ∂C/∂m</h4>
            <p className="text-sm text-slate-300 mb-2">Now substitute this back into the summation:</p>
            <div className="font-serif text-lg md:text-xl text-center text-white bg-slate-900 py-3 rounded border border-slate-700 shadow-inner">
               <span className="text-blue-300">∂C/∂m</span> = <span className="text-slate-400">1/N Σ</span> <span className="text-white">2(mxᵢ + b - yᵢ)xᵢ</span>
            </div>
          </div>

          {/* Final Form & Context */}
          <div className={`bg-slate-900 p-5 rounded-xl border-2 transition-all duration-700 ${step >= 4 ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)] opacity-100 scale-100' : 'opacity-0 scale-95 border-slate-800 hidden'}`}>
            <p className="text-sm text-slate-300 mb-3 text-center">We can pull the constant 2 out of the sum:</p>
            <div className="font-serif text-2xl md:text-3xl text-center text-white flex justify-center items-center gap-4 flex-wrap mb-6">
               <span className="text-blue-400">∂C/∂m</span> = <span className="text-emerald-400">2/N Σ (mxᵢ + b - yᵢ)xᵢ</span>
            </div>
            
            <div className={`transition-all duration-700 delay-300 ${step >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
               <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-800/50 text-sm text-blue-200 leading-relaxed shadow-inner">
                 <Info className="inline-block w-5 h-5 mr-2 mb-1 text-blue-400" />
                 This expression tells us how the cost changes as we slightly change the slope <MathExpr>m</MathExpr>. Notice it depends on the error term <MathExpr>(mx_i + b - y_i)</MathExpr> and the input value <MathExpr>x_i</MathExpr> for each data point.
               </div>
            </div>
          </div>

        </div>
      </div>
    </SlideFrame>
  );
};

const SlideGradientB = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl font-bold text-white mb-2">Gradient: Partial w.r.t <MathExpr>b</MathExpr></h2>
      <p className="text-slate-300 text-lg mb-6">
        Now we repeat the exact same process, but we differentiate with respect to the intercept <MathExpr>b</MathExpr>, treating <MathExpr>m</MathExpr> as a constant.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        
        <div className="flex flex-col gap-6">
          <HighlightBox icon={Layers} title="The Inner Derivative Changes" color="purple">
            <p className="text-[15px]">
              The first two steps (Sum Rule, and bringing down the 2) are identical. 
              <br/><br/>
              The difference happens in the <strong>Chain Rule</strong> when we take the derivative of the inside: <MathExpr>{"∂/∂b (y_i - mx_i - b)"}</MathExpr>.
            </p>
          </HighlightBox>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md space-y-4">
            <h4 className="font-bold text-white border-b border-slate-700 pb-2">Differentiating the inside:</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><MathExpr>y_i</MathExpr> is a constant &rarr; 0</li>
              <li><MathExpr>{"-mx_i"}</MathExpr> is a constant &rarr; 0</li>
              <li><MathExpr>{"-b"}</MathExpr> w.r.t <MathExpr>b</MathExpr> &rarr; <strong className="text-rose-400 font-mono text-base">-1</strong></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-8 flex flex-col justify-center flex-grow">
             <div className="space-y-6">
               <div className="text-slate-400 font-serif text-lg text-center">
                 1/n Σ 2(yᵢ - mxᵢ - b) · <span className="text-rose-400 font-bold bg-rose-900/30 px-2 py-1 rounded">(-1)</span>
               </div>
               <div className="flex justify-center my-4"><MoveDown className="w-6 h-6 text-slate-600"/></div>
               <div className="font-serif text-3xl text-center text-white border-2 border-emerald-500/50 bg-emerald-900/10 p-6 rounded-xl shadow-inner">
                 <span className="text-blue-400 block mb-4 text-xl font-sans tracking-widest uppercase">Final Result for b</span>
                 <span className="text-emerald-400">-2/n Σ (yᵢ - ŷᵢ)</span>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  </SlideFrame>
);

const SlideTheGradientVector = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Assembling the Gradient Vector</h2>
      <p className="text-slate-300 text-lg mb-8">
        We've successfully calculated both partial derivatives. The final step is to assemble them into the gradient vector, <MathExpr>{"∇J(m, b)"}</MathExpr>. This vector is the engine that drives Gradient Descent.
      </p>

      <div className="bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-700 shadow-2xl flex flex-col items-center justify-center flex-grow mb-8">
        <div className="flex items-center justify-center text-2xl md:text-4xl font-serif text-white">
          <span className="text-purple-400 mr-4">∇J(m, b)</span>
          <span className="mr-4 text-slate-500">=</span>
          
          {/* Matrix Assembly */}
          <div className="flex items-center">
            <div className="w-3 md:w-4 h-32 md:h-40 border-t-4 border-b-4 border-l-4 border-slate-400"></div>
            <div className="flex flex-col gap-6 md:gap-8 px-4 md:px-6">
              <div className="text-emerald-400 font-bold tracking-wider">-2/n Σ (yᵢ - ŷᵢ)xᵢ</div>
              <div className="text-blue-400 font-bold tracking-wider text-center">-2/n Σ (yᵢ - ŷᵢ)</div>
            </div>
            <div className="w-3 md:w-4 h-32 md:h-40 border-t-4 border-b-4 border-r-4 border-slate-400"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Target className="w-5 h-5 text-purple-500"/> What does this mean?</h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            For any given slope <MathExpr>m</MathExpr> and intercept <MathExpr>b</MathExpr>, we can plug our entire dataset into this vector to get two precise numbers. These numbers tell us exactly which direction makes the MSE error increase the fastest.
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2"><MoveDown className="w-5 h-5 text-emerald-500"/> The Optimization Step</h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            Because we want to <em>minimize</em> the error, Gradient Descent takes these two numbers, multiplies them by a negative learning rate (<MathExpr>{"-α"}</MathExpr>), and subtracts them from our current <MathExpr>m</MathExpr> and <MathExpr>b</MathExpr> to step downhill!
          </p>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideManualCalcIntro = () => {
  const dataPoints = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
  ];

  // Initial line y = 0
  const initialLine = [
    { x: 0, y: 0 },
    { x: 4, y: 0 }
  ];

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Practical: Setting the Scene</h2>
        <p className="text-slate-300 text-lg mb-6">
          Let's put our formulas to work on a tiny dataset: <MathExpr>(1, 2), (2, 3),</MathExpr> and <MathExpr>(3, 5)</MathExpr>. We will start with a completely blank slate, guessing <MathExpr>m = 0</MathExpr> and <MathExpr>b = 0</MathExpr> (the flat line <MathExpr>y = 0</MathExpr>).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          
          {/* Visual Plot */}
          <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-xl p-6 flex flex-col min-h-[350px]">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Initial State (m=0, b=0)</h3>
            <div className="flex-grow w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="x" type="number" domain={[0, 4]} stroke="#94a3b8" tickCount={5} />
                  <YAxis domain={[0, 6]} stroke="#94a3b8" tickCount={7} />
                  
                  {/* Initial Line */}
                  <Line data={initialLine} type="linear" dataKey="y" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" dot={false} isAnimationActive={false} name="Initial Line" />
                  
                  {/* Residuals (from points down to y=0) */}
                  {dataPoints.map((pt, idx) => (
                    <Line key={`res-${idx}`} data={[{x: pt.x, y: pt.y}, {x: pt.x, y: 0}]} type="linear" dataKey="y" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} dot={false} isAnimationActive={false} />
                  ))}

                  {/* Data Points */}
                  <Scatter data={dataPoints} dataKey="y" fill="#3b82f6" name="Data Points" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex gap-4 justify-center">
               <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span><span className="text-xs text-slate-400">Data Points</span></div>
               <div className="flex items-center gap-2"><span className="w-4 h-1 border-b-2 border-dashed border-rose-500"></span><span className="text-xs text-slate-400">Initial Line (y=0)</span></div>
            </div>
          </div>

          {/* Math Breakdown */}
          <div className="flex flex-col justify-center space-y-6">
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
                <h4 className="font-bold text-slate-200 mb-3 flex items-center gap-2 border-b border-slate-600 pb-2">
                  <Calculator className="w-5 h-5 text-blue-400"/> Calculating Initial Cost
                </h4>
                <p className="text-sm text-slate-300 mb-4">
                  Since our prediction is always <MathExpr>y_{"{pred}"} = 0</MathExpr>, our residuals are just the original y-values. We square them and find the mean:
                </p>
                <ul className="text-sm text-slate-300 space-y-3 font-mono bg-slate-900/50 p-4 rounded-lg shadow-inner">
                  <li>(y₁ - 0)² = (2 - 0)² = <span className="text-emerald-400">4</span></li>
                  <li>(y₂ - 0)² = (3 - 0)² = <span className="text-emerald-400">9</span></li>
                  <li>(y₃ - 0)² = (5 - 0)² = <span className="text-emerald-400">25</span></li>
                </ul>
             </div>

             <div className="bg-slate-900 p-6 rounded-xl border border-rose-500/30 text-center shadow-lg">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Mean Squared Error J(0,0)</span>
                <div className="font-serif text-2xl text-white">
                  1/3 (4 + 9 + 25) = 38 / 3 <span className="text-rose-400 font-bold ml-2">≈ 12.67</span>
                </div>
                <p className="text-xs text-slate-400 mt-3">This is our starting error. Our goal is to reduce this number by finding better values for m and b.</p>
             </div>
          </div>

        </div>
      </div>
    </SlideFrame>
  );
};

const SlideNumericalGradient = () => {
  const [step, setStep] = useState(0);

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <div className="flex justify-between items-end mb-6 shrink-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Numerical Gradient Calculation</h2>
            <p className="text-slate-300 text-sm md:text-base">
              Now we plug our data points (1, 2), (2, 3), (3, 5) and current parameters (m=0, b=0) into the gradient formulas we derived earlier. Since m=0 and b=0, all our predictions (ŷ) are 0!
            </p>
          </div>
          <button 
            onClick={() => setStep((s) => (s + 1) % 4)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-md transition-all text-sm shrink-0 ml-4 flex items-center gap-2"
          >
            {step === 3 ? <><RotateCcw className="w-4 h-4"/> Reset</> : <><Play className="w-4 h-4"/> Next Step</>}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
          
          {/* Gradient w.r.t m */}
          <div className="flex flex-col gap-4">
             <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md">
               <h4 className="font-bold text-blue-400 mb-2 border-b border-slate-700 pb-2">Calculating ∂J/∂m</h4>
               <div className="font-serif text-lg text-slate-300 text-center py-2">
                 -2/3 [ Σ xᵢ(yᵢ - ŷᵢ) ]
               </div>
             </div>

             <div className="flex-grow space-y-3">
               <div className={`bg-slate-900 p-4 rounded-xl border transition-all duration-500 ${step >= 1 ? 'border-slate-600 opacity-100' : 'opacity-0 translate-y-4 hidden'}`}>
                 <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Plug in points:</span>
                 <div className="font-mono text-sm text-slate-300">
                   -2/3 [ 1(2-0) + 2(3-0) + 3(5-0) ]
                 </div>
               </div>
               <div className={`bg-slate-900 p-4 rounded-xl border transition-all duration-500 delay-100 ${step >= 2 ? 'border-slate-600 opacity-100' : 'opacity-0 translate-y-4 hidden'}`}>
                 <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Multiply:</span>
                 <div className="font-mono text-sm text-slate-300">
                   -2/3 [ 2 + 6 + 15 ]
                 </div>
               </div>
               <div className={`bg-slate-900 p-4 rounded-xl border-2 transition-all duration-500 delay-200 ${step >= 3 ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] opacity-100 scale-100' : 'opacity-0 scale-95 border-slate-800 hidden'}`}>
                 <span className="text-xs text-blue-400 font-bold uppercase block mb-1">Final Result:</span>
                 <div className="font-mono text-xl text-white font-bold">
                   -2/3 [ 23 ] = <span className="text-blue-400">-15.33</span>
                 </div>
               </div>
             </div>
          </div>

          {/* Gradient w.r.t b */}
          <div className="flex flex-col gap-4">
             <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md">
               <h4 className="font-bold text-emerald-400 mb-2 border-b border-slate-700 pb-2">Calculating ∂J/∂b</h4>
               <div className="font-serif text-lg text-slate-300 text-center py-2">
                 -2/3 [ Σ (yᵢ - ŷᵢ) ]
               </div>
             </div>

             <div className="flex-grow space-y-3">
               <div className={`bg-slate-900 p-4 rounded-xl border transition-all duration-500 ${step >= 1 ? 'border-slate-600 opacity-100' : 'opacity-0 translate-y-4 hidden'}`}>
                 <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Plug in points:</span>
                 <div className="font-mono text-sm text-slate-300">
                   -2/3 [ (2-0) + (3-0) + (5-0) ]
                 </div>
               </div>
               <div className={`bg-slate-900 p-4 rounded-xl border transition-all duration-500 delay-100 ${step >= 2 ? 'border-slate-600 opacity-100' : 'opacity-0 translate-y-4 hidden'}`}>
                 <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Add:</span>
                 <div className="font-mono text-sm text-slate-300">
                   -2/3 [ 2 + 3 + 5 ]
                 </div>
               </div>
               <div className={`bg-slate-900 p-4 rounded-xl border-2 transition-all duration-500 delay-200 ${step >= 3 ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] opacity-100 scale-100' : 'opacity-0 scale-95 border-slate-800 hidden'}`}>
                 <span className="text-xs text-emerald-400 font-bold uppercase block mb-1">Final Result:</span>
                 <div className="font-mono text-xl text-white font-bold">
                   -2/3 [ 10 ] = <span className="text-emerald-400">-6.67</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
        
        {/* Interpretation Bottom Bar */}
        <div className={`mt-4 bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-lg transition-all duration-1000 ${step === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`}>
           <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
             <div className="font-serif text-2xl text-white">
               ∇J(0,0) ≈ <span className="text-blue-400">-15.33</span>, <span className="text-emerald-400">-6.67</span>
             </div>
             <p className="text-sm text-slate-400 flex-1 border-l border-slate-600 pl-4">
               Both numbers are <strong>negative</strong>. This means increasing either <MathExpr>m</MathExpr> or <MathExpr>b</MathExpr> will make the error go <em>down</em>. Since <MathExpr>m</MathExpr> has a larger magnitude (-15.33), the cost is more sensitive to changing the slope right now.
             </p>
           </div>
        </div>

      </div>
    </SlideFrame>
  );
};

const SlideTakingAStep = () => {
  const dataPoints = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
  ];

  const m_new = 0.153;
  const b_new = 0.067;

  const initialLine = [{ x: 0, y: 0 }, { x: 4, y: 0 }];
  const newLine = [
    { x: 0, y: b_new },
    { x: 4, y: m_new * 4 + b_new }
  ];

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Taking a Small Step</h2>
        <p className="text-slate-300 text-lg mb-6">
          We have our gradient. Let's perform one step of Gradient Descent. We need to choose a <strong>learning rate (α)</strong> to control the step size. We will use a small value: <MathExpr>α = 0.01</MathExpr>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          
          {/* Math Update */}
          <div className="flex flex-col justify-center space-y-6">
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
               <h4 className="font-bold text-slate-200 mb-4 border-b border-slate-600 pb-2 flex items-center gap-2">
                 <MoveDown className="w-5 h-5 text-rose-400"/> The Update Rule
               </h4>
               <div className="space-y-4 font-mono text-sm text-slate-300">
                 <div className="bg-slate-900/50 p-3 rounded">
                   m<sub className="text-[10px]">new</sub> = m<sub className="text-[10px]">old</sub> - α(∂J/∂m)
                   <br/>
                   <span className="text-white">m<sub className="text-[10px]">new</sub> = 0 - 0.01(-15.33) = <span className="text-blue-400 font-bold text-base">0.153</span></span>
                 </div>
                 <div className="bg-slate-900/50 p-3 rounded">
                   b<sub className="text-[10px]">new</sub> = b<sub className="text-[10px]">old</sub> - α(∂J/∂b)
                   <br/>
                   <span className="text-white">b<sub className="text-[10px]">new</sub> = 0 - 0.01(-6.67) = <span className="text-emerald-400 font-bold text-base">0.067</span></span>
                 </div>
               </div>
             </div>

             <HighlightBox icon={CheckCircle} title="The Result" color="emerald">
               <p className="text-[15px]">
                 Our new parameters are approximately <MathExpr>m ≈ 0.153</MathExpr> and <MathExpr>b ≈ 0.067</MathExpr>. Our flat line has tilted upwards to become <MathExpr>y = 0.153x + 0.067</MathExpr>.
                 <br/><br/>
                 If we recalculate the cost <MathExpr>J(0.153, 0.067)</MathExpr>, it drops from 12.67 down to ~10.03! The algorithm successfully found a better line.
               </p>
             </HighlightBox>
          </div>

          {/* Visual Plot */}
          <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-xl p-6 flex flex-col min-h-[350px]">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Gradient Descent Step 1</h3>
            <div className="flex-grow w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="x" type="number" domain={[0, 4]} stroke="#94a3b8" tickCount={5} />
                  <YAxis domain={[0, 6]} stroke="#94a3b8" tickCount={7} />
                  
                  {/* Initial Line (faded) */}
                  <Line data={initialLine} type="linear" dataKey="y" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" opacity={0.4} dot={false} isAnimationActive={false} name="Initial Line" />
                  
                  {/* New Line */}
                  <Line data={newLine} type="linear" dataKey="y" stroke="#10b981" strokeWidth={3} dot={false} isAnimationActive={true} animationDuration={1500} name="New Line" />

                  {/* Data Points */}
                  <Scatter data={dataPoints} dataKey="y" fill="#3b82f6" name="Data Points" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
               <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span><span className="text-xs text-slate-400">Data Points</span></div>
               <div className="flex items-center gap-2"><span className="w-4 h-1 border-b-2 border-dashed border-rose-500/40"></span><span className="text-xs text-slate-400">Initial Line</span></div>
               <div className="flex items-center gap-2"><span className="w-4 h-1 border-b-2 border-solid border-emerald-500"></span><span className="text-xs text-emerald-400 font-bold">New Line (Step 1)</span></div>
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
    <div className="flex flex-col h-full bg-[#111111] overflow-hidden">
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
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
};

export default function CostFunctionCalculus6() {
  const slides = [
    { component: SlideRegressionVisualizer, title: 'Defining Cost' },
    { component: SlideMSEFormula, title: 'MSE Formula' },
    { component: SlideGradientM, title: 'Partial w.r.t m' },
    { component: SlideGradientB, title: 'Partial w.r.t b' },
    { component: SlideTheGradientVector, title: 'Assembling Gradient' },
    { component: SlideManualCalcIntro, title: 'Manual Calculation: Setup' },
    { component: SlideNumericalGradient, title: 'Numerical Gradient' },
    { component: SlideTakingAStep, title: 'Taking a Step' },
  ];

  return <Slideshow slides={slides} />;
}