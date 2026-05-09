import React, { useState, useEffect } from 'react';
import { 
  Bug, ChevronLeft, ChevronRight, Code, Terminal, 
  AlertTriangle, CheckCircle2, BoxSelect, Cpu, Zap, 
  ArrowRight, ShieldAlert, GitBranch, Database, XCircle,
  Activity, Layers, Crosshair, Scissors
} from 'lucide-react';

export default function CommonErrorsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'shapes', title: 'Shape Mismatches', component: ShapeMismatchSlide },
    { id: 'devices', title: 'Device Mismatches', component: DeviceMismatchSlide },
    { id: 'losses', title: 'Loss Function Errors', component: LossErrorsSlide },
    { id: 'gradients', title: 'Gradient Flow Issues', component: GradientFlowSlide },
    { id: 'dataloading', title: 'Data Loading Errors', component: DataLoadingSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Bug size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Common Errors in PyTorch</h2>
        <p className="text-slate-400 text-sm mb-4">Identifying and debugging frequent development pitfalls</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[20px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-rose-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          <span className="text-rose-400 font-bold whitespace-nowrap">Slide {currentSlide + 1} of {slides.length}: {slides[currentSlide].title}</span>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: Shape Mismatches ---
function ShapeMismatchSlide() {
  const [step, setStep] = useState(0);

  const pyCode = `import torch\nimport torch.nn as nn\n\nconv_layer = nn.Conv2d(in_channels=3, out_channels=16, kernel_size=3, padding=1)\ninput_data = torch.randn(64, 3, 32, 32) # (N, C, H, W)\n\n# Forward pass through convolution\nconv_output = conv_layer(input_data)\nprint(f"Conv output shape: {conv_output.shape}")\n\n# ATTEMPT 1: Pass directly to linear layer (WILL FAIL)\n# linear_layer = nn.Linear(in_features=???, out_features=10)\n# output = linear_layer(conv_output) \n# RuntimeError: size mismatch, m1: [64 x 16384], m2: [? x 10]\n\n# ATTEMPT 2: Correct approach requires flattening\nflattened_output = conv_output.view(conv_output.size(0), -1)\nprint(f"Flattened output shape: {flattened_output.shape}")\n\n# Now we know the required in_features is 16384 (16 * 32 * 32)\ncorrect_linear = nn.Linear(in_features=16384, out_features=10)\noutput = correct_linear(flattened_output)\nprint(f"Final output shape: {output.shape}")`;

  const outCode = step === 0 ? "Waiting for execution..." :
    step === 1 ? `Conv output shape: torch.Size([64, 16, 32, 32])\n\nRuntimeError: mat1 and mat2 shapes cannot be multiplied (64x16384 and ?x10)` :
    `Conv output shape: torch.Size([64, 16, 32, 32])\nFlattened output shape: torch.Size([64, 16384])\nFinal output shape: torch.Size([64, 10])`;

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">Shape Mismatches</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          The most common runtime error. It typically occurs when transitioning between layer types (e.g., Convolutional to Linear) without reshaping the tensor, causing a matrix multiplication failure.
        </p>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setStep(1)}
            className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-1 ${step === 1 ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <span className="flex items-center gap-2"><AlertTriangle size={16}/> Direct Pass</span>
            <span className="text-[10px] uppercase">Conv2d -{'>'} Linear</span>
          </button>
          <button 
            onClick={() => setStep(2)}
            className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-1 ${step === 2 ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <span className="flex items-center gap-2"><CheckCircle2 size={16}/> Flatten First</span>
            <span className="text-[10px] uppercase">Conv2d -{'>'} View -{'>'} Linear</span>
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col items-center justify-center flex-1 relative overflow-hidden min-h-[250px]">
          
          <div className="flex flex-col items-center w-full relative z-10 gap-6">
            
            {/* Conv Output */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Conv2d Output</span>
              <div className="bg-blue-100 border-2 border-blue-400 text-blue-900 px-4 py-2 rounded-lg font-mono font-bold shadow-sm">
                [64, 16, 32, 32]
              </div>
            </div>

            <ArrowRight size={24} className="text-slate-400 rotate-90" />

            {step === 1 && (
              <div className="flex flex-col items-center animate-in zoom-in-95">
                <div className="bg-rose-100 border-2 border-rose-500 text-rose-900 px-4 py-3 rounded-lg font-mono font-bold shadow-md flex items-center gap-3">
                  <XCircle size={24} className="text-rose-500"/>
                  <div className="flex flex-col">
                    <span>nn.Linear(?, 10)</span>
                    <span className="text-[10px] text-rose-600 mt-1">Requires a 2D Tensor [Batch, Features]</span>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col items-center animate-in zoom-in-95 w-full">
                
                <div className="bg-amber-100 border-2 border-amber-400 text-amber-900 px-4 py-2 rounded-lg font-mono font-bold shadow-sm w-full text-center relative">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] bg-amber-50 px-2 rounded border border-amber-200">.view(64, -1)</span>
                  [64, 16384]
                </div>
                
                <ArrowRight size={24} className="text-slate-400 rotate-90 my-4" />
                
                <div className="bg-emerald-100 border-2 border-emerald-500 text-emerald-900 px-4 py-3 rounded-lg font-mono font-bold shadow-md flex items-center gap-3">
                  <CheckCircle2 size={24} className="text-emerald-500"/>
                  <div className="flex flex-col">
                    <span>nn.Linear(16384, 10)</span>
                    <span className="text-[10px] text-emerald-600 mt-1">Outputs Final Shape [64, 10]</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto max-h-[350px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Python Code Demonstration</span></div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-emerald-100 leading-relaxed overflow-x-auto">
{pyCode}
          </pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[150px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className={`whitespace-pre-wrap ${step === 1 ? 'text-rose-400' : 'text-emerald-400'}`}>{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: Device Mismatches (Screenshot Recreation) ---
function DeviceMismatchSlide() {
  const [step, setStep] = useState(0);

  const pyCode = `import torch\nimport torch.nn as nn\n\ndevice = torch.device("cuda" if torch.cuda.is_available() else "cpu")\n\nmodel = nn.Linear(10, 5)\nmodel.to(device) # Model is on GPU\n\ninput_cpu = torch.randn(1, 10) # Tensor on CPU by default\n\n# ATTEMPT 1: Device Mismatch\n# output = model(input_cpu)\n# RuntimeError: Expected all tensors to be on the same device...\n\n# ATTEMPT 2: Correct approach\ninput_gpu = input_cpu.to(device) # Move data to GPU\noutput = model(input_gpu)        # Success!`;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h3 className="text-xl font-bold mb-2">Device Mismatches (CPU/GPU)</h3>
            <p className="text-slate-600 text-sm">
               Operations require all interacting tensors and models to reside on the same hardware device.
            </p>
         </div>
         <button 
            onClick={() => setStep(s => s === 0 ? 1 : 0)} 
            className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow transition-all flex items-center gap-2 shrink-0 ${step === 0 ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-500 hover:bg-slate-600 text-white'}`}
          >
            {step === 0 ? "Apply .to(device) Fix" : "Show Error State"}
          </button>
      </div>

      <div className="bg-[#f0f3f5] border border-slate-300 rounded-2xl flex flex-col items-center justify-center flex-1 relative overflow-x-auto min-h-[400px] shadow-sm mb-6 p-8">
         
         <div style={{ minWidth: 600, height: 300, position: 'relative' }} className="mx-auto mt-4">
            
            {/* SVG Lines */}
            <svg width="600" height="300" className="absolute inset-0 z-0 pointer-events-none">
               <defs>
                 <marker id="arrowRed" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                   <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                 </marker>
                 <marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                   <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
                 </marker>
                 <marker id="arrowDark" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                   <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                 </marker>
               </defs>

               {/* Error Path (Dotted Red) - Only show in step 0 */}
               <g className={`transition-opacity duration-500 ${step === 0 ? 'opacity-100' : 'opacity-0'}`}>
                 <path d="M 120 90 L 120 155" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" fill="none" markerEnd="url(#arrowRed)" />
                 <text x="85" y="140" fontSize="14" fill="#000">Error!</text>
                 <text x="40" y="165" fontSize="14" fill="#000">Device Mismatch</text>
               </g>

               {/* Fix Path (Dashed Blue) - Only show in step 1 */}
               <g className={`transition-opacity duration-500 ${step === 1 ? 'opacity-100' : 'opacity-0'}`}>
                 <path d="M 180 65 L 415 95" stroke="#60a5fa" strokeWidth="2" strokeDasharray="6,4" fill="none" markerEnd="url(#arrowBlue)" />
                 <text x="250" y="70" fontSize="14" fill="#000">.to(device)</text>
               </g>

               {/* Forward Pass Path 1: GPU Input -> GPU Model */}
               <path d="M 420 120 L 205 195" stroke="#475569" strokeWidth="2" fill="none" markerEnd="url(#arrowDark)" />
               <text x="250" y="130" fontSize="14" fill="#000">Forward Pass</text>

               {/* Forward Pass Path 2: GPU Model -> GPU Output */}
               <path d="M 200 205 L 415 205" stroke="#475569" strokeWidth="2" fill="none" markerEnd="url(#arrowDark)" />
            </svg>

            {/* GPU Memory Block Background */}
            <div className="absolute border-2 border-black bg-[#f8d7da] z-0" style={{ left: 380, top: 0, width: 200, height: 280 }}>
               <div className="w-full text-center mt-2 text-[15px] font-sans text-slate-800">GPU Memory</div>
            </div>

            {/* HTML Nodes (Recreating the shapes exactly) */}
            <div className="absolute inset-0 pointer-events-none z-10">
               
               {/* Input Tensor CPU Cylinder */}
               <div className="absolute bg-white border-2 border-[#3b82f6] rounded-[50%_50%_10%_10%/10%_10%_10%_10%] flex flex-col items-center justify-center font-sans text-slate-600" style={{ left: 60, top: 20, width: 120, height: 70 }}>
                  <div className="absolute top-0 w-full h-3 border-b-2 border-[#3b82f6] rounded-[50%]"></div>
                  <span className="mt-2">Input Tensor</span>
                  <span>(CPU)</span>
               </div>

               {/* Model GPU Box */}
               <div className={`absolute bg-white border-2 transition-colors duration-500 rounded flex flex-col items-center justify-center font-sans text-slate-600 ${step === 0 ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'border-emerald-500'}`} style={{ left: 80, top: 175, width: 80, height: 60 }}>
                  {/* Little UI accents on the box corners */}
                  <div className={`absolute -left-2 top-2 w-2 h-2 border-2 ${step === 0 ? 'border-rose-500' : 'border-emerald-500'}`}></div>
                  <div className={`absolute -left-2 bottom-2 w-2 h-2 border-2 ${step === 0 ? 'border-rose-500' : 'border-emerald-500'}`}></div>
                  <span>Model</span>
                  <span>(GPU)</span>
               </div>

               {/* Input Tensor GPU Cylinder */}
               <div className={`absolute bg-[#f8d7da] border-2 border-[#ef4444] rounded-[50%_50%_10%_10%/10%_10%_10%_10%] flex flex-col items-center justify-center font-sans text-slate-600 transition-opacity duration-500 ${step === 1 ? 'opacity-100' : 'opacity-40'}`} style={{ left: 420, top: 50, width: 120, height: 70 }}>
                  <div className="absolute top-0 w-full h-3 border-b-2 border-[#ef4444] rounded-[50%]"></div>
                  <span className="mt-2">Input Tensor</span>
                  <span>(GPU)</span>
               </div>

               {/* Output Tensor GPU Cylinder */}
               <div className={`absolute bg-[#f8d7da] border-2 border-[#ef4444] rounded-[50%_50%_10%_10%/10%_10%_10%_10%] flex flex-col items-center justify-center font-sans text-slate-600 transition-opacity duration-500 ${step === 1 ? 'opacity-100' : 'opacity-40'}`} style={{ left: 420, top: 170, width: 120, height: 70 }}>
                  <div className="absolute top-0 w-full h-3 border-b-2 border-[#ef4444] rounded-[50%]"></div>
                  <span className="mt-2">Output Tensor</span>
                  <span>(GPU)</span>
               </div>

            </div>

         </div>

         {/* Caption */}
         <div className="w-full bg-[#202020] text-slate-300 p-4 mt-6 text-center text-xs md:text-sm italic border-t-4 border-slate-700">
            A common scenario leading to device mismatch errors. Input tensors must be moved to the same device as the model (e.g., GPU) before the forward pass.
         </div>
      </div>

      {/* Code Area */}
      <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-none h-[180px] overflow-y-auto">
        <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-rose-400" /> <span className="font-semibold uppercase text-rose-400 font-sans text-xs">Troubleshooting Guide</span></div>
        <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100 overflow-x-auto">{pyCode}</pre>
      </div>

    </div>
  );
}

// --- Slide 3: Incorrect Loss Functions ---
function LossErrorsSlide() {
  const [view, setView] = useState('ce');

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <h3 className="text-xl font-bold mb-4">Incorrect Loss Function Shapes/Types</h3>
      <p className="text-slate-600 mb-6 leading-relaxed text-sm">
        Using the wrong combination of model outputs and target labels can lead to crashes, or worse, <strong>"silent" failures</strong> where the loss decreases but the model learns the wrong objective.
      </p>

      <div className="grid md:grid-cols-[1fr_2fr] gap-6 flex-1">
        
        {/* Nav */}
        <div className="flex flex-col gap-3">
          <button onClick={() => setView('ce')} className={`p-4 rounded-xl border-2 text-left transition-all ${view === 'ce' ? 'bg-rose-50 border-rose-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
            <h4 className={`font-bold text-sm mb-1 ${view === 'ce' ? 'text-rose-900' : 'text-slate-700'}`}>CrossEntropyLoss</h4>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Multi-Class</span>
          </button>
          <button onClick={() => setView('mse')} className={`p-4 rounded-xl border-2 text-left transition-all ${view === 'mse' ? 'bg-rose-50 border-rose-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
            <h4 className={`font-bold text-sm mb-1 ${view === 'mse' ? 'text-rose-900' : 'text-slate-700'}`}>MSELoss</h4>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Regression</span>
          </button>
          <button onClick={() => setView('bce')} className={`p-4 rounded-xl border-2 text-left transition-all ${view === 'bce' ? 'bg-rose-50 border-rose-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
            <h4 className={`font-bold text-sm mb-1 ${view === 'bce' ? 'text-rose-900' : 'text-slate-700'}`}>BCEWithLogitsLoss</h4>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Binary / Multi-Label</span>
          </button>
        </div>

        {/* Content */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col relative overflow-hidden">
          
          {view === 'ce' && (
            <div className="animate-in slide-in-from-right-4 w-full flex flex-col gap-6">
               <h4 className="text-lg font-bold text-slate-800 border-b pb-2">CrossEntropyLoss Requirements</h4>
               
               <div className="flex gap-4">
                 <div className="flex-1 bg-white p-4 rounded-xl border shadow-sm">
                   <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2 block">Predictions (Model Output)</span>
                   <ul className="text-sm text-slate-700 space-y-2 list-disc ml-4">
                     <li>Shape: <code>(Batch, Classes)</code></li>
                     <li>Type: <code>Float</code></li>
                     <li>Data: <strong>Raw, unnormalized Logits.</strong></li>
                   </ul>
                 </div>
                 <div className="flex-1 bg-white p-4 rounded-xl border shadow-sm">
                   <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Targets (Ground Truth)</span>
                   <ul className="text-sm text-slate-700 space-y-2 list-disc ml-4">
                     <li>Shape: <code>(Batch)</code> - No channel dim!</li>
                     <li>Type: <code>Long</code> (Integers)</li>
                     <li>Data: Class indices (0 to C-1).</li>
                   </ul>
                 </div>
               </div>

               <div className="bg-rose-100 border border-rose-300 p-4 rounded-xl flex items-start gap-4">
                 <ShieldAlert className="text-rose-600 shrink-0 mt-1"/>
                 <div>
                   <h5 className="font-bold text-rose-900 text-sm mb-1">Common Silent Failure</h5>
                   <p className="text-xs text-rose-800 leading-relaxed">
                     Applying a <code>nn.Softmax()</code> layer at the end of your model before passing the data to <code>CrossEntropyLoss</code>. The loss function already applies LogSoftmax internally. Doing it twice destroys learning capability!
                   </p>
                 </div>
               </div>
            </div>
          )}

          {view === 'mse' && (
            <div className="animate-in slide-in-from-right-4 w-full flex flex-col gap-6">
               <h4 className="text-lg font-bold text-slate-800 border-b pb-2">MSELoss Requirements</h4>
               
               <div className="flex gap-4">
                 <div className="flex-1 bg-white p-4 rounded-xl border shadow-sm">
                   <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2 block">Predictions (Model Output)</span>
                   <ul className="text-sm text-slate-700 space-y-2 list-disc ml-4">
                     <li>Shape: <code>(Batch, Features)</code></li>
                     <li>Type: <code>Float</code></li>
                     <li>Data: Continuous predictions.</li>
                   </ul>
                 </div>
                 <div className="flex-1 bg-white p-4 rounded-xl border shadow-sm">
                   <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Targets (Ground Truth)</span>
                   <ul className="text-sm text-slate-700 space-y-2 list-disc ml-4">
                     <li>Shape: <strong>Exactly matches predictions.</strong></li>
                     <li>Type: <code>Float</code></li>
                     <li>Data: Continuous target values.</li>
                   </ul>
                 </div>
               </div>

               <div className="bg-rose-100 border border-rose-300 p-4 rounded-xl flex items-start gap-4">
                 <AlertTriangle className="text-rose-600 shrink-0 mt-1"/>
                 <div>
                   <h5 className="font-bold text-rose-900 text-sm mb-1">Common Shape Failure</h5>
                   <p className="text-xs text-rose-800 leading-relaxed">
                     If predictions are <code>[64, 1]</code> and targets are <code>[64]</code>, PyTorch's broadcasting rules will accidentally expand the math to calculate a massive <code>[64, 64]</code> loss matrix, causing wildly incorrect loss values. Ensure shapes match identically using <code>.squeeze()</code> or <code>.unsqueeze()</code>.
                   </p>
                 </div>
               </div>
            </div>
          )}

          {view === 'bce' && (
            <div className="animate-in slide-in-from-right-4 w-full flex flex-col gap-6">
               <h4 className="text-lg font-bold text-slate-800 border-b pb-2">BCEWithLogitsLoss Requirements</h4>
               
               <div className="flex gap-4">
                 <div className="flex-1 bg-white p-4 rounded-xl border shadow-sm">
                   <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2 block">Predictions (Model Output)</span>
                   <ul className="text-sm text-slate-700 space-y-2 list-disc ml-4">
                     <li>Shape: <code>(Batch, *)</code></li>
                     <li>Type: <code>Float</code></li>
                     <li>Data: <strong>Raw, unnormalized Logits.</strong></li>
                   </ul>
                 </div>
                 <div className="flex-1 bg-white p-4 rounded-xl border shadow-sm">
                   <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Targets (Ground Truth)</span>
                   <ul className="text-sm text-slate-700 space-y-2 list-disc ml-4">
                     <li>Shape: <strong>Exactly matches predictions.</strong></li>
                     <li>Type: <code>Float</code></li>
                     <li>Data: Probabilities (0.0 or 1.0).</li>
                   </ul>
                 </div>
               </div>

               <div className="bg-rose-100 border border-rose-300 p-4 rounded-xl flex items-start gap-4">
                 <ShieldAlert className="text-rose-600 shrink-0 mt-1"/>
                 <div>
                   <h5 className="font-bold text-rose-900 text-sm mb-1">Common Silent Failure</h5>
                   <p className="text-xs text-rose-800 leading-relaxed">
                     Applying a <code>nn.Sigmoid()</code> layer at the end of your model. BCEWithLogitsLoss includes a mathematically stable sigmoid layer internally. Double-applying it squashes gradients and halts learning.
                   </p>
                 </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// --- Slide 4: Gradient Flow Issues ---
function GradientFlowSlide() {
  const [issue, setIssue] = useState('none');

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Gradient Flow Issues</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          If your model's performance isn't improving, or <code>.grad</code> attributes remain <code>None</code> after <code>backward()</code>, the computation graph has been broken.
        </p>

        <div className="flex flex-col gap-3 mb-6">
          <button onClick={() => setIssue('none')} className={`p-3 border-2 rounded-xl text-left transition-colors ${issue === 'none' ? 'bg-emerald-50 border-emerald-500 shadow-md' : 'bg-white border-slate-200'}`}>
            <h4 className="font-bold text-slate-800 text-sm">Healthy Graph</h4>
          </button>
          <button onClick={() => setIssue('numpy')} className={`p-3 border-2 rounded-xl text-left transition-colors ${issue === 'numpy' ? 'bg-rose-50 border-rose-500 shadow-md' : 'bg-white border-slate-200'}`}>
            <h4 className="font-bold text-slate-800 text-sm">Error: Using .numpy()</h4>
            <p className="text-xs text-slate-500 mt-1">Converting a tensor to NumPy detaches it completely.</p>
          </button>
          <button onClick={() => setIssue('detach')} className={`p-3 border-2 rounded-xl text-left transition-colors ${issue === 'detach' ? 'bg-rose-50 border-rose-500 shadow-md' : 'bg-white border-slate-200'}`}>
            <h4 className="font-bold text-slate-800 text-sm">Error: Accidental .detach()</h4>
            <p className="text-xs text-slate-500 mt-1">Explicitly severing the connection during the forward pass.</p>
          </button>
          <button onClick={() => setIssue('inplace')} className={`p-3 border-2 rounded-xl text-left transition-colors ${issue === 'inplace' ? 'bg-rose-50 border-rose-500 shadow-md' : 'bg-white border-slate-200'}`}>
            <h4 className="font-bold text-slate-800 text-sm">Error: In-Place Ops</h4>
            <p className="text-xs text-slate-500 mt-1">Using <code>+=</code> or <code>.add_()</code> can overwrite data needed for backprop.</p>
          </button>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col items-center justify-center flex-1 relative overflow-hidden min-h-[350px]">
         <h4 className="absolute top-4 left-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Computation Graph Link</h4>

         <div className="flex flex-col items-center gap-4 w-full">
            
            <div className="w-48 bg-blue-100 border border-blue-400 p-3 rounded-lg text-center shadow-sm relative z-10">
              <span className="font-mono text-sm font-bold text-blue-900">Weights (Leaf)</span>
            </div>

            <div className="h-16 w-1 bg-slate-300 relative">
               <div className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 transition-all duration-500 ${issue === 'none' ? 'bg-emerald-500' : 'bg-rose-500 h-1/2'}`}></div>
               {issue !== 'none' && <XCircle size={32} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-rose-500 bg-white rounded-full z-20 animate-in zoom-in" />}
            </div>

            <div className={`w-48 p-3 rounded-lg text-center shadow-sm relative z-10 transition-colors duration-500 border ${issue === 'none' ? 'bg-white border-slate-300' : 'bg-rose-100 border-rose-400'}`}>
              <span className={`font-mono text-sm font-bold ${issue === 'none' ? 'text-slate-700' : 'text-rose-900'}`}>
                {issue === 'none' ? 'Intermediate Tensor' : 
                 issue === 'numpy' ? 'y = x.numpy()' :
                 issue === 'detach' ? 'y = x.detach()' :
                 'x += 1 (In-Place)'}
              </span>
            </div>

            <div className="h-16 w-1 bg-slate-300 relative">
               <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-slate-400"></div>
               {/* Backward Arrow visualization */}
               {issue === 'none' && (
                 <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-b-[8px] border-l-[6px] border-r-[6px] border-b-emerald-500 border-l-transparent border-r-transparent animate-[ping_1.5s_infinite]"></div>
               )}
            </div>

            <div className="w-48 bg-amber-100 border border-amber-400 p-3 rounded-[100%] text-center shadow-sm relative z-10">
              <span className="font-mono text-sm font-bold text-amber-900">Loss</span>
            </div>
         </div>

         {issue !== 'none' && (
           <div className="mt-8 bg-rose-50 border border-rose-200 px-4 py-2 rounded-lg text-xs text-rose-800 font-bold text-center animate-in slide-in-from-bottom-2">
             loss.backward() fails to reach the weights. <br/>Weights will not update!
           </div>
         )}
      </div>
    </div>
  );
}

// --- Slide 5: Data Loading Errors ---
function DataLoadingSlide() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <h3 className="text-xl font-bold mb-4">Data Loading and Preprocessing Errors</h3>
      <p className="text-slate-600 mb-6 leading-relaxed text-sm">
        Bugs can originate directly in your custom <code>Dataset</code> implementation or your <code>transform</code> pipelines. These often cause the <code>DataLoader</code> to crash when constructing batches.
      </p>

      <div className="grid md:grid-cols-3 gap-6 flex-1">
        
        {/* Error 1 */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm hover:border-amber-400 transition-colors flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Code size={20} /></div>
            <h4 className="font-bold text-slate-800 text-sm">Incorrect __getitem__ Return Type</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-1">
            If your <code>__getitem__</code> returns NumPy arrays or raw PIL Images instead of PyTorch Tensors, the DataLoader's default batch collator will crash trying to stack them.
          </p>
          <div className="bg-slate-100 p-3 rounded font-mono text-[10px] text-rose-600 font-bold border border-slate-200">
            TypeError: batch must contain tensors, numbers, dicts or lists
          </div>
        </div>

        {/* Error 2 */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm hover:border-amber-400 transition-colors flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Layers size={20} /></div>
            <h4 className="font-bold text-slate-800 text-sm">Inconsistent Tensor Sizes</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-1">
            To form a batch of e.g. 32 items, all 32 tensors must have the <strong>exact same dimensions</strong>. If your dataset contains images of varying sizes and you forgot to add a <code>Resize</code> transform, it will crash.
          </p>
          <div className="bg-slate-100 p-3 rounded font-mono text-[10px] text-rose-600 font-bold border border-slate-200">
            RuntimeError: stack expects each tensor to be equal size
          </div>
        </div>

        {/* Error 3 */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm hover:border-amber-400 transition-colors flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Activity size={20} /></div>
            <h4 className="font-bold text-slate-800 text-sm">Transform Order Errors</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-1">
            Applying transforms in the wrong order inside <code>transforms.Compose</code>. For example, trying to apply <code>Normalize</code> (which requires a Tensor) before <code>ToTensor()</code> (while it's still a PIL image).
          </p>
          <div className="bg-slate-100 p-3 rounded font-mono text-[10px] text-rose-600 font-bold border border-slate-200">
            TypeError: img should be Tensor Image. Got &lt;class 'PIL.Image.Image'&gt;
          </div>
        </div>

      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-4 shadow-sm">
         <Crosshair className="flex-shrink-0 mt-0.5 text-amber-500" />
         <div>
           <h4 className="text-sm font-bold text-amber-900 mb-1">Debugging Pro-Tip</h4>
           <p className="text-xs text-amber-800 leading-relaxed">
             Never test your Dataset directly in the DataLoader loop initially. Instantiate your Dataset, manually grab the first item (<code>sample = dataset[0]</code>), and print its <code>type()</code> and <code>.shape</code> to verify correctness before letting the DataLoader attempt to batch them!
           </p>
         </div>
      </div>
    </div>
  );
}