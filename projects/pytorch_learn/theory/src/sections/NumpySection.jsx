import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Cpu, Zap, Database, Network, LineChart, AlertTriangle, Code, Terminal, Activity } from 'lucide-react';

function ArrowLeftRight(props) {
  return <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="m8 3 4 4-4 4"/><path d="M12 7H4"/><path d="m16 21-4-4 4-4"/><path d="M12 17h8"/></svg>;
}

export default function NumpySection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'compare', title: 'Tensors vs NumPy', component: NumpyCompareSlide },
    { id: 'totensor', title: 'NumPy to Tensor', component: NumpyToTensorSlide },
    { id: 'tonumpy', title: 'Tensor to NumPy & GPU', component: TensorToNumpySlide },
    { id: 'workflow', title: 'Leveraging Both Worlds', component: LeveragingWorldsSlide },
  ];

  const handleNext = () => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
  const handlePrev = () => setCurrentSlide((prev) => Math.max(0, prev - 1));

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Integrated Slider Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <ArrowLeftRight size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Relationship with NumPy</h2>
        <p className="text-slate-400 text-sm mb-4">Bridging scientific computing and deep learning</p>
        
        {/* Progress Steps */}
        <div className="flex gap-2">
          {slides.map((slide, idx) => (
            <div 
              key={slide.id} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-emerald-500' : idx < currentSlide ? 'bg-emerald-800' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs mt-2 text-slate-400 font-medium">
          {slides.map((slide, idx) => (
            <span key={slide.id} className={idx === currentSlide ? 'text-emerald-400' : ''}>
              {idx + 1}. {slide.title}
            </span>
          ))}
        </div>
      </div>

      {/* Slide Content Container */}
      <div className="min-h-[450px] flex flex-col">
        <div className="flex-1">
          <CurrentComponent />
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
          <button 
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 font-semibold transition-colors"
          >
            <ChevronLeft size={20} /> Previous
          </button>
          
          <div className="text-slate-400 font-medium text-sm">
            Slide {currentSlide + 1} of {slides.length}
          </div>

          <button 
            onClick={handleNext}
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

// --- Slide 1: Comparison ---
function NumpyCompareSlide() {
  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div>
        <h3 className="text-xl font-bold mb-4">Similar Structures, Different Capabilities</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Both libraries represent dense numerical data in multiple dimensions. PyTorch recognizes NumPy's prevalence and provides excellent interoperability. Many operations have direct equivalents:
        </p>
        <ul className="text-sm text-slate-600 space-y-2 ml-6 list-disc mb-6">
          <li><strong>Creation:</strong> Zeros, ones, random numbers, from lists.</li>
          <li><strong>Math:</strong> Element-wise arithmetic, trig functions, exponentiation.</li>
          <li><strong>Indexing & Slicing:</strong> Accessing sub-arrays uses comparable syntax.</li>
          <li><strong>Shape Manipulation:</strong> Reshaping, transposing, and concatenating.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Cpu size={18} className="text-slate-500" /> Standard NumPy
          </h4>
          <ul className="text-sm text-slate-600 space-y-1 ml-6 list-disc">
            <li>Primarily designed for <strong>CPU computation</strong>.</li>
            <li>No built-in capability for calculating gradients.</li>
            <li>The standard for general scientific operations in Python.</li>
          </ul>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
            <Zap size={18} className="text-emerald-600" /> PyTorch Tensors
          </h4>
          <ul className="text-sm text-emerald-800 space-y-1 ml-6 list-disc">
            <li><strong>GPU Acceleration:</strong> Can be moved to GPUs for massive parallel computation (crucial for deep learning).</li>
            <li><strong>Automatic Differentiation:</strong> Built-in <code>Autograd</code> system tracks operations and computes gradients during backpropagation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: NumPy to Tensor ---
function NumpyToTensorSlide() {
  const [step, setStep] = useState(0);

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">NumPy to PyTorch (Memory Sharing)</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Create a PyTorch Tensor from a NumPy array using <code>torch.from_numpy()</code>.
        </p>
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-6">
          <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-bold text-amber-800 text-sm mb-1">Important Note on Memory Sharing</h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              The resulting Tensor and the original NumPy array share the same underlying memory location on the CPU. Modifying one object will affect the other! This avoids copying data but requires awareness.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <button onClick={() => setStep(0)} className={`w-full text-left px-4 py-2 rounded-lg border text-sm transition-all ${step === 0 ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-50 text-slate-600'}`}>1. Original State</button>
          <button onClick={() => setStep(1)} className={`w-full text-left px-4 py-2 rounded-lg border text-sm transition-all ${step === 1 ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-50 text-slate-600'}`}>2. Modify NumPy Array</button>
          <button onClick={() => setStep(2)} className={`w-full text-left px-4 py-2 rounded-lg border text-sm transition-all ${step === 2 ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-50 text-slate-600'}`}>3. Modify PyTorch Tensor</button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 shadow-inner flex flex-col font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Code size={14} /> <span className="font-semibold uppercase tracking-wider">Memory View</span>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl text-slate-300 mb-4 flex-1 overflow-x-auto">
          <div className="flex justify-between items-center mb-6 px-2">
            <span className="text-emerald-400 font-bold">numpy_array</span>
            <span className="text-slate-500 font-bold tracking-widest text-[10px]">{'<-- SHARED CPU RAM -->'}</span>
            <span className="text-blue-400 font-bold">pytorch_tensor</span>
          </div>
          
          <div className="flex justify-center gap-12 text-sm">
            <div>
              [<span className={step >= 1 ? "text-amber-400 font-bold" : ""}>{step >= 1 ? "99" : " 1"}</span>,  2]<br/>
              [ 3, <span className={step === 2 ? "text-amber-400 font-bold" : ""}>{step === 2 ? "-1" : " 4"}</span>]
            </div>
            <div>
              [<span className={step >= 1 ? "text-amber-400 font-bold" : ""}>{step >= 1 ? "99" : " 1"}</span>,  2]<br/>
              [ 3, <span className={step === 2 ? "text-amber-400 font-bold" : ""}>{step === 2 ? "-1" : " 4"}</span>]
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Terminal size={14} /> <span className="font-semibold uppercase tracking-wider">Python Code & Output</span>
        </div>
        <div className="bg-black/40 p-3 rounded-xl text-emerald-400 overflow-x-auto">
<pre>
{step === 0 && `numpy_array = np.array([[1, 2], [3, 4]], dtype=np.float32)
pytorch_tensor = torch.from_numpy(numpy_array)
> PyTorch Tensor type: torch.float32`}
{step === 1 && `# Modifying numpy_array changes pytorch_tensor too
numpy_array[0, 0] = 99
> PyTorch Tensor after modifying NumPy array:
tensor([[99.,  2.], [ 3.,  4.]])`}
{step === 2 && `# Modifying pytorch_tensor changes numpy_array too
pytorch_tensor[1, 1] = -1
> NumPy array after modifying PyTorch Tensor:
[[99.  2.] [ 3. -1.]]`}
</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Tensor to NumPy ---
function TensorToNumpySlide() {
  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div>
        <h3 className="text-xl font-bold mb-4">Tensor to NumPy & The GPU Catch</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Conversely, convert a CPU Tensor back to NumPy using <code>.numpy()</code>. Again, modifications to one will impact the other.
        </p>
        
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3 mb-6">
          <Activity className="text-rose-500 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-bold text-rose-800 text-sm mb-1">GPU Tensors Cannot Convert Directly</h4>
            <p className="text-xs text-rose-700 leading-relaxed">
              Attempting to call <code>.numpy()</code> directly on a GPU Tensor results in an error. You must move it to the CPU first using <code>.cpu()</code>.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 shadow-inner flex flex-col font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Code size={14} /> <span className="font-semibold uppercase tracking-wider">Python</span>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl text-slate-300 mb-4 flex-1 overflow-x-auto">
<pre>
{`# 1. CPU TENSOR (Bidirectional sharing)
cpu_tensor = torch.tensor([[10., 20.], [30., 40.]])
numpy_arr = cpu_tensor.numpy()
cpu_tensor[0, 1] = 25.0     # Changes numpy_arr too
numpy_arr[1, 0] = 35.0      # Changes cpu_tensor too

# 2. GPU TENSOR
if torch.cuda.is_available():
    gpu_tensor = torch.tensor([1., 2.], device='cuda')
    
    # ❌ ERROR: Can't convert cuda tensor to numpy
    # wrong_arr = gpu_tensor.numpy()

    # ✅ CORRECT: Move to CPU first
    cpu_tensor_from_gpu = gpu_tensor.cpu()
    numpy_from_gpu = cpu_tensor_from_gpu.numpy()
    
    # Note: numpy_from_gpu shares memory with cpu_tensor_from_gpu,
    # but NOT with the original gpu_tensor!`}
</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 4: Leveraging Both Worlds ---
function LeveragingWorldsSlide() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h3 className="text-2xl font-bold mb-4">Leveraging Both Worlds</h3>
        <p className="text-slate-600 leading-relaxed text-sm">
          The ability to easily convert between NumPy arrays and PyTorch Tensors allows you to write highly efficient code that bridges general scientific Python with specialized deep learning capabilities.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative">
        {/* Step 1 */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex-1 w-full text-center relative z-10 shadow-sm">
          <div className="bg-slate-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-slate-600 mb-4">
            <Database size={28} />
          </div>
          <h4 className="font-bold text-slate-800 mb-2">1. Data Loading</h4>
          <p className="text-xs text-slate-500">
            Perform initial data loading and preprocessing using familiar NumPy functions or libraries (like Pandas).
          </p>
          <div className="mt-4 inline-block bg-slate-100 text-slate-600 font-mono text-[10px] px-2 py-1 rounded">np.array()</div>
        </div>

        <ChevronRight size={32} className="text-slate-300 hidden md:block" />
        <div className="h-8 w-1 bg-slate-300 md:hidden"></div>

        {/* Step 2 */}
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 flex-1 w-full text-center relative z-10 shadow-md transform md:scale-105">
          <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-emerald-600 mb-4">
            <Network size={28} />
          </div>
          <h4 className="font-bold text-emerald-900 mb-2">2. Deep Learning</h4>
          <p className="text-xs text-emerald-700">
            Convert to PyTorch Tensors to take advantage of GPU acceleration and automatic differentiation (training).
          </p>
          <div className="mt-4 inline-block bg-emerald-200 text-emerald-800 font-mono text-[10px] px-2 py-1 rounded">torch.from_numpy()</div>
        </div>

        <ChevronRight size={32} className="text-slate-300 hidden md:block" />
        <div className="h-8 w-1 bg-slate-300 md:hidden"></div>

        {/* Step 3 */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex-1 w-full text-center relative z-10 shadow-sm">
          <div className="bg-slate-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-slate-600 mb-4">
            <LineChart size={28} />
          </div>
          <h4 className="font-bold text-slate-800 mb-2">3. Analysis & Viz</h4>
          <p className="text-xs text-slate-500">
            Convert model output Tensors back to NumPy arrays for analysis or visualization (e.g., Matplotlib, Seaborn).
          </p>
          <div className="mt-4 inline-block bg-slate-100 text-slate-600 font-mono text-[10px] px-2 py-1 rounded">tensor.numpy()</div>
        </div>
      </div>
    </div>
  );
}