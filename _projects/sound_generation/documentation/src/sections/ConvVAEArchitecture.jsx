import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Code2, ChevronRight } from 'lucide-react';

// ─── math helpers ─────────────────────────────────────────────────────────────
const lerp   = (a, b, t) => a + (b - a) * t;
const clamp  = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const hexToRgb = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];
// Deterministic per-frame noise (avoids Math.random() flickering)
const noise = (i, seed) => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

// ─── 11 stages, one per layer in components.py ───────────────────────────────
const STAGES = [
  {
    id: 'input', group: 'input',
    label: 'Input', sublabel: '1 × 80 × 258',
    C: 1, H: 80, W: 258,
    color: '#94a3b8',
    title: 'Input — Mel-Spectrogram',
    code:
`# x arrives from preprocessing.py
# Shape: [Batch, 1, 80, 258]
x = mel_spectrogram  # z-score normalised float32`,
    desc: 'The z-score normalised Mel-Spectrogram. 1 channel (mono), 80 Mel frequency bins on the Y-axis, 258 time frames on the X-axis. This 2D "image" of sound is what the ConvEncoder must compress into 256 numbers.',
  },
  {
    id: 'conv1', group: 'encoder',
    label: 'Conv1', sublabel: '32 × 40 × 129',
    C: 32, H: 40, W: 129,
    color: '#22d3ee',
    title: 'ConvEncoder — Layer 1',
    code:
`self.conv1 = nn.Conv2d(
    in_channels=1, out_channels=32,
    kernel_size=3, stride=2, padding=1
)
x = F.relu(self.conv1(x))
# [B, 1, 80, 258] → [B, 32, 40, 129]`,
    desc: 'kernel_size=3, stride=2, padding=1 halves both spatial dimensions in one step. Channels expand 1→32 so the network can track 32 independent low-level features simultaneously — edges, tonal patterns, transients.',
  },
  {
    id: 'conv2', group: 'encoder',
    label: 'Conv2', sublabel: '64 × 20 × 65',
    C: 64, H: 20, W: 65,
    color: '#3b82f6',
    title: 'ConvEncoder — Layer 2',
    code:
`self.conv2 = nn.Conv2d(
    in_channels=32, out_channels=64,
    kernel_size=3, stride=2, padding=1
)
x = F.relu(self.conv2(x))
# [B, 32, 40, 129] → [B, 64, 20, 65]`,
    desc: 'Another halving: 40→20 height, 129→65 width. Channels double 32→64. Each of the 64 feature maps now encodes mid-level audio patterns — combinations of the edges and tone shapes learned in Conv1.',
  },
  {
    id: 'conv3', group: 'encoder',
    label: 'Conv3', sublabel: '128 × 10 × 33',
    C: 128, H: 10, W: 33,
    color: '#6366f1',
    title: 'ConvEncoder — Layer 3',
    code:
`self.conv3 = nn.Conv2d(
    in_channels=64, out_channels=128,
    kernel_size=3, stride=2, padding=1
)
x = F.relu(self.conv3(x))
# [B, 64, 20, 65] → [B, 128, 10, 33]`,
    desc: 'Spatial resolution shrinks to a compact 10×33. 128 feature maps now encode abstract audio properties — timbre, pitch contour, rhythmic structure. The network is learning what makes this sound unique.',
  },
  {
    id: 'conv4', group: 'encoder',
    label: 'Conv4 + Flatten', sublabel: '256 × 5 × 17 → [21,760]',
    C: 256, H: 5, W: 17,
    color: '#8b5cf6',
    title: 'ConvEncoder — Layer 4 + Flatten',
    code:
`self.conv4 = nn.Conv2d(
    in_channels=128, out_channels=256,
    kernel_size=3, stride=2, padding=1
)
x = F.relu(self.conv4(x))
x = x.view(x.size(0), -1)   # Flatten
# [B, 128, 10, 33] → [B, 256, 5, 17]
# After flatten: [B, 21760]`,
    desc: 'Final conv layer gives 256 feature maps at tiny 5×17 resolution. x.view() then flattens to a 1D vector of 21,760 values (256×5×17). This dense vector holds the compressed representation of the entire audio clip.',
  },
  {
    id: 'bottleneck', group: 'bottleneck',
    label: 'μ / log σ²', sublabel: '256 + 256',
    C: 2, H: 1, W: 256,
    color: '#4ade80',
    title: 'Bottleneck — fc_mu & fc_logvar',
    code:
`self.fc_mu     = nn.Linear(21760, 256)
self.fc_logvar = nn.Linear(21760, 256)

mu     = self.fc_mu(x)      # [B, 256]  ← mean
logvar = self.fc_logvar(x)  # [B, 256]  ← log-variance`,
    desc: 'Two parallel Linear heads project the 21,760-D flattened vector to 256-D each. fc_mu predicts the mean μ of the latent distribution; fc_logvar predicts log σ². Together they parameterise a 256-D Gaussian per audio clip.',
  },
  {
    id: 'reparam', group: 'bottleneck',
    label: 'z = μ + ε·σ', sublabel: '[256]',
    C: 1, H: 1, W: 256,
    color: '#34d399',
    title: 'Reparameterize — z ~ N(μ, σ²)',
    code:
`def reparameterize(self, mu, logvar):
    std = torch.exp(0.5 * logvar)
    eps = torch.randn_like(std)  # ε ~ N(0, I)
    return mu + eps * std        # z ∈ ℝ²⁵⁶`,
    desc: 'The reparameterization trick makes sampling differentiable. Instead of z ∼ N(μ, σ²) directly (which blocks gradients), we write z = μ + ε·σ where ε ∼ N(0, I). Gradients flow through μ and σ; randomness lives only in ε.',
  },
  {
    id: 'deconv1', group: 'decoder',
    label: 'Deconv1', sublabel: '128 × 10 × 33',
    C: 128, H: 10, W: 33,
    color: '#fb923c',
    title: 'ConvDecoder — Layer 1',
    code:
`# Inflate z back to spatial feature map first
self.fc = nn.Linear(256, 21760)
x = self.fc(z).view(B, 256, 5, 17)

self.deconv1 = nn.ConvTranspose2d(
    256, 128,
    kernel_size=3, stride=2, padding=1,
    output_padding=(1, 0)   # ← corrects odd W dim
)
x = F.relu(self.deconv1(x))
# [B, 256, 5, 17] → [B, 128, 10, 33]`,
    desc: 'A Linear layer inflates z [256] back to [21,760], reshaped to [256,5,17]. ConvTranspose2d with stride=2 upsamples 2×. output_padding=(1,0) corrects the odd width — without it, width would be 32 instead of 33.',
  },
  {
    id: 'deconv2', group: 'decoder',
    label: 'Deconv2', sublabel: '64 × 20 × 65',
    C: 64, H: 20, W: 65,
    color: '#f97316',
    title: 'ConvDecoder — Layer 2',
    code:
`self.deconv2 = nn.ConvTranspose2d(
    128, 64,
    kernel_size=3, stride=2, padding=1,
    output_padding=(1, 0)
)
x = F.relu(self.deconv2(x))
# [B, 128, 10, 33] → [B, 64, 20, 65]`,
    desc: '128→64 channels, spatial dims double: 10→20 height, 33→65 width. output_padding=(1,0) is needed again because the original 65 (odd width) cannot be recovered from stride=2 without the extra column.',
  },
  {
    id: 'deconv3', group: 'decoder',
    label: 'Deconv3', sublabel: '32 × 40 × 129',
    C: 32, H: 40, W: 129,
    color: '#ef4444',
    title: 'ConvDecoder — Layer 3',
    code:
`self.deconv3 = nn.ConvTranspose2d(
    64, 32,
    kernel_size=3, stride=2, padding=1,
    output_padding=(1, 0)
)
x = F.relu(self.deconv3(x))
# [B, 64, 20, 65] → [B, 32, 40, 129]`,
    desc: '64→32 channels. Spatial resolution is now 40×129 — halfway back to the original. ReLU keeps activations positive throughout the decoder, ensuring clean gradient flow at every layer.',
  },
  {
    id: 'output', group: 'decoder',
    label: 'Output', sublabel: '1 × 80 × 258',
    C: 1, H: 80, W: 258,
    color: '#facc15',
    title: 'ConvDecoder — Layer 4 (Output)',
    code:
`self.deconv4 = nn.ConvTranspose2d(
    32, 1,
    kernel_size=3, stride=2, padding=1,
    output_padding=(1, 1)   # ← (1,1): BOTH dims are even
)
# No ReLU! Normalised dB values can be negative
reconstruction = self.deconv4(x)
# [B, 32, 40, 129] → [B, 1, 80, 258]`,
    desc: 'output_padding=(1,1) is different here — both 80 and 258 are even, so both dims need the extra row/column. No ReLU on output: z-score normalised dB values range from ≈−3 to +3, ReLU would zero out half the reconstruction.',
  },
];

const STEP = 100 / (STAGES.length - 1); // = 10

const GROUP_META = {
  input:      { label: 'Input',       textColor: 'text-slate-400',  bgColor: 'bg-slate-400/10',  border: '#94a3b8' },
  encoder:    { label: 'ConvEncoder', textColor: 'text-cyan-400',   bgColor: 'bg-cyan-400/10',   border: '#22d3ee' },
  bottleneck: { label: 'Bottleneck',  textColor: 'text-green-400',  bgColor: 'bg-green-400/10',  border: '#4ade80' },
  decoder:    { label: 'ConvDecoder', textColor: 'text-orange-400', bgColor: 'bg-orange-400/10', border: '#fb923c' },
};

// ─── canvas: pseudo-3D tensor block ──────────────────────────────────────────
function draw3DTensor(ctx, cW, cH, lo, hi, frac, frame) {
  const C = lerp(lo.C, hi.C, frac);
  const H = lerp(lo.H, hi.H, frac);
  const W = lerp(lo.W, hi.W, frac);

  const [lr, lg, lb] = hexToRgb(lo.color);
  const [hr, hg, hb] = hexToRgb(hi.color);
  const cr = Math.round(lerp(lr, hr, frac));
  const cg = Math.round(lerp(lg, hg, frac));
  const cb = Math.round(lerp(lb, hb, frac));

  const MAX_FW = cW * 0.46;
  const MAX_FH = cH * 0.60;
  const MAX_D  = 72;

  const fw = Math.max(18, (W / 258) * MAX_FW);
  const fh = Math.max(12, (H / 80)  * MAX_FH);
  const fd = Math.max(8,  (Math.log2(C + 1) / Math.log2(257)) * MAX_D);

  const ISO_X = fd * 0.58;
  const ISO_Y = fd * 0.34;

  // Centre the full block including depth extension
  const fx = (cW - fw - ISO_X) / 2;
  const fy = (cH - fh - ISO_Y) / 2 + ISO_Y;

  // ── TOP face ──
  ctx.beginPath();
  ctx.moveTo(fx,        fy);
  ctx.lineTo(fx + ISO_X, fy - ISO_Y);
  ctx.lineTo(fx + fw + ISO_X, fy - ISO_Y);
  ctx.lineTo(fx + fw,   fy);
  ctx.closePath();
  ctx.fillStyle = `rgba(${cr},${cg},${cb},0.42)`;
  ctx.fill();
  ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.85)`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // ── RIGHT (depth) face ──
  ctx.beginPath();
  ctx.moveTo(fx + fw,   fy);
  ctx.lineTo(fx + fw + ISO_X,      fy - ISO_Y);
  ctx.lineTo(fx + fw + ISO_X,      fy + fh - ISO_Y);
  ctx.lineTo(fx + fw,   fy + fh);
  ctx.closePath();
  ctx.fillStyle = `rgba(${cr},${cg},${cb},0.22)`;
  ctx.fill();
  ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.85)`;
  ctx.stroke();

  // ── FRONT face — animated heatmap ──
  const COLS = Math.max(4, Math.min(30, Math.floor(fw / 9)));
  const ROWS = Math.max(3, Math.min(20, Math.floor(fh / 9)));
  const cellW = fw / COLS;
  const cellH = fh / ROWS;
  const tOff  = frame * 0.007;

  for (let gx = 0; gx < COLS; gx++) {
    for (let gy = 0; gy < ROWS; gy++) {
      const v = (
        Math.sin(gx * 0.55 + tOff)          * Math.cos(gy * 0.75 - tOff * 0.8) +
        Math.sin(gx * 0.18 + gy * 0.35 + tOff * 0.4) * 0.6
      );
      const intensity = clamp((v + 1.6) / 3.2, 0, 1);
      const pr = Math.round(lerp(8,  cr, intensity));
      const pg = Math.round(lerp(8,  cg, intensity));
      const pb = Math.round(lerp(20, cb, intensity));
      ctx.fillStyle = `rgba(${pr},${pg},${pb},0.96)`;
      ctx.fillRect(fx + gx * cellW, fy + gy * cellH, cellW - 0.5, cellH - 0.5);
    }
  }

  // Front face border
  ctx.strokeStyle = `rgba(${cr},${cg},${cb},1)`;
  ctx.lineWidth = 2;
  ctx.strokeRect(fx, fy, fw, fh);

  // ── Dimension labels ──
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`W = ${Math.round(W)}`, fx + fw / 2, fy + fh + 22);

  ctx.save();
  ctx.translate(fx - 18, fy + fh / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(`H = ${Math.round(H)}`, 0, 0);
  ctx.restore();

  ctx.fillStyle = `rgba(${cr},${cg},${cb},0.85)`;
  ctx.fillText(`C = ${Math.round(C)}`, fx + fw + ISO_X / 2 + 8, fy - ISO_Y / 2 - 8);
  ctx.textAlign = 'left';
}

// ─── canvas: bottleneck bar charts ───────────────────────────────────────────
function drawBottleneck(ctx, cW, cH, lo, frame) {
  const isReparam = lo.id === 'reparam';
  const DIM     = 64;         // visual resolution representing 256 dims
  const BAR_W   = (cW * 0.80) / DIM;
  const startX  = cW * 0.10;
  const tOff    = frame * 0.005;

  if (!isReparam) {
    // ── Two strips: μ above mid, log σ² below mid ──
    const stripH = cH * 0.22;
    const midY   = cH * 0.46;

    for (let i = 0; i < DIM; i++) {
      const muVal  =  Math.sin(i * 0.28 + tOff) * 0.7 + Math.cos(i * 0.62 + tOff * 0.7)  * 0.3;
      const lvVal  = -(Math.abs(Math.sin(i * 0.35 + tOff * 0.5)) * 1.8 + 0.3);
      const muI    = clamp((muVal + 1) / 2, 0, 1);
      const lvI    = clamp((-lvVal) / 2.1, 0, 1);

      // μ bar (upward from midY)
      ctx.fillStyle = `rgba(250,204,21,${0.35 + muI * 0.65})`;
      ctx.fillRect(startX + i * BAR_W, midY - muI * stripH, BAR_W - 0.5, muI * stripH);

      // log σ² bar (downward)
      ctx.fillStyle = `rgba(52,211,153,${0.35 + lvI * 0.65})`;
      ctx.fillRect(startX + i * BAR_W, midY + 6, BAR_W - 0.5, lvI * stripH);
    }

    // Separator line
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(startX, midY + 3);
    ctx.lineTo(startX + DIM * BAR_W, midY + 3);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(250,204,21,0.85)';
    ctx.fillText('μ  (mean)  ·  256 values  →  fc_mu', cW / 2, midY - stripH - 14);
    ctx.fillStyle = 'rgba(52,211,153,0.85)';
    ctx.fillText('log σ²  (variance)  ·  256 values  →  fc_logvar', cW / 2, midY + stripH + 28);
    ctx.textAlign = 'left';

  } else {
    // ── Reparameterize: μ  +  ε·σ  =  z  ──
    const rowH  = cH * 0.14;
    const seed  = Math.floor(tOff * 3);
    const rows = [
      {
        label: 'μ  (mean from fc_mu)',
        y: cH * 0.22,
        color: [250, 204, 21],
        fn: (i) => Math.sin(i * 0.28 + tOff * 0.4) * 0.7 + Math.cos(i * 0.62) * 0.3,
      },
      {
        label: 'ε · σ  (sampled noise)',
        y: cH * 0.50,
        color: [244, 114, 182],
        fn: (i) => noise(i, seed) * clamp(Math.abs(Math.cos(i * 0.4)), 0.1, 1) * 0.65,
      },
      {
        label: 'z = μ + ε·σ  (latent vector)',
        y: cH * 0.78,
        color: [52, 211, 153],
        fn: (i) =>
          Math.sin(i * 0.28 + tOff * 0.4) * 0.7 +
          Math.cos(i * 0.62) * 0.3 +
          noise(i, seed) * 0.28,
      },
    ];

    // Operator symbols between rows
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('+', cW / 2, (rows[0].y + rows[1].y) / 2 + 6);
    ctx.fillText('=', cW / 2, (rows[1].y + rows[2].y) / 2 + 6);

    rows.forEach(({ label, y, color: [rr, rg, rb], fn }) => {
      for (let i = 0; i < DIM; i++) {
        const val       = fn(i);
        const intensity = clamp((val + 1) / 2, 0, 1);
        ctx.fillStyle   = `rgba(${rr},${rg},${rb},${0.35 + intensity * 0.65})`;
        ctx.fillRect(startX + i * BAR_W, y - intensity * rowH, BAR_W - 0.5, Math.max(2, intensity * rowH * 2));
      }
      ctx.fillStyle = `rgb(${rr},${rg},${rb})`;
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(label, startX, y - rowH - 6);
    });
    ctx.textAlign = 'left';
  }
}

// ─── component ───────────────────────────────────────────────────────────────
export default function ConvVAEArchitecture() {
  const [progress, setProgress] = useState(0);
  const canvasRef  = useRef(null);
  const animRef    = useRef(null);
  const progRef    = useRef(0);
  const frameRef   = useRef(0);

  useEffect(() => { progRef.current = progress; }, [progress]);

  const stageIdx = Math.min(STAGES.length - 1, Math.round(progress / STEP));
  const stage    = STAGES[stageIdx];
  const meta     = GROUP_META[stage.group];

  // ── animation loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const animate = () => {
      frameRef.current++;
      const cW  = canvas.clientWidth;
      const cH  = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width  !== Math.floor(cW * dpr) ||
          canvas.height !== Math.floor(cH * dpr)) {
        canvas.width  = Math.floor(cW * dpr);
        canvas.height = Math.floor(cH * dpr);
        ctx.scale(dpr, dpr);
      }
      ctx.clearRect(0, 0, cW, cH);

      const p      = progRef.current;
      const raw    = p / STEP;
      const loIdx  = Math.min(STAGES.length - 1, Math.floor(raw));
      const hiIdx  = Math.min(STAGES.length - 1, loIdx + 1);
      const frac   = raw - loIdx;
      const lo     = STAGES[loIdx];
      const hi     = STAGES[hiIdx];
      const isBot  = lo.group === 'bottleneck' || hi.group === 'bottleneck';

      if (isBot) {
        drawBottleneck(ctx, cW, cH, lo, frameRef.current);
      } else {
        draw3DTensor(ctx, cW, cH, lo, hi, frac, frameRef.current);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // ── slider background gradient ──────────────────────────────────────────────
  const sliderBg = `linear-gradient(to right,
    #94a3b8 ${clamp(progress,  0, 10)}%,
    #22d3ee ${clamp(progress, 10, 20)}%,
    #3b82f6 ${clamp(progress, 20, 30)}%,
    #6366f1 ${clamp(progress, 30, 40)}%,
    #8b5cf6 ${clamp(progress, 40, 50)}%,
    #4ade80 ${clamp(progress, 50, 60)}%,
    #34d399 ${clamp(progress, 60, 70)}%,
    #fb923c ${clamp(progress, 70, 80)}%,
    #f97316 ${clamp(progress, 80, 90)}%,
    #ef4444 ${clamp(progress, 90, 100)}%,
    #facc15 ${clamp(progress,100,100)}%,
    #1f2937 ${progress}%)`;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans p-4 md:p-8">

      {/* ── Header ── */}
      <div className="max-w-5xl mx-auto w-full mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-violet-500/10 rounded-xl">
            <Cpu className="w-5 h-5 text-violet-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-orange-400 text-transparent bg-clip-text">
            VAE Architecture — components.py
          </h1>
        </div>
        <p className="text-gray-500 text-sm ml-12 font-mono">
          ConvEncoder · reparameterize · ConvDecoder &nbsp;|&nbsp; {STAGES.length} layers
        </p>
      </div>

      {/* ── Canvas ── */}
      <div className="max-w-5xl mx-auto w-full mb-5">
        <div className="w-full h-64 md:h-[22rem] bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden relative">
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Stage badge */}
          <div className="absolute top-4 left-4 bg-gray-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-700/50 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
            <span className="font-semibold text-xs tracking-wide">{stage.title}</span>
          </div>

          {/* Shape badge */}
          <div className="absolute top-4 right-4 bg-gray-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-700/50">
            <span className="font-mono text-xs" style={{ color: stage.color }}>
              [B, {stage.sublabel}]
            </span>
          </div>
        </div>
      </div>

      {/* ── Pill navigation ── */}
      <div className="max-w-5xl mx-auto w-full mb-4 overflow-x-auto pb-1">
        <div className="flex items-center gap-1 min-w-max">
          {STAGES.map((s, i) => (
            <React.Fragment key={s.id}>
              <button
                onClick={() => setProgress(Math.round(i * STEP))}
                className="px-2.5 py-1 text-[10px] rounded-full border font-medium transition-all whitespace-nowrap"
                style={
                  stageIdx === i
                    ? { backgroundColor: `${s.color}22`, borderColor: s.color, color: s.color }
                    : { backgroundColor: 'transparent', borderColor: '#374151', color: '#6b7280' }
                }
              >
                {s.label}
              </button>
              {i < STAGES.length - 1 && (
                <ChevronRight className="w-2.5 h-2.5 text-gray-800 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Slider ── */}
      <div className="max-w-5xl mx-auto w-full mb-6">
        <div className="relative pt-5">
          <div className="absolute w-full flex justify-between top-0 text-[10px] font-medium select-none pointer-events-none">
            <span className="text-slate-500">Input</span>
            <span className="text-cyan-600">ConvEncoder →</span>
            <span className="text-green-600">Bottleneck</span>
            <span className="text-orange-600">← ConvDecoder</span>
            <span className="text-yellow-600">Output</span>
          </div>
          <input
            type="range" min="0" max="100" value={progress}
            onChange={e => setProgress(Number(e.target.value))}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            style={{ background: sliderBg }}
          />
        </div>
      </div>

      {/* ── Info panels ── */}
      <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-4 pb-6">

        {/* Code panel */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-gray-800 flex items-center gap-2 flex-shrink-0">
            <Code2 className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600 font-mono">src/models/components.py</span>
          </div>
          <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed flex-grow">
            <code>{stage.code}</code>
          </pre>
        </div>

        {/* Description panel */}
        <div
          className="p-6 rounded-2xl border-l-4 bg-gray-900/50 flex flex-col"
          style={{ borderColor: stage.color }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${meta.bgColor} ${meta.textColor}`}>
              {meta.label}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-2">{stage.title}</h3>
          <p className="text-gray-300 leading-relaxed text-sm">{stage.desc}</p>

          {/* Tensor shape summary */}
          <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2">
            <span className="text-xs text-gray-600 font-mono">shape:</span>
            <code className="text-xs px-2 py-0.5 rounded bg-gray-800 font-mono" style={{ color: stage.color }}>
              [B, {stage.sublabel}]
            </code>
          </div>
        </div>

      </div>
    </div>
  );
}
