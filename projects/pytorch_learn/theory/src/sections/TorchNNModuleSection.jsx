import React, { useState } from 'react';
import { 
  Box, ChevronLeft, ChevronRight, Code, Terminal, 
  Layers, Settings, Cpu, PlayCircle, HardDrive, 
  ListTree, CheckCircle2, Activity
} from 'lucide-react';

export default function NnModuleSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'core', title: 'Core Structure', component: CoreStructureSlide },
    { id: 'params', title: 'Parameters & Submodules', component: ParametersSlide },
    { id: 'methods', title: 'Essential Functionality', component: EssentialMethodsSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Box size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">The torch.nn.Module Base Class</h2>
        <p className="text-slate-400 text-sm mb-4">The foundational blueprint for building neural networks in PyTorch</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-teal-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-teal-400 whitespace-nowrap' : 'hidden md:inline whitespace-nowrap'}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: Core Structure (__init__ vs forward) ---
function CoreStructureSlide() {
  const [view, setView] = useState('init');

  const outCode = `MySimpleNetwork(
  (layer1): Linear(in_features=10, out_features=5, bias=True)
  (activation): ReLU()
)`;

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Core Structure of an nn.Module</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Whenever you define a custom neural network, you create a Python class that inherits from <code>nn.Module</code>. You must implement two primary methods:
        </p>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setView('init')}
            className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${view === 'init' ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <Settings size={24} className={view === 'init' ? 'text-teal-600' : 'text-slate-400'}/>
            <span className="font-mono font-bold text-sm">__init__(self)</span>
            <span className="text-[10px] uppercase tracking-wider opacity-80">The Constructor</span>
          </button>

          <button 
            onClick={() => setView('forward')}
            className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${view === 'forward' ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            <PlayCircle size={24} className={view === 'forward' ? 'text-teal-600' : 'text-slate-400'}/>
            <span className="font-mono font-bold text-sm">forward(self, x)</span>
            <span className="text-[10px] uppercase tracking-wider opacity-80">The Data Flow</span>
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col flex-1 items-center justify-center relative overflow-hidden">
          {view === 'init' ? (
            <div className="w-full flex flex-col items-center animate-in zoom-in-95">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Registering Components</h4>
              <div className="w-full max-w-sm border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col gap-3 bg-white">
                 <div className="bg-blue-100 border border-blue-300 p-3 rounded-lg flex items-center justify-between shadow-sm">
                    <span className="font-mono text-sm font-bold text-blue-900">self.layer1</span>
                    <span className="text-xs text-blue-700 bg-white px-2 py-1 rounded border border-blue-200 font-mono">nn.Linear(10, 5)</span>
                 </div>
                 <div className="bg-purple-100 border border-purple-300 p-3 rounded-lg flex items-center justify-between shadow-sm">
                    <span className="font-mono text-sm font-bold text-purple-900">self.activation</span>
                    <span className="text-xs text-purple-700 bg-white px-2 py-1 rounded border border-purple-200 font-mono">nn.ReLU()</span>
                 </div>
              </div>
              <p className="text-xs text-teal-700 mt-4 bg-teal-50 px-4 py-2 border border-teal-200 rounded-lg text-center leading-relaxed shadow-sm">
                In <code>__init__</code>, you define and instantiate your components (layers, activations, submodules) and save them as attributes of the class instance.
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center animate-in zoom-in-95">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Data Flow Execution</h4>
              
              <div className="flex flex-col items-center w-full max-w-xs">
                 <div className="bg-slate-800 text-white font-mono text-xs px-4 py-2 rounded-full shadow-md z-10">Input Tensor (x)</div>
                 <div className="w-0.5 h-6 bg-slate-300 animate-pulse"></div>
                 
                 <div className="bg-blue-100 border-2 border-blue-400 p-3 rounded-lg w-full text-center shadow-md z-10">
                    <span className="font-mono text-sm font-bold text-blue-900">self.layer1(x)</span>
                 </div>
                 
                 <div className="w-0.5 h-6 bg-slate-300 animate-pulse"></div>
                 
                 <div className="bg-purple-100 border-2 border-purple-400 p-3 rounded-lg w-full text-center shadow-md z-10">
                    <span className="font-mono text-sm font-bold text-purple-900">self.activation(x)</span>
                 </div>

                 <div className="w-0.5 h-6 bg-slate-300 animate-pulse"></div>
                 <div className="bg-emerald-500 text-white font-mono text-xs px-4 py-2 rounded-full shadow-md z-10">Return Output</div>
              </div>
              <p className="text-xs text-teal-700 mt-4 bg-teal-50 px-4 py-2 border border-teal-200 rounded-lg text-center leading-relaxed shadow-sm">
                In <code>forward</code>, you dictate how the input data flows through the components. Autograd builds the computation graph directly from this method!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto min-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Python Code</span></div>
          {/* Strictly aligned template literals to prevent JSX spacing issues */}
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-300 leading-relaxed">
{`import torch
import torch.nn as nn

class MySimpleNetwork(nn.Module):
    def __init__(self):
        super(MySimpleNetwork, self).__init__()
`}
<span className={`block rounded px-1 transition-colors duration-300 ${view === 'init' ? 'bg-teal-900/60 text-teal-100 border border-teal-700' : ''}`}>
{`        # Define layers or components here
        self.layer1 = nn.Linear(in_features=10, out_features=5)
        self.activation = nn.ReLU()
`}
</span>
{`
    def forward(self, x):
`}
<span className={`block rounded px-1 transition-colors duration-300 ${view === 'forward' ? 'bg-teal-900/60 text-teal-100 border border-teal-700' : ''}`}>
{`        # Define the flow of data
        x = self.layer1(x)
        x = self.activation(x)
        return x
`}
</span>
{`
# Instantiate the network
model = MySimpleNetwork()
print(model)`}
          </pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[150px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output (print(model))</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: Parameters & Submodules ---
function ParametersSlide() {
  const pyCode = `import torch
import torch.nn as nn

class CustomModule(nn.Module):
    def __init__(self):
        super().__init__()
        
        # 1. A standard PyTorch Layer (Internal parameters auto-registered)
        self.layer = nn.Linear(10, 5)
        
        # 2. A custom learnable parameter (Explicitly tracked)
        self.my_weight = nn.Parameter(torch.randn(5, 2))
        
        # 3. A regular tensor attribute (IGNORED by Module)
        self.my_info = torch.tensor([1.0, 2.0])

    def forward(self, x):
        x = self.layer(x)
        return torch.matmul(x, self.my_weight)

module = CustomModule()

# Accessing parameters collected by the parent module
for name, param in module.named_parameters():
    print(f"{name} | {param.shape} | req_grad: {param.requires_grad}")`;

  const outCode = `layer.weight | torch.Size([5, 10]) | req_grad: True\nlayer.bias | torch.Size([5]) | req_grad: True\nmy_weight | torch.Size([5, 2]) | req_grad: True`;

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-2">Parameters and Submodules</h3>
        
        <div className="text-slate-600 mb-4 leading-relaxed text-sm space-y-2">
          <p>
            A critical feature of <code>nn.Module</code> is its ability to automatically register and manage learnable parameters. When you assign an instance of a PyTorch layer (like <code>nn.Linear</code> or <code>nn.Conv2d</code>), it recognizes the internal weights and biases of that layer.
          </p>
          <p>
            These are instances of <code>torch.nn.Parameter</code>, a special subclass of <code>torch.Tensor</code> that automatically has <code>requires_grad=True</code>. This registration allows PyTorch to collect all learnable parameters for an optimizer. You can also define custom parameters directly:
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col flex-1 relative overflow-y-auto">
           <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
             <ListTree size={16}/> Module Hierarchy Tree
           </h4>

           <div className="flex flex-col items-start w-full relative pl-4 border-l-2 border-slate-300 ml-4 space-y-5">
              
              <div className="relative">
                 <div className="absolute -left-[27px] top-1/2 w-6 border-t-2 border-slate-300"></div>
                 <div className="bg-teal-600 text-white font-bold px-4 py-2 rounded-lg shadow-md font-mono text-sm inline-block">
                    CustomModule
                 </div>
              </div>

              {/* Submodule Level */}
              <div className="relative w-full">
                 <div className="absolute -left-[27px] top-4 w-6 border-t-2 border-slate-300"></div>
                 <div className="ml-2 bg-white border-2 border-blue-400 p-3 rounded-xl shadow-sm flex flex-col items-start relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[9px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-widest">
                       Submodule
                    </div>
                    <span className="font-mono font-bold text-slate-800 mb-1">self.layer</span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono mb-1">nn.Linear(10, 5)</span>
                    <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12}/> Auto-registers internal weights & biases
                    </span>
                 </div>
              </div>

              {/* Custom Parameter */}
              <div className="relative w-full">
                 <div className="absolute -left-[27px] top-4 w-6 border-t-2 border-slate-300"></div>
                 <div className="ml-2 bg-white border-2 border-emerald-400 p-3 rounded-xl shadow-sm flex flex-col items-start relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-widest">
                       Custom Parameter
                    </div>
                    <span className="font-mono font-bold text-slate-800 mb-1">self.my_weight</span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono mb-1">nn.Parameter(...)</span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12}/> Registered directly
                    </span>
                 </div>
              </div>

              {/* Ignored Regular Tensor */}
              <div className="relative w-full">
                 <div className="absolute -left-[27px] top-4 w-6 border-t-2 border-slate-300"></div>
                 <div className="ml-2 bg-slate-100 border-2 border-slate-300 p-3 rounded-xl shadow-sm flex flex-col items-start relative opacity-70">
                    <div className="absolute top-0 right-0 bg-slate-200 text-slate-600 text-[9px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-widest">
                       Ignored
                    </div>
                    <span className="font-mono font-bold text-slate-600 mb-1 line-through">self.my_info</span>
                    <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono mb-1">torch.tensor(...)</span>
                    <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                      Not seen by Optimizer
                    </span>
                 </div>
              </div>

           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto">
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

// --- Slide 3: Essential Functionality (Interactive Dashboard) ---
function EssentialMethodsSlide() {
  const [activeMethod, setActiveMethod] = useState('parameters');

  const methodsData = {
    'parameters': {
      title: 'parameters() & named_parameters()',
      desc: 'Returns an iterator over all learnable nn.Parameter objects in the module and its submodules. Essential for providing parameters to an optimizer during training.',
      code: `optimizer = torch.optim.SGD(model.parameters(), lr=0.01)\n\nfor name, param in model.named_parameters():\n    print(f"{name}: {param.size()}")`,
      out: `layer1.weight: torch.Size([5, 10])\nlayer1.bias: torch.Size([5])`,
      icon: <Layers className="text-indigo-500" />
    },
    'children_modules': {
      title: 'children() & modules()',
      desc: 'children() returns an iterator over immediate child modules (the attributes you defined). modules() returns an iterator over all modules recursively, including the module itself and all deeply nested submodules.',
      code: `print("Immediate Children:")\nfor child in model.children():\n    print(type(child).__name__)\n\nprint("\\nAll Modules (Recursive):")\nfor mod in model.modules():\n    print(type(mod).__name__)`,
      out: `Immediate Children:\nLinear\nReLU\n\nAll Modules (Recursive):\nMySimpleNetwork\nLinear\nReLU`,
      icon: <ListTree className="text-cyan-500" />
    },
    'to': {
      title: 'to(device)',
      desc: 'Moves the entire module (all its parameters and buffers) to a specified device, such as the GPU (\'cuda\') or CPU (\'cpu\').',
      code: `# Check for GPU\ndevice = torch.device('cuda' if torch.cuda.is_available() else 'cpu')\n\n# Move entire model to GPU\nmodel = model.to(device)\nprint(next(model.parameters()).device)`,
      out: `cuda:0`,
      icon: <Cpu className="text-amber-500" />
    },
    'train_eval': {
      title: 'train() & eval()',
      desc: 'Toggles the mode of the network. This is crucial because layers like Dropout and BatchNorm behave differently during training vs. inference (evaluation).',
      code: `# Set to training mode (enables dropout, updates batchnorm stats)\nmodel.train()\n\n# Set to evaluation mode (disables dropout, uses saved batchnorm stats)\nmodel.eval()\n\nprint(f"Training mode active: {model.training}")`,
      out: `Training mode active: False`,
      icon: <Activity className="text-emerald-500" />
    },
    'state_dict': {
      title: 'state_dict() & load_state_dict()',
      desc: 'state_dict() returns a Python dictionary mapping each parameter and buffer name to its tensor. This is fundamental for saving model weights to disk.',
      code: `# Save the model weights to a dictionary\nweights = model.state_dict()\nprint(weights.keys())\n\n# Save to disk\ntorch.save(weights, 'model_weights.pth')\n\n# Load from disk later\nmodel.load_state_dict(torch.load('model_weights.pth'))`,
      out: `odict_keys(['layer1.weight', 'layer1.bias'])`,
      icon: <HardDrive className="text-rose-500" />
    }
  };

  const current = methodsData[activeMethod];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Essential nn.Module Functionality</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Inheriting from <code>nn.Module</code> grants your class powerful utility methods for managing hardware placement, training states, saving/loading, and structural iteration.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-6 flex-1">
        
        {/* Left: Interactive Menu */}
        <div className="flex flex-col gap-2">
           <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 pl-2">Utility Methods</h4>
           {Object.entries(methodsData).map(([key, data]) => (
             <button
               key={key}
               onClick={() => setActiveMethod(key)}
               className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                 ${activeMethod === key ? 'bg-white border-teal-500 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-200 hover:border-teal-300 text-slate-600'}`}
             >
               <div className={`p-2 rounded-lg bg-slate-100 ${activeMethod === key ? 'shadow-inner' : ''}`}>
                 {data.icon}
               </div>
               <span className={`font-bold font-mono text-xs md:text-sm ${activeMethod === key ? 'text-teal-900' : ''}`}>
                 .{key}()
               </span>
             </button>
           ))}
        </div>

        {/* Right: Dynamic Content Display */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
           
           <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
             {current.icon}
             <h4 className="text-lg md:text-xl font-bold text-slate-800 font-mono">.{current.title}</h4>
           </div>
           
           <p className="text-sm text-slate-600 leading-relaxed mb-6">
             {current.desc}
           </p>

           <div className="flex flex-col gap-4 overflow-hidden mt-auto">
              <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300">
                <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Usage Example</span></div>
                <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{current.code}</pre>
              </div>
              <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-teal-400">
                <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Output</span></div>
                <pre className="whitespace-pre-wrap">{current.out}</pre>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}