import React, { useState, useEffect } from 'react';
import { 
  ListOrdered, ChevronLeft, ChevronRight, Code, Terminal, 
  Layers, CheckCircle2, ArrowRight, PlayCircle, GitMerge, 
  XCircle, Zap, ShieldAlert, Cpu, Blocks, Pointer
} from 'lucide-react';

export default function SequentialSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'basic', title: 'Defining with nn.Sequential', component: BasicSequentialSlide },
    { id: 'named', title: 'Naming Layers (OrderedDict)', component: NamedLayersSlide },
    { id: 'pipeline', title: 'Visualizing the Pipeline', component: PipelineSlide },
    { id: 'limits', title: 'Pros & Limitations', component: LimitationsSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <ListOrdered size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Sequential Containers</h2>
        <p className="text-slate-400 text-sm mb-4">Building simple linear pipelines with torch.nn.Sequential</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-emerald-400 whitespace-nowrap' : 'hidden md:inline whitespace-nowrap'}>
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

// --- Slide 1: Basic Sequential ---
function BasicSequentialSlide() {
  const pyCode = `import torch
import torch.nn as nn

# Define dimensions (e.g., Flattened MNIST to 10 classes)
input_size = 784
hidden_size = 128
output_size = 10

# Method 1: Passing modules directly as arguments
model_v1 = nn.Sequential(
    nn.Linear(input_size, hidden_size), # Layer 1: Linear transformation
    nn.ReLU(),                          # Activation 1: Non-linearity
    nn.Linear(hidden_size, output_size) # Layer 2: Linear transformation
)

# Print the model structure
print("Model V1 (Unnamed Layers):")
print(model_v1)

# Example Usage: Assume a batch size of 64
dummy_input = torch.randn(64, input_size) 
output = model_v1(dummy_input)

print("\\nOutput shape:", output.shape) # Expected: torch.Size([64, 10])`;

  const outCode = `Model V1 (Unnamed Layers):
Sequential(
  (0): Linear(in_features=784, out_features=128, bias=True)
  (1): ReLU()
  (2): Linear(in_features=128, out_features=10, bias=True)
)

Output shape: torch.Size([64, 10])`;

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Defining Models with nn.Sequential</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          For straightforward models where the output of one layer feeds directly into the next, <code>nn.Sequential</code> acts as a convenient wrapper. It automatically handles the <code>forward</code> pass for you, saving you from writing custom data flow logic.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center flex-1 relative overflow-hidden min-h-[250px]">
          
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">The Automated Pipeline</h4>
          
          <div className="flex flex-col items-center gap-2 w-full max-w-xs relative z-10">
             <div className="w-full flex items-center justify-between bg-white border-2 border-slate-200 p-3 rounded-lg shadow-sm">
                <span className="font-mono text-xs font-bold text-slate-500">Index: 0</span>
                <span className="font-mono text-sm font-bold text-emerald-700">nn.Linear(784, 128)</span>
             </div>
             
             <ArrowRight size={20} className="text-slate-300 rotate-90"/>
             
             <div className="w-full flex items-center justify-between bg-white border-2 border-slate-200 p-3 rounded-lg shadow-sm">
                <span className="font-mono text-xs font-bold text-slate-500">Index: 1</span>
                <span className="font-mono text-sm font-bold text-purple-700">nn.ReLU()</span>
             </div>
             
             <ArrowRight size={20} className="text-slate-300 rotate-90"/>
             
             <div className="w-full flex items-center justify-between bg-white border-2 border-slate-200 p-3 rounded-lg shadow-sm">
                <span className="font-mono text-xs font-bold text-slate-500">Index: 2</span>
                <span className="font-mono text-sm font-bold text-emerald-700">nn.Linear(128, 10)</span>
             </div>
          </div>
          
          <div className="mt-8 bg-amber-50 text-amber-800 text-xs px-4 py-3 border border-amber-200 rounded-lg text-center leading-relaxed shadow-sm">
             <strong>Notice:</strong> Because we passed them as a simple list of arguments, PyTorch automatically assigned them numerical indices <code>(0)</code>, <code>(1)</code>, and <code>(2)</code>.
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto min-h-[250px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Python Code</span></div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-emerald-100 leading-relaxed overflow-x-auto">
{pyCode}
          </pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[200px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap overflow-x-auto">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: Naming Layers (OrderedDict) ---
function NamedLayersSlide() {
  const [view, setView] = useState('named');

  const pyCode = {
    'unnamed': `model_v1 = nn.Sequential(
    nn.Linear(784, 128),
    nn.ReLU(),
    nn.Linear(128, 10)
)

# Accessing layers is clunky:
print("Accessing first layer:", model_v1[0])
print("Accessing weights:", model_v1[0].weight.shape)`,
    
    'named': `from collections import OrderedDict

# Method 2: Using an OrderedDict for named layers
model_v2 = nn.Sequential(OrderedDict([
    ('fc1', nn.Linear(input_size, hidden_size)),   # Fully connected 1
    ('relu1', nn.ReLU()),                          # ReLU activation
    ('fc2', nn.Linear(hidden_size, output_size))   # Fully connected 2
]))

print("\\nModel V2 (Named Layers):")
print(model_v2)

# Accessing a specific layer by name is now possible!
print("\\nAccessing fc1 weights shape:", model_v2.fc1.weight.shape)

# You can also still access using integer indices if needed
print("Accessing layer at index 0:", model_v2[0])

# Or by the string name directly
print("Accessing layer by name 'relu1':", model_v2.relu1)`
  };

  const outCode = {
    'unnamed': `Accessing first layer: Linear(in_features=784, out_features=128, bias=True)\nAccessing weights: torch.Size([128, 784])`,
    'named': `Model V2 (Named Layers):
Sequential(
  (fc1): Linear(in_features=784, out_features=128, bias=True)
  (relu1): ReLU()
  (fc2): Linear(in_features=128, out_features=10, bias=True)
)

Accessing fc1 weights shape: torch.Size([128, 784])
Accessing layer at index 0: Linear(in_features=784, out_features=128, bias=True)
Accessing layer by name 'relu1': ReLU()`
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Naming Layers with OrderedDict</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Instead of relying on numerical indices (0, 1, 2), passing an <code>OrderedDict</code> into <code>nn.Sequential</code> allows you to assign specific string names to your layers, significantly improving code readability and debugging.
        </p>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setView('unnamed')}
            className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${view === 'unnamed' ? 'bg-slate-100 border-slate-400 text-slate-800 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <span className="font-bold text-sm">Unnamed (List)</span>
            <span className="text-[10px] uppercase font-mono">model[0]</span>
          </button>

          <button 
            onClick={() => setView('named')}
            className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${view === 'named' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-300'}`}
          >
            <span className="font-bold text-sm">Named (OrderedDict)</span>
            <span className="text-[10px] uppercase font-mono">model.fc1</span>
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col flex-1 items-center justify-center relative overflow-hidden min-h-[250px]">
          
          <div className="flex flex-col w-full max-w-sm gap-3">
             {view === 'unnamed' ? (
               <>
                 <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200 animate-in slide-in-from-left-4">
                   <div className="bg-slate-200 text-slate-600 font-mono font-bold px-3 py-1 rounded">0</div>
                   <div className="flex-1 font-mono text-sm font-bold text-slate-700">nn.Linear(...)</div>
                 </div>
                 <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200 animate-in slide-in-from-left-4 delay-75">
                   <div className="bg-slate-200 text-slate-600 font-mono font-bold px-3 py-1 rounded">1</div>
                   <div className="flex-1 font-mono text-sm font-bold text-slate-700">nn.ReLU()</div>
                 </div>
                 <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200 animate-in slide-in-from-left-4 delay-150">
                   <div className="bg-slate-200 text-slate-600 font-mono font-bold px-3 py-1 rounded">2</div>
                   <div className="flex-1 font-mono text-sm font-bold text-slate-700">nn.Linear(...)</div>
                 </div>
               </>
             ) : (
               <>
                 <div className="flex items-center gap-4 bg-white p-3 rounded-lg border-2 border-emerald-200 shadow-sm animate-in slide-in-from-right-4">
                   <div className="bg-emerald-100 text-emerald-800 font-mono font-bold px-3 py-1 rounded w-20 text-center">'fc1'</div>
                   <div className="flex-1 font-mono text-sm font-bold text-slate-700">nn.Linear(...)</div>
                 </div>
                 <div className="flex items-center gap-4 bg-white p-3 rounded-lg border-2 border-emerald-200 shadow-sm animate-in slide-in-from-right-4 delay-75">
                   <div className="bg-emerald-100 text-emerald-800 font-mono font-bold px-3 py-1 rounded w-20 text-center">'relu1'</div>
                   <div className="flex-1 font-mono text-sm font-bold text-slate-700">nn.ReLU()</div>
                 </div>
                 <div className="flex items-center gap-4 bg-white p-3 rounded-lg border-2 border-emerald-200 shadow-sm animate-in slide-in-from-right-4 delay-150">
                   <div className="bg-emerald-100 text-emerald-800 font-mono font-bold px-3 py-1 rounded w-20 text-center">'fc2'</div>
                   <div className="flex-1 font-mono text-sm font-bold text-slate-700">nn.Linear(...)</div>
                 </div>
               </>
             )}
          </div>
          
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto min-h-[250px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Python Code</span></div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-emerald-100 leading-relaxed overflow-x-auto">
{pyCode[view]}
          </pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[250px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap overflow-x-auto">{outCode[view]}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Visualizing the Pipeline (Recreation of Screenshot) ---
function PipelineSlide() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step > 0 && step < 5) {
      const timer = setTimeout(() => {
        setStep(s => s + 1);
      }, 800); // Auto-advance animation
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold mb-2">Visualizing the Sequential Pipeline</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            <code>nn.Sequential</code> loops through its modules automatically, feeding the output of one directly into the input of the next.
          </p>
        </div>
        <button 
          onClick={() => setStep(step === 0 || step === 5 ? 1 : 0)} 
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow hover:bg-emerald-700 transition-all flex items-center gap-2"
        >
          {step === 0 || step === 5 ? "Trigger Data Flow" : "Reset Pipeline"} <PlayCircle size={18} />
        </button>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center flex-1 relative overflow-hidden min-h-[350px]">
         
         {/* Diagram Area - Matches the white background part of the screenshot */}
         <div className="w-full flex-1 flex items-center justify-center py-12 px-4 overflow-x-auto">
            <div className="flex items-center min-w-max relative">
                
                {/* Input Oval */}
                <div className={`w-36 h-24 rounded-[100%] bg-[#d9e0e7] flex flex-col items-center justify-center text-slate-800 shadow-sm z-10 transition-all duration-300 ${step === 1 ? 'ring-4 ring-emerald-400 scale-105' : ''}`}>
                    <span className="font-sans text-sm">Input</span>
                    <span className="font-sans text-sm">(Batch, 784)</span>
                </div>

                {/* Arrow 1 */}
                <div className="w-12 flex items-center relative overflow-hidden h-6">
                    <div className="w-full h-0.5 bg-slate-500"></div>
                    <div className="absolute right-0 top-1/2 w-2 h-2 border-t-2 border-r-2 border-slate-500 transform rotate-45 -translate-y-1/2"></div>
                    {/* Animated Payload */}
                    <div className={`absolute top-1/2 w-4 h-4 rounded-full bg-emerald-500 -translate-y-1/2 transition-all duration-500 ease-in-out ${step >= 1 ? 'left-8 opacity-100' : '-left-4 opacity-0'} ${step > 1 ? 'opacity-0' : ''}`}></div>
                </div>

                {/* Dashed Sequential Container */}
                <div className="relative border-[2px] border-dashed border-slate-400 p-6 flex items-center bg-white z-0">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3 text-slate-800 font-sans text-sm whitespace-nowrap">
                        nn.Sequential Container
                    </div>

                    {/* fc1 */}
                    <div className={`bg-[#bce0fd] px-6 py-8 flex items-center justify-center font-sans text-sm text-slate-800 shadow-sm min-w-[200px] z-10 transition-all duration-300 ${step === 2 ? 'ring-4 ring-emerald-400 scale-105' : ''}`}>
                        fc1: nn.Linear(784, 128)
                    </div>

                    {/* Arrow 2 */}
                    <div className="w-12 flex items-center relative overflow-hidden h-6">
                        <div className="w-full h-0.5 bg-slate-500"></div>
                        <div className="absolute right-0 top-1/2 w-2 h-2 border-t-2 border-r-2 border-slate-500 transform rotate-45 -translate-y-1/2"></div>
                        <div className={`absolute top-1/2 w-4 h-4 rounded-full bg-emerald-500 -translate-y-1/2 transition-all duration-500 ease-in-out ${step >= 2 ? 'left-8 opacity-100' : '-left-4 opacity-0'} ${step > 2 ? 'opacity-0' : ''}`}></div>
                    </div>

                    {/* relu1 */}
                    <div className={`bg-[#bce0fd] px-6 py-8 flex items-center justify-center font-sans text-sm text-slate-800 shadow-sm min-w-[150px] z-10 transition-all duration-300 ${step === 3 ? 'ring-4 ring-emerald-400 scale-105' : ''}`}>
                        relu1: nn.ReLU()
                    </div>

                    {/* Arrow 3 */}
                    <div className="w-12 flex items-center relative overflow-hidden h-6">
                        <div className="w-full h-0.5 bg-slate-500"></div>
                        <div className="absolute right-0 top-1/2 w-2 h-2 border-t-2 border-r-2 border-slate-500 transform rotate-45 -translate-y-1/2"></div>
                        <div className={`absolute top-1/2 w-4 h-4 rounded-full bg-emerald-500 -translate-y-1/2 transition-all duration-500 ease-in-out ${step >= 3 ? 'left-8 opacity-100' : '-left-4 opacity-0'} ${step > 3 ? 'opacity-0' : ''}`}></div>
                    </div>

                    {/* fc2 */}
                    <div className={`bg-[#bce0fd] px-6 py-8 flex items-center justify-center font-sans text-sm text-slate-800 shadow-sm min-w-[200px] z-10 transition-all duration-300 ${step === 4 ? 'ring-4 ring-emerald-400 scale-105' : ''}`}>
                        fc2: nn.Linear(128, 10)
                    </div>
                </div>

                {/* Arrow 4 */}
                <div className="w-12 flex items-center relative overflow-hidden h-6">
                    <div className="w-full h-0.5 bg-slate-500"></div>
                    <div className="absolute right-0 top-1/2 w-2 h-2 border-t-2 border-r-2 border-slate-500 transform rotate-45 -translate-y-1/2"></div>
                    <div className={`absolute top-1/2 w-4 h-4 rounded-full bg-emerald-500 -translate-y-1/2 transition-all duration-500 ease-in-out ${step >= 4 ? 'left-8 opacity-100' : '-left-4 opacity-0'} ${step > 4 ? 'opacity-0' : ''}`}></div>
                </div>

                {/* Output Oval */}
                <div className={`w-36 h-24 rounded-[100%] bg-[#d9e0e7] flex flex-col items-center justify-center text-slate-800 shadow-sm z-10 transition-all duration-300 ${step === 5 ? 'ring-4 ring-emerald-400 scale-105 bg-emerald-100' : ''}`}>
                    <span className="font-sans text-sm">Output</span>
                    <span className="font-sans text-sm">(Batch, 10)</span>
                </div>

            </div>
         </div>

         {/* Caption Area - Matches the dark background part of the screenshot */}
         <div className="w-full bg-[#202020] text-slate-300 p-8 text-center text-sm md:text-base leading-loose italic flex flex-col items-center justify-center">
            <p>
              Data flow through the <span className="text-[#ff6b6b] font-mono not-italic">model_v2</span> defined using <span className="text-[#ff6b6b] font-mono not-italic">nn.Sequential</span> with named layers. Input passes linearly through <span className="text-[#ff6b6b] font-mono not-italic">fc1</span>,
            </p>
            <p>
              <span className="text-[#ff6b6b] font-mono not-italic">relu1</span>, and <span className="text-[#ff6b6b] font-mono not-italic">fc2</span>.
            </p>
         </div>

      </div>
    </div>
  );
}

// --- Slide 4: Pros & Limitations ---
function LimitationsSlide() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <h3 className="text-xl font-bold mb-4">When to use Sequential vs Custom Modules</h3>
      <p className="text-slate-600 mb-8 leading-relaxed text-sm">
        While highly convenient, <code>nn.Sequential</code> is strictly linear. It assumes a single input tensor flows perfectly through every layer in a straight line to produce a single output.
      </p>

      <div className="grid md:grid-cols-2 gap-6 flex-1">
        
        {/* Pros Box */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col">
           <h4 className="font-bold flex items-center gap-2 text-emerald-900 mb-4 border-b border-emerald-200 pb-2">
             <CheckCircle2 size={20} className="text-emerald-600"/> Perfect for:
           </h4>
           <ul className="space-y-4 text-sm text-emerald-800">
             <li className="flex gap-3">
                <Blocks className="flex-shrink-0 text-emerald-500" size={18}/>
                <div>
                  <strong>Simple Feed-Forward Networks:</strong> Basic MLPs or straight classification heads.
                </div>
             </li>
             <li className="flex gap-3">
                <Layers className="flex-shrink-0 text-emerald-500" size={18}/>
                <div>
                  <strong>Reusable Blocks:</strong> Bundling a repetitive set of layers (e.g., <code>Conv2d -{'>'} BatchNorm -{'>'} ReLU</code>) into a single logical block to use inside a larger custom module.
                </div>
             </li>
             <li className="flex gap-3">
                <Zap className="flex-shrink-0 text-emerald-500" size={18}/>
                <div>
                  <strong>Rapid Prototyping:</strong> Quickly slapping layers together to test baseline ideas.
                </div>
             </li>
           </ul>
        </div>

        {/* Cons Box */}
        <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6 shadow-sm flex flex-col">
           <h4 className="font-bold flex items-center gap-2 text-rose-900 mb-4 border-b border-rose-200 pb-2">
             <XCircle size={20} className="text-rose-600"/> Cannot Handle:
           </h4>
           <ul className="space-y-4 text-sm text-rose-800 mb-6">
             <li className="flex gap-3">
                <GitMerge className="flex-shrink-0 text-rose-500" size={18}/>
                <div>
                  <strong>Skip Connections (ResNets):</strong> You cannot route the output of Layer 1 to bypass Layer 2 and add it directly to Layer 3.
                </div>
             </li>
             <li className="flex gap-3">
                <Cpu className="flex-shrink-0 text-rose-500" size={18}/>
                <div>
                  <strong>Multiple Inputs / Outputs:</strong> Networks that require two separate input images (like Siamese networks).
                </div>
             </li>
             <li className="flex gap-3">
                <ShieldAlert className="flex-shrink-0 text-rose-500" size={18}/>
                <div>
                  <strong>Conditional Logic:</strong> Using <code>if/else</code> statements during the forward pass to route data dynamically.
                </div>
             </li>
           </ul>

           <div className="mt-auto bg-white border border-rose-200 p-4 rounded-xl text-center">
             <p className="text-xs font-bold text-rose-700">For any of these, you MUST subclass <code>nn.Module</code> and write a custom <code>forward()</code> method!</p>
           </div>
        </div>

      </div>
    </div>
  );
}