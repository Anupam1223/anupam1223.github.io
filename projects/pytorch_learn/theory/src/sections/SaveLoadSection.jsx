import React, { useState, useEffect } from 'react';
import { 
  Save, ChevronLeft, ChevronRight, Code, Terminal, 
  HardDrive, Download, Database, AlertTriangle, CheckCircle2, 
  Box, FileJson, Cpu, Zap, ArrowRight, PlayCircle, Lock, RefreshCw, Pointer, XCircle
} from 'lucide-react';

export default function CheckpointSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'what', title: 'What to Save (state_dict)', component: StateDictSlide },
    { id: 'save', title: 'Saving Checkpoints', component: SaveSlide },
    { id: 'inference', title: 'Loading for Inference', component: InferenceSlide },
    { id: 'resume', title: 'Resuming Training', component: ResumeSlide },
    { id: 'device', title: 'Device Mapping (CPU/GPU)', component: DeviceMapSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Save size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Saving & Loading Checkpoints</h2>
        <p className="text-slate-400 text-sm mb-4">Preserving model progress, states, and ensuring safe recovery</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[20px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-emerald-400 whitespace-nowrap font-bold' : 'hidden md:inline whitespace-nowrap'}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: What to save (state_dict vs Pickle) ---
function StateDictSlide() {
  const [view, setView] = useState('state_dict'); // 'pickle' or 'state_dict'

  const pyCode = {
    'pickle': `# BAD PRACTICE: Saving the entire model object
torch.save(model, 'entire_model.pth')

# Later, in a different file or after modifying the class:
# This might fail if 'YourModelClass' has been refactored!
loaded_model = torch.load('entire_model.pth')`,
    'state_dict': `# GOOD PRACTICE: Saving only the parameters
# Returns a dictionary mapping layer names to parameter tensors
weights_dict = model.state_dict()
torch.save(weights_dict, 'model_weights.pth')

# Optimizers also have state_dicts! (Momentum, adaptive rates)
opt_dict = optimizer.state_dict()
print(weights_dict.keys())`
  };

  const outCode = {
    'pickle': `AttributeError: Can't get attribute 'YourModelClass' on <module '__main__'>`,
    'state_dict': `odict_keys(['layer1.weight', 'layer1.bias', 'layer2.weight', 'layer2.bias'])`
  };

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">What Should Be Saved?</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          A checkpoint captures the state of your training process. PyTorch models and Optimizers both have an internal <code>state_dict()</code>, which is a Python dictionary containing all learned parameters (weights, biases, momentum buffers).
        </p>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setView('pickle')}
            className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${view === 'pickle' ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <span className="font-bold text-sm flex items-center gap-2"><AlertTriangle size={16}/> Pickle Entire Model</span>
            <span className="text-[10px] uppercase font-bold text-rose-500">Fragile</span>
          </button>

          <button 
            onClick={() => setView('state_dict')}
            className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${view === 'state_dict' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <span className="font-bold text-sm flex items-center gap-2"><CheckCircle2 size={16}/> Save state_dict()</span>
            <span className="text-[10px] uppercase font-bold text-emerald-600">Recommended</span>
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col flex-1 items-center justify-center relative overflow-hidden min-h-[250px]">
          
          {view === 'pickle' ? (
            <div className="flex flex-col items-center animate-in zoom-in-95">
               <p className="text-xs text-rose-800 bg-rose-100 px-4 py-2 rounded-lg border border-rose-200 mb-6 text-center leading-relaxed font-medium">
                 Pickling saves the specific Python <strong>code structure</strong> along with the weights. If you refactor your class definition later, loading the object will break!
               </p>
               <div className="relative">
                 <div className="w-48 h-32 bg-white border-2 border-rose-400 rounded-xl shadow-md flex flex-col overflow-hidden">
                    <div className="bg-slate-800 text-white text-[10px] font-mono p-2">class MyModel(nn.Module):</div>
                    <div className="flex-1 bg-rose-50 flex items-center justify-center text-rose-800 font-mono text-sm font-bold border-t-2 border-dashed border-rose-300">
                      [Tied Together]
                    </div>
                 </div>
                 <XCircle className="absolute -top-4 -right-4 text-rose-500 bg-white rounded-full" size={32} />
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in zoom-in-95">
               <p className="text-xs text-emerald-800 bg-emerald-100 px-4 py-2 rounded-lg border border-emerald-200 mb-6 text-center leading-relaxed font-medium">
                 Saving the <code>state_dict()</code> cleanly separates the learned parameters from the code. It is just a dictionary of named tensors, making it highly reliable.
               </p>
               <div className="relative w-full flex justify-center">
                 <div className="w-48 bg-white border-2 border-emerald-400 rounded-xl shadow-md flex flex-col p-3 gap-2">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest text-center border-b border-emerald-100 pb-2">Dictionary</span>
                    <div className="flex justify-between items-center text-[10px] font-mono bg-emerald-50 px-2 py-1 rounded">
                      <span className="text-slate-600">'layer1.weight':</span> <span className="text-emerald-700 font-bold">Tensor</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono bg-emerald-50 px-2 py-1 rounded">
                      <span className="text-slate-600">'layer1.bias':</span> <span className="text-emerald-700 font-bold">Tensor</span>
                    </div>
                 </div>
               </div>
            </div>
          )}
          
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode[view]}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[150px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className={`whitespace-pre-wrap ${view === 'pickle' ? 'text-rose-400' : 'text-emerald-400'}`}>{outCode[view]}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: Saving Checkpoints ---
function SaveSlide() {
  const [step, setStep] = useState(0);

  const pyCode = `# Assume model, optimizer, epoch, loss are defined
PATH = "checkpoint_epoch_10.pth" 

# 1 & 2. Create the checkpoint dictionary
checkpoint = {
    'epoch': epoch + 1,                 # Next epoch to start from
    'model_state_dict': model.state_dict(),
    'optimizer_state_dict': optimizer.state_dict(),
    'loss': loss,                       # Current loss
}

# 3. Serialize and save to disk
torch.save(checkpoint, PATH)

print(f"Checkpoint saved to {PATH}")`;

  return (
    <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Saving Checkpoints (torch.save)</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          To save a proper checkpoint, we construct a master dictionary containing the model's weights, the optimizer's momentum states, and metadata (like the epoch). Then, <code>torch.save()</code> serializes it to disk.
        </p>

        <button 
          onClick={() => setStep(s => (s + 1) % 4)} 
          className="w-full py-3 mb-6 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow hover:bg-emerald-700 transition-all flex justify-center items-center gap-2 flex-shrink-0"
        >
          {step === 0 ? "Step 1: Gather States" : step === 1 ? "Step 2: Build Checkpoint Dict" : step === 2 ? "Step 3: torch.save(dict, PATH)" : "Saved! (Click to Reset)"} <Pointer size={16}/>
        </button>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col flex-1 items-center justify-center relative overflow-hidden min-h-[300px]">
          
          <div className="flex w-full items-center justify-around mb-8 h-24">
             {/* Component 1 */}
             <div className={`flex flex-col items-center transition-all duration-500 z-10 ${step >= 1 ? 'translate-y-12 scale-75 opacity-50' : ''}`}>
               <Box className="text-indigo-500 mb-1" size={24}/>
               <span className="text-[10px] font-bold text-slate-600">model.state_dict()</span>
             </div>
             {/* Component 2 */}
             <div className={`flex flex-col items-center transition-all duration-500 z-10 ${step >= 1 ? 'translate-y-12 scale-75 opacity-50' : ''}`}>
               <RefreshCw className="text-amber-500 mb-1" size={24}/>
               <span className="text-[10px] font-bold text-slate-600">optimizer.state_dict()</span>
             </div>
             {/* Component 3 */}
             <div className={`flex flex-col items-center transition-all duration-500 z-10 ${step >= 1 ? 'translate-y-12 scale-75 opacity-50' : ''}`}>
               <Database className="text-rose-500 mb-1" size={24}/>
               <span className="text-[10px] font-bold text-slate-600">epoch: 10, loss: 0.4</span>
             </div>
          </div>

          <div className="relative w-full flex flex-col items-center justify-center">
             
             {/* Master Dictionary */}
             <div className={`w-48 bg-white border-2 border-emerald-400 p-3 rounded-xl shadow-lg flex flex-col items-center transition-all duration-500 absolute z-20
                ${step === 0 ? 'opacity-0 scale-50' : step === 1 ? 'opacity-100 scale-100' : 'translate-y-[80px] opacity-100 scale-90'}`}>
                <FileJson className="text-emerald-500 mb-1" size={24}/>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">checkpoint (dict)</span>
             </div>

             {/* Arrow Down */}
             <div className={`w-0.5 h-16 bg-slate-300 transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}></div>

             {/* Hard Drive */}
             <div className={`w-40 bg-slate-800 border-4 border-slate-600 p-4 rounded-xl flex flex-col items-center transition-all duration-500 z-30 mt-2
                ${step >= 2 ? 'opacity-100 scale-100 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'opacity-50 scale-90'}`}>
                <HardDrive className={`${step === 3 ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} size={32} />
                <span className="text-xs font-bold text-white mt-2 font-mono">ckpt.pth</span>
             </div>

          </div>

        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[400px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Loading for Inference ---
function InferenceSlide() {
  const [step, setStep] = useState(0);

  const pyCode = `# 1. MUST instantiate the blank model structure first!
model = YourModelClass()

PATH = "checkpoint.pth"

# 2. Load the dictionary from disk
checkpoint = torch.load(PATH)

# 3. Inject the weights into the existing model object
model.load_state_dict(checkpoint['model_state_dict'])

# 4. Set model to evaluation mode
# VERY IMPORTANT! Disables dropout, fixes batchnorm.
model.eval()

# Model is ready for predictions
with torch.no_grad():
    predictions = model(new_inputs)`;

  return (
    <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Loading for Inference</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          If you only need to make predictions, you only care about the <code>model_state_dict</code>. 
          <br/><br/>
          <strong>Crucial Concept:</strong> <code>load_state_dict()</code> injects parameters into an <em>existing</em> object; it does not magically create the model for you.
        </p>

        <button 
          onClick={() => setStep(s => (s + 1) % 5)} 
          className="w-full py-3 mb-6 bg-blue-600 text-white rounded-lg text-sm font-bold shadow hover:bg-blue-700 transition-all flex justify-center items-center gap-2 flex-shrink-0"
        >
          {step === 0 ? "1. Init Blank Model" : step === 1 ? "2. Load Dictionary" : step === 2 ? "3. Inject Weights" : step === 3 ? "4. Enter model.eval()" : "Ready! (Click to Reset)"} <Pointer size={16}/>
        </button>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col flex-1 items-center justify-center relative overflow-hidden min-h-[300px]">
          
          <div className="flex flex-col items-center justify-center w-full gap-6">
             
             <div className="flex w-full items-center justify-between px-4">
                {/* Disk Side */}
                <div className="flex flex-col items-center gap-2 w-1/3">
                   <div className="w-16 bg-slate-800 border-2 border-slate-600 p-2 rounded-lg flex flex-col items-center shadow-md">
                      <HardDrive className="text-slate-400 mb-1" size={20} />
                   </div>
                   <span className={`text-[10px] font-bold uppercase transition-opacity ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>checkpoint</span>
                   
                   {/* The Weights Payload */}
                   <div className={`bg-emerald-100 border-2 border-emerald-400 text-emerald-800 p-2 rounded-lg text-[9px] font-bold font-mono shadow-sm transition-all duration-700 z-20 absolute
                     ${step === 0 ? 'opacity-0 top-[80px] left-[50px] scale-50' : 
                       step === 1 ? 'opacity-100 top-[80px] left-[50px] scale-100' : 
                       'opacity-100 top-[80px] left-[calc(100%-90px)] scale-100'}`}>
                      Trained<br/>Weights
                   </div>
                </div>

                <ArrowRight size={24} className={`text-slate-300 transition-opacity ${step >= 1 ? 'opacity-100' : 'opacity-0'}`} />

                {/* Model Side */}
                <div className="flex flex-col items-center gap-2 w-1/3 relative z-10">
                   <div className={`w-24 h-24 border-4 rounded-xl flex flex-col items-center justify-center transition-all duration-500 shadow-md bg-white
                     ${step === 0 ? 'border-blue-400 border-dashed' : step === 1 ? 'border-blue-400' : step === 2 ? 'border-emerald-500 bg-emerald-50' : 'border-purple-500 bg-purple-50'}`}>
                     <Box className={`mb-1 ${step >= 3 ? 'text-purple-500' : 'text-blue-500'}`} size={28} />
                     <span className="text-[10px] font-bold text-slate-600">Model Object</span>
                     {step >= 3 && <span className="absolute -bottom-3 bg-purple-100 text-purple-700 text-[8px] font-bold px-2 py-1 rounded border border-purple-300 uppercase tracking-widest"><Lock size={8} className="inline mr-0.5"/> Eval Mode</span>}
                   </div>
                </div>
             </div>

             <div className="h-10 mt-4 flex items-center justify-center">
                {step === 0 && <span className="text-[10px] text-slate-500 font-mono bg-white px-2 py-1 border rounded shadow-sm">model = MyModel() # Random weights</span>}
                {step === 1 && <span className="text-[10px] text-slate-500 font-mono bg-white px-2 py-1 border rounded shadow-sm">ckpt = torch.load('file.pth')</span>}
                {step === 2 && <span className="text-[10px] text-emerald-700 font-bold font-mono bg-emerald-100 border border-emerald-300 px-2 py-1 rounded shadow-sm animate-pulse">model.load_state_dict(...)</span>}
                {step === 3 && <span className="text-[10px] text-purple-700 font-bold font-mono bg-purple-100 border border-purple-300 px-2 py-1 rounded shadow-sm animate-pulse">model.eval() # Fixes BatchNorm/Dropout</span>}
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[400px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 4: Resuming Training ---
function ResumeSlide() {
  const pyCode = `# 1. Instantiate model and optimizer FIRST
model = YourModelClass()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# Variables to hold metadata
start_epoch = 0

if os.path.exists(PATH):
    # 2. Load Dictionary
    checkpoint = torch.load(PATH)
    
    # 3. Inject States
    model.load_state_dict(checkpoint['model_state_dict'])
    optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
    
    # 4. Retrieve Metadata
    start_epoch = checkpoint['epoch']
    print(f"Resuming from epoch {start_epoch}")

# 5. Set model to training mode!
model.train()

# 6. Resume Loop
for epoch in range(start_epoch, num_epochs):
    # ... training steps ...`;

  return (
    <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Loading to Resume Training</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          If your computer crashes during a 3-day training run, you don't want to start over. Resuming requires injecting states into <strong>both</strong> the Model and the Optimizer, and grabbing the last epoch counter.
        </p>

        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col justify-center gap-4 relative overflow-hidden min-h-[300px]">
           
           <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-left-4">
             <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><Download size={20}/></div>
             <div className="flex-1">
               <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Load Dict</span>
               <span className="font-mono text-sm text-slate-800 font-bold">checkpoint = torch.load()</span>
             </div>
           </div>

           <div className="flex gap-4 w-full">
             <div className="flex-1 flex flex-col gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-left-4 delay-75">
               <span className="font-mono text-[10px] text-blue-500 font-bold uppercase tracking-widest">model_state</span>
               <span className="font-mono text-[10px] text-slate-600 font-bold bg-blue-50 p-1 rounded">model.load_state_dict()</span>
             </div>
             <div className="flex-1 flex flex-col gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-left-4 delay-150">
               <span className="font-mono text-[10px] text-amber-500 font-bold uppercase tracking-widest">opt_state</span>
               <span className="font-mono text-[10px] text-slate-600 font-bold bg-amber-50 p-1 rounded">optimizer.load_state_dict()</span>
             </div>
           </div>

           <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-left-4 delay-300">
             <div className="flex-1 flex flex-col">
               <span className="font-mono text-[10px] text-rose-500 font-bold uppercase tracking-widest block mb-1">Metadata</span>
               <span className="font-mono text-[10px] text-slate-600 font-bold bg-rose-50 p-1 rounded">start_epoch = checkpoint['epoch']</span>
             </div>
           </div>

           <div className="mt-4 bg-teal-50 border border-teal-200 p-3 rounded-xl text-center shadow-sm animate-in slide-in-from-bottom-4 delay-500">
             <span className="text-[11px] font-bold text-teal-800 uppercase tracking-widest">Finally: model.train()</span>
           </div>

        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[400px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 5: Device Mapping ---
function DeviceMapSlide() {
  const [useMap, setUseMap] = useState(false);

  const pyCode = `# Best practice: Dynamically find the available device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load the dictionary, mapping all tensors inside to the new device
checkpoint = torch.load(PATH, map_location=device)

model.load_state_dict(checkpoint['model_state_dict'])

# Don't forget to also move your model shell to the device!
model.to(device)`;

  return (
    <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Device Mapping (CPU/GPU)</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          By default, <code>torch.load()</code> attempts to put tensors back onto the exact device they were saved from. If you trained on a GPU and try to load on a laptop CPU, PyTorch will crash.
        </p>

        <button 
          onClick={() => setUseMap(!useMap)} 
          className={`w-full py-3 mb-6 text-white rounded-lg text-sm font-bold shadow transition-all flex justify-center items-center gap-2 flex-shrink-0 ${useMap ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-500 hover:bg-slate-600'}`}
        >
          {useMap ? "With map_location='cpu'" : "Default Load (No map_location)"} <RefreshCw size={16}/>
        </button>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col flex-1 items-center justify-center relative overflow-hidden min-h-[250px]">
          
          <div className="flex w-full items-center justify-between relative z-10 px-4">
             {/* Saved File */}
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Saved File</span>
                <div className="w-16 h-20 bg-slate-800 rounded-lg shadow-md flex flex-col items-center justify-center border-2 border-slate-600">
                  <span className="text-white font-mono text-xs font-bold">.pth</span>
                  <span className="bg-amber-500 text-amber-900 text-[8px] font-bold px-1 rounded mt-2">cuda:0 tag</span>
                </div>
             </div>

             <ArrowRight className="text-slate-300" size={24} />

             {/* Interceptor */}
             <div className="flex flex-col items-center relative h-32 justify-center w-32">
                {useMap ? (
                  <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-800 p-2 rounded-xl text-center shadow-lg animate-in zoom-in-95 absolute z-20">
                     <span className="text-[10px] font-mono font-bold block mb-1">map_location</span>
                     <span className="text-xs font-bold uppercase flex items-center gap-1"><Cpu size={12}/> To CPU</span>
                  </div>
                ) : (
                  <div className="w-full border-t-2 border-dashed border-slate-300 absolute top-1/2 -translate-y-1/2 z-0"></div>
                )}
             </div>

             <ArrowRight className="text-slate-300" size={24} />

             {/* Destination */}
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Target PC</span>
                <div className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center shadow-md border-4 transition-colors duration-500
                  ${useMap ? 'bg-blue-50 border-blue-400 text-blue-800' : 'bg-rose-50 border-rose-400 text-rose-800'}`}>
                  {useMap ? <Cpu size={32} /> : <AlertTriangle size={32} className="text-rose-500 animate-pulse" />}
                  {useMap && <span className="text-[10px] font-bold uppercase mt-1">CPU RAM</span>}
                </div>
             </div>
          </div>

          <div className="mt-8 h-12 w-full flex items-center justify-center text-center">
            {useMap ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-4 py-2 rounded-lg border border-emerald-200 animate-in slide-in-from-bottom-2">
                Success! Tensors safely remapped to CPU RAM.
              </span>
            ) : (
              <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-4 py-2 rounded-lg border border-rose-200 animate-in slide-in-from-bottom-2">
                RuntimeError: Attempting to deserialize object on a CUDA device but torch.cuda.is_available() is False.
              </span>
            )}
          </div>

        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[400px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Best Practice Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
      </div>
    </div>
  );
}