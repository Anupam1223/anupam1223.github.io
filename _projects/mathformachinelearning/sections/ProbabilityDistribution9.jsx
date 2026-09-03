import React, { useState, useEffect } from 'react';
import { 
  Info,
  ChevronLeft,
  ChevronRight,
  Dices,
  Coins,
  Activity,
  Layers,
  ArrowRight,
  BarChart3,
  Waves,
  Target,
  CheckCircle2,
  XCircle,
  Percent,
  Calculator,
  SlidersHorizontal,
  TableProperties,
  MousePointerClick
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine
} from 'recharts';

export const meta = {
  title: '9. Probability Distributions (Part 1)',
  subtitle: 'Discrete and Continuous Foundations',
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

const SlideIntro = () => (
  <SlideFrame>
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">What are Probability Distributions?</h2>
      <p className="text-slate-300 text-lg mb-6 leading-relaxed">
        A probability distribution organizes and describes the probabilities of <em>all</em> possible outcomes of a random process. It is the fundamental blueprint for understanding variability and uncertainty in machine learning.
      </p>

      <HighlightBox icon={Activity} title="Random Variables" color="emerald">
        <p className="text-[15px] mb-4">
          Before we can distribute probabilities, we need a <strong>random variable</strong>. This is simply a variable whose value is a numerical outcome determined by chance. It maps real-world events to numbers.
        </p>
        <ul className="space-y-3 font-mono text-sm bg-slate-900 p-4 rounded-lg border border-slate-700 shadow-inner">
          <li><span className="text-emerald-400">Coin Flip:</span> Let X = 1 (Heads) or X = 0 (Tails).</li>
          <li><span className="text-blue-400">Die Roll:</span> Let Y = outcome on the top face (1, 2, 3, 4, 5, 6).</li>
          <li><span className="text-purple-400">Height:</span> Let H = exact height of a randomly selected adult in cm.</li>
        </ul>
      </HighlightBox>

      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-center flex-grow">
        <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-slate-700 pb-2">The Total Probability is Always 1</h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          Imagine you have exactly 1.0 (or 100%) of total probability. A probability distribution is simply the set of rules that tells you exactly how to carve up and "distribute" that 100% across every possible value your random variable can take.
        </p>
        <div className="flex items-center justify-center gap-4 bg-slate-800 py-4 rounded-xl shadow-inner border border-slate-700">
           <Percent className="w-8 h-8 text-emerald-500" />
           <span className="text-lg font-bold text-white">Total Probability = 100% (1.0)</span>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideDiscreteVsContinuous = () => (
  <SlideFrame>
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Two Main Categories</h2>
      <p className="text-slate-300 text-lg mb-8 leading-relaxed">
        Probability distributions fall into two completely different categories based on the type of random variable they are describing.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        
        {/* Discrete */}
        <div className="bg-slate-800 p-6 md:p-8 rounded-2xl border-t-4 border-t-blue-500 shadow-xl flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">1. Discrete Distributions</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            These describe random variables that can only take on a <strong>finite or countable</strong> number of specific, separate values (often integers). You can literally count the possible outcomes.
          </p>
          <ul className="space-y-4 text-sm text-slate-400 bg-slate-900/50 p-5 rounded-xl border border-slate-700 flex-grow">
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"/> The number of heads in 5 coin flips (0, 1, 2, 3, 4, 5).</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"/> The number of emails received in an hour.</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"/> The result of rolling a die (1, 2, 3, 4, 5, 6).</li>
          </ul>
        </div>

        {/* Continuous */}
        <div className="bg-slate-800 p-6 md:p-8 rounded-2xl border-t-4 border-t-emerald-500 shadow-xl flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Waves className="w-8 h-8 text-emerald-400" />
            <h3 className="text-2xl font-bold text-white">2. Continuous Distributions</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            These describe random variables that can take on <strong>any value</strong> within a given range or interval. There are infinitely many precise possibilities.
          </p>
          <ul className="space-y-4 text-sm text-slate-400 bg-slate-900/50 p-5 rounded-xl border border-slate-700 flex-grow">
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"/> The height of a person (175.2cm, 175.213cm...).</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"/> The exact temperature of a room.</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"/> The time it takes a process to complete.</li>
          </ul>
        </div>

      </div>
    </div>
  </SlideFrame>
);

const SlidePMF = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Probability Mass Function (PMF)</h2>
      <p className="text-slate-300 text-lg mb-6 leading-relaxed">
        For <strong>discrete</strong> distributions, we use a Probability Mass Function (PMF) to assign a specific probability "mass" to every single possible discrete outcome.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        
        <div className="flex flex-col gap-6">
           <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
             <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-slate-700 pb-2">The Notation</h3>
             <p className="text-sm text-slate-300 mb-4">
               We denote the PMF as <MathExpr>P(X = x)</MathExpr> or sometimes <MathExpr>p(x)</MathExpr>. This literally reads as "the probability that the random variable <MathExpr>X</MathExpr> is exactly equal to the specific value <MathExpr>x</MathExpr>".
             </p>
             <div className="bg-slate-800 p-4 rounded-lg font-mono text-center text-lg text-white shadow-inner border border-slate-700">
               P(X = x)
             </div>
           </div>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-center">
           <h3 className="text-xl font-bold text-emerald-400 mb-6 border-b border-slate-700 pb-2 flex items-center gap-2">
             <CheckCircle2 className="w-5 h-5"/> Two Golden Rules of the PMF
           </h3>
           
           <div className="space-y-6">
             <div>
               <h4 className="font-bold text-white text-base mb-2">1. Non-negativity</h4>
               <p className="text-sm text-slate-300 mb-2">You cannot have a negative chance of something happening. Every assigned probability must be ≥ 0.</p>
               <div className="bg-slate-900 p-3 rounded font-serif text-blue-300 text-center border border-slate-800">
                 P(X = x) ≥ 0
               </div>
             </div>

             <div>
               <h4 className="font-bold text-white text-base mb-2">2. Summation to One</h4>
               <p className="text-sm text-slate-300 mb-2">If you add up the probabilities for <em>every possible</em> value the variable can take, it must equal exactly 1 (100%).</p>
               <div className="bg-slate-900 p-3 rounded font-serif text-emerald-400 text-center border border-slate-800 text-xl">
                 Σ P(X = x) = 1
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  </SlideFrame>
);

const SlideVisualizePMF = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const fairData = [
    { face: '1', prob: 1/6 }, { face: '2', prob: 1/6 }, { face: '3', prob: 1/6 },
    { face: '4', prob: 1/6 }, { face: '5', prob: 1/6 }, { face: '6', prob: 1/6 }
  ];

  const loadedData = [
    { face: '1', prob: 0.05 }, { face: '2', prob: 0.05 }, { face: '3', prob: 0.1 },
    { face: '4', prob: 0.1 },  { face: '5', prob: 0.2 },  { face: '6', prob: 0.5 }
  ];

  const data = isLoaded ? loadedData : fairData;

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <div className="flex justify-between items-end mb-6 shrink-0">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Visualizing the PMF</h2>
            <p className="text-slate-300 text-lg">
              The easiest way to visualize a discrete PMF is a bar chart. Let's look at the random variable <MathExpr>Y</MathExpr>: the result of rolling a 6-sided die.
            </p>
          </div>
          <button 
            onClick={() => setIsLoaded(!isLoaded)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md flex items-center gap-2 ${isLoaded ? 'bg-rose-600 text-white hover:bg-rose-500' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
          >
            <Dices className="w-4 h-4"/> {isLoaded ? "Use Fair Die" : "Use Loaded Die"}
          </button>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col flex-grow min-h-[400px]">
           
           <div className="flex-grow w-full h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="face" stroke="#94a3b8" label={{ value: 'Die Face (Outcome y)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" domain={[0, 0.6]} tickFormatter={(val) => val.toFixed(2)} />
                  <Bar dataKey="prob" fill={isLoaded ? "#f43f5e" : "#3b82f6"} isAnimationActive={true} animationDuration={1000} />
                </BarChart>
             </ResponsiveContainer>
           </div>
           
           <div className="mt-4 bg-slate-800 p-4 rounded-xl border border-slate-700 text-center text-sm">
             {isLoaded ? (
               <span className="text-rose-300">
                 This is a <strong>Non-Uniform</strong> distribution. The mass is shifted, making 6 much more likely. But if you add the heights of all 6 bars (0.05 + 0.05 + 0.1 + 0.1 + 0.2 + 0.5), it still equals exactly 1.0!
               </span>
             ) : (
               <span className="text-blue-300">
                 This is a <strong>Discrete Uniform</strong> distribution. The total probability mass of 1.0 is distributed perfectly evenly across all 6 outcomes (each bar is ~0.167 tall).
               </span>
             )}
           </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideBernoulli = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Discrete Distribution: Bernoulli</h2>
      <p className="text-slate-300 text-lg mb-6 leading-relaxed">
        The <strong>Bernoulli distribution</strong> represents the absolute simplest discrete probability distribution. It describes a single experiment that has exactly <em>two</em> mutually exclusive outcomes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        
        <div className="flex flex-col gap-6">
           <HighlightBox icon={MousePointerClick} title="The Bernoulli Trial" color="blue">
             <p className="text-[14px] mb-4">
               We typically label the two outcomes as "Success" (<MathExpr>X=1</MathExpr>) and "Failure" (<MathExpr>X=0</MathExpr>).
             </p>
             <ul className="space-y-2 text-sm text-slate-300 font-mono">
               <li>• Coin Flip: Heads (1) vs Tails (0)</li>
               <li>• Email: Spam (1) vs Not Spam (0)</li>
               <li>• Ad Click: Clicked (1) vs Ignored (0)</li>
             </ul>
           </HighlightBox>

           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
             <h4 className="font-bold text-emerald-400 mb-2">The Parameter <MathExpr>p</MathExpr></h4>
             <p className="text-sm text-slate-300">
               The entire distribution depends on a single parameter, <MathExpr>p</MathExpr>, which is the probability of "success". Because the total probability must be 1, the probability of "failure" is automatically <MathExpr>1 - p</MathExpr>.
             </p>
           </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl flex flex-col justify-center">
           <h3 className="text-xl font-bold text-blue-400 mb-6 border-b border-slate-700 pb-2 flex items-center gap-2">
             <Calculator className="w-5 h-5"/> The PMF Formula
           </h3>
           
           <div className="space-y-6">
             <div className="text-lg text-white font-serif bg-slate-800 p-4 rounded-xl border border-slate-700 text-center shadow-inner">
                P(X = 1) = p <br/>
                P(X = 0) = 1 - p
             </div>

             <div className="text-sm text-slate-400 italic text-center">
               This is often written compactly as a single mathematical formula for <MathExpr>k \in {'{0, 1}'}</MathExpr>:
             </div>

             <div className="text-2xl text-emerald-400 font-serif bg-slate-800 p-4 rounded-xl border border-slate-700 text-center shadow-inner">
                P(X = k) = p<sup className="text-sm">k</sup>(1 - p)<sup className="text-sm">1-k</sup>
             </div>
             
             <p className="text-xs text-slate-500 text-center">
               If <MathExpr>k=1</MathExpr>, it becomes <MathExpr>p^1(1-p)^0 = p</MathExpr>. <br/>
               If <MathExpr>k=0</MathExpr>, it becomes <MathExpr>p^0(1-p)^1 = 1-p</MathExpr>.
             </p>
           </div>
        </div>

      </div>
    </div>
  </SlideFrame>
);

const SlideVisualizeBernoulli = () => {
  const [p, setP] = useState(0.7);

  const data = [
    { outcome: 'Failure (0)', failureProb: 1 - p, successProb: 0 },
    { outcome: 'Success (1)', failureProb: 0, successProb: p }
  ];

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Visualizing Bernoulli</h2>
        <p className="text-slate-300 text-lg mb-6">
          Adjust the probability of success (<MathExpr>p</MathExpr>) to see how the Bernoulli PMF shifts.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
          
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
              <label className="block text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider flex justify-between items-center">
                <span>Success Prob (p):</span>
                <span className="text-blue-400 bg-blue-900/30 px-3 py-1 rounded border border-blue-800/50">{p.toFixed(2)}</span>
              </label>
              <input 
                type="range" min="0" max="1" step="0.05" 
                value={p} onChange={(e) => setP(parseFloat(e.target.value))} 
                className="w-full accent-blue-500"
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-inner space-y-6">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">P(X = 1) : Success</div>
                <div className="font-mono text-3xl text-blue-400 font-bold">{p.toFixed(2)}</div>
              </div>
              <div className="border-t border-slate-800 pt-4">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">P(X = 0) : Failure</div>
                <div className="font-mono text-3xl text-slate-400 font-bold">{(1-p).toFixed(2)}</div>
                <div className="text-xs text-slate-500 mt-2">Calculated as 1 - p</div>
              </div>
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col min-h-[350px] relative overflow-hidden">
             
             <div className="w-full h-full min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="outcome" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={[0, 1]} tickCount={6} />
                    <Bar dataKey="failureProb" fill="#94a3b8" isAnimationActive={false} stackId="a" />
                    <Bar dataKey="successProb" fill="#3b82f6" isAnimationActive={false} stackId="a" />
                  </BarChart>
               </ResponsiveContainer>
             </div>

             <div className="text-center mt-2 text-sm text-slate-400 bg-slate-800/50 py-4 px-6 rounded-lg border border-slate-700 mx-4 mb-2 shadow-inner">
                The Bernoulli distribution is the fundamental building block for more complex distributions that deal with multiple trials, such as the Binomial distribution. Notice how the two bars always act like a seesaw&mdash;as one goes up, the other must go down to keep the total probability at 1.0!
             </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideBinomialIntro = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Discrete Distribution: Binomial</h2>
      <p className="text-slate-300 text-lg mb-6 leading-relaxed">
        Imagine you perform the same simple experiment multiple times, like flipping a coin 10 times. The Bernoulli distribution handles a single flip. The <strong>Binomial distribution</strong> models the number of "successes" in a fixed number of independent Bernoulli trials.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        
        <div className="flex flex-col gap-6">
           <HighlightBox icon={CheckCircle2} title="The 4 Binomial Conditions" color="emerald">
             <ul className="space-y-3 text-[14px]">
               <li><strong className="text-white">1. Fixed Trials (<MathExpr>n</MathExpr>):</strong> There is a specific, predetermined number of trials.</li>
               <li><strong className="text-white">2. Two Outcomes:</strong> Each trial results in either "success" or "failure".</li>
               <li><strong className="text-white">3. Constant Probability (<MathExpr>p</MathExpr>):</strong> The probability of success is exactly the same for every single trial.</li>
               <li><strong className="text-white">4. Independence:</strong> The outcome of one trial does not affect the outcome of another.</li>
             </ul>
           </HighlightBox>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-800 shadow-xl flex flex-col justify-center">
           <h3 className="text-xl font-bold text-blue-400 mb-6 border-b border-slate-700 pb-2 flex items-center gap-2">
             <Calculator className="w-5 h-5"/> The Binomial PMF Formula
           </h3>
           
           <div className="flex justify-center mb-6">
             <div className="font-serif text-xl md:text-2xl text-white bg-slate-800 px-6 py-4 rounded-xl border border-slate-700 shadow-inner flex items-center gap-2 flex-wrap">
               <span>P(X = k) =</span>
               <span className="text-blue-400 text-3xl mx-1">(<span className="inline-flex flex-col items-center align-middle text-lg leading-none -mt-1"><span className="mb-0.5">n</span><span>k</span></span>)</span>
               <span className="text-emerald-400">p<sup className="text-sm">k</sup></span>
               <span className="text-rose-400">(1-p)<sup className="text-sm">n-k</sup></span>
             </div>
           </div>

           <ul className="space-y-4 text-sm text-slate-300 border-t border-slate-800 pt-6">
             <li className="flex gap-3">
               <span className="text-blue-400 font-bold font-serif whitespace-nowrap">(n choose k)</span>
               <span><strong>Combinations:</strong> The number of different ways to arrange <MathExpr>k</MathExpr> successes among <MathExpr>n</MathExpr> trials. Calculated as <MathExpr>n! / (k!(n-k)!)</MathExpr>.</span>
             </li>
             <li className="flex gap-3">
               <span className="text-emerald-400 font-bold font-serif whitespace-nowrap">p^k</span>
               <span>The probability of getting exactly those <MathExpr>k</MathExpr> successes.</span>
             </li>
             <li className="flex gap-3">
               <span className="text-rose-400 font-bold font-serif whitespace-nowrap">(1-p)^(n-k)</span>
               <span>The probability of getting the remaining <MathExpr>n-k</MathExpr> failures.</span>
             </li>
           </ul>
        </div>

      </div>
    </div>
  </SlideFrame>
);

const SlideBinomialIntuition = () => {
  const [k, setK] = useState(2);
  const n = 3;
  const p = 0.6;
  const q = 0.4;

  const combos = {
    0: [{ seq: ['M', 'M', 'M'] }],
    1: [{ seq: ['H', 'M', 'M'] }, { seq: ['M', 'H', 'M'] }, { seq: ['M', 'M', 'H'] }],
    2: [{ seq: ['H', 'H', 'M'] }, { seq: ['H', 'M', 'H'] }, { seq: ['M', 'H', 'H'] }],
    3: [{ seq: ['H', 'H', 'H'] }]
  };

  const currentCombos = combos[k];
  const ways = currentCombos.length;
  const singleProb = Math.pow(p, k) * Math.pow(q, n - k);
  const totalProb = ways * singleProb;

  return (
    <SlideFrame>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Visualizing the Formula: 60% Free Throw Shooter</h2>
        <p className="text-slate-300 text-lg mb-6 leading-relaxed">
          Why does the Binomial formula multiply <MathExpr>p<sup className="text-[0.7em]">k</sup>(1-p)<sup className="text-[0.7em]">n-k</sup></MathExpr> by the coefficient <span className="inline-flex flex-col items-center align-middle text-[0.8em] leading-none mx-1 font-serif text-blue-300">(<span className="mb-0.5">n</span><span>k</span>)</span>? Let's visualize a basketball player taking <MathExpr>n=3</MathExpr> shots with a <MathExpr>p=0.6</MathExpr> make probability.
        </p>

        <div className="bg-slate-800 p-2 rounded-xl flex gap-2 w-full max-w-2xl mx-auto shadow-inner mb-2 border border-slate-700">
          {[0, 1, 2, 3].map(val => (
            <button
              key={val}
              onClick={() => setK(val)}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all shadow-md ${k === val ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
            >
              Makes (k = {val})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          {/* Combinations Visual */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col items-center relative min-h-[300px]">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2 w-full text-center">
              The {ways} Specific Way{ways !== 1 ? 's' : ''} to get exactly {k} Makes
            </h3>

            <div className="flex flex-col gap-6 w-full max-w-sm">
              {currentCombos.map((combo, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700 animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className="flex gap-4">
                    {combo.seq.map((shot, sIdx) => (
                      <div key={sIdx} className="flex flex-col items-center gap-2">
                        {shot === 'H' ? (
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        ) : (
                          <XCircle className="w-8 h-8 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                        )}
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {shot === 'H' ? '0.6' : '0.4'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="font-mono text-sm text-blue-300 font-bold bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                    = {singleProb.toFixed(3)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Math Breakdown */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md">
              <h4 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Why we need both parts</h4>
              
              <ul className="space-y-6 text-slate-300 text-sm">
                <li className="flex flex-col gap-2">
                  <strong className="text-blue-400 text-base">1. The Probability of ONE specific path:</strong>
                  <span>Whether they shoot Make-Make-Miss or Miss-Make-Make, the math is exactly the same: <MathExpr>0.6 × 0.6 × 0.4</MathExpr>. The order changes, but the product doesn't! This is <MathExpr>p<sup className="text-[0.7em]">k</sup>(1-p)<sup className="text-[0.7em]">n-k</sup></MathExpr>.</span>
                </li>
                
                <li className="flex flex-col gap-2">
                  <strong className="text-emerald-400 text-base">2. The Binomial Coefficient (How many paths?):</strong>
                  <span>We must multiply the single path's probability by the total number of valid paths (combinations). This is exactly what <span className="inline-flex flex-col items-center align-middle text-[0.8em] leading-none mx-1 font-serif text-blue-300">(<span className="mb-0.5">n</span><span>k</span>)</span> calculates!</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center shadow-xl">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Total Probability for k = {k}</div>
              <div className="font-serif text-2xl md:text-3xl text-white flex items-center justify-center flex-wrap gap-x-3 gap-y-4">
                <span className="text-emerald-400 font-bold">{ways}</span>
                <span className="text-slate-500">×</span>
                <span className="text-blue-400">{singleProb.toFixed(3)}</span>
                <span className="text-slate-500">=</span>
                <span className="text-white font-bold bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                  {(totalProb * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlidePascalsTriangle = () => {
  const [hoveredNode, setHoveredNode] = useState({ n: 4, k: 2, val: 6 });

  const numRows = 6;
  const triangle = [];
  for (let i = 0; i < numRows; i++) {
    const row = new Array(i + 1).fill(1);
    for (let j = 1; j < i; j++) {
      row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
    }
    triangle.push(row);
  }

  // Factorial helper
  const fact = (num) => (num <= 1 ? 1 : num * fact(num - 1));

  return (
    <SlideFrame>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Counting Ways with Pascal's Triangle</h2>
        <p className="text-slate-300 text-lg mb-6 leading-relaxed">
          The Binomial Coefficient <span className="inline-flex flex-col items-center align-middle text-[0.8em] leading-none mx-1 font-serif text-blue-300">(<span className="mb-0.5">n</span><span>k</span>)</span> perfectly maps to <strong>Pascal's Triangle</strong>. As we take more shots (<MathExpr>n</MathExpr>), the tree of possible outcome paths branches out exactly like this triangle.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          {/* Triangle Visualization */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col items-center justify-center relative min-h-[400px]">
            <div className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Rows = Shots Taken (n)
            </div>
            
            <div className="flex flex-col items-center gap-2 mt-4">
              {triangle.map((row, nIdx) => (
                <div key={`row-${nIdx}`} className="flex gap-2">
                  <div className="w-8 flex items-center justify-end text-xs font-mono text-slate-500 mr-4">n={nIdx}</div>
                  {row.map((val, kIdx) => {
                    const isHovered = hoveredNode.n === nIdx && hoveredNode.k === kIdx;
                    return (
                      <div
                        key={`node-${nIdx}-${kIdx}`}
                        onMouseEnter={() => setHoveredNode({ n: nIdx, k: kIdx, val })}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold font-serif text-sm md:text-base cursor-pointer transition-all duration-300 border-2 ${isHovered ? 'bg-emerald-500 border-emerald-400 text-white scale-125 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
                      >
                        {val}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="mt-8 text-xs text-slate-500 italic">Hover over any node to see its coefficient calculation.</div>
          </div>

          {/* Formula Breakdown Panel */}
          <div className="flex flex-col justify-center gap-6">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <h3 className="text-xl font-bold text-emerald-400 mb-6 border-b border-slate-700 pb-2">
                Calculating <span className="inline-flex flex-col items-center align-middle text-[0.8em] leading-none mx-1 font-serif text-emerald-400">(<span className="mb-0.5">{hoveredNode.n}</span><span>{hoveredNode.k}</span>)</span>
              </h3>

              <ul className="space-y-4 text-slate-300 mb-8 font-mono text-sm">
                <li><span className="text-slate-400 uppercase text-xs mr-2 block mb-1 font-sans font-bold">Total Trials (n)</span> {hoveredNode.n} shots taken</li>
                <li><span className="text-slate-400 uppercase text-xs mr-2 block mb-1 font-sans font-bold">Successes (k)</span> {hoveredNode.k} shots made</li>
              </ul>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-inner flex flex-col items-center">
                <div className="flex items-center text-2xl md:text-3xl font-serif text-white mb-6">
                  <span className="mr-6">
                    (<span className="inline-flex flex-col items-center text-xl leading-tight align-middle"><span className="mb-0.5">{hoveredNode.n}</span><span>{hoveredNode.k}</span></span>)
                  </span>
                  <span className="mr-6 text-slate-500">=</span>
                  <div className="flex flex-col items-center text-blue-300">
                    <span className="border-b border-slate-600 px-4 pb-1">{hoveredNode.n}!</span>
                    <span className="pt-1 text-slate-300">{hoveredNode.k}! ({hoveredNode.n} - {hoveredNode.k})!</span>
                  </div>
                </div>

                <div className="flex items-center text-xl md:text-2xl font-serif text-white">
                  <span className="mr-6 text-slate-500">=</span>
                  <div className="flex flex-col items-center text-blue-300">
                    <span className="border-b border-slate-600 px-4 pb-1">{fact(hoveredNode.n)}</span>
                    <span className="pt-1 text-slate-300">{fact(hoveredNode.k)} × {fact(hoveredNode.n - hoveredNode.k)}</span>
                  </div>
                  <span className="mx-6 text-slate-500">=</span>
                  <span className="text-emerald-400 font-bold bg-emerald-900/30 px-4 py-2 rounded-lg border border-emerald-500/50">
                    {hoveredNode.val} Ways
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideBinomialExamples = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl font-bold text-white mb-2">Binomial Examples in Action</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
        
        {/* Example 1: Coin Flips */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col">
           <h3 className="text-xl font-bold text-orange-400 mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
             <Coins className="w-5 h-5"/> Example: 10 Coin Flips
           </h3>
           <p className="text-sm text-slate-300 mb-4">
             Flipping a fair coin (<MathExpr>p = 0.5</MathExpr>) 10 times (<MathExpr>n = 10</MathExpr>). What is the probability of getting exactly 3 heads (<MathExpr>k = 3</MathExpr>)?
           </p>
           
           <ol className="space-y-4 text-sm font-mono bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 flex-grow list-decimal pl-5">
             <li className="text-slate-300">
               <span className="text-slate-400 block mb-1 font-sans font-bold">1. Combinations (10 choose 3):</span>
               10! / (3! * 7!) = (10*9*8) / (3*2*1) = <span className="text-blue-400 font-bold">120</span>
             </li>
             <li className="text-slate-300">
               <span className="text-slate-400 block mb-1 font-sans font-bold">2. Successes:</span>
               p^k = (0.5)³ = <span className="text-emerald-400 font-bold">0.125</span>
             </li>
             <li className="text-slate-300">
               <span className="text-slate-400 block mb-1 font-sans font-bold">3. Failures:</span>
               (1-p)^(n-k) = (0.5)⁷ = <span className="text-rose-400 font-bold">0.0078125</span>
             </li>
           </ol>

           <div className="mt-4 bg-slate-900 p-4 rounded-xl border border-slate-800 text-center font-serif text-lg text-white">
             P(X=3) = 120 × 0.125 × 0.0078125 <br/>
             <span className="text-orange-400 font-bold font-sans text-xl mt-2 block">≈ 11.72%</span>
           </div>
        </div>

        {/* Example 2: Quality Control */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
           <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
             <Layers className="w-5 h-5"/> Example: Quality Control
           </h3>
           <p className="text-sm text-slate-300 mb-4">
             A factory produces bulbs; 5% are defective (<MathExpr>p = 0.05</MathExpr>). In a random sample of 20 bulbs (<MathExpr>n = 20</MathExpr>), what is the probability that exactly 1 is defective (<MathExpr>k = 1</MathExpr>)?
           </p>
           
           <ol className="space-y-4 text-sm font-mono bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 flex-grow list-decimal pl-5">
             <li className="text-slate-300">
               <span className="text-slate-400 block mb-1 font-sans font-bold">1. Combinations (20 choose 1):</span>
               20! / (1! * 19!) = 20 / 1 = <span className="text-blue-400 font-bold">20</span>
             </li>
             <li className="text-slate-300">
               <span className="text-slate-400 block mb-1 font-sans font-bold">2. Successes (Defect):</span>
               p^k = (0.05)¹ = <span className="text-emerald-400 font-bold">0.05</span>
             </li>
             <li className="text-slate-300">
               <span className="text-slate-400 block mb-1 font-sans font-bold">3. Failures (Good Bulbs):</span>
               (1-p)^(n-k) = (0.95)¹⁹ ≈ <span className="text-rose-400 font-bold">0.3774</span>
             </li>
           </ol>

           <div className="mt-4 bg-slate-800 p-4 rounded-xl border border-slate-700 text-center font-serif text-lg text-white shadow-inner">
             P(X=1) ≈ 20 × 0.05 × 0.3774 <br/>
             <span className="text-blue-400 font-bold font-sans text-xl mt-2 block">≈ 37.74%</span>
           </div>
        </div>

      </div>
    </div>
  </SlideFrame>
);

const SlideVisualizeBinomial = () => {
  const [n, setN] = useState(20);
  const [p, setP] = useState(0.5);

  // Helper functions for combinations
  const factorial = (num) => {
    if (num <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) result *= i;
    return result;
  };
  
  const combination = (n, k) => factorial(n) / (factorial(k) * factorial(n - k));

  // Generate data
  const data = [];
  for (let k = 0; k <= n; k++) {
    const prob = combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    data.push({ k: k.toString(), prob: prob });
  }

  // Calculate Stats
  const mean = n * p;
  const variance = n * p * (1 - p);
  const stdDev = Math.sqrt(variance);

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Visualizing the Binomial Distribution</h2>
        <p className="text-slate-300 text-sm md:text-base mb-6">
          Adjust the number of trials (<MathExpr>n</MathExpr>) and the probability of success (<MathExpr>p</MathExpr>) to see how the shape of the PMF changes, along with its Mean and Variance.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
          
          {/* Controls & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-300 mb-2 flex justify-between">
                  <span>Number of Trials (n)</span>
                  <span className="text-blue-400 font-mono">{n}</span>
                </label>
                <input type="range" min="1" max="40" step="1" value={n} onChange={(e) => setN(parseInt(e.target.value))} className="w-full accent-blue-500" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-300 mb-2 flex justify-between">
                  <span>Prob. of Success (p)</span>
                  <span className="text-emerald-400 font-mono">{p.toFixed(2)}</span>
                </label>
                <input type="range" min="0.05" max="0.95" step="0.05" value={p} onChange={(e) => setP(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-inner space-y-4">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-between">
                  <span>Mean (Expected Value)</span>
                  <span className="text-blue-400/50 font-serif">μ = np</span>
                </div>
                <div className="font-mono text-2xl text-blue-400 font-bold">{mean.toFixed(2)}</div>
              </div>
              <div className="border-t border-slate-800 pt-3">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-between">
                  <span>Variance</span>
                  <span className="text-emerald-400/50 font-serif">σ² = np(1-p)</span>
                </div>
                <div className="font-mono text-2xl text-emerald-400 font-bold">{variance.toFixed(2)}</div>
              </div>
              <div className="border-t border-slate-800 pt-3">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-between">
                  <span>Standard Deviation</span>
                  <span className="text-purple-400/50 font-serif">σ = √Var</span>
                </div>
                <div className="font-mono text-2xl text-purple-400 font-bold">{stdDev.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-xl flex flex-col min-h-[350px]">
             <div className="w-full h-full min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis 
                       dataKey="k" stroke="#94a3b8" 
                       label={{ value: 'Number of Successes (k)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }} 
                    />
                    <YAxis stroke="#94a3b8" tickFormatter={(val) => val.toFixed(2)} />
                    <Bar dataKey="prob" fill="#3b82f6" isAnimationActive={false} />
                  </BarChart>
               </ResponsiveContainer>
             </div>

             <div className="text-center mt-2 text-sm text-slate-400 bg-slate-800/50 py-3 px-4 rounded-lg border border-slate-700">
                Notice that when <MathExpr>p = 0.5</MathExpr>, the distribution is perfectly symmetrical around the mean. When <MathExpr>p</MathExpr> moves towards 0 or 1, the distribution becomes <strong>skewed</strong>.
             </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlidePDFIntro = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Continuous Distributions & PDFs</h2>
      <p className="text-slate-300 text-lg mb-6 leading-relaxed">
        Probability Mass Functions (PMFs) work perfectly for discrete variables where we can list and assign a probability to every possible outcome. But what happens when a variable can take on <em>any</em> value within a continuous range (like exact height or temperature)?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        
        <div className="flex flex-col gap-6">
           <HighlightBox icon={XCircle} title="The Problem with Points" color="rose">
             <p className="text-[15px]">
               If a variable has infinitely many possible values (e.g., <MathExpr>175.000000001\dots</MathExpr> cm), the probability of it taking on any single, <em>exact</em> value is effectively zero. We can't distribute a total probability of 1 across an infinite number of discrete points!
             </p>
           </HighlightBox>

           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
             <h4 className="font-bold text-emerald-400 mb-3 border-b border-slate-700 pb-2 flex items-center gap-2">
               <Waves className="w-5 h-5"/> The Solution: Intervals
             </h4>
             <p className="text-sm text-slate-300 leading-relaxed">
               Instead of asking "What is the probability of being exactly 175cm?", we ask "What is the probability of being <em>between</em> 174cm and 176cm?". We calculate probability over <strong>intervals</strong> using a <strong>Probability Density Function (PDF)</strong>.
             </p>
           </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-800 shadow-xl flex flex-col justify-center relative overflow-hidden">
           <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
             <Activity className="w-5 h-5"/> The Math: Integrals
           </h3>
           <p className="text-sm text-slate-300 mb-6">
             For a PDF denoted as <MathExpr>f(x)</MathExpr>, the probability that the variable <MathExpr>X</MathExpr> falls between <MathExpr>a</MathExpr> and <MathExpr>b</MathExpr> is calculated by finding the <strong>area under the curve</strong> between those two points. Mathematically, this is an integral:
           </p>
           
           <div className="flex justify-center mb-6">
             <div className="font-serif text-2xl text-white bg-slate-800 px-8 py-6 rounded-xl border border-slate-700 shadow-inner flex items-center gap-4">
               <span>P(a ≤ X ≤ b) =</span>
               <div className="flex items-center text-4xl text-blue-400">
                 <div className="flex flex-col text-sm mr-1 mt-1 justify-between h-16">
                   <span>b</span>
                   <span>a</span>
                 </div>
                 <span className="font-light -mx-1">∫</span>
               </div>
               <span>f(x)dx</span>
             </div>
           </div>

           <p className="text-sm text-slate-400 italic text-center mt-auto">
             Don't worry if you aren't a calculus expert! The most important conceptual takeaway for Machine Learning is simply: <strong className="text-emerald-400">Area = Probability</strong>.
           </p>
        </div>

      </div>
    </div>
  </SlideFrame>
);

const SlidePDFVisualizer = () => {
  const [range, setRange] = useState([2, 5]);

  // Generate a bell-shaped curve (approx normal dist: mu=4, sigma=1.5)
  const data = [];
  const mu = 4;
  const sigma = 1.5;
  const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
  
  let shadedAreaProb = 0;

  for (let i = 0; i <= 8; i += 0.1) {
    const x = parseFloat(i.toFixed(1));
    const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
    const y = coeff * Math.exp(exponent);
    
    const isShaded = x >= range[0] && x <= range[1];
    
    // Rough Riemann sum for numerical integration (width * height)
    if (isShaded) shadedAreaProb += (y * 0.1); 

    data.push({
      x: x,
      curve: y,
      shaded: isShaded ? y : 0 // Triggers the shading
    });
  }

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Interpreting the PDF</h2>
        <p className="text-slate-300 text-lg mb-6">
          The height of the curve <MathExpr>f(x)</MathExpr> indicates <strong>density</strong>, not probability. To find the probability, you must calculate the area of the shaded region.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
          
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
               <h4 className="font-bold text-white mb-4 border-b border-slate-700 pb-2">Properties of a PDF</h4>
               <ul className="space-y-4 text-sm text-slate-300">
                 <li><strong className="text-emerald-400">1. Non-negativity:</strong> The density function must always be ≥ 0. You can't have negative likelihood. <MathExpr>f(x) ≥ 0</MathExpr>.</li>
                 <li><strong className="text-blue-400">2. Total Area = 1:</strong> The random variable must take on <em>some</em> value, so the area under the entire curve equals 1 (100%).</li>
               </ul>
             </div>

             <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-inner space-y-6">
               <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Adjust Interval [a, b]</div>
               
               <div className="flex items-center gap-4">
                 <label className="text-slate-400 font-mono w-4">a:</label>
                 <input type="range" min="0" max="8" step="0.1" value={range[0]} onChange={(e) => setRange([parseFloat(e.target.value), Math.max(parseFloat(e.target.value), range[1])])} className="w-full accent-rose-500" />
                 <span className="text-white font-mono w-8">{range[0].toFixed(1)}</span>
               </div>
               <div className="flex items-center gap-4">
                 <label className="text-slate-400 font-mono w-4">b:</label>
                 <input type="range" min="0" max="8" step="0.1" value={range[1]} onChange={(e) => setRange([Math.min(parseFloat(e.target.value), range[0]), parseFloat(e.target.value)])} className="w-full accent-rose-500" />
                 <span className="text-white font-mono w-8">{range[1].toFixed(1)}</span>
               </div>

               <div className="border-t border-slate-800 pt-4 text-center">
                 <span className="text-xs text-slate-500 uppercase tracking-widest block mb-1 font-bold">Calculated Area (Probability)</span>
                 <span className="text-3xl text-rose-400 font-serif font-bold">{(shadedAreaProb * 100).toFixed(1)}%</span>
               </div>
             </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-xl flex flex-col min-h-[350px]">
             <div className="w-full h-full min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="x" type="number" stroke="#94a3b8" tickCount={9} domain={[0, 8]} />
                    <YAxis stroke="#94a3b8" />
                    
                    {/* Full Curve */}
                    <Area type="monotone" dataKey="curve" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} isAnimationActive={false} />
                    
                    {/* Shaded Interval */}
                    <Area type="monotone" dataKey="shaded" stroke="none" fill="#f43f5e" fillOpacity={0.6} isAnimationActive={false} />
                  </ComposedChart>
               </ResponsiveContainer>
             </div>
             
             <div className="text-center mt-2 text-sm text-slate-400 bg-slate-800/50 py-3 rounded-lg border border-slate-700 mx-4">
                The shaded region represents <MathExpr>P({range[0].toFixed(1)} ≤ X ≤ {range[1].toFixed(1)})</MathExpr>. The total probability is exactly equal to the red shaded area.
             </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlidePDFNuances = () => {
  const [viewMode, setViewMode] = useState('interval'); // 'interval', 'point', 'spike'

  // Data generation based on view mode
  const data = [];
  const mu = 3;
  const sigma = viewMode === 'spike' ? 0.15 : 1;
  const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
  
  let shadedAreaProb = 0;

  for (let i = 0; i <= 6; i += 0.05) {
    const x = parseFloat(i.toFixed(2));
    const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
    const y = coeff * Math.exp(exponent);
    
    let isShaded = false;
    if (viewMode === 'interval') {
      isShaded = x >= 2.0 && x <= 4.0;
    } else if (viewMode === 'spike') {
      isShaded = true; // Shade the whole thing to show total area = 1
    }

    if (isShaded) shadedAreaProb += (y * 0.05);

    data.push({
      x: x,
      curve: y,
      shaded: isShaded ? y : 0
    });
  }

  return (
    <SlideFrame>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Nuances of the PDF</h2>
        <p className="text-slate-300 text-lg mb-4">
          Because continuous variables deal with infinity, the rules behave a bit differently than discrete PMFs. Let's explore the three most counter-intuitive facts about Probability Density Functions.
        </p>

        <div className="bg-slate-800 p-2 rounded-xl flex gap-2 w-full mx-auto shadow-inner mb-2 border border-slate-700">
          <button
            onClick={() => setViewMode('interval')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all shadow-md ${viewMode === 'interval' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
          >
            1. Relative Likelihood
          </button>
          <button
            onClick={() => setViewMode('point')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all shadow-md ${viewMode === 'point' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
          >
            2. Exact Points = 0
          </button>
          <button
            onClick={() => setViewMode('spike')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all shadow-md ${viewMode === 'spike' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
          >
            3. Density &gt; 1
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          
          {/* Dynamic Explanation Panel */}
          <div className="flex flex-col justify-center gap-6">
            {viewMode === 'interval' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <HighlightBox icon={Waves} title="f(x) is Density, NOT Probability" color="blue">
                  <p className="text-[15px] mb-4">
                    The value on the Y-axis <MathExpr>f(x)</MathExpr> represents <strong>density</strong>. A higher <MathExpr>f(x)</MathExpr> value compared to <MathExpr>f(y)</MathExpr> means the variable is <em>more likely</em> to be found in a small interval around <MathExpr>x</MathExpr> than around <MathExpr>y</MathExpr>.
                  </p>
                  <p className="text-[14px] text-slate-400 border-t border-blue-800/50 pt-3">
                    To get actual probability, we must calculate an Area: <MathExpr>Base × Height</MathExpr> (or mathematically, an integral over an interval).
                  </p>
                </HighlightBox>
              </div>
            )}

            {viewMode === 'point' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <HighlightBox icon={XCircle} title="Probability of an Exact Point is Zero" color="rose">
                  <p className="text-[15px] mb-4">
                    For a continuous variable, the probability of it taking an infinitely precise, exact value is zero: <MathExpr>P(X = 3) = 0</MathExpr>.
                  </p>
                  <p className="text-[15px] mb-4">
                    Why? Because probability is area. The interval from 3 to 3 has zero width. <MathExpr>Area = Height × 0 = 0</MathExpr>.
                  </p>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-center text-sm font-bold text-rose-300 shadow-inner">
                    Because boundaries hold 0 probability, <br/>
                    P(a ≤ X ≤ b) is EXACTLY the same as P(a &lt; X &lt; b).
                  </div>
                </HighlightBox>
              </div>
            )}

            {viewMode === 'spike' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <HighlightBox icon={Activity} title="Density Can Be Greater Than 1" color="emerald">
                  <p className="text-[15px] mb-4">
                    Look at the Y-axis! The density shoots all the way up to <strong>~2.6</strong>. How is this possible if probability cannot exceed 1?
                  </p>
                  <p className="text-[15px]">
                    Because <MathExpr>f(x)</MathExpr> is height, not area! If a distribution is extremely narrow (like this spike), the width (base) is tiny. Therefore, the height <em>must</em> be very tall to ensure the total area underneath the curve still equals exactly 1.0 (100%).
                  </p>
                </HighlightBox>
              </div>
            )}
          </div>

          {/* Interactive Chart Panel */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col justify-center min-h-[350px]">
             <div className="w-full h-full min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="x" type="number" stroke="#94a3b8" tickCount={7} domain={[0, 6]} />
                    <YAxis 
                       stroke="#94a3b8" 
                       domain={[0, viewMode === 'spike' ? 3 : 0.5]} 
                       tickCount={6}
                    />
                    
                    {/* Full Curve */}
                    <Area 
                      type="monotone" 
                      dataKey="curve" 
                      stroke={viewMode === 'spike' ? "#10b981" : (viewMode === 'point' ? "#f43f5e" : "#3b82f6")} 
                      fill={viewMode === 'spike' ? "#10b981" : (viewMode === 'point' ? "#f43f5e" : "#3b82f6")} 
                      fillOpacity={viewMode === 'spike' ? 0.3 : 0.1} 
                      strokeWidth={2} 
                      isAnimationActive={true} 
                      animationDuration={800}
                    />
                    
                    {/* Shaded Interval */}
                    {viewMode !== 'point' && (
                      <Area 
                        type="monotone" 
                        dataKey="shaded" 
                        stroke="none" 
                        fill={viewMode === 'spike' ? "#10b981" : "#3b82f6"} 
                        fillOpacity={0.6} 
                        isAnimationActive={true}
                      />
                    )}

                    {/* Exact Point Reference Line */}
                    {viewMode === 'point' && (
                      <ReferenceLine x={3} stroke="#f43f5e" strokeWidth={3} isFront={true} />
                    )}
                  </ComposedChart>
               </ResponsiveContainer>
             </div>

             <div className="text-center mt-4 font-serif text-xl md:text-2xl text-white bg-slate-800 py-3 rounded-lg border border-slate-700 shadow-inner">
                {viewMode === 'interval' && <span>P(2 ≤ X ≤ 4) ≈ 68.2%</span>}
                {viewMode === 'point' && <span className="text-rose-400">P(X = 3) = 0%</span>}
                {viewMode === 'spike' && <span className="text-emerald-400">Total Area = 100%</span>}
             </div>
          </div>

        </div>
      </div>
    </SlideFrame>
  );
};

const SlidePMFvsPDF = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">PMF vs. PDF: A Quick Comparison</h2>
      <p className="text-slate-300 text-lg mb-8">
        Let's summarize the key differences between the functions that define discrete and continuous probability distributions.
      </p>

      <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-x-auto flex-grow">
        <table className="w-full text-left text-sm text-slate-300 min-w-[600px] h-full">
          <thead className="bg-slate-800 text-slate-200 border-b border-slate-600">
            <tr>
              <th className="p-4 md:p-6 font-bold text-base"><TableProperties className="inline mr-2 w-5 h-5"/>Feature</th>
              <th className="p-4 md:p-6 font-bold text-blue-400 text-base">PMF (Discrete)</th>
              <th className="p-4 md:p-6 font-bold text-emerald-400 text-base">PDF (Continuous)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
             <tr className="hover:bg-slate-800/50 transition-colors">
               <td className="p-4 md:p-6 font-bold text-white">Applies to</td>
               <td className="p-4 md:p-6">Discrete Random Variables (countable)</td>
               <td className="p-4 md:p-6">Continuous Random Variables (intervals)</td>
             </tr>
             <tr className="hover:bg-slate-800/50 transition-colors bg-slate-900/50">
               <td className="p-4 md:p-6 font-bold text-white">Function Value</td>
               <td className="p-4 md:p-6"><MathExpr>P(X = x)</MathExpr> (Probability at an exact point)</td>
               <td className="p-4 md:p-6"><MathExpr>f(x)</MathExpr> (Density at a point, NOT probability)</td>
             </tr>
             <tr className="hover:bg-slate-800/50 transition-colors">
               <td className="p-4 md:p-6 font-bold text-white">Calculating Probability</td>
               <td className="p-4 md:p-6">Sum of PMF values over a set</td>
               <td className="p-4 md:p-6">Area (Integral) under PDF over an interval</td>
             </tr>
             <tr className="hover:bg-slate-800/50 transition-colors bg-slate-900/50">
               <td className="p-4 md:p-6 font-bold text-white">Value Range</td>
               <td className="p-4 md:p-6"><MathExpr>0 ≤ P(X=x) ≤ 1</MathExpr></td>
               <td className="p-4 md:p-6"><MathExpr>f(x) ≥ 0</MathExpr> (Density CAN be &gt; 1!)</td>
             </tr>
             <tr className="hover:bg-slate-800/50 transition-colors">
               <td className="p-4 md:p-6 font-bold text-white">Total Requirement</td>
               <td className="p-4 md:p-6"><MathExpr>Σ P(X=x) = 1</MathExpr></td>
               <td className="p-4 md:p-6"><MathExpr>∫ f(x)dx = 1</MathExpr></td>
             </tr>
          </tbody>
        </table>
      </div>

      <p className="text-slate-400 text-sm mt-4 italic text-center px-4">
        Understanding PDFs is critical in machine learning. Many algorithms assume features follow certain distributions (like the Normal distribution), allowing models to work with continuous measurements effectively and make probabilistic statements about continuous outcomes.
      </p>

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

export default function ProbabilityDistributions9() {
  const slides = [
    { component: SlideIntro, title: 'What are Probability Distributions?' },
    { component: SlideDiscreteVsContinuous, title: 'Discrete vs. Continuous' },
    { component: SlidePMF, title: 'Probability Mass Function' },
    { component: SlideVisualizePMF, title: 'Visualizing PMF' },
    { component: SlideBernoulli, title: 'Bernoulli Distribution' },
    { component: SlideVisualizeBernoulli, title: 'Visualizing Bernoulli' },
    { component: SlideBinomialIntro, title: 'Binomial Distribution' },
    { component: SlideBinomialIntuition, title: 'Visualizing Combinations' },
    { component: SlidePascalsTriangle, title: "Pascal's Triangle" },
    { component: SlideBinomialExamples, title: 'Binomial Examples' },
    { component: SlideVisualizeBinomial, title: 'Visualizing Binomial' },
    { component: SlidePDFIntro, title: 'Probability Density Function (PDF)' },
    { component: SlidePDFVisualizer, title: 'Interpreting the PDF' },
    { component: SlidePDFNuances, title: 'Density vs Probability' },
    { component: SlidePMFvsPDF, title: 'PMF vs. PDF Comparison' },
  ];

  return <Slideshow slides={slides} />;
}