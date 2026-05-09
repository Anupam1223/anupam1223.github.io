import React, { useState, useEffect } from 'react';
import { 
  LineChart, ChevronLeft, ChevronRight, Code, Terminal, 
  GitMerge, ShieldCheck, PlayCircle, Pointer, Activity, 
  AlertTriangle, CheckCircle2, ShieldOff, BrainCircuit, RotateCcw,
  Target, Layers, Zap, XOctagon
} from 'lucide-react';

export default function EvaluationLoopSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'why', title: 'Why Evaluate? (Overfitting)', component: OverfittingSlide },
    { id: 'workflow', title: 'The Training Workflow', component: WorkflowSlide },
    { id: 'mechanics', title: 'Differences & Mechanics', component: MechanicsSlide },
    { id: 'code', title: 'Step-by-Step Code', component: CodeSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <LineChart size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Implementing an Evaluation Loop</h2>
        <p className="text-slate-400 text-sm mb-4">Assessing model generalization and preventing overfitting</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-indigo-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-indigo-400 whitespace-nowrap font-bold' : 'hidden md:inline whitespace-nowrap'}>
              {slide.title}
            </span>
          ))}
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: Why Evaluate? (Overfitting Graph Recreation) ---
function OverfittingSlide() {
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    let interval;
    if (animating) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setAnimating(false);
            return 100;
          }
          return p + 2;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [animating]);

  // SVG Coordinates for the chart
  const trainPath = `M 100,50 Q 150,150 300,220 T 550,260`;
  const valPath = `M 100,30 Q 150,120 300,180 Q 400,200 550,180`;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="flex justify-between items-start mb-4">
        <div className="max-w-3xl">
          <h3 className="text-xl font-bold mb-2">Why a Separate Evaluation Loop?</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Training involves adjusting model parameters based on the training data. Evaluation, however, is purely about assessment: <em>"Given this input, how close is the model's prediction to the actual target?"</em> without changing the model itself.
          </p>
        </div>
        <button 
          onClick={() => setAnimating(true)} 
          disabled={animating}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2 shrink-0"
        >
          {animating ? "Simulating Training..." : "Run Training Simulation"} <PlayCircle size={18} />
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6 flex-1">
        
        {/* The Graph (Screenshot Recreation) */}
        <div className="bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-sm h-full min-h-[300px]">
           <div className="w-full flex-1 relative flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 600 320" className="overflow-visible">
                 {/* Grid Lines */}
                 <line x1="80" y1="280" x2="580" y2="280" stroke="#f1f5f9" strokeWidth="2" />
                 <line x1="80" y1="200" x2="580" y2="200" stroke="#f1f5f9" strokeWidth="2" />
                 <line x1="80" y1="120" x2="580" y2="120" stroke="#f1f5f9" strokeWidth="2" />
                 
                 <line x1="150" y1="30" x2="150" y2="280" stroke="#f1f5f9" strokeWidth="2" />
                 <line x1="250" y1="30" x2="250" y2="280" stroke="#f1f5f9" strokeWidth="2" />
                 <line x1="350" y1="30" x2="350" y2="280" stroke="#f1f5f9" strokeWidth="2" />
                 <line x1="450" y1="30" x2="450" y2="280" stroke="#f1f5f9" strokeWidth="2" />

                 {/* Y Axis Labels */}
                 <text x="60" y="205" fontSize="14" fill="#475569" textAnchor="end">0.5</text>
                 <text x="60" y="125" fontSize="14" fill="#475569" textAnchor="end">1.0</text>
                 <text x="60" y="45" fontSize="14" fill="#475569" textAnchor="end">1.5</text>

                 {/* X Axis Labels */}
                 <text x="150" y="300" fontSize="14" fill="#475569" textAnchor="middle">2</text>
                 <text x="250" y="300" fontSize="14" fill="#475569" textAnchor="middle">4</text>
                 <text x="350" y="300" fontSize="14" fill="#475569" textAnchor="middle">6</text>
                 <text x="450" y="300" fontSize="14" fill="#475569" textAnchor="middle">8</text>
                 <text x="550" y="300" fontSize="14" fill="#475569" textAnchor="middle">10</text>

                 {/* Legend */}
                 <rect x="420" y="30" width="140" height="60" fill="white" stroke="#e2e8f0" rx="4" />
                 <line x1="430" y1="45" x2="460" y2="45" stroke="#3b82f6" strokeWidth="3" />
                 <text x="470" y="50" fontSize="12" fill="#334155">Training Loss</text>
                 <line x1="430" y1="70" x2="460" y2="70" stroke="#f97316" strokeWidth="3" />
                 <text x="470" y="75" fontSize="12" fill="#334155">Validation Loss</text>

                 {/* Data Paths */}
                 <path d={trainPath} fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="1000" strokeDashoffset={1000 - (progress / 100) * 1000} />
                 <path d={valPath} fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="1000" strokeDashoffset={1000 - (progress / 100) * 1000} />

                 {/* Overfitting Highlight Zone */}
                 {progress > 80 && (
                   <g className="animate-in fade-in duration-700">
                     <rect x="350" y="30" width="200" height="250" fill="#f43f5e" opacity="0.05" />
                     <text x="450" y="140" fontSize="14" fill="#e11d48" fontWeight="bold" textAnchor="middle">Overfitting Zone</text>
                     <path d="M 380 185 L 380 150" stroke="#e11d48" strokeWidth="2" markerEnd="url(#arrowRed)" />
                     <path d="M 380 230 L 380 260" stroke="#e11d48" strokeWidth="2" markerEnd="url(#arrowRed)" />
                     <text x="360" y="210" fontSize="10" fill="#e11d48" fontWeight="bold" transform="rotate(-90 360 210)">Divergence</text>
                   </g>
                 )}
                 <defs>
                   <marker id="arrowRed" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                     <polygon points="0 0, 6 2, 0 4" fill="#e11d48" />
                   </marker>
                 </defs>
              </svg>
           </div>

           {/* Caption (matching screenshot) */}
           <div className="w-full bg-[#202020] text-slate-300 p-3 text-center text-xs italic border-t-4 border-slate-700 mt-2">
              <p>This chart illustrates a common scenario where validation loss starts increasing after some epochs, indicating the onset of overfitting, even as training loss continues to decrease.</p>
           </div>
        </div>

        {/* Info Cards */}
        <div className="flex flex-col gap-3 h-full overflow-y-auto">
           <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl shadow-sm">
             <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-widest mb-1 flex items-center gap-1"><Target size={14}/> Generalization Assessment</h4>
             <p className="text-[10px] text-emerald-800 leading-relaxed">Measures the ability to handle data it hasn't encountered during training, the ultimate goal of ML.</p>
           </div>
           <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl shadow-sm">
             <h4 className="font-bold text-indigo-900 text-xs uppercase tracking-widest mb-1 flex items-center gap-1"><Activity size={14}/> Model Selection</h4>
             <p className="text-[10px] text-indigo-800 leading-relaxed">Performance on validation is used to choose architecture, tune hyperparameters, or apply early stopping.</p>
           </div>
           <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl shadow-sm">
             <h4 className="font-bold text-rose-900 text-xs uppercase tracking-widest mb-1 flex items-center gap-1"><AlertTriangle size={14}/> Detecting Overfitting</h4>
             <p className="text-[10px] text-rose-800 leading-relaxed">Identifies when a model learns the training data's noise too well and loses the ability to generalize.</p>
           </div>
           <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl shadow-sm">
             <h4 className="font-bold text-amber-900 text-xs uppercase tracking-widest mb-1 flex items-center gap-1"><ShieldCheck size={14}/> Preventing Data Leakage</h4>
             <p className="text-[10px] text-amber-800 leading-relaxed">A separate dataset ensures evaluation information doesn't inadvertently influence gradient updates.</p>
           </div>
        </div>

      </div>
    </div>
  );
}

// --- Slide 2: The Training Workflow (Flowchart Recreation) ---
function WorkflowSlide() {
  const [animating, setAnimating] = useState(false);
  const [step, setStep] = useState(0); // 0: Train, 1: Eval, 2: Log, 3: Check, 4: Loop/Stop

  useEffect(() => {
    let interval;
    if (animating) {
      interval = setInterval(() => {
        setStep(s => {
          if (s >= 4) return 0;
          return s + 1;
        });
      }, 1200);
    } else {
      setStep(0);
    }
    return () => clearInterval(interval);
  }, [animating]);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2">The Standard Workflow</h3>
          <p className="text-slate-600 text-sm">Where the Evaluation Loop fits into the broader training cycle.</p>
        </div>
        <button 
          onClick={() => setAnimating(!animating)} 
          className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow transition-all flex items-center gap-2 shrink-0 ${animating ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
        >
          {animating ? "Stop Workflow" : "Animate Workflow"} <PlayCircle size={18} />
        </button>
      </div>

      <div className="bg-[#202020] border border-slate-700 rounded-2xl flex flex-col items-center justify-start relative overflow-x-auto overflow-y-hidden shadow-inner flex-1 min-h-[550px] py-6">
         
         <div className="bg-white w-full min-w-[480px] max-w-[500px] h-[600px] relative shadow-2xl flex flex-col items-center py-6 scale-[0.85] sm:scale-95 md:scale-100 origin-top">
            
            {/* 1. Training Epoch (Blue) */}
            <div className={`w-[320px] h-[60px] bg-[#4a9deb] rounded-2xl flex flex-col items-center justify-center text-white shadow-md z-10 transition-all duration-300 ${step === 0 && animating ? 'ring-4 ring-blue-300 scale-105' : ''}`}>
              <span className="font-sans text-sm font-bold">Run Training Epoch</span>
              <span className="font-sans text-[11px]">(Forward, Loss, Backward, Optimize)</span>
            </div>

            {/* Arrow Down 1 */}
            <div className="w-[2px] h-[30px] bg-[#475569] relative z-0">
               <div className="absolute -bottom-1 -left-1 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-t-[#475569] border-l-transparent border-r-transparent"></div>
               {step === 0 && animating && <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-indigo-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>}
            </div>
            <span className="absolute top-[85px] right-[150px] text-[10px] font-sans text-slate-800">End of Epoch</span>

            {/* 2. Eval Loop (Orange) */}
            <div className={`w-[360px] h-[60px] bg-[#f89b4f] rounded-2xl flex flex-col items-center justify-center text-white shadow-md z-10 transition-all duration-300 ${step === 1 && animating ? 'ring-4 ring-orange-300 scale-105' : ''}`}>
              <span className="font-sans text-sm font-bold">Run Evaluation Loop</span>
              <span className="font-sans text-[11px]">(model.eval(), no_grad, Forward, Metrics)</span>
            </div>

            {/* Arrow Down 2 */}
            <div className="w-[2px] h-[30px] bg-[#475569] relative z-0 -translate-x-[60px]">
               <div className="absolute -bottom-1 -left-1 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-t-[#475569] border-l-transparent border-r-transparent"></div>
               {step === 1 && animating && <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-indigo-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>}
            </div>

            {/* 3. Log Metrics (White/Purple) */}
            <div className={`w-[300px] h-[50px] bg-white border border-[#7a6df3] rounded-2xl flex flex-col items-center justify-center text-slate-800 shadow-sm z-10 -translate-x-[60px] transition-all duration-300 ${step === 2 && animating ? 'ring-4 ring-purple-200 scale-105' : ''}`}>
              <span className="font-sans text-sm font-bold">Log Training & Validation Metrics</span>
            </div>

            {/* Arrow Down 3 (Diagonal right) */}
            <div className="w-[2px] h-[40px] bg-[#475569] relative z-0 transform rotate-[-30deg] translate-x-[-15px] translate-y-[5px]">
               <div className="absolute -bottom-1 -left-1 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-t-[#475569] border-l-transparent border-r-transparent"></div>
               {step === 2 && animating && <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-indigo-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>}
            </div>

            {/* 4. Check Stopping Criteria (Diamond/Green) */}
            <div className="relative w-[460px] h-[80px] flex items-center justify-center z-10 mt-4">
              <svg width="100%" height="100%" className="absolute inset-0">
                 <polygon points="230,0 460,40 230,80 0,40" fill="white" stroke="#4ade80" strokeWidth="2" className={`transition-all duration-300 ${step === 3 && animating ? 'stroke-[4px]' : ''}`} />
              </svg>
              <div className={`flex flex-col items-center justify-center z-20 transition-all ${step === 3 && animating ? 'scale-105' : ''}`}>
                 <span className="font-sans text-sm text-slate-800 font-bold">Check Stopping Criteria</span>
                 <span className="font-sans text-[11px] text-slate-800">(e.g., Max Epochs, Early Stopping)</span>
              </div>
            </div>

            {/* Arrow Up Loop (Continue Training) */}
            <svg className="absolute w-[180px] h-[350px] pointer-events-none" style={{ right: '0px', top: '50px', zIndex: 0 }}>
               <path d="M 60,310 C 160,260 160,80 80,10" fill="none" stroke="#475569" strokeWidth="2" />
               <polygon points="80,10 90,15 86,5" fill="#475569" />
               <text x="90" y="160" fontSize="12" fill="#0f172a" fontFamily="sans-serif">Continue Training</text>
               {step === 4 && animating && <circle cx="75" cy="10" r="6" fill="#3b82f6" className="animate-ping" />}
            </svg>

            {/* Arrow Down 4 (Stop Training - Red) */}
            <div className="w-[2px] h-[40px] bg-[#ef4444] relative z-0 mt-4">
               <div className="absolute -bottom-1 -left-1 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-t-[#ef4444] border-l-transparent border-r-transparent"></div>
               {step === 4 && animating && <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-indigo-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>}
            </div>
            <span className="absolute bottom-[90px] right-[160px] text-[10px] font-sans text-slate-800">Stop Training</span>

            {/* 5. Training Finished (Red Oval) */}
            <div className={`w-[240px] h-[50px] bg-white border border-[#ef4444] rounded-[100%] flex flex-col items-center justify-center text-slate-800 shadow-sm z-10 transition-all duration-300 ${step === 4 && animating ? 'bg-red-50 ring-4 ring-red-200' : ''}`}>
              <span className="font-sans text-sm font-bold">Training Finished</span>
            </div>

            {/* Caption */}
            <div className="absolute bottom-0 w-full bg-[#202020] text-slate-300 p-4 text-center text-[11px] italic border-t-2 border-slate-700">
               Typical deep learning training workflow incorporating evaluation after each training epoch to monitor performance and make decisions about continuing or stopping training.
            </div>

         </div>

      </div>
    </div>
  );
}

// --- Slide 3: Evaluation Mechanics (eval & no_grad) & Differences ---
function MechanicsSlide() {
  const [mode, setMode] = useState('train'); // 'train' or 'eval'
  const [grad, setGrad] = useState('tracked'); // 'tracked' or 'nograd'

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <h3 className="text-xl font-bold mb-2">Key Differences & Mechanics</h3>
      <p className="text-slate-600 mb-6 leading-relaxed text-sm">
        The evaluation loop shares similarities with training (iterating through data, forward pass), but omits critical learning steps and requires explicit state changes.
      </p>

      <div className="grid md:grid-cols-[1fr_2fr] gap-8 flex-1">
        
        {/* Left: Missing Steps List */}
        <div className="flex flex-col gap-4">
           <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl shadow-sm h-full">
             <h4 className="font-bold text-rose-900 mb-4 border-b border-rose-200 pb-2 flex items-center gap-2"><XOctagon size={18}/> Excluded Steps</h4>
             
             <div className="space-y-4">
               <div>
                 <span className="text-xs font-bold text-rose-800 block line-through mb-1">loss.backward()</span>
                 <p className="text-[10px] text-rose-700"><strong>No Backpropagation.</strong> We are only evaluating, not updating weights, so gradients are not computed.</p>
               </div>
               <div>
                 <span className="text-xs font-bold text-rose-800 block line-through mb-1">optimizer.step()</span>
                 <p className="text-[10px] text-rose-700"><strong>No Optimizer Step.</strong> Model weights remain completely fixed during evaluation.</p>
               </div>
               <div>
                 <span className="text-xs font-bold text-rose-800 block line-through mb-1">optimizer.zero_grad()</span>
                 <p className="text-[10px] text-rose-700"><strong>No Zeroing.</strong> Since we aren't calculating gradients, there is nothing to clear.</p>
               </div>
             </div>
           </div>
        </div>

        {/* Right: State Mechanics */}
        <div className="flex flex-col gap-4">
          
          {/* Layer Behavior Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col flex-1">
             <div className="flex justify-between items-center mb-4">
               <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm"><BrainCircuit size={16} className="text-indigo-500"/> Layer Behavior</h4>
               <button 
                 onClick={() => setMode(mode === 'train' ? 'eval' : 'train')}
                 className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded shadow transition-colors flex items-center gap-1 ${mode === 'train' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}
               >
                 <RotateCcw size={12}/> {mode === 'train' ? 'model.train()' : 'model.eval()'}
               </button>
             </div>

             <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="flex gap-8 items-center mb-4">
                  {/* Input Node */}
                  <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-slate-400"></div>
                  {/* Hidden Nodes (Dropout) */}
                  <div className="flex flex-col gap-2">
                    <div className={`w-6 h-6 rounded-full transition-all duration-500 border-2 flex items-center justify-center font-bold text-rose-800 text-xs ${mode === 'train' ? 'bg-rose-200 border-rose-400 scale-90 opacity-50' : 'bg-indigo-400 border-indigo-600 shadow'}`}>{mode === 'train' && 'X'}</div>
                    <div className="w-6 h-6 rounded-full bg-indigo-400 border-2 border-indigo-600 shadow"></div>
                    <div className={`w-6 h-6 rounded-full transition-all duration-500 border-2 flex items-center justify-center font-bold text-rose-800 text-xs ${mode === 'train' ? 'bg-rose-200 border-rose-400 scale-90 opacity-50' : 'bg-indigo-400 border-indigo-600 shadow'}`}>{mode === 'train' && 'X'}</div>
                  </div>
                  {/* Output Node */}
                  <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-slate-400"></div>
                </div>

                {mode === 'train' ? (
                  <p className="text-[10px] text-slate-600 bg-white p-2 rounded border border-slate-200 text-center shadow-sm animate-in fade-in w-full">
                    <strong>Training Mode:</strong> Dropout kills neurons randomly. BatchNorm updates running statistics.
                  </p>
                ) : (
                  <p className="text-[10px] text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200 text-center shadow-sm animate-in fade-in w-full">
                    <strong>Evaluation Mode:</strong> All neurons active (full predictive power). BatchNorm uses frozen stats for consistency.
                  </p>
                )}
             </div>
          </div>

          {/* Autograd Engine Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col flex-1">
             <div className="flex justify-between items-center mb-4">
               <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm"><GitMerge size={16} className="text-rose-500"/> Autograd Engine</h4>
               <button 
                 onClick={() => setGrad(grad === 'tracked' ? 'nograd' : 'tracked')}
                 className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded shadow transition-colors flex items-center gap-1 ${grad === 'tracked' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}
               >
                 <RotateCcw size={12}/> {grad === 'tracked' ? 'Normal Execution' : 'torch.no_grad()'}
               </button>
             </div>

             <div className="flex-1 flex items-center justify-center gap-4 relative">
                <div className="w-full max-w-[120px] h-20 bg-white border-4 border-slate-300 rounded-xl relative flex flex-col justify-end overflow-hidden shadow-inner">
                   <div className={`w-full bg-rose-400 transition-all duration-700 ease-in-out absolute bottom-0 flex items-center justify-center text-white font-bold text-[10px] ${grad === 'tracked' ? 'h-full' : 'h-0'}`}>
                     {grad === 'tracked' && "VRAM Full"}
                   </div>
                   {grad === 'nograd' && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center animate-in zoom-in">
                       <ShieldOff size={24} className="text-slate-300 mb-1"/>
                       <span className="text-[8px] text-slate-400 font-bold uppercase">Blocked</span>
                     </div>
                   )}
                </div>

                <div className="flex-1">
                  {grad === 'tracked' ? (
                    <p className="text-[10px] text-slate-600 bg-white p-2 rounded border border-slate-200 text-center shadow-sm animate-in fade-in">
                      <strong>Normal:</strong> Stores intermediate activations to compute gradients later. Heavy memory overhead.
                    </p>
                  ) : (
                    <p className="text-[10px] text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200 text-center shadow-sm animate-in fade-in">
                      <strong>No_Grad Context:</strong> Disables graph tracking. Saves memory and makes operations run faster. Prevents accidental backprop.
                    </p>
                  )}
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// --- Slide 4: Evaluation Loop Code ---
function CodeSlide() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: "model.eval()", desc: "Switch the model to evaluation mode. Alerts Dropout and BatchNorm." },
    { title: "Initialize Metrics", desc: "Set up variables to accumulate total loss, correct predictions, and track total samples evaluated." },
    { title: "with torch.no_grad():", desc: "Enter the context where gradients are not computed. Saves memory." },
    { title: "Iterate DataLoader", desc: "Loop over batches provided by the evaluation DataLoader." },
    { title: "Device Placement", desc: "Ensure input data and targets are on the same device as the model." },
    { title: "Forward Pass", desc: "Pass the inputs through the model to get raw output logits." },
    { title: "Calculate Loss", desc: "Compute the loss. Use loss.item() to get the scalar value, and multiply by batch size (inputs.size(0)) to properly accumulate despite variable last batch sizes." },
    { title: "Calculate Metrics", desc: "Use torch.max(outputs, dim=1) to get the index of the highest probability. Compare with true targets and accumulate correct predictions." },
    { title: "Aggregate Results", desc: "Divide accumulated totals by total samples to get final averages for the entire epoch." },
    { title: "model.train()", desc: "If evaluating between epochs, ensure you switch back to training mode before returning!" }
  ];

  return (
    <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full max-h-[500px]">
        <h3 className="text-xl font-bold mb-4">Step-by-Step Code</h3>
        
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col flex-1 overflow-hidden">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200 shrink-0">
             <h4 className="font-bold text-slate-800 text-xs uppercase tracking-widest">Logic Breakdown</h4>
             <button 
                onClick={() => setActiveStep(s => (s + 1) % 10)}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded text-[10px] font-bold shadow hover:bg-indigo-700 transition"
             >
               Next Line &gt;
             </button>
          </div>
          
          <div className="space-y-3 overflow-y-auto pr-2 flex-1 scroll-smooth">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${activeStep === idx ? 'bg-white border-indigo-400 shadow-md scale-[1.02] sticky top-0 bottom-0' : 'bg-transparent border-transparent hover:bg-slate-100'}`}
              >
                <h5 className={`font-bold text-xs md:text-sm mb-1 ${activeStep === idx ? 'text-indigo-700' : 'text-slate-700'}`}>{idx + 1}. {step.title}</h5>
                {activeStep === idx && <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed animate-in slide-in-from-top-1">{step.desc}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[10px] md:text-[11px] text-slate-300 flex-1 overflow-y-auto relative">
          <div className="sticky top-0 bg-slate-900 flex items-center gap-2 mb-4 border-b border-slate-700 pb-2 z-10">
            <Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Python Implementation</span>
          </div>
          <pre className="whitespace-pre-wrap leading-relaxed">
{`def evaluate_model(model, dataloader, criterion, device):
    """Evaluates the model on the provided dataset."""
`}
<span className={`transition-colors duration-300 block ${activeStep === 0 ? 'text-indigo-300 font-bold bg-indigo-900/40 p-1 -mx-1 rounded border border-indigo-700' : ''}`}>
{`    model.eval()  # 1. Set model to evaluation mode`}
</span>
<span className={`transition-colors duration-300 block ${activeStep === 1 ? 'text-indigo-300 font-bold bg-indigo-900/40 p-1 -mx-1 rounded border border-indigo-700' : ''}`}>
{`    total_loss = 0.0
    correct_predictions = 0
    total_samples = 0  # 2. Initialize Metrics`}
</span>
<span className={`transition-colors duration-300 block mt-2 ${activeStep === 2 ? 'text-indigo-300 font-bold bg-indigo-900/40 p-1 -mx-1 rounded border border-indigo-700' : ''}`}>
{`    with torch.no_grad():  # 3. Disable gradient calculations`}
</span>
{`        `}
<span className={`transition-colors duration-300 inline-block w-full ${activeStep === 3 ? 'text-indigo-300 font-bold bg-indigo-900/40 p-1 -mx-1 rounded border border-indigo-700' : ''}`}>
{`for inputs, targets in dataloader: # 4. Iterate DataLoader`}
</span>
{`            `}
<span className={`transition-colors duration-300 inline-block w-full ${activeStep === 4 ? 'text-indigo-300 font-bold bg-indigo-900/40 p-1 -mx-1 rounded border border-indigo-700' : ''}`}>
{`inputs = inputs.to(device)
            targets = targets.to(device) # 5. Device Placement`}
</span>
{`
            `}
<span className={`transition-colors duration-300 inline-block w-full ${activeStep === 5 ? 'text-indigo-300 font-bold bg-indigo-900/40 p-1 -mx-1 rounded border border-indigo-700' : ''}`}>
{`outputs = model(inputs) # 6. Forward pass`}
</span>
{`
            `}
<span className={`transition-colors duration-300 inline-block w-full ${activeStep === 6 ? 'text-indigo-300 font-bold bg-indigo-900/40 p-1 -mx-1 rounded border border-indigo-700' : ''}`}>
{`loss = criterion(outputs, targets)
            # 7. Accumulate batch loss (scaled by batch size)
            total_loss += loss.item() * inputs.size(0)`}
</span>
{`
            `}
<span className={`transition-colors duration-300 inline-block w-full ${activeStep === 7 ? 'text-indigo-300 font-bold bg-indigo-900/40 p-1 -mx-1 rounded border border-indigo-700' : ''}`}>
{`# 8. Calculate accuracy (classification)
            _, predicted_labels = torch.max(outputs, dim=1)
            correct_predictions += (predicted_labels == targets).sum().item()
            total_samples += targets.size(0)`}
</span>
{`
    `}
<span className={`transition-colors duration-300 inline-block w-full mt-2 ${activeStep === 8 ? 'text-indigo-300 font-bold bg-indigo-900/40 p-1 -mx-1 rounded border border-indigo-700' : ''}`}>
{`# 9. Aggregate Results
    average_loss = total_loss / total_samples
    accuracy = correct_predictions / total_samples`}
</span>
{`
    `}
<span className={`transition-colors duration-300 inline-block w-full mt-2 ${activeStep === 9 ? 'text-indigo-300 font-bold bg-indigo-900/40 p-1 -mx-1 rounded border border-indigo-700' : ''}`}>
{`model.train() # 10. Switch back to train mode (Optional)`}
</span>
{`    return average_loss, accuracy`}
          </pre>
        </div>
      </div>
    </div>
  );
}