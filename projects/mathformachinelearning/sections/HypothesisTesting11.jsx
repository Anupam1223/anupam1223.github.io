import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, Activity, Users, Target, RefreshCw, HelpCircle, Brain,
  Crosshair, Ruler, Scale, Gavel, Sigma, FlaskConical, AlertTriangle,
  CheckCircle2, XCircle, Lightbulb, GitCompare
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, ErrorBar, ComposedChart, Area, Cell
} from 'recharts';

// --- Shared math helpers ---
const normalPDF = (x, mu = 0, sigma = 1) => {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
};

const erfApprox = (x) => {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
};

const normalCDF = (x, mu = 0, sigma = 1) => {
  const z = (x - mu) / (sigma * Math.SQRT2);
  return 0.5 * (1 + erfApprox(z));
};

const buildBellCurve = (mu, sigma, xMin, xMax, step = 0.1) => {
  const data = [];
  for (let x = xMin; x <= xMax + 1e-9; x += step) {
    const xv = parseFloat(x.toFixed(2));
    data.push({ x: xv, y: normalPDF(xv, mu, sigma) });
  }
  return data;
};

// --- Shared Helper Components ---
const MathExpr = ({ children }) => (
  <span className="font-mono text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded text-[0.95em] inline-block mx-0.5">
    {children}
  </span>
);

const SliderControl = ({ label, value, min, max, step, onChange, accent = 'accent-blue-500', format = (v) => v, hint }) => (
  <div>
    <label className="text-sm font-bold text-slate-300 mb-2 flex justify-between uppercase tracking-wider gap-2">
      <span>{label}</span>
      <span className="text-blue-400 font-mono normal-case tracking-normal">{format(value)}</span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className={`w-full ${accent}`}
    />
    {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
  </div>
);

const SlideFrame = ({ title, children }) => (
  <div className="flex flex-col h-full bg-slate-950 p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-800">
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3 pb-4 border-b border-slate-800/80 shrink-0">
      <Activity className="text-blue-500" size={28} />
      {title}
    </h2>
    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
      {children}
    </div>
  </div>
);

// --- Slides ---

const SlideIntro = () => (
  <SlideFrame title="Drawing Conclusions from Data">
    <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
      <p>
        Summarizing a dataset's main features using tools like the mean, median, variance, and visualizations provides <strong>descriptive statistics</strong>. However, we often face a situation where the data we have is just a small piece of a much larger picture.
      </p>
      <div className="bg-slate-900 border-l-4 border-blue-500 p-5 rounded-r-xl">
        <p>
          Imagine you want to understand the typical download speed for <em>all</em> internet users in a country. You can't test every single connection. Instead, you test the speed for a few thousand users. This smaller group is your <strong className="text-white">sample</strong>, while everyone in the country is the <strong className="text-white">population</strong>.
        </p>
      </div>
      <p>
        The central task of <strong className="text-blue-400">statistical inference</strong> is answering: how can we use the information from our sample to say something meaningful about the entire population? 
      </p>
      <p>
        Statistical inference provides the methods for making generalizations, predictions, or decisions about a population based on data collected from a sample. It's about moving from simply describing <em>our</em> specific data points to drawing broader conclusions.
      </p>
    </div>
  </SlideFrame>
);

const SlideParameters = () => (
  <SlideFrame title="From Sample Clues to Population Truths">
    <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
      <p>
        Think of the population characteristic you're interested in, like the true average download speed. This true, often unknown, value for the entire population is called a <strong className="text-rose-400">parameter</strong>. We often use Greek letters to represent parameters, like <MathExpr>&mu;</MathExpr> (mu) for the population mean or <MathExpr>p</MathExpr> for the population proportion.
      </p>
      <p>
        Since we usually can't measure the entire population, we calculate a corresponding value from our sample. This calculated value is called a <strong className="text-blue-400">statistic</strong>. We often use regular letters, like <MathExpr>x̄</MathExpr> (x-bar) for the sample mean or <MathExpr>p̂</MathExpr> (p-hat) for the sample proportion.
      </p>
      
      {/* Visual Map */}
      <div className="my-10 p-8 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-center gap-8 relative overflow-hidden">
        {/* Sample Box */}
        <div className="bg-blue-950/40 border border-blue-500/50 p-6 rounded-xl text-center w-full md:w-1/2 z-10">
           <h3 className="text-blue-400 font-bold mb-2 uppercase tracking-widest text-sm">Sample</h3>
           <p className="text-slate-400 text-sm mb-4">(e.g., 500 Tested Users)</p>
           <div className="bg-blue-600 text-white font-medium py-3 px-4 rounded-full shadow-lg">
             Sample Mean Statistic (<MathExpr>x̄</MathExpr>)
             <div className="text-xs text-blue-200 mt-1">(Calculated)</div>
           </div>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center z-10">
           <span className="text-xs text-emerald-400 uppercase tracking-widest font-bold mb-2 text-center">Statistical<br/>Inference</span>
           <div className="w-12 h-1 bg-emerald-500/50 relative">
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-emerald-500/50 rotate-45"></div>
           </div>
           <span className="text-[10px] text-slate-500 mt-2">Estimate <MathExpr>&mu;</MathExpr> using <MathExpr>x̄</MathExpr></span>
        </div>

        {/* Population Box */}
        <div className="bg-rose-950/40 border border-rose-500/50 p-6 rounded-xl text-center w-full md:w-1/2 z-10">
           <h3 className="text-rose-400 font-bold mb-2 uppercase tracking-widest text-sm">Population</h3>
           <p className="text-slate-400 text-sm mb-4">(e.g., All Internet Users)</p>
           <div className="bg-rose-600 text-white font-medium py-3 px-4 rounded-full shadow-lg">
             True Mean Parameter (<MathExpr>&mu;</MathExpr>)
             <div className="text-xs text-rose-200 mt-1">(Unknown)</div>
           </div>
        </div>
      </div>
      
      <p className="text-center text-slate-400 italic text-sm">
        The core idea of inference is to use the known value of a statistic to make an informed guess about the unknown value of the corresponding parameter.
      </p>
    </div>
  </SlideFrame>
);

const SlideUncertaintyAndML = () => {
  // Three fictional samples of 500 users → slightly different x̄ values
  const sampleDraws = [
    { id: 1, label: 'Sample A', xBar: 48.2, color: 'bg-blue-500' },
    { id: 2, label: 'Sample B', xBar: 51.7, color: 'bg-emerald-500' },
    { id: 3, label: 'Sample C', xBar: 46.9, color: 'bg-violet-500' },
  ];
  const trueMu = 50;

  return (
    <SlideFrame title="Dealing with Uncertainty">
      <div className="space-y-8 text-slate-300 leading-relaxed text-lg">
        {/* ── Sampling Variability ─────────────────────────────────────── */}
        <div>
          <p>
            A significant aspect of statistical inference is acknowledging and handling uncertainty.
            If you took a <em>different</em> sample of 500 users from the same country, you'd likely
            get a slightly different sample average download speed (<MathExpr>x̄</MathExpr>).
            This variation from sample to sample is called{' '}
            <strong className="text-white">sampling variability</strong>.
          </p>

          {/* Visual: three samples vs true μ */}
          <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <HelpCircle size={16} className="text-amber-400" />
                Same population, different samples
              </h4>
              <span className="text-xs text-rose-400 font-mono">
                True μ = {trueMu} <span className="text-slate-500">(unknown in practice)</span>
              </span>
            </div>

            <div className="relative h-16 mb-6">
              {/* Number line track */}
              <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 bg-slate-800 rounded-full" />
              {/* True μ marker */}
              <div
                className="absolute top-0 bottom-0 flex flex-col items-center"
                style={{ left: '50%' }}
              >
                <div className="w-0.5 flex-1 bg-rose-500/80" />
                <span className="text-[10px] text-rose-400 font-bold mt-1 whitespace-nowrap">μ</span>
              </div>
              {/* Sample means as dots on the line (mapped ~40–60 → 0–100%) */}
              {sampleDraws.map((s) => {
                const pct = ((s.xBar - 40) / 20) * 100;
                return (
                  <div
                    key={s.id}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${pct}%` }}
                  >
                    <div className={`w-4 h-4 rounded-full ${s.color} ring-2 ring-slate-950 shadow-lg`} />
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sampleDraws.map((s) => (
                <div
                  key={s.id}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                      {s.label}
                    </span>
                  </div>
                  <div className="font-mono text-xl text-white">
                    x̄ = <span className="text-emerald-400">{s.xBar}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">n = 500 users</div>
                </div>
              ))}
            </div>

            <p className="text-sm text-slate-400 mt-4 text-center">
              Because <MathExpr>x̄</MathExpr> varies with the sample we draw, it's unlikely to equal{' '}
              <MathExpr>&mu;</MathExpr> exactly. Inference isn't only guessing — it's quantifying how
              much uncertainty surrounds that guess.
            </p>
          </div>
        </div>

        {/* ── Relevance to ML ──────────────────────────────────────────── */}
        <div>
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Brain className="text-violet-400" size={22} />
            Relevance to Machine Learning
          </h3>
          <p className="mb-4">
            These concepts are fundamental in machine learning. When you train a model, you typically
            use a <strong className="text-white">training dataset</strong> (a sample). You then
            evaluate performance on a separate <strong className="text-white">test dataset</strong>{' '}
            (another sample). The metric you calculate on the test set — accuracy, error rate, etc. —
            is a <strong className="text-blue-400">statistic</strong>.
          </p>
          <p className="mb-5">
            Your real goal is how well the model will perform on <em>new, unseen data</em> in the
            future (the population). Statistical inference helps answer:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-violet-950/30 border border-violet-800/40 rounded-xl p-4">
              <p className="text-sm text-violet-200 leading-relaxed">
                Is the accuracy measured on the test set a{' '}
                <strong className="text-white">reliable estimate</strong> of future performance?
              </p>
            </div>
            <div className="bg-violet-950/30 border border-violet-800/40 rounded-xl p-4">
              <p className="text-sm text-violet-200 leading-relaxed">
                If Model A beats Model B by a little on the test set, is that difference{' '}
                <strong className="text-white">genuine</strong> — or just sampling variability in
                which points landed in the test set?
              </p>
            </div>
          </div>

          {/* Mini train → test → future flow */}
          <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 text-center">
            <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 flex-1">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
                Training set
              </div>
              <div className="text-sm text-slate-200">Sample used to fit the model</div>
            </div>
            <span className="text-slate-600 hidden sm:block">→</span>
            <div className="bg-blue-950/40 border border-blue-700/40 rounded-xl px-4 py-3 flex-1">
              <div className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-1">
                Test set
              </div>
              <div className="text-sm text-slate-200">
                Statistic (e.g. accuracy = 91%)
              </div>
            </div>
            <span className="text-slate-600 hidden sm:block">→</span>
            <div className="bg-rose-950/40 border border-rose-700/40 rounded-xl px-4 py-3 flex-1">
              <div className="text-[10px] uppercase tracking-widest text-rose-400 font-bold mb-1">
                Future data
              </div>
              <div className="text-sm text-slate-200">True performance (unknown)</div>
            </div>
          </div>
        </div>

        {/* ── Roadmap of tools ─────────────────────────────────────────── */}
        <div>
          <h3 className="text-xl font-bold text-white mb-3">
            Main tools of statistical inference
          </h3>
          <p className="mb-5 text-base text-slate-400">
            In the following slides, we'll explore three complementary tools:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-700/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center mb-3">
                <Crosshair size={20} />
              </div>
              <h4 className="font-bold text-blue-400 mb-2">1. Point Estimation</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                A single-value statistic (like <MathExpr>x̄</MathExpr>) as our best guess for the
                population parameter (<MathExpr>&mu;</MathExpr>).
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-700/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3">
                <Ruler size={20} />
              </div>
              <h4 className="font-bold text-emerald-400 mb-2">2. Confidence Intervals</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                A range of values that likely contains the true parameter — giving a sense of the
                uncertainty around our guess.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-amber-700/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3">
                <Scale size={20} />
              </div>
              <h4 className="font-bold text-amber-400 mb-2">3. Hypothesis Testing</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                A formal framework for deciding whether sample evidence supports (or challenges)
                a claim about the population.
              </p>
            </div>
          </div>
          <p className="mt-6 text-center text-slate-400 text-sm italic">
            Understanding inference lets us draw more reliable conclusions from data — essential for
            building and evaluating effective machine learning models.
          </p>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlidePointEstimation = () => (
  <SlideFrame title="Point Estimation">
    <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
      <p>
        Statistical inference allows making educated guesses about a larger population using only data from a smaller sample. One of the most direct ways to do this is through <strong className="text-white">point estimation</strong>. A point estimate serves as our single "best guess" for the unknown parameter.
      </p>
      
      <div className="grid grid-cols-1 gap-4 mt-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
           <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
             <Target size={18}/> 1. Estimating Population Mean (<MathExpr>&mu;</MathExpr>)
           </h4>
           <p className="text-sm mb-3">The estimator for the population mean is the sample mean, <MathExpr>x̄</MathExpr>.</p>
           <div className="bg-slate-950 p-3 rounded border border-slate-800 text-center font-mono text-emerald-400">
             x̄ = (x₁ + x₂ + ... + xₙ) / n
           </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
           <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
             <Target size={18}/> 2. Estimating Population Proportion (<MathExpr>p</MathExpr>)
           </h4>
           <p className="text-sm mb-3">The estimator for the population proportion is the sample proportion, <MathExpr>p̂</MathExpr>.</p>
           <div className="bg-slate-950 p-3 rounded border border-slate-800 text-center font-mono text-emerald-400">
             p̂ = (Number of successes in sample) / n
           </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
           <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
             <Target size={18}/> 3. Estimating Population Variance (<MathExpr>&sigma;&sup2;</MathExpr>)
           </h4>
           <p className="text-sm mb-3">The estimator for population variance is the sample variance, <MathExpr>s&sup2;</MathExpr>.</p>
           <div className="bg-slate-950 p-3 rounded border border-slate-800 text-center font-mono text-emerald-400 mb-3">
             s&sup2; = &Sigma;(xᵢ - x̄)&sup2; / (n - 1)
           </div>
           <p className="text-xs text-slate-400">
             Notice the <MathExpr>n - 1</MathExpr> (Bessel's correction). Using <MathExpr>n - 1</MathExpr> instead of <MathExpr>n</MathExpr> makes <MathExpr>s&sup2;</MathExpr> an "unbiased" estimator, meaning it doesn't systematically underestimate the true variance.
           </p>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlidePointExample = () => {
  // AOV histogram data mapping to the screenshot
  const data = [
    { range: '20-40', count: 6 },
    { range: '40-60', count: 11 },
    { range: '60-80', count: 13 }, // Mean is in this bucket
    { range: '80-100', count: 11 },
    { range: '100-120', count: 7 },
    { range: '120-140', count: 2 },
  ];
  
  return (
    <SlideFrame title="Example: Estimating Average Order Value">
      <div className="space-y-4 flex flex-col h-full">
        <p className="text-slate-300 leading-relaxed text-lg">
          Let's say we run an e-commerce site and want to estimate the average order value (AOV) for <em>all</em> customers (the population parameter <MathExpr>&mu;</MathExpr>). We take a sample of 50 recent orders.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Code & Stats Panel */}
          <div className="lg:col-span-1 space-y-4">
             <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-inner font-mono text-sm text-slate-300 overflow-x-auto">
               <span className="text-purple-400">import</span> numpy <span className="text-purple-400">as</span> np<br/><br/>
               <span className="text-slate-500"># Calculate sample mean (point estimate)</span><br/>
               x_bar = np.mean(orders)<br/>
               <span className="text-slate-500"># Calculate sample std dev (ddof=1)</span><br/>
               s = np.std(orders, ddof=<span className="text-orange-400">1</span>)<br/>
             </div>
             <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-inner space-y-4">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-widest font-bold block">Sample Size (n)</span>
                  <span className="font-mono text-xl text-white">50</span>
                </div>
                <div className="pt-3 border-t border-slate-800">
                  <span className="text-xs text-blue-400 uppercase tracking-widest font-bold block">Point Est. AOV (<MathExpr>&mu;</MathExpr>)</span>
                  <span className="font-mono text-3xl text-blue-400 font-bold">$74.29</span>
                </div>
                <div className="pt-3 border-t border-slate-800">
                  <span className="text-xs text-slate-500 uppercase tracking-widest font-bold block">Point Est. Std Dev (<MathExpr>&sigma;</MathExpr>)</span>
                  <span className="font-mono text-xl text-white">$27.68</span>
                </div>
             </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-xl flex flex-col min-h-[300px]">
             <div className="flex-1 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 30, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="range" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    <ReferenceLine x="60-80" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" label={{ position: 'top', value: 'Sample Mean ($74.29)', fill: '#f43f5e', fontSize: 12 }} />
                  </BarChart>
               </ResponsiveContainer>
             </div>
             <p className="text-center text-slate-400 italic text-sm mt-2">
               The dashed red line indicates the calculated sample mean, which serves as our best guess point estimate for the unknown average order value of all customers.
             </p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideSamplingVariability = () => {
  const [samples, setSamples] = useState([]);
  const [currentSamplePoints, setCurrentSamplePoints] = useState([]);
  const popMean = 100;

  const drawSample = () => {
    // Generate normally distributed random points using Box-Muller
    const generateNormal = (mean, stdDev) => {
      const u = 1 - Math.random();
      const v = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      return z * stdDev + mean;
    };

    const newPoints = Array.from({ length: 10 }, () => ({
      x: generateNormal(popMean, 15),
      y: Math.random() * 40 + 30 // Spread vertically for visual clarity
    }));

    const sampleMean = newPoints.reduce((sum, p) => sum + p.x, 0) / 10;

    setCurrentSamplePoints(newPoints);
    setSamples(prev => [...prev, { mean: sampleMean, id: prev.length + 1 }]);
  };

  const reset = () => {
    setSamples([]);
    setCurrentSamplePoints([]);
  };

  const historicalPoints = samples.map(s => ({ x: s.mean, y: 10 }));

  return (
    <SlideFrame title="Dealing with Uncertainty">
      <div className="space-y-6 flex flex-col h-full">
        <p className="text-slate-300 leading-relaxed text-lg shrink-0">
          Why is a point estimate not enough? Because of <strong className="text-white">sampling variability</strong>. If you take a different random sample, you get a different point estimate. Let's draw samples of size <code className="text-teal-400 bg-teal-400/10 font-mono px-1.5 py-0.5 rounded text-sm">n=10</code> from a hidden population.
        </p>

        <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col relative shadow-inner min-h-[400px]">
           {/* Header Controls */}
           <div className="flex justify-between items-center mb-4 z-10 shrink-0">
              <div className="flex gap-3">
                <button
                  onClick={drawSample}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-semibold transition-all active:scale-95 shadow-md"
                >
                  <Users size={18} />
                  Draw New Sample
                </button>
                <button
                  onClick={reset}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all active:scale-95 border border-slate-700 shadow-md"
                >
                  Reset
                </button>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold block mb-1">Samples Drawn</span>
                <span className="text-3xl text-blue-400 font-mono font-bold leading-none">{samples.length}</span>
              </div>
           </div>

           {/* Chart Area */}
           <div className="flex-1 w-full relative bg-slate-950/50 rounded-xl border border-slate-800/50 p-4">
             <ResponsiveContainer width="100%" height="100%">
               <ScatterChart margin={{ top: 30, right: 20, bottom: 20, left: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                 
                 {/* Explicitly defined axes ensure rendering even with empty data */}
                 <XAxis type="number" dataKey="x" name="Value" domain={[40, 160]} stroke="#94a3b8" tickCount={7} />
                 <YAxis type="number" dataKey="y" name="Height" domain={[0, 100]} hide={true} />
                 <ZAxis type="number" range={[60, 60]} /> 

                 {/* The unknown population mean */}
                 <ReferenceLine x={popMean} stroke="#475569" strokeDasharray="5 5" label={{ position: 'top', value: 'True Population Mean (Unknown)', fill: '#64748b', fontSize: 12 }} />

                 {/* Current Sample Mean Line */}
                 {samples.length > 0 && (
                   <ReferenceLine x={samples[samples.length - 1].mean} stroke="#f43f5e" strokeWidth={2} label={{ position: 'bottom', value: `Sample Mean: ${samples[samples.length - 1].mean.toFixed(1)}`, fill: '#f43f5e', fontSize: 12, fontWeight: 'bold' }} />
                 )}

                 {/* Scatter points for the current sample */}
                 <Scatter name="Current Sample" data={currentSamplePoints} fill="#3b82f6" opacity={0.6} />

                 {/* Scatter points for historical means - shown as small crosses along the bottom */}
                 <Scatter name="Historical Means" data={historicalPoints} fill="#f43f5e" shape="cross" opacity={0.8} />
               </ScatterChart>
             </ResponsiveContainer>

             {/* Empty State Overlay */}
             {samples.length === 0 && (
               <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <div className="bg-slate-800/90 text-slate-200 px-8 py-5 rounded-xl shadow-2xl border border-slate-700 text-center animate-pulse">
                     <p className="text-xl font-bold text-white mb-2">Awaiting Data</p>
                     <p className="text-sm text-slate-400">Click 'Draw New Sample' to begin</p>
                  </div>
               </div>
             )}
           </div>

           {/* Footer description */}
           <div className="mt-4 shrink-0 bg-slate-800/60 p-4 rounded-lg border border-slate-700 text-center text-sm text-emerald-400 font-medium min-h-[70px] flex items-center justify-center">
              {samples.length === 0 ? (
                <p>As you draw more samples, you can see the uncertainty. A single point doesn't tell us how far off we might be. We need an interval!</p>
              ) : (
                <p>Notice how each new sample (blue dots) yields a slightly different point estimate! It's rarely <em>exactly</em> on the red line.</p>
              )}
           </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideConfidenceInterval = () => (
  <SlideFrame title="Interval Estimation: Confidence Intervals">
    <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
      <p>
        Because of sampling variability, a point estimate doesn't tell us how much the estimate might vary from sample to sample. This is where <strong className="text-white">interval estimation</strong> comes in. 
      </p>
      <p>
        Instead of providing just one number, an interval estimate gives us a <em>range</em> of plausible values for the population parameter. This range is called a <strong className="text-blue-400">confidence interval</strong>.
      </p>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl my-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <h3 className="text-xl font-bold text-white mb-4">Understanding the Confidence Level</h3>
        <p className="mb-4 text-sm text-slate-400">
          The confidence level (commonly 90%, 95%, or 99%) represents how confident we are in the <em>process</em> used to generate the interval.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-xl">
             <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
               <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</span> Correct Interpretation
             </h4>
             <p className="text-sm">
               If we were to repeat our sampling process many, many times, we would expect about 95% of those calculated intervals to capture the true, fixed (but unknown) population parameter.
             </p>
          </div>
          <div className="bg-rose-950/30 border border-rose-900/50 p-4 rounded-xl">
             <h4 className="text-rose-400 font-bold mb-2 flex items-center gap-2">
               <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs">✗</span> Common Misinterpretation
             </h4>
             <p className="text-sm">
               It does <em>not</em> mean there is a 95% probability that the true parameter lies within <em>one specific calculated interval</em>. The true parameter is fixed; it doesn't jump in and out of your interval.
             </p>
          </div>
        </div>
      </div>
      
      <p className="italic text-slate-400 text-center text-base">
        Think of it like tossing rings onto a fixed peg. The confidence level tells you the success rate of your ring-tossing method. For any single toss, the ring either landed on the peg or it didn't.
      </p>
    </div>
  </SlideFrame>
);

const SlideCIVisualizer = () => {
  const [intervals, setIntervals] = useState([]);
  const [revealed, setRevealed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const truePopMean = 100;
  const popStd = 15;
  const sampleSize = 25;
  const z95 = 1.96;

  const generateIntervals = (animate = true) => {
    const newIntervals = [];

    for (let i = 1; i <= 20; i++) {
      // Realistic sample: draw n points from N(μ, σ), build 95% CI for the mean
      let sum = 0;
      for (let j = 0; j < sampleSize; j++) {
        const u = 1 - Math.random();
        const v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        sum += truePopMean + z * popStd;
      }
      const center = sum / sampleSize;
      const se = popStd / Math.sqrt(sampleSize);
      const marginOfError = z95 * se;
      const lower = center - marginOfError;
      const upper = center + marginOfError;
      const captured = truePopMean >= lower && truePopMean <= upper;

      newIntervals.push({
        id: i,
        x: center,
        y: i,
        error: marginOfError,
        lower,
        upper,
        captured,
      });
    }

    // Guarantee at least one miss so the lesson is visible
    if (newIntervals.every((iv) => iv.captured)) {
      const idx = Math.floor(Math.random() * 20);
      const missCenter = truePopMean + (Math.random() > 0.5 ? 1 : -1) * (newIntervals[idx].error + 2 + Math.random() * 3);
      newIntervals[idx] = {
        ...newIntervals[idx],
        x: missCenter,
        lower: missCenter - newIntervals[idx].error,
        upper: missCenter + newIntervals[idx].error,
        captured: false,
      };
    }

    setIntervals(newIntervals);
    if (animate) {
      setRevealed(0);
      setIsAnimating(true);
    } else {
      setRevealed(20);
      setIsAnimating(false);
    }
  };

  useEffect(() => {
    generateIntervals(true);
  }, []);

  useEffect(() => {
    if (!isAnimating || revealed >= 20) {
      if (revealed >= 20) setIsAnimating(false);
      return undefined;
    }
    const t = setTimeout(() => setRevealed((r) => r + 1), 90);
    return () => clearTimeout(t);
  }, [isAnimating, revealed]);

  const visible = intervals.slice(0, revealed);
  const capturedCount = visible.filter((i) => i.captured).length;
  const missedCount = visible.length - capturedCount;
  const missed = visible.filter((i) => !i.captured);
  const captured = visible.filter((i) => i.captured);
  const latestMiss = missed.length > 0 ? missed[missed.length - 1] : null;
  const done = revealed >= 20 && intervals.length > 0;

  return (
    <SlideFrame title="Visualizing 95% Confidence Intervals">
      <div className="space-y-4 flex flex-col h-full text-slate-300">
        {/* Plain-English intro */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shrink-0">
          <p className="text-base leading-relaxed">
            Imagine the <span className="text-rose-400 font-semibold">red dashed line</span> is the <em>true</em> average
            (like the real average height of everyone — unknown in real life).
            Each <span className="text-blue-400 font-semibold">blue bar</span> is one sample&apos;s guess:
            &ldquo;I think the truth is somewhere in this range.&rdquo;
          </p>
          <p className="text-sm text-slate-400 mt-2">
            With a <strong className="text-white">95% confidence</strong> method, about <strong className="text-white">19 of 20</strong> bars
            should cross the red line. Roughly <strong className="text-amber-400">1 of 20 misses</strong> — not a mistake, just chance.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
          {/* Chart */}
          <div className="flex-1 bg-slate-900 rounded-2xl p-3 border border-slate-700 shadow-xl flex flex-col min-h-[280px]">
            <div className="flex items-center justify-between px-2 mb-1 shrink-0 gap-2 flex-wrap">
              <div className="flex gap-3 text-[11px]">
                <span className="flex items-center gap-1.5 text-blue-300">
                  <span className="w-3 h-0.5 bg-blue-400 inline-block" /> Hit (covers truth)
                </span>
                <span className="flex items-center gap-1.5 text-amber-300">
                  <span className="w-3 h-0.5 bg-amber-400 inline-block" /> Miss (missed truth)
                </span>
                <span className="flex items-center gap-1.5 text-rose-300">
                  <span className="w-3 h-0.5 border-t border-dashed border-rose-400 inline-block" /> True mean = 100
                </span>
              </div>
              <button
                onClick={() => generateIntervals(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all active:scale-95 shrink-0"
              >
                <RefreshCw size={14} />
                Draw 20 new samples
              </button>
            </div>

            <div className="flex-1 min-h-[240px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 28, right: 24, bottom: 16, left: 36 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis
                    type="number"
                    dataKey="x"
                    domain={[75, 125]}
                    stroke="#94a3b8"
                    tickCount={6}
                    label={{ value: 'Estimated mean →', position: 'insideBottom', offset: -4, fill: '#64748b', fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    domain={[0.5, 20.5]}
                    tickCount={5}
                    reversed
                    stroke="#94a3b8"
                    width={32}
                    tickFormatter={(v) => (Number.isInteger(v) ? `#${v}` : '')}
                    label={{ value: 'Sample', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
                  />
                  <ZAxis type="number" range={[50, 50]} />

                  <ReferenceLine
                    x={truePopMean}
                    stroke="#f43f5e"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{
                      position: 'top',
                      value: 'True mean (μ)',
                      fill: '#f43f5e',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />

                  {captured.length > 0 && (
                    <Scatter data={captured} fill="#3b82f6" isAnimationActive={false}>
                      <ErrorBar dataKey="error" direction="x" width={5} strokeWidth={2.5} stroke="#3b82f6" />
                    </Scatter>
                  )}

                  {missed.length > 0 && (
                    <Scatter data={missed} fill="#fbbf24" isAnimationActive={false}>
                      <ErrorBar dataKey="error" direction="x" width={5} strokeWidth={3} stroke="#fbbf24" />
                    </Scatter>
                  )}
                </ScatterChart>
              </ResponsiveContainer>

              {latestMiss && (
                <div className="absolute right-3 top-10 bg-amber-950/90 border border-amber-500/50 text-amber-200 text-xs px-3 py-2 rounded-lg shadow-lg max-w-[160px] animate-in fade-in duration-300">
                  <strong className="text-amber-400">Sample #{latestMiss.id} missed!</strong>
                  <p className="mt-1 text-amber-200/80 leading-snug">
                    Its whole range sits away from the red line — happens ~5% of the time.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Side explainer */}
          <div className="lg:w-64 shrink-0 flex flex-col gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Samples drawn</div>
                <div className="font-mono text-2xl text-white">{visible.length}<span className="text-slate-600 text-lg">/20</span></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-950/40 border border-blue-900/50 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-blue-400 font-bold uppercase">Hits</div>
                  <div className="font-mono text-xl text-blue-300">{capturedCount}</div>
                </div>
                <div className="bg-amber-950/40 border border-amber-900/50 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">Misses</div>
                  <div className="font-mono text-xl text-amber-300">{missedCount}</div>
                </div>
              </div>
              {done && (
                <p className="text-xs text-slate-400 leading-relaxed text-center">
                  {missedCount === 0
                    ? 'Lucky run — every interval hit. Try again; you should usually see ~1 miss.'
                    : `Got ${missedCount} miss${missedCount === 1 ? '' : 'es'}. That’s the “5%” in 95% confidence.`}
                </p>
              )}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2.5 leading-relaxed flex-1">
              <p className="text-slate-200 font-semibold text-sm">Ring-toss analogy</p>
              <p>
                The red line is a <em>fixed peg</em>. Each sample tosses a ring (the blue bar).
              </p>
              <p>
                <strong className="text-blue-300">95%</strong> is how often your tossing method lands on the peg — not a probability that this one ring contains it.
              </p>
              <p>
                Once a bar is drawn, it either covers the truth or it doesn’t. Rerun to see the long-run ~95% hit rate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideCIWidth = () => {
  const [n, setN] = useState(50);
  const [conf, setConf] = useState(0.95);
  const [s, setS] = useState(28);
  const xBar = 74.29;

  // z approx for common levels; interpolate roughly for slider
  const zCrit = conf >= 0.99 ? 2.576 : conf >= 0.95 ? 1.96 : conf >= 0.9 ? 1.645 : 1.28;
  const moe = zCrit * (s / Math.sqrt(n));
  const lower = xBar - moe;
  const upper = xBar + moe;

  const chartData = [{ x: xBar, y: 0, err: moe }];

  return (
    <SlideFrame title="What Influences Interval Width?">
      <div className="space-y-5 text-slate-300 leading-relaxed">
        <p className="text-lg">
          A narrower interval means a more precise estimate. Play with the three knobs that control width —
          the formula is <MathExpr>CI = x̄ ± z·(s/√n)</MathExpr>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <SliderControl
              label="Sample size (n)"
              value={n}
              min={10}
              max={500}
              step={10}
              onChange={setN}
              accent="accent-blue-500"
              format={(v) => Math.round(v)}
              hint="Larger n → narrower interval"
            />
            <SliderControl
              label="Confidence level"
              value={conf}
              min={0.8}
              max={0.99}
              step={0.01}
              onChange={setConf}
              accent="accent-rose-500"
              format={(v) => `${Math.round(v * 100)}%`}
              hint="Higher confidence → wider net"
            />
            <SliderControl
              label="Std. deviation (s)"
              value={s}
              min={5}
              max={60}
              step={1}
              onChange={setS}
              accent="accent-violet-500"
              format={(v) => v.toFixed(0)}
              hint="More spread → more uncertainty"
            />
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
                {Math.round(conf * 100)}% confidence interval
              </div>
              <div className="font-mono text-lg text-emerald-400">
                [{lower.toFixed(1)}, {upper.toFixed(1)}]
              </div>
              <div className="text-xs text-slate-500 mt-1">
                width = {(2 * moe).toFixed(1)} · MoE = ±{moe.toFixed(1)} · z≈{zCrit}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-2xl p-4 min-h-[280px]">
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart margin={{ top: 30, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis type="number" dataKey="x" domain={[40, 110]} stroke="#94a3b8" />
                <YAxis type="number" dataKey="y" hide domain={[-1, 1]} />
                <ZAxis type="number" range={[80, 80]} />
                <ReferenceLine x={xBar} stroke="#64748b" strokeDasharray="4 4" label={{ value: 'x̄', fill: '#94a3b8', position: 'top' }} />
                <Scatter data={chartData} fill="#3b82f6">
                  <ErrorBar dataKey="err" direction="x" width={8} strokeWidth={3} stroke="#3b82f6" />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-3 mt-2 text-center text-xs">
              <div className="bg-blue-950/30 border border-blue-900/40 rounded-lg p-2">
                <span className="text-blue-400 font-bold">↑ n</span>
                <p className="text-slate-400 mt-1">shrinks MoE by √n</p>
              </div>
              <div className="bg-rose-950/30 border border-rose-900/40 rounded-lg p-2">
                <span className="text-rose-400 font-bold">↑ confidence</span>
                <p className="text-slate-400 mt-1">bigger critical z</p>
              </div>
              <div className="bg-violet-950/30 border border-violet-900/40 rounded-lg p-2">
                <span className="text-violet-400 font-bold">↑ s</span>
                <p className="text-slate-400 mt-1">more noisy data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

// ─── Connecting Inference → ML ───────────────────────────────────────────────

const SlideMLEvaluation = () => (
  <SlideFrame title="Connecting Inference to ML Evaluation">
    <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
      <p>
        Statistical inference is how we go from a <em>sample</em> (your test set) to claims about a
        <em> population</em> (all future unseen data). Three tools show up constantly in model evaluation:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <Crosshair className="text-blue-400 mb-3" size={22} />
          <h4 className="font-bold text-blue-400 mb-2">Point Estimates</h4>
          <p className="text-sm text-slate-400">
            Test accuracy, F1, MSE — single numbers that estimate true future performance.
          </p>
          <div className="mt-3 font-mono text-xs text-emerald-400 bg-slate-950 p-2 rounded">
            âcc = 0.92
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <Ruler className="text-emerald-400 mb-3" size={22} />
          <h4 className="font-bold text-emerald-400 mb-2">Confidence Intervals</h4>
          <p className="text-sm text-slate-400">
            &ldquo;We are 95% confident true accuracy lies between 89% and 95%.&rdquo; Bigger test sets → tighter intervals.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <Scale className="text-amber-400 mb-3" size={22} />
          <h4 className="font-bold text-amber-400 mb-2">Hypothesis Testing</h4>
          <p className="text-sm text-slate-400">
            Is Model B&apos;s 87% vs Model A&apos;s 85% a real win — or just noise in the test set?
          </p>
        </div>
      </div>
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-5">
        <p className="text-base">
          Without inference we over-interpret tiny metric gains. The next slides give you a formal
          framework — <MathExpr>H₀</MathExpr>, <MathExpr>H₁</MathExpr>, <MathExpr>p</MathExpr>, and{' '}
          <MathExpr>α</MathExpr> — so you can decide when a difference is statistically significant.
        </p>
      </div>
    </div>
  </SlideFrame>
);

const SlideModelCompareIntro = () => {
  const data = [
    { name: 'Model A', acc: 0.85, err: 0.03 },
    { name: 'Model B', acc: 0.87, err: 0.025 },
  ];

  return (
    <SlideFrame title="Why Point Estimates Aren't Enough">
      <div className="space-y-5 text-slate-300 leading-relaxed">
        <p className="text-lg">
          Model A hits 85% accuracy, Model B hits 87%. Is B truly better? Look at the overlapping
          confidence intervals — the gap might just be sampling noise.
        </p>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis domain={[0.75, 0.95]} stroke="#94a3b8" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
              <Bar dataKey="acc" radius={[6, 6, 0, 0]} fill="#3b82f6">
                {data.map((d, i) => (
                  <Cell key={d.name} fill={i === 0 ? '#3b82f6' : '#10b981'} />
                ))}
                <ErrorBar dataKey="err" width={6} strokeWidth={2} stroke="#e2e8f0" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-slate-400 text-center italic">
          Bars = point estimates. Error bars = 95% CIs. Heavy overlap → the 2% gap may not be statistically significant.
          Hypothesis testing gives a formal p-value for that question.
        </p>
      </div>
    </SlideFrame>
  );
};

// ─── Hypothesis Testing Basics ───────────────────────────────────────────────

const SlideHypothesisIntro = () => (
  <SlideFrame title="Hypothesis Testing: The Basic Idea">
    <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
      <p>
        Hypothesis testing is a formal procedure for using sample data to choose between two competing
        claims about a population. Think of it like a courtroom:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex gap-4">
          <Gavel className="text-amber-400 shrink-0" size={28} />
          <div>
            <h4 className="font-bold text-white mb-2">Null Hypothesis <MathExpr>H₀</MathExpr></h4>
            <p className="text-sm text-slate-400">
              The &ldquo;innocent until proven guilty&rdquo; status quo — no effect, no difference, no improvement.
            </p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex gap-4">
          <FlaskConical className="text-emerald-400 shrink-0" size={28} />
          <div>
            <h4 className="font-bold text-white mb-2">Alternative <MathExpr>H₁</MathExpr> (or <MathExpr>Hₐ</MathExpr>)</h4>
            <p className="text-sm text-slate-400">
              What we hope to find evidence for. We only &ldquo;convict&rdquo; (reject <MathExpr>H₀</MathExpr>) if the data is very surprising under the null.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-blue-950/30 border-l-4 border-blue-500 p-5 rounded-r-xl">
        <p className="text-base font-medium text-blue-100">
          The central question: <em>If the null were true, how likely is data like ours (or more extreme) just by chance?</em>
        </p>
        <p className="text-sm text-slate-400 mt-2">
          That probability is the <strong className="text-white">p-value</strong>. Tiny → evidence against <MathExpr>H₀</MathExpr>.
        </p>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
          <Lightbulb size={18} className="text-amber-400" /> Website redesign example
        </h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li><MathExpr>H₀</MathExpr>: average session ≤ 3 min (no improvement)</li>
          <li><MathExpr>H₁</MathExpr>: average session &gt; 3 min (new design helps)</li>
          <li>Sample mean = 4.5 min — surprising under <MathExpr>H₀</MathExpr>? That&apos;s what we quantify next.</li>
        </ul>
      </div>
    </div>
  </SlideFrame>
);

const SlideHypothesisFlow = () => {
  const [step, setStep] = useState(0);
  const [unlikely, setUnlikely] = useState(true);

  const steps = [
    { label: 'State a Claim (Null Hypothesis, H₀)', shape: 'rect' },
    { label: 'Collect Sample Data', shape: 'rect' },
    { label: "Analyze: How likely is the data if H₀ is true?", shape: 'rect' },
    { label: "Is data 'unlikely enough' under H₀?", shape: 'diamond' },
  ];

  useEffect(() => {
    if (step < 3) {
      const t = setTimeout(() => setStep((s) => s + 1), 900);
      return () => clearTimeout(t);
    }
  }, [step]);

  const reset = () => {
    setStep(0);
  };

  return (
    <SlideFrame title="The Decision Process">
      <div className="space-y-5 text-slate-300">
        <p className="text-lg leading-relaxed">
          Hypothesis testing doesn&apos;t prove anything with certainty — it weighs evidence. Watch the flow animate, then flip the decision.
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center gap-3 relative">
          {steps.map((s, i) => (
            <React.Fragment key={s.label}>
              <div
                className={`transition-all duration-500 w-full max-w-md text-center px-4 py-3 border-2 ${
                  s.shape === 'diamond'
                    ? 'rotate-0 border-amber-500/60 bg-amber-950/30 rounded-xl'
                    : 'rounded-xl border-slate-600 bg-slate-950'
                } ${i <= step ? 'opacity-100 scale-100' : 'opacity-20 scale-95'}`}
              >
                <span className="text-sm font-medium text-slate-200">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-6 w-0.5 bg-slate-600 transition-opacity duration-300 ${i < step ? 'opacity-100' : 'opacity-20'}`} />
              )}
            </React.Fragment>
          ))}

          {step >= 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mt-4 animate-in fade-in duration-500">
              <button
                type="button"
                onClick={() => setUnlikely(true)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  unlikely
                    ? 'border-rose-500 bg-rose-950/40 shadow-lg shadow-rose-500/10'
                    : 'border-slate-700 bg-slate-950 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="text-xs uppercase tracking-widest text-rose-400 font-bold mb-1">Yes →</div>
                <div className="text-sm text-white font-semibold">Reject H₀</div>
                <div className="text-xs text-slate-400 mt-1">Support alternative H₁</div>
              </button>
              <button
                type="button"
                onClick={() => setUnlikely(false)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  !unlikely
                    ? 'border-emerald-500 bg-emerald-950/40 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-700 bg-slate-950 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-1">No →</div>
                <div className="text-sm text-white font-semibold">Fail to Reject H₀</div>
                <div className="text-xs text-slate-400 mt-1">Not enough evidence</div>
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700"
          >
            <RefreshCw size={14} /> Replay animation
          </button>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideNullAlt = () => {
  const scenarios = [
    {
      id: 'web',
      title: 'Website Design',
      h0: 'μ_new = μ_old',
      h0Alt: 'μ_new − μ_old = 0',
      h1Options: [
        { label: 'Two-tailed (any difference)', value: 'μ_new ≠ μ_old' },
        { label: 'Right-tailed (increase)', value: 'μ_new > μ_old' },
      ],
    },
    {
      id: 'algo',
      title: 'Algorithm Performance',
      h0: 'E_new ≥ E_old',
      h0Alt: '(new is not better)',
      h1Options: [{ label: 'Left-tailed (lower error)', value: 'E_new < E_old' }],
    },
    {
      id: 'mfg',
      title: 'Manufacturing Quality',
      h0: 'μ = 10 mm',
      h0Alt: '(on target)',
      h1Options: [{ label: 'Two-tailed (off spec)', value: 'μ ≠ 10 mm' }],
    },
  ];
  const [active, setActive] = useState(0);
  const [h1Idx, setH1Idx] = useState(0);
  const sc = scenarios[active];

  return (
    <SlideFrame title="Null and Alternative Hypotheses">
      <div className="space-y-5 text-slate-300">
        <p className="text-lg leading-relaxed">
          <MathExpr>H₀</MathExpr> almost always contains equality (<MathExpr>=</MathExpr>, <MathExpr>≤</MathExpr>, or <MathExpr>≥</MathExpr>).
          <MathExpr>H₁</MathExpr> uses <MathExpr>≠</MathExpr>, <MathExpr>&lt;</MathExpr>, or <MathExpr>&gt;</MathExpr> and must be mutually exclusive with the null.
        </p>

        <div className="flex flex-wrap gap-2">
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => { setActive(i); setH1Idx(0); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                i === active ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-amber-800/40 rounded-2xl p-6">
            <div className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">Null Hypothesis</div>
            <div className="font-mono text-2xl text-amber-300 mb-2">H₀: {sc.h0}</div>
            <p className="text-sm text-slate-500">{sc.h0Alt}</p>
            <p className="text-xs text-slate-500 mt-4">Default / status quo / &ldquo;no effect&rdquo;</p>
          </div>
          <div className="bg-slate-900 border border-emerald-800/40 rounded-2xl p-6">
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">Alternative Hypothesis</div>
            <div className="font-mono text-2xl text-emerald-300 mb-3">H₁: {sc.h1Options[h1Idx].value}</div>
            {sc.h1Options.length > 1 && (
              <div className="flex flex-col gap-2">
                {sc.h1Options.map((o, i) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setH1Idx(i)}
                    className={`text-left text-xs px-3 py-2 rounded-lg border transition-all ${
                      i === h1Idx
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                        : 'border-slate-700 text-slate-500 hover:border-slate-500'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
            {sc.h1Options.length === 1 && (
              <p className="text-sm text-slate-500">{sc.h1Options[0].label}</p>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-400 text-center italic">
          Formulating <MathExpr>H₀</MathExpr> and <MathExpr>H₁</MathExpr> is step one — it decides whether you run a one-tailed or two-tailed test.
        </p>
      </div>
    </SlideFrame>
  );
};

const SlideTailsVisualizer = () => {
  const [mode, setMode] = useState('right'); // default right-tailed — matches "is B better?"
  const [alpha, setAlpha] = useState(0.05);
  const [observedZ, setObservedZ] = useState(0.6); // typical mild gap like 2% with n=200
  const [showMyth, setShowMyth] = useState(false);

  const zAlpha = alpha <= 0.01 ? 2.33 : alpha <= 0.05 ? 1.645 : 1.28;
  const zTwo = alpha <= 0.01 ? 2.576 : alpha <= 0.05 ? 1.96 : 1.645;

  const critLeft = mode === 'left' ? -zAlpha : mode === 'two' ? -zTwo : null;
  const critRight = mode === 'right' ? zAlpha : mode === 'two' ? zTwo : null;

  const chartData = useMemo(() => {
    const data = buildBellCurve(0, 1, -4, 4, 0.08);
    return data.map((d) => {
      let reject = false;
      if (mode === 'right') reject = d.x >= zAlpha;
      else if (mode === 'left') reject = d.x <= -zAlpha;
      else reject = d.x <= -zTwo || d.x >= zTwo;
      return { ...d, rejectY: reject ? d.y : 0 };
    });
  }, [mode, zAlpha, zTwo]);

  // Is observed z in the rejection region?
  const inReject =
    mode === 'right'
      ? observedZ >= zAlpha
      : mode === 'left'
        ? observedZ <= -zAlpha
        : observedZ <= -zTwo || observedZ >= zTwo;

  // Approximate p for display (direction-aware)
  const pApprox =
    mode === 'right'
      ? 1 - normalCDF(observedZ, 0, 1)
      : mode === 'left'
        ? normalCDF(observedZ, 0, 1)
        : 2 * Math.min(normalCDF(observedZ, 0, 1), 1 - normalCDF(observedZ, 0, 1));

  const labels = {
    two: {
      h1: 'H₁: models differ (≠)',
      tip: 'Care about a gap either way — B better OR worse',
      story: 'Red on BOTH ends. A huge negative or positive gap both count as “weird.”',
    },
    right: {
      h1: 'H₁: B is better (>)',
      tip: 'Only care if B beats A — classic ML model comparison',
      story: 'Red ONLY on the right. A big win for B lands in the red → reject “equal.”',
    },
    left: {
      h1: 'H₁: B is worse (<)',
      tip: 'Only care if B is worse than A',
      story: 'Red ONLY on the left. Used less often for “is B better?” questions.',
    },
  };

  return (
    <SlideFrame title="One-Tailed vs Two-Tailed Tests">
      <div className="space-y-3 text-slate-300">
        {/* THE KEY CLARIFICATION */}
        <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl p-4">
          <p className="text-sm leading-relaxed text-amber-100">
            <strong className="text-amber-300">This curve is NOT your data.</strong> It is not Model A,
            not Model B, and not a histogram of test examples.
            It is a <strong className="text-white">map of luck</strong>: if the null were true
            (models equally good), and you could re-run the same comparison thousands of times,
            where would the gap-statistic land?
          </p>
          <button
            type="button"
            onClick={() => setShowMyth((v) => !v)}
            className="mt-2 text-xs text-amber-400/80 hover:text-amber-300 underline underline-offset-2"
          >
            {showMyth ? 'Hide common mix-ups' : 'Wait — so where do two models fit in?'}
          </button>
          {showMyth && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-rose-950/40 border border-rose-800/40 rounded-lg p-3">
                <div className="font-bold text-rose-300 mb-1">✗ Not this</div>
                <p className="text-slate-400 leading-relaxed">
                  “Two models → two bell curves overlapping.” That’s a different picture
                  (sampling distributions of each accuracy). This slide’s single curve is about
                  the <em>one number</em> we care about: how surprising the <em>gap</em> is.
                </p>
              </div>
              <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-lg p-3">
                <div className="font-bold text-emerald-300 mb-1">✓ What we actually do</div>
                <p className="text-slate-400 leading-relaxed">
                  You run <strong className="text-white">one</strong> test set → get one gap
                  (e.g. B−A = +2%) → turn it into one <MathExpr>z</MathExpr> → place that yellow
                  line on this luck-map. If it sits in the red zone, reject “equal models.”
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-1">
                Which surprises count?
              </div>
              {[
                { id: 'right', label: 'Right-tailed (B better)' },
                { id: 'two', label: 'Two-tailed (any difference)' },
                { id: 'left', label: 'Left-tailed (B worse)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    mode === m.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
              <SliderControl
                label="α (red zone size)"
                value={alpha}
                min={0.01}
                max={0.1}
                step={0.01}
                onChange={setAlpha}
                accent="accent-rose-500"
                format={(v) => v.toFixed(2)}
                hint="How extreme is “too extreme”? Drawn before seeing data."
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
              <SliderControl
                label="Your one result (z)"
                value={observedZ}
                min={-3.5}
                max={3.5}
                step={0.05}
                onChange={setObservedZ}
                accent="accent-amber-500"
                format={(v) => v.toFixed(2)}
                hint="Drag: one experiment → one z on the map"
              />
            </div>

            <div className={`rounded-xl p-3 border text-center ${inReject ? 'bg-rose-950/40 border-rose-500/50' : 'bg-slate-950 border-slate-700'}`}>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Verdict for this z</div>
              <div className={`font-bold mt-1 ${inReject ? 'text-rose-300' : 'text-emerald-300'}`}>
                {inReject ? 'In red → Reject H₀' : 'Not in red → Keep H₀'}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-1">
                p ≈ {pApprox < 0.001 ? '<0.001' : pApprox.toFixed(3)}
                {inReject ? ' ≤ ' : ' > '}
                α={alpha.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="lg:col-span-9 space-y-3">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] px-1 mb-1">
                <span className="text-slate-400">Gray curve = luck under H₀ (models equal)</span>
                <span className="text-rose-300">Red = reject zone (total area = α)</span>
                <span className="text-amber-300">Yellow = your single observed z</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <ComposedChart data={chartData} margin={{ top: 18, right: 16, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={[-4, 4]}
                    stroke="#94a3b8"
                    tickCount={9}
                    label={{
                      value: 'z-score of the gap (standardized) →',
                      position: 'insideBottom',
                      offset: -2,
                      fill: '#64748b',
                      fontSize: 11,
                    }}
                  />
                  <YAxis hide domain={[0, 0.45]} />
                  <Area type="monotone" dataKey="y" stroke="#64748b" fill="#1e293b" fillOpacity={0.85} isAnimationActive={false} />
                  <Area type="monotone" dataKey="rejectY" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.55} isAnimationActive={false} />
                  <ReferenceLine
                    x={0}
                    stroke="#94a3b8"
                    strokeDasharray="3 3"
                    label={{ value: '0 = no real gap', fill: '#94a3b8', position: 'top', fontSize: 11 }}
                  />
                  {critLeft != null && (
                    <ReferenceLine x={critLeft} stroke="#a78bfa" strokeDasharray="4 4" strokeWidth={1.5} />
                  )}
                  {critRight != null && (
                    <ReferenceLine x={critRight} stroke="#a78bfa" strokeDasharray="4 4" strokeWidth={1.5} />
                  )}
                  <ReferenceLine
                    x={observedZ}
                    stroke="#fbbf24"
                    strokeWidth={2.5}
                    label={{
                      value: `your z=${observedZ.toFixed(2)}`,
                      fill: '#fbbf24',
                      position: observedZ > 2 ? 'insideTopLeft' : 'insideTopRight',
                      fontSize: 11,
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Concrete two-model story */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <div className="text-blue-400 font-bold mb-1">① One comparison</div>
                <p className="text-slate-400 leading-relaxed">
                  Test set once: Model A 85%, Model B 87%. You do <strong className="text-white">not</strong> draw
                  this whole curve from those two numbers — you compute <em>one</em> gap → one z.
                </p>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <div className="text-violet-400 font-bold mb-1">② The curve’s job</div>
                <p className="text-slate-400 leading-relaxed">
                  Math (CLT) says: under H₀, that z behaves like a standard normal. So we use this
                  known shape as a ruler for “how weird is my one result?”
                </p>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <div className="text-rose-400 font-bold mb-1">③ Tails = decide where “weird” lives</div>
                <p className="text-slate-400 leading-relaxed">
                  {labels[mode].story} You pick the tail from the question
                  (<MathExpr>H₁</MathExpr>), then see if yellow lands in red.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-emerald-900/40 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="font-mono text-emerald-400 text-sm shrink-0">{labels[mode].h1}</div>
              <p className="text-xs text-slate-400 leading-relaxed">{labels[mode].tip}</p>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

// ─── P-values & Alpha ────────────────────────────────────────────────────────

const SlidePValueVisualizer = () => {
  const [xBar, setXBar] = useState(4.5);
  const [n, setN] = useState(30);
  const [sigma, setSigma] = useState(2.5);
  const mu0 = 3; // null: mean session = 3 min

  const se = sigma / Math.sqrt(n);
  const z = (xBar - mu0) / se;
  const pRight = 1 - normalCDF(xBar, mu0, se); // one-sided (right) for H1: μ > 3

  const curve = useMemo(() => {
    const lo = mu0 - 4 * se;
    const hi = mu0 + 4 * se;
    const step = (hi - lo) / 80;
    const pts = [];
    for (let x = lo; x <= hi; x += step) {
      const xv = parseFloat(x.toFixed(3));
      const y = normalPDF(xv, mu0, se);
      pts.push({ x: xv, y, tail: xv >= xBar ? y : 0 });
    }
    return pts;
  }, [mu0, se, xBar]);

  const significant = pRight <= 0.05;

  return (
    <SlideFrame title="Understanding P-values">
      <div className="space-y-4 text-slate-300">
        <p className="text-lg leading-relaxed">
          A p-value is a <strong className="text-white">measure of surprise</strong>: if <MathExpr>H₀</MathExpr> were true,
          what&apos;s the chance of seeing data at least as extreme as ours? Website example — <MathExpr>H₀: μ = 3</MathExpr> min, <MathExpr>H₁: μ &gt; 3</MathExpr>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <SliderControl
              label="Sample mean x̄ (min)"
              value={xBar}
              min={2}
              max={6}
              step={0.1}
              onChange={setXBar}
              format={(v) => v.toFixed(1)}
              hint="Drag farther from 3 → smaller p"
            />
            <SliderControl
              label="Sample size n"
              value={n}
              min={5}
              max={200}
              step={5}
              onChange={setN}
              accent="accent-emerald-500"
              format={(v) => Math.round(v)}
              hint="Bigger n → tighter sampling dist."
            />
            <SliderControl
              label="Pop. σ (variability)"
              value={sigma}
              min={0.5}
              max={5}
              step={0.1}
              onChange={setSigma}
              accent="accent-violet-500"
              format={(v) => v.toFixed(1)}
              hint="More noise → harder to reject"
            />
            <div className={`rounded-xl p-4 border text-center transition-colors ${
              significant ? 'bg-rose-950/40 border-rose-500/50' : 'bg-slate-950 border-slate-700'
            }`}>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">p-value (right-tail)</div>
              <div className={`font-mono text-3xl font-bold ${significant ? 'text-rose-400' : 'text-emerald-400'}`}>
                {pRight < 0.001 ? '< 0.001' : pRight.toFixed(3)}
              </div>
              <div className="text-xs text-slate-400 mt-2 font-mono">
                z = {z.toFixed(2)} · SE = {se.toFixed(3)}
              </div>
              <div className={`text-sm font-semibold mt-3 ${significant ? 'text-rose-300' : 'text-emerald-300'}`}>
                {significant ? 'Surprising under H₀ → evidence for H₁' : 'Plausible under H₀ → weak evidence'}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-2xl p-4">
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={curve} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="x" type="number" stroke="#94a3b8" tickFormatter={(v) => v.toFixed(1)} />
                <YAxis hide />
                <Area type="monotone" dataKey="y" stroke="#3b82f6" fill="#1e3a8a" fillOpacity={0.4} isAnimationActive={false} />
                <Area type="monotone" dataKey="tail" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.55} isAnimationActive={false} />
                <ReferenceLine x={mu0} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'μ₀=3', fill: '#94a3b8', position: 'top', fontSize: 12 }} />
                <ReferenceLine x={xBar} stroke="#fbbf24" strokeWidth={2} label={{ value: `x̄=${xBar.toFixed(1)}`, fill: '#fbbf24', position: 'insideTopRight', fontSize: 12 }} />
              </ComposedChart>
            </ResponsiveContainer>
            <p className="text-center text-xs text-slate-500 mt-2">
              Blue curve = sampling distribution of <MathExpr>x̄</MathExpr> if <MathExpr>H₀</MathExpr> is true.
              Red area = p-value (probability of <MathExpr>x̄</MathExpr> this extreme or more).
            </p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideAlphaDecision = () => {
  const [p, setP] = useState(0.02);
  const [alpha, setAlpha] = useState(0.05);
  const reject = p <= alpha;

  return (
    <SlideFrame title="The Significance Level: Alpha (α)">
      <div className="space-y-5 text-slate-300">
        <p className="text-lg leading-relaxed">
          <MathExpr>α</MathExpr> is the cutoff you choose <em>before</em> the test. Common values: 0.05, 0.01, 0.10.
          Decision rule: if <MathExpr>p ≤ α</MathExpr> → reject <MathExpr>H₀</MathExpr>; else fail to reject.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <SliderControl
              label="p-value"
              value={p}
              min={0.001}
              max={0.5}
              step={0.001}
              onChange={setP}
              accent="accent-amber-500"
              format={(v) => v.toFixed(3)}
            />
            <SliderControl
              label="α (significance)"
              value={alpha}
              min={0.01}
              max={0.1}
              step={0.01}
              onChange={setAlpha}
              accent="accent-rose-500"
              format={(v) => v.toFixed(2)}
            />

            {/* Visual meter */}
            <div className="relative h-8 bg-slate-950 rounded-full border border-slate-700 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-rose-500/30 transition-all duration-300"
                style={{ width: `${Math.min(alpha * 100, 100)}%` }}
              />
              <div
                className="absolute top-1 bottom-1 w-1.5 bg-amber-400 rounded-full transition-all duration-300 shadow-lg"
                style={{ left: `calc(${Math.min(p * 100, 100)}% - 3px)` }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-rose-400"
                style={{ left: `${Math.min(alpha * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider font-bold">
              <span>0</span>
              <span className="text-rose-400">α = {alpha.toFixed(2)}</span>
              <span>1</span>
            </div>
            <p className="text-xs text-slate-500">Amber marker = p. Rose zone = rejection region (p ≤ α).</p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Flowchart highlight */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex-1 flex flex-col items-center justify-center gap-3">
              <div className="px-4 py-2 rounded-full bg-blue-950/50 border border-blue-700/40 text-sm text-blue-200">
                Compare p to α
              </div>
              <div className="text-slate-600">↓</div>
              <div className="px-4 py-2 rounded-xl bg-amber-950/40 border border-amber-600/40 text-sm text-amber-200 font-mono">
                p = {p.toFixed(3)}  ?  α = {alpha.toFixed(2)}
              </div>
              <div className="text-slate-600">↓</div>
              <div
                className={`w-full max-w-sm p-5 rounded-xl border-2 transition-all duration-300 ${
                  reject
                    ? 'border-rose-500 bg-rose-950/40'
                    : 'border-emerald-500 bg-emerald-950/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  {reject ? <XCircle className="text-rose-400" size={28} /> : <CheckCircle2 className="text-emerald-400" size={28} />}
                  <div>
                    <div className={`font-bold text-lg ${reject ? 'text-rose-300' : 'text-emerald-300'}`}>
                      {reject ? 'Reject H₀' : 'Fail to Reject H₀'}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {reject
                        ? 'Statistically significant evidence for H₁'
                        : 'Not enough statistically significant evidence for H₁'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideABExample = () => {
  const scenarios = [
    {
      id: 1,
      p: 0.02,
      title: 'Scenario 1: p = 0.02',
      interpret: 'If H₀ were true, only a 2% chance of seeing this increase (or larger) by luck.',
      decision: 'Reject H₀',
      conclude: 'Statistically significant evidence the new design increases conversion.',
      reject: true,
    },
    {
      id: 2,
      p: 0.31,
      title: 'Scenario 2: p = 0.31',
      interpret: 'If H₀ were true, a 31% chance of seeing this (or larger) by luck — not surprising.',
      decision: 'Fail to Reject H₀',
      conclude: 'Not enough evidence to conclude the new design increases the rate.',
      reject: false,
    },
  ];
  const [idx, setIdx] = useState(0);
  const sc = scenarios[idx];
  const alpha = 0.05;

  return (
    <SlideFrame title="Example: Website A/B Test">
      <div className="space-y-5 text-slate-300">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm space-y-1">
          <div><MathExpr>H₀</MathExpr>: new design does <em>not</em> increase conversion (rate ≤ old)</div>
          <div><MathExpr>H₁</MathExpr>: new design <em>does</em> increase conversion (rate &gt; old)</div>
          <div><MathExpr>α = 0.05</MathExpr> chosen before the experiment</div>
        </div>

        <div className="flex gap-2">
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIdx(i)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                i === idx ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">p-value</div>
            <div className="font-mono text-4xl text-amber-400 mt-2">{sc.p.toFixed(2)}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">α</div>
            <div className="font-mono text-4xl text-rose-400 mt-2">{alpha.toFixed(2)}</div>
          </div>
          <div className={`rounded-xl p-5 text-center border-2 ${
            sc.reject ? 'bg-rose-950/40 border-rose-500' : 'bg-emerald-950/40 border-emerald-500'
          }`}>
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Decision</div>
            <div className={`font-bold text-xl mt-2 ${sc.reject ? 'text-rose-300' : 'text-emerald-300'}`}>
              {sc.decision}
            </div>
            <div className="text-xs font-mono text-slate-400 mt-2">
              {sc.p} {sc.reject ? '≤' : '>'} {alpha}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <p className="text-sm"><strong className="text-white">Interpretation:</strong> {sc.interpret}</p>
          <p className="text-sm"><strong className="text-white">Conclusion:</strong> {sc.conclude}</p>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideClarifications = () => (
  <SlideFrame title="Important Clarifications">
    <div className="space-y-4 text-slate-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-5">
          <h4 className="font-bold text-rose-400 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} /> A p-value is NOT…
          </h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>• The probability that <MathExpr>H₀</MathExpr> is true</li>
            <li>• The probability that <MathExpr>H₁</MathExpr> is true</li>
            <li>• The probability the result happened &ldquo;by chance&rdquo; in an absolute sense</li>
          </ul>
        </div>
        <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-5">
          <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">
            <CheckCircle2 size={18} /> A p-value IS…
          </h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            The probability, <em>assuming H₀ is true</em>, of getting data at least as extreme as what we observed.
            It measures how surprising the data is under the null — not how likely the null is.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
          <Gavel size={18} className="text-amber-400" /> &ldquo;Fail to reject&rdquo; ≠ &ldquo;H₀ is true&rdquo;
        </h4>
        <p className="text-sm text-slate-400">
          Like a &ldquo;not guilty&rdquo; verdict: lack of enough evidence for conviction, not proof of innocence.
          The effect might be real but your sample too small or noisy to detect it.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
          <Sigma size={18} className="text-violet-400" /> Statistical ≠ Practical Significance
        </h4>
        <p className="text-sm text-slate-400">
          With huge datasets, tiny meaningless effects can get tiny p-values. Always look at effect size and
          context alongside the p-value — especially in ML where n can be millions.
        </p>
      </div>
    </div>
  </SlideFrame>
);

const SlideModelCompareInteractive = () => {
  const [accA, setAccA] = useState(0.85);
  const [accB, setAccB] = useState(0.87);
  const [n, setN] = useState(200);
  const [alpha, setAlpha] = useState(0.05);
  const [view, setView] = useState('tail'); // 'tail' | 'bars'

  // Two-proportion z-test (one-sided: B > A)
  const se = Math.sqrt((accA * (1 - accA) + accB * (1 - accB)) / n);
  const diff = accB - accA;
  const z = se > 1e-12 ? diff / se : 0;
  const p = Math.max(0, Math.min(1, 1 - normalCDF(z, 0, 1)));
  const moeA = 1.96 * Math.sqrt((accA * (1 - accA)) / n);
  const moeB = 1.96 * Math.sqrt((accB * (1 - accB)) / n);
  const reject = p <= alpha;

  // Critical z for right-tailed α (approx)
  const zCrit =
    alpha <= 0.01 ? 2.33 : alpha <= 0.025 ? 1.96 : alpha <= 0.05 ? 1.645 : alpha <= 0.1 ? 1.28 : 1.04;

  // Standard normal curve for "under H0" — x is z-score of the difference
  const nullCurve = useMemo(() => {
    const pts = [];
    for (let x = -3.5; x <= 3.5; x += 0.08) {
      const xv = parseFloat(x.toFixed(2));
      const y = normalPDF(xv, 0, 1);
      pts.push({
        x: xv,
        y,
        // p-value tail: area to the right of observed z
        pTail: xv >= z ? y : 0,
        // α rejection region: area to the right of critical z
        alphaTail: xv >= zCrit ? y : 0,
      });
    }
    return pts;
  }, [z, zCrit]);

  const barData = [
    { name: 'Model A', acc: accA, err: moeA },
    { name: 'Model B', acc: accB, err: moeB },
  ];

  const pLabel = p < 0.001 ? '< 0.001' : p.toFixed(3);

  return (
    <SlideFrame title="Interactive: Comparing Two Models">
      <div className="space-y-3 text-slate-300">
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm leading-relaxed">
          <span className="text-amber-300 font-mono">H₀: acc_A = acc_B</span>
          <span className="text-slate-600 mx-2">·</span>
          <span className="text-emerald-300 font-mono">H₁: acc_B &gt; acc_A</span>
          <span className="text-slate-500"> (right-tailed — we only care if B is better)</span>
          <p className="text-xs text-slate-400 mt-1.5">
            The bar chart&apos;s error bars are <em>not</em> the &ldquo;tails.&rdquo; The tail is the red shaded area on the
            null curve below — that area <strong className="text-white">is</strong> the p-value.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Controls */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <SliderControl label="Model A" value={accA} min={0.7} max={0.95} step={0.005} onChange={setAccA} format={(v) => `${(v * 100).toFixed(1)}%`} />
            <SliderControl label="Model B" value={accB} min={0.7} max={0.95} step={0.005} onChange={setAccB} accent="accent-emerald-500" format={(v) => `${(v * 100).toFixed(1)}%`} />
            <SliderControl label="Test size n" value={n} min={50} max={2000} step={50} onChange={setN} accent="accent-violet-500" format={(v) => Math.round(v)} hint="Bigger n → smaller SE → bigger |z|" />
            <SliderControl label="α cutoff" value={alpha} min={0.01} max={0.1} step={0.01} onChange={setAlpha} accent="accent-rose-500" format={(v) => v.toFixed(2)} />

            <div className={`rounded-xl p-3 border text-center ${reject ? 'bg-rose-950/40 border-rose-500/50' : 'bg-emerald-950/30 border-emerald-700/40'}`}>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Decision rule</div>
              <div className="font-mono text-sm text-slate-300 mt-1">
                p {reject ? '≤' : '>'} α
              </div>
              <div className={`font-bold mt-1 ${reject ? 'text-rose-300' : 'text-emerald-300'}`}>
                {reject ? 'Reject H₀' : 'Keep H₀ (fail to reject)'}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {pLabel} {reject ? '≤' : '>'} {alpha.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Main visual + formula */}
          <div className="lg:col-span-9 space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setView('tail')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  view === 'tail' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                How p-value is calculated (the tail)
              </button>
              <button
                type="button"
                onClick={() => setView('bars')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  view === 'bars' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Accuracy bars + CIs
              </button>
            </div>

            {view === 'tail' ? (
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3">
                <div className="flex flex-wrap gap-3 text-[11px] mb-1 px-1">
                  <span className="text-slate-400">Blue curve = possible differences <em>if models were equal</em> (H₀)</span>
                  <span className="text-amber-300">● yellow = our observed Δ (as a z-score)</span>
                  <span className="text-rose-300">■ red area = p-value (right tail)</span>
                  <span className="text-violet-300">┊ violet = α cutoff (z_crit ≈ {zCrit})</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <ComposedChart data={nullCurve} margin={{ top: 16, right: 16, bottom: 8, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                      dataKey="x"
                      type="number"
                      domain={[-3.5, 3.5]}
                      stroke="#94a3b8"
                      tickCount={8}
                      label={{ value: 'z-score of (acc_B − acc_A) under H₀', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 11 }}
                    />
                    <YAxis hide domain={[0, 0.45]} />
                    <Area type="monotone" dataKey="y" stroke="#64748b" fill="#1e293b" fillOpacity={0.9} isAnimationActive={false} />
                    <Area type="monotone" dataKey="pTail" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.55} isAnimationActive={false} />
                    <ReferenceLine x={0} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: '0 (no real gap)', fill: '#94a3b8', position: 'top', fontSize: 10 }} />
                    <ReferenceLine
                      x={zCrit}
                      stroke="#a78bfa"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                      label={{ value: `α=${alpha}`, fill: '#a78bfa', position: 'insideTopRight', fontSize: 11 }}
                    />
                    <ReferenceLine
                      x={Math.max(-3.4, Math.min(3.4, z))}
                      stroke="#fbbf24"
                      strokeWidth={2.5}
                      label={{
                        value: `observed z=${z.toFixed(2)}`,
                        fill: '#fbbf24',
                        position: 'insideTopLeft',
                        fontSize: 11,
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
                <p className="text-center text-xs text-slate-400 px-2 pb-1">
                  <strong className="text-rose-300">p-value</strong> = area of the red tail = chance of a gap ≥ ours
                  <em> if H₀ were true</em>. If that area is tinier than α, we reject H₀.
                </p>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} margin={{ top: 16, right: 16, bottom: 8, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis domain={[0.65, 1]} stroke="#94a3b8" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                    <Bar dataKey="acc" radius={[6, 6, 0, 0]}>
                      {barData.map((d, i) => (
                        <Cell key={d.name} fill={i === 0 ? '#3b82f6' : '#10b981'} />
                      ))}
                      <ErrorBar dataKey="err" width={6} strokeWidth={2} stroke="#e2e8f0" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-center text-xs text-slate-500 pb-1">
                  Overlapping CIs are a hint — the formal answer still comes from the z-test / p-value (other tab).
                </p>
              </div>
            )}

            {/* Step-by-step calculation */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">
                Exact calculation (updates live)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
                <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <div className="text-[10px] text-blue-400 font-bold uppercase mb-1">1. Observed gap</div>
                  <div className="font-mono text-emerald-400 text-xs leading-relaxed">
                    Δ = acc_B − acc_A
                  </div>
                  <div className="font-mono text-white mt-2">
                    = {(accB * 100).toFixed(1)}% − {(accA * 100).toFixed(1)}%
                  </div>
                  <div className="font-mono text-amber-300 text-lg mt-1">
                    = {(diff * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <div className="text-[10px] text-violet-400 font-bold uppercase mb-1">2. Noise (SE)</div>
                  <div className="font-mono text-emerald-400 text-[10px] leading-relaxed">
                    SE = √[ p̂_A(1−p̂_A)/n + p̂_B(1−p̂_B)/n ]
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    How wobbly Δ is under sampling noise. Bigger n → smaller SE.
                  </div>
                  <div className="font-mono text-violet-300 text-lg mt-1">
                    SE = {se.toFixed(4)}
                  </div>
                </div>
                <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <div className="text-[10px] text-amber-400 font-bold uppercase mb-1">3. z-score</div>
                  <div className="font-mono text-emerald-400 text-xs leading-relaxed">
                    z = Δ / SE
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    &ldquo;How many SEs is our gap from zero?&rdquo;
                  </div>
                  <div className="font-mono text-amber-300 text-lg mt-1">
                    z = {diff.toFixed(4)} / {se.toFixed(4)} = {z.toFixed(2)}
                  </div>
                </div>
                <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <div className="text-[10px] text-rose-400 font-bold uppercase mb-1">4. p-value (right tail)</div>
                  <div className="font-mono text-emerald-400 text-xs leading-relaxed">
                    p = P(Z ≥ {z.toFixed(2)})
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Area under the normal curve from z to +∞ — the red tail.
                  </div>
                  <div className="font-mono text-rose-300 text-lg mt-1">
                    p = {pLabel}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400 bg-slate-900/80 rounded-lg px-3 py-2 border border-slate-800">
                <strong className="text-white">Why this rejects or keeps H₀:</strong> we only reject when the red tail
                is smaller than α (here {alpha.toFixed(2)}). That means: &ldquo;a gap this big would be rare if the models
                were truly equal.&rdquo; Try raising n to ~1500 or bumping B&apos;s accuracy — watch z move right and the red
                area shrink until p ≤ α.
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideWrapUp = () => (
  <SlideFrame title="Putting It All Together">
    <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
      <p>
        Statistical inference turns sample metrics into careful claims about the world (and about future ML performance).
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-blue-400 font-bold mb-2">1. Estimates</div>
          <p className="text-sm text-slate-400">Test-set metrics are estimates — not ground truth about all future data.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-emerald-400 font-bold mb-2">2. Uncertainty</div>
          <p className="text-sm text-slate-400">Confidence intervals quantify how precise those estimates are.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-amber-400 font-bold mb-2">3. Decisions</div>
          <p className="text-sm text-slate-400">
            Hypothesis tests (<MathExpr>H₀</MathExpr>/<MathExpr>H₁</MathExpr>, <MathExpr>p</MathExpr>, <MathExpr>α</MathExpr>) formally ask whether differences are real or noise.
          </p>
        </div>
      </div>
      <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-5 flex gap-4 items-start">
        <GitCompare className="text-blue-400 shrink-0 mt-1" size={24} />
        <p className="text-base">
          Next time Model B beats Model A by 1–2%, check the intervals and the p-value before celebrating —
          and remember: statistical significance still isn&apos;t the same as a change that matters in production.
        </p>
      </div>
    </div>
  </SlideFrame>
);

// --- Main Application ---
const StatisticalInference11 = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    SlideIntro,
    SlideParameters,
    SlideUncertaintyAndML,
    SlidePointEstimation,
    SlidePointExample,
    SlideSamplingVariability,
    SlideConfidenceInterval,
    SlideCIVisualizer,
    SlideCIWidth,
    SlideMLEvaluation,
    SlideModelCompareIntro,
    SlideHypothesisIntro,
    SlideHypothesisFlow,
    SlideNullAlt,
    SlideTailsVisualizer,
    SlidePValueVisualizer,
    SlideAlphaDecision,
    SlideABExample,
    SlideClarifications,
    SlideModelCompareInteractive,
    SlideWrapUp,
  ];

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-5xl h-[85vh] flex flex-col">
        <div className="flex-1 relative transition-all duration-300 ease-in-out min-h-0">
          <CurrentSlideComponent />
        </div>

        <div className="flex items-center justify-between mt-6 px-2 shrink-0 gap-3">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`p-3 rounded-full flex items-center justify-center transition-all shrink-0 ${
              currentSlide === 0
                ? 'bg-slate-900 text-slate-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg hover:shadow-blue-500/25'
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
            <span className="text-xs text-slate-500 font-mono">
              {currentSlide + 1} / {slides.length}
            </span>
            <div className="flex gap-1.5 flex-wrap justify-center max-w-full">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-6 bg-blue-500' : 'w-2 bg-slate-800 hover:bg-slate-600'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`p-3 rounded-full flex items-center justify-center transition-all shrink-0 ${
              currentSlide === slides.length - 1
                ? 'bg-slate-900 text-slate-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg hover:shadow-blue-500/25'
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatisticalInference11;