import React, { useState, useMemo } from 'react';
import { 
  Info, 
  AlertTriangle, 
  ChevronRight, 
  BrainCircuit, 
  Network, 
  Unlink, 
  Calculator,
  Eye
} from 'lucide-react';

export const meta = {
  title: 'Limitations of Mean-Field Approx',
  subtitle: 'Demystifying the math: Why assuming independence limits VAEs.'
};

// --- Mathematical Helper Functions ---
const calculateEllipses = (sigma1, sigma2, rho) => {
  const var1 = sigma1 * sigma1;
  const var2 = sigma2 * sigma2;
  const covar = rho * sigma1 * sigma2;
  const trace = var1 + var2;
  const det = (var1 * var2) - (covar * covar);
  
  const term = Math.sqrt(Math.max(0, (trace * trace) / 4 - det));
  const lambda1 = (trace / 2) + term;
  const lambda2 = (trace / 2) - term;

  const scale = 2.5; 
  const r1 = Math.sqrt(lambda1) * scale;
  const r2 = Math.sqrt(Math.max(0, lambda2)) * scale;

  let angle = 0;
  if (covar !== 0) {
    angle = Math.atan2(lambda1 - var1, covar) * (180 / Math.PI);
  } else if (var1 < var2) {
      angle = 90;
  }

  const mf_var1 = var1 * (1 - rho * rho);
  const mf_var2 = var2 * (1 - rho * rho);
  
  const mf_r1 = Math.sqrt(Math.max(0, mf_var1)) * scale;
  const mf_r2 = Math.sqrt(Math.max(0, mf_var2)) * scale;

  return {
    trueEllipse: { rx: r1, ry: r2, angle: angle },
    mfEllipse: { rx: mf_r1, ry: mf_r2, angle: 0 } 
  };
};

const GaussianPlot = ({ correlation, sigma1, sigma2 }) => {
  const { trueEllipse, mfEllipse } = useMemo(
    () => calculateEllipses(sigma1, sigma2, correlation), 
    [sigma1, sigma2, correlation]
  );
  
  const gridSize = 40;
  const viewSize = 400;
  const center = viewSize / 2;

  return (
    <div className="relative w-full aspect-square bg-slate-50 rounded-xl shadow-inner border border-slate-200 overflow-hidden">
      <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg text-xs shadow-sm border border-slate-200 z-10 space-y-2 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500/30 border border-blue-500 rounded-sm"></div>
          <span className="font-semibold text-slate-700">True Posterior <span className="font-mono text-[10px]">p(z|x)</span></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500/20 border-2 border-dashed border-red-500 rounded-sm"></div>
          <span className="font-semibold text-slate-700">Mean-Field Approx <span className="font-mono text-[10px]">q(z|x)</span></span>
        </div>
      </div>

      <svg viewBox={`0 0 ${viewSize} ${viewSize}`} className="w-full h-full">
        <g stroke="#e2e8f0" strokeWidth="1">
          {Array.from({ length: 11 }).map((_, i) => (
            <React.Fragment key={i}>
              <line x1={0} y1={i * gridSize} x2={viewSize} y2={i * gridSize} />
              <line x1={i * gridSize} y1={0} x2={i * gridSize} y2={viewSize} />
            </React.Fragment>
          ))}
        </g>
        
        <line x1={0} y1={center} x2={viewSize} y2={center} stroke="#94a3b8" strokeWidth="2" />
        <line x1={center} y1={0} x2={center} y2={viewSize} stroke="#94a3b8" strokeWidth="2" />
        
        <text x={viewSize - 20} y={center - 10} fill="#64748b" fontSize="14" fontWeight="bold">z₁</text>
        <text x={center + 10} y={20} fill="#64748b" fontSize="14" fontWeight="bold">z₂</text>

        <g transform={`translate(${center}, ${center})`}>
          <ellipse
            rx={trueEllipse.rx * gridSize}
            ry={trueEllipse.ry * gridSize}
            transform={`rotate(${-trueEllipse.angle})`}
            className="fill-blue-500/20 stroke-blue-500 transition-all duration-300 ease-out"
            strokeWidth="2"
          />
          <ellipse
            rx={mfEllipse.rx * gridSize}
            ry={mfEllipse.ry * gridSize}
            className="fill-red-500/20 stroke-red-500 transition-all duration-300 ease-out"
            strokeWidth="3"
            strokeDasharray="8 4"
          />
          <circle cx="0" cy="0" r="4" fill="#334155" />
        </g>
      </svg>
    </div>
  );
};

export default function MeanFieldLimitations() {
  const [correlation, setCorrelation] = useState(0.85);
  const [sigma1, setSigma1] = useState(1.2);
  const [sigma2, setSigma2] = useState(1.0);

  const isHighlyCorrelated = correlation > 0.6;

  return (
    <div className="p-6 md:p-8 w-full max-w-5xl mx-auto space-y-12 text-slate-800 pb-20">
      
      {/* Header Section */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Unpacking the Mean-Field Assumption
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Before we visualize the limitations, let's intuitively understand the two biggest mysteries: 
          <strong> What is the True Posterior?</strong> and <strong>How does an Encoder "Factorize"?</strong>
        </p>
      </div>

      {/* Concept 1: True Posterior */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center gap-3">
          <BrainCircuit className="text-blue-600" />
          <h2 className="text-xl font-bold text-blue-900">1. The "True Posterior" <span className="font-mono text-base bg-blue-200/50 px-2 py-0.5 rounded ml-2">p(z|x)</span></h2>
        </div>
        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-slate-600">
            <p>
              Imagine you are looking at a 2D image of a face (<span className="font-mono text-sm bg-slate-100 px-1 rounded">x</span>). 
              The <strong>True Posterior</strong> is the exact mathematical probability of the underlying 3D factors (<span className="font-mono text-sm bg-slate-100 px-1 rounded">z</span>) that created it, like <strong>Lighting (z₁)</strong> and <strong>Face Angle (z₂)</strong>.
            </p>
            <p>
              <strong>Why is it complex?</strong> In reality, these factors are tangled. If a face is brightly lit on one side, it's highly likely the face is turned toward the light source. Knowing one gives you information about the other. They are <strong>correlated</strong>.
            </p>
            <p>
              <strong>Why don't we just calculate it?</strong> Because of Bayes' Theorem:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center font-mono text-sm shadow-inner">
               p(z|x) = <span className="border-b border-slate-400 pb-1">p(x|z) * p(z)</span> <br/>
               <span className="pt-1 inline-block text-red-500 font-bold">∫ p(x|z) * p(z) dz</span> 
               <div className="text-xs font-sans text-red-500 mt-2">^ The Intractable Integral ^</div>
            </div>
            <p className="text-sm">
              To calculate the bottom part (the evidence), we would have to integrate over <em>every possible combination</em> of lighting and face angles in the universe. It's mathematically impossible to compute exactly.
            </p>
          </div>
          
          {/* Visual Diagram of True Posterior */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col items-center justify-center space-y-4">
             <Network className="w-12 h-12 text-blue-500" />
             <h3 className="font-bold text-slate-800 text-center">True Covariance Matrix</h3>
             <p className="text-xs text-slate-500 text-center mb-2">Notice the diagonal AND off-diagonal numbers.</p>
             
             {/* Matrix representation */}
             <div className="flex items-center text-slate-700 font-mono">
               <span className="text-4xl font-light text-slate-400 mr-2">[</span>
               <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-center">
                 <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Variance z₁</div>
                 <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded relative group">
                    Covariance
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] w-48 p-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      How z1 and z2 interact!
                    </div>
                 </div>
                 <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Covariance</div>
                 <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Variance z₂</div>
               </div>
               <span className="text-4xl font-light text-slate-400 ml-2">]</span>
             </div>
             <p className="text-xs text-center text-slate-500 mt-2">
               The true posterior allows variables to influence each other.
             </p>
          </div>
        </div>
      </div>

      {/* Concept 2: Factorized Approximation */}
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-3">
          <Unlink className="text-red-500" />
          <h2 className="text-xl font-bold text-red-900">2. The Encoder's Shortcut: "Factorization" <span className="font-mono text-base bg-red-200/50 px-2 py-0.5 rounded ml-2">q(z|x)</span></h2>
        </div>
        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
          
          {/* Visual Diagram of Mean-Field Matrix */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col items-center justify-center space-y-4 order-2 md:order-1">
             <Eye className="w-12 h-12 text-red-400" />
             <h3 className="font-bold text-slate-800 text-center">Mean-Field Covariance Matrix</h3>
             <p className="text-xs text-slate-500 text-center mb-2">The Neural Network's limited output.</p>
             
             {/* Matrix representation */}
             <div className="flex items-center text-slate-700 font-mono">
               <span className="text-4xl font-light text-slate-400 mr-2">[</span>
               <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-center">
                 <div className="bg-red-100 text-red-800 px-3 py-1 rounded">Variance z₁</div>
                 <div className="bg-slate-200 text-slate-400 px-3 py-1 rounded font-bold text-lg">0</div>
                 <div className="bg-slate-200 text-slate-400 px-3 py-1 rounded font-bold text-lg">0</div>
                 <div className="bg-red-100 text-red-800 px-3 py-1 rounded">Variance z₂</div>
               </div>
               <span className="text-4xl font-light text-slate-400 ml-2">]</span>
             </div>
             <p className="text-xs text-center text-slate-500 mt-2">
               Forced to assume zero interaction (Diagonal Matrix).
             </p>
          </div>

          <div className="space-y-4 text-slate-600 order-1 md:order-2">
            <p>
              Because the True Posterior is impossible to compute, we use a Neural Network (Encoder) to <em>guess</em> it. This guess is <span className="font-mono text-sm bg-slate-100 px-1 rounded">q(z|x)</span>.
            </p>
            <p>
              <strong>How does it Factorize?</strong> To make the math and neural network architecture simple, we design the Encoder to output only two vectors: a vector of <strong>Means</strong> <span className="font-mono text-sm">(μ₁, μ₂)</span> and a vector of <strong>Variances</strong> <span className="font-mono text-sm">(σ₁², σ₂²)</span>. 
            </p>
            <p className="bg-red-50 p-3 rounded-lg text-red-800 text-sm border border-red-100">
              <strong>The Catch:</strong> By design, the Encoder <em>does not output covariances</em>. It forces the off-diagonal elements of the matrix to be exactly zero.
            </p>
            <p>
              Mathematically, if covariances are zero, the variables are assumed independent. The giant joint probability equation breaks down into a simple multiplication problem: <br/>
              <span className="font-mono text-sm font-semibold bg-slate-100 px-1 mt-2 inline-block rounded">q(z|x) = q(z₁|x) * q(z₂|x)</span>
            </p>
          </div>
        </div>
      </div>

      {/* --- The Interactive Visualization --- */}
      <div className="relative pt-8 border-t border-slate-200">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-slate-400">
          <Calculator className="w-6 h-6" />
        </div>
        
        <div className="space-y-4 text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">See the Discrepancy in Action</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Use the sliders below to change the true underlying correlation. Watch how the Mean-Field approximation (red) struggles to cover the True Posterior (blue) because it is strictly forbidden from tilting (covariances = 0).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Visualization & Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
               <GaussianPlot correlation={correlation} sigma1={sigma1} sigma2={sigma2} />
               
               {/* Dynamic Warning Message */}
               <div className={`mt-4 p-4 rounded-xl border transition-colors duration-300 flex items-start gap-3 ${isHighlyCorrelated ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                  {isHighlyCorrelated ? <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} /> : <Info className="text-slate-500 shrink-0 mt-0.5" size={20} />}
                  <p className={`text-sm ${isHighlyCorrelated ? 'text-red-800' : 'text-slate-700'}`}>
                    {isHighlyCorrelated 
                      ? "High correlation detected! Notice how the red mean-field ellipse shrinks dramatically to fit inside the true distribution. It cannot tilt, so it underestimates variance to avoid empty space."
                      : "Low correlation. The variables are nearly independent, so the axis-aligned mean-field approximation fits the true posterior reasonably well."}
                  </p>
               </div>
            </div>

            {/* Sliders */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h3 className="font-bold text-slate-800 border-b pb-2">Adjust True Latent Parameters</h3>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-sm text-slate-700">
                    True Correlation (Covariance)
                  </label>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-mono font-bold">
                    {correlation.toFixed(2)}
                  </span>
                </div>
                <input 
                  type="range" min="0" max="0.99" step="0.01" 
                  value={correlation} 
                  onChange={(e) => setCorrelation(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="font-semibold text-sm text-slate-700 block mb-2">Variance z₁ (σ₁)</label>
                  <input 
                    type="range" min="0.5" max="2.0" step="0.1" 
                    value={sigma1} 
                    onChange={(e) => setSigma1(parseFloat(e.target.value))}
                    className="w-full accent-slate-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-sm text-slate-700 block mb-2">Variance z₂ (σ₂)</label>
                  <input 
                    type="range" min="0.5" max="2.0" step="0.1" 
                    value={sigma2} 
                    onChange={(e) => setSigma2(parseFloat(e.target.value))}
                    className="w-full accent-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Consequences List */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 mb-4 px-2">
              The 5 Consequences of this Shortcut
            </h3>
            
            {/* Point 1 */}
            <div className="flex gap-4 p-4 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</div>
              <div>
                <h4 className="text-base font-bold text-slate-800 mb-1">Poor Fit to True Posterior</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  As seen in the plot when correlation is high, an axis-aligned box (red) is fundamentally incapable of matching a diagonal cloud (blue). The ELBO becomes a loose bound on the log-likelihood.
                </p>
              </div>
            </div>

            {/* Point 2 */}
            <div className="flex gap-4 p-4 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</div>
              <div>
                <h4 className="text-base font-bold text-slate-800 mb-1">Underestimation of Variances</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The KL divergence mathematical penalty strictly punishes the model for placing red probability mass where there is no blue probability mass. To avoid the empty corners, the red ellipse violently shrinks inward, creating an "overconfident" model.
                </p>
              </div>
            </div>

            {/* Point 3 */}
            <div className="flex gap-4 p-4 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</div>
              <div>
                <h4 className="text-base font-bold text-slate-800 mb-1">Impact on Representation Quality</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  If the real world requires two factors to be correlated, forcing the model to represent them independently causes the model to struggle to disentangle what features actually mean.
                </p>
              </div>
            </div>

            {/* Point 4 */}
            <div className="flex gap-4 p-4 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">4</div>
              <div>
                <h4 className="text-base font-bold text-slate-800 mb-1">Suboptimal Generative Performance</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The Decoder relies on the Encoder's (flawed) guess to learn. Because the Encoder feeds it an overly-simplified, shrunken version of reality, the Decoder struggles to generate high-fidelity, nuanced images.
                </p>
              </div>
            </div>

            {/* Point 5 */}
            <div className="flex gap-4 p-4 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">5</div>
              <div>
                <h4 className="text-base font-bold text-slate-800 mb-1">Posterior Collapse</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Sometimes, faced with a complex True Posterior it simply cannot match, the optimization gives up. It minimizes the loss by ignoring the input entirely, setting <span className="font-mono text-xs">q(z|x) ≈ p(z)</span> (the boring prior).
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}