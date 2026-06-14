import React, { useState, useEffect, useRef } from 'react';
import { BarChart2, Shuffle, Layers, ArrowLeftRight, ChevronRight, Zap, RefreshCcw } from 'lucide-react';

// ── helpers ───────────────────────────────────────────────────────────────────
const lerp  = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const sn    = (i, s = 0) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };

// ── static distribution data (computed once) ─────────────────────────────────
const N_BINS  = 52;
const audioDist = Array.from({ length: N_BINS }, (_, i) => {
  const x = (i / (N_BINS - 1)) * 8 - 4;
  return (
    0.45 * Math.exp(-0.5 * ((x - 1.2) / 0.65) ** 2) +
    0.32 * Math.exp(-0.5 * ((x + 0.9)  / 0.70) ** 2) +
    0.13 * Math.exp(-0.5 * ((x - 2.6)  / 0.35) ** 2) +
    0.10 * Math.exp(-0.5 * ((x + 2.7)  / 0.42) ** 2)
  );
});
const gaussDist = Array.from({ length: N_BINS }, (_, i) => {
  const x = (i / (N_BINS - 1)) * 8 - 4;
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI) * 2.2;
});

// ── stage definitions ─────────────────────────────────────────────────────────
const STAGES = [
  {
    id: 'input', vizMode: 'hist_audio',
    color: '#8b5cf6', border: 'border-violet-500', icon: BarChart2, ic: 'text-violet-400',
    cls: 'AudioLatentFlow', label: 'Input z',
    title: 'Input: Audio Latent  z  ∈  ℝ²⁵⁶',
    code:
`class AudioLatentFlow(nn.Module):
    def compute_loss(self, z):
        # z: [Batch, 256] — from frozen VAE encoder
        # Non-Gaussian — multiple modes (vocals, guitar…)
        # Goal: learn a bijection  z → u ~ N(0, I)
        u_final, log_det = self.forward(z)
        log_prob = self.get_blueprint().log_prob(u_final)
        loss = -(log_prob + log_det)
        return loss.mean()`,
    desc: 'The 256-D latent z from the frozen VAE encoder. Audio latents form a complex multi-modal distribution — vocals, instruments, and textures each cluster into separate regions. The Normalizing Flow must bijectively reshape this messy landscape into a perfect bell curve N(0, I).',
  },
  {
    id: 'split', vizMode: 'split',
    color: '#22d3ee', border: 'border-cyan-500', icon: ArrowLeftRight, ic: 'text-cyan-400',
    cls: 'AffineCouplingLayer.forward', label: 'Split',
    title: 'AffineCouplingLayer — Split z → z₁ + z₂',
    code:
`class AffineCouplingLayer(nn.Module):
    def __init__(self, dim, hidden_dim=256):
        self.half_dim = dim // 2   # = 128

    def forward(self, z):
        # Split the 256-D vector exactly in half
        z1 = z[..., :128]   # ← IDENTITY  (never modified)
        z2 = z[..., 128:]   # ← WILL BE TRANSFORMED

        # z1 passes through completely untouched.
        # It only serves as conditioning input to the MLP.`,
    desc: 'Every coupling layer begins by splitting z into two equal 128-D halves. z1 (dims 0–127) is the "condition" — it passes through completely unchanged and just provides information to the MLP. z2 (dims 128–255) is the "transform" — it will be warped by scale s and shift t derived from z1.',
  },
  {
    id: 'mlp', vizMode: 'mlp',
    color: '#f472b6', border: 'border-pink-500', icon: Zap, ic: 'text-pink-400',
    cls: 'AffineCouplingLayer.net', label: 'MLP → s, t',
    title: 'MLP:  z₁  →  scale s  +  shift t',
    code:
`self.net = nn.Sequential(
    nn.Linear(128, 256),   nn.GELU(),
    nn.Linear(256, 256),   nn.GELU(),
    nn.Linear(256, 256),   # outputs 256 = s[128] + t[128]
)
# Zero-init last layer → flow starts as identity!
nn.init.zeros_(self.net[-1].weight)
nn.init.zeros_(self.net[-1].bias)

st = self.net(z1)
s, t = st.chunk(2, dim=-1)
s = torch.tanh(s) * 2.0   # constrain: s ∈ (−2, +2)`,
    desc: 'A 3-layer MLP takes z1 and outputs 256 numbers — 128 for scale s, 128 for shift t. Zero-initializing the last layer makes the flow a perfect identity on step 1 (zero explosion risk). tanh(s)×2 bounds exp(s) to [0.14, 7.4], preventing the scale from blowing up.',
  },
  {
    id: 'transform', vizMode: 'transform',
    color: '#fb923c', border: 'border-orange-500', icon: Shuffle, ic: 'text-orange-400',
    cls: 'AffineCouplingLayer.forward', label: 'Transform',
    title: 'Transform:  z₂_new = z₂ · exp(s) + t',
    code:
`# Affine transform — perfectly invertible
z2_new = z2 * torch.exp(s) + t

# Volume penalty = log-determinant of the Jacobian
# Tracks how much probability mass was stretched
log_det = s.sum(dim=-1)   # scalar per sample

z_out = torch.cat([z1, z2_new], dim=-1)
return z_out, log_det

# EXACT ALGEBRAIC INVERSE:
# z2 = (z2_new - t) * torch.exp(-s)`,
    desc: 'z2 is scaled by exp(s) and shifted by t. Exactly invertible via algebra: z2 = (z2_new − t) × exp(−s). The log-determinant = Σs tracks total volume change and prevents the flow from "cheating" by collapsing everything to a single point — which would incur a huge negative log_det penalty.',
  },
  {
    id: 'flip', vizMode: 'flip',
    color: '#34d399', border: 'border-emerald-500', icon: RefreshCcw, ic: 'text-emerald-400',
    cls: 'AudioLatentFlow.forward', label: 'FLIP',
    title: 'The FLIP — torch.flip(u, dims=[−1])',
    code:
`# After every coupling layer, reverse the vector
u = torch.flip(u, dims=[-1]).contiguous()

# Without flip: dims [0:128] are ALWAYS the identity!
# They would NEVER be transformed.

# Layer 1: z1=[0:128] fixed  →  z2=[128:256] transforms
#          ↓ flip reverses the whole array
# Layer 2: z1=[0:128] fixed  →  z2=[128:256] transforms
#           ↑ these WERE [128:256] before the flip!
# → All 256 dims get transformed across 8 layers`,
    desc: 'After each coupling layer, torch.flip() reverses the entire 256-D vector. This ensures every dimension alternates between being the "condition" half (identity) and the "transform" half each layer. Without flip, dims 0–127 would be permanently frozen. With 8 layers, every dimension participates in exactly 4 transformations.',
  },
  {
    id: 'stack', vizMode: 'stack',
    color: '#4ade80', border: 'border-green-500', icon: Layers, ic: 'text-green-400',
    cls: 'AudioLatentFlow.forward', label: '8 Layers',
    title: '8 Layers Stacked — z → u',
    code:
`self.layers = nn.ModuleList([
    AffineCouplingLayer(dim=256, hidden_dim=256)
    for _ in range(8)
])

def forward(self, z):
    total_log_det = 0
    u = z
    for layer in self.layers:
        u, log_det = layer(u)
        total_log_det += log_det   # accumulate
        u = torch.flip(u, dims=[-1]).contiguous()
    return u, total_log_det  # u ≈ N(0, I)`,
    desc: '8 AffineCouplingLayer blocks are stacked. Each layer progressively nudges the distribution closer to N(0, I). The log_det accumulates across all 8 layers, tracking total volume change from z-space to u-space. Watch the mini-histograms above each layer morph from bimodal audio → clean bell curve.',
  },
  {
    id: 'bell', vizMode: 'hist_gauss',
    color: '#4ade80', border: 'border-green-400', icon: BarChart2, ic: 'text-green-400',
    cls: 'AudioLatentFlow.get_blueprint', label: 'Bell Curve ✓',
    title: 'Blueprint: u ~ N(0, I) Achieved',
    code:
`self.register_buffer('blueprint_loc',   torch.zeros(256))
self.register_buffer('blueprint_scale', torch.ones(256))

def get_blueprint(self):
    return Independent(
        Normal(self.blueprint_loc, self.blueprint_scale),
        reinterpreted_batch_ndims=1
    )

# NLL Loss — two terms working together:
# ① -log_prob(u):    does u look like N(0, 1)?
# ② -total_log_det:  penalise volume collapse
loss = -(log_prob(u) + total_log_det).mean()`,
    desc: 'After 8 layers, u follows N(0, I). The NLL loss has two terms: log_prob(u) rewards bell-curve outputs, and total_log_det penalises trivial solutions. register_buffer ensures the distribution parameters automatically move to GPU/MPS. The green bell curve you see is what the flow successfully learned to produce.',
  },
  {
    id: 'sample', vizMode: 'sample',
    color: '#facc15', border: 'border-yellow-500', icon: Shuffle, ic: 'text-yellow-400',
    cls: 'AudioLatentFlow.sample', label: 'Inference →',
    title: 'Inference: Sample New Audio from Thin Air',
    code:
`def sample(self, num_samples=1, device="cpu"):
    # 1. Sample pure noise from the bell curve
    u = self.get_blueprint().sample((num_samples,))

    # 2. Run BACKWARD through all 8 layers
    for layer in reversed(self.layers):
        u = torch.flip(u, dims=[-1]).contiguous()
        u = layer.inverse(u)
        # inverse: z2 = (z2_new - t) * exp(-s)

    # 3. u is now a valid audio latent z!
    new_audio = vae.decoder(u)   # → Mel-Spectrogram
    return u   # brand new sound ✨`,
    desc: 'At inference, reverse the entire flow. Sample u ~ N(0, I) (pure random noise), run backward through all 8 layers using the algebraic inverse. The output is a valid 256-D audio latent z. Decode through the frozen VAE to get a brand-new Mel-Spectrogram — a sound that has never existed.',
  },
];

const STEP = 100 / (STAGES.length - 1);

// ── canvas drawing functions ──────────────────────────────────────────────────

function drawHistogram(ctx, W, H, dist, rgb, title, targetDist, frame) {
  const [r, g, b] = rgb;
  const pL = 44, pR = 20, pT = 44, pB = 36;
  const cW = W - pL - pR, cH = H - pT - pB;
  const maxV = Math.max(...dist, 0.001);
  const barW = cW / dist.length;
  const wob  = frame * 0.011;

  if (targetDist) {
    const tMax = Math.max(...targetDist, 0.001);
    ctx.beginPath(); ctx.setLineDash([6, 4]);
    ctx.strokeStyle = 'rgba(74,222,128,0.22)'; ctx.lineWidth = 1.5;
    for (let i = 0; i < targetDist.length; i++) {
      const px = pL + (i + 0.5) * barW;
      const py = pT + cH * (1 - targetDist[i] / tMax);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(74,222,128,0.32)';
    ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('target N(0,1)', W - pR, pT + 14);
  }

  for (let i = 0; i < dist.length; i++) {
    const mw    = Math.sin(i * 0.38 + wob) * 0.014;
    const v     = clamp(dist[i] / maxV + mw, 0, 1.06);
    const bH    = Math.max(2, cH * v);
    const alpha = 0.38 + 0.62 * (dist[i] / maxV);
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.fillRect(pL + i * barW, pT + cH - bH, barW - 0.8, bH);
    ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(alpha + 0.35, 1)})`;
    ctx.fillRect(pL + i * barW, pT + cH - bH, barW - 0.8, 2);
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(pL, pT + cH); ctx.lineTo(pL + cW, pT + cH); ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
  ctx.fillText('-4', pL, pT + cH + 18);
  ctx.fillText('0',  pL + cW / 2, pT + cH + 18);
  ctx.fillText('+4', pL + cW, pT + cH + 18);
  ctx.save(); ctx.translate(14, pT + cH / 2); ctx.rotate(-Math.PI / 2);
  ctx.fillText('density', 0, 0); ctx.restore();
  ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
  ctx.font = 'bold 13px sans-serif'; ctx.fillText(title, W / 2, pT - 16);
  ctx.textAlign = 'left';
}

function drawSplit(ctx, W, H, frame) {
  const CELLS = 32, HALF = 16;
  const cellW = W * 0.80 / CELLS, cellH = 32;
  const sx = (W - CELLS * cellW) / 2, sy = H * 0.36;
  const wob = frame * 0.018;

  ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
  ctx.fillText('z  [256 dimensions — each cell represents 8 dims]', W / 2, sy - 36);

  for (let i = 0; i < CELLS; i++) {
    const v   = clamp(sn(i, 5) * 0.7 + Math.sin(i * 0.45 + wob) * 0.25 + 0.5, 0, 1);
    const x   = sx + i * cellW;
    const isZ1 = i < HALF;
    ctx.fillStyle = isZ1 ? `rgba(34,211,238,${0.3 + v * 0.65})` : `rgba(251,146,60,${0.3 + v * 0.65})`;
    ctx.fillRect(x, sy, cellW - 1.5, cellH);
    ctx.fillStyle = isZ1 ? `rgba(34,211,238,0.9)` : `rgba(251,146,60,0.9)`;
    ctx.fillRect(x, sy, cellW - 1.5, 2.5);
  }

  const divX = sx + HALF * cellW;
  ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 2; ctx.setLineDash([5, 3]);
  ctx.beginPath(); ctx.moveTo(divX, sy - 22); ctx.lineTo(divX, sy + cellH + 22); ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
  ctx.fillStyle = '#22d3ee';
  ctx.fillText('z₁  [0 : 128]',                    sx + (HALF * cellW) / 2, sy - 12);
  ctx.fillText('IDENTITY — passes through unchanged', sx + (HALF * cellW) / 2, sy + cellH + 22);
  ctx.fillStyle = '#fb923c';
  ctx.fillText('z₂  [128 : 256]',                  divX + (HALF * cellW) / 2, sy - 12);
  ctx.fillText('WILL BE TRANSFORMED via s, t',      divX + (HALF * cellW) / 2, sy + cellH + 22);
  ctx.textAlign = 'left';
}

function drawMLP(ctx, W, H, frame) {
  const tOff = frame * 0.02;
  const midY = H * 0.44, stH = H * 0.30;

  // z1 input bars
  const z1x = W * 0.03, z1W = W * 0.08;
  for (let i = 0; i < 10; i++) {
    const h = stH * clamp(sn(i, 7) * 0.55 + 0.45 + Math.sin(i * 0.6 + tOff * 0.4) * 0.1, 0.08, 1);
    ctx.fillStyle = `rgba(34,211,238,${0.42 + (h / stH) * 0.45})`;
    ctx.fillRect(z1x + i * (z1W / 10), midY + stH / 2 - h, z1W / 10 - 1, h);
  }
  ctx.fillStyle = '#22d3ee'; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
  ctx.fillText('z₁ [128]', z1x + z1W / 2, midY - stH / 2 - 14);
  ctx.fillStyle = 'rgba(34,211,238,0.45)'; ctx.font = '10px monospace';
  ctx.fillText('(identity half)', z1x + z1W / 2, midY + stH / 2 + 16);

  // MLP boxes
  const mlpBoxes = [
    { x: W * 0.17, label: 'Linear',  sub: '128→256', cr: 244, cg: 114, cb: 182 },
    { x: W * 0.32, label: 'GELU',    sub: '',         cr: 250, cg: 204, cb: 21  },
    { x: W * 0.46, label: 'Linear',  sub: '256→256', cr: 244, cg: 114, cb: 182 },
    { x: W * 0.60, label: 'GELU',    sub: '',         cr: 250, cg: 204, cb: 21  },
    { x: W * 0.74, label: 'Linear',  sub: '→ 256',   cr: 244, cg: 114, cb: 182 },
  ];
  const boxW = W * 0.10, boxH = stH * 0.65;

  mlpBoxes.forEach(({ x, label, sub, cr, cg, cb }, li) => {
    const pulse = 0.4 + 0.6 * clamp(Math.sin(tOff * 3 - li * 1.4) * 0.5 + 0.5, 0, 1);
    ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.07 + pulse * 0.1})`;
    ctx.fillRect(x, midY - boxH / 2, boxW, boxH);
    ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.3 + pulse * 0.45})`; ctx.lineWidth = 1.5;
    ctx.strokeRect(x, midY - boxH / 2, boxW, boxH);
    ctx.fillStyle = `rgba(${cr},${cg},${cb},0.9)`; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
    ctx.fillText(label, x + boxW / 2, midY + 4);
    if (sub) { ctx.fillStyle = `rgba(${cr},${cg},${cb},0.5)`; ctx.font = '9px monospace'; ctx.fillText(sub, x + boxW / 2, midY + boxH / 2 - 5); }

    // Arrow to next
    if (li < mlpBoxes.length - 1) {
      ctx.strokeStyle = `rgba(255,255,255,${0.1 + pulse * 0.1})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x + boxW, midY); ctx.lineTo(mlpBoxes[li + 1].x, midY); ctx.stroke();
    }
  });

  // z1 → MLP arrow
  ctx.strokeStyle = 'rgba(34,211,238,0.4)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(z1x + z1W, midY); ctx.lineTo(mlpBoxes[0].x - 4, midY); ctx.stroke();

  // Output fork → s and t
  const lastX = mlpBoxes[4].x + boxW;
  const sY = midY - H * 0.15, tY = midY + H * 0.15;
  const fX  = lastX + W * 0.022;
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(lastX, midY); ctx.lineTo(fX, midY); ctx.lineTo(fX, sY); ctx.lineTo(fX + W * 0.008, sY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(fX, midY);    ctx.lineTo(fX, tY); ctx.lineTo(fX + W * 0.008, tY); ctx.stroke();

  const sbx = fX + W * 0.01;
  [[sY, '#facc15', 250, 204, 21,  's  [128]', 'tanh(·) × 2.0'],
   [tY, '#f472b6', 244, 114, 182, 't  [128]', 'shift']].forEach(([y, col, cr, cg, cb, lbl, sub2]) => {
    ctx.fillStyle = `rgba(${cr},${cg},${cb},0.09)`; ctx.fillRect(sbx, y - 20, W * 0.11, 40);
    ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.5)`; ctx.lineWidth = 1.5; ctx.strokeRect(sbx, y - 20, W * 0.11, 40);
    ctx.fillStyle = col; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
    ctx.fillText(lbl,  sbx + W * 0.055, y + 1);
    ctx.fillStyle = `rgba(${cr},${cg},${cb},0.55)`; ctx.font = '9px monospace';
    ctx.fillText(sub2, sbx + W * 0.055, y + 14);
  });
  ctx.textAlign = 'left';
}

function drawTransform(ctx, W, H, frame) {
  const CELLS = 18;
  const barW  = W * 0.25 / CELLS, maxH = H * 0.42, baseY = H * 0.68;
  const tOff  = frame * 0.018;
  const prog  = clamp((Math.sin(tOff * 0.7) + 1) / 2, 0, 1);

  const z2   = Array.from({ length: CELLS }, (_, i) => 0.2 + 0.8 * sn(i, 11));
  const expS = Array.from({ length: CELLS }, (_, i) => 0.5 + 1.5 * sn(i, 3));
  const tShf = Array.from({ length: CELLS }, (_, i) => (sn(i, 17) - 0.5) * 0.38);

  // z2 original (left)
  const z2x = W * 0.05;
  ctx.fillStyle = 'rgba(251,146,60,0.6)'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
  ctx.fillText('z₂  [original]', z2x + CELLS * barW / 2, baseY - maxH - 16);
  z2.forEach((v, i) => {
    const bh = v * maxH;
    ctx.fillStyle = `rgba(251,146,60,${0.38 + v * 0.52})`; ctx.fillRect(z2x + i * barW, baseY - bh, barW - 1.5, bh);
    ctx.fillStyle = 'rgba(251,146,60,0.9)'; ctx.fillRect(z2x + i * barW, baseY - bh, barW - 1.5, 2);
  });

  // Formula box (centre)
  const fx = W * 0.37, fy = H * 0.35;
  ctx.fillStyle = 'rgba(12,12,20,0.65)'; ctx.fillRect(fx, fy, W * 0.26, H * 0.32);
  ctx.strokeStyle = 'rgba(251,146,60,0.3)'; ctx.lineWidth = 1.5; ctx.strokeRect(fx, fy, W * 0.26, H * 0.32);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fb923c'; ctx.font = 'bold 12px monospace'; ctx.fillText('z2_new =', fx + W * 0.13, fy + 24);
  ctx.fillStyle = 'rgba(250,204,21,0.9)';  ctx.font = '11px monospace'; ctx.fillText('z2 × exp(s)', fx + W * 0.13, fy + 42);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillText('+', fx + W * 0.13, fy + 58);
  ctx.fillStyle = 'rgba(244,114,182,0.9)'; ctx.fillText('t', fx + W * 0.13, fy + 74);
  ctx.fillStyle = 'rgba(52,211,153,0.6)'; ctx.font = '10px monospace';
  ctx.fillText('log_det = Σ s', fx + W * 0.13, fy + 94);

  // log_det bar
  const ldY = H * 0.79, ldW = W * 0.26;
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(fx, ldY, ldW, 10);
  ctx.fillStyle = 'rgba(52,211,153,0.65)';  ctx.fillRect(fx, ldY, ldW * clamp(prog * 0.85 + 0.15, 0, 1), 10);
  ctx.strokeStyle = 'rgba(52,211,153,0.3)'; ctx.lineWidth = 1; ctx.strokeRect(fx, ldY, ldW, 10);

  // z2_new (right)
  const z2nx = W * 0.68;
  ctx.fillStyle = 'rgba(250,204,21,0.6)'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
  ctx.fillText('z₂_new  [transformed]', z2nx + CELLS * barW / 2, baseY - maxH - 16);
  z2.forEach((v, i) => {
    const newV = clamp(lerp(v, v * expS[i] + tShf[i], prog), 0, 1.1);
    const bh   = newV * maxH;
    ctx.fillStyle = `rgba(250,204,21,${0.38 + newV * 0.45})`; ctx.fillRect(z2nx + i * barW, baseY - bh, barW - 1.5, bh);
    ctx.fillStyle = 'rgba(250,204,21,0.9)'; ctx.fillRect(z2nx + i * barW, baseY - bh, barW - 1.5, 2);
  });

  // Arrows
  const arY = H * 0.52;
  [{ from: z2x + CELLS * barW + 6, to: fx - 6 }, { from: fx + W * 0.26 + 6, to: z2nx - 6 }].forEach(({ from, to }) => {
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(from, arY); ctx.lineTo(to, arY); ctx.stroke();
  });
  ctx.textAlign = 'left';
}

function drawFlip(ctx, W, H, frame) {
  const CELLS = 32, HALF = 16;
  const cellW = W * 0.82 / CELLS, cellH = 28;
  const sx = (W - CELLS * cellW) / 2;
  const row1Y = H * 0.22, row2Y = H * 0.57;
  const t = (Math.sin(frame * 0.018) + 1) / 2;

  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '11px monospace'; ctx.textAlign = 'left';
  ctx.fillText('Layer N output  (before flip):', sx, row1Y - 16);
  ctx.fillText('Layer N+1 input  (after torch.flip):', sx, row2Y - 16);

  // Row 1 — original order
  for (let i = 0; i < CELLS; i++) {
    const v = clamp(sn(i, 5) * 0.7 + 0.5, 0, 1);
    ctx.fillStyle = i < HALF ? `rgba(34,211,238,${0.32 + v * 0.58})` : `rgba(251,146,60,${0.32 + v * 0.58})`;
    ctx.fillRect(sx + i * cellW, row1Y, cellW - 1.5, cellH);
    ctx.fillStyle = i < HALF ? 'rgba(34,211,238,0.9)' : 'rgba(251,146,60,0.9)';
    ctx.fillRect(sx + i * cellW, row1Y, cellW - 1.5, 2.5);
  }

  // Bezier arcs showing the reversal
  for (let i = 0; i < 8; i++) {
    const aT    = clamp(t * 8 - i, 0, 1);
    const srcI  = i * 4;
    const dstI  = CELLS - 1 - srcI;
    const srcX  = sx + (srcI + 0.5) * cellW;
    const dstX  = sx + (dstI + 0.5) * cellW;
    if (aT > 0) {
      ctx.globalAlpha = aT * 0.45;
      ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(srcX, row1Y + cellH);
      ctx.bezierCurveTo(srcX, row1Y + cellH + 30, dstX, row2Y - 30, dstX, row2Y);
      ctx.stroke(); ctx.globalAlpha = 1;
    }
  }

  // Row 2 — reversed order
  for (let i = 0; i < CELLS; i++) {
    const flipped = CELLS - 1 - i;
    const v       = clamp(sn(flipped, 5) * 0.7 + 0.5, 0, 1);
    const wasZ1   = flipped < HALF;
    const alpha   = lerp(0, 0.32 + v * 0.58, t);
    ctx.fillStyle = wasZ1 ? `rgba(34,211,238,${alpha})` : `rgba(251,146,60,${alpha})`;
    ctx.fillRect(sx + i * cellW, row2Y, cellW - 1.5, cellH);
    ctx.fillStyle = wasZ1 ? `rgba(34,211,238,${alpha + 0.15})` : `rgba(251,146,60,${alpha + 0.15})`;
    ctx.fillRect(sx + i * cellW, row2Y, cellW - 1.5, 2.5);
  }

  // Divider on row 2
  const divX2 = sx + HALF * cellW;
  ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
  ctx.beginPath(); ctx.moveTo(divX2, row2Y - 4); ctx.lineTo(divX2, row2Y + cellH + 4); ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = '10px monospace'; ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(251,146,60,0.7)';
  ctx.fillText('ex-z₂ → now acts as z₁ (identity)', sx + (HALF * cellW) / 2, row2Y + cellH + 18);
  ctx.fillStyle = 'rgba(34,211,238,0.7)';
  ctx.fillText('ex-z₁ → now becomes z₂ (transforms)', divX2 + (HALF * cellW) / 2, row2Y + cellH + 18);
  ctx.textAlign = 'left';
}

function drawStack(ctx, W, H, frame) {
  const N = 8, lW = W * 0.072, lH = H * 0.26;
  const spacing = (W * 0.86) / N, sx = W * 0.07, baseY = H * 0.68;
  const BINS = 16, miniH = H * 0.21, miniY = H * 0.30;
  const tOff = frame * 0.012;

  for (let li = 0; li < N; li++) {
    const lx  = sx + li * spacing;
    const lT  = li / (N - 1);
    const pulse = 0.5 + 0.5 * Math.sin(tOff * 2 - li * 0.55);

    // Layer block
    ctx.fillStyle = `rgba(74,222,128,${0.07 + pulse * 0.07})`; ctx.fillRect(lx, baseY - lH, lW, lH);
    ctx.strokeStyle = `rgba(74,222,128,${0.28 + pulse * 0.4})`; ctx.lineWidth = 1.5; ctx.strokeRect(lx, baseY - lH, lW, lH);
    ctx.fillStyle = `rgba(74,222,128,0.65)`; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
    ctx.fillText(`L${li + 1}`, lx + lW / 2, baseY + 14);

    // Mini histogram (lerps from audio → gauss)
    const bW2 = lW / BINS;
    for (let bi = 0; bi < BINS; bi++) {
      const x   = (bi / (BINS - 1)) * 6 - 3;
      const ad  = 0.45 * Math.exp(-0.5 * ((x - 1.2) / 0.65) ** 2) + 0.32 * Math.exp(-0.5 * ((x + 0.9) / 0.7) ** 2);
      const gd  = Math.exp(-0.5 * x * x);
      const v   = lerp(ad, gd, lT);
      const bH2 = (v / 1.0) * miniH;
      const pr  = Math.round(lerp(139, 74,  lT));
      const pg  = Math.round(lerp(92,  222, lT));
      const pb  = Math.round(lerp(246, 128, lT));
      ctx.fillStyle = `rgba(${pr},${pg},${pb},${0.38 + (v / 1.0) * 0.5})`;
      ctx.fillRect(lx + bi * bW2, miniY + miniH - bH2, bW2 - 0.5, bH2);
    }

    // Connecting arrow
    if (li < N - 1) {
      const nx = sx + (li + 1) * spacing;
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(lx + lW, miniY + miniH / 2); ctx.lineTo(nx, miniY + miniH / 2); ctx.stroke();
    }
  }

  ctx.fillStyle = 'rgba(139,92,246,0.65)'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'left';
  ctx.fillText('z  (audio dist)', sx, miniY - 10);
  ctx.fillStyle = 'rgba(74,222,128,0.65)'; ctx.textAlign = 'right';
  ctx.fillText('u ~ N(0, I)', W - W * 0.07, miniY - 10);
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(sx, baseY + 26); ctx.lineTo(W - W * 0.07, baseY + 26); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath(); ctx.moveTo(W - W * 0.07, baseY + 22); ctx.lineTo(W - W * 0.07 + 7, baseY + 26); ctx.lineTo(W - W * 0.07, baseY + 30); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
  ctx.fillText('TRAINING DIRECTION: z → u', W / 2, baseY + 40);
  ctx.textAlign = 'left';
}

function drawSample(ctx, W, H, frame) {
  const N = 8, lW = W * 0.072, lH = H * 0.26;
  const spacing = (W * 0.86) / N, sx = W * 0.07, baseY = H * 0.68;
  const BINS = 16, miniH = H * 0.21, miniY = H * 0.30;
  const tOff = frame * 0.012;

  for (let li = 0; li < N; li++) {
    const lx    = sx + li * spacing;
    const lT    = 1 - li / (N - 1); // REVERSED
    const pulse = 0.5 + 0.5 * Math.sin(tOff * 2 + li * 0.55);

    ctx.fillStyle = `rgba(250,204,21,${0.06 + pulse * 0.07})`; ctx.fillRect(lx, baseY - lH, lW, lH);
    ctx.strokeStyle = `rgba(250,204,21,${0.25 + pulse * 0.38})`; ctx.lineWidth = 1.5; ctx.strokeRect(lx, baseY - lH, lW, lH);
    ctx.fillStyle = `rgba(250,204,21,0.6)`; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
    ctx.fillText(`L${N - li}⁻¹`, lx + lW / 2, baseY + 14);

    const bW2 = lW / BINS;
    for (let bi = 0; bi < BINS; bi++) {
      const x   = (bi / (BINS - 1)) * 6 - 3;
      const gd  = Math.exp(-0.5 * x * x);
      const ad  = 0.45 * Math.exp(-0.5 * ((x - 1.2) / 0.65) ** 2) + 0.32 * Math.exp(-0.5 * ((x + 0.9) / 0.7) ** 2);
      const v   = lerp(ad, gd, lT);
      const bH2 = (v / 1.0) * miniH;
      const pr  = Math.round(lerp(139, 250, 1 - lT));
      const pg  = Math.round(lerp(92,  204, 1 - lT));
      const pb  = Math.round(lerp(246, 21,  1 - lT));
      ctx.fillStyle = `rgba(${pr},${pg},${pb},${0.38 + (v / 1.0) * 0.5})`;
      ctx.fillRect(lx + bi * bW2, miniY + miniH - bH2, bW2 - 0.5, bH2);
    }

    if (li < N - 1) {
      ctx.strokeStyle = 'rgba(250,204,21,0.12)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(lx + lW, miniY + miniH / 2); ctx.lineTo(sx + (li + 1) * spacing, miniY + miniH / 2); ctx.stroke();
    }
  }

  ctx.fillStyle = 'rgba(74,222,128,0.65)'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'left';
  ctx.fillText('u ~ N(0, I)  ← sample random noise', sx, miniY - 10);
  ctx.fillStyle = 'rgba(250,204,21,0.7)'; ctx.textAlign = 'right';
  ctx.fillText('z → vae.decoder() → new audio ✨', W - W * 0.07, miniY - 10);
  ctx.strokeStyle = 'rgba(250,204,21,0.22)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W - W * 0.07, baseY + 26); ctx.lineTo(sx, baseY + 26); ctx.stroke();
  ctx.fillStyle = 'rgba(250,204,21,0.22)';
  ctx.beginPath(); ctx.moveTo(sx, baseY + 22); ctx.lineTo(sx - 7, baseY + 26); ctx.lineTo(sx, baseY + 30); ctx.fill();
  ctx.fillStyle = 'rgba(250,204,21,0.38)'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
  ctx.fillText('INFERENCE DIRECTION: u → z  (all layers reversed)', W / 2, baseY + 40);
  ctx.textAlign = 'left';
}

// ── main dispatch ─────────────────────────────────────────────────────────────
function renderFrame(ctx, W, H, vizMode, frame) {
  ctx.clearRect(0, 0, W, H);
  switch (vizMode) {
    case 'hist_audio':  drawHistogram(ctx, W, H, audioDist, [139, 92, 246], 'Audio Latent Distribution  —  z ~ p(z)  (complex, non-Gaussian)', gaussDist, frame); break;
    case 'split':       drawSplit(ctx, W, H, frame);      break;
    case 'mlp':         drawMLP(ctx, W, H, frame);        break;
    case 'transform':   drawTransform(ctx, W, H, frame);  break;
    case 'flip':        drawFlip(ctx, W, H, frame);       break;
    case 'stack':       drawStack(ctx, W, H, frame);      break;
    case 'hist_gauss':  drawHistogram(ctx, W, H, gaussDist, [74, 222, 128], 'After Flow — u ~ N(0, I)  (standard bell curve achieved!)', null, frame); break;
    case 'sample':      drawSample(ctx, W, H, frame);     break;
  }
}

// ── component ─────────────────────────────────────────────────────────────────
export default function NormalizingFlowVisualizer() {
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const progRef   = useRef(0);
  const frameRef  = useRef(0);

  useEffect(() => { progRef.current = progress; }, [progress]);

  const stageIdx = Math.min(STAGES.length - 1, Math.round(progress / STEP));
  const stage    = STAGES[stageIdx];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const animate = () => {
      frameRef.current++;
      const W   = canvas.clientWidth;
      const H   = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== Math.floor(W * dpr) || canvas.height !== Math.floor(H * dpr)) {
        canvas.width  = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
        ctx.scale(dpr, dpr);
      }
      const si = Math.min(STAGES.length - 1, Math.round(progRef.current / STEP));
      renderFrame(ctx, W, H, STAGES[si].vizMode, frameRef.current);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Slider gradient
  const sliderBg = `linear-gradient(to right,
    #8b5cf6 ${clamp(progress,  0, 14.3)}%,
    #22d3ee ${clamp(progress, 14.3, 28.6)}%,
    #f472b6 ${clamp(progress, 28.6, 42.9)}%,
    #fb923c ${clamp(progress, 42.9, 57.1)}%,
    #34d399 ${clamp(progress, 57.1, 71.4)}%,
    #4ade80 ${clamp(progress, 71.4, 85.7)}%,
    #4ade80 ${clamp(progress, 85.7, 100)}%,
    #facc15 ${clamp(progress, 100, 100)}%,
    #1f2937 ${progress}%)`;

  const Icon = stage.icon;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans p-4 md:p-8">

      {/* Header */}
      <div className="max-w-5xl mx-auto w-full mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-green-500/10 rounded-xl">
            <Layers className="w-5 h-5 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-yellow-400 text-transparent bg-clip-text">
            Normalizing Flow — flow_model.py
          </h1>
        </div>
        <p className="text-gray-500 text-sm ml-12 font-mono">
          AffineCouplingLayer · AudioLatentFlow · {STAGES.length} stages  |  z → u ~ N(0,I)  |  inverse: u → z → audio
        </p>
      </div>

      {/* Canvas */}
      <div className="max-w-5xl mx-auto w-full mb-5">
        <div className="w-full h-64 md:h-80 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden relative">
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Stage badge */}
          <div className="absolute top-4 left-4 bg-gray-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-700/50 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
            <span className="font-semibold text-xs tracking-wide">{stage.title}</span>
          </div>

          {/* Class badge */}
          <div className="absolute top-4 right-4 bg-gray-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-700/50">
            <code className="text-xs font-mono" style={{ color: stage.color }}>{stage.cls}</code>
          </div>
        </div>
      </div>

      {/* Pill navigation */}
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
              {i < STAGES.length - 1 && <ChevronRight className="w-2.5 h-2.5 text-gray-800 flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Slider */}
      <div className="max-w-5xl mx-auto w-full mb-6">
        <div className="relative pt-5">
          <div className="absolute w-full flex justify-between top-0 text-[10px] font-medium select-none pointer-events-none">
            <span className="text-violet-500">z input</span>
            <span className="text-cyan-600">Coupling Layer →</span>
            <span className="text-emerald-600">Flip</span>
            <span className="text-green-500">Stack + N(0,I)</span>
            <span className="text-yellow-500">Inference</span>
          </div>
          <input
            type="range" min="0" max="100" value={progress}
            onChange={e => setProgress(Number(e.target.value))}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            style={{ background: sliderBg }}
          />
        </div>
      </div>

      {/* Info panels */}
      <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-4 pb-8">

        {/* Code panel */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-gray-800 flex items-center gap-2 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="text-xs text-gray-600 font-mono ml-2">src/models/flow_model.py</span>
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
            <Icon className={`w-5 h-5 ${stage.ic}`} />
            <code className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ color: stage.color, backgroundColor: `${stage.color}18` }}>
              {stage.cls}
            </code>
          </div>
          <h3 className="text-lg font-semibold mb-3">{stage.title}</h3>
          <p className="text-gray-300 leading-relaxed text-sm">{stage.desc}</p>
        </div>

      </div>
    </div>
  );
}
