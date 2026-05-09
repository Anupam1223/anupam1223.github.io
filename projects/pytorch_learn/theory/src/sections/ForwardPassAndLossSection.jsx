import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, ChevronLeft, ChevronRight, Code, Terminal, 
  Cpu, Zap, AlertTriangle, CheckCircle2, Target,
  ArrowRight, Layers, FunctionSquare, Activity
} from 'lucide-react';

export default function ForwardPassLossSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'forward', title: 'The Forward Pass', component: ForwardPassSlide },
    { id: 'device', title: 'Device Synchronization', component: DeviceSyncSlide },
    { id: 'loss_fns', title: 'Quantifying Error (Loss)', component: LossFunctionsSlide },
    { id: 'graph', title: 'The Computational Graph Link', component: GraphLinkSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <PlayCircle size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Forward Pass & Calculating Loss</h2>
        <p className="text-slate-400 text-sm mb-4">Generating predictions and quantifying network error</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-sky-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-sky-400 whitespace-nowrap font-bold' : 'hidden md:inline whitespace-nowrap'}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: The Forward Pass (Screenshot Diagram Recreation) ---
function ForwardPassSlide() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timer;
    if (step > 0 && step < 4) {
      timer = setTimeout(() => {
        setStep(s => s + 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [step]);

  const pyCode = `# Assume 'model' is an instance of your nn.Module subclass
# Assume 'data_batch' is loaded from the DataLoader
# Assume 'device' is defined (e.g., 'cuda' or 'cpu')

# 1. Unpack the batch
inputs, labels = data_batch

# 2. Move data to the correct device
inputs = inputs.to(device) 
labels = labels.to(device)

# --- The Forward Pass ---
# Pass inputs through the model by calling it like a function
outputs = model(inputs)
# -----------------------

# 'outputs' now contains the model's predictions.
# Classification: Often raw scores called 'logits'
# Regression: Continuous predicted values`;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="flex justify-between items-start mb-4">
        <div className="max-w-2xl">
          <h3 className="text-xl font-bold mb-2">The Forward Pass: Getting Predictions</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            The forward pass is the initial operational step within each iteration. PyTorch's <code>nn.Module</code> provides a <code>__call__</code> method, allowing you to pass inputs directly into the model instance (<code>model(inputs)</code>), which implicitly executes your defined <code>forward</code> logic.
          </p>
        </div>
        <button 
          onClick={() => setStep(step === 0 || step === 4 ? 1 : 0)} 
          className="px-6 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-bold shadow hover:bg-sky-700 transition-all flex items-center gap-2 shrink-0"
        >
          {step === 0 || step === 4 ? "Run Forward Pass" : "Reset Pass"} <PlayCircle size={18} />
        </button>
      </div>

      {/* Diagram Area - Recreation of Screenshot */}
      <div className="bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-0 relative overflow-hidden shadow-sm min-h-[300px] mb-6">
        
        {/* Main Diagram Area (White background) */}
        <div className="w-full flex-1 flex flex-col items-center justify-center pt-10 pb-6 overflow-x-auto">
          <div className="flex items-center min-w-max relative px-10">
            
            {/* Box 1: DataLoader Batch */}
            <div className={`w-[160px] h-[70px] bg-[#bce0fd] border border-black flex flex-col items-center justify-center text-sm font-sans text-slate-800 shadow-sm relative z-10 transition-all duration-300 ${step === 1 ? 'ring-4 ring-sky-400 scale-105' : ''}`}>
              <span>DataLoader Batch</span>
              <span>(inputs, labels)</span>
            </div>

            {/* Arrow 1 */}
            <div className="flex flex-col items-center relative w-[160px]">
              <span className="absolute -top-10 text-xs font-sans text-slate-800 text-center leading-tight">Extract &<br/>Move to Device</span>
              <div className="w-full relative h-4 flex items-center">
                <div className="w-full h-[1.5px] bg-black"></div>
                <div className="absolute right-0 w-0 h-0 border-t-[5px] border-b-[5px] border-l-[8px] border-t-transparent border-b-transparent border-l-black"></div>
                {/* Animated Dot */}
                <div className={`absolute w-3 h-3 bg-sky-500 rounded-full transition-all duration-1000 ease-in-out ${step >= 1 ? 'left-[140px] opacity-100' : 'left-0 opacity-0'} ${step > 1 ? 'opacity-0' : ''}`}></div>
              </div>
            </div>

            {/* Box 2: inputs */}
            <div className={`w-[120px] h-[70px] bg-[#c4c4ff] border border-black flex flex-col items-center justify-center text-sm font-sans text-slate-800 shadow-sm relative z-10 transition-all duration-300 ${step === 2 ? 'ring-4 ring-sky-400 scale-105' : ''}`}>
              <span>inputs</span>
              <span>(on device)</span>
            </div>

            {/* Arrow 2 */}
            <div className="flex flex-col items-center relative w-[160px]">
              <span className="absolute -top-6 text-xs font-sans text-slate-800 text-center">Feed Forward</span>
              <div className="w-full relative h-4 flex items-center">
                <div className="w-full h-[1.5px] bg-black"></div>
                <div className="absolute right-0 w-0 h-0 border-t-[5px] border-b-[5px] border-l-[8px] border-t-transparent border-b-transparent border-l-black"></div>
                {/* Animated Dot */}
                <div className={`absolute w-3 h-3 bg-sky-500 rounded-full transition-all duration-1000 ease-in-out ${step >= 2 ? 'left-[140px] opacity-100' : 'left-0 opacity-0'} ${step > 2 ? 'opacity-0' : ''}`}></div>
              </div>
            </div>

            {/* Oval: model(inputs) */}
            <div className={`w-[200px] h-[70px] bg-[#d4bfff] rounded-[100%] border border-black flex items-center justify-center text-sm font-sans text-slate-800 shadow-sm relative z-10 transition-all duration-300 ${step === 3 ? 'ring-4 ring-sky-400 scale-105' : ''}`}>
              <span>model(inputs)</span>
            </div>

            {/* Arrow 3 */}
            <div className="flex flex-col items-center relative w-[60px]">
              <div className="w-full relative h-4 flex items-center">
                <div className="w-full h-[1.5px] bg-black"></div>
                <div className="absolute right-0 w-0 h-0 border-t-[5px] border-b-[5px] border-l-[8px] border-t-transparent border-b-transparent border-l-black"></div>
                {/* Animated Dot */}
                <div className={`absolute w-3 h-3 bg-sky-500 rounded-full transition-all duration-1000 ease-in-out ${step >= 3 ? 'left-[40px] opacity-100' : 'left-0 opacity-0'} ${step > 3 ? 'opacity-0' : ''}`}></div>
              </div>
            </div>

            {/* Box 3: outputs */}
            <div className={`w-[180px] h-[70px] bg-[#ffc7ce] border border-black flex flex-col items-center justify-center text-sm font-sans text-slate-800 shadow-sm relative z-10 transition-all duration-300 ${step === 4 ? 'ring-4 ring-rose-400 scale-105' : ''}`}>
              <span>outputs</span>
              <span>(Predictions/Logits)</span>
            </div>

          </div>
        </div>

        {/* Caption Area (Dark background) */}
        <div className="w-full bg-[#202020] text-[#a4abb6] py-6 px-8 text-center text-sm italic font-sans flex flex-col items-center justify-center border-t-2 border-slate-700">
           <p>Data flow during the forward pass: A batch is loaded, inputs are prepared and sent to the appropriate device, then passed through the model to produce outputs.</p>
        </div>

      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Python Implementation</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
      </div>

    </div>
  );
}

// --- Slide 2: Device Synchronization ---
function DeviceSyncSlide() {
  const [synced, setSynced] = useState(false);
  const [testResult, setTestResult] = useState(null); // 'error' or 'success'

  const handleTest = () => {
    if (synced) {
      setTestResult('success');
    } else {
      setTestResult('error');
    }
  };

  return (
    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Device Synchronization</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          It is absolutely critical that your input data and your model parameters reside on the <strong>same computational device</strong> (e.g., both on the CPU, or both on the same GPU). If they do not match, PyTorch will immediately raise a runtime error during the forward pass.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col items-center flex-1 relative overflow-hidden min-h-[300px]">
          
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 w-full text-center">Interactive Device Simulation</h4>
          
          <div className="flex w-full justify-center gap-12 items-center relative z-10">
             
             {/* The Inputs (starts on CPU) */}
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">Input Batch</span>
                <div className={`p-4 rounded-xl border-4 flex flex-col items-center shadow-md transition-all duration-500 ${synced ? 'bg-amber-100 border-amber-400 text-amber-900 translate-x-[70px] z-20' : 'bg-blue-100 border-blue-400 text-blue-900 z-10'}`}>
                   <Layers size={24} className="mb-2" />
                   <span className="font-mono font-bold text-sm">inputs</span>
                   <span className={`text-[10px] mt-1 px-2 rounded font-bold ${synced ? 'bg-amber-200' : 'bg-blue-200'}`}>
                     Device: {synced ? 'cuda:0' : 'cpu'}
                   </span>
                </div>
             </div>

             {/* The Model (always on GPU) */}
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">Neural Network</span>
                <div className="bg-amber-100 border-4 border-amber-400 text-amber-900 p-4 rounded-xl flex flex-col items-center shadow-md z-0">
                   <Zap size={24} className="mb-2" />
                   <span className="font-mono font-bold text-sm">model</span>
                   <span className="text-[10px] mt-1 px-2 bg-amber-200 rounded font-bold">
                     Device: cuda:0
                   </span>
                </div>
             </div>
          </div>

          <div className="mt-8 w-full max-w-sm flex flex-col gap-3 z-10">
             <button 
               onClick={() => { setSynced(true); setTestResult(null); }}
               className={`py-2 text-sm font-bold border-2 rounded-lg transition-colors ${synced ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm' : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'}`}
             >
               Apply: <code>inputs = inputs.to('cuda')</code>
             </button>
             <button 
               onClick={handleTest}
               className="py-2 text-sm font-bold bg-slate-800 text-white rounded-lg shadow-md hover:bg-slate-700 flex items-center justify-center gap-2"
             >
               Execute: <code>model(inputs)</code> <PlayCircle size={16}/>
             </button>
          </div>

          {/* Test Results */}
          <div className="mt-6 w-full h-24 flex items-center justify-center">
             {testResult === 'error' && (
               <div className="animate-in zoom-in fade-in bg-rose-100 border border-rose-300 text-rose-800 p-3 rounded-lg flex items-center gap-3 w-full shadow-lg">
                 <AlertTriangle size={24} className="text-rose-600 shrink-0"/>
                 <span className="font-mono text-[10px] font-bold leading-tight">RuntimeError: Expected all tensors to be on the same device, but found at least two devices, cuda:0 and cpu!</span>
               </div>
             )}
             {testResult === 'success' && (
               <div className="animate-in zoom-in fade-in bg-emerald-100 border border-emerald-300 text-emerald-800 p-3 rounded-lg flex items-center gap-3 w-full shadow-lg justify-center">
                 <CheckCircle2 size={24} className="text-emerald-600 shrink-0"/>
                 <span className="font-sans text-sm font-bold leading-tight">Forward Pass Successful!</span>
               </div>
             )}
          </div>

        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[300px] flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2"><Activity size={16} className="text-sky-400" /> <span className="font-semibold uppercase text-sky-400 font-sans text-xs">Standard Practice</span></div>
          <p className="text-slate-300 text-xs leading-relaxed font-sans">
            It is standard practice to detect the device dynamically at the start of your script, move the model to it once, and then move every incoming batch from the DataLoader to that same device inside the training loop.
            <br/><br/>
            <code className="bg-slate-800 px-2 py-1 rounded text-sky-300 border border-slate-700">device = "cuda" if torch.cuda.is_available() else "cpu"</code>
            <br/><br/>
            Failure to synchronize hardware devices is one of the most common runtime errors for PyTorch beginners!
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Loss Functions (Quantifying Error) ---
function LossFunctionsSlide() {
  const [view, setView] = useState('ce'); // 'mse', 'ce', 'bce'

  const content = {
    'mse': {
      title: 'nn.MSELoss (Mean Squared Error)',
      desc: 'Used for Regression tasks (predicting continuous numerical values like price, temperature, or coordinates). It calculates the average squared difference between predictions and targets.',
      math: 'L_{MSE} = \\frac{1}{N} \\sum_{i=1}^{N} (y_i - \\hat{y}_i)^2',
      input: 'Continuous floating-point predictions.',
      target: 'Continuous floating-point ground truth values.'
    },
    'ce': {
      title: 'nn.CrossEntropyLoss',
      desc: 'The absolute standard for Multi-Class Classification. It efficiently combines nn.LogSoftmax and nn.NLLLoss in a single, numerically stable step.',
      math: 'Applies Softmax, then computes Negative Log Likelihood',
      input: 'Raw, unnormalized scores called LOGITS. Do NOT manually apply Softmax to the model output!',
      target: 'Class indices (integers from 0 to C-1) as a LongTensor.'
    },
    'bce': {
      title: 'nn.BCEWithLogitsLoss',
      desc: 'Used for Binary Classification or Multi-Label Classification. Combines a Sigmoid layer and Binary Cross Entropy loss in one step for better stability.',
      math: 'Applies Sigmoid, then computes Binary Cross Entropy',
      input: 'Raw logits. Do NOT manually apply Sigmoid to the model output!',
      target: 'Float probabilities (usually 0.0 or 1.0) matching the prediction shape.'
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Quantifying Model Error</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          To assess how accurately the forward pass predictions align with actual ground truth labels, we use a <strong>Loss Function</strong> (or criterion). The goal of training is to minimize this value.
        </p>

        <div className="flex flex-col gap-3 mb-6">
          <button 
            onClick={() => setView('ce')}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'ce' ? 'bg-rose-50 border-rose-400 shadow-md' : 'bg-white border-slate-200 hover:border-rose-300'}`}
          >
            <span className={`font-bold text-sm ${view === 'ce' ? 'text-rose-900' : 'text-slate-700'}`}>CrossEntropyLoss</span>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold uppercase">Multi-Class</span>
          </button>

          <button 
            onClick={() => setView('bce')}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'bce' ? 'bg-rose-50 border-rose-400 shadow-md' : 'bg-white border-slate-200 hover:border-rose-300'}`}
          >
            <span className={`font-bold text-sm ${view === 'bce' ? 'text-rose-900' : 'text-slate-700'}`}>BCEWithLogitsLoss</span>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold uppercase">Binary</span>
          </button>

          <button 
            onClick={() => setView('mse')}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'mse' ? 'bg-rose-50 border-rose-400 shadow-md' : 'bg-white border-slate-200 hover:border-rose-300'}`}
          >
            <span className={`font-bold text-sm ${view === 'mse' ? 'text-rose-900' : 'text-slate-700'}`}>MSELoss</span>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold uppercase">Regression</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        
        {/* Dynamic Detail Panel */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-inner flex flex-col flex-1 relative overflow-y-auto">
          
          <div key={view} className="animate-in slide-in-from-right-4 fade-in duration-300 h-full flex flex-col">
             <h4 className="text-2xl font-bold text-rose-900 mb-2 border-b-2 border-rose-200 pb-4 flex items-center gap-2">
               <Target size={24} className="text-rose-500" />
               {content[view].title}
             </h4>
             <p className="text-slate-700 text-sm leading-relaxed mb-6 mt-4">
               {content[view].desc}
             </p>

             <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center mb-6 flex items-center justify-center font-serif text-lg text-slate-800 min-h-[80px]">
               {/* Simplified Math display without external libraries */}
               {view === 'mse' && <span>L<sub>MSE</sub> = <span className="text-2xl">1/N ∑ (y - ŷ)²</span></span>}
               {view !== 'mse' && <span className="text-rose-700 font-bold">{content[view].math}</span>}
             </div>

             <div className="grid grid-cols-2 gap-4 mt-auto">
               <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm">
                 <span className="block text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">Expects Inputs (Predictions)</span>
                 <p className="text-xs text-blue-900 font-bold">{content[view].input}</p>
               </div>
               <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl shadow-sm">
                 <span className="block text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Expects Targets (Ground Truth)</span>
                 <p className="text-xs text-emerald-900 font-bold">{content[view].target}</p>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Slide 4: The Computational Graph Link ---
function GraphLinkSlide() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">The Computational Graph Connection</h3>
        <p className="text-slate-600 text-sm leading-relaxed max-w-4xl">
          When you compute <code>loss = criterion(outputs, labels)</code>, the resulting <code>loss</code> variable is not just a simple Python float. It is a PyTorch Scalar Tensor that maintains a direct lifeline back to the entire computational graph built during the forward pass.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8 flex-1">
        
        {/* Core Concepts */}
        <div className="flex flex-col gap-4 justify-center">
           <div className="bg-sky-50 border-l-4 border-sky-500 p-4 shadow-sm rounded-r-xl">
             <h4 className="font-bold text-sky-900 text-sm mb-1">1. Scalar Tensor</h4>
             <p className="text-xs text-sky-800 leading-relaxed">It is a zero-dimensional tensor representing the average error over the entire batch.</p>
           </div>
           
           <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 shadow-sm rounded-r-xl">
             <h4 className="font-bold text-indigo-900 text-sm mb-1">2. Graph Memory</h4>
             <p className="text-xs text-indigo-800 leading-relaxed">It remembers exactly which mathematical operations and model parameters (weights/biases) contributed to its final value.</p>
           </div>

           <div className="bg-rose-50 border-l-4 border-rose-500 p-4 shadow-sm rounded-r-xl">
             <h4 className="font-bold text-rose-900 text-sm mb-1">3. Gradient Ready</h4>
             <p className="text-xs text-rose-800 leading-relaxed">Because of this link, it implicitly has <code>requires_grad=True</code>. This is the entire reason we can call <code>loss.backward()</code> to trigger backpropagation!</p>
           </div>
        </div>

        {/* Interactive Visualizer */}
        <div className="bg-slate-900 border-4 border-slate-800 rounded-2xl p-6 shadow-inner flex flex-col items-center justify-center relative overflow-hidden min-h-[350px]">
           
           <h4 className="absolute top-4 left-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Memory Graph Visualized</h4>

           <div className="flex items-center gap-6 mt-6">
              
              {/* Network Parameters */}
              <div className="flex flex-col items-center gap-2">
                 <span className="text-[10px] text-slate-400 font-bold uppercase">Model Parameters</span>
                 <div className="bg-slate-800 border-2 border-slate-600 p-3 rounded-xl flex flex-col gap-2 shadow-lg">
                   <div className="bg-slate-700 text-slate-300 font-mono text-[10px] px-2 py-1 rounded">layer1.weight</div>
                   <div className="bg-slate-700 text-slate-300 font-mono text-[10px] px-2 py-1 rounded">layer1.bias</div>
                   <div className="bg-slate-700 text-slate-300 font-mono text-[10px] px-2 py-1 rounded">layer2.weight</div>
                 </div>
              </div>

              {/* Graph Link Arrow */}
              <div className="flex flex-col items-center relative w-24">
                 <span className="absolute -top-6 text-[10px] text-rose-400 font-bold uppercase whitespace-nowrap bg-rose-900/30 px-2 py-0.5 rounded border border-rose-800/50">loss.backward()</span>
                 <div className="w-full relative h-2">
                   <div className="absolute top-1/2 left-0 w-full h-[2px] bg-rose-500 -translate-y-1/2 border-dashed"></div>
                   {/* Backward pointing arrows */}
                   <div className="absolute left-2 top-1/2 w-0 h-0 border-t-[4px] border-b-[4px] border-r-[6px] border-t-transparent border-b-transparent border-r-rose-500 -translate-y-1/2"></div>
                   <div className="absolute left-10 top-1/2 w-0 h-0 border-t-[4px] border-b-[4px] border-r-[6px] border-t-transparent border-b-transparent border-r-rose-500 -translate-y-1/2"></div>
                   <div className="absolute left-18 top-1/2 w-0 h-0 border-t-[4px] border-b-[4px] border-r-[6px] border-t-transparent border-b-transparent border-r-rose-500 -translate-y-1/2"></div>
                 </div>
                 <span className="absolute -bottom-6 text-[9px] text-slate-500 font-mono">grad_fn tracked</span>
              </div>

              {/* The Loss Scalar */}
              <div className="flex flex-col items-center gap-2">
                 <span className="text-[10px] text-rose-400 font-bold uppercase">Scalar Tensor</span>
                 <div className="bg-rose-100 border-4 border-rose-500 p-4 rounded-[100%] shadow-[0_0_15px_rgba(244,63,94,0.5)] flex flex-col items-center justify-center w-24 h-24 animate-pulse">
                   <span className="font-mono text-sm font-bold text-rose-900">loss</span>
                   <span className="font-mono text-lg font-black text-rose-600">2.418</span>
                 </div>
              </div>

           </div>

           <div className="mt-10 bg-slate-800 border border-slate-700 p-4 rounded-xl w-full max-w-md">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 border-b border-slate-700 pb-1">Under the hood inspect:</span>
             <code className="text-xs text-sky-300 font-mono block">print(loss.item()) <span className="text-slate-500"># Gets the pure Python float: 2.418</span></code>
             <code className="text-xs text-emerald-300 font-mono block mt-1">print(loss.requires_grad) <span className="text-slate-500"># True</span></code>
             <code className="text-xs text-fuchsia-300 font-mono block mt-1">print(loss.grad_fn) <span className="text-slate-500"># &lt;NllLossBackward0 object&gt;</span></code>
           </div>

        </div>
      </div>
    </div>
  );
}