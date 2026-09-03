import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Activity, Compass, Mountain, ArrowDownToLine,
  Brain, Lightbulb, Target, Layers, Zap, AlertTriangle, CheckCircle2, Crosshair
} from 'lucide-react';

export const meta = {
  title: '13. Multivariable Calculus: Gradients & Direction (Part 2)',
  subtitle: 'Gradient, Directional Derivatives & Hessian',
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
    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">{children}</div>
  </div>
);

const mag = (x, y) => Math.hypot(x, y) || 1e-9;

// Isometric surface for critical-point / Hessian demos
const IsoSurface = ({
  fx = (x, y) => x * x + y * y,
  x0 = 1,
  y0 = 1,
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
      const t = Math.max(0, Math.min(1, (zAvg + 4) / 10));
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

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" role="img" aria-label="3D surface">
      <rect width={width} height={height} fill="#0f172a" rx="12" />
      {polys.map((p) => (
        <polygon key={p.key} points={p.points} fill={p.fill} stroke="#334155" strokeWidth="0.4" />
      ))}
      <line x1={pFloor.px} y1={pFloor.py} x2={p0.px} y2={p0.py} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx={pFloor.px} cy={pFloor.py} r="4" fill="#64748b" />
      <circle cx={p0.px} cy={p0.py} r="7" fill="#f97316" stroke="#fff" strokeWidth="1.5" />
      <text x={p0.px + 10} y={p0.py - 8} fill="#fdba74" fontSize="11" fontFamily="ui-monospace, monospace">
        ({x0.toFixed(1)}, {y0.toFixed(1)}, {z0.toFixed(2)})
      </text>
    </svg>
  );
};

// Contour plot with gradient arrows for f = x² + y² (∇f = ⟨2x, 2y⟩)
const ContourGradientPlot = ({
  points,
  active,
  onPick,
  showNeg = false,
  width = 360,
  height = 360,
  range = 2.8,
}) => {
  const toPx = (x, y) => ({
    px: ((x + range) / (2 * range)) * width,
    py: ((range - y) / (2 * range)) * height,
  });

  const handle = (e) => {
    if (!onPick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * width;
    const py = ((e.clientY - rect.top) / rect.height) * height;
    const x = -range + (2 * range * px) / width;
    const y = range - (2 * range * py) / height;
    onPick(
      Math.max(-2.5, Math.min(2.5, parseFloat(x.toFixed(2)))),
      Math.max(-2.5, Math.min(2.5, parseFloat(y.toFixed(2))))
    );
  };

  const circles = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6];
  const origin = toPx(0, 0);

  const arrow = (x, y, scale = 0.28, neg = false) => {
    const gx = 2 * x;
    const gy = 2 * y;
    const m = mag(gx, gy);
    const sx = ((neg ? -gx : gx) / m) * Math.min(m * scale, 0.85);
    const sy = ((neg ? -gy : gy) / m) * Math.min(m * scale, 0.85);
    const a = toPx(x, y);
    const b = toPx(x + sx, y + sy);
    return { a, b, m };
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full cursor-crosshair bg-slate-950 rounded-xl border border-slate-700"
      onClick={handle}
    >
      {/* grid */}
      {[-2, -1, 0, 1, 2].map((v) => {
        const h = toPx(-range, v);
        const v1 = toPx(v, -range);
        return (
          <g key={v}>
            <line x1={0} y1={h.py} x2={width} y2={h.py} stroke="#1e293b" strokeWidth="1" />
            <line x1={v1.px} y1={0} x2={v1.px} y2={height} stroke="#1e293b" strokeWidth="1" />
          </g>
        );
      })}
      <line x1={0} y1={origin.py} x2={width} y2={origin.py} stroke="#475569" strokeWidth="1.5" />
      <line x1={origin.px} y1={0} x2={origin.px} y2={height} stroke="#475569" strokeWidth="1.5" />

      {circles.map((r) => {
        const p = toPx(Math.sqrt(r), 0);
        const rad = Math.abs(p.px - origin.px);
        return (
          <circle
            key={r}
            cx={origin.px}
            cy={origin.py}
            r={rad}
            fill="none"
            stroke="#64748b"
            strokeWidth="1"
            opacity="0.55"
          />
        );
      })}

      {points.map((pt, i) => {
        const { a, b } = arrow(pt.x, pt.y, 0.3, showNeg);
        return (
          <g key={i}>
            <line
              x1={a.px}
              y1={a.py}
              x2={b.px}
              y2={b.py}
              stroke={showNeg ? '#34d399' : '#60a5fa'}
              strokeWidth="2.5"
              markerEnd={showNeg ? 'url(#arrowNeg)' : 'url(#arrowPos)'}
            />
            <circle cx={a.px} cy={a.py} r="5" fill={showNeg ? '#34d399' : '#3b82f6'} stroke="#fff" strokeWidth="1" />
          </g>
        );
      })}

      {active && (() => {
        const { a, b, m } = arrow(active.x, active.y, 0.35, showNeg);
        return (
          <g>
            <line
              x1={a.px}
              y1={a.py}
              x2={b.px}
              y2={b.py}
              stroke={showNeg ? '#fbbf24' : '#f97316'}
              strokeWidth="3.5"
            />
            <circle cx={a.px} cy={a.py} r="7" fill="#f97316" stroke="#fff" strokeWidth="2" />
            <text x={a.px + 10} y={a.py - 10} fill="#fdba74" fontSize="11" fontFamily="monospace">
              ‖∇f‖={m.toFixed(2)}
            </text>
          </g>
        );
      })()}

      <defs>
        <marker id="arrowPos" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#60a5fa" />
        </marker>
        <marker id="arrowNeg" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#34d399" />
        </marker>
      </defs>

      <text x="8" y="16" fill="#64748b" fontSize="10">click to place point</text>
      <text x={origin.px + 6} y={14} fill="#94a3b8" fontSize="11">y</text>
      <text x={width - 14} y={origin.py - 6} fill="#94a3b8" fontSize="11">x</text>
    </svg>
  );
};

// ─── Slides ──────────────────────────────────────────────────────────────────

const SlideGradientIntro = () => (
  <SlideFrame title="The Gradient Vector">
    <div className="space-y-5 text-slate-300 leading-relaxed text-lg">
      <p>
        Partials tell you the slope <em>east</em> (<MathExpr>∂f/∂x</MathExpr>) and <em>north</em>{' '}
        (<MathExpr>∂f/∂y</MathExpr>). The <strong className="text-white">gradient</strong> packs them into one arrow that
        points <strong className="text-amber-300">straight uphill</strong> — steepest ascent.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
          <Mountain className="mx-auto text-rose-400 mb-2" size={28} />
          <div className="text-sm text-slate-400">Terrain = f(x,y)</div>
          <div className="text-xs text-slate-500 mt-1">Height at every (x,y)</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
          <div className="font-mono text-rose-300 text-lg mb-2">∂f/∂x , ∂f/∂y</div>
          <div className="text-sm text-slate-400">East & north slopes only</div>
        </div>
        <div className="bg-slate-900 border border-amber-800/40 rounded-xl p-5 text-center">
          <Compass className="mx-auto text-amber-400 mb-2" size={28} />
          <div className="font-mono text-amber-300 text-lg mb-2">∇f</div>
          <div className="text-sm text-slate-400">One vector → steepest uphill</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Definition</div>
        <div className="font-mono text-center text-emerald-400 text-base md:text-lg leading-relaxed">
          ∇f(x₁,…,xₙ) = ⟨ ∂f/∂x₁ , ∂f/∂x₂ , … , ∂f/∂xₙ ⟩
        </div>
        <p className="text-sm text-slate-400 mt-4 text-center">
          Read <MathExpr>∇f</MathExpr> as &ldquo;nabla f&rdquo; or &ldquo;del f.&rdquo; It&apos;s a{' '}
          <strong className="text-white">vector field</strong>: every point gets its own uphill arrow.
        </p>
      </div>
    </div>
  </SlideFrame>
);

const SlideGradientCalc = () => {
  const [x, setX] = useState(1);
  const [y, setY] = useState(2);
  // f = x² + y³ → ∇f = ⟨2x, 3y²⟩
  const gx = 2 * x;
  const gy = 3 * y * y;
  const m = mag(gx, gy);

  return (
    <SlideFrame title="Building ∇f: Live Example">
      <div className="space-y-4 text-slate-300">
        <p className="text-base leading-relaxed">
          Example <MathExpr>f(x,y) = x² + y³</MathExpr>. Partials → assemble the vector → evaluate at a point.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between bg-slate-950 rounded-lg px-3 py-2 border border-slate-800">
                <span className="text-slate-500">∂f/∂x (y frozen)</span>
                <span className="font-mono text-rose-300">2x</span>
              </div>
              <div className="flex justify-between bg-slate-950 rounded-lg px-3 py-2 border border-slate-800">
                <span className="text-slate-500">∂f/∂y (x frozen)</span>
                <span className="font-mono text-blue-300">3y²</span>
              </div>
              <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-lg px-3 py-3 text-center font-mono text-emerald-300">
                ∇f(x,y) = ⟨ 2x , 3y² ⟩
              </div>
            </div>
            <SliderControl label="x" value={x} min={-2} max={3} step={0.1} onChange={setX} format={(v) => v.toFixed(1)} />
            <SliderControl label="y" value={y} min={-2} max={3} step={0.1} onChange={setY} accent="accent-violet-500" format={(v) => v.toFixed(1)} />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-center gap-4">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">At ({x.toFixed(1)}, {y.toFixed(1)})</div>
              <div className="font-mono text-3xl text-amber-300 mt-2">
                ∇f = ⟨ {gx.toFixed(2)} , {gy.toFixed(2)} ⟩
              </div>
              <div className="text-sm text-slate-400 mt-2">
                Magnitude ‖∇f‖ = √({gx.toFixed(2)}² + {gy.toFixed(2)}²) = <span className="text-white font-mono">{m.toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 text-sm text-amber-100/90 leading-relaxed">
              <Lightbulb className="inline text-amber-400 mr-2" size={16} />
              At (1, 2) you get ⟨2, 12⟩ — from that point, walk roughly in the direction of that arrow to climb
              fastest. Try other points and watch both components change.
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideGeometry = () => {
  const seed = [
    { x: 1, y: 1 },
    { x: -1, y: 1.5 },
    { x: -1.5, y: -0.8 },
    { x: 1.5, y: -1 },
    { x: 0.2, y: -1.8 },
  ];
  const [active, setActive] = useState({ x: 1.2, y: 0.8 });
  const [showNeg, setShowNeg] = useState(false);

  const gx = 2 * active.x;
  const gy = 2 * active.y;
  const m = mag(gx, gy);

  return (
    <SlideFrame title="Direction, Magnitude & Contours">
      <div className="space-y-3 text-slate-300">
        <p className="text-base leading-relaxed">
          For <MathExpr>f = x² + y²</MathExpr>, <MathExpr>∇f = ⟨2x, 2y⟩</MathExpr>. Contours are circles of constant height.
          Gradients are always <strong className="text-white">perpendicular</strong> to contours and point outward (uphill).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNeg(false)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold ${!showNeg ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  ∇f ascent
                </button>
                <button
                  type="button"
                  onClick={() => setShowNeg(true)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold ${showNeg ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  −∇f descent
                </button>
              </div>
              <SliderControl label="x" value={active.x} min={-2.5} max={2.5} step={0.05} onChange={(v) => setActive((a) => ({ ...a, x: v }))} format={(v) => v.toFixed(2)} />
              <SliderControl label="y" value={active.y} min={-2.5} max={2.5} step={0.05} onChange={(v) => setActive((a) => ({ ...a, y: v }))} accent="accent-violet-500" format={(v) => v.toFixed(2)} />
              <div className="bg-slate-950 border border-slate-700 rounded-xl p-3 text-center font-mono text-sm">
                <div className="text-amber-300">
                  {showNeg ? '−' : ''}∇f = ⟨ {(showNeg ? -gx : gx).toFixed(2)}, {(showNeg ? -gy : gy).toFixed(2)} ⟩
                </div>
                <div className="text-slate-400 mt-1">‖∇f‖ = {m.toFixed(2)} &nbsp;·&nbsp; f = {(active.x ** 2 + active.y ** 2).toFixed(2)}</div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2 leading-relaxed">
              <p><strong className="text-blue-300">Direction:</strong> steepest ascent (or −∇f = steepest descent).</p>
              <p><strong className="text-violet-300">Magnitude:</strong> how fast f changes in that direction.</p>
              <p><strong className="text-slate-300">Rule:</strong> ∇f ⟂ contour through that point.</p>
            </div>
          </div>
          <div className="lg:col-span-8 min-h-[320px]">
            <ContourGradientPlot
              points={seed}
              active={active}
              showNeg={showNeg}
              onPick={(x, y) => setActive({ x, y })}
            />
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideMLCompass = () => {
  const [w, setW] = useState(1.5);
  const [b, setB] = useState(1.2);
  const [playing, setPlaying] = useState(false);
  // Simple bowl cost J(w,b) = w² + 0.5 b²  (minimum at 0,0)
  const J = w * w + 0.5 * b * b;
  const gw = 2 * w;
  const gb = b;
  const lr = 0.15;

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => {
      setW((prev) => {
        const next = prev - lr * 2 * prev;
        return Math.abs(next) < 0.02 ? 0 : next;
      });
      setB((prev) => {
        const next = prev - lr * prev;
        return Math.abs(next) < 0.02 ? 0 : next;
      });
    }, 120);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => {
    if (Math.abs(w) < 0.03 && Math.abs(b) < 0.03 && playing) setPlaying(false);
  }, [w, b, playing]);

  const range = 2.5;
  const size = 280;
  const toPx = (x, y) => ({
    px: ((x + range) / (2 * range)) * size,
    py: ((range - y) / (2 * range)) * size,
  });
  const p = toPx(w, b);
  const step = toPx(w - lr * gw * 0.8, b - lr * gb * 0.8);

  return (
    <SlideFrame title="Why Gradients Matter in ML">
      <div className="space-y-4 text-slate-300">
        <p className="text-base leading-relaxed">
          Training = minimize a cost <MathExpr>J(w, b)</MathExpr>. The compass is <MathExpr>−∇J</MathExpr> —
          take small steps downhill. That algorithm is <strong className="text-white">gradient descent</strong>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="text-xs text-slate-500 font-mono">Demo cost: J = w² + ½b² (bowl; min at origin)</div>
            <SliderControl label="w" value={w} min={-2} max={2} step={0.05} onChange={(v) => { setPlaying(false); setW(v); }} format={(v) => v.toFixed(2)} />
            <SliderControl label="b" value={b} min={-2} max={2} step={0.05} onChange={(v) => { setPlaying(false); setB(v); }} accent="accent-violet-500" format={(v) => v.toFixed(2)} />
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-950 rounded-lg p-2 border border-slate-700">
                <div className="text-slate-500">J</div>
                <div className="font-mono text-rose-300 text-lg">{J.toFixed(2)}</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-2 border border-slate-700">
                <div className="text-slate-500">∇J</div>
                <div className="font-mono text-blue-300 text-[11px]">⟨{gw.toFixed(1)}, {gb.toFixed(1)}⟩</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-2 border border-slate-700">
                <div className="text-slate-500">−∇J</div>
                <div className="font-mono text-emerald-300 text-[11px]">⟨{(-gw).toFixed(1)}, {(-gb).toFixed(1)}⟩</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold"
              >
                {playing ? 'Pause descent' : 'Run gradient descent'}
              </button>
              <button
                type="button"
                onClick={() => { setPlaying(false); setW(1.5); setB(1.2); }}
                className="px-4 py-2.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-bold"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3 flex items-center justify-center">
            <svg width={size} height={size} className="rounded-xl bg-slate-950 border border-slate-800">
              {[0.3, 0.8, 1.5, 2.5, 4].map((c) => {
                // ellipse: w² + 0.5 b² = c → w=sqrt(c), b=sqrt(2c)
                const o = toPx(0, 0);
                const rx = (Math.sqrt(c) / range) * (size / 2);
                const ry = (Math.sqrt(2 * c) / range) * (size / 2);
                return <ellipse key={c} cx={o.px} cy={o.py} rx={rx} ry={ry} fill="none" stroke="#475569" strokeWidth="1" />;
              })}
              <line x1={0} y1={size / 2} x2={size} y2={size / 2} stroke="#334155" />
              <line x1={size / 2} y1={0} x2={size / 2} y2={size} stroke="#334155" />
              {/* −∇J arrow */}
              <line x1={p.px} y1={p.py} x2={step.px} y2={step.py} stroke="#34d399" strokeWidth="3" />
              <circle cx={p.px} cy={p.py} r="8" fill="#f97316" stroke="#fff" strokeWidth="2" />
              <circle cx={size / 2} cy={size / 2} r="5" fill="#22c55e" />
              <text x="8" y="18" fill="#94a3b8" fontSize="11">parameter plane (w, b)</text>
              <text x={size / 2 + 6} y={16} fill="#64748b" fontSize="10">b</text>
              <text x={size - 16} y={size / 2 - 6} fill="#64748b" fontSize="10">w</text>
            </svg>
          </div>
        </div>
        <p className="text-sm text-slate-400 text-center">
          Orange = current parameters. Green arrow ≈ one descent step. Center = minimum cost.
        </p>
      </div>
    </SlideFrame>
  );
};

const SlideDirectionalIntro = () => (
  <SlideFrame title="Directional Derivatives">
    <div className="space-y-5 text-slate-300 leading-relaxed text-lg">
      <p>
        Partials = slopes along the axes. Gradient = steepest direction. What about walking{' '}
        <em>northeast at 37°</em>? That rate is the <strong className="text-white">directional derivative</strong>.
      </p>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <div className="font-mono text-2xl text-emerald-400">
          D<sub>u</sub>f(a) = ∇f(a) · u
        </div>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Dot product of the gradient at point <MathExpr>a</MathExpr> with a{' '}
          <strong className="text-white">unit</strong> direction <MathExpr>u</MathExpr> (‖u‖ = 1).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-rose-400 font-bold mb-2">1. Gradient</div>
          <p className="text-slate-400">∇f(a) holds all partials at a.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-blue-400 font-bold mb-2">2. Unit vector u</div>
          <p className="text-slate-400">
            If you have v, normalize: <MathExpr>u = v / ‖v‖</MathExpr>
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-emerald-400 font-bold mb-2">3. Dot product</div>
          <p className="text-slate-400">How much of ∇f points along u.</p>
        </div>
      </div>

      <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 text-sm leading-relaxed">
        Because <MathExpr>∇f · u = ‖∇f‖ cos θ</MathExpr>, the directional derivative is the{' '}
        <strong className="text-white">projection</strong> of the gradient onto your walking direction.
      </div>
    </div>
  </SlideFrame>
);

const SlideDirectionalViz = () => {
  const [thetaDeg, setThetaDeg] = useState(35);
  // Fixed example: at (1,1), ∇f = ⟨2,2⟩ for f=x²+y²
  const gx = 2;
  const gy = 2;
  const gMag = mag(gx, gy);
  const theta = (thetaDeg * Math.PI) / 180;
  const ux = Math.cos(theta);
  const uy = Math.sin(theta);
  const Du = gx * ux + gy * uy;
  const gAngle = (Math.atan2(gy, gx) * 180) / Math.PI;
  const angBetween = Math.abs(thetaDeg - gAngle);

  const W = 380;
  const H = 300;
  const ox = 60;
  const oy = H - 40;
  const scale = 55;
  const tipG = { x: ox + gx * scale * 0.55, y: oy - gy * scale * 0.55 };
  const tipU = { x: ox + ux * scale * 1.6, y: oy - uy * scale * 1.6 };
  const tipP = { x: ox + ux * Du * scale * 0.55, y: oy - uy * Du * scale * 0.55 };

  // projection foot: from tipG drop perpendicular onto u-line
  const projLen = Du * 0.55 * scale;
  const foot = { x: ox + ux * projLen, y: oy - uy * projLen };

  return (
    <SlideFrame title="Directional Derivative = Projection">
      <div className="space-y-3 text-slate-300">
        <p className="text-base leading-relaxed">
          Fixed point <MathExpr>a = (1,1)</MathExpr> on <MathExpr>f = x²+y²</MathExpr> so{' '}
          <MathExpr>∇f = ⟨2,2⟩</MathExpr>. Rotate direction <MathExpr>u</MathExpr> and watch the green projection
          (that length <em>is</em> <MathExpr>D_u f</MathExpr>).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
            <SliderControl
              label="Direction angle θ"
              value={thetaDeg}
              min={-180}
              max={180}
              step={1}
              onChange={setThetaDeg}
              accent="accent-blue-500"
              format={(v) => `${v.toFixed(0)}°`}
              hint="0° = +x axis"
            />
            <div className="bg-slate-950 border border-slate-700 rounded-xl p-3 space-y-2 text-sm font-mono">
              <div className="flex justify-between"><span className="text-slate-500">u</span><span className="text-blue-300">⟨{ux.toFixed(2)}, {uy.toFixed(2)}⟩</span></div>
              <div className="flex justify-between"><span className="text-slate-500">∇f</span><span className="text-rose-300">⟨2.00, 2.00⟩</span></div>
              <div className="flex justify-between"><span className="text-slate-500">∇f · u</span><span className="text-emerald-300 text-lg">{Du.toFixed(3)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">‖∇f‖ cos θ</span><span className="text-emerald-300">{(gMag * Math.cos((angBetween * Math.PI) / 180)).toFixed(3)}</span></div>
            </div>
            <div className="text-xs text-slate-400 leading-relaxed space-y-1.5">
              <p>• θ ≈ 45° (align with ∇f) → <strong className="text-emerald-300">max</strong> = ‖∇f‖ ≈ {gMag.toFixed(2)}</p>
              <p>• θ ≈ 225° (opposite) → <strong className="text-rose-300">min</strong> = −‖∇f‖ (steepest descent)</p>
              <p>• θ ≈ 135° (⟂ ∇f) → <strong className="text-slate-300">zero</strong> (along a contour)</p>
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-900 border border-slate-700 rounded-2xl p-2 flex justify-center">
            <svg width={W} height={H} className="bg-slate-950 rounded-xl">
              {/* axes */}
              <line x1={20} y1={oy} x2={W - 20} y2={oy} stroke="#475569" />
              <line x1={ox} y1={20} x2={ox} y2={H - 20} stroke="#475569" />

              {/* u direction (dotted) */}
              <line x1={ox} y1={oy} x2={tipU.x} y2={tipU.y} stroke="#60a5fa" strokeWidth="2" strokeDasharray="5 4" />
              <circle cx={tipU.x} cy={tipU.y} r="4" fill="#60a5fa" />

              {/* gradient */}
              <line x1={ox} y1={oy} x2={tipG.x} y2={tipG.y} stroke="#f43f5e" strokeWidth="3" />
              <circle cx={tipG.x} cy={tipG.y} r="5" fill="#f43f5e" />

              {/* projection */}
              <line x1={ox} y1={oy} x2={tipP.x} y2={tipP.y} stroke="#34d399" strokeWidth="4" />
              <circle cx={tipP.x} cy={tipP.y} r="6" fill="#34d399" stroke="#fff" strokeWidth="1" />

              {/* perpendicular drop */}
              <line x1={tipG.x} y1={tipG.y} x2={foot.x} y2={foot.y} stroke="#f9a8d4" strokeWidth="1.5" strokeDasharray="4 3" />

              <text x={tipG.x + 8} y={tipG.y} fill="#fda4af" fontSize="12">∇f</text>
              <text x={tipU.x + 6} y={tipU.y + 4} fill="#93c5fd" fontSize="12">u</text>
              <text x={tipP.x + 8} y={tipP.y - 8} fill="#6ee7b7" fontSize="12">Dᵤf = {Du.toFixed(2)}</text>

              <g transform={`translate(${ox + 40},${oy - 50})`}>
                <text fill="#94a3b8" fontSize="11">θ ≈ {angBetween.toFixed(0)}° from ∇f</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideDirectionalExample = () => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: 'Setup',
      body: 'f = x² + y² (bowl). At a = (1,1), walk in direction v = ⟨1, 2⟩. How fast does f change?',
    },
    {
      title: 'Step 1 — Gradient',
      body: '∇f = ⟨2x, 2y⟩. At (1,1): ∇f = ⟨2, 2⟩. Points away from origin (uphill).',
    },
    {
      title: 'Step 2 — Unit vector',
      body: '‖v‖ = √(1+4) = √5.  u = ⟨1/√5, 2/√5⟩ ≈ ⟨0.447, 0.894⟩.',
    },
    {
      title: 'Step 3 — Dot product',
      body: 'Dᵤf = ⟨2,2⟩ · ⟨1/√5, 2/√5⟩ = 2/√5 + 4/√5 = 6/√5 ≈ 2.68.',
    },
    {
      title: 'Meaning',
      body: 'Along v, f rises ≈ 2.68 per unit distance. Max possible is ‖∇f‖ = √8 ≈ 2.83 (along ⟨2,2⟩). So v is almost — but not quite — the steepest path.',
    },
  ];

  return (
    <SlideFrame title="Worked Example + ML Link">
      <div className="space-y-4 text-slate-300">
        <div className="flex flex-wrap gap-2">
          {steps.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setStep(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                i === step ? 'bg-blue-600 text-white' : i < step ? 'bg-slate-700 text-slate-300' : 'bg-slate-800 text-slate-500'
              }`}
            >
              {i + 1}. {s.title}
            </button>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[140px]">
          <div className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-2">{steps[step].title}</div>
          <p className="text-lg leading-relaxed">{steps[step].body}</p>
          {step === 3 && (
            <div className="mt-4 font-mono text-emerald-400 text-center text-xl bg-slate-950 rounded-xl py-3 border border-slate-700">
              6/√5 ≈ 2.683
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className="px-4 py-2 rounded-lg bg-slate-800 text-sm font-bold disabled:opacity-30"
          >
            Back
          </button>
          <button
            type="button"
            disabled={step === steps.length - 1}
            onClick={() => setStep((s) => s + 1)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold disabled:opacity-30"
          >
            Next step
          </button>
        </div>

        <div className="bg-violet-950/30 border border-violet-800/40 rounded-xl p-4 text-sm leading-relaxed">
          <Brain className="inline text-violet-400 mr-2" size={16} />
          <strong className="text-white">In ML:</strong> we rarely compute arbitrary directional derivatives by hand —
          we almost always step along <MathExpr>−∇J</MathExpr> because that direction gives the most negative{' '}
          <MathExpr>D_u J</MathExpr> (fastest local drop in loss).
        </div>
      </div>
    </SlideFrame>
  );
};

// ─── Critical points & Hessian classification ────────────────────────────────

const saddleFn = (x, y) => x * x - y * y;
const bowlMin = (x, y) => x * x + y * y;
const domeMax = (x, y) => -(x * x + y * y);

const SlideCriticalPoints = () => {
  const surfaces = [
    {
      id: 'bowl',
      name: 'Bowl (min)',
      fx: bowlMin,
      label: 'f = x² + y²',
      gx: (x, y) => [2 * x, 2 * y],
      hint: '∇f = ⟨2x, 2y⟩ = 0 only at (0,0) — a valley floor',
    },
    {
      id: 'dome',
      name: 'Dome (max)',
      fx: domeMax,
      label: 'f = −(x² + y²)',
      gx: (x, y) => [-2 * x, -2 * y],
      hint: '∇f = ⟨−2x, −2y⟩ = 0 at (0,0) — a peak',
    },
    {
      id: 'saddle',
      name: 'Saddle',
      fx: saddleFn,
      label: 'f = x² − y²',
      gx: (x, y) => [2 * x, -2 * y],
      hint: '∇f = ⟨2x, −2y⟩ = 0 at (0,0) — flat, but not a min or max!',
    },
  ];
  const [surfIdx, setSurfIdx] = useState(0);
  const [x, setX] = useState(1.2);
  const [y, setY] = useState(0.8);
  const surf = surfaces[surfIdx];
  const [gx, gy] = surf.gx(x, y);
  const gMag = Math.hypot(gx, gy);
  const nearCrit = gMag < 0.15;

  return (
    <SlideFrame title="Optimization: Critical Points">
      <div className="space-y-3 text-slate-300">
        <p className="text-base leading-relaxed">
          In 1D we solve <MathExpr>f′(x) = 0</MathExpr>. In many variables the whole gradient must vanish:
          <MathExpr>∇f(x₀) = 0</MathExpr> — every partial is zero. That&apos;s a <strong className="text-white">critical point</strong>
          (locally flat). Drag toward the origin and watch ‖∇f‖ → 0.
        </p>

        <div className="flex flex-wrap gap-2">
          {surfaces.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => { setSurfIdx(i); setX(1.2); setY(0.8); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                i === surfIdx ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="font-mono text-center text-emerald-400 text-sm bg-slate-950 rounded-lg py-2 border border-slate-700">
              {surf.label}
            </div>
            <SliderControl label="x" value={x} min={-2} max={2} step={0.05} onChange={setX} format={(v) => v.toFixed(2)} />
            <SliderControl label="y" value={y} min={-2} max={2} step={0.05} onChange={setY} accent="accent-violet-500" format={(v) => v.toFixed(2)} />
            <div className={`rounded-xl p-3 border text-center ${nearCrit ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-slate-950 border-slate-700'}`}>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Gradient at point</div>
              <div className="font-mono text-lg text-amber-300 mt-1">
                ∇f = ⟨ {gx.toFixed(2)}, {gy.toFixed(2)} ⟩
              </div>
              <div className="font-mono text-sm text-slate-400 mt-1">‖∇f‖ = {gMag.toFixed(3)}</div>
              <div className={`text-xs font-semibold mt-2 ${nearCrit ? 'text-emerald-300' : 'text-slate-500'}`}>
                {nearCrit ? '≈ critical point (∇f ≈ 0)' : 'Not critical — still sloping'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setX(0); setY(0); }}
              className="w-full py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <Crosshair size={14} /> Snap to (0, 0)
            </button>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-700 rounded-2xl p-2 min-h-[260px]">
            <IsoSurface fx={surf.fx} x0={x} y0={y} width={400} height={280} />
          </div>

          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm space-y-3 leading-relaxed">
            <p className="text-slate-400">{surf.hint}</p>
            <div className="bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs space-y-2">
              <p><strong className="text-white">1D analogy:</strong> f′ = 0</p>
              <p><strong className="text-white">Multi-D:</strong> ∂f/∂x₁ = 0, ∂f/∂x₂ = 0, … all at once</p>
              <p className="text-slate-500">Zero gradient ⇒ no preferred uphill direction — locally flat.</p>
            </div>
            <p className="text-xs text-amber-200/80 bg-amber-950/20 border border-amber-800/40 rounded-lg p-3">
              <AlertTriangle className="inline mr-1 text-amber-400" size={14} />
              Flat ≠ minimum! The saddle is critical but climbs one way and drops the other — next slides.
            </p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideHessianClassify = () => {
  const examples = [
    {
      id: 'saddle',
      title: 'Saddle · f = x² − y²',
      fx: saddleFn,
      H: [[2, 0], [0, -2]],
      verdict: 'Indefinite → SADDLE',
      color: 'amber',
      detail: 'Eigenvalues +2 and −2. Up along x, down along y. ∇f=(0,0) at origin, but not a min.',
      ml: 'Danger in deep nets: gradient vanishes, optimizer may stall — yet you are not at a minimum.',
    },
    {
      id: 'min',
      title: 'Local min · f = x² + y²',
      fx: bowlMin,
      H: [[2, 0], [0, 2]],
      verdict: 'Positive definite → LOCAL MIN',
      color: 'emerald',
      detail: 'Both eigenvalues positive. Bowl-up in every direction — the training goal.',
      ml: 'Cost landscapes we hope to reach: any step away increases loss.',
    },
    {
      id: 'max',
      title: 'Local max · f = −(x² + y²)',
      fx: domeMax,
      H: [[-2, 0], [0, -2]],
      verdict: 'Negative definite → LOCAL MAX',
      color: 'rose',
      detail: 'Both eigenvalues negative. Dome-down. Rarely the goal when minimizing cost.',
      ml: 'Maximizing a reward is the mirror image — same math, opposite sign.',
    },
  ];
  const [idx, setIdx] = useState(0);
  const ex = examples[idx];
  const border = {
    amber: 'border-amber-500/50 bg-amber-950/30 text-amber-200',
    emerald: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-200',
    rose: 'border-rose-500/50 bg-rose-950/30 text-rose-200',
  }[ex.color];

  return (
    <SlideFrame title="Classify with the Hessian + ML">
      <div className="space-y-3 text-slate-300">
        <p className="text-base leading-relaxed">
          Once <MathExpr>∇f(x₀) = 0</MathExpr>, read curvature from the <strong className="text-white">Hessian</strong>{' '}
          <MathExpr>H</MathExpr> (matrix of second partials). Same role as <MathExpr>f″</MathExpr> in 1D.
        </p>

        <div className="flex flex-wrap gap-2">
          {examples.map((e, i) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setIdx(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                i === idx ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {e.title.split('·')[0].trim()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-700 rounded-2xl p-2 relative">
            <IsoSurface fx={ex.fx} x0={0} y0={0} width={400} height={260} />
            <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
              critical pt (0,0)
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <div className={`rounded-xl p-4 border ${border}`}>
              <div className="font-bold text-sm mb-1">{ex.verdict}</div>
              <p className="text-xs opacity-90 leading-relaxed">{ex.detail}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Hessian at (0,0)</div>
              <div className="font-mono text-emerald-400 text-center text-lg leading-relaxed">
                H = | {ex.H[0][0]} &nbsp; {ex.H[0][1]} |<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| {ex.H[1][0]} &nbsp; {ex.H[1][1]} |
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 text-[10px] text-center">
                <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-lg p-2 text-emerald-300">
                  + definite → min
                </div>
                <div className="bg-rose-950/30 border border-rose-800/40 rounded-lg p-2 text-rose-300">
                  − definite → max
                </div>
                <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-2 text-amber-300">
                  indefinite → saddle
                </div>
              </div>
            </div>

            <div className="bg-violet-950/30 border border-violet-800/40 rounded-xl p-4 text-sm leading-relaxed flex gap-3">
              <Brain className="text-violet-400 shrink-0 mt-0.5" size={20} />
              <div>
                <div className="font-bold text-violet-200 mb-1">Relevance to Machine Learning</div>
                <p className="text-slate-400 text-xs leading-relaxed mb-2">{ex.ml}</p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  In practice we minimize a <strong className="text-white">cost/loss</strong> over parameters (weights & biases).
                  Solving <MathExpr>∇J = 0</MathExpr> analytically is usually impossible, and forming H for millions of
                  parameters is too expensive — so we use <strong className="text-white">gradient descent</strong> to walk
                  downhill with <MathExpr>−∇J</MathExpr>. Knowing critical points & saddles explains why training can stall
                  even when you haven&apos;t found a good minimum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideHessianIntro = () => (
  <SlideFrame title="The Hessian Matrix">
    <div className="space-y-5 text-slate-300 leading-relaxed">
      <p className="text-lg">
        <MathExpr>∇f</MathExpr> is first-order (which way is up). It doesn&apos;t say if the hill is a bowl, a dome, or a
        saddle. That <strong className="text-white">curvature</strong> needs second derivatives — collected in the{' '}
        <strong className="text-amber-300">Hessian</strong> <MathExpr>H = ∇²f</MathExpr>.
      </p>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-x-auto">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">For 2 variables</div>
        <div className="font-mono text-emerald-400 text-sm md:text-base text-center leading-loose">
          H = |  ∂²f/∂x² &nbsp;&nbsp; ∂²f/∂x∂y |<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  ∂²f/∂y∂x &nbsp; ∂²f/∂y² |
        </div>
        <p className="text-sm text-slate-400 mt-4 text-center max-w-lg mx-auto">
          Diagonal = curvature along each axis. Off-diagonal = mixed partials (how ∂f/∂x changes as y moves).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-4">
          <CheckCircle2 className="text-emerald-400 mb-2" size={20} />
          <div className="font-bold text-emerald-300 mb-1">Symmetry (Clairaut)</div>
          <p className="text-sm text-slate-400">
            If second partials are continuous: <MathExpr>∂²f/∂x∂y = ∂²f/∂y∂x</MathExpr> → H is symmetric (H = Hᵀ).
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <Layers className="text-blue-400 mb-2" size={20} />
          <div className="font-bold text-white mb-1">Analogy</div>
          <p className="text-sm text-slate-400">
            1D: f′ = slope, f″ = concavity. Multi-D: ∇f = slope vector, H = full curvature map.
          </p>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideHessianExplorer = () => {
  // Interactive quadratic: f = (1/2)[a x² + 2h xy + b y²]
  // Hessian = [[a, h], [h, b]]
  const [a, setA] = useState(2);
  const [b, setB] = useState(2);
  const [h, setH] = useState(0);

  // Classification via eigenvalues of [[a,h],[h,b]]
  const trace = a + b;
  const det = a * b - h * h;
  const disc = Math.sqrt(Math.max(0, trace * trace - 4 * det));
  const l1 = (trace + disc) / 2;
  const l2 = (trace - disc) / 2;

  let kind = 'inconclusive';
  let label = 'Semidefinite / edge case';
  let color = 'slate';
  if (det > 1e-6 && a > 0) {
    kind = 'min';
    label = 'Positive definite → local MIN (bowl)';
    color = 'emerald';
  } else if (det > 1e-6 && a < 0) {
    kind = 'max';
    label = 'Negative definite → local MAX (dome)';
    color = 'rose';
  } else if (det < -1e-6) {
    kind = 'saddle';
    label = 'Indefinite → SADDLE';
    color = 'amber';
  }

  // Tiny isometric preview of quadratic form
  const fx = (x, y) => 0.5 * (a * x * x + 2 * h * x * y + b * y * y);
  const width = 340;
  const height = 240;
  const project = (x, y, z) => {
    const s = 42;
    return {
      px: width / 2 + (x - y) * s * 0.85,
      py: height * 0.55 + (x + y) * s * 0.32 - z * s * 0.35,
    };
  };
  const polys = [];
  for (let xi = -1.6; xi < 1.6; xi += 0.35) {
    for (let yi = -1.6; yi < 1.6; yi += 0.35) {
      const pts = [
        [xi, yi],
        [xi + 0.35, yi],
        [xi + 0.35, yi + 0.35],
        [xi, yi + 0.35],
      ].map(([x, y]) => project(x, y, fx(x, y)));
      const zc = fx(xi + 0.17, yi + 0.17);
      const t = Math.max(0, Math.min(1, (zc + 3) / 6));
      const fill =
        kind === 'min'
          ? `rgba(16,185,129,${0.25 + t * 0.35})`
          : kind === 'max'
            ? `rgba(244,63,94,${0.25 + t * 0.35})`
            : kind === 'saddle'
              ? `rgba(251,191,36,${0.2 + t * 0.35})`
              : `rgba(100,116,139,${0.3})`;
      polys.push({
        key: `${xi}-${yi}`,
        points: pts.map((p) => `${p.px},${p.py}`).join(' '),
        fill,
        depth: xi + yi,
      });
    }
  }
  polys.sort((p, q) => p.depth - q.depth);

  const colorBorder = {
    emerald: 'border-emerald-500/50 bg-emerald-950/30',
    rose: 'border-rose-500/50 bg-rose-950/30',
    amber: 'border-amber-500/50 bg-amber-950/30',
    slate: 'border-slate-600 bg-slate-900',
  }[color];

  return (
    <SlideFrame title="Hessian Decides: Min / Max / Saddle">
      <div className="space-y-3 text-slate-300">
        <p className="text-base leading-relaxed">
          At a critical point (<MathExpr>∇f = 0</MathExpr>), the Hessian&apos;s shape classifies it. Tune the 2×2 Hessian
          of a quadratic and watch the surface morph.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="font-mono text-center text-emerald-400 text-sm bg-slate-950 rounded-lg py-2 border border-slate-700">
              H = | {a.toFixed(1)} &nbsp; {h.toFixed(1)} |<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| {h.toFixed(1)} &nbsp; {b.toFixed(1)} |
            </div>
            <SliderControl label="H₁₁ = a" value={a} min={-3} max={3} step={0.1} onChange={setA} format={(v) => v.toFixed(1)} hint="curvature in x" />
            <SliderControl label="H₂₂ = b" value={b} min={-3} max={3} step={0.1} onChange={setB} accent="accent-violet-500" format={(v) => v.toFixed(1)} hint="curvature in y" />
            <SliderControl label="H₁₂ = h" value={h} min={-2} max={2} step={0.1} onChange={setH} accent="accent-amber-500" format={(v) => v.toFixed(1)} hint="cross term (tilt)" />
            <div className={`rounded-xl p-3 border text-center text-sm font-semibold ${colorBorder}`}>
              {label}
            </div>
            <div className="text-[11px] text-slate-500 font-mono text-center">
              eigenvalues ≈ {l1.toFixed(2)}, {l2.toFixed(2)} · det={det.toFixed(2)}
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-900 border border-slate-700 rounded-2xl p-2 flex justify-center">
            <svg width={width} height={height} className="bg-slate-950 rounded-xl">
              {polys.map((p) => (
                <polygon key={p.key} points={p.points} fill={p.fill} stroke="#334155" strokeWidth="0.4" />
              ))}
              <text x="12" y="20" fill="#94a3b8" fontSize="11">
                quadratic form from H (critical point at origin)
              </text>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
          <button type="button" onClick={() => { setA(2); setB(2); setH(0); }} className="bg-emerald-950/40 border border-emerald-800/40 rounded-lg py-2 text-emerald-300 font-bold">Bowl (min)</button>
          <button type="button" onClick={() => { setA(-2); setB(-2); setH(0); }} className="bg-rose-950/40 border border-rose-800/40 rounded-lg py-2 text-rose-300 font-bold">Dome (max)</button>
          <button type="button" onClick={() => { setA(2); setB(-2); setH(0); }} className="bg-amber-950/40 border border-amber-800/40 rounded-lg py-2 text-amber-300 font-bold">Saddle</button>
          <button type="button" onClick={() => { setA(1); setB(1); setH(1.2); }} className="bg-slate-800 border border-slate-600 rounded-lg py-2 text-slate-300 font-bold">Tilted</button>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideConvexity = () => (
  <SlideFrame title="Convexity & Why ML Cares">
    <div className="space-y-5 text-slate-300 leading-relaxed">
      <p className="text-lg">
        A function is <strong className="text-white">convex</strong> if it looks like a bowl everywhere — the graph
        sits below any chord. Equivalently (when twice differentiable): Hessian is{' '}
        <strong className="text-emerald-300">positive semidefinite</strong> everywhere
        (<MathExpr>vᵀ H(x) v ≥ 0</MathExpr> for all v).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-5">
          <CheckCircle2 className="text-emerald-400 mb-2" size={22} />
          <div className="font-bold text-emerald-300 mb-2">Convex (good news)</div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Any local minimum is <strong className="text-white">global</strong>. Gradient descent can&apos;t get trapped
            in a worse basin — classic linear/logistic regression costs are convex in the parameters.
          </p>
        </div>
        <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-5">
          <AlertTriangle className="text-amber-400 mb-2" size={22} />
          <div className="font-bold text-amber-300 mb-2">Non-convex (deep nets)</div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Many saddles and local minima. Hessian thinking still helps explain flat regions, sharp minima, and why
            optimization is hard — even when we don&apos;t form H explicitly.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm leading-relaxed">
        <strong className="text-white">Flow at a critical point:</strong> ∇f = 0 → check H → positive definite (min) /
        negative definite (max) / indefinite (saddle) / semidefinite (inconclusive).
      </div>
    </div>
  </SlideFrame>
);

const SlideNewtonVsGD = () => {
  const [n, setN] = useState(100);
  const hessianElems = n * n;
  const invertOps = n * n * n;
  const fmt = (v) => {
    if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
    if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
    return String(v);
  };

  return (
    <SlideFrame title="Role in Optimization Algorithms">
      <div className="space-y-4 text-slate-300">
        <p className="text-base leading-relaxed">
          <strong className="text-white">Gradient descent</strong> uses first-order info (∇f).{' '}
          <strong className="text-white">Newton&apos;s method</strong> also uses the Hessian — often fewer steps near a
          minimum, but storing/inverting H costs <MathExpr>n²</MathExpr> memory and ~<MathExpr>O(n³)</MathExpr> time.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <SliderControl
              label="Number of parameters n"
              value={n}
              min={10}
              max={5000}
              step={10}
              onChange={setN}
              format={(v) => Math.round(v).toLocaleString()}
              hint="Neural nets: n can be millions"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-3 text-center">
                <div className="text-[10px] text-blue-400 font-bold uppercase">Hessian entries</div>
                <div className="font-mono text-xl text-blue-300 mt-1">{fmt(hessianElems)}</div>
                <div className="text-[10px] text-slate-500">n²</div>
              </div>
              <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-3 text-center">
                <div className="text-[10px] text-rose-400 font-bold uppercase">Invert cost ~</div>
                <div className="font-mono text-xl text-rose-300 mt-1">{fmt(invertOps)}</div>
                <div className="text-[10px] text-slate-500">O(n³) ops</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Drag n up — see why deep learning sticks to SGD / Adam (first-order) or Hessian{' '}
              <em>approximations</em>, not full Newton.
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-3">
              <Zap className="text-blue-400 shrink-0" size={22} />
              <div>
                <div className="font-bold text-white text-sm mb-1">First-order (GD / SGD)</div>
                <p className="text-xs text-slate-400">Cheap per step: one gradient. Many steps, scales to huge n.</p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-3">
              <Target className="text-amber-400 shrink-0" size={22} />
              <div>
                <div className="font-bold text-white text-sm mb-1">Second-order (Newton)</div>
                <p className="text-xs text-slate-400">
                  Uses curvature → smarter steps near minima. Expensive when n is large.
                </p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-3">
              <Lightbulb className="text-emerald-400 shrink-0" size={22} />
              <div>
                <div className="font-bold text-white text-sm mb-1">Conceptual value of H</div>
                <p className="text-xs text-slate-400">
                  Even unread, Hessian ideas explain saddles, sharpness, and convexity — complementing the
                  direction story from ∇f.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideWrapUp = () => (
  <SlideFrame title="Part 2 Wrap-Up">
    <div className="space-y-5 text-slate-300 leading-relaxed text-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <Compass className="text-amber-400 mb-2" size={22} />
          <div className="font-bold text-white mb-1">Gradient ∇f</div>
          <p className="text-sm text-slate-400">Packs partials; points steepest ascent; ‖∇f‖ = max rate.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <ArrowDownToLine className="text-emerald-400 mb-2" size={22} />
          <div className="font-bold text-white mb-1">−∇f & directional Dᵤf</div>
          <p className="text-sm text-slate-400">Descent compass; Dᵤf = ∇f · u = projection onto any walk direction.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <Crosshair className="text-rose-400 mb-2" size={22} />
          <div className="font-bold text-white mb-1">Critical points & Hessian</div>
          <p className="text-sm text-slate-400">∇f = 0 finds candidates; H sorts min / max / saddle — and explains ML stalls.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <Brain className="text-blue-400 mb-2" size={22} />
          <div className="font-bold text-white mb-1">ML optimization</div>
          <p className="text-sm text-slate-400">GD follows −∇J; full Newton uses H but rarely at deep-net scale.</p>
        </div>
      </div>
      <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-5 text-base">
        Together with Part 1 (surfaces + partials), you can read the full story: freeze axes → build ∇f → walk with
        Dᵤf → find critical points → classify with H → train with −∇J.
      </div>
    </div>
  </SlideFrame>
);

// ─── Main ────────────────────────────────────────────────────────────────────

const MultivariableGradients13 = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    SlideGradientIntro,
    SlideGradientCalc,
    SlideGeometry,
    SlideMLCompass,
    SlideDirectionalIntro,
    SlideDirectionalViz,
    SlideDirectionalExample,
    SlideHessianIntro,
    SlideHessianExplorer,
    SlideConvexity,
    SlideNewtonVsGD,
    SlideCriticalPoints,
    SlideHessianClassify,
    SlideWrapUp,
  ];

  const Current = slides[currentSlide];

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-5xl h-[85vh] flex flex-col">
        <div className="flex-1 relative min-h-0">
          <Current />
        </div>

        <div className="flex items-center justify-between mt-6 px-2 shrink-0 gap-3">
          <button
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
              Part 2 · {currentSlide + 1} / {slides.length}
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

export default MultivariableGradients13;
