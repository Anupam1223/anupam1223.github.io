import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Activity, Database, Shuffle, Layers,
  Zap, AlertTriangle, CheckCircle2, XCircle, Play, Pause, RotateCcw,
  ArrowRight, Lightbulb
} from 'lucide-react';

export const meta = {
  title: '14. Gradient Descent Algorithms',
  subtitle: 'Batch, SGD, Mini-batch & Landscape Challenges',
};

// ─── Shared UI ───────────────────────────────────────────────────────────────

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
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className={`w-full ${accent}`} />
    {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
  </div>
);

const SlideFrame = ({ title, children }) => (
  <div className="flex flex-col h-full bg-slate-950 p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-800">
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-5 flex items-center gap-3 pb-4 border-b border-slate-800/80 shrink-0">
      <Activity className="text-blue-500" size={28} />
      {title}
    </h2>
    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">{children}</div>
  </div>
);

// Quadratic cost J(θ1, θ2) = 0.5 θ1² + θ2²  → ∇J = (θ1, 2θ2), min at (0,0)
const trueGrad = (t1, t2) => ({ g1: t1, g2: 2 * t2 });
const costAt = (t1, t2) => 0.5 * t1 * t1 + t2 * t2;

/** Simulate paths on the quadratic bowl */
function simulateBatch(start, alpha, steps) {
  let t1 = start.t1;
  let t2 = start.t2;
  const path = [{ t1, t2, J: costAt(t1, t2) }];
  for (let i = 0; i < steps; i++) {
    const { g1, g2 } = trueGrad(t1, t2);
    t1 -= alpha * g1;
    t2 -= alpha * g2;
    path.push({ t1, t2, J: costAt(t1, t2) });
  }
  return path;
}

function simulateSGD(start, alpha, steps, seed = 1) {
  // Noisy gradient ≈ true + noise (as if one random example)
  let t1 = start.t1;
  let t2 = start.t2;
  const path = [{ t1, t2, J: costAt(t1, t2) }];
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s / 2147483647) * 2 - 1;
  };
  for (let i = 0; i < steps; i++) {
    const { g1, g2 } = trueGrad(t1, t2);
    const n1 = rand() * 1.4;
    const n2 = rand() * 1.4;
    t1 -= alpha * (g1 + n1);
    t2 -= alpha * (g2 + n2);
    path.push({ t1, t2, J: costAt(t1, t2) });
  }
  return path;
}

function simulateMiniBatch(start, alpha, steps, batchNoiseScale) {
  // Intermediate noise: smaller than SGD
  let t1 = start.t1;
  let t2 = start.t2;
  const path = [{ t1, t2, J: costAt(t1, t2) }];
  let s = 42;
  const rand = () => {
    s = (s * 48271) % 2147483647;
    return (s / 2147483647) * 2 - 1;
  };
  for (let i = 0; i < steps; i++) {
    const { g1, g2 } = trueGrad(t1, t2);
    t1 -= alpha * (g1 + rand() * batchNoiseScale);
    t2 -= alpha * (g2 + rand() * batchNoiseScale);
    path.push({ t1, t2, J: costAt(t1, t2) });
  }
  return path;
}

const ContourPathPlot = ({
  paths = [],
  width = 400,
  height = 320,
  range = 4.5,
  reveal = 999,
}) => {
  const toPx = (t1, t2) => ({
    px: ((t1 + range) / (2 * range)) * width,
    py: ((range - t2) / (2 * range)) * height,
  });
  const origin = toPx(0, 0);
  const levels = [0.3, 0.8, 1.5, 2.5, 4, 6, 9];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full bg-slate-950 rounded-xl border border-slate-700">
      {levels.map((c) => {
        // 0.5 t1² + t2² = c → ellipse
        const rx = (Math.sqrt(2 * c) / range) * (width / 2);
        const ry = (Math.sqrt(c) / range) * (height / 2);
        return (
          <ellipse key={c} cx={origin.px} cy={origin.py} rx={rx} ry={ry} fill="none" stroke="#334155" strokeWidth="1" />
        );
      })}
      <line x1={0} y1={origin.py} x2={width} y2={origin.py} stroke="#475569" strokeWidth="1" />
      <line x1={origin.px} y1={0} x2={origin.px} y2={height} stroke="#475569" strokeWidth="1" />
      <circle cx={origin.px} cy={origin.py} r="5" fill="#22c55e" />

      {paths.map((p) => {
        const pts = p.points.slice(0, Math.min(reveal + 1, p.points.length));
        if (pts.length < 2) return null;
        const d = pts
          .map((pt, i) => {
            const { px, py } = toPx(pt.t1, pt.t2);
            return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`;
          })
          .join(' ');
        const last = toPx(pts[pts.length - 1].t1, pts[pts.length - 1].t2);
        return (
          <g key={p.id}>
            <path d={d} fill="none" stroke={p.color} strokeWidth="2.5" strokeLinejoin="round" opacity="0.9" />
            {pts.map((pt, i) => {
              if (i % Math.max(1, Math.floor(pts.length / 12)) !== 0 && i !== pts.length - 1) return null;
              const { px, py } = toPx(pt.t1, pt.t2);
              return <circle key={i} cx={px} cy={py} r="3" fill={p.color} opacity="0.7" />;
            })}
            <circle cx={last.px} cy={last.py} r="6" fill={p.color} stroke="#fff" strokeWidth="1.5" />
          </g>
        );
      })}

      <text x="10" y="18" fill="#94a3b8" fontSize="11">θ₂ ↑</text>
      <text x={width - 28} y={height - 10} fill="#94a3b8" fontSize="11">θ₁ →</text>
      <text x={origin.px + 8} y={origin.py - 8} fill="#4ade80" fontSize="10">min</text>
    </svg>
  );
};

// Animated dataset → gradient → update diagram for Batch
const BatchFlowDiagram = ({ phase }) => {
  // phase 0 idle, 1 computing, 2 updating
  const dots = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3 text-center">
        One Batch GD step (epoch)
      </div>
      <div className="flex flex-col md:flex-row items-stretch gap-3">
        <div className="bg-slate-950 border border-slate-700 rounded-xl p-3 md:w-36 shrink-0">
          <div className="text-[10px] text-slate-400 font-bold mb-2 text-center">Full dataset (m)</div>
          <div className="grid grid-cols-4 gap-1.5 place-items-center">
            {dots.map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  phase >= 1 ? 'bg-blue-400 scale-110' : 'bg-blue-600/70'
                }`}
                style={{ transitionDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 bg-blue-950/40 border border-blue-700/40 rounded-xl p-3 flex flex-col justify-center gap-3">
          <div
            className={`rounded-full px-3 py-2 text-center text-xs font-mono font-bold transition-all ${
              phase >= 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-500'
            }`}
          >
            ∇J(θ) = (1/m) Σ ∇Jᵢ &nbsp;← ALL m
          </div>
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <span className={phase >= 2 ? 'text-emerald-400 font-bold' : ''}>One update per epoch</span>
            <ArrowRight size={12} className={phase >= 2 ? 'text-emerald-400' : 'text-slate-600'} />
          </div>
          <div
            className={`rounded-full px-3 py-2 text-center text-xs font-mono font-bold transition-all ${
              phase >= 2 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-800 text-slate-500'
            }`}
          >
            θ := θ − α ∇J(θ)
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Slides ──────────────────────────────────────────────────────────────────

const SlideIntro = () => (
  <SlideFrame title="Gradient Descent Algorithms">
    <div className="space-y-5 text-slate-300 leading-relaxed text-lg">
      <p>
        Gradient descent iteratively nudges parameters <MathExpr>θ</MathExpr> downhill on a cost{' '}
        <MathExpr>J(θ)</MathExpr> using <MathExpr>θ := θ − α ∇J(θ)</MathExpr>. The big design choice:{' '}
        <strong className="text-white">how many training examples</strong> go into each gradient estimate?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-blue-800/40 rounded-xl p-5">
          <Database className="text-blue-400 mb-2" size={22} />
          <div className="font-bold text-blue-300 mb-1">Batch GD</div>
          <p className="text-sm text-slate-400">Use <strong className="text-white">all m</strong> examples every update. Smooth, expensive.</p>
        </div>
        <div className="bg-slate-900 border border-amber-800/40 rounded-xl p-5">
          <Shuffle className="text-amber-400 mb-2" size={22} />
          <div className="font-bold text-amber-300 mb-1">Stochastic (SGD)</div>
          <p className="text-sm text-slate-400">Use <strong className="text-white">1</strong> random example. Fast, noisy zig-zag.</p>
        </div>
        <div className="bg-slate-900 border border-emerald-800/40 rounded-xl p-5">
          <Layers className="text-emerald-400 mb-2" size={22} />
          <div className="font-bold text-emerald-300 mb-1">Mini-batch</div>
          <p className="text-sm text-slate-400">Use <strong className="text-white">b</strong> examples (e.g. 32–256). The practical default.</p>
        </div>
      </div>

      <div className="bg-blue-950/30 border-l-4 border-blue-500 p-4 rounded-r-xl text-base">
        Part 1: how each variant computes <MathExpr>∇J</MathExpr>, why paths look different, and how to pick a style.
        Part 2 will cover local minima, saddles, and tricks that help escape them.
      </div>
    </div>
  </SlideFrame>
);

const SlideBatchHow = () => {
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return undefined;
    setPhase(0);
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => {
      setPhase(0);
      setPlaying(false);
    }, 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [playing]);

  return (
    <SlideFrame title="Batch Gradient Descent">
      <div className="space-y-4 text-slate-300">
        <p className="text-base leading-relaxed">
          <strong className="text-white">Batch</strong> means: every update uses the{' '}
          <em>entire</em> training set as one batch. One full pass → one parameter update = one{' '}
          <strong className="text-white">epoch / iteration</strong>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-sm">
              {[
                { n: '1', t: 'Predict for every example with current θ' },
                { n: '2', t: 'Compute errors vs targets' },
                { n: '3', t: 'Average gradients: ∇J(θ) = (1/m) Σᵢ ∇Jᵢ(θ)' },
                { n: '4', t: 'Update: θ := θ − α ∇J(θ)' },
              ].map((s) => (
                <div key={s.n} className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {s.n}
                  </span>
                  <span className="text-slate-300 pt-0.5">{s.t}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPlaying(true)}
              disabled={playing}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold"
            >
              <Play size={16} /> Animate one epoch
            </button>
          </div>
          <BatchFlowDiagram phase={phase} />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-center text-emerald-400 text-sm md:text-base">
          θ := θ − α · (1/m) Σᵢ₌₁ᵐ ∇Jᵢ(θ)
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideBatchTraits = () => (
  <SlideFrame title="Batch GD: Pros, Cons & When">
    <div className="space-y-4 text-slate-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-emerald-300">
            <CheckCircle2 size={18} /> Advantages
          </div>
          <ul className="text-sm text-slate-400 space-y-2 leading-relaxed">
            <li>• <strong className="text-white">Stable</strong> — true (full) gradient, smooth path</li>
            <li>• Convex J + good α → reliable global min</li>
            <li>• Gradient sum often <strong className="text-white">parallelizable</strong> across examples</li>
          </ul>
        </div>
        <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-rose-300">
            <XCircle size={18} /> Disadvantages
          </div>
          <ul className="text-sm text-slate-400 space-y-2 leading-relaxed">
            <li>• <strong className="text-white">Slow per update</strong> — must touch all m points</li>
            <li>• May need entire dataset in <strong className="text-white">RAM</strong></li>
            <li>• No easy <strong className="text-white">online</strong> learning as data streams in</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-2">When Batch GD shines</div>
        <p className="text-sm text-slate-400 leading-relaxed">
          Small-to-medium data that fits in memory, you want a smooth path, and especially when J is convex
          (e.g. linear / logistic regression). For huge datasets, Batch GD motivates SGD and mini-batch.
        </p>
      </div>
    </div>
  </SlideFrame>
);

const SlideSGD = () => {
  const [highlight, setHighlight] = useState(3);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setHighlight(Math.floor(Math.random() * 16));
    }, 700);
    return () => clearInterval(id);
  }, []);

  return (
    <SlideFrame title="Stochastic Gradient Descent (SGD)">
      <div className="space-y-4 text-slate-300">
        <p className="text-base leading-relaxed">
          Averaging over millions of points every step is too slow. SGD updates from{' '}
          <strong className="text-white">one random example</strong> at a time — cheap, frequent, noisy.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">
              Pick one example → update immediately
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {Array.from({ length: 16 }, (_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-mono transition-all duration-300 ${
                    i === highlight
                      ? 'bg-amber-500 text-slate-900 scale-110 shadow-lg shadow-amber-500/40'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-amber-300 font-mono animate-pulse">
              using example #{highlight + 1} · update #{tick}
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-sm text-emerald-400 text-center leading-relaxed">
              θⱼ := θⱼ − α ∇θⱼ J(θ; x⁽ⁱ⁾, y⁽ⁱ⁾)
            </div>
            <p className="text-xs text-slate-500 text-center">No 1/m sum — just one example&apos;s gradient</p>
            <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 text-sm leading-relaxed">
              <strong className="text-amber-300">Why “stochastic”?</strong> Random example → noisy estimate of the
              true ∇J. Path <em>zig-zags</em> instead of marching smoothly — but each step is tiny work, and noise can
              help escape shallow traps (more in Part 2).
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlidePathCompare = () => {
  const start = { t1: 3.5, t2: 3.2 };
  const [alpha, setAlpha] = useState(0.15);
  const [reveal, setReveal] = useState(0);
  const [playing, setPlaying] = useState(false);
  const maxSteps = 40;

  const batchPath = useMemo(() => simulateBatch(start, alpha, maxSteps), [alpha]);
  const sgdPath = useMemo(() => simulateSGD(start, alpha * 0.85, maxSteps, 7), [alpha]);

  useEffect(() => {
    setReveal(0);
  }, [alpha]);

  useEffect(() => {
    if (!playing) return undefined;
    if (reveal >= maxSteps) {
      setPlaying(false);
      return undefined;
    }
    const t = setTimeout(() => setReveal((r) => r + 1), 80);
    return () => clearTimeout(t);
  }, [playing, reveal]);

  return (
    <SlideFrame title="Paths: Batch vs SGD">
      <div className="space-y-3 text-slate-300">
        <p className="text-base leading-relaxed">
          Same bowl <MathExpr>J = ½θ₁² + θ₂²</MathExpr>, same start. Blue = full gradient (Batch). Orange = noisy
          single-example gradient (SGD).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <SliderControl
                label="Learning rate α"
                value={alpha}
                min={0.05}
                max={0.35}
                step={0.01}
                onChange={setAlpha}
                format={(v) => v.toFixed(2)}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setReveal(0); setPlaying(true); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold"
                >
                  {playing ? <Pause size={14} /> : <Play size={14} />} Play paths
                </button>
                <button
                  type="button"
                  onClick={() => { setPlaying(false); setReveal(maxSteps); }}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Show all
                </button>
                <button
                  type="button"
                  onClick={() => { setPlaying(false); setReveal(0); }}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
            <div className="flex gap-2 text-xs">
              <div className="flex-1 bg-blue-950/40 border border-blue-800/40 rounded-lg p-2 text-center">
                <span className="inline-block w-3 h-0.5 bg-blue-400 mb-1" /><br />
                <span className="text-blue-300 font-bold">Batch</span>
                <p className="text-slate-500 mt-1">Smooth downhill</p>
              </div>
              <div className="flex-1 bg-amber-950/40 border border-amber-800/40 rounded-lg p-2 text-center">
                <span className="inline-block w-3 h-0.5 bg-amber-400 mb-1" /><br />
                <span className="text-amber-300 font-bold">SGD</span>
                <p className="text-slate-500 mt-1">Noisy zig-zag</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed px-1">
              Step {reveal}/{maxSteps}. SGD wanders but still drifts to the green minimum — cheaper steps, wilder path.
            </p>
          </div>
          <div className="lg:col-span-8 min-h-[300px]">
            <ContourPathPlot
              reveal={reveal}
              paths={[
                { id: 'batch', color: '#60a5fa', points: batchPath },
                { id: 'sgd', color: '#fbbf24', points: sgdPath },
              ]}
            />
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideSGDTraits = () => (
  <SlideFrame title="SGD: Trade-offs">
    <div className="space-y-4 text-slate-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-5">
          <div className="font-bold text-emerald-300 mb-3 flex items-center gap-2">
            <CheckCircle2 size={18} /> Advantages
          </div>
          <ul className="text-sm text-slate-400 space-y-2 leading-relaxed">
            <li>• <strong className="text-white">Tiny compute</strong> per update — scales to huge data</li>
            <li>• Noise may help <strong className="text-white">escape</strong> shallow local minima / saddles</li>
            <li>• Natural fit for <strong className="text-white">online / streaming</strong> data</li>
          </ul>
        </div>
        <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-5">
          <div className="font-bold text-rose-300 mb-3 flex items-center gap-2">
            <XCircle size={18} /> Disadvantages
          </div>
          <ul className="text-sm text-slate-400 space-y-2 leading-relaxed">
            <li>• <strong className="text-white">High variance</strong> — cost jumps around</li>
            <li>• Often needs more epochs; may <strong className="text-white">oscillate</strong> near the min</li>
            <li>• α tuning (often <strong className="text-white">decay</strong> α over time); shuffle each epoch</li>
          </ul>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-400 leading-relaxed">
        SGD trades Batch&apos;s smooth certainty for speed. <strong className="text-white">Mini-batch GD</strong> sits
        in the middle — next slides.
      </div>
    </div>
  </SlideFrame>
);

const SlideMiniBatch = () => {
  const [b, setB] = useState(4);
  const m = 64; // pretend larger dataset for clearer numbers
  const updatesPerEpoch = Math.ceil(m / b);
  // Normalize 0–100 scores for meters (intuitive, not literal)
  const speedScore = Math.min(100, Math.round((updatesPerEpoch / m) * 100)); // more updates = faster progress feel
  const smoothScore = Math.min(100, Math.round(Math.sqrt(b / m) * 100)); // bigger b = smoother
  const cheapScore = Math.min(100, Math.round((1 - (b - 1) / (m - 1)) * 100)); // smaller b = cheaper per update

  const modeLabel =
    b === 1 ? 'Pure SGD' : b >= m ? 'Pure Batch GD' : 'Mini-batch (the sweet spot)';

  const Meter = ({ label, value, barClass, leftHint, rightHint }) => (
    <div>
      <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300">{value}%</span>
      </div>
      <div className="h-3 bg-slate-950 rounded-full border border-slate-700 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${barClass}`} style={{ width: `${value}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
        <span>{leftHint}</span>
        <span>{rightHint}</span>
      </div>
    </div>
  );

  return (
    <SlideFrame title="Why Mini-batch Matters">
      <div className="space-y-4 text-slate-300">
        <div className="bg-amber-950/25 border border-amber-700/40 rounded-xl p-4 text-sm leading-relaxed">
          <strong className="text-amber-300">The problem:</strong> Batch GD waits for <em>all</em> data before one tiny step
          (too slow on big data). SGD steps after <em>every</em> example (fast but drunk-walking).
          Mini-batch asks: <strong className="text-white">can we update often AND stay reasonably stable?</strong>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
            <SliderControl
              label="Mini-batch size b"
              value={b}
              min={1}
              max={m}
              step={1}
              onChange={setB}
              accent="accent-emerald-500"
              format={(v) => Math.round(v)}
              hint={`Dataset m = ${m} · ${modeLabel}`}
            />

            <div className={`text-center rounded-xl py-2 px-3 border text-sm font-bold ${
              b > 1 && b < m
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-950 border-slate-700 text-slate-400'
            }`}>
              {modeLabel}
            </div>

            <Meter
              label="Update frequency (progress / epoch)"
              value={speedScore}
              barClass="bg-amber-400"
              leftHint="Batch: rare"
              rightHint="SGD: every example"
            />
            <Meter
              label="Path smoothness (low noise)"
              value={smoothScore}
              barClass="bg-blue-400"
              leftHint="SGD: chaotic"
              rightHint="Batch: exact"
            />
            <Meter
              label="Cheap per update (less data touched)"
              value={cheapScore}
              barClass="bg-violet-400"
              leftHint="Batch: all m"
              rightHint="SGD: just 1"
            />

            <div className="bg-slate-950 border border-slate-700 rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">This epoch</div>
              <div className="font-mono text-2xl text-emerald-400 mt-1">
                {updatesPerEpoch} <span className="text-sm text-slate-500">updates</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                each uses {b} example{b === 1 ? '' : 's'} · formula{' '}
                <span className="text-emerald-400/80 font-mono">θ := θ − α ∇J_B</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {/* Visual: three lanes showing what each method "sees" */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                What each update looks at (drag b)
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <span className="w-20 text-[10px] font-bold text-blue-400 shrink-0">Batch</span>
                  <div className="flex-1 h-8 rounded-lg bg-blue-950/50 border border-blue-800/40 flex items-center px-2 gap-0.5 overflow-hidden">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="w-2 h-4 rounded-sm bg-blue-500/80 shrink-0" />
                    ))}
                    <span className="ml-2 text-[10px] text-blue-300 whitespace-nowrap">all {m} every time</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-20 text-[10px] font-bold text-amber-400 shrink-0">SGD</span>
                  <div className="flex-1 h-8 rounded-lg bg-amber-950/40 border border-amber-800/40 flex items-center px-2 gap-1">
                    <div className="w-3 h-5 rounded-sm bg-amber-400 animate-pulse" />
                    <span className="text-[10px] text-amber-200/80">only 1 random example → noisy ∇</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-20 text-[10px] font-bold text-emerald-400 shrink-0">Mini-batch</span>
                  <div className="flex-1 h-8 rounded-lg bg-emerald-950/40 border border-emerald-700/50 flex items-center px-2 gap-0.5 overflow-hidden">
                    {Array.from({ length: Math.min(b, 20) }, (_, i) => (
                      <div key={i} className="w-2.5 h-5 rounded-sm bg-emerald-400 shrink-0 transition-all" />
                    ))}
                    <span className="ml-2 text-[10px] text-emerald-200/90 whitespace-nowrap">
                      {b} examples · balanced ∇ estimate
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <Zap className="text-amber-400 mb-1" size={16} />
                <div className="font-bold text-white mb-1">Faster than Batch</div>
                <p className="text-slate-500 leading-relaxed">
                  {updatesPerEpoch}× more parameter updates per epoch than waiting for the full set.
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <Activity className="text-blue-400 mb-1" size={16} />
                <div className="font-bold text-white mb-1">Calmer than SGD</div>
                <p className="text-slate-500 leading-relaxed">
                  Averaging {b} grads cuts noise (~1/√b) so the path doesn&apos;t thrash as hard.
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <Layers className="text-emerald-400 mb-1" size={16} />
                <div className="font-bold text-white mb-1">GPU-friendly</div>
                <p className="text-slate-500 leading-relaxed">
                  Chunks become matrices → NumPy/PyTorch vectorize one shot (SGD can&apos;t).
                </p>
              </div>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl px-4 py-3 text-sm leading-relaxed">
              <strong className="text-emerald-300">What it brings to the table:</strong> the default training recipe for
              deep nets — progress every few dozen examples, without Batch&apos;s wait or SGD&apos;s chaos.
              Next slide: watch the path itself change as you move <MathExpr>b</MathExpr>.
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideMiniBatchPath = () => {
  const [b, setB] = useState(8);
  const start = { t1: 3.5, t2: 3.2 };
  const alpha = 0.12;
  const steps = 45;

  const noise = b <= 1 ? 1.4 : b >= 32 ? 0.05 : 1.4 * (1 / Math.sqrt(b));

  const paths = useMemo(() => {
    const batch = simulateBatch(start, alpha, steps);
    const sgd = simulateSGD(start, alpha * 0.9, steps, 11);
    const mini = simulateMiniBatch(start, alpha, steps, noise);
    return [
      { id: 'batch', color: '#60a5fa', points: batch },
      { id: 'sgd', color: '#fbbf24', points: sgd },
      { id: 'mini', color: '#34d399', points: mini },
    ];
  }, [noise]);

  const tip =
    b <= 2
      ? 'Green ≈ SGD: lots of zig-zag. Fast steps, hard to settle.'
      : b >= 24
        ? 'Green ≈ Batch: smooth, but each step needed many examples (slow on big data).'
        : 'Green is the compromise: still heads to the min, without orange chaos or blue cost.';

  return (
    <SlideFrame title="See What You Gain: The Path">
      <div className="space-y-3 text-slate-300">
        <p className="text-base leading-relaxed">
          Same starting point, same bowl. <span className="text-blue-400 font-semibold">Blue</span> = Batch,{' '}
          <span className="text-amber-400 font-semibold">Orange</span> = SGD,{' '}
          <span className="text-emerald-400 font-semibold">Green</span> = your mini-batch size <MathExpr>b</MathExpr>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            <SliderControl
              label="Your mini-batch b"
              value={b}
              min={1}
              max={32}
              step={1}
              onChange={setB}
              accent="accent-emerald-500"
              format={(v) => Math.round(v)}
              hint="Watch only the green path change"
            />
            <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 text-xs text-emerald-100/90 leading-relaxed">
              {tip}
            </div>
            <div className="text-xs space-y-2 text-slate-400">
              <div className="flex items-center gap-2"><span className="w-4 h-0.5 bg-blue-400" /> Batch — accurate but rare updates</div>
              <div className="flex items-center gap-2"><span className="w-4 h-0.5 bg-amber-400" /> SGD — constant noise</div>
              <div className="flex items-center gap-2"><span className="w-4 h-1 bg-emerald-400 rounded" /> Mini-batch — <em>you</em> pick the noise level</div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Importance in one line: <strong className="text-white">b is a dial</strong> between “wait forever for a
              perfect gradient” and “twitch after every sample.” Training chooses a middle setting so models actually finish.
            </p>
          </div>
          <div className="lg:col-span-8 min-h-[300px]">
            <ContourPathPlot paths={paths} reveal={999} />
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideComparisonTable = () => {
  const rows = [
    { feature: 'Data per update', batch: 'All m', sgd: '1 example', mini: 'b examples' },
    { feature: 'Updates / epoch', batch: '1', sgd: 'm', mini: 'm / b' },
    { feature: 'Gradient quality', batch: 'Exact', sgd: 'Noisy', mini: 'Estimate' },
    { feature: 'Cost per update', batch: 'High', sgd: 'Low', mini: 'Medium' },
    { feature: 'Convergence path', batch: 'Smooth', sgd: 'Zig-zag', mini: 'Mild jitter' },
    { feature: 'Vectorization', batch: 'Yes', sgd: 'Weak', mini: 'Excellent' },
    { feature: 'Memory', batch: 'Can be high', sgd: 'Low', mini: 'Moderate' },
  ];

  return (
    <SlideFrame title="Summary of Trade-offs">
      <div className="space-y-4 text-slate-300">
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-900 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="px-3 py-3 font-bold">Feature</th>
                <th className="px-3 py-3 font-bold text-blue-400">Batch GD</th>
                <th className="px-3 py-3 font-bold text-amber-400">SGD</th>
                <th className="px-3 py-3 font-bold text-emerald-400">Mini-batch</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.feature} className={i % 2 === 0 ? 'bg-slate-950/80' : 'bg-slate-900/50'}>
                  <td className="px-3 py-2.5 text-slate-300 font-medium">{r.feature}</td>
                  <td className="px-3 py-2.5 text-slate-400">{r.batch}</td>
                  <td className="px-3 py-2.5 text-slate-400">{r.sgd}</td>
                  <td className="px-3 py-2.5 text-emerald-300/90">{r.mini}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-4 text-sm leading-relaxed flex gap-3">
          <Zap className="text-emerald-400 shrink-0" size={20} />
          <p className="text-slate-300">
            <strong className="text-white">In practice:</strong> mini-batch GD (b ≈ 32–512) is the default for neural
            nets — frequent enough updates, GPU-friendly matrices, and less chaos than pure SGD.
          </p>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlidePart1Wrap = () => (
  <SlideFrame title="Recap: Three Ways to Estimate ∇J">
    <div className="space-y-5 text-slate-300 leading-relaxed text-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <Database className="text-blue-400 mb-2" size={22} />
          <div className="font-bold text-white mb-1">Batch</div>
          <p className="text-sm text-slate-400">Exact ∇J, one update/epoch, smooth but heavy.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <Shuffle className="text-amber-400 mb-2" size={22} />
          <div className="font-bold text-white mb-1">SGD</div>
          <p className="text-sm text-slate-400">One example → noisy zig-zag, cheap & scalable.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <Layers className="text-emerald-400 mb-2" size={22} />
          <div className="font-bold text-white mb-1">Mini-batch</div>
          <p className="text-sm text-slate-400">Tune b for the speed/stability sweet spot.</p>
        </div>
      </div>
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-5 flex gap-3 text-base">
        <Lightbulb className="text-amber-400 shrink-0 mt-1" size={22} />
        <p>
          Shared update: <MathExpr>θ := θ − α ∇̂J</MathExpr>. Next: when the surface is bumpy — local minima,
          saddles, and why momentum helps when <MathExpr>∇J ≈ 0</MathExpr>.
        </p>
      </div>
    </div>
  </SlideFrame>
);

// ─── Challenges: local minima & saddles ──────────────────────────────────────

/** Double-well: global min near -2 (deeper), local min near +1 (shallower) */
const bumpyJ = (th) => {
  const a = th + 2;
  const b = th - 1;
  return (a * a * b * b) / 8 + 0.12 * a * a;
};
const bumpyJPrime = (th) => {
  // numerical
  const h = 1e-4;
  return (bumpyJ(th + h) - bumpyJ(th - h)) / (2 * h);
};

const SlideLocalMinima = () => {
  const [theta0, setTheta0] = useState(0.8);
  const [theta, setTheta] = useState(0.8);
  const [alpha, setAlpha] = useState(0.08);
  const [playing, setPlaying] = useState(false);
  const [steps, setSteps] = useState(0);

  const W = 420;
  const H = 220;
  const xMin = -3.2;
  const xMax = 2.5;
  const yMax = 3.2;

  const curve = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const th = xMin + ((xMax - xMin) * i) / 120;
      pts.push({ th, J: bumpyJ(th) });
    }
    return pts;
  }, []);

  const toX = (th) => ((th - xMin) / (xMax - xMin)) * (W - 40) + 20;
  const toY = (J) => H - 30 - (Math.min(J, yMax) / yMax) * (H - 50);

  const pathD = curve
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.th).toFixed(1)},${toY(p.J).toFixed(1)}`)
    .join(' ');

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => {
      setTheta((t) => {
        const g = bumpyJPrime(t);
        if (Math.abs(g) < 0.002) {
          setPlaying(false);
          return t;
        }
        return t - alpha * g;
      });
      setSteps((s) => s + 1);
    }, 60);
    return () => clearInterval(id);
  }, [playing, alpha]);

  const gNow = bumpyJPrime(theta);
  const stuckLocal = Math.abs(theta - 1) < 0.25 && Math.abs(gNow) < 0.05;
  const atGlobal = Math.abs(theta + 2) < 0.25 && Math.abs(gNow) < 0.05;

  const reset = (t = theta0) => {
    setPlaying(false);
    setTheta(t);
    setTheta0(t);
    setSteps(0);
  };

  return (
    <SlideFrame title="Challenge: Local Minima">
      <div className="space-y-3 text-slate-300">
        <p className="text-base leading-relaxed">
          Foggy hike: always walk steepest downhill and you may stop in a <strong className="text-rose-300">shallow valley</strong>
          while a deeper one exists. At any min, <MathExpr>∇J = 0</MathExpr> so{' '}
          <MathExpr>θ := θ − α·0</MathExpr> freezes.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <SliderControl
              label="Start θ"
              value={theta0}
              min={-3}
              max={2}
              step={0.05}
              onChange={(v) => reset(v)}
              format={(v) => v.toFixed(2)}
              hint="Right of the hump → local trap; left → global"
            />
            <SliderControl
              label="Learning rate α"
              value={alpha}
              min={0.02}
              max={0.25}
              step={0.01}
              onChange={setAlpha}
              accent="accent-violet-500"
              format={(v) => v.toFixed(2)}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold"
              >
                {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? 'Pause' : 'Run GD'}
              </button>
              <button type="button" onClick={() => reset(theta0)} className="px-3 py-2 rounded-lg bg-slate-800">
                <RotateCcw size={14} />
              </button>
            </div>
            <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs font-mono space-y-1">
              <div className="flex justify-between"><span className="text-slate-500">θ</span><span className="text-amber-300">{theta.toFixed(3)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">J(θ)</span><span className="text-white">{bumpyJ(theta).toFixed(3)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">∇J</span><span className="text-slate-300">{gNow.toFixed(4)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">steps</span><span>{steps}</span></div>
            </div>
            <div className={`text-xs font-semibold text-center rounded-lg py-2 border ${
              stuckLocal ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                : atGlobal ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-950 border-slate-700 text-slate-500'
            }`}>
              {stuckLocal ? 'Stuck in LOCAL minimum (red)' : atGlobal ? 'Reached GLOBAL minimum (green)' : 'Descending…'}
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-900 border border-slate-700 rounded-2xl p-3 flex justify-center">
            <svg width={W} height={H} className="bg-slate-950 rounded-xl">
              <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
              {/* markers */}
              <polygon
                points={`${toX(-2)},${toY(bumpyJ(-2)) - 10} ${toX(-2) - 7},${toY(bumpyJ(-2)) + 4} ${toX(-2) + 7},${toY(bumpyJ(-2)) + 4}`}
                fill="#22c55e"
              />
              <text x={toX(-2) - 22} y={toY(bumpyJ(-2)) - 14} fill="#4ade80" fontSize="11">global</text>
              <circle cx={toX(1)} cy={toY(bumpyJ(1))} r="8" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
              <text x={toX(1) - 14} y={toY(bumpyJ(1)) - 12} fill="#fb7185" fontSize="11">local</text>
              {/* walker */}
              <circle cx={toX(theta)} cy={toY(bumpyJ(theta))} r="7" fill="#f97316" stroke="#fff" strokeWidth="1.5" />
              <text x="12" y="18" fill="#94a3b8" fontSize="11">J(θ)</text>
              <text x={W - 28} y={H - 8} fill="#94a3b8" fontSize="11">θ</text>
            </svg>
          </div>
        </div>
        <p className="text-xs text-slate-500 text-center">
          Convex losses (linear regression) have one bowl — local = global. Neural nets are bumpy; many locals are “good enough,” but traps still matter.
        </p>
      </div>
    </SlideFrame>
  );
};

const IsoSurface = ({
  fx = (x, y) => x * x - y * y,
  x0 = 0,
  y0 = 0,
  width = 380,
  height = 260,
  caption,
  showOrigin = false,
}) => {
  const project = (x, y, z) => {
    const s = 46;
    return {
      px: width / 2 + (x - y) * s * 0.85,
      py: height * 0.55 + (x + y) * s * 0.32 - z * s * 0.4,
    };
  };
  const polys = [];
  for (let xi = -1.8; xi < 1.8; xi += 0.3) {
    for (let yi = -1.8; yi < 1.8; yi += 0.3) {
      const corners = [
        [xi, yi],
        [xi + 0.3, yi],
        [xi + 0.3, yi + 0.3],
        [xi, yi + 0.3],
      ].map(([x, y]) => project(x, y, fx(x, y)));
      const zc = fx(xi + 0.15, yi + 0.15);
      const t = Math.max(0, Math.min(1, (zc + 4) / 8));
      const fill = `rgba(${Math.round(40 + t * 200)}, ${Math.round(80 + (1 - t) * 60)}, ${Math.round(220 - t * 180)}, 0.55)`;
      polys.push({
        key: `${xi}-${yi}`,
        points: corners.map((p) => `${p.px},${p.py}`).join(' '),
        fill,
        depth: xi + yi,
      });
    }
  }
  polys.sort((a, b) => a.depth - b.depth);
  const p = project(x0, y0, fx(x0, y0));
  const pOrigin = showOrigin ? project(0, 0, fx(0, 0)) : null;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <rect width={width} height={height} fill="#0f172a" rx="12" />
      {polys.map((poly) => (
        <polygon key={poly.key} points={poly.points} fill={poly.fill} stroke="#334155" strokeWidth="0.35" />
      ))}
      {pOrigin && <circle cx={pOrigin.px} cy={pOrigin.py} r="5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />}
      {(x0 !== 0 || y0 !== 0 || !showOrigin) && (
        <circle cx={p.px} cy={p.py} r="7" fill="#f97316" stroke="#fff" strokeWidth="1.5" />
      )}
      {caption && <text x="12" y="20" fill="#94a3b8" fontSize="11">{caption}</text>}
    </svg>
  );
};

const SlideSaddle = () => {
  const [t1, setT1] = useState(0.05);
  const [t2, setT2] = useState(0.15);
  const [playing, setPlaying] = useState(false);
  const alpha = 0.08;

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => {
      setT1((a) => a - alpha * 2 * a);
      setT2((b) => b + alpha * 2 * b);
    }, 80);
    return () => clearInterval(id);
  }, [playing]);

  const g1 = 2 * t1;
  const g2 = -2 * t2;
  const gMag = Math.hypot(g1, g2);
  const J = t1 * t1 - t2 * t2;

  return (
    <SlideFrame title="Saddle Points: The Plateau Problem">
      <div className="space-y-3 text-slate-300">
        <p className="text-base leading-relaxed">
          A saddle is flat at the center (<MathExpr>∇J = 0</MathExpr>) but curves <em>up</em> one way and{' '}
          <em>down</em> another — like a horse saddle. In high dimensions these are far more common than true local mins,
          and GD <strong className="text-white">crawls</strong> near them because the gradient is tiny.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <SliderControl label="θ₁ start" value={t1} min={-1.5} max={1.5} step={0.05} onChange={(v) => { setPlaying(false); setT1(v); }} format={(v) => v.toFixed(2)} />
            <SliderControl label="θ₂ start" value={t2} min={-1.5} max={1.5} step={0.05} onChange={(v) => { setPlaying(false); setT2(v); }} accent="accent-violet-500" format={(v) => v.toFixed(2)} hint="Tiny θ₂ → slow escape" />
            <div className="flex gap-2">
              <button type="button" onClick={() => setPlaying((p) => !p)} className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1">
                {playing ? <Pause size={14} /> : <Play size={14} />} Run GD
              </button>
              <button type="button" onClick={() => { setPlaying(false); setT1(0.05); setT2(0.08); }} className="px-3 py-2 rounded-lg bg-slate-800 text-xs font-bold">
                Near saddle
              </button>
            </div>
            <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs font-mono space-y-1">
              <div className="flex justify-between"><span className="text-slate-500">∇J</span><span>⟨{g1.toFixed(3)}, {g2.toFixed(3)}⟩</span></div>
              <div className="flex justify-between"><span className="text-slate-500">‖∇J‖</span><span className={gMag < 0.2 ? 'text-rose-400' : 'text-emerald-400'}>{gMag.toFixed(3)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">J</span><span>{J.toFixed(3)}</span></div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Try “Near saddle”: ‖∇J‖ is small → steps are tiny. Tip θ₂ up and escape speeds up along the valley.
            </p>
          </div>
          <div className="lg:col-span-8 bg-slate-900 border border-slate-700 rounded-2xl p-2 min-h-[260px]">
            <IsoSurface
              fx={(x, y) => x * x - y * y}
              x0={t1}
              y0={t2}
              showOrigin
              caption="J ≈ θ₁² − θ₂² · red = saddle (0,0)"
            />
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideHessianID = () => {
  const cases = [
    {
      id: 'min',
      title: 'Local min',
      H: 'H positive definite',
      tip: 'All curvatures point up — a bowl. Every eigenvalue of H is positive.',
      color: 'emerald',
      fx: (x, y) => x * x + y * y,
      label: 'J ≈ θ₁² + θ₂²',
    },
    {
      id: 'max',
      title: 'Local max',
      H: 'H negative definite',
      tip: 'All curvatures point down — a dome. Every eigenvalue of H is negative.',
      color: 'rose',
      fx: (x, y) => -(x * x + y * y),
      label: 'J ≈ −(θ₁² + θ₂²)',
    },
    {
      id: 'saddle',
      title: 'Saddle',
      H: 'H indefinite',
      tip: 'Curvature up in some directions, down in others. Mixed-sign eigenvalues.',
      color: 'amber',
      fx: (x, y) => x * x - y * y,
      label: 'J ≈ θ₁² − θ₂²',
    },
  ];
  const [idx, setIdx] = useState(2);
  const c = cases[idx];

  return (
    <SlideFrame title="How We Tell Them Apart: Hessian">
      <div className="space-y-4 text-slate-300">
        <p className="text-base leading-relaxed">
          <MathExpr>∇J = 0</MathExpr> only says “flat.” The <strong className="text-white">Hessian H</strong> (matrix of
          second derivatives) reads the curvature — same idea as <MathExpr>f″</MathExpr> in 1D.
        </p>
        <div className="flex flex-wrap gap-2">
          {cases.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIdx(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${i === idx ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-2 h-[240px]">
            <IsoSurface fx={c.fx} x0={0.4} y0={0.4} width={400} height={230} caption={c.label} />
          </div>
          <div className={`rounded-2xl border p-5 ${
            c.color === 'emerald' ? 'bg-emerald-950/30 border-emerald-700/40'
              : c.color === 'rose' ? 'bg-rose-950/30 border-rose-700/40'
                : 'bg-amber-950/30 border-amber-700/40'
          }`}>
            <div className="font-mono text-lg text-white mb-2">{c.H}</div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{c.tip}</p>
            <ul className="text-xs text-slate-400 space-y-2 mb-4 list-disc pl-4">
              <li>At a critical point, inspect eigenvalues of H to classify min / max / saddle.</li>
              <li>Newton&apos;s method uses H for smarter steps — but storing/inverting H costs O(n²) / O(n³).</li>
              <li>For huge neural nets, first-order methods (GD + tricks below) stay practical.</li>
            </ul>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideMomentum = () => {
  const [theta0, setTheta0] = useState(0.8);
  const [thetaGd, setThetaGd] = useState(0.8);
  const [thetaMom, setThetaMom] = useState(0.8);
  const [vel, setVel] = useState(0);
  const velRef = useRef(0);
  const [beta, setBeta] = useState(0.9);
  const [alpha, setAlpha] = useState(0.06);
  const [playing, setPlaying] = useState(false);

  const W = 440;
  const H = 220;
  const xMin = -3.2;
  const xMax = 2.5;
  const yMax = 3.2;

  const curve = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const th = xMin + ((xMax - xMin) * i) / 120;
      pts.push({ th, J: bumpyJ(th) });
    }
    return pts;
  }, []);

  const toX = (th) => ((th - xMin) / (xMax - xMin)) * (W - 40) + 20;
  const toY = (J) => H - 30 - (Math.min(J, yMax) / yMax) * (H - 50);
  const pathD = curve.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.th).toFixed(1)},${toY(p.J).toFixed(1)}`).join(' ');

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => {
      setThetaGd((t) => {
        const g = bumpyJPrime(t);
        if (Math.abs(g) < 0.002) return t;
        return t - alpha * g;
      });
      setThetaMom((t) => {
        const g = bumpyJPrime(t);
        velRef.current = beta * velRef.current + g;
        if (Math.abs(g) < 0.002 && Math.abs(velRef.current) < 0.01) return t;
        return t - alpha * velRef.current;
      });
      setVel(velRef.current);
    }, 55);
    return () => clearInterval(id);
  }, [playing, alpha, beta]);

  const reset = () => {
    setPlaying(false);
    setThetaGd(theta0);
    setThetaMom(theta0);
    velRef.current = 0;
    setVel(0);
  };

  const gdStuck = Math.abs(thetaGd - 1) < 0.3 && Math.abs(bumpyJPrime(thetaGd)) < 0.05;
  const momGlobal = Math.abs(thetaMom + 2) < 0.35;

  return (
    <SlideFrame title="Moving Forward: Momentum">
      <div className="space-y-3 text-slate-300">
        <p className="text-base leading-relaxed">
          Momentum keeps a velocity buffer: <MathExpr>v ← βv + ∇J</MathExpr>, then{' '}
          <MathExpr>θ ← θ − αv</MathExpr>. Past gradients add up — you roll through flat plateaus and can{' '}
          <strong className="text-white">overshoot</strong> shallow traps.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <SliderControl label="Start θ" value={theta0} min={0} max={2.5} step={0.05} onChange={(v) => { setTheta0(v); setThetaGd(v); setThetaMom(v); velRef.current = 0; setVel(0); setPlaying(false); }} format={(v) => v.toFixed(2)} hint="Start in right basin — plain GD traps in local min" />
            <SliderControl label="Momentum β" value={beta} min={0.5} max={0.99} step={0.01} onChange={setBeta} accent="accent-emerald-500" format={(v) => v.toFixed(2)} />
            <SliderControl label="α" value={alpha} min={0.02} max={0.12} step={0.01} onChange={setAlpha} accent="accent-violet-500" format={(v) => v.toFixed(2)} />
            <div className="flex gap-2">
              <button type="button" onClick={() => setPlaying((p) => !p)} className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1">
                {playing ? <Pause size={14} /> : <Play size={14} />} Compare
              </button>
              <button type="button" onClick={reset} className="px-3 py-2 rounded-lg bg-slate-800"><RotateCcw size={14} /></button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 border border-blue-800/50 rounded-lg p-2">
                <div className="text-blue-400 font-bold mb-1">Plain GD</div>
                <div>θ = {thetaGd.toFixed(2)}</div>
                <div className={gdStuck ? 'text-rose-400' : 'text-slate-500'}>{gdStuck ? 'stuck local' : 'moving'}</div>
              </div>
              <div className="bg-slate-950 border border-emerald-800/50 rounded-lg p-2">
                <div className="text-emerald-400 font-bold mb-1">+ Momentum</div>
                <div>θ = {thetaMom.toFixed(2)}</div>
                <div className={momGlobal ? 'text-emerald-400' : 'text-slate-500'}>{momGlobal ? 'near global!' : 'rolling…'}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-900 border border-slate-700 rounded-2xl p-3 flex justify-center">
            <svg width={W} height={H} className="bg-slate-950 rounded-xl">
              <path d={pathD} fill="none" stroke="#475569" strokeWidth="2" />
              <circle cx={toX(thetaGd)} cy={toY(bumpyJ(thetaGd))} r="8" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
              <circle cx={toX(thetaMom)} cy={toY(bumpyJ(thetaMom))} r="8" fill="#22c55e" stroke="#fff" strokeWidth="1.5" />
              <text x="12" y="16" fill="#60a5fa" fontSize="10">● GD</text>
              <text x="12" y="30" fill="#4ade80" fontSize="10">● Momentum</text>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-violet-950/25 border border-violet-800/40 rounded-xl p-4">
            <div className="font-bold text-violet-300 mb-1">Adaptive rates (Adam, RMSprop)</div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Track per-parameter gradient history → shrink α where gradients oscillate (steep axis), grow α where
              progress is slow (flat axis). Dampens zig-zag in ill-conditioned bowls.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="font-bold text-white mb-1">When training crawls</div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Small <MathExpr>‖∇J‖</MathExpr> near a saddle? Try momentum, Adam, noisy SGD, or bump α briefly — you may
              be on a plateau, not a true minimum.
            </p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideFinalWrap = () => (
  <SlideFrame title="Full Picture: Algorithms on Hard Landscapes">
    <div className="space-y-5 text-slate-300 leading-relaxed">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="font-bold text-white mb-2">Part 1 — How you estimate ∇J</div>
          <ul className="space-y-1.5 text-slate-400 list-disc pl-4">
            <li><span className="text-blue-400">Batch</span> — exact, smooth, expensive</li>
            <li><span className="text-amber-400">SGD</span> — noisy, cheap, scalable</li>
            <li><span className="text-emerald-400">Mini-batch</span> — the practical default</li>
          </ul>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="font-bold text-white mb-2">Part 2 — When the surface fights back</div>
          <ul className="space-y-1.5 text-slate-400 list-disc pl-4">
            <li>Local minima trap plain GD (<MathExpr>∇J = 0</MathExpr>)</li>
            <li>Saddles are common; gradients shrink near them</li>
            <li>Hessian classifies critical points; momentum & Adam help escape</li>
          </ul>
        </div>
      </div>
      <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-5 flex gap-3">
        <CheckCircle2 className="text-blue-400 shrink-0" size={22} />
        <p className="text-sm">
          Modern deep learning rarely uses vanilla batch GD alone. You combine{' '}
          <strong className="text-white">mini-batch + momentum-style optimizers</strong> to move fast on huge, bumpy,
          high-dimensional surfaces.
        </p>
      </div>
    </div>
  </SlideFrame>
);

// ─── Main ────────────────────────────────────────────────────────────────────

const GradientDescentAlgorithms14 = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    SlideIntro,
    SlideBatchHow,
    SlideBatchTraits,
    SlideSGD,
    SlidePathCompare,
    SlideSGDTraits,
    SlideMiniBatch,
    SlideMiniBatchPath,
    SlideComparisonTable,
    SlidePart1Wrap,
    SlideLocalMinima,
    SlideSaddle,
    SlideHessianID,
    SlideMomentum,
    SlideFinalWrap,
  ];

  const Current = slides[currentSlide];
  const partLabel = currentSlide <= 8 ? 'Part 1' : currentSlide <= 13 ? 'Part 2' : 'Wrap-up';

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-5xl h-[85vh] flex flex-col">
        <div className="flex-1 relative min-h-0">
          <Current />
        </div>

        <div className="flex items-center justify-between mt-6 px-2 shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
            disabled={currentSlide === 0}
            className={`p-3 rounded-full transition-all shrink-0 ${
              currentSlide === 0 ? 'bg-slate-900 text-slate-700 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg'
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
            <span className="text-xs text-slate-500 font-mono">
              {partLabel} · {currentSlide + 1} / {slides.length}
            </span>
            <div className="flex gap-1.5 flex-wrap justify-center">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentSlide ? 'w-6 bg-blue-500' : 'w-2 bg-slate-800 hover:bg-slate-600'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentSlide((p) => Math.min(slides.length - 1, p + 1))}
            disabled={currentSlide === slides.length - 1}
            className={`p-3 rounded-full transition-all shrink-0 ${
              currentSlide === slides.length - 1
                ? 'bg-slate-900 text-slate-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg'
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradientDescentAlgorithms14;
