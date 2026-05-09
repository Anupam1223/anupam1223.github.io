import React, { useState, useEffect } from 'react';
import { 
  Activity, ChevronLeft, ChevronRight, Code, Terminal, 
  TrendingDown, TrendingUp, AlertTriangle, Search, LineChart, 
  Layers, Scissors, ShieldAlert, Zap, Network, ArrowRight,
  Folder, BarChart, Image as ImageIcon, Layout, FileCode2, Database
} from 'lucide-react';

export default function InspectGradientsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'problem', title: 'The Gradient Problem', component: ProblemSlide },
    { id: 'norm', title: 'Monitoring Total Norm', component: ChartSlide },
    { id: 'layer', title: 'Layer-Level Inspection', component: LayerInspectionSlide },
    { id: 'mitigation', title: 'Symptoms & Mitigation', component: MitigationSlide },
    { id: 'tb_setup', title: 'TensorBoard Setup', component: TensorBoardSetupSlide },
    { id: 'tb_log', title: 'Visualizing Training', component: TensorBoardLogSlide },
    { id: 'tb_adv', title: 'Advanced Logging', component: TensorBoardAdvSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Search size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Model Inspection & TensorBoard</h2>
        <p className="text-slate-400 text-sm mb-4">Diagnosing gradients and tracking metrics visually</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[20px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide 
                  ? (idx >= 4 ? 'bg-orange-500' : 'bg-teal-500') 
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          <span className={`${currentSlide >= 4 ? 'text-orange-400' : 'text-teal-400'} font-bold whitespace-nowrap`}>
            Slide {currentSlide + 1} of {slides.length}: {slides[currentSlide].title}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[550px] flex flex-col">
        <div className="flex-1">
          <CurrentComponent />
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
          <button 
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))} 
            disabled={currentSlide === 0} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 font-semibold transition-colors"
          >
            <ChevronLeft size={20} /> Previous
          </button>
          <button 
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))} 
            disabled={currentSlide === slides.length - 1} 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white disabled:opacity-50 font-semibold transition-colors ${currentSlide >= 3 ? 'bg-orange-600 hover:bg-orange-700' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: The Gradient Problem (Visualizing the Chain Rule multiplication) ---
function ProblemSlide() {
  const [scenario, setScenario] = useState('stable'); // stable, vanishing, exploding

  const multipliers = {
    'stable': [1.0, 1.0, 1.0, 1.0],
    'vanishing': [0.5, 0.5, 0.5, 0.5],
    'exploding': [2.0, 2.0, 2.0, 2.0]
  };

  const getGradientAtLayer = (layerIdx) => {
    let grad = 1.0; // Start at loss
    for (let i = 3; i >= layerIdx; i--) {
      grad *= multipliers[scenario][i];
    }
    return grad;
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <h3 className="text-xl font-bold mb-4">Understanding Gradient Problems</h3>
      <p className="text-slate-600 mb-6 leading-relaxed text-sm">
        During backpropagation, gradients are calculated layer-by-layer using the chain rule. In deep networks, this means <strong>multiplying many derivatives together</strong>. If those numbers are slightly smaller than 1, they vanish to zero. If they are slightly larger than 1, they explode to infinity.
      </p>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setScenario('vanishing')}
          className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${scenario === 'vanishing' ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-amber-300'}`}
        >
          <TrendingDown className={scenario === 'vanishing' ? "text-amber-500" : "text-slate-400"} size={20} />
          <span className="font-bold text-sm">Vanishing Gradients</span>
          <span className="text-[10px] uppercase text-center">Derivatives &lt; 1</span>
        </button>

        <button 
          onClick={() => setScenario('stable')}
          className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${scenario === 'stable' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-300'}`}
        >
          <Activity className={scenario === 'stable' ? "text-emerald-500" : "text-slate-400"} size={20} />
          <span className="font-bold text-sm">Stable Training</span>
          <span className="text-[10px] uppercase text-center">Derivatives ≈ 1</span>
        </button>

        <button 
          onClick={() => setScenario('exploding')}
          className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${scenario === 'exploding' ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-rose-300'}`}
        >
          <TrendingUp className={scenario === 'exploding' ? "text-rose-500" : "text-slate-400"} size={20} />
          <span className="font-bold text-sm">Exploding Gradients</span>
          <span className="text-[10px] uppercase text-center">Derivatives &gt; 1</span>
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-inner flex flex-col items-center justify-center flex-1 relative overflow-x-auto min-h-[300px]">
         <h4 className="absolute top-4 left-6 text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Chain Rule Simulation</h4>

         <div className="flex items-center gap-4 w-full justify-between min-w-max px-4 pt-8">
            
            {/* Input / Layer 0 */}
            <div className="flex flex-col items-center relative">
               <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">Input Layer</span>
               <div className="w-16 h-16 rounded-full border-4 border-blue-400 bg-blue-100 flex items-center justify-center shadow-sm"></div>
               <div className="absolute -bottom-16 flex flex-col items-center animate-in zoom-in">
                 <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Final Gradient</span>
                 <span className={`font-mono text-sm font-black px-2 py-1 rounded border shadow-sm
                   ${scenario === 'vanishing' ? 'bg-amber-100 text-amber-700 border-amber-300' : 
                     scenario === 'exploding' ? 'bg-rose-100 text-rose-700 border-rose-300' : 
                     'bg-emerald-100 text-emerald-700 border-emerald-300'}`}>
                   {getGradientAtLayer(0).toFixed(4)}
                 </span>
               </div>
            </div>

            <div className="flex-1 border-t-2 border-dashed border-slate-300 relative">
               <ArrowLeftArrow val={multipliers[scenario][0]} scenario={scenario} />
            </div>

            {/* Layer 1 */}
            <div className="flex flex-col items-center relative">
               <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">Layer 1</span>
               <div className="w-16 h-16 rounded-full border-4 border-indigo-400 bg-indigo-100 flex items-center justify-center shadow-sm"></div>
               <div className="absolute -bottom-10 flex flex-col items-center">
                 <span className="font-mono text-xs font-bold text-slate-600 bg-white px-1 border rounded">{getGradientAtLayer(1).toFixed(3)}</span>
               </div>
            </div>

            <div className="flex-1 border-t-2 border-dashed border-slate-300 relative">
               <ArrowLeftArrow val={multipliers[scenario][1]} scenario={scenario} />
            </div>

            {/* Layer 2 */}
            <div className="flex flex-col items-center relative">
               <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">Layer 2</span>
               <div className="w-16 h-16 rounded-full border-4 border-indigo-400 bg-indigo-100 flex items-center justify-center shadow-sm"></div>
               <div className="absolute -bottom-10 flex flex-col items-center">
                 <span className="font-mono text-xs font-bold text-slate-600 bg-white px-1 border rounded">{getGradientAtLayer(2).toFixed(3)}</span>
               </div>
            </div>

            <div className="flex-1 border-t-2 border-dashed border-slate-300 relative">
               <ArrowLeftArrow val={multipliers[scenario][2]} scenario={scenario} />
            </div>

            {/* Layer 3 */}
            <div className="flex flex-col items-center relative">
               <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">Layer 3</span>
               <div className="w-16 h-16 rounded-full border-4 border-indigo-400 bg-indigo-100 flex items-center justify-center shadow-sm"></div>
               <div className="absolute -bottom-10 flex flex-col items-center">
                 <span className="font-mono text-xs font-bold text-slate-600 bg-white px-1 border rounded">{getGradientAtLayer(3).toFixed(3)}</span>
               </div>
            </div>

            <div className="flex-1 border-t-2 border-dashed border-slate-300 relative">
               <ArrowLeftArrow val={multipliers[scenario][3]} scenario={scenario} />
            </div>

            {/* Loss */}
            <div className="flex flex-col items-center relative">
               <span className="text-[10px] font-bold text-rose-500 uppercase mb-2">Loss Output</span>
               <div className="w-16 h-16 rounded-lg border-4 border-rose-400 bg-rose-100 flex items-center justify-center shadow-md font-bold text-rose-700">L</div>
               <div className="absolute -bottom-10 flex flex-col items-center">
                 <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-1 border border-rose-200 rounded">1.000</span>
               </div>
            </div>

         </div>

         <div className="mt-20 w-full max-w-2xl text-center">
           {scenario === 'vanishing' && <p className="text-sm text-amber-800 bg-amber-100 border border-amber-300 px-4 py-3 rounded-lg animate-in slide-in-from-bottom-2">The initial layers receive a gradient of nearly zero (<strong>{getGradientAtLayer(0).toFixed(4)}</strong>). Their weights will update so slowly that they effectively <strong>stop learning</strong>. Often caused by deep layers of Sigmoid/Tanh.</p>}
           {scenario === 'exploding' && <p className="text-sm text-rose-800 bg-rose-100 border border-rose-300 px-4 py-3 rounded-lg animate-in slide-in-from-bottom-2">The initial layers receive a massive gradient (<strong>{getGradientAtLayer(0).toFixed(1)}</strong>). The optimizer will take a huge, unstable step, causing the loss to oscillate wildly or hit <strong>NaN</strong>.</p>}
           {scenario === 'stable' && <p className="text-sm text-emerald-800 bg-emerald-100 border border-emerald-300 px-4 py-3 rounded-lg animate-in slide-in-from-bottom-2">The gradient maintains a healthy magnitude as it flows backwards. All layers update at a steady, productive pace.</p>}
         </div>
      </div>
    </div>
  );
}

// Helper for the backward arrow in Slide 1
function ArrowLeftArrow({ val, scenario }) {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
      <div className="flex items-center w-full justify-center">
        <ArrowRight size={16} className={`rotate-180 ${scenario === 'stable' ? 'text-emerald-500' : scenario === 'vanishing' ? 'text-amber-500' : 'text-rose-500'}`}/>
        <div className={`h-0.5 w-1/2 ${scenario === 'stable' ? 'bg-emerald-500' : scenario === 'vanishing' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
      </div>
      <span className={`text-[10px] font-mono font-bold mt-1 px-1 bg-white border rounded ${scenario === 'stable' ? 'text-emerald-700 border-emerald-200' : scenario === 'vanishing' ? 'text-amber-700 border-amber-200' : 'text-rose-700 border-rose-200'}`}>
        × {val}
      </span>
    </div>
  );
}

// --- Slide 2: Monitoring Total Norm ---
function ChartSlide() {
  const pyCode = `# Inside your training loop, after loss.backward()

total_norm = 0
for p in model.parameters():
    if p.grad is not None:
        # 1. Calculate L2 norm for this parameter's gradients
        param_norm = p.grad.detach().data.norm(2) 
        
        # 2. Sum of squares
        total_norm += param_norm.item() ** 2      

# 3. Square root of sum of squares
total_norm = total_norm ** 0.5                   

print(f"Total Gradient Norm: {total_norm:.4f}")
# You would typically log this value using TensorBoard/WandB`;

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Monitoring Overall Gradient Norm</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          A common practice is to monitor the overall magnitude of the gradients across <strong>all trainable parameters</strong>. The <strong>L2 norm</strong> (Euclidean norm) reduces all millions of gradients into a single, trackable number.
        </p>

        {/* Chart Recreation */}
        <div className="bg-[#202020] border border-slate-700 rounded-xl p-8 flex-1 relative flex flex-col items-center shadow-lg">
           
           {/* White Canvas for Chart */}
           <div className="bg-white w-full h-[320px] p-6 relative shadow flex flex-col">
              <h4 className="text-[#333] text-lg font-sans text-center mb-6">Total Gradient Norm During Training</h4>
              
              <div className="flex-1 relative flex">
                 
                 {/* Y Axis Labels (Logarithmic) */}
                 <div className="flex flex-col justify-between items-end pr-2 text-[#475569] text-xs font-sans h-full pb-6">
                   <span>10k</span>
                   <span>100</span>
                   <span>1</span>
                   <span>0.01</span>
                 </div>
                 
                 <div className="absolute -left-6 top-1/2 -rotate-90 transform -translate-y-1/2 text-[#475569] text-sm font-sans whitespace-nowrap">
                   Total L2 Norm
                 </div>

                 {/* Scalable Chart Grid Area */}
                 <div className="flex-1 relative h-full pb-6">
                    <div className="absolute top-0 left-0 right-0 bottom-6 border-l border-b border-[#f1f5f9]">
                        {/* Grid Lines */}
                        <div className="absolute w-full top-0 border-t border-[#f1f5f9]"></div>
                        <div className="absolute w-full top-[33.3%] border-t border-[#f1f5f9]"></div>
                        <div className="absolute w-full top-[66.6%] border-t border-[#f1f5f9]"></div>
                        
                        <div className="absolute h-full left-[20%] border-l border-[#f1f5f9]"></div>
                        <div className="absolute h-full left-[40%] border-l border-[#f1f5f9]"></div>
                        <div className="absolute h-full left-[60%] border-l border-[#f1f5f9]"></div>
                        <div className="absolute h-full left-[80%] border-l border-[#f1f5f9]"></div>
                        
                        {/* Scalable SVG Paths mapped to a 0-360 X grid and 0-140 Y grid */}
                        <svg viewBox="0 0 360 140" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-hidden">
                           {/* Green (Stable) */}
                           <path d="M 0 50 L 40 49 L 80 50 L 120 49 L 160 49 L 200 48 L 240 49 L 280 48 L 320 49 L 360 49" fill="none" stroke="#4ade80" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                           {/* Red (Exploding) */}
                           <path d="M 0 50 L 40 43 L 80 25 L 120 0" fill="none" stroke="#ef4444" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                           {/* Orange (Vanishing) */}
                           <path d="M 0 50 L 40 66 L 80 75 L 120 88 L 160 93 L 200 105 L 240 110 L 280 118 L 320 125 L 360 132" fill="none" stroke="#f59e0b" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                        </svg>
                    </div>

                    {/* X Axis Labels */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[#475569] text-xs font-sans h-6">
                      <span className="absolute left-[20%] -translate-x-1/2">2</span>
                      <span className="absolute left-[40%] -translate-x-1/2">4</span>
                      <span className="absolute left-[60%] -translate-x-1/2">6</span>
                      <span className="absolute left-[80%] -translate-x-1/2">8</span>
                      <span className="absolute left-[100%] -translate-x-1/2">10</span>
                    </div>
                 </div>

                 {/* Legend */}
                 <div className="absolute right-0 top-12 bg-white/80 p-2 text-sm font-sans flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-[#4ade80]"></div><span className="text-[#333]">Stable Gradients</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-[#ef4444]"></div><span className="text-[#333]">Exploding Gradients</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-[#f59e0b]"></div><span className="text-[#333]">Vanishing Gradients</span>
                    </div>
                 </div>

              </div>

              <div className="w-full text-center mt-8 text-[#333] text-sm font-sans">
                 Training Step
              </div>
           </div>

           {/* Caption Area */}
           <div className="w-full text-[#a4abb6] pt-4 text-center text-[11px] md:text-xs italic font-sans leading-relaxed">
             Trends of the total L2 norm of model gradients over training steps, visualized on a logarithmic scale. Stable training shows relatively consistent norms, exploding gradients show rapid increases (often leading to NaN), and vanishing gradients show a decline towards zero.
           </div>

        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto min-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-teal-400" /> <span className="font-semibold uppercase text-teal-400">Python Implementation</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100 overflow-x-auto">{pyCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Inspecting per Layer ---
function LayerInspectionSlide() {
  const [layer, setLayer] = useState('conv1'); // conv1, fc1, fc2

  const layerData = {
    'conv1': { 
      name: 'conv1 (Input Layer)', 
      mean: '0.000012', 
      max: '0.000045', 
      status: 'vanishing',
      desc: 'Gradients here are extremely small. This layer has stopped learning meaningful features from the raw image.'
    },
    'fc1': { 
      name: 'fc1 (Hidden Layer)', 
      mean: '0.045210', 
      max: '0.120500', 
      status: 'stable',
      desc: 'Gradients are at a healthy magnitude. The middle of the network is learning as expected.'
    },
    'fc2': { 
      name: 'fc2 (Output Layer)', 
      mean: '1.250400', 
      max: '3.400100', 
      status: 'stable',
      desc: 'Being closest to the loss function, the output layer naturally has the largest, most direct gradients.'
    }
  };

  const pyCode = `# Inside your training loop, after loss.backward()

# Example: Inspect gradients for the first convolutional layer
if hasattr(model, 'conv1') and model.conv1.weight.grad is not None:
    conv1_grad_mean = model.conv1.weight.grad.abs().mean().item()
    conv1_grad_max = model.conv1.weight.grad.abs().max().item()
    print(f"Layer conv1 - Mean Abs Grad: {conv1_grad_mean:.6f}, Max Abs: {conv1_grad_max:.6f}")

# Example: Inspect gradients for a specific linear layer's bias
if hasattr(model, 'fc2') and model.fc2.bias.grad is not None:
    fc2_bias_grad_norm = model.fc2.bias.grad.norm(2).item()
    print(f"Layer fc2 (bias) - L2 Norm: {fc2_bias_grad_norm:.6f}")

# ----------------------------------------------------
# ADVANCED: Using Hooks for automated inspection
# ----------------------------------------------------
def check_grad_hook(module, grad_input, grad_output):
    print(f"{module.__class__.__name__} backward gradient norm: {grad_output[0].norm().item()}")

# Register the hook before the training loop
model.conv1.register_full_backward_hook(check_grad_hook)`;

  return (
    <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Inspecting Gradients per Layer</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          If the total norm indicates an issue, you must identify <em>where</em> the breakdown occurs. You can directly access the <code>.grad</code> attribute of specific layers to find the culprit.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col flex-1 relative overflow-hidden shadow-inner">
           <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Interactive Network Probe</h4>
           
           <div className="flex flex-col gap-3 w-full">
             {Object.keys(layerData).map((key) => (
               <button 
                 key={key}
                 onClick={() => setLayer(key)}
                 className={`px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all ${layer === key ? 'bg-teal-50 border-teal-500 shadow-md scale-105 z-10' : 'bg-white border-slate-200 hover:border-teal-300'}`}
               >
                 <span className={`font-mono text-sm font-bold ${layer === key ? 'text-teal-900' : 'text-slate-600'}`}>{layerData[key].name}</span>
                 {layer === key && <Search size={16} className="text-teal-500" />}
               </button>
             ))}
           </div>

           <div className="mt-8 bg-white border border-slate-200 p-4 rounded-xl shadow-sm animate-in slide-in-from-bottom-4 relative">
             {layerData[layer].status === 'vanishing' && <div className="absolute top-4 right-4 text-amber-500 animate-pulse"><AlertTriangle size={24}/></div>}
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Probe Results</span>
             <div className="grid grid-cols-2 gap-4 mb-4">
               <div>
                 <span className="text-[10px] text-slate-500 block mb-1">.abs().mean()</span>
                 <span className={`font-mono text-lg font-bold ${layerData[layer].status === 'vanishing' ? 'text-amber-600' : 'text-emerald-600'}`}>{layerData[layer].mean}</span>
               </div>
               <div>
                 <span className="text-[10px] text-slate-500 block mb-1">.abs().max()</span>
                 <span className={`font-mono text-lg font-bold ${layerData[layer].status === 'vanishing' ? 'text-amber-600' : 'text-emerald-600'}`}>{layerData[layer].max}</span>
               </div>
             </div>
             <p className="text-xs text-slate-600 leading-relaxed border-t pt-3">
               {layerData[layer].desc}
             </p>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto min-h-[300px]">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2"><Code size={14} className="text-teal-400" /> <span className="font-semibold uppercase text-teal-400 font-sans text-xs">Targeted Inspection & Hooks</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100 overflow-x-auto">{pyCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 4: Symptoms & Mitigation ---
function MitigationSlide() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Symptoms & Mitigation Strategies</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Indirectly, the <strong>training loss</strong> is your first indicator of gradient problems. Once detected, employ these standard engineering techniques to stabilize the network.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_2.5fr] gap-6 flex-1">
        
        {/* Symptoms Column */}
        <div className="flex flex-col gap-4">
           <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl shadow-sm">
             <h4 className="font-bold text-rose-900 text-sm mb-2">Loss becomes NaN</h4>
             <p className="text-xs text-rose-800 leading-relaxed">Almost always a sign of exploding gradients causing numerical overflow, or invalid math operations (like log(0)).</p>
           </div>
           
           <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-sm">
             <h4 className="font-bold text-amber-900 text-sm mb-2">Loss plateaus early</h4>
             <p className="text-xs text-amber-800 leading-relaxed">Symptom of vanishing gradients. Initial layers have stopped learning, halting network progress.</p>
           </div>

           <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm">
             <h4 className="font-bold text-blue-900 text-sm mb-2">Loss fluctuates wildly</h4>
             <p className="text-xs text-blue-800 leading-relaxed">Indicates exploding gradients bounding around the parameter space, or a learning rate that is set far too high.</p>
           </div>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 gap-4">
           
           <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
             <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2"><Scissors size={18} className="text-teal-500"/> 1. Gradient Clipping</h4>
             <p className="text-xs text-slate-600 leading-relaxed mb-3">
               A direct fix for exploding gradients. Caps the maximum norm of gradients before the optimizer step.
             </p>
             <code className="bg-slate-100 text-slate-700 text-[10px] p-2 rounded block font-mono border border-slate-200">
               torch.nn.utils.clip_grad_norm_(<br/>&nbsp;&nbsp;model.parameters(), max_norm=1.0<br/>)
             </code>
           </div>

           <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
             <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2"><Activity size={18} className="text-teal-500"/> 2. Smarter Activations</h4>
             <p className="text-xs text-slate-600 leading-relaxed">
               Replace Sigmoid/Tanh in deep networks with <strong>ReLU</strong> or its variants (Leaky ReLU). ReLU maintains a gradient of 1.0 for positive inputs, explicitly preventing them from vanishing.
             </p>
           </div>

           <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
             <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2"><Zap size={18} className="text-teal-500"/> 3. Weight Initialization</h4>
             <p className="text-xs text-slate-600 leading-relaxed">
               Use initialization schemes designed to maintain mathematical variance across layers, such as <strong>Xavier/Glorot</strong> (for Sigmoid/Tanh) or <strong>Kaiming/He</strong> (for ReLU layers).
             </p>
           </div>

           <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
             <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2"><Layers size={18} className="text-teal-500"/> 4. Batch Normalization</h4>
             <p className="text-xs text-slate-600 leading-relaxed">
               Inserting <code>nn.BatchNorm2d</code> layers normalizes the inputs between layers. This heavily stabilizes learning and mitigates both vanishing and exploding gradients.
             </p>
           </div>

           <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
             <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2"><Network size={18} className="text-teal-500"/> 5. Residual Connections</h4>
             <p className="text-xs text-slate-600 leading-relaxed">
               Used in ResNets. By adding "skip connections" (adding the input of a block directly to its output), gradients have a clean "highway" to flow backward, bypassing vanishing layers.
             </p>
           </div>

           <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
             <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2"><TrendingDown size={18} className="text-teal-500"/> 6. Lower Learning Rate</h4>
             <p className="text-xs text-slate-600 leading-relaxed">
               If gradients are exploding, drastically lowering the learning rate (e.g., from <code>0.01</code> to <code>0.0001</code>) can sometimes stabilize the math, though it may not fix an underlying architectural flaw.
             </p>
           </div>

        </div>

      </div>
    </div>
  );
}

// --- Slide 5: TensorBoard Setup (NEW) ---
function TensorBoardSetupSlide() {
  const pyCode = `from torch.utils.tensorboard import SummaryWriter

# Create a SummaryWriter instance
# It automatically creates the directory if it doesn't exist.
# If no argument is provided, it defaults to:
# 'runs/CURRENT_DATETIME_HOSTNAME'
log_dir = 'runs/my_first_experiment'
writer = SummaryWriter(log_dir)

print(f"TensorBoard log directory: {log_dir}")

# --- Launching TensorBoard ---
# Open your terminal and run:
# tensorboard --logdir runs

# Then open http://localhost:6006 in your browser!`;

  return (
    <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4 text-orange-600">Visualizing with TensorBoard</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Print statements only give you snapshots of your metrics. <strong>TensorBoard</strong> provides a web-based dashboard to track trends, identify overfitting, and observe training dynamics over time.
        </p>

        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 shadow-sm flex flex-col flex-1 relative overflow-hidden">
           <h4 className="text-xs font-bold text-orange-800 uppercase tracking-widest mb-4 flex items-center gap-2">
             <Folder size={16}/> Standard Directory Structure
           </h4>
           
           <div className="bg-white border border-orange-100 p-4 rounded-xl shadow-sm font-mono text-sm text-slate-700">
             <div className="flex items-center gap-2 font-bold text-slate-800"><Folder size={16} className="text-blue-400 fill-current"/> root_project/</div>
             <div className="ml-4 mt-2 border-l-2 border-slate-200 pl-4 space-y-2">
                <div className="flex items-center gap-2"><FileCode2 size={16} className="text-emerald-500"/> train.py</div>
                <div className="flex items-center gap-2 font-bold text-orange-700"><Folder size={16} className="text-orange-400 fill-current"/> runs/</div>
                
                <div className="ml-4 border-l-2 border-slate-200 pl-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold"><Folder size={16} className="text-orange-300 fill-current"/> exp_lr_0.01/</div>
                  <div className="ml-4 border-l-2 border-slate-200 pl-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500"><Database size={14} className="text-slate-400"/> events.out.tfevents...</div>
                  </div>
                  
                  <div className="flex items-center gap-2 font-bold"><Folder size={16} className="text-orange-300 fill-current"/> exp_lr_0.001/</div>
                  <div className="ml-4 border-l-2 border-slate-200 pl-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500"><Database size={14} className="text-slate-400"/> events.out.tfevents...</div>
                  </div>
                </div>
             </div>
           </div>

           <p className="mt-6 text-xs text-orange-800 leading-relaxed bg-orange-100/50 p-3 rounded-lg border border-orange-200">
             <strong>Best Practice:</strong> Use different subdirectories for different experiments (like tuning the learning rate). TensorBoard will automatically overlay the plots so you can directly compare them!
           </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto min-h-[300px]">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2"><Code size={14} className="text-orange-400" /> <span className="font-semibold uppercase text-orange-400 font-sans text-xs">Setting up SummaryWriter</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100 overflow-x-auto">{pyCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 6: Logging & Visualizing (Chart Recreation) (NEW) ---
function TensorBoardLogSlide() {
  
  const pyCode = `for epoch in range(num_epochs):
    # --- Training Phase ---
    model.train()
    running_loss = 0.0
    
    for i, data in enumerate(train_loader):
        inputs, labels = data[0].to(device), data[1].to(device)
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item() * inputs.size(0)

    epoch_loss = running_loss / len(train_dataset)
    
    # LOGGING SCALAR (Train Loss)
    # tag, scalar_value, global_step
    writer.add_scalar('Loss/train_epoch', epoch_loss, epoch)

    # --- Validation Phase ---
    model.eval()
    val_loss, correct = 0.0, 0
    with torch.no_grad():
        for data in valid_loader:
            inputs, labels = data[0].to(device), data[1].to(device)
            outputs = model(inputs)
            val_loss += criterion(outputs, labels).item() * inputs.size(0)
            _, pred = torch.max(outputs.data, 1)
            correct += (pred == labels).sum().item()

    avg_val_loss = val_loss / len(valid_dataset)
    accuracy = 100.0 * correct / len(valid_dataset)

    # LOGGING SCALARS (Validation Loss & Accuracy)
    writer.add_scalar('Loss/validation', avg_val_loss, epoch)
    writer.add_scalar('Accuracy/validation', accuracy, epoch)

# ALWAYS close the writer!
writer.close()`;

  // Mathematical mapping to precisely recreate the dual-axis chart in SVG using percentages (0-100)
  const mapX = (epoch) => (epoch / 9) * 100;
  const mapLeftY = (loss) => 100 - (loss / 2.5) * 100;
  const mapRightY = (acc) => 100 - ((acc - 30) / 60) * 100;

  const trainLossData = [2.1, 1.5, 1.1, 0.8, 0.6, 0.45, 0.35, 0.30, 0.26, 0.22];
  const valLossData = [2.0, 1.6, 1.3, 1.0, 0.85, 0.75, 0.70, 0.68, 0.67, 0.66];
  const valAccData = [32, 45, 58, 68, 75, 80, 83, 84, 84.5, 85];

  const trainLossPath = trainLossData.map((val, i) => `${i===0?'M':'L'} ${mapX(i)} ${mapLeftY(val)}`).join(' ');
  const valLossPath = valLossData.map((val, i) => `${i===0?'M':'L'} ${mapX(i)} ${mapLeftY(val)}`).join(' ');
  const valAccPath = valAccData.map((val, i) => `${i===0?'M':'L'} ${mapX(i)} ${mapRightY(val)}`).join(' ');

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Logging Scalars & Overfitting Detection</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          The <code>add_scalar()</code> method is your primary tool. By organizing tags with slashes (e.g., <code>'Loss/train'</code> vs <code>'Loss/validation'</code>), TensorBoard cleanly groups your charts.
        </p>

        {/* TensorBoard Chart Recreation */}
        <div className="bg-[#202020] border border-slate-700 rounded-xl p-6 flex-1 relative flex flex-col items-center shadow-lg">
           
           <div className="bg-white w-full h-[320px] p-6 relative shadow flex flex-col mt-2">
              <h4 className="text-[#333] text-lg font-sans text-center mb-6">Example TensorBoard Metrics</h4>
              
              <div className="flex-1 relative flex">
                 
                 {/* Left Y Axis (Loss) */}
                 <div className="flex flex-col justify-between items-end pr-2 text-[#475569] text-xs font-sans h-full pb-6">
                   <span>2.5</span>
                   <span>2.0</span>
                   <span>1.5</span>
                   <span>1.0</span>
                   <span>0.5</span>
                   <span>0</span>
                 </div>
                 <div className="absolute -left-6 top-1/2 -rotate-90 transform -translate-y-1/2 text-[#475569] text-sm font-sans">Loss</div>

                 {/* Scalable Chart Grid Area */}
                 <div className="flex-1 relative h-full pb-6">
                    <div className="absolute top-0 left-0 right-0 bottom-6 border-l border-b border-[#f1f5f9]">
                        {/* Horizontal Grid Lines */}
                        <div className="absolute w-full top-0 border-t border-[#f1f5f9]"></div>
                        <div className="absolute w-full top-[20%] border-t border-[#f1f5f9]"></div>
                        <div className="absolute w-full top-[40%] border-t border-[#f1f5f9]"></div>
                        <div className="absolute w-full top-[60%] border-t border-[#f1f5f9]"></div>
                        <div className="absolute w-full top-[80%] border-t border-[#f1f5f9]"></div>
                        
                        {/* Vertical Grid Lines */}
                        {[1,2,3,4,5,6,7,8].map(i => (
                          <div key={i} className="absolute h-full border-l border-[#f1f5f9]" style={{left: `${(i/9)*100}%`}}></div>
                        ))}
                        
                        {/* Scalable SVG Lines matching the screenshot */}
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-hidden">
                           <path d={trainLossPath} fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" className="animate-in fade-in duration-1000"/>
                           <path d={valLossPath} fill="none" stroke="#f97316" strokeWidth="2" vectorEffect="non-scaling-stroke" className="animate-in fade-in duration-1000 delay-300"/>
                           <path d={valAccPath} fill="none" stroke="#4ade80" strokeWidth="2" vectorEffect="non-scaling-stroke" className="animate-in fade-in duration-1000 delay-500"/>
                        </svg>
                    </div>

                    {/* X Axis Labels */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[#475569] text-xs font-sans h-6">
                      {[0,1,2,3,4,5,6,7,8,9].map(i => (
                         <span key={i} className="absolute -translate-x-1/2" style={{left: `${(i/9)*100}%`}}>{i}</span>
                      ))}
                    </div>
                 </div>

                 {/* Right Y Axis (Accuracy) */}
                 <div className="flex flex-col justify-between items-start pl-2 text-[#4ade80] text-xs font-sans h-full pb-6 border-l border-[#f1f5f9]">
                   <span>90</span>
                   <span>80</span>
                   <span>70</span>
                   <span>60</span>
                   <span>50</span>
                   <span>40</span>
                   <span>30</span>
                 </div>
                 <div className="absolute -right-8 top-1/2 -rotate-90 transform -translate-y-1/2 text-[#4ade80] text-sm font-sans">Accuracy (%)</div>
              </div>

              <div className="w-full text-center mt-6 text-[#333] text-sm font-sans">
                 Epoch
              </div>

              {/* Legend */}
              <div className="w-full flex justify-center gap-6 mt-2 text-xs font-sans text-[#475569]">
                 <div className="flex items-center gap-2"><div className="w-6 h-0.5 bg-[#3b82f6]"></div>Loss/train_epoch</div>
                 <div className="flex items-center gap-2"><div className="w-6 h-0.5 bg-[#f97316]"></div>Loss/validation</div>
                 <div className="flex items-center gap-2"><div className="w-6 h-0.5 bg-[#4ade80]"></div>Accuracy/validation</div>
              </div>
           </div>

           {/* Caption */}
           <div className="w-full text-[#a4abb6] pt-4 text-center text-[11px] md:text-xs italic font-sans leading-relaxed">
             Example plot similar to what TensorBoard might display, showing training loss, validation loss, and validation accuracy across epochs. Notice how validation loss levels off around Epoch 6, indicating the onset of overfitting!
           </div>

        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto min-h-[300px]">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2"><Code size={14} className="text-orange-400" /> <span className="font-semibold uppercase text-orange-400">Loop Integration Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100 overflow-x-auto">{pyCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 7: Advanced Logging (NEW) ---
function TensorBoardAdvSlide() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2 text-orange-600">Advanced TensorBoard Features</h3>
        <p className="text-slate-600 text-sm leading-relaxed max-w-4xl">
          While <code>add_scalar</code> is your daily driver, SummaryWriter packs specialized visualization tools for advanced architectural debugging and deep introspection.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 flex-1">
        
        {/* Histograms */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm hover:border-orange-400 transition-colors">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><BarChart size={24}/></div>
             <h4 className="font-bold text-slate-800 text-lg">add_histogram()</h4>
           </div>
           <p className="text-sm text-slate-600 leading-relaxed mb-4">
             Tracks the distribution of a tensor's values over time. Essential for monitoring if weights or gradients are collapsing to zero (vanishing) or blowing up to infinity (exploding) in specific layers.
           </p>
           <code className="bg-slate-100 text-slate-700 text-[10px] p-2 rounded block font-mono">writer.add_histogram('Layer1/weights', model.layer1.weight, epoch)</code>
        </div>

        {/* Graphs */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm hover:border-orange-400 transition-colors">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center"><Network size={24}/></div>
             <h4 className="font-bold text-slate-800 text-lg">add_graph()</h4>
           </div>
           <p className="text-sm text-slate-600 leading-relaxed mb-4">
             Draws an interactive node-graph of your entire model architecture. You pass the model and a dummy input tensor, and it visually diagrams every layer and operation connection.
           </p>
           <code className="bg-slate-100 text-slate-700 text-[10px] p-2 rounded block font-mono">writer.add_graph(model, dummy_input_tensor)</code>
        </div>

        {/* Images */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm hover:border-orange-400 transition-colors">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center"><ImageIcon size={24}/></div>
             <h4 className="font-bold text-slate-800 text-lg">add_image()</h4>
           </div>
           <p className="text-sm text-slate-600 leading-relaxed mb-4">
             Renders image tensors directly into the dashboard. Fantastic for Computer Vision tasks to verify that your Dataset augmentations (crops, flips) look correct before they hit the model.
           </p>
           <code className="bg-slate-100 text-slate-700 text-[10px] p-2 rounded block font-mono">writer.add_image('Input_Images', img_tensor_grid, epoch)</code>
        </div>

        {/* Embeddings */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm hover:border-orange-400 transition-colors">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center"><Layout size={24}/></div>
             <h4 className="font-bold text-slate-800 text-lg">add_embedding()</h4>
           </div>
           <p className="text-sm text-slate-600 leading-relaxed mb-4">
             Visualizes high-dimensional data (like word embeddings or CNN feature vectors) in 3D space using dimensionality reduction techniques like PCA or t-SNE directly in the browser!
           </p>
           <code className="bg-slate-100 text-slate-700 text-[10px] p-2 rounded block font-mono">writer.add_embedding(features_matrix, metadata=labels)</code>
        </div>

      </div>
    </div>
  );
}