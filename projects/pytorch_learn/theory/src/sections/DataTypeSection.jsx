import React, { useState, useEffect } from 'react';
import { 
  Type, ChevronLeft, ChevronRight, Code, Terminal, 
  CheckCircle2, Pointer, AlertTriangle, ArrowRight, ArrowUpCircle, Zap
} from 'lucide-react';

export default function DataTypesSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'intro', title: 'Understanding dtype', component: UnderstandingDtypeSlide },
    { id: 'common', title: 'Common Data Types', component: CommonTypesSlide },
    { id: 'casting', title: 'Type Casting', component: TypeCastingSlide },
    { id: 'promotion', title: 'Type Promotion', component: TypePromotionSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Type size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Tensor Data Types (dtype)</h2>
        <p className="text-slate-400 text-sm mb-4">Managing precision, memory, and type promotion</p>
        
        <div className="flex gap-2 mb-2">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-teal-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-teal-400' : ''}>
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
            className="px-5 py-2.5 rounded-xl bg-teal-600 text-white disabled:opacity-50 font-semibold transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function UnderstandingDtypeSlide() {
  const [view, setView] = useState('float'); 

  const pyCode = {
    'float': `import torch\n\n# Default float tensor\na = torch.tensor([1.0, 2.0, 3.0])\nprint(f"Tensor a: {a}")\nprint(f"dtype of a: {a.dtype}")`,
    'int': `# Default integer tensor\nb = torch.tensor([1, 2, 3])\nprint(f"\\nTensor b: {b}")\nprint(f"dtype of b: {b.dtype}")`,
    'explicit': `# Create a tensor with 64-bit floats\nc = torch.tensor([1.0, 2.0], dtype=torch.float64)\nprint(f"\\nTensor c: {c}")\nprint(f"dtype of c: {c.dtype}")\n\n# Create a tensor with 32-bit integers\nd = torch.ones(2, 2, dtype=torch.int32)\nprint(f"\\nTensor d:\\n{d}")\nprint(f"dtype of d: {d.dtype}")`
  };

  const outCode = {
    'float': `Tensor a: tensor([1., 2., 3.])\ndtype of a: torch.float32`,
    'int': `Tensor b: tensor([1, 2, 3])\ndtype of b: torch.int64`,
    'explicit': `Tensor c: tensor([1., 2.], dtype=torch.float64)\ndtype of c: torch.float64\n\nTensor d:\ntensor([[1, 1],\n        [1, 1]], dtype=torch.int32)\ndtype of d: torch.int32`
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Understanding dtype</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Every tensor has a <code>dtype</code> attribute that dictates the kind of numerical values it holds and how much memory each element occupies. 
          By default, PyTorch uses <strong>float32</strong> for decimals and <strong>int64</strong> for integers.
        </p>

        <div className="space-y-3 mb-6">
          <button onClick={() => setView('float')} className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'float' ? 'border-teal-500 bg-teal-50 text-teal-900 font-bold' : 'border-slate-200 text-slate-600'}`}>
            <span>Default Float Array <code>[1.0, 2.0]</code></span>
            {view === 'float' && <CheckCircle2 size={16} className="text-teal-500" />}
          </button>
          <button onClick={() => setView('int')} className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'int' ? 'border-teal-500 bg-teal-50 text-teal-900 font-bold' : 'border-slate-200 text-slate-600'}`}>
            <span>Default Int Array <code>[1, 2]</code></span>
            {view === 'int' && <CheckCircle2 size={16} className="text-teal-500" />}
          </button>
          <button onClick={() => setView('explicit')} className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'explicit' ? 'border-teal-500 bg-teal-50 text-teal-900 font-bold' : 'border-slate-200 text-slate-600'}`}>
            <span>Explicit <code>dtype=torch.float64</code></span>
            {view === 'explicit' && <CheckCircle2 size={16} className="text-teal-500" />}
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center flex-1 min-h-[160px] relative overflow-hidden">
           {view === 'float' && (
             <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                <span className="text-[10px] font-bold text-teal-600 mb-2 uppercase tracking-widest bg-teal-100 px-2 py-1 rounded">Detected: Decimals</span>
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-white border-2 border-teal-400 rounded-lg flex items-center justify-center font-mono font-bold text-teal-800 shadow-sm">1.0</div>
                  <div className="w-12 h-12 bg-white border-2 border-teal-400 rounded-lg flex items-center justify-center font-mono font-bold text-teal-800 shadow-sm">2.0</div>
                  <div className="w-12 h-12 bg-white border-2 border-teal-400 rounded-lg flex items-center justify-center font-mono font-bold text-teal-800 shadow-sm">3.0</div>
                </div>
                <div className="mt-4 font-mono text-sm font-bold text-teal-700 bg-teal-100/50 px-4 py-2 rounded-full">dtype: torch.float32</div>
             </div>
           )}
           {view === 'int' && (
             <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                <span className="text-[10px] font-bold text-indigo-600 mb-2 uppercase tracking-widest bg-indigo-100 px-2 py-1 rounded">Detected: Integers</span>
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-white border-2 border-indigo-400 rounded-lg flex items-center justify-center font-mono font-bold text-indigo-800 shadow-sm">1</div>
                  <div className="w-12 h-12 bg-white border-2 border-indigo-400 rounded-lg flex items-center justify-center font-mono font-bold text-indigo-800 shadow-sm">2</div>
                  <div className="w-12 h-12 bg-white border-2 border-indigo-400 rounded-lg flex items-center justify-center font-mono font-bold text-indigo-800 shadow-sm">3</div>
                </div>
                <div className="mt-4 font-mono text-sm font-bold text-indigo-700 bg-indigo-100/50 px-4 py-2 rounded-full">dtype: torch.int64</div>
             </div>
           )}
           {view === 'explicit' && (
             <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                <span className="text-[10px] font-bold text-purple-600 mb-2 uppercase tracking-widest bg-purple-100 px-2 py-1 rounded">Explicit Override</span>
                <div className="flex gap-2">
                  <div className="w-16 h-12 bg-white border-2 border-purple-400 rounded-lg flex items-center justify-center font-mono font-bold text-purple-800 shadow-sm">1.000...</div>
                  <div className="w-16 h-12 bg-white border-2 border-purple-400 rounded-lg flex items-center justify-center font-mono font-bold text-purple-800 shadow-sm">2.000...</div>
                </div>
                <div className="mt-4 font-mono text-sm font-bold text-purple-700 bg-purple-100/50 px-4 py-2 rounded-full">dtype: torch.float64</div>
             </div>
           )}
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode[view]}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[200px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode[view]}</pre>
        </div>
      </div>
    </div>
  );
}

function CommonTypesSlide() {
  const [activeType, setActiveType] = useState('float32');

  const typesInfo = {
    'float32': { name: 'torch.float32', alias: 'torch.float', desc: 'Standard 32-bit single-precision floating-point.', use: 'The most common type for model parameters and general computations. Perfect balance of precision and performance on CPUs/GPUs.', mem: '32 bits (4 bytes)' },
    'float64': { name: 'torch.float64', alias: 'torch.double', desc: '64-bit double-precision floating-point.', use: 'Offers higher precision but uses twice the memory and can be slower on GPUs. Use only when high numerical accuracy is strictly required.', mem: '64 bits (8 bytes)' },
    'float16': { name: 'torch.float16', alias: 'torch.half', desc: '16-bit half-precision floating-point.', use: 'Uses half the memory. Accelerates computations significantly on modern GPUs via Tensor Cores. Often used in mixed-precision training, though prone to overflow/underflow.', mem: '16 bits (2 bytes)' },
    'bfloat16': { name: 'torch.bfloat16', alias: 'Brain Float', desc: 'Alternative 16-bit format.', use: 'Has a similar range to float32 but less precision. Becoming very popular for training on newer GPUs and TPUs as it maintains stability better than float16.', mem: '16 bits (2 bytes)' },
    'int64': { name: 'torch.int64', alias: 'torch.long', desc: '64-bit signed integer.', use: 'The default integer type. Frequently used for indexing tensors and representing categorical labels or classes in classification tasks.', mem: '64 bits (8 bytes)' },
    'int8': { name: 'torch.int8', alias: 'Byte-sized', desc: '8-bit signed integer.', use: 'Very small memory footprint. Extensively used in model quantization (compressing trained models to run faster on edge devices).', mem: '8 bits (1 byte)' },
    'bool': { name: 'torch.bool', alias: 'Boolean', desc: 'True or False values.', use: 'Essential for logical operations, indexing with boolean masks, and conditional logic.', mem: '1 byte (implementation dependent)' },
  };

  const info = typesInfo[activeType];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Common Data Types</h3>
        <p className="text-slate-600 text-sm">
          Selecting the appropriate data type is crucial for managing computational resources. You must balance memory usage, computational speed, and representable precision.
        </p>
      </div>

      <div className="flex gap-6 flex-1">
        {/* Left Side: Type Selector */}
        <div className="w-1/3 flex flex-col gap-2 overflow-y-auto pr-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Floating Point</div>
          {['float32', 'float64', 'float16', 'bfloat16'].map(t => (
            <button 
              key={t} onClick={() => setActiveType(t)}
              className={`text-left px-4 py-2.5 rounded-lg border transition-all text-sm font-mono ${activeType === t ? 'bg-teal-500 text-white border-teal-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'}`}
            >
              {t}
            </button>
          ))}
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4 mb-1">Integer & Logic</div>
          {['int64', 'int8', 'bool'].map(t => (
            <button 
              key={t} onClick={() => setActiveType(t)}
              className={`text-left px-4 py-2.5 rounded-lg border transition-all text-sm font-mono ${activeType === t ? 'bg-indigo-500 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Right Side: Information Display */}
        <div className="w-2/3 bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col relative overflow-hidden">
          {/* Decorative background element based on type */}
          <div className={`absolute -right-10 -top-10 opacity-5 transform rotate-12 ${info.name.includes('float') ? 'text-teal-900' : 'text-indigo-900'}`}>
             <Zap size={250} />
          </div>

          <div className="relative z-10 animate-in slide-in-from-right-4 duration-300" key={activeType}>
             <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
                <div>
                  <h4 className="text-3xl font-bold font-mono text-slate-800">{info.name}</h4>
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Alias: {info.alias}</span>
                </div>
                <div className={`px-4 py-2 rounded-xl font-mono text-sm font-bold shadow-sm ${info.name.includes('float') ? 'bg-teal-100 text-teal-800 border border-teal-200' : 'bg-indigo-100 text-indigo-800 border border-indigo-200'}`}>
                  {info.mem}
                </div>
             </div>

             <div className="space-y-6">
                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</h5>
                  <p className="text-slate-700 text-lg leading-relaxed">{info.desc}</p>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Common Use Case</h5>
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <p className="text-slate-600 leading-relaxed text-sm">{info.use}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypeCastingSlide() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let t1, t2; setStep(0);
    t1 = setTimeout(() => setStep(1), 1500); // float -> int
    t2 = setTimeout(() => setStep(2), 3500); // int -> bool
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const pyCode = `float_tensor = torch.tensor([1.1, 0.0, 3.8], dtype=torch.float32)\nprint(f"Original: {float_tensor}, dtype: {float_tensor.dtype}")\n\n# 1. Cast to int64 (Truncates decimals!)\nint_tensor = float_tensor.to(torch.int64)\n# OR convenience method: int_tensor = float_tensor.long()\nprint(f"\\nCasted to int: {int_tensor}, dtype: {int_tensor.dtype}")\n\n# 2. Cast to boolean (0 is False, non-zero is True)\nbool_tensor = int_tensor.to(torch.bool)\n# OR convenience method: bool_tensor = int_tensor.bool()\nprint(f"\\nCasted to bool: {bool_tensor}, dtype: {bool_tensor.dtype}")`;
  const outCode = `Original: tensor([1.1000, 0.0000, 3.8000]), dtype: torch.float32\n\nCasted to int: tensor([1, 0, 3]), dtype: torch.int64\n\nCasted to bool: tensor([ True, False,  True]), dtype: torch.bool`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Type Casting with .to()</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Convert tensors from one data type to another using <code>.to(dtype)</code> or convenience methods like <code>.float()</code>, <code>.long()</code>, or <code>.bool()</code>. Casting creates a <strong>new tensor</strong> in memory.
        </p>

        <button 
          onClick={() => setStep(s => (s + 1) % 3)} 
          className="w-full py-2 mb-4 bg-teal-500 text-white rounded-lg text-sm font-bold hover:bg-teal-600 shadow transition-all flex justify-center items-center gap-2"
        >
          {step === 0 ? "Step 1: Original Float32 (Click to Cast to Int)" : step === 1 ? "Step 2: Int64 Truncation (Click to Cast to Bool)" : "Step 3: Boolean Evaluation (Click to Reset)"} <Pointer size={16}/>
        </button>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center flex-1 min-h-[250px] relative overflow-hidden">
           
           <div className="flex flex-col items-center w-full gap-6">
              
              {/* Element 1 */}
              <div className="flex items-center justify-between w-full max-w-xs relative">
                 <div className={`w-16 h-12 flex items-center justify-center font-mono font-bold rounded shadow border transition-all duration-700 ${step === 0 ? 'bg-teal-100 text-teal-800 border-teal-300' : 'bg-slate-100 text-slate-400 border-slate-200 scale-90'}`}>
                    1.1
                 </div>
                 {step >= 1 && <ArrowRight className="text-slate-300 animate-in fade-in" size={20} />}
                 {step >= 1 && (
                   <div className={`w-16 h-12 flex items-center justify-center font-mono font-bold rounded shadow border animate-in slide-in-from-left-4 transition-all duration-700 ${step === 1 ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : 'bg-slate-100 text-slate-400 border-slate-200 scale-90'}`}>
                      1
                      {step === 1 && <span className="absolute -top-4 text-[10px] text-rose-500 font-bold bg-rose-50 px-1 rounded animate-out fade-out slide-out-to-top-4 delay-1000 fill-mode-forwards">-.1 lost!</span>}
                   </div>
                 )}
                 {step >= 2 && <ArrowRight className="text-slate-300 animate-in fade-in" size={20} />}
                 {step >= 2 && (
                   <div className="w-16 h-12 flex items-center justify-center font-mono text-[10px] font-bold rounded shadow border bg-purple-100 text-purple-800 border-purple-300 animate-in slide-in-from-left-4">
                      True
                   </div>
                 )}
              </div>

              {/* Element 2 */}
              <div className="flex items-center justify-between w-full max-w-xs relative">
                 <div className={`w-16 h-12 flex items-center justify-center font-mono font-bold rounded shadow border transition-all duration-700 ${step === 0 ? 'bg-teal-100 text-teal-800 border-teal-300' : 'bg-slate-100 text-slate-400 border-slate-200 scale-90'}`}>
                    0.0
                 </div>
                 {step >= 1 && <ArrowRight className="text-slate-300 animate-in fade-in" size={20} />}
                 {step >= 1 && (
                   <div className={`w-16 h-12 flex items-center justify-center font-mono font-bold rounded shadow border animate-in slide-in-from-left-4 transition-all duration-700 ${step === 1 ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : 'bg-slate-100 text-slate-400 border-slate-200 scale-90'}`}>
                      0
                   </div>
                 )}
                 {step >= 2 && <ArrowRight className="text-slate-300 animate-in fade-in" size={20} />}
                 {step >= 2 && (
                   <div className="w-16 h-12 flex items-center justify-center font-mono text-[10px] font-bold rounded shadow border bg-slate-200 text-slate-500 border-slate-300 animate-in slide-in-from-left-4">
                      False
                   </div>
                 )}
              </div>

              {/* Element 3 */}
              <div className="flex items-center justify-between w-full max-w-xs relative">
                 <div className={`w-16 h-12 flex items-center justify-center font-mono font-bold rounded shadow border transition-all duration-700 ${step === 0 ? 'bg-teal-100 text-teal-800 border-teal-300' : 'bg-slate-100 text-slate-400 border-slate-200 scale-90'}`}>
                    3.8
                 </div>
                 {step >= 1 && <ArrowRight className="text-slate-300 animate-in fade-in" size={20} />}
                 {step >= 1 && (
                   <div className={`w-16 h-12 flex items-center justify-center font-mono font-bold rounded shadow border animate-in slide-in-from-left-4 transition-all duration-700 ${step === 1 ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : 'bg-slate-100 text-slate-400 border-slate-200 scale-90'}`}>
                      3
                      {step === 1 && <span className="absolute -top-4 text-[10px] text-rose-500 font-bold bg-rose-50 px-1 rounded animate-out fade-out slide-out-to-top-4 delay-1000 fill-mode-forwards">-.8 lost!</span>}
                   </div>
                 )}
                 {step >= 2 && <ArrowRight className="text-slate-300 animate-in fade-in" size={20} />}
                 {step >= 2 && (
                   <div className="w-16 h-12 flex items-center justify-center font-mono text-[10px] font-bold rounded shadow border bg-purple-100 text-purple-800 border-purple-300 animate-in slide-in-from-left-4">
                      True
                   </div>
                 )}
              </div>

           </div>
           
           <div className="absolute bottom-2 left-0 right-0 text-center">
             {step === 0 && <span className="text-[10px] font-bold text-teal-600 bg-teal-100 px-2 py-1 rounded">dtype: torch.float32</span>}
             {step === 1 && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">dtype: torch.int64 (Truncated)</span>}
             {step === 2 && <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">dtype: torch.bool (0 is False)</span>}
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[150px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

function TypePromotionSlide() {
  const [view, setView] = useState('int_float');
  const [step, setStep] = useState(0);

  useEffect(() => {
    let t1, t2; setStep(0);
    t1 = setTimeout(() => setStep(1), 1000);
    t2 = setTimeout(() => setStep(2), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [view]);

  const explanations = {
    'int_float': <span>When adding an <code>int32</code> and a <code>float32</code>, PyTorch prevents data loss by automatically "promoting" the integer tensor to a float tensor before calculating.</span>,
    'float_double': <span>When mixing <code>float32</code> and <code>float64</code> (double), the lower precision float32 is promoted to float64 so no accuracy is lost in the result.</span>
  };

  const pyCode = {
    'int_float': `int_t = torch.tensor([1, 2], dtype=torch.int32)\nfloat_t = torch.tensor([0.5, 0.5], dtype=torch.float32)\n\n# PyTorch automatically promotes int32 -> float32\nresult = int_t + float_t\nprint(f"int32 + float32 = {result}")\nprint(f"Result dtype: {result.dtype}")`,
    'float_double': `float_t = torch.tensor([0.5, 0.5], dtype=torch.float32)\ndouble_t = torch.tensor([0.1, 0.1], dtype=torch.float64)\n\n# PyTorch promotes float32 -> float64\nresult = float_t + double_t\nprint(f"float32 + float64 = {result}")\nprint(f"Result dtype: {result.dtype}")`
  };

  const outCode = {
    'int_float': `int32 + float32 = tensor([1.5000, 2.5000])\nResult dtype: torch.float32`,
    'float_double': `float32 + float64 = tensor([0.6000, 0.6000], dtype=torch.float64)\nResult dtype: torch.float64`
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Automatic Type Promotion</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          When performing operations between different data types, PyTorch automatically promotes the types to ensure compatibility and prevent loss of precision.
        </p>

        <div className="space-y-2 mb-4">
          <button onClick={() => setView('int_float')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'int_float' ? 'border-teal-500 bg-teal-50 text-teal-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span>1. int32 + float32</span>{view === 'int_float' && <CheckCircle2 size={16} className="text-teal-500" />}</button>
          <button onClick={() => setView('float_double')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'float_double' ? 'border-teal-500 bg-teal-50 text-teal-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span>2. float32 + float64 (Double)</span>{view === 'float_double' && <CheckCircle2 size={16} className="text-teal-500" />}</button>
        </div>

        <div className="bg-teal-50 border border-teal-200 text-teal-800 text-xs p-3 rounded-lg mb-4 shadow-sm min-h-[60px]">
          {explanations[view]}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-h-[180px] relative overflow-hidden">
          
          <div className="flex items-center justify-center gap-6 w-full">
            
            {/* Tensor A (The one getting promoted) */}
            <div className="flex flex-col items-center gap-2">
               <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${step >= 1 ? 'text-teal-500' : 'text-slate-400'}`}>
                  {step >= 1 ? <span className="flex items-center gap-1"><ArrowUpCircle size={12}/> Promoted</span> : (view === 'int_float' ? 'int32' : 'float32')}
               </span>
               <div className={`grid grid-cols-2 gap-1 p-1 rounded-lg border-2 transition-all duration-700 ${
                 step >= 1 ? 'bg-teal-100 border-teal-400' : (view === 'int_float' ? 'bg-indigo-100 border-indigo-400' : 'bg-blue-100 border-blue-400')
               }`}>
                 <div className={`w-10 h-10 flex items-center justify-center font-mono text-sm font-bold bg-white rounded shadow-sm ${step >= 1 ? 'text-teal-800' : (view === 'int_float' ? 'text-indigo-800' : 'text-blue-800')}`}>
                   {view === 'int_float' ? (step >= 1 ? '1.0' : '1') : '0.5'}
                 </div>
                 <div className={`w-10 h-10 flex items-center justify-center font-mono text-sm font-bold bg-white rounded shadow-sm ${step >= 1 ? 'text-teal-800' : (view === 'int_float' ? 'text-indigo-800' : 'text-blue-800')}`}>
                   {view === 'int_float' ? (step >= 1 ? '2.0' : '2') : '0.5'}
                 </div>
               </div>
            </div>

            <div className="text-2xl font-bold text-slate-300 mb-6">+</div>

            {/* Tensor B (The higher precision one) */}
            <div className="flex flex-col items-center gap-2">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{view === 'int_float' ? 'float32' : 'float64'}</span>
               <div className={`grid grid-cols-2 gap-1 p-1 rounded-lg border-2 transition-colors ${view === 'int_float' ? 'bg-teal-100 border-teal-400' : 'bg-purple-100 border-purple-400'}`}>
                 <div className={`w-10 h-10 flex items-center justify-center font-mono text-sm font-bold bg-white rounded shadow-sm ${view === 'int_float' ? 'text-teal-800' : 'text-purple-800'}`}>
                   {view === 'int_float' ? '0.5' : '0.1'}
                 </div>
                 <div className={`w-10 h-10 flex items-center justify-center font-mono text-sm font-bold bg-white rounded shadow-sm ${view === 'int_float' ? 'text-teal-800' : 'text-purple-800'}`}>
                   {view === 'int_float' ? '0.5' : '0.1'}
                 </div>
               </div>
            </div>

          </div>

          {/* Result */}
          <div className={`mt-6 transition-all duration-700 flex flex-col items-center ${step === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Result: {view === 'int_float' ? 'float32' : 'float64'}</span>
             <div className="grid grid-cols-2 gap-1 p-1 bg-white rounded shadow border border-slate-200">
               <div className={`w-12 h-10 flex items-center justify-center font-mono text-sm font-bold rounded ${view === 'int_float' ? 'bg-teal-500 text-white' : 'bg-purple-500 text-white'}`}>
                 {view === 'int_float' ? '1.5' : '0.6'}
               </div>
               <div className={`w-12 h-10 flex items-center justify-center font-mono text-sm font-bold rounded ${view === 'int_float' ? 'bg-teal-500 text-white' : 'bg-purple-500 text-white'}`}>
                 {view === 'int_float' ? '2.5' : '0.6'}
               </div>
             </div>
          </div>

        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode[view]}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[150px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode[view]}</pre>
        </div>
      </div>
    </div>
  );
}