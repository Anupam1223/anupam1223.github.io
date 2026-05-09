import React, { useState, useEffect } from 'react';
import { 
  Repeat, ChevronLeft, ChevronRight, Code, Terminal, 
  Cpu, Zap, Boxes, PlayCircle, ToggleLeft, ToggleRight,
  ArrowRight, ShieldAlert, CheckCircle2
} from 'lucide-react';

export default function DataIterationSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'iteration', title: 'The Iterator Logic', component: IteratorSlide },
    { id: 'mode', title: 'Training Mode State', component: ModeSlide },
    { id: 'transfer', title: 'Unpack & Transfer', component: TransferSlide },
    { id: 'remainder', title: 'The Remainder Batch', component: RemainderSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Repeat size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Iterating Through Data with DataLoader</h2>
        <p className="text-slate-400 text-sm mb-4">Managing the inner loop: Fetching, unpacking, and transferring data</p>
        
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

// --- Slide 1: The Iterator Logic ---
function IteratorSlide() {
  const [epoch, setEpoch] = useState(1);
  const [batchIdx, setBatchIdx] = useState(0); 

  const advanceSimulation = () => {
    if (batchIdx < 3) {
      setBatchIdx(b => b + 1);
    } else {
      setBatchIdx(0);
      setEpoch(e => e === 3 ? 1 : e + 1);
    }
  };

  const pyCode = `num_epochs = 10 

# OUTER LOOP: Iterate over entire dataset
for epoch in range(num_epochs):
    print(f"Epoch {epoch+1}\\n-------------------------------")

    model.train() # Set training mode

    # INNER LOOP: DataLoader yields one batch at a time
    for batch_idx, data_batch in enumerate(train_dataloader):
        
        # 1. Unpack the batch
        inputs, labels = data_batch

        # 2. Move data to target device
        inputs = inputs.to(device)
        labels = labels.to(device)

        # ... (forward pass, loss, backprop, optimize) ...

        if batch_idx % 100 == 0:
            print(f"  Batch {batch_idx}: [{len(inputs)} samples]")`;

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">The DataLoader Iterator</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          The <code>DataLoader</code> acts as a Python iterable. The standard approach uses a <code>for</code> loop where, in each iteration, the DataLoader yields exactly one batch of data (typically a tuple of features and labels).
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col items-center justify-center flex-1 relative overflow-hidden min-h-[300px]">
           <div className="w-full flex justify-between items-center mb-6">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loop Simulator</span>
             <button onClick={advanceSimulation} className="text-[10px] bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 flex items-center gap-1 font-bold transition-all">
               Run Next Iteration <PlayCircle size={14}/>
             </button>
           </div>

           <div className="w-full flex flex-col gap-6">
              {/* Outer Loop UI */}
              <div className="bg-white border-2 border-indigo-300 p-4 rounded-xl shadow-sm relative">
                <span className="absolute -top-3 left-4 bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 border border-indigo-200 rounded uppercase">Outer Loop (Epochs)</span>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-mono font-bold text-slate-700">Epoch {epoch} / 3</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(e => (
                      <div key={e} className={`w-8 h-2 rounded-full ${epoch >= e ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inner Loop UI */}
              <div className="bg-white border-2 border-emerald-300 p-4 rounded-xl shadow-sm relative ml-8">
                <span className="absolute -top-3 left-4 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-200 rounded uppercase">Inner Loop (DataLoader)</span>
                
                <div className="flex items-center gap-4 mt-4">
                   <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center flex-col shrink-0">
                     <span className="text-[10px] text-slate-500 font-bold uppercase">enumerate</span>
                     <span className="font-mono text-xl font-black text-slate-700">{batchIdx}</span>
                   </div>
                   <ArrowRight size={20} className="text-slate-300 shrink-0"/>
                   <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex flex-col h-16 justify-center relative overflow-hidden">
                     {batchIdx < 4 ? (
                       <div key={`${epoch}-${batchIdx}`} className="animate-in slide-in-from-right fade-in duration-300 flex items-center justify-between px-2">
                         <div className="flex items-center gap-2">
                           <Boxes size={20} className="text-emerald-500"/>
                           <span className="text-xs font-bold text-emerald-800 font-mono">data_batch</span>
                         </div>
                         <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-1 rounded font-bold">Tuple</span>
                       </div>
                     ) : (
                       <div className="flex items-center justify-center h-full">
                         <span className="text-xs font-bold text-slate-400 uppercase">DataLoader Exhausted</span>
                       </div>
                     )}
                   </div>
                </div>

                {/* Batch Progress */}
                <div className="flex gap-1 mt-4">
                  {[0, 1, 2, 3].map(b => (
                    <div key={b} className={`h-1.5 flex-1 rounded-full ${batchIdx > b ? 'bg-emerald-500' : batchIdx === b ? 'bg-emerald-400 animate-pulse' : 'bg-slate-200'}`}></div>
                  ))}
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[400px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: Training Mode State ---
function ModeSlide() {
  const [isTraining, setIsTraining] = useState(true);

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Setting Training Mode</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Before the inner batch loop begins, you MUST call <code>model.train()</code>. Specific neural network layers behave fundamentally differently during training versus evaluation (testing).
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col flex-1 relative min-h-[300px]">
           <div className="w-full flex justify-between items-center mb-6">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Network Behavior Simulator</span>
             <button 
               onClick={() => setIsTraining(!isTraining)}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-sm font-bold text-xs transition-all ${isTraining ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}
             >
               {isTraining ? <ToggleRight size={18}/> : <ToggleLeft size={18}/>}
               {isTraining ? 'model.train()' : 'model.eval()'}
             </button>
           </div>

           {/* Interactive Neural Net Diagram */}
           <div className="flex justify-around items-center w-full max-w-sm mx-auto mb-6 px-4 py-8 border-2 border-slate-200 bg-white rounded-xl shadow-inner relative">
              
              <span className="absolute top-2 left-2 text-[9px] font-bold text-slate-400 uppercase">Input Layer</span>
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-indigo-500 uppercase bg-indigo-50 px-2 rounded border border-indigo-200">Dropout Layer</span>
              <span className="absolute top-2 right-2 text-[9px] font-bold text-slate-400 uppercase">Output Layer</span>

              {/* Layer 1 (Input) */}
              <div className="flex flex-col gap-4 z-10">
                {[...Array(3)].map((_, i) => (
                  <div key={`l1-${i}`} className="w-6 h-6 rounded-full bg-slate-400 border-2 border-slate-500 shadow-sm relative z-10"></div>
                ))}
              </div>
              
              {/* Layer 2 (Dropout affected) */}
              <div className="flex flex-col gap-4 z-10">
                {[...Array(4)].map((_, i) => {
                  // Simulate dropout: randomly "turn off" nodes when in training mode
                  const isDropped = isTraining && (i === 1 || i === 3); 
                  return (
                    <div 
                      key={`l2-${i}`} 
                      className={`w-6 h-6 rounded-full border-2 shadow-sm transition-all duration-500 relative z-10
                        ${isDropped ? 'bg-rose-100 border-rose-300 opacity-30 scale-75' : 'bg-indigo-400 border-indigo-600'}`}
                    >
                      {isDropped && <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-rose-500">X</span>}
                    </div>
                  );
                })}
              </div>

              {/* Layer 3 (Output) */}
              <div className="flex flex-col gap-4 z-10">
                {[...Array(2)].map((_, i) => (
                  <div key={`l3-${i}`} className="w-6 h-6 rounded-full bg-slate-400 border-2 border-slate-500 shadow-sm relative z-10"></div>
                ))}
              </div>

              {/* Fake connecting lines */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                 <svg width="100%" height="100%">
                   <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#000" strokeWidth="1" />
                   <line x1="20%" y1="70%" x2="50%" y2="50%" stroke="#000" strokeWidth="1" />
                   <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="#000" strokeWidth="1" />
                   <line x1="50%" y1="50%" x2="80%" y2="70%" stroke="#000" strokeWidth="1" />
                 </svg>
              </div>
           </div>

           <div className="mt-auto">
             {isTraining ? (
               <p className="text-xs text-indigo-800 bg-indigo-100 border border-indigo-200 px-4 py-3 rounded-lg flex items-start gap-2 shadow-sm animate-in fade-in">
                 <ShieldAlert size={16} className="shrink-0 mt-0.5"/> 
                 <span><strong>Training Mode:</strong> Layers like <code>Dropout</code> randomly zero out nodes to prevent overfitting. <code>BatchNorm</code> updates its running mean/variance statistics based on this specific batch.</span>
               </p>
             ) : (
               <p className="text-xs text-emerald-800 bg-emerald-100 border border-emerald-200 px-4 py-3 rounded-lg flex items-start gap-2 shadow-sm animate-in fade-in">
                 <CheckCircle2 size={16} className="shrink-0 mt-0.5"/> 
                 <span><strong>Evaluation Mode:</strong> Dropout is disabled (all nodes active). BatchNorm freezes its running statistics and uses the accumulated averages for deterministic predictions.</span>
               </p>
             )}
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto min-h-[300px]">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Why does it matter?</span></div>
          <p className="text-slate-300 text-xs leading-relaxed font-mono">
            Calling <span className="text-indigo-400">model.train()</span> does <strong>NOT</strong> initiate the training loop itself.<br/><br/>
            It simply loops through all modules inside your network and sets their internal <span className="text-emerald-400">.training</span> attribute to <span className="text-amber-300">True</span>.<br/><br/>
            Specific layers check this attribute during the <code>forward()</code> pass to decide how to mathematically process the incoming tensor.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Unpack & Transfer ---
function TransferSlide() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let t1, t2;
    if (step === 1) t1 = setTimeout(() => setStep(2), 1200); // Unpack
    if (step === 2) t2 = setTimeout(() => setStep(3), 1200); // Transfer
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [step]);

  const triggerAnim = () => {
    setStep(0);
    setTimeout(() => setStep(1), 50);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Unpack & Device Transfer</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          The DataLoader yields a single object (usually a tuple). You must unpack it into features and labels, and <strong>crucially</strong>, transfer those tensors to the hardware device where your model resides.
        </p>

        <div className="flex flex-col gap-3">
           <div className={`p-3 border-2 rounded-xl transition-all duration-300 ${step >= 1 ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-slate-200'}`}>
             <h4 className="font-bold text-sm text-slate-800 font-mono">1. inputs, labels = batch</h4>
             <p className="text-[10px] text-slate-500 mt-1">Unpacks the tuple based exactly on what Dataset.__getitem__ returned.</p>
           </div>
           
           <div className={`p-3 border-2 rounded-xl transition-all duration-300 ${step >= 3 ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'}`}>
             <h4 className="font-bold text-sm text-slate-800 font-mono">2. inputs = inputs.to(device)</h4>
             <p className="text-[10px] text-slate-500 mt-1">Moves data from CPU RAM over the PCIe bus to GPU VRAM. Forgetting this causes a runtime crash!</p>
           </div>
        </div>

        <button 
          onClick={triggerAnim} 
          disabled={step > 0 && step < 3}
          className="mt-8 w-full py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {step === 0 || step === 3 ? "Simulate Data Pipeline" : "Processing..."} <PlayCircle size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        
        {/* Interactive Transfer Diagram */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl flex-1 relative overflow-hidden flex flex-col items-center justify-center shadow-inner min-h-[350px]">
           
           <div className="flex w-full h-[250px] items-center justify-center relative px-8 gap-12">
              
              {/* CPU Box (Left) */}
              <div className="w-48 h-full bg-white border-2 border-blue-200 rounded-2xl shadow-sm flex flex-col items-center relative pt-8 z-10">
                 <div className="absolute top-0 w-full bg-blue-100 border-b-2 border-blue-200 rounded-t-xl py-1 text-center text-[10px] font-bold text-blue-800 uppercase flex items-center justify-center gap-1">
                   <Cpu size={14}/> Host CPU RAM
                 </div>

                 {/* The Yielded Tuple */}
                 <div className={`transition-all duration-500 absolute top-12 flex flex-col items-center
                    ${step === 0 ? 'opacity-0 scale-90' : step === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
                    <span className="text-[10px] text-slate-500 font-mono mb-1">data_batch (Tuple)</span>
                    <div className="bg-slate-100 border-2 border-slate-300 p-2 rounded-lg flex items-center gap-2 shadow-md">
                       <div className="w-12 h-10 bg-indigo-200 rounded border border-indigo-400 flex items-center justify-center text-[8px] font-bold text-indigo-800">X</div>
                       <span className="text-slate-400 font-bold">,</span>
                       <div className="w-8 h-10 bg-emerald-200 rounded border border-emerald-400 flex items-center justify-center text-[8px] font-bold text-emerald-800">y</div>
                    </div>
                 </div>

                 {/* Unpacked Tensors */}
                 <div className={`transition-all duration-500 absolute top-12 flex flex-col items-center gap-2 w-full
                    ${step < 2 ? 'opacity-0' : step === 2 ? 'opacity-100' : 'opacity-0 translate-x-12'}`}>
                    
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-indigo-600 font-mono font-bold mb-1">inputs</span>
                      <div className="w-16 h-10 bg-indigo-200 rounded border-2 border-indigo-400 shadow-sm flex items-center justify-center text-[10px] font-bold text-indigo-800">[B, F]</div>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-emerald-600 font-mono font-bold mb-1">labels</span>
                      <div className="w-12 h-10 bg-emerald-200 rounded border-2 border-emerald-400 shadow-sm flex items-center justify-center text-[10px] font-bold text-emerald-800">[B]</div>
                    </div>
                 </div>
              </div>

              {/* The PCIe Bus */}
              <div className="flex-1 flex flex-col items-center justify-center relative">
                 <span className="absolute -top-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">.to(device) PCIe Bus</span>
                 <div className="w-full h-2 bg-slate-200 rounded-full relative overflow-hidden">
                    <div className={`absolute top-0 bottom-0 left-0 w-1/2 bg-amber-400 transition-all duration-700 ease-in-out ${step >= 3 ? 'left-[100%] opacity-0' : step === 2 ? 'left-0 opacity-100' : 'left-[-50%] opacity-0'}`}></div>
                 </div>
                 <ArrowRight className="absolute text-slate-300 right-[-12px]" size={24} />
              </div>

              {/* GPU Box (Right) */}
              <div className="w-48 h-full bg-white border-2 border-amber-200 rounded-2xl shadow-sm flex flex-col items-center relative pt-8 z-10">
                 <div className="absolute top-0 w-full bg-amber-100 border-b-2 border-amber-200 rounded-t-xl py-1 text-center text-[10px] font-bold text-amber-800 uppercase flex items-center justify-center gap-1">
                   <Zap size={14}/> GPU VRAM
                 </div>

                 <div className="w-[80%] h-12 bg-slate-800 text-white rounded-lg mt-2 flex flex-col items-center justify-center shadow-inner border border-slate-700">
                    <span className="text-[10px] font-bold uppercase">Neural Model</span>
                 </div>

                 {/* Arrived Tensors */}
                 <div className={`transition-all duration-500 absolute bottom-4 flex flex-col items-center gap-2 w-full
                    ${step === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 translate-x-[-20px]'}`}>
                    
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-indigo-600 font-mono font-bold mb-1">inputs.to('cuda')</span>
                      <div className="w-16 h-10 bg-indigo-200 rounded border-2 border-indigo-400 shadow-sm flex items-center justify-center text-[10px] font-bold text-indigo-800">[B, F]</div>
                    </div>

                 </div>
              </div>

           </div>

           {step === 3 && (
             <div className="absolute bottom-4 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-xs font-bold shadow-sm animate-in slide-in-from-bottom-4 flex items-center gap-2 border border-emerald-300">
               <CheckCircle2 size={16}/> Tensors are synced. Ready for forward pass!
             </div>
           )}

        </div>
      </div>
    </div>
  );
}

// --- Slide 4: The Remainder Batch ---
function RemainderSlide() {
  const [dropLast, setDropLast] = useState(false);

  return (
    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-2">The <code>drop_last</code> Caveat</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          If your DataLoader was initialized with <code>drop_last=False</code> (the default), the very last batch produced in an epoch might contain fewer samples if the dataset isn't perfectly divisible by the batch size.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col items-center justify-center flex-1 relative overflow-hidden min-h-[300px]">
          
          <div className="w-full flex justify-between items-center mb-8 relative z-10">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-white px-3 py-1 rounded shadow-sm border border-slate-200">Dataset Size: 105</span>
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded shadow-sm border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Toggle Setting:</span>
              <button 
                onClick={() => setDropLast(!dropLast)}
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded transition-colors ${dropLast ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700'}`}
              >
                drop_last={dropLast ? 'True' : 'False'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center w-full max-w-lg relative z-10">
              
              {/* Batches 1, 2, 3 */}
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-400">Batch {i}</span>
                  <div className="bg-white border-2 border-indigo-400 p-3 rounded-xl shadow-sm flex flex-col items-center w-[110px] group-hover:bg-indigo-50 transition-colors">
                    <span className="text-[10px] text-slate-500 mb-1 font-mono">Shape</span>
                    <span className="font-mono font-black text-indigo-800 text-lg">[32, X]</span>
                  </div>
                </div>
              ))}
              
              {/* Batch 4 (The Remainder) */}
              <div className="flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-400">Batch 4</span>
                  <div className={`border-2 p-3 rounded-xl shadow-sm flex flex-col items-center w-[110px] transition-all duration-500 overflow-hidden relative
                    ${dropLast ? 'bg-slate-200 border-slate-300 opacity-50 grayscale scale-95' : 'bg-amber-50 border-amber-400 group-hover:bg-amber-100'}`}
                  >
                    <span className="text-[10px] text-slate-500 mb-1 font-mono relative z-10">Shape</span>
                    <span className={`font-mono font-black text-lg relative z-10 ${dropLast ? 'text-slate-500 line-through' : 'text-amber-800'}`}>[9, X]</span>
                    
                    {dropLast && (
                      <div className="absolute inset-0 flex items-center justify-center bg-rose-500/20 text-rose-700 z-20 font-bold text-[10px] uppercase rotate-[-20deg]">
                        Discarded
                      </div>
                    )}
                  </div>
              </div>

          </div>

          <div className="mt-8 text-center max-w-sm">
            {dropLast ? (
              <p className="text-xs text-rose-800 bg-rose-100 border border-rose-200 px-4 py-2 rounded-lg animate-in fade-in">
                The incomplete batch of 9 is thrown away. All processed batches are perfectly uniform <code>[32, X]</code>.
              </p>
            ) : (
              <p className="text-xs text-amber-800 bg-amber-100 border border-amber-200 px-4 py-2 rounded-lg animate-in fade-in">
                <strong>Warning:</strong> The loop will execute 4 times, but the last iteration will receive a smaller tensor <code>[9, X]</code>. Ensure your loss averaging logic doesn't hardcode "32"!
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[300px] flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2"><ShieldAlert size={16} className="text-amber-400" /> <span className="font-semibold uppercase text-slate-400 font-sans text-xs">Why does this matter?</span></div>
          <p className="text-slate-400 text-xs leading-relaxed font-sans">
            PyTorch operations (like Linear layers) generally handle variable batch sizes gracefully because the matrix multiplication math applies across the batch dimension universally.
            <br/><br/>
            <strong className="text-amber-300">However</strong>, you must be careful if you manually perform operations inside the loop that assume a fixed batch size (like manually dividing the running loss by a hardcoded <code>32</code> instead of using <code>len(inputs)</code>).
          </p>
        </div>
      </div>
    </div>
  );
}