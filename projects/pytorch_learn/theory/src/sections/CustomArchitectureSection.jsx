import React, { useState, useEffect } from 'react';
import { 
  Network, ChevronLeft, ChevronRight, Code, Terminal, 
  Layers, Settings, PlayCircle, ArrowRight, CheckCircle2, 
  GitBranch, GitMerge, FileCode2, BoxSelect, Pointer
} from 'lucide-react';

export default function CustomArchSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'foundation', title: 'The Foundation', component: FoundationSlide },
    { id: 'mlp', title: 'Building an MLP', component: MLPSlide },
    { id: 'visual', title: 'Visualizing Data Flow', component: VisualFlowSlide },
    { id: 'advantages', title: 'Advantages of Subclassing', component: AdvantagesSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Network size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Defining Custom Network Architectures</h2>
        <p className="text-slate-400 text-sm mb-4">Building flexible models by subclassing torch.nn.Module</p>
        
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
            <span key={idx} className={idx === currentSlide ? 'text-indigo-400 whitespace-nowrap' : 'hidden md:inline whitespace-nowrap'}>
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

// --- Slide 1: The Foundation ---
function FoundationSlide() {
  const [view, setView] = useState('init');

  const pyCode = `import torch
import torch.nn as nn

class SimpleLinearModel(nn.Module):
    def __init__(self, input_features, output_features):
        # 1. Call the parent class constructor
        super().__init__()
        
        # 2. Define the single linear layer
        self.linear_layer = nn.Linear(input_features, output_features)
        
        print(f"Initialized SimpleLinearModel")
        print(f"Layer defined: {self.linear_layer}")

    def forward(self, x):
        # 3. Define the forward pass
        print(f"Forward pass input shape: {x.shape}")
        
        output = self.linear_layer(x)
        
        print(f"Forward pass output shape: {output.shape}")
        return output

# --- Usage Example ---
in_dim, out_dim = 10, 1
model = SimpleLinearModel(input_features=in_dim, output_features=out_dim)

# Create some dummy input data (batch_size=5, features=10)
dummy_input = torch.randn(5, in_dim)
print(f"\\nDummy input tensor shape: {dummy_input.shape}")

# Pass the data through the model
output = model(dummy_input)
print(f"Model output tensor shape: {output.shape}")

# Inspect parameters (automatically registered)
print("\\nModel Parameters:")
for name, param in model.named_parameters():
    if param.requires_grad:
        print(f"  Name: {name}, Shape: {param.shape}")`;

  const outCode = `Initialized SimpleLinearModel
Layer defined: Linear(in_features=10, out_features=1, bias=True)

Dummy input tensor shape: torch.Size([5, 10])
Forward pass input shape: torch.Size([5, 10])
Forward pass output shape: torch.Size([5, 1])
Model output tensor shape: torch.Size([5, 1])

Model Parameters:
  Name: linear_layer.weight, Shape: torch.Size([1, 10])
  Name: linear_layer.bias, Shape: torch.Size([1])`;

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">The Two Fundamental Steps</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          To define custom architectures, you subclass <code>nn.Module</code> and implement two crucial methods. Let's look at a basic <strong>SimpleLinearModel</strong>.
        </p>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setView('init')}
            className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${view === 'init' ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <Settings size={24} className={view === 'init' ? 'text-indigo-600' : 'text-slate-400'}/>
            <span className="font-mono font-bold text-sm">__init__(self)</span>
            <span className="text-[10px] uppercase tracking-wider opacity-80">Define Layers</span>
          </button>

          <button 
            onClick={() => setView('forward')}
            className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${view === 'forward' ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <PlayCircle size={24} className={view === 'forward' ? 'text-indigo-600' : 'text-slate-400'}/>
            <span className="font-mono font-bold text-sm">forward(self, x)</span>
            <span className="text-[10px] uppercase tracking-wider opacity-80">Data Flow</span>
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col flex-1 items-center justify-center relative overflow-hidden">
          {view === 'init' ? (
            <div className="w-full flex flex-col items-start gap-4 animate-in zoom-in-95">
              <div className="bg-white border-l-4 border-indigo-500 p-4 shadow-sm rounded-r-lg w-full">
                <h4 className="font-bold text-indigo-900 text-sm mb-1 flex items-center gap-2"><CheckCircle2 size={16}/> Step 1: super().__init__()</h4>
                <p className="text-xs text-slate-600">You <strong>must</strong> call the parent constructor first to initialize the underlying PyTorch mechanics.</p>
              </div>
              <div className="bg-white border-l-4 border-indigo-500 p-4 shadow-sm rounded-r-lg w-full">
                <h4 className="font-bold text-indigo-900 text-sm mb-1 flex items-center gap-2"><CheckCircle2 size={16}/> Step 2: Instantiate Layers</h4>
                <p className="text-xs text-slate-600">Create your layers (e.g., <code>nn.Linear</code>) and assign them as attributes (e.g., <code>self.linear_layer</code>). This automatically registers their parameters!</p>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-start gap-4 animate-in zoom-in-95">
              <div className="bg-white border-l-4 border-emerald-500 p-4 shadow-sm rounded-r-lg w-full">
                <h4 className="font-bold text-emerald-900 text-sm mb-1 flex items-center gap-2"><CheckCircle2 size={16}/> Step 3: Define Propagation</h4>
                <p className="text-xs text-slate-600">The <code>forward</code> method dictates how the input tensor <code>x</code> travels through the components you defined in <code>__init__</code>.</p>
              </div>
              <div className="flex items-center justify-center w-full gap-4 mt-4 bg-slate-100 p-4 rounded-xl border border-slate-200">
                <div className="bg-slate-800 text-white font-mono text-xs px-3 py-1 rounded shadow">x</div>
                <ArrowRight className="text-slate-400" size={16} />
                <div className="bg-indigo-100 text-indigo-800 border border-indigo-300 font-mono text-xs px-3 py-1 rounded shadow-sm">self.linear_layer(x)</div>
                <ArrowRight className="text-slate-400" size={16} />
                <div className="bg-emerald-500 text-white font-mono text-xs px-3 py-1 rounded shadow">output</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto min-h-[250px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Python Code</span></div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
{pyCode}
          </pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[180px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap overflow-x-auto">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: Building an MLP ---
function MLPSlide() {
  const [step, setStep] = useState(0);

  const pyCode = `import torch\nimport torch.nn as nn\nimport torch.nn.functional as F\n\nclass SimpleMLP(nn.Module):\n    def __init__(self, input_size, hidden_size, output_size):\n        super().__init__()\n        self.layer1 = nn.Linear(input_size, hidden_size)\n        self.activation = nn.ReLU() # Define activation as a layer\n        self.layer2 = nn.Linear(hidden_size, output_size)\n\n    def forward(self, x):\n        x = self.layer1(x)\n        x = self.activation(x)\n        # Alternative: x = F.relu(x)\n        x = self.layer2(x)\n        return x\n\n# --- Usage Example ---\nin_size = 784 # E.g., Flattened 28x28 image\nhidden_units = 128\nout_size = 10 # E.g., 10 classes\n\nmlp_model = SimpleMLP(in_size, hidden_units, out_size)\ndummy_input = torch.randn(32, in_size) # Batch of 32\n\noutput = mlp_model(dummy_input)\nprint(f"Final MLP output shape: {output.shape}")`;

  const outCode = `Final MLP output shape: torch.Size([32, 10])`;

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-2">Building a Multi-Layer Perceptron</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Let's build a more complex model: a two-layer MLP with a ReLU activation. Watch how the tensor shape transforms as it flows sequentially through the <code>forward</code> method.
        </p>

        <button 
          onClick={() => setStep(s => (s + 1) % 5)} 
          className="w-full py-3 mb-6 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow transition-all flex justify-center items-center gap-2 flex-shrink-0"
        >
          {step === 0 ? "Step 1: Input Tensor (Click to Pass to Layer 1)" : step === 1 ? "Step 2: Layer 1 (Click to Activate)" : step === 2 ? "Step 3: ReLU (Click to Pass to Layer 2)" : step === 3 ? "Step 4: Layer 2 Output (Click to Return)" : "Step 5: Final Shape (Click to Reset)"} <Pointer size={16}/>
        </button>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col flex-1 relative overflow-y-auto min-h-[350px]">
           <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center justify-center gap-2 shrink-0">
             <Layers size={16}/> Tensor Shape Transformations
           </h4>

           <div className="flex flex-col gap-3 w-full max-w-sm mx-auto relative z-10 mb-6 shrink-0">
              
              {/* Input */}
              <div className={`transition-all duration-500 flex items-center justify-between p-3 rounded-lg border-2 ${step >= 0 ? 'bg-white border-slate-300 shadow-sm' : 'opacity-0'}`}>
                 <span className="font-mono text-sm font-bold text-slate-700">Input (x)</span>
                 <span className="bg-slate-100 text-slate-600 font-mono text-xs px-2 py-1 rounded">[32, 784]</span>
              </div>

              {/* Layer 1 */}
              <div className={`transition-all duration-500 flex items-center justify-between p-3 rounded-lg border-2 ${step >= 1 ? 'bg-indigo-50 border-indigo-400 shadow-sm' : 'opacity-50 border-transparent bg-transparent'}`}>
                 <span className="font-mono text-sm font-bold text-indigo-900">self.layer1(x)</span>
                 {step >= 1 && <span className="bg-indigo-200 text-indigo-800 font-mono text-xs px-2 py-1 rounded">[32, 128]</span>}
              </div>

              {/* ReLU */}
              <div className={`transition-all duration-500 flex items-center justify-between p-3 rounded-lg border-2 ${step >= 2 ? 'bg-purple-50 border-purple-400 shadow-sm' : 'opacity-50 border-transparent bg-transparent'}`}>
                 <span className="font-mono text-sm font-bold text-purple-900">self.activation(x)</span>
                 {step >= 2 && <span className="bg-purple-200 text-purple-800 font-mono text-xs px-2 py-1 rounded">[32, 128]</span>}
              </div>

              {/* Layer 2 */}
              <div className={`transition-all duration-500 flex items-center justify-between p-3 rounded-lg border-2 ${step >= 3 ? 'bg-indigo-50 border-indigo-400 shadow-sm' : 'opacity-50 border-transparent bg-transparent'}`}>
                 <span className="font-mono text-sm font-bold text-indigo-900">self.layer2(x)</span>
                 {step >= 3 && <span className="bg-indigo-200 text-indigo-800 font-mono text-xs px-2 py-1 rounded">[32, 10]</span>}
              </div>

              {/* Final */}
              {step >= 4 && (
                <div className="mt-2 text-center animate-in slide-in-from-bottom-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-4 py-2 rounded-full border border-emerald-300">
                    Final Output Shape: [32, 10]
                  </span>
                </div>
              )}

           </div>

           {/* Note about functional API (No longer absolute positioned) */}
           <div className="mt-auto bg-white p-3 rounded-lg border border-slate-200 shadow-sm shrink-0">
             <p className="text-[10px] text-slate-600 leading-relaxed text-center">
               <strong>Note:</strong> Activations can be defined as layers in <code>__init__</code> (e.g., <code>nn.ReLU()</code>) OR used directly in <code>forward</code> via the functional API (e.g., <code>F.relu(x)</code>).
             </p>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[350px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[100px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{step >= 4 ? outCode : ''}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Visualizing Data Flow ---
function VisualFlowSlide() {
  const [animating, setAnimating] = useState(false);
  const [position, setPosition] = useState(-1); // -1: start, 0: L1, 1: ReLU, 2: L2, 3: end

  useEffect(() => {
    if (animating) {
      let currentPos = -1;
      const interval = setInterval(() => {
        currentPos += 1;
        setPosition(currentPos);
        if (currentPos >= 4) {
          clearInterval(interval);
          setAnimating(false);
          setTimeout(() => setPosition(-1), 2000); // Reset after 2 seconds
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [animating]);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Visualizing the Forward Pass</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          The <code>forward</code> method constructs the dynamic computation graph sequentially as data is pushed through the network.
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <button 
          onClick={() => { if(!animating) { setAnimating(true); setPosition(-1); } }}
          disabled={animating}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <PlayCircle size={18} /> {animating ? "Processing Forward Pass..." : "Trigger Forward Pass"}
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl flex-1 relative overflow-hidden flex flex-col items-center justify-center min-h-[350px]">
         
         <div className="relative w-full max-w-3xl h-[200px] flex items-center justify-between px-12">
            
            {/* The Connecting Line */}
            <div className="absolute top-1/2 left-16 right-16 h-1 bg-slate-300 -translate-y-1/2 z-0"></div>

            {/* The Moving Tensor Payload */}
            <div 
               className="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-400 text-emerald-900 border-2 border-emerald-600 shadow-lg rounded-md flex items-center justify-center font-mono font-bold text-xs z-20 transition-all duration-700 ease-in-out"
               style={{
                 left: position === -1 ? '40px' : 
                       position === 0 ? 'calc(25% - 24px)' :
                       position === 1 ? 'calc(50% - 24px)' :
                       position === 2 ? 'calc(75% - 24px)' :
                       'calc(100% - 80px)',
                 opacity: position === 4 ? 0 : 1
               }}
            >
               {position <= 0 ? 'x' : 'y'}
            </div>

            {/* Nodes */}
            <div className="flex flex-col items-center z-10 w-24">
              <span className="text-xs font-bold text-slate-500 mb-2 uppercase">Input</span>
              <div className="w-16 h-16 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                x
              </div>
            </div>

            <div className="flex flex-col items-center z-10 w-24">
              <span className="text-xs font-bold text-slate-500 mb-2 uppercase">Layer 1</span>
              <div className={`w-20 h-20 bg-white border-4 rounded-xl flex items-center justify-center font-bold text-indigo-900 shadow-md transition-colors duration-300 ${position === 0 ? 'border-emerald-500 bg-emerald-50' : 'border-indigo-400'}`}>
                Linear
              </div>
            </div>

            <div className="flex flex-col items-center z-10 w-24">
              <span className="text-xs font-bold text-slate-500 mb-2 uppercase">Activation</span>
              <div className={`w-16 h-16 bg-white border-4 rounded-full flex items-center justify-center font-bold text-purple-900 shadow-md transition-colors duration-300 ${position === 1 ? 'border-emerald-500 bg-emerald-50' : 'border-purple-400'}`}>
                ReLU
              </div>
            </div>

            <div className="flex flex-col items-center z-10 w-24">
              <span className="text-xs font-bold text-slate-500 mb-2 uppercase">Layer 2</span>
              <div className={`w-20 h-20 bg-white border-4 rounded-xl flex items-center justify-center font-bold text-indigo-900 shadow-md transition-colors duration-300 ${position === 2 ? 'border-emerald-500 bg-emerald-50' : 'border-indigo-400'}`}>
                Linear
              </div>
            </div>

            <div className="flex flex-col items-center z-10 w-24">
              <span className="text-xs font-bold text-slate-500 mb-2 uppercase">Output</span>
              <div className={`w-16 h-16 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold shadow-md transition-all duration-300 ${position === 3 ? 'bg-emerald-600 scale-110 ring-4 ring-emerald-300' : ''}`}>
                Out
              </div>
            </div>

         </div>

         {/* Shape status indicator below */}
         <div className="mt-8 h-12 flex items-center justify-center">
            {position === -1 && <span className="font-mono bg-white px-4 py-2 border rounded shadow-sm text-slate-600">Shape: [32, 784]</span>}
            {position === 0 && <span className="font-mono bg-indigo-50 px-4 py-2 border border-indigo-200 rounded shadow-sm text-indigo-800">Shape: [32, 128]</span>}
            {position === 1 && <span className="font-mono bg-purple-50 px-4 py-2 border border-purple-200 rounded shadow-sm text-purple-800">Shape: [32, 128] (Activated)</span>}
            {position === 2 && <span className="font-mono bg-indigo-50 px-4 py-2 border border-indigo-200 rounded shadow-sm text-indigo-800">Shape: [32, 10]</span>}
            {position >= 3 && <span className="font-mono bg-emerald-50 px-4 py-2 border border-emerald-200 rounded shadow-sm text-emerald-800 font-bold">Final Shape: [32, 10]</span>}
         </div>

      </div>
    </div>
  );
}

// --- Slide 4: Advantages ---
function AdvantagesSlide() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <h3 className="text-xl font-bold mb-4">Advantages of Subclassing nn.Module</h3>
      <p className="text-slate-600 mb-6 leading-relaxed text-sm">
        While simple networks can use <code>nn.Sequential</code>, subclassing <code>nn.Module</code> is the industry standard for building sophisticated deep learning models.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        
        {/* Flexibility */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><GitBranch size={20} /></div>
            <h4 className="font-bold text-slate-800">Maximum Flexibility</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            You can implement any architecture. This includes non-linear designs like multiple inputs/outputs, shared layers, or residual (skip) connections where earlier outputs are added to later layers.
          </p>
        </div>

        {/* Readability */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><FileCode2 size={20} /></div>
            <h4 className="font-bold text-slate-800">Readability & Organization</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Complex architectures are easier to understand when organized within a class structure. Components are clearly defined in <code>__init__</code>, and their physical interaction is scripted in <code>forward</code>.
          </p>
        </div>

        {/* Parameters */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><BoxSelect size={20} /></div>
            <h4 className="font-bold text-slate-800">Automatic Parameter Management</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            PyTorch automatically discovers and registers any <code>nn.Module</code> or <code>nn.Parameter</code> assigned as an attribute. Calling <code>model.parameters()</code> easily yields all learnable weights for the optimizer.
          </p>
        </div>

        {/* Nesting */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Layers size={20} /></div>
            <h4 className="font-bold text-slate-800">Hierarchical Nesting</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Custom modules can contain other modules (including <code>nn.Sequential</code> or other custom classes). This allows you to build highly modular, hierarchical, and reusable architectural blocks.
          </p>
        </div>

      </div>
    </div>
  );
}