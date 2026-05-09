import React, { useState, useEffect } from 'react';
import { 
  Settings, ChevronLeft, ChevronRight, Code, Terminal, 
  Scale, Layers, CheckCircle2, AlertTriangle, 
  PlayCircle, Pointer, ArrowRight, Cpu, Zap, Trash2, 
  Boxes, ListOrdered, Shuffle, PieChart, FileJson
} from 'lucide-react';

export default function CustomDataLoaderSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'samplers', title: 'Controlling Sample Selection', component: SamplersSlide },
    { id: 'collate_def', title: 'Default collate_fn', component: DefaultCollateSlide },
    { id: 'collate_cust', title: 'Custom collate_fn (Padding)', component: CustomCollateSlide },
    { id: 'summary', title: 'Other Customization Arguments', component: SummarySlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Settings size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Customizing DataLoader Behavior</h2>
        <p className="text-slate-400 text-sm mb-4">Tailoring the data loading process for specialized needs</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-orange-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-orange-400 whitespace-nowrap' : 'hidden md:inline whitespace-nowrap'}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: Samplers (Weighted & Built-ins) ---
function SamplersSlide() {
  const [sampler, setSampler] = useState('weighted'); 
  const [trigger, setTrigger] = useState(0);

  // Generate a batch of 40 items.
  // Random: ~90% Class 0, ~10% Class 1.
  // Weighted: ~50% Class 0, ~50% Class 1.
  const generateBatch = () => {
    const batch = [];
    for (let i = 0; i < 40; i++) {
      if (sampler === 'random' || sampler === 'sequential' || sampler === 'subset') {
        batch.push(Math.random() < 0.9 ? 0 : 1);
      } else {
        batch.push(Math.random() < 0.5 ? 0 : 1);
      }
    }
    return batch;
  };

  const [batch, setBatch] = useState(generateBatch());

  useEffect(() => {
    setBatch(generateBatch());
  }, [sampler, trigger]);

  const class0Count = batch.filter(x => x === 0).length;
  const class1Count = batch.filter(x => x === 1).length;

  const pyCode = `import torch
from torch.utils.data import Dataset, DataLoader, WeightedRandomSampler

# Imagine a classification dataset where class '0' has 900 samples 
# and class '1' has 100 samples.
targets = [0]*900 + [1]*100 

# Calculate weights for each sample
class_counts = torch.bincount(torch.tensor(targets)) # [900, 100]
num_samples = len(targets) # 1000

# Weight for each sample is 1 / (number of samples in its class)
sample_weights = torch.tensor([1.0 / class_counts[t] for t in targets])

# Create the sampler (replacement=True is required to oversample)
sampler = WeightedRandomSampler(
    weights=sample_weights, 
    num_samples=num_samples, 
    replacement=True
)

# Create the DataLoader using the custom sampler
# Note: shuffle MUST be False when using a sampler
dataloader = DataLoader(dataset, batch_size=32, sampler=sampler)

# Now, batches drawn will have a balanced representation
# for batch_features, batch_labels in dataloader:
#     pass`;

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">Controlling Sample Selection</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          The <code>DataLoader</code> uses a <strong>sampler</strong> object to determine the exact order indices are drawn from the Dataset. PyTorch provides several built-in options:
        </p>

        <div className="flex flex-col gap-3 mb-6">
          <button 
            onClick={() => setSampler('sequential')}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-start gap-3 transition-all ${sampler === 'sequential' ? 'bg-slate-100 border-slate-400 text-slate-800 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <ListOrdered size={20} className={`mt-0.5 flex-shrink-0 ${sampler === 'sequential' ? 'text-slate-600' : 'text-slate-400'}`}/>
            <div>
              <span className="font-bold text-sm block">SequentialSampler</span>
              <span className="text-[10px] leading-tight block">Samples elements sequentially, always in the same order. (Default if <code>shuffle=False</code>)</span>
            </div>
          </button>

          <button 
            onClick={() => setSampler('random')}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-start gap-3 transition-all ${sampler === 'random' ? 'bg-slate-100 border-slate-400 text-slate-800 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <Shuffle size={20} className={`mt-0.5 flex-shrink-0 ${sampler === 'random' ? 'text-slate-600' : 'text-slate-400'}`}/>
            <div>
              <span className="font-bold text-sm block">RandomSampler</span>
              <span className="text-[10px] leading-tight block">Samples elements randomly. (Default if <code>shuffle=True</code>)</span>
            </div>
          </button>

          <button 
            onClick={() => setSampler('subset')}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-start gap-3 transition-all ${sampler === 'subset' ? 'bg-slate-100 border-slate-400 text-slate-800 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <PieChart size={20} className={`mt-0.5 flex-shrink-0 ${sampler === 'subset' ? 'text-slate-600' : 'text-slate-400'}`}/>
            <div>
              <span className="font-bold text-sm block">SubsetRandomSampler</span>
              <span className="text-[10px] leading-tight block">Samples randomly from a specific list of indices. Useful for validation splits.</span>
            </div>
          </button>

          <button 
            onClick={() => setSampler('weighted')}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-start gap-3 transition-all ${sampler === 'weighted' ? 'bg-orange-50 border-orange-500 text-orange-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-orange-300'}`}
          >
            <Scale size={20} className={`mt-0.5 flex-shrink-0 ${sampler === 'weighted' ? 'text-orange-600' : 'text-slate-400'}`}/>
            <div>
              <span className="font-bold text-sm block">WeightedRandomSampler</span>
              <span className="text-[10px] leading-tight block">Samples with given probabilities. Essential for imbalanced datasets!</span>
            </div>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        
        {/* Interactive Visualizer for Weighted Sampler */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col flex-1 items-center relative overflow-hidden min-h-[220px]">
          
          {sampler === 'weighted' || sampler === 'random' ? (
            <>
              <div className="w-full flex justify-between items-center mb-4">
                 <div className="flex flex-col">
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Simulating Batch (n=40)</span>
                   <span className="text-[9px] text-slate-400">Dataset: 90% Class 0, 10% Class 1</span>
                 </div>
                 <button onClick={() => setTrigger(t => t + 1)} className="text-[10px] bg-white border border-slate-300 px-3 py-1.5 rounded shadow-sm hover:bg-slate-100 flex items-center gap-1 font-bold text-slate-700">
                   Draw New Batch <PlayCircle size={12} className="text-orange-500"/>
                 </button>
              </div>
              
              {/* Batch Grid */}
              <div className="flex flex-wrap gap-1 content-start w-full max-w-[320px] justify-center mb-6">
                 {batch.map((val, i) => (
                    <div 
                      key={`${sampler}-${trigger}-${i}`} 
                      className={`w-6 h-6 rounded animate-in zoom-in transition-all duration-300 flex items-center justify-center font-mono text-[10px] font-bold text-white shadow-sm ${val === 0 ? 'bg-blue-500' : 'bg-rose-500'}`}
                      style={{ animationDelay: `${i * 10}ms` }}
                    >
                      {val}
                    </div>
                 ))}
              </div>

              <div className="w-full flex justify-around mt-auto border-t-2 border-dashed border-slate-300 pt-4">
                 <div className="flex flex-col items-center">
                   <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Class 0 (Majority)</span>
                   <span className="text-2xl font-black text-blue-600">{class0Count}</span>
                 </div>
                 <div className="flex flex-col items-center">
                   <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Class 1 (Minority)</span>
                   <span className="text-2xl font-black text-rose-600">{class1Count}</span>
                 </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center opacity-50">
              <ListOrdered size={48} className="text-slate-400 mb-4" />
              <span className="font-bold text-slate-500">Select WeightedRandomSampler</span>
              <span className="text-xs text-slate-400">to see the interactive code example and visualizer.</span>
            </div>
          )}
          
        </div>

        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto max-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Python Code (WeightedRandomSampler)</span></div>
          <pre className={`whitespace-pre-wrap font-mono text-[11px] text-emerald-100 leading-relaxed overflow-x-auto transition-opacity ${sampler === 'weighted' ? 'opacity-100' : 'opacity-30'}`}>
            {pyCode}
          </pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: Default collate_fn ---
function DefaultCollateSlide() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let t1, t2;
    if (step === 1) t1 = setTimeout(() => setStep(2), 1000);
    if (step === 2) t2 = setTimeout(() => setStep(3), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [step]);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="mb-4 flex justify-between items-start">
        <div className="max-w-3xl">
          <h3 className="text-xl font-bold mb-2">Customizing Batch Creation: collate_fn</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Once the sampler provides a list of indices, the DataLoader fetches them using <code>dataset[index]</code>. It then needs to assemble these independent samples into a unified batch using the <strong>collate_fn</strong>. The default function attempts to do three specific things automatically:
          </p>
        </div>
        <button 
          onClick={() => setStep(s => s === 3 ? 0 : 1)} 
          className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-bold shadow hover:bg-orange-700 transition-all flex items-center gap-2 shrink-0"
        >
          {step === 0 ? "Trigger Collate" : step === 3 ? "Reset" : "Collating..."} <PlayCircle size={18} />
        </button>
      </div>

      <div className="grid md:grid-cols-[1fr_2fr] gap-6 flex-1">
        
        {/* The Rules Checklist */}
        <div className="flex flex-col gap-3 justify-center">
          <div className={`p-4 border-2 rounded-xl transition-all duration-500 ${step >= 1 ? 'bg-orange-50 border-orange-400 shadow-sm' : 'bg-slate-50 border-slate-200'}`}>
            <h4 className={`font-bold flex items-center gap-2 mb-1 ${step >= 1 ? 'text-orange-900' : 'text-slate-600'}`}><Code size={18} className={step >= 1 ? 'text-orange-500' : 'text-slate-400'}/> 1. Convert to Tensors</h4>
            <p className={`text-[10px] leading-relaxed ${step >= 1 ? 'text-orange-800' : 'text-slate-500'}`}>Converts NumPy arrays and native Python numbers into PyTorch tensors.</p>
          </div>

          <div className={`p-4 border-2 rounded-xl transition-all duration-500 ${step >= 2 ? 'bg-orange-50 border-orange-400 shadow-sm' : 'bg-slate-50 border-slate-200'}`}>
            <h4 className={`font-bold flex items-center gap-2 mb-1 ${step >= 2 ? 'text-orange-900' : 'text-slate-600'}`}><FileJson size={18} className={step >= 2 ? 'text-orange-500' : 'text-slate-400'}/> 2. Preserve Structure</h4>
            <p className={`text-[10px] leading-relaxed ${step >= 2 ? 'text-orange-800' : 'text-slate-500'}`}>If your dataset returns a dictionary or tuple, the batch will be a dictionary/tuple containing batched values.</p>
          </div>

          <div className={`p-4 border-2 rounded-xl transition-all duration-500 ${step >= 3 ? 'bg-emerald-50 border-emerald-400 shadow-sm' : 'bg-slate-50 border-slate-200'}`}>
            <h4 className={`font-bold flex items-center gap-2 mb-1 ${step >= 3 ? 'text-emerald-900' : 'text-slate-600'}`}><Layers size={18} className={step >= 3 ? 'text-emerald-500' : 'text-slate-400'}/> 3. Stack Tensors</h4>
            <p className={`text-[10px] leading-relaxed ${step >= 3 ? 'text-emerald-800' : 'text-slate-500'}`}>Stacks the individual tensors along a brand new dimension (the batch dimension, usually dim=0).</p>
          </div>
        </div>

        {/* The Visualizer */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl relative overflow-x-auto min-h-[350px] flex flex-col items-center justify-center p-8 shadow-inner">
           <div className="flex items-center gap-6 w-full max-w-2xl relative z-10 justify-center">
              
              {/* Fetched Samples (List of Tuples) */}
              <div className="flex flex-col items-center gap-2">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">Output from Dataset.__getitem__<br/>(List of 3 items)</span>
                 
                 <div className="bg-white border-2 border-slate-300 p-3 rounded-xl shadow-sm flex items-center gap-4 w-48">
                   <div className="flex-1 bg-blue-100 text-blue-800 border border-blue-300 font-mono text-xs font-bold p-2 rounded text-center">[1, 2]</div>
                   <div className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-xs font-bold p-2 rounded text-center">0</div>
                 </div>
                 <div className="bg-white border-2 border-slate-300 p-3 rounded-xl shadow-sm flex items-center gap-4 w-48">
                   <div className="flex-1 bg-blue-100 text-blue-800 border border-blue-300 font-mono text-xs font-bold p-2 rounded text-center">[3, 4]</div>
                   <div className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-xs font-bold p-2 rounded text-center">1</div>
                 </div>
                 <div className="bg-white border-2 border-slate-300 p-3 rounded-xl shadow-sm flex items-center gap-4 w-48">
                   <div className="flex-1 bg-blue-100 text-blue-800 border border-blue-300 font-mono text-xs font-bold p-2 rounded text-center">[5, 6]</div>
                   <div className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-xs font-bold p-2 rounded text-center">1</div>
                 </div>
              </div>

              {/* The Collate Function Node */}
              <div className="flex flex-col items-center">
                 <div className="h-0.5 w-12 bg-slate-300 relative">
                   <div className={`absolute top-1/2 w-4 h-4 rounded-full bg-orange-400 -translate-y-1/2 transition-all duration-700 ease-in-out ${step >= 1 ? 'left-8 opacity-100' : '-left-4 opacity-0'}`}></div>
                 </div>
              </div>

              <div className={`transition-all duration-500 bg-orange-100 border-2 border-orange-400 p-4 rounded-[100%] shadow-md flex flex-col items-center justify-center text-center w-28 h-28 shrink-0 ${step >= 2 ? 'scale-110 ring-4 ring-orange-200' : 'opacity-50 grayscale'}`}>
                 <Layers size={24} className="text-orange-600 mb-1"/>
                 <span className="font-bold text-orange-900 text-xs">default<br/>collate_fn</span>
              </div>

              <div className="flex flex-col items-center">
                 <div className="h-0.5 w-12 bg-slate-300 relative">
                   <div className={`absolute top-1/2 w-4 h-4 rounded-full bg-orange-400 -translate-y-1/2 transition-all duration-700 ease-in-out ${step >= 3 ? 'left-8 opacity-100' : '-left-4 opacity-0'}`}></div>
                 </div>
              </div>

              {/* Final Batch Tensor */}
              <div className={`transition-all duration-500 flex flex-col items-center gap-2 ${step >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                 <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 text-center bg-emerald-100 px-2 py-1 rounded">Final DataLoader Output<br/>(Single Batched Tuple)</span>
                 
                 <div className="bg-slate-800 border-4 border-slate-700 p-4 rounded-2xl shadow-xl flex items-center gap-4">
                   <div className="flex flex-col items-center">
                     <span className="text-[10px] text-blue-300 uppercase font-bold mb-2">Features<br/>Shape: [3, 2]</span>
                     <div className="bg-blue-100 border-2 border-blue-400 p-2 rounded-lg flex flex-col gap-1 w-20">
                       <div className="bg-blue-200 text-blue-900 font-mono text-xs font-bold p-1 rounded text-center">[1, 2]</div>
                       <div className="bg-blue-200 text-blue-900 font-mono text-xs font-bold p-1 rounded text-center">[3, 4]</div>
                       <div className="bg-blue-200 text-blue-900 font-mono text-xs font-bold p-1 rounded text-center">[5, 6]</div>
                     </div>
                   </div>
                   
                   <span className="text-3xl text-slate-500 font-black">,</span>

                   <div className="flex flex-col items-center">
                     <span className="text-[10px] text-emerald-300 uppercase font-bold mb-2">Labels<br/>Shape: [3]</span>
                     <div className="bg-emerald-100 border-2 border-emerald-400 p-2 rounded-lg flex flex-col gap-1 w-12">
                       <div className="bg-emerald-200 text-emerald-900 font-mono text-xs font-bold p-1 rounded text-center">0</div>
                       <div className="bg-emerald-200 text-emerald-900 font-mono text-xs font-bold p-1 rounded text-center">1</div>
                       <div className="bg-emerald-200 text-emerald-900 font-mono text-xs font-bold p-1 rounded text-center">1</div>
                     </div>
                   </div>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Custom collate_fn (Padding) ---
function CustomCollateSlide() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let t1, t2;
    if (step === 1) t1 = setTimeout(() => setStep(2), 1500); // Fail
    if (step === 3) t2 = setTimeout(() => setStep(4), 1500); // Success
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [step]);

  const pyCode = `import torch
from torch.utils.data import Dataset, DataLoader
from torch.nn.utils.rnn import pad_sequence

# Example Dataset returning variable-length tensors
class VariableSequenceDataset(Dataset):
    def __init__(self, data):
        self.data = data

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        sequence = self.data[idx]
        label = len(sequence)
        return sequence, label

# --- Custom Collate Function ---
def pad_collate(batch):
    # Separate sequences and labels from the list of tuples
    sequences = [item[0] for item in batch]
    labels = [item[1] for item in batch]

    # Pad sequences to the length of the longest sequence in the batch
    # batch_first=True -> shape (batch_size, max_seq_len, features)
    padded_sequences = pad_sequence(sequences, batch_first=True, padding_value=0.0)

    # Stack labels
    labels = torch.tensor(labels)

    return padded_sequences, labels

# Usage
dataset = VariableSequenceDataset(sequences)
dataloader = DataLoader(dataset, batch_size=4, collate_fn=pad_collate)

# for padded_batch, label_batch in dataloader:
#     pass`;

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Custom collate_fn (Padding)</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          If your samples have varying sizes (e.g., sequences of different lengths in NLP), the default collate function will fail because it doesn't know how to stack unaligned tensors. You provide a custom <code>collate_fn</code> to pad them safely.
        </p>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setStep(1)} 
            disabled={step > 0}
            className={`flex-1 py-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all font-bold text-sm ${step === 1 || step === 2 ? 'bg-slate-200 border-slate-400 text-slate-600 shadow-inner' : 'bg-rose-50 border-rose-500 text-rose-700 hover:bg-rose-100 shadow-md'}`}
          >
            Try Default Collate
          </button>
          <button 
            onClick={() => setStep(3)} 
            disabled={step !== 2}
            className={`flex-1 py-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all font-bold text-sm ${step === 2 ? 'bg-emerald-50 border-emerald-500 text-emerald-700 hover:bg-emerald-100 shadow-md' : 'bg-slate-100 border-slate-300 text-slate-400'}`}
          >
            Apply pad_collate
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col flex-1 items-center justify-center relative overflow-hidden min-h-[250px]">
          
          <div className="flex flex-col items-center w-full max-w-sm gap-4">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Variable Length Sequences</span>
             
             {/* Seq 1 (Length 3) */}
             <div className="flex gap-1 justify-start w-full">
               <div className="w-8 h-8 bg-blue-500 text-white font-mono text-xs font-bold flex items-center justify-center rounded">1</div>
               <div className="w-8 h-8 bg-blue-500 text-white font-mono text-xs font-bold flex items-center justify-center rounded">2</div>
               <div className="w-8 h-8 bg-blue-500 text-white font-mono text-xs font-bold flex items-center justify-center rounded">3</div>
               {step >= 4 && <div className="w-8 h-8 bg-slate-200 text-slate-400 border border-slate-400 border-dashed font-mono text-xs font-bold flex items-center justify-center rounded animate-in zoom-in">0</div>}
               {step >= 4 && <div className="w-8 h-8 bg-slate-200 text-slate-400 border border-slate-400 border-dashed font-mono text-xs font-bold flex items-center justify-center rounded animate-in zoom-in delay-75">0</div>}
             </div>

             {/* Seq 2 (Length 5) */}
             <div className="flex gap-1 justify-start w-full">
               <div className="w-8 h-8 bg-blue-500 text-white font-mono text-xs font-bold flex items-center justify-center rounded">4</div>
               <div className="w-8 h-8 bg-blue-500 text-white font-mono text-xs font-bold flex items-center justify-center rounded">5</div>
               <div className="w-8 h-8 bg-blue-500 text-white font-mono text-xs font-bold flex items-center justify-center rounded">6</div>
               <div className="w-8 h-8 bg-blue-500 text-white font-mono text-xs font-bold flex items-center justify-center rounded">7</div>
               <div className="w-8 h-8 bg-blue-500 text-white font-mono text-xs font-bold flex items-center justify-center rounded">8</div>
             </div>

             {/* Seq 3 (Length 2) */}
             <div className="flex gap-1 justify-start w-full">
               <div className="w-8 h-8 bg-blue-500 text-white font-mono text-xs font-bold flex items-center justify-center rounded">9</div>
               <div className="w-8 h-8 bg-blue-500 text-white font-mono text-xs font-bold flex items-center justify-center rounded">10</div>
               {step >= 4 && <div className="w-8 h-8 bg-slate-200 text-slate-400 border border-slate-400 border-dashed font-mono text-xs font-bold flex items-center justify-center rounded animate-in zoom-in delay-100">0</div>}
               {step >= 4 && <div className="w-8 h-8 bg-slate-200 text-slate-400 border border-slate-400 border-dashed font-mono text-xs font-bold flex items-center justify-center rounded animate-in zoom-in delay-150">0</div>}
               {step >= 4 && <div className="w-8 h-8 bg-slate-200 text-slate-400 border border-slate-400 border-dashed font-mono text-xs font-bold flex items-center justify-center rounded animate-in zoom-in delay-200">0</div>}
             </div>

             {/* Status Overlay */}
             {step === 2 && (
               <div className="absolute inset-0 bg-rose-500/10 backdrop-blur-[2px] flex flex-col items-center justify-center animate-in zoom-in-50">
                 <div className="bg-white border-2 border-rose-500 p-4 rounded-xl shadow-xl flex flex-col items-center text-center">
                   <AlertTriangle size={32} className="text-rose-600 mb-2"/>
                   <span className="font-bold text-rose-800">RuntimeError</span>
                   <span className="text-xs text-rose-600 mt-1 max-w-[200px]">Stack expects each tensor to be equal size, but got [3], [5], and [2].</span>
                   <button onClick={() => setStep(0)} className="mt-4 px-4 py-1.5 bg-rose-100 text-rose-800 text-xs font-bold rounded border border-rose-300 hover:bg-rose-200">Reset</button>
                 </div>
               </div>
             )}

             {step === 4 && (
               <div className="absolute inset-2 border-4 border-emerald-400 rounded-xl pointer-events-none animate-in fade-in flex items-start justify-end p-2">
                 <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded shadow-sm">Batched Tensor [3, 5]</span>
               </div>
             )}
          </div>
          
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[10px] sm:text-[11px] text-slate-300 flex-1 overflow-y-auto min-h-[350px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400 font-mono">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100 overflow-x-auto">
{pyCode}
          </pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 4: DataLoader Arguments Summary ---
function SummarySlide() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <h3 className="text-xl font-bold mb-4">Other Customization Arguments</h3>
      <p className="text-slate-600 mb-6 leading-relaxed text-sm">
        Besides <code>sampler</code> and <code>collate_fn</code>, other arguments offer performance and behavior tuning.
      </p>

      <div className="grid md:grid-cols-1 gap-4 flex-1 max-w-4xl">
        
        <div className="bg-white border-2 border-blue-200 rounded-xl p-5 shadow-sm hover:border-blue-400 transition-colors">
          <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2 font-mono text-lg"><Layers size={20} className="text-blue-500"/> num_workers</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Specifies how many subprocesses to use for data loading. Setting this to a positive integer enables <strong>multi-process data loading</strong>, which can significantly speed up data fetching, especially if loading involves disk I/O or non-trivial CPU preprocessing. A common starting point is setting it to the number of CPU cores available. Default is <code>0</code> (main process only).
          </p>
        </div>

        <div className="bg-white border-2 border-emerald-200 rounded-xl p-5 shadow-sm hover:border-emerald-400 transition-colors">
          <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2 font-mono text-lg"><Zap size={20} className="text-emerald-500"/> pin_memory</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            If <code>True</code>, the DataLoader will copy tensors into CUDA pinned (page-locked) memory before returning them. Pinned memory enables <strong>faster data transfer from CPU to GPU</strong>. This is only effective if you are actually training on a GPU. Default is <code>False</code>.
          </p>
        </div>

        <div className="bg-white border-2 border-rose-200 rounded-xl p-5 shadow-sm hover:border-rose-400 transition-colors">
          <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-2 font-mono text-lg"><Trash2 size={20} className="text-rose-500"/> drop_last</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            If <code>True</code>, drops the <strong>last incomplete batch</strong> if the dataset size is not divisible by the batch size. If <code>False</code> (default), the last batch might be smaller than <code>batch_size</code>.
          </p>
        </div>

      </div>
    </div>
  );
}