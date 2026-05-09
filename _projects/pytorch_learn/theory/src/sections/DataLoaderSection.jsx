import React, { useState, useEffect } from 'react';
import { 
  Database, ChevronLeft, ChevronRight, HardDrive, Cpu, 
  Zap, Shuffle, Layers, ShieldAlert, ArrowRight, Settings, 
  Activity, PlayCircle, CheckCircle2, BoxSelect
} from 'lucide-react';

export default function DataLoaderIntroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'bottlenecks', title: 'Hardware Constraints', component: BottlenecksSlide },
    { id: 'complexities', title: 'Pipeline Complexities', component: ComplexitiesSlide },
    { id: 'diagram', title: 'Naive vs PyTorch Loading', component: DiagramSlide },
    { id: 'solution', title: 'The PyTorch Solution', component: SolutionSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Database size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">The Need for Specialized Data Loaders</h2>
        <p className="text-slate-400 text-sm mb-4">Overcoming bottlenecks to feed data-hungry GPUs</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-violet-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-violet-400 whitespace-nowrap' : 'hidden md:inline whitespace-nowrap'}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: Hardware Constraints ---
function BottlenecksSlide() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Hardware Constraints</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          While defining models and running Autograd is essential, feeding data into these models presents massive physical hardware challenges if handled manually.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 flex-1">
        
        {/* Memory Constraints */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-4 border-b border-slate-200 pb-4">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center border border-rose-200">
              <ShieldAlert size={28}/>
            </div>
            <h4 className="font-bold text-slate-800 text-lg">Memory Constraints</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Modern datasets (like ImageNet with its 14+ million images) span hundreds of gigabytes. Loading the entire dataset into your computer's RAM, let alone the GPU's VRAM, is physically impossible.
          </p>
          <div className="mt-auto bg-white border border-rose-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
             <div className="flex flex-col">
               <span className="text-[10px] text-slate-500 uppercase font-bold">ImageNet Dataset</span>
               <span className="text-xl font-black text-rose-700">~150 GB</span>
             </div>
             <div className="text-xl font-bold text-slate-300">vs</div>
             <div className="flex flex-col text-right">
               <span className="text-[10px] text-slate-500 uppercase font-bold">Standard GPU VRAM</span>
               <span className="text-xl font-black text-slate-700">16 - 24 GB</span>
             </div>
          </div>
        </div>

        {/* I/O Bottlenecks */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-4 border-b border-slate-200 pb-4">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center border border-amber-200">
              <HardDrive size={28}/>
            </div>
            <h4 className="font-bold text-slate-800 text-lg">I/O Bottlenecks</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Reading data from a hard drive is <em>orders of magnitude</em> slower than computation on a CPU or GPU. If you read files sequentially one by one, your blazing-fast GPU will spend 90% of its time sitting idle waiting for the next image.
          </p>
          <div className="mt-auto flex items-center justify-center gap-4 bg-white border border-amber-200 p-4 rounded-xl shadow-sm">
             <div className="flex flex-col items-center">
               <HardDrive size={24} className="text-slate-400 mb-1"/>
               <span className="text-[10px] font-bold text-slate-500 uppercase">Disk Read</span>
               <span className="text-xs font-mono text-amber-600 font-bold">SLOW</span>
             </div>
             <div className="flex-1 border-t-2 border-dashed border-slate-300 relative h-0">
               <ArrowRight size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400"/>
             </div>
             <div className="flex flex-col items-center">
               <Zap size={24} className="text-amber-500 mb-1"/>
               <span className="text-[10px] font-bold text-slate-500 uppercase">GPU</span>
               <span className="text-xs font-mono text-rose-500 font-bold">IDLE (STARVING)</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Slide 2: Pipeline Complexities ---
function ComplexitiesSlide() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Engineering Pipeline Complexities</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Beyond hardware bottlenecks, formatting and supplying data correctly requires solving several complex software engineering challenges from scratch every time.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 flex-1">
        
        {/* Preprocessing */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-violet-300 transition-colors">
          <h4 className="font-bold text-violet-900 mb-2 flex items-center gap-2"><Settings size={18} className="text-violet-500"/> Inefficient Preprocessing</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Data rarely arrives ready for a neural network. It requires resizing, normalization, type conversion, and random augmentations. Performing these heavy CPU tasks synchronously sample-by-sample severely halts the training loop.
          </p>
        </div>

        {/* Shuffling */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-violet-300 transition-colors">
          <h4 className="font-bold text-violet-900 mb-2 flex items-center gap-2"><Shuffle size={18} className="text-violet-500"/> Dataset Shuffling</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            To prevent models from learning the order of the data and to ensure generalization, datasets must be completely shuffled before every epoch. Doing this efficiently on a 150GB dataset that doesn't fit in RAM is mathematically complex.
          </p>
        </div>

        {/* Batching */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-violet-300 transition-colors">
          <h4 className="font-bold text-violet-900 mb-2 flex items-center gap-2"><BoxSelect size={18} className="text-violet-500"/> Batching Logic</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Networks train on mini-batches (e.g., 32 images at a time). Manually grouping individual images into a cohesive 4D tensor <code>[32, 3, 224, 224]</code>, padding variable lengths, and handling the final (smaller) batch is tedious boilerplate code.
          </p>
        </div>

        {/* Parallelism */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-violet-300 transition-colors">
          <h4 className="font-bold text-violet-900 mb-2 flex items-center gap-2"><Layers size={18} className="text-violet-500"/> Multi-Process Parallelism</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            To beat the I/O bottleneck, you must use <em>multiple worker processes</em> reading from the disk simultaneously to prepare the *next* batch while the GPU trains on the *current* batch. Writing safe multi-processing code is notoriously difficult.
          </p>
        </div>

      </div>
    </div>
  );
}

// --- Slide 3: Diagram Recreation ---
function DiagramSlide() {
  const [animating, setAnimating] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let interval;
    if (animating) {
      interval = setInterval(() => {
        setStep(s => (s + 1) % 6);
      }, 800);
    } else {
      setStep(0);
    }
    return () => clearInterval(interval);
  }, [animating]);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2">Visualizing the Pipeline Bottleneck</h3>
          <p className="text-slate-600 text-sm">Comparing the PyTorch <code>DataLoader</code> approach vs Naive Loading.</p>
        </div>
        <button 
          onClick={() => setAnimating(!animating)} 
          className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow transition-all flex items-center gap-2 ${animating ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
        >
          {animating ? "Stop Simulation" : "Run Simulation"} <PlayCircle size={18} />
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl flex-1 relative overflow-x-auto min-h-[500px] shadow-sm">
         <div style={{ minWidth: 1000, height: 500, position: 'relative' }} className="mx-auto p-4">
            
            {/* ==========================================
                TOP GREEN BOX: PyTorch DataLoader Approach 
                ========================================== */}
            <div className="absolute top-[20px] left-[20px] w-[960px] h-[180px] bg-[#c3e6cb] border-2 border-dashed border-black z-0">
               <div className="w-full text-center mt-2 text-sm font-sans text-slate-800">PyTorch DataLoader Approach</div>
            </div>

            {/* SVG Lines for Top Box */}
            <svg width="1000" height="500" className="absolute inset-0 z-0 pointer-events-none">
               <defs>
                 <marker id="arrowHead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                   <polygon points="0 0, 8 3, 0 6" fill="#000" />
                 </marker>
                 <marker id="arrowActive" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                   <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
                 </marker>
               </defs>
               
               {/* Disk to DataLoader */}
               <path d="M 140 100 L 220 100" stroke="#000" strokeWidth="1.5" markerEnd="url(#arrowHead)" />
               <circle cx={140 + (step*16)%80} cy="100" r="4" fill="#10b981" className={`transition-opacity ${animating ? 'opacity-100' : 'opacity-0'}`} />

               {/* DataLoader to Prepared Batch */}
               <path d="M 380 100 L 480 100" stroke="#000" strokeWidth="1.5" markerEnd="url(#arrowHead)" />
               <text x="430" y="90" fontSize="12" fill="#000" textAnchor="middle">Prefetch</text>
               <circle cx={380 + (step*20)%100} cy="100" r="4" fill="#10b981" className={`transition-opacity ${animating ? 'opacity-100' : 'opacity-0'}`} />

               {/* Prepared Batch to Move */}
               <path d="M 620 110 L 680 140" stroke="#000" strokeWidth="1.5" markerEnd="url(#arrowHead)" />
               <circle cx={620 + (step*12)%60} cy={110 + (step*6)%30} r="4" fill="#10b981" className={`transition-opacity ${animating ? 'opacity-100' : 'opacity-0'}`} />

               {/* Move to Train */}
               <path d="M 800 135 L 850 115" stroke="#000" strokeWidth="1.5" markerEnd="url(#arrowHead)" />
               <circle cx={800 + (step*10)%50} cy={135 - (step*4)%20} r="4" fill="#10b981" className={`transition-opacity ${animating ? 'opacity-100' : 'opacity-0'}`} />

               {/* Train to Prepared Batch (Request Next) */}
               <path d="M 900 70 Q 750 20 580 70" stroke="#000" strokeWidth="1.5" markerEnd="url(#arrowHead)" fill="none"/>
               <text x="750" y="45" fontSize="12" fill="#000" textAnchor="middle">Request Next</text>
               <circle cx={900 - (step*64)%320} cy={70 - Math.sin((step*64)%320/320 * Math.PI)*50} r="4" fill="#3b82f6" className={`transition-opacity ${animating ? 'opacity-100' : 'opacity-0'}`} />
            </svg>

            {/* HTML Nodes for Top Box */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Cylinder (Database) */}
              <div className="absolute bg-[#ced4da] border border-black font-sans text-xs flex flex-col items-center justify-center shadow-sm rounded-[50%_50%_10%_10%/10%_10%_10%_10%]" style={{left: '40px', top: '65px', width: '100px', height: '70px'}}>
                <span>Large Dataset</span><span>(Disk)</span>
              </div>
              
              <div className="absolute bg-[#80bdf7] border border-black font-sans text-xs flex flex-col items-center justify-center p-2 shadow-sm text-center" style={{left: '220px', top: '60px', width: '160px', height: '80px'}}>
                <span>DataLoader</span><span>(Parallel Workers,</span><span>Batching, Shuffling)</span>
                {/* Visual indicator of parallel workers running */}
                {animating && (
                  <div className="absolute -bottom-4 flex gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-300"></div>
                  </div>
                )}
              </div>

              <div className="absolute bg-[#ffe873] border border-black font-sans text-xs flex flex-col items-center justify-center p-2 shadow-sm text-center" style={{left: '480px', top: '70px', width: '140px', height: '60px'}}>
                <span>Prepared Batch</span><span>(RAM)</span>
              </div>

              <div className="absolute bg-[#889afb] border border-black font-sans text-xs flex flex-col items-center justify-center p-2 shadow-sm text-center" style={{left: '680px', top: '110px', width: '120px', height: '60px'}}>
                <span>Move Batch</span><span>to GPU</span>
              </div>

              <div className={`absolute bg-[#8ce093] border border-black font-sans text-xs flex flex-col items-center justify-center p-2 shadow-md text-center transition-all ${animating ? 'ring-4 ring-emerald-300 scale-105' : ''}`} style={{left: '850px', top: '70px', width: '110px', height: '60px'}}>
                <span>Train on Batch</span><span>(GPU Busy)</span>
              </div>
            </div>


            {/* ==========================================
                BOTTOM RED BOX: Simplified Naive Loading 
                ========================================== */}
            <div className="absolute top-[210px] left-[20px] w-[820px] h-[240px] bg-[#f8d7da] border-2 border-dashed border-black z-0">
               <div className="w-full text-center mt-2 text-sm font-sans text-slate-800">Simplified Naive Loading</div>
            </div>

            {/* SVG Lines for Bottom Box */}
            <svg width="1000" height="500" className="absolute inset-0 z-0 pointer-events-none">
               
               {/* Dataset to Load */}
               <path d="M 140 350 L 240 350" stroke="#000" strokeWidth="1.5" markerEnd="url(#arrowHead)" />
               <text x="190" y="340" fontSize="12" fill="#000" textAnchor="middle">Slow Read</text>
               <circle cx={140 + (step*20)%100} cy="350" r="4" fill="#f43f5e" className={`transition-opacity ${animating ? 'opacity-100' : 'opacity-0'}`} />

               {/* Load to Move */}
               <path d="M 360 360 L 480 420" stroke="#000" strokeWidth="1.5" markerEnd="url(#arrowHead)" />
               
               {/* Move to Train */}
               <path d="M 600 420 L 710 370" stroke="#000" strokeWidth="1.5" markerEnd="url(#arrowHead)" />

               {/* Train to Load (Wait for Next) */}
               <path d="M 760 320 Q 500 240 300 320" stroke="#000" strokeWidth="1.5" markerEnd="url(#arrowHead)" fill="none"/>
               <text x="530" y="270" fontSize="12" fill="#000" textAnchor="middle">Wait for Next</text>

               {/* Slows Training Dashed Line */}
               <path d="M 630 350 L 710 350" stroke="#000" strokeWidth="1.5" strokeDasharray="5,5" markerEnd="url(#arrowHead)" />
               <text x="670" y="340" fontSize="12" fill="#000" textAnchor="middle">Slows Training</text>

               {/* Slow Data Payload Animation (Only moves when step is specific to simulate bottleneck) */}
               {animating && (
                  <circle 
                    cx={
                      step < 2 ? 300 : 
                      step === 2 ? 420 : 
                      step === 3 ? 540 : 
                      step === 4 ? 650 : 760
                    } 
                    cy={
                      step < 2 ? 350 : 
                      step === 2 ? 390 : 
                      step === 3 ? 420 : 
                      step === 4 ? 395 : 350
                    } 
                    r="6" fill="#f43f5e" className="transition-all duration-500 ease-linear" 
                  />
               )}
            </svg>

            {/* HTML Nodes for Bottom Box */}
            <div className="absolute inset-0 pointer-events-none">
              
              {/* Cylinder (Database) */}
              <div className="absolute bg-[#ced4da] border border-black font-sans text-xs flex flex-col items-center justify-center shadow-sm rounded-[50%_50%_10%_10%/10%_10%_10%_10%]" style={{left: '40px', top: '315px', width: '100px', height: '70px'}}>
                <span>Large Dataset</span><span>(Disk)</span>
              </div>
              
              <div className="absolute bg-[#e9ecef] border border-black font-sans text-xs flex flex-col items-center justify-center p-2 shadow-sm text-center" style={{left: '240px', top: '320px', width: '120px', height: '60px'}}>
                <span>Load + Process</span><span>Sample (CPU)</span>
              </div>

              {/* The Bottleneck Hexagon */}
              <div className={`absolute bg-[#ef4444] border-2 border-black text-white font-sans text-xs flex flex-col items-center justify-center shadow-lg text-center transition-all ${animating ? 'scale-105' : ''}`} style={{left: '450px', top: '305px', width: '180px', height: '90px', clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)'}}>
                <span className="mb-1">I/O & CPU Bound</span>
                <span>GPU Often Idle</span>
                {/* The Bottleneck Badge */}
                <div className="absolute bottom-2 bg-[#212529] text-white px-2 py-0.5 rounded shadow">
                  Bottleneck
                </div>
              </div>

              <div className="absolute bg-[#e9ecef] border border-black font-sans text-xs flex flex-col items-center justify-center p-2 shadow-sm text-center" style={{left: '480px', top: '400px', width: '120px', height: '40px'}}>
                <span>Move Sample</span><span>to GPU</span>
              </div>

              <div className={`absolute bg-[#e9ecef] border border-black font-sans text-xs flex flex-col items-center justify-center p-2 shadow-sm text-center transition-all ${animating && step >= 4 ? 'bg-[#8ce093]' : ''}`} style={{left: '710px', top: '320px', width: '110px', height: '60px'}}>
                <span>Train on</span><span>Sample (GPU)</span>
                {animating && step < 4 && <span className="text-[10px] text-rose-500 font-bold mt-1">IDLE...</span>}
              </div>

            </div>

         </div>
      </div>
    </div>
  );
}

// --- Slide 4: The PyTorch Solution ---
function SolutionSlide() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <h3 className="text-xl font-bold mb-4">The PyTorch Solution: torch.utils.data</h3>
      <p className="text-slate-600 mb-8 leading-relaxed text-sm">
        Recognizing these immense bottlenecks, PyTorch provides two specialized classes: <code>Dataset</code> and <code>DataLoader</code>. They abstract away the complex multi-processing engineering, allowing you to focus purely on what your data is.
      </p>

      <div className="grid md:grid-cols-2 gap-6 flex-1">
        
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col">
           <h4 className="font-bold flex items-center gap-2 text-emerald-900 mb-4 border-b border-emerald-200 pb-2">
             <CheckCircle2 size={20} className="text-emerald-600"/> Core Benefits
           </h4>
           <ul className="space-y-5 text-sm text-emerald-800">
             <li className="flex gap-3">
                <Zap className="flex-shrink-0 text-emerald-500 mt-0.5" size={18}/>
                <div>
                  <strong>Efficiency:</strong> Spawns multiple background CPU workers to fetch and preprocess data in parallel while the GPU trains.
                </div>
             </li>
             <li className="flex gap-3">
                <Database className="flex-shrink-0 text-emerald-500 mt-0.5" size={18}/>
                <div>
                  <strong>Memory Management:</strong> Handles datasets of any size by dynamically loading only the requested mini-batches into RAM.
                </div>
             </li>
             <li className="flex gap-3">
                <Shuffle className="flex-shrink-0 text-emerald-500 mt-0.5" size={18}/>
                <div>
                  <strong>Simplicity:</strong> Handles complex algorithms for unbiased dataset shuffling and batch collation automatically.
                </div>
             </li>
           </ul>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 shadow-inner flex flex-col font-mono text-[11px] text-emerald-100 relative">
          <span className="absolute top-0 right-0 bg-slate-700 text-slate-300 px-3 py-1 rounded-bl-xl font-sans text-xs font-bold">Preview</span>
<pre className="whitespace-pre-wrap leading-relaxed mt-4">
{`from torch.utils.data import DataLoader

# 1. Define custom Dataset rules
my_dataset = CustomDataset(data_path)

# 2. DataLoader handles the heavy lifting
train_loader = DataLoader(
    dataset=my_dataset,
    batch_size=32,      # Auto-groups 32 items
    shuffle=True,       # Auto-shuffles every epoch
    num_workers=4,      # Uses 4 CPU cores in parallel!
    pin_memory=True     # Faster CPU-to-GPU transfers
)

# 3. Clean Training Loop
for batch_inputs, batch_labels in train_loader:
    # GPU is never starved!
    train_step(batch_inputs, batch_labels)`}
</pre>
        </div>

      </div>
    </div>
  );
}