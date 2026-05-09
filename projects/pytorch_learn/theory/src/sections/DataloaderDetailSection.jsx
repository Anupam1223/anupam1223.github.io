import React, { useState, useEffect } from 'react';
import { 
  PackageSearch, ChevronLeft, ChevronRight, Code, Terminal, 
  Boxes, Shuffle, Layers, PlayCircle, Pointer, 
  Settings2, Zap, Cpu, ArrowRight, Trash2, CheckCircle2
} from 'lucide-react';

export default function DataLoaderSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'batching', title: 'The Batching Engine', component: BatchingSlide },
    { id: 'droplast', title: 'Handling Remainders (drop_last)', component: DropLastSlide },
    { id: 'workers', title: 'Parallel Loading (num_workers)', component: WorkersSlide },
    { id: 'pinmem', title: 'Optimizing Transfers (pin_memory)', component: PinMemorySlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <PackageSearch size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Using torch.utils.data.DataLoader</h2>
        <p className="text-slate-400 text-sm mb-4">Batching, shuffling, and parallelizing dataset access</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-blue-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-blue-400 whitespace-nowrap' : 'hidden md:inline whitespace-nowrap'}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: Basic Batching & Iteration ---
function BatchingSlide() {
  const [step, setStep] = useState(0); // 0: start, 1: batch1, 2: batch2, 3: batch3, 4: batch4

  const pyCode = `import torch
from torch.utils.data import Dataset, DataLoader

# Define a simple dummy dataset (105 total samples)
class DummyDataset(Dataset):
    def __init__(self, num_samples=100):
        self.num_samples = num_samples
        self.features = torch.randn(num_samples, 10)
        self.labels = torch.randint(0, 2, (num_samples,))

    def __len__(self): return self.num_samples
    def __getitem__(self, idx): return self.features[idx], self.labels[idx]

dataset = DummyDataset(num_samples=105)

# Instantiate the DataLoader (Batch Size: 32)
# shuffle=True ensures the order changes every epoch!
train_loader = DataLoader(dataset=dataset, batch_size=32, shuffle=True)

# Iterate over the DataLoader (1 Epoch)
for i, batch in enumerate(train_loader):
    features, labels = batch
    print(f"Batch {i+1}: Features shape={features.shape}")
    
    # model.train()
    # outputs = model(features)
    # ...`;

  const outCode = step === 0 ? "Waiting for iteration..." :
    `Dataset size: 105\nDataLoader batch size: 32\n\n--- Epoch 1 ---` + 
    (step >= 1 ? `\nBatch 1: Features shape=torch.Size([32, 10])` : ``) +
    (step >= 2 ? `\nBatch 2: Features shape=torch.Size([32, 10])` : ``) +
    (step >= 3 ? `\nBatch 3: Features shape=torch.Size([32, 10])` : ``) +
    (step >= 4 ? `\nBatch 4: Features shape=torch.Size([9, 10])` : ``);

  const totalItems = 105;
  const batchSize = 32;

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">The Batching Engine</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          <code>DataLoader</code> wraps your Dataset to provide an iterable interface. It automatically groups individual samples into mini-batches and randomly shuffles them every epoch.
        </p>

        <button 
          onClick={() => setStep(s => s >= 4 ? 0 : s + 1)} 
          className="w-full py-3 mb-6 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow transition-all flex justify-center items-center gap-2 flex-shrink-0"
        >
          {step === 0 ? "Start Epoch Iteration" : step < 4 ? `Fetch Batch ${step + 1}` : "Reset Epoch"} <PlayCircle size={18}/>
        </button>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col flex-1 relative overflow-hidden min-h-[300px]">
           <div className="flex justify-between items-center mb-4">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dataset Pool (105 items)</span>
             <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded"><Shuffle size={14}/> Shuffled</div>
           </div>

           {/* Dataset Grid */}
           <div className="flex flex-wrap gap-1 content-start mb-6 h-[120px] overflow-hidden">
             {[...Array(totalItems)].map((_, i) => {
               const processedItems = step * batchSize;
               const isProcessed = i < processedItems && step <= 3;
               const isLastBatchProcessed = step === 4 && i >= 96;
               const isYielded = isProcessed || (step === 4 && i < 105);

               return (
                 <div 
                   key={i} 
                   className={`w-3 h-3 rounded-sm transition-all duration-500 ${isYielded ? 'bg-slate-200 opacity-30 scale-75' : 'bg-blue-500 shadow-sm'}`}
                 />
               );
             })}
           </div>

           {/* Current Batch View */}
           <div className={`mt-auto border-t-2 border-dashed border-slate-300 pt-4 flex flex-col items-center transition-opacity duration-300 ${step > 0 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">Yielded Batch</span>
              <div className="bg-white border-2 border-blue-400 p-3 rounded-xl shadow-md flex items-center justify-center gap-2 w-full max-w-[200px]">
                 <Boxes size={24} className="text-blue-500"/>
                 <div className="flex flex-col">
                   <span className="font-mono font-bold text-blue-900 text-lg">
                     {step === 4 ? '9' : '32'} Items
                   </span>
                   <span className="text-[10px] text-slate-500">Features: [{step === 4 ? '9' : '32'}, 10]</span>
                 </div>
              </div>
           </div>

        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[350px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[150px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: Handling Remainders (drop_last) ---
function DropLastSlide() {
  const [dropLast, setDropLast] = useState(false);

  const pyCode = `import torch
from torch.utils.data import DataLoader

# 105 Samples / Batch Size 32 = 3 full batches, 1 remainder batch of 9.
dataset = DummyDataset(num_samples=105)

# Drop the last incomplete batch if dataset size is not divisible
train_loader = DataLoader(
    dataset=dataset, 
    batch_size=32, 
    shuffle=True, 
    drop_last=${dropLast ? 'True' : 'False'} # <--- Toggle this
)

print(f"Total Batches in Epoch: {len(train_loader)}")

for i, batch in enumerate(train_loader):
    features, labels = batch
    print(f"Batch {i+1}: Shape = {features.shape}")`;

  const outCode = `Total Batches in Epoch: ${dropLast ? '3' : '4'}\n\nBatch 1: Shape = torch.Size([32, 10])\nBatch 2: Shape = torch.Size([32, 10])\nBatch 3: Shape = torch.Size([32, 10])` + (!dropLast ? `\nBatch 4: Shape = torch.Size([9, 10])` : `\n# The final 9 samples were silently discarded.`);

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Handling Remainders (drop_last)</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          If the dataset size isn't perfectly divisible by the batch size, the final batch will be smaller. This can sometimes cause errors with specific network layers (like BatchNorm). Use <code>drop_last=True</code> to discard it safely.
        </p>

        <button 
          onClick={() => setDropLast(!dropLast)} 
          className={`w-full py-3 mb-6 text-white rounded-lg text-sm font-bold shadow transition-all flex justify-center items-center gap-2 flex-shrink-0 ${dropLast ? 'bg-rose-500 hover:bg-rose-600' : 'bg-slate-500 hover:bg-slate-600'}`}
        >
          <Settings2 size={18}/> {dropLast ? "drop_last = True" : "drop_last = False"}
        </button>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col items-center justify-center flex-1 relative min-h-[250px]">
           <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Epoch Breakdown (105 Items)</h4>

           <div className="flex flex-wrap gap-4 justify-center w-full max-w-sm relative z-10">
              {/* Batch 1-3 */}
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border-2 border-blue-400 p-3 rounded-xl shadow-sm flex flex-col items-center w-[100px]">
                  <span className="text-[10px] font-bold text-slate-400 mb-1">Batch {i}</span>
                  <span className="font-mono font-bold text-blue-800">32</span>
                </div>
              ))}
              
              {/* Batch 4 (Remainder) */}
              <div className={`transition-all duration-500 p-3 rounded-xl flex flex-col items-center w-[100px] border-2 relative overflow-hidden
                ${dropLast ? 'bg-rose-50 border-rose-300 opacity-50 grayscale' : 'bg-amber-50 border-amber-400 shadow-sm'}`}>
                {dropLast && <div className="absolute inset-0 flex items-center justify-center bg-rose-500/20 text-rose-700 z-10"><Trash2 size={32}/></div>}
                <span className="text-[10px] font-bold text-slate-500 mb-1 relative z-0">Batch 4</span>
                <span className={`font-mono font-bold relative z-0 ${dropLast ? 'text-slate-500 line-through' : 'text-amber-800'}`}>9</span>
              </div>
           </div>

           {dropLast ? (
             <p className="mt-8 text-[10px] text-rose-700 font-bold bg-rose-100 border border-rose-200 px-4 py-2 rounded-lg animate-in slide-in-from-bottom-2 text-center">
               Remainder batch discarded to ensure uniform tensor shapes.
             </p>
           ) : (
             <p className="mt-8 text-[10px] text-amber-700 font-bold bg-amber-100 border border-amber-200 px-4 py-2 rounded-lg animate-in slide-in-from-bottom-2 text-center">
               Warning: The final batch shape [9, 10] differs from the rest [32, 10].
             </p>
           )}
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[350px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[150px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Parallel Loading (num_workers) ---
function WorkersSlide() {
  const [animating, setAnimating] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let interval;
    if (animating) {
      interval = setInterval(() => {
        setStep(s => (s + 1) % 100); 
      }, 50);
    }
    return () => clearInterval(interval);
  }, [animating]);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2">Parallel Loading (num_workers)</h3>
          <p className="text-slate-600 text-sm">
            To prevent the GPU from idling, DataLoader spawns multiple background CPU processes to fetch and prepare upcoming batches asynchronously.
          </p>
        </div>
        <button 
          onClick={() => setAnimating(!animating)} 
          className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow transition-all flex items-center gap-2 shrink-0 ${animating ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {animating ? "Stop Simulation" : "Run Simulation"} <PlayCircle size={18} />
        </button>
      </div>

      {/* Diagram Container */}
      <div className="bg-white border border-slate-200 rounded-2xl flex-1 relative overflow-x-auto min-h-[400px] shadow-sm">
         <div style={{ minWidth: 1000, height: 350, position: 'relative' }} className="mx-auto mt-4 p-4">
            
            {/* The dashed outer boundary box */}
            <div className="absolute top-[50px] left-[180px] w-[690px] h-[230px] border-2 border-dashed border-slate-300 bg-slate-50/30 z-0 rounded-xl">
               <div className="w-full text-center mt-3 text-[11px] font-sans text-slate-500 font-bold uppercase tracking-widest">Parallel Loading (if num_workers &gt; 0)</div>
            </div>

            {/* SVG Lines for Connections */}
            <svg width="1000" height="350" className="absolute inset-0 z-0 pointer-events-none">
               <defs>
                 <marker id="arrowSolid" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                   <polygon points="0 0, 8 3, 0 6" fill="#334155" />
                 </marker>
                 <marker id="arrowDashed" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                   <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
                 </marker>
               </defs>
               
               {/* Dataset -> DataLoader */}
               <path d="M 160 180 L 195 180" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
               <text x="180" y="170" fontSize="11" fill="#475569" textAnchor="middle">wraps</text>

               {/* DataLoader -> Worker N */}
               <path d="M 350 165 L 405 135" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
               {/* Slope: (135-165)/(410-350) = -30/60 = -0.5 -> atan(-0.5) is approx -26 deg */}
               <text x="380" y="140" fontSize="11" fill="#475569" textAnchor="middle" transform="rotate(-26 380 140)">assigns indices</text>

               {/* DataLoader -> Worker 1 */}
               <path d="M 350 195 L 405 215" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
               {/* Slope: (215-195)/(410-350) = 20/60 = 0.33 -> atan(0.33) is approx 18 deg */}
               <text x="380" y="198" fontSize="11" fill="#475569" textAnchor="middle" transform="rotate(18 380 198)">assigns indices</text>

               {/* Worker N -> Batch */}
               <path d="M 530 130 L 705 175" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
               {/* Slope: (175-130)/(710-530) = 45/180 = 0.25 -> atan(0.25) is approx 14 deg */}
               <text x="620" y="145" fontSize="11" fill="#475569" textAnchor="middle" transform="rotate(14 620 145)">fetches & prepares</text>

               {/* Worker 1 -> Batch */}
               <path d="M 530 215 L 705 195" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
               {/* Slope: (195-215)/(710-530) = -20/180 = -0.11 -> atan(-0.11) is approx -6 deg */}
               <text x="620" y="195" fontSize="11" fill="#475569" textAnchor="middle" transform="rotate(-6 620 195)">fetches & prepares</text>

               {/* Batch -> Training Loop */}
               <path d="M 850 185 L 875 185" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
               <text x="865" y="175" fontSize="11" fill="#475569" textAnchor="middle">feeds</text>

               {/* Training Loop -> DataLoader (requests next) */}
               <path d="M 930 215 Q 600 330 280 230" stroke="#64748b" strokeWidth="1.5" strokeDasharray="5,5" fill="none" markerEnd="url(#arrowDashed)" />
               <text x="600" y="295" fontSize="11" fill="#475569" textAnchor="middle">requests next</text>

               {/* Data Flow Animations */}
               {animating && (
                 <>
                   {/* Dataloader assigning tasks */}
                   <circle cx={350 + ((step % 20) / 20) * 60} cy={165 - ((step % 20) / 20) * 30} r="3" fill="#3b82f6" />
                   <circle cx={350 + (((step+10) % 20) / 20) * 60} cy={195 + (((step+10) % 20) / 20) * 20} r="3" fill="#3b82f6" />
                   
                   {/* Workers fetching data */}
                   <circle cx={530 + ((step % 40) / 40) * 180} cy={130 + ((step % 40) / 40) * 45} r="4" fill="#10b981" />
                   <circle cx={530 + (((step+20) % 40) / 40) * 180} cy={215 - (((step+20) % 40) / 40) * 20} r="4" fill="#10b981" />

                   {/* Requesting next */}
                   <circle 
                     cx={930 - ((step % 50) / 50) * 650} 
                     cy={215 + Math.sin(((step % 50) / 50) * Math.PI) * 65} 
                     r="3" fill="#f43f5e" 
                   />
                 </>
               )}
            </svg>

            {/* HTML Nodes exactly matching screenshot styles with fixed sizing */}
            <div className="absolute inset-0 pointer-events-none">
              
              {/* Dataset Object */}
              <div className="absolute bg-[#c3f0c2] border border-black font-sans text-xs flex flex-col items-center justify-center shadow-sm rounded-3xl" style={{left: '20px', top: '150px', width: '140px', height: '60px'}}>
                <span className="font-bold">Dataset Object</span>
                <span className="text-[10px] leading-tight">(YourCustomDataset)</span>
              </div>
              
              {/* DataLoader */}
              <div className={`absolute bg-[#bde0fe] border border-black font-sans text-xs flex flex-col items-center justify-center p-2 shadow-sm text-center rounded-2xl transition-all ${animating ? 'ring-2 ring-blue-300' : ''}`} style={{left: '200px', top: '140px', width: '150px', height: '80px'}}>
                <span className="font-bold mb-1">DataLoader</span>
                <span className="text-[10px] leading-tight whitespace-nowrap">(batch_size, shuffle,</span>
                <span className="text-[10px] leading-tight whitespace-nowrap">num_workers)</span>
              </div>

              {/* Worker N */}
              <div className={`absolute bg-[#fceda6] border border-black font-sans text-[13px] flex flex-col items-center justify-center p-2 shadow-sm text-center rounded-full transition-all ${animating ? 'scale-105' : ''}`} style={{left: '410px', top: '105px', width: '120px', height: '50px'}}>
                <span className="font-bold">Worker N</span>
              </div>

              {/* Worker 1 */}
              <div className={`absolute bg-[#fceda6] border border-black font-sans text-[13px] flex flex-col items-center justify-center p-2 shadow-sm text-center rounded-full transition-all ${animating ? 'scale-105' : ''}`} style={{left: '410px', top: '190px', width: '120px', height: '50px'}}>
                <span className="font-bold">Worker 1</span>
              </div>

              {/* Batch */}
              <div className={`absolute bg-[#c7c0ff] border border-black font-sans text-xs flex flex-col items-center justify-center p-2 shadow-sm text-center rounded-2xl transition-all ${animating && step % 40 < 5 ? 'scale-110 bg-[#a69bff]' : ''}`} style={{left: '710px', top: '155px', width: '140px', height: '60px'}}>
                <span className="font-bold mb-1">Batch</span>
                <span className="text-[10px] leading-tight whitespace-nowrap">(Features, Labels)</span>
              </div>

              {/* Training Loop */}
              <div className={`absolute bg-[#ffc7ce] border border-black font-sans text-xs flex flex-col items-center justify-center p-2 shadow-sm text-center rounded-2xl transition-all ${animating ? 'ring-4 ring-rose-200' : ''}`} style={{left: '880px', top: '155px', width: '100px', height: '60px'}}>
                <span className="font-bold mb-1">Training Loop</span>
                <span className="text-[10px] leading-tight whitespace-nowrap">(GPU/CPU)</span>
              </div>

              {/* Little 'G' icon near fetches & prepares */}
              <div className="absolute bg-[#495057] text-white font-bold text-[10px] w-6 h-6 flex items-center justify-center rounded-sm" style={{left: '620px', top: '100px'}}>
                G
              </div>

            </div>

         </div>
      </div>
    </div>
  );
}

// --- Slide 4: Optimizing Transfers (pin_memory) ---
function PinMemorySlide() {
  const pyCode = `import torch
from torch.utils.data import DataLoader

# Enable pinned memory for faster CPU-to-GPU transfers
gpu_optimized_loader = DataLoader(
    dataset=dataset,
    batch_size=32,
    shuffle=True,
    num_workers=4,
    pin_memory=True # <--- Key parameter for GPU training
)

# Inside the training loop
for features, labels in gpu_optimized_loader:
    # Transfer becomes significantly faster!
    features = features.to('cuda') 
    labels = labels.to('cuda')
    
    # ... rest of the training steps ...`;

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Optimizing Transfers (pin_memory)</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          When training on a GPU, data loaded by the DataLoader (which resides in CPU RAM) needs to be transferred over the PCIe bus to the GPU's memory. Setting <code>pin_memory=True</code> speeds this up.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center flex-1 relative overflow-hidden min-h-[300px]">
           
           <div className="flex items-center justify-between w-full relative z-10 gap-4">
              
              {/* CPU RAM Block */}
              <div className="flex flex-col w-1/2 border-2 border-blue-300 rounded-xl overflow-hidden shadow-sm">
                 <div className="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-widest text-center py-1 border-b-2 border-blue-300">
                    Host CPU RAM
                 </div>
                 
                 <div className="p-3 bg-white flex flex-col gap-2">
                    <div className="border border-slate-300 rounded p-2 text-center relative opacity-50">
                       <span className="text-[10px] font-bold text-slate-500 block">Pageable Memory</span>
                       <div className="w-full h-4 bg-slate-200 mt-1 rounded"></div>
                    </div>
                    <div className="border-2 border-emerald-400 bg-emerald-50 rounded p-2 text-center relative shadow-sm">
                       <span className="text-[10px] font-bold text-emerald-700 block">Pinned (Page-Locked)</span>
                       <div className="w-full h-4 bg-emerald-400 mt-1 rounded"></div>
                       <CheckCircle2 size={14} className="absolute top-1 right-1 text-emerald-600" />
                    </div>
                 </div>
              </div>

              {/* The Bus Arrow */}
              <div className="flex flex-col items-center relative">
                 <span className="text-[9px] font-bold text-slate-400 absolute -top-4 whitespace-nowrap">PCIe Bus</span>
                 <div className="relative w-16 h-8">
                   {/* Fast Arrow */}
                   <div className="absolute top-1/2 left-0 w-full h-1.5 bg-emerald-400 -translate-y-1/2"></div>
                   <div className="absolute right-0 top-1/2 w-4 h-4 border-t-4 border-r-4 border-emerald-400 transform rotate-45 -translate-y-1/2 translate-x-1"></div>
                   
                   {/* Animated Fast Particle */}
                   <div className="absolute top-1/2 w-3 h-3 bg-white rounded-full border border-emerald-500 -translate-y-1/2 animate-[ping_1s_ease-in-out_infinite]"></div>
                 </div>
              </div>

              {/* GPU Block */}
              <div className="flex flex-col w-1/3 border-2 border-amber-300 rounded-xl overflow-hidden shadow-sm">
                 <div className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-widest text-center py-1 border-b-2 border-amber-300 flex items-center justify-center gap-1">
                    <Zap size={12}/> GPU VRAM
                 </div>
                 
                 <div className="p-3 bg-white flex flex-col gap-2 items-center justify-center min-h-[90px]">
                    <div className="w-full h-4 bg-emerald-400 rounded"></div>
                    <div className="w-full h-4 bg-emerald-400 rounded"></div>
                    <div className="w-full h-4 bg-emerald-400 rounded"></div>
                 </div>
              </div>

           </div>

           <p className="mt-8 text-[10px] text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-lg text-center leading-relaxed">
             <strong>Page-locked memory</strong> prevents the OS from swapping the data out to disk. The GPU can use Direct Memory Access (DMA) to copy this data much faster than standard pageable memory.
           </p>

        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto min-h-[350px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
      </div>
    </div>
  );
}