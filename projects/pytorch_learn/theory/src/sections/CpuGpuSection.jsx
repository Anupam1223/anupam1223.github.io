import React, { useState, useEffect } from 'react';
import { 
  Cpu, Zap, Server, HardDrive, ArrowRightLeft, 
  ChevronLeft, ChevronRight, Code, Terminal, AlertTriangle, 
  CheckCircle2, Pointer, Activity
} from 'lucide-react';

export default function DeviceSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'compare', title: 'CPU vs GPU Tensors', component: CompareSlide },
    { id: 'checking', title: 'Checking & Creating', component: CheckingSlide },
    { id: 'moving', title: 'Moving Tensors (.to)', component: MovingSlide },
    { id: 'rules', title: 'Consistency & Rules', component: RulesSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Server size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">CPU vs GPU Tensors</h2>
        <p className="text-slate-400 text-sm mb-4">Managing computational devices for deep learning</p>
        
        <div className="flex gap-2 mb-2">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-amber-400' : ''}>
              {slide.title.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      <div className="min-h-[550px] flex flex-col">
        <div className="flex-1">
          <CurrentComponent />
        </div>
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
          <button 
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))} 
            disabled={currentSlide === 0} 
            className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 disabled:opacity-50 font-semibold transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))} 
            disabled={currentSlide === slides.length - 1} 
            className="px-5 py-2.5 rounded-xl bg-amber-600 text-white disabled:opacity-50 font-semibold transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CompareSlide() {
  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimStep(prev => (prev + 1) % 6);
    }, 600);
    return () => clearInterval(timer);
  }, []);

  const pyCode = `import torch\n\n# Tensor created on the CPU by default\ncpu_tensor = torch.tensor([1.0, 2.0, 3.0])\nprint(f"Default tensor device: {cpu_tensor.device}")`;
  const outCode = `Default tensor device: cpu`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">The Default Computational Hub</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          By default, when you create a PyTorch tensor, it's allocated on the <strong>CPU</strong>. While CPUs are versatile and great for preprocessing, deep learning relies on massive matrix multiplications that require the parallel architecture of <strong>GPUs</strong>.
        </p>

        <div className="flex flex-col gap-6 flex-1">
          {/* CPU Animation */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 relative shadow-sm flex items-center justify-between overflow-hidden">
            <div className="flex flex-col items-center gap-2 z-10 w-1/3">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center border-2 border-blue-400">
                <Cpu size={24} />
              </div>
              <span className="font-bold text-xs text-blue-800 uppercase tracking-widest">CPU (Sequential)</span>
            </div>
            
            <div className="flex-1 flex gap-1 justify-end px-4 h-8 relative">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={`w-6 h-6 rounded flex items-center justify-center font-mono text-[10px] font-bold z-10 transition-all duration-300 ${
                    animStep === i ? 'bg-blue-500 text-white scale-125 shadow-md' : 
                    animStep > i ? 'bg-slate-200 text-slate-400' : 'bg-white border border-slate-300 text-slate-400'
                  }`}
                >
                  {i}
                </div>
              ))}
            </div>
          </div>

          {/* GPU Animation */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 relative shadow-sm flex items-center justify-between overflow-hidden">
            <div className="flex flex-col items-center gap-2 z-10 w-1/3">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center border-2 border-amber-400">
                <Zap size={24} />
              </div>
              <span className="font-bold text-xs text-amber-800 uppercase tracking-widest">GPU (Parallel)</span>
            </div>
            
            <div className="flex-1 flex flex-wrap gap-1 justify-end px-4 h-14 content-center">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={`gpu${i}`} 
                  className={`w-6 h-6 rounded flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-300 ${
                    animStep % 2 === 0 ? 'bg-amber-500 text-white scale-110 shadow-sm' : 'bg-white border border-slate-300 text-slate-400'
                  }`}
                >
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[250px] text-emerald-100">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[200px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

function CheckingSlide() {
  const [hasGpu, setHasGpu] = useState(true);

  const pyCode = `import torch\n\n# Check for CUDA availability and set the device accordingly\nif torch.cuda.is_available():\n    device = torch.device("cuda") # Use first available CUDA device\n    print(f"CUDA (GPU) is available. Using device: {device}")\n    # You can also specify a specific GPU, e.g., torch.device("cuda:0")\nelse:\n    device = torch.device("cpu")\n    print(f"CUDA (GPU) not available. Using device: {device}")\n\n# Create a tensor directly on the chosen device\ntry:\n    # This tensor will be on CPU if device='cpu', or GPU if 'cuda'\n    device_tensor = torch.randn(3, 4, device=device)\n    print(f"Tensor created on: {device_tensor.device}")\nexcept RuntimeError as e:\n    print(f"Could not create tensor directly on {device}: {e}")`;
  
  const outCode = hasGpu 
    ? `CUDA (GPU) is available. Using device: cuda\nTensor created on: cuda:0`
    : `CUDA (GPU) not available. Using device: cpu\nTensor created on: cpu`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Checking & Creating Devices</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Before using a GPU, check if one is available using <code>torch.cuda.is_available()</code>. It's best practice to create a <code>torch.device</code> object and pass it directly during tensor creation via the <code>device=</code> argument.
        </p>

        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-4 rounded-lg mb-6 shadow-sm leading-relaxed">
          <strong>Why create directly on device?</strong> It is much more efficient to allocate memory and generate the tensor directly on the GPU (VRAM) than creating it on the CPU and moving it later.
        </div>

        <button 
          onClick={() => setHasGpu(!hasGpu)} 
          className={`w-full py-3 mb-4 text-white rounded-lg text-sm font-bold shadow transition-all flex justify-center items-center gap-2 ${hasGpu ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-500 hover:bg-slate-600'}`}
        >
          {hasGpu ? "Simulate: Machine HAS GPU" : "Simulate: Machine HAS NO GPU"} <Pointer size={16}/>
        </button>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center flex-1">
           <div className={`p-6 rounded-full border-4 transition-all duration-500 ${hasGpu ? 'bg-amber-100 border-amber-500 text-amber-600' : 'bg-blue-100 border-blue-500 text-blue-600'}`}>
             {hasGpu ? <Zap size={48} className="animate-pulse" /> : <Cpu size={48} />}
           </div>
           <p className="mt-4 font-mono text-sm font-bold uppercase tracking-widest text-slate-500">
             Device Object: <span className={hasGpu ? 'text-amber-600' : 'text-blue-600'}>"{hasGpu ? 'cuda' : 'cpu'}"</span>
           </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[350px] text-emerald-100">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[150px] overflow-y-auto transition-all">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

function MovingSlide() {
  const [step, setStep] = useState(0);

  const pyCode = `# Start with a CPU tensor
cpu_tensor = torch.ones(2, 2)
print(f"Original tensor: {cpu_tensor.device}")

# Move tensor to the selected device (GPU if available)
moved_tensor = cpu_tensor.to(device)
print(f"Moved tensor: {moved_tensor.device}")

# Explicitly move back to CPU if it was on GPU
if moved_tensor.is_cuda: # Check if tensor is on CUDA
    back_to_cpu = moved_tensor.to("cpu")
    print(f"Tensor moved back to: {back_to_cpu.device}")

# Using convenience methods:
# gpu_tensor = cpu_tensor.cuda()
# cpu_tensor = gpu_tensor.cpu()`;

  const outCode = `Original tensor: cpu\nMoved tensor: cuda:0\nTensor moved back to: cpu`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Moving Tensors with .to()</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Data loaded from disk typically resides on the CPU. To compute faster, move it to the GPU using <code>.to(device)</code>. This returns a <strong>new</strong> tensor on the specified device; the original remains unchanged.
        </p>

        <button 
          onClick={() => setStep(s => (s + 1) % 3)} 
          className="w-full py-2 mb-6 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 shadow transition-all flex justify-center items-center gap-2"
        >
          {step === 0 ? "Step 1: On CPU (Click to Move to GPU)" : step === 1 ? "Step 2: On GPU (Click to Move Back)" : "Step 3: Back on CPU (Click to Reset)"} <Pointer size={16}/>
        </button>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-h-[220px] relative overflow-hidden">
           
           <div className="flex w-full items-center justify-between px-4 relative z-10">
             
             {/* CPU Box */}
             <div className="flex flex-col items-center w-1/3">
               <div className="bg-white border-2 border-blue-400 rounded-xl p-4 w-full aspect-square flex flex-col items-center justify-center shadow-inner relative">
                  <span className="absolute top-2 left-2 text-[10px] font-bold text-blue-400 uppercase">System RAM</span>
                  <Cpu className="text-blue-200 mb-2" size={32} />
                  {/* The Tensor */}
                  <div className={`grid grid-cols-2 gap-1 p-1 bg-blue-100 border border-blue-300 rounded transition-all duration-700 absolute ${step === 0 || step === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                    {[1,1,1,1].map((v, i) => <div key={i} className="w-4 h-4 bg-white text-blue-800 flex items-center justify-center font-mono text-[8px] font-bold">{v}</div>)}
                  </div>
               </div>
               <span className="font-bold text-xs text-blue-800 uppercase mt-3">CPU</span>
             </div>

             {/* The Bus */}
             <div className="flex-1 flex flex-col items-center justify-center relative px-2">
                <div className="w-full h-4 bg-slate-200 rounded-full border-y border-slate-300 overflow-hidden relative">
                   {/* Moving Data Block */}
                   <div className={`h-full bg-amber-400 w-1/3 rounded-full absolute transition-all duration-700 ease-in-out ${step === 1 ? 'left-[66%] opacity-100' : step === 2 ? 'left-0 opacity-100' : 'left-0 opacity-0'}`} />
                </div>
                <span className="text-[8px] font-bold text-slate-400 uppercase mt-2 tracking-widest">PCIe Bus</span>
             </div>

             {/* GPU Box */}
             <div className="flex flex-col items-center w-1/3">
               <div className="bg-white border-2 border-amber-400 rounded-xl p-4 w-full aspect-square flex flex-col items-center justify-center shadow-inner relative">
                  <span className="absolute top-2 left-2 text-[10px] font-bold text-amber-400 uppercase">Video RAM</span>
                  <Zap className="text-amber-200 mb-2" size={32} />
                  {/* The Tensor */}
                  <div className={`grid grid-cols-2 gap-1 p-1 bg-amber-100 border border-amber-300 rounded transition-all duration-700 absolute ${step === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                    {[1,1,1,1].map((v, i) => <div key={i} className="w-4 h-4 bg-white text-amber-800 flex items-center justify-center font-mono text-[8px] font-bold">{v}</div>)}
                  </div>
               </div>
               <span className="font-bold text-xs text-amber-800 uppercase mt-3">GPU</span>
             </div>

           </div>
           
           <p className="absolute bottom-4 text-[10px] text-slate-500 font-mono font-bold bg-white px-3 py-1 rounded shadow-sm border">
             {step === 0 ? "cpu_tensor" : step === 1 ? "moved_tensor = cpu_tensor.to('cuda')" : "back_to_cpu = moved_tensor.to('cpu')"}
           </p>

        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[350px] text-emerald-100">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[150px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

function RulesSlide() {
  const pyCode = `# Example of error (assuming device='cuda')
cpu_a = torch.randn(2, 2)
gpu_b = torch.randn(2, 2, device='cuda')

try:
    # This will fail because tensors are on different devices
    c = cpu_a + gpu_b
except RuntimeError as e:
    print(f"Error: {e}")`;

  const outCode = `Error: Expected all tensors to be on the same device, but found at least two devices, cuda:0 and cpu!`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4 text-rose-600">Consistency & Rules</h3>
        
        <div className="space-y-4 mb-6">
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-rose-800 text-sm mb-2 flex items-center gap-2"><AlertTriangle size={16}/> Device Consistency</h4>
            <p className="text-xs text-rose-700 leading-relaxed">
              Operations involving multiple tensors (like addition or matrix multiplication) require <strong>all participating tensors to be on the same device</strong>. Mixing CPU and GPU tensors yields a <code>RuntimeError</code>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2"><ArrowRightLeft size={16}/> Data Transfer Overhead</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Moving data between CPU and GPU takes time. To avoid bottlenecks, perform as many operations as possible on the GPU before moving results back to the CPU (e.g., for saving or NumPy conversion).
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2"><Activity size={16}/> Model Placement</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Neural network models (<code>torch.nn.Module</code>) also need to be moved via <code>model.to(device)</code>. This ensures all the internal weight and bias tensors reside on the GPU.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[250px] text-emerald-100">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-rose-400 max-h-[200px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}