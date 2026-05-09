import React, { useState } from 'react';
import { Calculator, ChevronLeft, ChevronRight, Code, Terminal } from 'lucide-react';

export default function OperationsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'arithmetic', title: 'Arithmetic & Scalars', component: ArithmeticSlide },
    { id: 'inplace', title: 'In-place Operations', component: InPlaceSlide },
    { id: 'math', title: 'Math Functions', component: MathSlide },
    { id: 'reduction', title: 'Reductions & Dimensions', component: ReductionSlide },
    { id: 'logic', title: 'Logical & Comparison', component: LogicSlide },
  ];

  const handleNext = () => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
  const handlePrev = () => setCurrentSlide((prev) => Math.max(0, prev - 1));

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Integrated Slider Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Calculator size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Basic Tensor Operations</h2>
        <p className="text-slate-400 text-sm mb-4">Arithmetic, Math Functions, Reductions, and Logic</p>
        
        {/* Progress Steps */}
        <div className="flex gap-2">
          {slides.map((slide, idx) => (
            <div 
              key={slide.id} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-indigo-500' : idx < currentSlide ? 'bg-indigo-800' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs mt-2 text-slate-400 font-medium">
          {slides.map((slide, idx) => (
            <span key={slide.id} className={idx === currentSlide ? 'text-indigo-400' : ''}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            <ChevronLeft size={20} /> Previous
          </button>
          
          <div className="text-slate-400 font-medium text-sm">
            Slide {currentSlide + 1} of {slides.length}
          </div>

          <button 
            onClick={handleNext}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Slide 1: Arithmetic & Scalars ---
function ArithmeticSlide() {
  const [op, setOp] = useState('add');

  const outputs = {
    add: `Addition (a + b):\ntensor([[ 6.,  8.],\n        [10., 12.]])`,
    sub: `Subtraction (a - b):\ntensor([[-4., -4.],\n        [-4., -4.]])`,
    mul: `Element-wise Multiplication:\ntensor([[ 5., 12.],\n        [21., 32.]])`,
    div: `Division (a / b):\ntensor([[0.2000, 0.3333],\n        [0.4286, 0.5000]])`,
    pow: `Exponentiation (a ** 2):\ntensor([[ 1.,  4.],\n        [ 9., 16.]])`,
    add_scalar: `t + scalar:\ntensor([[11, 12, 13],\n        [14, 15, 16]])`,
    mul_scalar: `t * scalar:\ntensor([[10, 20, 30],\n        [40, 50, 60]])`,
    sub_scalar: `t - scalar:\ntensor([[-9, -8, -7],\n        [-6, -5, -4]])`
  };

  const isScalar = op.includes('scalar');

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div>
        <h3 className="text-xl font-bold mb-4">Element-wise & Scalar Arithmetic</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Standard arithmetic functions operate <strong>element-wise</strong>. Tensors must have compatible shapes.
          PyTorch also automatically expands a <strong>scalar</strong> to match the tensor's shape.
        </p>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Element-wise (a &amp; b)</span>
            <div className="flex flex-wrap gap-2 mt-2">
              <button onClick={() => setOp('add')} className={`px-2 py-1.5 rounded font-mono text-xs font-bold border-2 ${op === 'add' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>+ add</button>
              <button onClick={() => setOp('sub')} className={`px-2 py-1.5 rounded font-mono text-xs font-bold border-2 ${op === 'sub' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>- sub</button>
              <button onClick={() => setOp('mul')} className={`px-2 py-1.5 rounded font-mono text-xs font-bold border-2 ${op === 'mul' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>* mul</button>
              <button onClick={() => setOp('div')} className={`px-2 py-1.5 rounded font-mono text-xs font-bold border-2 ${op === 'div' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>/ div</button>
              <button onClick={() => setOp('pow')} className={`px-2 py-1.5 rounded font-mono text-xs font-bold border-2 ${op === 'pow' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>** pow</button>
            </div>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Scalar Operations (t &amp; 10)</span>
            <div className="flex flex-wrap gap-2 mt-2">
              <button onClick={() => setOp('add_scalar')} className={`px-2 py-1.5 rounded font-mono text-xs font-bold border-2 ${op === 'add_scalar' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>t + 10</button>
              <button onClick={() => setOp('mul_scalar')} className={`px-2 py-1.5 rounded font-mono text-xs font-bold border-2 ${op === 'mul_scalar' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>t * 10</button>
              <button onClick={() => setOp('sub_scalar')} className={`px-2 py-1.5 rounded font-mono text-xs font-bold border-2 ${op === 'sub_scalar' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>t - 10</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 shadow-inner flex flex-col font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Code size={14} /> <span className="font-semibold uppercase tracking-wider">Python</span>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl text-slate-300 mb-4 flex-1 overflow-x-auto">
<pre>
{isScalar ? (
`t = torch.tensor([[1, 2, 3], [4, 5, 6]])
scalar = 10\n
${op === 'add_scalar' ? 'result = t + scalar' : op === 'mul_scalar' ? 'result = t * scalar' : 'result = t - scalar'}`
) : (
`a = torch.tensor([[1., 2.], [3., 4.]])
b = torch.tensor([[5., 6.], [7., 8.]])\n
${op === 'add' ? '# torch.add(a, b)\nresult = a + b' : 
  op === 'sub' ? '# torch.sub(a, b)\nresult = a - b' : 
  op === 'mul' ? '# torch.mul(a, b)\nresult = a * b' : 
  op === 'div' ? '# torch.div(a, b)\nresult = a / b' : 
  '# torch.pow(a, 2)\nresult = a ** 2'}`
)}
</pre>
        </div>
        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Terminal size={14} /> <span className="font-semibold uppercase tracking-wider">Output</span>
        </div>
        <div className="bg-black/40 p-4 rounded-xl text-emerald-400 overflow-x-auto">
          <pre>{outputs[op]}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: In-Place Operations ---
function InPlaceSlide() {
  const [step, setStep] = useState(0);

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div>
        <h3 className="text-xl font-bold mb-4">In-place Operations</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Functions with a trailing underscore (e.g., <code>add_</code>, <code>mul_</code>) modify the tensor directly without creating a new object. This saves memory but should be used cautiously to preserve Autograd gradients.
        </p>

        <div className="space-y-3">
          <button 
            onClick={() => setStep(0)}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${step === 0 ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-bold' : 'border-slate-200 text-slate-600'}`}
          >
            1. Original Tensor
          </button>
          <button 
            onClick={() => setStep(1)}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${step === 1 ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-bold' : 'border-slate-200 text-slate-600'}`}
          >
            2. a.add_(b)
          </button>
          <button 
            onClick={() => setStep(2)}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${step === 2 ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-bold' : 'border-slate-200 text-slate-600'}`}
          >
            3. a.mul_(2)
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 shadow-inner flex flex-col font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Code size={14} /> <span className="font-semibold uppercase tracking-wider">Python Memory View</span>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl text-slate-300 mb-4 flex-1 overflow-x-auto">
<pre>
{`a = torch.tensor([[1., 2.], [3., 4.]])
b = torch.tensor([[5., 6.], [7., 8.]])`}
{step >= 1 && `\n# Modified directly in memory\na.add_(b)`}
{step >= 2 && `\n\n# Multiplied in memory\na.mul_(2)`}
</pre>
        </div>
        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Terminal size={14} /> <span className="font-semibold uppercase tracking-wider">Output (Tensor 'a')</span>
        </div>
        <div className="bg-black/40 p-4 rounded-xl text-emerald-400 overflow-x-auto">
          {step === 0 && <pre>{`Original tensor 'a':\ntensor([[1., 2.],\n        [3., 4.]])`}</pre>}
          {step === 1 && <pre>{`Tensor 'a' after a.add_(b):\ntensor([[ 6.,  8.],\n        [10., 12.]])`}</pre>}
          {step === 2 && <pre>{`Tensor 'a' after a.mul_(2):\ntensor([[12., 16.],\n        [20., 24.]])`}</pre>}
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Math Functions ---
function MathSlide() {
  const [op, setOp] = useState('sqrt');

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div>
        <h3 className="text-xl font-bold mb-4">Other Mathematical Functions</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          PyTorch provides a rich library of functions that operate element-wise, similar to NumPy's ufuncs.
        </p>

        <div className="grid grid-cols-2 gap-2 mb-6">
          <button onClick={() => setOp('sqrt')} className={`px-3 py-2 rounded-lg font-mono text-xs font-bold border-2 transition-all ${op === 'sqrt' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>torch.sqrt(t)</button>
          <button onClick={() => setOp('exp')} className={`px-3 py-2 rounded-lg font-mono text-xs font-bold border-2 transition-all ${op === 'exp' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>torch.exp(t)</button>
          <button onClick={() => setOp('log')} className={`px-3 py-2 rounded-lg font-mono text-xs font-bold border-2 transition-all ${op === 'log' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>torch.log(t)</button>
          <button onClick={() => setOp('abs')} className={`px-3 py-2 rounded-lg font-mono text-xs font-bold border-2 transition-all ${op === 'abs' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>torch.abs(t)</button>
        </div>
        
        {op === 'log' && (
          <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded-lg border border-amber-200 mb-4">
            <strong>Note:</strong> Ensure values are positive for log! We add a small epsilon (like <code>1e-6</code>) for stability if zeros might exist.
          </div>
        )}
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 shadow-inner flex flex-col font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Code size={14} /> <span className="font-semibold uppercase tracking-wider">Python</span>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl text-slate-300 mb-4 flex-1 overflow-x-auto">
<pre>
{op === 'abs' ? (
`t_neg = torch.tensor([[-1., 2.], [-3., 4.]])\n\n# Absolute value\nresult = torch.abs(t_neg)`
) : op === 'log' ? (
`t = torch.tensor([[1., 4.], [9., 16.]])\n\n# Natural Logarithm\nt_pos = torch.abs(t) + 1e-6 # For stability\nresult = torch.log(t_pos)`
) : op === 'exp' ? (
`t = torch.tensor([[1., 4.], [9., 16.]])\n\n# Exponential (e^x)\nresult = torch.exp(t)`
) : (
`t = torch.tensor([[1., 4.], [9., 16.]])\n\n# Square root\nresult = torch.sqrt(t)`
)}
</pre>
        </div>
        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Terminal size={14} /> <span className="font-semibold uppercase tracking-wider">Output</span>
        </div>
        <div className="bg-black/40 p-4 rounded-xl text-emerald-400 overflow-x-auto">
          {op === 'abs' && <pre>{`tensor([[1., 2.],\n        [3., 4.]])`}</pre>}
          {op === 'log' && <pre>{`tensor([[0.0000, 1.3863],\n        [2.1972, 2.7726]])`}</pre>}
          {op === 'exp' && <pre>{`tensor([[2.7183e+00, 5.4598e+01],\n        [8.1031e+03, 8.8861e+06]])`}</pre>}
          {op === 'sqrt' && <pre>{`tensor([[1., 2.],\n        [3., 4.]])`}</pre>}
        </div>
      </div>
    </div>
  );
}

// --- Slide 4: Reduction & Dims ---
function ReductionSlide() {
  const [op, setOp] = useState('sum');
  const [dim, setDim] = useState('all');

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Reduction Operations</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Reductions reduce the number of elements. Using the <code>dim</code> argument collapses a specific dimension, returning a tensor with one fewer dimension.
        </p>

        <div className="flex flex-col gap-4 mb-4">
          <div className="flex gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase w-20 pt-2">Function:</span>
            <div className="flex gap-2">
              <button onClick={() => setOp('sum')} className={`px-2 py-1 rounded text-xs border ${op === 'sum' ? 'bg-indigo-600 text-white' : 'border-slate-300'}`}>sum()</button>
              <button onClick={() => setOp('mean')} className={`px-2 py-1 rounded text-xs border ${op === 'mean' ? 'bg-indigo-600 text-white' : 'border-slate-300'}`}>mean()</button>
              <button onClick={() => setOp('max')} className={`px-2 py-1 rounded text-xs border ${op === 'max' ? 'bg-indigo-600 text-white' : 'border-slate-300'}`}>max()</button>
              <button onClick={() => setOp('min')} className={`px-2 py-1 rounded text-xs border ${op === 'min' ? 'bg-indigo-600 text-white' : 'border-slate-300'}`}>min()</button>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase w-20 pt-2">Dimension:</span>
            <div className="flex gap-2">
              <button onClick={() => setDim('all')} className={`px-2 py-1 rounded text-xs border ${dim === 'all' ? 'bg-emerald-600 text-white' : 'border-slate-300'}`}>All (Scalar)</button>
              <button onClick={() => setDim('0')} className={`px-2 py-1 rounded text-xs border ${dim === '0' ? 'bg-emerald-600 text-white' : 'border-slate-300'}`}>dim=0 (Cols)</button>
              <button onClick={() => setDim('1')} className={`px-2 py-1 rounded text-xs border ${dim === '1' ? 'bg-emerald-600 text-white' : 'border-slate-300'}`}>dim=1 (Rows)</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 shadow-inner flex flex-col font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Code size={14} /> <span className="font-semibold uppercase tracking-wider">Python</span>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl text-slate-300 mb-4 flex-1 overflow-x-auto">
<pre>
{`t = torch.tensor([[1., 2., 3.], 
                  [4., 5., 6.]])`}
{op === 'mean' && '\n# Requires float tensor for mean\nt = t.float()'}

{dim === 'all' ? (
  `\n# Reduce entire tensor\nresult = torch.${op}(t)`
) : (
  `\n# Collapse dim ${dim}\nresult = torch.${op}(t, dim=${dim})`
)}
</pre>
        </div>
        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Terminal size={14} /> <span className="font-semibold uppercase tracking-wider">Output</span>
        </div>
        <div className="bg-black/40 p-4 rounded-xl text-emerald-400 overflow-x-auto">
          {op === 'sum' && dim === 'all' && <pre>tensor(21.)</pre>}
          {op === 'sum' && dim === '0' && <pre>tensor([5., 7., 9.])</pre>}
          {op === 'sum' && dim === '1' && <pre>tensor([ 6., 15.])</pre>}
          
          {op === 'mean' && dim === 'all' && <pre>tensor(3.5000)</pre>}
          {op === 'mean' && dim === '0' && <pre>tensor([2.5000, 3.5000, 4.5000])</pre>}
          {op === 'mean' && dim === '1' && <pre>tensor([2.0000, 5.0000])</pre>}

          {op === 'max' && dim === 'all' && <pre>tensor(6.)</pre>}
          {op === 'max' && dim === '0' && <pre>values=tensor([4., 5., 6.])</pre>}
          {op === 'max' && dim === '1' && <pre>values=tensor([3., 6.])</pre>}

          {op === 'min' && dim === 'all' && <pre>tensor(1.)</pre>}
          {op === 'min' && dim === '0' && <pre>values=tensor([1., 2., 3.])</pre>}
          {op === 'min' && dim === '1' && <pre>values=tensor([1., 4.])</pre>}
        </div>
      </div>
    </div>
  );
}

// --- Slide 5: Logic ---
function LogicSlide() {
  const [op, setOp] = useState('eq'); 

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div>
        <h3 className="text-xl font-bold mb-4">Logical & Comparison</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Standard comparison operators and logical functions return a boolean tensor (<code>torch.bool</code>). Boolean tensors are extremely useful for masking operations.
        </p>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Comparisons</span>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setOp('eq')} className={`flex-1 py-2 rounded font-mono text-xs border ${op === 'eq' ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200'}`}>a == b</button>
              <button onClick={() => setOp('gt')} className={`flex-1 py-2 rounded font-mono text-xs border ${op === 'gt' ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200'}`}>a &gt; b</button>
              <button onClick={() => setOp('lte')} className={`flex-1 py-2 rounded font-mono text-xs border ${op === 'lte' ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200'}`}>a &lt;= b</button>
            </div>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Logical Operations</span>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setOp('and')} className={`flex-1 py-2 rounded font-mono text-xs border ${op === 'and' ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200'}`}>logical_and</button>
              <button onClick={() => setOp('or')} className={`flex-1 py-2 rounded font-mono text-xs border ${op === 'or' ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200'}`}>logical_or</button>
              <button onClick={() => setOp('not')} className={`flex-1 py-2 rounded font-mono text-xs border ${op === 'not' ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200'}`}>logical_not</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 shadow-inner flex flex-col font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Code size={14} /> <span className="font-semibold uppercase tracking-wider">Python</span>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl text-slate-300 mb-4 flex-1 overflow-x-auto">
          {['and', 'or', 'not'].includes(op) ? (
<pre>
{`bool_a = torch.tensor([[True, False], [True, True]])
bool_b = torch.tensor([[False, True], [True, False]])\n`}
{op === 'and' && `result = torch.logical_and(bool_a, bool_b)`}
{op === 'or' && `result = torch.logical_or(bool_a, bool_b)`}
{op === 'not' && `result = torch.logical_not(bool_a)`}
</pre>
          ) : (
<pre>
{`a = torch.tensor([[1, 2], [3, 4]])
b = torch.tensor([[1, 5], [0, 4]])\n`}
{op === 'eq' && `result = (a == b)`}
{op === 'gt' && `result = (a > b)`}
{op === 'lte' && `result = (a <= b)`}
</pre>
          )}
        </div>

        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Terminal size={14} /> <span className="font-semibold uppercase tracking-wider">Output</span>
        </div>
        <div className="bg-black/40 p-4 rounded-xl text-amber-400 overflow-x-auto">
          {op === 'eq' && <pre>{`tensor([[ True, False],\n        [False,  True]])`}</pre>}
          {op === 'gt' && <pre>{`tensor([[False, False],\n        [ True, False]])`}</pre>}
          {op === 'lte' && <pre>{`tensor([[ True,  True],\n        [False,  True]])`}</pre>}
          
          {op === 'and' && <pre>{`tensor([[False, False],\n        [ True, False]])`}</pre>}
          {op === 'or' && <pre>{`tensor([[ True,  True],\n        [ True,  True]])`}</pre>}
          {op === 'not' && <pre>{`tensor([[False,  True],\n        [False, False]])`}</pre>}
        </div>
      </div>
    </div>
  );
}
