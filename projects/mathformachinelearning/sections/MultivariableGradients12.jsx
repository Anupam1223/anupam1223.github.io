import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Activity, Home, Layers, Box,
  ArrowRight, Snowflake, Compass, Lightbulb, Target, TrendingUp, Brain
} from 'lucide-react';
import {
  ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  ReferenceDot
} from 'recharts';

export const meta = {
  title: '12. Multivariable Calculus: Gradients & Direction (Part 1)',
  subtitle: 'Functions of Many Variables & Partial Derivatives',
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
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-5 flex items-center gap-3 pb-4 border-b border-slate-800/80 shrink-0">
      <Activity className="text-blue-500" size={28} />
      {title}
    </h2>
    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
      {children}
    </div>
  </div>
);

// Simple isometric projection for a bowl surface z = a*x^2 + b*y^2
const IsoSurface = ({
  fx = (x, y) => x * x + y * y,
  x0 = 1,
  y0 = 1,
  showXSlice = false,
  showYSlice = false,
  width = 420,
  height = 300,
}) => {
  const project = (x, y, z) => {
    const s = 48;
    const isoX = (x - y) * s * 0.85;
    const isoY = (x + y) * s * 0.35 - z * s * 0.55;
    return { px: width / 2 + isoX, py: height * 0.62 + isoY };
  };

  const grid = [];
  for (let xi = -2; xi <= 2.001; xi += 0.25) {
    const row = [];
    for (let yi = -2; yi <= 2.001; yi += 0.25) {
      row.push({ x: xi, y: yi, z: fx(xi, yi) });
    }
    grid.push(row);
  }

  const polys = [];
  for (let i = 0; i < grid.length - 1; i++) {
    for (let j = 0; j < grid[i].length - 1; j++) {
      const a = grid[i][j];
      const b = grid[i + 1][j];
      const c = grid[i + 1][j + 1];
      const d = grid[i][j + 1];
      const zAvg = (a.z + b.z + c.z + d.z) / 4;
      const t = Math.min(1, zAvg / 8);
      const fill = `rgba(${Math.round(30 + t * 200)}, ${Math.round(100 - t * 40)}, ${Math.round(220 - t * 160)}, 0.55)`;
      const pa = project(a.x, a.y, a.z);
      const pb = project(b.x, b.y, b.z);
      const pc = project(c.x, c.y, c.z);
      const pd = project(d.x, d.y, d.z);
      polys.push({
        key: `${i}-${j}`,
        points: `${pa.px},${pa.py} ${pb.px},${pb.py} ${pc.px},${pc.py} ${pd.px},${pd.py}`,
        fill,
        depth: a.x + a.y + b.x + b.y,
      });
    }
  }
  polys.sort((a, b) => a.depth - b.depth);

  const z0 = fx(x0, y0);
  const p0 = project(x0, y0, z0);
  const pFloor = project(x0, y0, 0);

  const xSlicePts = [];
  const ySlicePts = [];
  if (showXSlice) {
    for (let x = -2; x <= 2.001; x += 0.08) {
      const z = fx(x, y0);
      xSlicePts.push(project(x, y0, z));
    }
  }
  if (showYSlice) {
    for (let y = -2; y <= 2.001; y += 0.08) {
      const z = fx(x0, y);
      ySlicePts.push(project(x0, y, z));
    }
  }

  const pathFrom = (pts) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.px.toFixed(1)},${p.py.toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" role="img" aria-label="3D surface">
      <defs>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <rect width={width} height={height} fill="url(#floorGrad)" rx="12" />
      {polys.map((p) => (
        <polygon key={p.key} points={p.points} fill={p.fill} stroke="#334155" strokeWidth="0.4" />
      ))}
      {showXSlice && xSlicePts.length > 1 && (
        <path d={pathFrom(xSlicePts)} fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
      )}
      {showYSlice && ySlicePts.length > 1 && (
        <path d={pathFrom(ySlicePts)} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
      )}
      <line
        x1={pFloor.px}
        y1={pFloor.py}
        x2={p0.px}
        y2={p0.py}
        stroke="#fbbf24"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <circle cx={pFloor.px} cy={pFloor.py} r="4" fill="#64748b" />
      <circle cx={p0.px} cy={p0.py} r="7" fill="#f97316" stroke="#fff" strokeWidth="1.5" />
      <text x={p0.px + 10} y={p0.py - 8} fill="#fdba74" fontSize="11" fontFamily="ui-monospace, monospace">
        ({x0.toFixed(1)}, {y0.toFixed(1)}, {z0.toFixed(2)})
      </text>
    </svg>
  );
};

// Heatmap / contour-style top-down view of z = f(x,y)
const HeatmapPad = ({ fx, x0, y0, onPick, size = 260 }) => {
  const canvasRef = useRef(null);
  const range = 2.2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const n = size;
    const img = ctx.createImageData(n, n);
    for (let py = 0; py < n; py++) {
      for (let px = 0; px < n; px++) {
        const x = -range + (2 * range * px) / (n - 1);
        const y = range - (2 * range * py) / (n - 1);
        const z = fx(x, y);
        const t = Math.min(1, z / 8);
        const i = (py * n + px) * 4;
        img.data[i] = Math.round(15 + t * 220);
        img.data[i + 1] = Math.round(80 + (1 - t) * 100);
        img.data[i + 2] = Math.round(200 - t * 160);
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    // contour rings
    ctx.strokeStyle = 'rgba(226,232,240,0.35)';
    ctx.lineWidth = 1;
    for (const level of [1, 2, 3, 4, 6]) {
      ctx.beginPath();
      let started = false;
      for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.05) {
        // for z=x^2+y^2 style, circle radius = sqrt(level) — approximate via search for general fx
        let r = Math.sqrt(level);
        for (let k = 0; k < 6; k++) {
          const zx = fx(r * Math.cos(a), r * Math.sin(a));
          r *= Math.sqrt(level / Math.max(zx, 1e-6));
        }
        const x = r * Math.cos(a);
        const y = r * Math.sin(a);
        const px = ((x + range) / (2 * range)) * (n - 1);
        const py = ((range - y) / (2 * range)) * (n - 1);
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  }, [fx, size]);

  const toPixel = (x, y) => ({
    px: ((x + range) / (2 * range)) * size,
    py: ((range - y) / (2 * range)) * size,
  });
  const marker = toPixel(x0, y0);

  const handle = (e) => {
    if (!onPick) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * size;
    const py = ((e.clientY - rect.top) / rect.height) * size;
    const x = -range + (2 * range * px) / size;
    const y = range - (2 * range * py) / size;
    onPick(
      Math.max(-2, Math.min(2, parseFloat(x.toFixed(2)))),
      Math.max(-2, Math.min(2, parseFloat(y.toFixed(2))))
    );
  };

  return (
    <div className="relative inline-block rounded-xl overflow-hidden border border-slate-700 shadow-inner">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="cursor-crosshair block"
        onClick={handle}
        style={{ width: size, height: size }}
      />
      <div
        className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full bg-orange-400 border-2 border-white shadow-lg pointer-events-none"
        style={{ left: marker.px, top: marker.py }}
      />
      <div className="absolute bottom-2 left-2 text-[10px] text-white/70 font-mono bg-black/40 px-1.5 py-0.5 rounded">
        click to place (x, y)
      </div>
    </div>
  );
};

// ─── Slides: Multivariable Functions ─────────────────────────────────────────

const SlideIntro = () => (
  <SlideFrame title="Functions of Multiple Variables">
    <div className="space-y-5 text-slate-300 leading-relaxed text-lg">
      <p>
        So far, single-variable functions like <MathExpr>f(x) = x²</MathExpr> take <em>one</em> input.
        Machine learning almost never works that way — house price, cost, and predictions depend on{' '}
        <strong className="text-white">many inputs at once</strong>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-blue-400 font-bold mb-3">
            <TrendingUp size={18} /> One input → a curve
          </div>
          <div className="font-mono text-sm text-slate-400 mb-3">f(x) = x²</div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={Array.from({ length: 41 }, (_, i) => {
                  const x = -4 + i * 0.2;
                  return { x, y: x * x };
                })}
                margin={{ top: 10, right: 10, bottom: 10, left: -10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="x" type="number" stroke="#94a3b8" tickCount={5} />
                <YAxis stroke="#94a3b8" />
                <Line type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-violet-400 font-bold mb-3">
            <Home size={18} /> Many inputs → one output
          </div>
          <p className="text-sm text-slate-400 mb-4">Predicting house price:</p>
          <div className="space-y-2 relative">
            {['sq ft', 'bedrooms', 'age', 'location'].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <span className="bg-blue-950/50 border border-blue-800/40 text-blue-300 text-xs font-mono px-2.5 py-1.5 rounded-lg w-28 text-center">
                  {f}
                </span>
                <ArrowRight size={14} className="text-slate-600" />
                <span className="text-xs text-slate-600">into the model…</span>
              </div>
            ))}
            <div className="mt-3 flex items-center gap-2">
              <div className="bg-violet-600 text-white text-sm font-bold px-3 py-2 rounded-xl flex items-center gap-2">
                <Home size={16} /> f(…)
              </div>
              <ArrowRight size={14} className="text-emerald-500" />
              <div className="bg-emerald-950/40 border border-emerald-700/40 text-emerald-300 text-sm font-bold px-3 py-2 rounded-xl">
                Price $
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-950/30 border-l-4 border-blue-500 p-4 rounded-r-xl text-base">
        Cost functions in training depend on <strong className="text-white">thousands or millions</strong> of
        weights and biases. Part 1 builds the language for that: multivariable functions, then partial derivatives.
      </div>
    </div>
  </SlideFrame>
);

const SlideNotation = () => {
  const [x, setX] = useState(1);
  const [y, setY] = useState(2);
  const fx = x * x + 2 * y * y;

  return (
    <SlideFrame title="What Is a Multivariable Function?">
      <div className="space-y-5 text-slate-300">
        <p className="text-lg leading-relaxed">
          A multivariable function takes <strong className="text-white">more than one input</strong> and returns
          usually one scalar output. We write <MathExpr>f(x₁, x₂, …, xₙ)</MathExpr> or compactly{' '}
          <MathExpr>f(x)</MathExpr> where <MathExpr>x</MathExpr> is the vector of inputs.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="font-mono text-center text-xl text-white bg-slate-950 border border-slate-700 rounded-xl py-4">
              f(x, y) = x² + 2y²
            </div>
            <SliderControl label="x" value={x} min={-3} max={3} step={0.1} onChange={setX} format={(v) => v.toFixed(1)} />
            <SliderControl label="y" value={y} min={-3} max={3} step={0.1} onChange={setY} accent="accent-violet-500" format={(v) => v.toFixed(1)} />
            <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-4 text-center">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Live evaluation</div>
              <div className="font-mono text-sm text-slate-400 mt-2">
                f({x.toFixed(1)}, {y.toFixed(1)}) = ({x.toFixed(1)})² + 2({y.toFixed(1)})²
              </div>
              <div className="font-mono text-3xl text-emerald-400 font-bold mt-2">= {fx.toFixed(2)}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-2">Long form</div>
              <div className="font-mono text-lg text-white">f(x₁, x₂, …, xₙ)</div>
              <p className="text-sm text-slate-500 mt-2">Lists every input by name.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-2">Vector form</div>
              <div className="font-mono text-lg text-white">
                x = [x₁, x₂, …, xₙ]ᵀ &nbsp;→&nbsp; f(x)
              </div>
              <p className="text-sm text-slate-500 mt-2">Same idea — cleaner when n is large (like model weights).</p>
            </div>
            <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 text-sm text-amber-100/90 leading-relaxed">
              <Lightbulb className="inline text-amber-400 mr-2" size={16} />
              Try x=1, y=2: you should get <MathExpr>1 + 8 = 9</MathExpr>. Drag the sliders — the notation stops
              being abstract the moment the number moves.
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const bowl = (a, b) => a * a + b * b;

const SlideSurfaceExplorer = () => {
  const [x, setX] = useState(1);
  const [y, setY] = useState(1);
  const z = bowl(x, y);

  return (
    <SlideFrame title="Visualizing: From Curve to Surface">
      <div className="space-y-4 text-slate-300">
        <p className="text-base leading-relaxed">
          One variable → a <strong className="text-white">curve</strong> in 2D.
          Two variables → a <strong className="text-white">surface</strong> in 3D: height{' '}
          <MathExpr>z = f(x, y)</MathExpr>. Explore the bowl <MathExpr>z = x² + y²</MathExpr> (a paraboloid).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
            <SliderControl label="x" value={x} min={-2} max={2} step={0.05} onChange={setX} format={(v) => v.toFixed(2)} />
            <SliderControl label="y" value={y} min={-2} max={2} step={0.05} onChange={setY} accent="accent-violet-500" format={(v) => v.toFixed(2)} />
            <div className="bg-slate-950 border border-slate-700 rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Height z</div>
              <div className="font-mono text-3xl text-orange-400 font-bold mt-1">{z.toFixed(2)}</div>
              <div className="text-xs text-slate-500 mt-1 font-mono">
                z = ({x.toFixed(2)})² + ({y.toFixed(2)})²
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Minimum at <MathExpr>(0,0)</MathExpr> where z=0 — the bottom of the bowl. Farther from origin → taller.
            </p>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-700 rounded-2xl p-2 min-h-[280px]">
            <IsoSurface fx={bowl} x0={x} y0={y} width={440} height={300} />
          </div>

          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center gap-3">
            <div className="text-xs text-slate-400 self-start">
              Top-down heat map (color = height). Click to move the point.
            </div>
            <HeatmapPad fx={bowl} x0={x} y0={y} onPick={(nx, ny) => { setX(nx); setY(ny); }} size={220} />
            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              Rings = level curves (same z). Gradients will later be arrows perpendicular to these rings.
            </p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideMLCost = () => (
  <SlideFrame title="Why This Matters for Machine Learning">
    <div className="space-y-5 text-slate-300 leading-relaxed">
      <p className="text-lg">
        Beyond 2 inputs we can&apos;t draw a surface — but the ideas stay the same. In ML, the big multivariable
        functions are the <strong className="text-white">prediction</strong> and the <strong className="text-white">cost</strong>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-blue-400 font-bold mb-3">
            <Target size={18} /> Prediction
          </div>
          <div className="font-mono text-sm text-emerald-400 bg-slate-950 rounded-xl p-3 border border-slate-800 leading-relaxed">
            h(x) = w₁x₁ + w₂x₂ + … + wₙxₙ + b
          </div>
          <p className="text-sm text-slate-400 mt-3">
            Inputs <MathExpr>x</MathExpr> are features. Parameters <MathExpr>w</MathExpr>, <MathExpr>b</MathExpr> are
            what training adjusts.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-rose-400 font-bold mb-3">
            <Brain size={18} /> Cost (to minimize)
          </div>
          <div className="font-mono text-xs text-emerald-400 bg-slate-950 rounded-xl p-3 border border-slate-800 leading-relaxed">
            J(w₁, w₂, b) = (1/2m) Σ (h(xⁱ) − yⁱ)²
          </div>
          <p className="text-sm text-slate-400 mt-3">
            <MathExpr>J</MathExpr> is a function of the parameters. Training = find the bottom of this
            high-dimensional bowl.
          </p>
        </div>
      </div>

      <div className="bg-violet-950/30 border border-violet-800/40 rounded-xl p-5 text-base">
        To walk downhill on <MathExpr>J</MathExpr>, we need to know: <em>if I nudge one weight, how does cost
        change?</em> That question is answered by <strong className="text-white">partial derivatives</strong> —
        next slides.
      </div>
    </div>
  </SlideFrame>
);

// ─── Slides: Partial Derivatives ─────────────────────────────────────────────

const SlidePartialIntro = () => (
  <SlideFrame title="Partial Derivatives: The Core Idea">
    <div className="space-y-5 text-slate-300 leading-relaxed text-lg">
      <p>
        For <MathExpr>f(x)</MathExpr>, the derivative <MathExpr>f′(x)</MathExpr> is the slope.
        For <MathExpr>f(x, y)</MathExpr>, there are many directions to move — so we ask a simpler question first:
      </p>
      <div className="bg-slate-900 border border-blue-800/40 rounded-2xl p-6 text-center">
        <p className="text-xl text-white font-medium">
          How does the output change if I move <em>only one</em> input, and freeze the others?
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-5">
          <div className="font-mono text-rose-300 text-lg mb-2">∂f/∂x &nbsp;or&nbsp; fₓ</div>
          <p className="text-sm text-slate-400">
            Nudge <MathExpr>x</MathExpr>, keep <MathExpr>y</MathExpr> fixed. Slope along the &ldquo;east–west&rdquo; direction.
          </p>
        </div>
        <div className="bg-blue-950/20 border border-blue-800/40 rounded-xl p-5">
          <div className="font-mono text-blue-300 text-lg mb-2">∂f/∂y &nbsp;or&nbsp; fᵧ</div>
          <p className="text-sm text-slate-400">
            Nudge <MathExpr>y</MathExpr>, keep <MathExpr>x</MathExpr> fixed. Slope along the &ldquo;north–south&rdquo; direction.
          </p>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-3 items-start">
        <Snowflake className="text-cyan-400 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-slate-400 leading-relaxed">
          The curly <MathExpr>∂</MathExpr> (&ldquo;del&rdquo; / &ldquo;partial&rdquo;) is a reminder: other variables are frozen.
          Ordinary <MathExpr>d</MathExpr> would mean everything can move.
        </p>
      </div>
    </div>
  </SlideFrame>
);

const SlidePartialCalc = () => {
  const [mode, setMode] = useState('x'); // x | y
  const [x, setX] = useState(1);
  const [y, setY] = useState(2);

  // f = x² + 3xy + y³
  const fx = 2 * x + 3 * y;
  const fy = 3 * x + 3 * y * y;

  const terms = [
    { id: 'x2', label: 'x²', dx: '2x', dy: '0' },
    { id: '3xy', label: '3xy', dx: '3y', dy: '3x' },
    { id: 'y3', label: 'y³', dx: '0', dy: '3y²' },
  ];

  return (
    <SlideFrame title="How to Calculate Partials">
      <div className="space-y-4 text-slate-300">
        <p className="text-base leading-relaxed">
          Recipe: (1) pick the variable, (2) treat others as numbers, (3) use normal derivative rules.
          Example: <MathExpr>f(x,y) = x² + 3xy + y³</MathExpr>
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('x')}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === 'x' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            Differentiate w.r.t. x
          </button>
          <button
            type="button"
            onClick={() => setMode('y')}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === 'y' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            Differentiate w.r.t. y
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">
              Term-by-term ({mode === 'x' ? 'y is frozen' : 'x is frozen'})
            </div>
            {terms.map((t) => {
              const active = mode === 'x' ? t.dx !== '0' : t.dy !== '0';
              const result = mode === 'x' ? t.dx : t.dy;
              return (
                <div
                  key={t.id}
                  className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 border transition-all ${
                    active
                      ? mode === 'x'
                        ? 'border-rose-500/50 bg-rose-950/30'
                        : 'border-blue-500/50 bg-blue-950/30'
                      : 'border-slate-800 bg-slate-950 opacity-50'
                  }`}
                >
                  <span className="font-mono text-white">{t.label}</span>
                  <ArrowRight size={14} className="text-slate-600 shrink-0" />
                  <span className={`font-mono ${result === '0' ? 'text-slate-500' : 'text-emerald-400'}`}>
                    {result === '0' ? '0 (constant)' : result}
                  </span>
                </div>
              );
            })}
            <div className={`rounded-xl p-4 border text-center font-mono text-lg ${
              mode === 'x' ? 'border-rose-500/40 bg-rose-950/20 text-rose-200' : 'border-blue-500/40 bg-blue-950/20 text-blue-200'
            }`}>
              {mode === 'x' ? '∂f/∂x = 2x + 3y' : '∂f/∂y = 3x + 3y²'}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">Evaluate at a point</div>
            <SliderControl label="x" value={x} min={-2} max={3} step={0.1} onChange={setX} format={(v) => v.toFixed(1)} />
            <SliderControl label="y" value={y} min={-2} max={3} step={0.1} onChange={setY} accent="accent-violet-500" format={(v) => v.toFixed(1)} />
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-3 text-center">
                <div className="text-[10px] text-rose-400 font-bold uppercase">∂f/∂x</div>
                <div className="font-mono text-xl text-rose-300 mt-1">{fx.toFixed(2)}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">2({x.toFixed(1)})+3({y.toFixed(1)})</div>
              </div>
              <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-3 text-center">
                <div className="text-[10px] text-blue-400 font-bold uppercase">∂f/∂y</div>
                <div className="font-mono text-xl text-blue-300 mt-1">{fy.toFixed(2)}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">3({x.toFixed(1)})+3({y.toFixed(1)})²</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              At (1, 2): ∂f/∂x = 8, ∂f/∂y = 15. These two numbers will become the components of the{' '}
              <strong className="text-white">gradient vector</strong> in Part 2.
            </p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const ellipticBowl = (x, y) => 0.5 * x * x + y * y;

const SlidePartialGeometry = () => {
  const [x0, setX0] = useState(1);
  const [y0, setY0] = useState(1);
  const [slice, setSlice] = useState('both'); // x | y | both

  const z0 = ellipticBowl(x0, y0);
  const dfdx = x0; // ∂/∂x (0.5 x^2) = x
  const dfdy = 2 * y0;

  const xCurve = useMemo(
    () =>
      Array.from({ length: 81 }, (_, i) => {
        const x = -2 + i * 0.05;
        return { t: x, z: ellipticBowl(x, y0), tangent: z0 + dfdx * (x - x0) };
      }),
    [x0, y0, z0, dfdx]
  );

  const yCurve = useMemo(
    () =>
      Array.from({ length: 81 }, (_, i) => {
        const y = -2 + i * 0.05;
        return { t: y, z: ellipticBowl(x0, y), tangent: z0 + dfdy * (y - y0) };
      }),
    [x0, y0, z0, dfdy]
  );

  return (
    <SlideFrame title="Geometry: Slices & Slopes">
      <div className="space-y-3 text-slate-300">
        <p className="text-base leading-relaxed">
          On the surface <MathExpr>z = 0.5x² + y²</MathExpr>, a partial is just the slope of a 2D curve you get by
          slicing with a vertical plane. Red = freeze y. Blue = freeze x.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <SliderControl label="x₀" value={x0} min={-1.8} max={1.8} step={0.05} onChange={setX0} format={(v) => v.toFixed(2)} />
              <SliderControl label="y₀" value={y0} min={-1.8} max={1.8} step={0.05} onChange={setY0} accent="accent-violet-500" format={(v) => v.toFixed(2)} />
              <div className="flex gap-1">
                {[
                  { id: 'both', label: 'Both' },
                  { id: 'x', label: '∂/∂x' },
                  { id: 'y', label: '∂/∂y' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSlice(s.id)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${
                      slice === s.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-rose-950/30 border border-rose-800/40 rounded-lg p-2 text-center">
                  <div className="text-[9px] text-rose-400 font-bold uppercase">∂z/∂x</div>
                  <div className="font-mono text-lg text-rose-300">{dfdx.toFixed(2)}</div>
                </div>
                <div className="bg-blue-950/30 border border-blue-800/40 rounded-lg p-2 text-center">
                  <div className="text-[9px] text-blue-400 font-bold uppercase">∂z/∂y</div>
                  <div className="font-mono text-lg text-blue-300">{dfdy.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-700 rounded-2xl p-2 min-h-[260px]">
            <IsoSurface
              fx={ellipticBowl}
              x0={x0}
              y0={y0}
              showXSlice={slice === 'x' || slice === 'both'}
              showYSlice={slice === 'y' || slice === 'both'}
              width={420}
              height={280}
            />
            <div className="flex justify-center gap-4 text-[10px] pb-2">
              <span className="text-rose-300">━ slice y = y₀ (∂/∂x)</span>
              <span className="text-blue-300">━ slice x = x₀ (∂/∂y)</span>
              <span className="text-orange-300">● point</span>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-3">
            {(slice === 'x' || slice === 'both') && (
              <div className="bg-slate-900 border border-rose-900/40 rounded-xl p-2 h-[140px]">
                <div className="text-[10px] text-rose-400 font-bold px-2">Red curve: z vs x at y={y0.toFixed(2)}</div>
                <ResponsiveContainer width="100%" height="85%">
                  <ComposedChart data={xCurve} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                    <XAxis dataKey="t" type="number" hide domain={[-2, 2]} />
                    <YAxis hide domain={[0, 6]} />
                    <Line type="monotone" dataKey="z" stroke="#f43f5e" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line type="monotone" dataKey="tangent" stroke="#fda4af" strokeWidth={1.5} strokeDasharray="4 3" dot={false} isAnimationActive={false} />
                    <ReferenceDot x={x0} y={z0} r={4} fill="#f97316" stroke="#fff" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
            {(slice === 'y' || slice === 'both') && (
              <div className="bg-slate-900 border border-blue-900/40 rounded-xl p-2 h-[140px]">
                <div className="text-[10px] text-blue-400 font-bold px-2">Blue curve: z vs y at x={x0.toFixed(2)}</div>
                <ResponsiveContainer width="100%" height="85%">
                  <ComposedChart data={yCurve} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                    <XAxis dataKey="t" type="number" hide domain={[-2, 2]} />
                    <YAxis hide domain={[0, 6]} />
                    <Line type="monotone" dataKey="z" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line type="monotone" dataKey="tangent" stroke="#93c5fd" strokeWidth={1.5} strokeDasharray="4 3" dot={false} isAnimationActive={false} />
                    <ReferenceDot x={y0} y={z0} r={4} fill="#f97316" stroke="#fff" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
            <p className="text-[11px] text-slate-500 leading-relaxed px-1">
              Dashed line = tangent. Its slope <em>is</em> the partial at the orange point.
            </p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlidePartialML = () => {
  const [w, setW] = useState(0.5);
  const [b, setB] = useState(1);
  const x = 2; // fixed feature
  const yTrue = 5; // fixed label
  const pred = w * x + b;
  const err = pred - yTrue;
  const J = err * err;
  const dJdw = 2 * err * x;
  const dJdb = 2 * err * 1;

  return (
    <SlideFrame title="Partials in ML: Cost J(w, b)">
      <div className="space-y-4 text-slate-300">
        <p className="text-base leading-relaxed">
          Tiny linear model on one point: <MathExpr>J(w,b) = (wx + b − y)²</MathExpr>.
          Partials tell you: &ldquo;nudge w or b — does error go up or down?&rdquo;
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="text-xs text-slate-500 font-mono">
              Fixed data: x = {x}, y = {yTrue}
            </div>
            <SliderControl label="weight w" value={w} min={-2} max={4} step={0.05} onChange={setW} format={(v) => v.toFixed(2)} />
            <SliderControl label="bias b" value={b} min={-2} max={4} step={0.05} onChange={setB} accent="accent-violet-500" format={(v) => v.toFixed(2)} />

            <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 space-y-2 text-sm font-mono">
              <div className="flex justify-between"><span className="text-slate-500">prediction wx+b</span><span className="text-white">{pred.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">error (pred−y)</span><span className="text-amber-300">{err.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">cost J</span><span className="text-rose-300 text-lg">{J.toFixed(2)}</span></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-4">
              <div className="text-xs text-rose-400 font-bold uppercase mb-1">∂J/∂w = 2(wx+b−y)·x</div>
              <div className="font-mono text-2xl text-rose-300">{dJdw.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {dJdw > 0.05
                  ? 'Positive → increasing w makes cost worse. Gradient descent will decrease w.'
                  : dJdw < -0.05
                    ? 'Negative → increasing w helps. Gradient descent will increase w.'
                    : 'Near zero → w is locally good for this point.'}
              </p>
            </div>
            <div className="bg-blue-950/20 border border-blue-800/40 rounded-xl p-4">
              <div className="text-xs text-blue-400 font-bold uppercase mb-1">∂J/∂b = 2(wx+b−y)·1</div>
              <div className="font-mono text-2xl text-blue-300">{dJdb.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Same story for the bias. Together, <MathExpr>⟨∂J/∂w, ∂J/∂b⟩</MathExpr> is the gradient of J.
              </p>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-3 text-xs text-emerald-200/90 leading-relaxed">
              Tip: try to drive J near 0 by hand. Notice the partials shrink as you approach a good (w, b) —
              that&apos;s why gradient steps get smaller near a minimum.
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlidePart1Wrap = () => (
  <SlideFrame title="Part 1 Wrap-Up → Next: Gradients">
    <div className="space-y-5 text-slate-300 leading-relaxed text-lg">
      <p>You now have the building blocks:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <Layers className="text-blue-400 mb-2" size={22} />
          <div className="font-bold text-white mb-1">Multivariable f</div>
          <p className="text-sm text-slate-400">Many inputs → one output. Surfaces when there are two inputs.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <Box className="text-rose-400 mb-2" size={22} />
          <div className="font-bold text-white mb-1">Partials ∂f/∂xᵢ</div>
          <p className="text-sm text-slate-400">Slope along one axis while freezing the rest — slices of the surface.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <Compass className="text-amber-400 mb-2" size={22} />
          <div className="font-bold text-white mb-1">Coming in Part 2</div>
          <p className="text-sm text-slate-400">
            Pack partials into <MathExpr>∇f</MathExpr> — critical points, Hessian classification, directional
            derivatives, and −∇f as the compass for gradient descent (topic 13).
          </p>
        </div>
      </div>
      <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-5 text-base">
        Preview: <MathExpr>∇f = ⟨∂f/∂x, ∂f/∂y⟩</MathExpr>. One vector, both slopes — points &ldquo;straight uphill.&rdquo;
        Continue in <strong className="text-white">topic 13</strong> for the rest.
      </div>
    </div>
  </SlideFrame>
);

// ─── Main slideshow ──────────────────────────────────────────────────────────

const MultivariableGradients12 = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    SlideIntro,
    SlideNotation,
    SlideSurfaceExplorer,
    SlideMLCost,
    SlidePartialIntro,
    SlidePartialCalc,
    SlidePartialGeometry,
    SlidePartialML,
    SlidePart1Wrap,
  ];

  const nextSlide = () => setCurrentSlide((p) => Math.min(p + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide((p) => Math.max(p - 1, 0));
  const Current = slides[currentSlide];

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-5xl h-[85vh] flex flex-col">
        <div className="flex-1 relative min-h-0">
          <Current />
        </div>

        <div className="flex items-center justify-between mt-6 px-2 shrink-0 gap-3">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`p-3 rounded-full transition-all shrink-0 ${
              currentSlide === 0
                ? 'bg-slate-900 text-slate-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg'
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
            <span className="text-xs text-slate-500 font-mono">
              Part 1 · {currentSlide + 1} / {slides.length}
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
            onClick={nextSlide}
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

export default MultivariableGradients12;
